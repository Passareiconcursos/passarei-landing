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
  getMnemonicForContent,
} from "./database";
import { generateEnhancedContent } from "./ai-service";
import { activeSessions } from "./learning-session";
import { db } from "../../db";
import { sql } from "drizzle-orm";

// Intervalo do scheduler: verificar a cada 30 minutos
const CHECK_INTERVAL_MS = 30 * 60 * 1000;

// Tempo mínimo de inatividade para enviar lembrete (15 minutos)
const ACTIVITY_THRESHOLD_MS = 15 * 60 * 1000;

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

// Artigos corretos para cada concurso (gênero gramatical)
const ARTIGO_CONCURSO: Record<string, string> = {
  PF: "a",
  PRF: "a",
  PMERJ: "a",
  PCERJ: "a",
  PMSP: "a",
  PCESP: "a",
  PM: "a",
  PC: "a",
  CBM: "o",
  PP: "a",
  PP_FEDERAL: "a",
  PL_FEDERAL: "a",
  PJ_CNJ: "a",
  ABIN: "a",
  EXERCITO: "o",
  MARINHA: "a",
  AERONAUTICA: "a",
  DEPEN: "o",
  SEAP: "a",
  GM: "a",
  OUTRO: "o",
};

function getArtigoConcurso(examType: string): string {
  return ARTIGO_CONCURSO[examType] || "o";
}

/**
 * Extrai seções estruturadas do textContent (mesma lógica do learning-session)
 */
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

  const keyPointsMatch = rest.match(
    /PONTOS-CHAVE:\n([\s\S]*?)(?=\n\nEXEMPLO:|\nEXEMPLO:)/,
  );
  const exampleMatch = rest.match(
    /EXEMPLO:\n([\s\S]*?)(?=\n\nDICA:|\nDICA:)/,
  );
  const tipMatch = rest.match(/DICA:\n([\s\S]*?)$/);

  return {
    definition,
    keyPoints: keyPointsMatch ? keyPointsMatch[1].trim() : null,
    example: exampleMatch ? exampleMatch[1].trim() : null,
    tip: tipMatch ? tipMatch[1].trim() : null,
  };
}

/**
 * Normaliza alternativas da questão para formato { letter, text }
 * Aceita: string[], {letter,text}[], JSON string
 */
function normalizeAlternatives(
  raw: any,
): { letter: string; text: string }[] {
  let arr = raw;

  // Se é string, tentar parsear como JSON
  if (typeof arr === "string") {
    try {
      arr = JSON.parse(arr);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(arr)) return [];

  return arr
    .map((alt: any, idx: number) => {
      const letter = String.fromCharCode(65 + idx); // A, B, C, D
      if (typeof alt === "string") {
        return { letter, text: alt };
      }
      if (alt && typeof alt === "object") {
        return {
          letter: alt.letter || letter,
          text: alt.text || String(alt),
        };
      }
      return { letter, text: String(alt) };
    })
    .filter((alt) => alt.text && alt.text !== "undefined");
}

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
        // Verificar deduplicação no banco
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

        // FIX 0.5: Verificar se o usuário está ativo recentemente (últimos 15 min)
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
 * Envia conteúdo proativo para o aluno (continua de onde parou)
 */
async function sendProactiveContent(
  bot: TelegramBot,
  user: any,
  accessReason: string,
  currentHour: number,
) {
  const chatId = parseInt(user.telegramId);
  const turno =
    currentHour <= 11 ? "Manhã" : currentHour <= 17 ? "Tarde" : "Noite";

  try {
    // 1. Mensagem de lembrete (com artigo correto de gênero)
    const greetings: Record<string, string> = {
      Manhã: "Bom dia",
      Tarde: "Boa tarde",
      Noite: "Boa noite",
    };

    const examType = user.examType || "concurso";
    const artigo = getArtigoConcurso(examType);

    await bot.sendMessage(
      chatId,
      `${greetings[turno]}! Hora de estudar para ${artigo} *${examType}*` +
        `${accessReason === "free_first_day" ? "\n🎁 Usando questão grátis!" : ""}\n\n` +
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

    // 4. Enviar conteúdo (FIX 0.6: usar parseTextContent para evitar duplicação)
    const title = content.title || "Conteúdo";
    const rawText =
      content.textContent || content.definition || content.description || "";

    // Buscar nome do subject
    let subjectName = "Conteúdo";
    if (content.subjectId) {
      try {
        const subjectResult = (await db.execute(sql`
          SELECT "displayName" FROM "Subject" WHERE id = ${content.subjectId}
        `)) as any[];
        subjectName = subjectResult[0]?.displayName || "Conteúdo";
      } catch (e) {
        // ignore
      }
    }

    // FIX 0.6: Verificar se o conteúdo já tem seções estruturadas
    const parsed = parseTextContent(rawText);
    let keyPoints: string;
    let example: string;
    let tip: string;
    let definition: string;

    if (parsed.keyPoints && parsed.example && parsed.tip) {
      // Conteúdo já enriquecido - usar seções do parse (sem IA)
      definition = parsed.definition;
      keyPoints = parsed.keyPoints;
      example = parsed.example;
      tip = parsed.tip;
    } else {
      // Conteúdo sem seções - gerar com IA ou smart fallback
      definition = rawText;
      const enhanced = await generateEnhancedContent(
        title,
        rawText,
        user.examType || "PF",
      );
      keyPoints = enhanced.keyPoints;
      example = enhanced.example;
      tip = enhanced.tip;
    }

    // Buscar mnemônico relevante
    const mnemonic = content.subjectId
      ? await getMnemonicForContent(content.subjectId, title, definition)
      : null;

    const mnemonicBlock = mnemonic
      ? `\n\n🧠 *MACETE: ${mnemonic.mnemonic}*\n${mnemonic.meaning}\n📎 _${mnemonic.article}_`
      : "";

    await bot.sendMessage(
      chatId,
      `📚 *${subjectName.toUpperCase()}*\n\n` +
        `🎯 *${title}*\n\n` +
        `📖 ${definition}\n\n` +
        `✅ *Pontos-chave:*\n${keyPoints}${mnemonicBlock}\n\n` +
        `💡 *Exemplo:* ${example}\n\n` +
        `🎯 *Dica:* ${tip}`,
      { parse_mode: "Markdown" },
    );

    await new Promise((r) => setTimeout(r, 3000));

    // 5. Enviar questão (FIX 0.7: normalizar alternatives + callback curto)
    const realQuestion = content.subjectId
      ? await getQuestionForSubject(content.subjectId, [])
      : null;

    if (realQuestion) {
      const alternatives = normalizeAlternatives(realQuestion.alternatives);

      // Validar que temos alternativas válidas
      if (alternatives.length < 2) {
        console.warn(
          `⚠️ [Reminder] Questão ${realQuestion.id} tem ${alternatives.length} alternativas, pulando`,
        );
        const keyboard = {
          inline_keyboard: [
            [
              {
                text: "📚 Iniciar sessão de estudos",
                callback_data: "menu_estudar",
              },
            ],
          ],
        };
        await bot.sendMessage(
          chatId,
          `💪 Revise o conteúdo acima e inicie uma sessão completa!`,
          { parse_mode: "Markdown", reply_markup: keyboard },
        );
        return;
      }

      // FIX 0.7: Armazenar questão no Map e usar callback_data curto
      pendingReminderQuestions.set(user.telegramId, {
        questionId: realQuestion.id,
        contentId: content.id,
        alternatives,
        correctAnswer: realQuestion.correctAnswer,
      });

      const isCertoErrado = realQuestion.questionType === "CERTO_ERRADO";

      const optionsText = alternatives
        .map((alt) => `${alt.letter}) ${alt.text}`)
        .join("\n\n");

      // callback_data curto: "rem_0", "rem_1", etc. (máx 5 bytes)
      const keyboard = {
        inline_keyboard: [
          ...alternatives.map((alt, idx) => [
            {
              text: isCertoErrado ? alt.text : `${alt.letter}) ${alt.text.substring(0, 30)}`,
              callback_data: `rem_${idx}`,
            },
          ]),
          [
            {
              text: "📚 Continuar estudando",
              callback_data: "menu_estudar",
            },
          ],
        ],
      };

      const diffEmoji =
        realQuestion.difficulty === "FACIL"
          ? "🟢"
          : realQuestion.difficulty === "MEDIO"
            ? "🟡"
            : "🔴";

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
          [
            {
              text: "📚 Iniciar sessão de estudos",
              callback_data: "menu_estudar",
            },
          ],
        ],
      };

      await bot.sendMessage(
        chatId,
        `💪 Revise o conteúdo acima e quando estiver pronto, inicie uma sessão completa!`,
        { parse_mode: "Markdown", reply_markup: keyboard },
      );
    }

    // 6. Salvar progresso (adicionar este contentId aos já vistos)
    const updatedContentIds = [
      ...(user.lastStudyContentIds || []),
      content.id,
    ];
    // Manter no máximo 200 IDs (evitar crescimento infinito)
    const trimmedIds = updatedContentIds.slice(-200);
    await saveStudyProgress(user.telegramId, trimmedIds);

    console.log(
      `✅ [Reminder] Conteúdo enviado para ${user.telegramId}: ${title}`,
    );
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
 * Busca conteúdo inteligente para o lembrete
 * Continua de onde o aluno parou (evita conteúdos já vistos)
 * Prioriza: dificuldades (70%) > facilidades (30%)
 */
async function getSmartReminderContent(user: any): Promise<any | null> {
  try {
    const usedIds = user.lastStudyContentIds || [];
    const usedIdsClause =
      usedIds.length > 0
        ? sql`AND c."id" NOT IN (${sql.join(
            usedIds.map((id: string) => sql`${id}`),
            sql`, `,
          )})`
        : sql``;

    // D1: Excluir conteúdos REJEITADOS pelo Professor Revisor
    const reviewClause = sql`AND (c."reviewStatus" IS NULL OR c."reviewStatus" != 'REJEITADO')`;
    // 1. Priorizar matérias de dificuldade (70% das vezes)
    const shouldPrioritizeDifficulty = Math.random() < 0.7;

    if (
      shouldPrioritizeDifficulty &&
      user.dificuldades &&
      user.dificuldades.length > 0
    ) {
      const result = (await db.execute(sql`
        SELECT c.* FROM "Content" c
        JOIN "Subject" s ON c."subjectId" = s.id
        WHERE s."displayName" IN (${sql.join(
          user.dificuldades.map((d: string) => sql`${d}`),
          sql`, `,
        )})
          AND c."isActive" = true
          ${usedIdsClause}
          ${reviewClause}

        ORDER BY RANDOM()
        LIMIT 1
      `)) as any[];

      if (result.length > 0) return result[0];
    }

    // 2. Tentar facilidades
    if (user.facilidades && user.facilidades.length > 0) {
      const result = (await db.execute(sql`
        SELECT c.* FROM "Content" c
        JOIN "Subject" s ON c."subjectId" = s.id
        WHERE s."displayName" IN (${sql.join(
          user.facilidades.map((f: string) => sql`${f}`),
          sql`, `,
        )})
          AND c."isActive" = true
          ${usedIdsClause}
          ${reviewClause}

        ORDER BY RANDOM()
        LIMIT 1
      `)) as any[];

      if (result.length > 0) return result[0];
    }

    // 3. Fallback: qualquer conteúdo (exceto rejeitados)
    // Nota: usedIdsClause usa alias "c." mas fallback não usa alias - reconstruir sem alias
    const usedIdsFallback =
      usedIds.length > 0
        ? sql`AND "id" NOT IN (${sql.join(
            usedIds.map((id: string) => sql`${id}`),
            sql`, `,
          )})`
        : sql``;

    const result = (await db.execute(sql`
      SELECT * FROM "Content"
      WHERE "isActive" = true
        AND ("reviewStatus" IS NULL OR "reviewStatus" != 'REJEITADO')
        ${usedIdsFallback}
      ORDER BY RANDOM()
      LIMIT 1
    `)) as any[];

    if (result.length > 0) return result[0];

    // 4. Se todos já foram vistos, resetar e pegar qualquer um (exceto rejeitados)
    const fallback = (await db.execute(sql`
      SELECT * FROM "Content"
      WHERE "isActive" = true
        AND ("reviewStatus" IS NULL OR "reviewStatus" != 'REJEITADO')
      ORDER BY RANDOM()
      LIMIT 1
    `)) as any[];

    return fallback[0] || null;
  } catch (error) {
    console.error("❌ [Reminder] Erro ao buscar conteúdo:", error);
    return null;
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
