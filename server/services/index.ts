/**
 * Services — Barrel export
 *
 * Camada de serviços compartilhada entre Telegram bot e Sala de Aula web.
 * Centraliza toda a lógica de negócio do Passarei.
 */

// Motor de IA (conteúdo enriquecido, explicações, geração de questões)
export {
  generateEnhancedContent,
  generateExplanation,
  generateQuestion,
  buildSmartFallback,
  type EnhancedContent,
  type ExplanationResult,
  type GeneratedQuestion,
} from "./ai-engine";

// Algoritmo SM2 (revisão espaçada — lógica pura)
export {
  calculateSM2,
  getQualityFromAnswer,
  type SM2Result,
  type SM2Input,
} from "./sm2-engine";

// Controle de acesso (planos, créditos, limites)
export {
  checkQuestionAccess,
  consumeQuestion,
  checkEssayAccess,
  consumeEssay,
  PLAN_LIMITS,
  type QuestionAccessResult,
  type EssayAccessResult,
} from "./access-control";

// Motor de questões (busca, matching, tentativas)
export {
  getQuestionForSubject,
  getQuestionForContent,
  recordQuestionAttempt,
  getMnemonicForContent,
  type MnemonicResult,
} from "./question-engine";

// Motor de aprendizado (conteúdo inteligente, progresso, relatórios)
export {
  getSmartContent,
  parseTextContent,
  generateSessionReport,
  getStudyProgress,
  saveStudyProgress,
  updateDifficultiesFromPerformance,
  recordSM2Review,
  getSM2DueReviews,
  updateUserOnboarding,
  type LearningSessionState,
  type ContentResult,
  type SessionReport,
} from "./learning-engine";
