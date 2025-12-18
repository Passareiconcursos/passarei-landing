import { Router, Request, Response } from 'express';
import { 
  createPaymentPreference, 
  createVeteranoPreference, 
  processPaymentWebhook,
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

    // Usar sandbox em teste, produção depois
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

// Criar pagamento para Plano Veterano
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
          // Atualizar créditos do usuário
          if (result.packageId === 'veterano') {
            // Ativar plano Veterano
            await db.execute(sql`
              UPDATE "User" 
              SET "plan" = 'VETERANO',
                  "planExpiresAt" = NOW() + INTERVAL '30 days',
                  "updatedAt" = NOW()
              WHERE "telegramId" = ${result.telegramId}
            `);
            console.log(`✅ Plano Veterano ativado para ${result.telegramId}`);
          } else {
            // Adicionar créditos
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

export default router;
