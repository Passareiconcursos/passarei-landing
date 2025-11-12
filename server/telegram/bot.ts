import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN || '';
let bot: TelegramBot | null = null;

export async function startTelegramBot() {
  if (!token) {
    console.error('❌ TELEGRAM_BOT_TOKEN não configurado no .env');
    return;
  }

  try {
    console.log('🤖 Iniciando Telegram Bot...');
    bot = new TelegramBot(token, { polling: true });

    bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const name = msg.from?.first_name || 'Usuário';
      await bot?.sendMessage(chatId, `👋 Olá *${name}*! Bem-vindo ao Passarei Bot!`, { parse_mode: 'Markdown' });
    });

    bot.onText(/\/conteudo/, async (msg) => {
      const chatId = msg.chat.id;
      await bot?.sendMessage(chatId, '📚 Aqui está seu conteúdo!', { parse_mode: 'Markdown' });
    });

    console.log('✅ Telegram Bot iniciado!');
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

export { bot };
