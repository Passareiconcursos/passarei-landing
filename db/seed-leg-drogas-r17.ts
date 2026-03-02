/**
 * Seed: Legislação Especial — R17 — Lei de Drogas (Lei 11.343/2006)
 * (Art. 28, Art. 33, Distinção Usuário/Traficante, Tráfico Privilegiado,
 *  Procedimento de Investigação, Crimes Equiparados e Associação)
 *
 * Popula 6 átomos de Conteúdo + 12 Questões.
 * Idempotente: verifica existência antes de inserir.
 * TODAS as questões têm "contentId" vinculado ao átomo correto.
 *
 * Execução:
 *   npx tsx db/seed-leg-drogas-r17.ts
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
  // ── 1. Art. 28 — Porte para Consumo Pessoal ────────────────────────────
  {
    title: "Art. 28 — Porte para Consumo Pessoal: Despenalização, Medidas e Critérios",
    textContent: `O art. 28 da Lei 11.343/2006 trata do porte de droga para consumo pessoal. PONTO CENTRAL: a Lei 11.343/06 promoveu a DESPENALIZAÇÃO (não a descriminalização) do porte para uso pessoal — a conduta continua sendo crime, mas não há mais pena privativa de liberdade.

MEDIDAS APLICÁVEIS (art. 28): (I) advertência sobre os efeitos das drogas; (II) prestação de serviços à comunidade; (III) medida educativa de comparecimento a programa ou curso educativo. Não há prisão, multa em dinheiro nem conversão em restritiva de liberdade.

PRAZO das medidas: advertência sem prazo fixo; prestação de serviços: 5 meses (1ª vez) ou 10 meses (reincidência); comparecimento a programa: 5 meses (1ª vez) ou 10 meses (reincidência).

DESCUMPRIMENTO (art. 28, §6º): o juiz pode impor, sucessivamente, admoestação verbal e multa. Ainda assim, sem prisão.

CRITÉRIOS DO JUIZ para distinguir usuário de traficante: natureza e quantidade da substância, local, circunstâncias, conduta, antecedentes. O juiz analisa o conjunto — não há critério único.

STF (RE 635.659, 2024 — REPERCUSSÃO GERAL): descriminalização do porte de maconha para uso pessoal — tema em evolução legislativa.`,
    mnemonic: "Art. 28 = DESPENALIZAÇÃO (não descriminalização). Medidas: ADM = Advertência, sErviços, coMparecimento. SEM prisão, sem multa em dinheiro. Descumpriu? → admoestação → multa (nunca prisão).",
    keyPoint: "Despenalização ≠ descriminalização. Art. 28: conduta é crime, mas sem pena privativa de liberdade. Medidas: advertência, prestação de serviços, comparecimento a programa. Descumprimento: admoestação e multa — nunca prisão.",
    practicalExample: "Usuário é flagrado com 2g de maconha para uso próprio → art. 28 → medidas sem prisão. Se descumprir a prestação de serviços → juiz aplica admoestação verbal e depois multa — jamais converte em detenção. Comparar: traficante flagrado com 2g mas com balança e vários celulares → art. 33.",
    difficulty: "FACIL",
  },
  // ── 2. Art. 33 — Tráfico de Drogas ────────────────────────────────────
  {
    title: "Art. 33 — Tráfico de Drogas: Tipo Penal, Verbos Nucleares e Hediondez",
    textContent: `O art. 33 da Lei 11.343/06 tipifica o tráfico de drogas. É um tipo penal MISTO ALTERNATIVO com 18 verbos nucleares: importar, exportar, remeter, preparar, produzir, fabricar, adquirir, vender, expor à venda, oferecer, ter em depósito, transportar, trazer consigo, guardar, prescrever, ministrar, entregar a consumo, fornecer — ainda que gratuitamente.

PENA: reclusão de 5 a 15 anos + multa. Crime hediondo (Lei 8.072/90, art. 2º) — salvo na hipótese do §4º (tráfico privilegiado, que perdeu a hediondez por força do STF em 2016).

HEDIONDEZ: regime inicialmente fechado para hediondos foi declarado inconstitucional pelo STF (HC 111.840/2012) — hoje o regime inicial é determinado pelo caso concreto. Vedados: anistia, graça, indulto, fiança. Liberdade provisória: cabível após análise do caso.

CRIME FORMAL E PERMANENTE: o tráfico de depósito, guarda e transporte é crime PERMANENTE — a prisão em flagrante pode ocorrer a qualquer momento enquanto a situação persiste. Os demais verbos (vender, oferecer) são crimes instantâneos.

SUJEITO ATIVO: qualquer pessoa (crime comum). Não exige habitualidade — basta praticar UMA VEZ qualquer dos verbos.`,
    mnemonic: "Art. 33 = 18 verbos. Pena: 5 a 15 anos. HEDIONDO (salvo §4º tráfico privilegiado). Crime permanente para guardar/depositar/transportar. UM verbo, UMA vez = já é tráfico.",
    keyPoint: "18 verbos nucleares (tipo misto alternativo). Pena: 5-15 anos + multa. Hediondo (salvo tráfico privilegiado do §4º). Crime permanente no depósito/guarda/transporte. Sujeito ativo: qualquer pessoa — sem exigência de habitualidade.",
    practicalExample: "Pessoa que guarda 200g de cocaína em casa para entregar ao chefe do tráfico: art. 33 (guardar + ter em depósito). Flagrante a qualquer momento (crime permanente). Mesmo que seja a primeira vez → tráfico. Pena mínima: 5 anos. Se atender aos requisitos do §4º: redução de 1/6 a 2/3.",
    difficulty: "FACIL",
  },
  // ── 3. Distinção Art. 28 vs Art. 33 ───────────────────────────────────
  {
    title: "Distinção Art. 28 vs Art. 33: Critérios para Classificar Usuário ou Traficante",
    textContent: `A distinção entre usuário (art. 28) e traficante (art. 33) é uma das questões mais cobradas em concursos sobre a Lei de Drogas. A lei NÃO define quantidade mínima — a distinção é feita pelo JUIZ com base em critérios do art. 28, §2º:

CRITÉRIOS LEGAIS (art. 28, §2º):
(I) Natureza e quantidade da substância apreendida.
(II) Local e condições em que se desenvolveu a ação.
(III) Circunstâncias sociais e pessoais do agente.
(IV) Conduta e antecedentes do agente.

ÔNUS DA PROVA: o art. 28, §2º não inverte o ônus da prova — cabe ao Ministério Público provar o tráfico. A defesa não precisa provar que é usuário. A dúvida beneficia o réu.

INDICATIVOS DE TRÁFICO (não taxativos): grande quantidade; variedade de substâncias; instrumentos (balança, embalagens, dinheiro fracionado); local próximo a ponto de tráfico; ausência de uso pessoal no histórico; antecedentes por tráfico.

INDICATIVOS DE USO PESSOAL: pequena quantidade; substância de uso próprio do agente; sem instrumentos de venda; contexto de consumo.

FLAGRANTE EM CASA (art. 33, §1º, II): flagrado guardando droga — mesmo que diga ser para uso → conjunto probatório decide.`,
    mnemonic: "Distinção: JUIZ decide com base em 4 critérios: NaQual (Natureza + Quantidade), LoCAl (Local + Condições), SoCiAl (Circunstâncias pessoais), ConAnt (Conduta + Antecedentes). MP prova o tráfico — dúvida beneficia réu.",
    keyPoint: "Não há quantidade mínima legal. O juiz analisa o conjunto de critérios do art. 28, §2º. Ônus da prova: MP prova o tráfico. A dúvida razoável leva ao art. 28 (in dubio pro reo). Instrumentos de venda são forte indício de tráfico.",
    practicalExample: "Flagrado com 5g de cocaína: se sozinho, sem instrumentos, em contexto de uso → art. 28. Se com balança, celulares, dinheiro fracionado e várias embalagens → art. 33. A quantidade isolada não decide — o conjunto probatório é o que importa.",
    difficulty: "MEDIO",
  },
  // ── 4. §4º Art. 33 — Tráfico Privilegiado ─────────────────────────────
  {
    title: "§4º do Art. 33 — Tráfico Privilegiado: Causa de Diminuição e Hediondez",
    textContent: `O art. 33, §4º, da Lei 11.343/06 prevê causa especial de diminuição de pena (tráfico privilegiado ou tráfico menor). É o dispositivo mais cobrado em provas de concursos sobre a Lei de Drogas.

REQUISITOS (todos cumulativos):
(I) Agente primário (sem condenação anterior transitada em julgado).
(II) Bons antecedentes.
(III) Não se dedique às atividades criminosas.
(IV) Não integre organização criminosa.

CONSEQUÊNCIA: redução de pena de 1/6 a 2/3. O juiz fixa a fração conforme o caso concreto — maior integração criminosa → menor redução; mais periférico ao crime → maior redução.

HEDIONDEZ DO TRÁFICO PRIVILEGIADO: STF (HC 118.533/2016, Plenário) decidiu que o tráfico privilegiado NÃO É CRIME HEDIONDO. Isso significa que o agente condenado pelo §4º não fica sujeito às vedações dos crimes hediondos (não pode pleitear progressão de regime com 2/5 ou 3/5 — usa a regra geral do art. 112 da LEP).

NATUREZA JURÍDICA: causa de diminuição de pena — incide na 3ª fase de aplicação da pena. Deve ser reconhecida pelo juiz quando presentes os requisitos (obrigatória).`,
    mnemonic: "§4º = PIBAO: Primário + Bons antecedentes + não se dedica ao crime + não integra Organização criminosa. Redução: 1/6 a 2/3. STF: tráfico privilegiado NÃO É HEDIONDO (HC 118.533/2016).",
    keyPoint: "Requisitos cumulativos (todos devem estar presentes). Redução de 1/6 a 2/3. Tráfico privilegiado NÃO É HEDIONDO (STF HC 118.533/2016) — progressão de regime pela regra geral da LEP, não pelo rito especial de hediondos.",
    practicalExample: "Jovem primário, sem antecedentes, flagrado transportando droga pelo crime organizado para pagar dívida de R$ 200: §4º aplicável se não integrar a organização formalmente (mula eventual). Pena-base mínima de 5 anos pode ser reduzida para 1 ano e 8 meses (2/3 de redução). Não sujeito ao regime hediondo.",
    difficulty: "MEDIO",
  },
  // ── 5. Procedimento nos Crimes de Drogas ──────────────────────────────
  {
    title: "Procedimento nos Crimes de Drogas: Flagrante, IP e Prazos (Lei 11.343/06)",
    textContent: `A Lei 11.343/06 estabelece procedimento especial para os crimes nela tipificados.

AUTORIDADE COMPETENTE: o Inquérito Policial nos crimes de drogas pode ser presidido pelo Delegado de Polícia (Civil ou Federal, conforme a esfera de competência). Crimes com repercussão interestadual ou internacional → Polícia Federal (LC 75/93).

PRAZO DO INQUÉRITO POLICIAL:
- Indiciado PRESO: 30 dias (prorrogável por mais 30, mediante pedido fundamentado ao juiz).
- Indiciado SOLTO: 90 dias (prorrogável).
A regra é diferente do CPP geral (10 dias preso / 30 soltos) — prazo especial da Lei de Drogas.

FLAGRANTE EM CRIMES DE DROGAS:
- Guarda, depósito e transporte são crimes PERMANENTES → flagrante a qualquer momento.
- A entrada em domicílio para flagrante exige: situação de flagrante evidente (fumaça, gritos) ou autorização judicial, salvo consentimento do morador.

LAUDO DE CONSTATAÇÃO PROVISÓRIO: lavrado no momento da apreensão por perito oficial (ou pessoa idônea) para identificar a natureza da substância. Laudo definitivo é elaborado posteriormente e é imprescindível para a denúncia.

PRISÃO PREVENTIVA: cabível nos crimes do art. 33 quando presentes os requisitos do CPP (art. 312). A simples gravidade do crime não basta.`,
    mnemonic: "IP Drogas: PRESO = 30+30 dias. SOLTO = 90 dias. Permanentes = flagrante a qualquer hora. Laudo PROVISÓRIO na apreensão; DEFINITIVO para denúncia. PF = repercussão interestadual/internacional.",
    keyPoint: "Prazo do IP: 30 dias (preso, prorrogável por mais 30) e 90 dias (solto). Diferente do CPP geral (10/30). Crimes de guardar/depositar/transportar são permanentes → flagrante a qualquer momento. Laudo definitivo indispensável para a denúncia.",
    practicalExample: "Policial Federal prende traficante em São Paulo com conexão com cartel do Paraguai (repercussão internacional) → PF tem competência para o IP. Preso flagrado → IP por 30 dias; delegado pode pedir mais 30 ao juiz se necessário. Apreensão: laudo provisório lavrado no ato; laudo definitivo vem do IGP ou PF.",
    difficulty: "MEDIO",
  },
  // ── 6. Arts. 34-35 — Crimes Equiparados e Associação ─────────────────
  {
    title: "Arts. 34-35 — Maquinário para Drogas e Associação para o Tráfico",
    textContent: `A Lei 11.343/06 prevê crimes específicos relacionados ao tráfico que vão além do art. 33:

ART. 34 — MAQUINÁRIO/APARATOS: fabrica, adquire, utiliza, transporta, oferece, vende, distribui, entrega, possui ou guarda maquinário, aparelho, instrumento ou qualquer objeto destinado à fabricação, preparação, produção ou transformação de drogas. Pena: reclusão de 3 a 10 anos + multa. Tipo penal SUBSIDIÁRIO — não se aplica quando o agente já responde pelo art. 33 (a posse de maquinário é absorvida pelo tráfico).

ART. 35 — ASSOCIAÇÃO PARA O TRÁFICO: duas ou mais pessoas se associam de forma ESTÁVEL e PERMANENTE para praticar os crimes dos arts. 33 e 34. Pena: reclusão de 3 a 10 anos + multa. DISTINÇÃO FUNDAMENTAL: associação (art. 35) × concurso de pessoas (co-autoria no art. 33). A associação exige estabilidade e permanência — ajuste eventual para UMA prática criminosa = co-autoria no art. 33, não associação.

ART. 35 vs. ORGANIZAÇÃO CRIMINOSA (Lei 12.850/13): associação = mínimo 2 pessoas + estabilidade. Organização criminosa: 4 ou mais + estrutura ordenada + divisão de tarefas + finalidade lucrativa. Condutas diferentes com penas diferentes.

CRIMES HEDIONDOS: arts. 33 (caput) e 34 são equiparados a hediondos (Lei 8.072/90). Art. 35 não consta expressamente como hediondo.`,
    mnemonic: "Art. 34 = maquinário/aparatos para drogas (3-10 anos). SUBSIDIÁRIO = absorvido pelo art. 33 quando há tráfico. Art. 35 = associação ESTÁVEL + PERMANENTE (2+ pessoas, 3-10 anos). Associação ≠ co-autoria eventual.",
    keyPoint: "Art. 34 (maquinário): tipo subsidiário — absorvido pelo art. 33 se o agente também traficou. Art. 35 (associação): exige estabilidade e permanência. Associação (2+ pessoas) ≠ organização criminosa (4+ com estrutura ordenada). Ajuste eventual = co-autoria no art. 33, não associação.",
    practicalExample: "Agente preso com balança de precisão e embalagens plásticas sem drogas → art. 34. Mas se também tiver drogas → art. 33 absorve o art. 34. Dois traficantes que trabalham juntos há 6 meses dividindo lucros → art. 35 (associação estável). Dois amigos que juntos vendem droga uma única vez → art. 33 em co-autoria (sem art. 35).",
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
  questionType: "CERTO_ERRADO" | "MULTIPLA_ESCOLHA";
  contentTitle: string;
}

const questions: QuestionData[] = [
  // ── Q1 — Art. 28: medidas aplicáveis (FACIL, MULTIPLA_ESCOLHA) ──────────
  {
    id: "qz_leg_drogas_001",
    statement: "Em relação ao art. 28 da Lei 11.343/2006, que trata do porte de droga para consumo pessoal, assinale a alternativa CORRETA quanto às medidas aplicáveis ao infrator:",
    alternatives: [
      { letter: "A", text: "Prisão simples de até 6 meses, prestação de serviços à comunidade e advertência sobre os efeitos das drogas." },
      { letter: "B", text: "Advertência sobre os efeitos das drogas, prestação de serviços à comunidade e medida educativa de comparecimento a programa ou curso educativo." },
      { letter: "C", text: "Multa em dinheiro, advertência e prestação de serviços à comunidade." },
      { letter: "D", text: "Internação compulsória em estabelecimento de saúde e prestação de serviços à comunidade." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O art. 28 da Lei 11.343/06 prevê três medidas: (I) advertência sobre os efeitos das drogas; (II) prestação de serviços à comunidade; (III) medida educativa de comparecimento a programa ou curso educativo. NÃO há pena privativa de liberdade (nem prisão simples) nem multa em dinheiro. O descumprimento dessas medidas pode gerar admoestação verbal e multa — nunca prisão.",
    explanationCorrect: "Correto! Art. 28: advertência + prestação de serviços + comparecimento a programa. Sem prisão, sem multa em dinheiro. Essa é a despenalização — a conduta continua sendo crime, mas as sanções são alternativas.",
    explanationWrong: "Art. 28 NÃO prevê prisão de qualquer espécie. As três medidas são: (I) advertência, (II) prestação de serviços e (III) comparecimento a programa educativo. Multa em dinheiro também não está prevista. O descumprimento leva a admoestação e multa (não prisão).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Art. 28 — Porte para Consumo Pessoal: Despenalização, Medidas e Critérios",
  },
  // ── Q2 — Despenalização ≠ descriminalização (FACIL, CERTO_ERRADO) ────────
  {
    id: "qz_leg_drogas_002",
    statement: "Julgue o item conforme a Lei 11.343/2006 e a jurisprudência do STF.\n\nA Lei 11.343/2006 promoveu a descriminalização do porte de droga para consumo pessoal, razão pela qual a conduta prevista no art. 28 não constitui crime, apenas infração administrativa.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "ERRADO. A Lei 11.343/06 promoveu a DESPENALIZAÇÃO, não a descriminalização. O porte para consumo pessoal (art. 28) continua sendo crime — fato típico, antijurídico e culpável. O que mudou foi a pena: não há mais pena privativa de liberdade, apenas medidas alternativas (advertência, prestação de serviços, comparecimento a programa). Obs.: o STF julgou em 2024 (RE 635.659) pela descriminalização do porte de maconha, mas ainda está em fase de modulação.",
    explanationCorrect: "O item está ERRADO. Despenalização ≠ descriminalização. A conduta do art. 28 continua sendo CRIME na Lei 11.343/06 — apenas a pena privativa de liberdade foi suprimida. Descriminalização significaria que a conduta deixa de ser crime.",
    explanationWrong: "O item está ERRADO. A Lei 11.343/06 promoveu DESPENALIZAÇÃO (sem pena privativa de liberdade), não descriminalização (conduta ainda é crime). O STF discutiu o tema em 2024, mas a lei vigente mantém o art. 28 como crime.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Art. 28 — Porte para Consumo Pessoal: Despenalização, Medidas e Critérios",
  },
  // ── Q3 — Art. 33: verbos nucleares (FACIL, MULTIPLA_ESCOLHA) ────────────
  {
    id: "qz_leg_drogas_003",
    statement: "Sobre o tipo penal do tráfico de drogas (art. 33 da Lei 11.343/06), assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "O tráfico exige a finalidade de lucro — a entrega gratuita de drogas não configura o crime do art. 33." },
      { letter: "B", text: "O tipo penal do art. 33 é um tipo misto alternativo com 18 verbos nucleares — a prática de qualquer deles, ainda que uma única vez, configura o crime." },
      { letter: "C", text: "O art. 33 exige habitualidade: a prática esporádica de um dos verbos configura apenas o art. 28 (uso pessoal)." },
      { letter: "D", text: "Para configurar tráfico, o agente deve praticar pelo menos dois dos verbos nucleares do art. 33 de forma simultânea." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O art. 33 é um tipo misto ALTERNATIVO com 18 verbos nucleares. A prática de QUALQUER UM deles, UMA ÚNICA VEZ, já configura o crime. A lei expressamente inclui a entrega gratuita ('fornecer, ainda que gratuitamente'). Não há exigência de habitualidade — um único ato de venda, guarda ou qualquer outro verbo já perfaz o tipo. Não é necessário praticar dois verbos simultaneamente.",
    explanationCorrect: "Correto! Tipo misto alternativo: 18 verbos, basta praticar UM, UMA VEZ. A entrega gratuita está expressa ('fornecer, ainda que gratuitamente'). Sem habitualidade exigida — a primeira vez já é tráfico se presentes os elementos.",
    explanationWrong: "Art. 33 = tipo misto alternativo com 18 verbos. Basta praticar UM para configurar. Não exige lucro (inclui entrega gratuita). Não exige habitualidade. Não exige dois verbos simultâneos. A distinção com o art. 28 é feita pelo JUIZ com base nos critérios do art. 28, §2º — não pela habitualidade.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Art. 33 — Tráfico de Drogas: Tipo Penal, Verbos Nucleares e Hediondez",
  },
  // ── Q4 — Art. 33 é crime hediondo (FACIL, CERTO_ERRADO) ─────────────────
  {
    id: "qz_leg_drogas_004",
    statement: "Julgue o item conforme a Lei 8.072/90 e a jurisprudência do STF.\n\nO crime de tráfico de drogas (art. 33, caput, da Lei 11.343/06) é equiparado a crime hediondo, sendo vedada a concessão de anistia, graça e indulto ao condenado por tal delito.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CERTO. O tráfico de drogas está expressamente listado na Lei 8.072/90 como equiparado a crime hediondo (art. 2º). Consequências: vedação de anistia, graça e indulto (CF, art. 5º, XLIII); livramento condicional com 2/3 da pena (sem ser reincidente); regime inicial pelo caso concreto (STF HC 111.840/2012 afastou o regime inicial fechado obrigatório). OBS: tráfico PRIVILEGIADO (§4º) NÃO é hediondo (STF HC 118.533/2016).",
    explanationCorrect: "Correto! Tráfico (art. 33, caput) = equiparado a hediondo. Vedados: anistia, graça, indulto. O tráfico PRIVILEGIADO (§4º) não é hediondo — exceção importante cobrada em provas.",
    explanationWrong: "O item está CERTO. Tráfico (art. 33, caput) é equiparado a hediondo (Lei 8.072/90). Anistia, graça e indulto são vedados. Atenção à exceção: o §4º (tráfico privilegiado) NÃO é hediondo conforme o STF (HC 118.533/2016).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Art. 33 — Tráfico de Drogas: Tipo Penal, Verbos Nucleares e Hediondez",
  },
  // ── Q5 — Critérios de distinção 28 vs 33 (MEDIO, MULTIPLA_ESCOLHA) ───────
  {
    id: "qz_leg_drogas_005",
    statement: "Policial Rodoviário Federal aborda motorista que carrega mochila com 80g de cocaína. O abordado alega ser usuário. Segundo o art. 28, §2º, da Lei 11.343/06, quais são os critérios legais que o juiz utilizará para decidir se enquadra o fato no art. 28 ou no art. 33?",
    alternatives: [
      { letter: "A", text: "Exclusivamente a quantidade e o tipo de droga, pois a lei estabelece tabelas com pesos mínimos para distinguir usuário de traficante." },
      { letter: "B", text: "Natureza e quantidade da substância; local e condições; circunstâncias sociais e pessoais; conduta e antecedentes do agente." },
      { letter: "C", text: "Apenas os antecedentes criminais do agente — primário é sempre usuário; reincidente é sempre traficante." },
      { letter: "D", text: "A confissão do agente é o critério prevalente: se declarar ser usuário, aplica-se o art. 28 obrigatoriamente." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O art. 28, §2º, da Lei 11.343/06 elenca quatro critérios que o juiz analisa: (I) natureza e quantidade da substância; (II) local e condições em que se desenvolveu a ação; (III) circunstâncias sociais e pessoais; (IV) conduta e antecedentes. Não há tabela de quantidade mínima na lei brasileira. Confissão não é critério legal (admitida, mas o juiz analisa o conjunto). Antecedentes são um dos critérios, mas não o único.",
    explanationCorrect: "Correto! Os 4 critérios do art. 28, §2º: natureza/quantidade + local/condições + circunstâncias pessoais + conduta/antecedentes. O juiz analisa o CONJUNTO. Não há quantidade mínima legal — esse erro é muito comum em provas.",
    explanationWrong: "A lei NÃO prevê tabela de quantidade mínima. O juiz analisa os 4 critérios do art. 28, §2º em conjunto. Antecedentes são apenas UM dos critérios. Confissão não é critério legal determinante. A decisão cabe ao JUIZ com base no conjunto probatório.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Distinção Art. 28 vs Art. 33: Critérios para Classificar Usuário ou Traficante",
  },
  // ── Q6 — Ônus da prova no tráfico (MEDIO, CERTO_ERRADO) ─────────────────
  {
    id: "qz_leg_drogas_006",
    statement: "Julgue o item conforme a Lei 11.343/06 e os princípios processuais penais.\n\nQuando o flagranteado alega porte para consumo pessoal (art. 28), o ônus de provar o uso pessoal recai sobre o próprio agente, pois a Lei de Drogas inverte o ônus da prova em casos de flagrante com drogas.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "ERRADO. O art. 28, §2º, não inverte o ônus da prova. Cabe ao Ministério Público provar que se trata de tráfico (art. 33). A defesa não precisa provar que é usuário — a dúvida razoável beneficia o réu (in dubio pro reo). O agente não tem o ônus de demonstrar o uso pessoal; o MP tem o ônus de demonstrar o tráfico. O juiz analisa os critérios legais para DISTINGUIR, mas o ônus permanece com a acusação.",
    explanationCorrect: "O item está ERRADO. A Lei 11.343/06 NÃO inverte o ônus da prova. O MP deve provar o tráfico. A dúvida razoável beneficia o réu → art. 28. O agente não tem obrigação de provar que é usuário.",
    explanationWrong: "O item está ERRADO. O ônus de provar o tráfico é do MP. A Lei 11.343/06 não prevê inversão do ônus. Dúvida razoável → in dubio pro reo → art. 28. O juiz usa os critérios do art. 28, §2º para analisar os fatos, mas o ônus probatório permanece com a acusação.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Distinção Art. 28 vs Art. 33: Critérios para Classificar Usuário ou Traficante",
  },
  // ── Q7 — §4º: requisitos cumulativos (MEDIO, MULTIPLA_ESCOLHA) ───────────
  {
    id: "qz_leg_drogas_007",
    statement: "Sobre a causa especial de diminuição de pena prevista no art. 33, §4º, da Lei 11.343/06 (tráfico privilegiado), assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "Para aplicação do §4º, basta que o agente seja primário e não integre organização criminosa, sendo os demais requisitos alternativos." },
      { letter: "B", text: "Os requisitos são cumulativos: o agente deve ser primário, ter bons antecedentes, não se dedicar a atividades criminosas e não integrar organização criminosa." },
      { letter: "C", text: "O §4º é aplicável a reincidentes, desde que tenham bons antecedentes e não integrem organização criminosa." },
      { letter: "D", text: "A aplicação do §4º é facultativa — o juiz pode negar a redução mesmo presentes todos os requisitos, com base no princípio da individualização da pena." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Os requisitos do art. 33, §4º são TODOS CUMULATIVOS: (I) agente primário; (II) bons antecedentes; (III) não se dedique às atividades criminosas; (IV) não integre organização criminosa. Ausente qualquer um → não se aplica o §4º. A pena é reduzida de 1/6 a 2/3. Reincidente não pode ser beneficiado. Quando presentes todos os requisitos, a aplicação é OBRIGATÓRIA — o juiz não pode negar (STJ, EREsp 1.717.218).",
    explanationCorrect: "Correto! Requisitos CUMULATIVOS: primário + bons antecedentes + não se dedica ao crime + não integra organização. Todos devem estar presentes. Aplicação: obrigatória quando presentes os requisitos (STJ).",
    explanationWrong: "Os requisitos do §4º são CUMULATIVOS — todos devem estar presentes. Reincidente não se enquadra (não é primário). Quando presentes todos os requisitos, a aplicação é OBRIGATÓRIA — o juiz não pode negar discricionariamente (STJ, EREsp 1.717.218).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "§4º do Art. 33 — Tráfico Privilegiado: Causa de Diminuição e Hediondez",
  },
  // ── Q8 — Tráfico privilegiado não é hediondo (MEDIO, CERTO_ERRADO) ────────
  {
    id: "qz_leg_drogas_008",
    statement: "Julgue o item conforme a jurisprudência do STF.\n\nO tráfico de drogas privilegiado (art. 33, §4º, da Lei 11.343/06) não é crime hediondo, razão pela qual ao condenado por esse delito não se aplicam as restrições típicas dos crimes hediondos, como o prazo diferenciado de progressão de regime.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CERTO. O STF, no HC 118.533/2016 (Plenário), decidiu que o tráfico privilegiado (art. 33, §4º) NÃO é crime hediondo. Consequência: a progressão de regime segue a regra geral do art. 112 da LEP (não o prazo especial de 2/5 ou 3/5 para hediondos). Também se permite anistia, graça e indulto. Essa distinção é cobrada em alto nível nos concursos de 2024-2026.",
    explanationCorrect: "Correto! STF HC 118.533/2016: tráfico privilegiado ≠ hediondo. Progressão de regime: regra geral da LEP. Pode receber anistia, graça e indulto. Essa distinção é essencial — tráfico caput = hediondo; §4º = não hediondo.",
    explanationWrong: "O item está CERTO. STF (HC 118.533/2016): tráfico privilegiado NÃO é hediondo. Progressão de regime: regra geral do art. 112 da LEP. Anistia, graça e indulto: cabíveis. Tráfico caput (sem §4º) = hediondo; §4º = não hediondo.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "§4º do Art. 33 — Tráfico Privilegiado: Causa de Diminuição e Hediondez",
  },
  // ── Q9 — Competência para o IP (MEDIO, MULTIPLA_ESCOLHA) ─────────────────
  {
    id: "qz_leg_drogas_009",
    statement: "Em crimes de tráfico de drogas, a competência para presidir o Inquérito Policial é atribuída à Polícia Federal quando:",
    alternatives: [
      { letter: "A", text: "A quantidade de droga apreendida superar 1 kg, independentemente do local ou origem." },
      { letter: "B", text: "O crime tiver repercussão interestadual ou internacional, conforme previsto na LC 75/93 e na jurisprudência do STJ." },
      { letter: "C", text: "O crime for praticado em área de fronteira, exclusivamente, independentemente de repercussão interestadual." },
      { letter: "D", text: "Houver associação para o tráfico (art. 35), pois esse crime é sempre de competência federal." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A Polícia Federal tem atribuição para investigar crimes com REPERCUSSÃO INTERESTADUAL OU INTERNACIONAL (LC 75/93, art. 1º, I; CF, art. 144, §1º). Crimes de tráfico restritos a um Estado são investigados pela Polícia Civil. Não há critério de peso mínimo legal para determinar a atribuição. O crime de associação (art. 35) por si só não é automaticamente federal — depende da repercussão.",
    explanationCorrect: "Correto! PF = repercussão interestadual ou internacional (LC 75/93). Tráfico local → Polícia Civil. Não existe critério de quantidade para definir a competência — o critério é o ALCANCE do crime (fronteiras estaduais ou internacionais).",
    explanationWrong: "Não há critério de quantidade (1 kg) para definir atribuição. PF investiga crimes de tráfico com repercussão INTERESTADUAL OU INTERNACIONAL (LC 75/93). Crime restrito a um Estado → Polícia Civil. Associação para o tráfico não é automaticamente federal.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Procedimento nos Crimes de Drogas: Flagrante, IP e Prazos (Lei 11.343/06)",
  },
  // ── Q10 — Prazo do IP em drogas (MEDIO, CERTO_ERRADO) ────────────────────
  {
    id: "qz_leg_drogas_010",
    statement: "Julgue o item conforme a Lei 11.343/2006.\n\nNos crimes da Lei de Drogas, o prazo para conclusão do Inquérito Policial quando o indiciado está preso é de 30 dias, prorrogável por mais 30 dias mediante pedido fundamentado ao juiz — prazo diferente do previsto no CPP geral (10 dias).",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CERTO. A Lei 11.343/06, art. 51, §1º, prevê prazo especial para o IP nos crimes de drogas: PRESO → 30 dias (prorrogável por mais 30 mediante pedido fundamentado ao juiz); SOLTO → 90 dias (prorrogável). Esse prazo é diferente do CPP geral: PRESO → 10 dias; SOLTO → 30 dias (art. 10 do CPP). A Lei especial prevalece.",
    explanationCorrect: "Correto! IP Drogas: PRESO = 30 dias (prorrogável +30). SOLTO = 90 dias. CPP geral: PRESO = 10 dias; SOLTO = 30 dias. A Lei 11.343/06 prevalece por ser especial. Questão clássica de prazo processual.",
    explanationWrong: "O item está CERTO. IP Lei de Drogas: PRESO = 30+30 dias; SOLTO = 90 dias. Prazo diferente do CPP (10/30 dias). Lei especial (11.343/06) prevalece sobre o CPP no que for específica.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Procedimento nos Crimes de Drogas: Flagrante, IP e Prazos (Lei 11.343/06)",
  },
  // ── Q11 — Art. 34: tipo subsidiário (DIFICIL, MULTIPLA_ESCOLHA) ───────────
  {
    id: "qz_leg_drogas_011",
    statement: "Um agente é preso em flagrante com balança de precisão, centenas de embalagens plásticas e 500g de cocaína. Considerando os arts. 33 e 34 da Lei 11.343/06, qual é o enquadramento penal CORRETO?",
    alternatives: [
      { letter: "A", text: "Art. 33 em concurso material com art. 34, pois cada conduta (ter droga e ter maquinário) constitui crime autônomo." },
      { letter: "B", text: "Apenas o art. 34, pois o maquinário (balança e embalagens) demonstra a atividade de preparação, absorvendo a posse da droga." },
      { letter: "C", text: "Apenas o art. 33, pois o art. 34 é tipo subsidiário — a posse dos instrumentos é absorvida pelo crime de tráfico quando praticados em conjunto." },
      { letter: "D", text: "Art. 33 em concurso formal com art. 34, pois uma única conduta (ter drogas e maquinário simultaneamente) resultou em dois crimes." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O art. 34 é um tipo SUBSIDIÁRIO — sua aplicação fica excluída quando a posse de maquinário/aparatos ocorre em conjunto com a prática do crime de tráfico (art. 33). O princípio da subsidiariedade determina que o crime-meio (art. 34 — ter os instrumentos) é absorvido pelo crime-fim (art. 33 — o tráfico em si). Nesse caso, o agente responde apenas pelo art. 33, com o maquinário servindo como circunstância agravante ou elemento do conjunto probatório.",
    explanationCorrect: "Correto! Art. 34 = tipo subsidiário: absorvido pelo art. 33 quando o agente pratica o tráfico. Princípio da subsidiariedade: crime-meio (maquinário) absorvido pelo crime-fim (tráfico). Responde só pelo art. 33.",
    explanationWrong: "Art. 34 é SUBSIDIÁRIO — quando há tráfico (art. 33), o maquinário é absorvido. Não há concurso material nem formal entre os artigos nessa situação. O art. 34 só se aplica isoladamente quando não há tráfico concomitante (ex.: pessoa com balança sem drogas).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Arts. 34-35 — Maquinário para Drogas e Associação para o Tráfico",
  },
  // ── Q12 — Art. 35: associação vs co-autoria (DIFICIL, MULTIPLA_ESCOLHA) ──
  {
    id: "qz_leg_drogas_012",
    statement: "Dois colegas de faculdade decidem, espontaneamente em uma única ocasião, comprar drogas juntos e revendê-las a colegas durante uma festa universitária. Quanto ao art. 35 da Lei 11.343/06 (associação para o tráfico), é CORRETO afirmar que:",
    alternatives: [
      { letter: "A", text: "Ambos respondem pelo art. 35, pois houve associação de duas pessoas para o tráfico de drogas." },
      { letter: "B", text: "Ambos respondem pelo art. 33 em co-autoria — o ajuste eventual para uma única prática criminosa não configura associação, que exige estabilidade e permanência." },
      { letter: "C", text: "Ambos respondem pelo art. 35 em concurso material com o art. 33, pois cometeram os dois crimes simultaneamente." },
      { letter: "D", text: "Apenas um responde pelo art. 33, pois é necessário que um dos agentes seja o líder para configurar a associação." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O art. 35 (associação para o tráfico) exige que a associação seja ESTÁVEL e PERMANENTE — não basta o ajuste esporádico ou eventual. Dois amigos que se unem para vender droga em UMA única festa não formam associação — configuram co-autoria no art. 33. Associação: há um vínculo de permanência e estabilidade entre os agentes (ex.: grupo que trafica regularmente por meses). Ajuste eventual = co-autoria no art. 33.",
    explanationCorrect: "Correto! Art. 35 (associação): exige estabilidade + permanência. Ajuste eventual para uma única ocasião = co-autoria no art. 33 (não art. 35). Esse é o critério central: permanência/estabilidade vs. eventualidade.",
    explanationWrong: "Art. 35 exige ESTABILIDADE e PERMANÊNCIA. Acordo para uma única ocasião = co-autoria no art. 33 (não associação). O mero número de pessoas (2+) não basta — o vínculo deve ser permanente. Questão que distingue o tipo do art. 35 da simples co-autoria.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Arts. 34-35 — Maquinário para Drogas e Associação para o Tráfico",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n💊  Seed R17: Legislação Especial — Lei de Drogas (Lei 11.343/06)\n");

  // ── 1. Encontrar Subject ────────────────────────────────────────────────
  let subjectId = await findSubject("Legisla");
  if (!subjectId) subjectId = await findSubject("Especial");
  if (!subjectId) subjectId = await findSubject("Penal Especial");
  if (!subjectId) {
    console.error("❌ Subject para Legislação Especial não encontrado. Tente criar o subject com nome contendo 'Legisla' ou 'Especial'.");
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
  const topicId = await findOrCreateTopic("Lei de Drogas — Lei 11.343/06", subjectId);
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
        0, ${q.questionType},
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
