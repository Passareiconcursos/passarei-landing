// server/email/test-route.ts
// 🧪 Rotas de teste do Resend
// ⚠️ ARQUIVO TEMPORÁRIO - Pode remover depois que confirmar que funciona

import { Router } from "express";
import { testResend } from "./resend";
import { sendWelcomeEmailTest } from "./send-welcome";
import { generateWelcomeEmail } from "./templates/welcome";

const router = Router();

/**
 * Endpoint de teste do Resend básico
 * GET /api/email/test?to=EMAIL
 */
router.get("/test", async (req, res) => {
  try {
    const testEmail = req.query.to as string;

    if (!testEmail) {
      return res.status(400).json({
        success: false,
        error: "Forneça um email na URL",
        exemplo: "/api/email/test?to=seu@email.com",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      return res.status(400).json({
        success: false,
        error: "Formato de email inválido",
        emailFornecido: testEmail,
      });
    }

    console.log(`🧪 [Test Route] Iniciando teste de envio para: ${testEmail}`);

    const result = await testResend(testEmail);

    res.json({
      success: true,
      message: "✅ Email de teste enviado com sucesso!",
      instrucoes: [
        "1. Verifique sua caixa de entrada",
        "2. Se não chegou, verifique SPAM",
        "3. Pode demorar 1-2 minutos",
      ],
      dados: {
        emailId: result?.id,
        enviadoPara: testEmail,
        dataHora: new Date().toLocaleString("pt-BR"),
      },
    });
  } catch (error: any) {
    console.error("❌ [Test Route] Erro ao enviar email de teste:", error);

    res.status(500).json({
      success: false,
      error: "Falha ao enviar email de teste",
      detalhes: error.message,
      possiveisProblemas: [
        "API Key do Resend incorreta",
        "API Key não foi adicionada nas Secrets",
        "Limite de envio atingido (improvável no plano grátis)",
        "Email destinatário inválido",
      ],
      solucoes: [
        "1. Verificar se RESEND_API_KEY está nas Secrets do Replit",
        '2. Verificar se API Key começa com "re_"',
        "3. Testar com outro email destinatário",
        "4. Verificar logs do Resend em https://resend.com/logs",
      ],
    });
  }
});

/**
 * Endpoint para ENVIAR email de boas-vindas de teste
 * GET /api/email/test-welcome?to=EMAIL&plan=calouro|veterano
 */
router.get("/test-welcome", async (req, res) => {
  try {
    const testEmail = req.query.to as string;
    const plan = (req.query.plan as "calouro" | "veterano") || "veterano";

    if (!testEmail) {
      return res.status(400).json({
        success: false,
        error: "Forneça um email",
        exemplo: "/api/email/test-welcome?to=seu@email.com&plan=veterano",
      });
    }

    console.log(
      `🧪 [Test Welcome] Enviando email de boas-vindas para: ${testEmail}`,
    );
    console.log(`🧪 [Test Welcome] Plano: ${plan}`);

    const result = await sendWelcomeEmailTest(testEmail);

    res.json({
      success: result.success,
      message: result.success
        ? "✅ Email de boas-vindas enviado!"
        : "❌ Falha ao enviar email",
      dados: {
        emailId: result.emailId || result.error,
        enviadoPara: testEmail,
        plano: plan,
        codigoAtivacao: result.activationCode,
      },
      instrucoes: [
        "Verifique sua caixa de entrada",
        "O email tem design completo com botão do Telegram",
        "Código de ativação: " + result.activationCode,
      ],
    });
  } catch (error: any) {
    console.error("❌ [Test Welcome] Erro:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Endpoint para VISUALIZAR HTML do email (preview no navegador)
 * GET /api/email/preview-welcome?plan=calouro|veterano
 */
router.get("/preview-welcome", (req, res) => {
  try {
    const plan = (req.query.plan as "calouro" | "veterano") || "veterano";

    console.log(`🎨 [Preview] Gerando preview do email - Plano: ${plan}`);

    const html = generateWelcomeEmail({
      userName: "João Silva",
      userEmail: "joao.silva@gmail.com",
      plan,
      activationCode: "PASS-DEMO123",
      paymentId: "MP-TEST-456789",
    });

    // Retornar HTML direto (renderiza no navegador)
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (error: any) {
    console.error("❌ [Preview] Erro ao gerar preview:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Rota: Info sobre o Resend configurado
 * GET /api/email/info
 */
router.get("/info", (req, res) => {
  const hasApiKey = !!process.env.RESEND_API_KEY;
  const apiKeyPrefix = process.env.RESEND_API_KEY?.substring(0, 5) || "N/A";

  res.json({
    resendConfigurado: hasApiKey,
    apiKeyPrefix: apiKeyPrefix,
    observacao: hasApiKey
      ? "✅ Resend configurado e pronto para uso"
      : "❌ RESEND_API_KEY não encontrada nas variáveis de ambiente",
    rotas: {
      testeBasico: "/api/email/test?to=seu@email.com",
      testeBV: "/api/email/test-welcome?to=seu@email.com&plan=veterano",
      preview: "/api/email/preview-welcome?plan=veterano",
    },
  });
});

export default router;
