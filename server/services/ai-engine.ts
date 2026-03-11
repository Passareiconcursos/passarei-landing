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
  // Timeout explícito para evitar que o Railway corte a conexão (default SDK = 10min).
  // Haiku responde em <5s; 20s é margem segura antes do timeout Railway de ~30s.
  timeout: 20_000,
});

const MODEL = "claude-sonnet-4-6";

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

// ============================================
// CORRIGIR REDAÇÃO VIA IA (compartilhado Bot + Web)
// ============================================

export interface EssayCorrectionResult {
  scores: {
    comp1: number;  // 0-250 Norma Culta
    comp2: number;  // 0-250 Estrutura do Texto
    comp3: number;  // 0-250 Desenvolvimento Argumentativo
    comp4: number;  // 0-250 Coesão e Coerência
    total: number;  // 0-1000
  };
  feedback: {
    general: string;
    comp1: string;
    comp2: string;
    comp3: string;
    comp4: string;
  };
  rewrite_suggestion: string;  // Sugestão "Nota 10" para o critério mais fraco
}

const MODEL_HAIKU = "claude-haiku-4-5-20251001";

// Erros que NÃO devem ser tentados no fallback (falhas permanentes de autenticação)
function isPermanentAuthError(error: any): boolean {
  const status = error?.status ?? error?.statusCode ?? 0;
  return status === 401 || status === 403;
}

export async function correctEssay(
  theme: string,
  text: string,
  examType: string = "concurso policial",
  motivatingText: string = "",
): Promise<EssayCorrectionResult> {
  const isFederal = /FEDERAL|PF|PRF/i.test(examType);
  const bancaLabel = isFederal
    ? "Cebraspe (CESPE) — dissertativo-argumentativo com posicionamento crítico e proposta concreta"
    : "Vunesp / FGV — dissertativo com fundamentação e análise do texto motivador";

  const motivadorBlock = motivatingText
    ? `\nTEXTO MOTIVADOR:\n${motivatingText}\n`
    : "";

  const prompt = `Você é um corretor especialista em redações para concursos públicos policiais.
Banca organizadora: ${bancaLabel}
Concurso: ${examType}

TEMA: ${theme}
${motivadorBlock}
REDAÇÃO DO CANDIDATO:
${text}

Avalie esta redação com os 4 critérios adaptados para concursos policiais (0-250 pontos cada):

1. **Norma Culta** — gramática, ortografia, concordância, regência, pontuação
2. **Estrutura do Texto** — introdução, desenvolvimento, conclusão; coerência global
3. **Desenvolvimento Argumentativo** — profundidade dos argumentos, uso de dados/exemplos, pertinência ao tema
4. **Coesão e Coerência** — conectivos, progressão textual, fluidez entre parágrafos

REGRAS:
- Notas devem ser múltiplos de 50 (0, 50, 100, 150, 200, 250)
- Identifique o critério com pior desempenho e forneça UMA sugestão de reescrita de 2-3 linhas para nota máxima
- Seja rigoroso mas pedagógico

Retorne APENAS o JSON abaixo (sem texto adicional):
{
  "scores": {
    "comp1": [0-250],
    "comp2": [0-250],
    "comp3": [0-250],
    "comp4": [0-250]
  },
  "feedback": {
    "general": "Avaliação geral em 2-3 linhas",
    "comp1": "Feedback da Norma Culta",
    "comp2": "Feedback da Estrutura do Texto",
    "comp3": "Feedback do Desenvolvimento Argumentativo",
    "comp4": "Feedback da Coesão e Coerência"
  },
  "rewrite_suggestion": "Sugestão de como reescrever o trecho mais fraco para nota máxima"
}`;

  const candidates = [
    { id: MODEL,       label: "Sonnet" },
    { id: MODEL_HAIKU, label: "Haiku (fallback)" },
  ];

  let lastError: any;

  for (const { id: modelId, label } of candidates) {
    try {
      console.log(`[AI] Iniciando chamada de Redação - Modelo: ${label}`);

      const response = await anthropic.messages.create({
        model: modelId,
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      });

      const responseText =
        response.content[0].type === "text" ? response.content[0].text : "";

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Resposta da IA não contém JSON válido");
      }

      const result = JSON.parse(jsonMatch[0]);
      const total =
        result.scores.comp1 +
        result.scores.comp2 +
        result.scores.comp3 +
        result.scores.comp4;

      console.log(`✅ [AI] Redação corrigida por ${label} — Total: ${total}/1000`);
      return {
        scores: { ...result.scores, total },
        feedback: result.feedback,
        rewrite_suggestion: result.rewrite_suggestion || "",
      };
    } catch (error: any) {
      lastError = error;
      const status = error?.status ?? error?.statusCode ?? "?";
      const errType = error?.error?.type ?? error?.type ?? "unknown";
      const msg = error?.message ?? String(error);

      const isLast = modelId === candidates[candidates.length - 1].id;

      // Tenta fallback para qualquer erro, EXCETO erros permanentes de autenticação
      // (401/403 usam a mesma chave — tentar outro modelo não resolve)
      if (!isLast && !isPermanentAuthError(error)) {
        console.warn(`⚠️ [AI Engine] Redação ${label} falhou (status=${status} type=${errType}) — tentando fallback Haiku...`);
        continue;
      }

      console.error(`❌ [AI Engine] Erro na correção de redação — Modelo: ${label} status=${status} type=${errType}: ${msg}`);
      throw error;
    }
  }

  throw lastError;
}
