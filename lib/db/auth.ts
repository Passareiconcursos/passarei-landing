import { supabaseHttpAdmin } from "../supabase-http";
import { randomBytes } from "crypto";
import { nanoid } from "nanoid";

export async function createAdminSession(adminId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await supabaseHttpAdmin.from("AdminSession").insert({
    id: nanoid(),
    adminId,
    token,
    expiresAt: expiresAt.toISOString(),
    createdAt: new Date().toISOString(),
  });

  return token;
}

export async function verifyAdminSession(token: string): Promise<any | null> {
  // Buscar sessão
  const { data: sessions, error: sessionError } = await supabaseHttpAdmin
    .from("AdminSession")
    .select("*", { token });

  if (sessionError || !sessions || sessions.length === 0) {
    return null;
  }

  const session = sessions[0];

  // Verificar expiração
  if (new Date(session.expiresAt) < new Date()) {
    return null;
  }

  // Buscar admin
  const { data: admins, error: adminError } = await supabaseHttpAdmin
    .from("Admin")
    .select("*", { id: session.adminId });

  if (adminError || !admins || admins.length === 0) {
    return null;
  }

  return admins[0];
}

export async function logAuditAction(
  adminId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  changes: any,
): Promise<void> {
  await supabaseHttpAdmin.from("AuditLog").insert({
    id: nanoid(),
    adminId,
    action: `${action} ${resourceType} ${resourceId}`,
    details: changes || null,
    createdAt: new Date().toISOString(),
  });
}

export async function findAdminByEmail(email: string) {
  console.log("🔍 [findAdminByEmail] Buscando:", email);
  console.log(
    "🔍 [findAdminByEmail] URL:",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );

  const { data, error } = await supabaseHttpAdmin
    .from("Admin")
    .select("*", { email });

  console.log("🔍 [findAdminByEmail] Resultado:", { data, error });

  if (error || !data || data.length === 0) return null;
  return data[0];
}
