import { LeadForm } from "@/components/LeadForm";

export function CTAFinal() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-green-500 to-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Você Está a 2 Minutos da Sua Aprovação
          </h2>
          <p className="text-xl md:text-2xl text-green-50">
            Mais de 2.847 candidatos já disseram "EU VOU PASSAR". E você?
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
          {/* Left Column - Benefits */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-3xl">🚀</span>
                COMEÇAR É FÁCIL:
              </h3>
              <ul className="space-y-3">
                {[
                  "Cadastro em 2 minutos",
                  "Primeiro conteúdo hoje mesmo",
                  "Sem cartão no plano gratuito",
                  "Cancele quando quiser",
                  "Garantia de 7 dias",
                  "Suporte humanizado"
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
                  "Progresso em tempo real"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Form */}
          <div id="lead-form">
            <LeadForm />
          </div>
        </div>

        {/* Bottom trust signals */}
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
