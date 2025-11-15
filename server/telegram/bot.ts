import TelegramBot from 'node-telegram-bot-api';
import { getRandomContent, createOrGetUser, checkUserLimit, incrementUserCount } from './database';
import { startOnboarding, handleOnboardingCallback, handleOnboardingMessage, onboardingStates } from './onboarding';
import { handleLearningCallback } from './learning-session';

const token = process.env.TELEGRAM_BOT_TOKEN || '';
let bot: TelegramBot | null = null;

export async function startTelegramBot() {
  if (!token) return console.error('❌ Token');
  console.log('🤖 Iniciando...');
  bot = new TelegramBot(token, { polling: true });

  bot.on('callback_query', async (query) => {
    const isLearning = await handleLearningCallback(bot!, query);
    if (isLearning) return;
    
    await handleOnboardingCallback(bot!, query);
  });

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const name = msg.from?.first_name || 'Usuário';
    const telegramId = String(msg.from?.id);
    await createOrGetUser(telegramId, name);
    await startOnboarding(bot!, chatId, telegramId, name);
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
