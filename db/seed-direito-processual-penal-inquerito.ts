/**
 * Seed: Direito Processual Penal — Inquérito Policial
 *
 * Popula 6 átomos de Conteúdo + 12 Questões.
 * Mnemônico: D.I.E.S.O (Dispensável, Inquisitivo, Escrito, Sigiloso, Oficial)
 * Idempotente: verifica existência antes de inserir.
 *
 * Execução:
 *   npx tsx db/seed-direito-processual-penal-inquerito.ts
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
    id: "dpp_ip_c01",
    title: "Inquérito Policial — Conceito e Natureza Jurídica",
    textContent: `O Inquérito Policial (IP) é o procedimento administrativo de caráter investigatório presidido pela autoridade policial (Delegado de Polícia) com a finalidade de apurar a autoria e a materialidade de infrações penais, fornecendo elementos de informação para o titular da ação penal (MP ou ofendido).

PONTOS-CHAVE:
• Natureza jurídica: procedimento ADMINISTRATIVO pré-processual — não é processo judicial
• Base legal: arts. 4º a 23 do Código de Processo Penal (CPP)
• Finalidade: apurar fato e autoria (fumus commissi delicti) para embasar a denúncia ou queixa
• Presidência: Delegado de Polícia (Polícia Judiciária — PF ou Polícia Civil)
• Peças do IP: portaria de instauração, auto de prisão em flagrante, termos de declarações, laudos periciais, relatório final

EXEMPLO:
Uma denúncia anônima de tráfico de drogas chega à delegacia. O Delegado instaura um IP via portaria, realiza investigações (buscas, interceptações telefônicas, diligências), colhe provas e ao final elabora o relatório encaminhando ao MP para análise.

DICA BANCA:
CESPE cobra: "O IP tem natureza de processo judicial" — ERRADO. O IP é procedimento ADMINISTRATIVO. A confusão com "processo" é a pegadinha clássica.`,
    mnemonic: "D.I.E.S.O — Dispensável, Inquisitivo, Escrito, Sigiloso, Oficial. 'DI É SO?' — Sim, são as 5 características.",
    keyPoint: "IP: procedimento ADMINISTRATIVO presidido pelo Delegado, finalidade apurar autoria + materialidade",
    practicalExample: "Denúncia de tráfico → Delegado instaura IP por portaria → investiga → relatório → MP decide se oferece denúncia",
    difficulty: "FACIL",
  },
  {
    id: "dpp_ip_c02",
    title: "IP — D de Dispensável: Não é Condição de Procedibilidade",
    textContent: `O IP é DISPENSÁVEL. Isso significa que o Ministério Público pode oferecer denúncia sem o IP, desde que disponha de elementos suficientes de autoria e materialidade por outras vias.

PONTOS-CHAVE:
• O IP NÃO é condição de procedibilidade para a ação penal — art. 39, §5º CPP
• Denúncia pode ser baseada em: inquérito civil, CPI, TCO (Termo Circunstanciado de Ocorrência — Juizado Especial Criminal para infrações de menor potencial ofensivo), peças de informação, flagrante
• Caso prático: MP recebe documentos de crime contra a ordem tributária com toda a autoria e materialidade comprovadas → pode denunciar diretamente
• Dispensabilidade ≠ desnecessidade: na prática, a maioria dos crimes graves tem IP; é dispensável apenas quando já existem elementos suficientes

EXEMPLO:
Um servidor público é pego com dinheiro do erário em casa, com câmeras e testemunhas. A Polícia já lavrou o auto de prisão em flagrante com todas as provas. O MP pode oferecer denúncia baseado apenas no APF, sem necessidade de novo IP.

DICA BANCA:
"O MP somente pode oferecer denúncia após a conclusão do IP" — ERRADO. O IP é dispensável. O MP precisa de elementos de autoria e materialidade, não necessariamente via IP.`,
    mnemonic: "D = Dispensável: 'Dá pra abrir ação SEM o IP, desde que tenha prova'",
    keyPoint: "IP dispensável: MP pode denunciar sem IP se tiver outros elementos (APF, TCO, peças de informação)",
    practicalExample: "Flagrante bem documentado + APF = MP pode denunciar diretamente, sem aguardar IP completo",
    difficulty: "FACIL",
  },
  {
    id: "dpp_ip_c03",
    title: "IP — I de Inquisitivo: Sem Contraditório na Fase Investigatória",
    textContent: `O IP tem caráter INQUISITIVO: não há contraditório nem ampla defesa durante a investigação. O investigado não é "parte" no IP — é objeto da investigação. As provas são colhidas unilateralmente pela autoridade policial.

PONTOS-CHAVE:
• Ausência de contraditório no IP: art. 5º, LV CF/88 — o contraditório é garantido no PROCESSO, não no IP
• O investigado não é "acusado" no IP: não há acusação formal ainda
• Advogado no IP: pode acompanhar o cliente ouvido como investigado, mas não pode interferir nas perguntas da autoridade policial
• Súmula Vinculante 14 STF: "É direito do defensor, no interesse do representado, ter acesso amplo aos elementos de prova que, já documentados em procedimento investigatório realizado por órgão com competência de polícia judiciária, digam respeito ao exercício do direito de defesa."
• Distinção: o indiciado TEM direito de ter advogado presente, mas o IP em si é inquisitivo

EXEMPLO:
Durante o IP, o Delegado colhe depoimentos de testemunhas sem que o advogado do investigado possa fazer perguntas ou contestar. Essa é a natureza inquisitiva. Entretanto, o advogado pode acessar as diligências JÁ DOCUMENTADAS (SV 14).

DICA BANCA:
"No inquérito policial, é garantido ao investigado o exercício do contraditório e da ampla defesa" — ERRADO. O IP é inquisitivo: sem contraditório. O contraditório surge com a ação penal (denúncia).`,
    mnemonic: "I = Inquisitivo: 'Investiga-se SEM ouvir a defesa'. Contraditório = só no processo, não no IP",
    keyPoint: "IP inquisitivo: sem contraditório/ampla defesa. SV 14: advogado acessa diligências já documentadas",
    practicalExample: "Testemunha ouvida sem presença do advogado do investigado → válido (IP inquisitivo). Advogado acessa autos = garantido (SV 14)",
    difficulty: "MEDIO",
  },
  {
    id: "dpp_ip_c04",
    title: "IP — E e S: Escrito e Sigiloso (Súmula Vinculante 14)",
    textContent: `O IP é ESCRITO (art. 9º CPP) e SIGILOSO (art. 20 CPP). Tudo que acontece no IP deve ser reduzido a termo — nada é oral definitivo. O sigilo protege a eficácia das investigações.

PONTOS-CHAVE:
• Escrito (art. 9º CPP): "Todas as peças do inquérito policial serão, num só processado, reduzidas a escrito ou datilografadas e, neste caso, rubricadas pela autoridade"
• Sigiloso (art. 20 CPP): a autoridade assegurará o sigilo necessário à elucidação do fato ou interesse da sociedade
• Sigilo externo: terceiros (imprensa, pessoas estranhas) não têm acesso
• Sigilo interno (exceção — SV 14): o ADVOGADO do investigado tem acesso às diligências já documentadas — sigilo não pode ser usado para impedir defesa técnica
• Advogado do investigado ≠ MP ≠ Juiz: estes têm acesso irrestrito

EXEMPLO:
IP investigando uma organização criminosa: sigilo mantido para não alertar os investigados. Um dos suspeitos preso em flagrante tem direito de ter seu advogado acessando os autos das diligências já concluídas (SV 14), mas o Delegado pode pedir sigilo de diligências em andamento.

DICA BANCA:
"O sigilo do IP abrange o advogado constituído pelo investigado, impedindo seu acesso às peças do processo" — ERRADO. A SV 14 garante ao advogado acesso às diligências JÁ documentadas. Sigilo prevalece apenas para diligências em andamento.`,
    mnemonic: "E = Escrito (art. 9 CPP): tudo vira papel. S = Sigiloso (art. 20 CPP): mas SV 14 garante advogado acessa o que já foi documentado",
    keyPoint: "IP escrito (art. 9) e sigiloso (art. 20). SV 14: advogado do investigado acessa diligências já documentadas",
    practicalExample: "Delegado nega acesso ao advogado do preso em flagrante → ILEGAL (viola SV 14). Sigilo de operação em curso → LEGAL",
    difficulty: "MEDIO",
  },
  {
    id: "dpp_ip_c05",
    title: "IP — O de Oficial: Instauração e Formas de Início",
    textContent: `O IP é OFICIAL: conduzido exclusivamente por órgão estatal (Polícia Judiciária). Particulares não podem presidir IPs. As formas de instauração variam conforme a natureza do crime.

PONTOS-CHAVE:
• Presidência: Delegado de Polícia (Polícia Civil — crimes comuns; PF — crimes federais)
• Formas de instauração:
  1. DE OFÍCIO (portaria): crimes de ação penal pública incondicionada — Delegado instaura por iniciativa própria ou por comunicação de terceiro
  2. REQUISIÇÃO do MP ou do Juiz: obrigatória para o Delegado (não pode recusar)
  3. REQUERIMENTO do ofendido: para crimes de ação pública condicionada à representação
  4. AUTUAÇÃO EM FLAGRANTE: o APF substitui a portaria — já instaura o IP
• O Delegado não pode arquivar o IP: arquivamento é decisão do MP e do Juiz (art. 17 CPP)
• Prazo de conclusão: 30 dias (indiciado solto) | 10 dias (indiciado preso) — art. 10 CPP

EXEMPLO:
Crime de roubo a banco (ação penal pública incondicionada): Delegado instaura por portaria ou com base no APF dos suspeitos presos. Em 10 dias (presos), conclui e envia ao MP. O MP decide: oferecer denúncia, pedir diligências ou arquivar.

DICA BANCA:
"O Delegado pode arquivar o IP quando não houver provas suficientes" — ERRADO. O Delegado NÃO pode arquivar o IP — somente o MP pede o arquivamento e o Juiz homologa (art. 17 CPP). Esta é uma questão clássica de CESPE.`,
    mnemonic: "O = Oficial: só autoridade policial preside. 4 formas de início: De ofício, Requisição, Requerimento, Flagrante (D.R.R.F.)",
    keyPoint: "IP oficial: presidido pelo Delegado. 4 formas de início: portaria, requisição MP/Juiz, requerimento ofendido, APF. Delegado NÃO arquiva",
    practicalExample: "MP requisita IP → Delegado obrigado a instaurar. Delegado 'arquiva' IP por conta própria → ato ilegal (só MP+Juiz arquivam)",
    difficulty: "MEDIO",
  },
  {
    id: "dpp_ip_c06",
    title: "Indiciamento, Relatório e Destinação do IP",
    textContent: `O IP encerra com o RELATÓRIO do Delegado (art. 10, §1º CPP) e é remetido ao MP. O indiciamento é ato exclusivo do Delegado que atribui ao investigado a condição de suspeito formal.

PONTOS-CHAVE:
• Indiciamento: ato exclusivo do Delegado — reconhece indícios de autoria; é diferente de acusação (que é ato do MP)
• Relatório (art. 10, §1º): Delegado relata a investigação sem opinar sobre procedência da ação penal
• Destino do IP: remetido ao Juiz competente que o encaminha ao MP
• O que o MP pode fazer: oferecer DENÚNCIA | pedir DILIGÊNCIAS adicionais | pedir ARQUIVAMENTO
• Arquivamento: requerido pelo MP → homologado pelo Juiz → ou Câmara de Revisão (controle externo do MP)
• Reabertura do IP: possível se surgirem novas provas (art. 18 CPP) — mas o Juiz não pode desarquivar por conta própria
• Prazo: IP pode ser prorrogado a pedido do Delegado, com autorização do Juiz, quando o crime for de grande complexidade

EXEMPLO:
IP de lavagem de dinheiro: indiciados formalmente pelo Delegado → relatório → remetido ao MP → MP pede mais diligências (quebra de sigilo bancário) → MP recebe, denuncia 3 dos 5 indiciados → quanto aos demais, pede arquivamento → Juiz homologa arquivamento.

DICA BANCA:
"O Juiz pode determinar a reabertura do IP arquivado se entender que há novas provas" — ERRADO. A reabertura do IP arquivado depende de novas provas e é iniciativa do MP (art. 18 CPP). O Juiz não pode reabrir de ofício.`,
    mnemonic: "Final do IP: Relatório do Delegado → MP decide (Denúncia / Diligências / Arquivamento). Delegado NÃO acusa; MP NÃO prende; Juiz NÃO investiga",
    keyPoint: "Indiciamento: ato do Delegado. Relatório: Delegado relata sem opinar. MP decide: denunciar, diligências ou arquivar. Delegado não arquiva",
    practicalExample: "Delegado relata IP sem concluir pela culpa → correto. MP pede arquivamento → Juiz homologa. Novas provas → MP pode pedir reabertura",
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
  questionType: string;
  alternatives: Alternative[];
  correctAnswer: string;
  correctOption: number;
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: string;
}

const questions: QuestionData[] = [
  // ── Q1–Q4: FÁCIL (Municipal/GM/CBM) ──────────────────────────────────────
  {
    id: "dpp_ip_q01",
    statement:
      "O Inquérito Policial é um procedimento de natureza:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Judicial, pois está previsto no Código de Processo Penal." },
      { letter: "B", text: "Administrativa, de caráter investigatório, presidido pelo Delegado de Polícia." },
      { letter: "C", text: "Judicial, pois o Juiz preside as oitivas das testemunhas." },
      { letter: "D", text: "Administrativa, presidida pelo Ministério Público." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O IP é procedimento ADMINISTRATIVO (não judicial) de caráter investigatório, presidido pelo Delegado de Polícia (autoridade policial). O Juiz não preside o IP; o MP não preside o IP — ambos recebem o IP ao final.",
    explanationCorrect:
      "Correto! IP = procedimento ADMINISTRATIVO, pré-processual, presidido pelo Delegado. A pegadinha clássica é confundi-lo com processo judicial.",
    explanationWrong:
      "Errado: o IP é procedimento ADMINISTRATIVO, não judicial. Quem preside é o DELEGADO de Polícia, não o Juiz nem o MP. Juiz e MP recebem o IP concluído.",
    difficulty: "FACIL",
  },
  {
    id: "dpp_ip_q02",
    statement:
      "Qual das seguintes afirmações sobre a dispensabilidade do Inquérito Policial é CORRETA?",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "O IP é indispensável para o oferecimento de denúncia pelo Ministério Público." },
      { letter: "B", text: "O IP é dispensável quando o MP já possui elementos suficientes de autoria e materialidade." },
      { letter: "C", text: "O IP é dispensável apenas nos crimes de menor potencial ofensivo." },
      { letter: "D", text: "O IP é dispensável somente quando o acusado confessar o crime." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O IP não é condição de procedibilidade para a ação penal (art. 39, §5º CPP). O MP pode oferecer denúncia com base em qualquer elemento suficiente de autoria e materialidade — APF, peças de informação, CPI, TCO — independentemente de IP formal.",
    explanationCorrect:
      "Correto! IP dispensável = MP pode denunciar sem IP quando já tem prova suficiente. Não há limitação ao tipo de crime ou à confissão.",
    explanationWrong:
      "Errado: o IP é dispensável em qualquer crime, não apenas nos de menor potencial ofensivo. A limitação é ter elementos suficientes de autoria e materialidade — pode vir de APF, CPI, peças de informação, etc.",
    difficulty: "FACIL",
  },
  {
    id: "dpp_ip_q03",
    statement:
      "De acordo com o art. 9º do CPP, o Inquérito Policial deve ser:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "Oral, podendo ser reduzido a escrito apenas em crimes hediondos." },
      { letter: "B", text: "Escrito: todas as peças devem ser reduzidas a escrito ou datilografadas." },
      { letter: "C", text: "Oral, com gravação audiovisual obrigatória." },
      { letter: "D", text: "Escrito apenas nos crimes contra a administração pública." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Art. 9º CPP: 'Todas as peças do inquérito policial serão, num só processado, reduzidas a escrito ou datilografadas e, neste caso, rubricadas pela autoridade.' O IP é ESCRITO — sem exceção baseada no tipo de crime.",
    explanationCorrect:
      "Correto! E de D.I.E.S.O = Escrito. Art. 9 CPP: todas as peças do IP em escrito, num só processado, rubricadas pela autoridade.",
    explanationWrong:
      "Errado: o IP é SEMPRE escrito (art. 9 CPP), independentemente do tipo de crime. Não há modalidade oral do IP.",
    difficulty: "FACIL",
  },
  {
    id: "dpp_ip_q04",
    statement:
      "Quanto ao arquivamento do Inquérito Policial, é correto afirmar que:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "O Delegado pode arquivar o IP quando entender não haver provas suficientes." },
      { letter: "B", text: "O arquivamento é determinado pelo Delegado com homologação do Juiz." },
      { letter: "C", text: "O arquivamento é requerido pelo MP e homologado pelo Juiz; o Delegado não pode arquivar." },
      { letter: "D", text: "O Delegado e o MP podem arquivar o IP conjuntamente, sem necessidade de decisão judicial." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Art. 17 CPP: 'A autoridade policial não poderá mandar arquivar autos de inquérito.' O arquivamento é ato do MP (requerer) + Juiz (homologar). O Delegado NÃO arquiva — ele apenas relata e remete.",
    explanationCorrect:
      "Correto! Delegado NÃO arquiva IP (art. 17 CPP). Somente o MP requer o arquivamento e o Juiz homologa. Esta é a regra mais cobrada sobre o IP.",
    explanationWrong:
      "Errado: art. 17 CPP veda expressamente que o Delegado arquive o IP. Quem arquiva = MP (requere) + Juiz (homologa). Delegado = investiga e relata.",
    difficulty: "FACIL",
  },

  // ── Q5–Q8: MÉDIO (Estadual/PC/PM) ────────────────────────────────────────
  {
    id: "dpp_ip_q05",
    statement:
      "A Súmula Vinculante 14 do STF trata do direito do defensor no Inquérito Policial. Assinale a alternativa que a representa corretamente:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "O sigilo do IP é absoluto, impedindo qualquer acesso do advogado constituído pelo investigado." },
      { letter: "B", text: "O defensor tem acesso amplo aos elementos de prova já documentados no IP, no interesse do representado." },
      { letter: "C", text: "O defensor só pode acessar o IP após o encerramento das investigações e envio ao MP." },
      { letter: "D", text: "O defensor pode acompanhar todas as diligências em andamento, inclusive as ainda não documentadas." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "SV 14: 'É direito do defensor, no interesse do representado, ter acesso amplo aos elementos de prova que, já documentados em procedimento investigatório realizado por órgão com competência de polícia judiciária, digam respeito ao exercício do direito de defesa.' Chave: apenas diligências JÁ documentadas.",
    explanationCorrect:
      "Correto! SV 14: defensor acessa elementos JÁ documentados. Sigilo é limitado — não pode ser usado para negar ao advogado acesso ao que já está nos autos.",
    explanationWrong:
      "Errado: SV 14 garante acesso às diligências JÁ documentadas. O sigilo pode impedir acesso a diligências em andamento (não documentadas), mas não ao que já foi registrado nos autos.",
    difficulty: "MEDIO",
  },
  {
    id: "dpp_ip_q06",
    statement:
      "Acerca das formas de instauração do Inquérito Policial, assinale a alternativa INCORRETA:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "O Delegado pode instaurar o IP de ofício, por portaria, nos crimes de ação penal pública incondicionada." },
      { letter: "B", text: "O IP pode ser instaurado por requisição do MP ou do Juiz, que é de atendimento obrigatório pelo Delegado." },
      { letter: "C", text: "A autuação em flagrante dispensa portaria, funcionando como forma de instauração do IP." },
      { letter: "D", text: "O Delegado pode recusar requisição do MP para instaurar IP quando entender manifestamente descabida." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "A requisição do MP ou do Juiz para instauração do IP é de ATENDIMENTO OBRIGATÓRIO pelo Delegado — não há margem para recusa (art. 5º, II CPP). O Delegado não pode recusar requisição do MP. A alternativa D está incorreta por afirmar que ele pode recusar.",
    explanationCorrect:
      "Correto identificar a D como incorreta! Requisição do MP = obrigatória para o Delegado. Não há poder discricionário do Delegado para recusar requisição de instauração.",
    explanationWrong:
      "Atenção: a requisição do MP ou do Juiz para instaurar IP é OBRIGATÓRIA (art. 5º, II CPP). O Delegado não pode recusar, diferentemente do requerimento do ofendido (que ele pode indeferir — com recurso ao Chefe de Polícia).",
    difficulty: "MEDIO",
  },
  {
    id: "dpp_ip_q07",
    statement:
      "Sobre os prazos do Inquérito Policial previstos no CPP (art. 10), assinale a alternativa CORRETA:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "O IP deve ser concluído em 30 dias, independentemente de o indiciado estar preso ou solto." },
      { letter: "B", text: "O IP deve ser concluído em 10 dias se o indiciado estiver preso; 30 dias se estiver solto." },
      { letter: "C", text: "O IP deve ser concluído em 15 dias se o indiciado estiver preso; 60 dias se estiver solto." },
      { letter: "D", text: "O IP deve ser concluído em 5 dias se o indiciado estiver preso; 30 dias se estiver solto." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Art. 10 CPP: prazo de 10 dias (indiciado PRESO) e 30 dias (indiciado SOLTO). O prazo de 10 dias é peremptório quando há preso — não pode ser prorrogado sem autorização judicial. O de 30 dias pode ser prorrogado.",
    explanationCorrect:
      "Correto! 10 dias = preso; 30 dias = solto. Mnemônico: preso tem prazo menor (urgência de preservar a liberdade). Ambos prorrogáveis com autorização judicial.",
    explanationWrong:
      "Errado: os prazos do CPP são 10 dias (preso) e 30 dias (solto). Não são os mesmos, pois a situação do preso exige resolução mais rápida em respeito à liberdade individual.",
    difficulty: "MEDIO",
  },
  {
    id: "dpp_ip_q08",
    statement:
      "No tocante ao indiciamento no Inquérito Policial, é correto afirmar que:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "O indiciamento é ato exclusivo do Ministério Público, que o faz ao oferecer a denúncia." },
      { letter: "B", text: "O indiciamento é ato exclusivo do Delegado de Polícia, que atribui ao investigado a condição de suspeito formal." },
      { letter: "C", text: "O indiciamento é ato do Juiz, realizado após análise das provas colhidas no IP." },
      { letter: "D", text: "O indiciamento equivale à pronúncia na fase judicial, tornando o investigado réu no IP." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O indiciamento é ato EXCLUSIVO do Delegado de Polícia (Lei 12.830/2013, art. 2º, §6º). Através do indiciamento, o Delegado atribui ao investigado a condição de suspeito formal com base nos indícios de autoria. É diferente da denúncia (MP) e da pronúncia (Juiz no Tribunal do Júri).",
    explanationCorrect:
      "Correto! Indiciamento = ato exclusivo do DELEGADO (Lei 12.830/2013). Não confundir: denúncia = MP; pronúncia = Juiz (Júri); indiciamento = Delegado.",
    explanationWrong:
      "Errado: indiciamento = ato exclusivo do DELEGADO (Lei 12.830/2013, art. 2º, §6º). MP oferece denúncia (diferente de indict). Juiz pronuncia (no Júri). Delegado indicia.",
    difficulty: "MEDIO",
  },

  // ── Q9–Q12: DIFÍCIL (Federal/PF/PRF — Q9 CERTO/ERRADO CEBRASPE) ──────────
  {
    id: "dpp_ip_q09",
    statement:
      "(CEBRASPE – PF – Adaptada) Julgue o item:\n\nNo inquérito policial, que tem natureza inquisitiva, não se assegura ao investigado o exercício do contraditório e da ampla defesa; entretanto, em respeito ao direito de defesa, o defensor constituído tem acesso amplo às peças do IP ainda que as diligências estejam em andamento e não tenham sido documentadas.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. A primeira parte está correta (IP inquisitivo, sem contraditório). A segunda parte está ERRADA: a SV 14 garante acesso apenas às diligências JÁ DOCUMENTADAS — o acesso não abrange diligências em andamento ainda não documentadas. O sigilo pode ser mantido sobre investigações ainda em curso.",
    explanationCorrect:
      "Correto ao marcar ERRADO! A SV 14 limita o acesso do advogado às diligências JÁ documentadas. O sigilo é mantido sobre investigações não concluídas/documentadas. A questão tenta fazer confundir o acesso amplo (que existe, mas com limitação).",
    explanationWrong:
      "Este item é ERRADO. Apesar de o IP ser inquisitivo (correto), o advogado NÃO acessa diligências em andamento não documentadas. A SV 14 é clara: 'elementos de prova que, já documentados...' — o advérbio 'já' é decisivo.",
    difficulty: "DIFICIL",
  },
  {
    id: "dpp_ip_q10",
    statement:
      "Com relação à reabertura do Inquérito Policial arquivado, é correto afirmar que:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "O Juiz pode determinar a reabertura do IP de ofício sempre que entender que houve precipitação no arquivamento." },
      { letter: "B", text: "A reabertura do IP arquivado depende do surgimento de novas provas e é requerida pelo MP, não podendo o Juiz reabrir de ofício." },
      { letter: "C", text: "Uma vez arquivado, o IP não pode ser reaberto em hipótese alguma, por força da coisa julgada." },
      { letter: "D", text: "O Delegado pode reabrir o IP arquivado se entender que há novas diligências a serem realizadas." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Art. 18 CPP: após o arquivamento, o IP pode ser reaberto apenas se surgirem novas provas. A reabertura é requerida pelo MP. O Juiz não pode reabrir de ofício (princípio acusatório). O Delegado tampouco pode reabrir — não tem poder de arquivar nem reabrir. O arquivamento não produz coisa julgada material.",
    explanationCorrect:
      "Correto! Art. 18 CPP: reabertura = novas provas + requerimento do MP. Juiz não reabre de ofício. Delegado não pode arquivar nem reabrir. Arquivamento não = coisa julgada.",
    explanationWrong:
      "Errado: o arquivamento do IP não é definitivo (não há coisa julgada material). Novas provas permitem reabertura — mas apenas o MP pode requerê-la. O Juiz não pode reabrir de ofício (princípio acusatório). O Delegado não tem poderes de arquivamento/reabertura.",
    difficulty: "DIFICIL",
  },
  {
    id: "dpp_ip_q11",
    statement:
      "A respeito do mnemônico D.I.E.S.O para as características do IP, analise:\n\nI. D — Dispensável: o MP pode oferecer denúncia sem IP se tiver elementos suficientes.\nII. I — Inquisitivo: há contraditório mitigado durante a colheita de provas.\nIII. E — Escrito: toda peça do IP deve ser reduzida a escrito (art. 9º CPP).\nIV. S — Sigiloso: a SV 14 impede qualquer acesso do advogado ao IP.\n\nEstão CORRETAS apenas:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "I e III." },
      { letter: "B", text: "I, II e III." },
      { letter: "C", text: "II, III e IV." },
      { letter: "D", text: "I, II, III e IV." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "I — CORRETA: IP dispensável (art. 39, §5 CPP). II — ERRADA: IP inquisitivo = SEM contraditório (não 'mitigado' — simplesmente não existe no IP). III — CORRETA: art. 9 CPP. IV — ERRADA: SV 14 GARANTE acesso do advogado às diligências já documentadas — o oposto do afirmado.",
    explanationCorrect:
      "Correto! Apenas I e III estão certas. II está errada (não há contraditório 'mitigado' — não há contraditório no IP). IV está errada (SV 14 GARANTE o acesso do advogado).",
    explanationWrong:
      "Atenção: II está errada porque o IP é inquisitivo no sentido de NÃO TER contraditório — não é 'mitigado', é ausente. IV está errada porque a SV 14 GARANTE ao advogado o acesso às diligências documentadas, não impede.",
    difficulty: "DIFICIL",
  },
  {
    id: "dpp_ip_q12",
    statement:
      "Em relação ao Inquérito Policial Federal (conduzido pela Polícia Federal), assinale a alternativa CORRETA:",
    questionType: "MULTIPLA_ESCOLHA",
    alternatives: [
      { letter: "A", text: "O prazo para conclusão do IP Federal é de 15 dias quando o indiciado está preso, prorrogável por igual período." },
      { letter: "B", text: "A PF preside IPs sobre crimes praticados em detrimento de bens, serviços e interesses da União (art. 144, §1º, I CF)." },
      { letter: "C", text: "O IP Federal pode ser conduzido pelo Ministério Público Federal em crimes de lavagem de dinheiro." },
      { letter: "D", text: "O IP Federal é privativo da Polícia Federal, que também conduz IPs de crimes estaduais quando solicitada pelo Governador." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Art. 144, §1º, I CF: à PF compete apurar infrações penais contra a ordem política e social ou em detrimento de bens, serviços e interesses da União. O IP Federal tem o mesmo prazo (10 dias preso, 30 solto) mas a Lei 5.010/66 prevê prazo próprio (15+15 dias para presos em crimes federais específicos). A PF não conduz crimes estaduais a pedido do Governador — isso seria violação à autonomia federativa.",
    explanationCorrect:
      "Correto! PF apura crimes em detrimento da União (art. 144, §1, I CF). Competência constitucional expressa. Crimes como estelionato contra o INSS, contrabando, crimes federais são de competência da PF.",
    explanationWrong:
      "Errado: o MP não preside IPs (ele pode realizar investigações, mas o IP formal é presidido pela autoridade policial). A PF não atende solicitações de Governadores para crimes estaduais. O prazo padrão é 10/30 dias (CPP), não 15/15 dias para todos os casos.",
    difficulty: "DIFICIL",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("🚀 Seed: Direito Processual Penal — Inquérito Policial");
  console.log("=".repeat(60));

  // 1. Encontrar Subject
  const subjectId = await findSubject("PROCESSUAL_PENAL");
  if (!subjectId) {
    console.error("❌ Subject 'PROCESSUAL_PENAL' não encontrado. Verifique o banco.");
    process.exit(1);
  }
  console.log(`✅ Subject encontrado: ${subjectId}`);

  // 2. Garantir colunas Phase 5
  await db.execute(sql`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS mnemonic TEXT`);
  await db.execute(sql`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS "keyPoint" TEXT`);
  await db.execute(sql`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS "practicalExample" TEXT`);
  await db.execute(sql`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "explanationCorrect" TEXT`);
  await db.execute(sql`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "explanationWrong" TEXT`);
  console.log("✅ Colunas Phase 5 garantidas");

  // 3. Criar Tópico
  const topicId = await findOrCreateTopic("Inquérito Policial — D.I.E.S.O", subjectId);
  console.log(`✅ Tópico: ${topicId}`);

  // 4. Inserir Conteúdos
  console.log("\n📚 Inserindo conteúdos...");
  let contentsCreated = 0;
  let contentsSkipped = 0;

  for (const c of contents) {
    if (await contentExists(c.title, subjectId)) {
      console.log(`  ⏭️  Conteúdo já existe: ${c.title}`);
      contentsSkipped++;
      continue;
    }
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
        ${Math.round(c.textContent.split(/\s+/).length)},
        ${Math.ceil(c.textContent.split(/\s+/).length / 200)},
        ${c.mnemonic}, ${c.keyPoint}, ${c.practicalExample},
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Criado: ${c.title}`);
    contentsCreated++;
  }

  // 5. Inserir Questões
  console.log("\n❓ Inserindo questões...");
  let questionsCreated = 0;
  let questionsSkipped = 0;

  for (const q of questions) {
    if (await questionExists(q.id)) {
      console.log(`  ⏭️  Questão já existe: ${q.id}`);
      questionsSkipped++;
      continue;
    }
    const alternativesJson = JSON.stringify(
      q.alternatives.map((a) => ({ letter: a.letter, text: a.text }))
    );
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
        0, ${q.questionType},
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Questão criada: ${q.id} (${q.difficulty})`);
    questionsCreated++;
  }

  // 6. Relatório
  console.log("\n" + "=".repeat(60));
  console.log(`📊 RELATÓRIO FINAL:`);
  console.log(`   Conteúdos: ${contentsCreated} criados, ${contentsSkipped} já existiam`);
  console.log(`   Questões:  ${questionsCreated} criadas, ${questionsSkipped} já existiam`);
  console.log("✅ Seed de Direito Processual Penal (Inquérito Policial) concluído!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
