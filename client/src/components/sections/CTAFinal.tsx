import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, BookOpen, Rocket } from "lucide-react";

export function CTAFinal() {
  return (
    <section
      id="cta-final"
      className="py-20 bg-gradient-to-br from-[#0088cc] via-[#0077b5] to-[#006699] relative overflow-hidden"
    >
      {/* Elementos decorativos */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center">
          {/* Ícone */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-2xl mb-8">
            <BookOpen className="w-10 h-10 text-[#0088cc]" aria-hidden="true" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Comece a estudar agora na Sala de Aula!
          </h2>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Acesse a plataforma e resolva 21 questões grátis com correção
            detalhada por IA. O Telegram fica acessível de dentro da Sala.
          </p>

          {/* Benefícios */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-white" />
              <p className="text-sm font-medium">Estude agora pelo celular</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
              <Clock className="w-8 h-8 mx-auto mb-2 text-white" />
              <p className="text-sm font-medium">Estude 15 min por dia</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
              <Rocket className="w-8 h-8 mx-auto mb-2 text-white" />
              <p className="text-sm font-medium">Conteúdo personalizado</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-white" />
              <p className="text-sm font-medium">IA reforça seu APRENDIZADO</p>
            </div>
          </div>

          {/* Botão principal */}
          <Button
            size="lg"
            onClick={() =>
              (window.location.href = "/sala/login?source=cta_final")
            }
            className="bg-white hover:bg-gray-100 text-[#0088cc] px-10 py-7 text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 rounded-full"
          >
            <Rocket className="w-7 h-7 mr-3" aria-hidden="true" />
            Acessar 21 Questões Grátis
          </Button>

          {/* Badge de garantia */}
          <div className="mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-white text-sm">
              Teste com 21 questões grátis • Sem cartão de crédito
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
