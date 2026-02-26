/**
 * Seed: Língua Portuguesa — Crase
 *
 * Popula 6 átomos de Conteúdo + 12 Questões vinculadas ao assunto Crase.
 * Idempotente: verifica existência antes de inserir.
 *
 * Execução:
 *   npx tsx db/seed-portugues-crase.ts
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
  title: string;
  textContent: string;
  mnemonic: string;
  keyPoint: string;
  practicalExample: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
}

const contents: ContentAtom[] = [
  {
    title: "Crase: Regra Geral",
    textContent: `A crase é a fusão da preposição "a" com o artigo definido feminino "a" (ou "as"), resultando no acento grave (à/às). Ocorre principalmente antes de palavras femininas que admitem artigo definido.

Para verificar se há crase, substitua a palavra feminina por uma masculina equivalente. Se a substituição exigir "ao", haverá crase no original.

Exemplo: "Fui à escola" → "Fui ao colégio" (usa "ao" → há crase).
Contraexemplo: "Fui a pé" → "Fui a cavalo" (não usa "ao" → não há crase).`,
    mnemonic: "SUBSTITUA — troque a palavra por um masculino: se usar 'ao', usa-se 'à'.",
    keyPoint: "Crase = preposição 'a' + artigo 'a'. Teste: substitua por masculino — 'ao' confirma crase.",
    practicalExample: "Concurseiro foi à delegacia (ao departamento ✓) prestar depoimento. Não foi a pé (a cavalo ✗ artigo não surge → sem crase).",
    difficulty: "FACIL",
  },
  {
    title: "Crase: Casos Obrigatórios (SLAH)",
    textContent: `Use SLAH para lembrar quando a crase é OBRIGATÓRIA:

S — Substantivos femininos determinados: "Vou à reunião", "Refiro-me às normas".
L — Locuções adverbiais, prepositivas e conjuntivas femininas: "às vezes", "à medida que", "à noite", "à força", "à base de".
A — "À moda de" / "À maneira de" (mesmo subentendido): "bife à milanesa", "vestido à Chanel".
H — Horas determinadas: "às 8h", "às 14h30".

Atenção: A crase nas horas só ocorre quando a hora é determinada (não com "a partir de", "antes de", "depois de" — nesses casos há preposição + artigo, mas a regra geral se aplica igualmente).`,
    mnemonic: "SLAH: Substantivos femininos, Locuções adverbiais/prepositivas, À moda de, Horas determinadas.",
    keyPoint: "Com locuções femininas e horas determinadas a crase é sempre obrigatória — não há exceção.",
    practicalExample: "O inspetor chegou à delegacia às 8h, agiu à força e prendeu o suspeito à noite. (4 crases obrigatórias pelo SLAH.)",
    difficulty: "FACIL",
  },
  {
    title: "Crase: Casos Proibidos (MVPQI)",
    textContent: `Nunca use crase nestas situações — lembre com MVPQI:

M — Masculinos: "Voltei a tempo", "Fui a pé", "Saiu a galope".
V — Verbos: "A correr, a cantar, a lutar" (infinitivos, não pedem artigo).
P — Pronomes pessoais, de tratamento e demonstrativos (este/esse/aquele, etc.): "Dirigi-me a ela", "Entreguei a Vossa Senhoria", "Refiro-me a este processo".
Q — Quando a preposição "a" está antes de outra preposição ("a partir de", "a fim de"): não há crase entre duas preposições.
I — Indefinidos (um/uma, algum, nenhum, qualquer, certo…): "Encaminhei a certa autoridade".`,
    mnemonic: "MVPQI: Masculinos, Verbos, Pronomes, preposição+Q(uando outra prep.), Indefinidos — NUNCA há crase.",
    keyPoint: "Pronomes pessoais e demonstrativos NUNCA levam crase — mesmo que a frase pareça exigir.",
    practicalExample: "O agente entregou o relatório a ele (pronome P), a partir de (Q) quinta-feira, a certo (I) superior.",
    difficulty: "MEDIO",
  },
  {
    title: "Crase: Casos Facultativos (PPN)",
    textContent: `Em três situações a crase é FACULTATIVA (pode ou não usar):

P — Pronome possessivo feminino singular: "Refiro-me à/a sua proposta." (ambas formas aceitas).
P — Palavra "casa" quando não especificada: "Fui a/à casa" (sem especificação = facultativo; "à casa de Maria" = obrigatório).
N — Nomes próprios femininos de pessoas: "Dirigi-me à/a Ana." (facultativo; mas "à Ana Silva" fica mais formal).

Dica de prova: quando a questão exige uso CORRETO e há facultatividade, ambas as formas devem ser aceitas como corretas. Fique atento ao enunciado.`,
    mnemonic: "PPN: Pronome Possessivo, Palavra 'casa' não especificada, Nomes próprios femininos — FACULTATIVO.",
    keyPoint: "Facultativo não significa errado em nenhuma das duas formas. Bancas não cobram erro nessa situação.",
    practicalExample: "A detetive foi a/à casa (sem especificação) conversar com a/à Ana (nome próprio) sobre a/à sua (possessivo) teoria.",
    difficulty: "MEDIO",
  },
  {
    title: "Crase com Nomes de Cidades",
    textContent: `Nomes de cidades são femininos, mas a crase só ocorre se a cidade admitir artigo definido na fala cotidiana.

REGRA PRÁTICA:
1. Se a cidade é normalmente precedida de artigo definido ("a/as"), há crase: "Fui à Bahia", "Cheguei ao Rio de Janeiro" (masculino → "ao").
2. Se a cidade não admite artigo, NÃO há crase: "Fui a Brasília", "Viajei a Curitiba", "Cheguei a São Paulo" (exceção: "São Paulo" não usa artigo em contexto formal).
3. Quando há adjunto adnominal (especificação), o artigo aparece e, portanto, há crase: "Retornei à Brasília de outrora."

Cidades tipicamente COM artigo: Bahia, Paraíba, Amazônia, Guanabara, Lisboa, Madeira.
Cidades tipicamente SEM artigo: Brasília, Curitiba, São Paulo, Fortaleza, Manaus, Recife, Salvador.`,
    mnemonic: "Cidade com artigo no dia-a-dia → crase. Cidade sem artigo → sem crase. Adjunto adnominal → crase sempre.",
    keyPoint: "A regra-chave: substitua por 'fui ao [masculino equivalente]' — mas para cidades, o teste é se a cidade usa artigo naturalmente na fala.",
    practicalExample: "O delegado foi à Bahia (usa artigo) investigar o caso, depois foi a Brasília (sem artigo) depor no STF.",
    difficulty: "MEDIO",
  },
  {
    title: "Crase em Locuções Prepositivas Femininas",
    textContent: `Locuções prepositivas femininas exigem SEMPRE crase. São expressões formadas por substantivo feminino + preposição "de":

Principais locuções com crase obrigatória:
- à beira de (à beira da estrada)
- à custa de (à custa do esforço)
- à frente de (à frente da operação)
- à margem de (à margem da lei)
- à mercê de (à mercê do acaso)
- à procura de (à procura do suspeito)
- à semelhança de (à semelhança do anterior)
- à sombra de (à sombra da dúvida)
- às custas de (às custas do erário)
- às margens de (às margens do rio)

ATENÇÃO: "em frente a" (sem crase) vs "à frente de" (com crase) — construções distintas.
"O posto fica em frente à escola" = preposição "em" + "a" + artigo "a" = crase obrigatória (antes de substantivo feminino).`,
    mnemonic: "Toda locução prepositiva com núcleo feminino pede crase: à beira, à custa, à frente, à margem, à procura.",
    keyPoint: "'Em frente a' sem crase se seguido de pronome; 'em frente à' com crase antes de substantivo feminino.",
    practicalExample: "O agente estava à frente da investigação, à procura de pistas, atuando à margem do sigilo imposto.",
    difficulty: "DIFICIL",
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
  alternatives: Alternative[];
  correctAnswer: string;   // letra: "A", "B", "C", "D", "E"
  correctOption: number;   // índice 0-based
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  contentTitle: string;    // para vincular ao Content criado
}

const questions: QuestionData[] = [
  // ── Q1 — Regra Geral (Municipal / FACIL) ──────────────────────────────
  {
    id: "qz_crase_001",
    statement: "Assinale a alternativa que apresenta emprego CORRETO da crase:",
    alternatives: [
      { letter: "A", text: "O guarda entregou o laudo a ela ontem." },
      { letter: "B", text: "O guarda entregou o laudo à delegada responsável." },
      { letter: "C", text: "O guarda foi a pé à reunião." },
      { letter: "D", text: "Fui a Brasília e à Bahia no mesmo mês." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A) Errado — pronome pessoal 'ela' nunca leva crase. B) Correto — substantivo feminino 'delegada' com artigo. C) 'a pé' não leva crase (masculino); 'à reunião' está correto isolado, mas C apresenta dupla crase inconsistente na frase. D) 'a Brasília' correto (sem artigo), 'à Bahia' correto (com artigo) — D seria a segunda opção correta, mas a questão pede a primeira opção com emprego 100% correto em todo o enunciado.",
    explanationCorrect: "Parabéns! Substantivos femininos determinados exigem crase. 'Delegada' é feminino e pede artigo definido 'a', formando 'à'.",
    explanationWrong: "Lembre-se: crase ocorre apenas antes de palavras femininas que admitem artigo. Pronomes pessoais ('ela', 'ele') nunca levam crase.",
    difficulty: "FACIL",
    contentTitle: "Crase: Regra Geral",
  },
  {
    id: "qz_crase_002",
    statement: "Para verificar se há crase em uma frase, o teste mais eficiente consiste em:",
    alternatives: [
      { letter: "A", text: "Verificar se a palavra seguinte termina com a letra 'a'." },
      { letter: "B", text: "Substituir a palavra feminina por um equivalente masculino e verificar se aparece 'ao'." },
      { letter: "C", text: "Checar se há um verbo de movimento na oração." },
      { letter: "D", text: "Confirmar se a palavra seguinte é um nome próprio." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O teste da substituição masculina é o método gramatical canônico: se a substituição exigir 'ao', a forma feminina exige 'à'. Exemplos: 'fui à escola' → 'fui ao colégio' (ao ✓). 'Fui a pé' → 'fui a cavalo' (não usa 'ao' → sem crase).",
    explanationCorrect: "Exato! O teste do masculino é o recurso mais confiável e sempre cobrado em concursos.",
    explanationWrong: "O critério não é a terminação da palavra nem o tipo de verbo, mas sim o comportamento da palavra equivalente no masculino.",
    difficulty: "FACIL",
    contentTitle: "Crase: Regra Geral",
  },
  // ── Q3 — Casos Obrigatórios (Municipal / FACIL) ────────────────────────
  {
    id: "qz_crase_003",
    statement: "Em qual das situações abaixo a crase é OBRIGATÓRIA?",
    alternatives: [
      { letter: "A", text: "Refiro-me a você." },
      { letter: "B", text: "Cheguei a tempo." },
      { letter: "C", text: "O plantão termina às 22h." },
      { letter: "D", text: "Ele foi a pé até lá." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Horas determinadas exigem crase obrigatoriamente (mnemônico SLAH — H de Horas). A) pronome pessoal → proibida. B) 'tempo' é masculino → proibida. D) 'pé' é masculino → proibida.",
    explanationCorrect: "Correto! Horas determinadas sempre pedem crase: às 22h, às 8h, às 14h30.",
    explanationWrong: "Nas horas determinadas a crase é obrigatória. Lembre do SLAH: S-ubstantivos femininos, L-ocuções, A-moda de, H-oras.",
    difficulty: "FACIL",
    contentTitle: "Crase: Casos Obrigatórios (SLAH)",
  },
  {
    id: "qz_crase_004",
    statement: "A frase 'O inspetor agiu ____ força para conter o suspeito' está corretamente completada com:",
    alternatives: [
      { letter: "A", text: "a" },
      { letter: "B", text: "à" },
      { letter: "C", text: "Às" },
      { letter: "D", text: "há" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "'À força' é locução adverbial feminina — mnemônico SLAH (L de Locuções). Sempre exige crase. 'À força' significa 'com o uso de força física'. 'Há' é verbo e seria semanticamente errado.",
    explanationCorrect: "Perfeito! 'À força' é locução adverbial feminina e exige crase obrigatoriamente pelo SLAH.",
    explanationWrong: "'À força' é uma locução adverbial feminina. O L do mnemônico SLAH cobre Locuções adverbiais femininas — todas levam crase.",
    difficulty: "FACIL",
    contentTitle: "Crase: Casos Obrigatórios (SLAH)",
  },
  // ── Q5 — Casos Proibidos (Estadual / MEDIO) ────────────────────────────
  {
    id: "qz_crase_005",
    statement: "Marque a alternativa em que a crase está INCORRETAMENTE empregada:",
    alternatives: [
      { letter: "A", text: "A delegada referiu-se à investigação com cautela." },
      { letter: "B", text: "O perito chegou à cena do crime às 3h." },
      { letter: "C", text: "Encaminhei o ofício à Vossa Excelência." },
      { letter: "D", text: "O suspeito foi conduzido à delegacia central." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Pronomes de tratamento (Vossa Excelência, Vossa Senhoria, Você etc.) NUNCA levam crase — mnemônico MVPQI (P de Pronomes). O correto é 'a Vossa Excelência'. As demais alternativas estão corretas.",
    explanationCorrect: "Ótimo! Pronomes de tratamento integram o P do MVPQI — nunca recebem crase.",
    explanationWrong: "Pronomes de tratamento (Vossa Excelência, Vossa Senhoria) nunca levam crase. Lembre do MVPQI: P de Pronomes.",
    difficulty: "MEDIO",
    contentTitle: "Crase: Casos Proibidos (MVPQI)",
  },
  {
    id: "qz_crase_006",
    statement: "Em qual das frases abaixo o uso da crase é PROIBIDO?",
    alternatives: [
      { letter: "A", text: "O ladrão correu à rua principal." },
      { letter: "B", text: "O agente saiu à noite para fazer a ronda." },
      { letter: "C", text: "A ocorrência foi encaminhada à certa autoridade competente." },
      { letter: "D", text: "Chegou à delegacia às 7h." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Pronomes/determinantes indefinidos ('certo', 'algum', 'nenhum', 'qualquer') proíbem a crase — MVPQI (I de Indefinidos). O correto é 'a certa autoridade'. As demais estão corretas.",
    explanationCorrect: "Certíssimo! Indefinidos como 'certo', 'algum' e 'qualquer' impedem a crase — I do MVPQI.",
    explanationWrong: "O I no MVPQI representa Indefinidos: antes de 'certo', 'algum', 'nenhum', 'qualquer' etc. a crase é sempre proibida.",
    difficulty: "MEDIO",
    contentTitle: "Crase: Casos Proibidos (MVPQI)",
  },
  // ── Q7 — Casos Facultativos (Estadual / MEDIO) ─────────────────────────
  {
    id: "qz_crase_007",
    statement: "Sobre os casos facultativos de crase, é CORRETO afirmar que:",
    alternatives: [
      { letter: "A", text: "A crase é obrigatória antes de pronomes possessivos femininos como 'sua', 'minha', 'nossa'." },
      { letter: "B", text: "Antes de nomes próprios femininos de pessoas, a crase é facultativa e ambas as formas são aceitas." },
      { letter: "C", text: "A palavra 'casa', em qualquer contexto, sempre permite crase facultativa." },
      { letter: "D", text: "A crase facultativa indica que a forma com acento grave é sempre preferível." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "B) Correto — mnemônico PPN (N de Nomes próprios femininos). A) Errado — é facultativa, não obrigatória. C) Errado — 'casa' com especificação tem crase obrigatória ('à casa de Maria'); apenas sem especificação é facultativa. D) Errado — facultativo significa que ambas as formas são igualmente corretas.",
    explanationCorrect: "Exato! O N do PPN cobre Nomes próprios femininos de pessoas — a crase é facultativa e ambas as grafias são corretas.",
    explanationWrong: "PPN: Pronome Possessivo, Palavra 'casa' sem especificação, Nomes próprios femininos. Em todos esses casos, a crase é FACULTATIVA — não obrigatória nem proibida.",
    difficulty: "MEDIO",
    contentTitle: "Crase: Casos Facultativos (PPN)",
  },
  {
    id: "qz_crase_008",
    statement: "A frase 'A investigadora foi ___ casa de madrugada' admite:",
    alternatives: [
      { letter: "A", text: "Apenas 'a', pois palavras masculinas não levam crase." },
      { letter: "B", text: "Apenas 'à', pois 'casa' é feminina e exige artigo." },
      { letter: "C", text: "Tanto 'a' quanto 'à', pois 'casa' sem especificação torna a crase facultativa." },
      { letter: "D", text: "Nenhuma das formas, pois a oração está incorreta." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Sem especificação ('casa' no sentido genérico, não 'a casa de alguém'), a crase é facultativa — segundo o mnemônico PPN (segunda letra P de Palavra 'casa'). Se houvesse especificação ('à casa da delegada'), a crase seria obrigatória.",
    explanationCorrect: "Ótimo! 'Casa' sem especificação é um dos três casos facultativos do PPN — ambas as formas são aceitas pela norma culta.",
    explanationWrong: "'Casa' sem determinação é caso facultativo. 'Casa' com especificação (à casa de alguém) exige crase obrigatória.",
    difficulty: "MEDIO",
    contentTitle: "Crase: Casos Facultativos (PPN)",
  },
  // ── Q9 — Cidades (Federal / CERTO/ERRADO CEBRASPE) ─────────────────────
  {
    id: "qz_crase_009",
    statement: "Julgue o item a seguir.\n\nA frase 'O policial federal foi à Brasília prestar depoimento no STF' está gramaticalmente correta, uma vez que Brasília é nome feminino e, portanto, exige crase.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "ERRADO. Brasília é nome de cidade que, por tradição gramatical e uso corrente, não admite artigo definido. Portanto, não há crase: 'foi a Brasília'. A crase só ocorreria se houvesse adjunto adnominal — ex.: 'à Brasília de outrora'. O fato de ser feminino não basta; é preciso que o nome admita artigo definido.",
    explanationCorrect: "Gabarito: ERRADO. Ótimo raciocínio! Brasília não admite artigo no uso padrão → não há crase.",
    explanationWrong: "Atenção: o gênero feminino da cidade não é suficiente para exigir crase. A crase depende do artigo — e Brasília não usa artigo definido no padrão culto.",
    difficulty: "MEDIO",
    contentTitle: "Crase com Nomes de Cidades",
  },
  {
    id: "qz_crase_010",
    statement: "Assinale a alternativa em que o emprego da crase com nomes de cidades está CORRETO em todas as frases:",
    alternatives: [
      { letter: "A", text: "Fui à Bahia nas férias; depois fui a Fortaleza." },
      { letter: "B", text: "Fui à Curitiba nas férias; depois fui a Salvador." },
      { letter: "C", text: "Fui a Bahia nas férias; depois fui à Fortaleza." },
      { letter: "D", text: "Fui à Curitiba nas férias; depois fui à Salvador." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "A) Correto — Bahia admite artigo ('a Bahia') → crase obrigatória. Fortaleza não admite artigo → sem crase. B) Errado — Curitiba não usa artigo → sem crase. C) Errado — Bahia exige crase. D) Errado — Curitiba e Salvador não usam artigo no padrão culto.",
    explanationCorrect: "Perfeito! Bahia é uma das cidades que naturalmente usam artigo definido; Fortaleza, Curitiba e Salvador não.",
    explanationWrong: "A regra é: cidade que usa artigo definido no cotidiano ('a Bahia', 'a Paraíba') exige crase; cidades sem artigo ('Brasília', 'Curitiba', 'Salvador', 'Fortaleza') não levam crase.",
    difficulty: "MEDIO",
    contentTitle: "Crase com Nomes de Cidades",
  },
  // ── Q11–Q12 — Locuções Prepositivas (Federal / DIFICIL) ─────────────────
  {
    id: "qz_crase_011",
    statement: "A crase está INCORRETAMENTE empregada em qual das seguintes alternativas?",
    alternatives: [
      { letter: "A", text: "O perito atuou à beira do colapso durante a perícia." },
      { letter: "B", text: "O agente trabalhava à custa de muito esforço." },
      { letter: "C", text: "O posto de controle fica em frente à delegacia." },
      { letter: "D", text: "O suspeito agiu em frente à ele." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "D) Errado — pronome pessoal 'ele' nunca leva crase (MVPQI — P de Pronomes). O correto seria 'em frente a ele'. As demais alternativas estão corretas: A) 'à beira de' (locução prepositiva feminina); B) 'à custa de' (locução prepositiva feminina); C) 'em frente à delegacia' (preposição 'em' + 'a' + artigo antes de substantivo feminino).",
    explanationCorrect: "Excelente! Pronomes pessoais nunca recebem crase — mesmo quando antecedidos de locução como 'em frente a'.",
    explanationWrong: "Toda locução prepositiva com núcleo feminino exige crase, MAS pronomes pessoais ('ele', 'ela', 'eles') NUNCA aceitam crase, independentemente da locução anterior.",
    difficulty: "DIFICIL",
    contentTitle: "Crase em Locuções Prepositivas Femininas",
  },
  {
    id: "qz_crase_012",
    statement: "Analise as afirmações sobre crase em locuções e marque a CORRETA:",
    alternatives: [
      { letter: "A", text: "'Em frente a' e 'à frente de' têm o mesmo significado e exigem sempre crase." },
      { letter: "B", text: "'Às margens do rio' e 'à margem da lei' são construções corretas, mas a crase é facultativa em ambos os casos." },
      { letter: "C", text: "Locuções prepositivas com núcleo feminino ('à beira de', 'à custa de', 'à frente de') exigem crase obrigatoriamente." },
      { letter: "D", text: "'À semelhança de' e 'a semelhança de' são igualmente corretas por serem casos facultativos." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "C) Correto — locuções prepositivas com núcleo substantivo feminino exigem crase obrigatoriamente. A) Errado — 'em frente a' e 'à frente de' têm sentidos distintos e comportamentos diferentes quanto à crase. B) Errado — a crase em locuções femininas é obrigatória, não facultativa. D) Errado — 'à semelhança de' é obrigatório, não facultativo.",
    explanationCorrect: "Perfeito! Locuções prepositivas femininas (à beira, à custa, à frente, à margem, à procura) exigem crase — não há exceção.",
    explanationWrong: "A crase nas locuções prepositivas femininas é OBRIGATÓRIA — não é facultativa. Só é facultativa nos três casos do PPN (possessivo, 'casa' sem especificação, nomes próprios femininos).",
    difficulty: "DIFICIL",
    contentTitle: "Crase em Locuções Prepositivas Femininas",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n🇧🇷 Seed: Língua Portuguesa — Crase\n");

  // ── 1. Encontrar Subject ────────────────────────────────────────────────
  // Nome armazenado no banco: "PORTUGUES" (código interno)
  const subjectId = await findSubject("PORTUGUES");
  if (!subjectId) {
    console.error("❌ Subject 'PORTUGUES' não encontrado no banco.");
    process.exit(1);
  }
  console.log(`✅ Subject encontrado: ${subjectId}`);

  // ── 2. Garantir existência de correctOption na tabela Question ──────────
  try {
    await db.execute(sql`
      ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "correctOption" INTEGER
    `);
    console.log("✅ Coluna 'correctOption' garantida em Question.");
  } catch (e: any) {
    console.warn(`⚠️  correctOption: ${e?.message?.split("\n")[0]}`);
  }

  // ── 3. Garantir colunas Phase 5 em Content ─────────────────────────────
  for (const [col, def] of [
    ["mnemonic", "TEXT"],
    ["keyPoint", "TEXT"],
    ["practicalExample", "TEXT"],
  ] as const) {
    try {
      await db.execute(sql.raw(`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS "${col}" ${def}`));
    } catch (e: any) {
      console.warn(`⚠️  Content.${col}: ${e?.message?.split("\n")[0]}`);
    }
  }

  // ── 4. Garantir colunas Phase 5 em Question ────────────────────────────
  for (const [col, def] of [
    ["explanationCorrect", "TEXT"],
    ["explanationWrong", "TEXT"],
  ] as const) {
    try {
      await db.execute(sql.raw(`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "${col}" ${def}`));
    } catch (e: any) {
      console.warn(`⚠️  Question.${col}: ${e?.message?.split("\n")[0]}`);
    }
  }
  console.log("✅ Colunas Phase 5 garantidas.");

  // ── 5. Encontrar ou criar Topic "Crase" ────────────────────────────────
  const topicId = await findOrCreateTopic("Crase", subjectId);
  console.log(`✅ Topic: ${topicId}`);

  // ── 6. Inserir Conteúdos ────────────────────────────────────────────────
  const contentIdMap: Record<string, string> = {};
  let contentCreated = 0, contentSkipped = 0;

  for (const c of contents) {
    const exists = await contentExists(c.title, subjectId);
    if (exists) {
      // Buscar ID existente para vincular questões
      const rows = await db.execute(sql`
        SELECT id FROM "Content" WHERE title = ${c.title} AND "subjectId" = ${subjectId} LIMIT 1
      `) as any[];
      contentIdMap[c.title] = rows[0].id;
      console.log(`  ⏭  Conteúdo já existe: ${c.title}`);
      contentSkipped++;
      continue;
    }

    const id = nanoId("ct");
    const wordCount = c.textContent.split(/\s+/).length;
    await db.execute(sql`
      INSERT INTO "Content" (
        "id", "title", "textContent", "subjectId", "topicId",
        "isActive", "difficulty",
        "wordCount", "estimatedReadTime",
        "mnemonic", "keyPoint", "practicalExample",
        "createdAt", "updatedAt"
      ) VALUES (
        ${id}, ${c.title}, ${c.textContent}, ${subjectId}, ${topicId},
        true, ${c.difficulty},
        ${wordCount}, ${Math.ceil(wordCount / 200)},
        ${c.mnemonic}, ${c.keyPoint}, ${c.practicalExample},
        NOW(), NOW()
      )
    `);
    contentIdMap[c.title] = id;
    console.log(`  ✅ Conteúdo criado: ${c.title} (${id})`);
    contentCreated++;
  }

  // ── 7. Inserir Questões ─────────────────────────────────────────────────
  let questionCreated = 0, questionSkipped = 0;

  for (const q of questions) {
    const exists = await questionExists(q.id);
    if (exists) {
      console.log(`  ⏭  Questão já existe: ${q.id}`);
      questionSkipped++;
      continue;
    }

    const contentId = contentIdMap[q.contentTitle];
    if (!contentId) {
      console.warn(`  ⚠️  Conteúdo não encontrado para questão ${q.id}: '${q.contentTitle}'`);
      continue;
    }

    const alternativesJson = JSON.stringify(q.alternatives);

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
        0, 'MULTIPLA_ESCOLHA',
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Questão criada: ${q.id}`);
    questionCreated++;
  }

  // ── Backfill contentId (fallback: primeiro conteúdo do tópico) ───────────
  const firstContentRows = await db.execute(sql`
    SELECT id FROM "Content" WHERE "topicId" = ${topicId} ORDER BY "createdAt" LIMIT 1
  `) as any[];
  if (firstContentRows[0]?.id) {
    const fallbackContentId = firstContentRows[0].id;
    const result = await db.execute(sql`
      UPDATE "Question" SET "contentId" = ${fallbackContentId}
      WHERE "topicId" = ${topicId} AND "contentId" IS NULL
    `) as any;
    const updated = result.rowCount ?? result.count ?? 0;
    if (updated > 0) console.log(`  🔧 Backfill contentId: ${updated} questões → primeiro conteúdo do tópico`);
  }

  // ── Relatório ────────────────────────────────────────────────────────────
  console.log("\n─────────────────────────────────────────");
  console.log(`📚 Conteúdos: ${contentCreated} criados, ${contentSkipped} já existiam`);
  console.log(`❓ Questões:  ${questionCreated} criadas,  ${questionSkipped} já existiam`);
  console.log("─────────────────────────────────────────\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed falhou:", err);
  process.exit(1);
});
