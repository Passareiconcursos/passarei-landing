import TelegramBot from 'node-telegram-bot-api';
import { getRandomContent, createOrGetUser, checkUserLimit, incrementUserCount } from './database';

const token = process.env.TELEGRAM_BOT_TOKEN || '';
let bot: TelegramBot | null = null;

export async function startTelegramBot() {
  if (!token) return console.error('❌ Token não configurado');
  console.log('🤖 Iniciando Telegram Bot...');
  bot = new TelegramBot(token, { polling: true });

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const name = msg.from?.first_name || 'Usuário';
    const telegramId = String(msg.from?.id || chatId);
    await createOrGetUser(telegramId, name);
    await bot?.sendMessage(chatId, `👋 *${name}*, bem-vindo ao Passarei!

📚 /conteudo - Material do dia
🎯 /concurso - Escolher concurso
📊 /progresso - Estatísticas
💎 /premium - Ver planos
ℹ️ /ajuda - Comandos`, { parse_mode: 'Markdown' });
  });

  bot.onText(/\/conteudo/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = String(msg.from?.id || chatId);
    const canAccess = await checkUserLimit(telegramId);
    
    if (!canAccess) {
      return bot?.sendMessage(chatId, 
        `⚠️ *Limite diário atingido!*\n\n` +
        `Plano GRATUITO: 3 conteúdos/dia\n\n` +
        `💎 Faça upgrade e tenha acesso ilimitado!\n\n` +
        `/premium - Ver planos`,
        { parse_mode: 'Markdown' }
      );
    }
    
    await bot?.sendMessage(chatId, '📚 Buscando...');
    const contentItem = await getRandomContent();
    if (!contentItem) return bot?.sendMessage(chatId, '❌ Erro ao buscar conteúdo');
    
    await incrementUserCount(telegramId);
    
    const message = `📚 *${contentItem.title}*

📖 ${contentItem.definition}

✅ *Pontos-Chave:*
${contentItem.keyPoints}

💡 *Exemplo:*
${contentItem.example}

🎯 *Dica:*
${contentItem.tip}`;

    await bot?.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  });

  bot.onText(/\/premium/, async (msg) => {
    const keyboard = {
      inline_keyboard: [
        [{ text: '💎 MENSAL - R$ 12,90/mês', callback_data: 'plan_monthly' }],
        [{ text: '🔥 ANUAL - 12x R$ 9,90 (R$ 118,80)', callback_data: 'plan_yearly' }]
      ]
    };

    await bot?.sendMessage(msg.chat.id, 
      `💎 *PLANOS PASSAREI*\n\n` +
      `*PLANO MENSAL*\n` +
      `💰 R$ 12,90/mês\n` +
      `✅ Conteúdos ilimitados\n` +
      `✅ Questões ilimitadas\n` +
      `✅ Envio diário automático\n` +
      `✅ Suporte prioritário\n\n` +
      `*PLANO ANUAL* 🔥\n` +
      `💰 12x R$ 9,90 (R$ 118,80 à vista)\n` +
      `✅ Todos os benefícios acima\n` +
      `✅ Economize R$ 35,88/ano\n` +
      `✅ Melhor custo-benefício!\n\n` +
      `Escolha seu plano:`,
      { 
        parse_mode: 'Markdown',
        reply_markup: keyboard 
      }
    );
  });

  bot.on('callback_query', async (query) => {
    const chatId = query.message?.chat.id;
    const data = query.data;

    if (!chatId) return;

    if (data === 'plan_monthly') {
      await bot?.answerCallbackQuery(query.id, { text: '💎 Plano Mensal selecionado!' });
      await bot?.sendMessage(chatId, 
        `💎 *PLANO MENSAL*\n\n` +
        `💰 R$ 12,90/mês\n\n` +
        `Em breve você receberá o link de pagamento!\n\n` +
        `Aguarde... 🚀`,
        { parse_mode: 'Markdown' }
      );
    } else if (data === 'plan_yearly') {
      await bot?.answerCallbackQuery(query.id, { text: '🔥 Plano Anual selecionado!' });
      await bot?.sendMessage(chatId, 
        `🔥 *PLANO ANUAL*\n\n` +
        `💰 12x R$ 9,90 (R$ 118,80 à vista)\n` +
        `💚 Economize R$ 35,88/ano!\n\n` +
        `Em breve você receberá o link de pagamento!\n\n` +
        `Aguarde... 🚀`,
        { parse_mode: 'Markdown' }
      );
    }
  });

  bot.onText(/\/ajuda/, async (msg) => {
    await bot?.sendMessage(msg.chat.id, 
      `📖 *COMANDOS DISPONÍVEIS*\n\n` +
      `📚 /conteudo - Receber material\n` +
      `🎯 /concurso - Escolher concurso\n` +
      `📊 /progresso - Ver estatísticas\n` +
      `💎 /premium - Ver planos\n` +
      `ℹ️ /ajuda - Esta mensagem`,
      { parse_mode: 'Markdown' }
    );
  });

  bot.on('message', async (msg) => {
    if (msg.text?.startsWith('/')) return;
    const text = msg.text?.toLowerCase() || '';
    if (['oi', 'olá', 'ola', 'hi'].includes(text)) {
      await bot?.sendMessage(msg.chat.id, '👋 Digite /ajuda para ver os comandos');
    }
  });

  console.log('✅ Bot pronto!\n');
}

export { bot };
