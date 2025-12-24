// server/email/templates/welcome.ts
// 📧 Template de email de boas-vindas após pagamento

/**
 * Gera HTML do email de boas-vindas
 *
 * @param data - Dados do usuário e plano
 * @returns HTML do email
 */
interface WelcomeEmailData {
  userName: string; // Nome ou email do usuário
  userEmail: string; // Email do usuário
  plan: "calouro" | "veterano"; // Plano contratado
  activationCode: string; // Código de ativação único
  paymentId?: string; // ID do pagamento (opcional)
}

export function generateWelcomeEmail(data: WelcomeEmailData): string {
  const { userName, userEmail, plan, activationCode, paymentId } = data;

  // Determinar informações do plano
  const planName = plan === "veterano" ? "VETERANO" : "CALOURO";
  const planPrice = plan === "veterano" ? "R$ 44,90/mês" : "R$ 89,90/mês";
  const planColor = plan === "veterano" ? "#18cb96" : "#3b82f6";
  const planGradient =
    plan === "veterano"
      ? "linear-gradient(135deg, #18cb96 0%, #14b584 100%)"
      : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";

  // Link do Telegram com código de ativação
  const telegramLink = `https://t.me/PassareiBot?start=${activationCode}`;

  // Data atual formatada
  const currentDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Bem-vindo ao Passarei!</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">

  <!-- Container Principal -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
    <tr>
      <td style="padding: 40px 20px;">

        <!-- Card do Email (max-width: 600px) -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden;">

          <!-- Header com Gradiente -->
          <tr>
            <td style="background: ${planGradient}; padding: 40px 30px; text-align: center;">
              <!-- Ícone de Sucesso -->
              <div style="background-color: #ffffff; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="${planColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>

              <!-- Título -->
              <h1 style="margin: 0 0 12px; color: #ffffff; font-size: 36px; font-weight: 700; line-height: 1.2;">
                🎉 Pagamento Confirmado!
              </h1>

              <!-- Subtítulo -->
              <p style="margin: 0 0 16px; color: rgba(255,255,255,0.95); font-size: 20px; font-weight: 500;">
                Seu plano <strong>${planName}</strong> está ativo!
              </p>

              <!-- Badge do Plano -->
              <div style="display: inline-block; background-color: rgba(255,255,255,0.2); padding: 10px 24px; border-radius: 24px; backdrop-filter: blur(10px);">
                <span style="color: #ffffff; font-weight: 700; font-size: 18px;">${planPrice}</span>
              </div>
            </td>
          </tr>

          <!-- Conteúdo Principal -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Saudação -->
              <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.6;">
                Olá <strong>${userName.split("@")[0]}</strong>,
              </p>

              <p style="margin: 0 0 32px; font-size: 16px; color: #374151; line-height: 1.6;">
                Parabéns por dar esse passo importante rumo à sua aprovação! 🚀
              </p>

              <!-- Box: Próximo Passo (DESTAQUE) -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); border: 2px solid #3b82f6; border-radius: 12px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <!-- Título da Box -->
                    <h2 style="margin: 0 0 16px; font-size: 22px; color: #1e3a8a; font-weight: 700;">
                      📱 Próximo Passo: Acesse o Telegram
                    </h2>

                    <p style="margin: 0 0 24px; font-size: 16px; color: #1e40af; line-height: 1.6;">
                      Clique no botão abaixo para começar a estudar <strong>agora mesmo</strong>:
                    </p>

                    <!-- Botão GRANDE do Telegram -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td align="center">
                          <a href="${telegramLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #0088cc 0%, #0077b3 100%); color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 12px; font-weight: 700; font-size: 18px; box-shadow: 0 4px 12px rgba(0,136,204,0.3); transition: all 0.3s;">
                            ✈️ Abrir Bot no Telegram ✨
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Instrução -->
                    <p style="margin: 20px 0 0; font-size: 14px; color: #1e40af; text-align: center;">
                      👉 Ao abrir o bot, envie o comando <code style="background-color: #e5e7eb; padding: 3px 8px; border-radius: 4px; font-family: monospace; color: #3b82f6; font-weight: 600;">/start</code>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Seu Código de Ativação -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #92400e; font-weight: 600;">
                      🔑 Seu Código de Ativação:
                    </p>
                    <p style="margin: 0; font-family: monospace; font-size: 20px; color: #92400e; font-weight: 700; letter-spacing: 2px;">
                      ${activationCode}
                    </p>
                    <p style="margin: 8px 0 0; font-size: 12px; color: #92400e;">
                      (O código já está no link acima, mas guarde por segurança)
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Como Funciona -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #fdf4ff 0%, #fce7f3 100%); border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 20px; font-size: 20px; color: #701a75; font-weight: 700;">
                      ✨ Como Funciona o Passarei
                    </h3>

                    <!-- Passo 1 -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 16px;">
                      <tr>
                        <td width="40" valign="top">
                          <div style="width: 36px; height: 36px; background-color: #a21caf; color: #ffffff; border-radius: 50%; text-align: center; line-height: 36px; font-weight: 700; font-size: 18px;">1</div>
                        </td>
                        <td valign="top" style="padding-left: 12px;">
                          <p style="margin: 0 0 4px; font-weight: 600; color: #701a75; font-size: 16px;">Abra o Bot</p>
                          <p style="margin: 0; font-size: 14px; color: #86198f; line-height: 1.5;">Clique no botão acima e envie <code style="background-color: rgba(168,85,247,0.2); padding: 2px 6px; border-radius: 3px;">/start</code></p>
                        </td>
                      </tr>
                    </table>

                    <!-- Passo 2 -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 16px;">
                      <tr>
                        <td width="40" valign="top">
                          <div style="width: 36px; height: 36px; background-color: #a21caf; color: #ffffff; border-radius: 50%; text-align: center; line-height: 36px; font-weight: 700; font-size: 18px;">2</div>
                        </td>
                        <td valign="top" style="padding-left: 12px;">
                          <p style="margin: 0 0 4px; font-weight: 600; color: #701a75; font-size: 16px;">Receba Conteúdo</p>
                          <p style="margin: 0; font-size: 14px; color: #86198f; line-height: 1.5;">Questões personalizadas chegam automaticamente no seu Telegram</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Passo 3 -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="40" valign="top">
                          <div style="width: 36px; height: 36px; background-color: #a21caf; color: #ffffff; border-radius: 50%; text-align: center; line-height: 36px; font-weight: 700; font-size: 18px;">3</div>
                        </td>
                        <td valign="top" style="padding-left: 12px;">
                          <p style="margin: 0 0 4px; font-weight: 600; color: #701a75; font-size: 16px;">Estude e Evolua</p>
                          <p style="margin: 0; font-size: 14px; color: #86198f; line-height: 1.5;">Receba correções detalhadas e acompanhe seu progresso</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Informações do Pedido -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 16px; font-size: 16px; color: #111827; font-weight: 600;">
                      📋 Informações do Pedido
                    </h3>

                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">Email:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #111827; text-align: right; font-weight: 500;">${userEmail}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">Plano:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #111827; text-align: right; font-weight: 500;">${planName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">Valor:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #111827; text-align: right; font-weight: 500;">${planPrice}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Data:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; text-align: right; font-weight: 500;">${currentDate}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Dica Importante -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #dcfce7; border-left: 4px solid #16a34a; border-radius: 8px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0; font-size: 14px; color: #15803d; line-height: 1.6;">
                      <strong>💡 Dica:</strong> Estude pelo menos <strong>10 questões por dia</strong> para obter os melhores resultados e manter o ritmo de aprendizado!
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Suporte -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #6b7280;">
                      Precisa de ajuda? Estamos aqui para você!
                    </p>
                    <a href="mailto:suporte@passarei.com.br" style="color: #3b82f6; text-decoration: none; font-weight: 600; font-size: 14px;">
                      📧 suporte@passarei.com.br
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; font-size: 18px; color: #111827; font-weight: 700;">
                Você vai passar! 🎯
              </p>
              <p style="margin: 0 0 16px; font-size: 14px; color: #6b7280;">
                Estamos juntos nessa jornada.
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} Passarei. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
        <!-- Fim do Card -->

        <!-- Badge de Segurança -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 20px auto 0;">
          <tr>
            <td style="text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                🔒 Pagamento processado com segurança pelo Mercado Pago
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

/**
 * Versão de texto simples (fallback)
 */
export function generateWelcomeEmailText(data: WelcomeEmailData): string {
  const { userName, plan, activationCode } = data;
  const planName = plan === "veterano" ? "VETERANO" : "CALOURO";
  const telegramLink = `https://t.me/PassareiBot?start=${activationCode}`;

  return `
🎉 PAGAMENTO CONFIRMADO!

Olá ${userName.split("@")[0]},

Seu plano ${planName} está ativo!

📱 PRÓXIMO PASSO:
Acesse o bot do Telegram agora mesmo:
${telegramLink}

Ao abrir, envie o comando: /start

🔑 Seu código de ativação: ${activationCode}

✨ COMO FUNCIONA:
1. Abra o bot e envie /start
2. Receba questões personalizadas
3. Estude e evolua com correções detalhadas

💡 DICA: Estude pelo menos 10 questões por dia!

Precisa de ajuda?
📧 suporte@passarei.com.br

Você vai passar! 🎯
Equipe Passarei
  `.trim();
}
