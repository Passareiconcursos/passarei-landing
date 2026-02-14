import { useEffect, useState } from "react";
import { useSearch } from "wouter";

declare global {
  interface Window {
    MercadoPago: any;
  }
}
const PACKAGES = {
  calouro_mensal: {
    amount: 89.9,
    questions: 300,
    label: "Plano Calouro - Mensal",
  },
  veterano: {
    amount: 538.8,
    questions: 10800,
    label: "Plano Veterano - Anual (12x de R$ 44,90)",
  },
};

export default function Checkout() {
  const search = window.location.search;
  const searchParams = new URLSearchParams(search);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState("");

  // Aceitar tanto 'pkg' quanto 'plan'
  const pkgParam =
    searchParams.get("pkg") || searchParams.get("plan") || "calouro_mensal";
  const userId =
    searchParams.get("user") ||
    `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Mapear 'plan' para 'pkg' se necessário
  const pkgMap: Record<string, string> = {
    calouro: "calouro_mensal",
    calouro_mensal: "calouro_mensal",
    veterano: "veterano",
    veterano_anual: "veterano",
  };

  const pkg = pkgMap[pkgParam] || pkgParam;
  const packageInfo =
    PACKAGES[pkg as keyof typeof PACKAGES] || PACKAGES.calouro_mensal;

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
      const mp = new window.MercadoPago(
        import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY,
        {
          locale: "pt-BR",
        },
      );

      const bricks = mp.bricks();

      await bricks.create("payment", "payment-brick", {
        initialization: {
          amount: packageInfo.amount,
          payer: {
            email: "",
          },
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
          payerForm: {
            enabled: true,
          },
        },
        callbacks: {
          onReady: () => {
            setLoading(false);
          },
          onSubmit: async ({ selectedPaymentMethod, formData }: any) => {
            setLoading(true);
            try {
              // Obter device_id do SDK para prevenção de fraude
              const deviceId = mp.getDeviceId?.() || null;

              // Separar nome e sobrenome
              const nameParts = buyerName.trim().split(" ");
              const firstName = nameParts[0] || "";
              const lastName = nameParts.slice(1).join(" ") || "";

              console.log("🔍 Dados enviados:", {
                ...formData,
                telegramId: userId,
                packageId: pkg,
                deviceId,
                buyerName,
                firstName,
                lastName,
              });
              const response = await fetch("/api/payment/process-brick", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...formData,
                  telegramId: userId,
                  packageId: pkg,
                  userEmail: formData?.email,
                  deviceId,
                  buyerFirstName: firstName,
                  buyerLastName: lastName,
                }),
              });
              const result = await response.json();

              if (result.success) {
                // Verificar se é aprovado ou pendente (PIX)
                if (result.status === "approved") {
                  setPaymentStatus("approved");
                  window.location.href = `/success?payment=${result.paymentId}&plan=${pkg}&status=approved`;
                } else if (result.status === "pending") {
                  setPaymentStatus("pending");
                  window.location.href = `/success?payment=${result.paymentId}&plan=${pkg}&status=pending`;
                }
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

  if (paymentStatus === "approved") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Pagamento Aprovado!
          </h1>
          <p className="text-gray-600 mb-6">
            {pkg === "veterano"
              ? "Seu Plano Veterano foi ativado. Volte ao Telegram para continuar estudando!"
              : `${packageInfo.questions} questões foram adicionadas à sua conta.`}
          </p>

          <a
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex flex-col items-center gap-3 mb-8">
          <img src="/logo.png" alt="Passarei" className="h-16 w-auto" />
          <h1 className="text-xl font-semibold text-gray-700">
            Carrinho de Compras
          </h1>
        </div>

        {/* Resumo do pedido */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Resumo do Pedido
          </h2>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">{packageInfo.label}</span>
            <span className="font-semibold">
              R$ {packageInfo.amount.toFixed(2)}
            </span>
          </div>
          {pkg === "veterano" && (
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>✅ 900 questões personalizadas/mês</li>
              <li>✅ 2 correções de redação/mês</li>
              <li>✅ Simulados mensais completos</li>
              <li>✅ Revisão espaçada inteligente</li>
            </ul>
          )}
          <div className="flex justify-between items-center pt-4 mt-4 border-t">
            <span className="font-semibold text-gray-800">Total</span>
            <span className="text-2xl font-bold text-[#18cb96]">
              R$ {packageInfo.amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Campo de nome do comprador */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome completo (como está no cartão)
          </label>
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder="Ex: João da Silva"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
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

        {/* Segurança e valor */}
        <div className="mt-6 space-y-3 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Pagamento 100% seguro via Mercado Pago
          </div>
          <p className="text-xs text-gray-400">
            Até 80% mais acessível que cursos tradicionais. IA de última geração
            focada em carreiras policiais.
          </p>
          <p className="text-xs text-gray-400">
            Garantia de 7 dias ou seu dinheiro de volta.
          </p>
        </div>
      </div>
    </div>
  );
}
