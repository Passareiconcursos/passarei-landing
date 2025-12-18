import TelegramBot from "node-telegram-bot-api";
import { generateEnhancedContent, generateExplanation } from "./ai-service";
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
  try {
    let result;

    // Buscar conteúdo que ainda não foi usado nesta sessão
    if (session.usedContentIds.length > 0) {
      result = await db.execute(sql`
        SELECT * FROM "Content"
        WHERE "isActive" = true
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
        WHERE "isActive" = true
        ORDER BY RANDOM()
        LIMIT 1
      `);
    }

    if (result.length > 0) {
      console.log(`✅ Conteúdo encontrado: ${result[0].title}`);
      return result[0];
    }

    // Fallback: qualquer conteúdo
    console.log(`⚠️ Buscando qualquer conteúdo...`);
    const fallback = await db.execute(sql`
      SELECT * FROM "Content" ORDER BY RANDOM() LIMIT 1
    `);

    if (fallback.length > 0) {
      console.log(`✅ Fallback encontrado: ${fallback[0].title}`);
      return fallback[0];
    }

    console.log(`❌ Nenhum conteúdo no banco`);
    return null;
  } catch (error) {
    console.error(`❌ Erro ao buscar conteúdo:`, error);
    return null;
  }
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
  const definition =
    content.textContent ||
    content.definition ||
    content.description ||
    "Definição não disponível";

  // Gerar conteúdo enriquecido com IA
  await bot.sendMessage(session.chatId, `⏳ _Preparando conteúdo personalizado..._`, { parse_mode: "Markdown" });
  const enhanced = await generateEnhancedContent(title, definition, session.examType);
  const keyPoints = enhanced.keyPoints;
  const example = enhanced.example;
  const tip = enhanced.tip;

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
  const def =
    content.textContent || content.definition || content.description || "";
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
    const keyboard = {
      inline_keyboard: [
        [{ text: "💰 R$ 5 (5 questões)", callback_data: "pay_credits_5" }],
        [{ text: "💰 R$ 10 (10 questões)", callback_data: "pay_credits_10" }],
        [{ text: "💰 R$ 20 (20 questões)", callback_data: "pay_credits_20" }],
        [{ text: "🔙 Voltar", callback_data: "back_to_menu" }],
      ],
    };
    await bot.sendMessage(
      chatId,
      `💳 *COMPRAR CRÉDITOS*\n\nEscolha o pacote:\n\n• R$ 5,00 = 5 questões\n• R$ 10,00 = 10 questões\n• R$ 20,00 = 20 questões\n\n_Pagamento via PIX ou Cartão_`,
      { parse_mode: "Markdown", reply_markup: keyboard },
    );
    return true;
  }
  if (data.startsWith("pay_credits_")) {
    await bot.answerCallbackQuery(query.id);
    const amount = data.replace("pay_credits_", "");
    const packageId = `credits_${amount}`;
    const appUrl = process.env.APP_URL || "https://passarei.com.br";
    await bot.sendMessage(
      chatId,
      `✅ *Clique no link para pagar R$ ${amount},00:*\n\n🔗 ${appUrl}/checkout?pkg=${packageId}\&user=${telegramId}\n\n_Após o pagamento, seus créditos serão adicionados automaticamente._`,
      { parse_mode: "Markdown" },
    );
    return true;
  }
  if (data === "buy_veterano") {
    await bot.answerCallbackQuery(query.id);
    const appUrl = process.env.APP_URL || "https://passarei.com.br";
    await bot.sendMessage(
      chatId,
      `⭐ *PLANO VETERANO*\n\nR$ 49,90/mês\n\n✅ 300 questões personalizadas/mês\n✅ 2 correções de redação/mês com IA\n✅ Todas as apostilas inclusas\n✅ Revisão inteligente SM2\n\n🔗 Clique para assinar:\n${appUrl}/checkout?pkg=veterano\&user=${telegramId}\n\n_62% mais barato que a concorrência!_`,
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
    if (result.length > 0) {
      const user = result[0] as any;
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
      // Gerar explicação com IA
      const explanation = await generateExplanation(
        session.currentContent.title,
        session.currentContent.textContent || "",
        session.currentQuestion.options[answerIdx],
        session.currentQuestion.correctAnswer,
        true
      );
      await bot.sendMessage(session.chatId, `💡 ${explanation.explanation}`, { parse_mode: "Markdown" });
    } else {
      session.wrongAnswers++;
      const fb =
        FEEDBACK_WRONG[Math.floor(Math.random() * FEEDBACK_WRONG.length)];
      await bot.sendMessage(
        session.chatId,
        `❌ *${fb.title}*\n\n${fb.msg}\n\n✅ Correta: ${session.currentQuestion.correctAnswer}`,
        { parse_mode: "Markdown" },
      );
      // Gerar explicação com IA
      const explanation = await generateExplanation(
        session.currentContent.title,
        session.currentContent.textContent || "",
        session.currentQuestion.options[answerIdx],
        session.currentQuestion.correctAnswer,
        false
      );
      await bot.sendMessage(session.chatId, `📚 ${explanation.explanation}`, { parse_mode: "Markdown" });
    }

    await new Promise((r) => setTimeout(r, 2000));

    const keyboard = {
      inline_keyboard: [
        [{ text: "✅ Próxima questão", callback_data: "next_question" }],
      ],
    };

    await bot.sendMessage(session.chatId, "Pronto para a próxima questão?", {
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
