// ============================================
// VALIDADORES DE ENTRADA
// ============================================

export const VALID_STATES: Record<string, string[]> = {
  'AC': ['AC', 'ac', 'Acre', 'acre', 'ACRE'],
  'AL': ['AL', 'al', 'Alagoas', 'alagoas', 'ALAGOAS'],
  'AP': ['AP', 'ap', 'Amapá', 'amapa', 'Amapa', 'AMAPÁ', 'AMAPA'],
  'AM': ['AM', 'am', 'Amazonas', 'amazonas', 'AMAZONAS'],
  'BA': ['BA', 'ba', 'Bahia', 'bahia', 'BAHIA'],
  'CE': ['CE', 'ce', 'Ceará', 'ceara', 'Ceara', 'CEARÁ', 'CEARA'],
  'DF': ['DF', 'df', 'Distrito Federal', 'distrito federal', 'DISTRITO FEDERAL'],
  'ES': ['ES', 'es', 'Espírito Santo', 'espirito santo', 'Espirito Santo', 'ESPÍRITO SANTO', 'ESPIRITO SANTO'],
  'GO': ['GO', 'go', 'Goiás', 'goias', 'Goias', 'GOIÁS', 'GOIAS'],
  'MA': ['MA', 'ma', 'Maranhão', 'maranhao', 'Maranhao', 'MARANHÃO', 'MARANHAO'],
  'MT': ['MT', 'mt', 'Mato Grosso', 'mato grosso', 'MATO GROSSO'],
  'MS': ['MS', 'ms', 'Mato Grosso do Sul', 'mato grosso do sul', 'MATO GROSSO DO SUL'],
  'MG': ['MG', 'mg', 'Minas Gerais', 'minas gerais', 'MINAS GERAIS'],
  'PA': ['PA', 'pa', 'Pará', 'para', 'Para', 'PARÁ', 'PARA'],
  'PB': ['PB', 'pb', 'Paraíba', 'paraiba', 'Paraiba', 'PARAÍBA', 'PARAIBA'],
  'PR': ['PR', 'pr', 'Paraná', 'parana', 'Parana', 'PARANÁ', 'PARANA'],
  'PE': ['PE', 'pe', 'Pernambuco', 'pernambuco', 'PERNAMBUCO'],
  'PI': ['PI', 'pi', 'Piauí', 'piaui', 'Piaui', 'PIAUÍ', 'PIAUI'],
  'RJ': ['RJ', 'rj', 'Rio de Janeiro', 'rio de janeiro', 'RIO DE JANEIRO'],
  'RN': ['RN', 'rn', 'Rio Grande do Norte', 'rio grande do norte', 'RIO GRANDE DO NORTE'],
  'RS': ['RS', 'rs', 'Rio Grande do Sul', 'rio grande do sul', 'RIO GRANDE DO SUL'],
  'RO': ['RO', 'ro', 'Rondônia', 'rondonia', 'Rondonia', 'RONDÔNIA', 'RONDONIA'],
  'RR': ['RR', 'rr', 'Roraima', 'roraima', 'RORAIMA'],
  'SC': ['SC', 'sc', 'Santa Catarina', 'santa catarina', 'SANTA CATARINA'],
  'SP': ['SP', 'sp', 'São Paulo', 'sao paulo', 'Sao Paulo', 'SÃO PAULO', 'SAO PAULO'],
  'SE': ['SE', 'se', 'Sergipe', 'sergipe', 'SERGIPE'],
  'TO': ['TO', 'to', 'Tocantins', 'tocantins', 'TOCANTINS'],
};

export const VALID_EXAMS: Record<string, string[]> = {
  'PM': ['PM', 'pm', 'Pm', 'Polícia Militar', 'policia militar', 'Policia Militar', 'POLÍCIA MILITAR', 'POLICIA MILITAR'],
  'PC': ['PC', 'pc', 'Pc', 'Polícia Civil', 'policia civil', 'Policia Civil', 'POLÍCIA CIVIL', 'POLICIA CIVIL'],
  'PF': ['PF', 'pf', 'Pf', 'Polícia Federal', 'policia federal', 'Policia Federal', 'POLÍCIA FEDERAL', 'POLICIA FEDERAL'],
  'PRF': ['PRF', 'prf', 'Prf', 'Polícia Rodoviária Federal', 'policia rodoviaria federal', 'Policia Rodoviaria Federal', 'POLÍCIA RODOVIÁRIA FEDERAL', 'POLICIA RODOVIARIA FEDERAL', 'Rodoviária Federal', 'rodoviaria federal'],
};

export const VALID_LEVELS = ['INICIANTE', 'INTERMEDIÁRIO', 'INTERMEDIARIO', 'AVANÇADO', 'AVANCADO'];

export const VALID_TIME_FRAMES = ['0-3 MESES', '0-3MESES', '3-6 MESES', '3-6MESES', '6-12 MESES', '6-12MESES', '12+ MESES', '12+MESES', 'MAIS DE 12 MESES'];

export function validateInput(
  input: string,
  validOptions: Record<string, string[]>,
  type: string
): { valid: boolean; normalized?: string; error?: string } {
  const trimmed = input.trim();

  for (const [key, values] of Object.entries(validOptions)) {
    if (values.some(v => v.toLowerCase() === trimmed.toLowerCase())) {
      return { valid: true, normalized: key };
    }
  }

  const keys = Object.keys(validOptions);
  return {
    valid: false,
    error: `⚠️ *${type} não reconhecido.*\n\nDigite a *SIGLA* (ex: ${keys[0]}) ou o *NOME COMPLETO*.`,
  };
}

export function validateLevel(input: string): { valid: boolean; normalized?: string; error?: string } {
  const upper = input.toUpperCase().trim();
  
  if (VALID_LEVELS.includes(upper)) {
    return { valid: true, normalized: upper };
  }

  return {
    valid: false,
    error: '⚠️ *Nível não reconhecido.*\n\nEscolha: *INICIANTE*, *INTERMEDIÁRIO* ou *AVANÇADO*',
  };
}

export function validateTimeFrame(input: string): { valid: boolean; normalized?: string; error?: string } {
  const upper = input.toUpperCase().trim().replace(/\s+/g, '');
  
  if (VALID_TIME_FRAMES.some(v => v.replace(/\s+/g, '') === upper)) {
    return { valid: true, normalized: upper };
  }

  return {
    valid: false,
    error: '⚠️ *Tempo não reconhecido.*\n\nDigite: *0-3 meses*, *3-6 meses*, *6-12 meses* ou *12+ meses*',
  };
}
