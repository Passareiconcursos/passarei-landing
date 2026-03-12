/**
 * Seed R55 — Densificação: RLM — Lógica Proposicional Avançada (rl_la_c01–c06)
 * Modo: DENSIFICAÇÃO — apenas questões; átomos já existem (seed-rlm-logica-r13.ts).
 *
 * Átomos-alvo (6 átomos × 6 questões = 36 questões):
 *   rl_la_c01 — Negação de Proposições Compostas — Leis de De Morgan
 *   rl_la_c02 — Condicional (→): Equivalências, Contrapositiva e Recíproca
 *   rl_la_c03 — Bicondicional (↔): Tabela-Verdade e Equivalência Mútua
 *   rl_la_c04 — Tautologia, Contradição e Contingência
 *   rl_la_c05 — Implicação Lógica vs Equivalência Lógica
 *   rl_la_c06 — Análise de Proposições CEBRASPE: Técnica de Resolução
 *
 * Execução: git pull && npx tsx db/seed-dense-rlm-avancado-r55.ts
 */

import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

interface Question {
  id: string;
  contentId: string;
  statement: string;
  alternatives: Array<{ letter: string; text: string }>;
  correctAnswer: string;
  correctOption: number;
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  questionType: "MULTIPLA_ESCOLHA" | "CERTO_ERRADO";
}

const CE = (correta: boolean) =>
  correta
    ? [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }]
    : [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }];

const questions: Question[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 1 — Negação De Morgan (rl_la_c01)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "rl_la_c01_q01",
    contentId: "rl_la_c01",
    statement: "Julgue: A negação da proposição 'O servidor faltou OU chegou atrasado' é 'O servidor não faltou OU não chegou atrasado'.",
    alternatives: CE(false),
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Pela 2ª Lei de De Morgan: ¬(p ∨ q) ≡ ¬p ∧ ¬q. A negação da disjunção é a conjunção das negações, não a disjunção delas.",
    explanationCorrect: "ERRADO. Pela 2ª Lei de De Morgan: ¬(p ∨ q) ≡ ¬p ∧ ¬q. A negação correta é 'O servidor NÃO faltou E NÃO chegou atrasado'. A afirmativa trocou 'E' por 'OU', o que invalida a negação.",
    explanationWrong: "A negação de uma disjunção (OU) é a conjunção (E) das negações de cada parte — 2ª Lei de De Morgan. Negar 'p OU q' resulta em '¬p E ¬q'.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rl_la_c01_q02",
    contentId: "rl_la_c01",
    statement: "A negação da proposição composta 'p ∧ q' é logicamente equivalente a:",
    alternatives: [
      { letter: "A", text: "¬p ∧ ¬q" },
      { letter: "B", text: "¬p ∨ ¬q" },
      { letter: "C", text: "p ∨ ¬q" },
      { letter: "D", text: "¬p ∨ q" },
      { letter: "E", text: "p ∧ ¬q" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "1ª Lei de De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q. A negação da conjunção é a disjunção das negações.",
    explanationCorrect: "Alternativa B. Pela 1ª Lei de De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q. A negação da conjunção (E) resulta na disjunção (OU) das negações de cada parte.",
    explanationWrong: "A 1ª Lei de De Morgan estabelece que negar uma conjunção gera a disjunção das negações. A alternativa A seria a negação de ambas sem trocar o conectivo — erro clássico.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rl_la_c01_q03",
    contentId: "rl_la_c01",
    statement: "Julgue: A dupla negação (¬¬p) de uma proposição é logicamente equivalente à própria proposição p.",
    alternatives: CE(true),
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Lei da dupla negação: ¬¬p ≡ p. Negar duas vezes volta ao valor original. Se p = V, ¬p = F e ¬¬p = V. Se p = F, ¬p = V e ¬¬p = F.",
    explanationCorrect: "CERTO. A lei da dupla negação (¬¬p ≡ p) é um dos princípios fundamentais da lógica proposicional. Independentemente do valor lógico de p, negá-la duas vezes restaura o valor original.",
    explanationWrong: "A dupla negação cancela a si mesma: ¬(¬p) = p. Esta é a Lei da Dupla Negação — um axioma da lógica clássica.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rl_la_c01_q04",
    contentId: "rl_la_c01",
    statement: "Em um contexto de investigação criminal: 'Todos os suspeitos foram ouvidos ou pelo menos um foi liberado.' A negação correta dessa proposição é:",
    alternatives: [
      { letter: "A", text: "Nenhum suspeito foi ouvido e todos foram liberados." },
      { letter: "B", text: "Nem todos os suspeitos foram ouvidos e nenhum foi liberado." },
      { letter: "C", text: "Nenhum suspeito foi ouvido ou nenhum foi liberado." },
      { letter: "D", text: "Alguns suspeitos não foram ouvidos e nenhum foi liberado." },
      { letter: "E", text: "Todos os suspeitos foram ouvidos e nenhum foi liberado." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "¬(p ∨ q) ≡ ¬p ∧ ¬q. Onde p = 'todos foram ouvidos' e q = 'pelo menos um foi liberado'. ¬p = 'nem todos foram ouvidos' e ¬q = 'nenhum foi liberado'.",
    explanationCorrect: "Alternativa B. Pela 2ª Lei de De Morgan: ¬(p ∨ q) ≡ ¬p ∧ ¬q. A disjunção se torna conjunção ao ser negada. ¬('todos ouvidos') = 'nem todos ouvidos'; ¬('pelo menos um liberado') = 'nenhum liberado'.",
    explanationWrong: "Para negar uma disjunção (OU): trocar por conjunção (E) e negar cada parte. Atenção à negação de quantificadores: ¬(todos) = nem todos (existe pelo menos um que não); ¬(pelo menos um) = nenhum.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rl_la_c01_q05",
    contentId: "rl_la_c01",
    statement: "Julgue: De acordo com as Leis de De Morgan, a negação de '¬p ∨ ¬q' é equivalente a 'p ∧ q'.",
    alternatives: CE(true),
    correctAnswer: "C",
    correctOption: 0,
    explanation: "¬(¬p ∨ ¬q) ≡ ¬(¬p) ∧ ¬(¬q) ≡ p ∧ q. Aplicando De Morgan à expressão e depois a dupla negação, chegamos a p ∧ q.",
    explanationCorrect: "CERTO. Aplicando a 2ª Lei de De Morgan: ¬(¬p ∨ ¬q) ≡ ¬(¬p) ∧ ¬(¬q) ≡ p ∧ q. Isso demonstra que p ∧ q e ¬(¬p ∨ ¬q) são logicamente equivalentes.",
    explanationWrong: "Aplique De Morgan à disjunção: ¬(A ∨ B) ≡ ¬A ∧ ¬B. Fazendo A=¬p e B=¬q: ¬(¬p ∨ ¬q) ≡ ¬¬p ∧ ¬¬q ≡ p ∧ q.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rl_la_c01_q06",
    contentId: "rl_la_c01",
    statement: "A proposição 'Não ocorre que: a testemunha mentiu e o réu foi absolvido' é logicamente equivalente a:",
    alternatives: [
      { letter: "A", text: "A testemunha não mentiu e o réu não foi absolvido." },
      { letter: "B", text: "A testemunha não mentiu ou o réu não foi absolvido." },
      { letter: "C", text: "A testemunha mentiu ou o réu foi absolvido." },
      { letter: "D", text: "A testemunha não mentiu ou o réu foi absolvido." },
      { letter: "E", text: "Se a testemunha mentiu, o réu foi absolvido." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "'Não ocorre que (p ∧ q)' = ¬(p ∧ q). Pela 1ª Lei de De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q.",
    explanationCorrect: "Alternativa B. A expressão 'não ocorre que p ∧ q' é a negação da conjunção: ¬(p ∧ q). Pela 1ª Lei de De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q = 'a testemunha NÃO mentiu OU o réu NÃO foi absolvido'.",
    explanationWrong: "A locução 'Não ocorre que X' é simplesmente ¬X. Para X = (p ∧ q), temos ¬(p ∧ q) ≡ ¬p ∨ ¬q pela 1ª Lei de De Morgan.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 2 — Condicional (→) (rl_la_c02)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "rl_la_c02_q01",
    contentId: "rl_la_c02",
    statement: "Julgue: O condicional 'p → q' é FALSO somente quando p é verdadeiro e q é falso.",
    alternatives: CE(true),
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Tabela-verdade do condicional: V→V=V, V→F=F, F→V=V, F→F=V. A única combinação que torna p→q falso é p=V e q=F.",
    explanationCorrect: "CERTO. O condicional p→q é falso exclusivamente quando a hipótese (p) é verdadeira e a tese (q) é falsa. Nos demais casos (F→V, F→F, V→V) o condicional é verdadeiro.",
    explanationWrong: "Memorize: o condicional só é F quando p=V e q=F. Premissa falsa nunca torna o condicional falso — 'de uma falsidade pode-se concluir qualquer coisa' (ex falso quodlibet).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rl_la_c02_q02",
    contentId: "rl_la_c02",
    statement: "A contrapositiva do condicional 'Se o policial encontrou a arma, então o suspeito está preso' é:",
    alternatives: [
      { letter: "A", text: "Se o suspeito está preso, então o policial encontrou a arma." },
      { letter: "B", text: "Se o policial não encontrou a arma, então o suspeito não está preso." },
      { letter: "C", text: "Se o suspeito não está preso, então o policial não encontrou a arma." },
      { letter: "D", text: "O policial não encontrou a arma ou o suspeito está preso." },
      { letter: "E", text: "Se o suspeito não está preso, então o policial encontrou a arma." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Contrapositiva de p→q é ¬q→¬p. p='policial encontrou a arma', q='suspeito está preso'. Contrapositiva: 'se suspeito NÃO está preso → policial NÃO encontrou a arma'.",
    explanationCorrect: "Alternativa C. A contrapositiva de p→q é ¬q→¬p (inverte e nega ambas as partes). É SEMPRE equivalente ao original. A alternativa A é a recíproca (q→p); a B é a inversa (¬p→¬q).",
    explanationWrong: "Não confunda: recíproca=q→p | inversa=¬p→¬q | contrapositiva=¬q→¬p (única equivalente ao original). Macete: CONTRA = inverter + negar.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rl_la_c02_q03",
    contentId: "rl_la_c02",
    statement: "Julgue: A recíproca de um condicional é sempre logicamente equivalente ao próprio condicional.",
    alternatives: CE(false),
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Falso. A recíproca de p→q é q→p, que NÃO é equivalente a p→q. Apenas a contrapositiva (¬q→¬p) é equivalente. Exemplo: p=F, q=V: p→q=V, mas q→p=F.",
    explanationCorrect: "ERRADO. A recíproca (q→p) NÃO é equivalente ao condicional original (p→q). Contra-exemplo: se p='2>5' (F) e q='1>0' (V), então p→q=V (F→V=V) mas q→p=F (V→F=F). Apenas a contrapositiva é equivalente.",
    explanationWrong: "Dos três derivados do condicional, SOMENTE a contrapositiva (¬q→¬p) é equivalente. Recíproca (q→p) e inversa (¬p→¬q) são equivalentes entre si, mas não ao original.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rl_la_c02_q04",
    contentId: "rl_la_c02",
    statement: "O condicional 'p → q' pode ser reescrito como disjunção equivalente na forma:",
    alternatives: [
      { letter: "A", text: "p ∨ q" },
      { letter: "B", text: "¬p ∨ q" },
      { letter: "C", text: "p ∨ ¬q" },
      { letter: "D", text: "¬p ∨ ¬q" },
      { letter: "E", text: "p ∧ ¬q" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Equivalência fundamental: p→q ≡ ¬p ∨ q. Verificar: V→V = V; ¬V∨V = F∨V = V ✓. V→F = F; ¬V∨F = F∨F = F ✓. F→V = V; ¬F∨V = V∨V = V ✓. F→F = V; ¬F∨F = V∨F = V ✓.",
    explanationCorrect: "Alternativa B. A equivalência p→q ≡ ¬p ∨ q é uma das mais importantes da lógica. O condicional é falso apenas quando p=V e q=F, o que corresponde exatamente a ¬p∨q = F∨F = F.",
    explanationWrong: "Memorize: p→q ≡ ¬p∨q. Esta equivalência é usada frequentemente para simplificar ou negar condicionais. A alternativa E (p∧¬q) é justamente a NEGAÇÃO do condicional, não sua equivalência.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rl_la_c02_q05",
    contentId: "rl_la_c02",
    statement: "Julgue: 'Se chover, o treinamento será cancelado. Não choveu. Logo, o treinamento não foi cancelado.' Este raciocínio é logicamente válido.",
    alternatives: CE(false),
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Falácia da negação do antecedente. De p→q e ¬p, NÃO se pode concluir ¬q. O condicional afirma que chuva IMPLICA cancelamento, mas não que ausência de chuva implica ausência de cancelamento (podem existir outros motivos).",
    explanationCorrect: "ERRADO. Trata-se da falácia da 'negação do antecedente'. De (p→q) e ¬p, não se conclui ¬q. O treinamento pode ser cancelado por outro motivo. A forma válida seria: de p→q e ¬q, conclui-se ¬p (modus tollens).",
    explanationWrong: "As formas válidas do condicional são: Modus Ponens (p→q, p ⊢ q) e Modus Tollens (p→q, ¬q ⊢ ¬p). Negar o antecedente para concluir a negação do consequente é falácia.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rl_la_c02_q06",
    contentId: "rl_la_c02",
    statement: "Considere p=V e q=F. Qual o valor lógico de (p → q) → p?",
    alternatives: [
      { letter: "A", text: "Verdadeiro, pois p=V independentemente do condicional externo." },
      { letter: "B", text: "Falso, pois p→q=F torna o condicional externo indefinido." },
      { letter: "C", text: "Verdadeiro, pois F→V=V e o resultado é V." },
      { letter: "D", text: "Falso, pois V→F=F e F→V=F." },
      { letter: "E", text: "Verdadeiro, pois toda proposição que implica V é V." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Passo 1: p→q = V→F = F. Passo 2: (p→q)→p = F→V = V. Resposta: Verdadeiro. A expressão (p→q)→p com p=V e q=F resulta em F→V = V.",
    explanationCorrect: "Alternativa C. Resolução passo a passo: ① p→q = V→F = F; ② (p→q)→p = F→V = V. Como F→V = V (premissa falsa torna o condicional verdadeiro), o resultado é V.",
    explanationWrong: "Resolva de dentro para fora. Primeiro calcule p→q (parte interna), depois use o resultado como antecedente do condicional externo. F→V = V pela tabela-verdade do condicional.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 3 — Bicondicional (↔) (rl_la_c03)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "rl_la_c03_q01",
    contentId: "rl_la_c03",
    statement: "Julgue: O bicondicional 'p ↔ q' é verdadeiro somente quando p e q têm o mesmo valor lógico.",
    alternatives: CE(true),
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Tabela-verdade do bicondicional: V↔V=V, V↔F=F, F↔V=F, F↔F=V. O bicondicional é verdadeiro apenas quando os dois operandos são iguais (ambos V ou ambos F).",
    explanationCorrect: "CERTO. O bicondicional p↔q é verdadeiro exatamente quando p e q têm o mesmo valor: V↔V=V e F↔F=V. Quando têm valores distintos (V↔F ou F↔V), o resultado é F.",
    explanationWrong: "Bicondicional = 'se e somente se'. p↔q ≡ (p→q) ∧ (q→p). Verdadeiro quando há igualdade de valores, falso quando há diferença.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rl_la_c03_q02",
    contentId: "rl_la_c03",
    statement: "O bicondicional 'p ↔ q' pode ser decomposto como:",
    alternatives: [
      { letter: "A", text: "(p → q) ∨ (q → p)" },
      { letter: "B", text: "(p → q) ∧ (q → p)" },
      { letter: "C", text: "(p ∧ q) ∨ (¬p ∧ ¬q)" },
      { letter: "D", text: "B e C estão corretas" },
      { letter: "E", text: "(p ∨ q) ∧ (¬p ∨ ¬q)" },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "p↔q ≡ (p→q)∧(q→p) — definição do bicondicional como duplo condicional. Também equivale a (p∧q)∨(¬p∧¬q) — verdadeiro quando ambos iguais. Ambas as expressões são corretas.",
    explanationCorrect: "Alternativa D. O bicondicional tem duas representações equivalentes: (1) (p→q)∧(q→p) — por definição, é o 'se e somente se'; (2) (p∧q)∨(¬p∧¬q) — verdadeiro quando ambos V ou ambos F.",
    explanationWrong: "O bicondicional tem duas formas equivalentes clássicas. A forma (p→q)∧(q→p) é a definição formal; a forma (p∧q)∨(¬p∧¬q) explicita os casos verdadeiros diretamente.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rl_la_c03_q03",
    contentId: "rl_la_c03",
    statement: "Julgue: A negação de 'p ↔ q' é equivalente ao XOR (disjunção exclusiva) 'p ⊕ q', que é verdadeiro quando p e q têm valores lógicos distintos.",
    alternatives: CE(true),
    correctAnswer: "C",
    correctOption: 0,
    explanation: "¬(p↔q) ≡ p⊕q (XOR). O XOR é verdadeiro quando os valores são distintos (V⊕F=V, F⊕V=V) e falso quando iguais (V⊕V=F, F⊕F=F) — exatamente o oposto do bicondicional.",
    explanationCorrect: "CERTO. ¬(p↔q) ≡ p⊕q. Como p↔q é V quando iguais e F quando distintos, sua negação é V quando distintos e F quando iguais — definição precisa do XOR (disjunção exclusiva).",
    explanationWrong: "Bicondicional (↔): V quando iguais. XOR (⊕): V quando distintos. São negações um do outro: ¬(p↔q) ≡ p⊕q.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rl_la_c03_q04",
    contentId: "rl_la_c03",
    statement: "Com p=F e q=F, qual o valor de [(p → q) ↔ (q → p)]?",
    alternatives: [
      { letter: "A", text: "Falso, pois ambos os condicionais internos são falsos." },
      { letter: "B", text: "Verdadeiro, pois F↔F=V." },
      { letter: "C", text: "Verdadeiro, pois ambos os condicionais internos são V." },
      { letter: "D", text: "Falso, pois o bicondicional requer que ambas as partes sejam V." },
      { letter: "E", text: "Indefinido, pois condicionais com antecedente F não têm valor." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "p→q = F→F = V. q→p = F→F = V. (p→q)↔(q→p) = V↔V = V. Esta expressão é sempre verdadeira — é uma tautologia (lei da comutatividade do bicondicional).",
    explanationCorrect: "Alternativa C. Passo a passo: ① p→q = F→F = V; ② q→p = F→F = V; ③ V↔V = V. Esta expressão é uma tautologia: (p→q)↔(q→p) é sempre verdadeira para quaisquer valores de p e q.",
    explanationWrong: "Lembre: F→F = V (premissa falsa torna o condicional verdadeiro). Logo ambos os condicionais internos valem V, e V↔V = V.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rl_la_c03_q05",
    contentId: "rl_la_c03",
    statement: "Julgue: 'O investigado foi indiciado se e somente se existem provas suficientes.' Se for verdade que o investigado não foi indiciado e que não existem provas suficientes, o bicondicional é verdadeiro.",
    alternatives: CE(true),
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Bicondicional: p↔q. p='foi indiciado'=F; q='existem provas'=F. F↔F=V. O bicondicional é verdadeiro quando ambas as partes são falsas.",
    explanationCorrect: "CERTO. p='foi indiciado'=F e q='existem provas'=F. O bicondicional F↔F=V. O bicondicional é satisfeito tanto quando ambos são verdadeiros quanto quando ambos são falsos.",
    explanationWrong: "O bicondicional 'p ↔ q' é V nas situações: (V,V) e (F,F). Como ambos os termos são F, o bicondicional é verdadeiro.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rl_la_c03_q06",
    contentId: "rl_la_c03",
    statement: "A proposição 'p ↔ q' é logicamente equivalente a qual das seguintes expressões?",
    alternatives: [
      { letter: "A", text: "(¬p ∨ q) ∧ (¬q ∨ p)" },
      { letter: "B", text: "(¬p ∧ q) ∨ (p ∧ ¬q)" },
      { letter: "C", text: "(p ∨ q) ∧ (¬p ∨ ¬q)" },
      { letter: "D", text: "¬p ∨ ¬q" },
      { letter: "E", text: "(p ∧ ¬q) ∨ (¬p ∧ q)" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "p↔q ≡ (p→q)∧(q→p) ≡ (¬p∨q)∧(¬q∨p). Substituindo cada condicional por sua forma disjuntiva: p→q=¬p∨q; q→p=¬q∨p. A alternativa B é o XOR (negação do bicondicional).",
    explanationCorrect: "Alternativa A. Expandindo: p↔q ≡ (p→q)∧(q→p). Cada condicional vira disjunção: p→q≡¬p∨q e q→p≡¬q∨p. Resultado: (¬p∨q)∧(¬q∨p). A alternativa B é justamente o XOR, oposto do bicondicional.",
    explanationWrong: "Substitua cada condicional pela sua forma equivalente em disjunção: p→q ≡ ¬p∨q. Depois aplique a conjunção das duas equivalências do bicondicional.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 4 — Tautologia, Contradição e Contingência (rl_la_c04)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "rl_la_c04_q01",
    contentId: "rl_la_c04",
    statement: "Julgue: Uma tautologia é uma proposição composta que é verdadeira para TODAS as combinações de valores de suas variáveis.",
    alternatives: CE(true),
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Por definição, tautologia é a fórmula cuja tabela-verdade tem APENAS valores V em todas as linhas. Exemplo clássico: p ∨ ¬p (princípio do terceiro excluído) — sempre verdadeiro.",
    explanationCorrect: "CERTO. Tautologia é a proposição que resulta em V para todas as interpretações possíveis. Na tabela-verdade, a coluna final tem exclusivamente Vs. Exemplo: p∨¬p = V sempre.",
    explanationWrong: "Tautologia = sempre V. Contradição = sempre F. Contingência = às vezes V, às vezes F. São os três tipos de proposições compostas quanto ao valor lógico.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rl_la_c04_q02",
    contentId: "rl_la_c04",
    statement: "Quantas linhas possui a tabela-verdade de uma proposição composta com 4 variáveis proposicionais distintas?",
    alternatives: [
      { letter: "A", text: "8 linhas" },
      { letter: "B", text: "12 linhas" },
      { letter: "C", text: "16 linhas" },
      { letter: "D", text: "32 linhas" },
      { letter: "E", text: "4 linhas" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O número de linhas de uma tabela-verdade com n variáveis é 2^n. Com 4 variáveis: 2^4 = 16 linhas.",
    explanationCorrect: "Alternativa C. A fórmula é 2^n, onde n é o número de variáveis distintas. Com 4 variáveis: 2^4 = 16 linhas. Para 2 variáveis: 4 linhas; para 3: 8 linhas; para 5: 32 linhas.",
    explanationWrong: "Número de linhas = 2^n (n = número de variáveis). Cada variável pode ser V ou F, logo dobramos o número de combinações a cada nova variável adicionada.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rl_la_c04_q03",
    contentId: "rl_la_c04",
    statement: "Julgue: A proposição 'p ∧ ¬p' é uma contradição, pois uma proposição e sua negação não podem ser verdadeiras simultaneamente.",
    alternatives: CE(true),
    correctAnswer: "C",
    correctOption: 0,
    explanation: "p ∧ ¬p é falsa para qualquer valor de p: se p=V, ¬p=F, logo V∧F=F; se p=F, ¬p=V, logo F∧V=F. É a contradição fundamental — princípio da não-contradição.",
    explanationCorrect: "CERTO. p∧¬p é sempre F. Quando p=V: V∧F=F. Quando p=F: F∧V=F. É a contradição fundamental, expressão do princípio da não-contradição da lógica clássica.",
    explanationWrong: "Contradição é a negação da tautologia. p∧¬p está sempre errado; p∨¬p está sempre certo. São os exemplos mais simples de contradição e tautologia respectivamente.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rl_la_c04_q04",
    contentId: "rl_la_c04",
    statement: "Qual das seguintes proposições é uma tautologia?",
    alternatives: [
      { letter: "A", text: "p ∧ q" },
      { letter: "B", text: "p → p" },
      { letter: "C", text: "p ↔ ¬p" },
      { letter: "D", text: "p ∧ ¬p" },
      { letter: "E", text: "p ∨ q" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "p→p: V→V=V, F→F=V. Sempre verdadeiro. A é contingência; B é tautologia; C é contradição (p↔¬p: V↔F=F e F↔V=F); D é contradição; E é contingência.",
    explanationCorrect: "Alternativa B. p→p é sempre verdadeiro: V→V=V e F→F=V. É a tautologia da reflexividade do condicional. A é contingência (depende dos valores); C e D são contradições; E é contingência.",
    explanationWrong: "Para identificar tautologia, verifique se a coluna final da tabela-verdade é sempre V. p→p: qualquer proposição implica a si mesma — sempre verdadeiro.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rl_la_c04_q05",
    contentId: "rl_la_c04",
    statement: "Julgue: Uma proposição contingente é verdadeira para pelo menos uma combinação de valores das variáveis e falsa para pelo menos outra combinação.",
    alternatives: CE(true),
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Contingência: não é tautologia (tem pelo menos um F) e não é contradição (tem pelo menos um V). É o tipo mais comum de proposição — depende dos valores das variáveis.",
    explanationCorrect: "CERTO. Contingência é exatamente a proposição que não é tautologia nem contradição — tem pelo menos um V e pelo menos um F na tabela-verdade. Exemplo: p∧q (V apenas quando ambos V).",
    explanationWrong: "Os três tipos são mutuamente exclusivos: tautologia (sempre V), contradição (sempre F), contingência (às vezes V, às vezes F). A maioria das proposições compostas é contingente.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rl_la_c04_q06",
    contentId: "rl_la_c04",
    statement: "A expressão '(p → q) ∨ (q → p)' é:",
    alternatives: [
      { letter: "A", text: "Contradição, pois os dois condicionais se anulam." },
      { letter: "B", text: "Contingência, pois depende dos valores de p e q." },
      { letter: "C", text: "Tautologia, pois é sempre verdadeira." },
      { letter: "D", text: "Tautologia apenas quando p=q." },
      { letter: "E", text: "Contradição quando p=V e q=F." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Verificação: V,V: (V→V)∨(V→V)=V∨V=V; V,F: (V→F)∨(F→V)=F∨V=V; F,V: (F→V)∨(V→F)=V∨F=V; F,F: (F→F)∨(F→F)=V∨V=V. Sempre V — tautologia.",
    explanationCorrect: "Alternativa C. Tautologia. Para quaisquer valores: quando p→q=F (p=V,q=F), o outro condicional q→p=F→V=V, mantendo a disjunção verdadeira. Nunca ambos os condicionais são falsos simultaneamente.",
    explanationWrong: "O condicional p→q só é F quando p=V e q=F. Nesse caso, q→p=F→V=V. Logo a disjunção é sempre V. Não existe combinação que torne ambos os condicionais falsos ao mesmo tempo.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 5 — Implicação Lógica vs Equivalência Lógica (rl_la_c05)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "rl_la_c05_q01",
    contentId: "rl_la_c05",
    statement: "Julgue: Dizer que 'p implica logicamente q' significa que o condicional 'p → q' é uma tautologia.",
    alternatives: CE(true),
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Implicação lógica (⊨): p implica q (p ⊨ q) se e somente se p→q é tautologia — isto é, não existe nenhuma interpretação em que p seja V e q seja F.",
    explanationCorrect: "CERTO. A implicação lógica (p ⊨ q) é definida como: p→q é uma tautologia. Ou seja, para toda interpretação possível, se p=V então q=V. Não há como p ser V e q ser F.",
    explanationWrong: "Distingua: implicação material (→) é um conectivo que pode ser V ou F; implicação lógica (⊨) é uma relação metalógica que exige que p→q seja tautologia.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rl_la_c05_q02",
    contentId: "rl_la_c05",
    statement: "Dois enunciados p e q são 'logicamente equivalentes' quando:",
    alternatives: [
      { letter: "A", text: "p → q é uma tautologia." },
      { letter: "B", text: "p ↔ q é uma tautologia." },
      { letter: "C", text: "p e q têm o mesmo número de variáveis." },
      { letter: "D", text: "p → q e q → p são ambos contingências." },
      { letter: "E", text: "p ∧ q é uma tautologia." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Equivalência lógica (p ≡ q ou p ⟺ q): p↔q é tautologia. Ou seja, para toda interpretação, p e q têm exatamente o mesmo valor lógico.",
    explanationCorrect: "Alternativa B. Equivalência lógica: p e q são logicamente equivalentes quando p↔q é tautologia — em toda interpretação, p=V↔q=V e p=F↔q=F. Exemplo: p→q ≡ ¬p∨q (são logicamente equivalentes).",
    explanationWrong: "Para verificar equivalência lógica, construa a tabela-verdade de p↔q. Se TODAS as linhas forem V (tautologia), então p e q são equivalentes. A alternativa A descreve implicação lógica, não equivalência.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rl_la_c05_q03",
    contentId: "rl_la_c05",
    statement: "Julgue: Se p é logicamente equivalente a q (p ≡ q), então p implica logicamente q (p ⊨ q) e q implica logicamente p (q ⊨ p).",
    alternatives: CE(true),
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Se p≡q, então p↔q é tautologia, o que implica que (p→q) é tautologia e (q→p) é tautologia. Portanto p⊨q e q⊨p. Equivalência implica implicação em ambas as direções.",
    explanationCorrect: "CERTO. Equivalência lógica (p≡q) significa p↔q é tautologia, que equivale a (p→q)∧(q→p) ser tautologia, o que implica que p⊨q e q⊨p. A equivalência é a implicação bidirecional.",
    explanationWrong: "Se p≡q (equivalentes), as implicações são bidirecionais: p⊨q e q⊨p. A diferença é que implicação é unidirecional (p⊨q não implica q⊨p), enquanto equivalência é bidirecional.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rl_la_c05_q04",
    contentId: "rl_la_c05",
    statement: "Para verificar que p e q são logicamente equivalentes, o método correto é:",
    alternatives: [
      { letter: "A", text: "Mostrar que p→q é contingência." },
      { letter: "B", text: "Mostrar que p↔q é tautologia." },
      { letter: "C", text: "Mostrar que p e q têm a mesma quantidade de variáveis." },
      { letter: "D", text: "Mostrar que p∧q é tautologia." },
      { letter: "E", text: "Mostrar que p→q e q→p são ambos contingências." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Equivalência lógica se verifica construindo a tabela-verdade de p↔q e conferindo se todas as linhas são V. Se p↔q é tautologia, então p≡q.",
    explanationCorrect: "Alternativa B. O método padrão: construir a tabela-verdade do bicondicional p↔q. Se todas as linhas resultarem em V (tautologia), as proposições são logicamente equivalentes.",
    explanationWrong: "Equivalência lógica = bicondicional tautológico. Para provar p≡q: monte a tabela de p↔q e verifique se é sempre V. Se houver algum F, não são equivalentes.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rl_la_c05_q05",
    contentId: "rl_la_c05",
    statement: "Julgue: As proposições 'p → q' e '¬q → ¬p' são logicamente equivalentes.",
    alternatives: CE(true),
    correctAnswer: "C",
    correctOption: 0,
    explanation: "(p→q) ↔ (¬q→¬p) é tautologia. A segunda expressão é a contrapositiva da primeira. Contrapositiva e condicional original são sempre logicamente equivalentes.",
    explanationCorrect: "CERTO. p→q e sua contrapositiva ¬q→¬p são logicamente equivalentes — o bicondicional (p→q)↔(¬q→¬p) é uma tautologia. Esta é uma das equivalências mais usadas em provas de lógica.",
    explanationWrong: "A contrapositiva (¬q→¬p) é sempre equivalente ao condicional original (p→q). Verifique: em toda linha da tabela-verdade, ambos têm exatamente o mesmo valor lógico.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rl_la_c05_q06",
    contentId: "rl_la_c05",
    statement: "Qual par de proposições representa implicação lógica (⊨) mas NÃO equivalência lógica (≡)?",
    alternatives: [
      { letter: "A", text: "p ∧ q  ⊨  p" },
      { letter: "B", text: "p  ⊨  p ∧ q" },
      { letter: "C", text: "p ∨ ¬p  ≡  p ∧ ¬p" },
      { letter: "D", text: "p → q  ≡  ¬p ∨ q" },
      { letter: "E", text: "p  ≡  ¬¬p" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "(p∧q)→p é tautologia (logo p∧q⊨p), mas p→(p∧q) não é tautologia (se p=V e q=F: V→F=F). Então há implicação de p∧q para p, mas não equivalência.",
    explanationCorrect: "Alternativa A. (p∧q)→p é tautologia: se ambos são V, então p é V — sempre. Mas p→(p∧q) não é tautologia (V→F quando q=F). Logo p∧q implica p, mas não são equivalentes.",
    explanationWrong: "Implicação (⊨) é unidirecional: p∧q⊨p, mas p não implica p∧q. Para equivalência seria necessário que ambas as implicações fossem tautológicas. As demais alternativas são equivalências legítimas.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 6 — Análise de Proposições CEBRASPE (rl_la_c06)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "rl_la_c06_q01",
    contentId: "rl_la_c06",
    statement: "Julgue: Na metodologia CEBRASPE/CESPE, ao analisar um item do tipo Certo/Errado, caso a proposição contenha um condicional com antecedente falso, o item deve ser marcado como CERTO.",
    alternatives: CE(true),
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Pela tabela-verdade: F→V=V e F→F=V. Se o antecedente é falso, o condicional é verdadeiro independentemente do consequente. Em provas CEBRASPE, segue-se a lógica formal.",
    explanationCorrect: "CERTO. Pela lógica formal, F→q=V para qualquer valor de q. Se a hipótese (antecedente) é falsa, o condicional é verdadeiro por vacuidade. Em provas CEBRASPE de lógica, este princípio se aplica diretamente.",
    explanationWrong: "O condicional p→q é verdadeiro quando p=F, qualquer que seja q. Esta é uma das características mais contraintuitivas da lógica formal, mas é exatamente assim que as questões de lógica do CEBRASPE funcionam.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rl_la_c06_q02",
    contentId: "rl_la_c06",
    statement: "Em questões CEBRASPE de lógica, ao negar a proposição 'Todo policial federal é concursado', a negação correta é:",
    alternatives: [
      { letter: "A", text: "Nenhum policial federal é concursado." },
      { letter: "B", text: "Algum policial federal não é concursado." },
      { letter: "C", text: "Todo policial federal não é concursado." },
      { letter: "D", text: "Nenhum policial federal não é concursado." },
      { letter: "E", text: "Algum policial federal é concursado." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Negação dos quantificadores: ¬(∀x P(x)) ≡ ∃x ¬P(x). 'Todo' negado = 'Algum ... não'. A alternativa A seria a negação de 'Algum é concursado', não a negação de 'Todo é concursado'.",
    explanationCorrect: "Alternativa B. Regra de negação de quantificadores: ¬('Todo A é B') = 'Algum A NÃO é B'. O quantificador universal (∀) negado vira existencial (∃) com predicado negado. Esta é a regra mais cobrada em CEBRASPE.",
    explanationWrong: "Tabela de negação de quantificadores: ¬(Todo A é B) = Algum A não é B | ¬(Nenhum A é B) = Algum A é B | ¬(Algum A é B) = Nenhum A é B | ¬(Algum A não é B) = Todo A é B.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rl_la_c06_q03",
    contentId: "rl_la_c06",
    statement: "Julgue: Em provas CEBRASPE, a expressão 'A menos que p, q' é equivalente ao condicional '¬p → q'.",
    alternatives: CE(true),
    correctAnswer: "C",
    correctOption: 0,
    explanation: "'A menos que p, q' equivale a '¬p → q' (se não p, então q). Também é equivalente a 'p ∨ q'. São expressões linguísticas frequentes em questões CEBRASPE.",
    explanationCorrect: "CERTO. 'A menos que p, q' ≡ '¬p → q' ≡ 'p ∨ q'. A locução 'a menos que' é equivalente a 'se não'. CEBRASPE utiliza estas formas linguísticas para testar a capacidade de traduzir para lógica formal.",
    explanationWrong: "'A menos que p, q' significa 'se não houver p, então q' = ¬p→q. Também pode ser escrito como p∨q (uma das duas condições se verifica). São formas equivalentes — verifique com tabela-verdade.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rl_la_c06_q04",
    contentId: "rl_la_c06",
    statement: "Nas questões CEBRASPE, 'p somente se q' traduz-se como:",
    alternatives: [
      { letter: "A", text: "q → p" },
      { letter: "B", text: "p → q" },
      { letter: "C", text: "p ↔ q" },
      { letter: "D", text: "¬p → q" },
      { letter: "E", text: "p ∧ q" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "'p somente se q' significa que p só ocorre na presença de q — logo, p → q. Cuidado: 'p se q' significa q → p (invertido). 'p se e somente se q' = p ↔ q.",
    explanationCorrect: "Alternativa B. 'p somente se q' = p→q. A locução 'somente se' introduz o consequente. Comparação: 'p SE q' = q→p (q é condição suficiente para p); 'p SOMENTE SE q' = p→q (q é condição necessária para p).",
    explanationWrong: "Memorize: SE = suficiente (entra como antecedente do outro); SOMENTE SE = necessário (o que vem depois é o consequente). 'p somente se q' → p precisa de q para ser verdadeiro → p→q.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rl_la_c06_q05",
    contentId: "rl_la_c06",
    statement: "Julgue: A proposição 'Não é verdade que todos os suspeitos foram liberados' é logicamente equivalente a 'Pelo menos um suspeito não foi liberado'.",
    alternatives: CE(true),
    correctAnswer: "C",
    correctOption: 0,
    explanation: "'Não é verdade que todos...' = ¬(∀x P(x)) ≡ ∃x ¬P(x) = 'existe pelo menos um x tal que ¬P(x)' = 'pelo menos um não foi liberado'.",
    explanationCorrect: "CERTO. ¬('Todos os suspeitos foram liberados') ≡ 'Pelo menos um suspeito NÃO foi liberado' = ∃x¬P(x). A negação do universal (∀) é o existencial (∃) com predicado negado. As duas formas linguísticas são equivalentes.",
    explanationWrong: "A negação de 'Todo A é B' é 'Algum A não é B' (pelo menos um). NÃO é 'Nenhum A é B'. Esta diferença é crucial e frequentemente cobrada pelo CEBRASPE.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rl_la_c06_q06",
    contentId: "rl_la_c06",
    statement: "A proposição 'Para toda pessoa: se é funcionário público, então tem estabilidade' pode ser negada como:",
    alternatives: [
      { letter: "A", text: "Para toda pessoa: se é funcionário público, então não tem estabilidade." },
      { letter: "B", text: "Existe pessoa que é funcionário público e não tem estabilidade." },
      { letter: "C", text: "Nenhuma pessoa é funcionário público ou tem estabilidade." },
      { letter: "D", text: "Existe pessoa que não é funcionário público e não tem estabilidade." },
      { letter: "E", text: "Para toda pessoa: não é funcionário público ou tem estabilidade." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "¬(∀x: p(x)→q(x)) ≡ ∃x: ¬(p(x)→q(x)) ≡ ∃x: p(x)∧¬q(x). Negar o universal vira existencial; negar o condicional resulta em antecedente ∧ negação do consequente.",
    explanationCorrect: "Alternativa B. Aplicando duas regras: (1) ¬∀x = ∃x; (2) ¬(p→q) = p∧¬q. Resultado: 'Existe pessoa que É funcionária pública E NÃO tem estabilidade'. Esta é a forma mais complexa cobrada pelo CEBRASPE em lógica de predicados.",
    explanationWrong: "Para negar '∀x: p→q': primeiro, troque ∀ por ∃; depois, aplique ¬(p→q) = p∧¬q. O erro mais comum é negar apenas o consequente (→ 'não tem estabilidade') sem transformar o quantificador.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
];

// ─── MAIN ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🚀 Seed R55 — Densificação: RLM — Lógica Avançada (rl_la_c01–c06)\n");

  // 1. Verificar existência dos átomos
  const atomIds = ["rl_la_c01", "rl_la_c02", "rl_la_c03", "rl_la_c04", "rl_la_c05", "rl_la_c06"];
  const foundAtoms = new Set<string>();

  for (const atomId of atomIds) {
    const rows = await db.execute(sql`SELECT id FROM "Content" WHERE id = ${atomId} LIMIT 1`) as any[];
    if (rows.length === 0) {
      console.warn(`  ⚠️  AVISO: Átomo NÃO encontrado: ${atomId} — execute seed-rlm-logica-r13.ts primeiro`);
    } else {
      foundAtoms.add(atomId);
    }
  }

  if (foundAtoms.size === 0) {
    console.error("\n❌ Nenhum átomo encontrado. Abortando.");
    process.exit(1);
  }

  // 2. Inserir questões
  let inserted = 0;
  let skipped = 0;

  for (const q of questions) {
    if (!foundAtoms.has(q.contentId)) {
      console.warn(`  ⚠️  Conteúdo não encontrado para questão ${q.id} — pulando`);
      skipped++;
      continue;
    }

    // Verificar se já existe
    const exists = await db.execute(sql`SELECT id FROM "Question" WHERE id = ${q.id} LIMIT 1`) as any[];
    if (exists.length > 0) {
      console.log(`  ⏭️  Já existe: ${q.id}`);
      skipped++;
      continue;
    }

    // Resolver subjectId e topicId a partir do átomo
    const contentRows = await db.execute(sql`
      SELECT "subjectId", "topicId" FROM "Content" WHERE id = ${q.contentId} LIMIT 1
    `) as any[];

    if (!contentRows[0]) {
      console.warn(`  ⚠️  Falha ao buscar subjectId/topicId para ${q.contentId} — pulando ${q.id}`);
      skipped++;
      continue;
    }

    const { subjectId, topicId } = contentRows[0];
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
        ${subjectId}, ${topicId}, ${q.contentId},
        true, 0, NOW(), NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `);

    console.log(`  ✅ ${q.id} [${q.difficulty}] ${q.questionType === "CERTO_ERRADO" ? "CE" : "ME"} → ${q.contentId}`);
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
