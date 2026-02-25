import TelegramBot from "node-telegram-bot-api";
import { generateEnhancedContent, generateExplanation } from "./ai-service";
import { db } from "../../db";
import { sql } from "drizzle-orm";
import {
  checkQuestionAccess,
  consumeQuestion,
  QuestionAccessResult,
  recordSM2Review,
  getQuestionForSubject,
  getQuestionForContent,
  recordQuestionAttempt,
  getStudyProgress,
  saveStudyProgress,
  getMnemonicForContent,
} from "./database";
import { getSmartContent as getSmartContentEngine } from "../services/learning-engine";

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
  _skipRetries?: number;
  pendingQuestion?: any; // Questão aguardando clique no botão "Responder"
  lastInteractionAt: Date; // C1: controle de inatividade 30min
  subjectStats: Record<string, { name: string; correct: number; total: number }>; // C1: stats por matéria
  targetConcursoId?: string;  // UUID da tabela concursos — sincronizado do target_concurso_id do User
  concursoNome?: string;      // Nome legível do concurso (para exibição no bot)
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

const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutos

// ============================================
// C1: RELATÓRIO CONSOLIDADO DE APROVEITAMENTO
// ============================================
function generateConsolidatedReport(session: LearningSession): string {
  const total = session.correctAnswers + session.wrongAnswers;
  const pct = total > 0 ? Math.round((session.correctAnswers / total) * 100) : 0;

  const concursoHeader = session.concursoNome ? ` — ${session.concursoNome}` : "";
  let msg = `📊 *RELATÓRIO DE ESTUDOS${concursoHeader}*\n\n`;
  msg += `📚 Questões respondidas: *${total}*\n`;
  msg += `✅ Acertos: *${session.correctAnswers}*\n`;
  msg += `❌ Erros: *${session.wrongAnswers}*\n`;
  msg += `📈 Aproveitamento: *${pct}%*\n`;

  // Stats por matéria
  const subjects = Object.values(session.subjectStats);
  if (subjects.length > 0) {
    msg += `\n───────────────\n📚 *Por matéria:*\n\n`;

    let best: { name: string; pct: number } | null = null;
    let worst: { name: string; pct: number } | null = null;

    for (const s of subjects) {
      if (s.total === 0) continue;
      const sPct = Math.round((s.correct / s.total) * 100);
      const emoji = sPct >= 70 ? "🟢" : sPct >= 50 ? "🟡" : "🔴";
      msg += `${emoji} ${s.name}: ${s.correct}/${s.total} (${sPct}%)\n`;

      if (!best || sPct > best.pct) best = { name: s.name, pct: sPct };
      if (!worst || sPct < worst.pct) worst = { name: s.name, pct: sPct };
    }

    if (best && worst && best.name !== worst.name) {
      msg += `\n💚 Melhor: *${best.name}* (${best.pct}%)`;
      msg += `\n🔴 Reforçar: *${worst.name}* (${worst.pct}%)`;
    }
  }

  // Motivação
  msg += `\n\n`;
  if (pct >= 80) msg += `🏆 *Excelente desempenho! Continue assim!*`;
  else if (pct >= 60) msg += `✅ *Bom trabalho! Você está evoluindo!*`;
  else if (pct >= 40) msg += `💪 *Continue praticando! Cada questão conta!*`;
  else if (total > 0) msg += `📚 *Não desista! Revise os conteúdos e tente novamente!*`;
  else msg += `📖 *Comece a estudar para ver seu progresso!*`;

  return msg;
}

// Salvar desempenho diário por matéria no banco (C2: alimenta estudo adaptativo)
async function saveDailyPerformance(telegramId: string, subjectStats: Record<string, { name: string; correct: number; total: number }>) {
  try {
    const subjects = Object.entries(subjectStats);
    if (subjects.length === 0) return;

    // Salvar dificuldades atualizadas baseado no desempenho
    const weakSubjects: string[] = [];
    for (const [, stats] of subjects) {
      if (stats.total > 0) {
        const pct = (stats.correct / stats.total) * 100;
        if (pct < 50) weakSubjects.push(stats.name);
      }
    }

    if (weakSubjects.length > 0) {
      // Mesclar com dificuldades existentes
      const existing = await db.execute(sql`
        SELECT "dificuldades" FROM "User" WHERE "telegramId" = ${telegramId} LIMIT 1
      `) as any[];

      let currentDiffs: string[] = [];
      if (existing[0]?.dificuldades) {
        const raw = existing[0].dificuldades;
        currentDiffs = typeof raw === "string" ? JSON.parse(raw) : (Array.isArray(raw) ? raw : []);
      }

      // Adicionar novas dificuldades sem duplicar
      const merged = Array.from(new Set([...currentDiffs, ...weakSubjects]));

      await db.execute(sql`
        UPDATE "User"
        SET "dificuldades" = ${JSON.stringify(merged)}::jsonb,
            last_active_at = NOW()
        WHERE "telegramId" = ${telegramId}
      `);
      console.log(`📊 [C2] Dificuldades atualizadas para ${telegramId}: ${merged.join(", ")}`);
    } else {
      await db.execute(sql`
        UPDATE "User" SET last_active_at = NOW() WHERE "telegramId" = ${telegramId}
      `);
    }
  } catch (error) {
    console.error("❌ [C2] Erro ao salvar desempenho:", error);
  }
}

// Verificar se houve inatividade de 30min
function checkInactivity(session: LearningSession): boolean {
  return Date.now() - session.lastInteractionAt.getTime() > INACTIVITY_LIMIT_MS;
}

// Encerrar sessão com relatório consolidado
async function endSessionWithReport(
  bot: TelegramBot,
  session: LearningSession,
  reason: "limit" | "inactivity" | "voluntary",
) {
  const telegramId = session.userId;
  let header = "";
  if (reason === "limit") header = `⏰ *Limite diário atingido!*\n\n`;
  else if (reason === "inactivity") header = `⏸️ *Sessão pausada por inatividade (30min)*\n\n`;
  else header = `✋ *Sessão encerrada*\n\n`;

  const report = generateConsolidatedReport(session);

  // Botão para continuar estudando (exceto quando atingiu limite)
  const reportKeyboard = reason !== "limit" ? {
    inline_keyboard: [
      [{ text: "📚 Continuar estudando", callback_data: "resume_study" }],
      [{ text: "📋 Menu principal", callback_data: "menu_main" }],
    ],
  } : undefined;

  await bot.sendMessage(session.chatId, header + report, {
    parse_mode: "Markdown",
    reply_markup: reportKeyboard,
  });

  // Salvar progresso e desempenho
  const trimmedIds = session.usedContentIds.slice(-200);
  await saveStudyProgress(telegramId, trimmedIds);
  await saveDailyPerformance(telegramId, session.subjectStats);

  activeSessions.delete(telegramId);
}

export async function startLearningSession(
  bot: TelegramBot,
  chatId: number,
  telegramId: string,
  examType?: string,
  dificuldades?: string[],
  facilidades?: string[],
) {
  console.log("🎓 Iniciando sessão");

  // Se chamado sem parâmetros (via /estudar), carregar do banco
  let resolvedExamType = examType || "";
  let resolvedDificuldades = dificuldades || [];
  let resolvedFacilidades = facilidades || [];
  let persistedContentIds: string[] = [];

  if (!examType || !dificuldades) {
    const progress = await getStudyProgress(telegramId);
    resolvedExamType = examType || progress.examType || "PF";
    resolvedDificuldades = dificuldades || progress.dificuldades;
    resolvedFacilidades = facilidades || progress.facilidades;
    persistedContentIds = progress.lastStudyContentIds || [];
    console.log(`📂 [Session] Progresso carregado: ${persistedContentIds.length} conteúdos já vistos`);
  }

  // Buscar concurso-alvo definido na web (sincronização Bot↔Web)
  let targetConcursoId: string | undefined;
  let concursoNome: string | undefined;
  try {
    const userRows = await db.execute(sql`
      SELECT target_concurso_id FROM "User" WHERE "telegramId" = ${telegramId} LIMIT 1
    `) as any[];
    targetConcursoId = userRows[0]?.target_concurso_id || undefined;
    if (targetConcursoId) {
      const cRows = await db.execute(sql`
        SELECT nome FROM concursos WHERE id = ${targetConcursoId} LIMIT 1
      `) as any[];
      concursoNome = cRows[0]?.nome || undefined;
    }
  } catch (_e) { /* não bloquear sessão se falhar */ }

  const session: LearningSession = {
    userId: telegramId,
    chatId: chatId,
    currentStep: "content",
    currentContent: null,
    currentQuestion: null,
    contentsSent: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    usedContentIds: [...persistedContentIds],
    usedAlternatives: [], // Alternativas já usadas (nunca repetir)
    usedQuestionIds: [], // Questões reais já usadas
    currentQuestionId: null, // Questão real atual
    difficulties: resolvedDificuldades,
    facilities: resolvedFacilidades,
    examType: resolvedExamType,
    startTime: new Date(),
    // Controle de matéria atual
    currentSubject: null,
    currentSubjectName: null,
    currentSubjectQuestions: 0,
    currentSubjectCorrect: 0,
    lastInteractionAt: new Date(),
    subjectStats: {},
    targetConcursoId,
    concursoNome,
  };

  activeSessions.set(telegramId, session);

  // Mensagem de boas-vindas com concurso-alvo (se definido na web)
  const concursoLine = concursoNome ? `\n🎯 Alvo: *${concursoNome}*` : "";
  await bot.sendMessage(
    chatId,
    `🎓 *Sessão de Estudos Iniciada!*${concursoLine}\n\nBuscando conteúdo para você...`,
    { parse_mode: "Markdown" },
  );

  await new Promise((r) => setTimeout(r, 1500));
  await sendNextContent(bot, session);
}


// Parse textContent que já pode conter PONTOS-CHAVE/EXEMPLO/DICA embutidos
function parseTextContent(text: string): {
  definition: string;
  keyPoints: string | null;
  example: string | null;
  tip: string | null;
} {
  const pontosIdx = text.indexOf("PONTOS-CHAVE:");
  if (pontosIdx === -1) {
    return { definition: text, keyPoints: null, example: null, tip: null };
  }

  const definition = text.substring(0, pontosIdx).trim();
  const rest = text.substring(pontosIdx);

  const keyPointsMatch = rest.match(/PONTOS-CHAVE:\n([\s\S]*?)(?=\n\nEXEMPLO:|\nEXEMPLO:)/);
  const exampleMatch = rest.match(/EXEMPLO:\n([\s\S]*?)(?=\n\nDICA:|\nDICA:)/);
  const tipMatch = rest.match(/DICA:\n([\s\S]*?)$/);

  return {
    definition,
    keyPoints: keyPointsMatch ? keyPointsMatch[1].trim() : null,
    example: exampleMatch ? exampleMatch[1].trim() : null,
    tip: tipMatch ? tipMatch[1].trim() : null,
  };
}

async function sendNextContent(bot: TelegramBot, session: LearningSession) {
  const access = await checkQuestionAccess(session.userId);

  if (!access.canAccess) {
    // C1: Gatilho 1 - Limite diário atingido → relatório consolidado
    if (access.reason === "limit_reached") {
      await endSessionWithReport(bot, session, "limit");
      // Mostrar opções de upgrade
      const keyboard = {
        inline_keyboard: [
          [{ text: "⭐ Upgrade Veterano (30/dia)", callback_data: "buy_veterano" }],
          [{ text: "📋 Ver menu principal", callback_data: "menu_main" }],
        ],
      };
      await bot.sendMessage(
        session.chatId,
        `Volte amanhã para continuar estudando!`,
        { parse_mode: "Markdown", reply_markup: keyboard },
      );
      return;
    }

    session.currentStep = "blocked";
    const keyboard = {
      inline_keyboard: [
        [{ text: "💳 Comprar Créditos", callback_data: "buy_credits" }],
        [{ text: "⭐ Plano Veterano R$ 44,90/mês", callback_data: "buy_veterano" }],
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

  const content = await getSmartContentEngine(session, { policeFilter: true });

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

  // Salvar progresso no banco (persiste entre reinícios)
  const trimmedIds = session.usedContentIds.slice(-200);
  saveStudyProgress(session.userId, trimmedIds).catch((e) =>
    console.error("❌ [Progress] Erro ao salvar:", e)
  );

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
    // Atualizar matéria atual (sem aproveitamento por troca - C5)
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
  const rawText = (
    content.textContent ||
    content.definition ||
    content.description ||
    "Definição não disponível"
  ) as string;

  // ── Rich Content Phase 5: usar colunas dedicadas quando disponíveis ──────
  // Prioridade: coluna DB (F5) > seção embutida no texto > geração IA
  const parsed = parseTextContent(rawText);
  const definition = parsed.definition;

  // keyPoint — "Ponto-Chave"
  const keyPoint: string =
    (content.keyPoint as string | null) ||
    parsed.keyPoints ||
    "";

  // practicalExample — "Exemplo Prático"
  const practicalExample: string =
    (content.practicalExample as string | null) ||
    parsed.example ||
    "";

  // mnemonic / dica — "Dica de Ouro"
  const dbMnemonic: string | null = (content.mnemonic as string | null) || null;
  const legacyMnemonic = (!dbMnemonic && contentSubjectId)
    ? await getMnemonicForContent(contentSubjectId, title, definition)
    : null;

  // Se nenhuma das colunas F5 existe E o texto não tem seções → gerar com IA
  if (!keyPoint && !practicalExample && !dbMnemonic) {
    await bot.sendMessage(
      session.chatId,
      `⏳ _Preparando conteúdo personalizado..._`,
      { parse_mode: "Markdown" },
    );
    const enhanced = await generateEnhancedContent(title, definition, session.examType);

    // Montar mensagem com conteúdo gerado por IA
    const legacyBlock = legacyMnemonic
      ? `\n\n🧠 *MACETE: ${legacyMnemonic.mnemonic}*\n${legacyMnemonic.meaning}\n📎 _${legacyMnemonic.article}_`
      : "";
    await bot.sendMessage(
      session.chatId,
      `📚 *CONTEÚDO ${session.contentsSent}*\n\n` +
        `🎯 *${title}*\n\n` +
        `📖 ${definition}\n\n` +
        `✅ *Pontos-chave:*\n${enhanced.keyPoints}${legacyBlock}\n\n` +
        `💡 *Exemplo:* ${enhanced.example}\n\n` +
        `🎯 *Dica:* ${enhanced.tip}`,
      { parse_mode: "Markdown" },
    );
  } else {
    // Conteúdo estruturado disponível — sem chamada IA
    console.log(`📗 [Content] Rich content Phase 5 de "${title}" (sem chamada IA)`);

    let richMsg = `📚 *CONTEÚDO ${session.contentsSent}*\n\n🎯 *${title}*\n\n📖 ${definition}`;

    if (keyPoint) {
      richMsg += `\n\n⚡ *Ponto-Chave:*\n${keyPoint}`;
    }
    if (practicalExample) {
      richMsg += `\n\n🔎 *Exemplo Prático:*\n${practicalExample}`;
    }
    if (dbMnemonic) {
      richMsg += `\n\n💡 *Dica de Ouro:*\n${dbMnemonic}`;
    } else if (legacyMnemonic) {
      richMsg += `\n\n🧠 *MACETE: ${legacyMnemonic.mnemonic}*\n${legacyMnemonic.meaning}\n📎 _${legacyMnemonic.article}_`;
    }

    await bot.sendMessage(session.chatId, richMsg, { parse_mode: "Markdown" });
  }

  // ============================================
  // FASE 5: TENTAR QUESTÃO REAL DO BANCO (por topicId → subjectId)
  // ============================================
  const contentTopicId = (content.topicId as string) || null;
  const realQuestion = contentSubjectId
    ? await getQuestionForContent(contentSubjectId, contentTopicId, session.usedQuestionIds)
    : null;

  if (realQuestion) {
    // Resetar retries (encontrou questão)
    session._skipRetries = 0;

    // QUESTÃO REAL DO BANCO - preparar e armazenar
    session.currentQuestionId = realQuestion.id as string;
    session.usedQuestionIds.push(realQuestion.id as string);

    // Normalizar alternativas (suporta dois formatos do banco)
    const rawAlternatives = typeof realQuestion.alternatives === "string"
      ? JSON.parse(realQuestion.alternatives)
      : realQuestion.alternatives;

    const alternatives: { letter: string; text: string }[] = Array.isArray(rawAlternatives)
      ? rawAlternatives.map((alt: any, idx: number) => {
          if (typeof alt === "string") {
            return { letter: String.fromCharCode(65 + idx), text: alt };
          }
          return { letter: alt.letter || String.fromCharCode(65 + idx), text: alt.text || String(alt) };
        })
      : [];

    const isCertoErrado = realQuestion.questionType === "CERTO_ERRADO";

    // Montar opções
    const options = alternatives.map((alt) => alt.text);
    const correctLetter = realQuestion.correctAnswer as string;
    // Suportar correctAnswer como letra ("A") ou como índice ("0")
    let correctIdx = alternatives.findIndex((alt) => alt.letter === correctLetter);
    if (correctIdx < 0) {
      const parsed = parseInt(correctLetter);
      correctIdx = !isNaN(parsed) && parsed < alternatives.length ? parsed : 0;
    }

    session.currentQuestion = {
      question: realQuestion.statement,
      options,
      correctAnswer: alternatives[correctIdx]?.text || options[0],
      correctIndex: correctIdx >= 0 ? correctIdx : 0,
      explanation: realQuestion.explanation,
      isRealQuestion: true,
      questionType: realQuestion.questionType,
    };

    // Armazenar dados para exibir quando o aluno clicar no botão
    const diffEmoji = realQuestion.difficulty === "FACIL" ? "🟢" : realQuestion.difficulty === "MEDIO" ? "🟡" : "🔴";
    session.pendingQuestion = {
      alternatives,
      isCertoErrado,
      diffEmoji,
      statement: realQuestion.statement,
    };

    // ============================================
    // B3: BOTÃO INTERMEDIÁRIO - não enviar questão direto
    // ============================================
    session.currentStep = "content";

    const readyKeyboard = {
      inline_keyboard: [
        [{ text: "✅ Responder questão", callback_data: "ready_question" }],
      ],
    };

    await bot.sendMessage(
      session.chatId,
      `📝 *Questão preparada sobre este conteúdo!*\n\nQuando estiver pronto, clique abaixo 👇`,
      { parse_mode: "Markdown", reply_markup: readyKeyboard },
    );
  } else {
    // SEM QUESTÃO REAL: sinalizar e pular para próximo conteúdo
    console.warn(`⚠️ [ALERTA] Conteúdo "${title}" (subject: ${contentSubjectId}, topic: ${contentTopicId}) SEM QUESTÃO no banco`);

    // Não cobrar crédito por conteúdo sem questão (reverter consumo)
    session.contentsSent--;

    // Tentar próximo conteúdo (máximo 3 tentativas para evitar loop)
    if (!session._skipRetries) session._skipRetries = 0;
    session._skipRetries++;

    if (session._skipRetries <= 3) {
      await bot.sendMessage(
        session.chatId,
        `⏭️ _Buscando próximo conteúdo..._`,
        { parse_mode: "Markdown" },
      );
      await new Promise((r) => setTimeout(r, 1000));
      await sendNextContent(bot, session);
      return;
    }

    // Esgotou tentativas: informar aluno
    session._skipRetries = 0;
    await bot.sendMessage(
      session.chatId,
      `⚠️ *Estamos preparando mais questões para esta matéria.*\n\nUse /estudar novamente em breve!`,
      { parse_mode: "Markdown" },
    );
    activeSessions.delete(session.userId);
    return;
  }
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

  if (data === "resume_study") {
    await bot.answerCallbackQuery(query.id);
    await startLearningSession(bot, chatId, telegramId);
    return true;
  }

  if (!session) return false;

  // ============================================
  // B3: BOTÃO "RESPONDER QUESTÃO" - exibir questão pendente
  // ============================================
  if (data === "ready_question" && session.pendingQuestion) {
    await bot.answerCallbackQuery(query.id);

    // C1: Verificar inatividade 30min
    if (checkInactivity(session)) {
      await endSessionWithReport(bot, session, "inactivity");
      return true;
    }
    session.lastInteractionAt = new Date();

    const { alternatives, isCertoErrado, diffEmoji, statement } = session.pendingQuestion;

    // Formatar opções
    const optionsText = alternatives
      .map((alt: any) => `${alt.letter}) ${alt.text}`)
      .join("\n\n");

    // Botões com letras (Certo/Errado usa texto completo)
    const keyboard = {
      inline_keyboard: alternatives.map(
        (alt: any, idx: number) => [
          {
            text: isCertoErrado ? alt.text : `Questão ${alt.letter}`,
            callback_data: `answer_${idx}`,
          },
        ]
      ),
    };

    await bot.sendMessage(
      session.chatId,
      `✍️ *QUESTÃO ${diffEmoji}*\n\n` +
        `❓ ${statement}\n\n` +
        `───────────────\n` +
        `${optionsText}\n` +
        `───────────────\n\n` +
        `👇 *Escolha sua resposta:*`,
      {
        parse_mode: "Markdown",
        reply_markup: keyboard,
      },
    );

    session.pendingQuestion = undefined;
    session.currentStep = "waiting_answer";
    return true;
  }

  if (data.startsWith("answer_") && session.currentStep === "waiting_answer") {
    const answerIdx = parseInt(data.replace("answer_", ""));
    const isCorrect = answerIdx === session.currentQuestion.correctIndex;

    await bot.answerCallbackQuery(query.id);

    // Delay para dar tempo do usuário processar
    await new Promise((r) => setTimeout(r, 1500)); // 1,5 segundos

    // C1: Atualizar interação
    session.lastInteractionAt = new Date();

    // Incrementar contador de questões da matéria atual
    session.currentSubjectQuestions++;

    // C1: Registrar stats por matéria para relatório consolidado
    if (session.currentSubject) {
      if (!session.subjectStats[session.currentSubject]) {
        session.subjectStats[session.currentSubject] = {
          name: session.currentSubjectName || "Conteúdo",
          correct: 0,
          total: 0,
        };
      }
      session.subjectStats[session.currentSubject].total++;
      if (isCorrect) {
        session.subjectStats[session.currentSubject].correct++;
      }
    }

    if (isCorrect) {
      session.correctAnswers++;
      session.currentSubjectCorrect++;
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
        const userId = (userData[0] as any).id as string;

        // Salvar resposta na user_answers
        await db.execute(sql`
          INSERT INTO "user_answers" ("userId", "contentId", "selectedAnswer", "correct", "answeredAt")
VALUES (${userId}, ${session.currentContent.id}, ${answerIdx}, ${isCorrect}, NOW())
        `);

        console.log(
          `💾 [Learning] Resposta salva: ${telegramId} - ${isCorrect ? "✅" : "❌"}`,
        );

        // 📈 XP: incrementar totalQuestionsAnswered
        try {
          await db.execute(sql`
            UPDATE "User"
            SET "totalQuestionsAnswered" = COALESCE("totalQuestionsAnswered", 0) + 1,
                "updatedAt" = NOW()
            WHERE id = ${userId}
          `);
        } catch (_e) { /* non-fatal */ }

        // 🔥 Streak: atualizar uma vez por dia
        try {
          const today = new Date().toISOString().slice(0, 10);
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          const streakRow = await db.execute(sql`
            SELECT streak_days, best_streak, last_streak_date FROM "User" WHERE id = ${userId} LIMIT 1
          `) as any[];
          if (streakRow.length > 0) {
            const s = streakRow[0];
            if (s.last_streak_date !== today) {
              const newStreak = s.last_streak_date === yesterday ? (Number(s.streak_days) + 1) : 1;
              const newBest = Math.max(Number(s.best_streak) || 0, newStreak);
              await db.execute(sql`
                UPDATE "User" SET streak_days=${newStreak}, best_streak=${newBest},
                  last_streak_date=${today}, "updatedAt"=NOW()
                WHERE id=${userId}
              `);
              console.log(`🔥 [Streak] ${telegramId}: ${newStreak} dias`);
            }
          }
        } catch (_e) { /* non-fatal */ }

        // 🧠 SM2: upsert sm2_reviews (Drizzle — sync com painel web)
        try {
          const { calculateSM2, getQualityFromAnswer } = await import("../services/sm2-engine");
          const q = getQualityFromAnswer(isCorrect);
          const contentId = session.currentContent.id as string;
          const existing = await db.execute(sql`
            SELECT id, ease_factor, interval, repetitions FROM sm2_reviews
            WHERE user_id = ${userId} AND content_id = ${contentId} LIMIT 1
          `) as any[];
          if (existing.length > 0) {
            const s = existing[0];
            const r = calculateSM2(q, Number(s.ease_factor), Number(s.interval), Number(s.repetitions));
            await db.execute(sql`
              UPDATE sm2_reviews SET
                ease_factor=${r.easeFactor}, interval=${r.interval}, repetitions=${r.repetitions},
                next_review_date=${r.nextReviewDate.toISOString()}, last_quality=${q},
                times_correct=times_correct+${isCorrect ? 1 : 0},
                times_incorrect=times_incorrect+${isCorrect ? 0 : 1},
                total_reviews=total_reviews+1, last_reviewed_at=NOW(), updated_at=NOW()
              WHERE id=${existing[0].id}
            `);
          } else {
            const r = calculateSM2(q);
            await db.execute(sql`
              INSERT INTO sm2_reviews (user_id, content_id, ease_factor, interval, repetitions,
                next_review_date, last_quality, times_correct, times_incorrect, total_reviews,
                first_seen_at, last_reviewed_at, created_at, updated_at)
              VALUES (${userId}, ${contentId}, ${r.easeFactor}, ${r.interval}, ${r.repetitions},
                ${r.nextReviewDate.toISOString()}, ${q}, ${isCorrect ? 1 : 0}, ${isCorrect ? 0 : 1},
                1, NOW(), NOW(), NOW(), NOW())
              ON CONFLICT DO NOTHING
            `);
          }
          console.log(`🧠 [SM2 Sync] sm2_reviews atualizado: ${contentId}`);
        } catch (_e) { /* non-fatal */ }
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

    const appUrl = process.env.APP_URL || "https://passarei.com.br";
    const keyboard = {
      inline_keyboard: [
        [{ text: "✅ Próxima questão", callback_data: "next_question" }],
        [{ text: "📖 Estudar Teoria na Web", url: `${appUrl}/sala/aula?contentId=${session.currentContent.id}` }],
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

    // C1: Verificar inatividade 30min
    if (checkInactivity(session)) {
      await endSessionWithReport(bot, session, "inactivity");
      return true;
    }
    session.lastInteractionAt = new Date();

    await sendNextContent(bot, session);
    return true;
  }

  if (data === "stop_session") {
    await bot.answerCallbackQuery(query.id);
    await endSessionWithReport(bot, session, "voluntary");
    return true;
  }

  return false;
}

export { activeSessions, endSessionWithReport };
