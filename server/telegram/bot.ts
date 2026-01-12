import { db } from "../../db";
import { sql } from "drizzle-orm";
import TelegramBot from "node-telegram-bot-api";
import {
  getRandomContent,
  createOrGetUser,
  checkUserLimit,
  incrementUserCount,
} from "./database";
import {
  startOnboarding,
  handleOnboardingCallback,
  handleOnboardingMessage,
  onboardingStates,
} from "./onboarding";
import { handleLearningCallback } from "./learning-session";

const token = process.env.TELEGRAM_BOT_TOKEN || "";
let bot: TelegramBot | null = null;

export async function startTelegramBot() {
  if (!token) return console.error("❌ Token");
  console.log("🤖 Iniciando...");
  bot = new TelegramBot(token, { polling: true });

  bot.on("callback_query", async (query) => {
    const isLearning = await handleLearningCallback(bot!, query);
    if (isLearning) return;

    await handleOnboardingCallback(bot!, query);
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

        // Conectar código ao Telegram
        const result = await connectCodeToTelegram(activationCode, telegramId);

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

    // Handler: callbacks do menu
    bot.on("callback_query", async (query) => {
      const chatId = query.message?.chat.id;
      const telegramId = query.from.id.toString();
      const data = query.data;

      if (!chatId || !data) return;

      // Responder callback (remove loading)
      await bot!.answerCallbackQuery(query.id);

      // Menu principal
      if (data === "menu_estudar") {
        // Simular comando /estudar
        await bot!.sendMessage(chatId, "/estudar");
      } else if (data === "menu_concurso") {
        // Simular comando /concurso
        await bot!.sendMessage(chatId, "/concurso");
      } else if (data === "menu_progresso") {
        // Simular comando /progresso
        await bot!.sendMessage(chatId, "/progresso");
      } else if (data === "menu_ajuda") {
        // Simular comando /ajuda
        await bot!.sendMessage(chatId, "/ajuda");
      }
    });

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

  console.log("✅ Pronto!\n");
  // Comando /estudar
  bot.onText(/\/estudar/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = String(msg.from?.id);

    console.log(`📚 [Bot] Comando /estudar recebido de ${telegramId}`);

    try {
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
        SELECT plan, "planStatus", "createdAt"
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
      const stats = await db.execute(sql`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN correct = true THEN 1 ELSE 0 END) as acertos,
          SUM(CASE WHEN correct = false THEN 1 ELSE 0 END) as erros
        FROM "user_answers"
        WHERE "userId" = ${telegramId}
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
      mensagem += `📅 Membro há: *${diasDesde} dia(s)*\n\n`;

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
  // Handler: callback dos botões de concurso
  bot.on("callback_query", async (query) => {
    const chatId = query.message?.chat.id;
    const telegramId = query.from.id.toString();
    const data = query.data;

    if (!chatId || !data) return;

    // Processar escolha de concurso
    if (data.startsWith("concurso_")) {
      const concursoId = data.replace("concurso_", "");

      console.log(
        `✅ [Bot] Concurso escolhido: ${concursoId} por ${telegramId}`,
      );

      // Salvar no banco
      try {
        await db.execute(sql`
          UPDATE "User"
          SET 
            "examType" = ${concursoId},
            "updatedAt" = NOW()
          WHERE "telegramId" = ${telegramId}
        `);

        // Confirmar escolha
        await bot!.answerCallbackQuery(query.id, {
          text: "✅ Concurso atualizado!",
        });

        await bot!.sendMessage(
          chatId,
          `✅ *Concurso atualizado!*\n\n` +
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
  });
}

export { bot };
