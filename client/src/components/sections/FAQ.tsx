import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export function FAQ() {
  const faqs = [
    {
      number: 1,
      question: "Como o Passarei funciona na prática?",
      answer:
        "Não precisa baixar nada! O Passarei funciona 100% pelo Telegram.\n\nVocê receberá mensagens diárias com:\n• Conteúdos explicativos (5min de leitura)\n• Questões de provas reais (5-10min de prática)\n• Revisões programadas (quando o algoritmo decidir)\n\nÉ como ter um professor particular no seu bolso, disponível 24/7.\n\nBasta ter o Telegram instalado e conexão com internet.",
    },
    {
      number: 2,
      question: "Funciona para qual concurso policial?",
      answer:
        "Atualmente cobrimos:\n✅ PM (Polícia Militar) - Todos os estados\n✅ PC (Polícia Civil) - Todos os estados\n✅ PRF (Polícia Rodoviária Federal)\n✅ PF (Polícia Federal)\n✅ Entre outros concursos policiais federais/estaduais\n\nVocê informa qual concurso está estudando no cadastro e nosso sistema adapta TODO o conteúdo automaticamente.\n\nMatérias cobertas:\n• Português\n• Direito Constitucional\n• Direito Administrativo\n• Direito Penal\n• Direito Processual Penal\n• Legislação Penal Extravagante\n• E inumeras outras matérias pertinentes.",
    },
    {
      number: 3,
      question: "E se eu não souber meu edital ainda?",
      answer:
        "Sem problemas! Você inicia os estudos com as matérias mais comuns em concursos policiais (que caem em 90% das provas).\n\nQuando seu edital sair:\n1. Envie o link pelo Telegram\n2. Nossa IA analisa em segundos\n3. Ajustamos seu plano automaticamente\n4. Você continua de onde parou\n\nZero retrabalho, zero perda de tempo.",
    },
    {
      number: 4,
      question: "Quais são os limites de cada plano?",
      answer:
        "PLANO FREE (R$ 0):\n• 21 questões grátis (única vez)\n• Correção detalhada com IA\n• Sem cartão de crédito\n\nPLANO CALOURO (R$ 89,90/mês):\n• 300 questões personalizadas/mês\n• Correção detalhada de cada alternativa\n• Explicações completas com IA\n• Sem compromisso - cancele quando quiser\n\nPLANO VETERANO (R$ 44,90/mês cobrado anualmente):\n• 900 questões/mês (3x mais que Calouro!)\n• 2 correções de redação/mês com IA\n• Intensivo nas suas dificuldades\n• Revisão espaçada inteligente\n• Plano de estudos personalizado\n• Simulados mensais\n• Suporte prioritário\n• Troque de concurso quando quiser\n• Poupe R$ 540/ano vs Calouro mensal",
    },
    {
      number: 5,
      question: "Quanto tempo por dia preciso estudar?",
      answer:
        "Recomendamos 15-20 minutos por dia para resultados consistentes.\n\nO segredo não é estudar horas seguidas, mas sim estudar UM POUCO TODOS OS DIAS.\n\nNosso método de repetição espaçada é otimizado para sessões curtas. Você aprende mais em 15 min focados do que em 2h de aula cansativa.\n\nDistribuição ideal:\n• Manhã: 5 min (conteúdo do dia)\n• Noite: 10 min (questões + revisão)\n• Total: 15 min/dia\n\nTem mais tempo? Ótimo! Mas 15 min DIÁRIOS já garantem ótimos resultados.",
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
        'Simples e transparente:\n\n1. Receba 21 questões gratuitas para conhecer a plataforma\n2. Assine o plano pago (Calouro ou Veterano)\n3. Use por até 7 dias\n4. Se não gostar por QUALQUER motivo, envie email para: suporte@passarei.com.br\n5. Devolvemos 100% do seu dinheiro\n\nSem perguntas incômodas.\nSem "mas por quê?".\nSem burocracia.\n\nAcreditamos tanto no Passarei que assumimos TODO o risco.',
    },
    {
      number: 8,
      question: "Como vocês são tão mais baratos que os concorrentes?",
      answer:
        "Automação inteligente:\n\n• Estratégia Concursos: a partir de R$ 109,90/mês\n• Passarei Veterano: R$ 44,90/mês (anual)\n• ECONOMIA: até 80%!\n\nComo?\n• 100% Telegram (sem app caro)\n• IA faz correções (sem professor humano)\n• Conteúdo automatizado (sem filmagens)\n• Infraestrutura enxuta (sem aluguel de espaço)\n\nRepassamos TODA economia para você.\n\nMesmo conteúdo, menor custo.\n\nAlém disso:\n• Plano Veterano inclui 2 redações/mês\n• 900 questões/mês (3x mais que Calouro!)\n• São 10.800 questões de simulados por ano!\n• Poupe R$ 540/ano vs Calouro mensal\n• Suporte prioritário\n• Intensivo nas suas dificuldades",
    },
  ];

  return (
    <section id="faq" className="py-12 md:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-[#18cb96]/10 text-[#18cb96] rounded-full text-sm font-semibold mb-4">
            ❓ Tire suas dúvidas
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-gray-600">
            Tudo que você precisa saber antes de começar
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.number}
              value={`item-${faq.number}`}
              className="border border-gray-200 rounded-xl px-6 bg-gray-50/50"
            >
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-[#18cb96] py-6">
                <span className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#18cb96] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {faq.number}
                  </span>
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6 whitespace-pre-line">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Ainda tem dúvidas?</p>
          <Button
            asChild
            variant="outline"
            className="border-[#18cb96] text-[#18cb96] hover:bg-[#18cb96] hover:text-white"
          >
            <a href="mailto:suporte@passarei.com.br">Fale Conosco</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
