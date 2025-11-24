import type { Request } from "express";
import prisma from "../db/prisma";
import { randomBytes } from "crypto";

// Funções de autenticação usando Prisma

export async function createAdminSessionPrisma(
  adminId: string,
  req: Request
): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.adminSession.create({
    data: {
      adminId,
      token,
      expiresAt,
    },
  });

  return token;
}

export async function verifyAdminSessionPrisma(
  token: string
): Promise<any | null> {
  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: { admin: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    await prisma.adminSession.delete({
      where: { id: session.id },
    });
    return null;
  }

  return session.admin;
}

export async function logAuditActionPrisma(
  adminId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  changes: any,
  req: Request
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      adminId,
      action: `${action} ${resourceType} ${resourceId}`,
      details: changes ? JSON.parse(JSON.stringify(changes)) : null,
    },
  });
}
