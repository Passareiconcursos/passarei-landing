import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

declare global {
  interface Window {
    MercadoPago: any;
  }
}

const PACKAGES = {
  credits_5: { amount: 5, questions: 5, label: "5 Questões" },
  credits_10: { amount: 10, questions: 10, label: "10 Questões" },
  credits_20: { amount: 20, questions: 20, label: "20 Questões" },
  veterano: { amount: 49.9, questions: 300, label: "Plano Veterano" },
};

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const pkg = searchParams.get("pkg") || "credits_5";
  const userId = searchParams.get("user") || "";
  const packageInfo = PACKAGES[pkg as keyof typeof PACKAGES] || PACKAGES.credits_5;

  useEffect(() => {
    // Carregar SDK do Mercado Pago
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.onload = () => initCheckout();
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initCheckout = async () => {
    try {
      const mp = new window.MercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY, {
        locale: "pt-BR",
      });

      const bricks = mp.bricks();

      await bricks.create("payment", "payment-brick", {
        initialization: {
          amount: packageInfo.amount,
          preferenceId: await getPreferenceId(),
        },
        customization: {
          visual: {
            style: {
              theme: "default",
            },
          },
          paymentMethods: {
            creditCard: "all",
            debitCard: "all",
            bankTransfer: ["pix"],
            maxInstallments: 1,
          },
        },
        callbacks: {
          onReady: () => {
            setLoading(false);
          },
          onSubmit: async ({ selectedPaymentMethod, formData }: any) => {
            setLoading(true);
            try {
              const response = await fetch("/api/payment/process-brick", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...formData,
                  telegramId: userId,
                  packageId: pkg,
                }),
              });
              const result = await response.json();
              
              if (result.success) {
                setPaymentStatus("approved");
              } else {
                setError(result.error || "Erro no pagamento");
              }
            } catch (err) {
              setError("Erro ao processar pagamento");
            }
            setLoading(false);
          },
          onError: (error: any) => {
            console.error("Brick error:", error);
            setError("Erro no formulário de pagamento");
            setLoading(false);
          },
        },
      });
    } catch (err) {
      console.error("Init error:", err);
      setError("Erro ao carregar checkout");
      setLoading(false);
    }
  };

  const getPreferenceId = async () => {
    const endpoint = pkg === "veterano" ? "/api/payment/create-veterano" : "/api/payment/create-payment";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packageId: pkg, telegramId: userId }),
    });
    const data = await response.json();
    return data.preferenceId;
  };

  if (paymentStatus === "approved") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Pagamento Aprovado!</h1>
          <p className="text-gray-600 mb-6">
            {pkg === "veterano" 
              ? "Seu Plano Veterano foi ativado. Volte ao Telegram para continuar estudando!"
              : `${packageInfo.questions} questões foram adicionadas à sua conta.`}
          </p>
          
            href="https://t.me/PassareiBot"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Voltar ao Telegram
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout Passarei</h1>
          <p className="text-gray-600">Finalize sua compra de forma segura</p>
        </div>

        {/* Resumo do pedido */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumo do Pedido</h2>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">{packageInfo.label}</span>
            <span className="font-semibold">R$ {packageInfo.amount.toFixed(2)}</span>
          </div>
          {pkg === "veterano" && (
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>✅ 300 questões personalizadas/mês</li>
              <li>✅ 2 correções de redação/mês</li>
              <li>✅ Todas as apostilas inclusas</li>
              <li>✅ Revisão inteligente SM2</li>
            </ul>
          )}
          <div className="flex justify-between items-center pt-4 mt-4 border-t">
            <span className="font-semibold text-gray-800">Total</span>
            <span className="text-2xl font-bold text-blue-600">R$ {packageInfo.amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Brick de pagamento */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Carregando...</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}
          <div id="payment-brick"></div>
        </div>

        {/* Segurança */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Pagamento 100% seguro via Mercado Pago
          </div>
        </div>
      </div>
    </div>
  );
}
