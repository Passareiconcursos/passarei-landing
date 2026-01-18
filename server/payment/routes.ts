import { Router, Request, Response } from "express";
import {
  createPaymentPreference,
  createVeteranoPreference,
  processPaymentWebhook,
  createVeteranoSubscription,
  getSubscriptionStatus,
  cancelSubscription,
  CREDIT_PACKAGES,
} from "./mercadopago";
import { db } from "../../db";
import { sql } from "drizzle-orm";
import { validateMercadoPagoSignature } from "./webhook-validator";
import { handleManualActivation } from "./manual-activation";

const router = Router();

// Listar pacotes disponíveis
router.get("/packages", (req: Request, res: Response) => {
  res.json({
    success: true,
    packages: CREDIT_PACKAGES,
    veterano: {
      id: "veterano_monthly",
      amount: 49.9,
      label: "Plano Veterano - R$ 49,90/mês",
      benefits: [
        "300 questões personalizadas/mês",
        "2 correções de redação/mês com IA",
        "Todas as apostilas inclusas",
        "Revisão inteligente SM2",
      ],
    },
  });
});

// Criar pagamento para créditos (Pay-per-use)
router.post("/create-payment", async (req: Request, res: Response) => {
  try {
    const { packageId, telegramId, email } = req.body;

    if (!packageId || !telegramId) {
      return res.status(400).json({
        success: false,
        error: "packageId e telegramId são obrigatórios",
      });
    }

    const preference = await createPaymentPreference({
      packageId,
      telegramId,
      email,
    });

    const paymentUrl =
      process.env.NODE_ENV === "production"
        ? preference.initPoint
        : preference.sandboxInitPoint;

    res.json({
      success: true,
      preferenceId: preference.id,
      paymentUrl,
    });
  } catch (error: any) {
    console.error("❌ Erro ao criar pagamento:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Criar pagamento para Plano Veterano (único)
router.post("/create-veterano", async (req: Request, res: Response) => {
  try {
    const { telegramId, email } = req.body;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        error: "telegramId é obrigatório",
      });
    }

    const preference = await createVeteranoPreference({
      telegramId,
      email,
    });

    const paymentUrl =
      process.env.NODE_ENV === "production"
        ? preference.initPoint
        : preference.sandboxInitPoint;

    res.json({
      success: true,
      preferenceId: preference.id,
      paymentUrl,
    });
  } catch (error: any) {
    console.error("❌ Erro ao criar pagamento Veterano:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Webhook do Mercado Pago - ATUALIZADO COM FETCH
router.post("/webhooks/mercadopago", async (req: Request, res: Response) => {
  try {
    console.log("🔔 [Webhook] Notificação recebida do Mercado Pago");
    console.log("📦 [Webhook] Body:", JSON.stringify(req.body, null, 2));

    // 🔐 VALIDAÇÃO DE SEGURANÇA - Verificar assinatura do webhook
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET_PAYMENTS;

    if (secret) {
      const isValid = validateMercadoPagoSignature(req, secret);

      if (!isValid) {
        console.error("🚨 [Webhook] WEBHOOK FALSO DETECTADO - Assinatura inválida!");
        console.error("🚨 [Webhook] IP:", req.ip);
        return res.status(401).json({
          success: false,
          error: "Assinatura inválida",
        });
      }

      console.log("✅ [Webhook] Assinatura validada com sucesso");
    } else {
      console.warn("⚠️ [Webhook] WEBHOOK_SECRET não configurado - VALIDAÇÃO DESABILITADA");
    }

    const { type, data } = req.body;

    // Processar pagamento
    if (type === "payment") {
      const paymentId = data?.id;

      if (!paymentId) {
        return res
          .status(200)
          .json({ success: true, message: "ID não fornecido" });
      }

      console.log(`💳 [Webhook] Processando pagamento: ${paymentId}`);

      // Buscar dados do pagamento via API
      const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

      if (!MP_ACCESS_TOKEN) {
        console.error("❌ [Webhook] MERCADOPAGO_ACCESS_TOKEN não configurado");
        return res
          .status(200)
          .json({ success: false, error: "Token MP não configurado" });
      }

      const mpResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          },
        },
      );

      if (!mpResponse.ok) {
        const errorText = await mpResponse.text();
        console.error(
          `❌ [Webhook] Erro ao buscar pagamento: ${mpResponse.status}`,
        );
        console.error(`❌ [Webhook] Resposta: ${errorText}`);
        return res.status(200).json({
          success: false,
          error: `MP API retornou ${mpResponse.status}`,
        });
      }

      const paymentData = await mpResponse.json();

      console.log(`📊 [Webhook] Status: ${paymentData.status}`);
      console.log(`💰 [Webhook] Valor: R$ ${paymentData.transaction_amount}`);

      // Processar apenas se aprovado
      if (paymentData.status === "approved") {
        console.log("✅ [Webhook] Pagamento aprovado! Ativando usuário...");

        // Extrair email do external_reference (enviado pelo frontend)
        const externalRef = paymentData.external_reference || "";
        const [telegramId, packageId, userEmail] = externalRef.split("|");

        const email = userEmail || paymentData.payer?.email;
        const amount = paymentData.transaction_amount || 0;

        console.log(`📧 [Webhook] Email extraído: ${email} (do frontend)`);

        if (!email) {
          console.error("❌ [Webhook] Email não encontrado");
          return res
            .status(200)
            .json({ success: false, error: "Email não encontrado" });
        }

        // Determinar plano baseado no valor
        let plan: "calouro" | "veterano" = "calouro";
        if (amount >= 40 && amount <= 50) {
          plan = "veterano";
        } else if (amount >= 500 && amount <= 550) {
          plan = "veterano";
        }

        console.log(`📦 [Webhook] Plano: ${plan}`);

        // Verificar se usuário já existe
        const existingUser = await db.execute(sql`
          SELECT id FROM "User" WHERE email = ${email} LIMIT 1
        `);

        let userId: string;

        if (existingUser && existingUser.length > 0) {
          // Atualizar usuário existente
          userId = existingUser[0].id;
          console.log(`🔄 [Webhook] Atualizando usuário: ${userId}`);

          await db.execute(sql`
            UPDATE "User"
            SET 
              plan = ${plan},
              "planStatus" = 'active',
              "planStartDate" = NOW(),
              "planEndDate" = NOW() + INTERVAL '1 month',
              "updatedAt" = NOW()
            WHERE id = ${userId}
          `);
        } else {
          // Criar novo usuário
          console.log(`➕ [Webhook] Criando novo usuário`);
          userId = `mp_${paymentId}_${Date.now()}`;

          await db.execute(sql`
            INSERT INTO "User" (
              id, email, name, phone, plan, "planStatus",
              "planStartDate", "planEndDate", "examType", state,
              "isActive", "createdAt", "updatedAt"
            ) VALUES (
              ${userId}, ${email}, 
              ${paymentData.payer?.first_name || "Usuário"},
              ${paymentData.payer?.phone?.number || null},
              ${plan}, 'active', NOW(), NOW() + INTERVAL '1 month',
              'OUTRO', 'SP', true, NOW(), NOW()
            )
          `);
        }

        // Importar funções de ativação
        const { createActivationCode } = await import("../activation/codes");
        const { sendWelcomeEmail } = await import("../email/send-welcome");

        // Gerar código de ativação
        console.log(`🔑 [Webhook] Gerando código de ativação`);
        const activationCode = await createActivationCode(userId);

        // Enviar email de boas-vindas
        console.log(`📧 [Webhook] Enviando email de boas-vindas`);
        try {
          await sendWelcomeEmail({
            userEmail: email,
            userName: paymentData.payer?.first_name || email,
            plan,
            activationCode,
            paymentId: paymentId.toString(),
          });
          console.log("✅ [Webhook] Email enviado com sucesso");
        } catch (emailError) {
          console.error(
            "⚠️ [Webhook] Erro ao enviar email (não crítico):",
            emailError,
          );
        }

        console.log("✅ [Webhook] Usuário ativado com sucesso!");
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Código: ${activationCode}`);
        console.log(`📦 Plano: ${plan}`);

        return res.status(200).json({
          success: true,
          message: "Pagamento processado",
          activationCode,
        });
      } else {
        console.log(
          `⏳ [Webhook] Pagamento ainda não aprovado: ${paymentData.status}`,
        );
        return res.status(200).json({
          success: true,
          message: "Pagamento recebido mas não aprovado",
        });
      }
    }

    // Assinatura (Veterano)
    if (type === "subscription_preapproval") {
      console.log("📅 [Webhook] Processando assinatura");
      // TODO: Implementar lógica de assinatura se necessário
    }

    return res
      .status(200)
      .json({ success: true, message: "Notificação recebida" });
  } catch (error: any) {
    console.error("❌ [Webhook] Erro:", error);
    return res.status(200).json({ success: false, error: error.message });
  }
});

// Verificar status de pagamento
router.get("/status/:paymentId", async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const result = await processPaymentWebhook(paymentId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============================================
// ASSINATURAS (PLANO VETERANO RECORRENTE)
// ============================================

// Criar assinatura do Plano Veterano
router.post("/create-subscription", async (req: Request, res: Response) => {
  try {
    const { telegramId, email } = req.body;

    if (!telegramId || !email) {
      return res.status(400).json({
        success: false,
        error: "telegramId e email são obrigatórios",
      });
    }

    const subscription = await createVeteranoSubscription({
      telegramId,
      email,
    });

    res.json({
      success: true,
      subscriptionId: subscription.subscriptionId,
      paymentUrl: subscription.initPoint,
    });
  } catch (error: any) {
    console.error("❌ Erro ao criar assinatura:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Verificar status da assinatura
router.get(
  "/subscription/:subscriptionId",
  async (req: Request, res: Response) => {
    try {
      const { subscriptionId } = req.params;
      const status = await getSubscriptionStatus(subscriptionId);
      res.json({ success: true, ...status });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
);

// Cancelar assinatura
router.post(
  "/subscription/:subscriptionId/cancel",
  async (req: Request, res: Response) => {
    try {
      const { subscriptionId } = req.params;
      const result = await cancelSubscription(subscriptionId);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
);

// Webhook para assinaturas
router.post("/webhooks/subscription", async (req: Request, res: Response) => {
  try {
    console.log("🔔 [Webhook Subscription] Notificação recebida");

    // 🔐 VALIDAÇÃO DE SEGURANÇA - Verificar assinatura do webhook
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET_SUBSCRIPTIONS;

    if (secret) {
      const isValid = validateMercadoPagoSignature(req, secret);

      if (!isValid) {
        console.error("🚨 [Webhook Subscription] WEBHOOK FALSO DETECTADO!");
        return res.status(401).json({
          success: false,
          error: "Assinatura inválida",
        });
      }

      console.log("✅ [Webhook Subscription] Assinatura validada");
    } else {
      console.warn("⚠️ [Webhook Subscription] SECRET não configurado");
    }

    const { type, data } = req.body;

    console.log("📩 Webhook de assinatura:", type, data);

    if (type === "subscription_preapproval") {
      const subscriptionId = data?.id;

      if (subscriptionId) {
        const subscription = await getSubscriptionStatus(
          String(subscriptionId),
        );

        if (subscription.status === "authorized") {
          const externalRef = subscription.external_reference || "";
          const [telegramId] = externalRef.split("|");

          await db.execute(sql`
            UPDATE "User" 
            SET "plan" = 'VETERANO',
                "planExpiresAt" = NOW() + INTERVAL '30 days',
                "updatedAt" = NOW()
            WHERE "telegramId" = ${telegramId}
          `);

          console.log(`✅ Assinatura Veterano ativada para ${telegramId}`);
        }
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Erro no webhook de assinatura:", error);
    res.status(500).send("Error");
  }
});

// ============================================
// ATIVAÇÃO MANUAL (Para quando webhook não funciona)
// ============================================

router.post("/manual-activation", handleManualActivation);

export default router;

// ============================================
// PROCESSAR PAGAMENTO DO BRICK
// ============================================

router.post("/process-brick", async (req: Request, res: Response) => {
  try {
    const {
      token,
      payment_method_id,
      installments,
      telegramId,
      packageId,
      payer,
    } = req.body;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        error: "Dados de pagamento incompletos",
      });
    }

    // Encontrar valor do pacote
    const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
    const amount = pkg ? pkg.amount : packageId === "veterano" ? 49.9 : 5;

    // Processar pagamento via API do Mercado Pago
    console.log(
      "🔑 Token MP:",
      process.env.MERCADOPAGO_ACCESS_TOKEN?.substring(0, 20),
    );
    console.log("💳 Chamando MP API...");

    const payloadMP = {
      token,
      transaction_amount: amount,
      installments: installments || 1,
      payment_method_id,
      payer: {
        email: payer?.email || "suporte@passarei.com.br",
        identification: payer?.identification || {
          type: "CPF",
          number: "12345678909",
        },
      },
      external_reference: `${telegramId}|${packageId}|${payer?.email || ""}|${Date.now()}`,
    };

    console.log(
      "📦 Payload enviado ao MP:",
      JSON.stringify(payloadMP, null, 2),
    );

    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": `${telegramId}-${Date.now()}`,
      },
      body: JSON.stringify(payloadMP),
    });

    const paymentData = await response.json();
    console.log(
      "📩 Resposta COMPLETA do MP:",
      JSON.stringify(paymentData, null, 2),
    );
    console.log("📊 Status:", paymentData.status);
    console.log("❌ Erro MP:", paymentData.message, paymentData.cause);
    console.log(
      "📩 Resposta do pagamento:",
      paymentData.status,
      paymentData.id,
    );

    if (paymentData.status === "approved") {
      // Atualizar usuário no banco
      if (packageId === "veterano") {
        await db.execute(sql`
          UPDATE "User" 
          SET "plan" = 'VETERANO',
              "planExpiresAt" = NOW() + INTERVAL '30 days',
              "updatedAt" = NOW()
          WHERE "telegramId" = ${telegramId}
        `);
        console.log(`✅ Plano Veterano ativado para ${telegramId}`);
      } else {
        const credits = amount;
        await db.execute(sql`
          UPDATE "User" 
          SET "credits" = COALESCE("credits", 0) + ${credits},
              "updatedAt" = NOW()
          WHERE "telegramId" = ${telegramId}
        `);
        console.log(`✅ ${credits} créditos adicionados para ${telegramId}`);
      }

      return res.json({
        success: true,
        status: "approved",
        paymentId: paymentData.id,
      });
    } else if (
      paymentData.status === "pending" ||
      paymentData.status === "in_process"
    ) {
      return res.json({
        success: true,
        status: "pending",
        paymentId: paymentData.id,
        message: "Pagamento em processamento",
      });
    } else {
      return res.json({
        success: false,
        status: paymentData.status,
        error: paymentData.message || "Pagamento não aprovado",
      });
    }
  } catch (error: any) {
    console.error("❌ Erro ao processar pagamento:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
