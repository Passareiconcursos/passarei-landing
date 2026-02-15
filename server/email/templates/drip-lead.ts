// server/email/templates/drip-lead.ts
// 📧 Templates da drip campaign para novos leads (4 emails em 4 semanas)

interface LeadEmailData {
  leadName: string;
  leadEmail: string;
  examType: string;
}

// Mapeamento de examType para nome legível
function getExamName(examType: string): string {
  const map: Record<string, string> = {
    PF: "Polícia Federal",
    PRF: "Polícia Rodoviária Federal",
    PM: "Polícia Militar",
    PC: "Polícia Civil",
    PP_FEDERAL: "Polícia Penal Federal",
    PL_FEDERAL: "Polícia Legislativa Federal",
    DEPEN: "DEPEN",
    ABIN: "ABIN",
    EXERCITO: "Exército",
    BOMBEIRO_MILITAR: "Bombeiro Militar",
    GCM: "Guarda Civil Municipal",
  };
  return map[examType] || examType || "Concurso Policial";
}

// ============================================
// EMAIL 1: Boas-vindas (envio imediato)
// ============================================
export function generateLeadWelcomeEmail(data: LeadEmailData): string {
  const { leadName, examType } = data;
  const firstName = leadName.split(" ")[0];
  const examName = getExamName(examType);
  const telegramLink = "https://t.me/PassareiBot";

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao Passarei!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #18cb96 0%, #0ea5e9 100%); padding: 40px 30px; text-align: center;">
              <div style="background-color: #ffffff; width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 16px; padding: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <img src="https://passarei.com.br/logo.png" alt="Passarei" style="width: 100%; height: 100%; object-fit: contain;" />
              </div>
              <h1 style="margin: 0 0 8px; color: #ffffff; font-size: 28px; font-weight: 700;">
                Bem-vindo ao Passarei!
              </h1>
              <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                Sua jornada para a ${examName} começa agora
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #374151; line-height: 1.6;">
                Olá <strong>${firstName}</strong>,
              </p>

              <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.6;">
                Que bom ter você aqui! Você deu o primeiro passo rumo à aprovação na <strong>${examName}</strong>.
              </p>

              <!-- Destaque: 21 questões grátis -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); border: 2px solid #3b82f6; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 12px; font-size: 20px; color: #1e3a8a; font-weight: 700;">
                      🎁 21 Questões Grátis Esperando Você
                    </h2>
                    <p style="margin: 0 0 20px; font-size: 15px; color: #1e40af; line-height: 1.6;">
                      Acesse nosso bot no Telegram e comece a estudar agora mesmo com <strong>questões reais de concursos policiais</strong>, corrigidas com explicação detalhada.
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td align="center">
                          <a href="${telegramLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #0088cc 0%, #0077b3 100%); color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 700; font-size: 17px; box-shadow: 0 4px 12px rgba(0,136,204,0.3);">
                            Estudar Grátis no Telegram
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- O que é o Passarei -->
              <h3 style="margin: 0 0 16px; font-size: 18px; color: #111827;">Como funciona?</h3>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 12px;">
                <tr>
                  <td width="36" valign="top">
                    <div style="width: 32px; height: 32px; background-color: #18cb96; color: #fff; border-radius: 50%; text-align: center; line-height: 32px; font-weight: 700; font-size: 16px;">1</div>
                  </td>
                  <td valign="top" style="padding-left: 12px; padding-bottom: 16px;">
                    <p style="margin: 0 0 2px; font-weight: 600; color: #111827; font-size: 15px;">Abra o Telegram</p>
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">Clique no botão acima e inicie o bot Passarei</p>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 12px;">
                <tr>
                  <td width="36" valign="top">
                    <div style="width: 32px; height: 32px; background-color: #18cb96; color: #fff; border-radius: 50%; text-align: center; line-height: 32px; font-weight: 700; font-size: 16px;">2</div>
                  </td>
                  <td valign="top" style="padding-left: 12px; padding-bottom: 16px;">
                    <p style="margin: 0 0 2px; font-weight: 600; color: #111827; font-size: 15px;">Escolha seu concurso</p>
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">Selecione ${examName} e configure seu plano de estudo</p>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td width="36" valign="top">
                    <div style="width: 32px; height: 32px; background-color: #18cb96; color: #fff; border-radius: 50%; text-align: center; line-height: 32px; font-weight: 700; font-size: 16px;">3</div>
                  </td>
                  <td valign="top" style="padding-left: 12px; padding-bottom: 16px;">
                    <p style="margin: 0 0 2px; font-weight: 600; color: #111827; font-size: 15px;">Estude com questões reais</p>
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">Receba conteúdo + questão com explicação detalhada</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; font-size: 16px; color: #111827; font-weight: 600;">
                Você vai passar!
              </p>
              <p style="margin: 0 0 12px; font-size: 13px; color: #6b7280;">
                Equipe Passarei | suporte@passarei.com.br
              </p>
              <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                &copy; ${new Date().getFullYear()} Passarei. Todos os direitos reservados.
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

// ============================================
// EMAIL 2: Conteúdo educativo (+7 dias)
// ============================================
export function generateLeadEducationalEmail(data: LeadEmailData): string {
  const { leadName, examType } = data;
  const firstName = leadName.split(" ")[0];
  const examName = getExamName(examType);
  const telegramLink = "https://t.me/PassareiBot";

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dicas para ${examName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 36px 30px; text-align: center;">
              <h1 style="margin: 0 0 8px; color: #ffffff; font-size: 26px; font-weight: 700;">
                As 5 Matérias que Mais Reprovam
              </h1>
              <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 15px;">
                E como dominar cada uma delas
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #374151; line-height: 1.6;">
                Olá <strong>${firstName}</strong>,
              </p>

              <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.6;">
                Você sabia que a maioria dos candidatos da <strong>${examName}</strong> reprova nas mesmas matérias? Veja quais são e como se preparar:
              </p>

              <!-- Matéria 1 -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0 0 4px; font-weight: 700; color: #991b1b; font-size: 15px;">1. Direito Constitucional</p>
                    <p style="margin: 0; font-size: 14px; color: #7f1d1d; line-height: 1.5;">Foque nos artigos 5 e 37-41. Representam 70% das questões.</p>
                  </td>
                </tr>
              </table>

              <!-- Matéria 2 -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0 0 4px; font-weight: 700; color: #991b1b; font-size: 15px;">2. Direito Penal</p>
                    <p style="margin: 0; font-size: 14px; color: #7f1d1d; line-height: 1.5;">Crimes contra a pessoa e contra o patrimônio são os mais cobrados.</p>
                  </td>
                </tr>
              </table>

              <!-- Matéria 3 -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0 0 4px; font-weight: 700; color: #991b1b; font-size: 15px;">3. Português</p>
                    <p style="margin: 0; font-size: 14px; color: #7f1d1d; line-height: 1.5;">Interpretação de texto e concordância verbal eliminam mais candidatos.</p>
                  </td>
                </tr>
              </table>

              <!-- Matéria 4 -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0 0 4px; font-weight: 700; color: #991b1b; font-size: 15px;">4. Raciocínio Lógico</p>
                    <p style="margin: 0; font-size: 14px; color: #7f1d1d; line-height: 1.5;">Proposições lógicas e equivalências são o segredo da aprovação.</p>
                  </td>
                </tr>
              </table>

              <!-- Matéria 5 -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0 0 4px; font-weight: 700; color: #991b1b; font-size: 15px;">5. Informática</p>
                    <p style="margin: 0; font-size: 14px; color: #7f1d1d; line-height: 1.5;">Segurança da informação e redes são temas recorrentes.</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%); border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 16px; font-size: 16px; color: #166534; font-weight: 600;">
                      No Passarei, você pratica essas matérias com questões reais e correção inteligente.
                    </p>
                    <a href="${telegramLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #18cb96 0%, #14b584 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(24,203,150,0.3);">
                      Praticar Agora no Telegram
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; font-size: 16px; color: #111827; font-weight: 600;">
                Você vai passar!
              </p>
              <p style="margin: 0 0 12px; font-size: 13px; color: #6b7280;">
                Equipe Passarei | suporte@passarei.com.br
              </p>
              <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                &copy; ${new Date().getFullYear()} Passarei. Todos os direitos reservados.
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

// ============================================
// EMAIL 3: Social proof + oferta (+14 dias)
// ============================================
export function generateLeadSocialProofEmail(data: LeadEmailData): string {
  const { leadName, examType } = data;
  const firstName = leadName.split(" ")[0];
  const examName = getExamName(examType);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alunos aprovados com o Passarei</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 36px 30px; text-align: center;">
              <h1 style="margin: 0 0 8px; color: #ffffff; font-size: 26px; font-weight: 700;">
                Eles estudaram 10 questões por dia
              </h1>
              <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 15px;">
                E passaram no concurso
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 30px;">
              <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.6;">
                ${firstName}, o método é simples: <strong>consistência vence talento</strong>. Quem estuda 10 questões por dia no Passarei, chega preparado na prova.
              </p>

              <!-- Depoimento 1 -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0fdf4; border-radius: 12px; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px; font-size: 15px; color: #166534; line-height: 1.6; font-style: italic;">
                      "Estudava no ônibus pelo Telegram. Em 3 meses, passei de 40% para 78% de acerto. Fui aprovado na PM-SP."
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #15803d; font-weight: 600;">
                      - Rafael S., aprovado PM-SP 2025
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Depoimento 2 -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0fdf4; border-radius: 12px; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px; font-size: 15px; color: #166534; line-height: 1.6; font-style: italic;">
                      "O bot me mandava lembrete toda noite às 18h. Nunca pulei um dia. Aprovada na PRF com nota acima da média."
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #15803d; font-weight: 600;">
                      - Camila L., aprovada PRF 2025
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Depoimento 3 -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0fdf4; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px; font-size: 15px; color: #166534; line-height: 1.6; font-style: italic;">
                      "As explicações de cada questão são melhores que muita aula que paguei caro. Vale cada centavo."
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #15803d; font-weight: 600;">
                      - Marcos A., estudando para PF 2026
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Oferta Calouro -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); border: 2px solid #3b82f6; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <h2 style="margin: 0 0 8px; font-size: 22px; color: #1e3a8a;">Plano Calouro</h2>
                    <p style="margin: 0 0 4px; font-size: 32px; color: #1e3a8a; font-weight: 700;">R$ 89,90<span style="font-size: 16px; font-weight: 400;">/mês</span></p>
                    <p style="margin: 0 0 16px; font-size: 14px; color: #3b82f6;">10 questões/dia com correção inteligente</p>
                    <a href="https://passarei.com.br/#planos" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(59,130,246,0.3);">
                      Quero Começar Agora
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Oferta Veterano -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%); border: 2px solid #18cb96; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <div style="display: inline-block; background-color: #18cb96; color: #fff; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 700; margin-bottom: 8px;">MELHOR CUSTO-BENEFÍCIO</div>
                    <h2 style="margin: 0 0 8px; font-size: 22px; color: #166534;">Plano Veterano</h2>
                    <p style="margin: 0 0 4px; font-size: 32px; color: #166534; font-weight: 700;">R$ 44,90<span style="font-size: 16px; font-weight: 400;">/mês</span></p>
                    <p style="margin: 0 0 16px; font-size: 14px; color: #15803d;">30 questões/dia + revisão espaçada + plano anual</p>
                    <a href="https://passarei.com.br/#planos" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #18cb96 0%, #14b584 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(24,203,150,0.3);">
                      Assinar Veterano
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; font-size: 16px; color: #111827; font-weight: 600;">
                Você vai passar!
              </p>
              <p style="margin: 0 0 12px; font-size: 13px; color: #6b7280;">
                Equipe Passarei | suporte@passarei.com.br
              </p>
              <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                &copy; ${new Date().getFullYear()} Passarei. Todos os direitos reservados.
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

// ============================================
// EMAIL 4: Última chance (+21 dias)
// ============================================
export function generateLeadLastChanceEmail(data: LeadEmailData): string {
  const { leadName, examType } = data;
  const firstName = leadName.split(" ")[0];
  const examName = getExamName(examType);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Não deixe para depois, ${firstName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 36px 30px; text-align: center;">
              <h1 style="margin: 0 0 8px; color: #ffffff; font-size: 26px; font-weight: 700;">
                ${firstName}, o edital não espera
              </h1>
              <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 15px;">
                Cada dia sem estudar é um ponto a menos na prova
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 30px;">

              <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.6;">
                ${firstName}, faz 3 semanas que você se cadastrou no Passarei. Os editais de concursos policiais 2026 estão sendo publicados e <strong>o tempo é seu recurso mais valioso</strong>.
              </p>

              <!-- Urgência -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fef2f2; border-left: 4px solid #dc2626; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px; font-size: 15px; color: #991b1b; font-weight: 700;">Concursos policiais previstos para 2026:</p>
                    <p style="margin: 0; font-size: 14px; color: #7f1d1d; line-height: 1.8;">
                      PRF, PF, DEPEN, PM-DF, PC-BA, PM-PE, PC-PE, PM-SP e dezenas de outros estados. Mais de 50.000 vagas previstas.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Conta simples -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0f9ff; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 15px; color: #0369a1;">Se você começar hoje com 10 questões/dia:</p>
                    <p style="margin: 0 0 4px; font-size: 28px; color: #0c4a6e; font-weight: 700;">300 questões/mês</p>
                    <p style="margin: 0 0 4px; font-size: 28px; color: #0c4a6e; font-weight: 700;">1.800 questões em 6 meses</p>
                    <p style="margin: 0; font-size: 14px; color: #0369a1;">Quem resolve 1.500+ questões tem <strong>3x mais chance</strong> de aprovação</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Final -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #18cb96 0%, #0ea5e9 100%); border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 28px; text-align: center;">
                    <p style="margin: 0 0 4px; font-size: 14px; color: rgba(255,255,255,0.9);">Plano Veterano - melhor valor</p>
                    <p style="margin: 0 0 16px; font-size: 36px; color: #ffffff; font-weight: 700;">R$ 44,90<span style="font-size: 16px; font-weight: 400;">/mês</span></p>
                    <a href="https://passarei.com.br/#planos" target="_blank" style="display: inline-block; background-color: #ffffff; color: #18cb96; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 18px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                      Começar Agora
                    </a>
                    <p style="margin: 12px 0 0; font-size: 13px; color: rgba(255,255,255,0.8);">30 questões/dia + revisão espaçada + lembretes</p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 14px; color: #6b7280; text-align: center; line-height: 1.6;">
                Ou continue testando grátis: <a href="https://t.me/PassareiBot" style="color: #3b82f6; text-decoration: none; font-weight: 600;">abrir Telegram</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; font-size: 16px; color: #111827; font-weight: 600;">
                Você vai passar!
              </p>
              <p style="margin: 0 0 12px; font-size: 13px; color: #6b7280;">
                Equipe Passarei | suporte@passarei.com.br
              </p>
              <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                &copy; ${new Date().getFullYear()} Passarei. Todos os direitos reservados.
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

// ============================================
// SUBJECTS DOS EMAILS
// ============================================
export const DRIP_EMAIL_SUBJECTS = {
  welcome: "Suas 21 questões grátis estão esperando",
  educational: "As 5 matérias que mais reprovam em concursos policiais",
  socialProof: "Eles estudaram 10 questões por dia e passaram",
  lastChance: "O edital não espera. Comece hoje.",
};
