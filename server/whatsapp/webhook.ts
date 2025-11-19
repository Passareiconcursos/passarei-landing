import { Request, Response } from 'express';
import twilio from 'twilio';
import { handleOnboardingV2, isInOnboardingV2 } from './onboarding-v2';

const MessagingResponse = twilio.twiml.MessagingResponse;

export async function handleIncomingWhatsApp(req: Request, res: Response) {
  try {
    console.log('📱 Webhook recebido:', req.body);
    
    const { From, Body, ProfileName } = req.body;
    
    if (!From || !Body) {
      console.log('⚠️ Mensagem sem From ou Body');
      return res.status(200).send('OK');
    }
    
    const phoneNumber = From.replace(/whatsapp:\s*/i, '').trim();
    const message = Body?.trim() || '';
    const name = ProfileName || 'Usuário';
    
    console.log(`📨 Mensagem de ${name} (${phoneNumber}): "${message}"`);
    
    const twiml = new MessagingResponse();
    
    // ============================================
    // COMANDOS ESPECIAIS
    // ============================================
    const lowerMessage = message.toLowerCase();
    
    // Iniciar onboarding
    if (lowerMessage === 'oi' || lowerMessage === 'olá' || lowerMessage === 'ola' || lowerMessage === '/start' || lowerMessage === 'começar') {
      const response = handleOnboardingV2(phoneNumber, message, name);
      twiml.message(response);
      console.log(`✅ Onboarding V2 iniciado para ${phoneNumber}`);
    }
    // Usuário em onboarding
    else if (isInOnboardingV2(phoneNumber)) {
      const response = handleOnboardingV2(phoneNumber, message, name);
      twiml.message(response);
      console.log(`✅ Onboarding V2 step processado para ${phoneNumber}`);
    }
    // Comandos gerais
    else if (lowerMessage === 'ajuda' || lowerMessage === 'help' || lowerMessage === 'suporte') {
      twiml.message(
        `📚 *COMANDOS DISPONÍVEIS:*\n\n` +
        `• *oi* - Iniciar ou reiniciar cadastro\n` +
        `• *ajuda* - Ver este menu\n` +
        `• *planos* - Ver planos disponíveis\n` +
        `• *perfil* - Ver seu perfil\n` +
        `• *status* - Ver seu uso hoje\n` +
        `• *upgrade* - Assinar plano pago\n\n` +
        `_Digite qualquer comando acima!_`
      );
    }
    else if (lowerMessage === 'planos') {
      twiml.message(
        `💎 *PLANOS PASSAREI:*\n\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `🆓 *FREE (R$ 0)*\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `• 2 matérias/dia\n` +
        `• 2 correções/dia\n` +
        `• SEM redação\n` +
        `• Suporte em 24h\n\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `📚 *CALOURO (R$ 12,90/mês)*\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `• 10 matérias/dia (300/mês)\n` +
        `• 10 correções/dia\n` +
        `• 1 redação grátis/dia (30/mês)\n` +
        `• Redações extras: R$ 1,90\n` +
        `• Plano de aula personalizado\n` +
        `• Simulados mensais\n` +
        `• Suporte prioritário (2h)\n\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `🔥 *VETERANO (R$ 118,80/ano)*\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `• 30 matérias/dia (900/mês)\n` +
        `• 30 correções/dia\n` +
        `• 3 redações grátis/dia (90/mês)\n` +
        `• Redações extras: R$ 0,99 (50% OFF)\n` +
        `• Simulados ilimitados\n` +
        `• Suporte VIP 24/7 (30min)\n` +
        `• *Programa de afiliados (20% recorrente)*\n\n` +
        `💰 *ECONOMIA: 92% vs concorrentes!*\n\n` +
        `_Digite "upgrade" para assinar!_`
      );
    }
    else if (lowerMessage === 'upgrade') {
      twiml.message(
        `🚀 *FAZER UPGRADE:*\n\n` +
        `Escolha seu plano:\n\n` +
        `A) *CALOURO* - R$ 12,90/mês\n` +
        `B) *VETERANO* - R$ 118,80/ano (R$ 9,90/mês)\n\n` +
        `_Digite A ou B para continuar:_\n\n` +
        `✅ *Garantia de 7 dias* - Se não gostar, devolvemos 100% do seu dinheiro!`
      );
    }
    // Mensagem padrão (usuário já completou onboarding)
    else {
      twiml.message(
        `✅ Recebi: "${message}"\n\n` +
        `Em breve você receberá conteúdo educacional personalizado aqui!\n\n` +
        `Digite *ajuda* caso precise de suporte.`
      );
    }
    
    console.log(`✅ Resposta enviada para ${phoneNumber}`);
    
    res.type('text/xml');
    res.send(twiml.toString());
    
  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    res.status(500).send('Error');
  }
}
