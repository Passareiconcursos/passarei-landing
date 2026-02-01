import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

async function fixDupes() {
  console.log("=== CORREÇÃO 3: Limpar Subjects duplicados ===\n");

  // Definir qual manter e qual migrar
  const dupes = [
    {
      displayName: "Direito Administrativo",
      keepId: "direito_administrativo", // DIREITO_ADMINISTRATIVO - 10 conteúdos
      removeId: "cmichej6f0006rpiyqzrso6dc", // DIR_ADMINISTRATIVO - 5 conteúdos
    },
    {
      displayName: "Direito Constitucional",
      keepId: "cmichej6a0005rpiyxqjqmyzr", // DIR_CONSTITUCIONAL - 7 conteúdos
      removeId: "cmkub747c8ab72fecb5e921f5", // DIREITO_CONSTITUCIONAL - 0 conteúdos
    },
    {
      displayName: "Direito Penal",
      keepId: "direito_penal", // DIREITO_PENAL - 10 conteúdos
      removeId: "cmichej6m0007rpiyf4nkyj67", // DIR_PENAL - 8 conteúdos
    },
  ];

  for (const dupe of dupes) {
    console.log(`━━━ ${dupe.displayName} ━━━`);

    // Contar conteúdos a migrar
    const toMigrate = await db.execute(sql`
      SELECT COUNT(*)::int as total FROM "Content"
      WHERE "subjectId" = ${dupe.removeId}
    `) as any[];
    const count = toMigrate[0]?.total || 0;

    if (count > 0) {
      // Migrar conteúdos do duplicado para o principal
      await db.execute(sql`
        UPDATE "Content"
        SET "subjectId" = ${dupe.keepId}
        WHERE "subjectId" = ${dupe.removeId}
      `);
      console.log(`  ✅ ${count} conteúdos migrados para o Subject principal`);
    } else {
      console.log(`  ℹ️ Nenhum conteúdo para migrar`);
    }

    // Migrar SpacedReview se houver
    try {
      await db.execute(sql`
        UPDATE "SpacedReview"
        SET "contentId" = NULL
        WHERE "contentId" IN (
          SELECT id FROM "Content" WHERE "subjectId" = ${dupe.removeId}
        )
      `);
    } catch (e) {
      // Ignorar se não houver registros
    }

    // Desativar Subject duplicado
    await db.execute(sql`
      UPDATE "Subject"
      SET "isActive" = false
      WHERE "id" = ${dupe.removeId}
    `);
    console.log(`  ✅ Subject duplicado desativado (${dupe.removeId})`);

    // Verificar resultado
    const result = await db.execute(sql`
      SELECT COUNT(*)::int as total FROM "Content"
      WHERE "subjectId" = ${dupe.keepId}
    `) as any[];
    console.log(`  📊 Subject principal agora tem: ${result[0]?.total || 0} conteúdos\n`);
  }

  // Resumo final
  console.log("=== RESUMO ===");
  const activeSubjects = await db.execute(sql`
    SELECT COUNT(*)::int as total FROM "Subject" WHERE "isActive" = true
  `) as any[];
  const totalContents = await db.execute(sql`
    SELECT COUNT(*)::int as total FROM "Content" WHERE "isActive" = true
  `) as any[];
  console.log(`Subjects ativos: ${activeSubjects[0]?.total}`);
  console.log(`Conteúdos ativos: ${totalContents[0]?.total}`);
  console.log("\n✅ Duplicados limpos com sucesso!");
}

fixDupes()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  });
