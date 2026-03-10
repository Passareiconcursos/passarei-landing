import { db } from "./index";
import { sql } from "drizzle-orm";

// R44 — DENSIFICAÇÃO: Matemática — Probabilidade e Divisão Proporcional
// Probabilidade Básica:   8 questões (átomo com 0q → completa para 8)
// Divisão Proporcional:   6 questões (átomo com 2q → completa para 8)
// Total: 14 questões

const CONTENT_IDS: Record<string, string> = {
  "Probabilidade Básica":     "content_1767459320252_pmw9fzsip",
  "Divisão Proporcional":     "ct_mm9q80hf3wm3p2",
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
  // ÁTOMO 1 — Probabilidade Básica (content_1767459320252_pmw9fzsip)
  // 8 questões: 4 CE + 4 ME
  // ═══════════════════════════════════════════════════════════

  {
    id: "mat_pb_q01",
    contentId: "content_1767459320252_pmw9fzsip",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "Ao lançar um dado honesto de 6 faces, a probabilidade de obter um número par é 1/2.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Números pares em um dado: {2, 4, 6} — 3 resultados favoráveis. Total de resultados: 6. P = 3/6 = 1/2. Correto.",
    explanationCorrect: "Números pares em um dado: {2, 4, 6} — 3 resultados favoráveis. Total de resultados: 6. P = 3/6 = 1/2. Correto.",
    explanationWrong: "Faces pares: 2, 4, 6 → 3 casos. Total: 6 faces. P = 3/6 = 1/2.",
  },
  {
    id: "mat_pb_q02",
    contentId: "content_1767459320252_pmw9fzsip",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "A probabilidade de um evento impossível é 0 e a probabilidade de um evento certo (que sempre ocorre) é 1.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Por definição: P(impossível) = 0 (nenhum caso favorável) e P(certo) = 1 (todos os casos são favoráveis). Para qualquer evento A: 0 ≤ P(A) ≤ 1. Correto.",
    explanationCorrect: "Por definição: P(impossível) = 0 (nenhum caso favorável) e P(certo) = 1 (todos os casos são favoráveis). Para qualquer evento A: 0 ≤ P(A) ≤ 1. Correto.",
    explanationWrong: "Definição fundamental: P(impossível)=0 e P(certo)=1. Toda probabilidade está no intervalo [0, 1].",
  },
  {
    id: "mat_pb_q03",
    contentId: "content_1767459320252_pmw9fzsip",
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    statement: "Se a probabilidade de chover amanhã é 0,3, então a probabilidade de NÃO chover é 0,6.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Eventos complementares: P(A) + P(Ā) = 1. P(não chover) = 1 − 0,3 = 0,7, não 0,6.",
    explanationCorrect: "Eventos complementares: P(A) + P(Ā) = 1. P(não chover) = 1 − 0,3 = 0,7, não 0,6.",
    explanationWrong: "P(não chover) = 1 − P(chover) = 1 − 0,3 = 0,7. O enunciado diz 0,6, o que está errado.",
  },
  {
    id: "mat_pb_q04",
    contentId: "content_1767459320252_pmw9fzsip",
    questionType: "CERTO_ERRADO",
    difficulty: "DIFICIL",
    statement: "Ao lançar dois dados honestos simultaneamente, a probabilidade de a soma ser igual a 7 é 1/6.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Total de resultados: 6×6=36. Pares que somam 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) → 6 casos. P = 6/36 = 1/6. Correto.",
    explanationCorrect: "Total de resultados: 6×6=36. Pares que somam 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) → 6 casos. P = 6/36 = 1/6. Correto.",
    explanationWrong: "6 pares somam 7 (1+6, 2+5, 3+4, 4+3, 5+2, 6+1). Total: 36. P = 6/36 = 1/6.",
  },
  {
    id: "mat_pb_q05",
    contentId: "content_1767459320252_pmw9fzsip",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "Uma urna contém 3 bolas vermelhas, 2 azuis e 1 verde. Ao retirar uma bola ao acaso, qual é a probabilidade de ser vermelha?",
    alternatives: [
      { letter: "A", text: "1/6" },
      { letter: "B", text: "1/3" },
      { letter: "C", text: "1/2" },
      { letter: "D", text: "2/3" },
      { letter: "E", text: "5/6" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Total de bolas: 3+2+1=6. Favoráveis (vermelhas): 3. P = 3/6 = 1/2.",
    explanationCorrect: "Total de bolas: 3+2+1=6. Favoráveis (vermelhas): 3. P = 3/6 = 1/2.",
    explanationWrong: "P(vermelha) = 3 vermelhas / 6 totais = 1/2.",
  },
  {
    id: "mat_pb_q06",
    contentId: "content_1767459320252_pmw9fzsip",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "Um baralho comum tem 52 cartas (4 naipes com 13 cartas cada). Qual é a probabilidade de retirar um ás ao acaso?",
    alternatives: [
      { letter: "A", text: "1/52" },
      { letter: "B", text: "1/26" },
      { letter: "C", text: "1/13" },
      { letter: "D", text: "1/4" },
      { letter: "E", text: "4/13" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Há 4 ases no baralho (um por naipe). P = 4/52 = 1/13.",
    explanationCorrect: "Há 4 ases no baralho (um por naipe). P = 4/52 = 1/13.",
    explanationWrong: "4 ases em 52 cartas: P = 4/52 = 1/13.",
  },
  {
    id: "mat_pb_q07",
    contentId: "content_1767459320252_pmw9fzsip",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "MEDIO",
    statement: "Um saco contém 5 bolas numeradas de 1 a 5. Qual é a probabilidade de sortear um número ímpar?",
    alternatives: [
      { letter: "A", text: "1/5" },
      { letter: "B", text: "2/5" },
      { letter: "C", text: "3/5" },
      { letter: "D", text: "4/5" },
      { letter: "E", text: "1/2" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Ímpares de 1 a 5: {1, 3, 5} → 3 bolas. Total: 5. P = 3/5.",
    explanationCorrect: "Ímpares de 1 a 5: {1, 3, 5} → 3 bolas. Total: 5. P = 3/5.",
    explanationWrong: "Ímpares: 1, 3, 5 = 3 casos favoráveis. Total: 5. P = 3/5.",
  },
  {
    id: "mat_pb_q08",
    contentId: "content_1767459320252_pmw9fzsip",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "DIFICIL",
    statement: "Uma moeda honesta é lançada 3 vezes. Qual é a probabilidade de obter exatamente 2 caras?",
    alternatives: [
      { letter: "A", text: "1/8" },
      { letter: "B", text: "2/8" },
      { letter: "C", text: "3/8" },
      { letter: "D", text: "4/8" },
      { letter: "E", text: "6/8" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Total de resultados: 2³=8. Casos com exatamente 2 caras: CCK, CKC, KCC → 3 casos (C(3,2)=3). P = 3/8.",
    explanationCorrect: "Total de resultados: 2³=8. Casos com exatamente 2 caras: CCK, CKC, KCC → 3 casos (C(3,2)=3). P = 3/8.",
    explanationWrong: "C(3,2)=3 combinações com 2 caras. Total: 8 resultados. P = 3/8.",
  },

  // ═══════════════════════════════════════════════════════════
  // ÁTOMO 2 — Divisão Proporcional (ct_mm9q80hf3wm3p2)
  // 6 questões novas: 3 CE + 3 ME (átomo já tem 2q)
  // ═══════════════════════════════════════════════════════════

  {
    id: "mat_dp_q01",
    contentId: "ct_mm9q80hf3wm3p2",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "Para dividir R$ 120,00 entre A e B na proporção 3:1, A deve receber R$ 90,00 e B deve receber R$ 30,00.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Total de partes: 3+1=4. A recebe 3/4 × R$120 = R$90. B recebe 1/4 × R$120 = R$30. Correto.",
    explanationCorrect: "Total de partes: 3+1=4. A recebe 3/4 × R$120 = R$90. B recebe 1/4 × R$120 = R$30. Correto.",
    explanationWrong: "Na razão 3:1, soma das partes = 4. A = 3/4 × 120 = 90; B = 1/4 × 120 = 30.",
  },
  {
    id: "mat_dp_q02",
    contentId: "ct_mm9q80hf3wm3p2",
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    statement: "Na divisão inversamente proporcional de R$ 120,00 entre A e B nas proporções inversas a 2 e 3, A recebe R$ 72,00 e B recebe R$ 48,00.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Inversamente proporcional a 2:3 → proporções são 1/2 : 1/3 = 3:2. Total partes=5. A=3/5×120=72; B=2/5×120=48. Correto.",
    explanationCorrect: "Inversamente proporcional a 2:3 → proporções são 1/2 : 1/3 = 3:2. Total partes=5. A=3/5×120=72; B=2/5×120=48. Correto.",
    explanationWrong: "Inversamente proporcional a 2:3 → inverso: 1/2 e 1/3, que simplificados dão razão 3:2. A=72, B=48.",
  },
  {
    id: "mat_dp_q03",
    contentId: "ct_mm9q80hf3wm3p2",
    questionType: "CERTO_ERRADO",
    difficulty: "DIFICIL",
    statement: "Três sócios investiram R$ 2.000, R$ 3.000 e R$ 5.000 respectivamente. Se o lucro foi de R$ 4.000, o sócio que investiu R$ 5.000 recebe R$ 2.000 de lucro.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Proporção dos investimentos: 2:3:5 (total=10 partes). Sócio C = 5/10 × R$4.000 = R$2.000. Correto.",
    explanationCorrect: "Proporção dos investimentos: 2:3:5 (total=10 partes). Sócio C = 5/10 × R$4.000 = R$2.000. Correto.",
    explanationWrong: "Razão 2:3:5, total 10 partes. Maior sócio = 5/10 × 4000 = R$2.000.",
  },
  {
    id: "mat_dp_q04",
    contentId: "ct_mm9q80hf3wm3p2",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "R$ 200,00 devem ser divididos entre Ana e Bruno na proporção 3:2. Quanto Ana recebe?",
    alternatives: [
      { letter: "A", text: "R$ 80,00" },
      { letter: "B", text: "R$ 100,00" },
      { letter: "C", text: "R$ 120,00" },
      { letter: "D", text: "R$ 150,00" },
      { letter: "E", text: "R$ 160,00" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Total de partes: 3+2=5. Ana = 3/5 × R$200 = R$120. Bruno = 2/5 × R$200 = R$80.",
    explanationCorrect: "Total de partes: 3+2=5. Ana = 3/5 × R$200 = R$120. Bruno = 2/5 × R$200 = R$80.",
    explanationWrong: "Razão 3:2 → 5 partes. Ana = 3/5 × 200 = R$120.",
  },
  {
    id: "mat_dp_q05",
    contentId: "ct_mm9q80hf3wm3p2",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "MEDIO",
    statement: "Três irmãos dividem uma herança de R$ 18.000 nas proporções 1:2:3. Qual é o maior quinhão?",
    alternatives: [
      { letter: "A", text: "R$ 3.000" },
      { letter: "B", text: "R$ 6.000" },
      { letter: "C", text: "R$ 9.000" },
      { letter: "D", text: "R$ 10.000" },
      { letter: "E", text: "R$ 12.000" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Total de partes: 1+2+3=6. Maior quinhão = 3/6 × R$18.000 = R$9.000.",
    explanationCorrect: "Total de partes: 1+2+3=6. Maior quinhão = 3/6 × R$18.000 = R$9.000.",
    explanationWrong: "1:2:3 → 6 partes. Maior parcela = 3/6 × 18000 = R$9.000.",
  },
  {
    id: "mat_dp_q06",
    contentId: "ct_mm9q80hf3wm3p2",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "DIFICIL",
    statement: "R$ 250,00 são divididos entre A e B inversamente proporcional a 2 e 3. Quanto A recebe?",
    alternatives: [
      { letter: "A", text: "R$ 80,00" },
      { letter: "B", text: "R$ 100,00" },
      { letter: "C", text: "R$ 125,00" },
      { letter: "D", text: "R$ 150,00" },
      { letter: "E", text: "R$ 200,00" },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "Inversamente proporcional a 2:3 → as partes ficam na razão inversa 1/2 : 1/3 = 3:2. Total: 5 partes. A = 3/5 × R$250 = R$150. B = 2/5 × R$250 = R$100.",
    explanationCorrect: "Inversamente proporcional a 2:3 → as partes ficam na razão inversa 1/2 : 1/3 = 3:2. Total: 5 partes. A = 3/5 × R$250 = R$150. B = 2/5 × R$250 = R$100.",
    explanationWrong: "Inversamente a 2:3 → inverter os termos: razão 3:2. Total 5 partes. A = 3/5 × 250 = R$150.",
  },
];

async function main() {
  console.log("=== R44 — DENSIFICAÇÃO: Matemática — Probabilidade e Divisão Proporcional ===");
  console.log(`Total de questões a inserir: ${questions.length}`);

  // 1. Verificar existência dos átomos
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
