// ============================================
// CARGOS ESPECÍFICOS POR CONCURSO
// ============================================

export const CARGOS_POR_CONCURSO: Record<string, string[]> = {
  PM: [
    'Soldado',
    'Cabo',
    'Sargento',
    'Oficial (Tenente/Capitão/Major)',
    'Músico',
    'Outro'
  ],
  PC: [
    'Investigador',
    'Escrivão',
    'Delegado',
    'Papiloscopista',
    'Perito Criminal',
    'Agente de Telecomunicações',
    'Outro'
  ],
  PF: [
    'Agente',
    'Escrivão',
    'Delegado',
    'Papiloscopista',
    'Perito Criminal',
    'Outro'
  ],
  PRF: [
    'Policial Rodoviário Federal',
    'Agente Administrativo',
    'Outro'
  ]
};

export const MATERIAS_COMUNS = [
  'Português',
  'Raciocínio Lógico',
  'Informática',
  'Direito Constitucional',
  'Direito Administrativo',
  'Direito Penal',
  'Direito Processual Penal',
  'Legislação Específica',
  'Atualidades',
  'Matemática',
  'Física',
  'Química'
];

export function getCargosPorConcurso(examType: string): string[] {
  return CARGOS_POR_CONCURSO[examType] || [];
}

export function formatCargoOptions(cargos: string[]): string {
  return cargos.map((cargo, index) => `${String.fromCharCode(65 + index)}) ${cargo}`).join('\n');
}

export function formatMateriaOptions(materias: string[]): string {
  return materias.map((materia, index) => `${String.fromCharCode(65 + index)}) ${materia}`).join('\n');
}

export function parseLetterChoice(input: string, options: string[]): { valid: boolean; value?: string; error?: string } {
  const upper = input.toUpperCase().trim();
  
  // Aceitar letra (A, B, C...)
  if (upper.length === 1 && upper >= 'A' && upper <= 'Z') {
    const index = upper.charCodeAt(0) - 65;
    if (index >= 0 && index < options.length) {
      return { valid: true, value: options[index] };
    }
  }
  
  // Aceitar número (1, 2, 3...)
  const num = parseInt(upper);
  if (!isNaN(num) && num >= 1 && num <= options.length) {
    return { valid: true, value: options[num - 1] };
  }
  
  // Aceitar nome completo
  const found = options.find(opt => opt.toLowerCase() === input.toLowerCase());
  if (found) {
    return { valid: true, value: found };
  }
  
  return {
    valid: false,
    error: `⚠️ Opção inválida.\n\nDigite a *LETRA* (A, B, C...) ou o *NÚMERO* (1, 2, 3...)`
  };
}

export function parseMultipleChoice(input: string, options: string[]): { valid: boolean; values?: string[]; error?: string } {
  const parts = input.toUpperCase().trim().split(/[,\s]+/).filter(p => p);
  const selected: string[] = [];
  
  for (const part of parts) {
    const result = parseLetterChoice(part, options);
    if (!result.valid) {
      return {
        valid: false,
        error: `⚠️ Opção "${part}" inválida.\n\nDigite as *LETRAS* separadas por vírgula (ex: A, C, E)`
      };
    }
    if (result.value && !selected.includes(result.value)) {
      selected.push(result.value);
    }
  }
  
  if (selected.length === 0) {
    return {
      valid: false,
      error: '⚠️ Nenhuma opção válida selecionada.'
    };
  }
  
  return { valid: true, values: selected };
}
