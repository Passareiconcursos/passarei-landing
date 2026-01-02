import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Política de Cookies
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. O Que São Cookies?
            </h2>
            <p className="text-foreground mb-4">
              Cookies são pequenos arquivos de texto armazenados no seu
              navegador ou dispositivo quando você visita um site. Eles contêm
              informações sobre sua navegação e permitem que o site "lembre" de
              suas ações e preferências ao longo do tempo.
            </p>
            <p className="text-foreground mb-4">
              Os cookies ajudam a melhorar sua experiência de navegação,
              tornando o site mais rápido, personalizado e seguro.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Tipos de Cookies que Utilizamos
            </h2>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                2.1 Cookies Essenciais (Obrigatórios)
              </h3>
              <p className="text-foreground mb-4">
                Estes cookies são <strong>absolutamente necessários</strong>{" "}
                para o funcionamento do site e não podem ser desabilitados. Sem
                eles, você não conseguiria usar a plataforma.
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <table className="w-full text-sm text-foreground">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2">Cookie</th>
                      <th className="text-left py-2">Finalidade</th>
                      <th className="text-left py-2">Duração</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2">
                        <code className="bg-gray-200 px-2 py-1 rounded">
                          session_id
                        </code>
                      </td>
                      <td className="py-2">
                        Manter você autenticado durante a navegação
                      </td>
                      <td className="py-2">30 dias</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2">
                        <code className="bg-gray-200 px-2 py-1 rounded">
                          csrf_token
                        </code>
                      </td>
                      <td className="py-2">Proteção contra ataques CSRF</td>
                      <td className="py-2">Sessão</td>
                    </tr>
                    <tr>
                      <td className="py-2">
                        <code className="bg-gray-200 px-2 py-1 rounded">
                          auth_token
                        </code>
                      </td>
                      <td className="py-2">Gerenciar autenticação e acesso</td>
                      <td className="py-2">7 dias</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                2.2 Cookies Funcionais (Podem ser Desativados)
              </h3>
              <p className="text-foreground mb-4">
                Estes cookies permitem que o site lembre suas preferências e
                escolhas pessoais. Desabilitá-los pode afetar a funcionalidade,
                mas o site continuará operacional.
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <table className="w-full text-sm text-foreground">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2">Cookie</th>
                      <th className="text-left py-2">Finalidade</th>
                      <th className="text-left py-2">Duração</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2">
                        <code className="bg-gray-200 px-2 py-1 rounded">
                          theme
                        </code>
                      </td>
                      <td className="py-2">
                        Lembrar preferência de modo claro/escuro
                      </td>
                      <td className="py-2">1 ano</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2">
                        <code className="bg-gray-200 px-2 py-1 rounded">
                          language
                        </code>
                      </td>
                      <td className="py-2">Armazenar idioma preferido</td>
                      <td className="py-2">1 ano</td>
                    </tr>
                    <tr>
                      <td className="py-2">
                        <code className="bg-gray-200 px-2 py-1 rounded">
                          cookie_consent
                        </code>
                      </td>
                      <td className="py-2">
                        Guardar suas preferências de cookies
                      </td>
                      <td className="py-2">1 ano</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                2.3 Cookies Analíticos (Podem ser Desativados)
              </h3>
              <p className="text-foreground mb-4">
                Estes cookies coletam informações sobre como você usa o site,
                nos ajudando a entender o comportamento dos usuários e melhorar
                a plataforma. As informações são agregadas e anônimas.
              </p>
              <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
                <li>
                  <strong>Google Analytics:</strong> Analisa tráfego, páginas
                  mais visitadas, tempo de permanência
                  <ul className="list-circle pl-6 mt-1">
                    <li>
                      <code className="text-sm bg-gray-200 px-1 rounded">
                        _ga
                      </code>{" "}
                      - Identificador único (2 anos)
                    </li>
                    <li>
                      <code className="text-sm bg-gray-200 px-1 rounded">
                        _ga_*
                      </code>{" "}
                      - Estado da sessão (2 anos)
                    </li>
                    <li>
                      <code className="text-sm bg-gray-200 px-1 rounded">
                        _gid
                      </code>{" "}
                      - Identificador único (24 horas)
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Vercel Analytics:</strong> Monitora performance,
                  velocidade de carregamento, erros técnicos
                </li>
              </ul>
              <p className="text-foreground mb-4">
                <strong>Você pode desativar o Google Analytics:</strong>{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instale o complemento de desativação
                </a>
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                2.4 Cookies de Marketing (Podem ser Desativados)
              </h3>
              <p className="text-foreground mb-4">
                Estes cookies rastreiam sua navegação para exibir anúncios mais
                relevantes e medir a eficácia de nossas campanhas publicitárias.
              </p>
              <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
                <li>
                  <strong>Meta Pixel (Facebook/Instagram):</strong> Rastreia
                  conversões de anúncios, cria audiências personalizadas
                  <ul className="list-circle pl-6 mt-1">
                    <li>
                      <code className="text-sm bg-gray-200 px-1 rounded">
                        _fbp
                      </code>{" "}
                      - Pixel do Facebook (90 dias)
                    </li>
                    <li>
                      <code className="text-sm bg-gray-200 px-1 rounded">
                        fr
                      </code>{" "}
                      - Anúncios do Facebook (90 dias)
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Google Ads:</strong> Remarketing, medição de
                  conversões, audiências similares
                  <ul className="list-circle pl-6 mt-1">
                    <li>
                      <code className="text-sm bg-gray-200 px-1 rounded">
                        _gcl_au
                      </code>{" "}
                      - Google Ads (90 dias)
                    </li>
                    <li>
                      <code className="text-sm bg-gray-200 px-1 rounded">
                        IDE
                      </code>{" "}
                      - DoubleClick (1 ano)
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. Cookies de Terceiros
            </h2>
            <p className="text-foreground mb-4">
              Alguns cookies são definidos por serviços de terceiros que
              utilizamos:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
              <li>
                <strong>YouTube:</strong> Caso embarcamos vídeos, o YouTube pode
                definir cookies para rastrear visualizações
              </li>
              <li>
                <strong>Google Fonts:</strong> Carregamento de fontes web (não
                rastreia dados pessoais)
              </li>
              <li>
                <strong>Stripe:</strong> Processamento de pagamentos seguros
                <ul className="list-circle pl-6 mt-1">
                  <li>
                    <code className="text-sm bg-gray-200 px-1 rounded">
                      __stripe_sid
                    </code>{" "}
                    - Sessão de pagamento (30 min)
                  </li>
                  <li>
                    <code className="text-sm bg-gray-200 px-1 rounded">
                      __stripe_mid
                    </code>{" "}
                    - Detecção de fraude (1 ano)
                  </li>
                </ul>
              </li>
            </ul>
            <p className="text-foreground mb-4">
              Não temos controle sobre cookies de terceiros. Recomendamos
              consultar as políticas de privacidade desses serviços para mais
              informações.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Como Gerenciar Cookies
            </h2>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                4.1 Configurações do Navegador
              </h3>
              <p className="text-foreground mb-4">
                A maioria dos navegadores permite controlar cookies através das
                configurações. Você pode:
              </p>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li>Bloquear todos os cookies</li>
                <li>Aceitar apenas cookies de origem (first-party)</li>
                <li>Excluir cookies ao fechar o navegador</li>
                <li>Receber notificações antes de um cookie ser armazenado</li>
              </ul>

              <p className="text-foreground mb-2">
                <strong>Links de ajuda por navegador:</strong>
              </p>
              <ul className="list-none text-foreground mb-4 space-y-1">
                <li>
                  •{" "}
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  •{" "}
                  <a
                    href="https://support.mozilla.org/pt-BR/kb/desative-cookies-terceiros-impedir-rastreamento"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  •{" "}
                  <a
                    href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Safari (Mac)
                  </a>
                </li>
                <li>
                  •{" "}
                  <a
                    href="https://support.microsoft.com/pt-br/microsoft-edge/excluir-cookies-no-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                4.2 Ferramentas de Opt-Out
              </h3>
              <p className="text-foreground mb-4">
                Você pode desativar cookies de publicidade comportamental
                através de:
              </p>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li>
                  <a
                    href="http://www.networkadvertising.org/choices/"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Network Advertising Initiative (NAI)
                  </a>
                </li>
                <li>
                  <a
                    href="http://www.aboutads.info/choices/"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Digital Advertising Alliance (DAA)
                  </a>
                </li>
                <li>
                  <a
                    href="http://www.youronlinechoices.eu/"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Your Online Choices (Europa)
                  </a>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                4.3 Dispositivos Móveis
              </h3>
              <p className="text-foreground mb-4">
                Em dispositivos móveis, você pode limitar o rastreamento através
                de:
              </p>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li>
                  <strong>iOS:</strong> Ajustes → Privacidade → Rastreamento →
                  Desativar "Permitir Rastreamento"
                </li>
                <li>
                  <strong>Android:</strong> Configurações → Google → Anúncios →
                  Desativar personalização de anúncios
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Impacto de Desabilitar Cookies
            </h2>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
              <p className="text-amber-900 font-medium">
                <strong>Importante:</strong> Ao desabilitar cookies, algumas
                funcionalidades podem não funcionar corretamente.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Se você desabilitar cookies essenciais:
              </h3>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li>Não conseguirá fazer login na plataforma</li>
                <li>Não manterá sessão ativa</li>
                <li>Formulários podem não funcionar</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Se você desabilitar cookies funcionais:
              </h3>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li>Perderá preferências (tema, idioma)</li>
                <li>Terá que reconfigurar a cada visita</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Se você desabilitar cookies analíticos/marketing:
              </h3>
              <ul className="list-disc pl-6 text-foreground mb-4">
                <li>Plataforma continua funcionando normalmente</li>
                <li>
                  Você apenas não será rastreado para fins analíticos ou
                  publicitários
                </li>
                <li>Pode ver anúncios menos relevantes</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Navegação Anônima/Privada
            </h2>
            <p className="text-foreground mb-4">
              Quando você usa o modo de navegação anônima ou privada:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>Cookies são armazenados temporariamente durante a sessão</li>
              <li>Todos os cookies são deletados ao fechar o navegador</li>
              <li>Você precisará fazer login novamente a cada visita</li>
              <li>Suas preferências não serão salvas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Duração dos Cookies
            </h2>
            <p className="text-foreground mb-4">
              Os cookies que utilizamos têm diferentes períodos de validade:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>
                <strong>Cookies de Sessão:</strong> Expiram quando você fecha o
                navegador
              </li>
              <li>
                <strong>Cookies Persistentes:</strong> Permanecem por um período
                definido:
                <ul className="list-circle pl-6 mt-2">
                  <li>Essenciais: 7-30 dias</li>
                  <li>Funcionais: até 1 ano</li>
                  <li>Analíticos: 24 horas a 2 anos</li>
                  <li>Marketing: 30-90 dias (alguns até 1 ano)</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              8. Atualizações desta Política
            </h2>
            <p className="text-foreground mb-4">
              Podemos atualizar esta Política de Cookies periodicamente para
              refletir mudanças nas tecnologias que utilizamos ou requisitos
              legais.
            </p>
            <p className="text-foreground mb-4">
              A data da última atualização está sempre indicada no topo desta
              página. Recomendamos revisar esta política regularmente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              9. Mais Informações sobre Cookies
            </h2>
            <p className="text-foreground mb-4">
              Para saber mais sobre cookies e como gerenciá-los:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>
                <a
                  href="https://www.aboutcookies.org/"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AboutCookies.org
                </a>{" "}
                - Guia completo sobre cookies (inglês)
              </li>
              <li>
                <a
                  href="https://www.allaboutcookies.org/"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AllAboutCookies.org
                </a>{" "}
                - Informações detalhadas sobre tipos de cookies
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              10. Contato
            </h2>
            <p className="text-foreground mb-4">
              Para dúvidas sobre nossa Política de Cookies ou para exercer seus
              direitos de privacidade:
            </p>
            <ul className="list-none text-foreground mb-4">
              <li>
                <strong>Email:</strong> suporte@passarei.com.br
              </li>
              <li>
                <strong>Assunto:</strong> "Política de Cookies"
              </li>
              <li>
                <strong>Prazo de Resposta:</strong> Até 5 dias úteis
              </li>
            </ul>
            <p className="text-foreground mb-4">
              Consulte também nossa{" "}
              <a href="/privacidade" className="text-primary hover:underline">
                Política de Privacidade
              </a>{" "}
              completa.
            </p>
          </section>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mt-8">
            <p className="text-foreground font-semibold mb-2">Resumo Rápido</p>
            <p className="text-foreground">
              Usamos cookies para melhorar sua experiência, manter você
              conectado e entender como você usa nossa plataforma. Cookies
              essenciais são obrigatórios para o funcionamento do site. Você
              pode desativar cookies analíticos e de marketing através das
              configurações do navegador sem afetar o uso da plataforma.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
