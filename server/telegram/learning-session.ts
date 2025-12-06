import TelegramBot from "node-telegram-bot-api";
import { db } from "../../db";
import { sql } from "drizzle-orm";
import {
  checkQuestionAccess,
  consumeQuestion,
  QuestionAccessResult,
} from "./database";

interface LearningSession {
  userId: string;
  chatId: number;
  currentStep:
    | "content"
    | "exercise"
    | "waiting_answer"
    | "waiting_doubt"
    | "explaining_doubt"
    | "blocked";
  currentContent: any;
  currentQuestion: any;
  contentsSent: number;
  correctAnswers: number;
  wrongAnswers: number;
  usedContentIds: string[];
  difficulties: string[];
  facilities: string[];
  examType: string;
  startTime: Date;
  lastAccessType?: QuestionAccessResult["reason"];
}

const activeSessions = new Map<string, LearningSession>();

const FEEDBACK_CORRECT = [
  { title: "EXCELENTE!", msg: "Sua resposta está correta!" },
  { title: "PARABÉNS!", msg: "Acertou! Continue assim!" },
  { title: "MUITO BEM!", msg: "Resposta correta!" },
  { title: "PERFEITO!", msg: "Isso mesmo!" },
  { title: "MANDOU BEM!", msg: "Correto!" },
];

const FEEDBACK_WRONG = [
  { title: "NÃO FOI DESSA VEZ!", msg: "Mas não desanime!" },
  { title: "VAMOS LÁ!", msg: "Não acertou, vou explicar:" },
  { title: "QUASE LÁ!", msg: "Resposta incorreta, entenda:" },
  { title: "FOCO TOTAL!", msg: "Errou, veja a explicação:" },
];

export async function startLearningSession(
  bot: TelegramBot,
  chatId: number,
  telegramId: string,
  examType: string,
  dificuldades: string[],
  facilidades: string[] = [],
) {
  console.log("🎓 Iniciando sessão");

  const session: LearningSession = {
    userId: telegramId,
    chatId: chatId,
    currentStep: "content",
    currentContent: null,
    currentQuestion: null,
    contentsSent: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    usedContentIds: [],
    difficulties: dificuldades,
    facilities: facilidades,
    examType: examType,
    startTime: new Date(),
  };

  activeSessions.set(telegramId, session);
  await new Promise((r) => setTimeout(r, 2000));
  await sendNextContent(bot, session);
}

async function getSmartContent(session: LearningSession) {
  let result;

  if (session.usedContentIds.length > 0) {
    result = await db.execute(sql`
      SELECT * FROM "Content"
      WHERE "examType" = ${session.examType}
        AND "id" NOT IN (${sql.join(
          session.usedContentIds.map((id) => sql`${id}`),
          sql`, `,
        )})
      ORDER BY RANDOM()
      LIMIT 1
    `);
  } else {
    result = await db.execute(sql`
      SELECT * FROM "Content"
      WHERE "examType" = ${session.examType}
      ORDER BY RANDOM()
      LIMIT 1
    `);
  }

  if (result.rows.length > 0) return result.rows[0];

  const fallback = await db.execute(sql`
    SELECT * FROM "Content" ORDER BY RANDOM() LIMIT 1
  `);
  return fallback.rows[0] || null;
}

async function sendNextContent(bot: TelegramBot, session: LearningSession) {
  const access = await checkQuestionAccess(session.userId);

  if (!access.canAccess) {
    session.currentStep = "blocked";
    const keyboard = {
      inline_keyboard: [
        [{ text: "💳 Comprar Créditos", callback_data: "buy_credits" }],
        [{ text: "⭐ Plano Veterano R$ 49,90", callback_data: "buy_veterano" }],
        [{ text: "📊 Ver meu saldo", callback_data: "check_balance" }],
      ],
    };
    await bot.sendMessage(
      session.chatId,
      access.message || "Créditos insuficientes",
      {
        parse_mode: "Markdown",
        reply_markup: keyboard,
      },
    );
    return;
  }

  session.lastAccessType = access.reason;

  if (access.reason === "free_first_day") {
    await bot.sendMessage(
      session.chatId,
      `🎁 *QUESTÃO GRÁTIS!* _${access.freeRemaining} restantes_`,
      { parse_mode: "Markdown" },
    );
    await new Promise((r) => setTimeout(r, 1000));
  }

  const content = await getSmartContent(session);

  if (!content) {
    await bot.sendMessage(
      session.chatId,
      `⚠️ Conteúdo em preparação para ${session.examType}. Volte em breve!`,
      { parse_mode: "Markdown" },
    );
    activeSessions.delete(session.userId);
    return;
  }

  await consumeQuestion(session.userId, access.reason);

  session.currentContent = content;
  session.usedContentIds.push(content.id);
  session.contentsSent++;

  const title = content.title || "Conteúdo";
  const definition = content.definition || content.description || "Definição";
  const keyPoints = content.keyPoints || "• Ponto 1\n• Ponto 2";
  const example = content.example || "Exemplo prático";
  const tip = content.tip || "Dica de prova";

  await bot.sendMessage(
    session.chatId,
    `📚 *CONTEÚDO ${session.contentsSent}*\n\n🎯 *${title}*\n\n📖 ${definition}\n\n✅ *Pontos-chave:*\n${keyPoints}\n\n💡 *Exemplo:* ${example}\n\n🎯 *Dica:* ${tip}`,
    { parse_mode: "Markdown" },
  );

  await new Promise((r) => setTimeout(r, 3000));

  const question = generateMultipleChoice(content);
  session.currentQuestion = question;

  const keyboard = {
    inline_keyboard: question.options.map((opt: string, idx: number) => [
      {
        text: `${String.fromCharCode(65 + idx)}) ${opt.substring(0, 45)}...`,
        callback_data: `answer_${idx}`,
      },
    ]),
  };

  await bot.sendMessage(
    session.chatId,
    `✍️ *EXERCÍCIO*\n\n❓ ${question.question}`,
    {
      parse_mode: "Markdown",
      reply_markup: keyboard,
    },
  );

  session.currentStep = "waiting_answer";
}

function generateMultipleChoice(content: any) {
  const title = content.title || "Conceito";
  const def = content.definition || content.description || "";
  let correctAnswer = def.length > 80 ? def.substring(0, 77) + "..." : def;

  const wrongAnswers = [
    `${title} refere-se exclusivamente a crimes dolosos`,
    `${title} só se aplica com violência ou grave ameaça`,
    `${title} é conceito do direito civil apenas`,
  ];

  const options = [correctAnswer, ...wrongAnswers].sort(
    () => Math.random() - 0.5,
  );

  return {
    question: `Sobre ${title}, assinale a CORRETA:`,
    options,
    correctAnswer,
    correctIndex: options.indexOf(correctAnswer),
  };
}

export async function handleLearningCallback(
  bot: TelegramBot,
  query: any,
): Promise<boolean> {
  const telegramId = String(query.from.id);
  const session = activeSessions.get(telegramId);
  const data = query.data;
  const chatId = query.message?.chat.id;

  if (data === "buy_credits") {
    await bot.answerCallbackQuery(query.id);
    await bot.sendMessage(
      chatId,
      `💳 *COMPRAR CRÉDITOS*\n\n• R$ 5 = 5 questões\n• R$ 10 = 10 questões\n• R$ 20 = 20 questões\n\n🔜 Em breve via PIX!`,
      { parse_mode: "Markdown" },
    );
    return true;
  }

  if (data === "buy_veterano") {
    await bot.answerCallbackQuery(query.id);
    await bot.sendMessage(
      chatId,
      `⭐ *PLANO VETERANO*\n\nR$ 49,90/mês\n✅ 10 questões/dia\n✅ 2 redações grátis\n✅ Todas apostilas\n\n🔜 Em breve!`,
      { parse_mode: "Markdown" },
    );
    return true;
  }

  if (data === "check_balance") {
    await bot.answerCallbackQuery(query.id);
    const result = await db.execute(sql`
      SELECT "credits", "plan", "dailyContentCount", "totalQuestionsAnswered"
      FROM "User" WHERE "telegramId" = ${telegramId}
    `);
    if (result.rows.length > 0) {
      const user = result.rows[0] as any;
      await bot.sendMessage(
        chatId,
        `💰 *SALDO*\n\n💳 R$ ${(parseFloat(user.credits) || 0).toFixed(2)}\n📦 ${user.plan || "FREE"}\n📊 Hoje: ${user.dailyContentCount || 0}\n🎯 Total: ${user.totalQuestionsAnswered || 0}`,
        { parse_mode: "Markdown" },
      );
    }
    return true;
  }

  if (!session) return false;

  if (data.startsWith("answer_") && session.currentStep === "waiting_answer") {
    const answerIdx = parseInt(data.replace("answer_", ""));
    const isCorrect = answerIdx === session.currentQuestion.correctIndex;

    await bot.answerCallbackQuery(query.id);

    if (isCorrect) {
      session.correctAnswers++;
      const fb =
        FEEDBACK_CORRECT[Math.floor(Math.random() * FEEDBACK_CORRECT.length)];
      await bot.sendMessage(session.chatId, `✅ *${fb.title}*\n\n${fb.msg}`, {
        parse_mode: "Markdown",
      });
    } else {
      session.wrongAnswers++;
      const fb =
        FEEDBACK_WRONG[Math.floor(Math.random() * FEEDBACK_WRONG.length)];
      await bot.sendMessage(
        session.chatId,
        `❌ *${fb.title}*\n\n${fb.msg}\n\n✅ Correta: ${session.currentQuestion.correctAnswer}`,
        { parse_mode: "Markdown" },
      );
    }

    await new Promise((r) => setTimeout(r, 2000));

    const keyboard = {
      inline_keyboard: [
        [{ text: "✅ Próxima questão", callback_data: "next_question" }],
        [{ text: "⏸️ Parar por hoje", callback_data: "stop_session" }],
      ],
    };

    await bot.sendMessage(session.chatId, "O que deseja fazer?", {
      reply_markup: keyboard,
    });
    session.currentStep = "waiting_doubt";
    return true;
  }

  if (data === "next_question") {
    await bot.answerCallbackQuery(query.id);
    await sendNextContent(bot, session);
    return true;
  }

  if (data === "stop_session") {
    await bot.answerCallbackQuery(query.id);
    const total = session.correctAnswers + session.wrongAnswers;
    const pct =
      total > 0 ? Math.round((session.correctAnswers / total) * 100) : 0;
    await bot.sendMessage(
      session.chatId,
      `📊 *RELATÓRIO*\n\n📚 ${session.contentsSent} questões\n✅ ${session.correctAnswers} acertos\n❌ ${session.wrongAnswers} erros\n📈 ${pct}%\n\nVolte amanhã! 🚀`,
      { parse_mode: "Markdown" },
    );
    activeSessions.delete(telegramId);
    return true;
  }

  return false;
}

export { activeSessions };
