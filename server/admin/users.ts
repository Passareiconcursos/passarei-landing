/**
 * Admin Users Routes — Alunos e beta testers
 *
 * Rotas: /api/admin/users, /api/admin/beta-testers
 */

import type { Express } from "express";
import { db } from "../../db";
import { sql } from "drizzle-orm";
import { requireAuth } from "../middleware-supabase";

export function registerUsersRoutes(app: Express) {
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
}
