import { db } from "../../db";
import { sql } from "drizzle-orm";
import TelegramBot from "node-telegram-bot-api";
import {
  getRandomContent,
  createOrGetUser,
  checkUserLimit,
  incrementUserCount,
  isUserActive,
} from "./database";
import {
  startOnboarding,
  handleOnboardingCallback,
  handleOnboardingMessage,
  onboardingStates,
} from "./onboarding";
import { handleLearningCallback, activeSessions, endSessionWithReport } from "./learning-session";
import { startReminderScheduler, handleReminderAnswer } from "./reminder";

const token = process.env.TELEGRAM_BOT_TOKEN || "";

const RECURSO_MOVIDO =
  "🔄 *Recurso Movido*\n\nEsta função agora é exclusiva da nossa Sala de Aula para uma melhor experiência. Acesse o site para continuar!";

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
          SELECT "examType", "onboardingCompleted", "dificuldades", "lastStudyContentIds", "totalQuestionsAnswered"
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

        // Mensagem de continuidade - usar totalQuestionsAnswered (fonte real)
        const totalAnswered = Number(profile.totalQuestionsAnswered || 0);
        if (totalAnswered > 0) {
          await bot!.sendMessage(
            chatId,
            `📚 *Continuando seus estudos para ${profile.examType}*\n` +
              `📊 ${totalAnswered} questão(ões) já respondida(s)\n\n` +
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

      if (data === "menu_planos") {
        console.log(`💳 [Bot] Menu Planos clicado por ${telegramId}`);
        const userPlan = await db.execute(sql`
          SELECT plan, "planStatus", "planEndDate"
          FROM "User" WHERE "telegramId" = ${telegramId} LIMIT 1
        `) as any[];

        const u = userPlan[0];
        const planUpper = (u?.plan || "").toUpperCase();
        const isActive = u?.planStatus === "active";
        const endDate = u?.planEndDate ? new Date(u.planEndDate).toLocaleDateString("pt-BR") : null;

        let statusText = "⚠️ Sem plano ativo";
        if (isActive && planUpper) {
          statusText = `✅ Plano *${planUpper}* ativo${endDate ? ` (até ${endDate})` : ""}`;
        }

        const keyboard = {
          inline_keyboard: [
            [{ text: "🎓 Calouro - R$ 89,90/mês", url: "https://passarei.com.br/checkout?plan=calouro" }],
            [{ text: "🏆 Veterano - R$ 44,90/mês", url: "https://passarei.com.br/checkout?plan=veterano" }],
            [{ text: "🎟️ Tenho um código", callback_data: "show_codigo_help" }],
            [{ text: "⬅️ Voltar ao menu", callback_data: "menu_main" }],
          ],
        };
        await bot!.sendMessage(
          chatId,
          `💳 *Planos - Passarei Concursos*\n\n` +
            `${statusText}\n\n` +
            `━━━━━━━━━━━━━━━━\n\n` +
            `🎓 *CALOURO* - R$ 89,90/mês\n` +
            `✅ 10 questões/dia (300/mês)\n` +
            `✅ Questões inteligentes por IA\n` +
            `✅ Relatórios de desempenho\n\n` +
            `🏆 *VETERANO* - R$ 44,90/mês\n` +
            `✅ 30 questões/dia (900/mês)\n` +
            `✅ Tudo do Calouro\n` +
            `✅ Correção de redação com IA\n` +
            `✅ Prioridade no suporte\n\n` +
            `👇 Escolha seu plano:`,
          { parse_mode: "Markdown", reply_markup: keyboard },
        );
        return;
      }

      if (data === "show_codigo_help") {
        await bot!.sendMessage(
          chatId,
          `🎟️ *Códigos Promocionais*\n\nPara resgatar um código, envie:\n\`/codigo SEUCODIGO\`\n\nExemplo: \`/codigo BETA001\``,
          { parse_mode: "Markdown" },
        );
        return;
      }

      if (data === "menu_suporte") {
        console.log(`💬 [Bot] Menu Suporte clicado por ${telegramId}`);
        const keyboard = {
          inline_keyboard: [
            [{ text: "❌ Cancelar plano", callback_data: "suporte_cancelar" }],
            [{ text: "📧 Enviar email ao suporte", url: "mailto:suporte@passarei.com.br" }],
            [{ text: "⬅️ Voltar ao menu", callback_data: "menu_main" }],
          ],
        };
        await bot!.sendMessage(
          chatId,
          `💬 *Suporte - Passarei Concursos*\n\n` +
            `Precisa de ajuda? Estamos aqui!\n\n` +
            `📧 Email: suporte@passarei.com.br\n` +
            `💬 Telegram: @PassareiSuporte\n\n` +
            `⏰ Atendimento: Seg-Sex, 9h-18h\n\n` +
            `👇 Opções:`,
          { parse_mode: "Markdown", reply_markup: keyboard },
        );
        return;
      }

      if (data === "suporte_cancelar") {
        console.log(`❌ [Bot] Cancelar plano solicitado por ${telegramId}`);
        const keyboard = {
          inline_keyboard: [
            [{ text: "✅ Sim, cancelar meu plano", callback_data: "confirmar_cancelamento" }],
            [{ text: "⬅️ Não, voltar", callback_data: "menu_main" }],
          ],
        };
        await bot!.sendMessage(
          chatId,
          `⚠️ *Cancelar Plano*\n\n` +
            `Tem certeza que deseja cancelar seu plano?\n\n` +
            `📌 Você manterá acesso até o final do período já pago.\n` +
            `📌 Reembolso disponível em até 7 dias após a compra.\n\n` +
            `Para reembolso, entre em contato: suporte@passarei.com.br`,
          { parse_mode: "Markdown", reply_markup: keyboard },
        );
        return;
      }

      if (data === "confirmar_cancelamento") {
        console.log(`🔴 [Bot] Confirmação de cancelamento por ${telegramId}`);
        try {
          await db.execute(sql`
            UPDATE "User"
            SET "planStatus" = 'cancelled', "updatedAt" = NOW()
            WHERE "telegramId" = ${telegramId}
          `);
          await bot!.sendMessage(
            chatId,
            `✅ *Plano cancelado com sucesso.*\n\n` +
              `Você manterá acesso até o final do período já pago.\n\n` +
              `Esperamos te ver de volta em breve! 🎓\n\n` +
              `Para reembolso (até 7 dias da compra), entre em contato:\n📧 suporte@passarei.com.br`,
            { parse_mode: "Markdown" },
          );
        } catch (error) {
          console.error("❌ [Bot] Erro ao cancelar plano:", error);
          await bot!.sendMessage(
            chatId,
            "⚠️ Erro ao cancelar plano. Entre em contato com suporte@passarei.com.br",
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
            "▪️ `/parar` - Encerrar sessão e ver relatório\n" +
            "▪️ `/codigo CODIGO` - Resgatar código promocional\n" +
            "▪️ `/menu` - Menu principal\n\n" +
            "🌐 *Sala de Aula (site):*\n" +
            "▪️ Redação com IA\n" +
            "▪️ Simulados\n" +
            "▪️ Progresso e desempenho\n" +
            "▪️ Troca de concurso\n\n" +
            "💬 *Suporte:*\n" +
            "📧 suporte@passarei.com.br\n" +
            "💬 @PassareiSuporte\n\n" +
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
            [{ text: "📚 Estudar", callback_data: "menu_estudar" }],
            [{ text: "🛠️ Suporte", callback_data: "menu_suporte" }],
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
      [{ text: "📚 Estudar", callback_data: "menu_estudar" }],
      [{ text: "🛠️ Suporte", callback_data: "menu_suporte" }],
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
        SELECT "examType", "onboardingCompleted", "dificuldades", "lastStudyContentIds", "totalQuestionsAnswered"
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

      // Mensagem de continuidade - usar totalQuestionsAnswered (fonte real)
      const totalAnswered2 = Number(profile.totalQuestionsAnswered || 0);
      if (totalAnswered2 > 0) {
        await bot!.sendMessage(
          chatId,
          `📚 *Continuando seus estudos para ${profile.examType}*\n` +
            `📊 ${totalAnswered2} questão(ões) já respondida(s)\n\n` +
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

  // Comandos movidos para a Sala de Aula (site) — retornam mensagem de redirecionamento
  bot.onText(/^\/(redacao|redação|cancelar|concurso|progresso)$/i, async (msg) => {
    await bot!.sendMessage(msg.chat.id, RECURSO_MOVIDO, { parse_mode: "Markdown" });
  });

  // Comando /codigo ou /código - Resgatar código promocional
  bot.onText(/\/c[oó]digo (.+)/, async (msg, match) => {
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

  // C4: Comando /parar - encerrar sessão voluntariamente com relatório
  bot.onText(/\/(parar|sair)/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = String(msg.from?.id);

    console.log(`✋ [Bot] Comando /parar de ${telegramId}`);

    const session = activeSessions.get(telegramId);
    if (session) {
      await endSessionWithReport(bot!, session, "voluntary");
    } else {
      await bot!.sendMessage(
        chatId,
        `ℹ️ Nenhuma sessão de estudo ativa.\n\nUse /estudar para começar!`,
        { parse_mode: "Markdown" },
      );
    }
  });

  // Comando /codigo sem argumento - mostrar ajuda
  bot.onText(/^\/c[oó]digo$/, async (msg) => {
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

/** Envia uma mensagem via Bot para um chatId Telegram (fire-and-forget seguro). */
export async function sendTelegramMessage(chatId: number | string, text: string): Promise<void> {
  if (!bot || !chatId) return;
  try {
    await bot.sendMessage(Number(chatId), text, { parse_mode: "Markdown" });
  } catch (err) {
    console.error("[Bot] Erro ao enviar notificação:", err);
  }
}
