import makeWASocket, { 
  DisconnectReason, 
  useMultiFileAuthState, 
  WASocket,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  WAMessage
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import P from 'pino';
import qrcode from 'qrcode-terminal';

let sock: WASocket | null = null;
let qrAttempts = 0;
const MAX_QR_ATTEMPTS = 3;

export async function startWhatsAppBot() {
  try {
    console.log('🤖 Iniciando WhatsApp Bot...');
    
    const { state, saveCreds } = await useMultiFileAuthState('./auth_whatsapp');
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
      version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' })),
      },
      logger: P({ level: 'error' }), // Apenas erros
      printQRInTerminal: false,
      browser: ['Passarei Bot', 'Chrome', '10.0'],
      syncFullHistory: false,
      markOnlineOnConnect: true,
      getMessage: async () => undefined,
    });

    // IMPORTANTE: Salvar credenciais
    sock.ev.on('creds.update', saveCreds);

    // LISTENER DE CONEXÃO
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        qrAttempts++;
        if (qrAttempts <= MAX_QR_ATTEMPTS) {
          console.log('\n📱 ESCANEIE O QR CODE:\n');
          qrcode.generate(qr, { small: true });
          console.log(`\n⏳ Tentativa ${qrAttempts}/${MAX_QR_ATTEMPTS}\n`);
        }
      }

      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        console.log(`❌ Conexão fechada. Status: ${statusCode}`);

        if (shouldReconnect && qrAttempts < MAX_QR_ATTEMPTS) {
          console.log('🔄 Reconectando em 5 segundos...');
          setTimeout(() => startWhatsAppBot(), 5000);
        }
      } else if (connection === 'open') {
        qrAttempts = 0;
        console.log('✅ WhatsApp Bot ONLINE!');
        console.log('📱 Aguardando mensagens...\n');
      }
    });

    // LISTENER DE MENSAGENS - CORRIGIDO
    sock.ev.on('messages.upsert', async (m) => {
      console.log('🔔 Evento messages.upsert recebido!');
      console.log('📦 Dados:', JSON.stringify(m, null, 2));

      const msg = m.messages[0];
      if (!msg.message) {
        console.log('⚠️ Mensagem sem conteúdo');
        return;
      }

      if (msg.key.fromMe) {
        console.log('⚠️ Mensagem enviada por mim, ignorando');
        return;
      }

      const messageText = 
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        '';

      const from = msg.key.remoteJid!;
      const name = msg.pushName || 'Usuário';

      console.log(`\n📩 MENSAGEM RECEBIDA!`);
      console.log(`👤 De: ${name}`);
      console.log(`📱 Número: ${from}`);
      console.log(`💬 Texto: "${messageText}"\n`);

      await handleMessage(from, messageText, name);
    });

    console.log('✅ Listeners configurados!');
    return sock;

  } catch (error) {
    console.error('❌ Erro ao iniciar bot:', error);
    throw error;
  }
}

async function handleMessage(from: string, text: string, name: string) {
  console.log(`🔄 Processando comando: "${text}"`);
  
  const command = text.toLowerCase().trim();

  try {
    if (command === '/start' || command === 'oi' || command === 'olá' || command === 'ola' || command === 'hi') {
      console.log('✅ Comando reconhecido: Boas-vindas');
      await sendMessage(from, `👋 Olá *${name}*! Bem-vindo ao *Passarei Bot*!

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
      console.log('✅ Comando reconhecido: Conteúdo');
      await sendMessage(from, '📚 Buscando conteúdo para você...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      const conteudo = getExampleContent();
      await sendMessage(from, conteudo);
    }

    else if (command === '/questoes') {
      console.log('✅ Comando reconhecido: Questões');
      await sendMessage(from, '❓ *QUESTÃO DO DIA*\n\n_Em breve! Estamos preparando questões incríveis_ 🎓');
    }

    else if (command === '/progresso') {
      console.log('✅ Comando reconhecido: Progresso');
      await sendMessage(from, `📊 *SEU PROGRESSO*\n\n✅ Conteúdos: 0\n📝 Questões: 0\n🎯 Acerto: 0%`);
    }

    else if (command === '/ajuda' || command === '/help') {
      console.log('✅ Comando reconhecido: Ajuda');
      await sendMessage(from, `📖 *COMANDOS*\n\n📚 /conteudo\n❓ /questoes\n📊 /progresso\n🎯 /concurso\nℹ️ /ajuda`);
    }

    else {
      console.log('⚠️ Comando não reconhecido');
      await sendMessage(from, '❓ Não entendi. Digite */ajuda* para ver os comandos.');
    }
  } catch (error) {
    console.error('❌ Erro ao processar mensagem:', error);
  }
}

async function sendMessage(to: string, text: string) {
  if (!sock) {
    console.error('❌ Bot não conectado');
    return false;
  }

  try {
    console.log(`📤 Enviando mensagem para ${to}...`);
    await sock.sendMessage(to, { text });
    console.log('✅ Mensagem enviada com sucesso!\n');
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar:', error);
    return false;
  }
}

function getExampleContent() {
  return `📚 *TEORIA DO CRIME*

📖 Crime é fato típico, ilícito e culpável.

✅ *Pontos-Chave:*
- Fato típico
- Ilicitude
- Culpabilidade

💡 *Exemplo PF:*
Tráfico internacional - Art. 33

🎯 *Dica:*
STF adota teoria TRIPARTIDA!

⭐ _Passarei Bot_`;
}

export { sock, sendMessage };
