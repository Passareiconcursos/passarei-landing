import { Brain, Target, BarChart, BookOpen } from "lucide-react";

export function Beneficios() {
  const benefits = [
    {
      icon: Brain,
      title: "Aprenda Com Questões",
      description:
        "Responder questões acelera o aprendizado mais do que aulas passivas. A prática ativa simula a prova real e melhora a retenção. Fonte: roediger.psych.wustl.edu",
    },
    {
      icon: Target,
      title: "Correção que Ensina",
      description:
        "Cada resposta recebe explicação imediata do erro ou acerto. Feedback rápido reduz falhas repetidas e consolida o entendimento. Fonte: visible-learning.org",
    },
    {
      icon: BarChart,
      title: "Memoria de Longo Prazo",
      description:
        "Testes frequentes ativam o efeito de recuperação, técnica comprovada para fixar conteúdos por muito mais tempo. Fonte: psychologicalscience.org",
    },
    {
      icon: BookOpen,
      title: "Desempenho Guiado",
      description:
        "O sistema adapta os próximos exercícios conforme seus erros e acertos, focando onde você realmente precisa evoluir. Fonte: oecd.org/education",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Por Que o Passarei Funciona?
          </h2>
          <p className="text-xl text-muted-foreground">
            Tecnologia + Ciência = Aprovação
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-[#18cb96]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-8 h-8 text-[#18cb96]" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
