/**
 * AI Engine — Serviço compartilhado de IA (Telegram + Sala de Aula)
 *
 * Responsável por:
 * - Enriquecer conteúdo educacional (pontos-chave, exemplo, dica)
 * - Gerar explicações pós-resposta (acerto/erro)
 * - Gerar questões contextuais via Claude API
 *
 * Extraído de: server/telegram/ai-service.ts
 */

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-sonnet-4-20250514";

// ============================================
// INTERFACES
// ============================================

export interface EnhancedContent {
  keyPoints: string;
  example: string;
  tip: string;
}

export interface ExplanationResult {
  explanation: string;
}

export interface GeneratedQuestion {
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
}

// ============================================
// ENRIQUECER CONTEÚDO (pontos-chave, exemplo, dica)
// ============================================

export async function generateEnhancedContent(
  title: string,
  textContent: string,
  examType: string,
): Promise<EnhancedContent> {
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

    if (!keyPointsMatch || !exampleMatch || !tipMatch) {
      console.warn(`⚠️ [AI Engine] Regex parcial para "${title}" - KP:${!!keyPointsMatch} EX:${!!exampleMatch} TIP:${!!tipMatch}`);
    }

    return result;
  } catch (error: any) {
    const isCredits = error?.message?.includes("credit") || error?.status === 429;
    if (isCredits) {
      console.warn("⚠️ [AI Engine] Créditos Anthropic insuficientes - usando fallback inteligente");
    } else {
      console.error("❌ [AI Engine] Erro ao gerar conteúdo:", error?.message || error);
    }
    return smartFallback;
  }
}

// ============================================
// FALLBACK INTELIGENTE (sem API)
// ============================================

export function buildSmartFallback(title: string, textContent: string): EnhancedContent {
  const sentences = textContent
    .split(/[.;]\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15 && s.length < 200);

  const points = sentences.slice(0, 3).map(s => `• ${s}`);
  const keyPoints = points.length > 0
    ? points.join("\n")
    : `• ${title}: conceito essencial para concursos policiais`;

  const midIdx = Math.floor(sentences.length / 2);
  const example = sentences[midIdx] || `Aplicação de ${title} no contexto policial.`;

  const tip = sentences[sentences.length - 1] || `${title} é tema recorrente em provas de concursos policiais.`;

  return { keyPoints, example, tip };
}

// ============================================
// GERAR EXPLICAÇÃO PÓS-RESPOSTA
// ============================================

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

    return { explanation: text.trim() };
  } catch (error) {
    console.error("❌ [AI Engine] Erro ao gerar explicação:", error);
    return {
      explanation: isCorrect
        ? "Muito bem! Você demonstrou conhecimento do tema."
        : "Revise este conceito. É importante para sua aprovação.",
    };
  }
}

// ============================================
// CONTEXTO DE CONCURSO (opcional em todos os geradores)
// ============================================

export interface ConcursoCtx {
  nome: string;   // "Polícia Federal"
  banca: string;  // "CEBRASPE"
  cargo: string;  // "Agente de Polícia Federal"
}

function buildQuestionPrompt(
  title: string,
  textContent: string,
  examType: string,
  concursoCtx?: ConcursoCtx,
): string {
  const header = concursoCtx
    ? `Você é um professor especialista em concursos policiais.
CONCURSO: ${concursoCtx.nome} | BANCA: ${concursoCtx.banca} | CARGO: ${concursoCtx.cargo}`
    : `Você é um professor especialista em concursos policiais (${examType}).`;

  const instruction = concursoCtx
    ? `Elabore UMA questão no estilo da banca ${concursoCtx.banca} para o cargo de ${concursoCtx.cargo}, DIRETAMENTE sobre o conteúdo acima.`
    : `Elabore UMA questão de múltipla escolha DIRETAMENTE sobre o conteúdo acima.`;

  return `${header}

TEMA: ${title}
CONTEÚDO ESTUDADO: ${textContent}

${instruction}
A questão DEVE testar o conhecimento específico do texto apresentado.

VALIDAÇÃO OBRIGATÓRIA — verifique antes de gerar:
1. Entidades geográficas: "Estado" ≠ "cidade" ≠ "município". Use só classificações presentes no conteúdo. Se incerto, use formulação genérica ("determinado Estado", "certa localidade").
2. Leis e artigos: cite somente números presentes no CONTEÚDO ESTUDADO. Não invente numeração.
3. Cargos e hierarquias: não confunda títulos (Delegado ≠ Agente ≠ Escrivão; Ministro ≠ Secretário).
4. Dado factual não verificável no texto → crie questão conceitual sem mencionar a entidade específica.

Responda em JSON válido:
{
  "pergunta": "Enunciado da questão",
  "opcoes": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "correta": 0,
  "explicacao": "Explicação breve de por que a alternativa correta está certa"
}

IMPORTANTE: Retorne APENAS o JSON, sem markdown ou texto adicional.`;
}

// ============================================
// GERAR QUESTÃO CONTEXTUAL VIA IA
// ============================================

export async function generateQuestion(
  title: string,
  textContent: string,
  examType: string,
  concursoCtx?: ConcursoCtx,
): Promise<GeneratedQuestion | null> {
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 600,
      messages: [
        {
          role: "user",
          content: buildQuestionPrompt(title, textContent, examType, concursoCtx),
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Extrair JSON da resposta (pode vir com ```json wrapper)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("⚠️ [AI Engine] Resposta não contém JSON válido");
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]) as GeneratedQuestion;

    // Validar estrutura
    if (!parsed.pergunta || !Array.isArray(parsed.opcoes) || parsed.opcoes.length < 2) {
      console.warn("⚠️ [AI Engine] Questão gerada com estrutura inválida");
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("❌ [AI Engine] Erro ao gerar questão:", error);
    return null;
  }
}

// ============================================
// GERAR QUESTÃO VIA HAIKU (fallback econômico)
// ============================================

export async function generateQuestionHaiku(
  title: string,
  bodyText: string,
  examType: string,
  concursoCtx?: ConcursoCtx,
): Promise<GeneratedQuestion | null> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      messages: [
        {
          role: "user",
          content: buildQuestionPrompt(title, bodyText, examType, concursoCtx),
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("⚠️ [AI Engine Haiku] Resposta não contém JSON válido");
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]) as GeneratedQuestion;

    if (!parsed.pergunta || !Array.isArray(parsed.opcoes) || parsed.opcoes.length < 2) {
      console.warn("⚠️ [AI Engine Haiku] Questão com estrutura inválida");
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("❌ [AI Engine Haiku] Erro ao gerar questão:", error);
    return null;
  }
}
