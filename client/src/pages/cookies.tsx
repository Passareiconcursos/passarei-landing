import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Política de Cookies</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. O Que São Cookies?</h2>
            <p className="text-foreground mb-4">
              Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site. Eles ajudam o site a lembrar suas preferências e melhorar sua experiência de navegação.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Como Usamos Cookies</h2>
            <p className="text-foreground mb-4">
              O Passarei utiliza cookies para:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>Manter você conectado à sua conta</li>
              <li>Lembrar suas preferências e configurações</li>
              <li>Analisar como você usa nossa plataforma</li>
              <li>Personalizar conteúdo e anúncios</li>
              <li>Medir a eficácia de nossas campanhas de marketing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Tipos de Cookies que Utilizamos</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">3.1 Cookies Essenciais</h3>
              <p className="text-foreground mb-2">
                Necessários para o funcionamento básico da plataforma:
              </p>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li><strong>Autenticação:</strong> Mantém você conectado durante a sessão</li>
                <li><strong>Segurança:</strong> Protege contra fraudes e ataques</li>
                <li><strong>Funcionalidade:</strong> Permite recursos como formulários e chat</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">3.2 Cookies de Performance</h3>
              <p className="text-foreground mb-2">
                Coletam informações sobre como você usa a plataforma:
              </p>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li><strong>Google Analytics:</strong> Analisa tráfego e comportamento</li>
                <li><strong>Hotjar:</strong> Grava sessões para melhorias de UX</li>
                <li><strong>Métricas:</strong> Mede tempo de carregamento e erros</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">3.3 Cookies de Marketing</h3>
              <p className="text-foreground mb-2">
                Usados para exibir anúncios relevantes:
              </p>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li><strong>Meta Pixel (Facebook):</strong> Rastreia conversões de anúncios</li>
                <li><strong>Google Ads:</strong> Remarketing e medição de campanha</li>
                <li><strong>LinkedIn Insight Tag:</strong> Anúncios B2B direcionados</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">3.4 Cookies de Preferência</h3>
              <p className="text-foreground mb-2">
                Lembram suas escolhas pessoais:
              </p>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li><strong>Idioma:</strong> Armazena idioma preferido</li>
                <li><strong>Tema:</strong> Modo claro/escuro</li>
                <li><strong>Layout:</strong> Preferências de visualização</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Cookies de Terceiros</h2>
            <p className="text-foreground mb-4">
              Alguns cookies são definidos por serviços terceiros que aparecem em nossas páginas:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li><strong>Google Analytics:</strong> analytics.google.com</li>
              <li><strong>Facebook Pixel:</strong> facebook.com</li>
              <li><strong>Stripe:</strong> stripe.com (processamento de pagamentos)</li>
              <li><strong>WhatsApp Business:</strong> whatsapp.com</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Gerenciamento de Cookies</h2>
            <p className="text-foreground mb-4">
              Você pode controlar e gerenciar cookies de várias formas:
            </p>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">5.1 Configurações do Navegador</h3>
              <p className="text-foreground mb-2">
                A maioria dos navegadores permite:
              </p>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li>Bloquear todos os cookies</li>
                <li>Aceitar apenas cookies de origem</li>
                <li>Excluir cookies ao fechar o navegador</li>
                <li>Receber notificações quando cookies são definidos</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">5.2 Ferramentas de Opt-Out</h3>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">tools.google.com/dlpage/gaoptout</a></li>
                <li><strong>Facebook:</strong> Configurações de anúncios no seu perfil</li>
                <li><strong>Network Advertising:</strong> <a href="http://www.networkadvertising.org/choices/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">networkadvertising.org/choices</a></li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Impacto de Desabilitar Cookies</h2>
            <p className="text-foreground mb-4">
              Ao desabilitar cookies, você pode:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>Não conseguir fazer login na plataforma</li>
              <li>Perder preferências e configurações salvas</li>
              <li>Ter experiência de usuário degradada</li>
              <li>Ver conteúdo menos relevante</li>
            </ul>
            <p className="text-foreground mb-4">
              <strong>Cookies essenciais não podem ser desabilitados,</strong> pois são necessários para o funcionamento básico da plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Duração dos Cookies</h2>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li><strong>Cookies de Sessão:</strong> Expiram quando você fecha o navegador</li>
              <li><strong>Cookies Persistentes:</strong> Permanecem por um período definido (geralmente 30-365 dias)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Atualizações desta Política</h2>
            <p className="text-foreground mb-4">
              Podemos atualizar esta Política de Cookies periodicamente. A data da última atualização está no topo da página.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contato</h2>
            <p className="text-foreground mb-4">
              Para dúvidas sobre nossa Política de Cookies:
            </p>
            <ul className="list-none text-foreground mb-4">
              <li>Email: privacidade@passarei.com.br</li>
              <li>WhatsApp: (11) 99999-9999</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
