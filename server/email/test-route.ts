// server/email/test-route.ts
// 🧪 Rota de teste do Resend
// ⚠️ ARQUIVO TEMPORÁRIO - Pode remover depois que confirmar que funciona

import { Router } from "express";
import { testResend } from "./resend";

const router = Router();

/**
 * Endpoint de teste do Resend
 *
 * Como usar:
 * 1. No navegador: http://localhost:5000/api/email/test?to=seuemail@gmail.com
 * 2. Ou via curl: curl "http://localhost:5000/api/email/test?to=seuemail@gmail.com"
 *
 * GET /api/email/test?to=EMAIL
 */
router.get("/test", async (req, res) => {
  try {
    // Pegar email da query string
    const testEmail = req.query.to as string;

    // Validar se email foi fornecido
    if (!testEmail) {
      return res.status(400).json({
        success: false,
        error: "Forneça um email na URL",
        exemplo: "/api/email/test?to=seu@email.com",
      });
    }

    // Validação básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      return res.status(400).json({
        success: false,
        error: "Formato de email inválido",
        emailFornecido: testEmail,
      });
    }

    console.log(`🧪 [Test Route] Iniciando teste de envio para: ${testEmail}`);

    // Enviar email de teste
    const result = await testResend(testEmail);

    // Retornar sucesso
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

    // Retornar erro detalhado
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
 * Rota extra: Info sobre o Resend configurado
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
    comoTestar: "/api/email/test?to=seu@email.com",
  });
});

export default router;
