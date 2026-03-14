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

  // Matemática (absorve RL quando combinados, pois é como a maioria dos editais trata)
  "matemática":                                     "Matemática",
  "matematica":                                     "Matemática",
  "matemática básica":                              "Matemática",
  "matemática e raciocínio lógico":                 "Matemática",
  "raciocínio lógico e matemático":                 "Matemática",
  "raciocínio lógico e matemática":                 "Matemática",
  "matemática e lógica":                            "Matemática",

  // Raciocínio Lógico (standalone)
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
  "noções básicas de informática":                  "Informática",
  "tecnologia da informação":                       "Informática",
  "tecnologia da informação (ti)":                  "Informática",
  "informatica":                                    "Informática",

  // Inglês
  "língua inglesa":                                 "Língua Inglesa",
  "inglês":                                         "Língua Inglesa",
  "ingles":                                         "Língua Inglesa",

  // Conhecimentos Gerais / Atualidades / Hist+Geo combinados
  "conhecimentos gerais":                           "Conhecimentos Gerais e Atualidades",
  "atualidades":                                    "Conhecimentos Gerais e Atualidades",
  "conhecimentos gerais e atualidades":             "Conhecimentos Gerais e Atualidades",
  "atualidades e conhecimentos gerais":             "Conhecimentos Gerais e Atualidades",
  // ES separa hist e geo — normaliza para o canônico unificado (mesmo conteúdo)
  "história do brasil e do espírito santo":         "Conhecimentos Gerais e Atualidades",
  "geografia geral, brasil e do espírito santo":    "Conhecimentos Gerais e Atualidades",
  "história e geografia do brasil":                 "Conhecimentos Gerais e Atualidades",
  "história geral e do brasil":                     "Conhecimentos Gerais e Atualidades",
  "história do brasil":                             "Conhecimentos Gerais e Atualidades",
  "história":                                       "Conhecimentos Gerais e Atualidades",
  "geografia":                                      "Conhecimentos Gerais e Atualidades",
  "geografia do brasil":                            "Conhecimentos Gerais e Atualidades",
  "historia e geografia":                           "Conhecimentos Gerais e Atualidades",

  // Legislação PM
  "legislação militar":                             "Legislação Institucional PM",
  "legislação pm":                                  "Legislação Institucional PM",
  "legislação específica pm":                       "Legislação Institucional PM",
  "legislação policial militar":                    "Legislação Institucional PM",
  "estatuto da pm":                                 "Legislação Institucional PM",
  "regulamentos militares":                         "Legislação Institucional PM",
  "legislação aplicada à pmerj":                    "Legislação Institucional PM",
  "legislação aplicada":                            "Legislação Institucional PM",
  "noções de administração pública":                "Legislação Institucional PM",
  // NOTA: "administração pública" sem "noções" → NÃO mapear para leg.PM (CBM SC usa como matéria acadêmica)

  // Legislação CBM
  "legislação institucional":                       "Legislação Institucional CBM",
  "legislação específica cbm":                      "Legislação Institucional CBM",
  "legislação bombeiros":                           "Legislação Institucional CBM",
  "legislação cbm":                                 "Legislação Institucional CBM",

  // Raciocínio Analítico (CBM SC) → Raciocínio Lógico
  "raciocínio analítico":                           "Raciocínio Lógico",

  // Direito Penal
  "direito penal":                                  "Direito Penal",
  "noções de direito penal":                        "Direito Penal",
  "dir. penal":                                     "Direito Penal",

  // Direito Processual Penal
  "direito processual penal":                       "Direito Processual Penal",
  "noções de direito processual penal":             "Direito Processual Penal",
  "dir. processual penal":                          "Direito Processual Penal",
  "processo penal":                                 "Direito Processual Penal",

  // Legislação CBM
  "legislação bombeiros":                           "Legislação Institucional CBM",
  "legislação cbm":                                 "Legislação Institucional CBM",
  "legislação específica cbm":                      "Legislação Institucional CBM",

  // Legislação PP (Polícia Penal)
  "legislação institucional pp":                    "Legislação Institucional PP",
  "legislação específica pp":                       "Legislação Institucional PP",
  "legislação pp":                                  "Legislação Institucional PP",
  "legislação institucional da polícia penal":      "Legislação Institucional PP",
  "legislação da polícia penal":                    "Legislação Institucional PP",

  // Legislação Penal Especial (LEP, Drogas, Hediondos, Abuso Autoridade, etc.)
  "legislação penal especial":                      "Legislação Penal Especial",
  "legislação especial":                            "Legislação Penal Especial",
  "legislação penal e processual penal especial":   "Legislação Penal Especial",

  // Legislação PL (Polícia Legislativa)
  "legislação institucional pl":                    "Legislação Institucional PL",
  "legislação específica pl":                       "Legislação Institucional PL",
  "legislação pl":                                  "Legislação Institucional PL",

  // Atividade de Inteligência
  "atividade de inteligência":                      "Atividade de Inteligência",
  "noções de inteligência":                         "Atividade de Inteligência",

  // Criminologia e Criminalística (combo PLE Federal)
  "criminologia e noções de criminalística":        "Criminologia e Criminalística",
  "criminologia e criminalística":                  "Criminologia e Criminalística",

  // Legislação PC
  "legislação institucional pc":                    "Legislação Institucional PC",
  "legislação específica pc":                       "Legislação Institucional PC",
  "legislação pc":                                  "Legislação Institucional PC",
  "legislação policial civil":                      "Legislação Institucional PC",

  // Direito Civil
  "direito civil":                                  "Direito Civil",
  "noções de direito civil":                        "Direito Civil",
  "dir. civil":                                     "Direito Civil",

  // Direito Empresarial / Comercial
  "direito empresarial":                            "Direito Empresarial",
  "direito comercial":                              "Direito Empresarial",
  "direito empresarial e comercial":                "Direito Empresarial",

  // Direito Tributário
  "direito tributário":                             "Direito Tributário",
  "direito tributário e financeiro":                "Direito Tributário",
  "noções de direito tributário":                   "Direito Tributário",

  // Contabilidade
  "noções de contabilidade":                        "Contabilidade Geral e Pública",
  "contabilidade geral":                            "Contabilidade Geral e Pública",
  "contabilidade geral e pública":                  "Contabilidade Geral e Pública",
  "contabilidade":                                  "Contabilidade Geral e Pública",

  // Administração Geral e Pública
  "noções de administração geral e pública":        "Administração Geral e Pública",
  "administração geral e pública":                  "Administração Geral e Pública",
  "noções de administração geral":                  "Administração Geral e Pública",

  // Criminologia
  "noções de criminologia":                         "Criminologia",
  "criminologia":                                   "Criminologia",

  // TI / Crimes Digitais (PC SC)
  "tecnologia da informação, segurança cibernética e crimes digitais": "Informática",
  "tecnologia da informação e segurança da informação": "Informática",

  // Raciocínio Lógico-Matemático (PC — combinado, absorve nos moldes do padrão)
  "raciocínio lógico-matemático":                   "Matemática",

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

  // Biologia
  "biologia":                                       "Biologia",

  // Língua Inglesa/Espanhola
  "língua inglesa e língua espanhola":              "Língua Inglesa",
  "língua inglesa/espanhola":                       "Língua Inglesa",
  "língua inglesa / espanhola":                     "Língua Inglesa",

  // Direito Penal Militar
  "direito penal militar":                          "Direito Penal Militar",
  "noções de direito penal militar":                "Direito Penal Militar",
  "código penal militar":                           "Direito Penal Militar",

  // História (standalone → mantém canônico Conhgerais, mapeado acima)
  "história do brasil":                             "Conhecimentos Gerais e Atualidades",
  "historia do brasil":                             "Conhecimentos Gerais e Atualidades",
  "história e geografia do brasil":                 "Conhecimentos Gerais e Atualidades",
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
  // ── PLE ES ──────────────────────────────────────────────────────────────────
  // Edital ALES/ES — Polícia Legislativa Estadual ES
  // 40q: Port(10q) + RLM→Mat(5q) + Info(5q) + ConhGerais(5q) + Legislação(5q) + ConhEspecificos(10q)
  // "Legislação" = legislação interna da ALES (Legislação Institucional PL)
  // "Conhecimentos Específicos" = matérias típicas de segurança pública legislativa
  {
    sigla: "PLE ES",
    subjects: [
      { name: "Língua Portuguesa",                    questions: 10 },
      { name: "Matemática",                           questions:  5 }, // RLM → Mat
      { name: "Informática",                          questions:  5 },
      { name: "Conhecimentos Gerais e Atualidades",   questions:  5 },
      { name: "Legislação Institucional PL",          questions:  5 },
      { name: "Direito Constitucional",               questions:  5 }, // ConhEspecificos: DirConst
      { name: "Direito Penal",                        questions:  3 }, // ConhEspecificos: DirPenal
      { name: "Direitos Humanos",                     questions:  2 }, // ConhEspecificos: DirHumanos
    ],
  },
  // ── PLE FEDERAL (Câmara dos Deputados) ──────────────────────────────────────
  // Policial Legislativo da Câmara dos Deputados (Cebraspe) — exame mais pesado
  // Estimativa: Port(10q) + Inglesa(5q) + RL+Estat(10q) + DirConst+LegCâmara(15q) +
  //             DirAdm(15q) + Info+Dados(10q) + DirPenal+ProcPenal(15q) +
  //             Criminologia+Criminalística(10q) + DirHumanos(5q) + Inteligência(5q)
  {
    sigla: "PLE Federal",
    subjects: [
      { name: "Língua Portuguesa",                    questions: 10 },
      { name: "Língua Inglesa",                       questions:  5 },
      { name: "Raciocínio Lógico",                    questions: 10 }, // RL+Estatística → RL
      { name: "Direito Constitucional",               questions: 15 }, // DirConst+LegCâmara
      { name: "Direito Administrativo",               questions: 15 },
      { name: "Informática",                          questions: 10 }, // Info+Dados
      { name: "Direito Penal",                        questions:  8 }, // split DirPenal+ProcPenal
      { name: "Direito Processual Penal",             questions:  7 }, // split DirPenal+ProcPenal
      { name: "Criminologia e Criminalística",        questions: 10 },
      { name: "Direitos Humanos",                     questions:  5 },
      { name: "Atividade de Inteligência",            questions:  5 },
    ],
  },
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
