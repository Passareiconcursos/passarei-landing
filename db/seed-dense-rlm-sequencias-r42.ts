import { db } from "./index";
import { sql } from "drizzle-orm";

// R42 — DENSIFICAÇÃO: RLM Sequências, Conjuntos e Associação
// 4 átomos × 8 questões = 32 questões
// Padrão: 4 CE + 4 ME por átomo (FACIL → MEDIO → DIFICIL)

const CONTENT_IDS: Record<string, string> = {
  "Conjuntos e Operações":          "cml47hv4x04c8de7d9cdf35e4",
  "Sequências Lógicas":             "cml47i18pd7fdfd135ba6ea85",
  "Raciocínio Lógico: Associação":  "cml47i1ra1fec8cff009dc5a7",
  "Raciocínio Sequencial":          "content_1767400663022_6avumsqo2",
};

type Difficulty = "FACIL" | "MEDIO" | "DIFICIL";
type QuestionType = "MULTIPLA_ESCOLHA" | "CERTO_ERRADO";

interface Alternative { letter: string; text: string; }
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
  difficulty: Difficulty;
  questionType: QuestionType;
}

const questions: Question[] = [

  // ═══════════════════════════════════════════════════════════
  // ÁTOMO 1 — Conjuntos e Operações (cml47hv4x04c8de7d9cdf35e4)
  // ═══════════════════════════════════════════════════════════

  {
    id: "rlm_co_op_q01",
    contentId: "cml47hv4x04c8de7d9cdf35e4",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "Se A = {1, 2, 3} e B = {2, 3, 4}, então A ∩ B = {2, 3}.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "A interseção A ∩ B contém apenas os elementos comuns a ambos os conjuntos. Como 2 e 3 pertencem a A e a B, A ∩ B = {2, 3}. Correto.",
    explanationCorrect: "A interseção A ∩ B contém apenas os elementos comuns a ambos os conjuntos. Como 2 e 3 pertencem a A e a B, A ∩ B = {2, 3}. Correto.",
    explanationWrong: "A interseção A ∩ B reúne os elementos que pertencem simultaneamente a A e a B. Neste caso, 2 e 3 pertencem aos dois conjuntos, logo A ∩ B = {2, 3}.",
  },
  {
    id: "rlm_co_op_q02",
    contentId: "cml47hv4x04c8de7d9cdf35e4",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "A diferença A − B é formada pelos elementos que pertencem a A e também a B.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "A diferença A − B contém os elementos que pertencem a A, mas NÃO pertencem a B. O que pertence a A e também a B é a interseção A ∩ B, não a diferença.",
    explanationCorrect: "A diferença A − B contém os elementos que pertencem a A, mas NÃO pertencem a B. O que pertence a A e também a B é a interseção A ∩ B, não a diferença.",
    explanationWrong: "A afirmação descreve a interseção (A ∩ B), não a diferença. A − B é formada pelos elementos de A que não pertencem a B.",
  },
  {
    id: "rlm_co_op_q03",
    contentId: "cml47hv4x04c8de7d9cdf35e4",
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    statement: "Em uma turma de 30 alunos, 18 estudam inglês e 15 estudam espanhol. Se 7 estudam os dois idiomas, então 26 alunos estudam pelo menos um dos idiomas.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Princípio da Inclusão-Exclusão: |A ∪ B| = |A| + |B| − |A ∩ B| = 18 + 15 − 7 = 26. Correto.",
    explanationCorrect: "Princípio da Inclusão-Exclusão: |A ∪ B| = |A| + |B| − |A ∩ B| = 18 + 15 − 7 = 26. Correto.",
    explanationWrong: "Aplica-se o Princípio da Inclusão-Exclusão: |A ∪ B| = 18 + 15 − 7 = 26 alunos estudam pelo menos um dos idiomas.",
  },
  {
    id: "rlm_co_op_q04",
    contentId: "cml47hv4x04c8de7d9cdf35e4",
    questionType: "CERTO_ERRADO",
    difficulty: "DIFICIL",
    statement: "Se A ⊂ B (A está contido em B), então A ∪ B = B e A ∩ B = A.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Se todo elemento de A pertence a B: a união A ∪ B = B (A não acrescenta elementos novos); a interseção A ∩ B = A (todos os elementos de A já estão em B). Ambas as afirmações são corretas.",
    explanationCorrect: "Se todo elemento de A pertence a B: a união A ∪ B = B (A não acrescenta elementos novos); a interseção A ∩ B = A (todos os elementos de A já estão em B). Ambas as afirmações são corretas.",
    explanationWrong: "Quando A ⊂ B, todos os elementos de A já estão em B. Por isso A ∪ B = B e A ∩ B = A — ambas corretas.",
  },
  {
    id: "rlm_co_op_q05",
    contentId: "cml47hv4x04c8de7d9cdf35e4",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "Dados U = {1, 2, 3, 4, 5, 6}, A = {1, 2, 3, 4} e B = {3, 4, 5, 6}, qual é A ∩ B?",
    alternatives: [
      { letter: "A", text: "{1, 2, 3, 4, 5, 6}" },
      { letter: "B", text: "{3, 4}" },
      { letter: "C", text: "{1, 2, 5, 6}" },
      { letter: "D", text: "{1, 2}" },
      { letter: "E", text: "{5, 6}" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A ∩ B reúne apenas os elementos comuns: 3 e 4 pertencem a A e a B. Portanto A ∩ B = {3, 4}.",
    explanationCorrect: "A ∩ B reúne apenas os elementos comuns: 3 e 4 pertencem a A e a B. Portanto A ∩ B = {3, 4}.",
    explanationWrong: "A interseção A ∩ B reúne apenas os elementos que aparecem nos dois conjuntos: 3 e 4. Resposta correta: {3, 4}.",
  },
  {
    id: "rlm_co_op_q06",
    contentId: "cml47hv4x04c8de7d9cdf35e4",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "Em uma pesquisa com 50 pessoas, 30 gostam de futebol e 20 gostam de vôlei. Se 8 gostam dos dois esportes, quantas pessoas gostam de pelo menos um deles?",
    alternatives: [
      { letter: "A", text: "50" },
      { letter: "B", text: "48" },
      { letter: "C", text: "42" },
      { letter: "D", text: "38" },
      { letter: "E", text: "35" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "|Futebol ∪ Vôlei| = 30 + 20 − 8 = 42. Das 50 pessoas, 42 gostam de pelo menos um dos esportes.",
    explanationCorrect: "|Futebol ∪ Vôlei| = 30 + 20 − 8 = 42. Das 50 pessoas, 42 gostam de pelo menos um dos esportes.",
    explanationWrong: "Pelo Princípio da Inclusão-Exclusão: 30 + 20 − 8 = 42 pessoas gostam de pelo menos um dos esportes.",
  },
  {
    id: "rlm_co_op_q07",
    contentId: "cml47hv4x04c8de7d9cdf35e4",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "MEDIO",
    statement: "Dados A = {a, b, c, d} e B = {c, d, e, f}, qual é A − B?",
    alternatives: [
      { letter: "A", text: "{a, b, c, d, e, f}" },
      { letter: "B", text: "{c, d}" },
      { letter: "C", text: "{a, b}" },
      { letter: "D", text: "{e, f}" },
      { letter: "E", text: "{a, b, e, f}" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A − B reúne os elementos de A que não pertencem a B. De A = {a, b, c, d}, os elementos c e d pertencem também a B, portanto A − B = {a, b}.",
    explanationCorrect: "A − B reúne os elementos de A que não pertencem a B. De A = {a, b, c, d}, os elementos c e d pertencem também a B, portanto A − B = {a, b}.",
    explanationWrong: "A − B exclui de A os elementos que também estão em B. Como c e d estão em B, sobram apenas a e b: A − B = {a, b}.",
  },
  {
    id: "rlm_co_op_q08",
    contentId: "cml47hv4x04c8de7d9cdf35e4",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "DIFICIL",
    statement: "Em uma turma de 40 alunos, 20 praticam natação, 15 praticam judô e 12 praticam atletismo. Sabe-se que 6 praticam natação e judô, 4 praticam natação e atletismo, 3 praticam judô e atletismo, e nenhum pratica os três esportes. Quantos alunos não praticam nenhum esporte?",
    alternatives: [
      { letter: "A", text: "2" },
      { letter: "B", text: "4" },
      { letter: "C", text: "6" },
      { letter: "D", text: "8" },
      { letter: "E", text: "10" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "|N ∪ J ∪ A| = 20 + 15 + 12 − 6 − 4 − 3 + 0 = 34. Alunos sem nenhum esporte = 40 − 34 = 6.",
    explanationCorrect: "|N ∪ J ∪ A| = 20 + 15 + 12 − 6 − 4 − 3 + 0 = 34. Alunos sem nenhum esporte = 40 − 34 = 6.",
    explanationWrong: "Pela fórmula da inclusão-exclusão para 3 conjuntos: 20+15+12−6−4−3+0 = 34 praticam ao menos um esporte. Não praticam nenhum: 40−34 = 6.",
  },

  // ═══════════════════════════════════════════════════════════
  // ÁTOMO 2 — Sequências Lógicas (cml47i18pd7fdfd135ba6ea85)
  // ═══════════════════════════════════════════════════════════

  {
    id: "rlm_sq_lg_q01",
    contentId: "cml47i18pd7fdfd135ba6ea85",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "A sequência 2, 4, 8, 16, 32, ... é uma progressão geométrica de razão 2.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Em uma PG, cada termo é obtido multiplicando o anterior pela razão. Aqui, 4/2 = 8/4 = 16/8 = 32/16 = 2. Razão = 2. Correto.",
    explanationCorrect: "Em uma PG, cada termo é obtido multiplicando o anterior pela razão. Aqui, 4/2 = 8/4 = 16/8 = 32/16 = 2. Razão = 2. Correto.",
    explanationWrong: "É sim uma PG de razão 2: cada termo é o dobro do anterior (2, 4, 8, 16, 32...).",
  },
  {
    id: "rlm_sq_lg_q02",
    contentId: "cml47i18pd7fdfd135ba6ea85",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "Na sequência 1, 4, 9, 16, 25, ..., os termos são quadrados perfeitos e o próximo elemento é 36.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Os termos são 1²=1, 2²=4, 3²=9, 4²=16, 5²=25. O próximo é 6²=36. Correto.",
    explanationCorrect: "Os termos são 1²=1, 2²=4, 3²=9, 4²=16, 5²=25. O próximo é 6²=36. Correto.",
    explanationWrong: "A sequência é formada por quadrados perfeitos consecutivos: 1², 2², 3², 4², 5², e o próximo é 6²=36.",
  },
  {
    id: "rlm_sq_lg_q03",
    contentId: "cml47i18pd7fdfd135ba6ea85",
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    statement: "Na sequência 3, 7, 13, 21, 31, ..., as diferenças entre termos consecutivos formam uma PA de razão 2, e o próximo elemento é 43.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Diferenças: 7−3=4, 13−7=6, 21−13=8, 31−21=10 → PA de razão 2. A próxima diferença é 12, portanto o próximo termo = 31 + 12 = 43. Correto.",
    explanationCorrect: "Diferenças: 7−3=4, 13−7=6, 21−13=8, 31−21=10 → PA de razão 2. A próxima diferença é 12, portanto o próximo termo = 31 + 12 = 43. Correto.",
    explanationWrong: "As diferenças entre termos são 4, 6, 8, 10... (PA razão 2). A próxima diferença é 12, logo o próximo termo é 31+12=43.",
  },
  {
    id: "rlm_sq_lg_q04",
    contentId: "cml47i18pd7fdfd135ba6ea85",
    questionType: "CERTO_ERRADO",
    difficulty: "DIFICIL",
    statement: "Na sequência de Fibonacci (1, 1, 2, 3, 5, 8, 13, ...), a razão entre termos consecutivos converge para √2 ≈ 1,414.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "A razão entre termos consecutivos de Fibonacci converge para o número de ouro φ = (1 + √5)/2 ≈ 1,618, não para √2 ≈ 1,414.",
    explanationCorrect: "A razão entre termos consecutivos de Fibonacci converge para o número de ouro φ = (1 + √5)/2 ≈ 1,618, não para √2 ≈ 1,414.",
    explanationWrong: "A razão de Fibonacci converge para φ ≈ 1,618 (número de ouro), não √2 ≈ 1,414.",
  },
  {
    id: "rlm_sq_lg_q05",
    contentId: "cml47i18pd7fdfd135ba6ea85",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "Qual é o próximo número na sequência: 5, 10, 20, 40, ...?",
    alternatives: [
      { letter: "A", text: "60" },
      { letter: "B", text: "70" },
      { letter: "C", text: "80" },
      { letter: "D", text: "100" },
      { letter: "E", text: "120" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "PG com razão 2: cada termo é o dobro do anterior. 40 × 2 = 80.",
    explanationCorrect: "PG com razão 2: cada termo é o dobro do anterior. 40 × 2 = 80.",
    explanationWrong: "A sequência é uma PG de razão 2 (cada termo dobra). O próximo é 40 × 2 = 80.",
  },
  {
    id: "rlm_sq_lg_q06",
    contentId: "cml47i18pd7fdfd135ba6ea85",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "Qual é o próximo número na sequência: 2, 5, 8, 11, 14, ...?",
    alternatives: [
      { letter: "A", text: "16" },
      { letter: "B", text: "17" },
      { letter: "C", text: "18" },
      { letter: "D", text: "19" },
      { letter: "E", text: "20" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "PA com razão 3: cada termo soma 3 ao anterior. 14 + 3 = 17.",
    explanationCorrect: "PA com razão 3: cada termo soma 3 ao anterior. 14 + 3 = 17.",
    explanationWrong: "PA de razão 3: basta somar 3 ao último termo. 14 + 3 = 17.",
  },
  {
    id: "rlm_sq_lg_q07",
    contentId: "cml47i18pd7fdfd135ba6ea85",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "MEDIO",
    statement: "Considere a sequência: 1, 2, 4, 7, 11, 16, ... As diferenças entre termos consecutivos formam uma PA de razão 1. Qual é o próximo elemento?",
    alternatives: [
      { letter: "A", text: "20" },
      { letter: "B", text: "21" },
      { letter: "C", text: "22" },
      { letter: "D", text: "23" },
      { letter: "E", text: "24" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Diferenças: 1, 2, 3, 4, 5 (PA de razão 1). A próxima diferença é 6, portanto o próximo elemento = 16 + 6 = 22.",
    explanationCorrect: "Diferenças: 1, 2, 3, 4, 5 (PA de razão 1). A próxima diferença é 6, portanto o próximo elemento = 16 + 6 = 22.",
    explanationWrong: "As diferenças são 1, 2, 3, 4, 5... (crescem de 1 em 1). A próxima diferença é 6, logo o próximo elemento é 16 + 6 = 22.",
  },
  {
    id: "rlm_sq_lg_q08",
    contentId: "cml47i18pd7fdfd135ba6ea85",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "DIFICIL",
    statement: "Os números triangulares são definidos por Tₙ = n(n+1)/2, gerando a sequência 1, 3, 6, 10, 15, 21, ... Qual é o 10º número triangular?",
    alternatives: [
      { letter: "A", text: "45" },
      { letter: "B", text: "50" },
      { letter: "C", text: "55" },
      { letter: "D", text: "60" },
      { letter: "E", text: "66" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "T₁₀ = 10 × (10 + 1) / 2 = 10 × 11 / 2 = 55.",
    explanationCorrect: "T₁₀ = 10 × (10 + 1) / 2 = 10 × 11 / 2 = 55.",
    explanationWrong: "Pela fórmula Tₙ = n(n+1)/2: T₁₀ = 10 × 11 / 2 = 55.",
  },

  // ═══════════════════════════════════════════════════════════
  // ÁTOMO 3 — Raciocínio Lógico: Associação (cml47i1ra1fec8cff009dc5a7)
  // ═══════════════════════════════════════════════════════════

  {
    id: "rlm_la_as_q01",
    contentId: "cml47i1ra1fec8cff009dc5a7",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "Se \"Todo A é B\" e \"Todo B é C\", então é correto concluir que \"Todo A é C\".",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Silogismo Barbara (AAA): premissa universal afirmativa + premissa universal afirmativa → conclusão universal afirmativa. Se todo A pertence a B e todo B pertence a C, então por transitividade todo A pertence a C.",
    explanationCorrect: "Silogismo Barbara (AAA): premissa universal afirmativa + premissa universal afirmativa → conclusão universal afirmativa. Se todo A pertence a B e todo B pertence a C, então por transitividade todo A pertence a C.",
    explanationWrong: "É um silogismo válido (Barbara): Todo A é B, Todo B é C → Todo A é C. A transitividade garante a conclusão.",
  },
  {
    id: "rlm_la_as_q02",
    contentId: "cml47i1ra1fec8cff009dc5a7",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "Se Ana é mais velha que Bia e Bia é mais velha que Carla, podemos concluir que Carla é a mais velha das três.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Por transitividade: Ana > Bia > Carla. A mais velha é Ana, não Carla.",
    explanationCorrect: "Por transitividade: Ana > Bia > Carla. A mais velha é Ana, não Carla.",
    explanationWrong: "A ordem é Ana > Bia > Carla. Carla é a mais NOVA, não a mais velha.",
  },
  {
    id: "rlm_la_as_q03",
    contentId: "cml47i1ra1fec8cff009dc5a7",
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    statement: "A negação lógica de \"Todos os candidatos passaram na prova\" é \"Nenhum candidato passou na prova\".",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "A negação de uma proposição universal afirmativa (∀x P(x)) é uma proposição existencial negativa (∃x ¬P(x)): \"Existe pelo menos um candidato que não passou na prova\". A negação de \"Todos\" é \"Existe algum que não\", não \"Nenhum\".",
    explanationCorrect: "A negação de uma proposição universal afirmativa (∀x P(x)) é uma proposição existencial negativa (∃x ¬P(x)): \"Existe pelo menos um candidato que não passou na prova\". A negação de \"Todos\" é \"Existe algum que não\", não \"Nenhum\".",
    explanationWrong: "A negação de \"Todos passaram\" é \"Existe ao menos um que NÃO passou\", não \"Nenhum passou\". Negar o quantificador universal gera um existencial negativo.",
  },
  {
    id: "rlm_la_as_q04",
    contentId: "cml47i1ra1fec8cff009dc5a7",
    questionType: "CERTO_ERRADO",
    difficulty: "DIFICIL",
    statement: "Das premissas \"Se João estuda, então passa na prova\" e \"João não passou na prova\", a conclusão lógica válida é \"João não estudou\".",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Modus Tollens: (p → q) e ¬q implicam ¬p. Se (estudar → passar) e (não passou), então (não estudou). Raciocínio válido.",
    explanationCorrect: "Modus Tollens: (p → q) e ¬q implicam ¬p. Se (estudar → passar) e (não passou), então (não estudou). Raciocínio válido.",
    explanationWrong: "É o Modus Tollens: p→q, ¬q ⊢ ¬p. Se estuda→passa e não passou, então não estudou. Válido.",
  },
  {
    id: "rlm_la_as_q05",
    contentId: "cml47i1ra1fec8cff009dc5a7",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "Ana, Bruno e Carla exercem as profissões de médica, engenheira e advogada (uma cada). Sabe-se que Ana não é advogada nem médica; Bruno não é médico. Qual é a profissão de Carla?",
    alternatives: [
      { letter: "A", text: "Médica" },
      { letter: "B", text: "Engenheira" },
      { letter: "C", text: "Advogada" },
      { letter: "D", text: "Médica ou advogada" },
      { letter: "E", text: "Não é possível determinar" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "Ana ≠ advogada e ≠ médica → Ana = engenheira. Bruno ≠ médico; restam médico e advogado para Bruno e Carla; Bruno ≠ médico → Bruno = advogado → Carla = médica.",
    explanationCorrect: "Ana ≠ advogada e ≠ médica → Ana = engenheira. Bruno ≠ médico; restam médico e advogado para Bruno e Carla; Bruno ≠ médico → Bruno = advogado → Carla = médica.",
    explanationWrong: "Ana só pode ser engenheira (≠ advogada, ≠ médica). Bruno ≠ médico → Bruno = advogado. Logo Carla = médica.",
  },
  {
    id: "rlm_la_as_q06",
    contentId: "cml47i1ra1fec8cff009dc5a7",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "Em uma corrida com 4 participantes (A, B, C, D): A chegou antes de B; C chegou depois de B; D chegou antes de A. Qual foi a ordem de chegada do 1º ao 4º?",
    alternatives: [
      { letter: "A", text: "A, B, C, D" },
      { letter: "B", text: "D, A, B, C" },
      { letter: "C", text: "D, B, A, C" },
      { letter: "D", text: "A, D, B, C" },
      { letter: "E", text: "Não é possível determinar" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "D chegou antes de A (D < A), A antes de B (A < B), C depois de B (B < C). Ordem: D, A, B, C.",
    explanationCorrect: "D chegou antes de A (D < A), A antes de B (A < B), C depois de B (B < C). Ordem: D, A, B, C.",
    explanationWrong: "Encadeando: D < A < B < C. A ordem do 1º ao 4º é D, A, B, C.",
  },
  {
    id: "rlm_la_as_q07",
    contentId: "cml47i1ra1fec8cff009dc5a7",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "MEDIO",
    statement: "Quatro amigos — Fábio, Gustavo, Helena e Inês — praticam esportes distintos: futebol, tênis, natação e vôlei. Sabe-se que: Fábio não pratica futebol nem tênis; Gustavo não pratica natação; Helena pratica vôlei; Inês pratica tênis. Qual é o esporte de Fábio?",
    alternatives: [
      { letter: "A", text: "Futebol" },
      { letter: "B", text: "Tênis" },
      { letter: "C", text: "Natação" },
      { letter: "D", text: "Vôlei" },
      { letter: "E", text: "Não é possível determinar" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Helena=vôlei, Inês=tênis. Para Fábio: ≠ futebol, ≠ tênis, ≠ vôlei (Helena) → Fábio=natação. Gustavo ≠ natação (Fábio) → Gustavo=futebol.",
    explanationCorrect: "Helena=vôlei, Inês=tênis. Para Fábio: ≠ futebol, ≠ tênis, ≠ vôlei (Helena) → Fábio=natação. Gustavo ≠ natação (Fábio) → Gustavo=futebol.",
    explanationWrong: "Eliminando: Helena=vôlei, Inês=tênis. Fábio ≠ futebol e ≠ tênis e ≠ vôlei → Fábio=natação.",
  },
  {
    id: "rlm_la_as_q08",
    contentId: "cml47i1ra1fec8cff009dc5a7",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "DIFICIL",
    statement: "Quatro candidatos — W, X, Y e Z — fizeram, cada um, uma prova diferente: Matemática, Português, História e Inglês. W não fez Matemática nem Português; X fez História; Y fez Português. Qual foi a prova de Z?",
    alternatives: [
      { letter: "A", text: "Matemática" },
      { letter: "B", text: "Português" },
      { letter: "C", text: "História" },
      { letter: "D", text: "Inglês" },
      { letter: "E", text: "Não é possível determinar" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "X=História, Y=Português. Restam Matemática e Inglês para W e Z. W ≠ Matemática → W=Inglês → Z=Matemática.",
    explanationCorrect: "X=História, Y=Português. Restam Matemática e Inglês para W e Z. W ≠ Matemática → W=Inglês → Z=Matemática.",
    explanationWrong: "Com X=História e Y=Português, sobram Matemática e Inglês. W ≠ Matemática → W=Inglês → Z=Matemática.",
  },

  // ═══════════════════════════════════════════════════════════
  // ÁTOMO 4 — Raciocínio Sequencial (content_1767400663022_6avumsqo2)
  // ═══════════════════════════════════════════════════════════

  {
    id: "rlm_sq_rs_q01",
    contentId: "content_1767400663022_6avumsqo2",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "Se hoje é segunda-feira, então daqui a 7 dias também será segunda-feira.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "A semana tem 7 dias. Daqui a múltiplos de 7 dias cai sempre no mesmo dia da semana. 7 = 1 × 7, portanto daqui a 7 dias será segunda-feira. Correto.",
    explanationCorrect: "A semana tem 7 dias. Daqui a múltiplos de 7 dias cai sempre no mesmo dia da semana. 7 = 1 × 7, portanto daqui a 7 dias será segunda-feira. Correto.",
    explanationWrong: "7 dias = 1 semana completa, logo cai no mesmo dia da semana. Daqui a 7 dias será segunda-feira.",
  },
  {
    id: "rlm_sq_rs_q02",
    contentId: "content_1767400663022_6avumsqo2",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "A sequência de letras A, C, E, G, I segue o padrão de letras alternadas do alfabeto, pulando uma letra a cada passo.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "A(1), C(3), E(5), G(7), I(9) — posições ímpares do alfabeto, avançando 2 posições a cada passo. Correto.",
    explanationCorrect: "A(1), C(3), E(5), G(7), I(9) — posições ímpares do alfabeto, avançando 2 posições a cada passo. Correto.",
    explanationWrong: "São as letras nas posições 1, 3, 5, 7, 9 do alfabeto — ou seja, letras alternadas (pula uma a cada vez). Correto.",
  },
  {
    id: "rlm_sq_rs_q03",
    contentId: "content_1767400663022_6avumsqo2",
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    statement: "Em uma sequência em que cada termo é obtido multiplicando o anterior por 3 e subtraindo 1, sendo o primeiro termo igual a 2, o quarto termo é 53.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "a₁=2; a₂=2×3−1=5; a₃=5×3−1=14; a₄=14×3−1=41. O quarto termo é 41, não 53.",
    explanationCorrect: "a₁=2; a₂=2×3−1=5; a₃=5×3−1=14; a₄=14×3−1=41. O quarto termo é 41, não 53.",
    explanationWrong: "Calculando: a₁=2, a₂=5, a₃=14, a₄=41. O quarto termo é 41, não 53.",
  },
  {
    id: "rlm_sq_rs_q04",
    contentId: "content_1767400663022_6avumsqo2",
    questionType: "CERTO_ERRADO",
    difficulty: "DIFICIL",
    statement: "Se 1º de janeiro de um ano não bissexto cai numa terça-feira, então 1º de fevereiro do mesmo ano cai numa sexta-feira.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Janeiro tem 31 dias. 31 = 4 × 7 + 3, ou seja, 31 dias equivalem a 4 semanas e 3 dias extras. Terça-feira + 3 dias = sexta-feira. Correto.",
    explanationCorrect: "Janeiro tem 31 dias. 31 = 4 × 7 + 3, ou seja, 31 dias equivalem a 4 semanas e 3 dias extras. Terça-feira + 3 dias = sexta-feira. Correto.",
    explanationWrong: "31 mod 7 = 3. Terça + 3 dias = quarta(+1), quinta(+2), sexta(+3). 1º de fevereiro cai na sexta-feira.",
  },
  {
    id: "rlm_sq_rs_q05",
    contentId: "content_1767400663022_6avumsqo2",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "Qual é o próximo elemento na sequência de letras: A, D, G, J, ...?",
    alternatives: [
      { letter: "A", text: "K" },
      { letter: "B", text: "L" },
      { letter: "C", text: "M" },
      { letter: "D", text: "N" },
      { letter: "E", text: "O" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O padrão avança 3 posições no alfabeto: A(1)→D(4)→G(7)→J(10)→M(13). O próximo elemento é M.",
    explanationCorrect: "O padrão avança 3 posições no alfabeto: A(1)→D(4)→G(7)→J(10)→M(13). O próximo elemento é M.",
    explanationWrong: "Cada letra avança 3 posições: A→D→G→J→M. O próximo é M (posição 13).",
  },
  {
    id: "rlm_sq_rs_q06",
    contentId: "content_1767400663022_6avumsqo2",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "Uma sequência de senhas segue o padrão: AA01, AB02, AC03, AD04, ... Qual é a 26ª senha?",
    alternatives: [
      { letter: "A", text: "AZ26" },
      { letter: "B", text: "BA26" },
      { letter: "C", text: "AZ25" },
      { letter: "D", text: "BA25" },
      { letter: "E", text: "ZZ26" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "A primeira letra permanece A; a segunda letra avança pelo alfabeto (A, B, C, ..., Z); o número incrementa de 1 em 1. Na 26ª posição: segunda letra = Z, número = 26 → AZ26.",
    explanationCorrect: "A primeira letra permanece A; a segunda letra avança pelo alfabeto (A, B, C, ..., Z); o número incrementa de 1 em 1. Na 26ª posição: segunda letra = Z, número = 26 → AZ26.",
    explanationWrong: "A 1ª letra fica fixa em A; a 2ª avança (A→B→...→Z); o número sobe de 1. A 26ª senha é AZ26.",
  },
  {
    id: "rlm_sq_rs_q07",
    contentId: "content_1767400663022_6avumsqo2",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "MEDIO",
    statement: "A sequência 2, 6, 12, 20, 30, 42, ... segue o padrão aₙ = n(n+1). Qual é o 8º termo?",
    alternatives: [
      { letter: "A", text: "56" },
      { letter: "B", text: "64" },
      { letter: "C", text: "72" },
      { letter: "D", text: "80" },
      { letter: "E", text: "90" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "a₈ = 8 × (8 + 1) = 8 × 9 = 72.",
    explanationCorrect: "a₈ = 8 × (8 + 1) = 8 × 9 = 72.",
    explanationWrong: "Pela fórmula aₙ = n(n+1): a₈ = 8 × 9 = 72.",
  },
  {
    id: "rlm_sq_rs_q08",
    contentId: "content_1767400663022_6avumsqo2",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "DIFICIL",
    statement: "Uma sequência de figuras tem 1, 5, 13, 25 quadrados nas quatro primeiras figuras. As diferenças entre termos crescem em PA de razão 4. Quantos quadrados tem a 6ª figura?",
    alternatives: [
      { letter: "A", text: "41" },
      { letter: "B", text: "53" },
      { letter: "C", text: "57" },
      { letter: "D", text: "61" },
      { letter: "E", text: "65" },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "Diferenças: 5−1=4, 13−5=8, 25−13=12 → PA de razão 4. Próximas: 16 e 20. a₅ = 25+16 = 41; a₆ = 41+20 = 61.",
    explanationCorrect: "Diferenças: 5−1=4, 13−5=8, 25−13=12 → PA de razão 4. Próximas: 16 e 20. a₅ = 25+16 = 41; a₆ = 41+20 = 61.",
    explanationWrong: "Diferenças: 4, 8, 12 (PA razão 4). Próximas diferenças: 16 e 20. a₅=41, a₆=61.",
  },
];

async function main() {
  console.log("=== R42 — DENSIFICAÇÃO: RLM Sequências, Conjuntos e Associação ===");
  console.log(`Total de questões a inserir: ${questions.length}`);

  // 1. Verificar existência dos átomos e coletar subjectId/topicId de referência
  let subjectId: string | null = null;
  let topicId: string | null = null;

  for (const [nome, contentId] of Object.entries(CONTENT_IDS)) {
    const rows = (await db.execute(sql`
      SELECT id, "subjectId", "topicId" FROM "Content" WHERE id = ${contentId} LIMIT 1
    `)) as any[];
    if (!rows[0]) {
      console.warn(`AVISO: átomo não encontrado — ${nome} (${contentId})`);
    } else {
      console.log(`  ✓ ${nome} (${contentId})`);
      if (!subjectId && rows[0].subjectId) {
        subjectId = rows[0].subjectId;
        topicId = rows[0].topicId;
      }
    }
  }

  if (!subjectId) {
    throw new Error("Nenhum átomo encontrado. Verifique os IDs de Content.");
  }

  // 2. Inserir questões
  let inseridos = 0;
  let ignorados = 0;

  for (const q of questions) {
    const alternativesJson = JSON.stringify(q.alternatives);

    // Buscar subjectId/topicId do átomo específico desta questão
    const contentRows = (await db.execute(sql`
      SELECT "subjectId", "topicId" FROM "Content" WHERE id = ${q.contentId} LIMIT 1
    `)) as any[];

    const qSubjectId = contentRows[0]?.subjectId ?? subjectId;
    const qTopicId   = contentRows[0]?.topicId   ?? topicId;

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

    if (result.rowCount === 0) {
      console.log(`  skip (já existe): ${q.id}`);
      ignorados++;
    } else {
      console.log(`  OK: ${q.id} [${q.questionType}] — ${q.statement.substring(0, 55)}...`);
      inseridos++;
    }
  }

  console.log(`\n=== CONCLUÍDO ===`);
  console.log(`  Inseridas: ${inseridos}`);
  console.log(`  Ignoradas: ${ignorados}`);
  console.log(`  Total:     ${inseridos + ignorados} / ${questions.length}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
