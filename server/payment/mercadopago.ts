import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
});

export const preference = new Preference(client);
export const payment = new Payment(client);

// Pacotes de créditos disponíveis
export const CREDIT_PACKAGES = [
  {
    id: "calouro_mensal",
    amount: 89.9,
    questions: 300,
    label: "Plano Calouro - R$ 89,90/mês",
  },
  {
    id: "veterano_anual",
    amount: 538.8,
    questions: 10800,
    label: "Plano Veterano - R$ 538,80/ano (R$ 44,90/mês)",
  },
];

// ID do plano de assinatura Veterano no Mercado Pago
export const VETERANO_PLAN_ID = "e717107a9daa436f81ce9c8cc1c00d8f";
export const VETERANO_SUBSCRIPTION_URL =
  "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=e717107a9daa436f81ce9c8cc1c00d8f";

// Plano Veterano
export const VETERANO_PLAN = {
  id: "veterano_monthly",
  amount: 44.9,
  label: "Plano Veterano - R$ 44,90/mês",
};

interface CreatePaymentParams {
  packageId: string;
  telegramId: string;
  email?: string;
}

// Criar preferência de pagamento (Checkout Pro)
export async function createPaymentPreference(params: CreatePaymentParams) {
  const { packageId, telegramId, email } = params;

  // Encontrar pacote
  const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
  if (!pkg) {
    throw new Error("Pacote não encontrado");
  }

  const baseUrl = process.env.APP_URL || "https://passarei.com.br";

  try {
    const response = await preference.create({
      body: {
        items: [
          {
            id: pkg.id,
            title: `Passarei - ${pkg.questions} Questões`,
            description: `Pacote de ${pkg.questions} questões para estudo`,
            quantity: 1,
            currency_id: "BRL",
            unit_price: pkg.amount,
          },
        ],
        payer: {
          email: email || "cliente@passarei.com.br",
        },
        external_reference: `${telegramId}|${pkg.id}|${Date.now()}`,
        back_urls: {
          success: `${baseUrl}/pagamento/sucesso`,
          failure: `${baseUrl}/pagamento/falha`,
          pending: `${baseUrl}/pagamento/pendente`,
        },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/payment/webhooks/mercadopago`,
      },
    });

    return {
      id: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point,
    };
  } catch (error) {
    console.error("❌ Erro ao criar preferência:", error);
    throw error;
  }
}

// Criar preferência para Plano Veterano
export async function createVeteranoPreference(params: {
  telegramId: string;
  email?: string;
}) {
  const { telegramId, email } = params;
  const baseUrl = process.env.APP_URL || "https://passarei.com.br";

  try {
    const response = await preference.create({
      body: {
        items: [
          {
            id: VETERANO_PLAN.id,
            title: "Passarei - Plano Veterano",
            description:
              "300 questões/mês + 2 correções de redação + apostilas",
            quantity: 1,
            currency_id: "BRL",
            unit_price: VETERANO_PLAN.amount,
          },
        ],
        payer: {
          email: email || "cliente@passarei.com.br",
        },
        external_reference: `${telegramId}|veterano|${Date.now()}`,
        back_urls: {
          success: `${baseUrl}/pagamento/sucesso`,
          failure: `${baseUrl}/pagamento/falha`,
          pending: `${baseUrl}/pagamento/pendente`,
        },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/payment/webhooks/mercadopago`,
      },
    });

    return {
      id: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point,
    };
  } catch (error) {
    console.error("❌ Erro ao criar preferência Veterano:", error);
    throw error;
  }
}

// Buscar pagamento por ID
export async function getPayment(paymentId: string) {
  try {
    const response = await payment.get({ id: paymentId });
    return response;
  } catch (error) {
    console.error("❌ Erro ao buscar pagamento:", error);
    throw error;
  }
}

// Processar webhook de pagamento
export async function processPaymentWebhook(paymentId: string) {
  try {
    const paymentData = await getPayment(paymentId);

    if (paymentData.status === "approved") {
      const externalRef = paymentData.external_reference || "";
      const [telegramId, packageId] = externalRef.split("|");

      return {
        success: true,
        telegramId,
        packageId,
        amount: paymentData.transaction_amount,
        status: paymentData.status,
      };
    }

    return {
      success: false,
      status: paymentData.status,
    };
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    throw error;
  }
}

// ============================================
// ASSINATURAS (PLANO VETERANO RECORRENTE)
// ============================================

interface CreateSubscriptionParams {
  telegramId: string;
  email: string;
  payerName?: string;
}

// Criar assinatura recorrente do Plano Veterano
export async function createVeteranoSubscription(
  params: CreateSubscriptionParams,
) {
  const { telegramId, email, payerName } = params;
  const baseUrl = process.env.APP_URL || "https://passarei.com.br";

  try {
    const response = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason: "Passarei - Plano Veterano",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 44.9,
          currency_id: "BRL",
        },
        back_url: `${baseUrl}/assinatura/sucesso`,
        external_reference: `${telegramId}|veterano_sub|${Date.now()}`,
        payer_email: email,
        status: "pending",
      }),
    });

    const data = await response.json();

    if (data.id) {
      return {
        success: true,
        subscriptionId: data.id,
        initPoint: data.init_point,
        status: data.status,
      };
    } else {
      throw new Error(data.message || "Erro ao criar assinatura");
    }
  } catch (error) {
    console.error("❌ Erro ao criar assinatura:", error);
    throw error;
  }
}

// Verificar status da assinatura
export async function getSubscriptionStatus(subscriptionId: string) {
  try {
    const response = await fetch(
      `https://api.mercadopago.com/preapproval/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Erro ao verificar assinatura:", error);
    throw error;
  }
}

// Cancelar assinatura
export async function cancelSubscription(subscriptionId: string) {
  try {
    const response = await fetch(
      `https://api.mercadopago.com/preapproval/${subscriptionId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
        }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Erro ao cancelar assinatura:", error);
    throw error;
  }
}
