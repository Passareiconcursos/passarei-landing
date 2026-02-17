/**
 * SM2 Engine — Algoritmo de Revisão Espaçada (SuperMemo 2)
 *
 * Lógica pura sem dependência de banco ou framework.
 * Usado por: Telegram bot + Sala de Aula
 *
 * Extraído de: server/telegram/database.ts (linhas 862-954)
 */

// ============================================
// INTERFACES
// ============================================

export interface SM2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
}

export interface SM2Input {
  quality: number;
  currentEF?: number;
  currentInterval?: number;
  repetitions?: number;
}

// ============================================
// CÁLCULO SM2
// ============================================

/**
 * Calcula os novos parâmetros SM2 baseado na qualidade da resposta
 * @param quality - Qualidade da resposta (0-5)
 *   0 - Resposta errada, não lembrou nada
 *   1 - Resposta errada, mas reconheceu após ver
 *   2 - Resposta errada, mas era familiar
 *   3 - Resposta correta com dificuldade
 *   4 - Resposta correta após hesitação
 *   5 - Resposta correta imediatamente
 * @param currentEF - Ease Factor atual (1.3 a 5.0, default 2.5)
 * @param currentInterval - Intervalo atual em dias (default 1)
 * @param repetitions - Repetições consecutivas corretas (default 0)
 */
export function calculateSM2(
  quality: number,
  currentEF: number = 2.5,
  currentInterval: number = 1,
  repetitions: number = 0,
): SM2Result {
  quality = Math.max(0, Math.min(5, Math.round(quality)));

  // Novo Ease Factor
  let newEF =
    currentEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEF = Math.max(1.3, newEF);

  let newInterval: number;
  let newRepetitions: number;

  if (quality < 3) {
    // Resposta incorreta — reiniciar
    newRepetitions = 0;
    newInterval = 1;
  } else {
    // Resposta correta — progresso
    newRepetitions = repetitions + 1;

    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(currentInterval * newEF);
    }
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    easeFactor: Math.round(newEF * 100) / 100,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate,
  };
}

// ============================================
// CONVERTER ACERTO/ERRO EM QUALITY SM2
// ============================================

/**
 * Converte acerto/erro simples em quality SM2 (0-5)
 * @param correct - Se acertou a questão
 * @param responseTimeMs - Tempo de resposta em ms (opcional)
 */
export function getQualityFromAnswer(
  correct: boolean,
  responseTimeMs?: number,
): number {
  if (!correct) {
    return 1; // Errou, mas viu a resposta
  }

  if (responseTimeMs) {
    if (responseTimeMs < 5000) return 5;  // < 5s = perfeito
    if (responseTimeMs < 15000) return 4; // < 15s = bom
    if (responseTimeMs < 30000) return 3; // < 30s = ok
  }

  return 4; // Default para acertos
}
