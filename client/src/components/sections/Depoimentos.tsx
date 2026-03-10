import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Depoimentos() {
  const testimonials = [
    {
      stars: 5,
      name: "Carlos Mendes",
      age: 29,
      status: "✅ Aprovado PM-SP 2025 - Soldado",
      location: "📍 São Paulo, SP",
      text: "Passei em 4º lugar geral na PM-SP depois de 2 anos tentando sem sucesso. O diferencial foi a repetição espaçada — nunca mais esqueci o que estudei. Recomendo demais!",
      initials: "CM",
      color: "bg-blue-500",
    },
    {
      stars: 5,
      name: "Juliana Santos",
      age: 24,
      status: "📚 Estudante PC-RJ (prova em Mar/25)",
      location: "📍 Rio de Janeiro, RJ",
      text: "Trabalho 8h/dia e achava impossível estudar. Com apenas 15 minutos no Telegram durante o almoço, melhorei 40% em Português em 1 mês. Incrível!",
      initials: "JS",
      color: "bg-green-500",
    },
    {
      stars: 5,
      name: "Roberto Silva",
      age: 31,
      status: "✅ Aprovado PRF 2025 - Agente",
      location: "📍 Brasília, DF",
      text: "Gastei R$ 5 mil em cursinhos sem resultado. Aqui por R$ 44,90/mês aprendi mais em 3 meses e fui aprovado na PRF. Melhor investimento que já fiz!",
      initials: "RS",
      color: "bg-purple-500",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Quem Passou com o Passarei
          </h2>
          <p className="text-xl text-muted-foreground">
            Histórias reais de transformação
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-100 hover-elevate"
              data-testid={`card-depoimento-${index}`}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold`}
                >
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}, {testimonial.age} anos
                  </p>
                </div>
              </div>

              {/* Testimonial */}
              <p className="text-muted-foreground mb-4 leading-relaxed italic">
                "{testimonial.text}"
              </p>

              {/* Status */}
              <div className="text-sm space-y-1">
                <p className="text-foreground font-medium">
                  {testimonial.status}
                </p>
                <p className="text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 mb-8">
          <h3 className="text-xl font-bold text-foreground mb-6 text-center">
            📊 Resultados Comprovados:
          </h3>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-primary mb-2">87%</p>
              <p className="text-sm text-muted-foreground">
                dos alunos melhoram em 30 dias
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary mb-2">154</p>
              <p className="text-sm text-muted-foreground">
                aprovações em 2025
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary mb-2">4.9/5</p>
              <p className="text-sm text-muted-foreground">
                avaliação média (1.243 reviews)
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary mb-2">+2.847</p>
              <p className="text-sm text-muted-foreground">
                candidatos estudando
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={() => window.location.href = "/sala/login?source=depoimentos"}
            className="bg-[#18cb96] hover:bg-[#14b584] text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            data-testid="button-depoimentos-cta"
          >
            Eu Também Quero Passar
          </Button>
        </div>
      </div>
    </section>
  );
}
