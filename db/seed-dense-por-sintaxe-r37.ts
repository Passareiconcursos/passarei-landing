/**
 * Seed R37 — Densificação: Português — Sintaxe da Oração
 * Modo: DENSIFICAÇÃO — apenas questões; átomos já existem no banco.
 *
 * Átomos-alvo (6 átomos × 8 questões = 48 questões):
 *   por_si_c01  — Sujeito e Predicado
 *   por_si_c02  — Objetos Direto e Indireto
 *   por_si_c03  — Complemento Nominal vs. Adjunto Adnominal
 *   por_si_c04  — Agente da Passiva e Aposto
 *   por_si_c05  — Vocativo e Predicativo
 *   por_si_c06  — Análise Sintática Completa / Reescritura (estilo CEBRASPE)
 *
 * Execução: git pull && npx tsx db/seed-dense-por-sintaxe-r37.ts
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

const CONTENT_IDS = {
  sujeito:    "por_si_c01",
  objetos:    "por_si_c02",
  cnaa:       "por_si_c03",
  agente:     "por_si_c04",
  vocativo:   "por_si_c05",
  analise:    "por_si_c06",
};

const questions = [

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 1 — Sujeito e Predicado (por_si_c01)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "por_si_sp_q01",
    contentId: CONTENT_IDS.sujeito,
    statement:
      "(CESPE — Adaptada) Na frase 'Havia vários suspeitos no local da ocorrência', " +
      "o sujeito é 'vários suspeitos'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. O verbo 'haver' no sentido de existir é impessoal — não admite sujeito. " +
      "A oração é classificada como SEM SUJEITO (sujeito inexistente). " +
      "'Vários suspeitos' funciona como objeto direto do verbo 'haver'. " +
      "Teste: substitua por 'existir' → 'Existiam vários suspeitos' — aí 'vários suspeitos' seria sujeito, " +
      "mas com 'haver' impessoal isso não ocorre.",
    explanationCorrect:
      "O item está ERRADO. 'Haver' no sentido de existir é impessoal → sem sujeito. " +
      "'Vários suspeitos' = objeto direto de 'havia'.",
    explanationWrong:
      "ERRADO. 'Haver' existencial é verbo impessoal: não tem sujeito. " +
      "Compare: 'Existiam vários suspeitos' (sujeito = 'vários suspeitos') vs. " +
      "'Havia vários suspeitos' (sem sujeito; 'vários suspeitos' = OD). " +
      "Mnemônico: HAVER = impessoal quando = existir.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_sp_q02",
    contentId: CONTENT_IDS.sujeito,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O delegado e o perito assinaram o laudo conjuntamente', " +
      "o sujeito é composto.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. O sujeito composto possui dois ou mais núcleos: " +
      "'delegado' e 'perito' são os dois núcleos do sujeito. " +
      "Por isso o verbo está no plural: 'assinaram'. " +
      "Mnemônico: SUJEITO COMPOSTO = 2+ núcleos → verbo preferencialmente no plural.",
    explanationCorrect:
      "Correto! 'O delegado e o perito' = dois núcleos = sujeito composto. " +
      "Verbo no plural ('assinaram') confirma.",
    explanationWrong:
      "O item está CERTO. Dois núcleos ('delegado' + 'perito') = sujeito composto. " +
      "Regra: sujeito com mais de um núcleo é composto, independentemente de quantos elementos haja.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_sp_q03",
    contentId: CONTENT_IDS.sujeito,
    statement:
      "(CESPE — Adaptada) Em 'O réu saiu inocente da audiência', o predicado é classificado como:",
    alternatives: [
      { letter: "A", text: "Predicado Verbal, pois o núcleo é o verbo 'saiu'." },
      { letter: "B", text: "Predicado Nominal, pois há predicativo do sujeito." },
      { letter: "C", text: "Predicado Verbo-Nominal, pois há verbo significativo e predicativo do sujeito." },
      { letter: "D", text: "Predicado Nominal, pois 'saiu' é verbo de ligação." },
      { letter: "E", text: "A frase não possui predicado identificável." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: Predicado Verbo-Nominal. " +
      "'Saiu' é verbo significativo (indica ação) → componente verbal. " +
      "'Inocente' é predicativo do sujeito 'o réu' (qualifica o sujeito no momento da ação) → componente nominal. " +
      "Quando há SIMULTANEAMENTE verbo significativo + predicativo, o predicado é VERBO-NOMINAL. " +
      "Mnemônico: VN = Verbo Significativo + Predicativo coexistem.",
    explanationCorrect:
      "Exato! 'Saiu' = verbo significativo + 'inocente' = predicativo do sujeito → Predicado Verbo-Nominal.",
    explanationWrong:
      "Resposta: C. 'Sair' é verbo significativo (não de ligação), mas 'inocente' qualifica o sujeito. " +
      "Dois núcleos: verbal ('saiu') + nominal ('inocente') = Predicado Verbo-Nominal.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  {
    id: "por_si_sp_q04",
    contentId: CONTENT_IDS.sujeito,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Faz três anos que o inquérito foi instaurado', " +
      "o sujeito do verbo 'faz' é indeterminado.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. O verbo 'fazer' indicando tempo decorrido é IMPESSOAL, " +
      "portanto a oração é SEM SUJEITO (sujeito inexistente), não indeterminado. " +
      "Distinção fundamental: " +
      "• Sujeito INDETERMINADO: existe, mas não é identificado (ex.: 'Precisam-se de agentes'). " +
      "• Sujeito INEXISTENTE: verbos impessoais — haver (existencial), fazer (tempo), ser (horas/datas), " +
      "chover, ventar etc. nunca têm sujeito.",
    explanationCorrect:
      "O item está ERRADO. 'Fazer' indicando tempo decorrido é impessoal → sujeito inexistente (não indeterminado).",
    explanationWrong:
      "ERRADO. 'Faz três anos' = 'fazer' impessoal (tempo). Sujeito inexistente, não indeterminado. " +
      "Mnemônico FAZER/HAVER/SER = IMPESSOAIS → sem sujeito.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_sp_q05",
    contentId: CONTENT_IDS.sujeito,
    statement:
      "(CESPE — Adaptada) Em 'Prenderam o suspeito durante a madrugada', o sujeito é:",
    alternatives: [
      { letter: "A", text: "Simples — 'o suspeito'" },
      { letter: "B", text: "Oculto — 'eles' (implícito no contexto)" },
      { letter: "C", text: "Indeterminado — não se identifica quem praticou a ação" },
      { letter: "D", text: "Composto — 'o suspeito e a madrugada'" },
      { letter: "E", text: "Inexistente — verbo impessoal" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: Sujeito INDETERMINADO. " +
      "O verbo 'prenderam' está na 3ª pessoa do plural sem referência a um sujeito anterior no contexto. " +
      "Esse recurso é usado para indeterminar o agente da ação propositalmente. " +
      "Não é 'oculto' porque não há referente no contexto que permita identificá-lo. " +
      "Mnemônico: 3ª pessoa do plural SEM referente anterior = sujeito indeterminado.",
    explanationCorrect:
      "Exato! 3ª pessoa do plural sem referente = sujeito indeterminado. " +
      "Diferente de oculto (identificável pelo contexto) e de inexistente (verbo impessoal).",
    explanationWrong:
      "Resposta: C. 'Prenderam' na 3ª pl. sem sujeito identificável no contexto = indeterminado. " +
      "Se houvesse um 'eles' recuperável no texto anterior, seria oculto. Aqui não há.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  {
    id: "por_si_sp_q06",
    contentId: CONTENT_IDS.sujeito,
    statement:
      "(CEBRASPE — Adaptada) Na oração 'O agente ficou atento à movimentação suspeita', " +
      "o predicado é nominal, com 'ficar' funcionando como verbo de ligação e " +
      "'atento' como predicativo do sujeito.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Ficar' é verbo de ligação (assim como: ser, estar, permanecer, continuar, tornar-se, " +
      "parecer, andar, viver). 'Atento' é predicativo do sujeito 'o agente'. " +
      "Predicado nominal = verbo de ligação + predicativo do sujeito. Não há verbo significativo.",
    explanationCorrect:
      "Correto! 'Ficar' = VL; 'atento' = predicativo do sujeito → Predicado Nominal. " +
      "VLs: ser, estar, ficar, permanecer, continuar, parecer, tornar-se, andar, viver.",
    explanationWrong:
      "O item está CERTO. 'Ficar' é verbo de ligação; 'atento' qualifica o sujeito. " +
      "Predicado nominal: VL + predicativo do sujeito — sem verbo significativo.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_sp_q07",
    contentId: CONTENT_IDS.sujeito,
    statement:
      "(CESPE — Adaptada) Em qual das orações o verbo é IMPESSOAL, " +
      "configurando oração SEM sujeito?",
    alternatives: [
      { letter: "A", text: "Foram presos três suspeitos na operação." },
      { letter: "B", text: "Precisam-se de agentes com experiência em investigação." },
      { letter: "C", text: "Choveu intensamente durante toda a operação policial." },
      { letter: "D", text: "Vendeu-se o veículo apreendido em leilão público." },
      { letter: "E", text: "Sabia-se que o suspeito estava foragido há semanas." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'Choveu' é verbo meteorológico impessoal → oração sem sujeito. " +
      "A: voz passiva → sujeito = 'três suspeitos'. " +
      "B: 'precisar-se de' → sujeito indeterminado (voz passiva pronominal por alguns; indeterminado por outros). " +
      "D: passiva pronominal → sujeito = 'o veículo apreendido'. " +
      "E: 'sabia-se' → sujeito indeterminado.",
    explanationCorrect:
      "Exato! Verbos meteorológicos (chover, ventar, trovejar, nevar) são impessoais → sem sujeito.",
    explanationWrong:
      "Resposta: C. 'Choveu' = verbo meteorológico = impessoal = sem sujeito. " +
      "A e D têm sujeito (voz passiva); B e E têm sujeito indeterminado.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  {
    id: "por_si_sp_q08",
    contentId: CONTENT_IDS.sujeito,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Convém que todos os agentes estejam presentes " +
      "à cerimônia de formatura', o sujeito do verbo 'convém' é a oração subordinada " +
      "'que todos os agentes estejam presentes à cerimônia'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. O verbo 'convir' (convém) admite sujeito oracional. " +
      "A oração subordinada substantiva subjetiva 'que todos os agentes estejam presentes à cerimônia' " +
      "exerce a função de sujeito de 'convém'. " +
      "Teste: 'Isso convém' → 'isso' = sujeito → substitua 'isso' pela oração = sujeito oracional.",
    explanationCorrect:
      "Correto! Sujeito oracional: oração subordinada substantiva subjetiva = sujeito de 'convém'. " +
      "Teste: 'Isso convém' → 'isso' é o sujeito → substituído pela oração que-cláusula.",
    explanationWrong:
      "O item está CERTO. 'Convém' admite sujeito oracional (oração subordinada subjetiva). " +
      "A oração 'que todos os agentes...' responde 'O que convém?' = sujeito.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 2 — Objetos Direto e Indireto (por_si_c02)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "por_si_ob_q01",
    contentId: CONTENT_IDS.objetos,
    statement:
      "(CESPE — Adaptada) Em 'O perito entregou o laudo à delegada responsável', " +
      "identifique a alternativa que classifica corretamente os termos sublinhados:",
    alternatives: [
      { letter: "A", text: "'o laudo' = OI; 'à delegada' = OD" },
      { letter: "B", text: "'o laudo' = OD; 'à delegada' = OD preposicionado" },
      { letter: "C", text: "'o laudo' = OD; 'à delegada' = OI" },
      { letter: "D", text: "'o laudo' = adjunto adverbial; 'à delegada' = OI" },
      { letter: "E", text: "'o laudo' = sujeito; 'à delegada' = predicativo" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'o laudo' = Objeto Direto (sem preposição obrigatória; responde 'entregou o quê?'). " +
      "'à delegada' = Objeto Indireto (com preposição 'a' obrigatória; responde 'entregou a quem?'). " +
      "Mnemônico: OD = substitui por O/A (entregou-o); OI = substitui por LHE (entregou-lhe).",
    explanationCorrect:
      "Exato! OD sem preposição obrigatória ('o laudo') + OI com preposição 'a' ('à delegada'). " +
      "Teste pronominal: 'entregou-o' (OD) + 'entregou-lhe' (OI).",
    explanationWrong:
      "Resposta: C. 'O laudo' = OD (sem prep; 'entregou-o'). " +
      "'À delegada' = OI (com prep 'a'; 'entregou-lhe'). " +
      "Verbo 'entregar' = TDII (transitivo direto e indireto).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  {
    id: "por_si_ob_q02",
    contentId: CONTENT_IDS.objetos,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O investigador gostou da decisão do promotor', " +
      "o termo 'da decisão do promotor' é objeto indireto do verbo 'gostar'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. O verbo 'gostar' é transitivo indireto: exige complemento com preposição 'de'. " +
      "'Da decisão' = de + a + decisão → preposição obrigatória = Objeto Indireto. " +
      "Mnemônico: GOSTAR DE = sempre OI. Teste: substitua por 'disso' → 'gostou disso' (pronome oblíquo átono indireto).",
    explanationCorrect:
      "Correto! 'Gostar de' = verbo TI → 'da decisão' = OI. Teste: 'gostou disso' (pronome = OI).",
    explanationWrong:
      "O item está CERTO. 'Gostar' exige preposição 'de' → complemento = OI. " +
      "'Da decisão do promotor' = de + a + decisão = OI.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_ob_q03",
    contentId: CONTENT_IDS.objetos,
    statement:
      "(CESPE — Adaptada) Em 'Os agentes devem obedecer às ordens superiores sem questionar', " +
      "'às ordens superiores' é objeto indireto, pois o verbo 'obedecer' exige preposição 'a'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. O verbo 'obedecer' é TRANSITIVO INDIRETO: rege complemento com preposição 'a'. " +
      "'Às ordens' = a + as + ordens → preposição obrigatória = Objeto Indireto. " +
      "ATENÇÃO: erro comum em prova é considerar 'obedecer' como TD e tratar o complemento como OD. " +
      "Mnemônico: OBEDECER A, DESOBEDECER A = sempre OI.",
    explanationCorrect:
      "Correto! 'Obedecer' é TI → exige 'a' → 'às ordens' = OI. " +
      "Teste pronominal: 'obedecer-lhe' (pronome OI), nunca 'obedecê-lo'.",
    explanationWrong:
      "O item está CERTO. 'Obedecer' é TI: sempre com preposição 'a'. " +
      "'Às ordens' = OI. Cuidado: não confundir com TDI.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_ob_q04",
    contentId: CONTENT_IDS.objetos,
    statement:
      "(CEBRASPE — Adaptada) Em 'A delegada informou a suspeita sobre seus direitos', " +
      "'a suspeita' é objeto direto e 'sobre seus direitos' é objeto indireto.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. O verbo 'informar' pode ser TDII (transitivo direto e indireto): " +
      "'informou a suspeita' (OD: quem foi informado, sem preposição obrigatória) + " +
      "'sobre seus direitos' (OI: sobre o quê, com preposição 'sobre'). " +
      "Alternativa: 'informou à suspeita sobre seus direitos' → OI + OI (também aceita). " +
      "Na construção apresentada, 'a suspeita' sem acento grave = OD.",
    explanationCorrect:
      "Correto! 'Informar' = TDII. 'a suspeita' (sem crase) = OD; 'sobre seus direitos' = OI.",
    explanationWrong:
      "O item está CERTO. 'Informar' admite construção com OD (pessoa informada) + OI (assunto). " +
      "'A suspeita' sem crase = OD; 'sobre seus direitos' = OI.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_ob_q05",
    contentId: CONTENT_IDS.objetos,
    statement:
      "(CESPE — Adaptada) Qual alternativa apresenta verbo com objeto direto PREPOSICIONADO " +
      "(OD que, excepcionalmente, admite preposição)?",
    alternatives: [
      { letter: "A", text: "'Gostou da sentença proferida pelo juiz.'" },
      { letter: "B", text: "'Obedeceu às ordens sem hesitar.'" },
      { letter: "C", text: "'Assistiu à sessão de julgamento completa.'" },
      { letter: "D", text: "'Amar a Deus sobre todas as coisas é dever moral.'" },
      { letter: "E", text: "'Referiu-se ao caso durante o depoimento.'" },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "CORRETO: 'Amar a Deus' — 'amar' é verbo TD, mas 'a Deus' é OD preposicionado. " +
      "A preposição 'a' antes de 'Deus' não é exigida pela regência do verbo, mas por tradição/estilo. " +
      "Teste: 'Amá-lo' (substitui por pronome acusativo O → OD). " +
      "A: 'gostar de' = TI → OI (não é OD preposicionado). " +
      "B: 'obedecer a' = TI → OI. C: 'assistir a' (presenciar) = TI → OI. " +
      "E: 'referir-se a' = TI → OI.",
    explanationCorrect:
      "Exato! 'Amar a Deus' = OD preposicionado: 'amar' é TD, mas 'a Deus' leva 'a' por tradição. " +
      "Substitua por pronome: 'amá-lo' (acusativo = OD).",
    explanationWrong:
      "Resposta: D. 'Amar' = TD; 'a Deus' = OD preposicionado (preposição por tradição, não por regência). " +
      "Teste: 'amá-lo' (O/A = OD). Gostar/obedecer/assistir/referir-se = TI → OI.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  {
    id: "por_si_ob_q06",
    contentId: CONTENT_IDS.objetos,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O promotor assistiu à sessão de julgamento', " +
      "'à sessão' é objeto direto do verbo 'assistir'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. O verbo 'assistir' no sentido de 'presenciar' é TRANSITIVO INDIRETO, " +
      "regendo preposição 'a'. Portanto, 'à sessão' é OBJETO INDIRETO. " +
      "Teste pronominal: 'assistiu a ela' (pronome oblíquo tônico = OI), nunca 'assistiu-a'. " +
      "ATENÇÃO: 'assistir' no sentido de 'ajudar/socorrer' também é TI (assistir a alguém). " +
      "'Assistir' no sentido de 'pertencer um direito' também é TI.",
    explanationCorrect:
      "Correto! O item está ERRADO. 'Assistir a' = TI → 'à sessão' = OI. " +
      "Teste: 'assistiu a ela' (não 'assistiu-a').",
    explanationWrong:
      "ERRADO. 'Assistir' (presenciar) = TI com preposição 'a' → complemento = OI. " +
      "'À sessão' = OI, não OD.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_ob_q07",
    contentId: CONTENT_IDS.objetos,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que o complemento verbal está " +
      "CORRETAMENTE classificado:",
    alternatives: [
      { letter: "A", text: "'Necessita de apoio jurídico' → 'de apoio jurídico' = OD preposicionado" },
      { letter: "B", text: "'Perdoou o réu' → 'o réu' = OI" },
      { letter: "C", text: "'Lembrou-se do ocorrido' → 'do ocorrido' = OI" },
      { letter: "D", text: "'Respondeu a pergunta' → 'a pergunta' = OI" },
      { letter: "E", text: "'Pagou o advogado' → 'o advogado' = OI" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'Lembrar-se de' é TI pronominal → 'do ocorrido' (de + o) = OI. " +
      "A: 'necessitar de' = TI → OI (não OD preposicionado). " +
      "B: 'perdoar' = TD → 'o réu' = OD (não OI). " +
      "D: 'responder' = TD → 'a pergunta' = OD (não OI; a preposição aqui não é obrigatória pela regência). " +
      "E: 'pagar' = TD → 'o advogado' = OD (pagar alguém diretamente = OD).",
    explanationCorrect:
      "Exato! 'Lembrar-se de' = TI → 'do ocorrido' = OI. " +
      "Os demais têm classificações incorretas.",
    explanationWrong:
      "Resposta: C. 'Lembrar-se' exige preposição 'de' → OI. " +
      "B: 'perdoar' = TD → OD. D: 'responder a pergunta' = OD. " +
      "E: 'pagar o advogado' = OD. A: 'necessitar de' = OI (não OD prep).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  {
    id: "por_si_ob_q08",
    contentId: CONTENT_IDS.objetos,
    statement:
      "(CEBRASPE — Adaptada) A frase 'Comunicou os fatos ao delegado' pode ser reescrita " +
      "como 'Comunicou-lhos', mantendo corretamente os complementos verbais.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Comunicar' = TDII: OD ('os fatos') + OI ('ao delegado'). " +
      "Substituição pronominal combinada: OD 'os fatos' → 'os'; OI 'ao delegado' → 'lhe'. " +
      "OD (os) + OI (lhe) = 'lhos' (fusão: lhe+os = lhos). " +
      "Portanto: 'Comunicou-lhos' = comunicou [os fatos] [a ele]. Correto.",
    explanationCorrect:
      "Correto! OD 'os fatos' → 'os'; OI 'ao delegado' → 'lhe'. " +
      "Fusão lhe+os = lhos → 'comunicou-lhos'. ✓",
    explanationWrong:
      "O item está CERTO. 'Comunicar' = TDII. OD+OI → lhe+os = lhos. " +
      "'Comunicou-lhos' = comunicou os fatos a ele. Forma pronominal correta.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 3 — Complemento Nominal vs. Adjunto Adnominal (por_si_c03)
  // MNEMÔNICO: AA = AGENTE (pratica); CN = PACIENTE (sofre/recebe)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "por_si_cn_q01",
    contentId: CONTENT_IDS.cnaa,
    statement:
      "(CESPE — Adaptada) Na frase 'A destruição da cidade pelo terremoto foi devastadora', " +
      "identifique corretamente os termos em destaque:",
    alternatives: [
      { letter: "A", text: "'da cidade' = AA (agente); 'pelo terremoto' = CN (paciente)" },
      { letter: "B", text: "'da cidade' = CN (paciente); 'pelo terremoto' = AA (agente)" },
      { letter: "C", text: "'da cidade' = AA (agente); 'pelo terremoto' = agente da passiva" },
      { letter: "D", text: "'da cidade' = OI; 'pelo terremoto' = adjunto adverbial" },
      { letter: "E", text: "'da cidade' = CN (paciente); 'pelo terremoto' = OI" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'da cidade' = CN (paciente: a cidade foi destruída — sofre a destruição). " +
      "'pelo terremoto' = AA (agente: o terremoto destruiu — pratica a destruição). " +
      "Mnemônico: AA = AGENTE (pratica a ação expressa no substantivo); " +
      "CN = PACIENTE (recebe/sofre a ação expressa no substantivo). " +
      "Teste: 'A cidade foi destruída' (paciente → CN); 'O terremoto destruiu' (agente → AA).",
    explanationCorrect:
      "Exato! 'da cidade' = CN (cidade sofre a destruição = paciente). " +
      "'pelo terremoto' = AA (terremoto pratica a destruição = agente).",
    explanationWrong:
      "Resposta: B. Mnemônico AA=AGENTE / CN=PACIENTE: " +
      "cidade é destruída (paciente → CN); terremoto destrói (agente → AA).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  {
    id: "por_si_cn_q02",
    contentId: CONTENT_IDS.cnaa,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O amor de mãe é incondicional', " +
      "o termo 'de mãe' é adjunto adnominal, pois a mãe é o agente do amor.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Amor de mãe' = 'de mãe' é AA porque a mãe PRATICA o amor (é agente). " +
      "Transformação verbal: 'A mãe ama' → mãe = agente → AA. " +
      "Compare: 'amor ao filho' → o filho É AMADO (paciente) → CN. " +
      "Mnemônico: 'O filho chora e a mãe não vê' — quem pratica a ação = AGENTE = AA.",
    explanationCorrect:
      "Correto! 'de mãe' = AA: a mãe ama (agente). " +
      "Transformação: 'a mãe ama' → agente → adjunto adnominal.",
    explanationWrong:
      "O item está CERTO. 'Amor de mãe': a mãe pratica o amor = agente = AA. " +
      "Se fosse 'amor ao filho': o filho recebe o amor = paciente = CN.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_cn_q03",
    contentId: CONTENT_IDS.cnaa,
    statement:
      "(CESPE — Adaptada) Em 'A necessidade de provas era urgente', " +
      "o termo 'de provas' é complemento nominal.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'de provas' é CN porque 'provas' é o PACIENTE da necessidade " +
      "(as provas são necessitadas — sofrem o processo). " +
      "Análise: o substantivo 'necessidade' exige complemento → 'necessidade de algo'. " +
      "O algo é o que se necessita (paciente) → CN. " +
      "Mnemônico: Substantivo/Adjetivo/Advérbio + preposição + PACIENTE = CN.",
    explanationCorrect:
      "Correto! 'de provas' = CN: provas são necessitadas (paciente). " +
      "'Necessidade' é substantivo que exige complemento → CN.",
    explanationWrong:
      "O item está CERTO. 'Necessidade de provas': provas são o objeto necessitado = paciente = CN. " +
      "Mnemônico CN=PACIENTE: quem/o que sofre o processo do substantivo.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_cn_q04",
    contentId: CONTENT_IDS.cnaa,
    statement:
      "(CEBRASPE — Adaptada) Em 'A obediência do agente às normas foi exemplar', " +
      "o termo 'do agente' é complemento nominal, pois 'agente' sofre a obediência.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. 'do agente' é ADJUNTO ADNOMINAL, não CN. " +
      "O agente PRATICA a obediência (é agente da ação, não paciente). " +
      "Transformação: 'O agente obedece' → agente = sujeito agente → AA. " +
      "CN seria 'às normas' (as normas são obedecidas = paciente → CN). " +
      "Mnemônico: 'do agente' → 'o agente obedece' → PRATICA → AA.",
    explanationCorrect:
      "Correto! O item está ERRADO. 'do agente' = AA: o agente pratica a obediência. " +
      "'às normas' = CN: as normas são obedecidas (paciente).",
    explanationWrong:
      "ERRADO. 'Agente obedece' → agente = PRATICA → AA (não CN). " +
      "CN = paciente: quem sofre/recebe. AA = agente: quem pratica. " +
      "O CN aqui é 'às normas' (normas são obedecidas).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_cn_q05",
    contentId: CONTENT_IDS.cnaa,
    statement:
      "(CESPE — Adaptada) Qual alternativa apresenta caso de COMPLEMENTO NOMINAL " +
      "(adjetivo + preposição + termo paciente)?",
    alternatives: [
      { letter: "A", text: "'livro de direito' — 'de direito' completa 'livro'" },
      { letter: "B", text: "'contrário à lei' — 'à lei' completa o adjetivo 'contrário'" },
      { letter: "C", text: "'casa de madeira' — 'de madeira' especifica 'casa'" },
      { letter: "D", text: "'vitória do Brasil' — 'do Brasil' indica quem venceu" },
      { letter: "E", text: "'amor de pai' — 'de pai' indica quem ama" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'contrário à lei' — 'contrário' é ADJETIVO que exige complemento com preposição 'a'. " +
      "'à lei' é complemento nominal do adjetivo 'contrário' (a lei sofre a contrariedade = paciente). " +
      "A: 'de direito' = AA (especifica o tipo de livro, sem completar necessidade do substantivo). " +
      "C: 'de madeira' = AA (caracteriza, não completa necessidade). " +
      "D: 'do Brasil' = AA (Brasil pratica a vitória = agente). " +
      "E: 'de pai' = AA (pai ama = agente).",
    explanationCorrect:
      "Exato! 'Contrário à lei' = adjetivo + prep + paciente → CN. " +
      "Adjetivos que exigem complemento: contrário a, favorável a, apto a, semelhante a...",
    explanationWrong:
      "Resposta: B. 'Contrário' é adjetivo que exige complemento preposicionado → CN. " +
      "'À lei' = paciente (lei sofre a contrariedade). Nos demais: AA (especificam sem necessidade).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  {
    id: "por_si_cn_q06",
    contentId: CONTENT_IDS.cnaa,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O suspeito estava longe da delegacia', " +
      "o termo 'da delegacia' é complemento nominal do advérbio 'longe'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. O advérbio 'longe' exige complemento com preposição 'de'. " +
      "'da delegacia' = CN do advérbio 'longe'. " +
      "Regra: Complemento Nominal pode completar não só substantivos e adjetivos, " +
      "mas também ADVÉRBIOS que exijam preposição: longe de, perto de, antes de, depois de...",
    explanationCorrect:
      "Correto! 'Longe de' = advérbio que exige complemento → 'da delegacia' = CN. " +
      "CN pode completar: substantivo, adjetivo OU advérbio.",
    explanationWrong:
      "O item está CERTO. Advérbios também admitem CN: 'longe de', 'perto de'. " +
      "'da delegacia' completa o advérbio 'longe' = CN.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_cn_q07",
    contentId: CONTENT_IDS.cnaa,
    statement:
      "(CESPE — Adaptada) Em 'A leitura do livro pelo aluno foi proveitosa', " +
      "classifique CORRETAMENTE os termos:",
    alternatives: [
      { letter: "A", text: "'do livro' = AA (livro pratica a leitura); 'pelo aluno' = CN" },
      { letter: "B", text: "'do livro' = CN (livro é lido = paciente); 'pelo aluno' = AA (aluno lê = agente)" },
      { letter: "C", text: "'do livro' = OI; 'pelo aluno' = agente da passiva" },
      { letter: "D", text: "'do livro' = AA; 'pelo aluno' = AA" },
      { letter: "E", text: "'do livro' = CN; 'pelo aluno' = CN" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO. 'do livro' = CN: o livro É LIDO (paciente da leitura). " +
      "'pelo aluno' = AA: o aluno LÊ (agente da leitura). " +
      "Mnemônico consolidado: " +
      "→ PACIENTE (sofre a ação do substantivo) = CN " +
      "→ AGENTE (pratica a ação do substantivo) = AA " +
      "Transformação: 'O aluno lê o livro' → aluno=agente(AA) / livro=paciente(CN).",
    explanationCorrect:
      "Exato! 'do livro' = CN (livro é lido = paciente). " +
      "'pelo aluno' = AA (aluno lê = agente). AA=AGENTE / CN=PACIENTE.",
    explanationWrong:
      "Resposta: B. 'leitura do livro' → livro é lido (paciente → CN). " +
      "'pelo aluno' → aluno lê (agente → AA).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  {
    id: "por_si_cn_q08",
    contentId: CONTENT_IDS.cnaa,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'A vitória do Brasil sobre a Argentina foi histórica', " +
      "'do Brasil' é adjunto adnominal e 'sobre a Argentina' é complemento nominal.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'do Brasil' = AA: o Brasil VENCEU (agente da vitória → AA). " +
      "'sobre a Argentina' = CN: a Argentina foi vencida (paciente da vitória → CN). " +
      "Transformação: 'O Brasil venceu a Argentina' → Brasil=agente(AA) / Argentina=paciente(CN).",
    explanationCorrect:
      "Correto! Brasil venceu (agente → AA). Argentina foi vencida (paciente → CN). " +
      "AA=AGENTE / CN=PACIENTE. Ambas as classificações corretas.",
    explanationWrong:
      "O item está CERTO. 'do Brasil' = AA (agente da vitória). " +
      "'sobre a Argentina' = CN (Argentina sofre a derrota = paciente).",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 4 — Agente da Passiva e Aposto (por_si_c04)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "por_si_ag_q01",
    contentId: CONTENT_IDS.agente,
    statement:
      "(CESPE — Adaptada) Na frase 'O suspeito foi preso pela equipe de operações especiais', " +
      "o agente da passiva é:",
    alternatives: [
      { letter: "A", text: "'O suspeito'" },
      { letter: "B", text: "'foi preso'" },
      { letter: "C", text: "'pela equipe de operações especiais'" },
      { letter: "D", text: "'de operações especiais'" },
      { letter: "E", text: "A frase não tem agente da passiva" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'pela equipe de operações especiais' é o agente da passiva. " +
      "Na voz passiva analítica, o agente é introduzido por 'por' (pelo, pela, pelos, pelas) ou 'de'. " +
      "Equivalência ativa: 'A equipe de operações especiais prendeu o suspeito'. " +
      "Estrutura: Sujeito paciente ('o suspeito') + verbo passivo ('foi preso') + agente ('pela equipe').",
    explanationCorrect:
      "Exato! 'pela equipe' = agente da passiva (introduzido por 'por'). " +
      "Voz ativa: 'A equipe prendeu o suspeito'.",
    explanationWrong:
      "Resposta: C. Agente da passiva = quem pratica a ação na voz passiva, introduzido por 'por/de'. " +
      "'pela equipe de operações especiais' = por + a + equipe = agente.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  {
    id: "por_si_ag_q02",
    contentId: CONTENT_IDS.agente,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O laudo foi assinado pelo perito responsável', " +
      "o termo 'pelo perito responsável' exerce a função de agente da passiva.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'pelo perito responsável' = agente da passiva analítica. " +
      "Introduzido por 'por' (pela/pelo). " +
      "Transformação para voz ativa: 'O perito responsável assinou o laudo'. " +
      "Na ativa: 'perito' = sujeito; na passiva: 'perito' = agente da passiva.",
    explanationCorrect:
      "Correto! 'pelo perito' = agente da passiva. Introduzido por 'por'. " +
      "Voz ativa equivalente: 'O perito responsável assinou o laudo'.",
    explanationWrong:
      "O item está CERTO. 'pelo perito responsável' = agente da passiva (introduzido por 'por'). " +
      "Na ativa, esse termo seria o sujeito.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_ag_q03",
    contentId: CONTENT_IDS.agente,
    statement:
      "(CESPE — Adaptada) Em 'O delegado João Silva, chefe da divisão de homicídios, " +
      "coordenou a operação', o termo 'chefe da divisão de homicídios' exerce a função de:",
    alternatives: [
      { letter: "A", text: "Sujeito composto" },
      { letter: "B", text: "Predicativo do sujeito" },
      { letter: "C", text: "Aposto explicativo" },
      { letter: "D", text: "Adjunto adnominal" },
      { letter: "E", text: "Complemento nominal" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: Aposto explicativo. O termo 'chefe da divisão de homicídios' explica/especifica " +
      "o sujeito 'O delegado João Silva', sendo separado por vírgulas. " +
      "Características do aposto explicativo: " +
      "• Entre vírgulas (ou travessões/parênteses). " +
      "• Explica, esclarece ou detalha um termo anterior. " +
      "• Pode ser removido sem prejuízo para a estrutura da frase.",
    explanationCorrect:
      "Exato! Aposto explicativo: explica 'O delegado João Silva', separado por vírgulas.",
    explanationWrong:
      "Resposta: C. Aposto explicativo: entre vírgulas, explica o sujeito. " +
      "Remove-se sem alterar a estrutura: 'O delegado João Silva coordenou a operação'.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  {
    id: "por_si_ag_q04",
    contentId: CONTENT_IDS.agente,
    statement:
      "(CEBRASPE — Adaptada) A frase 'A polícia identificou os suspeitos' pode ser reescrita " +
      "como 'Os suspeitos foram identificados pela polícia' sem alteração de sentido.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Transformação de voz ativa para passiva analítica: " +
      "Ativa: 'A polícia (sujeito) identificou (VTD) os suspeitos (OD)'. " +
      "Passiva: 'Os suspeitos (sujeito paciente) foram identificados (locução passiva) " +
      "pela polícia (agente da passiva)'. " +
      "Sentido preservado. O OD da ativa torna-se sujeito da passiva; " +
      "o sujeito da ativa torna-se agente da passiva.",
    explanationCorrect:
      "Correto! Transformação ativa→passiva: OD→sujeito; sujeito→agente da passiva. Sentido idêntico.",
    explanationWrong:
      "O item está CERTO. Voz ativa → passiva: " +
      "'os suspeitos' (OD) vira sujeito; 'a polícia' (sujeito) vira agente da passiva. Sentido mantido.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_ag_q05",
    contentId: CONTENT_IDS.agente,
    statement:
      "(CESPE — Adaptada) Em 'Para ser aprovado, são necessárias três coisas: dedicação, " +
      "estudo e persistência', o termo 'dedicação, estudo e persistência' é aposto:",
    alternatives: [
      { letter: "A", text: "Explicativo" },
      { letter: "B", text: "Resumitivo" },
      { letter: "C", text: "Enumerativo" },
      { letter: "D", text: "Especificativo" },
      { letter: "E", text: "Apositivo" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: Aposto enumerativo. Após a enumeração dos elementos ('três coisas'), " +
      "os itens são listados separados por vírgulas após os dois pontos. " +
      "O aposto enumerativo detalha/lista os elementos de um termo anterior. " +
      "Estrutura típica: 'TERMO GERAL: elemento1, elemento2, elemento3' " +
      "→ 'três coisas: dedicação, estudo e persistência'.",
    explanationCorrect:
      "Exato! Aposto enumerativo: lista os elementos do termo geral 'três coisas' após dois pontos.",
    explanationWrong:
      "Resposta: C. Aposto enumerativo: após dois pontos, enumera os elementos de um substantivo geral. " +
      "Resumitivo seria o inverso: lista primeiro, depois o resumo ('tudo isso', 'nada disso').",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  {
    id: "por_si_ag_q06",
    contentId: CONTENT_IDS.agente,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O delegado, pessoa de vasta experiência, " +
      "decidiu encerrar o inquérito', o termo 'pessoa de vasta experiência' é predicativo do sujeito.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. 'pessoa de vasta experiência' é APOSTO EXPLICATIVO, não predicativo do sujeito. " +
      "Distinção: " +
      "• Aposto explicativo: explica/especifica um termo sem precisar de verbo de ligação; entre vírgulas. " +
      "• Predicativo do sujeito: ligado ao sujeito por verbo de ligação (ser, estar, ficar...). " +
      "Nessa frase, não há verbo de ligação vinculando 'pessoa' ao sujeito — é apenas uma explicação intercalada.",
    explanationCorrect:
      "Correto! O item está ERRADO. 'pessoa de vasta experiência' = aposto explicativo (sem VL). " +
      "Predicativo exige verbo de ligação.",
    explanationWrong:
      "ERRADO. Aposto ≠ predicativo. Aposto não precisa de VL; predicativo requer VL (ser, estar, ficar...). " +
      "'pessoa de vasta experiência' é intercalado entre vírgulas sem VL → aposto explicativo.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_ag_q07",
    contentId: CONTENT_IDS.agente,
    statement:
      "(CESPE — Adaptada) Em 'O réu era respeitado de todos os presentes no tribunal', " +
      "o agente da passiva é 'de todos os presentes no tribunal', introduzido pela preposição 'de'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. O agente da passiva pode ser introduzido pela preposição 'DE' (além de 'por'). " +
      "Esse uso ocorre principalmente com verbos que expressam sentimentos ou estados: " +
      "ser amado de, ser respeitado de, ser cercado de, ser acompanhado de. " +
      "Portanto, 'de todos os presentes' = agente da passiva introduzido por 'de'.",
    explanationCorrect:
      "Correto! Agente da passiva pode ser introduzido por 'DE' (além de 'por'): " +
      "verbos de sentimento/estado: amado de, respeitado de, cercado de.",
    explanationWrong:
      "O item está CERTO. Agente da passiva: preposição 'por' OU 'de'. " +
      "Com verbos de sentimento/estado, usa-se 'de': 'respeitado de todos' = agente da passiva.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_ag_q08",
    contentId: CONTENT_IDS.agente,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Dedicação, estudo e foco — tudo isso garante aprovação', " +
      "o termo 'tudo isso' é aposto resumitivo.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. O aposto resumitivo retoma, em forma de síntese (pronome ou substantivo genérico), " +
      "uma enumeração anterior. " +
      "Estrutura: 'elemento1, elemento2, elemento3 — RESUMO' (com travessão ou vírgula). " +
      "'Tudo isso' resume a enumeração 'dedicação, estudo e foco'. " +
      "Outros resumitivos comuns: 'nada disso', 'ninguém', 'tudo', 'isso'.",
    explanationCorrect:
      "Correto! Aposto resumitivo: 'tudo isso' resume a enumeração anterior (dedicação, estudo, foco).",
    explanationWrong:
      "O item está CERTO. 'Tudo isso' = aposto resumitivo. " +
      "Estrutura: enumeração → travessão → resumo pronominal. Característico do estilo CESPE.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 5 — Vocativo e Predicativo (por_si_c05)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "por_si_vp_q01",
    contentId: CONTENT_IDS.vocativo,
    statement:
      "(CESPE — Adaptada) Em qual das frases há VOCATIVO?",
    alternatives: [
      { letter: "A", text: "'O delegado assinou o relatório final.'" },
      { letter: "B", text: "'Delegado, assine o relatório imediatamente.'" },
      { letter: "C", text: "'O delegado, responsável pela operação, saiu.'" },
      { letter: "D", text: "'Chamaram o delegado para depor.'" },
      { letter: "E", text: "'O novo delegado assumiu o cargo.'" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'Delegado, assine o relatório.' — 'Delegado' é VOCATIVO: chama/interpela alguém diretamente. " +
      "Características do vocativo: " +
      "• Sempre separado por vírgula(s). " +
      "• Não integra a estrutura da oração (não é sujeito nem objeto). " +
      "• Expressa chamamento, interpelação ou apelo. " +
      "C: 'responsável pela operação' = aposto explicativo, não vocativo.",
    explanationCorrect:
      "Exato! 'Delegado,' = vocativo: interpelação direta, separada por vírgula, fora da estrutura oracional.",
    explanationWrong:
      "Resposta: B. 'Delegado,' = vocativo (chamamento/interpelação). " +
      "Separado por vírgula, não exerce função sintática dentro da oração.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  {
    id: "por_si_vp_q02",
    contentId: CONTENT_IDS.vocativo,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Agentes, procedam à apreensão do material ilícito', " +
      "o vocativo não integra a estrutura sintática da oração e, portanto, " +
      "não interfere na concordância verbal.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. O vocativo está fora da estrutura da oração — não é sujeito, objeto nem adjunto. " +
      "Portanto, não determina a concordância verbal. " +
      "O verbo 'procedam' está no imperativo afirmativo concordando com o sujeito oculto " +
      "(vocês/os agentes, implícito no imperativo), não com o vocativo 'Agentes'.",
    explanationCorrect:
      "Correto! Vocativo não integra a oração e não interfere na concordância verbal. " +
      "'Procedam' concorda com o sujeito implícito (vocês), não com o vocativo.",
    explanationWrong:
      "O item está CERTO. Vocativo é externo à estrutura oracional — não determina concordância. " +
      "É mero chamamento interposto na frase.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_vp_q03",
    contentId: CONTENT_IDS.vocativo,
    statement:
      "(CESPE — Adaptada) Em 'A testemunha saiu abalada da audiência', " +
      "o predicativo do sujeito é:",
    alternatives: [
      { letter: "A", text: "'saiu'" },
      { letter: "B", text: "'abalada'" },
      { letter: "C", text: "'da audiência'" },
      { letter: "D", text: "'A testemunha'" },
      { letter: "E", text: "A frase não tem predicativo" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'abalada' é predicativo do sujeito 'a testemunha'. " +
      "Qualifica o sujeito no momento em que a ação ocorre. " +
      "'Sair' é verbo significativo (não de ligação), portanto o predicado é VERBO-NOMINAL. " +
      "O predicativo do sujeito refere-se ao sujeito e com ele concorda em gênero e número.",
    explanationCorrect:
      "Exato! 'abalada' = predicativo do sujeito 'a testemunha'. " +
      "Predicado verbo-nominal: 'saiu' (VSignif.) + 'abalada' (pred. sujeito).",
    explanationWrong:
      "Resposta: B. 'abalada' qualifica o sujeito 'a testemunha' → predicativo do sujeito. " +
      "Com 'sair' (verbo significativo): predicado verbo-nominal.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  {
    id: "por_si_vp_q04",
    contentId: CONTENT_IDS.vocativo,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Consideraram o réu inocente após o julgamento', " +
      "'inocente' é predicativo do objeto 'o réu'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Considerar' é verbo que admite predicativo do objeto. " +
      "Estrutura: 'Consideraram (verbo) + o réu (OD) + inocente (predicativo do objeto)'. " +
      "O predicativo do objeto qualifica o objeto ('o réu') e com ele concorda. " +
      "Verbos que admitem predicativo do objeto: considerar, eleger, nomear, julgar, tornar, chamar...",
    explanationCorrect:
      "Correto! 'inocente' = predicativo do objeto 'o réu'. " +
      "'Considerar' + OD + predicativo do objeto: estrutura típica CESPE.",
    explanationWrong:
      "O item está CERTO. Predicativo do objeto: qualifica o OD. " +
      "'Consideraram o réu inocente' = considerar + OD ('o réu') + pred. do objeto ('inocente').",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_vp_q05",
    contentId: CONTENT_IDS.vocativo,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa que apresenta APOSTO, e não vocativo:",
    alternatives: [
      { letter: "A", text: "'Delegada, encerre a audiência agora.'" },
      { letter: "B", text: "'Senhor juiz, o réu está presente.'" },
      { letter: "C", text: "'Cidadãos, conheçam seus direitos!'" },
      { letter: "D", text: "'A delegada Ana Souza, chefe da divisão, assinou o laudo.'" },
      { letter: "E", text: "'Promotor, leia o libelo acusatório.'" },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "CORRETO: Em D, 'chefe da divisão' é APOSTO EXPLICATIVO de 'A delegada Ana Souza'. " +
      "Não é vocativo porque não interpela ninguém — apenas explica quem é a delegada. " +
      "Distinção: " +
      "• Vocativo: interpela/chama alguém diretamente (sempre em frases imperativas ou exclamativas). " +
      "• Aposto: explica/especifica um termo da oração (pode aparecer em qualquer tipo de frase).",
    explanationCorrect:
      "Exato! D contém aposto explicativo ('chefe da divisão'), não vocativo. " +
      "Vocativo = chama/interpela; Aposto = explica/especifica.",
    explanationWrong:
      "Resposta: D. 'chefe da divisão' = aposto (explica 'Ana Souza'). " +
      "Nas demais (A, B, C, E): há interpelação direta = vocativo.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  {
    id: "por_si_vp_q06",
    contentId: CONTENT_IDS.vocativo,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Os investigadores elegeram a delegada presidente da comissão', " +
      "'presidente da comissão' é predicativo do objeto 'a delegada'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. O verbo 'eleger' admite predicativo do objeto. " +
      "Estrutura: 'elegeram (verbo) + a delegada (OD) + presidente da comissão (pred. objeto)'. " +
      "'Presidente da comissão' qualifica o objeto 'a delegada'. " +
      "Verbos de nomeação/eleição (eleger, nomear, designar, chamar) costumam ter predicativo do objeto.",
    explanationCorrect:
      "Correto! 'Eleger' + OD + predicativo do objeto. " +
      "'presidente da comissão' qualifica 'a delegada' = predicativo do objeto.",
    explanationWrong:
      "O item está CERTO. 'Eleger' admite predicativo do objeto. " +
      "'a delegada' = OD; 'presidente da comissão' = predicativo do objeto.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_vp_q07",
    contentId: CONTENT_IDS.vocativo,
    statement:
      "(CESPE — Adaptada) Analise a frase: 'Dr. Santos, o senhor, como perito oficial, " +
      "deve assinar o laudo.' Identifique CORRETAMENTE as funções dos termos em destaque:",
    alternatives: [
      { letter: "A", text: "'Dr. Santos' = sujeito; 'como perito oficial' = predicativo" },
      { letter: "B", text: "'Dr. Santos' = vocativo; 'como perito oficial' = aposto" },
      { letter: "C", text: "'Dr. Santos' = aposto; 'como perito oficial' = vocativo" },
      { letter: "D", text: "'Dr. Santos' = sujeito oculto; 'como perito oficial' = adjunto" },
      { letter: "E", text: "'Dr. Santos' = vocativo; 'como perito oficial' = adjunto adverbial" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'Dr. Santos' = VOCATIVO (interpela o interlocutor, separado por vírgula). " +
      "'como perito oficial' = APOSTO (explica/especifica a função do sujeito 'o senhor'). " +
      "Sujeito da oração: 'o senhor' (forma de tratamento). " +
      "O aposto 'como perito oficial' está intercalado entre vírgulas, explicando o sujeito.",
    explanationCorrect:
      "Exato! 'Dr. Santos' = vocativo (interpelação); 'como perito oficial' = aposto explicativo do sujeito.",
    explanationWrong:
      "Resposta: B. Vocativo = interpelação ('Dr. Santos,'). " +
      "Aposto = explicação do sujeito 'o senhor' ('como perito oficial').",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  {
    id: "por_si_vp_q08",
    contentId: CONTENT_IDS.vocativo,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O suspeito permaneceu calado durante todo o interrogatório', " +
      "'calado' é adjunto adverbial de modo do verbo 'permaneceu'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. 'Calado' é PREDICATIVO DO SUJEITO, não adjunto adverbial. " +
      "'Permanecer' é verbo de ligação (assim como: ficar, continuar, estar). " +
      "Portanto, 'calado' qualifica o sujeito 'o suspeito' → predicativo do sujeito. " +
      "Distinção: Predicativo qualifica SUBSTANTIVO (sujeito ou objeto); " +
      "adjunto adverbial modifica VERBO/adjetivo/advérbio.",
    explanationCorrect:
      "Correto! O item está ERRADO. 'Permanecer' = VL → 'calado' = predicativo do sujeito. " +
      "Não é adjunto adverbial (que modificaria o verbo, não qualificaria o sujeito).",
    explanationWrong:
      "ERRADO. 'Permanecer' é verbo de ligação; 'calado' qualifica o sujeito → predicativo do sujeito. " +
      "Adjunto adverbial modifica verbo (modo, tempo, lugar); predicativo qualifica substantivo.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 6 — Análise Sintática Completa / Reescritura (por_si_c06)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "por_si_ac_q01",
    contentId: CONTENT_IDS.analise,
    statement:
      "(CESPE — Adaptada) A frase 'A equipe policial identificou os suspeitos' pode ser " +
      "reescrita, em voz passiva, como 'Os suspeitos foram identificados pela equipe policial', " +
      "mantendo o sentido original.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Transformação ativa → passiva analítica: " +
      "• Sujeito ativo ('a equipe policial') → agente da passiva ('pela equipe policial'). " +
      "• OD ('os suspeitos') → sujeito paciente. " +
      "• Verbo: 'identificou' → 'foram identificados' (ser + particípio, concordando com 'os suspeitos'). " +
      "Sentido e informação preservados.",
    explanationCorrect:
      "Correto! Transformação ativa→passiva: sujeito→agente; OD→sujeito; verbo→locução passiva. Sentido mantido.",
    explanationWrong:
      "O item está CERTO. Passivização correta: OD vira sujeito, sujeito vira agente, verbo vira locução passiva.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_ac_q02",
    contentId: CONTENT_IDS.analise,
    statement:
      "(CEBRASPE — Adaptada) A frase 'O mandado foi expedido pelo juiz' pode ser reescrita " +
      "como 'O juiz expediu o mandado', sem prejuízo para o sentido.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Transformação passiva → ativa: " +
      "• Agente da passiva ('pelo juiz') → sujeito ('o juiz'). " +
      "• Sujeito paciente ('o mandado') → OD ('o mandado'). " +
      "• 'foi expedido' → 'expediu'. " +
      "Sentido completamente preservado. A passivização e sua inversa são equivalentes.",
    explanationCorrect:
      "Correto! Passiva→ativa: agente→sujeito; sujeito paciente→OD; locução passiva→verbo ativo. Sentido idêntico.",
    explanationWrong:
      "O item está CERTO. Transformação passiva→ativa preserva integralmente o sentido.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_ac_q03",
    contentId: CONTENT_IDS.analise,
    statement:
      "(CESPE — Adaptada) Na frase 'O promotor que acusou o réu recebeu elogios', " +
      "a oração 'que acusou o réu' exerce a função de:",
    alternatives: [
      { letter: "A", text: "Oração subordinada adverbial causal" },
      { letter: "B", text: "Oração subordinada substantiva subjetiva" },
      { letter: "C", text: "Oração subordinada adjetiva restritiva" },
      { letter: "D", text: "Oração subordinada adverbial concessiva" },
      { letter: "E", text: "Oração coordenada sindética aditiva" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: Oração subordinada adjetiva RESTRITIVA. " +
      "• É introduzida pelo pronome relativo 'que' (retoma 'o promotor'). " +
      "• Qualifica/restringe o antecedente ('o promotor') — identifica QUAL promotor. " +
      "• Sem vírgulas = restritiva (essencial para identificar o referente). " +
      "Se tivesse vírgulas ('O promotor, que acusou o réu, recebeu elogios'), seria explicativa.",
    explanationCorrect:
      "Exato! Pronome relativo 'que' + sem vírgulas = adjetiva restritiva. " +
      "Restringe/identifica o antecedente 'o promotor'.",
    explanationWrong:
      "Resposta: C. 'que acusou o réu' = adjetiva restritiva (pronome relativo 'que' sem vírgulas). " +
      "Sem vírgulas → restritiva (identifica qual promotor). Com vírgulas → explicativa.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  {
    id: "por_si_ac_q04",
    contentId: CONTENT_IDS.analise,
    statement:
      "(CEBRASPE — Adaptada) O trecho 'Embora o suspeito tivesse álibi, foi preso' pode ser " +
      "reescrito como 'O suspeito tinha álibi, mas foi preso', sem prejuízo de sentido.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. A oração com 'embora' é subordinada adverbial concessiva. " +
      "A reescrita com 'mas' cria uma oração coordenada adversativa — ambas expressam CONCESSÃO/CONTRASTE. " +
      "Equivalências: 'embora/ainda que/mesmo que' → 'mas/porém/contudo/entretanto'. " +
      "Sentido preservado: a existência do álibi não impediu a prisão.",
    explanationCorrect:
      "Correto! Concessiva ('embora') ≡ adversativa ('mas') em valor semântico. Sentido mantido.",
    explanationWrong:
      "O item está CERTO. 'Embora' (concessão) e 'mas' (adversação) expressam o mesmo contraste. " +
      "A reescrita preserva o sentido.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_ac_q05",
    contentId: CONTENT_IDS.analise,
    statement:
      "(CESPE — Adaptada) Em 'A delegada assinou o laudo', o OD 'o laudo' pode ser " +
      "substituído pelo pronome oblíquo, resultando em 'A delegada assinou-o', " +
      "sem alteração sintática.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. OD 'o laudo' → substituído por pronome oblíquo átono 'o' (masculino singular). " +
      "Regra de colocação: com verbo no indicativo afirmativo simples, pronome após o verbo = ênclise: " +
      "'assinou-o'. A função sintática (OD) é mantida. " +
      "Mnemônico: OD → substitui por O/A/OS/AS.",
    explanationCorrect:
      "Correto! OD 'o laudo' → pronome 'o' → 'assinou-o'. Ênclise após verbo no indicativo.",
    explanationWrong:
      "O item está CERTO. OD → pronome O/A: 'assinou-o'. Função sintática mantida.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_ac_q06",
    contentId: CONTENT_IDS.analise,
    statement:
      "(CEBRASPE — Adaptada) A frase 'Quando o réu chegou, o juiz leu a sentença' pode ser " +
      "reescrita como 'Ao chegar o réu, o juiz leu a sentença', mantendo sentido e correção.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. A oração temporal 'quando o réu chegou' equivale à construção com infinitivo 'ao chegar o réu'. " +
      "'Ao + infinitivo' expressa simultaneidade/temporalidade. " +
      "Equivalência: 'quando + pretérito' ≡ 'ao + infinitivo'. " +
      "Sentido temporal preservado; correção gramatical mantida.",
    explanationCorrect:
      "Correto! 'Quando o réu chegou' = 'Ao chegar o réu' — equivalentes temporais. Sentido preservado.",
    explanationWrong:
      "O item está CERTO. 'Quando + pretérito' ≡ 'ao + infinitivo' em valor temporal. Sentido mantido.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  {
    id: "por_si_ac_q07",
    contentId: CONTENT_IDS.analise,
    statement:
      "(CESPE — Adaptada) No período 'Os agentes que chegaram primeiro preservaram a cena do crime, " +
      "o que facilitou o trabalho dos peritos', a oração 'o que facilitou o trabalho dos peritos' é:",
    alternatives: [
      { letter: "A", text: "Oração subordinada adjetiva restritiva" },
      { letter: "B", text: "Oração subordinada adjetiva explicativa com antecedente oracional" },
      { letter: "C", text: "Oração subordinada substantiva objetiva direta" },
      { letter: "D", text: "Oração coordenada sindética conclusiva" },
      { letter: "E", text: "Oração principal" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: Oração subordinada adjetiva EXPLICATIVA com antecedente oracional. " +
      "• Introduzida por 'o que' (pronome relativo cujo antecedente é toda a oração anterior). " +
      "• Com vírgula = explicativa (não restritiva). " +
      "• O antecedente de 'o que' não é um substantivo isolado, mas a oração toda: " +
      "'os agentes preservaram a cena do crime' → isso facilitou o trabalho. " +
      "Esse uso de 'o que' com antecedente oracional é muito cobrado pelo CESPE.",
    explanationCorrect:
      "Exato! 'o que' = pronome relativo com antecedente oracional + vírgula = adjetiva explicativa. " +
      "Clássico CESPE: 'o que' retomando oração inteira.",
    explanationWrong:
      "Resposta: B. 'o que' com antecedente oracional + vírgula = adjetiva explicativa. " +
      "Padrão CESPE: 'o que facilitou...' comenta/explica toda a oração anterior.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  {
    id: "por_si_ac_q08",
    contentId: CONTENT_IDS.analise,
    statement:
      "(CEBRASPE — Adaptada) A frase 'É necessário que o delegado assine o laudo' pode ser " +
      "reescrita como 'É necessária a assinatura do laudo pelo delegado', " +
      "sem prejuízo para o sentido original.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. As duas construções são equivalentes semanticamente: " +
      "• 'É necessário que o delegado assine o laudo' — 'necessário' concorda com o sujeito oracional (neutro). " +
      "• 'É necessária a assinatura do laudo pelo delegado' — 'necessária' concorda com 'a assinatura' (feminino). " +
      "A nominalização ('assinar' → 'assinatura') e a passivização ('pelo delegado') preservam o sentido. " +
      "Esse tipo de reescritura é padrão CEBRASPE.",
    explanationCorrect:
      "Correto! Nominalização + passivização preservam o sentido. " +
      "Concordância de 'necessário/necessária' muda conforme o sujeito — sem erro.",
    explanationWrong:
      "O item está CERTO. Nominalização ('assinar'→'assinatura') + concordância com novo sujeito feminino. " +
      "Sentido preservado — reescritura equivalente.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
];

// ─── RUNNER ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Seed R37 — Densificação: Português — Sintaxe (48 questões) ===\n");

  // 1. Verificar átomos e coletar subjectId/topicId
  console.log("--- Verificando átomos de conteúdo ---");
  let subjectId: string | null = null;
  let topicId: string | null = null;

  for (const [nome, contentId] of Object.entries(CONTENT_IDS)) {
    const rows = (await db.execute(sql`
      SELECT id, "subjectId", "topicId" FROM "Content" WHERE id = ${contentId} LIMIT 1
    `)) as any[];

    if (!rows[0]) {
      console.warn(`  AVISO: átomo '${nome}' (${contentId}) não encontrado no banco.`);
    } else {
      console.log(`  OK: ${nome} → ${contentId}`);
      if (!subjectId) {
        subjectId = rows[0].subjectId;
        topicId   = rows[0].topicId;
      }
    }
  }

  if (!subjectId) {
    throw new Error(
      "Nenhum átomo de sintaxe encontrado. Verifique os IDs:\n" +
      JSON.stringify(CONTENT_IDS, null, 2)
    );
  }

  console.log(`\nSubject: ${subjectId}`);
  console.log(`Topic:   ${topicId}`);

  // 2. Inserir questões
  console.log("\n--- Inserindo Questões ---");
  let inseridos = 0;
  let pulados   = 0;

  for (const q of questions) {
    const contentRows = (await db.execute(sql`
      SELECT id FROM "Content" WHERE id = ${q.contentId} LIMIT 1
    `)) as any[];

    if (!contentRows[0]) {
      console.warn(`  SKIP: contentId ${q.contentId} não encontrado para ${q.id}`);
      pulados++;
      continue;
    }

    const alternativesJson = JSON.stringify(q.alternatives);

    await db.execute(sql`
      INSERT INTO "Question" (
        "id", "statement", "alternatives", "correctAnswer", "correctOption",
        "explanation", "explanationCorrect", "explanationWrong",
        "subjectId", "topicId", "contentId",
        "isActive", "difficulty", "timesUsed", "questionType",
        "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternativesJson}::jsonb,
        ${q.correctAnswer}, ${q.correctOption},
        ${q.explanation}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${subjectId}, ${topicId}, ${q.contentId},
        true, ${q.difficulty}, 0, ${q.questionType}, NOW(), NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `);

    console.log(`  OK: ${q.id} [${q.questionType}] — ${q.statement.substring(0, 55)}...`);
    inseridos++;
  }

  console.log(`\n=== R37 concluído ===`);
  console.log(`  Questões inseridas : ${inseridos}`);
  console.log(`  Puladas (duplicata): ${pulados}`);
  console.log(`  Total processado   : ${questions.length}`);
  console.log(`\n  Distribuição por átomo:`);
  console.log(`    Sujeito e Predicado        : 8q → ${CONTENT_IDS.sujeito}`);
  console.log(`    Objetos Direto e Indireto  : 8q → ${CONTENT_IDS.objetos}`);
  console.log(`    CN vs. Adjunto Adnominal   : 8q → ${CONTENT_IDS.cnaa}`);
  console.log(`    Agente da Passiva e Aposto : 8q → ${CONTENT_IDS.agente}`);
  console.log(`    Vocativo e Predicativo     : 8q → ${CONTENT_IDS.vocativo}`);
  console.log(`    Análise / Reescritura      : 8q → ${CONTENT_IDS.analise}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("ERRO no seed R37:", err);
  process.exit(1);
});
