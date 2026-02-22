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
        "planStatus",
        "planEndDate",
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

    // Verificar planStatus e expiração
    const planUpper = (user.plan || "").toUpperCase();
    const planStatus = (user.planStatus || "").toLowerCase();
    const planEndDate = user.planEndDate ? new Date(user.planEndDate) : null;
    const isPlanActive = planStatus === "active" && (!planEndDate || planEndDate >= new Date());

    // 1. VETERANO - tem limite diário de 30 questões
    if (planUpper === "VETERANO" && isPlanActive) {
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
    if (planUpper === "CALOURO" && isPlanActive) {
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
        "planStatus",
        "planEndDate",
        "examType",
        "lastStudyContentIds"
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

    // 1. PLANO ATIVO (VETERANO ou CALOURO) - verificar planStatus + expiração
    const planUpper = (user.plan || "").toUpperCase();
    if (planUpper === "VETERANO" || planUpper === "CALOURO") {
      // Verificar se o plano está ativo e não expirou
      const planStatus = (user.planStatus || "").toLowerCase();
      const planEndDate = user.planEndDate ? new Date(user.planEndDate) : null;
      const isExpired = planEndDate && planEndDate < new Date();

      if (planStatus === "active" && !isExpired) {
        return {
          isActive: true,
          reason: "has_plan",
          plan: planUpper,
          message: `✅ Plano ${planUpper} ativo`,
        };
      }
      // Plano existe mas inativo/expirado → continuar verificação (créditos, etc.)
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
    const studiedCount = safeParseJson(user.lastStudyContentIds, []).length;
    return {
      isActive: false,
      reason: "inactive",
      credits: credits,
      message: getInactiveMessage(freeRemaining <= 0 && !isFirstDay, user.examType, studiedCount),
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

function getInactiveMessage(expiredFreeQuestions: boolean, examType?: string, studiedCount?: number): string {
  const statsLine = (studiedCount && studiedCount > 0)
    ? `\n📊 Você já estudou *${studiedCount} questão(ões)*${examType ? ` para *${examType}*` : ""}. Não pare agora!\n`
    : "";

  if (expiredFreeQuestions) {
    return `⏰ *SUAS QUESTÕES GRÁTIS EXPIRARAM!*
${statsLine}
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
${statsLine}
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
    studySchedule?: string;
    facilidades?: string[];
    dificuldades?: string[];
  },
): Promise<boolean> {
  try {
    const facilidadesJson = JSON.stringify(data.facilidades || []);
    const dificuldadesJson = JSON.stringify(data.dificuldades || []);

    await db.execute(sql`
      UPDATE "User"
      SET "examType" = ${data.examType || null},
          "state" = ${data.state || null},
          "cargo" = ${data.cargo || null},
          "nivelConhecimento" = ${data.nivelConhecimento || null},
          "studySchedule" = ${data.studySchedule || null},
          "facilidades" = ${facilidadesJson},
          "dificuldades" = ${dificuldadesJson},
          "onboardingCompleted" = true,
          "updatedAt" = NOW()
      WHERE "telegramId" = ${telegramId}
    `);
    console.log(`✅ Onboarding atualizado para ${telegramId} (schedule: ${data.studySchedule})`);
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
 * Usa tabela SpacedReview (Prisma)
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

    // Verificar se já existe registro na tabela SpacedReview
    const existingResult = await db.execute(sql`
      SELECT * FROM "SpacedReview"
      WHERE "userId" = ${user.id} AND "contentId" = ${contentId}
    `);

    if (existingResult.length > 0) {
      // Atualizar registro existente
      const existing = existingResult[0] as any;
      const sm2 = calculateSM2(
        quality,
        existing.easinessFactor || 2.5,
        existing.interval || 1,
        existing.reviewNumber || 0,
      );

      await db.execute(sql`
        UPDATE "SpacedReview"
        SET
          "easinessFactor" = ${sm2.easeFactor},
          "interval" = ${sm2.interval},
          "reviewNumber" = ${sm2.repetitions},
          "scheduledFor" = ${sm2.nextReviewDate.toISOString()},
          "quality" = ${quality},
          "wasSuccessful" = ${correct},
          "status" = 'CONCLUIDA',
          "completedAt" = NOW(),
          "updatedAt" = NOW()
        WHERE "userId" = ${user.id} AND "contentId" = ${contentId}
      `);

      console.log(
        `[SM2] Atualizado: ${contentId} | EF: ${sm2.easeFactor} | Intervalo: ${sm2.interval}d | Próxima: ${sm2.nextReviewDate.toISOString().split("T")[0]}`,
      );
    } else {
      // Criar novo registro
      const sm2 = calculateSM2(quality);
      const id = `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`.slice(0, 25);

      await db.execute(sql`
        INSERT INTO "SpacedReview" (
          "id", "userId", "contentId",
          "easinessFactor", "interval", "reviewNumber", "scheduledFor",
          "quality", "wasSuccessful", "status",
          "completedAt", "createdAt", "updatedAt"
        ) VALUES (
          ${id}, ${user.id}, ${contentId},
          ${sm2.easeFactor}, ${sm2.interval}, ${sm2.repetitions}, ${sm2.nextReviewDate.toISOString()},
          ${quality}, ${correct}, 'CONCLUIDA',
          NOW(), NOW(), NOW()
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
 * Retorna os que precisam ser revisados (scheduledFor <= hoje)
 * Usa tabela SpacedReview (Prisma)
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
      SELECT r."contentId"
      FROM "SpacedReview" r
      JOIN "Content" c ON r."contentId" = c."id"
      WHERE r."userId" = ${user.id}
        AND r."scheduledFor" <= NOW()
        AND c."isActive" = true
      ORDER BY r."scheduledFor" ASC
      LIMIT ${limit}
    `);

    return dueResult.map((r: any) => r.contentId);
  } catch (error) {
    console.error("❌ [SM2] Erro ao buscar revisões pendentes:", error);
    return [];
  }
}

/**
 * Obtém estatísticas SM2 do usuário
 * Usa tabela SpacedReview (Prisma)
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
        COUNT(CASE WHEN "scheduledFor" <= NOW() THEN 1 END) as due_today,
        COALESCE(AVG("easinessFactor"), 2.5) as avg_ef,
        COALESCE(MAX("reviewNumber"), 0) as longest_streak
      FROM "SpacedReview"
      WHERE "userId" = ${user.id}
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

// ============================================
// QUESTÕES - BUSCAR E REGISTRAR
// ============================================

/**
 * Busca uma questão real do banco para o subject dado
 * Evita questões já usadas na sessão
 */
export async function getQuestionForSubject(
  subjectId: string,
  usedQuestionIds: string[] = [],
  difficulty?: string,
): Promise<any | null> {
  try {
    const usedClause = usedQuestionIds.length > 0
      ? sql`AND q."id" NOT IN (${sql.join(usedQuestionIds.map((id) => sql`${id}`), sql`, `)})`
      : sql``;

    const difficultyClause = difficulty
      ? sql`AND q."difficulty" = ${difficulty}`
      : sql``;

    // D1: Excluir questões REJEITADAS pelo Professor Revisor
    const reviewClause = sql`AND (q."reviewStatus" IS NULL OR q."reviewStatus" != 'REJEITADO')`;

    const result = await db.execute(sql`
      SELECT q.* FROM "Question" q
      WHERE q."subjectId" = ${subjectId}
        AND q."isActive" = true
        ${usedClause}
        ${difficultyClause}
        ${reviewClause}
      ORDER BY q."timesUsed" ASC, RANDOM()
      LIMIT 1
    `) as any[];

    if (result.length > 0) {
      // Incrementar timesUsed
      await db.execute(sql`
        UPDATE "Question" SET "timesUsed" = "timesUsed" + 1
        WHERE "id" = ${result[0].id}
      `);
      return result[0];
    }

    // Fallback: sem filtro de dificuldade
    if (difficulty) {
      return getQuestionForSubject(subjectId, usedQuestionIds);
    }

    return null;
  } catch (error) {
    console.error("❌ Erro ao buscar questão:", error);
    return null;
  }
}

/**
 * Busca questão vinculada ao conteúdo: primeiro por topicId, depois por subjectId
 */
export async function getQuestionForContent(
  subjectId: string,
  topicId: string | null,
  usedQuestionIds: string[] = [],
): Promise<any | null> {
  try {
    const usedClause = usedQuestionIds.length > 0
      ? sql`AND q."id" NOT IN (${sql.join(usedQuestionIds.map((id) => sql`${id}`), sql`, `)})`
      : sql``;

    // D1: Excluir questões REJEITADAS pelo Professor Revisor
    const reviewClause = sql`AND (q."reviewStatus" IS NULL OR q."reviewStatus" != 'REJEITADO')`;

    // 1. Tentar por topicId (mais preciso)
    if (topicId) {
      const byTopic = await db.execute(sql`
        SELECT q.* FROM "Question" q
        WHERE q."topicId" = ${topicId}
          AND q."isActive" = true
          ${usedClause}
          ${reviewClause}
        ORDER BY q."timesUsed" ASC, RANDOM()
        LIMIT 1
      `) as any[];

      if (byTopic.length > 0) {
        await db.execute(sql`
          UPDATE "Question" SET "timesUsed" = "timesUsed" + 1
          WHERE "id" = ${byTopic[0].id}
        `);
        console.log(`✅ [Question] Encontrada por topicId: ${byTopic[0].id}`);
        return byTopic[0];
      }
      console.log(`⚠️ [Question] Nenhuma questão para topicId ${topicId}, tentando subjectId...`);
    }

    // 2. Fallback: por subjectId
    return getQuestionForSubject(subjectId, usedQuestionIds);
  } catch (error) {
    console.error("❌ Erro ao buscar questão por conteúdo:", error);
    return null;
  }
}

/**
 * Registra tentativa de resposta a uma questão
 */
export async function recordQuestionAttempt(
  telegramId: string,
  questionId: string,
  userAnswer: string,
  isCorrect: boolean,
  attemptType: string = "QUIZ_FIXACAO",
): Promise<boolean> {
  try {
    const userResult = await db.execute(sql`
      SELECT "id" FROM "User" WHERE "telegramId" = ${telegramId}
    `);

    if (userResult.length === 0) return false;
    const userId = (userResult[0] as any).id;

    const id = `qa${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`.slice(0, 25);

    await db.execute(sql`
      INSERT INTO "QuestionAttempt" (
        "id", "userId", "questionId", "userAnswer",
        "isCorrect", "attemptType", "reviewAttempt", "createdAt"
      ) VALUES (
        ${id}, ${userId}, ${questionId}, ${userAnswer},
        ${isCorrect}, ${attemptType}, false, NOW()
      )
    `);

    console.log(`💾 [QuestionAttempt] ${telegramId}: ${isCorrect ? "✅" : "❌"} (${questionId})`);
    return true;
  } catch (error) {
    console.error("❌ Erro ao registrar tentativa:", error);
    return false;
  }
}

// ============================================
// CONCURSOS E CARGOS - BUSCAR DO BANCO
// ============================================

// Fallback para concursos (usado se banco falhar)
const CONCURSOS_FALLBACK = [
  { sigla: "PF", nome: "Polícia Federal", esfera: "FEDERAL" },
  { sigla: "PRF", nome: "Polícia Rodoviária Federal", esfera: "FEDERAL" },
  { sigla: "PM", nome: "Polícia Militar", esfera: "ESTADUAL" },
  { sigla: "PC", nome: "Polícia Civil", esfera: "ESTADUAL" },
  { sigla: "CBM", nome: "Corpo de Bombeiros Militar", esfera: "ESTADUAL" },
  { sigla: "GM", nome: "Guarda Municipal", esfera: "MUNICIPAL" },
  { sigla: "PP_ESTADUAL", nome: "Polícia Penal Estadual", esfera: "ESTADUAL" },
  { sigla: "PP_FEDERAL", nome: "Polícia Penal Federal", esfera: "FEDERAL" },
  { sigla: "PL_ESTADUAL", nome: "Polícia Legislativa Estadual", esfera: "ESTADUAL" },
  { sigla: "PL_FEDERAL", nome: "Polícia Legislativa Federal", esfera: "FEDERAL" },
];

// Fallback para cargos (usado se banco falhar)
const CARGOS_FALLBACK: Record<string, string[]> = {
  PF: ["Agente", "Escrivão", "Delegado", "Perito Criminal"],
  PRF: ["Policial Rodoviário Federal"],
  PM: ["Soldado", "Aspirante a Oficial"],
  PC: ["Delegado", "Escrivão", "Investigador", "Agente de Polícia", "Perito Criminal"],
  CBM: ["Soldado", "Aspirante a Oficial"],
  GM: ["Guarda Municipal"],
  PP_ESTADUAL: ["Agente Penitenciário"],
  PP_FEDERAL: ["Agente Federal Penitenciário"],
  PL_ESTADUAL: ["Agente de Polícia Legislativa"],
  PL_FEDERAL: ["Policial Legislativo Federal"],
};

/**
 * Busca todos os concursos do banco de dados
 * Se falhar, retorna fallback hardcoded
 */
export async function getConcursosFromDB(): Promise<
  { sigla: string; nome: string; esfera: string }[]
> {
  try {
    const result = await db.execute(sql`
      SELECT sigla, nome, esfera
      FROM concursos
      WHERE is_active = true
      ORDER BY ordem, esfera, nome
    `);

    if (result.length > 0) {
      console.log(`✅ [DB] ${result.length} concursos carregados do banco`);
      return result as any[];
    }

    console.log("⚠️ [DB] Nenhum concurso no banco, usando fallback");
    return CONCURSOS_FALLBACK;
  } catch (error) {
    console.error("❌ [DB] Erro ao buscar concursos:", error);
    return CONCURSOS_FALLBACK;
  }
}

/**
 * Busca cargos de um concurso específico
 * Se falhar, retorna fallback hardcoded
 */
export async function getCargosFromDB(
  concursoSigla: string
): Promise<{ id: string; nome: string; codigo: string }[]> {
  try {
    const result = await db.execute(sql`
      SELECT cg.id, cg.nome, cg.codigo
      FROM cargos cg
      JOIN concursos c ON c.id = cg.concurso_id
      WHERE c.sigla = ${concursoSigla}
        AND cg.is_active = true
        AND c.is_active = true
      ORDER BY cg.ordem, cg.nome
    `);

    if (result.length > 0) {
      console.log(`✅ [DB] ${result.length} cargos para ${concursoSigla}`);
      return result as any[];
    }

    // Fallback: usar lista hardcoded
    const fallback = CARGOS_FALLBACK[concursoSigla] || [];
    console.log(`⚠️ [DB] Usando fallback para cargos de ${concursoSigla}`);
    return fallback.map((nome, idx) => ({
      id: `fallback_${idx}`,
      nome,
      codigo: nome.toUpperCase().replace(/\s+/g, "_"),
    }));
  } catch (error) {
    console.error(`❌ [DB] Erro ao buscar cargos de ${concursoSigla}:`, error);
    const fallback = CARGOS_FALLBACK[concursoSigla] || [];
    return fallback.map((nome, idx) => ({
      id: `fallback_${idx}`,
      nome,
      codigo: nome.toUpperCase().replace(/\s+/g, "_"),
    }));
  }
}

/**
 * Busca matérias de um cargo específico
 */
export async function getMateriasFromDB(
  cargoId: string
): Promise<{ id: string; nome: string; codigo: string }[]> {
  try {
    const result = await db.execute(sql`
      SELECT cm.id, cm.nome, cm.codigo
      FROM cargo_materias cm
      WHERE cm.cargo_id = ${cargoId}
        AND cm.is_active = true
      ORDER BY cm.ordem, cm.nome
    `);

    return result as any[];
  } catch (error) {
    console.error(`❌ [DB] Erro ao buscar matérias do cargo ${cargoId}:`, error);
    return [];
  }
}

// Categorias hierárquicas de concursos para o bot — 9 grupos oficiais
const SIGLAS_EXER_BOT    = new Set(["ESPCEX", "IME", "ESA"]);
const SIGLAS_MARINHA_BOT = new Set(["CN", "EN", "FUZNAVAIS"]);
const SIGLAS_FAB_BOT     = new Set(["ITA", "EPCAR", "EAGS", "FAB", "MIN_DEF", "MD"]);
const SIGLAS_INTEL_BOT   = new Set(["ABIN", "ANAC", "CPNU"]);
const SIGLAS_GUARDAS_BOT = new Set(["GM", "GP", "PPE", "PP_ESTADUAL", "PL_ESTADUAL"]);

export const BOT_CATEGORIES: { key: string; label: string; emoji: string; siglaMatch: (s: string) => boolean }[] = [
  {
    key: "FED", label: "Carreiras Federais", emoji: "🛡️",
    siglaMatch: (s) =>
      (s.startsWith("PF") && s !== "PFF") || s === "PRF" || s === "PFF" ||
      ["PPF", "PP_FEDERAL", "PLF", "PL_FEDERAL", "PJ_CNJ"].includes(s) ||
      s.startsWith("PJ"),
  },
  {
    key: "EXER", label: "Exercito", emoji: "⚔️",
    siglaMatch: (s) => SIGLAS_EXER_BOT.has(s),
  },
  {
    key: "MARINHA", label: "Marinha", emoji: "⚓",
    siglaMatch: (s) => SIGLAS_MARINHA_BOT.has(s),
  },
  {
    key: "FAB", label: "Aeronautica", emoji: "✈️",
    siglaMatch: (s) => SIGLAS_FAB_BOT.has(s),
  },
  {
    key: "PM", label: "Policia Militar", emoji: "🚔",
    siglaMatch: (s) => s.startsWith("PM") || s === "PM",
  },
  {
    key: "PC", label: "Policia Civil", emoji: "🕵️",
    siglaMatch: (s) => s.startsWith("PC") || s === "PC" || s === "PC_CIENT",
  },
  {
    key: "CBM", label: "Corpo de Bombeiros", emoji: "🚒",
    siglaMatch: (s) => s.startsWith("CBM") || s === "CBM",
  },
  {
    key: "GUARDAS", label: "Guardas", emoji: "🛡️",
    siglaMatch: (s) => SIGLAS_GUARDAS_BOT.has(s),
  },
  {
    key: "INTEL", label: "Inteligencia / Administracao", emoji: "🔍",
    siglaMatch: (s) => SIGLAS_INTEL_BOT.has(s),
  },
];

function groupConcursosByCategory(
  concursos: { sigla: string; nome: string; esfera: string }[]
): Record<string, { sigla: string; nome: string; esfera: string }[]> {
  const groups: Record<string, { sigla: string; nome: string; esfera: string }[]> = {};
  const assigned = new Set<string>();

  for (const cat of BOT_CATEGORIES) {
    const matching = concursos.filter(c => !assigned.has(c.sigla) && cat.siglaMatch(c.sigla));
    if (matching.length > 0) {
      groups[cat.key] = matching;
      matching.forEach(c => assigned.add(c.sigla));
    }
  }

  // Catch-all: anything unassigned goes to GUARDAS
  const remaining = concursos.filter(c => !assigned.has(c.sigla));
  if (remaining.length > 0) {
    groups["GUARDAS"] = [...(groups["GUARDAS"] || []), ...remaining];
  }

  return groups;
}

/**
 * Gera teclado de CATEGORIAS (Nível 1) para seleção de concurso.
 * Callback usa cat:{prefix}:{CATEGORY_KEY} para codificar o contexto.
 * @param prefix - "onb_" para onboarding, "concurso_" para /concurso
 */
export async function generateConcursosKeyboard(
  prefix: string = "onb_"
): Promise<{
  inline_keyboard: { text: string; callback_data: string }[][];
}> {
  const concursos = await getConcursosFromDB();
  const groups = groupConcursosByCategory(concursos);

  const rows: { text: string; callback_data: string }[][] = BOT_CATEGORIES
    .filter(cat => groups[cat.key]?.length > 0)
    .map(cat => [{
      text: `${cat.emoji} ${cat.label}`,
      callback_data: `cat:${prefix}:${cat.key}`,
    }]);

  return { inline_keyboard: rows };
}

/**
 * Gera teclado de CONCURSOS (Nível 2) para uma categoria específica.
 * Inclui botão "Voltar" para retornar às categorias.
 * @param categoryKey - chave da categoria (ex: "PF", "PM")
 * @param prefix - "onb_" para onboarding, "concurso_" para /concurso
 */
export async function generateConcursosByCategoryKeyboard(
  categoryKey: string,
  prefix: string = "onb_"
): Promise<{
  inline_keyboard: { text: string; callback_data: string }[][];
}> {
  const concursos = await getConcursosFromDB();
  const groups = groupConcursosByCategory(concursos);
  const items = groups[categoryKey] || [];

  const rows: { text: string; callback_data: string }[][] = [];
  let currentRow: { text: string; callback_data: string }[] = [];

  for (const c of items) {
    currentRow.push({ text: c.nome, callback_data: `${prefix}${c.sigla}` });
    if (currentRow.length === 2) {
      rows.push(currentRow);
      currentRow = [];
    }
  }
  if (currentRow.length > 0) rows.push(currentRow);
  rows.push([{ text: "⬅️ Voltar às categorias", callback_data: `cat:${prefix}:BACK` }]);

  return { inline_keyboard: rows };
}

/**
 * Gera teclado inline do Telegram para seleção de cargo
 */
export async function generateCargosKeyboard(
  concursoSigla: string
): Promise<{
  inline_keyboard: { text: string; callback_data: string }[][];
}> {
  const cargos = await getCargosFromDB(concursoSigla);

  // Ícones por tipo de cargo
  const icons: Record<string, string> = {
    DELEGADO: "👔", AGENTE: "🎯", ESCRIVAO: "📝", PERITO: "🔬",
    SOLDADO: "⭐", OFICIAL: "🎖️", POLICIAL: "🚔", GUARDA: "🛡️",
    INSPETOR: "📋", INVESTIGADOR: "🕵️", PAPILOSCOPISTA: "🔍",
  };

  const getIcon = (codigo: string): string => {
    for (const [key, icon] of Object.entries(icons)) {
      if (codigo.toUpperCase().includes(key)) return icon;
    }
    return "👤";
  };

  const rows: { text: string; callback_data: string }[][] = [];

  for (const cargo of cargos) {
    const icon = getIcon(cargo.codigo);
    rows.push([
      {
        text: `${icon} ${cargo.nome}`,
        callback_data: `cargo_${cargo.codigo}`,
      },
    ]);
  }

  return { inline_keyboard: rows };
}

// ============================================
// LEMBRETES DE ESTUDO - FUNÇÕES
// ============================================

/**
 * Mapeamento de horários de envio por schedule
 * manha → 06:00, tarde → 12:00, noite → 18:00
 * manha_tarde → 06:00 e 12:00, tarde_noite → 12:00 e 18:00
 */
export const SCHEDULE_HOURS: Record<string, number[]> = {
  manha: [6],
  tarde: [12],
  noite: [18],
  manha_tarde: [6, 12],
  tarde_noite: [12, 18],
};

/**
 * Busca usuários que devem receber lembrete neste horário
 * Filtra por: schedule compatível, reminderEnabled, onboardingCompleted, isActive
 * Verifica se ainda não atingiu limite diário
 */
export async function getUsersForReminder(currentHour: number): Promise<any[]> {
  try {
    // Buscar todos os schedules que incluem este horário
    const matchingSchedules: string[] = [];
    for (const [schedule, hours] of Object.entries(SCHEDULE_HOURS)) {
      if (hours.includes(currentHour)) {
        matchingSchedules.push(schedule);
      }
    }

    if (matchingSchedules.length === 0) return [];

    const result = await db.execute(sql`
      SELECT
        "telegramId",
        "examType",
        "plan",
        "dailyContentCount",
        "lastContentDate",
        "firstInteractionDate",
        "firstDayFreeUsed",
        "credits",
        "studySchedule",
        "facilidades",
        "dificuldades",
        "lastStudyContentIds"
      FROM "User"
      WHERE "studySchedule" IN (${sql.join(matchingSchedules.map((s) => sql`${s}`), sql`, `)})
        AND "reminderEnabled" = true
        AND "onboardingCompleted" = true
        AND "isActive" = true
        AND "telegramId" IS NOT NULL
    `) as any[];

    // Filtrar quem ainda tem limite disponível hoje
    const today = new Date().toISOString().split("T")[0];
    const eligible: any[] = [];

    for (const user of result) {
      const lastDate = user.lastContentDate
        ? new Date(user.lastContentDate).toISOString().split("T")[0]
        : null;
      const dailyCount = lastDate === today ? (user.dailyContentCount || 0) : 0;

      let canSend = false;

      if (user.plan === "VETERANO") {
        canSend = dailyCount < VETERANO_DAILY_LIMIT;
      } else if (user.plan === "CALOURO") {
        canSend = dailyCount < CALOURO_DAILY_LIMIT;
      } else {
        // FREE: só no primeiro dia
        const firstDay = user.firstInteractionDate
          ? new Date(user.firstInteractionDate).toISOString().split("T")[0]
          : today;
        const isFirstDay = firstDay === today;
        const freeUsed = user.firstDayFreeUsed || 0;
        if (isFirstDay && freeUsed < FREE_QUESTIONS_FIRST_DAY) {
          canSend = true;
        } else {
          // Tem créditos?
          const credits = parseFloat(user.credits) || 0;
          canSend = credits >= PRICE_PER_QUESTION;
        }
      }

      if (canSend) {
        // Parse JSON fields
        user.facilidades = safeParseJson(user.facilidades, []);
        user.dificuldades = safeParseJson(user.dificuldades, []);
        user.lastStudyContentIds = safeParseJson(user.lastStudyContentIds, []);
        eligible.push(user);
      }
    }

    console.log(`📬 [Reminder] ${eligible.length}/${result.length} usuários elegíveis para hora ${currentHour}h`);
    return eligible;
  } catch (error) {
    console.error("❌ [Reminder] Erro ao buscar usuários:", error);
    return [];
  }
}

/**
 * Verifica se já enviou lembrete para este usuário hoje neste turno
 * Usa tabela Notification para deduplicação
 */
export async function hasReminderToday(
  telegramId: string,
  currentHour: number,
): Promise<boolean> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const turno = currentHour <= 11 ? "manha" : currentHour <= 17 ? "tarde" : "noite";

    // Buscar userId pelo telegramId
    const userResult = await db.execute(sql`
      SELECT "id" FROM "User" WHERE "telegramId" = ${telegramId}
    `) as any[];

    if (userResult.length === 0) return true; // Se não achar, não enviar

    const userId = userResult[0].id;

    const result = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM "Notification"
      WHERE "userId" = ${userId}
        AND "type" = 'LEMBRETE_ESTUDO'
        AND DATE("scheduledFor") = ${today}
        AND "metadata"::text LIKE ${`%"turno":"${turno}"%`}
    `) as any[];

    return parseInt(result[0]?.count || "0") > 0;
  } catch (error) {
    console.error("❌ [Reminder] Erro ao verificar lembrete:", error);
    return true; // Em caso de erro, não enviar duplicata
  }
}

/**
 * Registra que um lembrete foi enviado
 */
export async function recordReminderSent(
  telegramId: string,
  currentHour: number,
): Promise<void> {
  try {
    const turno = currentHour <= 11 ? "manha" : currentHour <= 17 ? "tarde" : "noite";

    // Buscar userId
    const userResult = await db.execute(sql`
      SELECT "id" FROM "User" WHERE "telegramId" = ${telegramId}
    `) as any[];

    if (userResult.length === 0) return;

    const userId = userResult[0].id;
    const id = `n${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`.slice(0, 25);

    await db.execute(sql`
      INSERT INTO "Notification" (
        "id", "userId", "type", "title", "message",
        "scheduledFor", "sentAt", "status", "metadata",
        "createdAt", "updatedAt"
      ) VALUES (
        ${id}, ${userId}, 'LEMBRETE_ESTUDO',
        'Lembrete de Estudo',
        ${'Lembrete automático enviado no turno ' + turno},
        NOW(), NOW(), 'ENVIADA',
        ${JSON.stringify({ turno, hour: currentHour })}::jsonb,
        NOW(), NOW()
      )
    `);
  } catch (error) {
    console.error("❌ [Reminder] Erro ao registrar lembrete:", error);
  }
}

/**
 * Salva progresso do estudo (conteúdos já vistos)
 */
export async function saveStudyProgress(
  telegramId: string,
  contentIds: string[],
): Promise<void> {
  try {
    const idsJson = JSON.stringify(contentIds);
    await db.execute(sql`
      UPDATE "User"
      SET "lastStudyContentIds" = ${idsJson},
          "updatedAt" = NOW()
      WHERE "telegramId" = ${telegramId}
    `);
  } catch (error) {
    console.error("❌ [Progress] Erro ao salvar progresso:", error);
  }
}

/**
 * Carrega progresso do estudo do banco
 */
export async function getStudyProgress(
  telegramId: string,
): Promise<{ facilidades: string[]; dificuldades: string[]; lastStudyContentIds: string[]; examType: string | null }> {
  try {
    const result = await db.execute(sql`
      SELECT "examType", "facilidades", "dificuldades", "lastStudyContentIds"
      FROM "User"
      WHERE "telegramId" = ${telegramId}
    `) as any[];

    if (result.length === 0) {
      return { facilidades: [], dificuldades: [], lastStudyContentIds: [], examType: null };
    }

    const user = result[0];
    return {
      examType: user.examType,
      facilidades: safeParseJson(user.facilidades, []),
      dificuldades: safeParseJson(user.dificuldades, []),
      lastStudyContentIds: safeParseJson(user.lastStudyContentIds, []),
    };
  } catch (error) {
    console.error("❌ [Progress] Erro ao carregar progresso:", error);
    return { facilidades: [], dificuldades: [], lastStudyContentIds: [], examType: null };
  }
}

/**
 * Reseta progresso de estudo (usado ao mudar de concurso)
 */
export async function resetStudyProgress(telegramId: string): Promise<void> {
  try {
    await db.execute(sql`
      UPDATE "User"
      SET "lastStudyContentIds" = '[]',
          "facilidades" = '[]',
          "dificuldades" = '[]',
          "updatedAt" = NOW()
      WHERE "telegramId" = ${telegramId}
    `);
    console.log(`🔄 [Progress] Progresso resetado para ${telegramId}`);
  } catch (error) {
    console.error("❌ [Progress] Erro ao resetar progresso:", error);
  }
}

/**
 * Helper para parse seguro de JSON
 */
function safeParseJson(value: any, fallback: any): any {
  if (!value) return fallback;
  if (typeof value === "object") return value; // Já é objeto
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

// ============================================
// MNEMÔNICOS - FUNÇÕES
// ============================================

export interface MnemonicResult {
  mnemonic: string;
  title: string;
  meaning: string;
  article: string;
  category: string;
}

/**
 * Busca mnemônico relevante para um conteúdo específico
 * Faz match por subjectId + keywords no título/definição do conteúdo
 *
 * @param subjectId - ID do subject do conteúdo
 * @param contentTitle - Título do conteúdo
 * @param contentText - Texto/definição do conteúdo (opcional)
 * @returns Mnemônico encontrado ou null
 */
export async function getMnemonicForContent(
  subjectId: string,
  contentTitle: string,
  contentText: string = "",
): Promise<MnemonicResult | null> {
  try {
    // Buscar todos os mnemônicos ativos do subject
    const mnemonics = await db.execute(sql`
      SELECT "mnemonic", "title", "meaning", "article", "keywords", "category"
      FROM "Mnemonic"
      WHERE "subjectId" = ${subjectId}
        AND "isActive" = true
    `) as any[];

    if (mnemonics.length === 0) return null;

    // Texto combinado para busca (lowercase)
    const searchText = `${contentTitle} ${contentText}`.toLowerCase();

    // Procurar match por keywords
    for (const m of mnemonics) {
      const keywords: string[] = safeParseJson(m.keywords, []);

      for (const keyword of keywords) {
        if (searchText.includes(keyword.toLowerCase())) {
          return {
            mnemonic: m.mnemonic,
            title: m.title,
            meaning: m.meaning,
            article: m.article,
            category: m.category,
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error("❌ [Mnemonic] Erro ao buscar mnemônico:", error);
    return null;
  }
}
