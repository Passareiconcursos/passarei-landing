/**
 * Seed: Língua Portuguesa — R22 — Morfologia II: Pronomes e Colocação Pronominal
 *
 * Diretriz pedagógica: pronomes são o maior gerador de erros em provas policiais
 * (PF, PRF, PC). Cada átomo expande o conceito para pegadinhas recorrentes de banca:
 * oblíquos após preposição, pronomes de tratamento + concordância verbal, uso de
 * "cujo" sem artigo, "onde" restrito a lugar, "todo" vs "todo o", e as três
 * colocações pronominais (próclise/mesóclise/ênclise).
 *
 * 6 Átomos de Conteúdo:
 *   1. Pronomes Pessoais: Reto, Oblíquo e Funções Sintáticas
 *   2. Pronomes de Tratamento: Hierarquia e Concordância Verbal
 *   3. Pronomes Possessivos e Demonstrativos: Usos e Armadilhas
 *   4. Pronomes Relativos: "cujo", "onde" e Pegadinhas de Banca
 *   5. Pronomes Indefinidos e Interrogativos: Variáveis vs Invariáveis
 *   6. Colocação Pronominal: Próclise, Mesóclise e Ênclise
 *
 * 12 Questões — TODAS CERTO_ERRADO
 * Subject: Língua Portuguesa (busca por "Portugu")
 * Topic: Morfologia (reutiliza o tópico criado no R21)
 *
 * Execução:
 *   npx tsx db/seed-port-morfologia2-r22.ts
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
  if (rows[0]?.id) {
    console.log(`  ⏭  Tópico já existe: ${name}`);
    return rows[0].id;
  }
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

async function getContentId(title: string, subjectId: string): Promise<string | null> {
  const rows = await db.execute(sql`
    SELECT id FROM "Content" WHERE title = ${title} AND "subjectId" = ${subjectId} LIMIT 1
  `) as any[];
  return rows[0]?.id ?? null;
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
  // ── 1. Pronomes Pessoais ──────────────────────────────────────────
  {
    title: "Pronomes Pessoais: Reto, Oblíquo e Funções Sintáticas em Provas",
    textContent: `Os PRONOMES PESSOAIS substituem o substantivo que designa as pessoas do discurso. Dividem-se em caso reto e oblíquo — a distinção entre eles é um dos pontos mais cobrados em provas policiais.

PRONOMES DO CASO RETO — exercem função de SUJEITO:
1ª pessoa sing.: eu | 1ª pessoa pl.: nós
2ª pessoa sing.: tu | 2ª pessoa pl.: vós
3ª pessoa sing.: ele/ela | 3ª pessoa pl.: eles/elas

PRONOMES DO CASO OBLÍQUO — exercem função de COMPLEMENTO (objeto direto, indireto ou adjunto):
ÁTONOS (sem preposição — ligados ao verbo):
  me, te, se, nos, vos | o/a/os/as (OD) | lhe/lhes (OI)
TÔNICOS (com preposição obrigatória):
  mim, ti, si, conosco, convosco | ele/ela/eles/elas (após outras preposições)

REGRA FUNDAMENTAL — Após PREPOSIÇÃO, usa-se SEMPRE pronome oblíquo tônico:
  ERRADO: "Entre eu e tu não há segredos."
  CERTO: "Entre mim e ti não há segredos."
  ERRADO: "Isso é para eu fazer."
  CERTO (há verbo no infinitivo): "Isso é para eu fazer." ← EXCEÇÃO: quando o pronome é sujeito do infinitivo, usa-se reto (para eu fazer = eu vou fazer isso)

EXCEÇÃO IMPORTANTE — "Para + infinitivo": o pronome que é SUJEITO do infinitivo fica no caso reto:
  "Esse trabalho é difícil para eu fazer." (eu = sujeito de fazer → reto)
  "Esse trabalho foi feito por mim." (mim = objeto → oblíquo, não sujeito)

PEGADINHAS DE PROVA:
- "A culpa é minha" (minha = pronome possessivo) ≠ "A culpa é de mim" (mim = oblíquo tônico) — ambas corretas, mas "minha" é mais usual.
- "Ele e eu fomos" (eu = sujeito → reto ✓) vs "entre ele e mim" (mim = após preposição → tônico ✓).
- "lhe" = objeto indireto de 3ª pessoa. "o/a" = objeto direto de 3ª pessoa. Não confundir: "Eu o vi" (OD) vs "Eu lhe falei" (OI).`,
    mnemonic: "RETO = SUJEITO (eu, tu, ele, nós, vós, eles). OBLÍQUO = COMPLEMENTO. Após PREPOSIÇÃO → oblíquo TÔNICO (mim, ti, si, ele, ela). EXCEÇÃO: sujeito do infinitivo = reto ('para eu fazer'). 'o/a' = OD; 'lhe/lhes' = OI. 'entre mim e ti' (não 'eu e tu' após preposição).",
    keyPoint: "Pronome reto = sujeito (eu, tu, ele). Oblíquo átono = complemento sem preposição (me, te, se, o, a, lhe). Oblíquo tônico = após preposição (mim, ti, si, ele). Exceção: sujeito do infinitivo usa reto ('para eu ir'). Pegadinha clássica: 'entre mim e ti' (não 'entre eu e tu'). 'lhe' = OI (falou-lhe); 'o/a' = OD (viu-o).",
    practicalExample: "Questão de prova: 'O supervisor enviou o relatório para mim e para ele.' Análise: 'para mim' = oblíquo tônico (após preposição 'para' ✓); 'para ele' = oblíquo tônico (após preposição 'para' ✓). ERRADO seria 'para eu e para tu'. Outra questão: 'Isso é fácil para eu resolver' — CERTO, pois 'eu' é sujeito do infinitivo 'resolver', não objeto da preposição.",
    difficulty: "FACIL",
  },

  // ── 2. Pronomes de Tratamento ─────────────────────────────────────
  {
    title: "Pronomes de Tratamento: Hierarquia, Concordância e Uso Oficial",
    textContent: `Os PRONOMES DE TRATAMENTO são formas usadas para se dirigir a pessoas com respeito hierárquico ou deferência. São sistematicamente cobrados em provas de cargos policiais, pois integram a norma de redação oficial (Manual de Redação da Presidência da República).

PRINCIPAIS PRONOMES DE TRATAMENTO E SEUS DESTINATÁRIOS:
- Vossa Excelência (V. Ex.ª): presidentes (República, Senado, Câmara, STF), ministros de Estado, governadores, embaixadores, senadores, deputados (federais e estaduais), magistrados (juízes, desembargadores, ministros dos tribunais), oficiais generais (general, almirante, brigadeiro).
- Vossa Senhoria (V. S.ª): demais autoridades e tratamento formal padrão (delegados, diretores, coronéis, tenentes-coronéis, servidores públicos em geral).
- Vossa Magnificência (V. Mag.ª): reitores de universidades.
- Vossa Santidade (V. S.): papa.
- Vossa Eminência (V. Em.ª): cardeais.
- Vossa Reverendíssima (V. Rev.ma): sacerdotes e religiosos em geral.

CONCORDÂNCIA VERBAL — REGRA FUNDAMENTAL:
Embora "Vossa Excelência" se refira ao interlocutor (quem está sendo tratado = 2ª pessoa), o VERBO concordará sempre na 3ª PESSOA DO SINGULAR:
  ERRADO: "Vossa Excelência assinastes o documento."
  CERTO: "Vossa Excelência assinou o documento."
  ERRADO: "Vossa Senhoria deveis comparecer."
  CERTO: "Vossa Senhoria deve comparecer."

VOSSA × SUA — DISTINÇÃO ESSENCIAL:
- VOSSA: use quando fala DIRETAMENTE com a pessoa (2ª pessoa real): "Vossa Excelência está presente?"
- SUA: use quando fala SOBRE a pessoa na 3ª pessoa (ausente): "Sua Excelência o presidente assinou."

ABREVIAÇÕES OFICIAIS:
V. Ex.ª / V. Exas. (plural) | V. S.ª / V. S.as (plural) | V. Mag.ª`,
    mnemonic: "VEx.ª = presidentes, ministros, governadores, senadores, deputados, magistrados, generais. VS.ª = demais autoridades formais (delegados, diretores). VERBO sempre na 3ª PESSOA: 'Vossa Excelência assinou' (não 'assinardes' nem 'assinastes'). VOSSA = fala COM. SUA = fala SOBRE.",
    keyPoint: "Vossa Excelência: presidente, ministros, governadores, senadores, deputados, magistrados, generais. Vossa Senhoria: demais. Concordância: verbo sempre na 3ª pessoa ('Vossa Excelência deve' — não 'deveis'). Vossa = fala com a pessoa presente; Sua = fala sobre a pessoa ausente (3ª pessoa). Vossa Magnificência = reitores.",
    practicalExample: "Redação oficial (PF/PRF): 'Vossa Excelência, senhor Ministro da Justiça, deverá assinar o ofício até sexta-feira.' Análise: 'deverá' = 3ª pessoa singular (CORRETO). Se estivesse escrito 'devereis' (2ª pessoa plural) = ERRADO. Outra situação: 'O delegado informou que Sua Excelência o Ministro estava ausente' → 'Sua Excelência' (fala SOBRE, 3ª pessoa) = CORRETO. Armadilha de prova: 'Vossa Senhoria' para senadores = ERRADO (o correto é 'Vossa Excelência').",
    difficulty: "MEDIO",
  },

  // ── 3. Pronomes Possessivos e Demonstrativos ──────────────────────
  {
    title: "Pronomes Possessivos e Demonstrativos: Usos e Armadilhas de Prova",
    textContent: `Os PRONOMES POSSESSIVOS e DEMONSTRATIVOS são classes que expressam posse e localização/referência no discurso. Bancas exploram as ambiguidades de "seu/sua" e o uso textual de "este/esse/aquele".

PRONOMES POSSESSIVOS — indicam posse ou pertencimento:
1ª pessoa sing.: meu, minha, meus, minhas
2ª pessoa sing.: teu, tua, teus, tuas (referente a tu)
3ª pessoa sing.: seu, sua, seus, suas (referente a ele/ela/você)
1ª pessoa pl.: nosso, nossa, nossos, nossas
2ª pessoa pl.: vosso, vossa, vossos, vossas
3ª pessoa pl.: seu, sua, seus, suas (referente a eles/elas)

AMBIGUIDADE DE "SEU/SUA": como "seu" pode ser possessivo de 2ª pessoa (você) e de 3ª pessoa (ele/ela/eles), pode gerar ambiguidade:
"O delegado pediu ao agente que trouxesse seu relatório." (de quem? do delegado ou do agente?)
Para eliminar: "trouxesse o relatório dele" (3ª pessoa explícita) ou "trouxesse o seu relatório" (reforço com contexto).

PRONOMES DEMONSTRATIVOS — localizam no espaço, no tempo ou no texto:
ESTE/ESTA/ISTO (1ª pessoa): próximo do falante no espaço; no texto = o que está por vir (catáfora)
ESSE/ESSA/ISSO (2ª pessoa): próximo do ouvinte; no texto = o que foi dito (anáfora)
AQUELE/AQUELA/AQUILO (distante de ambos): lugar afastado; no texto = o que foi dito mais remotamente, ou o primeiro de dois elementos citados

USO TEXTUAL (cobrado em PF/PRF):
"Dois suspeitos foram detidos: Pedro e João. Este [= João, último citado] negou o crime; aquele [= Pedro, primeiro citado] confessou."
"O delegado disse o seguinte: isto deve ser investigado." (isto = catáfora, anuncia o que vem)
"O agente entregou o laudo; esse documento foi decisivo." (esse = anáfora, retoma "laudo")

ATENÇÃO: "este" não é mais formal nem mais correto que "esse" — a distinção é de referência textual/espacial, não de formalidade.`,
    mnemonic: "POSSESSIVO: meu/teu/seu/nosso/vosso (singular) + variações. 'SEU' = ambíguo (2ª ou 3ª pessoa). DEMONSTRATIVO: ESTE (próximo falante / catáfora = anuncia), ESSE (próximo ouvinte / anáfora = retoma), AQUELE (distante / o 1º dos dois citados). Texto: 'Pedro e João; este [João] ... aquele [Pedro]'. ISTO/ISSO/AQUILO = neutros (invariáveis).",
    keyPoint: "Possessivos: 'seu/sua' = ambíguo (você/ele/ela). Para clareza, use 'dele/dela'. Demonstrativos no texto: 'este' = catáfora (o que vem); 'esse' = anáfora (o que veio). Dois elementos: 'este' = último citado; 'aquele' = primeiro citado. Isto/isso/aquilo = invariáveis (neutros). Cuidado: 'este' não é mais formal que 'esse'.",
    practicalExample: "Questão de prova: 'Foram identificados dois criminosos: o mandante e o executor. Aquele havia planejado o crime há meses; este o executou na madrugada.' Análise: 'aquele' retoma 'o mandante' (primeiro citado); 'este' retoma 'o executor' (último citado) — uso correto dos demonstrativos em texto. Armadilha: inverter a ordem ('este' para o primeiro / 'aquele' para o último) é INCORRETO pela gramática normativa.",
    difficulty: "FACIL",
  },

  // ── 4. Pronomes Relativos ─────────────────────────────────────────
  {
    title: "Pronomes Relativos: 'cujo', 'onde' e as Pegadinhas de Banca",
    textContent: `Os PRONOMES RELATIVOS retomam um termo anterior (antecedente) e introduzem uma oração subordinada adjetiva. "Cujo" e "onde" são os mais cobrados em provas policiais por suas restrições de uso.

PRONOMES RELATIVOS E SEUS USOS:
- QUE: o mais usado; substitui pessoa ou coisa. "O agente que investigou o caso foi promovido."
- QUEM: apenas para pessoas; sempre acompanhado de preposição quando funciona como OI. "O suspeito de quem falei foi preso." / "A testemunha com quem conversei depôs."
- O QUAL / A QUAL / OS QUAIS / AS QUAIS: evita ambiguidade quando o antecedente está longe. "Ele entregou o laudo ao delegado, o qual foi apresentado no júri." (o qual = o laudo, não o delegado — evita confusão)
- CUJO / CUJA / CUJOS / CUJAS: pronome relativo POSSESSIVO — substitui "do qual, da qual, de quem". Indica posse do antecedente.

REGRAS DO "CUJO" — ponto mais cobrado em prova:
1. Não admite ARTIGO após "cujo/cuja": ERRADO: "O agente cuja a investigação..." / CERTO: "O agente cuja investigação..."
2. Não admite PREPOSIÇÃO antes ("do cujo" = erro crasso): ERRADO: "O crime do cujo autor..." / CERTO: "O crime cujo autor..."
3. Concorda em gênero e número com o SUBSTANTIVO que o segue (não com o antecedente): "A lei cujos artigos foram suspensos" (cujos = masc. pl. porque 'artigos' é masc. pl.)
4. Não se usa "cujo" sem antecedente claro.

REGRAS DO "ONDE":
- Usa-se "onde" apenas para LUGAR REAL, físico ou geográfico: "A delegacia onde o crime foi registrado."
- INCORRETO para contextos não-espaciais: "A situação onde tudo começou" → use "em que": "A situação em que tudo começou."
- INCORRETO: "O momento onde o suspeito foi flagrado" → CERTO: "O momento em que o suspeito foi flagrado."
- "Aonde" = movimento para (com verbos de direção): "A cidade aonde o fugitivo se dirigiu."`,
    mnemonic: "CUJO: sem artigo depois ('cuja investigação', não 'cuja a'), sem 'do' antes ('cujo autor', não 'do cujo'), concorda com o que VEM DEPOIS. ONDE: só para lugar físico/geográfico. Não-lugar: use 'em que'. AONDE = direção (para onde). QUEM: só para pessoas, com preposição no OI. O QUAL: desambigua antecedente distante.",
    keyPoint: "Cujo: possessivo, sem artigo depois, sem preposição antes, concorda com o substantivo seguinte. Onde: lugar físico ('a cidade onde'). Em que: contexto não-espacial ('a situação em que'). Aonde: direção ('a cidade aonde foi'). Quem: só pessoas, com preposição. O qual: desambiguação de antecedente distante.",
    practicalExample: "Questão de prova: 'O policial cuja arma foi apreendida prestou depoimento.' Análise: 'cuja' = relativo possessivo, sem artigo depois ('cuja arma' ✓, não 'cuja a arma'), concorda com 'arma' (fem. sing.) ✓. ERRADO seria 'cujo arma' (incorreta concordância) ou 'cuja a arma' (artigo proibido). Outra questão: 'O contexto onde o crime ocorreu' = ERRADO (contexto não é lugar físico); CERTO: 'O contexto em que o crime ocorreu'.",
    difficulty: "MEDIO",
  },

  // ── 5. Pronomes Indefinidos e Interrogativos ──────────────────────
  {
    title: "Pronomes Indefinidos e Interrogativos: Variáveis vs Invariáveis",
    textContent: `Os PRONOMES INDEFINIDOS referem-se à 3ª pessoa de modo vago, indeterminado. Os INTERROGATIVOS introduzem perguntas diretas ou indiretas. Ambos são cobrados em provas por sua confusão com advérbios e pela distinção "todo / todo o".

PRONOMES INDEFINIDOS — referem-se vagamente à 3ª pessoa:
VARIÁVEIS (flexionam): algum/alguma/alguns/algumas, nenhum/nenhuma, todo/toda/todos/todas, muito/muita/muitos/muitas, pouco/pouca/poucos/poucas, certo/certa/certos/certas, vário/vária/vários/várias, bastante/bastantes, outro/outra/outros/outras, quanto/quanta/quantos/quantas.
INVARIÁVEIS (não flexionam): alguém, ninguém, algo, nada, tudo, outrem, cada, qualquer (pl. quaisquer — exceção), jamais (atenção: é advérbio).

PEGADINHA "TODO" × "TODO O":
- TODO (sem artigo) = QUALQUER, CADA UM: "Todo policial deve cumprir a lei." (= qualquer policial)
- TODO O (com artigo) = INTEIRO, COMPLETO: "Todo o efetivo foi mobilizado." (= o efetivo inteiro)
Prova clássica: "Toda a cidade foi evacuada" (a cidade inteira) ≠ "Toda cidade foi evacuada" (cada cidade, qualquer cidade).

PRONOMES INTERROGATIVOS — introduzem perguntas:
- QUEM? (pessoas): "Quem assinou o documento?"
- QUE? / O QUÊ? (coisas/fatos): "Que aconteceu?" / "O que foi encontrado?"
- QUAL? / QUAIS? (escolha entre opções): "Qual é o suspeito?"
- QUANTO/A/OS/AS? (quantidade): "Quantos suspeitos foram presos?"

DISTINÇÃO PRONOME INDEFINIDO × ADVÉRBIO:
- "Muito" acompanha ou substitui substantivo → pronome/adjetivo indefinido (VARIÁVEL): "Muitos agentes chegaram."
- "Muito" modifica verbo, adjetivo ou advérbio → advérbio (INVARIÁVEL): "Chegaram muito tarde."`,
    mnemonic: "INDEFINIDOS INVARIÁVEIS: alguém, ninguém, algo, nada, tudo, outrem, cada. VARIÁVEIS: algum/nenhum/todo/muito/pouco/vário/bastante (+ flexão). TODO (sem artigo) = qualquer. TODO O (com artigo) = inteiro. INTERROGATIVOS: quem (pessoa), que/qual (coisa/escolha), quanto (quantidade). 'qualquer' → pl. quaisquer (exceção invariável).",
    keyPoint: "Todo (sem artigo) = qualquer/cada um. Todo o (com artigo) = inteiro/completo. Indefinidos invariáveis: alguém, ninguém, algo, nada, tudo, outrem, cada. Variáveis: algum/alguma, nenhum/nenhuma, todo/toda, muito/muita, bastante/bastantes. Interrogativos: quem (pessoas), qual/quais (escolha), quanto (quantidade). 'qualquer' → pl. 'quaisquer'.",
    practicalExample: "Questão de prova: 'Todo o efetivo da Polícia Federal foi convocado para a operação.' Análise: 'Todo o' (com artigo definido) = o efetivo INTEIRO/COMPLETO foi convocado. Se fosse 'Todo efetivo da Polícia Federal é treinado' (sem artigo) = QUALQUER efetivo, cada efetivo. Outra questão: 'Ninguém foi preso no raid' — 'ninguém' é pronome indefinido INVARIÁVEL (não existe 'ninguéns'). 'Alguns suspeitos fugiram' — 'alguns' é pronome indefinido VARIÁVEL (algum/alguma/alguns/algumas).",
    difficulty: "MEDIO",
  },

  // ── 6. Colocação Pronominal ───────────────────────────────────────
  {
    title: "Colocação Pronominal: Próclise, Mesóclise e Ênclise em Provas Policiais",
    textContent: `A COLOCAÇÃO PRONOMINAL determina a posição do pronome oblíquo átono em relação ao verbo: antes (próclise), no meio (mesóclise) ou depois (ênclise). É um dos tópicos mais cobrados em Língua Portuguesa nas provas de PF, PRF e PC.

PRÓCLISE — pronome ANTES do verbo (obrigatória nas situações abaixo):
Palavras e construções que ATRAEM o pronome para antes do verbo:
1. Palavras negativas: não, nunca, jamais, nada, ninguém. "Não me diga isso."
2. Conjunções subordinativas: que, se, porque, embora, quando, como, conforme... "Espero que se resolva logo."
3. Pronomes relativos: "O agente que o prendeu foi elogiado."
4. Pronomes interrogativos: "Quem lhe disse isso?"
5. Pronomes indefinidos: "Alguém me avisou sobre o crime."
6. Advérbios (sem vírgula separando): "Sempre me disseram a verdade." (mas "Ontem, disseram-me a verdade" — com vírgula, ênclise)

MESÓCLISE — pronome NO MEIO do verbo (futuro do presente e futuro do pretérito, SEM palavra atrativa):
- Futuro do presente: "Dar-me-ão o resultado amanhã." / "Apresentar-se-á o suspeito."
- Futuro do pretérito: "Dir-me-ia a verdade." / "Falar-lhe-ia se soubesse."
- Se houver palavra atrativa, usa-se PRÓCLISE: "Não me darão o resultado." (não a mesóclise)

ÊNCLISE — pronome DEPOIS do verbo (quando não há palavra atrativa):
- Verbo no início de período: "Disseram-me que o réu confessou."
- Verbo no imperativo afirmativo: "Diga-me a verdade!" / "Apresente-se imediatamente!"
- Verbo no infinitivo impessoal: "Para falar-lhe, precisava de autorização."
- Verbo no gerúndio: "O agente saiu, levando-o consigo."
- Após vírgula/pausa com advérbio: "Ontem, disseram-me a notícia."

PROIBIÇÕES ABSOLUTAS (norma culta escrita):
1. NUNCA inicie período com pronome oblíquo átono: ERRADO: "Me disseram que o réu confessou." CERTO: "Disseram-me que o réu confessou."
2. NUNCA use mesóclise com palavra atrativa: ERRADO: "Não dar-me-ão o resultado." CERTO: "Não me darão o resultado."`,
    mnemonic: "PRÓCLISE (antes): NACI = Negativa, Advérbio (sem vírgula), Conjunção subordinativa, Interrogativo/Indefinido/Relativo. MESÓCLISE (meio): Futuro (presente ou pretérito) SEM palavra atrativa (dar-me-á, falar-lhe-ia). ÊNCLISE (depois): início de período, imperativo afirmativo, gerúndio, infinitivo. PROIBIDO: iniciar frase com pronome oblíquo átono.",
    keyPoint: "Próclise obrigatória: palavras negativas, conjunções subordinativas, pronomes relativos/interrogativos/indefinidos, advérbios sem pausa. Mesóclise: futuro do presente/pretérito sem palavra atrativa (dar-me-á). Ênclise: início de período, imperativo afirmativo, gerúndio, após vírgula. Proibição absoluta: iniciar frase com pronome oblíquo átono (errado: 'Me disseram'; certo: 'Disseram-me').",
    practicalExample: "Questão de prova (Cebraspe): 'O delegado nunca se recusou a ouvir as testemunhas.' Análise: 'nunca' = palavra negativa → próclise obrigatória: 'nunca SE recusou' (pronome antes do verbo ✓). ERRADO seria 'nunca recusou-se'. Outra questão: 'Comunicar-se-á o resultado amanhã.' Análise: futuro do presente ('comunicará') + sem palavra atrativa → mesóclise ✓. Se houvesse negação: 'Não se comunicará o resultado' (próclise, não mesóclise).",
    difficulty: "DIFICIL",
  },
];

// ============================================
// QUESTÕES (12) — TODAS CERTO_ERRADO
// ============================================

interface Alternative {
  letter: string;
  text: string;
}

interface QuestionData {
  id: string;
  statement: string;
  alternatives: Alternative[];
  correctAnswer: "A" | "B";
  correctOption: 0 | 1;
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  questionType: "CERTO_ERRADO";
  contentTitle: string;
}

const CE: Alternative[] = [
  { letter: "A", text: "CERTO" },
  { letter: "B", text: "ERRADO" },
];

const questions: QuestionData[] = [
  // ══════════════════════════════════════════════════════════════════
  // Átomo 1 — Pronomes Pessoais (Q1-Q2)
  // ══════════════════════════════════════════════════════════════════

  // Q1 — 'entre mim e ti': oblíquo após preposição (FACIL, ERRADO)
  {
    id: "qz_port_pron_001",
    statement:
      "Julgue o item conforme a norma culta da língua portuguesa.\n\n" +
      "Na frase 'Entre eu e tu não há segredos sobre o caso', os pronomes pessoais estão " +
      "corretamente empregados, pois 'eu' e 'tu' são pronomes do caso reto adequados para " +
      "qualquer posição na oração, inclusive após preposições.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. Após preposição, usa-se obrigatoriamente o pronome oblíquo TÔNICO, nunca o caso " +
      "reto. A preposição 'entre' exige os oblíquos 'mim' e 'ti': 'Entre mim e ti não há segredos.' " +
      "O caso reto (eu, tu) é reservado para a função de SUJEITO. Após preposições (entre, para, " +
      "por, com, de, a, sem, sobre...) → oblíquos tônicos: mim, ti, si, ele/ela, nós, vós, eles/elas. " +
      "EXCEÇÃO: quando o pronome é sujeito de infinitivo ('para eu fazer'), usa-se o reto.",
    explanationCorrect:
      "O item está ERRADO. Após preposição 'entre' → oblíquo tônico: 'entre mim e ti' (não 'eu e tu'). " +
      "Caso reto (eu, tu) = apenas sujeito. Oblíquo tônico (mim, ti) = após preposição. Exceção: " +
      "sujeito de infinitivo usa reto ('para eu ir', 'para tu fazeres').",
    explanationWrong:
      "O item está ERRADO. Após preposição, usa-se pronome oblíquo TÔNICO: 'entre mim e ti'. " +
      "Caso reto (eu, tu) = função de sujeito. Oblíquo tônico (mim, ti) = posição pós-preposição. " +
      "Correto: 'Entre mim e ti não há segredos.' Regra: preposição → exige forma oblíqua tônica.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Pronomes Pessoais: Reto, Oblíquo e Funções Sintáticas em Provas",
  },

  // Q2 — 'entregou-lhe o relatório': 'lhe' = OI (FACIL, CERTO)
  {
    id: "qz_port_pron_002",
    statement:
      "Julgue o item conforme a norma culta da língua portuguesa.\n\n" +
      "Na frase 'O supervisor entregou-lhe o relatório', o pronome oblíquo átono 'lhe' " +
      "desempenha a função de objeto indireto do verbo 'entregar', referindo-se à pessoa " +
      "a quem o relatório foi entregue (3ª pessoa).",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. 'Lhe' é pronome oblíquo átono de 3ª pessoa que exerce a função de OBJETO INDIRETO " +
      "(complemento verbal que exige preposição 'a'): 'entregou o relatório A ELE/ELA' → 'entregou-" +
      "lhe o relatório'. O pronome 'lhe/lhes' é sempre objeto INDIRETO (complemento com 'a'). " +
      "Já os pronomes 'o/a/os/as' são objetos DIRETOS (sem preposição). Distinção: 'Eu o vi' " +
      "(OD — vi ele) vs 'Eu lhe falei' (OI — falei a ele). Essa distinção é cobrada com frequência " +
      "nas provas da PF e PRF.",
    explanationCorrect:
      "Correto! 'Lhe' = pronome oblíquo átono de 3ª pessoa, função de OI ('entregou a ele/ela'). " +
      "'Lhe/lhes' = sempre OI. 'O/a/os/as' = OD. Distinção clássica: 'vi-o' (OD) vs 'disse-lhe' (OI). " +
      "Ênclise correta: 'entregou-lhe' (sem palavra atrativa, início de oração após sujeito).",
    explanationWrong:
      "O item está CERTO. 'Lhe' = pronome de 3ª pessoa, função de OI ('entregou a ele'). 'Lhe/lhes' " +
      "são sempre OI. Comparação: 'entregou-o' (OD — o relatório como direto seria diferente). " +
      "Distinção fundamental: 'o/a' = OD; 'lhe' = OI.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Pronomes Pessoais: Reto, Oblíquo e Funções Sintáticas em Provas",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 2 — Pronomes de Tratamento (Q3-Q4)
  // ══════════════════════════════════════════════════════════════════

  // Q3 — 'Vossa Excelência assinou': verbo na 3ª pessoa (MEDIO, CERTO)
  {
    id: "qz_port_pron_003",
    statement:
      "Julgue o item conforme a norma culta e a redação oficial brasileira.\n\n" +
      "Na construção 'Vossa Excelência assinou o ofício encaminhado ao Ministério', o verbo " +
      "'assinou' está corretamente conjugado, pois os pronomes de tratamento, embora se " +
      "refiram ao interlocutor (2ª pessoa), exigem verbo na 3ª pessoa do singular.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Os pronomes de tratamento (Vossa Excelência, Vossa Senhoria, Vossa Magnificência " +
      "etc.) são uma particularidade gramatical: referem-se ao INTERLOCUTOR (semanticamente 2ª " +
      "pessoa), mas o verbo concorda na 3ª PESSOA DO SINGULAR. Portanto: 'Vossa Excelência " +
      "assinou' (3ª pessoa ✓), nunca 'assinastes' (2ª pl.) nem 'assinaste' (2ª sing.). Regra " +
      "mnemônica: o núcleo do pronome de tratamento é um substantivo ('Vossa' + substantivo 'Excelência') " +
      "→ concorda como substantivo de 3ª pessoa.",
    explanationCorrect:
      "Correto! Pronomes de tratamento → verbo SEMPRE na 3ª pessoa: 'Vossa Excelência assinou/deve/irá'. " +
      "Nunca: 'assinastes/deveis'. O núcleo é substantivo ('Excelência') → concordância na 3ª pessoa. " +
      "Regra válida para V. Ex.ª, V. S.ª, V. Mag.ª etc.",
    explanationWrong:
      "O item está CERTO. Pronomes de tratamento exigem verbo na 3ª PESSOA. 'Vossa Excelência " +
      "assinou' = correto. 'Assinastes' (2ª plural) ou 'assinas' (2ª singular) = incorretos. " +
      "Apesar de se referir ao interlocutor, o verbo segue a 3ª pessoa por convenção gramatical.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Pronomes de Tratamento: Hierarquia, Concordância e Uso Oficial",
  },

  // Q4 — 'Vossa Excelência' para delegado = errado; correto é 'Vossa Senhoria' (MEDIO, ERRADO)
  {
    id: "qz_port_pron_004",
    statement:
      "Julgue o item conforme o Manual de Redação da Presidência da República e a norma culta.\n\n" +
      "O pronome de tratamento adequado para se dirigir a um delegado de polícia federal " +
      "em correspondência oficial é 'Vossa Excelência', da mesma forma que se utiliza para " +
      "senadores, ministros de Estado e magistrados.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O tratamento correto para um delegado de polícia (mesmo de nível federal) é " +
      "'VOSSA SENHORIA' (V. S.ª), não 'Vossa Excelência'. 'Vossa Excelência' é reservado para: " +
      "presidentes (da República, do Senado, da Câmara, do STF), ministros de Estado, " +
      "governadores de estado, embaixadores, senadores, deputados (federais e estaduais), " +
      "magistrados (juízes, desembargadores, ministros de tribunais superiores) e oficiais " +
      "generais (general, almirante, brigadeiro). Delegados, diretores e demais autoridades " +
      "formais que não integram esse rol → 'Vossa Senhoria'.",
    explanationCorrect:
      "O item está ERRADO. Delegado = 'Vossa Senhoria' (V. S.ª), não 'Vossa Excelência'. " +
      "V. Ex.ª: presidentes, ministros, governadores, senadores, deputados, magistrados, generais. " +
      "V. S.ª: demais autoridades formais (delegados, diretores, coronéis, tenentes-coronéis).",
    explanationWrong:
      "O item está ERRADO. Para delegados → 'Vossa Senhoria'. 'Vossa Excelência' é para: " +
      "presidentes, ministros, governadores, senadores, deputados, magistrados e oficiais generais. " +
      "Delegado não integra esse rol — usa-se 'Vossa Senhoria' em correspondências oficiais.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Pronomes de Tratamento: Hierarquia, Concordância e Uso Oficial",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 3 — Possessivos e Demonstrativos (Q5-Q6)
  // ══════════════════════════════════════════════════════════════════

  // Q5 — 'este' = último citado; 'aquele' = primeiro citado (FACIL, CERTO)
  {
    id: "qz_port_pron_005",
    statement:
      "Julgue o item conforme a gramática normativa da língua portuguesa.\n\n" +
      "No trecho 'Foram indiciados o mandante e o executor do crime. Aquele planejou o " +
      "delito; este o executou na madrugada', os pronomes demonstrativos estão corretamente " +
      "empregados: 'aquele' retoma o primeiro elemento citado (o mandante) e 'este' retoma " +
      "o último citado (o executor).",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Quando dois elementos são citados em sequência, a gramática normativa determina: " +
      "'ESTE' retoma o ÚLTIMO citado (mais próximo textualmente); 'AQUELE' retoma o PRIMEIRO " +
      "citado (mais distante). Na frase: 'o mandante' (1º) e 'o executor' (2º). Portanto: " +
      "'aquele' = mandante (1º) ✓ e 'este' = executor (2º/último) ✓. Inversão seria erro: " +
      "usar 'este' para o primeiro e 'aquele' para o segundo quebraria a regra dos demonstrativos " +
      "em referência textual retrospectiva. Ponto muito cobrado pela banca Cebraspe em PF.",
    explanationCorrect:
      "Correto! Na referência textual a dois elementos: 'este' = ÚLTIMO citado; 'aquele' = PRIMEIRO " +
      "citado. 'O mandante [1º] e o executor [2º]: aquele [mandante] planejou; este [executor] executou.' " +
      "Regra mnemônica: ESTE = mais prÓXIMO (último); AQUELE = mais DISTANTE (primeiro).",
    explanationWrong:
      "O item está CERTO. 'Este' = retoma o último elemento citado (executor). 'Aquele' = retoma o " +
      "primeiro elemento citado (mandante). Regra dos demonstrativos em anáfora textual dupla: " +
      "este (último) / aquele (primeiro). Uso correto e cobrado pela Cebraspe em provas de PF.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Pronomes Possessivos e Demonstrativos: Usos e Armadilhas de Prova",
  },

  // Q6 — 'seu' é ambíguo (FACIL, ERRADO)
  {
    id: "qz_port_pron_006",
    statement:
      "Julgue o item conforme a gramática normativa da língua portuguesa.\n\n" +
      "O pronome possessivo 'seu/sua' é exclusivamente de 3ª pessoa (referindo-se a 'ele', " +
      "'ela', 'eles' ou 'elas'), sendo incorreto e inaceitável pela norma culta utilizá-lo " +
      "como possessivo de 2ª pessoa em substituição a 'teu/tua'.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O pronome 'seu/sua' é AMBÍGUO: pode ser possessivo de 2ª pessoa (= teu/tua, " +
      "referindo-se a 'você') OU de 3ª pessoa (= dele/dela/deles/delas). Pela norma culta, " +
      "ambos os usos são corretos: 'Você trouxe seu documento?' (seu = teu, 2ª pessoa). " +
      "A ambiguidade ocorre em construções como 'O delegado pediu ao agente que trouxesse seu " +
      "relatório' — não fica claro se é o relatório do delegado ou do agente. Nesses casos, " +
      "recomenda-se substituir por 'dele/dela' para maior clareza. O uso de 'seu' como 2ª " +
      "pessoa (você) é perfeitamente aceito pela norma culta.",
    explanationCorrect:
      "O item está ERRADO. 'Seu/sua' pode ser de 2ª pessoa (você → seu documento) OU de 3ª " +
      "pessoa (dele/dela). Ambos os usos são corretos pela norma culta. A ambiguidade é o problema, " +
      "não o uso em si. Para clareza, usa-se 'dele/dela' quando houver risco de ambiguidade.",
    explanationWrong:
      "O item está ERRADO. 'Seu/sua' é AMBÍGUO — pode ser 2ª pessoa (você) ou 3ª pessoa (ele/ela). " +
      "O uso como 2ª pessoa ('seu documento' = o documento de você) é aceito pela norma culta. " +
      "Para evitar ambiguidade, prefere-se 'dele/dela'. Não é exclusivamente de 3ª pessoa.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Pronomes Possessivos e Demonstrativos: Usos e Armadilhas de Prova",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 4 — Pronomes Relativos (Q7-Q8)
  // ══════════════════════════════════════════════════════════════════

  // Q7 — 'cuja a investigação' = errado (artigo após cujo) (MEDIO, ERRADO)
  {
    id: "qz_port_pron_007",
    statement:
      "Julgue o item conforme a norma culta da língua portuguesa.\n\n" +
      "Na frase 'O agente cuja a conduta foi elogiada pelo corregedor receberá uma comenda', " +
      "o pronome relativo 'cuja' está corretamente empregado, concordando com o substantivo " +
      "feminino 'conduta' que o segue.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O pronome relativo 'cujo/cuja' NÃO admite artigo após si. A construção 'cuja A " +
      "conduta' (com artigo 'a') é um erro gramatical grave, frequentemente cobrado em provas. " +
      "O correto é: 'O agente CUJA conduta foi elogiada...' (sem artigo). Embora 'cuja' concorde " +
      "com 'conduta' (fem. sing.) — o que estaria certo —, a presença do artigo 'a' logo após " +
      "'cuja' invalida a construção. Regra: 'cujo/cuja' + SUBSTANTIVO DIRETAMENTE (sem artigo " +
      "intermediário). Analogia: 'cujo' já faz o papel do artigo possessivo.",
    explanationCorrect:
      "O item está ERRADO. 'Cujo/cuja' NÃO admite artigo depois: 'cuja conduta' (✓) e não " +
      "'cuja a conduta' (✗). O artigo após 'cujo' é erro clássico de prova. Correto: 'O agente " +
      "cuja conduta foi elogiada.' A concordância de gênero ('cuja' com 'conduta') estaria certa, " +
      "mas o artigo 'a' torna o item incorreto.",
    explanationWrong:
      "O item está ERRADO. 'Cuja a conduta' = incorreto — 'cujo/cuja' não aceita artigo depois. " +
      "Correto: 'cuja conduta' (sem artigo). Regras do 'cujo': (1) sem artigo depois; (2) sem " +
      "preposição antes ('do cujo' = errado); (3) concorda com o substantivo seguinte. " +
      "A forma 'cuja conduta' (concordância correta) deve ser usada sem o 'a'.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Pronomes Relativos: 'cujo', 'onde' e as Pegadinhas de Banca",
  },

  // Q8 — 'onde' restrito a lugar físico (MEDIO, CERTO)
  {
    id: "qz_port_pron_008",
    statement:
      "Julgue o item conforme a norma culta da língua portuguesa.\n\n" +
      "A construção 'A situação onde o crime foi planejado preocupa as autoridades' está " +
      "gramaticalmente incorreta, pois o pronome relativo 'onde' deve ser empregado " +
      "exclusivamente para referir-se a lugar físico ou geográfico — sendo 'em que' a forma " +
      "adequada quando o antecedente não é um lugar.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. O pronome relativo 'onde' deve ser usado somente com antecedentes que designam " +
      "LUGAR REAL, físico ou geográfico: 'A delegacia onde o boletim foi registrado' ✓. " +
      "'Situação' não é um lugar geográfico → o pronome correto é 'EM QUE': 'A situação em que " +
      "o crime foi planejado.' Outros exemplos de uso incorreto do 'onde': 'O momento onde tudo " +
      "mudou' (correto: 'em que'), 'A lei onde está previsto o crime' (correto: 'em que' ou 'na qual'). " +
      "'Aonde' = movimento para lugar ('a cidade aonde o fugitivo foi').",
    explanationCorrect:
      "Correto! 'Onde' = lugar físico/geográfico ('a cidade onde', 'a delegacia onde'). Não-lugar: " +
      "use 'em que' ('a situação em que', 'o momento em que', 'a lei em que'). A construção 'situação " +
      "onde' está incorreta pela norma culta — o antecedente deve ser um lugar.",
    explanationWrong:
      "O item está CERTO. 'Onde' se restringe a lugar físico. 'Situação' não é lugar → use 'em que'. " +
      "Correto: 'A situação em que o crime foi planejado.' Outros casos: 'o momento em que' (não 'onde'), " +
      "'a lei em que' (não 'onde'). 'Aonde' = direção para um lugar ('a cidade aonde foi').",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Pronomes Relativos: 'cujo', 'onde' e as Pegadinhas de Banca",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 5 — Indefinidos e Interrogativos (Q9-Q10)
  // ══════════════════════════════════════════════════════════════════

  // Q9 — 'todo o efetivo' = o efetivo inteiro (FACIL, CERTO)
  {
    id: "qz_port_pron_009",
    statement:
      "Julgue o item conforme a norma culta da língua portuguesa.\n\n" +
      "Na frase 'Todo o efetivo da Polícia Federal foi mobilizado para a operação', a " +
      "expressão 'todo o' (com artigo definido) indica que o efetivo inteiro/completo foi " +
      "mobilizado — sentido diferente de 'todo efetivo' (sem artigo), que significaria " +
      "'qualquer efetivo, cada efetivo'.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. A distinção 'todo × todo o' é clássica em provas policiais: TODO (sem artigo) = " +
      "QUALQUER, CADA UM (sentido universalizante/distributivo): 'Todo policial deve portar " +
      "identificação' = qualquer policial, cada policial. TODO O (com artigo definido) = INTEIRO, " +
      "COMPLETO (sentido totalizante): 'Todo o efetivo foi mobilizado' = o efetivo inteiro. " +
      "Outros exemplos: 'Toda a cidade foi evacuada' (a cidade inteira) vs 'Toda cidade deve " +
      "ter saneamento' (cada cidade, qualquer cidade).",
    explanationCorrect:
      "Correto! 'Todo o' (com artigo) = inteiro/completo. 'Todo' (sem artigo) = qualquer/cada um. " +
      "'Todo o efetivo' = o efetivo inteiro. 'Todo efetivo' = qualquer efetivo/cada efetivo. " +
      "Distinção exigida pelo Cebraspe em provas de PF e PRF.",
    explanationWrong:
      "O item está CERTO. 'Todo o' (com artigo definido) = inteiro/completo. 'Todo' (sem artigo) = " +
      "qualquer/cada um. 'Todo o efetivo foi mobilizado' = o efetivo por inteiro. 'Todo efetivo " +
      "deve ser treinado' = cada efetivo, qualquer efetivo. Distinção semântica importante.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Pronomes Indefinidos e Interrogativos: Variáveis vs Invariáveis",
  },

  // Q10 — 'ninguém' = invariável; não existe 'ninguéns' (MEDIO, CERTO)
  {
    id: "qz_port_pron_010",
    statement:
      "Julgue o item conforme a morfologia da língua portuguesa.\n\n" +
      "Os pronomes indefinidos 'alguém' e 'ninguém' são invariáveis — não flexionam em " +
      "gênero nem em número —, ao contrário de 'algum/alguma' e 'nenhum/nenhuma', que são " +
      "variáveis e devem concordar em gênero e número com o substantivo a que se referem.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. 'Alguém' e 'ninguém' são pronomes indefinidos INVARIÁVEIS: não existem as formas " +
      "'algués', 'ninguéns', 'alguma' (no sentido de alguém) etc. Já 'algum/alguma/alguns/algumas' " +
      "e 'nenhum/nenhuma/nenhuns/nenhumas' são pronomes indefinidos VARIÁVEIS: concordam com o " +
      "substantivo em gênero e número. Ex.: 'Alguma prova foi encontrada.' / 'Nenhum suspeito " +
      "foi preso.' / 'Alguns agentes chegaram tarde.' / 'Nenhumas pistas foram deixadas.' " +
      "(este último raro, mas gramaticalmente possível).",
    explanationCorrect:
      "Correto! 'Alguém' e 'ninguém' = invariáveis (não existe 'ninguéns'). 'Algum/alguma/alguns/" +
      "algumas' e 'nenhum/nenhuma' = variáveis (concordam com o substantivo). Diferença: " +
      "'alguém' substitui pessoa sem especificar; 'algum' acompanha/substitui com flexão.",
    explanationWrong:
      "O item está CERTO. 'Alguém' e 'ninguém' são invariáveis — sem flexão de gênero ou número. " +
      "'Algum/alguma/alguns/algumas' são variáveis. 'Nenhum/nenhuma' também variáveis (concordam " +
      "com o substantivo). Distinção fundamental: 'ninguém' (invariável) vs 'nenhum agente' " +
      "(variável, concorda com 'agente').",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Pronomes Indefinidos e Interrogativos: Variáveis vs Invariáveis",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 6 — Colocação Pronominal (Q11-Q12)
  // ══════════════════════════════════════════════════════════════════

  // Q11 — 'nunca me diga': próclise obrigatória (palavra negativa) (MEDIO, CERTO)
  {
    id: "qz_port_pron_011",
    statement:
      "Julgue o item conforme a norma culta da língua portuguesa.\n\n" +
      "Na frase 'Nunca me diga que o suspeito foi solto', o pronome 'me' está em próclise " +
      "corretamente posicionado antes do verbo 'diga', pois a palavra 'nunca' — advérbio de " +
      "negação — atrai obrigatoriamente o pronome oblíquo átono para antes do verbo.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. 'Nunca' é advérbio de negação — uma das palavras que ATRAEM obrigatoriamente o " +
      "pronome para a posição de PRÓCLISE (antes do verbo). Usando ênclise ('Nunca diga-me') " +
      "seria incorreto pela norma culta. As palavras que exigem próclise: negativas (não, nunca, " +
      "jamais, nada, ninguém), conjunções subordinativas (que, se, porque, embora, quando), " +
      "pronomes relativos, interrogativos e indefinidos, advérbios sem vírgula separando. " +
      "Mnemônico: NACI (Negativa, Advérbio, Conjunção, Interrogativo/Indefinido/Relativo) → próclise.",
    explanationCorrect:
      "Correto! 'Nunca' (negação) → próclise obrigatória: 'nunca me diga' ✓. Ênclise 'nunca diga-" +
      "me' = incorreta pela norma culta. Palavras atrativas: negativas (não/nunca/jamais), " +
      "conjunções subordinativas, relativos, interrogativos, indefinidos, advérbios sem pausa.",
    explanationWrong:
      "O item está CERTO. 'Nunca' = palavra negativa → atrai pronome → próclise obrigatória. " +
      "'Nunca me diga' ✓. Ênclise após negação = erro na norma culta escrita. Regra: NACI → " +
      "próclise. Negativa, Advérbio (sem pausa), Conjunção subordinativa, Interrogativo/Relativo/Indefinido.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Colocação Pronominal: Próclise, Mesóclise e Ênclise em Provas Policiais",
  },

  // Q12 — iniciar frase com pronome oblíquo átono = vetado na norma culta (DIFICIL, ERRADO)
  {
    id: "qz_port_pron_012",
    statement:
      "Julgue o item conforme a norma culta escrita da língua portuguesa, adotada em provas " +
      "de concurso público.\n\n" +
      "A construção 'Me disseram que o réu confessou o crime' está em conformidade com a " +
      "norma culta escrita, pois o pronome oblíquo átono 'me' pode iniciar um período ou " +
      "uma oração quando há contexto suficiente para identificar o referente.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. Pela norma culta ESCRITA — a que é exigida em provas de concurso público —, " +
      "é PROIBIDO iniciar um período (frase) com pronome oblíquo átono (me, te, se, o, a, lhe, " +
      "nos, vos, os, as, lhes). A construção 'Me disseram' no início absoluto de período é vetada. " +
      "As formas corretas são: (1) ÊNCLISE: 'Disseram-me que o réu confessou.' (2) PRÓCLISE " +
      "com palavra atrativa: 'Não me disseram nada.' (3) Explicitação do sujeito: 'Eles me " +
      "disseram que o réu confessou.' Na linguagem coloquial, iniciar com 'me' é comum e " +
      "aceitável, mas em provas de concurso, a norma culta escrita é a referência.",
    explanationCorrect:
      "O item está ERRADO. PROIBIDO na norma culta: iniciar período com pronome oblíquo átono. " +
      "'Me disseram' no início de frase = incorreto. Correto: 'Disseram-me...' (ênclise) ou " +
      "'Eles me disseram...' (próclise com sujeito explícito). Na fala coloquial é comum, mas em " +
      "prova de concurso vale a norma culta escrita.",
    explanationWrong:
      "O item está ERRADO. Norma culta escrita: NUNCA iniciar período com pronome oblíquo átono. " +
      "'Me disseram' = início de frase = incorreto. Correto: 'Disseram-me...' (ênclise, sem " +
      "palavra atrativa) ou 'Não me disseram...' (próclise com negação). Essa proibição é " +
      "ponto certo nas provas da PF, PRF e PC elaboradas pelo Cebraspe.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Colocação Pronominal: Próclise, Mesóclise e Ênclise em Provas Policiais",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n📝  Seed R22: Língua Portuguesa — Morfologia II (Pronomes)\n");

  // ── 1. Encontrar Subject ────────────────────────────────────────────────
  let subjectId = await findSubject("Portugu");
  if (!subjectId) subjectId = await findSubject("LINGUA_PORTUGUESA");
  if (!subjectId) subjectId = await findSubject("Língua");
  if (!subjectId) {
    console.error("❌ Subject para Língua Portuguesa não encontrado.");
    process.exit(1);
  }
  console.log(`✅ Subject encontrado: ${subjectId}`);

  // ── 2. Garantir colunas Phase 5 em Question ────────────────────────────
  for (const [col, def] of [
    ["correctOption", "INTEGER"],
    ["explanationCorrect", "TEXT"],
    ["explanationWrong", "TEXT"],
    ["contentId", "TEXT"],
  ] as const) {
    try {
      await db.execute(sql.raw(`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "${col}" ${def}`));
    } catch (e: any) {
      console.warn(`⚠️  Question.${col}: ${e?.message?.split("\n")[0]}`);
    }
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
  console.log("✅ Colunas Phase 5 garantidas.");

  // ── 4. Reutilizar tópico 'Morfologia' já criado pelo R21 ───────────────
  const topicId = await findOrCreateTopic("Morfologia", subjectId);
  console.log(`✅ Topic: ${topicId}`);

  // ── 5. Inserir Conteúdos ────────────────────────────────────────────────
  const contentIdMap: Record<string, string> = {};
  let contentCreated = 0, contentSkipped = 0;

  for (const c of contents) {
    if (await contentExists(c.title, subjectId)) {
      const existingId = await getContentId(c.title, subjectId);
      if (existingId) contentIdMap[c.title] = existingId;
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

  // ── 6. Inserir Questões ─────────────────────────────────────────────────
  let questionCreated = 0, questionSkipped = 0;

  for (const q of questions) {
    if (await questionExists(q.id)) {
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
        "subjectId", "topicId", "contentId",
        "isActive", "difficulty",
        "timesUsed", "questionType",
        "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternativesJson}::jsonb, ${q.correctAnswer}, ${q.correctOption},
        ${q.explanationCorrect}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${subjectId}, ${topicId}, ${contentId},
        true, ${q.difficulty},
        0, ${q.questionType},
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Questão criada: ${q.id} (${q.correctAnswer === "A" ? "CERTO" : "ERRADO"})`);
    questionCreated++;
  }

  // ── Backfill contentId ────────────────────────────────────────────────
  let backfillCount = 0;
  for (const q of questions) {
    const contentId = contentIdMap[q.contentTitle];
    if (!contentId) continue;
    const result = await db.execute(sql`
      UPDATE "Question" SET "contentId" = ${contentId}
      WHERE id = ${q.id} AND "contentId" IS NULL
    `) as any;
    if ((result.rowCount ?? result.count ?? 0) > 0) backfillCount++;
  }
  if (backfillCount > 0) console.log(`  🔧 Backfill contentId: ${backfillCount} questões atualizadas`);

  // ── Relatório ────────────────────────────────────────────────────────────
  console.log("\n─────────────────────────────────────────");
  console.log(`📚 Conteúdos: ${contentCreated} criados, ${contentSkipped} já existiam`);
  console.log(`❓ Questões:  ${questionCreated} criadas,  ${questionSkipped} já existiam`);
  console.log(`📝 Tipo:      TODAS CERTO_ERRADO (12/12)`);
  console.log("─────────────────────────────────────────\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed R22 falhou:", err);
  process.exit(1);
});
