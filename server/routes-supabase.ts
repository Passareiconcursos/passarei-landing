import type { Express } from "express";
import { verifyPassword } from "./auth";
import { 
  createAdminSession, 
  logAuditAction,
  findAdminByEmail 
} from "../lib/db/auth";
import { getAllLeads, createLead } from "../lib/db/leads";
import { requireAuth } from "./middleware-supabase";

// ==================== ROTAS COM SUPABASE ====================

export function registerSupabaseRoutes(app: Express) {
  
  // ==================== LEADS ====================
  
  // GET /api/leads
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await getAllLeads();
      
      return res.json({
        success: true,
        leads,
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar leads.",
      });
    }
  });
  
  // POST /api/leads
  app.post("/api/leads", async (req, res) => {
    try {
      const { name, email, phone, examType, state, acceptedWhatsApp } = req.body;
      
      if (!name || !email || !phone || !examType || !state) {
        return res.status(400).json({
          success: false,
          error: "Campos obrigatórios faltando"
        });
      }
      
      const lead = await createLead({
        name,
        email,
        phone,
        examType,
        state,
        acceptedWhatsApp
      });
      
      return res.json({
        success: true,
        leadId: lead.id,
      });
    } catch (error: any) {
      console.error("Error creating lead:", error);
      
      if (error.message === 'EMAIL_DUPLICADO') {
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
  
  // POST /api/admin/login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email e senha são obrigatórios.",
        });
      }
      
      const admin = await findAdminByEmail(email);
      
      if (!admin) {
        return res.status(401).json({
          success: false,
          error: "Email ou senha inválidos.",
        });
      }
      
      const isPasswordValid = await verifyPassword(password, admin.password);
      
      if (!isPasswordValid) {
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
      
      const token = await createAdminSession(admin.id);
      
      await logAuditAction(admin.id, 'LOGIN', 'admin', admin.id, null);
      
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
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
      console.error("Error during login:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao processar login. Tente novamente.",
      });
    }
  });
  
  // GET /api/admin/me
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
        },
      });
    } catch (error) {
      console.error("Error fetching admin:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar dados do administrador.",
      });
    }
  });
  
  // POST /api/admin/logout
  app.post("/api/admin/logout", async (req, res) => {
    res.clearCookie("adminToken");
    
    return res.json({
      success: true,
      message: "Logout realizado com sucesso.",
    });
  });
  
  console.log("✅ Rotas Supabase registradas");
}
