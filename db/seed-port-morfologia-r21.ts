/**
 * Seed: Língua Portuguesa — R21 — Morfologia I: As 10 Classes de Palavras
 *
 * Diretriz pedagógica: cada átomo expande o conceito básico para o contexto
 * de provas policiais (PF, PRF, PC) — foco em identificação de classes em
 * frases, substituição de termos e pegadinhas recorrentes em banca.
 *
 * 6 Átomos de Conteúdo:
 *   1. Substantivo: Classificações e Flexões (Gênero, Número e Grau)
 *   2. Verbo: Estrutura, Flexões e Vozes Verbais (Ativa, Passiva, Reflexiva)
 *   3. Adjetivo e Artigo: Funções Caracterizadoras e Determinantes
 *   4. Advérbio: Circunstâncias e Invariabilidade
 *   5. Numeral e Interjeição: Usos e Valor Semântico
 *   6. Mapa das 10 Classes: Quadro Comparativo Variáveis vs Invariáveis
 *
 * 12 Questões — TODAS CERTO_ERRADO
 * Subject: Língua Portuguesa (busca por "Portugu")
 *
 * Execução:
 *   npx tsx db/seed-port-morfologia-r21.ts
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
  // ── 1. Substantivo ────────────────────────────────────────────────
  {
    title: "Substantivo: Classificações e Flexões em Provas Policiais",
    textContent: `O SUBSTANTIVO é a classe de palavras que nomeia seres, objetos, fenômenos, sentimentos, lugares e conceitos. É o NÚCLEO dos principais termos da oração — sujeito, objeto e complemento nominal giram em torno dele. Em provas policiais, a banca testa classificações e flexões.

CLASSIFICAÇÕES DO SUBSTANTIVO:
1. PRÓPRIO × COMUM: próprio nomeia seres específicos (Brasil, João, Polícia Federal — com maiúscula); comum designa seres de uma espécie (cidade, agente, lei).
2. CONCRETO × ABSTRATO: concreto tem existência própria, independente de outro ser (pedra, arma, policial); abstrato só existe como resultado de uma ação, estado ou qualidade (coragem, investigação, justiça).
3. PRIMITIVO × DERIVADO: primitivo não vem de outra palavra da língua (pedra, flor, lei); derivado se origina de outro vocábulo (pedreiro, florista, legislação).
4. SIMPLES × COMPOSTO: simples tem um único radical (tempo, guarda); composto tem dois ou mais radicais (guarda-chuva, passatempo).
5. COLETIVO: designa conjunto de seres da mesma espécie (alcateia = lobos; frota = veículos; cardume = peixes).

FLEXÕES DO SUBSTANTIVO:
- GÊNERO: masculino/feminino. Atenção ao epiceno (cobra, onça — um gênero p/ ambos os sexos), sobrecomum (a vítima, o cônjuge) e comum de dois gêneros (o/a estudante, o/a agente).
- NÚMERO: singular/plural. Atenção a plurais irregulares: mal→males, cão→cães, cidadão→cidadãos/cidadãos.
- GRAU: aumentativo (analítico: casa grande; sintético: casarão) e diminutivo (analítico: casa pequena; sintético: casinha).

PEGADINHA DE PROVA: "a vítima" e "o cônjuge" são substantivos sobrecomuns — o gênero gramatical é fixo independentemente do sexo biológico. "O/a estudante" é comum de dois gêneros — o artigo varia.`,
    mnemonic: "SUBSTANTIVO = NOME. Classifica: ProCo (Próprio/Comum) + ConcAbs (Concreto/Abstrato) + PriDer (Primitivo/Derivado) + SiCo (Simples/Composto) + Coletivo. Flexões: GêneroNúmeroGrau. Epiceno = um gênero para dois sexos (cobra). Sobrecomum = gênero fixo (a vítima, o cônjuge). Comum de dois = artigo varia (o/a agente).",
    keyPoint: "Substantivo: núcleo do sujeito e dos objetos. Sobrecomum (a vítima, o cônjuge): gênero fixo. Comum de dois gêneros (o/a agente, o/a estudante): artigo varia. Abstrato: sentimentos, ações, qualidades. Coletivo: alcateia (lobos), frota (veículos). Grau sintético: sufixo (casarão, casinha); analítico: adjetivo separado.",
    practicalExample: "Frase de prova: 'A vítima do latrocínio era um policial corajoso.' Análise: 'vítima' = substantivo sobrecomum (gênero feminino fixo, independentemente do sexo); 'policial' = substantivo comum de dois gêneros (o policial / a policial); 'corajoso' = adjetivo (não substantivo). Pegadinha: 'A polícia prendeu o suspeito' — 'polícia' é coletivo (conjunto de policiais), não plural de policial.",
    difficulty: "FACIL",
  },

  // ── 2. Verbo ──────────────────────────────────────────────────────
  {
    title: "Verbo: Estrutura, Flexões e as Vozes Verbais em Provas Policiais",
    textContent: `O VERBO é a classe de palavras que exprime ação, estado, fenômeno ou processo. É o núcleo do predicado e o elemento mais flexionado da língua portuguesa. Em provas policiais, as vozes verbais e a transitividade são os pontos mais cobrados.

ESTRUTURA DO VERBO:
- Radical: parte que carrega o significado (am- em "amar").
- Vogal temática: une radical às desinências (am-a-r: vogal temática "a" = 1ª conjugação).
- Desinências modo-temporais: indicam modo e tempo (am-ava: -va = imperfeito do indicativo).
- Desinências número-pessoais: indicam pessoa e número (am-a-mos: -mos = 1ª pessoa plural).

FLEXÕES DO VERBO:
- MODO: indicativo (certeza), subjuntivo (hipótese), imperativo (ordem/pedido).
- TEMPO: presente, pretérito (perfeito, imperfeito, mais-que-perfeito), futuro.
- PESSOA: 1ª (eu/nós), 2ª (tu/vós), 3ª (ele/eles).
- NÚMERO: singular / plural.

AS TRÊS VOZES VERBAIS (muito cobradas em PF/PRF):
1. VOZ ATIVA: o sujeito pratica a ação. Ex.: "O delegado assinou o relatório."
2. VOZ PASSIVA ANALÍTICA: verbo auxiliar (ser/estar/ficar) + particípio. O sujeito sofre a ação. Ex.: "O relatório foi assinado pelo delegado." → agente da passiva introduzido por "por/pelo".
3. VOZ PASSIVA SINTÉTICA (pronominal): verbo na 3ª pessoa + pronome "se" (partícula apassivadora). Ex.: "Assinaram-se os relatórios." / "Vende-se apartamento."
4. VOZ REFLEXIVA: sujeito pratica e sofre a ação simultaneamente. Ex.: "O suspeito se feriu durante a fuga." O pronome é parte integrante da ação reflexiva — não é apassivador.

PEGADINHA DE PROVA: "se" apassivador (voz passiva sintética) ≠ "se" reflexivo. Em "Prenderam-se os suspeitos", o "se" é apassivador (= "Os suspeitos foram presos"). Em "O agente se machucou", o "se" é reflexivo (ele praticou sobre si mesmo).`,
    mnemonic: "VERBO = AÇÃO/ESTADO/FENÔMENO. Vozes: Ativa (sujeito PRATICA), Passiva Analítica (ser/estar + particípio — sujeito SOFRE), Passiva Sintética (verbo+SE — sujeito SOFRE), Reflexiva (sujeito PRATICA e SOFRE). SE: apassivador ≠ reflexivo. Agente da passiva: introduzido por 'por/pelo'.",
    keyPoint: "Voz passiva analítica: verbo auxiliar + particípio (foi preso). Voz passiva sintética: verbo + SE apassivador (Prenderam-se = foram presos). Voz reflexiva: sujeito pratica e sofre (se machucou). Agente da passiva: 'por/pelo'. Transitividade: verbo transitivo direto (VTD) pede objeto sem preposição; transitivo indireto (VTI) pede objeto com preposição.",
    practicalExample: "Frase de prova: 'O suspeito foi detido pelos agentes da Polícia Federal.' Análise: voz passiva ANALÍTICA — verbo auxiliar 'foi' + particípio 'detido' + agente da passiva 'pelos agentes'. Transformação para ativa: 'Os agentes da Polícia Federal detiveram o suspeito.' Pegadinha: 'Deteve-se o suspeito' → voz passiva SINTÉTICA (SE apassivador), não reflexiva.",
    difficulty: "MEDIO",
  },

  // ── 3. Adjetivo e Artigo ──────────────────────────────────────────
  {
    title: "Adjetivo e Artigo: Funções Caracterizadoras e Determinantes em Provas",
    textContent: `O ADJETIVO e o ARTIGO são classes variáveis que se relacionam diretamente com o substantivo. Bancas cobram a diferença entre adjetivo e advérbio (pegadinha clássica) e o uso dos artigos como determinantes.

ADJETIVO — caracteriza, qualifica, classifica ou modifica o substantivo:
- Concorda em GÊNERO e NÚMERO com o substantivo a que se refere.
- Funções sintáticas: adjunto adnominal (ligado ao substantivo sem verbo de ligação: "o agente corajoso") ou predicativo (ligado ao sujeito/objeto por verbo de ligação: "O agente é corajoso.").
- GRAU: comparativo (superioridade, igualdade, inferioridade) e superlativo (absoluto analítico/sintético; relativo de superioridade/inferioridade).
- LOCUÇÃO ADJETIVA: preposição + substantivo com valor de adjetivo. Ex.: de pedra = pétrea; de ferro = férreo; de polícia = policial.
- ADJETIVO PÁTRIO: indica origem/naturalidade (brasileiro, paulista, carioca).

ARTIGO — antecede o substantivo para determiná-lo ou generalizá-lo:
- DEFINIDO (o, a, os, as): indica ser determinado, já conhecido. Ex.: "o policial" (aquele específico).
- INDEFINIDO (um, uma, uns, umas): indica ser indeterminado, desconhecido. Ex.: "um policial" (qualquer um).
- O artigo é VARIÁVEL: flexiona em gênero (o/a, um/uma) e número (os/as, uns/umas).
- O artigo pode SUBSTANTIVAR qualquer classe: "O sim do delegado encerrou o caso" (verbo "sim" → substantivado).

PEGADINHA CLÁSSICA — adjetivo × advérbio:
- "O agente é muito dedicado" → "muito" = advérbio (modifica adjetivo; INVARIÁVEL).
- "Havia muitos agentes no local" → "muitos" = adjetivo/pronome (modifica substantivo; VARIÁVEL — "muitos" flexiona).
- "O agente é dedicado" → "dedicado" = adjetivo (qualifica o substantivo "agente"; VARIÁVEL).`,
    mnemonic: "ADJETIVO = QUALIFICA SUBSTANTIVO. Concorda em gênero e número. Locução adjetiva: 'de + substantivo' (de ferro = férreo). ARTIGO = DETERMINA SUBSTANTIVO. Definido (o,a,os,as) = determinado. Indefinido (um,uma,uns,umas) = indeterminado. Artigo VARIÁVEL (não confundir com advérbio invariável). Substantivação: artigo + qualquer palavra = substantivo.",
    keyPoint: "Adjetivo: qualifica, concorda com substantivo (gênero e número), pode ser adjunto adnominal ou predicativo. Artigo: variável (o/a/os/as, um/uma/uns/umas), determina ou indetermina. Pegadinha: 'muito' advérbio (invariável, modifica adjetivo/verbo) vs 'muitos' adjetivo (variável, modifica substantivo). Locução adjetiva = preposição + substantivo (de pedra, de ferro, de lei).",
    practicalExample: "Questão de prova: 'A lei penal é muito severa nesse quesito.' Análise: 'penal' = adjetivo (qualifica 'lei', adjunto adnominal); 'severa' = adjetivo (predicativo do sujeito após verbo de ligação 'é'); 'muito' = ADVÉRBIO de intensidade (modifica o adjetivo 'severa' — INVARIÁVEL). Pegadinha: se a frase fosse 'Havia muitas leis severas', 'muitas' = adjetivo/pronome indefinido (VARIÁVEL, concorda com 'leis').",
    difficulty: "FACIL",
  },

  // ── 4. Advérbio ───────────────────────────────────────────────────
  {
    title: "Advérbio: Circunstâncias, Invariabilidade e Pegadinhas de Prova",
    textContent: `O ADVÉRBIO é uma classe de palavras INVARIÁVEL que modifica o verbo, o adjetivo ou outro advérbio, indicando uma circunstância. É intensamente cobrado em provas policiais por sua semelhança com adjetivos e pronomes indefinidos.

O QUE O ADVÉRBIO MODIFICA:
1. VERBO: "O agente agiu rapidamente." (rapidamente modifica "agiu")
2. ADJETIVO: "A prova foi muito difícil." (muito modifica "difícil")
3. OUTRO ADVÉRBIO: "O suspeito confessou bem depressa." (bem modifica "depressa")

PRINCIPAIS CIRCUNSTÂNCIAS:
- TEMPO: hoje, ontem, amanhã, sempre, nunca, ainda, já, logo, cedo, tarde.
- LUGAR: aqui, ali, lá, aí, onde, perto, longe, dentro, fora, acima, abaixo.
- MODO: bem, mal, assim, depressa, devagar + maioria dos adv. em -mente.
- INTENSIDADE: muito, pouco, bastante, demais, mais, menos, tão, quase.
- NEGAÇÃO: não, nunca, jamais, tampouco.
- AFIRMAÇÃO: sim, certamente, realmente, efetivamente.
- DÚVIDA: talvez, porventura, quiçá, acaso, possivelmente.

INVARIABILIDADE: o advérbio NÃO flexiona em gênero nem em número.
- ERRADO: "Ela respondeu muitamente bem." / "As provas foram dificeismente respondidas."
- CORRETO: "Ele respondeu muito bem." / "Ela respondeu muito bem." (mesmo "muito" para qualquer gênero/número)

LOCUÇÃO ADVERBIAL: dois ou mais termos com valor de advérbio (preposição + substantivo/adjetivo): à toa, de repente, às vezes, com certeza, em vão, de manhã, à noite.

PEGADINHAS RECORRENTES EM PF/PRF:
- "bastante": advérbio (invariável) quando modifica adjetivo/verbo. Adjetivo (variável) quando acompanha substantivo. Ex.: "bastante difícil" (adv.) vs "bastantes candidatos" (adj.).
- "mesmo": advérbio quando equivale a "de fato/realmente" (invariável). Pronome quando equivale a "o próprio" (variável).
- Advérbios em -mente derivam de adjetivo feminino + sufixo: rápido → rápida → rapidamente.`,
    mnemonic: "ADVÉRBIO = MODIFICA VERBO, ADJETIVO ou OUTRO ADVÉRBIO. INVARIÁVEL (não flexiona). Circunstâncias: Tem-Lu-Mo-In-Ne-Af-Dú (Tempo, Lugar, Modo, Intensidade, Negação, Afirmação, Dúvida). 'Bastante' = adv. se modifica adjetivo (bastante rápido); adj. se acompanha substantivo (bastantes provas — variável). Locução adverbial: 'de repente', 'às vezes', 'à noite'.",
    keyPoint: "Advérbio: invariável, modifica verbo/adjetivo/advérbio. 'Bastante' pode ser advérbio (invariável) ou adjetivo (variável). Advérbios em -mente: adjetivo feminino + -mente (rápida + mente). Locução adverbial: dois termos com valor de advérbio (de repente, às vezes). Diferença de pronome indefinido: 'muito trabalho' (adj/pron) vs 'trabalha muito' (adv).",
    practicalExample: "Questão de prova: 'Os candidatos se saíram bastante bem na fase objetiva.' Análise: 'bastante' = ADVÉRBIO de intensidade (modifica o advérbio 'bem' — INVARIÁVEL). Se fosse 'Bastantes candidatos passaram', 'bastantes' = ADJETIVO (modifica 'candidatos', variável, concordando em número). Pegadinha: se a questão disser que 'bastante' é sempre invariável → ERRADO (quando é adjetivo, concorda com o substantivo).",
    difficulty: "MEDIO",
  },

  // ── 5. Numeral e Interjeição ──────────────────────────────────────
  {
    title: "Numeral e Interjeição: Usos, Valor Semântico e Invariabilidade",
    textContent: `O NUMERAL e a INTERJEIÇÃO são duas classes com comportamentos distintos: o numeral expressa quantidade ou ordem (podendo flexionar), enquanto a interjeição expressa emoção ou estado afetivo e é INVARIÁVEL.

NUMERAL — expressa quantidade, ordem, múltiplo ou fração:
1. CARDINAL: indica quantidade absoluta. Ex.: um, dois, cem, mil. "O delegado prendeu três suspeitos."
2. ORDINAL: indica posição/ordem em sequência. Ex.: primeiro, segundo, décimo, centésimo. "Foi aprovado em primeiro lugar."
3. MULTIPLICATIVO: indica múltiplo. Ex.: duplo, triplo, quádruplo, décuplo. "A pena foi triplicada pelo juiz."
4. FRACIONÁRIO: indica fração/parte. Ex.: metade, terço, quarto, décimo. "Um terço dos candidatos foi eliminado."
5. COLETIVO (numeral): indica conjunto de quantidade específica. Ex.: dúzia (12), dezena (10), centena (100), milhar (1000), bimestre (2 meses).

FLEXÃO DO NUMERAL:
- Cardinais: "um/uma", "dois/duas" flexionam em gênero. Demais são invariáveis.
- Ordinais: flexionam em gênero e número (primeiro/primeira/primeiros/primeiras).
- Multiplicativos: geralmente invariáveis, mas "duplo" e "triplo" podem variar (dupla, tripla).
- Fracionários: variam quando combinados com ordinais (um terço / dois terços).

INTERJEIÇÃO — exprime emoção, sentimento, estado afetivo ou chamamento:
- É INVARIÁVEL — nunca flexiona.
- Pode ser uma palavra (Ah! Oh! Oxalá! Viva! Psiu!) ou locução interjetiva (Meu Deus! Ora bolas! Puxa vida!).
- Sempre seguida de ponto de exclamação (!) ou reticências.
- Classificação semântica: alegria (Oba!), dor (Ai!), surpresa (Uau!), saudação (Olá!), ordem (Atenção!), silêncio (Psiu!), pedido de socorro (Socorro!).

PEGADINHA: "Viva" pode ser verbo imperativo ("Viva o Brasil!" — ação) ou interjeição isolada ("Viva!" — emoção pura). "Oxalá" é sempre interjeição (≠ conjunção).`,
    mnemonic: "NUMERAL: Cardinal (qt.), Ordinal (ordem), Multiplicativo (múltiplo), Fracionário (parte), Coletivo (dúzia, dezena). Flexão: só 'um/uma' e 'dois/duas' no cardinal; ordinais flexionam normalmente. INTERJEIÇÃO: INVARIÁVEL, exprime emoção, sempre com (!). Locução interjetiva: 'Meu Deus!', 'Puxa vida!'. 'Oxalá' = sempre interjeição.",
    keyPoint: "Numeral ordinal: indica posição (primeiro, décimo, centésimo). Cardinal: quantidade (três, cem). Multiplicativo: múltiplo (duplo, triplo). Fracionário: parte (terço, quinto). Interjeição: invariável, expressa emoção, seguida de (!). 'Viva!' pode ser interjeição ou verbo imperativo. Numeral coletivo: dúzia=12, dezena=10, grosa=144.",
    practicalExample: "Questão de prova: 'O perito foi aprovado em décimo segundo lugar no concurso.' Análise: 'décimo' = numeral ORDINAL (indica posição); 'segundo' = numeral ORDINAL (forma composta: décimo segundo). Cuidado: 'segundo' pode ser preposição ('Segundo o perito...'), advérbio ('Chegou segundo no ranking') ou numeral ordinal ('o segundo colocado'). Interjeição: 'Atenção! Os candidatos devem apresentar documentos.' = interjeição de ordem (INVARIÁVEL).",
    difficulty: "MEDIO",
  },

  // ── 6. Mapa das 10 Classes ────────────────────────────────────────
  {
    title: "Mapa das 10 Classes de Palavras: Variáveis vs Invariáveis e Funções",
    textContent: `O MAPA DAS 10 CLASSES DE PALAVRAS organiza toda a morfologia portuguesa em dois grandes grupos: VARIÁVEIS (flexionam) e INVARIÁVEIS (não flexionam). Conhecer esse mapa é essencial para não confundir classes em provas policiais.

CLASSES VARIÁVEIS (flexionam em gênero, número e/ou pessoa):
1. SUBSTANTIVO: nomeia seres. Flexiona em gênero, número e grau. Núcleo do sujeito/objeto.
2. ADJETIVO: qualifica/caracteriza o substantivo. Concorda em gênero e número com o substantivo.
3. ARTIGO: determina/indetermina o substantivo. Flexiona em gênero e número (o/a/os/as; um/uma/uns/umas).
4. PRONOME: substitui ou acompanha o substantivo. Flexiona em gênero, número e pessoa.
5. VERBO: exprime ação/estado/fenômeno. Flexiona em modo, tempo, pessoa e número. Mais flexionado da língua.
6. NUMERAL (em parte): expressa quantidade/ordem. Ordinais flexionam; cardinais (exceto um/uma, dois/duas), multiplicativos e fracionários são geralmente invariáveis.

CLASSES INVARIÁVEIS (não flexionam):
7. ADVÉRBIO: modifica verbo, adjetivo ou advérbio. Indica circunstância (tempo, lugar, modo, intensidade...).
8. PREPOSIÇÃO: conecta dois termos, indicando relação entre eles (a, ante, até, com, de, em, entre, para, por, sem, sob, sobre, trás + contraídas: ao, do, no...).
9. CONJUNÇÃO: conecta orações ou termos de mesma função. Coordenativas (e, mas, ou, porém, logo...) e subordinativas (que, se, porque, embora, quando...).
10. INTERJEIÇÃO: exprime emoção/sentimento. Sempre invariável.

MACETE DAS INVARIÁVEIS: "A PREPOSIÇÃO, a CONJUNÇÃO, o ADVÉRBIO e a INTERJEIÇÃO nunca flexionam." = P.C.A.I.

POLISSEMIA MORFOLÓGICA (palavras que mudam de classe conforme o contexto):
- "como": conjunção (Fez como mandou.), advérbio (Como você está?), verbo (Eu como arroz.).
- "que": pronome relativo (O crime que ele cometeu), conjunção (Ele disse que virá), advérbio de intensidade (Que bela prova!).
- "segundo": numeral ordinal (o segundo suspeito), preposição (segundo o delegado), verbo (ele segundo = segue em 3ª conjugação arcaica).`,
    mnemonic: "VARIÁVEIS (flexionam): SAbAPVN = Substantivo, Adjetivo, Artigo, Pronome, Verbo, Numeral (parcial). INVARIÁVEIS: PACI = Preposição, Advérbio, Conjunção, Interjeição. Macete: 'PACI não muda'. Polissemia: 'como', 'que', 'segundo' mudam de classe conforme o contexto — sempre analise a função na frase.",
    keyPoint: "Variáveis (6): substantivo, adjetivo, artigo, pronome, verbo, numeral. Invariáveis (4): preposição, advérbio, conjunção, interjeição — PACI. Polissemia: mesma palavra pode ter classes diferentes (que, como, segundo, bastante). O critério é SEMPRE a função na frase. Artigo é variável (confusão frequente com advérbio invariável).",
    practicalExample: "Questão de prova: 'Segundo o laudo pericial, o crime ocorreu de madrugada.' Análise: 'Segundo' = PREPOSIÇÃO (equivale a 'conforme/de acordo com', liga dois termos — INVARIÁVEL). 'de madrugada' = locução adverbial de tempo (INVARIÁVEL). Pegadinha: se 'segundo' fosse 'o segundo suspeito', seria NUMERAL ORDINAL (VARIÁVEL). Se fosse 'Segundo (=sigo) os protocolos', seria VERBO. A classe depende da função na frase.",
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
  // Átomo 1 — Substantivo (Q1-Q2)
  // ══════════════════════════════════════════════════════════════════

  // Q1 — 'saudade' = substantivo abstrato (FACIL, CERTO)
  {
    id: "qz_port_morf_001",
    statement:
      "Julgue o item conforme a morfologia da língua portuguesa.\n\n" +
      "A palavra 'saudade', na frase 'A saudade do lar atormentava o agente durante a missão', " +
      "é um substantivo abstrato, pois denomina um sentimento que não possui existência física " +
      "concreta — existe apenas como produto da mente ou das relações humanas.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. 'Saudade' é um substantivo ABSTRATO: nomeia um sentimento (estado afetivo), que não " +
      "possui existência física independente — só existe como produto da mente ou das relações " +
      "humanas. Contraste com substantivo concreto (pedra, policial, arma), que tem existência " +
      "própria. Outros exemplos de abstratos recorrentes em prova: coragem, justiça, liberdade, " +
      "investigação (substantivo abstrato derivado do verbo 'investigar').",
    explanationCorrect:
      "Correto! 'Saudade' = substantivo ABSTRATO — denomina sentimento sem existência física " +
      "concreta (produto da mente/relações humanas). Outros abstratos: coragem, justiça, lealdade, " +
      "investigação. Contraste: 'policial' = substantivo concreto (existência própria).",
    explanationWrong:
      "O item está CERTO. 'Saudade' é substantivo ABSTRATO: denomina sentimento — algo que só " +
      "existe como produto da mente, sem forma física independente. Substantivo concreto tem " +
      "existência própria (arma, delegado, prédio). Abstrato: sentimentos, ações nominalizadas, " +
      "qualidades (coragem, investigação, justiça).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Substantivo: Classificações e Flexões em Provas Policiais",
  },

  // Q2 — 'policial' = substantivo sobrecomum (FACIL, ERRADO)
  {
    id: "qz_port_morf_002",
    statement:
      "Julgue o item conforme a morfologia da língua portuguesa.\n\n" +
      "Na frase 'A policial registrou a ocorrência com precisão', a palavra 'policial' é um " +
      "substantivo sobrecomum, pois apresenta gênero gramatical fixo (masculino) e não varia " +
      "conforme o sexo da pessoa referenciada.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. 'Policial' é um substantivo COMUM DE DOIS GÊNEROS (ou biformativo pelo artigo), " +
      "e não sobrecomum. O substantivo comum de dois gêneros admite artigo masculino ou feminino " +
      "para distinguir o sexo: 'o policial' (masculino) / 'a policial' (feminino). O substantivo " +
      "SOBRECOMUM tem gênero gramatical fixo independentemente do sexo — como 'a vítima' (sempre " +
      "feminino, mesmo que a vítima seja homem) e 'o cônjuge' (sempre masculino, mesmo que seja " +
      "mulher). 'Policial' NÃO é sobrecomum porque seu gênero VARIA com o artigo.",
    explanationCorrect:
      "O item está ERRADO. 'Policial' = substantivo COMUM DE DOIS GÊNEROS (o policial / a policial " +
      "— o artigo varia). Sobrecomum tem gênero FIXO independente do sexo: 'a vítima' (sempre " +
      "feminino, mesmo se a vítima for homem); 'o cônjuge' (sempre masculino). Policial não é " +
      "sobrecomum — o artigo muda conforme o sexo.",
    explanationWrong:
      "O item está ERRADO. 'Policial' = COMUM DE DOIS GÊNEROS: o artigo varia (o policial / a " +
      "policial) para indicar o sexo. Sobrecomum é o que tem gênero gramatical FIXO: 'a vítima' " +
      "(sempre fem.), 'o cônjuge' (sempre masc.) — mesmo que o sexo biológico seja o oposto. " +
      "'Policial' não se enquadra nisso.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Substantivo: Classificações e Flexões em Provas Policiais",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 2 — Verbo (Q3-Q4)
  // ══════════════════════════════════════════════════════════════════

  // Q3 — 'foi detido pelos agentes' = voz passiva analítica (MEDIO, CERTO)
  {
    id: "qz_port_morf_003",
    statement:
      "Julgue o item conforme a morfologia da língua portuguesa.\n\n" +
      "Na frase 'O suspeito foi detido pelos agentes da Polícia Federal', o verbo está na voz " +
      "passiva analítica, formada pelo verbo auxiliar 'foi' mais o particípio 'detido', com o " +
      "sujeito ('o suspeito') recebendo a ação e o agente da passiva introduzido pela preposição 'por'.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. A voz passiva analítica é formada por VERBO AUXILIAR (ser/estar/ficar) + PARTICÍPIO. " +
      "Na frase: 'foi' = auxiliar no pretérito perfeito do indicativo + 'detido' = particípio do " +
      "verbo deter. O sujeito ('o suspeito') SOFRE a ação; quem a pratica é o agente da passiva " +
      "('pelos agentes da PF'), introduzido pela preposição 'por' (contraída com 'os' = 'pelos'). " +
      "Transformação para voz ativa: 'Os agentes da PF detiveram o suspeito.'",
    explanationCorrect:
      "Correto! Voz passiva analítica: verbo auxiliar (foi) + particípio (detido). Sujeito 'o suspeito' " +
      "SOFRE a ação. Agente da passiva: 'pelos agentes da PF' (introduzido por 'por/pelo'). " +
      "Transformação ativa: 'Os agentes da PF detiveram o suspeito.'",
    explanationWrong:
      "O item está CERTO. 'Foi detido pelos agentes' = voz passiva ANALÍTICA: foi (aux.) + detido " +
      "(particípio). Sujeito paciente = o suspeito (sofre). Agente da passiva = pelos agentes (por + os). " +
      "Passiva sintética usaria 'se': 'Deteve-se o suspeito'. Reflexiva: sujeito pratica e sofre.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Verbo: Estrutura, Flexões e as Vozes Verbais em Provas Policiais",
  },

  // Q4 — 'o agente se machucou' = voz reflexiva, NÃO passiva (MEDIO, ERRADO)
  {
    id: "qz_port_morf_004",
    statement:
      "Julgue o item conforme a morfologia da língua portuguesa.\n\n" +
      "Na frase 'O agente se machucou durante a abordagem', o verbo 'machucou' está na voz passiva " +
      "sintética, pois o pronome 'se' funciona como partícula apassivadora, indicando que a ação " +
      "foi sofrida pelo sujeito sem que ele a tenha praticado.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O pronome 'se' em 'o agente se machucou' é pronome REFLEXIVO, e a voz é REFLEXIVA — " +
      "não passiva sintética. Na voz reflexiva, o mesmo sujeito pratica E sofre a ação sobre si mesmo: " +
      "'o agente' (sujeito) machucou (praticou) a si mesmo (sofreu). A voz passiva SINTÉTICA usa 'se' " +
      "APASSIVADOR (partícula apassivadora), e o verbo concorda com o sujeito paciente: 'Prenderam-se " +
      "os suspeitos' (= Os suspeitos foram presos). Diferença: na passiva sintética, substitui-se por " +
      "'foram + particípio'; na reflexiva, NÃO é possível essa substituição.",
    explanationCorrect:
      "O item está ERRADO. 'Se machucou' = VOZ REFLEXIVA (sujeito pratica E sofre). O 'se' é " +
      "REFLEXIVO, não apassivador. Passiva sintética: Prenderam-se os suspeitos (= foram presos). " +
      "Teste: é possível substituir por 'foram + particípio'? Se não → reflexiva. 'O agente foi " +
      "machucado' mudaria o sentido (agente externo machucou) — não é a mesma construção.",
    explanationWrong:
      "O item está ERRADO. Voz REFLEXIVA (não passiva sintética): o agente praticou a ação sobre si " +
      "mesmo (se machucou = machucou a si mesmo). O 'se' é pronome REFLEXIVO. Passiva sintética: " +
      "verbo + 'se' apassivador, sujeito paciente concorda com o verbo (Prenderam-se os suspeitos). " +
      "Diferença: passiva sintética → pode substituir por 'foram presos'; reflexiva → não pode.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Verbo: Estrutura, Flexões e as Vozes Verbais em Provas Policiais",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 3 — Adjetivo e Artigo (Q5-Q6)
  // ══════════════════════════════════════════════════════════════════

  // Q5 — 'penal' e 'severa' = adjetivos; 'muito' = advérbio (FACIL, CERTO)
  {
    id: "qz_port_morf_005",
    statement:
      "Julgue o item conforme a morfologia da língua portuguesa.\n\n" +
      "Na frase 'A legislação penal é muito severa', a palavra 'penal' é adjetivo (adjunto " +
      "adnominal do substantivo 'legislação'), 'severa' é adjetivo predicativo do sujeito, e " +
      "'muito' é advérbio de intensidade que modifica o adjetivo 'severa' — sendo, portanto, invariável.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Análise completa: 'penal' = ADJETIVO (qualifica 'legislação', adjunto adnominal — " +
      "concorda em gênero/número com o substantivo); 'severa' = ADJETIVO predicativo do sujeito " +
      "(ligado ao sujeito 'legislação' pelo verbo de ligação 'é'); 'muito' = ADVÉRBIO de intensidade " +
      "(modifica o adjetivo 'severa' — INVARIÁVEL, não flexiona: diz 'muito severa', 'muito severo', " +
      "'muito severas' — o 'muito' permanece igual). Essa análise tripla em uma mesma frase é " +
      "exatamente o tipo de questão cobrado pela Cesgranrio, Cebraspe e FCC em provas policiais.",
    explanationCorrect:
      "Correto! 'penal' = adjetivo (adjunto adnominal); 'severa' = adjetivo (predicativo do sujeito, " +
      "pós verbo de ligação 'é'); 'muito' = ADVÉRBIO de intensidade (invariável — modifica adjetivo). " +
      "Teste do advérbio: 'muito' não varia com gênero/número do adjetivo que modifica.",
    explanationWrong:
      "O item está CERTO. Tripla análise correta: 'penal' (adj. adnominal), 'severa' (adj. predicativo), " +
      "'muito' (adv. de intensidade — INVARIÁVEL). Advérbio modifica adjetivo/verbo/advérbio sem " +
      "flexionar. Se 'muito' fosse adjetivo, flexionaria: 'muitas legislações' — aí sim seria " +
      "adjetivo/pronome indefinido (variável).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Adjetivo e Artigo: Funções Caracterizadoras e Determinantes em Provas",
  },

  // Q6 — artigos são VARIÁVEIS (FACIL, ERRADO)
  {
    id: "qz_port_morf_006",
    statement:
      "Julgue o item conforme a morfologia da língua portuguesa.\n\n" +
      "Os artigos definidos e indefinidos da língua portuguesa são palavras invariáveis, " +
      "pois não se flexionam em gênero nem em número — assim como as preposições e as conjunções.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. Os ARTIGOS são palavras VARIÁVEIS — flexionam em gênero e número. Artigos definidos: " +
      "o (masc. sing.), a (fem. sing.), os (masc. pl.), as (fem. pl.). Artigos indefinidos: um (masc. " +
      "sing.), uma (fem. sing.), uns (masc. pl.), umas (fem. pl.). Preposições e conjunções, sim, são " +
      "invariáveis — mas o artigo não se enquadra nessa categoria. Comparação: 'a preposição' (a = " +
      "preposição, invariável) vs 'a casa' (a = artigo definido feminino singular, variável).",
    explanationCorrect:
      "O item está ERRADO. Artigos são VARIÁVEIS: o/a/os/as (definidos) e um/uma/uns/umas " +
      "(indefinidos) — flexionam em gênero e número. Invariáveis são: preposição, conjunção, " +
      "advérbio e interjeição (PACI). Não confundir 'a' artigo (variável) com 'a' preposição (invariável).",
    explanationWrong:
      "O item está ERRADO. Artigos FLEXIONAM em gênero (o/a, um/uma) e número (os/as, uns/umas) — " +
      "são palavras VARIÁVEIS. Palavras invariáveis: preposição, advérbio, conjunção, interjeição " +
      "(PACI). O artigo não está nesse grupo. Pegadinha: 'a' pode ser artigo (variável) ou " +
      "preposição (invariável) — a função na frase determina a classe.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Adjetivo e Artigo: Funções Caracterizadoras e Determinantes em Provas",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 4 — Advérbio (Q7-Q8)
  // ══════════════════════════════════════════════════════════════════

  // Q7 — advérbio pode modificar outro advérbio (MEDIO, CERTO)
  {
    id: "qz_port_morf_007",
    statement:
      "Julgue o item conforme a morfologia da língua portuguesa.\n\n" +
      "Na frase 'O investigador agiu muito rapidamente', a palavra 'muito' é um advérbio de " +
      "intensidade que modifica o advérbio 'rapidamente' — demonstrando que o advérbio pode " +
      "modificar não apenas verbos e adjetivos, mas também outro advérbio.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. O advérbio modifica três classes: (1) verbo — 'agiu rapidamente'; (2) adjetivo — " +
      "'muito habilidoso'; (3) outro advérbio — 'muito rapidamente' ('muito' modifica 'rapidamente'). " +
      "Na frase analisada, 'muito' é advérbio de intensidade que intensifica o advérbio de modo " +
      "'rapidamente'. Ambos são INVARIÁVEIS: não flexionam independentemente do gênero/número do " +
      "sujeito ou complementos da oração. Essa estrutura (advérbio + advérbio) é cobrada nas provas " +
      "de PF e PRF para testar se o candidato conhece os três alvos do advérbio.",
    explanationCorrect:
      "Correto! Advérbio modifica: verbo, adjetivo OU outro advérbio. 'Muito' (intensidade) modifica " +
      "'rapidamente' (modo) → advérbio modificando advérbio. Ambos INVARIÁVEIS. Os três alvos do " +
      "advérbio: V (agiu bem), Adj (muito corajoso), Adv (muito rapidamente).",
    explanationWrong:
      "O item está CERTO. O advérbio modifica verbo, adjetivo E outro advérbio. 'Muito rapidamente' " +
      "= 'muito' (adv. de intensidade) modificando 'rapidamente' (adv. de modo). Ambos invariáveis. " +
      "Essa tripla função do advérbio (V, Adj, Adv) é ponto frequente em provas policiais.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Advérbio: Circunstâncias, Invariabilidade e Pegadinhas de Prova",
  },

  // Q8 — 'bastantes candidatos': 'bastantes' = adjetivo (VARIÁVEL), não advérbio (MEDIO, ERRADO)
  {
    id: "qz_port_morf_008",
    statement:
      "Julgue o item conforme a morfologia da língua portuguesa.\n\n" +
      "Na frase 'Havia bastantes candidatos aptos no concurso da PF', a palavra 'bastantes' é " +
      "um advérbio de intensidade — e, por ser advérbio (classe invariável), a forma 'bastantes' " +
      "com flexão de número é incorreta, devendo-se usar 'bastante' em qualquer contexto.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. Na frase 'bastantes candidatos', a palavra 'bastantes' acompanha e qualifica o " +
      "substantivo 'candidatos' — exerce função de ADJETIVO (ou pronome indefinido adjetivo), " +
      "não de advérbio. Como adjetivo, FLEXIONA em número para concordar com o substantivo: " +
      "'bastantes candidatos' está correto. 'Bastante' funciona como ADVÉRBIO (invariável) apenas " +
      "quando modifica verbo, adjetivo ou outro advérbio: 'o candidato estava bastante nervoso' " +
      "(modifica adjetivo 'nervoso' — sem flexão). Regra: se puder substituir por 'muitos/muitas' " +
      "(concordando), é adjetivo; se puder substituir por 'muito' (sem flexão), é advérbio.",
    explanationCorrect:
      "O item está ERRADO. 'Bastantes candidatos' → 'bastantes' = ADJETIVO (acompanha substantivo, " +
      "flexiona: bastante/bastantes). Advérbio seria: 'estava bastante nervoso' (modifica adjetivo, " +
      "invariável). Teste: substitui por 'muitos'? Adjetivo. Substitui por 'muito' sem flexão? Advérbio.",
    explanationWrong:
      "O item está ERRADO. 'Bastantes candidatos': 'bastantes' acompanha substantivo → ADJETIVO " +
      "(variável — flexiona em número). Advérbio seria 'bastante nervoso' (modifica adjetivo, " +
      "invariável). 'Bastante' é palavra de dupla classe: adjetivo (variável) quando precede " +
      "substantivo; advérbio (invariável) quando modifica adjetivo/verbo/advérbio.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Advérbio: Circunstâncias, Invariabilidade e Pegadinhas de Prova",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 5 — Numeral e Interjeição (Q9-Q10)
  // ══════════════════════════════════════════════════════════════════

  // Q9 — 'primeiro lugar' = numeral ordinal (FACIL, CERTO)
  {
    id: "qz_port_morf_009",
    statement:
      "Julgue o item conforme a morfologia da língua portuguesa.\n\n" +
      "Na frase 'O candidato foi aprovado em primeiro lugar no concurso de escrivão', a palavra " +
      "'primeiro' é um numeral ordinal, pois indica a posição do candidato em uma sequência " +
      "ordenada — e, por ser ordinal, flexiona em gênero e número (primeira, primeiros, primeiras).",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. 'Primeiro' é numeral ORDINAL — indica posição/ordem em uma sequência (primeiro, " +
      "segundo, terceiro, décimo, centésimo...). Os numerais ordinais FLEXIONAM em gênero e número: " +
      "primeiro/primeira/primeiros/primeiras. Contraste com cardinal (indica quantidade: um, dois, " +
      "cem — apenas 'um' e 'dois' flexionam em gênero). Aplicação em prova: 'O primeiro suspeito' " +
      "(masc. sing.) / 'A primeira testemunha' (fem. sing.) / 'Os primeiros indícios' (masc. pl.) — " +
      "todos corretos, demonstrando a flexão do ordinal.",
    explanationCorrect:
      "Correto! 'Primeiro' = numeral ORDINAL (indica posição/ordem). Ordinais flexionam em gênero " +
      "e número: primeiro/primeira/primeiros/primeiras. Contraste: cardinal (quantidade) = 'um/dois' " +
      "flexionam em gênero; os demais cardinais (três, cem, mil) são invariáveis.",
    explanationWrong:
      "O item está CERTO. 'Primeiro' = numeral ORDINAL (posição/ordem) e FLEXIONA: primeira, " +
      "primeiros, primeiras. Numerais ordinais são variáveis (diferente dos cardinais, maioria " +
      "invariável). 'Primeiro lugar' em contexto de concurso = posição na ordem de classificação.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Numeral e Interjeição: Usos, Valor Semântico e Invariabilidade",
  },

  // Q10 — interjeições são INVARIÁVEIS (MEDIO, ERRADO)
  {
    id: "qz_port_morf_010",
    statement:
      "Julgue o item conforme a morfologia da língua portuguesa.\n\n" +
      "As interjeições são palavras variáveis da língua portuguesa, podendo flexionar em gênero " +
      "e número conforme o contexto da frase — assim como os adjetivos, que concordam com o " +
      "substantivo a que se referem.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. As interjeições são palavras INVARIÁVEIS — nunca flexionam em gênero, número ou " +
      "qualquer outra categoria gramatical. Elas expressam emoções, sentimentos, estados afetivos " +
      "ou chamamentos de forma isolada: Ah!, Oh!, Uau!, Oba!, Psiu!, Atenção!, Viva!, Socorro! " +
      "São sempre seguidas de ponto de exclamação ou reticências. Integram o grupo das 4 classes " +
      "INVARIÁVEIS da língua: Preposição, Advérbio, Conjunção e Interjeição (PACI). A analogia " +
      "com adjetivos está incorreta — adjetivos são variáveis (concordam com o substantivo).",
    explanationCorrect:
      "O item está ERRADO. Interjeições são INVARIÁVEIS — não flexionam em nenhuma categoria. " +
      "Pertencem ao grupo PACI (Preposição, Advérbio, Conjunção, Interjeição — todos invariáveis). " +
      "Adjetivos são variáveis (flexionam). Interjeição: 'Oba!', 'Psiu!', 'Atenção!' — nunca muda.",
    explanationWrong:
      "O item está ERRADO. Interjeições = INVARIÁVEIS (não flexionam em gênero nem número). Fazem " +
      "parte das 4 classes invariáveis: PACI (Preposição, Advérbio, Conjunção, Interjeição). " +
      "Adjetivos são variáveis e concordam com substantivos — não se comparam às interjeições " +
      "nesse aspecto. 'Viva!' é sempre 'Viva!' — nunca 'Vivas!' como flexão de interjeição.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Numeral e Interjeição: Usos, Valor Semântico e Invariabilidade",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 6 — Mapa das 10 Classes (Q11-Q12)
  // ══════════════════════════════════════════════════════════════════

  // Q11 — PACI = 4 invariáveis (MEDIO, CERTO)
  {
    id: "qz_port_morf_011",
    statement:
      "Julgue o item conforme a morfologia da língua portuguesa.\n\n" +
      "Na gramática portuguesa, as classes de palavras dividem-se em variáveis (que flexionam " +
      "em gênero, número e/ou pessoa) e invariáveis (que não flexionam). São classes invariáveis " +
      "o advérbio, a preposição, a conjunção e a interjeição.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. As 4 classes INVARIÁVEIS da língua portuguesa são: Preposição, Advérbio, Conjunção " +
      "e Interjeição — macete PACI. As demais 6 classes são VARIÁVEIS: substantivo (gênero, número, " +
      "grau), adjetivo (gênero, número, grau), artigo (gênero, número), pronome (gênero, número, " +
      "pessoa), verbo (modo, tempo, pessoa, número) e numeral (ordinais flexionam; cardinais " +
      "parcialmente). Em provas policiais, a banca frequentemente testa se o candidato classifica " +
      "corretamente o artigo (variável) e o advérbio (invariável) — os dois mais confundidos.",
    explanationCorrect:
      "Correto! Invariáveis = PACI: Preposição, Advérbio, Conjunção, Interjeição. Variáveis (6): " +
      "substantivo, adjetivo, artigo, pronome, verbo, numeral. Pegadinha: artigo é VARIÁVEL (o/a/os/as). " +
      "Advérbio é INVARIÁVEL. Muitos candidatos confundem os dois.",
    explanationWrong:
      "O item está CERTO. As 4 invariáveis = PACI (Preposição, Advérbio, Conjunção, Interjeição). " +
      "As 6 variáveis: substantivo, adjetivo, artigo, pronome, verbo, numeral. Memorizando PACI, " +
      "o restante é variável. Atenção: artigo (o/a/os/as) é variável — não confundir com advérbio.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Mapa das 10 Classes de Palavras: Variáveis vs Invariáveis e Funções",
  },

  // Q12 — 'muito' e 'pouco' em 'trabalha muito / dorme pouco' = advérbios (DIFICIL, ERRADO)
  {
    id: "qz_port_morf_012",
    statement:
      "Julgue o item conforme a morfologia da língua portuguesa.\n\n" +
      "Na frase 'A delegada trabalha muito e dorme pouco', as palavras 'muito' e 'pouco' são " +
      "pronomes indefinidos, pois substituem uma quantidade não especificada de substantivo — " +
      "função típica dos pronomes indefinidos na língua portuguesa.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. Na frase 'trabalha muito' e 'dorme pouco', 'muito' e 'pouco' modificam os VERBOS " +
      "'trabalha' e 'dorme', indicando intensidade/quantidade da ação — exercem função de ADVÉRBIOS " +
      "de intensidade (ou quantidade). São, portanto, INVARIÁVEIS nesse contexto. Seriam pronomes " +
      "indefinidos se acompanhassem ou substituíssem substantivos: 'Muitos candidatos passaram' " +
      "(adj./pronome indef. adjetivo, variável) ou 'Muitos passaram' (pronome indef. substantivo). " +
      "A distinção é a FUNÇÃO: modifica verbo/adjetivo/advérbio → advérbio (invariável); acompanha " +
      "ou substitui substantivo → pronome/adjetivo indefinido (variável).",
    explanationCorrect:
      "O item está ERRADO. 'Trabalha muito' / 'dorme pouco': 'muito' e 'pouco' modificam VERBOS → " +
      "ADVÉRBIOS de intensidade (invariáveis). Pronome indefinido: substituiria/acompanharia " +
      "substantivo ('Muitos passaram' / 'Muitos candidatos'). A função na frase define a classe.",
    explanationWrong:
      "O item está ERRADO. 'Muito' e 'pouco' modificam os verbos 'trabalha' e 'dorme' → " +
      "ADVÉRBIOS de intensidade (invariáveis nesse contexto). Pronome indefinido seria: 'Muitos " +
      "chegaram tarde' (substitui substantivo) ou 'Muitos candidatos' (acompanha substantivo). " +
      "Regra: modifica verbo/adjetivo/advérbio = advérbio; acompanha/substitui substantivo = " +
      "pronome/adjetivo indefinido.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Mapa das 10 Classes de Palavras: Variáveis vs Invariáveis e Funções",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n📝  Seed R21: Língua Portuguesa — Morfologia I (10 Classes)\n");

  // ── 1. Encontrar Subject ────────────────────────────────────────────────
  let subjectId = await findSubject("Portugu");
  if (!subjectId) subjectId = await findSubject("LINGUA_PORTUGUESA");
  if (!subjectId) subjectId = await findSubject("Língua");
  if (!subjectId) {
    console.error("❌ Subject para Língua Portuguesa não encontrado.");
    console.error("   Verifique o nome da matéria no banco com: SELECT name FROM \"Subject\";");
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

  // ── 4. Encontrar ou criar Topic ────────────────────────────────────────
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

  // ── Backfill contentId em questões já existentes ──────────────────────
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
  console.error("❌ Seed R21 falhou:", err);
  process.exit(1);
});
