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
        LEFT JOIN "Content" c ON c."subjectId" = s.id AND c.status = 'PUBLISHED'
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
      const { subjectId } = req.query;

      // Build session state for smart content selection
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
        // AI-generated question — answer was stored in client
        correctAnswer = correctIndex;
      } else {
        // DB question
        const qResult = await db.execute(sql`
          SELECT "correctOption", "text" FROM "Question" WHERE id = ${questionId} LIMIT 1
        `) as any[];

        if (qResult.length === 0) {
          return res.status(404).json({ success: false, error: "Questão não encontrada." });
        }
        correctAnswer = qResult[0].correctOption;
        questionText = qResult[0].text;
      }

      const isCorrect = Number(userAnswer) === Number(correctAnswer);

      // Record attempt
      await recordQuestionAttempt(
        student.userId,
        questionId,
        String(userAnswer),
        isCorrect,
      );

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
}
