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
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Informações que Coletamos</h2>
            <p className="text-foreground mb-4">
              Coletamos as seguintes informações quando você usa o Passarei:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li><strong>Dados de Cadastro:</strong> Nome, email, WhatsApp, estado, tipo de concurso</li>
              <li><strong>Dados de Uso:</strong> Progresso nos estudos, respostas a questões, tempo de estudo</li>
              <li><strong>Dados Técnicos:</strong> Endereço IP, tipo de dispositivo, navegador</li>
              <li><strong>Dados de Pagamento:</strong> Processados por terceiros seguros (não armazenamos dados de cartão)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Como Usamos Suas Informações</h2>
            <p className="text-foreground mb-4">
              Utilizamos seus dados para:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>Personalizar seu conteúdo de estudos</li>
              <li>Enviar mensagens educacionais via WhatsApp</li>
              <li>Processar pagamentos e gerenciar assinaturas</li>
              <li>Melhorar nossos serviços através de análises</li>
              <li>Comunicar atualizações importantes</li>
              <li>Prevenir fraudes e garantir segurança</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Base Legal (LGPD)</h2>
            <p className="text-foreground mb-4">
              Processamos seus dados com base em:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li><strong>Consentimento:</strong> Você autorizou o uso de seus dados ao se cadastrar</li>
              <li><strong>Execução de Contrato:</strong> Necessário para fornecer nossos serviços</li>
              <li><strong>Legítimo Interesse:</strong> Melhorias e segurança da plataforma</li>
              <li><strong>Obrigação Legal:</strong> Cumprimento de leis aplicáveis</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Compartilhamento de Dados</h2>
            <p className="text-foreground mb-4">
              Compartilhamos seus dados apenas com:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li><strong>Processadores de Pagamento:</strong> Para processar transações financeiras</li>
              <li><strong>Serviços de WhatsApp:</strong> Para entregar conteúdo educacional</li>
              <li><strong>Ferramentas de Analytics:</strong> Para melhorar a plataforma</li>
              <li><strong>Autoridades:</strong> Quando exigido por lei</li>
            </ul>
            <p className="text-foreground mb-4">
              <strong>Nunca vendemos seus dados pessoais a terceiros.</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Segurança dos Dados</h2>
            <p className="text-foreground mb-4">
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>Criptografia SSL/TLS para transmissão de dados</li>
              <li>Armazenamento seguro em servidores protegidos</li>
              <li>Controle de acesso restrito a dados pessoais</li>
              <li>Monitoramento contínuo de segurança</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Seus Direitos (LGPD)</h2>
            <p className="text-foreground mb-4">
              Você tem direito a:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li><strong>Acesso:</strong> Solicitar cópia dos seus dados</li>
              <li><strong>Correção:</strong> Atualizar dados incorretos</li>
              <li><strong>Exclusão:</strong> Solicitar remoção dos seus dados</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
              <li><strong>Oposição:</strong> Opor-se ao processamento em certas situações</li>
            </ul>
            <p className="text-foreground mb-4">
              Para exercer seus direitos, envie email para: <strong>privacidade@passarei.com.br</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Retenção de Dados</h2>
            <p className="text-foreground mb-4">
              Mantemos seus dados pelo tempo necessário para:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>Fornecer nossos serviços enquanto você for usuário ativo</li>
              <li>Cumprir obrigações legais (ex: registros fiscais por 5 anos)</li>
              <li>Resolver disputas e fazer cumprir acordos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Cookies</h2>
            <p className="text-foreground mb-4">
              Usamos cookies para melhorar sua experiência. Veja nossa <a href="/cookies" className="text-primary hover:underline">Política de Cookies</a> para mais detalhes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Alterações nesta Política</h2>
            <p className="text-foreground mb-4">
              Podemos atualizar esta política periodicamente. Mudanças significativas serão comunicadas por email ou através da plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contato</h2>
            <p className="text-foreground mb-4">
              Para questões sobre privacidade:
            </p>
            <ul className="list-none text-foreground mb-4">
              <li>Email: privacidade@passarei.com.br</li>
              <li>DPO (Encarregado de Dados): dpo@passarei.com.br</li>
              <li>WhatsApp: (11) 99999-9999</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
