import { useState, useRef, useEffect } from "react";
import { Send, Loader2, CheckCircle2, Trophy, Sparkles } from "lucide-react";

// Tipos
interface Message {
  id: string;
  type: "bot" | "user" | "question" | "options" | "offer-block";
  content: string;
  options?: { id: string; label: string }[];
  questionOptions?: string[];
  correctIndex?: number;
  timestamp: Date;
  optionType?: "single" | "multi";
  offerType?: "benefits" | "ppu" | "veterano" | "telegram";
}

interface ChatState {
  step:
    | "welcome"
    | "blocked"
    | "email"
    | "onboarding_concurso"
    | "onboarding_estado"
    | "onboarding_cargo"
    | "onboarding_nivel"
    | "onboarding_facilidade"
    | "onboarding_dificuldade"
    | "onboarding_tempo"
    | "onboarding_horario"
    | "resumo"
    | "questions"
    | "finished"
    | "offer";
  email: string;
  concurso: string;
  concursoLabel: string;
  estado: string;
  cargo: string;
  nivel: string;
  facilidade: string[];
  dificuldade: string[];
  tempoProva: string;
  horarioEstudo: string;
  currentQuestion: number;
  score: number;
  sessionId: string;
  retryCount: number;
  waitingForSelection: boolean;
}

// Dados dos concursos
const CONCURSOS = [
  { id: "PF", label: "🎯 PF - Polícia Federal", group: "Federal" },
  { id: "PRF", label: "🚓 PRF - Polícia Rodoviária Federal", group: "Federal" },
  {
    id: "PP_FEDERAL",
    label: "🔒 PP Federal - Polícia Penal Federal",
    group: "Federal",
  },
  {
    id: "PL_FEDERAL",
    label: "🏛️ PL Federal - Polícia Legislativa Federal",
    group: "Federal",
  },
  { id: "PM", label: "🚔 PM - Polícia Militar", group: "Estadual" },
  { id: "PC", label: "🕵️ PC - Polícia Civil", group: "Estadual" },
  {
    id: "PP_ESTADUAL",
    label: "🔐 PP - Polícia Penal Estadual",
    group: "Estadual",
  },
  {
    id: "PL_ESTADUAL",
    label: "📜 PL - Polícia Legislativa Estadual",
    group: "Estadual",
  },
  { id: "CBM", label: "🚒 CBM - Corpo de Bombeiros", group: "Estadual" },
  { id: "GM", label: "🛡️ GM - Guarda Municipal", group: "Municipal" },
];

const ESTADOS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

const CARGOS: Record<string, { id: string; label: string }[]> = {
  PF: [
    { id: "delegado", label: "👔 Delegado" },
    { id: "agente", label: "🎯 Agente" },
    { id: "escrivao", label: "📝 Escrivão" },
    { id: "perito", label: "🔬 Perito" },
  ],
  PRF: [{ id: "policial", label: "🚓 Policial Rodoviário Federal" }],
  PP_FEDERAL: [
    { id: "agente", label: "🔒 Agente Federal de Execução Penal" },
    { id: "especialista", label: "📋 Especialista Federal de Execução Penal" },
  ],
  PM: [
    { id: "soldado", label: "⭐ Soldado" },
    { id: "oficial", label: "🎖️ Oficial" },
  ],
  PC: [
    { id: "delegado", label: "👔 Delegado" },
    { id: "agente", label: "🕵️ Agente/Investigador" },
    { id: "escrivao", label: "📝 Escrivão" },
  ],
};

const NIVEIS = [
  { id: "iniciante", label: "🌱 Iniciante - Estou começando do zero" },
  { id: "basico", label: "📖 Básico - Conheço o básico das matérias" },
  { id: "intermediario", label: "📚 Intermediário - Já estudei bastante" },
  { id: "avancado", label: "🎯 Avançado - Falta pouco para dominar!" },
];

const MATERIAS = [
  { id: "portugues", label: "📝 Português" },
  { id: "matematica", label: "🔢 Matemática" },
  { id: "dir_constitucional", label: "⚖️ Dir. Constitucional" },
  { id: "dir_penal", label: "🔒 Dir. Penal" },
  { id: "dir_processual_penal", label: "📋 Dir. Proc. Penal" },
  { id: "dir_administrativo", label: "🏛️ Dir. Administrativo" },
  { id: "informatica", label: "💻 Informática" },
];

const TEMPO_PROVA = [
  { id: "menos3meses", label: "⚡ Menos de 3 meses" },
  { id: "3a6meses", label: "📅 3 a 6 meses" },
  { id: "mais1ano", label: "🗓️ Mais de 1 ano" },
];

const HORARIO_ESTUDO = [
  { id: "manha", label: "🌅 Manhã (6h - 12h)" },
  { id: "tarde", label: "☀️ Tarde (12h - 18h)" },
  { id: "noite", label: "🌙 Noite (18h - 22h)" },
  { id: "flexivel", label: "🔄 Horários variados" },
];

const QUESTOES_EXEMPLO = [
  {
    pergunta:
      "Segundo o Art. 5º da Constituição Federal, sobre o princípio da legalidade, é correto afirmar que:",
    opcoes: [
      "A) Ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei",
      "B) A lei pode retroagir para beneficiar ou prejudicar o réu",
      "C) A administração pública pode agir livremente",
      "D) O princípio só se aplica em matéria penal",
    ],
    correta: 0,
    explicacaoBreve: "O princípio da legalidade está no Art. 5º, II da CF/88.",
    explicacaoDetalhada:
      "O princípio da legalidade garante que nenhum cidadão será obrigado a fazer ou deixar de fazer algo, exceto se houver uma lei determinando.",
  },
  {
    pergunta:
      "Qual das hipóteses abaixo NÃO configura flagrante delito, conforme o CPP?",
    opcoes: [
      "A) Quando o agente está cometendo a infração",
      "B) Quando o agente acaba de cometê-la",
      "C) Quando o agente é encontrado 48 horas após o crime",
      "D) Quando o agente é perseguido logo após o crime",
    ],
    correta: 2,
    explicacaoBreve: "Flagrante exige imediatidade. 48h depois não configura.",
    explicacaoDetalhada:
      "O Art. 302 do CPP define as hipóteses de flagrante. 48 horas depois quebra o requisito de imediatidade temporal.",
  },
];

const VALID_EMAIL_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "icloud.com",
  "uol.com.br",
];

const BLOCK_KEY = "passarei_test_completed";
const BLOCK_DURATION = 30 * 24 * 60 * 60 * 1000;

const isUserBlocked = (): boolean => {
  try {
    const blockData = localStorage.getItem(BLOCK_KEY);
    if (!blockData) return false;
    const { timestamp } = JSON.parse(blockData);
    return Date.now() - timestamp < BLOCK_DURATION;
  } catch {
    return false;
  }
};

const blockUser = () => {
  try {
    localStorage.setItem(BLOCK_KEY, JSON.stringify({ timestamp: Date.now() }));
  } catch {}
};

export function MiniChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMaterias, setSelectedMaterias] = useState<string[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [chatState, setChatState] = useState<ChatState>({
    step: "welcome",
    email: "",
    concurso: "",
    concursoLabel: "",
    estado: "",
    cargo: "",
    nivel: "",
    facilidade: [],
    dificuldade: [],
    tempoProva: "",
    horarioEstudo: "",
    currentQuestion: 0,
    score: 0,
    sessionId: "",
    retryCount: 0,
    waitingForSelection: false,
  });

  const [actualScore, setActualScore] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedMaterias]);

  useEffect(() => {
    if (isUserBlocked()) {
      setIsBlocked(true);
      setChatState((prev) => ({ ...prev, step: "blocked" }));
      addBotMessage("👋 Olá! Você já utilizou suas **5 questões grátis**.");
      setTimeout(() => {
        showOfferForBlocked();
      }, 1500);
    } else if (messages.length === 0) {
      setTimeout(() => {
        addBotMessage("👋 Olá! Eu sou o Assistente Passarei!");
        setTimeout(() => {
          addBotMessage(
            "🎁 BÔNUS: Você tem **5 questões GRÁTIS** para testar agora!",
          );
          setTimeout(() => {
            addBotMessage("📧 Para começar, me diz seu melhor e-mail:");
            setChatState((prev) => ({ ...prev, step: "email" }));
          }, 1000);
        }, 1500);
      }, 500);
    }
  }, []);

  const addBotMessage = (
    content: string,
    options?: { id: string; label: string }[],
    optionType?: "single" | "multi",
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        type: options ? "options" : "bot",
        content,
        options,
        optionType,
        timestamp: new Date(),
      },
    ]);
  };

  const addOfferBlock = (
    offerType: "benefits" | "ppu" | "veterano" | "telegram",
    content: string,
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        type: "offer-block",
        content,
        offerType,
        timestamp: new Date(),
      },
    ]);
  };

  const addQuestionMessage = (
    content: string,
    questionOptions: string[],
    correctIndex: number,
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        type: "question",
        content,
        questionOptions,
        correctIndex,
        timestamp: new Date(),
      },
    ]);
  };

  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        type: "user",
        content,
        timestamp: new Date(),
      },
    ]);
  };

  const simulateTyping = async (callback: () => void, delay: number = 1000) => {
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, delay));
    setIsTyping(false);
    callback();
  };

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping || isBlocked) return;

    const userInput = inputValue.trim();
    setInputValue("");
    addUserMessage(userInput);

    if (chatState.step === "email") {
      if (isValidEmail(userInput)) {
        setChatState((prev) => ({ ...prev, email: userInput }));

        // CORREÇÃO GTM
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "onboarding_step",
          step_name: "email_captured",
          email: userInput,
        });

        try {
          await fetch("/api/minichat/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userInput }),
          });
        } catch (error) {
          console.error(error);
        }

        simulateTyping(() => {
          addBotMessage(`✅ Perfeito! Vamos criar seu plano.`);
          setTimeout(() => {
            addBotMessage(
              "📝 **PERGUNTA 1/8**\nQual concurso você está estudando?",
              CONCURSOS.map((c) => ({ id: c.id, label: c.label })),
              "single",
            );
            setChatState((prev) => ({
              ...prev,
              step: "onboarding_concurso",
              waitingForSelection: true,
            }));
          }, 1000);
        });
      } else {
        addBotMessage("❌ E-mail inválido. Tente novamente:");
      }
    } else if (chatState.step === "onboarding_estado") {
      const estadoUpper = userInput.toUpperCase();
      if (ESTADOS.includes(estadoUpper)) {
        setChatState((prev) => ({ ...prev, estado: estadoUpper }));
        simulateTyping(() => {
          addBotMessage(`✅ Estado: **${estadoUpper}**`);
          setTimeout(() => {
            const cargos = CARGOS[chatState.concurso] || CARGOS["PF"];
            addBotMessage(
              "📝 **PERGUNTA 3/8**\nQual cargo você pretende?",
              cargos.map((c) => ({ id: c.id, label: c.label })),
              "single",
            );
            setChatState((prev) => ({
              ...prev,
              step: "onboarding_cargo",
              waitingForSelection: true,
            }));
          }, 1000);
        });
      }
    }
  };

  const handleOptionClick = async (optionId: string, optionLabel: string) => {
    if (isTyping || !chatState.waitingForSelection) return;

    // CORREÇÃO GTM
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "onboarding_option_click",
      step_name: chatState.step,
      option: optionLabel,
    });

    switch (chatState.step) {
      case "onboarding_concurso":
        addUserMessage(optionLabel);
        const conc = CONCURSOS.find((c) => c.id === optionId);
        setChatState((prev) => ({
          ...prev,
          concurso: optionId,
          concursoLabel: optionLabel,
          waitingForSelection: false,
        }));
        simulateTyping(() => {
          if (conc?.group === "Federal") {
            setChatState((prev) => ({
              ...prev,
              estado: "NACIONAL",
              step: "onboarding_cargo",
            }));
            addBotMessage("🇧🇷 **Abrangência: NACIONAL**");
            setTimeout(() => {
              const cargos = CARGOS[optionId] || CARGOS["PF"];
              addBotMessage(
                "📝 **PERGUNTA 3/8**\nQual cargo pretende?",
                cargos.map((c) => ({ id: c.id, label: c.label })),
                "single",
              );
              setChatState((prev) => ({ ...prev, waitingForSelection: true }));
            }, 1000);
          } else {
            addBotMessage(
              "📝 **PERGUNTA 2/8**\nDigite a sigla do seu estado (ex: MG, SP):",
            );
            setChatState((prev) => ({ ...prev, step: "onboarding_estado" }));
          }
        });
        break;

      case "onboarding_cargo":
        addUserMessage(optionLabel);
        setChatState((prev) => ({
          ...prev,
          cargo: optionLabel,
          waitingForSelection: false,
        }));
        simulateTyping(() => {
          addBotMessage(
            "📝 **PERGUNTA 4/8**\nQual seu nível atual?",
            NIVEIS.map((n) => ({ id: n.id, label: n.label })),
            "single",
          );
          setChatState((prev) => ({
            ...prev,
            step: "onboarding_nivel",
            waitingForSelection: true,
          }));
        });
        break;

      case "onboarding_nivel":
        addUserMessage(optionLabel);
        setChatState((prev) => ({
          ...prev,
          nivel: optionId,
          waitingForSelection: false,
        }));
        simulateTyping(() => {
          addBotMessage(
            "📝 **PERGUNTA 5/8**\nEm que área tem FACILIDADE?",
            MATERIAS.map((m) => ({ id: m.id, label: m.label })),
            "multi",
          );
          setChatState((prev) => ({
            ...prev,
            step: "onboarding_facilidade",
            waitingForSelection: true,
          }));
        });
        break;

      case "onboarding_facilidade":
        if (optionId === "confirmar") {
          addUserMessage("Confirmado");
          setChatState((prev) => ({
            ...prev,
            facilidade: [...selectedMaterias],
            waitingForSelection: false,
          }));
          setSelectedMaterias([]);
          simulateTyping(() => {
            addBotMessage(
              "📝 **PERGUNTA 7/8**\nQuanto tempo até a prova?",
              TEMPO_PROVA.map((t) => ({ id: t.id, label: t.label })),
              "single",
            );
            setChatState((prev) => ({
              ...prev,
              step: "onboarding_tempo",
              waitingForSelection: true,
            }));
          });
        } else {
          setSelectedMaterias((prev) =>
            prev.includes(optionId)
              ? prev.filter((m) => m !== optionId)
              : [...prev, optionId],
          );
        }
        break;

      case "onboarding_tempo":
        addUserMessage(optionLabel);
        setChatState((prev) => ({
          ...prev,
          tempoProva: optionId,
          waitingForSelection: false,
        }));
        simulateTyping(() => {
          addBotMessage(
            "📝 **PERGUNTA 8/8**\nMelhor horário para estudar?",
            HORARIO_ESTUDO.map((h) => ({ id: h.id, label: h.label })),
            "single",
          );
          setChatState((prev) => ({
            ...prev,
            step: "onboarding_horario",
            waitingForSelection: true,
          }));
        });
        break;

      case "onboarding_horario":
        addUserMessage(optionLabel);
        setChatState((prev) => ({
          ...prev,
          horarioEstudo: optionId,
          waitingForSelection: false,
        }));
        simulateTyping(() => {
          showResumo();
        });
        break;
    }
  };

  const showResumo = () => {
    addBotMessage("🎉 **PERFIL CRIADO!**");
    setTimeout(() => {
      addBotMessage("🎁 Preparando suas **5 questões GRÁTIS**...");
      setTimeout(() => {
        startQuestions();
      }, 2000);
    }, 1500);
  };

  const startQuestions = () => {
    setChatState((prev) => ({
      ...prev,
      step: "questions",
      currentQuestion: 0,
    }));
    setActualScore(0);
    showQuestion(0);
  };

  const showQuestion = (index: number) => {
    const q = QUESTOES_EXEMPLO[index];
    if (!q) {
      finishQuiz();
      return;
    }
    addQuestionMessage(
      `📝 **QUESTÃO ${index + 1}/5**\n\n${q.pergunta}`,
      q.opcoes,
      q.correta,
    );
  };

  const handleQuestionAnswer = async (index: number) => {
    const q = QUESTOES_EXEMPLO[chatState.currentQuestion];
    const isCorrect = index === q.correta;
    addUserMessage(q.opcoes[index]);

    await wait(1000);
    if (isCorrect) {
      setActualScore((prev) => prev + 1);
      addBotMessage("✅ **CORRETO!**");
    } else {
      addBotMessage(`❌ **INCORRETO.** A correta era: ${q.opcoes[q.correta]}`);
    }

    await wait(2000);
    const next = chatState.currentQuestion + 1;
    if (next < 5 && QUESTOES_EXEMPLO[next]) {
      setChatState((prev) => ({ ...prev, currentQuestion: next }));
      showQuestion(next);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    blockUser();
    addBotMessage(`📊 **RESULTADO: ${actualScore}/5**`);

    // CORREÇÃO GTM
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "quiz_complete",
      score: actualScore,
    });

    await wait(2000);
    showOffer();
  };

  const showOffer = async () => {
    setChatState((prev) => ({ ...prev, step: "offer" }));
    addOfferBlock("benefits", "Plano Completo");
    await wait(1000);
    addOfferBlock("ppu", "Plano Mensal");
  };

  const showOfferForBlocked = () => {
    setChatState((prev) => ({ ...prev, step: "offer" }));
    addOfferBlock("ppu", "Seu acesso grátis expirou. Assine para continuar!");
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
      <div className="bg-[#18cb96] p-4 text-white font-bold flex justify-between items-center">
        <span>PASSAREI AI</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-[10px] uppercase">Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.type === "user" ? "justify-end" : "justify-start animate-in slide-in-from-left-2"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg shadow-sm ${m.type === "user" ? "bg-[#18cb96] text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"}`}
            >
              <p className="text-sm whitespace-pre-wrap">{m.content}</p>

              {m.type === "options" && m.options && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionClick(opt.id, opt.label)}
                      className={`text-xs p-2 rounded-md border transition-all ${selectedMaterias.includes(opt.id) ? "bg-[#18cb96] text-white border-[#18cb96]" : "bg-gray-50 text-gray-700 hover:border-[#18cb96]"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                  {m.optionType === "multi" && (
                    <button
                      onClick={() =>
                        handleOptionClick("confirmar", "Confirmar")
                      }
                      className="text-xs p-2 rounded-md bg-blue-600 text-white w-full font-bold"
                    >
                      Confirmar Seleção
                    </button>
                  )}
                </div>
              )}

              {m.type === "question" && m.questionOptions && (
                <div className="mt-3 space-y-2">
                  {m.questionOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuestionAnswer(i)}
                      className="w-full text-left text-xs p-3 rounded-md border border-gray-200 hover:bg-green-50 hover:border-green-500 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {m.type === "offer-block" && (
                <div className="mt-2">
                  <button
                    onClick={() => (window.location.href = "/checkout")}
                    className="w-full bg-[#18cb96] text-white py-3 rounded-md font-bold text-sm shadow-md"
                  >
                    QUERO MEU PLANO AGORA
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 p-2 rounded-full animate-bounce text-[10px]">
              ...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-3 border-t bg-white flex gap-2"
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            chatState.waitingForSelection
              ? "Escolha uma opção acima..."
              : "Digite sua resposta..."
          }
          disabled={chatState.waitingForSelection || isBlocked}
          className="flex-1 text-sm p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#18cb96]"
        />
        <button
          type="submit"
          disabled={chatState.waitingForSelection || isBlocked}
          className="bg-[#18cb96] text-white p-2 rounded-md disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
