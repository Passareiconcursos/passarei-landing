import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";

export default function Privacidade() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Política de Privacidade</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introdução</h2>
            <p className="text-foreground mb-4">
              O Passarei Tecnologia Educacional Ltda ("Passarei", "nós", "nosso") está comprometido em proteger 
              a privacidade e os dados pessoais de seus usuários.
            </p>
            <p className="text-foreground mb-4">
              Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações 
              pessoais em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong> 
              e demais legislações aplicáveis.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-blue-900 font-medium">
                <strong>Compromisso com a Privacidade:</strong> Respeitamos sua privacidade e nunca vendemos seus dados pessoais 
                a terceiros. Seus dados são usados exclusivamente para fornecer e melhorar nossos serviços educacionais.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Dados Coletados</h2>
            <p className="text-foreground mb-4">
              Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços:
            </p>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">2.1 Dados de Cadastro</h3>
              <p className="text-foreground mb-2">Informações fornecidas por você ao criar uma conta:</p>
              <ul className="list-disc pl-6 text-foreground mb-4 space-y-1">
                <li><strong>Nome completo:</strong> Para personalização e identificação</li>
                <li><strong>Email:</strong> Para comunicação e recuperação de conta</li>
                <li><strong>WhatsApp (com DDD):</strong> Para entrega de conteúdo educacional</li>
                <li><strong>Concurso pretendido:</strong> PM, PC, PRF ou PF - para personalizar o conteúdo</li>
                <li><strong>Estado:</strong> Para conteúdo regionalizado quando aplicável</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">2.2 Dados de Uso e Progresso</h3>
              <p className="text-foreground mb-2">Informações geradas automaticamente pelo seu uso da plataforma:</p>
              <ul className="list-disc pl-6 text-foreground mb-4 space-y-1">
                <li><strong>Questões respondidas:</strong> Histórico completo de respostas</li>
                <li><strong>Taxa de acertos:</strong> Percentual de acertos por matéria</li>
                <li><strong>Tempo de estudo:</strong> Tempo dedicado por sessão e total</li>
                <li><strong>Progresso por disciplina:</strong> Desempenho em cada área do conhecimento</li>
                <li><strong>Interações com IA:</strong> Conversas e solicitações ao assistente</li>
                <li><strong>Sessões de uso:</strong> Data, hora e duração de cada acesso</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">2.3 Dados Técnicos</h3>
              <p className="text-foreground mb-2">Informações coletadas automaticamente para segurança e melhorias:</p>
              <ul className="list-disc pl-6 text-foreground mb-4 space-y-1">
                <li><strong>Endereço IP:</strong> Para segurança e prevenção de fraudes</li>
                <li><strong>Tipo de dispositivo:</strong> Smartphone, tablet, desktop</li>
                <li><strong>Navegador e versão:</strong> Para compatibilidade</li>
                <li><strong>Sistema operacional:</strong> iOS, Android, Windows, etc.</li>
                <li><strong>Localização aproximada:</strong> Baseada no IP (cidade/estado)</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">2.4 Dados de Pagamento</h3>
              <p className="text-foreground mb-4">
                Processamos pagamentos através de plataformas terceiras certificadas (Stripe/Mercado Pago). 
                <strong> Não armazenamos dados completos de cartão de crédito.</strong>
              </p>
              <p className="text-foreground mb-2">Armazenamos apenas:</p>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li>Histórico de transações (data, valor, status)</li>
                <li>Últimos 4 dígitos do cartão (para identificação)</li>
                <li>Método de pagamento utilizado</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">2.5 Cookies e Tecnologias Similares</h3>
              <p className="text-foreground mb-4">
                Utilizamos cookies para melhorar sua experiência. Consulte nossa 
                {" "}<a href="/cookies" className="text-primary hover:underline">Política de Cookies</a> para mais detalhes.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Como Usamos Seus Dados</h2>
            <p className="text-foreground mb-4">
              Utilizamos suas informações pessoais para as seguintes finalidades:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
              <li><strong>Fornecer o serviço:</strong> Entregar conteúdo educacional via WhatsApp, processar questões, 
              gerar estatísticas de desempenho</li>
              <li><strong>Personalizar sua experiência:</strong> Adaptar conteúdo ao seu concurso, nível de conhecimento 
              e padrão de estudos usando IA</li>
              <li><strong>Processar pagamentos:</strong> Gerenciar assinaturas, cobranças e reembolsos</li>
              <li><strong>Comunicação:</strong> Enviar conteúdo diário, notificações importantes, atualizações de serviço 
              e suporte ao cliente</li>
              <li><strong>Melhorar a plataforma:</strong> Analisar métricas de uso para identificar melhorias e corrigir bugs</li>
              <li><strong>Segurança:</strong> Detectar e prevenir fraudes, abuso e violações dos Termos de Uso</li>
              <li><strong>Cumprimento legal:</strong> Atender solicitações de autoridades quando exigido por lei</li>
              <li><strong>Marketing:</strong> Enviar novidades sobre novos recursos (você pode cancelar a qualquer momento)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Compartilhamento de Dados</h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-900 font-medium">
                <strong>Importante:</strong> NÃO vendemos, alugamos ou comercializamos seus dados pessoais com terceiros para 
                fins de marketing.
              </p>
            </div>
            <p className="text-foreground mb-4">
              Compartilhamos seus dados apenas com parceiros essenciais para operação do serviço:
            </p>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">4.1 Provedores de Serviço</h3>
              <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
                <li><strong>Supabase:</strong> Banco de dados (armazenamento em São Paulo, Brasil)</li>
                <li><strong>Vercel:</strong> Hospedagem da plataforma web</li>
                <li><strong>n8n:</strong> Automação de fluxos de trabalho</li>
                <li><strong>WhatsApp Business API:</strong> Entrega de mensagens educacionais</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">4.2 Processadores de Pagamento</h3>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li><strong>Stripe:</strong> Processamento de pagamentos internacionais</li>
                <li><strong>Mercado Pago:</strong> Processamento de pagamentos no Brasil</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">4.3 Provedores de IA</h3>
              <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
                <li><strong>OpenAI (ChatGPT):</strong> Geração de conteúdo personalizado e assistente virtual</li>
                <li><strong>Anthropic (Claude):</strong> Análise de desempenho e recomendações de estudo</li>
              </ul>
              <p className="text-foreground mb-4">
                <em>Nota: Enviamos apenas dados necessários (questões, respostas, progresso) sem informações pessoais 
                identificáveis quando possível.</em>
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">4.4 Ferramentas de Analytics</h3>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li><strong>Google Analytics:</strong> Análise de tráfego e comportamento</li>
                <li><strong>Meta Pixel (Facebook):</strong> Medição de campanhas publicitárias</li>
              </ul>
            </div>

            <p className="text-foreground mb-4">
              <strong>Contratos de Confidencialidade:</strong> Todos os parceiros citados assinam contratos de 
              confidencialidade e processamento de dados (DPA - Data Processing Agreement) conforme exigido pela LGPD.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Armazenamento e Segurança</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">5.1 Localização dos Dados</h3>
              <p className="text-foreground mb-4">
                Seus dados são armazenados em servidores localizados no <strong>Brasil (Supabase - São Paulo)</strong>, 
                garantindo conformidade com a LGPD e soberania nacional de dados.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">5.2 Medidas de Segurança</h3>
              <p className="text-foreground mb-4">
                Implementamos diversas camadas de segurança para proteger seus dados:
              </p>
              <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
                <li><strong>Criptografia em trânsito:</strong> HTTPS/TLS para todas as comunicações</li>
                <li><strong>Criptografia em repouso:</strong> AES-256 para dados armazenados</li>
                <li><strong>Backups diários:</strong> Cópias de segurança automáticas com retenção de 30 dias</li>
                <li><strong>Controle de acesso:</strong> Acesso restrito a dados pessoais apenas para equipe autorizada</li>
                <li><strong>Autenticação de dois fatores:</strong> Para acesso administrativo</li>
                <li><strong>Monitoramento contínuo:</strong> Detecção de anomalias e tentativas de invasão</li>
                <li><strong>Auditorias regulares:</strong> Revisões de segurança trimestrais</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">5.3 Notificação de Incidentes</h3>
              <p className="text-foreground mb-4">
                Em caso de incidente de segurança que afete seus dados pessoais, notificaremos você e a 
                Autoridade Nacional de Proteção de Dados (ANPD) em até <strong>72 horas</strong>, conforme 
                exigido pela LGPD.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Seus Direitos (LGPD)</h2>
            <p className="text-foreground mb-4">
              De acordo com a LGPD, você tem os seguintes direitos sobre seus dados pessoais:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
              <li><strong>Confirmação e Acesso:</strong> Confirmar se tratamos seus dados e solicitar cópia completa</li>
              <li><strong>Correção:</strong> Atualizar dados incompletos, inexatos ou desatualizados</li>
              <li><strong>Exclusão:</strong> Solicitar eliminação de dados (direito ao esquecimento), exceto quando 
              retenção for obrigatória por lei</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado e interoperável (CSV/JSON)</li>
              <li><strong>Revogação do Consentimento:</strong> Retirar consentimento a qualquer momento</li>
              <li><strong>Oposição:</strong> Opor-se a tratamentos realizados com base em legítimo interesse</li>
              <li><strong>Anonimização/Bloqueio:</strong> Solicitar anonimização ou bloqueio de dados desnecessários</li>
              <li><strong>Informação sobre Compartilhamento:</strong> Saber com quem compartilhamos seus dados</li>
              <li><strong>Revisão de Decisões Automatizadas:</strong> Solicitar revisão humana de decisões tomadas 
              exclusivamente por algoritmos</li>
            </ul>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <p className="text-green-900 font-medium">
                <strong>Para exercer seus direitos:</strong> Envie email para suporte@passarei.com.br
              </p>
              <p className="text-green-900 mt-2">
                <strong>Prazo de Resposta:</strong> Até 15 dias corridos a partir da solicitação
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Retenção de Dados</h2>
            <p className="text-foreground mb-4">
              Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política:
            </p>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">7.1 Conta Ativa</h3>
              <p className="text-foreground mb-4">
                Enquanto você mantiver sua conta ativa, armazenamos todos os dados necessários para fornecer o serviço.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">7.2 Conta Cancelada</h3>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li><strong>Dados de estudo e progresso:</strong> Mantidos por 30 dias (para possível reativação), 
                depois excluídos permanentemente</li>
                <li><strong>Dados de cadastro:</strong> 30 dias, depois excluídos</li>
                <li><strong>Backups:</strong> Dados podem permanecer em backups por até 90 dias, depois são sobrescritos</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">7.3 Obrigações Legais</h3>
              <p className="text-foreground mb-4">
                Alguns dados devem ser mantidos por períodos específicos conforme legislação brasileira:
              </p>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li><strong>Dados financeiros e fiscais:</strong> 5 anos (Código Civil e legislação tributária)</li>
                <li><strong>Registros de acesso:</strong> 6 meses (Marco Civil da Internet)</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Crianças e Adolescentes</h2>
            <p className="text-foreground mb-4">
              Nossos serviços são destinados a pessoas com <strong>18 anos ou mais</strong>.
            </p>
            <p className="text-foreground mb-4">
              Não coletamos intencionalmente dados de menores de 18 anos sem consentimento dos pais ou responsáveis legais. 
              Se identificarmos que coletamos dados de um menor sem autorização adequada, deletaremos imediatamente 
              essas informações.
            </p>
            <p className="text-foreground mb-4">
              Se você é pai/mãe ou responsável legal e acredita que seu filho forneceu dados pessoais sem seu 
              consentimento, entre em contato conosco imediatamente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Transferência Internacional de Dados</h2>
            <p className="text-foreground mb-4">
              Embora nossos principais servidores estejam no Brasil, alguns parceiros tecnológicos podem estar 
              localizados em outros países:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li><strong>OpenAI/Anthropic:</strong> Estados Unidos</li>
              <li><strong>Vercel:</strong> Estados Unidos</li>
            </ul>
            <p className="text-foreground mb-4">
              Nesses casos, garantimos que:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>A transferência atende aos requisitos da LGPD</li>
              <li>Os países destinatários têm nível adequado de proteção de dados ou</li>
              <li>Existem cláusulas contratuais específicas de proteção de dados (Standard Contractual Clauses)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Alterações nesta Política</h2>
            <p className="text-foreground mb-4">
              Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas 
              práticas, tecnologias ou requisitos legais.
            </p>
            <p className="text-foreground mb-4">
              Quando fizermos alterações significativas, notificaremos você por:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>Email para o endereço cadastrado</li>
              <li>Mensagem via WhatsApp</li>
              <li>Aviso destacado na plataforma</li>
            </ul>
            <p className="text-foreground mb-4">
              A data da última atualização está sempre indicada no topo desta página. Recomendamos que você 
              revise esta política periodicamente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Encarregado de Dados (DPO)</h2>
            <p className="text-foreground mb-4">
              Conforme exigido pela LGPD, designamos um Encarregado de Proteção de Dados (DPO - Data Protection Officer) 
              responsável por aceitar reclamações e comunicações dos titulares, prestar esclarecimentos e adotar 
              providências.
            </p>
            <p className="text-foreground mb-4">
              <strong>Contato do Encarregado de Dados:</strong>
            </p>
            <ul className="list-none text-foreground mb-4">
              <li><strong>Email:</strong> suporte@passarei.com.br</li>
              <li><strong>Prazo de Resposta:</strong> Até 15 dias corridos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Informações de Contato</h2>
            <p className="text-foreground mb-4">
              Para questões sobre privacidade, proteção de dados ou para exercer seus direitos:
            </p>
            <ul className="list-none text-foreground mb-4">
              <li><strong>Empresa:</strong> Passarei Tecnologia Educacional Ltda</li>
              <li><strong>CNPJ:</strong> 00.000.000/0001-00</li>
              <li><strong>Endereço:</strong> Vitória, ES, Brasil</li>
              <li><strong>Email Geral:</strong> suporte@passarei.com.br</li>
              <li><strong>Email Privacidade:</strong> suporte@passarei.com.br</li>
              <li><strong>Website:</strong> https://passarei.com.br</li>
            </ul>
          </section>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-8">
            <p className="text-foreground font-semibold mb-2">
              Seu Controle, Nossa Responsabilidade
            </p>
            <p className="text-foreground">
              Você tem total controle sobre seus dados pessoais. Se tiver qualquer dúvida ou preocupação sobre 
              privacidade, estamos à disposição para ajudar. Sua confiança é fundamental para nós.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
