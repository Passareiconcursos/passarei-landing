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
  questions
} from "../db/schema";
import { 
  insertLeadSchema, 
  insertContentSchema,
  insertMaterialSchema,
  insertQuestionSchema
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { eq, and, count, desc, asc, like, or, ne, sql } from "drizzle-orm";
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

  // POST /api/admin/login - Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password, recaptchaToken } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email e senha são obrigatórios.",
        });
      }

      // reCAPTCHA verification DISABLED for testing
      // TODO: Re-enable in production after configuring RECAPTCHA_SECRET_KEY
      /*
      if (!recaptchaToken) {
        return res.status(403).json({
          success: false,
          error: "Verificação de segurança obrigatória.",
        });
      }

      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        return res.status(403).json({
          success: false,
          error: "Falha na verificação de segurança. Tente novamente.",
        });
      }
      */

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
        sortOrder = "desc"
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
            like(leads.phone, `%${search}%`)
          )
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

      if (!status || !["NOVO", "CONTATADO", "QUALIFICADO", "CONVERTIDO"].includes(status)) {
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
            like(content.body, `%${search}%`)
          )
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
      query = query.orderBy(sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn)) as any;

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
        materialId: data.materialId || null,  // Convert empty string to null
        state: data.state || null,             // Convert empty string to null
        sphere: data.sphere || null,           // Convert empty string to null
        createdBy: admin.id,
        generatedByAI: false, // Manual creation
      };

      // Create content with admin as creator
      const [newContent] = await db
        .insert(content)
        .values(contentData)
        .returning();

      // Log audit
      await logAuditAction(admin.id, "CREATE", "content", newContent.id, null, req);

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
        materialId: result.data.materialId || null,  // Convert empty string to null
        state: result.data.state || null,             // Convert empty string to null
        sphere: result.data.sphere || null,           // Convert empty string to null
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
        req
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
      await logAuditAction(admin.id, "DELETE", "content", id, { deleted: existingContent }, req);

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
      const allSubjects = await db.select().from(subjects).orderBy(asc(subjects.name));
      
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
      const allMaterials = await db.select().from(materials).orderBy(desc(materials.uploadedAt));
      
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
      await logAuditAction(admin.id, "CREATE", "material", newMaterial.id, null, req);

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

  const httpServer = createServer(app);
  return httpServer;
}
