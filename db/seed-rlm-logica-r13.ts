/**
 * Seed R13-B: Raciocínio Lógico — Lógica Avançada (Equivalências e Análise)
 *
 * Complementa seed-rlm-proposicoes-r13.ts (Proposições/Conectivos/TV básica).
 * Este seed cobre: De Morgan, Condicional equivalente, Bicondicional,
 * Tautologia/Contradição, Implicação vs Equivalência, Análise CEBRASPE.
 *
 * Grupo A: contentIdMap com vínculo total (sem roleta russa).
 * Popula 6 átomos de Conteúdo + 12 Questões estilo CEBRASPE.
 * Idempotente: verifica existência antes de inserir.
 *
 * Execução:
 *   npx tsx db/seed-rlm-logica-r13.ts
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

function getCorrectAnswer(
  alternatives: Array<{ letter: string; text: string }>,
  correctOption: number,
): string {
  return alternatives[correctOption]?.letter ?? ["A", "B", "C", "D", "E"][correctOption] ?? "A";
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
    id: "rl_la_c01",
    title: "Negação de Proposições Compostas — Leis de De Morgan",
    textContent: `As Leis de De Morgan definem como negar proposições compostas (conjunção e disjunção).

LEIS FUNDAMENTAIS:
• ¬(p ∧ q)  ≡  ¬p ∨ ¬q   → a negação da conjunção é a disjunção das negações
• ¬(p ∨ q)  ≡  ¬p ∧ ¬q   → a negação da disjunção é a conjunção das negações

MNEMÔNICO: "Negou, troca o conectivo e nega cada parte."
∧ → ∨ (conjunção vira disjunção)
∨ → ∧ (disjunção vira conjunção)

NEGAÇÃO DO CONDICIONAL (mais cobrada no CEBRASPE):
¬(p → q)  ≡  p ∧ ¬q
Leitura: a única situação em que p→q é FALSA é quando p é V e q é F.
Portanto: negar "se p então q" = "p E não-q".

NEGAÇÃO DO BICONDICIONAL:
¬(p ↔ q)  ≡  (p ∧ ¬q) ∨ (¬p ∧ q)  ≡  p ⊕ q (ou exclusivo)

EXEMPLOS PRÁTICOS (contexto policial):
"O delegado investigou E o suspeito confessou." (p ∧ q)
Negação: "O delegado NÃO investigou OU o suspeito NÃO confessou." (¬p ∨ ¬q)

"Se houve mandado, então a busca foi legal." (p → q)
Negação: "Houve mandado E a busca NÃO foi legal." (p ∧ ¬q)

DICA BANCA:
CEBRASPE frequentemente pede a "negação correta" de uma proposição. Erros comuns:
- Negar apenas um lado: ¬(p→q) ≠ ¬p→¬q (esta é a inversa, não a negação)
- Manter o conectivo: ¬(p∧q) ≠ ¬p ∧ ¬q`,
    mnemonic: "De Morgan: NEGOU = TROCA O CONECTIVO + NEGA CADA PARTE. ¬(p∧q)=¬p∨¬q; ¬(p∨q)=¬p∧¬q; ¬(p→q)=p∧¬q",
    keyPoint: "Negação da conjunção: troca ∧ por ∨ e nega cada parte. Negação do condicional: p∧¬q (mantém p, nega q).",
    practicalExample: "'Se há flagrante, então há prisão.' Negação: 'Há flagrante E não há prisão.' — De Morgan aplicado ao condicional.",
    difficulty: "MEDIO",
  },
  {
    id: "rl_la_c02",
    title: "Condicional (→): Equivalências, Contrapositiva e Recíproca",
    textContent: `O condicional p → q é uma das proposições mais cobradas em concursos policiais. Dominar suas equivalências é essencial.

TABELA-VERDADE DO CONDICIONAL:
p → q é FALSA somente quando p=V e q=F.
┌─────┬─────┬───────┐
│  p  │  q  │ p → q │
├─────┼─────┼───────┤
│  V  │  V  │   V   │
│  V  │  F  │   F   ← único caso falso
│  F  │  V  │   V   │
│  F  │  F  │   V   │
└─────┴─────┴───────┘

EQUIVALÊNCIAS DO CONDICIONAL:
• p → q  ≡  ¬p ∨ q         (forma alternativa mais usada)
• p → q  ≡  ¬q → ¬p        (CONTRAPOSITIVA — equivale ao original)

PROPOSIÇÕES DERIVADAS (NÃO equivalem ao original):
• Recíproca:  q → p         (inverte hipótese e tese) — NÃO equivale
• Inversa:   ¬p → ¬q        (nega ambos) — NÃO equivale
• Contrapositiva: ¬q → ¬p   (inverte e nega) — EQUIVALE ✓

RELAÇÃO ENTRE DERIVADAS:
- Original e contrapositiva: EQUIVALENTES (mesma tabela-verdade)
- Recíproca e inversa: EQUIVALENTES entre si (mas não com o original)

LEITURAS EQUIVALENTES AO CONDICIONAL (cobradas no CEBRASPE):
"Se p então q" = "p somente se q" = "q se p" = "p é condição suficiente para q" = "q é condição necessária para p"

DICA BANCA:
"Todo A é B" → A → B (universal afirmativa = condicional)
"Nenhum A é B" → A → ¬B
Exemplo: "Todo agente federal é concursado" → Ser agente → ser concursado`,
    mnemonic: "CONDICIONAL: só é F quando V→F. Contrapositiva (¬q→¬p) EQUIVALE. Recíproca e Inversa NÃO equivalem ao original.",
    keyPoint: "p→q falso só quando p=V e q=F. Contrapositiva (¬q→¬p) é equivalente. p→q ≡ ¬p∨q.",
    practicalExample: "'Se o réu está preso preventivamente, então houve decisão judicial.' Contrapositiva equivalente: 'Se não houve decisão judicial, então o réu não está preso preventivamente.'",
    difficulty: "MEDIO",
  },
  {
    id: "rl_la_c03",
    title: "Bicondicional (↔): Tabela-Verdade e Equivalência Mútua",
    textContent: `O bicondicional p ↔ q (lê-se "p se e somente se q") é verdadeiro quando p e q têm o MESMO valor lógico.

TABELA-VERDADE DO BICONDICIONAL:
p ↔ q é VERDADEIRA quando p e q são iguais (ambos V ou ambos F).
┌─────┬─────┬───────┐
│  p  │  q  │ p ↔ q │
├─────┼─────┼───────┤
│  V  │  V  │   V   │
│  V  │  F  │   F   │
│  F  │  V  │   F   │
│  F  │  F  │   V   │
└─────┴─────┴───────┘

EQUIVALÊNCIAS DO BICONDICIONAL:
• p ↔ q  ≡  (p → q) ∧ (q → p)   (bicondicional = dupla implicação)
• p ↔ q  ≡  (p ∧ q) ∨ (¬p ∧ ¬q) (mesmo valor lógico)

NEGAÇÃO DO BICONDICIONAL:
¬(p ↔ q) ≡ p ⊕ q (ou exclusivo) ≡ (p ∧ ¬q) ∨ (¬p ∧ q)
Ou seja: p e q têm valores DIFERENTES.

LEITURAS DO BICONDICIONAL:
"p se e somente se q" = "p é condição necessária e suficiente para q" = "p sse q"

DIFERENÇA ENTRE → e ↔:
• p → q: p é suficiente para q (q é necessário para p)
• p ↔ q: p é necessário E suficiente para q (vice-versa também)

EXEMPLO:
"Um número é par se e somente se é divisível por 2." → V ↔ V = V
"A prisão é legal se e somente se há ordem judicial ou flagrante."`,
    mnemonic: "BICONDICIONAL: V quando p=q (ambos V ou ambos F). p↔q = (p→q)∧(q→p). Negação = ou-exclusivo (valores diferentes).",
    keyPoint: "p↔q verdadeiro quando ambos têm mesmo valor. Equivale a dupla implicação (p→q)∧(q→p).",
    practicalExample: "'A prisão preventiva é cabível se e somente se presentes os requisitos legais.' — bicondicional: só válido quando os dois lados coincidem.",
    difficulty: "MEDIO",
  },
  {
    id: "rl_la_c04",
    title: "Tautologia, Contradição e Contingência",
    textContent: `Uma proposição composta pode ser classificada pelo seu comportamento na tabela-verdade.

DEFINIÇÕES:
• TAUTOLOGIA: proposição SEMPRE VERDADEIRA, independentemente dos valores de p e q.
  Símbolo: ⊤ ou T
  Exemplo clássico: p ∨ ¬p (lei do terceiro excluído) → sempre V

• CONTRADIÇÃO (Antilogia): proposição SEMPRE FALSA.
  Símbolo: ⊥ ou F
  Exemplo clássico: p ∧ ¬p (lei da não contradição) → sempre F

• CONTINGÊNCIA: proposição que pode ser V ou F dependendo dos valores das variáveis.
  Exemplo: p ∧ q → às vezes V, às vezes F

EQUIVALÊNCIAS LÓGICAS:
Duas proposições A e B são logicamente equivalentes (A ≡ B) quando A ↔ B é uma TAUTOLOGIA.
Ou seja: têm a mesma tabela-verdade em todas as linhas.

TAUTOLOGIAS IMPORTANTES PARA CONCURSOS:
1. p ∨ ¬p                     (terceiro excluído)
2. ¬(p ∧ ¬p)                  (não contradição)
3. (p → q) ↔ (¬q → ¬p)        (equivalência com contrapositiva)
4. (p → q) ↔ (¬p ∨ q)         (forma alternativa do condicional)
5. p → (q → p)                 (lei da afirmação do consequente)

COMO VERIFICAR TAUTOLOGIA:
Construir tabela-verdade completa e verificar se TODAS as linhas resultam em V.
Para 2 variáveis: 4 linhas. Para 3: 8 linhas. Para n variáveis: 2ⁿ linhas.

DICA BANCA:
CEBRASPE frequentemente pede para identificar se uma proposição é tautologia ou contradição.
Estratégia rápida: tente encontrar UMA linha que seja F (para descartar tautologia) ou V (para descartar contradição).`,
    mnemonic: "TAU-CONT-CON: TAUtologia=sempre V; CONTradição=sempre F; CONtingência=depende. p∨¬p=tautologia; p∧¬p=contradição.",
    keyPoint: "Tautologia: sempre V (p∨¬p). Contradição: sempre F (p∧¬p). Equivalência: A≡B quando A↔B é tautologia.",
    practicalExample: "'Todo suspeito é culpado ou não é culpado.' → p∨¬p → tautologia (sempre verdadeiro). 'O agente agiu legal e ilegalmente ao mesmo tempo.' → p∧¬p → contradição.",
    difficulty: "MEDIO",
  },
  {
    id: "rl_la_c05",
    title: "Implicação Lógica vs Equivalência Lógica",
    textContent: `Implicação e equivalência lógica são relações ENTRE proposições (ou esquemas), distintas do condicional e bicondicional (que são proposições compostas).

IMPLICAÇÃO LÓGICA (p ⊨ q ou p |= q):
Diz-se que p implica logicamente q quando: TODA interpretação que torna p verdadeira também torna q verdadeira.
Equivale a: p → q é uma TAUTOLOGIA.

EQUIVALÊNCIA LÓGICA (p ≡ q):
Diz-se que p é logicamente equivalente a q quando: p e q têm exatamente os mesmos valores em toda interpretação.
Equivale a: p ↔ q é uma TAUTOLOGIA.

DIFERENÇA CRUCIAL:
• p → q (condicional): é uma PROPOSIÇÃO — pode ser V ou F
• p ⊨ q (implicação lógica): é uma RELAÇÃO — afirma que p→q é sempre V (tautologia)
• p ↔ q (bicondicional): é uma PROPOSIÇÃO — pode ser V ou F
• p ≡ q (equivalência lógica): é uma RELAÇÃO — afirma que p↔q é tautologia

EQUIVALÊNCIAS LÓGICAS FUNDAMENTAIS:
1. ¬(¬p) ≡ p                           (dupla negação)
2. p ∧ q ≡ q ∧ p                       (comutatividade)
3. p ∨ q ≡ q ∨ p                       (comutatividade)
4. (p ∧ q) ∧ r ≡ p ∧ (q ∧ r)          (associatividade)
5. p → q ≡ ¬p ∨ q                      (eliminação do condicional)
6. ¬(p ∧ q) ≡ ¬p ∨ ¬q                 (De Morgan)
7. ¬(p ∨ q) ≡ ¬p ∧ ¬q                 (De Morgan)
8. p → q ≡ ¬q → ¬p                    (contrapositiva)

COMO O CEBRASPE TESTA:
"As proposições P e Q são logicamente equivalentes?" → construir tabela e comparar.
"P implica logicamente Q?" → verificar se P→Q é tautologia.`,
    mnemonic: "IMPL vs EQUIV: Implicação(⊨)=p→q é tautologia. Equivalência(≡)=p↔q é tautologia. Diferente de → e ↔ que são proposições.",
    keyPoint: "p⊨q (implicação lógica): p→q é sempre V. p≡q (equivalência lógica): p↔q é sempre V. São relações, não proposições.",
    practicalExample: "p∧q ≡ q∧p é equivalência lógica (tautologia). Mas 'João estudou e passou' ↔ 'João passou e estudou' é apenas bicondicional (proposição).",
    difficulty: "DIFICIL",
  },
  {
    id: "rl_la_c06",
    title: "Análise de Proposições CEBRASPE: Técnica de Resolução",
    textContent: `O CEBRASPE testa lógica proposicional de forma aplicada. Dominar a técnica de resolução sistemática é o diferencial.

ESTRATÉGIA GERAL DE RESOLUÇÃO:
1. Identificar a estrutura lógica da proposição (quais conectivos, qual ordem)
2. Atribuir letras (p, q, r) às proposições simples
3. Montar a fórmula
4. Aplicar regras (TV, De Morgan, equivalências)
5. Concluir

TÉCNICA DA ATRIBUIÇÃO DE VALORES:
Para verificar se uma proposição composta é V ou F com valores dados:
• Substituir V/F em cada variável
• Calcular de dentro para fora (respeitando prioridade: ¬, ∧, ∨, →, ↔)
• Verificar o resultado final

PEGADINHAS CLÁSSICAS DO CEBRASPE:
1. "Somente se" = condicional invertido: "p somente se q" = p → q (NÃO q → p)
2. "A menos que" = disjunção: "p a menos que q" = p ∨ q (ou: ¬q → p)
3. "Toda vez que" = condicional: "toda vez que p, q" = p → q
4. "É necessário" vs "é suficiente":
   - "p é suficiente para q" = p → q
   - "p é necessário para q" = q → p
5. Negação de "todo": ¬(∀x: Px) = ∃x: ¬Px (existe algum que não tem P)
6. Negação de "existe": ¬(∃x: Px) = ∀x: ¬Px (todos não têm P)

PROCEDIMENTO PARA ITENS CERTO/ERRADO:
• Leia com atenção: o item afirma que a proposição é V, F, tautologia, contradição ou equivalente?
• Monte a tabela se necessário (2 variáveis = 4 linhas, rápido)
• Verifique a afirmação do item contra o resultado`,
    mnemonic: "CEBRASPE: 'somente se'=→; 'a menos que'=∨; 'é necessário para q'=q→p; 'é suficiente para q'=p→q. Negação: troca ∀↔∃.",
    keyPoint: "'p somente se q' = p→q. 'p é suficiente para q' = p→q. 'p é necessário para q' = q→p. Negação de 'todo' = 'existe algum que não'.",
    practicalExample: "'O agente será punido somente se comprovada a culpa.' = culpa→punição? NÃO. 'somente se' = punição→culpa. Pegadinha clássica!",
    difficulty: "DIFICIL",
  },
];

// ============================================
// QUESTÕES (12 questões — IDs fixos)
// ============================================

interface QuestionData {
  id: string;
  statement: string;
  alternatives: Array<{ letter: string; text: string }>;
  correctOption: number;
  questionType: "MULTIPLA_ESCOLHA" | "CERTO_ERRADO";
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  explanationCorrect: string;
  explanationWrong: string;
  contentTitle: string;
}

const questions: QuestionData[] = [
  // De Morgan (c01)
  {
    id: "qz_rll2_001",
    statement: "Considere a proposição: 'O suspeito foi identificado e está foragido.' A negação correta dessa proposição é:",
    alternatives: [
      { letter: "A", text: "O suspeito não foi identificado e não está foragido." },
      { letter: "B", text: "O suspeito não foi identificado ou não está foragido." },
      { letter: "C", text: "O suspeito foi identificado ou não está foragido." },
      { letter: "D", text: "O suspeito não foi identificado e está foragido." },
    ],
    correctOption: 1,
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "MEDIO",
    explanationCorrect: "Alternativa B. Pela Lei de De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q. A conjunção negada vira disjunção das negações. 'Identificado E foragido' negado = 'NÃO identificado OU NÃO foragido'.",
    explanationWrong: "A negação da conjunção (∧) é a disjunção (∨) das negações — De Morgan. Negar 'p E q' resulta em '¬p OU ¬q', não '¬p E ¬q'.",
    contentTitle: "Negação de Proposições Compostas — Leis de De Morgan",
  },
  {
    id: "qz_rll2_002",
    statement: "Acerca das leis de De Morgan, julgue o item: A negação da proposição 'Se o agente recebeu vantagem indevida, então cometeu corrupção' é 'O agente não recebeu vantagem indevida ou não cometeu corrupção.'",
    alternatives: [
      { letter: "A", text: "Certo" },
      { letter: "B", text: "Errado" },
    ],
    correctOption: 1,
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    explanationCorrect: "ERRADO. A negação do condicional p→q não é ¬p∨¬q. A negação correta é p∧¬q: 'O agente recebeu vantagem indevida E não cometeu corrupção.' A afirmativa confunde negação do condicional com De Morgan aplicado à disjunção.",
    explanationWrong: "A negação do condicional (p→q) é p∧¬q — mantém p (hipótese) e nega q (tese). A afirmativa apresenta ¬p∨¬q, que é a negação da conjunção (De Morgan), não do condicional.",
    contentTitle: "Negação de Proposições Compostas — Leis de De Morgan",
  },
  // Condicional (c02)
  {
    id: "qz_rll2_003",
    statement: "Sobre o condicional p → q, julgue: As proposições 'Se há ordem judicial, a busca é legal' e 'Se a busca é ilegal, não há ordem judicial' são logicamente equivalentes.",
    alternatives: [
      { letter: "A", text: "Certo" },
      { letter: "B", text: "Errado" },
    ],
    correctOption: 0,
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    explanationCorrect: "CERTO. A segunda proposição é a contrapositiva da primeira: ¬q → ¬p. A contrapositiva é logicamente equivalente ao condicional original p → q. Ambas têm exatamente a mesma tabela-verdade.",
    explanationWrong: "A relação entre uma proposição e sua contrapositiva (¬q→¬p) é de equivalência lógica — mesma tabela-verdade. A contrapositiva é a única proposição derivada equivalente ao original.",
    contentTitle: "Condicional (→): Equivalências, Contrapositiva e Recíproca",
  },
  {
    id: "qz_rll2_004",
    statement: "O condicional p → q é falso quando:",
    alternatives: [
      { letter: "A", text: "p é falso e q é verdadeiro." },
      { letter: "B", text: "p é verdadeiro e q é verdadeiro." },
      { letter: "C", text: "p é falso e q é falso." },
      { letter: "D", text: "p é verdadeiro e q é falso." },
    ],
    correctOption: 3,
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    explanationCorrect: "Alternativa D. O condicional p→q só é FALSO quando a hipótese (p) é verdadeira e a tese (q) é falsa. Em todos os outros casos, o condicional é verdadeiro — inclusive quando p é falso.",
    explanationWrong: "O condicional é falso APENAS quando p=V e q=F. Isso ocorre porque uma premissa verdadeira não pode levar a uma conclusão falsa em um raciocínio válido.",
    contentTitle: "Condicional (→): Equivalências, Contrapositiva e Recíproca",
  },
  // Bicondicional (c03)
  {
    id: "qz_rll2_005",
    statement: "Julgue: A proposição bicondicional p ↔ q é verdadeira se, e somente se, p e q possuem o mesmo valor lógico.",
    alternatives: [
      { letter: "A", text: "Certo" },
      { letter: "B", text: "Errado" },
    ],
    correctOption: 0,
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    explanationCorrect: "CERTO. O bicondicional p↔q é verdadeiro quando p e q têm o mesmo valor (ambos V ou ambos F) e falso quando têm valores distintos. Esta é a definição do bicondicional.",
    explanationWrong: "O bicondicional é a 'igualdade lógica': verdadeiro quando os dois lados coincidem, falso quando diferem.",
    contentTitle: "Bicondicional (↔): Tabela-Verdade e Equivalência Mútua",
  },
  {
    id: "qz_rll2_006",
    statement: "Considere p = V e q = F. O valor lógico de (p ↔ q) → ¬p é:",
    alternatives: [
      { letter: "A", text: "Verdadeiro, pois o antecedente do condicional é falso." },
      { letter: "B", text: "Falso, pois p é verdadeiro e a conclusão ¬p é falsa." },
      { letter: "C", text: "Verdadeiro, pois ¬p = V quando p = V." },
      { letter: "D", text: "Falso, pois o bicondicional é verdadeiro." },
    ],
    correctOption: 0,
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "DIFICIL",
    explanationCorrect: "Alternativa A. Com p=V e q=F: p↔q = F (valores distintos). O condicional (p↔q)→¬p tem antecedente F, portanto é VERDADEIRO (condicional com antecedente falso é sempre verdadeiro).",
    explanationWrong: "Passo a passo: p=V, q=F → p↔q=F. Então F→¬p. Como o antecedente é F, o condicional é V independentemente do consequente. Regra: condicional com hipótese falsa é sempre verdadeiro.",
    contentTitle: "Bicondicional (↔): Tabela-Verdade e Equivalência Mútua",
  },
  // Tautologia/Contradição (c04)
  {
    id: "qz_rll2_007",
    statement: "Julgue: A proposição 'O agente cometeu o crime ou não cometeu o crime' é uma tautologia, pois é verdadeira independentemente de qualquer valor lógico atribuído.",
    alternatives: [
      { letter: "A", text: "Certo" },
      { letter: "B", text: "Errado" },
    ],
    correctOption: 0,
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    explanationCorrect: "CERTO. A proposição tem a forma p∨¬p (lei do terceiro excluído), que é uma tautologia — sempre verdadeira independentemente de p ser V ou F. É o exemplo clássico de tautologia.",
    explanationWrong: "p∨¬p é a tautologia mais básica da lógica (lei do terceiro excluído): toda proposição é verdadeira ou falsa, sem terceira opção.",
    contentTitle: "Tautologia, Contradição e Contingência",
  },
  {
    id: "qz_rll2_008",
    statement: "Qual das seguintes proposições é uma CONTRADIÇÃO?",
    alternatives: [
      { letter: "A", text: "p ∨ ¬p" },
      { letter: "B", text: "p → p" },
      { letter: "C", text: "p ∧ ¬p" },
      { letter: "D", text: "p ↔ p" },
    ],
    correctOption: 2,
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    explanationCorrect: "Alternativa C. p∧¬p é sempre FALSA (uma proposição não pode ser verdadeira e falsa ao mesmo tempo — lei da não-contradição). As demais (p∨¬p, p→p, p↔p) são tautologias.",
    explanationWrong: "A contradição é p∧¬p: afirmar p e ¬p simultaneamente é sempre falso. As demais são tautologias: p∨¬p (terceiro excluído), p→p (identidade), p↔p (identidade bicondicional).",
    contentTitle: "Tautologia, Contradição e Contingência",
  },
  // Implicação vs Equivalência (c05)
  {
    id: "qz_rll2_009",
    statement: "Julgue: Afirmar que p ≡ q (equivalência lógica) é o mesmo que afirmar que p ↔ q (bicondicional) é uma tautologia.",
    alternatives: [
      { letter: "A", text: "Certo" },
      { letter: "B", text: "Errado" },
    ],
    correctOption: 0,
    questionType: "CERTO_ERRADO",
    difficulty: "DIFICIL",
    explanationCorrect: "CERTO. p≡q significa que p e q são logicamente equivalentes, o que é verificado quando p↔q é uma tautologia (verdadeiro em todas as interpretações possíveis). Por exemplo: p→q ≡ ¬p∨q, pois (p→q)↔(¬p∨q) é tautologia.",
    explanationWrong: "Equivalência lógica (≡) é uma relação metalinguística: diz que p↔q é sempre V. O bicondicional (↔) é uma proposição que pode ser V ou F. Equivalência lógica = bicondicional que é tautologia.",
    contentTitle: "Implicação Lógica vs Equivalência Lógica",
  },
  {
    id: "qz_rll2_010",
    statement: "Julgue: Se p implica logicamente q (p ⊨ q), então é possível que p seja verdadeiro e q seja falso em alguma interpretação.",
    alternatives: [
      { letter: "A", text: "Certo" },
      { letter: "B", text: "Errado" },
    ],
    correctOption: 1,
    questionType: "CERTO_ERRADO",
    difficulty: "DIFICIL",
    explanationCorrect: "ERRADO. Se p implica logicamente q (p⊨q), significa que p→q é tautologia — verdadeiro em TODAS as interpretações. Portanto, é IMPOSSÍVEL p=V e q=F simultaneamente nessa relação. Essa situação (p=V e q=F) é exatamente o único caso que tornaria p→q falso.",
    explanationWrong: "Implicação lógica (p⊨q) significa p→q é tautologia: toda vez que p=V, necessariamente q=V. A situação p=V e q=F tornaria p→q falso, o que contradiz a definição de tautologia.",
    contentTitle: "Implicação Lógica vs Equivalência Lógica",
  },
  // Análise CEBRASPE (c06)
  {
    id: "qz_rll2_011",
    statement: "No contexto de concursos policiais, a afirmação 'O candidato será aprovado somente se obtiver nota mínima' equivale logicamente a:",
    alternatives: [
      { letter: "A", text: "Se o candidato obtiver nota mínima, então será aprovado." },
      { letter: "B", text: "Se o candidato for aprovado, então obteve nota mínima." },
      { letter: "C", text: "O candidato obteve nota mínima e foi aprovado." },
      { letter: "D", text: "Se o candidato não obtiver nota mínima, não será aprovado." },
    ],
    correctOption: 1,
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "DIFICIL",
    explanationCorrect: "Alternativa B. 'p somente se q' equivale a p→q. Aqui: 'aprovado (p) somente se nota mínima (q)' = aprovado → nota mínima. Alternativa B expressa exatamente isso. A alternativa A inverte a relação (seria q→p, a recíproca).",
    explanationWrong: "'Somente se' é uma das pegadinhas mais cobradas. 'p somente se q' = p→q (não q→p). A nota mínima é condição NECESSÁRIA para aprovação: sem nota mínima, não há aprovação.",
    contentTitle: "Análise de Proposições CEBRASPE: Técnica de Resolução",
  },
  {
    id: "qz_rll2_012",
    statement: "Julgue: Considere p='A interceptação foi autorizada judicialmente' e q='A prova é lícita'. Se p→q e p são ambas verdadeiras, pode-se concluir, por modus ponens, que q é verdadeira.",
    alternatives: [
      { letter: "A", text: "Certo" },
      { letter: "B", text: "Errado" },
    ],
    correctOption: 0,
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    explanationCorrect: "CERTO. Modus ponens (MP) é a forma de argumento: [p→q, p] ⊨ q. Se a premissa condicional (p→q) e a hipótese (p) são verdadeiras, a conclusão (q) é necessariamente verdadeira. É o argumento dedutivo mais básico da lógica.",
    explanationWrong: "Modus ponens: dada p→q (se p então q) e p (p é verdadeiro), conclui-se q. Este é um argumento válido e a conclusão é garantida. Aplicação: autorização judicial (p) + p→q implica prova lícita (q).",
    contentTitle: "Análise de Proposições CEBRASPE: Técnica de Resolução",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("🚀 Seed R13-B: Raciocínio Lógico — Lógica Avançada (De Morgan, Condicional, Tautologia)");
  console.log("=".repeat(70));

  // 1. Encontrar subject
  const subjectId = await findSubject("RACIOCINIO");
  if (!subjectId) {
    console.error("❌ Subject RACIOCINIO_LOGICO não encontrado.");
    process.exit(1);
  }
  console.log(`✅ Subject: ${subjectId}`);

  // 2. Encontrar ou criar tópico
  const topicId = await findOrCreateTopic("Lógica de Proposições e Tabela-Verdade", subjectId);
  console.log(`✅ Tópico: ${topicId}`);

  // 3. Inserir content atoms + construir contentIdMap
  console.log("\n📚 Inserindo content atoms...");
  const contentIdMap: Record<string, string> = {};

  for (const c of contents) {
    if (await contentExists(c.title, subjectId)) {
      // Buscar id existente para o mapa
      const rows = await db.execute(sql`
        SELECT id FROM "Content" WHERE title = ${c.title} AND "subjectId" = ${subjectId} LIMIT 1
      `) as any[];
      contentIdMap[c.title] = rows[0].id;
      console.log(`  ⏭️  Já existe: "${c.title}" → ${rows[0].id}`);
      continue;
    }

    const wordCount = c.textContent.split(/\s+/).length;
    const estimatedReadTime = Math.ceil(wordCount / 200);

    await db.execute(sql`
      INSERT INTO "Content" (
        id, title, "textContent", "subjectId", "topicId",
        difficulty, mnemonic, "keyPoint", "practicalExample",
        "wordCount", "estimatedReadTime",
        "createdAt", "updatedAt"
      ) VALUES (
        ${c.id}, ${c.title}, ${c.textContent}, ${subjectId}, ${topicId},
        ${c.difficulty}, ${c.mnemonic}, ${c.keyPoint}, ${c.practicalExample},
        ${wordCount}, ${estimatedReadTime},
        NOW(), NOW()
      )
    `);
    contentIdMap[c.title] = c.id;
    console.log(`  ✅ Criado: "${c.title}" (${wordCount}w)`);
  }

  // 4. Inserir questões
  console.log("\n❓ Inserindo questões...");
  let inserted = 0;
  let skipped = 0;

  for (const q of questions) {
    if (await questionExists(q.id)) {
      console.log(`  ⏭️  Já existe: ${q.id}`);
      skipped++;
      continue;
    }

    const contentId = contentIdMap[q.contentTitle];
    if (!contentId) {
      console.warn(`  ⚠️  Content não encontrado para "${q.contentTitle}" — pulando ${q.id}`);
      continue;
    }

    const alternatives = JSON.stringify(q.alternatives);
    const correctAnswer = getCorrectAnswer(q.alternatives, q.correctOption);

    await db.execute(sql`
      INSERT INTO "Question" (
        id, statement, alternatives, "correctAnswer", "correctOption",
        "explanation", "explanationCorrect", "explanationWrong",
        "questionType", difficulty,
        "subjectId", "topicId", "contentId",
        "isActive", "timesUsed", "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternatives}::jsonb, ${correctAnswer}, ${q.correctOption},
        ${q.explanationCorrect}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${q.questionType}, ${q.difficulty},
        ${subjectId}, ${topicId}, ${contentId},
        true, 0, NOW(), NOW()
      )
    `);
    console.log(`  ✅ ${q.id} [${q.difficulty}] → "${q.contentTitle.slice(0, 45)}..."`);
    inserted++;
  }

  // 5. Relatório
  console.log("\n" + "=".repeat(70));
  console.log("📊 RELATÓRIO FINAL — R13-B Lógica Avançada:");
  console.log(`   Content atoms: ${Object.keys(contentIdMap).length} (${contents.length - skipped} novos)`);
  console.log(`   Questões inseridas: ${inserted} | Já existiam: ${skipped}`);
  console.log("✅ Seed R13-B concluído!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
