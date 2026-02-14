import { Router, Request, Response } from "express";
import {
  createPaymentPreference,
  createVeteranoPreference,
  processPaymentWebhook,
  createVeteranoSubscription,
  getSubscriptionStatus,
  cancelSubscription,
  CREDIT_PACKAGES,
  payment as mpPayment,
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
      amount: 44.9,
      label: "Plano Veterano - R$ 44,90/mês (cobrado anualmente)",
      benefits: [
        "900 questões personalizadas/mês",
        "2 correções de redação/mês com IA",
        "Revisão inteligente SM2",
        "Suporte prioritário",
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

      // Extrair dados do external_reference
      const externalRef = paymentData.external_reference || "";
      const [refTelegramId, refPackageId, refUserEmail] = externalRef.split("|");

      // 💾 Salvar transação para conciliação (webhook)
      try {
        await db.execute(sql`
          INSERT INTO transactions (
            mp_payment_id, telegram_id, payer_email, package_id,
            amount, status, status_detail, payment_method_id,
            payment_type_id, installments, raw_data,
            mp_date_created, mp_date_approved, created_at, updated_at
          ) VALUES (
            ${String(paymentData.id)},
            ${refTelegramId || null},
            ${paymentData.payer?.email || null},
            ${refPackageId || 'unknown'},
            ${paymentData.transaction_amount || 0},
            ${paymentData.status?.toUpperCase() || 'PENDING'},
            ${paymentData.status_detail || null},
            ${paymentData.payment_method_id || null},
            ${paymentData.payment_type_id || null},
            ${paymentData.installments || 1},
            ${JSON.stringify(paymentData)},
            ${paymentData.date_created ? new Date(paymentData.date_created).toISOString() : null},
            ${paymentData.date_approved ? new Date(paymentData.date_approved).toISOString() : null},
            NOW(),
            NOW()
          )
          ON CONFLICT (mp_payment_id) DO UPDATE SET
            status = EXCLUDED.status,
            status_detail = EXCLUDED.status_detail,
            mp_date_approved = EXCLUDED.mp_date_approved,
            raw_data = EXCLUDED.raw_data,
            updated_at = NOW()
        `);
        console.log("💾 [Webhook] Transação salva para conciliação");
      } catch (dbError) {
        console.error("⚠️ [Webhook] Erro ao salvar transação (não crítico):", dbError);
      }

      // Processar apenas se aprovado
      if (paymentData.status === "approved") {
        console.log("✅ [Webhook] Pagamento aprovado! Ativando usuário...");

        const telegramId = refTelegramId;
        const packageId = refPackageId;
        const userEmail = refUserEmail;

        const email = userEmail || paymentData.payer?.email;
        const amount = paymentData.transaction_amount || 0;

        console.log(`📧 [Webhook] Email extraído: ${email} (do frontend)`);

        if (!email) {
          console.error("❌ [Webhook] Email não encontrado");
          return res
            .status(200)
            .json({ success: false, error: "Email não encontrado" });
        }

        // Determinar plano baseado no valor (R$44,90 mensal ou R$538,80 anual = veterano)
        let plan: "calouro" | "veterano" = "calouro";
        if (amount >= 40 && amount <= 50) {
          plan = "veterano"; // mensal via assinatura
        } else if (amount >= 500 && amount <= 550) {
          plan = "veterano"; // anual via Brick
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
            SET plan = 'veterano',
                "planStatus" = 'active',
                "planStartDate" = NOW(),
                "planEndDate" = NOW() + INTERVAL '30 days',
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
    // SEMPRE retornar 200 para webhooks MP, senão ele reenvia infinitamente
    res.status(200).json({ success: false, error: "Internal error" });
  }
});

// ============================================
// ATIVAÇÃO MANUAL (Para quando webhook não funciona)
// ============================================

router.post("/manual-activation", handleManualActivation);

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
      deviceId,
      buyerFirstName,
      buyerLastName,
    } = req.body;

    // Capturar IP do usuário para prevenção de fraude
    const userIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const clientIp = Array.isArray(userIp) ? userIp[0] : userIp.split(",")[0]?.trim();

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        error: "Dados de pagamento incompletos",
      });
    }

    // Encontrar valor do pacote
    const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
    const amount = pkg ? pkg.amount : packageId === "veterano" ? 44.9 : 5;

    // Processar pagamento via API do Mercado Pago
    console.log(
      "🔑 Token MP:",
      process.env.MERCADOPAGO_ACCESS_TOKEN?.substring(0, 20),
    );
    console.log("💳 Chamando MP API...");

    // Dados do pacote para descrição
    const packageName = pkg?.label || (packageId === "veterano" ? "Plano Veterano" : "Plano Calouro");
    const packageQuestions = pkg?.questions || (packageId === "veterano" ? 10800 : 300);

    const payloadMP: Record<string, any> = {
      token,
      transaction_amount: amount,
      installments: installments || 1,
      payment_method_id,
      description: `${packageName} - Passarei Concursos`,
      statement_descriptor: "PASSAREI",
      binary_mode: false, // Permite revisão manual do MP (melhora taxa de aprovação)
      external_reference: `${telegramId}|${packageId}|${payer?.email || ""}|${Date.now()}`,
      payer: {
        email: payer?.email || formData?.email || "",
        first_name: buyerFirstName || payer?.first_name || payer?.firstName || "",
        last_name: buyerLastName || payer?.last_name || payer?.lastName || "",
        identification: payer?.identification?.number ? payer.identification : undefined,
        phone: payer?.phone ? {
          area_code: payer.phone.area_code || payer.phone.areaCode || "",
          number: payer.phone.number || "",
        } : undefined,
        address: payer?.address ? {
          zip_code: payer.address.zip_code || payer.address.zipCode || "",
          street_name: payer.address.street_name || payer.address.streetName || "",
          street_number: payer.address.street_number || payer.address.streetNumber || "",
          neighborhood: payer.address.neighborhood || "",
          city: payer.address.city || "",
          federal_unit: payer.address.federal_unit || payer.address.federalUnit || "",
        } : undefined,
      },
      additional_info: {
        items: [
          {
            id: packageId,
            title: packageName,
            description: `Acesso a ${packageQuestions} questões de concursos`,
            category_id: "services",
            quantity: 1,
            unit_price: amount,
          },
        ],
        payer: {
          first_name: buyerFirstName || payer?.first_name || payer?.firstName || "",
          last_name: buyerLastName || payer?.last_name || payer?.lastName || "",
          registration_date: new Date().toISOString(),
        },
        ip_address: clientIp || undefined,
      },
    };

    // Adicionar device fingerprint se disponível (melhora aprovação)
    if (deviceId) {
      payloadMP.metadata = {
        ...payloadMP.metadata,
        device_id: deviceId,
      };
    }

    console.log(
      "📦 Payload enviado ao MP (via SDK):",
      JSON.stringify(payloadMP, null, 2),
    );

    // Usar SDK oficial do Mercado Pago (requisito de escalabilidade)
    const paymentData = await mpPayment.create({
      body: payloadMP,
      requestOptions: {
        idempotencyKey: `${telegramId}-${packageId}-${token?.substring(0, 16)}`,
      },
    });
    console.log(
      "📩 Resposta COMPLETA do MP:",
      JSON.stringify(paymentData, null, 2),
    );
    console.log("📊 Status:", paymentData.status);
    console.log("📊 Status Detail:", paymentData.status_detail);
    console.log(
      "📩 Resposta do pagamento:",
      paymentData.status,
      paymentData.id,
    );

    // 💾 Salvar transação para conciliação financeira
    if (paymentData.id) {
      try {
        await db.execute(sql`
          INSERT INTO transactions (
            mp_payment_id, telegram_id, payer_email, package_id,
            amount, status, status_detail, payment_method_id,
            payment_type_id, installments, device_id, ip_address,
            raw_data, mp_date_created, created_at, updated_at
          ) VALUES (
            ${String(paymentData.id)},
            ${telegramId},
            ${payer?.email || null},
            ${packageId},
            ${amount},
            ${paymentData.status?.toUpperCase() || 'PENDING'},
            ${paymentData.status_detail || null},
            ${payment_method_id || null},
            ${paymentData.payment_type_id || null},
            ${installments || 1},
            ${deviceId || null},
            ${clientIp || null},
            ${JSON.stringify(paymentData)},
            ${paymentData.date_created ? new Date(paymentData.date_created).toISOString() : null},
            NOW(),
            NOW()
          )
          ON CONFLICT (mp_payment_id) DO UPDATE SET
            status = EXCLUDED.status,
            status_detail = EXCLUDED.status_detail,
            raw_data = EXCLUDED.raw_data,
            updated_at = NOW()
        `);
        console.log("💾 Transação salva para conciliação");
      } catch (dbError) {
        console.error("⚠️ Erro ao salvar transação (não crítico):", dbError);
      }
    }

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
        error: paymentData.status_detail || "Pagamento não aprovado",
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

export default router;
