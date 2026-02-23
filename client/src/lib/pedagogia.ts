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

/**
 * Retorna true se o nome da matéria pertence ao Núcleo Duro.
 * Comparação case-insensitive e tolerante a variações leves de nome.
 */
export function isNucleoDuro(subjectName: string): boolean {
  const normalized = subjectName.trim().toLowerCase();
  return NUCLEO_DURO.some((nd) => normalized.includes(nd.toLowerCase()));
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
