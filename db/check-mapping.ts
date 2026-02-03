/**
 * Script de diagnóstico: Verifica mapeamento cargo_materias.nome x Subject.displayName
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

async function checkMapping() {
  console.log("=".repeat(60));
  console.log("DIAGNÓSTICO: Mapeamento cargo_materias x Subject");
  console.log("=".repeat(60));

  // 1. Listar todos os Subject.displayName existentes
  const subjects = await db.execute(sql`
    SELECT id, name, "displayName", category
    FROM "Subject"
    ORDER BY category, "displayName"
  `) as any[];

  console.log(`\n📚 SUBJECTS NO BANCO (${subjects.length}):\n`);
  const subjectDisplayNames = new Set<string>();
  subjects.forEach((s: any) => {
    console.log(`   [${s.category}] ${s.displayName} (name: ${s.name})`);
    subjectDisplayNames.add(s.displayName);
  });

  // 2. Listar todas as matérias de cargo_materias
  const cargoMaterias = await db.execute(sql`
    SELECT DISTINCT cm.nome, cm.codigo, c.nome as cargo_nome, co.sigla as concurso
    FROM cargo_materias cm
    JOIN cargos c ON cm.cargo_id = c.id
    JOIN concursos co ON c.concurso_id = co.id
    WHERE cm.is_active = true
    ORDER BY co.sigla, c.nome, cm.nome
  `) as any[];

  console.log(`\n📋 MATÉRIAS EM cargo_materias (${cargoMaterias.length}):\n`);

  const materiasNomes = new Set<string>();
  let currentConcurso = "";
  cargoMaterias.forEach((m: any) => {
    if (m.concurso !== currentConcurso) {
      currentConcurso = m.concurso;
      console.log(`\n   === ${m.concurso} ===`);
    }
    console.log(`   - ${m.nome} (cargo: ${m.cargo_nome})`);
    materiasNomes.add(m.nome);
  });

  // 3. Verificar quais matérias NÃO têm correspondência em Subject
  console.log("\n" + "=".repeat(60));
  console.log("❌ MATÉRIAS SEM CORRESPONDÊNCIA EM Subject:");
  console.log("=".repeat(60));

  const semMatch: string[] = [];
  materiasNomes.forEach((nome) => {
    if (!subjectDisplayNames.has(nome)) {
      semMatch.push(nome);
      console.log(`   ⚠️  "${nome}" não encontrado em Subject.displayName`);
    }
  });

  if (semMatch.length === 0) {
    console.log("   ✅ Todas as matérias têm correspondência!");
  }

  // 4. Verificar quais Subjects NÃO têm matérias associadas
  console.log("\n" + "=".repeat(60));
  console.log("📌 SUBJECTS SEM MATÉRIAS EM cargo_materias:");
  console.log("=".repeat(60));

  const subjectsSemMateria: string[] = [];
  subjectDisplayNames.forEach((displayName) => {
    if (!materiasNomes.has(displayName)) {
      subjectsSemMateria.push(displayName);
      console.log(`   📌 "${displayName}" existe em Subject mas não em cargo_materias`);
    }
  });

  if (subjectsSemMateria.length === 0) {
    console.log("   ✅ Todos os Subjects têm matérias associadas!");
  }

  // 5. Resumo
  console.log("\n" + "=".repeat(60));
  console.log("📊 RESUMO:");
  console.log("=".repeat(60));
  console.log(`   Total Subjects: ${subjects.length}`);
  console.log(`   Total Matérias únicas em cargo_materias: ${materiasNomes.size}`);
  console.log(`   Matérias SEM match em Subject: ${semMatch.length}`);
  console.log(`   Subjects SEM matérias associadas: ${subjectsSemMateria.length}`);

  if (semMatch.length > 0) {
    console.log("\n⚠️  AÇÃO NECESSÁRIA:");
    console.log("   As matérias sem match precisam ser criadas em Subject");
    console.log("   ou renomeadas em cargo_materias para corresponder ao displayName existente.");
  }

  process.exit(0);
}

checkMapping().catch((e) => {
  console.error("Erro:", e);
  process.exit(1);
});
