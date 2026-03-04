/**
 * Sala de Aula — Auth Routes
 *
 * Rotas: POST /api/sala/auth/register, POST /api/sala/auth/login,
 *        GET /api/sala/auth/me, POST /api/sala/auth/logout,
 *        PUT /api/sala/auth/change-password, PUT /api/sala/auth/change-email
 */

import type { Express } from "express";
import bcrypt from "bcrypt";
import { db } from "../db";
import { sql } from "drizzle-orm";
import {
  registerStudent,
  loginStudent,
  requireStudentAuth,
  getStudentProfile,
  generateStudentToken,
  type StudentJWTPayload,
} from "./auth-student";
import { sendTelegramMessage } from "./telegram/bot";
import { sendEmail } from "./email/resend";

export function registerSalaAuthRoutes(app: Express) {
  console.log("🎓 Registrando rotas de auth da Sala de Aula...");

  // POST /api/sala/auth/register
  app.post("/api/sala/auth/register", async (req, res) => {
    const { email, password, name, phone, examType, cargo, state } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: "Email, senha e nome são obrigatórios.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "A senha deve ter no mínimo 6 caracteres.",
      });
    }

    const result = await registerStudent({ email, password, name, phone, examType, cargo, state });

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    // Set cookie + return token
    res.cookie("studentToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      success: true,
      token: result.token,
      profile: result.profile,
    });
  });

  // POST /api/sala/auth/login
  app.post("/api/sala/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email e senha são obrigatórios.",
      });
    }

    const result = await loginStudent(email, password);

    if (!result.success) {
      return res.status(401).json({ success: false, error: result.error });
    }

    // Set cookie + return token
    res.cookie("studentToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      token: result.token,
      profile: result.profile,
    });
  });

  // GET /api/sala/auth/me - Get current student profile
  app.get("/api/sala/auth/me", requireStudentAuth, async (req, res) => {
    const student = (req as any).student as StudentJWTPayload;

    const profile = await getStudentProfile(student.userId);
    if (!profile) {
      return res.status(404).json({ success: false, error: "Perfil não encontrado." });
    }

    return res.json({ success: true, profile });
  });

  // POST /api/sala/auth/logout
  app.post("/api/sala/auth/logout", (_req, res) => {
    res.clearCookie("studentToken");
    return res.json({ success: true });
  });

  // PUT /api/sala/auth/change-password
  app.put("/api/sala/auth/change-password", requireStudentAuth, async (req, res) => {
    const student = (req as any).student as StudentJWTPayload;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: "Senha atual e nova senha são obrigatórias." });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, error: "A nova senha deve ter no mínimo 8 caracteres." });
    }

    try {
      const rows = await db.execute(sql`
        SELECT "passwordHash" FROM "User" WHERE id = ${student.userId} LIMIT 1
      `) as any[];
      const hash = rows[0]?.passwordHash;
      if (!hash) return res.status(400).json({ success: false, error: "Conta sem senha cadastrada. Use o link de redefinição." });

      const valid = await bcrypt.compare(currentPassword, hash);
      if (!valid) return res.status(401).json({ success: false, error: "Senha atual incorreta." });

      if (await bcrypt.compare(newPassword, hash)) {
        return res.status(400).json({ success: false, error: "A nova senha deve ser diferente da atual." });
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      await db.execute(sql`
        UPDATE "User" SET "passwordHash" = ${newHash}, "updatedAt" = NOW() WHERE id = ${student.userId}
      `);

      return res.json({ success: true, message: "Senha alterada com sucesso." });
    } catch (err) {
      console.error("❌ [Auth] change-password:", err);
      return res.status(500).json({ success: false, error: "Erro ao alterar senha." });
    }
  });

  // PUT /api/sala/auth/change-email
  app.put("/api/sala/auth/change-email", requireStudentAuth, async (req, res) => {
    const student = (req as any).student as StudentJWTPayload;
    const { password, newEmail } = req.body;

    if (!password || !newEmail) {
      return res.status(400).json({ success: false, error: "Senha e novo e-mail são obrigatórios." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ success: false, error: "Formato de e-mail inválido." });
    }

    try {
      const rows = await db.execute(sql`
        SELECT "passwordHash" FROM "User" WHERE id = ${student.userId} LIMIT 1
      `) as any[];
      const hash = rows[0]?.passwordHash;
      if (!hash) return res.status(400).json({ success: false, error: "Confirme sua identidade com uma senha válida." });

      const valid = await bcrypt.compare(password, hash);
      if (!valid) return res.status(401).json({ success: false, error: "Senha incorreta." });

      const conflict = await db.execute(sql`
        SELECT id FROM "User" WHERE email = ${newEmail.toLowerCase()} AND id != ${student.userId} LIMIT 1
      `) as any[];
      if (conflict[0]) return res.status(409).json({ success: false, error: "Este e-mail já está em uso." });

      await db.execute(sql`
        UPDATE "User" SET email = ${newEmail.toLowerCase()}, "updatedAt" = NOW() WHERE id = ${student.userId}
      `);

      return res.json({ success: true, message: "E-mail alterado com sucesso.", newEmail: newEmail.toLowerCase() });
    } catch (err) {
      console.error("❌ [Auth] change-email:", err);
      return res.status(500).json({ success: false, error: "Erro ao alterar e-mail." });
    }
  });

  // POST /api/sala/auth/forgot-password — Gera código e envia via Telegram ou E-mail
  app.post("/api/sala/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, error: "E-mail obrigatório." });

      const rows = await db.execute(sql`
        SELECT id, name, "telegramId" FROM "User" WHERE email = ${email.toLowerCase()} LIMIT 1
      `) as any[];

      // Resposta genérica mesmo se não existir (não vazar informação)
      if (!rows[0]) return res.json({ success: true, method: "email" });

      const user = rows[0];

      // Invalida códigos anteriores pendentes
      await db.execute(sql`
        UPDATE password_reset_codes SET used_at = NOW()
        WHERE user_id = ${user.id} AND used_at IS NULL
      `);

      // Gera código de 6 dígitos
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      await db.execute(sql`
        INSERT INTO password_reset_codes (user_id, code, expires_at)
        VALUES (${user.id}, ${code}, ${expiresAt})
      `);

      let method: "telegram" | "email" = "email";

      // Prioridade: Telegram
      if (user.telegramId) {
        try {
          await sendTelegramMessage(
            user.telegramId,
            `🔐 *Recuperação de Acesso*\n\nSeu código de verificação é:\n\n*${code}*\n\n⏰ Válido por 15 minutos.\nUse-o no site para redefinir sua senha.`
          );
          method = "telegram";
        } catch {
          // Fallback para e-mail
        }
      }

      // Fallback: E-mail
      if (method === "email") {
        const { resetPasswordHtml } = await import("./email/templates/reset-password");
        await sendEmail({
          to: email,
          subject: "Passarei — Código de recuperação de senha",
          html: resetPasswordHtml(user.name || "Estudante", code),
        });
      }

      console.log(`🔐 [Auth] forgot-password: ${email} → ${method}`);
      return res.json({ success: true, method });
    } catch (err) {
      console.error("❌ [Auth] forgot-password:", err);
      return res.status(500).json({ success: false, error: "Erro ao processar recuperação." });
    }
  });

  // POST /api/sala/auth/reset-password — Valida código e redefine senha
  app.post("/api/sala/auth/reset-password", async (req, res) => {
    try {
      const { email, code, newPassword } = req.body;
      if (!email || !code || !newPassword)
        return res.status(400).json({ success: false, error: "Todos os campos são obrigatórios." });

      // Validar regras da senha
      if (
        newPassword.length < 6 ||
        !/[a-zA-Z]/.test(newPassword) ||
        !/[0-9]/.test(newPassword)
      ) {
        return res.status(400).json({
          success: false,
          error: "Senha deve ter no mínimo 6 caracteres com pelo menos uma letra e um número.",
        });
      }

      const userRows = await db.execute(sql`
        SELECT id, email, name, plan FROM "User" WHERE email = ${email.toLowerCase()} LIMIT 1
      `) as any[];
      if (!userRows[0])
        return res.status(400).json({ success: false, error: "Código inválido ou expirado." });

      const user = userRows[0];

      const codeRows = await db.execute(sql`
        SELECT id FROM password_reset_codes
        WHERE user_id = ${user.id}
          AND code = ${code}
          AND expires_at > NOW()
          AND used_at IS NULL
        LIMIT 1
      `) as any[];
      if (!codeRows[0])
        return res.status(400).json({ success: false, error: "Código inválido ou expirado." });

      const hash = await bcrypt.hash(newPassword, 10);

      await db.execute(sql`
        UPDATE "User" SET "passwordHash" = ${hash}, "updatedAt" = NOW() WHERE id = ${user.id}
      `);
      await db.execute(sql`
        UPDATE password_reset_codes SET used_at = NOW()
        WHERE user_id = ${user.id} AND code = ${code}
      `);

      // Login automático após redefinição
      const profile = await getStudentProfile(user.id);
      const token = generateStudentToken(profile!);

      console.log(`✅ [Auth] reset-password: ${email} redefiniu senha com sucesso`);
      return res.json({ success: true, token, profile });
    } catch (err) {
      console.error("❌ [Auth] reset-password:", err);
      return res.status(500).json({ success: false, error: "Erro ao redefinir senha." });
    }
  });
}
