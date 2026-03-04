export function resetPasswordHtml(name: string, code: string): string {
  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#f4f4f8;font-family:sans-serif">
    <div style="max-width:480px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
      <div style="background:#1a1a2e;padding:24px;text-align:center">
        <p style="color:#ffffff;font-size:20px;font-weight:bold;margin:0">Passarei Concursos</p>
      </div>
      <div style="padding:32px 24px">
        <h2 style="color:#1a1a2e;margin:0 0 8px">🔐 Recuperação de Senha</h2>
        <p style="color:#444;margin:0 0 24px">Olá, <strong>${name}</strong>!</p>
        <p style="color:#444;margin:0 0 24px">Recebemos uma solicitação para redefinir a senha da sua conta na <strong>Passarei Concursos</strong>.</p>
        <div style="background:#f4f4f8;border-radius:8px;padding:24px;text-align:center;margin:0 0 24px">
          <p style="margin:0 0 8px;font-size:13px;color:#888">Seu código de verificação:</p>
          <p style="font-size:40px;font-weight:bold;letter-spacing:10px;color:#1a1a2e;margin:0 0 8px;font-family:monospace">${code}</p>
          <p style="margin:0;font-size:12px;color:#aaa">⏰ Válido por <strong>15 minutos</strong></p>
        </div>
        <p style="color:#666;font-size:14px;margin:0 0 24px">Se você não solicitou a redefinição de senha, ignore este e-mail. Sua senha permanece a mesma.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:0 0 24px">
        <p style="color:#aaa;font-size:12px;margin:0;text-align:center">
          Passarei Concursos &bull; <a href="mailto:suporte@passarei.com.br" style="color:#aaa">suporte@passarei.com.br</a>
        </p>
      </div>
    </div>
  </body>
  </html>`;
}
