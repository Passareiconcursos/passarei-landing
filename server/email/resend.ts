// server/email/resend.ts
// 📧 Configuração do Resend para envio de emails

import { Resend } from "resend";

// Inicializar cliente Resend com API Key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Configurações de email
 *
 * IMPORTANTE:
 * - Se DNS configurado: use 'Passarei <noreply@passarei.com.br>'
 * - Se DNS NÃO configurado: use 'Passarei <onboarding@resend.dev>'
 */
export const EMAIL_CONFIG = {
  // ⚠️ COMEÇAR COM ESTE (funciona imediatamente):
  from: "Passarei <noreply@passarei.com.br>",

  // 🔄 DEPOIS mudar para este (quando DNS verificar):
  // from: 'Passarei <noreply@passarei.com.br>',

  // Email para respostas (opcional)
  replyTo: "suporte@passarei.com.br",
};

/**
 * Interface para dados do email
 */
interface EmailData {
  to: string; // Email destinatário
  subject: string; // Assunto
  html: string; // Conteúdo HTML
}

/**
 * Função principal para enviar emails
 *
 * @param data - Dados do email (to, subject, html)
 * @returns ID do email enviado
 */
export async function sendEmail(data: EmailData) {
  try {
    console.log(`📧 [Resend] Enviando email para: ${data.to}`);
    console.log(`📧 [Resend] Assunto: ${data.subject}`);

    // Enviar email via Resend
    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: data.to,
      subject: data.subject,
      html: data.html,
      // reply_to: EMAIL_CONFIG.replyTo, // Descomente para ativar reply-to
    });

    // Verificar se houve erro
    if (result.error) {
      console.error("❌ [Resend] Erro ao enviar:", result.error);
      throw new Error(result.error.message);
    }

    console.log("✅ [Resend] Email enviado com sucesso!");
    console.log("📧 [Resend] ID:", result.data?.id);

    return result.data;
  } catch (error: any) {
    console.error("❌ [Resend] Erro crítico:", error);
    throw error;
  }
}

/**
 * Função de teste (use para validar configuração)
 * Depois pode remover ou comentar
 *
 * @param testEmail - Email para testar
 */
export async function testResend(testEmail: string) {
  try {
    console.log("🧪 [Resend] Iniciando teste...");

    const result = await sendEmail({
      to: testEmail,
      subject: "🧪 Teste Resend - Passarei",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #18cb96 0%, #14b584 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">✅ Resend Funcionando!</h1>
          </div>

          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333;">
              Parabéns! Se você recebeu este email, o <strong>Resend está configurado corretamente</strong> no projeto Passarei.
            </p>

            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0; color: #666;">
                <strong>Data/Hora:</strong> ${new Date().toLocaleString(
                  "pt-BR",
                  {
                    timeZone: "America/Sao_Paulo",
                    dateStyle: "full",
                    timeStyle: "long",
                  },
                )}
              </p>
              <p style="margin: 5px 0; color: #666;">
                <strong>Enviado de:</strong> ${EMAIL_CONFIG.from}
              </p>
              <p style="margin: 5px 0; color: #666;">
                <strong>Para:</strong> ${testEmail}
              </p>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Próximo passo: Criar templates de emails para os usuários! 🚀
            </p>
          </div>
        </div>
      `,
    });

    console.log("✅ [Resend] Teste concluído com sucesso!");
    return result;
  } catch (error: any) {
    console.error("❌ [Resend] Falha no teste:", error.message);
    throw error;
  }
}

// Exportar cliente Resend (caso precise usar diretamente)
export default resend;
