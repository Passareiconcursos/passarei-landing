import type { Express } from "express";
import { verifyPassword } from "./auth-minimal";
import {
  createAdminSession,
  logAuditAction,
  findAdminByEmail
} from "../lib/db/auth";
import { getAllLeads, createLead } from "../lib/db/leads";
import { requireAuth } from "./middleware-supabase";
import { sendLeadWelcomeEmail } from "./email/send-lead-drip";
import { db } from "../db";
import { sql } from "drizzle-orm";

export function registerSupabaseRoutes(app: Express) {
  
  // GET /api/leads
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await getAllLeads();
      return res.json({ success: true, leads });
    } catch (error) {
      console.error("Error fetching leads:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar leads." });
    }
  });
  
  // POST /api/leads
  app.post("/api/leads", async (req, res) => {
    try {
      const { name, email, phone, examType, state, acceptedWhatsApp } = req.body;
      
      if (!name || !email || !phone || !examType || !state) {
        return res.status(400).json({ success: false, error: "Campos obrigatórios faltando" });
      }
      
      const lead = await createLead({ name, email, phone, examType, state, acceptedWhatsApp });

      // Enviar email de boas-vindas imediato (drip email 1/4)
      // Não bloquear a resposta HTTP - enviar em background
      sendLeadWelcomeEmail({ leadEmail: email, leadName: name, examType })
        .then(async (result) => {
          if (result.success) {
            // Marcar email 1 como enviado
            try {
              await db.execute(sql`
                UPDATE leads
                SET "dripEmail1SentAt" = NOW(), "updatedAt" = NOW()
                WHERE id = ${lead.id}
              `);
            } catch (e) {
              console.error("❌ [Drip] Erro ao marcar email 1:", e);
            }
          }
        })
        .catch((err) => console.error("❌ [Drip] Erro no email de boas-vindas:", err));

      return res.json({ success: true, leadId: lead.id });
    } catch (error: any) {
      console.error("Error creating lead:", error);
      
      if (error.message === 'EMAIL_DUPLICADO') {
        return res.status(400).json({ success: false, error: "Email já cadastrado." });
      }
      
      return res.status(500).json({ success: false, error: "Erro ao processar cadastro. Tente novamente." });
    }
  });
  
  // POST /api/admin/login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      console.log('🔍 [LOGIN] 1. Início do login para:', email);
      
      if (!email || !password) {
        console.log('❌ [LOGIN] Email ou senha faltando');
        return res.status(400).json({ success: false, error: "Email e senha são obrigatórios." });
      }
      
      console.log('🔍 [LOGIN] 2. Buscando admin...');
      const admin = await findAdminByEmail(email);
      console.log('🔍 [LOGIN] Admin encontrado:', admin ? 'SIM' : 'NÃO');
      
      if (!admin) {
        return res.status(401).json({ success: false, error: "Email ou senha inválidos." });
      }
      
      console.log('🔍 [LOGIN] 3. Verificando senha...');
      const isPasswordValid = await verifyPassword(password, admin.password);
      console.log('🔍 [LOGIN] Senha válida:', isPasswordValid);
      
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, error: "Email ou senha inválidos." });
      }
      
      if (!admin.isActive) {
        return res.status(403).json({ success: false, error: "Conta desativada." });
      }
      
      console.log('🔍 [LOGIN] 4. Criando sessão...');
      const token = await createAdminSession(admin.id);
      console.log('🔍 [LOGIN] Token criado');
      
      console.log('🔍 [LOGIN] 5. Registrando audit...');
      await logAuditAction(admin.id, 'LOGIN', 'admin', admin.id, null);
      console.log('🔍 [LOGIN] Audit registrado');
      
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
      console.log('✅ [LOGIN] Login completo!');
      
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
      console.error("❌ [LOGIN] Erro:", error);
      return res.status(500).json({ success: false, error: "Erro ao processar login." });
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
      return res.status(500).json({ success: false, error: "Erro." });
    }
  });
  
  // POST /api/admin/logout
  app.post("/api/admin/logout", async (req, res) => {
    res.clearCookie("adminToken");
    return res.json({ success: true, message: "Logout realizado." });
  });
  
  console.log("✅ Rotas Supabase registradas");
}
