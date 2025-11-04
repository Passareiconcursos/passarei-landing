import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

// Carregar variáveis do .env
dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface GenerateContentParams {
  subject: string;
  examType: string;
  topic: string;
}

interface GenerateQuestionsParams {
  contentTitle: string;
  contentBody: string;
  subject: string;
}

export async function generateContent(params: GenerateContentParams) {
  const { subject, examType, topic } = params;

  const prompt = `Você é um especialista em concursos públicos brasileiros, especialmente para carreiras policiais.

TAREFA: Criar um conteúdo educacional completo sobre o tema "${topic}" para ${examType} (matéria: ${subject}).

ESTRUTURA OBRIGATÓRIA:
1. DEFINIÇÃO (2-3 frases claras e diretas)
2. PONTOS PRINCIPAIS (3-5 pontos em bullet points)
3. EXEMPLO PRÁTICO (caso real ou situação do dia a dia policial)
4. DICA DE PROVA (pegadinha comum ou erro frequente)

REGRAS:
- Linguagem clara e objetiva
- Foco em concursos policiais
- Base legal quando aplicável (cite artigos de lei)
- 200-400 palavras no total
- Português brasileiro formal

Formate a resposta em JSON assim:
{
  "title": "Título do conteúdo",
  "definition": "Definição clara",
  "keyPoints": "• Ponto 1\\n• Ponto 2\\n• Ponto 3",
  "example": "Exemplo prático",
  "tip": "Dica de prova",
  "tags": ["tag1", "tag2", "tag3"]
}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const responseText = message.content[0].type === "text" 
    ? message.content[0].text 
    : "";

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("IA não retornou formato válido");
  }

  return JSON.parse(jsonMatch[0]);
}

export async function generateQuestions(params: GenerateQuestionsParams) {
  const { contentTitle, contentBody, subject } = params;

  const prompt = `Você é um especialista em criar questões de concursos públicos brasileiros.

CONTEXTO DO CONTEÚDO:
Título: ${contentTitle}
Matéria: ${subject}
Conteúdo: ${contentBody}

TAREFA: Criar 3 questões de múltipla escolha (A, B, C, D, E) baseadas neste conteúdo.

REGRAS:
- Estilo de concursos CESPE/CEBRASPE
- 1 questão FÁCIL, 1 MÉDIA, 1 DIFÍCIL
- Alternativas plausíveis (não óbvias)
- Explicação detalhada da resposta correta
- Uma única alternativa correta

Formate a resposta em JSON assim:
{
  "questions": [
    {
      "questionText": "Texto da questão",
      "optionA": "Alternativa A",
      "optionB": "Alternativa B",
      "optionC": "Alternativa C",
      "optionD": "Alternativa D",
      "optionE": "Alternativa E",
      "correctAnswer": "C",
      "explanation": "Explicação detalhada",
      "difficulty": "FACIL"
    }
  ]
}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });

  const responseText = message.content[0].type === "text" 
    ? message.content[0].text 
    : "";

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("IA não retornou formato válido");
  }

  return JSON.parse(jsonMatch[0]);
}
