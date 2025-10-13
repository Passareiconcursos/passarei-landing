import { Check, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Comparativo() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    { name: "Preço mensal", passarei: "R$ 19,90*", cursinhos: "R$ 200-500", livros: "R$ 150+" },
    { name: "Estuda pelo WhatsApp", passarei: "check", cursinhos: "x", livros: "x" },
    { name: "Conteúdo personalizado", passarei: "IA adapta", cursinhos: "Igual p/ todos", livros: "Não" },
    { name: "Análise automática do edital", passarei: "check", cursinhos: "x", livros: "x" },
    { name: "Repetição espaçada científica", passarei: "Algoritmo", cursinhos: "Não", livros: "Manual" },
    { name: "Questões com IA explicando", passarei: "Detalhado", cursinhos: "warning", livros: "Gabarito só" },
    { name: "Estuda em qualquer horário", passarei: "24/7", cursinhos: "warning", livros: "check" },
    { name: "Progresso em tempo real", passarei: "Dashboard", cursinhos: "warning", livros: "x" },
    { name: "Funciona offline", passarei: "x", cursinhos: "x", livros: "check" },
    { name: "Suporte para dúvidas", passarei: "Ilimitado", cursinhos: "warning", livros: "x" },
    { name: "Ajuste de dificuldade", passarei: "Automático", cursinhos: "Fixo", livros: "Fixo" },
    { name: "Acompanha seu ritmo", passarei: "check", cursinhos: "Turma toda igual", livros: "x" },
  ];

  const getIcon = (value: string) => {
    if (value === "check") return <Check className="w-5 h-5 text-green-600" />;
    if (value === "x") return <X className="w-5 h-5 text-red-600" />;
    if (value === "warning") return <AlertCircle className="w-5 h-5 text-yellow-600" />;
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
            Veja por que somos a escolha inteligente
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto mb-8">
          <table className="w-full border-collapse bg-white rounded-2xl overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4 font-semibold text-foreground">RECURSO</th>
                <th className="text-center p-4 font-semibold text-primary bg-green-50">✅ PASSAREI</th>
                <th className="text-center p-4 font-semibold text-muted-foreground">❌ CURSINHOS</th>
                <th className="text-center p-4 font-semibold text-muted-foreground">❌ LIVROS/PDFs</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="p-4 text-foreground">{feature.name}</td>
                  <td className="p-4 text-center bg-green-50/50">
                    {getIcon(feature.passarei)}
                  </td>
                  <td className="p-4 text-center">
                    {getIcon(feature.cursinhos)}
                  </td>
                  <td className="p-4 text-center">
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
            <div key={index} className="bg-white rounded-lg p-4 shadow-md border border-gray-100">
              <h3 className="font-semibold text-foreground mb-3">{feature.name}</h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">PASSAREI</p>
                  <div className="flex justify-center">{getIcon(feature.passarei)}</div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">CURSINHOS</p>
                  <div className="flex justify-center">{getIcon(feature.cursinhos)}</div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">LIVROS</p>
                  <div className="flex justify-center">{getIcon(feature.livros)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-6 justify-center text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-muted-foreground">Tem completo</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-muted-foreground">Tem limitado</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-red-600" />
              <span className="text-muted-foreground">Não tem</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            *Plano Veterano anual
          </p>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={scrollToForm}
            className="bg-[#18cb96] hover:bg-[#14b584] text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            data-testid="button-comparativo-cta"
          >
            💪 Quero a Preparação Inteligente
          </Button>
        </div>
      </div>
    </section>
  );
}
