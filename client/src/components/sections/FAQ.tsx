import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export function FAQ() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const faqs = [
    {
      question: "❓ Como funciona exatamente? Preciso baixar algum app?",
      answer: "Não precisa baixar nada! O Passarei funciona 100% pelo WhatsApp.\n\nVocê receberá mensagens diárias com:\n• Conteúdos explicativos (5-10min leitura)\n• Questões de provas reais (10-15min prática)\n• Revisões programadas (quando o algoritmo decidir)\n\nÉ como ter um professor particular no seu bolso, disponível 24/7.\n\nBasta ter WhatsApp instalado e conexão com internet."
    },
    {
      question: "❓ Funciona para qual concurso policial?",
      answer: "Atualmente cobrimos:\n✅ PM (Polícia Militar) - Todos os estados\n✅ PC (Polícia Civil) - Todos os estados\n✅ PRF (Polícia Rodoviária Federal)\n✅ PF (Polícia Federal)\n✅ Outros concursos policiais federais/estaduais\n\nVocê informa qual concurso está estudando no cadastro e nosso sistema adapta TODO o conteúdo automaticamente.\n\nMatérias cobertas:\n• Português\n• Direito Constitucional\n• Direito Administrativo\n• Direito Penal\n• Direito Processual Penal\n• Legislação Penal Extravagante"
    },
    {
      question: "❓ E se eu não souber meu edital ainda?",
      answer: "Sem problemas! Você pode começar estudando as matérias mais comuns em concursos policiais (que caem em 90% das provas).\n\nQuando seu edital sair:\n1. Envie o link pelo WhatsApp\n2. Nossa IA analisa em segundos\n3. Ajustamos seu plano automaticamente\n4. Você continua de onde parou\n\nZero retrabalho, zero perda de tempo."
    },
    {
      question: "❓ Quanto tempo por dia preciso estudar?",
      answer: "Recomendamos 15-30 minutos por dia para resultados consistentes.\n\nO segredo não é estudar horas seguidas, mas sim estudar UM POUCO TODOS OS DIAS.\n\nNosso método de repetição espaçada é otimizado para sessões curtas. Você aprende mais em 15min focados do que em 2h de aula cansativa.\n\nDistribuição ideal:\n• Manhã: 5-10min (leitura do conteúdo)\n• Tarde/Noite: 10-15min (questões práticas)\n• Total: 15-25min/dia"
    },
    {
      question: "❓ Posso pausar quando quiser?",
      answer: "Sim! Total flexibilidade:\n\n• Plano Gratuito: Pause a qualquer momento\n• Planos Pagos: Pause por até 3 meses sem perder progresso\n\nQuando voltar, você continua exatamente de onde parou.\n\nIdeal para:\n• Férias\n• Mudança de concurso\n• Imprevistos pessoais\n• Reajuste de estratégia\n\nSem burocracia, sem taxas, sem pegadinha."
    },
    {
      question: "❓ Como funciona a garantia de 7 dias?",
      answer: "Simples e transparente:\n\n1. Assine qualquer plano pago (Calouro ou Veterano)\n2. Use por até 7 dias\n3. Se não gostar por QUALQUER motivo, envie email para: contato@passarei.com.br\n4. Devolvemos 100% do seu dinheiro\n\nSem perguntas incômodas.\nSem \"mas por quê?\".\nSem burocracia.\n\nAcreditamos tanto no Passarei que assumimos TODO o risco."
    },
    {
      question: "❓ Precisa de internet o tempo todo?",
      answer: "Sim, o WhatsApp precisa de conexão para funcionar.\n\nMAS o consumo de dados é mínimo:\n• Textos: ~50KB cada\n• Questões: ~100KB cada\n• Total: menos de 1MB por dia\n\nQualquer plano de internet móvel básico é suficiente.\n\nSe ficar sem internet:\n• As mensagens chegam quando você reconectar\n• Nada se perde\n• Você continua de onde parou"
    },
    {
      question: "❓ Por que não tem videoaulas?",
      answer: "Decisão estratégica baseada em ciência:\n\nVideoaulas são passivas:\n• Você assiste e acha que aprendeu\n• Mas não testou o conhecimento\n• Taxa de retenção: ~10%\n\nNosso método é ativo:\n• Você lê (atenção plena)\n• Pratica imediatamente (questões)\n• Revisa programadamente (memória longo prazo)\n• Taxa de retenção: ~70%\n\nAlém disso:\n• Você estuda em QUALQUER lugar (ônibus, fila, etc)\n• Sem precisar de fone, tela grande ou concentração total\n• 3x mais rápido que videoaulas\n\nEstudos provam: Leitura + Prática > Vídeos"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-muted-foreground">
            Tire todas as suas dúvidas
          </p>
        </div>

        <Accordion type="single" collapsible className="mb-8">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} data-testid={`faq-item-${index}`}>
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToForm}
            className="border-2 border-primary text-primary hover:bg-green-50 px-8 py-6 text-lg font-semibold hover-elevate active-elevate-2"
            data-testid="button-faq-cta"
          >
            💬 Ainda tem dúvidas? Fale com a gente
          </Button>
        </div>
      </div>
    </section>
  );
}
