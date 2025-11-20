import { Request, Response } from 'express';
import twilio from 'twilio';

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
    
    // TESTE SIMPLES SEM FORMATAÇÃO
    if (message.toLowerCase().includes('oi')) {
      twiml.message(
        `Ola ${name}!\n\n` +
        `Bem-vindo ao Passarei!\n\n` +
        `Para qual concurso voce esta estudando?\n\n` +
        `A) PM\n` +
        `B) PC\n` +
        `C) PF\n` +
        `D) PRF\n\n` +
        `Digite a letra:`
      );
    } else {
      twiml.message(`Recebi: ${message}`);
    }
    
    console.log(`✅ Resposta enviada para ${phoneNumber}`);
    console.log(`📤 TwiML: ${twiml.toString()}`);
    
    res.type('text/xml');
    res.send(twiml.toString());
    
  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    res.status(500).send('Error');
  }
}
