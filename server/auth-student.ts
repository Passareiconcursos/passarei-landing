/**
 * Student Auth — Autenticação JWT para alunos da Sala de Aula
 *
 * Separado do auth.ts (admin) para manter responsabilidades claras.
 * Usa a tabela "User" (Prisma legacy) com coluna password_hash.
 */

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { sql } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || "passarei-dev-secret-change-in-production";
const JWT_EXPIRES_IN = "7d";

// ============================================
// INTERFACES
// ============================================

export interface StudentJWTPayload {
  userId: string;
  email: string;
  name: string;
  plan: string;
}

export interface StudentProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  plan: string;
  planStatus: string | null;
  examType: string | null;
  cargo: string | null;
  state: string | null;
  firstInteractionDate: string | null;
  totalQuestionsAnswered: number;
  onboardingDone: boolean;
  targetConcursoId?: string | null;
}

// ============================================
// REGISTRO
// ============================================

export async function registerStudent(data: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  examType?: string;
  cargo?: string;
  state?: string;
}): Promise<{ success: boolean; token?: string; profile?: StudentProfile; error?: string }> {
  try {
    // Check if email already exists
    const existing = await db.execute(sql`
      SELECT id, "passwordHash" FROM "User" WHERE email = ${data.email} LIMIT 1
    `) as any[];

    if (existing.length > 0) {
      const user = existing[0];
      // If user exists but has no password (Telegram user), allow setting password
      if (user.passwordHash) {
        return { success: false, error: "Este email já está cadastrado." };
      }
      // Link: Telegram user registering on web
      const passwordHash = await bcrypt.hash(data.password, 10);
      await db.execute(sql`
        UPDATE "User"
        SET "passwordHash" = ${passwordHash},
            name = COALESCE(NULLIF(${data.name}, ''), name),
            "updatedAt" = NOW()
        WHERE id = ${user.id}
      `);
      const profile = await getStudentProfile(user.id);
      const token = generateStudentToken(profile!);
      return { success: true, token, profile: profile! };
    }

    // New user
    const passwordHash = await bcrypt.hash(data.password, 10);
    const now = new Date().toISOString();

    const result = await db.execute(sql`
      INSERT INTO "User" (
        email, "passwordHash", name, phone,
        "examType", cargo, state, plan, "planStatus",
        "firstInteractionDate", "firstDayFreeUsed",
        "dailyContentCount", "lastContentDate",
        "totalQuestionsAnswered", "totalSpent", credits,
        "createdAt", "updatedAt"
      ) VALUES (
        ${data.email}, ${passwordHash}, ${data.name}, ${data.phone || null},
        ${data.examType || null}, ${data.cargo || null}, ${data.state || null},
        'FREE', 'active',
        ${now}, 0,
        0, ${now},
        0, 0, 0,
        NOW(), NOW()
      )
      RETURNING id
    `) as any[];

    const userId = result[0].id;
    const profile = await getStudentProfile(userId);
    const token = generateStudentToken(profile!);

    return { success: true, token, profile: profile! };
  } catch (error: any) {
    console.error("❌ [Student Auth] Erro no registro:", error);
    return { success: false, error: "Erro interno ao registrar." };
  }
}

// ============================================
// LOGIN
// ============================================

export async function loginStudent(
  email: string,
  password: string,
): Promise<{ success: boolean; token?: string; profile?: StudentProfile; error?: string }> {
  try {
    const result = await db.execute(sql`
      SELECT id, "passwordHash", plan
      FROM "User"
      WHERE email = ${email}
      LIMIT 1
    `) as any[];

    if (result.length === 0) {
      return { success: false, error: "Email ou senha incorretos." };
    }

    const user = result[0];

    if (!user.passwordHash) {
      return {
        success: false,
        error: "Esta conta foi criada pelo Telegram. Use o Telegram para acessar ou defina uma senha.",
      };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: "Email ou senha incorretos." };
    }

    // Update last active
    await db.execute(sql`
      UPDATE "User"
      SET last_active_at = NOW(), "updatedAt" = NOW()
      WHERE id = ${user.id}
    `);

    const profile = await getStudentProfile(user.id);
    const token = generateStudentToken(profile!);

    return { success: true, token, profile: profile! };
  } catch (error: any) {
    console.error("❌ [Student Auth] Erro no login:", error);
    return { success: false, error: "Erro interno ao fazer login." };
  }
}

// ============================================
// MIDDLEWARE — Protege rotas /api/sala/*
// ============================================

export function requireStudentAuth(req: Request, res: Response, next: NextFunction) {
  // Try Bearer token first, then cookie
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : req.cookies?.studentToken;

  if (!token) {
    return res.status(401).json({ success: false, error: "Token não fornecido." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as StudentJWTPayload;
    (req as any).student = payload;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Token inválido ou expirado." });
  }
}

// ============================================
// PERFIL DO ALUNO
// ============================================

export async function getStudentProfile(userId: string): Promise<StudentProfile | null> {
  try {
    const result = await db.execute(sql`
      SELECT
        id, email, name, phone, plan, "planStatus",
        "examType", cargo, state,
        "firstInteractionDate",
        "totalQuestionsAnswered",
        "onboardingCompleted",
        target_concurso_id
      FROM "User"
      WHERE id = ${userId}
      LIMIT 1
    `) as any[];

    if (result.length === 0) return null;

    const u = result[0];
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      phone: u.phone,
      plan: u.plan || "FREE",
      planStatus: u.planStatus,
      examType: u.examType,
      cargo: u.cargo,
      state: u.state,
      firstInteractionDate: u.firstInteractionDate,
      totalQuestionsAnswered: u.totalQuestionsAnswered || 0,
      onboardingDone: !!u.onboardingCompleted,
      targetConcursoId: u.target_concurso_id || null,
    };
  } catch (error) {
    console.error("❌ [Student Auth] Erro ao buscar perfil:", error);
    return null;
  }
}

// ============================================
// HELPERS
// ============================================

function generateStudentToken(profile: StudentProfile): string {
  const payload: StudentJWTPayload = {
    userId: profile.id,
    email: profile.email,
    name: profile.name,
    plan: profile.plan,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
