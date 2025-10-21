import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";

export default function Termos() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Termos de Uso</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Aceitação dos Termos</h2>
            <p className="text-foreground mb-4">
              Ao acessar e usar o Passarei ("Plataforma"), você concorda em estar legalmente vinculado a estes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, você não deve usar nossos serviços.
            </p>
            <p className="text-foreground mb-4">
              Ao se cadastrar e utilizar o Passarei, você declara que tem capacidade legal para firmar este contrato e 
              que leu, compreendeu e aceitou todas as condições aqui estabelecidas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Descrição do Serviço</h2>
            <p className="text-foreground mb-4">
              O Passarei é uma plataforma educacional SaaS (Software as a Service) desenvolvida para auxiliar 
              candidatos em sua preparação para concursos policiais, incluindo:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
              <li>Conteúdo educacional personalizado entregue via WhatsApp</li>
              <li>Banco de questões de concursos públicos (PM, PC, PRF, PF)</li>
              <li>Sistema de repetição espaçada baseado em inteligência artificial</li>
              <li>Acompanhamento de progresso e estatísticas de desempenho</li>
              <li>Simulados e preparação para Teste de Aptidão Física (TAF)</li>
            </ul>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
              <p className="text-amber-900 font-medium">
                <strong>Importante:</strong> O Passarei é uma ferramenta de apoio aos estudos. Não garantimos aprovação em 
                concursos públicos, pois o resultado depende do esforço, dedicação e condições individuais de cada candidato.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Cadastro e Conta</h2>
            <p className="text-foreground mb-4">
              Para utilizar os serviços do Passarei, você deve:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
              <li><strong>Fornecer informações verdadeiras e atualizadas:</strong> Nome completo, email, número de WhatsApp com DDD, concurso pretendido e estado</li>
              <li><strong>Ter pelo menos 18 anos de idade</strong> ou possuir autorização dos pais/responsáveis legais</li>
              <li><strong>Manter a confidencialidade:</strong> Você é responsável por manter sua senha segura e protegida</li>
              <li><strong>Notificar-nos imediatamente:</strong> Informar qualquer uso não autorizado ou suspeita de violação de segurança</li>
              <li><strong>Não compartilhar credenciais:</strong> Sua conta é pessoal e intransferível</li>
            </ul>
            <p className="text-foreground mb-4">
              Reservamo-nos o direito de recusar o cadastro, suspender ou encerrar contas que violem estes termos 
              ou que sejam usadas de forma inadequada.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Planos e Pagamentos</h2>
            <p className="text-foreground mb-4">
              O Passarei oferece três planos de serviço:
            </p>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">4.1 Plano Gratuito</h3>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li>1 conteúdo por dia</li>
                <li>3 questões por dia</li>
                <li>Recursos básicos</li>
                <li>Sem custo, válido indefinidamente</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">4.2 Plano Calouro</h3>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li>R$ 29,90 por mês</li>
                <li>Conteúdo ilimitado</li>
                <li>Assistente de IA completo</li>
                <li>Questões ilimitadas</li>
                <li>Renovação automática mensal</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">4.3 Plano Veterano</h3>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li>R$ 238,80 por ano (equivalente a R$ 19,90/mês)</li>
                <li>Todos os recursos do Plano Calouro</li>
                <li>Preparação para TAF (Teste de Aptidão Física)</li>
                <li>Simulados completos</li>
                <li>Renovação automática anual</li>
                <li>Economia de 33% em relação ao plano mensal</li>
              </ul>
            </div>

            <p className="text-foreground mb-4">
              <strong>Processamento de Pagamentos:</strong> Os pagamentos são processados por plataformas terceiras 
              seguras (Stripe e/ou Mercado Pago). Não armazenamos dados de cartão de crédito.
            </p>
            <p className="text-foreground mb-4">
              <strong>Renovação Automática:</strong> Os planos pagos são renovados automaticamente ao final de cada 
              período (mensal ou anual). Você pode cancelar a renovação automática a qualquer momento.
            </p>
            <p className="text-foreground mb-4">
              <strong>Política de Reembolso:</strong> Consulte nossa <a href="/reembolso" className="text-primary hover:underline">Política de Reembolso</a> completa.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Uso Adequado da Plataforma</h2>
            <p className="text-foreground mb-4">
              Ao usar o Passarei, você concorda em NÃO:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
              <li><strong>Compartilhar sua conta:</strong> Cada assinatura é individual e intransferível</li>
              <li><strong>Revender ou redistribuir conteúdo:</strong> Todo material é licenciado apenas para uso pessoal</li>
              <li><strong>Usar para fins ilegais:</strong> Qualquer atividade que viole leis brasileiras</li>
              <li><strong>Automatizar ou usar bots:</strong> Scripts, scrapers ou qualquer forma de automação não autorizada</li>
              <li><strong>Tentar hackear ou burlar sistemas:</strong> Acesso não autorizado a áreas restritas</li>
              <li><strong>Copiar ou reproduzir questões:</strong> Sem autorização expressa por escrito</li>
              <li><strong>Interferir no funcionamento:</strong> Ações que prejudiquem outros usuários ou a plataforma</li>
              <li><strong>Criar múltiplas contas gratuitas:</strong> Para obter mais recursos do plano gratuito</li>
            </ul>
            <p className="text-foreground mb-4">
              Violações destes termos podem resultar em suspensão ou encerramento imediato da conta, sem reembolso.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Propriedade Intelectual</h2>
            <p className="text-foreground mb-4">
              Todo o conteúdo disponibilizado no Passarei, incluindo mas não se limitando a:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>Textos, questões e resoluções</li>
              <li>Imagens, gráficos e vídeos</li>
              <li>Logos, marcas e design</li>
              <li>Software, código-fonte e algoritmos de IA</li>
              <li>Metodologia de repetição espaçada</li>
            </ul>
            <p className="text-foreground mb-4">
              É de propriedade exclusiva do Passarei Tecnologia Educacional Ltda ou de seus licenciadores e está 
              protegido por leis de direitos autorais, marcas registradas e outras leis de propriedade intelectual 
              aplicáveis no Brasil e internacionalmente.
            </p>
            <p className="text-foreground mb-4">
              <strong>Licença de Uso:</strong> Ao assinar nossos serviços, você recebe uma licença limitada, não exclusiva, 
              não transferível e revogável para acessar e usar o conteúdo exclusivamente para fins de estudo pessoal.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Limitação de Responsabilidade</h2>
            <p className="text-foreground mb-4">
              O Passarei é fornecido "como está" e "conforme disponível", sem garantias de qualquer tipo, expressas ou implícitas.
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
              <li><strong>Não garantimos aprovação:</strong> O Passarei é uma ferramenta de apoio. Resultados dependem de esforço individual</li>
              <li><strong>Não nos responsabilizamos por:</strong> Erros no conteúdo, interrupções de serviço, perda de dados, ou problemas técnicos</li>
              <li><strong>Uso por conta e risco:</strong> Você assume total responsabilidade pelo uso da plataforma</li>
              <li><strong>Conteúdo de terceiros:</strong> Não somos responsáveis por conteúdo de links externos</li>
              <li><strong>Compatibilidade:</strong> Não garantimos funcionamento em todos os dispositivos ou versões de WhatsApp</li>
            </ul>
            <p className="text-foreground mb-4">
              Em nenhuma hipótese o Passarei será responsável por danos diretos, indiretos, incidentais, especiais, 
              consequenciais ou punitivos decorrentes do uso ou impossibilidade de uso de nossos serviços.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Cancelamento e Suspensão</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">8.1 Cancelamento pelo Usuário</h3>
              <p className="text-foreground mb-4">
                Você pode cancelar sua assinatura a qualquer momento através de:
              </p>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li>Configurações da conta na plataforma</li>
                <li>Email para: suporte@passarei.com.br</li>
                <li>Mensagem no WhatsApp</li>
              </ul>
              <p className="text-foreground mb-4">
                Após o cancelamento, você manterá acesso aos recursos pagos até o final do período já pago.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">8.2 Suspensão pelo Passarei</h3>
              <p className="text-foreground mb-4">
                Podemos suspender ou encerrar sua conta imediatamente, sem aviso prévio, em caso de:
              </p>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li>Violação destes Termos de Uso</li>
                <li>Uso fraudulento ou ilegal da plataforma</li>
                <li>Compartilhamento de conta</li>
                <li>Tentativa de burlar sistemas de segurança</li>
                <li>Não pagamento de valores devidos</li>
              </ul>
              <p className="text-foreground mb-4">
                Contas suspendidas por violação dos termos não terão direito a reembolso.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Modificações dos Termos</h2>
            <p className="text-foreground mb-4">
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Quando fizermos alterações 
              significativas, notificaremos você por:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>Email para o endereço cadastrado</li>
              <li>Mensagem via WhatsApp</li>
              <li>Aviso na plataforma</li>
            </ul>
            <p className="text-foreground mb-4">
              O uso continuado da plataforma após a notificação de alterações constitui aceitação dos novos termos. 
              Se você não concordar com as modificações, deve cancelar sua conta.
            </p>
            <p className="text-foreground mb-4">
              A data da última atualização está sempre indicada no topo desta página.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Lei Aplicável e Jurisdição</h2>
            <p className="text-foreground mb-4">
              Estes Termos de Uso são regidos e interpretados de acordo com as leis da República Federativa do Brasil.
            </p>
            <p className="text-foreground mb-4">
              Quaisquer disputas, controvérsias ou reivindicações decorrentes destes termos serão submetidas ao 
              foro da comarca de <strong>Vitória, Estado do Espírito Santo</strong>, com exclusão de qualquer outro, 
              por mais privilegiado que seja.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Informações da Empresa</h2>
            <p className="text-foreground mb-4">
              <strong>Razão Social:</strong> Passarei Tecnologia Educacional Ltda<br />
              <strong>CNPJ:</strong> 00.000.000/0001-00<br />
              <strong>Endereço:</strong> Vitória, ES, Brasil<br />
              <strong>Email:</strong> suporte@passarei.com.br<br />
              <strong>Website:</strong> https://passarei.com.br
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Contato</h2>
            <p className="text-foreground mb-4">
              Para dúvidas, sugestões ou reclamações sobre estes Termos de Uso, entre em contato:
            </p>
            <ul className="list-none text-foreground mb-4">
              <li><strong>Email de Suporte:</strong> suporte@passarei.com.br</li>
              <li><strong>Email Jurídico:</strong> juridico@passarei.com.br</li>
              <li><strong>Prazo de Resposta:</strong> Até 5 dias úteis</li>
            </ul>
          </section>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <p className="text-foreground font-semibold mb-2">
              Documentos Relacionados
            </p>
            <p className="text-foreground">
              Leia também nossa <a href="/privacidade" className="text-primary hover:underline">Política de Privacidade</a>, 
              {" "}<a href="/cookies" className="text-primary hover:underline">Política de Cookies</a> e 
              {" "}<a href="/reembolso" className="text-primary hover:underline">Política de Reembolso</a>.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
