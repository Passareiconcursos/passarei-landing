import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Hero() {
  const scrollToForm = () => {
    document
      .getElementById("lead-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToHowItWorks = () => {
    document
      .getElementById("como-funciona")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    {
      type: "received",
      content: "📚 Bom dia! Vamos estudar?",
      time: "09:00",
    },
    {
      type: "received",
      content:
        "Hoje: Princípio da Legalidade\n\nNinguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei...",
      time: "09:01",
      title: "📖 Conteúdo do Dia",
    },
    {
      type: "received",
      content:
        "🎯 QUESTÃO - VUNESP\n\nSobre o princípio da legalidade:\n\nA) Administrador pode tudo\nB) Particular pode tudo\nC) Lei limita administração ✓\nD) Decreto = Lei",
      time: "09:05",
    },
    {
      type: "sent",
      content: "C",
      time: "09:06",
    },
    {
      type: "received",
      content:
        "✅ CORRETO! +10 pontos\n\nPerfeito! A alternativa C está correta porque o princípio da legalidade estabelece que a administração pública só pode agir conforme a lei determina.",
      time: "09:06",
      highlight: true,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-green-50 pt-12 pb-16 md:pt-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Seu preparador pessoal para concursos policiais.
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              IA que envia o conteúdo certo, na hora certa — direto no WhatsApp
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button
                size="lg"
                onClick={scrollToForm}
                className="bg-[#18cb96] hover:bg-[#14b584] text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <span className="text-2xl mr-2">💚</span>
                Começar Teste Grátis
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={scrollToHowItWorks}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold"
              >
                <Play className="mr-2 w-5 h-5" />
                Ver como funciona (2min)
              </Button>
            </div>

            <div className="lg:hidden mb-8">
              <div className="relative max-w-[280px] mx-auto">
                <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>

                  <div
                    className="bg-[#ECE5DD] rounded-[2.5rem] overflow-hidden relative"
                    style={{ height: "550px" }}
                  >
                    <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#075E54] font-bold text-lg">
                          P
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base truncate">
                          PASSAREI
                        </p>
                        <p className="text-xs opacity-90">online agora</p>
                      </div>
                    </div>

                    <div className="p-4 space-y-3 h-[calc(100%-60px)] overflow-y-auto">
                      {messages.slice(0, currentMessage + 1).map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-lg p-3 shadow-sm ${
                              msg.type === "sent"
                                ? "bg-[#DCF8C6] rounded-tr-none"
                                : msg.highlight
                                  ? "bg-[#FFF4CE] rounded-tl-none border-2 border-[#18cb96]"
                                  : "bg-white rounded-tl-none"
                            }`}
                          >
                            {msg.title && (
                              <p className="text-xs font-bold text-[#075E54] mb-2">
                                {msg.title}
                              </p>
                            )}
                            <p className="text-sm whitespace-pre-line leading-relaxed">
                              {msg.content}
                            </p>
                            <p className="text-[10px] text-gray-500 text-right mt-1">
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="inline-block bg-white rounded-lg shadow-md p-4 border border-gray-100">
              <div className="flex items-start gap-3 text-left">
                <div>
                  <div className="text-yellow-500 text-xl mb-1">⭐⭐⭐⭐⭐</div>
                  <p className="text-sm text-muted-foreground">
                    4.9/5 - Avaliação de +1.200 alunos
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ✅ +2.847 candidatos estudando agora
                  </p>
                  <p className="text-sm text-primary font-semibold">
                    🏆 154 aprovações confirmadas em 2025
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative max-w-[300px] mx-auto">
              <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>

                <div
                  className="bg-[#ECE5DD] rounded-[2.5rem] overflow-hidden relative"
                  style={{ height: "600px" }}
                >
                  <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[#075E54] font-bold text-lg">
                        P
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base truncate">
                        PASSAREI
                      </p>
                      <p className="text-xs opacity-90">online agora</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 h-[calc(100%-60px)] overflow-y-auto">
                    {messages.slice(0, currentMessage + 1).map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-3 shadow-sm ${
                            msg.type === "sent"
                              ? "bg-[#DCF8C6] rounded-tr-none"
                              : msg.highlight
                                ? "bg-[#FFF4CE] rounded-tl-none border-2 border-[#18cb96]"
                                : "bg-white rounded-tl-none"
                          }`}
                        >
                          {msg.title && (
                            <p className="text-xs font-bold text-[#075E54] mb-2">
                              {msg.title}
                            </p>
                          )}
                          <p className="text-sm whitespace-pre-line leading-relaxed">
                            {msg.content}
                          </p>
                          <p className="text-[10px] text-gray-500 text-right mt-1">
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
              </div>

              <div className="absolute -right-4 top-20 bg-white rounded-full px-4 py-2 shadow-lg border-2 border-[#18cb96]">
                <p className="text-xs font-bold text-[#18cb96]">
                  ✓ Conteúdo diário
                </p>
              </div>

              <div className="absolute -left-4 top-1/3 bg-white rounded-full px-4 py-2 shadow-lg border-2 border-blue-500">
                <p className="text-xs font-bold text-blue-600">
                  🎯 Questões ilimitadas
                </p>
              </div>

              <div className="absolute -right-4 bottom-32 bg-white rounded-full px-4 py-2 shadow-lg border-2 border-purple-500">
                <p className="text-xs font-bold text-purple-600">
                  📝 Correção de redação
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
