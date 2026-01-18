// server/activation/unlink-telegram.ts
// 🔓 Desvincula Telegram ID de usuário antigo

import { db } from "../../db";
import { sql } from "drizzle-orm";

/**
 * Desvincula Telegram ID de qualquer usuário
 * Útil quando usuário testou bot antes de ativar código
 *
 * @param telegramId - ID do Telegram a desvincular
 * @returns Resultado da operação
 */
export async function unlinkTelegram(telegramId: string) {
  try {
    console.log(`🔓 [Unlink] Desvinculando Telegram: ${telegramId}`);

    // Ver quem está usando este Telegram
    const existingUsers = await db.execute(sql`
      SELECT id, email, "activationCode", plan
      FROM "User"
      WHERE "telegramId" = ${telegramId}
    `);

    if (!existingUsers || existingUsers.length === 0) {
      console.log(`ℹ️ [Unlink] Telegram ${telegramId} não está vinculado`);
      return {
        success: true,
        message: "Telegram não estava vinculado",
        unlinked: 0,
      };
    }

    console.log(`📋 [Unlink] Encontrados ${existingUsers.length} usuários`);

    // Desvincular TODOS os usuários com este Telegram
    await db.execute(sql`
      UPDATE "User"
      SET
        "telegramId" = NULL,
        "updatedAt" = NOW()
      WHERE "telegramId" = ${telegramId}
    `);

    console.log(`✅ [Unlink] ${existingUsers.length} usuário(s) desvinculado(s)`);

    return {
      success: true,
      unlinked: existingUsers.length,
      users: existingUsers.map((u) => ({
        email: u.email,
        plan: u.plan,
      })),
    };
  } catch (error: any) {
    console.error(`❌ [Unlink] Erro:`, error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Endpoint de API para desvincular Telegram
 * POST /api/activation/unlink-telegram
 */
export async function handleUnlinkTelegram(req: any, res: any) {
  try {
    const { telegramId } = req.body;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        error: "telegramId é obrigatório",
      });
    }

    const result = await unlinkTelegram(telegramId);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
