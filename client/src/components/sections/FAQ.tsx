import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export function FAQ() {
  const scrollToForm = () => {
    document
      .getElementById("lead-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const faqs = [
    {
      number: 1,
      question: "Como funciona exatamente? Preciso baixar algum app?",
      answer:
        "Não precisa baixar nada! O Passarei funciona 100% pelo Telegram.\n\nVocê receberá mensagens diárias com:\n• Conteúdos explicativos (5-10min leitura)\n• Questões de provas reais (10-15min prática)\n• Revisões programadas (quando o algoritmo decidir)\n\nÉ como ter um professor particular no seu bolso, disponível 24/7.\n\nBasta ter o telegram instalado e conexão com internet.",
    },
    {
      number: 2,
      question: "Funciona para qual concurso policial?",
      answer:
        "Atualmente cobrimos:\n✅ PM (Polícia Militar) - Todos os estados\n✅ PC (Polícia Civil) - Todos os estados\n✅ PRF (Polícia Rodoviária Federal)\n✅ PF (Polícia Federal)\n✅ Outros concursos policiais federais/estaduais\n\nVocê informa qual concurso está estudando no cadastro e nosso sistema adapta TODO o conteúdo automaticamente.\n\nMatérias cobertas:\n• Português\n• Direito Constitucional\n• Direito Administrativo\n• Direito Penal\n• Direito Processual Penal\n• Legislação Penal Extravagante",
    },
    {
      number: 3,
      question: "E se eu não souber meu edital ainda?",
      answer:
        "Sem problemas! Você pode começar estudando as matérias mais comuns em concursos policiais (que caem em 90% das provas).\n\nQuando seu edital sair:\n1. Envie o link pelo Telegram\n2. Nossa IA analisa em segundos\n3. Ajustamos seu plano automaticamente\n4. Você continua de onde parou\n\nZero retrabalho, zero perda de tempo.",
    },
    {
      number: 4,
      question: "Quais são os limites de cada plano?",
      answer:
        "PLANO FREE (R$ 0):\n• 2 matérias por dia (60/mês)\n• 2 correções de exercícios/dia\n• SEM correção de redação\n• Suporte em até 24h\n\nPLANO CALOURO (R$ 12,90/mês):\n• 10 matérias por dia (300/mês)\n• 10 correções de exercícios/dia\n• 1 redação GRÁTIS/dia (30/mês)\n• Redações extras: R$ 1,90\n• Suporte em até 2h\n\nPLANO VETERANO (R$ 9,90/mês no anual):\n• 30 matérias por dia (900/mês)\n• 30 correções de exercícios/dia\n• 3 redações GRÁTIS/dia (90/mês)\n• Redações extras: R$ 0,99\n• Suporte VIP em até 30min (24/7)\n• Programa de afiliados (20% comissão)",
    },
    {
      number: 5,
      question: "Quanto tempo por dia preciso estudar?",
      answer:
        "Recomendamos 15-30 minutos por dia para resultados consistentes.\n\nO segredo não é estudar horas seguidas, mas sim estudar UM POUCO TODOS OS DIAS.\n\nNosso método de repetição espaçada é otimizado para sessões curtas. Você aprende mais em 15min focados do que em 2h de aula cansativa.\n\nDistribuição ideal:\n• Manhã: 5-10min (leitura do conteúdo)\n• Tarde/Noite: 10-15min (questões práticas)\n• Total: 15-25min/dia",
    },
    {
      number: 6,
      question: "Posso pausar quando quiser?",
      answer:
        "Sim! Total flexibilidade:\n\n• Plano Gratuito: Pause a qualquer momento\n• Planos Pagos: Pause por até 3 meses sem perder progresso\n\nQuando voltar, você continua exatamente de onde parou.\n\nIdeal para:\n• Férias\n• Mudança de concurso\n• Imprevistos pessoais\n• Reajuste de estratégia\n\nSem burocracia, sem taxas, sem pegadinha.",
    },
    {
      number: 7,
      question: "Como funciona a garantia de 7 dias?",
      answer:
        'Simples e transparente:\n\n1. Receba 5 questões gratuitas para conhecer e após assinar o plano pago (Veterano)\n2. Use por até 7 dias\n3. Se não gostar por QUALQUER motivo, envie email para: suporte@passarei.com.br\n4. Devolvemos 100% do seu dinheiro\n\nSem perguntas incômodas.\nSem "mas por quê?".\nSem burocracia.\n\nAcreditamos tanto no Passarei que assumimos TODO o risco.',
    },
    {
      number: 8,
      question: "Como vocês são tão mais baratos que os concorrentes?",
      answer:
        "Automação inteligente:\n\n• Cursinhos tradicionais: R$ 129,90/ano\n• Passarei Veterano: R$ 49,90/mês\n• ECONOMIA: R$ 960,00 (61.58%) ano\n\nComo?\n• 100% Telegram (sem app caro)\n• IA faz correções (sem professor humano)\n• Conteúdo automatizado (sem filmagens)\n• Infraestrutura enxuta (sem aluguel de espaço)\n\nRepassamos TODA economia para você.\n\nMesmo conteúdo, menor custo.\n\nAlém disso:\n• Plano Veterano inclui 2 redações/mês (vs 1-2 dos concorrentes)\n• Suporte mais rápido (30min vs 2 dias)\n• Você estuda onde já está (Telegram)",
    },
  ];

  return (
    <section id="faq" className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-muted-foreground">
            Tire todas as suas dúvidas
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-0">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              data-testid={`faq-item-${index}`}
              className="border-b border-gray-200"
            >
              <AccordionTrigger className="flex items-start justify-between w-full text-left py-4 hover:no-underline">
                <span className="flex items-start gap-3 flex-1 pr-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#18cb96] text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {faq.number}
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-11 pb-4 text-gray-600 whitespace-pre-line leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-16">
          <div className="w-full px-4 md:px-0">
            <a
              href="https://wa.me/5527999999999?text=Olá,%20tenho%20dúvidas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 border-2 border-[#18cb96] text-[#18cb96] rounded-lg font-semibold text-lg hover:bg-[#18cb96] hover:text-white transition-all shadow-md hover:shadow-lg"
              data-testid="button-faq-cta"
              aria-label="Entrar em contato via Telegram"
            >
              💬 Dúvidas? Chama a gente
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
