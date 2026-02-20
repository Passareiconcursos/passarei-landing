/**
 * Sala de Aula — API Routes
 *
 * Endpoints protegidos por requireStudentAuth (JWT).
 * Usa a camada de serviços compartilhada (server/services/).
 */

import type { Express } from "express";
import { db } from "../db";
import { sql } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";
import { requireStudentAuth, getStudentProfile, type StudentJWTPayload } from "./auth-student";

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
          s.id, s.name, s.slug,
          COUNT(c.id) as content_count
        FROM "Subject" s
        LEFT JOIN "Content" c ON c."subjectId" = s.id
        GROUP BY s.id, s.name, s.slug
        HAVING COUNT(c.id) > 0
        ORDER BY s.name
      `) as any[];

      // Enrich with student's difficulty/facility info
      const enriched = subjectsResult.map((s: any) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
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
          parsed,
          enrichment,
        },
      });
    } catch (error) {
      console.error("❌ [Sala] Erro ao buscar conteúdo sequencial:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar conteúdo." });
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

      // 2. Get question (4-tier matching)
      const question = await getQuestionForContent(
        contentId as string,
        subjectId as string,
        (topicId as string) || null,
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

      // Calculate remaining
      const remaining = access.freeRemaining ?? access.dailyRemaining;

      return res.json({
        success: true,
        question: {
          id: question.id,
          text: question.pergunta || question.text,
          options: question.opcoes || question.options,
          // NOTE: Don't send correct answer yet
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
          SELECT "correctOption", "statement" FROM "Question" WHERE id = ${questionId} LIMIT 1
        `) as any[];

        if (prismaQ.length > 0) {
          correctAnswer = prismaQ[0].correctOption;
          questionText = prismaQ[0].statement ?? "";
        } else {
          // Try questions (Drizzle) — correctAnswer is a letter (A/B/C/D)
          const drizzleQ = await db.execute(sql`
            SELECT correct_answer, question_text FROM questions WHERE id = ${questionId} LIMIT 1
          `) as any[];

          if (drizzleQ.length === 0) {
            return res.status(404).json({ success: false, error: "Questão não encontrada." });
          }
          correctAnswer = ["A", "B", "C", "D", "E"].indexOf(drizzleQ[0].correct_answer);
          questionText = drizzleQ[0].question_text ?? "";
        }
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

      // Generate explanation via AI
      let explanation = null;
      try {
        const expResult = await generateExplanation(
          contentTitle || "",
          contentText || questionText || "",
          String(userAnswer),
          String(correctAnswer),
          isCorrect,
        );
        explanation = expResult.explanation;
      } catch (_e) {
        // Explanation is optional
      }

      return res.json({
        success: true,
        isCorrect,
        correctAnswer,
        explanation,
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
          "firstInteractionDate"
        FROM "User"
        WHERE id = ${student.userId}
        LIMIT 1
      `) as any[];

      if (userResult.length === 0) {
        return res.status(404).json({ success: false, error: "Usuário não encontrado." });
      }

      const u = userResult[0];

      // Get per-subject stats
      const subjectStats = await db.execute(sql`
        SELECT
          s.name as subject_name,
          COUNT(qa.id) as total_questions,
          COUNT(CASE WHEN qa."isCorrect" = true THEN 1 END) as correct
        FROM "QuestionAttempt" qa
        JOIN "Question" q ON qa."questionId" = q.id
        JOIN "Content" c ON q."contentId" = c.id
        JOIN "Subject" s ON c."subjectId" = s.id
        WHERE qa."userId" = ${student.userId}
        GROUP BY s.name
        ORDER BY total_questions DESC
      `) as any[];

      // Access info
      const access = await checkQuestionAccess(student.userId, "userId");

      return res.json({
        success: true,
        stats: {
          totalQuestionsAnswered: u.totalQuestionsAnswered || 0,
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
        SELECT sq."id" as sq_id, sq."content_id", c."title", c."body", c."textContent"
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
          SELECT "correctOption" FROM "Question" WHERE id = ${questionId} LIMIT 1
        `) as any[];
        correctAnswer = qResult[0]?.correctOption ?? -1;
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
  // REDAÇÃO
  // ============================================

  const PRICE_PER_ESSAY = 1.99;
  const VETERANO_FREE_ESSAYS = 2;

  async function checkEssayAccessByUserId(userId: string) {
    const result = await db.execute(sql`
      SELECT "plan", "credits", "monthlyEssaysUsed", "lastEssayMonth"
      FROM "User" WHERE id = ${userId} LIMIT 1
    `) as any[];
    if (result.length === 0) return { canAccess: false, reason: "no_access", message: "Usuário não encontrado." };
    const u = result[0];
    const currentMonth = new Date().toISOString().slice(0, 7);

    let essaysUsed = u.monthlyEssaysUsed || 0;
    if ((u.lastEssayMonth || "") !== currentMonth) {
      await db.execute(sql`UPDATE "User" SET "monthlyEssaysUsed"=0,"lastEssayMonth"=${currentMonth} WHERE id=${userId}`);
      essaysUsed = 0;
    }
    if (u.plan === "VETERANO" && essaysUsed < VETERANO_FREE_ESSAYS) {
      return { canAccess: true, reason: "veterano_free", freeRemaining: VETERANO_FREE_ESSAYS - essaysUsed };
    }
    const credits = parseFloat(u.credits) || 0;
    if (credits >= PRICE_PER_ESSAY) {
      return { canAccess: true, reason: "paid", credits, price: PRICE_PER_ESSAY };
    }
    return {
      canAccess: false, reason: "no_credits", credits, price: PRICE_PER_ESSAY,
      message: u.plan === "FREE"
        ? `Redações disponíveis para planos CALOURO e VETERANO. O plano VETERANO inclui 2 redações grátis/mês.`
        : `Saldo insuficiente. Adicione créditos para corrigir redações (R$ ${PRICE_PER_ESSAY.toFixed(2)}/redação).`,
    };
  }

  async function correctEssayWithAI(theme: string, text: string, examType: string = "concurso policial") {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: `Você é um corretor especialista em redações para ${examType}.\n\nTEMA: ${theme}\n\nTEXTO:\n${text}\n\nCorrija com os 5 critérios (0-200 pts cada, múltiplos de 40):\n1. Domínio da norma culta\n2. Compreensão da proposta\n3. Seleção e organização de argumentos\n4. Coesão textual\n5. Proposta de intervenção\n\nRetorne APENAS JSON:\n{"scores":{"comp1":0,"comp2":0,"comp3":0,"comp4":0,"comp5":0},"feedback":{"general":"...","comp1":"...","comp2":"...","comp3":"...","comp4":"...","comp5":"..."}}` }],
    });
    const text2 = response.content[0].type === "text" ? response.content[0].text : "";
    const match = text2.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("JSON inválido na resposta da IA");
    const r = JSON.parse(match[0]);
    const total = r.scores.comp1 + r.scores.comp2 + r.scores.comp3 + r.scores.comp4 + r.scores.comp5;
    return { scores: { ...r.scores, total }, feedback: r.feedback };
  }

  // GET /api/sala/essays/status - Status de redações do aluno
  app.get("/api/sala/essays/status", requireStudentAuth, async (req, res) => {
    try {
      const student = (req as any).student as StudentJWTPayload;
      const result = await db.execute(sql`
        SELECT "plan","credits","monthlyEssaysUsed","lastEssayMonth","totalEssaysSubmitted"
        FROM "User" WHERE id = ${student.userId} LIMIT 1
      `) as any[];
      if (result.length === 0) return res.status(404).json({ success: false, error: "Usuário não encontrado." });
      const u = result[0];
      const currentMonth = new Date().toISOString().slice(0, 7);
      const essaysUsed = (u.lastEssayMonth || "") === currentMonth ? (u.monthlyEssaysUsed || 0) : 0;
      const freeLimit = u.plan === "VETERANO" ? VETERANO_FREE_ESSAYS : 0;
      return res.json({
        success: true,
        plan: u.plan,
        used: essaysUsed,
        freeLimit,
        freeRemaining: Math.max(0, freeLimit - essaysUsed),
        credits: parseFloat(u.credits) || 0,
        pricePerEssay: PRICE_PER_ESSAY,
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
      const { theme, text } = req.body;
      if (!theme || !text) return res.status(400).json({ success: false, error: "Tema e texto são obrigatórios." });
      if (text.trim().split(/\s+/).length < 50) {
        return res.status(400).json({ success: false, error: "Redação muito curta (mínimo 50 palavras)." });
      }

      const access = await checkEssayAccessByUserId(student.userId);
      if (!access.canAccess) {
        return res.status(403).json({ success: false, requiresUpgrade: true, error: access.message });
      }

      const userResult = await db.execute(sql`
        SELECT "examType" FROM "User" WHERE id = ${student.userId} LIMIT 1
      `) as any[];
      const examType = userResult[0]?.examType || "concurso policial";
      const wordCount = text.trim().split(/\s+/).length;

      const essayResult = await db.execute(sql`
        INSERT INTO "essays" ("user_id","theme","text","word_count","status","was_free","amount_paid","submitted_at","created_at","updated_at")
        VALUES (${student.userId},${theme},${text},${wordCount},'CORRECTING',${access.reason === "veterano_free"},${access.reason === "paid" ? PRICE_PER_ESSAY : 0},NOW(),NOW(),NOW())
        RETURNING "id"
      `) as any[];
      const essayId = essayResult[0].id;

      // Consume access
      const currentMonth = new Date().toISOString().slice(0, 7);
      if (access.reason === "veterano_free") {
        await db.execute(sql`UPDATE "User" SET "monthlyEssaysUsed"=COALESCE("monthlyEssaysUsed",0)+1,"lastEssayMonth"=${currentMonth},"totalEssaysSubmitted"=COALESCE("totalEssaysSubmitted",0)+1,"updatedAt"=NOW() WHERE id=${student.userId}`);
      } else {
        await db.execute(sql`UPDATE "User" SET "credits"=COALESCE("credits",0)-${PRICE_PER_ESSAY},"monthlyEssaysUsed"=COALESCE("monthlyEssaysUsed",0)+1,"lastEssayMonth"=${currentMonth},"totalEssaysSubmitted"=COALESCE("totalEssaysSubmitted",0)+1,"updatedAt"=NOW() WHERE id=${student.userId}`);
      }

      // AI correction (synchronous)
      let correction = null;
      let status = "CORRECTED";
      try {
        correction = await correctEssayWithAI(theme, text, examType);
        await db.execute(sql`
          UPDATE "essays" SET
            "status"='CORRECTED',
            "score_1"=${correction.scores.comp1},"score_2"=${correction.scores.comp2},
            "score_3"=${correction.scores.comp3},"score_4"=${correction.scores.comp4},
            "score_5"=${correction.scores.comp5},"total_score"=${correction.scores.total},
            "feedback"=${correction.feedback.general},
            "feedback_comp_1"=${correction.feedback.comp1},"feedback_comp_2"=${correction.feedback.comp2},
            "feedback_comp_3"=${correction.feedback.comp3},"feedback_comp_4"=${correction.feedback.comp4},
            "feedback_comp_5"=${correction.feedback.comp5},
            "corrected_at"=NOW(),"updated_at"=NOW()
          WHERE "id"=${essayId}
        `);
      } catch (_e) {
        status = "ERROR";
        await db.execute(sql`UPDATE "essays" SET "status"='ERROR',"updated_at"=NOW() WHERE "id"=${essayId}`);
      }

      return res.json({ success: true, essayId, status, correction });
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
          c."body",
          c."textContent",
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

      // Get current SM2 params
      const current = await db.execute(sql`
        SELECT "ease_factor","interval","repetitions","times_correct","times_incorrect","total_reviews"
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
      return res.json(rows);
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
          name
        FROM "User"
        WHERE id = ${student.userId}
        LIMIT 1
      `) as any[];

      if (userResult.length === 0) return res.status(404).json({ success: false });
      const u = userResult[0];

      // XP: questões * 10 + redações * 50
      const xp = (Number(u.totalQuestionsAnswered) || 0) * 10 + (Number(u.totalEssaysSubmitted) || 0) * 50;
      const level = Math.floor(xp / 1000) + 1;
      const xpInCurrentLevel = xp - (level - 1) * 1000;
      const xpForNextLevel = 1000; // each level = 1000 XP

      // Streak validity: lost if last_streak_date is not today or yesterday
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const streakActive = u.last_streak_date === today || u.last_streak_date === yesterday;
      const streakDays = streakActive ? (Number(u.streak_days) || 0) : 0;

      // Top 10 by XP
      const topUsers = await db.execute(sql`
        SELECT
          name,
          ("totalQuestionsAnswered" * 10 + COALESCE("totalEssaysSubmitted", 0) * 50) as xp,
          COALESCE(streak_days, 0) as streak_days,
          last_streak_date
        FROM "User"
        WHERE "totalQuestionsAnswered" > 0
        ORDER BY xp DESC
        LIMIT 10
      `) as any[];

      // User's rank among all users
      const rankResult = await db.execute(sql`
        SELECT COUNT(*) + 1 as rank
        FROM "User"
        WHERE ("totalQuestionsAnswered" * 10 + COALESCE("totalEssaysSubmitted", 0) * 50) > ${xp}
          AND "totalQuestionsAnswered" > 0
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
          return {
            name: t.name ? (t.name.split(" ")[0] || "Aluno") : "Aluno",
            xp: tXp,
            level: Math.floor(tXp / 1000) + 1,
            streak: tStreakActive ? Number(t.streak_days) : 0,
          };
        }),
      });
    } catch (error) {
      console.error("❌ [Sala] Erro ao buscar gamificação:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar gamificação." });
    }
  });
}
