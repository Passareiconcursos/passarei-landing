import type { Express } from "express";
import { db } from "../db";
import { sql } from "drizzle-orm";

// ============================================
// CONFIGURAÇÕES DE SIMULADO
// ============================================
const SIMULADO_CONFIG = {
  QUESTIONS_PER_SIMULADO: 50,
  DURATION_MINUTES: 120, // 2 horas
  PASSING_SCORE: 60, // 60% para aprovação
};

// ============================================
// VERIFICAR ACESSO VETERANO
// ============================================
async function checkVeteranoAccess(
  telegramId: string,
): Promise<{ hasAccess: boolean; userId?: string; message?: string }> {
  try {
    const result = await db.execute(sql`
      SELECT "id", "plan" FROM "User"
      WHERE "telegramId" = ${telegramId}
    `);

    if (result.length === 0) {
      return { hasAccess: false, message: "Usuário não encontrado" };
    }

    const user = result[0] as any;

    if (user.plan !== "VETERANO") {
      return {
        hasAccess: false,
        message:
          "Simulados mensais são exclusivos do plano VETERANO. Faça upgrade para acessar!",
      };
    }

    return { hasAccess: true, userId: user.id };
  } catch (error) {
    console.error("[Simulado] Erro ao verificar acesso:", error);
    return { hasAccess: false, message: "Erro interno" };
  }
}

// ============================================
// GERAR SIMULADO DO MÊS (SE NÃO EXISTIR)
// ============================================
async function ensureMonthlySimulado(examType: string): Promise<string | null> {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  try {
    // Verificar se já existe simulado para este mês
    const existing = await db.execute(sql`
      SELECT "id" FROM "simulados"
      WHERE "month" = ${currentMonth}
        AND "exam_type" = ${examType}
        AND "is_active" = true
      LIMIT 1
    `);

    if (existing.length > 0) {
      return (existing[0] as any).id;
    }

    // Criar novo simulado do mês
    const now = new Date();
    const monthName = monthNames[now.getMonth()];
    const year = now.getFullYear();

    // Primeiro dia do mês
    const availableFrom = new Date(now.getFullYear(), now.getMonth(), 1);
    // Último dia do mês
    const availableUntil = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const simuladoResult = await db.execute(sql`
      INSERT INTO "simulados" (
        "title",
        "description",
        "exam_type",
        "total_questions",
        "duration_minutes",
        "passing_score",
        "month",
        "available_from",
        "available_until",
        "is_active"
      ) VALUES (
        ${`Simulado ${monthName} ${year}`},
        ${`Simulado mensal completo para ${examType}. ${SIMULADO_CONFIG.QUESTIONS_PER_SIMULADO} questões em ${SIMULADO_CONFIG.DURATION_MINUTES} minutos.`},
        ${examType},
        ${SIMULADO_CONFIG.QUESTIONS_PER_SIMULADO},
        ${SIMULADO_CONFIG.DURATION_MINUTES},
        ${SIMULADO_CONFIG.PASSING_SCORE},
        ${currentMonth},
        ${availableFrom},
        ${availableUntil},
        true
      )
      RETURNING "id"
    `);

    const simuladoId = (simuladoResult[0] as any).id;

    // Buscar questões aleatórias para o simulado
    const questions = await db.execute(sql`
      SELECT "id" FROM "Content"
      WHERE "isActive" = true
        AND "examType" = ${examType}
      ORDER BY RANDOM()
      LIMIT ${SIMULADO_CONFIG.QUESTIONS_PER_SIMULADO}
    `);

    // Se não tiver questões suficientes, buscar qualquer uma
    let allQuestions = questions;
    if (questions.length < SIMULADO_CONFIG.QUESTIONS_PER_SIMULADO) {
      const moreQuestions = await db.execute(sql`
        SELECT "id" FROM "Content"
        WHERE "isActive" = true
        ORDER BY RANDOM()
        LIMIT ${SIMULADO_CONFIG.QUESTIONS_PER_SIMULADO}
      `);
      allQuestions = moreQuestions;
    }

    // Adicionar questões ao simulado
    for (let i = 0; i < allQuestions.length; i++) {
      const q = allQuestions[i] as any;
      await db.execute(sql`
        INSERT INTO "simulado_questions" (
          "simulado_id",
          "content_id",
          "question_order"
        ) VALUES (
          ${simuladoId},
          ${q.id},
          ${i + 1}
        )
      `);
    }

    console.log(
      `[Simulado] Criado simulado ${monthName} ${year} com ${allQuestions.length} questões`,
    );

    return simuladoId;
  } catch (error) {
    console.error("[Simulado] Erro ao criar simulado mensal:", error);
    return null;
  }
}

// ============================================
// ROTAS DE SIMULADOS
// ============================================
export function registerSimuladoRoutes(app: Express) {
  // ============================================
  // LISTAR SIMULADOS DISPONÍVEIS
  // ============================================
  app.get("/api/simulados/available/:telegramId", async (req, res) => {
    try {
      const { telegramId } = req.params;
      const access = await checkVeteranoAccess(telegramId);

      if (!access.hasAccess) {
        return res.status(403).json({
          success: false,
          error: access.message,
          requiresUpgrade: true,
        });
      }

      // Buscar examType do usuário
      const userResult = await db.execute(sql`
        SELECT "examType" FROM "User" WHERE "telegramId" = ${telegramId}
      `);
      const examType = (userResult[0] as any)?.examType || "PF";

      // Garantir que existe simulado do mês
      await ensureMonthlySimulado(examType);

      // Buscar simulados disponíveis
      const simulados = await db.execute(sql`
        SELECT
          s."id",
          s."title",
          s."description",
          s."total_questions",
          s."duration_minutes",
          s."passing_score",
          s."month",
          s."available_until",
          us."status" as user_status,
          us."score" as user_score,
          us."passed" as user_passed
        FROM "simulados" s
        LEFT JOIN "user_simulados" us
          ON s."id" = us."simulado_id"
          AND us."user_id" = ${access.userId}
        WHERE s."is_active" = true
          AND s."exam_type" = ${examType}
          AND s."available_until" >= NOW()
        ORDER BY s."available_from" DESC
        LIMIT 5
      `);

      res.json({
        success: true,
        simulados: simulados.map((s: any) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          totalQuestions: s.total_questions,
          durationMinutes: s.duration_minutes,
          passingScore: s.passing_score,
          month: s.month,
          availableUntil: s.available_until,
          userStatus: s.user_status || "NOT_STARTED",
          userScore: s.user_score,
          userPassed: s.user_passed,
        })),
      });
    } catch (error) {
      console.error("[Simulado] Erro ao listar:", error);
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // ============================================
  // INICIAR SIMULADO
  // ============================================
  app.post("/api/simulados/start", async (req, res) => {
    try {
      const { telegramId, simuladoId } = req.body;

      if (!telegramId || !simuladoId) {
        return res.status(400).json({ error: "telegramId e simuladoId são obrigatórios" });
      }

      const access = await checkVeteranoAccess(telegramId);
      if (!access.hasAccess) {
        return res.status(403).json({ success: false, error: access.message });
      }

      // Verificar se já tem tentativa em andamento
      const existing = await db.execute(sql`
        SELECT "id", "status", "current_question"
        FROM "user_simulados"
        WHERE "user_id" = ${access.userId}
          AND "simulado_id" = ${simuladoId}
        LIMIT 1
      `);

      if (existing.length > 0) {
        const attempt = existing[0] as any;
        if (attempt.status === "IN_PROGRESS") {
          return res.json({
            success: true,
            userSimuladoId: attempt.id,
            currentQuestion: attempt.current_question,
            resumed: true,
          });
        } else if (attempt.status === "COMPLETED") {
          return res.status(400).json({
            success: false,
            error: "Você já completou este simulado",
            completed: true,
          });
        }
      }

      // Criar nova tentativa
      const attemptResult = await db.execute(sql`
        INSERT INTO "user_simulados" (
          "user_id",
          "simulado_id",
          "status",
          "current_question",
          "started_at"
        ) VALUES (
          ${access.userId},
          ${simuladoId},
          'IN_PROGRESS',
          0,
          NOW()
        )
        RETURNING "id"
      `);

      const userSimuladoId = (attemptResult[0] as any).id;

      console.log(`[Simulado] Usuário ${telegramId} iniciou simulado ${simuladoId}`);

      res.json({
        success: true,
        userSimuladoId: userSimuladoId,
        currentQuestion: 0,
        resumed: false,
      });
    } catch (error) {
      console.error("[Simulado] Erro ao iniciar:", error);
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // ============================================
  // BUSCAR QUESTÃO ATUAL
  // ============================================
  app.get("/api/simulados/question/:userSimuladoId", async (req, res) => {
    try {
      const { userSimuladoId } = req.params;

      // Buscar tentativa do usuário
      const attemptResult = await db.execute(sql`
        SELECT
          us."current_question",
          us."status",
          us."started_at",
          s."total_questions",
          s."duration_minutes"
        FROM "user_simulados" us
        JOIN "simulados" s ON us."simulado_id" = s."id"
        WHERE us."id" = ${userSimuladoId}
      `);

      if (attemptResult.length === 0) {
        return res.status(404).json({ error: "Tentativa não encontrada" });
      }

      const attempt = attemptResult[0] as any;

      if (attempt.status !== "IN_PROGRESS") {
        return res.json({
          success: false,
          finished: true,
          message: "Este simulado já foi finalizado",
        });
      }

      // Verificar tempo
      const startTime = new Date(attempt.started_at).getTime();
      const elapsed = (Date.now() - startTime) / (1000 * 60); // minutos
      const remaining = Math.max(0, attempt.duration_minutes - elapsed);

      if (remaining <= 0) {
        // Tempo esgotado - finalizar
        await db.execute(sql`
          UPDATE "user_simulados"
          SET "status" = 'EXPIRED', "finished_at" = NOW()
          WHERE "id" = ${userSimuladoId}
        `);

        return res.json({
          success: false,
          expired: true,
          message: "Tempo esgotado!",
        });
      }

      // Buscar próxima questão
      const questionNumber = attempt.current_question + 1;

      if (questionNumber > attempt.total_questions) {
        return res.json({
          success: false,
          finished: true,
          message: "Todas as questões foram respondidas",
        });
      }

      const questionResult = await db.execute(sql`
        SELECT
          sq."id" as question_id,
          c."id" as content_id,
          c."title",
          c."textContent",
          c."options",
          c."subject"
        FROM "simulado_questions" sq
        JOIN "Content" c ON sq."content_id" = c."id"
        JOIN "user_simulados" us ON us."simulado_id" = sq."simulado_id"
        WHERE us."id" = ${userSimuladoId}
          AND sq."question_order" = ${questionNumber}
        LIMIT 1
      `);

      if (questionResult.length === 0) {
        return res.status(404).json({ error: "Questão não encontrada" });
      }

      const question = questionResult[0] as any;
      let options = [];
      try {
        options =
          typeof question.options === "string"
            ? JSON.parse(question.options)
            : question.options || [];
      } catch {
        options = ["A) Opção A", "B) Opção B", "C) Opção C", "D) Opção D"];
      }

      res.json({
        success: true,
        question: {
          id: question.question_id,
          contentId: question.content_id,
          number: questionNumber,
          totalQuestions: attempt.total_questions,
          title: question.title,
          text: question.textContent,
          options: options,
          subject: question.subject,
        },
        timeRemaining: Math.round(remaining),
      });
    } catch (error) {
      console.error("[Simulado] Erro ao buscar questão:", error);
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // ============================================
  // RESPONDER QUESTÃO
  // ============================================
  app.post("/api/simulados/answer", async (req, res) => {
    try {
      const { userSimuladoId, questionId, answer } = req.body;

      if (!userSimuladoId || !questionId || answer === undefined) {
        return res.status(400).json({ error: "Dados incompletos" });
      }

      // Buscar questão e resposta correta
      const questionResult = await db.execute(sql`
        SELECT
          sq."id",
          c."correctOption"
        FROM "simulado_questions" sq
        JOIN "Content" c ON sq."content_id" = c."id"
        WHERE sq."id" = ${questionId}
      `);

      if (questionResult.length === 0) {
        return res.status(404).json({ error: "Questão não encontrada" });
      }

      const question = questionResult[0] as any;
      const isCorrect = Number(answer) === Number(question.correctOption);

      // Registrar resposta
      await db.execute(sql`
        INSERT INTO "simulado_answers" (
          "user_simulado_id",
          "question_id",
          "selected_answer",
          "correct"
        ) VALUES (
          ${userSimuladoId},
          ${questionId},
          ${answer},
          ${isCorrect}
        )
      `);

      // Atualizar progresso
      await db.execute(sql`
        UPDATE "user_simulados"
        SET
          "current_question" = "current_question" + 1,
          "correct_answers" = "correct_answers" + ${isCorrect ? 1 : 0},
          "wrong_answers" = "wrong_answers" + ${isCorrect ? 0 : 1},
          "updated_at" = NOW()
        WHERE "id" = ${userSimuladoId}
      `);

      // Verificar se é a última questão
      const attemptResult = await db.execute(sql`
        SELECT
          us."current_question",
          us."correct_answers",
          us."wrong_answers",
          us."started_at",
          s."total_questions",
          s."passing_score"
        FROM "user_simulados" us
        JOIN "simulados" s ON us."simulado_id" = s."id"
        WHERE us."id" = ${userSimuladoId}
      `);

      const attempt = attemptResult[0] as any;
      const isLastQuestion = attempt.current_question >= attempt.total_questions;

      if (isLastQuestion) {
        // Calcular resultado final
        const total = attempt.correct_answers + attempt.wrong_answers;
        const score = Math.round((attempt.correct_answers / total) * 100);
        const passed = score >= attempt.passing_score;
        const timeSpent = Math.round(
          (Date.now() - new Date(attempt.started_at).getTime()) / (1000 * 60),
        );

        await db.execute(sql`
          UPDATE "user_simulados"
          SET
            "status" = 'COMPLETED',
            "score" = ${score},
            "passed" = ${passed},
            "time_spent_minutes" = ${timeSpent},
            "finished_at" = NOW()
          WHERE "id" = ${userSimuladoId}
        `);

        return res.json({
          success: true,
          correct: isCorrect,
          finished: true,
          result: {
            score: score,
            passed: passed,
            correctAnswers: attempt.correct_answers,
            wrongAnswers: attempt.wrong_answers,
            totalQuestions: total,
            timeSpent: timeSpent,
          },
        });
      }

      res.json({
        success: true,
        correct: isCorrect,
        finished: false,
        currentQuestion: attempt.current_question,
        correctAnswers: attempt.correct_answers,
        wrongAnswers: attempt.wrong_answers,
      });
    } catch (error) {
      console.error("[Simulado] Erro ao responder:", error);
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // ============================================
  // OBTER RESULTADO
  // ============================================
  app.get("/api/simulados/result/:userSimuladoId", async (req, res) => {
    try {
      const { userSimuladoId } = req.params;

      const result = await db.execute(sql`
        SELECT
          us."status",
          us."score",
          us."passed",
          us."correct_answers",
          us."wrong_answers",
          us."time_spent_minutes",
          us."started_at",
          us."finished_at",
          s."title",
          s."total_questions",
          s."passing_score"
        FROM "user_simulados" us
        JOIN "simulados" s ON us."simulado_id" = s."id"
        WHERE us."id" = ${userSimuladoId}
      `);

      if (result.length === 0) {
        return res.status(404).json({ error: "Resultado não encontrado" });
      }

      const data = result[0] as any;

      res.json({
        success: true,
        result: {
          simuladoTitle: data.title,
          status: data.status,
          score: data.score,
          passed: data.passed,
          passingScore: data.passing_score,
          correctAnswers: data.correct_answers,
          wrongAnswers: data.wrong_answers,
          totalQuestions: data.total_questions,
          timeSpent: data.time_spent_minutes,
          startedAt: data.started_at,
          finishedAt: data.finished_at,
        },
      });
    } catch (error) {
      console.error("[Simulado] Erro ao buscar resultado:", error);
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // ============================================
  // HISTÓRICO DE SIMULADOS DO USUÁRIO
  // ============================================
  app.get("/api/simulados/history/:telegramId", async (req, res) => {
    try {
      const { telegramId } = req.params;
      const access = await checkVeteranoAccess(telegramId);

      if (!access.hasAccess) {
        return res.status(403).json({ success: false, error: access.message });
      }

      const history = await db.execute(sql`
        SELECT
          us."id" as user_simulado_id,
          us."status",
          us."score",
          us."passed",
          us."correct_answers",
          us."wrong_answers",
          us."time_spent_minutes",
          us."finished_at",
          s."title",
          s."month",
          s."total_questions"
        FROM "user_simulados" us
        JOIN "simulados" s ON us."simulado_id" = s."id"
        WHERE us."user_id" = ${access.userId}
        ORDER BY us."started_at" DESC
        LIMIT 12
      `);

      res.json({
        success: true,
        history: history.map((h: any) => ({
          id: h.user_simulado_id,
          title: h.title,
          month: h.month,
          status: h.status,
          score: h.score,
          passed: h.passed,
          correctAnswers: h.correct_answers,
          wrongAnswers: h.wrong_answers,
          totalQuestions: h.total_questions,
          timeSpent: h.time_spent_minutes,
          finishedAt: h.finished_at,
        })),
      });
    } catch (error) {
      console.error("[Simulado] Erro ao buscar histórico:", error);
      res.status(500).json({ error: "Erro interno" });
    }
  });

  console.log("[Simulado] Rotas de simulados registradas");
}
