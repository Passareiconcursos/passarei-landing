/**
 * merge-editais.ts
 * Algoritmo de cruzamento de múltiplos editais estaduais para gerar
 * uma lista_materias_json unificada com pesos por frequência.
 *
 * Uso:
 *   1. Preencha o array EDITAIS abaixo com as matérias de cada edital
 *   2. npx tsx scripts/merge-editais.ts
 *   3. Cole o output no entry correspondente em db/auto-migrate.ts
 *
 * Lógica de weight:
 *   3 = aparece em TODOS os editais → universal, cobrar com prioridade
 *   2 = aparece em 2+ editais     → frequente, cobrar normalmente
 *   1 = aparece em apenas 1       → específico de um estado, cobrar como complemento
 */

// ─────────────────────────────────────────────────────────────────────────────
// MAPA DE NORMALIZAÇÃO
// Mapeia variações de nome para um nome canônico único.
// Adicione novas entradas conforme encontrar variações nos editais.
// ─────────────────────────────────────────────────────────────────────────────
const NORMALIZATION_MAP: Record<string, string> = {
  // Português
  "língua portuguesa":                              "Língua Portuguesa",
  "lingua portuguesa":                              "Língua Portuguesa",
  "português":                                      "Língua Portuguesa",
  "portugues":                                      "Língua Portuguesa",
  "língua portuguesa e redação":                    "Língua Portuguesa",
  "língua portuguesa / redação":                    "Língua Portuguesa",
  "português e redação":                            "Língua Portuguesa",

  // Matemática
  "matemática":                                     "Matemática",
  "matematica":                                     "Matemática",
  "matemática e raciocínio lógico":                 "Matemática",
  "raciocínio lógico e matemática":                 "Raciocínio Lógico e Matemática",

  // Raciocínio Lógico
  "raciocínio lógico":                              "Raciocínio Lógico",
  "raciocinio logico":                              "Raciocínio Lógico",
  "lógica":                                         "Raciocínio Lógico",
  "raciocínio lógico e quantitativo":               "Raciocínio Lógico",

  // Direito Constitucional
  "direito constitucional":                         "Direito Constitucional",
  "noções de direito constitucional":               "Direito Constitucional",
  "dir. constitucional":                            "Direito Constitucional",
  "noções de constituição federal":                 "Direito Constitucional",

  // Direito Administrativo
  "direito administrativo":                         "Direito Administrativo",
  "noções de direito administrativo":               "Direito Administrativo",
  "dir. administrativo":                            "Direito Administrativo",

  // Direito Penal
  "direito penal":                                  "Direito Penal",
  "noções de direito penal":                        "Direito Penal",
  "dir. penal":                                     "Direito Penal",

  // Direito Processual Penal
  "direito processual penal":                       "Direito Processual Penal",
  "noções de direito processual penal":             "Direito Processual Penal",
  "dir. processual penal":                          "Direito Processual Penal",
  "processo penal":                                 "Direito Processual Penal",

  // Informática
  "informática":                                    "Informática",
  "noções de informática":                          "Informática",
  "tecnologia da informação":                       "Informática",
  "informatica":                                    "Informática",

  // Inglês
  "língua inglesa":                                 "Língua Inglesa",
  "inglês":                                         "Língua Inglesa",
  "ingles":                                         "Língua Inglesa",

  // Conhecimentos Gerais / Atualidades
  "conhecimentos gerais":                           "Conhecimentos Gerais e Atualidades",
  "atualidades":                                    "Conhecimentos Gerais e Atualidades",
  "conhecimentos gerais e atualidades":             "Conhecimentos Gerais e Atualidades",
  "atualidades e conhecimentos gerais":             "Conhecimentos Gerais e Atualidades",

  // Legislação PM
  "legislação militar":                             "Legislação Institucional PM",
  "legislação pm":                                  "Legislação Institucional PM",
  "legislação específica pm":                       "Legislação Institucional PM",
  "legislação policial militar":                    "Legislação Institucional PM",
  "estatuto da pm":                                 "Legislação Institucional PM",
  "regulamentos militares":                         "Legislação Institucional PM",

  // Legislação CBM
  "legislação bombeiros":                           "Legislação Institucional CBM",
  "legislação cbm":                                 "Legislação Institucional CBM",
  "legislação específica cbm":                      "Legislação Institucional CBM",

  // Direitos Humanos
  "direitos humanos":                               "Direitos Humanos",
  "noções de direitos humanos":                     "Direitos Humanos",
  "direitos humanos e cidadania":                   "Direitos Humanos",

  // Ética
  "ética no serviço público":                       "Ética no Serviço Público",
  "ética":                                          "Ética no Serviço Público",
  "ética e cidadania":                              "Ética no Serviço Público",
  "ética profissional":                             "Ética no Serviço Público",

  // Física
  "física":                                         "Física",
  "fisica":                                         "Física",
  "noções de física":                               "Física",

  // Química
  "química":                                        "Química",
  "quimica":                                        "Química",

  // História
  "história do brasil":                             "História do Brasil",
  "historia do brasil":                             "História do Brasil",
  "história e geografia do brasil":                 "História e Geografia do Brasil",

  // Geografia
  "geografia":                                      "Geografia",
  "geografia do brasil":                            "Geografia do Brasil",
  "noções de geografia":                            "Geografia",
};

function normalizeSubjectName(raw: string): string {
  const lower = raw.trim().toLowerCase();
  return NORMALIZATION_MAP[lower] ?? titleCase(raw.trim());
}

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(?:^|\s|\/)\S/g, (c) => c.toUpperCase());
}

// ─────────────────────────────────────────────────────────────────────────────
// TIPO DE ENTRADA
// ─────────────────────────────────────────────────────────────────────────────
type EditalSubject = {
  name: string;
  questions: number;
};

type EditalInput = {
  sigla: string;   // ex: "PM SP", "PM RJ"
  subjects: EditalSubject[];
};

// ─────────────────────────────────────────────────────────────────────────────
// ALGORITMO PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
function mergeEditais(editais: EditalInput[]) {
  const n = editais.length;
  const freq = new Map<string, { count: number; totalQ: number; sources: string[] }>();

  for (const edital of editais) {
    // Deduplica dentro do mesmo edital (some editais dividem por blocos)
    const seen = new Set<string>();
    for (const subj of edital.subjects) {
      const key = normalizeSubjectName(subj.name);
      if (seen.has(key)) continue;
      seen.add(key);

      const existing = freq.get(key) ?? { count: 0, totalQ: 0, sources: [] };
      freq.set(key, {
        count: existing.count + 1,
        totalQ: existing.totalQ + subj.questions,
        sources: [...existing.sources, edital.sigla],
      });
    }
  }

  const result = Array.from(freq.entries())
    .map(([name, { count, totalQ, sources }]) => ({
      name,
      weight: count === n ? 3 : count >= 2 ? 2 : 1,
      questions: Math.round(totalQ / count),
      topics: [] as never[],
      _coverage: `${count}/${n} editais (${sources.join(", ")})`,
    }))
    .sort((a, b) => b.weight - a.weight || b.questions - a.questions);

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// EDITAIS — PREENCHER COM OS DADOS REAIS ANTES DE RODAR
// ─────────────────────────────────────────────────────────────────────────────
const EDITAIS: EditalInput[] = [
  // Exemplo PM_CFO — substituir pelos dados reais
  {
    sigla: "PM SP",
    subjects: [
      { name: "Língua Portuguesa",      questions: 20 },
      { name: "Matemática",             questions: 15 },
      { name: "Raciocínio Lógico",      questions: 10 },
      { name: "Direito Constitucional", questions: 15 },
      { name: "Direito Administrativo", questions: 10 },
      { name: "Legislação PM",          questions: 10 },
    ],
  },
  // {
  //   sigla: "PM RJ",
  //   subjects: [
  //     { name: "Língua Portuguesa",      questions: 20 },
  //     ...
  //   ],
  // },
];

// ─────────────────────────────────────────────────────────────────────────────
// OUTPUT
// ─────────────────────────────────────────────────────────────────────────────
const merged = mergeEditais(EDITAIS);

console.log("\n── RESULTADO DO CRUZAMENTO ──────────────────────────────────────\n");
console.log(`Editais analisados (${EDITAIS.length}): ${EDITAIS.map(e => e.sigla).join(", ")}\n`);

// Tabela de cobertura
console.log("Matéria".padEnd(45) + "Weight".padEnd(10) + "Qtd".padEnd(8) + "Cobertura");
console.log("─".repeat(80));
for (const m of merged) {
  const tag = m.weight === 3 ? "★★★" : m.weight === 2 ? "★★☆" : "★☆☆";
  console.log(
    m.name.padEnd(45) +
    `${tag} (${m.weight})`.padEnd(10) +
    String(m.questions).padEnd(8) +
    m._coverage
  );
}

// Output pronto para colar em auto-migrate.ts
const clean = merged.map(({ name, weight, questions, topics }) =>
  `        { name: "${name}", weight: ${weight}, questions: ${String(questions).padStart(2)}, topics: [] },`
);

console.log("\n── COPIAR PARA auto-migrate.ts ──────────────────────────────────\n");
console.log("      materias: [");
console.log(clean.join("\n"));
console.log("      ],");
