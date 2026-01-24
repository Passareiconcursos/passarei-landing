import { db } from "../../db";
import { sql } from "drizzle-orm";

// ============================================
// CONSTANTES DO MODELO DE NEGÓCIO
// ============================================
const FREE_QUESTIONS_FIRST_DAY = 21; // Questões grátis no primeiro dia
const PRICE_PER_QUESTION = 0.99; // R$ 0,99 por questão
const CALOURO_DAILY_LIMIT = 10; // 10 questões/dia para Calouro (300/mês)
const VETERANO_DAILY_LIMIT = 30; // 30 questões/dia para Veterano (900/mês)

// Redação
const VETERANO_MONTHLY_ESSAYS = 2; // 2 redações grátis/mês para Veterano
const PRICE_PER_ESSAY = 1.99; // R$ 1,99 por redação extra

// Exportar constantes para uso externo
export const PLAN_LIMITS = {
  FREE_QUESTIONS_FIRST_DAY,
  PRICE_PER_QUESTION,
  CALOURO_DAILY_LIMIT,
  VETERANO_DAILY_LIMIT,
  VETERANO_MONTHLY_ESSAYS,
  PRICE_PER_ESSAY,
};

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
    | "calouro"
    | "veterano"
    | "no_credits"
    | "limit_reached";
  freeRemaining?: number;
  credits?: number;
  dailyRemaining?: number;
  dailyLimit?: number;
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

    // 1. VETERANO - tem limite diário de 30 questões
    if (user.plan === "VETERANO") {
      const remaining = VETERANO_DAILY_LIMIT - user.dailyContentCount;
      if (remaining > 0) {
        return {
          canAccess: true,
          reason: "veterano",
          dailyRemaining: remaining,
          dailyLimit: VETERANO_DAILY_LIMIT,
          message: `✅ Plano Veterano: ${remaining} questões restantes hoje`,
        };
      } else {
        return {
          canAccess: false,
          reason: "limit_reached",
          dailyRemaining: 0,
          dailyLimit: VETERANO_DAILY_LIMIT,
          message: `⏰ Você atingiu o limite de ${VETERANO_DAILY_LIMIT} questões hoje!\n\nVolte amanhã para continuar estudando.`,
        };
      }
    }

    // 2. CALOURO - tem limite diário de 10 questões
    if (user.plan === "CALOURO") {
      const remaining = CALOURO_DAILY_LIMIT - user.dailyContentCount;
      if (remaining > 0) {
        return {
          canAccess: true,
          reason: "calouro",
          dailyRemaining: remaining,
          dailyLimit: CALOURO_DAILY_LIMIT,
          message: `✅ Plano Calouro: ${remaining} questões restantes hoje`,
        };
      } else {
        return {
          canAccess: false,
          reason: "limit_reached",
          dailyRemaining: 0,
          dailyLimit: CALOURO_DAILY_LIMIT,
          message: `⏰ Você atingiu o limite de ${CALOURO_DAILY_LIMIT} questões hoje!\n\nVolte amanhã ou faça upgrade para o plano Veterano (30 questões/dia).`,
        };
      }
    }

    // 3. PRIMEIRO DIA (FREE) - 21 questões grátis
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

    // 4. TEM CRÉDITOS - pode usar (pay-per-use)
    const credits = parseFloat(user.credits) || 0;
    if (credits >= PRICE_PER_QUESTION) {
      return {
        canAccess: true,
        reason: "has_credits",
        credits: credits,
        message: `💰 Usando 1 crédito (R$ ${PRICE_PER_QUESTION.toFixed(2)}). Saldo: R$ ${(credits - PRICE_PER_QUESTION).toFixed(2)}`,
      };
    }

    // 5. SEM CRÉDITOS - precisa comprar ou assinar plano
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
  return `🎯 *SUAS QUESTÕES GRÁTIS ACABARAM!*

━━━━━━━━━━━━━━━━

Você aproveitou bem o teste! Agora escolha como continuar:

━━━━━━━━━━━━━━━━

🎓 *PLANO CALOURO*
R$ 89,90/mês
✅ 10 questões/dia (300/mês)
✅ Explicações com IA
✅ Cancele quando quiser

⭐ *PLANO VETERANO* (RECOMENDADO)
R$ 44,90/mês (anual)
✅ 30 questões/dia (900/mês)
✅ 2 correções de redação/mês
✅ Revisão inteligente SM2
✅ Economia de 50%

💳 *PAY-PER-USE*
R$ 0,99 por questão avulsa

━━━━━━━━━━━━━━━━

👇 Clique abaixo para continuar estudando:`;
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
    } else if (accessType === "calouro") {
      await db.execute(sql`
        UPDATE "User"
        SET "dailyContentCount" = COALESCE("dailyContentCount", 0) + 1,
            "lastContentDate" = CURRENT_DATE,
            "totalQuestionsAnswered" = COALESCE("totalQuestionsAnswered", 0) + 1,
            "updatedAt" = NOW()
        WHERE "telegramId" = ${telegramId}
      `);
      console.log(`🎓 Questão Calouro consumida para ${telegramId}`);
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
// UPGRADE PARA CALOURO
// ============================================
export async function upgradeToCalouro(telegramId: string): Promise<boolean> {
  try {
    await db.execute(sql`
      UPDATE "User"
      SET "plan" = 'CALOURO',
          "updatedAt" = NOW()
      WHERE "telegramId" = ${telegramId}
    `);
    console.log(`🎓 Usuário ${telegramId} fez upgrade para CALOURO`);
    return true;
  } catch (error) {
    console.error("❌ Erro ao fazer upgrade para Calouro:", error);
    return false;
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
    console.error("❌ Erro ao fazer upgrade para Veterano:", error);
    return false;
  }
}

// ============================================
// VERIFICAR SE USUÁRIO TEM ACESSO (ATIVO)
// ============================================
export interface UserActiveStatus {
  isActive: boolean;
  reason:
    | "has_plan" // CALOURO ou VETERANO
    | "first_day" // Primeiro dia com questões grátis
    | "has_credits" // Tem créditos
    | "inactive"; // Sem acesso
  plan?: string;
  freeRemaining?: number;
  credits?: number;
  message?: string;
}

export async function isUserActive(telegramId: string): Promise<UserActiveStatus> {
  try {
    const result = await db.execute(sql`
      SELECT
        "plan",
        "credits",
        "firstDayFreeUsed",
        "firstInteractionDate",
        "planStatus"
      FROM "User"
      WHERE "telegramId" = ${telegramId}
    `);

    if (result.length === 0) {
      return {
        isActive: false,
        reason: "inactive",
        message: "❌ Usuário não encontrado. Use /start para começar.",
      };
    }

    const user = result[0] as any;
    const today = new Date().toISOString().split("T")[0];
    const firstDay = user.firstInteractionDate
      ? new Date(user.firstInteractionDate).toISOString().split("T")[0]
      : today;

    // 1. PLANO ATIVO (VETERANO ou CALOURO)
    if (user.plan === "VETERANO" || user.plan === "CALOURO") {
      return {
        isActive: true,
        reason: "has_plan",
        plan: user.plan,
        message: `✅ Plano ${user.plan} ativo`,
      };
    }

    // 2. PRIMEIRO DIA - questões grátis
    const isFirstDay = firstDay === today;
    const freeUsed = user.firstDayFreeUsed || 0;
    const freeRemaining = FREE_QUESTIONS_FIRST_DAY - freeUsed;

    if (isFirstDay && freeRemaining > 0) {
      return {
        isActive: true,
        reason: "first_day",
        freeRemaining: freeRemaining,
        message: `🎁 ${freeRemaining} questões grátis restantes hoje`,
      };
    }

    // 3. TEM CRÉDITOS
    const credits = parseFloat(user.credits) || 0;
    if (credits >= PRICE_PER_QUESTION) {
      return {
        isActive: true,
        reason: "has_credits",
        credits: credits,
        message: `💰 Saldo: R$ ${credits.toFixed(2)}`,
      };
    }

    // 4. SEM ACESSO
    return {
      isActive: false,
      reason: "inactive",
      credits: credits,
      message: getInactiveMessage(freeRemaining <= 0 && !isFirstDay),
    };
  } catch (error) {
    console.error("❌ Erro ao verificar status do usuário:", error);
    return {
      isActive: false,
      reason: "inactive",
      message: "❌ Erro ao verificar status. Tente novamente.",
    };
  }
}

function getInactiveMessage(expiredFreeQuestions: boolean): string {
  if (expiredFreeQuestions) {
    return `⏰ *SUAS QUESTÕES GRÁTIS EXPIRARAM!*

Suas 21 questões grátis eram válidas apenas no primeiro dia.

🎓 *PLANO CALOURO* - R$ 89,90/mês
✅ 10 questões por dia (300/mês)

⭐ *PLANO VETERANO* - R$ 44,90/mês
✅ 30 questões por dia (900/mês)
✅ 2 correções de redação/mês
✅ Simulados mensais
✅ Revisão espaçada SM2

Acesse passarei.com.br para assinar! 🚀`;
  }

  return `❌ *ACESSO INATIVO*

Para continuar estudando, você precisa:

💳 Adicionar créditos (R$ 0,99/questão)
🎓 Assinar o plano Calouro
⭐ Assinar o plano Veterano

Acesse passarei.com.br para ativar! 🚀`;
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

// ============================================
// REDAÇÃO - VERIFICAR ACESSO
// ============================================
export interface EssayAccessResult {
  canAccess: boolean;
  reason: "veterano_free" | "paid" | "no_access" | "no_credits";
  freeRemaining?: number;
  credits?: number;
  price?: number;
  message?: string;
}

export async function checkEssayAccess(
  telegramId: string,
): Promise<EssayAccessResult> {
  try {
    const result = await db.execute(sql`
      SELECT
        "plan",
        "credits",
        "monthlyEssaysUsed",
        "lastEssayMonth"
      FROM "User"
      WHERE "telegramId" = ${telegramId}
    `);

    if (result.length === 0) {
      return {
        canAccess: false,
        reason: "no_access",
        message: "Usuário não encontrado",
      };
    }

    const user = result[0] as any;
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const lastMonth = user.lastEssayMonth || "";

    // Reset contador mensal se mudou de mês
    let essaysUsed = user.monthlyEssaysUsed || 0;
    if (lastMonth !== currentMonth) {
      await db.execute(sql`
        UPDATE "User"
        SET "monthlyEssaysUsed" = 0, "lastEssayMonth" = ${currentMonth}
        WHERE "telegramId" = ${telegramId}
      `);
      essaysUsed = 0;
    }

    // 1. VETERANO - tem 2 redações grátis/mês
    if (user.plan === "VETERANO") {
      const freeRemaining = VETERANO_MONTHLY_ESSAYS - essaysUsed;
      if (freeRemaining > 0) {
        return {
          canAccess: true,
          reason: "veterano_free",
          freeRemaining: freeRemaining,
          message: `✅ Redação GRÁTIS do plano Veterano! (${freeRemaining} restante${freeRemaining > 1 ? "s" : ""} este mês)`,
        };
      }
    }

    // 2. TEM CRÉDITOS - pode pagar R$ 1,99
    const credits = parseFloat(user.credits) || 0;
    if (credits >= PRICE_PER_ESSAY) {
      return {
        canAccess: true,
        reason: "paid",
        credits: credits,
        price: PRICE_PER_ESSAY,
        message: `💰 Correção de redação: R$ ${PRICE_PER_ESSAY.toFixed(2)} (Saldo atual: R$ ${credits.toFixed(2)})`,
      };
    }

    // 3. SEM ACESSO - precisa de créditos ou plano
    return {
      canAccess: false,
      reason: "no_credits",
      credits: credits,
      price: PRICE_PER_ESSAY,
      message: getNoEssayCreditsMessage(user.plan, credits),
    };
  } catch (error) {
    console.error("❌ Erro ao verificar acesso à redação:", error);
    return { canAccess: false, reason: "no_access", message: "Erro interno" };
  }
}

function getNoEssayCreditsMessage(plan: string, credits: number): string {
  if (plan === "VETERANO") {
    return `📝 *SUAS REDAÇÕES GRÁTIS ACABARAM!*

Você já usou suas 2 correções grátis este mês.

💰 *Redação extra:* R$ ${PRICE_PER_ESSAY.toFixed(2)}
💳 *Seu saldo:* R$ ${credits.toFixed(2)}

Adicione créditos para continuar! 👇`;
  }

  return `📝 *CORREÇÃO DE REDAÇÃO*

A correção de redações está disponível para:

⭐ *PLANO VETERANO*
✅ 2 correções GRÁTIS por mês
✅ Extras por R$ ${PRICE_PER_ESSAY.toFixed(2)} cada

💳 *PAY-PER-USE*
R$ ${PRICE_PER_ESSAY.toFixed(2)} por correção

Seu saldo atual: R$ ${credits.toFixed(2)}

👇 Escolha uma opção para continuar:`;
}

// ============================================
// REDAÇÃO - CONSUMIR (DEBITAR)
// ============================================
export async function consumeEssay(
  telegramId: string,
  accessType: EssayAccessResult["reason"],
): Promise<boolean> {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);

    if (accessType === "veterano_free") {
      await db.execute(sql`
        UPDATE "User"
        SET "monthlyEssaysUsed" = COALESCE("monthlyEssaysUsed", 0) + 1,
            "lastEssayMonth" = ${currentMonth},
            "totalEssaysSubmitted" = COALESCE("totalEssaysSubmitted", 0) + 1,
            "updatedAt" = NOW()
        WHERE "telegramId" = ${telegramId}
      `);
      console.log(`📝 Redação grátis consumida para ${telegramId}`);
    } else if (accessType === "paid") {
      await db.execute(sql`
        UPDATE "User"
        SET "credits" = COALESCE("credits", 0) - ${PRICE_PER_ESSAY},
            "monthlyEssaysUsed" = COALESCE("monthlyEssaysUsed", 0) + 1,
            "lastEssayMonth" = ${currentMonth},
            "totalEssaysSubmitted" = COALESCE("totalEssaysSubmitted", 0) + 1,
            "totalSpent" = COALESCE("totalSpent", 0) + ${PRICE_PER_ESSAY},
            "updatedAt" = NOW()
        WHERE "telegramId" = ${telegramId}
      `);
      console.log(`💰 Redação paga consumida para ${telegramId}: R$ ${PRICE_PER_ESSAY}`);
    }

    return true;
  } catch (error) {
    console.error("❌ Erro ao consumir redação:", error);
    return false;
  }
}

// ============================================
// REDAÇÃO - OBTER STATUS DO MÊS
// ============================================
export async function getEssayStatus(
  telegramId: string,
): Promise<{ plan: string; used: number; freeLimit: number; credits: number }> {
  try {
    const result = await db.execute(sql`
      SELECT
        "plan",
        "credits",
        "monthlyEssaysUsed",
        "lastEssayMonth"
      FROM "User"
      WHERE "telegramId" = ${telegramId}
    `);

    if (result.length === 0) {
      return { plan: "FREE", used: 0, freeLimit: 0, credits: 0 };
    }

    const user = result[0] as any;
    const currentMonth = new Date().toISOString().slice(0, 7);
    const lastMonth = user.lastEssayMonth || "";

    // Se mudou de mês, contador reseta
    const essaysUsed = lastMonth === currentMonth ? (user.monthlyEssaysUsed || 0) : 0;
    const freeLimit = user.plan === "VETERANO" ? VETERANO_MONTHLY_ESSAYS : 0;

    return {
      plan: user.plan || "FREE",
      used: essaysUsed,
      freeLimit: freeLimit,
      credits: parseFloat(user.credits) || 0,
    };
  } catch (error) {
    console.error("❌ Erro ao buscar status de redação:", error);
    return { plan: "FREE", used: 0, freeLimit: 0, credits: 0 };
  }
}

// ============================================
// SM2 - REVISÃO ESPAÇADA (VETERANO EXCLUSIVO)
// ============================================

export interface SM2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
}

/**
 * Calcula os novos parâmetros SM2 baseado na qualidade da resposta
 * @param quality - Qualidade da resposta (0-5)
 *   0 - Resposta errada, não lembrou nada
 *   1 - Resposta errada, mas reconheceu após ver
 *   2 - Resposta errada, mas era familiar
 *   3 - Resposta correta com dificuldade
 *   4 - Resposta correta após hesitação
 *   5 - Resposta correta imediatamente
 * @param currentEF - Ease Factor atual (1.3 a 5.0)
 * @param currentInterval - Intervalo atual em dias
 * @param repetitions - Número de repetições consecutivas corretas
 */
export function calculateSM2(
  quality: number,
  currentEF: number = 2.5,
  currentInterval: number = 1,
  repetitions: number = 0,
): SM2Result {
  // Limitar quality entre 0 e 5
  quality = Math.max(0, Math.min(5, Math.round(quality)));

  // Novo Ease Factor
  let newEF =
    currentEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // EF mínimo é 1.3
  newEF = Math.max(1.3, newEF);

  let newInterval: number;
  let newRepetitions: number;

  if (quality < 3) {
    // Resposta incorreta - reiniciar
    newRepetitions = 0;
    newInterval = 1;
  } else {
    // Resposta correta - progresso
    newRepetitions = repetitions + 1;

    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(currentInterval * newEF);
    }
  }

  // Calcular próxima data de revisão
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    easeFactor: Math.round(newEF * 100) / 100,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate: nextReviewDate,
  };
}

/**
 * Converte acerto/erro simples em quality SM2
 * @param correct - Se acertou a questão
 * @param responseTimeMs - Tempo de resposta em ms (opcional)
 */
export function getQualityFromAnswer(
  correct: boolean,
  responseTimeMs?: number,
): number {
  if (!correct) {
    return 1; // Errou, mas viu a resposta
  }

  // Se acertou, classificar pela velocidade
  if (responseTimeMs) {
    if (responseTimeMs < 5000) return 5; // < 5s = perfeito
    if (responseTimeMs < 15000) return 4; // < 15s = bom
    if (responseTimeMs < 30000) return 3; // < 30s = ok
  }

  return 4; // Default para acertos
}

/**
 * Registra ou atualiza revisão SM2 para um conteúdo
 */
export async function recordSM2Review(
  telegramId: string,
  contentId: string,
  correct: boolean,
  responseTimeMs?: number,
): Promise<boolean> {
  try {
    // Buscar userId
    const userResult = await db.execute(sql`
      SELECT "id", "plan" FROM "User" WHERE "telegramId" = ${telegramId}
    `);

    if (userResult.length === 0) return false;
    const user = userResult[0] as any;

    // SM2 é exclusivo para VETERANO
    if (user.plan !== "VETERANO") {
      console.log(`[SM2] Usuário ${telegramId} não é VETERANO, pulando SM2`);
      return true;
    }

    const quality = getQualityFromAnswer(correct, responseTimeMs);

    // Verificar se já existe registro SM2 para este conteúdo
    const existingResult = await db.execute(sql`
      SELECT * FROM "sm2_reviews"
      WHERE "user_id" = ${user.id} AND "content_id" = ${contentId}
    `);

    if (existingResult.length > 0) {
      // Atualizar registro existente
      const existing = existingResult[0] as any;
      const sm2 = calculateSM2(
        quality,
        existing.ease_factor || 2.5,
        existing.interval || 1,
        existing.repetitions || 0,
      );

      await db.execute(sql`
        UPDATE "sm2_reviews"
        SET
          "ease_factor" = ${sm2.easeFactor},
          "interval" = ${sm2.interval},
          "repetitions" = ${sm2.repetitions},
          "next_review_date" = ${sm2.nextReviewDate},
          "last_quality" = ${quality},
          "times_correct" = "times_correct" + ${correct ? 1 : 0},
          "times_incorrect" = "times_incorrect" + ${correct ? 0 : 1},
          "total_reviews" = "total_reviews" + 1,
          "last_reviewed_at" = NOW(),
          "updated_at" = NOW()
        WHERE "user_id" = ${user.id} AND "content_id" = ${contentId}
      `);

      console.log(
        `[SM2] Atualizado: ${contentId} | EF: ${sm2.easeFactor} | Intervalo: ${sm2.interval}d | Próxima: ${sm2.nextReviewDate.toISOString().split("T")[0]}`,
      );
    } else {
      // Criar novo registro
      const sm2 = calculateSM2(quality);

      await db.execute(sql`
        INSERT INTO "sm2_reviews" (
          "user_id", "content_id",
          "ease_factor", "interval", "repetitions", "next_review_date",
          "last_quality", "times_correct", "times_incorrect", "total_reviews",
          "first_seen_at", "last_reviewed_at"
        ) VALUES (
          ${user.id}, ${contentId},
          ${sm2.easeFactor}, ${sm2.interval}, ${sm2.repetitions}, ${sm2.nextReviewDate},
          ${quality}, ${correct ? 1 : 0}, ${correct ? 0 : 1}, 1,
          NOW(), NOW()
        )
      `);

      console.log(
        `[SM2] Novo registro: ${contentId} | Próxima revisão: ${sm2.nextReviewDate.toISOString().split("T")[0]}`,
      );
    }

    return true;
  } catch (error) {
    console.error("❌ [SM2] Erro ao registrar revisão:", error);
    return false;
  }
}

/**
 * Busca conteúdos pendentes de revisão para usuário VETERANO
 * Retorna os que precisam ser revisados (nextReviewDate <= hoje)
 */
export async function getSM2DueReviews(
  telegramId: string,
  examType: string,
  limit: number = 10,
): Promise<string[]> {
  try {
    // Buscar userId
    const userResult = await db.execute(sql`
      SELECT "id", "plan" FROM "User" WHERE "telegramId" = ${telegramId}
    `);

    if (userResult.length === 0) return [];
    const user = userResult[0] as any;

    // SM2 é exclusivo para VETERANO
    if (user.plan !== "VETERANO") return [];

    // Buscar conteúdos pendentes de revisão
    const dueResult = await db.execute(sql`
      SELECT r."content_id"
      FROM "sm2_reviews" r
      JOIN "Content" c ON r."content_id" = c."id"
      WHERE r."user_id" = ${user.id}
        AND r."next_review_date" <= NOW()
        AND c."examType" = ${examType}
        AND c."isActive" = true
      ORDER BY r."next_review_date" ASC
      LIMIT ${limit}
    `);

    return dueResult.map((r: any) => r.content_id);
  } catch (error) {
    console.error("❌ [SM2] Erro ao buscar revisões pendentes:", error);
    return [];
  }
}

/**
 * Obtém estatísticas SM2 do usuário
 */
export async function getSM2Stats(telegramId: string): Promise<{
  totalCards: number;
  dueToday: number;
  averageEF: number;
  longestStreak: number;
}> {
  try {
    const userResult = await db.execute(sql`
      SELECT "id" FROM "User" WHERE "telegramId" = ${telegramId}
    `);

    if (userResult.length === 0) {
      return { totalCards: 0, dueToday: 0, averageEF: 2.5, longestStreak: 0 };
    }

    const user = userResult[0] as any;

    const statsResult = await db.execute(sql`
      SELECT
        COUNT(*) as total_cards,
        COUNT(CASE WHEN "next_review_date" <= NOW() THEN 1 END) as due_today,
        COALESCE(AVG("ease_factor"), 2.5) as avg_ef,
        COALESCE(MAX("repetitions"), 0) as longest_streak
      FROM "sm2_reviews"
      WHERE "user_id" = ${user.id}
    `);

    const stats = statsResult[0] as any;

    return {
      totalCards: parseInt(stats.total_cards) || 0,
      dueToday: parseInt(stats.due_today) || 0,
      averageEF: parseFloat(stats.avg_ef) || 2.5,
      longestStreak: parseInt(stats.longest_streak) || 0,
    };
  } catch (error) {
    console.error("❌ [SM2] Erro ao buscar estatísticas:", error);
    return { totalCards: 0, dueToday: 0, averageEF: 2.5, longestStreak: 0 };
  }
}
