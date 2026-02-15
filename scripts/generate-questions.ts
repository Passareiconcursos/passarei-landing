/**
 * Gera questões adicionais para matérias com poucas questões.
 * Alvo: matérias com menos de 15 questões ativas.
 * Gera 15 questões por matéria usando Anthropic API.
 *
 * Uso: DATABASE_URL="..." ANTHROPIC_API_KEY="..." npx tsx scripts/generate-questions.ts
 */
import { db } from "../db/index";
import { sql } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-sonnet-4-20250514";
const DELAY_MS = 3000;
const TARGET_QUESTIONS = 15; // Gerar até ter 15 questões por matéria
const QUESTIONS_PER_BATCH = 5; // 5 questões por chamada de API

function generateId(): string {
  return `question_${Date.now()}_${Math.random().toString(36).substring(2, 13)}`;
}

async function getWeakSubjects(): Promise<any[]> {
  const subjects = await db.execute(sql`
    SELECT
      s.id,
      s."displayName",
      s.category,
      COUNT(q.id) as question_count
    FROM "Subject" s
    LEFT JOIN "Question" q ON q."subjectId" = s.id AND q."isActive" = true
    WHERE s."isActive" = true
    GROUP BY s.id, s."displayName", s.category
    HAVING COUNT(q.id) < ${TARGET_QUESTIONS}
    ORDER BY COUNT(q.id) ASC
  `) as any[];
  return subjects;
}

async function getSampleContent(subjectId: string): Promise<string[]> {
  const contents = await db.execute(sql`
    SELECT title, LEFT("textContent", 300) as preview
    FROM "Content"
    WHERE "subjectId" = ${subjectId}
      AND "isActive" = true
    ORDER BY RANDOM()
    LIMIT 5
  `) as any[];
  return contents.map((c: any) => `- ${c.title}: ${c.preview}`);
}

async function getExistingStatements(subjectId: string): Promise<string[]> {
  const questions = await db.execute(sql`
    SELECT statement
    FROM "Question"
    WHERE "subjectId" = ${subjectId}
      AND "isActive" = true
  `) as any[];
  return questions.map((q: any) => q.statement);
}

async function generateQuestions(
  subjectName: string,
  subjectId: string,
  sampleTopics: string[],
  existingStatements: string[],
  count: number,
): Promise<any[]> {
  const existingList = existingStatements.length > 0
    ? `\n\nQUESTÕES JÁ EXISTENTES (NÃO REPETIR):\n${existingStatements.map(s => `- ${s}`).join("\n")}`
    : "";

  const topicsContext = sampleTopics.length > 0
    ? `\n\nTÓPICOS DISPONÍVEIS:\n${sampleTopics.join("\n")}`
    : "";

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: `Você é um especialista em concursos policiais brasileiros (PF, PRF, PM, PC).

Gere exatamente ${count} questões de MÚLTIPLA ESCOLHA sobre "${subjectName}" para concursos policiais.
${topicsContext}
${existingList}

REGRAS:
1. Questões no estilo CESPE/Cebraspe, FGV, VUNESP (bancas reais)
2. 4 alternativas por questão (A, B, C, D)
3. Apenas 1 alternativa correta
4. Variar dificuldade: 2 FACIL, ${Math.max(1, count - 4)} MEDIO, 2 DIFICIL
5. Explicação detalhada para cada questão (por que a correta é correta E por que as outras são erradas)
6. NÃO repetir temas das questões existentes

Responda em formato JSON válido, array de objetos:
[
  {
    "statement": "Enunciado da questão",
    "alternatives": ["alternativa A", "alternativa B", "alternativa C", "alternativa D"],
    "correctAnswer": "0",
    "explanation": "Explicação detalhada...",
    "difficulty": "FACIL"
  }
]

IMPORTANTE: correctAnswer é o ÍNDICE (0-3) da alternativa correta.
Responda APENAS o JSON, sem texto antes ou depois.`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // Extrair JSON
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Resposta não contém JSON válido");
  }

  const questions = JSON.parse(jsonMatch[0]);

  // Validar e formatar
  return questions
    .filter((q: any) => {
      if (!q.statement || !q.alternatives || !q.correctAnswer || !q.explanation) return false;
      if (!Array.isArray(q.alternatives) || q.alternatives.length < 4) return false;
      const idx = parseInt(q.correctAnswer);
      if (isNaN(idx) || idx < 0 || idx >= q.alternatives.length) return false;
      return true;
    })
    .map((q: any) => ({
      id: generateId(),
      statement: q.statement,
      alternatives: q.alternatives,
      correctAnswer: String(q.correctAnswer),
      explanation: q.explanation,
      difficulty: ["FACIL", "MEDIO", "DIFICIL"].includes(q.difficulty) ? q.difficulty : "MEDIO",
      subjectId,
      questionType: "MULTIPLA_ESCOLHA",
    }));
}

async function insertQuestions(questions: any[]): Promise<number> {
  let inserted = 0;
  for (const q of questions) {
    try {
      await db.execute(sql`
        INSERT INTO "Question" (
          id, statement, alternatives, "correctAnswer", explanation,
          difficulty, "subjectId", "questionType", "isActive",
          "timesUsed", "reviewStatus", "createdAt", "updatedAt"
        ) VALUES (
          ${q.id},
          ${q.statement},
          ${JSON.stringify(q.alternatives)}::jsonb,
          ${q.correctAnswer},
          ${q.explanation},
          ${q.difficulty}::"Difficulty",
          ${q.subjectId},
          'MULTIPLA_ESCOLHA'::"QuestionType",
          true,
          0,
          'PENDENTE',
          NOW(),
          NOW()
        )
      `);
      inserted++;
    } catch (error: any) {
      console.log(`   Erro ao inserir: ${error.message}`);
    }
  }
  return inserted;
}

async function main() {
  console.log("=== GERADOR DE QUESTOES ===\n");

  const weakSubjects = await getWeakSubjects();
  console.log(`Materias com menos de ${TARGET_QUESTIONS} questoes: ${weakSubjects.length}\n`);

  if (weakSubjects.length === 0) {
    console.log("Todas as materias tem questoes suficientes!");
    process.exit(0);
  }

  let totalGenerated = 0;
  let totalInserted = 0;

  for (const subject of weakSubjects) {
    const currentCount = parseInt(subject.question_count);
    const needed = TARGET_QUESTIONS - currentCount;

    console.log(`\n[${subject.displayName}] Tem ${currentCount} questoes, precisa de +${needed}`);

    // Buscar contexto
    const sampleTopics = await getSampleContent(subject.id);
    const existingStatements = await getExistingStatements(subject.id);

    // Gerar em batches de 5
    let generated = 0;
    while (generated < needed) {
      const batchSize = Math.min(QUESTIONS_PER_BATCH, needed - generated);
      console.log(`   Gerando batch de ${batchSize} questoes...`);

      try {
        const questions = await generateQuestions(
          subject.displayName,
          subject.id,
          sampleTopics,
          [...existingStatements], // incluir existentes para evitar repetição
          batchSize,
        );

        if (questions.length === 0) {
          console.log(`   Nenhuma questao valida gerada, pulando`);
          break;
        }

        const inserted = await insertQuestions(questions);
        generated += inserted;
        totalGenerated += questions.length;
        totalInserted += inserted;

        // Adicionar statements gerados para não repetir no próximo batch
        for (const q of questions) {
          existingStatements.push(q.statement);
        }

        console.log(`   +${inserted} questoes inseridas (${currentCount + generated}/${TARGET_QUESTIONS})`);

        // Delay entre batches
        await new Promise((r) => setTimeout(r, DELAY_MS));
      } catch (error: any) {
        if (error?.message?.includes("credit") || error?.status === 429) {
          console.log(`\nCreditos insuficientes apos ${totalInserted} questoes. Rode novamente.`);
          process.exit(1);
        }
        console.log(`   Erro: ${error.message}`);
        break;
      }
    }
  }

  console.log(`\n=== RESULTADO ===`);
  console.log(`Questoes geradas: ${totalGenerated}`);
  console.log(`Questoes inseridas: ${totalInserted}`);
  console.log(`Status: PENDENTE (precisam de revisao)`);

  process.exit(0);
}

main().catch(console.error);
