import { Check, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Comparativo() {
  const scrollToForm = () => {
    document
      .getElementById("lead-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      name: "Preço mensal",
      passarei: "R$ 49,90*",
      cursinhos: "R$ 129,90",
      livros: "R$ 150+",
    },
    {
      name: "Custo/dia",
      passarei: "R$ 1,66",
      cursinhos: "R$ 4,33",
      livros: "Variável",
    },
    {
      name: "Matérias/dia",
      passarei: "30 (Telegram)",
      cursinhos: "Via web",
      livros: "Ilimitado",
    },
    {
      name: "Correções/dia",
      passarei: "30",
      cursinhos: "Limitado",
      livros: "x",
    },
    {
      name: "Redação grátis/mês",
      passarei: "2",
      cursinhos: "1-2",
      livros: "x",
    },
    {
      name: "Redação extra",
      passarei: "R$ 0,99",
      cursinhos: "R$ 5-10",
      livros: "x",
    },
    {
      name: "Estuda pelo Telegram",
      passarei: "check",
      cursinhos: "x",
      livros: "x",
    },
    {
      name: "Conteúdo personalizado",
      passarei: "IA adapta",
      cursinhos: "Igual p/ todos",
      livros: "Não",
    },
    {
      name: "Análise automática do edital",
      passarei: "check",
      cursinhos: "x",
      livros: "x",
    },
    {
      name: "Repetição espaçada científica",
      passarei: "Algoritmo",
      cursinhos: "Não",
      livros: "Manual",
    },
    {
      name: "Questões com IA explicando",
      passarei: "Detalhado",
      cursinhos: "warning",
      livros: "Gabarito só",
    },
    {
      name: "Suporte",
      passarei: "30min (24/7)",
      cursinhos: "2 dias",
      livros: "x",
    },
  ];

  const getIcon = (value: string) => {
    if (value === "check") {
      return (
        <div className="flex items-center justify-center">
          <svg
            className="w-5 h-5 text-[#18cb96]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    }
    if (value === "x") {
      return (
        <div className="flex items-center justify-center">
          <svg
            className="w-5 h-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    }
    if (value === "warning") {
      return (
        <div className="flex items-center justify-center">
          <svg
            className="w-5 h-5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    }
    return <span className="text-sm font-medium text-foreground">{value}</span>;
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Passarei vs. Cursinhos Tradicionais
          </h2>
          <p className="text-xl text-muted-foreground">
            Economia de até R$ 960/ano (61.58%)
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto mb-8">
          <table className="w-full border-collapse bg-white rounded-2xl overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4 font-semibold text-foreground">
                  RECURSO
                </th>
                <th className="text-center p-4 font-semibold text-primary bg-green-50">
                  ✅ PASSAREI
                </th>
                <th className="text-center p-4 font-semibold text-muted-foreground">
                  ❌ CURSINHOS
                </th>
                <th className="text-center p-4 font-semibold text-muted-foreground">
                  ❌ LIVROS/PDFs
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-foreground">{feature.name}</td>
                  <td className="px-4 py-3 text-center bg-green-50/50">
                    {getIcon(feature.passarei)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getIcon(feature.cursinhos)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getIcon(feature.livros)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 shadow-md border border-gray-100"
            >
              <h3 className="font-semibold text-foreground mb-3">
                {feature.name}
              </h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">PASSAREI</p>
                  <div className="flex justify-center">
                    {getIcon(feature.passarei)}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    CURSINHOS
                  </p>
                  <div className="flex justify-center">
                    {getIcon(feature.cursinhos)}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">LIVROS</p>
                  <div className="flex justify-center">
                    {getIcon(feature.livros)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-6 justify-center text-sm">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#18cb96]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-muted-foreground">Tem completo</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-muted-foreground">Tem limitado</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-muted-foreground">Não tem</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            *Plano Veterano anual (R$ 598.80/ano)
          </p>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={scrollToForm}
            className="bg-[#18cb96] hover:bg-[#14b584] text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            data-testid="button-comparativo-cta"
          >
            💪 Quero Economizar 61%
          </Button>
        </div>
      </div>
    </section>
  );
}
