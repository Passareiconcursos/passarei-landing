import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";

export default function Reembolso() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Política de Reembolso
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            <strong>Última atualização:</strong> 17 de novembro de 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              1. Garantia de 7 Dias
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O Passarei oferece garantia incondicional de reembolso de 7 dias
              para os planos pagos:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>
                <strong>Plano Calouro (R$ 89,90/mês)</strong>
              </li>
              <li>
                <strong>Plano Veterano (R$ 538,80/ano ou R$ 44,90/mês)</strong>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Se você não estiver satisfeito por{" "}
              <strong>qualquer motivo</strong> dentro dos primeiros 7 dias após
              a compra, devolveremos 100% do seu dinheiro.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              2. Como Solicitar Reembolso
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Passo a passo:</strong>
            </p>
            <ol className="list-decimal pl-6 text-muted-foreground mb-4 space-y-3">
              <li>
                <strong>Envie um e-mail para:</strong> suporte@passarei.com.br
              </li>
              <li>
                <strong>Informe:</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Seu nome completo</li>
                  <li>E-mail cadastrado</li>
                  <li>Número do pedido ou comprovante de pagamento</li>
                  <li>Motivo do reembolso (opcional)</li>
                </ul>
              </li>
              <li>
                <strong>Aguarde confirmação:</strong> Responderemos em até 24
                horas
              </li>
              <li>
                <strong>Receba seu dinheiro de volta:</strong> Em até 5 dias
                úteis
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              3. Prazo de Processamento
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>3.1 Aprovação do Reembolso:</strong> Até 24 horas após
              solicitação
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>3.2 Devolução do Valor:</strong>
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>
                <strong>PIX:</strong> Até 2 dias úteis
              </li>
              <li>
                <strong>Cartão de Crédito:</strong> Até 2 faturas (conforme
                operadora)
              </li>
              <li>
                <strong>Boleto:</strong> Até 5 dias úteis via transferência
                bancária
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              4. Condições da Garantia
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>4.1 Dentro dos 7 Dias:</strong>
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>✅ Reembolso integral (100%)</li>
              <li>✅ Sem perguntas incômodas</li>
              <li>✅ Sem burocracia</li>
              <li>✅ Sem necessidade de justificativa detalhada</li>
            </ul>

            <p className="text-muted-foreground leading-relaxed mb-4 mt-6">
              <strong>4.2 Após os 7 Dias:</strong>
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>❌ Não há reembolso automático</li>
              <li>
                ✅ Cancelamento continua disponível (vale até o final do período
                pago)
              </li>
              <li>
                ⚠️ Reembolso somente em casos excepcionais (falha grave do
                serviço)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              5. Reembolso de Correções de Redação Extras
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Correções de redação adquiridas separadamente:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>
                <strong>Plano Calouro:</strong> Correções extras por R$ 1,99 cada
              </li>
              <li>
                <strong>Plano Veterano:</strong> 2 correções/mês inclusas, extras por R$ 1,99
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4 mt-4">
              <strong>Política de reembolso:</strong>
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>
                ✅ Reembolso integral se a correção não for entregue em até 2
                horas (Plano Veterano) ou 24 horas (Plano Calouro)
              </li>
              <li>✅ Reembolso integral se houver falha técnica na correção</li>
              <li>
                ❌ Sem reembolso se a correção foi entregue conforme prometido
                (mesmo que você não concorde com a nota)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              6. Cancelamento vs Reembolso
            </h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-foreground font-semibold mb-2">
                📌 Entenda a diferença:
              </p>
              <p className="text-muted-foreground leading-relaxed mb-2">
                <strong>Cancelamento:</strong> Você para de ser cobrado, mas
                mantém acesso até o final do período já pago. Pode ser feito a
                qualquer momento.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Reembolso:</strong> Você recebe o dinheiro de volta e
                perde o acesso imediatamente. Somente disponível nos primeiros 7
                dias.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              7. Situações Especiais
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>7.1 Cobrança Indevida:</strong>
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Se você foi cobrado por engano (cobrança duplicada, valor
              incorreto, etc.), entre em contato imediatamente. Faremos o
              reembolso integral independentemente do prazo de 7 dias.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-4 mt-6">
              <strong>7.2 Falha Grave do Serviço:</strong>
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Se houver indisponibilidade prolongada (mais de 48h consecutivas)
              ou falha que impeça totalmente o uso da plataforma, você poderá
              solicitar reembolso proporcional mesmo após os 7 dias.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-4 mt-6">
              <strong>7.3 Mudança de Plano:</strong>
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Se você mudar de plano (ex: Calouro → Veterano), não há reembolso
              do plano anterior. O novo plano entra em vigor imediatamente e
              você perde acesso aos dias restantes do plano antigo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              8. Programa de Afiliados (Comissões)
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Reembolso de indicados:</strong>
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Se um usuário que você indicou solicitar reembolso dentro dos 7
              dias:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>A comissão correspondente será estornada</li>
              <li>
                Se você já recebeu a comissão, será descontada dos próximos
                pagamentos
              </li>
              <li>
                Isso vale apenas para o primeiro mês (período de garantia)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              9. Exceções (Sem Direito a Reembolso)
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Não oferecemos reembolso nas seguintes situações:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>❌ Mudança de ideia após 7 dias da compra</li>
              <li>
                ❌ Não aprovação em concurso (resultados dependem de múltiplos
                fatores)
              </li>
              <li>
                ❌ Incompatibilidade com método de estudo (você teve 7 dias para
                testar)
              </li>
              <li>
                ❌ Falta de tempo para estudar (problema pessoal, não da
                plataforma)
              </li>
              <li>
                ❌ Violação dos Termos de Uso (compartilhamento de conta, uso
                indevido, etc)
              </li>
              <li>
                ❌ Cancelamento solicitado após os 7 dias (acesso continua até
                fim do período pago)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              10. Nossa Promessa
            </h2>
            <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-4">
              <p className="text-foreground font-bold text-lg mb-3">
                💚 Assumimos TODO o risco
              </p>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Acreditamos tanto na qualidade do Passarei que oferecemos 7 dias
                de garantia incondicional. Se não funcionar para você,
                devolvemos seu dinheiro sem perguntas incômodas.
              </p>
              <p className="text-muted-foreground leading-relaxed font-semibold">
                Zero risco. Zero burocracia. Zero estresse.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              11. Contato
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Para solicitar reembolso ou esclarecer dúvidas:
            </p>
            <ul className="list-none text-muted-foreground mb-4 space-y-2">
              <li>
                <strong>E-mail:</strong> suporte@passarei.com.br
              </li>
              <li>
                <li>
                  <strong>Telegram:</strong> Disponível via bot de estudos
                </li>
              </li>
              <li>
                <strong>Horário de Atendimento:</strong> Segunda a sexta, 9h às
                18h
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4 mt-4">
              Respondemos solicitações de reembolso em até 24 horas, mesmo fora
              do horário comercial.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
