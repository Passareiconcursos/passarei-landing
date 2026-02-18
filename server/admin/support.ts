/**
 * Admin Support Routes — Painel de Suporte IA
 *
 * Rotas: POST /api/admin/support/ask, GET /api/admin/support/overview
 */

import type { Express } from "express";
import { db } from "../../db";
import { sql } from "drizzle-orm";
import { requireAuth } from "../middleware-supabase";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export function registerSupportRoutes(app: Express) {
  // GET /api/admin/support/overview - Resumo da plataforma para contexto IA
  app.get("/api/admin/support/overview", requireAuth, async (req, res) => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

      // Total students + active today
      const studentStats = await db.execute(sql`
        SELECT
          COUNT(*) as total_students,
          COUNT(CASE WHEN "lastContentDate" = ${today} OR "lastContentDate" = ${yesterday} THEN 1 END) as active_today,
          COUNT(CASE WHEN plan = 'VETERANO' THEN 1 END) as veteranos,
          COUNT(CASE WHEN plan = 'CALOURO' THEN 1 END) as calouro,
          COUNT(CASE WHEN plan = 'FREE' THEN 1 END) as free_users,
          SUM("totalQuestionsAnswered") as total_questions
        FROM "User"
        WHERE "passwordHash" IS NOT NULL
      `) as any[];

      // Subjects with most errors (low accuracy)
      const subjectErrors = await db.execute(sql`
        SELECT
          s.name as subject,
          COUNT(qa.id) as total,
          COUNT(CASE WHEN qa."isCorrect" = false THEN 1 END) as errors,
          ROUND(COUNT(CASE WHEN qa."isCorrect" = false THEN 1 END) * 100.0 / NULLIF(COUNT(qa.id), 0), 0) as error_rate
        FROM "QuestionAttempt" qa
        JOIN "Question" q ON qa."questionId" = q.id
        JOIN "Content" c ON q."contentId" = c.id
        JOIN "Subject" s ON c."subjectId" = s.id
        GROUP BY s.name
        ORDER BY error_rate DESC
        LIMIT 5
      `) as any[];

      // Students with streak > 3
      const streakLeaders = await db.execute(sql`
        SELECT name, streak_days, "totalQuestionsAnswered"
        FROM "User"
        WHERE streak_days > 3 AND "passwordHash" IS NOT NULL
        ORDER BY streak_days DESC
        LIMIT 5
      `) as any[];

      // Recent essays
      const recentEssays = await db.execute(sql`
        SELECT COUNT(*) as total, AVG(total_score) as avg_score
        FROM essays
        WHERE submitted_at >= NOW() - INTERVAL '7 days'
      `) as any[];

      const s = studentStats[0] || {};
      return res.json({
        success: true,
        overview: {
          totalStudents: Number(s.total_students) || 0,
          activeToday: Number(s.active_today) || 0,
          veteranos: Number(s.veteranos) || 0,
          calouro: Number(s.calouro) || 0,
          freeUsers: Number(s.free_users) || 0,
          totalQuestionsAnswered: Number(s.total_questions) || 0,
          subjectErrors: subjectErrors.map((e: any) => ({
            subject: e.subject,
            total: Number(e.total),
            errors: Number(e.errors),
            errorRate: Number(e.error_rate),
          })),
          streakLeaders: streakLeaders.map((u: any) => ({
            name: u.name?.split(" ")[0] || "Aluno",
            streakDays: Number(u.streak_days),
            totalQuestions: Number(u.totalQuestionsAnswered),
          })),
          recentEssays: {
            count: Number(recentEssays[0]?.total) || 0,
            avgScore: Math.round(Number(recentEssays[0]?.avg_score) || 0),
          },
        },
      });
    } catch (error) {
      console.error("❌ [Admin Support] Erro ao buscar overview:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar dados." });
    }
  });

  // POST /api/admin/support/ask - Admin faz pergunta ao assistente IA
  app.post("/api/admin/support/ask", requireAuth, async (req, res) => {
    try {
      const { question, context } = req.body;

      if (!question?.trim()) {
        return res.status(400).json({ success: false, error: "Pergunta é obrigatória." });
      }

      // Fetch fresh DB context for richer answers
      const today = new Date().toISOString().slice(0, 10);
      const studentStats = await db.execute(sql`
        SELECT
          COUNT(*) as total_students,
          COUNT(CASE WHEN "lastContentDate" = ${today} THEN 1 END) as active_today,
          COUNT(CASE WHEN plan = 'VETERANO' THEN 1 END) as veteranos,
          COUNT(CASE WHEN plan = 'CALOURO' THEN 1 END) as calouro,
          COUNT(CASE WHEN plan = 'FREE' THEN 1 END) as free_users,
          SUM("totalQuestionsAnswered") as total_questions,
          AVG(streak_days) as avg_streak
        FROM "User"
        WHERE "passwordHash" IS NOT NULL
      `) as any[];

      const subjectStats = await db.execute(sql`
        SELECT
          s.name as subject,
          COUNT(qa.id) as total,
          ROUND(AVG(CASE WHEN qa."isCorrect" THEN 1.0 ELSE 0.0 END) * 100, 0) as accuracy
        FROM "QuestionAttempt" qa
        JOIN "Question" q ON qa."questionId" = q.id
        JOIN "Content" c ON q."contentId" = c.id
        JOIN "Subject" s ON c."subjectId" = s.id
        GROUP BY s.name
        ORDER BY total DESC
        LIMIT 10
      `) as any[];

      const contentStats = await db.execute(sql`
        SELECT COUNT(*) as total FROM "Content" WHERE status = 'PUBLISHED'
      `) as any[];

      const s = studentStats[0] || {};
      const dbContext = `
DADOS DA PLATAFORMA PASSAREI (${today}):
- Total de alunos web: ${s.total_students || 0}
- Ativos hoje: ${s.active_today || 0}
- Plano VETERANO: ${s.veteranos || 0} | CALOURO: ${s.calouro || 0} | FREE: ${s.free_users || 0}
- Total de questões respondidas: ${s.total_questions || 0}
- Streak médio: ${Math.round(Number(s.avg_streak) || 0)} dias
- Conteúdos publicados: ${contentStats[0]?.total || 0}

DESEMPENHO POR MATÉRIA:
${subjectStats.map((m: any) => `- ${m.subject}: ${m.total} questões, ${m.accuracy}% acertos`).join("\n") || "Sem dados ainda"}

${context ? `CONTEXTO ADICIONAL DO ADMIN:\n${context}` : ""}
      `.trim();

      const systemPrompt = `Você é o assistente IA da plataforma Passarei, um preparatório para concursos policiais brasileiros (PF, PRF, PCDF, etc.).
Você auxilia o administrador da plataforma com insights sobre alunos, desempenho, conteúdo e estratégias pedagógicas.
Seja direto, prático e use os dados reais da plataforma para responder.
Quando relevante, sugira ações concretas que o admin pode tomar.
Responda em português brasileiro.`;

      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `${dbContext}\n\nPERGUNTA DO ADMIN: ${question}`,
          },
        ],
      });

      const answer = response.content[0].type === "text" ? response.content[0].text : "";

      return res.json({ success: true, answer, context: dbContext });
    } catch (error) {
      console.error("❌ [Admin Support] Erro na IA:", error);
      return res.status(500).json({ success: false, error: "Erro ao consultar IA." });
    }
  });
}
