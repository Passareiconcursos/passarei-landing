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
      name: "Gratuito",
      price: "0",
      period: "",
      description: "Teste a plataforma sem compromisso",
      features: [
        "21 questões grátis (única vez)",
        "Onboarding personalizado",
        "Correção detalhada com IA",
        "Conheça a metodologia",
        "Sem cartão de crédito",
      ],
      cta: "Testar Grátis",
      highlight: false,
      popular: false,
      action: "scroll",
    },
    {
      name: "Calouro",
      price: "89,90",
      period: "/mês",
      description: "Mensal • Ideal para testar ou estudos leves",
      features: [
        "300 questões personalizadas/mês",
        "Correção detalhada de cada questão",
        "Explicações completas com IA",
        "Use quando quiser",
        "Créditos não expiram",
        "Pix ou Cartão de crédito",
      ],
      cta: "Começar Agora",
      highlight: false,
      popular: false,
      action: "checkout",
      checkoutPlan: "calouro_mensal",
    },
    {
      name: "Veterano",
      price: "44,90",
      period: "/mês",
      description: "Anual • Para levar os estudos a sério",
      features: [
        "900 questões/mês (3x mais!)",
        "Simulados mensais completos",
        "2 correções de redação/mês com IA",
        "Intensivo nas suas dificuldades",
        "Revisão inteligente espaçada",
        "Plano de estudos personalizado",
        "Suporte prioritário",
        "Troque de concurso quando quiser",
        "Economia de R$ 539,40/ano",
      ],
      cta: "Garantir Desconto",
      highlight: true,
      popular: true,
      badge: "🔥 POPULAR 50% OFF",
      annualNote: "Cobrado anualmente (R$ 538,80/ano)",
      action: "checkout",
      checkoutPlan: "veterano_anual",
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
                  <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
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
                {plan.annualNote && (
                  <p
                    className={`text-xs mt-2 ${plan.highlight ? "text-white/80" : "text-gray-500"}`}
                  >
                    {plan.annualNote}
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

              {plan.action === "checkout" ? (

                  href={`/checkout?plan=${plan.checkoutPlan}`}
                  className={`block w-full py-6 text-lg font-semibold text-center rounded-lg transition-colors ${
                    plan.highlight
                      ? "bg-white text-[#18cb96] hover:bg-gray-100"
                      : "bg-[#18cb96] text-white hover:bg-[#14b584]"
                  }`}
                >
                  {plan.cta}
                </a>
              ) : (
                <Button
                  onClick={scrollToCTA}
                  className={`w-full py-6 text-lg font-semibold ${
                    plan.highlight
                      ? "bg-white text-[#18cb96] hover:bg-gray-100"
                      : "bg-[#18cb96] text-white hover:bg-[#14b584]"
                  }`}
                >
                  {plan.cta}
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            ✅ Satisfação garantida ou seu dinheiro de volta em até 7 dias
          </p>
        </div>
      </div>
    </section>
  );
}