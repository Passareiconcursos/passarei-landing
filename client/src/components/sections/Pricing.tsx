import { Check, X, Crown, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pricing() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Escolha Seu Plano
          </h2>
          <p className="text-xl text-muted-foreground">
            Comece grátis. Evolua quando quiser.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-md hover:shadow-xl transition-all hover-elevate" data-testid="card-plano-gratuito">
            <div className="text-center mb-6">
              <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">PLANO GRATUITO</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">R$ 0</span>
                <span className="text-muted-foreground">/para sempre</span>
              </div>
              <p className="text-sm text-muted-foreground">🎯 Ideal para conhecer</p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground">1 conteúdo/dia</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground">3 questões/dia</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground">Estatísticas básicas</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground">Suporte via chat</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-5 h-5 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">Sem repetição espaçada</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-5 h-5 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">Sem áudios explicativos</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-5 h-5 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">Sem análise de edital</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-5 h-5 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">Anúncios ocasionais</span>
              </li>
            </ul>

            <Button
              variant="outline"
              className="w-full hover-elevate active-elevate-2"
              onClick={scrollToForm}
              data-testid="button-plano-gratuito"
            >
              Começar Grátis
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">Sem cartão de crédito</p>
          </div>

          {/* Calouro Plan - Most Popular */}
          <div className="bg-white rounded-2xl p-8 border-4 border-primary shadow-2xl hover:shadow-3xl transition-all relative hover-elevate" data-testid="card-plano-calouro">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                MAIS POPULAR
              </div>
            </div>
            
            <div className="text-center mb-6 mt-4">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">💎 PLANO CALOURO</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">R$ 29,90</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <p className="text-sm text-primary font-semibold">🔥 Para quem quer resultado</p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground font-medium">Conteúdo ilimitado</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground font-medium">Questões ilimitadas</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground font-medium">Repetição espaçada (SM-2)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground font-medium">Áudios explicativos</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground font-medium">Análise completa edital</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground font-medium">Estatísticas avançadas</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground font-medium">Suporte prioritário</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground font-medium">Sem anúncios</span>
              </li>
            </ul>

            <Button
              className="w-full bg-[#18cb96] hover:bg-[#14b584] text-white"
              onClick={scrollToForm}
              data-testid="button-plano-calouro"
            >
              Eu Vou Passar! 🚀
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">💳 R$ 29,90 no cartão ou Pix</p>
          </div>

          {/* Veterano Plan */}
          <div className="bg-white rounded-2xl p-8 border-2 border-yellow-400 shadow-md hover:shadow-xl transition-all relative hover-elevate" data-testid="card-plano-veterano">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                MELHOR VALOR
              </div>
            </div>

            <div className="text-center mb-6 mt-4">
              <Crown className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">🏆 PLANO VETERANO</h3>
              <div className="mb-2">
                <span className="text-4xl font-bold text-foreground">R$ 19,90</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">cobrado anualmente (R$ 238,80/ano)</p>
              <p className="text-sm text-yellow-700 font-semibold">💰 Economize R$ 119/ano</p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground font-medium">TUDO do Calouro +</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground font-medium">Preparação física (TAF)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground font-medium">Simulados mensais</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground font-medium">Dicas de prova</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground font-medium">Suporte 24/7 prioritário</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground font-medium">Bônus: Guia do Candidato</span>
              </li>
            </ul>

            <Button
              variant="outline"
              className="w-full border-2 border-yellow-600 text-yellow-700 hover:bg-yellow-50 hover-elevate active-elevate-2"
              onClick={scrollToForm}
              data-testid="button-plano-veterano"
            >
              Garantir Desconto 👑
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">💳 R$ 238,80 (12x sem juros)</p>
          </div>
        </div>

        {/* Features Below Cards */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-8 text-center">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-foreground">
              <span>🔒</span>
              <span>Pagamento 100% seguro</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-foreground">
              <span>💳</span>
              <span>Cartão, Pix ou boleto</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-foreground">
              <span>🔄</span>
              <span>Garantia de 7 dias</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-foreground">
              <span>🎁</span>
              <span>1ª semana grátis</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={scrollToForm}
            className="bg-[#18cb96] hover:bg-[#14b584] text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            data-testid="button-pricing-cta"
          >
            <span className="text-2xl mr-2">💚</span>
            Começar Meu Plano Agora
          </Button>
        </div>
      </div>
    </section>
  );
}
