/**
 * Auditoria completa: materias, conteudos e questoes
 * Uso: DATABASE_URL="..." npx tsx scripts/audit-content-subjects.ts
 */
import { db } from "../db/index";
import { sql } from "drizzle-orm";

async function audit() {
  console.log("=== AUDITORIA DE CONTEUDO PASSAREI ===\n");

  // 1. Total geral
  const totals = await db.execute(sql`
    SELECT
      (SELECT COUNT(*) FROM "Subject" WHERE "isActive" = true) as subjects,
      (SELECT COUNT(*) FROM "Content" WHERE "isActive" = true) as contents,
      (SELECT COUNT(*) FROM "Question" WHERE "isActive" = true) as questions
  `) as any[];
  console.log(`TOTAIS: ${totals[0].subjects} materias | ${totals[0].contents} conteudos | ${totals[0].questions} questoes\n`);

  // 2. Materias com contagem de conteudos e questoes
  console.log("=== MATERIAS COM CONTEUDOS E QUESTOES ===\n");
  const subjects = await db.execute(sql`
    SELECT
      s."displayName" as materia,
      s.category,
      COUNT(DISTINCT c.id) as conteudos,
      COUNT(DISTINCT q.id) as questoes
    FROM "Subject" s
    LEFT JOIN "Content" c ON c."subjectId" = s.id AND c."isActive" = true
    LEFT JOIN "Question" q ON q."subjectId" = s.id AND q."isActive" = true
    WHERE s."isActive" = true
    GROUP BY s.id, s."displayName", s.category
    ORDER BY s.category, conteudos DESC
  `) as any[];

  let currentCat = "";
  for (const row of subjects) {
    if (row.category !== currentCat) {
      currentCat = row.category;
      console.log(`\n[${currentCat}]`);
    }
    const qMark = parseInt(row.questoes) === 0 ? " << SEM QUESTOES" : "";
    const cMark = parseInt(row.conteudos) === 0 ? " << SEM CONTEUDO" : "";
    console.log(`   ${row.materia}: ${row.conteudos} conteudos, ${row.questoes} questoes${qMark}${cMark}`);
  }

  // 3. Qualidade dos conteudos
  console.log("\n\n=== QUALIDADE DO CONTEUDO ===\n");
  const contentQuality = await db.execute(sql`
    SELECT
      COUNT(*) as total,
      COUNT(CASE WHEN "textContent" LIKE '%PONTOS-CHAVE:%' THEN 1 END) as enriquecidos,
      COUNT(CASE WHEN "textContent" NOT LIKE '%PONTOS-CHAVE:%' THEN 1 END) as sem_secoes,
      COUNT(CASE WHEN LENGTH("textContent") < 200 THEN 1 END) as muito_curto,
      COUNT(CASE WHEN LENGTH("textContent") BETWEEN 200 AND 500 THEN 1 END) as curto,
      COUNT(CASE WHEN LENGTH("textContent") BETWEEN 501 AND 1500 THEN 1 END) as medio,
      COUNT(CASE WHEN LENGTH("textContent") > 1500 THEN 1 END) as longo,
      COUNT(CASE WHEN "reviewStatus" = 'APROVADO' THEN 1 END) as aprovados,
      COUNT(CASE WHEN "reviewStatus" = 'PENDENTE' THEN 1 END) as pendentes,
      COUNT(CASE WHEN "reviewStatus" = 'REJEITADO' THEN 1 END) as rejeitados,
      COUNT(CASE WHEN "reviewStatus" IS NULL THEN 1 END) as sem_review
    FROM "Content"
    WHERE "isActive" = true
  `) as any[];

  const cq = contentQuality[0];
  console.log(`Total ativos: ${cq.total}`);
  console.log(`Enriquecidos (PONTOS-CHAVE): ${cq.enriquecidos}`);
  console.log(`Sem secoes estruturadas: ${cq.sem_secoes}`);
  console.log(`\nPor tamanho:`);
  console.log(`  Muito curto (<200 chars): ${cq.muito_curto}`);
  console.log(`  Curto (200-500 chars): ${cq.curto}`);
  console.log(`  Medio (500-1500 chars): ${cq.medio}`);
  console.log(`  Longo (>1500 chars): ${cq.longo}`);
  console.log(`\nReview status:`);
  console.log(`  Aprovados: ${cq.aprovados}`);
  console.log(`  Pendentes: ${cq.pendentes}`);
  console.log(`  Rejeitados: ${cq.rejeitados}`);
  console.log(`  Sem review: ${cq.sem_review}`);

  // 4. Qualidade das questoes
  console.log("\n=== QUALIDADE DAS QUESTOES ===\n");
  const qStats = await db.execute(sql`
    SELECT
      COUNT(*) as total,
      COUNT(CASE WHEN alternatives IS NOT NULL AND alternatives::text != '[]' AND alternatives::text != '' THEN 1 END) as com_alternativas,
      COUNT(CASE WHEN "correctAnswer" IS NOT NULL AND "correctAnswer" != '' THEN 1 END) as com_gabarito,
      COUNT(CASE WHEN explanation IS NOT NULL AND explanation != '' THEN 1 END) as com_explicacao,
      COUNT(CASE WHEN "reviewStatus" = 'APROVADO' THEN 1 END) as aprovadas,
      COUNT(CASE WHEN "reviewStatus" = 'PENDENTE' THEN 1 END) as pendentes,
      COUNT(CASE WHEN "reviewStatus" = 'REJEITADO' THEN 1 END) as rejeitadas,
      COUNT(CASE WHEN "reviewStatus" IS NULL THEN 1 END) as sem_review
    FROM "Question"
    WHERE "isActive" = true
  `) as any[];

  const qs = qStats[0];
  console.log(`Total ativas: ${qs.total}`);
  console.log(`Com alternativas: ${qs.com_alternativas}`);
  console.log(`Com gabarito: ${qs.com_gabarito}`);
  console.log(`Com explicacao: ${qs.com_explicacao}`);
  console.log(`\nReview status:`);
  console.log(`  Aprovadas: ${qs.aprovadas}`);
  console.log(`  Pendentes: ${qs.pendentes}`);
  console.log(`  Rejeitadas: ${qs.rejeitadas}`);
  console.log(`  Sem review: ${qs.sem_review}`);

  // 5. Conteudos sem questao (por subject)
  const orphans = await db.execute(sql`
    SELECT COUNT(*) as total
    FROM "Content" c
    WHERE c."isActive" = true
      AND NOT EXISTS (
        SELECT 1 FROM "Question" q
        WHERE q."subjectId" = c."subjectId"
          AND q."isActive" = true
      )
  `) as any[];
  console.log(`\nConteudos cujo subject nao tem questao: ${orphans[0].total}`);

  // 6. Questoes com alternativas quebradas
  const broken = await db.execute(sql`
    SELECT COUNT(*) as total
    FROM "Question"
    WHERE "isActive" = true
      AND (
        alternatives IS NULL
        OR alternatives::text = '[]'
        OR alternatives::text = ''
        OR alternatives::text LIKE '%undefined%'
      )
  `) as any[];
  console.log(`Questoes com alternativas quebradas: ${broken[0].total}`);

  // 7. Questoes por materia
  console.log("\n=== QUESTOES POR MATERIA ===\n");
  const qBySubject = await db.execute(sql`
    SELECT
      s."displayName" as materia,
      COUNT(q.id) as questoes,
      COUNT(CASE WHEN q."reviewStatus" = 'APROVADO' THEN 1 END) as aprovadas,
      COUNT(CASE WHEN q."reviewStatus" = 'PENDENTE' THEN 1 END) as pendentes
    FROM "Question" q
    JOIN "Subject" s ON q."subjectId" = s.id
    WHERE q."isActive" = true
    GROUP BY s.id, s."displayName"
    ORDER BY questoes DESC
  `) as any[];

  for (const row of qBySubject) {
    console.log(`   ${row.materia}: ${row.questoes} (${row.aprovadas} aprovadas, ${row.pendentes} pendentes)`);
  }

  process.exit(0);
}

audit().catch(console.error);
