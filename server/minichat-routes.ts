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

// Cache de questões geradas por IA (para validar respostas)
const aiGeneratedQuestions = new Map<string, {
  correctOption: number;
  options: string[];
  title: string;
  textContent: string;
  explanation: string;
}>();

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

    console.log(`[MiniChat] Buscando questao - examType: ${examType}, dificuldades: ${dificuldades?.join(", ") || "nenhuma"}, usedIds: ${usedIds.length}`);

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
      console.log(`[MiniChat] Tentando fallback 1: qualquer conteudo ativo`);
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
      console.log(`[MiniChat] Tentando fallback 2: qualquer conteudo (incluindo inativos)`);
      result = await db.execute(sql`
        SELECT * FROM "Content"
        ORDER BY RANDOM()
        LIMIT 1
      `);
    }

    if (result && result.length > 0) {
      const content = result[0];
      console.log(`[MiniChat] Questao encontrada: ${content.title}`);
      return content;
    }

    console.log(`[MiniChat] Nenhuma questao no banco`);
    return null;
  } catch (error) {
    console.error(`[MiniChat] Erro ao buscar questao:`, error);
    return null;
  }
}

// ============================================
// GERAR QUESTÃO COM IA (FALLBACK QUANDO BANCO VAZIO)
// ============================================
async function generateQuestionWithAI(
  examType: string,
  dificuldades: string[],
  questionNumber: number,
): Promise<any> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  // Selecionar matéria aleatória das dificuldades ou usar padrão
  const materias = dificuldades.length > 0
    ? dificuldades
    : ["dir_constitucional", "dir_penal", "dir_administrativo"];
  const materiaEscolhida = materias[Math.floor(Math.random() * materias.length)];

  // Mapa de matérias para nomes legíveis
  const materiasMap: Record<string, string> = {
    "portugues": "Língua Portuguesa",
    "matematica": "Raciocínio Lógico e Matemático",
    "dir_constitucional": "Direito Constitucional",
    "dir_penal": "Direito Penal",
    "dir_processual_penal": "Direito Processual Penal",
    "dir_administrativo": "Direito Administrativo",
    "informatica": "Informática",
    "atualidades": "Atualidades e Conhecimentos Gerais",
  };

  const nomeMateria = materiasMap[materiaEscolhida] || "Direito Constitucional";
  const concursoLabel = examType || "concurso policial";

  console.log(`[MiniChat] Gerando questao com IA - Materia: ${nomeMateria}, Concurso: ${concursoLabel}`);

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Você é um especialista em elaboração de questões para concursos policiais brasileiros (${concursoLabel}).

TAREFA: Crie UMA questão de múltipla escolha sobre "${nomeMateria}" no estilo de provas de concursos como CESPE, FGV, VUNESP.

REQUISITOS:
1. Nível de dificuldade: médio
2. 4 alternativas (A, B, C, D)
3. Apenas UMA alternativa correta
4. Questão deve ser objetiva e direta
5. Base legal quando aplicável

RESPONDA EXATAMENTE NESTE FORMATO JSON:
{
  "tema": "Título curto do tema (ex: Princípio da Legalidade)",
  "conteudo": "Breve explicação do conceito (2-3 linhas)",
  "pergunta": "Enunciado completo da questão",
  "opcoes": ["A) texto da opção A", "B) texto da opção B", "C) texto da opção C", "D) texto da opção D"],
  "correta": 0,
  "explicacao": "Explicação de por que a alternativa correta está certa e as outras erradas"
}

Onde "correta" é o índice (0=A, 1=B, 2=C, 3=D).

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    // Extrair JSON da resposta
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Resposta da IA não contém JSON válido");
    }

    const questionData = JSON.parse(jsonMatch[0]);

    const questionId = `ai_generated_${Date.now()}_${questionNumber}`;

    // Salvar no cache para validar resposta depois
    aiGeneratedQuestions.set(questionId, {
      correctOption: questionData.correta,
      options: questionData.opcoes,
      title: questionData.tema,
      textContent: questionData.conteudo,
      explanation: questionData.explicacao,
    });

    console.log(`[MiniChat] Questao IA gerada e salva no cache: ${questionId}`);

    // Retornar no formato esperado pelo sistema
    return {
      id: questionId,
      title: questionData.tema,
      textContent: questionData.conteudo,
      question: questionData.pergunta,
      options: questionData.opcoes,
      correctOption: questionData.correta,
      explanation: questionData.explicacao,
      subject: nomeMateria,
      examType: examType,
      isAIGenerated: true,
    };
  } catch (error) {
    console.error(`[MiniChat] Erro ao gerar questao com IA:`, error);

    const fallbackId = `fallback_${Date.now()}`;

    // Salvar fallback no cache também
    aiGeneratedQuestions.set(fallbackId, {
      correctOption: 0,
      options: [
        "A) Ninguem sera obrigado a fazer ou deixar de fazer alguma coisa senao em virtude de lei",
        "B) A lei pode retroagir para beneficiar ou prejudicar o reu",
        "C) A administracao publica pode agir livremente, independente de lei",
        "D) O principio so se aplica em materia penal"
      ],
      title: "Principio da Legalidade",
      textContent: "O principio da legalidade e um dos pilares do Estado Democratico de Direito, garantindo que ninguem sera obrigado a fazer ou deixar de fazer algo senao em virtude de lei.",
      explanation: "O principio da legalidade esta previsto no Art. 5, II da CF/88 e estabelece que ninguem sera obrigado a fazer ou deixar de fazer alguma coisa senao em virtude de lei.",
    });

    // Retornar questão padrão de emergência
    return {
      id: fallbackId,
      title: "Principio da Legalidade",
      textContent: "O principio da legalidade e um dos pilares do Estado Democratico de Direito, garantindo que ninguem sera obrigado a fazer ou deixar de fazer algo senao em virtude de lei.",
      question: "Segundo o Art. 5 da Constituicao Federal, sobre o principio da legalidade, e correto afirmar que:",
      options: [
        "A) Ninguem sera obrigado a fazer ou deixar de fazer alguma coisa senao em virtude de lei",
        "B) A lei pode retroagir para beneficiar ou prejudicar o reu",
        "C) A administracao publica pode agir livremente, independente de lei",
        "D) O principio so se aplica em materia penal"
      ],
      correctOption: 0,
      explanation: "O principio da legalidade esta previsto no Art. 5, II da CF/88 e estabelece que ninguem sera obrigado a fazer ou deixar de fazer alguma coisa senao em virtude de lei.",
      subject: "Direito Constitucional",
      examType: examType || "geral",
      isAIGenerated: true,
    };
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
      console.log(`[MiniChat] GET /question/${sessionId}`);

      const session = sessions.get(sessionId);

      if (!session) {
        console.log(`[MiniChat] Sessao nao encontrada: ${sessionId}`);
        return res.status(404).json({ error: "Sessao nao encontrada" });
      }

      console.log(`[MiniChat] Sessao encontrada - currentQuestion: ${session.currentQuestion}, concurso: ${session.concurso}`);

      // Verificar limite de questões grátis
      if (session.currentQuestion >= MAX_FREE_QUESTIONS) {
        console.log(`[MiniChat] Limite de questoes atingido`);
        return res.json({
          finished: true,
          blocked: true,
          score: session.score,
          message: "Voce completou suas 21 questoes gratis!",
        });
      }

      // Buscar questão do banco de dados (mesmo banco do Telegram)
      let content = await getQuestionFromDatabase(
        session.usedContentIds,
        session.concurso,
        session.dificuldades,
      );

      // Se não encontrou no banco, gerar com IA
      if (!content) {
        console.log(`[MiniChat] Banco vazio - Gerando questao com IA...`);
        content = await generateQuestionWithAI(
          session.concurso || "concurso policial",
          session.dificuldades || [],
          session.currentQuestion + 1,
        );
      }

      // Marcar como usada
      session.usedContentIds.push(content.id);
      sessions.set(sessionId, session);

      // Formatar para o frontend
      const question = formatQuestionForFrontend(content);

      // Gerar conteúdo enriquecido com IA (mesmo serviço do Telegram)
      // Pular se a questão já foi gerada pela IA (já está enriquecida)
      let enhanced = null;
      if (!content.isAIGenerated) {
        try {
          enhanced = await generateEnhancedContent(
            question.tema,
            question.conteudo,
            session.concurso || "concurso policial",
          );
        } catch (aiError) {
          console.error("[MiniChat] Erro ao gerar conteudo IA:", aiError);
        }
      }

      console.log(`[MiniChat] Retornando questao: ${question.tema} (AI Generated: ${!!content.isAIGenerated})`);

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
          isAIGenerated: !!content.isAIGenerated,
        },
      });
    } catch (error) {
      console.error("[MiniChat] Erro ao buscar questao:", error);
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // ============================================
  // RESPONDER QUESTÃO COM EXPLICAÇÃO DA IA
  // ============================================
  app.post("/api/minichat/answer", async (req, res) => {
    try {
      const { sessionId, questionId, answer } = req.body;
      console.log(`[MiniChat] POST /answer - sessionId: ${sessionId}, questionId: ${questionId}, answer: ${answer}`);

      const session = sessions.get(sessionId);

      if (!session) {
        return res.status(404).json({ error: "Sessao nao encontrada" });
      }

      let content: any = null;
      let isAIGenerated = false;
      let cachedAIQuestion = null;

      // Verificar se é uma questão gerada por IA (começa com ai_generated_ ou fallback_)
      if (questionId.startsWith("ai_generated_") || questionId.startsWith("fallback_")) {
        isAIGenerated = true;
        cachedAIQuestion = aiGeneratedQuestions.get(questionId);
        console.log(`[MiniChat] Questao gerada por IA detectada: ${questionId}, cache encontrado: ${!!cachedAIQuestion}`);
      } else {
        // Buscar a questão original do banco
        const contentResult = await db.execute(sql`
          SELECT * FROM "Content" WHERE "id" = ${questionId} LIMIT 1
        `);

        if (contentResult && contentResult.length > 0) {
          content = contentResult[0] as any;
        }
      }

      // Se não encontrou no banco e não é IA, retornar erro
      if (!content && !isAIGenerated) {
        console.log(`[MiniChat] Questao nao encontrada: ${questionId}`);
        return res.status(404).json({ error: "Questao nao encontrada" });
      }

      // Obter dados da questão
      let correctOption: number = 0;
      let options: string[] = [];
      let title = "";
      let textContent = "";
      let explanation = "";

      if (content) {
        // Questão do banco de dados
        correctOption = Number(content.correctOption) || 0;
        try {
          options =
            typeof content.options === "string"
              ? JSON.parse(content.options)
              : content.options || [];
        } catch {
          options = [];
        }
        title = String(content.title || "");
        textContent = String(content.textContent || "");
        explanation = String(content.explanation || "");
      } else if (cachedAIQuestion) {
        // Questão gerada por IA - usar cache
        correctOption = cachedAIQuestion.correctOption;
        options = cachedAIQuestion.options;
        title = cachedAIQuestion.title;
        textContent = cachedAIQuestion.textContent;
        explanation = cachedAIQuestion.explanation;
        console.log(`[MiniChat] Usando cache IA - resposta correta: ${correctOption}`);
      } else {
        // Fallback - usar dados enviados pelo frontend (menos seguro, mas funciona)
        correctOption = req.body.correctAnswer !== undefined ? Number(req.body.correctAnswer) : 0;
        options = req.body.options || ["Opcao A", "Opcao B", "Opcao C", "Opcao D"];
        title = req.body.tema || "Questao";
        textContent = req.body.conteudo || "";
        explanation = req.body.explicacao || "Revise o conteudo para melhor compreensao.";
        console.log(`[MiniChat] Usando dados do frontend como fallback`);
      }

      const isCorrect = answer === correctOption;

      if (isCorrect) session.score++;
      session.currentQuestion++;
      sessions.set(sessionId, session);

      // Gerar explicação personalizada com IA (mesmo serviço do Telegram)
      let aiExplanation = null;
      try {
        const userAnswer: string = options[answer] || `Opcao ${answer + 1}`;
        const correctAnswerText: string = options[correctOption] || `Opcao ${correctOption + 1}`;

        const result = await generateExplanation(
          title,
          textContent,
          userAnswer,
          correctAnswerText,
          isCorrect,
        );
        aiExplanation = result.explanation;
      } catch (aiError) {
        console.error("[MiniChat] Erro ao gerar explicacao IA:", aiError);
        aiExplanation = isCorrect
          ? "Parabens! Voce acertou!"
          : `A resposta correta era a opcao ${correctOption + 1}. ${explanation}`;
      }

      console.log(`[MiniChat] Resposta processada - correto: ${isCorrect}, score: ${session.score}`);

      res.json({
        success: true,
        correct: isCorrect,
        correctAnswer: correctOption,
        // Explicação base do banco
        explicacaoBase: explanation,
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
