// server/activation/test-routes.ts
// 🧪 Rotas de teste para sistema de ativação
// ⚠️ ARQUIVO TEMPORÁRIO - Remover em produção

import { Router } from "express";
import {
  generateActivationCode,
  createActivationCode,
  connectCodeToTelegram,
  getUserByActivationCode,
  getUserByTelegramId,
  hasActivePlan,
} from "./codes";

const router = Router();

/**
 * Gerar código de ativação para um usuário
 * POST /api/activation/generate
 * Body: { userId: "user-id" }
 */
router.post("/generate", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId é obrigatório",
      });
    }

    console.log(`🧪 [Test] Gerando código para usuário: ${userId}`);

    const code = await createActivationCode(userId);

    res.json({
      success: true,
      userId,
      activationCode: code,
      telegramLink: `https://t.me/PassareiBot?start=${code}`,
    });
  } catch (error: any) {
    console.error("❌ [Test] Erro ao gerar código:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Conectar código ao Telegram
 * POST /api/activation/connect
 * Body: { activationCode: "PASS-ABC123", telegramId: "123456789" }
 */
router.post("/connect", async (req, res) => {
  try {
    const { activationCode, telegramId } = req.body;

    if (!activationCode || !telegramId) {
      return res.status(400).json({
        success: false,
        error: "activationCode e telegramId são obrigatórios",
      });
    }

    console.log(
      `🧪 [Test] Conectando código ${activationCode} ao Telegram ${telegramId}`,
    );

    const result = await connectCodeToTelegram(activationCode, telegramId);

    res.json(result);
  } catch (error: any) {
    console.error("❌ [Test] Erro ao conectar código:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Validar código de ativação
 * GET /api/activation/validate?code=PASS-ABC123
 */
router.get("/validate", async (req, res) => {
  try {
    const code = req.query.code as string;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "Código é obrigatório",
      });
    }

    console.log(`🧪 [Test] Validando código: ${code}`);

    const user = await getUserByActivationCode(code);

    if (!user) {
      return res.json({
        success: false,
        valid: false,
        message: "Código inválido ou já utilizado",
      });
    }

    res.json({
      success: true,
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        planStatus: user.planStatus,
      },
    });
  } catch (error: any) {
    console.error("❌ [Test] Erro ao validar código:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Buscar usuário por Telegram ID
 * GET /api/activation/user?telegramId=123456789
 */
router.get("/user", async (req, res) => {
  try {
    const telegramId = req.query.telegramId as string;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        error: "telegramId é obrigatório",
      });
    }

    console.log(`🧪 [Test] Buscando usuário por Telegram: ${telegramId}`);

    const user = await getUserByTelegramId(telegramId);

    if (!user) {
      return res.json({
        success: false,
        found: false,
        message: "Usuário não encontrado",
      });
    }

    const active = await hasActivePlan(user.id);

    res.json({
      success: true,
      found: true,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        planStatus: user.planStatus,
        hasActivePlan: active,
        telegramId: user.telegramId,
      },
    });
  } catch (error: any) {
    console.error("❌ [Test] Erro ao buscar usuário:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Info sobre o sistema de ativação
 * GET /api/activation/info
 */
router.get("/info", (req, res) => {
  res.json({
    sistema: "Códigos de Ativação",
    status: "Ativo",
    formato: "PASS-XXXXXX (6 caracteres)",
    endpoints: {
      gerar: "POST /api/activation/generate { userId }",
      conectar: "POST /api/activation/connect { activationCode, telegramId }",
      validar: "GET /api/activation/validate?code=PASS-ABC123",
      usuario: "GET /api/activation/user?telegramId=123456789",
    },
    fluxo: [
      "1. Usuário paga no site",
      "2. Sistema gera código único (PASS-ABC123)",
      "3. Email enviado com link: t.me/PassareiBot?start=PASS-ABC123",
      "4. Usuário clica no link",
      "5. Bot recebe /start PASS-ABC123",
      "6. Sistema conecta email ↔ telegramId",
      "7. Usuário ativado!",
    ],
  });
});

export default router;
