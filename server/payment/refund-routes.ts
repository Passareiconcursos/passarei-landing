import { Router, Request, Response } from "express";
import { db } from "../../db";
import { sql, desc } from "drizzle-orm";
import { refunds, transactions } from "../../db/schema";
import { requireAuth } from "../middleware-supabase";

const router = Router();

// ============================================
// ROTAS DE TRANSAÇÕES (Admin)
// ============================================

// Listar transações recentes
router.get("/transactions", requireAuth, async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "20", status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Buscar transações com informações de usuário
    const transactionsList = await db.execute(sql`
      SELECT
        t.id,
        t.mp_payment_id,
        t.telegram_id,
        t.payer_email,
        t.package_id,
        t.amount,
        t.status,
        t.status_detail,
        t.payment_method_id,
        t.payment_type_id,
        t.installments,
        t.mp_date_created,
        t.mp_date_approved,
        t.created_at,
        u."name" as user_name,
        u."plan" as user_plan,
        r.id as refund_id,
        r.status as refund_status,
        r.amount as refund_amount
      FROM transactions t
      LEFT JOIN "User" u ON t.telegram_id = u."telegramId"
      LEFT JOIN refunds r ON r.mp_payment_id = t.mp_payment_id
      ${status ? sql`WHERE t.status = ${status}` : sql``}
      ORDER BY t.created_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `);

    // Contar total
    const countResult = await db.execute(sql`
      SELECT COUNT(*) as total FROM transactions
      ${status ? sql`WHERE status = ${status}` : sql``}
    `);
    const total = parseInt((countResult[0] as any)?.total || "0");

    // Calcular métricas
    const metricsResult = await db.execute(sql`
      SELECT
        COALESCE(SUM(CASE WHEN status = 'APPROVED' THEN amount ELSE 0 END), 0) as total_approved,
        COUNT(CASE WHEN status = 'APPROVED' THEN 1 END) as count_approved,
        COALESCE(SUM(CASE WHEN status = 'PENDING' OR status = 'IN_PROCESS' THEN amount ELSE 0 END), 0) as total_pending,
        COUNT(CASE WHEN status = 'PENDING' OR status = 'IN_PROCESS' THEN 1 END) as count_pending
      FROM transactions
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `);

    return res.json({
      success: true,
      transactions: transactionsList,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      metrics: metricsResult[0] || {},
    });
  } catch (error: any) {
    console.error("❌ Erro ao listar transações:", error);
    return res.status(500).json({
      success: false,
      error: "Erro ao carregar transações",
    });
  }
});

// ============================================
// ROTAS DE ESTORNO (Admin)
// ============================================

// Listar estornos
router.get("/refunds", requireAuth, async (req: Request, res: Response) => {
  try {
    const refundsList = await db.execute(sql`
      SELECT
        r.*,
        t.payer_email,
        t.package_id,
        a."name" as processed_by_name
      FROM refunds r
      LEFT JOIN transactions t ON r.mp_payment_id = t.mp_payment_id
      LEFT JOIN "Admin" a ON r.processed_by = a.id
      ORDER BY r.created_at DESC
      LIMIT 100
    `);

    // Métricas de estorno
    const metricsResult = await db.execute(sql`
      SELECT
        COALESCE(SUM(CASE WHEN status = 'APPROVED' THEN amount ELSE 0 END), 0) as total_refunded,
        COUNT(CASE WHEN status = 'APPROVED' THEN 1 END) as count_approved,
        COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as count_pending
      FROM refunds
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `);

    return res.json({
      success: true,
      refunds: refundsList,
      metrics: metricsResult[0] || {},
    });
  } catch (error: any) {
    console.error("❌ Erro ao listar estornos:", error);
    return res.status(500).json({
      success: false,
      error: "Erro ao carregar estornos",
    });
  }
});

// Criar estorno
router.post("/refunds", requireAuth, async (req: Request, res: Response) => {
  try {
    const { mpPaymentId, amount, reason, notes } = req.body;
    const admin = (req as any).admin;

    if (!mpPaymentId || !reason) {
      return res.status(400).json({
        success: false,
        error: "ID do pagamento e motivo são obrigatórios",
      });
    }

    // Buscar transação original
    const transactionResult = await db.execute(sql`
      SELECT * FROM transactions WHERE mp_payment_id = ${mpPaymentId} LIMIT 1
    `);

    if (!transactionResult || transactionResult.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Transação não encontrada",
      });
    }

    const transaction = transactionResult[0] as any;

    // Verificar se já existe estorno
    const existingRefund = await db.execute(sql`
      SELECT id FROM refunds WHERE mp_payment_id = ${mpPaymentId} LIMIT 1
    `);

    if (existingRefund && existingRefund.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Já existe um estorno para esta transação",
      });
    }

    // Calcular valor do estorno (total ou parcial)
    const refundAmount = amount || transaction.amount;

    // Chamar API do Mercado Pago
    const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!MP_ACCESS_TOKEN) {
      return res.status(500).json({
        success: false,
        error: "Token do Mercado Pago não configurado",
      });
    }

    console.log(`💰 Processando estorno de R$ ${refundAmount} para pagamento ${mpPaymentId}`);

    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${mpPaymentId}/refunds`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: refundAmount,
        }),
      }
    );

    const mpResult = await mpResponse.json();

    console.log("📩 Resposta MP:", JSON.stringify(mpResult, null, 2));

    // Determinar status do estorno
    let refundStatus = "PENDING";
    if (mpResult.status === "approved" || mpResult.id) {
      refundStatus = "APPROVED";
    } else if (mpResult.error || mpResult.status === "rejected") {
      refundStatus = "REJECTED";
    }

    // Registrar estorno no banco
    const refundResult = await db.execute(sql`
      INSERT INTO refunds (
        transaction_id, mp_payment_id, mp_refund_id, user_id, telegram_id,
        amount, reason, status, processed_by, processed_at, mp_response, notes,
        created_at, updated_at
      ) VALUES (
        ${transaction.id},
        ${mpPaymentId},
        ${mpResult.id?.toString() || null},
        ${transaction.user_id || null},
        ${transaction.telegram_id || null},
        ${refundAmount},
        ${reason},
        ${refundStatus},
        ${admin.id},
        NOW(),
        ${JSON.stringify(mpResult)},
        ${notes || null},
        NOW(),
        NOW()
      )
      RETURNING *
    `);

    // Se estorno aprovado, desativar plano do usuário
    if (refundStatus === "APPROVED" && transaction.telegram_id) {
      await db.execute(sql`
        UPDATE "User"
        SET
          plan = 'FREE',
          "planStatus" = 'canceled',
          "updatedAt" = NOW()
        WHERE "telegramId" = ${transaction.telegram_id}
      `);
      console.log(`✅ Plano cancelado para ${transaction.telegram_id}`);
    }

    return res.json({
      success: true,
      refund: refundResult[0],
      message: refundStatus === "APPROVED"
        ? "Estorno processado com sucesso"
        : "Estorno registrado, aguardando processamento",
    });
  } catch (error: any) {
    console.error("❌ Erro ao processar estorno:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Erro ao processar estorno",
    });
  }
});

// ============================================
// MÉTRICAS FINANCEIRAS
// ============================================

router.get("/metrics", requireAuth, async (req: Request, res: Response) => {
  try {
    // MRR (estimado com base nos planos ativos)
    const mrrResult = await db.execute(sql`
      SELECT
        COUNT(CASE WHEN plan = 'CALOURO' THEN 1 END) as calouro_count,
        COUNT(CASE WHEN plan = 'VETERANO' THEN 1 END) as veterano_count
      FROM "User"
      WHERE "planStatus" = 'active'
    `);

    const counts = mrrResult[0] as any;
    const calouros = parseInt(counts?.calouro_count || "0");
    const veteranos = parseInt(counts?.veterano_count || "0");
    const mrr = (calouros * 89.90) + (veteranos * 44.90);

    // Transações do mês
    const monthTransactions = await db.execute(sql`
      SELECT
        COALESCE(SUM(CASE WHEN status = 'APPROVED' THEN amount ELSE 0 END), 0) as revenue,
        COUNT(CASE WHEN status = 'APPROVED' THEN 1 END) as count
      FROM transactions
      WHERE created_at >= DATE_TRUNC('month', NOW())
    `);

    // Estornos do mês
    const monthRefunds = await db.execute(sql`
      SELECT
        COALESCE(SUM(amount), 0) as total,
        COUNT(*) as count
      FROM refunds
      WHERE status = 'APPROVED'
        AND created_at >= DATE_TRUNC('month', NOW())
    `);

    return res.json({
      success: true,
      metrics: {
        mrr,
        subscribers: {
          calouro: calouros,
          veterano: veteranos,
          total: calouros + veteranos,
        },
        monthRevenue: parseFloat((monthTransactions[0] as any)?.revenue || "0"),
        monthTransactions: parseInt((monthTransactions[0] as any)?.count || "0"),
        monthRefunds: parseFloat((monthRefunds[0] as any)?.total || "0"),
        monthRefundCount: parseInt((monthRefunds[0] as any)?.count || "0"),
      },
    });
  } catch (error: any) {
    console.error("❌ Erro ao buscar métricas:", error);
    return res.status(500).json({
      success: false,
      error: "Erro ao carregar métricas",
    });
  }
});

export default router;
