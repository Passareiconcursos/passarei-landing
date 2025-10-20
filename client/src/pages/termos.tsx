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
              Ao acessar e usar o Passarei ("Plataforma"), você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não use nossos serviços.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Descrição do Serviço</h2>
            <p className="text-foreground mb-4">
              O Passarei é uma plataforma de estudos para concursos policiais que oferece:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>Conteúdo educacional personalizado via WhatsApp</li>
              <li>Questões de concursos públicos</li>
              <li>Sistema de repetição espaçada baseado em IA</li>
              <li>Acompanhamento de progresso e estatísticas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Cadastro e Conta</h2>
            <p className="text-foreground mb-4">
              Para usar nossos serviços, você deve:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>Fornecer informações verdadeiras e atualizadas</li>
              <li>Ter pelo menos 16 anos de idade</li>
              <li>Manter a confidencialidade de suas credenciais</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Planos e Pagamentos</h2>
            <p className="text-foreground mb-4">
              Oferecemos planos gratuitos e pagos. Os planos pagos são cobrados de acordo com a periodicidade escolhida (mensal ou anual). O cancelamento pode ser feito a qualquer momento através das configurações da conta.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Uso Aceitável</h2>
            <p className="text-foreground mb-4">
              Você concorda em NÃO:
            </p>
            <ul className="list-disc pl-6 text-foreground mb-4">
              <li>Compartilhar sua conta com terceiros</li>
              <li>Copiar, reproduzir ou distribuir nosso conteúdo sem autorização</li>
              <li>Usar a plataforma para fins ilegais ou não autorizados</li>
              <li>Tentar acessar áreas restritas do sistema</li>
              <li>Interferir no funcionamento da plataforma</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Propriedade Intelectual</h2>
            <p className="text-foreground mb-4">
              Todo o conteúdo da plataforma (textos, questões, imagens, logos, software) é de propriedade exclusiva do Passarei ou de seus licenciadores e está protegido por leis de direitos autorais.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Limitação de Responsabilidade</h2>
            <p className="text-foreground mb-4">
              O Passarei não garante aprovação em concursos públicos. Somos uma ferramenta de estudos e os resultados dependem do esforço e dedicação individual de cada usuário.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Modificações</h2>
            <p className="text-foreground mb-4">
              Reservamo-nos o direito de modificar estes Termos a qualquer momento. Mudanças significativas serão comunicadas por email ou através da plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contato</h2>
            <p className="text-foreground mb-4">
              Para dúvidas sobre estes Termos, entre em contato:
            </p>
            <ul className="list-none text-foreground mb-4">
              <li>Email: suporte@passarei.com.br</li>
              <li>WhatsApp: (11) 99999-9999</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
