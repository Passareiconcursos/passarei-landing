// server/email/send-lead-drip.ts
// 📧 Envio de emails da drip campaign para leads

import { sendEmail } from "./resend";
import {
  generateLeadWelcomeEmail,
  generateLeadEducationalEmail,
  generateLeadSocialProofEmail,
  generateLeadLastChanceEmail,
  DRIP_EMAIL_SUBJECTS,
} from "./templates/drip-lead";

interface LeadDripParams {
  leadEmail: string;
  leadName: string;
  examType: string;
}

/**
 * Envia email 1: Boas-vindas (imediato ao cadastro)
 */
export async function sendLeadWelcomeEmail(params: LeadDripParams) {
  try {
    console.log(`📧 [Drip 1/4] Enviando boas-vindas para: ${params.leadEmail}`);

    const html = generateLeadWelcomeEmail({
      leadName: params.leadName,
      leadEmail: params.leadEmail,
      examType: params.examType,
    });

    const result = await sendEmail({
      to: params.leadEmail,
      subject: DRIP_EMAIL_SUBJECTS.welcome,
      html,
    });

    console.log(`✅ [Drip 1/4] Email enviado: ${result?.id}`);
    return { success: true, emailId: result?.id };
  } catch (error: any) {
    console.error(`❌ [Drip 1/4] Erro:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Envia email 2: Conteúdo educativo (+7 dias)
 */
export async function sendLeadEducationalEmail(params: LeadDripParams) {
  try {
    console.log(`📧 [Drip 2/4] Enviando educativo para: ${params.leadEmail}`);

    const html = generateLeadEducationalEmail({
      leadName: params.leadName,
      leadEmail: params.leadEmail,
      examType: params.examType,
    });

    const result = await sendEmail({
      to: params.leadEmail,
      subject: DRIP_EMAIL_SUBJECTS.educational,
      html,
    });

    console.log(`✅ [Drip 2/4] Email enviado: ${result?.id}`);
    return { success: true, emailId: result?.id };
  } catch (error: any) {
    console.error(`❌ [Drip 2/4] Erro:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Envia email 3: Social proof + oferta (+14 dias)
 */
export async function sendLeadSocialProofEmail(params: LeadDripParams) {
  try {
    console.log(`📧 [Drip 3/4] Enviando social proof para: ${params.leadEmail}`);

    const html = generateLeadSocialProofEmail({
      leadName: params.leadName,
      leadEmail: params.leadEmail,
      examType: params.examType,
    });

    const result = await sendEmail({
      to: params.leadEmail,
      subject: DRIP_EMAIL_SUBJECTS.socialProof,
      html,
    });

    console.log(`✅ [Drip 3/4] Email enviado: ${result?.id}`);
    return { success: true, emailId: result?.id };
  } catch (error: any) {
    console.error(`❌ [Drip 3/4] Erro:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Envia email 4: Última chance (+21 dias)
 */
export async function sendLeadLastChanceEmail(params: LeadDripParams) {
  try {
    console.log(`📧 [Drip 4/4] Enviando última chance para: ${params.leadEmail}`);

    const html = generateLeadLastChanceEmail({
      leadName: params.leadName,
      leadEmail: params.leadEmail,
      examType: params.examType,
    });

    const result = await sendEmail({
      to: params.leadEmail,
      subject: DRIP_EMAIL_SUBJECTS.lastChance,
      html,
    });

    console.log(`✅ [Drip 4/4] Email enviado: ${result?.id}`);
    return { success: true, emailId: result?.id };
  } catch (error: any) {
    console.error(`❌ [Drip 4/4] Erro:`, error.message);
    return { success: false, error: error.message };
  }
}
