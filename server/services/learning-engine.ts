/**
 * Learning Engine — Motor de aprendizado adaptativo
 *
 * Responsável por:
 * - Seleção inteligente de conteúdo (SM2 > dificuldade > facilidade > geral)
 * - Parsing de conteúdo estruturado
 * - Geração de relatórios consolidados
 * - Gerenciamento de progresso do aluno
 * - Atualização adaptativa de dificuldades
 *
 * Framework-agnostic: usado por Telegram bot + Sala de Aula web.
 *
 * Extraído de: server/telegram/learning-session.ts
 */

import { db } from "../../db";
import { sql } from "drizzle-orm";
import { calculateSM2, getQualityFromAnswer } from "./sm2-engine";

// ============================================
// INTERFACES
// ============================================

export interface LearningSessionState {
  userId: string;
  examType: string;
  difficulties: string[];
  facilities: string[];
  usedContentIds: string[];
  usedQuestionIds: string[];
  correctAnswers: number;
  wrongAnswers: number;
  contentsSent: number;
  subjectStats: Record<string, { name: string; correct: number; total: number }>;
}

export interface ContentResult {
  id: string;
  title: string;
  textContent: string;
  subjectId: string;
  topicId?: string;
  examType: string;
  definition?: string;
  keyPoints?: string;
  example?: string;
  tip?: string;
  [key: string]: any;
}

export interface SessionReport {
  total: number;
  correct: number;
  wrong: number;
  percentage: number;
  subjectBreakdown: { name: string; correct: number; total: number; percentage: number; emoji: string }[];
  bestSubject: { name: string; percentage: number } | null;
  worstSubject: { name: string; percentage: number } | null;
  motivationalMessage: string;
}

// ============================================
// SELEÇÃO INTELIGENTE DE CONTEÚDO
// Prioridade: SM2 due > dificuldade (70%) > facilidade (30%) > geral
// ============================================

export async function getSmartContent(
  session: LearningSessionState,
): Promise<ContentResult | null> {
  const usedIdsClause = session.usedContentIds.length > 0
    ? sql`AND c."id" NOT IN (${sql.join(session.usedContentIds.map((id) => sql`${id}`), sql`, `)})`
    : sql``;

  // Cada sub-query tem try/catch individual para não abortar a função inteira
  const tryQuery = async (label: string, query: () => Promise<any[]>): Promise<ContentResult | null> => {
    try {
      const rows = await query();
      if (rows.length > 0) {
        console.log(`✅ [Learning] ${label}: ${rows[0].title ?? rows[0].id}`);
        return rows[0] as ContentResult;
      }
    } catch (e: any) {
      console.warn(`⚠️ [Learning] ${label} falhou: ${e?.message?.split("\n")[0]}`);
    }
    return null;
  };

  // 1. SM2: Priorizar revisões pendentes (Veterano)
  const dueReviews = await getSM2DueReviews(session.userId, session.examType);
  const availableDueReviews = dueReviews.filter((id) => !session.usedContentIds.includes(id));

  if (availableDueReviews.length > 0) {
    const sm2Result = await tryQuery("SM2 revisão", () => db.execute(sql`
      SELECT * FROM "Content"
      WHERE "id" = ${availableDueReviews[0]}
        AND "isActive" = true
      LIMIT 1
    `));
    if (sm2Result) return sm2Result;
  }

  // 2. Estudo adaptativo: 70% dificuldade, 30% facilidade
  const shouldPrioritizeDifficulty = Math.random() < 0.7;

  // 2a. Matérias de DIFICULDADE (70%) — usa s.name (coluna real do Subject)
  if (shouldPrioritizeDifficulty && session.difficulties.length > 0) {
    const r = await tryQuery("Dificuldade", () => db.execute(sql`
      SELECT c.* FROM "Content" c
      JOIN "Subject" s ON c."subjectId" = s.id
      WHERE s.name IN (${sql.join(session.difficulties.map((d) => sql`${d}`), sql`, `)})
        AND c."isActive" = true
        ${usedIdsClause}
      ORDER BY RANDOM()
      LIMIT 1
    `));
    if (r) return r;
  }

  // 2b. Matérias de FACILIDADE (30% ou fallback) — usa s.name
  if (session.facilities.length > 0) {
    const r = await tryQuery("Facilidade", () => db.execute(sql`
      SELECT c.* FROM "Content" c
      JOIN "Subject" s ON c."subjectId" = s.id
      WHERE s.name IN (${sql.join(session.facilities.map((f) => sql`${f}`), sql`, `)})
        AND c."isActive" = true
        ${usedIdsClause}
      ORDER BY RANDOM()
      LIMIT 1
    `));
    if (r) return r;
  }

  // 2c. Qualquer conteúdo não usado (sem filtro reviewStatus — pode não existir)
  if (session.usedContentIds.length > 0) {
    const r = await tryQuery("Geral (não usado)", () => db.execute(sql`
      SELECT * FROM "Content"
      WHERE "isActive" = true
        AND "id" NOT IN (${sql.join(session.usedContentIds.map((id) => sql`${id}`), sql`, `)})
      ORDER BY RANDOM()
      LIMIT 1
    `));
    if (r) return r;
  }

  // 2d. Qualquer conteúdo ativo
  const r = await tryQuery("Geral (ativo)", () => db.execute(sql`
    SELECT * FROM "Content"
    WHERE "isActive" = true
    ORDER BY RANDOM()
    LIMIT 1
  `));
  if (r) return r;

  // Último fallback sem filtro
  const fb = await tryQuery("Fallback total", () => db.execute(sql`
    SELECT * FROM "Content" ORDER BY RANDOM() LIMIT 1
  `));
  return fb;
}

// ============================================
// PARSE DE CONTEÚDO ESTRUTURADO
// ============================================

export function parseTextContent(text: string): {
  definition: string;
  keyPoints: string | null;
  example: string | null;
  tip: string | null;
} {
  const pontosIdx = text.indexOf("PONTOS-CHAVE:");
  if (pontosIdx === -1) {
    return { definition: text, keyPoints: null, example: null, tip: null };
  }

  const definition = text.substring(0, pontosIdx).trim();
  const rest = text.substring(pontosIdx);

  const keyPointsMatch = rest.match(/PONTOS-CHAVE:\n([\s\S]*?)(?=\n\nEXEMPLO:|\nEXEMPLO:)/);
  const exampleMatch = rest.match(/EXEMPLO:\n([\s\S]*?)(?=\n\nDICA:|\nDICA:)/);
  const tipMatch = rest.match(/DICA:\n([\s\S]*?)$/);

  return {
    definition,
    keyPoints: keyPointsMatch ? keyPointsMatch[1].trim() : null,
    example: exampleMatch ? exampleMatch[1].trim() : null,
    tip: tipMatch ? tipMatch[1].trim() : null,
  };
}

// ============================================
// RELATÓRIO CONSOLIDADO DE SESSÃO
// ============================================

export function generateSessionReport(session: LearningSessionState): SessionReport {
  const total = session.correctAnswers + session.wrongAnswers;
  const percentage = total > 0 ? Math.round((session.correctAnswers / total) * 100) : 0;

  const subjectBreakdown: SessionReport["subjectBreakdown"] = [];
  let best: { name: string; percentage: number } | null = null;
  let worst: { name: string; percentage: number } | null = null;

  for (const s of Object.values(session.subjectStats)) {
    if (s.total === 0) continue;
    const sPct = Math.round((s.correct / s.total) * 100);
    const emoji = sPct >= 70 ? "🟢" : sPct >= 50 ? "🟡" : "🔴";

    subjectBreakdown.push({ name: s.name, correct: s.correct, total: s.total, percentage: sPct, emoji });

    if (!best || sPct > best.percentage) best = { name: s.name, percentage: sPct };
    if (!worst || sPct < worst.percentage) worst = { name: s.name, percentage: sPct };
  }

  if (best && worst && best.name === worst.name) {
    worst = null;
  }

  let motivationalMessage: string;
  if (percentage >= 80) motivationalMessage = "Excelente desempenho! Continue assim!";
  else if (percentage >= 60) motivationalMessage = "Bom trabalho! Você está evoluindo!";
  else if (percentage >= 40) motivationalMessage = "Continue praticando! Cada questão conta!";
  else if (total > 0) motivationalMessage = "Não desista! Revise os conteúdos e tente novamente!";
  else motivationalMessage = "Comece a estudar para ver seu progresso!";

  return {
    total,
    correct: session.correctAnswers,
    wrong: session.wrongAnswers,
    percentage,
    subjectBreakdown,
    bestSubject: best,
    worstSubject: worst,
    motivationalMessage,
  };
}

// ============================================
// PROGRESSO DO ALUNO
// ============================================

export async function getStudyProgress(
  identifier: string,
  identifierType: "telegramId" | "userId" = "telegramId",
): Promise<{
  facilidades: string[];
  dificuldades: string[];
  lastStudyContentIds: string[];
  examType: string | null;
}> {
  try {
    const whereClause = identifierType === "userId"
      ? sql`"id" = ${identifier}`
      : sql`"telegramId" = ${identifier}`;

    const result = await db.execute(sql`
      SELECT "examType", "facilidades", "dificuldades", "lastStudyContentIds"
      FROM "User"
      WHERE ${whereClause}
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
    console.error("❌ [Learning] Erro ao carregar progresso:", error);
    return { facilidades: [], dificuldades: [], lastStudyContentIds: [], examType: null };
  }
}

export async function saveStudyProgress(
  identifier: string,
  contentIds: string[],
  identifierType: "telegramId" | "userId" = "telegramId",
): Promise<void> {
  try {
    const whereClause = identifierType === "userId"
      ? sql`"id" = ${identifier}`
      : sql`"telegramId" = ${identifier}`;

    const idsJson = JSON.stringify(contentIds.slice(-200)); // Manter últimos 200
    await db.execute(sql`
      UPDATE "User"
      SET "lastStudyContentIds" = ${idsJson},
          "updatedAt" = NOW()
      WHERE ${whereClause}
    `);
  } catch (error) {
    console.error("❌ [Learning] Erro ao salvar progresso:", error);
  }
}

// ============================================
// ATUALIZAR DIFICULDADES BASEADO NO DESEMPENHO
// ============================================

export async function updateDifficultiesFromPerformance(
  identifier: string,
  subjectStats: Record<string, { name: string; correct: number; total: number }>,
  identifierType: "telegramId" | "userId" = "telegramId",
): Promise<void> {
  try {
    const subjects = Object.entries(subjectStats);
    if (subjects.length === 0) return;

    const weakSubjects: string[] = [];
    for (const [, stats] of subjects) {
      if (stats.total > 0 && (stats.correct / stats.total) < 0.5) {
        weakSubjects.push(stats.name);
      }
    }

    if (weakSubjects.length === 0) return;

    const whereClause = identifierType === "userId"
      ? sql`"id" = ${identifier}`
      : sql`"telegramId" = ${identifier}`;

    const existing = await db.execute(sql`
      SELECT "dificuldades" FROM "User" WHERE ${whereClause} LIMIT 1
    `) as any[];

    let currentDiffs: string[] = [];
    if (existing[0]?.dificuldades) {
      currentDiffs = safeParseJson(existing[0].dificuldades, []);
    }

    const merged = Array.from(new Set([...currentDiffs, ...weakSubjects]));

    await db.execute(sql`
      UPDATE "User"
      SET "dificuldades" = ${JSON.stringify(merged)}::jsonb,
          last_active_at = NOW()
      WHERE ${whereClause}
    `);
  } catch (error) {
    console.error("❌ [Learning] Erro ao atualizar dificuldades:", error);
  }
}

// ============================================
// SM2 — REGISTRAR E BUSCAR REVISÕES (DB)
// ============================================

export async function recordSM2Review(
  userId: string,
  contentId: string,
  correct: boolean,
  responseTimeMs?: number,
): Promise<boolean> {
  try {
    // Verificar se é VETERANO
    const userResult = await db.execute(sql`
      SELECT "plan" FROM "User" WHERE "id" = ${userId}
    `);

    if (userResult.length === 0) return false;
    if ((userResult[0] as any).plan !== "VETERANO") return true; // Não é veterano, pular silenciosamente

    const quality = getQualityFromAnswer(correct, responseTimeMs);

    const existingResult = await db.execute(sql`
      SELECT * FROM "SpacedReview"
      WHERE "userId" = ${userId} AND "contentId" = ${contentId}
    `);

    if (existingResult.length > 0) {
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
        WHERE "userId" = ${userId} AND "contentId" = ${contentId}
      `);
    } else {
      const sm2 = calculateSM2(quality);
      const id = `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`.slice(0, 25);

      await db.execute(sql`
        INSERT INTO "SpacedReview" (
          "id", "userId", "contentId",
          "easinessFactor", "interval", "reviewNumber", "scheduledFor",
          "quality", "wasSuccessful", "status",
          "completedAt", "createdAt", "updatedAt"
        ) VALUES (
          ${id}, ${userId}, ${contentId},
          ${sm2.easeFactor}, ${sm2.interval}, ${sm2.repetitions}, ${sm2.nextReviewDate.toISOString()},
          ${quality}, ${correct}, 'CONCLUIDA',
          NOW(), NOW(), NOW()
        )
      `);
    }

    return true;
  } catch (error) {
    console.error("❌ [SM2] Erro ao registrar revisão:", error);
    return false;
  }
}

export async function getSM2DueReviews(
  userId: string,
  examType: string,
  limit: number = 10,
): Promise<string[]> {
  try {
    // Verificar se é VETERANO
    const userResult = await db.execute(sql`
      SELECT "plan" FROM "User" WHERE "id" = ${userId}
    `);

    if (userResult.length === 0) return [];
    if ((userResult[0] as any).plan !== "VETERANO") return [];

    const dueResult = await db.execute(sql`
      SELECT r."contentId"
      FROM "SpacedReview" r
      JOIN "Content" c ON r."contentId" = c."id"
      WHERE r."userId" = ${userId}
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

// ============================================
// ONBOARDING — ATUALIZAR PERFIL DO ALUNO
// ============================================

export async function updateUserOnboarding(
  identifier: string,
  data: {
    examType?: string;
    state?: string;
    cargo?: string;
    nivelConhecimento?: string;
    studySchedule?: string;
    facilidades?: string[];
    dificuldades?: string[];
  },
  identifierType: "telegramId" | "userId" = "telegramId",
): Promise<boolean> {
  try {
    const whereClause = identifierType === "userId"
      ? sql`"id" = ${identifier}`
      : sql`"telegramId" = ${identifier}`;

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
      WHERE ${whereClause}
    `);

    return true;
  } catch (error) {
    console.error("❌ [Learning] Erro ao atualizar onboarding:", error);
    return false;
  }
}

// ============================================
// HELPERS
// ============================================

function safeParseJson(value: any, fallback: any): any {
  if (!value) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
