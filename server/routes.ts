import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "../db";
import { leads, admins, adminSessions, users, subscriptions } from "../db/schema";
import { insertLeadSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { eq, and, count } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  createAdminSession,
  verifyAdminSession,
  logAuditAction,
  requireAuth,
  requireRole,
} from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/leads - Create a new lead
  app.post("/api/leads", async (req, res) => {
    try {
      // Validate request body
      const result = insertLeadSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          success: false,
          error: validationError.message,
        });
      }

      // Create lead in database
      const [lead] = await db.insert(leads).values({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        examType: result.data.examType,
        state: result.data.state,
        acceptedWhatsApp: result.data.acceptedWhatsApp,
      }).returning();

      return res.json({
        success: true,
        leadId: lead.id,
      });
    } catch (error) {
      console.error("Error creating lead:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao processar cadastro. Tente novamente.",
      });
    }
  });

  // GET /api/leads - Get all leads (for admin use later)
  app.get("/api/leads", async (req, res) => {
    try {
      const allLeads = await db.select().from(leads);
      return res.json({
        success: true,
        leads: allLeads,
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar leads.",
      });
    }
  });

  // Helper function to parse cookies
  function parseCookies(cookieHeader: string | undefined): Record<string, string> {
    if (!cookieHeader) return {};
    return cookieHeader.split(';').reduce((cookies, cookie) => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = value;
      return cookies;
    }, {} as Record<string, string>);
  }

  // Add cookie parsing middleware for admin routes
  app.use('/api/admin', (req, res, next) => {
    req.cookies = parseCookies(req.headers.cookie);
    next();
  });

  // POST /api/admin/login - Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email e senha são obrigatórios.",
        });
      }

      // Find admin by email
      const [admin] = await db
        .select()
        .from(admins)
        .where(eq(admins.email, email))
        .limit(1);

      if (!admin) {
        return res.status(401).json({
          success: false,
          error: "Email ou senha inválidos.",
        });
      }

      // Check if account is locked
      if (admin.lockedUntil && admin.lockedUntil > new Date()) {
        return res.status(403).json({
          success: false,
          error: "Conta temporariamente bloqueada. Tente novamente mais tarde.",
        });
      }

      // Check if admin is active
      if (!admin.isActive) {
        return res.status(403).json({
          success: false,
          error: "Conta desativada. Contate o administrador.",
        });
      }

      // Verify password
      const isValid = await verifyPassword(password, admin.passwordHash);

      if (!isValid) {
        // Increment login attempts
        const attempts = admin.loginAttempts + 1;
        const lockedUntil = attempts >= 5 
          ? new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
          : null;

        await db
          .update(admins)
          .set({ 
            loginAttempts: attempts,
            lockedUntil,
          })
          .where(eq(admins.id, admin.id));

        return res.status(401).json({
          success: false,
          error: "Email ou senha inválidos.",
        });
      }

      // Reset login attempts and update last login
      await db
        .update(admins)
        .set({
          loginAttempts: 0,
          lockedUntil: null,
          lastLoginAt: new Date(),
        })
        .where(eq(admins.id, admin.id));

      // Create session
      const token = await createAdminSession(admin.id, req);

      // Log audit
      await logAuditAction(admin.id, "LOGIN", "admin", admin.id, null, req);

      // Set cookie
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "lax",
      });

      return res.json({
        success: true,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      });
    } catch (error) {
      console.error("Error during admin login:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao processar login.",
      });
    }
  });

  // POST /api/admin/logout - Admin logout
  app.post("/api/admin/logout", requireAuth, async (req, res) => {
    try {
      const token = req.cookies?.adminToken;
      const admin = (req as any).admin;

      if (token) {
        // Delete session
        await db
          .delete(adminSessions)
          .where(eq(adminSessions.token, token));

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
        .where(eq(leads.status, "CONVERTED"));
      
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
      
      const mrr = activeSubscriptionsData.reduce((total, sub) => total + (sub.amount || 0), 0);

      // Calculate conversion rate
      const leadsCount = Number(totalLeads[0]?.count || 0);
      const conversionCount = Number(convertedLeads[0]?.count || 0);
      const conversionRate = leadsCount > 0 
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

  // GET /api/admin/check - Check if authenticated
  app.get("/api/admin/check", async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies?.adminToken;

    if (!token) {
      return res.json({
        authenticated: false,
      });
    }

    try {
      const admin = await verifyAdminSession(token);

      if (!admin || !admin.isActive) {
        return res.json({
          authenticated: false,
        });
      }

      // Check if account is locked
      if (admin.lockedUntil && admin.lockedUntil > new Date()) {
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
      return res.json({
        authenticated: false,
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
