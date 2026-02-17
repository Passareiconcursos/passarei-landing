/**
 * Access Control — Controle de acesso a questões e redações
 *
 * Gerencia limites de plano, créditos, questões grátis.
 * Aceita userId (banco) em vez de telegramId para ser universal.
 *
 * Extraído de: server/telegram/database.ts (linhas 7-366, 666-858)
 */

import { db } from "../../db";
import { sql } from "drizzle-orm";

// ============================================
// CONSTANTES DO MODELO DE NEGÓCIO
// ============================================

export const PLAN_LIMITS = {
  FREE_QUESTIONS_FIRST_DAY: 21,
  PRICE_PER_QUESTION: 0.99,
  CALOURO_DAILY_LIMIT: 10,
  VETERANO_DAILY_LIMIT: 30,
  VETERANO_MONTHLY_ESSAYS: 2,
  PRICE_PER_ESSAY: 1.99,
} as const;

// ============================================
// INTERFACES
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

export interface EssayAccessResult {
  canAccess: boolean;
  reason: "veterano_free" | "paid" | "no_access" | "no_credits";
  freeRemaining?: number;
  credits?: number;
  price?: number;
  message?: string;
}

// ============================================
// VERIFICAR ACESSO A QUESTÃO
// ============================================

/**
 * Verifica se o usuário pode acessar uma questão.
 * Aceita TANTO telegramId quanto userId direto.
 */
export async function checkQuestionAccess(
  identifier: string,
  identifierType: "telegramId" | "userId" = "telegramId",
): Promise<QuestionAccessResult> {
  try {
    const whereClause = identifierType === "userId"
      ? sql`"id" = ${identifier}`
      : sql`"telegramId" = ${identifier}`;

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
      WHERE ${whereClause}
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
        WHERE ${whereClause}
      `);
      user.dailyContentCount = 0;
    }

    const planUpper = (user.plan || "").toUpperCase();
    const planStatus = (user.planStatus || "").toLowerCase();
    const planEndDate = user.planEndDate ? new Date(user.planEndDate) : null;
    const isPlanActive = planStatus === "active" && (!planEndDate || planEndDate >= new Date());

    // 1. VETERANO
    if (planUpper === "VETERANO" && isPlanActive) {
      const remaining = PLAN_LIMITS.VETERANO_DAILY_LIMIT - user.dailyContentCount;
      return remaining > 0
        ? { canAccess: true, reason: "veterano", dailyRemaining: remaining, dailyLimit: PLAN_LIMITS.VETERANO_DAILY_LIMIT }
        : { canAccess: false, reason: "limit_reached", dailyRemaining: 0, dailyLimit: PLAN_LIMITS.VETERANO_DAILY_LIMIT };
    }

    // 2. CALOURO
    if (planUpper === "CALOURO" && isPlanActive) {
      const remaining = PLAN_LIMITS.CALOURO_DAILY_LIMIT - user.dailyContentCount;
      return remaining > 0
        ? { canAccess: true, reason: "calouro", dailyRemaining: remaining, dailyLimit: PLAN_LIMITS.CALOURO_DAILY_LIMIT }
        : { canAccess: false, reason: "limit_reached", dailyRemaining: 0, dailyLimit: PLAN_LIMITS.CALOURO_DAILY_LIMIT };
    }

    // 3. PRIMEIRO DIA (FREE) — 21 questões grátis
    const isFirstDay = firstDay === today;
    const freeUsed = user.firstDayFreeUsed || 0;
    const freeRemaining = PLAN_LIMITS.FREE_QUESTIONS_FIRST_DAY - freeUsed;

    if (isFirstDay && freeRemaining > 0) {
      return { canAccess: true, reason: "free_first_day", freeRemaining };
    }

    // 4. TEM CRÉDITOS
    const credits = parseFloat(user.credits) || 0;
    if (credits >= PLAN_LIMITS.PRICE_PER_QUESTION) {
      return { canAccess: true, reason: "has_credits", credits };
    }

    // 5. SEM CRÉDITOS
    return { canAccess: false, reason: "no_credits", credits, freeRemaining: 0 };
  } catch (error) {
    console.error("❌ [Access] Erro ao verificar acesso:", error);
    return { canAccess: true, reason: "has_credits" }; // Em caso de erro, permite
  }
}

// ============================================
// CONSUMIR QUESTÃO (DEBITAR)
// ============================================

export async function consumeQuestion(
  identifier: string,
  accessType: QuestionAccessResult["reason"],
  identifierType: "telegramId" | "userId" = "telegramId",
): Promise<boolean> {
  try {
    const whereClause = identifierType === "userId"
      ? sql`"id" = ${identifier}`
      : sql`"telegramId" = ${identifier}`;

    const baseUpdate = sql`
      "dailyContentCount" = COALESCE("dailyContentCount", 0) + 1,
      "lastContentDate" = CURRENT_DATE,
      "totalQuestionsAnswered" = COALESCE("totalQuestionsAnswered", 0) + 1,
      "updatedAt" = NOW()
    `;

    if (accessType === "free_first_day") {
      await db.execute(sql`
        UPDATE "User"
        SET "firstDayFreeUsed" = COALESCE("firstDayFreeUsed", 0) + 1,
            ${baseUpdate}
        WHERE ${whereClause}
      `);
    } else if (accessType === "has_credits") {
      await db.execute(sql`
        UPDATE "User"
        SET "credits" = COALESCE("credits", 0) - ${PLAN_LIMITS.PRICE_PER_QUESTION},
            "totalSpent" = COALESCE("totalSpent", 0) + ${PLAN_LIMITS.PRICE_PER_QUESTION},
            ${baseUpdate}
        WHERE ${whereClause}
      `);
    } else {
      // veterano ou calouro
      await db.execute(sql`
        UPDATE "User"
        SET ${baseUpdate}
        WHERE ${whereClause}
      `);
    }

    return true;
  } catch (error) {
    console.error("❌ [Access] Erro ao consumir questão:", error);
    return false;
  }
}

// ============================================
// VERIFICAR ACESSO A REDAÇÃO
// ============================================

export async function checkEssayAccess(
  identifier: string,
  identifierType: "telegramId" | "userId" = "telegramId",
): Promise<EssayAccessResult> {
  try {
    const whereClause = identifierType === "userId"
      ? sql`"id" = ${identifier}`
      : sql`"telegramId" = ${identifier}`;

    const result = await db.execute(sql`
      SELECT "plan", "credits", "monthlyEssaysUsed", "lastEssayMonth"
      FROM "User"
      WHERE ${whereClause}
    `);

    if (result.length === 0) {
      return { canAccess: false, reason: "no_access", message: "Usuário não encontrado" };
    }

    const user = result[0] as any;
    const currentMonth = new Date().toISOString().slice(0, 7);
    const lastMonth = user.lastEssayMonth || "";

    let essaysUsed = user.monthlyEssaysUsed || 0;
    if (lastMonth !== currentMonth) {
      await db.execute(sql`
        UPDATE "User"
        SET "monthlyEssaysUsed" = 0, "lastEssayMonth" = ${currentMonth}
        WHERE ${whereClause}
      `);
      essaysUsed = 0;
    }

    // 1. VETERANO — 2 grátis/mês
    if (user.plan === "VETERANO") {
      const freeRemaining = PLAN_LIMITS.VETERANO_MONTHLY_ESSAYS - essaysUsed;
      if (freeRemaining > 0) {
        return { canAccess: true, reason: "veterano_free", freeRemaining };
      }
    }

    // 2. TEM CRÉDITOS
    const credits = parseFloat(user.credits) || 0;
    if (credits >= PLAN_LIMITS.PRICE_PER_ESSAY) {
      return { canAccess: true, reason: "paid", credits, price: PLAN_LIMITS.PRICE_PER_ESSAY };
    }

    // 3. SEM ACESSO
    return { canAccess: false, reason: "no_credits", credits, price: PLAN_LIMITS.PRICE_PER_ESSAY };
  } catch (error) {
    console.error("❌ [Access] Erro ao verificar acesso à redação:", error);
    return { canAccess: false, reason: "no_access" };
  }
}

// ============================================
// CONSUMIR REDAÇÃO (DEBITAR)
// ============================================

export async function consumeEssay(
  identifier: string,
  accessType: EssayAccessResult["reason"],
  identifierType: "telegramId" | "userId" = "telegramId",
): Promise<boolean> {
  try {
    const whereClause = identifierType === "userId"
      ? sql`"id" = ${identifier}`
      : sql`"telegramId" = ${identifier}`;

    const currentMonth = new Date().toISOString().slice(0, 7);

    if (accessType === "veterano_free") {
      await db.execute(sql`
        UPDATE "User"
        SET "monthlyEssaysUsed" = COALESCE("monthlyEssaysUsed", 0) + 1,
            "lastEssayMonth" = ${currentMonth},
            "totalEssaysSubmitted" = COALESCE("totalEssaysSubmitted", 0) + 1,
            "updatedAt" = NOW()
        WHERE ${whereClause}
      `);
    } else if (accessType === "paid") {
      await db.execute(sql`
        UPDATE "User"
        SET "credits" = COALESCE("credits", 0) - ${PLAN_LIMITS.PRICE_PER_ESSAY},
            "monthlyEssaysUsed" = COALESCE("monthlyEssaysUsed", 0) + 1,
            "lastEssayMonth" = ${currentMonth},
            "totalEssaysSubmitted" = COALESCE("totalEssaysSubmitted", 0) + 1,
            "totalSpent" = COALESCE("totalSpent", 0) + ${PLAN_LIMITS.PRICE_PER_ESSAY},
            "updatedAt" = NOW()
        WHERE ${whereClause}
      `);
    }

    return true;
  } catch (error) {
    console.error("❌ [Access] Erro ao consumir redação:", error);
    return false;
  }
}
