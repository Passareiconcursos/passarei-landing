import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

async function fixNames() {
  console.log("=== CORREÇÃO 1: Alinhar nomes cargo_materias → Subject ===\n");

  const fixes = [
    { old: "Inglês", new: "Língua Inglesa" },
    { old: "Informática", new: "Noções de Informática" },
    { old: "Noções de Aviação", new: "Noções de Aviação Civil" },
  ];

  for (const fix of fixes) {
    const result = await db.execute(sql`
      UPDATE cargo_materias
      SET nome = ${fix.new}
      WHERE nome = ${fix.old}
      RETURNING id, nome, codigo
    `) as any[];

    console.log(`✅ "${fix.old}" → "${fix.new}" (${result.length} registros atualizados)`);
  }

  // Verificar que não sobrou nenhum mismatch
  console.log("\n=== VERIFICAÇÃO PÓS-CORREÇÃO ===");
  const remaining = await db.execute(sql`
    SELECT DISTINCT cm.nome
    FROM cargo_materias cm
    WHERE cm.is_active = true
      AND cm.nome NOT IN (
        SELECT "displayName" FROM "Subject" WHERE "isActive" = true
      )
  `) as any[];

  if (remaining.length === 0) {
    console.log("✅ Todos os nomes agora correspondem aos Subjects!");
  } else {
    console.log(`⚠️ Ainda há ${remaining.length} mismatches:`);
    remaining.forEach((r: any) => console.log(`   - "${r.nome}"`));
  }
}

fixNames()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  });
