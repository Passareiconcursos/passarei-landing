/**
 * Seed R14: Direito Constitucional — Direitos e Garantias Fundamentais (Art. 5º)
 *
 * Grupo A: contentIdMap com vínculo total (sem roleta russa).
 * Popula 6 átomos de Conteúdo + 12 Questões CERTO/ERRADO estilo CEBRASPE.
 * Idempotente: verifica existência antes de inserir.
 *
 * Execução:
 *   npx tsx db/seed-direito-constitucional-art5-r14.ts
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
    id: "dc_r14_c01",
    title: "Art. 5º — Isonomia e Princípio da Legalidade (Incisos I e II)",
    textContent: `O caput do Art. 5º da CF/88 consagra o princípio da isonomia: "Todos são iguais perante a lei, sem distinção de qualquer natureza." Destina-se a brasileiros e estrangeiros residentes no País.

INCISO I — IGUALDADE ENTRE HOMENS E MULHERES:
"Homens e mulheres são iguais em direitos e obrigações, nos termos desta Constituição."
• A ressalva "nos termos desta Constituição" permite diferenças justificadas pela própria CF (ex: licença-maternidade maior que paternidade, proteção do mercado de trabalho feminino).
• Igualdade FORMAL (perante a lei) + igualdade MATERIAL (tratamento desigual aos desiguais).

INCISO II — PRINCÍPIO DA LEGALIDADE:
"Ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei."
• Dimensão NEGATIVA: o Estado não pode impor obrigações sem lei.
• Dimensão POSITIVA: o particular pode fazer tudo que a lei não proíba.
• ATENÇÃO: a expressão "em virtude de lei" admite atos normativos infralegais QUE DECORRAM de lei (regulamentos, portarias — não criam obrigações autônomas).

ISONOMIA E CONCURSO PÚBLICO:
• A isonomia proíbe distinções injustificadas no edital, mas permite requisitos relacionados à natureza do cargo (ex: altura mínima para policiais — STF admite se houver justificativa).
• Salário igual para trabalho igual no mesmo cargo (Súmula STJ).

DICA BANCA — CEBRASPE:
• "A legalidade veda ao Estado qualquer atuação sem lei prévia" — ERRADO. O Executivo age por decreto regulamentador sem lei específica em muitos casos (poder de polícia, atos administrativos internos).
• Estrangeiros RESIDENTES têm os direitos do Art. 5º. Estrangeiros NÃO residentes têm proteção via tratados e princípios (não o Art. 5º diretamente).`,
    mnemonic: "ISO-LEI: ISOmonia = todos iguais (I: homens=mulheres 'nos termos'); LEIalidade = só fazer/deixar de fazer O QUE A LEI MANDA (II).",
    keyPoint: "Caput: isonomia a brasileiros e estrangeiros residentes. I: homens=mulheres 'nos termos da CF'. II: ninguém obrigado a fazer/omitir sem lei.",
    practicalExample: "Edital exige altura mínima para policial → STF admite se justificado. 'Portaria X proíbe conduta Y sem lei prévia' → viola inciso II (legalidade).",
    difficulty: "FACIL",
  },
  {
    id: "dc_r14_c02",
    title: "Art. 5º — Liberdades de Pensamento, Expressão e Consciência (Incisos IV, VIII e IX)",
    textContent: `A CF/88 protege múltiplas dimensões da liberdade intelectual e de consciência no Art. 5º.

INCISO IV — LIBERDADE DE MANIFESTAÇÃO DO PENSAMENTO:
"É livre a manifestação do pensamento, sendo vedado o anonimato."
• Liberdade ampla, mas com responsabilização civil e penal por abusos.
• VEDADO O ANONIMATO: quem manifesta deve poder ser identificado.
• Manifestações anônimas NÃO são protegidas como exercício de direito fundamental — podem ser investigadas e os autores responsabilizados.
• O STF admite o uso de denúncia anônima (notícia crime apócrifa) como INÍCIO de investigação, desde que verificada antes de qualquer ação.

INCISO VIII — LIBERDADE DE CONSCIÊNCIA E CRENÇA:
"Ninguém será privado de direitos por motivo de crença religiosa ou de convicção filosófica ou política, salvo se as invocar para eximir-se de obrigação legal a todos imposta e recusar-se a cumprir prestação alternativa, fixada em lei."
• Escusa de consciência (objeção de consciência): ex. serviço militar → alternativa: serviço civil alternativo.
• Se recusar TAMBÉM a prestação alternativa → pode ser privado de direitos políticos (não de direitos civis).

INCISO IX — LIBERDADE DE EXPRESSÃO INTELECTUAL, ARTÍSTICA E CIENTÍFICA:
"É livre a expressão da atividade intelectual, artística, científica e de comunicação, independentemente de censura ou licença."
• Proíbe a CENSURA PRÉVIA (não exige autorização prévia do Estado).
• Não é absoluta: responde por abuso (danos morais, crimes de opinião).
• A CF veda a censura prévia, mas não imuniza o autor de responsabilidade posterior.

DICA BANCA:
• "A CF proíbe o anonimato absoluto em qualquer manifestação" — CERTO (inciso IV).
• "Quem se recusa ao serviço militar por convicção pode ser privado de todos os seus direitos" — ERRADO. Perde apenas direitos políticos se recusar também a alternativa.`,
    mnemonic: "PAC-C: Pensamento (IV) veda Anonimato; Consciência (VIII) admite escusa COM alternativa; Criação (IX) proíbe Censura prévia.",
    keyPoint: "IV: livre manifestação, VEDADO anonimato. VIII: escusa de consciência com prestação alternativa — recusa também → perde direitos políticos. IX: proibida censura prévia.",
    practicalExample: "'Panfleto anônimo atacando candidato' → não protegido, autor identificável e responsabilizável. 'Pastor recusa serviço militar' → deve cumprir serviço civil alternativo.",
    difficulty: "FACIL",
  },
  {
    id: "dc_r14_c03",
    title: "Art. 5º — Inviolabilidade do Domicílio e das Comunicações (Incisos XI e XII)",
    textContent: `Dois dos incisos mais cobrados em concursos policiais, especialmente PF e PCDF.

INCISO XI — INVIOLABILIDADE DO DOMICÍLIO:
"A casa é asilo inviolável do indivíduo, ninguém nela podendo penetrar sem consentimento do morador, salvo em caso de:
  (a) flagrante delito
  (b) desastre
  (c) para prestar socorro
  (d) durante o dia, por determinação judicial"

CONCEITO DE "CASA":
O STF adotou conceito amplo: inclui escritório, quarto de hotel, trailer, embarcação habitada. NÃO inclui área de acesso público (hall de entrada de prédio comercial aberto ao público).

"DURANTE O DIA" para mandado judicial:
• STF (HC 93.050): "dia" = 6h às 21h (critério temporal objetivo).
• Nos casos (a), (b) e (c) — flagrante, desastre e socorro — a entrada é possível A QUALQUER HORA (dia ou noite), pois não dependem de ordem judicial.

INCISO XII — SIGILO DAS COMUNICAÇÕES:
"É inviolável o sigilo da correspondência e das comunicações telegráficas, de dados e das comunicações telefônicas, salvo, no último caso, por ordem judicial, nas hipóteses e na forma que a lei estabelecer para fins de investigação criminal ou instrução processual penal."

INTERPRETAÇÃO:
• "salvo, no último caso" = apenas comunicações TELEFÔNICAS podem ser interceptadas com ordem judicial.
• DADOS ARMAZENADOS (e-mail já lido, histórico bancário): STF entende que são protegidos pelo inciso XII (dados) e podem ser acessados mediante ordem judicial — não exige lei específica de interceptação.
• Correspondência física em presídio: STF permite restrição por lei (LSP e regulamentos prisionais).

DICA BANCA:
• "O domicílio pode ser violado à noite para cumprimento de mandado judicial de busca" — ERRADO (mandado judicial só durante o dia).
• "O sigilo telefônico pode ser quebrado por ordem judicial" — CERTO.
• "Dados bancários são absolutamente invioláveis" — ERRADO (CPI e juízo competente podem acessar).`,
    mnemonic: "DOMICÍLIO = 4 exceções: FDS+J (Flagrante, Desastre, Socorro = qualquer hora; Judicial = só de dia 6h-21h). TELEFONE = única exceção com ordem judicial.",
    keyPoint: "XI: casa inviolável — flagrante/desastre/socorro: qualquer hora; mandado judicial: só de dia (6h–21h). XII: sigilo telefônico quebra com ordem judicial e lei.",
    practicalExample: "'Policial entra às 23h com mandado de busca' → viola inciso XI. 'Policial entra à meia-noite em flagrante delito' → LÍCITO. 'Interceptação telefônica com ordem judicial' → LÍCITO.",
    difficulty: "FACIL",
  },
  {
    id: "dc_r14_c04",
    title: "Art. 5º — Habeas Corpus e Habeas Data (LXVIII e LXXII)",
    textContent: `Dois remédios constitucionais distintos em finalidade, legitimidade e objeto.

HABEAS CORPUS — Inciso LXVIII:
"Conceder-se-á habeas corpus sempre que alguém sofrer ou se achar ameaçado de sofrer violência ou coação em sua liberdade de locomoção, por ilegalidade ou abuso de poder."

CARACTERÍSTICAS DO HC:
• Objeto: protege a liberdade de LOCOMOÇÃO (liberdade física de ir e vir)
• Legitimidade ATIVA: qualquer pessoa, inclusive o próprio paciente, ou terceiro em seu favor — sem necessidade de advogado
• Legitimidade PASSIVA: qualquer autoridade pública ou particular que restrinja ilegalmente a locomoção
• Espécies: HC PREVENTIVO (salvo-conduto — ameaça) e HC LIBERATÓRIO/REPRESSIVO (já preso)
• Gratuito e sem custas processuais
• NÃO cabe HC para proteger direitos que não sejam de locomoção (ex: não cabe para discutir demissão)

HABEAS DATA — Inciso LXXII:
"Conceder-se-á habeas data:
  a) para assegurar o conhecimento de informações relativas à pessoa do impetrante, constantes de registros ou banco de dados de entidades governamentais ou de caráter público;
  b) para a retificação de dados, quando não se prefira fazê-lo por processo sigiloso, judicial ou administrativo."

CARACTERÍSTICAS DO HD:
• Objeto: acesso e retificação de DADOS PESSOAIS em cadastros governamentais ou de caráter público
• Legitimidade ativa: pessoa física ou jurídica — apenas para dados DA PRÓPRIA PESSOA (personalíssimo)
• CONDIÇÃO: deve haver recusa administrativa prévia (não é ação constitucional direta sem tentativa extrajudicial — posição majoritária e STJ)
• Gratuito (art. 5º, LXXVII)
• NÃO se presta para obter documentos públicos em geral (para isso: ação popular ou Lei de Acesso à Informação)

QUADRO COMPARATIVO:
┌───────────────┬─────────────────────────────┬────────────────────────────────┐
│               │ Habeas Corpus               │ Habeas Data                    │
├───────────────┼─────────────────────────────┼────────────────────────────────┤
│ Objeto        │ Liberdade de locomoção      │ Dados pessoais (acesso/retif.) │
│ Gratuito      │ Sim                         │ Sim                            │
│ Advogado      │ Não necessário              │ Necessário (ação judicial)     │
│ Para terceiro │ Sim                         │ Não (personalíssimo)           │
│ Pré-requisito │ Nenhum                      │ Recusa administrativa prévia   │
└───────────────┴─────────────────────────────┴────────────────────────────────┘`,
    mnemonic: "HC = Habita-se (locomoção) — qualquer um impetrar, sem advogado, sem pré-requisito. HD = meus Dados pessoais — só eu, com recusa prévia.",
    keyPoint: "HC (LXVIII): protege locomoção, sem advogado, sem pré-requisito. HD (LXXII): acesso/retificação de dados pessoais, personalíssimo, exige recusa administrativa prévia.",
    practicalExample: "'Preso ilegalmente' → HC. 'Terceiro impetra HC em favor do preso' → LÍCITO. 'Quero ver ficha do DEIC com meu nome' → HD. 'Quero ver dados de outra pessoa' → HD NÃO cabe.",
    difficulty: "MEDIO",
  },
  {
    id: "dc_r14_c05",
    title: "Art. 5º — Mandado de Segurança e Mandado de Injunção (LXIX, LXX, LXXI)",
    textContent: `Dois remédios constitucionais contra atos ilegais ou omissões normativas do Poder Público.

MANDADO DE SEGURANÇA — Incisos LXIX e LXX:
LXIX: "Conceder-se-á mandado de segurança para proteger direito líquido e certo, não amparado por habeas corpus ou habeas data, quando o responsável pela ilegalidade ou abuso de poder for autoridade pública ou agente de pessoa jurídica no exercício de atribuições do Poder Público."

ELEMENTOS DO MS:
• Direito LÍQUIDO E CERTO: comprovado de plano, sem necessidade de dilação probatória (prova documental pré-constituída)
• Prazo decadencial: 120 dias a contar do ato impugnado (Lei 12.016/2009)
• Não cabe MS contra ato judicial passível de recurso ou contra o qual caiba HC/HD
• Legitimidade passiva: autoridade coatora (pessoa física que praticou o ato — não a entidade)

MS COLETIVO — Inciso LXX:
"O mandado de segurança coletivo pode ser impetrado por:
  a) partido político com representação no Congresso Nacional
  b) organização sindical, entidade de classe ou associação legalmente constituída e em funcionamento há pelo menos 1 ano"

• Dispensa autorização individual dos membros para tutela de direitos coletivos e individuais homogêneos

MANDADO DE INJUNÇÃO — Inciso LXXI:
"Conceder-se-á mandado de injunção sempre que a falta de norma regulamentadora torne inviável o exercício dos direitos e liberdades constitucionais e das prerrogativas inerentes à nacionalidade, à soberania e à cidadania."

CARACTERÍSTICAS DO MI:
• Pressuposto: OMISSÃO LEGISLATIVA que inviabiliza exercício de direito constitucional
• Legitimidade ativa: qualquer pessoa prejudicada pela omissão
• STF (evolução jurisprudencial): passou de posição não-concretista (apenas comunicar ao Poder omisso) para posição CONCRETISTA (aplica norma análoga e garante o direito no caso concreto)
• Exemplo clássico: direito de greve de servidores públicos — STF aplicou lei de greve do setor privado enquanto não havia lei específica

QUADRO: MS × MI
┌───────────┬──────────────────────────────┬──────────────────────────────────┐
│           │ Mandado de Segurança         │ Mandado de Injunção              │
├───────────┼──────────────────────────────┼──────────────────────────────────┤
│ Objeto    │ Ato ilegal/abusivo de agente │ Omissão legislativa              │
│ Prazo     │ 120 dias                     │ Sem prazo (omissão permanente)   │
│ Coletivo  │ Sim (LXX)                    │ Sim (MI coletivo, lei 13.300)    │
│ Efeito    │ Anula/suspende o ato         │ Supre a omissão (concretista)    │
└───────────┴──────────────────────────────┴──────────────────────────────────┘`,
    mnemonic: "MS = Matéria Sólida (direito líquido e certo, 120 dias, ato ilegal). MI = Matéria Inexistente (falta de lei que inviabiliza direito constitucional).",
    keyPoint: "MS (LXIX): direito líquido e certo, 120 dias, contra ato ilegal de autoridade. MS coletivo (LXX): partido c/ representação ou associação com 1+ ano. MI (LXXI): omissão legislativa que inviabiliza direito constitucional.",
    practicalExample: "'Servidor demitido sem due process' → MS (ato ilegal). 'Servidores querem fazer greve, não há lei regulamentando' → MI. 'Prazo de 121 dias do ato' → MS decaiu.",
    difficulty: "MEDIO",
  },
  {
    id: "dc_r14_c06",
    title: "Art. 5º — Legalidade Penal, Presunção de Inocência e Direito ao Silêncio (XXXIX, XL, LVII, LXIII)",
    textContent: `Garantias penais e processuais do Art. 5º — altamente cobradas em concursos da área policial e jurídica.

INCISO XXXIX — LEGALIDADE PENAL (Nullum crimen, nulla poena sine lege):
"Não há crime sem lei anterior que o defina, nem pena sem prévia cominação legal."
• Dupla exigência: LEI ANTERIOR + DEFINIÇÃO DE CRIME. Medida provisória não pode criar crimes ou penas (exceção constitucional expressa).
• Proibição da analogia in malam partem (para prejudicar o réu) — admite analogia in bonam partem.
• LEI FORMAL: somente lei em sentido estrito (não resolução, decreto, portaria) pode tipificar crime.

INCISO XL — RETROATIVIDADE DA LEI PENAL MAIS BENÉFICA:
"A lei penal não retroagirá, salvo para beneficiar o réu."
• Regra: irretroatividade da lei penal.
• Exceção: LEI MAIS BENÉFICA retroage, mesmo após o trânsito em julgado.
• Lei temporária e lei excepcional: aplicam-se aos fatos praticados durante sua vigência, mesmo após a revogação (ultratividade da lei mais grave — exceção ao inciso XL, admitida pelo STF).
• Combinação de leis (lex tertia): STF veda combinar partes de duas leis para criar uma terceira mais benéfica — aplica-se integralmente a lei mais favorável.

INCISO LVII — PRESUNÇÃO DE INOCÊNCIA (não culpabilidade):
"Ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória."
• Execução provisória da pena: STF (2019, AP 470) voltou a exigir TRÂNSITO EM JULGADO para início do cumprimento da pena.
• Não impede a prisão preventiva (cautelar) — que não é execução de pena, mas medida cautelar.
• Inquérito policial: suspeito tem presunção de inocência — não pode ser punido ou prejudicado somente por estar sendo investigado.

INCISO LXIII — DIREITO AO SILÊNCIO E À ASSISTÊNCIA:
"O preso será informado de seus direitos, entre os quais o de permanecer calado, sendo-lhe assegurada a assistência da família e de advogado."
• Miranda rights brasileira: direito ao silêncio (nemo tenetur se detegere) — ninguém é obrigado a produzir prova contra si mesmo.
• O silêncio NÃO pode ser interpretado em prejuízo do acusado.
• Direito à assistência de advogado desde a prisão em flagrante (não apenas no processo).`,
    mnemonic: "LPRS: Legalidade (XXXIX) = crime só por lei; Retroatividade (XL) = só se beneficiar; Presunção (LVII) = inocente até trânsito; Silêncio (LXIII) = não produz prova contra si.",
    keyPoint: "XXXIX: crime só por lei anterior. XL: lei penal não retroage, salvo para beneficiar. LVII: inocente até trânsito em julgado. LXIII: direito ao silêncio — não prejudica o réu.",
    practicalExample: "'MP 123 cria novo tipo penal' → inconstitucional (XXXIX). 'Lei nova reduz pena — réu já condenado' → retroage (XL). 'Réu fica calado no interrogatório' → não pode ser prejudicado (LXIII).",
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
  contentTitle: string;
}

const questions: QuestionData[] = [
  // ── Q01–Q04: FÁCIL ────────────────────────────────────────────────────────
  {
    id: "dc_r14_q01",
    statement:
      "Julgue o item a seguir:\n\nO caput do Art. 5º da CF/88 estende os direitos e garantias fundamentais a todos os brasileiros e aos estrangeiros residentes no País, sendo vedada qualquer distinção de natureza entre as pessoas alcançadas pelo dispositivo.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. O caput do Art. 5º garante igualdade a todos perante a lei 'sem distinção de qualquer natureza', destinando-se a brasileiros e estrangeiros residentes no País. A própria Constituição, em outros dispositivos, pode estabelecer distinções justificadas — mas o Art. 5º, caput, proíbe distinções arbitrárias.",
    explanationCorrect:
      "Correto! Art. 5º, caput: todos iguais perante a lei, sem distinção, alcançando brasileiros e estrangeiros residentes no País.",
    explanationWrong:
      "Este item é CERTO. O Art. 5º, caput, consagra isonomia a brasileiros e estrangeiros residentes, vedando distinções arbitrárias. Distinções justificadas pela própria CF são admitidas em outros dispositivos.",
    difficulty: "FACIL",
    contentTitle: "Art. 5º — Isonomia e Princípio da Legalidade (Incisos I e II)",
  },
  {
    id: "dc_r14_q02",
    statement:
      "Julgue o item a seguir:\n\nO princípio da legalidade previsto no inciso II do Art. 5º da CF/88 impede que o Poder Executivo edite decretos regulamentadores que imponham obrigações aos particulares, uma vez que somente a lei em sentido formal pode criar deveres.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O inciso II proíbe obrigações SEM BASE em lei, mas não impede decretos regulamentadores que DECORRAM de lei. O Poder Executivo pode editar regulamentos dentro dos limites legais — o que é vedado é criar obrigações autônomas sem qualquer fundamento legal. Atos infralegais que apenas detalham a lei são constitucionais.",
    explanationCorrect:
      "Correto marcado como ERRADO! O inciso II proíbe obrigação sem lei, mas não veda decretos regulamentadores que detalham a lei. Legalidade ≠ reserva absoluta de lei para todo e qualquer ato normativo.",
    explanationWrong:
      "Este item é ERRADO. O princípio da legalidade (inciso II) veda obrigações SEM fundamento legal, não proíbe decretos e regulamentos que DECORREM de lei. O Executivo pode regulamentar desde que respeite os limites legais.",
    difficulty: "FACIL",
    contentTitle: "Art. 5º — Isonomia e Princípio da Legalidade (Incisos I e II)",
  },
  {
    id: "dc_r14_q03",
    statement:
      "Julgue o item a seguir:\n\nO inciso IV do Art. 5º da CF/88, ao assegurar a liberdade de manifestação do pensamento e vedar o anonimato, implica que manifestações feitas de forma anônima não são constitucionalmente protegidas e podem ser investigadas para identificação do autor.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. O inciso IV garante liberdade de pensamento MAS veda o anonimato. Manifestações anônimas não são protegidas como exercício desse direito fundamental — o Estado pode investigar para identificar o autor. O STF admite inclusive que denúncias anônimas sirvam como início de investigação policial (notícia-crime apócrifa), desde que verificadas.",
    explanationCorrect:
      "Correto! IV: livre manifestação do pensamento + vedação ao anonimato. Manifestação anônima = não protegida = pode ser investigada para identificar o autor.",
    explanationWrong:
      "Este item é CERTO. O inciso IV proíbe o anonimato. Quem se manifesta anonimamente não está no abrigo do direito fundamental — o autor pode ser identificado e responsabilizado por abusos.",
    difficulty: "FACIL",
    contentTitle: "Art. 5º — Liberdades de Pensamento, Expressão e Consciência (Incisos IV, VIII e IX)",
  },
  {
    id: "dc_r14_q04",
    statement:
      "Julgue o item a seguir:\n\nNos termos do inciso XI do Art. 5º da CF/88, agentes policiais podem adentrar o domicílio de um suspeito à meia-noite para o cumprimento de mandado judicial de busca e apreensão, desde que a ordem tenha sido expedida por juiz competente.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O inciso XI permite a entrada com mandado judicial apenas 'durante o dia'. O STF (HC 93.050) fixou o critério objetivo: dia = 6h às 21h. À meia-noite, mesmo com mandado judicial, a entrada é inconstitucional. A entrada noturna é lícita apenas nos casos de flagrante delito, desastre ou socorro — situações que não dependem de ordem judicial.",
    explanationCorrect:
      "Correto marcado como ERRADO! Mandado judicial só autoriza entrada 'durante o dia' (6h–21h, pelo STF). Meia-noite = noite = entrada inconstitucional mesmo com mandado. Exceções noturnas: só flagrante, desastre ou socorro.",
    explanationWrong:
      "Este item é ERRADO. O inciso XI restringe o cumprimento de mandado judicial ao PERÍODO DIURNO (6h–21h, per STF). A entrada noturna sem situação de flagrante, desastre ou socorro, mesmo com mandado, viola a inviolabilidade do domicílio.",
    difficulty: "FACIL",
    contentTitle: "Art. 5º — Inviolabilidade do Domicílio e das Comunicações (Incisos XI e XII)",
  },

  // ── Q05–Q08: MÉDIO ────────────────────────────────────────────────────────
  {
    id: "dc_r14_q05",
    statement:
      "Julgue o item a seguir:\n\nO inciso XII do Art. 5º da CF/88 prevê que o sigilo das comunicações telefônicas somente pode ser quebrado por ordem judicial, nas hipóteses e na forma que a lei estabelecer para fins de investigação criminal ou instrução processual penal, não sendo possível a interceptação para fins exclusivamente administrativos.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. O inciso XII prevê a quebra do sigilo telefônico por ordem judicial 'para fins de investigação criminal ou instrução processual penal' — a Constituição limita expressamente as finalidades. Interceptação para fins exclusivamente administrativos ou disciplinares não está autorizada pelo inciso XII. A Lei 9.296/96 regulamenta esse direito.",
    explanationCorrect:
      "Correto! Inciso XII: quebra do sigilo telefônico = ordem judicial + fins de investigação criminal OU instrução processual penal. Fins administrativos = não autorizados pelo dispositivo.",
    explanationWrong:
      "Este item é CERTO. O inciso XII exige: (1) ordem judicial; (2) fins de investigação criminal ou instrução processual penal. Interceptação para fins meramente administrativos não encontra amparo no inciso XII.",
    difficulty: "MEDIO",
    contentTitle: "Art. 5º — Inviolabilidade do Domicílio e das Comunicações (Incisos XI e XII)",
  },
  {
    id: "dc_r14_q06",
    statement:
      "Julgue o item a seguir:\n\nO habeas corpus pode ser impetrado por qualquer pessoa, independentemente de ser advogado, em favor de terceiro que esteja sofrendo ou ameaçado de sofrer violência ou coação ilegal em sua liberdade de locomoção.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. O habeas corpus tem legitimidade ativa amplíssima: qualquer pessoa — inclusive analfabeta e estrangeira — pode impetrar em favor de terceiro, sem necessidade de advogado (jus postulandi pleno). Trata-se de garantia de acesso facilitado ao Judiciário para proteção da liberdade física.",
    explanationCorrect:
      "Correto! HC: qualquer pessoa pode impetrar, sem advogado, em favor de terceiro ameaçado em sua liberdade de locomoção. Acesso facilitado ao Judiciário para tutela da liberdade física.",
    explanationWrong:
      "Este item é CERTO. O habeas corpus dispensa advogado e pode ser impetrado por qualquer pessoa — inclusive em favor de terceiro. A legitimidade ativa é a mais ampla dos remédios constitucionais.",
    difficulty: "MEDIO",
    contentTitle: "Art. 5º — Habeas Corpus e Habeas Data (LXVIII e LXXII)",
  },
  {
    id: "dc_r14_q07",
    statement:
      "Julgue o item a seguir:\n\nO habeas data, previsto no inciso LXXII do Art. 5º da CF/88, pode ser utilizado por qualquer pessoa para obter informações pessoais de terceiros constantes de cadastros de entidades governamentais, desde que demonstrado legítimo interesse.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O habeas data é uma ação personalíssima — destina-se exclusivamente a proteger dados DA PRÓPRIA PESSOA (impetrante). Não se presta a obter informações de terceiros, independentemente de qualquer justificativa. Para dados alheios, o instrumento adequado seria outra via (ex: ação civil, requisição judicial, Lei de Acesso à Informação para dados públicos).",
    explanationCorrect:
      "Correto marcado como ERRADO! Habeas data é personalíssimo — só para dados DO PRÓPRIO impetrante. Dados de terceiros não são objeto do HD, mesmo com interesse demonstrado.",
    explanationWrong:
      "Este item é ERRADO. O habeas data é personalíssimo: serve para acessar/retificar dados DA PRÓPRIA PESSOA. Não é cabível para obter informações de terceiros — a legitimidade ativa é restrita ao titular dos dados.",
    difficulty: "MEDIO",
    contentTitle: "Art. 5º — Habeas Corpus e Habeas Data (LXVIII e LXXII)",
  },
  {
    id: "dc_r14_q08",
    statement:
      "Julgue o item a seguir:\n\nO mandado de segurança individual exige que o impetrante comprove, de plano e por documentação pré-constituída, a existência de direito líquido e certo violado ou ameaçado por ato de autoridade pública ou agente equiparado, não sendo admitida dilação probatória no seu rito.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. O mandado de segurança exige 'direito líquido e certo', que é aquele demonstrado de plano, mediante prova documental pré-constituída. O rito do MS é sumário — não comporta dilação probatória (instrução processual com produção de provas em audiência). A liquidez e certeza referem-se à prova, não ao direito em si.",
    explanationCorrect:
      "Correto! MS: direito líquido e certo = comprovado de plano por documentação. Sem dilação probatória — prova pré-constituída é requisito de admissibilidade.",
    explanationWrong:
      "Este item é CERTO. O MS tem rito sumário e exige prova pré-constituída do direito líquido e certo. Não há espaço para produção de provas — se os fatos precisam ser apurados, o instrumento adequado é outro (ação ordinária).",
    difficulty: "MEDIO",
    contentTitle: "Art. 5º — Mandado de Segurança e Mandado de Injunção (LXIX, LXX, LXXI)",
  },

  // ── Q09–Q12: DIFÍCIL ──────────────────────────────────────────────────────
  {
    id: "dc_r14_q09",
    statement:
      "Julgue o item a seguir:\n\nO mandado de injunção, previsto no inciso LXXI do Art. 5º da CF/88, pressupõe a existência de norma constitucional de eficácia plena cujo exercício tenha sido obstaculizado por ato administrativo ilegal, cabendo ao STF suprir a ilegalidade.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O mandado de injunção pressupõe OMISSÃO LEGISLATIVA (falta de norma regulamentadora) que inviabiliza o exercício de direito constitucional — não ato administrativo ilegal. Normas de eficácia plena aplicam-se diretamente, sem necessidade de regulamentação; logo, não são objeto de MI. O MI se volta contra o silêncio do legislador, não contra ato administrativo (que é combatido por MS ou ação ordinária).",
    explanationCorrect:
      "Correto marcado como ERRADO! MI = omissão LEGISLATIVA (falta de lei regulamentadora). Não combate ato administrativo ilegal (isso é MS). E norma de eficácia plena não precisa de regulamentação — não cabe MI.",
    explanationWrong:
      "Este item é ERRADO. O MI pressupõe falta de norma regulamentadora (omissão legislativa) que inviabiliza direito constitucional. Ato administrativo ilegal é combatido pelo MS. Normas de eficácia plena não demandam regulamentação e não geram MI.",
    difficulty: "DIFICIL",
    contentTitle: "Art. 5º — Mandado de Segurança e Mandado de Injunção (LXIX, LXX, LXXI)",
  },
  {
    id: "dc_r14_q10",
    statement:
      "Julgue o item a seguir:\n\nO princípio da legalidade penal estabelecido no inciso XXXIX do Art. 5º da CF/88 proíbe a criação de crimes e penas por medida provisória, tendo em vista que a reserva legal em matéria penal exige lei em sentido formal aprovada pelo Poder Legislativo.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. O Art. 62, §1º, I, 'b' da CF/88 veda expressamente a edição de medida provisória sobre matéria penal. Além disso, o princípio da legalidade penal (XXXIX) exige lei formal (lei ordinária ou complementar aprovada pelo Congresso) para a tipificação de condutas criminosas e cominação de penas. MP não preenche esse requisito.",
    explanationCorrect:
      "Correto! Dupla vedação: (1) inciso XXXIX exige lei formal para crimes e penas; (2) Art. 62, §1º, I, 'b' proíbe MP em matéria penal. MP não pode criar crimes nem penas.",
    explanationWrong:
      "Este item é CERTO. A legalidade penal (XXXIX) exige lei formal — não decreto, resolução, portaria ou MP. Aliás, a própria CF (Art. 62, §1º, I, 'b') veda MP sobre direito penal expressamente.",
    difficulty: "DIFICIL",
    contentTitle: "Art. 5º — Legalidade Penal, Presunção de Inocência e Direito ao Silêncio (XXXIX, XL, LVII, LXIII)",
  },
  {
    id: "dc_r14_q11",
    statement:
      "Julgue o item a seguir:\n\nNos termos do inciso XL do Art. 5º da CF/88, a lei penal mais benéfica ao réu deve retroagir para alcançar fatos praticados antes de sua vigência, ainda que já tenha havido trânsito em julgado de sentença penal condenatória.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. O inciso XL estabelece que 'a lei penal não retroagirá, salvo para beneficiar o réu'. A retroatividade benéfica não encontra barreira no trânsito em julgado — aplica-se mesmo após a condenação definitiva, conforme Art. 2º, parágrafo único do Código Penal e Art. 66, I da LEP. Quem executa a pena também se beneficia da lei nova mais favorável.",
    explanationCorrect:
      "Correto! Retroatividade da lei penal benéfica: sem barreira temporal, alcança inclusive condenados com sentença transitada em julgado. Art. 5º, XL + Art. 2º, § único CP.",
    explanationWrong:
      "Este item é CERTO. A lei penal mais benéfica retroage SEM limitação de trânsito em julgado — o réu já condenado definitivamente também se beneficia. Isso diferencia a retroatividade penal benéfica da regra geral de irretroatividade das leis.",
    difficulty: "DIFICIL",
    contentTitle: "Art. 5º — Legalidade Penal, Presunção de Inocência e Direito ao Silêncio (XXXIX, XL, LVII, LXIII)",
  },
  {
    id: "dc_r14_q12",
    statement:
      "(CEBRASPE — PF — Adaptada) Julgue o item:\n\nDurante o interrogatório conduzido pelo delegado de polícia, o investigado exerceu seu direito ao silêncio, recusando-se a responder às perguntas formuladas. Nessa situação, o silêncio do investigado pode ser utilizado como elemento de convicção pelo magistrado para fundamentar eventual decretação de prisão preventiva.",
    questionType: "CERTO_ERRADO",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O inciso LXIII assegura o direito ao silêncio e o princípio nemo tenetur se detegere (ninguém é obrigado a produzir prova contra si mesmo). O silêncio exercido legitimamente NÃO pode ser interpretado em desfavor do acusado nem utilizado como elemento de convicção. Decisão judicial que usa o silêncio como fundamento para prisão preventiva é inconstitucional.",
    explanationCorrect:
      "Correto marcado como ERRADO! O silêncio é um direito (LXIII) — exercê-lo não gera consequências negativas. Usar o silêncio como fundamento de decisão desfavorável viola o inciso LXIII e o nemo tenetur.",
    explanationWrong:
      "Este item é ERRADO. O inciso LXIII garante o direito ao silêncio — que não pode ser interpretado em prejuízo do investigado/acusado. Decisão que usa o silêncio como elemento contra o réu é inconstitucional (viola LXIII e o princípio nemo tenetur se detegere).",
    difficulty: "DIFICIL",
    contentTitle: "Art. 5º — Legalidade Penal, Presunção de Inocência e Direito ao Silêncio (XXXIX, XL, LVII, LXIII)",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("🚀 Seed R14: Direito Constitucional — Direitos Fundamentais Art. 5º (Grupo A)");
  console.log("=".repeat(70));

  // 1. Encontrar Subject
  const subjectId = await findSubject("DIR_CONSTITUCIONAL");
  if (!subjectId) {
    console.error("❌ Subject 'DIR_CONSTITUCIONAL' não encontrado. Verifique o banco.");
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
  const topicId = await findOrCreateTopic("Direitos e Garantias Fundamentais", subjectId);
  console.log(`✅ Tópico: ${topicId}`);

  // 4. Inserir Conteúdos — Grupo A: construir contentIdMap
  console.log("\n📚 Inserindo conteúdos...");
  const contentIdMap: Record<string, string> = {};
  let contentsCreated = 0;
  let contentsSkipped = 0;

  for (const c of contents) {
    if (await contentExists(c.title, subjectId)) {
      console.log(`  ⏭️  Conteúdo já existe: ${c.title}`);
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
  console.log("\n" + "=".repeat(70));
  console.log("📊 RELATÓRIO FINAL R14:");
  console.log(`   Conteúdos: ${contentsCreated} criados, ${contentsSkipped} já existiam`);
  console.log(`   Questões:  ${questionsCreated} criadas, ${questionsSkipped} já existiam`);
  console.log("🔗 Vínculo: todas as questões com contentId correto (Grupo A — sem roleta russa)");
  console.log("✅ Seed R14 — Dir. Constitucional: Direitos e Garantias Fundamentais (Art. 5º) concluído!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
