import type { Express } from "express";
import prisma from "../db/prisma";
import { verifyPassword } from "./auth";
import { createAdminSessionPrisma, logAuditActionPrisma } from "./auth-prisma";
import { requireAuthPrisma } from "./middleware-prisma";

// ==================== ROTAS COM PRISMA ====================

export function registerPrismaRoutes(app: Express) {
  
  // ==================== LEADS ====================
  
  // GET /api/leads-v2
  app.get("/api/leads-v2", async (req, res) => {
    try {
      const allLeads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' }
      });
      
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
  
  // POST /api/leads-v2
  app.post("/api/leads-v2", async (req, res) => {
    try {
      const { name, email, phone, examType, state, acceptedWhatsApp } = req.body;
      
      if (!name || !email || !phone || !examType || !state) {
        return res.status(400).json({
          success: false,
          error: "Campos obrigatórios faltando"
        });
      }
      
      const lead = await prisma.lead.create({
        data: {
          name,
          email,
          phone,
          examType,
          state,
          acceptedWhatsApp: acceptedWhatsApp ?? false,
          status: 'NOVO',
          source: 'landing_page'
        }
      });
      
      return res.json({
        success: true,
        leadId: lead.id,
      });
    } catch (error: any) {
      console.error("Error creating lead:", error);
      
      if (error.code === 'P2002') {
        return res.status(400).json({
          success: false,
          error: "Email já cadastrado.",
        });
      }
      
      return res.status(500).json({
        success: false,
        error: "Erro ao processar cadastro. Tente novamente.",
      });
    }
  });
  
  // ==================== AUTH ====================
  
  // POST /api/admin/login-v2
  app.post("/api/admin/login-v2", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email e senha são obrigatórios.",
        });
      }
      
      const admin = await prisma.admin.findUnique({
        where: { email }
      });
      
      if (!admin) {
        return res.status(401).json({
          success: false,
          error: "Email ou senha inválidos.",
        });
      }
      
      if (!admin.isActive) {
        return res.status(403).json({
          success: false,
          error: "Conta desativada. Contate o administrador.",
        });
      }
      
      const isValid = await verifyPassword(password, admin.password);
      
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: "Email ou senha inválidos.",
        });
      }
      
      await prisma.admin.update({
        where: { id: admin.id },
        data: { updatedAt: new Date() }
      });
      
      const token = await createAdminSessionPrisma(admin.id, req);
      await logAuditActionPrisma(admin.id, "LOGIN", "admin", admin.id, null, req);
      
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
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
  
  // POST /api/admin/logout-v2
  app.post("/api/admin/logout-v2", requireAuthPrisma, async (req, res) => {
    try {
      const token = req.cookies?.adminToken;
      const admin = (req as any).admin;
      
      if (token) {
        await prisma.adminSession.deleteMany({
          where: { token }
        });
        
        await logAuditActionPrisma(admin.id, "LOGOUT", "admin", admin.id, null, req);
      }
      
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
  
  // GET /api/admin/me-v2
  app.get("/api/admin/me-v2", requireAuthPrisma, async (req, res) => {
    try {
      const adminData = (req as any).admin;
      
      const admin = await prisma.admin.findUnique({
        where: { id: adminData.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          updatedAt: true
        }
      });
      
      if (!admin) {
        return res.status(404).json({
          success: false,
          error: "Admin não encontrado.",
        });
      }
      
      return res.json({
        success: true,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          isActive: admin.isActive,
          lastLoginAt: admin.updatedAt
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
  
  console.log('✅ Rotas Prisma registradas (Leads + Auth)');
}
