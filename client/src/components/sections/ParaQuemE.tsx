import { Clock, TrendingUp, MapPin, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ParaQuemE() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      title: "Trabalha 8h/dia e tem pouco tempo livre",
      description: "Estude nos intervalos, no ônibus, em qualquer momento. Apenas 15 minutos por dia são suficientes para resultados reais."
    },
    {
      title: "Já tentou e não conseguiu aprovação",
      description: "Nosso sistema identifica suas dificuldades específicas e foca exatamente onde você mais precisa melhorar."
    },
    {
      title: "Se perde em editais enormes sem saber por onde começar",
      description: "Enviamos seu edital e nossa IA cria um plano personalizado, priorizando o que realmente cai na sua prova."
    },
    {
      title: "Prefere ler e praticar ao invés de videoaulas longas",
      description: "Aprenda por textos diretos, questões reais das bancas e feedback inteligente. Sem enrolação, só resultado."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          O Passarei é Ideal Para Você Se:
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
              data-testid={`card-para-quem-e-${index}`}
            >
              {/* Ícone - Centralizado e com tamanho fixo */}
              <div className="flex items-center justify-center w-12 h-12 bg-[#18cb96] bg-opacity-10 rounded-full mb-4">
                <svg className="w-6 h-6 text-[#18cb96]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              
              {/* Título */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              {/* Descrição */}
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={scrollToForm}
            className="bg-[#18cb96] hover:bg-[#14b584] text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            data-testid="button-para-quem-e-cta"
          >
            🎯 Quero Começar Agora
          </Button>
        </div>
      </div>
    </section>
  );
}
