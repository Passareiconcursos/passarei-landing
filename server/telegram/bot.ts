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

    await bot!.sendMessage(
      chatId,
      "📊 *Seu Progresso*\n\n" +
        "✅ Questões respondidas: Em breve\n" +
        "🎯 Taxa de acerto: Em breve\n" +
        "📚 Conteúdos estudados: Em breve\n" +
        "⭐ Sequência atual: Em breve\n\n" +
        "_Sistema de estatísticas em desenvolvimento_",
      { parse_mode: "Markdown" },
    );
  });

  // Comando /ajuda
  bot.onText(/\/ajuda/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = String(msg.from?.id);

    console.log(`❓ [Bot] Comando /ajuda de ${telegramId}`);

    await bot!.sendMessage(
      chatId,
      "❓ *Ajuda - Passarei Concursos*\n\n" +
        "📚 *Comandos disponíveis:*\n\n" +
        "▪️ `/estudar` - Iniciar sessão de estudos\n" +
        "▪️ `/progresso` - Ver suas estatísticas\n" +
        "▪️ `/ajuda` - Mostrar esta ajuda\n\n" +
        "💬 *Suporte:*\n" +
        "📧 Email: suporte@passarei.com.br\n" +
        "💬 Telegram: @PassareiSuporte\n\n" +
        "🎓 _Bons estudos!_",
      { parse_mode: "Markdown" },
    );
  });
  // Comando: /concurso
  bot.onText(/\/concurso/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from?.id.toString();

    if (!telegramId) return;

    console.log(`🎯 [Bot] Comando /concurso de ${telegramId}`);

    // Lista de concursos disponíveis
    const concursos = [
      { id: "PM-ES", nome: "Polícia Militar do Espírito Santo" },
      { id: "PC-ES", nome: "Polícia Civil do Espírito Santo" },
      { id: "PRF", nome: "Polícia Rodoviária Federal" },
      { id: "PF", nome: "Polícia Federal" },
      { id: "PCDF", nome: "Polícia Civil do Distrito Federal" },
      { id: "OUTRO", nome: "Outro concurso policial" },
    ];

    // Criar botões inline
    const keyboard = concursos.map((concurso) => [
      {
        text: concurso.nome,
        callback_data: `concurso_${concurso.id}`,
      },
    ]);

    await bot!.sendMessage(
      chatId,
      "🎯 *Escolha seu concurso:*\n\n" +
        "Selecione o concurso que você está estudando.\n" +
        "Você pode trocar a qualquer momento usando /concurso novamente.",
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: keyboard,
        },
      },
    );
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
