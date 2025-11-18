import { Zap, Brain, Target, BarChart } from "lucide-react";

export function Beneficios() {
  const benefits = [
    {
      icon: Zap,
      title: "100% pelo WhatsApp",
      description: "Estude onde você já está. Receba matérias, questões e correções direto no WhatsApp. Sem instalar apps, sem complicação. Simples como conversar com um amigo."
    },
    {
      icon: Brain,
      title: "IA Personalizada",
      description: "Nossa inteligência artificial analisa seu edital e cria um plano único para VOCÊ. Prioriza matérias com maior peso, adapta a dificuldade e evolui com seu progresso."
    },
    {
      icon: Target,
      title: "Repetição Espaçada",
      description: "Algoritmo SM-2 comprovado pela neurociência revisita conteúdos no momento exato para maximizar sua memória de longo prazo. Você nunca mais esquece o que estudou."
    },
    {
      icon: BarChart,
      title: "Acompanhamento em Tempo Real",
      description: "Dashboard mostra seu progresso, pontos fortes e fracos. Estatísticas detalhadas de desempenho para você saber exatamente onde focar."
    }
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
