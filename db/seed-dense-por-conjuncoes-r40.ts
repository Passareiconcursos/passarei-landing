/**
 * Seed R40 — Densificação: Português — Conjunções e Transitividade/Vozes Verbais
 * Modo: DENSIFICAÇÃO — apenas questões; átomos de conteúdo já existem no banco.
 *
 * Átomos-alvo (6 átomos × 8 questões = 48 questões):
 *   ct_mm3zcfbnqz1mkz  — Conjunções Adversativas: Oposição com Ressalva
 *   ct_mm3zcfqxt9imgo  — Conjunções Causais vs Explicativas: O Pois e seus Disfarces
 *   ct_mm3zcfff8ohx7n  — Conjunções Concessivas: A Oposição que Cede
 *   ct_mm3zcfugr2ap9s  — Conjunções Consecutivas e Proporcionais
 *   ct_mm9pduqw17p4bq  — Agente da Passiva e as Transformações de Voz Verbal
 *   ct_mm9pduh4o4ag2x  — Predicado e Transitividade Verbal: VTD, VTI, VTDI, VI e VL
 *
 * Execução: git pull && npx tsx db/seed-dense-por-conjuncoes-r40.ts
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

const CONTENT_IDS = {
  adversativas:     "ct_mm3zcfbnqz1mkz",
  causaisExplic:    "ct_mm3zcfqxt9imgo",
  concessivas:      "ct_mm3zcfff8ohx7n",
  consecPropor:     "ct_mm3zcfugr2ap9s",
  agentePassiva:    "ct_mm9pduqw17p4bq",
  transitividade:   "ct_mm9pduh4o4ag2x",
};

// ─── QUESTÕES ─────────────────────────────────────────────────────────────────

const questions = [

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 1 — Conjunções Adversativas: Oposição com Ressalva
  // Mas, porém, contudo, todavia, entretanto, no entanto, senão (= mas sim)
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_co_av_q01",
    contentId: CONTENT_IDS.adversativas,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que a conjunção adversativa " +
      "está CORRETAMENTE empregada para indicar oposição/ressalva.",
    alternatives: [
      { letter: "A", text: "O suspeito fugiu, portanto a delegada o alcançou." },
      { letter: "B", text: "A equipe trabalhou muito, logo o resultado foi insatisfatório." },
      { letter: "C", text: "O investigador era experiente, porém cometeu um erro grave." },
      { letter: "D", text: "A vítima reconheceu o agressor, pois estava muito assustada." },
      { letter: "E", text: "O laudo chegou atrasado, visto que o caso foi concluído." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'porém' é conjunção adversativa — estabelece oposição entre duas ideias: " +
      "ser experiente (positivo) mas cometer erro (negativo). " +
      "A: 'portanto' = conclusiva (não adversativa). " +
      "B: 'logo' = conclusiva. " +
      "D: 'pois' = causal ou explicativa (não adversativa). " +
      "E: 'visto que' = causal (não adversativa). " +
      "Adversativas: mas, porém, contudo, todavia, entretanto, no entanto.",
    explanationCorrect:
      "Exato! 'Porém' = adversativa — oposição entre 'experiente' e 'cometeu erro'. " +
      "Adversativas: mas, porém, contudo, todavia, entretanto, no entanto.",
    explanationWrong:
      "Resposta: C. 'Porém' = conjunção adversativa (oposição com ressalva). " +
      "Não confundir com conclusivas (portanto, logo) nem causais (pois, visto que).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_co_av_q02",
    contentId: CONTENT_IDS.adversativas,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O delegado não chegou tarde; no entanto, " +
      "a reunião já havia começado', a expressão 'no entanto' exerce valor adversativo, " +
      "estabelecendo contraste entre as duas orações.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'No entanto' é locução conjuntiva adversativa — equivalente a 'porém', 'contudo'. " +
      "Estabelece contraste: o delegado não chegou tarde (expectativa de que a reunião não começaria) " +
      "mas ela já havia começado (surpresa/oposição). " +
      "Locuções adversativas: no entanto, mesmo assim, ainda assim, apesar disso, não obstante.",
    explanationCorrect:
      "Correto! 'No entanto' = adversativa. Contraste entre chegar no horário e a reunião já ter começado. " +
      "Equivalentes: contudo, porém, todavia, entretanto.",
    explanationWrong:
      "O item está CERTO. 'No entanto' = adversativa (oposição entre as orações). " +
      "Sinônimos: contudo, porém, todavia, entretanto, não obstante.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "por_co_av_q03",
    contentId: CONTENT_IDS.adversativas,
    statement:
      "(CESPE — Adaptada) Em qual alternativa 'senão' tem valor adversativo " +
      "(= mas sim / e não), e não de condicional negativa (= se + não)?",
    alternatives: [
      { letter: "A", text: "Senão estudar, o candidato não será aprovado no concurso." },
      { letter: "B", text: "O agente não foi punido, senão promovido por seu desempenho." },
      { letter: "C", text: "Senão chegarem logo, perderão o início da operação." },
      { letter: "D", text: "Senão cooperar, o suspeito terá sua pena aumentada." },
      { letter: "E", text: "Senão concordar com o acordo, o réu irá a julgamento." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'não foi punido, senão promovido' — 'senão' = 'mas sim', 'e não'. " +
      "Equivale a: 'não foi punido, mas sim promovido'. Valor adversativo. " +
      "A, C, D, E: 'senão' = 'se não' (condicional negativa) — pode ser escrito separado (se não). " +
      "Distinção: 'senão' (= mas sim) não pode ser substituído por 'se não'; " +
      "'senão' (= se não) pode ser substituído por 'caso não'.",
    explanationCorrect:
      "Exato! 'Senão promovido' = adversativo (= 'mas sim promovido'). " +
      "Teste: substitua por 'mas sim' → funciona = adversativo; substitua por 'caso não' → condicional.",
    explanationWrong:
      "Resposta: B. 'Senão' adversativo = 'mas sim'. 'Não foi punido, senão promovido' = correto. " +
      "Nos demais, 'senão' = 'se não' (condicional) — pode ser escrito separado.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_co_av_q04",
    contentId: CONTENT_IDS.adversativas,
    statement:
      "(CEBRASPE — Adaptada) As conjunções 'mas', 'porém', 'contudo', 'todavia' e 'entretanto' " +
      "são adversativas de mesmo valor semântico e podem ser livremente substituídas umas pelas " +
      "outras em qualquer contexto sem alteração de sentido.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. Embora todas sejam adversativas, há diferenças de uso: " +
      "(1) 'Mas' pode iniciar período e tem uso mais informal; as demais são mais formais. " +
      "(2) 'Porém', 'contudo', 'todavia', 'entretanto' geralmente vêm após vírgula/ponto, " +
      "nunca iniciam oração com o mesmo efeito de 'mas'. " +
      "(3) Há diferenças sutis de ênfase e registro: 'entretanto' é mais formal que 'mas'. " +
      "Portanto, a substituição livre pode gerar efeitos estilísticos ou posicionais diferentes.",
    explanationCorrect:
      "Correto! O item está ERRADO. 'Mas' pode iniciar período; as demais geralmente não. " +
      "Há diferenças de registro (formal/informal) e de posição na oração.",
    explanationWrong:
      "O item está ERRADO. As adversativas têm valor similar, mas diferem em registro e posição. " +
      "'Mas' inicia período; 'porém/contudo/todavia' geralmente não. " +
      "Troca livre pode gerar problemas estilísticos.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_co_av_q05",
    contentId: CONTENT_IDS.adversativas,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que a substituição da conjunção " +
      "adversativa PRESERVA o sentido original da frase.",
    alternatives: [
      { letter: "A", text: "'O suspeito confessou, mas não foi condenado' → 'O suspeito confessou, pois não foi condenado'." },
      { letter: "B", text: "'A operação foi arriscada, porém bem-sucedida' → 'A operação foi arriscada, contudo bem-sucedida'." },
      { letter: "C", text: "'O agente errou, todavia foi promovido' → 'O agente errou, porque foi promovido'." },
      { letter: "D", text: "'O laudo chegou tarde, no entanto foi aceito' → 'O laudo chegou tarde, portanto foi aceito'." },
      { letter: "E", text: "'A testemunha mentiu, mas colaborou depois' → 'A testemunha mentiu, logo colaborou depois'." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'porém' → 'contudo' — ambas são adversativas de valor equivalente; " +
      "a substituição preserva o sentido de oposição ('arriscada' ↔ 'bem-sucedida'). " +
      "A: 'mas' (adversativa) → 'pois' (causal/explicativa) — muda totalmente o sentido. " +
      "C: 'todavia' (adversativa) → 'porque' (causal) — muda o sentido. " +
      "D: 'no entanto' (adversativa) → 'portanto' (conclusiva) — muda o sentido. " +
      "E: 'mas' (adversativa) → 'logo' (conclusiva) — muda o sentido.",
    explanationCorrect:
      "Exato! 'Porém' e 'contudo' são adversativas equivalentes — substituição sem mudança de sentido. " +
      "Trocar adversativa por causal, conclusiva ou explicativa altera radicalmente o significado.",
    explanationWrong:
      "Resposta: B. Adversativa por adversativa = mesmo sentido. " +
      "Trocar adversativa (mas/porém) por causal (pois/porque) ou conclusiva (portanto/logo) = erro grave de sentido.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_co_av_q06",
    contentId: CONTENT_IDS.adversativas,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O investigador queria concluir o inquérito, " +
      "não obstante os obstáculos burocráticos fossem numerosos', " +
      "a expressão 'não obstante' tem valor adversativo/concessivo e está corretamente empregada.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Não obstante' = conjunção/locução com valor adversativo-concessivo: " +
      "indica que a ação ocorre apesar dos obstáculos. " +
      "Equivalentes: apesar de que, embora, mesmo que, ainda que, conquanto. " +
      "Uso formal, frequente em textos jurídicos e administrativos. " +
      "A construção 'não obstante + substantivo/oração' é gramaticalmente correta.",
    explanationCorrect:
      "Correto! 'Não obstante' = adversativo/concessivo (= apesar de, embora). " +
      "Uso formal e jurídico correto.",
    explanationWrong:
      "O item está CERTO. 'Não obstante' = locução adversativo-concessiva. " +
      "Frequente em textos legais e administrativos — cobrada em provas de concurso.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "por_co_av_q07",
    contentId: CONTENT_IDS.adversativas,
    statement:
      "(CESPE — Adaptada) Em qual alternativa a conjunção adversativa cria " +
      "um EFEITO DE RESTRIÇÃO (ressalva parcial), e não apenas de oposição simples?",
    alternatives: [
      { letter: "A", text: "O suspeito confessou, mas o juiz não aceitou a confissão." },
      { letter: "B", text: "A operação fracassou, porém o líder escapou ileso." },
      { letter: "C", text: "O agente é competente, todavia comete erros frequentes." },
      { letter: "D", text: "O relatório estava completo, exceto pelo laudo toxicológico." },
      { letter: "E", text: "A delegada foi eficiente, entretanto o caso não foi resolvido." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "CORRETO: 'exceto pelo laudo toxicológico' — 'exceto' cria ressalva parcial: " +
      "o relatório estava completo em tudo, com exceção de um elemento. " +
      "É uma adversativa de restrição/exceção — mais precisa que as demais. " +
      "A, B, C, E: adversativas de oposição simples — duas ideias contrárias, sem necessariamente " +
      "restringir parcialmente uma das afirmações. " +
      "Adversativas de restrição/exceção: exceto, salvo, senão (= mas sim), menos.",
    explanationCorrect:
      "Exato! 'Exceto' = adversativa de restrição — indica exceção parcial, não oposição total. " +
      "Adversativas de exceção: exceto, salvo, menos, senão (adversativo).",
    explanationWrong:
      "Resposta: D. 'Exceto' = adversativa de restrição (exceção parcial). " +
      "As demais (mas, porém, todavia, entretanto) expressam oposição simples entre ideias.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_co_av_q08",
    contentId: CONTENT_IDS.adversativas,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O réu não pediu absolvição, mas sim " +
      "atenuação da pena', a expressão 'mas sim' é conjunção adversativa que " +
      "corrige e substitui a ideia negada anteriormente.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Mas sim' é locução adversativa retificadora — nega a primeira ideia e " +
      "introduce a ideia correta. Estrutura: não X, mas sim Y. " +
      "Equivalentes: 'mas antes', 'e não... mas'. " +
      "Difere da adversativa simples: não apenas contrasta, mas substitui/corrige. " +
      "Exemplos: 'Não quero punição, mas sim justiça.' / 'Não eram suspeitos, mas sim testemunhas.'",
    explanationCorrect:
      "Correto! 'Mas sim' = adversativa retificadora: nega X e propõe Y como correto. " +
      "Estrutura: 'não X, mas sim Y' = correção/substituição de ideia.",
    explanationWrong:
      "O item está CERTO. 'Mas sim' = adversativa retificadora — corrige, não apenas contrasta. " +
      "'Não absolvição, mas sim atenuação' = nega um e afirma o outro.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 2 — Conjunções Causais vs Explicativas: O Pois e seus Disfarces
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_co_ce_q01",
    contentId: CONTENT_IDS.causaisExplic,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que a conjunção destacada " +
      "é CAUSAL (oração subordinada que indica a causa real do fato).",
    alternatives: [
      { letter: "A", text: "O suspeito deve ser inocente, pois estava em outro estado." },
      { letter: "B", text: "Corra, pois a audiência começa em cinco minutos." },
      { letter: "C", text: "O delegado saiu cedo, porque tinha uma reunião importante." },
      { letter: "D", text: "Descanse, que você está muito cansado." },
      { letter: "E", text: "O agente não veio ao trabalho, porquanto estava de atestado." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'porque tinha uma reunião importante' — causal subordinada adverbial: " +
      "indica a causa real/anterior da saída. A causa (reunião) gerou o efeito (sair cedo). " +
      "A: 'pois' explicativo — justifica uma conclusão (o suspeito é inocente). " +
      "B e D: 'pois' e 'que' explicativos — justificam ordens/conselhos. " +
      "E: 'porquanto' = causal (aceitável também), menos comum. " +
      "Causal: causa anterior → efeito. Explicativa: coordenada que justifica/esclarece.",
    explanationCorrect:
      "Exato! 'Porque' = causal subordinada. A reunião é a causa real e anterior que motivou a saída. " +
      "Causais: porque, visto que, já que, uma vez que, como (antes do verbo principal).",
    explanationWrong:
      "Resposta: C. 'Porque' = causal — causa real anterior ao efeito. " +
      "'Pois' pós-verbal (A e B) = explicativa — justificação/argumento, não causa real.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_co_ce_q02",
    contentId: CONTENT_IDS.causaisExplic,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O investigador merece confiança, pois sempre " +
      "cumpriu seus deveres com excelência', o 'pois' é conjunção EXPLICATIVA, " +
      "pois introduz uma justificativa para a afirmação anterior.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Pois' após o verbo principal = conjunção coordenativa explicativa. " +
      "Justifica/explica a afirmação anterior ('merece confiança') com um argumento: " +
      "'sempre cumpriu seus deveres'. " +
      "Distinção chave do 'pois': " +
      "(1) Antes do verbo (pós-vírgula) = explicativa: 'Corra, pois vai chover'. " +
      "(2) Após o verbo (entre vírgulas, no meio da oração) = conclusiva: 'Era, pois, inocente'. " +
      "(3) Causal é quando indica causa real em oração subordinada.",
    explanationCorrect:
      "Correto! 'Pois' após vírgula + argumento → explicativa. " +
      "'Merece confiança, pois [justificativa]' = 'pois' explicativo. Correto.",
    explanationWrong:
      "O item está CERTO. 'Pois' explicativo: introduz justificativa para afirmação anterior. " +
      "Estrutura: [afirmação], pois [argumento]. Frequentíssimo em provas.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "por_co_ce_q03",
    contentId: CONTENT_IDS.causaisExplic,
    statement:
      "(CESPE — Adaptada) Em qual alternativa 'como' exerce função de conjunção CAUSAL?",
    alternatives: [
      { letter: "A", text: "O perito agiu como o protocolo determinava." },
      { letter: "B", text: "Como estava chovendo, a perícia foi adiada." },
      { letter: "C", text: "O agente correu como um atleta profissional." },
      { letter: "D", text: "A delegada resolveu o caso como sempre faz." },
      { letter: "E", text: "O laudo foi apresentado como previsto em lei." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'Como estava chovendo, a perícia foi adiada' — 'como' causal: " +
      "vem ANTES da oração principal, iniciando o período. Indica causa: a chuva causou o adiamento. " +
      "A: 'como' = conformativa (do modo que). " +
      "C: 'como' = comparativa (= igual a). " +
      "D: 'como' = conformativa (do jeito que). " +
      "E: 'como' = conformativa (conforme previsto). " +
      "Causal com 'como': SEMPRE antes da oração principal (no início do período).",
    explanationCorrect:
      "Exato! 'Como' causal = início do período + causa antes do efeito. " +
      "'Como estava chovendo [causa], a perícia foi adiada [efeito]'.",
    explanationWrong:
      "Resposta: B. 'Como' = causal quando inicia o período (causa antes do efeito). " +
      "Nos demais: conformativa (= do modo que) ou comparativa (= igual a).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_co_ce_q04",
    contentId: CONTENT_IDS.causaisExplic,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O suspeito pode ser inocente, pois apresentou " +
      "álibi consistente', o 'pois' poderia ser substituído por 'porque' sem alteração " +
      "de sentido, pois ambos expressam relação causal.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. 'Pode ser inocente, pois apresentou álibi' — o 'pois' é EXPLICATIVO: " +
      "justifica a possibilidade de inocência com um argumento (o álibi). " +
      "Se substituíssemos por 'porque': 'pode ser inocente porque apresentou álibi' — " +
      "o 'porque' tornaria a oração CAUSAL subordinada, alterando a estrutura (subordinada vs coordenada). " +
      "Semanticamente há diferença sutil: explicativa = justificação de raciocínio; " +
      "causal = causa real do fato. " +
      "A substituição muda a relação sintática (coordenação → subordinação).",
    explanationCorrect:
      "Correto! O item está ERRADO. 'Pois' explicativo ≠ 'porque' causal. " +
      "A substituição muda a relação: coordenada explicativa → subordinada causal. " +
      "Sentido e estrutura se alteram.",
    explanationWrong:
      "O item está ERRADO. 'Pois' (explicativo) ≠ 'porque' (causal). " +
      "Explicativa = coordenada (justificação de argumento). Causal = subordinada (causa real). " +
      "A estrutura sintática muda com a substituição.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_co_ce_q05",
    contentId: CONTENT_IDS.causaisExplic,
    statement:
      "(CESPE — Adaptada) Em qual alternativa a conjunção 'visto que' tem valor CAUSAL?",
    alternatives: [
      { letter: "A", text: "Visto que o delegado, o caso será resolvido." },
      { letter: "B", text: "O agente foi absolvido, visto que as provas eram insuficientes." },
      { letter: "C", text: "Visto que o suspeito é perigoso, deve ser preso." },
      { letter: "D", text: "O investigador chegou, visto que a reunião acabou." },
      { letter: "E", text: "Somente B e C estão corretos." },
    ],
    correctAnswer: "E",
    correctOption: 4,
    explanation:
      "CORRETO: B e C têm valor causal. " +
      "B: 'visto que as provas eram insuficientes' = causa da absolvição (subordinada após principal). " +
      "C: 'Visto que o suspeito é perigoso' = causa antes da oração principal (início do período). " +
      "'Visto que' é conjunção causal — pode aparecer antes ou depois da oração principal. " +
      "A: incompleto (falta predicado). D: 'visto que' com valor inadequado (a reunião não causa a chegada). " +
      "A: sentido truncado.",
    explanationCorrect:
      "Exato! 'Visto que' = causal, tanto antes quanto depois da oração principal. " +
      "B e C são os casos corretos de uso causal.",
    explanationWrong:
      "Resposta: E. 'Visto que' é causal em B (causa da absolvição) e C (causa antes da principal). " +
      "Causal: a oração com 'visto que' indica a razão/motivo da ação principal.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_co_ce_q06",
    contentId: CONTENT_IDS.causaisExplic,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Já que você está aqui, colabore com a investigação', " +
      "a conjunção 'Já que' tem valor causal-concessivo, podendo ser substituída por " +
      "'uma vez que' sem alteração significativa de sentido.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Já que você está aqui' = causal (a presença é a razão da solicitação). " +
      "'Uma vez que' é equivalente causal de 'já que' neste contexto: " +
      "'Uma vez que você está aqui, colabore...' — mesmo sentido. " +
      "Ambas introduzem orações causais subordinadas. " +
      "Outros equivalentes: como, visto que, dado que, por isso que.",
    explanationCorrect:
      "Correto! 'Já que' e 'uma vez que' são causais equivalentes. " +
      "A substituição preserva o sentido: a presença (causa) justifica o pedido de colaboração.",
    explanationWrong:
      "O item está CERTO. 'Já que' = 'uma vez que' como causais. " +
      "Ambas introduzem a razão/motivo da ação pedida na oração principal.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "por_co_ce_q07",
    contentId: CONTENT_IDS.causaisExplic,
    statement:
      "(CESPE — Adaptada) Considere as frases: " +
      "(I) 'Não vá até lá, que está chovendo muito.' " +
      "(II) 'O suspeito fugiu porque estava com medo da polícia.' " +
      "Assinale a alternativa que classifica CORRETAMENTE as conjunções em (I) e (II).",
    alternatives: [
      { letter: "A", text: "(I) causal subordinada / (II) causal subordinada." },
      { letter: "B", text: "(I) explicativa coordenada / (II) explicativa coordenada." },
      { letter: "C", text: "(I) explicativa coordenada / (II) causal subordinada." },
      { letter: "D", text: "(I) causal subordinada / (II) explicativa coordenada." },
      { letter: "E", text: "(I) adversativa / (II) causal subordinada." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: " +
      "(I) 'que está chovendo muito' — 'que' é conjunção EXPLICATIVA coordenada: " +
      "justifica a ordem 'não vá', apresentando um argumento. Não indica causa real, mas razão do conselho. " +
      "(II) 'porque estava com medo' — 'porque' é conjunção CAUSAL subordinada: " +
      "indica a causa real e anterior da fuga (o medo causou a fuga). " +
      "Distinção: explicativa = coordenada (justificação de ordem/afirmação); " +
      "causal = subordinada (causa real anterior ao efeito).",
    explanationCorrect:
      "Exato! 'Que' (I) = explicativa coordenada (justifica ordem). " +
      "'Porque' (II) = causal subordinada (causa real da fuga). Distinção clássica.",
    explanationWrong:
      "Resposta: C. 'Que' = explicativa (coordenada, justifica conselho). " +
      "'Porque' = causal (subordinada, causa real anterior). " +
      "Explicativa NÃO indica causa real — apenas justifica uma afirmação ou ordem.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_co_ce_q08",
    contentId: CONTENT_IDS.causaisExplic,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O perito não compareceu, porquanto estava " +
      "trabalhando em outro caso', a conjunção 'porquanto' tem valor causal e " +
      "é sinônima de 'porque', podendo ser usada em seu lugar em qualquer registro.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. 'Porquanto' tem valor causal, sendo sinônimo de 'porque/visto que'. " +
      "Porém, NÃO pode ser usada em qualquer registro: é uma conjunção arcaica/formal, " +
      "restrita a textos literários, jurídicos ou de alto nível formal. " +
      "Em linguagem cotidiana ou informal, 'porquanto' soa estranhíssimo e é inadequado. " +
      "Portanto, a afirmação de que pode ser usada 'em qualquer registro' está errada.",
    explanationCorrect:
      "Correto! O item está ERRADO. 'Porquanto' = causal, mas é arcaico/formal. " +
      "Não é adequado para qualquer registro — uso restrito a textos formais e literários.",
    explanationWrong:
      "O item está ERRADO. 'Porquanto' é causal (= porque), mas é arcaico e formal. " +
      "Inadequado em linguagem cotidiana. A afirmação 'qualquer registro' está incorreta.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 3 — Conjunções Concessivas: A Oposição que Cede
  // Embora, ainda que, mesmo que, se bem que, conquanto, por mais que, dado que
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_co_cn_q01",
    contentId: CONTENT_IDS.concessivas,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa que apresenta conjunção CONCESSIVA.",
    alternatives: [
      { letter: "A", text: "O suspeito fugiu porque estava com medo." },
      { letter: "B", text: "O delegado saiu mas o adjunto ficou." },
      { letter: "C", text: "Embora houvesse provas, o réu foi absolvido." },
      { letter: "D", text: "A investigação será concluída se todos cooperarem." },
      { letter: "E", text: "O agente correu tanto que chegou antes da viatura." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'Embora houvesse provas, o réu foi absolvido' — 'embora' é conjunção concessiva. " +
      "Indica que, apesar da condição (haver provas), o resultado contrário ocorreu (absolvição). " +
      "A: 'porque' = causal. B: 'mas' = adversativa. " +
      "D: 'se' = condicional. E: 'tanto que' = consecutiva. " +
      "Concessivas: embora, ainda que, mesmo que, se bem que, conquanto, por mais que, apesar de que.",
    explanationCorrect:
      "Exato! 'Embora' = concessiva (apesar de X, ocorre Y). " +
      "Concessivas: embora, ainda que, mesmo que, conquanto, por mais que.",
    explanationWrong:
      "Resposta: C. 'Embora' = concessiva — oposição que 'cede' (apesar da condição, o resultado ocorre). " +
      "Distingue-se de adversativas (oposição simples) e condicionais (hipótese).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_co_cn_q02",
    contentId: CONTENT_IDS.concessivas,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Mesmo que o suspeito negue, as evidências " +
      "o incriminam', a conjunção 'mesmo que' exige o verbo no subjuntivo " +
      "por indicar hipótese ou fato incerto.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Mesmo que' (concessiva) + subjuntivo: 'negue' = presente do subjuntivo. " +
      "Concessivas que exigem subjuntivo: mesmo que, ainda que, embora, conquanto, se bem que. " +
      "O subjuntivo é obrigatório porque a concessão indica hipótese ou fato não confirmado. " +
      "Erro clássico: 'Embora ele nega' (indicativo) → errado. Correto: 'Embora ele negue' (subjuntivo).",
    explanationCorrect:
      "Correto! 'Mesmo que' + subjuntivo = correto. Concessivas exigem modo subjuntivo. " +
      "'Mesmo que negue' (subjuntivo, correto) ≠ 'mesmo que nega' (indicativo, errado).",
    explanationWrong:
      "O item está CERTO. 'Mesmo que' + subjuntivo ('negue') = correto. " +
      "Concessivas (embora, mesmo que, ainda que) exigem subjuntivo — regra absoluta em provas.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "por_co_cn_q03",
    contentId: CONTENT_IDS.concessivas,
    statement:
      "(CESPE — Adaptada) Em qual alternativa a frase com conjunção concessiva está " +
      "com o modo verbal INCORRETO?",
    alternatives: [
      { letter: "A", text: "Embora o caso seja complexo, a delegada o resolveu." },
      { letter: "B", text: "Ainda que o suspeito fuja, será encontrado." },
      { letter: "C", text: "Conquanto todos cooperassem, o inquérito não avançou." },
      { letter: "D", text: "Mesmo que a testemunha nega, o juiz não acredita nela." },
      { letter: "E", text: "Por mais que se esforce, o perito não acha as evidências." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "INCORRETO: 'Mesmo que a testemunha nega' — 'nega' está no INDICATIVO, mas " +
      "concessivas exigem SUBJUNTIVO. Correto: 'Mesmo que a testemunha negue'. " +
      "A: 'seja' = presente do subjuntivo ✓. " +
      "B: 'fuja' = presente do subjuntivo ✓. " +
      "C: 'cooperassem' = imperfeito do subjuntivo ✓. " +
      "E: 'esforce' = presente do subjuntivo ✓.",
    explanationCorrect:
      "Exato! 'Mesmo que nega' está errado — 'mesmo que' exige subjuntivo: 'negue'. " +
      "Regra: concessivas (embora, mesmo que, ainda que, conquanto) → subjuntivo obrigatório.",
    explanationWrong:
      "Resposta: D. 'Mesmo que nega' = errado (indicativo). Correto: 'mesmo que negue' (subjuntivo). " +
      "Concessivas exigem subjuntivo — nunca use indicativo após 'embora/mesmo que/ainda que'.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_co_cn_q04",
    contentId: CONTENT_IDS.concessivas,
    statement:
      "(CEBRASPE — Adaptada) A conjunção 'apesar de que' tem valor concessivo e " +
      "pode substituir 'embora' sem qualquer mudança de sentido ou de modo verbal.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. 'Apesar de que' tem valor concessivo (= embora), mas difere quanto ao modo verbal: " +
      "'Embora' exige SUBJUNTIVO: 'Embora seja difícil...' " +
      "'Apesar de que' admite tanto INDICATIVO quanto SUBJUNTIVO: " +
      "'Apesar de que é difícil...' (indicativo, aceito). " +
      "Portanto, não há equivalência total — o modo verbal muda conforme a conjunção usada.",
    explanationCorrect:
      "Correto! O item está ERRADO. 'Apesar de que' admite indicativo; 'embora' exige subjuntivo. " +
      "A substituição pode exigir mudança de modo verbal.",
    explanationWrong:
      "O item está ERRADO. 'Apesar de que' pode ir com indicativo; 'embora' exige subjuntivo. " +
      "Não são completamente intercambiáveis — o modo verbal pode ser diferente.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_co_cn_q05",
    contentId: CONTENT_IDS.concessivas,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que a relação semântica entre " +
      "as orações é CONCESSIVA (e não adversativa).",
    alternatives: [
      { letter: "A", text: "A investigação foi longa, mas chegou a uma conclusão." },
      { letter: "B", text: "O réu era culpado, porém foi absolvido por vício processual." },
      { letter: "C", text: "Por mais que o agente se esforçasse, não achava as provas." },
      { letter: "D", text: "O delegado trabalhou muito, entretanto o caso não foi resolvido." },
      { letter: "E", text: "A operação foi bem planejada, todavia fracassou." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'Por mais que o agente se esforçasse, não achava as provas' — concessiva. " +
      "A concessiva indica que, mesmo com a condição máxima (esforço extremo), o resultado contrário persiste. " +
      "Estrutura: oração concessiva (subordinada) + oração principal (resultado contrário). " +
      "A, B, D, E: adversativas — oposição simples entre ideias coordenadas (mas, porém, entretanto, todavia). " +
      "Diferença: concessiva = oração subordinada + resultado contrário esperado; " +
      "adversativa = duas orações coordenadas que se opõem.",
    explanationCorrect:
      "Exato! 'Por mais que' = concessiva subordinada. " +
      "Adversativas (mas, porém, todavia) = coordenadas. " +
      "Concessiva: mesmo com a condição X, o resultado Y (contrário) ocorre.",
    explanationWrong:
      "Resposta: C. 'Por mais que' = concessiva (subordinada). " +
      "Adversativas (mas, porém, entretanto) = coordenadas. " +
      "Concessivas têm oração subordinada antecipando condição vencida.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_co_cn_q06",
    contentId: CONTENT_IDS.concessivas,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Se bem que o laudo fosse favorável ao réu, " +
      "o juiz manteve a prisão preventiva', a conjunção 'se bem que' tem valor " +
      "concessivo e está corretamente empregada com verbo no subjuntivo.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Se bem que' é conjunção concessiva (= embora, ainda que). " +
      "Exige verbo no subjuntivo: 'fosse' = pretérito imperfeito do subjuntivo. " +
      "Sentido: apesar de o laudo ser favorável (concessão), a prisão foi mantida (resultado contrário). " +
      "Equivalente: 'Embora o laudo fosse favorável ao réu, o juiz manteve a prisão preventiva.'",
    explanationCorrect:
      "Correto! 'Se bem que' = concessiva + subjuntivo ('fosse'). " +
      "Equivale a 'embora/ainda que'. Uso formal e correto.",
    explanationWrong:
      "O item está CERTO. 'Se bem que' = concessiva (= embora), exige subjuntivo. " +
      "'Fosse' (imperfeito do subjuntivo) está correto. Sentido: apesar do laudo favorável, prisão mantida.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "por_co_cn_q07",
    contentId: CONTENT_IDS.concessivas,
    statement:
      "(CESPE — Adaptada) Em qual alternativa a frase com valor concessivo está " +
      "CORRETAMENTE construída usando preposição (e não conjunção)?",
    alternatives: [
      { letter: "A", text: "Embora de todo o esforço, o perito não encontrou as evidências." },
      { letter: "B", text: "Apesar do esforço, o perito não encontrou as evidências." },
      { letter: "C", text: "Conquanto esforço, o perito não encontrou as evidências." },
      { letter: "D", text: "Mesmo de esforço, o perito não encontrou as evidências." },
      { letter: "E", text: "Por mais de esforço, o perito não encontrou as evidências." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'Apesar do esforço' — locução prepositiva 'apesar de' seguida de substantivo. " +
      "Quando o valor concessivo é expresso com PREPOSIÇÃO (e não conjunção), usa-se 'apesar de + substantivo'. " +
      "A: 'Embora' é conjunção — não rege substantivo diretamente. Errado. " +
      "C: 'Conquanto' é conjunção — idem. Errado. " +
      "D: 'Mesmo de' não forma locução concessiva prepositiva. Errado. " +
      "E: 'Por mais de' exigiria adjetivo/advérbio, não substantivo. Errado.",
    explanationCorrect:
      "Exato! 'Apesar de' = locução prepositiva concessiva. " +
      "Com preposição: apesar de + subst./infinitivo. Com conjunção: embora/mesmo que + verbo (subjuntivo).",
    explanationWrong:
      "Resposta: B. 'Apesar do esforço' = concessiva prepositiva. " +
      "Com substantivo ou infinitivo → 'apesar de'. Com verbo conjugado → 'embora/mesmo que' + subjuntivo.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_co_cn_q08",
    contentId: CONTENT_IDS.concessivas,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Não obstante haja provas suficientes, " +
      "o promotor solicitou mais tempo para investigar', a expressão 'não obstante' " +
      "tem valor concessivo e admite o verbo no subjuntivo ('haja').",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Não obstante' pode ter valor adversativo ou concessivo. " +
      "Neste caso, seguido de oração com verbo ('haja'), funciona como conjunção concessiva. " +
      "Admite subjuntivo ('haja') porque a concessão indica situação hipotética ou de incerteza. " +
      "Também aceita indicativo: 'não obstante há provas suficientes...' " +
      "Uso formal, frequente em textos jurídicos e administrativos.",
    explanationCorrect:
      "Correto! 'Não obstante' concessivo + 'haja' (subjuntivo) = correto. " +
      "Uso formal/jurídico. Admite também indicativo: 'não obstante há provas'.",
    explanationWrong:
      "O item está CERTO. 'Não obstante' concessivo com subjuntivo ('haja') = correto. " +
      "Uso formal muito cobrado em provas de concurso para cargos jurídicos.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 4 — Conjunções Consecutivas e Proporcionais
  // Consecutivas: tão/tanto/tamanho...que | de modo/sorte/forma/maneira que
  // Proporcionais: à medida que, à proporção que, ao passo que, quanto mais...mais
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_co_cp_q01",
    contentId: CONTENT_IDS.consecPropor,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que há conjunção CONSECUTIVA.",
    alternatives: [
      { letter: "A", text: "À medida que avançava a investigação, surgiam novas pistas." },
      { letter: "B", text: "O suspeito correu tanto que chegou a outro bairro." },
      { letter: "C", text: "Embora fosse tarde, o delegado continuou trabalhando." },
      { letter: "D", text: "O agente saiu porque tinha consulta médica." },
      { letter: "E", text: "A operação foi planejada, mas foi cancelada." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'correu tanto que chegou a outro bairro' — consecutiva. " +
      "Estrutura: tanto/tão/tamanho + que = indica a consequência do grau intenso da ação. " +
      "A: 'à medida que' = proporcional. C: 'embora' = concessiva. " +
      "D: 'porque' = causal. E: 'mas' = adversativa. " +
      "Consecutivas: tão...que, tanto...que, tamanho...que, de modo que, de sorte que, de forma que.",
    explanationCorrect:
      "Exato! 'Tanto...que' = consecutiva — a consequência ('chegou ao outro bairro') resulta " +
      "do grau intenso da ação ('correu tanto').",
    explanationWrong:
      "Resposta: B. 'Tanto...que' = consecutiva (intensidade + consequência). " +
      "Proporcional (A), concessiva (C), causal (D), adversativa (E) são outras relações.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_co_cp_q02",
    contentId: CONTENT_IDS.consecPropor,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'À medida que o inquérito avançava, " +
      "mais evidências eram descobertas', a locução 'à medida que' indica " +
      "relação de proporcionalidade entre as orações.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'À medida que' = locução conjuntiva proporcional: " +
      "indica que as duas ações ocorrem simultaneamente e proporcionalmente. " +
      "Quanto mais o inquérito avançava (1ª ação), mais evidências surgiam (2ª ação). " +
      "Atenção: 'à medida que' (proporcional) ≠ 'na medida em que' (causal/explicativa). " +
      "Erro frequente: 'à medida em que' (forma híbrida incorreta).",
    explanationCorrect:
      "Correto! 'À medida que' = proporcional (simultaneidade e proporção). " +
      "≠ 'na medida em que' (causal). 'À medida em que' = ERRADO (forma híbrida).",
    explanationWrong:
      "O item está CERTO. 'À medida que' = proporcional. " +
      "Distinção clássica: 'à medida que' (proporção) vs 'na medida em que' (causa/justificativa). " +
      "'À medida em que' é forma híbrida incorreta.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "por_co_cp_q03",
    contentId: CONTENT_IDS.consecPropor,
    statement:
      "(CESPE — Adaptada) Em qual alternativa o uso de 'de modo que' indica " +
      "relação CONSECUTIVA (e não final)?",
    alternatives: [
      { letter: "A", text: "O delegado organizou as evidências de modo que todos pudessem compreender a linha do tempo." },
      { letter: "B", text: "Falou tão alto de modo que todos na delegacia o ouviram." },
      { letter: "C", text: "Organize os documentos de modo que a análise seja facilitada." },
      { letter: "D", text: "Distribua as tarefas de modo que cada agente tenha sua função." },
      { letter: "E", text: "Redija o relatório de modo que o juiz possa entendê-lo." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'Falou tão alto de modo que todos o ouviram' — consecutiva: " +
      "a consequência ('todos ouviram') resulta da intensidade ('falou tão alto'). " +
      "A, C, D, E: 'de modo que' com valor FINAL (= para que, a fim de que) — " +
      "indicam propósito/objetivo, não consequência. " +
      "Distinção: consecutiva tem correlato de intensidade (tão, tanto, tamanho); " +
      "final indica propósito (geralmente com verbo no subjuntivo).",
    explanationCorrect:
      "Exato! 'Tão alto de modo que' = consecutiva (intensidade → consequência). " +
      "Sem correlato de intensidade, 'de modo que' tem valor final (= para que).",
    explanationWrong:
      "Resposta: B. 'Tão alto de modo que' = consecutiva (resultado da intensidade). " +
      "Nos demais, 'de modo que' = final (= para que, a fim de que) — propósito, não consequência.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_co_cp_q04",
    contentId: CONTENT_IDS.consecPropor,
    statement:
      "(CEBRASPE — Adaptada) A frase 'Na medida em que o agente se preparava, " +
      "seus resultados melhoravam' expressa relação proporcional, " +
      "sendo equivalente a 'à medida que o agente se preparava'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. 'Na medida em que' NÃO é proporcional — tem valor CAUSAL/EXPLICATIVO. " +
      "Significa 'pelo fato de que', 'porque', 'à proporção que (causal)'. " +
      "Sentido: a preparação (causa) explica a melhora dos resultados. " +
      "'À medida que' = proporcional (simultaneidade gradual). " +
      "'Na medida em que' = causal/explicativa (o fato de que X justifica Y). " +
      "As duas formas NÃO são equivalentes — distinção cobradíssima em concursos.",
    explanationCorrect:
      "Correto! O item está ERRADO. 'Na medida em que' = causal, não proporcional. " +
      "Proporcional = 'à medida que'. Distinção fundamental: 'à medida que' ≠ 'na medida em que'.",
    explanationWrong:
      "O item está ERRADO. 'Na medida em que' = causal (= porque/pelo fato de). " +
      "'À medida que' = proporcional (simultaneidade gradual). " +
      "São distintas — confundi-las é erro gravíssimo em provas.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_co_cp_q05",
    contentId: CONTENT_IDS.consecPropor,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que a relação é PROPORCIONAL.",
    alternatives: [
      { letter: "A", text: "O suspeito falou tanto que o investigador ficou confuso." },
      { letter: "B", text: "A evidência era tão frágil que foi descartada pelo juiz." },
      { letter: "C", text: "Quanto mais o perito investigava, mais pistas encontrava." },
      { letter: "D", text: "O réu foi condenado, de sorte que apelou ao tribunal." },
      { letter: "E", text: "O caso era de tal forma grave que exigiu intervenção federal." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'Quanto mais investigava, mais pistas encontrava' — proporcional. " +
      "Estrutura clássica: 'quanto mais X, mais Y' — as ações crescem proporcionalmente. " +
      "A, B, E: 'tanto que', 'tão...que', 'de tal forma...que' = consecutivas (intensidade + consequência). " +
      "D: 'de sorte que' = consecutiva. " +
      "Proporcional: duas ações que crescem/diminuem juntas na mesma ou inversa proporção.",
    explanationCorrect:
      "Exato! 'Quanto mais...mais' = proporcional. As ações se intensificam juntas. " +
      "Outros proporcionais: à medida que, à proporção que, ao passo que.",
    explanationWrong:
      "Resposta: C. 'Quanto mais...mais' = proporcional (variação simultânea e gradual). " +
      "Consecutivas (A, B, D, E) expressam consequência de intensidade, não proporcionalidade.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_co_cp_q06",
    contentId: CONTENT_IDS.consecPropor,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O agente era tão habilidoso que resolveu " +
      "o caso em tempo recorde', a conjunção 'que' introduz oração consecutiva " +
      "e o correlato é o advérbio de intensidade 'tão'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Tão habilidoso que' = consecutiva: " +
      "correlato 'tão' (intensidade) + conjunção 'que' (consequência). " +
      "A habilidade extrema causou a consequência (resolver em tempo recorde). " +
      "Estrutura: tão/tanto/tamanho + que = padrão das consecutivas. " +
      "Outros correlatos: tanto, tamanha, de tal forma, de tal modo.",
    explanationCorrect:
      "Correto! 'Tão...que' = consecutiva. 'Tão' = correlato de intensidade; 'que' = conjunção consecutiva. " +
      "A consequência ('resolveu em tempo recorde') resulta da intensidade da habilidade.",
    explanationWrong:
      "O item está CERTO. 'Tão...que' = consecutiva — intensidade (tão habilidoso) + consequência (resolveu). " +
      "Correlatos consecutivos: tão, tanto, tamanho, de tal forma.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "por_co_cp_q07",
    contentId: CONTENT_IDS.consecPropor,
    statement:
      "(CESPE — Adaptada) Em qual alternativa 'ao passo que' tem valor PROPORCIONAL " +
      "(e não adversativo)?",
    alternatives: [
      { letter: "A", text: "O delegado era rigoroso, ao passo que o adjunto era condescendente." },
      { letter: "B", text: "Ao passo que os crimes aumentavam, mais policiais eram contratados." },
      { letter: "C", text: "O inspetor trabalhava muito, ao passo que o parceiro descansava." },
      { letter: "D", text: "A investigação avançava, ao passo que os suspeitos eram liberados." },
      { letter: "E", text: "A delegada era eficiente, ao passo que os resultados eram fracos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'Ao passo que os crimes aumentavam, mais policiais eram contratados' — proporcional: " +
      "as duas ações crescem juntas (mais crimes → mais policiais). " +
      "'Ao passo que' admite dois valores: proporcional (quando há correlação gradual) " +
      "e adversativo (quando há contraste entre ideias opostas). " +
      "A, C, D, E: adversativo — contraste entre comportamentos ou situações opostas. " +
      "B: proporcional — variação simultânea e na mesma direção.",
    explanationCorrect:
      "Exato! 'Ao passo que' = proporcional em B (crimes↑ → policiais↑, variação simultânea). " +
      "Nos demais, adversativo (contraste entre opostos). O valor depende do contexto.",
    explanationWrong:
      "Resposta: B. 'Ao passo que' proporcional: variação simultânea na mesma direção. " +
      "Adversativo: contraste entre ideias opostas (A, C, D, E). Polissemia clássica de concurso.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_co_cp_q08",
    contentId: CONTENT_IDS.consecPropor,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O investigador ficou tão absorto no caso " +
      "que esqueceu de almoçar', a oração consecutiva poderia ser transformada em " +
      "uma oração adverbial causal sem alteração de sentido: " +
      "'O investigador ficou absorto no caso, porque esqueceu de almoçar'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. A transformação inverte a relação lógica: " +
      "Original (consecutiva): 'ficou tão absorto [causa: grau de absorção] que esqueceu de almoçar [consequência]'. " +
      "A causa é a absorção extrema; a consequência é esquecer de almoçar. " +
      "Transformada (causal invertida): 'ficou absorto... porque esqueceu de almoçar' — " +
      "agora seria o esquecimento a causa da absorção, o que não faz sentido. " +
      "Consecutiva e causal têm relações lógicas distintas e não são intercambiáveis por simples reformulação.",
    explanationCorrect:
      "Correto! O item está ERRADO. A transformação inverte causa e consequência. " +
      "Consecutiva: absorção extrema → esquecimento. Causal proposta: esquecimento → absorção (ilógico).",
    explanationWrong:
      "O item está ERRADO. Consecutiva: causa (grau extremo) → consequência. " +
      "Transformar em causal inverte a lógica — o esquecimento não causou a absorção. " +
      "Consecutiva e causal são relações distintas e não intercambiáveis.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 5 — Agente da Passiva e as Transformações de Voz Verbal
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_vv_ap_q01",
    contentId: CONTENT_IDS.agentePassiva,
    statement:
      "(CESPE — Adaptada) Na frase 'O mandado foi assinado pelo juiz', " +
      "identifique o AGENTE DA PASSIVA.",
    alternatives: [
      { letter: "A", text: "O mandado." },
      { letter: "B", text: "Foi assinado." },
      { letter: "C", text: "Pelo juiz." },
      { letter: "D", text: "Foi." },
      { letter: "E", text: "Assinado." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'Pelo juiz' é o agente da passiva — quem pratica a ação (assinar) na voz passiva. " +
      "O agente é introduzido pela preposição 'por' (ou 'de' em alguns casos). " +
      "'O mandado' = sujeito paciente (recebe a ação). " +
      "'Foi assinado' = locução verbal passiva (VB ser + particípio). " +
      "Voz ativa equivalente: 'O juiz assinou o mandado' — 'o juiz' é o sujeito ativo.",
    explanationCorrect:
      "Exato! 'Pelo juiz' = agente da passiva. Introduzido por 'por'. " +
      "Sujeito paciente (mandado) ↔ agente da passiva (pelo juiz) = inversão passiva.",
    explanationWrong:
      "Resposta: C. 'Pelo juiz' = agente da passiva (pratica a ação na passiva). " +
      "Sujeito paciente = quem recebe a ação. Agente = quem pratica. Preposição 'por' ou 'de'.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_vv_ap_q02",
    contentId: CONTENT_IDS.agentePassiva,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O suspeito era temido de todos na comunidade', " +
      "a preposição 'de' introduz o agente da passiva, sendo equivalente a 'por'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. O agente da passiva é geralmente introduzido por 'por', mas alguns verbos de " +
      "sentimento/estado (temer, amar, respeitar, odiar, conhecer) admitem a preposição 'de': " +
      "'era temido de todos' = 'era temido por todos'. " +
      "Ambas as formas são corretas para esses verbos. " +
      "A preposição 'de' com agente da passiva é mais literária e formal.",
    explanationCorrect:
      "Correto! 'De todos' = agente da passiva com preposição 'de'. " +
      "Verbos de sentimento (temer, amar, respeitar) admitem 'de' ou 'por' para o agente.",
    explanationWrong:
      "O item está CERTO. Agente da passiva pode ser introduzido por 'de' (além de 'por'). " +
      "Verbos como temer, amar, respeitar: 'temido de/por todos' — ambas as formas corretas.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "por_vv_ap_q03",
    contentId: CONTENT_IDS.agentePassiva,
    statement:
      "(CESPE — Adaptada) Assinale a conversão CORRETA da voz ativa para a passiva analítica.",
    alternatives: [
      { letter: "A", text: "Ativa: 'A perita analisou as amostras.' → Passiva: 'As amostras foram analisados pela perita.'" },
      { letter: "B", text: "Ativa: 'O delegado assinou os documentos.' → Passiva: 'Os documentos foram assinados pelo delegado.'" },
      { letter: "C", text: "Ativa: 'A equipe prendeu o suspeito.' → Passiva: 'O suspeito foi preso pela equipe.'" },
      { letter: "D", text: "Ativa: 'Os policiais conduziram a operação.' → Passiva: 'A operação foi conduzido pelos policiais.'" },
      { letter: "E", text: "Apenas B e C estão corretos." },
    ],
    correctAnswer: "E",
    correctOption: 4,
    explanation:
      "CORRETO: B e C estão corretos. " +
      "B: 'os documentos foram assinados pelo delegado' — particípio 'assinados' concorda com 'documentos' (masc. pl.) ✓. " +
      "C: 'o suspeito foi preso pela equipe' — 'preso' concorda com 'suspeito' (masc. sg.) ✓. " +
      "A: 'analisados' está no masculino, mas 'amostras' é feminino → deveria ser 'analisadas'. Errado. " +
      "D: 'conduzido' está no singular, mas 'operação' é feminina singular → deveria ser 'conduzida'. Errado.",
    explanationCorrect:
      "Exato! B e C corretos. O particípio concorda em gênero e número com o novo sujeito (paciente). " +
      "A: 'analisados' (masc.) ≠ 'amostras' (fem.). D: 'conduzido' (masc.) ≠ 'operação' (fem.).",
    explanationWrong:
      "Resposta: E. B e C corretos. " +
      "Regra: particípio concorda com o sujeito paciente em gênero e número. " +
      "A ('analisados'/'amostras' fem.) e D ('conduzido'/'operação' fem.) erram a concordância.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_vv_ap_q04",
    contentId: CONTENT_IDS.agentePassiva,
    statement:
      "(CEBRASPE — Adaptada) A frase 'Prendem-se criminosos perigosos nesta cidade' " +
      "está na voz passiva sintética, e o agente da passiva não está expresso.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Prendem-se criminosos perigosos' = passiva sintética: VTD + pronome apassivador 'se'. " +
      "O sujeito paciente ('criminosos perigosos') recebe a ação; o verbo concorda com ele (prendem = pl.). " +
      "O agente da passiva não está expresso — é indeterminado (não se sabe quem prende). " +
      "Passiva sintética: não tem agente expresso. Passiva analítica: pode ter agente ('por alguém').",
    explanationCorrect:
      "Correto! Passiva sintética: se + VTD + sujeito paciente. Agente indeterminado (não expresso). " +
      "'Prendem-se' concorda com 'criminosos' (pl.).",
    explanationWrong:
      "O item está CERTO. Passiva sintética = 'se' apassivador + VTD + sujeito paciente. " +
      "Agente não expresso (indeterminado). Verbo concorda com o sujeito paciente.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_vv_ap_q05",
    contentId: CONTENT_IDS.agentePassiva,
    statement:
      "(CESPE — Adaptada) Em qual alternativa a conversão para VÍDEO REFLEXIVA está correta?",
    alternatives: [
      { letter: "A", text: "Ativa: 'A delegada feriu o suspeito.' → Reflexiva: 'A delegada se feriu.'" },
      { letter: "B", text: "Ativa: 'O perito analisou a amostra.' → Reflexiva: 'O perito se analisou.'" },
      { letter: "C", text: "Ativa: 'O agente prendeu o ladrão.' → Reflexiva: 'O agente se prendeu.'" },
      { letter: "D", text: "Passiva: 'O laudo foi entregue.' → Reflexiva: 'O laudo se entregou.'" },
      { letter: "E", text: "Ativa: 'A juíza condenou o réu.' → Reflexiva: 'A juíza se condenou.'" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CORRETO: 'A delegada se feriu' — voz reflexiva: o sujeito pratica e recebe a ação ao mesmo tempo. " +
      "A delegada feriu a si mesma — o sujeito e o objeto são a mesma pessoa. " +
      "B, C, E: a conversão é gramaticalmente possível, mas o sentido fica estranho/improvável " +
      "(perito analisa a si mesmo? agente se prende?). " +
      "A reflexiva autêntica exige que a ação recair sobre o próprio sujeito seja logicamente possível. " +
      "D: a passiva com 'se' já existe ('o laudo se entregou' = passiva sintética, não reflexiva pura).",
    explanationCorrect:
      "Exato! 'A delegada se feriu' = voz reflexiva (sujeito pratica e recebe a ação). " +
      "Reflexiva: o sujeito é também o objeto — ação recai sobre si mesmo.",
    explanationWrong:
      "Resposta: A. 'A delegada se feriu' = reflexiva (ação recai sobre o próprio sujeito). " +
      "Reflexiva exige que o sujeito seja simultaneamente agente e paciente da ação.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_vv_ap_q06",
    contentId: CONTENT_IDS.agentePassiva,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O relatório será entregue amanhã pelo inspetor', " +
      "o agente da passiva é 'pelo inspetor' e o sujeito paciente é 'o relatório'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Análise da passiva analítica: " +
      "'O relatório' = sujeito paciente (recebe a ação de ser entregue). " +
      "'Será entregue' = locução verbal passiva (auxiliar 'ser' no futuro + particípio). " +
      "'Pelo inspetor' = agente da passiva (quem pratica a entrega). " +
      "Voz ativa equivalente: 'O inspetor entregará o relatório amanhã'.",
    explanationCorrect:
      "Correto! Sujeito paciente = 'o relatório' (recebe ação). Agente = 'pelo inspetor' (pratica). " +
      "Passiva analítica: sujeito paciente + ser + particípio + agente (por...).",
    explanationWrong:
      "O item está CERTO. 'O relatório' = sujeito paciente; 'pelo inspetor' = agente da passiva. " +
      "Passiva analítica = ser + particípio. Ativo equivalente: 'O inspetor entregará o relatório'.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "por_vv_ap_q07",
    contentId: CONTENT_IDS.agentePassiva,
    statement:
      "(CESPE — Adaptada) Em qual alternativa a transformação ativo → passivo está CORRETA, " +
      "incluindo o tempo verbal e a concordância?",
    alternatives: [
      { letter: "A", text: "Ativa: 'Os agentes tinham prendido os suspeitos.' → Passiva: 'Os suspeitos tinham sido presos pelos agentes.'" },
      { letter: "B", text: "Ativa: 'A delegada assinou o laudo.' → Passiva: 'O laudo foi assinado pela delegada.'  (tempo diferente)" },
      { letter: "C", text: "Ativa: 'O juiz vai condenar o réu.' → Passiva: 'O réu vai ser condenados pelo juiz.'" },
      { letter: "D", text: "Ativa: 'A equipe está resolvendo o caso.' → Passiva: 'O caso está sendo resolvido pela equipes.'" },
      { letter: "E", text: "Ativa: 'O promotor havia acusado os réus.' → Passiva: 'Os réus havia sido acusado pelo promotor.'" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CORRETO: A. 'Os agentes tinham prendido os suspeitos' → 'Os suspeitos tinham sido presos pelos agentes.' " +
      "Tempo: pretérito mais-que-perfeito composto (tinham + sido + particípio). " +
      "Concordância: 'presos' concorda com 'suspeitos' (masc. pl.) ✓. " +
      "B: assinou (pretérito perfeito) → foi assinado (pretérito perfeito) — tempo correto, mas há nota sobre tempo diferente, incorreto como afirmação. " +
      "C: 'condenados' → réu é singular → 'condenado'. " +
      "D: 'equipes' errado — deveria ser 'equipe'. " +
      "E: 'havia sido acusado' → 'réus' é plural → 'haviam sido acusados'.",
    explanationCorrect:
      "Exato! A está correta: tempo preservado (mais-que-perfeito composto: tinham sido) " +
      "e particípio concordado ('presos' com 'suspeitos' masc. pl.).",
    explanationWrong:
      "Resposta: A. Transformação correta: tempo preservado + particípio concordado. " +
      "C, D, E erram concordância ou conjugação. B tem nota inconsistente sobre tempo.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_vv_ap_q08",
    contentId: CONTENT_IDS.agentePassiva,
    statement:
      "(CEBRASPE — Adaptada) Todo verbo transitivo direto pode ser passivado " +
      "(convertido para a voz passiva), mas verbos transitivos indiretos e " +
      "verbos intransitivos NÃO admitem passiva.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Regra da voz passiva: apenas verbos transitivos diretos (VTD) admitem passivação. " +
      "O OD (direto, sem preposição) torna-se sujeito paciente na passiva. " +
      "VTI (com preposição) não passivam diretamente: não se diz 'a lei foi obedecida' " +
      "com o mesmo sentido padrão (embora alguns registros literários aceitem exceções). " +
      "VI não têm objeto → não passivam. " +
      "VTDI: pode passivizar o OD, mantendo o OI: 'O professor deu um livro ao aluno' → " +
      "'Um livro foi dado ao aluno pelo professor'.",
    explanationCorrect:
      "Correto! VTD → passiva (OD vira sujeito paciente). VTI e VI → não passivam (regra geral). " +
      "VTDI → passiviza o OD, mantendo o OI.",
    explanationWrong:
      "O item está CERTO. Só VTD admite passivação padrão (OD → sujeito paciente). " +
      "VTI e VI não têm OD → não formam passiva analítica.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 6 — Predicado e Transitividade Verbal: VTD, VTI, VTDI, VI e VL
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_vv_pt_q01",
    contentId: CONTENT_IDS.transitividade,
    statement:
      "(CESPE — Adaptada) Em qual alternativa o verbo é INTRANSITIVO (não exige complemento)?",
    alternatives: [
      { letter: "A", text: "O delegado assinou o mandado de prisão." },
      { letter: "B", text: "A perita analisou as evidências com cuidado." },
      { letter: "C", text: "O suspeito obedeceu às ordens do juiz." },
      { letter: "D", text: "O passarinho voou ao amanhecer." },
      { letter: "E", text: "A investigadora entregou o laudo ao promotor." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "CORRETO: 'voou' — verbo intransitivo, não exige complemento. " +
      "'Ao amanhecer' é adjunto adverbial (circunstância de tempo), não complemento. " +
      "A: 'assinou o mandado' — VTD (mandado = OD). " +
      "B: 'analisou as evidências' — VTD. " +
      "C: 'obedeceu às ordens' — VTI (obedece a algo). " +
      "E: 'entregou o laudo ao promotor' — VTDI (OD + OI).",
    explanationCorrect:
      "Exato! 'Voou' = intransitivo — não exige complemento. " +
      "'Ao amanhecer' = adjunto adverbial (opcional, não é complemento).",
    explanationWrong:
      "Resposta: D. 'Voou' = VI — não exige complemento. " +
      "VTD (A, B): exige OD sem preposição. VTI (C): exige OI com preposição. VTDI (E): exige OD + OI.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_vv_pt_q02",
    contentId: CONTENT_IDS.transitividade,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O investigador obedeceu às instruções do superior', " +
      "o verbo 'obedeceu' é transitivo indireto, pois exige complemento introduzido " +
      "pela preposição 'a'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Obedecer' é VTI — exige complemento com preposição 'a': 'obedecer a algo/alguém'. " +
      "'Às instruções' = 'a + as instruções' = OI (objeto indireto). " +
      "Consequência: pronome substituto = 'lhe' (não 'o/a'). " +
      "'O investigador lhe obedeceu' (correto). " +
      "Erro comum: 'obedecer alguém' (sem preposição) = errado (VTD não é a regência de obedecer).",
    explanationCorrect:
      "Correto! 'Obedecer' = VTI (regência: a + OI). 'Obedeceu às instruções' = correto. " +
      "Pronome substituto: 'lhe' (OI). Nunca 'obedeceu as instruções' sem preposição.",
    explanationWrong:
      "O item está CERTO. 'Obedecer' = VTI — exige preposição 'a'. " +
      "'Às instruções' = OI. Pronome: 'lhe'. Erro clássico: 'obedeceu as instruções' (sem preposição).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "por_vv_pt_q03",
    contentId: CONTENT_IDS.transitividade,
    statement:
      "(CESPE — Adaptada) Em qual alternativa o verbo é TRANSITIVO DIRETO E INDIRETO (VTDI)?",
    alternatives: [
      { letter: "A", text: "O suspeito fugiu da delegacia durante a madrugada." },
      { letter: "B", text: "A delegada entregou o laudo ao promotor público." },
      { letter: "C", text: "O perito analisou as amostras no laboratório forense." },
      { letter: "D", text: "O agente obedeceu às normas estabelecidas pelo regulamento." },
      { letter: "E", text: "O investigador chegou ao local antes das outras equipes." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'entregou o laudo ao promotor' — VTDI: " +
      "OD = 'o laudo' (sem preposição); OI = 'ao promotor' (com preposição 'a'). " +
      "A: 'fugiu da delegacia' — VTI (fugir de algo) ou VI com adjunto. " +
      "C: 'analisou as amostras' — VTD (só OD). " +
      "D: 'obedeceu às normas' — VTI (só OI). " +
      "E: 'chegou ao local' — VI (chegar é intransitivo; 'ao local' = adjunto adverbial de lugar).",
    explanationCorrect:
      "Exato! VTDI = dois complementos: OD (sem prep.) + OI (com prep.). " +
      "'Entregou o laudo [OD] ao promotor [OI]' — estrutura clássica de VTDI.",
    explanationWrong:
      "Resposta: B. 'Entregou' = VTDI — OD ('o laudo') + OI ('ao promotor'). " +
      "VTDI clássicos: entregar, dar, oferecer, pedir, dever. Dois complementos simultâneos.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_vv_pt_q04",
    contentId: CONTENT_IDS.transitividade,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O suspeito parecia nervoso durante o interrogatório', " +
      "o verbo 'parecia' é de ligação e o predicado da oração é nominal.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Parecia' é verbo de ligação (VL) — conecta o sujeito 'suspeito' ao predicativo 'nervoso'. " +
      "O predicado 'parecia nervoso' é NOMINAL: núcleo é o nome/adjetivo 'nervoso' (predicativo do sujeito). " +
      "VL clássicos: ser, estar, ficar, parecer, permanecer, continuar, tornar-se. " +
      "Predicado verbal = núcleo é verbo de ação. " +
      "Predicado nominal = núcleo é nome (predicativo do sujeito via VL).",
    explanationCorrect:
      "Correto! 'Parecia' = VL; predicado = nominal (núcleo: 'nervoso', predicativo do sujeito). " +
      "VL + predicativo = predicado nominal.",
    explanationWrong:
      "O item está CERTO. 'Parecia' = VL → predicado nominal (núcleo nominal 'nervoso'). " +
      "VL: ser, estar, ficar, parecer, permanecer, continuar. Predicativo do sujeito = núcleo do PN.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_vv_pt_q05",
    contentId: CONTENT_IDS.transitividade,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que o predicado é VERBO-NOMINAL " +
      "(tem dois núcleos: verbal e nominal simultaneamente).",
    alternatives: [
      { letter: "A", text: "O delegado assinou o mandado." },
      { letter: "B", text: "O suspeito estava nervoso." },
      { letter: "C", text: "A delegada chegou cansada ao plantão." },
      { letter: "D", text: "A equipe resolveu o caso complexo." },
      { letter: "E", text: "O perito é experiente." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'A delegada chegou cansada ao plantão' — predicado verbo-nominal: " +
      "'chegou' = verbo de ação (núcleo verbal) + 'cansada' = predicativo do sujeito (núcleo nominal). " +
      "Dois núcleos simultâneos: verbal (a ação) + nominal (o estado). " +
      "A: predicado verbal (só 'assinou' + OD). " +
      "B: predicado nominal ('estava nervoso' — VL + predicativo). " +
      "D: predicado verbal ('resolveu' + OD). " +
      "E: predicado nominal ('é experiente' — VL + predicativo).",
    explanationCorrect:
      "Exato! 'Chegou cansada' = verbo-nominal: verbo de ação ('chegou') + predicativo ('cansada'). " +
      "Dois núcleos simultâneos. Cansada = estado da delegada no momento da chegada.",
    explanationWrong:
      "Resposta: C. 'Chegou cansada' = predicado verbo-nominal (ação + estado simultâneos). " +
      "PV = só ação. PN = VL + predicativo. PVN = ação + predicativo (dois núcleos).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_vv_pt_q06",
    contentId: CONTENT_IDS.transitividade,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O agente assistiu ao interrogatório com atenção', " +
      "o verbo 'assistir' é transitivo indireto (no sentido de 'presenciar'), " +
      "exigindo complemento com preposição 'a'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Assistir' com sentido de 'presenciar' = VTI: assistir a algo. " +
      "'Assistiu ao interrogatório' = 'assistiu a + o interrogatório' = OI correto. " +
      "Distinção: 'assistir' (presenciar) = VTI (assistir a). " +
      "'Assistir' (ajudar/socorrer) = VTD: 'o médico assistiu o paciente' (OD). " +
      "Pegadinha clássica: 'assistir o filme' (errado no padrão culto) → 'assistir ao filme'.",
    explanationCorrect:
      "Correto! 'Assistir' (presenciar) = VTI: 'assistir a' + OI. " +
      "'Assistir ao interrogatório' correto. Erro: 'assistir o interrogatório' (sem preposição).",
    explanationWrong:
      "O item está CERTO. 'Assistir' (presenciar) = VTI — exige preposição 'a'. " +
      "Correto: 'assistir ao filme/jogo/interrogatório'. Errado: 'assistir o filme' (sem prep.).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "por_vv_pt_q07",
    contentId: CONTENT_IDS.transitividade,
    statement:
      "(CESPE — Adaptada) Em qual alternativa o verbo 'chamar' está corretamente " +
      "usado como TRANSITIVO DIRETO E INDIRETO (VTDI), exigindo OD e OI simultaneamente?",
    alternatives: [
      { letter: "A", text: "O delegado chamou os agentes para a reunião." },
      { letter: "B", text: "A promotora chamou o réu de mentiroso em plenário." },
      { letter: "C", text: "O inspetor chamou a testemunha pelo nome." },
      { letter: "D", text: "A delegada chamou o suspeito ao gabinete." },
      { letter: "E", text: "O juiz chamou todos à ordem durante a audiência." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'chamou o réu de mentiroso' — VTDI: " +
      "OD = 'o réu' (sem preposição); OI = 'de mentiroso' (preposição 'de'). " +
      "Neste sentido ('chamar alguém de algo' = denominar, qualificar), é VTDI. " +
      "A: 'chamou os agentes' (VTD) + 'para a reunião' (adjunto adverbial de finalidade). " +
      "C: 'chamou a testemunha' (VTD) + 'pelo nome' (adjunto adverbial). " +
      "D e E: 'chamou... ao gabinete/à ordem' (VTD com adjunto adverbial de lugar/modo).",
    explanationCorrect:
      "Exato! 'Chamar alguém de algo' (= denominar) = VTDI. " +
      "OD: a pessoa chamada ('o réu'). OI com 'de': o atributo ('de mentiroso').",
    explanationWrong:
      "Resposta: B. 'Chamou o réu de mentiroso' = VTDI (denominar). " +
      "OD = 'o réu'; OI = 'de mentiroso'. Regência de 'chamar': 'chamar alguém de algo'.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_vv_pt_q08",
    contentId: CONTENT_IDS.transitividade,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Convém que todos os agentes compareçam à reunião', " +
      "o verbo 'convém' é impessoal, e a oração 'que todos os agentes compareçam' " +
      "funciona como sujeito oracional (oração subordinada substantiva subjetiva).",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Convém' é verbo impessoal (não tem sujeito próprio expresso). " +
      "A oração 'que todos os agentes compareçam' é oração subordinada substantiva subjetiva — " +
      "funciona como sujeito do verbo impessoal 'convém'. " +
      "Pergunta: o que convém? — [que todos compareçam]. A resposta é a oração subjetiva. " +
      "Verbos impessoais que abrem oração subjetiva: convém, importa, cumpre, urge, é preciso.",
    explanationCorrect:
      "Correto! 'Convém' = impessoal → sujeito = oração subjetiva ('que todos compareçam'). " +
      "Verbos impessoais (convém, importa, cumpre, urge) abrem orações subjetivas.",
    explanationWrong:
      "O item está CERTO. 'Convém' = verbo impessoal. " +
      "Oração subjetiva = sujeito do verbo impessoal. " +
      "Pergunta: 'o que convém?' → 'que todos compareçam' = sujeito oracional.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
];

// ─── RUNNER ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Seed R40 — Densificação: Português — Conjunções e Transitividade/Vozes (48 questões) ===\n");

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
      "Nenhum átomo encontrado. Verifique se os IDs estão corretos:\n" +
      JSON.stringify(CONTENT_IDS, null, 2)
    );
  }

  console.log(`\nSubject: ${subjectId}`);
  console.log(`Topic:   ${topicId}`);

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

  console.log(`\n=== R40 concluído ===`);
  console.log(`  Questões inseridas : ${inseridos}`);
  console.log(`  Puladas (duplicata): ${pulados}`);
  console.log(`  Total processado   : ${questions.length}`);
  console.log(`\n  Distribuição por átomo:`);
  console.log(`    Conjunções Adversativas      : 8 questões → ${CONTENT_IDS.adversativas}`);
  console.log(`    Causais vs Explicativas      : 8 questões → ${CONTENT_IDS.causaisExplic}`);
  console.log(`    Conjunções Concessivas       : 8 questões → ${CONTENT_IDS.concessivas}`);
  console.log(`    Consecutivas e Proporcionais : 8 questões → ${CONTENT_IDS.consecPropor}`);
  console.log(`    Agente da Passiva            : 8 questões → ${CONTENT_IDS.agentePassiva}`);
  console.log(`    Predicado e Transitividade   : 8 questões → ${CONTENT_IDS.transitividade}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("ERRO no seed R40:", err);
  process.exit(1);
});
