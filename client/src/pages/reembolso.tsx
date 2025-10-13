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
            <p className="text-foreground mb-4">
              Oferecemos uma <strong>garantia incondicional de 7 dias</strong> para todos os nossos planos pagos (Calouro e Veterano).
            </p>
            <p className="text-foreground mb-4">
              Se você não estiver satisfeito com o Passarei por qualquer motivo, pode solicitar reembolso total dentro de 7 dias corridos da data da compra. <strong>Sem perguntas, sem burocracia.</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Como Solicitar Reembolso</h2>
            <p className="text-foreground mb-4">
              Para solicitar reembolso dentro do período de garantia:
            </p>
            <ol className="list-decimal pl-6 text-foreground mb-4">
              <li>Envie email para: <strong>reembolso@passarei.com.br</strong></li>
              <li>Informe o email cadastrado e motivo (opcional)</li>
              <li>Aguarde confirmação em até 24 horas úteis</li>
              <li>Receba o valor em até 5-10 dias úteis no mesmo método de pagamento</li>
            </ol>
            <p className="text-foreground mb-4">
              <strong>Importante:</strong> O prazo de 7 dias começa a contar a partir da data de confirmação do pagamento, não da data de cadastro.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Cancelamento de Assinatura</h2>
            <p className="text-foreground mb-4">
              Você pode cancelar sua assinatura a qualquer momento através de:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>Configurações da Conta → "Cancelar Assinatura"</li>
              <li>Email para: cancelamento@passarei.com.br</li>
              <li>WhatsApp: (11) 99999-9999</li>
            </ul>
            <p className="text-foreground mb-4">
              <strong>Após o cancelamento:</strong>
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>Você mantém acesso até o final do período pago</li>
              <li>Não haverá cobrança no próximo ciclo</li>
              <li>Seus dados de progresso são mantidos por 30 dias</li>
              <li>Pode reativar a qualquer momento sem perder histórico</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Reembolso Após 7 Dias</h2>
            <p className="text-foreground mb-4">
              Após o período de garantia de 7 dias, <strong>não oferecemos reembolso</strong>, exceto em casos excepcionais:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li><strong>Cobrança Duplicada:</strong> Reembolso total da cobrança extra</li>
              <li><strong>Erro Técnico:</strong> Impossibilidade de usar a plataforma por mais de 7 dias consecutivos</li>
              <li><strong>Problemas de Saúde:</strong> Com apresentação de atestado médico</li>
              <li><strong>Cobranças Não Autorizadas:</strong> Fraude ou uso indevido</li>
            </ul>
            <p className="text-foreground mb-4">
              Estes casos serão analisados individualmente pela nossa equipe.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Plano Gratuito</h2>
            <p className="text-foreground mb-4">
              O plano gratuito não envolve pagamento e, portanto, não se aplica política de reembolso. Você pode cancelar a qualquer momento sem custos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Plano Anual (Veterano)</h2>
            <p className="text-foreground mb-4">
              Para o plano anual:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li><strong>Primeiros 7 dias:</strong> Reembolso total de R$ 238,80</li>
              <li><strong>Após 7 dias:</strong> Sem reembolso, exceto casos excepcionais</li>
              <li><strong>Cancelamento:</strong> Acesso mantido até o final dos 12 meses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Processamento de Reembolso</h2>
            <p className="text-foreground mb-4">
              <strong>Prazos de reembolso por método de pagamento:</strong>
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li><strong>Cartão de Crédito:</strong> 5-10 dias úteis (dependendo da operadora)</li>
              <li><strong>Pix:</strong> Até 2 dias úteis</li>
              <li><strong>Boleto:</strong> 5-7 dias úteis após confirmação de dados bancários</li>
            </ul>
            <p className="text-foreground mb-4">
              O prazo começa a contar após a aprovação do reembolso pela nossa equipe.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Condições Especiais</h2>
            <p className="text-foreground mb-4">
              <strong>Não concedemos reembolso em casos de:</strong>
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>Violação dos Termos de Uso</li>
              <li>Compartilhamento de conta com terceiros</li>
              <li>Uso indevido da plataforma</li>
              <li>Fraude ou tentativa de fraude</li>
              <li>Falta de estudo/engajamento pessoal</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Upgrades e Downgrades</h2>
            <p className="text-foreground mb-4">
              <strong>Upgrade (Gratuito → Calouro → Veterano):</strong>
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>Pagamento apenas da diferença proporcional</li>
              <li>Mudança imediata de recursos</li>
              <li>Garantia de 7 dias se aplica</li>
            </ul>
            <p className="text-foreground mb-4">
              <strong>Downgrade (Veterano → Calouro → Gratuito):</strong>
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>Sem reembolso proporcional</li>
              <li>Mudança efetiva no próximo ciclo de cobrança</li>
              <li>Acesso aos recursos premium mantido até o final do período pago</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contato</h2>
            <p className="text-foreground mb-4">
              Para solicitar reembolso ou tirar dúvidas:
            </p>
            <ul className="list-none text-foreground mb-4">
              <li><strong>Email:</strong> reembolso@passarei.com.br</li>
              <li><strong>Suporte:</strong> contato@passarei.com.br</li>
              <li><strong>WhatsApp:</strong> (11) 99999-9999</li>
            </ul>
            <p className="text-foreground mb-4">
              <strong>Horário de atendimento:</strong> Segunda a sexta, 9h às 18h (horário de Brasília)
            </p>
          </section>

          <section className="mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-foreground font-semibold mb-2">
                💚 Nossa Promessa
              </p>
              <p className="text-foreground">
                Queremos que você tenha confiança total no Passarei. Por isso, oferecemos garantia de 7 dias sem perguntas. Se não funcionar para você, devolvemos seu dinheiro. Simples assim.
              </p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
