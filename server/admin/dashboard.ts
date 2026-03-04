/**
 * Admin Dashboard Routes — Estatísticas e métricas
 *
 * Rotas: /api/admin/stats, /api/admin/dashboard-stats
 */

import type { Express } from "express";
import { db } from "../../db";
import { leads, users, subscriptions } from "../../db/schema";
import { eq, count, sql } from "drizzle-orm";
import { requireAuth } from "../middleware-supabase";

export function registerDashboardRoutes(app: Express) {
  // GET /api/admin/stats - Get dashboard statistics
  app.get("/api/admin/stats", requireAuth, async (req, res) => {
    try {
      // Get leads statistics
      const totalLeads = await db.select({ count: count() }).from(leads);
      const convertedLeads = await db
        .select({ count: count() })
        .from(leads)
        .where(eq(leads.status, "CONVERTIDO"));

      // Get users statistics
      const totalUsers = await db.select({ count: count() }).from(users);
      const activeUsers = await db
        .select({ count: count() })
        .from(users)
        .where(eq(users.isActive, true));

      // Get subscription statistics
      const activeSubscriptions = await db
        .select({ count: count() })
        .from(subscriptions)
        .where(eq(subscriptions.status, "ACTIVE"));

      // Calculate MRR from active subscriptions
      const activeSubscriptionsData = await db
        .select({ amount: subscriptions.amount })
        .from(subscriptions)
        .where(eq(subscriptions.status, "ACTIVE"));

      const mrr = activeSubscriptionsData.reduce(
        (total, sub) => total + (sub.amount || 0),
        0,
      );

      // Calculate conversion rate
      const leadsCount = Number(totalLeads[0]?.count || 0);
      const conversionCount = Number(convertedLeads[0]?.count || 0);
      const conversionRate =
        leadsCount > 0
          ? ((conversionCount / leadsCount) * 100).toFixed(1)
          : "0.0";

      return res.json({
        success: true,
        stats: {
          totalLeads: leadsCount,
          totalUsers: Number(totalUsers[0]?.count || 0),
          activeUsers: Number(activeUsers[0]?.count || 0),
          activeSubscriptions: Number(activeSubscriptions[0]?.count || 0),
          conversionRate: `${conversionRate}%`,
          mrr: mrr,
        },
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar estatísticas.",
      });
    }
  });

  // GET /api/admin/dashboard-stats - Estatísticas detalhadas do dashboard
  app.get("/api/admin/dashboard-stats", requireAuth, async (req, res) => {
    try {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Leads total e semana
      const totalLeadsResult = await db.select({ count: count() }).from(leads);
      const weekLeadsResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM leads
        WHERE created_at >= ${weekAgo}
      `);

      // Alunos (users com telegramId)
      const totalUsersResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM "User" WHERE "telegramId" IS NOT NULL
      `);
      const activeUsersResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM "User"
        WHERE "telegramId" IS NOT NULL
        AND plan != 'FREE'
        AND last_active_at >= ${weekAgo}
      `);
      const weekUsersResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM "User"
        WHERE "telegramId" IS NOT NULL
        AND "createdAt" >= ${weekAgo}
      `);

      // Planos
      const freeUsersResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM "User" WHERE plan = 'FREE'
      `);
      const calourosResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM "User" WHERE plan = 'CALOURO'
      `);
      const veteranosResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM "User" WHERE plan = 'VETERANO'
      `);

      // MRR (CALOURO = R$89,90/mês, VETERANO = R$44,90/mês)
      const calouros = Number((calourosResult as any[])[0]?.count || 0);
      const veteranos = Number((veteranosResult as any[])[0]?.count || 0);
      const mrr = (calouros * 89.90) + (veteranos * 44.90);

      // Conversão do mês (leads → pagos)
      const monthLeadsResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM leads WHERE created_at >= ${monthStart}
      `);
      const monthPaidResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM "User"
        WHERE plan != 'FREE' AND "createdAt" >= ${monthStart}
      `);

      const monthLeads = Number((monthLeadsResult as any[])[0]?.count || 0);
      const monthPaid = Number((monthPaidResult as any[])[0]?.count || 0);
      const conversionRate = monthLeads > 0 ? ((monthPaid / monthLeads) * 100).toFixed(1) : "0.0";

      // Alertas
      const stalledLeadsResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM leads
        WHERE status = 'NOVO'
        AND created_at <= ${weekAgo}
      `);
      const inactiveUsersResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM "User"
        WHERE plan != 'FREE'
        AND (last_active_at IS NULL OR last_active_at <= ${weekAgo})
      `);

      // Engajamento global: total de questões respondidas por todos os usuários
      const engagementResult = await db.execute(sql`
        SELECT COALESCE(SUM("totalQuestionsAnswered"), 0) as total FROM "User"
      `) as any[];
      const totalQuestionsGlobal = Number((engagementResult as any[])[0]?.total || 0);

      // Redações: por status (tabela essays pode não existir em ambientes novos)
      let essaysCorrected = 0;
      let essaysCorrecting = 0;
      let essaysTotal = 0;
      try {
        const essaysResult = await db.execute(sql`
          SELECT status, COUNT(*) as count FROM essays GROUP BY status
        `) as any[];
        const essaysByStatus: Record<string, number> = {};
        for (const row of essaysResult as any[]) {
          essaysByStatus[row.status] = Number(row.count || 0);
        }
        essaysCorrected  = essaysByStatus["CORRECTED"]  || 0;
        essaysCorrecting = essaysByStatus["CORRECTING"] || 0;
        essaysTotal = Object.values(essaysByStatus).reduce((a, b) => a + b, 0);
      } catch { /* tabela essays não existe ainda */ }

      return res.json({
        success: true,
        stats: {
          leads: {
            total: Number(totalLeadsResult[0]?.count || 0),
            week: Number((weekLeadsResult as any[])[0]?.count || 0),
          },
          users: {
            total: Number((totalUsersResult as any[])[0]?.count || 0),
            active: Number((activeUsersResult as any[])[0]?.count || 0),
            week: Number((weekUsersResult as any[])[0]?.count || 0),
            free: Number((freeUsersResult as any[])[0]?.count || 0),
            calouro: calouros,
            veterano: veteranos,
          },
          mrr: mrr,
          conversion: `${conversionRate}%`,
          funnel: {
            monthLeads: monthLeads,
            monthFree: Number((freeUsersResult as any[])[0]?.count || 0),
            monthPaid: monthPaid,
          },
          alerts: {
            stalledLeads: Number((stalledLeadsResult as any[])[0]?.count || 0),
            inactiveUsers: Number((inactiveUsersResult as any[])[0]?.count || 0),
          },
          engagement: { totalQuestions: totalQuestionsGlobal },
          essays: { total: essaysTotal, corrected: essaysCorrected, correcting: essaysCorrecting },
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar estatísticas do dashboard.",
      });
    }
  });

  // GET /api/admin/db-status - Monitoramento do banco de dados
  app.get("/api/admin/db-status", requireAuth, async (req, res) => {
    try {
      const counts = await db.execute(sql`
        SELECT
          (SELECT COUNT(*) FROM "User")     as users,
          (SELECT COUNT(*) FROM "Question") as questions,
          (SELECT COUNT(*) FROM leads)      as leads,
          (SELECT COALESCE((SELECT COUNT(*) FROM essays), 0))    as essays,
          (SELECT COALESCE((SELECT COUNT(*) FROM simulados), 0)) as simulados
      `) as any[];
      const row = (counts as any[])[0] || {};
      const dbUrl = process.env.DATABASE_URL || "";
      const dbMasked = dbUrl
        ? (dbUrl.split("@")[1]?.split("/")[0] || "conectado")
        : "não configurado";

      return res.json({
        success: true,
        status: dbUrl ? "ok" : "error",
        host: dbMasked,
        tables: {
          users:     Number(row.users     || 0),
          questions: Number(row.questions || 0),
          leads:     Number(row.leads     || 0),
          essays:    Number(row.essays    || 0),
          simulados: Number(row.simulados || 0),
        },
      });
    } catch (error) {
      console.error("Error fetching DB status:", error);
      return res.status(500).json({ success: false, error: "Erro ao consultar banco." });
    }
  });
}
