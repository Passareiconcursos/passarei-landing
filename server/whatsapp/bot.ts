import makeWASocket, { DisconnectReason, useMultiFileAuthState, WASocket } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import P from 'pino';
import qrcode from 'qrcode-terminal';

let sock: WASocket | null = null;
let isConnecting = false;

export async function startWhatsAppBot() {
  if (isConnecting) {
    console.log('⏳ Já está tentando conectar...');
    return;
  }

  isConnecting = true;

  try {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    sock = makeWASocket({
      auth: state,
      logger: P({ level: 'silent' }),
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update: any) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('\n📱 ESCANEIE O QR CODE COM SEU WHATSAPP:\n');
        qrcode.generate(qr, { small: true });
        console.log('\n');
      }

      if (connection === 'close') {
        isConnecting = false;
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        
        console.log(`❌ WhatsApp desconectado. Código: ${statusCode}`);
        
        if (shouldReconnect) {
          console.log('🔄 Reconectando em 10 segundos...');
          setTimeout(() => startWhatsAppBot(), 10000);
        } else {
          console.log('🚫 Deslogado. Delete a pasta auth_info_baileys e reinicie para reconectar.');
        }
      } else if (connection === 'open') {
        isConnecting = false;
        console.log('✅ WhatsApp Bot conectado com sucesso!');
      }
    });

    sock.ev.on('messages.upsert', async ({ messages }: any) => {
      const msg = messages[0];
      if (!msg.message || msg.key.fromMe) return;

      const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
      const from = msg.key.remoteJid;

      console.log(`📩 Mensagem de ${from}: ${text}`);

      await handleMessage(from, text);
    });

  } catch (error) {
    isConnecting = false;
    console.error('❌ Erro ao iniciar bot:', error);
  }
}

async function handleMessage(from: string, text: string) {
  const command = text.toLowerCase().trim();

  if (command === '/start' || command === 'oi' || command === 'olá' || command === 'ola') {
    await sendMessage(from, `👋 Olá! Bem-vindo ao *Passarei Bot*!

Sou seu assistente de estudos para concursos policiais! 🎯

*Comandos disponíveis:*
📚 /conteudo - Receber material de estudo
❓ /questoes - Praticar questões
📊 /progresso - Ver seu progresso
🎯 /concurso - Escolher seu concurso
ℹ️ /ajuda - Ver todos os comandos

Digite um comando para começar! 🚀`);
  }

  else if (command === '/conteudo') {
    await sendMessage(from, '📚 Buscando conteúdo para você...');
    const conteudo = getExampleContent();
    await sendMessage(from, conteudo);
  }

  else if (command === '/questoes') {
    await sendMessage(from, '❓ *QUESTÃO DO DIA*\n\n(Em breve! Estamos preparando questões incríveis para você) 🎓');
  }

  else if (command === '/progresso') {
    await sendMessage(from, '📊 *SEU PROGRESSO*\n\n✅ Conteúdos estudados: 0\n📝 Questões respondidas: 0\n🎯 Taxa de acerto: 0%\n\n(Comece a estudar para ver suas estatísticas!)');
  }

  else if (command === '/concurso') {
    await sendMessage(from, `🎯 *ESCOLHA SEU CONCURSO*

Responda com o número do seu concurso:

1️⃣ PF - Polícia Federal
2️⃣ PRF - Polícia Rodoviária Federal
3️⃣ PM - Polícia Militar
4️⃣ PC - Polícia Civil
5️⃣ CBM - Corpo de Bombeiros
6️⃣ PP - Polícia Penal
7️⃣ PL - Polícia Legislativa
8️⃣ GM - Guarda Municipal

(Em breve você poderá configurar!)`);
  }

  else if (command === '/ajuda') {
    await sendMessage(from, `📖 *COMANDOS DISPONÍVEIS*

📚 /conteudo - Receber material de estudo
❓ /questoes - Praticar questões
📊 /progresso - Ver suas estatísticas
🎯 /concurso - Escolher seu concurso
ℹ️ /ajuda - Esta mensagem

💡 *Dica:* Configure seu concurso para receber conteúdo personalizado!

_Bot em desenvolvimento - Mais recursos em breve!_ 🚀`);
  }

  else {
    await sendMessage(from, '❓ Comando não reconhecido.\n\nDigite /ajuda para ver os comandos disponíveis.');
  }
}

async function sendMessage(to: string, text: string) {
  if (!sock) {
    console.error('❌ Bot não conectado');
    return;
  }

  try {
    await sock.sendMessage(to, { text });
    console.log(`✅ Mensagem enviada`);
  } catch (error) {
    console.error('❌ Erro ao enviar:', error);
  }
}

function getExampleContent() {
  return `📚 *TEORIA DO CRIME - CONCEITO ANALÍTICO*

📖 *Definição:*
Crime é fato típico, ilícito e culpável segundo a teoria analítica adotada pelo Código Penal brasileiro.

✅ *Pontos-Chave:*
- Fato típico: conduta + resultado + nexo causal
- Ilicitude: contrariedade ao ordenamento jurídico
- Culpabilidade: reprovabilidade da conduta

💡 *Exemplo PF:*
Agente prende traficante internacional. Crime configurado: fato típico (art. 33), ilícito (sem excludente) e culpável.

🎯 *Dica de Prova:*
CEBRASPE adora confundir teoria bipartida com tripartida. O STF adota a TRIPARTIDA!

⭐ _Conteúdo gerado por IA - Passarei_`;
}

export { sock, sendMessage };
