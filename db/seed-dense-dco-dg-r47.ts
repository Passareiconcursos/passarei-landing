/**
 * db/seed-dense-dco-dg-r47.ts
 * DENSIFICAÇÃO — DIR_CONSTITUCIONAL grupo con_dg_*
 *
 * Átomos-alvo: 6 átomos, 2 questões existentes cada → +6 por átomo = 36 novas questões
 * con_dg_c01 — Igualdade e Direito à Vida — Art. 5°, Caput e Incisos
 * con_dg_c02 — Inviolabilidade do Domicílio — Art. 5°, XI
 * con_dg_c03 — Liberdades, Sigilo e Vedação ao Anonimato — Art. 5°, IV, V, IX, XII
 * con_dg_c04 — Direito de Reunião e Associação — Art. 5°, XVI–XXI
 * con_dg_c05 — Remédios Constitucionais: Habeas Corpus e Habeas Data
 * con_dg_c06 — Remédios Constitucionais: Mandado de Segurança e Ação Popular
 *
 * Execução: npx tsx db/seed-dense-dco-dg-r47.ts
 */

import { db } from "../db/index";
import { sql } from "drizzle-orm";

// ──────────────────────────────────────────────────────────────────────────────
// QUESTÕES
// ──────────────────────────────────────────────────────────────────────────────

const questions = [

  // ── con_dg_c01: Igualdade e Direito à Vida — Art. 5°, Caput e Incisos ────

  {
    id: "con_dg_c01_q01",
    contentId: "con_dg_c01",
    statement:
      "O Art. 5°, caput da CF/88 garante a inviolabilidade do direito à vida, à liberdade, à igualdade, à segurança e à propriedade. Sobre o direito à vida, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "É direito absoluto, não podendo ser restringido em nenhuma hipótese." },
      { letter: "B", text: "A CF admite a pena de morte em caso de guerra externa declarada, configurando exceção expressa." },
      { letter: "C", text: "O aborto é expressamente proibido pela CF, por violação ao direito à vida desde a concepção." },
      { letter: "D", text: "O direito à vida impede qualquer pesquisa científica com células-tronco embrionárias." },
      { letter: "E", text: "O direito à vida é irrenunciável e impede que o Estado execute qualquer forma de eutanásia regulamentada por lei." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A CF veda a pena de morte em tempo de paz (Art. 5°, XLVII), mas o próprio Art. 5°, XLVII, 'a' prevê exceção para guerra externa declarada — regulada pelo Código Penal Militar.",
    explanationCorrect:
      "A exceção à vedação da pena de morte é única e expressa: guerra externa declarada. Fora dessa hipótese, o direito à vida é protegido contra a ação estatal punitiva. As demais afirmações (aborto, células-tronco) não têm vedação expressa na CF — são questões debatidas infraconstitucionalmente.",
    explanationWrong:
      "A CF não define o início da vida nem proíbe expressamente o aborto — o STF decidiu questões como o aborto de anencéfalos (ADPF 54) e células-tronco (ADI 3.510) sem concluir pela vedação constitucional absoluta.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c01_q02",
    contentId: "con_dg_c01",
    statement:
      "A isonomia constitucional (Art. 5°, caput) proíbe distinções arbitrárias. Com base no princípio da igualdade, o STF considerou CONSTITUCIONAL:",
    alternatives: [
      { letter: "A", text: "A criação de cotas raciais em universidades públicas e concursos públicos federais." },
      { letter: "B", text: "A exigência de diploma superior específico para qualquer cargo público." },
      { letter: "C", text: "A vedação de qualquer forma de ação afirmativa, por violar a isonomia formal." },
      { letter: "D", text: "A proibição de candidatos com condenação criminal de participar de concursos, mesmo sem trânsito em julgado." },
      { letter: "E", text: "O tratamento diferenciado de homens e mulheres no IPTU, com isenção apenas para mulheres." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "O STF (ADPF 186 e Lei 12.990/2014 — ADC 41) declarou constitucionais as cotas raciais em universidades e concursos públicos, reconhecendo que a ação afirmativa é instrumento de igualdade material, não violação da isonomia formal.",
    explanationCorrect:
      "Ações afirmativas são constitucionais por promoverem a igualdade material (corrigir desigualdades históricas). O STF considerou as cotas proporcionais e justificadas pela persistência do racismo estrutural no Brasil.",
    explanationWrong:
      "A isonomia formal (tratar todos iguais) não impede a igualdade material (tratar desiguais de forma desigual). Vedação absoluta de ações afirmativas seria inconstitucional por ignorar a dimensão material da igualdade.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c01_q03",
    contentId: "con_dg_c01",
    statement:
      "Sobre a proteção constitucional à vida e ao corpo humano, o STF entende que:",
    alternatives: [
      { letter: "A", text: "A pessoa pode ser obrigada a fazer transfusão de sangue, mesmo contrariando crença religiosa, quando houver risco de morte." },
      { letter: "B", text: "Ninguém pode ser submetido a tratamento médico compulsório, salvo em casos excepcionais previstos em lei (ex.: internação compulsória por dependência grave) com controle judicial." },
      { letter: "C", text: "O Estado pode determinar vacinação compulsória com aplicação forçada, mesmo sem lei específica." },
      { letter: "D", text: "O preso não tem direito à saúde — a assistência médica é benefício e não direito." },
      { letter: "E", text: "O direito à vida impede qualquer limitação ao direito de acesso a medicamentos pelo SUS." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O STF (ARE 1.267.879 — Tema 1.103) fixou que o Estado pode impor vacinação obrigatória, mas não pode aplicar vacina à força. Pode impor consequências indiretas (restrição a serviços públicos). O tratamento compulsório tem exceções legais com controle judicial.",
    explanationCorrect:
      "O STF equilibra autonomia individual (direito ao próprio corpo) com proteção coletiva à saúde. Vacinação obrigatória com sanções indiretas é constitucional; aplicação forçada viola a dignidade. Internação compulsória por dependência grave também admite exceção legal.",
    explanationWrong:
      "O preso mantém todos os direitos não atingidos pela sentença — incluindo saúde, integridade física e dignidade. O STF reconhece o dever estatal de assistência médica ao preso (Súmula Vinculante 11 e outros precedentes).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c01_q04",
    contentId: "con_dg_c01",
    statement:
      "A igualdade perante a lei (Art. 5°, caput) aplica-se também na aplicação da lei pelo Judiciário e pela Administração. Isso significa que:",
    alternatives: [
      { letter: "A", text: "O juiz deve aplicar a lei da mesma forma para todos os casos idênticos, vedada a interpretação diferenciada sem fundamento." },
      { letter: "B", text: "O legislador não pode diferenciar situações distintas em nenhuma hipótese." },
      { letter: "C", text: "A Administração pode tratar casos idênticos de forma diferente quando houver conveniência e oportunidade." },
      { letter: "D", text: "A igualdade judicial impede a criação de varas especializadas por matéria." },
      { letter: "E", text: "Toda norma que diferencia contribuintes por faixa de renda viola a isonomia tributária." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "A isonomia na aplicação da lei vincula o Judiciário (decisões coerentes para casos iguais) e a Administração (tratamento isonômico de administrados em situações idênticas). Diferenciações precisam de fundamento legal e proporcional.",
    explanationCorrect:
      "O STF usa precedentes vinculantes justamente para garantir isonomia judicial: casos idênticos devem ter solução idêntica. A Administração não pode usar discricionariedade para tratar desigualmente casos objetivamente iguais — isso configuraria desvio de finalidade.",
    explanationWrong:
      "O legislador PODE diferenciar situações distintas — isso é igualdade material. Tributação progressiva (faixas de renda) é exemplo de diferenciação constitucional. Varas especializadas não violam isonomia — o critério é a matéria, não a pessoa.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c01_q05",
    contentId: "con_dg_c01",
    statement:
      "O Art. 5°, III, da CF veda a tortura e o tratamento desumano ou degradante. Sobre essa vedação:",
    alternatives: [
      { letter: "A", text: "Aplica-se apenas a presos — pessoas em liberdade não estão abrangidas." },
      { letter: "B", text: "A tortura é crime inafiançável e insuscetível de graça ou anistia, conforme o Art. 5°, XLIII." },
      { letter: "C", text: "Em casos de terrorismo, a tortura pode ser autorizada por decreto presidencial." },
      { letter: "D", text: "A vedação à tortura é direito disponível — o investigado pode consentir com o tratamento." },
      { letter: "E", text: "Aplica-se apenas a atos praticados por agentes do Estado, não por particulares." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, XLIII da CF classifica a tortura como crime inafiançável e insuscetível de graça ou anistia. A Lei 9.455/1997 regulamentou o crime de tortura. A vedação é absoluta — nenhum fundamento (segurança nacional, terrorismo) autoriza a tortura.",
    explanationCorrect:
      "A tortura é vedação absoluta: não admite ponderação com outros direitos, não pode ser autorizada por decreto e não é disponível pelo investigado. O consentimento da vítima não torna a tortura lícita — ela viola a dignidade humana de forma absoluta.",
    explanationWrong:
      "A vedação à tortura alcança todos — presos, investigados, cidadãos livres — e obriga tanto agentes estatais quanto particulares (crime de tortura é aplicável a qualquer pessoa, não só agentes públicos).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c01_q06",
    contentId: "con_dg_c01",
    statement:
      "A Constituição veda o tratamento discriminatório por raça, cor, sexo, idioma, religião, opinião política ou qualquer outra condição (decorrência do Art. 5°, caput). Com base nisso, o STF reconheceu que:",
    alternatives: [
      { letter: "A", text: "A discriminação por orientação sexual configura prática análoga ao racismo, sujeita à Lei 7.716/1989." },
      { letter: "B", text: "A discriminação por orientação sexual é apenas ato civil ilícito, sem tipificação penal." },
      { letter: "C", text: "O STF não tem competência para criminalizar condutas — apenas o Congresso pode fazê-lo." },
      { letter: "D", text: "A homofobia é conduta atípica enquanto não houver lei penal específica aprovada pelo Congresso." },
      { letter: "E", text: "A discriminação religiosa é protegida pela liberdade de crença, não configurando crime." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "O STF (ADO 26 e MI 4.733, 2019) equiparou a homofobia e a transfobia ao crime de racismo previsto na Lei 7.716/1989, reconhecendo omissão inconstitucional do Congresso e aplicando a lei existente por analogia in bonam partem, até aprovação de lei específica.",
    explanationCorrect:
      "O STF, por maioria, mandatou que a homofobia e a transfobia são condutas tipificadas pela Lei 7.716/1989 (crimes de preconceito) enquanto o Congresso não legislar especificamente. A decisão está em vigor e tem efeito vinculante.",
    explanationWrong:
      "O STF usou o MI para suprir omissão legislativa — técnica constitucional prevista. A decisão não criou tipo penal novo, mas enquadrou a conduta em tipo existente (racismo), por força da equiparação constitucional.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── con_dg_c02: Inviolabilidade do Domicílio — Art. 5°, XI ───────────────

  {
    id: "con_dg_c02_q01",
    contentId: "con_dg_c02",
    statement:
      "Policiais civis cumprem mandado de busca e apreensão às 14h em residência investigada por tráfico de drogas. Dentro da residência, encontram outra pessoa (além do investigado) portando entorpecentes. Sobre a legalidade do ingresso e dos efeitos:",
    alternatives: [
      { letter: "A", text: "O ingresso é válido, e a apreensão em relação a terceiros também é válida, pois o mandado abrange toda a residência." },
      { letter: "B", text: "O ingresso é válido, mas a apreensão em relação a terceiros exige novo mandado específico." },
      { letter: "C", text: "O ingresso é inválido, pois o mandado deve identificar nominalmente todos os possíveis ocupantes." },
      { letter: "D", text: "O ingresso é válido apenas se a busca ocorrer antes das 12h." },
      { letter: "E", text: "O ingresso é inválido sempre que houver mais de uma pessoa na residência." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "O mandado de busca e apreensão autoriza a diligência em determinado local (endereço), abrangendo todos os seus cômodos e ocupantes presentes. A descoberta de crimes cometidos por terceiros no mesmo local configura flagrante delito, autorizando apreensão e prisão.",
    explanationCorrect:
      "O mandado é expedido para o endereço, não para pessoa específica. Os efeitos da diligência legal alcançam os fatos descobertos no curso da busca. A flagrância do terceiro legitima a ação policial sem necessidade de novo mandado.",
    explanationWrong:
      "Não há exigência de identificação prévia de todos os ocupantes no mandado. O horário de 14h está dentro do período diurno (6h–18h), tornando o ingresso plenamente válido.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c02_q02",
    contentId: "con_dg_c02",
    statement:
      "A teoria da descoberta inevitável (inevitable discovery) e a teoria dos frutos da árvore envenenada (fruits of the poisonous tree) são aplicadas pelo STF em matéria de prova ilícita. Sobre essas teorias:",
    alternatives: [
      { letter: "A", text: "A teoria dos frutos da árvore envenenada torna lícita toda prova obtida a partir de ingresso ilegal, se o crime for grave." },
      { letter: "B", text: "A descoberta inevitável é exceção à ilicitude: se a prova seria encontrada por meio lícito independente, pode ser usada." },
      { letter: "C", text: "Ambas as teorias são rejeitadas pelo STF, que adota vedação absoluta de toda prova ilícita derivada." },
      { letter: "D", text: "A prova obtida por ingresso ilegal é sempre aproveitável quando o crime for de natureza hedionda." },
      { letter: "E", text: "A teoria do fruto envenenado aplica-se apenas a provas físicas, não a depoimentos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O STF aplica a teoria da descoberta inevitável: se a prova seria descoberta por meio lícito independente, ela pode ser usada no processo, mesmo que tenha sido efetivamente obtida de forma ilícita. Já a teoria dos frutos invalida provas que derivem causalmente de prova ilícita.",
    explanationCorrect:
      "Exemplo de descoberta inevitável: droga encontrada em busca ilegal, mas que seria encontrada na vistoria regular obrigatória do veículo. Se a descoberta era inevitável por caminho lícito, a prova não é contaminada. O STF admite essa exceção.",
    explanationWrong:
      "A gravidade do crime não é critério para aproveitar prova ilícita — a exceção é técnica (inevitabilidade da descoberta por meio independente), não baseada na natureza do crime.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c02_q03",
    contentId: "con_dg_c02",
    statement:
      "Um morador permite a entrada de policiais em sua residência sem mandado para 'dar uma olhada'. Os policiais encontram drogas e efetuam prisão. Para que o consentimento torne o ingresso válido, é necessário que:",
    alternatives: [
      { letter: "A", text: "Haja apenas a presença de dois policiais como testemunhas do consentimento." },
      { letter: "B", text: "O consentimento seja registrado em vídeo pelos policiais antes do ingresso." },
      { letter: "C", text: "O consentimento seja livre, informado (o morador sabia que podia recusar) e inequívoco, devendo ser comprovado pela acusação." },
      { letter: "D", text: "O morador assine termo de consentimento na delegacia após o ingresso." },
      { letter: "E", text: "Haja suspeita prévia documentada de que havia drogas no local." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O STF fixou os requisitos do consentimento válido para ingresso policial: livre (sem pressão ou coação), informado (ciente da possibilidade de recusar) e inequívoco (não presumido da passividade). O ônus de provar o consentimento válido é da acusação.",
    explanationCorrect:
      "A prova do consentimento válido é da parte que alega sua existência (MP/Estado). Se não comprovado adequadamente, o ingresso é inválido e as provas obtidas são ilícitas por derivação. Vídeo pode ser meio de prova, mas não é requisito formal.",
    explanationWrong:
      "A mera presença de testemunhas policiais não garante a validade do consentimento — o STF exige análise das circunstâncias concretas para verificar se a pessoa efetivamente tinha liberdade de recusar.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c02_q04",
    contentId: "con_dg_c02",
    statement:
      "Qual das situações abaixo configura 'flagrante delito' que autoriza o ingresso noturno em residência sem mandado?",
    alternatives: [
      { letter: "A", text: "Policial acredita, por intuição profissional, que há crime ocorrendo no interior da residência." },
      { letter: "B", text: "Vizinhos relataram que a pessoa foi vista entrando com sacolas suspeitas horas antes." },
      { letter: "C", text: "Policial ouve gritos de socorro e barulho de luta no interior da residência." },
      { letter: "D", text: "Investigação de inteligência indica que tráfico de drogas opera no local há semanas." },
      { letter: "E", text: "Mandado de prisão em aberto contra o morador autoriza ingresso a qualquer hora." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Gritos de socorro e barulho de luta configuram simultaneamente flagrante delito (provável lesão corporal ou ameaça em curso) E necessidade de prestar socorro — duas das hipóteses constitucionais que autorizam ingresso sem mandado a qualquer hora.",
    explanationCorrect:
      "As exceções constitucionais ao mandado exigem situação concreta e imediata: flagrante em curso, desastre ou socorro necessário. Suspeita baseada em relatório anterior, intuição policial ou mandado de prisão não configuram flagrante atual que justifique ingresso noturno.",
    explanationWrong:
      "Mandado de prisão autoriza prender a pessoa onde quer que esteja, mas o ingresso na residência de terceiro ainda exige mandado de busca ou situação de flagrante. Suspeita histórica não equivale a flagrante em curso.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c02_q05",
    contentId: "con_dg_c02",
    statement:
      "O STF (RE 603.616 — Tema 280) fixou tese sobre ingresso policial em residência. Assinale a alternativa que melhor resume a tese fixada:",
    alternatives: [
      { letter: "A", text: "O ingresso forçado em domicílio sem mandado judicial somente é lícito quando amparado por flagrante delito, situação de desastre ou para prestar socorro, não sendo suficiente a mera suspeita policial." },
      { letter: "B", text: "A polícia pode ingressar em residência sem mandado sempre que houver suspeita fundamentada de crime, devendo justificar posteriormente." },
      { letter: "C", text: "Em crimes de tráfico de drogas, o ingresso sem mandado é sempre válido por força da política criminal nacional." },
      { letter: "D", text: "O consentimento presumido do morador autoriza o ingresso policial sem mandado." },
      { letter: "E", text: "O ingresso sem mandado é válido quando duas testemunhas confirmarem a suspeita dos policiais." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "A tese do Tema 280 do STF é exatamente essa: ingresso forçado sem mandado só é lícito nas hipóteses constitucionais (flagrante, desastre, socorro). Suspeita policial, mesmo fundada em informações de terceiros, não é suficiente para dispensar o mandado.",
    explanationCorrect:
      "O STF afastou a prática de usar 'denúncia anônima de tráfico' como fundamento para ingresso sem mandado. A flagrância exige que o crime esteja ocorrendo no momento do ingresso, não que tenha ocorrido antes ou que haja suspeita de que ocorrerá.",
    explanationWrong:
      "Nenhuma política criminal (nem mesmo o combate ao tráfico de drogas) cria exceção constitucional à inviolabilidade do domicílio. A CF é taxativa nas hipóteses de ingresso sem mandado.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c02_q06",
    contentId: "con_dg_c02",
    statement:
      "O conceito constitucional de 'casa' para fins do Art. 5°, XI abrange:",
    alternatives: [
      { letter: "A", text: "Apenas a residência principal do indivíduo, onde este dorme." },
      { letter: "B", text: "Qualquer compartimento habitado, inclusive dependências fechadas e espaços de trabalho privados (escritórios, consultórios), desde que com expectativa de privacidade." },
      { letter: "C", text: "Apenas imóveis residenciais — imóveis comerciais não têm proteção constitucional de domicílio." },
      { letter: "D", text: "Apenas espaços próprios — imóveis alugados não são 'casa' para fins do Art. 5°, XI." },
      { letter: "E", text: "Apenas locais fechados com paredes e teto — não inclui sítios, fazendas ou camping." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O STF adota conceito extensivo de 'casa': qualquer espaço privado onde o indivíduo exerce atividades com legítima expectativa de privacidade. Inclui escritórios profissionais, consultórios médicos, quartos de hotel, trailers habitados — qualquer espaço fechado de uso privado.",
    explanationCorrect:
      "A proteção não depende da titularidade (próprio ou alugado), da permanência (residência fixa ou temporária) ou do uso (residencial ou profissional). O critério é a expectativa razoável de privacidade no espaço fechado.",
    explanationWrong:
      "Imóveis comerciais abertos ao público (lojas, restaurantes) não têm proteção de domicílio quanto às áreas públicas. Mas as áreas privativas (escritório dos fundos, estoque fechado) têm a mesma proteção da residência.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── con_dg_c03: Liberdades, Sigilo e Vedação ao Anonimato ────────────────

  {
    id: "con_dg_c03_q01",
    contentId: "con_dg_c03",
    statement:
      "O Art. 5°, V, CF assegura o direito de resposta proporcional ao agravo praticado por meio de comunicação. Esse direito:",
    alternatives: [
      { letter: "A", text: "Exige que a resposta seja publicada no mesmo meio, formato e horário/espaço equivalente ao da ofensa." },
      { letter: "B", text: "Substitui a indenização por danos morais — não se pode cumular os dois." },
      { letter: "C", text: "Aplica-se apenas a ofensas praticadas por veículos de comunicação de massa." },
      { letter: "D", text: "Pode ser exercido pelo ofendido diretamente, independentemente de processo judicial." },
      { letter: "E", text: "Tem prazo decadencial de 60 dias, após o qual o direito se extingue." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "A Lei 13.188/2015 (Lei de Direito de Resposta) regulamenta o Art. 5°, V: a resposta deve ser veiculada no mesmo veículo, espaço/horário equivalente e formato semelhante ao da ofensa, garantindo que o público que a viu também veja a resposta.",
    explanationCorrect:
      "A proporcionalidade exige equivalência: se a ofensa foi em editorial de capa, a resposta deve ser em posição equivalente. Se foi em programa de rádio das 8h, a resposta vai no mesmo horário. A lei garante que a resposta alcance o mesmo público da ofensa.",
    explanationWrong:
      "O direito de resposta é cumulável com indenização (Art. 5°, V fala em 'além da indenização'). A lei prevê prazo de 60 dias para o pedido ao veículo, mas isso é prazo para exercício extrajudicial, não para o direito em si.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c03_q02",
    contentId: "con_dg_c03",
    statement:
      "A vedação ao anonimato (Art. 5°, IV) e o sigilo da fonte jornalística (Art. 5°, XIV) convivem no ordenamento constitucional. Essa aparente contradição é resolvida porque:",
    alternatives: [
      { letter: "A", text: "O Art. 5°, XIV revoga o inciso IV para jornalistas — eles podem ser anônimos." },
      { letter: "B", text: "O sigilo protege a identidade da fonte (quem forneceu a informação), não a do jornalista, que permanece identificado." },
      { letter: "C", text: "O jornalista pode optar pelo anonimato quando a matéria envolver crimes, invocando o Art. 5°, XIV." },
      { letter: "D", text: "A contradição é aparente — na prática, a ADPF 130 resolveu o conflito proibindo qualquer anonimato." },
      { letter: "E", text: "O sigilo da fonte se aplica apenas a fontes governamentais — fontes privadas não têm essa proteção." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Não há contradição: o jornalista se identifica (não é anônimo), mas protege a identidade de sua fonte informativa. O Art. 5°, XIV protege o sigilo de quem forneceu a informação ao jornalista, não do jornalista em si.",
    explanationCorrect:
      "A vedação ao anonimato (inciso IV) proíbe que o próprio autor da manifestação se oculte. O sigilo da fonte (inciso XIV) protege quem forneceu informações a terceiros (jornalistas). São situações distintas — quem assina a matéria é identificado; quem a originou pode ser protegido.",
    explanationWrong:
      "A ADPF 130 (que declarou a Lei de Imprensa não recepcionada) não alterou a vedação ao anonimato nem o sigilo da fonte. Ambos coexistem sem contradição.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c03_q03",
    contentId: "con_dg_c03",
    statement:
      "O Art. 5°, XII protege o sigilo das comunicações 'telegráficas, de dados e das comunicações telefônicas'. A EC 115/2022 acrescentou ao Art. 5° proteção expressa a:",
    alternatives: [
      { letter: "A", text: "Comunicações por satélite e radioamadorismo." },
      { letter: "B", text: "Dados pessoais, inclusive nos meios digitais (inciso LXXIX)." },
      { letter: "C", text: "Correspondência física enviada pelo Correios." },
      { letter: "D", text: "Comunicações em redes sociais públicas." },
      { letter: "E", text: "Metadados de comunicações (registros de conexão)." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A EC 115/2022 inseriu o inciso LXXIX no Art. 5°: 'é assegurado, nos termos da lei, o direito à proteção de dados pessoais, inclusive nos meios digitais.' Consolidou constitucionalmente o que a LGPD (Lei 13.709/2018) já previa em nível infraconstitucional.",
    explanationCorrect:
      "A proteção de dados pessoais ganhou status de direito fundamental expresso com a EC 115/2022. Isso reforça a LGPD e cria fundamento constitucional para obrigações de proteção de dados por empresas e pelo Estado.",
    explanationWrong:
      "Correspondência física já era protegida pelo Art. 5°, XII (sigilo de correspondência). Redes sociais públicas não têm sigilo — o conteúdo publicado é público. A EC 115 focou nos dados pessoais em geral.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c03_q04",
    contentId: "con_dg_c03",
    statement:
      "Sobre a liberdade de expressão e o discurso político, a Constituição protege:",
    alternatives: [
      { letter: "A", text: "Apenas o discurso político moderado e construtivo — discursos radicais podem ser censurados." },
      { letter: "B", text: "Críticas severas a agentes públicos no exercício da função, inclusive manifestações exageradas ou hiperbólicas, desde que não configurem discurso de ódio." },
      { letter: "C", text: "Apenas o discurso favorável ao governo vigente — críticas ao regime não têm proteção constitucional." },
      { letter: "D", text: "Apenas manifestações realizadas por partidos políticos registrados no TSE." },
      { letter: "E", text: "O discurso político somente quando realizado em período eleitoral." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O STF protege amplamente o discurso político: críticas, sátiras, hipérboles e manifestações contrárias a governos têm máxima proteção. Agentes públicos têm menor proteção da honra em relação a críticas sobre o exercício do cargo — aceitam maior exposição.",
    explanationCorrect:
      "A Constituição protege especialmente o discurso político e a crítica ao poder — são pilares da democracia. O STF distingue: sátira política (protegida), crítica severa (protegida), difamação falsa e deliberada (pode gerar responsabilidade), discurso de ódio (não protegido).",
    explanationWrong:
      "A CF não distingue discursos moderados de radicais — o critério é o conteúdo (discurso de ódio versus opinião política, por mais extremada que seja). Toda a sociedade tem direito de manifestação política, não apenas partidos registrados.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c03_q05",
    contentId: "con_dg_c03",
    statement:
      "A liberdade de expressão pode colidir com o direito à honra e à imagem (Art. 5°, X). O STF usa, para resolver esse conflito, a técnica da:",
    alternatives: [
      { letter: "A", text: "Prevalência absoluta da liberdade de expressão sobre a honra, em todos os casos." },
      { letter: "B", text: "Prevalência absoluta da honra e imagem sobre a liberdade de expressão, protegendo a pessoa." },
      { letter: "C", text: "Ponderação de interesses no caso concreto, verificando proporcionalidade e distinguindo se o ofendido é pessoa pública ou privada." },
      { letter: "D", text: "Anulação de ambos os direitos em conflito, determinando o silêncio de ambas as partes." },
      { letter: "E", text: "Prevalência da norma mais recente — a CF/88 prevalece sobre a honra regulada pelo CC de 2002." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O STF usa ponderação de interesses (proporcionalidade): analisa o caso concreto considerando se o ofendido é pessoa pública (aceita mais crítica) ou privada, se o assunto é de interesse público, se a informação é verdadeira, e se há propósito informativo ou apenas malicioso.",
    explanationCorrect:
      "O critério público/privado é central: figuras públicas (políticos, celebridades no exercício da função pública) aceitam críticas mais severas sobre seu papel público. Pessoas privadas têm proteção maior da honra. Verdade e interesse público favorecem a liberdade de expressão.",
    explanationWrong:
      "Não existe hierarquia absoluta entre esses direitos — ambos são fundamentais e o STF resiste a criar precedentes de prevalência absoluta de um sobre o outro. A solução é sempre caso a caso, pela ponderação.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c03_q06",
    contentId: "con_dg_c03",
    statement:
      "O Art. 5°, IX veda a censura de natureza política, ideológica e artística. Essa vedação abrange:",
    alternatives: [
      { letter: "A", text: "Apenas a censura estatal — a censura praticada por particulares (plataformas digitais, por exemplo) não está sujeita a essa vedação." },
      { letter: "B", text: "Toda forma de restrição prévia ao conteúdo, inclusive limitações impostas por contrato privado." },
      { letter: "C", text: "Apenas produções cinematográficas e televisivas — manifestações escritas têm regime próprio." },
      { letter: "D", text: "Apenas o período eleitoral — fora dele, restrições políticas são permitidas." },
      { letter: "E", text: "Apenas manifestações artísticas — expressões políticas têm proteção específica na lei dos partidos." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "A vedação constitucional à censura dirige-se ao Estado. Plataformas digitais e empresas privadas têm autonomia contratual para moderar conteúdo em seus serviços — essa moderação não configura 'censura' no sentido constitucional, embora possa ter outros efeitos jurídicos.",
    explanationCorrect:
      "A censura constitucional é estatal: o Estado não pode proibir previamente manifestações políticas, ideológicas ou artísticas. Remoção de conteúdo por plataformas privadas com base em seus termos de uso é ato privado contratual, não censura estatal — embora o debate sobre regulação dessas plataformas esteja em curso.",
    explanationWrong:
      "A vedação abrange qualquer manifestação de pensamento (escrita, audiovisual, artística, política) — não há segmentação por tipo de mídia ou período. O Art. 5°, IX é amplo.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── con_dg_c04: Direito de Reunião e Associação — Art. 5°, XVI–XXI ────────

  {
    id: "con_dg_c04_q01",
    contentId: "con_dg_c04",
    statement:
      "O Art. 5°, XVII, CF assegura a plena liberdade de associação para fins lícitos, vedada a de caráter paramilitar. Qual das seguintes associações seria vedada pela Constituição?",
    alternatives: [
      { letter: "A", text: "Associação de moradores de bairro organizada para pressionar o poder público." },
      { letter: "B", text: "Associação de tiro esportivo com prática de esportes em campo fechado." },
      { letter: "C", text: "Associação civil organizada com estrutura hierárquica militar, fardamento, armamento e treinamento para ação de força contra o Estado ou grupos políticos." },
      { letter: "D", text: "Clube de caça e pesca legalmente constituído." },
      { letter: "E", text: "Organização não governamental que atua em segurança comunitária com voluntários desarmados." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Associação paramilitar é aquela que organiza pessoas com estrutura, disciplina e armamento semelhantes às forças militares, com finalidade de exercer força coercitiva fora do Estado. A CF a proíbe porque representa ameaça ao monopólio estatal do uso da força.",
    explanationCorrect:
      "Os elementos da associação paramilitar vedada: hierarquia militar + fardamento + armamento + treinamento para uso de força. Ausente qualquer desses elementos, a associação é civil lícita. Tiro esportivo, caça, pesca e segurança comunitária desarmada são lícitos.",
    explanationWrong:
      "Associação de moradores, ONG de segurança comunitária sem armas e clubes esportivos são associações para fins lícitos, protegidas pelo Art. 5°, XVII. O critério vedador é o caráter paramilitar, não o simples exercício de atividades relacionadas a força ou segurança.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c04_q02",
    contentId: "con_dg_c04",
    statement:
      "O Art. 5°, XIX, CF veda a interferência estatal no funcionamento das associações. Isso significa que:",
    alternatives: [
      { letter: "A", text: "O Estado não pode regular associações de qualquer tipo, sendo a liberdade de associação absoluta." },
      { letter: "B", text: "O Estado não pode dissolver associação nem suspender suas atividades sem decisão judicial transitada em julgado — a dissolução compulsória só ocorre por sentença." },
      { letter: "C", text: "Associações podem recusar qualquer fiscalização estatal, inclusive a Receita Federal." },
      { letter: "D", text: "O cancelamento do registro de associação pode ser feito por ato administrativo do Poder Executivo." },
      { letter: "E", text: "A intervenção policial em reunião de associação ilícita é vedada sem ordem judicial." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, XIX proíbe interferência estatal no funcionamento das associações. A dissolução compulsória ou a suspensão de atividades só pode ocorrer por decisão judicial transitada em julgado — ato administrativo não basta.",
    explanationCorrect:
      "A proteção constitucional é forte: o Estado só pode dissolver uma associação por sentença judicial definitiva. Medidas cautelares (suspensão temporária) precisam de decisão judicial, não de ato do Executivo. Isso protege associações políticas de perseguição por governos.",
    explanationWrong:
      "A liberdade de associação não é absoluta — associações estão sujeitas a obrigações legais (Receita Federal, registro civil). O que é vedado é a interferência no funcionamento interno e a dissolução administrativa arbitrária.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c04_q03",
    contentId: "con_dg_c04",
    statement:
      "O Art. 5°, XXI, CF permite que entidades associativas representem seus filiados judicial ou extrajudicialmente quando expressamente autorizadas. O STF interpreta essa autorização exigindo:",
    alternatives: [
      { letter: "A", text: "Autorização verbal de cada associado a cada ação judicial proposta." },
      { letter: "B", text: "Autorização constante do estatuto social ou deliberação assemblear, podendo ser genérica para todas as ações da entidade." },
      { letter: "C", text: "Autorização individual expressa de cada associado, em documento assinado especificamente para cada processo." },
      { letter: "D", text: "Autorização do Ministério Público para representar filiados em ações coletivas." },
      { letter: "E", text: "Registro da autorização em cartório antes de cada ação judicial." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O STF (RE 573.232 — repercussão geral) fixou que, para o Art. 5°, XXI, a representação de filiados exige autorização individual expressa de cada associado para a ação específica — diferentemente da substituição processual do Art. 8°, III (sindicatos), que é mais ampla.",
    explanationCorrect:
      "A distinção é técnica: associações (Art. 5°, XXI) = representação processual, exige autorização individual. Sindicatos (Art. 8°, III) = substituição processual, agem independentemente de autorização de cada substituído. Para o MS coletivo de associação, o STF flexibilizou, mas para ações ordinárias exige a autorização individual.",
    explanationWrong:
      "O estatuto social genérico não basta para o Art. 5°, XXI — é necessária autorização específica de cada associado. Essa é a diferença entre representação (Art. 5°, XXI) e substituição processual (sindicatos e MS coletivo).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c04_q04",
    contentId: "con_dg_c04",
    statement:
      "Sobre o direito de reunião (Art. 5°, XVI), é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "Exige autorização prévia da autoridade policial para reuniões de mais de 100 pessoas." },
      { letter: "B", text: "Pode ser limitado em estado de defesa ou estado de sítio, conforme previsto na própria CF." },
      { letter: "C", text: "É absoluto — nem em estado de sítio o direito de reunião pode ser suspenso." },
      { letter: "D", text: "Somente pode ser exercido durante o dia — reuniões noturnas exigem autorização." },
      { letter: "E", text: "Aplica-se apenas a reuniões de natureza política — reuniões religiosas têm regime próprio." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O estado de defesa (Art. 136) permite restrições ao direito de reunião. O estado de sítio (Art. 137) pode suspender o direito de reunião. A própria Constituição prevê essas exceções para situações de grave crise institucional.",
    explanationCorrect:
      "Direitos fundamentais, em geral, admitem restrições em situações de emergência constitucional (estado de defesa e sítio). O Art. 136, §1°, I, 'a' menciona expressamente restrição ao direito de reunião durante o estado de defesa.",
    explanationWrong:
      "Reuniões não exigem autorização — apenas aviso prévio. Reuniões noturnas são plenamente permitidas (não há restrição de horário). O direito de reunião abrange qualquer finalidade lícita (religiosa, política, sindical, social).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c04_q05",
    contentId: "con_dg_c04",
    statement:
      "O Art. 5°, XX, CF assegura que ninguém pode ser compelido a associar-se ou permanecer associado. Isso significa que:",
    alternatives: [
      { letter: "A", text: "Sindicatos não podem cobrar contribuição de não associados — a sindicalização é completamente voluntária." },
      { letter: "B", text: "A contribuição confederativa (distinta da contribuição sindical) pode ser cobrada de todos os trabalhadores, associados ou não." },
      { letter: "C", text: "O STF entende que a liberdade negativa de associação é absoluta, vedando qualquer cobrança obrigatória de não associados por entidade sindical." },
      { letter: "D", text: "A filiação a ordens profissionais (OAB, CRM, CREA) viola o Art. 5°, XX por ser compulsória." },
      { letter: "E", text: "Planos de saúde e seguros coletivos obrigatórios violam o Art. 5°, XX por impor associação." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O STF (Súmula Vinculante 40) fixou que a contribuição assistencial ou confederativa só pode ser cobrada de trabalhadores sindicalizados — cobrar de não associados viola a liberdade negativa de associação. A contribuição sindical obrigatória foi extinta pela Reforma Trabalhista (Lei 13.467/2017).",
    explanationCorrect:
      "A liberdade negativa de associação (ninguém é obrigado a se associar) impede cobrança obrigatória de não filiados por sindicatos. A Reforma Trabalhista de 2017 tornou a contribuição sindical facultativa, alinhando a lei à jurisprudência do STF.",
    explanationWrong:
      "OAB, CRM e CREA são entidades sui generis — o STF as reconhece como autarquias corporativas que exercem poder de polícia sobre profissões regulamentadas. A filiação obrigatória tem fundamento constitucional diferente (proteção ao usuário dos serviços).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c04_q06",
    contentId: "con_dg_c04",
    statement:
      "A dissolução de uma associação por decisão judicial (Art. 5°, XIX) somente pode ocorrer após:",
    alternatives: [
      { letter: "A", text: "Instauração de inquérito policial e indiciamento de seus dirigentes." },
      { letter: "B", text: "Representação do Ministério Público e decisão cautelar do juiz de plantão." },
      { letter: "C", text: "Trânsito em julgado de sentença judicial — medidas cautelares de suspensão podem ser decretadas antes, mas a dissolução definitiva exige sentença final." },
      { letter: "D", text: "Deliberação do Congresso Nacional por maioria absoluta." },
      { letter: "E", text: "Decreto do Presidente da República, quando a associação ameaçar a segurança nacional." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O Art. 5°, XIX é expresso: 'as associações só poderão ser compulsoriamente dissolvidas ou ter suas atividades suspensas por decisão judicial, exigindo-se, no primeiro caso, o trânsito em julgado.' Dissolução definitiva = sentença transitada em julgado. Suspensão = decisão judicial (pode ser cautelar).",
    explanationCorrect:
      "O texto constitucional distingue: suspensão de atividades (qualquer decisão judicial, inclusive liminar) e dissolução compulsória (somente sentença transitada em julgado). Isso protege as associações de dissoluções precipitadas antes do pleno exercício do contraditório.",
    explanationWrong:
      "Inquérito policial, decreto presidencial ou deliberação do Congresso não têm poder de dissolver associações — essa competência é exclusivamente judicial. A CF protege as associações de interferência dos outros poderes.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── con_dg_c05: Remédios Constitucionais — HC e HD ────────────────────────

  {
    id: "con_dg_c05_q01",
    contentId: "con_dg_c05",
    statement:
      "O HC foi impetrado por advogado em favor de cliente preso preventivamente há 90 dias sem que o processo tenha sido instruído. O fundamento do HC é o excesso de prazo na instrução criminal. Esse HC é:",
    alternatives: [
      { letter: "A", text: "Inadmissível — excesso de prazo deve ser impugnado por correição parcial, não por HC." },
      { letter: "B", text: "Admissível — o excesso de prazo na prisão preventiva é constrangimento ilegal à liberdade de locomoção." },
      { letter: "C", text: "Inadmissível — apenas o MP pode questionar o prazo da prisão preventiva." },
      { letter: "D", text: "Admissível apenas se houver sentença condenatória em primeiro grau." },
      { letter: "E", text: "Inadmissível — a prisão preventiva não tem prazo constitucional definido." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O excesso de prazo da prisão preventiva configura constrangimento ilegal à liberdade de locomoção, cabendo HC. O STF e o STJ têm vasta jurisprudência admitindo HC para relaxar prisão preventiva por excesso de prazo não justificado.",
    explanationCorrect:
      "A Súmula 52/STJ e a Súmula 21/STJ tratam do excesso de prazo na instrução como fundamento para relaxamento via HC. A prisão preventiva, embora sem prazo fixo na CF, deve ser proporcional — seu excesso é constrangimento ilegal atacável por HC.",
    explanationWrong:
      "HC não é exclusivo do MP — qualquer pessoa pode impetrá-lo. O excesso de prazo é fundamento clássico de HC. A ausência de prazo constitucional expresso não impede o controle judicial da duração razoável da preventiva.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c05_q02",
    contentId: "con_dg_c05",
    statement:
      "O Habeas Data tem competência distribuída entre os tribunais. Compete ao STF processar e julgar HD quando os dados forem de registros de:",
    alternatives: [
      { letter: "A", text: "Qualquer entidade pública ou privada no País — o STF tem competência exclusiva em HD." },
      { letter: "B", text: "Ministério Público Federal — o STF julga todos os HDs contra o MPF." },
      { letter: "C", text: "Entidades ou autoridades da União — como o STF julgou o HD de Impeachment, por exemplo." },
      { letter: "D", text: "Autoridades ou entidades sujeitas à jurisdição do STF como órgão de primeiro grau (Art. 102, I, 'd', CF)." },
      { letter: "E", text: "Apenas do Presidente da República e do Congresso Nacional." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "O Art. 102, I, 'd' da CF atribui ao STF a competência originária para julgar HD contra atos do Presidente da República, das Mesas da Câmara e do Senado, do TCU, do PGR e do próprio STF. Para outros atos, a competência é do STJ, TRF ou juízo de 1° grau.",
    explanationCorrect:
      "A competência em HD segue as regras gerais de competência: o tribunal competente para julgar mandado de segurança contra determinada autoridade é o mesmo competente para o HD. Não há competência exclusiva do STF para todo HD.",
    explanationWrong:
      "O STF não tem competência exclusiva em HD. Para dados em entidades federais estaduais, a competência pode ser do TRF ou do juízo federal de 1° grau, conforme a autoridade coatora.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c05_q03",
    contentId: "con_dg_c05",
    statement:
      "O HC pode ser impetrado por menor de idade (adolescente) em favor de adulto preso ilegalmente?",
    alternatives: [
      { letter: "A", text: "Não — o menor não tem capacidade processual para impetrar HC." },
      { letter: "B", text: "Sim — o HC pode ser impetrado por qualquer pessoa, independentemente de idade ou capacidade civil, pois é ação popular constitucional." },
      { letter: "C", text: "Sim, mas apenas se o menor for representado por pais ou responsável legal." },
      { letter: "D", text: "Não — apenas advogados com OAB e pessoas maiores de 18 anos podem impetrar HC." },
      { letter: "E", text: "Sim, mas apenas para beneficiar o próprio menor, não adultos terceiros." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O HC é ação de índole popular que dispensa capacidade postulatória (não precisa de advogado) e capacidade civil plena (pode ser impetrado por qualquer pessoa humana, inclusive menor de idade, em favor de qualquer paciente).",
    explanationCorrect:
      "O Código de Processo Penal (Art. 654, §2°) expressamente autoriza o juiz a conceder HC de ofício. Qualquer pessoa — sem restrição de idade, capacidade civil ou habilitação profissional — pode impetrá-lo. Inclusive analfabetos (nesse caso, por alguém em seu nome).",
    explanationWrong:
      "A exigência de advogado só existe para outras ações. No HC, a amplitude é máxima por se tratar de garantia do direito mais fundamental: a liberdade de locomoção. Restringir o rol de impetrantes enfraqueceria essa proteção.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c05_q04",
    contentId: "con_dg_c05",
    statement:
      "O HC não tem prazo para impetração. Isso significa que:",
    alternatives: [
      { letter: "A", text: "Pode ser impetrado a qualquer tempo, mesmo após o cumprimento integral da pena." },
      { letter: "B", text: "Pode ser impetrado a qualquer tempo enquanto houver constrangimento à liberdade de locomoção — após o cumprimento da pena, perde o objeto (salvo para efeitos secundários)." },
      { letter: "C", text: "A ausência de prazo não se aplica ao HC preventivo — este deve ser impetrado imediatamente." },
      { letter: "D", text: "O HC pode ser impetrado mesmo após o falecimento do paciente, pelos herdeiros." },
      { letter: "E", text: "A demora na impetração configura renúncia tácita ao direito." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O HC não tem prazo de decadência ou prescrição para impetração. Contudo, com o cumprimento da pena ou a cessação da coação, desaparece o constrangimento — o HC perde o objeto quanto à liberdade de locomoção, embora possa subsistir interesse para afastar efeitos secundários da condenação.",
    explanationCorrect:
      "HC impetrado após o cumprimento da pena pode ainda ter interesse quando subsistam efeitos do processo (como a reincidência ou efeitos da condenação para fins de antecedentes). Se não há mais constrangimento à liberdade, o HC é prejudicado por perda de objeto.",
    explanationWrong:
      "Herdeiros não têm legitimidade para impetrar HC pelo falecido — a ação é personalíssima quanto ao paciente. Após a morte, o processo se extingue pela morte do acusado (Art. 107, I do CP).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c05_q05",
    contentId: "con_dg_c05",
    statement:
      "O Habeas Data pode ser usado para obter dados de terceiros que afetem o requerente?",
    alternatives: [
      { letter: "A", text: "Sim — qualquer dado que afete o requerente pode ser objeto de HD." },
      { letter: "B", text: "Não — o HD é restrito a dados do próprio titular; dados de terceiros só podem ser obtidos por outros meios (requisição judicial, por exemplo)." },
      { letter: "C", text: "Sim, desde que o requerente demonstre interesse legítimo nos dados do terceiro." },
      { letter: "D", text: "Sim, em casos de investigação criminal — a vítima pode obter dados do suspeito via HD." },
      { letter: "E", text: "Depende — se os dados do terceiro estiverem misturados com os do requerente, o HD alcança ambos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O HD é ação personalíssima e restrita ao próprio titular dos dados. Seu objeto é o acesso, retificação ou anotação em dados do próprio requerente. Dados de terceiros exigem outros meios legais (mandado judicial de quebra de sigilo, por exemplo).",
    explanationCorrect:
      "A restrição ao titular é essencial para proteger a privacidade dos terceiros: se qualquer pessoa pudesse obter dados de outrem via HD, a proteção de dados perderia sentido. O HD serve para que cada pessoa conheça e controle seus próprios dados.",
    explanationWrong:
      "Interesse legítimo, vínculo com o requerente ou mistura de dados não ampliam o objeto do HD para além dos dados do próprio titular. Outros meios jurídicos devem ser usados para acessar dados de terceiros.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c05_q06",
    contentId: "con_dg_c05",
    statement:
      "Sobre as diferenças entre HC, HD e MS, assinale a alternativa correta:",
    alternatives: [
      { letter: "A", text: "Todos têm prazo de 120 dias para impetração." },
      { letter: "B", text: "Apenas o MS tem prazo de 120 dias; HC não tem prazo; HD depende da negativa administrativa prévia." },
      { letter: "C", text: "O HC dispensa advogado; MS e HD exigem capacidade postulatória." },
      { letter: "D", text: "HD e MS têm o mesmo rito processual e competência." },
      { letter: "E", text: "Todos dependem de esgotamento das vias administrativas antes de serem impetrados." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "As diferenças: HC — sem prazo, sem advogado obrigatório, protege liberdade de locomoção. MS — prazo de 120 dias (decadencial), exige capacidade postulatória, protege direito líquido e certo não amparado por HC/HD. HD — sem prazo fixo, exige negativa administrativa prévia, protege dados pessoais.",
    explanationCorrect:
      "O MS tem prazo decadencial de 120 dias (Lei 12.016/2009). O HC não tem prazo. O HD não tem prazo, mas exige prévio requerimento administrativo. O HC dispensa advogado; MS e HD geralmente exigem (embora a lei do HD não seja expressa quanto à obrigatoriedade).",
    explanationWrong:
      "A exigência de esgotamento da via administrativa é requisito apenas do HD (prévio requerimento negado), não do HC ou do MS. O HC dispensa advogado — MS e HD precisam de representação técnica.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── con_dg_c06: Remédios Constitucionais — MS e Ação Popular ─────────────

  {
    id: "con_dg_c06_q01",
    contentId: "con_dg_c06",
    statement:
      "A Ação Popular (Art. 5°, LXXIII) visa anular ato lesivo ao patrimônio público, à moralidade administrativa, ao meio ambiente e ao patrimônio histórico e cultural. Sobre a legitimidade passiva na AP:",
    alternatives: [
      { letter: "A", text: "Apenas o agente público que praticou o ato é réu." },
      { letter: "B", text: "São réus o agente público responsável, as autoridades ou entidades que participaram do ato lesivo e os beneficiários do ato." },
      { letter: "C", text: "Apenas o ente público (União, Estado, Município) é réu — o agente responde em ação separada." },
      { letter: "D", text: "Apenas o ordenador de despesas que assinou o ato ilegal é réu." },
      { letter: "E", text: "O Ministério Público é réu obrigatório em toda Ação Popular." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A Lei 4.717/1965 (Lei da Ação Popular) prevê litisconsórcio passivo necessário: devem figurar como réus as pessoas públicas ou privadas e as entidades referidas no Art. 1°, bem como as autoridades, funcionários ou administradores que houverem autorizado, aprovado, ratificado ou praticado o ato impugnado, e os beneficiários diretos do ato.",
    explanationCorrect:
      "O MP intervém na AP como custos legis (fiscal da lei), não como réu. Os réus são: o agente que praticou o ato + a entidade pública/privada envolvida + os beneficiários diretos que se locupletaram do ato lesivo.",
    explanationWrong:
      "O MP não é réu — atua como interveniente obrigatório fiscal da lei. O ente público pode ser réu, mas também pode migrar para o polo ativo se concordar com a pretensão do autor popular.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c06_q02",
    contentId: "con_dg_c06",
    statement:
      "O autor popular que agir de má-fé ou com manifesta temeridade na propositura da AP ficará sujeito a:",
    alternatives: [
      { letter: "A", text: "Apenas advertência judicial — a CF protege o cidadão de qualquer sanção por Ação Popular." },
      { letter: "B", text: "Condenação ao pagamento das custas judiciais e honorários do réu, vedada a multa." },
      { letter: "C", text: "Condenação ao décuplo das custas (Art. 13 da Lei 4.717/1965), além de responder por litigância de má-fé." },
      { letter: "D", text: "Inabilitação permanente para propor novas Ações Populares." },
      { letter: "E", text: "Nenhuma sanção — a lei da AP isenta o autor de qualquer responsabilidade por custas." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "A Lei 4.717/1965 (Art. 13) prevê que, se o autor agir de má-fé, será condenado ao décuplo das custas. Além disso, aplica-se o CPC quanto à litigância de má-fé. A CF (Art. 5°, LXXIII) isentou o autor popular de custas em caso de improcedência, mas não protege a má-fé.",
    explanationCorrect:
      "A isenção de custas do autor popular (Art. 5°, LXXIII) aplica-se apenas à ação proposta de boa-fé que seja julgada improcedente. Má-fé ou temeridade afasta a isenção e gera sanção específica: décuplo das custas.",
    explanationWrong:
      "A CF não protege a má-fé na AP. A isenção de custas é para boa-fé — incentiva a cidadania ativa sem medo de arcar com custas de ação legítima malsucedida. O abuso, porém, é penalizado.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c06_q03",
    contentId: "con_dg_c06",
    statement:
      "O MS pode ser utilizado contra ato omissivo de autoridade pública (quando ela deveria agir e não agiu). Sobre o MS por omissão:",
    alternatives: [
      { letter: "A", text: "É inadmissível — o MS só cabe contra atos comissivos (ação positiva da autoridade)." },
      { letter: "B", text: "É admissível quando a autoridade tem obrigação legal de agir e se omite, violando direito líquido e certo do impetrante." },
      { letter: "C", text: "É admissível apenas quando a omissão for de autoridade federal." },
      { letter: "D", text: "É admissível, mas o prazo de 120 dias conta-se da data em que a omissão deveria ter cessado." },
      { letter: "E", text: "É inadmissível — omissão deve ser impugnada por Mandado de Injunção." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O MS por omissão é plenamente admissível quando a autoridade tem dever legal de praticar ato e se recusa ou se omite, violando direito líquido e certo do impetrante. A omissão ilegal equivale ao ato comissivo ilegal para fins de MS.",
    explanationCorrect:
      "Exemplo clássico: servidor que requer promoção por merecimento e a autoridade não decide no prazo legal. A inércia viola direito líquido e certo do servidor — cabe MS para compelir a autoridade a praticar o ato. O prazo de 120 dias conta da ciência da omissão.",
    explanationWrong:
      "O MI serve para omissão normativa (falta de lei regulamentadora de direito constitucional), não para omissão administrativa de agir. O MS serve para ambas as hipóteses: ato comissivo e omissão administrativa ilegal.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c06_q04",
    contentId: "con_dg_c06",
    statement:
      "A Ação Popular pode ser proposta contra atos de pessoas jurídicas de direito privado?",
    alternatives: [
      { letter: "A", text: "Não — a AP só alcança atos de pessoas jurídicas de direito público." },
      { letter: "B", text: "Sim — quando se tratar de entidades subvencionadas pelo poder público, sociedades de economia mista, empresas públicas e fundações que recebam recursos públicos." },
      { letter: "C", text: "Sim — qualquer pessoa jurídica privada pode ser réu em AP, independentemente de vínculo com o Estado." },
      { letter: "D", text: "Não — contra pessoas jurídicas privadas, o instrumento adequado é a Ação Civil Pública." },
      { letter: "E", text: "Sim, mas apenas para atos que causem dano ambiental, não ao patrimônio público." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A Lei 4.717/1965 amplia o alcance da AP para entidades que administrem bens ou interesses públicos: entidades autárquicas, empresas públicas, sociedades de economia mista, fundações e entidades subvencionadas com mais de 50% de recursos públicos.",
    explanationCorrect:
      "A AP tutela o patrimônio público em sentido amplo — bens e dinheiro que, embora geridos por entidade privada, têm origem pública. Uma empresa pública que celebra contrato lesivo ao erário pode ser réu em AP, por exemplo.",
    explanationWrong:
      "Empresa privada pura (sem subvenção ou controle estatal) não é alcançada pela AP quanto ao seu patrimônio próprio. Nesses casos, outros meios legais são apropriados. A distinção é: há dinheiro ou bem público envolvido?",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c06_q05",
    contentId: "con_dg_c06",
    statement:
      "Sobre os efeitos da sentença no Mandado de Segurança, é correto afirmar:",
    alternatives: [
      { letter: "A", text: "A sentença concessiva do MS tem efeito ex nunc — opera somente para o futuro." },
      { letter: "B", text: "A sentença concessiva do MS tem efeito ex tunc quando anula ato administrativo ilegal — retroage à data do ato ilegal." },
      { letter: "C", text: "O MS nunca produz efeitos patrimoniais — apenas anula o ato administrativo." },
      { letter: "D", text: "A sentença do MS só produz efeitos após o trânsito em julgado." },
      { letter: "E", text: "A liminar concedida no MS tem efeito definitivo — a sentença de mérito não pode modificá-la." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Quando o MS anula ato administrativo ilegal, a sentença tem efeito ex tunc: o ato é considerado inválido desde sua prática, não apenas a partir da sentença. Isso garante a integridade da situação jurídica do impetrante retroativamente.",
    explanationCorrect:
      "A nulidade do ato administrativo ilegal retroage à data de sua prática (ex tunc). O impetrante que teve direito líquido e certo violado por ato ilegal tem direito a ser restituído ao estado anterior, como se o ato nunca tivesse existido.",
    explanationWrong:
      "O MS pode produzir efeitos patrimoniais quando a nulidade retroativa gera crédito ao impetrante (ex.: reintegração ao cargo com pagamento de vencimentos). A liminar é provisória e pode ser revogada ou confirmada pela sentença de mérito.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "con_dg_c06_q06",
    contentId: "con_dg_c06",
    statement:
      "Na Ação Popular, o Ministério Público tem papel de:",
    alternatives: [
      { letter: "A", text: "Litisconsorte ativo obrigatório — o MP sempre integra o polo ativo junto ao cidadão." },
      { letter: "B", text: "Réu em litisconsórcio passivo com os agentes públicos." },
      { letter: "C", text: "Fiscal da lei (custos legis) — acompanha o processo e pode assumir o polo ativo se o autor desistir." },
      { letter: "D", text: "Autor exclusivo — o cidadão é substituído pelo MP após o ajuizamento." },
      { letter: "E", text: "Assistente técnico do juiz — fornece parecer sobre a legalidade do ato impugnado." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O MP atua na AP como fiscal da lei (custos legis). Se o cidadão desistir da ação ou ficar inerte, o MP pode assumir o polo ativo e prosseguir com a demanda — impedindo que desistências estratégicas frustrem a tutela do patrimônio público.",
    explanationCorrect:
      "O Art. 9° da Lei 4.717/1965 determina que, se o autor desistir da ação ou der causa à extinção por abandono, o juiz intimará o MP e os réus para que, querendo, prossigam na ação. O MP pode, então, assumir o polo ativo para evitar que o ato lesivo não seja anulado.",
    explanationWrong:
      "O MP não é réu nem litisconsorte ativo obrigatório. Ele é interveniente fiscal, com possibilidade de assumir a ação em caso de desistência ou inércia do autor popular.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n========================================================");
  console.log("  SEED R47 — DENSIFICAÇÃO DIR_CONSTITUCIONAL con_dg_*");
  console.log("========================================================\n");

  // Resolve subjectId e topicId a partir do primeiro átomo existente
  const refRows = (await db.execute(sql`
    SELECT "subjectId", "topicId" FROM "Content" WHERE id = 'con_dg_c01' LIMIT 1
  `)) as any[];

  if (!refRows.length) {
    console.error("❌ Átomo con_dg_c01 não encontrado. Execute seed-direito-const-art5-r32.ts primeiro.");
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
  console.error("\n❌ ERRO no seed R47:", err.message ?? err);
  process.exit(1);
});
