/**
 * Admin Settings Routes — Auth check, perfil e senha
 *
 * Rotas: /api/admin/check, PUT /api/admin/profile, PUT /api/admin/password
 */

import type { Express } from "express";
import { db } from "../../db";
import { admins } from "../../db/schema";
import { eq, and, ne } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  logAuditAction,
} from "../auth";
import { verifyAdminSession as verifySupabaseSession } from "../../lib/db/auth";
import { requireAuth } from "../middleware-supabase";

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

export function registerSettingsRoutes(app: Express) {
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
}
