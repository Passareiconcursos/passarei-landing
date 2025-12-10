import { useState, useRef, useEffect } from "react";
import { Send, Loader2, CheckCircle2, Trophy, Sparkles } from "lucide-react";

// Tipos
interface Message {
  id: string;
  type: "bot" | "user" | "question" | "result";
  content: string;
  options?: string[];
  correctIndex?: number;
  timestamp: Date;
}

interface ChatState {
  step:
    | "welcome"
    | "email"
    | "onboarding_concurso"
    | "onboarding_cargo"
    | "onboarding_nivel"
    | "questions"
    | "finished"
    | "offer";
  email: string;
  concurso: string;
  cargo: string;
  nivel: string;
  currentQuestion: number;
  score: number;
  sessionId: string;
}

// Dados dos concursos
const CONCURSOS = [
  { id: "PF", label: "🎯 Polícia Federal", federal: true },
  { id: "PRF", label: "🚓 PRF", federal: true },
  { id: "PM", label: "🚔 Polícia Militar", federal: false },
  { id: "PC", label: "🕵️ Polícia Civil", federal: false },
  { id: "CBM", label: "🚒 Bombeiros", federal: false },
  { id: "GM", label: "🛡️ Guarda Municipal", federal: false },
];

const CARGOS: Record<string, { id: string; label: string }[]> = {
  PF: [
    { id: "delegado", label: "Delegado" },
    { id: "agente", label: "Agente" },
    { id: "escrivao", label: "Escrivão" },
    { id: "perito", label: "Perito" },
  ],
  PRF: [{ id: "policial", label: "Policial Rodoviário" }],
  PM: [
    { id: "soldado", label: "Soldado" },
    { id: "oficial", label: "Oficial" },
  ],
  PC: [
    { id: "delegado", label: "Delegado" },
    { id: "agente", label: "Agente/Investigador" },
    { id: "escrivao", label: "Escrivão" },
  ],
  CBM: [
    { id: "soldado", label: "Soldado" },
    { id: "oficial", label: "Oficial" },
  ],
  GM: [{ id: "guarda", label: "Guarda Municipal" }],
};

const NIVEIS = [
  { id: "iniciante", label: "🌱 Iniciante - Estou começando" },
  { id: "intermediario", label: "📚 Intermediário - Já estudei algo" },
  { id: "avancado", label: "🎯 Avançado - Falta pouco!" },
];

// Questões de exemplo
const QUESTOES_EXEMPLO = [
  {
    pergunta:
      "Segundo o Art. 5º da Constituição Federal, sobre o princípio da legalidade, é correto afirmar que:",
    opcoes: [
      "A) Ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei",
      "B) A lei pode retroagir para beneficiar ou prejudicar o réu",
      "C) A administração pública pode agir livremente, independente de lei",
      "D) O princípio só se aplica em matéria penal",
    ],
    correta: 0,
    explicacao:
      "O princípio da legalidade está previsto no Art. 5º, II da CF/88 e garante que ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei.",
  },
  {
    pergunta: "Qual das hipóteses abaixo NÃO configura flagrante delito?",
    opcoes: [
      "A) Quando o agente está cometendo a infração penal",
      "B) Quando o agente acaba de cometê-la",
      "C) Quando o agente é encontrado 48 horas após o crime",
      "D) Quando o agente é perseguido logo após o crime",
    ],
    correta: 2,
    explicacao:
      "O flagrante delito exige imediatidade. Ser encontrado 48 horas depois não configura flagrante.",
  },
  {
    pergunta: "O Poder de Polícia possui como atributos:",
    opcoes: [
      "A) Apenas discricionariedade",
      "B) Discricionariedade, autoexecutoriedade e coercibilidade",
      "C) Apenas coercibilidade e autoexecutoriedade",
      "D) Tipicidade, legalidade e moralidade",
    ],
    correta: 1,
    explicacao:
      "Os atributos clássicos do Poder de Polícia são: Discricionariedade, Autoexecutoriedade e Coercibilidade.",
  },
  {
    pergunta: "A legítima defesa requer:",
    opcoes: [
      "A) Agressão futura e previsível",
      "B) Uso de qualquer meio, mesmo desproporcional",
      "C) Agressão injusta, atual ou iminente, com meios moderados",
      "D) Autorização judicial prévia",
    ],
    correta: 2,
    explicacao:
      "A legítima defesa exige: agressão injusta, atual ou iminente, usando moderadamente os meios necessários.",
  },
  {
    pergunta: "O Habeas Corpus protege:",
    opcoes: [
      "A) O direito de acesso à informação",
      "B) O direito de locomoção",
      "C) O direito de propriedade",
      "D) O direito ao contraditório",
    ],
    correta: 1,
    explicacao:
      "O Habeas Corpus protege o direito de locomoção. Pode ser preventivo ou liberatório.",
  },
];

export function MiniChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatState, setChatState] = useState<ChatState>({
    step: "welcome",
    email: "",
    concurso: "",
    cargo: "",
    nivel: "",
    currentQuestion: 0,
    score: 0,
    sessionId: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        addBotMessage("👋 Olá! Eu sou o Assistente Passarei!");
        setTimeout(() => {
          addBotMessage(
            "🎁 Você ganhou **5 questões GRÁTIS** para testar nossa plataforma!",
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
    options?: string[],
    correctIndex?: number,
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: options ? "question" : "bot",
      content,
      options,
      correctIndex,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const simulateTyping = async (callback: () => void, delay: number = 1000) => {
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, delay));
    setIsTyping(false);
    callback();
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userInput = inputValue.trim();
    setInputValue("");
    addUserMessage(userInput);

    if (chatState.step === "email") {
      if (isValidEmail(userInput)) {
        setChatState((prev) => ({ ...prev, email: userInput }));

        try {
          await fetch("/api/minichat/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userInput }),
          });
        } catch (error) {
          console.error("Erro ao salvar lead:", error);
        }

        simulateTyping(() => {
          addBotMessage(`✅ Perfeito, ${userInput.split("@")[0]}!`);
          setTimeout(() => {
            addBotMessage("🎯 Qual concurso você está estudando?");
            setChatState((prev) => ({ ...prev, step: "onboarding_concurso" }));
          }, 1000);
        });
      } else {
        simulateTyping(() => {
          addBotMessage("❌ E-mail inválido. Tenta novamente?");
        }, 500);
      }
    }
  };

  const handleOptionSelect = async (
    optionIndex: number,
    optionValue: string,
  ) => {
    if (isTyping) return;

    switch (chatState.step) {
      case "onboarding_concurso":
        addUserMessage(optionValue);
        const concursoId = CONCURSOS[optionIndex].id;
        setChatState((prev) => ({ ...prev, concurso: concursoId }));

        simulateTyping(() => {
          addBotMessage(`✅ ${optionValue}! Ótima escolha!`);
          setTimeout(() => {
            addBotMessage("💼 Qual cargo você pretende?");
            setChatState((prev) => ({ ...prev, step: "onboarding_cargo" }));
          }, 1000);
        });
        break;

      case "onboarding_cargo":
        addUserMessage(optionValue);
        setChatState((prev) => ({ ...prev, cargo: optionValue }));

        simulateTyping(() => {
          addBotMessage(`✅ ${optionValue}! Excelente!`);
          setTimeout(() => {
            addBotMessage("📊 Qual seu nível de conhecimento?");
            setChatState((prev) => ({ ...prev, step: "onboarding_nivel" }));
          }, 1000);
        });
        break;

      case "onboarding_nivel":
        addUserMessage(optionValue);
        setChatState((prev) => ({ ...prev, nivel: optionValue }));

        simulateTyping(() => {
          addBotMessage("🎉 Perfil criado com sucesso!");
          setTimeout(() => {
            addBotMessage("🚀 Vamos às suas **5 questões gratuitas**!");
            setTimeout(() => {
              startQuestions();
            }, 1500);
          }, 1000);
        });
        break;

      case "questions":
        handleAnswerQuestion(optionIndex);
        break;
    }
  };

  const startQuestions = () => {
    setChatState((prev) => ({
      ...prev,
      step: "questions",
      currentQuestion: 0,
    }));
    showQuestion(0);
  };

  const showQuestion = (index: number) => {
    const question = QUESTOES_EXEMPLO[index];
    simulateTyping(() => {
      addBotMessage(
        `📝 **QUESTÃO ${index + 1}/5**\n\n${question.pergunta}`,
        question.opcoes,
        question.correta,
      );
    }, 1500);
  };

  const handleAnswerQuestion = (selectedIndex: number) => {
    const currentQ = QUESTOES_EXEMPLO[chatState.currentQuestion];
    const isCorrect = selectedIndex === currentQ.correta;

    addUserMessage(currentQ.opcoes[selectedIndex]);

    simulateTyping(() => {
      if (isCorrect) {
        setChatState((prev) => ({ ...prev, score: prev.score + 1 }));
        addBotMessage(`✅ **CORRETO!** 🎉\n\n${currentQ.explicacao}`);
      } else {
        addBotMessage(
          `❌ **Incorreto!**\n\n✅ Resposta: ${currentQ.opcoes[currentQ.correta]}\n\n${currentQ.explicacao}`,
        );
      }

      setTimeout(() => {
        const nextQuestion = chatState.currentQuestion + 1;
        if (nextQuestion < 5) {
          setChatState((prev) => ({ ...prev, currentQuestion: nextQuestion }));
          showQuestion(nextQuestion);
        } else {
          finishQuiz();
        }
      }, 2500);
    }, 1000);
  };

  const finishQuiz = () => {
    setChatState((prev) => ({ ...prev, step: "finished" }));

    simulateTyping(() => {
      const finalScore = chatState.score;
      const percentage = Math.round((finalScore / 5) * 100);

      addBotMessage(
        `🏆 **RESULTADO FINAL**\n\n📊 Você acertou **${finalScore}/5** (${percentage}%)`,
      );

      setTimeout(() => {
        showOffer();
      }, 2000);
    }, 1500);
  };

  const showOffer = () => {
    setChatState((prev) => ({ ...prev, step: "offer" }));
    addBotMessage(
      `🎁 **OFERTA ESPECIAL**\n\nContinue estudando!\n\n💰 **Pay-per-use:** R$ 0,99/questão\n⭐ **Plano Veterano:** R$ 49,90/mês`,
    );
  };

  const handlePayment = (plan: "ppu" | "veterano") => {
    window.location.href =
      plan === "veterano" ? "/checkout?plan=veterano" : "/checkout?plan=ppu";
  };

  const handleTelegram = () => {
    window.open("https://t.me/PassareiBot", "_blank");
  };

  const renderOptions = () => {
    switch (chatState.step) {
      case "onboarding_concurso":
        return (
          <div className="grid grid-cols-2 gap-2 p-3">
            {CONCURSOS.map((concurso, idx) => (
              <button
                key={concurso.id}
                onClick={() => handleOptionSelect(idx, concurso.label)}
                className="bg-white hover:bg-green-50 border-2 border-gray-200 hover:border-[#18cb96] rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all"
              >
                {concurso.label}
              </button>
            ))}
          </div>
        );

      case "onboarding_cargo":
        const cargos = CARGOS[chatState.concurso] || [];
        return (
          <div className="grid grid-cols-2 gap-2 p-3">
            {cargos.map((cargo, idx) => (
              <button
                key={cargo.id}
                onClick={() => handleOptionSelect(idx, cargo.label)}
                className="bg-white hover:bg-green-50 border-2 border-gray-200 hover:border-[#18cb96] rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all"
              >
                {cargo.label}
              </button>
            ))}
          </div>
        );

      case "onboarding_nivel":
        return (
          <div className="flex flex-col gap-2 p-3">
            {NIVEIS.map((nivel, idx) => (
              <button
                key={nivel.id}
                onClick={() => handleOptionSelect(idx, nivel.label)}
                className="bg-white hover:bg-green-50 border-2 border-gray-200 hover:border-[#18cb96] rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all text-left"
              >
                {nivel.label}
              </button>
            ))}
          </div>
        );

      case "offer":
        return (
          <div className="flex flex-col gap-2 p-3">
            <button
              onClick={() => handlePayment("veterano")}
              className="bg-[#18cb96] hover:bg-[#14b584] text-white rounded-lg px-4 py-3 text-sm font-bold transition-all flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Plano Veterano - R$ 49,90/mês
            </button>
            <button
              onClick={() => handlePayment("ppu")}
              className="bg-white hover:bg-gray-50 border-2 border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all"
            >
              💰 Comprar créditos - R$ 0,99/questão
            </button>
            <button
              onClick={handleTelegram}
              className="bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-lg px-4 py-2 text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Continuar no Telegram
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const renderMessage = (message: Message) => {
    const isBot = message.type === "bot" || message.type === "question";

    return (
      <div
        key={message.id}
        className={`flex ${isBot ? "justify-start" : "justify-end"} mb-3`}
      >
        <div
          className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
            isBot
              ? "bg-white border border-gray-100 rounded-tl-sm"
              : "bg-[#18cb96] text-white rounded-tr-sm"
          }`}
        >
          <p
            className={`text-sm whitespace-pre-line leading-relaxed ${isBot ? "text-gray-800" : "text-white"}`}
          >
            {message.content
              .split("**")
              .map((part, i) =>
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
              )}
          </p>

          {message.type === "question" && message.options && (
            <div className="mt-3 space-y-2">
              {message.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx, option)}
                  disabled={chatState.step !== "questions" || isTyping}
                  className="w-full text-left bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-[#18cb96] rounded-lg px-3 py-2 text-xs text-gray-700 transition-all disabled:opacity-50"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          <p className="text-[10px] text-gray-400 text-right mt-1">
            {message.timestamp.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-[2.5rem] p-3 shadow-2xl">
        <div
          className="bg-gradient-to-b from-[#f0f4f0] to-[#e5ebe5] rounded-[2rem] overflow-hidden"
          style={{ height: "520px" }}
        >
          {/* Header */}
          <div className="bg-[#18cb96] text-white px-4 py-3 flex items-center gap-3 shadow-md">
            {/* LOGO: Substitua a div abaixo por uma imagem */}
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              {/* Para usar imagem: <img src="/logo.png" alt="Passarei" className="w-8 h-8 rounded-full" /> */}
              <span className="text-[#18cb96] font-bold text-lg">P</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-base">PASSAREI</p>
              <p className="text-xs opacity-90 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                online agora
              </p>
            </div>
            <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
              🎁 5 grátis
            </div>
          </div>

          {/* Mensagens */}
          <div className="h-[380px] overflow-y-auto p-4 space-y-1">
            {messages.map(renderMessage)}

            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Opções dinâmicas */}
          {renderOptions()}

          {/* Input */}
          {(chatState.step === "email" || chatState.step === "welcome") && (
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white border-t border-gray-200"
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="email"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Digite seu e-mail..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#18cb96]"
                  disabled={isTyping || chatState.step === "welcome"}
                />
                <button
                  type="submit"
                  disabled={
                    !inputValue.trim() ||
                    isTyping ||
                    chatState.step === "welcome"
                  }
                  className="bg-[#18cb96] hover:bg-[#14b584] disabled:bg-gray-300 text-white rounded-full p-2.5 transition-all"
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="flex justify-center mt-2">
          <div className="w-32 h-1 bg-white/30 rounded-full" />
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-green-500" />
          Seus dados estão seguros • Não enviamos spam
        </p>
      </div>
    </div>
  );
}

export default MiniChat;
