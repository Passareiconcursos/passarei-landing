// server/email/send-welcome.ts
// 🚀 Função helper para enviar email de boas-vindas

import { sendEmail } from "./resend";
import {
  generateWelcomeEmail,
  generateWelcomeEmailText,
} from "./templates/welcome";

/**
 * Interface para dados do email de boas-vindas
 */
export interface SendWelcomeEmailParams {
  userEmail: string;
  userName?: string;
  plan: "calouro" | "veterano";
  activationCode: string;
  paymentId?: string;
}

/**
 * Envia email de boas-vindas após pagamento aprovado
 *
 * @param params - Dados do usuário e plano
 * @returns Promise com resultado do envio
 *
 * @example
 * ```typescript
 * await sendWelcomeEmail({
 *   userEmail: 'usuario@gmail.com',
 *   plan: 'veterano',
 *   activationCode: 'PASS-ABC123',
 *   paymentId: 'MP-12345'
 * });
 * ```
 */
export async function sendWelcomeEmail(params: SendWelcomeEmailParams) {
  const { userEmail, userName, plan, activationCode, paymentId } = params;

  try {
    console.log(`📧 [Welcome Email] Preparando email para: ${userEmail}`);
    console.log(`📧 [Welcome Email] Plano: ${plan}`);
    console.log(`📧 [Welcome Email] Código: ${activationCode}`);

    // Nome do usuário (usa email se não tiver nome)
    const displayName = userName || userEmail;

    // Gerar HTML do email
    const htmlContent = generateWelcomeEmail({
      userName: displayName,
      userEmail,
      plan,
      activationCode,
      paymentId,
    });

    // Gerar versão texto (fallback)
    const textContent = generateWelcomeEmailText({
      userName: displayName,
      userEmail,
      plan,
      activationCode,
      paymentId,
    });

    // Determinar assunto baseado no plano
    const planEmoji = plan === "veterano" ? "⭐" : "🎓";
    const planName = plan === "veterano" ? "VETERANO" : "CALOURO";
    const subject = `${planEmoji} Bem-vindo ao Passarei - Plano ${planName} Ativo!`;

    // Enviar email
    const result = await sendEmail({
      to: userEmail,
      subject,
      html: htmlContent,
      // text: textContent, // Descomente se quiser versão texto
    });

    console.log("✅ [Welcome Email] Email de boas-vindas enviado com sucesso!");
    console.log(`📧 [Welcome Email] ID do email: ${result?.id}`);

    return {
      success: true,
      emailId: result?.id,
      sentTo: userEmail,
      plan,
      activationCode,
    };
  } catch (error: any) {
    console.error(
      "❌ [Welcome Email] Erro ao enviar email de boas-vindas:",
      error,
    );

    // Não lançar erro - queremos que o pagamento seja processado mesmo se email falhar
    return {
      success: false,
      error: error.message,
      sentTo: userEmail,
      plan,
      activationCode,
    };
  }
}

/**
 * Envia email de teste de boas-vindas
 * Útil para testar o template
 */
export async function sendWelcomeEmailTest(testEmail: string) {
  return sendWelcomeEmail({
    userEmail: testEmail,
    userName: "Usuário Teste",
    plan: "veterano",
    activationCode: "PASS-DEMO123",
    paymentId: "TEST-12345",
  });
}
