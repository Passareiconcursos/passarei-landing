import type { Express } from "express";
import { supabaseHttp } from "../lib/supabase-http";
import { nanoid } from "nanoid";
import { db } from "../db";
import { sql } from "drizzle-orm";

// ============================================
// SERVIÇOS COMPARTILHADOS COM TELEGRAM
// ============================================
import {
  generateEnhancedContent,
  generateExplanation,
} from "./telegram/ai-service";

// ============================================
// CONFIGURAÇÕES
// ============================================
const MAX_FREE_QUESTIONS = 21; // Questões grátis no minichat

// ============================================
// INTERFACE DE SESSÃO
// ============================================
interface MiniChatSession {
  id: string;
  odId: string;
  email: string;
  concurso?: string;
  cargo?: string;
  nivel?: string;
  facilidades?: string[];
  dificuldades?: string[];
  currentQuestion: number;
  score: number;
  completed: boolean;
  usedContentIds: string[];
  createdAt: Date;
}

// Armazenamento em memória (para MVP)
const sessions = new Map<string, MiniChatSession>();

// ============================================
// BUSCAR QUESTÃO DO BANCO (IGUAL AO TELEGRAM)
// ============================================
async function getQuestionFromDatabase(
  usedIds: string[] = [],
  examType?: string,
  dificuldades?: string[],
): Promise<any | null> {
  try {
    let result;

    // Tentar buscar por tipo de exame e dificuldades primeiro
    if (examType && dificuldades && dificuldades.length > 0) {
      const subjectFilter = dificuldades.join("|");

      if (usedIds.length > 0) {
        result = await db.execute(sql`
          SELECT * FROM "Content"
          WHERE "isActive" = true
            AND "id" NOT IN (${sql.join(usedIds.map((id) => sql`${id}`), sql`, `)})
            AND ("subject" ~* ${subjectFilter} OR "examType" = ${examType})
          ORDER BY RANDOM()
          LIMIT 1
        `);
      } else {
        result = await db.execute(sql`
          SELECT * FROM "Content"
          WHERE "isActive" = true
            AND ("subject" ~* ${subjectFilter} OR "examType" = ${examType})
          ORDER BY RANDOM()
          LIMIT 1
        `);
      }
    }

    // Fallback: buscar qualquer conteúdo ativo não usado
    if (!result || result.length === 0) {
      if (usedIds.length > 0) {
        result = await db.execute(sql`
          SELECT * FROM "Content"
          WHERE "isActive" = true
            AND "id" NOT IN (${sql.join(usedIds.map((id) => sql`${id}`), sql`, `)})
          ORDER BY RANDOM()
          LIMIT 1
        `);
      } else {
        result = await db.execute(sql`
          SELECT * FROM "Content"
          WHERE "isActive" = true
          ORDER BY RANDOM()
          LIMIT 1
        `);
      }
    }

    // Último fallback: qualquer conteúdo
    if (!result || result.length === 0) {
      result = await db.execute(sql`
        SELECT * FROM "Content"
        ORDER BY RANDOM()
        LIMIT 1
      `);
    }

    if (result && result.length > 0) {
      const content = result[0];
      console.log(`✅ [MiniChat] Questão encontrada: ${content.title}`);
      return content;
    }

    console.log(`❌ [MiniChat] Nenhuma questão no banco`);
    return null;
  } catch (error) {
    console.error(`❌ [MiniChat] Erro ao buscar questão:`, error);
    return null;
  }
}

// ============================================
// FORMATAR QUESTÃO PARA O FRONTEND
// ============================================
function formatQuestionForFrontend(content: any) {
  // O Content do banco tem: title, textContent, question, options (JSON), correctOption, explanation
  let options: string[] = [];

  try {
    if (typeof content.options === "string") {
      options = JSON.parse(content.options);
    } else if (Array.isArray(content.options)) {
      options = content.options;
    }
  } catch {
    options = ["Opção A", "Opção B", "Opção C", "Opção D"];
  }

  return {
    id: content.id,
    materia: content.subject || "Geral",
    tema: content.title,
    conteudo: content.textContent,
    pergunta: content.question || `Sobre "${content.title}", assinale a alternativa correta:`,
    opcoes: options,
    correta: content.correctOption || 0,
    explicacaoBase: content.explanation || "",
  };
}

// ============================================
// ROTAS DO MINICHAT
// ============================================
export function registerMiniChatRoutes(app: Express) {
  console.log("💬 Registrando rotas do Mini-Chat (integrado com IA)...");

  // ============================================
  // INICIAR SESSÃO - Captura email
  // ============================================
  app.post("/api/minichat/start", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Email inválido" });
      }

      // Verificar se já existe sessão ativa para este email
      const existingSession = Array.from(sessions.values()).find(
        (s) => s.email === email && !s.completed,
      );

      if (existingSession) {
        return res.json({
          success: true,
          sessionId: existingSession.id,
          currentQuestion: existingSession.currentQuestion,
        });
      }

      // Salvar lead no Supabase
      let odId = nanoid();
      try {
        const { data: existingLeads } = await supabaseHttp
          .from("Lead")
          .select("id", { email: email });

        if (existingLeads && existingLeads.length > 0) {
          odId = existingLeads[0].id;
          console.log("[MiniChat] Lead existente:", odId);
        } else {
          const { error } = await supabaseHttp.from("Lead").insert({
            id: odId,
            name: "Mini-Chat User",
            email: email,
            phone: "",
            examType: "",
            state: "",
            acceptedWhatsApp: false,
            status: "NOVO",
            source: "minichat",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          if (error) {
            console.error("[MiniChat] Erro ao criar lead:", error);
          } else {
            console.log("[MiniChat] Novo lead criado:", odId);
          }
        }
      } catch (dbError) {
        console.error("[MiniChat] Erro no banco (continuando):", dbError);
      }

      // Criar nova sessão
      const sessionId = `session_${nanoid()}`;
      const session: MiniChatSession = {
        id: sessionId,
        odId,
        email,
        currentQuestion: 0,
        score: 0,
        completed: false,
        usedContentIds: [],
        createdAt: new Date(),
      };
      sessions.set(sessionId, session);
      console.log("[MiniChat] Sessão criada:", sessionId);

      res.json({ success: true, sessionId });
    } catch (error) {
      console.error("[MiniChat] Erro:", error);
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // ============================================
  // ATUALIZAR ONBOARDING
  // ============================================
  app.post("/api/minichat/onboarding", async (req, res) => {
    try {
      const { sessionId, concurso, cargo, nivel, facilidades, dificuldades } =
        req.body;
      const session = sessions.get(sessionId);

      if (!session) {
        return res.status(404).json({ error: "Sessão não encontrada" });
      }

      if (concurso) session.concurso = concurso;
      if (cargo) session.cargo = cargo;
      if (nivel) session.nivel = nivel;
      if (facilidades) session.facilidades = facilidades;
      if (dificuldades) session.dificuldades = dificuldades;

      sessions.set(sessionId, session);

      // Atualizar lead no Supabase
      try {
        await supabaseHttp
          .from("Lead")
          .update(
            {
              examType: concurso || session.concurso,
              updatedAt: new Date().toISOString(),
            },
            { id: session.odId }
          );
      } catch (dbError) {
        console.error("[MiniChat] Erro ao atualizar lead:", dbError);
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // ============================================
  // BUSCAR QUESTÃO DO BANCO DE DADOS
  // ============================================
  app.get("/api/minichat/question/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = sessions.get(sessionId);

      if (!session) {
        return res.status(404).json({ error: "Sessão não encontrada" });
      }

      // Verificar limite de questões grátis
      if (session.currentQuestion >= MAX_FREE_QUESTIONS) {
        return res.json({
          finished: true,
          blocked: true,
          score: session.score,
          message: "Você completou suas 21 questões grátis!",
        });
      }

      // Buscar questão do banco de dados (mesmo banco do Telegram)
      const content = await getQuestionFromDatabase(
        session.usedContentIds,
        session.concurso,
        session.dificuldades,
      );

      if (!content) {
        return res.status(500).json({
          error: "Nenhuma questão disponível no momento",
        });
      }

      // Marcar como usada
      session.usedContentIds.push(content.id);
      sessions.set(sessionId, session);

      // Formatar para o frontend
      const question = formatQuestionForFrontend(content);

      // Gerar conteúdo enriquecido com IA (mesmo serviço do Telegram)
      let enhanced = null;
      try {
        enhanced = await generateEnhancedContent(
          question.tema,
          question.conteudo,
          session.concurso || "concurso policial",
        );
      } catch (aiError) {
        console.error("[MiniChat] Erro ao gerar conteúdo IA:", aiError);
      }

      res.json({
        success: true,
        questionNumber: session.currentQuestion + 1,
        totalQuestions: MAX_FREE_QUESTIONS,
        question: {
          id: question.id,
          materia: question.materia,
          tema: question.tema,
          pergunta: question.pergunta,
          opcoes: question.opcoes,
          // Conteúdo enriquecido pela IA
          pontosChave: enhanced?.keyPoints || null,
          exemplo: enhanced?.example || null,
          dica: enhanced?.tip || null,
        },
      });
    } catch (error) {
      console.error("[MiniChat] Erro ao buscar questão:", error);
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // ============================================
  // RESPONDER QUESTÃO COM EXPLICAÇÃO DA IA
  // ============================================
  app.post("/api/minichat/answer", async (req, res) => {
    try {
      const { sessionId, questionId, answer } = req.body;
      const session = sessions.get(sessionId);

      if (!session) {
        return res.status(404).json({ error: "Sessão não encontrada" });
      }

      // Buscar a questão original do banco
      const contentResult = await db.execute(sql`
        SELECT * FROM "Content" WHERE "id" = ${questionId} LIMIT 1
      `);

      if (!contentResult || contentResult.length === 0) {
        return res.status(404).json({ error: "Questão não encontrada" });
      }

      const content = contentResult[0] as any;
      const correctOption: number = Number(content.correctOption) || 0;
      const isCorrect = answer === correctOption;

      if (isCorrect) session.score++;
      session.currentQuestion++;
      sessions.set(sessionId, session);

      // Gerar explicação personalizada com IA (mesmo serviço do Telegram)
      let aiExplanation = null;
      try {
        let options: string[] = [];
        try {
          options =
            typeof content.options === "string"
              ? JSON.parse(content.options)
              : content.options || [];
        } catch {
          options = [];
        }

        const userAnswer: string = options[answer] || `Opção ${answer + 1}`;
        const correctAnswerText: string = options[correctOption] || `Opção ${correctOption + 1}`;

        const result = await generateExplanation(
          String(content.title || ""),
          String(content.textContent || ""),
          userAnswer,
          correctAnswerText,
          isCorrect,
        );
        aiExplanation = result.explanation;
      } catch (aiError) {
        console.error("[MiniChat] Erro ao gerar explicação IA:", aiError);
        aiExplanation = isCorrect
          ? "Parabéns! Você acertou!"
          : `A resposta correta era a opção ${correctOption + 1}. ${String(content.explanation || "")}`;
      }

      res.json({
        success: true,
        correct: isCorrect,
        correctAnswer: correctOption,
        // Explicação base do banco
        explicacaoBase: content.explanation || "",
        // Explicação personalizada da IA
        explicacaoIA: aiExplanation,
        score: session.score,
        currentQuestion: session.currentQuestion,
        hasMore: session.currentQuestion < MAX_FREE_QUESTIONS,
      });
    } catch (error) {
      console.error("[MiniChat] Erro ao responder:", error);
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // ============================================
  // TIRAR DÚVIDA COM IA
  // ============================================
  app.post("/api/minichat/doubt", async (req, res) => {
    try {
      const { sessionId, questionId, doubt } = req.body;
      const session = sessions.get(sessionId);

      if (!session) {
        return res.status(404).json({ error: "Sessão não encontrada" });
      }

      // Buscar contexto da questão
      const contentResult = await db.execute(sql`
        SELECT * FROM "Content" WHERE "id" = ${questionId} LIMIT 1
      `);

      if (!contentResult || contentResult.length === 0) {
        return res.status(404).json({ error: "Questão não encontrada" });
      }

      const content = contentResult[0];

      // Importar Anthropic dinamicamente para tirar dúvidas
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        messages: [
          {
            role: "user",
            content: `Você é um professor especialista em concursos policiais.

CONTEXTO:
- Tema: ${content.title}
- Conteúdo: ${content.textContent}
- Questão: ${content.question}

DÚVIDA DO ALUNO:
"${doubt}"

Responda de forma clara, didática e objetiva (máximo 5 linhas).
Use exemplos práticos quando possível.
Seja motivador!`,
          },
        ],
      });

      const aiResponse =
        response.content[0].type === "text"
          ? response.content[0].text
          : "Não consegui processar sua dúvida. Tente reformular.";

      res.json({
        success: true,
        response: aiResponse,
      });
    } catch (error) {
      console.error("[MiniChat] Erro ao processar dúvida:", error);
      res.status(500).json({
        error: "Erro ao processar dúvida",
        response: "Desculpe, não consegui processar sua dúvida no momento.",
      });
    }
  });

  // ============================================
  // FINALIZAR TESTE
  // ============================================
  app.post("/api/minichat/finish", async (req, res) => {
    try {
      const { sessionId } = req.body;
      const session = sessions.get(sessionId);

      if (!session) {
        return res.status(404).json({ error: "Sessão não encontrada" });
      }

      session.completed = true;
      sessions.set(sessionId, session);

      // Atualizar lead no Supabase com dados finais
      try {
        await supabaseHttp
          .from("Lead")
          .update(
            {
              status: "ENGAJADO",
              updatedAt: new Date().toISOString(),
            },
            { id: session.odId }
          );
      } catch (dbError) {
        console.error("[MiniChat] Erro ao finalizar lead:", dbError);
      }

      const total = session.currentQuestion;
      const percentage = total > 0 ? Math.round((session.score / total) * 100) : 0;

      console.log(
        `🎉 [MiniChat] Teste finalizado: ${sessionId} - ${session.score}/${total} (${percentage}%)`,
      );

      res.json({
        success: true,
        score: session.score,
        total: total,
        percentage: percentage,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // ============================================
  // ESTATÍSTICAS (Admin)
  // ============================================
  app.get("/api/minichat/stats", async (_req, res) => {
    const allSessions = Array.from(sessions.values());
    const completed = allSessions.filter((s) => s.completed);

    res.json({
      totalSessions: allSessions.length,
      completedSessions: completed.length,
      averageScore:
        completed.length > 0
          ? (
              completed.reduce((sum, s) => sum + s.score, 0) / completed.length
            ).toFixed(1)
          : 0,
    });
  });

  console.log("✅ Rotas do Mini-Chat registradas (com IA integrada)!");
}
