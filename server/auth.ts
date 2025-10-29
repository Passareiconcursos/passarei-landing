import crypto from "crypto";
import bcrypt from "bcrypt";
import type { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { admins, adminSessions, auditLogs } from "../db/schema";
import { eq, and, gt } from "drizzle-orm";

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Verify password using bcrypt
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate session token
export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Create admin session
export async function createAdminSession(
  adminId: string,
  req: Request
): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.insert(adminSessions).values({
    adminId,
    token,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    expiresAt,
  });

  return token;
}

// Verify admin session
export async function verifyAdminSession(token: string) {
  const [session] = await db
    .select()
    .from(adminSessions)
    .where(
      and(
        eq(adminSessions.token, token),
        gt(adminSessions.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!session) {
    return null;
  }

  const [admin] = await db
    .select()
    .from(admins)
    .where(eq(admins.id, session.adminId))
    .limit(1);

  return admin;
}

// Log audit action
export async function logAuditAction(
  adminId: string,
  action: "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE" | "EXPORT" | "VIEW",
  resource: string,
  resourceId: string | null,
  changes: any | null,
  req: Request
) {
  await db.insert(auditLogs).values({
    adminId,
    action,
    resource,
    resourceId,
    changes,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });
}

// Auth middleware
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.adminToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Não autorizado. Faça login para continuar.",
    });
  }

  try {
    const admin = await verifyAdminSession(token);

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: "Sessão inválida ou expirada.",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        error: "Conta desativada. Contate o administrador.",
      });
    }

    // Check if account is locked
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      return res.status(403).json({
        success: false,
        error: "Conta temporariamente bloqueada. Tente novamente mais tarde.",
      });
    }

    // Attach admin to request
    (req as any).admin = admin;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      error: "Erro ao verificar autenticação.",
    });
  }
}

// Role-based authorization middleware
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const admin = (req as any).admin;

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: "Não autorizado.",
      });
    }

    if (!allowedRoles.includes(admin.role)) {
      return res.status(403).json({
        success: false,
        error: "Você não tem permissão para acessar este recurso.",
      });
    }

    next();
  };
}
