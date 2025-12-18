import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

const preference = new Preference(client);
const payment = new Payment(client);

// Pacotes de créditos disponíveis
export const CREDIT_PACKAGES = [
  { id: 'credits_5', amount: 5, questions: 5, label: 'R$ 5,00 (5 questões)' },
  { id: 'credits_10', amount: 10, questions: 10, label: 'R$ 10,00 (10 questões)' },
  { id: 'credits_20', amount: 20, questions: 20, label: 'R$ 20,00 (20 questões)' },
];

// Plano Veterano
export const VETERANO_PLAN = {
  id: 'veterano_monthly',
  amount: 49.90,
  label: 'Plano Veterano - R$ 49,90/mês',
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
  const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
  if (!pkg) {
    throw new Error('Pacote não encontrado');
  }

  const baseUrl = process.env.APP_URL || 'https://passarei.com.br';

  try {
    const response = await preference.create({
      body: {
        items: [
          {
            id: pkg.id,
            title: `Passarei - ${pkg.questions} Questões`,
            description: `Pacote de ${pkg.questions} questões para estudo`,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: pkg.amount,
          },
        ],
        payer: {
          email: email || 'cliente@passarei.com.br',
        },
        external_reference: `${telegramId}|${pkg.id}|${Date.now()}`,
        back_urls: {
          success: `${baseUrl}/pagamento/sucesso`,
          failure: `${baseUrl}/pagamento/falha`,
          pending: `${baseUrl}/pagamento/pendente`,
        },
        auto_return: 'approved',
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      },
    });

    return {
      id: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point,
    };
  } catch (error) {
    console.error('❌ Erro ao criar preferência:', error);
    throw error;
  }
}

// Criar preferência para Plano Veterano
export async function createVeteranoPreference(params: { telegramId: string; email?: string }) {
  const { telegramId, email } = params;
  const baseUrl = process.env.APP_URL || 'https://passarei.com.br';

  try {
    const response = await preference.create({
      body: {
        items: [
          {
            id: VETERANO_PLAN.id,
            title: 'Passarei - Plano Veterano',
            description: '300 questões/mês + 2 correções de redação + apostilas',
            quantity: 1,
            currency_id: 'BRL',
            unit_price: VETERANO_PLAN.amount,
          },
        ],
        payer: {
          email: email || 'cliente@passarei.com.br',
        },
        external_reference: `${telegramId}|veterano|${Date.now()}`,
        back_urls: {
          success: `${baseUrl}/pagamento/sucesso`,
          failure: `${baseUrl}/pagamento/falha`,
          pending: `${baseUrl}/pagamento/pendente`,
        },
        auto_return: 'approved',
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      },
    });

    return {
      id: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point,
    };
  } catch (error) {
    console.error('❌ Erro ao criar preferência Veterano:', error);
    throw error;
  }
}

// Buscar pagamento por ID
export async function getPayment(paymentId: string) {
  try {
    const response = await payment.get({ id: paymentId });
    return response;
  } catch (error) {
    console.error('❌ Erro ao buscar pagamento:', error);
    throw error;
  }
}

// Processar webhook de pagamento
export async function processPaymentWebhook(paymentId: string) {
  try {
    const paymentData = await getPayment(paymentId);
    
    if (paymentData.status === 'approved') {
      const externalRef = paymentData.external_reference || '';
      const [telegramId, packageId] = externalRef.split('|');
      
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
    console.error('❌ Erro ao processar webhook:', error);
    throw error;
  }
}
