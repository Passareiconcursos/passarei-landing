/**
 * Script de diagnóstico: Verifica quantidade de conteúdos e questões por Subject
 * Foco especial nas matérias usadas pela ABIN
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

async function checkContentQuestions() {
  console.log("=".repeat(70));
  console.log("DIAGNÓSTICO: Conteúdos e Questões por Subject");
  console.log("=".repeat(70));

  // 1. Buscar matérias da ABIN
  const abinMaterias = await db.execute(sql`
    SELECT DISTINCT cm.nome
    FROM cargo_materias cm
    JOIN cargos c ON cm.cargo_id = c.id
    JOIN concursos co ON c.concurso_id = co.id
    WHERE co.sigla = 'ABIN'
    AND cm.is_active = true
    ORDER BY cm.nome
  `) as any[];

  const materiasAbin = new Set(abinMaterias.map((m: any) => m.nome));
  console.log(`\n📋 Matérias da ABIN: ${materiasAbin.size}`);
  materiasAbin.forEach(m => console.log(`   - ${m}`));

  // 2. Buscar todos os Subjects com contagem de conteúdos e questões
  const stats = await db.execute(sql`
    SELECT
      s.id,
      s."displayName",
      s.category,
      (SELECT COUNT(*) FROM "Content" c WHERE c."subjectId" = s.id) as content_count,
      (SELECT COUNT(*) FROM "Question" q WHERE q."subjectId" = s.id) as question_count,
      (SELECT COUNT(*) FROM "Question" q WHERE q."subjectId" = s.id AND q."questionType" = 'MULTIPLA_ESCOLHA') as multiple_choice_count,
      (SELECT COUNT(*) FROM "Question" q WHERE q."subjectId" = s.id AND q."questionType" = 'CERTO_ERRADO') as certo_errado_count
    FROM "Subject" s
    ORDER BY s.category, s."displayName"
  `) as any[];

  console.log("\n" + "=".repeat(70));
  console.log("📊 ESTATÍSTICAS POR SUBJECT:");
  console.log("=".repeat(70));

  let totalContents = 0;
  let totalQuestions = 0;
  let subjectsSemConteudo: string[] = [];
  let subjectsSemQuestao: string[] = [];
  let abinSemConteudo: string[] = [];
  let abinSemQuestao: string[] = [];

  console.log("\n" + "-".repeat(70));
  console.log(` ${"Subject".padEnd(35)} | Conteúdos | Questões | ME | CE`);
  console.log(" (ME = Múltipla Escolha, CE = Certo/Errado)");
  console.log("-".repeat(70));

  stats.forEach((s: any) => {
    const contentCount = parseInt(s.content_count) || 0;
    const questionCount = parseInt(s.question_count) || 0;
    const mcCount = parseInt(s.multiple_choice_count) || 0;
    const ceCount = parseInt(s.certo_errado_count) || 0;
    const isAbin = materiasAbin.has(s.displayName);
    const marker = isAbin ? "🔵" : "  ";

    console.log(
      `${marker} ${s.displayName.padEnd(33)} | ${String(contentCount).padStart(9)} | ${String(questionCount).padStart(8)} | ${String(mcCount).padStart(2)} | ${String(ceCount).padStart(2)}`
    );

    totalContents += contentCount;
    totalQuestions += questionCount;

    if (contentCount === 0) {
      subjectsSemConteudo.push(s.displayName);
      if (isAbin) abinSemConteudo.push(s.displayName);
    }
    if (questionCount === 0) {
      subjectsSemQuestao.push(s.displayName);
      if (isAbin) abinSemQuestao.push(s.displayName);
    }
  });

  console.log("-".repeat(70));
  console.log(`   TOTAL: ${totalContents} conteúdos, ${totalQuestions} questões`);

  // 3. Resumo dos problemas
  console.log("\n" + "=".repeat(70));
  console.log("⚠️  PROBLEMAS IDENTIFICADOS:");
  console.log("=".repeat(70));

  if (abinSemConteudo.length > 0) {
    console.log(`\n❌ Matérias da ABIN SEM CONTEÚDO (${abinSemConteudo.length}):`);
    abinSemConteudo.forEach(m => console.log(`   - ${m}`));
  } else {
    console.log("\n✅ Todas as matérias da ABIN têm conteúdo!");
  }

  if (abinSemQuestao.length > 0) {
    console.log(`\n❌ Matérias da ABIN SEM QUESTÕES (${abinSemQuestao.length}):`);
    abinSemQuestao.forEach(m => console.log(`   - ${m}`));
  } else {
    console.log("✅ Todas as matérias da ABIN têm questões!");
  }

  // 4. Verificar se há conteúdos/questões que não estão linkados a nenhum Subject válido
  console.log("\n" + "=".repeat(70));
  console.log("🔍 VERIFICAÇÃO DE INTEGRIDADE:");
  console.log("=".repeat(70));

  const orphanContents = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM "Content" c
    WHERE c."subjectId" NOT IN (SELECT id FROM "Subject")
  `) as any[];

  const orphanQuestions = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM "Question" q
    WHERE q."subjectId" NOT IN (SELECT id FROM "Subject")
  `) as any[];

  const orphanContentCount = parseInt(orphanContents[0]?.count) || 0;
  const orphanQuestionCount = parseInt(orphanQuestions[0]?.count) || 0;

  if (orphanContentCount > 0) {
    console.log(`\n⚠️  ${orphanContentCount} conteúdos órfãos (subjectId inválido)`);
  } else {
    console.log("\n✅ Nenhum conteúdo órfão");
  }

  if (orphanQuestionCount > 0) {
    console.log(`⚠️  ${orphanQuestionCount} questões órfãs (subjectId inválido)`);
  } else {
    console.log("✅ Nenhuma questão órfã");
  }

  // 5. Resumo final
  console.log("\n" + "=".repeat(70));
  console.log("📋 RESUMO FINAL:");
  console.log("=".repeat(70));
  console.log(`   Total de Subjects: ${stats.length}`);
  console.log(`   Total de Conteúdos: ${totalContents}`);
  console.log(`   Total de Questões: ${totalQuestions}`);
  console.log(`   Matérias ABIN: ${materiasAbin.size}`);
  console.log(`   ABIN sem conteúdo: ${abinSemConteudo.length}`);
  console.log(`   ABIN sem questões: ${abinSemQuestao.length}`);

  process.exit(0);
}

checkContentQuestions().catch((e) => {
  console.error("Erro:", e);
  process.exit(1);
});
