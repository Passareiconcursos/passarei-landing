import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pricing() {
  const whatsappNumber = "5527992663806";
  const whatsappMessage = encodeURIComponent(
    "Olá! Quero começar meu teste grátis no Passarei! 🎯",
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const openWhatsApp = () => {
    window.open(whatsappLink, "_blank");
  };

  const plans = [
    {
      name: "Gratuito",
      price: "0",
      period: "/sempre",
      description: "Perfeito para testar a plataforma",
      features: [
        "2 matérias por dia (60/mês)",
        "2 correções de exercícios/dia",
        "Suporte via WhatsApp (24h)",
        "SEM correção de redação",
      ],
      cta: "Teste Grátis",
      highlight: false,
      popular: false,
    },
    {
      name: "Calouro",
      price: "12,90",
      period: "/mês",
      description: "Para quem quer estudar sério",
      features: [
        "10 matérias por dia (300/mês)",
        "10 correções de exercícios/dia",
        "1 redação GRÁTIS/dia (30/mês)",
        "Redações extras: R$ 1,90",
        "Plano de aula personalizado",
        "Simulados mensais",
        "Suporte prioritário (2h)",
      ],
      cta: "Teste Grátis",
      highlight: true,
      popular: true,
      badge: "MAIS POPULAR",
    },
    {
      name: "Veterano",
      price: "9,90",
      period: "/mês",
      pricingDetail: "R$ 118,80/ano à vista",
      description: "Melhor custo-benefício",
      features: [
        "30 matérias por dia (900/mês)",
        "30 correções de exercícios/dia",
        "3 redações GRÁTIS/dia (90/mês)",
        "Redações extras: R$ 0,99 (50% OFF)",
        "Simulados ilimitados",
        "Suporte VIP (30min, 24/7)",
        "Programa de afiliados (20%)",
      ],
      cta: "Teste Grátis",
      highlight: false,
      popular: false,
      savings: "Economize 23%",
    },
  ];

  return (
    <section id="planos" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-[#18cb96]/10 text-[#18cb96] px-4 py-2 rounded-full text-sm font-semibold">
              💰 Economize até 92% vs concorrentes
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Escolha Seu Plano
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mesmo conteúdo dos cursinhos de R$ 1.500/ano, por até 92% menos
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

              {plan.savings && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {plan.savings}
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
                {plan.pricingDetail && (
                  <p
                    className={`text-sm mt-1 ${
                      plan.highlight ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {plan.pricingDetail}
                  </p>
                )}
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
                onClick={openWhatsApp}
                className={`w-full py-6 rounded-xl font-semibold text-base transition-all ${
                  plan.highlight
                    ? "bg-white text-[#18cb96] hover:bg-gray-100 shadow-lg"
                    : "bg-[#25D366] text-white hover:bg-[#20BD5A] hover:scale-105"
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
            onClick={openWhatsApp}
            size="lg"
            className="bg-[#25D366] hover:bg-[#20BD5A] text-white px-12 py-6 text-lg font-semibold rounded-xl transition-all hover:scale-105"
          >
            💚 Começar Teste Grátis
          </Button>
        </div>
      </div>
    </section>
  );
}
