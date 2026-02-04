import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "./index";

async function migrateAdminSessions() {
  console.log("🔄 Criando tabelas de sessões admin...\n");

  try {
    // Criar tabela AdminSession (nome Prisma)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "AdminSession" (
        id TEXT PRIMARY KEY,
        "adminId" TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log("✅ Tabela AdminSession criada");

    // Criar índices
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_admin_session_admin ON "AdminSession"("adminId");
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_admin_session_token ON "AdminSession"(token);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_admin_session_expires ON "AdminSession"("expiresAt");
    `);

    console.log("✅ Índices AdminSession criados");

    // Criar tabela admin_sessions (snake_case - usado pelo Drizzle schema)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id TEXT PRIMARY KEY,
        admin_id TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        ip_address TEXT,
        user_agent TEXT,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log("✅ Tabela admin_sessions criada");

    // Criar índices
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin ON admin_sessions(admin_id);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
    `);

    console.log("✅ Índices admin_sessions criados");

    // Criar tabela AuditLog
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "AuditLog" (
        id TEXT PRIMARY KEY,
        "adminId" TEXT NOT NULL,
        action TEXT NOT NULL,
        details JSONB,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log("✅ Tabela AuditLog criada");

    // Criar índices
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_audit_log_admin ON "AuditLog"("adminId");
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_audit_log_created ON "AuditLog"("createdAt");
    `);

    console.log("✅ Índices AuditLog criados");

    // Criar tabela audit_logs (snake_case - usado pelo Drizzle schema)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        admin_id TEXT NOT NULL,
        action TEXT NOT NULL,
        resource TEXT NOT NULL,
        resource_id TEXT,
        changes JSONB,
        ip_address TEXT,
        user_agent TEXT,
        timestamp TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log("✅ Tabela audit_logs criada");

    // Criar índices
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_admin ON audit_logs(admin_id);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
    `);

    console.log("✅ Índices audit_logs criados");

    console.log("\n🎉 Migração concluída com sucesso!");
  } catch (error: any) {
    if (error.message?.includes("already exists")) {
      console.log("ℹ️ Tabelas já existem");
    } else {
      console.error("❌ Erro na migração:", error);
      throw error;
    }
  }
}

migrateAdminSessions()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
