import { MessageCircle } from "lucide-react";

export function CTAFinal() {
  const whatsappNumber = "5527992663806";
  const whatsappMessage = encodeURIComponent(
    "Olá! Quero começar a estudar para concursos policiais com o Passarei! 🎯",
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#18cb96] to-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Você Está a 2 Minutos da Sua Aprovação
          </h2>
          <p className="text-xl md:text-2xl text-green-50">
            Mais de 2.847 candidatos já disseram "EU VOU PASSAR". E você?
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-3xl">🚀</span>
                COMEÇAR É FÁCIL:
              </h3>
              <ul className="space-y-3">
                {[
                  "Cadastro em 2 minutos pelo WhatsApp",
                  "Primeiro conteúdo hoje mesmo",
                  "Sem cartão no plano gratuito",
                  "Cancele quando quiser",
                  "Garantia de 7 dias",
                  "Suporte humanizado",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-3xl">💚</span>
                VOCÊ VAI RECEBER:
              </h3>
              <ul className="space-y-2">
                {[
                  "Plano personalizado baseado no SEU edital",
                  "Conteúdo adaptado ao SEU nível",
                  "Questões no ritmo que VOCÊ precisa",
                  "Revisões no momento CERTO",
                  "Progresso em tempo real",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            id="lead-form"
            className="flex flex-col items-center justify-center"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
              <div className="mb-6">
                <div className="w-20 h-20 bg-[#25D366] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Comece Agora pelo WhatsApp
                </h3>
                <p className="text-gray-600">
                  Clique no botão abaixo e inicie sua jornada de aprovação!
                </p>
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full bg-[#25D366] text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-2xl hover:bg-[#20BD5A] hover:scale-105 transition-all duration-300"
              >
                <span className="text-2xl mr-3">💚</span>
                Teste Grátis no WhatsApp
              </a>

              <p className="text-xs text-gray-500 mt-4">
                Ao clicar, você será direcionado para nosso WhatsApp oficial.
                Seus dados estão protegidos conforme nossa{" "}
                <a
                  href="/privacidade"
                  className="text-[#18cb96] hover:underline"
                >
                  Política de Privacidade
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="text-center border-t border-white/20 pt-8">
          <p className="text-lg text-green-50 mb-4">
            ⏰ Vagas limitadas para garantir qualidade do suporte
          </p>
          <p className="text-sm text-green-100">
            🔒 Seus dados estão 100% seguros. Não compartilhamos com terceiros.
          </p>
        </div>
      </div>
    </section>
  );
}
