/**
 * Seed R59 — Densificação: Legislação Especial — Lei de Drogas 11.343/06
 * Modo: DENSIFICAÇÃO — átomos com IDs dinâmicos do seed-leg-drogas-r17.ts.
 * ContentIds resolvidos em runtime por título + subjectId.
 *
 * Átomos-alvo (6 átomos × 6 questões = 36 questões):
 *   "Art. 28 — Porte para Consumo Pessoal: Despenalização, Medidas e Critérios"
 *   "Art. 33 — Tráfico de Drogas: Tipo Penal, Verbos Nucleares e Hediondez"
 *   "Distinção Art. 28 vs Art. 33: Critérios para Classificar Usuário ou Traficante"
 *   "§4º do Art. 33 — Tráfico Privilegiado: Causa de Diminuição e Hediondez"
 *   "Procedimento nos Crimes de Drogas: Flagrante, IP e Prazos (Lei 11.343/06)"
 *   "Arts. 34-35 — Maquinário para Drogas e Associação para o Tráfico"
 *
 * Execução: git pull && npx tsx db/seed-dense-leg-drogas-r59.ts
 */

import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

const ATOM_TITLES = {
  art28:       "Art. 28 — Porte para Consumo Pessoal: Despenalização, Medidas e Critérios",
  art33:       "Art. 33 — Tráfico de Drogas: Tipo Penal, Verbos Nucleares e Hediondez",
  distincao:   "Distinção Art. 28 vs Art. 33: Critérios para Classificar Usuário ou Traficante",
  privilegiado:"§4º do Art. 33 — Tráfico Privilegiado: Causa de Diminuição e Hediondez",
  procedimento:"Procedimento nos Crimes de Drogas: Flagrante, IP e Prazos (Lei 11.343/06)",
  associacao:  "Arts. 34-35 — Maquinário para Drogas e Associação para o Tráfico",
} as const;

type AtomKey = keyof typeof ATOM_TITLES;

interface Question {
  id: string;
  atomKey: AtomKey;
  statement: string;
  alternatives: Array<{ letter: string; text: string }>;
  correctAnswer: string;
  correctOption: number;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  questionType: "MULTIPLA_ESCOLHA" | "CERTO_ERRADO";
}

const questions: Question[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 1 — Art. 28 — Porte para Consumo Pessoal
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "leg_dr_p28_q01",
    atomKey: "art28",
    statement: "Julgue: A Lei 11.343/06 descriminalizou o porte de drogas para uso pessoal — o art. 28 não prevê mais pena de prisão, mas a conduta continua sendo crime.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. A Lei 11.343/06 promoveu DESPENALIZAÇÃO (não descriminalização): a conduta do art. 28 continua sendo CRIME, mas não há mais pena privativa de liberdade. As penas são: advertência, prestação de serviços à comunidade e medida educativa de comparecimento a programa. O STF confirmou a conduta como crime (RE 430105, 2007).",
    explanationWrong: "Descriminalização = deixa de ser crime. Despenalização = continua crime, mas sem pena de prisão. A Lei 11.343/06 adotou a despenalização para o art. 28 — o porte para uso pessoal é crime, mas as penas são alternativas (advertência, serviços comunitários, medida educativa).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "leg_dr_p28_q02",
    atomKey: "art28",
    statement: "As penas previstas para o art. 28 da Lei 11.343/06 (porte para consumo pessoal) são:",
    alternatives: [
      { letter: "A", text: "Detenção de 6 meses a 2 anos e multa." },
      { letter: "B", text: "Reclusão de 1 a 3 anos e pagamento de fiança." },
      { letter: "C", text: "Advertência sobre os efeitos das drogas, prestação de serviços à comunidade e medida educativa de comparecimento a programa ou curso educativo." },
      { letter: "D", text: "Internação compulsória em clínica de tratamento por até 6 meses." },
      { letter: "E", text: "Multa de 200 a 2.000 dias-multa e perda da carteira de habilitação." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. Art. 28, §1°, Lei 11.343/06: as penas para porte para consumo pessoal são: I — advertência sobre os efeitos das drogas; II — prestação de serviços à comunidade; III — medida educativa de comparecimento a programa ou curso educativo. Sem prisão.",
    explanationWrong: "Art. 28 não tem pena de prisão nem multa em dias-multa. As três penas são exclusivamente alternativas: advertência, prestação de serviços comunitários e medida educativa. Em caso de descumprimento, há admoestação verbal ou multa (§6°), mas não prisão.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "leg_dr_p28_q03",
    atomKey: "art28",
    statement: "Julgue: Os critérios do art. 28, §2°, da Lei 11.343/06 para distinguir usuário de traficante incluem: a natureza e quantidade da droga, o local e as condições da apreensão, e os antecedentes do agente.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Art. 28, §2°: o juiz atendera às seguintes circunstâncias para determinar se era para uso pessoal: I — natureza e quantidade da substância; II — local e condições em que se desenvolveu a ação; III — circunstâncias sociais e pessoais; IV — conduta e antecedentes do agente. São critérios, não prova matemática.",
    explanationWrong: "A distinção usuário × traficante não depende de quantidade mínima fixada em lei (a lei não define gramas ou porções). O juiz/delegado avalia o conjunto: quantidade, natureza da droga, local, embalagem, instrumentos, antecedentes, comportamento. Critérios do §2° do art. 28.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "leg_dr_p28_q04",
    atomKey: "art28",
    statement: "Em relação à prisão em flagrante pelo art. 28 da Lei 11.343/06, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "A prisão em flagrante deve ser lavrada normalmente, com conversão em preventiva pelo juiz." },
      { letter: "B", text: "Não se imporá prisão em flagrante ao agente; a autoridade policial lavrará Termo Circunstanciado de Ocorrência (TCO)." },
      { letter: "C", text: "A prisão em flagrante é obrigatória, devendo o agente ser conduzido à delegacia e apresentado ao juiz em 24h." },
      { letter: "D", text: "O agente deve ser preso e encaminhado ao centro de triagem por 48 horas." },
      { letter: "E", text: "A autoridade policial decidirá, caso a caso, se deve ou não lavrar o flagrante." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Art. 48, §2°, Lei 11.343/06: 'não se imporá prisão em flagrante, devendo o autor do fato ser imediatamente encaminhado ao juízo competente ou, na falta deste, assumir o compromisso de a ele comparecer, lavrando-se Termo Circunstanciado de Ocorrência'. TCO, não flagrante.",
    explanationWrong: "Para o art. 28, NÃO há prisão em flagrante. A autoridade policial lavra TCO (Termo Circunstanciado), não APF (Auto de Prisão em Flagrante). É similar ao procedimento do JECRIM (crimes de menor potencial ofensivo) — reflete a opção do legislador pela despenalização.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "leg_dr_p28_q05",
    atomKey: "art28",
    statement: "Julgue: Para ser processado pelo art. 28, o agente deve obrigatoriamente ser encontrado com a droga em seu poder; a mera confissão de uso sem apreensão física não gera responsabilidade penal.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanationCorrect: "ERRADO. A lei pune quem 'adquirir, guardar, tiver em depósito, transportar ou trouxer consigo' drogas para uso próprio. A prova pode ser feita por qualquer meio legal (inclusive confissão + outras evidências), não exigindo apreensão física como condição sine qua non.",
    explanationWrong: "O art. 28 pune múltiplas condutas alternativas: adquirir, guardar, ter em depósito, transportar ou trazer consigo. A prova do crime pode ser: flagrante com apreensão, confissão corroborada, depoimentos de testemunhas, etc. A apreensão facilita, mas não é condição necessária.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "leg_dr_p28_q06",
    atomKey: "art28",
    statement: "O art. 28 da Lei 11.343/06 aplica-se a qualquer substância entorpecente, inclusive as que causem dependência. Qual das seguintes condutas está tipificada no art. 28?",
    alternatives: [
      { letter: "A", text: "Tráfico internacional de drogas com utilização de aeronave." },
      { letter: "B", text: "Guardar drogas para consumo pessoal." },
      { letter: "C", text: "Associar-se para o tráfico por mais de 2 anos." },
      { letter: "D", text: "Vender drogas nas proximidades de estabelecimentos de ensino." },
      { letter: "E", text: "Financiar operações de tráfico de entorpecentes." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. O art. 28 tipifica: adquirir, guardar, ter em depósito, transportar ou trazer consigo — PARA USO PESSOAL. 'Guardar drogas para consumo pessoal' é exatamente a conduta do art. 28. As demais são crimes mais graves: tráfico (art. 33), associação (art. 35), financiamento (art. 36).",
    explanationWrong: "Art. 28: uso pessoal (sem fins de comércio). Art. 33: tráfico (com fins de venda/distribuição). Art. 35: associação para o tráfico. Art. 36: financiamento do tráfico. Art. 33, §4°: tráfico próximo a escolas (causa de aumento). A distinção é fundamental para a tipificação correta.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 2 — Art. 33 — Tráfico de Drogas
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "leg_dr_p33_q01",
    atomKey: "art33",
    statement: "Julgue: O crime de tráfico de drogas (art. 33 da Lei 11.343/06) é considerado hediondo, com regime inicial fechado obrigatório para todos os condenados, vedada a fiança.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanationCorrect: "ERRADO (parcialmente). O tráfico É hediondo e É vedada a fiança. Porém, o STF declarou inconstitucional o regime inicial fechado OBRIGATÓRIO (HC 111.840/2012) — o regime inicial deve ser fixado conforme as circunstâncias do caso (art. 33, CP), não automaticamente fechado.",
    explanationWrong: "Tráfico de drogas: hediondo (Lei 8.072/90), inafiançável, insuscetível de graça, indulto e anistia. Porém, o STF (HC 111.840) declarou inconstitucional o regime inicial fechado obrigatório — mesmo em crimes hediondos, o juiz analisa as circunstâncias para fixar o regime.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "leg_dr_p33_q02",
    atomKey: "art33",
    statement: "A pena do crime de tráfico de drogas (art. 33, caput) é:",
    alternatives: [
      { letter: "A", text: "Detenção de 1 a 3 anos e multa." },
      { letter: "B", text: "Reclusão de 5 a 15 anos e pagamento de 500 a 1.500 dias-multa." },
      { letter: "C", text: "Reclusão de 3 a 10 anos e pagamento de multa." },
      { letter: "D", text: "Reclusão de 2 a 8 anos e multa." },
      { letter: "E", text: "Reclusão de 8 a 20 anos e multa de 1.000 a 5.000 dias-multa." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Art. 33, caput, Lei 11.343/06: 'Reclusão de 5 (cinco) a 15 (quinze) anos e pagamento de 500 (quinhentos) a 1.500 (mil e quinhentos) dias-multa'. É uma das penas mais severas do ordenamento para crime não violento.",
    explanationWrong: "Pena do art. 33: reclusão 5 a 15 anos + 500 a 1.500 dias-multa. Comparativo: §4° (tráfico privilegiado) reduz de 1/6 a 2/3. §1° e §2° equiparam algumas condutas ao tráfico. Art. 40 traz causas de aumento de 1/6 a 2/3.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "leg_dr_p33_q03",
    atomKey: "art33",
    statement: "Julgue: O tráfico de drogas (art. 33) é crime de ação múltipla ou tipo misto alternativo, o que significa que a prática de mais de um verbo nuclear no mesmo contexto não multiplica os crimes.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. O art. 33 é tipo misto alternativo com 18 verbos nucleares. A prática de vários verbos no mesmo contexto fático constitui apenas UM crime. Exemplo: quem 'adquire' e depois 'guarda' e 'vende' drogas pratica um único delito, não três — as condutas formam um único crime continuado.",
    explanationWrong: "Crime de ação múltipla (tipo misto alternativo): qualquer dos 18 verbos (importar, exportar, remeter, preparar, produzir, fabricar, adquirir, vender, expor à venda, oferecer, ter em depósito, transportar, trazer consigo, guardar, prescrever, ministrar, entregar, fornecer) já configura o crime. Múltiplos verbos = 1 crime.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "leg_dr_p33_q04",
    atomKey: "art33",
    statement: "Segundo o art. 40 da Lei 11.343/06, qual das seguintes circunstâncias NÃO é causa de aumento de pena para o crime de tráfico?",
    alternatives: [
      { letter: "A", text: "Tráfico cometido nas proximidades de estabelecimentos de ensino." },
      { letter: "B", text: "Tráfico praticado com emprego de arma de fogo." },
      { letter: "C", text: "Tráfico cometido por agente primário com bons antecedentes." },
      { letter: "D", text: "Tráfico cometido com participação de criança ou adolescente." },
      { letter: "E", text: "Tráfico entre estados da Federação ou entre o Brasil e país estrangeiro." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. 'Agente primário com bons antecedentes' NÃO é causa de aumento — ao contrário, é requisito do §4° (tráfico privilegiado) para redução de pena. O art. 40 lista causas de aumento: proximidade de escolas/igrejas/hospitais, emprego de violência/arma, participação de criança/adolescente, tráfico interestadual/internacional, etc.",
    explanationWrong: "Art. 40 — causas de aumento (1/6 a 2/3): I) natureza, procedência ilícita e quantidade (não é aumento puro — serve para dosimetria); IV) escolas, hospitais, estabelecimentos prisionais; V) agente que provoca, instiga ou induz ao uso com criança; VI) violência/grave ameaça/arma; VII) participação de agente policial disfarçado.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "leg_dr_p33_q05",
    atomKey: "art33",
    statement: "Julgue: O plantio ou cultivo de plantas usadas para a produção de drogas é equiparado ao tráfico (art. 33, §1°, I), independentemente da finalidade (uso pessoal ou tráfico).",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Art. 33, §1°, I: equipara-se ao tráfico 'importar, exportar, remeter, produzir, fabricar, adquirir, vender, expor à venda, oferecer, fornecer, ter em depósito, transportar, trazer consigo ou guardar... sem autorização ou em desacordo com determinação legal... plantar, cultivar ou produzir matéria-prima, planta ou cogumelo com tais substâncias'. O cultivo se equipara ao tráfico.",
    explanationWrong: "O cultivo/plantio de plantas usadas para drogas (ex: cannabis, coca, papoula) é equiparado ao tráfico pelo art. 33, §1°, independentemente de quantidade ou finalidade declarada de uso pessoal. A pena é a mesma do art. 33, caput.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "leg_dr_p33_q06",
    atomKey: "art33",
    statement: "O tráfico de drogas no Brasil foi classificado como crime hediondo pela:",
    alternatives: [
      { letter: "A", text: "Própria Lei 11.343/06, que o equipara aos crimes hediondos." },
      { letter: "B", text: "Lei 8.072/90 (Lei dos Crimes Hediondos), que o incluiu expressamente no rol." },
      { letter: "C", text: "Súmula Vinculante do STF nº 26." },
      { letter: "D", text: "Resolução do Conselho Nacional de Justiça (CNJ)." },
      { letter: "E", text: "Decreto-lei do Executivo Federal com força de lei ordinária." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. A Lei 8.072/90 (Lei dos Crimes Hediondos) equiparou o tráfico de drogas aos crimes hediondos. O tráfico não é hediondo em si — é crime EQUIPARADO a hediondo. A CF/88 (art. 5°, XLIII) trata tráfico, tortura, terrorismo e crimes de grupos armados como crimes insuscetíveis de graça, anistia e fiança.",
    explanationWrong: "CF/88, art. 5°, XLIII: 'a lei considerará crimes inafiançáveis e insuscetíveis de graça ou anistia a prática da tortura, o tráfico ilícito de entorpecentes e drogas afins, o terrorismo e os definidos como crimes hediondos'. O tráfico é crime equiparado a hediondo, não hediondo em sentido estrito.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 3 — Distinção Art. 28 vs Art. 33
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "leg_dr_di_q01",
    atomKey: "distincao",
    statement: "Julgue: A Lei 11.343/06 estabelece uma quantidade mínima específica (em gramas) de droga para distinguir automaticamente o usuário do traficante.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanationCorrect: "ERRADO. A Lei 11.343/06 NÃO estabelece quantidade mínima em gramas para a distinção. A distinção é feita pelo juiz com base nos critérios do art. 28, §2°: natureza e quantidade da droga, local e condições da apreensão, circunstâncias sociais/pessoais, conduta e antecedentes do agente.",
    explanationWrong: "A definição por quantidade mínima (threshold) não existe na lei brasileira. Diferente de alguns países, o Brasil optou por um sistema de avaliação judicial caso a caso. Isso gera críticas sobre insegurança jurídica, mas é a opção legal vigente.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "leg_dr_di_q02",
    atomKey: "distincao",
    statement: "A diferença FUNDAMENTAL entre os arts. 28 e 33 da Lei 11.343/06 reside em:",
    alternatives: [
      { letter: "A", text: "O tipo de droga envolvida: sintéticas para o art. 33 e naturais para o art. 28." },
      { letter: "B", text: "A quantidade da droga: acima de 5g é tráfico; abaixo é uso pessoal." },
      { letter: "C", text: "A destinação: uso pessoal (art. 28) vs. comércio/distribuição a terceiros (art. 33)." },
      { letter: "D", text: "O local: em residências é art. 28; em espaço público é art. 33." },
      { letter: "E", text: "A reincidência: primários são art. 28; reincidentes são art. 33." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. A distinção central é a DESTINAÇÃO: art. 28 = drogas para uso pessoal (sem fins de comércio). Art. 33 = drogas para distribuição, venda, fornecimento a terceiros (com fins de tráfico). A finalidade determina o tipo penal — não quantidade, local ou reincidência per se.",
    explanationWrong: "A distinção art. 28 × art. 33 gira em torno da finalidade de uso: pessoal (art. 28) × distribuição/comercialização (art. 33). Os outros fatores (quantidade, local, antecedentes) são INDICADORES que auxiliam na determinação da destinação, não critérios absolutos.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "leg_dr_di_q03",
    atomKey: "distincao",
    statement: "Julgue: Em caso de dúvida sobre a destinação da droga (uso pessoal ou tráfico), o delegado de polícia deve optar pela tipificação mais grave (art. 33), por ser mais favorável à investigação criminal.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanationCorrect: "ERRADO. O princípio do in dubio pro reo (presunção de inocência, art. 5°, LVII, CF/88) exige que, em caso de dúvida, prevaleça a interpretação mais favorável ao acusado. Na prática, a autoridade policial lavra o flagrante pela conduta mais grave quando há indícios, cabendo ao MP e ao juiz a qualificação definitiva.",
    explanationWrong: "Na dúvida, aplica-se o in dubio pro reo — favorece o acusado. Porém, na fase policial, se há indícios de tráfico, a autoridade lavra o auto. É o MP que oferece denúncia e o juiz que julga. A distinção definitiva é feita no processo, com contraditório e ampla defesa.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "leg_dr_di_q04",
    atomKey: "distincao",
    statement: "Em um caso concreto, João foi preso com 50 gramas de maconha, fracionadas em 10 porções iguais embaladas individualmente em sacos plásticos. Este fato indica, para fins de tipificação:",
    alternatives: [
      { letter: "A", text: "Art. 28, pois 50g é quantidade compatível com uso pessoal de maconha." },
      { letter: "B", text: "Art. 33, pois o fracionamento em porções individuais é indício de preparação para venda." },
      { letter: "C", text: "Art. 28, pois João não foi encontrado em flagrante de venda." },
      { letter: "D", text: "Art. 33 apenas se houver confissão de tráfico por João." },
      { letter: "E", text: "Art. 33 apenas se a droga for de alta periculosidade (como crack)." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. O fracionamento em porções iguais, embaladas individualmente, é forte indício de preparação para venda (tráfico). Junto com a quantidade de 50g, configura conjunto probatório indicativo do art. 33. O art. 28, §2°, IV (conduta e circunstâncias) aponta para o tráfico neste caso.",
    explanationWrong: "A embalagem individual em porções iguais é elemento crucial: indica preparação para distribuição. Na avaliação do art. 28, §2°: 50g + 10 porções embaladas = indício forte de tráfico. A ausência de flagrante de venda não exclui o tráfico — basta ter em depósito para fins de comércio.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "leg_dr_di_q05",
    atomKey: "distincao",
    statement: "Julgue: O STF, no RE 635659 (tema 506, repercussão geral), julgou inconstitucional a criminalização do porte de drogas para uso pessoal (art. 28), mas o processo legislativo ainda não formalizou a mudança.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Em junho de 2024, o STF concluiu o julgamento do RE 635659 e declarou inconstitucional a criminalização do porte de cannabis para uso pessoal (art. 28, no que se refere à cannabis). A decisão tem efeito apenas para cannabis. O Congresso pode legislar diferentemente. Atenção: a lei formalmente ainda está em vigor — o STF declarou a inconstitucionalidade.",
    explanationWrong: "Em 2024, o STF (6×5) declarou inconstitucional o art. 28 apenas para CANNABIS (maconha). Outras drogas continuam no art. 28. O Congresso pode legislar de forma diferente. É o tema mais recente e controverso sobre a Lei de Drogas no Brasil.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "leg_dr_di_q06",
    atomKey: "distincao",
    statement: "Qual dos critérios do art. 28, §2°, da Lei 11.343/06 é o mais determinante na distinção usuário/traficante, segundo a doutrina e jurisprudência dominantes?",
    alternatives: [
      { letter: "A", text: "A cor e aparência da droga apreendida." },
      { letter: "B", text: "O local da apreensão (residência × via pública)." },
      { letter: "C", text: "A natureza e a quantidade da droga, somados ao conjunto das demais circunstâncias." },
      { letter: "D", text: "Os antecedentes criminais do agente (reincidente = traficante)." },
      { letter: "E", text: "A presença ou ausência de dinheiro com o agente." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. A natureza (tipo de droga) e quantidade são os principais indícios, mas sempre analisados em conjunto com os demais critérios. A jurisprudência do STJ e STF rejeita a aplicação automática de um único critério — a avaliação é do conjunto probatório.",
    explanationWrong: "Nenhum critério isolado é conclusivo. Local, antecedentes e dinheiro são indícios, não provas absolutas. Um usuário frequente pode ter grande quantidade para uso mensal. Um traficante pode não ter antecedentes. A análise do conjunto é o método correto — conforme os próprios §2° do art. 28 prevê.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 4 — §4° Art. 33 — Tráfico Privilegiado
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "leg_dr_pr_q01",
    atomKey: "privilegiado",
    statement: "Julgue: O §4° do art. 33 da Lei 11.343/06 (tráfico privilegiado) permite redução de pena de 1/6 a 2/3 para o condenado primário, com bons antecedentes, que não se dedique a atividades criminosas nem integre organização criminosa.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Art. 33, §4°: 'Nos delitos definidos no caput e no §1° deste artigo, as penas poderão ser reduzidas de um sexto a dois terços, desde que o agente seja primário, de bons antecedentes, não se dedique às atividades criminosas nem integre organização criminosa.' Todos os quatro requisitos são CUMULATIVOS.",
    explanationWrong: "Tráfico privilegiado (§4°): 4 requisitos CUMULATIVOS — ① primariedade, ② bons antecedentes, ③ não dedicação a atividades criminosas, ④ não integrar organização criminosa. Redução: 1/6 a 2/3. O §4° é muito cobrado em concursos de segurança pública.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "leg_dr_pr_q02",
    atomKey: "privilegiado",
    statement: "O STF, no HC 118533 (2016), decidiu que o tráfico privilegiado (§4° do art. 33):",
    alternatives: [
      { letter: "A", text: "É crime hediondo, com todas as restrições da Lei 8.072/90." },
      { letter: "B", text: "Não integra o rol de crimes hediondos, sendo possível a concessão de anistia, graça e indulto." },
      { letter: "C", text: "É hediondo apenas para reincidentes específicos em crimes de drogas." },
      { letter: "D", text: "É crime comum, fora da jurisdição da Justiça Federal em qualquer caso." },
      { letter: "E", text: "É equiparado a hediondo apenas quando há emprego de violência." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. STF, HC 118533 (2016): o tráfico privilegiado (§4°) NÃO é hediondo — não traz as restrições da Lei 8.072/90 (vedação de fiança, graça, anistia, progressão em 2/5 ou 3/5). Pode receber progressão de regime em 1/6 (regra geral do CP), graça e indulto.",
    explanationWrong: "O STF diferenciou: tráfico art. 33, caput = hediondo (equiparado). Tráfico privilegiado (§4°) = NÃO hediondo. Fundamento: o legislador criou figura menos grave para o traficante 'mula' ou eventual — não seria razoável tratá-lo como hediondo.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "leg_dr_pr_q03",
    atomKey: "privilegiado",
    statement: "Julgue: O tráfico privilegiado pode ser reconhecido mesmo que o agente seja preso com grande quantidade de droga, desde que os quatro requisitos do §4° estejam presentes.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. A lei não limita o §4° por quantidade de droga. Os únicos requisitos são os quatro legais (primariedade, bons antecedentes, não dedicação a atividades criminosas, não integrar organização criminosa). A quantidade é relevante para a dosimetria da pena na fase base e para avaliar os requisitos, mas não afasta automaticamente o §4°.",
    explanationWrong: "O §4° é uma causa de diminuição obrigatória quando preenchidos os 4 requisitos — o juiz não pode ignorá-la mesmo se a quantidade for grande. A quantidade influencia a pena-base (circunstâncias do crime), mas não automaticamente afasta o §4°.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "leg_dr_pr_q04",
    atomKey: "privilegiado",
    statement: "Para aplicação do tráfico privilegiado (§4°, art. 33), quais requisitos são CUMULATIVOS?",
    alternatives: [
      { letter: "A", text: "Primário e confessar o crime espontaneamente." },
      { letter: "B", text: "Primário, bons antecedentes, não dedicação a atividades criminosas e não integrar organização criminosa." },
      { letter: "C", text: "Primário, colaborar com a polícia e ser menor de 21 anos." },
      { letter: "D", text: "Bons antecedentes e reparar o dano causado às vítimas." },
      { letter: "E", text: "Primário e ter cometido o tráfico em pequena quantidade." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Os 4 requisitos CUMULATIVOS do §4°: ① primário; ② bons antecedentes; ③ não se dedique a atividades criminosas; ④ não integre organização criminosa. A ausência de qualquer um afasta o benefício. São avaliados no momento da sentença.",
    explanationWrong: "Macete para o §4°: PBAN — Primário, Bons antecedentes, Atividades criminosas (não dedicação), Não integrar organização criminosa. São 4 requisitos, todos necessários. Confissão, colaboração e quantidade não estão nos requisitos legais.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "leg_dr_pr_q05",
    atomKey: "privilegiado",
    statement: "Julgue: O agente que 'integra organização criminosa' para fins do §4° do art. 33 deve ser formalmente denunciado por associação criminosa (art. 288, CP) para que o benefício seja afastado.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanationCorrect: "ERRADO. Não é necessária condenação ou denúncia formal por organização criminosa para afastar o §4°. O juiz, com base nas provas dos autos do processo de tráfico, pode concluir que o agente integra organização criminosa e afastar o benefício sem condenação prévia por esse crime autônomo.",
    explanationWrong: "O §4° pode ser afastado com base em indícios colhidos no próprio processo de tráfico — não exige condenação autônoma por organização criminosa. O juiz avalia as circunstâncias probatórias. Porém, o STJ tem entendido que os indícios devem ser concretos e fundamentados.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "leg_dr_pr_q06",
    atomKey: "privilegiado",
    statement: "A fração de redução do §4° (entre 1/6 e 2/3) deve ser fixada pelo juiz com base em:",
    alternatives: [
      { letter: "A", text: "Critério puramente discricionário, sem necessidade de fundamentação." },
      { letter: "B", text: "A quantidade e natureza da droga — mais droga apreendida, menor a redução." },
      { letter: "C", text: "As circunstâncias do caso: quantidade da droga, culpabilidade, conduta social e personalidade do agente." },
      { letter: "D", text: "Tabela fixada em resolução do CNJ conforme o tipo de droga." },
      { letter: "E", text: "Negociação entre acusação e defesa no acordo de não persecução penal." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. O STJ consolidou que a fração de redução deve ser proporcional ao grau de envolvimento do agente: quantidade de droga apreendida, natureza da droga, circunstâncias da ação e personalidade. Quanto menor o envolvimento, maior a redução (até 2/3). O juiz deve fundamentar a fração escolhida.",
    explanationWrong: "A escolha da fração (1/6 a 2/3) não é discricionária pura — deve ser proporcional e fundamentada. STJ: a quantidade de droga é o principal critério para fixar a fração de diminuição. Pequena quantidade + agente eventual = redução máxima (2/3). Grande quantidade + indícios de maior envolvimento = menor redução.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 5 — Procedimento nos Crimes de Drogas
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "leg_dr_pc_q01",
    atomKey: "procedimento",
    statement: "Julgue: O prazo para conclusão do inquérito policial em crimes de tráfico de drogas é de 30 dias para indiciado preso e 90 dias para indiciado solto, podendo ambos ser duplicados.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Art. 51, Lei 11.343/06: o IP deverá ser concluído em 30 dias quando o indiciado estiver preso e em 90 dias quando solto. Ambos os prazos são suscetíveis de duplicação pelo juiz, ouvido o MP, mediante pedido justificado da autoridade policial.",
    explanationWrong: "Prazos do IP para crimes de drogas (Lei 11.343/06, art. 51): preso = 30 dias (duplicável); solto = 90 dias (duplicável). Diferem do IP comum (CPP): preso = 10 dias; solto = 30 dias. A Lei 11.343 é lei especial e prevalece sobre o CPP.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "leg_dr_pc_q02",
    atomKey: "procedimento",
    statement: "Nos crimes de tráfico de drogas (art. 33), é cabível fiança?",
    alternatives: [
      { letter: "A", text: "Sim, pois a fiança é regra para crimes não violentos." },
      { letter: "B", text: "Sim, desde que o réu seja primário e de bons antecedentes." },
      { letter: "C", text: "Não, pois o tráfico é crime equiparado a hediondo, e a CF/88 veda fiança para crimes hediondos." },
      { letter: "D", text: "Sim, apenas para o tráfico privilegiado (§4°)." },
      { letter: "E", text: "Somente em caso de tráfico de drogas leves (maconha)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. CF/88, art. 5°, XLIII: o tráfico é inafiançável. A Lei 8.072/90 e a CF/88 vedam fiança para crimes equiparados a hediondos. O tráfico privilegiado (§4°), por não ser hediondo (STF, HC 118533), pode ter fiança em tese — mas a doutrina ainda debate.",
    explanationWrong: "Tráfico de drogas: inafiançável por força constitucional (art. 5°, XLIII, CF/88). Essa vedação vale para o tráfico do caput e §1° do art. 33. Para o tráfico privilegiado (§4°), o STF decidiu que não é hediondo, o que abre debate sobre inafiançabilidade.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "leg_dr_pc_q03",
    atomKey: "procedimento",
    statement: "Julgue: Na prisão em flagrante por tráfico de drogas, a lavratura do auto de prisão em flagrante (APF) é obrigatória, independentemente do porte da droga.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Para o tráfico (art. 33), lavra-se o APF normalmente (diferente do art. 28, onde se lavra TCO). O crime de tráfico é grave, inafiançável — o flagrante é cabível e a lavratura do APF é obrigatória. O juiz decidirá sobre a conversão em prisão preventiva.",
    explanationWrong: "Art. 48, §2°, Lei 11.343/06: o TCO (sem APF) aplica-se APENAS para o art. 28 (uso pessoal). Para o tráfico (art. 33 e equiparados), aplica-se o procedimento normal do CPP: lavra-se o APF e o preso é apresentado ao juiz em 24h.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "leg_dr_pc_q04",
    atomKey: "procedimento",
    statement: "O rito processual dos crimes de tráfico de drogas é:",
    alternatives: [
      { letter: "A", text: "O rito do Tribunal do Júri, por serem crimes de maior gravidade." },
      { letter: "B", text: "O rito ordinário do CPP para todos os crimes com pena acima de 4 anos." },
      { letter: "C", text: "O rito especial da Lei 11.343/06 (arts. 54-59), diferente do CPP comum." },
      { letter: "D", text: "O rito sumaríssimo do JECRIM, por terem penas alternativas." },
      { letter: "E", text: "O rito sumário do CPP, por serem crimes de médio potencial ofensivo." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. Os crimes da Lei 11.343/06 têm rito ESPECIAL (arts. 54-59), não o ordinário do CPP. Peculiaridades: prazo de IP diferente, instrução concentrada, audiência una de instrução e julgamento, vedação de suspensão condicional do processo.",
    explanationWrong: "A Lei 11.343/06 criou rito processual próprio para os crimes de drogas (arts. 54-59). O Tribunal do Júri é para crimes dolosos contra a vida. O JECRIM (sumaríssimo) é para infrações de menor potencial ofensivo (pena máx. 2 anos). Crimes de drogas têm rito especial.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "leg_dr_pc_q05",
    atomKey: "procedimento",
    statement: "Julgue: Nos crimes de drogas, é vedada a suspensão condicional do processo (sursis processual), por expressa disposição da Lei 11.343/06.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Art. 48, §1°, Lei 11.343/06: 'O agente de qualquer das condutas previstas no art. 28 desta Lei, salvo se houver concurso com os crimes previstos nos arts. 33 a 37 desta Lei, será processado e julgado na forma dos arts. 60 e seguintes da Lei no 9.099/95.' E art. 89 da Lei 9.099 não se aplica aos crimes da Lei 11.343 (acima do art. 28).",
    explanationWrong: "A suspensão condicional do processo (sursis processual, art. 89, Lei 9.099/95) aplica-se a crimes com pena mínima ≤ 1 ano. O tráfico tem pena mínima de 5 anos — já não caberia pela lei geral. Além disso, a Lei 11.343/06 veda expressamente medidas despenalizadoras para tráfico.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "leg_dr_pc_q06",
    atomKey: "procedimento",
    statement: "Na instrução dos crimes de drogas pela Lei 11.343/06, qual é a ordem dos atos processuais na audiência?",
    alternatives: [
      { letter: "A", text: "Alegações finais orais → oitiva de testemunhas → interrogatório do réu." },
      { letter: "B", text: "Interrogatório do réu → oitiva de testemunhas → alegações finais escritas." },
      { letter: "C", text: "Oitiva de testemunhas de acusação → testemunhas de defesa → interrogatório do réu → alegações finais orais." },
      { letter: "D", text: "Interrogatório do réu → testemunhas → debates orais → sentença na mesma audiência." },
      { letter: "E", text: "Oitiva do ofendido → testemunhas de acusação → sentença oral imediata." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. O rito especial da Lei 11.343/06 (art. 57): audiência una com: ① testemunhas de acusação; ② testemunhas de defesa; ③ interrogatório do réu (por último — garantia do réu de ouvir tudo antes de falar); ④ alegações finais orais das partes; ⑤ sentença (pode ser na mesma audiência ou em até 10 dias).",
    explanationWrong: "No rito da Lei 11.343/06, o interrogatório do réu é o ÚLTIMO ato de instrução — após ouvir todas as testemunhas. Isso é garantia: o réu pode exercer plenamente seu direito de defesa após ouvir a acusação e as testemunhas. Diferente do CPP antigo em que o réu era ouvido primeiro.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 6 — Arts. 34-35 — Maquinário e Associação
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "leg_dr_as_q01",
    atomKey: "associacao",
    statement: "Julgue: O crime de associação para o tráfico (art. 35) exige o número mínimo de 4 pessoas, sendo um crime permanente cujo prazo prescricional começa a correr somente após a dissolução do grupo.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanationCorrect: "ERRADO. O art. 35 exige apenas 2 pessoas (ao menos). 'Associarem-se 2 (duas) ou mais pessoas para o fim de praticar, reiteradamente ou não, qualquer dos crimes previstos nos arts. 33, caput e §1°, e 34 desta Lei'. Não é 4 como na organização criminosa. É crime permanente.",
    explanationWrong: "Associação para o tráfico (art. 35): mínimo 2 pessoas. Crime permanente: a consumação se prolonga no tempo enquanto a associação persiste. Diferente de organização criminosa (Lei 12.850/13): mínimo 4 pessoas + estrutura ordenada e divisão de tarefas. Pena: reclusão 3 a 10 anos + multa.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "leg_dr_as_q02",
    atomKey: "associacao",
    statement: "O crime do art. 34 da Lei 11.343/06 (maquinário/aparelhamento) caracteriza-se quando:",
    alternatives: [
      { letter: "A", text: "O agente fabrica ou fornece drogas em quantidade superior à estabelecida em regulamento." },
      { letter: "B", text: "O agente fabrica, adquire, utiliza, transporta, oferece, vende, distribui, entrega a qualquer título, possui, guarda ou fornece, sem autorização, maquinário, aparelho ou instrumento destinado à fabricação, preparação, produção ou transformação de drogas." },
      { letter: "C", text: "O agente convence menor de 18 anos a portar drogas." },
      { letter: "D", text: "O agente tráfica drogas em quantidade acima de 1 kg." },
      { letter: "E", text: "O agente possui laboratório clandestino para produzir armas." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Art. 34: pune a posse/uso de maquinário destinado à fabricação de drogas. Não é necessário que a droga tenha sido produzida — basta possuir os instrumentos sem autorização. É crime autônomo, não precisando provar a produção efetiva.",
    explanationWrong: "Art. 34 é o crime de 'aparelhamento': possuir, guardar ou usar equipamentos/instrumentos destinados à fabricação de drogas sem autorização. É autônomo: pune-se mesmo sem droga encontrada. Fundamento: impede a estrutura de produção antes que ela produza.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "leg_dr_as_q03",
    atomKey: "associacao",
    statement: "Julgue: A associação para o tráfico (art. 35) é crime autônomo e pode ser imputada ao agente mesmo que não haja prova de que a associação tenha efetivamente praticado atos de tráfico.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. O art. 35 pune a ASSOCIAÇÃO EM SI — o mero ajuste para o fim de traficár já configura o crime, independentemente de atos de tráfico. É crime de perigo abstrato e consumação antecipada: a associação estável com fins de tráfico é o elemento típico, não a prática efetiva do tráfico.",
    explanationWrong: "Associação para o tráfico: crime formal/de perigo abstrato. Consumado com a associação estável + finalidade de praticar tráfico. Não exige a realização concreta do tráfico. Se o tráfico for praticado, haverá concurso de crimes (art. 35 + art. 33) — não absorção.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "leg_dr_as_q04",
    atomKey: "associacao",
    statement: "Qual a diferença entre a associação para o tráfico (art. 35, Lei 11.343/06) e o crime de organização criminosa (Lei 12.850/13)?",
    alternatives: [
      { letter: "A", text: "São idênticos — a Lei 11.343 é especial e revogou a Lei 12.850 para crimes de drogas." },
      { letter: "B", text: "A associação do art. 35 exige 2+ pessoas; a organização criminosa exige 4+ pessoas com estrutura hierárquica, divisão de tarefas e fins de obter vantagem." },
      { letter: "C", text: "A organização criminosa pune apenas lavagem de dinheiro, enquanto o art. 35 pune o tráfico." },
      { letter: "D", text: "A associação do art. 35 é crime hediondo; a organização criminosa é crime comum." },
      { letter: "E", text: "Só há distinção na pena: art. 35 = 5 anos; organização criminosa = 3 anos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Art. 35 (associação): mínimo 2 pessoas, finalidade específica de tráfico de drogas, sem exigência de estrutura ordenada. Lei 12.850/13 (organização criminosa): mínimo 4 pessoas, estrutura ordenada e com divisão de tarefas, fins de obter vantagem qualquer. São crimes distintos e podem concorrer.",
    explanationWrong: "Art. 35 × Lei 12.850: ① Número: 2+ (art. 35) vs 4+ (Lei 12.850); ② Estrutura: qualquer associação vs estrutura hierárquica ordenada; ③ Finalidade: apenas tráfico (art. 35) vs qualquer crime grave (Lei 12.850). Podem coexistir: quem integra quadrilha de tráfico pode responder pelos dois.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "leg_dr_as_q05",
    atomKey: "associacao",
    statement: "Julgue: O art. 35 da Lei 11.343/06 exige que a associação seja estável e permanente — associações esporádicas ou ocasionais não configuram o crime.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. A doutrina e o STJ exigem estabilidade e permanência da associação para configurar o art. 35. Uma reunião ocasional de duas pessoas para um único ato de tráfico não caracteriza o crime — falta o elemento de estabilidade que distingue a associação criminosa da mera coautoria eventual.",
    explanationWrong: "Elemento implícito do art. 35: estabilidade e permanência do vínculo associativo. Coautoria eventual (dois agentes juntos em um único ato de tráfico) = concurso de pessoas no art. 33, não art. 35. A associação estável + finalidade de tráfico = art. 35 + concurso com art. 33.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "leg_dr_as_q06",
    atomKey: "associacao",
    statement: "A pena do art. 35 (associação para o tráfico) é de reclusão:",
    alternatives: [
      { letter: "A", text: "1 a 3 anos e multa." },
      { letter: "B", text: "2 a 6 anos e multa." },
      { letter: "C", text: "3 a 10 anos e multa." },
      { letter: "D", text: "5 a 15 anos e multa." },
      { letter: "E", text: "8 a 20 anos sem possibilidade de redução." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. Art. 35, Lei 11.343/06: 'Associarem-se duas ou mais pessoas para o fim de praticar, reiteradamente ou não, qualquer dos crimes previstos nos arts. 33, caput e §1°, e 34 desta Lei: Pena — reclusão, de 3 (três) a 10 (dez) anos, e pagamento de 700 (setecentos) a 1.200 (mil e duzentos) dias-multa.'",
    explanationWrong: "Penas da Lei 11.343/06: Art. 28 (uso) = alternativas (sem prisão). Art. 33 caput (tráfico) = 5 a 15 anos. Art. 34 (maquinário) = 3 a 10 anos. Art. 35 (associação) = 3 a 10 anos. Art. 36 (financiamento) = 8 a 20 anos. Macete: 33>36>34=35>28.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
];

// ─── MAIN ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🚀 Seed R59 — Densificação: Lei de Drogas 11.343/06\n");

  // Encontrar subjectId de Legislação Especial ou Penal
  let subjectId: string | null = null;
  for (const term of ["LEGISL", "LEG_ESP", "ESPECIAL", "PENAL"]) {
    const rows = await db.execute(sql`
      SELECT id FROM "Subject" WHERE name ILIKE ${"%" + term + "%"} LIMIT 1
    `) as any[];
    if (rows[0]) { subjectId = rows[0].id; break; }
  }
  if (!subjectId) {
    console.error("❌ Subject não encontrado. Abortando.");
    process.exit(1);
  }
  console.log(`  ✅ Subject: ${subjectId}`);

  const contentIdMap: Record<AtomKey, string | null> = {
    art28: null, art33: null, distincao: null,
    privilegiado: null, procedimento: null, associacao: null,
  };

  for (const [key, title] of Object.entries(ATOM_TITLES) as [AtomKey, string][]) {
    // Busca sem filtro de subjectId (a Lei de Drogas pode estar em subject diferente)
    const rows = await db.execute(sql`
      SELECT id FROM "Content" WHERE title = ${title} LIMIT 1
    `) as any[];
    if (rows[0]) {
      contentIdMap[key] = rows[0].id;
      console.log(`  ✅ Átomo [${key}]: ${rows[0].id}`);
    } else {
      console.warn(`  ⚠️  NÃO encontrado: "${title}" — execute seed-leg-drogas-r17.ts primeiro`);
    }
  }

  if (Object.values(contentIdMap).every(v => !v)) {
    console.error("\n❌ Nenhum átomo encontrado. Abortando.");
    process.exit(1);
  }

  let inserted = 0, skipped = 0;

  for (const q of questions) {
    const contentId = contentIdMap[q.atomKey];
    if (!contentId) { skipped++; continue; }

    const exists = await db.execute(sql`SELECT id FROM "Question" WHERE id = ${q.id} LIMIT 1`) as any[];
    if (exists.length > 0) { console.log(`  ⏭️  Já existe: ${q.id}`); skipped++; continue; }

    const contentRows = await db.execute(sql`
      SELECT "subjectId", "topicId" FROM "Content" WHERE id = ${contentId} LIMIT 1
    `) as any[];
    if (!contentRows[0]) { skipped++; continue; }

    const { subjectId: sid, topicId } = contentRows[0];
    const alternativesJson = JSON.stringify(q.alternatives);

    await db.execute(sql`
      INSERT INTO "Question" (
        id, statement, alternatives, "correctAnswer", "correctOption",
        explanation, "explanationCorrect", "explanationWrong",
        "questionType", difficulty, "subjectId", "topicId", "contentId",
        "isActive", "timesUsed", "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternativesJson}::jsonb,
        ${q.correctAnswer}, ${q.correctOption},
        ${q.explanationCorrect}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${q.questionType}, ${q.difficulty}, ${sid}, ${topicId}, ${contentId},
        true, 0, NOW(), NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `);

    console.log(`  ✅ ${q.id} [${q.difficulty}] ${q.questionType === "CERTO_ERRADO" ? "CE" : "ME"} → ${q.atomKey}`);
    inserted++;
  }

  console.log("\n─────────────────────────────────────────");
  console.log(`✅ Inseridas : ${inserted}`);
  console.log(`⏭  Ignoradas : ${skipped}`);
  console.log(`📊 Total     : ${questions.length}`);
  console.log("─────────────────────────────────────────\n");
  process.exit(0);
}

main().catch(err => { console.error("❌ Erro fatal:", err); process.exit(1); });
