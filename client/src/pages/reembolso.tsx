import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";

export default function Reembolso() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Política de Reembolso</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Garantia de 7 Dias</h2>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <p className="text-green-900 font-medium">
                <strong>Garantia Incondicional:</strong> Oferecemos <strong>7 dias de garantia incondicional</strong> para todos 
                os planos pagos (Calouro e Veterano).
              </p>
            </div>
            <p className="text-foreground mb-4">
              Se você não estiver satisfeito com o Passarei por <strong>qualquer motivo</strong>, pode solicitar 
              reembolso total dentro de 7 dias corridos da data da compra.
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
              <li><strong>Sem perguntas:</strong> Não pedimos justificativa (embora feedback seja bem-vindo)</li>
              <li><strong>Sem burocracia:</strong> Processo simples e rápido</li>
              <li><strong>100% do valor:</strong> Reembolso completo do valor pago</li>
              <li><strong>Todos os planos pagos:</strong> Válido para Calouro (R$ 12,90) e Veterano (R$ 118,80)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Como Solicitar Reembolso</h2>
            <p className="text-foreground mb-4">
              Para solicitar reembolso dentro do período de garantia de 7 dias:
            </p>
            
            <div className="bg-gray-100 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-foreground mb-3">Passo a Passo:</h3>
              <ol className="list-decimal pl-6 text-foreground mb-4 space-y-3">
                <li>
                  <strong>Envie um email para:</strong> suporte@passarei.com.br
                  <ul className="list-disc pl-6 mt-2">
                    <li>Assunto: "Solicitação de Reembolso"</li>
                  </ul>
                </li>
                <li>
                  <strong>Informe os seguintes dados:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Nome completo cadastrado</li>
                    <li>Email cadastrado na plataforma</li>
                    <li>Motivo (opcional, mas nos ajuda a melhorar)</li>
                  </ul>
                </li>
                <li>
                  <strong>Aguarde confirmação:</strong> Responderemos em até <strong>2 dias úteis</strong> 
                  confirmando o processamento do reembolso
                </li>
                <li>
                  <strong>Receba o valor:</strong> O reembolso será creditado em <strong>5-10 dias úteis</strong> 
                  no mesmo método de pagamento original
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-blue-900 font-medium">
                <strong>Importante:</strong> O prazo de 7 dias começa a contar a partir da <strong>data de confirmação do pagamento</strong>, 
                não da data de cadastro na plataforma.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Elegibilidade para Reembolso</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">3.1 Situações Elegíveis</h3>
              <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
                <li><strong>Primeira assinatura:</strong> Primeira vez que assina um plano pago</li>
                <li><strong>Dentro de 7 dias:</strong> Solicitação feita dentro do período de garantia</li>
                <li><strong>Planos mensais:</strong> Assinatura do Plano Calouro (R$ 12,90/mês)</li>
                <li><strong>Planos anuais:</strong> Assinatura do Plano Veterano (R$ 118,80/ano)</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">3.2 Situações NÃO Elegíveis</h3>
              <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
                <li><strong>Renovações automáticas:</strong> Após o primeiro período, não há reembolso (apenas cancelamento)</li>
                <li><strong>Após 7 dias:</strong> Solicitações fora do prazo de garantia (neste caso, cancele para não renovar)</li>
                <li><strong>Violação dos Termos:</strong> Contas suspensas por descumprimento dos Termos de Uso</li>
                <li><strong>Uso fraudulento:</strong> Atividade suspeita ou tentativa de fraude</li>
                <li><strong>Múltiplas solicitações:</strong> Padrão de assinar, pedir reembolso e reassinar repetidamente</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Método de Reembolso</h2>
            <p className="text-foreground mb-4">
              O reembolso sempre será processado através do <strong>mesmo método de pagamento original</strong>:
            </p>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">4.1 Cartão de Crédito</h3>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li><strong>Prazo:</strong> 5-10 dias úteis após aprovação</li>
                <li><strong>Onde aparece:</strong> O estorno aparecerá na próxima fatura do cartão</li>
                <li><strong>Descrição:</strong> Geralmente como "Reembolso Passarei" ou similar</li>
                <li><strong>Variação:</strong> Algumas operadoras levam até 2 ciclos de fatura</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">4.2 PIX</h3>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li><strong>Prazo:</strong> 2-5 dias úteis após aprovação</li>
                <li><strong>Dados necessários:</strong> Confirmaremos a chave PIX cadastrada</li>
                <li><strong>Notificação:</strong> Você receberá confirmação por email antes do depósito</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">4.3 Boleto Bancário</h3>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li><strong>Prazo:</strong> 5-7 dias úteis após aprovação e confirmação de dados</li>
                <li><strong>Dados necessários:</strong> Banco, agência, conta e CPF do titular</li>
                <li><strong>Transferência:</strong> Via TED/DOC para a conta informada</li>
              </ul>
            </div>

            <p className="text-foreground mb-4">
              <em>Nota: O prazo começa a contar após a aprovação do reembolso pela nossa equipe, não da data 
              da solicitação.</em>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Cancelamento (Sem Reembolso)</h2>
            <p className="text-foreground mb-4">
              Se você estiver <strong>fora do período de garantia de 7 dias</strong>, você pode cancelar sua 
              assinatura a qualquer momento, mas não haverá reembolso do período já pago.
            </p>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">5.1 Como Cancelar</h3>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li>Através das configurações da sua conta na plataforma</li>
                <li>Email para: suporte@passarei.com.br</li>
                <li>Mensagem via WhatsApp</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">5.2 O Que Acontece Após Cancelamento</h3>
              <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
                <li><strong>Acesso mantido:</strong> Você continua usando todos os recursos até o final do período pago</li>
                <li><strong>Sem renovação:</strong> A assinatura não será renovada automaticamente</li>
                <li><strong>Dados preservados:</strong> Seu progresso é mantido por 30 dias (para eventual reativação)</li>
                <li><strong>Reativação:</strong> Pode voltar a qualquer momento sem perder histórico (se dentro dos 30 dias)</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Exceções e Casos Especiais</h2>
            <p className="text-foreground mb-4">
              Mesmo após o período de 7 dias, <strong>podemos considerar reembolso</strong> em situações excepcionais:
            </p>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">6.1 Casos Elegíveis para Análise</h3>
              <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
                <li>
                  <strong>Cobrança duplicada:</strong> Reembolso total e imediato da cobrança extra
                </li>
                <li>
                  <strong>Erro técnico grave:</strong> Impossibilidade de usar a plataforma por mais de 7 dias 
                  consecutivos devido a problemas técnicos do nosso lado
                </li>
                <li>
                  <strong>Cobrança não autorizada:</strong> Fraude ou uso indevido do cartão/conta
                </li>
                <li>
                  <strong>Problemas de saúde:</strong> Impedimento de uso por motivos médicos graves 
                  (com apresentação de atestado)
                </li>
              </ul>
              <p className="text-foreground mb-4">
                <em>Estes casos serão analisados individualmente pela nossa equipe e requerem documentação comprobatória.</em>
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">6.2 NÃO Concedemos Reembolso</h3>
              <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
                <li><strong>Falta de engajamento pessoal:</strong> "Não tive tempo para estudar"</li>
                <li><strong>Mudança de planos:</strong> "Desisti de prestar o concurso"</li>
                <li><strong>Expectativas não alinhadas:</strong> "Achei que seria diferente" (use o período de 7 dias!)</li>
                <li><strong>Violação dos Termos de Uso:</strong> Compartilhamento de conta, uso indevido, etc.</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Planos Específicos</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">7.1 Plano Gratuito</h3>
              <p className="text-foreground mb-4">
                O plano gratuito não envolve pagamento e, portanto, não se aplica política de reembolso. 
                Você pode cancelar a qualquer momento sem custos.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">7.2 Plano Calouro (Mensal - R$ 12,90/mês)</h3>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li><strong>Primeiros 7 dias:</strong> Reembolso total de R$ 12,90</li>
                <li><strong>Após 7 dias:</strong> Sem reembolso, apenas cancelamento (acesso até fim do mês pago)</li>
                <li><strong>Renovação automática:</strong> Cobrada mensalmente até cancelamento</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">7.3 Plano Veterano (Anual - R$ 118,80/ano)</h3>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li><strong>Primeiros 7 dias:</strong> Reembolso total de R$ 118,80</li>
                <li><strong>Após 7 dias:</strong> Sem reembolso, apenas cancelamento (acesso até fim dos 12 meses)</li>
                <li><strong>Sem reembolso proporcional:</strong> Não fazemos reembolso de meses não utilizados</li>
                <li><strong>Renovação automática:</strong> Cobrada anualmente até cancelamento</li>
              </ul>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-4">
                <p className="text-amber-900 font-medium">
                  <strong>Dica:</strong> Teste primeiro com o Plano Calouro (mensal) antes de assinar o Plano Veterano (anual) 
                  se ainda tiver dúvidas sobre a plataforma.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Upgrades e Downgrades</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">8.1 Upgrade (Gratuito → Calouro → Veterano)</h3>
              <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
                <li><strong>Pagamento:</strong> Apenas da diferença proporcional ao período restante</li>
                <li><strong>Mudança:</strong> Imediata - recursos premium disponíveis instantaneamente</li>
                <li><strong>Garantia de 7 dias:</strong> Se aplica normalmente ao novo plano</li>
              </ul>
              <p className="text-foreground mb-4">
                <em>Exemplo: Se você está no Plano Calouro há 15 dias e faz upgrade para Veterano, pagará a 
                diferença proporcional e a garantia de 7 dias começa a contar da data do upgrade.</em>
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">8.2 Downgrade (Veterano → Calouro → Gratuito)</h3>
              <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
                <li><strong>Sem reembolso proporcional:</strong> Você mantém acesso ao plano atual até o fim do período pago</li>
                <li><strong>Mudança efetiva:</strong> No próximo ciclo de cobrança</li>
                <li><strong>Recursos premium:</strong> Permanecem disponíveis até o final do período pago</li>
              </ul>
              <p className="text-foreground mb-4">
                <em>Exemplo: Se você assinou o Plano Veterano (anual) e quer fazer downgrade para Calouro (mensal), 
                continuará com acesso total por 12 meses. Após esse período, será cobrado mensalmente no Plano Calouro.</em>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Perguntas Frequentes</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">Posso pedir reembolso se não passei no concurso?</h3>
              <p className="text-foreground mb-4">
                Não. O Passarei é uma ferramenta de apoio aos estudos. Não garantimos aprovação em concursos, 
                pois o resultado depende de múltiplos fatores, incluindo dedicação individual. Use o período de 
                garantia de 7 dias para avaliar se a plataforma atende suas necessidades.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">Posso pedir reembolso múltiplas vezes?</h3>
              <p className="text-foreground mb-4">
                A garantia de 7 dias é válida para a primeira assinatura de cada plano. Padrões de 
                assinar-reembolsar-reassinar repetidamente podem resultar na negação de futuros reembolsos 
                e possível suspensão da conta.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">E se eu esquecer de cancelar antes da renovação?</h3>
              <p className="text-foreground mb-4">
                Renovações automáticas não são elegíveis para reembolso. Recomendamos configurar lembretes 
                ou cancelar com antecedência se não pretende continuar.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">Quanto tempo demora para o dinheiro voltar?</h3>
              <p className="text-foreground mb-4">
                Após aprovação do reembolso: 5-10 dias úteis (cartão de crédito), 2-5 dias úteis (PIX), 
                ou 5-7 dias úteis (boleto/transferência bancária). O prazo pode variar conforme a operadora/banco.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contato</h2>
            <p className="text-foreground mb-4">
              Para solicitar reembolso ou tirar dúvidas sobre esta política:
            </p>
            <ul className="list-none text-foreground mb-4 space-y-2">
              <li><strong>Email de Suporte:</strong> suporte@passarei.com.br</li>
              <li><strong>Assunto:</strong> "Solicitação de Reembolso" ou "Dúvida sobre Reembolso"</li>
              <li><strong>Horário de Atendimento:</strong> Segunda a sexta, 9h às 18h (horário de Brasília)</li>
              <li><strong>Prazo de Resposta:</strong> Até 2 dias úteis para solicitações de reembolso</li>
              <li><strong>Prazo de Resposta:</strong> Até 5 dias úteis para dúvidas gerais</li>
            </ul>
          </section>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
            <p className="text-foreground font-semibold mb-2">
              Nossa Promessa de Satisfação
            </p>
            <p className="text-foreground mb-3">
              Queremos que você tenha <strong>confiança total</strong> ao investir no Passarei. Por isso, 
              oferecemos 7 dias de garantia incondicional.
            </p>
            <p className="text-foreground">
              Se a plataforma não atender suas expectativas, devolvemos seu dinheiro. <strong>Sem perguntas, 
              sem burocracia.</strong> Simples assim.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-4">
            <p className="text-foreground font-semibold mb-2">
              Documentos Relacionados
            </p>
            <p className="text-foreground">
              Leia também nossos <a href="/termos" className="text-primary hover:underline">Termos de Uso</a> e 
              {" "}<a href="/privacidade" className="text-primary hover:underline">Política de Privacidade</a>.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
