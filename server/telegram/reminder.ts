import TelegramBot from "node-telegram-bot-api";
import {
  getUsersForReminder,
  hasReminderToday,
  recordReminderSent,
  getDailyReminderCount,
  SCHEDULE_HOURS,
  checkQuestionAccess,
} from "./database";
import { activeSessions } from "./learning-session";
import { db } from "../../db";
import { sql } from "drizzle-orm";

// Intervalo do scheduler: verificar a cada 30 minutos
const CHECK_INTERVAL_MS = 30 * 60 * 1000;

// Tempo mínimo de inatividade para enviar lembrete (60 minutos)
const ACTIVITY_THRESHOLD_MS = 60 * 60 * 1000;

// Máximo de lembretes de estudo por dia por aluno
const MAX_DAILY_REMINDERS = 2;

// Armazena questão pendente por telegramId para callback curto
const pendingReminderQuestions = new Map<
  string,
  {
    questionId: string;
    contentId: string;
    alternatives: { letter: string; text: string }[];
    correctAnswer: string;
  }
>();

/**
 * Obtém hora atual em Brasília (America/Sao_Paulo)
 */
function getBrasiliaHour(): number {
  const now = new Date();
  const brasiliaTime = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "numeric",
    hour12: false,
  }).format(now);
  return parseInt(brasiliaTime);
}

/**
 * Inicia o scheduler de lembretes de estudo
 * Verifica a cada 30 minutos se há usuários para receber lembrete
 */
export function startReminderScheduler(bot: TelegramBot) {
  console.log("⏰ [Reminder] Scheduler de lembretes iniciado");
  console.log(
    `⏰ [Reminder] Verificação a cada ${CHECK_INTERVAL_MS / 60000} minutos`,
  );
  console.log(`⏰ [Reminder] Horários configurados:`, SCHEDULE_HOURS);

  // Verificar imediatamente no startup
  setTimeout(() => checkAndSendReminders(bot), 5000);

  // Verificar a cada 30 minutos
  setInterval(() => checkAndSendReminders(bot), CHECK_INTERVAL_MS);
}

/**
 * Verifica se é hora de enviar lembretes e envia
 */
async function checkAndSendReminders(bot: TelegramBot) {
  try {
    const currentHour = getBrasiliaHour();

    // Verificar se é um horário de envio (6, 12 ou 18)
    const isReminderHour = [6, 12, 18].includes(currentHour);

    if (!isReminderHour) {
      return;
    }

    console.log(
      `\n⏰ [Reminder] Verificando lembretes para ${currentHour}h (Brasília)...`,
    );

    // Buscar usuários elegíveis
    const users = await getUsersForReminder(currentHour);

    if (users.length === 0) {
      console.log(
        `⏰ [Reminder] Nenhum usuário elegível para ${currentHour}h`,
      );
      return;
    }

    console.log(
      `📬 [Reminder] ${users.length} usuários para receber lembrete`,
    );

    // Enviar lembretes com intervalo entre cada um (evitar rate limit do Telegram)
    for (const user of users) {
      try {
        // Verificar cap diário: máximo de 2 lembretes por dia
        const dailyCount = await getDailyReminderCount(user.telegramId);
        if (dailyCount >= MAX_DAILY_REMINDERS) {
          console.log(
            `🔕 [Reminder] ${user.telegramId} já recebeu ${dailyCount} lembretes hoje, silenciando`,
          );
          continue;
        }

        // Verificar deduplicação no banco (por turno)
        const alreadySent = await hasReminderToday(
          user.telegramId,
          currentHour,
        );
        if (alreadySent) {
          console.log(
            `⏭️ [Reminder] Já enviado para ${user.telegramId} hoje neste turno`,
          );
          continue;
        }

        // Verificar se o usuário está ativo recentemente (últimos 60 min)
        const isRecentlyActive = await checkRecentActivity(user.telegramId);
        if (isRecentlyActive) {
          console.log(
            `⏭️ [Reminder] ${user.telegramId} ativo recentemente, pulando lembrete`,
          );
          continue;
        }

        // Verificar acesso (limite diário)
        const access = await checkQuestionAccess(user.telegramId);
        if (!access.canAccess) {
          console.log(
            `🚫 [Reminder] ${user.telegramId} sem acesso: ${access.reason}`,
          );
          continue;
        }

        // Registrar lembrete ANTES de enviar (previne duplicação por race condition)
        await recordReminderSent(user.telegramId, currentHour);

        // Enviar conteúdo proativo
        await sendProactiveContent(bot, user, access.reason, currentHour);

        // Delay entre usuários para evitar rate limit (1 segundo)
        await new Promise((r) => setTimeout(r, 1000));
      } catch (userError) {
        console.error(
          `❌ [Reminder] Erro para ${user.telegramId}:`,
          userError,
        );
      }
    }

    console.log(
      `✅ [Reminder] Ciclo de lembretes ${currentHour}h concluído`,
    );
  } catch (error) {
    console.error("❌ [Reminder] Erro no scheduler:", error);
  }
}

/**
 * FIX 0.5: Verifica se o usuário interagiu nos últimos 15 minutos
 */
async function checkRecentActivity(telegramId: string): Promise<boolean> {
  try {
    // Verificar sessão de estudo ativa em memória
    if (activeSessions.has(telegramId)) {
      return true;
    }

    // Verificar last_active_at no banco
    const result = (await db.execute(sql`
      SELECT last_active_at
      FROM "User"
      WHERE "telegramId" = ${telegramId}
      LIMIT 1
    `)) as any[];

    if (result.length === 0 || !result[0].last_active_at) return false;

    const lastActive = new Date(result[0].last_active_at);
    const now = new Date();
    const diffMs = now.getTime() - lastActive.getTime();

    return diffMs < ACTIVITY_THRESHOLD_MS;
  } catch (error) {
    console.error("❌ [Reminder] Erro ao verificar atividade:", error);
    return false; // Na dúvida, enviar o lembrete
  }
}

/**
 * Envia push minimalista de lembrete (sem conteúdo longo).
 * O conteúdo real é entregue quando o aluno clica em "Continuar Estudando".
 */
async function sendProactiveContent(
  bot: TelegramBot,
  user: any,
  _accessReason: string,
  currentHour: number,
) {
  const chatId = parseInt(user.telegramId);

  try {
    // Saudação dinâmica pelo horário (Brasília)
    const greeting =
      currentHour < 12 ? "Bom dia" :
      currentHour < 18 ? "Boa tarde" :
                         "Boa noite";

    // Primeiro nome (fallback para "estudante")
    const firstName = (user.name || "").split(" ")[0] || "estudante";

    const appUrl = process.env.APP_URL || "https://passarei.com.br";

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: "📖 Continuar Estudando",
            callback_data: "menu_estudar",
          },
        ],
        [
          {
            text: "💻 Ir para o Site",
            url: `${appUrl}/sala`,
          },
        ],
      ],
    };

    await bot.sendMessage(
      chatId,
      `${greeting}, ${firstName}\\! 🚀\n\n` +
        `Chegou a hora dos seus estudos planejados\\. ` +
        `Seu sonho não descansa\\!\n\n` +
        `Clique abaixo para continuar de onde parou ou acesse o site\\.`,
      { parse_mode: "MarkdownV2", reply_markup: keyboard },
    );

    console.log(`✅ [Reminder] Push enviado para ${user.telegramId} (${firstName})`);
  } catch (error: any) {
    // Se o bot foi bloqueado pelo usuário (403), desativar lembretes
    if (error?.response?.statusCode === 403) {
      console.log(
        `🚫 [Reminder] Bot bloqueado por ${user.telegramId}, desativando lembretes`,
      );
      await db.execute(sql`
        UPDATE "User"
        SET "reminderEnabled" = false, "updatedAt" = NOW()
        WHERE "telegramId" = ${user.telegramId}
      `);
      return;
    }
    throw error;
  }
}

/**
 * Handler para respostas de questões enviadas via lembrete
 * FIX 0.7: callback_data curto: "rem_0", "rem_1", etc.
 */
export async function handleReminderAnswer(
  bot: TelegramBot,
  query: any,
): Promise<boolean> {
  const data = query.data;
  if (!data?.startsWith("rem_")) return false;

  const chatId = query.message?.chat.id;
  const telegramId = String(query.from.id);

  await bot.answerCallbackQuery(query.id);

  try {
    // Parse callback: "rem_0", "rem_1", etc.
    const answerIdx = parseInt(data.replace("rem_", ""));

    // Buscar questão pendente do Map
    const pending = pendingReminderQuestions.get(telegramId);

    if (!pending) {
      await bot.sendMessage(
        chatId,
        "⚠️ Questão expirada. Use /estudar para continuar!",
        { parse_mode: "Markdown" },
      );
      return true;
    }

    const { questionId, contentId, alternatives, correctAnswer } = pending;

    // Limpar do Map
    pendingReminderQuestions.delete(telegramId);

    // Determinar resposta correta
    const correctIdx = alternatives.findIndex(
      (alt) => alt.letter === correctAnswer,
    );
    const isCorrect = answerIdx === correctIdx;

    // Delay
    await new Promise((r) => setTimeout(r, 1000));

    // Buscar explicação da questão
    const questionResult = (await db.execute(sql`
      SELECT explanation FROM "Question" WHERE "id" = ${questionId}
    `)) as any[];
    const explanation = questionResult[0]?.explanation || "";

    if (isCorrect) {
      await bot.sendMessage(
        chatId,
        `✅ *PARABÉNS!* Resposta correta!\n\n💡 ${explanation || "Continue assim!"}`,
        { parse_mode: "Markdown" },
      );
    } else {
      const correctText = alternatives[correctIdx]?.text || correctAnswer;
      const correctLetter = alternatives[correctIdx]?.letter || correctAnswer;
      await bot.sendMessage(
        chatId,
        `❌ *Não foi dessa vez!*\n\n` +
          `✅ Correta: ${correctLetter}) ${correctText}\n\n` +
          `📚 ${explanation || "Revise o conteúdo e tente novamente!"}`,
        { parse_mode: "Markdown" },
      );
    }

    // Registrar resposta
    try {
      const { recordQuestionAttempt } = await import("./database");
      await recordQuestionAttempt(
        telegramId,
        questionId,
        alternatives[answerIdx]?.text || String(answerIdx),
        isCorrect,
        "LEMBRETE_ESTUDO",
      );
    } catch (e) {
      console.error("❌ [Reminder] Erro ao registrar attempt:", e);
    }

    // Salvar resposta na user_answers
    try {
      const userData = (await db.execute(sql`
        SELECT id FROM "User" WHERE "telegramId" = ${telegramId} LIMIT 1
      `)) as any[];

      if (userData.length > 0) {
        await db.execute(sql`
          INSERT INTO "user_answers" ("userId", "contentId", "selectedAnswer", "correct", "answeredAt")
          VALUES (${userData[0].id}, ${contentId}, ${answerIdx}, ${isCorrect}, NOW())
        `);
      }
    } catch (e) {
      console.error("❌ [Reminder] Erro ao salvar resposta:", e);
    }

    // Oferecer continuar
    const keyboard = {
      inline_keyboard: [
        [{ text: "📚 Continuar estudando", callback_data: "menu_estudar" }],
      ],
    };

    await bot.sendMessage(
      chatId,
      "Quer continuar estudando? Clique abaixo!",
      { reply_markup: keyboard },
    );

    return true;
  } catch (error) {
    console.error("❌ [Reminder] Erro ao processar resposta:", error);
    return true;
  }
}
