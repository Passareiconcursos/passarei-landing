import twilio from 'twilio';
import { TWILIO_CONFIG } from './config';

const client = twilio(TWILIO_CONFIG.accountSid, TWILIO_CONFIG.authToken);

export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const result = await client.messages.create({
      from: TWILIO_CONFIG.whatsappNumber,
      to: `whatsapp:${to}`,
      body: message
    });
    console.log(`✅ Mensagem enviada para ${to}: ${result.sid}`);
    return result;
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error);
    throw error;
  }
}
