import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";

export default function Privacidade() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Política de Privacidade
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            <strong>Última atualização:</strong> 17 de novembro de 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introdução</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O Passarei ("nós", "nosso" ou "Plataforma") está comprometido em proteger sua 
              privacidade. Esta Política de Privacidade explica como coletamos, usamos, armazenamos 
              e protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção 
              de Dados (LGPD - Lei 13.709/2018).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Informações que Coletamos</h2>
            
            <h3 className="text-xl font-bold text-foreground mb-3 mt-6">2.1 Informações Fornecidas por Você:</h3>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li><strong>Cadastro:</strong> Nome, e-mail, número de telefone (WhatsApp)</li>
              <li><strong>Perfil de Estudos:</strong> Concurso de interesse, estado, cargo, nível de conhecimento, matérias de facilidade/dificuldade, tempo disponível, horário de estudo</li>
              <li><strong>Pagamentos:</strong> Informações de cobrança processadas via Mercado Pago (não armazenamos dados de cartão)</li>
              <li><strong>Redações:</strong> Textos enviados para correção</li>
              <li><strong>Programa de Afiliados:</strong> Chave PIX para pagamento de comissões (apenas Plano Veterano)</li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mb-3 mt-6">2.2 Informações Coletadas Automaticamente:</h3>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>Histórico de interações via WhatsApp</li>
              <li>Respostas a questões e desempenho</li>
              <li>Tempo de estudo e padrões de uso</li>
              <li>Estatísticas de acertos e erros</li>
              <li>Progresso por matéria</li>
              <li>Dados técnicos: endereço IP, tipo de dispositivo, sistema operacional</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Como Usamos Suas Informações</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Utilizamos seus dados para:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li><strong>Personalização:</strong> Adaptar conteúdo ao seu perfil e desempenho usando IA</li>
              <li><strong>Entrega do Serviço:</strong> Enviar matérias, questões e correções via WhatsApp conforme seu plano</li>
              <li><strong>Análise de Edital:</strong> Processar editais enviados para ajustar seu plano de estudos</li>
              <li><strong>Correção de Redações:</strong> Processar textos enviados e gerar feedback detalhado</li>
              <li><strong>Repetição Espaçada:</strong> Calcular momentos ideais para revisão usando algoritmo SM-2</li>
              <li><strong>Relatórios:</strong> Gerar estatísticas de desempenho e progresso</li>
              <li><strong>Pagamentos:</strong> Processar assinaturas e pagamentos de redações extras</li>
              <li><strong>Programa de Afiliados:</strong> Rastrear indicações e calcular comissões (Plano Veterano)</li>
              <li><strong>Suporte:</strong> Responder dúvidas e resolver problemas</li>
              <li><strong>Melhorias:</strong> Analisar uso agregado para aprimorar a Plataforma</li>
              <li><strong>Comunicação:</strong> Enviar atualizações importantes sobre o serviço</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Base Legal (LGPD)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Processamos seus dados com base em:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li><strong>Consentimento:</strong> Ao aceitar estes termos e usar a Plataforma</li>
              <li><strong>Execução de Contrato:</strong> Para fornecer os serviços contratados</li>
              <li><strong>Legítimo Interesse:</strong> Para melhorar nossos serviços e prevenir fraudes</li>
              <li><strong>Obrigação Legal:</strong> Para cumprir exigências fiscais e contábeis</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Compartilhamento de Dados</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Compartilhamos seus dados apenas quando necessário:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li><strong>Mercado Pago:</strong> Para processar pagamentos (PIX, cartão, boleto)</li>
              <li><strong>Anthropic (Claude AI):</strong> Para processamento de linguagem natural e personalização</li>
              <li><strong>Twilio:</strong> Para envio de mensagens via WhatsApp</li>
              <li><strong>Fornecedores de Infraestrutura:</strong> Replit, Vercel, Supabase (armazenamento seguro)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4 mt-4">
              <strong>Nunca vendemos seus dados a terceiros.</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Armazenamento e Segurança</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>6.1 Onde Armazenamos:</strong> Dados armazenados em servidores seguros no Brasil e EUA 
              (provedores certificados).
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>6.2 Por Quanto Tempo:</strong>
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>Dados de cadastro: Enquanto sua conta estiver ativa + 5 anos após inativação (obrigação legal)</li>
              <li>Histórico de estudos: Enquanto sua conta estiver ativa</li>
              <li>Dados de pagamento: Conforme exigências fiscais (mínimo 5 anos)</li>
              <li>Redações corrigidas: 2 anos após correção</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>6.3 Medidas de Segurança:</strong>
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>Criptografia SSL/TLS para transmissão de dados</li>
              <li>Criptografia de dados sensíveis em repouso</li>
              <li>Acesso restrito a dados pessoais (apenas equipe autorizada)</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Backups regulares</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Seus Direitos (LGPD)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Você tem direito a:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li><strong>Confirmação e Acesso:</strong> Saber se processamos seus dados e acessá-los</li>
              <li><strong>Correção:</strong> Atualizar dados incompletos ou incorretos</li>
              <li><strong>Anonimização/Bloqueio/Eliminação:</strong> Solicitar remoção de dados desnecessários</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Eliminação:</strong> Solicitar exclusão de dados (exceto quando houver obrigação legal de retenção)</li>
              <li><strong>Revogação de Consentimento:</strong> Retirar consentimento a qualquer momento</li>
              <li><strong>Oposição:</strong> Opor-se ao tratamento de dados</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4 mt-4">
              Para exercer seus direitos, entre em contato: <strong>privacidade@passarei.com.br</strong>
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Responderemos em até 15 dias.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Cookies e Tecnologias Similares</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Utilizamos cookies essenciais para:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>Manter você logado</li>
              <li>Lembrar suas preferências</li>
              <li>Analisar uso da plataforma (Google Analytics - dados anonimizados)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Você pode gerenciar cookies nas configurações do navegador.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Menores de Idade</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nossos serviços são destinados a maiores de 18 anos. Se você tem entre 16 e 18 anos, 
              pode usar a Plataforma com consentimento de pais/responsáveis.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Não coletamos intencionalmente dados de menores de 16 anos sem consentimento parental.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Alterações nesta Política</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Podemos atualizar esta Política periodicamente. Mudanças significativas serão comunicadas 
              via WhatsApp ou e-mail com 7 dias de antecedência.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Data da última atualização está sempre no topo deste documento.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Encarregado de Dados (DPO)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nosso Encarregado de Proteção de Dados pode ser contatado:
            </p>
            <ul className="list-none text-muted-foreground mb-4 space-y-2">
              <li><strong>E-mail:</strong> dpo@passarei.com.br</li>
              <li><strong>Telefone:</strong> +55 27 99999-9999</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">12. Contato</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Para dúvidas sobre esta Política de Privacidade:
            </p>
            <ul className="list-none text-muted-foreground mb-4 space-y-2">
              <li><strong>E-mail:</strong> privacidade@passarei.com.br</li>
              <li><strong>WhatsApp:</strong> +55 27 99999-9999</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
