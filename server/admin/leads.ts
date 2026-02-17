/**
 * Admin Leads Routes — CRUD e KPIs de leads
 *
 * Rotas: /api/admin/leads, /api/admin/leads/:id, /api/admin/leads/kpis
 */

import type { Express } from "express";
import { db } from "../../db";
import { leads } from "../../db/schema";
import { eq, and, count, desc, asc, like, or, sql } from "drizzle-orm";
import { requireAuth } from "../middleware-supabase";

export function registerLeadsRoutes(app: Express) {
  // GET /api/admin/leads - List leads with filters and pagination
  app.get("/api/admin/leads", requireAuth, async (req, res) => {
    try {
      const {
        page = "1",
        limit = "10",
        status,
        examType,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      // Build where conditions
      const conditions = [];

      if (status && status !== "ALL") {
        conditions.push(sql`${leads.status} = ${status}`);
      }

      if (examType && examType !== "ALL") {
        conditions.push(sql`${leads.examType} = ${examType}`);
      }

      if (search && typeof search === "string" && search.trim()) {
        conditions.push(
          or(
            like(leads.name, `%${search}%`),
            like(leads.email, `%${search}%`),
            like(leads.phone, `%${search}%`),
          ),
        );
      }

      // Get total count
      const totalResult = await db
        .select({ count: count() })
        .from(leads)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      const total = Number(totalResult[0]?.count || 0);

      // Get leads
      const orderColumn = sortBy === "createdAt" ? leads.createdAt : leads.name;
      const orderDirection = sortOrder === "asc" ? asc : desc;

      const leadsData = await db
        .select()
        .from(leads)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(orderDirection(orderColumn))
        .limit(limitNum)
        .offset(offset);

      return res.json({
        success: true,
        leads: leadsData,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar leads.",
      });
    }
  });

  // PATCH /api/admin/leads/:id - Update lead status
  app.patch("/api/admin/leads/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (
        !status ||
        !["NOVO", "CONTATADO", "QUALIFICADO", "CONVERTIDO"].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          error: "Status inválido.",
        });
      }

      const [updatedLead] = await db
        .update(leads)
        .set({ status, updatedAt: new Date() })
        .where(eq(leads.id, id))
        .returning();

      if (!updatedLead) {
        return res.status(404).json({
          success: false,
          error: "Lead não encontrado.",
        });
      }

      return res.json({
        success: true,
        lead: updatedLead,
      });
    } catch (error) {
      console.error("Error updating lead:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao atualizar lead.",
      });
    }
  });

  // GET /api/admin/leads/kpis - KPIs detalhados para aba Leads
  app.get("/api/admin/leads/kpis", requireAuth, async (req, res) => {
    try {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Status distribution
      const statusDist = await db.execute(sql`
        SELECT status, COUNT(*) as count
        FROM leads
        GROUP BY status
      `) as any[];

      const statusMap: Record<string, number> = {};
      let totalLeads = 0;
      for (const row of statusDist) {
        statusMap[row.status] = Number(row.count);
        totalLeads += Number(row.count);
      }

      // Source distribution
      const sourceDist = await db.execute(sql`
        SELECT COALESCE(source, 'landing_page') as source, COUNT(*) as count
        FROM leads
        GROUP BY source
      `) as any[];

      const sourceMap: Record<string, number> = {};
      for (const row of sourceDist) {
        sourceMap[row.source] = Number(row.count);
      }

      // ExamType distribution
      const examDist = await db.execute(sql`
        SELECT COALESCE(exam_type, 'OUTRO') as exam_type, COUNT(*) as count
        FROM leads
        GROUP BY exam_type
        ORDER BY count DESC
      `) as any[];

      const examMap: Record<string, number> = {};
      for (const row of examDist) {
        examMap[row.exam_type] = Number(row.count);
      }

      // This week leads
      const weekResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM leads WHERE created_at >= ${weekAgo}
      `) as any[];
      const weekLeads = Number(weekResult[0]?.count || 0);

      // This month leads
      const monthResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM leads WHERE created_at >= ${monthAgo}
      `) as any[];
      const monthLeads = Number(monthResult[0]?.count || 0);

      // Drip campaign progress
      const dripStats = await db.execute(sql`
        SELECT
          COUNT(CASE WHEN "dripEmail1SentAt" IS NOT NULL THEN 1 END) as email1,
          COUNT(CASE WHEN "dripEmail2SentAt" IS NOT NULL THEN 1 END) as email2,
          COUNT(CASE WHEN "dripEmail3SentAt" IS NOT NULL THEN 1 END) as email3,
          COUNT(CASE WHEN "dripEmail4SentAt" IS NOT NULL THEN 1 END) as email4,
          COUNT(*) as total
        FROM leads
      `) as any[];

      const drip = dripStats[0];

      // Stalled leads (NOVO > 7 days)
      const stalledResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM leads
        WHERE status = 'NOVO' AND created_at <= ${weekAgo}
      `) as any[];

      // Conversion rate
      const convertidos = statusMap["CONVERTIDO"] || 0;
      const conversionRate = totalLeads > 0 ? ((convertidos / totalLeads) * 100).toFixed(1) : "0.0";

      return res.json({
        success: true,
        kpis: {
          total: totalLeads,
          week: weekLeads,
          month: monthLeads,
          conversionRate: `${conversionRate}%`,
          convertidos,
          stalled: Number(stalledResult[0]?.count || 0),
          status: statusMap,
          source: sourceMap,
          examType: examMap,
          drip: {
            email1: Number(drip.email1),
            email2: Number(drip.email2),
            email3: Number(drip.email3),
            email4: Number(drip.email4),
            total: Number(drip.total),
          },
        },
      });
    } catch (error) {
      console.error("Error fetching leads KPIs:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar KPIs de leads." });
    }
  });
}
