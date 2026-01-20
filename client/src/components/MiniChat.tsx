import { useState, useRef, useEffect } from "react";
import { Send, Loader2, CheckCircle2, Trophy, Sparkles } from "lucide-react";

// ============================================
// TAREFA 2.1: CONSTANTES DE STORAGE
// ============================================
const STORAGE_KEYS = {
  USER_EMAIL: "passarei_user_email",
  LAST_SUBJECT: "passarei_last_subject",
  LAST_TOPIC: "passarei_last_topic",
  FIRST_VISIT: "passarei_first_visit",
  CONCURSO: "passarei_concurso",
  CARGO: "passarei_cargo",
};

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
  offerType?: "benefits" | "calouro" | "veterano" | "telegram";
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
    | "offer"
    | "returning_menu"; // NOVO: menu para usuário retornando
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

// ============================================
// TAREFA 2.1: INTERFACE PARA CONTEXTO DO USUÁRIO
// ============================================
interface UserContext {
  isReturning: boolean;
  userEmail: string | null;
  lastSubject: string | null;
  lastTopic: string | null;
  concurso: string | null;
  cargo: string | null;
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
  { id: "menos de 3 meses", label: "⚡ Menos de 3 meses" },
  { id: "3 a 6 meses", label: "📅 3 a 6 meses" },
  { id: "6 a 12 meses", label: "📆 6 meses a 1 ano" },
  { id: "mais de 1 ano", label: "🗓️ Mais de 1 ano" },
  { id: "indefinido", label: "❓ Ainda não sei" },
];

const HORARIO_ESTUDO = [
  { id: "manha", label: "🌅 Manhã (6h - 12h)" },
  { id: "tarde", label: "☀️ Tarde (12h - 18h)" },
  { id: "noite", label: "🌙 Noite (18h - 22h)" },
  { id: "madrugada", label: "🌃 Madrugada (22h - 6h)" },
  { id: "flexivel", label: "🔄 Horários variados" },
];

// Questões
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

// Domínios de email válidos
const VALID_EMAIL_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "yahoo.com.br",
  "icloud.com",
  "live.com",
  "msn.com",
  "uol.com.br",
  "bol.com.br",
  "terra.com.br",
  "globo.com",
  "ig.com.br",
  "oi.com.br",
  "r7.com",
  "zipmail.com.br",
  "protonmail.com",
  "mail.com",
  "aol.com",
];

// Funções de bloqueio por IP/localStorage
const BLOCK_KEY = "passarei_test_completed";
const BLOCK_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 dias em ms

const isUserBlocked = (): boolean => {
  try {
    const blockData = localStorage.getItem(BLOCK_KEY);
    if (!blockData) return false;

    const { timestamp } = JSON.parse(blockData);
    const now = Date.now();

    if (now - timestamp > BLOCK_DURATION) {
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
    localStorage.setItem(
      BLOCK_KEY,
      JSON.stringify({
        timestamp: Date.now(),
      }),
    );
  } catch {
    console.error("Erro ao salvar bloqueio");
  }
};

// ============================================
// TAREFA 2.1: FUNÇÕES DE GERENCIAMENTO DE CONTEXTO
// ============================================

const checkUserContext = (): UserContext => {
  try {
    const userEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL);
    const lastSubject = localStorage.getItem(STORAGE_KEYS.LAST_SUBJECT);
    const lastTopic = localStorage.getItem(STORAGE_KEYS.LAST_TOPIC);
    const firstVisit = localStorage.getItem(STORAGE_KEYS.FIRST_VISIT);
    const concurso = localStorage.getItem(STORAGE_KEYS.CONCURSO);
    const cargo = localStorage.getItem(STORAGE_KEYS.CARGO);

    return {
      isReturning: !!userEmail && firstVisit === "false",
      userEmail,
      lastSubject,
      lastTopic,
      concurso,
      cargo,
    };
  } catch (error) {
    console.error("Erro ao verificar contexto do usuário:", error);
    return {
      isReturning: false,
      userEmail: null,
      lastSubject: null,
      lastTopic: null,
      concurso: null,
      cargo: null,
    };
  }
};

const saveUserContext = (
  key: keyof typeof STORAGE_KEYS,
  value: string,
): void => {
  try {
    localStorage.setItem(STORAGE_KEYS[key], value);
  } catch (error) {
    console.error("Erro ao salvar contexto:", error);
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
  const [currentApiQuestion, setCurrentApiQuestion] = useState<any>(null);
  const [totalQuestions, setTotalQuestions] = useState(5); // Padrão 5 para demo, API pode retornar 21
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      // Scroll apenas dentro do container do chat, não da página
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedMaterias]);

  // ============================================
  // TAREFA 2.1: INICIALIZAÇÃO COM CONTEXTO
  // ============================================
  useEffect(() => {
    if (isUserBlocked()) {
      setIsBlocked(true);
      setChatState((prev) => ({ ...prev, step: "blocked" }));
      addBotMessage("👋 Olá! Você já utilizou suas **21 questões grátis**.");
      setTimeout(() => {
        addBotMessage(
          "🎯 Para continuar estudando, escolha um de nossos planos:",
        );
        setTimeout(() => {
          showOfferForBlocked();
        }, 1000);
      }, 1500);
    } else if (messages.length === 0) {
      // NOVA LÓGICA: Verificar se é usuário retornando
      const userContext = checkUserContext();

      if (userContext.isReturning) {
        // USUÁRIO RETORNANDO
        handleReturningUser(userContext);
      } else {
        // USUÁRIO NOVO
        handleNewUser();
      }
    }
  }, []);

  // ============================================
  // TAREFA 2.1: HANDLER PARA USUÁRIO RETORNANDO
  // ============================================
  const handleReturningUser = (userContext: UserContext) => {
    setTimeout(() => {
      let welcomeMessage = "👋 **Bem-vindo de volta ao Passarei!**";

      if (userContext.concurso || userContext.lastSubject) {
        welcomeMessage += "\n\n📚 Seu perfil:\n";

        if (userContext.concurso) {
          const concursoObj = CONCURSOS.find(
            (c) => c.id === userContext.concurso,
          );
          welcomeMessage += `🎯 ${concursoObj?.label || userContext.concurso}\n`;
        }

        if (userContext.cargo) {
          welcomeMessage += `👮 ${userContext.cargo}\n`;
        }

        if (userContext.lastSubject) {
          welcomeMessage += `\n📖 Última matéria estudada: **${userContext.lastSubject}**`;
          if (userContext.lastTopic) {
            welcomeMessage += `\n🎯 Tópico: ${userContext.lastTopic}`;
          }
        }

        welcomeMessage += "\n\nO que deseja fazer hoje?";
      } else {
        welcomeMessage += "\n\nVamos continuar seus estudos?";
      }

      addBotMessage(welcomeMessage);

      setTimeout(() => {
        const hasContext = !!(userContext.concurso || userContext.lastSubject);

        const options = [
          ...(hasContext
            ? [{ id: "continue_last", label: "📚 Continuar estudando" }]
            : []),
          { id: "new_theme", label: "🆕 Começar novo tema" },
          { id: "show_progress", label: "📊 Ver estatísticas" },
          { id: "update_profile", label: "⚙️ Atualizar perfil" },
        ];

        addBotMessage("Escolha uma opção:", options, "single");
        setChatState((prev) => ({
          ...prev,
          step: "returning_menu",
          waitingForSelection: true,
        }));
      }, 1000);
    }, 500);
  };

  // ============================================
  // TAREFA 2.1: HANDLER PARA USUÁRIO NOVO
  // ============================================
  const handleNewUser = () => {
    setTimeout(() => {
      addBotMessage("👋 Olá! Eu sou o Assistente Passarei!");
      setTimeout(() => {
        addBotMessage(
          "🎯 Vou criar um plano de estudos personalizado para você em 8 perguntas rápidas!",
        );
        setTimeout(() => {
          addBotMessage(
            "🎁 BÔNUS: Você tem **21 questões GRÁTIS** para testar agora!",
          );
          setTimeout(() => {
            addBotMessage("📧 Para começar, me diz seu melhor e-mail:");
            setChatState((prev) => ({ ...prev, step: "email" }));

            // Marcar que não é mais primeira visita
            saveUserContext("FIRST_VISIT", "false");
          }, 1000);
        }, 1500);
      }, 1500);
    }, 500);
  };

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
    offerType: "benefits" | "calouro" | "veterano" | "telegram",
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

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;

    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return false;

    if (VALID_EMAIL_DOMAINS.includes(domain)) return true;

    const parts = domain.split(".");
    if (parts.length < 2) return false;

    const extension = parts[parts.length - 1];
    const validExtensions = [
      "com",
      "br",
      "net",
      "org",
      "edu",
      "gov",
      "io",
      "co",
    ];

    return validExtensions.includes(extension) || extension.length >= 2;
  };

  const isValidEstado = (estado: string) => {
    return ESTADOS.includes(estado.toUpperCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping || isBlocked) return;

    const userInput = inputValue.trim();
    setInputValue("");
    addUserMessage(userInput);

    if (chatState.step === "email") {
      if (isValidEmail(userInput)) {
        setChatState((prev) => ({ ...prev, email: userInput }));

        // TAREFA 2.1: Salvar email no localStorage
        saveUserContext("USER_EMAIL", userInput);

        // Adicione isto para notificar o Google Tag Manager
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "onboarding_step",
          step_number: 1,
          step_name: "Pergunta Onboarding",
        });

        try {
          const response = await fetch("/api/minichat/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userInput }),
          });
          const data = await response.json();

          // IMPORTANTE: Salvar o sessionId para usar nas questões da API
          if (data.success && data.sessionId) {
            setChatState((prev) => ({ ...prev, sessionId: data.sessionId }));
            console.log("[MiniChat] Sessão iniciada:", data.sessionId);
          }
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
            "❌ E-mail inválido. Por favor, digite um e-mail válido (ex: seunome@gmail.com):",
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

    // Adicione isto para notificar o Google Tag Manager
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "onboarding_step",
      step_number: 1,
      step_name: "Pergunta Onboarding",
    });

    // ============================================
    // TAREFA 2.1: NOVOS HANDLERS PARA MENU DE RETORNO
    // ============================================
    if (chatState.step === "returning_menu") {
      switch (optionId) {
        case "continue_last":
          addUserMessage(optionLabel);
          setChatState((prev) => ({ ...prev, waitingForSelection: false }));
          simulateTyping(() => {
            addBotMessage("📚 Ótimo! Vamos continuar de onde você parou...");
            setTimeout(() => {
              startQuestions();
            }, 1500);
          });
          break;

        case "new_theme":
          addUserMessage(optionLabel);
          setChatState((prev) => ({ ...prev, waitingForSelection: false }));
          simulateTyping(() => {
            addBotMessage(
              "🆕 Vamos escolher um novo tema!\n\nQual concurso você quer focar?",
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
          });
          break;

        case "show_progress":
          addUserMessage(optionLabel);
          setChatState((prev) => ({ ...prev, waitingForSelection: false }));
          simulateTyping(() => {
            addBotMessage("📊 Buscando suas estatísticas...");
            setTimeout(() => {
              addBotMessage(
                "📈 **Suas Estatísticas**\n\n" +
                  "🎯 Questões respondidas: Em breve!\n" +
                  "✅ Taxa de acerto: Em breve!\n" +
                  "🔥 Dias de estudo: Em breve!\n\n" +
                  "💡 Estas estatísticas estarão disponíveis em breve no app completo!",
              );
              setTimeout(() => {
                const userContext = checkUserContext();
                handleReturningUser(userContext);
              }, 3000);
            }, 1500);
          });
          break;

        case "update_profile":
          addUserMessage(optionLabel);
          setChatState((prev) => ({ ...prev, waitingForSelection: false }));
          simulateTyping(() => {
            addBotMessage(
              "⚙️ Vamos atualizar seu perfil!\n\nQual concurso você está estudando agora?",
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
          });
          break;
      }
      return;
    }

    switch (chatState.step) {
      case "onboarding_concurso":
        addUserMessage(optionLabel);
        const concursoSelecionado = CONCURSOS.find((c) => c.id === optionId);
        if (!concursoSelecionado) return;

        setChatState((prev) => ({
          ...prev,
          concurso: optionId,
          concursoLabel: concursoSelecionado.label,
          waitingForSelection: false,
        }));

        // TAREFA 2.1: Salvar concurso no localStorage
        saveUserContext("CONCURSO", optionId);
        saveUserContext("LAST_SUBJECT", concursoSelecionado.label);

        const isFederal = concursoSelecionado.group === "Federal";

        simulateTyping(() => {
          addBotMessage(`✅ ${optionLabel}`);
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

        // TAREFA 2.1: Salvar cargo no localStorage
        saveUserContext("CARGO", optionLabel);

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
          nivel: optionId,
          waitingForSelection: false,
        }));

        simulateTyping(() => {
          addBotMessage(`✅ Nível: **${optionLabel}**`);
          setTimeout(() => {
            addBotMessage(
              "📝 **PERGUNTA 5/8** 💚\n\nEm qual área você **JÁ TEM FACILIDADE**?\n\n_(Toque para selecionar, toque novamente para desmarcar)_",
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
                "📝 **PERGUNTA 6/8** 🎯\n\nEm qual área você **TEM MAIS DIFICULDADE**?\n\nVamos focar mais tempo nela!\n\n_(Toque para selecionar, toque novamente para desmarcar)_",
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

          // TAREFA 2.1: Salvar tópicos de dificuldade como último tema estudado
          const firstDifficulty = MATERIAS.find(
            (m) => m.id === selectedMaterias[0],
          );
          if (firstDifficulty) {
            saveUserContext("LAST_TOPIC", firstDifficulty.label);
          }

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
          tempoProva: optionId,
          waitingForSelection: false,
        }));

        simulateTyping(() => {
          addBotMessage(`✅ Tempo: **${optionLabel}**`);
          setTimeout(() => {
            addBotMessage(
              "📝 **PERGUNTA 8/8** ⏰\n\nQuando você **PREFERE ESTUDAR**?\n\nEnviaremos conteúdo automaticamente nesses horários!",
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
          horarioEstudo: optionId,
          waitingForSelection: false,
        }));

        simulateTyping(() => {
          showResumo();
        });
        break;
    }
  };

  const handleQuestionAnswer = async (selectedIndex: number) => {
    if (isTyping || chatState.step !== "questions") return;

    // Se temos questão da API, usar fluxo da API
    if (currentApiQuestion && chatState.sessionId) {
      await handleApiQuestionAnswer(selectedIndex);
      return;
    }

    // Fallback: fluxo local com questões hardcoded
    const currentQ = QUESTOES_EXEMPLO[chatState.currentQuestion];
    const isCorrect = selectedIndex === currentQ.correta;

    addUserMessage(currentQ.opcoes[selectedIndex]);
    setIsTyping(true);

    await wait(1000);
    setIsTyping(false);

    if (isCorrect) {
      setActualScore((prev) => prev + 1);
      addBotMessage(`✅ **CORRETO!** 🎉\n\n${currentQ.explicacaoBreve}`);

      await wait(8000);
      addBotMessage("📚 Próxima questão chegando...");
      await wait(4000);

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
      const retryCount = chatState.retryCount;

      if (retryCount === 0) {
        addBotMessage(
          `❌ **Incorreto!**\n\n💡 Dica: ${currentQ.explicacaoBreve}`,
        );
        await wait(12000);
        addBotMessage(
          "🔄 **Vamos tentar novamente?**\n\nReleia a questão com atenção:",
        );
        setChatState((prev) => ({ ...prev, retryCount: 1 }));
        await wait(3000);
        showQuestion(chatState.currentQuestion);
      } else {
        addBotMessage(
          `❌ **Ainda não foi dessa vez...**\n\n✅ **Resposta correta:** ${currentQ.opcoes[currentQ.correta]}\n\n📚 **Explicação:**\n${currentQ.explicacaoDetalhada}`,
        );
        await wait(12000);

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

  // ============================================
  // INTEGRAÇÃO COM API - RESPONDER QUESTÃO
  // ============================================
  const handleApiQuestionAnswer = async (selectedIndex: number) => {
    const question = currentApiQuestion;
    if (!question) return;

    addUserMessage(question.opcoes[selectedIndex]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/minichat/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: chatState.sessionId,
          questionId: question.id,
          answer: selectedIndex,
        }),
      });

      const data = await response.json();
      setIsTyping(false);

      if (data.success) {
        if (data.correct) {
          setActualScore((prev) => prev + 1);

          // Mostrar explicação da IA (mais rica que o fallback)
          const explanation =
            data.explicacaoIA || data.explicacaoBase || "Parabéns!";
          addBotMessage(`✅ **CORRETO!** 🎉\n\n${explanation}`);

          await wait(6000);
        } else {
          // Mostrar explicação detalhada da IA
          const explanation =
            data.explicacaoIA || data.explicacaoBase || "Revise este conceito.";
          addBotMessage(`❌ **Incorreto!**\n\n${explanation}`);

          await wait(8000);
        }

        // Atualizar estado
        setChatState((prev) => ({
          ...prev,
          currentQuestion: data.currentQuestion,
          retryCount: 0,
        }));

        // Verificar se há mais questões
        if (data.hasMore) {
          addBotMessage("📚 Próxima questão chegando...");
          await wait(3000);
          await fetchAndShowQuestion();
        } else {
          finishQuiz();
        }
      }
    } catch (error) {
      console.error("[MiniChat] Erro ao enviar resposta:", error);
      setIsTyping(false);
      addBotMessage("⚠️ Erro ao processar resposta. Tente novamente.");
    }
  };

  const showResumo = async () => {
    setChatState((prev) => ({ ...prev, step: "resumo" }));

    const state = chatState;

    // Enviar dados do onboarding para o backend (para personalizar questões)
    if (chatState.sessionId) {
      try {
        await fetch("/api/minichat/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: chatState.sessionId,
            concurso: state.concurso,
            cargo: state.cargo,
            nivel: state.nivel,
            facilidades: state.facilidade,
            dificuldades: state.dificuldade,
          }),
        });
        console.log("[MiniChat] Onboarding salvo no backend");
      } catch (error) {
        console.error("[MiniChat] Erro ao salvar onboarding:", error);
      }
    }
    const facilidadeLabels = state.facilidade
      .map((f) => MATERIAS.find((m) => m.id === f)?.label || f)
      .join(", ");
    const dificuldadeLabels = state.dificuldade
      .map((d) => MATERIAS.find((m) => m.id === d)?.label || d)
      .join(", ");

    addBotMessage("🎉 **PERFIL CRIADO COM SUCESSO!**");

    setTimeout(() => {
      addBotMessage(
        `📋 **RESUMO DO SEU PLANO DE ESTUDOS:**\n\n🎯 Concurso: **${state.concursoLabel}**\n📍 Local: **${state.estado}**\n👮 Cargo: **${state.cargo}**\n📊 Nível: **${state.nivel}**\n💚 Facilidades: ${facilidadeLabels || "Nenhuma"}\n🎯 Focar em: ${dificuldadeLabels || "Nenhuma"}\n📅 Tempo: **${state.tempoProva}**\n⏰ Horário: **${state.horarioEstudo}**\n\n━━━━━━━━━━━━━━━━`,
      );

      setTimeout(() => {
        addBotMessage(
          "🎁 Você tem **21 questões GRÁTIS** agora!\n\n⏳ Preparando suas questões personalizadas...",
        );
        setTimeout(() => {
          startQuestions();
        }, 2000);
      }, 2000);
    }, 1500);
  };

  const startQuestions = async () => {
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

    // Buscar primeira questão da API
    setTimeout(async () => {
      await fetchAndShowQuestion();
    }, 2000);
  };

  // ============================================
  // INTEGRAÇÃO COM API - BUSCAR QUESTÃO
  // ============================================
  const fetchAndShowQuestion = async () => {
    if (!chatState.sessionId) {
      // Fallback para questões locais se não tiver sessão
      showQuestionLocal(chatState.currentQuestion);
      return;
    }

    setIsTyping(true);

    try {
      const response = await fetch(
        `/api/minichat/question/${chatState.sessionId}`,
      );
      const data = await response.json();

      setIsTyping(false);

      if (data.finished || data.blocked) {
        // Usuário atingiu limite de questões grátis
        finishQuiz();
        return;
      }

      if (data.success && data.question) {
        setCurrentApiQuestion(data.question);
        setTotalQuestions(data.totalQuestions || 21);

        // Mostrar conteúdo enriquecido pela IA (se disponível)
        let questionText = `📝 **QUESTÃO ${data.questionNumber}/${data.totalQuestions}**\n\n`;

        // Adicionar tema/matéria
        if (data.question.materia) {
          questionText += `📚 *${data.question.materia}*\n`;
        }
        if (data.question.tema) {
          questionText += `🎯 *${data.question.tema}*\n\n`;
        }

        // Mostrar pontos-chave da IA (se disponível)
        if (data.question.pontosChave) {
          addBotMessage(`💡 **Pontos-chave:**\n${data.question.pontosChave}`);
          await wait(2000);
        }

        // Mostrar a pergunta
        questionText += data.question.pergunta;

        addQuestionMessage(
          questionText,
          data.question.opcoes,
          -1, // Não revelar resposta correta no frontend
        );
      } else {
        // Fallback para questões locais
        showQuestionLocal(chatState.currentQuestion);
      }
    } catch (error) {
      console.error("[MiniChat] Erro ao buscar questão:", error);
      setIsTyping(false);
      // Fallback para questões locais
      showQuestionLocal(chatState.currentQuestion);
    }
  };

  // Função de fallback para questões locais (caso API falhe)
  const showQuestionLocal = (index: number) => {
    if (index >= QUESTOES_EXEMPLO.length) {
      finishQuiz();
      return;
    }
    const question = QUESTOES_EXEMPLO[index];
    const retryText = chatState.retryCount > 0 ? " _(2ª tentativa)_" : "";

    simulateTyping(() => {
      addQuestionMessage(
        `📝 **QUESTÃO ${index + 1}/${QUESTOES_EXEMPLO.length}**${retryText}\n\n${question.pergunta}`,
        question.opcoes,
        question.correta,
      );
    }, 1500);
  };

  const showQuestion = (index: number) => {
    const question = QUESTOES_EXEMPLO[index];
    const retryText = chatState.retryCount > 0 ? " _(2ª tentativa)_" : "";

    simulateTyping(() => {
      addQuestionMessage(
        `📝 **QUESTÃO ${index + 1}/5**${retryText}\n\n${question.pergunta}`,
        question.opcoes,
        question.correta,
      );
    }, 1500);
  };

  const finishQuiz = async () => {
    setChatState((prev) => ({ ...prev, step: "finished" }));

    // Bloquear usuário após completar o teste
    blockUser();

    // Notificar API que finalizou
    if (chatState.sessionId) {
      try {
        await fetch("/api/minichat/finish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: chatState.sessionId }),
        });
      } catch (error) {
        console.error("[MiniChat] Erro ao finalizar sessão:", error);
      }
    }

    const finalScore = actualScore;
    const questionsAnswered = chatState.currentQuestion || 5;
    const percentage = Math.round((finalScore / questionsAnswered) * 100);

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
      `${emoji} **RESULTADO FINAL**\n\n📊 Você acertou **${finalScore}/${questionsAnswered}** questões (**${percentage}%**)\n\n${message}`,
    );

    // Adicione isto para notificar o Google Tag Manager
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "quiz_completed",
      quiz_score: finalScore,
      quiz_total: questionsAnswered,
      quiz_percentage: percentage,
    });

    await wait(3000);
    showOffer();
  };

  const showOfferForBlocked = async () => {
    setChatState((prev) => ({
      ...prev,
      step: "offer",
      waitingForSelection: true,
    }));

    addOfferBlock("benefits", "");
    await wait(2000);
    addOfferBlock("calouro", "");
    await wait(1500);
    addOfferBlock("veterano", "");
    await wait(1500);
    addOfferBlock("telegram", "");
  };

  const showOffer = async () => {
    setChatState((prev) => ({
      ...prev,
      step: "offer",
      waitingForSelection: true,
    }));

    addOfferBlock("benefits", "");
    await wait(3000);
    addOfferBlock("calouro", "");
    await wait(2000);
    addOfferBlock("veterano", "");
    await wait(2000);
    addOfferBlock("telegram", "");
  };

  const handlePayment = (plan: "calouro" | "veterano") => {
    console.log("💳 Redirecionando para pagamento:", plan);

    // Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "begin_checkout", {
        currency: "BRL",
        value: plan === "veterano" ? 44.9 : 89.9,
        items: [
          {
            item_name: `Plano ${plan === "veterano" ? "VETERANO" : "CALOURO"}`,
            price: plan === "veterano" ? 44.9 : 89.9,
            quantity: 1,
          },
        ],
      });
    }

    if (plan === "veterano") {
      // Redirecionar direto para assinatura Mercado Pago
      window.location.href =
        "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=e717107a9daa436f81ce9c8cc1c00d8f";
    } else {
      // Redirecionar para checkout Calouro
      window.location.href = "/checkout?plan=calouro";
    }
  };

  const handleTelegram = () => {
    window.open("https://t.me/PassareiBot", "_blank");
  };

  const renderOfferBlock = (message: Message) => {
    switch (message.offerType) {
      case "benefits":
        return (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-4 mb-3">
            <p className="text-sm font-bold text-gray-800 mb-3">
              💡 O que você ganha com o Passarei:
            </p>
            <ul className="text-xs text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                Questões personalizadas para seu concurso
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                Revisão espaçada inteligente que reforça pontos fracos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                Explicações detalhadas por IA
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                Estude onde quiser: Web ou Telegram
              </li>
            </ul>
          </div>
        );

      case "calouro":
        return (
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 mb-3 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">💰</span>
              <p className="font-bold text-gray-800">PLANO CALOURO</p>
            </div>
            <p className="text-2xl font-bold text-[#18cb96] mb-2">
              R$ 89,90{" "}
              <span className="text-sm font-normal text-gray-500">por mês</span>
            </p>
            <ul className="text-xs text-gray-600 space-y-1 mb-3">
              <li>• 300 Questões mês</li>
              <li>• Sem compromisso, cancele quando quiser</li>
              <li>• Acesso completo à plataforma</li>
            </ul>
            <button
              onClick={() => handlePayment("calouro")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 px-4 rounded-xl transition-all text-sm"
            >
              💳 Assinar Agora
            </button>
          </div>
        );

      case "veterano":
        return (
          <div className="bg-gradient-to-br from-[#18cb96] to-[#14b584] rounded-2xl p-4 mb-3 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <p className="font-bold text-white">PLANO VETERANO</p>
              </div>
              <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                POPULAR
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-2">
              R$ 44,90{" "}
              <span className="text-sm font-normal text-white/80">/mês</span>
            </p>
            <p className="text-xs text-white/80 mb-2">
              (plano anual = R$ 538,80)
            </p>
            <ul className="text-xs text-white/90 space-y-1 mb-3">
              <li>• + de 10 mil Questões ano!</li>
              <li>• Correção de 2 redações mês</li>
              <li>• Intensivo de aprendizado</li>
              <li>• Revisão espaçada inteligente</li>
              <li>• Suporte prioritário</li>
              <li>• Economia de 50% vs mensal</li>
            </ul>
            <button
              onClick={() => handlePayment("veterano")}
              className="w-full bg-white hover:bg-gray-100 text-[#18cb96] font-bold py-2.5 px-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Assinar Agora
            </button>
          </div>
        );

      case "telegram":
        return (
          <div className="bg-[#0088cc] rounded-2xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📱</span>
              <p className="font-bold text-white">Prefere o Telegram?</p>
            </div>
            <p className="text-xs text-white/80 mb-3">
              Continue estudando pelo nosso bot
            </p>
            <button
              onClick={handleTelegram}
              className="w-full bg-white hover:bg-gray-100 text-[#0088cc] font-bold py-2.5 px-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
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
    // Render offer blocks differently
    if (message.type === "offer-block") {
      return (
        <div key={message.id} className="flex justify-start mb-2">
          <div className="max-w-[95%]">{renderOfferBlock(message)}</div>
        </div>
      );
    }

    const isBot =
      message.type === "bot" ||
      message.type === "options" ||
      message.type === "question";

    return (
      <div
        key={message.id}
        className={`flex ${isBot ? "justify-start" : "justify-end"} mb-3`}
      >
        <div
          className={`max-w-[90%] rounded-2xl px-4 py-2.5 shadow-sm ${
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

          {/* Opções de seleção */}
          {message.type === "options" && message.options && (
            <div className="mt-3 space-y-2">
              {message.options.map((option) => {
                const isSelected = selectedMaterias.includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option.id, option.label)}
                    disabled={!chatState.waitingForSelection || isTyping}
                    className={`w-full text-left border rounded-lg px-3 py-2 text-xs font-medium transition-all disabled:opacity-50 ${
                      message.optionType === "multi" && isSelected
                        ? "bg-[#18cb96] text-white border-[#18cb96] shadow-md"
                        : "bg-gray-50 hover:bg-green-50 border-gray-200 hover:border-[#18cb96] text-gray-700"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {message.optionType === "multi" && (
                        <span
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? "bg-white border-white"
                              : "border-gray-400"
                          }`}
                        >
                          {isSelected && (
                            <span className="text-[#18cb96] text-xs">✓</span>
                          )}
                        </span>
                      )}
                      {option.label}
                    </span>
                  </button>
                );
              })}
              {message.optionType === "multi" && (
                <button
                  onClick={() => handleOptionClick("confirmar", "Confirmar")}
                  disabled={selectedMaterias.length === 0 || isTyping}
                  className="w-full bg-[#18cb96] text-white rounded-lg px-4 py-2.5 text-sm font-bold hover:bg-[#14b584] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-md"
                >
                  ✓ Confirmar ({selectedMaterias.length} selecionadas)
                </button>
              )}
            </div>
          )}

          {/* Opções de questão */}
          {message.type === "question" && message.questionOptions && (
            <div className="mt-3 space-y-2">
              {message.questionOptions.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuestionAnswer(idx)}
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

  const showInput =
    chatState.step === "email" ||
    chatState.step === "welcome" ||
    chatState.step === "onboarding_estado";

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-[2.5rem] p-3 shadow-2xl">
        <div
          className="bg-gradient-to-b from-[#f0f4f0] to-[#e5ebe5] rounded-[2rem] overflow-hidden flex flex-col"
          style={{ height: "520px" }}
        >
          {/* Header */}
          <div className="bg-[#18cb96] text-white px-4 py-3 flex items-center gap-3 shadow-md flex-shrink-0">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
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
              🎁 21 grátis
            </div>
          </div>

          {/* Área de mensagens - SCROLL INTERNO (não afeta a página) */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
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

          {/* Input - só aparece quando necessário */}
          {showInput && !isBlocked && (
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white border-t border-gray-200 flex-shrink-0"
            >
              <div className="flex gap-2">
                <input
                  type={chatState.step === "email" ? "email" : "text"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    chatState.step === "email"
                      ? "seunome@email.com"
                      : chatState.step === "onboarding_estado"
                        ? "Ex: MG, SP, RJ..."
                        : ""
                  }
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#18cb96]"
                  disabled={isTyping || chatState.step === "welcome"}
                  autoComplete="off"
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

      {/* Badge de segurança */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-700 flex items-center justify-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 mx-auto w-fit shadow-sm border border-gray-200">
          <CheckCircle2 className="w-3 h-3 text-green-600" />
          Seus dados estão seguros • Não enviamos spam
        </p>
      </div>
    </div>
  );
}

export default MiniChat;
