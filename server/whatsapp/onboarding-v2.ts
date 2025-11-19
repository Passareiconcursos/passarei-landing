import twilio from 'twilio';
import { validateInput, validateLevel, VALID_EXAMS, VALID_STATES } from './validators';
import { getCargosPorConcurso, formatCargoOptions, formatMateriaOptions, parseLetterChoice, parseMultipleChoice, MATERIAS_COMUNS } from './cargos';

const MessagingResponse = twilio.twiml.MessagingResponse;

// ============================================
// TIPOS
// ============================================
interface OnboardingSession {
  step: number;
  examType?: string;
  state?: string;
  cargo?: string;
  nivel?: string;
  tempoDisponivel?: string;
  horarioPreferido?: string;
  materiasFaceis?: string[];
  materiasDificeis?: string[];
}

const sessions = new Map<string, OnboardingSession>();

// ============================================
// MENSAGENS DO ONBOARDING (8 PERGUNTAS)
// ============================================

function getWelcomeMessage(name: string): string {
  return (
    `🎯 *BEM-VINDO AO PASSAREI, ${name.toUpperCase()}!*\n\n` +
    `Vou te fazer *8 perguntas rápidas* para criar seu plano de estudos personalizado com IA.\n\n` +
    `━━━━━━━━━━━━━━━━\n` +
    `📝 *PERGUNTA 1/8*\n` +
    `━━━━━━━━━━━━━━━━\n\n` +
    `Para qual concurso você está estudando?\n\n` +
    `A) *PM* - Polícia Militar\n` +
    `B) *PC* - Polícia Civil\n` +
    `C) *PF* - Polícia Federal\n` +
    `D) *PRF* - Polícia Rodoviária Federal\n\n` +
    `_Digite a letra (A, B, C ou D):_`
  );
}

function getStateMessage(): string {
  return (
    `━━━━━━━━━━━━━━━━\n` +
    `📝 *PERGUNTA 2/8*\n` +
    `━━━━━━━━━━━━━━━━\n\n` +
    `Qual estado?\n\n` +
    `Digite a *SIGLA* (ex: SP, RJ, MG) ou *NOME COMPLETO* (ex: São Paulo):`
  );
}

function getCargoMessage(examType: string): string {
  const cargos = getCargosPorConcurso(examType);
  const options = formatCargoOptions(cargos);
  
  return (
    `━━━━━━━━━━━━━━━━\n` +
    `📝 *PERGUNTA 3/8*\n` +
    `━━━━━━━━━━━━━━━━\n\n` +
    `Qual cargo você pretende?\n\n` +
    `${options}\n\n` +
    `_Digite a letra correspondente:_`
  );
}

function getNivelMessage(): string {
  return (
    `━━━━━━━━━━━━━━━━\n` +
    `📝 *PERGUNTA 4/8*\n` +
    `━━━━━━━━━━━━━━━━\n\n` +
    `Qual seu nível de conhecimento atual?\n\n` +
    `A) *INICIANTE* - Começando agora\n` +
    `B) *INTERMEDIÁRIO* - Já estudei um pouco\n` +
    `C) *AVANÇADO* - Já fiz vários concursos\n\n` +
    `_Digite a letra (A, B ou C):_`
  );
}

function getTempoDisponivelMessage(): string {
  return (
    `━━━━━━━━━━━━━━━━\n` +
    `📝 *PERGUNTA 5/8*\n` +
    `━━━━━━━━━━━━━━━━\n\n` +
    `Quanto tempo você tem disponível por dia para estudar?\n\n` +
    `A) *1 hora/dia*\n` +
    `B) *2 horas/dia*\n` +
    `C) *3 horas/dia*\n` +
    `D) *4+ horas/dia*\n\n` +
    `_Digite a letra:_`
  );
}

function getHorarioMessage(): string {
  return (
    `━━━━━━━━━━━━━━━━\n` +
    `📝 *PERGUNTA 6/8*\n` +
    `━━━━━━━━━━━━━━━━\n\n` +
    `Qual seu melhor horário para estudar?\n\n` +
    `A) *Manhã* (6h - 12h)\n` +
    `B) *Tarde* (12h - 18h)\n` +
    `C) *Noite* (18h - 00h)\n` +
    `D) *Madrugada* (00h - 6h)\n\n` +
    `_Digite a letra:_`
  );
}

function getMateriasFaceisMessage(): string {
  const options = formatMateriaOptions(MATERIAS_COMUNS);
  
  return (
    `━━━━━━━━━━━━━━━━\n` +
    `📝 *PERGUNTA 7/8*\n` +
    `━━━━━━━━━━━━━━━━\n\n` +
    `Quais matérias você tem *MAIS FACILIDADE*?\n\n` +
    `${options}\n\n` +
    `_Digite até 3 letras separadas por vírgula (ex: A, C, E):_`
  );
}

function getMateriasDificeisMessage(): string {
  const options = formatMateriaOptions(MATERIAS_COMUNS);
  
  return (
    `━━━━━━━━━━━━━━━━\n` +
    `📝 *PERGUNTA 8/8* (ÚLTIMA!)\n` +
    `━━━━━━━━━━━━━━━━\n\n` +
    `Quais matérias você tem *MAIS DIFICULDADE*?\n\n` +
    `${options}\n\n` +
    `_Digite até 3 letras separadas por vírgula (ex: B, D, F):_`
  );
}

function getCompletionMessage(session: OnboardingSession, name: string): string {
  const materiasFaceis = session.materiasFaceis?.join(', ') || 'Nenhuma';
  const materiasDificeis = session.materiasDificeis?.join(', ') || 'Nenhuma';
  
  return (
    `🎉 *PERFIL CRIADO COM SUCESSO!*\n\n` +
    `━━━━━━━━━━━━━━━━\n` +
    `📊 *SEU RESUMO*\n` +
    `━━━━━━━━━━━━━━━━\n\n` +
    `✓ Concurso: *${session.examType}*\n` +
    `✓ Estado: *${session.state}*\n` +
    `✓ Cargo: *${session.cargo}*\n` +
    `✓ Nível: *${session.nivel}*\n` +
    `✓ Tempo: *${session.tempoDisponivel}*\n` +
    `✓ Horário: *${session.horarioPreferido}*\n` +
    `✓ Facilidades: *${materiasFaceis}*\n` +
    `✓ Dificuldades: *${materiasDificeis}*\n\n` +
    `━━━━━━━━━━━━━━━━\n` +
    `📚 *PLANO FREE ATIVADO*\n` +
    `━━━━━━━━━━━━━━━━\n\n` +
    `• 2 matérias por dia\n` +
    `• 2 correções de exercícios\n` +
    `• SEM redação\n\n` +
    `⏰ *Preparando sua primeira aula...*\n\n` +
    `💪 Em instantes você receberá o primeiro conteúdo personalizado!\n\n` +
    `_Digite "ajuda" caso precise de suporte._`
  );
}

// ============================================
// LÓGICA DO ONBOARDING
// ============================================

export function handleOnboardingV2(phoneNumber: string, message: string, name: string): string {
  let session = sessions.get(phoneNumber);
  
  // Iniciar onboarding
  if (!session || message.toLowerCase() === '/start' || message.toLowerCase() === 'começar') {
    session = { step: 0 };
    sessions.set(phoneNumber, session);
    session.step = 1;
    return getWelcomeMessage(name);
  }
  
  // STEP 1: Concurso (com letras)
  if (session.step === 1) {
    const options = ['PM', 'PC', 'PF', 'PRF'];
    const result = parseLetterChoice(message, options);
    
    if (!result.valid) {
      return result.error!;
    }
    
    session.examType = result.value;
    session.step = 2;
    return `✅ *${result.value} confirmado!*\n\n` + getStateMessage();
  }
  
  // STEP 2: Estado
  if (session.step === 2) {
    const validation = validateInput(message, VALID_STATES, 'Estado');
    if (!validation.valid) {
      return validation.error!;
    }
    
    session.state = validation.normalized;
    session.step = 3;
    return `✅ *${validation.normalized} confirmado!*\n\n` + getCargoMessage(session.examType!);
  }
  
  // STEP 3: Cargo (com letras)
  if (session.step === 3) {
    const cargos = getCargosPorConcurso(session.examType!);
    const result = parseLetterChoice(message, cargos);
    
    if (!result.valid) {
      return result.error!;
    }
    
    session.cargo = result.value;
    session.step = 4;
    return `✅ *${result.value} confirmado!*\n\n` + getNivelMessage();
  }
  
  // STEP 4: Nível (com letras)
  if (session.step === 4) {
    const niveis = ['INICIANTE', 'INTERMEDIÁRIO', 'AVANÇADO'];
    const result = parseLetterChoice(message, niveis);
    
    if (!result.valid) {
      return result.error!;
    }
    
    session.nivel = result.value;
    session.step = 5;
    return `✅ *${result.value} confirmado!*\n\n` + getTempoDisponivelMessage();
  }
  
  // STEP 5: Tempo disponível (com letras)
  if (session.step === 5) {
    const tempos = ['1 hora/dia', '2 horas/dia', '3 horas/dia', '4+ horas/dia'];
    const result = parseLetterChoice(message, tempos);
    
    if (!result.valid) {
      return result.error!;
    }
    
    session.tempoDisponivel = result.value;
    session.step = 6;
    return `✅ *${result.value} confirmado!*\n\n` + getHorarioMessage();
  }
  
  // STEP 6: Horário preferido (com letras)
  if (session.step === 6) {
    const horarios = ['Manhã', 'Tarde', 'Noite', 'Madrugada'];
    const result = parseLetterChoice(message, horarios);
    
    if (!result.valid) {
      return result.error!;
    }
    
    session.horarioPreferido = result.value;
    session.step = 7;
    return `✅ *${result.value} confirmado!*\n\n` + getMateriasFaceisMessage();
  }
  
  // STEP 7: Matérias fáceis (múltipla escolha)
  if (session.step === 7) {
    const result = parseMultipleChoice(message, MATERIAS_COMUNS);
    
    if (!result.valid) {
      return result.error!;
    }
    
    if (result.values!.length > 3) {
      return '⚠️ Máximo de 3 matérias. Escolha novamente:';
    }
    
    session.materiasFaceis = result.values;
    session.step = 8;
    return `✅ *${result.values!.join(', ')} confirmadas!*\n\n` + getMateriasDificeisMessage();
  }
  
  // STEP 8: Matérias difíceis (FINAL)
  if (session.step === 8) {
    const result = parseMultipleChoice(message, MATERIAS_COMUNS);
    
    if (!result.valid) {
      return result.error!;
    }
    
    if (result.values!.length > 3) {
      return '⚠️ Máximo de 3 matérias. Escolha novamente:';
    }
    
    session.materiasDificeis = result.values;
    
    // TODO: Salvar no banco de dados
    const completionMessage = getCompletionMessage(session, name);
    
    // TODO: Enviar primeira aula automaticamente
    
    // Limpar sessão
    sessions.delete(phoneNumber);
    
    return completionMessage;
  }
  
  return '❌ Algo deu errado. Digite */start* para começar novamente.';
}

export function isInOnboardingV2(phoneNumber: string): boolean {
  return sessions.has(phoneNumber);
}

export function cancelOnboardingV2(phoneNumber: string): void {
  sessions.delete(phoneNumber);
}
