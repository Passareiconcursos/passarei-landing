import { Smartphone, Bot, RefreshCcw, Target, BarChart3, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Beneficios() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const benefits = [
    {
      icon: <Smartphone className="w-12 h-12 text-primary" />,
      emoji: "📱",
      title: "100% no WhatsApp",
      description: "Estude onde você já está. Receba conteúdo, questões e revisões direto no WhatsApp. Sem instalar apps, sem complicação. Simples como conversar com um amigo."
    },
    {
      icon: <Bot className="w-12 h-12 text-primary" />,
      emoji: "🤖",
      title: "IA Personalizada ao Seu Edital",
      description: "Nossa inteligência artificial analisa seu edital e cria um plano único para VOCÊ. Prioriza matérias com maior peso, adapta a dificuldade e evolui com seu progresso."
    },
    {
      icon: <RefreshCcw className="w-12 h-12 text-primary" />,
      emoji: "🔄",
      title: "Repetição Espaçada Científica",
      description: "Algoritmo SM-2 comprovado pela neurociência revisita conteúdos no momento exato para maximizar sua memória de longo prazo. Você nunca mais esquece o que estudou."
    },
    {
      icon: <Target className="w-12 h-12 text-primary" />,
      emoji: "🎯",
      title: "Foco Total no Que Importa",
      description: "Analisamos seu edital, identificamos o que mais cai nas provas anteriores e focamos nisso. Você estuda menos, mas estuda CERTO. Zero desperdício de tempo."
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-primary" />,
      emoji: "📊",
      title: "Acompanhamento em Tempo Real",
      description: "Veja sua evolução diária com estatísticas detalhadas por matéria, taxa de acertos, sequência de estudos e previsão de prontidão para sua prova."
    },
    {
      icon: <Zap className="w-12 h-12 text-primary" />,
      emoji: "⚡",
      title: "Apenas 15 Minutos por Dia",
      description: "Microlearning científico: doses curtas todos os dias são mais eficientes que maratonas aos finais de semana. Consistência vence quantidade. Sempre."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Por Que o Passarei Funciona
          </h2>
          <p className="text-xl text-muted-foreground">
            Tecnologia de ponta + Método científico = Sua aprovação
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-100 hover-elevate"
              data-testid={`card-beneficio-${index}`}
            >
              <div className="text-5xl mb-4">{benefit.emoji}</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={scrollToForm}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            data-testid="button-beneficios-cta"
          >
            <span className="text-2xl mr-2">💚</span>
            Eu Vou Passar!
          </Button>
        </div>
      </div>
    </section>
  );
}
