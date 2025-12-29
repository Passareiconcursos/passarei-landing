// scripts/generate-content.ts
// 🤖 Script para gerar conteúdos e questões com IA

import Anthropic from "@anthropic-ai/sdk";
import { db } from "../db";
import { sql } from "drizzle-orm";

/**
 * Configuração da IA
 */
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

/**
 * Interface do conteúdo gerado
 */
interface GeneratedContent {
  subject: string;
  title: string;
  definition: string;
  keyPoints: string[];
  example: string;
  tip: string;
  examType: string;
  difficulty: "easy" | "medium" | "hard";
}

/**
 * Interface da questão gerada
 */
interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

/**
 * Gerar conteúdo com IA
 */
async function generateContent(
  subject: string,
  topic: string,
  examType: string,
  difficulty: "easy" | "medium" | "hard" = "medium",
): Promise<GeneratedContent> {
  console.log(`\n🤖 Gerando conteúdo: ${subject} - ${topic}`);

  const prompt = `Você é um especialista em concursos públicos brasileiros, especialmente ${examType}.

Crie um conteúdo de estudo sobre "${topic}" para a matéria "${subject}".

IMPORTANTE: Responda APENAS com JSON válido, sem texto adicional antes ou depois.

Formato JSON:
{
  "subject": "${subject}",
  "title": "título do tópico (curto, até 80 caracteres)",
  "definition": "definição clara e objetiva (150-200 palavras)",
  "keyPoints": [
    "ponto-chave 1 (1 frase)",
    "ponto-chave 2 (1 frase)",
    "ponto-chave 3 (1 frase)"
  ],
  "example": "exemplo prático aplicado a concursos (100 palavras)",
  "tip": "dica específica para prova (50 palavras)",
  "examType": "${examType}",
  "difficulty": "${difficulty}"
}

Requisitos:
- Linguagem clara e objetiva
- Foco em concursos ${examType}
- Exemplos práticos
- Dicas aplicáveis em provas
- Nível: ${difficulty}`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Limpar possíveis ```json ou ``` do início/fim
    const cleanJson = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const content = JSON.parse(cleanJson);

    console.log(`✅ Conteúdo gerado: ${content.title}`);

    return content;
  } catch (error: any) {
    console.error("❌ Erro ao gerar conteúdo:", error.message);
    throw error;
  }
}

/**
 * Gerar questões para um conteúdo
 */
async function generateQuestions(
  content: GeneratedContent,
  quantity: number = 4,
): Promise<GeneratedQuestion[]> {
  console.log(`\n🤖 Gerando ${quantity} questões para: ${content.title}`);

  const prompt = `Você é um especialista em elaborar questões de concursos públicos brasileiros.

Com base neste conteúdo:
TÍTULO: ${content.title}
DEFINIÇÃO: ${content.definition}
PONTOS-CHAVE: ${content.keyPoints.join(", ")}

Crie ${quantity} questões de múltipla escolha no estilo CESPE/FCC/VUNESP.

IMPORTANTE: Responda APENAS com JSON válido, sem texto adicional.

Formato JSON:
{
  "questions": [
    {
      "question": "enunciado da questão (claro e objetivo)",
      "options": [
        "alternativa A (completa)",
        "alternativa B (completa)",
        "alternativa C (completa)",
        "alternativa D (completa)"
      ],
      "correctAnswer": 0,
      "explanation": "explicação detalhada por que a resposta está correta (100 palavras)",
      "difficulty": "medium"
    }
  ]
}

Requisitos:
- 4 alternativas por questão
- Apenas 1 correta
- Distratores plausíveis (alternativas erradas convincentes)
- Explicação clara
- Variação de dificuldade: ${Math.floor(quantity * 0.4)} fáceis, ${Math.ceil(quantity * 0.4)} médias, ${Math.floor(quantity * 0.2)} difíceis`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    const cleanJson = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const response = JSON.parse(cleanJson);

    console.log(`✅ ${response.questions.length} questões geradas`);

    return response.questions;
  } catch (error: any) {
    console.error("❌ Erro ao gerar questões:", error.message);
    throw error;
  }
}

/**
 * Mapear dificuldade inglês → português
 */
function mapDifficulty(difficulty: string): string {
  const map: Record<string, string> = {
    easy: "FACIL",
    medium: "MEDIO",
    hard: "DIFICIL",
  };
  return map[difficulty.toLowerCase()] || "MEDIO";
}
/**
 * Salvar conteúdo no banco
 */
async function saveContent(content: GeneratedContent): Promise<string> {
  try {
    const contentId = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Montar texto completo
    const fullText =
      `${content.definition}\n\n` +
      `PONTOS-CHAVE:\n${content.keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\n` +
      `EXEMPLO:\n${content.example}\n\n` +
      `DICA:\n${content.tip}`;

    await db.execute(sql`
      INSERT INTO "Content" (
        id,
        "subjectId",
        title,
        "textContent",
        difficulty,
        "wordCount",
        "estimatedReadTime",
        "createdAt",
        "updatedAt"
      ) VALUES (
        ${contentId},
        ${content.subject},
        ${content.title},
        ${fullText},
        ${mapDifficulty(content.difficulty)},
        ${fullText.split(" ").length},
        ${Math.ceil(fullText.split(" ").length / 200)},
        NOW(),
        NOW()
      )
    `);

    console.log(`💾 Conteúdo salvo: ${contentId}`);

    return contentId;
  } catch (error: any) {
    console.error("❌ Erro ao salvar conteúdo:", error.message);
    throw error;
  }
}

/**
 * Salvar questões no banco
 */
async function saveQuestions(
  contentId: string,
  questions: GeneratedQuestion[],
): Promise<void> {
  try {
    for (const question of questions) {
      const questionId = `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await db.execute(sql`
        INSERT INTO "Question" (
          id,
          "subjectId",
          statement,
          alternatives,
          "correctAnswer",
          explanation,
          difficulty,
          "questionType",
          "createdAt",
          "updatedAt"
        ) VALUES (
          ${questionId},
          ${contentId},
          ${question.question},
          ${JSON.stringify(question.options)},
          ${question.correctAnswer.toString()},
          ${question.explanation},
          ${mapDifficulty(question.difficulty)},
          'MULTIPLA_ESCOLHA',
          NOW(),
          NOW()
        )
      `);

      console.log(`💾 Questão salva: ${questionId}`);

      // Aguardar 100ms entre questões
      await new Promise((r) => setTimeout(r, 100));
    }
  } catch (error: any) {
    console.error("❌ Erro ao salvar questões:", error.message);
    throw error;
  }
}

/**
 * Gerar matéria completa
 */
async function generateSubject(
  subject: string, // ← nome enganoso
  topics: string[],
  examType: string,
  questionsPerContent: number = 4,
): Promise<void> {
  console.log(`\n🚀 Gerando matéria completa: ${subject}`);
  console.log(`📚 Tópicos: ${topics.length}`);
  console.log(`❓ Questões por tópico: ${questionsPerContent}`);
  console.log(`🎯 Total de questões: ${topics.length * questionsPerContent}\n`);

  let contentCount = 0;
  let questionCount = 0;

  for (const topic of topics) {
    try {
      // Gerar conteúdo
      const content = await generateContent(subject, topic, examType);

      // Salvar conteúdo
      const contentId = await saveContent(content);
      contentCount++;

      // Gerar questões
      const questions = await generateQuestions(content, questionsPerContent);

      // Salvar questões
      await saveQuestions(contentId, questions);
      questionCount += questions.length;

      // Aguardar 2s entre gerações (rate limit)
      await new Promise((r) => setTimeout(r, 2000));
    } catch (error: any) {
      console.error(`❌ Erro ao processar tópico "${topic}":`, error.message);
      console.log("⏭️ Continuando para próximo tópico...\n");
    }
  }

  console.log(`\n✅ Geração completa!`);
  console.log(`📚 Conteúdos criados: ${contentCount}`);
  console.log(`❓ Questões criadas: ${questionCount}`);
}

/**
 * Exemplo de uso
 */
async function main() {
  console.log("🚀 Iniciando geração de conteúdo...\n");

  // USAR O ID EXATO QUE EXISTE
  const subjectId = "cmichej6a0005rpjyxqjqmyzr"; // DIR_CONSTITUCIONAL
  const examType = "PM";

  const topics = [
    "Princípios Fundamentais da República",
    "Direitos e Garantias Fundamentais",
  ];

  await generateSubject(subjectId, topics, examType, 4);

  console.log("\n✅ Processo finalizado!");
  process.exit(0);
}

// Executar diretamente
main().catch((error) => {
  console.error("❌ Erro fatal:", error);
  process.exit(1);
});

// Exportar funções
export {
  generateContent,
  generateQuestions,
  saveContent,
  saveQuestions,
  generateSubject,
};
