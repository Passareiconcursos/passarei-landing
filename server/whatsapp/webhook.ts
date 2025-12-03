import { Request, Response } from "express";
import twilio from "twilio";
import {
  handleOnboarding,
  isInOnboarding,
  cancelOnboarding,
} from "./onboarding";

const MessagingResponse = twilio.twiml.MessagingResponse;

// Comandos disponíveis
const COMMANDS = {
  START: [
    "oi",
    "olá",
    "ola",
    "começar",
    "comecar",
    "start",
    "inicio",
    "início",
    "menu",
  ],
  HELP: ["ajuda", "help", "comandos", "?"],
  STUDY: ["estudar", "estudo", "aula", "1", "📚"],
  PROGRESS: ["progresso", "estatisticas", "stats", "2", "📊"],
  UPGRADE: ["upgrade", "plano", "planos", "assinar", "3", "⬆️"],
  REFER: ["indicar", "afiliado", "link", "4", "🔗"],
  SUPPORT: ["suporte", "ajuda humana", "falar", "5", "💬"],
  CANCEL: ["cancelar", "sair", "parar", "stop"],
};

// Menu principal
function getMainMenu(name: string): string {
  return (
    `🎯 *PASSAREI - Menu Principal*\n\n` +
    `Olá, ${name}! O que deseja fazer?\n\n` +
    `1️⃣ 📚 *Estudar agora*\n` +
    `2️⃣ 📊 *Meu progresso*\n` +
    `3️⃣ ⬆️ *Fazer upgrade*\n` +
    `4️⃣ 🔗 *Indicar amigos* (ganhe 20%)\n` +
    `5️⃣ 💬 *Suporte*\n\n` +
    `_Digite o número ou comando._`
  );
}

// Mensagem de ajuda
function getHelpMessage(): string {
  return (
    `❓ *COMANDOS DISPONÍVEIS*\n\n` +
    `• *estudar* - Iniciar sessão de estudo\n` +
    `• *progresso* - Ver suas estatísticas\n` +
    `• *upgrade* - Ver planos disponíveis\n` +
    `• *indicar* - Seu link de afiliado\n` +
    `• *suporte* - Falar com atendimento\n` +
    `• *menu* - Voltar ao menu principal\n\n` +
    `_Digite qualquer comando para começar._`
  );
}

// Mensagem de estudo (placeholder)
function getStudyMessage(): string {
  return (
    `📚 *HORA DE ESTUDAR!*\n\n` +
    `Preparando seu conteúdo personalizado...\n\n` +
    `⏳ _Em breve você receberá sua aula do dia!_\n\n` +
    `_Funcionalidade em desenvolvimento._`
  );
}

// Mensagem de progresso (placeholder)
function getProgressMessage(): string {
  return (
    `📊 *SEU PROGRESSO*\n\n` +
    `📈 Dias estudados: *0*\n` +
    `✅ Questões corretas: *0*\n` +
    `📝 Redações enviadas: *0*\n` +
    `🔥 Sequência atual: *0 dias*\n\n` +
    `_Continue estudando para ver seu progresso!_`
  );
}

// Mensagem de upgrade
function getUpgradeMessage(): string {
  return (
    `⬆️ *FAÇA UPGRADE*\n\n` +
    `📦 *Plano FREE* (atual)\n` +
    `• 2 matérias/dia\n` +
    `• Sem correção de redação\n\n` +
    `📦 *Plano CALOURO* - R$ 12,90/mês\n` +
    `• 10 matérias/dia\n` +
    `• 1 redação grátis/dia\n\n` +
    `📦 *Plano VETERANO* - R$ 9,90/mês\n` +
    `• 30 matérias/dia\n` +
    `• 3 redações grátis/dia\n` +
    `• Programa de afiliados\n\n` +
    `💳 Para assinar, acesse:\n` +
    `passarei.com.br/assinar\n\n` +
    `_Ou digite "suporte" para ajuda._`
  );
}

// Mensagem de indicação
function getReferMessage(phoneNumber: string): string {
  // Gerar código único baseado no telefone
  const code = phoneNumber.slice(-6);
  return (
    `🔗 *PROGRAMA DE AFILIADOS*\n\n` +
    `Ganhe *20% de comissão recorrente* em cada indicação!\n\n` +
    `📎 Seu link:\n` +
    `passarei.com.br/?ref=${code}\n\n` +
    `📊 Suas indicações: *0*\n` +
    `💰 Comissão acumulada: *R$ 0,00*\n\n` +
    `_Compartilhe com amigos que estudam para concursos!_`
  );
}

// Mensagem de suporte
function getSupportMessage(): string {
  return (
    `💬 *SUPORTE PASSAREI*\n\n` +
    `Precisa de ajuda? Estamos aqui!\n\n` +
    `📧 Email: suporte@passarei.com.br\n` +
    `⏰ Horário: Seg-Sex, 9h-18h\n\n` +
    `Ou descreva seu problema aqui que responderemos em breve.\n\n` +
    `_Digite "menu" para voltar._`
  );
}

// Verificar se mensagem é um comando
function matchCommand(message: string, commands: string[]): boolean {
  const normalized = message.toLowerCase().trim();
  return commands.some(
    (cmd) => normalized === cmd || normalized.startsWith(cmd),
  );
}

// Handler principal
export async function handleIncomingWhatsApp(req: Request, res: Response) {
  try {
    console.log("📱 Webhook recebido:", JSON.stringify(req.body, null, 2));

    const { From, Body, ProfileName } = req.body;

    if (!From || !Body) {
      console.log("⚠️ Mensagem sem From ou Body");
      return res.status(200).send("OK");
    }

    const phoneNumber = From.replace(/whatsapp:\s*/i, "").trim();
    const message = Body?.trim() || "";
    const name = ProfileName || "Usuário";

    console.log(`📨 Mensagem de ${name} (${phoneNumber}): "${message}"`);

    const twiml = new MessagingResponse();
    let responseMessage = "";

    // Comando de cancelar
    if (matchCommand(message, COMMANDS.CANCEL)) {
      cancelOnboarding(phoneNumber);
      responseMessage =
        "❌ Operação cancelada.\n\nDigite *menu* para ver opções.";
    }
    // Usuário em onboarding
    else if (isInOnboarding(phoneNumber)) {
      responseMessage = handleOnboarding(phoneNumber, message, name);
    }
    // Comandos de início/menu
    else if (matchCommand(message, COMMANDS.START)) {
      // Verificar se usuário já existe no banco
      // TODO: Buscar usuário no banco
      const userExists = false; // Placeholder

      if (userExists) {
        responseMessage = getMainMenu(name);
      } else {
        // Iniciar onboarding para novos usuários
        responseMessage = handleOnboarding(phoneNumber, message, name);
      }
    }
    // Comando de ajuda
    else if (matchCommand(message, COMMANDS.HELP)) {
      responseMessage = getHelpMessage();
    }
    // Comando de estudar
    else if (matchCommand(message, COMMANDS.STUDY)) {
      responseMessage = getStudyMessage();
    }
    // Comando de progresso
    else if (matchCommand(message, COMMANDS.PROGRESS)) {
      responseMessage = getProgressMessage();
    }
    // Comando de upgrade
    else if (matchCommand(message, COMMANDS.UPGRADE)) {
      responseMessage = getUpgradeMessage();
    }
    // Comando de indicação
    else if (matchCommand(message, COMMANDS.REFER)) {
      responseMessage = getReferMessage(phoneNumber);
    }
    // Comando de suporte
    else if (matchCommand(message, COMMANDS.SUPPORT)) {
      responseMessage = getSupportMessage();
    }
    // Mensagem não reconhecida - iniciar onboarding ou mostrar menu
    else {
      // TODO: Verificar se usuário existe
      const userExists = false; // Placeholder

      if (userExists) {
        responseMessage =
          `🤔 Não entendi "${message}".\n\n` +
          `Digite *ajuda* para ver comandos ou *menu* para opções.`;
      } else {
        // Novo usuário - iniciar onboarding
        responseMessage = handleOnboarding(phoneNumber, "começar", name);
      }
    }

    twiml.message(responseMessage);

    console.log(`✅ Resposta enviada para ${phoneNumber}`);
    console.log(`📤 Mensagem: ${responseMessage.substring(0, 100)}...`);

    res.type("text/xml");
    res.send(twiml.toString());
  } catch (error) {
    console.error("❌ Erro no webhook:", error);

    // Enviar resposta de erro amigável
    const twiml = new MessagingResponse();
    twiml.message(
      "😅 Ops! Algo deu errado. Tente novamente em alguns segundos.",
    );

    res.type("text/xml");
    res.send(twiml.toString());
  }
}
