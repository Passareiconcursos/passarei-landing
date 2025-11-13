import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function startOnboarding(bot: any, chatId: number, telegramId: string, name: string) {
  await bot.sendMessage(chatId, `👋 Olá *${name}*!

Seja bem-vindo ao *Passarei* - sua plataforma de estudos para concursos policiais! 🚀

Vamos configurar sua experiência em apenas 3 passos:`, { parse_mode: 'Markdown' });

  await new Promise(r => setTimeout(r, 1000));

  // PASSO 1: Escolher concurso
  const keyboard1 = {
    inline_keyboard: [
      [{ text: '🎯 PF', callback_data: 'onb_PF' }, { text: '🚓 PRF', callback_data: 'onb_PRF' }],
      [{ text: '🚔 PM', callback_data: 'onb_PM' }, { text: '🕵️ PC', callback_data: 'onb_PC' }],
      [{ text: '🚒 CBM', callback_data: 'onb_CBM' }, { text: '⚖️ PP', callback_data: 'onb_PP' }]
    ]
  };

  await bot.sendMessage(chatId, 
    `*PASSO 1/3* 🎯\n\nQual concurso você está estudando?`,
    { parse_mode: 'Markdown', reply_markup: keyboard1 }
  );
}

export async function saveUserPreference(telegramId: string, field: string, value: string) {
  await db.update(users)
    .set({ [field]: value })
    .where(eq(users.username, telegramId));
}
