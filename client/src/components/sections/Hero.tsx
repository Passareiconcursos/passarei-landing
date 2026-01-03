import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MiniChat } from "@/components/MiniChat";

export function Hero() {
  const [showMiniChat, setShowMiniChat] = useState(false);

  const scrollToHowItWorks = () => {
    document
      .getElementById("como-funciona")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-green-50 pt-12 pb-16 md:pt-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Coluna da esquerda - Texto */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Seu preparador pessoal para concursos policiais.
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              IA que envia o conteúdo certo, na hora certa — direto no seu
              celular
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button
                size="lg"
                onClick={() => setShowMiniChat(true)}
                className="bg-[#18cb96] hover:bg-[#14b584] text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <span className="text-2xl mr-2">🎁</span>21 Questões Grátis
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={scrollToHowItWorks}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold"
              >
                <Play className="mr-2 w-5 h-5" />
                Ver como funciona
              </Button>
            </div>

            {/* Badge de avaliação - Mobile */}
            <div className="lg:hidden mb-8">
              {!showMiniChat && (
                <div className="inline-block bg-white rounded-lg shadow-md p-4 border border-gray-100">
                  <div className="flex items-start gap-3 text-left">
                    <div>
                      <div className="text-yellow-500 text-xl mb-1">
                        ⭐⭐⭐⭐⭐
                      </div>
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
              )}
            </div>

            {/* Badge de avaliação - Desktop */}
            <div className="hidden lg:inline-block bg-white rounded-lg shadow-md p-4 border border-gray-100">
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

          {/* Coluna da direita - Mini-Chat ou Mockup */}
          <div className="flex justify-center">
            {showMiniChat ? (
              <div className="w-full max-w-md animate-fadeIn">
                <MiniChat />
              </div>
            ) : (
              <div
                className="relative max-w-[300px] mx-auto cursor-pointer group"
                onClick={() => setShowMiniChat(true)}
              >
                {/* Mockup do celular */}
                <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>

                  <div
                    className="bg-[#ECE5DD] rounded-[2.5rem] overflow-hidden relative"
                    style={{ height: "520px" }}
                  >
                    <div className="bg-[#18cb96] text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
                      {/* LOGO: Substitua aqui pela sua imagem */}
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {/* Opção 1: Usar imagem */}
                        {/* <img src="/logo-icon.png" alt="Passarei" className="w-8 h-8" /> */}
                        {/* Opção 2: Usar letra */}
                        <span className="text-[#18cb96] font-bold text-lg">
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

                    <div className="p-4 space-y-3">
                      {/* Mensagem de boas-vindas */}
                      <div className="flex justify-start">
                        <div className="max-w-[85%] bg-white rounded-lg rounded-tl-none p-3 shadow-sm">
                          <p className="text-sm">
                            👋 Olá! Eu sou o Assistente Passarei!
                          </p>
                          <p className="text-[10px] text-gray-500 text-right mt-1">
                            09:00
                          </p>
                        </div>
                      </div>

                      {/* Mensagem de questões grátis */}
                      <div className="flex justify-start">
                        <div className="max-w-[85%] bg-white rounded-lg rounded-tl-none p-3 shadow-sm border-2 border-[#18cb96]">
                          <p className="text-sm">
                            🎁 Você ganhou <strong>21 questões GRÁTIS</strong>{" "}
                            para testar!
                          </p>
                          <p className="text-[10px] text-gray-500 text-right mt-1">
                            09:00
                          </p>
                        </div>
                      </div>

                      {/* Mensagem pedindo email */}
                      <div className="flex justify-start">
                        <div className="max-w-[85%] bg-white rounded-lg rounded-tl-none p-3 shadow-sm">
                          <p className="text-sm">
                            📧 Para começar, me diz seu melhor e-mail:
                          </p>
                          <p className="text-[10px] text-gray-500 text-right mt-1">
                            09:01
                          </p>
                        </div>
                      </div>

                      {/* Indicador de clique */}
                      <div className="flex justify-center pt-8">
                        <div className="bg-[#18cb96] text-white px-6 py-3 rounded-full shadow-lg animate-pulse">
                          <p className="text-sm font-semibold">
                            👆 Clique para começar!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
                </div>

                {/* Badges flutuantes */}
                <div className="absolute -right-4 top-20 bg-white rounded-full px-4 py-2 shadow-lg border-2 border-[#18cb96] animate-bounce-slow">
                  <p className="text-xs font-bold text-[#18cb96]">
                    ✓ Teste grátis
                  </p>
                </div>

                <div className="absolute -left-4 top-1/3 bg-white rounded-full px-4 py-2 shadow-lg border-2 border-blue-500">
                  <p className="text-xs font-bold text-blue-600">
                    🎯 21 questões
                  </p>
                </div>

                <div className="absolute -right-4 bottom-32 bg-white rounded-full px-4 py-2 shadow-lg border-2 border-purple-500">
                  <p className="text-xs font-bold text-purple-600">
                    📝 Com correção
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal do Mini-Chat para Mobile */}
      {showMiniChat && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowMiniChat(false)}
              className="absolute top-2 right-2 text-white text-lg font-semibold hover:text-gray-300 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ✕ Fechar
            </button>
            <MiniChat />
          </div>
        </div>
      )}

      {/* Estilos de animação */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
