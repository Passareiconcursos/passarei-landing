import { Button } from "@/components/ui/button";
import {
  Send,
  CheckCircle,
  Clock,
  BookOpen,
  MessageCircle,
} from "lucide-react";

export function CTAFinal() {
  const telegramLink = "https://t.me/PassareiBot";

  const openTelegram = () => {
    window.open(telegramLink, "_blank");
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#0088cc] via-[#0077b5] to-[#006699] relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center">
          {/* Ícone do Telegram */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-2xl mb-8">
            <svg
              viewBox="0 0 24 24"
              className="w-12 h-12 text-[#0088cc]"
              fill="currentColor"
            >
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Comece a estudar agora pelo Telegram!
          </h2>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Receba conteúdos diários, questões personalizadas e correções com IA
            direto no seu Telegram
          </p>

          {/* Benefícios */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-white" />
              <p className="text-sm font-medium">Estude pelo celular</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
              <Clock className="w-8 h-8 mx-auto mb-2 text-white" />
              <p className="text-sm font-medium">5min por dia</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-white" />
              <p className="text-sm font-medium">Conteúdo personalizado</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-white" />
              <p className="text-sm font-medium">IA corrige suas respostas</p>
            </div>
          </div>

          {/* Botão principal */}
          <Button
            size="lg"
            onClick={openTelegram}
            className="bg-white hover:bg-gray-100 text-[#0088cc] px-10 py-7 text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 rounded-full"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7 mr-3"
              fill="currentColor"
            >
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            Iniciar no Telegram
          </Button>

          {/* Badge de garantia */}
          <div className="mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-white text-sm">
              5 questões grátis para você testar • Sem cartão de crédito
            </span>
          </div>

          {/* Info do bot */}
          <p className="mt-6 text-white/70 text-sm">
            Abra o Telegram e pesquise por{" "}
            <strong className="text-white">@PassareiBot</strong> ou clique no
            botão acima
          </p>
        </div>
      </div>
    </section>
  );
}
