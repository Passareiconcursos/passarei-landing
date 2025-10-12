import { Button } from "@/components/ui/button";

export function ComoFunciona() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const steps = [
    {
      number: "1️⃣",
      title: "CADASTRO PERSONALIZADO (2 minutos)",
      description: "Informe seu concurso, edital, tempo disponível e nível atual. Nossa IA cria um plano de estudos sob medida em segundos.",
      example: "\"PM-SP, Soldado, 1h/dia, nível intermediário, dificuldade em Português\" → Plano personalizado pronto!"
    },
    {
      number: "2️⃣",
      title: "CONTEÚDO DIÁRIO NO WHATSAPP (5-10 min/dia)",
      description: "Receba textos explicativos curtos sobre temas do seu edital. Leia, entenda o conceito e já pratique.",
      example: "\"📚 Bom dia! Hoje: Hierarquia das Leis\\n[Texto 200 palavras]\\nFicou claro? 👍 Sim | ❓ Dúvida\""
    },
    {
      number: "3️⃣",
      title: "QUESTÕES REAIS + FEEDBACK IA (10-15 min/dia)",
      description: "Resolva questões de bancas como CESPE, VUNESP, FCC. Receba explicações detalhadas de CADA alternativa, entendendo o porquê do acerto ou erro.",
      example: "\"🎯 QUESTÃO - VUNESP 2023\\n[Questão...]\\nSua resposta: B\\n✅ CORRETO! [Explicação completa]\\nPor que A, C, D e E estão erradas: [...]\""
    },
    {
      number: "4️⃣",
      title: "REVISÃO INTELIGENTE AUTOMÁTICA",
      description: "O sistema identifica temas com mais dificuldade e agenda revisões programadas. Você recebe lembretes nos momentos ideais para fixar o conteúdo.",
      example: "\"🔄 REVISÃO: Princípio da Legalidade\\nEstudado há 3 dias. Vamos testar sua memória?\\n[Mini-quiz]\""
    }
  ];

  return (
    <section id="como-funciona" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como Funciona na Prática
          </h2>
          <p className="text-xl text-muted-foreground">
            4 passos simples entre você e sua aprovação
          </p>
        </div>

        <div className="space-y-8 mb-12">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex flex-col md:flex-row gap-6 items-start"
              data-testid={`step-como-funciona-${index}`}
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-3xl">
                  {step.number}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {step.description}
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-foreground font-medium mb-1">Exemplo:</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {step.example}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
          <Button
            size="lg"
            onClick={scrollToForm}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            data-testid="button-como-funciona-cta"
          >
            🚀 Começar Minha Preparação Agora
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Grátis para sempre - Sem cartão de crédito
          </p>
        </div>
      </div>
    </section>
  );
}
