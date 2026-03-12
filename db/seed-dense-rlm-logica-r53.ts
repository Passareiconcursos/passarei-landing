/**
 * Seed R53 — DENSIFICAÇÃO: RLM — Raciocínio Lógico: Lógica Proposicional
 * Átomos: rlm_lp_c01–c06 (já existentes no banco)
 * 48 questões novas: 8 por átomo (4 CE + 4 ME), progressão FACIL→DIFICIL
 * Execução: npx tsx db/seed-dense-rlm-logica-r53.ts
 */

import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

// ============================================
// INTERFACES
// ============================================

interface Alternative {
  letter: string;
  text: string;
}

interface Question {
  id: string;
  contentId: string;
  statement: string;
  alternatives: Alternative[];
  correctAnswer: string;
  correctOption: number;
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  questionType: "MULTIPLA_ESCOLHA" | "CERTO_ERRADO";
}

// ============================================
// QUESTÕES — 48 no total (8 por átomo)
// ============================================

const questions: Question[] = [

  // ── rlm_lp_c01 — Conceito de Proposição ─────────────────────────────────

  {
    id: "rlm_lp_c01_q01",
    contentId: "rlm_lp_c01",
    statement: "A sentença 'Feche a porta!' é uma proposição, pois afirma algo sobre a realidade.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Ordens/comandos não são proposições — não possuem valor de verdade (não são verdadeiras nem falsas). Proposições devem ser sentenças declarativas.",
    explanationCorrect: "Errado: 'Feche a porta!' é uma ordem/imperativo — não possui valor lógico (V ou F). Só são proposições as sentenças declarativas às quais se pode atribuir V ou F.",
    explanationWrong: "A afirmação está incorreta — ordens e comandos não são proposições.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c01_q02",
    contentId: "rlm_lp_c01",
    statement: "A sentença 'A Terra gira ao redor do Sol.' é uma proposição verdadeira.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "É uma sentença declarativa com valor lógico definido: verdadeira. Portanto, é proposição (e proposição verdadeira).",
    explanationCorrect: "Certo: sentença declarativa + valor de verdade definido = proposição. 'A Terra gira ao redor do Sol' é V. Proposições podem ser V ou F — o que importa é ter valor lógico único.",
    explanationWrong: "A afirmação está correta — é uma proposição verdadeira.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c01_q03",
    contentId: "rlm_lp_c01",
    statement: "A expressão 'x + 5 = 10' é uma proposição falsa, pois sem conhecer x não se pode afirmar que é verdadeira.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "'x + 5 = 10' é uma sentença aberta — seu valor lógico depende do valor de x, que é desconhecido. Sentenças abertas NÃO são proposições (não têm valor lógico definido).",
    explanationCorrect: "Errado: 'x + 5 = 10' não é proposição — é sentença aberta. Não é 'falsa'; simplesmente não tem valor lógico definido enquanto x for indeterminado. Se x = 5, é V; se x = 3, é F — sem x fixado, não é proposição.",
    explanationWrong: "A afirmação está incorreta — sentença aberta não é proposição (nem verdadeira, nem falsa — é indeterminada).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c01_q04",
    contentId: "rlm_lp_c01",
    statement: "A sentença 'Este enunciado é falso.' não é uma proposição, pois é um paradoxo — se verdadeira, seria falsa; se falsa, seria verdadeira.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Paradoxos são sentenças que se contradizem a si mesmas — não têm valor lógico definido e, portanto, não são proposições.",
    explanationCorrect: "Certo: 'Este enunciado é falso' é o paradoxo do mentiroso. Se for V, então é F (contradição); se for F, então é V (contradição). Não tem valor lógico estável → não é proposição.",
    explanationWrong: "A afirmação está correta — paradoxos não são proposições.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c01_q05",
    contentId: "rlm_lp_c01",
    statement: "Qual das sentenças abaixo é uma proposição?",
    alternatives: [
      { letter: "A", text: "'Que dia lindo hoje!'" },
      { letter: "B", text: "'Quantos estados tem o Brasil?'" },
      { letter: "C", text: "'Saia da sala imediatamente!'" },
      { letter: "D", text: "'Brasília é a capital do Brasil.'" },
      { letter: "E", text: "'Se x > 0, então x é positivo.' — onde x é uma variável livre." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "'Brasília é a capital do Brasil' é sentença declarativa com valor lógico definido (V). As demais são exclamação, pergunta, ordem e sentença aberta — nenhuma é proposição.",
    explanationCorrect: "D: 'Brasília é a capital do Brasil' = sentença declarativa, valor V = proposição. A: exclamação (sem valor lógico). B: pergunta. C: ordem. E: sentença aberta (valor depende de x).",
    explanationWrong: "A: exclamação — não tem valor lógico. B: pergunta — não é declarativa. C: ordem/imperativo. E: sentença aberta (x livre → valor indeterminado). Apenas D satisfaz os critérios de proposição.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_lp_c01_q06",
    contentId: "rlm_lp_c01",
    statement: "Sobre proposições simples e compostas, assinale a opção correta.",
    alternatives: [
      { letter: "A", text: "Uma proposição composta é aquela que contém palavras complexas ou termos técnicos." },
      { letter: "B", text: "Proposição simples é formada por uma única afirmação ou negação; proposição composta é formada pela combinação de proposições simples por conectivos lógicos." },
      { letter: "C", text: "Toda proposição composta tem valor lógico indeterminado, pois combina múltiplas afirmações." },
      { letter: "D", text: "Proposições compostas nunca são verdadeiras — a combinação de proposições gera contradição." },
      { letter: "E", text: "Uma proposição simples pode conter os conectivos 'e', 'ou' e 'se...então' sem deixar de ser simples." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Proposição simples: uma única afirmação/negação, sem conectivos lógicos. Proposição composta: combinação de proposições simples por conectivos (∧, ∨, →, ↔).",
    explanationCorrect: "B: definição correta. Simples = uma única afirmação (ex: 'p: o suspeito fugiu'). Composta = combinação por conectivos (ex: 'p ∧ q: o suspeito fugiu E foi indiciado'). Compostas também têm valor V ou F definido.",
    explanationWrong: "A: complexidade vocabular não define proposição composta. C: propostas compostas têm valor lógico definido. D: compostas podem ser V ou F. E: conectivos lógicos tornam a proposição composta.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_lp_c01_q07",
    contentId: "rlm_lp_c01",
    statement: "Considerando os critérios da Lógica Proposicional, qual das sentenças a seguir NÃO é uma proposição?",
    alternatives: [
      { letter: "A", text: "'Todo número primo maior que 2 é ímpar.'" },
      { letter: "B", text: "'A Lua é um satélite natural da Terra.'" },
      { letter: "C", text: "'2 + 2 = 5.'" },
      { letter: "D", text: "'Que belo pôr do sol!'" },
      { letter: "E", text: "'O Brasil tem mais de 200 milhões de habitantes.'" },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "'Que belo pôr do sol!' é uma exclamação — não possui valor lógico (não é V nem F). As demais são sentenças declarativas com valor definido (V ou F).",
    explanationCorrect: "D: exclamação — não é proposição. A: proposição V. B: proposição V. C: proposição F (2+2≠5). E: proposição V (>200M hab). O critério é: sentença declarativa com valor lógico único.",
    explanationWrong: "A, B, C e E são proposições (têm valor V ou F). D é exclamação — não tem valor lógico.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_lp_c01_q08",
    contentId: "rlm_lp_c01",
    statement: "O princípio da bivalência, que fundamenta a Lógica Proposicional clássica, estabelece que:",
    alternatives: [
      { letter: "A", text: "Toda proposição pode ser simultaneamente verdadeira e falsa em diferentes contextos." },
      { letter: "B", text: "Toda proposição tem exatamente um valor lógico: verdadeiro ou falso — nunca ambos, nunca nenhum." },
      { letter: "C", text: "Proposições compostas podem ter valores intermediários entre V e F (lógica fuzzy)." },
      { letter: "D", text: "O valor lógico de uma proposição muda conforme o contexto histórico ou cultural." },
      { letter: "E", text: "Somente proposições matemáticas obedecem ao princípio da bivalência." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O princípio da bivalência estabelece que toda proposição tem exatamente um dos dois valores lógicos: V ou F. Nunca os dois simultaneamente (não-contradição) e nunca nenhum (terceiro excluído).",
    explanationCorrect: "B: bivalência = dois valores possíveis (V ou F), exclusivos e exaustivos. Princípio do terceiro excluído: p ∨ ¬p = sempre V (não há terceira opção). Princípio da não-contradição: p ∧ ¬p = sempre F.",
    explanationWrong: "A: violaria a não-contradição — uma proposição não pode ser V e F. C: lógica fuzzy é extensão da lógica clássica — não é o tema aqui. D: valor lógico não depende de contexto cultural. E: a bivalência vale para qualquer proposição, não apenas matemáticas.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── rlm_lp_c02 — Conectivos E (∧) e OU (∨) ──────────────────────────────

  {
    id: "rlm_lp_c02_q01",
    contentId: "rlm_lp_c02",
    statement: "A conjunção (p ∧ q) é verdadeira somente quando ambas as proposições p e q são verdadeiras.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Tabela-verdade da conjunção: VV=V, VF=F, FV=F, FF=F. A conjunção só é V quando ambas as componentes são V.",
    explanationCorrect: "Certo: (p ∧ q) = V somente se p = V E q = V. Qualquer componente F torna a conjunção F. Regra: a conjunção 'exige tudo verdadeiro'.",
    explanationWrong: "A afirmação está correta — conjunção verdadeira somente com ambas as partes verdadeiras.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c02_q02",
    contentId: "rlm_lp_c02",
    statement: "A disjunção inclusiva (p ∨ q) é falsa quando ao menos uma das proposições componentes é falsa.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "A disjunção inclusiva é F somente quando AMBAS as componentes são F. Basta uma ser V para que (p ∨ q) = V.",
    explanationCorrect: "Errado: (p ∨ q) = F somente quando p = F E q = F. Se apenas uma for V, a disjunção é V. Tabela: VV=V, VF=V, FV=V, FF=F.",
    explanationWrong: "A afirmação está incorreta — disjunção inclusiva é F somente quando AMBAS são F (não basta apenas uma ser F).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c02_q03",
    contentId: "rlm_lp_c02",
    statement: "Se p = V e q = F, então (p ∧ q) = F.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "V ∧ F = F. A conjunção exige que ambos sejam V — se q é F, o resultado é F.",
    explanationCorrect: "Certo: V ∧ F = F. Qualquer componente F na conjunção torna o resultado F.",
    explanationWrong: "A afirmação está correta — V ∧ F = F.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c02_q04",
    contentId: "rlm_lp_c02",
    statement: "A disjunção exclusiva (p ⊻ q) é verdadeira quando ambas as proposições p e q têm o mesmo valor lógico.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "A disjunção exclusiva (⊻/XOR) é V quando as proposições têm valores DIFERENTES (VF=V, FV=V). É F quando têm valores iguais (VV=F, FF=F).",
    explanationCorrect: "Errado: ⊻ é V quando p e q têm valores DIFERENTES. Quando iguais (VV ou FF), o ⊻ é F. É o oposto do bicondicional ↔.",
    explanationWrong: "A afirmação está invertida — ⊻ é V com valores DIFERENTES, e F com valores iguais.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c02_q05",
    contentId: "rlm_lp_c02",
    statement: "Considerando p = F e q = F, qual o valor da disjunção inclusiva (p ∨ q)?",
    alternatives: [
      { letter: "A", text: "Verdadeiro, pois ambas as componentes são F e elas se anulam." },
      { letter: "B", text: "Verdadeiro, pois a disjunção é sempre V independentemente dos valores." },
      { letter: "C", text: "Falso, pois a disjunção inclusiva é F somente quando ambas as componentes são F." },
      { letter: "D", text: "Indeterminado, pois não é possível avaliar disjunção com duas proposições falsas." },
      { letter: "E", text: "Verdadeiro, pois ¬F = V." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "F ∨ F = F. Este é o único caso em que a disjunção inclusiva é F. Basta uma das proposições ser V para que (p ∨ q) seja V.",
    explanationCorrect: "C: F ∨ F = F. Este é o único caso em que a disjunção inclusiva resulta em F. Tabela completa: VV=V, VF=V, FV=V, FF=F.",
    explanationWrong: "A e B: F ∨ F = F (não V). D: tem valor definido — F. E: o exercício não pede ¬F; pede o valor de (p ∨ q) com ambas F.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_lp_c02_q06",
    contentId: "rlm_lp_c02",
    statement: "Qual a principal diferença entre a disjunção inclusiva (p ∨ q) e a disjunção exclusiva (p ⊻ q)?",
    alternatives: [
      { letter: "A", text: "A disjunção inclusiva é V apenas quando uma das proposições é V; a exclusiva é V quando ambas são V." },
      { letter: "B", text: "A disjunção inclusiva admite que ambas as proposições sejam V (VV=V); a exclusiva é F quando ambas são V (VV=F)." },
      { letter: "C", text: "Não há diferença prática — ambas têm o mesmo resultado em todas as linhas da tabela-verdade." },
      { letter: "D", text: "A disjunção exclusiva é mais usada em Direito; a inclusiva, em Matemática." },
      { letter: "E", text: "A disjunção inclusiva só é usada com proposições simples; a exclusiva, com proposições compostas." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A diferença chave: quando ambas são V → ∨ = V (inclusiva admite os dois), ⊻ = F (exclusiva rejeita os dois). No caso VV, as disjunções divergem.",
    explanationCorrect: "B: a diferença está no caso VV. Inclusiva: VV=V (aceita os dois). Exclusiva: VV=F (rejeita se ambas forem V). O nome 'exclusivo' vem de excluir o caso em que ambas são V.",
    explanationWrong: "A: inversão — a inclusiva é V quando uma OU ambas são V. C: as tabelas diferem no caso VV. D e E: critério de uso não é área do direito nem tipo de proposição.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_lp_c02_q07",
    contentId: "rlm_lp_c02",
    statement: "O delegado registrou: 'O suspeito estava armado E usou violência durante o assalto.' Se a perícia comprova que o suspeito NÃO estava armado, o valor lógico da proposição composta é:",
    alternatives: [
      { letter: "A", text: "Verdadeiro, pois a violência foi comprovada." },
      { letter: "B", text: "Falso, pois a conjunção exige que AMBAS as partes sejam verdadeiras." },
      { letter: "C", text: "Indeterminado, pois depende da violência." },
      { letter: "D", text: "Verdadeiro, pois pelo menos uma parte (violência) pode ser V." },
      { letter: "E", text: "Falso apenas se a violência também não tiver ocorrido." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A proposição é conjunção (p ∧ q). Se p = F (suspeito não estava armado), então (p ∧ q) = F independentemente do valor de q (violência). Conjunção com componente F = F.",
    explanationCorrect: "B: F ∧ q = F, independentemente do valor de q. A conjunção exige AMBAS verdadeiras. Se uma é F, o resultado é F — mesmo que a violência tenha ocorrido.",
    explanationWrong: "A e D: na conjunção, não basta uma parte ser V. C: tem valor definido — F. E: na conjunção, basta UMA parte ser F para o resultado ser F.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_lp_c02_q08",
    contentId: "rlm_lp_c02",
    statement: "Considerando p = V e q = V, qual o valor da disjunção exclusiva (p ⊻ q) e do ou inclusivo (p ∨ q), respectivamente?",
    alternatives: [
      { letter: "A", text: "V e V." },
      { letter: "B", text: "F e V." },
      { letter: "C", text: "V e F." },
      { letter: "D", text: "F e F." },
      { letter: "E", text: "V e indeterminado." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "V ⊻ V = F (exclusiva: V apenas com valores diferentes). V ∨ V = V (inclusiva: V quando ao menos uma é V). Resultado: ⊻=F e ∨=V.",
    explanationCorrect: "B: V ⊻ V = F (exclusiva é F quando ambas V). V ∨ V = V (inclusiva é V quando ao menos uma é V). Este é o caso em que as duas disjunções divergem.",
    explanationWrong: "A: ⊻ não é V quando VV — é F. C e D: ∨ é V quando ambas V — não F. E: ∨ tem valor definido (V).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── rlm_lp_c03 — Condicional (p → q) ────────────────────────────────────

  {
    id: "rlm_lp_c03_q01",
    contentId: "rlm_lp_c03",
    statement: "A proposição condicional (p → q) é falsa somente quando p é verdadeiro e q é falso.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Tabela-verdade da condicional: VV=V, VF=F (único caso F!), FV=V, FF=V. A condicional só é F no caso V→F.",
    explanationCorrect: "Certo: (p → q) = F somente quando p = V e q = F. Nos outros 3 casos (VV, FV, FF), a condicional é V. Regra: 'Só V→F dá F'.",
    explanationWrong: "A afirmação está correta — único caso falso da condicional: antecedente V e consequente F.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c03_q02",
    contentId: "rlm_lp_c03",
    statement: "A contrapositiva de (p → q) é (q → p), e é logicamente equivalente à proposição original.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "A contrapositiva de (p → q) é (¬q → ¬p) — não (q → p). A proposição (q → p) é a RECÍPROCA — e NÃO é equivalente à original.",
    explanationCorrect: "Errado: contrapositiva = ¬q → ¬p (equivalente). Recíproca = q → p (NÃO equivalente). A questão confundiu contrapositiva com recíproca. Só a contrapositiva é equivalente lógica.",
    explanationWrong: "A afirmação está incorreta — descreveu a recíproca (q → p), não a contrapositiva (¬q → ¬p).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c03_q03",
    contentId: "rlm_lp_c03",
    statement: "A negação da condicional ¬(p → q) é logicamente equivalente a (p ∧ ¬q).",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "¬(p → q) = p ∧ ¬q. Para negar a condicional, mantém-se o antecedente p e nega-se o consequente q, ligando-os com 'e'.",
    explanationCorrect: "Certo: ¬(p → q) = p ∧ ¬q. Exemplo: ¬('Se estuda, então passa') = 'Estuda E não passa'. É o único caso que tornaria a condicional falsa.",
    explanationWrong: "A afirmação está correta — negação da condicional = antecedente ∧ negação do consequente.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c03_q04",
    contentId: "rlm_lp_c03",
    statement: "Se p = F e q = F, então a condicional (p → q) é falsa.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "F → F = V. A condicional é V em todos os casos exceto V→F. Quando o antecedente é F, a condicional é sempre V — independentemente de q.",
    explanationCorrect: "Errado: F → F = V (verdadeiro). A condicional só é F quando p = V e q = F. Se p = F, a condicional é sempre V — seja q = V ou F. Pegadinha clássica de concurso!",
    explanationWrong: "A afirmação está incorreta — F → F = V, não F.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c03_q05",
    contentId: "rlm_lp_c03",
    statement: "Qual das proposições abaixo é logicamente equivalente à condicional (p → q)?",
    alternatives: [
      { letter: "A", text: "(q → p)" },
      { letter: "B", text: "(¬p → ¬q)" },
      { letter: "C", text: "(¬q → ¬p)" },
      { letter: "D", text: "(p ∧ q)" },
      { letter: "E", text: "(¬p ∧ ¬q)" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A contrapositiva (¬q → ¬p) é a única equivalente lógica de (p → q). Outras proposições relacionadas: recíproca (q → p) e contrária (¬p → ¬q) — ambas NÃO equivalentes.",
    explanationCorrect: "C: contrapositiva (¬q → ¬p) ≡ (p → q). Regra: para obter a contrapositiva, nega-se e inverte-se antecedente e consequente. A: recíproca (não equivalente). B: contrária (não equivalente). D e E: outros conectivos.",
    explanationWrong: "A (recíproca) e B (contrária): NÃO equivalentes à original. D e E: estrutura diferente da condicional. Apenas a contrapositiva (C) é equivalente.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_lp_c03_q06",
    contentId: "rlm_lp_c03",
    statement: "Considerando a regra policial 'Se o suspeito tiver antecedentes (p), será indiciado (q)', e sabendo que o suspeito NÃO tem antecedentes (p = F), o valor da condicional é:",
    alternatives: [
      { letter: "A", text: "Falso, pois sem antecedentes, a regra não se aplica e portanto falha." },
      { letter: "B", text: "Verdadeiro, pois quando o antecedente é F, a condicional é sempre V — independentemente do consequente." },
      { letter: "C", text: "Indeterminado — a condicional só pode ser avaliada se o antecedente for V." },
      { letter: "D", text: "Falso, pois o suspeito não cumpriu a condição estabelecida." },
      { letter: "E", text: "Verdadeiro somente se o suspeito também não for indiciado." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "F → q = V para qualquer valor de q. Quando o antecedente é F, a condicional é automaticamente V — a 'promessa' não foi testada.",
    explanationCorrect: "B: F → q = V. A condicional é uma promessa que só pode ser 'quebrada' (F) quando o antecedente (premissa) é cumprido e o consequente não ocorre (V→F=F). Se o antecedente é F, a promessa não foi ativada — permanece V.",
    explanationWrong: "A e D: não confundir valor lógico da condicional com a aplicação prática da regra. C: a condicional tem valor definido mesmo com p=F. E: F → V = V e F → F = V — ambos V.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_lp_c03_q07",
    contentId: "rlm_lp_c03_q07".startsWith("rlm") ? "rlm_lp_c03" : "rlm_lp_c03",
    statement: "A proposição 'p somente se q' é uma forma alternativa de expressar em português qual conectivo lógico?",
    alternatives: [
      { letter: "A", text: "Bicondicional: p ↔ q." },
      { letter: "B", text: "Conjunção: p ∧ q." },
      { letter: "C", text: "Condicional: p → q." },
      { letter: "D", text: "Disjunção: p ∨ q." },
      { letter: "E", text: "Negação: ¬p." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "'p somente se q' é forma equivalente de 'Se p, então q' (p → q). Outras formas: 'p é condição suficiente para q', 'q é condição necessária para p', 'não há p sem q'.",
    explanationCorrect: "C: 'p somente se q' = p → q. Lista de formas equivalentes: 'Se p, então q', 'p implica q', 'p somente se q', 'p é suficiente para q', 'q é necessário para p'.",
    explanationWrong: "A: bicondicional seria 'p se e somente se q'. B: conjunção seria 'p e q'. D: disjunção seria 'p ou q'. E: negação seria 'não p'.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_lp_c03_q08",
    contentId: "rlm_lp_c03",
    statement: "A negação da proposição 'Se o réu confessar, será condenado' é:",
    alternatives: [
      { letter: "A", text: "'Se o réu não confessar, não será condenado.'" },
      { letter: "B", text: "'O réu não confessará ou será condenado.'" },
      { letter: "C", text: "'O réu confessará e não será condenado.'" },
      { letter: "D", text: "'O réu não confessará e não será condenado.'" },
      { letter: "E", text: "'Se o réu for condenado, então ele confessou.'" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "¬(p → q) = p ∧ ¬q. Mantém-se o antecedente p ('confessará') e nega-se o consequente q ('não será condenado'), ligando-os por 'e'.",
    explanationCorrect: "C: ¬('Se o réu confessar (p), será condenado (q)') = 'O réu confessará (p) E não será condenado (¬q)'. Fórmula: ¬(p → q) = p ∧ ¬q.",
    explanationWrong: "A: é a contrária (¬p → ¬q) — não é a negação. B: ¬p ∨ q é equivalente à condicional original, não sua negação. D: ¬p ∧ ¬q não é a negação correta. E: é a recíproca — não é a negação.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── rlm_lp_c04 — Bicondicional (p ↔ q) e Ou Exclusivo (p ⊻ q) ──────────

  {
    id: "rlm_lp_c04_q01",
    contentId: "rlm_lp_c04",
    statement: "O bicondicional (p ↔ q) é verdadeiro quando p e q possuem o mesmo valor lógico — ambos V ou ambos F.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Tabela do bicondicional: VV=V, VF=F, FV=F, FF=V. É V quando p e q têm o mesmo valor (ambos V ou ambos F).",
    explanationCorrect: "Certo: ↔ é V quando valores iguais (VV=V, FF=V) e F quando valores diferentes (VF=F, FV=F). Leitura: 'p se e somente se q'.",
    explanationWrong: "A afirmação está correta — bicondicional é V com valores iguais.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c04_q02",
    contentId: "rlm_lp_c04",
    statement: "A disjunção exclusiva (p ⊻ q) é verdadeira quando p e q têm o mesmo valor lógico.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "A disjunção exclusiva (⊻/XOR) é V quando p e q têm valores DIFERENTES. Quando iguais (VV=F, FF=F), ⊻ é F. As tabelas de ↔ e ⊻ são opostas.",
    explanationCorrect: "Errado: ⊻ é V com valores diferentes (VF=V, FV=V) e F com valores iguais (VV=F, FF=F). O bicondicional ↔ é que é V com valores iguais — as tabelas são opostas.",
    explanationWrong: "A afirmação está incorreta — ⊻ é V com valores DIFERENTES, e F com iguais.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c04_q03",
    contentId: "rlm_lp_c04",
    statement: "O bicondicional (p ↔ q) é logicamente equivalente à conjunção (p → q) ∧ (q → p).",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "p ↔ q ≡ (p → q) ∧ (q → p). O bicondicional é a conjunção da condicional e de sua recíproca — exige que ambas as implicações sejam verdadeiras.",
    explanationCorrect: "Certo: p ↔ q = (p → q) ∧ (q → p). Para o bicondicional ser V, é necessário que p implique q E q implique p — ambos simultaneamente.",
    explanationWrong: "A afirmação está correta — bicondicional = condicional ∧ recíproca.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c04_q04",
    contentId: "rlm_lp_c04",
    statement: "Se p = V e q = F, então o bicondicional (p ↔ q) é verdadeiro.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "V ↔ F = F. O bicondicional é F quando p e q têm valores diferentes — que é exatamente o caso V e F.",
    explanationCorrect: "Errado: V ↔ F = F. O bicondicional é V somente com valores iguais (VV=V, FF=V). Valores diferentes (VF=F, FV=F) tornam o bicondicional F.",
    explanationWrong: "A afirmação está incorreta — V ↔ F = F.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c04_q05",
    contentId: "rlm_lp_c04",
    statement: "Qual o valor da disjunção exclusiva (p ⊻ q) quando p = F e q = F?",
    alternatives: [
      { letter: "A", text: "Verdadeiro, pois ¬F = V." },
      { letter: "B", text: "Verdadeiro, pois dois Falsos se anulam." },
      { letter: "C", text: "Falso, pois a disjunção exclusiva é F quando ambas as proposições têm o mesmo valor." },
      { letter: "D", text: "Indeterminado, pois não há como calcular XOR com duas proposições falsas." },
      { letter: "E", text: "Verdadeiro, pois F ∨ F = F, e a negação seria V." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "F ⊻ F = F. O ou exclusivo é F quando os valores são iguais (VV=F, FF=F). É V somente com valores diferentes (VF=V, FV=V).",
    explanationCorrect: "C: F ⊻ F = F. A disjunção exclusiva (XOR) é F quando os dois lados têm o mesmo valor. Tabela: VV=F, VF=V, FV=V, FF=F.",
    explanationWrong: "A e B: FF não dá V no ⊻ — é F. D: tem valor definido. E: a lógica descrita não se aplica ao ⊻.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_lp_c04_q06",
    contentId: "rlm_lp_c04",
    statement: "O edital diz: 'O candidato será aprovado se e somente se obtiver nota ≥ 60.' Essa proposição é melhor representada por qual conectivo lógico?",
    alternatives: [
      { letter: "A", text: "Condicional (→): se obtiver nota ≥ 60, então aprovado." },
      { letter: "B", text: "Conjunção (∧): obtém nota ≥ 60 E está aprovado." },
      { letter: "C", text: "Bicondicional (↔): aprovado se e somente se nota ≥ 60." },
      { letter: "D", text: "Disjunção (∨): nota ≥ 60 ou aprovado." },
      { letter: "E", text: "Ou exclusivo (⊻): ou nota ≥ 60, ou aprovado, mas não ambos." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "'Se e somente se' é a leitura direta do bicondicional (↔). Significa que a aprovação implica nota ≥ 60 E nota ≥ 60 implica aprovação — relação mútua e necessária.",
    explanationCorrect: "C: 'se e somente se' = bicondicional ↔. p ↔ q: aprovado ↔ nota ≥ 60. Se aprovado, então nota ≥ 60 (p→q); e se nota ≥ 60, então aprovado (q→p). Ambas as implicações valem.",
    explanationWrong: "A: condicional é unidirecional (→). B: conjunção é 'e'. D: disjunção é 'ou'. E: ou exclusivo = XOR, não 'se e somente se'.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_lp_c04_q07",
    contentId: "rlm_lp_c04",
    statement: "A relação lógica entre o bicondicional (p ↔ q) e a disjunção exclusiva (p ⊻ q) é que:",
    alternatives: [
      { letter: "A", text: "São equivalentes — têm a mesma tabela-verdade." },
      { letter: "B", text: "p ⊻ q ≡ ¬(p ↔ q) — as tabelas-verdade são exatamente opostas." },
      { letter: "C", text: "p ↔ q ≡ p ⊻ q, mas apenas quando p = V." },
      { letter: "D", text: "Não há relação formal entre ↔ e ⊻." },
      { letter: "E", text: "p ⊻ q é o dobro do valor lógico de p ↔ q." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "p ⊻ q ≡ ¬(p ↔ q). As tabelas são opostas: onde ↔ é V, ⊻ é F (e vice-versa). Bicondicional V com valores iguais; exclusivo V com valores diferentes.",
    explanationCorrect: "B: ⊻ = negação do ↔. Tabelas opostas: ↔ (VV=V, VF=F, FV=F, FF=V) vs ⊻ (VV=F, VF=V, FV=V, FF=F). Cada linha tem valor oposto.",
    explanationWrong: "A: tabelas opostas — não equivalentes. C: não é condicionado a p=V. D: há relação formal — ⊻ = ¬↔. E: 'dobro do valor lógico' não é um conceito de lógica bivalente.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_lp_c04_q08",
    contentId: "rlm_lp_c04",
    statement: "Em qual linha da tabela-verdade o bicondicional (p ↔ q) é FALSO?",
    alternatives: [
      { letter: "A", text: "Apenas quando p = V e q = V." },
      { letter: "B", text: "Apenas quando p = F e q = F." },
      { letter: "C", text: "Quando p e q têm valores diferentes: VF e FV." },
      { letter: "D", text: "O bicondicional nunca é falso — é uma tautologia." },
      { letter: "E", text: "Quando p = F, independentemente de q." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O bicondicional é F quando p e q têm valores DIFERENTES: V↔F=F e F↔V=F. É V quando valores iguais (VV=V, FF=V).",
    explanationCorrect: "C: ↔ é F nos casos VF e FV (valores diferentes). Tabela: VV=V (iguais→V), VF=F (diferentes→F), FV=F (diferentes→F), FF=V (iguais→V).",
    explanationWrong: "A: VV=V (não F). B: FF=V (não F). D: não é tautologia — tem linhas F. E: F↔V=F (certo), mas F↔F=V (errado incluir esse caso).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── rlm_lp_c05 — Tabelas-Verdade, Tautologia e Equivalência ─────────────

  {
    id: "rlm_lp_c05_q01",
    contentId: "rlm_lp_c05",
    statement: "Uma tabela-verdade com 3 variáveis proposicionais distintas possui 8 linhas.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Fórmula: 2^n linhas, onde n = número de variáveis. Com 3 variáveis: 2³ = 8 linhas.",
    explanationCorrect: "Certo: 2³ = 8 linhas. Regra: n variáveis → 2^n linhas. 1 var=2, 2 var=4, 3 var=8, 4 var=16.",
    explanationWrong: "A afirmação está correta — 3 variáveis = 2³ = 8 linhas.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c05_q02",
    contentId: "rlm_lp_c05",
    statement: "Uma tautologia é uma fórmula lógica verdadeira em pelo menos uma linha da tabela-verdade.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Tautologia é a fórmula verdadeira em TODAS as linhas da tabela-verdade — não apenas em algumas. 'Verdadeira em pelo menos uma' descreve uma contingência ou tautologia, mas não define tautologia.",
    explanationCorrect: "Errado: tautologia = V em TODAS as linhas. 'Verdadeira em pelo menos uma linha' poderia ser uma contingência. Exemplos de tautologia: p ∨ ¬p, p → p, (p→q) ↔ (¬q→¬p).",
    explanationWrong: "A afirmação está incorreta — tautologia exige V em TODAS as linhas, não apenas em algumas.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c05_q03",
    contentId: "rlm_lp_c05",
    statement: "A fórmula (p ∨ ¬p) é um exemplo de tautologia, pois é sempre verdadeira independentemente do valor de p.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "p ∨ ¬p: se p=V → V∨F=V; se p=F → F∨V=V. Sempre V → é tautologia (princípio do terceiro excluído).",
    explanationCorrect: "Certo: p ∨ ¬p = tautologia (princípio do terceiro excluído). Qualquer que seja o valor de p, p ∨ ¬p = V. Outro exemplo: p → p = sempre V.",
    explanationWrong: "A afirmação está correta — p ∨ ¬p é tautologia clássica.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c05_q04",
    contentId: "rlm_lp_c05",
    statement: "A equivalência lógica entre p e q (p ≡ q) significa que p ↔ q é uma tautologia.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "p ≡ q (equivalência lógica) se e somente se p e q têm a mesma tabela-verdade — o que equivale a dizer que p ↔ q é tautologia (sempre V).",
    explanationCorrect: "Certo: p ≡ q ↔ (p ↔ q é tautologia). Se p e q têm a mesma tabela-verdade, então em toda linha p ↔ q = V → é tautologia. Ex: (p→q) ≡ (¬p∨q) → (p→q) ↔ (¬p∨q) é tautologia.",
    explanationWrong: "A afirmação está correta — equivalência lógica ↔ o bicondicional é tautologia.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c05_q05",
    contentId: "rlm_lp_c05",
    statement: "Quantas linhas possui a tabela-verdade da fórmula (p → q) ∧ r?",
    alternatives: [
      { letter: "A", text: "4 linhas (2 variáveis)." },
      { letter: "B", text: "6 linhas (3 variáveis × 2)." },
      { letter: "C", text: "8 linhas (2³ = 8)." },
      { letter: "D", text: "16 linhas (4 variáveis)." },
      { letter: "E", text: "3 linhas (uma por variável)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A fórmula (p → q) ∧ r tem 3 variáveis distintas (p, q, r). Tabela: 2³ = 8 linhas.",
    explanationCorrect: "C: 3 variáveis distintas (p, q, r) → 2³ = 8 linhas. O número de linhas depende das variáveis distintas — não do número de ocorrências.",
    explanationWrong: "A: seria 2 variáveis. B: a fórmula de cálculo não é n×2. D: seria 4 variáveis. E: linhas são exponenciais (2^n), não lineares.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_lp_c05_q06",
    contentId: "rlm_lp_c05",
    statement: "A fórmula (p ∧ ¬p) é classificada como:",
    alternatives: [
      { letter: "A", text: "Tautologia — pois p pode ser V." },
      { letter: "B", text: "Contingência — pois às vezes é V e às vezes é F." },
      { letter: "C", text: "Contradição (antilogia) — pois é F em todas as linhas da tabela-verdade." },
      { letter: "D", text: "Equivalência — pois p ∧ ¬p ≡ p ∨ ¬p." },
      { letter: "E", text: "Tautologia — pois a negação de p compensa o p positivo." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "p ∧ ¬p: se p=V → V∧F=F; se p=F → F∧V=F. Sempre F → é contradição/antilogia (princípio da não-contradição).",
    explanationCorrect: "C: p ∧ ¬p = contradição. Sempre F — princípio da não-contradição. Nenhuma proposição pode ser V e ¬V simultaneamente. Oposição: p ∨ ¬p = tautologia (sempre V).",
    explanationWrong: "A e E: p ∧ ¬p = sempre F — nunca V. B: contingência é às vezes V/F — p ∧ ¬p é sempre F. D: p ∧ ¬p e p ∨ ¬p têm tabelas opostas — não equivalentes.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_lp_c05_q07",
    contentId: "rlm_lp_c05",
    statement: "Qual das equivalências lógicas abaixo corresponde às Leis de De Morgan?",
    alternatives: [
      { letter: "A", text: "p → q ≡ ¬q → ¬p" },
      { letter: "B", text: "¬(p ∧ q) ≡ ¬p ∨ ¬q  e  ¬(p ∨ q) ≡ ¬p ∧ ¬q" },
      { letter: "C", text: "p ↔ q ≡ (p → q) ∧ (q → p)" },
      { letter: "D", text: "p → q ≡ ¬p ∨ q" },
      { letter: "E", text: "¬(p → q) ≡ p ∧ ¬q" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Leis de De Morgan: ¬(p ∧ q) = ¬p ∨ ¬q (nega conjunção → troca 'e' por 'ou' e nega cada componente) e ¬(p ∨ q) = ¬p ∧ ¬q (nega disjunção → troca 'ou' por 'e').",
    explanationCorrect: "B: De Morgan 1: ¬(p ∧ q) = ¬p ∨ ¬q. De Morgan 2: ¬(p ∨ q) = ¬p ∧ ¬q. Regra mnemônica: nega, troca o conectivo e nega cada componente.",
    explanationWrong: "A: é a contrapositiva (equivalência da condicional). C: é a definição do bicondicional. D: forma alternativa da condicional. E: negação da condicional. Apenas B corresponde às Leis de De Morgan.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_lp_c05_q08",
    contentId: "rlm_lp_c05",
    statement: "Qual proposição abaixo é uma tautologia?",
    alternatives: [
      { letter: "A", text: "p ∧ q" },
      { letter: "B", text: "p → q" },
      { letter: "C", text: "p ∨ q" },
      { letter: "D", text: "(p → q) ↔ (¬q → ¬p)" },
      { letter: "E", text: "p ∧ ¬p" },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "(p → q) ↔ (¬q → ¬p) é tautologia porque expressa a equivalência entre a condicional e sua contrapositiva — sempre V. As demais são contingências ou contradição.",
    explanationCorrect: "D: (p→q) ↔ (¬q→¬p) é sempre V — a condicional e sua contrapositiva são logicamente equivalentes. Logo o bicondicional entre elas é tautologia. A, B, C: contingências. E: contradição.",
    explanationWrong: "A (p∧q): F quando p=F ou q=F. B (p→q): F quando p=V e q=F. C (p∨q): F quando ambos F. E (p∧¬p): contradição (sempre F). Apenas D é tautologia.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── rlm_lp_c06 — Negação de Proposições: De Morgan e Quantificadores ─────

  {
    id: "rlm_lp_c06_q01",
    contentId: "rlm_lp_c06",
    statement: "Pela primeira Lei de De Morgan, ¬(p ∧ q) é logicamente equivalente a ¬p ∨ ¬q.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Primeira lei de De Morgan: ¬(p ∧ q) = ¬p ∨ ¬q. Ao negar uma conjunção, troca-se 'e' por 'ou' e nega-se cada componente.",
    explanationCorrect: "Certo: De Morgan 1 = ¬(p ∧ q) = ¬p ∨ ¬q. Regra: negar uma conjunção → trocar 'e' por 'ou' e negar cada parte.",
    explanationWrong: "A afirmação está correta — primeira Lei de De Morgan.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c06_q02",
    contentId: "rlm_lp_c06",
    statement: "A negação de 'Todo policial é concursado' é 'Nenhum policial é concursado'.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "A negação de 'Todo A é B' é 'Algum A não é B' — não 'Nenhum A é B'. 'Nenhum' é o oposto de 'Algum', não de 'Todo'.",
    explanationCorrect: "Errado: ¬('Todo policial é concursado') = 'Algum policial NÃO é concursado'. A negação de 'Todo' é 'Algum não' — não 'Nenhum'.",
    explanationWrong: "A afirmação está incorreta — negação de 'Todo A é B' = 'Algum A não é B'.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c06_q03",
    contentId: "rlm_lp_c06",
    statement: "A negação da proposição condicional 'Se estuda (p), então passa (q)' é 'Estuda e não passa' — formalmente representada por p ∧ ¬q.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "¬(p → q) = p ∧ ¬q. Ao negar uma condicional, mantém-se o antecedente p e nega-se o consequente q, ligando-os por 'e'.",
    explanationCorrect: "Certo: ¬(p → q) = p ∧ ¬q = 'Estuda E não passa'. É a única situação que torna a condicional falsa — antecedente V e consequente F.",
    explanationWrong: "A afirmação está correta — negação da condicional = antecedente ∧ negação do consequente.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c06_q04",
    contentId: "rlm_lp_c06",
    statement: "Pela segunda Lei de De Morgan, ¬(p ∨ q) é logicamente equivalente a ¬p ∧ ¬q.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Segunda lei de De Morgan: ¬(p ∨ q) = ¬p ∧ ¬q. Ao negar uma disjunção, troca-se 'ou' por 'e' e nega-se cada componente.",
    explanationCorrect: "Certo: De Morgan 2 = ¬(p ∨ q) = ¬p ∧ ¬q. Regra: negar uma disjunção → trocar 'ou' por 'e' e negar cada parte.",
    explanationWrong: "A afirmação está correta — segunda Lei de De Morgan.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_lp_c06_q05",
    contentId: "rlm_lp_c06",
    statement: "Qual é a negação correta da proposição 'Nenhum suspeito foi solto'?",
    alternatives: [
      { letter: "A", text: "'Todo suspeito foi solto.'" },
      { letter: "B", text: "'Algum suspeito foi solto.'" },
      { letter: "C", text: "'Nenhum suspeito foi preso.'" },
      { letter: "D", text: "'Todo suspeito não foi solto.'" },
      { letter: "E", text: "'Algum suspeito não foi solto.'" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "¬('Nenhum A é B') = 'Algum A é B'. Pares contraditórios: Nenhum ↔ Algum. Todo ↔ Algum não.",
    explanationCorrect: "B: ¬('Nenhum suspeito foi solto') = 'Algum suspeito foi solto'. Nenhum e Algum são contraditórios — a negação de um é o outro.",
    explanationWrong: "A: 'Todo suspeito foi solto' é excessivo — não é a negação. C: muda o predicado ('preso' ≠ 'solto'). D: 'Todo suspeito não foi solto' = 'Nenhum suspeito foi solto' = afirmação original. E: 'Algum não foi solto' é compatível com 'Nenhum foi solto'.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_lp_c06_q06",
    contentId: "rlm_lp_c06",
    statement: "Qual é a negação correta de '¬(p ∧ q)' usando a primeira Lei de De Morgan?",
    alternatives: [
      { letter: "A", text: "p ∧ q" },
      { letter: "B", text: "¬p ∧ ¬q" },
      { letter: "C", text: "¬p ∨ ¬q" },
      { letter: "D", text: "p ∨ q" },
      { letter: "E", text: "p ∧ ¬q" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "De Morgan 1: ¬(p ∧ q) = ¬p ∨ ¬q. A questão pede a forma equivalente de ¬(p ∧ q), que é exatamente ¬p ∨ ¬q.",
    explanationCorrect: "C: De Morgan 1 diz que ¬(p ∧ q) = ¬p ∨ ¬q. Troca 'e' por 'ou' e nega cada componente.",
    explanationWrong: "A: é (p∧q), não sua negação. B: ¬p ∧ ¬q = ¬(p∨q) (De Morgan 2) — não a negação da conjunção. D: p∨q é a conjunção reescrita sem negação. E: é a negação da condicional, não da conjunção.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_lp_c06_q07",
    contentId: "rlm_lp_c06",
    statement: "Qual é a negação correta da proposição composta 'João estuda Direito E passa no concurso'?",
    alternatives: [
      { letter: "A", text: "'João não estuda Direito E não passa no concurso.'" },
      { letter: "B", text: "'João não estuda Direito OU não passa no concurso.'" },
      { letter: "C", text: "'João estuda Direito OU passa no concurso.'" },
      { letter: "D", text: "'João não estuda Direito E passa no concurso.'" },
      { letter: "E", text: "'João estuda Direito E não passa no concurso.'" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A proposição é uma conjunção (p ∧ q). De Morgan 1: ¬(p ∧ q) = ¬p ∨ ¬q = 'Não estuda Direito OU não passa no concurso'.",
    explanationCorrect: "B: De Morgan 1 → ¬(p ∧ q) = ¬p ∨ ¬q. Troca o 'E' por 'OU' e nega cada componente. Resultado: 'João não estuda Direito OU não passa no concurso'.",
    explanationWrong: "A: ¬p ∧ ¬q = ¬(p ∨ q) — seria a negação de uma disjunção, não desta conjunção. C: não negou nenhum componente. D e E: negaram apenas um dos componentes, mantendo o 'e' — incorreto.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_lp_c06_q08",
    contentId: "rlm_lp_c06",
    statement: "Qual é a negação correta da proposição 'Todo servidor público que comete improbidade administrativa perde o cargo ou paga multa'?",
    alternatives: [
      { letter: "A", text: "'Nenhum servidor público que comete improbidade administrativa perde o cargo e paga multa.'" },
      { letter: "B", text: "'Algum servidor público que comete improbidade administrativa não perde o cargo e não paga multa.'" },
      { letter: "C", text: "'Todo servidor público que comete improbidade administrativa não perde o cargo e não paga multa.'" },
      { letter: "D", text: "'Algum servidor público que comete improbidade administrativa perde o cargo ou paga multa.'" },
      { letter: "E", text: "'Nenhum servidor público comete improbidade administrativa.'" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Passo 1: ¬('Todo A é B') = 'Algum A não é B'. Passo 2: B = 'perde o cargo OU paga multa'. ¬B = ¬(perde ∨ paga) = não perde ∧ não paga (De Morgan 2). Resultado: 'Algum servidor... não perde o cargo E não paga multa'.",
    explanationCorrect: "B: dois passos. (1) Negar 'Todo' → 'Algum não'. (2) Negar 'perde o cargo OU paga multa' → De Morgan 2: 'não perde o cargo E não paga multa'. Resultado: 'Algum servidor que comete improbidade não perde o cargo E não paga multa'.",
    explanationWrong: "A: 'Nenhum' e 'e' — incorreto. C: 'Todo' permaneceu — não negou o quantificador. D: 'Algum' mas manteve o predicado positivo — não negou o consequente. E: mudou completamente o sujeito.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
];

// Fix: correct the contentId that had a wrong assignment
// rlm_lp_c03_q07 had a bug in contentId — fix it
const fixIdx = questions.findIndex(q => q.id === "rlm_lp_c03_q07");
if (fixIdx !== -1) questions[fixIdx].contentId = "rlm_lp_c03";

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n🚀 Seed R53 — Densificação: RLM — Lógica Proposicional (rlm_lp_c01–c06)\n");

  const atomIds = [
    "rlm_lp_c01", "rlm_lp_c02", "rlm_lp_c03",
    "rlm_lp_c04", "rlm_lp_c05", "rlm_lp_c06",
  ];

  // 1. Verificar existência dos átomos
  for (const atomId of atomIds) {
    const rows = (await db.execute(sql`
      SELECT id, title FROM "Content" WHERE id = ${atomId} LIMIT 1
    `)) as any[];
    if (rows[0]) {
      console.log(`  ✅ Átomo encontrado: ${atomId} — ${rows[0].title}`);
    } else {
      console.warn(`  ⚠️  AVISO: Átomo NÃO encontrado: ${atomId} — execute seed-rlm-logica-r29.ts primeiro`);
    }
  }

  console.log("");

  // 2. Inserir questões
  let inseridas = 0;
  let ignoradas = 0;

  for (const q of questions) {
    const contentRows = (await db.execute(sql`
      SELECT "subjectId", "topicId" FROM "Content" WHERE id = ${q.contentId} LIMIT 1
    `)) as any[];

    if (!contentRows[0]) {
      console.warn(`  ⚠️  Conteúdo não encontrado para questão ${q.id} — pulando`);
      ignoradas++;
      continue;
    }

    const qSubjectId = contentRows[0].subjectId;
    const qTopicId = contentRows[0].topicId;
    const alternativesJson = JSON.stringify(q.alternatives);

    const result = (await db.execute(sql`
      INSERT INTO "Question" (
        id, statement, alternatives, "correctAnswer", "correctOption",
        explanation, "explanationCorrect", "explanationWrong",
        "contentId", "subjectId", "topicId",
        "isActive", difficulty, "timesUsed",
        "questionType", "createdAt", "updatedAt"
      ) VALUES (
        ${q.id},
        ${q.statement},
        ${alternativesJson}::jsonb,
        ${q.correctAnswer},
        ${q.correctOption},
        ${q.explanation},
        ${q.explanationCorrect},
        ${q.explanationWrong},
        ${q.contentId},
        ${qSubjectId},
        ${qTopicId},
        true,
        ${q.difficulty},
        0,
        ${q.questionType},
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `)) as any;

    const affected = result.rowCount ?? result.count ?? 0;
    if (affected > 0) {
      console.log(`  ✅ ${q.id}`);
      inseridas++;
    } else {
      console.log(`  ⏭  ${q.id} (já existia)`);
      ignoradas++;
    }
  }

  // 3. Relatório final
  console.log("\n─────────────────────────────────────────");
  console.log(`✅ Inseridas : ${inseridas}`);
  console.log(`⏭  Ignoradas : ${ignoradas}`);
  console.log(`📊 Total     : ${questions.length}`);
  console.log("─────────────────────────────────────────\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed falhou:", err);
  process.exit(1);
});
