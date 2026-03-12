/**
 * Seed R58 — Densificação: Direito Administrativo — Atos Administrativos
 * Modo: DENSIFICAÇÃO — átomos com IDs dinâmicos do seed-admin-atos-r16.ts.
 * ContentIds resolvidos em runtime por título + subjectId.
 *
 * Átomos-alvo (6 átomos × 6 questões = 36 questões):
 *   "Competência no Ato: Delegação, Avocação e Vícios de Competência"
 *   "Finalidade do Ato Administrativo e Desvio de Poder"
 *   "Forma do Ato Administrativo: Exigência, Publicidade e Motivação"
 *   "Motivo do Ato: Pressuposto Fático, Jurídico e Teoria dos Motivos Determinantes"
 *   "Objeto do Ato Administrativo: Conteúdo, Requisitos e Vícios Insanáveis"
 *   "Quadro de Vícios dos Atos Administrativos por Elemento COMFI"
 *
 * Execução: git pull && npx tsx db/seed-dense-adm-atos-r58.ts
 */

import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

// Títulos exatos dos átomos (conforme criados no seed-admin-atos-r16.ts)
const ATOM_TITLES = {
  competencia:  "Competência no Ato: Delegação, Avocação e Vícios de Competência",
  finalidade:   "Finalidade do Ato Administrativo e Desvio de Poder",
  forma:        "Forma do Ato Administrativo: Exigência, Publicidade e Motivação",
  motivo:       "Motivo do Ato: Pressuposto Fático, Jurídico e Teoria dos Motivos Determinantes",
  objeto:       "Objeto do Ato Administrativo: Conteúdo, Requisitos e Vícios Insanáveis",
  vicios:       "Quadro de Vícios dos Atos Administrativos por Elemento COMFI",
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
  // ÁTOMO 1 — Competência: Delegação, Avocação e Vícios
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "adm_ato_cm_q01",
    atomKey: "competencia",
    statement: "Julgue: A delegação de competência transfere ao delegado a titularidade do cargo, não podendo o delegante revogar o ato delegado.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanationCorrect: "ERRADO. A delegação NÃO transfere a titularidade — apenas o exercício. O delegante pode revogar a delegação a qualquer tempo (Art. 14, §2°, Lei 9.784/99). A titularidade permanece com o órgão/agente original.",
    explanationWrong: "Delegação: delega-se o EXERCÍCIO, não a titularidade. É revogável a qualquer momento pelo delegante. O delegante também pode avocar (retomar) a competência delegada.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "adm_ato_cm_q02",
    atomKey: "competencia",
    statement: "A avocação de competência consiste em:",
    alternatives: [
      { letter: "A", text: "Transferir temporariamente atribuições próprias a um subordinado." },
      { letter: "B", text: "O superior hierárquico chamar a si o exercício de competência atribuída a subordinado." },
      { letter: "C", text: "Atribuir a outro órgão sem relação hierárquica a competência de um agente." },
      { letter: "D", text: "O cancelamento definitivo de todos os atos praticados por subordinado." },
      { letter: "E", text: "A extinção da competência de um agente por motivo disciplinar." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Avocação: superior hierárquico retoma temporariamente competência exercida por subordinado. Pressupõe relação de hierarquia. A delegação (A) é o oposto: superior delega ao subordinado.",
    explanationWrong: "Delegação: superior → subordinado (ou outro). Avocação: superior ← subordinado (superior retoma). Ambas são temporárias e revogáveis. Só é possível entre órgãos com relação de hierarquia.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_ato_cm_q03",
    atomKey: "competencia",
    statement: "Julgue: O vício de competência em razão da matéria (incompetência material) é sanável por ratificação posterior da autoridade competente.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanationCorrect: "ERRADO. O vício de competência em razão da MATÉRIA é insanável (gera nulidade absoluta). Apenas o vício de competência em razão da PESSOA (hierarquia) é passível de ratificação/convalidação pela autoridade competente.",
    explanationWrong: "Vícios de competência: em razão da PESSOA (autoridade incompetente dentro da mesma matéria) → sanável por ratificação. Em razão da MATÉRIA (ato praticado por órgão que não tem aquela atribuição) → insanável, nulidade absoluta.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "adm_ato_cm_q04",
    atomKey: "competencia",
    statement: "Segundo a Lei 9.784/99, são INSUSCETÍVEIS de delegação:",
    alternatives: [
      { letter: "A", text: "Atos de mero expediente e de rotina administrativa." },
      { letter: "B", text: "A edição de atos de caráter normativo, a decisão de recursos administrativos e as matérias de competência exclusiva." },
      { letter: "C", text: "Apenas as matérias de segurança nacional e defesa." },
      { letter: "D", text: "Os atos de concessão de licenças e autorizações individuais." },
      { letter: "E", text: "Qualquer ato que envolva contatos com o cidadão." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Art. 13, Lei 9.784/99: não podem ser delegados — (I) atos de caráter normativo; (II) decisão de recursos administrativos; (III) matérias de competência exclusiva. São exceções taxativas à regra geral de delegabilidade.",
    explanationWrong: "Lei 9.784/99, Art. 13 — hipóteses indelegáveis: atos NORMATIVOS (poder normativo é personalíssimo), RECURSOS administrativos (garantia ao administrado de revisor imparcial), competências EXCLUSIVAS (atribuídas especificamente ao cargo/órgão).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_ato_cm_q05",
    atomKey: "competencia",
    statement: "Julgue: O excesso de poder, modalidade de abuso de poder, ocorre quando o agente público atua dentro de sua competência, mas com finalidade diversa da prevista em lei.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanationCorrect: "ERRADO. A questão inverteu os conceitos. EXCESSO DE PODER: agente age FORA dos limites de sua competência (excede o que pode). DESVIO DE PODER (ou de finalidade): agente age dentro da competência, mas com finalidade diversa da prevista em lei.",
    explanationWrong: "Abuso de poder: gênero. Espécies: ① Excesso de poder = age além da competência (vício no elemento COMPETÊNCIA). ② Desvio de poder/finalidade = age dentro da competência mas com fim ilegal (vício no elemento FINALIDADE).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "adm_ato_cm_q06",
    atomKey: "competencia",
    statement: "A competência administrativa é caracterizada como irrenunciável porque:",
    alternatives: [
      { letter: "A", text: "Os agentes públicos não têm interesse em exercer atribuições complexas." },
      { letter: "B", text: "A competência é estabelecida em benefício do interesse público, e não do agente, sendo portanto indisponível." },
      { letter: "C", text: "A Constituição proíbe expressamente qualquer forma de transferência de atribuições." },
      { letter: "D", text: "O agente público seria responsabilizado pelo simples ato de renúncia." },
      { letter: "E", text: "A irrenunciabilidade decorre do princípio da legalidade fiscal." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. A competência é irrenunciável porque foi atribuída para servir ao interesse público — não é prerrogativa pessoal do agente. O agente pode DELEGAR o exercício (não a titularidade), mas não pode simplesmente abrir mão de sua competência.",
    explanationWrong: "Características da competência administrativa: irrenunciável (não pode ser abdicada), imprescritível (não se perde pelo desuso), improrrogável (incompetente não se torna competente pela inércia do competente), e de exercício obrigatório quando não há discricionariedade.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 2 — Finalidade e Desvio de Poder
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "adm_ato_fi_q01",
    atomKey: "finalidade",
    statement: "Julgue: O princípio da finalidade exige que o ato administrativo sempre vise ao interesse público, sendo nulo o ato praticado com finalidade de benefício pessoal do agente ou de terceiro.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. O elemento finalidade do ato administrativo é SEMPRE o interesse público. O desvio de finalidade (perseguir interesse privado ou finalidade diferente da prevista em lei) torna o ato nulo por vício insanável no elemento finalidade.",
    explanationWrong: "A finalidade é um dos 5 elementos do ato administrativo (COMFI: Competência, Objeto, Motivo, Forma, finalIdade). É sempre o interesse público. O desvio = nulidade absoluta, pois protege a coletividade contra uso pessoal do poder público.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "adm_ato_fi_q02",
    atomKey: "finalidade",
    statement: "O desvio de finalidade no ato administrativo caracteriza-se quando:",
    alternatives: [
      { letter: "A", text: "O agente age sem motivação expressa no ato." },
      { letter: "B", text: "O agente utiliza o ato para atingir fim diverso do interesse público ou fim público diferente daquele previsto em lei para aquele ato." },
      { letter: "C", text: "O ato carece de forma legal estabelecida em decreto." },
      { letter: "D", text: "O objeto do ato é fisicamente impossível de ser executado." },
      { letter: "E", text: "O agente excede o prazo legal para a prática do ato." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Desvio de finalidade: (1) ato praticado visando interesse privado (desvio puro); (2) ato praticado visando fim público diferente do previsto para aquela forma de ato (ex: remoção de servidor para prejudicá-lo em vez de reorganização). Ambas são formas de desvio.",
    explanationWrong: "Desvio de finalidade: o ato aparentemente regular esconde intenção ilegal. Exemplos clássicos: remoção punitiva (disfarçada de reorganização), desapropriação para beneficiar particular, multa com fim de perseguição. O STJ admite prova por indícios (desvio difícil de provar diretamente).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_ato_fi_q03",
    atomKey: "finalidade",
    statement: "Julgue: O desvio de poder é uma forma de abuso de poder em que o agente excede os limites de sua competência ao praticar o ato.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanationCorrect: "ERRADO. O desvio de poder (= desvio de finalidade) ocorre quando o agente age DENTRO de sua competência, mas com finalidade diversa da prevista em lei. O excesso de poder é que ocorre quando o agente age FORA dos limites de competência.",
    explanationWrong: "Abuso de poder: ① Excesso de poder = extrapola competência (quem age é incompetente para aquele ato). ② Desvio de poder = age com competência, mas com fim ilegal (competente, mas malicioso). O desvio é mais difícil de detectar.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "adm_ato_fi_q04",
    atomKey: "finalidade",
    statement: "Em relação à finalidade nos atos discricionários, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "Nos atos discricionários, o agente pode livremente escolher a finalidade, inclusive pessoal." },
      { letter: "B", text: "A discricionariedade não alcança o elemento finalidade — em qualquer ato administrativo, a finalidade é sempre vinculada ao interesse público." },
      { letter: "C", text: "Atos discricionários não podem ser anulados por desvio de finalidade, pois há liberdade de escolha." },
      { letter: "D", text: "A finalidade pública é exigida apenas nos atos vinculados, não nos discricionários." },
      { letter: "E", text: "O Poder Judiciário não controla o elemento finalidade em atos discricionários." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. A discricionariedade refere-se ao OBJETO e ao MOTIVO (mérito administrativo: conveniência e oportunidade). A FINALIDADE nunca é discricionária — sempre vinculada ao interesse público. Desvio de finalidade torna nulo qualquer ato, vinculado ou discricionário.",
    explanationWrong: "Nos atos discricionários, o mérito (conveniência/oportunidade) não é sindicável pelo Judiciário. Mas LEGALIDADE (incluindo finalidade) sempre é controlável. O Judiciário pode anular qualquer ato com desvio de finalidade, mesmo que discricionário.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_ato_fi_q05",
    atomKey: "finalidade",
    statement: "Julgue: A chamada 'teoria dos motivos determinantes' aplica-se também ao elemento finalidade: se a Administração declarar finalidade pública que não corresponde à real, o ato é nulo por desvio.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. A teoria dos motivos determinantes vincula a Administração aos motivos declarados. Se a finalidade declarada for falsa (ex: remoção declarada como reorganização, mas real motivo é punição), o ato é nulo por desvio de finalidade — mesmo que a Administração pudesse praticar o ato por outros motivos.",
    explanationWrong: "Teoria dos motivos determinantes: os motivos (e a finalidade) declarados no ato vinculam a Administração. Se o motivo/finalidade declarados forem falsos ou inexistentes, o ato é nulo. A Administração não pode praticar ato com justificativa diferente da real intenção.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "adm_ato_fi_q06",
    atomKey: "finalidade",
    statement: "O vício de finalidade no ato administrativo gera qual tipo de invalidade?",
    alternatives: [
      { letter: "A", text: "Anulabilidade relativa, sanável por convalidação da autoridade superior." },
      { letter: "B", text: "Irregularidade formal, corrigível por apostila." },
      { letter: "C", text: "Nulidade absoluta, insanável, com efeitos ex tunc (retroativos)." },
      { letter: "D", text: "Nulidade relativa, com efeitos ex nunc (prospectivos)." },
      { letter: "E", text: "Ineficácia temporária, suspendendo os efeitos até regularização." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. O desvio de finalidade é vício INSANÁVEL — não admite convalidação. Gera NULIDADE ABSOLUTA com efeitos retroativos (ex tunc): o ato é considerado inválido desde sua origem. Apenas os vícios de competência (em razão da pessoa) e forma (não essencial) admitem convalidação.",
    explanationWrong: "Vícios SANÁVEIS (convalidáveis): competência em razão da pessoa e forma não essencial. Vícios INSANÁVEIS (nulidade): competência em razão da matéria, finalidade, motivo e objeto ilícito/impossível. O desvio de finalidade = nulidade absoluta + efeitos ex tunc.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 3 — Forma: Exigência, Publicidade e Motivação
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "adm_ato_fo_q01",
    atomKey: "forma",
    statement: "Julgue: A regra geral no direito administrativo é que os atos administrativos exigem forma escrita, sendo vedada a forma verbal em qualquer circunstância.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanationCorrect: "ERRADO. A regra é a forma escrita, mas são admitidos atos verbais em situações de urgência e rotina (ex: sinais de trânsito por guarda de trânsito, ordens verbais em situações emergenciais). A Lei 9.784/99 admite forma oral para atos de mero expediente.",
    explanationWrong: "Forma no ato administrativo: regra = forma escrita. Exceções: atos verbais (ordens em emergências, sinalização), atos gestuais (sinal de trânsito pelo agente), atos por omissão (silêncio administrativo com previsão legal). A forma escrita é a regra, não a exclusividade.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "adm_ato_fo_q02",
    atomKey: "forma",
    statement: "A motivação do ato administrativo é:",
    alternatives: [
      { letter: "A", text: "Obrigatória apenas nos atos discricionários, sendo dispensada nos vinculados." },
      { letter: "B", text: "Desnecessária em qualquer ato, pois a lei já estabelece os fundamentos." },
      { letter: "C", text: "Obrigatória, em regra, conforme a Lei 9.784/99 e a CF/88, com exceções para atos de mero expediente e situações previstas em lei." },
      { letter: "D", text: "Exigida apenas para atos que afetam negativamente o administrado." },
      { letter: "E", text: "Dispensável nos atos vinculados, pois o fundamento é diretamente a lei." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. A CF/88 (art. 93, X) exige motivação para decisões administrativas (órgãos colegiados). A Lei 9.784/99 (art. 50) lista os casos em que a motivação é obrigatória, sendo a regra a obrigatoriedade, com exceções para atos de mero expediente.",
    explanationWrong: "A motivação é, em regra, OBRIGATÓRIA — inclusive nos atos vinculados (para demonstrar que os pressupostos legais estão presentes). Nos atos discricionários, é ainda mais relevante para controle do mérito. A dispensa de motivação é exceção, não regra.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_ato_fo_q03",
    atomKey: "forma",
    statement: "Julgue: A publicação do ato administrativo no Diário Oficial integra a própria forma do ato, sendo condição de sua validade.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanationCorrect: "ERRADO. A publicação é condição de EFICÁCIA (produção de efeitos), não de VALIDADE. O ato existe e é válido antes da publicação; a publicação apenas o torna eficaz, oponível a terceiros. Exceção: atos internos que não precisam ser publicados.",
    explanationWrong: "Distinção fundamental: VALIDADE (conformidade com o ordenamento) ≠ EFICÁCIA (aptidão para produzir efeitos). A publicação é condição de EFICÁCIA. Ato não publicado: existe, é válido, mas não produz efeitos perante o público. Ato publicado irregularmente: pode ser ineficaz mas não inválido.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "adm_ato_fo_q04",
    atomKey: "forma",
    statement: "O vício de FORMA no ato administrativo gera:",
    alternatives: [
      { letter: "A", text: "Sempre nulidade absoluta, independentemente da essencialidade da forma." },
      { letter: "B", text: "Nulidade relativa se a forma for essencial ao ato; e irregularidade sanável se a forma não for essencial." },
      { letter: "C", text: "Apenas inexistência jurídica do ato, sem possibilidade de sanar." },
      { letter: "D", text: "Eficácia plena desde a data da prática, com correção posterior." },
      { letter: "E", text: "Suspensão automática dos efeitos até a adequação formal." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. O vício de forma tem gradação: (1) forma ESSENCIAL ao ato → nulidade absoluta (insanável); (2) forma NÃO essencial → anulabilidade, sanável por convalidação. Exemplo: contrato sem assinatura = forma essencial → nulo. Portaria sem numeração = forma não essencial → sanável.",
    explanationWrong: "Convalidação de vício de forma: apenas quando a forma não for essencial à validade do ato. Se a forma for essencial (exigida por lei como condição de validade), o vício é insanável. A convalidação tem efeitos retroativos (ex tunc) — valida desde a origem.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_ato_fo_q05",
    atomKey: "forma",
    statement: "Julgue: A motivação aliunde, admitida na jurisprudência, ocorre quando o ato administrativo se remete à motivação de outro ato ou documento, sendo válida quando a referência é clara e o documento motivador está acessível.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Motivação aliunde (ou por remissão): o ato não traz motivação própria, mas se remete expressamente a outro documento (laudo técnico, parecer jurídico, decisão anterior) que contém os fundamentos. É aceita pelo STJ e STF quando a referência é clara e o documento é acessível ao interessado.",
    explanationWrong: "A motivação pode ser: ① própria (no corpo do ato); ② aliunde/por remissão (remete a outro documento). Ambas são válidas. O importante é que o administrado possa conhecer as razões que justificaram o ato para exercer eventual controle ou recurso.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "adm_ato_fo_q06",
    atomKey: "forma",
    statement: "Qual é a consequência da falta de motivação em ato administrativo que, pela Lei 9.784/99, exige motivação obrigatória?",
    alternatives: [
      { letter: "A", text: "Nenhuma, pois a motivação é mero requisito formal sem consequência jurídica." },
      { letter: "B", text: "O ato produz efeitos normalmente, mas sujeito a recurso administrativo obrigatório." },
      { letter: "C", text: "Nulidade do ato, por violação ao dever de motivação e ao princípio do contraditório e ampla defesa." },
      { letter: "D", text: "Multa administrativa ao agente público responsável pelo ato." },
      { letter: "E", text: "Suspensão temporária do ato até que seja apresentada motivação complementar." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. A ausência de motivação obrigatória (art. 50, Lei 9.784/99) vicia o ato por vício de forma. A jurisprudência do STJ e STF é consolidada: ato sem motivação, quando exigida, é nulo — viola os princípios do contraditório, ampla defesa e motivação dos atos administrativos.",
    explanationWrong: "A motivação, quando obrigatória, é elemento de validade do ato. Sua ausência gera nulidade — não mera irregularidade. Fundamentos constitucionais: art. 5°, LV (contraditório), art. 93, X (motivação de decisões administrativas), e princípio da publicidade/transparência.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 4 — Motivo: Pressuposto Fático, Jurídico e TMD
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "adm_ato_mo_q01",
    atomKey: "motivo",
    statement: "Julgue: O motivo do ato administrativo compreende tanto o pressuposto de fato (situação concreta que autoriza o ato) quanto o pressuposto de direito (norma legal que fundamenta o ato).",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. O MOTIVO tem duas dimensões: (1) Pressuposto de fato: a situação concreta que desencadeia o ato (ex: servidor em situação X, imóvel em estado Y); (2) Pressuposto de direito: a norma que autoriza ou exige o ato diante daquele fato (ex: art. Z da lei). Ambos devem existir e ser verdadeiros.",
    explanationWrong: "Motivo = pressuposto de fato + pressuposto de direito. Ambos devem existir. Se o pressuposto de fato for inexistente ou falso → vício de motivo → nulidade. A teoria dos motivos determinantes vincula a Administração aos motivos declarados.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "adm_ato_mo_q02",
    atomKey: "motivo",
    statement: "A Teoria dos Motivos Determinantes implica que:",
    alternatives: [
      { letter: "A", text: "A Administração pode revogar qualquer ato sem indicar os motivos." },
      { letter: "B", text: "Uma vez declarados os motivos do ato, a Administração fica vinculada a eles — motivos falsos ou inexistentes tornam o ato nulo." },
      { letter: "C", text: "Os motivos declarados só vinculam atos discricionários, sendo livres nos atos vinculados." },
      { letter: "D", text: "O Judiciário não pode revisar os motivos declarados em atos administrativos." },
      { letter: "E", text: "A Administração pode posteriormente substituir os motivos declarados por outros mais adequados." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Teoria dos Motivos Determinantes (TMD): os motivos declarados vinculam a validade do ato. Se os motivos declarados forem falsos, inexistentes ou juridicamente insuficientes, o ato é nulo — mesmo que a Administração pudesse praticá-lo com outros motivos válidos.",
    explanationWrong: "Exemplo clássico da TMD: servidor exonerado 'no interesse público por reorganização'. Prova-se que não houve reorganização (motivo falso) → exoneração nula. A TMD impede que a Administração declare um motivo para esconder o real — instrumento contra o desvio de poder.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_ato_mo_q03",
    atomKey: "motivo",
    statement: "Julgue: Nos atos vinculados, o motivo é sempre predeterminado em lei; já nos atos discricionários, a Administração tem liberdade para valorar a situação fática e escolher o motivo.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Nos atos vinculados, a lei prevê exatamente qual situação (motivo de fato) autoriza o ato — sem margem de avaliação. Nos atos discricionários, a lei concede margem de apreciação ao administrador para valorar os fatos e decidir sobre a oportunidade e conveniência.",
    explanationWrong: "Vinculado: lei define estritamente o motivo de fato. Se o fato ocorre, o ato DEVE ser praticado (sem opção). Discricionário: lei define a competência e a finalidade, mas deixa ao administrador a avaliação do motivo (conveniência e oportunidade). O motivo declarado, porém, vincula pela TMD.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "adm_ato_mo_q04",
    atomKey: "motivo",
    statement: "O vício de motivo (ausência ou falsidade dos pressupostos fáticos ou jurídicos) gera, para o ato administrativo:",
    alternatives: [
      { letter: "A", text: "Mera irregularidade, convalidável pela autoridade superior." },
      { letter: "B", text: "Nulidade relativa, com efeitos apenas prospectivos (ex nunc)." },
      { letter: "C", text: "Nulidade absoluta, insanável, com efeitos retroativos (ex tunc)." },
      { letter: "D", text: "Ineficácia, sem afastar a validade jurídica do ato." },
      { letter: "E", text: "Anulabilidade, sanável mediante motivação superveniente." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. O vício de motivo (pressuposto de fato inexistente, falso ou juridicamente insuficiente) é INSANÁVEL — gera nulidade absoluta com efeitos ex tunc (retroativos à data da prática do ato). Não admite convalidação ou motivação superveniente.",
    explanationWrong: "Resumo dos vícios: INSANÁVEIS (nulidade absoluta, ex tunc): competência material, finalidade, motivo, objeto ilícito. SANÁVEIS (anulabilidade, convalidáveis): competência em razão da pessoa e forma não essencial. O vício de motivo não pode ser 'corrigido' após o fato.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_ato_mo_q05",
    atomKey: "motivo",
    statement: "Julgue: A motivação e o motivo são conceitos idênticos no direito administrativo.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanationCorrect: "ERRADO. MOTIVO (elemento do ato): situação de fato e de direito que autoriza/exige o ato — é o substrato real que justifica o ato. MOTIVAÇÃO (elemento de forma): a exposição escrita dos motivos no corpo do ato — é a declaração formal dos motivos. São conceitos distintos: ato pode ter motivo real sem motivação formal (vício de forma) ou motivação formal sem motivo real (vício de motivo).",
    explanationWrong: "MOTIVO: substância (o fato + o direito que legitimam o ato). MOTIVAÇÃO: formalização escrita dos motivos. Pode haver: ato com motivo mas sem motivação (vício de forma, sanável se a forma não for essencial); ato com motivação mas sem motivo real (vício de motivo, insanável).",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "adm_ato_mo_q06",
    atomKey: "motivo",
    statement: "O pressuposto de direito do ato administrativo refere-se a:",
    alternatives: [
      { letter: "A", text: "A situação concreta de fato que desencadeia a prática do ato." },
      { letter: "B", text: "A norma jurídica que confere base legal ao ato — princípio da legalidade." },
      { letter: "C", text: "O resultado prático que o ato pretende alcançar na realidade." },
      { letter: "D", text: "A manifestação de vontade do agente público." },
      { letter: "E", text: "A competência territorial do agente para praticar o ato." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. O pressuposto de DIREITO é a norma legal que serve de base jurídica ao ato — o fundamento normativo (lei, decreto, regulamento). Sem pressuposto de direito (ausência de base legal), o ato viola o princípio da legalidade. Exemplo: 'Art. X da Lei Y' citado no ato.",
    explanationWrong: "Motivo = pressuposto de FATO (a situação real: servidor praticou falta X) + pressuposto de DIREITO (a norma: art. Z prevê punição para falta X). Se não há norma que ampare aquela situação, o ato é nulo por falta de pressuposto de direito — vício de motivo jurídico.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 5 — Objeto: Conteúdo, Requisitos e Vícios Insanáveis
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "adm_ato_ob_q01",
    atomKey: "objeto",
    statement: "Julgue: O objeto do ato administrativo é o efeito jurídico imediato que o ato produz — o que o ato cria, modifica, extingue ou declara.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. O objeto (ou conteúdo) do ato é o efeito jurídico direto e imediato produzido: o que é criado (ex: licença), modificado (alteração de prazo), extinto (revogação) ou declarado (certidão). Nos atos vinculados, o objeto é predeterminado; nos discricionários, há margem de escolha.",
    explanationWrong: "Os 5 elementos do ato (COMFI): Competência (quem?), Objeto/conteúdo (o quê? qual efeito?), Motivo (por quê?), Forma (como?), finalIdade (para quê?). O objeto é o CONTEÚDO JURÍDICO do ato — a consequência jurídica que ele produz.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "adm_ato_ob_q02",
    atomKey: "objeto",
    statement: "Para que o objeto do ato administrativo seja válido, deve ser:",
    alternatives: [
      { letter: "A", text: "Conveniente, oportuno e lucrativo para a Administração." },
      { letter: "B", text: "Lícito, possível, certo e moral." },
      { letter: "C", text: "Apenas escrito e publicado no Diário Oficial." },
      { letter: "D", text: "Vantajoso economicamente e aprovado por órgão de controle." },
      { letter: "E", text: "Aprovado previamente pelo Tribunal de Contas competente." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. O objeto do ato deve ser: (1) LÍCITO: conforme o ordenamento jurídico; (2) POSSÍVEL: física e juridicamente realizável; (3) CERTO: determinado ou determinável; (4) MORAL: em conformidade com os padrões éticos da Administração. Ausência de qualquer requisito gera vício insanável.",
    explanationWrong: "Objeto ILÍCITO (contrário à lei) ou IMPOSSÍVEL (fisicamente ou juridicamente irrealizável) → nulidade absoluta, insanável. Objeto INCERTO (indeterminado e indeterminável) → nulidade. Esses vícios no objeto não podem ser convalidados.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_ato_ob_q03",
    atomKey: "objeto",
    statement: "Julgue: Nos atos discricionários, o objeto pode ser livremente escolhido pelo administrador, desde que dentre as opções legalmente previstas e voltado ao interesse público.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. O mérito do ato discricionário (conveniência e oportunidade) recai sobre o objeto e o motivo. O administrador pode escolher QUAL objeto, QUANDO e em qual MEDIDA — mas sempre: (1) dentro das opções legais; (2) visando o interesse público; (3) respeitando os demais elementos vinculados.",
    explanationWrong: "Discricionariedade NÃO é arbitrariedade. O administrador escolhe o objeto dentro de um 'leque de opções legais'. Todos devem ser igualmente lícitos — a escolha é de mérito. O Judiciário não controla o mérito, mas controla se a escolha está dentro das opções legais (legalidade).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "adm_ato_ob_q04",
    atomKey: "objeto",
    statement: "O vício de objeto que torna o ato ABSOLUTAMENTE nulo é:",
    alternatives: [
      { letter: "A", text: "Objeto com redação confusa, que dificulta a interpretação." },
      { letter: "B", text: "Objeto praticado em horário inadequado da jornada de trabalho." },
      { letter: "C", text: "Objeto ilícito (contrário ao ordenamento jurídico) ou juridicamente impossível." },
      { letter: "D", text: "Objeto que não atende plenamente às expectativas do administrado." },
      { letter: "E", text: "Objeto que beneficia terceiro que não era o destinatário original." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. Objeto ILÍCITO (ex: licença para atividade proibida) ou JURIDICAMENTE IMPOSSÍVEL (ex: concessão de direito que a lei veda) → nulidade absoluta, insanável. Redação confusa é defeito formal menor; o benefício a terceiro pode ser vício de finalidade.",
    explanationWrong: "Vícios do objeto que geram nulidade absoluta: ilicitude (contrário ao direito) e impossibilidade (física ou jurídica). Objeto incerto pode ser sanável se determinável. Objeto lícito mas inadequado pode ser motivo de revogação (conveniência/oportunidade), não nulidade.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_ato_ob_q05",
    atomKey: "objeto",
    statement: "Julgue: Um ato administrativo com objeto lícito, mas praticado por autoridade absolutamente incompetente em razão da matéria, não pode ser convalidado mesmo que o objeto em si seja perfeito.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. A convalidação exige que TODOS os vícios sanáveis sejam corrigidos. Vício de competência em razão da MATÉRIA é insanável — mesmo que os outros elementos (incluindo o objeto) sejam perfeitos. O ato deve ser anulado e refeito pela autoridade competente.",
    explanationWrong: "Para convalidação: o vício deve ser sanável (competência em razão da pessoa OU forma não essencial) E não pode ter causado lesão ao interesse público ou a terceiros. Vício insanável (competência material, motivo, finalidade, objeto ilícito) → anulação obrigatória.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "adm_ato_ob_q06",
    atomKey: "objeto",
    statement: "No ato vinculado de concessão de aposentadoria compulsória por idade (70 anos), o objeto do ato é:",
    alternatives: [
      { letter: "A", text: "Discricionário, pois a Administração pode optar entre aposentar ou não o servidor." },
      { letter: "B", text: "Vinculado: a lei determina exatamente o efeito jurídico (aposentadoria) que deve ser produzido quando o fato (70 anos) ocorre." },
      { letter: "C", text: "Opcional, pois depende da conveniência e oportunidade da Administração." },
      { letter: "D", text: "Condicionado à aprovação prévia do servidor, que pode recusar." },
      { letter: "E", text: "Discricionário apenas quanto ao prazo para implementação." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. A aposentadoria compulsória por idade é ato VINCULADO: a lei determina exatamente o objeto (aposentadoria), quando o pressuposto fático (70 anos) se verifica. A Administração não tem opção — deve aposentar. É exemplo típico de ato vinculado nos 5 elementos.",
    explanationWrong: "No ato vinculado, a lei predetermina todos os elementos, incluindo o objeto. Exemplos: aposentadoria compulsória (70 anos), licença por maternidade (120 dias), FGTS (8% da remuneração). O administrador apenas verifica se o pressuposto fático ocorreu e pratica o ato.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 6 — Vícios dos Atos por Elemento COMFI
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "adm_ato_vi_q01",
    atomKey: "vicios",
    statement: "Julgue: Segundo o mnemônico COMFI (Competência, Objeto, Motivo, Forma, fInalidade), apenas os vícios de Competência (em razão da pessoa) e Forma (não essencial) são sanáveis por convalidação.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Vícios SANÁVEIS (convalidáveis): COMPETÊNCIA em razão da pessoa (não da matéria) e FORMA não essencial. Vícios INSANÁVEIS (nulidade absoluta): competência em razão da matéria, OBJETO ilícito/impossível, MOTIVO falso/inexistente, FINALIDADE desviada. É o gabarito padrão para questões sobre convalidação.",
    explanationWrong: "COMFI e convalidação: C (competência-pessoa: sanável / competência-matéria: insanável) | O (objeto ilícito: insanável) | M (motivo falso: insanável) | F (forma essencial: insanável / forma não essencial: sanável) | I (finalidade desviada: insanável).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "adm_ato_vi_q02",
    atomKey: "vicios",
    statement: "A convalidação do ato administrativo com vício sanável:",
    alternatives: [
      { letter: "A", text: "Só pode ser feita pelo Poder Judiciário, que é o guardião da legalidade." },
      { letter: "B", text: "Produz efeitos a partir da data da convalidação (ex nunc), preservando a nulidade dos efeitos passados." },
      { letter: "C", text: "Produz efeitos retroativos à data da prática do ato (ex tunc), como se o ato sempre tivesse sido válido." },
      { letter: "D", text: "Depende de aprovação prévia pelo Tribunal de Contas." },
      { letter: "E", text: "Somente é possível se o ato não produziu efeitos ainda." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. A convalidação tem efeitos EX TUNC (retroativos): o ato viciado é considerado válido desde sua origem. É diferente da ratificação (que tem efeitos ex nunc). A convalidação é realizada pela própria Administração, de ofício ou a pedido.",
    explanationWrong: "Convalidação: ato da própria Administração que supre o vício sanável, retroativamente. Efeitos: ex tunc (retroagem à data do ato viciado). Anulação: efeitos ex tunc também (retroagem). Revogação: efeitos ex nunc (prospectivos) — válido até então, inoportuno daqui em diante.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_ato_vi_q03",
    atomKey: "vicios",
    statement: "Julgue: A anulação do ato administrativo, diferentemente da revogação, pode ser realizada tanto pela própria Administração (autotutela) quanto pelo Poder Judiciário.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. ANULAÇÃO (vício de legalidade): pode ser feita pela Administração (autotutela — Súmulas 346 e 473 STF) e pelo Judiciário (controle externo). REVOGAÇÃO (oportunidade/conveniência): SOMENTE pela Administração — o Judiciário não revoga atos por mérito administrativo.",
    explanationWrong: "Resumo: ANULAÇÃO = legalidade = Administração + Judiciário. REVOGAÇÃO = mérito = só Administração. O Judiciário não substitui o juízo de conveniência do administrador — só controla a legalidade. Súmula 473 STF: a Administração pode anular seus próprios atos quando ilegais e revogar por conveniência.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "adm_ato_vi_q04",
    atomKey: "vicios",
    statement: "Um servidor foi nomeado por autoridade absolutamente incompetente (vício insanável). Os atos praticados por ele durante o período em que exerceu o cargo:",
    alternatives: [
      { letter: "A", text: "São igualmente nulos, pois decorrem de nomeação nula." },
      { letter: "B", text: "Podem ser preservados pela teoria do funcionário de fato, para proteger terceiros de boa-fé e o interesse público." },
      { letter: "C", text: "São válidos, pois a nulidade da nomeação não contamina os atos funcionais." },
      { letter: "D", text: "Dependem de ratificação pelo Legislativo para produzir efeitos." },
      { letter: "E", text: "São automaticamente ratificados após 5 anos pelo princípio da segurança jurídica." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Teoria do funcionário de fato (ou servidor de fato): quando a investidura é irregular, os atos praticados são considerados válidos em relação a terceiros de boa-fé e ao interesse público. Fundamento: aparência de legitimidade e proteção da segurança jurídica.",
    explanationWrong: "Servidor de fato: exerceu o cargo irregularmente mas com aparência de legitimidade. A teoria preserva os atos por ele praticados para não prejudicar terceiros de boa-fé que confiaram na aparência do cargo. Diferente de 'usurpador de função pública' (sem aparência alguma — atos nulos).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_ato_vi_q05",
    atomKey: "vicios",
    statement: "Julgue: O prazo decadencial de 5 anos previsto na Lei 9.784/99 para a Administração anular seus atos aplica-se a todos os atos administrativos ilegais, inclusive os praticados de má-fé.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanationCorrect: "ERRADO. O prazo decadencial de 5 anos (art. 54, Lei 9.784/99) aplica-se apenas quando o ato tenha gerado efeitos favoráveis ao administrado e ele esteja de BOA-FÉ. Atos praticados com MÁ-FÉ (ex: fraude, dolo do beneficiário) não geram direito adquirido e podem ser anulados a qualquer tempo.",
    explanationWrong: "Art. 54, Lei 9.784/99: Administração tem 5 anos para anular atos que gerem direitos para administrados de boa-fé. Se houve má-fé (fraude, simulação) → não há decadência → pode anular a qualquer tempo. A segurança jurídica protege apenas a boa-fé.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "adm_ato_vi_q06",
    atomKey: "vicios",
    statement: "Qual o efeito da REVOGAÇÃO de um ato administrativo válido que produzia efeitos?",
    alternatives: [
      { letter: "A", text: "Efeitos ex tunc (retroativos): o ato é tratado como se nunca tivesse existido." },
      { letter: "B", text: "Efeitos ex nunc (prospectivos): o ato é válido até a revogação, sendo extinto dali em diante." },
      { letter: "C", text: "Nulidade absoluta, com ressarcimento obrigatório de todos os danos causados." },
      { letter: "D", text: "Efeitos a partir da publicação no Diário Oficial com efeito retroativo de 30 dias." },
      { letter: "E", text: "Conversão do ato em ato vinculado para fins de controle pelo Judiciário." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. A REVOGAÇÃO extingue ato válido por razões de conveniência e oportunidade (mérito). Efeitos: EX NUNC — o ato produziu efeitos válidos até o momento da revogação; a partir daí, cessa. Não há retroação, pois o ato era lícito quando praticado.",
    explanationWrong: "Comparativo: ANULAÇÃO (ilegalidade) → efeitos ex tunc (retroage, apaga o ato). REVOGAÇÃO (inconveniência) → efeitos ex nunc (não retroage, preserva os efeitos passados). CONVALIDAÇÃO → efeitos ex tunc (valida retroativamente). Essa distinção é clássica em concursos.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
];

// ─── MAIN ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🚀 Seed R58 — Densificação: Direito Adm — Atos Administrativos (COMFI)\n");

  // 1. Encontrar subjectId de Direito Administrativo
  const subjectRows = await db.execute(sql`
    SELECT id FROM "Subject" WHERE name ILIKE ${"%" + "ADMINISTRATIV" + "%"} LIMIT 1
  `) as any[];
  if (!subjectRows[0]) {
    console.error("❌ Subject Direito Administrativo não encontrado.");
    process.exit(1);
  }
  const subjectId: string = subjectRows[0].id;
  console.log(`  ✅ Subject: ${subjectId}`);

  // 2. Resolver contentIds por título
  const contentIdMap: Record<AtomKey, string | null> = {
    competencia: null, finalidade: null, forma: null,
    motivo: null, objeto: null, vicios: null,
  };

  for (const [key, title] of Object.entries(ATOM_TITLES) as [AtomKey, string][]) {
    const rows = await db.execute(sql`
      SELECT id FROM "Content" WHERE title = ${title} AND "subjectId" = ${subjectId} LIMIT 1
    `) as any[];
    if (rows[0]) {
      contentIdMap[key] = rows[0].id;
      console.log(`  ✅ Átomo [${key}]: ${rows[0].id}`);
    } else {
      console.warn(`  ⚠️  Átomo NÃO encontrado: "${title}" — execute seed-admin-atos-r16.ts primeiro`);
    }
  }

  const availableAtoms = Object.values(contentIdMap).filter(Boolean).length;
  if (availableAtoms === 0) {
    console.error("\n❌ Nenhum átomo encontrado. Abortando.");
    process.exit(1);
  }

  // 3. Inserir questões
  let inserted = 0;
  let skipped = 0;

  for (const q of questions) {
    const contentId = contentIdMap[q.atomKey];
    if (!contentId) {
      console.warn(`  ⚠️  Átomo '${q.atomKey}' não disponível — pulando ${q.id}`);
      skipped++;
      continue;
    }

    const exists = await db.execute(sql`SELECT id FROM "Question" WHERE id = ${q.id} LIMIT 1`) as any[];
    if (exists.length > 0) {
      console.log(`  ⏭️  Já existe: ${q.id}`);
      skipped++;
      continue;
    }

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
        "questionType", difficulty,
        "subjectId", "topicId", "contentId",
        "isActive", "timesUsed", "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternativesJson}::jsonb,
        ${q.correctAnswer}, ${q.correctOption},
        ${q.explanationCorrect}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${q.questionType}, ${q.difficulty},
        ${sid}, ${topicId}, ${contentId},
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

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
