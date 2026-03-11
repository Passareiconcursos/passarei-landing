/**
 * Seed R50 — Direito Processual Penal (FULL SEED)
 * Átomos: dpp_in_c01–c06 (Inquérito Policial) + dpp_pr_c01–c03 (Prisões)
 * Total: 9 átomos + 72 questões (8 por átomo)
 * Execução: npx tsx db/seed-dense-processual-penal-r50.ts
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

async function contentExistsById(id: string): Promise<boolean> {
  const rows = (await db.execute(sql`
    SELECT id FROM "Content" WHERE id = ${id} LIMIT 1
  `)) as any[];
  return rows.length > 0;
}

async function questionExists(id: string): Promise<boolean> {
  const rows = (await db.execute(sql`
    SELECT id FROM "Question" WHERE id = ${id} LIMIT 1
  `)) as any[];
  return rows.length > 0;
}

// ============================================
// INTERFACES
// ============================================

interface ContentAtom {
  id: string;
  topicName: string;
  title: string;
  textContent: string;
  mnemonic: string;
  keyPoint: string;
  practicalExample: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
}

interface Question {
  id: string;
  contentId: string;
  statement: string;
  alternatives: { letter: string; text: string }[];
  correctAnswer: string;
  correctOption: number;
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  questionType: "MULTIPLA_ESCOLHA" | "CERTO_ERRADO";
}

// ============================================
// CONTEÚDOS — 9 átomos
// ============================================

const contents: ContentAtom[] = [
  // ── Inquérito Policial ──────────────────────────────────────────────────
  {
    id: "dpp_in_c01",
    topicName: "Inquérito Policial",
    title: "IP — Conceito, Natureza Jurídica e Dispensabilidade",
    textContent: `O Inquérito Policial (IP) é um procedimento administrativo, pré-processual, inquisitório, presidido pela autoridade policial (delegado de polícia), destinado a apurar a autoria e a materialidade de infrações penais.

NATUREZA JURÍDICA: é procedimento administrativo — não é processo judicial. Por isso, não há contraditório e ampla defesa plenos. O IP serve de base para o oferecimento de denúncia ou queixa, mas não integra o processo criminal.

DISPENSABILIDADE: O IP é dispensável. O titular da ação penal pode oferecer denúncia/queixa com base em outras peças de informação (TCO, documentos, inquéritos civis, APFD). Art. 39, §5º CPP: o MP pode dispensar o IP quando já tiver elementos suficientes.

TITULAR: A presidência do IP cabe ao delegado de polícia (Lei 12.830/2013). O MP exerce o controle externo da atividade policial (art. 129, VII CF), mas não preside o IP.`,
    mnemonic: "IP = PAPI: Procedimento Administrativo Pré-processual Inquisitório. DISPENSÁVEL = MP pode denunciar sem IP (art. 39 §5º CPP). Presidente: DELEGADO (Lei 12.830/2013).",
    keyPoint: "IP é procedimento administrativo, dispensável. Não há contraditório pleno. MP pode oferecer denúncia sem IP se tiver outros elementos de convicção. Presidência: delegado.",
    practicalExample: "Policial flagra roubo com câmera de segurança. MP oferece denúncia com base no APFD + vídeo, sem aguardar conclusão do IP — lícito, pois IP é dispensável (art. 39, §5º CPP).",
    difficulty: "FACIL",
  },
  {
    id: "dpp_in_c02",
    topicName: "Inquérito Policial",
    title: "IP — Características: S.E.I.D.O.",
    textContent: `O IP tem cinco características fundamentais, reunidas no mnemônico S.E.I.D.O.:

S — SIGILOSO: O IP pode ser decretado sigiloso pelo delegado ou pelo juiz (art. 20 CPP). O sigilo NÃO abrange o advogado do investigado: ele tem acesso a todos os elementos já documentados nos autos (Súmula Vinculante 14 STF).

E — ESCRITO: Todos os atos devem ser reduzidos a termo (art. 9º CPP). Depoimentos, declarações e diligências são documentados.

I — INQUISITÓRIO: Não há contraditório nem ampla defesa plenos. O investigado não é réu — é objeto de investigação. A CF garante ao preso o direito ao silêncio e à assistência de advogado.

D — DISPENSÁVEL: O IP pode ser dispensado pelo MP quando houver outras peças de informação suficientes.

O — OFICIAL: O IP é conduzido por autoridade pública (delegado de polícia federal ou civil). Particular não preside IP.`,
    mnemonic: "S.E.I.D.O. = Sigiloso, Escrito, Inquisitório, Dispensável, Oficial. SV 14: advogado acessa IP mesmo sigiloso (elementos já documentados).",
    keyPoint: "SEIDO: Sigiloso (SV 14 — advogado acessa), Escrito (art. 9º), Inquisitório (sem contraditório pleno), Dispensável, Oficial (delegado). Sigilo não exclui advogado.",
    practicalExample: "Delegado decreta sigilo no IP. Advogado do suspeito pede vista dos autos. Delegado não pode negar: SV 14 garante acesso às peças já documentadas nos autos.",
    difficulty: "FACIL",
  },
  {
    id: "dpp_in_c03",
    topicName: "Inquérito Policial",
    title: "IP — Instauração: Formas e Hipóteses",
    textContent: `O IP pode ser instaurado de diversas formas, conforme a natureza da ação penal:

AÇÃO PÚBLICA INCONDICIONADA: O delegado instaura de ofício por portaria, ou mediante: (1) Auto de Prisão em Flagrante Delito (APFD); (2) requisição do MP ou do juiz; (3) requerimento do ofendido; (4) delação de qualquer pessoa (art. 5°, §3° CPP).

AÇÃO PÚBLICA CONDICIONADA À REPRESENTAÇÃO: Só se instaura após representação do ofendido ou requisição do Ministro da Justiça. Sem representação, o delegado não pode agir de ofício.

AÇÃO PRIVADA: Só se instaura mediante requerimento do ofendido (ou representante legal). O delegado não pode instaurar de ofício.

TCO (Termo Circunstanciado de Ocorrência): Para infrações de menor potencial ofensivo (pena máxima ≤ 2 anos — Lei 9.099/95), lavra-se TCO em vez de IP, remetendo diretamente ao JECrim.`,
    mnemonic: "Instauração: OF-POR (ofício/portaria), APFD, REQ-MP/Juiz, REQ-ofendido, DEL-vox-populi. Ação privada e condicionada = só com representação/requerimento. TCO = menor potencial ofensivo.",
    keyPoint: "IP de ofício: só para ação pública incondicionada. Ação condicionada: precisa de representação. Ação privada: só requerimento do ofendido. TCO substitui IP para infrações ≤ 2 anos.",
    practicalExample: "Delegado fica sabendo de crime de ameaça (ação pública condicionada) por notícia de jornal. Não pode instaurar IP de ofício — aguarda representação da vítima (art. 38 CPP: prazo de 6 meses a contar do conhecimento da autoria).",
    difficulty: "MEDIO",
  },
  {
    id: "dpp_in_c04",
    topicName: "Inquérito Policial",
    title: "IP — Prazos: CPP, Polícia Federal e Legislação Especial",
    textContent: `Os prazos do IP variam conforme a lei aplicável e a situação do investigado (preso ou solto):

CPP — REGRA GERAL (art. 10):
• Réu PRESO: 10 dias (não prorrogável pelo CPP)
• Réu SOLTO: 30 dias (prorrogáveis por despacho do juiz a requerimento da autoridade policial)

POLÍCIA FEDERAL (Lei 5.010/1966):
• Réu PRESO: 15 dias + prorrogação por mais 15 dias (total: até 30 dias)
• Réu SOLTO: 30 dias (prorrogáveis pelo juiz)

LEI DE DROGAS (Lei 11.343/2006):
• Réu PRESO: 30 dias + prorrogação por mais 30 dias (total: até 60 dias)
• Réu SOLTO: 90 dias + prorrogação por mais 90 dias (total: até 180 dias)

EXCESSO DE PRAZO: Gera constrangimento ilegal — HC para relaxamento da prisão. O STJ admite prorrogações razoáveis em casos complexos. Súmula 52 STJ: prazo para denúncia não corre enquanto há diligências pendentes.`,
    mnemonic: "CPP: 10p/30s. PF: 15(+15)p/30s. Drogas: 30(+30)p/90(+90)s. Excesso = HC. PF dobra prazo do preso em relação ao CPP. Drogas triplica.",
    keyPoint: "Prazos IP: CPP 10d preso/30d solto. PF 15+15d preso/30d solto. Lei Drogas 30+30d preso/90+90d solto. Excesso de prazo = HC por constrangimento ilegal.",
    practicalExample: "Preso em flagrante por tráfico de drogas pela PF. Delegado federal tem até 30 dias para concluir o IP (prorrogáveis por mais 30), não apenas 10 dias como no CPP. Excesso: HC para relaxar a prisão.",
    difficulty: "MEDIO",
  },
  {
    id: "dpp_in_c05",
    topicName: "Inquérito Policial",
    title: "IP — Indiciamento: Lei 12.830/2013",
    textContent: `O indiciamento é o ato formal pelo qual o delegado aponta o investigado como provável autor da infração penal.

ATO PRIVATIVO DO DELEGADO: Lei 12.830/2013 (art. 2°, §6°) — o indiciamento é ato privativo e fundamentado do delegado de polícia. Nem o MP nem o juiz podem requisitar o indiciamento.

REQUISITOS: O indiciamento deve se basear em elementos suficientes de convicção (não bastam meros indícios). O delegado realiza análise técnico-jurídica do fato e da autoria.

DESINDICIAMENTO: O próprio delegado pode promover o desindiciamento se surgir prova de inocência. O superior hierárquico não pode impor o indiciamento ao delegado responsável.

PRESO: O indiciamento do preso deve ocorrer antes do final do prazo do IP.

QUALIFICAÇÃO: Se o indiciado não souber ou não quiser se qualificar, faz-se por testemunhas ou identificação datiloscópica (art. 6°, VIII CPP).

COMUNICAÇÃO: O indiciamento é comunicado ao indiciado, que pode constituir advogado.`,
    mnemonic: "Indiciamento = ato PRIVATIVO do DELEGADO (Lei 12.830/2013). MP e Juiz NÃO podem requisitar. Baseado em CONVICÇÃO (não mero indício). Desindicia: o próprio delegado.",
    keyPoint: "Indiciamento: ato privativo do delegado, fundamentado, com elementos de convicção. MP e juiz não requisitam. Desindiciamento: delegado. Preso: indiciar antes do fim do prazo IP.",
    practicalExample: "Promotor informa ao delegado que 'deve' indiciar determinado investigado. Delegado pode recusar: indiciamento é ato de discricionariedade técnica do delegado — não pode ser requisitado pelo MP (Lei 12.830/2013, art. 2°, §6°).",
    difficulty: "MEDIO",
  },
  {
    id: "dpp_in_c06",
    topicName: "Inquérito Policial",
    title: "IP — Arquivamento e Pacote Anticrime (art. 28 CPP)",
    textContent: `O arquivamento do IP representa a decisão de não oferecer denúncia. O Pacote Anticrime (Lei 13.964/2019) alterou profundamente o art. 28 do CPP.

NOVA REGRA — art. 28 CPP (Pacote Anticrime):
• O MP requer o arquivamento → envia ao ÓRGÃO SUPERIOR do MP (ex: CNMP, Câmaras de Revisão Ministerial).
• O JUIZ NÃO mais homologa o arquivamento — retirado o controle judicial do arquivamento.
• Se o órgão superior concordar → arquiva.
• Se discordar → designa outro promotor para oferecer denúncia ou requisitar diligências.

EFEITOS DO ARQUIVAMENTO:
• Atipicidade ou extinção da punibilidade → coisa julgada MATERIAL → não pode ser reaberto jamais.
• Insuficiência de provas (art. 18 CPP) → coisa julgada FORMAL → pode ser reaberto com novas provas.

VÍTIMA: Pode impugnar o arquivamento junto ao órgão superior do MP (nova legitimidade — Pacote Anticrime).`,
    mnemonic: "Arquivamento pós-Pacote: MP requer → CNMP/órgão superior decide (NÃO o juiz). Atipicidade = coisa julgada MATERIAL (não reabre). Insuficiência = formal (reabre com novas provas — art. 18 CPP).",
    keyPoint: "Pacote Anticrime: arquivamento vai ao CNMP/órgão superior, não ao juiz. Atipicidade: coisa julgada material. Insuficiência de provas: coisa julgada formal (art. 18 CPP — reabre com novas provas).",
    practicalExample: "Promotor requer arquivamento por insuficiência de provas. Um ano depois, testemunha nova aparece. Delegado pode instaurar novo IP: arquivamento por falta de provas não faz coisa julgada material (art. 18 CPP).",
    difficulty: "DIFICIL",
  },
  // ── Prisões ─────────────────────────────────────────────────────────────
  {
    id: "dpp_pr_c01",
    topicName: "Prisões",
    title: "Prisão em Flagrante: Modalidades e Formalidades",
    textContent: `A prisão em flagrante é medida pré-cautelar de natureza administrativa. Qualquer pessoa pode prender em flagrante (facultativo); policiais têm obrigação (art. 301 CPP).

MODALIDADES (art. 302 CPP):
I — PRÓPRIO (real): cometendo a infração ou acabando de cometê-la.
II — IMPRÓPRIO (quase-flagrante): perseguido logo após pela autoridade, ofendido ou qualquer pessoa.
III — FICTO (presumido): encontrado logo depois com instrumentos, armas, objetos que façam presumir a autoria.

FLAGRANTE PREPARADO/PROVOCADO: ilícito — Súmula 145 STF — crime impossível pela indução policial. Nulidade absoluta.
FLAGRANTE ESPERADO: lícito — autoridade aguarda o crime acontecer sem induzir.
FLAGRANTE PRORROGADO (ação controlada): Lei de Drogas e ORCA — retarda-se a ação policial para capturar mais membros da organização.

FORMALIDADES: Lavratura do APFD. Nota de culpa em 24h. Audiência de custódia em até 24h após a prisão (CNJ/Pacote Anticrime).`,
    mnemonic: "Flagrante: PRÓPRIO (cometendo), IMPRÓPRIO (perseguido logo após), FICTO (encontrado logo depois). Preparado = ILÍCITO (Súmula 145 STF). Esperado = LÍCITO. Nota de culpa: 24h. Audiência custódia: 24h.",
    keyPoint: "Modalidades: próprio, impróprio, ficto. Preparado = ilícito (Súmula 145 STF). Esperado = lícito. Ação controlada = prorrogado. Nota de culpa 24h. Audiência de custódia 24h.",
    practicalExample: "Policial se passa por comprador de drogas e convence suspeito a vender. Flagrante preparado: ilícito. Súmula 145 STF — crime impossível. Preso deve ser liberado — nulidade absoluta do flagrante.",
    difficulty: "MEDIO",
  },
  {
    id: "dpp_pr_c02",
    topicName: "Prisões",
    title: "Prisão Preventiva: Requisitos, Fundamentos e Pacote Anticrime",
    textContent: `A prisão preventiva é medida cautelar decretada pelo juiz, a requerimento das partes ou do MP. Após o Pacote Anticrime, nunca de ofício.

REQUISITOS CUMULATIVOS (art. 312 CPP):
• FUMUS COMISSI DELICTI: prova da existência do crime (materialidade) + indícios suficientes de autoria.
• PERICULUM LIBERTATIS: pelo menos um dos fundamentos.

FUNDAMENTOS — basta UM (art. 312 CPP):
1. Garantia da ORDEM PÚBLICA (risco de reiteração criminosa).
2. Garantia da ORDEM ECONÔMICA.
3. CONVENIÊNCIA DA INSTRUÇÃO CRIMINAL (risco de destruição de provas).
4. APLICAÇÃO DA LEI PENAL (risco de fuga).

VEDAÇÕES: Preventiva não pode se basear exclusivamente em gravidade abstrata do crime, clamor público ou reincidência isolada.

PACOTE ANTICRIME (Lei 13.964/2019):
• Preventiva NUNCA de ofício (nem no processo — só a requerimento).
• Revisão periódica obrigatória a cada 90 dias.
• Prisão domiciliar como substituta (art. 318 CPP).`,
    mnemonic: "Preventiva = fumus + periculum. Fundamentos GOCA: Garantia Ordem pública, Ordem econômica, Conveniência instrução, Aplicação lei penal. Pacote: nunca de ofício; revisão 90 dias.",
    keyPoint: "Preventiva: fumus comissi delicti + periculum libertatis. Fundamentos GOCA. Pós-Pacote: nunca de ofício; revisão a cada 90 dias. Clamor público isolado NÃO fundamenta.",
    practicalExample: "Réu responde processo em liberdade, mas começa a intimidar testemunhas. Juiz pode decretar preventiva por conveniência da instrução criminal — com requerimento do MP (nunca de ofício após Pacote Anticrime).",
    difficulty: "DIFICIL",
  },
  {
    id: "dpp_pr_c03",
    topicName: "Prisões",
    title: "Prisão Temporária e Liberdade Provisória",
    textContent: `PRISÃO TEMPORÁRIA (Lei 7.960/1989):
Cabível EXCLUSIVAMENTE na fase de INQUÉRITO POLICIAL. Nunca na fase processual.

PRAZOS:
• Crimes comuns: 5 dias + prorrogação por mais 5 dias (total: 10 dias).
• Crimes hediondos e equiparados (Lei 8.072/1990): 30 dias + prorrogação por mais 30 dias (total: 60 dias).

DECRETAÇÃO: Só por ordem judicial, a requerimento do delegado ou do MP. Juiz NÃO decreta de ofício.

CABIMENTO (art. 1°, Lei 7.960):
I — Quando imprescindível para as investigações do IP.
III — Quando o indiciado praticou crimes do rol taxativo (homicídio doloso, sequestro, roubo, extorsão, tráfico, etc.).

LIBERDADE PROVISÓRIA:
• Com fiança: delegado concede (pena ≤ 4 anos); juiz (acima).
• Sem fiança: crimes inafiançáveis ainda admitem liberdade provisória SEM fiança (STF + Pacote Anticrime).
• Audiência de custódia (24h): juiz analisa legalidade da prisão e decide sobre medidas cautelares.`,
    mnemonic: "Temporária = só IP. 5+5d (comum) / 30+30d (hediondo). Nunca de ofício. LP sem fiança: possível mesmo em inafiançáveis (STF). Audiência custódia: 24h após prisão.",
    keyPoint: "Temporária: só IP, 5+5d (comuns) / 30+30d (hediondos), nunca de ofício. Liberdade provisória sem fiança: admitida mesmo em inafiançáveis (STF). Audiência de custódia em 24h.",
    practicalExample: "Delegado pede temporária para suspeito de roubo. Juiz concede por 5 dias (prorrogáveis por +5). Processo iniciado: temporária cessa — é exclusiva do IP. Na fase processual, cabe preventiva, nunca temporária.",
    difficulty: "MEDIO",
  },
];

// ============================================
// QUESTÕES — Bloco 1: dpp_in_c01–c03 (24q)
// ============================================

const questions: Question[] = [
  // ── dpp_in_c01 — Conceito/Natureza/Dispensabilidade (8q) ───────────────
  {
    id: "dpp_in_c01_q01",
    contentId: "dpp_in_c01",
    statement: "Acerca do inquérito policial (IP) e sua natureza jurídica, assinale a opção correta.",
    alternatives: [
      { letter: "A", text: "O IP é um processo judicial de natureza inquisitória, sujeito ao contraditório diferido." },
      { letter: "B", text: "O IP é procedimento administrativo pré-processual, presidido pelo delegado de polícia, com a finalidade de apurar autoria e materialidade de infrações penais." },
      { letter: "C", text: "O IP integra o processo penal de conhecimento, razão pela qual as provas nele colhidas têm valor probatório pleno." },
      { letter: "D", text: "A ausência do IP implica nulidade da ação penal, por constituir pressuposto processual indispensável." },
      { letter: "E", text: "O IP é de natureza jurisdicional, pois é presidido por autoridade do Estado com poder de coerção." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O IP é procedimento administrativo pré-processual, presidido pelo delegado, para apurar autoria e materialidade. Não é processo judicial, não integra o processo penal e é dispensável.",
    explanationCorrect: "B: IP = procedimento administrativo pré-processual, inquisitório, presidido pelo delegado. Serve de base informativa para o MP, mas não é processo judicial nem integra o processo penal.",
    explanationWrong: "A: IP não é processo judicial. C: IP não integra o processo penal — é pré-processual. D: IP é dispensável; sua ausência não nulifica a ação penal. E: IP não tem natureza jurisdicional — é procedimento administrativo.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c01_q02",
    contentId: "dpp_in_c01",
    statement: "O Ministério Público ofereceu denúncia por roubo circunstanciado com base em boletim de ocorrência, APFD e laudo pericial, sem aguardar a conclusão do inquérito policial. Essa conduta é:",
    alternatives: [
      { letter: "A", text: "Nula, pois a denúncia deve sempre ser precedida de inquérito policial devidamente encerrado." },
      { letter: "B", text: "Irregular, mas sanável, pois o IP é condição de procedibilidade da ação penal pública." },
      { letter: "C", text: "Lícita, porque o inquérito policial é dispensável quando o MP já dispõe de elementos suficientes para o oferecimento da denúncia." },
      { letter: "D", text: "Vedada, pois o APFD só autoriza denúncia se o réu permanecer preso." },
      { letter: "E", text: "Válida somente se o delegado expressamente autorizar a dispensa do IP." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O IP é dispensável (art. 39, §5° CPP). O MP pode oferecer denúncia com outras peças de informação — APFD, BO, laudo — sem aguardar o encerramento do IP.",
    explanationCorrect: "C: art. 39, §5° CPP — o MP pode dispensar o IP quando já tiver elementos suficientes. APFD + laudo + BO são peças de informação aptas a embasar a denúncia.",
    explanationWrong: "A e B: IP não é condição de procedibilidade obrigatória. D: APFD não condiciona a denúncia à manutenção da prisão. E: o delegado não tem poder de autorizar ou negar a dispensa do IP ao MP.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c01_q03",
    contentId: "dpp_in_c01",
    statement: "Segundo a Lei 12.830/2013, a presidência do inquérito policial cabe:",
    alternatives: [
      { letter: "A", text: "Ao juiz de direito, por ser o IP um procedimento de natureza jurisdicional." },
      { letter: "B", text: "Ao Ministério Público, como titular da ação penal pública." },
      { letter: "C", text: "Ao delegado de polícia, como autoridade policial competente." },
      { letter: "D", text: "À autoridade policial militar, nos crimes praticados em área de segurança nacional." },
      { letter: "E", text: "Ao magistrado ou ao membro do MP, conforme a complexidade do crime investigado." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A Lei 12.830/2013 estabelece que a presidência do IP cabe ao delegado de polícia. O MP exerce controle externo, mas não preside o IP.",
    explanationCorrect: "C: Lei 12.830/2013, art. 2° — o delegado de polícia preside o IP. É ato de sua atribuição exclusiva, junto com o indiciamento (§6°).",
    explanationWrong: "A: IP não tem natureza jurisdicional. B: MP é titular da ação penal, mas não preside o IP — exerce controle externo. D e E: o IP é presidido exclusivamente pelo delegado.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c01_q04",
    contentId: "dpp_in_c01",
    statement: "O inquérito policial NÃO pode ser instaurado de ofício pelo delegado de polícia quando se tratar de:",
    alternatives: [
      { letter: "A", text: "Crime de homicídio doloso praticado em via pública." },
      { letter: "B", text: "Crime de tráfico de drogas com réu em flagrante." },
      { letter: "C", text: "Crime de ameaça praticado contra adulto capaz, fora do contexto de violência doméstica." },
      { letter: "D", text: "Crime de roubo a estabelecimento comercial." },
      { letter: "E", text: "Crime de associação criminosa descoberto por investigação policial." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Ameaça (art. 147 CP) é crime de ação pública condicionada à representação. O delegado não pode instaurar IP de ofício — aguarda a representação da vítima.",
    explanationCorrect: "C: ameaça (art. 147 CP) é ação pública condicionada à representação do ofendido. Sem representação, o delegado não pode agir de ofício.",
    explanationWrong: "A, B, D e E: todos são crimes de ação pública incondicionada, nos quais o delegado pode instaurar IP de ofício por portaria ou APFD.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c01_q05",
    contentId: "dpp_in_c01",
    statement: "Com relação à natureza inquisitória do inquérito policial e seus reflexos probatórios, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "As provas colhidas no IP têm valor probatório pleno, equiparando-se às produzidas em juízo sob o crivo do contraditório." },
      { letter: "B", text: "O IP não admite nenhuma prova — todo elemento deve ser reproduzido em juízo para ter validade." },
      { letter: "C", text: "Os elementos do IP são informativos e, em regra, devem ser reproduzidos em juízo para fundamentar condenação — salvo provas não repetíveis." },
      { letter: "D", text: "A ausência de contraditório no IP contamina automaticamente as provas produzidas em juízo sobre os mesmos fatos." },
      { letter: "E", text: "O IP é peça acusatória, pois documenta os indícios contra o investigado." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Elementos do IP são informativos. Em regra, para fundamentar condenação devem ser reproduzidos em juízo. Exceção: provas não repetíveis (laudos periciais, exame de corpo de delito).",
    explanationCorrect: "C: os elementos do IP são informativos — a condenação deve se basear em provas produzidas em contraditório judicial. Exceção: provas cautelares, antecipadas e não repetíveis têm validade sem repetição.",
    explanationWrong: "A: provas do IP não têm valor pleno para condenação. B: laudos periciais (irrepetiveis) têm validade sem repetição. D: ausência de contraditório no IP não contamina provas judiciais posteriores. E: IP é peça de investigação, não acusatória.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c01_q06",
    contentId: "dpp_in_c01",
    statement: "Nos crimes de ação penal privada, a instauração do inquérito policial depende de:",
    alternatives: [
      { letter: "A", text: "Representação do ofendido, requisição do MP ou portaria do delegado." },
      { letter: "B", text: "Requisição do juiz competente para o processo criminal." },
      { letter: "C", text: "Requerimento do ofendido ou de seu representante legal, exclusivamente." },
      { letter: "D", text: "Portaria do delegado de ofício, desde que haja notícia do crime." },
      { letter: "E", text: "Requisição do Ministério Público, por força do controle externo da atividade policial." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Para crimes de ação penal privada, o IP só pode ser instaurado mediante requerimento do ofendido ou seu representante legal (art. 5°, §5° CPP). O delegado não age de ofício.",
    explanationCorrect: "C: art. 5°, §5° CPP — nos crimes de ação privada, o IP depende exclusivamente de requerimento do ofendido ou representante legal.",
    explanationWrong: "A: representação é para ação condicionada, não privada. B: juiz não requisita instauração de IP em ação privada. D: delegado não instaura de ofício em ação privada. E: MP não requisita IP em ação privada — não é o titular.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c01_q07",
    contentId: "dpp_in_c01",
    statement: "Quanto ao controle externo da atividade policial exercido pelo Ministério Público, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "O MP pode avocar para si a presidência do IP quando verificar irregularidade na condução pelo delegado." },
      { letter: "B", text: "O MP pode requisitar diligências e documentos ao delegado, mas não pode presidir o IP nem avocar sua direção." },
      { letter: "C", text: "O controle externo do MP abrange a prerrogativa de indiciar o suspeito quando o delegado se recusar a fazê-lo." },
      { letter: "D", text: "O MP e o delegado têm poderes concorrentes para presidir o IP, conforme entendimento do STJ." },
      { letter: "E", text: "O controle externo do MP sobre a atividade policial é prerrogativa exclusiva do Procurador-Geral de Justiça." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O MP exerce controle externo (art. 129, VII CF), podendo requisitar diligências e documentos, mas não pode presidir o IP nem avocar sua direção — presidência é ato privativo do delegado.",
    explanationCorrect: "B: controle externo do MP = requisição de diligências, informações e documentos. Não inclui presidência do IP nem avocação. Presidência e indiciamento: privativos do delegado (Lei 12.830/2013).",
    explanationWrong: "A e D: presidência do IP é exclusiva do delegado. C: indiciamento é ato privativo do delegado — MP não pode requisitar. E: controle externo não é exclusivo do PGJ — qualquer membro do MP pode requisitar diligências no âmbito de suas atribuições.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c01_q08",
    contentId: "dpp_in_c01",
    statement: "O investigado preso em flagrante por crime de furto qualificado é interrogado no IP sem advogado. Sua confissão registrada no IP:",
    alternatives: [
      { letter: "A", text: "É nula de pleno direito, pois todo ato sem advogado é inválido no ordenamento brasileiro." },
      { letter: "B", text: "Tem valor pleno como elemento de convicção para fundamentar condenação, pois o IP é inquisitório." },
      { letter: "C", text: "Pode ser utilizada como elemento informativo para embasar a denúncia, mas não pode, por si só, fundamentar condenação." },
      { letter: "D", text: "Só terá validade se o investigado assinar o termo na presença de duas testemunhas." },
      { letter: "E", text: "É plenamente válida para condenação, pois o IP é fase administrativa sem exigência de contraditório." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A confissão no IP é elemento informativo — embasa a denúncia mas não basta para condenação. Precisa ser confirmada em juízo sob contraditório para ter peso probatório suficiente.",
    explanationCorrect: "C: confissão no IP é elemento informativo (caráter inquisitório). Para condenar, o juiz não pode se basear exclusivamente em elementos do IP — precisa de provas produzidas em contraditório judicial.",
    explanationWrong: "A: ausência de advogado no IP não invalida automaticamente o ato — IP é inquisitório, sem contraditório pleno. B e E: confissão no IP não tem valor probatório pleno para condenação. D: a lei não exige testemunhas para validade da confissão no IP.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── dpp_in_c02 — SEIDO (8q) ─────────────────────────────────────────────
  {
    id: "dpp_in_c02_q01",
    contentId: "dpp_in_c02",
    statement: "A Súmula Vinculante n.º 14 do STF, aplicada ao inquérito policial sigiloso, garante ao advogado do investigado:",
    alternatives: [
      { letter: "A", text: "Acesso a todos os atos investigativos futuros, inclusive diligências ainda não documentadas nos autos." },
      { letter: "B", text: "Acesso amplo a todos os elementos de informação já documentados nos autos do IP, independentemente de decreto de sigilo." },
      { letter: "C", text: "Acesso somente às peças relativas ao seu cliente, excluídas aquelas que digam respeito a outros investigados." },
      { letter: "D", text: "Nenhum acesso ao IP sigiloso, sob pena de comprometer as investigações." },
      { letter: "E", text: "Acesso ao IP somente após a conclusão das diligências e remessa ao MP." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A SV 14 garante ao advogado acesso a todos os elementos já documentados no IP, mesmo sigiloso. O sigilo não pode ser oposto ao defensor para elementos já registrados nos autos.",
    explanationCorrect: "B: SV 14 — 'é direito do defensor ter acesso amplo aos elementos de prova que, já documentados em procedimento investigatório realizado por órgão com competência de polícia judiciária, digam respeito ao exercício do direito de defesa'.",
    explanationWrong: "A: acesso é aos elementos já documentados — não às diligências futuras em andamento. C: o acesso não se restringe às peças do cliente. D e E: o sigilo do IP não pode ser oposto ao advogado para elementos já documentados.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c02_q02",
    contentId: "dpp_in_c02",
    statement: "A característica 'inquisitório' do inquérito policial significa que:",
    alternatives: [
      { letter: "A", text: "O investigado tem direito ao contraditório e à ampla defesa plenos em todas as fases do IP, conforme a CF/88." },
      { letter: "B", text: "O IP é conduzido sem contraditório e ampla defesa plenos, pois o investigado é objeto da investigação, não parte processual." },
      { letter: "C", text: "O delegado tem poderes ilimitados para prender e interrogar qualquer pessoa sem autorização judicial." },
      { letter: "D", text: "As provas colhidas no IP têm valor probatório superior às produzidas em juízo." },
      { letter: "E", text: "O investigado não tem direito ao silêncio no IP, pois esse direito é restrito ao processo judicial." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Inquisitório = sem contraditório e ampla defesa plenos. O investigado não é réu — é objeto da investigação. O direito ao silêncio existe (CF art. 5°, LXIII), mas não há contraditório pleno.",
    explanationCorrect: "B: característica inquisitória = ausência de contraditório pleno e ampla defesa no IP. O investigado é objeto da investigação, não parte com paridade processual.",
    explanationWrong: "A: contraditório e ampla defesa plenos são garantidos no processo penal, não no IP. C: delegado tem poderes limitados — diversas restrições legais. D: provas do IP são elementos informativos. E: direito ao silêncio existe no IP (CF art. 5°, LXIII).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c02_q03",
    contentId: "dpp_in_c02",
    statement: "Quanto ao caráter oficial do inquérito policial, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "Particulares podem presidir investigações equiparadas ao IP quando autorizados pelo juiz." },
      { letter: "B", text: "O IP pode ser presidido tanto pelo delegado de polícia civil quanto pelo delegado de polícia federal, conforme a atribuição." },
      { letter: "C", text: "Qualquer servidor público com poder de coerção pode presidir o IP." },
      { letter: "D", text: "O MP pode presidir o IP quando o delegado estiver suspeito de parcialidade." },
      { letter: "E", text: "O caráter oficial admite que o Ministério da Justiça presida IPs de natureza federal." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Oficial = conduzido por autoridade pública competente. IP é presidido por delegado de polícia (federal ou civil), conforme a competência. Nenhum outro agente pode presidir.",
    explanationCorrect: "B: o IP é conduzido por delegado de polícia — federal (PF) ou civil (PC dos estados), conforme a atribuição constitucional e legal.",
    explanationWrong: "A: particulares não presidem IPs. C: não basta ser servidor com poder de coerção — exige-se delegado de polícia (Lei 12.830/2013). D: MP não preside IP. E: Ministério da Justiça não preside IPs.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c02_q04",
    contentId: "dpp_in_c02",
    statement: "O delegado decreta sigilo no inquérito policial que apura crime organizado. O investigado constitui advogado, que solicita vista dos autos. O delegado pode:",
    alternatives: [
      { letter: "A", text: "Negar acesso integralmente, pois o sigilo foi decretado antes da constituição do advogado." },
      { letter: "B", text: "Conceder acesso apenas às peças relativas à qualificação do investigado, negando acesso às demais." },
      { letter: "C", text: "Conceder acesso a todos os elementos de informação já documentados nos autos, em razão da SV 14 do STF." },
      { letter: "D", text: "Negar acesso com fundamento no art. 20 CPP, que confere ao delegado poder absoluto sobre o sigilo." },
      { letter: "E", text: "Conceder acesso somente após autorização judicial expressa." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A SV 14 garante ao advogado acesso amplo aos elementos já documentados, mesmo em IP sigiloso. O sigilo não pode ser oposto ao defensor para obstar o acesso ao que já consta nos autos.",
    explanationCorrect: "C: SV 14 — o sigilo do IP não pode ser oposto ao advogado do investigado para negar acesso aos elementos já documentados. O defensor tem direito subjetivo independentemente do decreto de sigilo.",
    explanationWrong: "A, B e D: o art. 20 CPP não confere poder absoluto para negar acesso ao advogado — a SV 14 limita esse poder. E: a autorização judicial não é condição para o advogado acessar elementos já documentados.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c02_q05",
    contentId: "dpp_in_c02",
    statement: "Qual das alternativas apresenta uma característica que NÃO integra o mnemônico S.E.I.D.O. do inquérito policial?",
    alternatives: [
      { letter: "A", text: "Sigiloso." },
      { letter: "B", text: "Escrito." },
      { letter: "C", text: "Irrecorrível." },
      { letter: "D", text: "Dispensável." },
      { letter: "E", text: "Oficial." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O mnemônico SEIDO = Sigiloso, Escrito, Inquisitório, Dispensável, Oficial. 'Irrecorrível' não é característica do IP — existem controles contra atos do IP (habeas corpus, mandado de segurança).",
    explanationCorrect: "C: 'Irrecorrível' não integra o SEIDO. O SEIDO é: Sigiloso (A), Escrito (B), Inquisitório, Dispensável (D), Oficial (E). Atos do IP podem ser impugnados por HC ou MS.",
    explanationWrong: "A (S), B (E), D (D) e E (O) são características corretas do SEIDO. Apenas C (Irrecorrível) está fora do mnemônico — o IP admite impugnação por HC e MS.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c02_q06",
    contentId: "dpp_in_c02",
    statement: "No que tange ao caráter escrito do inquérito policial (art. 9.º do CPP), é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "As declarações orais colhidas no IP valem independentemente de redução a termo, por força do princípio da informalidade." },
      { letter: "B", text: "Todos os atos praticados no IP devem ser reduzidos a escrito, sendo essa exigência essencial para a validade da investigação." },
      { letter: "C", text: "O caráter escrito admite exceção nos crimes praticados por meios eletrônicos, onde a gravação de áudio substitui o termo." },
      { letter: "D", text: "Somente os atos decisórios do delegado precisam ser reduzidos a termo — os demais podem ser orais." },
      { letter: "E", text: "O art. 9.º CPP foi revogado pelo Pacote Anticrime, que admitiu o IP digital sem redução a termo." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Art. 9° CPP: todos os atos do IP devem ser reduzidos a escrito ou datilografados. Exigência abrange todos os atos — depoimentos, declarações, diligências.",
    explanationCorrect: "B: art. 9° CPP — 'todas as peças do inquérito policial serão, num só processado, reduzidas a escrito ou datilografadas'. Exigência de todos os atos, não apenas dos decisórios.",
    explanationWrong: "A: informalidade não se aplica ao IP — exige-se redução a termo. C: não há exceção para crimes eletrônicos. D: a exigência abrange todos os atos. E: o Pacote Anticrime não revogou o art. 9° CPP.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c02_q07",
    contentId: "dpp_in_c02",
    statement: "Investigado em IP sigiloso afirma que o delegado lhe negou o direito de permanecer calado durante o interrogatório. Considerando as garantias constitucionais, assinale a opção correta.",
    alternatives: [
      { letter: "A", text: "O delegado agiu corretamente, pois o direito ao silêncio é restrito à fase judicial e não se aplica ao IP." },
      { letter: "B", text: "O direito ao silêncio se aplica ao IP, pois decorre diretamente da CF/88 (art. 5.º, LXIII) e não pode ser afastado pelo caráter inquisitório." },
      { letter: "C", text: "O direito ao silêncio no IP cabe apenas ao preso em flagrante, não ao investigado solto." },
      { letter: "D", text: "O caráter inquisitório do IP autoriza o delegado a compelir o investigado a responder as perguntas." },
      { letter: "E", text: "O sigilo do IP implica que o investigado não pode invocar garantias constitucionais dentro do procedimento." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O direito ao silêncio (CF art. 5°, LXIII) aplica-se em qualquer fase — IP ou processo judicial. O caráter inquisitório não autoriza compelir o investigado a falar.",
    explanationCorrect: "B: CF art. 5°, LXIII — o STF estende o direito ao silêncio a qualquer investigado (preso ou não) em qualquer fase. O caráter inquisitório do IP não afasta garantias constitucionais.",
    explanationWrong: "A: direito ao silêncio é constitucional — aplica-se ao IP. C: não é restrito ao preso em flagrante. D: caráter inquisitório não autoriza compelir depoimento. E: sigilo do IP não afasta garantias constitucionais do investigado.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c02_q08",
    contentId: "dpp_in_c02",
    statement: "A dispensabilidade do inquérito policial significa que:",
    alternatives: [
      { letter: "A", text: "O MP pode oferecer denúncia sem qualquer elemento de informação, desde que haja notícia do crime." },
      { letter: "B", text: "O delegado pode dispensar a lavratura do APFD nos crimes de menor potencial ofensivo." },
      { letter: "C", text: "O IP pode ser dispensado quando o MP já dispuser de elementos suficientes para oferecer a denúncia, como documentos, perícias e TCO." },
      { letter: "D", text: "O juiz pode dispensar o IP nos crimes culposos para agilizar o processo." },
      { letter: "E", text: "A dispensabilidade aplica-se somente nos crimes de menor potencial ofensivo (pena ≤ 2 anos)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Dispensabilidade = MP pode oferecer denúncia com outras peças de informação quando já tiver elementos suficientes — sem necessidade do IP completo (art. 39, §5° CPP).",
    explanationCorrect: "C: art. 39, §5° CPP — o IP é dispensável quando o titular da ação penal já tem elementos suficientes. Vale para qualquer crime de ação pública — não se restringe a infrações de menor potencial.",
    explanationWrong: "A: não basta notícia — precisa de elementos mínimos de autoria e materialidade. B: o APFD é lavrado quando há flagrante — sua lavratura não se confunde com dispensabilidade do IP. D: o juiz não dispensa IP — essa avaliação cabe ao MP. E: a dispensabilidade não se restringe a crimes de menor potencial ofensivo.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── dpp_in_c03 — Instauração (8q) ───────────────────────────────────────
  {
    id: "dpp_in_c03_q01",
    contentId: "dpp_in_c03",
    statement: "Em qual das situações abaixo o delegado pode instaurar inquérito policial de ofício, por portaria, independentemente de requerimento ou representação?",
    alternatives: [
      { letter: "A", text: "Crime de ação penal privada descoberto durante ronda policial." },
      { letter: "B", text: "Crime de ameaça praticada por desconhecido contra adulto capaz, fora de violência doméstica." },
      { letter: "C", text: "Crime de furto qualificado descoberto por investigação policial rotineira." },
      { letter: "D", text: "Crime de lesão corporal leve praticado por desconhecido, fora do contexto de violência doméstica." },
      { letter: "E", text: "Crime de calúnia contra funcionário público fora do exercício das funções." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Furto qualificado é crime de ação pública incondicionada — o delegado pode instaurar IP de ofício por portaria. Os demais casos envolvem ação condicionada ou privada.",
    explanationCorrect: "C: furto (simples ou qualificado) é crime de ação pública incondicionada. O delegado pode instaurar IP de ofício (art. 5°, I CPP — por portaria).",
    explanationWrong: "A: ação privada — precisa de requerimento do ofendido. B: ameaça é ação condicionada à representação (art. 147 CP). D: lesão leve fora do contexto doméstico é ação condicionada à representação. E: calúnia é ação privada (art. 138 CP).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c03_q02",
    contentId: "dpp_in_c03",
    statement: "O Auto de Prisão em Flagrante Delito (APFD) como forma de instauração do inquérito policial:",
    alternatives: [
      { letter: "A", text: "Só pode ser lavrado nos crimes de ação pública incondicionada." },
      { letter: "B", text: "Equivale à portaria de instauração do IP e pode ser lavrado em qualquer crime que admita prisão em flagrante." },
      { letter: "C", text: "Dispensa o IP, encerrando a investigação e permitindo imediato oferecimento de denúncia." },
      { letter: "D", text: "Só é lavrado quando o suspeito é preso pela autoridade policial, nunca por particular." },
      { letter: "E", text: "Substitui o IP apenas nos crimes de menor potencial ofensivo." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O APFD equivale à portaria de instauração. Pode ser lavrado nos crimes que admitem flagrante, inclusive condicionados e privados (com a ressalva do ofendido).",
    explanationCorrect: "B: o APFD serve como forma de instauração do IP (art. 5°, II CPP). A lavratura pode ocorrer em crimes de ação pública incondicionada, condicionada e privada.",
    explanationWrong: "A: APFD pode ocorrer em crimes condicionados e privados também. C: APFD instaura o IP — não o encerra. D: qualquer pessoa pode prender em flagrante (art. 301 CPP); a autoridade policial lavra o APFD. E: em infrações de menor potencial ofensivo, lavra-se TCO, não APFD.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c03_q03",
    contentId: "dpp_in_c03",
    statement: "Sobre a requisição do Ministério Público para instauração de inquérito policial, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "A requisição do MP é discricionária para o delegado, que pode recusá-la por motivo fundamentado." },
      { letter: "B", text: "A requisição do MP é de cumprimento obrigatório pelo delegado, que não pode recusá-la, mas pode comunicar eventual ilegalidade ao órgão superior do MP." },
      { letter: "C", text: "O delegado pode recusar a requisição do MP se entender que não há justa causa para instauração." },
      { letter: "D", text: "Apenas o Procurador-Geral de Justiça pode requisitar a instauração de IP diretamente ao delegado." },
      { letter: "E", text: "A requisição do MP vale como APFD, substituindo a necessidade de portaria." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A requisição do MP obriga o delegado a instaurar o IP. Negar a requisição configura prevaricação. O delegado pode comunicar eventual ilegalidade ao órgão superior do MP.",
    explanationCorrect: "B: a requisição do MP é vinculante para o delegado (art. 5°, II CPP). O delegado deve cumprir, podendo comunicar eventual ilegalidade ao PGJ. Negar = prevaricação.",
    explanationWrong: "A e C: a requisição não é discricionária para o delegado — é obrigatória. D: qualquer membro do MP com atribuição pode requisitar o IP. E: a requisição é forma de instauração — não se confunde com APFD.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c03_q04",
    contentId: "dpp_in_c03",
    statement: "O Termo Circunstanciado de Ocorrência (TCO), lavrado nos crimes de menor potencial ofensivo, em relação ao inquérito policial:",
    alternatives: [
      { letter: "A", text: "É forma simplificada de IP, com os mesmos efeitos jurídicos e prazo de conclusão de 10 dias." },
      { letter: "B", text: "Substitui o IP nas infrações de menor potencial ofensivo (pena máxima ≤ 2 anos), remetendo os autos diretamente ao JECrim." },
      { letter: "C", text: "Deve ser seguido obrigatoriamente de IP, pois o TCO é apenas o registro inicial da ocorrência." },
      { letter: "D", text: "Só pode ser lavrado pelo delegado de polícia, nunca por agente de menor graduação." },
      { letter: "E", text: "É adotado para crimes de menor potencial ofensivo e também para crimes hediondos de fácil elucidação." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "TCO substitui o IP nas infrações de menor potencial ofensivo (pena máxima ≤ 2 anos — Lei 9.099/95). Os autos são remetidos ao JECrim, sem necessidade de IP completo.",
    explanationCorrect: "B: Lei 9.099/95, art. 69 — nas infrações de menor potencial ofensivo, a autoridade policial lavra TCO e encaminha ao JECrim, dispensando a instauração de IP.",
    explanationWrong: "A: TCO não é IP simplificado — é documento distinto, sem os mesmos prazos. C: TCO dispensa o IP, não o precede. D: a lei exige 'autoridade policial' — em alguns estados a PM pode lavrar. E: crimes hediondos nunca são de menor potencial ofensivo — TCO não se aplica.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c03_q05",
    contentId: "dpp_in_c03",
    statement: "Qualquer pessoa do povo que tiver conhecimento de crime de ação pública incondicionada:",
    alternatives: [
      { letter: "A", text: "Tem o dever jurídico de comunicar à autoridade policial, sob pena de prevaricação." },
      { letter: "B", text: "Pode comunicar verbalmente ou por escrito à autoridade policial, que verificará a procedência das informações." },
      { letter: "C", text: "Não pode comunicar diretamente ao delegado — deve fazê-lo ao MP, que decidirá pela instauração." },
      { letter: "D", text: "Só pode comunicar o crime se for testemunha direta do fato." },
      { letter: "E", text: "Tem legitimidade para requerer a instauração de IP, vinculando o delegado à instauração imediata." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Art. 5°, §3° CPP — qualquer pessoa pode comunicar o crime à autoridade policial (delatio criminis simples). O delegado verificará a procedência antes de instaurar o IP.",
    explanationCorrect: "B: art. 5°, §3° CPP — 'qualquer pessoa do povo que tiver conhecimento da existência de infração penal em que caiba ação pública poderá, verbalmente ou por escrito, comunicá-la à autoridade policial'. O delegado verificará a procedência.",
    explanationWrong: "A: a comunicação é faculdade do particular — não há dever legal (ao contrário do funcionário público em alguns casos). C: comunicação pode ser diretamente ao delegado. D: não precisa ser testemunha direta. E: a comunicação não vincula o delegado — ele verifica a procedência.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c03_q06",
    contentId: "dpp_in_c03",
    statement: "Em crime de ação penal pública condicionada à representação, o prazo para oferecimento da representação pela vítima é de:",
    alternatives: [
      { letter: "A", text: "30 dias a contar do fato criminoso." },
      { letter: "B", text: "6 meses a contar do conhecimento da autoria do crime." },
      { letter: "C", text: "1 ano a contar do fato criminoso, prorrogável por mais 6 meses." },
      { letter: "D", text: "Prazo indeterminado — a vítima pode representar a qualquer tempo antes da prescrição." },
      { letter: "E", text: "6 meses a contar do fato criminoso, independentemente do conhecimento da autoria." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Art. 38 CPP: o prazo para representação é de 6 meses a contar do dia em que o ofendido vier a saber quem é o autor do crime — não a partir do fato.",
    explanationCorrect: "B: art. 38 CPP — 'o ofendido decairá do direito de representação se não o exercer dentro do prazo de seis meses, contado do dia em que vier a saber quem é o autor do crime'.",
    explanationWrong: "A: 30 dias é prazo do IP com réu preso, não de representação. C: não há prazo de 1 ano para representação. D: decai após 6 meses. E: o marco inicial é o conhecimento da autoria, não o fato em si.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c03_q07",
    contentId: "dpp_in_c03",
    statement: "Policial militar atende ocorrência de violência doméstica. A vítima não quer registrar boletim de ocorrência. Sobre a atuação policial, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "O policial deve atender ao pedido da vítima, pois a instauração do IP depende de sua representação." },
      { letter: "B", text: "O policial deve lavrar o BO e conduzir os autos à delegacia, pois a lesão corporal em contexto de violência doméstica é crime de ação pública incondicionada (STF — ADI 4424)." },
      { letter: "C", text: "O policial só pode agir se a vítima formalizar representação no local." },
      { letter: "D", text: "A vítima pode retratar a representação até o recebimento da denúncia, o que torna dispensável a ação policial imediata." },
      { letter: "E", text: "A violência doméstica é crime de ação privada, cabendo exclusivamente à vítima decidir sobre o registro." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "STF (ADI 4424): lesão corporal no contexto de violência doméstica é crime de ação pública incondicionada. O policial deve lavrar o BO independentemente da vontade da vítima.",
    explanationCorrect: "B: ADI 4424 STF — lesão corporal em contexto de violência doméstica tem ação penal pública incondicionada. A vítima não pode impedir a lavratura do BO nem a instauração do IP.",
    explanationWrong: "A: violência doméstica (lesão corporal) é incondicionada — não depende de representação. C: não é necessária representação. D: retratação só é possível em crimes condicionados — não na violência doméstica. E: violência doméstica é crime de ação pública incondicionada.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c03_q08",
    contentId: "dpp_in_c03",
    statement: "Sobre o conflito de atribuições entre delegacias de polícia de diferentes estados para a presidência de um inquérito policial:",
    alternatives: [
      { letter: "A", text: "É dirimido pelo STF, por envolver autoridades de estados federados distintos." },
      { letter: "B", text: "É dirimido pelo STJ, por ser conflito entre órgãos de estados diferentes, sem caráter jurisdicional." },
      { letter: "C", text: "É dirimido pelo Procurador-Geral de Justiça do estado de maior população envolvida." },
      { letter: "D", text: "É dirimido pelo Conselho Nacional de Justiça (CNJ), por envolver atividade policial." },
      { letter: "E", text: "É dirimido pela Corregedoria de Polícia do estado em que o crime foi consumado." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "STJ é competente para dirimir conflitos de atribuições entre delegacias de estados diferentes, entre PF e polícia civil, e entre MP e autoridades policiais.",
    explanationCorrect: "B: o STJ dirime conflitos de atribuição entre delegacias de polícia civil de estados diferentes e entre PF × PC. Trata-se de competência constitucional implícita (art. 105 CF).",
    explanationWrong: "A: STF não dirime conflitos de atribuição policial. C: PGJ resolve conflitos dentro do mesmo estado. D: CNJ não tem competência sobre atividade policial. E: a Corregedoria não tem competência para dirimir conflitos de atribuição entre estados.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── dpp_in_c04 — Prazos do IP (8q) ──────────────────────────────────────
  {
    id: "dpp_in_c04_q01",
    contentId: "dpp_in_c04",
    statement: "Segundo o CPP (art. 10), o prazo para conclusão do inquérito policial quando o investigado estiver preso é de:",
    alternatives: [
      { letter: "A", text: "5 dias, improrrogáveis." },
      { letter: "B", text: "10 dias, não podendo ser prorrogado pelo CPP." },
      { letter: "C", text: "15 dias, prorrogáveis por mais 15 dias." },
      { letter: "D", text: "30 dias, prorrogáveis a requerimento do delegado." },
      { letter: "E", text: "20 dias, prorrogáveis uma única vez." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Art. 10 CPP: réu preso — 10 dias; réu solto — 30 dias. O prazo de 10 dias para o preso não é prorrogável pelo CPP (mas legislações especiais preveem prazos distintos).",
    explanationCorrect: "B: art. 10 CPP — 'O inquérito deverá terminar no prazo de 10 dias, se o indiciado tiver sido preso em flagrante, ou estiver preso preventivamente'. O prazo de 10 dias é o do CPP — legislações especiais (PF, Lei de Drogas) preveem prazos maiores.",
    explanationWrong: "A: 5 dias é o prazo da prisão temporária comum. C: 15+15 dias é o prazo da Polícia Federal (Lei 5.010/66). D: 30 dias é para réu solto no CPP. E: 20 dias não existe como prazo legal.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c04_q02",
    contentId: "dpp_in_c04",
    statement: "Na Polícia Federal, o prazo para conclusão do inquérito policial quando o investigado estiver preso é de:",
    alternatives: [
      { letter: "A", text: "10 dias, improrrogáveis, conforme o CPP." },
      { letter: "B", text: "15 dias, prorrogáveis por mais 15 dias mediante despacho do juiz." },
      { letter: "C", text: "30 dias, prorrogáveis por mais 30 dias em crimes hediondos." },
      { letter: "D", text: "20 dias, prorrogáveis uma única vez por requerimento do delegado." },
      { letter: "E", text: "15 dias, improrrogáveis, sob pena de constrangimento ilegal." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Na PF (Lei 5.010/1966): réu preso — 15 dias, prorrogáveis por mais 15 dias (total: 30 dias). Réu solto: 30 dias. Prazo maior que o do CPP.",
    explanationCorrect: "B: Lei 5.010/1966 — na PF, o prazo para réu preso é de 15 dias, prorrogável por mais 15 dias mediante despacho do juiz federal. Total máximo preso: 30 dias.",
    explanationWrong: "A: 10 dias é o prazo do CPP, não da PF. C: 30+30 dias é o prazo da Lei de Drogas. D: 20 dias não existe. E: o prazo de 15 dias na PF É prorrogável.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c04_q03",
    contentId: "dpp_in_c04",
    statement: "Em inquérito policial instaurado para apurar tráfico de drogas (Lei 11.343/2006), com o investigado preso, o prazo máximo para conclusão é de:",
    alternatives: [
      { letter: "A", text: "10 dias, prorrogáveis por mais 10 dias — total: 20 dias." },
      { letter: "B", text: "15 dias, prorrogáveis por mais 15 dias — total: 30 dias." },
      { letter: "C", text: "30 dias, prorrogáveis por mais 30 dias — total: 60 dias." },
      { letter: "D", text: "60 dias, improrrogáveis." },
      { letter: "E", text: "90 dias, prorrogáveis por mais 90 dias — total: 180 dias." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Lei 11.343/2006: réu preso — 30 dias, prorrogáveis por mais 30 dias (total: 60 dias). Réu solto: 90 dias, prorrogáveis por mais 90 dias.",
    explanationCorrect: "C: Lei 11.343/2006, art. 51 — IP por tráfico de drogas com réu preso: prazo de 30 dias, prorrogável por mais 30 dias. Réu solto: 90 + 90 dias.",
    explanationWrong: "A: 10+10 não é prazo previsto na Lei de Drogas. B: 15+15 é prazo da PF (Lei 5.010). D: 60 dias são improrrogáveis apenas se já for a soma de 30+30. E: 90+90 é o prazo para o réu SOLTO na Lei de Drogas, não preso.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c04_q04",
    contentId: "dpp_in_c04",
    statement: "Investigado preso preventivamente há 45 dias em inquérito policial conduzido pela Polícia Civil estadual. O delegado ainda não concluiu o IP. Essa situação configura:",
    alternatives: [
      { letter: "A", text: "Situação regular, pois o prazo de 30 dias ainda não foi atingido." },
      { letter: "B", text: "Constrangimento ilegal, autorizando impetração de habeas corpus para relaxamento da prisão por excesso de prazo." },
      { letter: "C", text: "Situação regular, pois o prazo para conclusão do IP com réu preso no CPP é de 60 dias." },
      { letter: "D", text: "Situação irregular, mas sem possibilidade de relaxamento — apenas de aceleração do IP pelo juiz." },
      { letter: "E", text: "Situação legal, pois a prorrogação automática está prevista no art. 10 do CPP." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "CPP: prazo para réu preso = 10 dias. Polícia Civil segue o CPP. 45 dias com réu preso na fase do IP (sem processo iniciado) configura excesso de prazo — constrangimento ilegal — HC cabível.",
    explanationCorrect: "B: art. 10 CPP — prazo máximo do IP com réu preso é 10 dias (CPP). 45 dias é excesso grave de prazo. Constrangimento ilegal configurado — HC é o remédio para relaxar a prisão.",
    explanationWrong: "A: 10 dias é o prazo do CPP para réu preso — 45 dias já ultrapassou em muito. C: 60 dias é o prazo total na Lei de Drogas, não no CPP. D: a consequência do excesso é o relaxamento via HC. E: não há prorrogação automática para réu preso no CPP.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c04_q05",
    contentId: "dpp_in_c04",
    statement: "O prazo para conclusão do inquérito policial, quando o investigado estiver SOLTO, segundo o CPP, é de:",
    alternatives: [
      { letter: "A", text: "10 dias, improrrogáveis." },
      { letter: "B", text: "15 dias, prorrogáveis por mais 15 dias." },
      { letter: "C", text: "30 dias, podendo ser prorrogado por despacho do juiz a requerimento da autoridade policial." },
      { letter: "D", text: "60 dias, prorrogáveis indefinidamente." },
      { letter: "E", text: "90 dias, prorrogáveis por mais 90 dias." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Art. 10 CPP: réu solto — 30 dias. Pode ser prorrogado por despacho do juiz, a requerimento da autoridade policial, quando a investigação for complexa.",
    explanationCorrect: "C: art. 10 CPP — quando o investigado está solto, o prazo do IP é de 30 dias, podendo ser prorrogado mediante despacho judicial a requerimento do delegado.",
    explanationWrong: "A: 10 dias é para réu PRESO no CPP. B: 15 dias (prorrogável) é da PF. D e E: 60/90 dias são prazos da Lei de Drogas, não do CPP.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c04_q06",
    contentId: "dpp_in_c04",
    statement: "Compare os prazos do IP para réu preso nas seguintes legislações: (I) CPP — (II) Polícia Federal — (III) Lei de Drogas. A sequência correta é:",
    alternatives: [
      { letter: "A", text: "I=10 dias / II=15+15 dias / III=30+30 dias." },
      { letter: "B", text: "I=15 dias / II=30+30 dias / III=10 dias." },
      { letter: "C", text: "I=30 dias / II=10 dias / III=60+60 dias." },
      { letter: "D", text: "I=10 dias / II=30 dias / III=15+15 dias." },
      { letter: "E", text: "I=5 dias / II=10+10 dias / III=30 dias." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CPP: 10 dias (preso). PF: 15 dias + 15 dias. Lei de Drogas: 30 dias + 30 dias. Quanto mais especializada a legislação, maior o prazo para investigações mais complexas.",
    explanationCorrect: "A: CPP art. 10 = 10 dias preso. PF (Lei 5.010/66) = 15 + 15 dias preso. Lei Drogas (Lei 11.343/06) = 30 + 30 dias preso. Progressão lógica: CPP < PF < Drogas.",
    explanationWrong: "B, C, D e E: invertem ou confundem os prazos. A memória correta: CPP=10 (base), PF=15+15 (dobra o preso), Drogas=30+30 (triplica). Para réu solto: CPP=30, PF=30, Drogas=90+90.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c04_q07",
    contentId: "dpp_in_c04",
    statement: "O investigado está preso há 35 dias em IP por tráfico de drogas (Lei 11.343/2006) conduzido pela PF. O prazo do IP ainda não foi prorrogado. Nessa situação:",
    alternatives: [
      { letter: "A", text: "Há excesso de prazo configurado — HC cabível para relaxamento da prisão." },
      { letter: "B", text: "A situação é regular, pois o prazo de 30 dias (prorrogável por mais 30) ainda está em curso." },
      { letter: "C", text: "O delegado federal deveria ter concluído em 15 dias — há excesso de prazo desde o 16.º dia." },
      { letter: "D", text: "A situação é regular, pois o prazo para tráfico é de 60 dias improrrogáveis." },
      { letter: "E", text: "O prazo de 30 dias da Lei de Drogas aplica-se apenas à polícia civil — na PF aplica-se o CPP (10 dias preso)." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Lei 11.343/2006: réu preso — 30 dias + prorrogação por mais 30 dias. Com 35 dias e sem prorrogação, ainda está dentro do prazo inicial de 30 dias (faltam 25 dias para expirar o prazo prorrogado).",
    explanationCorrect: "B: Lei de Drogas — prazo inicial com réu preso é 30 dias. 35 dias ainda está dentro da possibilidade de prorrogação (total até 60 dias). A situação é regular enquanto não ultrapassar os 60 dias.",
    explanationWrong: "A: 35 dias é irregular apenas se ultrapassar os 60 dias totais (30+30) sem conclusão. C: 15 dias é o prazo da PF para crimes comuns — tráfico usa a Lei de Drogas (30+30 dias). D: o prazo é prorrogável, não fixo em 60 dias improrrogáveis. E: a Lei de Drogas se aplica à PF também.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c04_q08",
    contentId: "dpp_in_c04",
    statement: "O remédio constitucional cabível para combater o excesso de prazo na conclusão do inquérito policial, com o investigado preso, é:",
    alternatives: [
      { letter: "A", text: "Mandado de segurança, pois o ato do delegado é ato de autoridade pública." },
      { letter: "B", text: "Habeas corpus, pois há ameaça ou violação ao direito de locomoção por constrangimento ilegal." },
      { letter: "C", text: "Mandado de injunção, pois há omissão de norma regulamentadora do prazo do IP." },
      { letter: "D", text: "Ação popular, pois o excesso de prazo lesiona o patrimônio público." },
      { letter: "E", text: "Recurso em sentido estrito, pois o CPP prevê esse recurso contra decisões do delegado." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O habeas corpus é o remédio constitucional para combater constrangimento ilegal ao direito de locomoção — o excesso de prazo do IP com réu preso é forma clássica de constrangimento ilegal.",
    explanationCorrect: "B: CF art. 5°, LXVIII — 'conceder-se-á habeas corpus sempre que alguém sofrer ou se achar ameaçado de sofrer violência ou coação em sua liberdade de locomoção, por ilegalidade ou abuso de poder'. Excesso de prazo = constrangimento ilegal = HC.",
    explanationWrong: "A: MS protege direito líquido e certo não amparado por HC ou HD — não se usa para liberdade de locomoção. C: MI é para omissão legislativa que inviabilize direito constitucional — não se aplica aqui. D: ação popular é para anular atos lesivos ao patrimônio público. E: RESE não é cabível contra atos do delegado no IP.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── dpp_in_c05 — Indiciamento: Lei 12.830/2013 (8q) ─────────────────────
  {
    id: "dpp_in_c05_q01",
    contentId: "dpp_in_c05",
    statement: "Segundo a Lei 12.830/2013, o indiciamento no inquérito policial é:",
    alternatives: [
      { letter: "A", text: "Ato privativo do Ministério Público, como titular da ação penal." },
      { letter: "B", text: "Ato privativo do delegado de polícia, que o realiza de forma fundamentada, com base em análise técnico-jurídica do fato." },
      { letter: "C", text: "Ato conjunto do delegado e do MP, exigindo concordância de ambos para sua validade." },
      { letter: "D", text: "Ato do juiz, que defere o indiciamento a requerimento do delegado ou do MP." },
      { letter: "E", text: "Ato administrativo vinculado, que o delegado deve praticar sempre que houver suspeita sobre determinada pessoa." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Lei 12.830/2013, art. 2°, §6° — o indiciamento é ato privativo e fundamentado do delegado, baseado em análise técnico-jurídica. Nem MP nem juiz podem requisitar.",
    explanationCorrect: "B: Lei 12.830/2013, art. 2°, §6° — 'O indiciamento, privativo do delegado de polícia, dar-se-á por ato fundamentado, mediante análise técnico-jurídica do fato, que deverá indicar a autoria, materialidade e suas circunstâncias'.",
    explanationWrong: "A: MP não realiza indiciamento — é titular da ação penal, não do indiciamento. C: não há ato conjunto — é privativo do delegado. D: juiz não inicia nem defere indiciamento. E: é discricionário técnico do delegado, não vinculado à mera suspeita.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c05_q02",
    contentId: "dpp_in_c05",
    statement: "O Ministério Público, insatisfeito com a ausência de indiciamento de determinado investigado, pode:",
    alternatives: [
      { letter: "A", text: "Requisitar ao delegado o indiciamento imediato, vinculando-o ao cumprimento." },
      { letter: "B", text: "Requerer ao juiz que determine o indiciamento pelo delegado." },
      { letter: "C", text: "Oferecer denúncia com base nos elementos do IP, independentemente do indiciamento formal." },
      { letter: "D", text: "Proceder ao indiciamento por ato próprio, no exercício do controle externo da atividade policial." },
      { letter: "E", text: "Avocar o IP para si e efetuar o indiciamento diretamente." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O indiciamento é ato privativo do delegado — MP e juiz não podem requisitar. Mas o MP pode oferecer denúncia sem indiciamento formal, com base nos elementos do IP (o indiciamento é pressuposto do IP, não da ação penal).",
    explanationCorrect: "C: o MP pode oferecer denúncia com base nos elementos informativos do IP, independentemente do indiciamento. O indiciamento não é pressuposto da ação penal — o MP avalia se tem elementos suficientes.",
    explanationWrong: "A e B: indiciamento não pode ser requisitado pelo MP nem pelo juiz (Lei 12.830/2013, art. 2°, §6°). D: MP não pode indiciar por ato próprio — não tem essa prerrogativa. E: MP não pode avocar o IP nem indiciar.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c05_q03",
    contentId: "dpp_in_c05",
    statement: "O delegado de polícia indicia pessoa com base em mero indício de suspeita, sem elementos suficientes de convicção. Esse indiciamento é:",
    alternatives: [
      { letter: "A", text: "Válido, pois basta a existência de suspeita razoável para justificar o indiciamento." },
      { letter: "B", text: "Irregular, pois a Lei 12.830/2013 exige que o indiciamento seja fundamentado em análise técnico-jurídica, com elementos suficientes de convicção." },
      { letter: "C", text: "Válido, pois o IP é inquisitório e não exige o mesmo rigor probatório do processo penal." },
      { letter: "D", text: "Irregular, mas sem consequências jurídicas, pois o indiciamento não produz efeitos sobre a liberdade do investigado." },
      { letter: "E", text: "Nulo apenas se o MP requerer ao juiz a declaração de nulidade do ato de indiciamento." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Lei 12.830/2013 exige que o indiciamento seja fundamentado com análise técnico-jurídica e elementos de convicção — não basta mero indício ou suspeita.",
    explanationCorrect: "B: Lei 12.830/2013, art. 2°, §6° — o indiciamento exige fundamentação com 'análise técnico-jurídica do fato' e 'elementos de convicção' sobre autoria, materialidade e circunstâncias. Mero indício ou suspeita é insuficiente.",
    explanationWrong: "A e C: a lei exige mais que suspeita — exige elementos de convicção e fundamentação técnica. D: o indiciamento produz efeitos (registro, comunicação, repercussão social e jurídica). E: a nulidade pode ser questionada por HC ou MS sem necessidade de requerimento prévio do MP.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c05_q04",
    contentId: "dpp_in_c05",
    statement: "Após o indiciamento, surge prova robusta de que o indiciado não praticou o crime. Nessa situação, o delegado:",
    alternatives: [
      { letter: "A", text: "Deve manter o indiciamento — apenas o juiz pode desfazê-lo durante o processo." },
      { letter: "B", text: "Pode promover o desindiciamento, por ser o indiciamento ato privativo do delegado, passível de revisão por ele mesmo." },
      { letter: "C", text: "Deve encaminhar os autos ao MP para que este requeira o desindiciamento ao juiz." },
      { letter: "D", text: "Deve aguardar o arquivamento pelo CNMP para que o indiciamento perca efeitos automaticamente." },
      { letter: "E", text: "Não pode desfazer o indiciamento — trata-se de ato administrativo com presunção de legalidade irreversível." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Como o indiciamento é ato privativo do delegado, o desindiciamento também é ato do próprio delegado — quando surgem provas de inocência ou de erro no ato de indiciar.",
    explanationCorrect: "B: o desindiciamento é realizado pelo próprio delegado — corolário lógico da privatividade do indiciamento. Se o delegado pode indiciar, pode também desindiaciar quando há prova de inocência ou equívoco.",
    explanationWrong: "A: o delegado não precisa aguardar o juiz. C: MP não tem poder de requerer desindiciamento formal ao juiz. D: o desindiciamento é ato do delegado — independe do arquivamento pelo CNMP. E: atos administrativos podem ser revistos — não há irreversibilidade.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c05_q05",
    contentId: "dpp_in_c05",
    statement: "O investigado se recusa a fornecer sua qualificação ao delegado durante o IP. Nessa situação, o delegado pode:",
    alternatives: [
      { letter: "A", text: "Prender o investigado em flagrante por desobediência." },
      { letter: "B", text: "Qualificá-lo por meio de testemunhas ou por identificação datiloscópica, conforme o art. 6.º, VIII do CPP." },
      { letter: "C", text: "Encerrar o IP por impossibilidade de prosseguimento." },
      { letter: "D", text: "Exigir a qualificação coercitivamente, pois a colaboração do investigado é obrigatória no IP inquisitório." },
      { letter: "E", text: "Requisitar ao juiz a condução coercitiva do investigado para fins de qualificação." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Art. 6°, VIII CPP: se o indiciado não souber ou não quiser se qualificar, a qualificação é feita por testemunhas ou por identificação datiloscópica (impressões digitais).",
    explanationCorrect: "B: art. 6°, VIII CPP — o delegado pode qualificar o investigado por outros meios quando este se recusa: testemunhas ou identificação datiloscópica. O direito ao silêncio inclui a não obrigação de se auto-qualificar.",
    explanationWrong: "A: recusa de qualificação não configura flagrante de desobediência — o direito ao silêncio abarca isso. C: o IP não é encerrado por falta de qualificação verbal — há outros meios. D: colaboração não é obrigatória — direito ao silêncio (CF art. 5°, LXIII). E: condução coercitiva para qualificação viola o direito ao silêncio (STF).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c05_q06",
    contentId: "dpp_in_c05",
    statement: "O juiz, ao verificar que determinado investigado não foi indiciado pelo delegado, pode:",
    alternatives: [
      { letter: "A", text: "Determinar o indiciamento, pois o controle judicial das investigações inclui essa prerrogativa." },
      { letter: "B", text: "Requisitar ao delegado o indiciamento, com prazo para cumprimento." },
      { letter: "C", text: "Não pode determinar nem requisitar o indiciamento — esse ato é privativo do delegado (Lei 12.830/2013)." },
      { letter: "D", text: "Avocar o IP e determinar o indiciamento por despacho judicial." },
      { letter: "E", text: "Encaminhar ofício ao MP determinando que este requeira o indiciamento ao delegado." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O indiciamento é ato privativo do delegado (Lei 12.830/2013, art. 2°, §6°). Nem o juiz nem o MP podem requisitar ou determinar o indiciamento.",
    explanationCorrect: "C: Lei 12.830/2013, art. 2°, §6° — indiciamento é ato privativo do delegado. O juiz não tem poder de determinar ou requisitar o indiciamento. Fazê-lo seria violação à autonomia técnica do delegado.",
    explanationWrong: "A, B e D: o juiz não pode determinar nem requisitar indiciamento — privatividade do delegado. E: o MP também não pode requisitar indiciamento ao delegado. O juiz não pode delegar ao MP uma prerrogativa que nenhum deles possui.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c05_q07",
    contentId: "dpp_in_c05",
    statement: "O indiciamento, por ser ato privativo do delegado, diferencia-se da mera condição de suspeito ou investigado porque:",
    alternatives: [
      { letter: "A", text: "O indiciado automaticamente perde a liberdade, enquanto o suspeito permanece em liberdade." },
      { letter: "B", text: "O indiciamento é ato formal fundamentado que aponta o investigado como provável autor, com indicação de autoria, materialidade e circunstâncias — gerando efeitos jurídicos específicos." },
      { letter: "C", text: "O suspeito tem contraditório pleno no IP, enquanto o indiciado perde esse direito." },
      { letter: "D", text: "O indiciado é processado pelo MP automaticamente, enquanto o suspeito ainda não está sujeito à ação penal." },
      { letter: "E", text: "A diferença é apenas formal — indiciado e investigado têm os mesmos direitos e situação jurídica." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O indiciamento é ato formal, fundamentado, que identifica o provável autor com análise técnica de autoria, materialidade e circunstâncias. Gera efeitos jurídicos (comunicação, registro, repercussão) distintos da mera suspeita.",
    explanationCorrect: "B: Lei 12.830/2013 — o indiciamento é ato fundamentado com análise técnico-jurídica que aponta autoria, materialidade e circunstâncias. Difere da condição de suspeito por sua formalidade e pela análise qualificada do delegado.",
    explanationWrong: "A: indiciamento não gera prisão automática. C: nem suspeito nem indiciado têm contraditório pleno no IP — ambos são objeto de investigação. D: o indiciamento não gera processamento automático pelo MP. E: a diferença é substancial — não apenas formal.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c05_q08",
    contentId: "dpp_in_c05",
    statement: "Sobre o indiciamento de pessoa presa em flagrante, segundo o CPP e a Lei 12.830/2013:",
    alternatives: [
      { letter: "A", text: "O indiciamento do preso deve ser realizado imediatamente após a lavratura do APFD, sob pena de nulidade." },
      { letter: "B", text: "O indiciamento do preso deve ocorrer dentro do prazo legal do IP, antes que o excesso de prazo configure constrangimento ilegal." },
      { letter: "C", text: "O preso em flagrante é automaticamente indiciado pelo próprio APFD, sem necessidade de ato formal de indiciamento." },
      { letter: "D", text: "O indiciamento do preso só pode ocorrer após 5 dias de investigação, para garantir análise suficiente dos elementos." },
      { letter: "E", text: "O preso em flagrante não pode ser indiciado antes da audiência de custódia." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O indiciamento do preso deve ocorrer dentro do prazo legal do IP (CPP: 10 dias; PF: 15 dias; Lei Drogas: 30 dias). O APFD não é ato de indiciamento — são atos distintos.",
    explanationCorrect: "B: o indiciamento do preso deve ocorrer antes do final do prazo do IP (10 dias no CPP, 15 dias na PF, 30 dias na Lei Drogas). Após o prazo, há excesso que configura constrangimento ilegal.",
    explanationWrong: "A: não há prazo imediato — deve ser dentro do prazo do IP, não necessariamente no primeiro ato. C: APFD e indiciamento são atos distintos — o APFD instaura o IP, o indiciamento é ato posterior fundamentado. D: não há prazo mínimo de 5 dias previsto em lei. E: audiência de custódia não é condição para o indiciamento.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── dpp_in_c06 — Arquivamento e Pacote Anticrime (8q) ───────────────────
  {
    id: "dpp_in_c06_q01",
    contentId: "dpp_in_c06",
    statement: "Com o advento do Pacote Anticrime (Lei 13.964/2019), a homologação do arquivamento do inquérito policial requerido pelo Ministério Público passou a ser feita por:",
    alternatives: [
      { letter: "A", text: "O juiz natural da causa, como ocorria antes do Pacote Anticrime." },
      { letter: "B", text: "O órgão superior do Ministério Público (ex: CNMP, Câmaras de Revisão), retirando o controle judicial do arquivamento." },
      { letter: "C", text: "O delegado de polícia, que pode discordar do arquivamento e prosseguir com as investigações." },
      { letter: "D", text: "O Procurador-Geral da República, independentemente da origem do IP." },
      { letter: "E", text: "O Conselho Nacional de Justiça (CNJ), como órgão de controle externo." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Pacote Anticrime alterou o art. 28 CPP: o arquivamento requerido pelo MP vai ao órgão superior do MP (CNMP/Câmaras de Revisão) — o juiz não mais homologa.",
    explanationCorrect: "B: novo art. 28 CPP (Pacote Anticrime) — quando o MP requer o arquivamento, os autos são remetidos ao órgão superior do MP. O controle do arquivamento é feito internamente pelo MP — o juiz foi retirado desse controle.",
    explanationWrong: "A: antes do Pacote, o juiz homologava (ou discordava e remetia ao PGJ). Isso foi alterado em 2019. C: o delegado não controla o arquivamento. D: o PGR só atua em casos de sua atribuição originária. E: CNJ controla o Judiciário — não o arquivamento ministerial.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c06_q02",
    contentId: "dpp_in_c06",
    statement: "O arquivamento do inquérito policial com fundamento na atipicidade da conduta produz:",
    alternatives: [
      { letter: "A", text: "Coisa julgada formal — pode ser reaberto se surgirem novas provas." },
      { letter: "B", text: "Coisa julgada material — impede definitivamente nova persecução penal pelos mesmos fatos." },
      { letter: "C", text: "Mera preclusão administrativa — o delegado pode reabrir as investigações a qualquer tempo." },
      { letter: "D", text: "Nenhum efeito de coisa julgada — o MP pode oferecer nova denúncia a qualquer momento." },
      { letter: "E", text: "Coisa julgada material apenas se houver absolvição judicial posterior." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Arquivamento por atipicidade = coisa julgada material. A conduta não é crime — nova persecução penal pelos mesmos fatos seria bis in idem.",
    explanationCorrect: "B: arquivamento por atipicidade (ou extinção da punibilidade) faz coisa julgada material — impede definitivamente a reabertura. A conduta não sendo crime, nenhuma nova prova pode alterar essa conclusão jurídica.",
    explanationWrong: "A: coisa julgada formal é para arquivamento por insuficiência de provas (art. 18 CPP) — admite reabertura com novas provas. C: não é mera preclusão administrativa — tem força de coisa julgada material. D: há efeito de coisa julgada — o MP não pode reabrir por atipicidade. E: não precisa de absolvição judicial — o arquivamento por atipicidade já produz coisa julgada material.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c06_q03",
    contentId: "dpp_in_c06",
    statement: "O arquivamento do inquérito policial por insuficiência de provas, nos termos do art. 18 do CPP, permite:",
    alternatives: [
      { letter: "A", text: "A reabertura das investigações se surgirem provas novas da materialidade ou autoria." },
      { letter: "B", text: "Que o MP ofereça nova denúncia com base nos mesmos elementos já existentes, sem necessidade de provas novas." },
      { letter: "C", text: "O prosseguimento do IP pelo delegado, independentemente da decisão de arquivamento, se ele discordar." },
      { letter: "D", text: "Que a vítima promova ação penal privada subsidiária com os mesmos elementos existentes." },
      { letter: "E", text: "A reabertura a qualquer tempo, mesmo sem novas provas, se o crime não tiver prescrito." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "Art. 18 CPP: arquivamento por insuficiência de provas = coisa julgada formal. Admite reabertura se surgirem provas novas da materialidade ou autoria (novum).",
    explanationCorrect: "A: art. 18 CPP — 'depois de ordenado o arquivamento do inquérito pela autoridade judiciária, por falta de base para a denúncia, a autoridade policial poderá proceder a novas pesquisas, se de outras provas tiver notícia'. Novas provas = reabertura possível.",
    explanationWrong: "B: os mesmos elementos já existentes não justificam nova denúncia — precisa de prova nova. C: o delegado não pode prosseguir no IP arquivado sem novas provas. D: ação penal privada subsidiária pressupõe inércia do MP — não vale após arquivamento com provas insuficientes. E: só com prova nova — não basta o prazo prescricional não ter corrido.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c06_q04",
    contentId: "dpp_in_c06",
    statement: "O Ministério Público requer o arquivamento do IP. O órgão superior do MP discorda. Nessa situação, segundo o art. 28 do CPP (Pacote Anticrime), o órgão superior deve:",
    alternatives: [
      { letter: "A", text: "Remeter os autos ao juiz para que este decida sobre o arquivamento." },
      { letter: "B", text: "Designar outro membro do MP para oferecer a denúncia ou requisitar diligências." },
      { letter: "C", text: "Determinar ao delegado que prossiga nas investigações por mais 30 dias." },
      { letter: "D", text: "Arquivar compulsoriamente, pois a decisão do MP de não oferecer denúncia é discricionária." },
      { letter: "E", text: "Intimar a vítima para que decida se quer ou não o prosseguimento das investigações." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Novo art. 28 CPP: se o órgão superior discordar do arquivamento, designa outro membro do MP para oferecer denúncia ou requisitar diligências. O juiz não participa.",
    explanationCorrect: "B: novo art. 28 CPP (Pacote Anticrime) — se o órgão superior não concordar com o arquivamento: designa outro promotor para oferecer denúncia ou requisitar novas diligências. O controle é interno ao MP.",
    explanationWrong: "A: o juiz foi retirado do controle do arquivamento pelo Pacote Anticrime. C: o órgão superior do MP não pode determinar diretamente ao delegado — pode requisitar diligências via novo membro do MP. D: o órgão superior pode discordar e designar outro membro. E: a vítima tem legitimidade para impugnar o arquivamento junto ao órgão superior, mas a decisão final é do MP.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c06_q05",
    contentId: "dpp_in_c06",
    statement: "O MP requer o arquivamento do IP por extinção da punibilidade pela prescrição. Esse arquivamento produz:",
    alternatives: [
      { letter: "A", text: "Coisa julgada formal — pode ser reaberto se surgirem provas novas." },
      { letter: "B", text: "Coisa julgada material — a prescrição é causa extintiva da punibilidade que impede definitivamente nova persecução." },
      { letter: "C", text: "Mera preclusão administrativa — não há efeito de coisa julgada no IP." },
      { letter: "D", text: "Nenhum efeito — o MP pode reabrir o IP a qualquer tempo se identificar erro no cômputo da prescrição." },
      { letter: "E", text: "Coisa julgada formal apenas, pois a prescrição pode ser interrompida por novas provas." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Arquivamento por extinção da punibilidade (incluindo prescrição) = coisa julgada material. Não pode ser reaberto, pois a punibilidade está extinta por força de lei.",
    explanationCorrect: "B: arquivamento por extinção da punibilidade (prescrição, morte do agente, anistia, etc.) faz coisa julgada material. Não há nova persecução possível — a punibilidade está extinta independentemente de novas provas.",
    explanationWrong: "A e E: coisa julgada formal é para insuficiência de provas — não para extinção da punibilidade. C: há efeito de coisa julgada material. D: o erro no cômputo da prescrição pode ser arguido via revisão criminal — não justifica reabertura simples do IP.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c06_q06",
    contentId: "dpp_in_c06",
    statement: "Com o Pacote Anticrime (Lei 13.964/2019), a vítima passou a ter legitimidade para:",
    alternatives: [
      { letter: "A", text: "Oferecer denúncia substitutiva quando o MP requerer o arquivamento." },
      { letter: "B", text: "Impugnar o arquivamento do IP junto ao órgão superior do Ministério Público." },
      { letter: "C", text: "Requisitar ao delegado a reabertura do IP arquivado, independentemente de novas provas." },
      { letter: "D", text: "Votar no Conselho do MP sobre a decisão de arquivamento de IPs que lhe digam respeito." },
      { letter: "E", text: "Nenhuma nova legitimidade — o Pacote Anticrime não alterou os direitos da vítima no arquivamento." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Pacote Anticrime: a vítima ganhou legitimidade para impugnar o arquivamento junto ao órgão superior do MP — nova forma de controle participativo pelo ofendido.",
    explanationCorrect: "B: novo art. 28 CPP — a vítima pode impugnar o arquivamento junto ao órgão superior do MP. É uma nova legitimidade conferida pelo Pacote Anticrime para dar mais voz ao ofendido no controle do arquivamento.",
    explanationWrong: "A: a ação penal privada subsidiária já existia para a inércia do MP — não para depois do arquivamento. C: a reabertura depende de novas provas — a vítima não pode requerer sem elas. D: não existe votação do Conselho do MP com participação da vítima. E: o Pacote Anticrime sim alterou os direitos da vítima no arquivamento.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c06_q07",
    contentId: "dpp_in_c06",
    statement: "O delegado, verificando que as investigações encerraram sem identificar o autor do crime, deve:",
    alternatives: [
      { letter: "A", text: "Arquivar o IP de ofício, por falta de autoria." },
      { letter: "B", text: "Remeter os autos ao MP, que avaliará se requer o arquivamento ou requisita novas diligências." },
      { letter: "C", text: "Remeter os autos ao juiz para que este determine o arquivamento." },
      { letter: "D", text: "Solicitar ao indiciado que forneça informações sobre os demais envolvidos." },
      { letter: "E", text: "Encerrar o IP e devolver à vítima para que esta ajuíze ação privada subsidiária." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O delegado não arquiva de ofício o IP — remete os autos ao MP. Somente o MP (e o órgão superior, pós-Pacote Anticrime) pode requerer o arquivamento.",
    explanationCorrect: "B: art. 10, §1° CPP — ao concluir o IP, o delegado remete os autos ao juiz competente (e ao MP, na prática). O MP é quem requer o arquivamento ou oferece denúncia — o delegado não arquiva de ofício.",
    explanationWrong: "A: o delegado não tem poder de arquivar o IP de ofício. C: pós-Pacote Anticrime, o juiz não controla mais o arquivamento. D: não há obrigação de o indiciado colaborar. E: ação privada subsidiária é para inércia do MP — não para ausência de autoria.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_in_c06_q08",
    contentId: "dpp_in_c06",
    statement: "O arquivamento do IP impede que o delegado continue investigando os mesmos fatos?",
    alternatives: [
      { letter: "A", text: "Sim, sempre — o arquivamento encerra definitivamente qualquer investigação sobre os fatos." },
      { letter: "B", text: "Sim, mas apenas quando o arquivamento foi por atipicidade ou extinção da punibilidade (coisa julgada material)." },
      { letter: "C", text: "Não — o delegado pode sempre continuar investigando, independentemente do motivo do arquivamento." },
      { letter: "D", text: "Não, pois o delegado é autoridade administrativa e não está sujeito ao controle do MP sobre o IP arquivado." },
      { letter: "E", text: "Depende da manifestação do juiz — apenas o juiz pode autorizar a continuação das investigações após o arquivamento." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Arquivamento por atipicidade/extinção da punibilidade = coisa julgada material = impede novas investigações pelos mesmos fatos. Arquivamento por insuficiência de provas = art. 18 CPP = admite novas investigações com novas provas.",
    explanationCorrect: "B: o efeito depende do fundamento do arquivamento. Coisa julgada material (atipicidade, extinção da punibilidade) impede novas investigações. Coisa julgada formal (insuficiência de provas) permite reabertura com provas novas (art. 18 CPP).",
    explanationWrong: "A: não é sempre — depende do fundamento. C: não é sempre possível — coisa julgada material impede. D: o delegado está sujeito ao ordenamento jurídico — não pode ignorar a coisa julgada material. E: pós-Pacote Anticrime, o juiz não mais controla o arquivamento.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── dpp_pr_c01 — Prisão em Flagrante (8q) ───────────────────────────────
  {
    id: "dpp_pr_c01_q01",
    contentId: "dpp_pr_c01",
    statement: "Segundo o art. 302 do CPP, o flagrante impróprio (ou quase-flagrante) ocorre quando o agente é:",
    alternatives: [
      { letter: "A", text: "Encontrado logo depois com instrumentos, objetos ou papéis que façam presumir ser ele o autor da infração." },
      { letter: "B", text: "Perseguido, logo após, pela autoridade, pelo ofendido ou por qualquer pessoa, em situação que faça presumir ser ele o autor." },
      { letter: "C", text: "Preso no momento em que está cometendo a infração penal." },
      { letter: "D", text: "Capturado dias depois pela autoridade policial, após identificação por testemunhas." },
      { letter: "E", text: "Induzido por agente policial a cometer o crime para ser preso." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Flagrante impróprio (art. 302, III CPP): perseguido logo após pela autoridade, pelo ofendido ou qualquer pessoa. Difere do ficto (encontrado logo depois — sem perseguição).",
    explanationCorrect: "B: art. 302, III CPP — flagrante impróprio = perseguido logo após a prática em situação que faça presumir ser o autor. A perseguição deve ser ininterrupta.",
    explanationWrong: "A: encontrado logo depois com instrumentos = flagrante ficto/presumido (art. 302, IV). C: cometendo = flagrante próprio (art. 302, I). D: capturado dias depois não é flagrante — prazo 'logo após' não foi respeitado. E: induzido por agente policial = flagrante preparado/provocado = ilícito.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c01_q02",
    contentId: "dpp_pr_c01",
    statement: "A Súmula 145 do STF estabelece que 'não há crime quando a preparação do flagrante pela polícia torna impossível sua consumação'. Isso significa que o flagrante preparado:",
    alternatives: [
      { letter: "A", text: "É lícito, pois a autoridade policial tem dever de prender em flagrante." },
      { letter: "B", text: "É ilícito e configura crime impossível, nulificando a prisão e impedindo a punição do agente." },
      { letter: "C", text: "É lícito quando praticado por agentes federais, sendo ilícito apenas para policiais estaduais." },
      { letter: "D", text: "Gera apenas a nulidade da prisão, mas permite o prosseguimento da ação penal com outros elementos." },
      { letter: "E", text: "É lícito se houver autorização judicial prévia para a operação policial." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Súmula 145 STF: flagrante preparado/provocado = crime impossível (art. 17 CP). A prisão é nula, e o agente não pode ser punido, pois o crime nunca poderia ser consumado sem a indução policial.",
    explanationCorrect: "B: Súmula 145 STF + art. 17 CP — o flagrante preparado torna o crime impossível (tentativa absolutamente inidônea). A prisão é nula de pleno direito e o agente não responde criminalmente.",
    explanationWrong: "A e C: o flagrante preparado é ilícito para qualquer autoridade policial — não há distinção entre federal e estadual. D: a nulidade do flagrante preparado abrange também a punição — crime impossível. E: nenhuma autorização judicial pode tornar lícito o flagrante preparado.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c01_q03",
    contentId: "dpp_pr_c01",
    statement: "O flagrante esperado, ao contrário do preparado, é considerado:",
    alternatives: [
      { letter: "A", text: "Ilícito, pois também envolve participação policial prévia à conduta criminosa." },
      { letter: "B", text: "Lícito, pois a autoridade policial apenas aguarda a prática do crime, sem induzir ou provocar o agente." },
      { letter: "C", text: "Ilícito, pois viola o princípio da não intervenção policial em atividades criminosas." },
      { letter: "D", text: "Lícito apenas quando autorizado por ordem judicial específica." },
      { letter: "E", text: "Ilícito se praticado sem a ciência do Ministério Público." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Flagrante esperado = lícito. A polícia recebe informação de que crime ocorrerá e aguarda sua execução para prender — sem induzir, provocar ou participar da decisão criminosa do agente.",
    explanationCorrect: "B: no flagrante esperado, a autoridade policial apenas aguarda a ação criminosa, sem qualquer participação na decisão de cometê-la. Não há indução — o crime teria ocorrido de qualquer forma.",
    explanationWrong: "A e C: o flagrante esperado é lícito — a diferença em relação ao preparado é justamente a ausência de indução/provocação policial. D: não exige autorização judicial. E: não exige ciência prévia do MP.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c01_q04",
    contentId: "dpp_pr_c01",
    statement: "A ação controlada (flagrante prorrogado), prevista na Lei de Drogas e na Lei de Organizações Criminosas (ORCA), consiste em:",
    alternatives: [
      { letter: "A", text: "Prender o infrator no exato momento em que comete o crime, sem qualquer espera." },
      { letter: "B", text: "Retardar a intervenção policial para identificar e capturar o maior número de integrantes de organização criminosa ou traficantes." },
      { letter: "C", text: "Provocar o agente para que cometa o crime em local controlado pela polícia." },
      { letter: "D", text: "Substituir o flagrante pela infiltração de agentes, dispensando a prisão em flagrante." },
      { letter: "E", text: "Prender o agente com mandado judicial previamente expedido, sem necessidade de flagrante." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Ação controlada = retardar a intervenção policial para identificar mais membros da organização e obter mais provas, prendendo o maior número possível quando a intervenção for mais eficaz.",
    explanationCorrect: "B: Lei 12.850/2013 (ORCA), art. 8° — ação controlada = retardamento da intervenção policial ou administrativa, com comunicação ao juiz competente, para capturar mais integrantes e ampliar a eficácia da ação penal.",
    explanationWrong: "A: ao contrário — a ação controlada atrasa a intervenção, não a antecipa. C: provocar = flagrante preparado = ilícito. D: ação controlada e infiltração são técnicas distintas, mas a ação controlada não dispensa o flagrante. E: a ação controlada não é prisão por mandado — é técnica de vigilância e intervenção diferida.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c01_q05",
    contentId: "dpp_pr_c01",
    statement: "Qualquer pessoa do povo pode efetuar prisão em flagrante delito. Essa faculdade é conhecida como flagrante:",
    alternatives: [
      { letter: "A", text: "Obrigatório — pois qualquer cidadão tem dever legal de prender." },
      { letter: "B", text: "Facultativo — pois é uma faculdade, não obrigação, do particular." },
      { letter: "C", text: "Presumido — pois presume-se que o cidadão sempre atuará em casos de flagrante." },
      { letter: "D", text: "Compulsório — pois a omissão do cidadão configura crime de omissão de socorro." },
      { letter: "E", text: "Discricionário — termo técnico do CPP para a prisão por particular." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Art. 301 CPP: qualquer pessoa PODERÁ (facultativo) prender quem se encontre em flagrante. As autoridades e seus agentes têm obrigação (dever) — para o particular, é faculdade.",
    explanationCorrect: "B: art. 301 CPP — 'Qualquer do povo poderá' (faculdade). Autoridades policiais e seus agentes 'deverão' (obrigação). Flagrante por particular = flagrante facultativo.",
    explanationWrong: "A e D: para o particular, não há obrigação legal de prender em flagrante — é faculdade. A não prisão pelo particular não configura crime. C: 'presumido' é uma das modalidades de flagrante (art. 302, IV) — não o tipo de agente. E: 'discricionário' não é termo técnico do CPP para esse conceito.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c01_q06",
    contentId: "dpp_pr_c01",
    statement: "Após a lavratura do APFD, o delegado deve encaminhar o preso, no prazo de 24 horas, para:",
    alternatives: [
      { letter: "A", text: "Diretamente à penitenciária mais próxima para cumprimento provisório da pena." },
      { letter: "B", text: "Audiência de custódia perante o juiz, para análise da legalidade da prisão e cabimento de medidas cautelares." },
      { letter: "C", text: "O Ministério Público, para que este decida pelo oferecimento imediato de denúncia." },
      { letter: "D", text: "Exame de corpo de delito obrigatório, com laudo entregue ao juiz em 24 horas." },
      { letter: "E", text: "Delegacia especializada, para complementação das investigações antes da audiência." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Pacote Anticrime (art. 310 CPP): em até 24 horas após a prisão, o preso deve ser apresentado ao juiz para audiência de custódia, onde será analisada a legalidade da prisão e o cabimento de cautelares.",
    explanationCorrect: "B: art. 310 CPP (Pacote Anticrime) — audiência de custódia em até 24 horas após a prisão. O juiz analisa: (1) legalidade do flagrante; (2) necessidade de conversão em preventiva; (3) concessão de liberdade provisória com ou sem fiança.",
    explanationWrong: "A: não há cumprimento de pena antes de condenação transitada em julgado. C: o MP não recebe o preso — é o juiz que realiza a audiência de custódia. D: o exame de corpo de delito é diligência — não há prazo de 24h para o laudo. E: não há previsão de encaminhamento a delegacia especializada nesse prazo.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c01_q07",
    contentId: "dpp_pr_c01",
    statement: "O delegado verifica que o flagrante é ilegal (por exemplo, por excesso na condução do preso). Nessa situação, deve:",
    alternatives: [
      { letter: "A", text: "Lavrar o APFD normalmente e comunicar a irregularidade ao MP para avaliação posterior." },
      { letter: "B", text: "Relaxar a prisão em flagrante, pois tem competência para verificar a legalidade do flagrante e liberar o preso quando for ilegal." },
      { letter: "C", text: "Manter o preso e aguardar a audiência de custódia para que o juiz decida sobre a legalidade." },
      { letter: "D", text: "Encaminhar o caso ao MP para que este requeira o relaxamento ao juiz." },
      { letter: "E", text: "Comunicar ao Ministério da Justiça para apuração da conduta do agente que efetuou o flagrante." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O delegado tem competência para relaxar o flagrante ilegal — não precisa aguardar o juiz. É poder-dever do delegado verificar a legalidade da prisão e libertar quando o flagrante for ilegal.",
    explanationCorrect: "B: o delegado pode e deve relaxar a prisão em flagrante ilegal. É ato de competência da autoridade policial — não precisa de autorização judicial prévia para soltar quem foi preso ilegalmente.",
    explanationWrong: "A: lavrar APFD de flagrante ilegal seria perpetuar a ilegalidade. C: aguardar a audiência de custódia manteria a prisão ilegal por horas — o delegado deve agir imediatamente. D: o delegado não precisa do MP para relaxar o flagrante ilegal. E: comunicar ao Ministério da Justiça não resolve a situação do preso.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c01_q08",
    contentId: "dpp_pr_c01",
    statement: "O flagrante ficto ou presumido (art. 302, IV do CPP) ocorre quando o agente é encontrado:",
    alternatives: [
      { letter: "A", text: "Cometendo a infração penal no momento da abordagem policial." },
      { letter: "B", text: "Perseguido logo após a prática do crime, em situação que faça presumir ser o autor." },
      { letter: "C", text: "Logo depois, com instrumentos, armas, objetos ou papéis que façam presumir ser ele o autor da infração." },
      { letter: "D", text: "Dias depois do crime, com objetos que comprovem sua participação." },
      { letter: "E", text: "Em local próximo ao crime, sem qualquer objeto suspeito, mas identificado por testemunhas." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Flagrante ficto/presumido (art. 302, IV CPP): encontrado LOGO DEPOIS com instrumentos, armas, objetos ou papéis que façam PRESUMIR ser ele o autor. 'Logo depois' e 'presumir' são os elementos-chave.",
    explanationCorrect: "C: art. 302, IV CPP — 'é encontrado, logo depois, com instrumentos, armas, objetos ou papéis que façam presumir ser ele autor da infração'. Chave: encontrado (não perseguido) + logo depois + instrumentos que presumam autoria.",
    explanationWrong: "A: cometendo = flagrante próprio (art. 302, I). B: perseguido logo após = flagrante impróprio (art. 302, III). D: 'dias depois' não é 'logo depois' — prazo razoável é essencial. E: apenas testemunhas sem instrumentos não configura o ficto.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── dpp_pr_c02 — Prisão Preventiva (8q) ─────────────────────────────────
  {
    id: "dpp_pr_c02_q01",
    contentId: "dpp_pr_c02",
    statement: "Os requisitos cumulativos para decretação da prisão preventiva, previstos no art. 312 do CPP, são:",
    alternatives: [
      { letter: "A", text: "Prova da existência do crime e indícios suficientes de autoria (fumus comissi delicti) + pelo menos um fundamento do art. 312 (periculum libertatis)." },
      { letter: "B", text: "Confissão do réu e requerimento expresso do ofendido." },
      { letter: "C", text: "Gravidade do crime e antecedentes criminais do investigado." },
      { letter: "D", text: "Requerimento do delegado e concordância do MP." },
      { letter: "E", text: "Indícios de autoria e clamor público gerado pelo crime." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "Preventiva exige: (1) fumus comissi delicti = prova do crime + indícios de autoria; (2) periculum libertatis = ao menos um dos fundamentos do art. 312 CPP. Ambos são cumulativos.",
    explanationCorrect: "A: art. 312 CPP — dois requisitos cumulativos: fumus comissi delicti (prova da materialidade + indícios de autoria) e periculum libertatis (garantia da ordem pública, econômica, conveniência da instrução ou aplicação da lei penal).",
    explanationWrong: "B: confissão e requerimento do ofendido não são requisitos. C: gravidade abstrata e antecedentes isolados não bastam — STF e STJ pacificaram. D: o requerimento parte do MP ou das partes (pós-Pacote Anticrime — juiz não pode de ofício). E: clamor público isolado não é fundamento legal.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c02_q02",
    contentId: "dpp_pr_c02",
    statement: "O Pacote Anticrime (Lei 13.964/2019) vedou expressamente a decretação de prisão preventiva de ofício pelo juiz:",
    alternatives: [
      { letter: "A", text: "Apenas na fase do inquérito policial — durante o processo, o juiz pode decretar de ofício." },
      { letter: "B", text: "Em qualquer fase — tanto no IP quanto no processo penal, a preventiva exige requerimento do MP, do querelante ou do assistente." },
      { letter: "C", text: "Apenas nos crimes de menor potencial ofensivo — nos crimes graves, o juiz ainda pode decretar de ofício." },
      { letter: "D", text: "A vedação não existe — o juiz sempre pode decretar preventiva de ofício quando necessário." },
      { letter: "E", text: "Apenas para réus primários — para reincidentes, o juiz pode decretar de ofício." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Pacote Anticrime: preventiva NUNCA de ofício — nem no IP, nem no processo. Exige sempre requerimento do MP, do querelante, do assistente ou representação da autoridade policial.",
    explanationCorrect: "B: art. 311 CPP (Pacote Anticrime) — 'Em qualquer fase da investigação policial ou do processo penal, caberá a prisão preventiva decretada pelo juiz, a requerimento do Ministério Público, do querelante ou do assistente, ou por representação da autoridade policial'. O juiz não pode mais agir de ofício em nenhuma fase.",
    explanationWrong: "A: antes do Pacote, o juiz podia de ofício na fase processual. Após o Pacote, a vedação abrange AMBAS as fases. C: a vedação é para todos os crimes. D: a vedação existe expressamente desde o Pacote Anticrime (2019). E: não há distinção entre primário e reincidente para essa regra.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c02_q03",
    contentId: "dpp_pr_c02",
    statement: "O juiz decreta a prisão preventiva com fundamento exclusivo na 'gravidade do crime e no clamor público gerado'. Essa decisão é:",
    alternatives: [
      { letter: "A", text: "Válida, pois a gravidade do crime e o clamor público justificam a garantia da ordem pública." },
      { letter: "B", text: "Inválida, pois a gravidade abstrata do crime e o clamor público, por si sós, não constituem fundamento legal para a preventiva." },
      { letter: "C", text: "Válida, pois o juiz tem discricionariedade para valorar elementos não previstos expressamente no CPP." },
      { letter: "D", text: "Inválida apenas se o réu for primário — para reincidentes, esses fundamentos são suficientes." },
      { letter: "E", text: "Válida somente em crimes hediondos, onde o clamor público é presumido por lei." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "STF e STJ: gravidade abstrata do crime e clamor público isolados NÃO fundamentam preventiva. É necessário indicar concretamente o periculum libertatis — risco real decorrente da liberdade do réu.",
    explanationCorrect: "B: o STF e o STJ pacificaram que a gravidade abstrata do crime e o clamor público, por si sós, não bastam para fundamentar a preventiva. O juiz deve indicar fatos concretos que demonstrem o periculum libertatis.",
    explanationWrong: "A: 'garantia da ordem pública' exige demonstração de risco concreto de reiteração — não apenas clamor. C: o juiz não tem discricionariedade para inventar fundamentos não previstos no art. 312 CPP. D e E: a vedação se aplica a todos os réus e crimes — não há exceção por reincidência ou hediondez.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c02_q04",
    contentId: "dpp_pr_c02",
    statement: "O Pacote Anticrime determinou que o juiz deve realizar revisão periódica da necessidade de manutenção da prisão preventiva a cada:",
    alternatives: [
      { letter: "A", text: "30 dias." },
      { letter: "B", text: "60 dias." },
      { letter: "C", text: "90 dias." },
      { letter: "D", text: "6 meses." },
      { letter: "E", text: "A revisão é facultativa — não há prazo fixo determinado pelo Pacote Anticrime." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Pacote Anticrime (art. 316 CPP): o juiz deve revisar a necessidade de manutenção da preventiva a cada 90 dias, sob pena de tornar a prisão ilegal por excesso de prazo.",
    explanationCorrect: "C: art. 316, parágrafo único CPP (Pacote Anticrime) — 'Decretada a prisão preventiva, deverá o órgão emissor da decisão revisar a necessidade de sua manutenção a cada 90 (noventa) dias'.",
    explanationWrong: "A: 30 dias é prazo da prisão temporária em crimes comuns. B: 60 dias é prazo total da temporária em crimes hediondos. D: 6 meses é prazo excessivo — a lei fixou 90 dias. E: a revisão é OBRIGATÓRIA e periódica — não facultativa.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c02_q05",
    contentId: "dpp_pr_c02",
    statement: "O réu é acusado de homicídio doloso e o MP teme que ele fuja do país. Nessa situação, o fundamento adequado para requerer a preventiva é:",
    alternatives: [
      { letter: "A", text: "Garantia da ordem pública." },
      { letter: "B", text: "Garantia da ordem econômica." },
      { letter: "C", text: "Conveniência da instrução criminal." },
      { letter: "D", text: "Assegurar a aplicação da lei penal (risco de fuga)." },
      { letter: "E", text: "Gravidade abstrata do crime de homicídio doloso." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "Risco de fuga = fundamento 'assegurar a aplicação da lei penal' (art. 312 CPP). Sem a presença do réu, a lei penal não pode ser aplicada — esse é o periculum libertatis adequado.",
    explanationCorrect: "D: art. 312 CPP — 'assegurar a aplicação da lei penal' é o fundamento adequado quando há risco de fuga do réu. A preventiva impede que o acusado escape da jurisdição.",
    explanationWrong: "A: garantia da ordem pública = risco de reiteração criminosa. B: ordem econômica = crimes financeiros com risco de continuidade. C: conveniência da instrução = risco de destruição de provas. E: gravidade abstrata isolada não é fundamento legal — exige fatos concretos.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c02_q06",
    contentId: "dpp_pr_c02",
    statement: "A prisão domiciliar como substituta da prisão preventiva (art. 318 do CPP) pode ser concedida quando o réu:",
    alternatives: [
      { letter: "A", text: "For primário e tiver residência fixa, independentemente de outras condições." },
      { letter: "B", text: "For maior de 80 anos, estar extremamente debilitado por doença grave, ser imprescindível ao cuidado de pessoa menor de 6 anos ou com deficiência, ou estar gestante." },
      { letter: "C", text: "Apresentar bons antecedentes e tiver fiador idôneo para garantir o comparecimento aos atos processuais." },
      { letter: "D", text: "Tiver réu solto há mais de 1 ano sem risco de fuga ou destruição de provas." },
      { letter: "E", text: "For servidor público com estabilidade no cargo, assegurando o comparecimento aos atos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Art. 318 CPP: hipóteses de prisão domiciliar como substituta da preventiva: ≥80 anos, doença grave, gestante, mãe com filho ≤6 anos ou deficiente, pessoa imprescindível a menor ou deficiente.",
    explanationCorrect: "B: art. 318 CPP — o juiz pode substituir a preventiva por domiciliar quando o réu: (I) ≥80 anos; (II) extremamente debilitado por doença grave; (III) imprescindível ao cuidado de menor de 6 anos ou deficiente; (IV) gestante; (V) mulher com filho até 12 anos (CPP).",
    explanationWrong: "A: primariedade e residência fixa são requisitos para liberdade provisória — não para domiciliar como substituta. C: fiador é requisito de fiança, não de domiciliar. D e E: não são hipóteses legais do art. 318 CPP.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c02_q07",
    contentId: "dpp_pr_c02",
    statement: "O descumprimento de medida cautelar diversa da prisão (art. 319 CPP) pelo réu:",
    alternatives: [
      { letter: "A", text: "Não tem consequência jurídica direta — o juiz deve apenas notificar o réu." },
      { letter: "B", text: "Autoriza o juiz a decretar a prisão preventiva como reação ao descumprimento." },
      { letter: "C", text: "Determina a imediata conversão em fiança, sem possibilidade de prisão." },
      { letter: "D", text: "Leva ao encerramento do processo por ausência de colaboração." },
      { letter: "E", text: "Autoriza apenas multa processual, não sendo possível a prisão sem novo requerimento do MP." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Art. 282, §4° CPP: o descumprimento de medida cautelar diversa da prisão autoriza o juiz a decretar a preventiva subsidiária — desde que a preventiva se mostre adequada e necessária.",
    explanationCorrect: "B: art. 282, §4° CPP — 'No caso de descumprimento de qualquer das obrigações impostas, o juiz, de ofício ou mediante requerimento do Ministério Público, de seu assistente ou do querelante, poderá substituir a medida, impor outra em cumulação, ou, em último caso, decretar a prisão preventiva'. A preventiva subsidiária é fundamento autônomo (art. 312, parágrafo único CPP).",
    explanationWrong: "A: o descumprimento tem consequências jurídicas expressas. C: não há conversão em fiança — a consequência pode ser a preventiva. D: o processo não é encerrado. E: a preventiva por descumprimento pode ser decretada a requerimento — não apenas com nova análise autônoma.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c02_q08",
    contentId: "dpp_pr_c02",
    statement: "O habeas corpus é o remédio constitucional adequado para questionar:",
    alternatives: [
      { letter: "A", text: "Apenas prisões em flagrante — não se aplica à prisão preventiva." },
      { letter: "B", text: "Qualquer forma de prisão ilegal ou ameaça à liberdade de locomoção, incluindo a preventiva sem fundamento legal." },
      { letter: "C", text: "Somente a prisão após condenação — durante o IP, usa-se o mandado de segurança." },
      { letter: "D", text: "Apenas prisões decretadas por juízes de 1.ª instância — preventivas decretadas por tribunais são irrecorríveis." },
      { letter: "E", text: "Somente prisões superiores a 6 meses — abaixo desse prazo presume-se a legalidade." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "HC (CF art. 5°, LXVIII) é cabível para qualquer forma de prisão ilegal ou ameaça à liberdade de locomoção — incluindo preventiva, temporária, flagrante, excesso de prazo.",
    explanationCorrect: "B: CF art. 5°, LXVIII — HC é cabível 'sempre que alguém sofrer ou se achar ameaçado de sofrer violência ou coação em sua liberdade de locomoção, por ilegalidade ou abuso de poder'. Abrange preventiva, temporária, flagrante, excesso de prazo — qualquer forma.",
    explanationWrong: "A: HC abrange também a preventiva. C: HC é cabível em qualquer fase — IP ou processo. D: o STJ e o STF julgam HC contra preventivas de tribunais inferiores. E: não há prazo mínimo para cabimento do HC — qualquer prisão ilegal é impugnável.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── dpp_pr_c03 — Prisão Temporária e Liberdade Provisória (8q) ───────────
  {
    id: "dpp_pr_c03_q01",
    contentId: "dpp_pr_c03",
    statement: "A prisão temporária, prevista na Lei 7.960/1989, é cabível:",
    alternatives: [
      { letter: "A", text: "Em qualquer fase do processo penal, inclusive durante a instrução criminal." },
      { letter: "B", text: "Exclusivamente durante a fase de inquérito policial." },
      { letter: "C", text: "Durante o IP e no início da fase processual, até o recebimento da denúncia." },
      { letter: "D", text: "Apenas após o recebimento da denúncia, como medida cautelar processual." },
      { letter: "E", text: "Em qualquer fase, desde que haja requerimento do MP e do delegado conjuntamente." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A prisão temporária é cabível EXCLUSIVAMENTE na fase de inquérito policial. Iniciada a fase processual, cabe apenas preventiva — nunca temporária.",
    explanationCorrect: "B: Lei 7.960/1989 — a prisão temporária é cabível exclusivamente durante o IP. Na fase processual, o instrumento adequado é a prisão preventiva. A temporária cessa automaticamente quando o processo é iniciado.",
    explanationWrong: "A, C e D: a temporária não tem cabimento na fase processual. E: o requerimento pode ser do MP OU do delegado — não necessariamente de ambos conjuntamente.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c03_q02",
    contentId: "dpp_pr_c03",
    statement: "O prazo da prisão temporária para crimes comuns (não hediondos), segundo a Lei 7.960/1989, é de:",
    alternatives: [
      { letter: "A", text: "5 dias, improrrogáveis." },
      { letter: "B", text: "5 dias, prorrogáveis por mais 5 dias em caso de extrema e comprovada necessidade." },
      { letter: "C", text: "10 dias, prorrogáveis por mais 10 dias." },
      { letter: "D", text: "15 dias, prorrogáveis por mais 15 dias." },
      { letter: "E", text: "30 dias, prorrogáveis por mais 30 dias." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Lei 7.960/1989, art. 2° — prisão temporária em crimes comuns: 5 dias, prorrogável por mais 5 dias em caso de extrema e comprovada necessidade. Total máximo: 10 dias.",
    explanationCorrect: "B: art. 2°, Lei 7.960/1989 — prazo: 5 dias, prorrogável por mais 5 dias. A prorrogação exige extrema e comprovada necessidade e decisão judicial fundamentada.",
    explanationWrong: "A: não é improrrogável — admite prorrogação por mais 5 dias. C: 10+10 seria o dobro do previsto. D: 15+15 é o prazo da PF no IP. E: 30+30 é o prazo da temporária para crimes hediondos.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c03_q03",
    contentId: "dpp_pr_c03",
    statement: "Para crimes hediondos e equiparados, o prazo da prisão temporária (Lei 8.072/1990) é de:",
    alternatives: [
      { letter: "A", text: "5 dias, prorrogáveis por mais 5 dias." },
      { letter: "B", text: "15 dias, prorrogáveis por mais 15 dias." },
      { letter: "C", text: "30 dias, prorrogáveis por mais 30 dias." },
      { letter: "D", text: "60 dias, improrrogáveis." },
      { letter: "E", text: "90 dias, prorrogáveis por mais 90 dias." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Lei 8.072/1990 (Crimes Hediondos), art. 2°, §4°: temporária em crimes hediondos — 30 dias, prorrogáveis por mais 30 dias em caso de extrema e comprovada necessidade. Total: 60 dias.",
    explanationCorrect: "C: art. 2°, §4°, Lei 8.072/1990 — nos crimes hediondos e equiparados (tráfico, tortura, terrorismo), o prazo da temporária é de 30 dias, prorrogável por mais 30 dias. Total máximo: 60 dias.",
    explanationWrong: "A: 5+5 é para crimes comuns. B: 15+15 é o prazo da PF no IP. D: 60 dias não é improrrogável — é o resultado de 30+30. E: 90+90 é o prazo do IP para réu solto na Lei de Drogas — não temporária.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c03_q04",
    contentId: "dpp_pr_c03",
    statement: "O juiz pode decretar a prisão temporária de ofício, sem requerimento do delegado ou do MP?",
    alternatives: [
      { letter: "A", text: "Sim, em crimes graves, quando verificar a necessidade durante análise de outro ato processual." },
      { letter: "B", text: "Não — a temporária só pode ser decretada mediante requerimento do delegado ou do MP, nunca de ofício." },
      { letter: "C", text: "Sim, durante o IP, quando o delegado demonstrar omissão na investigação." },
      { letter: "D", text: "Sim, para crimes hediondos, onde a gravidade justifica a atuação judicial de ofício." },
      { letter: "E", text: "Não, mas o juiz pode converter o flagrante em temporária de ofício, antes da audiência de custódia." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Lei 7.960/1989, art. 2°: temporária só é decretada mediante requerimento do delegado ou do MP. Nunca de ofício pelo juiz — nem antes nem depois do Pacote Anticrime.",
    explanationCorrect: "B: Lei 7.960/1989, art. 2° — 'A prisão temporária será decretada pelo juiz competente, em face da representação da autoridade policial ou de requerimento do Ministério Público'. O juiz nunca pode decretar de ofício.",
    explanationWrong: "A, C e D: o juiz não pode decretar temporária de ofício — a lei exige requerimento. E: o juiz pode converter flagrante em preventiva (não em temporária) — e mesmo a preventiva, pós-Pacote, é apenas a requerimento.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c03_q05",
    contentId: "dpp_pr_c03",
    statement: "A liberdade provisória pode ser concedida a réu preso em flagrante por crime inafiançável?",
    alternatives: [
      { letter: "A", text: "Não — crimes inafiançáveis impedem qualquer forma de liberdade provisória." },
      { letter: "B", text: "Sim — a inafiançabilidade impede apenas a fiança, mas não a liberdade provisória sem fiança." },
      { letter: "C", text: "Somente se o MP não se opuser expressa e fundamentadamente." },
      { letter: "D", text: "Somente para réus primários — reincidentes em crimes inafiançáveis não têm esse direito." },
      { letter: "E", text: "Não — a CF veda expressamente a liberdade provisória em crimes hediondos e equiparados." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "STF (HC 104.339 e outros): inafiançabilidade NÃO veda liberdade provisória. Crime inafiançável = sem direito à fiança, mas pode ter liberdade provisória SEM fiança. O Pacote Anticrime consolidou esse entendimento.",
    explanationCorrect: "B: STF pacificou que a inafiançabilidade (CF art. 5°, XLIII — crimes hediondos, tráfico, tortura, terrorismo) proíbe apenas a fiança — não a liberdade provisória sem fiança. Se não houver fumus + periculum para a preventiva, o réu deve ser solto.",
    explanationWrong: "A: crime inafiançável não proíbe a liberdade provisória sem fiança. C: a oposição do MP é elemento a ponderar, mas não é condição absoluta. D: não há distinção legal entre primário e reincidente para esse efeito. E: a CF veda a fiança — não a liberdade provisória sem fiança (interpretação do STF).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c03_q06",
    contentId: "dpp_pr_c03",
    statement: "A audiência de custódia, prevista no art. 310 do CPP (Pacote Anticrime), deve ocorrer:",
    alternatives: [
      { letter: "A", text: "Em até 48 horas após a prisão em flagrante." },
      { letter: "B", text: "Em até 24 horas após a realização da prisão." },
      { letter: "C", text: "Em até 72 horas após a lavratura do APFD." },
      { letter: "D", text: "No primeiro dia útil após a prisão." },
      { letter: "E", text: "Em até 5 dias após a prisão, para dar tempo à defesa técnica de se preparar." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Art. 310 CPP (Pacote Anticrime): a audiência de custódia deve ocorrer em até 24 horas após a realização da prisão. O prazo é contado da prisão, não da lavratura do APFD.",
    explanationCorrect: "B: art. 310 CPP — 'Após receber o auto de prisão em flagrante, no prazo máximo de até 24 (vinte e quatro) horas após a realização da prisão, o juiz deverá promover audiência de custódia'. Prazo: 24h após a prisão.",
    explanationWrong: "A: 48h é o dobro do prazo legal. C: o prazo é de 24h após a prisão — não da lavratura do APFD. D: o prazo é de 24h corridas — não 'primeiro dia útil'. E: 5 dias é prazo da temporária — não da audiência de custódia.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c03_q07",
    contentId: "dpp_pr_c03",
    statement: "Na audiência de custódia, o juiz NÃO pode:",
    alternatives: [
      { letter: "A", text: "Relaxar o flagrante ilegal." },
      { letter: "B", text: "Converter o flagrante em prisão preventiva." },
      { letter: "C", text: "Conceder liberdade provisória com ou sem fiança." },
      { letter: "D", text: "Condenar o réu com base na confissão feita perante o delegado." },
      { letter: "E", text: "Aplicar medidas cautelares diversas da prisão (art. 319 CPP)." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "A audiência de custódia não é julgamento do mérito — o juiz analisa a legalidade da prisão e medidas cautelares. Não cabe condenação na audiência de custódia.",
    explanationCorrect: "D: a audiência de custódia tem objeto limitado: (1) verificar legalidade do flagrante; (2) analisar conversão em preventiva; (3) conceder liberdade provisória; (4) aplicar cautelares diversas. Condenação é ato do processo de conhecimento — não da audiência de custódia.",
    explanationWrong: "A: relaxar o flagrante ilegal é poder expresso do juiz na custódia. B: converter em preventiva é poder expresso (art. 310, II CPP). C: conceder liberdade provisória é poder expresso (art. 310, III CPP). E: aplicar cautelares diversas é poder expresso — o juiz pode aplicar medidas do art. 319 CPP.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dpp_pr_c03_q08",
    contentId: "dpp_pr_c03",
    statement: "A competência para concessão de fiança quando a pena máxima do crime não excede 4 anos é de:",
    alternatives: [
      { letter: "A", text: "Exclusivamente do juiz, em qualquer hipótese." },
      { letter: "B", text: "Do delegado de polícia, podendo o juiz também concedê-la a qualquer tempo." },
      { letter: "C", text: "Exclusivamente do Ministério Público, como titular da ação penal." },
      { letter: "D", text: "Do delegado e do juiz, exigindo concordância de ambos para sua validade." },
      { letter: "E", text: "Apenas do juiz de plantão, nos crimes ocorridos fora do horário de expediente." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Art. 322 CPP: quando a pena máxima for igual ou inferior a 4 anos, a fiança pode ser concedida pelo delegado de polícia. Para crimes de pena maior ou nos demais casos, somente o juiz.",
    explanationCorrect: "B: art. 322 CPP — a autoridade policial (delegado) pode conceder fiança nos crimes cuja pena máxima não seja superior a 4 anos. O juiz pode concedê-la a qualquer tempo (art. 335 CPP).",
    explanationWrong: "A: o delegado tem competência para fiança em crimes de pena ≤ 4 anos. C: o MP não tem competência para conceder fiança. D: não exige concordância de ambos — são competências autônomas. E: não há limitação ao juiz de plantão — qualquer juiz pode conceder fiança.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n🚀 Seed R50 — Direito Processual Penal\n");

  // 1. Encontrar Subject
  const subjectId = await findSubject("PROCESSUAL_PENAL");
  if (!subjectId) {
    console.error("❌ Subject 'PROCESSUAL_PENAL' não encontrado. Verifique o banco.");
    process.exit(1);
  }
  console.log(`  ✅ Subject encontrado: ${subjectId}`);

  // 2. Criar tópicos
  const topicIdIP = await findOrCreateTopic("Inquérito Policial", subjectId);
  const topicIdPR = await findOrCreateTopic("Prisões", subjectId);
  const topicMap: Record<string, string> = {
    "Inquérito Policial": topicIdIP,
    "Prisões": topicIdPR,
  };

  // 3. Inserir Content atoms
  let contentCreated = 0, contentSkipped = 0;
  for (const c of contents) {
    if (await contentExistsById(c.id)) {
      console.log(`  ⏭  Conteúdo já existe: ${c.id}`);
      contentSkipped++;
      continue;
    }
    const topicId = topicMap[c.topicName];
    const wordCount = c.textContent.split(/\s+/).filter(Boolean).length;
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
        ${wordCount}, ${Math.max(1, Math.ceil(wordCount / 200))},
        ${c.mnemonic}, ${c.keyPoint}, ${c.practicalExample},
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Conteúdo criado: ${c.id} — ${c.title}`);
    contentCreated++;
  }

  // 4. Inserir Questões
  let questionCreated = 0, questionSkipped = 0;
  for (const q of questions) {
    if (await questionExists(q.id)) {
      console.log(`  ⏭  Questão já existe: ${q.id}`);
      questionSkipped++;
      continue;
    }
    const contentRows = (await db.execute(sql`
      SELECT "subjectId", "topicId" FROM "Content" WHERE id = ${q.contentId} LIMIT 1
    `)) as any[];
    if (!contentRows[0]) {
      console.warn(`  ⚠️  Conteúdo não encontrado para questão ${q.id} (contentId: ${q.contentId})`);
      continue;
    }
    const qSubjectId = contentRows[0].subjectId;
    const qTopicId = contentRows[0].topicId;
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
        ${qSubjectId}, ${qTopicId}, ${q.contentId},
        true, ${q.difficulty},
        0, ${q.questionType},
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Questão: ${q.id}`);
    questionCreated++;
  }

  // Relatório
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
