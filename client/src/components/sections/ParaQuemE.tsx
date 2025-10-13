import { Clock, TrendingUp, MapPin, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ParaQuemE() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: <Clock className="w-12 h-12 text-primary" />,
      title: "Trabalha 8h/dia e tem pouco tempo livre",
      description: "Estude nos intervalos, no ônibus, em qualquer momento. Apenas 15 minutos por dia são suficientes para resultados reais."
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-primary" />,
      title: "Já tentou e não conseguiu aprovação",
      description: "Nosso sistema identifica suas dificuldades específicas e foca exatamente onde você mais precisa melhorar."
    },
    {
      icon: <MapPin className="w-12 h-12 text-primary" />,
      title: "Se perde em editais enormes sem saber por onde começar",
      description: "Enviamos seu edital e nossa IA cria um plano personalizado, priorizando o que realmente cai na sua prova."
    },
    {
      icon: <BookOpen className="w-12 h-12 text-primary" />,
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
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-md hover:shadow-xl transition-all hover-elevate"
              data-testid={`card-para-quem-e-${index}`}
            >
              <div className="mb-4">{feature.icon}</div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-2xl mt-1">✅</span>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
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
