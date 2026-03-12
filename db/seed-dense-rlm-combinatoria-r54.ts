/**
 * Seed R54 — DENSIFICAÇÃO: RLM — Análise Combinatória (Anagramas e Permutações)
 * Átomos: rlm_ac_c01–c06 (já existentes no banco)
 * 48 questões novas: 8 por átomo (4 CE + 4 ME), progressão FACIL→DIFICIL
 * Execução: npx tsx db/seed-dense-rlm-combinatoria-r54.ts
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

  // ── rlm_ac_c01 — Princípio Fundamental da Contagem ───────────────────────

  {
    id: "rlm_ac_c01_q01",
    contentId: "rlm_ac_c01",
    statement: "Um viajante pode ir de Brasília a São Paulo de avião (3 voos disponíveis) OU de ônibus (5 horários). O número total de formas de realizar a viagem é 3 × 5 = 15.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Quando as escolhas são mutuamente exclusivas ('OU'), usa-se ADIÇÃO: 3 + 5 = 8. A multiplicação (PFC) se aplica quando as etapas são simultâneas ('E').",
    explanationCorrect: "Errado: alternativas exclusivas ('OU') → soma: 3 + 5 = 8 formas. O PFC (multiplicação) aplica-se quando há etapas simultâneas ('E'). Armadilha clássica: confundir 'E' (multiplica) com 'OU' (soma).",
    explanationWrong: "A afirmação está incorreta — 'OU' entre opções exclusivas = adição (3+5=8), não multiplicação.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c01_q02",
    contentId: "rlm_ac_c01",
    statement: "Um cardápio oferece 3 opções de entrada, 5 pratos principais e 2 sobremesas. Escolhendo exatamente uma de cada categoria, o número de refeições distintas possíveis é 30.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "PFC com etapas 'E' (uma entrada E um prato E uma sobremesa): 3 × 5 × 2 = 30. As etapas são independentes e simultâneas → multiplicação.",
    explanationCorrect: "Certo: PFC — 3 × 5 × 2 = 30. Etapas independentes ligadas por 'e' = produto. Cada escolha de entrada não afeta as opções de prato ou sobremesa.",
    explanationWrong: "A afirmação está correta — 3 × 5 × 2 = 30.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c01_q03",
    contentId: "rlm_ac_c01",
    statement: "Uma senha de 4 dígitos (de 0 a 9), com repetição permitida, tem 10.000 possibilidades distintas.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Com repetição permitida: 10 opções para cada uma das 4 posições → 10 × 10 × 10 × 10 = 10⁴ = 10.000.",
    explanationCorrect: "Certo: repetição permitida → cada posição tem 10 opções independentes. PFC: 10 × 10 × 10 × 10 = 10.000 senhas.",
    explanationWrong: "A afirmação está correta — 10⁴ = 10.000.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c01_q04",
    contentId: "rlm_ac_c01",
    statement: "Se uma tarefa tem a etapa A (4 opções) e a etapa B (3 opções), independentes entre si, o total de formas de realizá-la é 4 + 3 = 7.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Etapas simultâneas e independentes ligadas por 'E' → multiplicação: 4 × 3 = 12. Adição ocorre apenas quando as situações são mutuamente exclusivas ('OU').",
    explanationCorrect: "Errado: etapas simultâneas e independentes → PFC = multiplicação: 4 × 3 = 12. A adição (4+3=7) seria correta se as opções fossem excludentes (OU A, OU B).",
    explanationWrong: "A afirmação está incorreta — etapas simultâneas ligadas por 'E' = multiplicação (4×3=12).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c01_q05",
    contentId: "rlm_ac_c01",
    statement: "Um agente de segurança tem 4 camisas e 3 calças disponíveis. Quantas combinações distintas de uniforme (uma camisa e uma calça) ele pode montar?",
    alternatives: [
      { letter: "A", text: "7 combinações (4 + 3)." },
      { letter: "B", text: "12 combinações (4 × 3)." },
      { letter: "C", text: "24 combinações (4!)." },
      { letter: "D", text: "1 combinação (escolha entre camisa ou calça)." },
      { letter: "E", text: "Depende das cores disponíveis." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "PFC: escolher 1 camisa (4 opções) E 1 calça (3 opções) → 4 × 3 = 12 combinações.",
    explanationCorrect: "B: PFC — uma camisa E uma calça = multiplicação: 4 × 3 = 12. Cada camisa pode ser combinada com qualquer uma das 3 calças (etapas independentes).",
    explanationWrong: "A (4+3=7): seria a lógica do 'OU' — não se aplica aqui. C (4!): fatorial sem relação com o problema. D e E: não refletem o PFC.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_ac_c01_q06",
    contentId: "rlm_ac_c01",
    statement: "Uma senha de 3 letras maiúsculas do alfabeto (26 letras), sem repetição, pode ser formada de quantas maneiras distintas?",
    alternatives: [
      { letter: "A", text: "78 senhas (26 × 3)." },
      { letter: "B", text: "17.576 senhas (26³)." },
      { letter: "C", text: "15.600 senhas (26 × 25 × 24)." },
      { letter: "D", text: "2.600 senhas (26 × 25)." },
      { letter: "E", text: "6 senhas (3!)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Sem repetição: 1ª posição = 26 opções; 2ª = 25 (uma já usada); 3ª = 24 (duas já usadas). Total: 26 × 25 × 24 = 15.600.",
    explanationCorrect: "C: sem repetição → a cada posição reduz 1 opção. 26 × 25 × 24 = 15.600. B (26³=17.576) seria com repetição. A armadilha é confundir com/sem repetição.",
    explanationWrong: "A: 26×3 não é o método correto. B: 26³=17.576 seria com repetição. D: 26×25 seria apenas 2 posições. E: 3! é a permutação de 3 elementos distintos — não o problema aqui.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_ac_c01_q07",
    contentId: "rlm_ac_c01",
    statement: "Um concurso tem 5 questões de Direito E 3 de Português. Quantas sequências distintas de respostas (V ou F para cada questão) são possíveis?",
    alternatives: [
      { letter: "A", text: "16 sequências (2^4)." },
      { letter: "B", text: "256 sequências (2^8)." },
      { letter: "C", text: "16 sequências (8 × 2)." },
      { letter: "D", text: "8 sequências (uma por questão)." },
      { letter: "E", text: "64 sequências (2^6)." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "São 8 questões no total (5+3), cada uma com 2 opções (V ou F). PFC: 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 = 2⁸ = 256.",
    explanationCorrect: "B: 8 questões, cada uma com 2 opções → 2⁸ = 256. O PFC multiplica as opções de cada etapa (questão), independentemente da disciplina.",
    explanationWrong: "A: 2⁴ = 16 seriam apenas 4 questões. C: 8×2 não é a fórmula correta. D: 8 é o número de questões, não de sequências. E: 2⁶ = 64 seriam 6 questões.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_ac_c01_q08",
    contentId: "rlm_ac_c01",
    statement: "Para a formação de placas de veículo com 3 letras (A-Z) seguidas de 4 dígitos (0-9), com repetição permitida em todas as posições, quantas placas distintas são possíveis?",
    alternatives: [
      { letter: "A", text: "26.000 (26 × 10 × 100)." },
      { letter: "B", text: "17.576.000 (26³ × 10³)." },
      { letter: "C", text: "175.760.000 (26³ × 10⁴)." },
      { letter: "D", text: "456.976 (26⁴)." },
      { letter: "E", text: "10.000.000 (10⁷)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "3 letras com repetição: 26³ = 17.576. 4 dígitos com repetição: 10⁴ = 10.000. Total: 17.576 × 10.000 = 175.760.000.",
    explanationCorrect: "C: PFC com repetição → letras: 26 × 26 × 26 = 26³ = 17.576; dígitos: 10 × 10 × 10 × 10 = 10⁴ = 10.000. Total: 17.576 × 10.000 = 175.760.000.",
    explanationWrong: "A: fórmula incorreta. B: 10³ seriam apenas 3 dígitos — faltou o 4º. D: 26⁴ ignora os dígitos. E: 10⁷ ignora as letras.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── rlm_ac_c02 — Fatorial e Permutação Simples ───────────────────────────

  {
    id: "rlm_ac_c02_q01",
    contentId: "rlm_ac_c02",
    statement: "Por definição matemática, 0! = 0.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Por convenção matemática universal, 0! = 1 (não 0). Essa é uma das armadilhas mais comuns em provas de concurso.",
    explanationCorrect: "Errado: 0! = 1, por definição. Também 1! = 1. A convenção 0! = 1 é necessária para que fórmulas combinatórias funcionem corretamente (ex: C(n,0) = n!/0!n! = 1).",
    explanationWrong: "A afirmação está incorreta — 0! = 1 (convenção matemática), não 0.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c02_q02",
    contentId: "rlm_ac_c02",
    statement: "A permutação simples de 5 elementos distintos resulta em 120 arranjos possíveis.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "P(5) = 5! = 5 × 4 × 3 × 2 × 1 = 120.",
    explanationCorrect: "Certo: P(5) = 5! = 120. A permutação simples conta todas as formas de ordenar n elementos distintos em n posições.",
    explanationWrong: "A afirmação está correta — P(5) = 5! = 120.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c02_q03",
    contentId: "rlm_ac_c02",
    statement: "O arranjo simples A(5,3) — escolher e ordenar 3 elementos dentre 5 — resulta em 60.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "A(5,3) = 5!/(5-3)! = 5!/2! = 120/2 = 60. Ou diretamente: 5 × 4 × 3 = 60.",
    explanationCorrect: "Certo: A(5,3) = 5 × 4 × 3 = 60. Fórmula: A(n,k) = n!/(n-k)!. Com n=5 e k=3: 5!/2! = 120/2 = 60.",
    explanationWrong: "A afirmação está correta — A(5,3) = 60.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c02_q04",
    contentId: "rlm_ac_c02",
    statement: "A permutação simples de 7 elementos distintos resulta em 5.040 arranjos.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "P(7) = 7! = 7 × 6 × 5 × 4 × 3 × 2 × 1 = 5.040.",
    explanationCorrect: "Certo: 7! = 5.040. Tabela de fatoriais essencial: 5!=120, 6!=720, 7!=5.040, 8!=40.320, 9!=362.880, 10!=3.628.800.",
    explanationWrong: "A afirmação está correta — 7! = 5.040.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c02_q05",
    contentId: "rlm_ac_c02",
    statement: "Seis suspeitos serão interrogados em ordem aleatória. De quantas formas distintas podem ser chamados?",
    alternatives: [
      { letter: "A", text: "36 (6²)." },
      { letter: "B", text: "30 (6 × 5)." },
      { letter: "C", text: "720 (6!)." },
      { letter: "D", text: "120 (5!)." },
      { letter: "E", text: "42 (6 + 36)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Ordenar 6 suspeitos distintos em 6 posições = permutação simples P(6) = 6! = 720.",
    explanationCorrect: "C: P(6) = 6! = 720. Para ordenar todos os 6 elementos distintos em todas as 6 posições, usa-se a permutação simples = n!.",
    explanationWrong: "A: 6² = 36 não é fatorial. B: 6×5 = A(6,2) — apenas 2 posições. D: 5! seria 5 suspeitos. E: não é uma operação combinatória válida aqui.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_ac_c02_q06",
    contentId: "rlm_ac_c02",
    statement: "Qual a diferença fundamental entre permutação simples P(n) e arranjo simples A(n,k)?",
    alternatives: [
      { letter: "A", text: "Na permutação, os elementos podem se repetir; no arranjo, não." },
      { letter: "B", text: "Na permutação, ordenam-se TODOS os n elementos; no arranjo, escolhem-se e ordenam-se apenas k elementos dentre n." },
      { letter: "C", text: "O arranjo é sempre maior que a permutação para os mesmos n e k." },
      { letter: "D", text: "Permutação e arranjo são sinônimos — apenas os símbolos diferem." },
      { letter: "E", text: "A permutação não considera a ordem; o arranjo considera." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Permutação P(n) = n!: ordena TODOS os n elementos. Arranjo A(n,k) = n!/(n-k)!: escolhe e ordena apenas k de n. Quando k=n, A(n,n) = P(n).",
    explanationCorrect: "B: P(n) usa todos os n elementos (P(n) = n!). A(n,k) usa apenas k dos n elementos disponíveis (A(n,k) = n!/(n-k)!). A ordem importa em ambos.",
    explanationWrong: "A: ambos não admitem repetição (nas formas simples). C: P(n) = A(n,n) > A(n,k) para k<n. D: são conceitos distintos. E: ambos consideram a ordem (diferem de combinação, que não considera).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_ac_c02_q07",
    contentId: "rlm_ac_c02",
    statement: "Quantas formas distintas existem para escolher e ordenar 2 dentre 5 candidatos para as funções de presidente e secretário de uma comissão?",
    alternatives: [
      { letter: "A", text: "10 (C(5,2))." },
      { letter: "B", text: "25 (5²)." },
      { letter: "C", text: "20 (A(5,2) = 5×4)." },
      { letter: "D", text: "120 (5!)." },
      { letter: "E", text: "6 (3!)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Arranjo simples A(5,2): escolher e ORDENAR 2 de 5 (a ordem importa — presidente ≠ secretário). A(5,2) = 5 × 4 = 20.",
    explanationCorrect: "C: A(5,2) = 5 × 4 = 20. A ordem importa porque as funções são diferentes (presidente e secretário). Se fosse apenas escolher 2 sem função definida, seria C(5,2) = 10.",
    explanationWrong: "A: C(5,2)=10 não considera ordem — seria se os cargos fossem idênticos. B: 5² é produto com repetição. D: 5! ordena todos os 5. E: 3! sem relação com o problema.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_ac_c02_q08",
    contentId: "rlm_ac_c02",
    statement: "Simplificando a expressão 8!/5!, o resultado é:",
    alternatives: [
      { letter: "A", text: "3! = 6." },
      { letter: "B", text: "8!/5! = 8 × 7 × 6 = 336." },
      { letter: "C", text: "3 (divisão simples 8÷5=1 com resto 3)." },
      { letter: "D", text: "8!/5! não pode ser simplificado." },
      { letter: "E", text: "8 × 7 = 56." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "8!/5! = (8 × 7 × 6 × 5!)/ 5! = 8 × 7 × 6 = 336. Os termos de 5! ao 1! se cancelam.",
    explanationCorrect: "B: 8!/5! = 8 × 7 × 6 = 336. Técnica: cancelar os fatores comuns. 8! = 8×7×6×5! → dividindo por 5! sobram apenas 8, 7 e 6.",
    explanationWrong: "A: 3! = 6, não é o resultado (seria 8-5=3 termos, mas o produto é 336). C: não é divisão simples. D: pode sim ser simplificado. E: faltou multiplicar por 6.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── rlm_ac_c03 — Anagramas com Letras Distintas ──────────────────────────

  {
    id: "rlm_ac_c03_q01",
    contentId: "rlm_ac_c03",
    statement: "A palavra CARGO, composta por 5 letras todas distintas, possui 120 anagramas.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "CARGO: C, A, R, G, O — 5 letras distintas → P(5) = 5! = 120 anagramas.",
    explanationCorrect: "Certo: letras distintas → P(n) = n!. CARGO tem 5 letras distintas → 5! = 120.",
    explanationWrong: "A afirmação está correta — 5! = 120.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c03_q02",
    contentId: "rlm_ac_c03",
    statement: "Fixando a letra C na primeira posição da palavra CARGO, existem 24 anagramas distintos que começam com C.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "C fixo na 1ª posição → restam 4 letras (A, R, G, O) para permutar nas 4 posições restantes: 4! = 24.",
    explanationCorrect: "Certo: fixar C → permute as 4 letras restantes (A, R, G, O) → 4! = 24. Verificação: 24/120 = 1/5, pois C ocupa 1 de 5 posições com equal probabilidade.",
    explanationWrong: "A afirmação está correta — 4! = 24 anagramas começam com C.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c03_q03",
    contentId: "rlm_ac_c03",
    statement: "Os anagramas de CARGO com as vogais A e O sempre adjacentes (juntas) totalizam 48.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Bloco {A,O}: 2! = 2 arranjos internos (AO ou OA). Com o bloco, temos 4 elementos → 4! = 24 arranjos externos. Total: 4! × 2! = 24 × 2 = 48.",
    explanationCorrect: "Certo: vogais em bloco → {AO}, C, R, G = 4 elementos → 4! = 24 formas. Internamente: AO ou OA = 2! = 2. Total: 24 × 2 = 48.",
    explanationWrong: "A afirmação está correta — vogais de CARGO juntas = 4! × 2! = 48.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c03_q04",
    contentId: "rlm_ac_c03",
    statement: "Os anagramas de CARGO onde as vogais A e O nunca ficam adjacentes totalizam 48.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Vogais nunca adjacentes = Total − (vogais juntas) = 120 − 48 = 72. Não 48.",
    explanationCorrect: "Errado: vogais NUNCA adjacentes = Total − (com vogais juntas) = 120 − 48 = 72. O valor 48 é o número de anagramas COM as vogais adjacentes — não sem.",
    explanationWrong: "A afirmação está incorreta — 120 − 48 = 72 (não 48).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c03_q05",
    contentId: "rlm_ac_c03",
    statement: "Quantos anagramas possui a palavra JUIZ (4 letras todas distintas)?",
    alternatives: [
      { letter: "A", text: "12." },
      { letter: "B", text: "6." },
      { letter: "C", text: "24." },
      { letter: "D", text: "16." },
      { letter: "E", text: "8." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "JUIZ: J, U, I, Z — 4 letras distintas → P(4) = 4! = 24.",
    explanationCorrect: "C: 4 letras distintas → 4! = 24 anagramas. J, U, I, Z — nenhuma letra se repete.",
    explanationWrong: "A: 12 seria P(4)/2 — sem motivo para dividir. B: 6 = 3! seria 3 letras. D: 16 = 2⁴ — não se aplica. E: 8 = 2³ — sem relação.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_ac_c03_q06",
    contentId: "rlm_ac_c03",
    statement: "Quantos anagramas da palavra DELTA (5 letras distintas) têm as vogais E e A sempre juntas (adjacentes)?",
    alternatives: [
      { letter: "A", text: "24 (4!)." },
      { letter: "B", text: "12 (4!/2)." },
      { letter: "C", text: "48 (4! × 2!)." },
      { letter: "D", text: "120 (5!)." },
      { letter: "E", text: "36." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Vogais {E,A} em bloco: 2! = 2 arranjos internos. Elementos: {EA}, D, L, T → 4 elementos → 4! = 24. Total: 4! × 2! = 24 × 2 = 48.",
    explanationCorrect: "C: bloco {E,A} = 2! arranjos internos (EA ou AE). Com o bloco: 4 elementos → 4! = 24. Total: 24 × 2 = 48. Mesma lógica de CARGO.",
    explanationWrong: "A (4!=24): faltou multiplicar pelos arranjos internos do bloco (2!). B: divisão por 2 sem fundamento aqui. D: é o total sem restrição. E: não é um resultado válido pelo método do bloco.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_ac_c03_q07",
    contentId: "rlm_ac_c03",
    statement: "Quantos anagramas de CARGO NÃO começam com a letra C?",
    alternatives: [
      { letter: "A", text: "24." },
      { letter: "B", text: "48." },
      { letter: "C", text: "96." },
      { letter: "D", text: "100." },
      { letter: "E", text: "84." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Total de anagramas: 5! = 120. Começam com C: 4! = 24 (C fixo, 4 restantes livres). Não começam com C: 120 − 24 = 96.",
    explanationCorrect: "C: complementar = Total − (começam com C) = 120 − 24 = 96. Estratégia: é mais fácil contar os proibidos e subtrair do total.",
    explanationWrong: "A: 24 são os que COMEÇAM com C (não os que não começam). B: 48 são os com vogais juntas — não relacionado. D e E: não são resultados válidos pela estratégia complementar.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_ac_c03_q08",
    contentId: "rlm_ac_c03",
    statement: "Para uma palavra de 6 letras distintas, quantos anagramas começam E terminam com letras específicas e distintas (por exemplo, começa com A e termina com Z)?",
    alternatives: [
      { letter: "A", text: "720 (6!)." },
      { letter: "B", text: "24 (4!)." },
      { letter: "C", text: "120 (5!)." },
      { letter: "D", text: "48 (4!×2)." },
      { letter: "E", text: "12 (4!/2)." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A fixo na 1ª posição e Z fixo na 6ª posição. Restam 4 letras livres para as 4 posições centrais: 4! = 24.",
    explanationCorrect: "B: fixar 2 letras em posições específicas → restam 4 letras para as 4 posições centrais → 4! = 24. Regra: fixar k letras → restam (n-k)! para as posições livres.",
    explanationWrong: "A: 6! é o total sem restrição. C: 5! seria apenas 1 letra fixada. D e E: sem fundamento para o caso de 2 letras fixadas em posições específicas distintas.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── rlm_ac_c04 — Permutação com Repetição ────────────────────────────────

  {
    id: "rlm_ac_c04_q01",
    contentId: "rlm_ac_c04",
    statement: "A palavra BANANA tem B(1), A(3) e N(2), totalizando 6 letras. O número de anagramas distintos é 60.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "P(6; 1, 3, 2) = 6!/(1! × 3! × 2!) = 720/(1 × 6 × 2) = 720/12 = 60.",
    explanationCorrect: "Certo: BANANA = B(1), A(3), N(2), total 6 letras. P = 6!/(1!×3!×2!) = 720/12 = 60. Verificação: 1+3+2=6 ✓.",
    explanationWrong: "A afirmação está correta — 6!/(1!×3!×2!) = 60.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c04_q02",
    contentId: "rlm_ac_c04",
    statement: "A fórmula P(n; a, b) = n!/(a! × b!) aplica-se somente quando todas as letras da palavra são distintas.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "A fórmula P(n; a, b) aplica-se justamente quando há LETRAS REPETIDAS. Quando todas são distintas, o denominador = 1!×1!×...= 1, e a fórmula se reduz a P(n) = n!.",
    explanationCorrect: "Errado: a fórmula com repetição usa-se exatamente quando há letras repetidas. Quando todas são distintas, cada frequência é 1, o denominador é 1, e a fórmula se reduz a n!.",
    explanationWrong: "A afirmação está incorreta — a fórmula aplica-se quando há repetições, não quando todas são distintas.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c04_q03",
    contentId: "rlm_ac_c04",
    statement: "A palavra ARARA (A=3, R=2, total 5 letras) possui 10 anagramas distintos.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "P(5; 3, 2) = 5!/(3! × 2!) = 120/(6 × 2) = 120/12 = 10.",
    explanationCorrect: "Certo: ARARA = A(3), R(2), n=5. P = 5!/(3!×2!) = 120/12 = 10. Verificação: 3+2=5 ✓.",
    explanationWrong: "A afirmação está correta — 5!/(3!×2!) = 10.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c04_q04",
    contentId: "rlm_ac_c04",
    statement: "Para calcular os anagramas de MISSISSIPI (M=1, I=4, S=4, P=1, total 10 letras), o denominador da fórmula é 4! × 4! = 576.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "P(10; 1, 4, 4, 1): denominador = 1! × 4! × 4! × 1! = 1 × 24 × 24 × 1 = 576. Total: 10!/576 = 3.628.800/576 = 6.300.",
    explanationCorrect: "Certo: MISSISSIPI: M(1), I(4), S(4), P(1). Denominador: 1!×4!×4!×1! = 576. Total: 10!/576 = 6.300. Os termos com frequência 1 contribuem com 1! = 1 no denominador.",
    explanationWrong: "A afirmação está correta — denominador = 4!×4! = 576 (os termos com freq=1 não alteram o denominador).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c04_q05",
    contentId: "rlm_ac_c04",
    statement: "Por que, na permutação com repetição, divide-se o numerador n! pelos fatoriais das frequências de cada letra?",
    alternatives: [
      { letter: "A", text: "Para reduzir o cálculo computacional e simplificar a fórmula." },
      { letter: "B", text: "Porque as cópias idênticas de uma letra não geram arranjos distinguíveis — a divisão elimina as permutações redundantes." },
      { letter: "C", text: "Porque letras repetidas aumentam a probabilidade de cada posição." },
      { letter: "D", text: "Por convenção arbitrária — não há justificativa matemática." },
      { letter: "E", text: "Para que o resultado seja sempre menor que n!." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Cópias idênticas de uma letra (ex: dois 'A') são indistinguíveis. Permutar A₁ com A₂ gera o mesmo arranjo — uma duplicata. Dividi-se por a! para eliminar essas duplicatas.",
    explanationCorrect: "B: justificativa matemática — letras idênticas são indistinguíveis. Trocar A₁ por A₂ não gera novo arranjo. Dividindo por a!, eliminamos as a! permutações redundantes de cada grupo de letras iguais.",
    explanationWrong: "A: não é apenas simplificação — há justificativa matemática rigorosa. C: repetição não altera probabilidade de posição. D: há justificativa matemática sólida. E: consequência, não justificativa.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_ac_c04_q06",
    contentId: "rlm_ac_c04",
    statement: "Quantos anagramas distintos possui a palavra ERRE (E=2, R=2, total 4 letras)?",
    alternatives: [
      { letter: "A", text: "24 (4!)." },
      { letter: "B", text: "12 (4!/2)." },
      { letter: "C", text: "6 (4!/(2!×2!))." },
      { letter: "D", text: "4 (número de letras)." },
      { letter: "E", text: "8 (2³)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "ERRE: E(2), R(2), n=4. P = 4!/(2!×2!) = 24/(2×2) = 24/4 = 6.",
    explanationCorrect: "C: P(4; 2, 2) = 4!/(2!×2!) = 24/4 = 6. ERRE tem E e R cada um com frequência 2. Os 6 anagramas: ERRE, ERRÉ... (listando: ERRE, ERER, ERRE não, vamos contar: ERRE, ERER, REER, RERE, RREE, ESER → 6 distintos).",
    explanationWrong: "A: 4! ignora as repetições. B: divide por apenas um 2! — faltou o outro. D: número de letras não é anagrama. E: 2³ não tem relação com permutação com repetição.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_ac_c04_q07",
    contentId: "rlm_ac_c04",
    statement: "Para calcular os anagramas de uma palavra, o primeiro passo essencial é:",
    alternatives: [
      { letter: "A", text: "Calcular n! diretamente e depois verificar se há repetições." },
      { letter: "B", text: "Identificar cada letra e sua frequência, verificando se n = soma das frequências." },
      { letter: "C", text: "Dividir o total de letras pelo número de letras distintas." },
      { letter: "D", text: "Aplicar a fórmula n!/(n-k)! com k = número de letras repetidas." },
      { letter: "E", text: "Verificar se a palavra existe no dicionário antes de calcular." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Passo 1: listar e contar a frequência de cada letra. Somar as frequências para confirmar n. Só então aplicar P = n!/(a!×b!×...).",
    explanationCorrect: "B: identificar frequências é o primeiro e mais crítico passo. Um erro de contagem altera completamente o resultado. Organizar as letras em ordem alfabética ajuda a não perder nenhuma repetição.",
    explanationWrong: "A: calcular n! antes de verificar repetições pode levar a resultado errado (superestimado). C: divisão incorreta. D: a fórmula n!/(n-k)! é de arranjo — não de permutação com repetição. E: palavras inventadas também têm anagramas.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_ac_c04_q08",
    contentId: "rlm_ac_c04",
    statement: "A palavra ABACABA tem A=4, B=2, C=1, totalizando 7 letras. O número de anagramas distintos é:",
    alternatives: [
      { letter: "A", text: "5.040 (7!)." },
      { letter: "B", text: "105 (7!/(4!×2!×1!))." },
      { letter: "C", text: "210 (7!/(4!×2!))." },
      { letter: "D", text: "840 (7!/3!)." },
      { letter: "E", text: "2.520 (7!/2!)." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "P(7; 4, 2, 1) = 7!/(4!×2!×1!) = 5040/(24×2×1) = 5040/48 = 105.",
    explanationCorrect: "B: P = 7!/(4!×2!×1!) = 5040/48 = 105. ABACABA: A(4), B(2), C(1). Verificação: 4+2+1=7 ✓. Denominador: 24×2×1=48.",
    explanationWrong: "A: 7! ignora repetições. C: 7!/(4!×2!) seria sem o 1! do C — mas 1!=1 não altera, então C também seria 105 (mesma resposta). D e E: denominadores incorretos.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── rlm_ac_c05 — CORREGEDOR ───────────────────────────────────────────────

  {
    id: "rlm_ac_c05_q01",
    contentId: "rlm_ac_c05",
    statement: "A palavra CORREGEDOR possui 10 letras no total.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "C-O-R-R-E-G-E-D-O-R: 10 letras. Organizando: C(1), D(1), E(2), G(1), O(2), R(3) → 1+1+2+1+2+3=10.",
    explanationCorrect: "Certo: CORREGEDOR tem 10 letras. Contagem: C-O-R-R-E-G-E-D-O-R = 10. Distribuição: C(1), D(1), E(2), G(1), O(2), R(3). Soma: 1+1+2+1+2+3 = 10 ✓.",
    explanationWrong: "A afirmação está correta — CORREGEDOR tem 10 letras.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c05_q02",
    contentId: "rlm_ac_c05",
    statement: "O total de anagramas distintos da palavra CORREGEDOR é 151.200.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "P(10; C1, D1, E2, G1, O2, R3) = 10!/(1!×1!×2!×1!×2!×3!) = 3.628.800/24 = 151.200.",
    explanationCorrect: "Certo: denominador = 2!×2!×3! = 2×2×6 = 24 (os termos com freq=1 contribuem 1!= não alteram). 10!/24 = 151.200.",
    explanationWrong: "A afirmação está correta — 10!/(2!×2!×3!) = 151.200.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c05_q03",
    contentId: "rlm_ac_c05",
    statement: "Os anagramas de CORREGEDOR que começam com C são 15.120.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "C fixo na 1ª posição. Restam 9 letras: D, E, E, G, O, O, R, R, R. P = 9!/(1!×2!×1!×2!×3!) = 362.880/24 = 15.120.",
    explanationCorrect: "Certo: C fixo → 9 letras restantes com E(2), O(2), R(3). P = 9!/(2!×2!×3!) = 362.880/24 = 15.120. Verificação: 15.120/151.200 = 1/10 (C ocupa 1 de 10 posições).",
    explanationWrong: "A afirmação está correta — anagramas com C na frente = 15.120.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c05_q04",
    contentId: "rlm_ac_c05",
    statement: "Na palavra CORREGEDOR, a letra R aparece exatamente 2 vezes.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "C-O-R-R-E-G-E-D-O-R: posições 3, 4 e 10 são R. Portanto R aparece 3 vezes — não 2.",
    explanationCorrect: "Errado: R aparece 3 vezes em CORREGEDOR. Contagem: C-O-R(3)-R(4)-E-G-E-D-O-R(10). R é a letra de maior frequência, com 3 ocorrências.",
    explanationWrong: "A afirmação está incorreta — R aparece 3 vezes, não 2.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c05_q05",
    contentId: "rlm_ac_c05",
    statement: "Na fórmula para calcular os anagramas de CORREGEDOR, qual é o valor do denominador?",
    alternatives: [
      { letter: "A", text: "6 (apenas 3!, pois R é a única letra que se repete mais de 2 vezes)." },
      { letter: "B", text: "12 (2!×3! = 2×6)." },
      { letter: "C", text: "24 (2!×2!×3! = 2×2×6)." },
      { letter: "D", text: "48 (2!×4!)." },
      { letter: "E", text: "72 (3!×3!×2)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "CORREGEDOR: E(2), O(2), R(3) — apenas essas têm frequência > 1. Denominador = 2!×2!×3! = 2×2×6 = 24.",
    explanationCorrect: "C: letras com repetição: E(2), O(2), R(3). Denominador: 2!×2!×3! = 2×2×6 = 24. As demais (C, D, G) têm freq=1 → 1!=1 → não alteram o produto.",
    explanationWrong: "A: faltou contar E(2) e O(2) — R não é a única com repetição. B: faltou 2! do O. D: 4! não existe nesta palavra. E: 3!×3! seria se R aparecesse 6 vezes — incorreto.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_ac_c05_q06",
    contentId: "rlm_ac_c05",
    statement: "Quantos anagramas de CORREGEDOR começam E terminam com R?",
    alternatives: [
      { letter: "A", text: "5.040." },
      { letter: "B", text: "15.120." },
      { letter: "C", text: "10.080." },
      { letter: "D", text: "151.200." },
      { letter: "E", text: "45.360." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Fixar R na 1ª e R na 10ª posição. Restam 8 letras internas: C, D, E, E, G, O, O, R. P = 8!/(1!×1!×2!×1!×2!×1!) = 40.320/4 = 10.080.",
    explanationCorrect: "C: 2 Rs fixados nas extremidades. Sobram 8 letras: C(1), D(1), E(2), G(1), O(2), R(1). P = 8!/(2!×2!) = 40.320/4 = 10.080.",
    explanationWrong: "A: 5.040 = 7! (sem relação direta). B: 15.120 = anagramas que começam com C. D: 151.200 = total sem restrição. E: 45.360 = anagramas que começam com R.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_ac_c05_q07",
    contentId: "rlm_ac_c05",
    statement: "Que fração dos anagramas de CORREGEDOR começa com a letra C?",
    alternatives: [
      { letter: "A", text: "1/6 (pois há 6 letras distintas)." },
      { letter: "B", text: "1/3 (pois R aparece 3 vezes)." },
      { letter: "C", text: "1/10 (pois C aparece 1 vez em 10 letras)." },
      { letter: "D", text: "1/5 (pois há 5 letras que não são R)." },
      { letter: "E", text: "2/10 (pois há 2 vogais O)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Anagramas com C: 15.120. Total: 151.200. 15.120/151.200 = 1/10. Como C aparece 1 vez em 10 letras, 1/10 dos anagramas começa com C.",
    explanationCorrect: "C: 15.120/151.200 = 1/10. Intuição: como C aparece 1 vez em 10, por simetria, 1 de cada 10 anagramas começa com C. Verificação: 151.200/10 = 15.120 ✓.",
    explanationWrong: "A: 1/6 seria se houvesse 6 posições equiprováveis — não é o caso. B: 1/3 seria a fração de Rs. D e E: cálculos sem fundamento direto.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_ac_c05_q08",
    contentId: "rlm_ac_c05",
    statement: "Qual letra aparece com maior frequência na palavra CORREGEDOR?",
    alternatives: [
      { letter: "A", text: "E (aparece 3 vezes)." },
      { letter: "B", text: "O (aparece 3 vezes)." },
      { letter: "C", text: "R (aparece 3 vezes)." },
      { letter: "D", text: "C (aparece 2 vezes)." },
      { letter: "E", text: "E e R empatam com 2 vezes cada." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "CORREGEDOR: C(1), O(2), R(3), E(2), G(1), D(1). R é a letra mais frequente com 3 ocorrências.",
    explanationCorrect: "C: R aparece nas posições 3, 4 e 10 → 3 ocorrências (maior frequência). E e O aparecem 2 vezes cada. C, D e G aparecem 1 vez cada.",
    explanationWrong: "A: E aparece 2 vezes (posições 5 e 7), não 3. B: O aparece 2 vezes (posições 2 e 9), não 3. D: C aparece 1 vez. E: E e R não empatam — R tem 3, E tem 2.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── rlm_ac_c06 — Permutações com Restrições ──────────────────────────────

  {
    id: "rlm_ac_c06_q01",
    contentId: "rlm_ac_c06",
    statement: "Em qualquer permutação de n elementos distintos, para dois elementos específicos A e B, exatamente metade das permutações tem A em posição anterior a B.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Por simetria: para cada permutação com A antes de B, existe uma correspondente com B antes de A. Logo, exatamente n!/2 permutações têm A à esquerda de B.",
    explanationCorrect: "Certo: argumento de simetria — em qualquer permutação, A e B têm igual probabilidade de aparecer antes um do outro. Portanto, Total/2 têm A antes de B.",
    explanationWrong: "A afirmação está correta — por simetria, metade das permutações tem A antes de B.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c06_q02",
    contentId: "rlm_ac_c06",
    statement: "Para contar anagramas em que vogais nunca ficam adjacentes, usa-se: total de anagramas + anagramas com vogais adjacentes.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "A estratégia complementar é: Total − (casos proibidos). Para vogais NUNCA adjacentes: Total − (vogais adjacentes). Soma (+) é incorreta.",
    explanationCorrect: "Errado: a estratégia complementar é subtração: Vogais nunca adjacentes = Total − Vogais sempre adjacentes. Somar os casos proibidos ao total não faz sentido.",
    explanationWrong: "A afirmação está incorreta — usa-se subtração (Total − casos proibidos), não adição.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c06_q03",
    contentId: "rlm_ac_c06",
    statement: "Ao formar um bloco com 3 elementos adjacentes em uma palavra de 7 letras distintas, o número de elementos a permutar (externo ao bloco) é 5.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "7 letras − 3 no bloco + 1 (o bloco como um elemento) = 7 − 3 + 1 = 5 elementos a permutar externamente.",
    explanationCorrect: "Certo: fórmula = n − k + 1 = 7 − 3 + 1 = 5 elementos. O bloco de 3 vira 1 elemento, reduzindo de 7 para 5 elementos externos.",
    explanationWrong: "A afirmação está correta — 7 − 3 + 1 = 5 elementos para permutar.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c06_q04",
    contentId: "rlm_ac_c06",
    statement: "A estratégia complementar para contar permutações proibidas estabelece: resultado = total + casos proibidos.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Estratégia complementar: resultado = Total − casos proibidos. Soma os casos proibidos ao total é erro conceitual.",
    explanationCorrect: "Errado: complementar = Total − proibidos. Lógica: (casos permitidos) = (todos os casos) − (casos não permitidos).",
    explanationWrong: "A afirmação está incorreta — complementar usa subtração: resultado = Total − proibidos.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "rlm_ac_c06_q05",
    contentId: "rlm_ac_c06",
    statement: "Quantos anagramas de CARGO têm as vogais A e O nunca adjacentes?",
    alternatives: [
      { letter: "A", text: "48." },
      { letter: "B", text: "24." },
      { letter: "C", text: "72." },
      { letter: "D", text: "96." },
      { letter: "E", text: "120." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Total: 5! = 120. Vogais adjacentes (bloco {AO}): 4! × 2! = 48. Nunca adjacentes: 120 − 48 = 72.",
    explanationCorrect: "C: complementar = 120 − 48 = 72. Total (5!=120) menos vogais juntas (4!×2!=48) = vogais nunca juntas (72).",
    explanationWrong: "A: 48 = vogais SEMPRE adjacentes (não nunca). B: 24 = começam com C. D: 96 = não começam com C. E: 120 = total sem restrição.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_ac_c06_q06",
    contentId: "rlm_ac_c06",
    statement: "Quatro delegados (A, B, C, D) devem se sentar em fila. De quantas formas A pode se sentar sempre à esquerda de B (sem que necessariamente fiquem adjacentes)?",
    alternatives: [
      { letter: "A", text: "6 (3!)." },
      { letter: "B", text: "24 (4!)." },
      { letter: "C", text: "12 (4!/2)." },
      { letter: "D", text: "8 (4!/3)." },
      { letter: "E", text: "4 (número de elementos)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Por simetria: metade das 4! = 24 permutações tem A à esquerda de B. 24/2 = 12.",
    explanationCorrect: "C: Total = 4! = 24. Por simetria, exatamente metade tem A antes de B: 24/2 = 12. Isso inclui casos onde A e B não são adjacentes — apenas que A aparece antes de B em qualquer posição.",
    explanationWrong: "A: 3! = 6 seria a permutação dos outros 3, sem considerar A e B. B: 24 é o total sem restrição. D: divisão por 3 sem fundamento. E: 4 é o número de pessoas.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_ac_c06_q07",
    contentId: "rlm_ac_c06",
    statement: "Numa permutação de 5 letras distintas, deseja-se que 2 letras específicas fiquem sempre adjacentes (em bloco). O total de arranjos com essa restrição é:",
    alternatives: [
      { letter: "A", text: "120 (5!)." },
      { letter: "B", text: "24 (4!)." },
      { letter: "C", text: "48 (4! × 2!)." },
      { letter: "D", text: "12 (4!/2)." },
      { letter: "E", text: "60 (5!/2)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Bloco de 2 letras distintas: 2! = 2 arranjos internos. Elementos externos: 5 − 2 + 1 = 4 → 4! = 24. Total: 4! × 2! = 48.",
    explanationCorrect: "C: bloco de 2 letras distintas = 2! = 2 formas internas. Elementos para permutar externamente: 4 (bloco + 3 restantes) → 4! = 24. Total: 24 × 2 = 48.",
    explanationWrong: "A: total sem restrição. B: 4! faltou multiplicar pelos arranjos internos do bloco (2!). D: 4!/2 = 12 sem justificativa. E: 5!/2 = 60 seria posição relativa, não bloco.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "rlm_ac_c06_q08",
    contentId: "rlm_ac_c06",
    statement: "Quantos anagramas de CARGO têm as consoantes (C, R, G) nas posições ímpares (1ª, 3ª, 5ª) e as vogais (A, O) nas posições pares (2ª, 4ª) — alternância vogal/consoante?",
    alternatives: [
      { letter: "A", text: "6." },
      { letter: "B", text: "12." },
      { letter: "C", text: "24." },
      { letter: "D", text: "48." },
      { letter: "E", text: "72." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Posições ímpares (1ª, 3ª, 5ª) para 3 consoantes: P(3) = 3! = 6. Posições pares (2ª, 4ª) para 2 vogais: P(2) = 2! = 2. Total: 6 × 2 = 12.",
    explanationCorrect: "B: PFC — consoantes nas 3 posições ímpares: 3! = 6. Vogais nas 2 posições pares: 2! = 2. Total: 6 × 2 = 12 anagramas alternados.",
    explanationWrong: "A: 6 = apenas os arranjos das consoantes (faltou as vogais). C: 24 = bloco de vogais ou C fixado. D: 48 = vogais juntas. E: 72 = vogais nunca adjacentes.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n🚀 Seed R54 — Densificação: RLM — Análise Combinatória (rlm_ac_c01–c06)\n");

  const atomIds = [
    "rlm_ac_c01", "rlm_ac_c02", "rlm_ac_c03",
    "rlm_ac_c04", "rlm_ac_c05", "rlm_ac_c06",
  ];

  // 1. Verificar existência dos átomos
  for (const atomId of atomIds) {
    const rows = (await db.execute(sql`
      SELECT id, title FROM "Content" WHERE id = ${atomId} LIMIT 1
    `)) as any[];
    if (rows[0]) {
      console.log(`  ✅ Átomo encontrado: ${atomId} — ${rows[0].title}`);
    } else {
      console.warn(`  ⚠️  AVISO: Átomo NÃO encontrado: ${atomId} — execute seed-rlm-combinatoria-r35.ts primeiro`);
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
