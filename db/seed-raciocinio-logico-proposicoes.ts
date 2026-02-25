/**
 * Seed: Raciocínio Lógico — Proposições e Operadores Lógicos
 *
 * Popula 6 átomos de Conteúdo + 12 Questões vinculadas.
 * Idempotente: verifica existência antes de inserir.
 *
 * Execução:
 *   npx tsx db/seed-raciocinio-logico-proposicoes.ts
 */

import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

// ============================================
// HELPERS
// ============================================

function nanoId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

async function findSubject(name: string): Promise<string | null> {
  const rows = await db.execute(sql`
    SELECT id FROM "Subject" WHERE name ILIKE ${"%" + name + "%"} LIMIT 1
  `) as any[];
  return rows[0]?.id ?? null;
}

async function findOrCreateTopic(name: string, subjectId: string): Promise<string> {
  const rows = await db.execute(sql`
    SELECT id FROM "Topic" WHERE name ILIKE ${name} AND "subjectId" = ${subjectId} LIMIT 1
  `) as any[];
  if (rows[0]?.id) return rows[0].id;

  const id = nanoId("tp");
  await db.execute(sql`
    INSERT INTO "Topic" (id, name, "subjectId", "createdAt", "updatedAt")
    VALUES (${id}, ${name}, ${subjectId}, NOW(), NOW())
  `);
  console.log(`  ✅ Tópico criado: ${name} (${id})`);
  return id;
}

async function contentExists(title: string, subjectId: string): Promise<boolean> {
  const rows = await db.execute(sql`
    SELECT id FROM "Content" WHERE title = ${title} AND "subjectId" = ${subjectId} LIMIT 1
  `) as any[];
  return rows.length > 0;
}

async function questionExists(id: string): Promise<boolean> {
  const rows = await db.execute(sql`
    SELECT id FROM "Question" WHERE id = ${id} LIMIT 1
  `) as any[];
  return rows.length > 0;
}

// ============================================
// CONTEÚDOS (6 átomos)
// ============================================

interface ContentAtom {
  id: string;
  title: string;
  textContent: string;
  mnemonic: string;
  keyPoint: string;
  practicalExample: string;
  difficulty: string;
}

const contents: ContentAtom[] = [
  {
    id: "rl_prop_c01",
    title: "Proposição Lógica — Conceito e Valor Lógico",
    textContent: `Uma proposição lógica é um enunciado declarativo que pode ser classificado como VERDADEIRO (V) ou FALSO (F), nunca os dois ao mesmo tempo (princípio da não contradição) e nunca neutro (princípio do terceiro excluído).

PONTOS-CHAVE:
• Enunciados declarativos → são proposições: "O Brasil é uma república." (V); "2 + 2 = 5" (F)
• Não são proposições: perguntas ("Quantos anos você tem?"), exclamações ("Que calor!"), ordens ("Feche a porta!") e paradoxos ("Esta frase é falsa.")
• Proposição SIMPLES (atômica): um único enunciado, sem conectivos. Simbolizada por p, q, r...
• Proposição COMPOSTA (molecular): duas ou mais proposições simples ligadas por conectivos lógicos (¬, ∧, ∨, →, ↔)
• Valor lógico: V = Verdadeiro | F = Falso

EXEMPLO:
"A PF é subordinada ao Ministério da Justiça." → Proposição simples, valor lógico VERDADEIRO.
"Está chovendo?" → NÃO é proposição (é pergunta).

DICA BANCA:
CESPE/CEBRASPE adora questões como: "Classifique como proposição ou não-proposição: 'Todos os candidatos aprovados serão convocados.'" — É proposição (declarativa + valor lógico definido).`,
    mnemonic: "PVF — Proposição → Verdadeiro ou Falso. Dec-la-ra-ti-va: DEClaro que é V ou F.",
    keyPoint: "Proposição: enunciado declarativo com valor V ou F. Perguntas, exclamações e ordens NÃO são proposições",
    practicalExample: "'Brasília é a capital do Brasil' = proposição V. 'Venha agora!' = não é proposição (ordem)",
    difficulty: "FACIL",
  },
  {
    id: "rl_prop_c02",
    title: "Negação (¬p) — Invertendo o Valor Lógico",
    textContent: `A negação é o operador unário que inverte o valor lógico de uma proposição. Representa-se por ¬p, ~p ou "NÃO p".

PONTOS-CHAVE:
• Tabela verdade: se p = V, então ¬p = F; se p = F, então ¬p = V
• Negação de "Todo A é B" → "Algum A NÃO é B" (não é "Nenhum A é B"!)
• Negação de "Algum A é B" → "Nenhum A é B" (= Todo A NÃO é B)
• Negação de "Existe pelo menos um A que é B" → "Nenhum A é B"
• Dupla negação: ¬(¬p) = p (equivalência lógica)
• Negação de proposição composta: aplica Lei de De Morgan

EXEMPLO:
p = "Todos os agentes são aprovados." (V)
¬p = "Algum agente NÃO é aprovado." (F) — NÃO "Nenhum agente é aprovado."

DICA BANCA:
CEBRASPE cobra muito a negação de proposições com quantificadores universais e existenciais. A pegadinha clássica é negar "Todo A é B" como "Nenhum A é B" — ERRADO! O correto é "Algum A NÃO é B".`,
    mnemonic: "¬ = Não. TROCA o valor. Todo→AlgumNão; AlgumÉ→NenhumÉ. (Guarde: T troca com AÑ; A troca com N)",
    keyPoint: "¬p inverte V↔F. Negação de 'Todo A é B' = 'Algum A NÃO é B' (não 'Nenhum')",
    practicalExample: "p: 'Todo policial é aprovado' → ¬p: 'Algum policial NÃO é aprovado'. ERRADO negar como 'Nenhum policial é aprovado'",
    difficulty: "FACIL",
  },
  {
    id: "rl_prop_c03",
    title: "Conjunção (p ∧ q) — O 'E' Lógico",
    textContent: `A conjunção une duas proposições pelo conectivo "E" (∧). A proposição composta p ∧ q só é VERDADEIRA quando AMBAS as componentes são verdadeiras.

PONTOS-CHAVE:
• Símbolo: ∧ (lê-se "e")
• Regra de ouro: V ∧ V = V; qualquer F → resultado F
• Tabela verdade completa:
  p=V, q=V → V ∧ V = V
  p=V, q=F → V ∧ F = F
  p=F, q=V → F ∧ V = F
  p=F, q=F → F ∧ F = F
• Conjunção é comutativa: p ∧ q ≡ q ∧ p
• Negação (De Morgan): ¬(p ∧ q) ≡ ¬p ∨ ¬q

EXEMPLO:
p: "O candidato foi aprovado na prova escrita." (V)
q: "O candidato foi aprovado na prova física." (F)
p ∧ q: "O candidato foi aprovado na prova escrita E na prova física." → FALSO (basta uma F para o todo ser F)

DICA BANCA:
Identifique a conjunção em enunciados naturais por palavras como: "e", "mas", "porém", "contudo", "além disso", "embora". Todas funcionam como ∧ na lógica, independente do sentido discursivo.`,
    mnemonic: "∧ = AND. Mesinha: ∧ parece um telhado sustentado por DUAS colunas — precisa das DUAS para ficar em pé (V só com V∧V)",
    keyPoint: "p ∧ q: verdadeira SÓ quando p=V E q=V. Uma F basta para tornar a conjunção F",
    practicalExample: "Aprovado escrita (V) ∧ aprovado física (F) = F. Ambas as provas precisam ser V para o resultado ser V",
    difficulty: "FACIL",
  },
  {
    id: "rl_prop_c04",
    title: "Disjunção (p ∨ q) — O 'OU' Lógico",
    textContent: `A disjunção une duas proposições pelo conectivo "OU" (∨). A proposição composta p ∨ q só é FALSA quando AMBAS as componentes são falsas.

PONTOS-CHAVE:
• Símbolo: ∨ (lê-se "ou")
• Regra de ouro: F ∨ F = F; qualquer V → resultado V
• Tabela verdade:
  p=V, q=V → V ∨ V = V
  p=V, q=F → V ∨ F = V
  p=F, q=V → F ∨ V = V
  p=F, q=F → F ∨ F = F
• Disjunção INCLUSIVA (∨): "ou um ou outro ou ambos" — é a padrão em lógica
• Disjunção EXCLUSIVA (⊕): "ou um ou outro, mas não ambos"
• Negação (De Morgan): ¬(p ∨ q) ≡ ¬p ∧ ¬q

EXEMPLO:
p: "O candidato passa no oral OU na redação."
p=V, q=F → V ∨ F = V (basta um ser verdadeiro)
p=F, q=F → F ∨ F = F (nenhum dos dois)

DICA BANCA:
A disjunção padrão em provas é inclusiva. Quando a questão quiser exclusiva, ela dirá "ou um ou outro, mas não ambos". Não confundir ∨ (inclusivo, mais comum) com ⊕ (exclusivo). De Morgan: ¬(p ∨ q) = ¬p ∧ ¬q — inverte ∨ para ∧ ao negar.`,
    mnemonic: "∨ = OR. Copa do V de Vitória: basta UMA vitória (V) para ganhar. Perde só quando AMBAS são F",
    keyPoint: "p ∨ q: falsa SÓ quando p=F E q=F. Um V basta para tornar a disjunção V",
    practicalExample: "Aprovado oral (F) ∨ aprovado redação (F) = F. Se passar em qualquer um, o 'ou' já é V",
    difficulty: "FACIL",
  },
  {
    id: "rl_prop_c05",
    title: "Condicional (p → q) — O 'Se... Então'",
    textContent: `O condicional (p → q) expressa uma relação de condição: "Se p, então q". É FALSO SOMENTE quando a hipótese (p) é verdadeira e a conclusão (q) é falsa.

PONTOS-CHAVE:
• Símbolo: → (lê-se "se p, então q")
• p = antecedente/hipótese; q = consequente/conclusão
• Regra de ouro: p→q é FALSO apenas quando p=V e q=F
• Tabela verdade:
  V→V = V | V→F = F | F→V = V | F→F = V
• Frase falsa: "Promessa descumprida" — prometeu (p=V) e não cumpriu (q=F)
• Equivalências importantes:
  p → q ≡ ¬p ∨ q (toda condicional é equivalente a uma disjunção)
  p → q ≡ ¬q → ¬p (contrapositiva — sempre equivalente)
• Negação: ¬(p → q) ≡ p ∧ ¬q

EXEMPLO:
p = "O candidato passa no concurso" (V); q = "O candidato é nomeado" (F, não há vaga)
p → q: "Se o candidato passa, então é nomeado." → FALSO (p=V, q=F)

DICA BANCA:
CESPE cobra muito a contrapositiva e a negação do condicional. "Se chove, a rua molha" — negação: "Chove E a rua NÃO molha" (p ∧ ¬q). A recíproca (q→p) NÃO é equivalente ao original.`,
    mnemonic: "Condicional = Promessa. Falha SOMENTE ao prometer (V) e não cumprir (F). VF=F, o resto V.",
    keyPoint: "p→q FALSO somente quando p=V e q=F. Equivale a ¬p∨q. Negação: p∧¬q",
    practicalExample: "'Se estudar (V), então passa (F por motivo externo)' → p→q FALSO. Contrapositiva: 'Se não passar → não estudou' (equivalente)",
    difficulty: "MEDIO",
  },
  {
    id: "rl_prop_c06",
    title: "Bicondicional (p ↔ q) — O 'Se e Somente Se'",
    textContent: `O bicondicional (p ↔ q) é verdadeiro quando as proposições têm o MESMO valor lógico (ambas V ou ambas F). Lê-se "p se e somente se q".

PONTOS-CHAVE:
• Símbolo: ↔ (lê-se "se e somente se", "SSe")
• Regra de ouro: V↔V = V; F↔F = V; V↔F = F; F↔V = F
• Tabela verdade:
  V↔V = V | V↔F = F | F↔V = F | F↔F = V
• Equivalência: p ↔ q ≡ (p → q) ∧ (q → p)
• Negação: ¬(p ↔ q) ≡ p ↔ ¬q ≡ ¬p ↔ q (XOR — valores opostos)
• Bicondicional como dupla implicação: "p é condição necessária e suficiente para q"

EXEMPLO:
p: "O número é par" ↔ q: "O número é divisível por 2"
p=V, q=V → V↔V = V (ambos verdadeiros → bicondicional V)
p=V (par), q=F (divisível por 3) → V↔F = F (valores diferentes → bicondicional F)

DICA BANCA:
O bicondicional aparece em questões como: "A operação é realizada se e somente se há autorização." Valores iguais = V; valores opostos = F. Mnemônico: ↔ é como um espelho — se os dois lados refletem o mesmo (V=V ou F=F), dá V.`,
    mnemonic: "↔ = SSe (Se e Somente Se). ESPELHO: V↔V=V e F↔F=V. Diferentes (V↔F ou F↔V) = F",
    keyPoint: "p↔q: V quando mesmo valor (V,V ou F,F). F quando valores opostos. Equivale a (p→q)∧(q→p)",
    practicalExample: "'Aprovado no concurso SSe for nomeado': ambos V→V; um V outro F → bicondicional F",
    difficulty: "MEDIO",
  },
];

// ============================================
// QUESTÕES (12)
// ============================================

interface Alternative {
  letter: string;
  text: string;
}

interface QuestionData {
  id: string;
  statement: string;
  questionType: string;
  alternatives: Alternative[];
  correctAnswer: string;
  correctOption: number;
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: string;
}

const questions: QuestionData[] = [
  // ── Q1–Q4: FÁCIL (Municipal/GM) ──────────────────────────────────────────
  {
    id: "rl_prop_q01",
    statement:
      "Qual dos enunciados abaixo NÃO constitui uma proposição lógica?",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Todo número par é divisível por 2." },
      { letter: "B", text: "A PF realiza investigações de crimes federais." },
      { letter: "C", text: "Quantos candidatos foram aprovados no concurso?" },
      { letter: "D", text: "O Brasil tem mais de 200 milhões de habitantes." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Proposição é um enunciado declarativo com valor lógico V ou F. Perguntas, ordens e exclamações não são proposições. 'Quantos candidatos foram aprovados?' é uma pergunta — não tem valor lógico definido, portanto NÃO é proposição.",
    explanationCorrect:
      "Correto! Perguntas não são proposições — não se pode atribuir V ou F a elas. As alternativas A, B e D são enunciados declarativos com valores lógicos definidos.",
    explanationWrong:
      "Atenção: proposição é enunciado declarativo com valor V ou F. Perguntas (C), exclamações e ordens NÃO são proposições. As demais alternativas são declarativas e têm valor lógico.",
    difficulty: "FACIL",
  },
  {
    id: "rl_prop_q02",
    statement:
      "Seja p: 'Todos os aprovados serão nomeados.' A negação lógica de p é:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Nenhum aprovado será nomeado." },
      { letter: "B", text: "Algum aprovado não será nomeado." },
      { letter: "C", text: "Nenhum aprovado não será nomeado." },
      { letter: "D", text: "Todos os aprovados não serão nomeados." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Negar 'Todo A é B' resulta em 'Algum A NÃO é B' (existencial negativo). A negação de quantificador universal 'todo' é o existencial 'algum... não'. A alternativa A ('Nenhum') é o contrário extremo, não a negação lógica.",
    explanationCorrect:
      "Correto! Negação de 'Todo A é B' = 'Algum A NÃO é B'. Isso basta para falsificar a universal: encontrar um contra-exemplo (algum).",
    explanationWrong:
      "Cuidado: a negação de 'Todo A é B' NÃO é 'Nenhum A é B'. O correto é 'Algum A NÃO é B'. 'Nenhum' seria uma afirmação muito mais forte que a simples negação.",
    difficulty: "FACIL",
  },
  {
    id: "rl_prop_q03",
    statement:
      "Considerando p = V e q = F, qual é o valor lógico de (p ∧ q)?",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Verdadeiro, pois p é verdadeiro." },
      { letter: "B", text: "Falso, pois q é falso — e a conjunção exige ambas verdadeiras." },
      { letter: "C", text: "Verdadeiro, pois pelo menos uma é verdadeira." },
      { letter: "D", text: "Indefinido, pois os valores são opostos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A conjunção (∧) é verdadeira SOMENTE quando AMBAS as proposições são verdadeiras. Como q = F, independentemente do valor de p, p ∧ q = F.",
    explanationCorrect:
      "Correto! p ∧ q = V ∧ F = F. A conjunção exige V ∧ V para ser verdadeira. Basta uma componente falsa para o todo ser falso.",
    explanationWrong:
      "Atenção: a conjunção (∧ = 'e') exige que AMBAS sejam V. Não basta 'pelo menos uma'. V ∧ F = F — esse é o resultado da tabela verdade.",
    difficulty: "FACIL",
  },
  {
    id: "rl_prop_q04",
    statement:
      "Com p = F e q = F, qual é o valor lógico da disjunção (p ∨ q)?",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Verdadeiro, pois qualquer 'ou' torna verdadeiro." },
      { letter: "B", text: "Verdadeiro, pois F ∨ F equivale a dupla negação." },
      { letter: "C", text: "Falso, pois a disjunção é falsa somente quando ambas são falsas." },
      { letter: "D", text: "Indefinido." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "A disjunção (∨) é FALSA somente quando ambas as proposições são falsas: F ∨ F = F. Com p=F e q=F, o resultado é F.",
    explanationCorrect:
      "Correto! F ∨ F = F. A disjunção só é falsa nesse único caso (ambas F). Qualquer outro par (com pelo menos um V) daria V.",
    explanationWrong:
      "Atenção: na disjunção (∨ = 'ou'), QUALQUER V basta para o resultado ser V. Mas quando p=F e q=F, o resultado é F. Não existe 'dupla negação' na disjunção.",
    difficulty: "FACIL",
  },

  // ── Q5–Q8: MÉDIO (Estadual/PC/PM) ────────────────────────────────────────
  {
    id: "rl_prop_q05",
    statement:
      "O condicional p → q é FALSO somente quando:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "p é Falso e q é Verdadeiro." },
      { letter: "B", text: "p é Verdadeiro e q é Falso." },
      { letter: "C", text: "p é Falso e q é Falso." },
      { letter: "D", text: "p é Verdadeiro e q é Verdadeiro." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O condicional p → q é falso SOMENTE quando o antecedente p é verdadeiro e o consequente q é falso (V → F = F). Nos demais casos (F→V, F→F, V→V), o condicional é sempre verdadeiro.",
    explanationCorrect:
      "Correto! p→q = F apenas no caso V→F. Mnemônico: 'Promessa quebrada' — prometeu (p=V) mas não cumpriu (q=F). Nos demais casos é sempre verdadeiro.",
    explanationWrong:
      "Atenção: no condicional, F→qualquer_coisa = V (promessa não feita nunca é quebrada). O único caso falso é V→F (prometeu e não cumpriu).",
    difficulty: "MEDIO",
  },
  {
    id: "rl_prop_q06",
    statement:
      "Qual é a negação lógica do condicional p → q?",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "¬p → ¬q" },
      { letter: "B", text: "q → p" },
      { letter: "C", text: "p ∧ ¬q" },
      { letter: "D", text: "¬p ∨ ¬q" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "¬(p → q) = p ∧ ¬q. Isso decorre do fato de que p→q ≡ ¬p∨q; sua negação via De Morgan é ¬(¬p∨q) = p ∧ ¬q. Também corresponde ao único caso que falsifica o condicional: p=V e q=F.",
    explanationCorrect:
      "Correto! ¬(p→q) = p ∧ ¬q. Lembra do único caso falso: V→F. A negação captura exatamente esse caso: 'p é verdadeiro E q é falso'.",
    explanationWrong:
      "Atenção: ¬p→¬q é a inversão (não equivalente). q→p é a recíproca (não equivalente). ¬p∨¬q é a negação de uma conjunção (De Morgan para ∧). A negação de p→q é p ∧ ¬q.",
    difficulty: "MEDIO",
  },
  {
    id: "rl_prop_q07",
    statement:
      "Com p = V e q = F, qual é o valor lógico do bicondicional (p ↔ q)?",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Verdadeiro, pois p é verdadeiro." },
      { letter: "B", text: "Verdadeiro, pois basta um ser verdadeiro." },
      { letter: "C", text: "Falso, pois os valores são opostos (V ≠ F)." },
      { letter: "D", text: "Falso, pois p é verdadeiro e q é falso, e o condicional V→F é falso." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O bicondicional é verdadeiro quando AMBAS têm o mesmo valor lógico. Com p=V e q=F, os valores são DIFERENTES → p ↔ q = F. A alternativa D confunde bicondicional com condicional — apesar de chegar no resultado correto (F), o motivo está errado.",
    explanationCorrect:
      "Correto! V ↔ F = F porque os valores são DIFERENTES. O bicondicional é o 'espelho': V↔V=V; F↔F=V; opostos = F.",
    explanationWrong:
      "Lembre: o bicondicional (↔) exige que os dois tenham o MESMO valor lógico. V↔F = F porque são opostos. A alternativa D está certa no resultado mas errada no raciocínio — não confunda ↔ com →.",
    difficulty: "MEDIO",
  },
  {
    id: "rl_prop_q08",
    statement:
      "A contrapositiva do condicional p → q é:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "q → p (recíproca)" },
      { letter: "B", text: "¬p → ¬q (inversão)" },
      { letter: "C", text: "¬q → ¬p (contrapositiva)" },
      { letter: "D", text: "p ∧ ¬q (negação)" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "A contrapositiva de p → q é ¬q → ¬p. É a única equivalente lógica ao condicional original. A recíproca (q→p) e a inversão (¬p→¬q) são equivalentes entre si, mas NÃO equivalentes ao original.",
    explanationCorrect:
      "Correto! Contrapositiva: inverte E nega ambos. p→q ≡ ¬q→¬p. Macete: 'COntra = COloca ao contrário e nega'.",
    explanationWrong:
      "Atenção: recíproca (q→p) = inverte sem negar; inversão (¬p→¬q) = nega sem inverter; contrapositiva (¬q→¬p) = inverte E nega. Apenas a contrapositiva é logicamente equivalente ao original.",
    difficulty: "MEDIO",
  },

  // ── Q9–Q12: DIFÍCIL (Federal/PF/PRF — Q9 CERTO/ERRADO CEBRASPE) ──────────
  {
    id: "rl_prop_q09",
    statement:
      "(CEBRASPE – PF – Adaptada) Julgue o item:\n\nSeja a proposição composta: 'Se o candidato é aprovado na prova objetiva e na prova discursiva, então será convocado para a investigação de saúde.' Considerando que o candidato foi aprovado na prova objetiva, foi reprovado na prova discursiva e foi convocado para a investigação de saúde, a proposição composta é VERDADEIRA.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Simbolizando: p = aprovado na objetiva (V), q = aprovado na discursiva (F), r = convocado (V). A proposição é (p ∧ q) → r. O antecedente é p ∧ q = V ∧ F = F. Um condicional com antecedente FALSO é sempre VERDADEIRO, independentemente do valor de r. Portanto, (F) → r = V.",
    explanationCorrect:
      "Correto marcado como CERTO! (p∧q)→r: como q=F, o antecedente p∧q=F. Condicional com antecedente F é sempre V ('promessa não foi feita, não pode ser quebrada').",
    explanationWrong:
      "Este item é CERTO. (p∧q)→r: o antecedente p∧q = V∧F = F. Condicional F→qualquer = V. Não importa o valor de r — quando o antecedente é falso, o condicional é sempre verdadeiro.",
    difficulty: "DIFICIL",
  },
  {
    id: "rl_prop_q10",
    statement:
      "Considere as proposições: p: 'O suspeito estava no local do crime.' e q: 'O suspeito tem álibi comprovado.' Sabe-se que p → ¬q é VERDADEIRO e que p é VERDADEIRO. Qual é o valor lógico de q?",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "q = Verdadeiro, pois p sendo V reforça todas as proposições." },
      { letter: "B", text: "q = Falso, pois se p=V e p→¬q=V, então ¬q=V, logo q=F." },
      { letter: "C", text: "q = Verdadeiro, pois ¬q sendo V significa que q também é V por dupla negação." },
      { letter: "D", text: "Não é possível determinar o valor de q apenas com essas informações." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Como p=V e p→¬q=V: quando o antecedente é V, para o condicional ser V, o consequente DEVE ser V. Logo, ¬q=V, o que significa q=F. O suspeito estava no local (p=V) e a implicação é verdadeira, portanto ¬q=V, ou seja, q=F (não tem álibi).",
    explanationCorrect:
      "Correto! p=V e p→¬q=V → ¬q deve ser V (pois V→V=V). Como ¬q=V, então q=F. O modus ponens: p, p→¬q ⊢ ¬q.",
    explanationWrong:
      "Atenção: para p→¬q ser V quando p=V, é necessário que ¬q=V (pois V→F=F quebraria o condicional). Portanto ¬q=V → q=F. Dupla negação: ¬(¬q)=q, então se ¬q=V, q=F — NÃO é V por dupla negação.",
    difficulty: "DIFICIL",
  },
  {
    id: "rl_prop_q11",
    statement:
      "Pela Lei de De Morgan, a negação de (p ∨ q) é equivalente a:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "¬p ∨ ¬q" },
      { letter: "B", text: "¬p ∧ ¬q" },
      { letter: "C", text: "p ∧ q" },
      { letter: "D", text: "¬p → q" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Pela Lei de De Morgan: ¬(p ∨ q) ≡ ¬p ∧ ¬q. O ∨ 'vira' ∧ e ambas as proposições são negadas. Analogamente, ¬(p ∧ q) ≡ ¬p ∨ ¬q.",
    explanationCorrect:
      "Correto! De Morgan: ¬(p∨q) = ¬p ∧ ¬q. Regra prática: 'Entra a negação geral, troca o conectivo (∨↔∧), e nega cada um'.",
    explanationWrong:
      "Atenção: De Morgan diz que ao negar uma disjunção (∨), o conectivo vira conjunção (∧) e cada componente é negada. ¬(p∨q) = ¬p ∧ ¬q, não ¬p ∨ ¬q (que seria a negação de uma conjunção).",
    difficulty: "DIFICIL",
  },
  {
    id: "rl_prop_q12",
    statement:
      "Um investigador afirmou: 'Se o sistema foi invadido (p) ou se houve falha humana (q), então ocorreu vazamento de dados (r).' Esta afirmação é expressa por (p ∨ q) → r. Sabe-se que r = F (não houve vazamento). Qual pode ser concluído sobre p e q?",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "p = F e q = F, pois a contrapositiva ¬r → ¬(p ∨ q) implica que ambos são falsos." },
      { letter: "B", text: "Nada pode ser concluído sobre p e q, pois r=F torna o condicional sempre verdadeiro." },
      { letter: "C", text: "p = F e q = V, pois a disjunção precisa de pelo menos um verdadeiro." },
      { letter: "D", text: "p = V e q = F, pois o antecedente deve ser verdadeiro para o consequente ser falso." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "A contrapositiva de (p∨q)→r é ¬r→¬(p∨q). Com r=F, temos ¬r=V. Pelo modus ponens na contrapositiva: ¬r=V e ¬r→¬(p∨q)=V, logo ¬(p∨q)=V. Por De Morgan: ¬(p∨q) = ¬p ∧ ¬q = V, portanto p=F e q=F.",
    explanationCorrect:
      "Correto! Contrapositiva: ¬r→¬(p∨q). r=F → ¬r=V. Modus ponens → ¬(p∨q)=V → (¬p ∧ ¬q)=V → p=F e q=F. Não houve nem invasão nem falha humana.",
    explanationWrong:
      "Atenção: r=F não torna o condicional 'sempre verdadeiro' (seria F→r que tornaria V qualquer que fosse r). Aqui r=F é o CONSEQUENTE, e a proposição afirma que r=F — então pela contrapositiva, o antecedente também deve ser falso: ¬(p∨q)=V, ou seja, p=F e q=F.",
    difficulty: "DIFICIL",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("🚀 Seed: Raciocínio Lógico — Proposições e Operadores Lógicos");
  console.log("=".repeat(60));

  // 1. Encontrar Subject
  const subjectId = await findSubject("RACIOCINIO_LOGICO");
  if (!subjectId) {
    console.error("❌ Subject 'RACIOCINIO_LOGICO' não encontrado. Verifique o banco.");
    process.exit(1);
  }
  console.log(`✅ Subject encontrado: ${subjectId}`);

  // 2. Garantir colunas Phase 5
  await db.execute(sql`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS mnemonic TEXT`);
  await db.execute(sql`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS "keyPoint" TEXT`);
  await db.execute(sql`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS "practicalExample" TEXT`);
  await db.execute(sql`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "explanationCorrect" TEXT`);
  await db.execute(sql`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "explanationWrong" TEXT`);
  console.log("✅ Colunas Phase 5 garantidas");

  // 3. Criar Tópico
  const topicId = await findOrCreateTopic("Proposições e Operadores Lógicos", subjectId);
  console.log(`✅ Tópico: ${topicId}`);

  // 4. Inserir Conteúdos
  console.log("\n📚 Inserindo conteúdos...");
  let contentsCreated = 0;
  let contentsSkipped = 0;

  for (const c of contents) {
    if (await contentExists(c.title, subjectId)) {
      console.log(`  ⏭️  Conteúdo já existe: ${c.title}`);
      contentsSkipped++;
      continue;
    }
    await db.execute(sql`
      INSERT INTO "Content" (
        "id", "title", "textContent", "subjectId", "topicId",
        "isActive", "difficulty",
        "wordCount", "estimatedReadTime",
        "mnemonic", "keyPoint", "practicalExample",
        "createdAt", "updatedAt"
      ) VALUES (
        ${c.id}, ${c.title}, ${c.textContent}, ${subjectId}, ${topicId},
        true, ${c.difficulty},
        ${Math.round(c.textContent.split(/\s+/).length)},
        ${Math.ceil(c.textContent.split(/\s+/).length / 200)},
        ${c.mnemonic}, ${c.keyPoint}, ${c.practicalExample},
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Criado: ${c.title}`);
    contentsCreated++;
  }

  // 5. Inserir Questões
  console.log("\n❓ Inserindo questões...");
  let questionsCreated = 0;
  let questionsSkipped = 0;

  for (const q of questions) {
    if (await questionExists(q.id)) {
      console.log(`  ⏭️  Questão já existe: ${q.id}`);
      questionsSkipped++;
      continue;
    }
    const alternativesJson = JSON.stringify(
      q.alternatives.map((a) => ({ letter: a.letter, text: a.text }))
    );
    await db.execute(sql`
      INSERT INTO "Question" (
        "id", "statement", "alternatives", "correctAnswer", "correctOption",
        "explanation", "explanationCorrect", "explanationWrong",
        "subjectId", "topicId",
        "isActive", "difficulty",
        "timesUsed", "questionType",
        "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternativesJson}::jsonb, ${q.correctAnswer}, ${q.correctOption},
        ${q.explanation}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${subjectId}, ${topicId},
        true, ${q.difficulty},
        0, ${q.questionType},
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Questão criada: ${q.id} (${q.difficulty})`);
    questionsCreated++;
  }

  // 6. Relatório
  console.log("\n" + "=".repeat(60));
  console.log(`📊 RELATÓRIO FINAL:`);
  console.log(`   Conteúdos: ${contentsCreated} criados, ${contentsSkipped} já existiam`);
  console.log(`   Questões:  ${questionsCreated} criadas, ${questionsSkipped} já existiam`);
  console.log("✅ Seed de Raciocínio Lógico (Proposições) concluído!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
