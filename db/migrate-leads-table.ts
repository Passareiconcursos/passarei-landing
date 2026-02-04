import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

/**
 * Migration: Criar tabela leads (minúsculo) para compatibilidade com Drizzle
 *
 * O banco usa "Lead" (PascalCase - Prisma) mas o Drizzle espera "leads"
 * Esta migração cria a tabela no formato correto ou copia dados existentes
 */
async function migrate() {
  console.log("🔄 Iniciando migration: Leads Table...\n");

  try {
    // Verificar se tabela "Lead" existe
    const leadExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'Lead'
      ) as exists
    `) as any[];

    // Verificar se tabela "leads" existe
    const leadsExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'leads'
      ) as exists
    `) as any[];

    console.log("📋 Status das tabelas:");
    console.log("  - Lead (PascalCase):", leadExists[0]?.exists ? "existe" : "não existe");
    console.log("  - leads (minúsculo):", leadsExists[0]?.exists ? "existe" : "não existe");

    if (leadsExists[0]?.exists) {
      console.log("\n✅ Tabela 'leads' já existe!");
    } else if (leadExists[0]?.exists) {
      // Renomear Lead para leads
      console.log("\n🔄 Renomeando 'Lead' para 'leads'...");
      await db.execute(sql`ALTER TABLE "Lead" RENAME TO leads`);
      console.log("✅ Tabela renomeada com sucesso!");
    } else {
      // Criar tabela leads do zero
      console.log("\n🔄 Criando tabela 'leads'...");

      // Criar enum se não existir
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
          assigned_to VARCHAR REFERENCES "Admin"(id),
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
      console.log("✅ Tabela 'leads' criada!");
    }

    // Adicionar coluna last_active_at na tabela User se não existir
    console.log("\n🔄 Verificando coluna last_active_at na tabela User...");
    await db.execute(sql`
      ALTER TABLE "User"
      ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP
    `);
    console.log("✅ Coluna last_active_at adicionada/verificada!");

    // Verificar estrutura final
    const cols = await db.execute(sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'leads'
      ORDER BY ordinal_position
    `) as any[];

    console.log("\n📋 Estrutura da tabela leads:");
    for (const col of cols) {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    }

    console.log("\n✅ Migration concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro na migration:", error);
  }

  process.exit(0);
}

migrate();
