/**
 * Sala de Aula — API Routes
 *
 * Endpoints protegidos por requireStudentAuth (JWT).
 * Usa a camada de serviços compartilhada (server/services/).
 */

import type { Express } from "express";
import { db } from "../db";
import { sql } from "drizzle-orm";
import { requireStudentAuth, getStudentProfile, type StudentJWTPayload } from "./auth-student";
import { correctEssay } from "./services/ai-engine";
import { sendTelegramMessage } from "./telegram/bot";
import { activeSessions } from "./telegram/learning-session";

// Services (shared with Telegram bot)
import {
  checkQuestionAccess,
  consumeQuestion,
  PLAN_LIMITS,
} from "./services/access-control";
import {
  getQuestionForContent,
  recordQuestionAttempt,
  getMnemonicForContent,
} from "./services/question-engine";
import {
  getSmartContent,
  getStudyProgress,
  saveStudyProgress,
  parseTextContent,
  updateUserOnboarding,
  type LearningSessionState,
} from "./services/learning-engine";
import {
  generateEnhancedContent,
  generateExplanation,
} from "./services/ai-engine";

export function registerSalaRoutes(app: Express) {
  console.log("📚 Registrando rotas da Sala de Aula...");

  // ============================================
  // ONBOARDING
  // ============================================

  // POST /api/sala/onboarding - Salvar dados do onboarding
  app.post("/api/sala/onboarding", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const { examType, cargo, state, facilidades, dificuldades } = req.body;

      if (!examType) {
        return res.status(400).json({ success: false, error: "Tipo de concurso é obrigatório." });
      }

      await updateUserOnboarding(student.userId, {
        examType,
        cargo,
        state,
        facilidades: facilidades || [],
        dificuldades: dificuldades || [],
      }, "userId");

      const profile = await getStudentProfile(student.userId);

      return res.json({ success: true, profile });
    } catch (error) {
      console.error("❌ [Sala] Erro no onboarding:", error);
      return res.status(500).json({ success: false, error: "Erro ao salvar onboarding." });
    }
  });

  // ============================================
  // MATÉRIAS / SUBJECTS
  // ============================================

  // GET /api/sala/subjects - Listar matérias disponíveis para o aluno
  app.get("/api/sala/subjects", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const progress = await getStudyProgress(student.userId, "userId");

      // Get all subjects with content count
      const subjectsResult = await db.execute(sql`
        SELECT
          s.id, s.name,
          COUNT(c.id) as content_count
        FROM "Subject" s
        LEFT JOIN "Content" c ON c."subjectId" = s.id
        GROUP BY s.id, s.name
        HAVING COUNT(c.id) > 0
        ORDER BY s.name
      `) as any[];

      // Enrich with student's difficulty/facility info
      const enriched = subjectsResult.map((s: any) => ({
        id: s.id,
        name: s.name,
        slug: s.name.toLowerCase().replace(/\s+/g, "-"),
        contentCount: Number(s.content_count),
        isDifficulty: progress.dificuldades?.includes(s.name) || false,
        isFacility: progress.facilidades?.includes(s.name) || false,
      }));

      return res.json({ success: true, subjects: enriched });
    } catch (error) {
      console.error("❌ [Sala] Erro ao buscar matérias:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar matérias." });
    }
  });

  // ============================================
  // PLANO DE AULA
  // ============================================

  // GET /api/sala/study-plan - Retorna progresso do plano sequencial
  app.get("/api/sala/study-plan", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const progress = await getStudyProgress(student.userId, "userId");
      const usedIds = progress.lastStudyContentIds || [];

      // Get subjects with content count
      const subjectsResult = await db.execute(sql`
        SELECT
          s.id, s.name,
          COUNT(c.id) as total_content
        FROM "Subject" s
        JOIN "Content" c ON c."subjectId" = s.id
          AND c."isActive" = true
          AND (c."reviewStatus" IS NULL OR c."reviewStatus" != 'REJEITADO')
        GROUP BY s.id, s.name
        HAVING COUNT(c.id) > 0
        ORDER BY s.name
      `) as any[];

      // Count studied per subject using usedIds
      const plan = await Promise.all(subjectsResult.map(async (s: any) => {
        let studiedCount = 0;
        if (usedIds.length > 0) {
          const studied = await db.execute(sql`
            SELECT COUNT(*) as count FROM "Content"
            WHERE "subjectId" = ${s.id}
              AND id IN (${sql.join(usedIds.map((id: string) => sql`${id}`), sql`, `)})
          `) as any[];
          studiedCount = Number(studied[0]?.count || 0);
        }

        const total = Number(s.total_content);
        return {
          subjectId: s.id,
          subjectName: s.name,
          totalContent: total,
          studiedContent: studiedCount,
          percentage: total > 0 ? Math.round((studiedCount / total) * 100) : 0,
          isDifficulty: progress.dificuldades?.includes(s.name) || false,
        };
      }));

      return res.json({ success: true, plan });
    } catch (error) {
      console.error("❌ [Sala] Erro ao buscar plano de aula:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar plano de aula." });
    }
  });

  // GET /api/sala/content/sequential - Próximo conteúdo sequencial (plano de aula)
  app.get("/api/sala/content/sequential", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const { subjectId } = req.query;

      if (!subjectId) {
        return res.status(400).json({ success: false, error: "subjectId é obrigatório." });
      }

      const progress = await getStudyProgress(student.userId, "userId");
      const usedIds = progress.lastStudyContentIds || [];

      // Get next unseen content for this subject, ordered by creation
      const usedClause = usedIds.length > 0
        ? sql`AND c.id NOT IN (${sql.join(usedIds.map((id: string) => sql`${id}`), sql`, `)})`
        : sql``;

      const result = await db.execute(sql`
        SELECT c.*, s.name as "subjectName"
        FROM "Content" c
        JOIN "Subject" s ON c."subjectId" = s.id
        WHERE c."subjectId" = ${subjectId}
          AND c."isActive" = true
          AND (c."reviewStatus" IS NULL OR c."reviewStatus" != 'REJEITADO')
          ${usedClause}
        ORDER BY c."createdAt" ASC
        LIMIT 1
      `) as any[];

      if (result.length === 0) {
        return res.json({
          success: true,
          content: null,
          message: "Você completou todo o conteúdo desta matéria!",
        });
      }

      const c = result[0];
      const parsed = parseTextContent(c.body || c.textContent || "");

      // AI enrichment
      let enrichment = null;
      try {
        enrichment = await generateEnhancedContent(
          c.title,
          c.body || c.textContent || "",
          progress.examType || "POLICIA_FEDERAL",
        );
      } catch (_e) { /* optional */ }

      // Save progress
      await saveStudyProgress(student.userId, [...usedIds, c.id], "userId");

      return res.json({
        success: true,
        content: {
          id: c.id,
          title: c.title,
          body: c.body || c.textContent,
          subjectId: c.subjectId,
          subjectName: c.subjectName,
          topicId: c.topicId,
          keyPoint: c.keyPoint || null,
          practicalExample: c.practicalExample || null,
          mnemonic: c.mnemonic || null,
          parsed,
          enrichment,
        },
      });
    } catch (error) {
      console.error("❌ [Sala] Erro ao buscar conteúdo sequencial:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar conteúdo." });
    }
  });

  // GET /api/sala/content/peek - Preview do próximo conteúdo (somente leitura, sem salvar progresso)
  app.get("/api/sala/content/peek", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const subjectId = req.query.subjectId as string | undefined;

      const progress = await getStudyProgress(student.userId, "userId");
      const usedIds: string[] = progress.lastStudyContentIds || [];

      const usedClause = usedIds.length > 0
        ? sql`AND c.id NOT IN (${sql.join(usedIds.map((id: string) => sql`${id}`), sql`, `)})`
        : sql``;
      const subjectClause = subjectId
        ? sql`AND c."subjectId" = ${subjectId}`
        : sql``;

      const rows = await db.execute(sql`
        SELECT c.id, c.title, s.name AS "subjectName"
        FROM "Content" c
        JOIN "Subject" s ON c."subjectId" = s.id
        WHERE c."isActive" = true
          AND (c."reviewStatus" IS NULL OR c."reviewStatus" != 'REJEITADO')
          ${usedClause}
          ${subjectClause}
        ORDER BY c."createdAt" ASC
        LIMIT 1
      `) as any[];

      const row = rows[0];
      if (!row) return res.json({ title: null, subjectName: null });
      return res.json({ title: row.title, subjectName: row.subjectName });
    } catch (error) {
      console.error("❌ [Sala] Erro ao buscar preview de conteúdo:", error);
      return res.status(500).json({ title: null, subjectName: null });
    }
  });

  // ============================================
  // CONTEÚDO / STUDY (Estudo Livre)
  // ============================================

  // GET /api/sala/content/next - Próximo conteúdo adaptativo (SM2 → dificuldade → facilidade)
  app.get("/api/sala/content/next", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      // subjectId reserved for future subject-scoped smart selection
      const progress = await getStudyProgress(student.userId, "userId");

      // Buscar concurso-alvo do aluno
      const userConcursoRow = await db.execute(sql`
        SELECT target_concurso_id FROM "User" WHERE id = ${student.userId} LIMIT 1
      `) as any[];

      const sessionState: LearningSessionState = {
        userId: student.userId,
        examType: progress.examType || "POLICIA_FEDERAL",
        difficulties: progress.dificuldades || [],
        facilities: progress.facilidades || [],
        usedContentIds: progress.lastStudyContentIds || [],
        usedQuestionIds: [],
        correctAnswers: 0,
        wrongAnswers: 0,
        contentsSent: 0,
        subjectStats: {},
        targetConcursoId: userConcursoRow[0]?.target_concurso_id || undefined,
      };

      const contentResult = await getSmartContent(sessionState);

      if (!contentResult) {
        return res.json({
          success: true,
          content: null,
          message: "Parabéns! Você estudou todo o conteúdo disponível.",
        });
      }

      // Parse structured text
      const parsed = parseTextContent(contentResult.textContent);

      // AI enrichment (pontos-chave, exemplo, dica)
      let enrichment = null;
      try {
        enrichment = await generateEnhancedContent(
          contentResult.title,
          contentResult.textContent,
          progress.examType || "POLICIA_FEDERAL",
        );
      } catch (_e) {
        // AI enrichment is optional
      }

      // Save progress
      await saveStudyProgress(
        student.userId,
        [...(progress.lastStudyContentIds || []), contentResult.id],
        "userId",
      );

      return res.json({
        success: true,
        content: {
          id: contentResult.id,
          title: contentResult.title,
          body: contentResult.textContent,
          subjectId: contentResult.subjectId,
          subjectName: contentResult.subjectName,
          topicId: contentResult.topicId,
          parsed,
          enrichment,
        },
      });
    } catch (error) {
      console.error("❌ [Sala] Erro ao buscar conteúdo:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar conteúdo." });
    }
  });

  // ============================================
  // QUESTÕES
  // ============================================

  // GET /api/sala/question - Buscar questão para o conteúdo atual
  app.get("/api/sala/question", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const { contentId, subjectId, topicId, contentTitle, contentText } = req.query;

      // A1 — Fidelidade Total: resolver subjectId e topicId reais do banco via contentId.
      // Garante que qualquer fallback de questão use a matéria do conteúdo estudado,
      // independente do valor enviado pelo cliente.
      let resolvedSubjectId = subjectId as string;
      let resolvedTopicId   = (topicId as string) || null;
      if (contentId) {
        try {
          const contentRows = await db.execute(sql`
            SELECT "subjectId", "topicId" FROM "Content" WHERE id = ${contentId as string} LIMIT 1
          `) as any[];
          if (contentRows.length > 0) {
            resolvedSubjectId = contentRows[0].subjectId ?? resolvedSubjectId;
            resolvedTopicId   = contentRows[0].topicId   ?? resolvedTopicId;
          }
        } catch (_e) { /* não bloquear fluxo principal */ }
      }

      // 1. Check access
      const access = await checkQuestionAccess(student.userId, "userId");
      if (!access.canAccess) {
        return res.json({
          success: true,
          question: null,
          accessDenied: true,
          reason: access.reason,
          remainingToday: 0,
          limits: PLAN_LIMITS,
        });
      }

      // 2. Get question (4-tier matching) — usa subjectId/topicId resolvidos do banco
      const question = await getQuestionForContent(
        contentId as string,
        resolvedSubjectId,
        resolvedTopicId,
        [], // usedQuestionIds - could be tracked in session
        contentText ? { title: contentTitle as string, text: contentText as string, examType: "POLICIA_FEDERAL" } : undefined,
      );

      if (!question) {
        return res.json({
          success: true,
          question: null,
          message: "Nenhuma questão disponível para este conteúdo.",
        });
      }

      // 3. Consume credit
      await consumeQuestion(student.userId, access.reason, "userId");

      // Buscar banca do concurso-alvo do aluno (para badge na questão)
      let banca: string | undefined;
      try {
        const bancaRows = await db.execute(sql`
          SELECT c.banca FROM "User" u
          LEFT JOIN concursos c ON c.id::text = u.target_concurso_id
          WHERE u.id = ${student.userId} AND u.target_concurso_id IS NOT NULL
          LIMIT 1
        `) as any[];
        banca = bancaRows[0]?.banca || undefined;
      } catch (_e) { /* não bloquear se falhar */ }

      // Calculate remaining
      const remaining = access.freeRemaining ?? access.dailyRemaining;

      // Normalizar para formato uniforme {text, options}
      // T1/T2/T4 (Drizzle) retornam: { pergunta, opcoes }
      // T3 (Prisma legacy) retorna: { statement, alternatives: [{letter, text}] }
      const qText = question.pergunta ?? question.statement ?? question.text ?? "";
      const qOptions: string[] = question.opcoes
        ?? question.options
        ?? (() => {
          try {
            const alts = typeof question.alternatives === "string"
              ? JSON.parse(question.alternatives)
              : question.alternatives;
            if (Array.isArray(alts)) return alts.map((a: any) => a.text ?? String(a));
          } catch (_) { /* noop */ }
          return undefined;
        })()
        ?? [];

      // A2 — Gabarito Blindado: correctOption sempre como índice numérico (0–4).
      // Questões Prisma legadas podem ter correctOption=NULL mas correctAnswer='B'.
      // O fallback indexOf garante que o frontend nunca receba null onde há gabarito.
      let correctOption: number | null = question.correctOption ?? null;
      if (correctOption === null && question.correctAnswer) {
        const idx = ["A","B","C","D","E"].indexOf(String(question.correctAnswer));
        if (idx >= 0) correctOption = idx;
      }

      // A3 — Explicação Antecipada: enviada junto com a questão para que o frontend
      // possa renderizar o feedback instantaneamente, sem aguardar o POST de resposta.
      // O campo se chama exatamente "explanation" para casar com a interface QuestionItem.
      const explanation: string | null = question.explanation ?? null;

      return res.json({
        success: true,
        question: {
          id: question.id,
          text: qText,
          options: qOptions,
          banca,
          correctOption,
          explanation,
        },
        remaining: remaining != null ? remaining - 1 : undefined,
      });
    } catch (error) {
      console.error("❌ [Sala] Erro ao buscar questão:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar questão." });
    }
  });

  // POST /api/sala/question/answer - Responder questão
  app.post("/api/sala/question/answer", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const { questionId, userAnswer, contentTitle, contentText, correctIndex } = req.body;

      if (!questionId || userAnswer === undefined) {
        return res.status(400).json({ success: false, error: "questionId e userAnswer são obrigatórios." });
      }

      // Get correct answer
      let correctAnswer: number;
      let questionText = "";

      if (questionId.startsWith("ai_generated_") || questionId.startsWith("fallback_")) {
        // AI-generated question (non-persisted fallback) — answer stored in client
        correctAnswer = correctIndex;
      } else {
        // Try "Question" (Prisma legacy) first
        const prismaQ = await db.execute(sql`
          SELECT "correctOption", "correctAnswer", "statement", "explanation", "explanationCorrect", "explanationWrong"
          FROM "Question" WHERE id = ${questionId} LIMIT 1
        `) as any[];

        if (prismaQ.length > 0) {
          // Fallback: questões antigas (pré-Phase5) têm correctAnswer (letra) mas correctOption NULL.
          // Sem esse fallback: isCorrect sempre false para respostas ≠ A, gabarito exibe "?".
          const rawOption = prismaQ[0].correctOption;
          if (rawOption != null) {
            correctAnswer = Number(rawOption);
          } else {
            correctAnswer = ["A", "B", "C", "D", "E"].indexOf(prismaQ[0].correctAnswer ?? "");
          }
          questionText = prismaQ[0].statement ?? "";
          // Armazenar explicações do banco para usar na cadeia de fallback
          (req as any)._prismaExplanationCorrect = prismaQ[0].explanationCorrect ?? null;
          (req as any)._prismaExplanationWrong = prismaQ[0].explanationWrong ?? null;
          // Explicação genérica como fallback adicional (questões sem explanationCorrect/Wrong)
          (req as any)._prismaExplanationGeneric = prismaQ[0].explanation ?? null;
        } else {
          // Try questions (Drizzle) — correctAnswer is a letter (A/B/C/D)
          const drizzleQ = await db.execute(sql`
            SELECT correct_answer, question_text, explanation FROM questions WHERE id = ${questionId} LIMIT 1
          `) as any[];

          if (drizzleQ.length === 0) {
            return res.status(404).json({ success: false, error: "Questão não encontrada." });
          }
          correctAnswer = ["A", "B", "C", "D", "E"].indexOf(drizzleQ[0].correct_answer);
          questionText = drizzleQ[0].question_text ?? "";
          // Guardar explicação da questão Drizzle para usar como fallback antes da IA
          (req as any)._drizzleExplanation = drizzleQ[0].explanation ?? null;
        }
      }

      // Segurança: se correctAnswer não foi resolvido (-1 ou fora do range 0-4),
      // usa o hint enviado pelo cliente (correctIndex do GET response) como último recurso.
      // CUIDADO: req.body.correctIndex pode ser JSON null — Number(null)=0 seria gabarito falso.
      // Usar !== null && !== undefined para só aceitar valores numéricos reais.
      if ((correctAnswer < 0 || correctAnswer > 4) &&
          req.body.correctIndex !== null && req.body.correctIndex !== undefined) {
        const hint = Number(req.body.correctIndex);
        if (hint >= 0 && hint <= 4) correctAnswer = hint;
      }

      const isCorrect = Number(userAnswer) === Number(correctAnswer);

      // Record attempt
      await recordQuestionAttempt(
        student.userId,
        questionId,
        String(userAnswer),
        isCorrect,
      );

      // Update streak (once per day, on first answer)
      try {
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const streakRow = await db.execute(sql`
          SELECT streak_days, best_streak, last_streak_date FROM "User" WHERE id = ${student.userId} LIMIT 1
        `) as any[];
        if (streakRow.length > 0) {
          const s = streakRow[0];
          if (s.last_streak_date !== today) {
            const newStreak = s.last_streak_date === yesterday ? (Number(s.streak_days) + 1) : 1;
            const newBest = Math.max(Number(s.best_streak) || 0, newStreak);
            await db.execute(sql`
              UPDATE "User" SET streak_days=${newStreak}, best_streak=${newBest}, last_streak_date=${today}, "updatedAt"=NOW()
              WHERE id=${student.userId}
            `);
          }
        }
      } catch (_e) { /* streak update is non-fatal */ }

      // Update SM2 record for this content (upsert)
      if (req.body.contentId) {
        try {
          const { calculateSM2, getQualityFromAnswer } = await import("./services/sm2-engine");
          const q = getQualityFromAnswer(isCorrect);
          const existing = await db.execute(sql`
            SELECT "id","ease_factor","interval","repetitions" FROM "sm2_reviews"
            WHERE "user_id" = ${student.userId} AND "content_id" = ${req.body.contentId} LIMIT 1
          `) as any[];

          if (existing.length > 0) {
            const s = existing[0];
            const r = calculateSM2(q, s.ease_factor, s.interval, s.repetitions);
            await db.execute(sql`
              UPDATE "sm2_reviews" SET
                "ease_factor"=${r.easeFactor},"interval"=${r.interval},"repetitions"=${r.repetitions},
                "next_review_date"=${r.nextReviewDate.toISOString()},"last_quality"=${q},
                "times_correct"="times_correct"+${isCorrect ? 1 : 0},
                "times_incorrect"="times_incorrect"+${isCorrect ? 0 : 1},
                "total_reviews"="total_reviews"+1,"last_reviewed_at"=NOW(),"updated_at"=NOW()
              WHERE "id"=${existing[0].id}
            `);
          } else {
            const r = calculateSM2(q);
            await db.execute(sql`
              INSERT INTO "sm2_reviews" ("user_id","content_id","ease_factor","interval","repetitions","next_review_date","last_quality","times_correct","times_incorrect","total_reviews","first_seen_at","last_reviewed_at","created_at","updated_at")
              VALUES (${student.userId},${req.body.contentId},${r.easeFactor},${r.interval},${r.repetitions},${r.nextReviewDate.toISOString()},${q},${isCorrect ? 1 : 0},${isCorrect ? 0 : 1},1,NOW(),NOW(),NOW(),NOW())
              ON CONFLICT DO NOTHING
            `);
          }
        } catch (_e) { /* SM2 upsert is non-fatal */ }
      }

      // Cadeia de explicação: específica (acerto/erro) > genérica > Drizzle > IA
      const prismaExpCorrect = (req as any)._prismaExplanationCorrect ?? null;
      const prismaExpWrong = (req as any)._prismaExplanationWrong ?? null;
      const prismaExpGeneric = (req as any)._prismaExplanationGeneric ?? null;
      const drizzleExplanation = (req as any)._drizzleExplanation ?? null;
      // 1ª opção: explanation específica do resultado (acerto/erro) — seeds Rodada 5+
      const seedExplanation = isCorrect ? prismaExpCorrect : prismaExpWrong;
      // Fallback chain: específica > genérica (campo explanation) > drizzle > IA
      const dbExplanation = seedExplanation ?? prismaExpGeneric ?? drizzleExplanation;

      let aiExplanation: string | null = null;
      if (!dbExplanation) {
        // Só chama IA se não houver explicação no banco (evita custo desnecessário)
        try {
          const expResult = await generateExplanation(
            contentTitle || "",
            contentText || questionText || "",
            String(userAnswer),
            String(correctAnswer),
            isCorrect,
          );
          aiExplanation = expResult.explanation ?? null;
        } catch (_e) {
          // Explanation is optional
        }
      }

      return res.json({
        success: true,
        isCorrect,
        correctAnswer,
        explanation: dbExplanation || aiExplanation,
      });
    } catch (error) {
      console.error("❌ [Sala] Erro ao responder questão:", error);
      return res.status(500).json({ success: false, error: "Erro ao processar resposta." });
    }
  });

  // ============================================
  // MNEMÔNICOS
  // ============================================

  // GET /api/sala/mnemonic - Buscar mnemônico para o conteúdo
  app.get("/api/sala/mnemonic", requireStudentAuth, async (req, res) => {
    try {
      const { subjectId, title, text } = req.query;

      const mnemonic = await getMnemonicForContent(
        subjectId as string,
        title as string,
        text as string,
      );

      return res.json({ success: true, mnemonic });
    } catch (error) {
      console.error("❌ [Sala] Erro ao buscar mnemônico:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar mnemônico." });
    }
  });

  // ============================================
  // PROGRESSO / STATS
  // ============================================

  // GET /api/sala/stats - Estatísticas do aluno
  app.get("/api/sala/stats", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;

      // Get user stats
      const userResult = await db.execute(sql`
        SELECT
          "totalQuestionsAnswered",
          plan, "planStatus",
          "dailyContentCount", "lastContentDate",
          "firstInteractionDate",
          target_concurso_id
        FROM "User"
        WHERE id = ${student.userId}
        LIMIT 1
      `) as any[];

      if (userResult.length === 0) {
        return res.status(404).json({ success: false, error: "Usuário não encontrado." });
      }

      const u = userResult[0];

      // Contar questões únicas respondidas (DISTINCT por questionId para evitar inflação)
      const distinctCountResult = await db.execute(sql`
        SELECT COUNT(DISTINCT qa."questionId")::int as total
        FROM "QuestionAttempt" qa
        WHERE qa."userId" = ${student.userId}
      `) as any[];
      const totalQuestionsAnswered = Number(distinctCountResult[0]?.total || 0);

      // Contar questões respondidas e disponíveis no curso atual (por matérias do concurso-alvo)
      let totalQuestionsInCurrentCourse = 0;
      let totalQuestionsAvailableInCourse = 0;
      if (u.target_concurso_id) {
        const concursoRows = await db.execute(sql`
          SELECT lista_materias_json FROM concursos WHERE id = ${u.target_concurso_id} LIMIT 1
        `) as any[];
        const raw = concursoRows[0]?.lista_materias_json;
        const materias: any[] = Array.isArray(raw) ? raw : (typeof raw === "string" ? JSON.parse(raw) : []);
        // EditalMateria usa campo "name" (não "nome") — corrige bug que retornava nomes=[] sempre
        const nomes = materias.map((m: any) => m.name || "").filter(Boolean);

        if (nomes.length > 0) {
          try {
            // Normalização robusta: mesma lógica do edital/progress (toSubjectCode + aliases + wildcard)
            const toCode = (s: string) =>
              s.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
                .replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "");
            const aliases: Record<string, string> = {
              "LINGUA_PORTUGUESA": "PORTUGUES",
              "DIREITO_CONSTITUCIONAL": "DIR_CONSTITUCIONAL",
              "DIREITO_PROCESSUAL_PENAL": "PROCESSUAL_PENAL",
              "NOCOES_DE_DIREITO_ADMINISTRATIVO": "DIREITO_ADMINISTRATIVO",
              "NOCOES_DE_INFORMATICA": "INFORMATICA",
            };
            const subjectIds: string[] = [];
            for (const nome of nomes) {
              let rows = await db.execute(sql`
                SELECT id FROM "Subject" WHERE name ILIKE ${"%" + nome + "%"} LIMIT 1
              `) as any[];
              if (!rows[0]) {
                const aliased = aliases[toCode(nome)] ?? toCode(nome);
                rows = await db.execute(sql`
                  SELECT id FROM "Subject" WHERE name ILIKE ${"%" + aliased + "%"} LIMIT 1
                `) as any[];
              }
              if (rows[0]?.id) subjectIds.push(rows[0].id);
            }

            if (subjectIds.length > 0) {
              // Constrói IN clause seguro — evita problemas de serialização de array com Drizzle
              const idList = subjectIds.map(id => `'${id.replace(/'/g, "''")}'`).join(", ");
              const [courseCountResult, availableCountResult] = await Promise.all([
                db.execute(sql.raw(`
                  SELECT COUNT(DISTINCT qa."questionId")::int AS total
                  FROM "QuestionAttempt" qa
                  JOIN "Question" q ON q.id = qa."questionId"
                  WHERE qa."userId" = '${student.userId.replace(/'/g, "''")}'
                    AND q."subjectId" IN (${idList})
                `)) as Promise<any[]>,
                db.execute(sql.raw(`
                  SELECT COUNT(DISTINCT q.id)::int AS total
                  FROM "Question" q
                  WHERE q."subjectId" IN (${idList})
                `)) as Promise<any[]>,
              ]);
              const qaCount = Number(courseCountResult[0]?.total || 0);
              // Math.max garante que questões do bot (que incrementam totalQuestionsAnswered mas
              // não criam QuestionAttempt) também sejam contabilizadas no progresso do curso
              totalQuestionsInCurrentCourse = Math.max(qaCount, Number(u.totalQuestionsAnswered || 0));
              totalQuestionsAvailableInCourse = Number(availableCountResult[0]?.total || 0);
            }
          } catch (subjectErr) {
            console.error("⚠️ [Stats] Erro ao calcular questões do curso — usando fallback 0:", subjectErr);
            // Não propaga — stats principais (totalQuestionsAnswered) ainda são retornadas
          }
        }
      }

      // Dias desde a primeira interação (para gating do Simulado)
      const daysSinceFirstInteraction = u.firstInteractionDate
        ? Math.floor((Date.now() - new Date(u.firstInteractionDate).getTime()) / 86400000)
        : 0;

      // Get per-subject stats — join via Question.subjectId (Content has no contentId on Question)
      const subjectStats = await db.execute(sql`
        SELECT
          s.name as subject_name,
          COUNT(DISTINCT qa."questionId") as total_questions,
          COUNT(DISTINCT CASE WHEN qa."isCorrect" = true THEN qa."questionId" END) as correct
        FROM "QuestionAttempt" qa
        JOIN "Question" q ON qa."questionId" = q.id
        JOIN "Subject" s ON q."subjectId" = s.id
        WHERE qa."userId" = ${student.userId}
        GROUP BY s.name
        ORDER BY total_questions DESC
      `) as any[];

      // Access info
      const access = await checkQuestionAccess(student.userId, "userId");

      return res.json({
        success: true,
        stats: {
          totalQuestionsAnswered,
          totalQuestionsInCurrentCourse,
          totalQuestionsAvailableInCourse,
          daysSinceFirstInteraction,
          plan: u.plan,
          planStatus: u.planStatus,
          dailyUsed: u.dailyContentCount || 0,
          firstInteraction: u.firstInteractionDate,
          access: {
            canAccess: access.canAccess,
            reason: access.reason,
            freeRemaining: access.freeRemaining,
            dailyRemaining: access.dailyRemaining,
          },
          bySubject: subjectStats.map((s: any) => ({
            subject: s.subject_name,
            total: Number(s.total_questions),
            correct: Number(s.correct),
            percentage: Number(s.total_questions) > 0
              ? Math.round((Number(s.correct) / Number(s.total_questions)) * 100)
              : 0,
          })),
        },
      });
    } catch (error) {
      console.error("❌ [Sala] Erro ao buscar stats:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar estatísticas." });
    }
  });

  // ============================================
  // PERFIL
  // ============================================

  // PUT /api/sala/profile - Atualizar perfil do aluno
  app.put("/api/sala/profile", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const { name, phone, examType, cargo, state } = req.body;

      if (!name && !phone && !examType && cargo === undefined && !state) {
        return res.status(400).json({ success: false, error: "Nenhum campo para atualizar." });
      }

      await db.execute(sql`
        UPDATE "User"
        SET
          name = COALESCE(${name || null}, name),
          phone = COALESCE(${phone || null}, phone),
          "examType" = COALESCE(${examType || null}, "examType"),
          cargo = CASE WHEN ${cargo !== undefined} THEN ${cargo || null} ELSE cargo END,
          state = COALESCE(${state || null}, state),
          "updatedAt" = NOW()
        WHERE id = ${student.userId}
      `);

      const profile = await getStudentProfile(student.userId);
      return res.json({ success: true, profile });
    } catch (error) {
      console.error("❌ [Sala] Erro ao atualizar perfil:", error);
      return res.status(500).json({ success: false, error: "Erro ao atualizar perfil." });
    }
  });

  // PUT /api/sala/profile/concurso — Definir concurso-alvo do aluno
  app.put("/api/sala/profile/concurso", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const { concursoId } = req.body;

      await db.execute(sql`
        UPDATE "User"
        SET target_concurso_id = ${concursoId ?? null}, "updatedAt" = NOW()
        WHERE id = ${student.userId}
      `);

      // Disparar worker para pré-popular conteúdo do edital (fire-and-forget)
      if (concursoId) {
        const siglaRows = await db.execute(sql`
          SELECT sigla FROM concursos WHERE id = ${concursoId} LIMIT 1
        `) as any[];
        if (siglaRows[0]?.sigla) {
          import("./services/content-worker")
            .then(m => (m as any).prepareEdital(siglaRows[0].sigla))
            .catch((e: any) => console.error("[Worker] Erro no prepareEdital:", e));
        }
      }

      // Notificação Telegram (fire-and-forget — não bloqueia o response)
      db.execute(sql`
        SELECT "telegramId" FROM "User" WHERE id = ${student.userId} LIMIT 1
      `).then((rows: any[]) => {
        const telegramId = (rows as any[])[0]?.telegramId;
        if (telegramId) {
          sendTelegramMessage(
            telegramId,
            "🔄 *Curso Atualizado!*\n\nSeu plano de estudos foi reiniciado no site para o novo concurso selecionado.",
          );
        }
      }).catch(() => { /* silencioso */ });

      const profile = await getStudentProfile(student.userId);
      return res.json({ success: true, profile });
    } catch (error) {
      console.error("❌ [Sala] Erro ao definir concurso:", error);
      return res.status(500).json({ success: false, error: "Erro ao definir concurso." });
    }
  });

  // POST /api/sala/progress/reset — Limpar progresso ao trocar de concurso
  app.post("/api/sala/progress/reset", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      // Limpa histórico de conteúdo, preferências, questões e gamificação do User
      await db.execute(sql`
        UPDATE "User"
        SET "lastStudyContentIds"    = '[]'::jsonb,
            "facilidades"            = '[]'::jsonb,
            "dificuldades"           = '[]'::jsonb,
            "totalQuestionsAnswered" = 0,
            "totalEssaysSubmitted"   = 0,
            streak_days              = 0,
            last_streak_date         = NULL,
            best_streak              = 0,
            "updatedAt"              = NOW()
        WHERE id = ${student.userId}
      `);
      // Apaga revisões SM2 acumuladas do concurso anterior
      await db.execute(sql`
        DELETE FROM sm2_reviews WHERE user_id = ${student.userId}
      `);
      // Apaga histórico de tentativas de questões para que as estatísticas
      // "Por matéria" e o progresso do edital comecem do zero no novo concurso.
      await db.execute(sql`
        DELETE FROM "QuestionAttempt" WHERE "userId" = ${student.userId}
      `);
      // Limpa sessão ativa do Bot (em memória) para o mesmo usuário,
      // evitando que o bot continue servindo conteúdo do curso anterior.
      const telegramRows = await db.execute(sql`
        SELECT "telegramId" FROM "User" WHERE id = ${student.userId} LIMIT 1
      `) as any[];
      const telegramId = telegramRows[0]?.telegramId;
      if (telegramId && activeSessions.has(telegramId)) {
        activeSessions.delete(telegramId);
        console.log(`🔄 [Reset] Sessão do bot limpa para telegramId ${telegramId}`);
      }
      return res.json({ success: true });
    } catch (error) {
      console.error("❌ [Sala] Erro ao resetar progresso:", error);
      return res.status(500).json({ success: false, error: "Erro ao resetar progresso." });
    }
  });

  // ============================================
  // SIMULADOS
  // ============================================

  const SIMULADO_CONFIG = { QUESTIONS_PER_SIMULADO: 50, DURATION_MINUTES: 120, PASSING_SCORE: 60 };
  const MONTH_NAMES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

  async function ensureMonthlySimuladoSala(examType: string): Promise<string | null> {
    const currentMonth = new Date().toISOString().slice(0, 7);
    try {
      const existing = await db.execute(sql`
        SELECT "id" FROM "simulados"
        WHERE "month" = ${currentMonth} AND "exam_type" = ${examType} AND "is_active" = true
        LIMIT 1
      `) as any[];
      if (existing.length > 0) return existing[0].id;

      const now = new Date();
      const title = `Simulado ${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
      const desc = `Simulado mensal para ${examType}. ${SIMULADO_CONFIG.QUESTIONS_PER_SIMULADO} questões em ${SIMULADO_CONFIG.DURATION_MINUTES} minutos.`;
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      const until = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      const created = await db.execute(sql`
        INSERT INTO "simulados" ("title","description","exam_type","total_questions","duration_minutes","passing_score","month","available_from","available_until","is_active")
        VALUES (${title},${desc},${examType},${SIMULADO_CONFIG.QUESTIONS_PER_SIMULADO},${SIMULADO_CONFIG.DURATION_MINUTES},${SIMULADO_CONFIG.PASSING_SCORE},${currentMonth},${from.toISOString()},${until.toISOString()},true)
        RETURNING "id"
      `) as any[];
      const simId = created[0].id;

      // Attach questions from Content
      let contents = await db.execute(sql`
        SELECT "id" FROM "Content" WHERE "isActive" = true AND "examType" = ${examType} ORDER BY RANDOM() LIMIT ${SIMULADO_CONFIG.QUESTIONS_PER_SIMULADO}
      `) as any[];
      if (contents.length < SIMULADO_CONFIG.QUESTIONS_PER_SIMULADO) {
        contents = await db.execute(sql`
          SELECT "id" FROM "Content" WHERE "isActive" = true ORDER BY RANDOM() LIMIT ${SIMULADO_CONFIG.QUESTIONS_PER_SIMULADO}
        `) as any[];
      }
      for (let i = 0; i < contents.length; i++) {
        await db.execute(sql`
          INSERT INTO "simulado_questions" ("simulado_id","content_id","question_order") VALUES (${simId},${contents[i].id},${i + 1})
        `);
      }
      return simId;
    } catch (e) {
      console.error("❌ [Sala] Erro ao criar simulado mensal:", e);
      return null;
    }
  }

  // GET /api/sala/simulados - Listar simulados do mês (todos os planos podem ver)
  app.get("/api/sala/simulados", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const userResult = await db.execute(sql`
        SELECT "examType", "plan" FROM "User" WHERE id = ${student.userId} LIMIT 1
      `) as any[];
      const examType = userResult[0]?.examType || "POLICIA_FEDERAL";
      const plan = userResult[0]?.plan || "FREE";

      await ensureMonthlySimuladoSala(examType);

      const simulados = await db.execute(sql`
        SELECT
          s."id", s."title", s."description", s."total_questions",
          s."duration_minutes", s."passing_score", s."month", s."available_until",
          us."id" as user_simulado_id, us."status" as user_status,
          us."score" as user_score, us."passed" as user_passed,
          us."current_question", us."correct_answers", us."wrong_answers",
          us."started_at"
        FROM "simulados" s
        LEFT JOIN "user_simulados" us ON s."id" = us."simulado_id" AND us."user_id" = ${student.userId}
        WHERE s."is_active" = true AND s."exam_type" = ${examType} AND s."available_until" >= NOW()
        ORDER BY s."available_from" DESC
        LIMIT 5
      `) as any[];

      return res.json({
        success: true,
        plan,
        isVeterano: plan === "VETERANO",
        simulados: simulados.map((s: any) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          totalQuestions: Number(s.total_questions),
          durationMinutes: Number(s.duration_minutes),
          passingScore: Number(s.passing_score),
          month: s.month,
          availableUntil: s.available_until,
          userSimuladoId: s.user_simulado_id || null,
          userStatus: s.user_status || "NOT_STARTED",
          userScore: s.user_score != null ? Number(s.user_score) : null,
          userPassed: s.user_passed,
          currentQuestion: Number(s.current_question || 0),
          startedAt: s.started_at || null,
        })),
      });
    } catch (error) {
      console.error("❌ [Sala] Erro ao listar simulados:", error);
      return res.status(500).json({ success: false, error: "Erro ao listar simulados." });
    }
  });

  // POST /api/sala/simulados/start - Iniciar ou retomar simulado
  app.post("/api/sala/simulados/start", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const { simuladoId } = req.body;
      if (!simuladoId) return res.status(400).json({ success: false, error: "simuladoId é obrigatório." });

      // Only VETERANO
      const userResult = await db.execute(sql`
        SELECT "plan" FROM "User" WHERE id = ${student.userId} LIMIT 1
      `) as any[];
      if (userResult[0]?.plan !== "VETERANO") {
        return res.status(403).json({
          success: false,
          requiresUpgrade: true,
          error: "Simulados são exclusivos do plano VETERANO. Faça upgrade para acessar!",
        });
      }

      // Check existing attempt
      const existing = await db.execute(sql`
        SELECT "id", "status", "current_question", "started_at", "correct_answers", "wrong_answers"
        FROM "user_simulados"
        WHERE "user_id" = ${student.userId} AND "simulado_id" = ${simuladoId}
        LIMIT 1
      `) as any[];

      if (existing.length > 0) {
        const a = existing[0];
        if (a.status === "COMPLETED" || a.status === "EXPIRED") {
          return res.json({
            success: false,
            alreadyFinished: true,
            status: a.status,
            error: a.status === "COMPLETED" ? "Você já completou este simulado." : "Este simulado expirou.",
          });
        }
        // Resume IN_PROGRESS
        return res.json({
          success: true,
          userSimuladoId: a.id,
          currentQuestion: Number(a.current_question),
          correctAnswers: Number(a.correct_answers || 0),
          wrongAnswers: Number(a.wrong_answers || 0),
          startedAt: a.started_at,
          resumed: true,
        });
      }

      // Create new attempt
      const result = await db.execute(sql`
        INSERT INTO "user_simulados" ("user_id","simulado_id","status","current_question","started_at")
        VALUES (${student.userId},${simuladoId},'IN_PROGRESS',0,NOW())
        RETURNING "id", "started_at"
      `) as any[];

      return res.json({
        success: true,
        userSimuladoId: result[0].id,
        currentQuestion: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        startedAt: result[0].started_at,
        resumed: false,
      });
    } catch (error) {
      console.error("❌ [Sala] Erro ao iniciar simulado:", error);
      return res.status(500).json({ success: false, error: "Erro ao iniciar simulado." });
    }
  });

  // GET /api/sala/simulados/question/:userSimuladoId - Buscar questão atual
  app.get("/api/sala/simulados/question/:userSimuladoId", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const { userSimuladoId } = req.params;

      const attemptResult = await db.execute(sql`
        SELECT us."id", us."current_question", us."status", us."started_at",
               s."total_questions", s."duration_minutes"
        FROM "user_simulados" us
        JOIN "simulados" s ON us."simulado_id" = s."id"
        WHERE us."id" = ${userSimuladoId} AND us."user_id" = ${student.userId}
        LIMIT 1
      `) as any[];

      if (attemptResult.length === 0) return res.status(404).json({ success: false, error: "Tentativa não encontrada." });
      const attempt = attemptResult[0];

      if (attempt.status !== "IN_PROGRESS") {
        return res.json({ success: false, finished: true, expired: attempt.status === "EXPIRED" });
      }

      // Time check
      const elapsed = (Date.now() - new Date(attempt.started_at).getTime()) / 60000;
      const timeRemaining = Math.max(0, Number(attempt.duration_minutes) - elapsed);
      if (timeRemaining <= 0) {
        await db.execute(sql`UPDATE "user_simulados" SET "status"='EXPIRED',"finished_at"=NOW() WHERE "id"=${userSimuladoId}`);
        return res.json({ success: false, expired: true, message: "Tempo esgotado!" });
      }

      const questionNumber = Number(attempt.current_question) + 1;
      if (questionNumber > Number(attempt.total_questions)) {
        return res.json({ success: false, finished: true, message: "Todas as questões foram respondidas." });
      }

      // Get simulado_question at this position, then get an actual Question for that content
      const sqResult = await db.execute(sql`
        SELECT sq."id" as sq_id, sq."content_id", c."title", c."textContent" as body
        FROM "simulado_questions" sq
        JOIN "user_simulados" us ON us."simulado_id" = sq."simulado_id"
        JOIN "Content" c ON c."id" = sq."content_id"
        WHERE us."id" = ${userSimuladoId} AND sq."question_order" = ${questionNumber}
        LIMIT 1
      `) as any[];

      if (sqResult.length === 0) return res.status(404).json({ success: false, error: "Questão não encontrada." });
      const sq = sqResult[0];

      // Get a real question for this content
      const question = await getQuestionForContent(
        sq.content_id,
        null as any,
        null,
        [],
        { title: sq.title, text: (sq.body || sq.textContent || "").slice(0, 500), examType: "POLICIA_FEDERAL" },
      );

      if (!question) {
        // Skip this question — advance and try next
        await db.execute(sql`UPDATE "user_simulados" SET "current_question"="current_question"+1 WHERE "id"=${userSimuladoId}`);
        return res.json({
          success: true,
          question: null,
          simuladoQuestionId: sq.sq_id,
          skipped: true,
          questionNumber,
          totalQuestions: Number(attempt.total_questions),
          timeRemaining: Math.round(timeRemaining),
        });
      }

      return res.json({
        success: true,
        simuladoQuestionId: sq.sq_id,
        question: {
          id: question.id,
          simuladoQuestionId: sq.sq_id,
          text: question.pergunta || question.text,
          options: question.opcoes || question.options,
          number: questionNumber,
          totalQuestions: Number(attempt.total_questions),
        },
        timeRemaining: Math.round(timeRemaining),
      });
    } catch (error) {
      console.error("❌ [Sala] Erro ao buscar questão do simulado:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar questão." });
    }
  });

  // GET /api/sala/simulados/questions/:userSimuladoId — Retorna todas as questões do simulado de uma vez
  app.get("/api/sala/simulados/questions/:userSimuladoId", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const { userSimuladoId } = req.params;

      const userSimRows = await db.execute(sql`
        SELECT us.simulado_id FROM user_simulados us
        WHERE us.id = ${userSimuladoId} AND us.user_id = ${student.userId} LIMIT 1
      `) as any[];
      if (!userSimRows[0]) return res.status(403).json({ success: false, error: "Acesso negado." });

      const simuladoId = userSimRows[0].simulado_id;

      const simQRows = await db.execute(sql`
        SELECT id, content_id, question_order
        FROM simulado_questions
        WHERE simulado_id = ${simuladoId}
        ORDER BY question_order ASC
      `) as any[];

      const questions: any[] = [];
      for (const sq of simQRows) {
        const qRows = await db.execute(sql`
          SELECT
            q.id, q.statement, q."correctOption", q."explanationCorrect", q."explanationWrong",
            q."questionType", c.title AS content_title, s.name AS subject_name,
            json_agg(
              json_build_object('letter', a.letter, 'text', a.text)
              ORDER BY a.letter
            ) AS alternatives
          FROM "Question" q
          JOIN "Content" c ON c.id = q."contentId"
          JOIN "Subject" s ON s.id = c."subjectId"
          JOIN "Alternative" a ON a."questionId" = q.id
          WHERE q."contentId" = ${sq.content_id} AND q."isActive" = true
          GROUP BY q.id, c.title, s.name
          ORDER BY RANDOM()
          LIMIT 1
        `) as any[];

        if (qRows[0]) {
          const alts: { letter: string; text: string }[] = qRows[0].alternatives || [];
          questions.push({
            id: qRows[0].id,
            simuladoQuestionId: sq.id,
            statement: qRows[0].statement,
            options: alts.map((a: any) => a.text),
            subjectName: qRows[0].subject_name,
            contentTitle: qRows[0].content_title,
            explanation: qRows[0].explanationCorrect || qRows[0].explanationWrong || "",
          });
        }
      }

      return res.json({ success: true, questions, totalQuestions: questions.length });
    } catch (error) {
      console.error("❌ [Sala] Erro ao buscar questões do simulado:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar questões." });
    }
  });

  // POST /api/sala/simulados/answer - Responder questão do simulado
  app.post("/api/sala/simulados/answer", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const { userSimuladoId, questionId, simuladoQuestionId, answer } = req.body;
      if (!userSimuladoId || answer === undefined) {
        return res.status(400).json({ success: false, error: "Dados incompletos." });
      }

      // Verify ownership
      const ownerCheck = await db.execute(sql`
        SELECT "id" FROM "user_simulados" WHERE "id" = ${userSimuladoId} AND "user_id" = ${student.userId} LIMIT 1
      `) as any[];
      if (ownerCheck.length === 0) return res.status(403).json({ success: false, error: "Acesso negado." });

      // Get correct answer from "Question" table (Prisma legacy)
      let correctAnswer = -1;
      if (questionId && !questionId.startsWith("ai_generated_") && !questionId.startsWith("fallback_")) {
        const qResult = await db.execute(sql`
          SELECT "correctOption", "correctAnswer" FROM "Question" WHERE id = ${questionId} LIMIT 1
        `) as any[];
        if (qResult.length > 0) {
          const rawOption = qResult[0]?.correctOption;
          if (rawOption != null) {
            correctAnswer = Number(rawOption);
          } else if (qResult[0]?.correctAnswer) {
            // Fallback: questões pré-Phase5 armazenam letra em "correctAnswer"
            correctAnswer = ["A", "B", "C", "D", "E"].indexOf(qResult[0].correctAnswer);
          }
        }
      }
      const isCorrect = correctAnswer >= 0 && Number(answer) === Number(correctAnswer);

      // Record answer
      if (simuladoQuestionId) {
        try {
          await db.execute(sql`
            INSERT INTO "simulado_answers" ("user_simulado_id","question_id","selected_answer","correct")
            VALUES (${userSimuladoId},${simuladoQuestionId},${answer},${isCorrect})
          `);
        } catch (_e) { /* non-fatal */ }
      }

      // Update progress
      await db.execute(sql`
        UPDATE "user_simulados"
        SET
          "current_question" = "current_question" + 1,
          "correct_answers" = "correct_answers" + ${isCorrect ? 1 : 0},
          "wrong_answers" = "wrong_answers" + ${isCorrect ? 0 : 1},
          "updated_at" = NOW()
        WHERE "id" = ${userSimuladoId}
      `);

      // Check if last question
      const attemptResult = await db.execute(sql`
        SELECT us."current_question", us."correct_answers", us."wrong_answers", us."started_at",
               s."total_questions", s."passing_score"
        FROM "user_simulados" us JOIN "simulados" s ON us."simulado_id" = s."id"
        WHERE us."id" = ${userSimuladoId}
      `) as any[];
      const a = attemptResult[0];
      const isLast = Number(a.current_question) >= Number(a.total_questions);

      if (isLast) {
        const total = Number(a.correct_answers) + Number(a.wrong_answers);
        const score = total > 0 ? Math.round((Number(a.correct_answers) / total) * 100) : 0;
        const passed = score >= Number(a.passing_score);
        const timeSpent = Math.round((Date.now() - new Date(a.started_at).getTime()) / 60000);
        await db.execute(sql`
          UPDATE "user_simulados"
          SET "status"='COMPLETED',"score"=${score},"passed"=${passed},"time_spent_minutes"=${timeSpent},"finished_at"=NOW()
          WHERE "id"=${userSimuladoId}
        `);
        return res.json({
          success: true,
          correct: isCorrect,
          correctAnswer,
          finished: true,
          result: {
            score, passed, correctAnswers: Number(a.correct_answers), wrongAnswers: Number(a.wrong_answers),
            totalQuestions: total, timeSpent,
          },
        });
      }

      return res.json({
        success: true,
        correct: isCorrect,
        correctAnswer,
        finished: false,
        currentQuestion: Number(a.current_question),
        correctAnswers: Number(a.correct_answers),
        wrongAnswers: Number(a.wrong_answers),
      });
    } catch (error) {
      console.error("❌ [Sala] Erro ao responder questão do simulado:", error);
      return res.status(500).json({ success: false, error: "Erro ao processar resposta." });
    }
  });

  // GET /api/sala/simulados/history - Histórico de simulados do aluno
  app.get("/api/sala/simulados/history", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const history = await db.execute(sql`
        SELECT us."id", us."status", us."score", us."passed", us."correct_answers",
               us."wrong_answers", us."time_spent_minutes", us."finished_at",
               s."title", s."month", s."total_questions"
        FROM "user_simulados" us
        JOIN "simulados" s ON us."simulado_id" = s."id"
        WHERE us."user_id" = ${student.userId}
        ORDER BY us."started_at" DESC LIMIT 12
      `) as any[];
      return res.json({
        success: true,
        history: history.map((h: any) => ({
          id: h.id, title: h.title, month: h.month, status: h.status,
          score: h.score != null ? Number(h.score) : null,
          passed: h.passed,
          correctAnswers: Number(h.correct_answers || 0),
          wrongAnswers: Number(h.wrong_answers || 0),
          totalQuestions: Number(h.total_questions),
          timeSpent: h.time_spent_minutes,
          finishedAt: h.finished_at,
        })),
      });
    } catch (error) {
      console.error("❌ [Sala] Erro ao buscar histórico de simulados:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar histórico." });
    }
  });

  // ============================================
  // PROGRESSO DO EDITAL + SIMULADO SEMANAL
  // ============================================

  // GET /api/sala/edital/progress — calcula % de conclusão do edital alvo
  // Métrica: conteúdos vistos (lastStudyContentIds) ÷ total do edital
  app.get("/api/sala/edital/progress", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;

      // 1. Buscar target_concurso_id + lastStudyContentIds em uma única query
      const userRows = await db.execute(sql`
        SELECT target_concurso_id, "lastStudyContentIds"
        FROM "User" WHERE id = ${student.userId} LIMIT 1
      `) as any[];
      const targetId = userRows[0]?.target_concurso_id;
      if (!targetId) return res.json({ success: true, percentage: 0, studiedCount: 0, totalCount: 0, subjects: [] });

      // 2. Extrair array de IDs de conteúdo já vistos pelo aluno
      const rawIds = userRows[0]?.lastStudyContentIds;
      const studiedIds: string[] = Array.isArray(rawIds)
        ? rawIds
        : (typeof rawIds === "string" && rawIds ? JSON.parse(rawIds) : []);

      // 3. Buscar lista de matérias do concurso-alvo
      const concursoRows = await db.execute(sql`
        SELECT lista_materias_json FROM concursos WHERE id = ${targetId} LIMIT 1
      `) as any[];
      const raw = concursoRows[0]?.lista_materias_json;
      const materias: any[] = Array.isArray(raw) ? raw : (typeof raw === "string" ? JSON.parse(raw) : []);
      if (!materias.length) return res.json({ success: true, percentage: 0, studiedCount: 0, totalCount: 0, subjects: [] });

      const subjects: any[] = [];
      let totalStudied = 0, totalAll = 0;

      // Helper: normaliza nome para código interno (ex: "Informática" → "INFORMATICA")
      const toSubjectCode = (name: string) =>
        name.trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toUpperCase()
          .replace(/\s+/g, "_")
          .replace(/[^A-Z0-9_]/g, "");

      // Mapa de aliases: cobre divergências entre o nome normalizado e o Subject.name real no banco.
      // Necessário porque lista_materias_json usa nomes de exibição e o banco usa siglas históricas.
      const SUBJECT_CODE_ALIASES: Record<string, string> = {
        "LINGUA_PORTUGUESA": "PORTUGUES",
        "DIREITO_CONSTITUCIONAL": "DIR_CONSTITUCIONAL",
        "DIREITO_PROCESSUAL_PENAL": "PROCESSUAL_PENAL",
        "NOCOES_DE_DIREITO_ADMINISTRATIVO": "DIREITO_ADMINISTRATIVO",
        "NOCOES_DE_INFORMATICA": "INFORMATICA",
      };

      for (const m of materias) {
        const materiaName: string = m.name || "";
        if (!materiaName) continue;

        // Busca Subject pelo nome de exibição primeiro; fallback pelo código normalizado + alias
        let subjectRows = await db.execute(sql`
          SELECT id FROM "Subject" WHERE name ILIKE ${"%" + materiaName + "%"} LIMIT 1
        `) as any[];
        if (!subjectRows[0]) {
          const code = toSubjectCode(materiaName);
          const aliasedCode = SUBJECT_CODE_ALIASES[code] ?? code;
          subjectRows = await db.execute(sql`
            SELECT id FROM "Subject" WHERE name ILIKE ${"%" + aliasedCode + "%"} LIMIT 1
          `) as any[];
          console.log(`[edital/progress] matéria="${materiaName}" code="${code}" aliased="${aliasedCode}" found=${!!subjectRows[0]}`);
        }
        if (!subjectRows[0]) {
          console.warn(`[edital/progress] ⚠️  Matéria não encontrada no banco: "${materiaName}"`);
          continue;
        }
        const sid = subjectRows[0].id;

        // Total de conteúdos ativos na matéria
        const totalRows = await db.execute(sql`
          SELECT COUNT(*)::int AS total FROM "Content"
          WHERE "subjectId" = ${sid} AND "isActive" = true
        `) as any[];
        const total = parseInt(totalRows[0]?.total ?? "0", 10);

        // Conteúdos estudados — UNION de 4 fontes (DISTINCT, sem inflação):
        //   1. lastStudyContentIds (conteúdo visualizado na web)
        //   2. QuestionAttempt → "Question" Prisma com contentId (seeds Grupo A)
        //   3. QuestionAttempt → questions Drizzle (questões geradas/AI)
        //   4. QuestionAttempt → "Question" Prisma SEM contentId (seeds Grupo B legados):
        //      proxy por topicId — 1 Content atom por tópico visitado (não infla)
        const studiedRows = await db.execute(sql`
          SELECT COUNT(DISTINCT cid)::int AS studied FROM (
            SELECT c.id AS cid FROM "Content" c
            WHERE c."subjectId" = ${sid} AND c."isActive" = true
              AND c.id = ANY(${studiedIds.length > 0 ? studiedIds : ["__none__"]})
            UNION
            SELECT q."contentId" AS cid
            FROM "QuestionAttempt" qa
            JOIN "Question" q ON q.id = qa."questionId"
            JOIN "Content" c ON c.id = q."contentId"
            WHERE qa."userId" = ${student.userId}
              AND c."subjectId" = ${sid} AND c."isActive" = true
              AND q."contentId" IS NOT NULL
            UNION
            SELECT dq.content_id AS cid
            FROM "QuestionAttempt" qa
            JOIN questions dq ON dq.id = qa."questionId"
            JOIN "Content" c ON c.id = dq.content_id
            WHERE qa."userId" = ${student.userId}
              AND c."subjectId" = ${sid} AND c."isActive" = true
            UNION
            SELECT cid FROM (
              SELECT DISTINCT ON (q."topicId") c.id AS cid
              FROM "QuestionAttempt" qa
              JOIN "Question" q ON q.id = qa."questionId"
              JOIN "Content" c ON c."topicId" = q."topicId"
                AND c."subjectId" = ${sid} AND c."isActive" = true
              WHERE qa."userId" = ${student.userId}
                AND q."subjectId" = ${sid}
                AND q."contentId" IS NULL
              ORDER BY q."topicId"
            ) _legacy
          ) t
        `) as any[];
        const studied = parseInt(studiedRows[0]?.studied ?? "0", 10);

        totalStudied += studied;
        totalAll += total;
        subjects.push({
          name: materiaName,
          studiedCount: studied,
          totalCount: total,
          percentage: total > 0 ? Math.round(studied / total * 100) : 0,
        });
      }

      const percentage = totalAll > 0 ? Math.round(totalStudied / totalAll * 100) : 0;
      return res.json({ success: true, percentage, studiedCount: totalStudied, totalCount: totalAll, subjects });
    } catch (error) {
      console.error("❌ [Sala] Erro em edital/progress:", error);
      return res.status(500).json({ success: false, error: "Erro ao calcular progresso." });
    }
  });

  // GET /api/sala/simulados/weekly-status — verifica disponibilidade do simulado semanal
  app.get("/api/sala/simulados/weekly-status", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;

      const userRows = await db.execute(sql`
        SELECT target_concurso_id FROM "User" WHERE id = ${student.userId} LIMIT 1
      `) as any[];
      if (!userRows[0]?.target_concurso_id) {
        return res.json({ available: false, reason: "no_target" });
      }

      const lastWeeklyRows = await db.execute(sql`
        SELECT us.finished_at FROM user_simulados us
        JOIN simulados s ON s.id = us.simulado_id
        WHERE us.user_id = ${student.userId} AND s.type = 'WEEKLY' AND us.status = 'COMPLETED'
        ORDER BY us.finished_at DESC NULLS LAST LIMIT 1
      `) as any[];

      const lastAt = lastWeeklyRows[0]?.finished_at;
      if (lastAt) {
        const sevenDaysLater = new Date(new Date(lastAt).getTime() + 7 * 24 * 60 * 60 * 1000);
        if (new Date() < sevenDaysLater) {
          return res.json({ available: false, reason: "cooldown", nextAvailableAt: sevenDaysLater.toISOString() });
        }
      }

      return res.json({ available: true, reason: "ok", lastFinishedAt: lastAt || null });
    } catch (error) {
      console.error("❌ [Sala] Erro em weekly-status:", error);
      return res.status(500).json({ success: false, error: "Erro ao verificar status semanal." });
    }
  });

  // POST /api/sala/simulados/weekly/start — cria simulado semanal (80% inédito + 20% erros)
  app.post("/api/sala/simulados/weekly/start", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;

      const userRows = await db.execute(sql`
        SELECT target_concurso_id FROM "User" WHERE id = ${student.userId} LIMIT 1
      `) as any[];
      const targetId = userRows[0]?.target_concurso_id;
      if (!targetId) return res.status(400).json({ success: false, error: "Defina seu concurso-alvo primeiro." });

      const concursoRows = await db.execute(sql`
        SELECT lista_materias_json, exam_type, nome FROM concursos WHERE id = ${targetId} LIMIT 1
      `) as any[];
      const rawMaterias = concursoRows[0]?.lista_materias_json;
      const materias: any[] = Array.isArray(rawMaterias) ? rawMaterias : (typeof rawMaterias === "string" ? JSON.parse(rawMaterias) : []);
      const examType: string = concursoRows[0]?.exam_type || "POLICIAL";
      const concursoNome: string = concursoRows[0]?.nome || "Semanal";

      // Coletar subjectIds do edital — mesma lógica de aliases do edital/progress
      const _toCode = (n: string) => n.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "");
      const _aliases: Record<string, string> = {
        "LINGUA_PORTUGUESA": "PORTUGUES",
        "DIREITO_CONSTITUCIONAL": "DIR_CONSTITUCIONAL",
        "DIREITO_PROCESSUAL_PENAL": "PROCESSUAL_PENAL",
        "NOCOES_DE_DIREITO_ADMINISTRATIVO": "DIREITO_ADMINISTRATIVO",
        "NOCOES_DE_INFORMATICA": "INFORMATICA",
      };
      const subjectIds: string[] = [];
      for (const m of materias) {
        const materiaName: string = m.name || "";
        if (!materiaName) continue;
        let sRows = await db.execute(sql`
          SELECT id FROM "Subject" WHERE name ILIKE ${"%" + materiaName + "%"} LIMIT 1
        `) as any[];
        if (!sRows[0]) {
          const aliased = _aliases[_toCode(materiaName)] ?? _toCode(materiaName);
          sRows = await db.execute(sql`
            SELECT id FROM "Subject" WHERE name ILIKE ${"%" + aliased + "%"} LIMIT 1
          `) as any[];
        }
        if (sRows[0]?.id) subjectIds.push(sRows[0].id);
      }
      if (!subjectIds.length) return res.status(400).json({ success: false, error: "Nenhuma matéria encontrada para este edital. Verifique o concurso-alvo." });

      // 80% conteúdo inédito — aleatório das matérias do edital (24 de 30)
      const newContentRows = await db.execute(sql`
        SELECT c.id FROM "Content" c
        WHERE c."isActive" = true
          AND c."subjectId" = ANY(${subjectIds})
        ORDER BY RANDOM() LIMIT 24
      `) as any[];

      // 20% revisão de erros — conteúdo das matérias onde o aluno errou questões (6 de 30)
      const errorContentRows = await db.execute(sql`
        SELECT DISTINCT c.id FROM "QuestionAttempt" qa
        JOIN "Question" q ON q.id = qa."questionId"
        JOIN "Content" c ON c."subjectId" = q."subjectId"
        WHERE qa."userId" = ${student.userId} AND qa."isCorrect" = false
          AND c."subjectId" = ANY(${subjectIds}) AND c."isActive" = true
        ORDER BY RANDOM() LIMIT 6
      `) as any[];

      const contentIds: string[] = [
        ...newContentRows.map((r: any) => r.id),
        ...errorContentRows.map((r: any) => r.id),
      ];
      if (contentIds.length < 2) {
        return res.status(400).json({ success: false, error: "Conteúdo insuficiente para simulado semanal. Estude mais alguns tópicos primeiro." });
      }

      // Criar registro do simulado semanal
      const now = new Date();
      const weekNum = Math.ceil(now.getDate() / 7);
      const weekLabel = `${now.getFullYear()}-W${now.getMonth() + 1}-${weekNum}`;
      const availableUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const simuladoRows = await db.execute(sql`
        INSERT INTO simulados (
          title, description, exam_type, total_questions, duration_minutes, passing_score,
          month, available_from, available_until, is_active, type
        ) VALUES (
          ${"Simulado Semanal — " + concursoNome},
          ${"Composição: 80% inédito + 20% revisão de erros"},
          ${examType}, ${contentIds.length}, 60, 60,
          ${weekLabel}, ${now.toISOString()}, ${availableUntil.toISOString()},
          true, 'WEEKLY'
        ) RETURNING id
      `) as any[];
      const simId = simuladoRows[0]?.id;
      if (!simId) throw new Error("Falha ao criar simulado semanal.");

      // Inserir simulado_questions
      for (let i = 0; i < contentIds.length; i++) {
        await db.execute(sql`
          INSERT INTO simulado_questions (simulado_id, content_id, question_order)
          VALUES (${simId}, ${contentIds[i]}, ${i + 1})
        `);
      }

      // Iniciar user_simulados
      const userSimRows = await db.execute(sql`
        INSERT INTO user_simulados (user_id, simulado_id, status, current_question, correct_answers, wrong_answers)
        VALUES (${student.userId}, ${simId}, 'IN_PROGRESS', 0, 0, 0)
        RETURNING id, started_at
      `) as any[];
      const userSimuladoId = userSimRows[0]?.id;

      return res.json({
        success: true,
        userSimuladoId,
        totalQuestions: contentIds.length,
        durationMinutes: 60,
        startedAt: userSimRows[0]?.started_at,
        resumed: false,
      });
    } catch (error) {
      console.error("❌ [Sala] Erro em weekly/start:", error);
      return res.status(500).json({ success: false, error: "Erro ao criar simulado semanal." });
    }
  });

  // ============================================
  // REDAÇÃO
  // ============================================

  const PRICE_PER_ESSAY = 1.99;
  const ESSAY_COOLDOWN_DAYS = 15;

  async function checkEssayAccessByUserId(userId: string) {
    const result = await db.execute(sql`
      SELECT "plan", "credits", last_essay_at
      FROM "User" WHERE id = ${userId} LIMIT 1
    `) as any[];
    if (result.length === 0) return { canAccess: false, reason: "not_found", message: "Usuário não encontrado." };
    const u = result[0];

    // Cooldown de 15 dias (rolling)
    const lastEssayAt: Date | null = u.last_essay_at ? new Date(u.last_essay_at) : null;
    const daysSinceLast = lastEssayAt
      ? Math.floor((Date.now() - lastEssayAt.getTime()) / (1000 * 60 * 60 * 24))
      : ESSAY_COOLDOWN_DAYS + 1;
    const daysLeft = Math.max(0, ESSAY_COOLDOWN_DAYS - daysSinceLast);

    if (daysLeft > 0) {
      return {
        canAccess: false, reason: "cooldown", daysLeft,
        message: `Próxima redação disponível em ${daysLeft} dia${daysLeft !== 1 ? "s" : ""}.`,
      };
    }

    if (u.plan === "FREE") {
      return { canAccess: false, reason: "no_plan", message: "Redações disponíveis para planos CALOURO e VETERANO." };
    }
    if (u.plan === "VETERANO") {
      return { canAccess: true, reason: "veterano_free" };
    }
    const credits = parseFloat(u.credits) || 0;
    if (credits >= PRICE_PER_ESSAY) {
      return { canAccess: true, reason: "paid", credits };
    }
    return {
      canAccess: false, reason: "no_credits", credits, price: PRICE_PER_ESSAY,
      message: `Saldo insuficiente. Adicione créditos para corrigir redações (R$ ${PRICE_PER_ESSAY.toFixed(2)}/redação).`,
    };
  }

  // correctEssay importado de ./services/ai-engine (compartilhado com bot)

  // GET /api/sala/essays/templates - Temas disponíveis para o concurso do aluno
  app.get("/api/sala/essays/templates", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const userRow = await db.execute(sql`
        SELECT "examType" FROM "User" WHERE id = ${student.userId} LIMIT 1
      `) as any[];
      const examType: string = userRow[0]?.examType || "";
      let category = "PF";
      if (/MILITAR|PM/i.test(examType)) category = "PM";
      else if (/CIVIL|PC/i.test(examType)) category = "PC";

      const templates = await db.execute(sql`
        SELECT id, title, motivating_text
        FROM redacao_templates
        WHERE concurso_category = ${category} AND active = true
        ORDER BY RANDOM()
        LIMIT 3
      `) as any[];

      return res.json({ success: true, templates, category });
    } catch (error) {
      console.error("❌ [Sala] Erro ao buscar templates de redação:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar temas." });
    }
  });

  // GET /api/sala/essays/status - Status de redações do aluno
  app.get("/api/sala/essays/status", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const result = await db.execute(sql`
        SELECT "plan", "credits", last_essay_at,
          (SELECT total_score FROM essays
           WHERE user_id = ${student.userId} AND status = 'CORRECTED'
           ORDER BY corrected_at DESC LIMIT 1) as last_score
        FROM "User" WHERE id = ${student.userId} LIMIT 1
      `) as any[];
      if (result.length === 0) return res.status(404).json({ success: false, error: "Usuário não encontrado." });
      const u = result[0];

      const lastEssayAt: Date | null = u.last_essay_at ? new Date(u.last_essay_at) : null;
      const daysSinceLast = lastEssayAt
        ? Math.floor((Date.now() - lastEssayAt.getTime()) / (1000 * 60 * 60 * 24))
        : ESSAY_COOLDOWN_DAYS + 1;
      const cooldownDaysLeft = Math.max(0, ESSAY_COOLDOWN_DAYS - daysSinceLast);
      const available = cooldownDaysLeft === 0 && u.plan !== "FREE";

      return res.json({
        success: true,
        plan: u.plan,
        available,
        cooldownDaysLeft,
        lastEssayAt: lastEssayAt?.toISOString() ?? null,
        lastScore: u.last_score ?? null,
        credits: parseFloat(u.credits) || 0,
        pricePerEssay: PRICE_PER_ESSAY,
        // backward-compat para código antigo
        freeRemaining: available && u.plan === "VETERANO" ? 1 : 0,
        used: cooldownDaysLeft > 0 ? 1 : 0,
        freeLimit: u.plan === "VETERANO" ? 1 : 0,
      });
    } catch (error) {
      console.error("❌ [Sala] Erro ao buscar status de redações:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar status." });
    }
  });

  // POST /api/sala/essays/submit - Enviar redação para correção
  app.post("/api/sala/essays/submit", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const { theme, text, motivatingText } = req.body;
      if (!theme || !text) return res.status(400).json({ success: false, error: "Tema e texto são obrigatórios." });
      if (text.trim().split(/\s+/).length < 50) {
        return res.status(400).json({ success: false, error: "Redação muito curta (mínimo 50 palavras)." });
      }

      const access = await checkEssayAccessByUserId(student.userId);
      if (!access.canAccess) {
        return res.status(403).json({
          success: false,
          requiresUpgrade: access.reason !== "cooldown",
          cooldown: access.reason === "cooldown",
          daysLeft: (access as any).daysLeft,
          error: access.message,
        });
      }

      const userResult = await db.execute(sql`
        SELECT "examType" FROM "User" WHERE id = ${student.userId} LIMIT 1
      `) as any[];
      const examType = userResult[0]?.examType || "concurso policial";
      const wordCount = text.trim().split(/\s+/).length;

      // Registrar tentativa SEM consumir crédito ainda
      const essayResult = await db.execute(sql`
        INSERT INTO "essays" ("user_id","theme","text","word_count","status","was_free","amount_paid","submitted_at","created_at","updated_at")
        VALUES (${student.userId},${theme},${text},${wordCount},'CORRECTING',${access.reason === "veterano_free"},${access.reason === "paid" ? PRICE_PER_ESSAY : 0},NOW(),NOW(),NOW())
        RETURNING "id"
      `) as any[];
      const essayId = essayResult[0].id;

      // Correção via IA ANTES de consumir crédito (crédito preservado em caso de falha)
      let correction = null;
      try {
        correction = await correctEssay(theme, text, examType, motivatingText || "");
      } catch (aiError: any) {
        // IA falhou — marca erro, NÃO debita crédito
        const aiStatus = aiError?.status ?? aiError?.statusCode ?? "?";
        const aiMsg = aiError?.message ?? String(aiError);
        console.error(`❌ [Sala] Falha na correção de redação (essayId=${essayId}, status=${aiStatus}): ${aiMsg}`);
        await db.execute(sql`UPDATE "essays" SET "status"='ERROR',"updated_at"=NOW() WHERE "id"=${essayId}`);
        return res.status(500).json({
          success: false,
          creditsPreserved: true,
          error: "Erro na análise técnica. Seus créditos estão preservados. Tente novamente em alguns minutos.",
        });
      }

      // IA retornou com sucesso — atualizar last_essay_at + créditos
      if (access.reason === "paid") {
        await db.execute(sql`
          UPDATE "User" SET
            last_essay_at = NOW(),
            "credits"=COALESCE("credits",0)-${PRICE_PER_ESSAY},
            "totalEssaysSubmitted"=COALESCE("totalEssaysSubmitted",0)+1,
            "updatedAt"=NOW()
          WHERE id=${student.userId}
        `);
      } else {
        await db.execute(sql`
          UPDATE "User" SET
            last_essay_at = NOW(),
            "totalEssaysSubmitted"=COALESCE("totalEssaysSubmitted",0)+1,
            "updatedAt"=NOW()
          WHERE id=${student.userId}
        `);
      }

      // Persistir resultado da IA (4 critérios, score_5 = NULL)
      await db.execute(sql`
        UPDATE "essays" SET
          "status"='CORRECTED',
          "score_1"=${correction.scores.comp1},"score_2"=${correction.scores.comp2},
          "score_3"=${correction.scores.comp3},"score_4"=${correction.scores.comp4},
          "score_5"=NULL,"total_score"=${correction.scores.total},
          "feedback"=${correction.feedback.general},
          "feedback_comp_1"=${correction.feedback.comp1},"feedback_comp_2"=${correction.feedback.comp2},
          "feedback_comp_3"=${correction.feedback.comp3},"feedback_comp_4"=${correction.feedback.comp4},
          "feedback_comp_5"=NULL,
          "rewrite_suggestion"=${correction.rewrite_suggestion || null},
          "corrected_at"=NOW(),"updated_at"=NOW()
        WHERE "id"=${essayId}
      `);

      return res.json({ success: true, essayId, status: "CORRECTED", correction });
    } catch (error) {
      console.error("❌ [Sala] Erro ao submeter redação:", error);
      return res.status(500).json({ success: false, error: "Erro ao processar redação." });
    }
  });

  // GET /api/sala/essays - Listar redações do aluno
  app.get("/api/sala/essays", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const essays = await db.execute(sql`
        SELECT "id","theme","word_count","status","total_score","was_free","submitted_at","corrected_at"
        FROM "essays" WHERE "user_id" = ${student.userId}
        ORDER BY "submitted_at" DESC LIMIT 20
      `) as any[];
      return res.json({
        success: true,
        essays: essays.map((e: any) => ({
          id: e.id, theme: e.theme, wordCount: e.word_count, status: e.status,
          totalScore: e.total_score, wasFree: e.was_free,
          submittedAt: e.submitted_at, correctedAt: e.corrected_at,
        })),
      });
    } catch (error) {
      console.error("❌ [Sala] Erro ao listar redações:", error);
      return res.status(500).json({ success: false, error: "Erro ao listar redações." });
    }
  });

  // GET /api/sala/essays/:essayId - Detalhes de uma redação
  app.get("/api/sala/essays/:essayId", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const { essayId } = req.params;
      const result = await db.execute(sql`
        SELECT * FROM "essays" WHERE "id"=${essayId} AND "user_id"=${student.userId} LIMIT 1
      `) as any[];
      if (result.length === 0) return res.status(404).json({ success: false, error: "Redação não encontrada." });
      const e = result[0];
      return res.json({
        success: true,
        essay: {
          id: e.id, theme: e.theme, text: e.text, wordCount: e.word_count, status: e.status,
          scores: { comp1: e.score_1, comp2: e.score_2, comp3: e.score_3, comp4: e.score_4, comp5: e.score_5, total: e.total_score },
          feedback: { general: e.feedback, comp1: e.feedback_comp_1, comp2: e.feedback_comp_2, comp3: e.feedback_comp_3, comp4: e.feedback_comp_4, comp5: e.feedback_comp_5 },
          wasFree: e.was_free, submittedAt: e.submitted_at, correctedAt: e.corrected_at,
        },
      });
    } catch (error) {
      console.error("❌ [Sala] Erro ao buscar redação:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar redação." });
    }
  });

  // ============================================
  // SM2 — REVISÃO ESPAÇADA
  // ============================================

  // GET /api/sala/sm2/due - Itens para revisar hoje
  app.get("/api/sala/sm2/due", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const limit = Math.min(Number(req.query.limit) || 10, 20);

      const dueItems = await db.execute(sql`
        SELECT
          r."id" as review_id,
          r."content_id",
          r."ease_factor",
          r."interval",
          r."repetitions",
          r."next_review_date",
          r."times_correct",
          r."times_incorrect",
          r."total_reviews",
          c."title",
          c."textContent" as body,
          s."name" as subject_name
        FROM "sm2_reviews" r
        JOIN "Content" c ON c."id" = r."content_id"
        JOIN "Subject" s ON s."id" = c."subjectId"
        WHERE r."user_id" = ${student.userId}
          AND r."next_review_date" <= NOW()
        ORDER BY r."next_review_date" ASC
        LIMIT ${limit}
      `) as any[];

      // Also get total count
      const countResult = await db.execute(sql`
        SELECT COUNT(*) as total FROM "sm2_reviews"
        WHERE "user_id" = ${student.userId} AND "next_review_date" <= NOW()
      `) as any[];

      return res.json({
        success: true,
        dueCount: Number(countResult[0]?.total || 0),
        items: dueItems.map((r: any) => ({
          reviewId: r.review_id,
          contentId: r.content_id,
          title: r.title,
          body: r.body || r.textContent,
          subjectName: r.subject_name,
          easeFactor: r.ease_factor,
          interval: r.interval,
          repetitions: r.repetitions,
          timesCorrect: Number(r.times_correct),
          timesIncorrect: Number(r.times_incorrect),
          totalReviews: Number(r.total_reviews),
        })),
      });
    } catch (error) {
      console.error("❌ [Sala] Erro ao buscar revisões:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar revisões." });
    }
  });

  // POST /api/sala/sm2/review - Registrar resultado de revisão
  app.post("/api/sala/sm2/review", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const { reviewId, quality } = req.body; // quality 0-5

      if (!reviewId || quality === undefined) {
        return res.status(400).json({ success: false, error: "reviewId e quality são obrigatórios." });
      }

      const q = Math.max(0, Math.min(5, Number(quality)));

      // Get current SM2 params (incluindo content_id para persistência posterior)
      const current = await db.execute(sql`
        SELECT "ease_factor","interval","repetitions","times_correct","times_incorrect","total_reviews","content_id"
        FROM "sm2_reviews"
        WHERE "id" = ${reviewId} AND "user_id" = ${student.userId}
        LIMIT 1
      `) as any[];

      if (current.length === 0) return res.status(404).json({ success: false, error: "Revisão não encontrada." });
      const c = current[0];

      // Calculate new SM2 params
      const { calculateSM2 } = await import("./services/sm2-engine");
      const result = calculateSM2(q, c.ease_factor, c.interval, c.repetitions);

      const isCorrect = q >= 3;
      await db.execute(sql`
        UPDATE "sm2_reviews"
        SET
          "ease_factor" = ${result.easeFactor},
          "interval" = ${result.interval},
          "repetitions" = ${result.repetitions},
          "next_review_date" = ${result.nextReviewDate.toISOString()},
          "last_quality" = ${q},
          "times_correct" = "times_correct" + ${isCorrect ? 1 : 0},
          "times_incorrect" = "times_incorrect" + ${isCorrect ? 0 : 1},
          "total_reviews" = "total_reviews" + 1,
          "last_reviewed_at" = NOW(),
          "updated_at" = NOW()
        WHERE "id" = ${reviewId}
      `);

      // Acerto no Reforço SM2 → alimentar contadores de desbloqueio (Simulado + XP)
      if (isCorrect && c.content_id) {
        try {
          // 1. Incrementar totalQuestionsAnswered (XP e contador global)
          await db.execute(sql`
            UPDATE "User"
            SET "totalQuestionsAnswered" = COALESCE("totalQuestionsAnswered", 0) + 1,
                "updatedAt" = NOW()
            WHERE id = ${student.userId}
          `);

          // 2. Buscar subjectId do conteúdo revisado
          const contentRows = await db.execute(sql`
            SELECT "subjectId" FROM "Content" WHERE id = ${c.content_id} LIMIT 1
          `) as any[];

          if (contentRows.length > 0 && contentRows[0].subjectId) {
            const subjectId = contentRows[0].subjectId;

            // 3. Buscar qualquer questão real do mesmo subject
            const questionRows = await db.execute(sql`
              SELECT id FROM "Question"
              WHERE "subjectId" = ${subjectId}
              LIMIT 1
            `) as any[];

            if (questionRows.length > 0) {
              const questionId = questionRows[0].id;
              const qaId = `qa${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`.slice(0, 25);

              // 4. Criar QuestionAttempt marcado como SM2_REVIEW — alimenta totalQuestionsInCurrentCourse
              await db.execute(sql`
                INSERT INTO "QuestionAttempt" (
                  "id", "userId", "questionId", "userAnswer",
                  "isCorrect", "attemptType", "reviewAttempt", "createdAt"
                ) VALUES (
                  ${qaId}, ${student.userId}, ${questionId}, '0',
                  true, 'SM2_REVIEW', true, NOW()
                )
              `);
            }
          }
        } catch (_e) { /* não-fatal: persistência de acerto SM2 */ }
      }

      return res.json({
        success: true,
        nextReviewDate: result.nextReviewDate,
        nextInterval: result.interval,
        easeFactor: result.easeFactor,
      });
    } catch (error) {
      console.error("❌ [Sala] Erro ao registrar revisão:", error);
      return res.status(500).json({ success: false, error: "Erro ao registrar revisão." });
    }
  });

  // ============================================
  // INTELIGÊNCIA DE EDITAIS
  // ============================================

  // GET /api/edital/search?concurso=X&estado=SP
  // Busca ou infere via Anthropic as matérias de um concurso
  app.get("/api/edital/search", requireStudentAuth, async (req, res) => {
    try {
      const { concurso, estado } = req.query as { concurso?: string; estado?: string };
      if (!concurso || String(concurso).trim() === "") {
        return res.status(400).json({ error: "Parâmetro 'concurso' é obrigatório" });
      }
      const { getOrSearchEdital } = await import("./services/edital-engine");
      const result = await getOrSearchEdital(
        String(concurso).trim(),
        estado ? String(estado).trim() : undefined,
      );
      if (!result) {
        return res.status(404).json({ error: "Concurso não encontrado e não foi possível inferir o edital" });
      }
      return res.json(result);
    } catch (err: any) {
      console.error("❌ [Edital Search]", err?.message ?? err);
      return res.status(500).json({ error: "Erro interno ao buscar edital" });
    }
  });

  // GET /api/edital/concursos — lista todos os concursos cadastrados
  app.get("/api/edital/concursos", requireStudentAuth, async (req, res) => {
    try {
      const rows = await db.execute(sql`
        SELECT id, nome, sigla, esfera, exam_type, banca, cargo_padrao, estado,
               lista_materias_json, is_active, ordem
        FROM concursos
        WHERE is_active = true
        ORDER BY esfera, nome
      `) as any[];
      return res.json({ concursos: rows });
    } catch (err: any) {
      console.error("❌ [Edital Concursos]", err?.message ?? err);
      return res.status(500).json({ error: "Erro ao listar concursos" });
    }
  });

  // ============================================
  // GAMIFICAÇÃO — STREAK + RANKING
  // ============================================

  // GET /api/sala/gamification - Dados de gamificação do aluno
  app.get("/api/sala/gamification", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;

      const userResult = await db.execute(sql`
        SELECT
          "totalQuestionsAnswered", "totalEssaysSubmitted",
          streak_days, best_streak, last_streak_date,
          name, target_concurso_id
        FROM "User"
        WHERE id = ${student.userId}
        LIMIT 1
      `) as any[];

      if (userResult.length === 0) return res.status(404).json({ success: false });
      const u = userResult[0];

      // XP: questões * 10 + redações * 50 (mantido para level/xp do aluno)
      const xp = (Number(u.totalQuestionsAnswered) || 0) * 10 + (Number(u.totalEssaysSubmitted) || 0) * 50;
      const level = Math.floor(xp / 1000) + 1;
      const xpInCurrentLevel = xp - (level - 1) * 1000;
      const xpForNextLevel = 1000;

      // Streak validity: lost if last_streak_date is not today or yesterday
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const streakActive = u.last_streak_date === today || u.last_streak_date === yesterday;
      const streakDays = streakActive ? (Number(u.streak_days) || 0) : 0;

      // Score do aluno atual: (taxa_acerto × total_questoes) / streak
      // = correct_answers / streak_days  (se streak=0 ou questoes=0 → score=0)
      const currentUserCorrectResult = await db.execute(sql`
        SELECT COUNT(DISTINCT CASE WHEN qa."isCorrect" = true THEN qa."questionId" END)::int as correct
        FROM "QuestionAttempt" qa
        WHERE qa."userId" = ${student.userId}
      `) as any[];
      const currentUserCorrect = Number(currentUserCorrectResult[0]?.correct || 0);
      const currentUserScore = (streakDays > 0 && currentUserCorrect > 0)
        ? currentUserCorrect / streakDays
        : 0;

      // Ranking e top 10 filtrados pelo mesmo concurso-alvo
      // Fórmula: (taxa_acerto × total_questoes) / streak = correct / streak (0 se sem streak)
      const targetConcursoId = u.target_concurso_id || null;

      const topUsers = targetConcursoId
        ? await db.execute(sql`
            SELECT
              u.name,
              u.streak_days,
              u.last_streak_date,
              ("totalQuestionsAnswered" * 10 + COALESCE("totalEssaysSubmitted", 0) * 50) as xp,
              COUNT(DISTINCT CASE WHEN qa."isCorrect" = true THEN qa."questionId" END)::int as correct_answers
            FROM "User" u
            LEFT JOIN "QuestionAttempt" qa ON qa."userId" = u.id
            WHERE u.target_concurso_id = ${targetConcursoId}
              AND u."totalQuestionsAnswered" > 0
            GROUP BY u.id, u.name, u.streak_days, u.last_streak_date, u."totalQuestionsAnswered", u."totalEssaysSubmitted"
            ORDER BY
              CASE
                WHEN COALESCE(u.streak_days, 0) > 0
                  AND COUNT(DISTINCT CASE WHEN qa."isCorrect" = true THEN qa."questionId" END) > 0
                THEN COUNT(DISTINCT CASE WHEN qa."isCorrect" = true THEN qa."questionId" END)::float / u.streak_days
                ELSE 0
              END DESC
            LIMIT 10
          `) as any[]
        : await db.execute(sql`
            SELECT
              u.name,
              u.streak_days,
              u.last_streak_date,
              ("totalQuestionsAnswered" * 10 + COALESCE("totalEssaysSubmitted", 0) * 50) as xp,
              COUNT(DISTINCT CASE WHEN qa."isCorrect" = true THEN qa."questionId" END)::int as correct_answers
            FROM "User" u
            LEFT JOIN "QuestionAttempt" qa ON qa."userId" = u.id
            WHERE u."totalQuestionsAnswered" > 0
            GROUP BY u.id, u.name, u.streak_days, u.last_streak_date, u."totalQuestionsAnswered", u."totalEssaysSubmitted"
            ORDER BY
              CASE
                WHEN COALESCE(u.streak_days, 0) > 0
                  AND COUNT(DISTINCT CASE WHEN qa."isCorrect" = true THEN qa."questionId" END) > 0
                THEN COUNT(DISTINCT CASE WHEN qa."isCorrect" = true THEN qa."questionId" END)::float / u.streak_days
                ELSE 0
              END DESC
            LIMIT 10
          `) as any[];

      // Rank do aluno no concurso-alvo
      const rankResult = targetConcursoId
        ? await db.execute(sql`
            SELECT COUNT(*) + 1 as rank
            FROM (
              SELECT
                u.id,
                u.streak_days,
                COUNT(DISTINCT CASE WHEN qa."isCorrect" = true THEN qa."questionId" END)::int as correct_answers
              FROM "User" u
              LEFT JOIN "QuestionAttempt" qa ON qa."userId" = u.id
              WHERE u.target_concurso_id = ${targetConcursoId}
                AND u."totalQuestionsAnswered" > 0
                AND u.id != ${student.userId}
              GROUP BY u.id, u.streak_days
            ) sub
            WHERE CASE
              WHEN COALESCE(sub.streak_days, 0) > 0 AND sub.correct_answers > 0
              THEN sub.correct_answers::float / sub.streak_days
              ELSE 0
            END > ${currentUserScore}
          `) as any[]
        : await db.execute(sql`
            SELECT COUNT(*) + 1 as rank
            FROM (
              SELECT
                u.id,
                u.streak_days,
                COUNT(DISTINCT CASE WHEN qa."isCorrect" = true THEN qa."questionId" END)::int as correct_answers
              FROM "User" u
              LEFT JOIN "QuestionAttempt" qa ON qa."userId" = u.id
              WHERE u."totalQuestionsAnswered" > 0
                AND u.id != ${student.userId}
              GROUP BY u.id, u.streak_days
            ) sub
            WHERE CASE
              WHEN COALESCE(sub.streak_days, 0) > 0 AND sub.correct_answers > 0
              THEN sub.correct_answers::float / sub.streak_days
              ELSE 0
            END > ${currentUserScore}
          `) as any[];

      return res.json({
        success: true,
        streak: streakDays,
        bestStreak: Number(u.best_streak) || 0,
        xp,
        level,
        xpInCurrentLevel,
        xpForNextLevel,
        rank: Number(rankResult[0]?.rank) || 1,
        topUsers: topUsers.map((t: any) => {
          const tXp = Number(t.xp);
          const tStreakActive = t.last_streak_date === today || t.last_streak_date === yesterday;
          const tStreak = tStreakActive ? (Number(t.streak_days) || 0) : 0;
          return {
            name: t.name ? (t.name.split(" ")[0] || "Aluno") : "Aluno",
            xp: tXp,
            level: Math.floor(tXp / 1000) + 1,
            streak: tStreak,
          };
        }),
      });
    } catch (error) {
      console.error("❌ [Sala] Erro ao buscar gamificação:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar gamificação." });
    }
  });
}
