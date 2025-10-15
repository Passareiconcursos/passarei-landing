import { TrendingUp, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppCarousel } from "@/components/WhatsAppCarousel";

export function Hero() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToHowItWorks = () => {
    document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-green-50 pt-12 pb-16 md:pt-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Seu preparador pessoal para concursos policiais.
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              IA que envia o conteúdo certo, na hora certa — direto no WhatsApp
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button
                size="lg"
                onClick={scrollToForm}
                className="bg-[#18cb96] hover:bg-[#14b584] text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                data-testid="button-hero-cta-primary"
              >
                <span className="text-2xl mr-2">💚</span>
                Eu Vou Passar!
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={scrollToHowItWorks}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold hover-elevate active-elevate-2"
                data-testid="button-hero-cta-secondary"
              >
                <Play className="mr-2 w-5 h-5" />
                Ver como funciona (2min)
              </Button>
            </div>

            {/* Social Proof Badge */}
            <div className="inline-block bg-white rounded-lg shadow-md p-4 border border-gray-100">
              <div className="flex items-start gap-3 text-left">
                <div>
                  <div className="text-yellow-500 text-xl mb-1">⭐⭐⭐⭐⭐</div>
                  <p className="text-sm text-muted-foreground">4.9/5 - Avaliação de +1.200 alunos</p>
                  <p className="text-sm text-muted-foreground">✅ +2.847 candidatos estudando agora</p>
                  <p className="text-sm text-primary font-semibold">🏆 154 aprovações confirmadas em 2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - WhatsApp Mockup (Desktop) */}
          <div className="hidden lg:block">
            <div className="relative max-w-sm mx-auto">
              {/* Phone frame */}
              <div className="bg-white rounded-3xl shadow-2xl p-4 border-8 border-gray-800">
                {/* WhatsApp header */}
                <div className="bg-[#18cb96] text-white rounded-t-2xl p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <span className="text-[#18cb96] font-bold">P</span>
                    </div>
                    <div>
                      <p className="font-semibold">PASSAREI</p>
                      <p className="text-xs opacity-90">online agora</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-3 p-4 h-96 overflow-y-auto bg-gray-50 rounded-2xl">
                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-[85%]">
                    <p className="text-sm">📚 Bom dia! Vamos estudar?</p>
                  </div>

                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-[85%]">
                    <p className="text-sm mb-2">Hoje vamos dominar o Princípio da Legalidade.</p>
                    <p className="text-xs text-muted-foreground">O princípio da legalidade estabelece que ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei...</p>
                  </div>

                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-[85%]">
                    <p className="text-sm mb-2">Entendeu?</p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-[#18cb96] bg-opacity-20 text-[#18cb96] px-2 py-1 rounded">👍 Sim</span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">❓ Dúvida</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-[85%]">
                    <p className="text-xs font-semibold mb-2">🎯 QUESTÃO 1/5</p>
                    <p className="text-sm mb-2">Sobre o princípio da legalidade, é correto afirmar:</p>
                    <div className="text-xs space-y-1">
                      <p>A) O administrador...</p>
                      <p>B) O particular...</p>
                      <p className="font-semibold text-[#18cb96]">C) A legalidade...</p>
                    </div>
                  </div>

                  <div className="bg-[#DCF8C6] rounded-lg p-3 shadow-sm max-w-[85%] ml-auto">
                    <p className="text-sm">C</p>
                  </div>

                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-[85%]">
                    <p className="text-sm font-semibold text-[#18cb96] mb-1">✅ CORRETO! +10 pontos</p>
                    <p className="text-xs text-muted-foreground">Perfeito! A alternativa C está correta porque...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Carousel (Mobile) */}
        <WhatsAppCarousel />
      </div>
    </section>
  );
}
