import TelegramBot from 'node-telegram-bot-api';
import { getRandomContent, createOrGetUser, checkUserLimit, incrementUserCount } from './database';

const token = process.env.TELEGRAM_BOT_TOKEN || '';
let bot: TelegramBot | null = null;

export async function startTelegramBot() {
  if (!token) return console.error('❌ Token não configurado');
  console.log('🤖 Iniciando Telegram Bot...');
  bot = new TelegramBot(token, { polling: true });

  bot.on('message', async (msg) => {
    const telegramId = String(msg.from?.id);
    console.log(`🆔 TELEGRAM ID DO USUÁRIO: ${telegramId}`);
    
    if (!msg.text?.startsWith('/')) {
      const text = msg.text?.toLowerCase() || '';
      if (['oi', 'olá', 'ola', 'hi'].includes(text)) {
        await bot?.sendMessage(msg.chat.id, `👋 Seu Telegram ID é: *${telegramId}*\n\nDigite /ajuda`, { parse_mode: 'Markdown' });
      }
      return;
    }
  });

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const name = msg.from?.first_name || 'Usuário';
    const telegramId = String(msg.from?.id);
    console.log(`🆔 TELEGRAM ID: ${telegramId}`);
    await createOrGetUser(telegramId, name);
    await bot?.sendMessage(chatId, `👋 *${name}*!\n\n📚 /conteudo\n💎 /premium`, { parse_mode: 'Markdown' });
  });

  console.log('✅ Bot pronto!\n');
}

export { bot };
