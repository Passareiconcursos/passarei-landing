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

  const profiles = [
    {
      emoji: "🎓",
      title: "Iniciante",
      description: "É iniciante e precisa de acompanhamento",
    },
    {
      emoji: "💪",
      title: "Determinado",
      description: "Já estuda mas quer otimizar tempo e aumentar aprovação",
    },
    {
      emoji: "💰",
      title: "Sem Grana",
      description: "Questões de simulados sem gastar com cursinhos",
    },
    {
      emoji: "📱",
      title: "Praticidade",
      description: "Precisa estudar no busão, metrô, intervalo do trabalho",
    },
  ];

  return (
    <section id="para-quem-e" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Para Quem é o Passarei?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Independente do seu perfil, o Passarei é a ferramenta certa!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {profiles.map((profile, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-2"
            >
              <div className="text-5xl mb-4">{profile.emoji}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {profile.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {profile.description}
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
