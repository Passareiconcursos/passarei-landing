/**
 * Sala de Aula — Auth Routes
 *
 * Rotas: POST /api/sala/auth/register, POST /api/sala/auth/login,
 *        GET /api/sala/auth/me, POST /api/sala/auth/logout
 */

import type { Express } from "express";
import {
  registerStudent,
  loginStudent,
  requireStudentAuth,
  getStudentProfile,
  type StudentJWTPayload,
} from "./auth-student";

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
}
