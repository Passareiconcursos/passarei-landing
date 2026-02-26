/**
 * Seed: Direito Constitucional — Direitos Fundamentais (Art. 5º CF/88)
 *
 * Popula 6 átomos de Conteúdo + 12 Questões vinculadas.
 * Idempotente: verifica existência antes de inserir.
 *
 * Execução:
 *   npx tsx db/seed-direito-constitucional-art5.ts
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
    id: "dc_art5_c01",
    title: "Direitos Fundamentais — Cabeça do Art. 5º CF/88",
    textContent: `O Art. 5º da CF/88 é o coração dos direitos fundamentais. Seu caput garante, aos brasileiros e estrangeiros residentes no País, os seguintes direitos: vida, liberdade, igualdade, segurança e propriedade — mnemônico VLISP.

PONTOS-CHAVE:
• São titulares: brasileiros (natos e naturalizados) e estrangeiros RESIDENTES — turistas de passagem têm proteção apenas indireta via tratados
• Direitos são relativos, não absolutos — podem ser restringidos por lei e pelo estado de sítio/defesa
• Aplicação imediata (§ 1º): normas definidoras de direitos fundamentais têm aplicabilidade imediata
• Rol não taxativo (§ 2º): outros direitos decorrem do regime e dos tratados internacionais

EXEMPLO:
Um estrangeiro que reside legalmente em São Paulo tem direito ao habeas corpus, ao contraditório e à ampla defesa — assim como qualquer brasileiro.

DICA BANCA:
CEBRASPE cobra muito a literalidade do caput: "brasileiros e estrangeiros residentes". Cuidado com pegadinhas que incluem "estrangeiros de passagem" como titulares plenos.`,
    mnemonic: "VLISP — Vida, Liberdade, Igualdade, Segurança, Propriedade",
    keyPoint: "Art. 5° caput: titulares são brasileiros e estrangeiros RESIDENTES; rol não taxativo; aplicabilidade imediata",
    practicalExample: "Estrangeiro residente tem direito ao HC; turista de passagem tem proteção via tratados internacionais",
    difficulty: "FACIL",
  },
  {
    id: "dc_art5_c02",
    title: "Habeas Corpus (HC) — Remédio da Liberdade de Locomoção",
    textContent: `O Habeas Corpus (Art. 5º, LXVIII) protege o direito de locomoção — ir, vir e permanecer — contra ilegalidade ou abuso de poder. É o remédio constitucional mais antigo do Brasil (desde 1832).

PONTOS-CHAVE:
• Cabimento: toda vez que alguém sofrer ou se achar ameaçado de sofrer violência ou coação em sua liberdade de locomoção
• Espécies: HC Repressivo (lesão consumada — já preso) | HC Preventivo (ameaça de prisão — salvo-conduto)
• Legitimidade ativa: qualquer pessoa, inclusive o próprio preso — não exige advogado
• HC e multa: Súmula 693 STF — HC não cabe para questionar pena de multa apenas
• Militar: cabe HC contra ilegalidade/abuso, mas não para revisar mérito disciplinar (art. 142 §2º)

EXEMPLO:
João foi preso em flagrante sem comunicação ao juiz em 24 horas. Sua família (ou qualquer pessoa) pode impetrar HC imediatamente, sem necessidade de advogado, pedindo a liberdade ou o relaxamento da prisão.

DICA BANCA:
CESPE/CEBRASPE cobra: "HC cabe na hipótese de prisão decorrente de infração penal a que a lei comine pena de multa" — ERRADO (Súmula 693 STF).`,
    mnemonic: "HC — Habeas = Tome (latim). 'Tome o corpo' — liberdade física. HC Repressivo = já preso; HC Preventivo = ameaçado",
    keyPoint: "HC: liberdade de locomoção; qualquer pessoa pode impetrar (sem advogado); HC preventivo gera salvo-conduto",
    practicalExample: "Preso sem comunicação ao juiz em 24h → HC repressivo. Intimação para se apresentar sem ordem legal → HC preventivo com salvo-conduto",
    difficulty: "FACIL",
  },
  {
    id: "dc_art5_c03",
    title: "Habeas Data (HD) — Acesso e Retificação de Dados Pessoais",
    textContent: `O Habeas Data (Art. 5º, LXXII) protege o direito de acesso e retificação de informações pessoais constantes de registros ou bancos de dados de entidades GOVERNAMENTAIS ou de caráter PÚBLICO.

PONTOS-CHAVE:
• Finalidades (incisos 'a' e 'b'): assegurar conhecimento (acesso) + retificação de dados
• Lei 9.507/97 ampliou: 'c' — anotação para contestar informações pendentes ou sub judice
• É pressuposto do HD: prévia recusa administrativa ao acesso — não cabe HD direto sem tentativa prévia
• Entidades abrangidas: governamentais + de caráter público (ex.: SPC/SERASA são de caráter público)
• Legitimidade: apenas o próprio titular dos dados (ação personalíssima)

EXEMPLO:
Ana quer saber quais informações o SERASA tem sobre ela. Ela deve primeiro requerer administrativamente. Se houver negativa ou silêncio por 10 dias (pessoa física), pode impetrar HD para obter acesso e, se necessário, retificação.

DICA BANCA:
Pegadinha: "O HD dispensa a tentativa prévia de acesso pela via administrativa" — ERRADO. O STJ exige a tentativa administrativa prévia como condição de admissibilidade.`,
    mnemonic: "HD → Habeas DATA = seus DADOS. Acesso + Retificação. Prévia recusa adminstrativa é pressuposto",
    keyPoint: "HD: dados pessoais em entidades gov. ou de caráter público; pressuposto: negativa administrativa prévia; personalíssimo",
    practicalExample: "Negativa do SERASA de fornecer dados → HD cabível. Pedido direto sem recusa prévia → HD incabível (falta interesse de agir)",
    difficulty: "MEDIO",
  },
  {
    id: "dc_art5_c04",
    title: "Mandado de Segurança (MS) — Direito Líquido e Certo",
    textContent: `O Mandado de Segurança (Art. 5º, LXIX e LXX) protege direito líquido e certo, não amparado por HC ou HD, contra ato ilegal ou abuso de poder de autoridade pública ou agente de pessoa jurídica no exercício de atribuições do Poder Público.

PONTOS-CHAVE:
• Direito líquido e certo: comprovável de plano, por prova pré-constituída documental — não admite dilação probatória
• MS Individual (LXIX): qualquer pessoa física ou jurídica
• MS Coletivo (LXX): partido político com representação no CN | organização sindical, entidade de classe ou associação (constituída há ≥ 1 ano)
• Prazo: 120 dias do ato coator (decadencial — não se suspende nem se interrompe)
• Não cabe MS: ato de gestão comercial de empresas públicas/mistas (Lei 12.016); quando couber recurso com efeito suspensivo; contra lei em tese

EXEMPLO:
Servidor público é reprovado em processo seletivo interno sem motivação do ato. Como possui documentos que comprovam sua aprovação nos critérios objetivos, impetrou MS com direito líquido e certo dentro de 120 dias do ato.

DICA BANCA:
"O MS coletivo pode ser impetrado por associação constituída há menos de 1 ano, em caráter excepcional" — ERRADO. O requisito de 1 ano é constitucional e não admite exceção para MS coletivo (ao contrário da ação popular que dispensa esse prazo).`,
    mnemonic: "MS = Manda o Seguro = Direito Líquido e Certo. 120 dias. DLC = Doc + Líquido + Certo",
    keyPoint: "MS: DLC comprovado por doc pré-constituída; 120 dias decadenciais; MS coletivo: partido/sindicato/associação ≥1 ano",
    practicalExample: "Servidor reprovado ilegalmente em concurso interno: MS com doc + dentro de 120 dias. Associação c/ 6 meses: não pode impetrar MS coletivo",
    difficulty: "MEDIO",
  },
  {
    id: "dc_art5_c05",
    title: "Mandado de Injunção (MI) — Omissão Normativa",
    textContent: `O Mandado de Injunção (Art. 5º, LXXI) é cabível quando a falta de norma regulamentadora torne inviável o exercício de direitos e liberdades constitucionais e das prerrogativas inerentes à nacionalidade, soberania e cidadania.

PONTOS-CHAVE:
• Pressupostos: (1) norma constitucional de eficácia limitada + (2) omissão do legislador + (3) inviabilidade de exercício do direito
• Correntes sobre efeitos (STF adotou corrente concretista geral): a decisão produz efeitos erga omnes, suprindo a omissão com regulação provisória
• Lei 13.300/2016 disciplina o MI — prazo razoável + efeitos
• MI Individual vs. MI Coletivo: legitimados ativos do MI coletivo são os mesmos do MS coletivo + Defensoria Pública
• Diferença crucial: ADO (Ação Direta de Inconstitucionalidade por Omissão) é via concentrada (STF/TJ); MI é via difusa (qualquer juiz)

EXEMPLO:
Por anos, servidores que exerciam atividade de risco não podiam se aposentar especialmente porque faltava lei complementar (art. 40 §4º CF). O STF, via MI, supriu a omissão aplicando analogicamente a Lei 8.213/91 (RGPS) para garantir aposentadoria especial.

DICA BANCA:
"O MI e a ADO têm os mesmos efeitos e legitimados" — ERRADO. MI (via difusa, qualquer prejudicado) vs. ADO (via concentrada, legitimados do art. 103 CF).`,
    mnemonic: "MI = Mandado de INjunção = INexistência de norma. FALTA = Falta A Lei Tornou o Acesso inviável",
    keyPoint: "MI: omissão normativa + direito constitucional inviabilizado; efeitos erga omnes (STF); Lei 13.300/2016",
    practicalExample: "Sem lei de greve dos servidores: STF no MI 670/708/712 aplicou a lei de greve privada aos servidores publicos por analogia",
    difficulty: "DIFICIL",
  },
  {
    id: "dc_art5_c06",
    title: "Ação Popular — Cidadão Contra Atos Lesivos",
    textContent: `A Ação Popular (Art. 5º, LXXIII) permite ao cidadão anular ato lesivo ao patrimônio público, à moralidade administrativa, ao meio ambiente e ao patrimônio histórico e cultural.

PONTOS-CHAVE:
• Legitimidade ativa: CIDADÃO (eleitor em pleno gozo de direitos políticos) — não basta ser brasileiro; estrangeiro não tem ação popular
• Objeto: ato nulo ou anulável que cause lesão — ilegalidade + lesividade (STF vem flexibilizando lesividade presumida em casos de imoralidade)
• Ré: pessoa jurídica, agente público, beneficiário
• Gratuidade: isenção de custas e ônus da sucumbência, SALVO comprovada má-fé
• Lei 4.717/65 regula a Ação Popular
• Competência: depende da autoridade coatora; Federal → JF; Municipal → Vara Cível comum

EXEMPLO:
Um cidadão de Belo Horizonte, eleitor, descobre que a prefeitura vendeu terreno público a preço irrisório para empresa privada sem licitação. Ele pode ajuizar Ação Popular na Vara da Fazenda Pública Municipal pedindo a anulação do ato e o ressarcimento ao erário.

DICA BANCA:
"A ação popular pode ser ajuizada por pessoa jurídica" — ERRADO. Apenas cidadão (pessoa física + eleitor). Associações civis e partidos não têm legitimidade para ação popular.`,
    mnemonic: "AçãO POPular = só o POVO (cidadão eleitor). 5 objetos: Patrimônio Público, Moralidade, Meio Ambiente, Patrimônio Histórico-Cultural + ato nulo/anulável",
    keyPoint: "Ação Popular: cidadão eleitor; 4 bens protegidos; gratuita (salvo má-fé); Lei 4.717/65",
    practicalExample: "Eleitor descobre venda ilegal de bem público → ajuíza AP. Estrangeiro ou empresa → sem legitimidade",
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
  // ── Q1–Q4: FÁCIL (Municipal/GM/CBM) ──────────────────────────────────────
  {
    id: "dc_art5_q01",
    statement:
      "Segundo o caput do Art. 5º da Constituição Federal de 1988, são titulares dos direitos fundamentais ali elencados:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Apenas os brasileiros natos." },
      { letter: "B", text: "Brasileiros natos e naturalizados, bem como estrangeiros residentes no País." },
      { letter: "C", text: "Brasileiros natos e todos os estrangeiros que se encontrem em território nacional." },
      { letter: "D", text: "Apenas cidadãos (eleitores) brasileiros em pleno gozo de direitos políticos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O caput do art. 5º CF garante direitos a brasileiros e estrangeiros RESIDENTES no País. Turistas ou estrangeiros de passagem têm proteção indireta via tratados, mas não são destinatários expressos do caput.",
    explanationCorrect:
      "Exato! O art. 5º, caput, diz 'aos brasileiros e aos estrangeiros residentes no País'. Residentes — não todos os que estejam em território nacional.",
    explanationWrong:
      "Atenção: 'todos os estrangeiros no território nacional' é mais amplo do que o texto constitucional. O art. 5° fala em RESIDENTES, não em qualquer um que esteja de passagem.",
    difficulty: "FACIL",
  },
  {
    id: "dc_art5_q02",
    statement:
      "O Habeas Corpus tem como finalidade proteger qual direito fundamental?",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Direito de acesso a informações pessoais registradas em bancos de dados governamentais." },
      { letter: "B", text: "Direito líquido e certo não amparado por outro remédio constitucional." },
      { letter: "C", text: "Liberdade de locomoção — direito de ir, vir e permanecer." },
      { letter: "D", text: "Exercício de direitos constitucionais inviabilizados por omissão legislativa." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "HC (art. 5º, LXVIII) protege a liberdade de locomoção. A letra A é Habeas Data; B é Mandado de Segurança; D é Mandado de Injunção.",
    explanationCorrect:
      "Correto! HC = liberdade de locomoção (ir, vir, permanecer). Mnemônico: 'Habeas Corpus' (latim: 'tome o corpo') — proteção do corpo físico.",
    explanationWrong:
      "Atenção: cada remédio constitucional tem objeto próprio. HC → locomoção. HD → dados pessoais. MS → direito líquido e certo. MI → omissão normativa.",
    difficulty: "FACIL",
  },
  {
    id: "dc_art5_q03",
    statement:
      "Quanto ao Habeas Corpus, assinale a alternativa CORRETA:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Somente o advogado habilitado pode impetrar habeas corpus em favor do paciente." },
      { letter: "B", text: "Qualquer pessoa, inclusive o próprio preso, pode impetrar habeas corpus, sem necessidade de advogado." },
      { letter: "C", text: "O habeas corpus preventivo é cabível apenas após o início do cumprimento da pena." },
      { letter: "D", text: "O habeas corpus é incabível contra atos praticados por particulares." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O HC é ação gratuita que dispensa advogado e pode ser impetrado por qualquer pessoa (jus postulandi amplo). O HC preventivo cabe antes da prisão (salvo-conduto). O STF já admitiu HC contra ato de particular em casos excepcionais.",
    explanationCorrect:
      "Correto! HC tem jus postulandi amplo — qualquer pessoa impetrar, sem advogado, inclusive o próprio preso por escrito.",
    explanationWrong:
      "Errado: o HC dispensa advogado (ação gratuita). O HC preventivo cabe ANTES da prisão (ameaça), não depois. O STF admite HC contra ato de particular em situações excepcionais.",
    difficulty: "FACIL",
  },
  {
    id: "dc_art5_q04",
    statement:
      "A Ação Popular pode ser ajuizada por:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Qualquer pessoa humana que se encontre em território nacional." },
      { letter: "B", text: "Associações civis constituídas há pelo menos um ano." },
      { letter: "C", text: "Qualquer cidadão (pessoa física brasileira em pleno gozo dos direitos políticos)." },
      { letter: "D", text: "Partidos políticos com representação no Congresso Nacional." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Ação Popular (art. 5º, LXXIII): legitimado ativo é o CIDADÃO (eleitor, pessoa física com direitos políticos plenos). Pessoa jurídica, associação e partido não têm legitimidade para a ação popular.",
    explanationCorrect:
      "Exato! Ação Popular é exclusiva do CIDADÃO eleitor. Mnemônico: Ação POPular = só o POVO (pessoa física + eleitor).",
    explanationWrong:
      "Errado: associações e partidos têm legitimidade para MS Coletivo, não para Ação Popular. Estrangeiros e pessoas sem direitos políticos plenos também não podem ajuizá-la.",
    difficulty: "FACIL",
  },

  // ── Q5–Q8: MÉDIO (Estadual/PC/PM) ────────────────────────────────────────
  {
    id: "dc_art5_q05",
    statement:
      "O Habeas Data pode ser impetrado para assegurar conhecimento de informações relativas ao impetrante constantes de registros de:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Entidades governamentais e de caráter público, como o SERASA." },
      { letter: "B", text: "Apenas entidades governamentais federais." },
      { letter: "C", text: "Qualquer empresa privada que mantenha cadastro de dados." },
      { letter: "D", text: "Apenas registros criminais do Ministério da Justiça." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "HD abrange entidades governamentais E entidades de caráter público (ex: SPC/SERASA foram reconhecidas pelo STJ como de caráter público). Empresas privadas que não têm caráter público estão fora do alcance do HD.",
    explanationCorrect:
      "Correto! HD alcança entidades governamentais + entidades de caráter público. O STJ reconheceu SPC e SERASA como de caráter público para fins de HD.",
    explanationWrong:
      "Cuidado: HD não se limita a entidades federais nem apenas a registros criminais. Também não alcança qualquer empresa privada — apenas as de caráter público.",
    difficulty: "MEDIO",
  },
  {
    id: "dc_art5_q06",
    statement:
      "Sobre o Mandado de Segurança (MS), analise as afirmações:\n\nI. O MS coletivo pode ser impetrado por associação constituída há pelo menos 1 ano.\nII. O prazo para impetrar MS é de 180 dias contados do ato coator.\nIII. O MS é subsidiário: não cabe quando houver HC ou HD disponíveis.\n\nEstão CORRETAS:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Apenas I." },
      { letter: "B", text: "Apenas I e III." },
      { letter: "C", text: "Apenas II e III." },
      { letter: "D", text: "I, II e III." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "I — CORRETA: associação ≥ 1 ano (art. 5º, LXX, 'b'). II — ERRADA: prazo é 120 dias (decadencial), não 180. III — CORRETA: MS é residual ('não amparado por HC ou HD'). Portanto, corretas apenas I e III.",
    explanationCorrect:
      "Exato! I e III corretas. O prazo do MS é 120 dias (não 180) e é decadencial — não se suspende nem se interrompe.",
    explanationWrong:
      "Atenção ao prazo: MS tem 120 dias (art. 23, Lei 12.016), não 180. A assertiva II está errada. Estão corretas I e III.",
    difficulty: "MEDIO",
  },
  {
    id: "dc_art5_q07",
    statement:
      "O Mandado de Injunção (MI) diferencia-se da Ação Direta de Inconstitucionalidade por Omissão (ADO) principalmente porque:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "O MI tem efeitos erga omnes e a ADO tem efeitos inter partes." },
      { letter: "B", text: "O MI é via difusa (qualquer prejudicado) e a ADO é via concentrada (legitimados do art. 103 CF)." },
      { letter: "C", text: "O MI só pode ser impetrado por partidos políticos, enquanto a ADO pode ser proposta por qualquer cidadão." },
      { letter: "D", text: "O MI visa reparar danos patrimoniais, ao passo que a ADO apenas declara a inconstitucionalidade." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A distinção fundamental: MI é controle difuso (qualquer titular do direito inviabilizado pode impetrar, em qualquer juízo); ADO é controle concentrado (somente legitimados do art. 103, perante o STF/TJ). Ambos combatem omissão normativa.",
    explanationCorrect:
      "Correto! MI = via difusa, qualquer prejudicado. ADO = via concentrada, legitimados do art. 103. Essa é a distinção cobrada com frequência.",
    explanationWrong:
      "Errado: após a Lei 13.300/2016, o MI passou a ter efeitos erga omnes em regra (não apenas inter partes). A distinção principal é controle difuso (MI) vs. concentrado (ADO), não os efeitos da decisão.",
    difficulty: "MEDIO",
  },
  {
    id: "dc_art5_q08",
    statement:
      "Em relação ao Habeas Data (HD), é correto afirmar que:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "O HD pode ser impetrado por terceiro interessado para acessar dados de outrem, desde que haja procuração." },
      { letter: "B", text: "O HD independe de prévio requerimento administrativo como condição de admissibilidade." },
      { letter: "C", text: "O HD é ação personalíssima e pressupõe prévia recusa ou omissão da entidade ao pedido de acesso." },
      { letter: "D", text: "O HD só pode ser impetrado para fins de retificação de dados, não para simples acesso." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "HD é personalíssimo (apenas o titular dos dados pode impetrar) e exige tentativa administrativa prévia como condição de admissibilidade (STJ, Súmula 2). Não basta a simples vontade de acessar — é preciso que a entidade tenha negado ou se omitido.",
    explanationCorrect:
      "Exato! HD é personalíssimo + pressupõe recusa administrativa prévia. Sem negativa, falta interesse de agir e o HD não é cabível.",
    explanationWrong:
      "Errado: HD é personalíssimo — não cabe por procuração de terceiro. O STJ (Súmula 2) exige tentativa administrativa prévia. O HD cabe também para simples acesso, não só retificação.",
    difficulty: "MEDIO",
  },

  // ── Q9–Q12: DIFÍCIL (Federal/PF/PRF — Q9 CERTO/ERRADO CEBRASPE) ──────────
  {
    id: "dc_art5_q09",
    statement:
      "(CEBRASPE – PF – Adaptada) Julgue o item:\n\nO Mandado de Injunção, após a Lei 13.300/2016, adotou a corrente concretista individual intermediária como regra, determinando que, em caso de omissão, o órgão impetrado seja notificado para suprir a falta em prazo razoável, e, somente após o decurso deste prazo sem providência, o impetrante poderá exercer o direito diretamente.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. A Lei 13.300/2016 adotou a corrente CONCRETISTA GERAL como regra: a decisão produz efeitos erga omnes com regulação provisória do direito, sem necessidade de aguardar prazo para o omissor legislar. A corrente individual intermediária era a posição do STF antes da lei, mas não é a regra atual.",
    explanationCorrect:
      "Corretamente marcado como ERRADO! A Lei 13.300/2016 consolidou a corrente CONCRETISTA GERAL (efeitos erga omnes imediatos), não a individual intermediária.",
    explanationWrong:
      "Este item é ERRADO: a corrente adotada pela Lei 13.300/2016 é a concretista GERAL (efeitos erga omnes), não a individual intermediária. Na concretista geral, não há 'prazo para o legislador' antes de a decisão produzir efeitos.",
    difficulty: "DIFICIL",
  },
  {
    id: "dc_art5_q10",
    statement:
      "Sobre os remédios constitucionais e os direitos fundamentais do Art. 5º, analise:\n\nI. O HC preventivo gera salvo-conduto e pode ser impetrado quando há ameaça de prisão, ainda que não tenha ocorrido a detenção.\nII. O MS coletivo, quando impetrado por partido político, limita-se à defesa dos interesses dos filiados ao partido.\nIII. A Ação Popular, na hipótese de procedência, isenta o autor de custas, salvo comprovada má-fé.\n\nEstão CORRETAS as afirmações:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Apenas I." },
      { letter: "B", text: "Apenas I e III." },
      { letter: "C", text: "Apenas II e III." },
      { letter: "D", text: "I, II e III." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "I — CORRETA: HC preventivo (ameaça de prisão) gera salvo-conduto. II — ERRADA: o STF e a lei permitem que partido político defenda interesses de seus filiados E interesses da sociedade em geral (pertinência temática ampla). III — CORRETA: AP é gratuita, salvo má-fé do autor (art. 5º, LXXIII e Lei 4.717/65 art. 10).",
    explanationCorrect:
      "Correto! I e III são verdadeiras. O MS coletivo impetrado por partido não se limita aos filiados — defende interesses coletivos mais amplos conforme jurisprudência do STF.",
    explanationWrong:
      "Atenção à assertiva II: partido político, no MS coletivo, pode defender interesses da sociedade (não só dos filiados) — posição do STF. A afirmativa está errada por limitar indevidamente o alcance do MS coletivo partidário.",
    difficulty: "DIFICIL",
  },
  {
    id: "dc_art5_q11",
    statement:
      "O § 1º do Art. 5º da CF/88 estabelece que as normas definidoras dos direitos e garantias fundamentais têm aplicação imediata. Sobre esse dispositivo, é correto afirmar que:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Todas as normas de direitos fundamentais são de eficácia plena e aplicabilidade imediata, sem qualquer restrição." },
      { letter: "B", text: "O § 1º confere às normas de direitos fundamentais uma presunção de aplicabilidade imediata, podendo o STF afastá-la caso a norma seja de eficácia limitada." },
      { letter: "C", text: "O § 1º elimina a distinção entre normas de eficácia plena, contida e limitada no âmbito dos direitos fundamentais." },
      { letter: "D", text: "Mesmo diante do § 1º, normas de direitos fundamentais que exigem regulamentação infraconstitucional podem ser de eficácia limitada." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "O § 1º cria uma presunção de aplicabilidade imediata, mas não transforma todas as normas em plena. Normas que exigem regulamentação (ex: direito de greve dos servidores, art. 37, VII) continuam sendo de eficácia limitada — daí a necessidade do MI nesses casos. A doutrina (Ingo Wolfgang Sarlet) entende que o § 1º é norma de máxima efetividade.",
    explanationCorrect:
      "Correto! O § 1º é uma presunção que deve ser maximizada, mas não elimina a eficácia limitada. Prova disso: a necessidade de MIs para direito de greve dos servidores (art. 37, VII).",
    explanationWrong:
      "Errado: o § 1º não transforma todas as normas em plena nem elimina as eficácias contida e limitada. O próprio MI (art. 5º, LXXI) pressupõe normas de eficácia limitada — caso contrário, seria desnecessário.",
    difficulty: "DIFICIL",
  },
  {
    id: "dc_art5_q12",
    statement:
      "A respeito do rol de direitos fundamentais do Art. 5º da CF/88 e do § 2º, que o declara não taxativo, assinale a alternativa que apresenta fundamento CORRETO para a inclusão de direitos não expressos no texto constitucional:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "O § 2º permite que leis ordinárias criem novos direitos fundamentais, desde que aprovadas por maioria simples." },
      { letter: "B", text: "Direitos podem decorrer dos princípios adotados pelo Estado brasileiro e dos tratados internacionais de direitos humanos ratificados." },
      { letter: "C", text: "O § 2º autoriza o Poder Executivo a reconhecer direitos fundamentais por meio de decretos presidenciais." },
      { letter: "D", text: "O caráter não taxativo impede a modificação do rol do Art. 5º mesmo por emenda constitucional." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O § 2º do art. 5º diz: 'Os direitos e garantias expressos nesta Constituição não excluem outros decorrentes do regime e dos princípios por ela adotados, ou dos tratados internacionais em que a República Federativa do Brasil seja parte.' Portanto, tratados de DH e princípios são fontes de direitos implícitos. Emenda constitucional pode alterar o rol, desde que não abolir o núcleo essencial (cláusula pétrea).",
    explanationCorrect:
      "Correto! O § 2º prevê duas fontes de direitos implícitos: (1) regime e princípios constitucionais e (2) tratados internacionais de direitos humanos. Esse é o fundamento do bloco de constitucionalidade.",
    explanationWrong:
      "Errado: a abertura do § 2º se refere a tratados internacionais e princípios, não a leis ordinárias ou decretos. Emendas constitucionais podem ampliar — mas não suprimir o núcleo essencial dos direitos fundamentais (cláusula pétrea, art. 60 §4º).",
    difficulty: "DIFICIL",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("🚀 Seed: Direito Constitucional — Direitos Fundamentais (Art. 5º)");
  console.log("=".repeat(60));

  // 1. Encontrar Subject
  const subjectId = await findSubject("DIR_CONSTITUCIONAL");
  if (!subjectId) {
    console.error("❌ Subject 'DIR_CONSTITUCIONAL' não encontrado. Verifique o banco.");
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
  const topicId = await findOrCreateTopic("Direitos Fundamentais — Art. 5º CF/88", subjectId);
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
  console.log("\n" + "=".repeat(60));
  console.log(`📊 RELATÓRIO FINAL:`);
  console.log(`   Conteúdos: ${contentsCreated} criados, ${contentsSkipped} já existiam`);
  console.log(`   Questões:  ${questionsCreated} criadas, ${questionsSkipped} já existiam`);
  console.log("✅ Seed de Direito Constitucional (Art. 5º) concluído!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
