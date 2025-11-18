import TelegramBot from "node-telegram-bot-api";
import { db } from "../../db";
import { sql } from "drizzle-orm";
import { startLearningSession } from "./learning-session";

// VALIDADORES RIGOROSOS
const VALID_EXAMS = {
  'PM': ['PM', 'pm', 'Pm', 'Polícia Militar', 'policia militar', 'POLÍCIA MILITAR'],
  'PC': ['PC', 'pc', 'Pc', 'Polícia Civil', 'policia civil', 'POLÍCIA CIVIL'],
  'PF': ['PF', 'pf', 'Pf', 'Polícia Federal', 'policia federal', 'POLÍCIA FEDERAL'],
  'PRF': ['PRF', 'prf', 'Prf', 'Polícia Rodoviária Federal', 'policia rodoviaria federal', 'POLÍCIA RODOVIÁRIA FEDERAL']
};

const VALID_STATES = {
  'SP': ['SP', 'sp', 'Sp', 'São Paulo', 'sao paulo', 'SÃO PAULO'],
  'RJ': ['RJ', 'rj', 'Rj', 'Rio de Janeiro', 'rio de janeiro', 'RIO DE JANEIRO'],
  'MG': ['MG', 'mg', 'Mg', 'Minas Gerais', 'minas gerais', 'MINAS GERAIS'],
  'ES': ['ES', 'es', 'Es', 'Espírito Santo', 'espirito santo', 'ESPÍRITO SANTO'],
  'BA': ['BA', 'ba', 'Ba', 'Bahia', 'bahia', 'BAHIA'],
  'RS': ['RS', 'rs', 'Rs', 'Rio Grande do Sul', 'rio grande do sul', 'RIO GRANDE DO SUL'],
  'PR': ['PR', 'pr', 'Pr', 'Paraná', 'parana', 'PARANÁ'],
  'SC': ['SC', 'sc', 'Sc', 'Santa Catarina', 'santa catarina', 'SANTA CATARINA'],
  // Adicionar todos os 27 estados...
};

const VALID_CARGOS: Record<string, string[]> = {
  'PM': ['Soldado', 'soldado', 'SOLDADO', 'Cabo', 'cabo', 'CABO', 'Sargento', 'sargento', 'SARGENTO', 'Oficial', 'oficial', 'OFICIAL'],
  'PC': ['Investigador', 'investigador', 'INVESTIGADOR', 'Escrivão', 'escrivao', 'ESCRIVÃO', 'Delegado', 'delegado', 'DELEGADO'],
  'PF': ['Agente', 'agente', 'AGENTE', 'Escrivão', 'escrivao', 'ESCRIVÃO', 'Delegado', 'delegado', 'DELEGADO'],
  'PRF': ['Policial Rodoviário Federal', 'policial rodoviario federal', 'POLICIAL RODOVIÁRIO FEDERAL', 'PRF', 'prf']
};

const VALID_NIVEIS = ['INICIANTE', 'iniciante', 'Iniciante', 'INTERMEDIÁRIO', 'intermediario', 'Intermediário', 'AVANÇADO', 'avancado', 'Avançado'];

const VALID_TEMPOS = ['0-3meses', '0-3 meses', '3-6meses', '3-6 meses', '6-12meses', '6-12 meses', '12+meses', '12+ meses', 'mais de 12 meses'];

const VALID_HORARIOS = ['manha', 'manhã', 'MANHÃ', 'tarde', 'TARDE', 'noite', 'NOITE', 'madrugada', 'MADRUGADA'];

// Função para validar entrada
function validateInput(input: string, validOptions: string[] | Record<string, string[]>, type: string): { valid: boolean; normalized?: string; error?: string } {
  const trimmed = input.trim();
  
  if (Array.isArray(validOptions)) {
    const found = validOptions.find(opt => opt.toLowerCase() === trimmed.toLowerCase());
    if (found) {
      return { valid: true, normalized: found.toUpperCase() };
    }
    return { valid: false, error: `⚠️ Entrada não reconhecida.\n\nDigite exatamente uma das opções válidas:\n${validOptions.slice(0, 5).join(', ')}...` };
  } else {
    // É um objeto (VALID_EXAMS ou VALID_STATES)
    for (const [key, values] of Object.entries(validOptions)) {
      if (values.some(v => v.toLowerCase() === trimmed.toLowerCase())) {
        return { valid: true, normalized: key };
      }
    }
    
    const keys = Object.keys(validOptions);
    return { valid: false, error: `⚠️ ${type} não reconhecido.\n\nDigite a SIGLA (ex: ${keys[0]}) ou o NOME COMPLETO.` };
  }
}

interface OnboardingData {
  step: number;
  examType?: string;
  state?: string;
  cargo?: string;
  nivel?: string;
  facilidades?: string[];
  dificuldades?: string[];
  tempoDisponivel?: string;
  horarioEstudo?: string;
}

const onboardingSessions = new Map<string, OnboardingData>();

export async function handleOnboardingMessage(bot: TelegramBot, msg: TelegramBot.Message) {
  const chatId = msg.chat.id;
  const telegramId = String(msg.from?.id);
  const text = msg.text?.trim() || '';

  let session = onboardingSessions.get(telegramId);

  if (!session) {
    session = { step: 0 };
    onboardingSessions.set(telegramId, session);
  }

  console.log(`📝 Step ${session.step}: ${text}`);

  // STEP 0: Boas-vindas
  if (session.step === 0) {
    await bot.sendMessage(chatId, `🎯 *BEM-VINDO AO PASSAREI!*\n\nVou te fazer 8 perguntas rápidas para criar seu plano de estudos personalizado.\n\n*Pergunta 1/8:*\nPara qual concurso você está estudando?\n\nDigite:\n• PM\n• PC\n• PF\n• PRF`, { parse_mode: 'Markdown' });
    session.step = 1;
    return;
  }

  // STEP 1: Concurso
  if (session.step === 1) {
    const validation = validateInput(text, VALID_EXAMS, 'Concurso');
    if (!validation.valid) {
      await bot.sendMessage(chatId, validation.error!);
      return;
    }
    
    session.examType = validation.normalized;
    await bot.sendMessage(chatId, `✅ ${validation.normalized} confirmado!\n\n*Pergunta 2/8:*\nQual estado?\n\nDigite a SIGLA (ex: SP) ou nome completo (ex: São Paulo):`, { parse_mode: 'Markdown' });
    session.step = 2;
    return;
  }

  // STEP 2: Estado
  if (session.step === 2) {
    const validation = validateInput(text, VALID_STATES, 'Estado');
    if (!validation.valid) {
      await bot.sendMessage(chatId, validation.error!);
      return;
    }
    
    session.state = validation.normalized;
    
    const cargos = VALID_CARGOS[session.examType!] || [];
    await bot.sendMessage(chatId, `✅ ${validation.normalized} confirmado!\n\n*Pergunta 3/8:*\nQual cargo?\n\nOpções:\n${cargos.slice(0, 4).map(c => `• ${c}`).join('\n')}`, { parse_mode: 'Markdown' });
    session.step = 3;
    return;
  }

  // STEP 3: Cargo
  if (session.step === 3) {
    const cargosValidos = VALID_CARGOS[session.examType!] || [];
    const validation = validateInput(text, cargosValidos, 'Cargo');
    if (!validation.valid) {
      await bot.sendMessage(chatId, validation.error!);
      return;
    }
    
    session.cargo = text; // manter original (capitalizado)
    await bot.sendMessage(chatId, `✅ ${text} confirmado!\n\n*Pergunta 4/8:*\nQual seu nível?\n\n• INICIANTE\n• INTERMEDIÁRIO\n• AVANÇADO`, { parse_mode: 'Markdown' });
    session.step = 4;
    return;
  }

  // STEP 4: Nível
  if (session.step === 4) {
    const validation = validateInput(text, VALID_NIVEIS, 'Nível');
    if (!validation.valid) {
      await bot.sendMessage(chatId, validation.error!);
      return;
    }
    
    session.nivel = validation.normalized;
    await bot.sendMessage(chatId, `✅ ${validation.normalized} confirmado!\n\n*Pergunta 5/8:*\nQuais matérias você JÁ DOMINA?\n\n(Digite uma por vez ou "PULAR" se nenhuma)`, { parse_mode: 'Markdown' });
    session.step = 5;
    session.facilidades = [];
    return;
  }

  // STEP 5: Facilidades
  if (session.step === 5) {
    if (text.toUpperCase() === 'PULAR' || text.toUpperCase() === 'PRONTO') {
      await bot.sendMessage(chatId, `✅ Facilidades registradas!\n\n*Pergunta 6/8:*\nQuais matérias você TEM DIFICULDADE?\n\n(Digite uma por vez ou "PULAR")`, { parse_mode: 'Markdown' });
      session.step = 6;
      session.dificuldades = [];
      return;
    }
    
    session.facilidades!.push(text);
    await bot.sendMessage(chatId, `✅ "${text}" adicionada!\n\nMais alguma? (ou digite "PRONTO")`);
    return;
  }

  // STEP 6: Dificuldades
  if (session.step === 6) {
    if (text.toUpperCase() === 'PULAR' || text.toUpperCase() === 'PRONTO') {
      await bot.sendMessage(chatId, `✅ Dificuldades registradas!\n\n*Pergunta 7/8:*\nQuanto tempo até a prova?\n\n• 0-3meses\n• 3-6meses\n• 6-12meses\n• 12+meses`, { parse_mode: 'Markdown' });
      session.step = 7;
      return;
    }
    
    session.dificuldades!.push(text);
    await bot.sendMessage(chatId, `✅ "${text}" adicionada!\n\nMais alguma? (ou digite "PRONTO")`);
    return;
  }

  // STEP 7: Tempo
  if (session.step === 7) {
    const validation = validateInput(text, VALID_TEMPOS, 'Prazo');
    if (!validation.valid) {
      await bot.sendMessage(chatId, validation.error!);
      return;
    }
    
    session.tempoDisponivel = text;
    await bot.sendMessage(chatId, `✅ ${text} confirmado!\n\n*Pergunta 8/8 (última!):*\nQual seu melhor horário de estudo?\n\n• manhã\n• tarde\n• noite\n• madrugada`, { parse_mode: 'Markdown' });
    session.step = 8;
    return;
  }

  // STEP 8: Horário (FINAL)
  if (session.step === 8) {
    const validation = validateInput(text, VALID_HORARIOS, 'Horário');
    if (!validation.valid) {
      await bot.sendMessage(chatId, validation.error!);
      return;
    }
    
    session.horarioEstudo = text;
    
    // SALVAR NO BANCO
    await finishOnboarding(bot, chatId, telegramId, session);
    
    // LIMPAR SESSÃO
    onboardingSessions.delete(telegramId);
  }
}

async function finishOnboarding(bot: TelegramBot, chatId: number, telegramId: string, data: OnboardingData) {
  try {
    // Criar ou atualizar usuário
    await db.execute(sql`
      INSERT INTO users (
        telegram_id, 
        exam_type, 
        state, 
        cargo, 
        nivel, 
        facilidades, 
        dificuldades, 
        tempo_disponivel, 
        horario_estudo,
        onboarding_completed_at,
        plan_type
      ) VALUES (
        ${telegramId},
        ${data.examType},
        ${data.state},
        ${data.cargo},
        ${data.nivel},
        ${JSON.stringify(data.facilidades || [])},
        ${JSON.stringify(data.dificuldades || [])},
        ${data.tempoDisponivel},
        ${data.horarioEstudo},
        NOW(),
        'FREE'
      )
      ON CONFLICT (telegram_id) 
      DO UPDATE SET
        exam_type = ${data.examType},
        state = ${data.state},
        cargo = ${data.cargo},
        nivel = ${data.nivel},
        facilidades = ${JSON.stringify(data.facilidades || [])},
        dificuldades = ${JSON.stringify(data.dificuldades || [])},
        tempo_disponivel = ${data.tempoDisponivel},
        horario_estudo = ${data.horarioEstudo},
        onboarding_completed_at = NOW()
    `);

    await bot.sendMessage(chatId, `🎉 *PERFIL CRIADO COM SUCESSO!*\n\n📊 *RESUMO DO SEU PLANO DE ESTUDOS:*\n\nConcurso: ${data.examType}\nLocal: ${data.state}\nCargo: ${data.cargo}\nNível: ${data.nivel}\nFacilidades: ${data.facilidades?.join(', ') || 'Nenhuma'}\nFocar em: ${data.dificuldades?.join(', ') || 'Todas'}\nTempo: ${data.tempoDisponivel}\nHorário de estudo: ${data.horarioEstudo}\n\n⏳ Criando seu plano de estudos personalizado...`, { parse_mode: 'Markdown' });

    await new Promise(r => setTimeout(r, 2000));
    
    await bot.sendMessage(chatId, `✅ *Plano de estudos criado!*\n\n🎯 Preparando sua primeira aula...\n\n📚 Começaremos com: ${data.dificuldades?.[0] || 'conteúdo básico'}\n\n⏰ Em instantes você receberá o primeiro conteúdo!\n\n💪 Prepare-se!`);

    // INICIAR SESSÃO DE APRENDIZADO
    startLearningSession(bot, chatId, telegramId, data.examType!, data.dificuldades || [], data.facilidades || []);

  } catch (error) {
    console.error('Erro ao finalizar onboarding:', error);
    await bot.sendMessage(chatId, '❌ Erro ao criar perfil. Tente novamente: /start');
  }
}

export { onboardingSessions };
