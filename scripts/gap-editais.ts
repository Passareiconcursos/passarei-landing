/**
 * scripts/gap-editais.ts
 *
 * DIAGNÓSTICO DE COBERTURA DE EDITAIS
 * ------------------------------------
 * Para cada concurso no banco, lê lista_materias_json e verifica
 * quantos átomos de conteúdo (Content) e questões (Question) existem
 * por matéria do edital.
 *
 * Saída: relatório com gaps ordenados por gravidade (w3 sem cobertura = crítico).
 *
 * Uso: npx tsx scripts/gap-editais.ts
 */

import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

// Mesma lógica de normalização do stats endpoint
function toCode(s: string): string {
  return s
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/[^A-Z0-9_]/g, "");
}

// Aliases: nome do edital → nome do Subject no banco
const ALIASES: Record<string, string> = {
  LINGUA_PORTUGUESA:               "PORTUGUES",
  NOCOES_DE_DIREITO_ADMINISTRATIVO:"DIREITO_ADMINISTRATIVO",
  NOCOES_DE_INFORMATICA:           "INFORMATICA",
  NOCOES_DE_INFORMATICA_:          "INFORMATICA",
  MATEMATICA_E_RACIOCINIO_LOGICO:  "MATEMATICA",
  NOCOES_DE_LOGICA:                "RACIOCINIO_LOGICO",
  NOCOES_DE_DIREITO:               "DIREITO_PENAL",           // fallback genérico
  LEGISLACAO_ESPECIAL:             "LEGISLACAO_ESPECIAL",
  DIREITO_CONSTITUCIONAL:          "DIR_CONSTITUCIONAL",
  DIREITO_PROCESSUAL_PENAL:        "PROCESSUAL_PENAL",
  LEGISLACAO_INSTITUCIONAL_PP:     "LEGISLACAO_ESPECIAL",
  LEGISLACAO_INSTITUCIONAL_PC:     "LEGISLACAO_ESPECIAL",
  LEGISLACAO_INSTITUCIONAL_PM:     "LEGISLACAO_ESPECIAL",
  LEGISLACAO_ESPECIFICA_GM:        "LEGISLACAO_ESPECIAL",
  LEGISLACAO_ESPECIFICA_CNJ:       "LEGISLACAO_ESPECIAL",
  LEGISLACAO_ESPECIFICA_PORTO:     "LEGISLACAO_ESPECIAL",
  LEGISLACAO_PORTUARIA:            "LEGISLACAO_ESPECIAL",
  LEGISLACAO_GERAL:                "LEGISLACAO_ESPECIAL",
  CRIMINOLOGIA:                    "CRIMINOLOGIA",
  NOCOES_DE_CRIMINOLOGIA:          "CRIMINOLOGIA",
  CRIMINALISTICA:                  "CRIMINALISTICA",
  MEDICINA_LEGAL:                  "MEDICINA_LEGAL",
  MEDICINA_E_ODONTOLOGIA_LEGAL:    "MEDICINA_LEGAL",
  NOCOES_DE_MEDICINA_E_ODONTOLOGIA_LEGAL: "MEDICINA_LEGAL",
  NOCOES_DE_IDENTIFICACAO:         "PAPILOSCOPIA",
  PAPILOSCOPIA:                    "PAPILOSCOPIA",
  RACIOCINIO_LOGICO_E_ESTATISTICA: "RACIOCINIO_LOGICO",
  CONHECIMENTOS_GERAIS_E_ATUALIDADES: "ATUALIDADES",
  ATUALIDADES:                     "ATUALIDADES",
  ATIVIDADE_DE_INTELIGENCIA_E_LEGISLACAO: "INTELIGENCIA",
  ATIVIDADE_DE_INTELIGENCIA:       "INTELIGENCIA",
  DIREITO_PENAL_E_PROCESSUAL_PENAL:"DIREITO_PENAL",
  CRIMINOLOGIA_E_CRIMINALISTICA:   "CRIMINALISTICA",
  NOCOES_DE_BIOLOGIA:              "BIOLOGIA",
  EXECUCAO_PENAL:                  "LEGISLACAO_ESPECIAL",
  LEGISLACAO_E_REGULAMENTACAO_DEPEN: "LEGISLACAO_ESPECIAL",
};

async function findSubject(materia: string): Promise<{ id: string; name: string } | null> {
  // 1) busca direta por ILIKE
  let rows = await sql`
    SELECT id, name FROM "Subject"
    WHERE name ILIKE ${"%" + materia + "%"}
    LIMIT 1
  `;
  if (rows[0]) return rows[0] as any;

  // 2) tenta alias
  const code = toCode(materia);
  const aliased = ALIASES[code];
  if (aliased) {
    rows = await sql`
      SELECT id, name FROM "Subject"
      WHERE name ILIKE ${"%" + aliased + "%"}
      LIMIT 1
    `;
    if (rows[0]) return rows[0] as any;
  }

  // 3) tenta código direto sem alias
  rows = await sql`
    SELECT id, name FROM "Subject"
    WHERE name ILIKE ${"%" + code + "%"}
    LIMIT 1
  `;
  if (rows[0]) return rows[0] as any;

  return null;
}

async function countContent(subjectId: string): Promise<{ atoms: number; questions: number }> {
  const [atomRows, qRows] = await Promise.all([
    sql`SELECT COUNT(*)::int AS n FROM "Content" WHERE "subjectId" = ${subjectId}`,
    sql`SELECT COUNT(*)::int AS n FROM "Question" WHERE "subjectId" = ${subjectId}`,
  ]);
  return {
    atoms:     Number(atomRows[0]?.n ?? 0),
    questions: Number(qRows[0]?.n ?? 0),
  };
}

async function main() {
  console.log("🔍 GAP REPORT — Cobertura de Editais vs Conteúdo do Banco\n");
  console.log("=".repeat(72));

  // Busca todos os concursos com edital mapeado
  const concursos = await sql`
    SELECT id, sigla, nome, lista_materias_json
    FROM concursos
    WHERE lista_materias_json IS NOT NULL
      AND lista_materias_json != '[]'::jsonb
    ORDER BY esfera, sigla
  `;

  console.log(`📋 Total de concursos com edital: ${concursos.length}\n`);

  // Acumula gaps críticos para o resumo final
  const critical: { concurso: string; materia: string; weight: number }[] = [];
  const warnings: { concurso: string; materia: string; weight: number; atoms: number; questions: number }[] = [];

  for (const c of concursos) {
    const raw = c.lista_materias_json;
    const materias: { name: string; weight: number; questions: number }[] =
      Array.isArray(raw) ? raw : JSON.parse(raw as string);

    // Filtra só matérias com peso >= 2 (relevantes) para o relatório
    const relevantes = materias.filter(m => m.weight >= 1);

    console.log(`\n── ${c.sigla.padEnd(12)} ${c.nome}`);
    console.log(`   ${"MATÉRIA".padEnd(40)} W  ÁTOMOS  QUESTÕES  STATUS`);
    console.log("   " + "-".repeat(68));

    for (const m of relevantes) {
      const subject = await findSubject(m.name);

      if (!subject) {
        const status = m.weight === 3 ? "❌ CRÍTICO — sem Subject no banco"
                     : m.weight === 2 ? "⚠️  sem Subject"
                     : "➖ sem Subject";
        console.log(`   ${m.name.substring(0, 39).padEnd(40)} ${m.weight}  ${"-".padStart(6)}  ${"-".padStart(8)}  ${status}`);
        if (m.weight >= 2) critical.push({ concurso: c.sigla, materia: m.name, weight: m.weight });
        continue;
      }

      const { atoms, questions } = await countContent(subject.id);
      const status = atoms === 0 && m.weight === 3 ? "❌ CRÍTICO — 0 átomos"
                   : atoms === 0 && m.weight === 2 ? "⚠️  0 átomos"
                   : atoms === 0                   ? "➖ 0 átomos"
                   : atoms < 3                     ? "🔶 poucos átomos"
                   : "✅";

      console.log(
        `   ${m.name.substring(0, 39).padEnd(40)} ${m.weight}  ${String(atoms).padStart(6)}  ${String(questions).padStart(8)}  ${status}`
      );

      if (atoms === 0) {
        if (m.weight >= 2) critical.push({ concurso: c.sigla, materia: m.name, weight: m.weight });
      } else if (atoms < 3 && m.weight >= 2) {
        warnings.push({ concurso: c.sigla, materia: m.name, weight: m.weight, atoms, questions });
      }
    }
  }

  // ── RESUMO FINAL ─────────────────────────────────────────────────────────
  console.log("\n\n" + "=".repeat(72));
  console.log("📊 RESUMO — GAPS CRÍTICOS (weight ≥ 2, átomos = 0 ou sem Subject)");
  console.log("=".repeat(72));

  if (critical.length === 0) {
    console.log("✅ Nenhum gap crítico! Todos os subjects w2/w3 têm conteúdo.");
  } else {
    // Agrupa por matéria para ver quais afetam mais concursos
    const grouped: Record<string, { weight: number; concursos: string[] }> = {};
    for (const g of critical) {
      const key = g.materia;
      if (!grouped[key]) grouped[key] = { weight: g.weight, concursos: [] };
      if (grouped[key].weight < g.weight) grouped[key].weight = g.weight;
      grouped[key].concursos.push(g.concurso);
    }

    // Ordena: weight desc, depois por quantidade de concursos afetados desc
    const sorted = Object.entries(grouped).sort(([, a], [, b]) => {
      if (b.weight !== a.weight) return b.weight - a.weight;
      return b.concursos.length - a.concursos.length;
    });

    console.log(`\n${"MATÉRIA".padEnd(42)} W  CONCURSOS AFETADOS`);
    console.log("-".repeat(72));
    for (const [materia, info] of sorted) {
      const tag = info.weight === 3 ? "❌" : "⚠️ ";
      console.log(
        `${tag} ${materia.substring(0, 40).padEnd(41)} ${info.weight}  ${info.concursos.join(", ")}`
      );
    }
  }

  if (warnings.length > 0) {
    console.log("\n\n📌 ATENÇÃO — Poucos átomos (w2/w3 com < 3 átomos):");
    for (const w of warnings) {
      console.log(`   ⚠️  [${w.concurso}] ${w.materia} — ${w.atoms} átomo(s), ${w.questions} questão(ões)`);
    }
  }

  console.log("\n" + "=".repeat(72));
  console.log("✅ GAP REPORT concluído.");
  await sql.end();
  process.exit(0);
}

main().catch(err => {
  console.error("❌ Erro:", err.message);
  sql.end();
  process.exit(1);
});
