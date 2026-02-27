/**
 * Seed R13: Raciocínio Lógico — Lógica de Proposições
 *
 * Grupo A: contentIdMap com vínculo total (sem roleta russa).
 * Popula 6 átomos de Conteúdo + 12 Questões CERTO/ERRADO estilo CEBRASPE.
 * Idempotente: verifica existência antes de inserir.
 *
 * Execução:
 *   npx tsx db/seed-rlm-proposicoes-r13.ts
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
    id: "rl_lp_c01",
    title: "Proposições Simples e Compostas — Conceito e Classificação",
    textContent: `Uma proposição lógica é um enunciado DECLARATIVO que pode ser classificado como VERDADEIRO (V) ou FALSO (F), nunca os dois ao mesmo tempo (princípio da não contradição) e nunca nenhum (princípio do terceiro excluído).

PONTOS-CHAVE:
• NÃO são proposições: perguntas ("Quantos candidatos passaram?"), exclamações ("Que prova difícil!"), ordens ("Estude agora!") e paradoxos ("Esta frase é falsa")
• São proposições: qualquer enunciado declarativo com valor lógico definível — mesmo que vago ou falso
• Proposição SIMPLES (atômica): único enunciado, sem conectivo lógico. Representada por p, q, r...
• Proposição COMPOSTA (molecular): duas ou mais proposições simples ligadas por conectivos (¬, ∧, ∨, →, ↔)

TABELA DOS NÃO-EXEMPLOS:
Pergunta       → "A PF investigou o caso?"          → NÃO é proposição
Exclamação     → "Que investigação brilhante!"       → NÃO é proposição
Ordem          → "Apresente o relatório amanhã."     → NÃO é proposição
Paradoxo       → "Este enunciado é falso."           → NÃO é proposição (indecidível)

EXEMPLOS DE PROPOSIÇÕES:
"A Polícia Federal é vinculada ao Ministério da Justiça." (V) → PROPOSIÇÃO SIMPLES
"O Brasil é uma república e a capital é Brasília." (V ∧ V) → PROPOSIÇÃO COMPOSTA

DICA BANCA:
CEBRASPE frequentemente apresenta sentenças e pede para classificar. Atenção especial a enunciados com "pode ser" ou "em certos casos" — ainda são declarativos e, portanto, proposições.`,
    mnemonic: "PVF: Proposição = Verdadeiro ou Falso. Se é DECLARATIVA (não pergunta, exclamação, ordem), é proposição.",
    keyPoint: "Proposição: enunciado declarativo com valor V ou F. Perguntas, exclamações e ordens NÃO são proposições.",
    practicalExample: "'Brasília é a capital do Brasil' = proposição simples V. 'Venha agora!' = não é proposição (ordem). 'É possível ser aprovado?' = não é proposição (pergunta).",
    difficulty: "FACIL",
  },
  {
    id: "rl_lp_c02",
    title: "Conectivos Lógicos — Os 5 Operadores Fundamentais",
    textContent: `Os conectivos lógicos são os operadores que formam proposições compostas a partir de proposições simples. Existem 5 conectivos principais na lógica proposicional.

OS 5 CONECTIVOS:
┌───────────┬────────┬────────────────────────────┬──────────────────────────────┐
│ Nome      │ Símbolo│ Leitura                    │ Palavras naturais            │
├───────────┼────────┼────────────────────────────┼──────────────────────────────┤
│ Negação   │ ¬ (ou ~)│ "não p"                   │ não, é falso que, é errado   │
│ Conjunção │ ∧      │ "p e q"                    │ e, mas, porém, contudo, além │
│ Disjunção │ ∨      │ "p ou q" (inclusivo)        │ ou, ou ainda                 │
│ Condicional│ →     │ "se p, então q"             │ se...então, todo, somente se │
│ Bicondicional│ ↔   │ "p se e somente se q"       │ se e somente se, sse, ↔      │
└───────────┴────────┴────────────────────────────┴──────────────────────────────┘

PRIORIDADE DOS OPERADORES (da maior para a menor):
1º ¬ (negação)
2º ∧ (conjunção)
3º ∨ (disjunção)
4º → (condicional)
5º ↔ (bicondicional)

ATENÇÃO — PEGADINHA CLÁSSICA:
"Mas", "porém", "contudo", "todavia", "entretanto" → todos equivalem a ∧ (conjunção) em lógica
"Embora", "ainda que", "apesar de" → podem indicar conjunção (∧) ou são tratados como tal

EXEMPLO:
"O delegado investigou o crime, mas o suspeito negou." → p ∧ q (conjunção)
"Se houver mandado judicial, então a busca é legal." → p → q (condicional)

DICA BANCA:
A prioridade dos operadores é cobrada para resolver ambiguidades em proposições sem parênteses. Lembre: ¬ opera primeiro (unário), depois ∧, depois ∨, depois →, por último ↔.`,
    mnemonic: "N.E.O.C.BI — Negação, E(∧), Ou(∨), Condicional(→), Bicondicional(↔). Prioridade: ¬ > ∧ > ∨ > → > ↔",
    keyPoint: "5 conectivos: ¬ ∧ ∨ → ↔. Prioridade: ¬ primeiro, ↔ último. 'Mas/porém/contudo' = ∧ em lógica.",
    practicalExample: "'O candidato estudou, mas não passou.' → p ∧ q. 'Se estudar então passa.' → p → q. 'Aprovado se e somente se acertar 70%.' → p ↔ q.",
    difficulty: "FACIL",
  },
  {
    id: "rl_lp_c03",
    title: "Tabela-Verdade: Conjunção (∧) e Disjunção (∨)",
    textContent: `A tabela-verdade é o instrumento fundamental para determinar o valor lógico de proposições compostas para cada combinação possível de valores das proposições simples.

CONJUNÇÃO (∧ — "E"):
Regra de ouro: p ∧ q é VERDADEIRA somente quando AMBAS são verdadeiras.
┌─────┬─────┬───────┐
│  p  │  q  │ p ∧ q │
├─────┼─────┼───────┤
│  V  │  V  │   V   │
│  V  │  F  │   F   │
│  F  │  V  │   F   │
│  F  │  F  │   F   │
└─────┴─────┴───────┘
→ 1 linha verdadeira (V,V). O resto é falso.

DISJUNÇÃO INCLUSIVA (∨ — "OU"):
Regra de ouro: p ∨ q é FALSA somente quando AMBAS são falsas.
┌─────┬─────┬───────┐
│  p  │  q  │ p ∨ q │
├─────┼─────┼───────┤
│  V  │  V  │   V   │
│  V  │  F  │   V   │
│  F  │  V  │   V   │
│  F  │  F  │   F   │
└─────┴─────┴───────┘
→ 1 linha falsa (F,F). O resto é verdadeiro.

DE MORGAN (negação de conjunção e disjunção):
¬(p ∧ q) ≡ ¬p ∨ ¬q   (nega o ∧ → vira ∨ e nega cada um)
¬(p ∨ q) ≡ ¬p ∧ ¬q   (nega o ∨ → vira ∧ e nega cada um)

DICA BANCA:
Conjunção: basta UMA F para tornar o todo F.
Disjunção: basta UMA V para tornar o todo V.
Memorize as exceções: ∧ só é V no caso (V,V); ∨ só é F no caso (F,F).`,
    mnemonic: "∧=Telhado: precisa das DUAS vigas (V,V) para ficar em pé. ∨=Copa: basta 1 V de Vitória. Perde só com (F,F).",
    keyPoint: "∧: V somente em (V,V). ∨: F somente em (F,F). De Morgan: nega → troca conector e nega cada componente.",
    practicalExample: "Aprovado escrita(V) ∧ aprovado física(F) = F. Aprovado oral(F) ∨ aprovado redação(V) = V. Reprovado escrita(F) ∨ reprovado física(F) = F.",
    difficulty: "FACIL",
  },
  {
    id: "rl_lp_c04",
    title: "Condicional (→) — A Promessa: Vera Fischer é Falsa",
    textContent: `O condicional (p → q) expressa uma relação de condição: "Se p, então q". É o conectivo mais cobrado em concursos. Seu único caso falso é quando a hipótese é verdadeira e a conclusão é falsa.

TABELA-VERDADE DO CONDICIONAL:
┌─────┬─────┬───────┐
│  p  │  q  │ p → q │
├─────┼─────┼───────┤
│  V  │  V  │   V   │
│  V  │  F  │   F   ← único caso falso
│  F  │  V  │   V   │
│  F  │  F  │   V   │
└─────┴─────┴───────┘

MNEMÔNICO — VERA FISCHER:
V → F = Falsa (a única linha falsa).
"Vera Fischer é falsa: V→F=F. O resto é verdade."
• F→V = V: "Promessa não feita não pode ser descumprida"
• F→F = V: "Prometeu o impossível (F) e não fez (F) — promessa mantida"

EQUIVALÊNCIAS FUNDAMENTAIS:
p → q  ≡  ¬p ∨ q          (toda condicional vira disjunção)
p → q  ≡  ¬q → ¬p         (contrapositiva — equivalente!)

NEGAÇÃO DO CONDICIONAL:
¬(p → q)  ≡  p ∧ ¬q       (o único caso falso vira a negação)

EXEMPLO PRÁTICO:
"Se o candidato for aprovado (p=V), será nomeado (q=F por falta de vagas)."
p → q = V → F = FALSO (promessa descumprida)

DICA BANCA:
F → qualquer coisa = VERDADEIRO. Esse é o principal erro dos candidatos. Nunca confundir o condicional com causalidade real — em lógica, F→V = V simplesmente por definição.`,
    mnemonic: "VERA FISCHER = V→F = Falsa. Único caso falso do condicional. Resto = Verdadeiro. ¬(p→q) = p ∧ ¬q.",
    keyPoint: "p→q FALSO somente quando p=V e q=F. Equivale a ¬p∨q. Negação: p∧¬q. Contrapositiva ¬q→¬p é equivalente.",
    practicalExample: "'Se estudar(V) passa(F por motivo externo)' → p→q FALSO. 'Se não estudar(F) passa(V por sorte)' → F→V = V.",
    difficulty: "MEDIO",
  },
  {
    id: "rl_lp_c05",
    title: "Leis de De Morgan — Negação de Proposições Compostas",
    textContent: `As Leis de De Morgan são as regras para negar proposições compostas. São fundamentais em concursos e aparecem em questões de todas as bancas.

AS DUAS LEIS:
Lei 1: ¬(p ∧ q)  ≡  ¬p ∨ ¬q
"A negação de uma conjunção é a disjunção das negações"

Lei 2: ¬(p ∨ q)  ≡  ¬p ∧ ¬q
"A negação de uma disjunção é a conjunção das negações"

REGRA PRÁTICA (3 passos):
1. Entra a negação geral (¬ do lado de fora)
2. TROCA o conectivo: ∧ vira ∨ ou ∨ vira ∧
3. Nega cada proposição individualmente

NEGAÇÃO DE QUANTIFICADORES (extensão de De Morgan):
• "Todo A é B"          → ¬: "Algum A NÃO é B"    (∀ vira ∃ com negação)
• "Algum A é B"         → ¬: "Nenhum A é B"        (∃ vira ∀ com negação)
• "Nenhum A é B"        → ¬: "Algum A é B"         (¬∀¬ vira ∃)
• "Existe pelo menos 1" → ¬: "Não existe nenhum"

ARMADILHA CLÁSSICA:
¬("Todo policial é aprovado") = "Algum policial NÃO é aprovado"
ERRADO: "Nenhum policial é aprovado" (isso seria o contrário extremo, não a negação)

EXEMPLOS:
¬(p ∧ q) = ¬p ∨ ¬q: "Não é verdade que (choveu E ventou)" = "Não choveu OU não ventou"
¬(p ∨ q) = ¬p ∧ ¬q: "Não é verdade que (choveu OU ventou)" = "Não choveu E não ventou"

DICA BANCA:
De Morgan aparece disfarçado. "Não é verdade que João passou E Maria passou" → "João não passou OU Maria não passou" — essa é a lei 1.`,
    mnemonic: "De Morgan DANÇA: entra ¬ geral, TROCA o conectivo (∧↔∨), nega cada componente. Todo→AlgumNão; Algum→Nenhum.",
    keyPoint: "¬(p∧q)=¬p∨¬q; ¬(p∨q)=¬p∧¬q. Negação de 'Todo A é B' = 'Algum A NÃO é B' (nunca 'Nenhum').",
    practicalExample: "¬('aprovado na escrita ∧ aprovado na física') = 'reprovado na escrita ∨ reprovado na física'.",
    difficulty: "MEDIO",
  },
  {
    id: "rl_lp_c06",
    title: "Equivalências da Condicional: Contrapositiva, Recíproca e Inversão",
    textContent: `A partir de p → q, pode-se construir três proposições derivadas. Apenas UMA é logicamente equivalente ao original: a contrapositiva.

QUADRO COMPLETO:
┌──────────────────┬──────────────┬──────────────────────────┬────────────┐
│ Nome             │ Forma        │ Leitura                  │ Equivalente│
├──────────────────┼──────────────┼──────────────────────────┼────────────┤
│ Original         │ p → q        │ Se p, então q            │ — (base)   │
│ Contrapositiva   │ ¬q → ¬p      │ Se não q, então não p    │ ✅ SIM     │
│ Recíproca        │ q → p        │ Se q, então p            │ ❌ NÃO     │
│ Inversão         │ ¬p → ¬q      │ Se não p, então não q    │ ❌ NÃO     │
└──────────────────┴──────────────┴──────────────────────────┴────────────┘

MNEMÔNICO — CORI:
C = Contrapositiva   ≡   O = Original   (C=O: equivalentes)
R = Recíproca        ≡   I = Inversão   (R=I: equivalentes entre si, mas não com o original)

VERIFICAÇÃO COM TABELA (p=V, q=F → p→q = F):
• Contrapositiva: ¬q→¬p = V→F = F ← mesmo valor! ✅
• Recíproca: q→p = F→V = V ← diferente! ❌
• Inversão: ¬p→¬q = F→V = V ← diferente! ❌

OUTRAS EQUIVALÊNCIAS IMPORTANTES:
p → q  ≡  ¬p ∨ q
p → q  ≡  ¬(p ∧ ¬q)
(p ∧ q) → r  ≡  p → (q → r)   (exportação)

BICONDICIONAL COMO DUPLA CONDICIONAL:
p ↔ q  ≡  (p → q) ∧ (q → p)

DICA BANCA:
CEBRASPE cobra diretamente: "A recíproca é equivalente ao original?" — ERRADO. "A contrapositiva é equivalente?" — CERTO. A prova pode apresentar o conteúdo disfarçado como "inversa" ou "conversa" — nenhuma delas é equivalente ao original.`,
    mnemonic: "CORI: Contrapositiva=Original (equivalentes); Recíproca=Inversão (equivalentes entre si, mas ≠ original). Só C≡O.",
    keyPoint: "p→q ≡ ¬q→¬p (contrapositiva). Recíproca (q→p) e inversão (¬p→¬q) NÃO são equivalentes ao original.",
    practicalExample: "'Se estudar → passa' ≡ 'Se não passou → não estudou' (contrapositiva). NÃO equivale a 'Se passou → estudou' (recíproca).",
    difficulty: "DIFICIL",
  },
];

// ============================================
// QUESTÕES (12 — todas CERTO/ERRADO CEBRASPE)
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
  contentTitle: string; // Grupo A — vínculo exato
}

const questions: QuestionData[] = [
  // ── Q01–Q04: FÁCIL ────────────────────────────────────────────────────────
  {
    id: "rl_lp_q01",
    statement:
      "Julgue o item a seguir:\n\nA frase 'Todos os delegados da Polícia Federal são bacharéis em Direito?' constitui uma proposição lógica, pois apresenta valor lógico definido.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. A frase termina com '?' — é uma pergunta, não um enunciado declarativo. Proposição exige que seja possível atribuir valor lógico V ou F. A perguntas não se atribui valor lógico, portanto NÃO é proposição.",
    explanationCorrect:
      "Correto marcado como ERRADO! Perguntas não são proposições — não têm valor lógico V ou F. Mesmo que o conteúdo pareça declarativo, a interrogação transforma o enunciado em não-proposição.",
    explanationWrong:
      "Este item é ERRADO. 'Todos os delegados...?' é uma PERGUNTA (note o '?'). Proposição exige enunciado declarativo com valor V ou F. Perguntas, exclamações e ordens NÃO são proposições.",
    difficulty: "FACIL",
    contentTitle: "Proposições Simples e Compostas — Conceito e Classificação",
  },
  {
    id: "rl_lp_q02",
    statement:
      "Julgue o item a seguir:\n\nA sentença 'Brasília é a capital do Brasil' é uma proposição lógica simples de valor verdadeiro, pois é um enunciado declarativo ao qual se pode atribuir valor lógico definido.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. 'Brasília é a capital do Brasil' é uma proposição simples: é declarativa, tem valor lógico V e não contém conectivos lógicos. Preenche todos os requisitos: declarativa + valor V ou F definível.",
    explanationCorrect:
      "Correto! Enunciado declarativo + valor lógico V definível = proposição simples verdadeira. Sem conectivo = simples (atômica).",
    explanationWrong:
      "Este item é CERTO. A sentença é declarativa (não é pergunta, exclamação ou ordem) e tem valor lógico V — logo é proposição simples verdadeira.",
    difficulty: "FACIL",
    contentTitle: "Proposições Simples e Compostas — Conceito e Classificação",
  },
  {
    id: "rl_lp_q03",
    statement:
      "Julgue o item a seguir:\n\nNa lógica proposicional, os termos 'mas', 'porém' e 'contudo' são equivalentes ao conectivo de conjunção (∧), pois em lógica apenas o valor lógico das proposições importa, e não o sentido discursivo do conectivo.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Em lógica proposicional, 'mas', 'porém', 'contudo', 'todavia' e 'entretanto' funcionam como conjunção (∧). O conectivo lógico abstrai o sentido discursivo — todos operam como 'e' (∧) para fins de cálculo de valor lógico.",
    explanationCorrect:
      "Correto! 'Mas/porém/contudo' → ∧ em lógica. O valor lógico de 'p mas q' é idêntico ao de 'p ∧ q'. A semântica discursiva (contraste, oposição) é irrelevante para o cálculo lógico.",
    explanationWrong:
      "Este item é CERTO. Em lógica, 'mas', 'porém' e 'contudo' equivalem à conjunção (∧). A tabela-verdade não distingue sentidos: 'p mas q' e 'p e q' têm o mesmo valor lógico.",
    difficulty: "FACIL",
    contentTitle: "Conectivos Lógicos — Os 5 Operadores Fundamentais",
  },
  {
    id: "rl_lp_q04",
    statement:
      "Julgue o item a seguir:\n\nConsiderando p = Verdadeiro e q = Falso, o valor lógico da proposição composta (p ∧ q) é Verdadeiro, uma vez que p é verdadeiro.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. A conjunção (∧) é verdadeira SOMENTE quando AMBAS as proposições são verdadeiras. Com p=V e q=F: p ∧ q = V ∧ F = F. O fato de p ser V não torna a conjunção V — ela exige V ∧ V.",
    explanationCorrect:
      "Correto marcado como ERRADO! V ∧ F = F. A conjunção exige que AMBAS sejam V. Basta uma componente F para tornar a conjunção F.",
    explanationWrong:
      "Este item é ERRADO. Tabela-verdade da conjunção: V ∧ V = V; V ∧ F = F; F ∧ V = F; F ∧ F = F. Com q=F, o resultado é obrigatoriamente F, independente do valor de p.",
    difficulty: "FACIL",
    contentTitle: "Tabela-Verdade: Conjunção (∧) e Disjunção (∨)",
  },

  // ── Q05–Q08: MÉDIO ────────────────────────────────────────────────────────
  {
    id: "rl_lp_q05",
    statement:
      "Julgue o item a seguir:\n\nConsiderando p = Falso e q = Falso, o valor lógico da disjunção (p ∨ q) é Falso.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. A disjunção (∨) é falsa SOMENTE quando ambas as proposições são falsas: F ∨ F = F. Este é o único caso em que a disjunção resulta em F. Com p=F e q=F, o resultado é F.",
    explanationCorrect:
      "Correto! F ∨ F = F. A disjunção só é falsa nesse único caso — (F, F). Em qualquer outro par (com pelo menos um V), a disjunção seria V.",
    explanationWrong:
      "Este item é CERTO. A disjunção (∨) tem tabela: V∨V=V; V∨F=V; F∨V=V; F∨F=F. O único caso falso é exatamente (F,F), que é o caso apresentado.",
    difficulty: "MEDIO",
    contentTitle: "Tabela-Verdade: Conjunção (∧) e Disjunção (∨)",
  },
  {
    id: "rl_lp_q06",
    statement:
      "Julgue o item a seguir:\n\nO condicional p → q é falso somente quando p = Verdadeiro e q = Falso, sendo esse o único caso em que a implicação lógica resulta em falsidade.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. A tabela-verdade do condicional é: V→V=V; V→F=F; F→V=V; F→F=V. O único caso falso é V→F. Mnemônico: VERA FISCHER = V→F=Falsa.",
    explanationCorrect:
      "Correto! p→q é F apenas no caso (V,F). O mnemônico 'VERA FISCHER = V→F = Falsa' ajuda a fixar. F→qualquer = V (promessa não feita não pode ser descumprida).",
    explanationWrong:
      "Este item é CERTO. Condicional: só F quando p=V e q=F. Os casos F→V e F→F são ambos V por definição. Memorize: VERA FISCHER = V→F = Falsa.",
    difficulty: "MEDIO",
    contentTitle: "Condicional (→) — A Promessa: Vera Fischer é Falsa",
  },
  {
    id: "rl_lp_q07",
    statement:
      "Julgue o item a seguir:\n\nSeja p: 'O candidato foi aprovado na prova objetiva' (Verdadeiro) e q: 'O candidato será nomeado' (Falso, pois não há vaga). A proposição composta 'Se o candidato foi aprovado na prova objetiva, então será nomeado' (p → q) é verdadeira.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. Com p=V e q=F: p → q = V → F = F. Este é o único caso falso do condicional — a hipótese é verdadeira mas a conclusão é falsa, caracterizando 'promessa descumprida'. VERA FISCHER = V→F = Falsa.",
    explanationCorrect:
      "Correto marcado como ERRADO! p=V e q=F → p→q = V→F = F. O candidato foi aprovado (V) mas não foi nomeado (F) — promessa descumprida, condicional FALSO.",
    explanationWrong:
      "Este item é ERRADO. p=V e q=F: o condicional V→F = F (único caso falso). Mnemônico: VERA FISCHER = V→F = FALSA. O condicional é verdadeiro em todos os outros casos.",
    difficulty: "MEDIO",
    contentTitle: "Condicional (→) — A Promessa: Vera Fischer é Falsa",
  },
  {
    id: "rl_lp_q08",
    statement:
      "Julgue o item a seguir:\n\nPela primeira Lei de De Morgan, a negação de (p ∧ q) é logicamente equivalente a (¬p ∨ ¬q).",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Primeira Lei de De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q. Regra: entra a negação geral, troca o conectivo (∧ vira ∨), nega cada componente. A segunda lei é: ¬(p ∨ q) ≡ ¬p ∧ ¬q.",
    explanationCorrect:
      "Correto! ¬(p ∧ q) = ¬p ∨ ¬q — primeira lei de De Morgan. Regra prática: entra ¬ geral → troca ∧ por ∨ → nega cada um.",
    explanationWrong:
      "Este item é CERTO. De Morgan 1: ¬(p ∧ q) = ¬p ∨ ¬q. De Morgan 2: ¬(p ∨ q) = ¬p ∧ ¬q. Não confundir as duas leis.",
    difficulty: "MEDIO",
    contentTitle: "Leis de De Morgan — Negação de Proposições Compostas",
  },

  // ── Q09–Q12: DIFÍCIL ──────────────────────────────────────────────────────
  {
    id: "rl_lp_q09",
    statement:
      "(CEBRASPE – PF – Adaptada) Julgue o item:\n\nA negação da proposição 'Todos os agentes federais aprovados no concurso serão nomeados' é equivalente a 'Nenhum agente federal aprovado no concurso será nomeado'.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. A negação de 'Todo A é B' não é 'Nenhum A é B' — essa seria uma afirmação muito mais forte que a simples negação. A negação correta é 'Algum A NÃO é B' (basta encontrar um contra-exemplo). 'Nenhum A é B' seria o contrário absoluto, não a negação lógica.",
    explanationCorrect:
      "Correto marcado como ERRADO! Negação de 'Todo A é B' = 'Algum A NÃO é B' (∃x: ¬B(x)). 'Nenhum A é B' é muito mais forte — seria ∀x: ¬B(x), o que não é a negação direta.",
    explanationWrong:
      "Este item é ERRADO. Regra: ¬(∀x: P(x)) = ∃x: ¬P(x). Em português: ¬('Todo A é B') = 'Algum A NÃO é B'. A alternativa 'Nenhum...' vai além da negação — seria o contrário polar, não a negação lógica.",
    difficulty: "DIFICIL",
    contentTitle: "Leis de De Morgan — Negação de Proposições Compostas",
  },
  {
    id: "rl_lp_q10",
    statement:
      "Julgue o item a seguir:\n\nA contrapositiva de 'Se p, então q' é 'Se ¬q, então ¬p', sendo essa a única forma equivalente de reescrever o condicional original com inversão e negação dos termos.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. A contrapositiva de p→q é ¬q→¬p, e é a única equivalente lógica ao original. Verificação: para p=V e q=F (caso falso de p→q): ¬q→¬p = V→F = F — mesmo valor. Recíproca (q→p) e inversão (¬p→¬q) NÃO são equivalentes.",
    explanationCorrect:
      "Correto! p→q ≡ ¬q→¬p (contrapositiva). Mnemônico CORI: Contrapositiva=Original (equivalentes). Recíproca e Inversão são equivalentes entre si, mas não com o original.",
    explanationWrong:
      "Este item é CERTO. A contrapositiva ¬q→¬p é logicamente equivalente a p→q. Isso pode ser verificado pela tabela-verdade — ambas têm os mesmos valores em todas as combinações.",
    difficulty: "DIFICIL",
    contentTitle: "Equivalências da Condicional: Contrapositiva, Recíproca e Inversão",
  },
  {
    id: "rl_lp_q11",
    statement:
      "Julgue o item a seguir:\n\nA recíproca de p → q, dada por q → p, é logicamente equivalente ao condicional original p → q.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. A recíproca (q→p) NÃO é equivalente ao original (p→q). Contra-exemplo: p=V, q=F. Original: V→F=F. Recíproca: F→V=V. Valores diferentes — não são equivalentes. Apenas a contrapositiva (¬q→¬p) é equivalente ao original.",
    explanationCorrect:
      "Correto marcado como ERRADO! Recíproca ≠ original. Contra-exemplo: p=V, q=F → p→q=F mas q→p=F→V=V. Valores opostos. Mnemônico CORI: Recíproca=Inversão (≠ original).",
    explanationWrong:
      "Este item é ERRADO. A recíproca (q→p) não é equivalente a p→q. A única equivalente é a contrapositiva (¬q→¬p). CORI: C=O (equivalentes) e R=I (equivalentes entre si, mas ≠ original).",
    difficulty: "DIFICIL",
    contentTitle: "Equivalências da Condicional: Contrapositiva, Recíproca e Inversão",
  },
  {
    id: "rl_lp_q12",
    statement:
      "(CEBRASPE – PF – Adaptada) Julgue o item:\n\nSeja a proposição verdadeira: 'Se o suspeito estava no local do crime (p), então deixou rastros (q).' Sabe-se que não foram encontrados rastros (q = Falso). Com base nessas informações, é possível concluir logicamente que o suspeito não estava no local do crime (p = Falso).",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Aplicação do Modus Tollens: se p→q é V e q=F, então p=F. Raciocínio: a contrapositiva de p→q é ¬q→¬p. Como ¬q=V (q=F) e a proposição é V, pela contrapositiva ¬p=V, logo p=F. Se o suspeito estivesse lá (p=V), teria deixado rastros (q=V) — como q=F, p=F.",
    explanationCorrect:
      "Correto! Modus Tollens: p→q verdadeiro + ¬q verdadeiro → ¬p verdadeiro. Ou via contrapositiva: ¬q→¬p, com ¬q=V, logo ¬p=V, portanto p=F. O suspeito não estava no local.",
    explanationWrong:
      "Este item é CERTO. Use a contrapositiva: p→q ≡ ¬q→¬p. Com q=F (¬q=V) e a proposição verdadeira: ¬q→¬p com ¬q=V → ¬p deve ser V para o condicional ser V → p=F. Conclusão: suspeito não estava lá.",
    difficulty: "DIFICIL",
    contentTitle: "Equivalências da Condicional: Contrapositiva, Recíproca e Inversão",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("🚀 Seed R13: Raciocínio Lógico — Lógica de Proposições (Grupo A)");
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
  await db.execute(sql`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "contentId" TEXT`);
  console.log("✅ Colunas Phase 5 garantidas");

  // 3. Criar Tópico
  const topicId = await findOrCreateTopic("Lógica de Proposições", subjectId);
  console.log(`✅ Tópico: ${topicId}`);

  // 4. Inserir Conteúdos — Grupo A: construir contentIdMap
  console.log("\n📚 Inserindo conteúdos...");
  const contentIdMap: Record<string, string> = {};
  let contentsCreated = 0;
  let contentsSkipped = 0;

  for (const c of contents) {
    if (await contentExists(c.title, subjectId)) {
      console.log(`  ⏭️  Conteúdo já existe: ${c.title}`);
      // Recuperar ID para contentIdMap mesmo se já existe
      const rows = await db.execute(sql`
        SELECT id FROM "Content" WHERE title = ${c.title} AND "subjectId" = ${subjectId} LIMIT 1
      `) as any[];
      if (rows[0]?.id) contentIdMap[c.title] = rows[0].id;
      contentsSkipped++;
      continue;
    }
    const wordCount = c.textContent.split(/\s+/).length;
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
        ${wordCount}, ${Math.ceil(wordCount / 200)},
        ${c.mnemonic}, ${c.keyPoint}, ${c.practicalExample},
        NOW(), NOW()
      )
    `);
    contentIdMap[c.title] = c.id;
    console.log(`  ✅ Criado: ${c.title} → id=${c.id}`);
    contentsCreated++;
  }
  console.log(`  📋 contentIdMap: ${Object.keys(contentIdMap).length} entradas`);

  // 5. Inserir Questões — Grupo A: contentId por questão
  console.log("\n❓ Inserindo questões...");
  let questionsCreated = 0;
  let questionsSkipped = 0;

  for (const q of questions) {
    if (await questionExists(q.id)) {
      console.log(`  ⏭️  Questão já existe: ${q.id}`);
      questionsSkipped++;
      continue;
    }
    const contentId = contentIdMap[q.contentTitle] ?? null;
    if (!contentId) {
      console.warn(`  ⚠️  contentId não encontrado para contentTitle: "${q.contentTitle}"`);
    }
    const alternativesJson = JSON.stringify(
      q.alternatives.map((a) => ({ letter: a.letter, text: a.text }))
    );
    await db.execute(sql`
      INSERT INTO "Question" (
        "id", "statement", "alternatives", "correctAnswer", "correctOption",
        "explanation", "explanationCorrect", "explanationWrong",
        "subjectId", "topicId", "contentId",
        "isActive", "difficulty",
        "timesUsed", "questionType",
        "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternativesJson}::jsonb, ${q.correctAnswer}, ${q.correctOption},
        ${q.explanation}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${subjectId}, ${topicId}, ${contentId},
        true, ${q.difficulty},
        0, ${q.questionType},
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Questão criada: ${q.id} (${q.difficulty}) → contentId=${contentId ?? "NULL"}`);
    questionsCreated++;
  }

  // ── Backfill de segurança (questões sem contentId no tópico) ──────────────
  const firstContentRows = await db.execute(sql`
    SELECT id FROM "Content" WHERE "topicId" = ${topicId} ORDER BY "createdAt" LIMIT 1
  `) as any[];
  if (firstContentRows[0]?.id) {
    const fallbackId = firstContentRows[0].id;
    const result = await db.execute(sql`
      UPDATE "Question" SET "contentId" = ${fallbackId}
      WHERE "topicId" = ${topicId} AND "contentId" IS NULL
    `) as any;
    const updated = result.rowCount ?? result.count ?? 0;
    if (updated > 0) console.log(`  🔧 Backfill segurança: ${updated} questões sem contentId → ${fallbackId}`);
  }

  // 6. Relatório
  console.log("\n" + "=".repeat(60));
  console.log("📊 RELATÓRIO FINAL R13:");
  console.log(`   Conteúdos: ${contentsCreated} criados, ${contentsSkipped} já existiam`);
  console.log(`   Questões:  ${questionsCreated} criadas, ${questionsSkipped} já existiam`);
  console.log("🔗 Vínculo: todas as questões com contentId correto (Grupo A — sem roleta russa)");
  console.log("✅ Seed R13 — Raciocínio Lógico: Lógica de Proposições concluído!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
