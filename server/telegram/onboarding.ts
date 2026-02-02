import { startLearningSession } from "./learning-session";
import TelegramBot from "node-telegram-bot-api";
import { db } from "../../db";
import { sql } from "drizzle-orm";
import {
  updateUserOnboarding,
  generateConcursosKeyboard,
  generateCargosKeyboard,
  getCargosFromDB,
  getMateriasFromDB,
} from "./database";

// MAPEAMENTO ESTÁTICO COMO FALLBACK GARANTIDO
const SUBJECT_FALLBACK: any = {
  PF: [
    "Direito Constitucional",
    "Direito Administrativo",
    "Direito Penal",
    "Português",
    "Raciocínio Lógico",
    "Informática",
  ],
  PRF: [
    "Direito Constitucional",
    "Direito Administrativo",
    "Legislação de Trânsito",
    "Português",
    "Raciocínio Lógico",
    "Informática",
  ],
  PC: [
    "Direito Constitucional",
    "Direito Penal",
    "Direito Processual Penal",
    "Português",
    "Raciocínio Lógico",
    "Criminalística",
  ],
  PM: [
    "Direito Constitucional",
    "Direito Penal",
    "Português",
    "Raciocínio Lógico",
    "Matemática",
    "Legislação Militar",
  ],
  CBM: [
    "Português",
    "Matemática",
    "Raciocínio Lógico",
    "Física",
    "Química",
    "Primeiros Socorros",
  ],
  GM: [
    "Direito Constitucional",
    "Português",
    "Matemática",
    "Legislação Municipal",
    "Atualidades",
  ],
  PP_ESTADUAL: [
    "Direito Constitucional",
    "Direito Penal",
    "Português",
    "Legislação Penitenciária",
    "Atualidades",
  ],
  PP_FEDERAL: [
    "Direito Constitucional",
    "Direito Penal",
    "Português",
    "Legislação Penitenciária",
    "Direitos Humanos",
  ],
  PL_ESTADUAL: [
    "Direito Constitucional",
    "Direito Administrativo",
    "Português",
    "Atualidades",
  ],
  PL_FEDERAL: [
    "Direito Constitucional",
    "Direito Administrativo",
    "Português",
    "Atualidades",
  ],
};

interface OnboardingState {
  step: number;
  waitingFor?: "estado" | "municipio";
  data: {
    examType?: string;
    state?: string;
    municipio?: string;
    cargo?: string;
    cargoId?: string; // ID do cargo no banco para buscar matérias
    nivel?: string;
    facilidades?: string[];
    dificuldades?: string[];
    timeUntilExam?: string;
    schedule?: string;
  };
}

// Buscar cargoId pelo código do cargo
async function getCargoIdByCodigo(
  examType: string,
  cargoCodigo: string,
): Promise<string | null> {
  try {
    const result = (await db.execute(sql`
      SELECT c.id FROM cargos c
      JOIN concursos co ON c.concurso_id = co.id
      WHERE co.sigla = ${examType}
        AND c.codigo = ${cargoCodigo}
        AND c.is_active = true
      LIMIT 1
    `)) as any[];

    return result[0]?.id || null;
  } catch (error) {
    console.error(`❌ Erro ao buscar cargoId: ${error}`);
    return null;
  }
}

const onboardingStates = new Map<string, OnboardingState>();

const CARGOS: any = {
  PC: [
    "Delegado",
    "Escrivão",
    "Investigador",
    "Agente de Polícia",
    "Perito Criminal",
    "Papiloscopista",
  ],
  PM: ["Soldado", "Aspirante a Oficial"],
  PF: ["Agente", "Escrivão", "Delegado", "Perito Criminal"],
  PRF: ["Policial Rodoviário Federal"],
  CBM: ["Soldado", "Aspirante a Oficial"],
  GM: ["Guarda Municipal"],
  PP_ESTADUAL: ["Agente Penitenciário"],
  PP_FEDERAL: ["Agente Federal Penitenciário"],
  PL_ESTADUAL: ["Agente de Polícia Legislativa"],
  PL_FEDERAL: ["Policial Legislativo Federal"],
};

export async function startOnboarding(
  bot: TelegramBot,
  chatId: number,
  telegramId: string,
  name: string,
) {
  onboardingStates.set(telegramId, { step: 1, data: {} });

  await bot.sendMessage(
    chatId,
    `👋 *Olá, ${name}!*\n\n` +
      `🎯 Bem-vindo ao *PASSAREI* - seu assistente de estudos para concursos!\n\n` +
      `📚 Vou criar um plano personalizado para você em *8 perguntas rápidas*.\n\n` +
      `🎁 *BÔNUS:* Você tem *21 questões GRÁTIS* hoje para testar!\n\n` +
      `Vamos começar? 💪`,
    { parse_mode: "Markdown" },
  );

  await new Promise((r) => setTimeout(r, 2000));

  // Busca concursos dinamicamente do banco de dados
  const keyboard = await generateConcursosKeyboard();

  await bot.sendMessage(
    chatId,
    `*PERGUNTA 1/8* 🎯\n\nQual concurso você está estudando?`,
    { parse_mode: "Markdown", reply_markup: keyboard },
  );
}

export async function handleOnboardingCallback(bot: TelegramBot, query: any) {
  const chatId = query.message?.chat.id;
  const telegramId = String(query.from.id);
  const data = query.data;

  if (!chatId) return;

  const state = onboardingStates.get(telegramId);
  if (!state) return;

  console.log(`📝 Step ${state.step}: ${data}`);

  if (data.startsWith("onb_") && state.step === 1) {
    const examType = data.replace("onb_", "");
    state.data.examType = examType;
    state.step = 2;

    await bot.answerCallbackQuery(query.id, { text: `✅ ${examType}!` });

    const isEstadual = [
      "PM",
      "PC",
      "CBM",
      "PP_ESTADUAL",
      "PL_ESTADUAL",
    ].includes(examType);
    const isMunicipal = examType === "GM";

    if (isEstadual) {
      state.waitingFor = "estado";
      await bot.sendMessage(
        chatId,
        `*PERGUNTA 2/8* 📍\n\nDigite o *estado* (ex: MG, SP, RS):`,
        { parse_mode: "Markdown" },
      );
    } else if (isMunicipal) {
      state.waitingFor = "municipio";
      await bot.sendMessage(
        chatId,
        `*PERGUNTA 2/8* 🏙️\n\nDigite o *município*:`,
        { parse_mode: "Markdown" },
      );
    } else {
      // Concurso Federal - mostrar confirmação
      state.data.state = "NACIONAL";
      state.step = 3;

      await bot.sendMessage(
        chatId,
        `*PERGUNTA 2/8* 🇧🇷\n\n📍 *Abrangência: NACIONAL*\n\nConcursos federais têm validade em todo o território brasileiro!`,
        { parse_mode: "Markdown" },
      );

      await new Promise((r) => setTimeout(r, 1500));
      await askCargo(bot, chatId, examType);
    }
  } else if (state.step === 3) {
    const cargoCodigo = data.startsWith("cargo_")
      ? data.replace("cargo_", "")
      : data;

    state.data.cargo = cargoCodigo;

    const cargoId = await getCargoIdByCodigo(state.data.examType!, cargoCodigo);
    state.data.cargoId = cargoId || undefined;

    console.log(`📋 [ONBOARDING] Cargo: ${cargoCodigo}, ID: ${cargoId}`);

    state.step = 4;
    await bot.answerCallbackQuery(query.id);
    await askNivel(bot, chatId);
  } else if (data.startsWith("nivel_") && state.step === 4) {
    state.data.nivel = data.replace("nivel_", "");
    state.step = 5;
    state.data.facilidades = [];
    await bot.answerCallbackQuery(query.id);
    await askFacilidades(bot, chatId, state.data.examType!, state.data.cargoId);
  } else if (data.startsWith("facil_") && state.step === 5) {
    const facil = data.replace("facil_", "");

    if (facil === "NONE") {
      state.data.facilidades = [];
      state.step = 6;
      await bot.answerCallbackQuery(query.id);
      await askDificuldades(
        bot,
        chatId,
        state.data.examType!,
        state.data.facilidades!,
        state.data.cargoId,
      );
      return;
    }

    if (facil === "DONE") {
      state.step = 6;
      await bot.answerCallbackQuery(query.id);
      await askDificuldades(
        bot,
        chatId,
        state.data.examType!,
        state.data.facilidades!,
        state.data.cargoId,
      );
      return;
    }

    if (!state.data.facilidades!.includes(facil)) {
      state.data.facilidades!.push(facil);
      await bot.answerCallbackQuery(query.id, { text: `✅ ${facil}!` });
    }
  } else if (data.startsWith("dific_") && state.step === 6) {
    const dific = data.replace("dific_", "");

    if (dific === "NONE") {
      state.data.dificuldades = [];
      state.step = 7;
      await bot.answerCallbackQuery(query.id);
      await askTime(bot, chatId);
      return;
    }

    if (dific === "DONE") {
      state.step = 7;
      await bot.answerCallbackQuery(query.id);
      await askTime(bot, chatId);
      return;
    }

    if (!state.data.dificuldades) state.data.dificuldades = [];
    if (!state.data.dificuldades!.includes(dific)) {
      state.data.dificuldades!.push(dific);
      await bot.answerCallbackQuery(query.id, { text: `✅ ${dific}!` });
    }
  } else if (data.startsWith("time_") && state.step === 7) {
    state.data.timeUntilExam = data.replace("time_", "");
    state.step = 8;
    await bot.answerCallbackQuery(query.id, { text: "✅ Anotado!" });
    await askSchedule(bot, chatId);
  } else if (data.startsWith("hora_") && state.step === 8) {
    state.data.schedule = data.replace("hora_", "");
    await bot.answerCallbackQuery(query.id, { text: "✅ Perfeito!" });
    await finishOnboarding(bot, chatId, telegramId, state.data);
  }
}

export async function handleOnboardingMessage(bot: TelegramBot, msg: any) {
  const chatId = msg.chat.id;
  const telegramId = String(msg.from?.id);
  const text = msg.text?.trim();

  const state = onboardingStates.get(telegramId);
  if (!state || !state.waitingFor) return;

  if (state.waitingFor === "estado" && state.step === 2) {
    state.data.state = text?.toUpperCase();
    state.waitingFor = undefined;
    state.step = 3;
    await askCargo(bot, chatId, state.data.examType!);
  } else if (state.waitingFor === "municipio" && state.step === 2) {
    state.data.municipio = text;
    state.data.state = text;
    state.waitingFor = undefined;
    state.step = 3;
    await askCargo(bot, chatId, state.data.examType!);
  }
}

async function askCargo(bot: TelegramBot, chatId: number, examType: string) {
  // Busca cargos dinamicamente do banco de dados
  const keyboard = await generateCargosKeyboard(examType);

  // Se não houver cargos no banco, usa fallback hardcoded
  if (keyboard.inline_keyboard.length === 0) {
    const fallbackCargos = CARGOS[examType] || ["Outro"];
    keyboard.inline_keyboard = fallbackCargos.map((c: string) => [
      { text: c, callback_data: `cargo_${c}` },
    ]);
  }

  await bot.sendMessage(
    chatId,
    `*PERGUNTA 3/8* 👮\n\nQual cargo você pretende?`,
    { parse_mode: "Markdown", reply_markup: keyboard },
  );
}

async function askNivel(bot: TelegramBot, chatId: number) {
  const keyboard = {
    inline_keyboard: [
      [{ text: "🌱 Iniciante", callback_data: "nivel_INICIANTE" }],
      [{ text: "📚 Intermediário", callback_data: "nivel_INTERMEDIARIO" }],
      [{ text: "🎓 Avançado", callback_data: "nivel_AVANCADO" }],
    ],
  };

  await bot.sendMessage(
    chatId,
    `*PERGUNTA 4/8* 📊\n\nQual seu nível de conhecimento nas matérias do concurso?`,
    { parse_mode: "Markdown", reply_markup: keyboard },
  );
}

async function askFacilidades(
  bot: TelegramBot,
  chatId: number,
  examType: string,
  cargoId?: string,
) {
  // CORREÇÃO 1: Buscar matérias do banco pelo cargoId
  let subjectNames: string[];

  if (cargoId) {
    const materias = await getMateriasFromDB(cargoId);
    if (materias.length > 0) {
      subjectNames = materias.map((m) => m.nome);
      console.log(
        `📚 [ONBOARDING] Matérias do cargo (${materias.length}):`,
        subjectNames,
      );
    } else {
      // Fallback se não encontrar matérias no banco
      subjectNames = SUBJECT_FALLBACK[examType] || SUBJECT_FALLBACK["PF"];
      console.log(`⚠️ [ONBOARDING] Usando fallback para matérias`);
    }
  } else {
    subjectNames = SUBJECT_FALLBACK[examType] || SUBJECT_FALLBACK["PF"];
    console.log(`⚠️ [ONBOARDING] Sem cargoId, usando fallback`);
  }

  const keyboard = {
    inline_keyboard: [
      ...subjectNames.map((name: string) => [
        { text: name, callback_data: `facil_${name}` },
      ]),
      [{ text: "✅ Próxima pergunta", callback_data: "facil_DONE" }],
      [{ text: "Nenhuma", callback_data: "facil_NONE" }],
    ],
  };

  await bot.sendMessage(
    chatId,
    `*PERGUNTA 5/8* 💚\n\nEm qual área você JÁ TEM FACILIDADE?\n\n_Pode escolher várias matérias_`,
    { parse_mode: "Markdown", reply_markup: keyboard },
  );
}

async function askDificuldades(
  bot: TelegramBot,
  chatId: number,
  examType: string,
  facilidades: string[],
  cargoId?: string,
) {
  // CORREÇÃO 1: Buscar matérias do banco pelo cargoId
  let allSubjects: string[];

  if (cargoId) {
    const materias = await getMateriasFromDB(cargoId);
    if (materias.length > 0) {
      allSubjects = materias.map((m) => m.nome);
    } else {
      allSubjects = SUBJECT_FALLBACK[examType] || SUBJECT_FALLBACK["PF"];
    }
  } else {
    allSubjects = SUBJECT_FALLBACK[examType] || SUBJECT_FALLBACK["PF"];
  }

  // Filtrar matérias já marcadas como facilidade
  const filtered = allSubjects.filter((s: string) => !facilidades.includes(s));

  const keyboard = {
    inline_keyboard: [
      ...filtered.map((name: string) => [
        { text: name, callback_data: `dific_${name}` },
      ]),
      [{ text: "✅ Próxima pergunta", callback_data: "dific_DONE" }],
      [{ text: "Nenhuma", callback_data: "dific_NONE" }],
    ],
  };

  await bot.sendMessage(
    chatId,
    `*PERGUNTA 6/8* 🎯\n\nEm qual área você TEM MAIS DIFICULDADE?\n\n_Vamos focar mais tempo nela!_`,
    { parse_mode: "Markdown", reply_markup: keyboard },
  );
}

async function askTime(bot: TelegramBot, chatId: number) {
  const keyboard = {
    inline_keyboard: [
      [{ text: "⚡ 0-3 meses", callback_data: "time_0-3meses" }],
      [{ text: "📅 3-6 meses", callback_data: "time_3-6meses" }],
      [{ text: "📆 6-12 meses", callback_data: "time_6-12meses" }],
      [{ text: "🎯 Mais de 1 ano", callback_data: "time_1ano+" }],
    ],
  };

  await bot.sendMessage(
    chatId,
    `*PERGUNTA 7/8* 📅\n\nQuanto tempo você tem até a prova?`,
    { parse_mode: "Markdown", reply_markup: keyboard },
  );
}

async function askSchedule(bot: TelegramBot, chatId: number) {
  const keyboard = {
    inline_keyboard: [
      [{ text: "🌅 Manhã (06h-12h)", callback_data: "hora_manha" }],
      [{ text: "☀️ Tarde (12h-18h)", callback_data: "hora_tarde" }],
      [{ text: "🌙 Noite (18h-23h)", callback_data: "hora_noite" }],
      [{ text: "🎯 Manhã + Tarde", callback_data: "hora_manha_tarde" }],
      [{ text: "🌟 Tarde + Noite", callback_data: "hora_tarde_noite" }],
    ],
  };

  await bot.sendMessage(
    chatId,
    `*PERGUNTA 8/8* ⏰\n\nQuando você PREFERE estudar?\n\n_Enviaremos conteúdo automaticamente nesses horários!_`,
    { parse_mode: "Markdown", reply_markup: keyboard },
  );
}

async function finishOnboarding(
  bot: TelegramBot,
  chatId: number,
  telegramId: string,
  data: any,
) {
  try {
    // Atualizar usuário no banco (incluindo schedule, facilidades, dificuldades)
    await updateUserOnboarding(telegramId, {
      examType: data.examType,
      state: data.state,
      cargo: data.cargo,
      nivelConhecimento: data.nivel,
      studySchedule: data.schedule,
      facilidades: data.facilidades || [],
      dificuldades: data.dificuldades || [],
    });

    onboardingStates.delete(telegramId);

    const scheduleText = data.schedule?.replace("_", " + ") || data.schedule;

    await bot.sendMessage(
      chatId,
      `🎉 *PERFIL CRIADO COM SUCESSO!*\n\n` +
        `📋 *RESUMO DO SEU PLANO DE ESTUDOS:*\n\n` +
        `🎯 Concurso: *${data.examType}*\n` +
        `📍 Local: *${data.state}*\n` +
        `👮 Cargo: *${data.cargo}*\n` +
        `📊 Nível: *${data.nivel}*\n` +
        `💚 Facilidades: *${data.facilidades?.join(", ") || "Nenhuma"}*\n` +
        `🎯 Focar em: *${data.dificuldades?.join(", ") || "Todas as matérias"}*\n` +
        `📅 Tempo: *${data.timeUntilExam}*\n` +
        `⏰ Horário de estudo: *${scheduleText}*\n\n` +
        `━━━━━━━━━━━━━━━━\n\n` +
        `🎁 *Você tem 21 questões GRÁTIS hoje!*\n\n` +
        `⏳ Preparando sua primeira aula...`,
      { parse_mode: "Markdown" },
    );

    await new Promise((r) => setTimeout(r, 3000));

    await bot.sendMessage(
      chatId,
      `✅ *Plano de estudos criado!*\n\n` +
        `🚀 *Preparando sua primeira questão...*\n\n` +
        `📚 Começaremos com: *${data.dificuldades?.[0] || "Direito Penal"}*\n\n` +
        `Em instantes você receberá o primeiro conteúdo! 💪`,
      { parse_mode: "Markdown" },
    );

    setTimeout(() => {
      startLearningSession(
        bot,
        chatId,
        telegramId,
        data.examType!,
        data.dificuldades || [],
        data.facilidades || [],
      );
    }, 3000);
  } catch (error) {
    console.error("Erro ao finalizar:", error);
    await bot.sendMessage(
      chatId,
      `❌ Ocorreu um erro. Por favor, envie /start para recomeçar.`,
    );
  }
}

export { onboardingStates };
