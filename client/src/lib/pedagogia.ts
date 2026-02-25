/**
 * Configuração Pedagógica — Passarei
 *
 * Constantes que definem a lógica de priorização de conteúdo
 * e estrutura de aprendizagem da plataforma.
 */

// ─────────────────────────────────────────────────────────────────────────────
// NÚCLEO DURO
// Matérias de alta recorrência em concursos policiais/federais.
// Usadas para priorizar a ordem de exibição na sidebar de fases e no
// plano de estudo gerado automaticamente. O aluno sempre verá essas
// matérias primeiro, independentemente do edital específico.
// ─────────────────────────────────────────────────────────────────────────────
export const NUCLEO_DURO: string[] = [
  "Língua Portuguesa",
  "Direito Constitucional",
  "Direito Administrativo",
  "Raciocínio Lógico",
  "Informática",
];

// Palavras-chave que identificam matérias do Núcleo Duro, funcionando tanto com
// nomes exibíveis ("Direito Administrativo") quanto com códigos internos ("DIREITO_ADMINISTRATIVO").
const NUCLEO_DURO_KEYWORDS: string[] = [
  "portugu",        // Língua Portuguesa, LINGUA_PORTUGUESA, PORTUGUES
  "constitucional", // Direito Constitucional, DIREITO_CONSTITUCIONAL
  "administrat",    // Direito Administrativo, DIREITO_ADMINISTRATIVO
  "raciocin",       // Raciocínio Lógico, RACIOCINIO_LOGICO
  "logico",         // Raciocínio Lógico
  "informatica",    // Informática, INFORMATICA
];

/**
 * Retorna true se o nome da matéria pertence ao Núcleo Duro.
 * Tolerante a: acentos, maiúsculas/minúsculas, underscores (códigos internos).
 */
export function isNucleoDuro(subjectName: string): boolean {
  const cleaned = subjectName
    .trim()
    .toLowerCase()
    .replace(/_/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // remove diacritics
  return NUCLEO_DURO_KEYWORDS.some((kw) => cleaned.includes(kw));
}

/**
 * Ordena uma lista de matérias colocando o Núcleo Duro primeiro,
 * mantendo a ordem relativa dentro de cada grupo.
 */
export function sortByNucleoDuro<T extends { name: string }>(subjects: T[]): T[] {
  return [...subjects].sort((a, b) => {
    const aIsND = isNucleoDuro(a.name) ? 0 : 1;
    const bIsND = isNucleoDuro(b.name) ? 0 : 1;
    return aIsND - bIsND;
  });
}
