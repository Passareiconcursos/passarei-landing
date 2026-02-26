/**
 * Seed: Legislação Penal Especial — Lei de Abuso de Autoridade (Lei 13.869/19)
 *
 * Popula 6 átomos de Conteúdo + 12 Questões.
 * Mnemônico: P.B.M (Prejudicar outrem, Beneficiar a si/terceiro, Meramente por capricho)
 * Idempotente: verifica existência antes de inserir.
 *
 * Execução:
 *   npx tsx db/seed-legislacao-penal-especial-abuso-autoridade.ts
 */

import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

// ============================================
// HELPERS
// ============================================

function nanoId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

async function findSubject(name: string): Promise<string | null> {
  const rows = await db.execute(sql`
    SELECT id FROM "Subject" WHERE name ILIKE ${"%" + name + "%"} LIMIT 1
  `) as any[];
  return rows[0]?.id ?? null;
}

async function findOrCreateTopic(name: string, subjectId: string): Promise<string> {
  const rows = await db.execute(sql`
    SELECT id FROM "Topic" WHERE name ILIKE ${name} AND "subjectId" = ${subjectId} LIMIT 1
  `) as any[];
  if (rows[0]?.id) return rows[0].id;

  const id = nanoId("tp");
  await db.execute(sql`
    INSERT INTO "Topic" (id, name, "subjectId", "createdAt", "updatedAt")
    VALUES (${id}, ${name}, ${subjectId}, NOW(), NOW())
  `);
  console.log(`  ✅ Tópico criado: ${name} (${id})`);
  return id;
}

async function contentExists(title: string, subjectId: string): Promise<boolean> {
  const rows = await db.execute(sql`
    SELECT id FROM "Content" WHERE title = ${title} AND "subjectId" = ${subjectId} LIMIT 1
  `) as any[];
  return rows.length > 0;
}

async function questionExists(id: string): Promise<boolean> {
  const rows = await db.execute(sql`
    SELECT id FROM "Question" WHERE id = ${id} LIMIT 1
  `) as any[];
  return rows.length > 0;
}

// ============================================
// CONTEÚDOS (6 átomos)
// ============================================

interface ContentAtom {
  id: string;
  title: string;
  textContent: string;
  mnemonic: string;
  keyPoint: string;
  practicalExample: string;
  difficulty: string;
}

const contents: ContentAtom[] = [
  {
    id: "lpe_aa_c01",
    title: "Lei 13.869/19 — Conceito, Estrutura e Sujeito Ativo",
    textContent: `A Lei 13.869/2019 define os crimes de abuso de autoridade cometidos por agente público, revogando integralmente a lei anterior (Lei 4.898/65). Ela protege simultaneamente o cidadão (dignidade e direitos fundamentais) e o Estado (regularidade do exercício da função pública).

PONTOS-CHAVE:
• Revogou: Lei 4.898/65 — a nova lei é mais técnica, ampla e com penas mais graves
• Sujeito ativo (art. 2º): agente público, servidor ou não, com mandato, cargo, emprego ou função pública — permanente ou transitória, remunerada ou não
  Inclui: servidores efetivos e comissionados, juízes, promotores, delegados, militares, agentes políticos
  Inclui também: particulares em colaboração com o poder público (ex: mesário eleitoral)
• Crime de mão própria: só pode ser autor direto o agente público — particular pode ser coautor ou partícipe, mas não autor isolado
• Bem jurídico tutelado: a administração pública + os direitos e garantias individuais do cidadão
• Penas: detenção (não reclusão) + multa, na maioria dos tipos

EXEMPLO:
Um Delegado de Polícia que decreta a prisão de uma pessoa sabendo que não há fundamento legal comete crime previsto na Lei 13.869/19. Um advogado que induz o Delegado a agir assim pode ser partícipe — mas não pode praticar o crime como autor direto.

DICA BANCA:
CEBRASPE cobra: "O particular, por não ser agente público, jamais pode ser responsabilizado pela Lei 13.869/19" — ERRADO. O particular pode ser coautor ou partícipe do crime de abuso de autoridade.`,
    mnemonic: "Lei 13.869/19 = P.B.M. na mão do AGENTE PÚBLICO. Revogou 4.898/65. Particular = só coautor/partícipe, nunca autor direto.",
    keyPoint: "Sujeito ativo: agente público (amplo conceito — art. 2º). Crime de mão própria. Revogou Lei 4.898/65. Pena = detenção + multa.",
    practicalExample: "Delegado prende sem fundamento = autor do crime. Advogado que induziu = partícipe (não autor). Mesário eleitoral com abuso = sujeito ativo (particular em colaboração).",
    difficulty: "FACIL",
  },
  {
    id: "lpe_aa_c02",
    title: "P.B.M — O Dolo Específico da Lei 13.869/19 (Art. 1º, §1º)",
    textContent: `A Lei 13.869/19 exige DOLO ESPECÍFICO para a configuração de qualquer crime de abuso de autoridade. Sem essa finalidade especial, a conduta pode ser ilegal, mas não é crime de abuso de autoridade.

PONTOS-CHAVE (art. 1º, §1º):
"As condutas descritas nesta Lei constituem crime de abuso de autoridade quando praticadas pelo agente com a finalidade específica de:
  P — Prejudicar outrem
  B — Beneficiar a si mesmo ou a terceiro
  M — Meramente por capricho ou satisfação pessoal"

• Não há modalidade CULPOSA — o abuso culposo pode gerar responsabilidade administrativa/civil, mas não criminal pela Lei 13.869/19
• O dolo específico é elemento subjetivo especial do tipo: deve estar presente além do dolo genérico (consciência e vontade de realizar a conduta)
• A finalidade deve ser demonstrada — o agente que age de boa-fé, mesmo que cause dano, não pratica abuso de autoridade

EXEMPLO:
Juiz que decreta prisão preventiva erroneamente por deficiência técnica → sem dolo P.B.M → não configura abuso de autoridade.
Juiz que decreta prisão preventiva para forçar réu a confessar (capricho/beneficiar terceiro) → COM dolo P.B.M → configura abuso.

DICA BANCA:
"O crime de abuso de autoridade admite a forma culposa" — ERRADO. Exige dolo específico (P.B.M). A lei expressamente determina que as condutas configuram o crime apenas quando praticadas com finalidade específica — sem ela, não há crime.`,
    mnemonic: "P.B.M = Prejudicar / Beneficiar / Mero capricho. Sem P.B.M = sem crime. Culpa = zero. Este é o coração da Lei 13.869/19.",
    keyPoint: "Dolo específico obrigatório (art. 1º §1º): P.B.M — Prejudicar outrem | Beneficiar si/terceiro | Mero capricho. Não há forma culposa.",
    practicalExample: "Promotor pede prisão preventiva para prejudicar réu inocente que conhece = P (Prejudicar) → crime. Pede porque interpretou mal a lei = sem P.B.M → não é crime.",
    difficulty: "MEDIO",
  },
  {
    id: "lpe_aa_c03",
    title: "Taxatividade e o 'Crime de Hermenêutica' que Não Existe (Art. 1º, §2º)",
    textContent: `A Lei 13.869/19 adota o princípio da TAXATIVIDADE: somente as condutas expressamente descritas na lei configuram crime. Não cabe analogia em prejuízo do agente público. Além disso, o §2º do art. 1º cria uma proteção explícita contra o "crime de hermenêutica".

PONTOS-CHAVE (art. 1º, §2º):
"A divergência na interpretação de lei ou na avaliação de fatos e provas NÃO configura abuso de autoridade."

• Taxatividade (numerus clausus): o rol de crimes é FECHADO — não se podem criar novas figuras por interpretação extensiva ou analógica in malam partem
• "Crime de hermenêutica": expressão histórica que designa a tentativa de criminalizar a interpretação jurídica divergente — a Lei 13.869/19 vedou expressamente essa possibilidade
• O §2º protege o agente público que agiu com fundamentação jurídica, mesmo que outros discordem
• ATENÇÃO: o §2º não é "imunidade total" — se houver o dolo P.B.M. combinado com interpretação distorcida para acobertar o crime, pode configurar abuso

EXEMPLO:
Juiz que determina a busca e apreensão fundamentado em interpretação da lei contestável pela doutrina → sem P.B.M → não é crime de abuso, mesmo que a decisão seja reformada pelo tribunal.
Juiz que usa uma "interpretação" como pretexto para prejudicar o réu pessoalmente (com dolo P.B.M comprovado) → pode configurar crime.

DICA BANCA:
"O agente público que, ao interpretar a lei de forma divergente, causa prejuízo ao cidadão, comete abuso de autoridade" — ERRADO. Art. 1º, §2º: divergência na interpretação NÃO configura crime. A proteção ao "crime de hermenêutica" é expressa na lei.`,
    mnemonic: "§2º do art. 1º = ESCUDO contra 'crime de hermenêutica'. Divergir na interpretação da lei = NÃO É crime. Taxatividade = rol fechado, sem analogia.",
    keyPoint: "Art. 1º §2º: divergência na interpretação de lei ou avaliação de provas NÃO configura abuso. Taxatividade: rol de crimes é fechado (numerus clausus).",
    practicalExample: "Delegado que indicia com base em interpretação contestada da lei = não é abuso. Delegado que nega flagrante para prejudicar (dolo P) = abuso (conduta do art. 12).",
    difficulty: "MEDIO",
  },
  {
    id: "lpe_aa_c04",
    title: "Efeitos da Condenação — Inabilitação e Perda do Cargo (Arts. 4º e 5º)",
    textContent: `A Lei 13.869/19 prevê efeitos específicos da condenação que vão além da pena principal (detenção + multa). Os mais cobrados são a INABILITAÇÃO e a PERDA DO CARGO.

PONTOS-CHAVE (art. 4º):
Efeitos da condenação transitada em julgado:
I — Tornar certa a obrigação de indenizar o dano causado ao ofendido
II — A INABILITAÇÃO para o exercício de cargo, mandato ou função pública, pelo período de 1 a 5 anos
III — A PERDA do cargo, mandato ou função pública

REGRA CRÍTICA (art. 5º):
• Os efeitos dos incisos II e III (inabilitação + perda do cargo) NÃO são automáticos na maioria dos casos
• Devem ser MOTIVADAMENTE DECLARADOS na sentença condenatória
• São automáticos (declaração obrigatória) apenas nos casos de REINCIDÊNCIA em crimes previstos nesta lei

DICA BANCA — A pegadinha mais cobrada pelo CEBRASPE:
"A condenação por crime de abuso de autoridade gera, automaticamente, a perda do cargo público." → ERRADO
A perda do cargo exige declaração expressa e motivada do juiz na sentença — só é automática na reincidência específica (crime desta lei).`,
    mnemonic: "Efeitos art. 4º: I = Indenizar (automático), II = Inabilitar 1-5 anos, III = Perder cargo. II e III = só automáticos na REINCIDÊNCIA. Nos demais casos = juiz deve DECLARAR expressamente.",
    keyPoint: "Inabilitação (1-5 anos) e perda do cargo: não são automáticos — juiz deve declarar expressamente na sentença. Automáticos apenas na reincidência em crime desta lei.",
    practicalExample: "Delegado condenado pela 1ª vez = juiz pode ou não declarar perda do cargo (fundamentando). Delegado reincidente em abuso = perda do cargo é obrigatória (automática).",
    difficulty: "DIFICIL",
  },
  {
    id: "lpe_aa_c05",
    title: "Reincidência como Divisor de Águas nos Efeitos Secundários",
    textContent: `A REINCIDÊNCIA tem papel central na Lei 13.869/19: ela é o gatilho que torna obrigatórios (automáticos) os efeitos mais graves da condenação — inabilitação e perda do cargo — que nos demais casos dependem de declaração expressa do juiz.

ESQUEMA DE APLICAÇÃO:
┌─────────────────────────────────────────────────────────────────┐
│ 1ª condenação (não reincidente em abuso de autoridade):         │
│   • Pena: detenção + multa                                      │
│   • Inabilitação e perda do cargo: juiz pode declarar (faculta) │
│   • Deve motivar expressamente se declarar                       │
├─────────────────────────────────────────────────────────────────┤
│ Reincidente em crime de abuso de autoridade (Lei 13.869/19):    │
│   • Pena: detenção + multa (majorada)                           │
│   • Inabilitação e perda do cargo: OBRIGATÓRIOS (declaração     │
│     necessária, mas imperativa — juiz não tem discricionariedade│
└─────────────────────────────────────────────────────────────────┘

PONTOS-CHAVE:
• Reincidência específica: a lei fala em reincidência em "crimes previstos nesta lei" — não qualquer crime
• A reincidência genérica (crime de outra lei) não torna automáticos os efeitos
• A inabilitação de 1 a 5 anos impede que o condenado exerça qualquer cargo, mandato ou função pública no período

DICA BANCA:
"A inabilitação para o exercício de função pública é efeito automático de qualquer condenação por crime da Lei 13.869/19" — ERRADO. Só é automática na reincidência específica (crimes desta lei). Na 1ª condenação, o juiz deve declarar expressamente e de forma motivada.`,
    mnemonic: "Reincidente em abuso = AUTOMÁTICO (perda + inabilitação). 1ª vez = FACULDADE do juiz (declaração expressa). Reincidência GENÉRICA não ativa o automático.",
    keyPoint: "Reincidência em crime desta lei → inabilitação e perda do cargo automáticos (obrigatórios). 1ª vez → juiz declara motivadamente se quiser aplicar.",
    practicalExample: "Policial condenado por primeiro abuso: juiz pode não aplicar perda do cargo. Mesmo policial condenado 2ª vez por abuso: juiz OBRIGADO a declarar perda do cargo e inabilitação.",
    difficulty: "DIFICIL",
  },
  {
    id: "lpe_aa_c06",
    title: "Crimes Mais Cobrados — Prisão Ilegal, Busca Abusiva e Condução Coercitiva",
    textContent: `A Lei 13.869/19 tipifica dezenas de condutas. As bancas federais (CEBRASPE/CESPE) focam nos crimes envolvendo restrição ilegal de liberdade e abuso em diligências.

CRIMES MAIS COBRADOS:

1. PRISÃO OU MEDIDA RESTRITIVA ILEGAL (art. 9º):
   "Decretar medida de privação da liberdade em manifesta desconformidade com as hipóteses legais"
   Pena: detenção 1-4 anos + multa
   Sujeito ativo típico: juiz, delegado, promotor

2. CONDUÇÃO COERCITIVA MANIFESTAMENTE DESCABIDA (art. 10):
   Decretar ou executar condução coercitiva de investigado ou réu manifestamente descabida
   Pena: detenção 1-4 anos + multa
   Contexto: STF julgou a condução coercitiva para interrogatório inconstitucional (ADPF 395/444) — crime se feita mesmo assim

3. COMUNICAÇÃO TARDIA DE PRISÃO EM FLAGRANTE (art. 12):
   "Deixar injustificadamente de comunicar prisão em flagrante ao juiz competente no prazo legal"
   Pena: detenção 6 meses-2 anos + multa

4. EXIBIÇÃO OU DIVULGAÇÃO INDEVIDA DE PRESO (art. 13):
   "Constranger o preso ou o detento, mediante violência, grave ameaça ou redução de sua capacidade de resistência, a exibir-se ou ter seu corpo ou parte dele exibido à curiosidade pública"
   Contexto: impede o chamado "passeio do preso"

DICA BANCA:
Sempre verificar: há dolo específico P.B.M? Há taxatividade (conduta descrita na lei)? A divergência é de interpretação (§2º)?`,
    mnemonic: "PECDE: Prisão ilegal (art. 9) | Execução arbitrária (art. 10) | Comunicação tardia (art. 12) | Divulgação de preso (art. 13) | Efeitos = reincidência (arts. 4-5).",
    keyPoint: "Art. 9: prisão manifestamente ilegal. Art. 10: condução coercitiva descabida. Art. 12: não comunicar flagrante no prazo. Art. 13: exibir preso ao público. Todos exigem dolo P.B.M.",
    practicalExample: "Delegado que não comunica flagrante ao juiz no prazo de 24h sem justificativa = art. 12. Delegado que expõe preso algemado para a imprensa como 'troféu' = art. 13 (dolo M = satisfação pessoal).",
    difficulty: "MEDIO",
  },
];

// ============================================
// QUESTÕES (12)
// ============================================

interface Alternative {
  letter: string;
  text: string;
}

interface QuestionData {
  id: string;
  statement: string;
  questionType: string;
  alternatives: Alternative[];
  correctAnswer: string;
  correctOption: number;
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: string;
}

const questions: QuestionData[] = [
  // ── Q1–Q4: FÁCIL ─────────────────────────────────────────────────────────
  {
    id: "lpe_aa_q01",
    statement:
      "A Lei 13.869/2019 (Lei de Abuso de Autoridade) revogou a anterior Lei 4.898/1965 e define como sujeito ativo dos crimes nela previstos:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Exclusivamente servidores públicos efetivos, ocupantes de cargo de provimento efetivo." },
      { letter: "B", text: "Agente público, servidor ou não, com mandato, cargo, emprego ou função pública — permanente ou transitória, remunerada ou não." },
      { letter: "C", text: "Apenas servidores policiais (civis, militares e federais), dado o contexto de segurança pública da lei." },
      { letter: "D", text: "Qualquer cidadão que pratique ato que prejudique a Administração Pública." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O art. 2º da Lei 13.869/19 define sujeito ativo de forma ampla: agente público, servidor ou não, com mandato, cargo, emprego ou função pública, permanente ou transitória, remunerada ou não. Abrange juízes, promotores, delegados, militares, agentes políticos e até particulares em colaboração com o Estado.",
    explanationCorrect:
      "Correto! O conceito de agente público na Lei 13.869/19 é amplíssimo (art. 2º): inclui qualquer pessoa que exerça função pública — efetivo, comissionado, mandatário, temporário, remunerado ou não. A lei revogou integralmente a Lei 4.898/65.",
    explanationWrong:
      "Errado: o sujeito ativo da Lei 13.869/19 não se limita a servidores efetivos ou policiais. O art. 2º abrange todo agente público — servidor ou não, permanente ou transitório, remunerado ou não, incluindo juízes, promotores e até particulares colaboradores do Estado.",
    difficulty: "FACIL",
  },
  {
    id: "lpe_aa_q02",
    statement:
      "Nos termos da Lei 13.869/2019, as condutas nela descritas configuram crime de abuso de autoridade quando praticadas com finalidade específica de:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Prejudicar outrem, beneficiar a si mesmo ou terceiro, ou por mero capricho ou satisfação pessoal (P.B.M)." },
      { letter: "B", text: "Causar dano ao erário ou à moralidade administrativa, dolosa ou culposamente." },
      { letter: "C", text: "Violar qualquer direito fundamental previsto na Constituição Federal de 1988." },
      { letter: "D", text: "Praticar qualquer ato ilegal, ainda que sem intenção, se causar dano ao cidadão." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "O art. 1º, §1º da Lei 13.869/19 exige dolo específico (P.B.M): prejudicar outrem / beneficiar a si mesmo ou terceiro / mero capricho ou satisfação pessoal. Não há modalidade culposa. A mera ilegalidade do ato, sem essa finalidade, não configura crime desta lei.",
    explanationCorrect:
      "Correto! P.B.M é o coração da Lei 13.869/19: sem o dolo específico do art. 1º, §1º, a conduta pode ser ilegal e gerar responsabilidade administrativa/civil, mas NÃO é crime de abuso de autoridade. A modalidade culposa não existe nesta lei.",
    explanationWrong:
      "Errado: a Lei 13.869/19 exige dolo específico (art. 1º §1º) — P.B.M: prejudicar outrem, beneficiar a si/terceiro ou mero capricho. A forma culposa não é punida por esta lei. A violação de direito constitucional, isoladamente, não é suficiente sem o elemento subjetivo especial.",
    difficulty: "FACIL",
  },
  {
    id: "lpe_aa_q03",
    statement:
      "O agente público que decreta a prisão preventiva de um investigado baseado em interpretação jurídica controvertida sobre os requisitos do art. 312 do CPP, sem intenção de prejudicá-lo, beneficiar-se ou agir por capricho:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Comete crime de abuso de autoridade, pois causou dano ao investigado com a prisão indevida." },
      { letter: "B", text: "Não comete crime de abuso de autoridade, pois a divergência na interpretação de lei não configura abuso (art. 1º, §2º)." },
      { letter: "C", text: "Comete abuso de autoridade na modalidade culposa, por não se certificar da legalidade da prisão." },
      { letter: "D", text: "Comete abuso de autoridade, pois a lei não admite prisões com base em interpretação divergente." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Art. 1º, §2º da Lei 13.869/19: 'A divergência na interpretação de lei ou na avaliação de fatos e provas não configura abuso de autoridade.' Essa cláusula protege o 'crime de hermenêutica' — a interpretação jurídica divergente, sem o dolo P.B.M, não é crime.",
    explanationCorrect:
      "Correto! O art. 1º §2º é o escudo contra o 'crime de hermenêutica': a divergência na interpretação da lei NÃO configura abuso. Sem o dolo P.B.M (prejudicar/beneficiar/capricho), mesmo uma decisão errada tecnicamente não é crime de abuso de autoridade.",
    explanationWrong:
      "Errado: o art. 1º, §2º da Lei 13.869/19 estabelece que 'a divergência na interpretação de lei ou na avaliação de fatos e provas não configura abuso de autoridade.' Além disso, a lei não admite modalidade culposa — sem dolo específico P.B.M, não há crime.",
    difficulty: "FACIL",
  },
  {
    id: "lpe_aa_q04",
    statement:
      "A Lei 13.869/2019 prevê que o crime de abuso de autoridade pode ser praticado na forma:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Dolosa ou culposa, conforme o grau de negligência ou imprudência do agente." },
      { letter: "B", text: "Exclusivamente dolosa, com dolo genérico — basta a consciência e a vontade de praticar o ato." },
      { letter: "C", text: "Exclusivamente dolosa, com dolo específico — exige finalidade especial (P.B.M), além do dolo genérico." },
      { letter: "D", text: "Dolosa ou preterdolosa, a depender do resultado lesivo ao cidadão." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "A Lei 13.869/19 exige dolo específico (elemento subjetivo especial do tipo) — além do dolo genérico (consciência e vontade), o agente deve ter a finalidade especial: P.B.M (prejudicar, beneficiar, mero capricho). Não há modalidade culposa nem basta o dolo genérico.",
    explanationCorrect:
      "Correto! Dolo específico (P.B.M) é imprescindível: o agente deve, além de querer a conduta, ter a finalidade de prejudicar outrem, beneficiar a si/terceiro ou agir por mero capricho (art. 1º §1º). Sem esse plus subjetivo, o ato pode ser ilegal, mas não é crime desta lei.",
    explanationWrong:
      "Errado: a Lei 13.869/19 não admite forma culposa nem se satisfaz com o dolo genérico. Exige dolo ESPECÍFICO (art. 1º §1º): além de querer praticar o ato, o agente deve ter finalidade especial de prejudicar, beneficiar ou agir por mero capricho — o chamado elemento P.B.M.",
    difficulty: "FACIL",
  },
  // ── Q5–Q8: MÉDIO (Polícia Civil / PM) ───────────────────────────────────
  {
    id: "lpe_aa_q05",
    statement:
      "Assinale a alternativa que descreve CORRETAMENTE os efeitos da condenação previstos no art. 4º da Lei 13.869/2019:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "I — perda do cargo; II — suspensão dos direitos políticos; III — obrigação de indenizar." },
      { letter: "B", text: "I — tornar certa a obrigação de indenizar; II — inabilitação para cargo/mandato/função (1-5 anos); III — perda do cargo." },
      { letter: "C", text: "I — perda do cargo; II — inabilitação de 5 a 10 anos; III — tornar certa a obrigação de indenizar." },
      { letter: "D", text: "I — multa reparatória; II — perda do cargo; III — suspensão dos direitos políticos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Art. 4º da Lei 13.869/19 lista três efeitos da condenação: I — tornar certa a obrigação de indenizar o dano causado ao ofendido; II — inabilitação para exercício de cargo, mandato ou função pública pelo período de 1 a 5 anos; III — perda do cargo, mandato ou função pública.",
    explanationCorrect:
      "Correto! Os três efeitos do art. 4º são: I = certeza da indenização, II = inabilitação 1-5 anos, III = perda do cargo. A inabilitação NÃO é de 5-10 anos (isso é armadilha clássica). Suspensão de direitos políticos não está nesta lei.",
    explanationWrong:
      "Errado: os efeitos do art. 4º da Lei 13.869/19 são: I = tornar certa a obrigação de indenizar; II = inabilitação para cargo/mandato/função pelo período de 1 a 5 anos; III = perda do cargo. A suspensão de direitos políticos não é efeito desta lei — ela está no art. 15, III da CF/88 como efeito de condenação criminal transitada em julgado em geral.",
    difficulty: "MEDIO",
  },
  {
    id: "lpe_aa_q06",
    statement:
      "Quanto aos efeitos de inabilitação e perda do cargo previstos nos incisos II e III do art. 4º da Lei 13.869/2019, é correto afirmar que:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "São efeitos automáticos de qualquer condenação por crime de abuso de autoridade, independentemente de reincidência." },
      { letter: "B", text: "Devem ser motivadamente declarados na sentença condenatória nos casos em que o condenado não for reincidente em crimes desta lei." },
      { letter: "C", text: "Só se aplicam quando a pena de detenção aplicada for superior a 8 anos." },
      { letter: "D", text: "São aplicáveis apenas a agentes políticos (juízes, promotores), não a servidores policiais." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Art. 5º da Lei 13.869/19: os efeitos de inabilitação e perda do cargo são automáticos (declaração obrigatória) apenas nos casos de reincidência em crimes desta lei. Para condenados não reincidentes, o juiz pode declará-los, mas deve fazê-lo de forma motivada na sentença. Não há exigência de pena mínima de 8 anos — os crimes têm penas de detenção (em geral 1-4 anos).",
    explanationCorrect:
      "Correto! O art. 5º diferencia: reincidente em abuso = inabilitação e perda automáticas (obrigatórias). Não reincidente = juiz pode declarar, mas deve fundamentar expressamente na sentença. Nunca são automáticos para o não reincidente.",
    explanationWrong:
      "Errado: os efeitos de inabilitação e perda do cargo NÃO são automáticos em qualquer condenação. Só são automáticos (obrigatórios) na reincidência em crimes desta lei (art. 5º). Para a 1ª condenação, o juiz decide se os declara, motivando expressamente — sem reincidência, não há automaticidade.",
    difficulty: "MEDIO",
  },
  {
    id: "lpe_aa_q07",
    statement:
      "A conduta do agente público que decreta a condução coercitiva de um investigado para interrogatório, em situação manifestamente descabida e com a finalidade de constranger o suspeito:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "É atípica, pois a condução coercitiva é prerrogativa legal da autoridade policial e não pode configurar crime." },
      { letter: "B", text: "Configura crime previsto na Lei 13.869/19, pois há conduta descrita (condução coercitiva manifestamente descabida) e dolo específico P.B.M (prejudicar/constranger)." },
      { letter: "C", text: "Configura abuso de autoridade apenas se o STF tiver previamente declarado a conduta inconstitucional em relação ao caso concreto." },
      { letter: "D", text: "É apenas infração disciplinar, sem relevância criminal, por tratar-se de ato administrativo." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O art. 10 da Lei 13.869/19 tipifica 'decretar ou executar condução coercitiva de investigado ou de réu manifestamente descabida'. A conduta exige dois elementos: (1) taxatividade — a conduta está descrita na lei; (2) dolo P.B.M — finalidade de constranger/prejudicar. Ambos presentes no caso.",
    explanationCorrect:
      "Correto! A condução coercitiva manifestamente descabida está tipificada no art. 10 da Lei 13.869/19. Com dolo P.B.M (finalidade de constranger = prejudicar outrem), a conduta configura crime de abuso de autoridade. O STF (ADPF 395/444) também declarou inconstitucional a condução coercitiva para interrogatório, reforçando a ilicitude.",
    explanationWrong:
      "Errado: a condução coercitiva manifestamente descabida é conduta tipificada no art. 10 da Lei 13.869/19. A prerrogativa legal existe para situações cabíveis — quando manifestamente descabida E com dolo P.B.M, configura crime. O STF (ADPF 395/444) já vedou a condução coercitiva para interrogatório de investigado.",
    difficulty: "MEDIO",
  },
  {
    id: "lpe_aa_q08",
    statement:
      "Sobre a taxatividade na Lei 13.869/2019, é INCORRETO afirmar que:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "O rol de crimes previstos na lei é fechado (numerus clausus), não admitindo analogia in malam partem para criar novos tipos." },
      { letter: "B", text: "A divergência na interpretação de lei pelo agente público, por si só, não configura crime de abuso de autoridade." },
      { letter: "C", text: "O princípio da taxatividade permite que condutas similares às descritas na lei sejam punidas por analogia, em homenagem à proteção dos direitos fundamentais." },
      { letter: "D", text: "A avaliação divergente de fatos e provas pelo agente público, sem dolo P.B.M, não configura abuso de autoridade." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "A questão pede a alternativa INCORRETA. A 'C' está errada porque a taxatividade (numerus clausus) IMPEDE a analogia in malam partem — precisamente o oposto do que afirma. O Direito Penal veda a criação de novos crimes por analogia que prejudique o réu. A Lei 13.869/19 adota rol fechado de condutas criminosas.",
    explanationCorrect:
      "Correto em identificar o erro! A opção C é a INCORRETA: taxatividade = rol FECHADO, sem analogia in malam partem. A Lei 13.869/19 não permite que condutas 'similares' sejam punidas por analogia — só as expressamente descritas configuram crime.",
    explanationWrong:
      "Você marcou incorretamente. A alternativa INCORRETA é a C: a taxatividade PROÍBE a analogia in malam partem (que prejudique o réu). As opções A, B e D são corretas: rol fechado (A), divergência não configura abuso (B — art. 1º §2º), avaliação divergente sem P.B.M não é crime (D).",
    difficulty: "MEDIO",
  },
  // ── Q9–Q12: DIFÍCIL — Estilo CEBRASPE (C/E com 2 alternativas) ──────────
  {
    id: "lpe_aa_q09",
    statement:
      "[Estilo CEBRASPE] Julgue o item: 'A condenação criminal por crime de abuso de autoridade, previsto na Lei 13.869/2019, acarreta automaticamente, em qualquer hipótese, a perda do cargo público do condenado, independentemente de declaração judicial expressa.'",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "CERTO — a condenação por abuso de autoridade sempre implica perda do cargo como efeito automático." },
      { letter: "B", text: "ERRADO — a perda do cargo exige declaração motivada na sentença; só é automática nos casos de reincidência em crimes desta lei." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. Art. 5º da Lei 13.869/19: os efeitos de inabilitação e perda do cargo (art. 4º, II e III) são automáticos SOMENTE nos casos de reincidência em crimes previstos nesta lei. Para a primeira condenação, o juiz pode declará-los, mas deve fazê-lo de forma motivada e expressa na sentença. Nunca são automáticos para todos os condenados.",
    explanationCorrect:
      "Correto! O item está ERRADO — pegadinha clássica do CEBRASPE. A perda do cargo NÃO é automática em qualquer condenação. O art. 5º da Lei 13.869/19 exige que o juiz a declare expressamente na sentença (com motivação), sendo obrigatória apenas nos casos de reincidência em crime desta lei.",
    explanationWrong:
      "Errado: o item é FALSO. A perda do cargo não é automática em qualquer condenação por abuso de autoridade. Segundo o art. 5º da Lei 13.869/19, a perda do cargo e a inabilitação: (1) são obrigatórias e automáticas apenas na reincidência em crimes desta lei; (2) nos demais casos, o juiz pode declará-las, mas deve fundamentar expressamente na sentença.",
    difficulty: "DIFICIL",
  },
  {
    id: "lpe_aa_q10",
    statement:
      "[Estilo CEBRASPE] Julgue o item: 'O juiz que, interpretando extensivamente os requisitos legais da prisão preventiva, decreta a custódia de um réu e, posteriormente, a decisão é reformada pelo tribunal por ausência dos pressupostos legais, pratica, necessariamente, o crime de abuso de autoridade previsto no art. 9º da Lei 13.869/2019.'",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "CERTO — a decisão judicial reformada em grau recursal revela o abuso no decreto de prisão." },
      { letter: "B", text: "ERRADO — a divergência na interpretação de lei não configura abuso de autoridade (art. 1º, §2º), e a configuração do crime exige o dolo específico P.B.M." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O item descreve situação em que o juiz divergiu na interpretação dos requisitos legais — exatamente o que o art. 1º, §2º da Lei 13.869/19 exclui do âmbito criminal: 'A divergência na interpretação de lei ou na avaliação de fatos e provas não configura abuso de autoridade.' Além disso, o fato de a decisão ser reformada em recurso não implica dolo P.B.M.",
    explanationCorrect:
      "Correto! O item é FALSO. O art. 1º, §2º protege o magistrado que divergiu na interpretação legal: mero erro técnico, mesmo que cause prisão indevida, não é crime de abuso de autoridade. O crime do art. 9º exige: conduta descrita + dolo P.B.M. A reforma da decisão em recurso não prova, por si só, que houve P.B.M.",
    explanationWrong:
      "Errado: o item é FALSO. O art. 1º, §2º da Lei 13.869/19 estabelece que 'a divergência na interpretação de lei ou na avaliação de fatos e provas não configura abuso de autoridade.' A prisão decretada com base em interpretação extensiva, sem o dolo P.B.M, não é crime desta lei — mesmo que reformada pelo tribunal.",
    difficulty: "DIFICIL",
  },
  {
    id: "lpe_aa_q11",
    statement:
      "[Estilo CEBRASPE] Julgue o item: 'O particular que, em coautoria com um Delegado de Polícia, induz este a decretar prisão manifestamente ilegal para prejudicar um desafeto comum, pode ser responsabilizado como coautor do crime de abuso de autoridade previsto na Lei 13.869/2019.'",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "CERTO — o particular pode ser coautor ou partícipe do crime de abuso de autoridade, mesmo não sendo agente público." },
      { letter: "B", text: "ERRADO — o particular jamais pode responder por crime de abuso de autoridade, pois é crime próprio que exige qualidade de agente público." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Embora o crime de abuso de autoridade seja crime de mão própria (o autor direto deve ser agente público), o particular pode responder como COAUTOR ou PARTÍCIPE pela teoria monista do concurso de pessoas (art. 29 CP). A lei não exclui expressamente a participação do extraneus — o particular que induz o agente público a abusar responde pelo mesmo crime.",
    explanationCorrect:
      "Correto! O item é VERDADEIRO. O crime de abuso de autoridade é crime próprio (sujeito ativo = agente público), mas a teoria monista do concurso de pessoas (art. 29 CP) admite que o particular responda como coautor ou partícipe. A Lei 13.869/19 não excluiu essa possibilidade — o particular que age em conjunto com o agente público responde pelo mesmo crime.",
    explanationWrong:
      "Errado: o item é VERDADEIRO. Embora o crime seja de mão própria (autor direto = agente público), o PARTICULAR pode ser coautor ou partícipe pela teoria monista (art. 29 CP). A Lei 13.869/19 não excluiu a responsabilidade do extraneus. Portanto, o particular que induziu o Delegado responde por abuso de autoridade como coautor.",
    difficulty: "DIFICIL",
  },
  {
    id: "lpe_aa_q12",
    statement:
      "[Estilo CEBRASPE] Julgue o item: 'A inabilitação para o exercício de cargo, mandato ou função pública, prevista no inciso II do art. 4º da Lei 13.869/2019, tem duração de 1 a 5 anos e, nos casos de reincidência em crime previsto nesta lei, sua declaração pelo juiz é obrigatória.'",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "CERTO — a inabilitação é de 1 a 5 anos (art. 4º, II) e, na reincidência específica em abuso de autoridade, sua declaração é obrigatória." },
      { letter: "B", text: "ERRADO — a inabilitação é de 5 a 10 anos e só é aplicável quando houver reincidência genérica." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. O art. 4º, II da Lei 13.869/19 prevê inabilitação de 1 a 5 anos (e não 5 a 10). O art. 5º determina que a declaração é obrigatória nos casos de reincidência em crimes previstos nesta lei (reincidência específica). A reincidência genérica (crime de outra lei) não torna a declaração obrigatória.",
    explanationCorrect:
      "Correto! O item é VERDADEIRO. A inabilitação é de 1 a 5 anos (art. 4º, II) — não confunda com 5-10 anos. Na reincidência em crime desta lei (específica), o juiz é OBRIGADO a declarar a inabilitação e a perda do cargo (art. 5º). Na reincidência genérica, não há essa obrigatoriedade.",
    explanationWrong:
      "Errado: o item é VERDADEIRO. O prazo de inabilitação é 1 a 5 anos (e não 5 a 10). Nos casos de reincidência em crimes previstos NA PRÓPRIA Lei 13.869/19 (reincidência específica), a declaração da inabilitação pelo juiz é obrigatória (art. 5º). A reincidência genérica não gera essa obrigatoriedade automática.",
    difficulty: "DIFICIL",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("🚀 Seed: Legislação Penal Especial — Lei de Abuso de Autoridade (Lei 13.869/19)");
  console.log("=".repeat(70));

  // 1. Encontrar Subject
  const subjectId = await findSubject("LEGISLACAO_ESPECIAL");
  if (!subjectId) {
    console.error("❌ Subject 'LEGISLACAO_ESPECIAL' não encontrado. Verifique o banco.");
    process.exit(1);
  }
  console.log(`✅ Subject encontrado: ${subjectId}`);

  // 2. Garantir colunas Phase 5
  await db.execute(sql`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS mnemonic TEXT`);
  await db.execute(sql`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS "keyPoint" TEXT`);
  await db.execute(sql`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS "practicalExample" TEXT`);
  await db.execute(sql`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "explanationCorrect" TEXT`);
  await db.execute(sql`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "explanationWrong" TEXT`);
  console.log("✅ Colunas Phase 5 garantidas");

  // 3. Criar Tópico
  const topicId = await findOrCreateTopic("Lei de Abuso de Autoridade — Lei 13.869/19", subjectId);
  console.log(`✅ Tópico: ${topicId}`);

  // 4. Inserir Conteúdos
  console.log("\n📚 Inserindo conteúdos...");
  let contentsCreated = 0;
  let contentsSkipped = 0;

  for (const c of contents) {
    if (await contentExists(c.title, subjectId)) {
      console.log(`  ⏭️  Conteúdo já existe: ${c.title}`);
      contentsSkipped++;
      continue;
    }
    await db.execute(sql`
      INSERT INTO "Content" (
        "id", "title", "textContent", "subjectId", "topicId",
        "isActive", "difficulty",
        "wordCount", "estimatedReadTime",
        "mnemonic", "keyPoint", "practicalExample",
        "createdAt", "updatedAt"
      ) VALUES (
        ${c.id}, ${c.title}, ${c.textContent}, ${subjectId}, ${topicId},
        true, ${c.difficulty},
        ${Math.round(c.textContent.split(/\s+/).length)},
        ${Math.ceil(c.textContent.split(/\s+/).length / 200)},
        ${c.mnemonic}, ${c.keyPoint}, ${c.practicalExample},
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Criado: ${c.title}`);
    contentsCreated++;
  }

  // 5. Inserir Questões
  console.log("\n❓ Inserindo questões...");
  let questionsCreated = 0;
  let questionsSkipped = 0;

  for (const q of questions) {
    if (await questionExists(q.id)) {
      console.log(`  ⏭️  Questão já existe: ${q.id}`);
      questionsSkipped++;
      continue;
    }
    const alternativesJson = JSON.stringify(
      q.alternatives.map((a) => ({ letter: a.letter, text: a.text }))
    );
    await db.execute(sql`
      INSERT INTO "Question" (
        "id", "statement", "alternatives", "correctAnswer", "correctOption",
        "explanation", "explanationCorrect", "explanationWrong",
        "subjectId", "topicId",
        "isActive", "difficulty",
        "timesUsed", "questionType",
        "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternativesJson}::jsonb, ${q.correctAnswer}, ${q.correctOption},
        ${q.explanation}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${subjectId}, ${topicId},
        true, ${q.difficulty},
        0, ${q.questionType},
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Questão criada: ${q.id} (${q.difficulty})`);
    questionsCreated++;
  }

  // ── Backfill contentId (fallback: primeiro conteúdo do tópico) ───────────
  const firstContentRows = await db.execute(sql`
    SELECT id FROM "Content" WHERE "topicId" = ${topicId} ORDER BY "createdAt" LIMIT 1
  `) as any[];
  if (firstContentRows[0]?.id) {
    const fallbackContentId = firstContentRows[0].id;
    const result = await db.execute(sql`
      UPDATE "Question" SET "contentId" = ${fallbackContentId}
      WHERE "topicId" = ${topicId} AND "contentId" IS NULL
    `) as any;
    const updated = result.rowCount ?? result.count ?? 0;
    if (updated > 0) console.log(`  🔧 Backfill contentId: ${updated} questões → primeiro conteúdo do tópico`);
  }

  // 6. Relatório
  console.log("\n" + "=".repeat(70));
  console.log(`📊 RELATÓRIO FINAL:`);
  console.log(`   Conteúdos: ${contentsCreated} criados, ${contentsSkipped} já existiam`);
  console.log(`   Questões:  ${questionsCreated} criadas, ${questionsSkipped} já existiam`);
  console.log("✅ Seed de Leg. Penal Especial — Abuso de Autoridade concluído!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
