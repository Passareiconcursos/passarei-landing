import type { Express } from "express";
import { db } from "../db";
import { sql } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";
import {
  checkEssayAccess,
  consumeEssay,
  getEssayStatus,
  PLAN_LIMITS,
} from "./telegram/database";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============================================
// CORREÇÃO DE REDAÇÃO COM IA CLAUDE
// ============================================
interface EssayCorrectionResult {
  scores: {
    comp1: number;
    comp2: number;
    comp3: number;
    comp4: number;
    comp5: number;
    total: number;
  };
  feedback: {
    general: string;
    comp1: string;
    comp2: string;
    comp3: string;
    comp4: string;
    comp5: string;
  };
}

async function correctEssayWithAI(
  theme: string,
  text: string,
  examType: string = "concurso policial",
): Promise<EssayCorrectionResult> {
  const prompt = `Você é um corretor especialista em redações para concursos públicos, especialmente ${examType}.

TEMA DA REDAÇÃO: ${theme}

TEXTO DO CANDIDATO:
${text}

Corrija esta redação usando os 5 critérios do ENEM (0-200 pontos cada):

1. **Competência 1** - Domínio da norma culta da língua escrita
2. **Competência 2** - Compreensão da proposta e aplicação de conceitos
3. **Competência 3** - Seleção, relação e organização de argumentos
4. **Competência 4** - Conhecimento dos mecanismos linguísticos de coesão
5. **Competência 5** - Proposta de intervenção respeitando direitos humanos

IMPORTANTE:
- Seja rigoroso mas construtivo
- Dê notas múltiplas de 40 (0, 40, 80, 120, 160, 200)
- Adapte a avaliação para o contexto de concursos públicos
- Destaque pontos fortes e fracos

Responda EXATAMENTE neste formato JSON:
{
  "scores": {
    "comp1": [0-200],
    "comp2": [0-200],
    "comp3": [0-200],
    "comp4": [0-200],
    "comp5": [0-200]
  },
  "feedback": {
    "general": "Feedback geral sobre a redação (3-4 linhas)",
    "comp1": "Feedback específico da competência 1",
    "comp2": "Feedback específico da competência 2",
    "comp3": "Feedback específico da competência 3",
    "comp4": "Feedback específico da competência 4",
    "comp5": "Feedback específico da competência 5"
  }
}

Retorne APENAS o JSON, sem texto adicional.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Extrair JSON da resposta
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Resposta da IA não contém JSON válido");
    }

    const result = JSON.parse(jsonMatch[0]);

    // Calcular nota total
    const total =
      result.scores.comp1 +
      result.scores.comp2 +
      result.scores.comp3 +
      result.scores.comp4 +
      result.scores.comp5;

    return {
      scores: {
        comp1: result.scores.comp1,
        comp2: result.scores.comp2,
        comp3: result.scores.comp3,
        comp4: result.scores.comp4,
        comp5: result.scores.comp5,
        total: total,
      },
      feedback: {
        general: result.feedback.general,
        comp1: result.feedback.comp1,
        comp2: result.feedback.comp2,
        comp3: result.feedback.comp3,
        comp4: result.feedback.comp4,
        comp5: result.feedback.comp5,
      },
    };
  } catch (error) {
    console.error("[Essay] Erro na correção com IA:", error);
    throw error;
  }
}

// ============================================
// ROTAS DE REDAÇÃO
// ============================================
export function registerEssayRoutes(app: Express) {
  // ============================================
  // VERIFICAR STATUS DE REDAÇÕES DO USUÁRIO
  // ============================================
  app.get("/api/essays/status/:telegramId", async (req, res) => {
    try {
      const { telegramId } = req.params;
      const status = await getEssayStatus(telegramId);

      res.json({
        success: true,
        plan: status.plan,
        used: status.used,
        freeLimit: status.freeLimit,
        freeRemaining: Math.max(0, status.freeLimit - status.used),
        credits: status.credits,
        pricePerEssay: PLAN_LIMITS.PRICE_PER_ESSAY,
      });
    } catch (error) {
      console.error("[Essay] Erro ao buscar status:", error);
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // ============================================
  // VERIFICAR SE PODE ENVIAR REDAÇÃO
  // ============================================
  app.get("/api/essays/check-access/:telegramId", async (req, res) => {
    try {
      const { telegramId } = req.params;
      const access = await checkEssayAccess(telegramId);

      res.json({
        success: true,
        canAccess: access.canAccess,
        reason: access.reason,
        freeRemaining: access.freeRemaining,
        credits: access.credits,
        price: access.price,
        message: access.message,
      });
    } catch (error) {
      console.error("[Essay] Erro ao verificar acesso:", error);
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // ============================================
  // ENVIAR REDAÇÃO PARA CORREÇÃO
  // ============================================
  app.post("/api/essays/submit", async (req, res) => {
    try {
      const { telegramId, theme, text, prompt } = req.body;

      if (!telegramId || !theme || !text) {
        return res.status(400).json({
          error: "Campos obrigatórios: telegramId, theme, text",
        });
      }

      // Verificar acesso
      const access = await checkEssayAccess(telegramId);
      if (!access.canAccess) {
        return res.status(403).json({
          success: false,
          error: "Sem acesso",
          reason: access.reason,
          message: access.message,
        });
      }

      // Buscar userId do telegramId
      const userResult = await db.execute(sql`
        SELECT "id", "examType" FROM "User" WHERE "telegramId" = ${telegramId}
      `);

      if (userResult.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const user = userResult[0] as any;
      const wordCount = text.trim().split(/\s+/).length;

      // Criar registro da redação
      const essayResult = await db.execute(sql`
        INSERT INTO "essays" (
          "user_id",
          "theme",
          "prompt",
          "text",
          "word_count",
          "status",
          "was_free",
          "amount_paid",
          "submitted_at",
          "created_at",
          "updated_at"
        ) VALUES (
          ${user.id},
          ${theme},
          ${prompt || null},
          ${text},
          ${wordCount},
          'CORRECTING',
          ${access.reason === "veterano_free"},
          ${access.reason === "paid" ? PLAN_LIMITS.PRICE_PER_ESSAY : 0},
          NOW(),
          NOW(),
          NOW()
        )
        RETURNING *
      `);

      const essay = essayResult[0] as any;

      // Consumir redação (debitar créditos ou incrementar contador)
      await consumeEssay(telegramId, access.reason);

      // Corrigir com IA (async)
      console.log(`[Essay] Iniciando correção da redação ${essay.id}...`);

      try {
        const correction = await correctEssayWithAI(
          theme,
          text,
          user.examType || "concurso policial",
        );

        // Atualizar redação com correção
        await db.execute(sql`
          UPDATE "essays"
          SET
            "status" = 'CORRECTED',
            "score_1" = ${correction.scores.comp1},
            "score_2" = ${correction.scores.comp2},
            "score_3" = ${correction.scores.comp3},
            "score_4" = ${correction.scores.comp4},
            "score_5" = ${correction.scores.comp5},
            "total_score" = ${correction.scores.total},
            "feedback" = ${correction.feedback.general},
            "feedback_comp_1" = ${correction.feedback.comp1},
            "feedback_comp_2" = ${correction.feedback.comp2},
            "feedback_comp_3" = ${correction.feedback.comp3},
            "feedback_comp_4" = ${correction.feedback.comp4},
            "feedback_comp_5" = ${correction.feedback.comp5},
            "corrected_at" = NOW(),
            "updated_at" = NOW()
          WHERE "id" = ${essay.id}
        `);

        console.log(
          `[Essay] Redação ${essay.id} corrigida! Nota: ${correction.scores.total}`,
        );

        res.json({
          success: true,
          essayId: essay.id,
          correction: {
            scores: correction.scores,
            feedback: correction.feedback,
          },
          wasFree: access.reason === "veterano_free",
          amountPaid:
            access.reason === "paid" ? PLAN_LIMITS.PRICE_PER_ESSAY : 0,
        });
      } catch (correctionError) {
        // Marcar como erro
        await db.execute(sql`
          UPDATE "essays"
          SET "status" = 'ERROR', "updated_at" = NOW()
          WHERE "id" = ${essay.id}
        `);

        console.error("[Essay] Erro na correção:", correctionError);
        res.status(500).json({
          success: false,
          error: "Erro ao corrigir redação. Tente novamente.",
          essayId: essay.id,
        });
      }
    } catch (error) {
      console.error("[Essay] Erro ao submeter redação:", error);
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // ============================================
  // LISTAR REDAÇÕES DO USUÁRIO
  // ============================================
  app.get("/api/essays/list/:telegramId", async (req, res) => {
    try {
      const { telegramId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      // Buscar userId
      const userResult = await db.execute(sql`
        SELECT "id" FROM "User" WHERE "telegramId" = ${telegramId}
      `);

      if (userResult.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const user = userResult[0] as any;

      // Buscar redações
      const essays = await db.execute(sql`
        SELECT
          "id",
          "theme",
          "word_count",
          "status",
          "total_score",
          "was_free",
          "amount_paid",
          "submitted_at",
          "corrected_at"
        FROM "essays"
        WHERE "user_id" = ${user.id}
        ORDER BY "submitted_at" DESC
        LIMIT ${limit}
      `);

      res.json({
        success: true,
        essays: essays,
        total: essays.length,
      });
    } catch (error) {
      console.error("[Essay] Erro ao listar redações:", error);
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // ============================================
  // OBTER DETALHES DE UMA REDAÇÃO
  // ============================================
  app.get("/api/essays/:essayId", async (req, res) => {
    try {
      const { essayId } = req.params;
      const { telegramId } = req.query;

      // Buscar redação com verificação de propriedade
      const result = await db.execute(sql`
        SELECT e.*, u."telegramId"
        FROM "essays" e
        JOIN "User" u ON e."user_id" = u."id"
        WHERE e."id" = ${essayId}
      `);

      if (result.length === 0) {
        return res.status(404).json({ error: "Redação não encontrada" });
      }

      const essay = result[0] as any;

      // Verificar se o usuário é dono da redação
      if (telegramId && essay.telegramId !== telegramId) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      res.json({
        success: true,
        essay: {
          id: essay.id,
          theme: essay.theme,
          prompt: essay.prompt,
          text: essay.text,
          wordCount: essay.word_count,
          status: essay.status,
          scores: {
            comp1: essay.score_1,
            comp2: essay.score_2,
            comp3: essay.score_3,
            comp4: essay.score_4,
            comp5: essay.score_5,
            total: essay.total_score,
          },
          feedback: {
            general: essay.feedback,
            comp1: essay.feedback_comp_1,
            comp2: essay.feedback_comp_2,
            comp3: essay.feedback_comp_3,
            comp4: essay.feedback_comp_4,
            comp5: essay.feedback_comp_5,
          },
          wasFree: essay.was_free,
          amountPaid: essay.amount_paid,
          submittedAt: essay.submitted_at,
          correctedAt: essay.corrected_at,
        },
      });
    } catch (error) {
      console.error("[Essay] Erro ao buscar redação:", error);
      res.status(500).json({ error: "Erro interno" });
    }
  });

  console.log("[Essay] Rotas de redação registradas");
}
