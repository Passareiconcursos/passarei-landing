/**
 * Question Engine — Busca e matching de questões
 *
 * Responsável por:
 * - Buscar questões do banco (por contentId, topicId, subjectId)
 * - Registrar tentativas de resposta
 * - Buscar mnemônicos relevantes
 *
 * Aceita userId direto (não depende de telegramId).
 *
 * Extraído de: server/telegram/database.ts (linhas 1134-1810)
 */

import { db } from "../../db";
import { sql } from "drizzle-orm";
import { generateQuestion } from "./ai-engine";

// ============================================
// INTERFACES
// ============================================

export interface MnemonicResult {
  mnemonic: string;
  title: string;
  meaning: string;
  article: string;
  category: string;
}

// ============================================
// BUSCAR QUESTÃO POR SUBJECT
// ============================================

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
    console.error("❌ [Question] Erro ao buscar por subject:", error);
    return null;
  }
}

// ============================================
// BUSCAR QUESTÃO VINCULADA AO CONTEÚDO
// Prioridade: contentId > topicId > subjectId > IA contextual
// ============================================

export async function getQuestionForContent(
  contentId: string,
  subjectId: string,
  topicId: string | null,
  usedQuestionIds: string[] = [],
  contentForAI?: { title: string; text: string; examType: string },
): Promise<any | null> {
  try {
    const usedClause = usedQuestionIds.length > 0
      ? sql`AND q."id" NOT IN (${sql.join(usedQuestionIds.map((id) => sql`${id}`), sql`, `)})`
      : sql``;

    const reviewClause = sql`AND (q."reviewStatus" IS NULL OR q."reviewStatus" != 'REJEITADO')`;

    // 1. Tentar por contentId (vínculo direto — mais preciso)
    const byContent = await db.execute(sql`
      SELECT q.* FROM "Question" q
      WHERE q."contentId" = ${contentId}
        AND q."isActive" = true
        ${usedClause}
        ${reviewClause}
      ORDER BY q."timesUsed" ASC, RANDOM()
      LIMIT 1
    `) as any[];

    if (byContent.length > 0) {
      await db.execute(sql`
        UPDATE "Question" SET "timesUsed" = "timesUsed" + 1
        WHERE "id" = ${byContent[0].id}
      `);
      console.log(`✅ [Question] Encontrada por contentId: ${byContent[0].id}`);
      return byContent[0];
    }

    // 2. Tentar por topicId
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
    }

    // 3. Tentar por subjectId
    const bySubject = await getQuestionForSubject(subjectId, usedQuestionIds);
    if (bySubject) return bySubject;

    // 4. Gerar com IA contextual (usando o conteúdo estudado como contexto)
    if (contentForAI) {
      console.log(`🤖 [Question] Gerando questão via IA para: ${contentForAI.title}`);
      const aiQuestion = await generateQuestion(
        contentForAI.title,
        contentForAI.text,
        contentForAI.examType,
      );

      if (aiQuestion) {
        return {
          id: `ai_generated_${Date.now()}`,
          statement: aiQuestion.pergunta,
          alternatives: aiQuestion.opcoes,
          correctAnswer: aiQuestion.opcoes[aiQuestion.correta],
          correctIndex: aiQuestion.correta,
          explanation: aiQuestion.explicacao,
          isAIGenerated: true,
          subjectId,
          topicId,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("❌ [Question] Erro ao buscar por conteúdo:", error);
    return null;
  }
}

// ============================================
// REGISTRAR TENTATIVA DE RESPOSTA
// ============================================

export async function recordQuestionAttempt(
  userId: string,
  questionId: string,
  userAnswer: string,
  isCorrect: boolean,
  attemptType: string = "QUIZ_FIXACAO",
): Promise<boolean> {
  try {
    // Pular questões geradas por IA (não existem na tabela Question)
    if (questionId.startsWith("ai_generated_") || questionId.startsWith("fallback_")) {
      return true;
    }

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

    return true;
  } catch (error) {
    console.error("❌ [Question] Erro ao registrar tentativa:", error);
    return false;
  }
}

// ============================================
// BUSCAR MNEMÔNICO PARA CONTEÚDO
// ============================================

export async function getMnemonicForContent(
  subjectId: string,
  contentTitle: string,
  contentText: string = "",
): Promise<MnemonicResult | null> {
  try {
    const mnemonics = await db.execute(sql`
      SELECT "mnemonic", "title", "meaning", "article", "keywords", "category"
      FROM "Mnemonic"
      WHERE "subjectId" = ${subjectId}
        AND "isActive" = true
    `) as any[];

    if (mnemonics.length === 0) return null;

    const searchText = `${contentTitle} ${contentText}`.toLowerCase();

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
    console.error("❌ [Mnemonic] Erro ao buscar:", error);
    return null;
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
