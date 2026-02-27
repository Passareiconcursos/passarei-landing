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
import { generateQuestionHaiku } from "./ai-engine";

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
// BUSCAR QUESTÃO POR SUBJECT (Prisma legacy)
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
// HELPERS — mapear questão da tabela Drizzle `questions`
// ============================================

function mapDrizzleQuestion(q: any): any {
  const options = [q.option_a, q.option_b, q.option_c, q.option_d];
  if (q.option_e) options.push(q.option_e);
  return {
    id: q.id,
    pergunta: q.question_text,
    opcoes: options,
    correctOption: ["A", "B", "C", "D", "E"].indexOf(q.correct_answer),
    explanation: q.explanation,
    _source: "drizzle",
  };
}

// ============================================
// BUSCAR QUESTÃO VINCULADA AO CONTEÚDO
// Prioridade:
//   Tier 1: questions (Drizzle) por content_id  ← busca direta
//   Tier 2: questions (Drizzle) por subject/examType via JOIN
//   Tier 3: "Question" (Prisma) por topicId / subjectId  ← banco legado
//   Tier 4: AI Haiku on-the-fly + persistência obrigatória
// Cada tier tem try/catch individual — falha de um não bloqueia o próximo
// ============================================

export async function getQuestionForContent(
  contentId: string,
  subjectId: string,
  topicId: string | null,
  usedQuestionIds: string[] = [],
  contentForAI?: { title: string; text: string; examType: string },
): Promise<any | null> {

  // ── Tier 1: Drizzle `questions` por content_id ─────────────────────────
  try {
    const t1 = await db.execute(sql`
      SELECT * FROM questions
      WHERE content_id = ${contentId}
      ORDER BY RANDOM()
      LIMIT 1
    `) as any[];

    if (t1.length > 0) {
      console.log(`✅ [Question T1] Drizzle por content_id: ${t1[0].id}`);
      return mapDrizzleQuestion(t1[0]);
    }
  } catch (e: any) {
    console.warn(`⚠️ [Question T1] Falhou: ${e?.message?.split("\n")[0]}`);
  }

  // ── Tier 2: desabilitado (tabela Drizzle `content` não existe no schema atual)
  // Cobertura equivalente feita via T3 (Prisma "Question" por topicId/subjectId)

  // ── Tier 3: "Question" (Prisma legacy) por topicId / subjectId ─────────
  try {
    const reviewClause = sql`AND (q."reviewStatus" IS NULL OR q."reviewStatus" != 'REJEITADO')`;

    // Garantir topicId: se não veio no parâmetro, buscar no banco pelo contentId
    let effectiveTopicId = topicId;
    if (!effectiveTopicId && contentId) {
      try {
        const contentRows = await db.execute(sql`
          SELECT "topicId" FROM "Content" WHERE id = ${contentId} LIMIT 1
        `) as any[];
        effectiveTopicId = contentRows[0]?.topicId ?? null;
        if (effectiveTopicId) {
          console.log(`🔍 [Question T3] topicId resolvido do DB: ${effectiveTopicId}`);
        }
      } catch (_e) { /* não bloqueia */ }
    }

    // T3a-0: questão vinculada ao conteúdo EXATO (precisão máxima — evita "roleta russa")
    if (contentId) {
      const t3a0 = await db.execute(sql`
        SELECT q.* FROM "Question" q
        WHERE q."contentId" = ${contentId}
          AND q."isActive" = true
          ${reviewClause}
        ORDER BY q."timesUsed" ASC, RANDOM()
        LIMIT 1
      `) as any[];

      if (t3a0.length > 0) {
        await db.execute(sql`UPDATE "Question" SET "timesUsed" = "timesUsed" + 1 WHERE "id" = ${t3a0[0].id}`);
        console.log(`✅ [Question T3a-0] Prisma por contentId: ${t3a0[0].id}`);
        return t3a0[0];
      }
      console.log(`⚠️ [Question T3a-0] Nenhuma questão para contentId ${contentId} — pulando T3a, indo para T4`);
    }

    // T3a: questão vinculada ao tópico específico.
    // REGRA ANTI-ROLETA-RUSSA: se contentId foi fornecido (átomo específico), NÃO usar T3a.
    // Retornar uma questão aleatória do tópico quando o aluno estuda um átomo específico
    // causa "roleta russa" (aluno estuda Sócrates, recebe questão de Platão).
    // Quando contentId está presente, T4 (IA) gera a questão certa e a persiste para usos futuros.
    if (effectiveTopicId && !contentId) {
      const t3a = await db.execute(sql`
        SELECT q.* FROM "Question" q
        WHERE q."topicId" = ${effectiveTopicId}
          AND q."isActive" = true
          ${reviewClause}
        ORDER BY q."timesUsed" ASC, RANDOM()
        LIMIT 1
      `) as any[];

      if (t3a.length > 0) {
        await db.execute(sql`UPDATE "Question" SET "timesUsed" = "timesUsed" + 1 WHERE "id" = ${t3a[0].id}`);
        console.log(`✅ [Question T3a] Prisma por topicId: ${t3a[0].id}`);
        return t3a[0];
      }
      console.log(`⚠️ [Question T3a] Nenhuma questão para topicId ${effectiveTopicId} — caindo para subjectId`);
    }

    // T3b: fallback para qualquer questão da matéria (apenas sem contentId — nunca roleta russa)
    if (!contentId) {
      const bySubject = await getQuestionForSubject(subjectId, usedQuestionIds);
      if (bySubject) {
        console.log(`✅ [Question T3b] Prisma por subjectId: ${bySubject.id}`);
        return bySubject;
      }
    }
  } catch (e: any) {
    console.warn(`⚠️ [Question T3] Falhou (tabela legada): ${e?.message?.split("\n")[0]}`);
  }

  // ── Tier 4: AI Haiku on-the-fly + persistência obrigatória ────────────
  try {
    // Buscar conteúdo no Prisma "Content" (Drizzle `content` não existe no schema atual)
    let aiCtx = contentForAI;
    try {
      const prismaRow = await db.execute(sql`
        SELECT "title", "textContent" FROM "Content" WHERE "id" = ${contentId} LIMIT 1
      `) as any[];
      if (prismaRow.length > 0) {
        aiCtx = { title: prismaRow[0].title, text: prismaRow[0].textContent || "", examType: "POLICIA_FEDERAL" };
      }
    } catch (_e) { /* usar contentForAI passado pelo caller se disponível */ }

    if (aiCtx) {
      console.warn(`⚠️ [AI-Q] Nenhuma questão no banco para contentId: ${contentId} — gerando via Haiku`);

      const aiQuestion = await generateQuestionHaiku(
        aiCtx.title,
        aiCtx.text,
        aiCtx.examType,
      );

      if (aiQuestion) {
        const correctLetter = ["A", "B", "C", "D", "E"][aiQuestion.correta] ?? "A";
        const opcoes = aiQuestion.opcoes;

        try {
          const inserted = await db.execute(sql`
            INSERT INTO questions (
              content_id, question_text,
              option_a, option_b, option_c, option_d,
              correct_answer, explanation,
              difficulty, generated_by_ai,
              created_at, updated_at
            ) VALUES (
              ${contentId}, ${aiQuestion.pergunta},
              ${opcoes[0] ?? ""}, ${opcoes[1] ?? ""}, ${opcoes[2] ?? ""}, ${opcoes[3] ?? ""},
              ${correctLetter}, ${aiQuestion.explicacao},
              'MEDIO', true,
              NOW(), NOW()
            )
            RETURNING id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation
          `) as any[];

          if (inserted.length > 0) {
            console.log(`💾 [AI-Q] Questão persistida no banco: ${inserted[0].id}`);
            return mapDrizzleQuestion(inserted[0]);
          }
        } catch (persistErr) {
          console.error("❌ [AI-Q] Falha ao persistir questão gerada:", persistErr);
        }

        // Persistência falhou — retornar sem ID permanente (non-fatal)
        return {
          id: `ai_generated_${Date.now()}`,
          pergunta: aiQuestion.pergunta,
          opcoes,
          correctOption: aiQuestion.correta,
          explanation: aiQuestion.explicacao,
          _source: "ai_fallback",
        };
      }
    }
  } catch (e: any) {
    console.error(`❌ [Question T4] AI Haiku falhou: ${e?.message?.split("\n")[0]}`);
  }

  return null;
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
