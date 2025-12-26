// server/activation/codes.ts
// 🔑 Sistema de códigos de ativação para conectar email ↔ Telegram

import { db } from "../../db";
import { users } from "../../db/schema";
import { eq, and, sql } from "drizzle-orm";

/**
 * Gera código de ativação único
 * Formato: PASS-ABC123 (sempre 6 caracteres após PASS-)
 *
 * @param userId - ID do usuário
 * @returns Código de ativação único
 */
export function generateActivationCode(userId: string): string {
  // Gerar 6 caracteres aleatórios (letras maiúsculas + números)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sem I, O, 0, 1 (evita confusão)
  let code = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }

  // Formato final: PASS-ABC123
  const activationCode = `PASS-${code}`;

  console.log(
    `🔑 [Activation] Código gerado para usuário ${userId}: ${activationCode}`,
  );

  return activationCode;
}

/**
 * Salva código de ativação no banco
 *
 * @param userId - ID do usuário
 * @param activationCode - Código gerado
 */
export async function saveActivationCode(
  userId: string,
  activationCode: string,
) {
  try {
    console.log(
      `💾 [Activation] Salvando código ${activationCode} para usuário ${userId}`,
    );

    // Usar SQL direto por enquanto
    await db.execute(sql`
      UPDATE "User" 
      SET 
        "activationCode" = ${activationCode},
        "activationCodeUsed" = false
      WHERE id = ${userId}
    `);

    console.log("✅ [Activation] Código salvo com sucesso");

    return { success: true, code: activationCode };
  } catch (error: any) {
    console.error("❌ [Activation] Erro ao salvar código:", error);
    throw error;
  }
}

/**
 * Gera e salva código de ativação
 * (Função helper que combina as duas acima)
 *
 * @param userId - ID do usuário
 * @returns Código de ativação
 */
export async function createActivationCode(userId: string): Promise<string> {
  const code = generateActivationCode(userId);
  await saveActivationCode(userId, code);
  return code;
}

/**
 * Conecta código de ativação ao Telegram
 * Quando usuário abre bot com código, vincula telegramId ao email
 *
 * @param activationCode - Código digitado/clicado pelo usuário
 * @param telegramId - ID do Telegram do usuário
 * @returns Dados do usuário ou null se código inválido
 */
export async function connectCodeToTelegram(
  activationCode: string,
  telegramId: string,
) {
  try {
    console.log(
      `🔗 [Activation] Conectando código ${activationCode} ao Telegram ${telegramId}`,
    );

    // Buscar usuário pelo código
    const user = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.activationCode, activationCode),
          eq(users.activationCodeUsed, false),
        ),
      )
      .limit(1);

    if (!user || user.length === 0) {
      console.log("❌ [Activation] Código não encontrado ou já usado");
      return {
        success: false,
        error: "Código inválido ou já utilizado",
      };
    }

    const userData = user[0];

    // Verificar se Telegram já está vinculado a outra conta
    const existingTelegram = await db
      .select()
      .from(users)
      .where(eq(users.telegramId, telegramId))
      .limit(1);

    if (
      existingTelegram &&
      existingTelegram.length > 0 &&
      existingTelegram[0].id !== userData.id
    ) {
      console.log("⚠️ [Activation] Telegram já vinculado a outra conta");
      return {
        success: false,
        error: "Este Telegram já está vinculado a outra conta",
      };
    }

    // Atualizar usuário: adicionar telegramId e marcar código como usado
    await db
      .update(users)
      .set({
        telegramId,
        activationCodeUsed: true,
      })
      .where(eq(users.id, userData.id));

    console.log("✅ [Activation] Código vinculado com sucesso!");
    console.log(`📧 Email: ${userData.email}`);
    console.log(`📱 Telegram: ${telegramId}`);
    console.log(`📦 Plano: ${userData.plan}`);

    return {
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        plan: userData.plan,
        planStatus: userData.planStatus,
        telegramId,
      },
    };
  } catch (error: any) {
    console.error("❌ [Activation] Erro ao conectar código:", error);
    return {
      success: false,
      error: "Erro ao processar código de ativação",
    };
  }
}

/**
 * Busca usuário pelo código de ativação
 * (Útil para validar código antes de conectar)
 *
 * @param activationCode - Código a ser validado
 * @returns Dados do usuário ou null
 */
export async function getUserByActivationCode(activationCode: string) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.activationCode, activationCode),
          eq(users.activationCodeUsed, false),
        ),
      )
      .limit(1);

    if (!user || user.length === 0) {
      return null;
    }

    return user[0];
  } catch (error) {
    console.error("❌ [Activation] Erro ao buscar usuário:", error);
    return null;
  }
}

/**
 * Verifica se usuário tem plano ativo
 *
 * @param userId - ID do usuário
 * @returns true se plano ativo, false caso contrário
 */
export async function hasActivePlan(userId: string): Promise<boolean> {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || user.length === 0) {
      return false;
    }

    const userData = user[0];

    // Verificar se tem plano ativo
    if (userData.planStatus === "active") {
      // Verificar se não expirou (se tiver data de fim)
      if (userData.planEndDate) {
        const now = new Date();
        const endDate = new Date(userData.planEndDate);
        return endDate > now;
      }
      return true;
    }

    return false;
  } catch (error) {
    console.error("❌ [Activation] Erro ao verificar plano:", error);
    return false;
  }
}

/**
 * Busca usuário pelo Telegram ID
 *
 * @param telegramId - ID do Telegram
 * @returns Dados do usuário ou null
 */
export async function getUserByTelegramId(telegramId: string) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.telegramId, telegramId))
      .limit(1);

    if (!user || user.length === 0) {
      return null;
    }

    return user[0];
  } catch (error) {
    console.error("❌ [Activation] Erro ao buscar usuário:", error);
    return null;
  }
}
