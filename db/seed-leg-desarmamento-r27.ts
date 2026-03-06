/**
 * Seed: Legislação Penal Especial — R27 — Estatuto do Desarmamento (Lei 10.826/2003)
 * (Posse vs Porte, Autorizados, Hediondos, Comércio/Tráfico, SINARM/SIGMA, Art. 16 e Aumento)
 *
 * Popula 6 átomos de Conteúdo + 12 Questões.
 * Idempotente: verifica existência antes de inserir.
 * TODAS as questões têm contentId vinculado ao átomo correto.
 * correctOption é SEMPRE numérico (0-4): A=0, B=1, C=2, D=3, E=4.
 *
 * Execução:
 *   npx tsx db/seed-leg-desarmamento-r27.ts
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
// INTERFACES
// ============================================

interface ContentAtom {
  id: string;
  title: string;
  textContent: string;
  mnemonic: string;
  keyPoint: string;
  practicalExample: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
}

interface Alternative {
  letter: string;
  text: string;
}

interface QuestionData {
  id: string;
  statement: string;
  alternatives: Alternative[];
  correctAnswer: string;
  correctOption: number;
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  questionType: "CERTO_ERRADO" | "MULTIPLA_ESCOLHA";
  contentTitle: string;
}

// ============================================
// CONTEÚDOS (6 átomos)
// ============================================

const contents: ContentAtom[] = [
  // ── 1. Posse Irregular vs Porte Ilegal ────────────────────────────────────
  {
    id: "lpe_da_c01",
    title: "Arts. 12 e 14 — Posse Irregular vs Porte Ilegal de Arma de Fogo",
    textContent: `A Lei 10.826/2003 (Estatuto do Desarmamento) distingue dois tipos penais fundamentais: posse irregular (art. 12) e porte ilegal (art. 14). A confusão entre eles é a armadilha mais frequente em concursos de segurança pública.

ART. 12 — POSSE IRREGULAR:
Ter em casa ou no estabelecimento comercial arma de fogo de uso permitido, em desacordo com determinação legal ou regulamentar.
Pena: detenção de 1 a 3 anos + multa.
Elemento central: o agente mantém a arma em LOCAL FIXO (residência ou estabelecimento).

ART. 14 — PORTE ILEGAL:
Portar, deter, adquirir, fornecer, receber, ter em depósito, transportar, ceder, ainda que gratuitamente, emprestar, remeter, empregar, manter sob guarda ou ocultar arma de fogo, acessório ou munição, de uso permitido, sem autorização e em desacordo com determinação legal.
Pena: reclusão de 2 a 4 anos + multa.
Elemento central: MOBILIDADE — trazer consigo ou colocar a arma em circulação.

DISTINÇÃO PRÁTICA:
- POSSE (art. 12): crime menos grave (detenção) → arma no lar ou local de trabalho.
- PORTE (art. 14): crime mais grave (reclusão) → arma fora do local fixo, em vias públicas ou transporte.

ARMA DESMUNICIADA:
STJ (Súmula 513 e jurisprudência consolidada): a arma de fogo desmuniciada configura o crime — os delitos dos arts. 12 e 14 são crimes de PERIGO ABSTRATO. Não é necessário que a arma esteja apta a disparar para configurar o tipo.
EXCEÇÃO: arma completamente inapta para disparo (defeituosa/desmontada sem possibilidade de uso) → STJ admite ausência de perigo real → atipicidade.

AMBOS: crimes permanentes (flagrante a qualquer momento enquanto a situação persiste).`,
    mnemonic: "POSSE = lar/trabalho (fixo) = DETENÇÃO 1-3 anos. PORTE = trazer consigo (móvel) = RECLUSÃO 2-4 anos. Desmuniciada = continua crime (perigo abstrato). Posse < Porte na gravidade.",
    keyPoint: "Art. 12 (posse): detenção 1-3 anos — arma em local fixo. Art. 14 (porte): reclusão 2-4 anos — trazer consigo. Crimes de perigo abstrato — arma desmuniciada configura o tipo. Crime permanente.",
    practicalExample: "Arma encontrada em casa durante busca domiciliar = art. 12 (posse irregular). Arma encontrada na cintura do agente em via pública = art. 14 (porte ilegal). Mesma arma, lugares diferentes, penas diferentes. Policial sem habilitação para porte fora de serviço flagrado com arma no carro = art. 14.",
    difficulty: "FACIL",
  },

  // ── 2. Quem Pode Possuir e Portar — Arts. 6º e 7º ────────────────────────
  {
    id: "lpe_da_c02",
    title: "Arts. 6º e 7º — Autorizados a Possuir e Portar Arma de Fogo",
    textContent: `O Estatuto do Desarmamento proíbe o porte de arma de fogo em todo o território nacional (art. 5º), exceto para as categorias expressamente listadas no art. 6º — lista TAXATIVA (numerus clausus).

ART. 6º — QUEM PODE POSSUIR E PORTAR (lista taxativa, principais incisos):
I — Integrantes das Forças Armadas e das polícias (Federal, Rodoviária Federal, Ferroviária Federal, Civis, Militares e Corpo de Bombeiros Militares dos Estados e Distrito Federal).
II — Integrantes do quadro permanente das agências de inteligência.
III — Dirigentes responsáveis pelo órgão central do Sistema de Segurança Pública e Defesa Social do DF.
IV — Integrantes das guardas prisionais das Unidades Prisionais.
V — Agentes operacionais da ABIN e da AISA.
VI — Policiais civis e militares reformados ou da reserva remunerada.
VII — Militares reformados das Forças Armadas.
VIII — Guardas municipais das capitais dos Estados e municípios com mais de 500.000 habitantes — APENAS em serviço.
IX — Integrantes das empresas de segurança privada e de transporte de valores (em serviço e habilitados).
X — Membros do Ministério Público.
XI — Membros do Poder Judiciário.
XII — Residentes em área rural + empregador ou empregado do setor agropecuário com registro em sindicato.

ART. 7º — CONDIÇÕES PARA PORTE:
O porte é condicionado a: capacitação técnica, aptidão psicológica e autorização específica da autoridade competente.

PORTE FORA DE SERVIÇO:
Os integrantes dos incisos I, II, III, V e VI podem portar fora de serviço, desde que habilitados e com autorização regular.
Guardas municipais (inc. VIII): em regra, apenas em serviço — conforme regulamentação.

PONTO CRÍTICO:
O particular comum (cidadão sem qualquer dos vínculos listados) NÃO está autorizado a portar arma de fogo, independentemente de alegações de risco pessoal.`,
    mnemonic: "Art. 6º = LISTA FECHADA: FFAA + Polícias + Reformados + MP + Judiciário + Guardas Municipais (em serviço) + Segurança Privada (em serviço) + Rural. FORA da lista = PROIBIDO.",
    keyPoint: "Lista taxativa (art. 6º) — fora dela, cidadão não porta. Guardas municipais: capitais + municípios >500 mil habitantes, só em serviço. MP e Poder Judiciário expressamente incluídos. Particular comum: vedado.",
    practicalExample: "Juiz Federal ameaçado de morte = pode portar (art. 6º, XI). Promotor de Justiça = pode portar (art. 6º, X). Empresário com inimigos declarados = NÃO pode portar (não está no art. 6º). Guarda Municipal de São Paulo em ronda = pode portar. O mesmo guarda em folga = depende da regulamentação específica.",
    difficulty: "FACIL",
  },

  // ── 3. Crimes Equiparados a Hediondos na Lei 10.826 ──────────────────────
  {
    id: "lpe_da_c03",
    title: "Crimes Hediondos e Equiparados na Lei 10.826/2003 — Arts. 16, 17 e 18",
    textContent: `Nem todos os crimes da Lei 10.826/2003 são equiparados a hediondos. A lei faz uma distinção clara: crimes de menor gravidade (arts. 12 e 14) são crimes comuns, enquanto os de maior potencial lesivo (arts. 16, 17 e 18) são equiparados a hediondos pela Lei 8.072/90.

CRIMES EQUIPARADOS A HEDIONDOS (Lei 8.072/90, art. 2º):
- Art. 16 (porte de arma de uso restrito ou com numeração adulterada)
- Art. 17 (comércio ilegal de arma de fogo)
- Art. 18 (tráfico internacional de arma de fogo)

CRIMES NÃO HEDIONDOS (crimes comuns):
- Art. 12 (posse irregular de arma de uso permitido) → detenção 1-3 anos
- Art. 14 (porte ilegal de arma de uso permitido) → reclusão 2-4 anos

CONSEQUÊNCIAS DA HEDIONDEZ (Lei 8.072/90):
• Vedados: anistia, graça e indulto (CF, art. 5º, XLIII).
• Progressão de regime: cumprimento de 2/5 (primário) ou 3/5 (reincidente) da pena.
• Liberdade provisória: vedada para os crimes previstos (discutida).
• Regime inicial: determinado pelo caso concreto (STF afastou o fechado obrigatório — HC 111.840).

MACETE PARA PROVAS:
Usa a escada de gravidade:
• Art. 12 = POSSE irregular (comum)
• Art. 14 = PORTE ilegal (comum)
• Art. 16 = RESTRITO/numeração adulterada (HEDIONDO)
• Art. 17 = COMÉRCIO ilegal (HEDIONDO)
• Art. 18 = TRÁFICO INTERNACIONAL (HEDIONDO)`,
    mnemonic: "Hediondos na 10.826: 16-17-18. NÃO hediondos: 12 e 14. Regra: uso PERMITIDO = comum; uso RESTRITO / comércio / tráfico = hediondo. Consequências: sem anistia/graça/indulto + progressão 2/5 ou 3/5.",
    keyPoint: "Arts. 16, 17 e 18 = equiparados a hediondos. Arts. 12 e 14 = crimes comuns. Hediondez: veda anistia, graça e indulto; progressão com 2/5 ou 3/5. STF afastou o regime inicial fechado obrigatório.",
    practicalExample: "Flagranteado com arma .38 não registrada (uso permitido) na cintura = art. 14 (NÃO hediondo). Flagranteado com fuzil .223 (uso restrito) = art. 16 (HEDIONDO). Vendendo pistola 9mm sem autorização = art. 17 (HEDIONDO). A diferença hediondo/comum impacta diretamente o regime de cumprimento da pena.",
    difficulty: "MEDIO",
  },

  // ── 4. Comércio Ilegal (art. 17) e Tráfico Internacional (art. 18) ────────
  {
    id: "lpe_da_c04",
    title: "Arts. 17 e 18 — Comércio Ilegal e Tráfico Internacional de Arma de Fogo",
    textContent: `Os arts. 17 e 18 da Lei 10.826/2003 tipificam as formas mais graves de ilícitos com armas de fogo — ambos equiparados a crimes hediondos.

ART. 17 — COMÉRCIO ILEGAL DE ARMA DE FOGO:
Conduta: vender, expor à venda, usar, transportar, ceder, dar, emprestar, remeter, empregar, manter em depósito ou, de qualquer forma, utilizar — em proveito próprio ou alheio — arma de fogo, acessório ou munição, sem autorização e em desacordo com determinação legal ou regulamentar.
Pena: reclusão de 4 a 8 anos + multa.
Equiparado a hediondo.
Sujeito ativo: qualquer pessoa — inclusive quem, sem registro como comerciante, pratica os atos de comércio.

ART. 18 — TRÁFICO INTERNACIONAL DE ARMA DE FOGO:
Conduta: importar, exportar, favorecer a entrada ou saída do território nacional — a qualquer título — de arma de fogo, acessório ou munição, sem autorização da autoridade competente.
Pena: reclusão de 8 a 16 anos + multa.
Equiparado a hediondo.
Pena dobrada em relação ao art. 17 — a transnacionalidade justifica a maior reprovação.

DIFERENÇAS CENTRAIS (art. 17 vs art. 18):
┌───────────────────────────────────────────────────────┐
│ Art. 17: comércio INTERNO — sem cruzar fronteiras     │
│ Art. 18: tráfico TRANSNACIONAL — entra ou sai do país │
│                                                       │
│ Pena art. 17: reclusão 4-8 anos                       │
│ Pena art. 18: reclusão 8-16 anos (dobro do art. 17)   │
└───────────────────────────────────────────────────────┘

PONTO DE ATENÇÃO:
Não confundir "porte ilegal" (art. 14 — uso pessoal) com "comércio ilegal" (art. 17 — atos de circulação comercial). A finalidade de fazer circular a arma no comércio ilegal é o que distingue os tipos.`,
    mnemonic: "Art. 17 = comércio INTERNO (4-8 anos, hediondo). Art. 18 = tráfico INTERNACIONAL (8-16 anos, hediondo). Dobrou a pena, cruzou a fronteira. Ambos hediondos.",
    keyPoint: "Art. 17 (comércio ilegal): reclusão 4-8 anos, hediondo. Art. 18 (tráfico internacional): reclusão 8-16 anos, hediondo. O tráfico internacional tem pena exatamente dobrada. Não confundir porte (art. 14) com comércio (art. 17).",
    practicalExample: "Indivíduo que revende pistolas em boca de fumo sem autorização = art. 17 (comércio ilegal, 4-8 anos, hediondo). Quadrilha que importa fuzis do Paraguai = art. 18 (tráfico internacional, 8-16 anos, hediondo). Cidadão que tem arma registrada mas emprestou a amigo = discussão sobre art. 14 ou art. 17 — o ato de 'emprestar' consta no art. 17.",
    difficulty: "MEDIO",
  },

  // ── 5. SINARM e SIGMA ─────────────────────────────────────────────────────
  {
    id: "lpe_da_c05",
    title: "SINARM e SIGMA — Sistemas de Controle de Armas na Lei 10.826/2003",
    textContent: `A Lei 10.826/2003 criou dois sistemas nacionais de controle de armas de fogo, com competências distintas e frequentemente confundidos em provas:

SINARM — Sistema Nacional de Armas:
• Instituído pelo Estatuto do Desarmamento.
• Administrado pela POLÍCIA FEDERAL (Departamento de Polícia Federal).
• Objeto: armas de fogo de USO PERMITIDO (calibres autorizados para civis).
• Funções: identificação, registro e rastreamento de armas de uso permitido em todo o território nacional.
• Abrangência: armas de pessoas físicas (civis) e jurídicas autorizadas.
• Centraliza: registro, transferência, exportação/importação, fabricação, comercialização de armas de uso permitido.

SIGMA — Sistema de Gerenciamento Militar de Armas:
• Administrado pelo EXÉRCITO BRASILEIRO (Comando do Exército).
• Objeto: armas de fogo de USO RESTRITO e USO PROIBIDO.
• Funções: cadastro, registro e controle de armas de uso restrito, utilizadas por militares das FFAA, policiais (em relação a armamento de uso restrito) e órgãos de segurança pública.
• Inclui: fuzis, metralhadoras, pistolas de calibres militares, e todo o armamento da cadeia de uso restrito.

TABELA RESUMO:
┌──────────────────────────────────────────────────────┐
│ SINARM  │ Polícia Federal  │ Uso PERMITIDO (civis)    │
│ SIGMA   │ Exército         │ Uso RESTRITO (militares) │
└──────────────────────────────────────────────────────┘

CLASSIFICAÇÃO DE ARMAS (ponto de conexão):
• Uso PERMITIDO: calibres de menor poder ofensivo autorizados para civis — ex.: revólver .38, pistola 9mm (em certas configurações).
• Uso RESTRITO: calibres e modelos de uso exclusivo de militares e policiais — ex.: fuzis .223, .308, pistolas .40 e .45 em configurações específicas, metralhadoras.
• Uso PROIBIDO: armas com potencial de causar dano em escala — proibidas para todos exceto forças regulares em situações específicas.`,
    mnemonic: "SINARM = S de Segurança Pública (Polícia Federal) + Uso PERMITIDO. SIGMA = S de Soldado (Exército) + Uso RESTRITO. PF cuida do civil; Exército cuida do militar.",
    keyPoint: "SINARM: Polícia Federal → uso permitido (civis). SIGMA: Exército → uso restrito (militares/policiais). A troca entre os dois sistemas é a armadilha clássica em provas. Ambos criados pela Lei 10.826/2003.",
    practicalExample: "Cidadão registra revólver .38 no cartório = cadastro no SINARM (PF). Soldado do Exército recebe fuzil M4 = cadastro no SIGMA (Exército). Delegado recebe pistola .40 de uso restrito = SIGMA. Cidadão compra arma em loja autorizada = SINARM verifica e registra.",
    difficulty: "MEDIO",
  },

  // ── 6. Art. 16 e Causas de Aumento de Pena ────────────────────────────────
  {
    id: "lpe_da_c06",
    title: "Art. 16 e Arts. 19-20 — Uso Restrito, Numeração Adulterada e Causas de Aumento",
    textContent: `O art. 16 da Lei 10.826/2003 é o tipo mais grave da categoria de porte/posse — e ponto obrigatório nos concursos de segurança pública por ser equiparado a hediondo.

ART. 16 — PORTE ILEGAL DE ARMA DE USO RESTRITO:
Conduta: possuir, deter, portar, adquirir, fornecer, receber, ter em depósito, transportar, ceder, emprestar, remeter, empregar, manter sob guarda ou ocultar arma de fogo, acessório ou munição de uso proibido ou restrito, sem autorização e em desacordo com determinação legal ou regulamentar.
Pena: reclusão de 3 a 6 anos + multa.
Equiparado a HEDIONDO.

CONDUTAS EQUIPARADAS DO ART. 16 (parágrafo único):
• Suprimir ou adulterar marca, numeração ou qualquer sinal de identificação de arma de fogo ou artefato.
• Modificar as características da arma para torná-la proibida ou restrita.
• Portar, possuir, adquirir ou ter em depósito arma com numeração, marca ou sinal externo raspado, suprimido ou adulterado.

ART. 19 — CAUSA DE AUMENTO (resultado morte ou lesão grave):
Se do crime resultar morte ou lesão corporal grave → aumento de pena previsto no tipo.

ART. 20 — CAUSA DE AUMENTO (agentes autorizados ou organização criminosa):
Penas aumentadas da metade quando o crime for praticado:
I — por integrante dos órgãos e empresas referidos nos arts. 6º, 7º e 8º (agentes que deveriam zelar pelo uso legal das armas).
II — por integrante de organização criminosa ou milícia privada.

SÍNTESE DA ESCADA PUNITIVA:
Art. 12 (posse, uso permitido): detenção 1-3 anos — NÃO hediondo.
Art. 14 (porte, uso permitido): reclusão 2-4 anos — NÃO hediondo.
Art. 16 (porte, uso restrito + adulterado): reclusão 3-6 anos — HEDIONDO.
Art. 17 (comércio ilegal): reclusão 4-8 anos — HEDIONDO.
Art. 18 (tráfico internacional): reclusão 8-16 anos — HEDIONDO.`,
    mnemonic: "Art. 16 = RESTRITO ou ADULTERADO = HEDIONDO (3-6 anos). Art. 20 = +metade se agente autorizado ou organização criminosa. Escada: 12→14→16→17→18 (detenção 1-3 → reclusão 2-4 → 3-6 → 4-8 → 8-16).",
    keyPoint: "Art. 16: reclusão 3-6 anos, hediondo — uso restrito OU numeração adulterada. Art. 20: aumento de metade para agentes autorizados (arts. 6-8) ou integrantes de organização criminosa/milícia. Arma com numeração raspada = art. 16 automaticamente.",
    practicalExample: "Policial militar flagrado com pistola .40 fora de serviço sem autorização = art. 16 (uso restrito, hediondo). Mesmo policial com arma de número raspado = art. 16 parágrafo único (hediondo). Se o policial estiver em organização criminosa = art. 20 → pena aumentada da metade. Cidadão com revólver .38 com número raspado = art. 16 parágrafo único (numeração adulterada — mesmo sendo calibre de uso permitido, a adulteração enquadra no art. 16).",
    difficulty: "DIFICIL",
  },
];

// ============================================
// QUESTÕES (12 — 2 por átomo)
// ============================================

const questions: QuestionData[] = [

  // ── Q1 — Posse vs Porte: distinção e penas (FACIL, MULTIPLA_ESCOLHA) ─────
  {
    id: "lpe_da_q01",
    statement: "Sobre a distinção entre a posse irregular (art. 12) e o porte ilegal (art. 14) de arma de fogo de uso permitido previstos na Lei 10.826/2003, assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "Ambos os crimes são punidos com reclusão, diferenciando-se apenas pela quantidade de armas envolvidas." },
      { letter: "B", text: "A posse irregular (art. 12), por ocorrer em local fixo (residência ou estabelecimento), tem pena de detenção de 1 a 3 anos; o porte ilegal (art. 14), que envolve trazer a arma consigo, tem pena mais grave — reclusão de 2 a 4 anos." },
      { letter: "C", text: "O porte ilegal é menos grave que a posse irregular, pois a mobilidade da arma reduz o tempo de exposição ao risco." },
      { letter: "D", text: "A distinção entre posse e porte depende exclusivamente da quantidade de munição encontrada com o agente." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A distinção fundamental entre os arts. 12 e 14 está no LOCAL onde a arma se encontra: posse (art. 12) = local fixo (casa ou estabelecimento), pena de detenção 1-3 anos; porte (art. 14) = trazer consigo em circulação, pena de reclusão 2-4 anos. O porte é mais grave por representar risco imediato nas vias e espaços públicos. Ambos são crimes de perigo abstrato.",
    explanationCorrect: "Correto! Art. 12 (POSSE) = local fixo + detenção 1-3 anos. Art. 14 (PORTE) = trazer consigo + reclusão 2-4 anos. O critério é a mobilidade da arma — não a quantidade de munição. Detenção < Reclusão em termos de gravidade.",
    explanationWrong: "O art. 12 (posse) tem pena de DETENÇÃO 1-3 anos; o art. 14 (porte) tem pena de RECLUSÃO 2-4 anos. A distinção é pelo local — fixo (posse) vs. trazer consigo (porte). Não é a quantidade de armas nem de munição que diferencia os tipos.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Arts. 12 e 14 — Posse Irregular vs Porte Ilegal de Arma de Fogo",
  },

  // ── Q2 — Arma desmuniciada (FACIL, CERTO_ERRADO) ─────────────────────────
  {
    id: "lpe_da_q02",
    statement: "Julgue o item conforme a Lei 10.826/2003 e a jurisprudência do STJ.\n\nA arma de fogo desmuniciada (sem munição) apreendida em posse de particular sem autorização NÃO configura os crimes dos arts. 12 ou 14 da Lei 10.826/2003, pois, sem munição, o artefato não representa perigo concreto e a tipicidade material fica afastada.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "ERRADO. O STJ consolidou o entendimento de que os crimes dos arts. 12 e 14 da Lei 10.826/2003 são de PERIGO ABSTRATO — a lei presume o perigo da conduta, independentemente de resultado concreto. Arma desmuniciada, mas em perfeito estado de funcionamento, configura o crime. Apenas a arma completamente INAPTA para disparo (defeituosa, quebrada de forma irremediável) pode afastar a tipicidade material, por ausência absoluta de perigo.",
    explanationCorrect: "O item está ERRADO. Crimes dos arts. 12 e 14 são de PERIGO ABSTRATO (STJ). Arma desmuniciada + apta para disparar = crime configurado. Não é necessária a presença de munição. Só a arma totalmente inapta para disparo pode afastar a tipicidade.",
    explanationWrong: "O item está ERRADO. O STJ firmou que posse e porte ilegal são crimes de perigo abstrato: a lei presume o perigo da conduta. Arma desmuniciada mas funcional = crime. Apenas arma completamente defeituosa (inapta para disparo) pode afastar a tipicidade — e essa é a exceção, não a regra.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Arts. 12 e 14 — Posse Irregular vs Porte Ilegal de Arma de Fogo",
  },

  // ── Q3 — Lista do art. 6º: quem pode portar (FACIL, MULTIPLA_ESCOLHA) ────
  {
    id: "lpe_da_q03",
    statement: "Conforme o art. 6º da Lei 10.826/2003, que traz lista TAXATIVA das pessoas autorizadas a possuir e portar arma de fogo, assinale a alternativa que indica pessoa NÃO incluída nessa lista:",
    alternatives: [
      { letter: "A", text: "Membro do Ministério Público Estadual no exercício de suas funções." },
      { letter: "B", text: "Integrante das Forças Armadas — Exército, Marinha e Aeronáutica." },
      { letter: "C", text: "Empresário que atua no setor de transporte de cargas e alega risco constante de assalto em razão da atividade profissional." },
      { letter: "D", text: "Policial civil reformado com habilitação técnica regular." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O art. 6º traz lista taxativa (numerus clausus). O empresário do setor de transporte de cargas comum NÃO está listado no art. 6º — o risco pessoal alegado não é critério legal para concessão de porte. Os incluídos no art. 6º são: FFAA (inc. I), policiais (inc. I), MP (inc. X), Judiciário (inc. XI), reformados (incs. VI e VII), entre outros. Apenas o transportador de valores devidamente habilitado (inc. IX) seria autorizado, não o transportador de cargas comuns.",
    explanationCorrect: "Correto! O empresário de transporte de cargas NÃO consta no art. 6º da Lei 10.826/03. MP (inc. X), FFAA (inc. I) e policiais reformados (inc. VI) estão expressamente listados. O risco pessoal isolado não autoriza o porte — a lista é taxativa.",
    explanationWrong: "O art. 6º é taxativo. O MP (inc. X), as FFAA (inc. I) e o policial reformado (inc. VI) estão expressamente incluídos. O empresário de transporte de cargas COMUM não está listado — apenas o transportador de valores com habilitação específica (inc. IX) tem essa autorização. Alegação de risco pessoal não basta.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Arts. 6º e 7º — Autorizados a Possuir e Portar Arma de Fogo",
  },

  // ── Q4 — Membros do MP e Judiciário no art. 6º (FACIL, CERTO_ERRADO) ─────
  {
    id: "lpe_da_q04",
    statement: "Julgue o item conforme o art. 6º da Lei 10.826/2003.\n\nOs membros do Ministério Público e do Poder Judiciário estão expressamente incluídos na lista taxativa do art. 6º da Lei 10.826/2003 como pessoas autorizadas a possuir e portar arma de fogo, em razão do risco inerente ao exercício dessas funções.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CERTO. O art. 6º, incisos X e XI, da Lei 10.826/2003 incluem expressamente os membros do Ministério Público (inc. X) e os membros do Poder Judiciário (inc. XI) na lista de pessoas autorizadas a possuir e portar arma de fogo. A autorização decorre do risco associado à persecução penal e à atividade jurisdicional.",
    explanationCorrect: "Correto! O art. 6º, inc. X (Ministério Público) e inc. XI (Poder Judiciário), autoriza expressamente essas categorias. O fato de não serem 'policiais' não impede — a lista vai além das forças de segurança, incluindo quem exerce funções com risco específico.",
    explanationWrong: "O item está CERTO. O art. 6º, incs. X e XI, da Lei 10.826/2003 inclui expressamente membros do MP e do Poder Judiciário. Essa é uma pegadinha comum: muitos pensam que apenas policiais e militares estão autorizados — mas a lista vai além e abrange promotores, procuradores e juízes.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Arts. 6º e 7º — Autorizados a Possuir e Portar Arma de Fogo",
  },

  // ── Q5 — Quais crimes são hediondos na Lei 10.826 (MEDIO, MULTIPLA_ESCOLHA)
  {
    id: "lpe_da_q05",
    statement: "Considerando a Lei 10.826/2003 e a Lei 8.072/90 (Lei dos Crimes Hediondos), assinale a alternativa que lista CORRETAMENTE os crimes do Estatuto do Desarmamento equiparados a hediondos:",
    alternatives: [
      { letter: "A", text: "Posse irregular (art. 12) e porte ilegal (art. 14), por representarem risco à segurança pública." },
      { letter: "B", text: "Todos os crimes da Lei 10.826/2003 são equiparados a hediondos, em razão do bem jurídico tutelado — a segurança pública." },
      { letter: "C", text: "Porte ilegal de arma de uso restrito (art. 16), comércio ilegal de arma de fogo (art. 17) e tráfico internacional de arma de fogo (art. 18)." },
      { letter: "D", text: "Apenas o tráfico internacional de arma de fogo (art. 18), por envolver crime transnacional organizado." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A Lei 8.072/90 lista os crimes equiparados a hediondos. Na Lei 10.826/2003, apenas os arts. 16, 17 e 18 são equiparados a hediondos. Os arts. 12 (posse irregular) e 14 (porte ilegal de arma de uso permitido) são crimes comuns — não são hediondos. Essa distinção é altamente cobrada: a hediondez está nos crimes de maior potencial lesivo (uso restrito, comércio e tráfico), não nos de menor gravidade.",
    explanationCorrect: "Correto! Hediondos na Lei 10.826: 16 (uso restrito/adulterado) + 17 (comércio ilegal) + 18 (tráfico internacional). Arts. 12 e 14 = crimes comuns (não hediondos). Muitos candidatos erram ao marcar o art. 14 como hediondo — não é.",
    explanationWrong: "Os arts. 12 e 14 da Lei 10.826/2003 NÃO são hediondos — são crimes comuns. Apenas os arts. 16, 17 e 18 são equiparados a hediondos pela Lei 8.072/90. A hediondez na lei de armas é restrita aos crimes de maior gravidade: uso restrito, comércio ilegal e tráfico internacional.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Crimes Hediondos e Equiparados na Lei 10.826/2003 — Arts. 16, 17 e 18",
  },

  // ── Q6 — Art. 14 não é hediondo (MEDIO, CERTO_ERRADO) ────────────────────
  {
    id: "lpe_da_q06",
    statement: "Julgue o item conforme a Lei 10.826/2003 e a Lei 8.072/1990.\n\nO porte ilegal de arma de fogo de uso PERMITIDO (art. 14 da Lei 10.826/2003) é equiparado a crime hediondo, razão pela qual ao condenado por tal delito são vedadas a concessão de anistia, graça e indulto.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "ERRADO. O art. 14 (porte ilegal de arma de USO PERMITIDO) NÃO é equiparado a hediondo. A Lei 8.072/90 equipara a hediondos apenas os arts. 16 (uso restrito), 17 (comércio ilegal) e 18 (tráfico internacional) da Lei 10.826/2003. O art. 14 é crime comum, sujeito às regras gerais de cumprimento de pena — sem as vedações dos hediondos.",
    explanationCorrect: "O item está ERRADO — e essa é a pegadinha mais cobrada do Estatuto do Desarmamento. Hediondos: arts. 16, 17 e 18. Crimes comuns: arts. 12 e 14. O art. 14 (uso PERMITIDO) não tem hediondez. Só o art. 16 (uso RESTRITO) é hediondo no âmbito do porte.",
    explanationWrong: "O item está ERRADO. O porte ilegal do art. 14 (arma de USO PERMITIDO) é crime COMUM — não é hediondo. Apenas arts. 16 (uso restrito/adulterado), 17 (comércio ilegal) e 18 (tráfico internacional) são equiparados a hediondos. Confundir art. 14 com art. 16 é o erro mais frequente nessa matéria.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Crimes Hediondos e Equiparados na Lei 10.826/2003 — Arts. 16, 17 e 18",
  },

  // ── Q7 — Art. 17 vs Art. 18: penas e distinção (MEDIO, MULTIPLA_ESCOLHA) ─
  {
    id: "lpe_da_q07",
    statement: "Sobre o comércio ilegal (art. 17) e o tráfico internacional (art. 18) de arma de fogo previstos na Lei 10.826/2003, assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "Os dois crimes têm a mesma pena (reclusão de 4 a 8 anos), diferenciando-se apenas pelo elemento transnacional do art. 18." },
      { letter: "B", text: "O comércio ilegal (art. 17) tem pena de reclusão de 4 a 8 anos; o tráfico internacional (art. 18) tem pena de reclusão de 8 a 16 anos — dobro do anterior. Ambos são equiparados a hediondos." },
      { letter: "C", text: "O comércio ilegal (art. 17) é crime comum; apenas o tráfico internacional (art. 18) é equiparado a hediondo, por envolver organização criminosa transnacional." },
      { letter: "D", text: "O tráfico internacional (art. 18) é crime de menor potencial ofensivo quando a quantidade de armas for inferior a 5 unidades, sendo julgado pelo Juizado Especial Criminal." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O art. 17 (comércio ilegal) tem pena de reclusão de 4 a 8 anos, e o art. 18 (tráfico internacional) tem pena de reclusão de 8 a 16 anos — exatamente o dobro. Ambos são equiparados a hediondos pela Lei 8.072/90. A transnacionalidade do art. 18 justifica a pena maior. Não existe critério de quantidade de armas para reduzir a gravidade do tráfico internacional.",
    explanationCorrect: "Correto! Art. 17 = comércio INTERNO, reclusão 4-8 anos, hediondo. Art. 18 = tráfico INTERNACIONAL, reclusão 8-16 anos (dobro), hediondo. A pena dobrada reflete a gravidade da transnacionalidade. Ambos são hediondos — sem exceção por quantidade.",
    explanationWrong: "Art. 17 e art. 18 têm penas DIFERENTES: art. 17 = 4-8 anos; art. 18 = 8-16 anos (dobro). AMBOS são hediondos — não apenas o art. 18. Não existe critério de quantidade que reduza a gravidade do tráfico internacional. Erro clássico: igualar as penas dos dois artigos.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Arts. 17 e 18 — Comércio Ilegal e Tráfico Internacional de Arma de Fogo",
  },

  // ── Q8 — Venda sem fins de lucro configura art. 17 (MEDIO, CERTO_ERRADO) ─
  {
    id: "lpe_da_q08",
    statement: "Julgue o item conforme a Lei 10.826/2003.\n\nA conduta de ceder gratuitamente (sem fins de lucro) arma de fogo de uso permitido a terceiro, sem autorização legal, configura o crime de comércio ilegal de arma de fogo (art. 17 da Lei 10.826/2003), equiparado a crime hediondo.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CERTO. O art. 17 da Lei 10.826/2003 inclui expressamente entre as condutas o ato de 'ceder, dar, emprestar' arma de fogo sem autorização. O tipo não exige finalidade lucrativa — a cessão gratuita também configura o crime. Assim, mesmo uma doação de arma sem fins comerciais, feita sem autorização legal, enquadra-se no art. 17 (comércio ilegal), que é equiparado a hediondo.",
    explanationCorrect: "Correto! O art. 17 abrange 'ceder, dar, emprestar' — a cessão gratuita também configura o tipo. Não é preciso finalidade de lucro. A hediondez se aplica igualmente. Esse ponto pega candidatos desatentos que pensam que 'comércio' exige transação onerosa.",
    explanationWrong: "O item está CERTO. O art. 17 da Lei 10.826/2003 enumera 'ceder, dar, emprestar' entre as condutas — independentemente de lucro. O nome 'comércio ilegal' não exige que haja venda com dinheiro: a cessão gratuita de arma sem autorização também se enquadra no art. 17, com pena de reclusão 4-8 anos e natureza hedionda.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Arts. 17 e 18 — Comércio Ilegal e Tráfico Internacional de Arma de Fogo",
  },

  // ── Q9 — SINARM vs SIGMA (MEDIO, MULTIPLA_ESCOLHA) ───────────────────────
  {
    id: "lpe_da_q09",
    statement: "Sobre o SINARM (Sistema Nacional de Armas) e o SIGMA (Sistema de Gerenciamento Militar de Armas) previstos na Lei 10.826/2003, assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "O SINARM é administrado pelo Exército Brasileiro e controla as armas de uso restrito; o SIGMA é administrado pela Polícia Federal e controla as armas de uso permitido para civis." },
      { letter: "B", text: "O SINARM é administrado pela Polícia Federal e tem por objeto as armas de uso permitido; o SIGMA é administrado pelo Exército Brasileiro e controla as armas de uso restrito." },
      { letter: "C", text: "Tanto SINARM quanto SIGMA são administrados pela Polícia Federal, diferenciando-se pelo âmbito: SINARM atua no nível federal e SIGMA nos Estados." },
      { letter: "D", text: "O SINARM foi criado exclusivamente para controlar armas de policiais civis e federais; o SIGMA controla apenas armas do Exército Brasileiro." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "SINARM: administrado pela POLÍCIA FEDERAL — controla armas de USO PERMITIDO (para civis e pessoas autorizadas). SIGMA: administrado pelo EXÉRCITO BRASILEIRO — controla armas de USO RESTRITO (militares e forças de segurança). A troca dos administradores é a armadilha clássica: PF-SINARM-PERMITIDO vs. EXÉRCITO-SIGMA-RESTRITO.",
    explanationCorrect: "Correto! SINARM (PF) → uso permitido (civis). SIGMA (Exército) → uso restrito (militares). A lógica: a Polícia Federal cuida do controle civil; o Exército cuida do armamento de uso exclusivo de militares e policiais especializados.",
    explanationWrong: "A associação correta é: SINARM → Polícia Federal → uso PERMITIDO; SIGMA → Exército → uso RESTRITO. A inversão dos administradores é a pegadinha mais cobrada sobre esse tema. Ambos foram criados pela mesma Lei 10.826/2003 com competências distintas e complementares.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "SINARM e SIGMA — Sistemas de Controle de Armas na Lei 10.826/2003",
  },

  // ── Q10 — SINARM = PF + uso permitido (MEDIO, CERTO_ERRADO) ─────────────
  {
    id: "lpe_da_q10",
    statement: "Julgue o item conforme a Lei 10.826/2003.\n\nO SINARM (Sistema Nacional de Armas), administrado pela Polícia Federal, é responsável pelo registro, cadastramento e rastreamento das armas de fogo de uso PERMITIDO em todo o território nacional, enquanto o controle das armas de uso RESTRITO compete ao SIGMA, gerenciado pelo Exército Brasileiro.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CERTO. Essa é a divisão prevista na Lei 10.826/2003: SINARM (Polícia Federal) = uso permitido; SIGMA (Exército) = uso restrito. O SINARM identifica, registra e rastreia armas de uso civil (uso permitido). O SIGMA faz o mesmo para armamento de uso restrito, que envolve militares, forças policiais especializadas e arsenais institucionais.",
    explanationCorrect: "Correto! SINARM (PF) = uso permitido. SIGMA (Exército) = uso restrito. Essa divisão é a base do controle de armas no Brasil prevista na Lei 10.826/2003. A questão reproduz fielmente o texto e a lógica da lei.",
    explanationWrong: "O item está CERTO. SINARM (Polícia Federal) controla armas de USO PERMITIDO; SIGMA (Exército) controla armas de USO RESTRITO. Essa é a divisão expressa na Lei 10.826/2003. Confundir a administração dos sistemas é o erro mais frequente dos candidatos.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "SINARM e SIGMA — Sistemas de Controle de Armas na Lei 10.826/2003",
  },

  // ── Q11 — Art. 16: uso restrito + numeração adulterada (DIFICIL, MULTIPLA) ─
  {
    id: "lpe_da_q11",
    statement: "Um agente de segurança privada, fora de sua jornada de trabalho, é abordado em via pública portando revólver calibre .38 (arma de uso permitido) com o número de série completamente adulterado. Considerando a Lei 10.826/2003, o enquadramento penal CORRETO é:",
    alternatives: [
      { letter: "A", text: "Art. 14 (porte ilegal de arma de uso permitido) — pena de reclusão de 2 a 4 anos, crime comum." },
      { letter: "B", text: "Art. 16, parágrafo único (porte de arma com numeração adulterada) — pena de reclusão de 3 a 6 anos, crime equiparado a hediondo." },
      { letter: "C", text: "Art. 12 (posse irregular) — pena de detenção de 1 a 3 anos, pois o agente tem vínculo com atividade de segurança." },
      { letter: "D", text: "Nenhum crime, pois o agente de segurança está autorizado pelo art. 6º da Lei 10.826/2003 a portar a arma mesmo fora do serviço." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A numeração adulterada ou suprimida enquadra a conduta no art. 16, parágrafo único, da Lei 10.826/2003 — INDEPENDENTEMENTE do calibre da arma. Ainda que o calibre .38 seja de uso permitido, a adulteração do número de série agrava o enquadramento para o art. 16 (reclusão 3-6 anos, hediondo). O agente de segurança privada fora de serviço também não tem autorização para porte nessa situação.",
    explanationCorrect: "Correto! A numeração adulterada é determinante: mesmo arma de uso permitido com número raspado = art. 16 parágrafo único (hediondo, 3-6 anos). Não é o calibre que define o art. 16 — a adulteração do serial é suficiente para qualificar o crime. Agente fora de serviço sem autorização específica = sem licença.",
    explanationWrong: "A numeração adulterada define o art. 16 parágrafo único — independentemente do calibre. Revólver .38 (uso permitido) com número de série raspado = art. 16 (hediondo), e não art. 14 (crime comum). Essa é a distinção crucial: o que importa não é apenas o calibre, mas também a integridade do número de série da arma.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Art. 16 e Arts. 19-20 — Uso Restrito, Numeração Adulterada e Causas de Aumento",
  },

  // ── Q12 — Art. 20: aumento para agentes autorizados (DIFICIL, CERTO_ERRADO)
  {
    id: "lpe_da_q12",
    statement: "Julgue o item conforme o art. 20 da Lei 10.826/2003.\n\nAs penas dos crimes previstos nos arts. 14, 15, 16, 17 e 18 da Lei 10.826/2003 são aumentadas da metade quando praticados por integrante dos órgãos e empresas referidos nos arts. 6º, 7º e 8º da mesma lei — ou seja, exatamente pelas pessoas que, em razão da função, deveriam zelar pelo uso legal das armas.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CERTO. O art. 20 da Lei 10.826/2003 prevê causa obrigatória de aumento de pena da metade quando os crimes dos arts. 14, 15, 16, 17 e 18 forem praticados por integrante dos órgãos autorizados a portar armas (arts. 6º, 7º e 8º). A lógica punitiva é clara: quem tem o privilégio legal de portar arma e o usa para cometer crime merece punição agravada. A majorante não se aplica ao art. 12 (posse irregular).",
    explanationCorrect: "Correto! O art. 20 impõe aumento de metade para crimes dos arts. 14-18 praticados por agentes autorizados (arts. 6-8). A justificativa: o agente que deveria garantir o uso legal das armas praticou o crime — violação de confiança que o legislador quis punir mais severamente. Atenção: a majorante abrange arts. 14 a 18, mas NÃO o art. 12.",
    explanationWrong: "O item está CERTO. O art. 20 da Lei 10.826/2003 prevê aumento da metade quando os crimes dos arts. 14, 15, 16, 17 e 18 forem praticados por integrantes das categorias dos arts. 6º, 7º e 8º — policiais, militares, agentes de segurança e outros autorizados. É o princípio do agravamento pela traição à confiança legal.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Art. 16 e Arts. 19-20 — Uso Restrito, Numeração Adulterada e Causas de Aumento",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n🔫  Seed R27: Legislação Penal Especial — Estatuto do Desarmamento (Lei 10.826/2003)\n");

  // ── 1. Encontrar Subject ────────────────────────────────────────────────
  let subjectId = await findSubject("LEGISLACAO_ESPECIAL");
  if (!subjectId) subjectId = await findSubject("Legisla");
  if (!subjectId) subjectId = await findSubject("Especial");
  if (!subjectId) subjectId = await findSubject("Penal Especial");
  if (!subjectId) {
    console.error("❌ Subject para Legislação Penal Especial não encontrado.");
    console.error("   Tentativas: 'LEGISLACAO_ESPECIAL', 'Legisla', 'Especial', 'Penal Especial'.");
    console.error("   Verifique o nome do subject no banco e ajuste o findSubject acima.");
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

  // ── 4. Encontrar ou criar Tópico ────────────────────────────────────────
  const topicId = await findOrCreateTopic("Estatuto do Desarmamento — Lei 10.826/2003", subjectId);
  console.log(`✅ Tópico: ${topicId}`);

  // ── 5. Inserir Conteúdos ────────────────────────────────────────────────
  const contentIdMap: Record<string, string> = {};
  let contentCreated = 0, contentSkipped = 0;

  console.log("\n📚 Inserindo conteúdos...");
  for (const c of contents) {
    if (await contentExists(c.title, subjectId)) {
      const existingId = await getContentId(c.title, subjectId);
      if (existingId) contentIdMap[c.title] = existingId;
      console.log(`  ⏭  Conteúdo já existe: ${c.title}`);
      contentSkipped++;
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
    console.log(`  ✅ Conteúdo criado: ${c.title} (${c.id})`);
    contentCreated++;
  }

  // ── 6. Inserir Questões ─────────────────────────────────────────────────
  let questionCreated = 0, questionSkipped = 0;

  console.log("\n❓ Inserindo questões...");
  for (const q of questions) {
    if (await questionExists(q.id)) {
      console.log(`  ⏭  Questão já existe: ${q.id}`);
      questionSkipped++;
      continue;
    }

    const contentId = contentIdMap[q.contentTitle];
    if (!contentId) {
      console.warn(`  ⚠️  contentId não encontrado para questão ${q.id}: '${q.contentTitle}'`);
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
        ${q.explanation}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${subjectId}, ${topicId}, ${contentId},
        true, ${q.difficulty},
        0, ${q.questionType},
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Questão criada: ${q.id} (${q.difficulty})`);
    questionCreated++;
  }

  // ── 7. Backfill de segurança — questões sem contentId no tópico ────────
  // Garante que questões já existentes no tópico sem contentId recebam
  // ao menos o primeiro conteúdo do tópico (evita orphan questions).
  const fallbackRows = await db.execute(sql`
    SELECT id FROM "Content" WHERE "topicId" = ${topicId} ORDER BY "createdAt" LIMIT 1
  `) as any[];

  if (fallbackRows[0]?.id) {
    const fallbackContentId = fallbackRows[0].id;
    const result = await db.execute(sql`
      UPDATE "Question" SET "contentId" = ${fallbackContentId}
      WHERE "topicId" = ${topicId} AND "contentId" IS NULL
    `) as any;
    const updated = result.rowCount ?? result.count ?? 0;
    if (updated > 0) {
      console.log(`\n  🔧 Backfill contentId: ${updated} questão(ões) → primeiro conteúdo do tópico (${fallbackContentId})`);
    }
  }

  // ── Relatório Final ──────────────────────────────────────────────────────
  console.log("\n─────────────────────────────────────────────────────────");
  console.log(`📚 Conteúdos: ${contentCreated} criados, ${contentSkipped} já existiam`);
  console.log(`❓ Questões:  ${questionCreated} criadas,  ${questionSkipped} já existiam`);
  console.log("─────────────────────────────────────────────────────────");
  console.log("✅ Seed R27 — Estatuto do Desarmamento (Lei 10.826/2003) concluído!\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed R27 falhou:", err);
  process.exit(1);
});
