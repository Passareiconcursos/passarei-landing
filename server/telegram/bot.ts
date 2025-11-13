import TelegramBot from 'node-telegram-bot-api';
import { getRandomContent, createOrGetUser, checkUserLimit, incrementUserCount } from './database';
import { startOnboarding, handleOnboardingCallback, handleOnboardingMessage, onboardingStates } from './onboarding';

const token = process.env.TELEGRAM_BOT_TOKEN || '';
let bot: TelegramBot | null = null;

export async function startTelegramBot() {
  if (!token) return console.error('❌ Token');
  console.log('🤖 Iniciando...');
  bot = new TelegramBot(token, { polling: true });

  bot.on('callback_query', async (query) => {
    await handleOnboardingCallback(bot!, query);
  });

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const name = msg.from?.first_name || 'Usuário';
    const telegramId = String(msg.from?.id);
    await createOrGetUser(telegramId, name);
    await startOnboarding(bot!, chatId, telegramId, name);
  });

  bot.onText(/\/conteudo/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = String(msg.from?.id);
    const canAccess = await checkUserLimit(telegramId);
    if (!canAccess) return bot?.sendMessage(chatId, `⚠️ Limite!\n💎 /premium`);
    await bot?.sendMessage(chatId, '📚 Buscando...');
    const content = await getRandomContent();
    if (!content) return bot?.sendMessage(chatId, '❌ Erro');
    await incrementUserCount(telegramId);
    await bot?.sendMessage(chatId, `📚 *${content.title}*\n\n${content.definition}`, { parse_mode: 'Markdown' });
  });

  bot.on('message', async (msg) => {
    const telegramId = String(msg.from?.id);
    
    if (onboardingStates.has(telegramId)) {
      await handleOnboardingMessage(bot!, msg);
      return;
    }
    
    if (msg.text?.startsWith('/')) return;
    
    const text = msg.text?.toLowerCase() || '';
    if (['oi', 'olá', 'ola'].includes(text)) {
      const chatId = msg.chat.id;
      const name = msg.from?.first_name || 'Usuário';
      await createOrGetUser(telegramId, name);
      await startOnboarding(bot!, chatId, telegramId, name);
    }
  });

  console.log('✅ Pronto!\n');
}

export { bot };
