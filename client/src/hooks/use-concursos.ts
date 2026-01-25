/**
 * Hook para buscar concursos e cargos da API
 *
 * Uso:
 * const { concursos, loading, error } = useConcursos();
 * const { cargos, loading } = useCargos("PF");
 */

import { useState, useEffect, useCallback } from "react";

// Tipos
export interface Concurso {
  id: string;
  nome: string;
  sigla: string;
  descricao?: string;
  esfera: "FEDERAL" | "ESTADUAL" | "MUNICIPAL";
  examType: string;
  editalUrl?: string;
  siteOficial?: string;
  isActive: boolean;
  ordem: number;
}

export interface Cargo {
  id: string;
  nome: string;
  codigo: string;
  descricao?: string;
  escolaridade?: string;
  requisitos?: string;
  isActive: boolean;
  ordem: number;
  concursoSigla: string;
  concursoNome: string;
}

export interface Materia {
  id: string;
  nome: string;
  codigo: string;
  descricao?: string;
  peso: number;
  quantidadeQuestoes: number;
  topicos: string[];
  isActive: boolean;
  ordem: number;
  cargoNome: string;
  cargoCodigo: string;
  concursoSigla: string;
}

export interface ConcursosResponse {
  success: boolean;
  data: Concurso[];
  grouped: {
    FEDERAL: Concurso[];
    ESTADUAL: Concurso[];
    MUNICIPAL: Concurso[];
  };
  total: number;
}

export interface CargosResponse {
  success: boolean;
  data: Cargo[];
  total: number;
  concurso: string;
}

export interface MateriasResponse {
  success: boolean;
  data: Materia[];
  total: number;
  cargoId: string;
}

// Cache local para evitar requisições repetidas
const cache: {
  concursos: ConcursosResponse | null;
  cargos: Record<string, CargosResponse>;
  materias: Record<string, MateriasResponse>;
  timestamp: number;
} = {
  concursos: null,
  cargos: {},
  materias: {},
  timestamp: 0,
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function isCacheValid(): boolean {
  return Date.now() - cache.timestamp < CACHE_TTL;
}

/**
 * Hook para buscar todos os concursos
 */
export function useConcursos() {
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [grouped, setGrouped] = useState<ConcursosResponse["grouped"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConcursos = useCallback(async () => {
    // Usa cache se válido
    if (cache.concursos && isCacheValid()) {
      setConcursos(cache.concursos.data);
      setGrouped(cache.concursos.grouped);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/concursos");
      const data: ConcursosResponse = await response.json();

      if (data.success) {
        cache.concursos = data;
        cache.timestamp = Date.now();
        setConcursos(data.data);
        setGrouped(data.grouped);
      } else {
        throw new Error("Erro ao buscar concursos");
      }
    } catch (err: any) {
      console.error("[useConcursos] Erro:", err);
      setError(err.message || "Erro ao carregar concursos");
      // Retorna array vazio em caso de erro
      setConcursos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConcursos();
  }, [fetchConcursos]);

  return {
    concursos,
    grouped,
    loading,
    error,
    refetch: fetchConcursos,
  };
}

/**
 * Hook para buscar cargos de um concurso específico
 */
export function useCargos(concursoSigla: string | null) {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCargos = useCallback(async () => {
    if (!concursoSigla) {
      setCargos([]);
      return;
    }

    // Usa cache se válido
    const cacheKey = concursoSigla.toUpperCase();
    if (cache.cargos[cacheKey] && isCacheValid()) {
      setCargos(cache.cargos[cacheKey].data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/concursos/${concursoSigla}/cargos`);
      const data: CargosResponse = await response.json();

      if (data.success) {
        cache.cargos[cacheKey] = data;
        setCargos(data.data);
      } else {
        throw new Error("Erro ao buscar cargos");
      }
    } catch (err: any) {
      console.error("[useCargos] Erro:", err);
      setError(err.message || "Erro ao carregar cargos");
      setCargos([]);
    } finally {
      setLoading(false);
    }
  }, [concursoSigla]);

  useEffect(() => {
    fetchCargos();
  }, [fetchCargos]);

  return {
    cargos,
    loading,
    error,
    refetch: fetchCargos,
  };
}

/**
 * Hook para buscar matérias de um cargo específico
 */
export function useMaterias(cargoId: string | null) {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterias = useCallback(async () => {
    if (!cargoId) {
      setMaterias([]);
      return;
    }

    // Usa cache se válido
    if (cache.materias[cargoId] && isCacheValid()) {
      setMaterias(cache.materias[cargoId].data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/cargos/${cargoId}/materias`);
      const data: MateriasResponse = await response.json();

      if (data.success) {
        cache.materias[cargoId] = data;
        setMaterias(data.data);
      } else {
        throw new Error("Erro ao buscar matérias");
      }
    } catch (err: any) {
      console.error("[useMaterias] Erro:", err);
      setError(err.message || "Erro ao carregar matérias");
      setMaterias([]);
    } finally {
      setLoading(false);
    }
  }, [cargoId]);

  useEffect(() => {
    fetchMaterias();
  }, [fetchMaterias]);

  return {
    materias,
    loading,
    error,
    refetch: fetchMaterias,
  };
}

/**
 * Limpa o cache (útil após atualizações admin)
 */
export function clearConcursosCache() {
  cache.concursos = null;
  cache.cargos = {};
  cache.materias = {};
  cache.timestamp = 0;
}

/**
 * Formata concurso para exibição no MiniChat
 * Mantém compatibilidade com formato antigo
 */
export function formatConcursoForChat(concurso: Concurso): {
  id: string;
  label: string;
  group: string;
} {
  const icons: Record<string, string> = {
    PF: "🎯",
    PRF: "🚓",
    PP_FEDERAL: "🔒",
    PPF: "🔒",
    PL_FEDERAL: "🏛️",
    PLF: "🏛️",
    PM: "🚔",
    PC: "🕵️",
    PP_ESTADUAL: "🔐",
    PPE: "🔐",
    PL_ESTADUAL: "📜",
    CBM: "🚒",
    GM: "🛡️",
    ABIN: "🔍",
    EXERCITO: "⚔️",
    MARINHA: "⚓",
    FAB: "✈️",
    ANAC: "🛫",
    CPNU: "📋",
    PFF: "🚂",
    PJ_CNJ: "⚖️",
    MD: "🎖️",
    PC_CIENT: "🔬",
    GP: "🚢",
  };

  const icon = icons[concurso.sigla] || "📌";

  return {
    id: concurso.sigla,
    label: `${icon} ${concurso.sigla} - ${concurso.nome}`,
    group: concurso.esfera === "FEDERAL" ? "Federal" :
           concurso.esfera === "ESTADUAL" ? "Estadual" : "Municipal",
  };
}

/**
 * Formata cargo para exibição no MiniChat
 */
export function formatCargoForChat(cargo: Cargo): {
  id: string;
  label: string;
} {
  const icons: Record<string, string> = {
    DELEGADO: "👔",
    AGENTE: "🎯",
    ESCRIVAO: "📝",
    PERITO: "🔬",
    SOLDADO: "⭐",
    OFICIAL: "🎖️",
    POLICIAL: "🚔",
    GUARDA: "🛡️",
    INSPETOR: "📋",
  };

  // Tenta encontrar ícone pelo código ou nome
  let icon = "👤";
  for (const [key, value] of Object.entries(icons)) {
    if (cargo.codigo.toUpperCase().includes(key) ||
        cargo.nome.toUpperCase().includes(key)) {
      icon = value;
      break;
    }
  }

  return {
    id: cargo.codigo,
    label: `${icon} ${cargo.nome}`,
  };
}
