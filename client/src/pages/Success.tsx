// client/src/pages/Success.tsx
// 🎉 Página exibida após pagamento aprovado

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, Send, Mail, ArrowRight, Sparkles } from "lucide-react";

interface SuccessPageProps {
  // Props virão da URL: ?plan=calouro&payment_id=XXX&email=user@email.com
}

export default function Success() {
  const [searchParams] = useState(
    () => new URLSearchParams(window.location.search),
  );
  const [, setLocation] = useLocation();

  const plan = searchParams.get("plan") || "calouro";
  const paymentId = searchParams.get("payment_id");
  const userEmail = searchParams.get("email");

  // Gerar código de ativação (depois virá do backend)
  const activationCode = searchParams.get("code") || "PASS-DEMO123";

  // Determinar nome do plano
  const planName = plan === "veterano" ? "VETERANO" : "CALOURO";
  const planPrice = plan === "veterano" ? "R$ 44,90/mês" : "R$ 89,90/mês";
  const planColor =
    plan === "veterano"
      ? "from-[#18cb96] to-[#14b584]"
      : "from-blue-500 to-blue-600";

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);

    // Google Analytics - conversão
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "purchase", {
        transaction_id: paymentId,
        value: plan === "veterano" ? 44.9 : 89.9,
        currency: "BRL",
        items: [
          {
            item_name: `Plano ${planName}`,
            item_category: "Subscription",
            price: plan === "veterano" ? 44.9 : 89.9,
            quantity: 1,
          },
        ],
      });
    }
  }, [paymentId, plan, planName]);

  const telegramLink = `https://t.me/PassareiBot?start=${activationCode}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Card Principal */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header com gradiente */}
          <div
            className={`bg-gradient-to-r ${planColor} p-8 text-center relative overflow-hidden`}
          >
            {/* Efeito de brilho */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

            <div className="relative z-10">
              {/* Ícone de sucesso */}
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-lg animate-bounce">
                <CheckCircle2
                  className="w-14 h-14 text-green-500"
                  strokeWidth={2.5}
                />
              </div>

              {/* Título */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                🎉 Pagamento Confirmado!
              </h1>

              {/* Subtítulo */}
              <p className="text-xl text-white/90 font-medium">
                Seu plano <strong>{planName}</strong> está ativo!
              </p>

              {/* Badge do plano */}
              <div className="inline-block mt-4 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full">
                <span className="text-white font-bold text-lg">
                  {planPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-8 md:p-12">
            {/* Próximo passo - DESTAQUE */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 md:p-8 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    📱 Próximo Passo: Acesse o Telegram
                  </h2>
                  <p className="text-gray-700 text-lg">
                    Clique no botão abaixo para começar a estudar agora mesmo!
                  </p>
                </div>
              </div>

              {/* Botão GRANDE do Telegram */}
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-full bg-gradient-to-r from-[#0088cc] to-[#0077b3] hover:from-[#0077b3] hover:to-[#006699] text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex items-center justify-center gap-3">
                  <Send className="w-7 h-7" />
                  <span className="text-xl">Abrir Bot no Telegram</span>
                  <Sparkles className="w-6 h-6 group-hover:animate-spin" />
                </div>
              </a>

              {/* Instruções abaixo do botão */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  👉 Ao abrir o bot, envie o comando{" "}
                  <code className="bg-gray-200 px-2 py-1 rounded font-mono text-blue-600">
                    /start
                  </code>
                </p>
              </div>
            </div>

            {/* Informações do pedido */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                Informações do Pedido
              </h3>
              <div className="space-y-3 text-sm">
                {userEmail && (
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900">
                      {userEmail}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">Plano:</span>
                  <span className="font-medium text-gray-900">{planName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-medium text-gray-900">{planPrice}</span>
                </div>
                {paymentId && (
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">ID do Pagamento:</span>
                    <span className="font-mono text-xs text-gray-500">
                      {paymentId.substring(0, 20)}...
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium text-gray-900">
                    {new Date().toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Email enviado */}
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-green-900 mb-2">
                    📧 Email Enviado!
                  </h3>
                  <p className="text-green-800 text-sm leading-relaxed">
                    Enviamos um email para{" "}
                    <strong>{userEmail || "você"}</strong> com:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-green-700">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Link direto do bot Telegram
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Guia de primeiros passos
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Seus dados de acesso
                    </li>
                  </ul>
                  <p className="text-xs text-green-600 mt-3">
                    Não recebeu? Verifique a pasta de <strong>SPAM</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Como funciona */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-purple-900 mb-4 text-lg">
                ✨ Como Funciona o Passarei
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-1">
                      Abra o Bot
                    </h4>
                    <p className="text-sm text-purple-700">
                      Clique no botão acima e envie{" "}
                      <code className="bg-purple-200 px-1 rounded">/start</code>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-1">
                      Receba Conteúdo
                    </h4>
                    <p className="text-sm text-purple-700">
                      Questões personalizadas chegam automaticamente no seu
                      Telegram
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-1">
                      Estude e Evolua
                    </h4>
                    <p className="text-sm text-purple-700">
                      Receba correções detalhadas e acompanhe seu progresso
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Suporte */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600 mb-3">
                Precisa de ajuda? Entre em contato:
              </p>
              <a
                href="mailto:suporte@passarei.com.br"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Mail className="w-4 h-4" />
                suporte@passarei.com.br
              </a>
            </div>

            {/* Botão voltar */}
            <div className="text-center mt-8">
              <button
                onClick={() => setLocation("/")}
                className="text-gray-500 hover:text-gray-700 text-sm underline"
              >
                ← Voltar para o site
              </button>
            </div>
          </div>
        </div>

        {/* Badge de segurança */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Pagamento processado com segurança pelo Mercado Pago
          </p>
        </div>
      </div>
    </div>
  );
}
