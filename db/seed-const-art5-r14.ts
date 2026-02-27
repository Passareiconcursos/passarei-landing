/**
 * Seed R14-B: Direito Constitucional — Art. 5° (Incisos Avançados)
 *
 * Complementa seed-direito-constitucional-art5-r14.ts (incisos básicos).
 * Este seed cobre: Inviolabilidade do Domicílio/Comunicações (XI-XII),
 * Liberdade de Expressão (IV/V/IX/XIV), Devido Processo Legal (LIV-LV),
 * Remédios Constitucionais (LXVIII-LXXIII), Não Culpabilidade (LVII-LX),
 * Propriedade e Função Social (XXII-XXIV).
 *
 * Grupo A: contentIdMap com vínculo total (sem roleta russa).
 * Popula 6 átomos de Conteúdo + 12 Questões nível Federal/PF (CEBRASPE).
 * Idempotente: verifica existência antes de inserir.
 *
 * FILTRO ANTI-ALUCINAÇÃO:
 * — Artigos e incisos: apenas os presentes no textContent de cada átomo
 * — Cargos: usar denominações constitucionais precisas
 * — Sem menção a estados, municípios ou jurisprudência não citada no texto
 *
 * Execução:
 *   npx tsx db/seed-const-art5-r14.ts
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
    id: "dc_a5b_c01",
    title: "Inviolabilidade do Domicílio e das Comunicações (Art. 5°, XI e XII)",
    textContent: `A Constituição Federal protege a inviolabilidade do domicílio e das comunicações no Art. 5°, incisos XI e XII.

INCISO XI — INVIOLABILIDADE DO DOMICÍLIO:
"A casa é asilo inviolável do indivíduo, ninguém nela podendo penetrar sem consentimento do morador, salvo em caso de flagrante delito ou desastre, ou para prestar socorro, ou, durante o dia, por determinação judicial."

REGRAS PARA ENTRAR NO DOMICÍLIO SEM CONSENTIMENTO:
┌──────────────────────────────┬────────────────────────────────┐
│ Hipótese                     │ Hora permitida                 │
├──────────────────────────────┼────────────────────────────────┤
│ Flagrante delito             │ Qualquer hora (dia ou noite)   │
│ Desastre                     │ Qualquer hora (dia ou noite)   │
│ Prestar socorro              │ Qualquer hora (dia ou noite)   │
│ Determinação judicial        │ SOMENTE DURANTE O DIA          │
└──────────────────────────────┴────────────────────────────────┘

CONCEITO DE CASA: o STF ampliou para incluir escritórios profissionais, quartos de hotel, trailers habitados, etc. O conceito não se restringe à residência familiar.

INCISO XII — INVIOLABILIDADE DAS COMUNICAÇÕES:
"É inviolável o sigilo da correspondência e das comunicações telegráficas, de dados e das comunicações telefônicas, salvo, no último caso, por ordem judicial, nas hipóteses e na forma que a lei estabelecer para fins de investigação criminal ou instrução processual penal."

PONTO CRÍTICO: A exceção constitucional para quebra de sigilo é EXCLUSIVA para comunicações TELEFÔNICAS — por ordem judicial. Dados e correspondências têm proteção diferente (lei e jurisprudência).

DICA BANCA (PF/PRF):
A busca domiciliar noturna SEM flagrante, mesmo com mandado judicial, é ILEGAL. O mandado judicial só autoriza entrada diurna.`,
    mnemonic: "DOMICÍLIO: FDS qualquer hora (Flagrante, Desastre, Socorro). Judicial = SÓ DE DIA. Comunicações: só telefônica tem exceção constitucional (ordem judicial).",
    keyPoint: "Flagrante/desastre/socorro: dia ou noite. Mandado judicial: apenas durante o dia. Sigilo telefônico: quebra por ordem judicial para investigação criminal.",
    practicalExample: "Policial executa mandado de busca às 22h sem flagrante → ILEGAL (mandado judicial só autoriza entrada diurna). Mandado de interceptação telefônica para investigar tráfico → LEGAL (ordem judicial + fins criminais).",
    difficulty: "MEDIO",
  },
  {
    id: "dc_a5b_c02",
    title: "Liberdade de Expressão: Limites e Vedações (Art. 5°, IV, V, IX e XIV)",
    textContent: `A Constituição Federal garante a liberdade de expressão mas estabelece limites claros nos incisos IV, V, IX e XIV do Art. 5°.

INCISO IV — LIBERDADE DE MANIFESTAÇÃO DO PENSAMENTO:
"É livre a manifestação do pensamento, sendo vedado o anonimato."
→ Liberdade de expressão: garantida. Anonimato: VEDADO.
→ Razão: identificação permite responsabilização civil e penal.

INCISO V — DIREITO DE RESPOSTA E INDENIZAÇÃO:
"É assegurado o direito de resposta, proporcional ao agravo, além da indenização por dano material, moral ou à imagem."
→ Resposta deve ser PROPORCIONAL ao agravo sofrido.
→ Cumulação: resposta + indenização são acumuláveis.

INCISO IX — LIBERDADE DE EXPRESSÃO INTELECTUAL/ARTÍSTICA:
"É livre a expressão da atividade intelectual, artística, científica e de comunicação, independentemente de censura ou licença."
→ VEDADA a censura prévia.
→ Expressão artística e científica não precisam de autorização prévia.

INCISO XIV — ACESSO À INFORMAÇÃO:
"É assegurado a todos o acesso à informação e resguardado o sigilo da fonte, quando necessário ao exercício profissional."
→ Direito ao acesso à informação: universal.
→ Sigilo da fonte: protegido quando necessário ao exercício profissional (jornalistas, advogados).

LIMITES CONSTITUCIONAIS À LIBERDADE DE EXPRESSÃO:
• Vedação ao anonimato (inciso IV)
• Proibição de propaganda de guerra, subversão da ordem, preconceito (Art. 5°, XLIV e outros)
• Responsabilidade civil e penal posterior (não censura prévia)
• Inviolabilidade da honra e imagem (Art. 5°, X)

DICA BANCA:
A CF/88 NÃO admite censura PRÉVIA, mas admite responsabilização POSTERIOR por abusos na liberdade de expressão.`,
    mnemonic: "EXPRESSÃO: Pensamento livre (sem anonimato). Resposta proporcional ao agravo. Artística/intelectual: sem censura ou licença prévia. Informação: acesso universal + sigilo da fonte profissional.",
    keyPoint: "Vedado o anonimato. Direito de resposta proporcional ao agravo. Censura prévia é proibida. Sigilo da fonte protegido quando necessário ao exercício profissional.",
    practicalExample: "Blogueiro publica texto ofensivo de forma anônima: ofende o inciso IV (anonimato vedado). Autoridade proíbe publicação de livro antes de ser lançado: viola inciso IX (vedação à censura prévia).",
    difficulty: "MEDIO",
  },
  {
    id: "dc_a5b_c03",
    title: "Devido Processo Legal, Contraditório e Ampla Defesa (Art. 5°, LIV e LV)",
    textContent: `Os princípios do devido processo legal, contraditório e ampla defesa estão nos incisos LIV e LV do Art. 5° da CF/88.

INCISO LIV — DEVIDO PROCESSO LEGAL:
"Ninguém será privado da liberdade ou de seus bens sem o devido processo legal."
→ Abrange processos JUDICIAIS e ADMINISTRATIVOS.
→ Dimensões:
  • Formal (procedimental): cumprimento dos ritos e procedimentos legais
  • Substantiva (material): razoabilidade e proporcionalidade das decisões

INCISO LV — CONTRADITÓRIO E AMPLA DEFESA:
"Aos litigantes, em processo judicial ou administrativo, e aos acusados em geral são assegurados o contraditório e ampla defesa, com os meios e recursos a ela inerentes."

CONTRADITÓRIO: direito de ser informado sobre os atos processuais e de se manifestar sobre eles (informação + reação).

AMPLA DEFESA: conjunto de meios disponíveis para a defesa:
• Defesa técnica (advogado): obrigatória no processo penal
• Autodefesa: direito de presença e audiência pessoal
• Direito de produzir provas
• Direito de recorrer

APLICAÇÃO AO PROCESSO ADMINISTRATIVO:
O contraditório e a ampla defesa aplicam-se aos processos administrativos. Porém, procedimentos meramente investigatórios (inquérito policial, sindicância investigatória) não exigem contraditório pleno.

EXCEÇÕES E NUANCES:
• Inquérito policial: procedimento inquisitório, sem contraditório pleno
• Sindicância investigatória: sem contraditório; sindicância acusatória: com contraditório
• Medidas cautelares sem prévia audiência: admitidas quando a ciência da parte frustre a finalidade da medida

DICA BANCA:
O STF entende que o inquérito policial, por ser pré-processual e inquisitório, não exige a observância plena do contraditório — mas há direito à assistência de advogado.`,
    mnemonic: "DEVIDO PROCESSO: LIV=privação de liberdade/bens só com processo legal. LV=contraditório + ampla defesa em processos judiciais E administrativos. Inquérito: inquisitório (sem contraditório pleno).",
    keyPoint: "Devido processo legal: formal (procedimentos) e substantivo (razoabilidade). Contraditório e ampla defesa: processos judiciais E administrativos. Inquérito policial: inquisitório, sem contraditório pleno.",
    practicalExample: "Servidor público é demitido sem processo administrativo: viola LIV e LV (privação de cargo sem devido processo). Réu não é notificado sobre nova prova: viola o contraditório (direito de reação).",
    difficulty: "MEDIO",
  },
  {
    id: "dc_a5b_c04",
    title: "Remédios Constitucionais: HC, MS, MI, HD e AP (Art. 5°, LXVIII ao LXXIII)",
    textContent: `Os remédios constitucionais são instrumentos processuais previstos no Art. 5° da CF/88 para proteção de direitos fundamentais.

HABEAS CORPUS (LXVIII):
"Conceder-se-á habeas corpus sempre que alguém sofrer ou se achar ameaçado de sofrer violência ou coação em sua liberdade de locomoção, por ilegalidade ou abuso de poder."
→ Protege: liberdade de LOCOMOÇÃO
→ Espécies: preventivo (ameaça) e liberatório (prisão consumada)
→ Legitimidade ativa: qualquer pessoa (inclusive o próprio preso) ou até o MP de ofício

MANDADO DE SEGURANÇA (LXIX):
"Conceder-se-á mandado de segurança para proteger direito líquido e certo, não amparado por habeas corpus ou habeas data, quando o responsável pela ilegalidade ou abuso de poder for autoridade pública ou agente de pessoa jurídica no exercício de atribuições do Poder Público."
→ Protege: direito líquido e certo (comprovado de plano, sem dilação probatória)
→ Contra: autoridade pública ou delegatária de poder público
→ Prazo: 120 dias do ato

MANDADO DE INJUNÇÃO (LXXI):
"Conceder-se-á mandado de injunção sempre que a falta de norma regulamentadora torne inviável o exercício dos direitos e liberdades constitucionais e das prerrogativas inerentes à nacionalidade, à soberania e à cidadania."
→ Pressuposto: omissão legislativa que inviabiliza exercício de direito constitucional
→ Efeito: o STF passou a dar efeito CONCRETIZADOR (preenche a lacuna normativa)

HABEAS DATA (LXXII):
"Conceder-se-á habeas data: a) para assegurar o conhecimento de informações relativas à pessoa do impetrante, constantes de registros ou bancos de dados de entidades governamentais ou de caráter público; b) para a retificação de dados."
→ Protege: direito de acesso e retificação de dados PESSOAIS
→ Apenas o titular dos dados pode impetrar (personalíssimo)

AÇÃO POPULAR (LXXIII):
"Qualquer cidadão é parte legítima para propor ação popular que vise a anular ato lesivo ao patrimônio público..."
→ Legitimidade ativa: CIDADÃO (eleitor com título em dia) — não qualquer pessoa
→ Objeto: ato lesivo ao patrimônio público, moralidade administrativa, meio ambiente, patrimônio histórico e cultural
→ Isento de custas e honorários salvo má-fé

QUADRO COMPARATIVO:
HC: liberdade de locomoção
MS: direito líquido e certo (não HC nem HD)
MI: omissão normativa
HD: dados pessoais
AP: lesão ao patrimônio público (legitimidade: cidadão)`,
    mnemonic: "HC=Locomoção. MS=Líquido e Certo (120 dias). MI=Omissão normativa. HD=Dados pessoais (titular). AP=Patrimônio público (cidadão eleitoral).",
    keyPoint: "HC: liberdade de locomoção. MS: direito líquido e certo, prazo 120 dias. MI: omissão legislativa. HD: dados pessoais do titular. AP: patrimônio público, só cidadão.",
    practicalExample: "Funcionário público preso ilegalmente: HC liberatório. Candidato com aprovação negada sem justificativa: MS (direito líquido e certo). Eleitor impugna obra pública superfaturada: Ação Popular.",
    difficulty: "MEDIO",
  },
  {
    id: "dc_a5b_c05",
    title: "Princípio da Não Culpabilidade e Garantias Processuais Penais (Art. 5°, LVII a LX)",
    textContent: `Os incisos LVII a LX do Art. 5° estabelecem garantias processuais penais fundamentais.

INCISO LVII — PRESUNÇÃO DE INOCÊNCIA (NÃO CULPABILIDADE):
"Ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória."
→ Culpabilidade só se estabelece com sentença TRANSITADA EM JULGADO (irrecorrível)
→ Regra de tratamento: o acusado deve ser tratado como inocente durante o processo
→ Regra de prova: o ônus da prova é do Estado (acusação), não do acusado

INCISO LVIII — IDENTIFICAÇÃO CRIMINAL:
"O civilmente identificado não será submetido à identificação criminal, salvo nas hipóteses previstas em lei."
→ Identificado civilmente (RG/CPF): em regra, não precisa de identificação criminal (datiloscopia/foto)
→ A lei pode prever exceções (ex.: crimes hediondos)

INCISO LIX — AÇÃO PENAL PRIVADA SUBSIDIÁRIA:
"Será admitida ação privada nos crimes de ação pública, se esta não for intentada no prazo legal."
→ Inércia do MP: vítima pode propor ação privada subsidiária
→ Prazo: 6 meses do arquivamento ou da inércia do MP

INCISO LX — PUBLICIDADE DOS ATOS PROCESSUAIS:
"A lei só poderá restringir a publicidade dos atos processuais quando a defesa da intimidade ou o interesse social o exigerem."
→ Regra: publicidade dos atos processuais
→ Exceção: sigilo quando necessário para proteger a intimidade ou o interesse social

PRESUNÇÃO DE INOCÊNCIA E PRISÃO:
A presunção de inocência NÃO impede:
• Prisão em flagrante (exige análise posterior do juiz)
• Prisão preventiva (decisão judicial fundamentada)
• Prisão temporária (lei específica, decisão judicial)
O que é vedado: execução definitiva de pena antes do trânsito em julgado.

DICA BANCA (PF/PCDF):
"Ninguém será considerado culpado até o trânsito em julgado" é frequentemente cobrado com pegadinhas como "até a condenação em segunda instância" (ERRADO — exige trânsito em julgado).`,
    mnemonic: "NÃO CULPABILIDADE: culpa SÓ com trânsito em julgado (sentença irrecorrível). LVIII: civilmente identificado não faz ID criminal (salvo lei). LIX: ação privada subsidiária se MP inerte. LX: publicidade é regra.",
    keyPoint: "Culpabilidade: apenas após trânsito em julgado. Ônus da prova: do Estado. Civilmente identificado: sem ID criminal (regra). Publicidade processual: regra, sigilo é exceção fundamentada.",
    practicalExample: "Réu condenado em segunda instância mas com recurso pendente: não pode ser considerado culpado (falta trânsito em julgado). MP não oferece denúncia em 15 dias em crime de ação pública: vítima pode propor ação privada subsidiária.",
    difficulty: "MEDIO",
  },
  {
    id: "dc_a5b_c06",
    title: "Direito à Propriedade, Função Social e Desapropriação (Art. 5°, XXII, XXIII e XXIV)",
    textContent: `O Art. 5° da CF/88 garante o direito de propriedade mas condiciona seu exercício à função social.

INCISO XXII — DIREITO DE PROPRIEDADE:
"É garantido o direito de propriedade."
→ Direito fundamental de 1ª geração
→ Não é direito absoluto: condicionado à função social

INCISO XXIII — FUNÇÃO SOCIAL DA PROPRIEDADE:
"A propriedade atenderá a sua função social."
→ A função social CONDICIONA o próprio direito de propriedade
→ Propriedade que não cumpre função social pode ser objeto de intervenção estatal
→ Conceito varia conforme o tipo de propriedade:
  • Propriedade rural: aproveitamento racional, preservação ambiental, relações de trabalho, bem-estar
  • Propriedade urbana: plano diretor municipal (Art. 182 CF)

INCISO XXIV — DESAPROPRIAÇÃO:
"A lei estabelecerá o procedimento para desapropriação por necessidade ou utilidade pública, ou por interesse social, mediante justa e prévia indenização em dinheiro, ressalvados os casos previstos nesta Constituição."

MODALIDADES DE DESAPROPRIAÇÃO:
┌───────────────────────────────┬──────────────────────┬─────────────────────────┐
│ Tipo                          │ Indenização          │ Forma                   │
├───────────────────────────────┼──────────────────────┼─────────────────────────┤
│ Necessidade/utilidade pública │ Justa, prévia, dinheiro│ Regra geral             │
│ Interesse social (reforma     │ TDA (títulos)        │ Art. 184 (imóvel rural  │
│ agrária — art. 184)           │                      │ improdutivo)            │
│ Urbanística (art. 182, §4°)   │ Títulos da dívida    │ Imóvel urbano não       │
│                               │ pública              │ aproveitado             │
│ Confisco (art. 243)           │ NENHUMA              │ Culturas ilegais/grilagem│
└───────────────────────────────┴──────────────────────┴─────────────────────────┘

DESAPROPRIAÇÃO-SANÇÃO (Art. 243):
Propriedades onde se cultivem plantas psicotrópicas ou se explorem trabalho escravo: confisco SEM INDENIZAÇÃO.

DICA BANCA:
Desapropriação comum (necessidade/utilidade/interesse social pelo Art. 5°, XXIV): JUSTA, PRÉVIA e em DINHEIRO. Confisco do Art. 243: SEM indenização.`,
    mnemonic: "PROPRIEDADE: XXII=garantida. XXIII=função social (condiciona o direito). XXIV=desapropriação: justa+prévia+dinheiro (regra). Art. 243=confisco sem indenização (culturas ilícitas/trabalho escravo).",
    keyPoint: "Propriedade garantida mas condicionada à função social. Desapropriação regra: justa, prévia e em dinheiro. Art. 243 (confisco): sem indenização para culturas ilegais ou trabalho escravo.",
    practicalExample: "Fazenda improdutiva: desapropriação por interesse social (reforma agrária, Art. 184) com TDA. Sítio onde se cultivam plantas psicotrópicas: confisco pelo Art. 243, sem nenhuma indenização.",
    difficulty: "DIFICIL",
  },
];

// ============================================
// QUESTÕES (12 questões — IDs fixos)
// ============================================

interface QuestionData {
  id: string;
  statement: string;
  alternatives: Array<{ letter: string; text: string }>;
  correctOption: number;
  questionType: "MULTIPLE_CHOICE" | "CERTO_ERRADO";
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  explanationCorrect: string;
  explanationWrong: string;
  contentTitle: string;
}

const questions: QuestionData[] = [
  // Domicílio e Comunicações (c01)
  {
    id: "qz_dc52_001",
    statement: "Julgue o item: De acordo com a CF/88, é admitida a entrada forçada no domicílio de um indivíduo durante a noite, com mandado judicial, para cumprimento de busca e apreensão em crime não flagrante.",
    alternatives: [
      { letter: "A", text: "Certo" },
      { letter: "B", text: "Errado" },
    ],
    correctOption: 1,
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    explanationCorrect: "ERRADO. O Art. 5°, XI da CF/88 estabelece que a entrada por determinação judicial é permitida SOMENTE DURANTE O DIA. A entrada noturna sem flagrante, mesmo com mandado judicial, viola a inviolabilidade do domicílio. Apenas flagrante, desastre e prestação de socorro autorizam entrada a qualquer hora.",
    explanationWrong: "O inciso XI faz distinção: flagrante/desastre/socorro = qualquer hora. Mandado judicial = SOMENTE durante o dia. Entrada noturna com mandado sem flagrante é inconstitucional.",
    contentTitle: "Inviolabilidade do Domicílio e das Comunicações (Art. 5°, XI e XII)",
  },
  {
    id: "qz_dc52_002",
    statement: "Sobre o inciso XII do Art. 5° da CF/88, a quebra do sigilo das comunicações telefônicas:",
    alternatives: [
      { letter: "A", text: "Pode ser determinada pela autoridade policial em caso de urgência, independentemente de ordem judicial." },
      { letter: "B", text: "É proibida em qualquer hipótese, por se tratar de direito absoluto." },
      { letter: "C", text: "Depende de ordem judicial e deve ser para fins de investigação criminal ou instrução processual penal." },
      { letter: "D", text: "É permitida para qualquer processo judicial, inclusive cível, desde que por ordem do juiz." },
    ],
    correctOption: 2,
    questionType: "MULTIPLE_CHOICE",
    difficulty: "MEDIO",
    explanationCorrect: "Alternativa C. O Art. 5°, XII autoriza a quebra do sigilo telefônico apenas por ORDEM JUDICIAL e para fins de INVESTIGAÇÃO CRIMINAL ou INSTRUÇÃO PROCESSUAL PENAL. A exceção é restrita — não vale para processos cíveis nem pode ser determinada pela autoridade policial.",
    explanationWrong: "O inciso XII é claro: sigilo telefônico pode ser quebrado por ordem judicial, mas somente para investigação criminal ou instrução processual penal. Processos cíveis ou decisão policial sem mandado são hipóteses não previstas.",
    contentTitle: "Inviolabilidade do Domicílio e das Comunicações (Art. 5°, XI e XII)",
  },
  // Liberdade de Expressão (c02)
  {
    id: "qz_dc52_003",
    statement: "Julgue: A CF/88 veda o anonimato nas manifestações do pensamento, mas garante o sigilo da fonte ao jornalista, quando necessário ao exercício profissional, o que não configura contradição, pois protegem situações distintas.",
    alternatives: [
      { letter: "A", text: "Certo" },
      { letter: "B", text: "Errado" },
    ],
    correctOption: 0,
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    explanationCorrect: "CERTO. Não há contradição: o inciso IV veda o anonimato do emissor da mensagem (quem faz a manifestação deve ser identificável). O inciso XIV protege o sigilo da FONTE (a origem da informação obtida pelo profissional), não o anonimato do jornalista em si. São institutos distintos.",
    explanationWrong: "Vedação ao anonimato (IV) = emissor deve ser identificável. Sigilo da fonte (XIV) = identidade de quem forneceu a informação ao profissional. O jornalista não é anônimo — é identificado. Sua fonte, sim, pode ter sigilo protegido.",
    contentTitle: "Liberdade de Expressão: Limites e Vedações (Art. 5°, IV, V, IX e XIV)",
  },
  {
    id: "qz_dc52_004",
    statement: "Quanto à liberdade de expressão prevista no Art. 5°, IX da CF/88, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "A atividade intelectual e artística depende de licença prévia do poder público para ser exercida." },
      { letter: "B", text: "É livre a expressão intelectual, artística, científica e de comunicação, independentemente de censura ou licença." },
      { letter: "C", text: "O Estado pode proibir previamente publicações que atentem contra a moral e os bons costumes." },
      { letter: "D", text: "A censura prévia é admitida para conteúdos que possam ofender grupos vulneráveis." },
    ],
    correctOption: 1,
    questionType: "MULTIPLE_CHOICE",
    difficulty: "FACIL",
    explanationCorrect: "Alternativa B. O inciso IX é expresso: expressão intelectual, artística, científica e de comunicação é livre, INDEPENDENTEMENTE de censura ou licença. A CF/88 veda a censura prévia — a responsabilização ocorre APÓS a expressão, não antes.",
    explanationWrong: "O Art. 5°, IX veda censura e licença prévia de forma absoluta para atividade intelectual/artística/científica. O Estado não pode impedir a publicação — pode responsabilizar civilmente ou penalmente após a publicação.",
    contentTitle: "Liberdade de Expressão: Limites e Vedações (Art. 5°, IV, V, IX e XIV)",
  },
  // Devido Processo Legal (c03)
  {
    id: "qz_dc52_005",
    statement: "Julgue: O princípio do contraditório e da ampla defesa, previsto no Art. 5°, LV da CF/88, aplica-se tanto aos processos judiciais quanto aos processos administrativos, mas NÃO ao inquérito policial, que é procedimento inquisitório.",
    alternatives: [
      { letter: "A", text: "Certo" },
      { letter: "B", text: "Errado" },
    ],
    correctOption: 0,
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    explanationCorrect: "CERTO. O inciso LV assegura o contraditório nos processos judiciais e administrativos. O inquérito policial, porém, é procedimento pré-processual de natureza inquisitória — não há acusado formal, mas investigado. O STF firmou que o contraditório pleno não é exigível no inquérito, embora haja direito à assistência de advogado.",
    explanationWrong: "Contraditório e ampla defesa: processo judicial + processo administrativo (Art. 5°, LV). Inquérito policial: procedimento inquisitório pré-processual → sem contraditório pleno. Há direito à presença de advogado, mas não ao exercício pleno do contraditório.",
    contentTitle: "Devido Processo Legal, Contraditório e Ampla Defesa (Art. 5°, LIV e LV)",
  },
  {
    id: "qz_dc52_006",
    statement: "O Art. 5°, LIV da CF/88 prevê que ninguém será privado da liberdade ou de seus bens sem o devido processo legal. Esse princípio possui dimensão:",
    alternatives: [
      { letter: "A", text: "Apenas formal: exige o cumprimento dos ritos e procedimentos previstos em lei." },
      { letter: "B", text: "Apenas material: exige que as decisões sejam razoáveis e proporcionais, independentemente do procedimento." },
      { letter: "C", text: "Formal e material: exige tanto o cumprimento dos ritos legais quanto a razoabilidade e proporcionalidade das decisões." },
      { letter: "D", text: "Exclusivamente penal: não se aplica a processos administrativos." },
    ],
    correctOption: 2,
    questionType: "MULTIPLE_CHOICE",
    difficulty: "MEDIO",
    explanationCorrect: "Alternativa C. O devido processo legal possui DUAS dimensões: formal (procedimental) — cumprimento dos ritos e formas legais; e substantiva (material) — razoabilidade e proporcionalidade das decisões. Aplica-se a processos judiciais E administrativos.",
    explanationWrong: "O STF reconhece o devido processo legal substantivo (substantive due process), além do formal. Uma lei tecnicamente válida, mas desproporcional, pode violar o devido processo legal material.",
    contentTitle: "Devido Processo Legal, Contraditório e Ampla Defesa (Art. 5°, LIV e LV)",
  },
  // Remédios Constitucionais (c04)
  {
    id: "qz_dc52_007",
    statement: "Sobre os remédios constitucionais, assinale a alternativa correta:",
    alternatives: [
      { letter: "A", text: "O habeas data pode ser impetrado por qualquer pessoa em favor de terceiros cujos dados estejam incorretos." },
      { letter: "B", text: "A ação popular pode ser proposta por qualquer pessoa, independentemente de ser eleitor." },
      { letter: "C", text: "O mandado de injunção é cabível quando a ausência de norma regulamentadora inviabiliza o exercício de direito constitucional." },
      { letter: "D", text: "O habeas corpus protege direito líquido e certo não amparado por outros remédios." },
    ],
    correctOption: 2,
    questionType: "MULTIPLE_CHOICE",
    difficulty: "MEDIO",
    explanationCorrect: "Alternativa C. O mandado de injunção (Art. 5°, LXXI) é cabível exatamente quando a falta de norma regulamentadora torna inviável o exercício de direitos constitucionais. O HD é personalíssimo (só o titular). A AP exige qualidade de cidadão (eleitor). O HC protege liberdade de locomoção.",
    explanationWrong: "A: HD é personalíssimo — só o titular pode impetrar. B: AP exige qualidade de CIDADÃO (eleitor com título em dia). D: HC protege liberdade de locomoção, não 'direito líquido e certo' (esse é o MS).",
    contentTitle: "Remédios Constitucionais: HC, MS, MI, HD e AP (Art. 5°, LXVIII ao LXXIII)",
  },
  {
    id: "qz_dc52_008",
    statement: "Julgue: O mandado de segurança é o remédio constitucional adequado para proteger direito líquido e certo, não amparado por habeas corpus ou habeas data, contra ato ilegal ou abuso de poder de autoridade pública, e deve ser impetrado no prazo de 120 dias.",
    alternatives: [
      { letter: "A", text: "Certo" },
      { letter: "B", text: "Errado" },
    ],
    correctOption: 0,
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    explanationCorrect: "CERTO. A definição está alinhada ao Art. 5°, LXIX da CF/88 e à Lei 12.016/2009: MS protege direito líquido e certo, não amparado por HC (locomoção) nem por HD (dados pessoais), contra autoridade pública ou delegatária. Prazo: 120 dias do ato (decadencial).",
    explanationWrong: "O mandado de segurança exige: (1) direito líquido e certo; (2) não protegido por HC ou HD; (3) ato de autoridade pública ou delegatária; (4) prazo de 120 dias (decadencial, não prescricional).",
    contentTitle: "Remédios Constitucionais: HC, MS, MI, HD e AP (Art. 5°, LXVIII ao LXXIII)",
  },
  // Não Culpabilidade (c05)
  {
    id: "qz_dc52_009",
    statement: "Julgue: Segundo o Art. 5°, LVII da CF/88, alguém somente poderá ser considerado culpado após condenação em segunda instância, confirmada por tribunal superior.",
    alternatives: [
      { letter: "A", text: "Certo" },
      { letter: "B", text: "Errado" },
    ],
    correctOption: 1,
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    explanationCorrect: "ERRADO. O texto constitucional é claro: 'ninguém será considerado culpado até o TRÂNSITO EM JULGADO de sentença penal condenatória.' Trânsito em julgado = decisão irrecorrível. A afirmativa descreve erroneamente 'condenação em segunda instância confirmada por tribunal superior', o que não equivale ao trânsito em julgado.",
    explanationWrong: "O inciso LVII diz 'trânsito em julgado' — momento em que não cabe mais recurso. Condenação em segunda instância ainda comporta recursos (especial e extraordinário) e, portanto, não equivale ao trânsito em julgado para fins de estabelecimento de culpa.",
    contentTitle: "Princípio da Não Culpabilidade e Garantias Processuais Penais (Art. 5°, LVII a LX)",
  },
  {
    id: "qz_dc52_010",
    statement: "Com base no Art. 5°, LVIII da CF/88, o civilmente identificado (portador de RG) submetido à prisão em flagrante:",
    alternatives: [
      { letter: "A", text: "Nunca poderá ser submetido à identificação criminal, em nenhuma circunstância." },
      { letter: "B", text: "Em regra não será submetido à identificação criminal, mas a lei pode prever exceções." },
      { letter: "C", text: "Deverá obrigatoriamente passar por identificação criminal (datiloscopia e fotografia)." },
      { letter: "D", text: "Só ficará isento de identificação criminal se apresentar certidão de antecedentes." },
    ],
    correctOption: 1,
    questionType: "MULTIPLE_CHOICE",
    difficulty: "MEDIO",
    explanationCorrect: "Alternativa B. O inciso LVIII estabelece a regra: o civilmente identificado não será submetido à identificação criminal — salvo nas hipóteses previstas em lei. A lei pode criar exceções, como em crimes hediondos ou militares.",
    explanationWrong: "A CF/88 adota regra (sem ID criminal para identificado civilmente) mais exceção (lei pode prever hipóteses). Não é direito absoluto nem obrigação absoluta.",
    contentTitle: "Princípio da Não Culpabilidade e Garantias Processuais Penais (Art. 5°, LVII a LX)",
  },
  // Propriedade e Função Social (c06)
  {
    id: "qz_dc52_011",
    statement: "Julgue: A desapropriação prevista no Art. 5°, XXIV da CF/88 exige, como regra, indenização justa, prévia e em dinheiro. Porém, no caso de propriedade onde se cultivem plantas psicotrópicas ilegais, a Constituição prevê o confisco sem qualquer indenização.",
    alternatives: [
      { letter: "A", text: "Certo" },
      { letter: "B", text: "Errado" },
    ],
    correctOption: 0,
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    explanationCorrect: "CERTO. O Art. 5°, XXIV prevê a regra geral: desapropriação com indenização justa, prévia e em dinheiro. Já o Art. 243 da CF/88 prevê o confisco (expropriação-sanção) sem indenização para propriedades utilizadas para culturas psicotrópicas ilegais ou exploração de trabalho escravo.",
    explanationWrong: "A CF/88 tem duas normas distintas: Art. 5°, XXIV (desapropriação = indenização justa, prévia, dinheiro) e Art. 243 (confisco-sanção = sem indenização para culturas ilícitas/trabalho escravo). Ambas coexistem no texto constitucional.",
    contentTitle: "Direito à Propriedade, Função Social e Desapropriação (Art. 5°, XXII, XXIII e XXIV)",
  },
  {
    id: "qz_dc52_012",
    statement: "Sobre o princípio da função social da propriedade (Art. 5°, XXIII da CF/88), é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "A função social é um limite externo ao direito de propriedade, que permanece absoluto em seu núcleo." },
      { letter: "B", text: "A função social integra o próprio conteúdo do direito de propriedade, condicionando o seu exercício." },
      { letter: "C", text: "Aplica-se exclusivamente à propriedade rural, não incidindo sobre propriedade urbana." },
      { letter: "D", text: "A propriedade que não cumpre função social deve ser extinta, sem qualquer forma de indenização." },
    ],
    correctOption: 1,
    questionType: "MULTIPLE_CHOICE",
    difficulty: "DIFICIL",
    explanationCorrect: "Alternativa B. A função social não é mero limite externo — ela integra o CONTEÚDO do direito de propriedade. Propriedade que não cumpre função social pode ser objeto de desapropriação (com indenização na forma da lei) ou de outras sanções previstas na CF/88. Aplica-se tanto à propriedade rural quanto à urbana.",
    explanationWrong: "A função social é elemento constitutivo do direito de propriedade, não apenas um limite externo. A propriedade urbana também deve cumprir função social (plano diretor, Art. 182 CF). A não observância pode gerar desapropriação, mas com indenização (exceto confisco do Art. 243).",
    contentTitle: "Direito à Propriedade, Função Social e Desapropriação (Art. 5°, XXII, XXIII e XXIV)",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("🚀 Seed R14-B: Direito Constitucional — Art. 5° Incisos Avançados");
  console.log("=".repeat(70));

  // 1. Encontrar subject
  const subjectId = await findSubject("DIR_CONSTITUCIONAL");
  if (!subjectId) {
    console.error("❌ Subject DIR_CONSTITUCIONAL não encontrado.");
    process.exit(1);
  }
  console.log(`✅ Subject: ${subjectId}`);

  // 2. Encontrar ou criar tópico
  const topicId = await findOrCreateTopic("Direitos e Garantias Fundamentais (Art. 5°)", subjectId);
  console.log(`✅ Tópico: ${topicId}`);

  // 3. Inserir content atoms + construir contentIdMap
  console.log("\n📚 Inserindo content atoms...");
  const contentIdMap: Record<string, string> = {};

  for (const c of contents) {
    if (await contentExists(c.title, subjectId)) {
      const rows = await db.execute(sql`
        SELECT id FROM "Content" WHERE title = ${c.title} AND "subjectId" = ${subjectId} LIMIT 1
      `) as any[];
      contentIdMap[c.title] = rows[0].id;
      console.log(`  ⏭️  Já existe: "${c.title}" → ${rows[0].id}`);
      continue;
    }

    const wordCount = c.textContent.split(/\s+/).length;
    const estimatedReadTime = Math.ceil(wordCount / 200);

    await db.execute(sql`
      INSERT INTO "Content" (
        id, title, "textContent", "subjectId", "topicId",
        difficulty, mnemonic, "keyPoint", "practicalExample",
        "wordCount", "estimatedReadTime",
        "createdAt", "updatedAt"
      ) VALUES (
        ${c.id}, ${c.title}, ${c.textContent}, ${subjectId}, ${topicId},
        ${c.difficulty}, ${c.mnemonic}, ${c.keyPoint}, ${c.practicalExample},
        ${wordCount}, ${estimatedReadTime},
        NOW(), NOW()
      )
    `);
    contentIdMap[c.title] = c.id;
    console.log(`  ✅ Criado: "${c.title}" (${wordCount}w)`);
  }

  // 4. Inserir questões
  console.log("\n❓ Inserindo questões...");
  let inserted = 0;
  let skipped = 0;

  for (const q of questions) {
    if (await questionExists(q.id)) {
      console.log(`  ⏭️  Já existe: ${q.id}`);
      skipped++;
      continue;
    }

    const contentId = contentIdMap[q.contentTitle];
    if (!contentId) {
      console.warn(`  ⚠️  Content não encontrado para "${q.contentTitle}" — pulando ${q.id}`);
      continue;
    }

    const alternatives = JSON.stringify(q.alternatives);

    await db.execute(sql`
      INSERT INTO "Question" (
        id, statement, alternatives, "correctOption",
        "questionType", difficulty,
        "explanationCorrect", "explanationWrong",
        "subjectId", "topicId", "contentId",
        "isActive", "timesUsed", "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternatives}::jsonb, ${q.correctOption},
        ${q.questionType}, ${q.difficulty},
        ${q.explanationCorrect}, ${q.explanationWrong},
        ${subjectId}, ${topicId}, ${contentId},
        true, 0, NOW(), NOW()
      )
    `);
    console.log(`  ✅ ${q.id} [${q.difficulty}] → "${q.contentTitle.slice(0, 45)}..."`);
    inserted++;
  }

  // 5. Relatório
  console.log("\n" + "=".repeat(70));
  console.log("📊 RELATÓRIO FINAL — R14-B Direito Constitucional Art. 5° (Incisos Avançados):");
  console.log(`   Content atoms: ${Object.keys(contentIdMap).length} (${contents.length - skipped} novos)`);
  console.log(`   Questões inseridas: ${inserted} | Já existiam: ${skipped}`);
  console.log("✅ Seed R14-B concluído!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
