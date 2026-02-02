import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

/**
 * Migration: Adicionar colunas de drip campaign na tabela Lead
 *
 * Rastreia qual email da sequência cada lead já recebeu
 */
async function migrate() {
  console.log("🔄 Iniciando migration: Drip Campaign...\n");

  try {
    // Email 1: Boas-vindas (imediato)
    await db.execute(sql`
      ALTER TABLE "Lead"
      ADD COLUMN IF NOT EXISTS "dripEmail1SentAt" TIMESTAMP
    `);
    console.log("✅ Coluna dripEmail1SentAt adicionada");

    // Email 2: Educativo (+7 dias)
    await db.execute(sql`
      ALTER TABLE "Lead"
      ADD COLUMN IF NOT EXISTS "dripEmail2SentAt" TIMESTAMP
    `);
    console.log("✅ Coluna dripEmail2SentAt adicionada");

    // Email 3: Social proof + oferta (+14 dias)
    await db.execute(sql`
      ALTER TABLE "Lead"
      ADD COLUMN IF NOT EXISTS "dripEmail3SentAt" TIMESTAMP
    `);
    console.log("✅ Coluna dripEmail3SentAt adicionada");

    // Email 4: Última chance (+21 dias)
    await db.execute(sql`
      ALTER TABLE "Lead"
      ADD COLUMN IF NOT EXISTS "dripEmail4SentAt" TIMESTAMP
    `);
    console.log("✅ Coluna dripEmail4SentAt adicionada");

    // Verificar
    const cols = await db.execute(sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'Lead'
        AND column_name LIKE 'dripEmail%'
      ORDER BY column_name
    `) as any[];

    console.log("\n📋 Colunas criadas:");
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
