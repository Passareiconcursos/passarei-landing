import { useState } from "react";
import { MiniChat } from "@/components/MiniChat";
import { Button } from "@/components/ui/button";

export function ParaQuemE() {
  const [showMiniChat, setShowMiniChat] = useState(false);

  const scrollToForm = () => {
    document
      .getElementById("lead-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      emoji: "🎯",
      title: "Micro-Learning Policial",
      description: "Chega de vídeos de 2 horas. Aprenda o que cai em blocos de 5 minutos.",
    },
    {
      emoji: "🔄",
      title: "Revisão Inteligente (SM2)",
      description: "Nosso algoritmo agenda sua revisão no momento exato para você nunca mais esquecer.",
    },
    {
      emoji: "🏆",
      title: "Foco nas Matérias Determinantes",
      description: "Priorizamos automaticamente as matérias que garantem 70% da sua nota final.",
    },
    {
      emoji: "🧠",
      title: "Análise Técnica 1-on-1",
      description: "Errou uma questão? Receba uma explicação técnica instantânea, como se tivesse um mentor ao seu lado.",
    },
    {
      emoji: "📱",
      title: "Estude em Qualquer Lugar",
      description: "Sincronização total entre Web e Telegram. Transforme seu tempo morto em tempo de estudo.",
    },
    {
      emoji: "📊",
      title: "Dashboard de Performance Real",
      description: "Visualize seu progresso por tópico do edital. Chega de \"achar\" que sabe.",
    },
    {
      emoji: "✍️",
      title: "Simulador de Redação IA",
      description: "Treine temas de segurança pública com correções baseadas nos critérios reais das bancas.",
    },
    {
      emoji: "🔗",
      title: "Vínculo Teoria-Questão",
      description: "Estude o tema e resolva a questão exata. Sem questões aleatórias que não caem na sua prova.",
    },
    {
      emoji: "🎓",
      title: "Curadoria de Elite",
      description: "Conteúdo sempre atualizado com as últimas mudanças legislativas e jurisprudência.",
    },
    {
      emoji: "🚀",
      title: "Gatilho de Aprovação",
      description: "Lembretes proativos que removem a procrastinação. É só clicar e estudar.",
    },
  ];

  return (
    <section id="para-quem-e" className="py-14 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            As 10 Soluções Que Aprovam
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Do iniciante ao veterano, removemos cada obstáculo entre você e sua aprovação.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-2"
            >
              <div className="text-5xl mb-4">{feature.emoji}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        {showMiniChat && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl">
              <button
                onClick={() => setShowMiniChat(false)}
                className="absolute top-2 right-2 text-white hover:text-gray-300 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center text-xl"
              >
                ✕ Fechar
              </button>
              <MiniChat />
            </div>
          </div>
        )}
        <div className="text-center">
          <Button
            onClick={() => setShowMiniChat(true)}
            className="bg-[#18cb96] hover:bg-[#15b386] text-white px-8 py-4 rounded-full font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            🎯 Experimentar Grátis
          </Button>
        </div>
      </div>
    </section>
  );
}
