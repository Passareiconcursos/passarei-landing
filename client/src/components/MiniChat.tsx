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

// Dados dos concursos - COMPLETO
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
  PL_FEDERAL: [{ id: "policial", label: "🏛️ Policial Legislativo Federal" }],
  PM: [
    { id: "soldado", label: "⭐ Soldado" },
    { id: "oficial", label: "🎖️ Oficial" },
  ],
  PC: [
    { id: "delegado", label: "👔 Delegado" },
    { id: "agente", label: "🕵️ Agente/Investigador" },
    { id: "escrivao", label: "📝 Escrivão" },
    { id: "perito", label: "🔬 Perito" },
  ],
  PP_ESTADUAL: [
    { id: "agente", label: "🔐 Agente Penitenciário" },
    { id: "tecnico", label: "📋 Técnico Penitenciário" },
  ],
  PL_ESTADUAL: [{ id: "policial", label: "📜 Policial Legislativo" }],
  CBM: [
    { id: "soldado", label: "⭐ Soldado" },
    { id: "oficial", label: "🎖️ Oficial" },
  ],
  GM: [
    { id: "guarda", label: "🛡️ Guarda Municipal" },
    { id: "inspetor", label: "📋 Inspetor" },
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
      "O princípio da legalidade (Art. 5º, II, CF/88) é um dos pilares do Estado Democrático de Direito. Ele garante que nenhum cidadão será obrigado a fazer ou deixar de fazer algo, exceto se houver uma lei determinando.",
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
      "O Art. 302 do CPP define as hipóteses de flagrante delito. A expressão 'logo depois' exige imediatidade temporal. 48 horas depois quebra esse requisito.",
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
      "O Poder de Polícia possui 3 atributos clássicos (DAC): Discricionariedade, Autoexecutoriedade e Coercibilidade.",
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
      "O Art. 25 do Código Penal define legítima defesa: agressão injusta, atual ou iminente, usando moderadamente os meios necessários.",
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
      "O Habeas Corpus (Art. 5º, LXVIII, CF) protege o direito de LOCOMOÇÃO - ir, vir e permanecer.",
  },
];

const BLOCK_KEY = "passarei_test_completed";
const BLOCK_DURATION = 30 * 24 * 60 * 60 * 1000;

const isUserBlocked = (): boolean => {
  try {
    const blockData = localStorage.getItem(BLOCK_KEY);
    if (!blockData) return false;
    const { timestamp } = JSON.parse(blockData);
    if (Date.now() - timestamp > BLOCK_DURATION) {
      localStorage.removeItem(BLOCK_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

const blockUser = () => {
  try {
    localStorage.setItem(BLOCK_KEY, JSON.stringify({ timestamp: Date.now() }));
  } catch {
    console.error("Erro ao salvar bloqueio");
  }
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
        addBotMessage(
          "🎯 Para continuar estudando, escolha um de nossos planos:",
        );
        setTimeout(() => {
          showOfferForBlocked();
        }, 1000);
      }, 1500);
    } else if (messages.length === 0) {
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
    options?: { id: string; label: string }[],
    optionType?: "single" | "multi",
  ) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      type: options ? "options" : "bot",
      content,
      options,
      optionType,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addOfferBlock = (
    offerType: "benefits" | "ppu" | "veterano" | "telegram",
    content: string,
  ) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      type: "offer-block",
      content,
      offerType,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addQuestionMessage = (
    content: string,
    questionOptions: string[],
    correctIndex: number,
  ) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      type: "question",
      content,
      questionOptions,
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
        // GTM FIX: Usando chatState.step
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "onboarding_step",
          step_name: chatState.step,
        });

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
            setTimeout(() => {
              addBotMessage(
                "Escolha uma opção:",
                CONCURSOS.map((c) => ({ id: c.id, label: c.label })),
                "single",
              );
              setChatState((prev) => ({
                ...prev,
                step: "onboarding_concurso",
                waitingForSelection: true,
              }));
            }, 500);
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
      const estadoUpper = userInput.toUpperCase();
      if (ESTADOS.includes(estadoUpper)) {
        setChatState((prev) => ({ ...prev, estado: estadoUpper }));
        simulateTyping(() => {
          addBotMessage(`✅ Estado: **${estadoUpper}**`);
          setTimeout(() => {
            addBotMessage(
              "📝 **PERGUNTA 3/8** 👮\n\nQual cargo você pretende?",
            );
            setTimeout(() => {
              const cargos = CARGOS[chatState.concurso] || [];
              addBotMessage(
                "Escolha uma opção:",
                cargos.map((c) => ({ id: c.id, label: c.label })),
                "single",
              );
              setChatState((prev) => ({
                ...prev,
                step: "onboarding_cargo",
                waitingForSelection: true,
              }));
            }, 500);
          }, 1000);
        });
      } else {
        simulateTyping(() => {
          addBotMessage(
            "❌ Estado inválido. Digite a sigla correta (ex: MG, SP, RJ):",
          );
        }, 500);
      }
    }
  };

  const handleOptionClick = async (optionId: string, optionLabel: string) => {
    if (isTyping || !chatState.waitingForSelection) return;

    // GTM FIX: Usando chatState.step
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "onboarding_step",
      step_name: chatState.step,
    });

    switch (chatState.step) {
      case "onboarding_concurso":
        addUserMessage(optionLabel);
        const conc = CONCURSOS.find((c) => c.id === optionId);
        if (!conc) return;
        setChatState((prev) => ({
          ...prev,
          concurso: optionId,
          concursoLabel: conc.label,
          waitingForSelection: false,
        }));
        simulateTyping(() => {
          addBotMessage(`✅ ${optionLabel}`);
          setTimeout(() => {
            if (conc.group === "Federal") {
              setChatState((prev) => ({ ...prev, estado: "NACIONAL" }));
              addBotMessage(
                "📝 **PERGUNTA 2/8** 📍\n\n🇧🇷 **Abrangência: NACIONAL**\n\nConcursos federais têm validade em todo o território brasileiro!",
              );
              setTimeout(() => {
                addBotMessage(
                  "📝 **PERGUNTA 3/8** 👮\n\nQual cargo você pretende?",
                );
                setTimeout(() => {
                  const cargos = CARGOS[optionId] || [];
                  addBotMessage(
                    "Escolha uma opção:",
                    cargos.map((c) => ({ id: c.id, label: c.label })),
                    "single",
                  );
                  setChatState((prev) => ({
                    ...prev,
                    step: "onboarding_cargo",
                    waitingForSelection: true,
                  }));
                }, 500);
              }, 1500);
            } else {
              addBotMessage(
                "📝 **PERGUNTA 2/8** 📍\n\nDigite a sigla do seu estado (ex: MG, SP, RJ):",
              );
              setChatState((prev) => ({
                ...prev,
                step: "onboarding_estado",
                waitingForSelection: false,
              }));
            }
          }, 1000);
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
          addBotMessage(`✅ Cargo: **${optionLabel}**`);
          setTimeout(() => {
            addBotMessage(
              "📝 **PERGUNTA 4/8** 📊\n\nQual seu nível de conhecimento nas matérias do concurso?",
            );
            setTimeout(() => {
              addBotMessage(
                "Escolha uma opção:",
                NIVEIS.map((n) => ({ id: n.id, label: n.label })),
                "single",
              );
              setChatState((prev) => ({
                ...prev,
                step: "onboarding_nivel",
                waitingForSelection: true,
              }));
            }, 500);
          }, 1000);
        });
        break;

      case "onboarding_nivel":
        addUserMessage(optionLabel);
        setChatState((prev) => ({
          ...prev,
          nivel: optionLabel,
          waitingForSelection: false,
        }));
        simulateTyping(() => {
          addBotMessage(`✅ Nível: **${optionLabel}**`);
          setTimeout(() => {
            addBotMessage(
              "📝 **PERGUNTA 5/8** 💚\n\nEm qual área você **JÁ TEM FACILIDADE**?",
            );
            setTimeout(() => {
              addBotMessage(
                "Selecione as matérias:",
                MATERIAS.map((m) => ({ id: m.id, label: m.label })),
                "multi",
              );
              setChatState((prev) => ({
                ...prev,
                step: "onboarding_facilidade",
                waitingForSelection: true,
              }));
            }, 500);
          }, 1000);
        });
        break;

      case "onboarding_facilidade":
        if (optionId === "confirmar") {
          if (selectedMaterias.length === 0) {
            addBotMessage("⚠️ Selecione pelo menos uma matéria!");
            return;
          }
          const labels = selectedMaterias
            .map((m) => MATERIAS.find((mat) => mat.id === m)?.label)
            .join(", ");
          addUserMessage(labels);
          setChatState((prev) => ({
            ...prev,
            facilidade: [...selectedMaterias],
            waitingForSelection: false,
          }));
          setSelectedMaterias([]);
          simulateTyping(() => {
            addBotMessage(`✅ Facilidades registradas!`);
            setTimeout(() => {
              addBotMessage(
                "📝 **PERGUNTA 6/8** 🎯\n\nEm qual área você **TEM MAIS DIFICULDADE**?",
              );
              setTimeout(() => {
                addBotMessage(
                  "Selecione as matérias:",
                  MATERIAS.map((m) => ({ id: m.id, label: m.label })),
                  "multi",
                );
                setChatState((prev) => ({
                  ...prev,
                  step: "onboarding_dificuldade",
                  waitingForSelection: true,
                }));
              }, 500);
            }, 1000);
          });
        } else {
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
          const labels = selectedMaterias
            .map((m) => MATERIAS.find((mat) => mat.id === m)?.label)
            .join(", ");
          addUserMessage(labels);
          setChatState((prev) => ({
            ...prev,
            dificuldade: [...selectedMaterias],
            waitingForSelection: false,
          }));
          setSelectedMaterias([]);
          simulateTyping(() => {
            addBotMessage(`✅ Vamos focar nessas áreas!`);
            setTimeout(() => {
              addBotMessage(
                "📝 **PERGUNTA 7/8** 📅\n\nQuanto tempo você tem até a prova?",
              );
              setTimeout(() => {
                addBotMessage(
                  "Escolha uma opção:",
                  TEMPO_PROVA.map((t) => ({ id: t.id, label: t.label })),
                  "single",
                );
                setChatState((prev) => ({
                  ...prev,
                  step: "onboarding_tempo",
                  waitingForSelection: true,
                }));
              }, 500);
            }, 1000);
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
          tempoProva: optionLabel,
          waitingForSelection: false,
        }));
        simulateTyping(() => {
          addBotMessage(`✅ Tempo: **${optionLabel}**`);
          setTimeout(() => {
            addBotMessage(
              "📝 **PERGUNTA 8/8** ⏰\n\nQuando você **PREFERE ESTUDAR**?",
            );
            setTimeout(() => {
              addBotMessage(
                "Escolha uma opção:",
                HORARIO_ESTUDO.map((h) => ({ id: h.id, label: h.label })),
                "single",
              );
              setChatState((prev) => ({
                ...prev,
                step: "onboarding_horario",
                waitingForSelection: true,
              }));
            }, 500);
          }, 1000);
        });
        break;

      case "onboarding_horario":
        addUserMessage(optionLabel);
        setChatState((prev) => ({
          ...prev,
          horarioEstudo: optionLabel,
          waitingForSelection: false,
        }));
        simulateTyping(() => {
          showResumo();
        });
        break;
    }
  };

  const showResumo = () => {
    setChatState((prev) => ({ ...prev, step: "resumo" }));
    const s = chatState;
    const fac = s.facilidade
      .map((f) => MATERIAS.find((m) => m.id === f)?.label || f)
      .join(", ");
    const dif = s.dificuldade
      .map((d) => MATERIAS.find((m) => m.id === d)?.label || d)
      .join(", ");

    addBotMessage("🎉 **PERFIL CRIADO COM SUCESSO!**");
    setTimeout(() => {
      addBotMessage(
        `📋 **RESUMO DO SEU PLANO DE ESTUDOS:**\n\n🎯 Concurso: **${s.concursoLabel}**\n📍 Local: **${s.estado}**\n👮 Cargo: **${s.cargo}**\n📊 Nível: **${s.nivel}**\n💚 Facilidades: ${fac || "Nenhuma"}\n🎯 Focar em: ${dif || "Nenhuma"}\n📅 Tempo: **${s.tempoProva}**\n⏰ Horário: **${s.horarioEstudo}**\n\n━━━━━━━━━━━━━━━━`,
      );
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
    addBotMessage("🚀 **Começando suas questões!**");
    setTimeout(() => {
      showQuestion(0);
    }, 2000);
  };

  const showQuestion = (index: number) => {
    const question = QUESTOES_EXEMPLO[index];
    simulateTyping(() => {
      addQuestionMessage(
        `📝 **QUESTÃO ${index + 1}/5**\n\n${question.pergunta}`,
        question.opcoes,
        question.correta,
      );
    }, 1500);
  };

  const handleQuestionAnswer = async (selectedIndex: number) => {
    if (isTyping || chatState.step !== "questions") return;
    const currentQ = QUESTOES_EXEMPLO[chatState.currentQuestion];
    const isCorrect = selectedIndex === currentQ.correta;
    addUserMessage(currentQ.opcoes[selectedIndex]);
    setIsTyping(true);
    await wait(1000);
    setIsTyping(false);

    if (isCorrect) {
      setActualScore((prev) => prev + 1);
      addBotMessage(`✅ **CORRETO!** 🎉\n\n${currentQ.explicacaoBreve}`);
      await wait(4000);
      const next = chatState.currentQuestion + 1;
      if (next < 5) {
        setChatState((p) => ({ ...p, currentQuestion: next, retryCount: 0 }));
        showQuestion(next);
      } else {
        finishQuiz();
      }
    } else {
      if (chatState.retryCount === 0) {
        addBotMessage(
          `❌ **Incorreto!**\n\n💡 Dica: ${currentQ.explicacaoBreve}`,
        );
        setChatState((p) => ({ ...p, retryCount: 1 }));
        await wait(3000);
        showQuestion(chatState.currentQuestion);
      } else {
        addBotMessage(
          `❌ **Ainda não...**\n\n✅ Resposta: ${currentQ.opcoes[currentQ.correta]}\n\n📚 Explicação: ${currentQ.explicacaoDetalhada}`,
        );
        await wait(6000);
        const next = chatState.currentQuestion + 1;
        if (next < 5) {
          setChatState((p) => ({ ...p, currentQuestion: next, retryCount: 0 }));
          showQuestion(next);
        } else {
          finishQuiz();
        }
      }
    }
  };

  const finishQuiz = async () => {
    setChatState((prev) => ({ ...prev, step: "finished" }));
    blockUser();
    const finalScore = actualScore;
    const percentage = Math.round((finalScore / 5) * 100);

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "quiz_completed",
      score: finalScore,
    });

    addBotMessage(
      `🏆 **RESULTADO FINAL**\n\n📊 Você acertou **${finalScore}/5** (${percentage}%)`,
    );
    await wait(3000);
    showOffer();
  };

  const showOffer = async () => {
    setChatState((prev) => ({
      ...prev,
      step: "offer",
      waitingForSelection: true,
    }));
    addOfferBlock("benefits", "");
    await wait(2000);
    addOfferBlock("ppu", "");
    await wait(1500);
    addOfferBlock("veterano", "");
    await wait(1500);
    addOfferBlock("telegram", "");
  };

  const showOfferForBlocked = async () => {
    setChatState((prev) => ({
      ...prev,
      step: "offer",
      waitingForSelection: true,
    }));
    addOfferBlock("benefits", "");
    await wait(2000);
    addOfferBlock("ppu", "");
    await wait(1500);
    addOfferBlock("veterano", "");
    await wait(1500);
    addOfferBlock("telegram", "");
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
      <div className="bg-[#18cb96] p-4 text-white font-bold flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <Sparkles size={20} />
          <span>ASSISTENTE PASSAREI</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-[10px] opacity-80 uppercase tracking-widest">
            IA Ativa
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] p-4 rounded-2xl shadow-sm ${m.type === "user" ? "bg-[#18cb96] text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"}`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {m.content}
              </p>

              {m.type === "options" && m.options && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {m.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionClick(opt.id, opt.label)}
                      className={`text-xs px-4 py-2.5 rounded-xl border transition-all font-medium ${selectedMaterias.includes(opt.id) ? "bg-[#18cb96] text-white border-[#18cb96]" : "bg-gray-50 text-gray-700 border-gray-200 hover:border-[#18cb96]"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                  {m.optionType === "multi" && (
                    <button
                      onClick={() =>
                        handleOptionClick("confirmar", "Confirmar")
                      }
                      className="text-xs px-6 py-2.5 rounded-xl bg-gray-800 text-white w-full mt-2 font-bold"
                    >
                      Confirmar Escolhas
                    </button>
                  )}
                </div>
              )}

              {m.type === "question" && m.questionOptions && (
                <div className="mt-4 space-y-2">
                  {m.questionOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuestionAnswer(i)}
                      className="w-full text-left text-xs p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-green-50 transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {m.type === "offer-block" && (
                <div className="mt-3">
                  <button
                    onClick={() => (window.location.href = "/checkout")}
                    className="w-full bg-[#18cb96] text-white py-4 rounded-xl font-black text-sm shadow-lg uppercase tracking-tight"
                  >
                    {m.offerType === "telegram"
                      ? "Entrar no Grupo VIP Telegram 📱"
                      : "Liberar Meu Plano de Estudos 🚀"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border p-3 rounded-2xl rounded-tl-none flex gap-1 items-center shadow-sm">
              <Loader2 size={14} className="animate-spin text-[#18cb96]" />
              <span className="text-[10px] text-gray-400 font-medium">
                Digitando...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t bg-white flex gap-2 items-center"
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            chatState.waitingForSelection
              ? "Selecione uma opção..."
              : "Responda aqui..."
          }
          disabled={chatState.waitingForSelection || isBlocked}
          className="flex-1 text-sm p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18cb96]/20"
        />
        <button
          type="submit"
          disabled={
            chatState.waitingForSelection || isBlocked || !inputValue.trim()
          }
          className="bg-[#18cb96] text-white p-3 rounded-xl"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
