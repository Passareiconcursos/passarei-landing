/**
 * scripts/check-density.ts
 * Diagnóstico de Densidade — Relatório de Questões por Conteúdo
 *
 * Execução: npx tsx scripts/check-density.ts
 *
 * Saída: relatório por Matéria com contagem de questões por conteúdo,
 *        alertas de conteúdos críticos (< 5 questões) e resumo final.
 */

import { db } from "../db/index";
import { sql } from "drizzle-orm";

// Limites de classificação
const CRITICO = 5;   // < 5 questões
const BAIXO   = 10;  // < 10 questões

async function main() {
  console.log("\n========================================================");
  console.log("  PASSAREI — DIAGNÓSTICO DE DENSIDADE DO BANCO");
  console.log("========================================================\n");

  // ── 1. Buscar todos os Subjects ──────────────────────────────────────────
  const subjects = (await db.execute(sql`
    SELECT id, name
    FROM "Subject"
    ORDER BY name
  `)) as any[];

  if (!subjects.length) {
    console.error("❌ Nenhum Subject encontrado no banco.");
    process.exit(1);
  }

  // ── 2. Para cada Subject, buscar seus Contents com contagem de Questions ─
  let totalContents   = 0;
  let totalCritico    = 0;
  let totalBaixo      = 0;
  let totalOk         = 0;
  let totalQuestoes   = 0;

  // Acumular linhas críticas para exibir resumo ao final
  const criticos: { subject: string; id: string; title: string; count: number }[] = [];

  for (const subject of subjects) {
    const rows = (await db.execute(sql`
      SELECT
        c.id,
        c.title,
        COUNT(q.id)::int AS question_count
      FROM "Content" c
      LEFT JOIN "Question" q
        ON q."contentId" = c.id
      WHERE c."subjectId" = ${subject.id}
        AND c."isActive" = true
      GROUP BY c.id, c.title
      ORDER BY question_count ASC, c.title ASC
    `)) as any[];

    if (!rows.length) continue; // Matéria sem conteúdos — pular

    // ── Cabeçalho da matéria ──────────────────────────────────────────────
    const matCount  = rows.length;
    const matQ      = rows.reduce((acc: number, r: any) => acc + Number(r.question_count), 0);
    const matAvg    = matQ / matCount;
    const matCrit   = rows.filter((r: any) => Number(r.question_count) < CRITICO).length;

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📚  ${subject.name.toUpperCase()}`);
    console.log(`    ${matCount} conteúdos | ${matQ} questões | média ${matAvg.toFixed(1)} q/conteúdo | ${matCrit} críticos`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    for (const row of rows) {
      const count  = Number(row.question_count);
      const id     = row.id as string;
      const title  = row.title as string;

      let status: string;
      if (count < CRITICO) {
        status = "⚠️  CRÍTICO";
        totalCritico++;
        criticos.push({ subject: subject.name, id, title, count });
      } else if (count < BAIXO) {
        status = "🔶 BAIXO";
        totalBaixo++;
      } else {
        status = "✅ OK";
        totalOk++;
      }

      // Formatar linha de conteúdo
      const idFormatted    = `[${id}]`.padEnd(24);
      const countFormatted = `${count} questão${count !== 1 ? "ões" : ""}`.padStart(14);
      console.log(`  ${idFormatted} ${title.substring(0, 48).padEnd(48)} ${countFormatted}  ${status}`);

      totalQuestoes += count;
    }

    totalContents += matCount;
  }

  // ── 3. Resumo global ─────────────────────────────────────────────────────
  const avgGlobal = totalContents > 0 ? (totalQuestoes / totalContents).toFixed(2) : "0";

  console.log("\n\n========================================================");
  console.log("  RESUMO GLOBAL");
  console.log("========================================================");
  console.log(`  Total de matérias       : ${subjects.length}`);
  console.log(`  Total de conteúdos      : ${totalContents}`);
  console.log(`  Total de questões       : ${totalQuestoes}`);
  console.log(`  Média global            : ${avgGlobal} questões/conteúdo`);
  console.log(`  ✅ OK (≥ 10 questões)   : ${totalOk}`);
  console.log(`  🔶 BAIXO (5–9)          : ${totalBaixo}`);
  console.log(`  ⚠️  CRÍTICO (< 5)       : ${totalCritico}`);
  console.log("========================================================\n");

  // ── 4. Lista consolidada de críticos ─────────────────────────────────────
  if (criticos.length > 0) {
    console.log("⚠️  CONTEÚDOS CRÍTICOS — AÇÃO IMEDIATA NECESSÁRIA\n");
    console.log("  Copie os IDs abaixo e solicite seeds de densificação:\n");

    let currentSubject = "";
    for (const c of criticos.sort((a, b) => a.subject.localeCompare(b.subject) || a.count - b.count)) {
      if (c.subject !== currentSubject) {
        currentSubject = c.subject;
        console.log(`  📚 ${c.subject}`);
      }
      const badge = c.count === 0 ? "🔴 SEM QUESTÕES" : `⚠️  ${c.count} questão${c.count !== 1 ? "ões" : ""}`;
      console.log(`     [${c.id}] ${c.title.substring(0, 55)} — ${badge}`);
    }

    console.log(`\n  Total de conteúdos críticos: ${totalCritico}`);
    console.log("  Meta: cada conteúdo deve ter ≥ 5 questões (ideal: 10–15)\n");
  } else {
    console.log("🎉 Nenhum conteúdo crítico encontrado! Banco com boa densidade.\n");
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ ERRO no check-density:", err.message ?? err);
  process.exit(1);
});
