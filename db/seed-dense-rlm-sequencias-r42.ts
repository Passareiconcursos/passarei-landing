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
  text: string;
  alternatives: Alternative[];
  correctAnswer: string;
  explanation: string;
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
    text: "Se A = {1, 2, 3} e B = {2, 3, 4}, então A ∩ B = {2, 3}.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    explanation: "A interseção A ∩ B contém apenas os elementos comuns a ambos os conjuntos. Como 2 e 3 pertencem a A e a B, A ∩ B = {2, 3}. Correto.",
  },
  {
    id: "rlm_co_op_q02",
    contentId: "cml47hv4x04c8de7d9cdf35e4",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    text: "A diferença A − B é formada pelos elementos que pertencem a A e também a B.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    explanation: "A diferença A − B contém os elementos que pertencem a A, mas NÃO pertencem a B. O que pertence a A e também a B é a interseção A ∩ B, não a diferença.",
  },
  {
    id: "rlm_co_op_q03",
    contentId: "cml47hv4x04c8de7d9cdf35e4",
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    text: "Em uma turma de 30 alunos, 18 estudam inglês e 15 estudam espanhol. Se 7 estudam os dois idiomas, então 26 alunos estudam pelo menos um dos idiomas.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    explanation: "Princípio da Inclusão-Exclusão: |A ∪ B| = |A| + |B| − |A ∩ B| = 18 + 15 − 7 = 26. Correto.",
  },
  {
    id: "rlm_co_op_q04",
    contentId: "cml47hv4x04c8de7d9cdf35e4",
    questionType: "CERTO_ERRADO",
    difficulty: "DIFICIL",
    text: "Se A ⊂ B (A está contido em B), então A ∪ B = B e A ∩ B = A.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    explanation: "Se todo elemento de A pertence a B: a união A ∪ B = B (A não acrescenta elementos novos); a interseção A ∩ B = A (todos os elementos de A já estão em B). Ambas as afirmações são corretas.",
  },
  {
    id: "rlm_co_op_q05",
    contentId: "cml47hv4x04c8de7d9cdf35e4",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    text: "Dados U = {1, 2, 3, 4, 5, 6}, A = {1, 2, 3, 4} e B = {3, 4, 5, 6}, qual é A ∩ B?",
    alternatives: [
      { letter: "A", text: "{1, 2, 3, 4, 5, 6}" },
      { letter: "B", text: "{3, 4}" },
      { letter: "C", text: "{1, 2, 5, 6}" },
      { letter: "D", text: "{1, 2}" },
      { letter: "E", text: "{5, 6}" },
    ],
    correctAnswer: "B",
    explanation: "A ∩ B reúne apenas os elementos comuns: 3 e 4 pertencem a A e a B. Portanto A ∩ B = {3, 4}.",
  },
  {
    id: "rlm_co_op_q06",
    contentId: "cml47hv4x04c8de7d9cdf35e4",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    text: "Em uma pesquisa com 50 pessoas, 30 gostam de futebol e 20 gostam de vôlei. Se 8 gostam dos dois esportes, quantas pessoas gostam de pelo menos um deles?",
    alternatives: [
      { letter: "A", text: "50" },
      { letter: "B", text: "48" },
      { letter: "C", text: "42" },
      { letter: "D", text: "38" },
      { letter: "E", text: "35" },
    ],
    correctAnswer: "C",
    explanation: "|Futebol ∪ Vôlei| = 30 + 20 − 8 = 42. Das 50 pessoas, 42 gostam de pelo menos um dos esportes.",
  },
  {
    id: "rlm_co_op_q07",
    contentId: "cml47hv4x04c8de7d9cdf35e4",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "MEDIO",
    text: "Dados A = {a, b, c, d} e B = {c, d, e, f}, qual é A − B?",
    alternatives: [
      { letter: "A", text: "{a, b, c, d, e, f}" },
      { letter: "B", text: "{c, d}" },
      { letter: "C", text: "{a, b}" },
      { letter: "D", text: "{e, f}" },
      { letter: "E", text: "{a, b, e, f}" },
    ],
    correctAnswer: "C",
    explanation: "A − B reúne os elementos de A que não pertencem a B. De A = {a, b, c, d}, os elementos c e d pertencem também a B, portanto A − B = {a, b}.",
  },
  {
    id: "rlm_co_op_q08",
    contentId: "cml47hv4x04c8de7d9cdf35e4",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "DIFICIL",
    text: "Em uma turma de 40 alunos, 20 praticam natação, 15 praticam judô e 12 praticam atletismo. Sabe-se que 6 praticam natação e judô, 4 praticam natação e atletismo, 3 praticam judô e atletismo, e nenhum pratica os três esportes. Quantos alunos não praticam nenhum esporte?",
    alternatives: [
      { letter: "A", text: "2" },
      { letter: "B", text: "4" },
      { letter: "C", text: "6" },
      { letter: "D", text: "8" },
      { letter: "E", text: "10" },
    ],
    correctAnswer: "C",
    explanation: "|N ∪ J ∪ A| = 20 + 15 + 12 − 6 − 4 − 3 + 0 = 34. Alunos sem nenhum esporte = 40 − 34 = 6.",
  },

  // ═══════════════════════════════════════════════════════════
  // ÁTOMO 2 — Sequências Lógicas (cml47i18pd7fdfd135ba6ea85)
  // ═══════════════════════════════════════════════════════════

  {
    id: "rlm_sq_lg_q01",
    contentId: "cml47i18pd7fdfd135ba6ea85",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    text: "A sequência 2, 4, 8, 16, 32, ... é uma progressão geométrica de razão 2.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    explanation: "Em uma PG, cada termo é obtido multiplicando o anterior pela razão. Aqui, 4/2 = 8/4 = 16/8 = 32/16 = 2. Razão = 2. Correto.",
  },
  {
    id: "rlm_sq_lg_q02",
    contentId: "cml47i18pd7fdfd135ba6ea85",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    text: "Na sequência 1, 4, 9, 16, 25, ..., os termos são quadrados perfeitos e o próximo elemento é 36.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    explanation: "Os termos são 1²=1, 2²=4, 3²=9, 4²=16, 5²=25. O próximo é 6²=36. Correto.",
  },
  {
    id: "rlm_sq_lg_q03",
    contentId: "cml47i18pd7fdfd135ba6ea85",
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    text: "Na sequência 3, 7, 13, 21, 31, ..., as diferenças entre termos consecutivos formam uma PA de razão 2, e o próximo elemento é 43.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    explanation: "Diferenças: 7−3=4, 13−7=6, 21−13=8, 31−21=10 → PA de razão 2. A próxima diferença é 12, portanto o próximo termo = 31 + 12 = 43. Correto.",
  },
  {
    id: "rlm_sq_lg_q04",
    contentId: "cml47i18pd7fdfd135ba6ea85",
    questionType: "CERTO_ERRADO",
    difficulty: "DIFICIL",
    text: "Na sequência de Fibonacci (1, 1, 2, 3, 5, 8, 13, ...), a razão entre termos consecutivos converge para √2 ≈ 1,414.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    explanation: "A razão entre termos consecutivos de Fibonacci converge para o número de ouro φ = (1 + √5)/2 ≈ 1,618, não para √2 ≈ 1,414.",
  },
  {
    id: "rlm_sq_lg_q05",
    contentId: "cml47i18pd7fdfd135ba6ea85",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    text: "Qual é o próximo número na sequência: 5, 10, 20, 40, ...?",
    alternatives: [
      { letter: "A", text: "60" },
      { letter: "B", text: "70" },
      { letter: "C", text: "80" },
      { letter: "D", text: "100" },
      { letter: "E", text: "120" },
    ],
    correctAnswer: "C",
    explanation: "PG com razão 2: cada termo é o dobro do anterior. 40 × 2 = 80.",
  },
  {
    id: "rlm_sq_lg_q06",
    contentId: "cml47i18pd7fdfd135ba6ea85",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    text: "Qual é o próximo número na sequência: 2, 5, 8, 11, 14, ...?",
    alternatives: [
      { letter: "A", text: "16" },
      { letter: "B", text: "17" },
      { letter: "C", text: "18" },
      { letter: "D", text: "19" },
      { letter: "E", text: "20" },
    ],
    correctAnswer: "B",
    explanation: "PA com razão 3: cada termo soma 3 ao anterior. 14 + 3 = 17.",
  },
  {
    id: "rlm_sq_lg_q07",
    contentId: "cml47i18pd7fdfd135ba6ea85",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "MEDIO",
    text: "Considere a sequência: 1, 2, 4, 7, 11, 16, ... As diferenças entre termos consecutivos formam uma PA de razão 1. Qual é o próximo elemento?",
    alternatives: [
      { letter: "A", text: "20" },
      { letter: "B", text: "21" },
      { letter: "C", text: "22" },
      { letter: "D", text: "23" },
      { letter: "E", text: "24" },
    ],
    correctAnswer: "C",
    explanation: "Diferenças: 1, 2, 3, 4, 5 (PA de razão 1). A próxima diferença é 6, portanto o próximo elemento = 16 + 6 = 22.",
  },
  {
    id: "rlm_sq_lg_q08",
    contentId: "cml47i18pd7fdfd135ba6ea85",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "DIFICIL",
    text: "Os números triangulares são definidos por Tₙ = n(n+1)/2, gerando a sequência 1, 3, 6, 10, 15, 21, ... Qual é o 10º número triangular?",
    alternatives: [
      { letter: "A", text: "45" },
      { letter: "B", text: "50" },
      { letter: "C", text: "55" },
      { letter: "D", text: "60" },
      { letter: "E", text: "66" },
    ],
    correctAnswer: "C",
    explanation: "T₁₀ = 10 × (10 + 1) / 2 = 10 × 11 / 2 = 55.",
  },

  // ═══════════════════════════════════════════════════════════
  // ÁTOMO 3 — Raciocínio Lógico: Associação (cml47i1ra1fec8cff009dc5a7)
  // ═══════════════════════════════════════════════════════════

  {
    id: "rlm_la_as_q01",
    contentId: "cml47i1ra1fec8cff009dc5a7",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    text: "Se \"Todo A é B\" e \"Todo B é C\", então é correto concluir que \"Todo A é C\".",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    explanation: "Silogismo Barbara (AAA): premissa universal afirmativa + premissa universal afirmativa → conclusão universal afirmativa. Se todo A pertence a B e todo B pertence a C, então por transitividade todo A pertence a C.",
  },
  {
    id: "rlm_la_as_q02",
    contentId: "cml47i1ra1fec8cff009dc5a7",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    text: "Se Ana é mais velha que Bia e Bia é mais velha que Carla, podemos concluir que Carla é a mais velha das três.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    explanation: "Por transitividade: Ana > Bia > Carla. A mais velha é Ana, não Carla.",
  },
  {
    id: "rlm_la_as_q03",
    contentId: "cml47i1ra1fec8cff009dc5a7",
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    text: "A negação lógica de \"Todos os candidatos passaram na prova\" é \"Nenhum candidato passou na prova\".",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    explanation: "A negação de uma proposição universal afirmativa (∀x P(x)) é uma proposição existencial negativa (∃x ¬P(x)): \"Existe pelo menos um candidato que não passou na prova\". A negação de \"Todos\" é \"Existe algum que não\", não \"Nenhum\".",
  },
  {
    id: "rlm_la_as_q04",
    contentId: "cml47i1ra1fec8cff009dc5a7",
    questionType: "CERTO_ERRADO",
    difficulty: "DIFICIL",
    text: "Das premissas \"Se João estuda, então passa na prova\" e \"João não passou na prova\", a conclusão lógica válida é \"João não estudou\".",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    explanation: "Modus Tollens: (p → q) e ¬q implicam ¬p. Se (estudar → passar) e (não passou), então (não estudou). Raciocínio válido.",
  },
  {
    id: "rlm_la_as_q05",
    contentId: "cml47i1ra1fec8cff009dc5a7",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    text: "Ana, Bruno e Carla exercem as profissões de médica, engenheira e advogada (uma cada). Sabe-se que Ana não é advogada nem médica; Bruno não é médico. Qual é a profissão de Carla?",
    alternatives: [
      { letter: "A", text: "Médica" },
      { letter: "B", text: "Engenheira" },
      { letter: "C", text: "Advogada" },
      { letter: "D", text: "Médica ou advogada" },
      { letter: "E", text: "Não é possível determinar" },
    ],
    correctAnswer: "A",
    explanation: "Ana ≠ advogada e ≠ médica → Ana = engenheira. Bruno ≠ médico; restam médico e advogado para Bruno e Carla; Bruno ≠ médico → Bruno = advogado → Carla = médica.",
  },
  {
    id: "rlm_la_as_q06",
    contentId: "cml47i1ra1fec8cff009dc5a7",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    text: "Em uma corrida com 4 participantes (A, B, C, D): A chegou antes de B; C chegou depois de B; D chegou antes de A. Qual foi a ordem de chegada do 1º ao 4º?",
    alternatives: [
      { letter: "A", text: "A, B, C, D" },
      { letter: "B", text: "D, A, B, C" },
      { letter: "C", text: "D, B, A, C" },
      { letter: "D", text: "A, D, B, C" },
      { letter: "E", text: "Não é possível determinar" },
    ],
    correctAnswer: "B",
    explanation: "D chegou antes de A (D < A), A antes de B (A < B), C depois de B (B < C). Ordem: D, A, B, C.",
  },
  {
    id: "rlm_la_as_q07",
    contentId: "cml47i1ra1fec8cff009dc5a7",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "MEDIO",
    text: "Quatro amigos — Fábio, Gustavo, Helena e Inês — praticam esportes distintos: futebol, tênis, natação e vôlei. Sabe-se que: Fábio não pratica futebol nem tênis; Gustavo não pratica natação; Helena pratica vôlei; Inês pratica tênis. Qual é o esporte de Fábio?",
    alternatives: [
      { letter: "A", text: "Futebol" },
      { letter: "B", text: "Tênis" },
      { letter: "C", text: "Natação" },
      { letter: "D", text: "Vôlei" },
      { letter: "E", text: "Não é possível determinar" },
    ],
    correctAnswer: "C",
    explanation: "Helena=vôlei, Inês=tênis. Para Fábio: ≠ futebol, ≠ tênis, ≠ vôlei (Helena) → Fábio=natação. Gustavo ≠ natação (Fábio) → Gustavo=futebol.",
  },
  {
    id: "rlm_la_as_q08",
    contentId: "cml47i1ra1fec8cff009dc5a7",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "DIFICIL",
    text: "Quatro candidatos — W, X, Y e Z — fizeram, cada um, uma prova diferente: Matemática, Português, História e Inglês. W não fez Matemática nem Português; X fez História; Y fez Português. Qual foi a prova de Z?",
    alternatives: [
      { letter: "A", text: "Matemática" },
      { letter: "B", text: "Português" },
      { letter: "C", text: "História" },
      { letter: "D", text: "Inglês" },
      { letter: "E", text: "Não é possível determinar" },
    ],
    correctAnswer: "A",
    explanation: "X=História, Y=Português. Restam Matemática e Inglês para W e Z. W ≠ Matemática → W=Inglês → Z=Matemática.",
  },

  // ═══════════════════════════════════════════════════════════
  // ÁTOMO 4 — Raciocínio Sequencial (content_1767400663022_6avumsqo2)
  // ═══════════════════════════════════════════════════════════

  {
    id: "rlm_sq_rs_q01",
    contentId: "content_1767400663022_6avumsqo2",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    text: "Se hoje é segunda-feira, então daqui a 7 dias também será segunda-feira.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    explanation: "A semana tem 7 dias. Daqui a múltiplos de 7 dias cai sempre no mesmo dia da semana. 7 = 1 × 7, portanto daqui a 7 dias será segunda-feira. Correto.",
  },
  {
    id: "rlm_sq_rs_q02",
    contentId: "content_1767400663022_6avumsqo2",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    text: "A sequência de letras A, C, E, G, I segue o padrão de letras alternadas do alfabeto, pulando uma letra a cada passo.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    explanation: "A(1), C(3), E(5), G(7), I(9) — posições ímpares do alfabeto, avançando 2 posições a cada passo (pulando uma letra). Correto.",
  },
  {
    id: "rlm_sq_rs_q03",
    contentId: "content_1767400663022_6avumsqo2",
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    text: "Em uma sequência em que cada termo é obtido multiplicando o anterior por 3 e subtraindo 1, sendo o primeiro termo igual a 2, o quarto termo é 53.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    explanation: "a₁=2; a₂=2×3−1=5; a₃=5×3−1=14; a₄=14×3−1=41. O quarto termo é 41, não 53.",
  },
  {
    id: "rlm_sq_rs_q04",
    contentId: "content_1767400663022_6avumsqo2",
    questionType: "CERTO_ERRADO",
    difficulty: "DIFICIL",
    text: "Se 1º de janeiro de um ano não bissexto cai numa terça-feira, então 1º de fevereiro do mesmo ano cai numa sexta-feira.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    explanation: "Janeiro tem 31 dias. 31 = 4 × 7 + 3, ou seja, 31 dias equivalem a 4 semanas e 3 dias extras. Terça-feira + 3 dias = sexta-feira. Correto.",
  },
  {
    id: "rlm_sq_rs_q05",
    contentId: "content_1767400663022_6avumsqo2",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    text: "Qual é o próximo elemento na sequência de letras: A, D, G, J, ...?",
    alternatives: [
      { letter: "A", text: "K" },
      { letter: "B", text: "L" },
      { letter: "C", text: "M" },
      { letter: "D", text: "N" },
      { letter: "E", text: "O" },
    ],
    correctAnswer: "C",
    explanation: "O padrão avança 3 posições no alfabeto: A(1)→D(4)→G(7)→J(10)→M(13). O próximo elemento é M.",
  },
  {
    id: "rlm_sq_rs_q06",
    contentId: "content_1767400663022_6avumsqo2",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    text: "Uma sequência de senhas segue o padrão: AA01, AB02, AC03, AD04, ... Qual é a 26ª senha?",
    alternatives: [
      { letter: "A", text: "AZ26" },
      { letter: "B", text: "BA26" },
      { letter: "C", text: "AZ25" },
      { letter: "D", text: "BA25" },
      { letter: "E", text: "ZZ26" },
    ],
    correctAnswer: "A",
    explanation: "A primeira letra permanece A; a segunda letra avança pelo alfabeto (A, B, C, ..., Z); o número incrementa de 1 em 1. Na 26ª posição: segunda letra = Z, número = 26 → AZ26.",
  },
  {
    id: "rlm_sq_rs_q07",
    contentId: "content_1767400663022_6avumsqo2",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "MEDIO",
    text: "A sequência 2, 6, 12, 20, 30, 42, ... segue o padrão aₙ = n(n+1). Qual é o 8º termo?",
    alternatives: [
      { letter: "A", text: "56" },
      { letter: "B", text: "64" },
      { letter: "C", text: "72" },
      { letter: "D", text: "80" },
      { letter: "E", text: "90" },
    ],
    correctAnswer: "C",
    explanation: "a₈ = 8 × (8 + 1) = 8 × 9 = 72.",
  },
  {
    id: "rlm_sq_rs_q08",
    contentId: "content_1767400663022_6avumsqo2",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "DIFICIL",
    text: "Uma sequência de figuras tem 1, 5, 13, 25 quadrados nas quatro primeiras figuras. As diferenças entre termos crescem em PA de razão 4. Quantos quadrados tem a 6ª figura?",
    alternatives: [
      { letter: "A", text: "41" },
      { letter: "B", text: "53" },
      { letter: "C", text: "57" },
      { letter: "D", text: "61" },
      { letter: "E", text: "65" },
    ],
    correctAnswer: "D",
    explanation: "Diferenças: 5−1=4, 13−5=8, 25−13=12 → PA de razão 4. Próximas diferenças: 16 e 20. a₅ = 25+16 = 41; a₆ = 41+20 = 61.",
  },
];

async function main() {
  console.log("=== R42 — DENSIFICAÇÃO: RLM Sequências, Conjuntos e Associação ===");
  console.log(`Total de questões a inserir: ${questions.length}`);

  // 1. Verificar existência dos átomos e coletar subjectId/topicId
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
  let inserted = 0;
  let skipped = 0;

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
        id, text, alternatives, "correctAnswer",
        "explanationCorrect", "explanationWrong",
        "contentId", "subjectId", "topicId",
        "isActive", difficulty, "timesAnswered",
        "questionType", "createdAt", "updatedAt"
      ) VALUES (
        ${q.id},
        ${q.text},
        ${alternativesJson}::jsonb,
        ${q.correctAnswer},
        ${q.explanation},
        ${q.explanation},
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
      skipped++;
    } else {
      inserted++;
    }
  }

  console.log(`\n=== CONCLUÍDO ===`);
  console.log(`  Inseridas: ${inserted}`);
  console.log(`  Ignoradas: ${skipped}`);
  console.log(`  Total:     ${inserted + skipped} / ${questions.length}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
