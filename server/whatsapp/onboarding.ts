import twilio from 'twilio';
import { validateInput, validateLevel, validateTimeFrame, VALID_EXAMS, VALID_STATES } from './validators';

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
}

// Sessões em memória (por enquanto)
const sessions = new Map<string, OnboardingSession>();

// ============================================
// MENSAGENS DO ONBOARDING
// ============================================
function getWelcomeMessage(name: string): string {
  return (
    `🎯 *BEM-VINDO AO PASSAREI, ${name.toUpperCase()}!*\n\n` +
    `Vou te fazer *5 perguntas rápidas* para criar seu plano de estudos personalizado.\n\n` +
    `📝 *Pergunta 1/5:*\n` +
    `Para qual concurso você está estudando?\n\n` +
    `Digite:\n` +
    `• *PM* (Polícia Militar)\n` +
    `• *PC* (Polícia Civil)\n` +
    `• *PF* (Polícia Federal)\n` +
    `• *PRF* (Polícia Rodoviária Federal)`
  );
}

function getStateMessage(): string {
  return (
    `📝 *Pergunta 2/5:*\n` +
    `Qual estado?\n\n` +
    `Digite a *SIGLA* (ex: SP) ou *NOME COMPLETO* (ex: São Paulo):`
  );
}

function getCargoMessage(): string {
  return (
    `📝 *Pergunta 3/5:*\n` +
    `Qual cargo pretende?\n\n` +
    `Exemplos:\n` +
    `• Soldado\n` +
    `• Investigador\n` +
    `• Agente\n` +
    `• Delegado\n` +
    `• Papiloscopista`
  );
}

function getNivelMessage(): string {
  return (
    `📝 *Pergunta 4/5:*\n` +
    `Qual seu nível de conhecimento?\n\n` +
    `Digite:\n` +
    `• *INICIANTE*\n` +
    `• *INTERMEDIÁRIO*\n` +
    `• *AVANÇADO*`
  );
}

function getTempoMessage(): string {
  return (
    `📝 *Pergunta 5/5 (ÚLTIMA!):*\n` +
    `Quanto tempo até a prova?\n\n` +
    `Digite:\n` +
    `• *0-3 meses*\n` +
    `• *3-6 meses*\n` +
    `• *6-12 meses*\n` +
    `• *12+ meses*`
  );
}

function getCompletionMessage(session: OnboardingSession, name: string): string {
  return (
    `🎉 *PERFIL CRIADO COM SUCESSO!*\n\n` +
    `📊 *SEU RESUMO:*\n` +
    `✓ Concurso: *${session.examType}*\n` +
    `✓ Estado: *${session.state}*\n` +
    `✓ Cargo: *${session.cargo}*\n` +
    `✓ Nível: *${session.nivel}*\n` +
    `✓ Tempo: *${session.tempoDisponivel}*\n\n` +
    `📚 *PLANO FREE ATIVADO*\n` +
    `• 2 matérias por dia\n` +
    `• 2 correções de exercícios\n\n` +
    `⏰ Preparando sua primeira aula...\n\n` +
    `💪 Em instantes você receberá o primeiro conteúdo personalizado!\n\n` +
    `_Digite "ajuda" a qualquer momento para ver comandos disponíveis._`
  );
}

// ============================================
// LÓGICA DO ONBOARDING
// ============================================
export function handleOnboarding(phoneNumber: string, message: string, name: string): string {
  let session = sessions.get(phoneNumber);
  
  // Iniciar onboarding
  if (!session || message.toLowerCase() === '/start' || message.toLowerCase() === 'começar') {
    session = { step: 0 };
    sessions.set(phoneNumber, session);
    session.step = 1;
    return getWelcomeMessage(name);
  }
  
  // STEP 1: Concurso
  if (session.step === 1) {
    const validation = validateInput(message, VALID_EXAMS, 'Concurso');
    if (!validation.valid) {
      return validation.error!;
    }
    
    session.examType = validation.normalized;
    session.step = 2;
    return `✅ *${validation.normalized} confirmado!*\n\n` + getStateMessage();
  }
  
  // STEP 2: Estado
  if (session.step === 2) {
    const validation = validateInput(message, VALID_STATES, 'Estado');
    if (!validation.valid) {
      return validation.error!;
    }
    
    session.state = validation.normalized;
    session.step = 3;
    return `✅ *${validation.normalized} confirmado!*\n\n` + getCargoMessage();
  }
  
  // STEP 3: Cargo (livre)
  if (session.step === 3) {
    const cargo = message.trim();
    if (cargo.length < 3) {
      return '⚠️ Cargo muito curto. Digite o nome do cargo (ex: Soldado, Investigador):';
    }
    
    session.cargo = cargo;
    session.step = 4;
    return `✅ *${cargo} confirmado!*\n\n` + getNivelMessage();
  }
  
  // STEP 4: Nível
  if (session.step === 4) {
    const validation = validateLevel(message);
    if (!validation.valid) {
      return validation.error!;
    }
    
    session.nivel = validation.normalized;
    session.step = 5;
    return `✅ *${validation.normalized} confirmado!*\n\n` + getTempoMessage();
  }
  
  // STEP 5: Tempo (FINAL)
  if (session.step === 5) {
    const validation = validateTimeFrame(message);
    if (!validation.valid) {
      return validation.error!;
    }
    
    session.tempoDisponivel = validation.normalized;
    
    // TODO: Salvar no banco de dados
    const completionMessage = getCompletionMessage(session, name);
    
    // Limpar sessão
    sessions.delete(phoneNumber);
    
    return completionMessage;
  }
  
  return '❌ Algo deu errado. Digite */start* para começar novamente.';
}

// Verificar se usuário está em onboarding
export function isInOnboarding(phoneNumber: string): boolean {
  return sessions.has(phoneNumber);
}

// Cancelar onboarding
export function cancelOnboarding(phoneNumber: string): void {
  sessions.delete(phoneNumber);
}
