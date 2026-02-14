import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-sonnet-4-20250514";

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
  examType: string,
): Promise<EnhancedContent> {
  // Fallback inteligente: extrai do próprio textContent ao invés de mostrar genérico
  const smartFallback = buildSmartFallback(title, textContent);

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

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Parse da resposta (regex mais robusto - aceita variações de formatação)
    const keyPointsMatch = text.match(
      /PONTOS[- ]CHAVE:?\s*\n([\s\S]*?)(?=\n\s*EXEMPLO)/i,
    );
    const exampleMatch = text.match(/EXEMPLO[^:]*:?\s*\n([\s\S]*?)(?=\n\s*DICA)/i);
    const tipMatch = text.match(/DICA[^:]*:?\s*\n([\s\S]*?)$/i);

    const result = {
      keyPoints: keyPointsMatch ? keyPointsMatch[1].trim() : smartFallback.keyPoints,
      example: exampleMatch ? exampleMatch[1].trim() : smartFallback.example,
      tip: tipMatch ? tipMatch[1].trim() : smartFallback.tip,
    };

    // Log se regex falhou para debug
    if (!keyPointsMatch || !exampleMatch || !tipMatch) {
      console.warn(`⚠️ [AI] Regex parcial para "${title}" - KP:${!!keyPointsMatch} EX:${!!exampleMatch} TIP:${!!tipMatch}`);
    }

    return result;
  } catch (error: any) {
    const isCredits = error?.message?.includes("credit") || error?.status === 429;
    if (isCredits) {
      console.warn("⚠️ [AI] Créditos Anthropic insuficientes - usando fallback inteligente");
    } else {
      console.error("❌ Erro ao gerar conteúdo com IA:", error?.message || error);
    }
    return smartFallback;
  }
}

// Extrai pontos-chave do próprio textContent ao invés de mostrar "Conceito fundamental"
function buildSmartFallback(title: string, textContent: string): EnhancedContent {
  // Quebrar o textContent em frases significativas
  const sentences = textContent
    .split(/[.;]\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15 && s.length < 200);

  // Usar as primeiras frases como pontos-chave
  const points = sentences.slice(0, 3).map(s => `• ${s}`);
  const keyPoints = points.length > 0
    ? points.join("\n")
    : `• ${title}: conceito essencial para concursos policiais`;

  // Usar uma frase do meio como exemplo
  const midIdx = Math.floor(sentences.length / 2);
  const example = sentences[midIdx] || `Aplicação de ${title} no contexto policial.`;

  // Usar a última frase como dica
  const tip = sentences[sentences.length - 1] || `${title} é tema recorrente em provas de concursos policiais.`;

  return { keyPoints, example, tip };
}

// Gerar explicação após acerto/erro
export async function generateExplanation(
  title: string,
  textContent: string,
  userAnswer: string,
  correctAnswer: string,
  isCorrect: boolean,
): Promise<ExplanationResult> {
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `Você é um professor experiente de concursos policiais.

          📚 TEMA: ${title}
          📖 CONCEITO-CHAVE: ${textContent}

          👤 RESPOSTA DO ALUNO: ${userAnswer}
          ✅ RESPOSTA CORRETA: ${correctAnswer}
          ${isCorrect ? "🎯 ACERTOU!" : "❌ ERROU"}

          ${
            isCorrect
              ? `TAREFA: Dê feedback positivo (2-3 linhas) explicando:
          1. POR QUE a resposta ${correctAnswer} está correta
          2. O ponto-chave do conceito que ele demonstrou dominar
          3. Uma dica rápida de como esse tema costuma cair em provas

          Seja motivador e didático!`
              : `TAREFA: Explique de forma clara (3-4 linhas):
          1. POR QUE a resposta ${userAnswer} está ERRADA
          2. POR QUE a resposta correta é ${correctAnswer}
          3. O conceito-chave que ele precisa revisar
          4. Uma dica rápida de estudo

          Seja construtivo e motivador!`
          }

          IMPORTANTE: Máximo 5 linhas. Seja direto, didático e motivador.`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

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
