import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

/**
 * Migration: Criar tabela Mnemonic
 *
 * Armazena mnemônicos e macetes vinculados a subjects,
 * com keywords para match dinâmico com conteúdos.
 */
async function migrate() {
  console.log("🔄 Iniciando migration: Tabela Mnemonic...\n");

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "Mnemonic" (
        "id" VARCHAR(30) PRIMARY KEY,
        "subjectId" VARCHAR(100) NOT NULL,
        "mnemonic" VARCHAR(100) NOT NULL,
        "title" VARCHAR(200) NOT NULL,
        "meaning" TEXT NOT NULL,
        "article" VARCHAR(50),
        "keywords" TEXT NOT NULL DEFAULT '[]',
        "category" VARCHAR(30) NOT NULL DEFAULT 'mnemonico',
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "fk_mnemonic_subject" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE
      )
    `);
    console.log("✅ Tabela Mnemonic criada");

    // Índices
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "idx_mnemonic_subject" ON "Mnemonic"("subjectId")
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "idx_mnemonic_active" ON "Mnemonic"("isActive")
    `);
    console.log("✅ Índices criados");

    // Verificar
    const cols = await db.execute(sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'Mnemonic'
      ORDER BY ordinal_position
    `) as any[];

    console.log("\n📋 Colunas da tabela Mnemonic:");
    for (const col of cols) {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    }

    console.log("\n✅ Migration concluída!");
  } catch (error) {
    console.error("❌ Erro:", error);
  }

  process.exit(0);
}

migrate();
