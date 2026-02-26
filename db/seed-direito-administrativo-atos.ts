/**
 * Seed: Direito Administrativo — Atos Administrativos
 * (Conceito, Atributos PIAT, Elementos COMFI, Vinculados/Discricionários,
 *  Revogação/Anulação, Teoria dos Motivos Determinantes e Convalidação)
 *
 * Popula 6 átomos de Conteúdo + 12 Questões.
 * Idempotente: verifica existência antes de inserir.
 * TODAS as questões têm "contentId" vinculado ao átomo correto.
 *
 * Execução:
 *   npx tsx db/seed-direito-administrativo-atos.ts
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
  // ── 1. Conceito e Requisitos de Validade ─────────────────────────────────
  {
    title: "Ato Administrativo: Conceito, Validade e Presunção de Legitimidade",
    textContent: `Ato administrativo é toda manifestação unilateral de vontade da Administração Pública que, agindo nessa qualidade, produz efeitos jurídicos imediatos. Requisitos de validade (elementos): Competência, Objeto, Forma, Motivo e Finalidade — mnemônico COMFI. Presunção de legitimidade: todo ato administrativo presume-se legal e verdadeiro até prova em contrário (presunção relativa — juris tantum). Isso inverte o ônus da prova: quem alega ilegalidade deve provar.`,
    mnemonic: "COMFI: Competência (quem?), Objeto (o quê?), Motivo (por quê?), Finalidade (para quê?), soFrma (como?). Sem qualquer COMFI, o ato é inválido.",
    keyPoint: "Presunção de legitimidade é RELATIVA (juris tantum) — admite prova em contrário. Não confundir com certeza absoluta. O ônus de provar a ilegalidade é de quem alega.",
    practicalExample: "Policial lavra auto de infração (ato administrativo). O autuado discorda e deve provar no judiciário que o ato é inválido — a Administração não precisa provar que agiu corretamente (presunção de legitimidade inverte o ônus).",
    difficulty: "FACIL",
  },
  // ── 2. Atributos PIAT ────────────────────────────────────────────────────
  {
    title: "Atributos do Ato Administrativo: PIAT (Presunção, Imperatividade, Autoexecutoriedade, Tipicidade)",
    textContent: `Os 4 atributos do ato administrativo — PIAT: (P) Presunção de Legitimidade e Veracidade; (I) Imperatividade — o ato obriga terceiros independentemente de sua concordância; (A) Autoexecutoriedade — a Administração executa o ato por meios próprios, sem precisar de autorização judicial (só quando lei permite ou em caso de urgência); (T) Tipicidade — os atos administrativos devem estar previstos em lei. ATENÇÃO: nem todo ato tem todos os atributos (ex.: atos negociais não têm imperatividade).`,
    mnemonic: "PIAT: P = Presumido, I = Impõe sem consentimento, A = Age sem judiciário, T = Tipificado em lei. Autoexecutoriedade NÃO é absoluta — exige previsão legal ou urgência.",
    keyPoint: "Autoexecutoriedade NÃO está em todos os atos — é o atributo que mais cai em prova. Cobrança de multa NÃO é autoexecutória (precisa de execução fiscal). Demolição de obra clandestina urgente É autoexecutória.",
    practicalExample: "Agente da vigilância sanitária interdita restaurante insalubre na hora (autoexecutoriedade — urgência). Para cobrar a multa posteriormente, o Fisco precisa de execução fiscal — sem autoexecutoriedade na fase de cobrança.",
    difficulty: "FACIL",
  },
  // ── 3. Elementos COMFI ───────────────────────────────────────────────────
  {
    title: "Elementos do Ato Administrativo: Competência, Objeto, Motivo, Finalidade e Forma",
    textContent: `Os 5 elementos (requisitos) do ato administrativo segundo a doutrina majoritária: (1) Competência: poder legal para praticar o ato — é de exercício obrigatório, improrrogável (salvo delegação/avocação), irrenunciável; (2) Objeto (conteúdo): efeito jurídico imediato produzido — deve ser lícito, possível, determinado/determinável; (3) Motivo: situação de fato e de direito que impulsiona o ato (pressuposto fático + legal); (4) Finalidade: interesse público a atingir — a lei define; desvio de finalidade = vício; (5) Forma: modo de exteriorização — regra: escrita, salvo exceções legais (forma verbal em urgência).`,
    mnemonic: "COMFI mapa: C = Competência (sujeito), O = Objeto (efeito), M = Motivo (causa), Fi = Finalidade (objetivo), F = Forma (exteriorização). Todos os 5 devem estar presentes e válidos.",
    keyPoint: "Desvio de finalidade (desvio de poder) vicia o ato na finalidade — mesmo que os demais elementos estejam corretos. Exemplo: punir funcionário por motivo de perseguição pessoal, não por falta disciplinar.",
    practicalExample: "Prefeito desapropria terreno (competência ✓) para construir escola (finalidade pública ✓) com avaliação do imóvel (motivo ✓) por decreto (forma ✓) especificando o bem (objeto ✓) → ato válido em todos os COMFI.",
    difficulty: "FACIL",
  },
  // ── 4. Vinculados vs Discricionários ─────────────────────────────────────
  {
    title: "Atos Vinculados vs Discricionários: Mérito Administrativo",
    textContent: `Ato VINCULADO: a lei define todos os requisitos de modo exaustivo — o agente não tem margem de escolha; deve agir quando presentes os pressupostos (ex.: licença de construção se o projeto atende às normas). Ato DISCRICIONÁRIO: a lei confere margem de conveniência e oportunidade ao administrador — mérito administrativo. O Judiciário controla a LEGALIDADE do ato discricionário (competência, forma, finalidade, motivo declarado), mas NÃO controla o mérito (conveniência/oportunidade). Exceção: abuso de poder, desvio de finalidade, proporcionalidade flagrante.`,
    mnemonic: "VINCULADO = a lei diz tudo, agente executa. DISCRICIONÁRIO = lei deixa espaço → agente escolhe conveniência e oportunidade (= mérito). Judiciário não entra no mérito, só na legalidade.",
    keyPoint: "O Judiciário pode anular ato discricionário ilegal, mas NÃO pode substituir a escolha do administrador por sua própria conveniência. Controle judicial: sempre de LEGALIDADE, nunca de MÉRITO.",
    practicalExample: "Policial flagra em flagrante delito: PRESO — ato vinculado (sem margem). Delegado decide instaurar IPL por portaria: discricionário (conveniência/oportunidade). Judiciário pode anular o IPL se instaurado ilegalmente, mas não pode ordenar ao Delegado como conduzir a investigação.",
    difficulty: "MEDIO",
  },
  // ── 5. Extinção: Revogação vs Anulação ───────────────────────────────────
  {
    title: "Extinção dos Atos Administrativos: Revogação vs Anulação",
    textContent: `REVOGAÇÃO: extinção de ato LEGAL por razões de conveniência/oportunidade (mérito). Efeitos ex-nunc (não retroage). Praticada pela própria Administração (controle interno). Só pode recair sobre atos discricionários. ANULAÇÃO (invalidação): extinção de ato ILEGAL. Efeitos ex-tunc (retroage à origem). Pode ser feita pela Administração (autotutela — Súmula 473 STF) ou pelo Judiciário. Decadência administrativa: Administração tem 5 anos para anular ato que produziu efeitos favoráveis ao particular de boa-fé (Lei 9.784/99, art. 54). Judiciário: 5 anos para atos ilegais (ou prescrição quinquenal).`,
    mnemonic: "REV = ato Legal + Conveniência + Ex-Nunc (futuro). ANUL = ato ILegal + Vício + Ex-Tunc (retroage). Lembre: R de Revogação = Racionalmente ok mas não é mais necessário. A de Anulação = Apagado desde o início.",
    keyPoint: "Revogação não retroage — atos praticados sob o ato revogado são válidos. Anulação retroage — atos praticados sob o ato anulado tornam-se inválidos, mas efeitos para terceiros de boa-fé devem ser preservados. Atos vinculados NÃO podem ser revogados.",
    practicalExample: "Prefeitura concede autorização para banca de jornal (ato discricionário). Anos depois, por requalificação urbana, revoga a autorização (conveniência) — efeitos ex-nunc, banca não pode exigir retroação. Se a autorização foi obtida com documentação falsa (vício): ANULAÇÃO — retroage, como se nunca tivesse existido.",
    difficulty: "MEDIO",
  },
  // ── 6. Teoria dos Motivos Determinantes e Convalidação ───────────────────
  {
    title: "Teoria dos Motivos Determinantes e Convalidação dos Atos Administrativos",
    textContent: `TEORIA DOS MOTIVOS DETERMINANTES: os motivos declarados vinculam a validade do ato, mesmo que a lei não exija motivação. Se o motivo declarado for falso ou inexistente, o ato é ANULADO — independentemente de a motivação ser obrigatória. CONVALIDAÇÃO (saneamento): correção de vício formal ou de competência, com efeitos ex-tunc, tornando o ato válido desde o início. ATENÇÃO: só podem ser convalidados os vícios de: (a) Competência (salvo competência exclusiva) e (b) Forma (quando não essencial). Vícios de Objeto, Motivo e Finalidade são INSANÁVEIS — o ato deve ser anulado, não convalidado.`,
    mnemonic: "MOTIVO FALSO = ato cai, mesmo que lei não exigisse motivo. CONV = só Competência e Forma (CoFo) são sanáveis. OMF (Objeto, Motivo, Finalidade) são insanáveis — vício → anulação.",
    keyPoint: "Convalidação tem efeitos ex-tunc (retroage). Vícios insanáveis (Objeto, Motivo, Finalidade) levam à anulação compulsória. A Teoria dos Motivos Determinantes é criação doutrinária/jurisprudencial, não tem previsão expressa no CP/ADM federal.",
    practicalExample: "Delegado demite servidor 'por conduta incompatível' (motivo declarado). Prova-se que a conduta nunca existiu — ato ANULADO pela Teoria dos Motivos Determinantes, mesmo que a lei não exigisse motivação expressa. Se ato praticado por autoridade com competência delegada sem a formalização devida: CONVALIDÁVEL — vício de competência sanável.",
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
  // ── Q1 — Presunção de Legitimidade (FACIL) ───────────────────────────────
  {
    id: "qz_dadm_aa_001",
    statement: "Sobre a presunção de legitimidade dos atos administrativos, assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "A presunção é absoluta (juris et de jure), não admitindo prova em contrário pelo administrado." },
      { letter: "B", text: "A presunção é relativa (juris tantum): admite prova em contrário, com inversão do ônus da prova para quem alega a ilegalidade." },
      { letter: "C", text: "A presunção de legitimidade só se aplica a atos discricionários, pois os atos vinculados já têm sua legalidade garantida em lei." },
      { letter: "D", text: "O ônus de provar a legalidade do ato é sempre da Administração, independentemente de quem alegue a ilegalidade." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A presunção de legitimidade e veracidade dos atos administrativos é RELATIVA (juris tantum): admite prova em contrário. O efeito prático é a inversão do ônus da prova — quem alega ilegalidade (normalmente o administrado) deve comprová-la. A Administração não precisa provar previamente que o ato é legal.",
    explanationCorrect: "Correto! Presunção juris tantum = relativa = quem alega ilegalidade prova. Esse é o efeito prático da presunção de legitimidade — inverte o ônus da prova em favor da Administração.",
    explanationWrong: "A presunção NÃO é absoluta (juris et de jure). Ela é RELATIVA (juris tantum) e pode ser afastada por prova em contrário. O ônus de provar a ilegalidade é de quem a alega (geralmente o administrado), não da Administração.",
    difficulty: "FACIL",
    contentTitle: "Ato Administrativo: Conceito, Validade e Presunção de Legitimidade",
  },
  // ── Q2 — Autoexecutoriedade (FACIL) ─────────────────────────────────────
  {
    id: "qz_dadm_aa_002",
    statement: "A respeito da autoexecutoriedade como atributo do ato administrativo, é CORRETO afirmar que:",
    alternatives: [
      { letter: "A", text: "Todos os atos administrativos possuem autoexecutoriedade, pois a Administração sempre pode executar suas decisões por meios próprios." },
      { letter: "B", text: "A autoexecutoriedade autoriza a Administração a cobrar multas diretamente dos administrados, sem necessidade de execução fiscal." },
      { letter: "C", text: "A autoexecutoriedade permite à Administração executar seus atos por meios próprios, sem autorização judicial prévia, mas exige previsão legal ou situação de urgência." },
      { letter: "D", text: "A autoexecutoriedade é sinônimo de imperatividade: ambos os atributos garantem a imposição do ato independentemente do consentimento do administrado." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Autoexecutoriedade: a Administração pode executar o ato sem buscar autorização judicial prévia. Contudo, NÃO é absoluta: exige previsão legal expressa ou situação de urgência. Exemplo: cobrança de multa NÃO é autoexecutória — depende de execução fiscal. Demolição de prédio com risco de desabamento É autoexecutória (urgência).",
    explanationCorrect: "Exato! Autoexecutoriedade = execução por meios próprios sem autorização judicial, MAS exige previsão legal ou urgência. Não é um atributo presente em todos os atos nem de forma ilimitada.",
    explanationWrong: "Autoexecutoriedade NÃO é absoluta — não está presente em todos os atos. Cobrança de multa NÃO é autoexecutória (precisa de execução fiscal). A questão-chave: autoexecutoriedade permite executar, não cobrar valores sem processo judicial.",
    difficulty: "FACIL",
    contentTitle: "Atributos do Ato Administrativo: PIAT (Presunção, Imperatividade, Autoexecutoriedade, Tipicidade)",
  },
  // ── Q3 — Forma como Elemento (FACIL) ─────────────────────────────────────
  {
    id: "qz_dadm_aa_003",
    statement: "Acerca da forma como elemento do ato administrativo, assinale a alternativa INCORRETA:",
    alternatives: [
      { letter: "A", text: "A forma é o modo de exteriorização do ato administrativo e é, como regra geral, escrita." },
      { letter: "B", text: "Vícios na forma do ato podem ser convalidados quando a forma não for essencial à validade do ato." },
      { letter: "C", text: "A forma é elemento dispensável: a Administração pode praticar qualquer ato de modo verbal ou escrito, a seu exclusivo critério, pois o Direito Administrativo é informal." },
      { letter: "D", text: "Excepcionalmente, a lei pode prever formas alternativas, como atos orais em situações de urgência." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A forma é elemento INDISPENSÁVEL do ato administrativo. A regra no Direito Administrativo é a forma ESCRITA, com formalidades legais específicas (publicação, motivação etc.). A afirmação de que o Direito Administrativo é informal e permite ao agente escolher livremente a forma está incorreta. Excepcionalmente, a lei pode admitir forma verbal (ex.: ordem verbal de policial para dispersar multidão).",
    explanationCorrect: "Correto que a alternativa C é a INCORRETA. Forma é elemento obrigatório, e o Direito Administrativo é formal — a regra é a forma escrita. O agente público não escolhe livremente a forma.",
    explanationWrong: "A alternativa incorreta é a C. Forma é elemento OBRIGATÓRIO do ato administrativo. O Direito Administrativo é formal — regra geral: ato escrito. A ausência ou vício de forma pode invalidar o ato (salvo convalidação quando não essencial).",
    difficulty: "FACIL",
    contentTitle: "Elementos do Ato Administrativo: Competência, Objeto, Motivo, Finalidade e Forma",
  },
  // ── Q4 — Vinculado vs Discricionário (FACIL) ────────────────────────────
  {
    id: "qz_dadm_aa_004",
    statement: "Um fiscal da vigilância sanitária constata que um estabelecimento comercial atende todos os requisitos legais para obtenção de alvará de funcionamento. Nesse caso, a concessão do alvará é:",
    alternatives: [
      { letter: "A", text: "Discricionária — o agente pode negar o alvará por razões de conveniência e oportunidade, mesmo com todos os requisitos atendidos." },
      { letter: "B", text: "Vinculada — presentes os requisitos legais, a Administração tem o dever de conceder o alvará, sem margem de escolha." },
      { letter: "C", text: "Discricionária — o Judiciário controla o mérito administrativo da decisão, podendo substituir a vontade do agente." },
      { letter: "D", text: "Vinculada — mas o agente pode negar por questões de oportunidade, desde que motive a decisão." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Ato vinculado: presentes todos os requisitos legais, a Administração tem o DEVER de conceder o ato — não há margem para conveniência/oportunidade. A concessão de alvará quando cumpridos os requisitos é exemplo clássico de ato vinculado. Negativa seria ilegal e sujeita a mandado de segurança.",
    explanationCorrect: "Perfeito! Ato vinculado: lei prevê todos os requisitos → agente DEVE agir. Não há mérito administrativo. Alvará concedido quando cumpridos todos os requisitos é o exemplo padrão de ato vinculado.",
    explanationWrong: "Ato vinculado = lei esgota os requisitos → agente não tem margem. Se todos os requisitos estão atendidos, a negativa é ilegal. Discricionário seria se a lei deixasse espaço de escolha (conveniência/oportunidade) — não é o caso de alvará com requisitos legais definidos.",
    difficulty: "FACIL",
    contentTitle: "Atos Vinculados vs Discricionários: Mérito Administrativo",
  },
  // ── Q5 — Teoria dos Motivos Determinantes (MEDIO) ───────────────────────
  {
    id: "qz_dadm_aa_005",
    statement: "Um delegado exonerou servidor em cargo em comissão declarando como motivo 'má conduta funcional'. Posteriormente, provou-se que a conduta nunca ocorreu. Segundo a Teoria dos Motivos Determinantes, o ato de exoneração:",
    alternatives: [
      { letter: "A", text: "Permanece válido, pois cargos em comissão são de livre exoneração (ad nutum) — a motivação é mera formalidade." },
      { letter: "B", text: "Deve ser anulado, pois o motivo declarado vincula a validade do ato, e motivo falso torna o ato inválido." },
      { letter: "C", text: "Pode ser convalidado, pois vícios de motivo são sanáveis pela Administração." },
      { letter: "D", text: "Permanece válido, pois a Teoria dos Motivos Determinantes só se aplica a atos vinculados, não a atos discricionários de exoneração." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Pela Teoria dos Motivos Determinantes, quando a Administração declara os motivos de um ato, esses motivos vinculam a validade do ato — mesmo que a lei não exigisse motivação. Se o motivo declarado for falso ou inexistente, o ato deve ser ANULADO. Cargo em comissão é de livre exoneração (ad nutum), mas ao motivar o ato, a Administração ficou vinculada ao motivo declarado. STF e STJ consolidaram esse entendimento.",
    explanationCorrect: "Correto! Teoria dos Motivos Determinantes: motivo declarado vincula o ato. Motivo falso → anulação. Mesmo que a lei não exigisse motivação (cargo em comissão é ad nutum), ao motivar, a Administração se vinculou.",
    explanationWrong: "Cuidado! Cargos em comissão são ad nutum (livre exoneração), mas quando a Administração DECLARA um motivo, esse motivo se torna vinculante. Motivo falso → ato anulado (Teoria dos Motivos Determinantes). Vício de motivo é INSANÁVEL — não pode ser convalidado.",
    difficulty: "MEDIO",
    contentTitle: "Teoria dos Motivos Determinantes e Convalidação dos Atos Administrativos",
  },
  // ── Q6 — Revogação: efeitos ex-nunc (MEDIO, CERTO/ERRADO) ────────────────
  {
    id: "qz_dadm_aa_006",
    statement: "Julgue o item conforme o Direito Administrativo brasileiro.\n\nA revogação é modalidade de extinção de ato administrativo válido por razões de conveniência e oportunidade, produzindo efeitos apenas para o futuro (ex-nunc), razão pela qual os atos praticados durante a vigência do ato revogado permanecem válidos.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CERTO. A revogação extingue ato administrativo LEGAL por razões de mérito (conveniência/oportunidade). Seus efeitos são ex-nunc (não retroagem), preservando todos os atos praticados enquanto o ato revogado estava vigente. É competência exclusiva da própria Administração (não pode o Judiciário revogar atos administrativos — só anular).",
    explanationCorrect: "Correto! Revogação = ato legal + conveniência/oportunidade + efeitos ex-nunc. Atos praticados durante a vigência do ato revogado são válidos. Questão clássica CEBRASPE sobre revogação.",
    explanationWrong: "O item está CERTO. Revogação: ato válido + razões de mérito + efeitos ex-nunc (futuro). Os atos praticados durante a vigência do ato revogado NÃO são afetados. Atenção: anulação sim retroage (ex-tunc); revogação não.",
    difficulty: "MEDIO",
    contentTitle: "Extinção dos Atos Administrativos: Revogação vs Anulação",
  },
  // ── Q7 — Anulação: efeitos ex-tunc (MEDIO) ──────────────────────────────
  {
    id: "qz_dadm_aa_007",
    statement: "Sobre a anulação de atos administrativos, assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "A anulação só pode ser promovida pelo Judiciário — a Administração não tem poder de anular seus próprios atos." },
      { letter: "B", text: "A anulação produz efeitos ex-nunc, preservando os atos praticados durante a vigência do ato anulado." },
      { letter: "C", text: "A anulação recai sobre ato ilegal e produz efeitos ex-tunc (retroativos), mas os efeitos para terceiros de boa-fé devem ser preservados." },
      { letter: "D", text: "A anulação administrativa está sujeita ao prazo decadencial de 10 anos, contados da data de publicação do ato." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Anulação: extingue ato ILEGAL com efeitos ex-tunc (retroativos — apaga o ato desde o início). A Administração pode anular seus próprios atos (autotutela — Súmula 473 STF). O prazo decadencial é de 5 anos para atos que produziram efeitos favoráveis ao particular de boa-fé (Lei 9.784/99, art. 54). Efeitos para terceiros de boa-fé devem ser preservados por segurança jurídica.",
    explanationCorrect: "Correto! Anulação = ato ilegal + efeitos ex-tunc + Administração pode anular (autotutela/Súmula 473). Terceiros de boa-fé têm efeitos preservados por segurança jurídica. Prazo decadencial: 5 anos (não 10).",
    explanationWrong: "Atenção: a Administração TEM poder de anular seus atos (autotutela). A anulação produz efeitos ex-TUNC (retroativos), não ex-nunc. O prazo decadencial é de 5 anos (não 10). Boa-fé de terceiros é preservada por segurança jurídica.",
    difficulty: "MEDIO",
    contentTitle: "Extinção dos Atos Administrativos: Revogação vs Anulação",
  },
  // ── Q8 — Imperatividade (MEDIO) ─────────────────────────────────────────
  {
    id: "qz_dadm_aa_008",
    statement: "A imperatividade como atributo do ato administrativo significa que:",
    alternatives: [
      { letter: "A", text: "O ato só produz efeitos após consentimento expresso do administrado afetado." },
      { letter: "B", text: "A Administração pode impor obrigações aos particulares independentemente de sua concordância." },
      { letter: "C", text: "O ato administrativo tem presunção absoluta de validade, não podendo ser contestado judicialmente." },
      { letter: "D", text: "A Administração pode executar o ato por meios próprios, sem necessidade de autorização judicial." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Imperatividade: o ato administrativo cria obrigações para os particulares INDEPENDENTEMENTE de seu consentimento — unilateralidade coercitiva. Difere da autoexecutoriedade (que é a capacidade de executar o ato por meios próprios sem judicial). Nem todo ato tem imperatividade (ex.: atos negociais como a licença dependem de requerimento do interessado).",
    explanationCorrect: "Exato! Imperatividade = imposição unilateral de obrigações sem necessidade de consentimento. O ato obriga terceiros. Distinga de autoexecutoriedade (execução sem judiciário) — são atributos diferentes.",
    explanationWrong: "Imperatividade ≠ autoexecutoriedade. Imperatividade: obriga sem consentimento. Autoexecutoriedade: executa sem judicial. A alternativa D descreve autoexecutoriedade, não imperatividade. Nem todo ato tem imperatividade (atos negociais, por exemplo, não impõem — dependem de pedido do particular).",
    difficulty: "MEDIO",
    contentTitle: "Atributos do Ato Administrativo: PIAT (Presunção, Imperatividade, Autoexecutoriedade, Tipicidade)",
  },
  // ── Q9 — Mérito Administrativo e Judiciário (DIFICIL, C/E) ───────────────
  {
    id: "qz_dadm_aa_009",
    statement: "Julgue o item conforme o entendimento consolidado do STF e STJ.\n\nO Poder Judiciário pode anular ato administrativo discricionário quando verificar desvio de finalidade, mas não pode substituir a escolha do administrador pela sua própria conveniência, sob pena de violação ao princípio da separação dos poderes.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CERTO. O Judiciário controla a LEGALIDADE dos atos discricionários — pode anulá-los quando houver ilegalidade, abuso de poder, desvio de finalidade ou violação de princípios (proporcionalidade, razoabilidade). O que o Judiciário NÃO pode fazer é substituir a escolha de conveniência/oportunidade do administrador pela sua própria — isso violaria a separação de poderes e o mérito administrativo.",
    explanationCorrect: "Correto! Controle judicial do ato discricionário: legalidade sim, mérito não. Desvio de finalidade é ilegalidade → anulável. Substituir conveniência/oportunidade: vedado ao Judiciário. Entendimento consolidado STF/STJ.",
    explanationWrong: "O item está CERTO. Judiciário: pode anular ato ilegal (inclusive discricionário com desvio de finalidade), MAS não pode substituir a opção de conveniência/oportunidade do administrador — isso seria violação à separação de poderes.",
    difficulty: "DIFICIL",
    contentTitle: "Atos Vinculados vs Discricionários: Mérito Administrativo",
  },
  // ── Q10 — Convalidação: vícios sanáveis (DIFICIL, C/E) ───────────────────
  {
    id: "qz_dadm_aa_010",
    statement: "Julgue o item conforme o Direito Administrativo brasileiro.\n\nA convalidação de ato administrativo viciado é cabível quando o vício recair sobre a competência (salvo competência exclusiva) ou sobre a forma (quando não essencial), sendo vedada quando o vício incidir sobre o objeto, o motivo ou a finalidade do ato.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CERTO. Convalidação (saneamento) é possível para vícios de COMPETÊNCIA (salvo se exclusiva — ex.: atos privativos do Presidente) e FORMA (quando não essencial ao ato). Vícios de OBJETO, MOTIVO e FINALIDADE são insanáveis — levam à anulação. Mnemônico: CoFo = convalidável; OMF = só anulação. A convalidação produz efeitos ex-tunc (retroativos).",
    explanationCorrect: "Correto! Convalidação: Competência e Forma (CoFo) — sanáveis. Objeto, Motivo e Finalidade (OMF) — insanáveis. Essa distinção é cobrada extensamente em provas federais e CEBRASPE.",
    explanationWrong: "O item está CERTO. Memorize CoFo vs OMF: Competência e Forma podem ser convalidados; Objeto, Motivo e Finalidade são insanáveis → só anulação. A convalidação tem efeitos ex-tunc (retroage — como se o ato sempre fosse válido).",
    difficulty: "DIFICIL",
    contentTitle: "Teoria dos Motivos Determinantes e Convalidação dos Atos Administrativos",
  },
  // ── Q11 — Autoexecutoriedade + Proporcionalidade (DIFICIL) ────────────────
  {
    id: "qz_dadm_aa_011",
    statement: "Agentes da Polícia Federal, durante operação de busca e apreensão, constatam que um laboratório farmacêutico está fabricando medicamentos adulterados. Usando a autoexecutoriedade, interditam imediatamente o estabelecimento e apreende os medicamentos, sem prévia autorização judicial. Sobre a situação, é CORRETO afirmar:",
    alternatives: [
      { letter: "A", text: "A ação é ilegal, pois toda restrição a direito do administrado exige autorização judicial prévia." },
      { letter: "B", text: "A ação é legal se amparada em lei e observado o princípio da proporcionalidade — a urgência e o risco à saúde pública justificam a atuação imediata." },
      { letter: "C", text: "A ação é legal apenas para interdição do estabelecimento, mas a apreensão de medicamentos requer mandado judicial." },
      { letter: "D", text: "A autoexecutoriedade permite que a Administração atue em qualquer situação, independentemente de lei ou urgência." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A autoexecutoriedade permite atuação sem autorização judicial quando há previsão legal e/ou urgência. No caso: (1) há previsão legal (Lei Sanitária, ANVISA); (2) há urgência e risco à saúde pública. A proporcionalidade exige que a medida seja adequada, necessária e proporcional ao risco — interdição e apreensão de medicamentos adulterados atendem esses critérios. A autoexecutoriedade NÃO é ilimitada — deve observar proporcionalidade.",
    explanationCorrect: "Perfeito! Autoexecutoriedade em urgência + previsão legal + proporcionalidade = ação legal. Medicamentos adulterados representam risco imediato à saúde pública — justifica atuação sem judicial. Esse é o caso típico de autoexecutoriedade por urgência.",
    explanationWrong: "Autoexecutoriedade não exige autorização judicial quando há urgência ou previsão legal (ambos presentes aqui). A proporcionalidade é exigida, mas apreensão de medicamentos adulterados é medida adequada, necessária e proporcional ao risco à saúde. A alternativa A erra ao exigir sempre autorização judicial.",
    difficulty: "DIFICIL",
    contentTitle: "Atributos do Ato Administrativo: PIAT (Presunção, Imperatividade, Autoexecutoriedade, Tipicidade)",
  },
  // ── Q12 — Silêncio Administrativo (DIFICIL) ──────────────────────────────
  {
    id: "qz_dadm_aa_012",
    statement: "Acerca do silêncio administrativo e dos atos tácitos no Direito Administrativo, assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "O silêncio da Administração jamais pode ser interpretado como anuência (concordância), pois os atos administrativos devem ser expressos e formais." },
      { letter: "B", text: "Em regra, o silêncio da Administração não é ato administrativo, mas a lei pode atribuir ao silêncio efeito positivo (aprovação tácita) ou negativo (indeferimento tácito), especialmente após prazo razoável." },
      { letter: "C", text: "O silêncio administrativo sempre equivale a indeferimento tácito — o administrado pode recorrer imediatamente ao Judiciário após qualquer prazo." },
      { letter: "D", text: "Ato tácito é sinônimo de ato verbal: ambos dispensam forma escrita e produzem efeitos iguais ao ato expresso." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O silêncio administrativo, em regra, não é ato jurídico. Mas a lei pode lhe atribuir efeitos: (1) aprovação tácita — após prazo sem resposta, considera-se aprovado (ex.: Lei 13.874/19, art. 3º — prazo razoável = aprovação tácita de licenças de baixo risco); (2) indeferimento tácito — silêncio = negativa, abrindo recurso. A Lei 14.210/21 reforçou o silêncio positivo no âmbito federal para atos de baixo risco. O administrado pode questionar o silêncio via mandado de segurança por omissão.",
    explanationCorrect: "Correto! Silêncio não é ato, mas lei pode atribuir efeitos (positivo ou negativo). Lei 13.874/19 e 14.210/21: aprovação tácita para licenças de baixo risco após prazo razoável. Esse tema é crescente em provas de concursos federais.",
    explanationWrong: "O silêncio não é sempre indeferimento — a lei pode prever efeito positivo (aprovação tácita) ou negativo (indeferimento). Ato tácito ≠ ato verbal. Ato tácito é inferi do do comportamento da Administração (ex.: silêncio com efeito legal); ato verbal é manifestação oral expressa (ex.: ordem de policial).",
    difficulty: "DIFICIL",
    contentTitle: "Ato Administrativo: Conceito, Validade e Presunção de Legitimidade",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n⚖️  Seed: Direito Administrativo — Atos Administrativos\n");

  // ── 1. Encontrar Subject ────────────────────────────────────────────────
  const subjectId = await findSubject("DIREITO_ADMINISTRATIVO");
  if (!subjectId) {
    console.error("❌ Subject 'DIREITO_ADMINISTRATIVO' não encontrado no banco.");
    process.exit(1);
  }
  console.log(`✅ Subject encontrado: ${subjectId}`);

  // ── 2. Garantir colunas Phase 5 em Question ────────────────────────────
  for (const [col, def] of [
    ["correctOption", "INTEGER"],
    ["explanationCorrect", "TEXT"],
    ["explanationWrong", "TEXT"],
    ["contentId", "TEXT"],
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
  const topicId = await findOrCreateTopic("Atos Administrativos", subjectId);
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
        "subjectId", "topicId", "contentId",
        "isActive", "difficulty",
        "timesUsed", "questionType",
        "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternativesJson}::jsonb, ${q.correctAnswer}, ${q.correctOption},
        ${q.explanation}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${subjectId}, ${topicId}, ${contentId},
        true, ${q.difficulty},
        0, 'MULTIPLA_ESCOLHA',
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Questão criada: ${q.id}`);
    questionCreated++;
  }

  // ── Backfill contentId em questões já existentes (sem contentId) ─────────
  let backfillCount = 0;
  for (const q of questions) {
    const contentId = contentIdMap[q.contentTitle];
    if (!contentId) continue;
    const result = await db.execute(sql`
      UPDATE "Question" SET "contentId" = ${contentId}
      WHERE id = ${q.id} AND "contentId" IS NULL
    `) as any;
    if ((result.rowCount ?? result.count ?? 0) > 0) backfillCount++;
  }
  if (backfillCount > 0) console.log(`  🔧 Backfill contentId: ${backfillCount} questões atualizadas`);

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
