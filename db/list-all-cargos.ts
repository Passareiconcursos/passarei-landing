import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

async function listCargos() {
  const result = await db.execute(sql`
    SELECT
      c.sigla as concurso_sigla,
      c.nome as concurso_nome,
      c.esfera,
      cg.codigo as cargo_codigo,
      cg.nome as cargo_nome,
      cg.escolaridade,
      COUNT(cm.id) as materias
    FROM concursos c
    LEFT JOIN cargos cg ON cg.concurso_id = c.id AND cg.is_active = true
    LEFT JOIN cargo_materias cm ON cm.cargo_id = cg.id AND cm.is_active = true
    WHERE c.is_active = true
    GROUP BY c.sigla, c.nome, c.esfera, c.ordem, cg.codigo, cg.nome, cg.escolaridade, cg.ordem
    ORDER BY c.ordem, c.sigla, cg.ordem, cg.nome
  `) as any[];

  let currentConcurso = '';
  for (const row of result) {
    if (row.concurso_sigla !== currentConcurso) {
      currentConcurso = row.concurso_sigla;
      console.log('');
      console.log('═'.repeat(60));
      console.log(`${row.concurso_sigla} - ${row.concurso_nome} (${row.esfera})`);
      console.log('═'.repeat(60));
    }
    if (row.cargo_codigo) {
      const esc = row.escolaridade ? ` [${row.escolaridade}]` : '';
      console.log(`  • ${row.cargo_codigo}: ${row.cargo_nome}${esc} (${row.materias} matérias)`);
    }
  }

  // Totais
  const totals = await db.execute(sql`
    SELECT
      (SELECT COUNT(*) FROM concursos WHERE is_active = true) as concursos,
      (SELECT COUNT(*) FROM cargos WHERE is_active = true) as cargos,
      (SELECT COUNT(*) FROM cargo_materias WHERE is_active = true) as materias
  `) as any[];

  console.log('');
  console.log('═'.repeat(60));
  console.log('TOTAIS');
  console.log('═'.repeat(60));
  console.log(`Concursos: ${totals[0].concursos}`);
  console.log(`Cargos: ${totals[0].cargos}`);
  console.log(`Matérias: ${totals[0].materias}`);

  process.exit(0);
}

listCargos().catch(e => {
  console.error("Erro:", e.message);
  process.exit(1);
});
