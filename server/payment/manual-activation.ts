// server/payment/manual-activation.ts
// 🔧 Script para ativar usuário manualmente quando webhook não funciona

import { db } from "../../db";
import { sql } from "drizzle-orm";

/**
 * Ativa usuário manualmente usando ID do pagamento
 * Útil quando webhook do MP não chama (ex: credenciais TEST)
 *
 * @param paymentId - ID do pagamento do Mercado Pago
 * @param email - Email do usuário
 * @param plan - Plano (calouro ou veterano)
 */
export async function manualActivation(
  paymentId: string,
  email: string,
  plan: "calouro" | "veterano"
) {
  try {
    console.log(`🔧 [Manual] Ativando usuário manualmente`);
    console.log(`🔧 [Manual] Payment ID: ${paymentId}`);
    console.log(`🔧 [Manual] Email: ${email}`);
    console.log(`🔧 [Manual] Plano: ${plan}`);

    // Verificar se usuário já existe
    const existingUser = await db.execute(sql`
      SELECT id, email, "activationCode"
      FROM "User"
      WHERE email = ${email}
      LIMIT 1
    `);

    let userId: string;
    let activationCode: string;

    if (existingUser && existingUser.length > 0) {
      // Usuário existe - atualizar
      userId = existingUser[0].id;
      activationCode = existingUser[0].activationCode || "";

      console.log(`🔄 [Manual] Usuário encontrado: ${userId}`);

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

      console.log(`✅ [Manual] Usuário atualizado`);
    } else {
      // Criar novo usuário
      userId = `mp_${paymentId}_${Date.now()}`;

      // Gerar código de ativação
      const { createActivationCode } = await import("../activation/codes");
      activationCode = await createActivationCode(userId);

      console.log(`➕ [Manual] Criando novo usuário`);

      await db.execute(sql`
        INSERT INTO "User" (
          id, email, name, phone, plan, "planStatus",
          "planStartDate", "planEndDate", "examType", state,
          "isActive", "createdAt", "updatedAt", "activationCode", "activationCodeUsed"
        ) VALUES (
          ${userId}, ${email}, 'Usuário', '00000000000', ${plan}, 'active',
          NOW(), NOW() + INTERVAL '1 month', 'OUTRO', 'SP',
          true, NOW(), NOW(), ${activationCode}, false
        )
      `);

      console.log(`✅ [Manual] Usuário criado`);
    }

    // Enviar email de boas-vindas
    console.log(`📧 [Manual] Enviando email de boas-vindas`);

    const { sendWelcomeEmail } = await import("../email/send-welcome");

    await sendWelcomeEmail({
      userEmail: email,
      userName: email,
      plan,
      activationCode,
      paymentId,
    });

    console.log(`✅ [Manual] Email enviado com sucesso!`);
    console.log(`🔑 [Manual] Código de ativação: ${activationCode}`);

    return {
      success: true,
      userId,
      email,
      plan,
      activationCode,
      paymentId,
    };
  } catch (error: any) {
    console.error(`❌ [Manual] Erro ao ativar usuário:`, error);
    throw error;
  }
}

/**
 * Endpoint para ativação manual via API
 * POST /api/payment/manual-activation
 */
export async function handleManualActivation(req: any, res: any) {
  try {
    const { paymentId, email, plan } = req.body;

    if (!paymentId || !email || !plan) {
      return res.status(400).json({
        success: false,
        error: "paymentId, email e plan são obrigatórios",
      });
    }

    const result = await manualActivation(paymentId, email, plan);

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
