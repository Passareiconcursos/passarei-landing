/**
 * Seed R29 — Raciocínio Lógico: Lógica Proposicional
 * 6 átomos de conteúdo  (rlm_lp_c01–c06)
 * 12 questões           (rlm_lp_q01–q12)
 *
 * Execução (Replit): npx tsx db/seed-rlm-logica-r29.ts
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

// ─── CONTEÚDOS ───────────────────────────────────────────────────────────────

const contents = [
  {
    id: "rlm_lp_c01",
    title: "Conceito de Proposição",
    difficulty: "EASY",
    mnemonic: "POVE: Proposição é Oração com Valor lógico Exclusivo (V ou F). Perguntas, ordens e paradoxos estão fora.",
    keyPoint:
      "• Proposição: sentença declarativa com valor lógico único (V ou F)\n" +
      "• NÃO são proposições: perguntas, ordens, exclamações, sentenças abertas\n" +
      "• Paradoxos (frases que contradizem a si mesmas) NÃO são proposições\n" +
      "• 'x + 2 = 5' não é proposição — valor depende de x (sentença aberta)",
    practicalExample:
      "Em prova CESPE: 'Brasília é a capital do Brasil.' → proposição (V). " +
      "'Feche a porta!' → NÃO é proposição (ordem). " +
      "'Este enunciado é falso.' → NÃO é proposição (paradoxo).",
    textContent:
      "Uma proposição, em Lógica, é qualquer sentença declarativa à qual se pode atribuir um único valor de verdade: verdadeiro (V) ou falso (F). " +
      "Este é o ponto de partida da Lógica Proposicional.\n\n" +
      "Para que uma sentença seja considerada proposição, ela deve satisfazer dois critérios essenciais: " +
      "(1) ser declarativa, ou seja, afirmar ou negar algo sobre a realidade; e " +
      "(2) ter valor lógico definido — não pode ser ao mesmo tempo verdadeira e falsa, nem indeterminada.\n\n" +
      "Exemplos de proposições válidas:\n" +
      "• 'O Brasil tem 26 estados e 1 Distrito Federal.' (V)\n" +
      "• 'A Lua é feita de queijo.' (F)\n" +
      "• 'Todo número par é divisível por 2.' (V)\n\n" +
      "Sentenças que NÃO são proposições:\n" +
      "• Perguntas: 'Quantos anos você tem?' — não é verdadeira nem falsa.\n" +
      "• Ordens/comandos: 'Saia da sala!' — não possui valor lógico.\n" +
      "• Exclamações: 'Que dia lindo!' — expressão de sentimento, sem valor de verdade.\n" +
      "• Sentenças abertas: 'x + 3 = 7' — o valor lógico depende do valor de x, desconhecido.\n" +
      "• Paradoxos: 'Esta frase é falsa.' — se verdadeira, é falsa; se falsa, é verdadeira. Contradição insanável.\n\n" +
      "As proposições podem ser simples (compostas de uma única afirmação) ou compostas " +
      "(formadas pela combinação de proposições simples por meio de conectivos lógicos como 'e', 'ou', 'se...então' e 'se e somente se').\n\n" +
      "Nas provas de concurso, a identificação de proposições costuma aparecer em questões do tipo " +
      "'identifique quais das sentenças abaixo são proposições' ou em itens certo/errado. " +
      "Atenção especial para sentenças abertas e paradoxos, que são as pegadinhas mais frequentes.",
  },
  {
    id: "rlm_lp_c02",
    title: "Conectivos E (∧) e OU (∨): Conjunção e Disjunção",
    difficulty: "EASY",
    mnemonic: "E-xige tudo (∧ só é V quando AMBAS V). OU basta um (∨ é F apenas quando AMBAS F).",
    keyPoint:
      "• Conjunção (p ∧ q): VERDADEIRA somente quando p e q são ambas verdadeiras\n" +
      "• Disjunção inclusiva (p ∨ q): FALSA somente quando p e q são ambas falsas\n" +
      "• Tabela p∧q: VV=V, VF=F, FV=F, FF=F\n" +
      "• Tabela p∨q: VV=V, VF=V, FV=V, FF=F\n" +
      "• Disjunção exclusiva (p ⊻ q): V quando valores são opostos (VF=V, FV=V, VV=F, FF=F)",
    practicalExample:
      "PF: 'O delegado assinou o auto E o escrivão conferiu.' (p∧q) — ambos devem ser V para autuar. " +
      "'O suspeito está preso OU solto sob fiança.' (p∨q) — basta uma das condições ser V.",
    textContent:
      "Os conectivos lógicos são operadores que combinam proposições simples para formar proposições compostas. " +
      "Os mais básicos são a conjunção (∧) e a disjunção (∨).\n\n" +
      "CONJUNÇÃO — símbolo: ∧ (lê-se 'e')\n" +
      "A proposição composta 'p ∧ q' é verdadeira SOMENTE quando ambas as proposições componentes são verdadeiras. " +
      "Qualquer componente falso torna a conjunção falsa.\n\n" +
      "Tabela-verdade da Conjunção (p ∧ q):\n" +
      "V ∧ V = V\nV ∧ F = F\nF ∧ V = F\nF ∧ F = F\n\n" +
      "Regra prática: a conjunção exige que todos os componentes sejam verdadeiros. " +
      "Basta um componente falso para tornar a conjunção falsa.\n\n" +
      "DISJUNÇÃO INCLUSIVA — símbolo: ∨ (lê-se 'ou')\n" +
      "A proposição composta 'p ∨ q' é FALSA somente quando ambas as proposições componentes são falsas. " +
      "Caso ao menos uma seja verdadeira, a disjunção é verdadeira.\n\n" +
      "Tabela-verdade da Disjunção (p ∨ q):\n" +
      "V ∨ V = V\nV ∨ F = V\nF ∨ V = V\nF ∨ F = F\n\n" +
      "Regra prática: basta um componente verdadeiro para que a disjunção inclusiva seja verdadeira.\n\n" +
      "DISJUNÇÃO EXCLUSIVA — símbolo: ⊻ (lê-se 'ou exclusivo')\n" +
      "Verdadeira quando exatamente UMA das proposições é verdadeira; falsa quando ambas têm o mesmo valor.\n\n" +
      "Tabela-verdade da Disjunção Exclusiva (p ⊻ q):\n" +
      "V ⊻ V = F\nV ⊻ F = V\nF ⊻ V = V\nF ⊻ F = F\n\n" +
      "Atenção: em português, o 'ou' pode ser inclusivo (pode-se ter os dois) ou exclusivo (apenas um). " +
      "Em Lógica, sem indicação contrária, usa-se o 'ou' inclusivo (∨).",
  },
  {
    id: "rlm_lp_c03",
    title: "Condicional (p → q): Se... Então",
    difficulty: "MEDIUM",
    mnemonic: "Só V→F dá F. Vera Fischer: a condicional MENTE apenas quando a premissa é V e a conclusão é F.",
    keyPoint:
      "• Condicional (p → q): falsa SOMENTE quando p=V e q=F\n" +
      "• p é o antecedente (hipótese); q é o consequente (tese)\n" +
      "• Contrapositiva ¬q → ¬p: equivalente à original\n" +
      "• Recíproca q → p: NÃO equivalente à original\n" +
      "• Negação: ¬(p → q) = p ∧ ¬q",
    practicalExample:
      "Regra policial: 'Se o suspeito fugiu (V), será indiciado (F)' → FALSO (V→F=F). " +
      "'Se não houve flagrante (F), não há prisão (V)' → VERDADEIRO (F→V=V). " +
      "Pegadinha clássica: F→F também é V!",
    textContent:
      "A proposição condicional é uma das mais cobradas em concursos. " +
      "Ela conecta duas proposições com a estrutura 'Se p, então q', simbolizada por p → q.\n\n" +
      "TERMINOLOGIA:\n" +
      "• p é chamado de antecedente, hipótese, condição suficiente ou premissa.\n" +
      "• q é chamado de consequente, tese, condição necessária ou conclusão.\n\n" +
      "TABELA-VERDADE DA CONDICIONAL (p → q):\n" +
      "V → V = V\n" +
      "V → F = F  ← único caso falso!\n" +
      "F → V = V\n" +
      "F → F = V\n\n" +
      "REGRA FUNDAMENTAL: A condicional só é FALSA quando o antecedente é VERDADEIRO e o consequente é FALSO (V→F=F). " +
      "Nos demais casos, é sempre verdadeira.\n\n" +
      "INTERPRETAÇÃO INTUITIVA: A condicional é uma promessa. " +
      "'Se chover, levarei guarda-chuva.' A promessa só é quebrada (falsa) se chover (V) E eu não levar o guarda-chuva (F). " +
      "Se não chover, não importa o que eu fizer — a promessa não foi quebrada.\n\n" +
      "PROPOSIÇÕES DERIVADAS — Dado p → q:\n" +
      "• Recíproca: q → p (não equivalente)\n" +
      "• Contrária: ¬p → ¬q (não equivalente)\n" +
      "• Contrapositiva: ¬q → ¬p (EQUIVALENTE à original)\n\n" +
      "NEGAÇÃO DA CONDICIONAL: ¬(p → q) = p ∧ ¬q\n" +
      "Exemplo: ¬('Se estuda, então passa') = 'Estuda E não passa.'\n\n" +
      "FORMAS EQUIVALENTES DE p → q EM PORTUGUÊS:\n" +
      "• 'Se p, então q'\n• 'p é condição suficiente para q'\n" +
      "• 'q é condição necessária para p'\n• 'p somente se q'\n" +
      "• 'Todo p é q'\n• 'Não há p sem q'",
  },
  {
    id: "rlm_lp_c04",
    title: "Bicondicional (p ↔ q) e Ou Exclusivo (p ⊻ q)",
    difficulty: "MEDIUM",
    mnemonic: "BI-iguais dão V (↔ é V quando p e q têm o MESMO valor). XOR-opostos dão V (⊻ é V quando têm valores DIFERENTES).",
    keyPoint:
      "• Bicondicional (p ↔ q): V quando p e q têm o MESMO valor lógico (VV ou FF)\n" +
      "• Ou Exclusivo (p ⊻ q): V quando p e q têm valores DIFERENTES (VF ou FV)\n" +
      "• p ↔ q ≡ (p→q) ∧ (q→p)\n" +
      "• p ⊻ q ≡ ¬(p ↔ q) — tabelas-verdade são opostas\n" +
      "• Bicondicional: VV=V, VF=F, FV=F, FF=V",
    practicalExample:
      "Edital CEBRASPE: 'O candidato é aprovado se e somente se obtiver nota ≥ 60.' (bicondicional ↔). " +
      "'O concursando escolhe Direito Civil OU Penal, mas não ambos.' (ou exclusivo ⊻).",
    textContent:
      "O bicondicional e o ou exclusivo são conectivos que expressam relações de equivalência e exclusividade entre proposições.\n\n" +
      "BICONDICIONAL — símbolo: ↔ (lê-se 'se e somente se' / 'sse')\n" +
      "A proposição 'p ↔ q' é verdadeira quando p e q possuem o MESMO valor lógico — ambas verdadeiras ou ambas falsas.\n\n" +
      "Tabela-verdade do Bicondicional (p ↔ q):\n" +
      "V ↔ V = V\nV ↔ F = F\nF ↔ V = F\nF ↔ F = V\n\n" +
      "Equivalência fundamental: p ↔ q ≡ (p → q) ∧ (q → p)\n" +
      "O bicondicional é a conjunção da condicional e de sua recíproca.\n\n" +
      "Interpretação: 'p se e somente se q' significa que p e q são mutuamente necessários — " +
      "um não ocorre sem o outro, e vice-versa.\n\n" +
      "OU EXCLUSIVO — símbolo: ⊻ (lê-se 'ou exclusivo' / XOR)\n" +
      "A proposição 'p ⊻ q' é verdadeira quando p e q possuem valores lógicos DIFERENTES.\n\n" +
      "Tabela-verdade do Ou Exclusivo (p ⊻ q):\n" +
      "V ⊻ V = F\nV ⊻ F = V\nF ⊻ V = V\nF ⊻ F = F\n\n" +
      "Relação com o bicondicional: p ⊻ q ≡ ¬(p ↔ q)\n" +
      "As tabelas-verdade do bicondicional e do ou exclusivo são exatamente opostas.\n\n" +
      "Negação do bicondicional: ¬(p ↔ q) = p ⊻ q = (p ∧ ¬q) ∨ (¬p ∧ q)\n\n" +
      "EM CONCURSOS: questões frequentemente testam se o candidato distingue 'ou inclusivo' (∨), " +
      "'ou exclusivo' (⊻) e 'se e somente se' (↔). " +
      "O bicondicional é o mais cobrado dos três, especialmente em CEBRASPE e FGV.",
  },
  {
    id: "rlm_lp_c05",
    title: "Tabelas-Verdade: Cálculo de Linhas, Tautologia e Equivalência",
    difficulty: "MEDIUM",
    mnemonic: "2^n linhas (n = número de variáveis). TAUTO = sempre V. CONTRA = sempre F. CONTIN = às vezes V, às vezes F.",
    keyPoint:
      "• Tabela com n variáveis tem 2^n linhas (1→2, 2→4, 3→8, 4→16)\n" +
      "• Tautologia: fórmula sempre verdadeira (ex: p ∨ ¬p)\n" +
      "• Contradição (antilogia): fórmula sempre falsa (ex: p ∧ ¬p)\n" +
      "• Contingência: verdadeira em algumas linhas, falsa em outras\n" +
      "• Equivalência lógica (p ≡ q): mesma tabela-verdade; p ↔ q é tautologia",
    practicalExample:
      "PRF: 'Quantas linhas tem a tabela de (p→q)∧(q→r)?' → 3 variáveis → 2³=8 linhas. " +
      "'p ∨ ¬p' é tautologia (sempre V — terceiro excluído). " +
      "'p ∧ ¬p' é contradição (sempre F — não contradição).",
    textContent:
      "A tabela-verdade é o instrumento fundamental para analisar o valor lógico de proposições compostas " +
      "em todas as combinações possíveis dos valores de suas proposições simples.\n\n" +
      "NÚMERO DE LINHAS DA TABELA-VERDADE:\n" +
      "Para uma fórmula com n variáveis proposicionais distintas, a tabela-verdade possui 2^n linhas.\n" +
      "• 1 variável (p): 2¹ = 2 linhas\n" +
      "• 2 variáveis (p, q): 2² = 4 linhas\n" +
      "• 3 variáveis (p, q, r): 2³ = 8 linhas\n" +
      "• 4 variáveis: 2⁴ = 16 linhas\n\n" +
      "COMO MONTAR A TABELA-VERDADE:\n" +
      "A distribuição de V e F nas colunas segue um padrão binário:\n" +
      "• Última variável: alterna V e F a cada linha\n" +
      "• Penúltima: alterna a cada 2 linhas\n" +
      "• Antepenúltima: alterna a cada 4 linhas\n\n" +
      "CLASSIFICAÇÃO DE FÓRMULAS:\n" +
      "1. Tautologia: fórmula VERDADEIRA em todas as linhas da tabela-verdade.\n" +
      "   Exemplos: p ∨ ¬p (princípio do terceiro excluído), p → p, (p→q) ↔ (¬q→¬p)\n\n" +
      "2. Contradição (ou Antilogia): fórmula FALSA em todas as linhas.\n" +
      "   Exemplos: p ∧ ¬p (princípio da não contradição), (p∧q) ∧ ¬p\n\n" +
      "3. Contingência: verdadeira em algumas linhas e falsa em outras.\n" +
      "   Exemplos: p → q, p ∧ q, p ∨ q\n\n" +
      "EQUIVALÊNCIA LÓGICA:\n" +
      "Duas fórmulas p e q são logicamente equivalentes (p ≡ q) quando possuem a mesma tabela-verdade, " +
      "o que equivale a dizer que p ↔ q é uma tautologia.\n\n" +
      "Equivalências fundamentais para concursos:\n" +
      "• p → q ≡ ¬q → ¬p (contrapositiva)\n" +
      "• p → q ≡ ¬p ∨ q\n" +
      "• ¬(p ∧ q) ≡ ¬p ∨ ¬q (De Morgan)\n" +
      "• ¬(p ∨ q) ≡ ¬p ∧ ¬q (De Morgan)\n" +
      "• p ↔ q ≡ (p → q) ∧ (q → p)",
  },
  {
    id: "rlm_lp_c06",
    title: "Negação de Proposições: De Morgan e Quantificadores",
    difficulty: "HARD",
    mnemonic: "De Morgan: troca o conectivo (e↔ou) e nega tudo. Quantificadores: Todo↔Algum não; Nenhum↔Algum.",
    keyPoint:
      "• ¬(p ∧ q) = ¬p ∨ ¬q (De Morgan 1 — nega conjunção, troca para ou)\n" +
      "• ¬(p ∨ q) = ¬p ∧ ¬q (De Morgan 2 — nega disjunção, troca para e)\n" +
      "• ¬(p → q) = p ∧ ¬q (nega condicional: mantém antecedente, nega consequente)\n" +
      "• ¬(Todo A é B) = Algum A não é B\n" +
      "• ¬(Nenhum A é B) = Algum A é B\n" +
      "• ¬(Algum A é B) = Nenhum A é B",
    practicalExample:
      "CESPE: Negar 'Se chove então o trânsito piora' = 'Chove E o trânsito não piora'. " +
      "Negar 'Todos os policiais são concursados' = 'Algum policial não é concursado'. " +
      "Negar 'Nenhum suspeito foi solto' = 'Algum suspeito foi solto'.",
    textContent:
      "A negação de proposições compostas é um dos tópicos mais cobrados em concursos, " +
      "especialmente os organizados pela banca CEBRASPE/CESPE. " +
      "Dominar as Leis de De Morgan e a negação de quantificadores é essencial.\n\n" +
      "LEIS DE DE MORGAN:\n\n" +
      "Primeira lei: ¬(p ∧ q) = ¬p ∨ ¬q\n" +
      "Regra: a negação de uma CONJUNÇÃO transforma o 'e' em 'ou' e nega cada componente.\n" +
      "Exemplo: ¬('João estuda E trabalha') = 'João não estuda OU não trabalha'\n\n" +
      "Segunda lei: ¬(p ∨ q) = ¬p ∧ ¬q\n" +
      "Regra: a negação de uma DISJUNÇÃO transforma o 'ou' em 'e' e nega cada componente.\n" +
      "Exemplo: ¬('O réu é culpado OU inocente') = 'O réu não é culpado E não é inocente'\n\n" +
      "NEGAÇÃO DA CONDICIONAL:\n" +
      "¬(p → q) = p ∧ ¬q\n" +
      "Regra: mantém-se o antecedente (p) e nega-se o consequente (¬q), ligando-os por 'e'.\n" +
      "Exemplo: ¬('Se estudar, então passará') = 'Estudará E não passará'\n\n" +
      "NEGAÇÃO DO BICONDICIONAL:\n" +
      "¬(p ↔ q) = p ⊻ q = (p ∧ ¬q) ∨ (¬p ∧ q)\n\n" +
      "NEGAÇÃO DE QUANTIFICADORES:\n" +
      "• ¬('Todo A é B') = 'Algum A não é B'\n" +
      "• ¬('Nenhum A é B') = 'Algum A é B'\n" +
      "• ¬('Algum A é B') = 'Nenhum A é B'\n" +
      "• ¬('Algum A não é B') = 'Todo A é B'\n\n" +
      "Macete — opostos contraditórios:\n" +
      "Todo ↔ Algum não (são contraditórios — negação um do outro)\n" +
      "Nenhum ↔ Algum (são contraditórios — negação um do outro)\n\n" +
      "PROCEDIMENTO PARA NEGAR PROPOSIÇÕES COMPOSTAS:\n" +
      "1. Identifique o conectivo principal da fórmula\n" +
      "2. Aplique a regra de negação correspondente\n" +
      "3. Simplifique se necessário\n\n" +
      "Exemplo completo: Negar 'Todo policial civil é concursado e recebe insalubridade'\n" +
      "= ¬('Todo policial civil é concursado') ∨ ¬('recebe insalubridade')\n" +
      "= 'Algum policial civil não é concursado OU não recebe insalubridade'",
  },
];

// ─── QUESTÕES ─────────────────────────────────────────────────────────────────

const questions = [
  // ── Q01 — rlm_lp_c01 — Múltipla Escolha ──
  {
    id: "rlm_lp_q01",
    contentId: "rlm_lp_c01",
    statement:
      "Assinale a alternativa que apresenta APENAS proposições lógicas válidas.",
    alternatives: [
      { letter: "A", text: "'Brasília é a capital do Brasil.' e 'Feche a porta!'" },
      { letter: "B", text: "'Todo número primo é ímpar.' e 'x + 3 = 7'" },
      { letter: "C", text: "'A Lua orbita a Terra.' e '2 + 2 = 5.'" },
      { letter: "D", text: "'Que dia lindo!' e 'O Brasil tem 26 estados.'" },
      { letter: "E", text: "'Você gosta de matemática?' e 'Estude mais.'" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Apenas a alternativa C apresenta duas proposições válidas: 'A Lua orbita a Terra' (V) e '2+2=5' (F). " +
      "Ambas são sentenças declarativas com valor lógico definido. " +
      "As demais contêm ordens, perguntas, exclamações ou sentenças abertas (x+3=7), que não são proposições.",
    explanationCorrect:
      "Correto! 'A Lua orbita a Terra' e '2+2=5' são proposições porque são sentenças declarativas " +
      "às quais se atribui valor de verdade (V e F, respectivamente). " +
      "Uma proposição falsa ainda é proposição — o que importa é ter valor lógico definido.",
    explanationWrong:
      "Proposição é SOMENTE sentença declarativa com valor lógico definido. " +
      "Ordens ('Feche!'), perguntas ('Você gosta?'), exclamações ('Que lindo!') e " +
      "sentenças abertas ('x+3=7', valor depende de x) NÃO são proposições. " +
      "Apenas a alternativa C apresenta dois exemplos válidos.",
    difficulty: "EASY",
    questionType: "MULTIPLE_CHOICE",
  },
  // ── Q02 — rlm_lp_c01 — CERTO/ERRADO ──
  {
    id: "rlm_lp_q02",
    contentId: "rlm_lp_c01",
    statement:
      "(CESPE/CEBRASPE — Adaptada) A sentença 'Este enunciado é falso' é uma proposição lógica, " +
      "pois é uma frase declarativa que pode ser classificada como verdadeira ou falsa.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "'Este enunciado é falso' é um paradoxo: se for verdadeiro, então é falso; se for falso, então é verdadeiro. " +
      "A proposição lógica exige valor de verdade ÚNICO e DEFINIDO. " +
      "Paradoxos violam esse requisito e, portanto, NÃO são proposições lógicas.",
    explanationCorrect:
      "Correto! A frase é paradoxal e não possui valor de verdade definido. " +
      "Paradoxos não são proposições: a Lógica exige que uma proposição seja verdadeira OU falsa — nunca ambos e nunca nenhum.",
    explanationWrong:
      "Embora seja declarativa, o paradoxo não tem valor lógico DEFINIDO — condição indispensável para ser proposição. " +
      "Uma sentença que contradiz a si mesma não pode ser V nem F de forma consistente. " +
      "Resposta correta: ERRADO.",
    difficulty: "EASY",
    questionType: "CERTO_ERRADO",
  },
  // ── Q03 — rlm_lp_c02 — Múltipla Escolha ──
  {
    id: "rlm_lp_q03",
    contentId: "rlm_lp_c02",
    statement:
      "Considere p = V e q = F. Qual é o valor lógico de (p ∧ q) ∨ (¬p ∨ q)?",
    alternatives: [
      { letter: "A", text: "Verdadeiro, pois a conjunção p∧q é verdadeira." },
      { letter: "B", text: "Verdadeiro, pois ¬p∨q é verdadeira quando p=V e q=F." },
      { letter: "C", text: "Falso, pois a conjunção p∧q é falsa e ¬p∨q é falsa, resultando em F∨F=F." },
      { letter: "D", text: "Verdadeiro, pois basta um componente da disjunção final ser verdadeiro." },
      { letter: "E", text: "Verdadeiro, pois ¬p=V quando p=V, tornando ¬p∨q verdadeira." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Com p=V e q=F: (1) p∧q = V∧F = F. (2) ¬p = F (negação de V); ¬p∨q = F∨F = F. " +
      "(3) (p∧q)∨(¬p∨q) = F∨F = F. A proposição é FALSA.",
    explanationCorrect:
      "Perfeito! Passo a passo: p∧q = V∧F = F (conjunção exige ambas V). " +
      "¬p = F (negação de verdadeiro). ¬p∨q = F∨F = F (disjunção é F só quando ambas F). " +
      "F∨F = F. Resultado final: FALSO.",
    explanationWrong:
      "Releia as tabelas: p∧q = V∧F = F (conjunção exige ambos V). " +
      "¬p = F pois p=V. ¬p∨q = F∨F = F. A disjunção final de dois F é F. " +
      "Cuidado: ¬p não é V quando p=V — é exatamente o oposto.",
    difficulty: "MEDIUM",
    questionType: "MULTIPLE_CHOICE",
  },
  // ── Q04 — rlm_lp_c02 — CERTO/ERRADO ──
  {
    id: "rlm_lp_q04",
    contentId: "rlm_lp_c02",
    statement:
      "(FGV — Adaptada) A disjunção inclusiva p ∨ q é falsa somente quando ambas as proposições p e q são falsas simultaneamente.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. A tabela-verdade da disjunção inclusiva mostra: V∨V=V, V∨F=V, F∨V=V, F∨F=F. " +
      "O único caso em que p∨q é falsa ocorre quando p=F e q=F simultaneamente. " +
      "Em todos os outros casos (ao menos uma verdadeira), a disjunção é verdadeira.",
    explanationCorrect:
      "Exato! Esta é a definição precisa da disjunção inclusiva. " +
      "F∨F=F é o único caso de falsidade — basta uma proposição verdadeira para tornar o 'ou' inclusivo verdadeiro.",
    explanationWrong:
      "Este item está CERTO. A afirmação descreve corretamente a disjunção inclusiva. " +
      "F∨F=F é o único caso falso. Não confunda com a conjunção (∧), que é falsa em 3 dos 4 casos.",
    difficulty: "EASY",
    questionType: "CERTO_ERRADO",
  },
  // ── Q05 — rlm_lp_c03 — Múltipla Escolha ──
  {
    id: "rlm_lp_q05",
    contentId: "rlm_lp_c03",
    statement:
      "Dado que a proposição condicional 'Se o candidato estudou (p), então foi aprovado (q)' é FALSA, " +
      "pode-se concluir que:",
    alternatives: [
      { letter: "A", text: "O candidato não estudou e não foi aprovado." },
      { letter: "B", text: "O candidato não estudou, independentemente de ter sido aprovado." },
      { letter: "C", text: "O candidato estudou e foi aprovado." },
      { letter: "D", text: "O candidato estudou e não foi aprovado." },
      { letter: "E", text: "O candidato não estudou e foi aprovado." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "A condicional p→q é FALSA somente quando p=V e q=F. " +
      "Portanto: o candidato estudou (p=V) e não foi aprovado (q=F). " +
      "Este é o único caso que torna a condicional falsa.",
    explanationCorrect:
      "Excelente! p→q é F unicamente quando p=V e q=F. " +
      "Logo: estudou (p=V) e não foi aprovado (q=F). " +
      "Esta é a regra de ouro da condicional — memorize: só V→F dá F.",
    explanationWrong:
      "p→q é falsa SOMENTE com p=V e q=F. " +
      "Se a condicional é falsa, o antecedente DEVE ser verdadeiro e o consequente DEVE ser falso. " +
      "Qualquer outra combinação tornaria a condicional verdadeira.",
    difficulty: "MEDIUM",
    questionType: "MULTIPLE_CHOICE",
  },
  // ── Q06 — rlm_lp_c03 — CERTO/ERRADO ──
  {
    id: "rlm_lp_q06",
    contentId: "rlm_lp_c03",
    statement:
      "(CEBRASPE — Adaptada) A proposição 'Se p, então q' (p → q) é logicamente equivalente à sua " +
      "contrapositiva '¬q → ¬p', mas não é equivalente à sua recíproca 'q → p'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. A contrapositiva (¬q→¬p) tem exatamente a mesma tabela-verdade que a condicional original (p→q), " +
      "portanto são logicamente equivalentes. " +
      "Já a recíproca (q→p) possui tabela-verdade diferente e NÃO é equivalente. " +
      "Esta distinção é clássica em provas CEBRASPE.",
    explanationCorrect:
      "Correto! Equivalências da condicional p→q: contrapositiva ¬q→¬p: equivalente; " +
      "recíproca q→p: não equivalente; contrária ¬p→¬q: não equivalente. " +
      "Apenas a contrapositiva preserva a equivalência lógica.",
    explanationWrong:
      "Este item está CERTO. A contrapositiva e a condicional são equivalentes (mesma tabela-verdade). " +
      "Verifique: p=V,q=F → p→q=F e ¬q→¬p=V→F=F. Iguais! " +
      "Já q→p=F→V=V ≠ F. Portanto a recíproca não é equivalente.",
    difficulty: "MEDIUM",
    questionType: "CERTO_ERRADO",
  },
  // ── Q07 — rlm_lp_c04 — Múltipla Escolha ──
  {
    id: "rlm_lp_q07",
    contentId: "rlm_lp_c04",
    statement:
      "Com p = F e q = F, qual é o valor lógico do bicondicional p ↔ q e qual conectivo possui " +
      "tabela-verdade oposta à do bicondicional?",
    alternatives: [
      { letter: "A", text: "Falso; a condicional (p→q) é o oposto do bicondicional." },
      { letter: "B", text: "Verdadeiro; a conjunção (p∧q) é o oposto do bicondicional." },
      { letter: "C", text: "Falso; o ou exclusivo (p⊻q) é o oposto do bicondicional." },
      { letter: "D", text: "Verdadeiro; o ou exclusivo (p⊻q) possui tabela-verdade oposta à do bicondicional." },
      { letter: "E", text: "Verdadeiro; a disjunção inclusiva (p∨q) é o oposto do bicondicional." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "Com p=F e q=F: p↔q = F↔F = V (bicondicional é V quando ambos têm o mesmo valor). " +
      "O ou exclusivo (⊻) possui tabela oposta: VV=F, VF=V, FV=V, FF=F. " +
      "Como p⊻q ≡ ¬(p↔q), quando o bicondicional é V, o ⊻ é F. Portanto: p↔q=V e ⊻ é o oposto.",
    explanationCorrect:
      "Perfeito! F↔F=V (iguais → bicondicional V). " +
      "O ou exclusivo tem tabela oposta: FF=F. " +
      "A relação p⊻q ≡ ¬(p↔q) confirma que são complementares. Dominar essa relação resolve dezenas de questões.",
    explanationWrong:
      "F↔F=V (ambos F → mesmo valor → bicondicional verdadeiro). " +
      "O oposto do bicondicional é o ou exclusivo (⊻), pois p⊻q ≡ ¬(p↔q). " +
      "Quando o bicondicional é V, o ⊻ é F, e vice-versa.",
    difficulty: "MEDIUM",
    questionType: "MULTIPLE_CHOICE",
  },
  // ── Q08 — rlm_lp_c04 — CERTO/ERRADO ──
  {
    id: "rlm_lp_q08",
    contentId: "rlm_lp_c04",
    statement:
      "(VUNESP — Adaptada) A proposição 'Pedro passa no concurso se e somente se estudar todo dia' " +
      "é verdadeira quando Pedro estuda todo dia mas não passa no concurso.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. O bicondicional (p↔q) é verdadeiro SOMENTE quando p e q têm o mesmo valor lógico. " +
      "Na situação: 'estuda todo dia' (p=V) e 'não passa' (q=F) → V↔F = F. " +
      "O bicondicional é FALSO, pois os valores são diferentes.",
    explanationCorrect:
      "Correto! V↔F = F. O bicondicional exige que ambas as proposições tenham o mesmo valor. " +
      "'Estuda' (V) e 'não passa' (F) são valores opostos, portanto o bicondicional é falso.",
    explanationWrong:
      "O bicondicional é FALSO quando as proposições têm valores diferentes. " +
      "'Estuda todo dia' (V) e 'não passa' (F): V↔F = F. " +
      "O item está ERRADO ao afirmar que seria verdadeiro nessa situação.",
    difficulty: "MEDIUM",
    questionType: "CERTO_ERRADO",
  },
  // ── Q09 — rlm_lp_c05 — Múltipla Escolha ──
  {
    id: "rlm_lp_q09",
    contentId: "rlm_lp_c05",
    statement:
      "A fórmula lógica (p → q) ↔ (¬p ∨ q) é classificada como:",
    alternatives: [
      { letter: "A", text: "Contingência, pois seu valor lógico depende dos valores de p e q." },
      { letter: "B", text: "Contradição, pois é sempre falsa." },
      { letter: "C", text: "Tautologia, pois p→q e ¬p∨q são logicamente equivalentes e o bicondicional de equivalentes é sempre V." },
      { letter: "D", text: "Contingência, pois é falsa quando p=V e q=F." },
      { letter: "E", text: "Contradição, pois o bicondicional de fórmulas equivalentes é sempre F." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "p→q e ¬p∨q são logicamente equivalentes (mesma tabela-verdade). " +
      "O bicondicional de duas fórmulas equivalentes é uma TAUTOLOGIA. " +
      "Verificando: V,V: V↔V=V; V,F: F↔F=V; F,V: V↔V=V; F,F: V↔V=V. Sempre V.",
    explanationCorrect:
      "Exato! A equivalência p→q ≡ ¬p∨q é fundamental. " +
      "O bicondicional de proposições equivalentes é sempre tautologia — verdadeiro em todas as linhas. " +
      "Memorize: p→q ≡ ¬p∨q.",
    explanationWrong:
      "p→q e ¬p∨q têm tabelas-verdade idênticas (são equivalentes). " +
      "O bicondicional de fórmulas equivalentes é TAUTOLOGIA (sempre V), nunca contradição nem contingência. " +
      "Verifique linha a linha: em todos os casos, ambos os lados do ↔ têm o mesmo valor.",
    difficulty: "HARD",
    questionType: "MULTIPLE_CHOICE",
  },
  // ── Q10 — rlm_lp_c05 — CERTO/ERRADO ──
  {
    id: "rlm_lp_q10",
    contentId: "rlm_lp_c05",
    statement:
      "(CESPE — Adaptada) Uma fórmula lógica que envolve 4 variáveis proposicionais distintas " +
      "possui tabela-verdade com 16 linhas, e, se for verdadeira em todas essas linhas, " +
      "classifica-se como tautologia.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Com 4 variáveis: 2⁴ = 16 linhas. " +
      "Uma fórmula verdadeira em TODAS as linhas da tabela-verdade é, por definição, uma tautologia. " +
      "O item está integralmente correto em ambas as afirmações.",
    explanationCorrect:
      "Correto! 2^4 = 16 linhas (regra: 2^n para n variáveis). " +
      "Tautologia = verdadeira em 100% das linhas. Ambas as informações do item estão corretas.",
    explanationWrong:
      "Este item está CERTO. 4 variáveis → 2⁴=16 linhas. " +
      "Fórmula verdadeira em todas as linhas = tautologia. Ambas as afirmações são corretas.",
    difficulty: "EASY",
    questionType: "CERTO_ERRADO",
  },
  // ── Q11 — rlm_lp_c06 — Múltipla Escolha ──
  {
    id: "rlm_lp_q11",
    contentId: "rlm_lp_c06",
    statement:
      "Qual é a negação correta da proposição: " +
      "'Todos os agentes de polícia são aprovados no curso de formação ou recebem treinamento complementar'?",
    alternatives: [
      { letter: "A", text: "'Nenhum agente de polícia é aprovado no curso de formação e não recebe treinamento complementar.'" },
      { letter: "B", text: "'Algum agente de polícia não é aprovado no curso de formação e não recebe treinamento complementar.'" },
      { letter: "C", text: "'Todos os agentes de polícia não são aprovados no curso de formação ou não recebem treinamento complementar.'" },
      { letter: "D", text: "'Algum agente de polícia não é aprovado no curso de formação ou não recebe treinamento complementar.'" },
      { letter: "E", text: "'Nenhum agente de polícia é aprovado no curso de formação ou recebe treinamento complementar.'" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A proposição é: 'Todo A é (p ∨ q)'. " +
      "Passo 1: ¬(Todo A é X) = 'Algum A não é X'. " +
      "Passo 2: ¬(p ∨ q) = ¬p ∧ ¬q (De Morgan). " +
      "Resultado: 'Algum agente não é aprovado E não recebe treinamento.' Alternativa B.",
    explanationCorrect:
      "Excelente! Passo a passo: ¬(Todo A é p∨q) = Algum A não é (p∨q). " +
      "Por De Morgan: ¬(p∨q) = ¬p∧¬q. " +
      "Resultado: 'Algum agente não é aprovado E não recebe treinamento complementar.'",
    explanationWrong:
      "Processo correto: (1) ¬(Todo A é X) = 'Algum A não é X'; " +
      "(2) De Morgan na disjunção: ¬(p∨q) = ¬p∧¬q — o 'ou' vira 'e'. " +
      "A resposta correta é 'algum... não... E não...' (opção B).",
    difficulty: "HARD",
    questionType: "MULTIPLE_CHOICE",
  },
  // ── Q12 — rlm_lp_c06 — CERTO/ERRADO ──
  {
    id: "rlm_lp_q12",
    contentId: "rlm_lp_c06",
    statement:
      "(CEBRASPE — Adaptada) A negação da proposição 'Se o suspeito tinha motivo (p), então cometeu o crime (q)' " +
      "é: 'O suspeito não tinha motivo ou não cometeu o crime'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. A negação correta de p→q é p ∧ ¬q — mantém o antecedente e nega o consequente, ligados por 'e'. " +
      "Portanto: ¬(p→q) = 'O suspeito tinha motivo E não cometeu o crime.' " +
      "A alternativa apresentada (¬p∨¬q) é a negação de (p∧q), não de (p→q).",
    explanationCorrect:
      "Correto! ¬(p→q) = p ∧ ¬q. " +
      "'Tinha motivo (p=V) E não cometeu o crime (¬q)'. " +
      "A fórmula no item (¬p∨¬q) corresponderia a ¬(p∧q) — confusão frequente em provas.",
    explanationWrong:
      "A negação de p→q é p∧¬q, não ¬p∨¬q. " +
      "'Tinha motivo E não cometeu o crime' é o correto. " +
      "¬p∨¬q seria De Morgan aplicado a uma conjunção (p∧q), não à condicional. " +
      "Este item está ERRADO.",
    difficulty: "HARD",
    questionType: "CERTO_ERRADO",
  },
];

// ─── RUNNER ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Seed R29 — Raciocínio Lógico: Lógica Proposicional ===\n");

  // 1. Resolver Subject
  const subjectRows = await db.execute(sql`
    SELECT id FROM "Subject"
    WHERE name ILIKE '%Racioc%nio%'
       OR name ILIKE '%Racioc%'
       OR name ILIKE '%L%gico%'
    ORDER BY name
    LIMIT 1
  `) as any[];

  if (!subjectRows[0]) {
    throw new Error('Subject com "Raciocínio" não encontrado. Verifique o banco.');
  }
  const subjectId = subjectRows[0].id;
  console.log(`Subject encontrado: ${subjectId}`);

  // 2. Resolver Topic (primeiro disponível do subject)
  const topicRows = await db.execute(sql`
    SELECT id FROM "Topic"
    WHERE "subjectId" = ${subjectId}
    ORDER BY name
    LIMIT 1
  `) as any[];

  if (!topicRows[0]) {
    throw new Error("Nenhum Topic encontrado para este Subject.");
  }
  const topicId = topicRows[0].id;
  console.log(`Topic encontrado: ${topicId}`);

  // 3. Inserir Conteúdos
  console.log("\n--- Inserindo Conteúdos ---");
  for (const c of contents) {
    const wordCount = c.textContent.split(/\s+/).filter(Boolean).length;
    const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

    await db.execute(sql`
      INSERT INTO "Content" (
        id, title, "textContent", "subjectId", "topicId",
        "mnemonic", "keyPoint", "practicalExample",
        difficulty, "wordCount", "estimatedReadTime", "isActive", "createdAt", "updatedAt"
      ) VALUES (
        ${c.id}, ${c.title}, ${c.textContent}, ${subjectId}, ${topicId},
        ${c.mnemonic}, ${c.keyPoint}, ${c.practicalExample},
        ${c.difficulty}, ${wordCount}, ${estimatedReadTime}, true, NOW(), NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `);
    console.log(`  OK: ${c.id} — ${c.title} (${wordCount} palavras, ~${estimatedReadTime} min)`);
  }

  // 4. Inserir Questões
  console.log("\n--- Inserindo Questões ---");
  for (const q of questions) {
    const contentRows = await db.execute(sql`
      SELECT id FROM "Content" WHERE id = ${q.contentId} LIMIT 1
    `) as any[];

    if (!contentRows[0]) {
      console.warn(`  SKIP: contentId ${q.contentId} não encontrado para questão ${q.id}`);
      continue;
    }
    const resolvedContentId = contentRows[0].id;
    const alternativesJson = JSON.stringify(q.alternatives);

    await db.execute(sql`
      INSERT INTO "Question" (
        "id", "statement", "alternatives", "correctAnswer", "correctOption",
        "explanation", "explanationCorrect", "explanationWrong",
        "subjectId", "topicId", "contentId",
        "isActive", "difficulty", "timesUsed", "questionType",
        "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternativesJson}::jsonb, ${q.correctAnswer}, ${q.correctOption},
        ${q.explanation}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${subjectId}, ${topicId}, ${resolvedContentId},
        true, ${q.difficulty}, 0, ${q.questionType}, NOW(), NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `);
    console.log(`  OK: ${q.id} [${q.questionType}] — ${q.statement.substring(0, 60)}...`);
  }

  console.log("\n=== R29 concluído: 6 átomos + 12 questões de Lógica Proposicional ===");
  process.exit(0);
}

main().catch((err) => {
  console.error("ERRO no seed R29:", err);
  process.exit(1);
});
