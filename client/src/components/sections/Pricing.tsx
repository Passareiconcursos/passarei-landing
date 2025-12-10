import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pricing() {
  const scrollToCTA = () => {
    document
      .getElementById("cta-final")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const plans = [
    {
      name: "Pay-per-use",
      price: "0,99",
      period: "/questão",
      description: "Pague apenas o que usar",
      features: [
        "Sem mensalidade",
        "Questões personalizadas por IA",
        "Correção detalhada de cada alternativa",
        "Explicações completas",
        "Use quando quiser",
        "Créditos não expiram",
      ],
      cta: "Começar Agora",
      highlight: false,
      popular: false,
    },
    {
      name: "Veterano",
      price: "49,90",
      period: "/mês",
      description: "Acesso completo para aprovação",
      features: [
        "10 questões por dia",
        "Correção de redações com IA",
        "Todas as apostilas inclusas",
        "Revisão inteligente SM2",
        "Plano de estudos personalizado",
        "Simulados ilimitados",
        "Suporte prioritário",
      ],
      cta: "Assinar Agora",
      highlight: true,
      popular: true,
      badge: "MAIS POPULAR",
    },
    {
      name: "Gratuito",
      price: "0",
      period: "/sempre",
      description: "Teste a plataforma sem compromisso",
      features: [
        "5 questões grátis para testar",
        "Onboarding personalizado",
        "Acesso ao Telegram",
        "Conheça a metodologia",
        "Sem cartão de crédito",
      ],
      cta: "Testar Grátis",
      highlight: false,
      popular: false,
    },
  ];

  return (
    <section id="planos" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-[#18cb96]/10 text-[#18cb96] px-4 py-2 rounded-full text-sm font-semibold">
              💰 Preços acessíveis para sua aprovação
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Escolha Seu Plano
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Invista na sua aprovação com o melhor custo-benefício do mercado
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.highlight
                  ? "bg-gradient-to-br from-[#18cb96] to-[#14b584] text-white shadow-2xl scale-105 border-4 border-[#18cb96]"
                  : "bg-white border-2 border-gray-200 hover:border-[#18cb96] transition-all hover:shadow-xl"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    plan.highlight ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm ${
                    plan.highlight ? "text-white/90" : "text-gray-600"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span
                    className={`text-4xl font-bold ${
                      plan.highlight ? "text-white" : "text-gray-900"
                    }`}
                  >
                    R$ {plan.price}
                  </span>
                  <span
                    className={`ml-2 ${
                      plan.highlight ? "text-white/80" : "text-gray-600"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check
                      className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
                        plan.highlight ? "text-white" : "text-[#18cb96]"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.highlight ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={scrollToCTA}
                className={`w-full py-6 rounded-xl font-semibold text-base transition-all ${
                  plan.highlight
                    ? "bg-white text-[#18cb96] hover:bg-gray-100 shadow-lg"
                    : "bg-[#18cb96] text-white hover:bg-[#14b584] hover:scale-105"
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-6">
            🔒 Garantia de 7 dias • Cancele quando quiser • Sem taxas escondidas
          </p>
          <Button
            onClick={scrollToCTA}
            size="lg"
            className="bg-[#0088cc] hover:bg-[#0077b5] text-white px-12 py-6 text-lg font-semibold rounded-xl transition-all hover:scale-105"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 mr-2"
              fill="currentColor"
            >
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            Começar pelo Telegram
          </Button>
        </div>
      </div>
    </section>
  );
}
