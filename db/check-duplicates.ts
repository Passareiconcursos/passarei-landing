/**
 * Script de diagnóstico: Verifica Subjects duplicados e mapeamento
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

async function checkDuplicates() {
  console.log("=".repeat(70));
  console.log("DIAGNÓSTICO: Subjects Duplicados e Mapeamento");
  console.log("=".repeat(70));

  // 1. Listar todos os Subjects com displayName duplicado
  console.log("\n📋 SUBJECTS COM displayName DUPLICADO:\n");

  const subjects = await db.execute(sql`
    SELECT id, name, "displayName", category, "createdAt"
    FROM "Subject"
    WHERE "displayName" IN (
      SELECT "displayName"
      FROM "Subject"
      GROUP BY "displayName"
      HAVING COUNT(*) > 1
    )
    ORDER BY "displayName", "createdAt"
  `) as any[];

  if (subjects.length === 0) {
    console.log("   ✅ Nenhum Subject duplicado encontrado");
  } else {
    let currentName = "";
    subjects.forEach((s: any) => {
      if (s.displayName !== currentName) {
        currentName = s.displayName;
        console.log(`\n   📌 "${s.displayName}":`);
      }
      console.log(`      - ID: ${s.id}`);
      console.log(`        name: ${s.name}`);
      console.log(`        category: ${s.category}`);
      console.log(`        createdAt: ${s.createdAt}`);
    });
  }

  // 2. Para cada Subject duplicado, verificar conteúdos e questões
  console.log("\n" + "=".repeat(70));
  console.log("📊 CONTEÚDOS E QUESTÕES POR ID:");
  console.log("=".repeat(70));

  for (const s of subjects) {
    const contentCount = await db.execute(sql`
      SELECT COUNT(*) as count FROM "Content" WHERE "subjectId" = ${s.id}
    `) as any[];

    const questionCount = await db.execute(sql`
      SELECT COUNT(*) as count FROM "Question" WHERE "subjectId" = ${s.id}
    `) as any[];

    console.log(`\n   "${s.displayName}" (ID: ${s.id.substring(0,8)}...):`);
    console.log(`      Conteúdos: ${contentCount[0]?.count || 0}`);
    console.log(`      Questões: ${questionCount[0]?.count || 0}`);
  }

  // 3. Verificar qual ID está sendo referenciado em cargo_materias (via nome)
  console.log("\n" + "=".repeat(70));
  console.log("🔗 VERIFICAÇÃO DO FLUXO DE LOOKUP:");
  console.log("=".repeat(70));

  const abinMaterias = ["Direito Administrativo", "Direito Constitucional", "Direito Penal"];

  for (const materia of abinMaterias) {
    console.log(`\n   Matéria: "${materia}"`);

    // Simular lookup que o sistema faz
    const matchingSubjects = await db.execute(sql`
      SELECT id, name, "displayName"
      FROM "Subject"
      WHERE "displayName" = ${materia}
      ORDER BY "createdAt" ASC
    `) as any[];

    console.log(`      Subjects encontrados: ${matchingSubjects.length}`);
    matchingSubjects.forEach((s: any, i: number) => {
      console.log(`      [${i+1}] ID: ${s.id.substring(0,8)}... (name: ${s.name})`);
    });

    // O sistema provavelmente pega o primeiro - verificar conteúdo do primeiro
    if (matchingSubjects.length > 0) {
      const firstId = matchingSubjects[0].id;
      const content = await db.execute(sql`
        SELECT COUNT(*) as count FROM "Content" WHERE "subjectId" = ${firstId}
      `) as any[];
      console.log(`      ⚠️  O PRIMEIRO tem ${content[0]?.count || 0} conteúdos`);

      if (matchingSubjects.length > 1) {
        const secondId = matchingSubjects[1].id;
        const content2 = await db.execute(sql`
          SELECT COUNT(*) as count FROM "Content" WHERE "subjectId" = ${secondId}
        `) as any[];
        console.log(`      ⚠️  O SEGUNDO tem ${content2[0]?.count || 0} conteúdos`);
      }
    }
  }

  // 4. Verificar questões órfãs
  console.log("\n" + "=".repeat(70));
  console.log("🔍 QUESTÕES ÓRFÃS - ANÁLISE:");
  console.log("=".repeat(70));

  const orphanQuestions = await db.execute(sql`
    SELECT DISTINCT q."subjectId", COUNT(*) as count
    FROM "Question" q
    WHERE q."subjectId" NOT IN (SELECT id FROM "Subject")
    GROUP BY q."subjectId"
    ORDER BY count DESC
    LIMIT 10
  `) as any[];

  console.log(`\n   Top 10 subjectIds inválidos em Question:`);
  orphanQuestions.forEach((o: any) => {
    console.log(`      ${o.subjectId}: ${o.count} questões`);
  });

  // 5. Recomendação
  console.log("\n" + "=".repeat(70));
  console.log("💡 RECOMENDAÇÃO:");
  console.log("=".repeat(70));
  console.log(`
   O problema é que existem Subjects DUPLICADOS com o mesmo displayName.
   Quando o sistema faz lookup por displayName, pode pegar o Subject ERRADO
   (o que não tem conteúdo).

   SOLUÇÃO: Consolidar os Subjects duplicados:
   1. Manter apenas UM Subject por displayName (o que tem conteúdo)
   2. Atualizar todas as referências para o ID correto
   3. Deletar os Subjects vazios/duplicados
  `);

  process.exit(0);
}

checkDuplicates().catch((e) => {
  console.error("Erro:", e);
  process.exit(1);
});
