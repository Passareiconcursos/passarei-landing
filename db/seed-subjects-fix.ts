/**
 * Seed: Infraestrutura — Criar Subjects Faltantes
 *
 * Cria (ou pula se já existirem) os subjects necessários para os seeds R16-R18+:
 *   - CONTABILIDADE_GERAL  (Contabilidade Geral — MATEMATICA — sortOrder 10)
 *   - ESTATISTICA          (Estatística — MATEMATICA — sortOrder 11)
 *   - MEDICINA_LEGAL       (Medicina Legal — ESPECIFICAS — sortOrder 3)
 *   - LEGISLACAO_ESPECIAL  (Legislação Especial — DIREITO — sortOrder 8)
 *
 * Totalmente idempotente: verifica existência pelo campo `name` antes de inserir.
 * Categorias válidas: CIENCIAS_HUMANAS | CIENCIAS_NATUREZA | CONHECIMENTOS_GERAIS |
 *                     DIREITO | ESPECIFICAS | INFORMATICA | LINGUAGENS | MATEMATICA
 *
 * Execução:
 *   npx tsx db/seed-subjects-fix.ts
 */

import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";
import { randomBytes } from "crypto";

// ============================================
// HELPERS
// ============================================

function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = randomBytes(8).toString("hex");
  return `c${timestamp}${randomPart}`.slice(0, 25);
}

// ============================================
// SUBJECTS A CRIAR/GARANTIR
// ============================================

const SUBJECTS = [
  {
    name: "CONTABILIDADE_GERAL",
    displayName: "Contabilidade Geral",
    category: "MATEMATICA",
    sortOrder: 10,
  },
  {
    name: "ESTATISTICA",
    displayName: "Estatística",
    category: "MATEMATICA",
    sortOrder: 11,
  },
  {
    name: "MEDICINA_LEGAL",
    displayName: "Medicina Legal",
    category: "ESPECIFICAS",
    sortOrder: 3,
  },
  {
    name: "LEGISLACAO_ESPECIAL",
    displayName: "Legislação Especial",
    category: "DIREITO",
    sortOrder: 8,
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n🏗️  Seed Infra: Subjects Faltantes\n");

  let created = 0;
  let skipped = 0;

  for (const s of SUBJECTS) {
    const existing = await db.execute(sql`
      SELECT id FROM "Subject" WHERE name = ${s.name} LIMIT 1
    `) as any[];

    if (existing.length > 0) {
      console.log(`  ⏭  Subject já existe: ${s.name} (id: ${existing[0].id})`);
      skipped++;
      continue;
    }

    const newId = generateId();
    await db.execute(sql`
      INSERT INTO "Subject" (id, name, "displayName", category, "sortOrder", "isActive", "updatedAt")
      VALUES (${newId}, ${s.name}, ${s.displayName}, ${s.category}, ${s.sortOrder}, true, NOW())
    `);
    console.log(`  ✅ Subject criado: ${s.name} → displayName="${s.displayName}", category=${s.category} (id: ${newId})`);
    created++;
  }

  console.log("\n─────────────────────────────────────────");
  console.log(`📦 Subjects: ${created} criados, ${skipped} já existiam`);
  console.log("─────────────────────────────────────────\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed-subjects-fix falhou:", err);
  process.exit(1);
});
