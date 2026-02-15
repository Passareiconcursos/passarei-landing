import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "../db";
import {
  leads,
  admins,
  adminSessions,
  users,
  subscriptions,
  content,
  categories,
  subcategories,
  subjects,
  materials,
  questions,
} from "../db/schema";
import {
  insertLeadSchema,
  insertContentSchema,
  insertMaterialSchema,
  insertQuestionSchema,
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { eq, and, count, desc, asc, like, or, ne, sql } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  createAdminSession,
  verifyAdminSession,
  logAuditAction,
  requireRole,
} from "./auth";
import { verifyAdminSession as verifySupabaseSession } from "../lib/db/auth";
import { requireAuth } from "./middleware-supabase";

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to parse cookies
  function parseCookies(
    cookieHeader: string | undefined,
  ): Record<string, string> {
    if (!cookieHeader) return {};
    return cookieHeader.split(";").reduce(
      (cookies, cookie) => {
        const [name, value] = cookie.trim().split("=");
        cookies[name] = value;
        return cookies;
      },
      {} as Record<string, string>,
    );
  }

  // Add cookie parsing middleware for admin routes
  app.use("/api/admin", (req, res, next) => {
    req.cookies = parseCookies(req.headers.cookie);
    next();
  });

  // Helper function to verify reCAPTCHA token
  async function verifyRecaptcha(token: string): Promise<boolean> {
    if (!token) return false;

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY not configured");
      return false;
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;

    try {
      const response = await fetch(verifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secretKey}&response=${token}`,
      });

      const data = await response.json();
      return data.success && data.score >= 0.5; // Minimum score of 0.5
    } catch (error) {
      console.error("reCAPTCHA verification error:", error);
      return false;
    }
  }

  // POST /api/admin/logout - Admin logout
  app.post("/api/admin/logout", requireAuth, async (req, res) => {
    try {
      const token = req.cookies?.adminToken;
      const admin = (req as any).admin;

      if (token) {
        // Delete session
        await db.delete(adminSessions).where(eq(adminSessions.token, token));

        // Log audit
        await logAuditAction(admin.id, "LOGOUT", "admin", admin.id, null, req);
      }

      // Clear cookie
      res.clearCookie("adminToken");

      return res.json({
        success: true,
      });
    } catch (error) {
      console.error("Error during admin logout:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao processar logout.",
      });
    }
  });

  // GET /api/admin/me - Get current admin info
  app.get("/api/admin/me", requireAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;

      return res.json({
        success: true,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          isActive: admin.isActive,
          lastLoginAt: admin.lastLoginAt,
        },
      });
    } catch (error) {
      console.error("Error fetching admin info:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar informações do admin.",
      });
    }
  });

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

  // GET /api/admin/promo-codes - List all promo codes with usage stats
  app.get("/api/admin/promo-codes", requireAuth, async (req, res) => {
    try {
      const codes = await db.execute(sql`
        SELECT
          pc.*,
          (SELECT COUNT(*) FROM promo_redemptions pr WHERE pr.promo_code_id = pc.id) as redemption_count
        FROM promo_codes pc
        ORDER BY pc.created_at DESC
      `) as any[];

      return res.json({ success: true, codes });
    } catch (error) {
      console.error("Error fetching promo codes:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar códigos" });
    }
  });

  // POST /api/admin/promo-codes - Create a new promo code
  app.post("/api/admin/promo-codes", requireAuth, async (req, res) => {
    try {
      const { code, description, type, grantedPlan, grantedDays, maxUses } = req.body;

      if (!code || !grantedPlan || !grantedDays) {
        return res.status(400).json({ success: false, error: "Campos obrigatórios: code, grantedPlan, grantedDays" });
      }

      const id = `promo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      await db.execute(sql`
        INSERT INTO promo_codes (id, code, description, type, granted_plan, granted_days, max_uses, current_uses, is_active, created_at)
        VALUES (
          ${id},
          ${code.toUpperCase()},
          ${description || ""},
          ${type || "beta"},
          ${grantedPlan},
          ${Number(grantedDays)},
          ${Number(maxUses) || 1},
          0,
          true,
          NOW()
        )
      `);

      return res.json({ success: true, id });
    } catch (error: any) {
      if (error?.code === "23505") {
        return res.status(400).json({ success: false, error: "Código já existe" });
      }
      console.error("Error creating promo code:", error);
      return res.status(500).json({ success: false, error: "Erro ao criar código" });
    }
  });

  // PATCH /api/admin/promo-codes/:id - Toggle active/inactive
  app.patch("/api/admin/promo-codes/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      await db.execute(sql`
        UPDATE promo_codes SET is_active = ${Boolean(isActive)} WHERE id = ${id}
      `);

      return res.json({ success: true });
    } catch (error) {
      console.error("Error updating promo code:", error);
      return res.status(500).json({ success: false, error: "Erro ao atualizar código" });
    }
  });

  // GET /api/admin/beta-testers - List users who redeemed promo codes
  app.get("/api/admin/beta-testers", requireAuth, async (req, res) => {
    try {
      const testers = await db.execute(sql`
        SELECT
          u.id,
          u.name,
          u.email,
          u."telegramId",
          u.plan,
          u."planStatus",
          u."planStartDate",
          u."planEndDate",
          u.last_active_at,
          u."totalQuestionsAnswered",
          pr.promo_code_id,
          pc.code as promo_code,
          pr.redeemed_at
        FROM promo_redemptions pr
        JOIN "User" u ON pr.user_id = u.id
        JOIN promo_codes pc ON pr.promo_code_id = pc.id
        ORDER BY pr.redeemed_at DESC
      `) as any[];

      return res.json({ success: true, testers });
    } catch (error) {
      console.error("Error fetching beta testers:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar beta testers" });
    }
  });

  // GET /api/admin/users - List users (alunos) with engagement metrics
  app.get("/api/admin/users", requireAuth, async (req, res) => {
    try {
      const {
        page = "1",
        limit = "20",
        plan,
        status,
        search,
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Build WHERE conditions
      let whereConditions = `WHERE "telegramId" IS NOT NULL`;

      if (plan && plan !== "ALL") {
        whereConditions += ` AND plan = '${plan}'`;
      }

      if (status === "inactive") {
        whereConditions += ` AND (last_active_at IS NULL OR last_active_at < '${weekAgo.toISOString()}')`;
      } else if (status === "active") {
        whereConditions += ` AND last_active_at >= '${weekAgo.toISOString()}'`;
      }

      if (search && typeof search === "string" && search.trim()) {
        const searchTerm = search.trim().toLowerCase();
        whereConditions += ` AND (LOWER(email) LIKE '%${searchTerm}%' OR LOWER(name) LIKE '%${searchTerm}%' OR "telegramId" LIKE '%${searchTerm}%')`;
      }

      // Get total count
      const countResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM "User" ${sql.raw(whereConditions)}
      `);
      const total = Number((countResult as any[])[0]?.count || 0);

      // Get users with stats
      const usersResult = await db.execute(sql`
        SELECT
          id,
          email,
          name,
          "telegramId",
          plan,
          "planStatus",
          "planEndDate",
          last_active_at,
          "createdAt",
          "totalQuestionsAnswered"
        FROM "User"
        ${sql.raw(whereConditions)}
        ORDER BY last_active_at DESC NULLS LAST
        LIMIT ${limitNum} OFFSET ${offset}
      `);

      // Format users
      const formattedUsers = (usersResult as any[]).map((u) => {
        const lastActive = u.last_active_at ? new Date(u.last_active_at) : null;
        const isActive = lastActive && lastActive >= weekAgo;

        return {
          id: u.id,
          email: u.email,
          name: u.name,
          telegramId: u.telegramId,
          plan: u.plan,
          planStatus: u.planStatus,
          planEndDate: u.planEndDate,
          lastActiveAt: u.last_active_at,
          createdAt: u.createdAt,
          totalQuestions: u.totalQuestionsAnswered || 0,
          isActive,
        };
      });

      return res.json({
        success: true,
        users: formattedUsers,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar usuários.",
      });
    }
  });

  // GET /api/admin/check - Check if authenticated
  app.get("/api/admin/check", async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies?.adminToken;

    console.log('🔍 [CHECK] Token recebido:', token ? 'SIM' : 'NÃO');

    if (!token) {
      return res.json({
        authenticated: false,
      });
    }

    try {
      // Use Supabase HTTP client to verify session (same as login)
      const admin = await verifySupabaseSession(token);

      console.log('🔍 [CHECK] Admin encontrado:', admin ? 'SIM' : 'NÃO');

      if (!admin || !admin.isActive) {
        return res.json({
          authenticated: false,
        });
      }

      // Check if account is locked
      if (admin.lockedUntil && new Date(admin.lockedUntil) > new Date()) {
        return res.json({
          authenticated: false,
        });
      }

      return res.json({
        authenticated: true,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      });
    } catch (error) {
      console.error('❌ [CHECK] Erro:', error);
      return res.json({
        authenticated: false,
      });
    }
  });

  // PUT /api/admin/profile - Update admin profile
  app.put("/api/admin/profile", requireAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          error: "Nome e email são obrigatórios.",
        });
      }

      // Check if email is already in use by another admin
      const [existingAdmin] = await db
        .select()
        .from(admins)
        .where(and(eq(admins.email, email), ne(admins.id, admin.id)))
        .limit(1);

      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          error: "Este email já está em uso.",
        });
      }

      // Update profile
      const [updatedAdmin] = await db
        .update(admins)
        .set({ name, email })
        .where(eq(admins.id, admin.id))
        .returning();

      // Log audit
      await logAuditAction(admin.id, "UPDATE", "admin", admin.id, null, req);

      return res.json({
        success: true,
        admin: {
          id: updatedAdmin.id,
          email: updatedAdmin.email,
          name: updatedAdmin.name,
          role: updatedAdmin.role,
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao atualizar perfil.",
      });
    }
  });

  // PUT /api/admin/password - Change admin password
  app.put("/api/admin/password", requireAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: "Senha atual e nova senha são obrigatórias.",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: "A nova senha deve ter no mínimo 6 caracteres.",
        });
      }

      // Verify current password
      const isValid = await verifyPassword(currentPassword, admin.passwordHash);

      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: "Senha atual incorreta.",
        });
      }

      // Hash new password
      const newPasswordHash = await hashPassword(newPassword);

      // Update password
      await db
        .update(admins)
        .set({ passwordHash: newPasswordHash })
        .where(eq(admins.id, admin.id));

      // Log audit
      await logAuditAction(admin.id, "UPDATE", "admin", admin.id, null, req);

      return res.json({
        success: true,
      });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao alterar senha.",
      });
    }
  });

  // GET /api/admin/content - List content with advanced filters
  app.get("/api/admin/content", requireAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;

      // Parse query parameters for filters
      const {
        search,
        subject,
        examType,
        sphere,
        state,
        status,
        generatedByAI,
        page = "1",
        limit = "20",
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      // Build WHERE conditions
      const conditions = [];

      if (search) {
        conditions.push(
          or(
            like(content.title, `%${search}%`),
            like(content.body, `%${search}%`),
          ),
        );
      }

      if (subject) {
        conditions.push(eq(content.subject, subject as any));
      }

      if (examType) {
        conditions.push(eq(content.examType, examType as any));
      }

      if (sphere) {
        conditions.push(eq(content.sphere, sphere as any));
      }

      if (state) {
        conditions.push(eq(content.state, state as string));
      }

      if (status) {
        conditions.push(eq(content.status, status as any));
      }

      if (generatedByAI !== undefined) {
        conditions.push(eq(content.generatedByAI, generatedByAI === "true"));
      }

      // Build query
      let query = db.select().from(content);

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }

      // Apply sorting - map sortBy to actual column
      const sortColumnMap: Record<string, any> = {
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
        title: content.title,
        subject: content.subject,
        status: content.status,
      };
      const sortColumn = sortColumnMap[sortBy as string] || content.createdAt;
      query = query.orderBy(
        sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn),
      ) as any;

      // Apply pagination
      const results = await query.limit(limitNum).offset(offset);

      // Get total count
      let countQuery = db.select({ count: count() }).from(content);
      if (conditions.length > 0) {
        countQuery = countQuery.where(and(...conditions)) as any;
      }
      const [{ count: total }] = await countQuery;

      return res.json({
        success: true,
        content: results,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      console.error("Error fetching content:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar conteúdos.",
      });
    }
  });

  // GET /api/admin/content/list - Alias para listar (compatibilidade frontend)
  app.get("/api/admin/content/list", requireAuth, async (req, res) => {
    try {
      const {
        search = "",
        subject = "",
        examType = "",
        status = "",
        page = "1",
        limit = "10",
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      let query = db
        .select()
        .from(content)
        .limit(limitNum)
        .offset(offset)
        .orderBy(desc(content.createdAt));

      if (search) {
        query = query.where(like(content.title, `%${search}%`));
      }
      if (subject) {
        query = query.where(eq(content.subject, subject as string));
      }
      if (examType) {
        query = query.where(eq(content.examType, examType as string));
      }
      if (status) {
        query = query.where(eq(content.status, status as any));
      }

      const contents = await query;

      const [{ count }] = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(content);

      res.json({
        success: true,
        contents,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count,
          totalPages: Math.ceil(count / limitNum),
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: "Erro ao listar conteúdos",
      });
    }
  });

  // GET /api/admin/content/:id - Get single content by ID
  app.get("/api/admin/content/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;

      const [contentItem] = await db
        .select()
        .from(content)
        .where(eq(content.id, id))
        .limit(1);

      if (!contentItem) {
        return res.status(404).json({
          success: false,
          error: "Conteúdo não encontrado.",
        });
      }

      return res.json({
        success: true,
        content: contentItem,
      });
    } catch (error) {
      console.error("Error fetching content:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar conteúdo.",
      });
    }
  });

  // POST /api/admin/content - Create educational content
  app.post("/api/admin/content", requireAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;

      // Validate request body
      const result = insertContentSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          success: false,
          error: validationError.message,
        });
      }

      const data = result.data;

      // Prepare data, converting empty strings to null for FK fields
      const contentData = {
        ...data,
        materialId: data.materialId || null, // Convert empty string to null
        state: data.state || null, // Convert empty string to null
        sphere: data.sphere || null, // Convert empty string to null
        createdBy: admin.id,
        generatedByAI: false, // Manual creation
      };

      // Create content with admin as creator
      const [newContent] = await db
        .insert(content)
        .values(contentData)
        .returning();

      // Log audit
      await logAuditAction(
        admin.id,
        "CREATE",
        "content",
        newContent.id,
        null,
        req,
      );

      return res.json({
        success: true,
        content: newContent,
      });
    } catch (error) {
      console.error("Error creating content:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao criar conteúdo.",
      });
    }
  });

  // PUT /api/admin/content/:id - Update content
  app.put("/api/admin/content/:id", requireAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;
      const { id } = req.params;

      // Check if content exists
      const [existingContent] = await db
        .select()
        .from(content)
        .where(eq(content.id, id))
        .limit(1);

      if (!existingContent) {
        return res.status(404).json({
          success: false,
          error: "Conteúdo não encontrado.",
        });
      }

      // Validate request body
      const result = insertContentSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          success: false,
          error: validationError.message,
        });
      }

      // Prepare data, converting empty strings to null for FK fields
      const updateData = {
        ...result.data,
        materialId: result.data.materialId || null, // Convert empty string to null
        state: result.data.state || null, // Convert empty string to null
        sphere: result.data.sphere || null, // Convert empty string to null
        updatedAt: new Date(),
      };

      // Update content
      const [updatedContent] = await db
        .update(content)
        .set(updateData)
        .where(eq(content.id, id))
        .returning();

      // Log audit
      await logAuditAction(
        admin.id,
        "UPDATE",
        "content",
        id,
        { before: existingContent, after: updatedContent },
        req,
      );

      return res.json({
        success: true,
        content: updatedContent,
      });
    } catch (error) {
      console.error("Error updating content:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao atualizar conteúdo.",
      });
    }
  });

  // DELETE /api/admin/content/:id - Delete content
  app.delete("/api/admin/content/:id", requireAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;
      const { id } = req.params;

      // Check if content exists
      const [existingContent] = await db
        .select()
        .from(content)
        .where(eq(content.id, id))
        .limit(1);

      if (!existingContent) {
        return res.status(404).json({
          success: false,
          error: "Conteúdo não encontrado.",
        });
      }

      // Delete content (cascade will delete questions)
      await db.delete(content).where(eq(content.id, id));

      // Log audit
      await logAuditAction(
        admin.id,
        "DELETE",
        "content",
        id,
        { deleted: existingContent },
        req,
      );

      return res.json({
        success: true,
      });
    } catch (error) {
      console.error("Error deleting content:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao deletar conteúdo.",
      });
    }
  });

  // GET /api/admin/subjects - Get all subjects
  app.get("/api/admin/subjects", requireAuth, async (req, res) => {
    try {
      const allSubjects = await db
        .select()
        .from(subjects)
        .orderBy(asc(subjects.name));

      return res.json({
        success: true,
        subjects: allSubjects,
      });
    } catch (error) {
      console.error("Error fetching subjects:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar matérias.",
      });
    }
  });

  // GET /api/admin/materials - Get all materials
  app.get("/api/admin/materials", requireAuth, async (req, res) => {
    try {
      const allMaterials = await db
        .select()
        .from(materials)
        .orderBy(desc(materials.uploadedAt));

      return res.json({
        success: true,
        materials: allMaterials,
      });
    } catch (error) {
      console.error("Error fetching materials:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar materiais.",
      });
    }
  });

  // POST /api/admin/materials - Upload material
  app.post("/api/admin/materials", requireAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;

      // Validate request body
      const result = insertMaterialSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          success: false,
          error: validationError.message,
        });
      }

      // Create material with admin as uploader
      const [newMaterial] = await db
        .insert(materials)
        .values({
          ...result.data,
          uploadedBy: admin.id,
        })
        .returning();

      // Log audit
      await logAuditAction(
        admin.id,
        "CREATE",
        "material",
        newMaterial.id,
        null,
        req,
      );

      return res.json({
        success: true,
        material: newMaterial,
      });
    } catch (error) {
      console.error("Error creating material:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao criar material.",
      });
    }
  });

  // POST /api/admin/logo - Upload logo (placeholder for future implementation)
  app.post("/api/admin/logo", requireAuth, async (req, res) => {
    try {
      // TODO: Implement file upload with multer or similar
      return res.status(501).json({
        success: false,
        error: "Funcionalidade de upload de logo será implementada em breve.",
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao fazer upload do logo.",
      });
    }
  });

  // ============================================
  // WEBHOOK WHATSAPP
  // ============================================
  const { handleIncomingWhatsApp } = await import("./whatsapp/webhook");
  // GET para verificação do Twilio
  app.get("/webhook/whatsapp", (req, res) => {
    res.type("text/xml");
    res.send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
  });
  app.post("/webhook/whatsapp", handleIncomingWhatsApp);

  const httpServer = createServer(app);
  return httpServer;
}
