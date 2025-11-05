import { Button } from "@/components/ui/button";

export function ParaQuemE() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const profiles = [
    {
      emoji: "🎓",
      title: "Iniciante",
      description: "Começando do zero e precisa de direcionamento estruturado",
    },
    {
      emoji: "💪",
      title: "Determinado",
      description: "Já estuda mas quer otimizar tempo e aumentar aprovação",
    },
    {
      emoji: "💰",
      title: "Sem Grana",
      description: "Quer qualidade de cursinho caro por preço que cabe no bolso",
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
            Se você se identifica com algum desses perfis, o Passarei foi feito para você
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

        <div className="text-center">
          <Button
            onClick={scrollToForm}
            size="lg"
            className="bg-[#18cb96] hover:bg-[#14b584] text-white px-12 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            🎯 Experimentar Grátis
          </Button>
        </div>
      </div>
    </section>
  );
}
