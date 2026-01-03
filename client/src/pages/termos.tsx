import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";

export default function Termos() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Termos de Uso
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            <strong>Última atualização:</strong> 17 de novembro de 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              1. Aceitação dos Termos
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ao acessar e utilizar a plataforma Passarei ("Plataforma"), você
              concorda em cumprir e estar vinculado aos seguintes Termos de Uso.
              Se você não concordar com estes termos, não utilize nossa
              Plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              2. Descrição do Serviço
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O Passarei é uma plataforma educacional que oferece preparação
              para concursos policiais através do Telegram, utilizando
              inteligência artificial para personalização de conteúdo.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Planos disponíveis:</strong>
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>
                <strong>Gratuito (R$ 0):</strong> 21 questões grátis (única vez)
                para testar a plataforma, correção detalhada com IA, sem cartão
                de crédito
              </li>
              <li>
                <strong>Calouro (R$ 89,90/mês):</strong> 300 questões
                personalizadas/mês, correção detalhada de cada alternativa,
                explicações completas com IA, sem compromisso - cancele quando
                quiser, créditos não expiram
              </li>
              <li>
                <strong>
                  Veterano (R$ 44,90/mês cobrado anualmente - R$ 538,80/ano):
                </strong>{" "}
                30 questões/dia (10.800/ano), 2 correções de redação/mês com IA,
                intensivo nas dificuldades, revisão espaçada inteligente, plano
                de estudos personalizado, simulados mensais, suporte
                prioritário, troque de concurso quando quiser
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              3. Cadastro e Conta
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Para utilizar determinados recursos da Plataforma, você precisará
              pessoais como nome e e-mail. Você é responsável por. Você é
              responsável por manter a confidencialidade de suas credenciais de
              acesso.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              4. Pagamentos e Assinaturas
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>4.1 Planos Pagos:</strong> Os planos Calouro e Veterano
              são oferecidos mediante pagamento de assinatura mensal ou anual.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>4.2 Formas de Pagamento:</strong> Aceitamos PIX, cartão de
              crédito e boleto bancário através do Mercado Pago.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>4.3 Renovação Automática:</strong> As assinaturas são
              renovadas automaticamente no final de cada período, exceto se
              canceladas antes da data de renovação.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>4.4 Correção de Redação Extra:</strong> Usuários dos
              planos pagos podem adquirir correções de redação adicionais:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>Plano Calouro: R$ 1,90 por redação extra</li>
              <li>
                Plano Veterano: R$ 0,99 por redação extra (50% de desconto)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              5. Garantia de Reembolso
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Oferecemos garantia incondicional de 7 dias para os planos Calouro
              e Veterano. Se você não estiver satisfeito por qualquer motivo,
              entre em contato conosco em até 7 dias após a compra para
              solicitar reembolso integral.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              E-mail para reembolso: <strong>suporte@passarei.com.br</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              6. Programa de Afiliados (Plano Veterano)
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Usuários do Plano Veterano têm acesso ao programa de afiliados com
              as seguintes condições:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>
                Comissão de 20% recorrente sobre mensalidades de indicados
              </li>
              <li>
                Pagamento via PIX após 30 dias da primeira mensalidade do
                indicado
              </li>
              <li>Saque mínimo de R$ 20,00</li>
              <li>Dashboard de acompanhamento disponível via Telegram</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              7. Programa de Indicação (Planos Gratuito e Calouro)
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Plano Gratuito:</strong> Indique 5 amigos que se tornem
              assinantes pagantes e ganhe 1 mês grátis do Plano Calouro.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Plano Calouro:</strong> Indique 3 amigos que se tornem
              assinantes pagantes e ganhe 1 mês grátis.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              8. Cancelamento
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Você pode cancelar sua assinatura a qualquer momento através do
              Telegram ou e-mail. O cancelamento entrará em vigor ao final do
              período de cobrança atual.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Após o cancelamento, você manterá acesso aos recursos pagos até o
              final do período já pago.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              9. Uso Aceitável
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Você concorda em NÃO:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>Compartilhar sua conta com terceiros</li>
              <li>Usar a Plataforma para fins ilegais ou não autorizados</li>
              <li>Tentar burlar os limites de conteúdo de cada plano</li>
              <li>
                Copiar, reproduzir ou distribuir conteúdo da Plataforma sem
                autorização
              </li>
              <li>Fazer engenharia reversa ou tentar acessar código-fonte</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              10. Propriedade Intelectual
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Todo conteúdo disponibilizado pela Plataforma (textos, questões,
              explicações, algoritmos) é de propriedade exclusiva do Passarei e
              está protegido por leis de direitos autorais.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              11. Limitação de Responsabilidade
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O Passarei é uma ferramenta de apoio aos estudos. Não garantimos
              aprovação em concursos públicos, pois o resultado depende de
              múltiplos fatores, incluindo dedicação pessoal, edital específico
              e número de vagas.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Não nos responsabilizamos por:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>
                Interrupções temporárias do serviço por manutenção ou problemas
                técnicos
              </li>
              <li>
                Indisponibilidade do Telegram ou de provedores de internet
              </li>
              <li>
                Perda de dados por problemas técnicos fora do nosso controle
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              12. Modificações nos Termos
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Reservamo-nos o direito de modificar estes Termos a qualquer
              momento. Alterações significativas serão comunicadas via Telegram
              ou e-mail com 7 dias de antecedência.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              13. Lei Aplicável
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Estes Termos são regidos pelas leis da República Federativa do
              Brasil. Qualquer disputa será resolvida no foro da comarca de São
              Paulo/SP.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              14. Contato
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Para dúvidas sobre estes Termos de Uso:
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
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
