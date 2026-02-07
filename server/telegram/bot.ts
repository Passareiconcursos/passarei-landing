import { db } from "../../db";
import { sql } from "drizzle-orm";
import TelegramBot from "node-telegram-bot-api";
import {
  getRandomContent,
  createOrGetUser,
  checkUserLimit,
  incrementUserCount,
  isUserActive,
  generateConcursosKeyboard,
  resetStudyProgress,
} from "./database";
import {
  startOnboarding,
  handleOnboardingCallback,
  handleOnboardingMessage,
  onboardingStates,
} from "./onboarding";
import { handleLearningCallback } from "./learning-session";
import { startReminderScheduler, handleReminderAnswer } from "./reminder";

const token = process.env.TELEGRAM_BOT_TOKEN || "";
let bot: TelegramBot | null = null;

function safeParseJsonBot(value: any, fallback: any): any {
  if (!value) return fallback;
  if (typeof value === "object") return value;
  try { return JSON.parse(value); } catch { return fallback; }
}

export async function startTelegramBot() {
  if (!token) return console.error("❌ Token");
  console.log("🤖 Iniciando...");
  bot = new TelegramBot(token, { polling: true });

  // Tratar erros de polling (evita dump gigante de objetos nos logs)
  bot.on("polling_error", (error: any) => {
    const msg = error?.message || error?.code || "unknown";
    if (msg.includes("409") || msg.includes("terminated")) {
      console.log("⚠️ [Bot] Polling conflict (outra instância ativa). Aguardando...");
    } else {
      console.error("❌ [Bot] Polling error:", msg);
    }
  });

  bot.on("error", (error: any) => {
    console.error("❌ [Bot] Error:", error?.message || error?.code || "unknown");
  });

  bot.on("callback_query", async (query) => {
    const chatId = query.message?.chat.id;
    const telegramId = query.from.id.toString();
    const data = query.data;

    if (!chatId || !data) return;

    // 0. Processar respostas de lembretes
    const isReminder = await handleReminderAnswer(bot!, query);
    if (isReminder) return;

    // 1. Processar learning primeiro
    const isLearning = await handleLearningCallback(bot!, query);
    if (isLearning) return;

    // 2. Processar onboarding
    const isOnboarding = await handleOnboardingCallback(bot!, query);
    if (isOnboarding) return;

    // 3. Processar menu
    if (data.startsWith("menu_")) {
      await bot!.answerCallbackQuery(query.id);

      if (data === "menu_estudar") {
        console.log(`📚 [Bot] Menu Estudar clicado por ${telegramId}`);

        // VERIFICAR SE USUÁRIO TEM ACESSO
        const status = await isUserActive(telegramId);

        if (!status.isActive) {
          console.log(`🚫 [Bot] Usuário ${telegramId} sem acesso via menu`);
          const keyboard = {
            inline_keyboard: [
              [{ text: "🌐 Acessar passarei.com.br", url: "https://passarei.com.br" }],
              [{ text: "📊 Ver meu progresso", callback_data: "menu_progresso" }],
            ],
          };
          await bot!.sendMessage(chatId, status.message || "Acesso inativo", {
            parse_mode: "Markdown",
            reply_markup: keyboard,
          });
          return;
        }

        // VERIFICAR SE TEM PERFIL DE ESTUDO COMPLETO
        const profileResult = await db.execute(sql`
          SELECT "examType", "onboardingCompleted", "dificuldades", "lastStudyContentIds"
          FROM "User" WHERE "telegramId" = ${telegramId} LIMIT 1
        `) as any[];

        const profile = profileResult[0];
        if (!profile?.examType || !profile?.onboardingCompleted) {
          console.log(`📋 [Bot] Usuário ${telegramId} sem perfil (menu), redirecionando para onboarding`);
          const name = query.from?.first_name || "Estudante";
          await bot!.sendMessage(
            chatId,
            `📋 *Antes de estudar, vamos montar seu plano personalizado!*\n\n` +
              `São *8 perguntas rápidas* para criar seu perfil de estudos.`,
            { parse_mode: "Markdown" },
          );
          await new Promise((r) => setTimeout(r, 1500));
          await startOnboarding(bot!, chatId, telegramId, name);
          return;
        }

        // Mensagem de continuidade
        const studiedIds = safeParseJsonBot(profile.lastStudyContentIds, []);
        if (studiedIds.length > 0) {
          await bot!.sendMessage(
            chatId,
            `📚 *Continuando seus estudos para ${profile.examType}*\n` +
              `📊 ${studiedIds.length} questão(ões) já estudada(s)\n\n` +
              `Preparando nova questão...`,
            { parse_mode: "Markdown" },
          );
        }

        const { startLearningSession } = await import(
          "../telegram/learning-session"
        );
        await startLearningSession(bot!, chatId, telegramId);
        return;
      }

      if (data === "menu_concurso") {
        console.log(`🎯 [Bot] Menu Concurso clicado por ${telegramId}`);

        // VERIFICAR SE USUÁRIO TEM ACESSO
        const status = await isUserActive(telegramId);

        if (!status.isActive) {
          console.log(`🚫 [Bot] Usuário ${telegramId} sem acesso para concurso`);
          const keyboard = {
            inline_keyboard: [
              [{ text: "🌐 Acessar passarei.com.br", url: "https://passarei.com.br" }],
            ],
          };
          await bot!.sendMessage(
            chatId,
            "❌ *Você precisa de uma conta ativa para escolher concurso.*\n\nAcesse passarei.com.br para ativar sua conta!",
            {
              parse_mode: "Markdown",
              reply_markup: keyboard,
            },
          );
          return;
        }

        // Mostrar lista de concursos (dinâmico do banco)
        // Usar prefix "concurso_" para callback_data (tratado no bloco data.startsWith("concurso_"))
        const keyboard = await generateConcursosKeyboard("concurso_");
        await bot!.sendMessage(
          chatId,
          "🎯 *Escolha seu concurso:*\n\n" +
            "Selecione o concurso que você está estudando.\n" +
            "Você pode trocar a qualquer momento usando /concurso novamente.",
          {
            parse_mode: "Markdown",
            reply_markup: keyboard,
          },
        );
        return;
      }

      if (data === "menu_progresso") {
        console.log(`📊 [Bot] Menu Progresso clicado por ${telegramId}`);
        // Buscar e mostrar progresso (código do /progresso)
        try {
          const userData = await db.execute(sql`
            SELECT id, plan, "planStatus", "createdAt", "examType"
            FROM "User"
            WHERE "telegramId" = ${telegramId}
            LIMIT 1
          `);

          if (!userData || userData.length === 0) {
            await bot!.sendMessage(
              chatId,
              "❌ Usuário não encontrado. Use /start para começar.",
              { parse_mode: "Markdown" },
            );
            return;
          }

          const user = userData[0];
          const userId = user.id;

          const stats = await db.execute(sql`
            SELECT 
              COUNT(*) as total,
              SUM(CASE WHEN correct = true THEN 1 ELSE 0 END) as acertos,
              SUM(CASE WHEN correct = false THEN 1 ELSE 0 END) as erros
            FROM "user_answers"
            WHERE "userId" = ${userId}
          `);

          const total = Number(stats[0]?.total || 0);
          const acertos = Number(stats[0]?.acertos || 0);
          const erros = Number(stats[0]?.erros || 0);
          const taxaAcerto =
            total > 0 ? ((acertos / total) * 100).toFixed(1) : 0;

          const cadastro = new Date(user.createdAt);
          const hoje = new Date();
          const diasDesde = Math.floor(
            (hoje.getTime() - cadastro.getTime()) / (1000 * 60 * 60 * 24),
          );

          let emojiTaxa = "📊";
          if (Number(taxaAcerto) >= 80) emojiTaxa = "🏆";
          else if (Number(taxaAcerto) >= 60) emojiTaxa = "✅";
          else if (Number(taxaAcerto) >= 40) emojiTaxa = "⚠️";
          else if (total > 0) emojiTaxa = "📉";

          let mensagem = `📊 *Seu Progresso*\n\n`;

          const planEmoji =
            user.plan?.toLowerCase() === "veterano" ? "⭐" : "🎓";
          const planName = user.plan?.toUpperCase() || "INATIVO";
          mensagem += `${planEmoji} Plano: *${planName}*\n`;
          mensagem += `📅 Membro há: *${diasDesde} dia(s)*\n`;

          // Adicionar concurso escolhido
          if (user.examType) {
            mensagem += `🎯 Concurso: *${user.examType}*\n`;
          }
          mensagem += `\n`;

          mensagem += `📚 *Estatísticas de Estudo:*\n\n`;

          if (total === 0) {
            mensagem += `⚠️ Você ainda não respondeu nenhuma questão!\n\n`;
            mensagem += `Use /estudar para começar a praticar! 🚀`;
          } else {
            mensagem += `✅ Questões respondidas: *${total}*\n`;
            mensagem += `${emojiTaxa} Taxa de acerto: *${taxaAcerto}%*\n`;
            mensagem += `🎯 Acertos: *${acertos}*\n`;
            mensagem += `❌ Erros: *${erros}*\n\n`;

            if (Number(taxaAcerto) >= 80) {
              mensagem += `🏆 *Excelente!* Continue assim!\n`;
            } else if (Number(taxaAcerto) >= 60) {
              mensagem += `✅ *Bom trabalho!* Você está no caminho certo!\n`;
            } else if (Number(taxaAcerto) >= 40) {
              mensagem += `💪 *Continue praticando!* Você vai melhorar!\n`;
            } else {
              mensagem += `📚 *Não desista!* Revise os conteúdos e tente novamente!\n`;
            }

            mensagem += `\nUse /estudar para continuar praticando! 📖`;
          }

          await bot!.sendMessage(chatId, mensagem, { parse_mode: "Markdown" });
        } catch (error) {
          console.error("❌ [Bot] Erro ao buscar progresso:", error);
          await bot!.sendMessage(
            chatId,
            "⚠️ Erro ao buscar seu progresso. Tente novamente em instantes.",
            { parse_mode: "Markdown" },
          );
        }
        return;
      }

      if (data === "menu_ajuda") {
        console.log(`❓ [Bot] Menu Ajuda clicado por ${telegramId}`);
        await bot!.sendMessage(
          chatId,
          "❓ *Ajuda - Passarei Concursos*\n\n" +
            "📚 *Comandos disponíveis:*\n\n" +
            "▪️ `/estudar` - Iniciar sessão de estudos\n" +
            "▪️ `/concurso` - Escolher concurso\n" +
            "▪️ `/progresso` - Ver suas estatísticas\n" +
            "▪️ `/menu` - Menu principal\n" +
            "▪️ `/ajuda` - Mostrar esta ajuda\n\n" +
            "💬 *Suporte:*\n" +
            "📧 Email: suporte@passarei.com.br\n" +
            "💬 Telegram: @PassareiSuporte\n\n" +
            "🎓 _Bons estudos!_",
          { parse_mode: "Markdown" },
        );
        return;
      }

      if (data === "menu_main") {
        console.log(`📋 [Bot] Menu principal via botão por ${telegramId}`);
        const userInfo = await db.execute(sql`
          SELECT plan, "planStatus"
          FROM "User" WHERE "telegramId" = ${telegramId} LIMIT 1
        `) as any[];

        const hasActive = userInfo?.[0]?.planStatus === "active";
        const planName = userInfo?.[0]?.plan?.toUpperCase() || "INATIVO";
        const planInfo = hasActive ? `✅ Plano ${planName} ativo` : `⚠️ Plano inativo`;

        const keyboard = {
          inline_keyboard: [
            [
              { text: "📚 Estudar", callback_data: "menu_estudar" },
              { text: "🎯 Escolher Concurso", callback_data: "menu_concurso" },
            ],
            [
              { text: "📊 Meu Progresso", callback_data: "menu_progresso" },
              { text: "❓ Ajuda", callback_data: "menu_ajuda" },
            ],
          ],
        };
        await bot!.sendMessage(
          chatId,
          `📋 *Menu Principal - Passarei*\n\n${planInfo}\n\nEscolha uma opção abaixo:`,
          { parse_mode: "Markdown", reply_markup: keyboard },
        );
        return;
      }
    }

    // 4. Processar concurso
    if (data.startsWith("concurso_")) {
      // VERIFICAR SE USUÁRIO TEM ACESSO
      const status = await isUserActive(telegramId);

      if (!status.isActive) {
        await bot!.answerCallbackQuery(query.id, {
          text: "❌ Conta inativa",
          show_alert: true,
        });
        return;
      }

      const concursoId = data.replace("concurso_", "");
      console.log(
        `🎯 [Bot] Concurso escolhido: ${concursoId} por ${telegramId}`,
      );

      try {
        // Verificar se já tem um concurso diferente (pedir confirmação)
        const currentUser = await db.execute(sql`
          SELECT "examType" FROM "User" WHERE "telegramId" = ${telegramId} LIMIT 1
        `) as any[];

        const currentExam = currentUser[0]?.examType;

        if (currentExam && currentExam !== concursoId && currentExam !== "OUTRO") {
          // Já tem concurso diferente - pedir confirmação
          await bot!.answerCallbackQuery(query.id);
          const keyboard = {
            inline_keyboard: [
              [{ text: "✅ Sim, trocar de concurso", callback_data: `confirmconcurso_${concursoId}` }],
              [{ text: "❌ Cancelar", callback_data: "cancelconcurso" }],
            ],
          };
          await bot!.sendMessage(
            chatId,
            `⚠️ *Atenção!*\n\n` +
              `Você está estudando para *${currentExam}*.\n\n` +
              `Ao trocar para *${concursoId}*, seu progresso de estudo será *reiniciado*.\n\n` +
              `Deseja continuar?`,
            { parse_mode: "Markdown", reply_markup: keyboard },
          );
          return;
        }

        // Primeiro concurso ou mesmo concurso - aplicar direto
        await db.execute(sql`
          UPDATE "User"
          SET
            "examType" = ${concursoId},
            "updatedAt" = NOW()
          WHERE "telegramId" = ${telegramId}
        `);

        await resetStudyProgress(telegramId);

        await bot!.answerCallbackQuery(query.id, {
          text: "✅ Concurso atualizado!",
        });

        await bot!.sendMessage(
          chatId,
          `✅ *Concurso definido!*\n\n` +
            `Agora você está estudando para: *${concursoId}*\n\n` +
            `Use /estudar para começar a praticar questões! 📚`,
          { parse_mode: "Markdown" },
        );
      } catch (error) {
        console.error("❌ Erro ao salvar concurso:", error);
        await bot!.answerCallbackQuery(query.id, {
          text: "❌ Erro ao atualizar",
        });
      }
    }

    // 5. Confirmar troca de concurso
    if (data.startsWith("confirmconcurso_")) {
      const concursoId = data.replace("confirmconcurso_", "");
      console.log(`✅ [Bot] Troca de concurso confirmada: ${concursoId} por ${telegramId}`);

      try {
        await db.execute(sql`
          UPDATE "User"
          SET
            "examType" = ${concursoId},
            "updatedAt" = NOW()
          WHERE "telegramId" = ${telegramId}
        `);

        await resetStudyProgress(telegramId);

        await bot!.answerCallbackQuery(query.id, {
          text: "✅ Concurso atualizado!",
        });

        await bot!.sendMessage(
          chatId,
          `✅ *Concurso atualizado!*\n\n` +
            `Agora você está estudando para: *${concursoId}*\n\n` +
            `🔄 Seu progresso anterior foi reiniciado.\n\n` +
            `Use /estudar para começar a praticar questões! 📚`,
          { parse_mode: "Markdown" },
        );
      } catch (error) {
        console.error("❌ Erro ao confirmar troca de concurso:", error);
        await bot!.answerCallbackQuery(query.id, {
          text: "❌ Erro ao atualizar",
        });
      }
    }

    if (data === "cancelconcurso") {
      await bot!.answerCallbackQuery(query.id, {
        text: "Troca cancelada",
      });
      await bot!.sendMessage(
        chatId,
        `👍 *Tudo certo!* Você continua no mesmo concurso.\n\nUse /estudar para continuar estudando! 📚`,
        { parse_mode: "Markdown" },
      );
    }
  });

  bot.onText(/\/start(.*)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const name = msg.from?.first_name || "Usuário";
    const telegramId = String(msg.from?.id);

    // Verificar se tem código de ativação
    const activationCode = match?.[1]?.trim();

    if (activationCode) {
      // /start com código → Ativar conta
      console.log(
        `🔑 [Bot] Código recebido: ${activationCode} do usuário ${telegramId}`,
      );

      try {
        // Importar função de ativação
        const { connectCodeToTelegram, getUserByTelegramId } = await import(
          "../activation/codes"
        );

        console.log(`🔍 [Bot] Tentando conectar código: ${activationCode}`);
        console.log(`🔍 [Bot] Telegram ID: ${telegramId}`);

        // Conectar código ao Telegram
        const result = await connectCodeToTelegram(activationCode, telegramId);

        console.log(`📊 [Bot] Resultado:`, JSON.stringify(result, null, 2));

        if (result.success && result.user) {
          const { user } = result;

          // Mensagem de boas-vindas personalizada
          const planEmoji =
            user.plan?.toLowerCase() === "veterano" ? "⭐" : "🎓";
          const planName =
            user.plan?.toLowerCase() === "veterano" ? "VETERANO" : "CALOURO";

          await bot!.sendMessage(
            chatId,
            `🎉 *Conta ativada com sucesso!*\n\n` +
              `${planEmoji} *Plano ${planName}* ativado!\n\n` +
              `📧 Email: ${user.email}\n` +
              `🔑 Código: ${activationCode}\n\n` +
              `Agora você tem acesso completo ao Passarei! 🚀\n\n` +
              `Use os comandos abaixo para começar:`,
            { parse_mode: "Markdown" },
          );

          // Criar usuário no sistema do bot (se não existir)
          await createOrGetUser(telegramId, name);

          // NÃO iniciar onboarding - usuário já tem plano ativo!
          // O onboarding é para usuários grátis (21 questões)
          // Usuário pagante vai direto usar o bot

          console.log(
            `✅ [Bot] Usuário ${telegramId} com plano ${user.plan} não precisa de onboarding`,
          );
          // Enviar menu de comandos disponíveis
          await bot!.sendMessage(
            chatId,
            `📚 *Comandos disponíveis:*\n\n` +
              `/estudar - Iniciar sessão de estudos\n` +
              `/progresso - Ver seu progresso\n` +
              `/ajuda - Ajuda e suporte\n\n` +
              `Digite /estudar para começar! 🚀`,
            { parse_mode: "Markdown" },
          );

          console.log(`✅ [Bot] Usuário ${telegramId} ativado com sucesso!`);
        } else {
          // Código inválido
          await bot!.sendMessage(
            chatId,
            `❌ *Código de ativação inválido*\n\n` +
              `O código \`${activationCode}\` não foi encontrado ou já foi usado.\n\n` +
              `Por favor, verifique o código no email que você recebeu ou entre em contato com o suporte.`,
            { parse_mode: "Markdown" },
          );

          console.log(`❌ [Bot] Código inválido: ${activationCode}`);
        }
      } catch (error) {
        console.error("❌ [Bot] Erro ao ativar código:", error);

        await bot!.sendMessage(
          chatId,
          `⚠️ *Erro ao processar código*\n\n` +
            `Ocorreu um erro ao ativar seu código. Por favor, tente novamente em alguns instantes.\n\n` +
            `Se o problema persistir, entre em contato com o suporte.`,
          { parse_mode: "Markdown" },
        );
      }
    } else {
      // /start normal → Onboarding
      console.log(`👋 [Bot] Novo usuário: ${telegramId}`);
      await createOrGetUser(telegramId, name);
      await startOnboarding(bot!, chatId, telegramId, name);
    }
  });

  // Comando: /menu - Menu principal com botões
  bot.onText(/\/menu/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from?.id.toString();

    if (!telegramId) return;

    console.log(`📋 [Bot] Comando /menu de ${telegramId}`);

    // Verificar se usuário tem plano ativo
    const user = await db.execute(sql`
      SELECT plan, "planStatus" 
      FROM "User" 
      WHERE "telegramId" = ${telegramId}
      LIMIT 1
    `);

    const hasActivePlan =
      user && user.length > 0 && user[0].planStatus === "active";

    // Menu com botões inline
    const keyboard = [
      [
        { text: "📚 Estudar", callback_data: "menu_estudar" },
        { text: "🎯 Escolher Concurso", callback_data: "menu_concurso" },
      ],
      [
        { text: "📊 Meu Progresso", callback_data: "menu_progresso" },
        { text: "❓ Ajuda", callback_data: "menu_ajuda" },
      ],
    ];

    const planInfo = hasActivePlan
      ? `✅ Plano ${user[0].plan?.toUpperCase()} ativo`
      : `⚠️ Plano inativo - Ative seu plano!`;

    await bot!.sendMessage(
      chatId,
      `📋 *Menu Principal - Passarei*\n\n` +
        `${planInfo}\n\n` +
        `Escolha uma opção abaixo:`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: keyboard,
        },
      },
    );
  });

  bot.on("message", async (msg) => {
    const telegramId = String(msg.from?.id);

    if (onboardingStates.has(telegramId)) {
      await handleOnboardingMessage(bot!, msg);
      return;
    }

    if (msg.text?.startsWith("/")) return;

    const text = msg.text?.toLowerCase() || "";
    if (["oi", "olá", "ola"].includes(text)) {
      const chatId = msg.chat.id;
      const name = msg.from?.first_name || "Usuário";
      await createOrGetUser(telegramId, name);
      await startOnboarding(bot!, chatId, telegramId, name);
    }
  });

  // Iniciar scheduler de lembretes de estudo
  startReminderScheduler(bot);

  console.log("✅ Pronto!\n");
  // Comando /estudar
  bot.onText(/\/estudar/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = String(msg.from?.id);

    console.log(`📚 [Bot] Comando /estudar recebido de ${telegramId}`);

    try {
      // VERIFICAR SE USUÁRIO TEM ACESSO
      const status = await isUserActive(telegramId);

      if (!status.isActive) {
        console.log(`🚫 [Bot] Usuário ${telegramId} sem acesso: ${status.reason}`);
        const keyboard = {
          inline_keyboard: [
            [{ text: "🌐 Acessar passarei.com.br", url: "https://passarei.com.br" }],
            [{ text: "📊 Ver meu progresso", callback_data: "menu_progresso" }],
          ],
        };
        await bot!.sendMessage(chatId, status.message || "Acesso inativo", {
          parse_mode: "Markdown",
          reply_markup: keyboard,
        });
        return;
      }

      // VERIFICAR SE TEM PERFIL DE ESTUDO COMPLETO
      const profileResult = await db.execute(sql`
        SELECT "examType", "onboardingCompleted", "dificuldades", "lastStudyContentIds"
        FROM "User" WHERE "telegramId" = ${telegramId} LIMIT 1
      `) as any[];

      const profile = profileResult[0];
      if (!profile?.examType || !profile?.onboardingCompleted) {
        console.log(`📋 [Bot] Usuário ${telegramId} sem perfil, redirecionando para onboarding`);
        const name = msg.from?.first_name || "Estudante";
        await bot!.sendMessage(
          chatId,
          `📋 *Antes de estudar, vamos montar seu plano personalizado!*\n\n` +
            `São *8 perguntas rápidas* para criar seu perfil de estudos.`,
          { parse_mode: "Markdown" },
        );
        await new Promise((r) => setTimeout(r, 1500));
        await startOnboarding(bot!, chatId, telegramId, name);
        return;
      }

      // Mensagem de continuidade
      const studiedIds = safeParseJsonBot(profile.lastStudyContentIds, []);
      if (studiedIds.length > 0) {
        await bot!.sendMessage(
          chatId,
          `📚 *Continuando seus estudos para ${profile.examType}*\n` +
            `📊 ${studiedIds.length} questão(ões) já estudada(s)\n\n` +
            `Preparando nova questão...`,
          { parse_mode: "Markdown" },
        );
      }

      const { startLearningSession } = await import("./learning-session");
      await startLearningSession(bot!, chatId, telegramId);
    } catch (error: any) {
      console.error("❌ [Bot] Erro ao iniciar sessão:", error.message);
      await bot!.sendMessage(
        chatId,
        "❌ Erro ao iniciar sessão de estudos. Tente novamente em instantes.",
        { parse_mode: "Markdown" },
      );
    }
  });

  // Comando /progresso
  bot.onText(/\/progresso/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = String(msg.from?.id);

    console.log(`📊 [Bot] Comando /progresso de ${telegramId}`);

    try {
      // Buscar dados do usuário
      const userData = await db.execute(sql`
          SELECT id, plan, "planStatus", "createdAt", "examType",
            "cargo", "facilidades", "dificuldades", "lastStudyContentIds"
          FROM "User"
          WHERE "telegramId" = ${telegramId}
          LIMIT 1
        `);

      if (!userData || userData.length === 0) {
        await bot!.sendMessage(
          chatId,
          "❌ Usuário não encontrado. Use /start para começar.",
          { parse_mode: "Markdown" },
        );
        return;
      }

      const user = userData[0];

      // Buscar estatísticas de respostas
      const userId = user.id; // ← ADICIONAR ANTES

      const stats = await db.execute(sql`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN correct = true THEN 1 ELSE 0 END) as acertos,
          SUM(CASE WHEN correct = false THEN 1 ELSE 0 END) as erros
        FROM "user_answers"
        WHERE "userId" = ${userId}
      `);

      const total = Number(stats[0]?.total || 0);
      const acertos = Number(stats[0]?.acertos || 0);
      const erros = Number(stats[0]?.erros || 0);
      const taxaAcerto = total > 0 ? ((acertos / total) * 100).toFixed(1) : 0;

      // Calcular dias desde cadastro (streak simplificado)
      const cadastro = new Date(user.createdAt);
      const hoje = new Date();
      const diasDesde = Math.floor(
        (hoje.getTime() - cadastro.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Emoji da taxa de acerto
      let emojiTaxa = "📊";
      if (Number(taxaAcerto) >= 80) emojiTaxa = "🏆";
      else if (Number(taxaAcerto) >= 60) emojiTaxa = "✅";
      else if (Number(taxaAcerto) >= 40) emojiTaxa = "⚠️";
      else if (total > 0) emojiTaxa = "📉";

      // Mensagem de progresso
      let mensagem = `📊 *Seu Progresso*\n\n`;

      // Status do plano
      const planEmoji = user.plan?.toLowerCase() === "veterano" ? "⭐" : "🎓";
      const planName = user.plan?.toUpperCase() || "INATIVO";
      mensagem += `${planEmoji} Plano: *${planName}*\n`;
      mensagem += `📅 Membro há: *${diasDesde} dia(s)*\n`;

      // Adicionar concurso e cargo
      if (user.examType) {
        mensagem += `🎯 Concurso: *${user.examType}*\n`;
      }
      if (user.cargo) {
        mensagem += `💼 Cargo: *${user.cargo}*\n`;
      }
      mensagem += `\n`;

      // Pontos fortes e fracos
      const facilidades = safeParseJsonBot(user.facilidades, []);
      const dificuldades = safeParseJsonBot(user.dificuldades, []);

      if (facilidades.length > 0 || dificuldades.length > 0) {
        mensagem += `🧠 *Seu Perfil de Estudos:*\n`;
        if (facilidades.length > 0) {
          mensagem += `✅ Pontos fortes: ${facilidades.join(", ")}\n`;
        }
        if (dificuldades.length > 0) {
          mensagem += `🔴 Precisa reforçar: ${dificuldades.join(", ")}\n`;
        }
        mensagem += `\n`;
      }

      // Estatísticas
      mensagem += `📚 *Estatísticas de Estudo:*\n\n`;

      if (total === 0) {
        mensagem += `⚠️ Você ainda não respondeu nenhuma questão!\n\n`;
        mensagem += `Use /estudar para começar a praticar! 🚀`;
      } else {
        mensagem += `✅ Questões respondidas: *${total}*\n`;
        mensagem += `${emojiTaxa} Taxa de acerto: *${taxaAcerto}%*\n`;
        mensagem += `🎯 Acertos: *${acertos}*\n`;
        mensagem += `❌ Erros: *${erros}*\n\n`;

        // Motivação baseada na taxa
        if (Number(taxaAcerto) >= 80) {
          mensagem += `🏆 *Excelente!* Continue assim!\n`;
        } else if (Number(taxaAcerto) >= 60) {
          mensagem += `✅ *Bom trabalho!* Você está no caminho certo!\n`;
        } else if (Number(taxaAcerto) >= 40) {
          mensagem += `💪 *Continue praticando!* Você vai melhorar!\n`;
        } else {
          mensagem += `📚 *Não desista!* Revise os conteúdos e tente novamente!\n`;
        }

        mensagem += `\nUse /estudar para continuar praticando! 📖`;
      }

      await bot!.sendMessage(chatId, mensagem, { parse_mode: "Markdown" });
    } catch (error) {
      console.error("❌ [Bot] Erro ao buscar progresso:", error);
      await bot!.sendMessage(
        chatId,
        "⚠️ Erro ao buscar seu progresso. Tente novamente em instantes.",
        { parse_mode: "Markdown" },
      );
    }
  });

  // Comando /codigo - Resgatar código promocional
  bot.onText(/\/codigo (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const telegramId = String(msg.from?.id);
    const code = match?.[1]?.trim().toUpperCase();

    if (!code) {
      await bot!.sendMessage(
        chatId,
        "❌ *Código não informado.*\n\nUse: `/codigo SEUCODIGO`",
        { parse_mode: "Markdown" },
      );
      return;
    }

    console.log(`🎟️ [Bot] Comando /codigo ${code} de ${telegramId}`);

    try {
      // Chamar API interna (mesmo processo) via localhost
      const INTERNAL_URL = `http://localhost:${process.env.PORT || 5000}`;
      const response = await fetch(`${INTERNAL_URL}/api/promo-codes/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, telegramId }),
      });

      const result = await response.json();

      if (result.success) {
        let mensagem = `✅ *Código Resgatado!*\n\n`;
        mensagem += result.message + "\n\n";

        if (result.type === "GRATUITY") {
          mensagem += `🎉 Seu plano *${result.grantedPlan}* foi ativado por *${result.grantedDays} dias*!`;
          await bot!.sendMessage(chatId, mensagem, { parse_mode: "Markdown" });

          // Verificar se precisa de onboarding antes de estudar
          const profileCheck = await db.execute(sql`
            SELECT "examType", "onboardingCompleted"
            FROM "User" WHERE "telegramId" = ${telegramId} LIMIT 1
          `) as any[];

          const userProfile = profileCheck[0];
          if (!userProfile?.examType || !userProfile?.onboardingCompleted) {
            console.log(`📋 [Bot] Usuário ${telegramId} ativou código mas sem perfil, iniciando onboarding`);
            await new Promise((r) => setTimeout(r, 2000));
            await bot!.sendMessage(
              chatId,
              `📋 *Agora vamos montar seu plano de estudos!*\n\n` +
                `São *8 perguntas rápidas* para personalizar sua experiência.`,
              { parse_mode: "Markdown" },
            );
            await new Promise((r) => setTimeout(r, 1500));
            const name = msg.from?.first_name || "Estudante";
            await startOnboarding(bot!, chatId, telegramId, name);
          } else {
            await new Promise((r) => setTimeout(r, 1000));
            const keyboard = {
              inline_keyboard: [
                [{ text: "📚 Começar a estudar", callback_data: "menu_estudar" }],
                [{ text: "📊 Ver meu progresso", callback_data: "menu_progresso" }],
              ],
            };
            await bot!.sendMessage(
              chatId,
              `Pronto para estudar? 🚀`,
              { parse_mode: "Markdown", reply_markup: keyboard },
            );
          }
        } else if (result.type === "DISCOUNT") {
          mensagem += `💰 Use este desconto ao fazer sua assinatura no site!`;
          await bot!.sendMessage(chatId, mensagem, { parse_mode: "Markdown" });
        }
      } else {
        await bot!.sendMessage(
          chatId,
          `❌ *Erro ao resgatar código.*\n\n${result.error || "Código inválido ou expirado."}`,
          { parse_mode: "Markdown" },
        );
      }
    } catch (error) {
      console.error("❌ [Bot] Erro ao resgatar código:", error);
      await bot!.sendMessage(
        chatId,
        "⚠️ Erro ao processar seu código. Tente novamente em instantes.",
        { parse_mode: "Markdown" },
      );
    }
  });

  // Comando /codigo sem argumento - mostrar ajuda
  bot.onText(/^\/codigo$/, async (msg) => {
    const chatId = msg.chat.id;
    await bot!.sendMessage(
      chatId,
      "🎟️ *Códigos Promocionais*\n\n" +
        "Para resgatar um código, use:\n" +
        "`/codigo SEUCODIGO`\n\n" +
        "Exemplo: `/codigo BETA2026`",
      { parse_mode: "Markdown" },
    );
  });
}
export { bot };
