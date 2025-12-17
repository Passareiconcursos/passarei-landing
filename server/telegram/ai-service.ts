import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-3-5-haiku-20241022";

interface EnhancedContent {
  keyPoints: string;
  example: string;
  tip: string;
}

interface ExplanationResult {
  explanation: string;
}

// Gerar conteúdo enriquecido (pontos-chave, exemplo, dica)
export async function generateEnhancedContent(
  title: string,
  textContent: string,
  examType: string
): Promise<EnhancedContent> {
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Você é um professor especialista em concursos policiais (${examType}).

TEMA: ${title}
DEFINIÇÃO: ${textContent}

Gere em português brasileiro:

1. PONTOS-CHAVE (3 bullets curtos e objetivos, começando com •)
2. EXEMPLO PRÁTICO (1 situação real de aplicação, máximo 2 linhas)
3. DICA DE PROVA (1 dica específica de como esse tema cai em provas, máximo 2 linhas)

Responda EXATAMENTE neste formato:
PONTOS-CHAVE:
- ponto 1
- ponto 2
- ponto 3

EXEMPLO:
texto do exemplo

DICA:
texto da dica`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    
    // Parse da resposta
    const keyPointsMatch = text.match(/PONTOS-CHAVE:\n([\s\S]*?)(?=\nEXEMPLO:)/);
    const exampleMatch = text.match(/EXEMPLO:\n([\s\S]*?)(?=\nDICA:)/);
    const tipMatch = text.match(/DICA:\n([\s\S]*?)$/);

    return {
      keyPoints: keyPointsMatch ? keyPointsMatch[1].trim() : "• Conceito fundamental\n• Aplicável em provas\n• Tema recorrente",
      example: exampleMatch ? exampleMatch[1].trim() : "Aplicação prática em situações do cotidiano policial.",
      tip: tipMatch ? tipMatch[1].trim() : "Fique atento a este tema nas provas objetivas.",
    };
  } catch (error) {
    console.error("❌ Erro ao gerar conteúdo com IA:", error);
    return {
      keyPoints: "• Conceito fundamental\n• Aplicável em provas\n• Tema recorrente",
      example: "Aplicação prática em situações do cotidiano policial.",
      tip: "Fique atento a este tema nas provas objetivas.",
    };
  }
}

// Gerar explicação após acerto/erro
export async function generateExplanation(
  title: string,
  textContent: string,
  userAnswer: string,
  correctAnswer: string,
  isCorrect: boolean
): Promise<ExplanationResult> {
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Você é um professor de concursos.

TEMA: ${title}
CONCEITO: ${textContent}
RESPOSTA DO ALUNO: ${userAnswer}
RESPOSTA CORRETA: ${correctAnswer}
ACERTOU: ${isCorrect ? "SIM" : "NÃO"}

${isCorrect 
  ? "Dê um reforço positivo breve (1-2 linhas) explicando POR QUE está correto."
  : "Explique brevemente (2-3 linhas) por que a resposta está errada e qual o conceito correto."
}

Seja direto e didático. Máximo 3 linhas.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    
    return {
      explanation: text.trim(),
    };
  } catch (error) {
    console.error("❌ Erro ao gerar explicação com IA:", error);
    return {
      explanation: isCorrect 
        ? "Muito bem! Você demonstrou conhecimento do tema."
        : "Revise este conceito. É importante para sua aprovação.",
    };
  }
}
