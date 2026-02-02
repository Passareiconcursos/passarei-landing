import TelegramBot from "node-telegram-bot-api";
import { generateEnhancedContent, generateExplanation } from "./ai-service";
import { db } from "../../db";
import { sql } from "drizzle-orm";
import {
  checkQuestionAccess,
  consumeQuestion,
  QuestionAccessResult,
  recordSM2Review,
  getSM2DueReviews,
  getQuestionForSubject,
  recordQuestionAttempt,
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
  usedAlternatives: string[]; // Alternativas já usadas na sessão (nunca repetir)
  usedQuestionIds: string[]; // IDs de questões reais já usadas
  currentQuestionId: string | null; // ID da questão real atual (se houver)
  difficulties: string[];
  facilities: string[];
  examType: string;
  startTime: Date;
  lastAccessType?: QuestionAccessResult["reason"];
  // Controle de matéria atual
  currentSubject: string | null;
  currentSubjectName: string | null;
  currentSubjectQuestions: number;
  currentSubjectCorrect: number;
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
    usedAlternatives: [], // Alternativas já usadas (nunca repetir)
    usedQuestionIds: [], // Questões reais já usadas
    currentQuestionId: null, // Questão real atual
    difficulties: dificuldades,
    facilities: facilidades,
    examType: examType,
    startTime: new Date(),
    // Controle de matéria atual
    currentSubject: null,
    currentSubjectName: null,
    currentSubjectQuestions: 0,
    currentSubjectCorrect: 0,
  };

  activeSessions.set(telegramId, session);
  await new Promise((r) => setTimeout(r, 2000));
  await sendNextContent(bot, session);
}

async function getSmartContent(session: LearningSession) {
  try {
    let result;

    // ============================================
    // SM2: PRIORIZAR REVISÕES PENDENTES (VETERANO)
    // ============================================
    const dueReviews = await getSM2DueReviews(
      session.userId,
      session.examType,
      5,
    );

    // Filtrar revisões que ainda não foram usadas nesta sessão
    const availableDueReviews = dueReviews.filter(
      (id) => !session.usedContentIds.includes(id),
    );

    if (availableDueReviews.length > 0) {
      const dueContentId = availableDueReviews[0];
      console.log(`📚 [SM2] Revisão pendente encontrada: ${dueContentId}`);

      result = await db.execute(sql`
        SELECT * FROM "Content"
        WHERE "id" = ${dueContentId}
        LIMIT 1
      `);

      if (result.length > 0) {
        console.log(`✅ [SM2] Revisão: ${result[0].title}`);
        return result[0];
      }
    }

    // ============================================
    // CORREÇÃO 2: PRIORIZAR MATÉRIAS DE DIFICULDADE
    // 70% dificuldade, 30% facilidade (plano de estudo)
    // ============================================
    const shouldPrioritizeDifficulty = Math.random() < 0.7;
    const usedIdsClause = session.usedContentIds.length > 0
      ? sql`AND c."id" NOT IN (${sql.join(session.usedContentIds.map((id) => sql`${id}`), sql`, `)})`
      : sql``;

    // 2a. Tentar buscar de matérias de DIFICULDADE (70% das vezes)
    if (shouldPrioritizeDifficulty && session.difficulties.length > 0) {
      console.log(`🎯 [PLANO] Buscando matéria de DIFICULDADE...`);

      result = await db.execute(sql`
        SELECT c.* FROM "Content" c
        JOIN "Subject" s ON c."subjectId" = s.id
        WHERE s."displayName" IN (${sql.join(session.difficulties.map((d) => sql`${d}`), sql`, `)})
          AND c."isActive" = true
          ${usedIdsClause}
        ORDER BY RANDOM()
        LIMIT 1
      `);

      if (result.length > 0) {
        console.log(`✅ [DIFICULDADE] Encontrado: ${result[0].title}`);
        return result[0];
      }
      console.log(`⚠️ [DIFICULDADE] Nenhum conteúdo disponível, tentando facilidade...`);
    }

    // 2b. Tentar buscar de matérias de FACILIDADE (30% das vezes ou fallback)
    if (session.facilities.length > 0) {
      console.log(`📚 [PLANO] Buscando matéria de FACILIDADE...`);

      result = await db.execute(sql`
        SELECT c.* FROM "Content" c
        JOIN "Subject" s ON c."subjectId" = s.id
        WHERE s."displayName" IN (${sql.join(session.facilities.map((f) => sql`${f}`), sql`, `)})
          AND c."isActive" = true
          ${usedIdsClause}
        ORDER BY RANDOM()
        LIMIT 1
      `);

      if (result.length > 0) {
        console.log(`✅ [FACILIDADE] Encontrado: ${result[0].title}`);
        return result[0];
      }
      console.log(`⚠️ [FACILIDADE] Nenhum conteúdo disponível, buscando geral...`);
    }

    // 2c. Fallback: qualquer conteúdo não usado
    console.log(`📚 [FALLBACK] Buscando qualquer conteúdo disponível...`);
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
      console.log(`✅ [GERAL] Conteúdo encontrado: ${result[0].title}`);
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
  session.usedContentIds.push(content.id as string);
  session.contentsSent++;

  // ============================================
  // CORREÇÃO 4: INFORMAR MUDANÇA DE MATÉRIA
  // ============================================
  const contentSubjectId = (content.subjectId as string) || null;
  let subjectName = "Conteúdo";

  // Buscar nome do subject
  try {
    if (contentSubjectId) {
      const subjectResult = await db.execute(sql`
        SELECT "displayName" FROM "Subject" WHERE id = ${contentSubjectId}
      `) as any[];
      subjectName = subjectResult[0]?.displayName || "Conteúdo";
    }
  } catch (e) {
    console.error("Erro ao buscar subject:", e);
  }

  // Verificar se mudou de matéria
  if (session.currentSubject !== contentSubjectId) {
    // Se tinha matéria anterior, enviar resumo de aproveitamento
    if (session.currentSubject && session.currentSubjectQuestions > 0) {
      const percent = Math.round(
        (session.currentSubjectCorrect / session.currentSubjectQuestions) * 100
      );
      const emoji = percent >= 70 ? "🎉" : percent >= 50 ? "👍" : "💪";

      await bot.sendMessage(
        session.chatId,
        `${emoji} *Aproveitamento em ${session.currentSubjectName}:*\n\n` +
          `✅ Acertos: ${session.currentSubjectCorrect}/${session.currentSubjectQuestions} (${percent}%)\n\n` +
          `───────────────`,
        { parse_mode: "Markdown" }
      );
      await new Promise((r) => setTimeout(r, 1500));
    }

    // Atualizar matéria atual
    session.currentSubject = contentSubjectId;
    session.currentSubjectName = subjectName;
    session.currentSubjectQuestions = 0;
    session.currentSubjectCorrect = 0;

    // Anunciar nova matéria
    await bot.sendMessage(
      session.chatId,
      `📚 *Agora vamos estudar:*\n\n` +
        `🎯 *${subjectName.toUpperCase()}*\n\n` +
        `───────────────`,
      { parse_mode: "Markdown" }
    );
    await new Promise((r) => setTimeout(r, 1500));
  }

  const title = (content.title as string) || "Conteúdo";
  const definition = (
    content.textContent ||
    content.definition ||
    content.description ||
    "Definição não disponível"
  ) as string;
  // Salvar definição original antes da IA modificar
  const originalDefinition = definition;

  // Gerar conteúdo enriquecido com IA
  await bot.sendMessage(
    session.chatId,
    `⏳ _Preparando conteúdo personalizado..._`,
    { parse_mode: "Markdown" },
  );
  const enhanced = await generateEnhancedContent(
    title,
    definition,
    session.examType,
  );
  const keyPoints = enhanced.keyPoints;
  const example = enhanced.example;
  const tip = enhanced.tip;

  await bot.sendMessage(
    session.chatId,
    `📚 *CONTEÚDO ${session.contentsSent}*\n\n🎯 *${title}*\n\n📖 ${definition}\n\n✅ *Pontos-chave:*\n${keyPoints}\n\n💡 *Exemplo:* ${example}\n\n🎯 *Dica:* ${tip}`,
    { parse_mode: "Markdown" },
  );

  await new Promise((r) => setTimeout(r, 3000));

  // ============================================
  // FASE 5: TENTAR QUESTÃO REAL DO BANCO
  // ============================================
  const realQuestion = contentSubjectId
    ? await getQuestionForSubject(contentSubjectId, session.usedQuestionIds)
    : null;

  if (realQuestion) {
    // QUESTÃO REAL DO BANCO
    session.currentQuestionId = realQuestion.id as string;
    session.usedQuestionIds.push(realQuestion.id as string);

    const alternatives = realQuestion.alternatives as { letter: string; text: string }[];
    const isCertoErrado = realQuestion.questionType === "CERTO_ERRADO";

    // Montar opções
    const options = alternatives.map((alt: { letter: string; text: string }) => alt.text);
    const correctLetter = realQuestion.correctAnswer as string;
    const correctIdx = alternatives.findIndex(
      (alt: { letter: string; text: string }) => alt.letter === correctLetter
    );

    session.currentQuestion = {
      question: realQuestion.statement,
      options,
      correctAnswer: alternatives[correctIdx]?.text || options[0],
      correctIndex: correctIdx >= 0 ? correctIdx : 0,
      explanation: realQuestion.explanation,
      isRealQuestion: true,
      questionType: realQuestion.questionType,
    };

    // Formatar opções
    const optionsText = alternatives
      .map((alt: { letter: string; text: string }) => `${alt.letter}) ${alt.text}`)
      .join("\n\n");

    // Botões com letras
    const keyboard = {
      inline_keyboard: alternatives.map(
        (alt: { letter: string; text: string }, idx: number) => [
          {
            text: isCertoErrado ? alt.text : `Questão ${alt.letter}`,
            callback_data: `answer_${idx}`,
          },
        ]
      ),
    };

    const diffEmoji = realQuestion.difficulty === "FACIL" ? "🟢" : realQuestion.difficulty === "MEDIO" ? "🟡" : "🔴";

    await bot.sendMessage(
      session.chatId,
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
    // FALLBACK: Gerar questão a partir do conteúdo
    session.currentQuestionId = null;

    const contentForQuestion = {
      ...content,
      textContent: originalDefinition,
      definition: originalDefinition,
      description: originalDefinition,
    };
    const question = await generateMultipleChoice(contentForQuestion, session);
    session.currentQuestion = { ...question, isRealQuestion: false };

    const optionsText = question.options
      .map((opt: string, idx: number) => {
        const letter = String.fromCharCode(65 + idx);
        return `${letter}) ${opt}`;
      })
      .join("\n\n");

    const keyboard = {
      inline_keyboard: question.options.map((opt: string, idx: number) => [
        {
          text: `Questão ${String.fromCharCode(65 + idx)}`,
          callback_data: `answer_${idx}`,
        },
      ]),
    };

    await bot.sendMessage(
      session.chatId,
      `✍️ *EXERCÍCIO*\n\n` +
        `❓ ${question.question}\n\n` +
        `───────────────\n` +
        `${optionsText}\n` +
        `───────────────\n\n` +
        `👇 *Escolha sua resposta:*`,
      {
        parse_mode: "Markdown",
        reply_markup: keyboard,
      },
    );
  }

  session.currentStep = "waiting_answer";
}

// ============================================
// GERADOR DE ALTERNATIVAS ÚNICAS POR QUESTÃO
// ============================================

async function generateMultipleChoice(content: any, session: LearningSession) {
  const title = content.title || "Conceito";
  const def = content.textContent || "";
  const subjectId = content.subjectId;

  // Pegar primeira frase completa como resposta correta
  let correctAnswer = def.split(/[.!?]/)[0].trim();
  if (correctAnswer.length > 200) {
    correctAnswer = correctAnswer.substring(0, 197) + "...";
  } else if (correctAnswer.length > 0) {
    correctAnswer += ".";
  }

  // ============================================
  // BUSCAR ALTERNATIVAS ERRADAS DO BANCO
  // ============================================
  let wrongAnswers: string[] = [];

  try {
    // 1. Primeiro: buscar outros conteúdos do MESMO subject
    const sameSubjectContents = await db.execute(sql`
      SELECT "textContent", "title" FROM "Content"
      WHERE "subjectId" = ${subjectId}
        AND "id" != ${content.id}
        AND "isActive" = true
      ORDER BY RANDOM()
      LIMIT 10
    `) as any[];

    // Filtrar alternativas que ainda não foram usadas na sessão
    for (const c of sameSubjectContents) {
      if (wrongAnswers.length >= 3) break;

      let answer = c.textContent?.split(/[.!?]/)[0]?.trim() || "";
      if (answer.length > 200) answer = answer.substring(0, 197) + "...";
      if (answer.length > 0) answer += ".";

      // Verificar se não é igual à correta e não foi usada antes
      if (
        answer.length > 10 &&
        answer !== correctAnswer &&
        !session.usedAlternatives.includes(answer) &&
        !wrongAnswers.includes(answer)
      ) {
        wrongAnswers.push(answer);
      }
    }

    // 2. Se não encontrou 3, buscar de OUTROS subjects da mesma categoria
    if (wrongAnswers.length < 3 && subjectId) {
      const subjectResult = await db.execute(sql`
        SELECT category FROM "Subject" WHERE id = ${subjectId}
      `) as any[];

      const category = subjectResult[0]?.category;

      if (category) {
        const sameCategoryContents = await db.execute(sql`
          SELECT c."textContent", c."title" FROM "Content" c
          JOIN "Subject" s ON c."subjectId" = s.id
          WHERE s.category = ${category}
            AND c."subjectId" != ${subjectId}
            AND c."isActive" = true
          ORDER BY RANDOM()
          LIMIT 10
        `) as any[];

        for (const c of sameCategoryContents) {
          if (wrongAnswers.length >= 3) break;

          let answer = c.textContent?.split(/[.!?]/)[0]?.trim() || "";
          if (answer.length > 200) answer = answer.substring(0, 197) + "...";
          if (answer.length > 0) answer += ".";

          if (
            answer.length > 10 &&
            answer !== correctAnswer &&
            !session.usedAlternatives.includes(answer) &&
            !wrongAnswers.includes(answer)
          ) {
            wrongAnswers.push(answer);
          }
        }
      }
    }

  } catch (err) {
    console.error("⚠️ Erro ao buscar alternativas do banco:", err);
  }

  // 3. Fallback: gerar alternativas contextuais únicas se ainda não tem 3
  if (wrongAnswers.length < 3) {
    const fallbackAlternatives = await generateContextualFallback(
      title,
      subjectId,
      session.usedAlternatives,
      wrongAnswers,
      correctAnswer
    );
    wrongAnswers.push(...fallbackAlternatives);
  }

  // Garantir apenas 3 alternativas erradas
  wrongAnswers = wrongAnswers.slice(0, 3);

  // Registrar alternativas usadas na sessão (para não repetir)
  session.usedAlternatives.push(...wrongAnswers);

  // Misturar opções
  const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

  return {
    question: `Sobre ${title}, assinale a CORRETA:`,
    options,
    correctAnswer,
    correctIndex: options.indexOf(correctAnswer),
  };
}

// Gera alternativas de fallback contextuais e únicas
async function generateContextualFallback(
  title: string,
  subjectId: string,
  usedAlternatives: string[],
  existingWrong: string[],
  correctAnswer: string
): Promise<string[]> {
  const fallback: string[] = [];

  // Buscar categoria do subject
  let category = "OUTRO";
  try {
    if (subjectId) {
      const result = await db.execute(sql`
        SELECT category FROM "Subject" WHERE id = ${subjectId}
      `) as any[];
      category = result[0]?.category || "OUTRO";
    }
  } catch (e) {
    console.error("Erro ao buscar categoria:", e);
  }

  // Pool de alternativas por categoria (várias opções para não repetir)
  const FALLBACK_POOL: Record<string, string[]> = {
    DIREITO: [
      `${title} aplica-se apenas na esfera administrativa.`,
      `${title} não tem previsão na legislação vigente.`,
      `${title} é instituto exclusivo do direito privado.`,
      `${title} depende de regulamentação específica.`,
      `${title} foi revogado pela jurisprudência recente.`,
      `${title} não admite interpretação extensiva.`,
      `${title} requer autorização judicial prévia.`,
      `${title} está restrito à competência estadual.`,
    ],
    LINGUAGENS: [
      `${title} caracteriza apenas a linguagem informal.`,
      `${title} não é reconhecido pela gramática normativa.`,
      `${title} aplica-se somente a textos literários.`,
      `${title} é um fenômeno regional sem registro formal.`,
      `${title} contradiz as regras de concordância.`,
      `${title} ocorre apenas em registros orais.`,
      `${title} foi abolido pela reforma ortográfica.`,
      `${title} não possui função sintática definida.`,
    ],
    MATEMATICA: [
      `${title} só é válido para números naturais.`,
      `${title} não se aplica em conjuntos infinitos.`,
      `${title} é restrito à geometria espacial.`,
      `${title} requer variáveis complexas.`,
      `${title} contradiz os axiomas de Peano.`,
      `${title} não admite representação gráfica.`,
      `${title} é exclusivo de funções lineares.`,
      `${title} depende de condições de contorno.`,
    ],
    CIENCIAS_NATUREZA: [
      `${title} ocorre apenas em sistemas isolados.`,
      `${title} não é observado em condições padrão.`,
      `${title} viola as leis da conservação de energia.`,
      `${title} requer temperaturas absolutas.`,
      `${title} contradiz o modelo atômico atual.`,
      `${title} é exclusivo de reações endotérmicas.`,
      `${title} não ocorre na natureza espontaneamente.`,
      `${title} depende de catalisadores específicos.`,
    ],
    CIENCIAS_HUMANAS: [
      `${title} foi conceito superado no século XXI.`,
      `${title} aplica-se apenas a contextos europeus.`,
      `${title} ignora fatores socioeconômicos.`,
      `${title} contradiz as teorias contemporâneas.`,
      `${title} não considera aspectos culturais.`,
      `${title} é restrito a sociedades industriais.`,
      `${title} foi refutado por estudos recentes.`,
      `${title} desconsidera o contexto histórico.`,
    ],
    INFORMATICA: [
      `${title} é exclusivo de sistemas legados.`,
      `${title} não funciona em arquiteturas 64-bit.`,
      `${title} requer hardware proprietário.`,
      `${title} foi descontinuado nas versões atuais.`,
      `${title} não é compatível com redes modernas.`,
      `${title} depende de protocolos obsoletos.`,
      `${title} é restrito a ambientes mainframe.`,
      `${title} contradiz os padrões de segurança.`,
    ],
    ESPECIFICAS: [
      `${title} é aplicável apenas em contextos específicos.`,
      `${title} não segue os padrões regulamentares.`,
      `${title} requer certificação especial.`,
      `${title} foi substituído por normas recentes.`,
      `${title} contradiz as diretrizes vigentes.`,
      `${title} depende de autorização prévia.`,
      `${title} não é reconhecido internacionalmente.`,
      `${title} está restrito a casos excepcionais.`,
    ],
    CONHECIMENTOS_GERAIS: [
      `${title} é informação desatualizada.`,
      `${title} não possui comprovação científica.`,
      `${title} contradiz dados oficiais recentes.`,
      `${title} foi desmentido por especialistas.`,
      `${title} aplica-se apenas a casos isolados.`,
      `${title} não é consenso entre pesquisadores.`,
      `${title} carece de fundamentação teórica.`,
      `${title} foi revisado em publicações recentes.`,
    ],
    OUTRO: [
      `${title} é uma definição ultrapassada.`,
      `${title} não se aplica ao contexto atual.`,
      `${title} requer condições especiais.`,
      `${title} contradiz o entendimento vigente.`,
      `${title} foi revisado por especialistas.`,
      `${title} não possui aplicação prática.`,
      `${title} depende de fatores externos.`,
      `${title} é restrito a situações específicas.`,
    ],
  };

  const pool = FALLBACK_POOL[category] || FALLBACK_POOL.OUTRO;

  // Selecionar alternativas que não foram usadas
  for (const alt of pool) {
    if (fallback.length >= (3 - existingWrong.length)) break;

    if (
      !usedAlternatives.includes(alt) &&
      !existingWrong.includes(alt) &&
      alt !== correctAnswer
    ) {
      fallback.push(alt);
    }
  }

  return fallback;
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
        [
          {
            text: "🎓 Plano Calouro - R$ 89,90/mês",
            callback_data: "pay_calouro",
          },
        ],
        [
          {
            text: "⭐ Plano Veterano - R$ 44,90/mês (anual)",
            callback_data: "pay_veterano",
          },
        ],
        [{ text: "🔙 Voltar", callback_data: "back_to_menu" }],
      ],
    };
    await bot.sendMessage(
      chatId,
      `💳 *NOSSOS PLANOS*\n\n` +
        `🎓 *CALOURO* - R$ 89,90/mês\n` +
        `• Sem compromisso, cancele quando quiser\n` +
        `• 300 questões personalizadas/mês\n` +
        `• Correção detalhada com IA\n` +
        `• Pix ou Cartão\n\n` +
        `⭐ *VETERANO* - R$ 44,90/mês (anual)\n` +
        `• 30 questões/dia (900/mês)\n` +
        `• 2 correções de redação/mês\n` +
        `• Intensivo nas dificuldades\n` +
        `• Simulados mensais\n` +
        `• Suporte prioritário\n\n` +
        `_Economize 50% no plano anual!_`,
      { parse_mode: "Markdown", reply_markup: keyboard },
    );
    return true;
  }
  if (data === "pay_calouro") {
    await bot.answerCallbackQuery(query.id);
    const appUrl =
      process.env.APP_URL ||
      "https://passarei-landing-production.up.railway.app";
    await bot.sendMessage(
      chatId,
      `🎓 *PLANO CALOURO*\n\nR$ 89,90/mês - Sem compromisso\n\n✅ 300 questões personalizadas/mês\n✅ Correção detalhada de cada alternativa\n✅ Explicações completas com IA\n✅ Use quando quiser\n✅ Créditos não expiram\n\n🔗 Clique para assinar:\n${appUrl}/checkout?pkg=calouro_mensal\&user=${telegramId}`,
      { parse_mode: "Markdown" },
    );
    return true;
  }
  if (data === "pay_veterano" || data === "buy_veterano") {
    await bot.answerCallbackQuery(query.id);
    const veteranoUrl =
      "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=e717107a9daa436f81ce9c8cc1c00d8f";
    await bot.sendMessage(
      chatId,
      `⭐ *PLANO VETERANO*\n\nR$ 44,90/mês (cobrado anualmente)\n\n✅ 30 questões/dia (10.800/ano)\n✅ 2 correções de redação/mês com IA\n✅ Intensivo nas suas dificuldades\n✅ Revisão inteligente SM2\n✅ Plano de estudos personalizado\n✅ Simulados mensais\n✅ Suporte prioritário\n✅ Troque de concurso quando quiser\n\n💰 *Economia de 50%* vs mensal!\n\n🔗 Clique para assinar:\n${veteranoUrl}`,
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

    // Delay para dar tempo do usuário processar
    await new Promise((r) => setTimeout(r, 1500)); // 1,5 segundos

    // Incrementar contador de questões da matéria atual
    session.currentSubjectQuestions++;

    if (isCorrect) {
      session.correctAnswers++;
      session.currentSubjectCorrect++; // Contador por matéria
      const fb =
        FEEDBACK_CORRECT[Math.floor(Math.random() * FEEDBACK_CORRECT.length)];
      await bot.sendMessage(session.chatId, `✅ *${fb.title}*\n\n${fb.msg}`, {
        parse_mode: "Markdown",
      });

      // Usar explicação da questão real OU gerar com IA
      if (session.currentQuestion.isRealQuestion && session.currentQuestion.explanation) {
        await bot.sendMessage(session.chatId, `💡 ${session.currentQuestion.explanation}`, {
          parse_mode: "Markdown",
        });
      } else {
        const explanation = await generateExplanation(
          session.currentContent.title,
          session.currentContent.textContent || "",
          session.currentQuestion.options[answerIdx],
          session.currentQuestion.correctAnswer,
          true,
        );
        await bot.sendMessage(session.chatId, `💡 ${explanation.explanation}`, {
          parse_mode: "Markdown",
        });
      }
    } else {
      session.wrongAnswers++;
      const fb =
        FEEDBACK_WRONG[Math.floor(Math.random() * FEEDBACK_WRONG.length)];
      await bot.sendMessage(
        session.chatId,
        `❌ *${fb.title}*\n\n${fb.msg}\n\n✅ Correta: ${session.currentQuestion.correctAnswer}`,
        { parse_mode: "Markdown" },
      );

      // Usar explicação da questão real OU gerar com IA
      if (session.currentQuestion.isRealQuestion && session.currentQuestion.explanation) {
        await bot.sendMessage(session.chatId, `📚 ${session.currentQuestion.explanation}`, {
          parse_mode: "Markdown",
        });
      } else {
        const explanation = await generateExplanation(
          session.currentContent.title,
          session.currentContent.textContent || "",
          session.currentQuestion.options[answerIdx],
          session.currentQuestion.correctAnswer,
          false,
        );
        await bot.sendMessage(session.chatId, `📚 ${explanation.explanation}`, {
          parse_mode: "Markdown",
        });
      }
    }

    // 💾 SALVAR RESPOSTA NO BANCO
    try {
      // Buscar userId do banco
      const userData = await db.execute(sql`
        SELECT id FROM "User" WHERE "telegramId" = ${telegramId} LIMIT 1
      `);

      if (userData && userData.length > 0) {
        const userId = userData[0].id;

        // Salvar resposta na user_answers
        await db.execute(sql`
          INSERT INTO "user_answers" ("userId", "contentId", "selectedAnswer", "correct", "answeredAt")
VALUES (${userId}, ${session.currentContent.id}, ${answerIdx}, ${isCorrect}, NOW())
        `);

        console.log(
          `💾 [Learning] Resposta salva: ${telegramId} - ${isCorrect ? "✅" : "❌"}`,
        );
      }
    } catch (error) {
      console.error("❌ [Learning] Erro ao salvar resposta:", error);
    }

    // 📝 REGISTRAR QUESTION ATTEMPT (questão real)
    if (session.currentQuestionId) {
      try {
        const userAnswer = session.currentQuestion.options[answerIdx] || String(answerIdx);
        await recordQuestionAttempt(
          telegramId,
          session.currentQuestionId,
          userAnswer,
          isCorrect,
        );
      } catch (qaError) {
        console.error("❌ [QuestionAttempt] Erro:", qaError);
      }
    }

    // 📚 SM2: REGISTRAR REVISÃO ESPAÇADA (VETERANO)
    try {
      await recordSM2Review(
        telegramId,
        session.currentContent.id,
        isCorrect,
      );
    } catch (sm2Error) {
      console.error("❌ [SM2] Erro ao registrar revisão:", sm2Error);
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
