/**
 * Seed: Direito Administrativo — R16 — COMFI: Elementos Aprofundados
 * (Competência, Finalidade, Forma, Motivo, Objeto e Vícios Integrados)
 *
 * Rodada 16 — aprofundamento individual em cada elemento do ato administrativo.
 * Complementa o F7 (visão geral de Atos Adm.) com análise precisa de cada COMFI.
 *
 * Popula 6 átomos de Conteúdo + 12 Questões.
 * Idempotente: verifica existência antes de inserir.
 * TODAS as questões têm "contentId" vinculado ao átomo correto.
 *
 * Execução:
 *   npx tsx db/seed-admin-atos-r16.ts
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
  // ── 1. Competência ─────────────────────────────────────────────────────
  {
    title: "Competência no Ato: Delegação, Avocação e Vícios de Competência",
    textContent: `Competência é o poder legal conferido ao agente para praticar o ato administrativo. Características: (1) OBRIGATÓRIA — deve ser exercida quando presentes os pressupostos legais; (2) IRRENUNCIÁVEL — não pode ser abdicada; (3) IMPRORROGÁVEL — o agente incompetente não adquire competência pelo silêncio; (4) pode ser DELEGADA ou AVOCADA.

DELEGAÇÃO (art. 12, Lei 9.784/99): o superior transfere a subordinado ou a outro órgão o EXERCÍCIO de parte de suas atribuições. O delegante MANTÉM a titularidade da competência e pode avocar a qualquer momento. O ato é expedido em nome do delegado. Competência EXCLUSIVA não pode ser delegada (art. 13).

AVOCAÇÃO (art. 15): o superior chama para si, TEMPORARIAMENTE, a competência do subordinado. Deve ser MOTIVADA e EXCEPCIONAL — somente quando presentes razões relevantes de interesse público.

VÍCIOS DE COMPETÊNCIA:
- Excesso de poder: agente competente ultrapassa os limites legais (ex.: multar além do teto).
- Usurpação de função: agente sem qualquer investidura pratica o ato → nulidade absoluta.
- Função de fato: agente irregularmente investido — atos preservados para terceiros de boa-fé.
- Incompetência relativa: agente público com competência diversa da exigida → convalidável.`,
    mnemonic: "COMP = quem age. DELEG = dou exercício para baixo (conservo titularidade). AVOC = puxo para cima (excepcional + motivada). EXCL = intransferível. EXCESSO = tinha competência, mas abusou. USURP = não tinha competência alguma.",
    keyPoint: "Delegação transfere EXERCÍCIO, não titularidade. Competência exclusiva = intransferível. Usurpação = nulidade absoluta. Função de fato = atos preservados para terceiros de boa-fé. Avocação: excepcional + motivada + temporária.",
    practicalExample: "Delegado Regional delega a Seccional assinar termos de ajuste (válido — não exclusivo). Seccional multa 10× acima do limite legal → excesso de poder. Cidadão se passa por agente federal → usurpação de função, ato nulo. Superior avoca investigação do subordinado por conflito de interesse → válido se motivado.",
    difficulty: "FACIL",
  },
  // ── 2. Finalidade ──────────────────────────────────────────────────────
  {
    title: "Finalidade do Ato Administrativo e Desvio de Poder",
    textContent: `Finalidade é o resultado que o ato deve produzir no interesse público. Divide-se em:
(a) Finalidade GENÉRICA: sempre o interesse público — exigida em todo ato administrativo.
(b) Finalidade ESPECÍFICA: a que a lei determina para cada tipo de ato. Ex.: poder de polícia → proteger ordem pública, não arrecadar; remoção de servidor → interesse do serviço.

DESVIO DE FINALIDADE (desvio de poder): ocorre quando o agente pratica ato com finalidade diferente da prevista em lei — ainda que a finalidade perseguida seja nominalmente "pública". É vício de LEGALIDADE, tornando o ato anulável. Geralmente subjetivo (intenção do agente), prova-se por indícios e circunstâncias.

CONTROLE JUDICIAL: o Judiciário PODE anular ato administrativo por desvio de finalidade — trata-se de vício de legalidade (não de mérito). Entendimento consolidado no STF e STJ.

EXEMPLOS CLÁSSICOS: remoção de servidor por represália (pretexto: necessidade do serviço); desapropriação de terreno de opositor (pretexto: utilidade pública); multa de trânsito para arrecadar, não para sancionar infrator.`,
    mnemonic: "FINAL = para quê? Sempre PÚBLICO. Específica = qual público a lei manda? DESVIO = ato com rosto limpo mas coração corrupto. Vício de LEGALIDADE → Judiciário pode anular.",
    keyPoint: "Desvio de finalidade: ato formalmente perfeito, mas com fim ilícito oculto. É vício de legalidade (não de mérito) → Judiciário controla. Distinção: finalidade específica errada = desvio de poder. Boa intenção não sana o vício.",
    practicalExample: "Prefeito remove servidor crítico do governo para zona rural 'por necessidade de serviço' → desvio: verdadeira finalidade é represália. Desapropriação de lote de adversário político como 'utilidade pública' sem interesse real → desvio de finalidade, ato anulável pelo Judiciário.",
    difficulty: "FACIL",
  },
  // ── 3. Forma ───────────────────────────────────────────────────────────
  {
    title: "Forma do Ato Administrativo: Exigência, Publicidade e Motivação",
    textContent: `Forma é o modo de exteriorização da vontade administrativa. REGRA: forma escrita (segurança jurídica, controle, arquivo). EXCEÇÕES: forma verbal (ordem de policial em emergência), simbólica (sinalização de trânsito).

PUBLICIDADE: condição de EFICÁCIA do ato, não de validade. O ato existe e é válido desde a assinatura; produz efeitos somente após publicação.
- Atos gerais (abstratos): publicação no Diário Oficial.
- Atos individuais (concretos): notificação/intimação pessoal.

MOTIVAÇÃO: dever de explicitar os motivos de fato e de direito. Lei 9.784/99, art. 50 — obrigatória nos atos que: (i) neguem, limitem ou afetem direitos; (ii) imponham deveres, encargos ou sanções; (iii) decidam recursos administrativos; (iv) discrepem de pareceres ou laudos técnicos. Falta de motivação quando obrigatória = vício de FORMA (não de motivo).

MOTIVAÇÃO ≠ MOTIVO: motivação é a exteriorização (forma de registrar o motivo); motivo é a causa do ato. Ausência de motivação: vício de forma. Motivo inexistente: vício de motivo.

CONVALIDAÇÃO DA FORMA: possível quando a forma não é essencial ao ato. Ex.: portaria em vez de decreto, se ambos produzem o mesmo efeito legal.`,
    mnemonic: "FORMA = como aparece. Escrita = regra. PUBLICAÇÃO = eficácia (não validade). MOTIVAÇÃO = transparência do motivo. Falta de motivação obrigatória = vício de FORMA. Motivação ≠ Motivo: exteriorização vs causa.",
    keyPoint: "Publicidade → eficácia (não validade). Ato não publicado: válido + ineficaz. Motivação: obrigatória nos atos restritivos (art. 50, L. 9.784/99). Falta de motivação = vício de forma. Falta de motivo = vício de motivo. Convalidável quando forma não essencial.",
    practicalExample: "Portaria ministerial assinada mas não publicada no DOU: válida, mas ineficaz — ninguém é obrigado a cumpri-la. Demissão em memorando informal sem PAD → vício de forma essencial → anulação. Portaria em vez de instrução normativa para matéria menor → vício de forma não essencial → convalidável.",
    difficulty: "FACIL",
  },
  // ── 4. Motivo ──────────────────────────────────────────────────────────
  {
    title: "Motivo do Ato: Pressuposto Fático, Jurídico e Teoria dos Motivos Determinantes",
    textContent: `Motivo é a situação de fato (pressuposto fático) e o fundamento legal (pressuposto jurídico) que autorizam a prática do ato administrativo.

PRESSUPOSTO FÁTICO: a situação concreta que ensejou o ato (ex.: infração praticada pelo servidor; risco à saúde pública verificado pela fiscalização).
PRESSUPOSTO JURÍDICO: a norma que, aplicada ao fato, autoriza o ato (ex.: lei que prevê a penalidade; artigo que prevê a interdição).

MOTIVO ≠ MOTIVAÇÃO:
- Motivo = elemento do ato (a causa, a razão de ser).
- Motivação = exteriorização dos motivos na forma do ato (como se registra o motivo).
Ausência de motivação quando obrigatória = vício de FORMA.
Motivo inexistente = vício de MOTIVO.

ATOS VINCULADOS: motivo predefinido em lei → ausência ou falsidade do fato = nulidade.
ATOS DISCRICIONÁRIOS: o agente avalia o fato com margem de conveniência/oportunidade.

TEORIA DOS MOTIVOS DETERMINANTES: os motivos declarados vinculam a validade do ato, mesmo que a lei não exigisse motivação. Se o motivo declarado for falso ou inexistente → ato ANULADO. Aplica-se inclusive a cargos ad nutum (livre exoneração) — ao motivar, a Administração vincula-se.

VÍCIO DE MOTIVO: insanável — não admite convalidação.`,
    mnemonic: "MOTIVO = FATO + LEI. MOTIVO ≠ MOTIVAÇÃO (causa vs. registro). Teoria: motivo DECLARADO vira grilhão — falso = anulação. Cargo ad nutum: sem motivar = livre; motivando = vinculou. Vício de motivo = INSANÁVEL.",
    keyPoint: "Motivo (elemento) ≠ Motivação (exteriorização). Teoria dos Motivos Determinantes aplica-se mesmo a atos ad nutum — se declarou, vinculou. Vício de motivo é INSANÁVEL (não convalidável). Ausência de motivação obrigatória = vício de forma.",
    practicalExample: "Auto de infração: pressuposto fático = infração; pressuposto jurídico = CTB. Sem infração real = vício de motivo → nulo. Exoneração 'por reestruturação' quando nenhuma reestruturação ocorreu → motivo fictício → anulação (Teoria dos Motivos Determinantes). Cargo comissionado: ao declarar 'comportamento inadequado' como motivo, a Administração ficou vinculada — motivo falso → anulação.",
    difficulty: "MEDIO",
  },
  // ── 5. Objeto ──────────────────────────────────────────────────────────
  {
    title: "Objeto do Ato Administrativo: Conteúdo, Requisitos e Vícios Insanáveis",
    textContent: `Objeto (conteúdo) é o efeito jurídico imediato que o ato produz — o QUE o ato faz. Distinção importante: objeto = efeito imediato; finalidade = objetivo mediato (interesse público perseguido).

REQUISITOS DO OBJETO (todos obrigatórios):
(1) LÍCITO: não pode contrariar a lei ou a moral administrativa — aplica-se a TODOS os atos, inclusive discricionários.
(2) POSSÍVEL: física e juridicamente realizável.
(3) DETERMINADO ou DETERMINÁVEL: suficientemente específico para identificação.

ATOS VINCULADOS: objeto predeterminado por lei — o agente não tem escolha sobre o conteúdo.
ATOS DISCRICIONÁRIOS: objeto é o espaço do mérito — o agente escolhe DENTRO do que a lei permite. Mas NUNCA pode escolher objeto ilícito.

VÍCIOS DE OBJETO:
- Objeto ilícito: contraria lei ou moral → nulidade absoluta.
- Objeto impossível: física ou juridicamente inviável → nulidade.
- Objeto indeterminado: não especifica o bem, pessoa ou situação → nulidade.

INSANABILIDADE: vícios de objeto são SEMPRE INSANÁVEIS — nunca admitem convalidação. Esta é a diferença fundamental em relação aos vícios de competência e forma (que podem ser convalidados).`,
    mnemonic: "OBJETO = o QUE o ato FAZ. 3 requisitos: Lícito + Possível + Determinado (LPD). Vício de objeto = INSANÁVEL. OBJETO ≠ FINALIDADE: efeito imediato vs. objetivo final.",
    keyPoint: "Vício de objeto = insanável (convalidação jamais possível). Objeto sempre deve ser lícito — mesmo em atos discricionários. A distinção objeto × finalidade é cobrada em provas de alto nível. Objeto ilícito = nulidade absoluta, independentemente de motivação ou interesse público declarado.",
    practicalExample: "Alvará para cassino: objeto ilícito (cassino proibido no Brasil) → ato nulo, insanável. Decreto 'construir viaduto em 1 dia' → objeto fisicamente impossível. Portaria de desapropriação sem especificar o imóvel → objeto indeterminado. Interdição de restaurante insalubre: objeto = proibir funcionamento (efeito imediato); finalidade = proteger saúde pública (objetivo mediato).",
    difficulty: "MEDIO",
  },
  // ── 6. Vícios Integrados ───────────────────────────────────────────────
  {
    title: "Quadro de Vícios dos Atos Administrativos por Elemento COMFI",
    textContent: `Cada elemento do ato possui vícios específicos com consequências distintas. Dominar esse quadro é essencial para provas CEBRASPE/CESPE:

COMPETÊNCIA (quem pratica):
- Vícios: excesso de poder; usurpação de função; função de fato; incompetência relativa.
- Consequência: anulável. CONVALIDÁVEL (salvo competência exclusiva ou usurpação de função).
- Usurpação de função = nulidade absoluta (agente sem qualquer investidura legal).
- Função de fato: atos preservados para terceiros de boa-fé.

OBJETO (o que o ato faz):
- Vícios: objeto ilícito; objeto impossível; objeto indeterminado.
- Consequência: nulidade absoluta. INSANÁVEL — nunca admite convalidação.

MOTIVO (por quê foi praticado):
- Vícios: pressuposto fático inexistente; inadequação fato-norma; fundamento jurídico ilegal.
- Consequência: anulável. INSANÁVEL.

FINALIDADE (para quê):
- Vícios: desvio de poder; desvio de finalidade específica.
- Consequência: anulável. INSANÁVEL.

FORMA (como se exterioriza):
- Vícios: forma inadequada; falta de publicação essencial; ausência de motivação obrigatória.
- Consequência: anulável. CONVALIDÁVEL quando forma não é essencial ao ato.

REGRA OURO — CONVALIDAÇÃO (mnemônico CoFo vs. OMF):
✅ CoFo = CONVALIDÁVEL: Competência (salvo exclusiva) + Forma (quando não essencial).
❌ OMF = INSANÁVEL: Objeto + Motivo + Finalidade → só ANULAÇÃO.`,
    mnemonic: "CoFo = Convalida (Competência + Forma não essencial). OMF = Anula (Objeto + Motivo + Finalidade). Usurpação = nulo absoluto (o pior dos casos). Função de fato = preserva para boa-fé.",
    keyPoint: "O quadro COMFI × convalidação é cobrado diretamente em provas. Nunca confundir: convalidação só para CoFo. OMF = anulação compulsória. Usurpação de função = nulidade absoluta (nem convalidável). Efeitos da convalidação: ex-tunc (retroativos).",
    practicalExample: "Portaria em vez de decreto (forma não essencial) → convalidável (CoFo-Forma). Licença para atividade proibida por lei (objeto ilícito) → anulação compulsória (OMF-Objeto). Delegado irregular expede alvará (função de fato) → alvará preservado para empresário de boa-fé. Desapropriação com motivo falso → anulação (OMF-Motivo).",
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
  correctAnswer: string;
  correctOption: number;
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  questionType: "CERTO_ERRADO" | "MULTIPLA_ESCOLHA";
  contentTitle: string;
}

const questions: QuestionData[] = [
  // ── Q1 — Delegação de competência (FACIL, MULTIPLA_ESCOLHA) ─────────────
  {
    id: "qz_dadm_comfi_001",
    statement: "Sobre a delegação de competência no Direito Administrativo, assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "A delegação transfere definitivamente a titularidade da competência ao delegado, que passa a exercê-la com exclusividade, sem que o delegante possa retomá-la." },
      { letter: "B", text: "O delegante conserva sua competência e pode avocar o ato a qualquer tempo, restituindo o exercício a si próprio." },
      { letter: "C", text: "A competência exclusiva pode ser delegada em caráter excepcional, desde que motivada e autorizada por lei expressa." },
      { letter: "D", text: "A avocação é uma espécie de delegação ascendente, pela qual o subordinado voluntariamente transfere sua competência ao superior." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A delegação (art. 12, L. 9.784/99) transfere o EXERCÍCIO de atribuições, não a titularidade. O delegante mantém a competência e pode avocar (retomar) a qualquer momento. Competência EXCLUSIVA não pode ser delegada (art. 13, L. 9.784/99). Avocação (art. 15) é o ato pelo qual o SUPERIOR chama para si a competência do subordinado — é do superior para o delegado, não o contrário.",
    explanationCorrect: "Correto! Delegação transfere exercício (não titularidade). O delegante mantém a competência e pode avocar a qualquer momento. Essa distinção titularidade vs. exercício é o núcleo do tema.",
    explanationWrong: "Delegação ≠ transferência de titularidade. Competência exclusiva não pode ser delegada. Avocação é o superior retomando competência do subordinado — não é delegação ascendente. O delegante sempre conserva sua competência.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Competência no Ato: Delegação, Avocação e Vícios de Competência",
  },
  // ── Q2 — Avocação é excepcional (FACIL, CERTO_ERRADO) ──────────────────
  {
    id: "qz_dadm_comfi_002",
    statement: "Julgue o item conforme a Lei 9.784/99 e a doutrina administrativa.\n\nA avocação de competência pelo superior hierárquico é medida ordinária de gestão que pode ser utilizada livremente, sem necessidade de motivação, sempre que o superior entender conveniente centralizar decisões.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "ERRADO. A avocação (art. 15, L. 9.784/99) é medida EXCEPCIONAL — deve ser motivada e ocorrer apenas quando presentes razões relevantes de interesse público. A lei exige caráter temporário e motivação expressa. Avocação para centralização rotineira sem motivação é abuso de poder.",
    explanationCorrect: "O item está ERRADO. Avocação = excepcional + motivada + temporária (art. 15, L. 9.784/99). Não é gestão ordinária nem pode ser usada livremente sem justificativa.",
    explanationWrong: "O item está ERRADO. Avocação NÃO é medida ordinária — é excepcional, motivada e temporária. Avocação rotineira para centralizar decisões viola o art. 15 da Lei 9.784/99.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Competência no Ato: Delegação, Avocação e Vícios de Competência",
  },
  // ── Q3 — Desvio de finalidade (FACIL, MULTIPLA_ESCOLHA) ─────────────────
  {
    id: "qz_dadm_comfi_003",
    statement: "Um Delegado de Polícia transfere servidor de destaque para função de arquivo, declarando publicamente que o faz para 'protegê-lo de atritos com colegas'. Considerando os elementos do ato administrativo, a remoção configura:",
    alternatives: [
      { letter: "A", text: "Ato válido, pois a finalidade declarada é protetora e, portanto, de interesse público." },
      { letter: "B", text: "Ato válido, pois o Delegado tem competência para remover servidores." },
      { letter: "C", text: "Ato com desvio de finalidade: a remoção deve visar ao interesse do serviço, não à proteção interpessoal do servidor." },
      { letter: "D", text: "Ato com vício de competência: remoção é ato exclusivo da Direção-Geral da PF." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A remoção de servidor tem finalidade específica legal: atender ao interesse do serviço público. Usar a remoção para proteger o servidor de desgastes interpessoais, mesmo com boa intenção, configura desvio de finalidade — a finalidade legal do tipo de ato não foi observada. A declaração pública do motivo ilícito facilita a prova do desvio. Vício de finalidade → anulável.",
    explanationCorrect: "Correto! Desvio de finalidade: ato com finalidade diferente da prevista em lei para aquele tipo de ato. Remoção serve ao interesse do serviço — não à proteção interpessoal. Boa intenção não sana o vício.",
    explanationWrong: "Competência do Delegado pode existir, mas não garante validade se a finalidade for desviada. O vício está na FINALIDADE. Desvio de finalidade = ato formalmente competente, mas com objetivo diferente do legal. A 'boa intenção' não é critério — o que importa é a finalidade legal do tipo de ato.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Finalidade do Ato Administrativo e Desvio de Poder",
  },
  // ── Q4 — Judiciário controla desvio de finalidade (FACIL, CERTO_ERRADO) ──
  {
    id: "qz_dadm_comfi_004",
    statement: "Julgue o item conforme o entendimento consolidado do STF e STJ.\n\nO Poder Judiciário pode anular ato administrativo discricionário que apresente desvio de finalidade, pois tal vício configura ilegalidade — e não simples questão de mérito administrativo.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CERTO. O desvio de finalidade (desvio de poder) é vício de LEGALIDADE, não de mérito. O Judiciário não controla o mérito administrativo (conveniência/oportunidade), mas controla a legalidade — incluindo o desvio de finalidade. Ato discricionário com desvio de finalidade = anulável pelo Judiciário. Entendimento pacífico no STF e STJ.",
    explanationCorrect: "Correto! Desvio de finalidade = vício de legalidade = Judiciário pode anular. Mérito: Judiciário não entra. Legalidade (incluindo desvio): Judiciário controla. Esse é o critério decisivo para distinguir mérito de legalidade.",
    explanationWrong: "O item está CERTO. Desvio de finalidade NÃO é mérito — é ilegalidade. Por isso o Judiciário pode anular o ato discricionário afetado. Apenas a conveniência/oportunidade em si fica fora do controle judicial.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Finalidade do Ato Administrativo e Desvio de Poder",
  },
  // ── Q5 — Publicidade vs. validade (FACIL, MULTIPLA_ESCOLHA) ─────────────
  {
    id: "qz_dadm_comfi_005",
    statement: "Uma portaria ministerial foi devidamente assinada pelo Ministro, mas não foi publicada no Diário Oficial da União por erro da assessoria. Em relação a essa portaria, é CORRETO afirmar que ela:",
    alternatives: [
      { letter: "A", text: "É inválida, pois a publicação é condição de validade do ato administrativo." },
      { letter: "B", text: "É válida, mas ineficaz — não produz efeitos enquanto não publicada." },
      { letter: "C", text: "É válida e eficaz, pois a publicação é mero requisito burocrático que não impede a produção de efeitos." },
      { letter: "D", text: "É inválida, pois a publicidade é elemento essencial do ato, cuja ausência gera nulidade absoluta." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Publicidade é condição de EFICÁCIA do ato, não de validade. O ato existe e é válido desde a assinatura pela autoridade competente; produz efeitos (obriga terceiros) somente após publicação. A portaria não publicada: válida (foi praticada regularmente) + ineficaz (não obriga ninguém enquanto não publicada).",
    explanationCorrect: "Correto! Publicidade → eficácia (não validade). Ato não publicado: válido + ineficaz. Esse é um dos temas clássicos de provas: distinguir validade de eficácia no ato administrativo.",
    explanationWrong: "Publicidade NÃO é condição de validade — é condição de EFICÁCIA. O ato é válido (foi praticado regularmente), mas ineficaz (não produz efeitos sem publicação). Invalidade e ineficácia são conceitos distintos — não confundir.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Forma do Ato Administrativo: Exigência, Publicidade e Motivação",
  },
  // ── Q6 — Motivação obrigatória (FACIL, CERTO_ERRADO) ────────────────────
  {
    id: "qz_dadm_comfi_006",
    statement: "Julgue o item conforme a Lei 9.784/99.\n\nA ausência de motivação em ato administrativo que negue ou restrinja direito de particular configura vício de forma, tornando o ato passível de anulação.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CERTO. A Lei 9.784/99, art. 50, torna a motivação obrigatória nos atos que neguem, limitem ou afetem direitos dos administrados. A motivação é a exteriorização dos motivos (elemento da forma do ato). Ausência de motivação quando obrigatória = vício de FORMA. Distinguir: falta de motivação (vício de forma) ≠ falta de motivo (vício de motivo).",
    explanationCorrect: "Correto! Motivação obrigatória nos atos restritivos (art. 50, L. 9.784/99). Ausência de motivação = vício de FORMA. Falta de motivação ≠ falta de motivo: são vícios distintos com consequências distintas.",
    explanationWrong: "O item está CERTO. Motivação é dever legal (art. 50, L. 9.784/99) nos atos que restringem direitos. Falta de motivação quando obrigatória = vício de FORMA — pode gerar anulação.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Forma do Ato Administrativo: Exigência, Publicidade e Motivação",
  },
  // ── Q7 — Vício de motivo: fato inexistente (MEDIO, MULTIPLA_ESCOLHA) ─────
  {
    id: "qz_dadm_comfi_007",
    statement: "Um fiscal ambiental lavra auto de infração por 'supressão de vegetação em APP' (pressuposto fático), com fundamento no art. 38 da Lei 9.605/98 (pressuposto jurídico). Após o auto, o georreferenciamento oficial comprova que a área não era APP. O auto de infração:",
    alternatives: [
      { letter: "A", text: "Permanece válido: o agente atuou de boa-fé e o fundamento jurídico (art. 38) estava correto." },
      { letter: "B", text: "É anulável por vício de motivo: o pressuposto fático (área ser APP) era inexistente." },
      { letter: "C", text: "É anulável por desvio de finalidade: o fiscal não visava à proteção do meio ambiente." },
      { letter: "D", text: "É válido, pois vício de motivo é sanável mediante convalidação pela Administração." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O motivo do ato é composto por pressuposto fático + pressuposto jurídico. Quando o pressuposto fático é inexistente (área não era APP), o motivo é inválido → vício de motivo por fato inexistente. Boa-fé do agente não sana o vício. Vício de motivo é INSANÁVEL — não admite convalidação. Anulação é compulsória.",
    explanationCorrect: "Correto! Vício de motivo: pressuposto fático inexistente (área não era APP). Mesmo com fundamento legal correto e boa-fé, o vício de motivo torna o ato anulável. Vício de motivo é INSANÁVEL — não pode ser convalidado.",
    explanationWrong: "Não é desvio de finalidade (finalidade era ambiental, correta). O vício é de MOTIVO: pressuposto fático inexistente. Boa-fé do agente não sana. Vício de motivo = INSANÁVEL = não convalidável. Fundamento jurídico correto isoladamente não salva o ato se o fato que o fundamentava não existia.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Motivo do Ato: Pressuposto Fático, Jurídico e Teoria dos Motivos Determinantes",
  },
  // ── Q8 — Teoria Motivos Determinantes + cargo ad nutum (MEDIO, CERTO_ERRADO)
  {
    id: "qz_dadm_comfi_008",
    statement: "Julgue o item conforme o entendimento do STF e STJ sobre a Teoria dos Motivos Determinantes.\n\nEmbora cargos em comissão sejam de livre exoneração (ad nutum), se a Administração optar por declarar os motivos da exoneração, ficará vinculada a eles — e a falsidade do motivo declarado implica anulação do ato.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CERTO. A Teoria dos Motivos Determinantes estabelece que os motivos declarados vinculam a validade do ato, mesmo que a lei não exigisse motivação (caso dos cargos ad nutum). Se a Administração OPTA por declarar motivos, esses motivos vinculam o ato — se falsos ou inexistentes, o ato deve ser anulado. Consolidado no STF (MS 21.682) e STJ.",
    explanationCorrect: "Correto! Cargo ad nutum: pode exonerar sem motivar. Mas se motivou → vinculou. Motivo falso → anulação (Teoria dos Motivos Determinantes). Essa é a essência: opcional motivar, mas obrigatório ser verdadeiro se motivou.",
    explanationWrong: "O item está CERTO. Cargo ad nutum: exoneração sem motivação é válida. Com motivação falsa → anulação (Teoria dos Motivos Determinantes). Ao declarar motivos, a Administração se autovincula: verdadeiro = válido; falso = nulo.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Motivo do Ato: Pressuposto Fático, Jurídico e Teoria dos Motivos Determinantes",
  },
  // ── Q9 — Objeto: requisito de licitude (MEDIO, MULTIPLA_ESCOLHA) ─────────
  {
    id: "qz_dadm_comfi_009",
    statement: "Sobre os requisitos do objeto do ato administrativo, assinale a alternativa INCORRETA:",
    alternatives: [
      { letter: "A", text: "O objeto deve ser lícito, não podendo contrariar a lei ou a moral administrativa." },
      { letter: "B", text: "O objeto deve ser física e juridicamente possível." },
      { letter: "C", text: "O objeto deve ser determinado ou pelo menos determinável." },
      { letter: "D", text: "No ato discricionário, o objeto pode ser ilícito desde que atenda ao interesse público e seja devidamente motivado." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "A alternativa INCORRETA é D. O objeto SEMPRE deve ser lícito — seja o ato vinculado ou discricionário. A ilicitude do objeto não é sanada pelo interesse público nem pela motivação. Um ato com objeto ilícito é absolutamente nulo, independentemente da finalidade declarada. Os três requisitos do objeto (Lícito, Possível, Determinado — LPD) são universais a todo ato administrativo.",
    explanationCorrect: "Correto que D é incorreta. Objeto ilícito = nulidade absoluta — isso vale para TODOS os atos, inclusive os discricionários. Os requisitos LPD aplicam-se universalmente. Discricionariedade diz respeito à margem de escolha dentro da lei, não à autorização de objeto contrário a ela.",
    explanationWrong: "A alternativa incorreta é D. Objeto discricionário NÃO pode ser ilícito em nenhuma hipótese. Ilicitude do objeto = nulidade absoluta. Os requisitos LPD (Lícito, Possível, Determinado) aplicam-se a todo ato — vinculado ou discricionário.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Objeto do Ato Administrativo: Conteúdo, Requisitos e Vícios Insanáveis",
  },
  // ── Q10 — Objeto: vício insanável (MEDIO, CERTO_ERRADO) ─────────────────
  {
    id: "qz_dadm_comfi_010",
    statement: "Julgue o item conforme a doutrina majoritária de Direito Administrativo.\n\nOs vícios no objeto do ato administrativo são insanáveis, razão pela qual não admitem convalidação pela Administração, devendo o ato ser anulado — diferentemente dos vícios de competência (salvo exclusiva) e de forma não essencial, que podem ser convalidados.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CERTO. Vício de objeto é insanável — não admite convalidação. Apenas os vícios de COMPETÊNCIA (salvo exclusiva) e FORMA (quando não essencial) são convalidáveis — mnemônico CoFo. Os vícios de Objeto, Motivo e Finalidade (OMF) são insanáveis, levando à anulação compulsória.",
    explanationCorrect: "Correto! OMF = insanáveis = anulação. CoFo = convalidáveis. Objeto viciado → anulação compulsória — nunca convalidação. Essa distinção é cobrada diretamente em provas CEBRASPE.",
    explanationWrong: "O item está CERTO. Vícios de objeto são INSANÁVEIS. Convalidação só para CoFo (Competência + Forma não essencial). OMF (Objeto, Motivo, Finalidade) → só anulação.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Objeto do Ato Administrativo: Conteúdo, Requisitos e Vícios Insanáveis",
  },
  // ── Q11 — Análise integrada de vícios (DIFICIL, MULTIPLA_ESCOLHA) ─────────
  {
    id: "qz_dadm_comfi_011",
    statement: "Em operação da Polícia Federal, um Delegado autoriza, por memorando informal não publicado, a abertura de investigação contra parlamentar, declarando como motivo 'denúncias anônimas não verificadas'. Verificadas posteriormente, as denúncias eram inteiramente falsas. Identifique CORRETAMENTE os vícios do ato:",
    alternatives: [
      { letter: "A", text: "Vício de competência (Delegado não tem competência) e vício de finalidade (investigação ilegal)." },
      { letter: "B", text: "Vício de forma (memorando informal sem publicação) e vício de motivo (denúncias falsas = pressuposto fático inexistente)." },
      { letter: "C", text: "Vício de objeto (investigação é ato ilícito) e vício de finalidade (não era interesse público)." },
      { letter: "D", text: "Vício exclusivo de finalidade: o Delegado investigou com objetivos políticos ocultos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Dois vícios identificáveis: (1) VÍCIO DE FORMA: memorando informal sem publicação, quando havia exigência de forma específica e publicidade. (2) VÍCIO DE MOTIVO: as denúncias eram falsas — pressuposto fático (motivo de fato) inexistente. O Delegado tem competência para instaurar investigações → sem vício de competência. A investigação (objeto) é lícita. O enunciado não descreve intenção política → sem desvio de finalidade declarado.",
    explanationCorrect: "Correto! Dois vícios: forma (memorando informal sem publicação) + motivo (pressuposto fático inexistente — denúncias falsas). Competência = presente. Objeto = lícito. Finalidade = não há evidência de desvio no enunciado. A análise precisa de cada COMFI é exigida nesse nível de questão.",
    explanationWrong: "Analise cada COMFI: Competência = Delegado tem (sem vício). Objeto = investigação é lícita. Motivo = denúncias falsas = fato inexistente = VÍCIO DE MOTIVO. Forma = memorando informal sem publicação = VÍCIO DE FORMA. Finalidade = o enunciado não descreve intenção política — não há desvio identificável.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Quadro de Vícios dos Atos Administrativos por Elemento COMFI",
  },
  // ── Q12 — Convalidação: CoFo vs. OMF + efeitos (DIFICIL, MULTIPLA_ESCOLHA) ─
  {
    id: "qz_dadm_comfi_012",
    statement: "Considerando o instituto da convalidação (saneamento) dos atos administrativos, assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "A convalidação é cabível para qualquer vício, desde que o ato não tenha causado prejuízo ao administrado." },
      { letter: "B", text: "A convalidação produz efeitos ex-nunc (para o futuro), substituindo o ato viciado por um novo ato válido a partir da data da convalidação." },
      { letter: "C", text: "A convalidação é restrita aos vícios de competência (salvo exclusiva) e de forma não essencial, produzindo efeitos ex-tunc (retroativos)." },
      { letter: "D", text: "A convalidação é possível para vícios de motivo quando a situação de fato subsiste, pois o fundamento legal pode ser corrigido." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A convalidação produz efeitos EX-TUNC (retroativos) — o ato é considerado válido desde o início. É cabível apenas para: (1) vício de Competência (salvo exclusiva); (2) vício de Forma não essencial. Mnemônico CoFo = convalidável. Vícios de Objeto, Motivo e Finalidade (OMF) são INSANÁVEIS — não admitem convalidação. Confundir efeito ex-nunc com convalidação é erro clássico: convalidação sempre retro age (ex-tunc).",
    explanationCorrect: "Correto! CoFo + ex-tunc. Convalidação: Competência (salvo exclusiva) e Forma (não essencial) → efeitos retroativos. OMF insanáveis → só anulação. Atenção: efeito da convalidação é ex-TUNC (retroage), não ex-nunc.",
    explanationWrong: "Convalidação NÃO é para qualquer vício. Efeitos da convalidação são EX-TUNC (retroativos), não ex-nunc. Vício de motivo é INSANÁVEL, mesmo que a situação de fato subsista. Regra definitiva: CoFo (Competência + Forma não essencial) = convalidável. OMF = anulação compulsória.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Quadro de Vícios dos Atos Administrativos por Elemento COMFI",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n⚖️  Seed R16: Direito Administrativo — COMFI Aprofundado\n");

  // ── 1. Encontrar Subject ────────────────────────────────────────────────
  const subjectId = await findSubject("DIREITO_ADMINISTRATIVO");
  if (!subjectId) {
    console.error("❌ Subject 'DIREITO_ADMINISTRATIVO' não encontrado no banco.");
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
  const topicId = await findOrCreateTopic("Atos Administrativos", subjectId);
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
        ${q.explanation}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${subjectId}, ${topicId}, ${contentId},
        true, ${q.difficulty},
        0, ${q.questionType},
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Questão criada: ${q.id}`);
    questionCreated++;
  }

  // ── Backfill contentId em questões já existentes (sem contentId) ─────────
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
  console.log("─────────────────────────────────────────\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed falhou:", err);
  process.exit(1);
});
