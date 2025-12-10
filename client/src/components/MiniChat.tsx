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
}

// Dados dos concursos - COMPLETO
const CONCURSOS = [
  // Federal
  { id: "PF", label: "PF - Polícia Federal", group: "Federal" },
  { id: "PRF", label: "PRF - Polícia Rodoviária Federal", group: "Federal" },
  {
    id: "PP_FEDERAL",
    label: "PP Federal - Polícia Penal Federal",
    group: "Federal",
  },
  {
    id: "PL_FEDERAL",
    label: "PL Federal - Polícia Legislativa Federal",
    group: "Federal",
  },
  // Estadual
  { id: "PM", label: "PM - Polícia Militar", group: "Estadual" },
  { id: "PC", label: "PC - Polícia Civil", group: "Estadual" },
  {
    id: "PP_ESTADUAL",
    label: "PP - Polícia Penal Estadual",
    group: "Estadual",
  },
  {
    id: "PL_ESTADUAL",
    label: "PL - Polícia Legislativa Estadual",
    group: "Estadual",
  },
  { id: "CBM", label: "CBM - Corpo de Bombeiros", group: "Estadual" },
  // Municipal
  { id: "GM", label: "GM - Guarda Municipal", group: "Municipal" },
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
    { id: "delegado", label: "Delegado" },
    { id: "agente", label: "Agente" },
    { id: "escrivao", label: "Escrivão" },
    { id: "perito", label: "Perito" },
  ],
  PRF: [{ id: "policial", label: "Policial Rodoviário Federal" }],
  PP_FEDERAL: [
    { id: "agente", label: "Agente Federal de Execução Penal" },
    { id: "especialista", label: "Especialista Federal de Execução Penal" },
  ],
  PL_FEDERAL: [{ id: "policial", label: "Policial Legislativo Federal" }],
  PM: [
    { id: "soldado", label: "Soldado" },
    { id: "oficial", label: "Oficial" },
  ],
  PC: [
    { id: "delegado", label: "Delegado" },
    { id: "agente", label: "Agente/Investigador" },
    { id: "escrivao", label: "Escrivão" },
    { id: "perito", label: "Perito" },
  ],
  PP_ESTADUAL: [
    { id: "agente", label: "Agente Penitenciário" },
    { id: "tecnico", label: "Técnico Penitenciário" },
  ],
  PL_ESTADUAL: [{ id: "policial", label: "Policial Legislativo" }],
  CBM: [
    { id: "soldado", label: "Soldado" },
    { id: "oficial", label: "Oficial" },
  ],
  GM: [
    { id: "guarda", label: "Guarda Municipal" },
    { id: "inspetor", label: "Inspetor" },
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
  { id: "matematica", label: "🔢 Matemática/Raciocínio Lógico" },
  { id: "dir_constitucional", label: "⚖️ Direito Constitucional" },
  { id: "dir_penal", label: "🔒 Direito Penal" },
  { id: "dir_processual_penal", label: "📋 Direito Processual Penal" },
  { id: "dir_administrativo", label: "🏛️ Direito Administrativo" },
  { id: "informatica", label: "💻 Informática" },
  { id: "atualidades", label: "🌍 Atualidades" },
];

const TEMPO_PROVA = [
  { id: "menos3meses", label: "⚡ Menos de 3 meses" },
  { id: "3a6meses", label: "📅 3 a 6 meses" },
  { id: "6a12meses", label: "📆 6 meses a 1 ano" },
  { id: "mais1ano", label: "🗓️ Mais de 1 ano" },
  { id: "indefinido", label: "❓ Ainda não sei" },
];

const HORARIO_ESTUDO = [
  { id: "manha", label: "🌅 Manhã (6h - 12h)" },
  { id: "tarde", label: "☀️ Tarde (12h - 18h)" },
  { id: "noite", label: "🌙 Noite (18h - 22h)" },
  { id: "madrugada", label: "🌃 Madrugada (22h - 6h)" },
  { id: "flexivel", label: "🔄 Horários variados" },
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
    explicacaoBreve: "O princípio da legalidade está no Art. 5º, II da CF/88.",
    explicacaoDetalhada:
      "O princípio da legalidade (Art. 5º, II, CF/88) é um dos pilares do Estado Democrático de Direito. Ele garante que nenhum cidadão será obrigado a fazer ou deixar de fazer algo, exceto se houver uma lei determinando. Para particulares: tudo que não é proibido, é permitido. Para a Administração Pública: só pode fazer o que a lei autoriza.",
  },
  {
    pergunta:
      "Qual das hipóteses abaixo NÃO configura flagrante delito, conforme o Código de Processo Penal?",
    opcoes: [
      "A) Quando o agente está cometendo a infração penal",
      "B) Quando o agente acaba de cometê-la",
      "C) Quando o agente é encontrado 48 horas após o crime com objetos do delito",
      "D) Quando o agente é perseguido logo após o crime",
    ],
    correta: 2,
    explicacaoBreve: "Flagrante exige imediatidade. 48h depois não configura.",
    explicacaoDetalhada:
      "O Art. 302 do CPP define as hipóteses de flagrante delito: I - está cometendo; II - acaba de cometer; III - é perseguido logo após; IV - é encontrado LOGO DEPOIS com instrumentos. A expressão 'logo depois' exige imediatidade temporal. 48 horas depois quebra esse requisito, não configurando flagrante.",
  },
  {
    pergunta:
      "O Poder de Polícia da Administração Pública possui como atributos:",
    opcoes: [
      "A) Apenas discricionariedade",
      "B) Discricionariedade, autoexecutoriedade e coercibilidade",
      "C) Apenas coercibilidade e autoexecutoriedade",
      "D) Tipicidade, legalidade e moralidade",
    ],
    correta: 1,
    explicacaoBreve:
      "Atributos: Discricionariedade, Autoexecutoriedade, Coercibilidade (DAC).",
    explicacaoDetalhada:
      "O Poder de Polícia possui 3 atributos clássicos (DAC): 1) DISCRICIONARIEDADE: margem de escolha quanto ao momento e meio de atuação; 2) AUTOEXECUTORIEDADE: executar decisões sem ordem judicial; 3) COERCIBILIDADE: impor medidas pela força se necessário. Memorize: DAC = Discricionariedade, Autoexecutoriedade, Coercibilidade.",
  },
  {
    pergunta: "A legítima defesa, como excludente de ilicitude, requer:",
    opcoes: [
      "A) Agressão futura e previsível",
      "B) Uso de qualquer meio disponível, mesmo desproporcional",
      "C) Agressão injusta, atual ou iminente, usando meios moderados e necessários",
      "D) Autorização judicial prévia para sua configuração",
    ],
    correta: 2,
    explicacaoBreve:
      "Legítima defesa: agressão injusta + atual/iminente + meios moderados.",
    explicacaoDetalhada:
      "O Art. 25 do Código Penal define legítima defesa. Requisitos: 1) Agressão INJUSTA (ilícita); 2) ATUAL ou IMINENTE (não futura nem passada); 3) A direito PRÓPRIO ou de TERCEIRO; 4) Uso MODERADO dos meios NECESSÁRIOS. O excesso é punível! Não existe legítima defesa contra agressão futura ou usando meios desproporcionais.",
  },
  {
    pergunta: "O Habeas Corpus é remédio constitucional que protege:",
    opcoes: [
      "A) O direito de acesso à informação pública",
      "B) O direito de locomoção - ir, vir e permanecer",
      "C) O direito de propriedade privada",
      "D) O direito ao contraditório em processo administrativo",
    ],
    correta: 1,
    explicacaoBreve:
      "HC protege o direito de locomoção (ir, vir e permanecer).",
    explicacaoDetalhada:
      "O Habeas Corpus (Art. 5º, LXVIII, CF) protege o direito de LOCOMOÇÃO - ir, vir e permanecer. Pode ser: PREVENTIVO (ameaça de prisão) ou LIBERATÓRIO/REPRESSIVO (já está preso). É GRATUITO e não precisa de advogado. Os outros remédios: Habeas Data (informações pessoais), Mandado de Segurança (direito líquido e certo), Ação Popular (patrimônio público).",
  },
];

export function MiniChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMaterias, setSelectedMaterias] = useState<string[]>([]);
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
  });

  const [actualScore, setActualScore] = useState(0); // Score real separado
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    // Pequeno delay para garantir que o DOM atualizou
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        addBotMessage("👋 Olá! Eu sou o Assistente Passarei!");
        setTimeout(() => {
          addBotMessage(
            "🎯 Vou criar um plano de estudos personalizado para você em 8 perguntas rápidas!",
          );
          setTimeout(() => {
            addBotMessage(
              "🎁 BÔNUS: Você tem **5 questões GRÁTIS** para testar agora!",
            );
            setTimeout(() => {
              addBotMessage("📧 Para começar, me diz seu melhor e-mail:");
              setChatState((prev) => ({ ...prev, step: "email" }));
            }, 1000);
          }, 1500);
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
      id: Date.now().toString() + Math.random(),
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
      id: Date.now().toString() + Math.random(),
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

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidEstado = (estado: string) => {
    return ESTADOS.includes(estado.toUpperCase());
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
          addBotMessage(
            `✅ Perfeito, ${userInput.split("@")[0]}! Vamos criar seu plano de estudos.`,
          );
          setTimeout(() => {
            addBotMessage(
              "📝 **PERGUNTA 1/8** 🎯\n\nQual concurso você está estudando?",
            );
            setChatState((prev) => ({ ...prev, step: "onboarding_concurso" }));
          }, 1000);
        });
      } else {
        simulateTyping(() => {
          addBotMessage(
            "❌ E-mail inválido. Por favor, digite um e-mail válido:",
          );
        }, 500);
      }
    } else if (chatState.step === "onboarding_estado") {
      if (isValidEstado(userInput)) {
        const estadoUpper = userInput.toUpperCase();
        setChatState((prev) => ({ ...prev, estado: estadoUpper }));

        simulateTyping(() => {
          addBotMessage(`✅ Estado: **${estadoUpper}**`);
          setTimeout(() => {
            addBotMessage(
              "📝 **PERGUNTA 3/8** 👮\n\nQual cargo você pretende?",
            );
            setChatState((prev) => ({ ...prev, step: "onboarding_cargo" }));
          }, 1000);
        });
      } else {
        simulateTyping(() => {
          addBotMessage(
            "❌ Estado inválido. Digite a sigla do estado (ex: MG, SP, RJ):",
          );
        }, 500);
      }
    }
  };

  const handleOptionSelect = async (
    optionIndex: number,
    optionValue: string,
    optionId?: string,
  ) => {
    if (isTyping) return;

    switch (chatState.step) {
      case "onboarding_concurso":
        addUserMessage(optionValue);
        const concursoSelecionado = CONCURSOS[optionIndex];
        setChatState((prev) => ({
          ...prev,
          concurso: concursoSelecionado.id,
          concursoLabel: concursoSelecionado.label,
        }));

        // Verifica se é federal (não precisa de estado)
        const isFederal = concursoSelecionado.group === "Federal";

        simulateTyping(() => {
          addBotMessage(`✅ ${optionValue}`);
          setTimeout(() => {
            if (isFederal) {
              setChatState((prev) => ({ ...prev, estado: "NACIONAL" }));
              addBotMessage(
                "📝 **PERGUNTA 2/8** 📍\n\n🇧🇷 **Abrangência: NACIONAL**\n\nConcursos federais têm validade em todo o território brasileiro!",
              );
              setTimeout(() => {
                addBotMessage(
                  "📝 **PERGUNTA 3/8** 👮\n\nQual cargo você pretende?",
                );
                setChatState((prev) => ({ ...prev, step: "onboarding_cargo" }));
              }, 1500);
            } else {
              addBotMessage(
                "📝 **PERGUNTA 2/8** 📍\n\nDigite o estado (ex: MG, SP, RS):",
              );
              setChatState((prev) => ({ ...prev, step: "onboarding_estado" }));
            }
          }, 1000);
        });
        break;

      case "onboarding_cargo":
        addUserMessage(optionValue);
        setChatState((prev) => ({ ...prev, cargo: optionValue }));

        simulateTyping(() => {
          addBotMessage(`✅ Cargo: **${optionValue}**`);
          setTimeout(() => {
            addBotMessage(
              "📝 **PERGUNTA 4/8** 📊\n\nQual seu nível de conhecimento nas matérias do concurso?",
            );
            setChatState((prev) => ({ ...prev, step: "onboarding_nivel" }));
          }, 1000);
        });
        break;

      case "onboarding_nivel":
        addUserMessage(optionValue);
        setChatState((prev) => ({ ...prev, nivel: optionId || optionValue }));

        simulateTyping(() => {
          addBotMessage(`✅ Nível: **${optionValue}**`);
          setTimeout(() => {
            addBotMessage(
              "📝 **PERGUNTA 5/8** 💚\n\nEm qual área você **JÁ TEM FACILIDADE**?\n\n_(Pode escolher várias)_",
            );
            setChatState((prev) => ({
              ...prev,
              step: "onboarding_facilidade",
            }));
          }, 1000);
        });
        break;

      case "onboarding_facilidade":
        // Toggle seleção
        if (optionId === "confirmar") {
          if (selectedMaterias.length === 0) {
            addBotMessage("⚠️ Selecione pelo menos uma matéria!");
            return;
          }
          addUserMessage(
            selectedMaterias
              .map((m) => MATERIAS.find((mat) => mat.id === m)?.label)
              .join(", "),
          );
          setChatState((prev) => ({
            ...prev,
            facilidade: [...selectedMaterias],
          }));
          setSelectedMaterias([]);

          simulateTyping(() => {
            addBotMessage(`✅ Facilidades registradas!`);
            setTimeout(() => {
              addBotMessage(
                "📝 **PERGUNTA 6/8** 🎯\n\nEm qual área você **TEM MAIS DIFICULDADE**?\n\nVamos focar mais tempo nela!\n\n_(Pode escolher várias)_",
              );
              setChatState((prev) => ({
                ...prev,
                step: "onboarding_dificuldade",
              }));
            }, 1000);
          });
        } else if (optionId) {
          setSelectedMaterias((prev) =>
            prev.includes(optionId)
              ? prev.filter((m) => m !== optionId)
              : [...prev, optionId],
          );
        }
        break;

      case "onboarding_dificuldade":
        if (optionId === "confirmar") {
          if (selectedMaterias.length === 0) {
            addBotMessage("⚠️ Selecione pelo menos uma matéria!");
            return;
          }
          addUserMessage(
            selectedMaterias
              .map((m) => MATERIAS.find((mat) => mat.id === m)?.label)
              .join(", "),
          );
          setChatState((prev) => ({
            ...prev,
            dificuldade: [...selectedMaterias],
          }));
          setSelectedMaterias([]);

          simulateTyping(() => {
            addBotMessage(`✅ Vamos focar nessas áreas!`);
            setTimeout(() => {
              addBotMessage(
                "📝 **PERGUNTA 7/8** 📅\n\nQuanto tempo você tem até a prova?",
              );
              setChatState((prev) => ({ ...prev, step: "onboarding_tempo" }));
            }, 1000);
          });
        } else if (optionId) {
          setSelectedMaterias((prev) =>
            prev.includes(optionId)
              ? prev.filter((m) => m !== optionId)
              : [...prev, optionId],
          );
        }
        break;

      case "onboarding_tempo":
        addUserMessage(optionValue);
        setChatState((prev) => ({
          ...prev,
          tempoProva: optionId || optionValue,
        }));

        simulateTyping(() => {
          addBotMessage(`✅ Tempo até a prova: **${optionValue}**`);
          setTimeout(() => {
            addBotMessage(
              "📝 **PERGUNTA 8/8** ⏰\n\nQuando você **PREFERE ESTUDAR**?\n\nEnviaremos conteúdo automaticamente nesses horários!",
            );
            setChatState((prev) => ({ ...prev, step: "onboarding_horario" }));
          }, 1000);
        });
        break;

      case "onboarding_horario":
        addUserMessage(optionValue);
        setChatState((prev) => ({
          ...prev,
          horarioEstudo: optionId || optionValue,
        }));

        simulateTyping(() => {
          showResumo();
        });
        break;

      case "questions":
        handleAnswerQuestion(optionIndex);
        break;
    }
  };

  const showResumo = () => {
    setChatState((prev) => ({ ...prev, step: "resumo" }));

    const state = chatState;
    const facilidadeLabels = state.facilidade
      .map((f) => MATERIAS.find((m) => m.id === f)?.label || f)
      .join(", ");
    const dificuldadeLabels = state.dificuldade
      .map((d) => MATERIAS.find((m) => m.id === d)?.label || d)
      .join(", ");

    addBotMessage("🎉 **PERFIL CRIADO COM SUCESSO!**");

    setTimeout(() => {
      addBotMessage(`📋 **RESUMO DO SEU PLANO DE ESTUDOS:**

🎯 Concurso: **${state.concursoLabel}**
📍 Local: **${state.estado}**
👮 Cargo: **${state.cargo}**
📊 Nível: **${state.nivel}**
💚 Facilidades: ${facilidadeLabels || "Nenhuma selecionada"}
🎯 Focar em: ${dificuldadeLabels || "Nenhuma selecionada"}
📅 Tempo: **${state.tempoProva}**
⏰ Horário: **${state.horarioEstudo}**

━━━━━━━━━━━━━━━━`);

      setTimeout(() => {
        addBotMessage(
          "🎁 Você tem **5 questões GRÁTIS** agora!\n\n⏳ Preparando suas questões personalizadas...",
        );
        setTimeout(() => {
          startQuestions();
        }, 2000);
      }, 2000);
    }, 1500);
  };

  const startQuestions = () => {
    setChatState((prev) => ({
      ...prev,
      step: "questions",
      currentQuestion: 0,
      retryCount: 0,
    }));
    setActualScore(0);

    addBotMessage(
      "🚀 **Começando suas questões!**\n\n📚 Leia com atenção e escolha a alternativa correta.",
    );

    setTimeout(() => {
      showQuestion(0);
    }, 2000);
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

  const handleAnswerQuestion = async (selectedIndex: number) => {
    const currentQ = QUESTOES_EXEMPLO[chatState.currentQuestion];
    const isCorrect = selectedIndex === currentQ.correta;

    addUserMessage(currentQ.opcoes[selectedIndex]);
    setIsTyping(true);

    await wait(1000);
    setIsTyping(false);

    if (isCorrect) {
      // ACERTOU
      setActualScore((prev) => prev + 1);
      addBotMessage(`✅ **CORRETO!** 🎉\n\n${currentQ.explicacaoBreve}`);

      await wait(8000); // Aguarda 8 segundos

      addBotMessage("📚 Próxima questão chegando...");

      await wait(4000); // Aguarda 4 segundos

      const nextQuestion = chatState.currentQuestion + 1;
      if (nextQuestion < 5) {
        setChatState((prev) => ({
          ...prev,
          currentQuestion: nextQuestion,
          retryCount: 0,
        }));
        showQuestion(nextQuestion);
      } else {
        finishQuiz();
      }
    } else {
      // ERROU
      const retryCount = chatState.retryCount;

      if (retryCount === 0) {
        // Primeira tentativa errada - explicação breve + retry
        addBotMessage(
          `❌ **Incorreto!**\n\n💡 Dica: ${currentQ.explicacaoBreve}`,
        );

        await wait(12000); // Aguarda 12 segundos

        addBotMessage(
          "🔄 **Vamos tentar novamente?**\n\nReleia a questão com atenção:",
        );
        setChatState((prev) => ({ ...prev, retryCount: 1 }));

        await wait(3000);

        // Mostra a mesma questão novamente
        addBotMessage(
          `📝 **QUESTÃO ${chatState.currentQuestion + 1}/5** _(2ª tentativa)_\n\n${currentQ.pergunta}`,
          currentQ.opcoes,
          currentQ.correta,
        );
      } else {
        // Segunda tentativa errada - explicação detalhada + próxima
        addBotMessage(
          `❌ **Ainda não foi dessa vez...**\n\n✅ **Resposta correta:** ${currentQ.opcoes[currentQ.correta]}\n\n📚 **Explicação completa:**\n${currentQ.explicacaoDetalhada}`,
        );

        await wait(12000); // Aguarda 12 segundos

        const nextQuestion = chatState.currentQuestion + 1;
        if (nextQuestion < 5) {
          addBotMessage("📚 Vamos para a próxima questão...");

          await wait(4000);

          setChatState((prev) => ({
            ...prev,
            currentQuestion: nextQuestion,
            retryCount: 0,
          }));
          showQuestion(nextQuestion);
        } else {
          finishQuiz();
        }
      }
    }
  };

  const finishQuiz = async () => {
    setChatState((prev) => ({ ...prev, step: "finished" }));

    // Usa actualScore que foi incrementado corretamente
    const finalScore = actualScore;
    const percentage = Math.round((finalScore / 5) * 100);

    let emoji = "🎉";
    let message = "";

    if (percentage >= 80) {
      emoji = "🏆";
      message = "Excelente! Você está muito bem preparado!";
    } else if (percentage >= 60) {
      emoji = "👏";
      message = "Muito bom! Continue assim!";
    } else if (percentage >= 40) {
      emoji = "💪";
      message = "Bom começo! Com o Passarei você vai evoluir rapidamente!";
    } else {
      emoji = "📚";
      message =
        "Não desanime! Todo expert já foi iniciante. Vamos juntos nessa jornada!";
    }

    await wait(1500);

    addBotMessage(
      `${emoji} **RESULTADO FINAL**\n\n📊 Você acertou **${finalScore}/5** questões (**${percentage}%**)\n\n${message}`,
    );

    await wait(3000);

    showOffer();
  };

  const showOffer = async () => {
    setChatState((prev) => ({ ...prev, step: "offer" }));

    addBotMessage(
      `💡 **O que você ganha com o Passarei:**\n\n✅ Questões personalizadas para **${chatState.concursoLabel}**\n✅ Revisão inteligente SM2 que reforça seus pontos fracos\n✅ Explicações detalhadas por IA\n✅ Estude onde quiser: Web ou Telegram`,
    );

    await wait(4000);

    addBotMessage(
      `💰 **PLANO PAY-PER-USE**\n\nR$ 0,99 por questão\n• Pague só o que usar\n• Sem mensalidade\n• Ideal para testar`,
    );

    await wait(3000);

    addBotMessage(
      `⭐ **PLANO VETERANO** _(Mais popular)_\n\nR$ 49,90/mês\n• 10 questões por dia\n• Correção de redações com IA\n• Todas as apostilas\n• Revisão inteligente SM2\n• Suporte prioritário`,
    );

    await wait(2000);
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
          <div className="flex flex-col gap-1 p-2 max-h-[200px] overflow-y-auto">
            <p className="text-xs text-gray-500 font-semibold px-2 py-1">
              Federal
            </p>
            {CONCURSOS.filter((c) => c.group === "Federal").map(
              (concurso, idx) => (
                <button
                  key={concurso.id}
                  onClick={() =>
                    handleOptionSelect(
                      CONCURSOS.findIndex((c) => c.id === concurso.id),
                      concurso.label,
                      concurso.id,
                    )
                  }
                  className="bg-white hover:bg-green-50 border border-gray-200 hover:border-[#18cb96] rounded-lg px-3 py-2 text-xs font-medium text-gray-700 transition-all text-left"
                >
                  {concurso.label}
                </button>
              ),
            )}
            <p className="text-xs text-gray-500 font-semibold px-2 py-1 mt-1">
              Estadual
            </p>
            {CONCURSOS.filter((c) => c.group === "Estadual").map(
              (concurso, idx) => (
                <button
                  key={concurso.id}
                  onClick={() =>
                    handleOptionSelect(
                      CONCURSOS.findIndex((c) => c.id === concurso.id),
                      concurso.label,
                      concurso.id,
                    )
                  }
                  className="bg-white hover:bg-green-50 border border-gray-200 hover:border-[#18cb96] rounded-lg px-3 py-2 text-xs font-medium text-gray-700 transition-all text-left"
                >
                  {concurso.label}
                </button>
              ),
            )}
            <p className="text-xs text-gray-500 font-semibold px-2 py-1 mt-1">
              Municipal
            </p>
            {CONCURSOS.filter((c) => c.group === "Municipal").map(
              (concurso, idx) => (
                <button
                  key={concurso.id}
                  onClick={() =>
                    handleOptionSelect(
                      CONCURSOS.findIndex((c) => c.id === concurso.id),
                      concurso.label,
                      concurso.id,
                    )
                  }
                  className="bg-white hover:bg-green-50 border border-gray-200 hover:border-[#18cb96] rounded-lg px-3 py-2 text-xs font-medium text-gray-700 transition-all text-left"
                >
                  {concurso.label}
                </button>
              ),
            )}
          </div>
        );

      case "onboarding_cargo":
        const cargos = CARGOS[chatState.concurso] || [];
        return (
          <div className="flex flex-col gap-2 p-3">
            {cargos.map((cargo, idx) => (
              <button
                key={cargo.id}
                onClick={() => handleOptionSelect(idx, cargo.label, cargo.id)}
                className="bg-white hover:bg-green-50 border border-gray-200 hover:border-[#18cb96] rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all text-left"
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
                onClick={() => handleOptionSelect(idx, nivel.label, nivel.id)}
                className="bg-white hover:bg-green-50 border border-gray-200 hover:border-[#18cb96] rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all text-left"
              >
                {nivel.label}
              </button>
            ))}
          </div>
        );

      case "onboarding_facilidade":
      case "onboarding_dificuldade":
        return (
          <div className="flex flex-col gap-1 p-2">
            <div className="grid grid-cols-2 gap-1">
              {MATERIAS.map((materia) => (
                <button
                  key={materia.id}
                  onClick={() =>
                    handleOptionSelect(0, materia.label, materia.id)
                  }
                  className={`border rounded-lg px-2 py-1.5 text-xs font-medium transition-all text-left ${
                    selectedMaterias.includes(materia.id)
                      ? "bg-[#18cb96] text-white border-[#18cb96]"
                      : "bg-white text-gray-700 border-gray-200 hover:border-[#18cb96]"
                  }`}
                >
                  {materia.label}
                </button>
              ))}
            </div>
            {selectedMaterias.length > 0 && (
              <button
                onClick={() => handleOptionSelect(0, "Confirmar", "confirmar")}
                className="mt-2 bg-[#18cb96] text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-[#14b584] transition-all"
              >
                ✓ Confirmar ({selectedMaterias.length} selecionadas)
              </button>
            )}
          </div>
        );

      case "onboarding_tempo":
        return (
          <div className="flex flex-col gap-2 p-3">
            {TEMPO_PROVA.map((tempo, idx) => (
              <button
                key={tempo.id}
                onClick={() => handleOptionSelect(idx, tempo.label, tempo.id)}
                className="bg-white hover:bg-green-50 border border-gray-200 hover:border-[#18cb96] rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all text-left"
              >
                {tempo.label}
              </button>
            ))}
          </div>
        );

      case "onboarding_horario":
        return (
          <div className="flex flex-col gap-2 p-3">
            {HORARIO_ESTUDO.map((horario, idx) => (
              <button
                key={horario.id}
                onClick={() =>
                  handleOptionSelect(idx, horario.label, horario.id)
                }
                className="bg-white hover:bg-green-50 border border-gray-200 hover:border-[#18cb96] rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all text-left"
              >
                {horario.label}
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
              Assinar Veterano - R$ 49,90/mês
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
              📱 Continuar no Telegram
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
          ref={chatContainerRef}
          className="bg-gradient-to-b from-[#f0f4f0] to-[#e5ebe5] rounded-[2rem] overflow-hidden"
          style={{ height: "520px" }}
        >
          {/* Header */}
          <div className="bg-[#18cb96] text-white px-4 py-3 flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
              {/* LOGO: Substitua pela sua imagem */}
              {/* <img src="/logo-icon.png" alt="Passarei" className="w-8 h-8 object-contain" /> */}
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
          {(chatState.step === "email" ||
            chatState.step === "welcome" ||
            chatState.step === "onboarding_estado") && (
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white border-t border-gray-200"
            >
              <div className="flex gap-2">
                <input
                  type={chatState.step === "email" ? "email" : "text"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    chatState.step === "email"
                      ? "Digite seu e-mail..."
                      : chatState.step === "onboarding_estado"
                        ? "Digite a sigla do estado (ex: MG)..."
                        : ""
                  }
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

      {/* Badge de segurança - CORRIGIDO para visibilidade */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-700 flex items-center justify-center gap-1 bg-white/80 rounded-full px-4 py-2 mx-auto w-fit shadow-sm">
          <CheckCircle2 className="w-3 h-3 text-green-600" />
          Seus dados estão seguros • Não enviamos spam
        </p>
      </div>
    </div>
  );
}

export default MiniChat;
