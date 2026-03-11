/**
 * db/seed-dense-dco-art5b-r45.ts
 * DENSIFICAÇÃO — DIR_CONSTITUCIONAL Art. 5° Aprofundado
 *
 * Átomos-alvo (dc_a5b_*): 6 átomos, 2 questões existentes cada → +6 por átomo = 36 novas questões
 *
 * Execução: npx tsx db/seed-dense-dco-art5b-r45.ts
 */

import { db } from "../db/index";
import { sql } from "drizzle-orm";

// ──────────────────────────────────────────────────────────────────────────────
// QUESTÕES
// ──────────────────────────────────────────────────────────────────────────────

const questions = [

  // ── dc_a5b_c01: Inviolabilidade do Domicílio e das Comunicações ───────────

  {
    id: "dc_a5b_c01_q01",
    contentId: "dc_a5b_c01",
    statement:
      "Segundo a Constituição Federal, a casa é asilo inviolável do indivíduo. Assinale a alternativa que apresenta corretamente as hipóteses em que é admissível o ingresso sem consentimento do morador.",
    alternatives: [
      { letter: "A", text: "Somente em caso de flagrante delito, com autorização judicial prévia." },
      { letter: "B", text: "Em caso de flagrante delito, desastre, para prestar socorro, ou durante o dia por determinação judicial." },
      { letter: "C", text: "A qualquer hora do dia ou da noite, desde que haja mandado judicial." },
      { letter: "D", text: "Apenas durante o dia, mediante mandado judicial, independentemente de outras hipóteses." },
      { letter: "E", text: "Em caso de flagrante delito ou desastre, somente durante o dia." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, XI da CF prevê quatro hipóteses de ingresso sem consentimento: flagrante delito, desastre, prestação de socorro (a qualquer hora) e, durante o dia, por determinação judicial.",
    explanationCorrect:
      "O Art. 5°, XI admite ingresso sem consentimento em flagrante delito, desastre, para prestar socorro (a qualquer hora do dia ou da noite) ou, durante o dia, por determinação judicial.",
    explanationWrong:
      "As demais alternativas omitem hipóteses ou confundem a restrição temporal 'durante o dia', que se aplica apenas à determinação judicial, não ao flagrante, desastre ou socorro.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c01_q02",
    contentId: "dc_a5b_c01",
    statement:
      "A inviolabilidade das comunicações telefônicas, prevista no Art. 5°, XII da CF/88, admite interceptação quando:",
    alternatives: [
      { letter: "A", text: "Autorizada por autoridade policial, para fins de investigação criminal." },
      { letter: "B", text: "Determinada por ordem judicial, nas hipóteses e na forma que a lei estabelecer, para fins de investigação criminal ou instrução processual penal." },
      { letter: "C", text: "Requerida pelo Ministério Público, independentemente de ordem judicial." },
      { letter: "D", text: "Autorizada pelo Presidente da República em casos de segurança nacional." },
      { letter: "E", text: "Necessária para investigações de crimes hediondos, dispensando ordem judicial." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, XII admite interceptação telefônica somente por ordem judicial, nas hipóteses e na forma da lei, exclusivamente para investigação criminal ou instrução processual penal (Lei 9.296/96).",
    explanationCorrect:
      "A Constituição exige: (1) ordem judicial, (2) lei regulamentadora, (3) finalidade de investigação criminal ou instrução processual penal. Todos os três requisitos são cumulativos.",
    explanationWrong:
      "Autoridade policial, MP ou Presidente não podem autorizar interceptação por conta própria — a reserva de jurisdição é absoluta nesse caso.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c01_q03",
    contentId: "dc_a5b_c01",
    statement:
      "A regra da inviolabilidade domiciliar (Art. 5°, XI, CF) protege o conceito de 'casa'. Conforme entendimento do STF, o escritório profissional (advocacia, medicina, contabilidade):",
    alternatives: [
      { letter: "A", text: "Não é protegido pela inviolabilidade, pois é espaço público de trabalho." },
      { letter: "B", text: "É protegido como 'casa' desde que o profissional resida no mesmo local." },
      { letter: "C", text: "É protegido pelo conceito amplo de 'casa', exigindo mandado judicial para ingresso forçado durante o dia." },
      { letter: "D", text: "Pode ser acessado a qualquer hora por autoridade policial, sem mandado." },
      { letter: "E", text: "É protegido apenas durante a noite, sendo livre o acesso diurno." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O STF adota conceito extensivo de 'casa', abrangendo escritórios profissionais, quartos de hotel, consultórios — qualquer espaço privado onde alguém exerce atividade com expectativa de privacidade.",
    explanationCorrect:
      "O STF (RE 251.445 e HC 82.788) pacificou que o conceito constitucional de 'casa' abrange os espaços profissionais de uso privado, exigindo mandado judicial para ingresso forçado diurno.",
    explanationWrong:
      "O escritório não perde proteção por ser local de trabalho — a natureza profissional não torna o espaço público; o critério é a privacidade razoável esperada.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c01_q04",
    contentId: "dc_a5b_c01",
    statement:
      "Com relação à inviolabilidade das comunicações, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "Correspondência, comunicações telegráficas, dados e telefônicas são todas absolutamente invioláveis, sem exceção." },
      { letter: "B", text: "Apenas as comunicações telefônicas admitem quebra de sigilo, mediante ordem judicial." },
      { letter: "C", text: "O sigilo das comunicações de dados pode ser afastado por CPI, mediante deliberação da maioria absoluta." },
      { letter: "D", text: "A quebra do sigilo de correspondência é permitida em qualquer caso, desde que haja autorização do juiz." },
      { letter: "E", text: "Nenhuma forma de comunicação pode ser interceptada, nem mesmo com ordem judicial." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O STF entende que Comissões Parlamentares de Inquérito (CPIs) têm poderes investigatórios equiparados ao juiz e podem quebrar sigilo de dados (bancário, fiscal, telefônico), mas NÃO podem autorizar interceptação telefônica (escuta em tempo real).",
    explanationCorrect:
      "CPI pode quebrar sigilo de dados (histórico de chamadas, registros bancários) por maioria absoluta. Interceptação telefônica em tempo real, porém, exige ordem judicial exclusivamente.",
    explanationWrong:
      "As alternativas confundem 'quebra de sigilo' (acesso a registros passados) com 'interceptação' (captação em tempo real) — institutos distintos com regimes jurídicos diferentes.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c01_q05",
    contentId: "dc_a5b_c01",
    statement:
      "Em um flagrante de crime permanente (ex.: cárcere privado), a polícia pode ingressar na residência do suspeito:",
    alternatives: [
      { letter: "A", text: "Somente após obter mandado judicial, mesmo diante de crime permanente." },
      { letter: "B", text: "Apenas durante o dia, pois o ingresso noturno é vedado em qualquer hipótese." },
      { letter: "C", text: "A qualquer hora do dia ou da noite, pois a situação de flagrante afasta a restrição temporal." },
      { letter: "D", text: "Somente se houver autorização do Ministério Público." },
      { letter: "E", text: "Apenas se a vítima solicitar socorro por qualquer meio." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "A hipótese de flagrante delito não está sujeita à restrição 'durante o dia' — essa limitação temporal aplica-se exclusivamente à entrada por determinação judicial. Em flagrante (incluindo crime permanente), o ingresso pode ocorrer a qualquer hora.",
    explanationCorrect:
      "O Art. 5°, XI distingue: flagrante delito, desastre e socorro → sem restrição de horário. Determinação judicial → somente durante o dia. Crime permanente mantém o agente em flagrante enquanto durar a situação ilícita.",
    explanationWrong:
      "Aguardar mandado em situação de flagrante esvaziaria a proteção à vítima e é incompatível com a natureza urgente do flagrante delito.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c01_q06",
    contentId: "dc_a5b_c01",
    statement:
      "A inviolabilidade das comunicações telegráficas e de dados, prevista no Art. 5°, XII da CF, admite relativização:",
    alternatives: [
      { letter: "A", text: "Apenas para fins de investigação de crimes contra o Estado." },
      { letter: "B", text: "Somente em estado de sítio decretado pelo Congresso Nacional." },
      { letter: "C", text: "O dispositivo não prevê ressalva — telegráficas e dados são absolutamente invioláveis." },
      { letter: "D", text: "Sim, nas mesmas hipóteses que a comunicação telefônica, por interpretação extensiva do STF." },
      { letter: "E", text: "Telegráficas e dados não possuem proteção constitucional expressa, apenas legal." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "O STF, por interpretação sistemática, entende que o sigilo de dados e comunicações telegráficas pode ser afastado por ordem judicial ou por CPI (quanto ao acesso a registros), da mesma forma que as comunicações telefônicas, sob pena de tratar desigualmente situações equivalentes.",
    explanationCorrect:
      "Embora a letra do Art. 5°, XII mencione ressalva expressa apenas para o telefônico, o STF estende a possibilidade de relativização a comunicações telegráficas e de dados, exigindo decisão fundamentada de autoridade competente.",
    explanationWrong:
      "A proteção constitucional abrange expressamente 'comunicação de dados' — elas não são desprotegidas, mas tampouco absolutas, podendo ser afastadas com a devida fundamentação.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── dc_a5b_c02: Liberdade de Expressão: Limites e Vedações ───────────────

  {
    id: "dc_a5b_c02_q01",
    contentId: "dc_a5b_c02",
    statement:
      "A Constituição Federal veda o anonimato (Art. 5°, IV). A principal razão para essa vedação é:",
    alternatives: [
      { letter: "A", text: "Proibir qualquer manifestação de pensamento sem identificação." },
      { letter: "B", text: "Permitir a responsabilização civil e penal do autor de manifestações que causem dano a terceiros." },
      { letter: "C", text: "Garantir que apenas manifestações políticas sejam protegidas pela liberdade de expressão." },
      { letter: "D", text: "Exigir cadastro prévio em órgão público para exercer o direito de expressão." },
      { letter: "E", text: "Restringir a liberdade de imprensa a veículos registrados no Ministério das Comunicações." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A vedação ao anonimato não proíbe o exercício da liberdade de expressão, mas garante a identificabilidade do autor para que, em caso de dano à honra, imagem ou privacidade de terceiros, seja possível a responsabilização (Art. 5°, V e X).",
    explanationCorrect:
      "O Art. 5°, IV, ao vedar o anonimato, assegura que a liberdade de expressão seja exercida de forma responsável: quem se manifesta deve poder ser identificado para responder civilmente (indenização) ou penalmente (crimes contra a honra).",
    explanationWrong:
      "A vedação ao anonimato não impede a manifestação — ela apenas exige identificabilidade para fins de responsabilização, compatível com os direitos de resposta proporcional (inciso V).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c02_q02",
    contentId: "dc_a5b_c02",
    statement:
      "Quanto à liberdade de expressão artística e intelectual (Art. 5°, IX, CF), é correto afirmar:",
    alternatives: [
      { letter: "A", text: "Está sujeita a censura prévia quando o conteúdo for considerado imoral pelas autoridades." },
      { letter: "B", text: "Independe de censura ou licença, mas não exclui a responsabilização posterior por eventuais abusos." },
      { letter: "C", text: "Pode ser restringida por decreto do Poder Executivo em casos de ordem pública." },
      { letter: "D", text: "Somente a atividade jornalística é protegida; a expressão artística está sujeita a regulação administrativa." },
      { letter: "E", text: "É absoluta, não admitindo qualquer forma de responsabilização posterior." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, IX veda censura prévia e exigência de licença para atividade intelectual, artística, científica e de comunicação. Contudo, o exercício abusivo pode gerar responsabilização civil (dano moral/material) ou penal posterior.",
    explanationCorrect:
      "A Constituição de 1988 aboliu a censura prévia como regra. A liberdade de expressão é exercida sem autorização prévia, mas o autor responde pelos excessos que causarem dano a direitos alheios.",
    explanationWrong:
      "A liberdade de expressão não é absoluta — ela cede quando colide com outros direitos fundamentais (honra, imagem, privacidade), gerando responsabilidade a posteriori, nunca censura prévia.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c02_q03",
    contentId: "dc_a5b_c02",
    statement:
      "O direito de resposta proporcional ao agravo (Art. 5°, V, CF) caracteriza-se por:",
    alternatives: [
      { letter: "A", text: "Ser exercido apenas em publicações impressas, não abrangendo meios digitais." },
      { letter: "B", text: "Ser cumulável com indenização por dano material e moral decorrente da ofensa." },
      { letter: "C", text: "Substituir integralmente a indenização por danos morais quando exercido." },
      { letter: "D", text: "Exigir que a resposta seja veiculada em meio diferente daquele em que ocorreu a ofensa." },
      { letter: "E", text: "Ser aplicável apenas quando a ofensa tiver sido praticada por meio de comunicação social." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, V assegura direito de resposta proporcional ao agravo, além da indenização por dano material, moral ou à imagem. O direito de resposta e a indenização são cumuláveis — um não exclui o outro.",
    explanationCorrect:
      "A Constituição garante duas consequências ao agravo: (1) direito de resposta proporcional ao dano causado e (2) indenização por dano material, moral ou à imagem. Ambas podem ser buscadas simultaneamente.",
    explanationWrong:
      "O direito de resposta não substitui a indenização — são remédios distintos com finalidades complementares: a resposta visa à reparação da reputação; a indenização, à compensação patrimonial.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c02_q04",
    contentId: "dc_a5b_c02",
    statement:
      "O Art. 5°, XIV da CF assegura a todos o acesso à informação, resguardado o sigilo da fonte quando necessário ao exercício profissional. Esse dispositivo protege principalmente:",
    alternatives: [
      { letter: "A", text: "O direito de qualquer cidadão a obter certidão de documentos públicos." },
      { letter: "B", text: "A identidade de fontes jornalísticas, impedindo que jornalistas sejam obrigados a revelá-las." },
      { letter: "C", text: "O acesso irrestrito a documentos sigilosos do Estado por qualquer profissional liberal." },
      { letter: "D", text: "O direito de advogados a consultar processos em sigilo de justiça sem autorização judicial." },
      { letter: "E", text: "O sigilo profissional médico, impedindo qualquer divulgação de informações de pacientes." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, XIV garante o acesso à informação e, especificamente, resguarda o sigilo da fonte 'quando necessário ao exercício profissional' — proteção clássica do jornalista que não pode ser compelido a revelar sua fonte informativa.",
    explanationCorrect:
      "A cláusula de sigilo da fonte protege o jornalismo investigativo: o profissional de imprensa não pode ser forçado, nem em inquérito policial nem em processo judicial, a revelar quem lhe forneceu informações.",
    explanationWrong:
      "As demais alternativas descrevem outras garantias (certidão — Art. 5°, XXXIV; sigilo médico — legislação infraconstitucional) que não correspondem ao núcleo do Art. 5°, XIV.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c02_q05",
    contentId: "dc_a5b_c02",
    statement:
      "A liberdade de manifestação do pensamento (Art. 5°, IV, CF) é vedada quando:",
    alternatives: [
      { letter: "A", text: "Contrária à política do governo vigente." },
      { letter: "B", text: "Exercida de forma anônima." },
      { letter: "C", text: "Religiosa e praticada em espaço público." },
      { letter: "D", text: "Crítica a agentes públicos no exercício da função." },
      { letter: "E", text: "Realizada sem prévia comunicação à autoridade policial." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, IV é expresso: 'é livre a manifestação do pensamento, sendo vedado o anonimato'. A única restrição prevista no próprio inciso é a vedação ao anonimato.",
    explanationCorrect:
      "A vedação ao anonimato é a única limitação textual prevista no Art. 5°, IV. Manifestações políticas contrárias ao governo, religiosas em espaço público e críticas a agentes públicos são protegidas pela liberdade de expressão.",
    explanationWrong:
      "Exigir comunicação prévia à polícia para manifestações, ou proibir críticas ao governo, configuraria censura prévia, incompatível com a Constituição de 1988.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c02_q06",
    contentId: "dc_a5b_c02",
    statement:
      "Sobre a liberdade de crença religiosa (Art. 5°, VI e VIII, CF), julgue: 'Ninguém será privado de direitos por motivo de crença religiosa ou convicção filosófica ou política, SALVO se as invocar para eximir-se de obrigação legal a todos imposta e recusar-se a cumprir prestação alternativa fixada em lei.'",
    alternatives: [
      { letter: "A", text: "A afirmação é falsa — a escusa de consciência é sempre aceita, sem qualquer prestação alternativa." },
      { letter: "B", text: "A afirmação é verdadeira e reproduz o conteúdo do Art. 5°, VIII da CF." },
      { letter: "C", text: "A afirmação é falsa — a lei não pode impor prestação alternativa, pois viola a liberdade religiosa." },
      { letter: "D", text: "A afirmação é verdadeira, mas a prestação alternativa só se aplica ao serviço militar obrigatório." },
      { letter: "E", text: "A afirmação é falsa — convicção filosófica não está protegida, apenas a religiosa." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O enunciado reproduz fielmente o Art. 5°, VIII da CF: a escusa de consciência (religiosa, filosófica ou política) é protegida, mas quem a invoca para descumprir obrigação legal deve cumprir prestação alternativa fixada em lei, sob pena de perda de direitos.",
    explanationCorrect:
      "O Art. 5°, VIII consagra a escusa de consciência com prestação alternativa: a liberdade de crença não autoriza descumprir obrigações legais universais sem oferecer contrapartida — caso do serviço militar alternativo (Art. 143, §1°).",
    explanationWrong:
      "A escusa não é incondicional — quem se recusa a prestar obrigação legal E recusa a alternativa perde direitos políticos (ficando com direitos civis preservados, mas inabilitado para concursos e outros atos que exijam quitação).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── dc_a5b_c03: Devido Processo Legal, Contraditório e Ampla Defesa ───────

  {
    id: "dc_a5b_c03_q01",
    contentId: "dc_a5b_c03",
    statement:
      "O princípio do devido processo legal (Art. 5°, LIV, CF) determina que ninguém será privado da liberdade ou de seus bens sem devido processo legal. Em sua dimensão substantiva (substantive due process), o devido processo legal:",
    alternatives: [
      { letter: "A", text: "Garante apenas o cumprimento das formalidades processuais previstas em lei." },
      { letter: "B", text: "Permite ao Judiciário controlar o conteúdo material das leis, vedando arbitrariedades legislativas." },
      { letter: "C", text: "É sinônimo de contraditório e ampla defesa, sem dimensão própria." },
      { letter: "D", text: "Aplica-se exclusivamente ao processo penal, não ao administrativo ou civil." },
      { letter: "E", text: "Exige que o processo seja concluído em prazo razoável, sem dilações desnecessárias." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O devido processo legal possui dimensão processual (adjetiva) — respeito às formalidades — e dimensão substantiva (material) — controle da razoabilidade e proporcionalidade do conteúdo das normas, impedindo leis arbitrárias.",
    explanationCorrect:
      "A dimensão substantiva do devido processo legal (incorporada pelo STF) autoriza o Judiciário a declarar inconstitucional lei que, embora formalmente perfeita, seja materialmente irrazoável ou desproporcional.",
    explanationWrong:
      "A razoável duração do processo está no Art. 5°, LXXVIII (EC 45/2004), não no LIV. O devido processo legal no LIV tem dimensão mais ampla, abrangendo o controle material das normas.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c03_q02",
    contentId: "dc_a5b_c03",
    statement:
      "O contraditório e a ampla defesa (Art. 5°, LV, CF) são assegurados 'aos litigantes em processo judicial ou administrativo, e aos acusados em geral, com os meios e recursos a ela inerentes'. Sobre essa garantia, é correto afirmar:",
    alternatives: [
      { letter: "A", text: "Aplica-se apenas ao acusado no processo penal, não ao réu no processo civil." },
      { letter: "B", text: "O contraditório exige que toda decisão judicial seja precedida de manifestação da parte contrária." },
      { letter: "C", text: "Aplica-se a processos judiciais e administrativos, mas não a procedimentos disciplinares militares." },
      { letter: "D", text: "A ampla defesa permite o uso de todos os meios de prova legalmente admitidos, incluindo provas ilícitas se favoráveis ao réu." },
      { letter: "E", text: "O contraditório é dispensável quando a decisão for favorável ao réu (julgamento antecipado positivo)." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O contraditório impõe o princípio da bilateralidade: nenhuma decisão pode ser proferida sem que a parte contrária tenha tido oportunidade de se manifestar. Toda decisão surpresa (sem prévia intimação) viola o Art. 5°, LV.",
    explanationCorrect:
      "O contraditório garante a ciência e a participação antes da decisão: toda alegação de uma parte deve ser comunicada à outra, que terá direito de resposta. Decisões-surpresa são vedadas mesmo quando tecnicamente acertadas.",
    explanationWrong:
      "Provas ilícitas não são admitidas pelo sistema constitucional (Art. 5°, LVI), mesmo quando favoráveis — salvo em casos extremos reconhecidos pelo STF (prova ilícita pro reo em situações excepcionais).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c03_q03",
    contentId: "dc_a5b_c03",
    statement:
      "A proibição de utilização de provas ilícitas no processo (Art. 5°, LVI, CF) é uma regra:",
    alternatives: [
      { letter: "A", text: "Absoluta, sem exceção, mesmo quando a prova ilícita for a única capaz de provar a inocência do réu." },
      { letter: "B", text: "Que admite como exceção apenas provas ilícitas produzidas pelo Estado." },
      { letter: "C", text: "Que o STF aplica com temperamentos: admite prova ilícita pro reo em situações excepcionais, sob a teoria da proporcionalidade." },
      { letter: "D", text: "Que proíbe apenas provas obtidas por meios físicos (violência), não por meios tecnológicos." },
      { letter: "E", text: "Que se aplica apenas no processo penal, sendo a prova ilícita admissível no processo civil." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Embora o Art. 5°, LVI seja enfático, o STF aplica a teoria da proporcionalidade para admitir, em situações extremas, prova ilícita favorável ao réu (pro reo), quando isso seja necessário para evitar condenação injusta de inocente.",
    explanationCorrect:
      "A proibição de provas ilícitas protege principalmente o Estado de se valer de provas obtidas ilicitamente. Quando a própria vítima ou o réu produz prova ilícita para se defender (legítima defesa probatória), o STF admite em casos excepcionais.",
    explanationWrong:
      "A regra não é absoluta na jurisprudência do STF, que reconhece a teoria da proporcionalidade. Isso não significa carta branca para provas ilícitas — a exceção é restrita e exige ponderação cuidadosa.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c03_q04",
    contentId: "dc_a5b_c03",
    statement:
      "O juiz natural (Art. 5°, LIII, CF — 'ninguém será processado nem sentenciado senão pela autoridade competente') e a vedação ao tribunal de exceção (Art. 5°, XXXVII, CF) são garantias correlatas. A vedação ao tribunal de exceção proíbe:",
    alternatives: [
      { letter: "A", text: "A criação de varas especializadas em matéria criminal após a prática do crime." },
      { letter: "B", text: "A criação de juízos ou tribunais criados especificamente para julgar determinado caso ou pessoa, após o fato." },
      { letter: "C", text: "O julgamento de civis pela Justiça Militar em qualquer hipótese." },
      { letter: "D", text: "O funcionamento de Tribunais Superiores (STJ, STF) como instâncias originárias." },
      { letter: "E", text: "A criação de câmaras especializadas nos tribunais de segunda instância." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Tribunal de exceção é aquele criado ad hoc para julgar caso específico ou pessoa determinada, após a ocorrência do fato. A CF proíbe sua criação — o julgamento deve ser feito pela autoridade competente previamente estabelecida por lei.",
    explanationCorrect:
      "A vedação ao tribunal de exceção garante a imparcialidade e a previsibilidade: o juízo competente deve ser predeterminado por lei geral e abstrata, não criado para um caso concreto. Varas especializadas pré-existentes são constitucionais.",
    explanationWrong:
      "Varas especializadas criadas antes do fato e câmaras especializadas em tribunais são válidas — o que a CF proíbe é a criação direcionada a caso ou pessoa específica após os fatos.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c03_q05",
    contentId: "dc_a5b_c03",
    statement:
      "A razoável duração do processo (Art. 5°, LXXVIII, CF) foi inserida pela Emenda Constitucional n.° 45/2004. Ela garante:",
    alternatives: [
      { letter: "A", text: "Que todo processo seja concluído em no máximo dois anos, sob pena de extinção." },
      { letter: "B", text: "A todos, no âmbito judicial e administrativo, a razoável duração do processo e os meios que garantam a celeridade de sua tramitação." },
      { letter: "C", text: "Apenas a razoável duração de processos penais, não alcançando os demais ramos." },
      { letter: "D", text: "O direito a indenização automática do Estado em caso de demora processual." },
      { letter: "E", text: "A prioridade absoluta de julgamento para réus presos sobre todas as demais causas." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, LXXVIII assegura, a todos, no âmbito judicial e administrativo, a razoável duração do processo e os meios que garantam a celeridade de sua tramitação. Aplica-se a todos os processos, não apenas penais.",
    explanationCorrect:
      "A EC 45/2004 inseriu a celeridade processual como direito fundamental. Ele abrange processos judiciais (cível, penal, trabalhista) e administrativos. Não há prazo fixo — 'razoável' é aferido caso a caso.",
    explanationWrong:
      "A Constituição não prevê indenização automática por demora (embora seja possível por responsabilidade civil do Estado), nem prazo máximo absoluto para encerramento dos processos.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c03_q06",
    contentId: "dc_a5b_c03",
    statement:
      "Sobre as proibições ligadas ao devido processo legal, a Constituição veda expressamente:",
    alternatives: [
      { letter: "A", text: "A prisão preventiva em qualquer hipótese." },
      { letter: "B", text: "A prisão civil por dívida, ressalvado o inadimplente voluntário e inescusável de obrigação alimentícia." },
      { letter: "C", text: "A prisão em flagrante delito pela autoridade policial." },
      { letter: "D", text: "A extradição de brasileiro nato, salvo naturalizado em crime comum praticado antes da naturalização." },
      { letter: "E", text: "A aplicação de pena de morte em qualquer hipótese, incluindo estado de guerra declarado." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, LXVII veda a prisão civil por dívida, com única exceção constitucional: o inadimplente voluntário e inescusável de obrigação alimentícia. A prisão do depositário infiel foi afastada pelo STF (Súmula Vinculante 25) após o Pacto de San José.",
    explanationCorrect:
      "A CF veda prisão civil por dívida. A exceção é a prisão do devedor de alimentos (obrigação alimentícia). O STF, desde 2009, não admite mais a prisão do depositário infiel, por força do Pacto de San José da Costa Rica.",
    explanationWrong:
      "A pena de morte é vedada em tempo de paz, mas PERMITIDA em caso de guerra declarada (Art. 5°, XLVII, 'a'). Brasileiro nato não pode ser extraditado em nenhuma hipótese (Art. 5°, LI).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── dc_a5b_c04: Remédios Constitucionais ─────────────────────────────────

  {
    id: "dc_a5b_c04_q01",
    contentId: "dc_a5b_c04",
    statement:
      "O Habeas Corpus (Art. 5°, LXVIII, CF) é cabível quando alguém sofrer ou se achar ameaçado de sofrer violência ou coação em sua liberdade de locomoção por ilegalidade ou abuso de poder. Sobre o HC, é correto afirmar:",
    alternatives: [
      { letter: "A", text: "Somente pode ser impetrado pelo próprio paciente, pessoalmente." },
      { letter: "B", text: "Não cabe contra ato de tribunal do júri, por ser soberano." },
      { letter: "C", text: "Pode ser impetrado por qualquer pessoa, em favor do paciente, independentemente de capacidade postulatória." },
      { letter: "D", text: "Somente é cabível após o início efetivo da prisão, não na modalidade preventiva." },
      { letter: "E", text: "Não cabe HC contra punição disciplinar militar." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O HC pode ser impetrado por qualquer pessoa — o impetrante não precisa ser advogado nem parente do paciente. Trata-se de ação popular constitucional que dispensa capacidade postulatória especial.",
    explanationCorrect:
      "O HC é uma ação de índole popular: qualquer do povo, mesmo sem advogado, pode impetrar HC em favor de quem estiver sofrendo ou na iminência de sofrer coação ilegal em sua liberdade de locomoção.",
    explanationWrong:
      "Existe o HC preventivo (salvo-conduto) para ameaça de prisão iminente. Quanto a punições disciplinares militares: cabe HC para verificar ilegalidade, ilegitimidade da sanção ou incompetência da autoridade, mas não para discutir o mérito.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c04_q02",
    contentId: "dc_a5b_c04",
    statement:
      "O Mandado de Segurança (Art. 5°, LXIX, CF) protege direito líquido e certo não amparado por HC ou HD contra ato ilegal ou abusivo de autoridade pública ou agente de pessoa jurídica no exercício de atribuições do Poder Público. 'Direito líquido e certo' significa:",
    alternatives: [
      { letter: "A", text: "Direito indiscutível, que não pode ser contestado pela autoridade coatora." },
      { letter: "B", text: "Direito que, no momento da impetração, pode ser comprovado de plano, por prova pré-constituída, sem necessidade de dilação probatória." },
      { letter: "C", text: "Direito declarado por sentença judicial transitada em julgado." },
      { letter: "D", text: "Direito de valor econômico certo e determinado." },
      { letter: "E", text: "Direito previsto expressamente em lei federal, sem margem de interpretação." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Direito líquido e certo é conceito processual — não significa direito indiscutível no mérito, mas direito demonstrável de plano pelos documentos que acompanham a inicial, sem necessidade de produção de provas em contraditório.",
    explanationCorrect:
      "No MS, não há fase instrutória ampla. O impetrante deve apresentar toda a prova documental junto com a petição inicial. Se os fatos são controversos e exigem dilação probatória, o MS é inadequado.",
    explanationWrong:
      "Direito líquido e certo não se confunde com direito pacífico ou incontestável — a autoridade pode contestar o mérito. O conceito refere-se à forma de demonstração dos fatos (por documentos pré-constituídos).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c04_q03",
    contentId: "dc_a5b_c04",
    statement:
      "O Mandado de Injunção (Art. 5°, LXXI, CF) é cabível sempre que a falta de norma regulamentadora torne inviável o exercício de direitos e liberdades constitucionais e prerrogativas inerentes à nacionalidade, à soberania e à cidadania. Quanto aos efeitos do MI, o STF adota:",
    alternatives: [
      { letter: "A", text: "A teoria concretista geral: a decisão produz norma com efeitos erga omnes, suprindo a omissão legislativa para todos." },
      { letter: "B", text: "A teoria não concretista: o STF apenas declara a omissão e comunica ao órgão competente para legislar, sem criar norma." },
      { letter: "C", text: "A teoria concretista individual: a decisão regula o caso concreto do impetrante, sem criar norma geral." },
      { letter: "D", text: "Desde 2016 (Lei 13.300), o STF adota exclusivamente a teoria concretista geral para todos os casos." },
      { letter: "E", text: "A teoria não concretista intermediária: declara a omissão e fixa prazo para o legislador agir, após o que o STF legisla." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "O STF, após evolução jurisprudencial, adotou a teoria concretista geral para o MI: a decisão supre a omissão com efeitos erga omnes até que o legislador edite a norma. A Lei 13.300/2016 positivou esse entendimento.",
    explanationCorrect:
      "O STF superou a teoria não concretista (que só declarava omissão) e passou a adotar a concretista geral: o MI produz norma provisória com efeito para todos (erga omnes), aplicável até regulamentação legislativa. A Lei 13.300/2016 confirmou essa posição.",
    explanationWrong:
      "A teoria não concretista (alternativa B) era a posição inicial do STF, abandonada por ser ineficaz. A concretista individual (C) produz efeitos só para o impetrante — o STF foi além, adotando efeitos gerais.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c04_q04",
    contentId: "dc_a5b_c04",
    statement:
      "O Habeas Data (Art. 5°, LXXII, CF) assegura ao interessado o acesso a informações relativas a sua pessoa constantes de registros ou bancos de dados de entidades governamentais ou de caráter público. Diferencia-se do MS porque:",
    alternatives: [
      { letter: "A", text: "O HD protege liberdade de locomoção; o MS protege qualquer direito líquido e certo." },
      { letter: "B", text: "O HD é personalíssimo (só o titular pode impetrar) e visa especificamente ao acesso/retificação de dados pessoais." },
      { letter: "C", text: "O HD tem prazo decadencial de 120 dias; o MS não tem prazo." },
      { letter: "D", text: "O HD dispensa prévio requerimento administrativo; o MS exige esgotamento da via administrativa." },
      { letter: "E", text: "O HD pode ser impetrado contra atos de particulares; o MS somente contra autoridade pública." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O HD é ação personalíssima: só o titular dos dados (ou seu representante legal) pode impetrar. Sua finalidade específica é o acesso, retificação ou anotação nos dados pessoais registrados. O MS é mais amplo e pode ser impetrado por qualquer pessoa com interesse.",
    explanationCorrect:
      "O HD protege o direito à autodeterminação informativa: o titular conhece e pode corrigir seus próprios dados. É personalíssimo porque os dados pertencem exclusivamente ao interessado; terceiros não podem invocá-lo.",
    explanationWrong:
      "O HD exige prévio requerimento administrativo (necessidade de demonstrar a recusa ou omissão do detentor dos dados). O MS tem prazo decadencial de 120 dias (não o HD).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c04_q05",
    contentId: "dc_a5b_c04",
    statement:
      "A Ação Popular (Art. 5°, LXXIII, CF) pode ser proposta por qualquer cidadão para anular ato lesivo ao patrimônio público, à moralidade administrativa, ao meio ambiente e ao patrimônio histórico e cultural. 'Cidadão', para fins de AP, é:",
    alternatives: [
      { letter: "A", text: "Qualquer pessoa humana, nacional ou estrangeira, residente no Brasil." },
      { letter: "B", text: "Brasileiro nato ou naturalizado no pleno exercício dos direitos políticos (eleitor)." },
      { letter: "C", text: "Qualquer pessoa jurídica com sede no Brasil." },
      { letter: "D", text: "Apenas pessoas com mais de 21 anos e plena capacidade civil." },
      { letter: "E", text: "Qualquer pessoa maior de 18 anos, independentemente de ser eleitor." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Para a AP, cidadão é o brasileiro (nato ou naturalizado) no pleno gozo dos direitos políticos, comprovado pelo título de eleitor. Estrangeiros, apátridas e brasileiros com direitos políticos suspensos ou cassados não têm legitimidade.",
    explanationCorrect:
      "A prova da cidadania na AP é feita com o título de eleitor. Menores de 16 anos não podem votar e, portanto, não são cidadãos para fins de AP. Também não podem propô-la quem teve direitos políticos suspensos (por condenação criminal transitada em julgado, por exemplo).",
    explanationWrong:
      "Estrangeiros não são 'cidadãos' no sentido constitucional da AP, ainda que residam no Brasil e contribuam para os serviços públicos. Pessoas jurídicas também não têm legitimidade para a AP.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c04_q06",
    contentId: "dc_a5b_c04",
    statement:
      "Sobre o Mandado de Segurança Coletivo (Art. 5°, LXX, CF), é correto afirmar que pode ser impetrado por:",
    alternatives: [
      { letter: "A", text: "Qualquer cidadão em defesa de interesses difusos da coletividade." },
      { letter: "B", text: "Partido político com representação no Congresso Nacional, ou organização sindical, entidade de classe ou associação legalmente constituída e em funcionamento há pelo menos um ano." },
      { letter: "C", text: "Apenas pelo Ministério Público, como substituto processual da coletividade." },
      { letter: "D", text: "Qualquer entidade civil, independentemente de tempo de funcionamento, em defesa de seus membros." },
      { letter: "E", text: "Partido político com representação no Congresso, independentemente de seu programa ou estatuto." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, LXX prevê dois legitimados para o MSC: (1) partido político com representação no Congresso Nacional; (2) organização sindical, entidade de classe ou associação legalmente constituída e em funcionamento há pelo menos um ano.",
    explanationCorrect:
      "O MSC exige o requisito da pré-constituição de um ano apenas para associações/entidades de classe — não para partidos políticos. O partido só precisa ter representação no Congresso (ao menos um parlamentar eleito).",
    explanationWrong:
      "Cidadãos individualmente não têm legitimidade para o MSC — para isso existe a Ação Popular. O MP não é legitimado para o MSC, embora possa impetrar MS individual. Associações recém-criadas (menos de 1 ano) também não têm legitimidade.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── dc_a5b_c05: Princípio da Não Culpabilidade e Garantias Processuais ───

  {
    id: "dc_a5b_c05_q01",
    contentId: "dc_a5b_c05",
    statement:
      "O princípio da presunção de inocência (Art. 5°, LVII, CF) estabelece que 'ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória'. Quanto à execução provisória da pena antes do trânsito em julgado, o STF:",
    alternatives: [
      { letter: "A", text: "Nunca admite a prisão antes do trânsito em julgado, em respeito à presunção de inocência." },
      { letter: "B", text: "Admite a execução da pena após condenação em 2° grau, independentemente do trânsito em julgado." },
      { letter: "C", text: "Admite a prisão preventiva (cautelar), mas não permite execução antecipada da pena condenatória antes do trânsito em julgado." },
      { letter: "D", text: "Admite execução da pena após condenação em 1° grau, se os recursos tiverem apenas efeito devolutivo." },
      { letter: "E", text: "A questão foi definitivamente resolvida pelo STF em 2019, que tornou a execução provisória obrigatória após segunda instância." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O STF, após intenso debate (ADCs 43, 44 e 54, julgadas em 2019), fixou que a execução penal só pode iniciar após o trânsito em julgado. Prisões cautelares (preventiva, temporária) são cabíveis, mas não configuram execução da pena.",
    explanationCorrect:
      "Em 2019, o STF (ADC 43/44/54) retornou à interpretação estrita do Art. 5°, LVII: ninguém pode ser preso para cumprir pena antes do trânsito em julgado. Isso não impede prisões cautelares, que têm fundamento autônomo (Art. 5°, LXI).",
    explanationWrong:
      "A execução provisória após 2° grau foi admitida pelo STF de 2016 a 2019. Em 2019, o Plenário reverteu esse entendimento, reafirmando que a presunção de inocência exige trânsito em julgado para início da execução penal.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c05_q02",
    contentId: "dc_a5b_c05",
    statement:
      "O direito ao silêncio (Art. 5°, LXIII, CF) assegura ao preso o direito de permanecer calado. Sobre esse direito:",
    alternatives: [
      { letter: "A", text: "Aplica-se apenas ao preso em flagrante, não ao investigado em liberdade." },
      { letter: "B", text: "O silêncio pode ser interpretado em desfavor do réu pelo juiz, como indício de culpabilidade." },
      { letter: "C", text: "Aplica-se ao preso e ao acusado em geral; o silêncio não pode ser utilizado em prejuízo do réu." },
      { letter: "D", text: "Pode ser afastado em crimes hediondos, obrigando o investigado a responder perguntas." },
      { letter: "E", text: "O STF entende que o silêncio implica confissão ficta no processo penal." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O direito ao silêncio (nemo tenetur se detegere) abrange o preso e o investigado/acusado em geral. Nenhuma consequência negativa pode ser extraída do silêncio — ele não equivale a confissão nem pode ser usado como indício de culpa.",
    explanationCorrect:
      "O STF e o STJ são pacíficos: o silêncio é direito constitucional irrenunciável. Qualquer interpretação do silêncio como prova contra o réu viola o Art. 5°, LXIII. Isso inclui depoimentos policiais, CPI e interrogatórios judiciais.",
    explanationWrong:
      "Confissão ficta existe no processo civil — no processo penal, o silêncio jamais gera essa consequência. O direito ao silêncio é absoluto quanto à proteção de não ter o silêncio usado contra si.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c05_q03",
    contentId: "dc_a5b_c05",
    statement:
      "A identificação criminal do civilmente identificado somente se admitirá nas hipóteses previstas em lei (Art. 5°, LVIII, CF). Isso significa que:",
    alternatives: [
      { letter: "A", text: "Qualquer pessoa com RG não pode ser submetida à identificação criminal (impressões digitais e fotografia) em nenhuma hipótese." },
      { letter: "B", text: "A lei pode estabelecer hipóteses em que, mesmo com identificação civil, seja obrigatória a identificação criminal." },
      { letter: "C", text: "A regra é absoluta — identificado civilmente, jamais haverá identificação criminal." },
      { letter: "D", text: "A identificação criminal só ocorre para crimes hediondos, independentemente de identificação civil." },
      { letter: "E", text: "O STF proibiu a criação de banco de dados de DNA de condenados, por violação a esse princípio." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, LVIII estabelece a regra (identificado civilmente → sem identificação criminal) e admite exceções legais. A Lei 12.037/2009 prevê hipóteses em que a identificação criminal é cabível mesmo para quem tem documento civil (ex.: dúvida sobre a identidade).",
    explanationCorrect:
      "A regra é a dispensa da identificação criminal para quem tem identificação civil. Mas a própria CF ressalva 'nas hipóteses previstas em lei' — a Lei 12.037/2009 regulamenta isso, permitindo identificação criminal em casos de documento falso, dubiedade, necessidade de investigação etc.",
    explanationWrong:
      "A regra não é absoluta — a própria CF remete à lei para estabelecer exceções. O STF autorizou, inclusive, a coleta de perfil genético (DNA) de condenados por crimes violentos ou hediondos, inserida no Código Penal.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c05_q04",
    contentId: "dc_a5b_c05",
    statement:
      "Segundo o Art. 5°, LX da CF, a lei só poderá restringir a publicidade dos atos processuais quando a defesa da intimidade ou o interesse social o exigirem. Sobre o princípio da publicidade dos atos processuais:",
    alternatives: [
      { letter: "A", text: "Todo processo é público — o sigilo é sempre inconstitucional." },
      { letter: "B", text: "O sigilo pode ser decretado pelo juiz sempre que uma das partes solicitar." },
      { letter: "C", text: "A publicidade é a regra; o sigilo é exceção e exige lei autorizando sua decretação para proteger intimidade ou interesse social." },
      { letter: "D", text: "Em processo penal, o sigilo nunca é admitido — o princípio acusatório exige publicidade absoluta." },
      { letter: "E", text: "A publicidade dos atos processuais aplica-se apenas às audiências, não aos documentos do processo." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "A publicidade é princípio constitucional dos atos processuais, mas admite restrição legal quando há interesse em proteger a intimidade das partes (casos familiares, menores, vítimas de crimes sexuais) ou interesse público relevante.",
    explanationCorrect:
      "O Art. 5°, LX combina publicidade (regra) com possibilidade de restrição por lei quando necessário. Exemplos: processos com segredo de justiça (divórcio, guarda de filhos), inquéritos sigilosos, processos de réus adolescentes.",
    explanationWrong:
      "Processo em segredo de justiça é plenamente constitucional quando autorizado por lei com fundamento na proteção à intimidade ou ao interesse social. O segredo não viola o contraditório — as partes têm acesso; o público externo é que é excluído.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c05_q05",
    contentId: "dc_a5b_c05",
    statement:
      "O Art. 5°, LVII da CF dispõe: 'ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória.' Esse dispositivo aplica-se:",
    alternatives: [
      { letter: "A", text: "Apenas ao processo penal — no processo civil e administrativo não há presunção de inocência." },
      { letter: "B", text: "A qualquer processo punitivo (penal, administrativo disciplinar), como expressão do devido processo legal." },
      { letter: "C", text: "Apenas ao réu preso, não ao réu solto respondendo em liberdade." },
      { letter: "D", text: "Não se aplica quando há confissão do acusado, pois nesse caso a culpabilidade está demonstrada." },
      { letter: "E", text: "Apenas nos crimes dolosos, pois nos culposos o dolo não precisa ser provado." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O STF estende o princípio da não culpabilidade a qualquer processo punitivo, incluindo o administrativo disciplinar. Servidores públicos não podem ser considerados culpados antes de decisão final no PAD.",
    explanationCorrect:
      "A presunção de inocência é manifestação do due process of law e se aplica a todo processo em que se discute culpabilidade ou sanção. A CF menciona 'sentença penal' mas o princípio é expansivo por força do devido processo legal (Art. 5°, LIV).",
    explanationWrong:
      "A confissão não dispensa o processo nem torna a presunção de inocência inoperante — o juiz continua obrigado a fundamentar a condenação, e o confessado tem direito ao processo completo com possibilidade de retratação.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c05_q06",
    contentId: "dc_a5b_c05",
    statement:
      "Sobre a plenitude de defesa no Tribunal do Júri (Art. 5°, XXXVIII, 'a') em comparação com a ampla defesa (Art. 5°, LV), é correto afirmar:",
    alternatives: [
      { letter: "A", text: "São expressões sinônimas, com o mesmo conteúdo e alcance." },
      { letter: "B", text: "A plenitude de defesa é mais abrangente que a ampla defesa, permitindo ao advogado usar argumentos extrajurídicos (morais, sociais, emocionais) para convencer os jurados." },
      { letter: "C", text: "A ampla defesa é mais ampla — a plenitude de defesa se restringe ao processo penal." },
      { letter: "D", text: "A plenitude de defesa permite dispensar a presença de advogado no Júri, se o réu assim preferir." },
      { letter: "E", text: "Ambas permitem que o réu se defenda sem advogado, bastando sua autodefesa." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A plenitude de defesa (Júri) é mais ampla que a ampla defesa (demais processos). No Júri, o defensor pode usar argumentos extrajurídicos — apelos à misericórdia, ao contexto social, à emoção — pois os jurados decidem com íntima convicção, sem fundamentar.",
    explanationCorrect:
      "No Tribunal do Júri, a defesa 'plena' significa que o advogado pode ir além da argumentação técnico-jurídica, apelando a valores morais, sociais e sentimentais dos jurados. Isso diferencia o Júri dos demais processos, onde o juiz deve decidir com base em provas e direito.",
    explanationWrong:
      "Nem o Júri permite defesa sem advogado: a autodefesa existe como complemento, mas a defesa técnica é obrigatória. Réu sem advogado no Júri tem o julgamento nulificado.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── dc_a5b_c06: Direito à Propriedade, Função Social e Desapropriação ────

  {
    id: "dc_a5b_c06_q01",
    contentId: "dc_a5b_c06",
    statement:
      "A função social da propriedade (Art. 5°, XXIII, CF) é condição para que a propriedade seja plenamente protegida. Segundo a Constituição, a propriedade urbana cumpre sua função social quando:",
    alternatives: [
      { letter: "A", text: "O proprietário pagar regularmente o IPTU incidente sobre o imóvel." },
      { letter: "B", text: "Atender às exigências fundamentais de ordenação da cidade expressas no plano diretor." },
      { letter: "C", text: "O imóvel estiver alugado ou em uso pelo proprietário, gerando renda." },
      { letter: "D", text: "Não estiver sujeito a qualquer ônus real ou hipoteca." },
      { letter: "E", text: "Estiver registrado no Cartório de Registro de Imóveis e quitado de débitos fiscais." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 182, §2°, CF define que a propriedade urbana cumpre função social quando atende às exigências fundamentais de ordenação da cidade expressas no plano diretor. O Art. 5°, XXIII é a regra geral; o Art. 182 é sua aplicação urbana.",
    explanationCorrect:
      "O plano diretor é o instrumento básico da política urbana (obrigatório para cidades com mais de 20 mil habitantes). O descumprimento da função social permite ao Município impor parcelamento, edificação compulsória, IPTU progressivo e, por fim, desapropriação.",
    explanationWrong:
      "O simples pagamento de IPTU ou a existência de registro imobiliário não garante que a propriedade cumpra função social — um terreno especulativo vazio, mesmo com impostos em dia, pode violar o Art. 182.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c06_q02",
    contentId: "dc_a5b_c06",
    statement:
      "A desapropriação por necessidade ou utilidade pública ou por interesse social, mediante justa e prévia indenização em dinheiro (Art. 5°, XXIV, CF), admite exceções ao pagamento prévio em dinheiro. São elas:",
    alternatives: [
      { letter: "A", text: "A desapropriação para reforma agrária e a sanção ao imóvel urbano que descumpre função social — ambas pagam em títulos." },
      { letter: "B", text: "A desapropriação por utilidade pública paga com títulos da dívida pública; a reforma agrária paga em dinheiro." },
      { letter: "C", text: "Toda desapropriação pode ser paga em títulos, cabendo ao expropriante escolher a forma." },
      { letter: "D", text: "Apenas a reforma agrária paga com títulos; não há outra exceção constitucional." },
      { letter: "E", text: "Toda desapropriação é paga em dinheiro — não há exceção constitucional ao pagamento prévio." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "O Art. 5°, XXIV (regra geral) exige prévia e justa indenização em dinheiro. As exceções constitucionais são: (1) reforma agrária (Art. 184) — títulos da dívida agrária resgatáveis em até 20 anos; (2) imóvel urbano não edificado/subutilizado (Art. 182, §4°, III) — títulos da dívida pública resgatáveis em até 10 anos.",
    explanationCorrect:
      "Existem duas desapropriações-sanção: a agrária (Art. 184) e a urbana (Art. 182, §4°, III). Ambas pagam com títulos públicos (não em dinheiro) justamente como sanção pelo descumprimento da função social. A desapropriação comum (Art. 5°, XXIV) sempre paga em dinheiro prévio.",
    explanationWrong:
      "A desapropriação por utilidade pública (estrada, escola, hospital) sempre paga em dinheiro, prévia e justamente. As exceções são apenas para as desapropriações-sanção por descumprimento da função social.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c06_q03",
    contentId: "dc_a5b_c06",
    statement:
      "O direito de propriedade (Art. 5°, XXII, CF) é garantido a brasileiros e estrangeiros residentes no País. Com relação a imóveis rurais e estrangeiros, a Constituição:",
    alternatives: [
      { letter: "A", text: "Proíbe a aquisição de imóveis rurais por estrangeiros em qualquer hipótese." },
      { letter: "B", text: "Autoriza aquisição de imóveis rurais por estrangeiros sem restrição, como decorrência da isonomia." },
      { letter: "C", text: "Remete à lei a regulação da aquisição de propriedade rural por estrangeiro (Art. 190, CF), que pode estabelecer limitações." },
      { letter: "D", text: "Permite aquisição irrestrita por empresas estrangeiras, mas limita pessoas físicas estrangeiras." },
      { letter: "E", text: "Veda a aquisição por estrangeiros em faixa de fronteira, mas autoriza no interior do país." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O Art. 190 da CF delega à lei a regulação e limitação da aquisição de imóvel rural por pessoa física ou jurídica estrangeira. A Lei 5.709/1971 (com alterações) impõe limites de área e outras restrições para estrangeiros.",
    explanationCorrect:
      "O Art. 190 da CF permite que a lei estabeleça restrições à aquisição de propriedade rural por estrangeiros, especialmente em faixa de fronteira (Art. 20, §2°). A regulação é infraconstitucional — a CF apenas delega competência para tanto.",
    explanationWrong:
      "A vedação absoluta não existe — há limitações legais, não proibição total. A faixa de fronteira tem regime especial (180 km), mas imóveis rurais em outras regiões também estão sujeitos a restrições para estrangeiros.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c06_q04",
    contentId: "dc_a5b_c06",
    statement:
      "O direito de herança (Art. 5°, XXX, CF) é garantia constitucional. A herança de bens situados no Brasil a herdeiro ou cônjuge estrangeiro obedece:",
    alternatives: [
      { letter: "A", text: "À lei do país de domicílio do autor da herança, sem exceção." },
      { letter: "B", text: "Sempre à lei brasileira, independentemente da situação do herdeiro." },
      { letter: "C", text: "À lei mais favorável ao cônjuge ou aos filhos brasileiros (Art. 5°, XXXI, CF)." },
      { letter: "D", text: "À lei do país de origem do herdeiro estrangeiro, em respeito à soberania nacional do seu país." },
      { letter: "E", text: "À convenção internacional entre os países envolvidos, prevalecendo sobre a Constituição." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O Art. 5°, XXXI da CF consagra o princípio da lei mais favorável: a sucessão de bens de estrangeiros situados no Brasil será regulada pela lei brasileira em benefício do cônjuge ou dos filhos brasileiros, sempre que não lhes seja mais favorável a lei pessoal do de cujus.",
    explanationCorrect:
      "A CF protege o cônjuge e os filhos brasileiros em herança internacional: compara-se a lei brasileira com a lei pessoal do falecido e aplica-se a que for mais favorável aos herdeiros brasileiros. É norma protetiva de interesse nacional.",
    explanationWrong:
      "A aplicação da lei estrangeira não é automática — ela só prevalece se for mais favorável aos herdeiros brasileiros. Se a lei brasileira for mais vantajosa, ela prevalece.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c06_q05",
    contentId: "dc_a5b_c06",
    statement:
      "A pequena propriedade rural trabalhada pela família é protegida constitucionalmente de penhora para pagamento de dívidas (Art. 5°, XXVI, CF), desde que:",
    alternatives: [
      { letter: "A", text: "O proprietário comprove renda anual inferior ao salário mínimo." },
      { letter: "B", text: "Seja trabalhada pela família e não possua outro imóvel." },
      { letter: "C", text: "Seja imóvel urbano transformado em propriedade rural para fins de subsistência." },
      { letter: "D", text: "O proprietário seja maior de 60 anos e hipossuficiente." },
      { letter: "E", text: "A propriedade seja reconhecida pelo INCRA como assentamento familiar." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, XXVI protege a pequena propriedade rural da penhora por dívidas: a impenhorabilidade exige que a propriedade seja trabalhada pela família e que o proprietário não possua outro imóvel.",
    explanationCorrect:
      "Os dois requisitos são cumulativos: (1) ser pequena propriedade rural — critérios definidos em lei (até 4 módulos fiscais, em geral); (2) ser trabalhada pela família (labor familiar, não de terceiros); (3) não possuir outro imóvel. Três condições para a proteção.",
    explanationWrong:
      "Não há exigência de idade, renda específica ou reconhecimento pelo INCRA. O critério é funcional: a família que trabalha a terra e dela depende para subsistência não pode perder o imóvel por dívidas.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_a5b_c06_q06",
    contentId: "dc_a5b_c06",
    statement:
      "A requisição administrativa de propriedade particular (Art. 5°, XXV, CF) é cabível em caso de iminente perigo público. Diferencia-se da desapropriação porque:",
    alternatives: [
      { letter: "A", text: "A requisição é permanente; a desapropriação é temporária." },
      { letter: "B", text: "A requisição transfere a propriedade ao Estado; a desapropriação não." },
      { letter: "C", text: "Na requisição, a indenização é ulterior (se houver dano); na desapropriação, é prévia, justa e em dinheiro." },
      { letter: "D", text: "A requisição exige autorização judicial prévia; a desapropriação é ato administrativo." },
      { letter: "E", text: "A requisição só pode recair sobre bens móveis; a desapropriação, sobre imóveis." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "A requisição administrativa (Art. 5°, XXV) é medida de urgência: o Estado usa temporariamente o bem (não transfere a propriedade) e a indenização é posterior, caso haja dano. A desapropriação (Art. 5°, XXIV) transfere a propriedade e exige indenização prévia, justa e em dinheiro.",
    explanationCorrect:
      "Requisição = uso temporário, urgência, indenização ulterior por dano. Desapropriação = transferência definitiva da propriedade, indenização prévia e justa em dinheiro (regra). São institutos distintos quanto aos efeitos sobre o domínio e ao momento da indenização.",
    explanationWrong:
      "A requisição não transfere propriedade — é apenas o uso temporário do bem. Pode recair sobre bens móveis e imóveis. Não exige autorização judicial prévia — é ato administrativo de urgência.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n========================================================");
  console.log("  SEED R45 — DENSIFICAÇÃO DIR_CONSTITUCIONAL dc_a5b_*");
  console.log("========================================================\n");

  // Resolve subjectId e topicId a partir do primeiro átomo existente
  const refRows = (await db.execute(sql`
    SELECT "subjectId", "topicId" FROM "Content" WHERE id = 'dc_a5b_c01' LIMIT 1
  `)) as any[];

  if (!refRows.length) {
    console.error("❌ Átomo dc_a5b_c01 não encontrado. Execute seed-const-art5-r14.ts primeiro.");
    process.exit(1);
  }

  const subjectId = refRows[0].subjectId;
  const topicId   = refRows[0].topicId;
  console.log(`✅ subjectId: ${subjectId}`);
  console.log(`✅ topicId:   ${topicId}\n`);

  // Verifica existência de cada contentId
  const contentIds = [...new Set(questions.map((q) => q.contentId))];
  for (const cid of contentIds) {
    const rows = (await db.execute(sql`
      SELECT id FROM "Content" WHERE id = ${cid} LIMIT 1
    `)) as any[];
    if (!rows.length) {
      console.error(`❌ Content ${cid} não encontrado no banco. Abortando.`);
      process.exit(1);
    }
    console.log(`  ✅ Content ${cid} encontrado`);
  }

  console.log(`\n📝 Inserindo ${questions.length} questões...\n`);

  let inserted = 0;
  let skipped  = 0;

  for (const q of questions) {
    const contentRows = (await db.execute(sql`
      SELECT "subjectId", "topicId" FROM "Content" WHERE id = ${q.contentId} LIMIT 1
    `)) as any[];

    const qSubjectId = contentRows[0]?.subjectId ?? subjectId;
    const qTopicId   = contentRows[0]?.topicId   ?? topicId;

    const alternativesJson = JSON.stringify(q.alternatives);

    const result = (await db.execute(sql`
      INSERT INTO "Question" (
        id, statement, alternatives, "correctAnswer", "correctOption",
        explanation, "explanationCorrect", "explanationWrong",
        "contentId", "subjectId", "topicId",
        "isActive", difficulty, "timesUsed",
        "questionType", "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternativesJson}::jsonb,
        ${q.correctAnswer}, ${q.correctOption},
        ${q.explanation}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${q.contentId}, ${qSubjectId}, ${qTopicId},
        true, ${q.difficulty}, 0,
        ${q.questionType}, NOW(), NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `)) as any;

    const rowCount = result?.rowCount ?? result?.count ?? 0;
    if (Number(rowCount) > 0) {
      inserted++;
      console.log(`  ✅ [${q.id}] inserida`);
    } else {
      skipped++;
      console.log(`  ⏭️  [${q.id}] já existe — pulada`);
    }
  }

  console.log("\n========================================================");
  console.log(`  CONCLUÍDO: ${inserted} inseridas | ${skipped} puladas`);
  console.log("========================================================\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ ERRO no seed R45:", err.message ?? err);
  process.exit(1);
});
