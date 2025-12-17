import { db } from "../../db";
import { sql } from "drizzle-orm";

// ============================================
// CONSTANTES DO MODELO DE NEGÓCIO
// ============================================
const FREE_QUESTIONS_FIRST_DAY = 3; // Questões grátis no primeiro dia
const PRICE_PER_QUESTION = 0.99; // R$ 0,99 por questão
const VETERANO_DAILY_LIMIT = 10; // 10 questões/dia para Veterano

// ============================================
// BUSCAR CONTEÚDO
// ============================================
export async function getRandomContent(examType: string) {
  try {
    const result = await db.execute(sql`
      SELECT * FROM "Content"
      WHERE "examType" = ${examType}
      ORDER BY RANDOM()
      LIMIT 1
    `);

    if (result.length === 0) {
      console.log(
        `⚠️  Nenhum conteúdo para ${examType}, retornando qualquer um`,
      );

      const fallback = await db.execute(sql`
        SELECT * FROM "Content"
        ORDER BY RANDOM()
        LIMIT 1
      `);

      return fallback[0] || null;
    }

    return result[0];
  } catch (error) {
    console.error("❌ Erro ao buscar conteúdo:", error);
    return null;
  }
}

// ============================================
// CRIAR OU BUSCAR USUÁRIO
// ============================================
export async function createOrGetUser(telegramId: string, name: string) {
  try {
    const existing = await db.execute(sql`
      SELECT * FROM "User" WHERE "telegramId" = ${telegramId}
    `);

    if (existing.length > 0) {
      return existing[0];
    }

    const today = new Date().toISOString().split("T")[0];
    const odId = `telegram_${telegramId}_${Date.now()}`;

    const result = await db.execute(sql`
      INSERT INTO "User" (
        "id",
        "email", 
        "name", 
        "phone", 
        "telegramId",
        "onboardingCompleted",
        "credits",
        "firstDayFreeUsed",
        "firstInteractionDate",
        "dailyContentCount",
        "lastContentDate",
        "plan",
        "isActive",
        "createdAt",
        "updatedAt"
      ) VALUES (
        ${odId},
        ${telegramId + "@telegram.passarei"},
        ${name},
        'telegram',
        ${telegramId},
        false,
        0,
        0,
        ${today},
        0,
        ${today},
        'FREE',
        true,
        NOW(),
        NOW()
      )
      RETURNING *
    `);

    console.log(`✅ Novo usuário criado: ${name} (${telegramId})`);
    return result[0];
  } catch (error) {
    console.error("❌ Erro ao criar usuário:", error);
    return null;
  }
}

// ============================================
// VERIFICAR SE PODE USAR QUESTÃO
// ============================================
export interface QuestionAccessResult {
  canAccess: boolean;
  reason:
    | "free_first_day"
    | "has_credits"
    | "veterano"
    | "no_credits"
    | "limit_reached";
  freeRemaining?: number;
  credits?: number;
  message?: string;
}

export async function checkQuestionAccess(
  telegramId: string,
): Promise<QuestionAccessResult> {
  try {
    const result = await db.execute(sql`
      SELECT 
        "plan",
        "credits",
        "firstDayFreeUsed",
        "firstInteractionDate",
        "dailyContentCount",
        "lastContentDate"
      FROM "User"
      WHERE "telegramId" = ${telegramId}
    `);

    if (result.length === 0) {
      return {
        canAccess: false,
        reason: "no_credits",
        message: "Usuário não encontrado",
      };
    }

    const user = result[0] as any;
    const today = new Date().toISOString().split("T")[0];
    const firstDay = user.firstInteractionDate
      ? new Date(user.firstInteractionDate).toISOString().split("T")[0]
      : today;
    const lastDate = user.lastContentDate
      ? new Date(user.lastContentDate).toISOString().split("T")[0]
      : null;

    // Reset contador diário se é um novo dia
    if (lastDate !== today) {
      await db.execute(sql`
        UPDATE "User" 
        SET "dailyContentCount" = 0, "lastContentDate" = ${today}
        WHERE "telegramId" = ${telegramId}
      `);
      user.dailyContentCount = 0;
    }

    // 1. VETERANO - tem limite diário de 10 questões
    if (user.plan === "VETERANO") {
      if (user.dailyContentCount < VETERANO_DAILY_LIMIT) {
        return {
          canAccess: true,
          reason: "veterano",
          message: `✅ Plano Veterano: ${VETERANO_DAILY_LIMIT - user.dailyContentCount} questões restantes hoje`,
        };
      } else {
        return {
          canAccess: false,
          reason: "limit_reached",
          message: `⏰ Você atingiu o limite de ${VETERANO_DAILY_LIMIT} questões hoje!\n\nVolte amanhã ou faça upgrade para mais questões.`,
        };
      }
    }

    // 2. PRIMEIRO DIA - 3 questões grátis
    const isFirstDay = firstDay === today;
    const freeUsed = user.firstDayFreeUsed || 0;
    const freeRemaining = FREE_QUESTIONS_FIRST_DAY - freeUsed;

    if (isFirstDay && freeRemaining > 0) {
      return {
        canAccess: true,
        reason: "free_first_day",
        freeRemaining: freeRemaining,
        message: `🎁 Questão GRÁTIS! (${freeRemaining} restantes hoje)`,
      };
    }

    // 3. TEM CRÉDITOS - pode usar
    const credits = parseFloat(user.credits) || 0;
    if (credits >= PRICE_PER_QUESTION) {
      return {
        canAccess: true,
        reason: "has_credits",
        credits: credits,
        message: `💰 Usando 1 crédito (R$ ${PRICE_PER_QUESTION.toFixed(2)}). Saldo: R$ ${(credits - PRICE_PER_QUESTION).toFixed(2)}`,
      };
    }

    // 4. SEM CRÉDITOS - precisa comprar
    return {
      canAccess: false,
      reason: "no_credits",
      credits: credits,
      freeRemaining: 0,
      message: getNoCreditsMessage(credits),
    };
  } catch (error) {
    console.error("❌ Erro ao verificar acesso:", error);
    return { canAccess: true, reason: "has_credits" }; // Em caso de erro, permite
  }
}

// ============================================
// MENSAGEM DE SEM CRÉDITOS
// ============================================
function getNoCreditsMessage(currentCredits: number): string {
  return `🔒 *CRÉDITOS INSUFICIENTES*

━━━━━━━━━━━━━━━━

💰 Seu saldo: R$ ${currentCredits.toFixed(2)}
💳 Custo por questão: R$ ${PRICE_PER_QUESTION.toFixed(2)}

━━━━━━━━━━━━━━━━

*OPÇÕES PARA CONTINUAR:*

1️⃣ *Pay-per-use*
   R$ 0,99 por questão
   Compre créditos via PIX

2️⃣ *Plano Veterano* ⭐
   R$ 49,90/mês
   10 questões/dia + 2 redações grátis
   Acesso a TODAS as apostilas

━━━━━━━━━━━━━━━━

_62% mais barato que a concorrência!_`;
}

// ============================================
// CONSUMIR QUESTÃO (DEBITAR)
// ============================================
export async function consumeQuestion(
  telegramId: string,
  accessType: QuestionAccessResult["reason"],
): Promise<boolean> {
  try {
    if (accessType === "free_first_day") {
      await db.execute(sql`
        UPDATE "User" 
        SET "firstDayFreeUsed" = COALESCE("firstDayFreeUsed", 0) + 1,
            "dailyContentCount" = COALESCE("dailyContentCount", 0) + 1,
            "lastContentDate" = CURRENT_DATE,
            "totalQuestionsAnswered" = COALESCE("totalQuestionsAnswered", 0) + 1,
            "updatedAt" = NOW()
        WHERE "telegramId" = ${telegramId}
      `);
      console.log(`🎁 Questão grátis consumida para ${telegramId}`);
    } else if (accessType === "has_credits") {
      await db.execute(sql`
        UPDATE "User" 
        SET "credits" = COALESCE("credits", 0) - ${PRICE_PER_QUESTION},
            "dailyContentCount" = COALESCE("dailyContentCount", 0) + 1,
            "lastContentDate" = CURRENT_DATE,
            "totalQuestionsAnswered" = COALESCE("totalQuestionsAnswered", 0) + 1,
            "totalSpent" = COALESCE("totalSpent", 0) + ${PRICE_PER_QUESTION},
            "updatedAt" = NOW()
        WHERE "telegramId" = ${telegramId}
      `);
      console.log(
        `💰 Crédito debitado de ${telegramId}: R$ ${PRICE_PER_QUESTION}`,
      );
    } else if (accessType === "veterano") {
      await db.execute(sql`
        UPDATE "User" 
        SET "dailyContentCount" = COALESCE("dailyContentCount", 0) + 1,
            "lastContentDate" = CURRENT_DATE,
            "totalQuestionsAnswered" = COALESCE("totalQuestionsAnswered", 0) + 1,
            "updatedAt" = NOW()
        WHERE "telegramId" = ${telegramId}
      `);
      console.log(`⭐ Questão Veterano consumida para ${telegramId}`);
    }

    return true;
  } catch (error) {
    console.error("❌ Erro ao consumir questão:", error);
    return false;
  }
}

// ============================================
// ADICIONAR CRÉDITOS
// ============================================
export async function addCredits(
  telegramId: string,
  amount: number,
): Promise<boolean> {
  try {
    await db.execute(sql`
      UPDATE "User" 
      SET "credits" = COALESCE("credits", 0) + ${amount},
          "updatedAt" = NOW()
      WHERE "telegramId" = ${telegramId}
    `);
    console.log(`💰 Créditos adicionados para ${telegramId}: R$ ${amount}`);
    return true;
  } catch (error) {
    console.error("❌ Erro ao adicionar créditos:", error);
    return false;
  }
}

// ============================================
// BUSCAR SALDO DO USUÁRIO
// ============================================
export async function getUserBalance(
  telegramId: string,
): Promise<{ credits: number; plan: string; questionsToday: number }> {
  try {
    const result = await db.execute(sql`
      SELECT "credits", "plan", "dailyContentCount"
      FROM "User"
      WHERE "telegramId" = ${telegramId}
    `);

    if (result.length === 0) {
      return { credits: 0, plan: "FREE", questionsToday: 0 };
    }

    const user = result[0] as any;
    return {
      credits: parseFloat(user.credits) || 0,
      plan: user.plan || "FREE",
      questionsToday: user.dailyContentCount || 0,
    };
  } catch (error) {
    console.error("❌ Erro ao buscar saldo:", error);
    return { credits: 0, plan: "FREE", questionsToday: 0 };
  }
}

// ============================================
// UPGRADE PARA VETERANO
// ============================================
export async function upgradeToVeterano(telegramId: string): Promise<boolean> {
  try {
    await db.execute(sql`
      UPDATE "User" 
      SET "plan" = 'VETERANO',
          "updatedAt" = NOW()
      WHERE "telegramId" = ${telegramId}
    `);
    console.log(`⭐ Usuário ${telegramId} fez upgrade para VETERANO`);
    return true;
  } catch (error) {
    console.error("❌ Erro ao fazer upgrade:", error);
    return false;
  }
}

// ============================================
// ATUALIZAR DADOS DO ONBOARDING
// ============================================
export async function updateUserOnboarding(
  telegramId: string,
  data: {
    examType?: string;
    state?: string;
    cargo?: string;
    nivelConhecimento?: string;
  },
): Promise<boolean> {
  try {
    await db.execute(sql`
      UPDATE "User" 
      SET "examType" = ${data.examType || null},
          "state" = ${data.state || null},
          "cargo" = ${data.cargo || null},
          "nivelConhecimento" = ${data.nivelConhecimento || null},
          "onboardingCompleted" = true,
          "updatedAt" = NOW()
      WHERE "telegramId" = ${telegramId}
    `);
    console.log(`✅ Onboarding atualizado para ${telegramId}`);
    return true;
  } catch (error) {
    console.error("❌ Erro ao atualizar onboarding:", error);
    return false;
  }
}

// ============================================
// VERIFICAR LIMITE (COMPATIBILIDADE)
// ============================================
export async function checkUserLimit(telegramId: string): Promise<boolean> {
  const access = await checkQuestionAccess(telegramId);
  return access.canAccess;
}

// ============================================
// INCREMENTAR CONTADOR (COMPATIBILIDADE)
// ============================================
export async function incrementUserCount(telegramId: string) {
  try {
    await db.execute(sql`
      UPDATE "User" 
      SET "dailyContentCount" = COALESCE("dailyContentCount", 0) + 1,
          "lastContentDate" = CURRENT_DATE,
          "updatedAt" = NOW()
      WHERE "telegramId" = ${telegramId}
    `);
  } catch (error) {
    console.error("❌ Erro ao incrementar contador:", error);
  }
}
