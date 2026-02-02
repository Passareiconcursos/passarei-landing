import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

/**
 * Migration: Adicionar colunas para sistema de lembretes de estudo
 *
 * Novas colunas na tabela User:
 * - studySchedule: horário preferido (manha, tarde, noite, manha_tarde, tarde_noite)
 * - facilidades: JSON array de matérias que o aluno tem facilidade
 * - dificuldades: JSON array de matérias que o aluno tem dificuldade
 * - lastStudyContentIds: JSON array de IDs de conteúdos já estudados
 * - reminderEnabled: se lembretes estão ativados
 */
async function migrate() {
  console.log("🔄 Iniciando migration: Sistema de Lembretes...\n");

  try {
    // 1. studySchedule
    await db.execute(sql`
      ALTER TABLE "User"
      ADD COLUMN IF NOT EXISTS "studySchedule" VARCHAR(30)
    `);
    console.log("✅ Coluna studySchedule adicionada");

    // 2. facilidades (JSON array de strings)
    await db.execute(sql`
      ALTER TABLE "User"
      ADD COLUMN IF NOT EXISTS "facilidades" TEXT DEFAULT '[]'
    `);
    console.log("✅ Coluna facilidades adicionada");

    // 3. dificuldades (JSON array de strings)
    await db.execute(sql`
      ALTER TABLE "User"
      ADD COLUMN IF NOT EXISTS "dificuldades" TEXT DEFAULT '[]'
    `);
    console.log("✅ Coluna dificuldades adicionada");

    // 4. lastStudyContentIds (JSON array de content IDs já vistos)
    await db.execute(sql`
      ALTER TABLE "User"
      ADD COLUMN IF NOT EXISTS "lastStudyContentIds" TEXT DEFAULT '[]'
    `);
    console.log("✅ Coluna lastStudyContentIds adicionada");

    // 5. reminderEnabled
    await db.execute(sql`
      ALTER TABLE "User"
      ADD COLUMN IF NOT EXISTS "reminderEnabled" BOOLEAN DEFAULT true
    `);
    console.log("✅ Coluna reminderEnabled adicionada");

    // Verificar resultado
    const cols = await db.execute(sql`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'User'
        AND column_name IN ('studySchedule', 'facilidades', 'dificuldades', 'lastStudyContentIds', 'reminderEnabled')
      ORDER BY column_name
    `) as any[];

    console.log("\n📋 Colunas criadas:");
    for (const col of cols) {
      console.log(`  - ${col.column_name} (${col.data_type}) default: ${col.column_default || 'null'}`);
    }

    console.log("\n✅ Migration concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro na migration:", error);
  }

  process.exit(0);
}

migrate();
