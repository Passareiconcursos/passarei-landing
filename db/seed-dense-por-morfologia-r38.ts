/**
 * Seed R38 — Densificação: Português — Morfologia / Classes de Palavras
 * Modo: DENSIFICAÇÃO — apenas questões; átomos de conteúdo já existem no banco.
 *
 * Átomos-alvo (6 átomos × 8 questões = 48 questões):
 *   ct_mm8iixgaehs7ru  — Adjetivo e Artigo: Funções Caracterizadoras e Determinantes em Prova
 *   ct_mm8iixuzgm16cc  — Advérbio: Circunstâncias, Invariabilidade e Pegadinhas de Prova
 *   ct_mm3zcfj9uq7uuy  — Conjunções Integrantes: QUE e SE Substantivos
 *   ct_mm8iiyob9qb2cn  — Mapa das 10 Classes de Palavras: Variáveis vs Invariáveis e Funções
 *   ct_mm8iiwmrs8buxt  — Substantivo: Classificações e Flexões em Provas Policiais
 *   ct_mm8iix1jz54oqv  — Verbo: Estrutura, Flexões e as Vozes Verbais em Provas Policiais
 *
 * Execução: git pull && npx tsx db/seed-dense-por-morfologia-r38.ts
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

const CONTENT_IDS = {
  adjetivoArtigo:       "ct_mm8iixgaehs7ru",
  adverbio:             "ct_mm8iixuzgm16cc",
  conjuncoesIntegrantes:"ct_mm3zcfj9uq7uuy",
  classesPalavras:      "ct_mm8iiyob9qb2cn",
  substantivo:          "ct_mm8iiwmrs8buxt",
  verbo:                "ct_mm8iix1jz54oqv",
};

// ─── QUESTÕES ─────────────────────────────────────────────────────────────────

const questions = [

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 1 — Adjetivo e Artigo: Funções Caracterizadoras e Determinantes
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_mo_aa_q01",
    contentId: CONTENT_IDS.adjetivoArtigo,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que a palavra sublinhada exerce " +
      "função de ADJETIVO, caracterizando um substantivo.",
    alternatives: [
      { letter: "A", text: "O _policial_ chegou à cena do crime rapidamente." },
      { letter: "B", text: "A investigação _detalhada_ revelou novas evidências." },
      { letter: "C", text: "Ele _correu_ para socorrer as vítimas do acidente." },
      { letter: "D", text: "A _delegacia_ ficava no centro da cidade." },
      { letter: "E", text: "O agente _dormiu_ durante o plantão noturno." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'detalhada' é adjetivo — qualifica o substantivo 'investigação', " +
      "indicando característica. Concorda em gênero (feminino) e número (singular) com o substantivo. " +
      "A e D: 'policial' e 'delegacia' são substantivos. " +
      "C e E: 'correu' e 'dormiu' são verbos.",
    explanationCorrect:
      "Exato! 'Detalhada' qualifica o substantivo 'investigação', concordando em gênero e número. " +
      "Essa é a função prototípica do adjetivo: caracterizar o substantivo.",
    explanationWrong:
      "Resposta: B. 'Detalhada' é adjetivo que qualifica 'investigação'. " +
      "Adjetivos concordam com o substantivo em gênero e número e exercem função caracterizadora.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_mo_aa_q02",
    contentId: CONTENT_IDS.adjetivoArtigo,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Um suspeito foi detido após uma denúncia anônima', " +
      "os artigos 'um' e 'uma' são indefinidos e indicam que os seres referidos " +
      "não foram determinados anteriormente no discurso.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Um suspeito' e 'uma denúncia' usam artigos indefinidos porque " +
      "introduzem seres mencionados pela primeira vez, sem identificação prévia. " +
      "O artigo indefinido (um, uma, uns, umas) situa o ser como um entre vários possíveis. " +
      "O artigo definido (o, a, os, as) especificaria um ser já conhecido.",
    explanationCorrect:
      "Correto! Artigos indefinidos introduzem seres sem determinação prévia — 'um suspeito qualquer', " +
      "'uma denúncia não identificada'. O artigo definido pressupõe identificação anterior.",
    explanationWrong:
      "O item está CERTO. 'Um' e 'uma' são artigos indefinidos. " +
      "Indicam seres não identificados previamente no contexto — função determinante sem especificação.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "por_mo_aa_q03",
    contentId: CONTENT_IDS.adjetivoArtigo,
    statement:
      "(CESPE — Adaptada) Em qual alternativa o adjetivo exerce função de PREDICATIVO DO SUJEITO " +
      "(e não de adjunto adnominal)?",
    alternatives: [
      { letter: "A", text: "O delegado experiente conduziu a operação com êxito." },
      { letter: "B", text: "A perita apresentou laudos conclusivos ao juiz." },
      { letter: "C", text: "O suspeito permaneceu calado durante todo o interrogatório." },
      { letter: "D", text: "Os policiais habilidosos neutralizaram a ameaça." },
      { letter: "E", text: "A viatura rápida chegou antes do reforço." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'calado' é predicativo do sujeito — aparece após verbo de ligação 'permaneceu' " +
      "e atribui qualidade ao sujeito 'suspeito' pelo predicado verbal. " +
      "Adjunto adnominal está junto ao substantivo, antes ou depois dele diretamente. " +
      "A: 'experiente' = adjunto adnominal de 'delegado'. " +
      "B: 'conclusivos' = adjunto adnominal de 'laudos'. " +
      "D: 'habilidosos' = adjunto adnominal de 'policiais'. " +
      "E: 'rápida' = adjunto adnominal de 'viatura'.",
    explanationCorrect:
      "Exato! 'Calado' é predicativo: liga-se ao sujeito 'suspeito' por meio do verbo de ligação " +
      "'permaneceu'. Teste: se o adjetivo aparece separado do substantivo após VL → predicativo.",
    explanationWrong:
      "Resposta: C. 'Calado' é predicativo do sujeito (verbo de ligação 'permaneceu' entre sujeito e adjetivo). " +
      "Nos demais casos, os adjetivos são adjuntos adnominais (diretamente ligados ao substantivo).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_mo_aa_q04",
    contentId: CONTENT_IDS.adjetivoArtigo,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O inspetor é o mais dedicado da equipe', " +
      "o adjetivo 'dedicado' está no grau superlativo relativo de superioridade.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'O mais dedicado da equipe' = superlativo relativo de superioridade: " +
      "compara o inspetor com os demais da equipe (grupo de referência), " +
      "estabelecendo que ele supera todos nessa qualidade. " +
      "Superlativo absoluto: 'muito dedicado' ou 'dedicadíssimo' (sem grupo de comparação). " +
      "Comparativo: 'mais dedicado do que fulano' (dois termos comparados).",
    explanationCorrect:
      "Correto! 'O mais dedicado da equipe' = superlativo relativo de superioridade. " +
      "Estrutura: artigo + 'mais' + adjetivo + 'de/da' + grupo de comparação.",
    explanationWrong:
      "O item está CERTO. 'O mais dedicado da equipe' é superlativo relativo de superioridade — " +
      "o inspetor é comparado ao grupo ('da equipe') e se destaca como o mais alto nessa qualidade.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_mo_aa_q05",
    contentId: CONTENT_IDS.adjetivoArtigo,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que o emprego do artigo antes do nome " +
      "próprio está CORRETO segundo a norma culta.",
    alternatives: [
      { letter: "A", text: "A Brasil precisa de mais investimentos em segurança." },
      { letter: "B", text: "O João chegou antes de todos ao plantão." },
      { letter: "C", text: "Os Pedro e Paulo são investigadores experientes." },
      { letter: "D", text: "A Maria Joaquina foi aprovada no concurso da Polícia Federal." },
      { letter: "E", text: "Todas as alternativas estão corretas." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "CORRETO: 'A Maria Joaquina' — o artigo definido antes de nome próprio feminino é aceito " +
      "na norma culta do português brasileiro, especialmente em registros informais e medianos. " +
      "É a forma mais natural e correta entre as alternativas apresentadas. " +
      "A: 'A Brasil' — Brasil é masculino ('o Brasil'). " +
      "B e C: 'O João' e 'Os Pedro e Paulo' são gramaticalmente aceitos, " +
      "mas C usa plural com nomes que deveriam permanecer no singular com artigo plural (aceitável mas menos preciso). " +
      "D é a opção mais claramente correta e natural.",
    explanationCorrect:
      "Exato! O artigo definido antes de nome próprio é plenamente aceito no português brasileiro. " +
      "'A Maria Joaquina' é natural e correto. O gênero do artigo deve concordar com o gênero do nome.",
    explanationWrong:
      "Resposta: D. 'A Maria Joaquina' está correto — artigo feminino antes de nome próprio feminino. " +
      "Erro em A: 'Brasil' é masculino (o Brasil). O artigo antes de nome próprio é aceito no PB.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_mo_aa_q06",
    contentId: CONTENT_IDS.adjetivoArtigo,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O agente usava camisa verde-escura e calça azul-marinho', " +
      "os adjetivos compostos de cor estão corretamente empregados, pois ambos ficaram invariáveis " +
      "no feminino.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. A regra dos adjetivos compostos de cor: apenas o último elemento varia. " +
      "'Verde-escura' está CORRETO: o último elemento 'escura' concorda com 'camisa' (feminino). " +
      "'Azul-marinho' está CORRETO: 'marinho' é substantivo usado como segundo elemento → " +
      "o adjetivo composto com substantivo é INVARIÁVEL. " +
      "O erro do item está na afirmação 'ambos ficaram invariáveis': " +
      "'verde-escura' variou (escura, feminino). Portanto, a afirmação é falsa.",
    explanationCorrect:
      "Correto! O item está ERRADO. 'Verde-escura' variou ('escura' concorda com 'camisa'). " +
      "Regra: adjetivos compostos → último elemento varia; se o 2º é substantivo (marinho) → invariável.",
    explanationWrong:
      "O item está ERRADO. 'Verde-escura' variou em gênero ('escura' = feminino). " +
      "Regra dos compostos de cor: o último elemento concorda, exceto quando é substantivo (ex: marinho, limão).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "por_mo_aa_q07",
    contentId: CONTENT_IDS.adjetivoArtigo,
    statement:
      "(CESPE — Adaptada) Na frase 'Os pobres sofrem mais com a violência urbana', " +
      "a palavra 'pobres' exerce a função de:",
    alternatives: [
      { letter: "A", text: "Adjetivo predicativo do sujeito implícito." },
      { letter: "B", text: "Adjunto adnominal do verbo 'sofrem'." },
      { letter: "C", text: "Substantivo — núcleo do sujeito da oração." },
      { letter: "D", text: "Advérbio modificador do verbo 'sofrem'." },
      { letter: "E", text: "Adjetivo adjunto adnominal de 'violência'." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'Os pobres' — o adjetivo 'pobres' foi substantivado pelo artigo 'os', " +
      "passando a funcionar como substantivo e núcleo do sujeito. " +
      "Fenômeno: substantivação (ou conversão) — um adjetivo assume função e categoria de substantivo " +
      "quando precedido de artigo. Neste caso, 'os pobres' = as pessoas pobres. " +
      "Não é adjunto adnominal (não qualifica outro substantivo) nem predicativo (não há VL).",
    explanationCorrect:
      "Exato! 'Pobres' foi substantivado pelo artigo 'os' → função de substantivo (núcleo do sujeito). " +
      "Substantivação: adjetivo + artigo = novo substantivo. Comum em provas: 'o bom', 'o justo', 'os ricos'.",
    explanationWrong:
      "Resposta: C. 'Os pobres' = substantivação — adjetivo 'pobres' + artigo 'os' = substantivo. " +
      "Funciona como núcleo do sujeito. Provas adoram testar esse fenômeno de conversão de classe.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_mo_aa_q08",
    contentId: CONTENT_IDS.adjetivoArtigo,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Meu é o relatório mais importante desta investigação', " +
      "a palavra 'meu' exerce função de pronome possessivo substantivado, " +
      "núcleo do sujeito da oração.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Meu' nesta construção é pronome possessivo em posição de sujeito (substantivado). " +
      "A oração pode ser parafraseada como 'O meu [relatório] é o mais importante'. " +
      "Quando o pronome possessivo aparece sem o substantivo ao qual se refere e funciona como núcleo " +
      "de um termo da oração, exerce função substantiva. " +
      "Construção similar: 'O teu vale mais que o meu' — ambos substantivados.",
    explanationCorrect:
      "Correto! 'Meu' é pronome possessivo substantivado — funciona como núcleo do sujeito sem " +
      "o substantivo expresso. Pronomes possessivos podem exercer função de substantivo.",
    explanationWrong:
      "O item está CERTO. 'Meu' = pronome possessivo em função substantiva (sujeito). " +
      "Pronomes possessivos podem ser substantivados quando o referente é omitido pelo contexto.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 2 — Advérbio: Circunstâncias, Invariabilidade e Pegadinhas
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_mo_av_q01",
    contentId: CONTENT_IDS.adverbio,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que a palavra sublinhada é um ADVÉRBIO.",
    alternatives: [
      { letter: "A", text: "O _rápido_ escoamento das evidências preocupou os peritos." },
      { letter: "B", text: "O policial agiu _rapidamente_ na contenção do suspeito." },
      { letter: "C", text: "A _rapidez_ da equipe foi determinante para o êxito." },
      { letter: "D", text: "O _rápido_ foi capturado antes de cruzar a fronteira." },
      { letter: "E", text: "A equipe _rápida_ garantiu o êxito da operação." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'rapidamente' é advérbio de modo — modifica o verbo 'agiu', indicando como ocorreu " +
      "a ação. É invariável (não varia em gênero/número). " +
      "A: 'rápido' é adjetivo (qualifica 'escoamento'). " +
      "C: 'rapidez' é substantivo. " +
      "D: 'rápido' é adjetivo substantivado. " +
      "E: 'rápida' é adjetivo adjunto adnominal.",
    explanationCorrect:
      "Exato! 'Rapidamente' é advérbio de modo: modifica o verbo, é invariável e responde à pergunta 'como?'.",
    explanationWrong:
      "Resposta: B. 'Rapidamente' é advérbio de modo — invariável, modifica o verbo. " +
      "Adjetivos variam em gênero/número; advérbios não.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_mo_av_q02",
    contentId: CONTENT_IDS.adverbio,
    statement:
      "(CEBRASPE — Adaptada) O advérbio é uma classe de palavras invariável: " +
      "não sofre flexão de gênero nem de número.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. O advérbio é invariável — não flexiona em gênero (masculino/feminino) " +
      "nem em número (singular/plural). " +
      "Exemplos: 'muito', 'logo', 'aqui', 'talvez', 'rapidamente' — sempre na mesma forma. " +
      "Atenção: 'muito' quando advérbio é invariável; quando adjetivo, varia (muitos alunos / muitas questões).",
    explanationCorrect:
      "Correto! Advérbio = invariável. Não sofre flexão de gênero nem número. " +
      "Isso o distingue do adjetivo, que concorda com o substantivo.",
    explanationWrong:
      "O item está CERTO. Advérbio é invariável — característica fundamental que diferencia adjetivo de advérbio " +
      "em questões de prova.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "por_mo_av_q03",
    contentId: CONTENT_IDS.adverbio,
    statement:
      "(CESPE — Adaptada) Em qual alternativa 'bastante' exerce função de ADVÉRBIO (e não de adjetivo)?",
    alternatives: [
      { letter: "A", text: "Havia bastantes suspeitos na lista de investigados." },
      { letter: "B", text: "A delegada tinha provas bastantes para decretar a prisão." },
      { letter: "C", text: "O investigador trabalhou bastante naquela operação." },
      { letter: "D", text: "Coletaram bastantes evidências na cena do crime." },
      { letter: "E", text: "Apresentaram bastantes testemunhas ao juiz." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'trabalhou bastante' — 'bastante' modifica o verbo 'trabalhou', respondendo 'quanto?'. " +
      "Como advérbio, é INVARIÁVEL. " +
      "A, B, D e E: 'bastantes' está no plural, concordando com substantivos (suspeitos, provas, evidências, " +
      "testemunhas) → função de adjetivo/pronome. " +
      "Regra prática: se 'bastante' está no plural ou concorda com o substantivo → adjetivo; " +
      "se invariável e modifica verbo/adjetivo → advérbio.",
    explanationCorrect:
      "Exato! 'Bastante' invariável + modifica verbo = advérbio. " +
      "'Bastantes' (plural) + concorda com substantivo = adjetivo. Pegadinha clássica de concurso!",
    explanationWrong:
      "Resposta: C. 'Bastante' = advérbio (modifica verbo, invariável). " +
      "Nas demais, 'bastantes' está no plural concordando com substantivos → função adjetiva.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_mo_av_q04",
    contentId: CONTENT_IDS.adverbio,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'A delegada estava meio contrariada com o desfecho do caso', " +
      "a palavra 'meio' é advérbio e, portanto, permanece invariável.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Meio' modifica o adjetivo 'contrariada', respondendo 'até que ponto?'. " +
      "Como advérbio, é INVARIÁVEL — não deve concordar com o substantivo 'delegada' (feminino). " +
      "Erro comum: escrever 'meia contrariada' (concordância equivocada com substantivo feminino). " +
      "Correto: 'meio contrariada', 'meio cansado', 'meio assustadas' — sempre 'meio' invariável.",
    explanationCorrect:
      "Correto! 'Meio' = advérbio de intensidade, modifica adjetivo → invariável. " +
      "Jamais 'meia contrariada'. Pegadinha frequentíssima em concursos policiais!",
    explanationWrong:
      "O item está CERTO. 'Meio contrariada' = correto. 'Meio' é advérbio de intensidade e não concorda " +
      "com o substantivo. Erro clássico: 'meia contrariada' (errado — adjetivo concordando incorretamente).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_mo_av_q05",
    contentId: CONTENT_IDS.adverbio,
    statement:
      "(CESPE — Adaptada) Identifique a alternativa em que o advérbio está no " +
      "grau SUPERLATIVO ABSOLUTO SINTÉTICO.",
    alternatives: [
      { letter: "A", text: "O delegado agiu muito rapidamente na ocorrência." },
      { letter: "B", text: "A equipe trabalhou bem naquele caso." },
      { letter: "C", text: "O investigador chegou tarde ao local do crime." },
      { letter: "D", text: "O suspeito confessou muitíssimo rapidamente sob pressão." },
      { letter: "E", text: "A perita analisou as evidências mais cuidadosamente do que o assistente." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "CORRETO: 'muitíssimo rapidamente' — 'muitíssimo' é superlativo absoluto sintético do advérbio 'muito' " +
      "(formado por sufixo, não por locução). " +
      "A: 'muito rapidamente' = superlativo absoluto analítico (com 'muito'). " +
      "B e C: grau normal. " +
      "E: 'mais cuidadosamente do que' = comparativo de superioridade.",
    explanationCorrect:
      "Exato! 'Muitíssimo' = superlativo absoluto sintético do advérbio 'muito' (sufixo -íssimo). " +
      "Advérbios também têm graus, assim como adjetivos.",
    explanationWrong:
      "Resposta: D. 'Muitíssimo' = superlativo absoluto sintético (sufixo -íssimo em 'muito'). " +
      "A forma analítica seria 'muito muito' ou 'extremamente'. Os advérbios admitem flexão de grau.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_mo_av_q06",
    contentId: CONTENT_IDS.adverbio,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O investigador chegou cedo e encontrou os suspeitos " +
      "ainda acordados', as palavras 'cedo' e 'ainda' são ambas advérbios de tempo.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Cedo' = advérbio de tempo (quando chegou?). " +
      "'Ainda' = advérbio de tempo (continuidade temporal: continuavam acordados até aquele momento). " +
      "Ambos modificam circunstâncias temporais da ação. " +
      "Classificação de advérbios de tempo: cedo, tarde, hoje, amanhã, ontem, agora, já, ainda, sempre, nunca.",
    explanationCorrect:
      "Correto! 'Cedo' e 'ainda' são advérbios de tempo. 'Cedo' indica o momento da chegada; " +
      "'ainda' indica continuidade (os suspeitos permaneciam acordados naquele ponto do tempo).",
    explanationWrong:
      "O item está CERTO. 'Cedo' (tempo: quando?) e 'ainda' (tempo: continuidade) são advérbios temporais. " +
      "Outros exemplos de advérbios de tempo: hoje, ontem, amanhã, já, sempre, nunca, logo.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "por_mo_av_q07",
    contentId: CONTENT_IDS.adverbio,
    statement:
      "(CESPE — Adaptada) Na frase 'Mesmo os policiais mais experientes não previram " +
      "aquela emboscada', a palavra 'mesmo' exerce função de:",
    alternatives: [
      { letter: "A", text: "Advérbio de afirmação, reforçando 'não previram'." },
      { letter: "B", text: "Pronome demonstrativo, retomando 'policiais'." },
      { letter: "C", text: "Advérbio de inclusão (até/inclusive), modificando 'os policiais'." },
      { letter: "D", text: "Adjetivo concordando com 'policiais' no plural." },
      { letter: "E", text: "Conjunção concessiva introduzindo a oração." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'mesmo' nesta frase é advérbio de inclusão — equivale a 'até mesmo', 'inclusive'. " +
      "Modifica o grupo 'os policiais mais experientes', destacando-os como caso extremo. " +
      "Não é adjetivo (pois não concorda: seria 'mesmos policiais'); " +
      "não é pronome demonstrativo (que retomaria algo anterior); " +
      "não é conjunção (não introduz oração subordinada).",
    explanationCorrect:
      "Exato! 'Mesmo' = advérbio de inclusão (= 'até mesmo', 'inclusive'). " +
      "Invariável nessa função. Teste: substitua por 'até mesmo' — o sentido se mantém.",
    explanationWrong:
      "Resposta: C. 'Mesmo os policiais' = 'até mesmo os policiais' → advérbio de inclusão, invariável. " +
      "Não é adjetivo (não concorda: seria 'mesmos'). Pegadinha clássica de múltiplas funções do 'mesmo'.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_mo_av_q08",
    contentId: CONTENT_IDS.adverbio,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'As policiais trabalham muito e chegam longe " +
      "na carreira', a palavra 'longe' funciona como advérbio e está corretamente empregada " +
      "para indicar circunstância de extensão/intensidade, não de lugar.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Longe na carreira' = sentido figurado — 'longe' aqui não indica lugar geográfico, " +
      "mas extensão/progressão em sentido abstrato (chegar a um patamar elevado na carreira). " +
      "O advérbio 'longe' pode funcionar em sentido literal (lugar: 'moro longe daqui') " +
      "ou figurado (extensão/êxito: 'vai longe na vida'). Ambos os usos são corretos e aceitos.",
    explanationCorrect:
      "Correto! 'Longe' em sentido figurado = advérbio de extensão/intensidade. " +
      "'Chegam longe na carreira' = alcançam posições elevadas. Uso figurado plenamente aceito.",
    explanationWrong:
      "O item está CERTO. 'Longe' no sentido figurado indica extensão/progresso, não lugar físico. " +
      "Advérbios podem ter sentido literal e figurado — a interpretação depende do contexto.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 3 — Conjunções Integrantes: QUE e SE
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_mo_ci_q01",
    contentId: CONTENT_IDS.conjuncoesIntegrantes,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que 'que' é conjunção INTEGRANTE " +
      "(introduz oração subordinada substantiva).",
    alternatives: [
      { letter: "A", text: "O suspeito que foi preso negou tudo no interrogatório." },
      { letter: "B", text: "A delegada disse que o inquérito seria concluído logo." },
      { letter: "C", text: "Quanto mais evidências, mais que suficiente para a condenação." },
      { letter: "D", text: "O investigador, que é experiente, resolveu o caso rapidamente." },
      { letter: "E", text: "Ele trabalhou mais que todos os colegas do departamento." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'a delegada disse que...' — 'que' introduz oração subordinada substantiva objetiva direta " +
      "(completa o verbo 'disse'). É conjunção integrante: pode ser substituída por 'isso' sem deixar de fazer sentido. " +
      "A e D: 'que' é pronome relativo (representa 'suspeito' e 'investigador' — antecedente). " +
      "C e E: 'que' tem outra função (expletiva e comparativa).",
    explanationCorrect:
      "Exato! Conjunção integrante QUE: introduz oração substantiva, pode ser substituída por 'isso'. " +
      "'Disse que...' = 'disse isso'. Não tem antecedente — distingue do pronome relativo.",
    explanationWrong:
      "Resposta: B. 'Que' = conjunção integrante em 'disse que...' (oração objetiva direta). " +
      "Teste: se pode substituir por 'isso' → integrante. Se retoma substantivo anterior → pronome relativo.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_mo_ci_q02",
    contentId: CONTENT_IDS.conjuncoesIntegrantes,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O delegado não sabia se o suspeito estava mentindo', " +
      "a palavra 'se' é conjunção integrante que introduz oração subordinada substantiva objetiva direta.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Não sabia se...' — 'se' é conjunção integrante introduzindo oração objetiva direta " +
      "(completa o verbo 'sabia'). Indica dúvida/incerteza indireta. " +
      "Teste: pode ser substituída por 'isso'? 'O delegado não sabia isso' — faz sentido estrutural. " +
      "Distingue-se do 'se' condicional (se chover, fica em casa) e do 'se' reflexivo (ele se penteia).",
    explanationCorrect:
      "Correto! 'SE' integrante acompanha verbos de dúvida/ignorância: saber, perguntar, ignorar, investigar. " +
      "Introduz oração objetiva direta. Indica incerteza indireta.",
    explanationWrong:
      "O item está CERTO. 'Não sabia se...' = SE conjunção integrante (dúvida indireta). " +
      "Verbos como 'saber', 'perguntar', 'ignorar' abrem espaço para 'se' integrante.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "por_mo_ci_q03",
    contentId: CONTENT_IDS.conjuncoesIntegrantes,
    statement:
      "(CESPE — Adaptada) Em qual alternativa o 'SE' NÃO é conjunção integrante?",
    alternatives: [
      { letter: "A", text: "O inspetor perguntou se havia testemunhas na cena." },
      { letter: "B", text: "A perícia não confirmou se a vítima reagiu ao agressor." },
      { letter: "C", text: "Ninguém sabia se o réu seria solto após a audiência." },
      { letter: "D", text: "Se o suspeito confessar, a investigação se encerrará." },
      { letter: "E", text: "O delegado investigou se o álibi era verdadeiro." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "CORRETO: 'Se o suspeito confessar...' — 'se' é conjunção CONDICIONAL (não integrante). " +
      "Indica condição para que a investigação se encerre. Introduz oração subordinada adverbial condicional. " +
      "Teste: substitua por 'caso' — faz sentido → condicional. " +
      "A, B, C, E: o 'se' completa verbos de dúvida/ignorância (perguntar, confirmar, saber, investigar) → integrante.",
    explanationCorrect:
      "Exato! Em D, 'se' é condicional (= 'caso'). Nos demais, 'se' integrante complementa verbos " +
      "que expressam dúvida ou investigação.",
    explanationWrong:
      "Resposta: D. 'Se o suspeito confessar' = condicional (= 'caso confesse'). " +
      "SE integrante aparece após verbos de incerteza/dúvida. SE condicional introduz hipótese/condição.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_mo_ci_q04",
    contentId: CONTENT_IDS.conjuncoesIntegrantes,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'É fundamental que os agentes observem os protocolos " +
      "de segurança', a oração iniciada por 'que' é subordinada substantiva subjetiva, " +
      "pois funciona como sujeito do verbo 'é'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Que os agentes observem os protocolos' é oração subordinada substantiva subjetiva. " +
      "Funciona como sujeito de 'é fundamental': o que é fundamental? — [que os agentes observem...]. " +
      "Sujeito oracional = oração substantiva subjetiva. " +
      "Introduzida por conjunção integrante 'que'. O verbo principal fica impessoal (é fundamental, é necessário, convém).",
    explanationCorrect:
      "Correto! Sujeito oracional: 'que os agentes observem' responde 'o que é fundamental?' → subjetiva. " +
      "Conjunção integrante QUE introduz oração que funciona como sujeito do verbo impessoal.",
    explanationWrong:
      "O item está CERTO. 'É fundamental que...' = oração subjetiva (sujeito do verbo 'é'). " +
      "Verbo 'ser' impessoal + adjetivo predicativo + que-oração = estrutura de oração subjetiva.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_mo_ci_q05",
    contentId: CONTENT_IDS.conjuncoesIntegrantes,
    statement:
      "(CESPE — Adaptada) Na frase 'A delegada ordenou que a equipe reforçasse a segurança', " +
      "a oração subordinada iniciada por 'que' classifica-se como:",
    alternatives: [
      { letter: "A", text: "Substantiva subjetiva — sujeito de 'ordenou'." },
      { letter: "B", text: "Substantiva objetiva direta — objeto direto de 'ordenou'." },
      { letter: "C", text: "Adjetiva restritiva — qualifica 'equipe'." },
      { letter: "D", text: "Adverbial final — indica finalidade da ordem." },
      { letter: "E", text: "Substantiva completiva nominal — completa nome anterior." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'que a equipe reforçasse a segurança' é substantiva objetiva direta — " +
      "completa o verbo transitivo direto 'ordenou' (ordenou o quê?). " +
      "Conjunção integrante 'que' sem antecedente nominal. " +
      "A: subjetiva seria sujeito de verbo impessoal ou de VL sem sujeito expresso. " +
      "C: adjetiva teria antecedente e 'que' seria pronome relativo. " +
      "D: adverbial final responderia 'para quê?' com 'para que'.",
    explanationCorrect:
      "Exato! 'Ordenou que...' = objetiva direta (objeto direto oracional). " +
      "Verbos como ordenar, pedir, afirmar, dizer abrem objetiva direta com QUE integrante.",
    explanationWrong:
      "Resposta: B. 'Ordenou que...' = oração objetiva direta (objeto direto de 'ordenou'). " +
      "Conjunção integrante QUE sem antecedente. Pergunta: ordenou o quê? — a oração responde.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_mo_ci_q06",
    contentId: CONTENT_IDS.conjuncoesIntegrantes,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O suspeito que confessou foi encaminhado à delegacia', " +
      "o 'que' é conjunção integrante porque introduz oração subordinada.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. 'O suspeito que confessou' — 'que' é pronome relativo (não conjunção integrante). " +
      "Motivos: (1) tem antecedente ('suspeito'); (2) exerce função sintática dentro da oração que introduz " +
      "(é sujeito de 'confessou'); (3) pode ser substituído por 'o qual'. " +
      "Conjunção integrante não tem antecedente e não exerce função sintática na oração que introduz.",
    explanationCorrect:
      "Correto! O item está ERRADO. 'Que confessou' = relativa (tem antecedente 'suspeito'). " +
      "Distinção chave: QUE relativo tem antecedente + função sintática; QUE integrante não tem.",
    explanationWrong:
      "O item está ERRADO. 'Que' = pronome relativo (tem antecedente 'suspeito', exerce função de sujeito). " +
      "QUE integrante não tem antecedente e é apenas conectivo, sem função sintática própria.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "por_mo_ci_q07",
    contentId: CONTENT_IDS.conjuncoesIntegrantes,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que o 'que' é conjunção EXPLETIVA " +
      "(= realce, sem valor semântico).",
    alternatives: [
      { letter: "A", text: "A perita concluiu que o incêndio foi criminoso." },
      { letter: "B", text: "O agente que estava de plantão registrou a ocorrência." },
      { letter: "C", text: "Há muito tempo que não havia um caso tão complexo." },
      { letter: "D", text: "É necessário que todos cooperem com a investigação." },
      { letter: "E", text: "O delegado perguntou se o suspeito tinha advogado." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'Há muito tempo que...' — 'que' é expletivo (de realce), pode ser suprimido sem alterar o sentido: " +
      "'Há muito tempo não havia um caso tão complexo' — oração perfeitamente correta. " +
      "A: 'que' = conjunção integrante (objetiva direta de 'concluiu'). " +
      "B: 'que' = pronome relativo ('agente' é antecedente). " +
      "D: 'que' = conjunção integrante (subjetiva). " +
      "E: 'se' = conjunção integrante.",
    explanationCorrect:
      "Exato! QUE expletivo = de realce, dispensável. Aparece após expressões de tempo: " +
      "'Faz anos que...', 'Há muito tempo que...'. Suprimir o 'que' não muda o sentido.",
    explanationWrong:
      "Resposta: C. 'Há muito tempo que' = QUE expletivo/de realce. Pode ser omitido: " +
      "'Há muito tempo não havia...' é igualmente correto. Função apenas de ênfase temporal.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_mo_ci_q08",
    contentId: CONTENT_IDS.conjuncoesIntegrantes,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O inquérito revelou que o suspeito mentia e que " +
      "as testemunhas se contradiziam', as duas orações iniciadas por 'que' são ambas " +
      "objetivas diretas e funcionam como objetos diretos coordenados do verbo 'revelou'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Revelou que o suspeito mentia' (1ª objetiva direta) e " +
      "'[revelou] que as testemunhas se contradiziam' (2ª objetiva direta). " +
      "Ambas completam o verbo 'revelou' como objetos diretos oracionais, coordenados entre si " +
      "(pela conjunção coordenativa aditiva 'e'). " +
      "Estrutura: VTD + [OD₁ (que...) + e + OD₂ (que...)].",
    explanationCorrect:
      "Correto! Duas objetivas diretas coordenadas (OD₁ e OD₂) completam 'revelou'. " +
      "Orações substantivas podem ser coordenadas entre si, compartilhando o mesmo verbo regente.",
    explanationWrong:
      "O item está CERTO. As duas orações são objetivas diretas coordenadas (conectadas por 'e'). " +
      "Ambas respondem 'revelou o quê?' e completam o VTD 'revelou'.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 4 — Mapa das 10 Classes de Palavras: Variáveis vs Invariáveis
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_mo_cp_q01",
    contentId: CONTENT_IDS.classesPalavras,
    statement:
      "(CESPE — Adaptada) Das dez classes de palavras, quais são as INVARIÁVEIS " +
      "(não sofrem flexão de gênero, número ou grau)?",
    alternatives: [
      { letter: "A", text: "Substantivo, adjetivo, pronome e numeral." },
      { letter: "B", text: "Verbo, adjetivo, artigo e numeral." },
      { letter: "C", text: "Advérbio, preposição, conjunção e interjeição." },
      { letter: "D", text: "Artigo, pronome, numeral e advérbio." },
      { letter: "E", text: "Preposição, conjunção, verbo e advérbio." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: As 4 classes invariáveis são: advérbio, preposição, conjunção e interjeição. " +
      "As 6 classes variáveis: substantivo, adjetivo, artigo, pronome, numeral e verbo. " +
      "Mnemônico: 'APCI' (Advérbio, Preposição, Conjunção, Interjeição) = invariáveis. " +
      "Atenção: o verbo é variável (conjuga-se), mas não em gênero/número — em pessoa, número, modo, tempo.",
    explanationCorrect:
      "Exato! APCI = invariáveis: Advérbio, Preposição, Conjunção, Interjeição. " +
      "As demais 6 classes são variáveis (substantivo, adjetivo, artigo, pronome, numeral, verbo).",
    explanationWrong:
      "Resposta: C. Invariáveis = APCI (Advérbio, Preposição, Conjunção, Interjeição). " +
      "Variáveis = substantivo, adjetivo, artigo, pronome, numeral e verbo.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_mo_cp_q02",
    contentId: CONTENT_IDS.classesPalavras,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Bravo! O agente deteve o criminoso com maestria', " +
      "a palavra 'Bravo' é uma interjeição que expressa aprovação e pertence à classe " +
      "das palavras invariáveis.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Bravo!' é interjeição que expressa aprovação/entusiasmo. " +
      "Interjeições são invariáveis: não flexionam em gênero, número ou grau. " +
      "Funcionam como enunciados completos por si sós, expressando emoções, reações ou apelos. " +
      "Outros exemplos: 'Oba!', 'Ai!', 'Psiu!', 'Viva!', 'Oxente!'.",
    explanationCorrect:
      "Correto! 'Bravo!' = interjeição de aprovação. Classe invariável: não varia em gênero/número. " +
      "Interjeições são enunciados por si sós, expressando emoção ou reação.",
    explanationWrong:
      "O item está CERTO. 'Bravo!' = interjeição (aprovação), invariável. " +
      "Interjeições não se flexionam e expressam estados emotivos do falante.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "por_mo_cp_q03",
    contentId: CONTENT_IDS.classesPalavras,
    statement:
      "(CESPE — Adaptada) Na frase 'O belo da investigação estava nos detalhes', " +
      "que fenômeno morfológico ocorre com a palavra 'belo'?",
    alternatives: [
      { letter: "A", text: "Adjetivação: 'belo' passa de substantivo para adjetivo." },
      { letter: "B", text: "Verbalização: 'belo' adquire função verbal." },
      { letter: "C", text: "Substantivação: 'belo' (adjetivo) funciona como substantivo." },
      { letter: "D", text: "Pronominação: 'belo' retoma elemento anterior." },
      { letter: "E", text: "Advérbio: 'belo' modifica o substantivo 'investigação'." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'O belo' — o adjetivo 'belo' foi substantivado pelo artigo 'o'. " +
      "Passou a funcionar como substantivo, sendo o núcleo do sujeito. " +
      "A substantivação é o fenômeno pelo qual uma palavra de outra classe assume função de substantivo, " +
      "geralmente induzida por artigo ou outro determinante. " +
      "Exemplos: 'o bem', 'o mal', 'o verdadeiro', 'o feio'.",
    explanationCorrect:
      "Exato! Substantivação: adjetivo 'belo' + artigo 'o' → funciona como substantivo (núcleo do sujeito). " +
      "Muito cobrado em provas: 'o belo', 'o justo', 'o certo', 'os pobres'.",
    explanationWrong:
      "Resposta: C. Substantivação — 'belo' é adjetivo convertido em substantivo pelo artigo 'o'. " +
      "Fenômeno de conversão de classe: adjetivo → substantivo quando precedido de artigo.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_mo_cp_q04",
    contentId: CONTENT_IDS.classesPalavras,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O trabalho do policial foi um trabalho exemplar', " +
      "as duas ocorrências da palavra 'trabalho' pertencem à mesma classe gramatical " +
      "(substantivo) e exercem a mesma função sintática.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. Ambas as ocorrências de 'trabalho' são substantivos (mesma classe), " +
      "mas exercem funções sintáticas DIFERENTES: " +
      "(1) 'O trabalho do policial' = sujeito da oração. " +
      "(2) 'um trabalho exemplar' = predicativo do sujeito (via VL 'foi'). " +
      "Mesma classe gramatical ≠ mesma função sintática.",
    explanationCorrect:
      "Correto! O item está ERRADO. Ambas são substantivos, mas: " +
      "1ª = sujeito ('o trabalho do policial'); 2ª = predicativo do sujeito ('um trabalho exemplar'). " +
      "Mesma classe, funções distintas.",
    explanationWrong:
      "O item está ERRADO. Ambas = substantivos (mesma classe). Mas a 1ª é sujeito e a 2ª é predicativo. " +
      "Classe gramatical ≠ função sintática — distinção fundamental em provas.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_mo_cp_q05",
    contentId: CONTENT_IDS.classesPalavras,
    statement:
      "(CESPE — Adaptada) Identifique a alternativa em que a palavra destacada " +
      "é NUMERAL (e não pronome ou adjetivo).",
    alternatives: [
      { letter: "A", text: "Cada agente recebeu sua missão específica." },
      { letter: "B", text: "Vários policiais participaram da operação." },
      { letter: "C", text: "O terceiro suspeito foi identificado pela câmera." },
      { letter: "D", text: "Poucos crimes ficam sem solução em delegacias modernas." },
      { letter: "E", text: "Nenhum acusado foi absolvido neste processo." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'terceiro' é numeral ordinal — indica ordem/posição em uma série. " +
      "Numerais podem ser: cardinais (um, dois, três), ordinais (primeiro, segundo, terceiro), " +
      "multiplicativos (dobro, triplo) e fracionários (metade, terço). " +
      "A: 'Cada' = pronome indefinido. B: 'Vários' = pronome indefinido. " +
      "D: 'Poucos' = pronome indefinido. E: 'Nenhum' = pronome indefinido.",
    explanationCorrect:
      "Exato! 'Terceiro' = numeral ordinal (posição na série). " +
      "Pronomes indefinidos (cada, vários, poucos, nenhum) indicam quantidade vaga — são diferentes dos numerais.",
    explanationWrong:
      "Resposta: C. 'Terceiro' = numeral ordinal. Os demais (cada, vários, poucos, nenhum) = pronomes indefinidos. " +
      "Numerais expressam quantidade exata ou posição precisa na série.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_mo_cp_q06",
    contentId: CONTENT_IDS.classesPalavras,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Conforme o regulamento, todos os agentes devem " +
      "portar identificação', a palavra 'Conforme' exerce a função de conjunção conformativa.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Conforme o regulamento' — 'conforme' é conjunção (ou locução prepositiva, dependendo da análise) " +
      "com valor conformativo: indica conformidade com uma norma/regra. " +
      "A oração 'conforme o regulamento' estabelece que a ação deve ser feita de acordo com o regulamento. " +
      "Sinônimos: segundo, de acordo com, consoante. Outros exemplos de conformativas: 'como', 'segundo', 'consoante'.",
    explanationCorrect:
      "Correto! 'Conforme' = conjunção/prepositiva conformativa, indica conformidade. " +
      "Sinônimos: segundo, de acordo com, consoante. Valor: a ação segue uma norma.",
    explanationWrong:
      "O item está CERTO. 'Conforme' é conformativo — indica que a ação segue o regulamento. " +
      "Outros conformativos: segundo, consoante, de acordo com.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "por_mo_cp_q07",
    contentId: CONTENT_IDS.classesPalavras,
    statement:
      "(CESPE — Adaptada) A palavra 'que' pode assumir diferentes classes gramaticais. " +
      "Em qual alternativa o 'que' é PRONOME INTERROGATIVO?",
    alternatives: [
      { letter: "A", text: "Disseram que o suspeito fugiu antes da chegada da viatura." },
      { letter: "B", text: "O agente que estava de plantão registrou o boletim." },
      { letter: "C", text: "Que tipo de crime foi registrado naquela delegacia?" },
      { letter: "D", text: "Há muito tempo que a delegacia não tinha um caso assim." },
      { letter: "E", text: "Ele correu tanto que chegou antes dos reforços." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'Que tipo de crime?' — 'que' é pronome interrogativo que introduz pergunta direta, " +
      "determinando o substantivo 'tipo'. " +
      "A: 'que' = conjunção integrante (objetiva direta de 'disseram'). " +
      "B: 'que' = pronome relativo (antecedente: 'agente'). " +
      "D: 'que' = expletivo/de realce. " +
      "E: 'que' = conjunção consecutiva ('tanto... que').",
    explanationCorrect:
      "Exato! 'Que tipo?' = pronome interrogativo (introduz pergunta direta, determina substantivo). " +
      "O 'que' tem ao menos 5 funções: integrante, relativo, interrogativo, expletivo e consecutivo.",
    explanationWrong:
      "Resposta: C. 'Que tipo de crime?' = pronome interrogativo. " +
      "O 'que' é polissêmico: integrante (A), relativo (B), expletivo (D), consecutivo (E) e interrogativo (C).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_mo_cp_q08",
    contentId: CONTENT_IDS.classesPalavras,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Durante a operação, os policiais mantiveram " +
      "o suspeito sob vigilância', a preposição 'sob' é acidental, " +
      "pois em outros contextos pode pertencer a outra classe gramatical.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. 'Sob' é preposição ESSENCIAL (ou própria) — sempre foi e será preposição, " +
      "nunca pertenceu a outra classe gramatical. " +
      "Preposições acidentais são aquelas que originalmente pertencem a outra classe " +
      "e ocasionalmente funcionam como preposição: ex.: 'durante' (originalmente particípio), " +
      "'mediante', 'conforme', 'exceto', 'salvo', 'fora'. " +
      "'Sob', 'de', 'em', 'por', 'para', 'com' são preposições essenciais.",
    explanationCorrect:
      "Correto! O item está ERRADO. 'Sob' é preposição essencial (sempre preposição). " +
      "Preposições acidentais são as que vêm de outras classes: durante (particípio), exceto, salvo, conforme.",
    explanationWrong:
      "O item está ERRADO. 'Sob' = preposição essencial, sempre foi preposição. " +
      "Acidentais são as que migram de outra classe: 'durante', 'exceto', 'salvo', 'conforme', 'mediante'.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 5 — Substantivo: Classificações e Flexões em Provas Policiais
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_mo_sb_q01",
    contentId: CONTENT_IDS.substantivo,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa que apresenta um substantivo COLETIVO.",
    alternatives: [
      { letter: "A", text: "Policial" },
      { letter: "B", text: "Delegacia" },
      { letter: "C", text: "Corporação" },
      { letter: "D", text: "Investigação" },
      { letter: "E", text: "Suspeito" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'Corporação' é substantivo coletivo — denomina um conjunto de indivíduos " +
      "(policiais, militares, profissionais) de forma singular. " +
      "Outros coletivos relevantes em provas policiais: 'guarnição' (grupo de policiais em serviço), " +
      "'pelotão' (grupo militar), 'júri' (grupo de jurados), 'banca' (grupo de examinadores). " +
      "A, B, D, E: são substantivos comuns — nomeiam seres de forma individual.",
    explanationCorrect:
      "Exato! 'Corporação' = coletivo (designa conjunto de pessoas em forma singular). " +
      "Outros exemplos: guarnição, pelotão, júri, conselho, banca.",
    explanationWrong:
      "Resposta: C. 'Corporação' = substantivo coletivo (conjunto de pessoas/servidores). " +
      "Coletivos nomeneiam grupos no singular com sentido plural.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_mo_sb_q02",
    contentId: CONTENT_IDS.substantivo,
    statement:
      "(CEBRASPE — Adaptada) O substantivo 'mártir' é do gênero comum de dois " +
      "(epiceno de dois gêneros), pois serve para designar tanto homem quanto mulher " +
      "sem alteração de forma.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. 'Mártir' é substantivo COMUM DE DOIS GÊNEROS (= sobrecomum ou comum de dois): " +
      "a mesma forma serve para masculino e feminino, com o artigo indicando o gênero: " +
      "'o mártir' / 'a mártir'. " +
      "Epiceno é diferente: designa animais com uma forma única para ambos os sexos, " +
      "e o gênero é fixo (não muda com artigo): 'a cobra macho', 'o crocodilo fêmea'. " +
      "Confusão terminológica frequente em provas: epiceno ≠ comum de dois gêneros.",
    explanationCorrect:
      "Correto! O item está ERRADO. 'Mártir' = comum de dois gêneros (artigo indica o gênero: o/a mártir). " +
      "Epiceno = animais com forma única (a cobra [macho/fêmea]). Distinção clássica de concurso.",
    explanationWrong:
      "O item está ERRADO. 'Mártir' = comum de dois (o mártir/a mártir). " +
      "Epiceno = animais: 'a cobra' (tanto macho quanto fêmea — gênero fixo). São categorias distintas.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "por_mo_sb_q03",
    contentId: CONTENT_IDS.substantivo,
    statement:
      "(CESPE — Adaptada) Qual é o plural CORRETO do substantivo 'cidadão'?",
    alternatives: [
      { letter: "A", text: "Cidadãos (única forma aceita)." },
      { letter: "B", text: "Cidadães (forma erudita correta)." },
      { letter: "C", text: "Cidadãos ou cidadães (ambas aceitas)." },
      { letter: "D", text: "Cidadãens (forma popular correta)." },
      { letter: "E", text: "Cidadans (forma simplificada correta)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'cidadãos' é a forma predominante, mas 'cidadães' também é aceita pela norma culta. " +
      "Substantivos terminados em -ão têm três plurais possíveis: " +
      "(1) -ões: leões, botões, nações; " +
      "(2) -ães: pães, cães, capitães, cidadães; " +
      "(3) -ãos: irmãos, cidadãos, cristãos. " +
      "A regra é irregular e deve ser memorizada — não há regra única.",
    explanationCorrect:
      "Exato! 'Cidadão' admite 'cidadãos' (mais comum) e 'cidadães' (aceita). " +
      "Palavras em -ão formam plural em -ões, -ães ou -ãos — três possibilidades distintas.",
    explanationWrong:
      "Resposta: C. 'Cidadão' → 'cidadãos' (mais usual) ou 'cidadães' (aceita). " +
      "Plural em -ão é irregular: cada palavra pode pertencer a um dos três grupos.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_mo_sb_q04",
    contentId: CONTENT_IDS.substantivo,
    statement:
      "(CEBRASPE — Adaptada) 'Cônjuge' é substantivo biforme: " +
      "apresenta formas distintas para masculino ('cônjuge') e feminino ('cônjuga').",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. 'Cônjuge' é substantivo COMUM DE DOIS GÊNEROS (uniforme): " +
      "uma única forma para ambos os gêneros, indicados pelo artigo: 'o cônjuge' / 'a cônjuge'. " +
      "NÃO existe a forma 'cônjuga'. " +
      "Biforme = duas formas distintas: ex. 'ator/atriz', 'rei/rainha', 'homem/mulher'. " +
      "Uniforme = uma forma: 'o artista/a artista', 'o cônjuge/a cônjuge'.",
    explanationCorrect:
      "Correto! O item está ERRADO. 'Cônjuge' = uniforme (uma forma para ambos os gêneros). " +
      "'Cônjuga' não existe. Gênero indicado apenas pelo artigo: o cônjuge / a cônjuge.",
    explanationWrong:
      "O item está ERRADO. 'Cônjuge' é uniforme (comum de dois), não biforme. " +
      "Não existe 'cônjuga'. Biforme: homem/mulher, ator/atriz (formas distintas).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_mo_sb_q05",
    contentId: CONTENT_IDS.substantivo,
    statement:
      "(CESPE — Adaptada) Qual substantivo apresenta PLURAL IRREGULAR (não segue a regra geral)?",
    alternatives: [
      { letter: "A", text: "Crime → crimes" },
      { letter: "B", text: "Delegacia → delegacias" },
      { letter: "C", text: "Mal → males" },
      { letter: "D", text: "Investigação → investigações" },
      { letter: "E", text: "Suspeito → suspeitos" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'mal → males' é plural irregular. " +
      "A regra geral para palavras terminadas em -l seria trocar -l por -is: 'animal → animais', 'canal → canais'. " +
      "Mas 'mal' faz 'males', e 'cônsul' faz 'cônsules', 'mel' faz 'méis' ou 'meles' — irregulares. " +
      "A, B, D, E: seguem padrões regulares (acréscimo de -s ou -es, -ções).",
    explanationCorrect:
      "Exato! 'Mal → males' é irregular (o padrão seria 'mais', que não é aceito). " +
      "Irregulares clássicos: mal/males, cônsul/cônsules, mel/méis.",
    explanationWrong:
      "Resposta: C. 'Mal → males' é plural irregular. O padrão -l → -is geraria 'mais' (errado). " +
      "Irregulares em -l merecem atenção especial em provas.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_mo_sb_q06",
    contentId: CONTENT_IDS.substantivo,
    statement:
      "(CEBRASPE — Adaptada) O substantivo 'testemunha' é epiceno feminino: " +
      "designa tanto homens quanto mulheres sem alteração de forma, e seu gênero gramatical é sempre feminino.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. 'Testemunha' NÃO é epiceno — epiceno é categoria reservada a ANIMAIS " +
      "(ex.: 'a cobra macho', 'o jacaré fêmea'). " +
      "'Testemunha' é COMUM DE DOIS GÊNEROS: uma forma para ambos os sexos, " +
      "indicados pelo artigo: 'a testemunha' (qualquer sexo). " +
      "Gênero fixo = feminino, mas não é 'epiceno' (termo técnico de animais). " +
      "Outros comuns de dois: 'a vítima', 'a pessoa', 'o cônjuge/a cônjuge'.",
    explanationCorrect:
      "Correto! O item está ERRADO. 'Testemunha' = comum de dois gêneros (não epiceno). " +
      "Epiceno = animais. Comum de dois = pessoas com gênero gramatical fixo independente do sexo biológico.",
    explanationWrong:
      "O item está ERRADO. 'Testemunha' = comum de dois gêneros, não epiceno. " +
      "Epiceno só para animais. 'Testemunha' tem gênero feminino fixo para ambos os sexos biológicos.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "por_mo_sb_q07",
    contentId: CONTENT_IDS.substantivo,
    statement:
      "(CESPE — Adaptada) Qual dos pares apresenta substantivos HETERÔNIMOS " +
      "(palavras totalmente diferentes para designar o masculino e o feminino)?",
    alternatives: [
      { letter: "A", text: "Autor / autora" },
      { letter: "B", text: "Médico / médica" },
      { letter: "C", text: "Boi / vaca" },
      { letter: "D", text: "Presidente / presidenta" },
      { letter: "E", text: "Juiz / juíza" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'boi / vaca' são heterônimos — palavras completamente diferentes " +
      "que designam o mesmo animal em gêneros distintos. " +
      "Outros heterônimos clássicos: homem/mulher, pai/mãe, rei/rainha, frei/freira, " +
      "genro/nora, bode/cabra, carneiro/ovelha, zangão/abelha. " +
      "A, B, D, E: são biformes por derivação (acréscimo de sufixo -a, -ina, etc.) — não heterônimos.",
    explanationCorrect:
      "Exato! Heterônimos: radicais completamente diferentes para cada gênero. " +
      "'Boi/vaca', 'pai/mãe', 'rei/rainha', 'homem/mulher'. Distinção cobrada em provas.",
    explanationWrong:
      "Resposta: C. 'Boi/vaca' = heterônimos (radicais distintos). " +
      "Os demais formam o feminino por sufixação (-a, -ina, -esa) — são biformes, não heterônimos.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_mo_sb_q08",
    contentId: CONTENT_IDS.substantivo,
    statement:
      "(CEBRASPE — Adaptada) O plural de 'guarda-chuva' é 'guarda-chuvas', " +
      "pois em substantivos compostos do tipo verbo + substantivo, apenas o substantivo vai ao plural.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Guarda-chuva → guarda-chuvas': composto por verbo ('guarda') + substantivo ('chuva'). " +
      "Regra: em compostos verbo + substantivo, somente o substantivo vai ao plural. " +
      "Outros exemplos: guarda-roupa → guarda-roupas; beija-flor → beija-flores; " +
      "porta-malas → porta-malas (malas já é plural); saca-rolhas → saca-rolhas. " +
      "Atenção: 'guarda' = forma verbal (imperativo de 'guardar'), não substantivo.",
    explanationCorrect:
      "Correto! Composto verbo + substantivo → só o substantivo varia: 'guarda-chuvas'. " +
      "Mesma regra: guarda-roupa/guarda-roupas, beija-flor/beija-flores.",
    explanationWrong:
      "O item está CERTO. 'Guarda-chuva → guarda-chuvas' — regra: verbo + substantivo → só o 2º varia. " +
      "O verbo fica invariável. Regra geral dos compostos hifenizados.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 6 — Verbo: Estrutura, Flexões e as Vozes Verbais
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_mo_vb_q01",
    contentId: CONTENT_IDS.verbo,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa que apresenta um verbo de LIGAÇÃO.",
    alternatives: [
      { letter: "A", text: "O agente correu até a cena do crime." },
      { letter: "B", text: "A delegada assinou o mandado de prisão." },
      { letter: "C", text: "O suspeito ficou nervoso durante o interrogatório." },
      { letter: "D", text: "A equipe encontrou evidências no local." },
      { letter: "E", text: "O investigador registrou o boletim de ocorrência." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'ficou' é verbo de ligação — liga o sujeito 'suspeito' ao predicativo 'nervoso'. " +
      "Verbos de ligação: ser, estar, ficar, parecer, permanecer, continuar, tornar-se, virar, andar, " +
      "viver (quando exprimem estado). " +
      "Nos demais: 'correu', 'assinou', 'encontrou', 'registrou' são verbos de ação (predicativos), " +
      "que constituem predicados verbais.",
    explanationCorrect:
      "Exato! 'Ficou nervoso' = verbo de ligação + predicativo do sujeito. " +
      "VL conecta sujeito ao predicativo sem expressar ação.",
    explanationWrong:
      "Resposta: C. 'Ficou' = verbo de ligação (conecta 'suspeito' ao predicativo 'nervoso'). " +
      "VL clássicos: ser, estar, ficar, parecer, permanecer, continuar, tornar-se.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_mo_vb_q02",
    contentId: CONTENT_IDS.verbo,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O suspeito foi detido pelos policiais', " +
      "o verbo está na voz passiva analítica.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Foi detido pelos policiais' = voz passiva analítica. " +
      "Estrutura: verbo auxiliar (foi = ser) + particípio (detido) + agente da passiva (pelos policiais). " +
      "O sujeito 'suspeito' sofre a ação. " +
      "Voz ativa correspondente: 'Os policiais detiveram o suspeito'. " +
      "Passiva sintética seria: 'Deteve-se o suspeito' ou 'Detiveram-se os suspeitos'.",
    explanationCorrect:
      "Correto! 'Foi detido pelos policiais' = passiva analítica: ser + particípio + agente. " +
      "O sujeito recebe a ação; os policiais são o agente da passiva.",
    explanationWrong:
      "O item está CERTO. Passiva analítica = ser/estar + particípio + [agente]. " +
      "'Foi detido pelos policiais' — o sujeito ('suspeito') sofre a ação praticada pelos policiais.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "por_mo_vb_q03",
    contentId: CONTENT_IDS.verbo,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa que apresenta a correta conversão para " +
      "a voz PASSIVA ANALÍTICA da frase: 'A equipe pericial coletou as evidências do crime'.",
    alternatives: [
      { letter: "A", text: "As evidências do crime coletou a equipe pericial." },
      { letter: "B", text: "As evidências do crime foram coletadas pela equipe pericial." },
      { letter: "C", text: "As evidências do crime se coletaram pela equipe pericial." },
      { letter: "D", text: "As evidências do crime foram coletado pela equipe pericial." },
      { letter: "E", text: "As evidências do crime é coletada pela equipe pericial." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'As evidências do crime foram coletadas pela equipe pericial.' " +
      "Conversão ativa → passiva analítica: " +
      "(1) OD da ativa → sujeito da passiva: 'as evidências do crime'. " +
      "(2) Verbo: ser conjugado no mesmo tempo do original + particípio concordando com o novo sujeito: " +
      "'foram coletadas' (plural feminino, concordando com 'evidências'). " +
      "(3) Sujeito da ativa → agente da passiva com 'por': 'pela equipe pericial'. " +
      "D: 'coletado' não concorda (deveria ser 'coletadas'). " +
      "C: é passiva sintética, não analítica.",
    explanationCorrect:
      "Exato! Passiva analítica: sujeito novo + ser (passado) + particípio (concordado) + agente. " +
      "'Foram coletadas' concorda com 'as evidências' (plural feminino).",
    explanationWrong:
      "Resposta: B. Conversão: OD → sujeito; sujeito → agente (pela...); verbo: ser + particípio concordado. " +
      "'Foram coletadas' (plural fem) concorda com 'as evidências'. Erro D: 'coletado' sem concordância.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_mo_vb_q04",
    contentId: CONTENT_IDS.verbo,
    statement:
      "(CEBRASPE — Adaptada) A frase 'Prendem-se criminosos perigosos nesta delegacia' " +
      "está na voz passiva sintética, e 'criminosos perigosos' é o sujeito paciente da oração.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Prendem-se criminosos perigosos' = voz passiva sintética (pronome 'se' = partícula apassivadora). " +
      "Estrutura: VTD + se + sujeito paciente. " +
      "O verbo 'prendem' concorda com o sujeito paciente 'criminosos perigosos' (plural). " +
      "Equivalente analítica: 'Criminosos perigosos são presos nesta delegacia'. " +
      "Distinção: se = apassivador (VTD + sujeito expresso) × se = indeterminador (VTI/VI, sem sujeito preciso).",
    explanationCorrect:
      "Correto! Passiva sintética: VTD + se + sujeito paciente. Verbo concorda com o sujeito. " +
      "'Prendem-se criminosos' = criminosos são presos. 'Se' = apassivador.",
    explanationWrong:
      "O item está CERTO. 'Prendem-se criminosos perigosos' = passiva sintética. " +
      "'Se' apassivador + VTD. Sujeito paciente 'criminosos' determina a concordância do verbo (prendem).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_mo_vb_q05",
    contentId: CONTENT_IDS.verbo,
    statement:
      "(CESPE — Adaptada) Em qual alternativa há verbo IRREGULAR na conjugação?",
    alternatives: [
      { letter: "A", text: "O delegado assinou o mandado ontem." },
      { letter: "B", text: "A perita analisou as amostras com cuidado." },
      { letter: "C", text: "O agente trouxe as evidências à delegacia." },
      { letter: "D", text: "A equipe registrou todas as ocorrências da noite." },
      { letter: "E", text: "O suspeito confessou o crime no interrogatório." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'trouxe' é forma irregular do verbo 'trazer' no pretérito perfeito do indicativo. " +
      "O radical muda: trazer → troux-. Forma regular esperada pelo padrão seria 'trazeu' (não existe). " +
      "A: 'assinou' (regular: assin-ou). B: 'analisou' (regular). D: 'registrou' (regular). " +
      "E: 'confessou' (regular). " +
      "Verbos irregulares clássicos: trazer, fazer, dizer, ver, vir, ser, ir, pôr.",
    explanationCorrect:
      "Exato! 'Trouxe' = pretérito perfeito irregular de 'trazer'. " +
      "Radical irregular: traz- / troux-. Irregulares clássicos: trazer, fazer, dizer, pôr, vir.",
    explanationWrong:
      "Resposta: C. 'Trouxe' = forma irregular de 'trazer' (radical: troux-). " +
      "Os demais verbos são regulares (terminação -ou no pretérito perfeito, sem alteração de radical).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_mo_vb_q06",
    contentId: CONTENT_IDS.verbo,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Se o delegado viesse à reunião, o caso seria resolvido', " +
      "o verbo 'viesse' está no pretérito imperfeito do subjuntivo, " +
      "modo que expressa situação hipotética ou condicionada.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Viesse' = pretérito imperfeito do subjuntivo do verbo 'vir'. " +
      "Modo subjuntivo expressa incerteza, hipótese, desejo, condição. " +
      "Nesta oração condicional: 'se viesse' indica condição hipotética (talvez não venha). " +
      "Formação: 3ª pessoa plural do pretérito perfeito do indicativo, troca-se -ram por -sse: " +
      "'vieram' → 'viesse'. Verbo irregular: 'vir' → 'vieram' → 'viesse(m)'.",
    explanationCorrect:
      "Correto! 'Viesse' = imperfeito do subjuntivo de 'vir' — hipótese condicional. " +
      "Formação: 3ª pl. pretérito perfeito indicativo (-ram → -sse): vieram → viesse.",
    explanationWrong:
      "O item está CERTO. 'Viesse' = imperfeito do subjuntivo — situação hipotética/condicional. " +
      "O subjuntivo marca incerteza: talvez o delegado não venha; é apenas hipótese.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "por_mo_vb_q07",
    contentId: CONTENT_IDS.verbo,
    statement:
      "(CESPE — Adaptada) O verbo 'imprimir' possui dois particípios: 'imprimido' (regular) " +
      "e 'impresso' (irregular). Em qual alternativa o uso está INCORRETO?",
    alternatives: [
      { letter: "A", text: "O relatório foi impresso pela assistente antes da reunião." },
      { letter: "B", text: "A delegada tinha imprimido o laudo antes de o enviar." },
      { letter: "C", text: "Os documentos foram impressos na sede da delegacia." },
      { letter: "D", text: "O agente havia imprimido velocidade à investigação." },
      { letter: "E", text: "O mandado foi imprimido com os dados incorretos." },
    ],
    correctAnswer: "E",
    correctOption: 4,
    explanation:
      "INCORRETO: 'O mandado foi imprimido com os dados incorretos.' " +
      "Regra do particípio duplo: " +
      "Com verbos auxiliares SER/ESTAR → particípio irregular: 'foi impresso'. " +
      "Com verbos auxiliares TER/HAVER → particípio regular: 'tinha imprimido'. " +
      "Em E, o auxiliar é 'foi' (ser) → deveria usar 'impresso', não 'imprimido'. " +
      "A e C: corretos ('foi/foram' + 'impresso/impressos'). " +
      "B e D: corretos ('tinha/havia' + 'imprimido').",
    explanationCorrect:
      "Exato! Auxiliar SER/ESTAR → particípio irregular (impresso). " +
      "Auxiliar TER/HAVER → particípio regular (imprimido). " +
      "Em E: 'foi imprimido' deveria ser 'foi impresso'. Regra do particípio duplo.",
    explanationWrong:
      "Resposta: E. 'Foi imprimido' está errado — com 'ser', usa-se o particípio irregular: 'foi impresso'. " +
      "Regra: SER/ESTAR + irregular; TER/HAVER + regular. Verbos com duplo particípio: imprimir, acender, eleger, prender.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_mo_vb_q08",
    contentId: CONTENT_IDS.verbo,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O réu foi preso e o advogado foi eleito defensor " +
      "pelo tribunal', ambas as formas verbais 'preso' e 'eleito' são particípios irregulares " +
      "corretamente usados com o auxiliar 'foi' (ser).",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Preso' = particípio irregular de 'prender'; 'eleito' = particípio irregular de 'eleger'. " +
      "Ambos são usados corretamente com 'foi' (auxiliar ser) — regra: SER/ESTAR + particípio irregular. " +
      "Com TER/HAVER usaríamos os regulares: 'tinha prendido' / 'havia elegido'. " +
      "Duplo particípio de 'prender': prendido (TER/HAVER) / preso (SER/ESTAR). " +
      "Duplo particípio de 'eleger': elegido (TER/HAVER) / eleito (SER/ESTAR).",
    explanationCorrect:
      "Correto! 'Foi preso' e 'foi eleito' = SER + particípio irregular. Uso correto. " +
      "Formas regulares: 'tinha prendido', 'havia elegido' (com TER/HAVER).",
    explanationWrong:
      "O item está CERTO. SER + particípio irregular: 'foi preso', 'foi eleito'. " +
      "Regra do particípio duplo: SER/ESTAR → irregular; TER/HAVER → regular.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
];

// ─── RUNNER ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Seed R38 — Densificação: Português — Morfologia / Classes de Palavras (48 questões) ===\n");

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
      "Nenhum átomo de morfologia encontrado. Verifique se os IDs estão corretos:\n" +
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

  console.log(`\n=== R38 concluído ===`);
  console.log(`  Questões inseridas : ${inseridos}`);
  console.log(`  Puladas (duplicata): ${pulados}`);
  console.log(`  Total processado   : ${questions.length}`);
  console.log(`\n  Distribuição por átomo:`);
  console.log(`    Adjetivo e Artigo        : 8 questões → ${CONTENT_IDS.adjetivoArtigo}`);
  console.log(`    Advérbio                 : 8 questões → ${CONTENT_IDS.adverbio}`);
  console.log(`    Conjunções Integrantes   : 8 questões → ${CONTENT_IDS.conjuncoesIntegrantes}`);
  console.log(`    Classes de Palavras (10) : 8 questões → ${CONTENT_IDS.classesPalavras}`);
  console.log(`    Substantivo              : 8 questões → ${CONTENT_IDS.substantivo}`);
  console.log(`    Verbo                    : 8 questões → ${CONTENT_IDS.verbo}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("ERRO no seed R38:", err);
  process.exit(1);
});
