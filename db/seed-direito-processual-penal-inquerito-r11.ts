/**
 * Seed: Direito Processual Penal — Inquérito Policial (Rodada 11 — Grupo A)
 *
 * Popula 6 átomos de Conteúdo + 12 Questões (nível PF/PRF/CEBRASPE).
 * Padrão GRUPO A: contentIdMap explícito por átomo → sem "roleta russa".
 *
 * Tópico: "Inquérito Policial" (distinto do legado "Inquérito Policial — D.I.E.S.O")
 * Subject: PROCESSUAL_PENAL
 * Mnemônico principal: S.E.I.D.O
 *
 * Execução:
 *   npx tsx db/seed-direito-processual-penal-inquerito-r11.ts
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
  const rows = (await db.execute(sql`
    SELECT id FROM "Subject" WHERE name ILIKE ${"%" + name + "%"} LIMIT 1
  `)) as any[];
  return rows[0]?.id ?? null;
}

async function findOrCreateTopic(name: string, subjectId: string): Promise<string> {
  const rows = (await db.execute(sql`
    SELECT id FROM "Topic" WHERE name ILIKE ${name} AND "subjectId" = ${subjectId} LIMIT 1
  `)) as any[];
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
  const rows = (await db.execute(sql`
    SELECT id FROM "Content" WHERE title = ${title} AND "subjectId" = ${subjectId} LIMIT 1
  `)) as any[];
  return rows.length > 0;
}

async function getContentId(title: string, subjectId: string): Promise<string | null> {
  const rows = (await db.execute(sql`
    SELECT id FROM "Content" WHERE title = ${title} AND "subjectId" = ${subjectId} LIMIT 1
  `)) as any[];
  return rows[0]?.id ?? null;
}

async function questionExists(id: string): Promise<boolean> {
  const rows = (await db.execute(sql`
    SELECT id FROM "Question" WHERE id = ${id} LIMIT 1
  `)) as any[];
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
  // ── 1. Conceito e Natureza ────────────────────────────────────────────────
  {
    title: "Inquérito Policial: Conceito, Natureza e Finalidade",
    textContent: `O Inquérito Policial (IP) é o procedimento administrativo de caráter investigatório, presidido pelo Delegado de Polícia (autoridade policial), destinado a apurar a autoria e a materialidade de infrações penais, fornecendo ao titular da ação penal (MP ou ofendido) os elementos mínimos para o oferecimento da denúncia ou queixa.

NATUREZA JURÍDICA:
• Procedimento ADMINISTRATIVO — não é processo judicial
• Base legal: arts. 4º a 23 do Código de Processo Penal (CPP)
• Pré-processual: antecede a ação penal
• Presidido pelo Delegado de Polícia (Polícia Judiciária — PF nos crimes federais; PC nos crimes estaduais)

FINALIDADE:
• Apurar a AUTORIA (quem praticou) e a MATERIALIDADE (o crime ocorreu)
• Fornecer elementos de informação (fumus commissi delicti) para o MP decidir se oferece denúncia
• O IP NÃO condena nem absolve — apenas investiga

PEÇAS DO IP:
• Portaria de instauração (ou APF nas prisões em flagrante)
• Termos de declarações e interrogatório
• Laudos periciais e autos de exame de corpo de delito
• Relatório final elaborado pelo Delegado

DICA BANCA (CEBRASPE):
"O inquérito policial é processo judicial" → ERRADO. IP é procedimento ADMINISTRATIVO.
"O Juiz preside o inquérito policial" → ERRADO. Quem preside é o DELEGADO DE POLÍCIA.`,
    mnemonic: "PADI: P = Pré-processual, A = Administrativo, D = Dispensável, I = Inquisitivo. 'PADI não é processo judicial — é investigação!'",
    keyPoint: "IP = procedimento ADMINISTRATIVO pré-processual presidido pelo Delegado. Finalidade: apurar autoria + materialidade. NÃO é processo judicial.",
    practicalExample: "Denúncia de tráfico de drogas chega à delegacia → Delegado instaura IP por portaria → realiza diligências (buscas, interceptações) → elabora relatório → encaminha ao Juiz que remete ao MP → MP decide: denunciar, pedir diligências ou arquivar.",
    difficulty: "FACIL",
  },
  // ── 2. Características S.E.I.D.O ─────────────────────────────────────────
  {
    title: "Características do IP — Mnemônico S.E.I.D.O",
    textContent: `As 5 características do Inquérito Policial formam o mnemônico S.E.I.D.O:

S — SIGILOSO (art. 20 CPP):
A autoridade policial assegurará o sigilo necessário à elucidação do fato ou ao interesse da sociedade. O sigilo é externo: terceiros e imprensa não acessam.
• EXCEÇÃO — Súmula Vinculante 14 STF: o defensor constituído tem direito de acesso amplo aos elementos de prova já DOCUMENTADOS no IP. O sigilo NÃO se aplica ao que já está nos autos para o advogado do investigado.
• Sigilo de diligências em andamento (não documentadas): pode ser mantido pelo Delegado.

E — ESCRITO (art. 9º CPP):
"Todas as peças do inquérito policial serão, num só processado, reduzidas a escrito ou datilografadas e, neste caso, rubricadas pela autoridade." Tudo vira documento — sem modalidade oral.

I — INQUISITIVO:
O IP não tem contraditório nem ampla defesa. O investigado é objeto da investigação, não parte. Não existe "contraditório mitigado" no IP — o contraditório é simplesmente AUSENTE (surge apenas na ação penal, com o recebimento da denúncia pelo Juiz).

D — DISPENSÁVEL:
O IP não é condição de procedibilidade para a ação penal (art. 39, §5º CPP). O MP pode oferecer denúncia com base em APF, TCO, peças de informação, CPI ou qualquer elemento suficiente de autoria e materialidade.

O — OFICIAL (Oficioso):
Conduzido exclusivamente pela Polícia Judiciária (órgão estatal). Particulares não presidem IPs. A instauração é obrigatória para crimes de APPI (ação penal pública incondicionada).`,
    mnemonic: "S.E.I.D.O: Sigiloso (SV 14 garante advogado), Escrito (art. 9), Inquisitivo (sem contraditório — nem mitigado), Dispensável (MP pode denunciar sem IP), Oficial (só Polícia Judiciária).",
    keyPoint: "SV 14: advogado acessa diligências JÁ documentadas (não as em andamento). Inquisitivo = sem contraditório (não mitigado — é AUSENTE). Dispensável = MP pode denunciar sem IP.",
    practicalExample: "Delegado conduz IP em sigilo operacional (S). Registra cada diligência por escrito (E). Colhe depoimentos sem ouvir defesa (I). MP recebe APF e denuncia sem esperar IP completo (D). Particular não pode presidir IP — apenas Delegado (O).",
    difficulty: "FACIL",
  },
  // ── 3. Instauração ────────────────────────────────────────────────────────
  {
    title: "Instauração do IP: Portaria, Requisição, Requerimento e Notitia Criminis",
    textContent: `O IP pode ser instaurado por 4 formas (mnemônico P.R.R.F.) e a Notitia Criminis é o veículo de conhecimento do fato criminoso:

FORMAS DE INSTAURAÇÃO (art. 5º CPP):
1. DE OFÍCIO / PORTARIA — Delegado instaura por iniciativa própria nos crimes de ação penal pública incondicionada (APPI). Também instaurado quando a comunicação de terceiro chega à delegacia.
2. REQUISIÇÃO do MP ou do Juiz — De cumprimento OBRIGATÓRIO pelo Delegado. Ele não pode recusar requisição do MP nem do Juiz.
3. REQUERIMENTO do ofendido — Para crimes de ação penal pública condicionada à representação. O Delegado PODE indeferir (controle de legalidade); o ofendido pode recorrer ao Chefe de Polícia.
4. AUTO DE PRISÃO EM FLAGRANTE (APF) — Substitui a portaria. A lavratura do APF já instaura o IP automaticamente.

NOTITIA CRIMINIS — tipos:
• Cognição imediata: Delegado toma conhecimento por meios próprios (patrulha, notícia em jornal)
• Cognição mediata: comunicação de alguém (delação, boletim de ocorrência)
• Cognição coercitiva: prisão em flagrante — já opera a instauração via APF
• Notitia criminis inqualificada (delação anônima): admitida pelo STF como base para investigações preliminares — o Delegado verifica a plausibilidade antes de instaurar formalmente (HC 99.490 STF)

DISTINÇÃO CRUCIAL:
• REQUISIÇÃO (MP/Juiz) → obrigatória para o Delegado
• REQUERIMENTO (ofendido) → pode ser indeferido pelo Delegado`,
    mnemonic: "P.R.R.F. = Portaria (de ofício), Requisição (obrigatória), Requerimento (pode indeferir), Flagrante (APF). Delação anônima = investigação preliminar obrigatória antes de instaurar.",
    keyPoint: "Delegado NÃO pode recusar requisição do MP ou do Juiz. Pode indeferir requerimento do ofendido (recurso ao Chefe de Polícia). Delação anônima: STF permite IP após verificação de plausibilidade.",
    practicalExample: "MP descobre organização criminosa via CPI e requisita IP à PF → Delegado OBRIGADO a instaurar. Vítima de ameaça faz requerimento → Delegado pode indeferir se não vislumbrar elementos → vítima recorre ao Chefe de Polícia. Email anônimo sobre tráfico → Delegado faz diligências preliminares antes de instaurar IP.",
    difficulty: "FACIL",
  },
  // ── 4. Prazos CPP vs. PF ──────────────────────────────────────────────────
  {
    title: "Prazos do IP — CPP vs. Polícia Federal (Lei 5.010/66)",
    textContent: `Os prazos do IP variam conforme a legislação aplicável e a situação do indiciado:

REGRA GERAL — CPP (art. 10):
• Indiciado PRESO: 10 dias (contados da data da prisão; improrrogável sem autorização judicial)
• Indiciado SOLTO: 30 dias (prorrogável mediante autorização do Juiz competente)

POLÍCIA FEDERAL — Lei 5.010/66 (art. 66):
• Indiciado PRESO: 15 dias + prorrogável por mais 15 dias mediante despacho do Juiz Federal = até 30 dias total
• Indiciado SOLTO: 30 dias (igual ao CPP)
A Lei 5.010/66 se aplica aos crimes de competência da JUSTIÇA FEDERAL, processados pela PF.

OUTRAS LEGISLAÇÕES ESPECIAIS:
• Crimes de drogas (Lei 11.343/06, art. 51): 30 dias (preso) / 90 dias (solto) — ambos prorrogáveis
• Lei de Segurança Nacional: prazos próprios
• Crimes contra a ordem tributária e econômica: prazos especiais previstos nas respectivas leis

QUADRO COMPARATIVO:

| Situação | CPP geral | PF (Lei 5.010/66) |
|----------|-----------|-------------------|
| PRESO    | 10 dias   | 15 + 15 dias      |
| SOLTO    | 30 dias   | 30 dias           |

DICA PF/PRF (CEBRASPE):
Questões cobram especificamente o prazo PF de 15+15 dias vs. o prazo CPP de 10 dias para presos. A distinção é a mais cobrada em provas de nível federal.`,
    mnemonic: "CPP PRESO = 10 dias. PF PRESO = 15+15 dias (Lei 5.010). CPP/PF SOLTO = 30 dias. Mnemônico: 'PF tem PRAZO MAIOR para preso (15+15) porque investiga crimes FEDERAIS complexos.'",
    keyPoint: "PF presos: 15 dias + 15 dias prorrogáveis (Lei 5.010/66). CPP presos: 10 dias. Ambos soltos: 30 dias. CEBRASPE cobra especificamente o prazo PF em provas de nível federal.",
    practicalExample: "Suspeito preso em flagrante em crime de tráfico internacional (competência PF): Delegado Federal tem 15 dias para concluir o IP, podendo pedir prorrogação de mais 15 dias ao Juiz Federal — total de 30 dias. Se fosse crime estadual (PC): apenas 10 dias.",
    difficulty: "MEDIO",
  },
  // ── 5. Indiciamento ───────────────────────────────────────────────────────
  {
    title: "Indiciamento: Ato Privativo do Delegado (Lei 12.830/2013)",
    textContent: `O indiciamento é o ato pelo qual o Delegado de Polícia atribui formalmente ao investigado a condição de indiciado — reconhecendo indícios suficientes de autoria delitiva. É ato exclusivo do Delegado.

BASE LEGAL:
• Lei 12.830/2013, art. 2º, §6º: "O indiciamento, privativo do delegado de polícia, dar-se-á por ato fundamentado, mediante análise técnico-jurídica do fato, que deverá indicar a autoria, materialidade e suas circunstâncias."

CARACTERÍSTICAS:
• Ato EXCLUSIVO do Delegado — nenhum outro órgão pode indict
• Ato FUNDAMENTADO e circunstanciado (motivado)
• O MP NÃO pode requisitar indiciamento ao Delegado — STJ entende que ofenderia a independência funcional da Polícia Judiciária (STJ, HC 67.989)
• O Juiz NÃO pode determinar indiciamento

INDICIADO ≠ RÉU:
• Indiciado: recebe a condição de suspeito formal no IP (procedimento administrativo)
• Réu: somente após RECEBIMENTO da denúncia ou queixa pelo Juiz (início da ação penal)
• Com o indiciamento NÃO surge contraditório — esse só começa com a ação penal

DISTINÇÃO ENTRE ATOS:
• INDICIAMENTO → Delegado (IP — fase pré-processual)
• DENÚNCIA → Ministério Público (início da ação penal)
• PRONÚNCIA → Juiz no Tribunal do Júri (julgamento de crimes dolosos contra a vida)`,
    mnemonic: "Delegado INDICIA. MP DENUNCIA. Juiz PRONUNCIA (no Júri). Nenhum pode fazer o ato do outro. STJ: MP não pode forçar indiciamento — independência da Polícia Judiciária.",
    keyPoint: "Indiciamento = ato EXCLUSIVO e FUNDAMENTADO do Delegado (Lei 12.830/2013). MP não pode requisitar indiciamento (STJ). Indiciado ≠ Réu. Réu só surge com recebimento da denúncia.",
    practicalExample: "MP acha que determinado suspeito deve ser indiciado e requisita ao Delegado Federal → Delegado pode recusar, pois indiciamento é ato técnico-jurídico privativo (Lei 12.830). Se Delegado indicia e MP discorda, MP pode pedir ao Juiz que rejeite a denúncia — mas não pode forçar ou reverter o indiciamento em si.",
    difficulty: "MEDIO",
  },
  // ── 6. Arquivamento — Art. 28 CPP ──────────────────────────────────────────
  {
    title: "Arquivamento do IP — Art. 28 CPP (Pacote Anticrime — Lei 13.964/2019)",
    textContent: `O arquivamento do IP passou por profunda reforma com o Pacote Anticrime (Lei 13.964/2019).

REGRA PERMANENTE — ART. 17 CPP:
O Delegado NÃO pode arquivar o IP. Essa regra não foi alterada pelo Pacote Anticrime.

SISTEMA ANTES DO PACOTE ANTICRIME (redação anterior do art. 28 CPP):
1. MP requer o arquivamento ao Juiz
2. Juiz homologa → IP arquivado
3. Juiz discorda → remete ao Procurador-Geral (PGJ) para revisão

SISTEMA APÓS O PACOTE ANTICRIME — Art. 28 CPP (Lei 13.964/2019):
1. MP decide pelo arquivamento e promove diretamente (independente de autorização judicial)
2. Comunica ao Juiz, ao investigado e ao ofendido/representante
3. Controle: Câmara de Revisão Ministerial (órgão interno do MP) — NÃO mais o Juiz
→ Resultado: o Juiz deixou de ser o homologador do arquivamento; o controle passou para dentro do próprio MP.

NOTA: STF (ADI 6298) analisou a constitucionalidade do novo art. 28 — já declarou constitucional com algumas ressalvas práticas que variam por Estado.

REABERTURA DO IP ARQUIVADO — Art. 18 CPP:
• Possível se surgirem NOVAS PROVAS
• Requerida pelo MP (não pode o Juiz fazer de ofício — princípio acusatório)
• O arquivamento NÃO produz coisa julgada material (pode ser reaberto)`,
    mnemonic: "Delegado NUNCA arquiva (art. 17). Novo sistema: MP arquiva DIRETO → comunica Juiz → Câmara de Revisão MP controla (não mais o Juiz). Reabertura: novas provas + MP requere.",
    keyPoint: "Art. 17 CPP: Delegado não pode arquivar. Art. 28 novo (Pacote Anticrime): MP arquiva diretamente + Câmara de Revisão Ministerial controla. Juiz não homologa mais. Art. 18 CPP: reabertura por novas provas, apenas pelo MP.",
    practicalExample: "PF encerra investigação de estelionato federal sem provas suficientes. Delegado remete ao MP. MP, ao invés de denunciar, promove o arquivamento (novo art. 28) e comunica ao Juiz Federal e ao ofendido. Câmara de Revisão do MPF poderá revisar a decisão. Se novas provas aparecerem, o MPF pode requerer a reabertura — Juiz não pode reabrir de ofício.",
    difficulty: "DIFICIL",
  },
];

// ============================================
// QUESTÕES (12 — nível PF/PRF/CEBRASPE)
// ============================================

interface Alternative {
  letter: string;
  text: string;
}

interface QuestionData {
  id: string;
  statement: string;
  questionType: "MULTIPLA_ESCOLHA" | "CERTO_ERRADO";
  alternatives: Alternative[];
  correctAnswer: string;
  correctOption: number;
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  contentTitle: string;
}

const questions: QuestionData[] = [
  // ── Q1–Q2: Átomo 1 — Conceito e Natureza ─────────────────────────────────
  {
    id: "qz_dpp_ip2_001",
    questionType: "CERTO_ERRADO",
    statement:
      "(CEBRASPE – Adaptada) Julgue o item a seguir:\n\nO inquérito policial possui natureza jurídica de processo judicial, uma vez que está previsto no Código de Processo Penal e é presidido por autoridade dotada de poder investigativo.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O IP é procedimento ADMINISTRATIVO pré-processual — não judicial. Sua previsão no CPP não o torna processo judicial; o CPP regula tanto o IP (fase pré-processual) quanto o processo penal em si. O presidente do IP é o Delegado de Polícia (autoridade policial), não autoridade judiciária. Confundir 'previsto no CPP' com 'processo judicial' é a pegadinha mais frequente em provas de nível federal.",
    explanationCorrect:
      "Correto ao marcar ERRADO! IP = procedimento ADMINISTRATIVO, pré-processual, presidido pelo Delegado. Não é processo judicial. A previsão no CPP não transforma o IP em processo — o CPP regula também a fase anterior ao processo.",
    explanationWrong:
      "Este item é ERRADO. O IP é procedimento ADMINISTRATIVO (não judicial). Quem preside é o DELEGADO DE POLÍCIA. O Juiz não preside o IP — ele recebe os autos ao final para encaminhar ao MP. A previsão no CPP não define a natureza do ato.",
    difficulty: "FACIL",
    contentTitle: "Inquérito Policial: Conceito, Natureza e Finalidade",
  },
  {
    id: "qz_dpp_ip2_002",
    questionType: "MULTIPLA_ESCOLHA",
    statement:
      "Sobre a finalidade do Inquérito Policial e sua relação com a ação penal, assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "O IP é condição de procedibilidade para a ação penal pública incondicionada, sendo obrigatório para o oferecimento de denúncia." },
      { letter: "B", text: "O IP tem por finalidade condenar o investigado, produzindo desde logo os efeitos da sentença penal condenatória." },
      { letter: "C", text: "O IP é procedimento administrativo que visa apurar autoria e materialidade, fornecendo ao MP os elementos para o oferecimento da denúncia, mas não é condição de procedibilidade." },
      { letter: "D", text: "O IP tem natureza judicial, pois seu resultado vincula o Juiz que recebe a denúncia baseada nos elementos nele colhidos." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O IP é procedimento ADMINISTRATIVO (natureza — não judicial) com a finalidade de apurar autoria e materialidade. Não é condição de procedibilidade: o MP pode oferecer denúncia com base em APF, TCO, CPI, peças de informação ou qualquer elemento suficiente. O IP não condena — apenas investiga e fornece elementos para o titular da ação penal.",
    explanationCorrect:
      "Correto! IP = administrativo, finalidade = autoria + materialidade, não é condição de procedibilidade. MP pode denunciar sem IP se tiver outros elementos suficientes. IP não condena.",
    explanationWrong:
      "Atenção: IP não condena (é fase pré-processual). IP não é condição de procedibilidade (art. 39, §5 CPP). IP é ADMINISTRATIVO, não judicial — o Juiz que recebe a denúncia não está vinculado às conclusões do Delegado.",
    difficulty: "FACIL",
    contentTitle: "Inquérito Policial: Conceito, Natureza e Finalidade",
  },
  // ── Q3–Q4: Átomo 2 — Características S.E.I.D.O ───────────────────────────
  {
    id: "qz_dpp_ip2_003",
    questionType: "MULTIPLA_ESCOLHA",
    statement:
      "O mnemônico S.E.I.D.O resume as 5 características do Inquérito Policial. Assinale a alternativa que apresenta CORRETAMENTE todas elas:",
    alternatives: [
      { letter: "A", text: "Sigiloso, Espontâneo, Inquisitivo, Dispensável, Oral." },
      { letter: "B", text: "Secreto, Escrito, Imparcial, Definitivo, Oficial." },
      { letter: "C", text: "Sigiloso, Escrito, Inquisitivo, Dispensável, Oficial." },
      { letter: "D", text: "Sigiloso, Escrito, Incriminatório, Dispensável, Obrigatório." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "S.E.I.D.O: Sigiloso (art. 20 CPP — com SV 14 garantindo acesso do advogado ao que já foi documentado), Escrito (art. 9 CPP — todas as peças reduzidas a escrito), Inquisitivo (sem contraditório), Dispensável (não é condição de procedibilidade), Oficial (presidido pela Polícia Judiciária — autoridade estatal). Nenhuma das alternativas incorretas tem todos os 5 elementos certos.",
    explanationCorrect:
      "Correto! S = Sigiloso, E = Escrito, I = Inquisitivo, D = Dispensável, O = Oficial. As pegadinhas estão nos detalhes: 'Espontâneo' (errado — é 'Inquisitivo'), 'Oral' (errado — é 'Escrito'), 'Obrigatório' (errado — é 'Dispensável').",
    explanationWrong:
      "O IP é ESCRITO (não oral), INQUISITIVO (não imparcial ou incriminatório), DISPENSÁVEL (não obrigatório) e OFICIAL (não espontâneo). Revise o mnemônico S.E.I.D.O: Sigiloso, Escrito, Inquisitivo, Dispensável, Oficial.",
    difficulty: "FACIL",
    contentTitle: "Características do IP — Mnemônico S.E.I.D.O",
  },
  {
    id: "qz_dpp_ip2_004",
    questionType: "CERTO_ERRADO",
    statement:
      "(CEBRASPE – PF – Adaptada) Julgue o item a seguir:\n\nEmbora o inquérito policial seja de natureza inquisitória, o investigado tem assegurado o exercício do contraditório de forma mitigada, podendo apresentar sua versão dos fatos ao delegado e requerer diligências que, se indeferidas, ensejam recurso ao Poder Judiciário.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O IP é inquisitivo e NÃO assegura contraditório — nem mitigado. Contraditório é simplesmente AUSENTE no IP; ele só surge com o recebimento da denúncia (início da ação penal). O investigado pode apresentar versão e requerer diligências ao Delegado (Lei 12.830/2013), mas isso não é contraditório — o Delegado pode indeferir sem que o indeferimento caracterize violação ao contraditório. Recurso ao Judiciário por indeferimento de diligência no IP não é contraditório processual.",
    explanationCorrect:
      "Correto ao marcar ERRADO! IP inquisitivo = contraditório AUSENTE (não mitigado). A SV 14 garante ao advogado acesso ao que está documentado, mas isso não é contraditório. Contraditório pleno só existe no processo penal (após recebimento da denúncia).",
    explanationWrong:
      "Este item é ERRADO. A expressão 'contraditório mitigado' no IP é tecnicamente incorreta — o IP é inquisitivo, o contraditório é simplesmente AUSENTE. O que existe é: direito do advogado de acessar autos documentados (SV 14), mas isso não é contraditório processual.",
    difficulty: "FACIL",
    contentTitle: "Características do IP — Mnemônico S.E.I.D.O",
  },
  // ── Q5–Q6: Átomo 3 — Instauração ─────────────────────────────────────────
  {
    id: "qz_dpp_ip2_005",
    questionType: "MULTIPLA_ESCOLHA",
    statement:
      "Acerca das formas de instauração do Inquérito Policial, assinale a opção CORRETA:",
    alternatives: [
      { letter: "A", text: "O delegado pode recusar requisição do Ministério Público para instaurar IP quando entender que a investigação é manifestamente improcedente, cabendo recurso ao Poder Judiciário." },
      { letter: "B", text: "O requerimento do ofendido, se indeferido pelo delegado, não admite qualquer recurso." },
      { letter: "C", text: "A requisição do MP ou do Juiz para instauração do IP é de cumprimento obrigatório pelo delegado, sem possibilidade de recusa." },
      { letter: "D", text: "O auto de prisão em flagrante não configura forma autônoma de instauração do IP — necessita de portaria complementar do delegado para ter validade." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Art. 5º, II CPP: a requisição do MP ou do Juiz para instauração do IP é OBRIGATÓRIA — o Delegado não pode recusá-la. Diferentemente do requerimento do ofendido, que pode ser indeferido (com recurso ao Chefe de Polícia — não ao Judiciário). O APF substitui a portaria e já instala o IP automaticamente, sem necessidade de portaria complementar.",
    explanationCorrect:
      "Correto! Requisição do MP/Juiz = obrigatória para o Delegado. A letra D está errada porque o APF já instaura o IP por si só. A letra B está errada porque cabe recurso ao Chefe de Polícia no caso de indeferimento do requerimento do ofendido.",
    explanationWrong:
      "A requisição do MP é OBRIGATÓRIA (não pode ser recusada). O requerimento do ofendido pode ser indeferido, mas cabe recurso ao CHEFE DE POLÍCIA (não ao Judiciário). O APF já instaura o IP automaticamente — sem portaria complementar (art. 5º, II c/c art. 6º CPP).",
    difficulty: "FACIL",
    contentTitle: "Instauração do IP: Portaria, Requisição, Requerimento e Notitia Criminis",
  },
  {
    id: "qz_dpp_ip2_006",
    questionType: "CERTO_ERRADO",
    statement:
      "(CEBRASPE – Adaptada) Julgue o item:\n\nA notitia criminis inqualificada — também denominada delação anônima — não pode, por si só, dar ensejo à instauração de inquérito policial, porque a vedação constitucional ao anonimato (art. 5.º, IV, da CF) impede que comunicações sem identificação do autor tenham qualquer valor no sistema processual penal.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O STF (HC 99.490) admite que a notitia criminis inqualificada (delação anônima) sirva como ponto de partida para INVESTIGAÇÕES PRELIMINARES, desde que o Delegado realize diligências prévias para verificar a plausibilidade antes de instaurar formalmente o IP. A vedação ao anonimato do art. 5º, IV, CF não impede a investigação policial — impede que o anônimo seja autor de denúncia criminal ou sirva diretamente como prova acusatória.",
    explanationCorrect:
      "Correto ao marcar ERRADO! Delação anônima = ponto de partida para verificação preliminar. STF (HC 99.490): Delegado realiza diligências prévias → se plausível, instaura IP. Vedação ao anonimato ≠ proibição de investigar.",
    explanationWrong:
      "Este item é ERRADO. A delação anônima pode sim dar origem a investigações. O STF admite que o Delegado realize verificações preliminares com base na notitia inqualificada e, se confirmar mínima plausibilidade, instaure o IP. O que a CF veda é o anonimato como instrumento de acusação direta — não como gatilho de investigação.",
    difficulty: "FACIL",
    contentTitle: "Instauração do IP: Portaria, Requisição, Requerimento e Notitia Criminis",
  },
  // ── Q7–Q8: Átomo 4 — Prazos PF ───────────────────────────────────────────
  {
    id: "qz_dpp_ip2_007",
    questionType: "MULTIPLA_ESCOLHA",
    statement:
      "Com relação aos prazos do Inquérito Policial, assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "O prazo geral do CPP (art. 10) é de 10 dias para indiciado preso e 30 dias para solto; a Polícia Federal adota os mesmos prazos em todos os crimes de sua competência." },
      { letter: "B", text: "A Polícia Federal, nos crimes de competência da Justiça Federal, deve concluir o IP em 15 dias quando o indiciado está preso, prorrogáveis por mais 15 dias mediante despacho do Juiz Federal, conforme a Lei 5.010/66." },
      { letter: "C", text: "O IP na Polícia Federal deve ser sempre concluído em 30 dias, independentemente de o indiciado estar preso ou solto." },
      { letter: "D", text: "Tanto o CPP quanto a Lei 5.010/66 fixam prazo de 15 dias para o indiciado preso, não havendo diferença entre os dois diplomas legais." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Lei 5.010/66, art. 66: nos crimes de competência da Justiça Federal (PF), o prazo do IP com indiciado preso é de 15 dias, prorrogável por mais 15 dias mediante despacho fundamentado do Juiz Federal = até 30 dias total. O CPP geral prevê 10 dias para presos. O prazo para soltos é 30 dias em ambas as leis. A distinção CPP (10 dias preso) x PF (15+15 dias preso) é o ponto mais cobrado nas provas PF/PRF.",
    explanationCorrect:
      "Correto! Lei 5.010/66: PF preso = 15 + 15 dias (prorrogável). CPP geral: preso = 10 dias. Ambos soltos = 30 dias. Memorize: PF tem prazo maior para preso porque crimes federais são geralmente mais complexos.",
    explanationWrong:
      "Atenção: o prazo PF para preso NÃO é igual ao CPP. O CPP prevê 10 dias (preso), enquanto a Lei 5.010/66 prevê 15 + 15 dias para os crimes de competência federal (PF). Para soltos: ambos preveem 30 dias.",
    difficulty: "MEDIO",
    contentTitle: "Prazos do IP — CPP vs. Polícia Federal (Lei 5.010/66)",
  },
  {
    id: "qz_dpp_ip2_008",
    questionType: "CERTO_ERRADO",
    statement:
      "(CEBRASPE – PF – Nível Real) Julgue o item:\n\nNos crimes de competência da Polícia Federal, o prazo para conclusão do inquérito policial quando o indiciado se encontra preso é de 15 (quinze) dias, prorrogável por mais 15 (quinze) dias mediante despacho do juiz federal, nos termos da Lei n.º 5.010/1966, diferindo, portanto, do prazo de 10 (dez) dias previsto no art. 10 do Código de Processo Penal para a regra geral.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. A Lei 5.010/66 (que organiza a Justiça Federal de primeira instância) prevê, em seu art. 66, prazo de 15 dias para conclusão do IP federal quando o indiciado estiver preso, prorrogável por mais 15 dias mediante despacho fundamentado do Juiz Federal. Esse prazo é distinto do prazo geral de 10 dias do art. 10 do CPP. Questão que exige conhecimento da legislação específica da PF — muito cobrada em concursos federais.",
    explanationCorrect:
      "Correto! Este é exatamente o prazo da Lei 5.010/66: 15 + 15 dias (preso) vs. 10 dias do CPP. Para soltos: 30 dias em ambos. Memorize bem essa distinção — ela aparece frequentemente em provas PF e PRF.",
    explanationWrong:
      "Este item é CERTO. A Lei 5.010/66 de fato prevê 15 + 15 dias para presos em crimes federais (PF), diferente do CPP que prevê apenas 10 dias. Essa distinção é fundamental para provas de nível federal.",
    difficulty: "MEDIO",
    contentTitle: "Prazos do IP — CPP vs. Polícia Federal (Lei 5.010/66)",
  },
  // ── Q9–Q10: Átomo 5 — Indiciamento ───────────────────────────────────────
  {
    id: "qz_dpp_ip2_009",
    questionType: "MULTIPLA_ESCOLHA",
    statement:
      "Com base na Lei n.º 12.830/2013 e na jurisprudência do STJ sobre o indiciamento no Inquérito Policial, assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "O Ministério Público pode requisitar ao Delegado que proceda ao indiciamento de determinada pessoa; o Delegado tem obrigação de atender à requisição por força do poder de supervisão do MP sobre a investigação policial." },
      { letter: "B", text: "O indiciamento é ato exclusivo do Delegado de Polícia, não podendo o MP, o Juiz ou qualquer outro órgão determiná-lo ou requisitá-lo." },
      { letter: "C", text: "O Juiz pode determinar o indiciamento quando os elementos dos autos apontam autoria suficientemente comprovada, para garantir os direitos do investigado." },
      { letter: "D", text: "O indiciamento pode ser dispensado se o MP já tiver elementos para oferecer denúncia, pois é ato meramente formal sem consequências jurídicas para o investigado." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Lei 12.830/2013, art. 2º, §6º: o indiciamento é ato EXCLUSIVO e PRIVATIVO do Delegado de Polícia. O STJ (HC 67.989) entende que o MP não pode requisitar indiciamento ao Delegado — isso violaria a independência funcional da Polícia Judiciária. O Juiz tampouco pode determinar o indiciamento. O Delegado o realiza com base em análise técnico-jurídica própria.",
    explanationCorrect:
      "Correto! Indiciamento = EXCLUSIVO do Delegado (Lei 12.830/2013). MP não pode requisitar (STJ). Juiz não pode determinar. O Delegado tem independência técnica para indiciar ou não, com base na sua análise dos indícios.",
    explanationWrong:
      "O indiciamento é ato EXCLUSIVO do Delegado (Lei 12.830/2013, art. 2º, §6º). O MP não pode requisitá-lo — STJ reconhece a independência funcional da Polícia Judiciária. O Juiz não pode determiná-lo. O fato de ser dispensável para a denúncia não o torna sem efeito — o indiciamento tem consequências (ex.: comunicação ao investigado, inclusão no sistema de inquéritos).",
    difficulty: "MEDIO",
    contentTitle: "Indiciamento: Ato Privativo do Delegado (Lei 12.830/2013)",
  },
  {
    id: "qz_dpp_ip2_010",
    questionType: "CERTO_ERRADO",
    statement:
      "(CEBRASPE – Adaptada) Julgue o item:\n\nO indiciamento formaliza a pretensão punitiva do Estado, transformando o investigado em réu e fazendo nascer, a partir desse ato, o direito ao contraditório e à ampla defesa em sua plenitude.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O indiciamento NÃO transforma o investigado em réu. O investigado passa a ter a condição de INDICIADO — suspeito formal no procedimento administrativo (IP). A condição de RÉU somente surge com o RECEBIMENTO da denúncia ou queixa pelo Juiz competente. O contraditório e a ampla defesa plenos surgem com a ação penal — não com o indiciamento. O IP é inquisitivo e não comporta contraditório em nenhuma fase.",
    explanationCorrect:
      "Correto ao marcar ERRADO! Indiciamento ≠ condição de réu. Réu = após RECEBIMENTO da denúncia pelo Juiz. Indiciado = suspeito formal no IP (procedimento administrativo). Contraditório = ausente no IP.",
    explanationWrong:
      "Este item é ERRADO. O indiciamento formaliza a suspeita no âmbito administrativo (IP), mas não transforma em réu. Réu = somente após o recebimento da denúncia ou queixa pelo Juiz. O contraditório pleno surge na ação penal, não no IP.",
    difficulty: "MEDIO",
    contentTitle: "Indiciamento: Ato Privativo do Delegado (Lei 12.830/2013)",
  },
  // ── Q11–Q12: Átomo 6 — Arquivamento Art. 28 ──────────────────────────────
  {
    id: "qz_dpp_ip2_011",
    questionType: "MULTIPLA_ESCOLHA",
    statement:
      "Com relação ao arquivamento do Inquérito Policial após a reforma promovida pelo Pacote Anticrime (Lei n.º 13.964/2019), assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "O sistema não foi alterado: o MP requer o arquivamento ao Juiz, que homologa ou, discordando, remete ao Procurador-Geral de Justiça." },
      { letter: "B", text: "O Delegado de Polícia passou a ter competência para promover o arquivamento do IP, comunicando ao Juiz e ao MP, que podem revisar a decisão." },
      { letter: "C", text: "O MP promove diretamente o arquivamento, comunicando ao Juiz, ao investigado e ao ofendido; o controle do arquivamento passou para a Câmara de Revisão Ministerial, e não mais o Juiz." },
      { letter: "D", text: "O arquivamento passou a depender de decisão colegiada do Tribunal competente, que apreciará o pedido do MP após ouvir o Juiz de primeira instância." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Art. 28 CPP (redação dada pela Lei 13.964/2019): o MP promove diretamente o arquivamento, comunicando ao Juiz, ao investigado e ao ofendido/representante. O controle passou da alçada judicial para a Câmara de Revisão Ministerial (órgão interno do MP). O art. 17 CPP, que proíbe o Delegado de arquivar, permanece inalterado. O STF já declarou constitucional o novo sistema (ADI 6298).",
    explanationCorrect:
      "Correto! Novo art. 28 CPP (Pacote Anticrime): MP arquiva diretamente → comunica Juiz + investigado + ofendido → Câmara de Revisão Ministerial controla. O Juiz saiu do papel de homologador do arquivamento.",
    explanationWrong:
      "O sistema mudou com o Pacote Anticrime: o Juiz NÃO homologa mais. O Delegado continua proibido de arquivar (art. 17 CPP). O MP passou a promover o arquivamento diretamente, com controle interno pela Câmara de Revisão Ministerial.",
    difficulty: "DIFICIL",
    contentTitle: "Arquivamento do IP — Art. 28 CPP (Pacote Anticrime — Lei 13.964/2019)",
  },
  {
    id: "qz_dpp_ip2_012",
    questionType: "MULTIPLA_ESCOLHA",
    statement:
      "Acerca da reabertura do Inquérito Policial arquivado (art. 18 do CPP), analise as assertivas:\n\nI. O Juiz pode determinar a reabertura do IP de ofício quando identificar novas provas que justifiquem a retomada das investigações.\nII. O arquivamento do IP não produz coisa julgada material, podendo o IP ser reaberto com o surgimento de novas provas.\nIII. A reabertura é requerida pelo Ministério Público; o Delegado não tem competência para reabrir IP arquivado.\nIV. Uma vez arquivado, o IP não pode ser reaberto em hipótese alguma, pois o arquivamento extingue definitivamente a punibilidade.\n\nEstão CORRETAS apenas:",
    alternatives: [
      { letter: "A", text: "I e II." },
      { letter: "B", text: "II e III." },
      { letter: "C", text: "I, II e III." },
      { letter: "D", text: "II, III e IV." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "I — ERRADA: O Juiz NÃO pode reabrir o IP de ofício — violaria o princípio acusatório. Reabertura = iniciativa do MP. II — CORRETA: art. 18 CPP — arquivamento não produz coisa julgada material. Novas provas permitem reabertura. III — CORRETA: somente o MP pode requerer reabertura; o Delegado não tem poder de arquivar nem reabrir. IV — ERRADA: o arquivamento não extingue a punibilidade — apenas encerra a investigação provisoriamente.",
    explanationCorrect:
      "Correto! II e III corretas. I errada (Juiz não pode de ofício — princípio acusatório). IV errada (arquivamento ≠ extinção de punibilidade; IP pode ser reaberto com novas provas).",
    explanationWrong:
      "Atenção: o Juiz NÃO pode reabrir IP de ofício (I errada). O arquivamento não extingue punibilidade — não há coisa julgada material (IV errada). Somente o MP pode requerer a reabertura com base em novas provas (art. 18 CPP).",
    difficulty: "DIFICIL",
    contentTitle: "Arquivamento do IP — Art. 28 CPP (Pacote Anticrime — Lei 13.964/2019)",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n⚖️  Seed R11: Direito Processual Penal — Inquérito Policial (Grupo A)\n");

  // ── 1. Encontrar Subject ────────────────────────────────────────────────
  const subjectId = await findSubject("PROCESSUAL_PENAL");
  if (!subjectId) {
    console.error("❌ Subject 'PROCESSUAL_PENAL' não encontrado no banco.");
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
  const topicId = await findOrCreateTopic("Inquérito Policial", subjectId);
  console.log(`✅ Topic: ${topicId}`);

  // ── 5. Inserir Conteúdos + build contentIdMap ──────────────────────────
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
    console.log(`  ✅ Questão criada: ${q.id} (${q.difficulty} — ${q.questionType})`);
    questionCreated++;
  }

  // ── Backfill contentId em questões já existentes (sem contentId) ─────────
  let backfillCount = 0;
  for (const q of questions) {
    const contentId = contentIdMap[q.contentTitle];
    if (!contentId) continue;
    const result = (await db.execute(sql`
      UPDATE "Question" SET "contentId" = ${contentId}
      WHERE id = ${q.id} AND "contentId" IS NULL
    `)) as any;
    if ((result.rowCount ?? result.count ?? 0) > 0) backfillCount++;
  }
  if (backfillCount > 0) console.log(`  🔧 Backfill contentId: ${backfillCount} questões atualizadas`);

  // ── Relatório ────────────────────────────────────────────────────────────
  console.log("\n─────────────────────────────────────────");
  console.log(`📚 Conteúdos: ${contentCreated} criados, ${contentSkipped} já existiam`);
  console.log(`❓ Questões:  ${questionCreated} criadas,  ${questionSkipped} já existiam`);
  console.log(`🔗 Vínculo:   todas as questões com contentId correto (sem roleta russa)`);
  console.log("─────────────────────────────────────────\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed falhou:", err);
  process.exit(1);
});
