/**
 * Seed: Direito Penal — Excludentes de Ilicitude (Art. 23 CP)
 * (Estado de Necessidade, Legítima Defesa, ECDL, ERD, Excesso Punível)
 *
 * Popula 6 átomos de Conteúdo + 12 Questões.
 * Idempotente: verifica existência antes de inserir.
 *
 * Execução:
 *   npx tsx db/seed-direito-penal-excludentes-ilicitude.ts
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
  if (rows[0]?.id) {
    console.log(`  ⏭  Tópico já existe: ${name}`);
    return rows[0].id;
  }
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

async function getContentId(title: string, subjectId: string): Promise<string | null> {
  const rows = await db.execute(sql`
    SELECT id FROM "Content" WHERE title = ${title} AND "subjectId" = ${subjectId} LIMIT 1
  `) as any[];
  return rows[0]?.id ?? null;
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
  title: string;
  textContent: string;
  mnemonic: string;
  keyPoint: string;
  practicalExample: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
}

const contents: ContentAtom[] = [
  // ── 1. Visão Geral — L.E.E.E ──────────────────────────────────────────────
  {
    title: "Excludentes de Ilicitude: Visão Geral e o Mnemônico L.E.E.E",
    textContent: `Art. 23 do Código Penal lista quatro causas que excluem a ilicitude (antijuridicidade) do fato. São as descriminantes ou justificantes: Legítima Defesa, Estado de Necessidade, Estrito Cumprimento de Dever Legal e Exercício Regular de Direito. Quando presentes, o fato é TÍPICO mas NÃO ILÍCITO — afasta o segundo substrato do crime na Teoria Tripartida. O art. 23, §único (excesso punível) determina que ultrapassar os limites de qualquer descriminante gera responsabilidade dolosa ou culposa.`,
    mnemonic: "L.E.E.E: (L)egítima Defesa + (E)stado de Necessidade + (E)strito Cumprimento de Dever Legal + (E)xercício Regular de Direito. Diferença central: 'Legítima Defesa repele AGRESSÃO; Estado de Necessidade enfrenta PERIGO.'",
    keyPoint: "As excludentes afastam a ILICITUDE (antijuridicidade), não a tipicidade. O fato continua sendo típico — mas não é ilícito. Excesso punível (art. 23, §único) transforma a excludente em crime, doloso ou culposo conforme o caso.",
    practicalExample: "Policial que atira no agressor armado (Legítima Defesa) vs. bombeiro que arromba porta para salvar vítima de incêndio (ECDL). Ambos praticam fatos típicos, mas a ilicitude é afastada pela descriminante aplicável.",
    difficulty: "FACIL",
  },
  // ── 2. Estado de Necessidade ──────────────────────────────────────────────
  {
    title: "Estado de Necessidade (Art. 24 CP): Requisitos e Proporcionalidade",
    textContent: `Art. 24 CP: "Considera-se em estado de necessidade quem pratica o fato para salvar de perigo ATUAL, que não provocou por sua vontade, nem podia de outro modo evitar, direito próprio ou alheio, cujo sacrifício, nas circunstâncias, não era razoável exigir-se." Requisitos: (1) perigo atual; (2) não criado voluntariamente; (3) inevitabilidade do ato lesivo; (4) razoabilidade do sacrifício. §1º: Não pode alegar EN quem tinha dever legal de enfrentar o perigo (policiais, bombeiros). §2º: Se era razoável exigir o sacrifício, o juiz pode reduzir a pena de 1/3 a 2/3.`,
    mnemonic: "P.A.I.R: Perigo Atual + sem Alternativa (inevitabilidade) + não provocado pelo próprio agente + Razoabilidade do sacrifício. PERIGO = Estado de Necessidade; AGRESSÃO = Legítima Defesa.",
    keyPoint: "No EN a fonte pode ser força da natureza, animal ou fato humano sem ser 'agressão injusta'. Quem tem DEVER LEGAL de enfrentar o perigo (art. 24, §1º) NÃO pode invocar EN. O policial não pode fugir do confronto alegando EN.",
    practicalExample: "Dois náufragos disputam uma tábua de salvação: quem empurra o outro age em EN (perigo atual, inevitável, não criado voluntariamente). Motorista que desvia de criança e bate em carro alheio: EN de terceiro.",
    difficulty: "FACIL",
  },
  // ── 3. Legítima Defesa ────────────────────────────────────────────────────
  {
    title: "Legítima Defesa (Art. 25 CP): Requisitos e Abrangência",
    textContent: `Art. 25 CP: "Entende-se em legítima defesa quem, usando moderadamente dos meios necessários, repele agressão injusta, atual ou iminente, a direito seu ou de outrem." Requisitos: (1) AGRESSÃO INJUSTA — conduta humana, não mero perigo; (2) ATUAL ou IMINENTE — agressão passada não justifica; (3) a DIREITO PRÓPRIO ou ALHEIO; (4) MEIOS NECESSÁRIOS com MODERAÇÃO. Distinção: a LD reage a agressão humana; o EN enfrenta perigo. A moderação é o limite — ultrapassá-la gera excesso punível.`,
    mnemonic: "A.A.M.M: Agressão injusta + Atual/iminente + Moderação + Meios necessários. 'Você REPELE AGRESSÃO (LD); você FOGE DE PERIGO (EN).' LD pode ser usada contra inimputáveis — a agressão é injusta OBJETIVAMENTE.",
    keyPoint: "LD pode ser exercida contra INIMPUTÁVEIS (criança, louco, embriagado). O critério é que a agressão seja OBJETIVAMENTE INJUSTA, independentemente da culpabilidade do agressor. Agressão PASSADA (retaliação) não configura LD — é crime.",
    practicalExample: "Policial em confronto usa força necessária contra agressor armado (LD real). Vizinho que mata alguém que o ameaçou há um mês (agressão passada, não atual/iminente): sem LD, responde por homicídio doloso.",
    difficulty: "FACIL",
  },
  // ── 4. Estrito Cumprimento de Dever Legal ────────────────────────────────
  {
    title: "Estrito Cumprimento de Dever Legal: Agentes Públicos e Proporcionalidade",
    textContent: `O Estrito Cumprimento de Dever Legal (ECDL) ocorre quando o agente pratica fato típico no cumprimento de obrigação imposta por lei, regulamento ou decisão judicial. Pressupõe: (1) DEVER LEGAL — não mero direito; (2) ESTRITEZA — sem exceder os limites da obrigação; (3) PROPORCIONALIDADE. Aplica-se a agentes públicos (policial, bombeiro, oficial de justiça) e particulares com obrigação legal específica. O excesso rompe a excludente (art. 23, §único). Diferença do ERD: ECDL = DEVER; ERD = DIREITO.`,
    mnemonic: "DEVER LEGAL = ECDL. PERMISSÃO (direito) = ERD. 'Quem TEM OBRIGAÇÃO usa ECDL; quem TEM DIREITO usa ERD.' Bombeiro que invade casa em chamas: tem DEVER legal → ECDL. Médico que opera com consentimento: tem DIREITO → ERD.",
    keyPoint: "O ECDL exige ESTRITEZA: o agente deve agir APENAS dentro dos limites do dever. Policial que usa força para vencer resistência = ECDL. Policial que espanca preso já imobilizado = excesso → crime doloso.",
    practicalExample: "Policial usa algemas e contém suspeito que resiste à prisão em flagrante: ECDL (dever legal de prender). Veterinário que sacrifica animal por determinação sanitária contra a vontade do dono: ECDL (obrigação legal imposta pela lei sanitária).",
    difficulty: "MEDIO",
  },
  // ── 5. Exercício Regular de Direito ──────────────────────────────────────
  {
    title: "Exercício Regular de Direito: Profissionais e Cidadãos",
    textContent: `O Exercício Regular de Direito (ERD) ampara quem pratica fato típico no exercício de um direito reconhecido pelo ordenamento jurídico. Não requer ser agente público nem ter dever legal — basta ter DIREITO. Exemplos: médico que opera com consentimento (lesão justificada); esportista que causa lesão dentro das regras; advogado que recusa prestar declarações cobertas pelo sigilo profissional; credor que protesta título de dívida legítima. O uso ABUSIVO do direito destrói a excludente e torna o fato ilícito.`,
    mnemonic: "DIREITO → ERD. DEVER → ECDL. 'No ERD você PODE; no ECDL você DEVE.' Médico opera com consentimento → ERD. Policial prende em flagrante → ECDL. Médico opera SEM consentimento de paciente lúcido → sem respaldo em nenhuma excludente.",
    keyPoint: "O ERD é a mais ampla das descriminantes — aplica-se a qualquer particular ou profissional com direito reconhecido. A fronteira: quem usa o direito ABUSIVAMENTE comete ilícito (art. 23, §único por extensão). Todo dever é um direito, mas nem todo direito é um dever.",
    practicalExample: "Boxeador que fratura mandíbula do adversário dentro das regras do esporte: ERD. Torcedor que agride árbitro após o combate: sem respaldo — ato abusivo, além do direito de praticar o esporte.",
    difficulty: "MEDIO",
  },
  // ── 6. Excesso Punível e Descriminantes Putativas ─────────────────────────
  {
    title: "Excesso Punível e Descriminantes Putativas (Art. 23, §único e Art. 20, §1º CP)",
    textContent: `Art. 23, §único CP: o agente que excede os limites de qualquer descriminante responde pelo excesso — doloso ou culposo. EXCESSO DOLOSO: agente sabe que a ameaça cessou e continua agindo → crime doloso. EXCESSO CULPOSO: excede por imprudência/imperícia sem perceber → crime culposo (apenas se houver modalidade culposa prevista em lei). Descriminantes PUTATIVAS (art. 20, §1º CP): agente imagina erroneamente estar em situação de excludente → erro de tipo permissivo: escusável = afasta dolo e culpa; inescusável = afasta dolo, pune culposamente se houver previsão.`,
    mnemonic: "'EXCESSO = CRIME. Doloso → crime doloso. Culposo → culposo (se previsto em lei). Putativa = imaginada. Agente ERRA sobre os FATOS da excludente (erro de tipo permissivo): escusável = isento; inescusável = culposo.'",
    keyPoint: "Excesso DOLOSO: agente percebeu que a ameaça cessou e voluntariamente continuou → crime doloso. Excesso CULPOSO: agente não percebeu por imprudência → culposo (só se houver tipo culposo). Putativa: erro sobre pressupostos fáticos — afasta sempre o dolo.",
    practicalExample: "Agente repele agressão com 3 facadas (proporcional). Agressor cai e solta a arma. Agente PERCEBE a cessação e continua a esfaquear: excesso DOLOSO → homicídio doloso. Policial que por imprudência dispara a mais sem perceber que o agressor já estava neutralizado: excesso CULPOSO → homicídio culposo.",
    difficulty: "DIFICIL",
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
  alternatives: Alternative[];
  correctAnswer: string;
  correctOption: number;
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  contentTitle: string;
}

const questions: QuestionData[] = [
  // ── Q1 — EN vs. LD: Distinção Fundamental (Municipal / FACIL) ─────────────
  {
    id: "qz_dpen_ei_001",
    statement: "A distinção fundamental entre o estado de necessidade e a legítima defesa reside em que:",
    alternatives: [
      { letter: "A", text: "No estado de necessidade a fonte do perigo pode ser um fato natural, animal ou humano sem ser 'agressão injusta'; na legítima defesa a fonte é sempre uma agressão humana injusta." },
      { letter: "B", text: "O estado de necessidade só é cabível quando o perigo é iminente, ao passo que a legítima defesa exige perigo atual." },
      { letter: "C", text: "A legítima defesa pode ser exercida apenas por agentes públicos, ao contrário do estado de necessidade, que qualquer pessoa pode invocar." },
      { letter: "D", text: "Ambos exigem que o perigo seja criado por terceiro; a diferença está exclusivamente na proporcionalidade dos meios utilizados." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "Estado de Necessidade (art. 24 CP): a fonte é um PERIGO — pode ser força da natureza, animal ou fato humano (sem ser 'agressão injusta'). Legítima Defesa (art. 25 CP): a fonte é uma AGRESSÃO HUMANA INJUSTA. Mnemônico: 'LD repele AGRESSÃO; EN foge de PERIGO.' Ambas podem ser invocadas por qualquer pessoa. Atenção: o EN exige perigo ATUAL (não mero iminente); a LD admite agressão atual OU iminente.",
    explanationCorrect: "Perfeito! A distinção-chave: EN enfrenta PERIGO (qualquer origem); LD repele AGRESSÃO HUMANA INJUSTA. Mnemônico: 'Perigo = EN; Agressão = LD.' Essa diferença é cobrada com altíssima frequência no CEBRASPE.",
    explanationWrong: "Atenção: (B) errada — EN exige perigo ATUAL, não iminente; a LD é que admite agressão atual OU iminente. (C) errada — ambas podem ser invocadas por qualquer pessoa. (D) errada — o critério não é de criação por terceiro, mas a natureza da fonte (perigo vs. agressão humana injusta).",
    difficulty: "FACIL",
    contentTitle: "Excludentes de Ilicitude: Visão Geral e o Mnemônico L.E.E.E",
  },
  // ── Q2 — Requisitos da LD: o que NÃO é requisito (Municipal / FACIL) ──────
  {
    id: "qz_dpen_ei_002",
    statement: "Nos termos do art. 25 do Código Penal, são requisitos da legítima defesa, EXCETO:",
    alternatives: [
      { letter: "A", text: "Agressão injusta, atual ou iminente." },
      { letter: "B", text: "Utilização moderada dos meios necessários." },
      { letter: "C", text: "O perigo não ter sido criado voluntariamente pelo próprio agente." },
      { letter: "D", text: "Defesa de direito próprio ou alheio." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O requisito 'não ter criado voluntariamente o perigo' é do ESTADO DE NECESSIDADE (art. 24 CP), não da legítima defesa. Os quatro requisitos da LD (art. 25 CP) são: (1) agressão injusta; (2) atual ou iminente; (3) a direito próprio ou alheio; (4) meios necessários com moderação. Na legítima defesa analisa-se se a agressão era injusta e se a reação foi proporcional — a origem voluntária ou não do conflito pode influir no excesso, mas não é requisito autônomo da excludente.",
    explanationCorrect: "Exato! 'Perigo não criado voluntariamente' é requisito do ESTADO DE NECESSIDADE (art. 24), não da legítima defesa (art. 25). Os 4 requisitos da LD: Agressão injusta + Atual/iminente + Direito próprio ou alheio + Meios necessários com moderação.",
    explanationWrong: "Cuidado com a confusão entre EN e LD. 'Não ter criado voluntariamente o perigo' é exclusivo do Estado de Necessidade (art. 24, caput CP). Na Legítima Defesa, o que importa é a injustiça OBJETIVA da agressão e a proporcionalidade da reação — não a origem do conflito.",
    difficulty: "FACIL",
    contentTitle: "Legítima Defesa (Art. 25 CP): Requisitos e Abrangência",
  },
  // ── Q3 — ECDL: veterinário (Municipal / FACIL) ────────────────────────────
  {
    id: "qz_dpen_ei_003",
    statement: "Um veterinário público sacrifica animal doente por força de determinação da vigilância sanitária, ainda que o proprietário se oponha veementemente. Qual excludente de ilicitude ampara a conduta do veterinário?",
    alternatives: [
      { letter: "A", text: "Legítima defesa coletiva, pois age em proteção da coletividade contra um perigo." },
      { letter: "B", text: "Estado de necessidade, pois há perigo atual de contágio à população." },
      { letter: "C", text: "Estrito cumprimento de dever legal, pois age por imposição de obrigação legal." },
      { letter: "D", text: "Exercício regular de direito, pois é profissional habilitado pelo CFMV." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O veterinário age por DEVER LEGAL imposto pela legislação sanitária — não por mero direito profissional. Isso configura Estrito Cumprimento de Dever Legal (art. 23, III, 1ª parte CP). O ERD (alternativa D) aplicar-se-ia se a lei lhe conferisse uma PERMISSÃO; aqui ela lhe impõe uma OBRIGAÇÃO. O Estado de Necessidade não se aplica quando há dever legal específico para agir (art. 24, §1º). 'Legítima defesa coletiva' não é categoria autônoma no CP.",
    explanationCorrect: "Correto! O veterinário tem DEVER LEGAL de agir — lei sanitária impõe a obrigação. Isso é ECDL (não ERD). A distinção-chave: DEVER → ECDL; mero DIREITO → ERD.",
    explanationWrong: "ERD vs. ECDL: no ERD o agente TEM DIREITO; no ECDL o agente TEM OBRIGAÇÃO. O veterinário NÃO age por opção profissional — age porque a lei sanitária O OBRIGA. Isso é ECDL. O Estado de Necessidade não se aplica quando há dever legal específico (art. 24, §1º CP).",
    difficulty: "FACIL",
    contentTitle: "Estrito Cumprimento de Dever Legal: Agentes Públicos e Proporcionalidade",
  },
  // ── Q4 — ERD: boxeador (Municipal / FACIL) ────────────────────────────────
  {
    id: "qz_dpen_ei_004",
    statement: "Um boxeador profissional, durante combate oficial e dentro das regras do esporte, desfere golpe que fratura a mandíbula do adversário. Sobre a conduta do boxeador, é CORRETO afirmar:",
    alternatives: [
      { letter: "A", text: "O fato é atípico, pois não há conduta dolosa em esporte regulamentado." },
      { letter: "B", text: "O fato é típico e ilícito, pois lesão corporal é crime independentemente do contexto esportivo." },
      { letter: "C", text: "O fato é típico mas lícito, amparado pelo exercício regular de direito." },
      { letter: "D", text: "O fato é típico mas lícito, amparado pelo estrito cumprimento de dever legal, pois o regulamento esportivo impõe o combate." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O boxeador TEM DIREITO de praticar o esporte e causar lesões dentro das regras — não tem DEVER de lesionar. Isso é Exercício Regular de Direito (art. 23, III, in fine, CP). A conduta É TÍPICA (lesão corporal, art. 129 CP) — o boxeador dolosamente fratura a mandíbula. Mas a ilicitude é afastada pelo ERD. (D) é incorreta porque o boxeador não tem DEVER LEGAL de lutar — tem direito, não obrigação.",
    explanationCorrect: "Perfeito! ERD: o boxeador PODE lutar dentro das regras — tem direito. O fato é TÍPICO (lesão dolosa), mas a ilicitude é afastada. Distinção: dever legal (ECDL) vs. direito (ERD). Boxeador tem direito, não dever.",
    explanationWrong: "A conduta do boxeador é TÍPICA (há lesão corporal dolosa). O que afasta a ilicitude é o ERD — não a atipicidade. O ECDL seria aplicável se houvesse DEVER LEGAL de lutar (obrigação), o que não ocorre. O boxeador TEM DIREITO, não dever.",
    difficulty: "FACIL",
    contentTitle: "Exercício Regular de Direito: Profissionais e Cidadãos",
  },
  // ── Q5 — EN: art. 24 §2º (Estadual / MEDIO) ──────────────────────────────
  {
    id: "qz_dpen_ei_005",
    statement: "Nos termos do art. 24, §2º, do Código Penal, quando o estado de necessidade não exclui a ilicitude — pois era razoável exigir-se o sacrifício do direito ameaçado —, o juiz pode:",
    alternatives: [
      { letter: "A", text: "Reconhecer a excludente de culpabilidade e absolver o agente por inexigibilidade de conduta diversa." },
      { letter: "B", text: "Reduzir a pena de um a dois terços, a seu critério." },
      { letter: "C", text: "Excluir a punibilidade pela inexistência de resultado lesivo relevante." },
      { letter: "D", text: "Aplicar apenas pena de multa, sem privação de liberdade, como medida de equidade." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O art. 24, §2º CP: quando era RAZOÁVEL exigir que o agente suportasse o perigo (sacrificou bem de maior valor que o protegido), a excludente de ilicitude NÃO se configura. Porém, o juiz PODE (faculdade, não obrigação) reduzir a pena de 1/3 a 2/3. Não há absolvição, não há exclusão autônoma de culpabilidade no CP (teoria unitária), nem supressão de pena privativa de liberdade.",
    explanationCorrect: "Correto! Art. 24, §2º: sem a excludente (sacrifício desproporcional), o juiz PODE reduzir a pena de 1/3 a 2/3. Essa é a válvula de equidade do CP para casos de EN com proporcionalidade questionável. Faculdade do juiz — não obrigação.",
    explanationWrong: "O art. 24, §2º prevê apenas a REDUÇÃO de pena (1/3 a 2/3), não absolvição nem exclusão de culpabilidade. O CP adota a teoria UNITÁRIA: não há EN exculpante como na teoria diferenciadora alemã. Quando a ilicitude não é afastada, o réu é condenado — com pena possivelmente reduzida.",
    difficulty: "MEDIO",
    contentTitle: "Estado de Necessidade (Art. 24 CP): Requisitos e Proporcionalidade",
  },
  // ── Q6 — LD de Terceiro (Estadual / MEDIO) ────────────────────────────────
  {
    id: "qz_dpen_ei_006",
    statement: "Um cidadão comum presencia um homem armado tentando assaltar e ameaçar uma mulher. Para protegê-la, agride o criminoso e lhe causa lesões moderadas. A excludente de ilicitude aplicável à conduta do cidadão é:",
    alternatives: [
      { letter: "A", text: "Estado de necessidade de terceiro, pois havia perigo atual à integridade da vítima." },
      { letter: "B", text: "Legítima defesa de terceiro, pois o cidadão repele agressão injusta a direito alheio com meios necessários e moderação." },
      { letter: "C", text: "Exercício regular de direito, pois qualquer cidadão tem direito de defender terceiros em perigo." },
      { letter: "D", text: "Não há excludente, pois a legítima defesa de terceiro só pode ser exercida por agentes públicos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O art. 25 CP expressamente permite a legítima defesa de TERCEIRO ('a direito seu ou de outrem'). A mulher sofria AGRESSÃO INJUSTA ATUAL do criminoso armado. O cidadão agiu com meios necessários e moderação para repelir essa agressão. Configura-se a legítima defesa de terceiro — qualquer pessoa pode exercê-la, não apenas agentes públicos. O EN (alt. A) não é adequado: a fonte é uma AGRESSÃO HUMANA INJUSTA, não um mero perigo.",
    explanationCorrect: "Perfeito! Legítima Defesa de TERCEIRO — art. 25 CP: 'a direito seu ou de outrem'. Qualquer cidadão pode defender terceiros de agressão injusta atual. Ameaça com arma = agressão injusta atual → LD de terceiro com meios necessários e moderação.",
    explanationWrong: "A fonte é uma AGRESSÃO HUMANA INJUSTA (assaltante armado), não perigo natural — por isso LD, não EN. O art. 25 CP expressamente permite LD de terceiros para qualquer pessoa. O ERD não se aplica pois não há 'direito específico' de intervir em agressões — há legitimidade de defesa.",
    difficulty: "MEDIO",
    contentTitle: "Legítima Defesa (Art. 25 CP): Requisitos e Abrangência",
  },
  // ── Q7 — Excesso Doloso (Estadual / MEDIO) ────────────────────────────────
  {
    id: "qz_dpen_ei_007",
    statement: "Um agente repele agressão injusta com três golpes, proporcional à ameaça. O agressor cai, solta a arma e perde a consciência — a ameaça cessou objetivamente. O agente, PERCEBENDO que a ameaça cessou, continua desferindo golpes, causando a morte do agressor. A responsabilidade pelo excesso é:",
    alternatives: [
      { letter: "A", text: "Excluída integralmente, pois o agente estava legitimamente em legítima defesa no início do episódio." },
      { letter: "B", text: "Dolosa — após cessar a agressão, os golpes adicionais configuram excesso punível doloso (art. 23, §único CP)." },
      { letter: "C", text: "Culposa — o agente agiu por imprudência ao não perceber que a ameaça havia cessado." },
      { letter: "D", text: "Excluída pela teoria da actio libera in causa, pois a situação de perigo foi criada pelo próprio agressor." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Três primeiros golpes: legítima defesa válida. Quando o agressor caiu e a ameaça cessou, extinguiu-se a excludente. O agente PERCEBENDO que a ameaça cessou, continuou a agir conscientemente — excesso DOLOSO (art. 23, §único CP): o agente sabia que a excludente havia terminado e deliberadamente prosseguiu. Responde por homicídio doloso. Excesso culposo ocorreria se o agente NÃO percebesse (por imprudência) que a ameaça cessou.",
    explanationCorrect: "Correto! Excesso DOLOSO: o agente PERCEBEU que a ameaça cessou e VOLUNTARIAMENTE continuou. Art. 23, §único CP → responsabilidade dolosa. A legítima defesa inicial não 'cobre' os atos praticados após cessada a agressão.",
    explanationWrong: "O início lícito (LD) não contamina o excesso subsequente. Quando a ameaça cessou, a excludente deixou de existir. Excesso culposo seria para quem NÃO percebeu por imprudência. Aqui o enunciado diz que o agente 'PERCEBEU' — logo é dolo, não culpa.",
    difficulty: "MEDIO",
    contentTitle: "Excesso Punível e Descriminantes Putativas (Art. 23, §único e Art. 20, §1º CP)",
  },
  // ── Q8 — C/E CEBRASPE: LD contra inimputável (Estadual / MEDIO) ───────────
  {
    id: "qz_dpen_ei_008",
    statement: "Julgue o item.\n\nA legítima defesa somente pode ser exercida contra agressão proveniente de pessoa imputável; sendo o agressor inimputável (criança, louco ou embriagado involuntário), a excludente aplicável é o estado de necessidade, não a legítima defesa.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "ERRADO. A legítima defesa pode ser exercida contra agressão de INIMPUTÁVEIS. O requisito 'agressão injusta' é OBJETIVO: analisa-se a injustiça da agressão, não a culpabilidade do agressor. Uma criança que ataca com faca pratica agressão OBJETIVAMENTE INJUSTA — cabe legítima defesa. A doutrina majoritária não exige que o agressor seja culpável. Esse é um dos equívocos mais explorados pelo CEBRASPE em Direito Penal.",
    explanationCorrect: "Gabarito: ERRADO. A 'agressão injusta' é julgada OBJETIVAMENTE, independentemente da culpabilidade do agressor. Inimputáveis podem ser repelidos em LD. Clássica pegadinha CEBRASPE.",
    explanationWrong: "O requisito 'agressão injusta' da LD não exige que o agressor seja culpável — avalia-se a injustiça OBJETIVA do ato. Criança, louco e embriagado involuntário podem ser alvo de legítima defesa. A distinção LD vs. EN para agressão de inimputáveis é controvertida, mas o entendimento majoritário admite LD.",
    difficulty: "MEDIO",
    contentTitle: "Legítima Defesa (Art. 25 CP): Requisitos e Abrangência",
  },
  // ── Q9 — C/E CEBRASPE: LD Putativa / erro de tipo permissivo (Federal / DIFICIL)
  {
    id: "qz_dpen_ei_009",
    statement: "Julgue o item.\n\nNa legítima defesa putativa, o agente imagina erroneamente que está sendo agredido injustamente. Segundo o art. 20, §1º, do Código Penal, essa situação configura erro de tipo permissivo que, se escusável, afasta o dolo e a culpa; se inescusável, afasta o dolo mas permite a punição a título culposo, caso haja previsão legal da modalidade culposa.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CERTO. O art. 20, §1º CP trata das descriminantes putativas: quem, por erro plenamente justificado pelas circunstâncias (escusável), supõe situação de fato que, se existisse, tornaria a ação legítima — isenta de pena (afasta dolo e culpa). Se o erro for injustificável (inescusável), aplica-se o tratamento da culpa — o agente responde culposamente se houver tipo culposo correspondente. O 'erro de tipo permissivo' é a denominação doutrinária correta para essa figura.",
    explanationCorrect: "Gabarito: CERTO. Art. 20, §1º CP — erro de tipo permissivo (descriminante putativa): escusável = isento de pena; inescusável = responsabilidade culposa (se houver tipo culposo). Conceituação precisa e plenamente compatível com a lei.",
    explanationWrong: "O art. 20, §1º CP expressamente prevê: erro escusável → isenta de pena; erro inescusável → punição na modalidade culposa. A denominação 'erro de tipo permissivo' é tecnicamente correta. O item está CORRETO — não há falha na proposição.",
    difficulty: "DIFICIL",
    contentTitle: "Excesso Punível e Descriminantes Putativas (Art. 23, §único e Art. 20, §1º CP)",
  },
  // ── Q10 — C/E CEBRASPE: Excesso culposo e previsão legal (Federal / DIFICIL)
  {
    id: "qz_dpen_ei_010",
    statement: "Julgue o item.\n\nO excesso culposo nas descriminantes previstas no art. 23 do Código Penal implica responsabilidade penal em qualquer hipótese, independentemente de o tipo penal incidir ter previsão de modalidade culposa, pois o parágrafo único do art. 23 estabelece punibilidade genérica pelo excesso.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "ERRADO. O excesso culposo só gera responsabilidade se o crime praticado no excesso tiver PREVISÃO LEGAL DE MODALIDADE CULPOSA. O art. 23, §único CP remete à estrutura geral do crime: 'responde pelo excesso doloso ou culposo' — mas para responsabilidade culposa deve existir o tipo culposo correspondente. Exemplo: dano culposo não é crime (art. 163 CP só prevê dano doloso) — excesso culposo que causa apenas dano patrimonial não gera crime. O CP não criou punibilidade genérica pelo excesso.",
    explanationCorrect: "Gabarito: ERRADO. Excesso CULPOSO só é punível se houver tipo culposo previsto em lei. Não há punibilidade genérica. Se o crime não tiver modalidade culposa, o excesso culposo é impunível — fato atípico. Detalhe clássico explorado pelo CEBRASPE/PF.",
    explanationWrong: "Art. 23, §único diz que o agente responde 'dolosa ou culposamente' — mas isso NÃO cria modalidade culposa onde não existe. Excesso culposo só é punível se o crime praticado (ex.: homicídio culposo, art. 121, §3º) tiver previsão expressa de modalidade culposa. Sem previsão = fato atípico pelo excesso.",
    difficulty: "DIFICIL",
    contentTitle: "Excesso Punível e Descriminantes Putativas (Art. 23, §único e Art. 20, §1º CP)",
  },
  // ── Q11 — EN: Teoria Unitária e bem de maior valor (Federal / DIFICIL) ─────
  {
    id: "qz_dpen_ei_011",
    statement: "Sobre o estado de necessidade no Código Penal brasileiro, que adota a teoria unitária, quando o bem jurídico sacrificado for de maior valor que o bem preservado, a consequência jurídica CORRETA é:",
    alternatives: [
      { letter: "A", text: "Exclusão da ilicitude com obrigatória redução da pena no dobro do mínimo legal." },
      { letter: "B", text: "Exclusão da culpabilidade por inexigibilidade de conduta diversa, nos moldes da teoria diferenciadora alemã." },
      { letter: "C", text: "O estado de necessidade não exclui a ilicitude; o juiz pode, facultativamente, reduzir a pena de um a dois terços (art. 24, §2º CP)." },
      { letter: "D", text: "A proporcionalidade dos bens não é requisito do estado de necessidade no CP — apenas a inevitabilidade do ato é exigida." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O CP adota a Teoria UNITÁRIA: o EN funciona como excludente de ilicitude quando o sacrifício é razoável (bem preservado ≥ bem sacrificado). Se o bem sacrificado for de MAIOR valor, a excludente de ilicitude NÃO se configura — porém o art. 24, §2º CP permite ao juiz reduzir a pena de 1/3 a 2/3 (faculdade judicial). A teoria diferenciadora (alt. B), que distingue EN justificante de EN exculpante, é adotada na Alemanha mas NÃO pelo Brasil.",
    explanationCorrect: "Correto! Teoria Unitária do CP: sem proporcionalidade (bem sacrificado > bem preservado) → sem excludente de ilicitude → mas juiz PODE reduzir pena de 1/3 a 2/3 (art. 24, §2º). Brasil NÃO adota teoria diferenciadora alemã.",
    explanationWrong: "O CP adota a TEORIA UNITÁRIA — EN exclui apenas ilicitude (não culpabilidade). A teoria diferenciadora é estrangeira. Quando o bem sacrificado é maior, não há excludente — há apenas faculdade de redução de pena (art. 24, §2º). A proporcionalidade (razoabilidade do sacrifício) é, sim, requisito implícito do EN no CP.",
    difficulty: "DIFICIL",
    contentTitle: "Estado de Necessidade (Art. 24 CP): Requisitos e Proporcionalidade",
  },
  // ── Q12 — Policial: LD real + excesso doloso (Federal / DIFICIL) ──────────
  {
    id: "qz_dpen_ei_012",
    statement: "Um policial é atacado por indivíduo armado. Defende-se com três disparos — o agressor cai, solta a arma e perde a consciência. Percebendo que a ameaça cessou definitivamente, o policial efetua dois disparos adicionais, causando a morte do agressor. Assinale a opção CORRETA:",
    alternatives: [
      { letter: "A", text: "A conduta integral está amparada pela legítima defesa, pois os disparos adicionais são parte da mesma reação defensiva iniciada licitamente." },
      { letter: "B", text: "Os três primeiros disparos são amparados pela legítima defesa real; os dois adicionais configuram excesso punível DOLOSO, tornando o policial penalmente responsável por homicídio doloso pelo excesso (art. 23, §único CP)." },
      { letter: "C", text: "A conduta é amparada integralmente pelo estrito cumprimento de dever legal, pois o policial agiu em serviço e em situação de risco." },
      { letter: "D", text: "Os disparos adicionais configuram excesso CULPOSO, pois o agente não tinha dolo específico de matar o agressor, apenas de neutralizá-lo." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Três primeiros disparos: legítima defesa válida (agressão injusta atual + meios necessários + moderação). Quando o agressor caiu e a ameaça cessou, extinguiu-se a excludente. O policial, PERCEBENDO que a ameaça cessou, efetuou dois disparos adicionais com CONSCIÊNCIA E VONTADE → excesso DOLOSO (art. 23, §único CP) → homicídio doloso pelo excesso. O ECDL não cobre o excesso — o dever legal não autoriza eliminar quem já foi neutralizado.",
    explanationCorrect: "Perfeito! Três disparos = LD válida. Dois adicionais (após cessar a ameaça, com PERCEPÇÃO do policial) = excesso DOLOSO. Art. 23, §único CP → homicídio doloso. ECDL não se estende ao excesso. Questão-modelo para provas PF/DEPEN/PC.",
    explanationWrong: "Excesso CULPOSO ocorre quando o agente NÃO percebe que a ameaça cessou (por imprudência). Aqui o policial PERCEBEU e mesmo assim atirou → dolo. O início lícito (LD) não contamina o excesso subsequente — são atos autônomos. ECDL não autoriza execução de agressor já neutralizado.",
    difficulty: "DIFICIL",
    contentTitle: "Excesso Punível e Descriminantes Putativas (Art. 23, §único e Art. 20, §1º CP)",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n⚖️  Seed: Direito Penal — Excludentes de Ilicitude (Art. 23 CP)\n");

  // ── 1. Encontrar Subject ────────────────────────────────────────────────
  const subjectId = await findSubject("DIREITO_PENAL");
  if (!subjectId) {
    console.error("❌ Subject 'DIREITO_PENAL' não encontrado no banco.");
    process.exit(1);
  }
  console.log(`✅ Subject encontrado: ${subjectId}`);

  // ── 2. Garantir colunas Phase 5 em Question ────────────────────────────
  for (const [col, def] of [
    ["correctOption", "INTEGER"],
    ["explanationCorrect", "TEXT"],
    ["explanationWrong", "TEXT"],
  ] as const) {
    try {
      await db.execute(sql.raw(`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "${col}" ${def}`));
    } catch (e: any) {
      console.warn(`⚠️  Question.${col}: ${e?.message?.split("\n")[0]}`);
    }
  }

  // ── 3. Garantir colunas Phase 5 em Content ─────────────────────────────
  for (const [col, def] of [
    ["mnemonic", "TEXT"],
    ["keyPoint", "TEXT"],
    ["practicalExample", "TEXT"],
  ] as const) {
    try {
      await db.execute(sql.raw(`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS "${col}" ${def}`));
    } catch (e: any) {
      console.warn(`⚠️  Content.${col}: ${e?.message?.split("\n")[0]}`);
    }
  }
  console.log("✅ Colunas Phase 5 garantidas.");

  // ── 4. Encontrar ou criar Topic ────────────────────────────────────────
  const topicId = await findOrCreateTopic("Excludentes de Ilicitude — Art. 23 CP", subjectId);
  console.log(`✅ Topic: ${topicId}`);

  // ── 5. Inserir Conteúdos ────────────────────────────────────────────────
  const contentIdMap: Record<string, string> = {};
  let contentCreated = 0, contentSkipped = 0;

  for (const c of contents) {
    if (await contentExists(c.title, subjectId)) {
      const existingId = await getContentId(c.title, subjectId);
      if (existingId) contentIdMap[c.title] = existingId;
      console.log(`  ⏭  Conteúdo já existe: ${c.title}`);
      contentSkipped++;
      continue;
    }

    const id = nanoId("ct");
    const wordCount = c.textContent.split(/\s+/).length;
    await db.execute(sql`
      INSERT INTO "Content" (
        "id", "title", "textContent", "subjectId", "topicId",
        "isActive", "difficulty",
        "wordCount", "estimatedReadTime",
        "mnemonic", "keyPoint", "practicalExample",
        "createdAt", "updatedAt"
      ) VALUES (
        ${id}, ${c.title}, ${c.textContent}, ${subjectId}, ${topicId},
        true, ${c.difficulty},
        ${wordCount}, ${Math.ceil(wordCount / 200)},
        ${c.mnemonic}, ${c.keyPoint}, ${c.practicalExample},
        NOW(), NOW()
      )
    `);
    contentIdMap[c.title] = id;
    console.log(`  ✅ Conteúdo criado: ${c.title} (${id})`);
    contentCreated++;
  }

  // ── 6. Inserir Questões ─────────────────────────────────────────────────
  let questionCreated = 0, questionSkipped = 0;

  for (const q of questions) {
    if (await questionExists(q.id)) {
      console.log(`  ⏭  Questão já existe: ${q.id}`);
      questionSkipped++;
      continue;
    }

    const contentId = contentIdMap[q.contentTitle];
    if (!contentId) {
      console.warn(`  ⚠️  Conteúdo não encontrado para questão ${q.id}: '${q.contentTitle}'`);
      continue;
    }

    const alternativesJson = JSON.stringify(q.alternatives);

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
        0, 'MULTIPLA_ESCOLHA',
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Questão criada: ${q.id}`);
    questionCreated++;
  }

  // ── Relatório ────────────────────────────────────────────────────────────
  console.log("\n─────────────────────────────────────────");
  console.log(`📚 Conteúdos: ${contentCreated} criados, ${contentSkipped} já existiam`);
  console.log(`❓ Questões:  ${questionCreated} criadas,  ${questionSkipped} já existiam`);
  console.log("─────────────────────────────────────────\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed falhou:", err);
  process.exit(1);
});
