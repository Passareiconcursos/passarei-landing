/**
 * Seed R41 — Densificação: RLM — Lógica Proposicional (Operadores, Diagramas, Argumentos)
 * Modo: DENSIFICAÇÃO — apenas questões; átomos de conteúdo já existem no banco.
 *
 * Átomos-alvo (6 átomos × 8 questões = 48 questões):
 *   rl_prop_c03              — Conjunção (p ∧ q) — O 'E' Lógico
 *   rl_prop_c04              — Disjunção (p ∨ q) — O 'OU' Lógico
 *   rl_lp_c02                — Conectivos Lógicos — Os 5 Operadores Fundamentais
 *   rl_la_c05                — Implicação Lógica vs Equivalência Lógica
 *   cml47i153b752bed3e4f413d1 — Diagramas Lógicos
 *   cml47i0y674e24a6fe28259c8 — Argumentos Lógicos
 *
 * Execução: git pull && npx tsx db/seed-dense-rlm-logica-r41.ts
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

const CONTENT_IDS = {
  conjuncao:    "rl_prop_c03",
  disjuncao:    "rl_prop_c04",
  operadores:   "rl_lp_c02",
  implEquiv:    "rl_la_c05",
  diagramas:    "cml47i153b752bed3e4f413d1",
  argumentos:   "cml47i0y674e24a6fe28259c8",
};

const questions = [

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 1 — Conjunção (p ∧ q) — O 'E' Lógico
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "rlm_lp_cj_q01",
    contentId: CONTENT_IDS.conjuncao,
    statement:
      "(CESPE — Adaptada) Considere p = 'O suspeito estava no local do crime' (V) e " +
      "q = 'O suspeito tinha motivo' (V). Qual o valor lógico de p ∧ q?",
    alternatives: [
      { letter: "A", text: "Falso, pois basta um ser verdadeiro." },
      { letter: "B", text: "Verdadeiro, pois ambos são verdadeiros." },
      { letter: "C", text: "Falso, pois a conjunção sempre resulta em falso." },
      { letter: "D", text: "Indeterminado, pois depende de contexto." },
      { letter: "E", text: "Verdadeiro apenas se p for verdadeiro." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A conjunção p ∧ q é VERDADEIRA somente quando AMBAS as proposições são verdadeiras. " +
      "Como p = V e q = V, então p ∧ q = V. " +
      "Tabela-verdade da conjunção: VV→V | VF→F | FV→F | FF→F. " +
      "Mnemônico: 'E' exigente — exige que TUDO seja verdadeiro.",
    explanationCorrect:
      "Exato! p ∧ q = V somente quando p = V e q = V. Como ambos são verdadeiros, o resultado é V.",
    explanationWrong:
      "Resposta: B. Conjunção (∧) = V somente quando AMBAS as partes são V. VV→V é a única linha verdadeira.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "rlm_lp_cj_q02",
    contentId: CONTENT_IDS.conjuncao,
    statement:
      "(CEBRASPE — Adaptada) A proposição composta 'O delegado assinou o mandado E " +
      "o suspeito foi preso' é falsa se o suspeito não foi preso, " +
      "independentemente de o delegado ter assinado ou não.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. A conjunção (∧) é falsa sempre que pelo menos UMA das proposições for falsa. " +
      "Se q = 'o suspeito foi preso' = F, então p ∧ q = F independentemente do valor de p. " +
      "VF→F e FF→F — em ambos os casos com q=F, a conjunção é falsa.",
    explanationCorrect:
      "Correto! Se qualquer componente da conjunção for falso, o todo é falso. q=F → p∧q=F sempre.",
    explanationWrong:
      "O item está CERTO. Conjunção falha se qualquer parte for falsa. q=F → p∧q=F, para qualquer valor de p.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "rlm_lp_cj_q03",
    contentId: CONTENT_IDS.conjuncao,
    statement:
      "(CESPE — Adaptada) Sejam p = 'O réu confessou' (F) e q = 'Há testemunhas' (V). " +
      "Assinale o valor lógico de ¬p ∧ q.",
    alternatives: [
      { letter: "A", text: "Falso — pois p é falso." },
      { letter: "B", text: "Verdadeiro — pois ¬p = V e q = V." },
      { letter: "C", text: "Falso — pois q é verdadeiro." },
      { letter: "D", text: "Verdadeiro — pois basta um ser verdadeiro." },
      { letter: "E", text: "Falso — pois ¬p ∧ q sempre é falso." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "p = F → ¬p = V. q = V. " +
      "Então ¬p ∧ q = V ∧ V = V. " +
      "Passo a passo: (1) negue p: ¬p = V; (2) conjunção com q: V ∧ V = V.",
    explanationCorrect:
      "Exato! ¬p = V (negação de F); V ∧ V = V. Sempre resolva a negação antes da conjunção.",
    explanationWrong:
      "Resposta: B. ¬p = V (pois p=F); V ∧ V = V. Precedência: negação (¬) antes de conjunção (∧).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "rlm_lp_cj_q04",
    contentId: CONTENT_IDS.conjuncao,
    statement:
      "(CEBRASPE — Adaptada) A negação de 'O suspeito fugiu E destruiu as evidências' é " +
      "'O suspeito não fugiu E não destruiu as evidências'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. Pela Lei de De Morgan: ¬(p ∧ q) = ¬p ∨ ¬q. " +
      "A negação da conjunção é uma DISJUNÇÃO das negações. " +
      "Correto: 'O suspeito não fugiu OU não destruiu as evidências.' " +
      "Erro clássico: negar cada parte mas manter o 'E' — isso negaria apenas as proposições simples, " +
      "não a proposição composta.",
    explanationCorrect:
      "Correto! O item está ERRADO. ¬(p ∧ q) = ¬p ∨ ¬q (De Morgan). " +
      "Negar conjunção = disjunção das negações. O 'E' vira 'OU'.",
    explanationWrong:
      "O item está ERRADO. De Morgan: ¬(p ∧ q) = ¬p ∨ ¬q. " +
      "A negação de 'fugiu E destruiu' = 'não fugiu OU não destruiu'. O conectivo muda de ∧ para ∨.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "rlm_lp_cj_q05",
    contentId: CONTENT_IDS.conjuncao,
    statement:
      "(CESPE — Adaptada) Para que a proposição 'O investigador é competente E o caso " +
      "foi resolvido' seja VERDADEIRA, é condição necessária e suficiente que:",
    alternatives: [
      { letter: "A", text: "Pelo menos uma das proposições seja verdadeira." },
      { letter: "B", text: "O investigador seja competente." },
      { letter: "C", text: "O caso tenha sido resolvido." },
      { letter: "D", text: "Ambas as proposições sejam verdadeiras." },
      { letter: "E", text: "Nenhuma das proposições seja falsa simultaneamente." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "A conjunção p ∧ q é verdadeira SE E SOMENTE SE p = V e q = V. " +
      "Esta é a condição necessária (sem ambas V, não é V) e suficiente (com ambas V, sempre é V). " +
      "A: condição para disjunção (∨), não conjunção. " +
      "E: 'nenhuma falsa simultaneamente' abrange VF e FV, que tornam a conjunção falsa.",
    explanationCorrect:
      "Exato! Conjunção V ↔ ambas V. Condição necessária e suficiente: p=V e q=V simultaneamente.",
    explanationWrong:
      "Resposta: D. p ∧ q = V ↔ p=V e q=V. Qualquer outra combinação resulta em F.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "rlm_lp_cj_q06",
    contentId: CONTENT_IDS.conjuncao,
    statement:
      "(CEBRASPE — Adaptada) Se p ∧ q é verdadeiro, então podemos concluir que " +
      "p → q também é verdadeiro.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Se p ∧ q = V, então p = V e q = V. " +
      "Com p = V e q = V, analisamos p → q: condicional é falso SOMENTE quando p=V e q=F. " +
      "Como q = V, então p → q = V. " +
      "Portanto: p ∧ q = V implica logicamente p → q = V.",
    explanationCorrect:
      "Correto! p∧q=V → p=V e q=V → p→q=V (condicional só é F quando p=V e q=F, o que não ocorre aqui).",
    explanationWrong:
      "O item está CERTO. p∧q=V garante p=V e q=V. Com q=V, o condicional p→q é necessariamente V.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "rlm_lp_cj_q07",
    contentId: CONTENT_IDS.conjuncao,
    statement:
      "(CESPE — Adaptada) Sabe-se que a proposição 'p ∧ q' é falsa e que p é verdadeiro. " +
      "Com base nisso, qual é necessariamente o valor lógico de q?",
    alternatives: [
      { letter: "A", text: "Verdadeiro, pois p é verdadeiro." },
      { letter: "B", text: "Falso, pois se p=V e p∧q=F, então q=F." },
      { letter: "C", text: "Indeterminado — q pode ser V ou F." },
      { letter: "D", text: "Verdadeiro, pois a conjunção pode ser falsa com q=V." },
      { letter: "E", text: "Falso somente se p também for falso." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "p = V e p ∧ q = F. " +
      "Da tabela-verdade da conjunção: a única linha com p=V que resulta em F é VF→F. " +
      "Portanto, q deve ser F. " +
      "Raciocínio: se p=V, a conjunção só pode ser F se q=F.",
    explanationCorrect:
      "Exato! p=V e p∧q=F → q=F. Única combinação: VF→F. Não há outra possibilidade.",
    explanationWrong:
      "Resposta: B. Com p=V e p∧q=F, a única possibilidade é q=F (linha VF→F da tabela-verdade).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "rlm_lp_cj_q08",
    contentId: CONTENT_IDS.conjuncao,
    statement:
      "(CEBRASPE — Adaptada) A proposição '¬(p ∧ q) ↔ (¬p ∨ ¬q)' é uma tautologia, " +
      "isto é, verdadeira para todos os valores lógicos possíveis de p e q.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Esta é exatamente a Lei de De Morgan para conjunção: " +
      "¬(p ∧ q) ≡ ¬p ∨ ¬q. " +
      "Duas proposições equivalentes têm o mesmo valor em todas as linhas da tabela-verdade, " +
      "portanto a bicondicional entre elas é sempre verdadeira (tautologia). " +
      "Verificação para todas as combinações: VV, VF, FV, FF — em todas, os dois lados coincidem.",
    explanationCorrect:
      "Correto! De Morgan: ¬(p∧q) ≡ ¬p∨¬q. Equivalentes lógicos formam bicondicional tautológica.",
    explanationWrong:
      "O item está CERTO. De Morgan confirma ¬(p∧q) ≡ ¬p∨¬q. " +
      "A bicondicional entre equivalentes é sempre V — é uma tautologia.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 2 — Disjunção (p ∨ q) — O 'OU' Lógico
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "rlm_lp_dj_q01",
    contentId: CONTENT_IDS.disjuncao,
    statement:
      "(CESPE — Adaptada) Considere p = 'O crime foi premeditado' (F) e " +
      "q = 'Houve legítima defesa' (V). Qual o valor lógico de p ∨ q?",
    alternatives: [
      { letter: "A", text: "Falso — pois p é falso." },
      { letter: "B", text: "Falso — pois ambos precisam ser verdadeiros." },
      { letter: "C", text: "Verdadeiro — pois pelo menos q é verdadeiro." },
      { letter: "D", text: "Indeterminado — depende do contexto jurídico." },
      { letter: "E", text: "Verdadeiro apenas se p for verdadeiro." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "A disjunção p ∨ q é VERDADEIRA quando pelo menos UMA das proposições é verdadeira. " +
      "p = F, q = V → p ∨ q = V. " +
      "Tabela-verdade da disjunção: VV→V | VF→V | FV→V | FF→F. " +
      "Somente FF→F. Mnemônico: 'OU' generoso — basta um ser verdadeiro.",
    explanationCorrect:
      "Exato! p∨q = V se pelo menos um é V. FV→V. A disjunção só é F quando ambos são F.",
    explanationWrong:
      "Resposta: C. Disjunção (∨): V quando pelo menos um componente é V. FF→F é o único caso falso.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "rlm_lp_dj_q02",
    contentId: CONTENT_IDS.disjuncao,
    statement:
      "(CEBRASPE — Adaptada) A proposição 'O agente estava de folga OU participou " +
      "da operação' é falsa somente quando ambas as proposições componentes são falsas.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. A disjunção inclusiva (∨) só é falsa na combinação FF. " +
      "Em todas as outras combinações (VV, VF, FV) ela é verdadeira. " +
      "Portanto, a afirmação está correta: p ∨ q = F ↔ p = F e q = F.",
    explanationCorrect:
      "Correto! Disjunção inclusiva = F somente quando ambos são F. " +
      "VV→V, VF→V, FV→V, FF→F.",
    explanationWrong:
      "O item está CERTO. p∨q = F somente se p=F e q=F. Qualquer V em qualquer componente torna a disjunção V.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "rlm_lp_dj_q03",
    contentId: CONTENT_IDS.disjuncao,
    statement:
      "(CESPE — Adaptada) A negação da proposição 'O suspeito fugiu OU destruiu as provas' é:",
    alternatives: [
      { letter: "A", text: "'O suspeito não fugiu OU não destruiu as provas'." },
      { letter: "B", text: "'O suspeito não fugiu E não destruiu as provas'." },
      { letter: "C", text: "'O suspeito fugiu E destruiu as provas'." },
      { letter: "D", text: "'O suspeito não fugiu OU destruiu as provas'." },
      { letter: "E", text: "'É falso que o suspeito fugiu OU destruiu as provas'." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Pela Lei de De Morgan: ¬(p ∨ q) = ¬p ∧ ¬q. " +
      "A negação da disjunção é a CONJUNÇÃO das negações. " +
      "'Não (fugiu OU destruiu)' = 'não fugiu E não destruiu'. " +
      "O conectivo ∨ vira ∧ na negação. " +
      "A: mantém o OU — errado. C: afirma ambos — é o caso em que a disjunção seria V, não sua negação.",
    explanationCorrect:
      "Exato! De Morgan: ¬(p∨q) = ¬p ∧ ¬q. Negação de disjunção = conjunção das negações. OU vira E.",
    explanationWrong:
      "Resposta: B. De Morgan: ¬(p∨q) = ¬p ∧ ¬q. " +
      "'Não fugiu E não destruiu'. O OU vira E na negação — regra simétrica à do ∧.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "rlm_lp_dj_q04",
    contentId: CONTENT_IDS.disjuncao,
    statement:
      "(CEBRASPE — Adaptada) A disjunção exclusiva (p ⊻ q) difere da disjunção inclusiva " +
      "(p ∨ q) apenas quando ambas as proposições são verdadeiras: nesse caso, " +
      "∨ resulta em V e ⊻ resulta em F.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Comparando as tabelas-verdade: " +
      "VV: ∨ = V, ⊻ = F (diferem!). " +
      "VF: ∨ = V, ⊻ = V (iguais). " +
      "FV: ∨ = V, ⊻ = V (iguais). " +
      "FF: ∨ = F, ⊻ = F (iguais). " +
      "A única diferença está na linha VV: inclusivo aceita ambos verdadeiros; exclusivo rejeita.",
    explanationCorrect:
      "Correto! ∨ vs ⊻: única diferença na linha VV (ambos V). ∨=V, ⊻=F. Nas demais linhas são iguais.",
    explanationWrong:
      "O item está CERTO. ∨ inclusivo vs ⊻ exclusivo: diferem somente quando p=V e q=V. " +
      "Inclusivo: VV→V. Exclusivo: VV→F ('ou um ou outro, mas não ambos').",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "rlm_lp_dj_q05",
    contentId: CONTENT_IDS.disjuncao,
    statement:
      "(CESPE — Adaptada) Sabe-se que p ∨ q é falso. Com base nisso, qual é " +
      "o valor lógico de p → q?",
    alternatives: [
      { letter: "A", text: "Falso — pois p∨q é falso." },
      { letter: "B", text: "Verdadeiro — pois p=F e q=F, e F→F = V." },
      { letter: "C", text: "Indeterminado — não há informação suficiente." },
      { letter: "D", text: "Falso — pois q é falso." },
      { letter: "E", text: "Verdadeiro — pois p∨q = F implica p→q = V." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "p ∨ q = F → p = F e q = F (única combinação que torna disjunção falsa). " +
      "Com p = F: p → q = F → F = V. " +
      "Condicional é falso somente quando p=V e q=F. Com p=F, o condicional é sempre V. " +
      "Portanto p → q = V.",
    explanationCorrect:
      "Exato! p∨q=F → p=F e q=F. Com p=F, o condicional p→q=V (hipótese falsa → condicional V).",
    explanationWrong:
      "Resposta: B. p∨q=F impõe p=F e q=F. Condicional com antecedente falso: F→F=V sempre.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "rlm_lp_dj_q06",
    contentId: CONTENT_IDS.disjuncao,
    statement:
      "(CEBRASPE — Adaptada) A proposição 'p ∨ q' é logicamente equivalente a '¬p → q'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Verificando a equivalência p∨q ≡ ¬p→q: " +
      "VV: p∨q=V; ¬p→q = F→V = V ✓. " +
      "VF: p∨q=V; ¬p→q = F→F = V ✓. " +
      "FV: p∨q=V; ¬p→q = V→V = V ✓. " +
      "FF: p∨q=F; ¬p→q = V→F = F ✓. " +
      "Todas as linhas coincidem — são logicamente equivalentes.",
    explanationCorrect:
      "Correto! p∨q ≡ ¬p→q. Equivalência verificada em todas as 4 linhas da tabela-verdade.",
    explanationWrong:
      "O item está CERTO. p∨q ≡ ¬p→q — equivalência fundamental da lógica proposicional. " +
      "Verificar linha a linha: VV, VF, FV, FF — todos coincidem.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "rlm_lp_dj_q07",
    contentId: CONTENT_IDS.disjuncao,
    statement:
      "(CESPE — Adaptada) Dada a proposição verdadeira 'O delegado saiu OU o adjunto ficou', " +
      "e sabendo-se que 'O delegado saiu' é falso, qual conclusão é necessariamente válida?",
    alternatives: [
      { letter: "A", text: "O adjunto também saiu." },
      { letter: "B", text: "O adjunto ficou." },
      { letter: "C", text: "Nenhuma conclusão é possível." },
      { letter: "D", text: "O delegado voltou logo depois." },
      { letter: "E", text: "O adjunto pode ter ficado ou saído." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "p ∨ q = V e p = F. " +
      "Da tabela: a única linha com p=F que torna p∨q=V é FV→V. " +
      "Portanto q = V: 'O adjunto ficou' é necessariamente verdadeiro. " +
      "Raciocínio: disjunção V com antecedente F obriga o consequente a ser V.",
    explanationCorrect:
      "Exato! p=F e p∨q=V → q=V. Única linha compatível: FV→V. O adjunto ficou necessariamente.",
    explanationWrong:
      "Resposta: B. p∨q=V e p=F → q=V obrigatoriamente (linha FV→V da tabela). " +
      "Se a disjunção é V e um lado é F, o outro lado deve ser V.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "rlm_lp_dj_q08",
    contentId: CONTENT_IDS.disjuncao,
    statement:
      "(CEBRASPE — Adaptada) A proposição '¬p ∨ q' é logicamente equivalente ao " +
      "condicional 'p → q'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Esta é uma das equivalências fundamentais da lógica: p → q ≡ ¬p ∨ q. " +
      "Verificação: VV: ¬p∨q=F∨V=V; p→q=V ✓. " +
      "VF: ¬p∨q=F∨F=F; p→q=F ✓. " +
      "FV: ¬p∨q=V∨V=V; p→q=V ✓. " +
      "FF: ¬p∨q=V∨F=V; p→q=V ✓. " +
      "Todas coincidem — equivalência confirmada.",
    explanationCorrect:
      "Correto! p→q ≡ ¬p∨q — equivalência fundamental. Muito usada para negar condicionais e simplificar expressões.",
    explanationWrong:
      "O item está CERTO. p→q ≡ ¬p∨q é equivalência clássica. " +
      "Permite reescrever condicionais como disjunções — cobradíssimo em concursos.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 3 — Os 5 Operadores Fundamentais
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "rlm_lp_op_q01",
    contentId: CONTENT_IDS.operadores,
    statement:
      "(CESPE — Adaptada) Associe corretamente cada símbolo ao seu nome e ao conectivo " +
      "em linguagem natural. Assinale a alternativa INCORRETA.",
    alternatives: [
      { letter: "A", text: "¬p = Negação = 'Não p'." },
      { letter: "B", text: "p ∧ q = Conjunção = 'p E q'." },
      { letter: "C", text: "p ∨ q = Condicional = 'Se p, então q'." },
      { letter: "D", text: "p → q = Condicional = 'Se p, então q'." },
      { letter: "E", text: "p ↔ q = Bicondicional = 'p se e somente se q'." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "INCORRETO: 'p ∨ q = Condicional' está errado. " +
      "p ∨ q é a DISJUNÇÃO ('p OU q'), não o condicional. " +
      "O condicional é p → q ('Se p, então q'). " +
      "Os 5 operadores: ¬ (negação), ∧ (conjunção/E), ∨ (disjunção/OU), " +
      "→ (condicional/SE-ENTÃO), ↔ (bicondicional/SE E SOMENTE SE).",
    explanationCorrect:
      "Exato! p∨q = disjunção (OU), não condicional. O condicional é p→q. A associação C está errada.",
    explanationWrong:
      "Resposta: C. p∨q = DISJUNÇÃO (OU). Condicional = p→q (Se...então). Os 5 operadores: ¬ ∧ ∨ → ↔.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "rlm_lp_op_q02",
    contentId: CONTENT_IDS.operadores,
    statement:
      "(CEBRASPE — Adaptada) O condicional 'p → q' é falso somente quando " +
      "o antecedente p é verdadeiro e o consequente q é falso.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Tabela-verdade do condicional: VV→V | VF→F | FV→V | FF→V. " +
      "Única linha falsa: p=V e q=F (VF→F). " +
      "Interpretação: a promessa 'Se p, então q' só é quebrada quando p ocorre (V) mas q não (F). " +
      "Quando p=F, o condicional é vacuamente verdadeiro (a promessa não foi ativada).",
    explanationCorrect:
      "Correto! p→q = F somente na linha VF. Nas demais (VV, FV, FF) é V.",
    explanationWrong:
      "O item está CERTO. Condicional falso somente com p=V e q=F. Mnemônico: 'a promessa só quebra quando o antecedente ocorre mas o consequente não'.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "rlm_lp_op_q03",
    contentId: CONTENT_IDS.operadores,
    statement:
      "(CESPE — Adaptada) A contrapositiva de 'Se o suspeito estava no local, " +
      "então ele é culpado' é:",
    alternatives: [
      { letter: "A", text: "'Se o suspeito é culpado, então ele estava no local'." },
      { letter: "B", text: "'Se o suspeito não estava no local, então ele não é culpado'." },
      { letter: "C", text: "'Se o suspeito não é culpado, então ele não estava no local'." },
      { letter: "D", text: "'O suspeito estava no local e não é culpado'." },
      { letter: "E", text: "'O suspeito não estava no local ou é culpado'." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "A contrapositiva de p → q é ¬q → ¬p (nega e inverte antecedente e consequente). " +
      "p = 'estava no local'; q = 'é culpado'. " +
      "Contrapositiva: 'Se não é culpado (¬q), então não estava no local (¬p)'. " +
      "A: recíproca (q→p) — não equivalente. " +
      "B: inversa (¬p→¬q) — não equivalente. " +
      "p→q ≡ ¬q→¬p (contrapositiva é equivalência fundamental).",
    explanationCorrect:
      "Exato! Contrapositiva: ¬q→¬p. Nega e inverte. p→q ≡ ¬q→¬p (equivalência). " +
      "Recíproca (q→p) e inversa (¬p→¬q) NÃO são equivalentes.",
    explanationWrong:
      "Resposta: C. Contrapositiva: ¬q→¬p — nega o consequente e nega o antecedente, invertendo. " +
      "p→q ≡ ¬q→¬p. Recíproca e inversa NÃO são equivalentes ao original.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "rlm_lp_op_q04",
    contentId: CONTENT_IDS.operadores,
    statement:
      "(CEBRASPE — Adaptada) O bicondicional 'p ↔ q' é verdadeiro quando p e q " +
      "têm o mesmo valor lógico (ambos V ou ambos F), e falso quando têm valores distintos.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Tabela-verdade do bicondicional: VV→V | VF→F | FV→F | FF→V. " +
      "O bicondicional equivale a (p→q) ∧ (q→p) — ida e volta. " +
      "É verdadeiro quando os valores coincidem: VV ou FF. " +
      "Falso quando divergem: VF ou FV.",
    explanationCorrect:
      "Correto! p↔q = V quando p e q têm mesmo valor (VV→V, FF→V). " +
      "Falso quando divergem (VF→F, FV→F).",
    explanationWrong:
      "O item está CERTO. Bicondicional: V quando valores iguais (VV, FF), F quando diferentes (VF, FV). " +
      "Equivale a 'p se e somente se q'.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "rlm_lp_op_q05",
    contentId: CONTENT_IDS.operadores,
    statement:
      "(CESPE — Adaptada) A negação do condicional 'Se o réu confessou, então foi condenado' é:",
    alternatives: [
      { letter: "A", text: "'Se o réu não confessou, então não foi condenado'." },
      { letter: "B", text: "'O réu confessou e não foi condenado'." },
      { letter: "C", text: "'O réu não confessou ou foi condenado'." },
      { letter: "D", text: "'Se o réu foi condenado, então confessou'." },
      { letter: "E", text: "'O réu não confessou e não foi condenado'." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "¬(p → q) = p ∧ ¬q. " +
      "A negação do condicional é a conjunção do antecedente com a negação do consequente. " +
      "'O réu confessou [p] E não foi condenado [¬q].' " +
      "Raciocínio: p→q = F somente na linha VF — ou seja, p=V e q=F. " +
      "A: inversa negada — errado. C: ¬p∨q = equivalente a p→q, não sua negação.",
    explanationCorrect:
      "Exato! ¬(p→q) = p ∧ ¬q. 'Confessou E não foi condenado.' " +
      "Memorize: negação do condicional = antecedente ∧ ¬consequente.",
    explanationWrong:
      "Resposta: B. ¬(p→q) = p ∧ ¬q. 'Confessou E não foi condenado.' " +
      "O condicional falha quando p ocorre mas q não — essa é sua negação.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "rlm_lp_op_q06",
    contentId: CONTENT_IDS.operadores,
    statement:
      "(CEBRASPE — Adaptada) A proposição 'p → q' e sua recíproca 'q → p' são " +
      "logicamente equivalentes.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. p→q e q→p NÃO são equivalentes. Contraexemplo: p=V, q=F. " +
      "p→q = VF = F. q→p = FV = V. Valores diferentes — não são equivalentes. " +
      "Equivalências do condicional: p→q ≡ ¬q→¬p (contrapositiva). " +
      "NÃO equivalentes: q→p (recíproca) e ¬p→¬q (inversa).",
    explanationCorrect:
      "Correto! O item está ERRADO. p→q ≢ q→p. Contraexemplo: p=V, q=F → p→q=F, q→p=V.",
    explanationWrong:
      "O item está ERRADO. Recíproca (q→p) NÃO é equivalente a p→q. " +
      "Equivalente: contrapositiva (¬q→¬p). Não equivalentes: recíproca e inversa.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "rlm_lp_op_q07",
    contentId: CONTENT_IDS.operadores,
    statement:
      "(CESPE — Adaptada) Sabe-se que 'p → q' é verdadeiro e que 'q' é falso. " +
      "Qual é o valor necessário de p?",
    alternatives: [
      { letter: "A", text: "p = Verdadeiro." },
      { letter: "B", text: "p = Falso." },
      { letter: "C", text: "p pode ser V ou F — indeterminado." },
      { letter: "D", text: "p = Verdadeiro, pois q é falso." },
      { letter: "E", text: "p = Falso somente se q for verdadeiro." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "p → q = V e q = F. " +
      "Analisando as linhas da tabela com q=F: " +
      "VF→F (p=V, q=F → condicional=F) — contradiz p→q=V. " +
      "FF→V (p=F, q=F → condicional=V) — compatível com p→q=V. " +
      "Portanto p deve ser F. " +
      "Este é o Modus Tollens: {p→q, ¬q} ⊢ ¬p.",
    explanationCorrect:
      "Exato! Modus Tollens: p→q=V e q=F → p=F. " +
      "Com q=F, só FF→V é compatível com p→q=V. Logo p=F.",
    explanationWrong:
      "Resposta: B. Modus Tollens: p→q e ¬q → ¬p. " +
      "Com q=F e condicional=V, a única linha compatível é FF→V. Portanto p=F.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "rlm_lp_op_q08",
    contentId: CONTENT_IDS.operadores,
    statement:
      "(CEBRASPE — Adaptada) A proposição '(p → q) ∧ (q → p)' é logicamente equivalente " +
      "ao bicondicional 'p ↔ q'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. O bicondicional p↔q equivale à conjunção do condicional e sua recíproca: " +
      "p↔q ≡ (p→q) ∧ (q→p). " +
      "Verificação: VV: (V∧V)=V; ↔=V ✓. VF: (F∧V)=F; ↔=F ✓. " +
      "FV: (V∧F)=F; ↔=F ✓. FF: (V∧V)=V; ↔=V ✓. Todas coincidem.",
    explanationCorrect:
      "Correto! p↔q ≡ (p→q)∧(q→p). O bicondicional é a ida E a volta do condicional.",
    explanationWrong:
      "O item está CERTO. p↔q = (p→q)∧(q→p) — definição do bicondicional. " +
      "'p se e somente se q' = 'p implica q' E 'q implica p'.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 4 — Implicação Lógica vs Equivalência Lógica
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "rlm_la_ie_q01",
    contentId: CONTENT_IDS.implEquiv,
    statement:
      "(CESPE — Adaptada) Dizemos que p implica logicamente q (p ⊨ q) quando:",
    alternatives: [
      { letter: "A", text: "p e q têm sempre o mesmo valor lógico." },
      { letter: "B", text: "Não existe situação em que p seja verdadeiro e q seja falso." },
      { letter: "C", text: "p → q é verdadeiro em pelo menos uma situação." },
      { letter: "D", text: "p e q são ambos verdadeiros." },
      { letter: "E", text: "q implica p em todas as situações." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Implicação lógica p ⊨ q: não existe valoração em que p=V e q=F. " +
      "Equivale a: p → q é uma tautologia (sempre V). " +
      "A: isso é equivalência lógica (≡), não implicação. " +
      "C: implicação exige que p→q seja SEMPRE V, não apenas em alguma situação. " +
      "D: insuficiente — não garante a relação para todos os casos.",
    explanationCorrect:
      "Exato! p⊨q: impossível p=V com q=F em qualquer valoração. " +
      "p→q é tautologia. Distinção: implicação (⊨) vs equivalência (≡) vs condicional (→).",
    explanationWrong:
      "Resposta: B. Implicação lógica: p→q é tautologia (nunca p=V com q=F). " +
      "Diferente da equivalência (valores sempre iguais) e do condicional (operador pontual).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "rlm_la_ie_q02",
    contentId: CONTENT_IDS.implEquiv,
    statement:
      "(CEBRASPE — Adaptada) Se p e q são logicamente equivalentes (p ≡ q), " +
      "então o bicondicional p ↔ q é uma tautologia.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. p ≡ q significa que p e q têm o mesmo valor lógico em todas as valorações. " +
      "O bicondicional p↔q é V quando p e q têm o mesmo valor. " +
      "Se isso ocorre em TODAS as valorações, p↔q é verdadeiro em todas — portanto é tautologia. " +
      "Definição de tautologia: proposição V para todos os valores possíveis.",
    explanationCorrect:
      "Correto! p≡q → p↔q é tautologia. Equivalência lógica implica bicondicional sempre verdadeiro.",
    explanationWrong:
      "O item está CERTO. p≡q significa p↔q=V em todas as valorações = tautologia. " +
      "Testar equivalência: se p↔q é tautologia, então p e q são logicamente equivalentes.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "rlm_la_ie_q03",
    contentId: CONTENT_IDS.implEquiv,
    statement:
      "(CESPE — Adaptada) Qual par de proposições representa uma EQUIVALÊNCIA LÓGICA?",
    alternatives: [
      { letter: "A", text: "p → q  e  q → p" },
      { letter: "B", text: "p → q  e  ¬p → ¬q" },
      { letter: "C", text: "p → q  e  ¬q → ¬p" },
      { letter: "D", text: "p ∧ q  e  p ∨ q" },
      { letter: "E", text: "¬(p ∧ q)  e  ¬p ∧ ¬q" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: p→q ≡ ¬q→¬p (contrapositiva). " +
      "A: p→q e q→p — recíproca, NÃO equivalente. " +
      "B: p→q e ¬p→¬q — inversa, NÃO equivalente. " +
      "D: conjunção e disjunção têm tabelas diferentes. " +
      "E: De Morgan: ¬(p∧q) = ¬p∨¬q, não ¬p∧¬q. " +
      "Equivalências do condicional: original ≡ contrapositiva; recíproca ≡ inversa.",
    explanationCorrect:
      "Exato! p→q ≡ ¬q→¬p (contrapositiva). " +
      "Par equivalente: original e contrapositiva. Não equivalentes: recíproca e inversa.",
    explanationWrong:
      "Resposta: C. Contrapositiva ¬q→¬p é logicamente equivalente a p→q. " +
      "Recíproca (q→p) e inversa (¬p→¬q) são equivalentes entre si, mas não ao original.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "rlm_la_ie_q04",
    contentId: CONTENT_IDS.implEquiv,
    statement:
      "(CEBRASPE — Adaptada) O fato de 'p → q' ser verdadeiro implica logicamente que " +
      "'q → p' também é verdadeiro.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. p→q verdadeiro NÃO implica q→p verdadeiro. " +
      "Contraexemplo: p='Está chovendo'=V, q='O chão está molhado'=V → p→q=V. " +
      "Mas q→p: 'Se o chão está molhado, então está chovendo' pode ser F (o chão pode estar molhado por outro motivo). " +
      "No campo formal: p=V, q=F → p→q=F; mas p=F, q=V → p→q=V e q→p=FV=V... " +
      "A recíproca não é implicada pelo condicional original.",
    explanationCorrect:
      "Correto! O item está ERRADO. p→q=V não garante q→p=V. " +
      "São independentes. Contraexemplo trivial: p=F, q=V → p→q=V mas q→p=FV? Não, FV=V também. " +
      "Melhor: p=V, q=V, mas 'todo cachorro é animal' (V) não implica 'todo animal é cachorro' (F).",
    explanationWrong:
      "O item está ERRADO. p→q não implica q→p. " +
      "Exemplo clássico: 'Se é cachorro, é animal' (V) não implica 'Se é animal, é cachorro' (F).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "rlm_la_ie_q05",
    contentId: CONTENT_IDS.implEquiv,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa que apresenta uma TAUTOLOGIA.",
    alternatives: [
      { letter: "A", text: "p ∧ ¬p" },
      { letter: "B", text: "p ∨ ¬p" },
      { letter: "C", text: "p → ¬p" },
      { letter: "D", text: "p ∧ q" },
      { letter: "E", text: "p ↔ ¬p" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: p ∨ ¬p = Lei do Terceiro Excluído — sempre verdadeiro. " +
      "p=V: V∨F=V. p=F: F∨V=V. Sempre V → tautologia. " +
      "A: p∧¬p = Contradição — sempre F (Lei da Não Contradição). " +
      "C: p→¬p: p=V → V→F=F; p=F → F→V=V — não é sempre V. " +
      "D: p∧q — falso em VF, FV, FF. E: p↔¬p — sempre F.",
    explanationCorrect:
      "Exato! p∨¬p = tautologia (Terceiro Excluído). Sempre V. " +
      "p∧¬p = contradição (sempre F). São os exemplos clássicos.",
    explanationWrong:
      "Resposta: B. p∨¬p = tautologia. p=V→V∨F=V; p=F→F∨V=V. Sempre verdadeiro. " +
      "Contradição: p∧¬p (sempre F). Tautologia clássica: p∨¬p.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "rlm_la_ie_q06",
    contentId: CONTENT_IDS.implEquiv,
    statement:
      "(CEBRASPE — Adaptada) 'p ∧ ¬p' é uma contradição lógica, pois " +
      "é falsa para qualquer valor de p.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. p∧¬p: p=V → V∧F=F; p=F → F∧V=F. Sempre F — definição de contradição. " +
      "Contradição = proposição falsa em todas as valorações possíveis. " +
      "Tautologia = sempre V. Contingência = às vezes V, às vezes F. " +
      "p∧¬p é a Lei da Não Contradição aplicada: algo não pode ser V e F ao mesmo tempo.",
    explanationCorrect:
      "Correto! p∧¬p = contradição (sempre F). Oposto da tautologia (sempre V).",
    explanationWrong:
      "O item está CERTO. p∧¬p = contradição clássica. Nunca V. " +
      "Lei da Não Contradição: uma proposição não pode ser V e ¬V simultaneamente.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "rlm_la_ie_q07",
    contentId: CONTENT_IDS.implEquiv,
    statement:
      "(CESPE — Adaptada) Quais das proposições abaixo são logicamente equivalentes?",
    alternatives: [
      { letter: "A", text: "¬(p ∨ q)  e  ¬p ∨ ¬q" },
      { letter: "B", text: "¬(p ∧ q)  e  ¬p ∨ ¬q" },
      { letter: "C", text: "p → q  e  p ∧ ¬q" },
      { letter: "D", text: "p ↔ q  e  p ∨ q" },
      { letter: "E", text: "¬p → ¬q  e  ¬q → ¬p" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: ¬(p∧q) ≡ ¬p∨¬q — Lei de De Morgan para conjunção. " +
      "A: ¬(p∨q) = ¬p∧¬q (não ¬p∨¬q) — errado (De Morgan da disjunção). " +
      "C: p→q ≡ ¬p∨q, não p∧¬q (isso é a negação do condicional). " +
      "D: bicondicional ≠ disjunção. " +
      "E: ¬p→¬q é a inversa de q→p; ¬q→¬p é a contrapositiva de p→q — são equivalentes, " +
      "mas entre si ¬p→¬q ≡ q→p (recíproca), não ¬q→¬p.",
    explanationCorrect:
      "Exato! De Morgan: ¬(p∧q) ≡ ¬p∨¬q. Equivalência fundamental cobrada em todo concurso.",
    explanationWrong:
      "Resposta: B. De Morgan: ¬(p∧q) = ¬p∨¬q. " +
      "As duas leis de De Morgan: ¬(p∧q)=¬p∨¬q e ¬(p∨q)=¬p∧¬q.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "rlm_la_ie_q08",
    contentId: CONTENT_IDS.implEquiv,
    statement:
      "(CEBRASPE — Adaptada) Se p ⊨ q (p implica logicamente q) e q ⊨ p " +
      "(q implica logicamente p), então p e q são logicamente equivalentes (p ≡ q).",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Se p⊨q e q⊨p, então: não existe caso p=V e q=F, e não existe caso q=V e p=F. " +
      "Portanto, p e q sempre têm o mesmo valor → p≡q (equivalência). " +
      "Equivalência = implicação nos dois sentidos: p≡q ↔ (p⊨q e q⊨p).",
    explanationCorrect:
      "Correto! Equivalência lógica = implicação mútua. p⊨q e q⊨p → p≡q. " +
      "Definição precisa: p e q equivalentes quando cada um implica o outro.",
    explanationWrong:
      "O item está CERTO. Equivalência lógica = implicação nos dois sentidos. " +
      "p⊨q (p→q tautologia) e q⊨p (q→p tautologia) → p e q têm sempre o mesmo valor → p≡q.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 5 — Diagramas Lógicos
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "rlm_dl_dg_q01",
    contentId: CONTENT_IDS.diagramas,
    statement:
      "(CESPE — Adaptada) O diagrama de Venn que representa 'Todo policial é servidor público' " +
      "mostra o conjunto Policial totalmente contido no conjunto Servidor Público. " +
      "Com base nisso, é possível concluir que:",
    alternatives: [
      { letter: "A", text: "Todo servidor público é policial." },
      { letter: "B", text: "Nenhum servidor público é policial." },
      { letter: "C", text: "Algum policial não é servidor público." },
      { letter: "D", text: "Todo policial é servidor público." },
      { letter: "E", text: "Nenhum policial é servidor público." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "Se o conjunto Policial está totalmente dentro do conjunto Servidor Público, " +
      "isso representa a proposição universal 'Todo policial é servidor público'. " +
      "A única conclusão direta e necessária é D. " +
      "A: não se pode concluir — há servidores que não são policiais. " +
      "B, C, E: contradizem o diagrama.",
    explanationCorrect:
      "Exato! Policial ⊂ Servidor Público → 'Todo policial é servidor público'. " +
      "Não se pode inverter: servidor público não implica necessariamente ser policial.",
    explanationWrong:
      "Resposta: D. Se A ⊂ B, então 'Todo A é B'. Não implica 'Todo B é A' (A pode ser subconjunto próprio).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "rlm_dl_dg_q02",
    contentId: CONTENT_IDS.diagramas,
    statement:
      "(CEBRASPE — Adaptada) Se 'Nenhum suspeito é inocente', o diagrama correto mostra " +
      "os conjuntos Suspeito e Inocente completamente separados, sem interseção.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Nenhum A é B' = conjuntos A e B disjuntos (sem interseção). " +
      "No diagrama de Euler, os dois círculos ficam completamente separados. " +
      "Proposições quantificadas: " +
      "Todo A é B → A ⊂ B. Algum A é B → A ∩ B ≠ ∅. " +
      "Nenhum A é B → A ∩ B = ∅. Algum A não é B → A ⊄ B.",
    explanationCorrect:
      "Correto! 'Nenhum A é B' → conjuntos disjuntos (sem interseção). Diagrama: dois círculos separados.",
    explanationWrong:
      "O item está CERTO. 'Nenhum A é B' = A∩B=∅ = conjuntos separados no diagrama de Euler/Venn.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "rlm_dl_dg_q03",
    contentId: CONTENT_IDS.diagramas,
    statement:
      "(CESPE — Adaptada) Sabe-se que: (1) Todo investigador é concursado; " +
      "(2) Algum concursado é casado. " +
      "Com base apenas nessas premissas, qual conclusão é NECESSARIAMENTE verdadeira?",
    alternatives: [
      { letter: "A", text: "Todo investigador é casado." },
      { letter: "B", text: "Algum investigador é casado." },
      { letter: "C", text: "Nenhum investigador é casado." },
      { letter: "D", text: "Nenhuma conclusão sobre investigadores e casados é possível." },
      { letter: "E", text: "Algum casado é investigador." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "Investigador ⊂ Concursado (premissa 1). Concursado ∩ Casado ≠ ∅ (premissa 2). " +
      "Mas o subconjunto de concursados que é casado pode ou não incluir investigadores. " +
      "No diagrama: a interseção de Concursado com Casado pode estar fora de Investigador. " +
      "Portanto, não é possível concluir nada necessário sobre Investigador e Casado.",
    explanationCorrect:
      "Exato! Não há conclusão necessária. A interseção Concursado∩Casado pode não incluir nenhum Investigador. " +
      "Silogismo inconclusivo — diagrama mostra múltiplas possibilidades.",
    explanationWrong:
      "Resposta: D. Sem mais informações, não se pode concluir sobre Investigador∩Casado. " +
      "A interseção pode existir ou não — o diagrama não determina.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "rlm_dl_dg_q04",
    contentId: CONTENT_IDS.diagramas,
    statement:
      "(CEBRASPE — Adaptada) Das proposições 'Todo A é B' e 'Todo B é C', " +
      "pode-se concluir necessariamente que 'Todo A é C'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Silogismo válido (Barbara): A⊂B e B⊂C → A⊂C. " +
      "No diagrama: A está dentro de B, B está dentro de C → A está dentro de C. " +
      "Exemplo: 'Todo investigador é concursado' e 'Todo concursado é funcionário público' " +
      "→ 'Todo investigador é funcionário público'.",
    explanationCorrect:
      "Correto! A⊂B e B⊂C → A⊂C. Silogismo hipotético válido (transitividade da inclusão).",
    explanationWrong:
      "O item está CERTO. A⊂B e B⊂C → A⊂C. Silogismo clássico (modo Barbara). " +
      "No diagrama de Venn: três círculos aninhados A dentro de B dentro de C.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "rlm_dl_dg_q05",
    contentId: CONTENT_IDS.diagramas,
    statement:
      "(CESPE — Adaptada) Dado que 'Nenhum suspeito é testemunha' e " +
      "'Algum réu é testemunha', qual conclusão é válida?",
    alternatives: [
      { letter: "A", text: "Algum réu é suspeito." },
      { letter: "B", text: "Nenhum réu é suspeito." },
      { letter: "C", text: "Algum réu não é suspeito." },
      { letter: "D", text: "Todo suspeito é réu." },
      { letter: "E", text: "Nenhum suspeito é réu." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Suspeito ∩ Testemunha = ∅ (premissa 1). Réu ∩ Testemunha ≠ ∅ (premissa 2). " +
      "Os réus que são testemunhas não podem ser suspeitos (pois suspeitos e testemunhas são disjuntos). " +
      "Portanto: existe pelo menos um réu (o que é testemunha) que não é suspeito → 'Algum réu não é suspeito'. " +
      "A e B: não há informação suficiente sobre réus em geral e suspeitos.",
    explanationCorrect:
      "Exato! Os réus-testemunhas não podem ser suspeitos → algum réu não é suspeito. " +
      "Conclusão C é necessariamente válida.",
    explanationWrong:
      "Resposta: C. Réu∩Testemunha ≠ ∅ e Suspeito∩Testemunha = ∅ → " +
      "os réus-testemunhas não são suspeitos → algum réu não é suspeito.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "rlm_dl_dg_q06",
    contentId: CONTENT_IDS.diagramas,
    statement:
      "(CEBRASPE — Adaptada) Das premissas 'Todo criminoso é perigoso' e " +
      "'João não é perigoso', conclui-se necessariamente que 'João não é criminoso'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Modus Tollens com diagrama: Criminoso ⊂ Perigoso (todo criminoso é perigoso). " +
      "João ∉ Perigoso → João não pode estar em Perigoso → João não está em Criminoso " +
      "(pois Criminoso ⊂ Perigoso). " +
      "Formalmente: p→q e ¬q → ¬p. 'É criminoso → é perigoso'; 'não é perigoso' → 'não é criminoso'.",
    explanationCorrect:
      "Correto! Modus Tollens: Criminoso⊂Perigoso e João∉Perigoso → João∉Criminoso. " +
      "Se João não está em Perigoso, não pode estar em Criminoso (subconjunto).",
    explanationWrong:
      "O item está CERTO. Modus Tollens: Todo C é P; João não é P → João não é C. " +
      "No diagrama: C⊂P e João∉P → João∉C.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "rlm_dl_dg_q07",
    contentId: CONTENT_IDS.diagramas,
    statement:
      "(CESPE — Adaptada) Com base nas premissas: " +
      "(1) Todo agente federal é concursado; (2) Algum concursado não é bem remunerado; " +
      "(3) Todo bem remunerado é motivado. " +
      "É possível concluir que 'Algum agente federal não é bem remunerado'?",
    alternatives: [
      { letter: "A", text: "Sim, pois todo agente é concursado e algum concursado não é bem remunerado." },
      { letter: "B", text: "Não, pois as premissas não garantem isso — os concursados não bem remunerados podem não ser agentes." },
      { letter: "C", text: "Sim, pois a premissa 3 garante que agentes não são bem remunerados." },
      { letter: "D", text: "Sim, pois 'algum concursado não é bem remunerado' inclui necessariamente agentes." },
      { letter: "E", text: "Não há informação suficiente para qualquer conclusão." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Agente ⊂ Concursado (premissa 1). Concursado ∩ ¬BemRemunerado ≠ ∅ (premissa 2). " +
      "Mas os concursados não bem remunerados podem estar fora do subconjunto Agente. " +
      "No diagrama: a parte de Concursado que não é BemRemunerado pode ser disjunta de Agente. " +
      "Portanto, não é possível concluir necessariamente que algum agente não é bem remunerado.",
    explanationCorrect:
      "Exato! 'Algum concursado não é bem remunerado' não implica que esse 'algum' seja agente. " +
      "O subconjunto excluído pode estar fora de Agente. Conclusão inválida.",
    explanationWrong:
      "Resposta: B. Os concursados não bem remunerados podem não incluir nenhum agente. " +
      "O diagrama mostra essa possibilidade — conclusão não é necessária.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "rlm_dl_dg_q08",
    contentId: CONTENT_IDS.diagramas,
    statement:
      "(CEBRASPE — Adaptada) Das premissas 'Todo A é B' e 'Nenhum B é C', " +
      "a conclusão 'Nenhum A é C' é necessariamente válida.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. A⊂B e B∩C=∅ → A∩C=∅. " +
      "No diagrama: A está dentro de B; B e C são disjuntos. " +
      "Como A está totalmente dentro de B, e B não tem interseção com C, " +
      "A também não tem interseção com C → 'Nenhum A é C'. " +
      "Silogismo válido (modo Celarent).",
    explanationCorrect:
      "Correto! A⊂B e B∩C=∅ → A∩C=∅. Silogismo Celarent: Todo A é B; Nenhum B é C → Nenhum A é C.",
    explanationWrong:
      "O item está CERTO. Se A⊂B e B∩C=∅, então A∩C=∅ (pois A não pode sair de B, e B não toca C). " +
      "Silogismo válido — conclusão necessária.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 6 — Argumentos Lógicos
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "rlm_la_ar_q01",
    contentId: CONTENT_IDS.argumentos,
    statement:
      "(CESPE — Adaptada) Um argumento lógico é considerado VÁLIDO quando:",
    alternatives: [
      { letter: "A", text: "Todas as premissas são verdadeiras." },
      { letter: "B", text: "A conclusão é verdadeira." },
      { letter: "C", text: "É impossível que as premissas sejam verdadeiras e a conclusão falsa simultaneamente." },
      { letter: "D", text: "A conclusão é aceitável moralmente." },
      { letter: "E", text: "Pelo menos uma premissa é verdadeira." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Um argumento é VÁLIDO quando a verdade das premissas garante necessariamente a verdade da conclusão. " +
      "Formalmente: não existe valoração em que as premissas sejam V e a conclusão F. " +
      "Validade ≠ Verdade: um argumento pode ser válido com premissas falsas. " +
      "Argumento SÓLIDO = válido + premissas verdadeiras.",
    explanationCorrect:
      "Exato! Validade: premissas V → conclusão V necessariamente. " +
      "Impossível premissas V e conclusão F. Validade é propriedade formal, não material.",
    explanationWrong:
      "Resposta: C. Argumento válido: se as premissas são V, a conclusão DEVE ser V. " +
      "Não depende das premissas serem realmente verdadeiras — é relação formal.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "rlm_la_ar_q02",
    contentId: CONTENT_IDS.argumentos,
    statement:
      "(CEBRASPE — Adaptada) O argumento: 'Se há evidências, o réu é culpado. " +
      "Há evidências. Logo, o réu é culpado' é um exemplo de Modus Ponens e é válido.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Modus Ponens: {p→q, p} ⊢ q. " +
      "Premissa 1: p→q ('Se há evidências, é culpado'). " +
      "Premissa 2: p ('Há evidências'). " +
      "Conclusão: q ('É culpado'). " +
      "Argumento válido — é impossível as premissas serem V e a conclusão F.",
    explanationCorrect:
      "Correto! Modus Ponens: p→q, p ⊢ q. Argumento válido por excelência. " +
      "Afirmar o antecedente → concluir o consequente.",
    explanationWrong:
      "O item está CERTO. Modus Ponens = forma argumentativa válida. " +
      "{p→q, p} → q. Se as premissas são V, a conclusão é necessariamente V.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "rlm_la_ar_q03",
    contentId: CONTENT_IDS.argumentos,
    statement:
      "(CESPE — Adaptada) Identifique o argumento INVÁLIDO (falácia formal).",
    alternatives: [
      { letter: "A", text: "p→q; p; logo q. (Modus Ponens)" },
      { letter: "B", text: "p→q; ¬q; logo ¬p. (Modus Tollens)" },
      { letter: "C", text: "p→q; q; logo p. (Afirmação do consequente)" },
      { letter: "D", text: "p→q; q→r; logo p→r. (Silogismo hipotético)" },
      { letter: "E", text: "p∨q; ¬p; logo q. (Silogismo disjuntivo)" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "INVÁLIDO: 'p→q; q; logo p' — Falácia da Afirmação do Consequente. " +
      "Contraexemplo: p=F, q=V → p→q=V, q=V, mas p=F. Premissas V, conclusão F → inválido. " +
      "A: Modus Ponens ✓. B: Modus Tollens ✓. D: Silogismo hipotético ✓. E: Silogismo disjuntivo ✓.",
    explanationCorrect:
      "Exato! Afirmação do consequente é falácia formal. p→q e q NÃO implicam p. " +
      "Só porque 'chove → chão molhado' e 'chão está molhado' não conclui 'está chovendo'.",
    explanationWrong:
      "Resposta: C. Afirmação do consequente = falácia. p→q e q não implicam p. " +
      "Válidos: Modus Ponens (A), Modus Tollens (B), Sil. Hipotético (D), Sil. Disjuntivo (E).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "rlm_la_ar_q04",
    contentId: CONTENT_IDS.argumentos,
    statement:
      "(CEBRASPE — Adaptada) O argumento 'p→q; ¬p; logo ¬q' é inválido " +
      "porque negar o antecedente não garante a negação do consequente.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Negação do Antecedente' é falácia formal. " +
      "Contraexemplo: p=F, q=V → p→q=FV=V; ¬p=V; mas ¬q=F. Premissas V, conclusão F → inválido. " +
      "O fato de 'não chover' não implica que 'o chão não estará molhado' (pode ter outras causas). " +
      "Forma inválida: p→q; ¬p ⊬ ¬q.",
    explanationCorrect:
      "Correto! Negação do antecedente = falácia. ¬p não garante ¬q. " +
      "Contraexemplo: p=F, q=V → p→q=V, ¬p=V, ¬q=F. Inválido.",
    explanationWrong:
      "O item está CERTO. p→q e ¬p NÃO implicam ¬q. Falácia da negação do antecedente. " +
      "Válido seria: p→q e ¬q → ¬p (Modus Tollens).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "rlm_la_ar_q05",
    contentId: CONTENT_IDS.argumentos,
    statement:
      "(CESPE — Adaptada) Dado o argumento: 'Todo policial é disciplinado. " +
      "Pedro é policial. Logo, Pedro é disciplinado.' Este argumento é:",
    alternatives: [
      { letter: "A", text: "Inválido, pois nem todo policial é disciplinado na prática." },
      { letter: "B", text: "Válido, mas não sólido — as premissas podem ser falsas." },
      { letter: "C", text: "Válido e sólido — forma válida e premissas verdadeiras." },
      { letter: "D", text: "Inválido — não se pode concluir sobre Pedro especificamente." },
      { letter: "E", text: "Válido somente se Pedro for realmente disciplinado." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O argumento tem forma válida (Modus Barbara/silogismo universal): " +
      "Todo A é B; x é A; Logo x é B. " +
      "Se assumirmos as premissas como verdadeiras, o argumento também é SÓLIDO. " +
      "A: a validade é formal, independe de verdade empírica. " +
      "B: a questão indica as premissas como dadas (assumidamente verdadeiras no contexto). " +
      "D: silogismo universal permite concluir sobre elementos individuais.",
    explanationCorrect:
      "Exato! Forma válida + premissas aceitas como V = argumento sólido. " +
      "Silogismo universal: Todo A é B; x é A → x é B. Válido e sólido.",
    explanationWrong:
      "Resposta: C. Silogismo válido (Todo A é B; Pedro é A → Pedro é B). " +
      "Com premissas assumidas V → argumento sólido.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "rlm_la_ar_q06",
    contentId: CONTENT_IDS.argumentos,
    statement:
      "(CEBRASPE — Adaptada) Um argumento pode ser válido mesmo que suas premissas " +
      "sejam falsas, desde que a forma lógica garanta que, SE as premissas fossem verdadeiras, " +
      "a conclusão seria verdadeira.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Validade é propriedade FORMAL — não depende da verdade material das premissas. " +
      "Exemplo válido com premissas falsas: " +
      "'Todo peixe é mamífero (F). Todo mamífero é bípede (F). Logo, todo peixe é bípede.' " +
      "A forma (Todo A é B; Todo B é C → Todo A é C) é válida, embora as premissas sejam falsas. " +
      "Sólido = válido + premissas verdadeiras.",
    explanationCorrect:
      "Correto! Validade é formal: se P fossem V, C seria V — independe da verdade real de P. " +
      "Argumento sólido exige validade + premissas realmente V.",
    explanationWrong:
      "O item está CERTO. Validade ≠ solidez. Argumento válido com premissas falsas é possível. " +
      "A validade avalia a FORMA, não o conteúdo factual das premissas.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "rlm_la_ar_q07",
    contentId: CONTENT_IDS.argumentos,
    statement:
      "(CESPE — Adaptada) Avalie o argumento: " +
      "'Se o delegado autorizou ou a promotora autorizou, então a operação ocorreu. " +
      "A operação não ocorreu. Logo, nem o delegado nem a promotora autorizaram.' " +
      "Este argumento é:",
    alternatives: [
      { letter: "A", text: "Inválido — não se pode concluir sobre ambos." },
      { letter: "B", text: "Válido — Modus Tollens aplicado à disjunção." },
      { letter: "C", text: "Inválido — afirmação do consequente." },
      { letter: "D", text: "Válido somente se o delegado autorizou." },
      { letter: "E", text: "Inválido — a negação da disjunção não implica negação dos componentes." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Formalizando: p = 'delegado autorizou'; q = 'promotora autorizou'; r = 'operação ocorreu'. " +
      "Premissa 1: (p∨q) → r. Premissa 2: ¬r. " +
      "Modus Tollens: {(p∨q)→r, ¬r} ⊢ ¬(p∨q). " +
      "De Morgan: ¬(p∨q) = ¬p ∧ ¬q = 'nem o delegado nem a promotora autorizaram'. " +
      "Argumento válido.",
    explanationCorrect:
      "Exato! Modus Tollens: (p∨q)→r e ¬r → ¬(p∨q) = ¬p∧¬q (De Morgan). " +
      "Válido — combina Modus Tollens com De Morgan.",
    explanationWrong:
      "Resposta: B. Modus Tollens: (p∨q)→r; ¬r → ¬(p∨q). De Morgan: ¬(p∨q) = ¬p∧¬q. " +
      "Argumento válido em dois passos.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "rlm_la_ar_q08",
    contentId: CONTENT_IDS.argumentos,
    statement:
      "(CEBRASPE — Adaptada) Do argumento: 'Se o suspeito mentiu, então há contradições " +
      "no depoimento. Não há contradições no depoimento. Logo, o suspeito não mentiu', " +
      "a conclusão é necessariamente verdadeira se as premissas forem verdadeiras.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Modus Tollens: {p→q, ¬q} ⊢ ¬p. " +
      "p = 'suspeito mentiu'; q = 'há contradições'. " +
      "Premissa 1: p→q. Premissa 2: ¬q. Conclusão: ¬p ('não mentiu'). " +
      "Forma válida — se P1 e P2 forem V, ¬p é necessariamente V. " +
      "Argumento formalmente correto (Modus Tollens).",
    explanationCorrect:
      "Correto! Modus Tollens válido: p→q; ¬q ⊢ ¬p. Se as premissas são V, a conclusão é necessariamente V.",
    explanationWrong:
      "O item está CERTO. Modus Tollens: p→q e ¬q → ¬p. " +
      "Argumento válido: premissas V garantem conclusão V.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
];

// ─── RUNNER ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Seed R41 — Densificação: RLM — Lógica Proposicional (48 questões) ===\n");

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
      "Nenhum átomo encontrado. Verifique os IDs:\n" +
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

  console.log(`\n=== R41 concluído ===`);
  console.log(`  Questões inseridas : ${inseridos}`);
  console.log(`  Puladas (duplicata): ${pulados}`);
  console.log(`  Total processado   : ${questions.length}`);
  console.log(`\n  Distribuição por átomo:`);
  console.log(`    Conjunção (p ∧ q)          : 8 questões → ${CONTENT_IDS.conjuncao}`);
  console.log(`    Disjunção (p ∨ q)          : 8 questões → ${CONTENT_IDS.disjuncao}`);
  console.log(`    Os 5 Operadores            : 8 questões → ${CONTENT_IDS.operadores}`);
  console.log(`    Implicação vs Equivalência : 8 questões → ${CONTENT_IDS.implEquiv}`);
  console.log(`    Diagramas Lógicos          : 8 questões → ${CONTENT_IDS.diagramas}`);
  console.log(`    Argumentos Lógicos         : 8 questões → ${CONTENT_IDS.argumentos}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("ERRO no seed R41:", err);
  process.exit(1);
});
