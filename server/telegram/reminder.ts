import TelegramBot from "node-telegram-bot-api";
import {
  getUsersForReminder,
  hasReminderToday,
  recordReminderSent,
  SCHEDULE_HOURS,
  checkQuestionAccess,
  consumeQuestion,
  getQuestionForSubject,
  saveStudyProgress,
} from "./database";
import { generateEnhancedContent, generateExplanation } from "./ai-service";
import { db } from "../../db";
import { sql } from "drizzle-orm";

// Intervalo do scheduler: verificar a cada 30 minutos
const CHECK_INTERVAL_MS = 30 * 60 * 1000;

// Controle para evitar envios duplicados em memória (além da dedup no banco)
const lastCheckHour = new Map<string, number>();

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
  console.log(`⏰ [Reminder] Verificação a cada ${CHECK_INTERVAL_MS / 60000} minutos`);
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

    console.log(`\n⏰ [Reminder] Verificando lembretes para ${currentHour}h (Brasília)...`);

    // Buscar usuários elegíveis
    const users = await getUsersForReminder(currentHour);

    if (users.length === 0) {
      console.log(`⏰ [Reminder] Nenhum usuário elegível para ${currentHour}h`);
      return;
    }

    console.log(`📬 [Reminder] ${users.length} usuários para receber lembrete`);

    // Enviar lembretes com intervalo entre cada um (evitar rate limit do Telegram)
    for (const user of users) {
      try {
        // Verificar deduplicação no banco
        const alreadySent = await hasReminderToday(user.telegramId, currentHour);
        if (alreadySent) {
          console.log(`⏭️ [Reminder] Já enviado para ${user.telegramId} hoje neste turno`);
          continue;
        }

        // Verificar acesso (limite diário)
        const access = await checkQuestionAccess(user.telegramId);
        if (!access.canAccess) {
          console.log(`🚫 [Reminder] ${user.telegramId} sem acesso: ${access.reason}`);
          continue;
        }

        // Enviar conteúdo proativo
        await sendProactiveContent(bot, user, access.reason, currentHour);

        // Registrar lembrete enviado
        await recordReminderSent(user.telegramId, currentHour);

        // Delay entre usuários para evitar rate limit (1 segundo)
        await new Promise((r) => setTimeout(r, 1000));
      } catch (userError) {
        console.error(`❌ [Reminder] Erro para ${user.telegramId}:`, userError);
      }
    }

    console.log(`✅ [Reminder] Ciclo de lembretes ${currentHour}h concluído`);
  } catch (error) {
    console.error("❌ [Reminder] Erro no scheduler:", error);
  }
}

/**
 * Envia conteúdo proativo para o aluno (continua de onde parou)
 */
async function sendProactiveContent(
  bot: TelegramBot,
  user: any,
  accessReason: string,
  currentHour: number,
) {
  const chatId = parseInt(user.telegramId);
  const turno = currentHour <= 11 ? "Manhã" : currentHour <= 17 ? "Tarde" : "Noite";

  try {
    // 1. Mensagem de lembrete
    const greetings: Record<string, string> = {
      "Manhã": "Bom dia",
      "Tarde": "Boa tarde",
      "Noite": "Boa noite",
    };

    await bot.sendMessage(
      chatId,
      `${greetings[turno]}! Hora de estudar para o *${user.examType || "concurso"}*\n\n` +
        `${accessReason === "free_first_day" ? "🎁 Usando questão grátis!" : ""}\n` +
        `📚 Preparando seu conteúdo...`,
      { parse_mode: "Markdown" },
    );

    await new Promise((r) => setTimeout(r, 2000));

    // 2. Buscar conteúdo inteligente (continuando de onde parou)
    const content = await getSmartReminderContent(user);

    if (!content) {
      await bot.sendMessage(
        chatId,
        `⚠️ Conteúdo em preparação. Use /estudar para iniciar uma sessão!`,
        { parse_mode: "Markdown" },
      );
      return;
    }

    // 3. Consumir questão (debitar)
    await consumeQuestion(user.telegramId, accessReason as any);

    // 4. Enviar conteúdo
    const title = content.title || "Conteúdo";
    const definition = content.textContent || content.definition || content.description || "";

    // Buscar nome do subject
    let subjectName = "Conteúdo";
    if (content.subjectId) {
      try {
        const subjectResult = await db.execute(sql`
          SELECT "displayName" FROM "Subject" WHERE id = ${content.subjectId}
        `) as any[];
        subjectName = subjectResult[0]?.displayName || "Conteúdo";
      } catch (e) {
        // ignore
      }
    }

    // Gerar conteúdo enriquecido com IA
    const enhanced = await generateEnhancedContent(title, definition, user.examType || "PF");

    await bot.sendMessage(
      chatId,
      `📚 *${subjectName.toUpperCase()}*\n\n` +
        `🎯 *${title}*\n\n` +
        `📖 ${definition}\n\n` +
        `✅ *Pontos-chave:*\n${enhanced.keyPoints}\n\n` +
        `💡 *Exemplo:* ${enhanced.example}\n\n` +
        `🎯 *Dica:* ${enhanced.tip}`,
      { parse_mode: "Markdown" },
    );

    await new Promise((r) => setTimeout(r, 3000));

    // 5. Enviar questão
    const realQuestion = content.subjectId
      ? await getQuestionForSubject(content.subjectId, [])
      : null;

    if (realQuestion) {
      const alternatives = realQuestion.alternatives as { letter: string; text: string }[];
      const isCertoErrado = realQuestion.questionType === "CERTO_ERRADO";

      const optionsText = alternatives
        .map((alt: { letter: string; text: string }) => `${alt.letter}) ${alt.text}`)
        .join("\n\n");

      const keyboard = {
        inline_keyboard: [
          ...alternatives.map(
            (alt: { letter: string; text: string }, idx: number) => [
              {
                text: isCertoErrado ? alt.text : `Questão ${alt.letter}`,
                callback_data: `reminder_answer_${content.id}_${realQuestion.id}_${idx}`,
              },
            ]
          ),
          [{ text: "📚 Continuar estudando", callback_data: "menu_estudar" }],
        ],
      };

      const diffEmoji = realQuestion.difficulty === "FACIL" ? "🟢" : realQuestion.difficulty === "MEDIO" ? "🟡" : "🔴";

      await bot.sendMessage(
        chatId,
        `✍️ *QUESTÃO ${diffEmoji}*\n\n` +
          `❓ ${realQuestion.statement}\n\n` +
          `───────────────\n` +
          `${optionsText}\n` +
          `───────────────\n\n` +
          `👇 *Escolha sua resposta:*`,
        {
          parse_mode: "Markdown",
          reply_markup: keyboard,
        },
      );
    } else {
      // Sem questão - oferecer continuar estudando
      const keyboard = {
        inline_keyboard: [
          [{ text: "📚 Iniciar sessão de estudos", callback_data: "menu_estudar" }],
        ],
      };

      await bot.sendMessage(
        chatId,
        `💪 Revise o conteúdo acima e quando estiver pronto, inicie uma sessão completa!`,
        { parse_mode: "Markdown", reply_markup: keyboard },
      );
    }

    // 6. Salvar progresso (adicionar este contentId aos já vistos)
    const updatedContentIds = [...(user.lastStudyContentIds || []), content.id];
    // Manter no máximo 200 IDs (evitar crescimento infinito)
    const trimmedIds = updatedContentIds.slice(-200);
    await saveStudyProgress(user.telegramId, trimmedIds);

    console.log(`✅ [Reminder] Conteúdo enviado para ${user.telegramId}: ${title}`);
  } catch (error: any) {
    // Se o bot foi bloqueado pelo usuário (403), desativar lembretes
    if (error?.response?.statusCode === 403) {
      console.log(`🚫 [Reminder] Bot bloqueado por ${user.telegramId}, desativando lembretes`);
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
 * Busca conteúdo inteligente para o lembrete
 * Continua de onde o aluno parou (evita conteúdos já vistos)
 * Prioriza: dificuldades (70%) > facilidades (30%)
 */
async function getSmartReminderContent(user: any): Promise<any | null> {
  try {
    const usedIds = user.lastStudyContentIds || [];
    const usedIdsClause = usedIds.length > 0
      ? sql`AND c."id" NOT IN (${sql.join(usedIds.map((id: string) => sql`${id}`), sql`, `)})`
      : sql``;

    // 1. Priorizar matérias de dificuldade (70% das vezes)
    const shouldPrioritizeDifficulty = Math.random() < 0.7;

    if (shouldPrioritizeDifficulty && user.dificuldades && user.dificuldades.length > 0) {
      const result = await db.execute(sql`
        SELECT c.* FROM "Content" c
        JOIN "Subject" s ON c."subjectId" = s.id
        WHERE s."displayName" IN (${sql.join(user.dificuldades.map((d: string) => sql`${d}`), sql`, `)})
          AND c."isActive" = true
          ${usedIdsClause}
        ORDER BY RANDOM()
        LIMIT 1
      `) as any[];

      if (result.length > 0) return result[0];
    }

    // 2. Tentar facilidades
    if (user.facilidades && user.facilidades.length > 0) {
      const result = await db.execute(sql`
        SELECT c.* FROM "Content" c
        JOIN "Subject" s ON c."subjectId" = s.id
        WHERE s."displayName" IN (${sql.join(user.facilidades.map((f: string) => sql`${f}`), sql`, `)})
          AND c."isActive" = true
          ${usedIdsClause}
        ORDER BY RANDOM()
        LIMIT 1
      `) as any[];

      if (result.length > 0) return result[0];
    }

    // 3. Fallback: qualquer conteúdo do examType ou geral
    const result = await db.execute(sql`
      SELECT * FROM "Content"
      WHERE "isActive" = true
        ${usedIdsClause}
      ORDER BY RANDOM()
      LIMIT 1
    `) as any[];

    if (result.length > 0) return result[0];

    // 4. Se todos já foram vistos, resetar e pegar qualquer um
    const fallback = await db.execute(sql`
      SELECT * FROM "Content"
      WHERE "isActive" = true
      ORDER BY RANDOM()
      LIMIT 1
    `) as any[];

    return fallback[0] || null;
  } catch (error) {
    console.error("❌ [Reminder] Erro ao buscar conteúdo:", error);
    return null;
  }
}

/**
 * Handler para respostas de questões enviadas via lembrete
 * callback_data: reminder_answer_{contentId}_{questionId}_{answerIdx}
 */
export async function handleReminderAnswer(
  bot: TelegramBot,
  query: any,
): Promise<boolean> {
  const data = query.data;
  if (!data?.startsWith("reminder_answer_")) return false;

  const chatId = query.message?.chat.id;
  const telegramId = String(query.from.id);

  await bot.answerCallbackQuery(query.id);

  try {
    // Parse: reminder_answer_{contentId}_{questionId}_{answerIdx}
    const parts = data.replace("reminder_answer_", "").split("_");
    const answerIdx = parseInt(parts[parts.length - 1]);
    const questionId = parts[parts.length - 2];
    // contentId pode ter underscores, juntar tudo menos os últimos 2
    const contentId = parts.slice(0, parts.length - 2).join("_");

    // Buscar questão do banco
    const questionResult = await db.execute(sql`
      SELECT * FROM "Question" WHERE "id" = ${questionId}
    `) as any[];

    if (questionResult.length === 0) {
      await bot.sendMessage(chatId, "⚠️ Questão não encontrada. Use /estudar para continuar!", {
        parse_mode: "Markdown",
      });
      return true;
    }

    const question = questionResult[0];
    const alternatives = question.alternatives as { letter: string; text: string }[];
    const correctLetter = question.correctAnswer as string;
    const correctIdx = alternatives.findIndex(
      (alt: { letter: string; text: string }) => alt.letter === correctLetter
    );
    const isCorrect = answerIdx === correctIdx;

    // Delay
    await new Promise((r) => setTimeout(r, 1000));

    if (isCorrect) {
      await bot.sendMessage(
        chatId,
        `✅ *PARABÉNS!* Resposta correta!\n\n💡 ${question.explanation || "Continue assim!"}`,
        { parse_mode: "Markdown" },
      );
    } else {
      const correctText = alternatives[correctIdx]?.text || correctLetter;
      await bot.sendMessage(
        chatId,
        `❌ *Não foi dessa vez!*\n\n` +
          `✅ Correta: ${correctLetter}) ${correctText}\n\n` +
          `📚 ${question.explanation || "Revise o conteúdo e tente novamente!"}`,
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
      const userData = await db.execute(sql`
        SELECT id FROM "User" WHERE "telegramId" = ${telegramId} LIMIT 1
      `) as any[];

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
