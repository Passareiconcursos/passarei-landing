import { db } from "./index";
import { sql } from "drizzle-orm";

/**
 * Auto-migração que roda no startup do servidor.
 * Verifica e cria tabelas/colunas necessárias se não existirem.
 * Seguro para rodar múltiplas vezes (idempotente).
 */
export async function runAutoMigrations() {
  console.log("🔄 [Auto-Migrate] Verificando banco de dados...");

  try {
    // 1. Verificar tabela leads
    await migrateLeadsTable();

    // 2. Verificar coluna last_active_at na User
    await migrateUserColumns();

    // 3. Configurar beta tester
    await migrateBetaTester();

    console.log("✅ [Auto-Migrate] Banco de dados OK!\n");
  } catch (error) {
    console.error("⚠️ [Auto-Migrate] Erro (não fatal):", error);
  }
}

async function migrateLeadsTable() {
  // Verificar se tabela "leads" existe
  const leadsExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'leads'
    ) as exists
  `) as any[];

  if (leadsExists[0]?.exists) {
    return;
  }

  // Verificar se tabela "Lead" existe (PascalCase do Prisma)
  const leadExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'Lead'
    ) as exists
  `) as any[];

  if (leadExists[0]?.exists) {
    console.log("  🔄 Renomeando 'Lead' para 'leads'...");
    await db.execute(sql`ALTER TABLE "Lead" RENAME TO leads`);
    console.log("  ✅ Tabela renomeada");
  } else {
    console.log("  🔄 Criando tabela 'leads'...");

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE lead_status AS ENUM ('NOVO', 'CONTATADO', 'QUALIFICADO', 'CONVERTIDO');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        exam_type TEXT NOT NULL,
        state VARCHAR(2) NOT NULL,
        status lead_status NOT NULL DEFAULT 'NOVO',
        source TEXT DEFAULT 'landing_page',
        notes TEXT,
        assigned_to VARCHAR,
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        accepted_whats_app BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        converted_at TIMESTAMP,
        "dripEmail1SentAt" TIMESTAMP,
        "dripEmail2SentAt" TIMESTAMP,
        "dripEmail3SentAt" TIMESTAMP,
        "dripEmail4SentAt" TIMESTAMP
      )
    `);
    console.log("  ✅ Tabela 'leads' criada");
  }
}

async function migrateUserColumns() {
  // Verificar se last_active_at existe
  const colExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'User' AND column_name = 'last_active_at'
    ) as exists
  `) as any[];

  if (!colExists[0]?.exists) {
    console.log("  🔄 Adicionando coluna last_active_at...");
    await db.execute(sql`
      ALTER TABLE "User"
      ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP
    `);
    console.log("  ✅ Coluna last_active_at adicionada");
  }
}

async function migrateBetaTester() {
  const EMAIL = "oficialpassarei@gmail.com";

  // Verificar se já é VETERANO
  const userResult = await db.execute(sql`
    SELECT id, plan, "planStatus", "planEndDate"
    FROM "User"
    WHERE email = ${EMAIL}
    LIMIT 1
  `) as any[];

  if (!userResult || userResult.length === 0) {
    return; // Usuário não existe ainda
  }

  const user = userResult[0];

  // Já é VETERANO permanente? Não precisa atualizar
  if (user.plan === "VETERANO" && user.planEndDate) {
    const endDate = new Date(user.planEndDate);
    if (endDate.getFullYear() >= 2099) {
      return;
    }
  }

  console.log("  🔄 Configurando beta tester:", EMAIL);
  await db.execute(sql`
    UPDATE "User"
    SET
      plan = 'VETERANO',
      "planStatus" = 'active',
      "planEndDate" = '2099-12-31'::timestamp,
      "updatedAt" = NOW()
    WHERE email = ${EMAIL}
  `);
  console.log("  ✅ Beta tester configurado: VETERANO permanente");
}
