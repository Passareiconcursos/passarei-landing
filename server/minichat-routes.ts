import type { Express } from "express";
import { supabaseHttp } from "../lib/supabase-http";
import { nanoid } from "nanoid";

// Questões pré-geradas para o MVP
const QUESTOES_BANCO = [
  {
    id: "q1",
    materia: "Direito Constitucional",
    pergunta: "Sobre o princípio da legalidade, é correto afirmar:",
    opcoes: [
      "Ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei",
      "A lei pode retroagir para beneficiar ou prejudicar o réu",
      "A administração pública pode agir livremente",
      "O princípio só se aplica em matéria penal",
    ],
    correta: 0,
    explicacao: "Art. 5º, II da CF/88 - princípio da legalidade.",
  },
  {
    id: "q2",
    materia: "Direito Processual Penal",
    pergunta: "Qual NÃO configura flagrante delito?",
    opcoes: [
      "Agente cometendo a infração",
      "Agente acabou de cometê-la",
      "Agente encontrado 48h após o crime",
      "Agente perseguido logo após",
    ],
    correta: 2,
    explicacao: "Flagrante exige imediatidade. 48h depois não configura.",
  },
  {
    id: "q3",
    materia: "Direito Administrativo",
    pergunta: "Atributos do Poder de Polícia:",
    opcoes: [
      "Apenas discricionariedade",
      "Discricionariedade, autoexecutoriedade e coercibilidade",
      "Apenas coercibilidade",
      "Tipicidade e legalidade",
    ],
    correta: 1,
    explicacao:
      "Atributos: Discricionariedade, Autoexecutoriedade, Coercibilidade.",
  },
  {
    id: "q4",
    materia: "Direito Penal",
    pergunta: "A legítima defesa requer:",
    opcoes: [
      "Agressão futura",
      "Uso desproporcional de meios",
      "Agressão injusta, atual ou iminente, meios moderados",
      "Autorização judicial",
    ],
    correta: 2,
    explicacao: "Art. 25 CP - legítima defesa.",
  },
  {
    id: "q5",
    materia: "Direito Constitucional",
    pergunta: "O Habeas Corpus protege:",
    opcoes: [
      "Direito à informação",
      "Direito de locomoção",
      "Direito de propriedade",
      "Direito ao contraditório",
    ],
    correta: 1,
    explicacao: "HC protege o direito de ir, vir e permanecer.",
  },
];

interface MiniChatSession {
  id: string;
  odId: string;
  email: string;
  concurso?: string;
  cargo?: string;
  nivel?: string;
  currentQuestion: number;
  score: number;
  completed: boolean;
  createdAt: Date;
}

// Armazenamento em memória (para MVP)
const sessions = new Map<string, MiniChatSession>();

export function registerMiniChatRoutes(app: Express) {
  console.log("💬 Registrando rotas do Mini-Chat...");

  // Iniciar teste - captura email
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
        // Verificar se já existe
        const { data: existingLead } = await supabaseHttp
          .from("Lead")
          .select("id")
          .eq("email", email)
          .single();

        if (existingLead) {
          odId = existingLead.id;
        } else {
          // Criar novo lead
          const { data: newLead, error } = await supabaseHttp
            .from("Lead")
            .insert({
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
            })
            .select()
            .single();

          if (error) {
            console.error("Erro ao criar lead:", error);
          } else if (newLead) {
            odId = newLead.id;
          }
        }
      } catch (dbError) {
        console.error("Erro no banco (continuando):", dbError);
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
        createdAt: new Date(),
      };

      sessions.set(sessionId, session);
      console.log(`✅ Sessão mini-chat: ${sessionId} - ${email}`);

      res.json({ success: true, sessionId });
    } catch (error) {
      console.error("Erro:", error);
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // Atualizar onboarding
  app.post("/api/minichat/onboarding", async (req, res) => {
    try {
      const { sessionId, concurso, cargo, nivel } = req.body;
      const session = sessions.get(sessionId);

      if (!session) {
        return res.status(404).json({ error: "Sessão não encontrada" });
      }

      if (concurso) session.concurso = concurso;
      if (cargo) session.cargo = cargo;
      if (nivel) session.nivel = nivel;

      sessions.set(sessionId, session);

      // Atualizar lead no Supabase
      try {
        await supabaseHttp
          .from("Lead")
          .update({
            examType: concurso || session.concurso,
            updatedAt: new Date().toISOString(),
          })
          .eq("id", session.odId);
      } catch (dbError) {
        console.error("Erro ao atualizar lead:", dbError);
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // Buscar questão
  app.get("/api/minichat/question/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = sessions.get(sessionId);

      if (!session) {
        return res.status(404).json({ error: "Sessão não encontrada" });
      }

      if (session.currentQuestion >= 5) {
        return res.json({ finished: true, score: session.score });
      }

      const question = QUESTOES_BANCO[session.currentQuestion];
      res.json({
        success: true,
        questionNumber: session.currentQuestion + 1,
        question: {
          id: question.id,
          materia: question.materia,
          pergunta: question.pergunta,
          opcoes: question.opcoes,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // Responder questão
  app.post("/api/minichat/answer", async (req, res) => {
    try {
      const { sessionId, questionId, answer } = req.body;
      const session = sessions.get(sessionId);

      if (!session) {
        return res.status(404).json({ error: "Sessão não encontrada" });
      }

      const question = QUESTOES_BANCO.find((q) => q.id === questionId);
      if (!question) {
        return res.status(404).json({ error: "Questão não encontrada" });
      }

      const isCorrect = answer === question.correta;
      if (isCorrect) session.score++;
      session.currentQuestion++;

      sessions.set(sessionId, session);

      res.json({
        success: true,
        correct: isCorrect,
        correctAnswer: question.correta,
        explicacao: question.explicacao,
        score: session.score,
        hasMore: session.currentQuestion < 5,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // Finalizar teste
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
          .update({
            status: "ENGAJADO",
            updatedAt: new Date().toISOString(),
          })
          .eq("id", session.odId);
      } catch (dbError) {
        console.error("Erro ao finalizar lead:", dbError);
      }

      console.log(`🎉 Teste finalizado: ${sessionId} - ${session.score}/5`);

      res.json({
        success: true,
        score: session.score,
        total: 5,
        percentage: Math.round((session.score / 5) * 100),
      });
    } catch (error) {
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // Stats (admin)
  app.get("/api/minichat/stats", async (req, res) => {
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

  console.log("✅ Rotas do Mini-Chat registradas!");
}
