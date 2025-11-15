import TelegramBot from "node-telegram-bot-api";
import { db } from "../../db";
import { sql } from "drizzle-orm";
import { getRandomContent } from "./database";

interface LearningSession {
  userId: string;
  chatId: number;
  currentStep:
    | "content"
    | "exercise"
    | "waiting_answer"
    | "waiting_doubt"
    | "explaining_doubt";
  currentContent: any;
  currentQuestion: any;
  contentsSent: number;
  correctAnswers: number;
  wrongAnswers: number;
  usedContentIds: string[];
  difficulties: string[];
  startTime: Date;
}

const activeSessions = new Map<string, LearningSession>();

const FEEDBACK_CORRECT = [
  {
    title: "EXCELENTE!",
    msg: "Sua resposta está correta! Você demonstrou total compreensão do conceito.",
  },
  {
    title: "PARABÉNS!",
    msg: "Acertou! Continue assim que a aprovação está cada vez mais próxima!",
  },
  {
    title: "MUITO BEM!",
    msg: "Resposta correta! Você está no caminho certo para a aprovação!",
  },
  {
    title: "PERFEITO!",
    msg: "Isso mesmo! Sua dedicação está rendendo frutos!",
  },
  { title: "MANDOU BEM!", msg: "Correto! Você está dominando esse conteúdo!" },
];

const FEEDBACK_WRONG = [
  {
    title: "NÃO FOI DESSA VEZ!",
    msg: "Mas não desanime! O erro é parte do aprendizado.",
  },
  {
    title: "VAMOS LÁ!",
    msg: "Não acertou, mas está no caminho! Vou te explicar:",
  },
  {
    title: "QUASE LÁ!",
    msg: "Resposta incorreta, mas você está evoluindo! Entenda o porquê:",
  },
  {
    title: "FOCO TOTAL!",
    msg: "Errou, mas agora vai acertar sempre! Veja a explicação:",
  },
  {
    title: "CONTINUAR TENTANDO!",
    msg: "Incorreto, mas cada erro te aproxima do sucesso! Vamos lá:",
  },
];

const FIXATION_TIPS = [
  "📝 *Dica de Fixação*\n\nAnote essa questão no seu caderno. Ler, compreender e escrever ajuda o cérebro a memorizar!",
  "🗣️ *Dica de Fixação*\n\nExplique esse conteúdo em voz alta para alguém. Ensinar é a melhor forma de aprender!",
  "✍️ *Dica de Fixação*\n\nFaça um resumo de 3 linhas sobre o que acabou de aprender. Síntese é conhecimento!",
  "🧠 *Dica de Fixação*\n\nFeche os olhos e visualize uma situação real usando esse conceito. Associação facilita memorização!",
  "📖 *Dica de Fixação*\n\nReleia os pontos-chave e tente memorizá-los. Revisão espaçada é a chave do sucesso!",
  "💡 *Dica de Fixação*\n\nCrie um mnemônico ou acrônimo com as iniciais dos pontos principais. Técnicas de memorização funcionam!",
  "🎯 *Dica de Fixação*\n\nAssista a um vídeo curto sobre o tema. Múltiplos canais de aprendizado reforçam a memória!",
];

export async function startLearningSession(
  bot: TelegramBot,
  chatId: number,
  telegramId: string,
  examType: string,
  dificuldades: string[],
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
    startTime: new Date(),
  };

  activeSessions.set(telegramId, session);

  await new Promise((r) => setTimeout(r, 15000));

  await sendNextContent(bot, session, examType);
}

async function sendNextContent(
  bot: TelegramBot,
  session: LearningSession,
  examType: string,
) {
  let content = await getRandomContent(examType);

  if (!content || session.usedContentIds.includes(content.id)) {
    const content2 = await getRandomContent(examType);
    if (!content2 || session.usedContentIds.includes(content2.id)) {
      await bot.sendMessage(
        session.chatId,
        "✅ Parabéns! Você estudou todo conteúdo disponível por hoje! 🎉",
      );
      activeSessions.delete(session.userId);
      return;
    }
    content = content2;
  }

  session.currentContent = content;
  session.usedContentIds.push(content.id);
  session.contentsSent++;

  const message = `📚 *CONTEÚDO ${session.contentsSent}*

━━━━━━━━━━━━━━━━

🎯 *${content.title}*

━━━━━━━━━━━━━━━━

📖 *O QUE É?*

${content.definition}

━━━━━━━━━━━━━━━━

✅ *PONTOS-CHAVE*

${content.keyPoints}

━━━━━━━━━━━━━━━━

💡 *EXEMPLO PRÁTICO*

${content.example}

━━━━━━━━━━━━━━━━

🎯 *DICA DE PROVA*

${content.tip}

━━━━━━━━━━━━━━━━`;

  await bot.sendMessage(session.chatId, message, { parse_mode: "Markdown" });
  await new Promise((r) => setTimeout(r, 3000));

  const question = generateMultipleChoice(content);
  session.currentQuestion = question;

  const keyboard = {
    inline_keyboard: question.options.map((opt: string, idx: number) => [
      { text: opt, callback_data: `answer_${idx}` },
    ]),
  };

  const exercise = `✍️ *EXERCÍCIO DE FIXAÇÃO*

━━━━━━━━━━━━━━━━

❓ ${question.question}

━━━━━━━━━━━━━━━━

Selecione a alternativa correta:`;

  await bot.sendMessage(session.chatId, exercise, {
    parse_mode: "Markdown",
    reply_markup: keyboard,
  });

  session.currentStep = "waiting_answer";
}

// ✅ FUNÇÃO CORRIGIDA - ALTERNATIVAS CURTAS
function generateMultipleChoice(content: any) {
  const title = content.title;
  const firstSentence = content.definition.split('.')[0];
  
  // Criar resposta correta curta (máx 60 chars)
  let correctAnswer = `${title}`;
  if (firstSentence.length < 40) {
    correctAnswer = `${title}: ${firstSentence}`;
  }
  if (correctAnswer.length > 60) {
    correctAnswer = correctAnswer.substring(0, 57) + '...';
  }

  // Alternativas erradas CURTAS
  const wrongAnswers = [
    'Não relevante para concursos',
    'Conceito desatualizado',
    'Apenas direito privado',
    'Não consta no edital'
  ];

  const allOptions = [correctAnswer, ...wrongAnswers.slice(0, 3)];
  const shuffled = allOptions.sort(() => Math.random() - 0.5);

  return {
    question: `O que é ${title}?`,
    options: shuffled,
    correctAnswer: correctAnswer,
    correctIndex: shuffled.indexOf(correctAnswer),
  };
}

export async function handleLearningCallback(bot: TelegramBot, query: any) {
  const telegramId = String(query.from.id);
  const session = activeSessions.get(telegramId);
  const data = query.data;

  if (!session) return false;

  if (data.startsWith("answer_") && session.currentStep === "waiting_answer") {
    const answerIdx = parseInt(data.replace("answer_", ""));
    const isCorrect = answerIdx === session.currentQuestion.correctIndex;

    await bot.answerCallbackQuery(query.id);
    await bot.sendMessage(session.chatId, "🤔 Analisando sua resposta...");
    await new Promise((r) => setTimeout(r, 2000));

    if (isCorrect) {
      session.correctAnswers++;
      const feedback =
        FEEDBACK_CORRECT[Math.floor(Math.random() * FEEDBACK_CORRECT.length)];

      const message = `✅ *${feedback.title}*

━━━━━━━━━━━━━━━━

${feedback.msg}

💡 *Por que está correto?*

${session.currentContent.tip}

━━━━━━━━━━━━━━━━

✨ Lembre-se sempre disso para acertar questões similares!`;

      await bot.sendMessage(session.chatId, message, {
        parse_mode: "Markdown",
      });
    } else {
      session.wrongAnswers++;
      const feedback =
        FEEDBACK_WRONG[Math.floor(Math.random() * FEEDBACK_WRONG.length)];

      const message = `❌ *${feedback.title}*

━━━━━━━━━━━━━━━━

${feedback.msg}

✅ *A resposta correta é:*

${session.currentQuestion.correctAnswer}

💡 *Explicação:*

${session.currentContent.definition}

━━━━━━━━━━━━━━━━

📚 Releia os pontos-chave e você vai dominar isso!`;

      await bot.sendMessage(session.chatId, message, {
        parse_mode: "Markdown",
      });
    }

    await new Promise((r) => setTimeout(r, 2000));

    const tip = FIXATION_TIPS[Math.floor(Math.random() * FIXATION_TIPS.length)];
    await bot.sendMessage(session.chatId, tip, { parse_mode: "Markdown" });

    await new Promise((r) => setTimeout(r, 2000));

    const doubtKeyboard = {
      inline_keyboard: [
        [{ text: "✅ Entendi! Próxima questão", callback_data: "doubt_no" }],
        [{ text: "❓ Ainda tenho dúvidas", callback_data: "doubt_yes" }],
      ],
    };

    await bot.sendMessage(
      session.chatId,
      "❓ *Ficou alguma dúvida sobre esse conteúdo?*",
      { parse_mode: "Markdown", reply_markup: doubtKeyboard },
    );

    session.currentStep = "waiting_doubt";
    return true;
  }

  if (data === "doubt_no" && session.currentStep === "waiting_doubt") {
    await bot.answerCallbackQuery(query.id, { text: "🚀 Próximo conteúdo!" });
    await sendNextContent(bot, session, session.currentContent.examType);
    return true;
  }

  if (data === "doubt_yes" && session.currentStep === "waiting_doubt") {
    await bot.answerCallbackQuery(query.id);

    const simplified = `💡 *EXPLICAÇÃO SIMPLIFICADA*

━━━━━━━━━━━━━━━━

Vou explicar de forma mais simples:

🎯 *${session.currentContent.title}*

Imagine que: ${session.currentContent.example}

Em outras palavras: ${session.currentContent.definition.split(".")[0]}.

━━━━━━━━━━━━━━━━

📝 *Para fixar melhor:*

${session.currentContent.keyPoints.split("•").filter((p: string) => p.trim())[0]}

━━━━━━━━━━━━━━━━`;

    await bot.sendMessage(session.chatId, simplified, {
      parse_mode: "Markdown",
    });
    await new Promise((r) => setTimeout(r, 3000));

    const newQuestion = generateMultipleChoice(session.currentContent);
    session.currentQuestion = newQuestion;

    const keyboard = {
      inline_keyboard: newQuestion.options.map((opt: string, idx: number) => [
        { text: opt, callback_data: `answer2_${idx}` },
      ]),
    };

    await bot.sendMessage(
      session.chatId,
      `✍️ *NOVA QUESTÃO PARA FIXAR*

━━━━━━━━━━━━━━━━

❓ ${newQuestion.question}

Selecione a alternativa correta:`,
      { parse_mode: "Markdown", reply_markup: keyboard },
    );

    session.currentStep = "explaining_doubt";
    return true;
  }

  if (
    data.startsWith("answer2_") &&
    session.currentStep === "explaining_doubt"
  ) {
    const answerIdx = parseInt(data.replace("answer2_", ""));
    const isCorrect = answerIdx === session.currentQuestion.correctIndex;

    await bot.answerCallbackQuery(query.id);

    if (isCorrect) {
      await bot.sendMessage(
        session.chatId,
        `🎉 *PERFEITO!*

Agora você dominou o conceito! 💪

Vamos para o próximo conteúdo!`,
        { parse_mode: "Markdown" },
      );
    } else {
      await bot.sendMessage(
        session.chatId,
        `💡 *QUASE LÁ!*

A resposta correta é:

${session.currentQuestion.correctAnswer}

Não se preocupe, vamos revisar isso no futuro! 📚`,
        { parse_mode: "Markdown" },
      );
    }

    await new Promise((r) => setTimeout(r, 3000));
    await sendNextContent(bot, session, session.currentContent.examType);
    return true;
  }

  return false;
}

export { activeSessions };
