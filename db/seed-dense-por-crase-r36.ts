/**
 * Seed R36 — Densificação: Português — Crase
 * Modo: DENSIFICAÇÃO — apenas questões; átomos de conteúdo já existem no banco.
 *
 * Átomos-alvo (5 átomos × 10 questões = 50 questões):
 *   ct_mm1ah0b5uy71l6  — Crase: Casos Obrigatórios (SLAH)
 *   ct_mm1ah0esq9maxo  — Crase: Casos Proibidos (MVPQI)
 *   ct_mm1ah0ifceevdt  — Crase: Casos Facultativos (PPN)
 *   ct_mm1ah0mgsy974q  — Crase: Nomes de Cidades
 *   ct_mm1ah0q7a4g232  — Crase: Locuções Prepositivas e Adverbiais
 *
 * Execução: git pull && npx tsx db/seed-dense-por-crase-r36.ts
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

const CONTENT_IDS = {
  obrigatorios: "ct_mm1ah0b5uy71l6",
  proibidos:    "ct_mm1ah0esq9maxo",
  facultativos: "ct_mm1ah0ifceevdt",
  cidades:      "ct_mm1ah0mgsy974q",
  locucoes:     "ct_mm1ah0q7a4g232",
};

// ─── QUESTÕES ─────────────────────────────────────────────────────────────────

const questions = [

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 1 — Casos Obrigatórios (SLAH)
  // S = Substantivo feminino definido | L = Locuções adverbiais/prepositivas
  // A = À moda de / À maneira de      | H = Hora determinada
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_cr_ob_q01",
    contentId: CONTENT_IDS.obrigatorios,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que o emprego da crase é OBRIGATÓRIO " +
      "segundo a norma culta.",
    alternatives: [
      { letter: "A", text: "O investigador foi a pé até a delegacia." },
      { letter: "B", text: "Entregou o mandado a um suspeito desconhecido." },
      { letter: "C", text: "A delegada chegou à reunião às três horas da tarde." },
      { letter: "D", text: "Começou a trabalhar sem avisar a chefia." },
      { letter: "E", text: "Enviou o relatório a ela por e-mail." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'à reunião' (S — substantivo feminino definido: a + a + reunião) e " +
      "'às três horas' (H — hora determinada: a + as + três horas). " +
      "Mnemônico SLAH: ambas as crases obedecem ao S e ao H. " +
      "A: 'a pé' = masculino, sem artigo → sem crase. " +
      "B: 'um' = artigo indefinido → proíbe crase. " +
      "D: 'a trabalhar' = verbo → proíbe crase. " +
      "E: 'ela' = pronome pessoal → proíbe crase.",
    explanationCorrect:
      "Exato! 'à reunião' = preposição 'a' + artigo definido 'a' + substantivo feminino 'reunião' (S do SLAH). " +
      "'às três horas' = hora determinada (H do SLAH). Ambas as crases são obrigatórias.",
    explanationWrong:
      "Resposta correta: C. 'à reunião' obedece ao S (substantivo feminino definido) e " +
      "'às três horas' obedece ao H (hora determinada) do mnemônico SLAH. " +
      "Nas demais: 'a pé' (masculino), 'a um' (indefinido), 'a trabalhar' (verbo) e 'a ela' (pronome) proíbem crase.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_cr_ob_q02",
    contentId: CONTENT_IDS.obrigatorios,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Os policiais chegaram à delegacia às três horas da tarde, " +
      "conforme registrado no boletim de ocorrência', ambos os empregos do acento grave " +
      "estão corretos e são obrigatórios.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'à delegacia' = preposição 'a' + artigo definido 'a' + substantivo feminino 'delegacia' " +
      "(S do mnemônico SLAH — Substantivo feminino definido). " +
      "'às três horas' = preposição 'a' + artigo 'as' + hora determinada " +
      "(H do mnemônico SLAH — Hora determinada). Ambas as crases são obrigatórias.",
    explanationCorrect:
      "Correto! SLAH confirma os dois casos: " +
      "'à delegacia' = S (substantivo feminino com artigo definido); " +
      "'às três horas' = H (hora determinada). Obrigatórios nos dois.",
    explanationWrong:
      "O item está CERTO. 'à delegacia' segue o S do SLAH (substantivo feminino definido). " +
      "'às três horas' segue o H do SLAH (hora determinada). Ambas as crases são obrigatórias.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — FACIL
  {
    id: "por_cr_ob_q03",
    contentId: CONTENT_IDS.obrigatorios,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa que contém APENAS locuções adverbiais femininas " +
      "que exigem crase obrigatória (L do mnemônico SLAH).",
    alternatives: [
      { letter: "A", text: "à tarde, a pé, às vezes" },
      { letter: "B", text: "às pressas, à noite, à direita" },
      { letter: "C", text: "à tarde, a tempo, à esquerda" },
      { letter: "D", text: "às vezes, a cavalo, à beira" },
      { letter: "E", text: "à vista, à prestação, a bordo" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'às pressas' (a + as + pressas), 'à noite' (a + a + noite) e 'à direita' (a + a + direita) " +
      "são todas locuções adverbiais femininas → crase obrigatória (L do SLAH). " +
      "A: 'a pé' — 'pé' é masculino → sem crase. " +
      "C: 'a tempo' — locução sem artigo definido → sem crase. " +
      "D: 'a cavalo' — 'cavalo' é masculino → sem crase. " +
      "E: 'a bordo' — 'bordo' é masculino → sem crase.",
    explanationCorrect:
      "Exato! 'às pressas', 'à noite' e 'à direita' são locuções adverbiais femininas com artigo definido. " +
      "L do SLAH: Locuções adverbiais/prepositivas femininas → crase obrigatória.",
    explanationWrong:
      "Resposta: B. As três locuções ('às pressas', 'à noite', 'à direita') são femininas e exigem artigo definido. " +
      "Nas demais opções há pelo menos uma locução masculina ou sem artigo definido, que não admite crase.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_cr_ob_q04",
    contentId: CONTENT_IDS.obrigatorios,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O delegado referiu-se à investigação em andamento e " +
      "dirigiu-se à testemunha principal', os dois empregos da crase são obrigatórios e corretos.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'à investigação' = preposição 'a' (exigida pelo verbo 'referir-se a') + artigo definido 'a' " +
      "+ substantivo feminino 'investigação' → obrigatório (S do SLAH). " +
      "'à testemunha' = preposição 'a' (exigida pelo verbo 'dirigir-se a') + artigo definido 'a' " +
      "+ substantivo feminino 'testemunha' → obrigatório (S do SLAH). Ambas corretas.",
    explanationCorrect:
      "Correto! Os dois casos seguem o S do SLAH: substantivos femininos definidos 'investigação' e " +
      "'testemunha', ambos precedidos da preposição 'a' com artigo definido 'a'. Crase obrigatória nos dois.",
    explanationWrong:
      "O item está CERTO. 'à investigação' e 'à testemunha' são substantivos femininos precedidos de " +
      "preposição 'a' + artigo definido 'a'. Mnemônico SLAH — S (Substantivo feminino definido): obrigatório.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_cr_ob_q05",
    contentId: CONTENT_IDS.obrigatorios,
    statement:
      "(FGV — Adaptada) Em qual das alternativas a crase decorre da elipse de palavra feminina, " +
      "correspondendo ao caso 'À moda de / À maneira de' (A do mnemônico SLAH)?",
    alternatives: [
      { letter: "A", text: "O investigador vestiu-se à paisana durante a operação encoberta." },
      { letter: "B", text: "O perito chegou à cena do crime rapidamente." },
      { letter: "C", text: "A agente foi à delegacia às 8h para o plantão." },
      { letter: "D", text: "Resolveram a questão à força, sem diálogo." },
      { letter: "E", text: "Trabalhou à noite durante todo o mês de dezembro." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CORRETO: 'à paisana' = à [moda/maneira] paisana — elipse de palavra feminina 'moda' ou 'maneira'. " +
      "Isso corresponde ao A do mnemônico SLAH (À moda de / À maneira de). " +
      "B: 'à cena' = S (substantivo feminino definido). " +
      "C: 'à delegacia' = S; 'às 8h' = H (hora determinada). " +
      "D: 'à força' = L (locução adverbial feminina). " +
      "E: 'à noite' = L (locução adverbial feminina).",
    explanationCorrect:
      "Exato! 'à paisana' = à [moda] paisana — elipse de 'moda' (palavra feminina). " +
      "A do SLAH: crase por elipse de substantivo feminino subentendido (à moda de, à maneira de).",
    explanationWrong:
      "Resposta: A. 'À paisana' é o único caso de elipse: subentende-se 'à [moda] paisana'. " +
      "Nos demais: 'à cena' e 'à delegacia' = S; 'à força' e 'à noite' = L; 'às 8h' = H do SLAH.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_cr_ob_q06",
    contentId: CONTENT_IDS.obrigatorios,
    statement:
      "(CEBRASPE — Adaptada) 'O perito cozinhava à moda antiga nas confraternizações do departamento.' " +
      "O acento grave em 'à' é obrigatório nessa frase.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'à moda' = preposição 'a' + artigo definido 'a' + substantivo feminino 'moda'. " +
      "Corresponde ao A do mnemônico SLAH: 'À moda de / À maneira de'. " +
      "A crase é obrigatória, pois há fusão real da preposição com o artigo feminino definido.",
    explanationCorrect:
      "Correto! 'à moda antiga' = a (preposição) + a (artigo) + moda (feminino). " +
      "Mnemônico SLAH — A: crase obrigatória em expressões 'à moda de' e 'à maneira de'.",
    explanationWrong:
      "O item está CERTO. 'moda' é substantivo feminino precedido de preposição 'a' + artigo 'a'. " +
      "Pelo A do mnemônico SLAH (À moda de / À maneira de), a crase é obrigatória.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — MEDIO
  {
    id: "por_cr_ob_q07",
    contentId: CONTENT_IDS.obrigatorios,
    statement:
      "(CESPE — Adaptada) Em qual das frases a crase é obrigatória por indicar hora determinada " +
      "(H do mnemônico SLAH)?",
    alternatives: [
      { letter: "A", text: "O suspeito foi liberado à meia-noite, após o depoimento." },
      { letter: "B", text: "Acordou tarde e foi direto ao trabalho sem tomar café." },
      { letter: "C", text: "Chegou a tempo para a audiência de instrução." },
      { letter: "D", text: "Foram a pé até o fórum, pois o carro estava na oficina." },
      { letter: "E", text: "Enviou o laudo a prazo estabelecido pela coordenação." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CORRETO: 'à meia-noite' = hora determinada. Mnemônico SLAH — H: antes de horas determinadas " +
      "(à meia-noite, às 14h, à 1 hora da tarde) a crase é obrigatória. " +
      "B e C: não envolvem preposição 'a' antes de hora. " +
      "D: 'a pé' — 'pé' é masculino → sem crase. " +
      "E: 'a prazo' — sem artigo definido feminino → sem crase.",
    explanationCorrect:
      "Exato! 'à meia-noite' aplica o H do SLAH: preposição 'a' + artigo 'a' + hora determinada. " +
      "Regra: sempre que houver referência a horas definidas, a crase é obrigatória.",
    explanationWrong:
      "Resposta: A. 'À meia-noite' = H do SLAH (hora determinada). " +
      "Nas demais: 'a pé' (masculino), 'a tempo' (sem artigo), 'a prazo' (masculino/sem artigo). " +
      "B e C nem envolvem a preposição 'a' antes de horas.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — MEDIO
  {
    id: "por_cr_ob_q08",
    contentId: CONTENT_IDS.obrigatorios,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'A reunião de briefing ocorrerá às 14h e às 16h30', " +
      "os dois empregos do acento grave estão corretos, pois indicam horas determinadas.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'às 14h' = preposição 'a' + artigo 'as' + hora determinada (14 horas). " +
      "'às 16h30' = preposição 'a' + artigo 'as' + hora determinada (16h30). " +
      "Mnemônico SLAH — H: antes de horas determinadas, a crase é sempre obrigatória.",
    explanationCorrect:
      "Correto! Ambas as horas são determinadas. SLAH — H: às 14h e às 16h30 = " +
      "preposição 'a' + artigo plural 'as' (pois subentende-se 'às 14 horas' e 'às 16 horas e 30'). Obrigatório.",
    explanationWrong:
      "O item está CERTO. Horas determinadas sempre exigem crase (H do SLAH). " +
      "'às 14h' = a + as + 14 horas; 'às 16h30' = a + as + 16 horas e 30 minutos.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q09 — ME — DIFICIL
  {
    id: "por_cr_ob_q09",
    contentId: CONTENT_IDS.obrigatorios,
    statement:
      "(CEBRASPE — Adaptada) Assinale a alternativa em que TODOS os empregos da crase " +
      "são obrigatórios e corretos, com base no mnemônico SLAH.",
    alternatives: [
      { letter: "A", text: "Às vezes chegava à delegacia à meia-noite." },
      { letter: "B", text: "Fomos à reunião e depois avisamos à ela." },
      { letter: "C", text: "Obedeceu à ordens superiores às pressas." },
      { letter: "D", text: "Trabalhou à noite e foi à pé para casa." },
      { letter: "E", text: "À medida que avançava, chegava à suspeitos." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CORRETO: Alternativa A — 'Às vezes' (L: locução adverbial feminina), " +
      "'à delegacia' (S: substantivo feminino definido), 'à meia-noite' (H: hora determinada). " +
      "Todos os três seguem o SLAH. " +
      "B: 'à ela' = pronome pessoal → proibido. " +
      "C: 'à ordens' = plural indeterminado → proibido. " +
      "D: 'à pé' = masculino → proibido. " +
      "E: 'à suspeitos' = masculino plural → proibido.",
    explanationCorrect:
      "Exato! Alternativa A contém três crases válidas: 'às vezes' (L), 'à delegacia' (S) e " +
      "'à meia-noite' (H). O mnemônico SLAH cobre todas as três situações.",
    explanationWrong:
      "Resposta: A. Apenas nela todos os empregos são corretos. " +
      "'Às vezes' = L; 'à delegacia' = S; 'à meia-noite' = H. " +
      "Nas demais há pelo menos uma crase proibida (pronome, masculino ou indeterminado).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q10 — CE — DIFICIL
  {
    id: "por_cr_ob_q10",
    contentId: CONTENT_IDS.obrigatorios,
    statement:
      "(CESPE — Adaptada) No período 'O militar referiu-se à superiora hierárquica às 8 horas " +
      "da manhã, à semelhança do protocolo estabelecido', todos os empregos do acento grave " +
      "estão corretos segundo o mnemônico SLAH.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Três crases, todas corretas: " +
      "(1) 'à superiora' = S (substantivo feminino definido); " +
      "(2) 'às 8 horas' = H (hora determinada); " +
      "(3) 'à semelhança' = S/L (locução prepositiva 'à semelhança de' = a + a + semelhança, feminino). " +
      "Todas obedecem ao SLAH.",
    explanationCorrect:
      "Correto! Os três empregos cobrem três letras do SLAH: S ('à superiora'), H ('às 8 horas') e " +
      "S/L ('à semelhança de' — locução prepositiva feminina). Todos obrigatórios e corretos.",
    explanationWrong:
      "O item está CERTO. 'à superiora' = S; 'às 8 horas' = H; 'à semelhança de' = S/L. " +
      "O mnemônico SLAH valida os três casos: Substantivo feminino, (L)ocução e (H)ora.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 2 — Casos Proibidos (MVPQI)
  // M = Masculino | V = Verbos | P = Pronomes
  // Q = Quantidade indeterminada | I = Indefinidos
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_cr_pr_q01",
    contentId: CONTENT_IDS.proibidos,
    statement:
      "(CESPE — Adaptada) Em qual das alternativas o emprego da crase está INCORRETO, " +
      "por violar o mnemônico MVPQI?",
    alternatives: [
      { letter: "A", text: "Entregou o laudo à delegada responsável." },
      { letter: "B", text: "A agente compareceu à audiência no horário." },
      { letter: "C", text: "Ele começou à trabalhar às seis horas." },
      { letter: "D", text: "Chegou à madrugada, exausto após o plantão." },
      { letter: "E", text: "Referiu-se à investigação com precisão." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "INCORRETO: 'começou à trabalhar' — crase antes de verbo é proibida (V do MVPQI). " +
      "O correto é 'começou a trabalhar' (sem crase). " +
      "A, B, D, E estão todos corretos: femininos definidos com crase obrigatória. " +
      "Mnemônico MVPQI — V: Verbos nunca admitem crase antes de si.",
    explanationCorrect:
      "Exato! 'à trabalhar' viola o V do MVPQI: nunca se usa crase antes de verbos. " +
      "Correto: 'começou a trabalhar'. Nos demais casos há substantivos femininos definidos.",
    explanationWrong:
      "Resposta: C. 'Começou à trabalhar' está errado — V do MVPQI proíbe crase antes de verbos. " +
      "As outras frases têm crase obrigatória correta (substantivos femininos definidos).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_cr_pr_q02",
    contentId: CONTENT_IDS.proibidos,
    statement:
      "(CEBRASPE — Adaptada) A frase 'O perito entregou à ele o laudo do exame de corpo de delito' " +
      "apresenta emprego INCORRETO da crase.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'à ele' está errado: 'ele' é pronome pessoal do caso reto. " +
      "Mnemônico MVPQI — P: Pronomes pessoais proíbem crase. " +
      "O correto é 'entregou a ele' (sem crase). " +
      "Dica: antes de pronomes pessoais (ele, ela, eles, elas, me, te, se, nos, vos) nunca há crase.",
    explanationCorrect:
      "Correto! 'à ele' viola o P do MVPQI. Pronomes pessoais proíbem crase. " +
      "O correto: 'entregou a ele'.",
    explanationWrong:
      "O item está CERTO: 'à ele' é errado. Mnemônico MVPQI — P: Pronomes pessoais (ele, ela, etc.) " +
      "proíbem crase. Correto: 'entregou a ele' sem acento grave.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — FACIL
  {
    id: "por_cr_pr_q03",
    contentId: CONTENT_IDS.proibidos,
    statement:
      "(CESPE — Adaptada) Indique a alternativa em que a crase é INCORRETA por estar " +
      "diante de palavra masculina (M do mnemônico MVPQI).",
    alternatives: [
      { letter: "A", text: "Entregou o documento à delegada de plantão." },
      { letter: "B", text: "Entregou o mandado à delegado de plantão." },
      { letter: "C", text: "Assistiu à cerimônia de posse da nova diretora." },
      { letter: "D", text: "Compareceu à sede do departamento de homicídios." },
      { letter: "E", text: "Retornou à delegacia depois da diligência." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "INCORRETO: 'à delegado' — 'delegado' é palavra masculina → crase proibida (M do MVPQI). " +
      "O correto é 'ao delegado'. " +
      "Teste prático: substitua o substantivo por um masculino. Se usar 'ao', indica que a forma feminina usa 'à'. " +
      "Se o substantivo já for masculino (como 'delegado'), usa-se 'ao', nunca 'à'.",
    explanationCorrect:
      "Exato! 'à delegado' viola o M do MVPQI: masculinos não admitem crase. " +
      "Correto: 'ao delegado'. Os demais casos têm femininos com crase obrigatória.",
    explanationWrong:
      "Resposta: B. 'Delegado' é masculino → crase proibida (M do MVPQI). " +
      "Correto: 'entregou o mandado ao delegado'. " +
      "Nas opções A, C, D e E os substantivos são femininos → crase obrigatória e correta.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — FACIL
  {
    id: "por_cr_pr_q04",
    contentId: CONTENT_IDS.proibidos,
    statement:
      "(CEBRASPE — Adaptada) A frase 'O suspeito confessou à cometer o delito mediante coação' " +
      "apresenta emprego INCORRETO da crase, pois não se usa crase antes de verbos.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'à cometer' está incorreto: crase antes de verbos é proibida (V do MVPQI). " +
      "O correto é 'confessou a cometer o delito'. " +
      "Verbos nunca são precedidos de artigo definido, portanto nunca há fusão de preposição + artigo.",
    explanationCorrect:
      "Correto! V do MVPQI: verbos proíbem crase. 'Confessou a cometer' é a forma correta. " +
      "Nunca há artigo definido antes de verbo, portanto a fusão 'à' é impossível.",
    explanationWrong:
      "O item está CERTO. 'à cometer' viola o V do MVPQI. " +
      "Regra: verbos não admitem artigo definido, logo nunca há crase antes deles. " +
      "Forma correta: 'confessou a cometer'.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_cr_pr_q05",
    contentId: CONTENT_IDS.proibidos,
    statement:
      "(CESPE — Adaptada) Em relação ao mnemônico MVPQI, qual das alternativas apresenta " +
      "uso CORRETO da preposição 'a' (com ou sem crase)?",
    alternatives: [
      { letter: "A", text: "Entregou à ela o resultado do exame pericial." },
      { letter: "B", text: "Começou à investigar os suspeitos apontados." },
      { letter: "C", text: "Referiu-se à qualquer pessoa que passasse." },
      { letter: "D", text: "O laudo foi entregue à perita forense designada." },
      { letter: "E", text: "Apresentou o réu à esse juiz substituto." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "CORRETO: 'à perita forense' = a (prep) + a (art) + perita (subst. feminino definido) → obrigatório. " +
      "A: 'à ela' = pronome pessoal → P do MVPQI proíbe crase. " +
      "B: 'à investigar' = verbo → V do MVPQI proíbe crase. " +
      "C: 'à qualquer' = pronome indefinido → I do MVPQI proíbe crase. " +
      "E: 'à esse' = pronome demonstrativo → P do MVPQI proíbe crase.",
    explanationCorrect:
      "Exato! 'à perita forense' = substantivo feminino definido → crase obrigatória. " +
      "Nas demais há violações do MVPQI: pronome pessoal, verbo, indefinido e demonstrativo.",
    explanationWrong:
      "Resposta: D. 'À perita forense' segue a regra geral (feminino definido). " +
      "MVPQI invalida os outros: A (P — pronome pessoal 'ela'), B (V — verbo 'investigar'), " +
      "C (I — indefinido 'qualquer'), E (P — demonstrativo 'esse').",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_cr_pr_q06",
    contentId: CONTENT_IDS.proibidos,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Não faço referência à nenhuma pessoa específica " +
      "neste depoimento', a crase está incorretamente empregada.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'à nenhuma' está errado: 'nenhuma' é pronome indefinido → crase proibida (I do MVPQI). " +
      "O correto é 'a nenhuma pessoa'. " +
      "Mnemônico MVPQI — I: pronomes e artigos indefinidos (nenhum/a, algum/a, qualquer, todo/a, cada, um/a) " +
      "proíbem crase antes de si.",
    explanationCorrect:
      "Correto! 'à nenhuma' viola o I do MVPQI: pronomes indefinidos proíbem crase. " +
      "Forma correta: 'a nenhuma pessoa'.",
    explanationWrong:
      "O item está CERTO. 'nenhuma' é pronome indefinido. " +
      "MVPQI — I: indefinidos como 'nenhuma', 'alguma', 'qualquer', 'toda', 'cada', 'uma' proíbem crase. " +
      "Correto: 'a nenhuma pessoa'.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — MEDIO
  {
    id: "por_cr_pr_q07",
    contentId: CONTENT_IDS.proibidos,
    statement:
      "(CESPE — Adaptada) Em qual alternativa a crase é PROIBIDA por estar diante de pronome " +
      "(P do mnemônico MVPQI)?",
    alternatives: [
      { letter: "A", text: "Referiu-se à diligência com riqueza de detalhes." },
      { letter: "B", text: "Entregou o mandado à ela própria, pessoalmente." },
      { letter: "C", text: "Assistiu à cerimônia de encerramento do curso." },
      { letter: "D", text: "Compareceu à sede do departamento às 9h." },
      { letter: "E", text: "O investigador voltou à delegacia após a diligência." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "INCORRETO: 'à ela' — 'ela' é pronome pessoal do caso reto → crase proibida (P do MVPQI). " +
      "O correto é 'entregou o mandado a ela própria'. " +
      "Nas alternativas A, C, D e E, os substantivos são femininos com artigo definido → crase obrigatória.",
    explanationCorrect:
      "Exato! 'à ela' viola o P do MVPQI. Pronomes pessoais nunca admitem crase. " +
      "Correto: 'a ela própria'.",
    explanationWrong:
      "Resposta: B. 'ela' é pronome pessoal → P do MVPQI proíbe crase. " +
      "Nos demais ('diligência', 'cerimônia', 'sede', 'delegacia') são femininos com crase obrigatória.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — MEDIO
  {
    id: "por_cr_pr_q08",
    contentId: CONTENT_IDS.proibidos,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O delegado respondeu às perguntas e encaminhou " +
      "à todos os presentes cópia do relatório', o segundo emprego da crase está INCORRETO.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'às perguntas' = correto (feminino definido plural). " +
      "'à todos' = ERRADO: 'todos' é pronome indefinido/masculino plural → crase proibida (I+M do MVPQI). " +
      "O correto é 'encaminhou a todos os presentes' (sem crase).",
    explanationCorrect:
      "Correto! 'à todos' viola o MVPQI: 'todos' é pronome indefinido masculino plural, " +
      "sendo proibido tanto pelo M (masculino) quanto pelo I (indefinido). Correto: 'a todos'.",
    explanationWrong:
      "O item está CERTO. 'à todos' é duplamente errado: M (masculino) e I (indefinido) do MVPQI. " +
      "Correto: 'encaminhou a todos os presentes'.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q09 — ME — DIFICIL
  {
    id: "por_cr_pr_q09",
    contentId: CONTENT_IDS.proibidos,
    statement:
      "(CEBRASPE — Adaptada) Identifique a frase em que a crase está CORRETAMENTE AUSENTE, " +
      "ou seja, onde a omissão do acento grave obedece ao mnemônico MVPQI.",
    alternatives: [
      { letter: "A", text: "Fomos a delegacia verificar o registro da ocorrência." },
      { letter: "B", text: "Entregou o documento a delegada sem avisar a chefia." },
      { letter: "C", text: "Começou a investigar os suspeitos desde a semana passada." },
      { letter: "D", text: "Saiu a tarde para prestar novo depoimento ao juiz." },
      { letter: "E", text: "Referiu-se a investigação sem apresentar provas concretas." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO (crase corretamente ausente): 'Começou a investigar' — 'investigar' é verbo → " +
      "V do MVPQI proíbe crase. A ausência é obrigatória. " +
      "A: falta crase em 'a delegacia' (feminino definido → deve ser 'à delegacia'). " +
      "B: falta crase em 'a delegada' (feminino definido → 'à delegada'). " +
      "D: falta crase em 'a tarde' (locução adverbial → 'à tarde'). " +
      "E: falta crase em 'a investigação' (feminino definido → 'à investigação').",
    explanationCorrect:
      "Exato! Em 'começou a investigar', a ausência de crase é obrigatória: V do MVPQI (verbo). " +
      "Nas demais, a crase está incorretamente ausente (femininos que exigem crase).",
    explanationWrong:
      "Resposta: C. 'Começou a investigar' = V do MVPQI → crase proibida e ausência correta. " +
      "Nas outras frases a crase está erroneamente ausente: " +
      "'delegacia', 'delegada', 'tarde' e 'investigação' exigem crase.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q10 — CE — DIFICIL
  {
    id: "por_cr_pr_q10",
    contentId: CONTENT_IDS.proibidos,
    statement:
      "(CESPE — Adaptada) No período 'O inspetor, ao dirigir-se a Vossa Excelência, apresentou " +
      "o laudo à comissão parlamentar e entregou cópias a cada membro presente', " +
      "a presença e ausência dos acentos graves estão todas corretas.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Análise dos três casos: " +
      "(1) 'a Vossa Excelência' — sem crase: pronome de tratamento → P do MVPQI proíbe crase. ✓ " +
      "(2) 'à comissão parlamentar' — com crase: substantivo feminino definido → obrigatória. ✓ " +
      "(3) 'a cada membro' — sem crase: 'cada' é pronome indefinido (I do MVPQI) e 'membro' é masculino (M) → proibida. ✓ " +
      "Todos os usos estão corretos.",
    explanationCorrect:
      "Correto! Os três casos estão certos: 'a Vossa Excelência' (P — pronome de tratamento), " +
      "'à comissão' (obrigatória — feminino definido), 'a cada membro' (I+M — indefinido + masculino).",
    explanationWrong:
      "O item está CERTO. Os três empregos são corretos: " +
      "'a Vossa Excelência' = P do MVPQI (sem crase); " +
      "'à comissão' = feminino definido (com crase); " +
      "'a cada membro' = I+M do MVPQI (sem crase).",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 3 — Casos Facultativos (PPN)
  // P = Pronomes possessivos femininos | P = nomes próprios de Pessoas (fem.)
  // N = "casa" e "terra" sem artigo definido (sentido genérico)
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_cr_fa_q01",
    contentId: CONTENT_IDS.facultativos,
    statement:
      "(CESPE — Adaptada) Em qual das alternativas o emprego da crase é FACULTATIVO?",
    alternatives: [
      { letter: "A", text: "Chegou à delegacia às dez horas." },
      { letter: "B", text: "Entregou o relatório à diretora do departamento." },
      { letter: "C", text: "Escreveu à/a sua companheira durante o afastamento." },
      { letter: "D", text: "Foram à reunião às pressas naquela tarde." },
      { letter: "E", text: "À noite, revisou todo o inquérito policial." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "FACULTATIVO: 'à/a sua companheira' — antes de pronome possessivo feminino ('sua') " +
      "seguido de substantivo, a crase é facultativa (P do mnemônico PPN). " +
      "Tanto 'à sua companheira' quanto 'a sua companheira' são aceitos pela norma culta. " +
      "A, B, D, E: todos são casos obrigatórios (substantivos femininos definidos, hora, locução).",
    explanationCorrect:
      "Exato! P do PPN: antes de pronome possessivo feminino ('minha', 'sua', 'nossa', 'tua', 'vossa'), " +
      "a crase é facultativa. Ambas as formas — 'à sua' e 'a sua' — são aceitas.",
    explanationWrong:
      "Resposta: C. 'à/a sua companheira' = P do PPN (possessivo → facultativo). " +
      "Nos demais casos a crase é obrigatória: femininos definidos, hora e locução adverbial.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_cr_fa_q02",
    contentId: CONTENT_IDS.facultativos,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O investigador enviou o relatório à sua superiora', " +
      "o emprego da crase é facultativo, podendo-se escrever também 'a sua superiora' sem erro.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Antes de pronome possessivo feminino ('sua') seguido de substantivo feminino, " +
      "a crase é facultativa (P do mnemônico PPN). " +
      "Ambas as formas — 'à sua superiora' (com crase) e 'a sua superiora' (sem crase) — " +
      "são aceitas pela norma culta da língua portuguesa.",
    explanationCorrect:
      "Correto! P do PPN: pronome possessivo feminino → crase facultativa. " +
      "'à sua superiora' e 'a sua superiora' são igualmente corretos.",
    explanationWrong:
      "O item está CERTO. Possessivos femininos = P do PPN = crase facultativa. " +
      "As formas 'à sua superiora' e 'a sua superiora' coexistem sem erro.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — FACIL
  {
    id: "por_cr_fa_q03",
    contentId: CONTENT_IDS.facultativos,
    statement:
      "(CESPE — Adaptada) Sobre o emprego da crase com nomes próprios femininos de pessoas " +
      "(segundo P do PPN), é correto afirmar:",
    alternatives: [
      { letter: "A", text: "A crase é sempre obrigatória antes de nomes femininos de pessoas." },
      { letter: "B", text: "A crase é sempre proibida antes de nomes próprios de pessoas." },
      { letter: "C", text: "A crase é facultativa: 'Disse à Maria' e 'Disse a Maria' são formas aceitas." },
      { letter: "D", text: "Nomes próprios nunca admitem artigo definido, logo nunca há crase." },
      { letter: "E", text: "A crase é obrigatória apenas quando o nome é de pessoa famosa." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO. Antes de nomes próprios femininos de pessoas, a crase é facultativa (P do PPN). " +
      "O falante pode usar ou não o artigo definido 'a' antes do nome, tornando a crase opcional. " +
      "Exemplos: 'Entreguei à Maria' ou 'Entreguei a Maria' — ambas corretas.",
    explanationCorrect:
      "Exato! P do PPN (nomes próprios de Pessoas femininos): crase facultativa. " +
      "'Disse à Maria' e 'Disse a Maria' são formas igualmente aceitas pela norma culta.",
    explanationWrong:
      "Resposta: C. Nomes próprios femininos de pessoas = P do PPN = crase facultativa. " +
      "Tanto com quanto sem crase é aceito. As demais afirmativas estão incorretas.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_cr_fa_q04",
    contentId: CONTENT_IDS.facultativos,
    statement:
      "(CEBRASPE — Adaptada) 'O agente voltou a casa depois do plantão, exausto.' " +
      "A ausência de crase está correta, pois 'casa', quando usada sem artigo definido " +
      "e em sentido genérico (lar), admite a forma sem crase.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'casa' em sentido genérico (= lar, domicílio, sem referência a uma casa específica) " +
      "permite a crase facultativa (N do PPN). " +
      "'Voltou a casa' e 'voltou à casa' são ambas aceitas quando 'casa' não está determinada por artigo. " +
      "Se houvesse artigo ('a casa dos pais'), a crase seria obrigatória.",
    explanationCorrect:
      "Correto! N do PPN: 'casa' sem artigo definido e em sentido genérico = crase facultativa. " +
      "Sem crase ('a casa') é aceito. Com crase ('à casa') também seria aceito.",
    explanationWrong:
      "O item está CERTO. 'Casa' em sentido genérico = N do PPN = facultativo. " +
      "A ausência de crase é aceita. Para crase obrigatória, seria necessário artigo definido " +
      "('voltou à casa dos pais').",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_cr_fa_q05",
    contentId: CONTENT_IDS.facultativos,
    statement:
      "(CESPE — Adaptada) Qual alternativa apresenta caso de crase FACULTATIVA?",
    alternatives: [
      { letter: "A", text: "Às vezes, o delegado chegava tarde à delegacia." },
      { letter: "B", text: "Referiu-se à investigação em andamento." },
      { letter: "C", text: "Escreveu a Joana / Escreveu à Joana pedindo ajuda." },
      { letter: "D", text: "Chegou à madrugada, exausto após o turno." },
      { letter: "E", text: "À meia-noite, assinou o depoimento e foi embora." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "FACULTATIVO: 'Escreveu a Joana' ou 'Escreveu à Joana' — nome próprio feminino de pessoa " +
      "(P do PPN). Ambas as formas são aceitas. " +
      "A e B: locuções adverbiais e substantivos femininos definidos → obrigatório. " +
      "D: 'madrugada' = feminino definido → obrigatório. " +
      "E: hora determinada → obrigatório.",
    explanationCorrect:
      "Exato! 'Joana' é nome próprio feminino de pessoa = P do PPN = facultativo. " +
      "Tanto 'a Joana' quanto 'à Joana' são aceitos.",
    explanationWrong:
      "Resposta: C. Nome próprio feminino de pessoa = P do PPN = crase facultativa. " +
      "Nos demais casos a crase é obrigatória (locuções, femininos definidos, hora).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_cr_fa_q06",
    contentId: CONTENT_IDS.facultativos,
    statement:
      "(CEBRASPE — Adaptada) 'O agente entregou o laudo à sua chefe imediata.' " +
      "O uso da crase é facultativo, sendo correto também escrever 'a sua chefe'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'sua' é pronome possessivo feminino. Antes de possessivo + substantivo feminino, " +
      "a crase é facultativa (P do PPN). " +
      "Tanto 'à sua chefe' quanto 'a sua chefe' são formas aceitas pela norma culta.",
    explanationCorrect:
      "Correto! P do PPN: 'sua' (possessivo) + 'chefe' (feminino) = facultativo. " +
      "'À sua chefe' e 'a sua chefe' coexistem sem erro.",
    explanationWrong:
      "O item está CERTO. Possessivo feminino ('sua') = P do PPN = facultativo. " +
      "Com ou sem crase, ambas as formas são aceitas.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — MEDIO
  {
    id: "por_cr_fa_q07",
    contentId: CONTENT_IDS.facultativos,
    statement:
      "(CESPE — Adaptada) Em qual das alternativas a presença E a ausência da crase " +
      "são AMBAS aceitas pela norma culta (crase facultativa)?",
    alternatives: [
      { letter: "A", text: "Fui à escola / Fui a escola." },
      { letter: "B", text: "À noite, saiu / A noite, saiu." },
      { letter: "C", text: "Entregou à sua relatora o doc. / Entregou a sua relatora o doc." },
      { letter: "D", text: "Chegou à meia-noite / Chegou a meia-noite." },
      { letter: "E", text: "Referiu-se à testemunha / Referiu-se a testemunha." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "FACULTATIVO: 'à/a sua relatora' — possessivo 'sua' + feminino → P do PPN. Ambas aceitas. " +
      "A: 'à escola' é obrigatória (feminino definido). " +
      "B: 'à noite' é obrigatória (locução adverbial feminina). " +
      "D: 'à meia-noite' é obrigatória (hora determinada). " +
      "E: 'à testemunha' é obrigatória (feminino definido).",
    explanationCorrect:
      "Exato! 'à/a sua relatora' = P do PPN (possessivo feminino = facultativo). " +
      "Ambas as formas coexistem sem erro.",
    explanationWrong:
      "Resposta: C. 'Sua relatora' = possessivo + feminino = P do PPN = facultativo. " +
      "Nos demais casos só a forma com crase é correta (obrigatórias).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_cr_fa_q08",
    contentId: CONTENT_IDS.facultativos,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Tanto à minha relatora quanto à sua assessora foram " +
      "comunicadas da decisão', em ambos os casos a crase é facultativa.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'à/a minha relatora' (possessivo 'minha' + subst. feminino) = P do PPN → facultativo. " +
      "'à/a sua assessora' (possessivo 'sua' + subst. feminino) = P do PPN → facultativo. " +
      "Em ambos os casos, a presença ou ausência do acento grave é aceita pela norma culta.",
    explanationCorrect:
      "Correto! Dois casos de P do PPN: possessivos femininos ('minha' e 'sua') + substantivos femininos. " +
      "Ambas as crases são facultativas.",
    explanationWrong:
      "O item está CERTO. 'minha relatora' e 'sua assessora' = possessivos femininos + femininos = " +
      "P do PPN em ambos os casos. Facultativo nos dois.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // Q09 — ME — DIFICIL
  {
    id: "por_cr_fa_q09",
    contentId: CONTENT_IDS.facultativos,
    statement:
      "(CESPE — Adaptada) Assinale a opção em que a crase é OBRIGATÓRIA, " +
      "diferentemente dos demais casos que apresentam crase facultativa segundo o PPN.",
    alternatives: [
      { letter: "A", text: "Entregou o laudo à/a sua supervisora." },
      { letter: "B", text: "Escreveu à/a Carolina para avisar sobre o prazo." },
      { letter: "C", text: "O agente voltou à/a casa depois do plantão." },
      { letter: "D", text: "Referiu-se à diretora do departamento de ensino." },
      { letter: "E", text: "Comunicou à/a nossa coordenadora a decisão final." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "OBRIGATÓRIO: 'à diretora do departamento' — sem pronome possessivo, sem nome próprio de pessoa, " +
      "sem sentido genérico. É simplesmente substantivo feminino com artigo definido → obrigatória. " +
      "A: possessivo 'sua' → P do PPN (facultativo). " +
      "B: nome próprio feminino 'Carolina' → P do PPN (facultativo). " +
      "C: 'casa' em sentido genérico → N do PPN (facultativo). " +
      "E: possessivo 'nossa' → P do PPN (facultativo).",
    explanationCorrect:
      "Exato! 'à diretora do departamento' = substantivo feminino definido sem possessivo → obrigatória. " +
      "Os demais enquadram-se no PPN e são facultativos.",
    explanationWrong:
      "Resposta: D. 'diretora do departamento' = feminino definido puro → obrigatória. " +
      "A (possessivo 'sua'), B (nome próprio 'Carolina'), C ('casa' genérico) e E (possessivo 'nossa') " +
      "são todos casos do PPN = facultativos.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q10 — CE — DIFICIL
  {
    id: "por_cr_fa_q10",
    contentId: CONTENT_IDS.facultativos,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O promotor dirigiu-se a ela e depois se reportou " +
      "à sua chefe e à delegada responsável', os três empregos da preposição 'a' " +
      "(com e sem crase) estão todos corretos.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Análise dos três casos: " +
      "(1) 'a ela' — sem crase: 'ela' é pronome pessoal → P do MVPQI proíbe crase. ✓ " +
      "(2) 'à sua chefe' — com crase: possessivo 'sua' + feminino → P do PPN (facultativo, forma com crase usada). ✓ " +
      "(3) 'à delegada responsável' — com crase: substantivo feminino definido → obrigatória. ✓ " +
      "Todos os três empregos estão corretos.",
    explanationCorrect:
      "Correto! 'a ela' = MVPQI (pronome pessoal, sem crase); " +
      "'à sua chefe' = PPN (possessivo, com crase facultativa usada); " +
      "'à delegada' = obrigatória. Todos corretos.",
    explanationWrong:
      "O item está CERTO. Os três estão corretos: " +
      "'a ela' (MVPQI — pronome pessoal, sem crase), " +
      "'à sua chefe' (PPN — possessivo, facultativa), " +
      "'à delegada' (obrigatória — feminino definido).",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 4 — Crase com Nomes de Cidades
  // Regra: crase obrigatória se a cidade usa artigo definido 'a'
  //        facultativa se o uso do artigo é variável (ex: Brasília)
  //        proibida se a cidade não usa artigo (Paris, Madri, Roma)
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_cr_ci_q01",
    contentId: CONTENT_IDS.cidades,
    statement:
      "(CESPE — Adaptada) Sobre o uso da crase com nomes de cidades, qual afirmativa está CORRETA?",
    alternatives: [
      { letter: "A", text: "A crase é sempre proibida antes de nomes de cidades." },
      { letter: "B", text: "A crase é sempre obrigatória antes de nomes de cidades femininos." },
      { letter: "C", text: "A crase é obrigatória quando o nome da cidade normalmente recebe o artigo definido feminino 'a'." },
      { letter: "D", text: "A crase é facultativa em todos os nomes de cidades, sem exceção." },
      { letter: "E", text: "Nomes de cidades nunca recebem artigo, portanto nunca há crase." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO. A regra para cidades: " +
      "→ Crase OBRIGATÓRIA: cidades que normalmente usam o artigo 'a' (ex.: a Lisboa, a Haia → 'foi à Lisboa', 'foi à Haia'). " +
      "→ Crase FACULTATIVA: cidades com uso variável do artigo (ex.: Brasília). " +
      "→ Crase PROIBIDA: cidades sem artigo definido (ex.: Paris, Madri, Roma → 'foi a Paris'). " +
      "O teste prático: diga a frase com a cidade na posição de sujeito — se usar 'a' antes, há crase.",
    explanationCorrect:
      "Exato! A crase com cidades depende do artigo: se a cidade usa 'a' (a Lisboa, a Haia), " +
      "há crase obrigatória. Se não usa artigo (Paris, Madri), a crase é proibida.",
    explanationWrong:
      "Resposta: C. A crase com nomes de cidades segue a mesma lógica geral: " +
      "preposição 'a' + artigo 'a' = crase. Se a cidade não usa artigo, não há crase.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_cr_ci_q02",
    contentId: CONTENT_IDS.cidades,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O delegado viajou a Paris para participar da conferência " +
      "sobre segurança internacional', a ausência de crase antes de 'Paris' está correta.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Paris' em português padrão não é precedida de artigo definido feminino. " +
      "Diz-se 'Fui a Paris', 'Cheguei de Paris' — sem artigo. " +
      "Portanto, não há fusão de preposição + artigo, e a crase é proibida. " +
      "Correto: 'viajou a Paris' (sem crase).",
    explanationCorrect:
      "Correto! Paris não usa artigo definido em português → sem crase. " +
      "'Viajou a Paris' é a forma correta.",
    explanationWrong:
      "O item está CERTO. 'Paris' não usa artigo definido 'a' em português. " +
      "Sem artigo, não há fusão, portanto crase é proibida. Correto: 'a Paris' sem acento grave.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — FACIL
  {
    id: "por_cr_ci_q03",
    contentId: CONTENT_IDS.cidades,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que a crase antes do nome de cidade " +
      "é OBRIGATÓRIA.",
    alternatives: [
      { letter: "A", text: "Fui a Roma conhecer o Vaticano." },
      { letter: "B", text: "Chegou a Brasília no final da tarde." },
      { letter: "C", text: "O investigador foi à Haia depor no Tribunal Internacional." },
      { letter: "D", text: "Viajou a Paris para a conferência de segurança." },
      { letter: "E", text: "Voltou a Londres depois de três anos de missão." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "OBRIGATÓRIO: 'à Haia' — em português, diz-se 'a Haia' (com artigo definido feminino). " +
      "Preposição 'a' + artigo 'a' = crase 'à'. " +
      "A: Roma — normalmente sem artigo → sem crase. " +
      "B: Brasília — uso facultativo do artigo → facultativo (sem crase também é aceito). " +
      "D: Paris — sem artigo → sem crase. " +
      "E: Londres — normalmente sem artigo feminino → sem crase.",
    explanationCorrect:
      "Exato! 'A Haia' usa artigo definido 'a' em português → preposição 'a' + artigo 'a' = 'à Haia'. Obrigatória.",
    explanationWrong:
      "Resposta: C. 'A Haia' (artigo definido) → crase obrigatória. " +
      "Roma, Paris e Londres não usam artigo → sem crase. Brasília → facultativo.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_cr_ci_q04",
    contentId: CONTENT_IDS.cidades,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O perito foi à Lisboa apresentar os laudos periciais', " +
      "o emprego da crase é obrigatório porque 'Lisboa' é precedida do artigo definido feminino 'a'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Lisboa' em português é normalmente precedida de artigo definido feminino ('a Lisboa'). " +
      "Quando há preposição 'a' antes de 'Lisboa', ocorre a fusão: a (prep) + a (art) = 'à Lisboa'. " +
      "Portanto, a crase é obrigatória.",
    explanationCorrect:
      "Correto! 'a Lisboa' usa artigo definido → preposição 'a' + artigo 'a' = crase obrigatória. " +
      "'À Lisboa' é a forma correta.",
    explanationWrong:
      "O item está CERTO. 'Lisboa' usa artigo 'a' em português ('a Lisboa'). " +
      "Com preposição 'a' antes: a + a = à. Crase obrigatória.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_cr_ci_q05",
    contentId: CONTENT_IDS.cidades,
    statement:
      "(CESPE — Adaptada) Em qual das alternativas o emprego da crase com nome de cidade " +
      "é FACULTATIVO?",
    alternatives: [
      { letter: "A", text: "Fui à Lisboa participar da conferência." },
      { letter: "B", text: "O agente foi a Paris investigar o caso." },
      { letter: "C", text: "Chegou a/à Brasília na madrugada." },
      { letter: "D", text: "Viajou à Haia para depor." },
      { letter: "E", text: "Retornou a Madri após as investigações." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "FACULTATIVO: 'Brasília' — o uso do artigo definido antes de Brasília é variável no português brasileiro. " +
      "Parte dos falantes diz 'a Brasília' (com artigo) e parte diz apenas 'Brasília' (sem artigo). " +
      "Por isso, tanto 'a Brasília' quanto 'à Brasília' são aceitos em contextos formais. " +
      "A: Lisboa (artigo fixo → obrigatória). D: Haia (artigo fixo → obrigatória). " +
      "B e E: sem artigo → proibida.",
    explanationCorrect:
      "Exato! Brasília = facultativo (uso variável do artigo). " +
      "Lisboa e Haia = obrigatória (artigo fixo). Paris e Madri = proibida (sem artigo).",
    explanationWrong:
      "Resposta: C. Brasília tem uso variável do artigo no português brasileiro → facultativo. " +
      "Lisboa e Haia → obrigatória. Paris e Madri → proibida.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_cr_ci_q06",
    contentId: CONTENT_IDS.cidades,
    statement:
      "(CEBRASPE — Adaptada) A frase 'O diplomata foi à Haia resolver a questão do tribunal' " +
      "apresenta crase obrigatória e correta antes de 'Haia'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'A Haia' é o nome da cidade neerlandesa (The Hague), e em português usa-se " +
      "o artigo definido feminino 'a' antes do nome ('a Haia'). " +
      "Com a preposição 'a' exigida pelo verbo 'ir a': a (prep) + a (art) = 'à Haia'. " +
      "Crase obrigatória e correta.",
    explanationCorrect:
      "Correto! 'A Haia' usa artigo 'a' → crase obrigatória. 'À Haia' está correto.",
    explanationWrong:
      "O item está CERTO. 'A Haia' = cidade com artigo definido feminino fixo. " +
      "Preposição 'a' + artigo 'a' = crase obrigatória.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "por_cr_ci_q07",
    contentId: CONTENT_IDS.cidades,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que TODOS os empregos da crase " +
      "com nomes de cidades estão corretos.",
    alternatives: [
      { letter: "A", text: "Fui à Paris e depois à Roma em missão oficial." },
      { letter: "B", text: "Viajei à Lisboa e depois a Brasília para o congresso." },
      { letter: "C", text: "Chegou à Nova York e à Chicago para a conferência." },
      { letter: "D", text: "Foi à Haia e à Paris tratar do caso no tribunal." },
      { letter: "E", text: "Voltou à Madri depois do depoimento no fórum." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: Alternativa B — 'à Lisboa' (obrigatória: artigo fixo) e 'a Brasília' " +
      "(correto: sem crase ou facultativo, sem artigo obrigatório). Ambos os usos corretos. " +
      "A: 'à Paris' e 'à Roma' — Paris e Roma não usam artigo → crase errada. " +
      "C: 'à Nova York' e 'à Chicago' — não usam artigo em pt-br → crase errada. " +
      "D: 'à Haia' (correto) + 'à Paris' (errado — Paris sem artigo). " +
      "E: 'à Madri' — Madri não usa artigo → crase errada.",
    explanationCorrect:
      "Exato! 'à Lisboa' (artigo fixo = obrigatória) + 'a Brasília' (sem artigo obrigatório = correto sem crase). " +
      "Nas demais há pelo menos uma cidade que não usa artigo com crase indevida.",
    explanationWrong:
      "Resposta: B. 'à Lisboa' = obrigatória (artigo fixo); 'a Brasília' = correto (facultativo/sem artigo). " +
      "Paris, Roma, Madri, Nova York e Chicago não usam artigo → crase é errada nessas cidades.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_cr_ci_q08",
    contentId: CONTENT_IDS.cidades,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Prefiro à Haia a Paris para sediar o tribunal', " +
      "a presença da crase antes de 'Haia' e a ausência antes de 'Paris' estão ambas corretas.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'à Haia' — A Haia usa artigo definido feminino → crase obrigatória. ✓ " +
      "'a Paris' — Paris não usa artigo definido em português → crase proibida (correto sem crase). ✓ " +
      "Em contexto comparativo ('Prefiro X a Y'), a preposição 'a' aparece antes de ambas, " +
      "mas só a que tem artigo leva crase.",
    explanationCorrect:
      "Correto! 'à Haia' (artigo fixo = crase obrigatória) + 'a Paris' (sem artigo = sem crase). " +
      "Ambos os empregos estão corretos.",
    explanationWrong:
      "O item está CERTO. Haia tem artigo → crase. Paris não tem artigo → sem crase. " +
      "Em construções comparativas, cada cidade segue sua própria regra de artigo.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // Q09 — ME — DIFICIL
  {
    id: "por_cr_ci_q09",
    contentId: CONTENT_IDS.cidades,
    statement:
      "(CESPE — Adaptada) Qual das frases apresenta emprego INCORRETO da crase " +
      "com nome de cidade?",
    alternatives: [
      { letter: "A", text: "O investigador foi à Lisboa apresentar o relatório." },
      { letter: "B", text: "Chegou a Paris no dia seguinte à operação." },
      { letter: "C", text: "Viajou à Haia para depor no Tribunal Internacional." },
      { letter: "D", text: "Retornou a Brasília após a missão no exterior." },
      { letter: "E", text: "Partiu à Madrid pela manhã para a conferência." },
    ],
    correctAnswer: "E",
    correctOption: 4,
    explanation:
      "INCORRETO: 'à Madrid' — 'Madri/Madrid' não usa artigo definido feminino em português. " +
      "O correto é 'partiu a Madrid' (sem crase). " +
      "A: 'à Lisboa' — correto (Lisboa usa artigo). " +
      "B: 'a Paris' — correto (Paris sem artigo). " +
      "C: 'à Haia' — correto (A Haia usa artigo). " +
      "D: 'a Brasília' — correto ou facultativo.",
    explanationCorrect:
      "Exato! 'à Madrid' está errado: Madri não usa artigo em português. " +
      "Correto: 'a Madrid' sem crase.",
    explanationWrong:
      "Resposta: E. 'Madri/Madrid' não usa artigo definido feminino → crase proibida. " +
      "Correto: 'partiu a Madrid'. Os demais casos (Lisboa, Paris, Haia, Brasília) estão corretos.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q10 — CE — DIFICIL
  {
    id: "por_cr_ci_q10",
    contentId: CONTENT_IDS.cidades,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Em missão diplomática, o investigador foi à Lisboa, " +
      "passou a Paris e chegou a Brasília', todos os três usos da preposição 'a' " +
      "(com e sem crase) estão corretos.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Análise: " +
      "(1) 'à Lisboa' — Lisboa usa artigo 'a' → crase obrigatória. ✓ " +
      "(2) 'a Paris' — Paris não usa artigo → sem crase. ✓ " +
      "(3) 'a Brasília' — Brasília sem artigo obrigatório; sem crase é aceito (facultativo). ✓ " +
      "Todos os três empregos são corretos.",
    explanationCorrect:
      "Correto! 'à Lisboa' (artigo fixo = obrigatória), 'a Paris' (sem artigo = proibida/correto), " +
      "'a Brasília' (facultativo, sem crase = aceito). Os três estão certos.",
    explanationWrong:
      "O item está CERTO. Lisboa → crase obrigatória; Paris → sem crase; Brasília → facultativo (sem crase aceito). " +
      "Cada cidade segue sua própria regra de artigo.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 5 — Crase em Locuções Prepositivas e Adverbiais
  // Locuções terminadas em 'a' feminino exigem crase obrigatória
  // Ex: à beira de, à frente de, à luz de, à margem de, à custa de,
  //     à semelhança de, à espera de, às pressas, à direita, às vezes
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_cr_lo_q01",
    contentId: CONTENT_IDS.locucoes,
    statement:
      "(CESPE — Adaptada) Em qual das alternativas a locução exige crase obrigatória?",
    alternatives: [
      { letter: "A", text: "Por cima de tudo, a verdade prevaleceu no julgamento." },
      { letter: "B", text: "Em frente ao tribunal, havia manifestantes." },
      { letter: "C", text: "À luz da legislação vigente, o réu foi condenado." },
      { letter: "D", text: "Por trás da delegacia, encontraram novas evidências." },
      { letter: "E", text: "Por meio de ofício, comunicou a decisão ao réu." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'à luz de' = locução prepositiva terminada em 'a' feminino. " +
      "a (preposição) + a (artigo) + luz (feminino) = 'à luz'. Obrigatória. " +
      "A: 'por cima de' — masculino, sem crase. " +
      "B: 'em frente a' — sem artigo feminino aqui. " +
      "D: 'por trás de' — sem artigo feminino aqui. " +
      "E: 'por meio de' — masculino, sem crase.",
    explanationCorrect:
      "Exato! 'à luz de' é locução prepositiva feminina: a + a + luz = crase obrigatória. " +
      "Sempre que a locução termina em substantivo feminino com artigo definido, há crase.",
    explanationWrong:
      "Resposta: C. 'À luz da legislação' = a (prep) + a (art) + luz (fem) = crase obrigatória. " +
      "As demais locuções são masculinas ou não contêm artigo feminino definido.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_cr_lo_q02",
    contentId: CONTENT_IDS.locucoes,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O réu ficou à mercê da decisão judicial', " +
      "o emprego da crase em 'à mercê' é obrigatório.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'à mercê de' é locução prepositiva: a (preposição) + a (artigo definido) + mercê (feminino). " +
      "Fusão obrigatória = 'à mercê'. " +
      "Locuções prepositivas terminadas em substantivo feminino com artigo definido exigem crase.",
    explanationCorrect:
      "Correto! 'à mercê de' = a + a + mercê (fem) = crase obrigatória. " +
      "Regra: locuções prepositivas femininas com artigo definido sempre levam crase.",
    explanationWrong:
      "O item está CERTO. 'mercê' é substantivo feminino com artigo 'a'. " +
      "Locução prepositiva 'à mercê de': a (prep) + a (art) + mercê = crase obrigatória.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — FACIL
  {
    id: "por_cr_lo_q03",
    contentId: CONTENT_IDS.locucoes,
    statement:
      "(CESPE — Adaptada) Qual das locuções abaixo SEMPRE exige crase?",
    alternatives: [
      { letter: "A", text: "por cima de" },
      { letter: "B", text: "em vez de" },
      { letter: "C", text: "à custa de" },
      { letter: "D", text: "antes de" },
      { letter: "E", text: "apesar de" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'à custa de' = a (preposição) + a (artigo) + custa (feminino) = crase obrigatória. " +
      "Exemplos: 'à custa de muito esforço', 'às custas do réu'. " +
      "A: 'por cima de' — 'cima' pode ser masculino/neutro, preposição não é 'a'. " +
      "B: 'em vez de' — preposição 'em', não 'a'. " +
      "D: 'antes de' — preposição 'antes', não 'a'. " +
      "E: 'apesar de' — preposição 'de', não 'a'.",
    explanationCorrect:
      "Exato! 'à custa de' é locução prepositiva feminina com artigo definido: a + a + custa = crase. " +
      "Sempre obrigatória.",
    explanationWrong:
      "Resposta: C. 'À custa de' = locução prepositiva terminada em 'a' feminino = crase obrigatória. " +
      "As demais não usam a preposição 'a' para iniciar a locução.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_cr_lo_q04",
    contentId: CONTENT_IDS.locucoes,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O agente atuou à margem da lei durante toda a operação', " +
      "o emprego da crase na locução 'à margem' está correto e é obrigatório.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'à margem de' = locução prepositiva: a (preposição) + a (artigo) + margem (feminino). " +
      "Fusão obrigatória = 'à margem'. " +
      "Outros exemplos do mesmo padrão: à beira de, à frente de, à luz de, à custa de.",
    explanationCorrect:
      "Correto! 'à margem de' = a + a + margem (fem) = crase obrigatória. " +
      "Locuções prepositivas terminadas em feminino com artigo definido sempre exigem crase.",
    explanationWrong:
      "O item está CERTO. 'margem' é feminino com artigo 'a' na locução. " +
      "Preposição 'a' + artigo 'a' = crase. Obrigatória em 'à margem de'.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_cr_lo_q05",
    contentId: CONTENT_IDS.locucoes,
    statement:
      "(CESPE — Adaptada) Identifique a alternativa em que a crase está INCORRETAMENTE " +
      "empregada na locução.",
    alternatives: [
      { letter: "A", text: "À frente da delegacia havia viaturas estacionadas." },
      { letter: "B", text: "À beira do colapso, o sistema de segurança falhou." },
      { letter: "C", text: "À custa de muito esforço, a equipe concluiu a investigação." },
      { letter: "D", text: "À base de evidências sólidas, o réu foi condenado." },
      { letter: "E", text: "À cargo do inspetor, estava a investigação do caso." },
    ],
    correctAnswer: "E",
    correctOption: 4,
    explanation:
      "INCORRETO: 'à cargo' — 'cargo' é substantivo MASCULINO. " +
      "A locução é 'a cargo de' (preposição + substantivo masculino, sem artigo feminino). " +
      "Correto: 'A cargo do inspetor estava a investigação' (sem crase). " +
      "A, B, C e D: todas são locuções prepositivas femininas com crase obrigatória correta.",
    explanationCorrect:
      "Exato! 'cargo' é masculino → locução 'a cargo de' não tem artigo feminino. " +
      "Crase é proibida. Correto: 'a cargo do inspetor' (sem acento grave).",
    explanationWrong:
      "Resposta: E. 'cargo' é masculino → 'a cargo de' sem crase. " +
      "Nas demais (à frente, à beira, à custa, à base) os substantivos são femininos → crase correta.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_cr_lo_q06",
    contentId: CONTENT_IDS.locucoes,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'À semelhança do que foi decidido no caso anterior, " +
      "o juiz aplicou a mesma pena ao réu', o emprego da crase em 'à semelhança' está correto.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'à semelhança de' = locução prepositiva: a (preposição) + a (artigo) + semelhança (feminino). " +
      "Crase obrigatória. " +
      "A locução 'à semelhança de' é muito usada em textos formais e jurídicos — " +
      "sempre exige o acento grave.",
    explanationCorrect:
      "Correto! 'à semelhança de' = a + a + semelhança (fem) = crase obrigatória. " +
      "Locução prepositiva feminina com artigo definido.",
    explanationWrong:
      "O item está CERTO. 'semelhança' é feminina, e a locução 'à semelhança de' = a (prep) + a (art) = crase. " +
      "Obrigatória em toda locução prepositiva terminada em substantivo feminino com artigo.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — MEDIO
  {
    id: "por_cr_lo_q07",
    contentId: CONTENT_IDS.locucoes,
    statement:
      "(CESPE — Adaptada) Em qual alternativa há locução adverbial que EXIGE crase?",
    alternatives: [
      { letter: "A", text: "O réu saiu a pé da audiência, sem escolta." },
      { letter: "B", text: "Trabalhou a tempo de evitar o erro no laudo." },
      { letter: "C", text: "Falou às pressas antes de a sentença ser proferida." },
      { letter: "D", text: "Resolveu o caso a contento, sem maiores problemas." },
      { letter: "E", text: "Atuou a bordo do navio durante toda a operação." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'às pressas' = a (preposição) + as (artigo plural feminino) + pressas (feminino plural). " +
      "Locução adverbial feminina → crase obrigatória. " +
      "A: 'a pé' — 'pé' é masculino → sem crase. " +
      "B: 'a tempo' — sem artigo definido feminino → sem crase. " +
      "D: 'a contento' — 'contento' é masculino → sem crase. " +
      "E: 'a bordo' — 'bordo' é masculino → sem crase.",
    explanationCorrect:
      "Exato! 'às pressas' = a + as + pressas (fem pl) = crase obrigatória. " +
      "Locução adverbial feminina plural.",
    explanationWrong:
      "Resposta: C. 'Às pressas' = locução adverbial feminina (a + as + pressas). Crase obrigatória. " +
      "As demais locuções são masculinas ou não têm artigo definido feminino.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_cr_lo_q08",
    contentId: CONTENT_IDS.locucoes,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O inspetor, à espera do resultado, permaneceu " +
      "à disposição da chefia durante toda a noite', os dois empregos da crase " +
      "estão corretos e são obrigatórios.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Dois casos de crase obrigatória em locuções: " +
      "(1) 'à espera de' = a + a + espera (feminino) → obrigatória. ✓ " +
      "(2) 'à disposição de' = a + a + disposição (feminino) → obrigatória. ✓ " +
      "Ambas são locuções prepositivas terminadas em substantivo feminino com artigo definido.",
    explanationCorrect:
      "Correto! 'à espera de' e 'à disposição de' são locuções prepositivas femininas. " +
      "a + a + espera/disposição = crase obrigatória nos dois casos.",
    explanationWrong:
      "O item está CERTO. 'à espera de' (a+a+espera, fem) e 'à disposição de' (a+a+disposição, fem): " +
      "ambas as locuções são femininas com artigo definido = crase obrigatória.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // Q09 — ME — DIFICIL
  {
    id: "por_cr_lo_q09",
    contentId: CONTENT_IDS.locucoes,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que TODOS os empregos da crase " +
      "nas locuções estão corretos.",
    alternatives: [
      { letter: "A", text: "À luz da lei e à cargo do delegado, o caso avançou." },
      { letter: "B", text: "À beira do precipício e às pressas, o agente tomou a decisão." },
      { letter: "C", text: "À cima e à frente da equipe, o diretor anunciou os resultados." },
      { letter: "D", text: "À mercê e à bordo do navio, os agentes esperavam ordens." },
      { letter: "E", text: "À moda antiga e à cargo do chefe, a investigação transcorreu." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: Alternativa B — 'à beira do precipício' (à beira de = fem → correto) e " +
      "'às pressas' (locução adverbial feminina → correto). Ambas obrigatórias e corretas. " +
      "A e E: 'à cargo' — cargo é masculino → crase errada. " +
      "C: 'à cima' — 'por cima' não inicia com 'a'; 'à cima' não é locução padrão. " +
      "D: 'à bordo' — 'bordo' é masculino → 'a bordo' sem crase.",
    explanationCorrect:
      "Exato! 'à beira de' (fem) + 'às pressas' (fem) = ambas corretas. " +
      "Nas demais há pelo menos uma crase indevida (masculinos: cargo, bordo).",
    explanationWrong:
      "Resposta: B. 'À beira do precipício' e 'às pressas' são locuções femininas com crase correta. " +
      "Nas outras opções há erros: 'à cargo' (cargo = masculino) e 'à bordo' (bordo = masculino).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q10 — CE — DIFICIL
  {
    id: "por_cr_lo_q10",
    contentId: CONTENT_IDS.locucoes,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O delegado, à frente da operação, atuou à luz do " +
      "código de processo penal, às vezes contrariando às ordens superiores', " +
      "todos os empregos da crase estão corretos.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. Três das crases estão corretas, mas a última não: " +
      "'à frente da operação' (locução feminina → ✓), " +
      "'à luz do código' (locução feminina → ✓), " +
      "'às vezes' (locução adverbial feminina → ✓), " +
      "'às ordens' — ERRADO: o verbo 'contrariar' é transitivo direto; " +
      "não exige preposição 'a' antes do complemento. " +
      "Correto: 'contrariando as ordens' (sem crase — não há preposição 'a' aqui).",
    explanationCorrect:
      "Correto! O item está ERRADO. 'contrariando às ordens' está errado: " +
      "'contrariar' não exige preposição 'a' → o 'as' é artigo, não preposição+artigo. " +
      "Correto: 'contrariando as ordens' (sem crase).",
    explanationWrong:
      "O item está ERRADO. 'contrariando às ordens' é incorreto: " +
      "o verbo 'contrariar' é transitivo direto (sem preposição), portanto não há crase. " +
      "Correto: 'contrariando as ordens'. As outras três crases ('à frente', 'à luz', 'às vezes') estão corretas.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
];

// ─── RUNNER ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Seed R36 — Densificação: Português — Crase (50 questões) ===\n");

  // 1. Verificar se os átomos existem e coletar subjectId/topicId do primeiro
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
      "Nenhum átomo de crase encontrado. Verifique se os IDs estão corretos:\n" +
      JSON.stringify(CONTENT_IDS, null, 2)
    );
  }

  console.log(`\nSubject: ${subjectId}`);
  console.log(`Topic:   ${topicId}`);

  // 2. Inserir Questões
  console.log("\n--- Inserindo Questões ---");
  let inseridos = 0;
  let pulados   = 0;

  for (const q of questions) {
    // Verificar se o contentId existe
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

  console.log(`\n=== R36 concluído ===`);
  console.log(`  Questões inseridas : ${inseridos}`);
  console.log(`  Puladas (duplicata): ${pulados}`);
  console.log(`  Total processado   : ${questions.length}`);
  console.log(`\n  Distribuição por átomo:`);
  console.log(`    Obrigatórios (SLAH)  : 10 questões → ${CONTENT_IDS.obrigatorios}`);
  console.log(`    Proibidos (MVPQI)    : 10 questões → ${CONTENT_IDS.proibidos}`);
  console.log(`    Facultativos (PPN)   : 10 questões → ${CONTENT_IDS.facultativos}`);
  console.log(`    Nomes de Cidades     : 10 questões → ${CONTENT_IDS.cidades}`);
  console.log(`    Locuções Prep/Adverb : 10 questões → ${CONTENT_IDS.locucoes}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("ERRO no seed R36:", err);
  process.exit(1);
});
