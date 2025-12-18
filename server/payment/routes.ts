import { Router, Request, Response } from 'express';
import { 
  createPaymentPreference, 
  createVeteranoPreference, 
  processPaymentWebhook,
  createVeteranoSubscription,
  getSubscriptionStatus,
  cancelSubscription,
  CREDIT_PACKAGES 
} from './mercadopago';
import { db } from '../../db';
import { sql } from 'drizzle-orm';

const router = Router();

// Listar pacotes disponíveis
router.get('/packages', (req: Request, res: Response) => {
  res.json({
    success: true,
    packages: CREDIT_PACKAGES,
    veterano: {
      id: 'veterano_monthly',
      amount: 49.90,
      label: 'Plano Veterano - R$ 49,90/mês',
      benefits: [
        '300 questões personalizadas/mês',
        '2 correções de redação/mês com IA',
        'Todas as apostilas inclusas',
        'Revisão inteligente SM2',
      ],
    },
  });
});

// Criar pagamento para créditos (Pay-per-use)
router.post('/create-payment', async (req: Request, res: Response) => {
  try {
    const { packageId, telegramId, email } = req.body;

    if (!packageId || !telegramId) {
      return res.status(400).json({ 
        success: false, 
        error: 'packageId e telegramId são obrigatórios' 
      });
    }

    const preference = await createPaymentPreference({
      packageId,
      telegramId,
      email,
    });

    const paymentUrl = process.env.NODE_ENV === 'production' 
      ? preference.initPoint 
      : preference.sandboxInitPoint;

    res.json({
      success: true,
      preferenceId: preference.id,
      paymentUrl,
    });
  } catch (error: any) {
    console.error('❌ Erro ao criar pagamento:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Criar pagamento para Plano Veterano (único)
router.post('/create-veterano', async (req: Request, res: Response) => {
  try {
    const { telegramId, email } = req.body;

    if (!telegramId) {
      return res.status(400).json({ 
        success: false, 
        error: 'telegramId é obrigatório' 
      });
    }

    const preference = await createVeteranoPreference({
      telegramId,
      email,
    });

    const paymentUrl = process.env.NODE_ENV === 'production' 
      ? preference.initPoint 
      : preference.sandboxInitPoint;

    res.json({
      success: true,
      preferenceId: preference.id,
      paymentUrl,
    });
  } catch (error: any) {
    console.error('❌ Erro ao criar pagamento Veterano:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Webhook do Mercado Pago
router.post('/webhooks/mercadopago', async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;

    console.log('📩 Webhook recebido:', type, data);

    if (type === 'payment') {
      const paymentId = data?.id;
      
      if (paymentId) {
        const result = await processPaymentWebhook(String(paymentId));
        
        if (result.success && result.telegramId) {
          if (result.packageId === 'veterano') {
            await db.execute(sql`
              UPDATE "User" 
              SET "plan" = 'VETERANO',
                  "planExpiresAt" = NOW() + INTERVAL '30 days',
                  "updatedAt" = NOW()
              WHERE "telegramId" = ${result.telegramId}
            `);
            console.log(`✅ Plano Veterano ativado para ${result.telegramId}`);
          } else {
            const credits = result.amount || 0;
            await db.execute(sql`
              UPDATE "User" 
              SET "credits" = COALESCE("credits", 0) + ${credits},
                  "updatedAt" = NOW()
              WHERE "telegramId" = ${result.telegramId}
            `);
            console.log(`✅ ${credits} créditos adicionados para ${result.telegramId}`);
          }
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    res.status(500).send('Error');
  }
});

// Verificar status de pagamento
router.get('/status/:paymentId', async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const result = await processPaymentWebhook(paymentId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// ASSINATURAS (PLANO VETERANO RECORRENTE)
// ============================================

// Criar assinatura do Plano Veterano
router.post('/create-subscription', async (req: Request, res: Response) => {
  try {
    const { telegramId, email } = req.body;

    if (!telegramId || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'telegramId e email são obrigatórios' 
      });
    }

    const subscription = await createVeteranoSubscription({
      telegramId,
      email,
    });

    res.json({
      success: true,
      subscriptionId: subscription.subscriptionId,
      paymentUrl: subscription.initPoint,
    });
  } catch (error: any) {
    console.error('❌ Erro ao criar assinatura:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Verificar status da assinatura
router.get('/subscription/:subscriptionId', async (req: Request, res: Response) => {
  try {
    const { subscriptionId } = req.params;
    const status = await getSubscriptionStatus(subscriptionId);
    res.json({ success: true, ...status });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cancelar assinatura
router.post('/subscription/:subscriptionId/cancel', async (req: Request, res: Response) => {
  try {
    const { subscriptionId } = req.params;
    const result = await cancelSubscription(subscriptionId);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Webhook para assinaturas
router.post('/webhooks/subscription', async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;
    
    console.log('📩 Webhook de assinatura:', type, data);

    if (type === 'subscription_preapproval') {
      const subscriptionId = data?.id;
      
      if (subscriptionId) {
        const subscription = await getSubscriptionStatus(String(subscriptionId));
        
        if (subscription.status === 'authorized') {
          const externalRef = subscription.external_reference || '';
          const [telegramId] = externalRef.split('|');
          
          await db.execute(sql`
            UPDATE "User" 
            SET "plan" = 'VETERANO',
                "planExpiresAt" = NOW() + INTERVAL '30 days',
                "updatedAt" = NOW()
            WHERE "telegramId" = ${telegramId}
          `);
          
          console.log(`✅ Assinatura Veterano ativada para ${telegramId}`);
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Erro no webhook de assinatura:', error);
    res.status(500).send('Error');
  }
});

export default router;
