/**
 * Reset questões rejeitadas para re-revisão com prompt corrigido
 */
import { db } from "../db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("🔄 Resetando questões rejeitadas para re-revisão...");

  // Reset questões rejeitadas
  await db.execute(sql`
    UPDATE "Question"
    SET "reviewStatus" = NULL, "reviewScore" = NULL, "reviewNotes" = NULL, "reviewedAt" = NULL
    WHERE "reviewStatus" = 'REJEITADO'
  `);

  console.log("✅ Questões rejeitadas resetadas");

  // Stats
  const stats = await db.execute(sql`
    SELECT
      (SELECT COUNT(*) FROM "Content" WHERE "reviewStatus" = 'APROVADO') as c_ok,
      (SELECT COUNT(*) FROM "Content" WHERE "reviewStatus" = 'REJEITADO') as c_rej,
      (SELECT COUNT(*) FROM "Content" WHERE "reviewStatus" IS NULL OR "reviewStatus" = 'PENDENTE') as c_pend,
      (SELECT COUNT(*) FROM "Question" WHERE "reviewStatus" = 'APROVADO') as q_ok,
      (SELECT COUNT(*) FROM "Question" WHERE "reviewStatus" = 'REJEITADO') as q_rej,
      (SELECT COUNT(*) FROM "Question" WHERE "reviewStatus" IS NULL OR "reviewStatus" = 'PENDENTE') as q_pend
  `) as any[];

  const s = stats[0];
  console.log("\n📊 Status atual:");
  console.log(`  Conteúdos: ✅ ${s.c_ok} | ❌ ${s.c_rej} | ⏳ ${s.c_pend}`);
  console.log(`  Questões:  ✅ ${s.q_ok} | ❌ ${s.q_rej} | ⏳ ${s.q_pend}`);

  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
