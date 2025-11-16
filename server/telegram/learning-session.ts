import TelegramBot from "node-telegram-bot-api";
import { db } from "../../db";
import { sql } from "drizzle-orm";

interface LearningSession {
  userId: string;
  chatId: number;
  currentStep: "content" | "exercise" | "waiting_answer" | "waiting_doubt" | "explaining_doubt";
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
}

const activeSessions = new Map<string, LearningSession>();

const FEEDBACK_CORRECT = [
  { title: "EXCELENTE!", msg: "Sua resposta está correta! Você demonstrou total compreensão do conceito." },
  { title: "PARABÉNS!", msg: "Acertou! Continue assim que a aprovação está cada vez mais próxima!" },
  { title: "MUITO BEM!", msg: "Resposta correta! Você está no caminho certo para a aprovação!" },
  { title: "PERFEITO!", msg: "Isso mesmo! Sua dedicação está rendendo frutos!" },
  { title: "MANDOU BEM!", msg: "Correto! Você está dominando esse conteúdo!" },
];

const FEEDBACK_WRONG = [
  { title: "NÃO FOI DESSA VEZ!", msg: "Mas não desanime! O erro é parte do aprendizado." },
  { title: "VAMOS LÁ!", msg: "Não acertou, mas está no caminho! Vou te explicar:" },
  { title: "QUASE LÁ!", msg: "Resposta incorreta, mas você está evoluindo! Entenda o porquê:" },
  { title: "FOCO TOTAL!", msg: "Errou, mas agora vai acertar sempre! Veja a explicação:" },
  { title: "CONTINUAR TENTANDO!", msg: "Incorreto, mas cada erro te aproxima do sucesso! Vamos lá:" },
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
  facilidades: string[] = [],
) {
  console.log("🎓 Iniciando sessão inteligente");
  console.log(`📊 Concurso: ${examType}, Dificuldades: ${dificuldades.join(', ')}`);

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

  await new Promise((r) => setTimeout(r, 15000));

  await sendNextContent(bot, session);
}

async function getSmartContent(session: LearningSession) {
  console.log(`🔍 Buscando conteúdo para ${session.examType}...`);
  
  let result;
  
  // Se já usou conteúdos, excluir eles
  if (session.usedContentIds.length > 0) {
    result = await db.execute(sql`
      SELECT * FROM ai_generated_content
      WHERE exam_type = ${session.examType}
        AND id NOT IN (${sql.join(session.usedContentIds.map(id => sql`${id}`), sql`, `)})
      ORDER BY RANDOM()
      LIMIT 1
    `);
  } else {
    // Primeira vez, buscar qualquer um
    result = await db.execute(sql`
      SELECT * FROM ai_generated_content
      WHERE exam_type = ${session.examType}
      ORDER BY RANDOM()
      LIMIT 1
    `);
  }

  if (result.rows.length > 0) {
    console.log(`✅ Conteúdo encontrado: ${result.rows[0].title}`);
    return result.rows[0];
  }

  console.log(`⚠️ Nenhum conteúdo encontrado para ${session.examType}`);
  return null;
}

async function sendNextContent(bot: TelegramBot, session: LearningSession) {
  const content = await getSmartContent(session);

  if (!content) {
    await bot.sendMessage(
      session.chatId,
      `⚠️ *Conteúdo em preparação!*\n\nEstamos preparando materiais específicos para ${session.examType}.\n\nVolte em breve! 📚`,
      { parse_mode: "Markdown" }
    );
    
    activeSessions.delete(session.userId);
    return;
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

${content.key_points}

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

function generateMultipleChoice(content: any) {
  const title = content.title;
  const def = content.definition;

  let correctAnswer = def.length > 100 ? def.substring(0, 97) + "..." : def;

  const wrongAnswers = [
    `${title} refere-se exclusivamente a crimes dolosos contra o patrimônio`,
    `${title} só se aplica quando há violência ou grave ameaça à pessoa`,
    `${title} é conceito do direito civil sem aplicação no direito penal`,
    `${title} exige sempre a presença de dolo específico para configuração`,
  ];

  const shuffledWrong = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [correctAnswer, ...shuffledWrong];
  const shuffledOptions = options.sort(() => Math.random() - 0.5);

  return {
    question: `Sobre ${title}, assinale a alternativa CORRETA:`,
    options: shuffledOptions,
    correctAnswer: correctAnswer,
    correctIndex: shuffledOptions.indexOf(correctAnswer),
  };
}

async function sendDailyReport(bot: TelegramBot, session: LearningSession) {
  const duration = Math.floor((new Date().getTime() - session.startTime.getTime()) / 60000);
  const total = session.correctAnswers + session.wrongAnswers;
  const percentage = total > 0 ? Math.round((session.correctAnswers / total) * 100) : 0;

  const report = `📊 *RELATÓRIO DE ESTUDOS*

━━━━━━━━━━━━━━━━

⏱️ *Tempo de estudo:* ${duration} minutos
📚 *Conteúdos estudados:* ${session.contentsSent}
✅ *Acertos:* ${session.correctAnswers}
❌ *Erros:* ${session.wrongAnswers}
📈 *Aproveitamento:* ${percentage}%

━━━━━━━━━━━━━━━━

${percentage >= 80 ? "🏆 *EXCELENTE!* Desempenho excepcional!" : ""}
${percentage >= 60 && percentage < 80 ? "💪 *MUITO BOM!* Continue assim!" : ""}
${percentage < 60 && total > 0 ? "📖 *FOCO!* Revise os conteúdos com atenção!" : ""}
${total === 0 ? "📚 *Comece a estudar amanhã!*" : ""}

Volte amanhã para mais conteúdos! 🚀`;

  await bot.sendMessage(session.chatId, report, { parse_mode: "Markdown" });
  
  if (total > 0) {
    await db.execute(sql`
      UPDATE users 
      SET daily_content_count = daily_content_count + ${session.contentsSent},
          total_questions_answered = total_questions_answered + ${total}
      WHERE telegram_id = ${session.userId}
    `);
  }
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
      const feedback = FEEDBACK_CORRECT[Math.floor(Math.random() * FEEDBACK_CORRECT.length)];

      const message = `✅ *${feedback.title}*

━━━━━━━━━━━━━━━━

${feedback.msg}

💡 *Por que está correto?*

${session.currentContent.tip}

━━━━━━━━━━━━━━━━

✨ Lembre-se sempre disso para acertar questões similares!`;

      await bot.sendMessage(session.chatId, message, { parse_mode: "Markdown" });
    } else {
      session.wrongAnswers++;
      const feedback = FEEDBACK_WRONG[Math.floor(Math.random() * FEEDBACK_WRONG.length)];

      const message = `❌ *${feedback.title}*

━━━━━━━━━━━━━━━━

${feedback.msg}

✅ *A resposta correta é:*

${session.currentQuestion.correctAnswer}

💡 *Explicação:*

${session.currentContent.definition}

━━━━━━━━━━━━━━━━

📚 Releia os pontos-chave e você vai dominar isso!`;

      await bot.sendMessage(session.chatId, message, { parse_mode: "Markdown" });
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

    await bot.sendMessage(session.chatId, "❓ *Ficou alguma dúvida sobre esse conteúdo?*", {
      parse_mode: "Markdown",
      reply_markup: doubtKeyboard,
    });

    session.currentStep = "waiting_doubt";
    return true;
  }

  if (data === "doubt_no" && session.currentStep === "waiting_doubt") {
    await bot.answerCallbackQuery(query.id, { text: "🚀 Próximo conteúdo!" });
    await sendNextContent(bot, session);
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

${session.currentContent.key_points.split("•").filter((p: string) => p.trim())[0]}

━━━━━━━━━━━━━━━━`;

    await bot.sendMessage(session.chatId, simplified, { parse_mode: "Markdown" });
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

  if (data.startsWith("answer2_") && session.currentStep === "explaining_doubt") {
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
    await sendNextContent(bot, session);
    return true;
  }

  return false;
}

export { activeSessions };
