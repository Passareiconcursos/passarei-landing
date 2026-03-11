/**
 * db/seed-dense-dco-r14-r46.ts
 * DENSIFICAÇÃO — DIR_CONSTITUCIONAL grupo dc_r14_*
 *
 * Átomos-alvo: 6 átomos, 2 questões existentes cada → +6 por átomo = 36 novas questões
 * dc_r14_c01 — Isonomia e Princípio da Legalidade (I e II)
 * dc_r14_c02 — Liberdades de Pensamento, Expressão e Consciência (IV, VIII e IX)
 * dc_r14_c03 — Inviolabilidade do Domicílio e das Comunicações (XI e XII)
 * dc_r14_c04 — Habeas Corpus e Habeas Data (LXVIII e LXXII)
 * dc_r14_c05 — Mandado de Segurança e Mandado de Injunção (LXIX, LXX, LXXI)
 * dc_r14_c06 — Legalidade Penal, Presunção de Inocência e Silêncio (XXXIX, XL, LVII, LXIII)
 *
 * Execução: npx tsx db/seed-dense-dco-r14-r46.ts
 */

import { db } from "../db/index";
import { sql } from "drizzle-orm";

// ──────────────────────────────────────────────────────────────────────────────
// QUESTÕES
// ──────────────────────────────────────────────────────────────────────────────

const questions = [

  // ── dc_r14_c01: Isonomia e Princípio da Legalidade ───────────────────────

  {
    id: "dc_r14_c01_q01",
    contentId: "dc_r14_c01",
    statement:
      "O Art. 5°, caput, da CF/88 garante os direitos fundamentais a brasileiros e estrangeiros residentes no País. Quanto aos estrangeiros NÃO residentes, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "Não possuem nenhuma proteção jurídica no território brasileiro." },
      { letter: "B", text: "São protegidos pelos mesmos direitos do Art. 5° da CF, por analogia." },
      { letter: "C", text: "Têm proteção via princípios constitucionais e tratados internacionais, embora não sejam destinatários diretos do Art. 5°." },
      { letter: "D", text: "Têm direitos idênticos aos residentes, pois a isonomia é absoluta." },
      { letter: "E", text: "São protegidos apenas pelos direitos sociais do Art. 6° da CF." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O caput do Art. 5° destina-se expressamente a brasileiros e estrangeiros residentes. Estrangeiros não residentes não são destinatários diretos, mas o STF reconhece que a dignidade da pessoa humana e tratados internacionais lhes garantem proteção no território nacional.",
    explanationCorrect:
      "O STF entende que os direitos fundamentais são extensíveis a estrangeiros não residentes por força dos princípios constitucionais (dignidade da pessoa humana, Art. 1°, III) e dos tratados de direitos humanos ratificados pelo Brasil.",
    explanationWrong:
      "A literalidade do Art. 5° restringe-se a brasileiros e estrangeiros residentes, mas isso não significa que não residentes ficam sem qualquer proteção — ela deriva de outras fontes normativas.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c01_q02",
    contentId: "dc_r14_c01",
    statement:
      "O princípio da isonomia comporta a igualdade formal e a igualdade material. A igualdade MATERIAL consiste em:",
    alternatives: [
      { letter: "A", text: "Aplicar a mesma regra jurídica a todas as pessoas, sem qualquer distinção." },
      { letter: "B", text: "Tratar desigualmente os desiguais na medida de suas desigualdades, reduzindo diferenças injustas." },
      { letter: "C", text: "Garantir que todos os cidadãos paguem os mesmos impostos, independentemente de renda." },
      { letter: "D", text: "Proibir qualquer distinção de tratamento entre homens e mulheres em lei." },
      { letter: "E", text: "Assegurar que todos os cargos públicos sejam acessíveis a qualquer pessoa sem requisitos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A igualdade material (substantiva) vai além da igualdade perante a lei: ela exige tratamento diferenciado para grupos em situação desigual, a fim de reduzir desigualdades reais — princípio de Rui Barbosa: 'tratar igualmente os iguais e desigualmente os desiguais'.",
    explanationCorrect:
      "Cotas raciais, progressividade do IR, licença-maternidade mais longa que a paternidade são exemplos de igualdade material: o Estado diferencia para nivelar condições. A igualdade formal trata todos pelo mesmo padrão normativo.",
    explanationWrong:
      "Igualdade formal é a aplicação uniforme da lei. Igualdade material admite — e muitas vezes exige — tratamentos diferenciados justificados pela desigualdade real entre as pessoas ou grupos.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c01_q03",
    contentId: "dc_r14_c01",
    statement:
      "O Art. 5°, II (princípio da legalidade) estabelece: 'ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei.' A expressão 'em virtude de lei' significa que:",
    alternatives: [
      { letter: "A", text: "Somente lei em sentido formal (aprovada pelo Congresso) pode criar obrigações — decretos e portarias nunca podem." },
      { letter: "B", text: "Atos normativos infralegais (decretos, portarias) podem criar obrigações desde que decorram de lei que lhes delegue o poder normativo." },
      { letter: "C", text: "Medidas provisórias não podem criar obrigações por não serem leis em sentido estrito." },
      { letter: "D", text: "O Poder Executivo pode criar obrigações por decreto autônomo, independentemente de lei prévia." },
      { letter: "E", text: "Resoluções de conselhos profissionais não podem impor deveres aos seus membros." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A expressão 'em virtude de lei' é mais ampla que 'por lei'. Ela admite que regulamentos, portarias e outros atos infralegais criem obrigações específicas, desde que existam dentro dos limites e da autorização de lei formal que lhes dê fundamento.",
    explanationCorrect:
      "O regulamento executivo (decreto) pode disciplinar a aplicação de lei sem criar obrigações novas. Já normas de entidades com poder normativo delegado (ANATEL, CVM, conselhos profissionais) podem impor deveres por autorização legislativa expressa.",
    explanationWrong:
      "Medidas provisórias têm força de lei (Art. 62 da CF) e podem criar obrigações. O decreto autônomo é exceção restrita (Art. 84, VI) — em regra, o Executivo não cria obrigações novas por decreto sem base legal.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c01_q04",
    contentId: "dc_r14_c01",
    statement:
      "Quanto à igualdade entre homens e mulheres (Art. 5°, I), o STF admite como constitucional:",
    alternatives: [
      { letter: "A", text: "Qualquer distinção de tratamento entre gêneros, desde que prevista em lei." },
      { letter: "B", text: "Apenas distinções de tratamento expressamente previstas na própria Constituição Federal." },
      { letter: "C", text: "Distinções justificadas por critérios biológicos ou sociais razoáveis, mesmo que não previstas expressamente na CF." },
      { letter: "D", text: "Proibição absoluta de qualquer diferenciação de tratamento, pois a isonomia é regra sem exceção." },
      { letter: "E", text: "Diferenças apenas no âmbito do direito privado (família, herança), não no direito público." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O STF adota o critério da razoabilidade: distinções de gênero são constitucionais quando há fundamento legítimo (biológico, histórico ou social) que justifique o tratamento diferenciado. Exemplo: prisão especial para mulheres, reserva de vagas em concursos.",
    explanationCorrect:
      "A igualdade 'nos termos desta Constituição' (Art. 5°, I) abre espaço para distinções justificadas. O STF valida diferenças quando há proporcionalidade: a causa da distinção deve ser razoável e o tratamento diferenciado, adequado ao objetivo.",
    explanationWrong:
      "Não existe proibição absoluta de qualquer distinção de gênero — a própria CF diferencia (licença-maternidade × paternidade, aposentadoria com critérios distintos). O critério é a razoabilidade da diferenciação.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c01_q05",
    contentId: "dc_r14_c01",
    statement:
      "Para os concursos da área de segurança pública, o STF admite a previsão de altura mínima no edital. O fundamento jurídico para essa admissibilidade é:",
    alternatives: [
      { letter: "A", text: "A exceção expressa ao princípio da isonomia prevista no Art. 5°, I, para cargos de segurança." },
      { letter: "B", text: "O princípio da razoabilidade/proporcionalidade: o requisito deve ser justificado pela natureza das atribuições do cargo." },
      { letter: "C", text: "A competência discricionária da banca organizadora para definir qualquer critério de seleção." },
      { letter: "D", text: "A previsão em lei específica de cada cargo, que afasta automaticamente a isonomia." },
      { letter: "E", text: "O direito da Administração Pública de restringir o acesso a cargos sem necessidade de justificativa." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O STF (súmula 552 e precedentes) entende que exigências físicas em concursos para cargos de segurança são constitucionais quando há proporcionalidade: o requisito deve ser necessário para o desempenho das funções típicas do cargo e estar previsto em lei.",
    explanationCorrect:
      "O fundamento é a proporcionalidade: altura mínima para policial está ligada ao enfrentamento físico inerente à função. Sem esse vínculo com as atribuições, qualquer requisito discriminatório violaria a isonomia.",
    explanationWrong:
      "Não há exceção expressa no Art. 5°, I para cargos de segurança. A banca não tem discricionariedade irrestrita. O requisito precisa de base legal E justificativa funcional — os dois elementos são cumulativos.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c01_q06",
    contentId: "dc_r14_c01",
    statement:
      "Julgue a seguinte afirmação: 'O princípio da legalidade, previsto no Art. 5°, II da CF, aplica-se com maior rigor à Administração Pública do que ao particular, pois o administrador só pode fazer o que a lei autoriza, enquanto o particular pode fazer tudo que a lei não proíbe.'",
    alternatives: [
      { letter: "A", text: "Errado — tanto o particular quanto a Administração só podem agir quando autorizados por lei." },
      { letter: "B", text: "Errado — a Administração tem ampla discricionariedade, podendo agir sem lei em casos urgentes." },
      { letter: "C", text: "Certo — a legalidade administrativa (Art. 37, caput) é mais restritiva que a legalidade geral do Art. 5°, II." },
      { letter: "D", text: "Certo — mas apenas para atos administrativos que afetem direitos individuais." },
      { letter: "E", text: "Errado — o particular também só pode fazer o que a lei autoriza, por força da legalidade constitucional." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "A afirmação está correta. O Art. 5°, II consagra a legalidade geral: o particular pode fazer tudo que a lei não proíbe. Já o Art. 37 consagra a legalidade administrativa: o administrador só pode fazer o que a lei autoriza — campo de atuação mais restrito.",
    explanationCorrect:
      "São dois planos do princípio da legalidade: para o particular = liberdade residual (pode tudo exceto o proibido); para a Administração = vinculação positiva (só pode o que a lei expressamente permite). Ambos derivam do Estado de Direito.",
    explanationWrong:
      "O particular não está sujeito à legalidade administrativa — ele tem liberdade residual. A Administração, ao contrário, não possui esfera de liberdade autônoma: toda ação administrativa exige fundamento legal.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── dc_r14_c02: Liberdades de Pensamento, Expressão e Consciência ─────────

  {
    id: "dc_r14_c02_q01",
    contentId: "dc_r14_c02",
    statement:
      "A liberdade de consciência e de crença (Art. 5°, VI, CF) e a escusa de consciência (Art. 5°, VIII, CF) são direitos correlatos. A escusa de consciência permite que alguém:",
    alternatives: [
      { letter: "A", text: "Se recuse a cumprir qualquer obrigação legal invocando crença religiosa, sem qualquer consequência." },
      { letter: "B", text: "Descumpra obrigação legal a todos imposta, desde que cumpra prestação alternativa fixada em lei; caso contrário, perde direitos." },
      { letter: "C", text: "Se recuse ao serviço militar sem qualquer alternativa, pois a crença é direito absoluto." },
      { letter: "D", text: "Tenha isenção de tributos se estes contrariarem sua crença religiosa." },
      { letter: "E", text: "Recuse-se a votar sem perda de direitos políticos, por convicção filosófica." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, VIII é claro: quem invocar crença para descumprir obrigação legal a todos imposta deve cumprir prestação alternativa prevista em lei. Se recusar também a alternativa, perderá direitos — como os direitos políticos.",
    explanationCorrect:
      "O sistema é: crença/convicção → direito de recusar a obrigação universal → mas obrigação de cumprir alternativa legal. Recusa à alternativa também → perda de direitos (ex.: não votar e não fazer serviço alternativo = direitos políticos suspensos).",
    explanationWrong:
      "A escusa de consciência não é direito absoluto. Ela exige contrapartida (prestação alternativa). A crença não isenta de tributos nem garante voto facultativo — são outros institutos jurídicos.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c02_q02",
    contentId: "dc_r14_c02",
    statement:
      "A liberdade de expressão artística e intelectual (Art. 5°, IX) veda a censura. O STF entende que publicações com conteúdo ofensivo a grupos étnicos ou religiosos:",
    alternatives: [
      { letter: "A", text: "São protegidas absolutamente pela liberdade de expressão, sem possibilidade de responsabilização." },
      { letter: "B", text: "Podem ser proibidas preventivamente pelo Judiciário quando ofenderem a dignidade de grupos." },
      { letter: "C", text: "Não são cobertas pela liberdade de expressão quando configuram discurso de ódio, podendo gerar responsabilização penal e civil." },
      { letter: "D", text: "São livres pois a Constituição não prevê limites à liberdade de expressão artística." },
      { letter: "E", text: "Somente podem ser censuradas por lei aprovada pelo Congresso Nacional, não por decisão judicial." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O STF (ADPF 130, HC 82.424 — caso Ellwanger) reconhece que o discurso de ódio (hate speech) não está protegido pela liberdade de expressão quando viola a dignidade humana de grupos por raça, etnia, religião etc. Cabe responsabilização penal (racismo) e civil.",
    explanationCorrect:
      "A liberdade de expressão não é absoluta — colide com a dignidade da pessoa humana, a honra e a igualdade. O STF distingue: crítica, sátira e opinião (protegidas) × discurso de ódio que incita discriminação ou violência (não protegido).",
    explanationWrong:
      "A vedação à censura prévia não impede responsabilização posterior pelo conteúdo abusivo. O Judiciário pode condenar criminalmente e civilmente o autor — o que não pode é proibir previamente a publicação (exceto em casos extremos e urgentes).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c02_q03",
    contentId: "dc_r14_c02",
    statement:
      "A liberdade de manifestação do pensamento (Art. 5°, IV) veda o anonimato. Uma denúncia anônima recebida pela polícia:",
    alternatives: [
      { letter: "A", text: "É absolutamente nula e não pode gerar qualquer ato investigatório." },
      { letter: "B", text: "Pode servir como ponto de partida para investigações, desde que não seja o único fundamento para atos invasivos de direitos." },
      { letter: "C", text: "Tem o mesmo valor probatório de uma denúncia identificada." },
      { letter: "D", text: "Gera responsabilidade criminal automática do denunciante anônimo." },
      { letter: "E", text: "É válida apenas para crimes hediondos, sendo nula para crimes comuns." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O STF e o STJ admitem que denúncias anônimas (notitia criminis inqualificada) sirvam como ponto de partida para investigação — a polícia verifica a plausibilidade antes de agir. O que é vedado é a prisão, busca ou outra medida invasiva baseada exclusivamente na denúncia anônima.",
    explanationCorrect:
      "A denúncia anônima não tem valor probatório direto, mas pode deflagrar investigação. A polícia apura preliminarmente os fatos; se confirmados por outros meios, pode representar por mandado ou agir. A denúncia anônima sozinha não justifica medidas restritivas de direitos.",
    explanationWrong:
      "Considerar a denúncia anônima absolutamente nula inviabilizaria a investigação de muitos crimes. O sistema admite seu uso como notícia inicial, com a ressalva de que atos invasivos precisam de corroboração independente.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c02_q04",
    contentId: "dc_r14_c02",
    statement:
      "A liberdade de exercício de qualquer trabalho, ofício ou profissão (Art. 5°, XIII, CF) é condicionada às qualificações profissionais que a lei estabelecer. Isso significa que:",
    alternatives: [
      { letter: "A", text: "O Estado não pode regulamentar profissões — qualquer pessoa pode exercer qualquer atividade sem restrição." },
      { letter: "B", text: "A lei pode estabelecer requisitos de habilitação para o exercício de profissões, desde que proporcionais e justificados pela proteção de bens jurídicos relevantes." },
      { letter: "C", text: "Apenas profissões de saúde podem ser regulamentadas por lei; as demais são de livre exercício absoluto." },
      { letter: "D", text: "A regulamentação de profissões é inconstitucional, pois restringe a liberdade fundamental." },
      { letter: "E", text: "O requisito de diploma para exercer medicina é inconstitucional por violar o Art. 5°, XIII." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, XIII consagra liberdade de profissão com reserva legal: a lei pode impor requisitos de habilitação (diplomas, registros em conselhos, aprovação em exame de ordem). O STF valida as restrições que sejam proporcionais e protejam bens jurídicos legítimos (saúde, segurança).",
    explanationCorrect:
      "O Exame de Ordem da OAB, por exemplo, foi declarado constitucional pelo STF (RE 603.583): a restrição ao exercício da advocacia é proporcional à complexidade da função e à proteção do jurisdicionado. O mesmo raciocínio vale para CRM, CREA etc.",
    explanationWrong:
      "A exigência de diploma para medicina é plenamente constitucional — é justamente o tipo de 'qualificação profissional' que o Art. 5°, XIII reserva à lei. Sem esse controle, qualquer pessoa poderia se apresentar como médico.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c02_q05",
    contentId: "dc_r14_c02",
    statement:
      "Sobre a liberdade de reunião pacífica (Art. 5°, XVI, CF), é correto afirmar:",
    alternatives: [
      { letter: "A", text: "Depende de autorização prévia do poder público para ser realizada." },
      { letter: "B", text: "É assegurada independentemente de autorização, desde que não frustre outra reunião no mesmo local e seja pacífica e sem armas, mediante prévio aviso à autoridade." },
      { letter: "C", text: "Somente pode ocorrer em locais públicos fechados (praças cobertas, ginásios), não em vias públicas." },
      { letter: "D", text: "Pode ser dissolvida pelo poder público sempre que causar transtornos ao trânsito." },
      { letter: "E", text: "Requer autorização judicial quando envolver mais de 500 pessoas." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, XVI exige apenas prévio aviso (não autorização) à autoridade competente. A reunião deve ser pacífica, sem armas, e não pode frustrar outra reunião anteriormente convocada para o mesmo local e hora.",
    explanationCorrect:
      "Reunião não precisa de autorização — basta aviso prévio para que a autoridade possa garantir a ordem e evitar conflito com outras reuniões. A polícia não pode dissolver reunião pacífica; pode intervir se houver violência ou armas.",
    explanationWrong:
      "Transtorno ao trânsito não é fundamento suficiente para dissolução — manifestações em vias públicas são protegidas. O poder público deve adaptar a ordem pública às manifestações, não o contrário.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c02_q06",
    contentId: "dc_r14_c02",
    statement:
      "A liberdade de imprensa, decorrente do Art. 5°, IV, IX e XIV da CF, foi objeto do julgamento da ADPF 130 (STF, 2009), que declarou a Lei de Imprensa (Lei 5.250/1967) incompatível com a CF/88. A principal razão foi:",
    alternatives: [
      { letter: "A", text: "A Lei de Imprensa estabelecia prazos prescricionais muito curtos para ações de indenização." },
      { letter: "B", text: "A lei previu mecanismos de controle prévio do conteúdo jornalístico incompatíveis com a vedação à censura." },
      { letter: "C", text: "A lei proibia a crítica a agentes públicos, violando a liberdade de expressão política." },
      { letter: "D", text: "A lei foi criada durante a ditadura militar, tornando-a automaticamente incompatível com a CF/88." },
      { letter: "E", text: "A lei não previa o direito de resposta, exigido pela CF/88." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O STF (ADPF 130) considerou que a Lei de Imprensa, criada no regime militar, continha dispositivos de controle, restrição e responsabilização incompatíveis com a plena liberdade de imprensa garantida pela CF/88, especialmente a vedação à censura prévia e as liberdades de expressão e informação.",
    explanationCorrect:
      "A Lei 5.250/1967 previa hipóteses de restrição à publicação, punições específicas e mecanismos que funcionavam como censura indireta. O STF, por maioria, declarou toda a lei não recepcionada pela CF/88, relegando a responsabilização da imprensa ao Código Civil e Penal.",
    explanationWrong:
      "O simples fato de ter sido criada na ditadura não torna a lei automaticamente inválida — o critério é a compatibilidade material com a CF/88. O STF analisou o conteúdo da lei e verificou a incompatibilidade substantiva.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── dc_r14_c03: Inviolabilidade do Domicílio e das Comunicações ───────────

  {
    id: "dc_r14_c03_q01",
    contentId: "dc_r14_c03",
    statement:
      "A Constituição permite o ingresso na residência sem consentimento 'durante o dia, por determinação judicial'. O termo 'dia', para fins do Art. 5°, XI, CF, é definido pelo STF como:",
    alternatives: [
      { letter: "A", text: "Das 6h às 18h, por analogia com a legislação processual penal." },
      { letter: "B", text: "O período de claridade natural (nascer ao pôr do sol), variando conforme a estação e a região." },
      { letter: "C", text: "Das 8h às 20h, por entendimento sumulado do STF." },
      { letter: "D", text: "Qualquer período entre o amanhecer e a meia-noite." },
      { letter: "E", text: "Das 6h às 22h, seguindo o critério do silêncio noturno." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "O STF fixou (ARE 1.042.075 — Tema 280 da repercussão geral) que o conceito de 'dia' para o Art. 5°, XI é o período das 6h às 18h. Mandados cumpridos fora desse horário, sem flagrante ou urgência, violam a inviolabilidade domiciliar.",
    explanationCorrect:
      "A tese fixada pelo STF é objetiva: 'dia' = 6h às 18h. Cumprimento de mandado após as 18h sem situação de flagrante ou urgência constitui prova ilícita, podendo gerar nulidade do ato e responsabilização do agente.",
    explanationWrong:
      "O critério solar (nascer/pôr do sol) gera insegurança jurídica por variar por região e estação. O STF optou pelo critério fixo das 6h às 18h para dar previsibilidade ao direito fundamental.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c03_q02",
    contentId: "dc_r14_c03",
    statement:
      "Uma operação policial ingressa em residência às 19h para cumprir mandado de busca e apreensão em investigação de tráfico de drogas. Não havia flagrante em curso. Esse ingresso é:",
    alternatives: [
      { letter: "A", text: "Válido, pois o mandado judicial autoriza o ingresso a qualquer hora." },
      { letter: "B", text: "Válido, pois crimes de tráfico de drogas justificam exceção ao horário diurno." },
      { letter: "C", text: "Inválido, pois 19h está fora do período diurno (6h–18h) e não havia flagrante." },
      { letter: "D", text: "Válido, pois o horário noturno só é vedado para residências de pessoas físicas, não de investigados por crimes graves." },
      { letter: "E", text: "Inválido apenas se os moradores formalizarem reclamação posterior." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Segundo a tese do STF (Tema 280), o cumprimento de mandado judicial de busca e apreensão após as 18h, sem situação de flagrante delito, desastre ou socorro, viola o Art. 5°, XI. A gravidade do crime investigado não é exceção prevista na Constituição.",
    explanationCorrect:
      "O mandado judicial autoriza o ingresso diurno (6h–18h). Para uso noturno, seria necessária uma das exceções constitucionais: flagrante em curso, desastre ou necessidade de socorro. Tráfico de drogas, por si só, não é exceção.",
    explanationWrong:
      "Não existe exceção constitucional baseada na gravidade do crime para o ingresso noturno com mandado. A CF não distingue crimes leves de graves nesse contexto — o horário e a natureza da situação são os critérios.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c03_q03",
    contentId: "dc_r14_c03",
    statement:
      "A interceptação de comunicações telefônicas exige, além de ordem judicial, que a investigação seja de crime punido com reclusão (não detenção). Esse requisito decorre:",
    alternatives: [
      { letter: "A", text: "Diretamente do Art. 5°, XII da Constituição Federal." },
      { letter: "B", text: "Da Lei 9.296/1996, que regulamentou a interceptação telefônica." },
      { letter: "C", text: "De súmula vinculante do STF editada para proteger os investigados." },
      { letter: "D", text: "Do Código de Processo Penal, que lista os crimes autorizadores." },
      { letter: "E", text: "De decreto presidencial regulamentador do Art. 5°, XII da CF." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A CF (Art. 5°, XII) apenas prevê que a interceptação telefônica depende de ordem judicial 'na forma que a lei estabelecer'. A Lei 9.296/1996 regulamentou os requisitos: indícios razoáveis de autoria, impossibilidade de produção da prova por outro meio, e crime punido com reclusão.",
    explanationCorrect:
      "O Art. 2° da Lei 9.296/1996 proíbe a interceptação quando não houver indícios de autoria ou participação, quando a prova puder ser feita por outro meio, ou quando o fato investigado for punido com detenção (somente reclusão autoriza).",
    explanationWrong:
      "A CF delega à lei os requisitos procedimentais. O Código de Processo Penal não trata especificamente de interceptação telefônica — essa é matéria da Lei 9.296/1996. Não existe súmula vinculante nem decreto sobre isso.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c03_q04",
    contentId: "dc_r14_c03",
    statement:
      "O consentimento do morador para ingresso policial sem mandado deve ser:",
    alternatives: [
      { letter: "A", text: "Expresso por escrito, para ter validade jurídica." },
      { letter: "B", text: "Livre, informado e inequívoco — o morador deve saber que pode recusar a entrada." },
      { letter: "C", text: "Tácito — a ausência de resistência física equivale a consentimento." },
      { letter: "D", text: "Dispensável quando há suspeita de crime grave no interior da residência." },
      { letter: "E", text: "Confirmado por testemunha policial para ser válido." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O STF (RE 603.616 — Tema 280) fixou que o consentimento do morador, para ser válido como autorização de ingresso policial, deve ser livre (sem coação), informado (o morador sabe que pode recusar) e inequívoco (não pode ser presumido da passividade).",
    explanationCorrect:
      "A validade do consentimento é aferida pelas circunstâncias: policiais armados batendo à porta em grupo podem criar coação implícita. O STF exige que o morador tenha efetiva liberdade de recusar sem sofrer consequência imediata.",
    explanationWrong:
      "Consentimento tácito (silêncio ou passividade diante de policiais) não é suficiente. A suspeita de crime grave também não dispensa o consentimento ou mandado — não existe esse fundamento constitucional.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c03_q05",
    contentId: "dc_r14_c03",
    statement:
      "Sobre a proteção constitucional das comunicações, é correto afirmar que o sigilo das comunicações de dados (e-mails, mensagens de aplicativos) é:",
    alternatives: [
      { letter: "A", text: "Absoluto — nem ordem judicial pode determinara quebra desse sigilo." },
      { letter: "B", text: "Menor que o das comunicações telefônicas, pois não há previsão expressa de reserva de jurisdição para dados." },
      { letter: "C", text: "Equivalente ao das comunicações telefônicas — exige ordem judicial, e CPI pode acessar registros (não interceptar em tempo real)." },
      { letter: "D", text: "Protegido apenas por legislação infraconstitucional (LGPD), sem base constitucional direta." },
      { letter: "E", text: "Não protegido quando os dados estiverem armazenados em servidores no exterior." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O STF equipara o sigilo de dados ao sigilo telefônico: a interceptação em tempo real exige ordem judicial. Quanto ao acesso a registros armazenados (e-mails já recebidos, histórico de mensagens), CPI pode ordenar a quebra por maioria absoluta, e juiz pode determinar mediante decisão fundamentada.",
    explanationCorrect:
      "A distinção é: interceptação (captação em tempo real) → exclusivamente por ordem judicial. Acesso a registros (histórico) → pode ser determinado por juiz ou CPI. Essa distinção aplica-se a dados, telefone e comunicações telegráficas.",
    explanationWrong:
      "Dados em servidores no exterior têm proteção constitucional — a localização do servidor não afasta os direitos do titular. A proteção de dados tem base constitucional no Art. 5°, XII e, desde a EC 115/2022, no Art. 5°, LXXIX.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c03_q06",
    contentId: "dc_r14_c03",
    statement:
      "A EC 115/2022 acrescentou o inciso LXXIX ao Art. 5° da CF, estabelecendo que:",
    alternatives: [
      { letter: "A", text: "É assegurado, nos termos da lei, o direito à proteção de dados pessoais, inclusive nos meios digitais." },
      { letter: "B", text: "Fica vedada a coleta de dados pessoais por empresas privadas sem autorização judicial." },
      { letter: "C", text: "O sigilo de dados é absoluto, não podendo ser quebrado nem por ordem judicial." },
      { letter: "D", text: "A proteção de dados pessoais é exclusiva do setor público, não abrangendo empresas privadas." },
      { letter: "E", text: "Qualquer tratamento de dados pessoais por terceiros depende de lei complementar." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "A EC 115/2022 inseriu o inciso LXXIX no Art. 5°: 'é assegurado, nos termos da lei, o direito à proteção de dados pessoais, inclusive nos meios digitais.' Trata-se de novo direito fundamental, consolidando constitucionalmente o que a LGPD (Lei 13.709/2018) já protegia em nível infraconstitucional.",
    explanationCorrect:
      "A EC 115/2022 elevou a proteção de dados ao status de direito fundamental expresso. A expressão 'nos termos da lei' indica que a regulamentação é infraconstitucional (LGPD), mas o direito em si tem assento constitucional.",
    explanationWrong:
      "O direito à proteção de dados não é absoluto — a LGPD prevê diversas hipóteses de tratamento lícito sem consentimento (legítimo interesse, cumprimento de obrigação legal, etc.). A vedação absoluta e a exigência de lei complementar não constam na EC 115/2022.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── dc_r14_c04: Habeas Corpus e Habeas Data ───────────────────────────────

  {
    id: "dc_r14_c04_q01",
    contentId: "dc_r14_c04",
    statement:
      "O HC preventivo (salvo-conduto) é cabível quando:",
    alternatives: [
      { letter: "A", text: "O paciente já está preso e deseja contestar a legalidade da prisão." },
      { letter: "B", text: "Há ameaça concreta e iminente de prisão ou coação ilegal à liberdade de locomoção." },
      { letter: "C", text: "O paciente foi solto e deseja impedir nova prisão no mesmo processo." },
      { letter: "D", text: "A liberdade de locomoção foi restringida indiretamente (ex.: proibição de deixar o país)." },
      { letter: "E", text: "O salvo-conduto é cabível apenas quando o risco de prisão for declarado por autoridade policial." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O HC preventivo (salvo-conduto) protege contra ameaça de violência ou coação iminente à liberdade de locomoção — antes de ocorrer a prisão. Já o HC liberatório é impetrado quando a prisão já ocorreu.",
    explanationCorrect:
      "Quando há ameaça concreta (ex.: delegado anuncia que prender alguém sem mandado, ou há mandado de prisão ilegal prestes a ser cumprido), cabe o salvo-conduto. O tribunal expede ordem para que a autoridade não efetue a prisão.",
    explanationWrong:
      "O HC cabível para pessoa já presa é o liberatório. A proibição de sair do país restringe a locomoção, mas em grau que o STF analisa caso a caso — o HC clássico tutela liberdade física de ir e vir, não apenas restrições de passaporte.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c04_q02",
    contentId: "dc_r14_c04",
    statement:
      "O HC não é cabível para proteger direitos outros que não a liberdade de locomoção. Assinale a alternativa em que o HC NÃO é o remédio adequado:",
    alternatives: [
      { letter: "A", text: "Trancamento de inquérito policial por falta de justa causa." },
      { letter: "B", text: "Relaxamento de prisão em flagrante ilegal." },
      { letter: "C", text: "Anulação de ato administrativo que cassou aposentadoria de servidor." },
      { letter: "D", text: "Concessão de liberdade provisória a preso preventivo." },
      { letter: "E", text: "Reconhecimento de prescrição penal para extinguir o processo." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "A cassação de aposentadoria não afeta a liberdade de locomoção — trata-se de direito patrimonial/funcional. O remédio cabível seria o Mandado de Segurança (direito líquido e certo violado por ato de autoridade). O HC tutela exclusivamente a liberdade de ir, ficar e vir.",
    explanationCorrect:
      "O STF admite HC para trancamento de inquérito (impede ameaça futura de prisão), relaxamento de prisão ilegal, liberdade provisória e extinção da punibilidade por prescrição (todos ligados à liberdade). Ato administrativo patrimonial não tem essa ligação.",
    explanationWrong:
      "O HC é amplo dentro da esfera de proteção à liberdade de locomoção — pode alcançar atos que, indiretamente, possam resultar em privação de liberdade (inquéritos, processos penais em andamento). Mas direitos funcionais e patrimoniais ficam fora.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c04_q03",
    contentId: "dc_r14_c04",
    statement:
      "O Habeas Data (Art. 5°, LXXII) exige, como condição de admissibilidade, o prévio requerimento administrativo negado ou não respondido. Isso significa que:",
    alternatives: [
      { letter: "A", text: "O HD é subsidiário: só cabe após esgotamento de todas as vias administrativas possíveis." },
      { letter: "B", text: "O titular deve primeiro solicitar as informações ao detentor dos dados; o HD só cabe se houver recusa ou omissão." },
      { letter: "C", text: "O HD pode ser impetrado diretamente sem requerimento administrativo, pois a CF não prevê esse requisito." },
      { letter: "D", text: "Basta a suspeita de que o órgão possui dados indevidos, sem necessidade de requerimento prévio." },
      { letter: "E", text: "O requerimento prévio é obrigatório apenas quando os dados estão em órgãos federais." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O STF e o STJ consolidaram que o HD pressupõe prévio requerimento administrativo ao detentor dos dados. Sem ele (ou sem prova da recusa/omissão), falta interesse de agir — condição da ação. O HD não é ação para obter dados que nunca foram solicitados.",
    explanationCorrect:
      "O HD exige: (1) requerimento administrativo ao órgão; (2) recusa expressa OU omissão por prazo razoável. Comprovados esses elementos, o titular ingressa com HD perante o juízo competente. A prova é documental (protocolo do requerimento).",
    explanationWrong:
      "O HD não exige esgotamento de todas as vias administrativas — apenas a tentativa direta de obter os dados. Basta uma negativa ou silêncio para que o interesse de agir esteja configurado.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c04_q04",
    contentId: "dc_r14_c04",
    statement:
      "O HD permite ao interessado não apenas obter seus dados, mas também:",
    alternatives: [
      { letter: "A", text: "Excluir dados de terceiros que o prejudiquem nos cadastros governamentais." },
      { letter: "B", text: "Retificar dados incorretos e incluir anotação sobre dado que seja objeto de ação judicial." },
      { letter: "C", text: "Proibir definitivamente que o órgão colete novos dados sobre o requerente." },
      { letter: "D", text: "Obter indenização automática pelos danos causados pelos dados incorretos." },
      { letter: "E", text: "Acessar dados de outros cidadãos relacionados a processos que envolvem o requerente." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, LXXII prevê dois usos do HD: (a) conhecer informações sobre si mesmo + retificar dados; (b) anotar nos registros que dado é objeto de ação judicial, administrativa ou policial. Essa segunda finalidade é uma anotação de contestação, não exclusão.",
    explanationCorrect:
      "O HD serve para: (1) conhecer seus dados + corrigi-los se errados; (2) inserir nota nos registros indicando que os dados estão sendo discutidos judicialmente. Não serve para excluir dados de terceiros nem obter indenização automática.",
    explanationWrong:
      "O HD é personalíssimo — só acessa dados do próprio titular. Não há exclusão preventiva de coleta futura nem indenização automática pelo HD (a indenização exigiria ação própria por responsabilidade civil).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c04_q05",
    contentId: "dc_r14_c04",
    statement:
      "O HC pode ser impetrado contra ato de autoridade coatora de qual natureza?",
    alternatives: [
      { letter: "A", text: "Apenas autoridades públicas do Poder Executivo (polícia, Ministério Público)." },
      { letter: "B", text: "Apenas autoridades judiciais, pois são as únicas que podem decretar prisões." },
      { letter: "C", text: "Qualquer autoridade pública ou particular que exerça poder de coação sobre a liberdade de locomoção." },
      { letter: "D", text: "Apenas autoridades federais — o HC estadual é julgado pelo TJ, não pelo STF." },
      { letter: "E", text: "Apenas o delegado de polícia, pois é ele quem efetua prisões em flagrante." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O HC pode ser impetrado contra qualquer pessoa (pública ou privada) que esteja ilegalmente coagindo a liberdade de locomoção. Ex.: diretor de hospital psiquiátrico que priva paciente de ir e vir sem justificativa legal.",
    explanationCorrect:
      "O Art. 5°, LXVIII não restringe a autoridade coatora a agentes públicos. Particulares também podem ser coatores (internação forçada ilegal, cárcere privado por entidade privada). O paciente pode ser qualquer pessoa com liberdade de locomoção ameaçada.",
    explanationWrong:
      "Juízes decretam prisões cautelares, mas a coação pode vir de delegados, diretores de prisão, autoridades administrativas e até particulares. O HC alcança todas essas hipóteses.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c04_q06",
    contentId: "dc_r14_c04",
    statement:
      "Os dados protegidos pelo Habeas Data incluem registros de entidades 'de caráter público'. Esse conceito abrange:",
    alternatives: [
      { letter: "A", text: "Apenas órgãos da Administração Pública direta (União, Estados, Municípios)." },
      { letter: "B", text: "Apenas bancos de dados governamentais federais (SESP, Receita Federal, INSS)." },
      { letter: "C", text: "Entidades privadas que, por sua natureza ou atividade, coletam e mantêm dados de interesse público ou de acesso coletivo (ex.: SPC, Serasa)." },
      { letter: "D", text: "Apenas bancos de dados criados por lei federal." },
      { letter: "E", text: "Entidades internacionais que mantenham dados de brasileiros." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O STF entende que 'entidade de caráter público' abrange não só órgãos governamentais, mas também entidades privadas que mantêm cadastros de acesso coletivo ou de interesse público — como SPC e Serasa, que mantêm dados de inadimplentes acessíveis por terceiros.",
    explanationCorrect:
      "O HD alcança bancos de dados privados de caráter público: SPC, Serasa e similares coletam e disseminam dados que afetam o crédito e a vida dos cidadãos. Por isso, o titular pode usar HD para retificar dados incorretos nesses cadastros.",
    explanationWrong:
      "A restrição ao HD apenas a órgãos governamentais tornaria inútil a proteção em relação aos principais registros negativos que afetam os cidadãos (cadastros de inadimplência privados). O STF ampliou o conceito para alcançar essa realidade.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── dc_r14_c05: Mandado de Segurança e Mandado de Injunção ───────────────

  {
    id: "dc_r14_c05_q01",
    contentId: "dc_r14_c05",
    statement:
      "O prazo decadencial para impetrar Mandado de Segurança é de 120 dias contados da ciência do ato impugnado. Sobre esse prazo:",
    alternatives: [
      { letter: "A", text: "É prazo prescricional, podendo ser suspenso ou interrompido por causas legais." },
      { letter: "B", text: "É prazo decadencial fixado pela Lei 12.016/2009, não admitindo suspensão ou interrupção." },
      { letter: "C", text: "Aplica-se apenas ao MS individual — o MS coletivo não tem prazo." },
      { letter: "D", text: "Está previsto na Constituição Federal, que veda qualquer flexibilização." },
      { letter: "E", text: "Conta-se a partir da publicação da lei que originou o direito líquido e certo." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O prazo de 120 dias é decadencial (Art. 23 da Lei 12.016/2009) e, por ser de decadência, não se suspende nem se interrompe. A CF/88 não prevê prazo — ele foi fixado pelo legislador infraconstitucional. Esgotado o prazo, extingue-se o direito à impetração do MS (não o direito material).",
    explanationCorrect:
      "A decadência opera de pleno direito: 120 dias depois da ciência do ato, o MS não mais pode ser impetrado. O direito material subjacente pode ser discutido por outras vias (ação ordinária), mas o MS fica vedado.",
    explanationWrong:
      "Prazo prescricional admite interrupção e suspensão. Prazo decadencial, não. O prazo de 120 dias é decadencial — não há causas que o suspendam ou interrompam no MS.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c05_q02",
    contentId: "dc_r14_c05",
    statement:
      "O MS não é cabível contra lei em tese (Súmula 266/STF). Isso significa que:",
    alternatives: [
      { letter: "A", text: "Leis inconstitucionais não podem ser impugnadas por MS em nenhuma hipótese." },
      { letter: "B", text: "O MS pressupõe ato concreto de aplicação da lei que afete direito líquido e certo do impetrante — lei abstrata, ainda não aplicada, não gera MS." },
      { letter: "C", text: "O MS somente cabe contra atos administrativos, nunca contra atos legislativos." },
      { letter: "D", text: "A lei em tese deve ser impugnada por Ação Popular, não por MS." },
      { letter: "E", text: "Somente o STF pode declarar a inconstitucionalidade de lei, impedindo o uso de MS para esse fim." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A Súmula 266 do STF veda o MS contra lei em tese pois, nesse caso, não há ato concreto que afete diretamente o impetrante. O MS pressupõe um ato específico de autoridade — quando a lei é aplicada ao caso concreto, aí sim cabe MS contra o ato de aplicação.",
    explanationCorrect:
      "Exemplo: uma lei majorando imposto, por si só, não gera MS. Quando o fisco emite lançamento tributário com base nessa lei, aí há ato concreto — e o MS pode ser impetrado contra o lançamento, discutindo incidentalmente a inconstitucionalidade da lei.",
    explanationWrong:
      "MS pode ser impetrado contra atos legislativos concretos (ex.: lei de efeitos concretos que atinge diretamente o impetrante). A vedação é à lei abstrata e geral ainda não aplicada ao caso.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c05_q03",
    contentId: "dc_r14_c05",
    statement:
      "O Mandado de Injunção (Art. 5°, LXXI) difere da Ação Direta de Inconstitucionalidade por Omissão (ADO) porque:",
    alternatives: [
      { letter: "A", text: "O MI é ação coletiva; a ADO é ação individual." },
      { letter: "B", text: "No MI, qualquer pessoa com interesse pode impetrar; na ADO, apenas os legitimados do Art. 103 da CF." },
      { letter: "C", text: "O MI produz efeitos somente para o STF; a ADO vincula todos os tribunais." },
      { letter: "D", text: "O MI é julgado pelo STJ; a ADO é julgada pelo STF." },
      { letter: "E", text: "O MI tem prazo de 60 dias para o legislador agir; a ADO não tem prazo." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O MI tem legitimidade ativa ampla (qualquer pessoa cujo direito constitucional seja inviável por omissão normativa). A ADO tem rol restrito de legitimados (Art. 103: Presidente da República, Mesas do Congresso, PGR, partidos, confederações sindicais etc.).",
    explanationCorrect:
      "Outra diferença: o MI é instrumento de tutela individual/coletiva de direitos concretos; a ADO é controle abstrato de constitucionalidade. O MI é julgado pelo STF quando se tratar de omissão da autoridade federal, e pelos TJs/STJ nos demais casos.",
    explanationWrong:
      "Ambos podem ser julgados pelo STF, dependendo da autoridade omissiva. O MI não tem prazo fixo para o legislador agir — a Lei 13.300/2016 prevê que o STF pode fixar prazo razoável, mas não há prazo constitucional expresso.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c05_q04",
    contentId: "dc_r14_c05",
    statement:
      "Em relação ao MS coletivo (Art. 5°, LXX), as entidades legitimadas para impetrar defendem:",
    alternatives: [
      { letter: "A", text: "Direitos próprios da entidade, como pessoa jurídica." },
      { letter: "B", text: "Direitos de seus membros ou associados (substituição processual), não necessariamente de toda a coletividade." },
      { letter: "C", text: "Qualquer interesse difuso da sociedade, mesmo sem relação com seus filiados." },
      { letter: "D", text: "Apenas os direitos previstos no estatuto da entidade." },
      { letter: "E", text: "Direitos apenas de seus membros individualizados que deram autorização expressa." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "No MS coletivo, a entidade atua como substituta processual: impugna ato que afeta direitos dos seus membros ou associados, sem necessidade de autorização individual de cada um. A jurisprudência do STF é pacífica quanto à desnecessidade de autorização expressa dos filiados.",
    explanationCorrect:
      "O MS coletivo tutela direitos líquidos e certos dos membros da entidade. A entidade não defende direito próprio (isso seria MS individual), nem direitos difusos de toda a sociedade (isso seria mais adequado para outras ações). O vínculo é com os associados.",
    explanationWrong:
      "Autorização expressa de cada membro não é exigida no MS coletivo — a entidade atua por substituição processual (ao contrário da representação processual comum, que exige mandato). Esse é o entendimento sumulado do STF.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c05_q05",
    contentId: "dc_r14_c05",
    statement:
      "O MS não cabe contra ato judicial passível de recurso ou correição (Súmula 267/STF). A razão para essa vedação é:",
    alternatives: [
      { letter: "A", text: "O Judiciário não pode ser autoridade coatora no MS — a CF veda essa possibilidade." },
      { letter: "B", text: "A existência de recurso processual adequado afasta o interesse de agir para o MS, que é remédio residual." },
      { letter: "C", text: "O prazo de 120 dias do MS é incompatível com os prazos recursais mais curtos." },
      { letter: "D", text: "A CF proíbe o MS contra atos do Poder Judiciário em qualquer hipótese." },
      { letter: "E", text: "O MS contra ato judicial violaria a independência do juiz e o princípio da separação dos poderes." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O MS é remédio subsidiário para situações em que não há recurso ou correição adequados. Quando existe recurso próprio (agravo, apelação, recurso especial), este deve ser utilizado — o MS seria substituição indevida do sistema recursal, caracterizando falta de interesse de agir.",
    explanationCorrect:
      "A Súmula 267 do STF consolida a subsidiariedade do MS: se há recurso cabível, ele deve ser usado. O MS contra ato judicial só é admitido quando não há recurso com efeito suspensivo ou quando o recurso for manifestamente inadequado para a situação.",
    explanationWrong:
      "O Judiciário pode ser autoridade coatora no MS — juízes e tribunais cometem atos ilegais sujeitos a MS quando não há recurso adequado. A CF não proíbe isso.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c05_q06",
    contentId: "dc_r14_c05",
    statement:
      "O Mandado de Injunção coletivo (positivado pela Lei 13.300/2016) pode ser impetrado por:",
    alternatives: [
      { letter: "A", text: "Qualquer cidadão, em defesa de direitos coletivos não regulamentados." },
      { letter: "B", text: "Ministério Público, Defensoria Pública, partidos políticos com representação no Congresso e organizações sindicais/entidades de classe/associações com pré-constituição de um ano." },
      { letter: "C", text: "Apenas partidos políticos com representação no Congresso Nacional." },
      { letter: "D", text: "Qualquer entidade civil ou sindicato, independentemente de tempo de funcionamento." },
      { letter: "E", text: "Apenas pelo Ministério Público Federal, como guardião da Constituição." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A Lei 13.300/2016 (Art. 12) legitima para o MI coletivo: MP, Defensoria Pública, partidos políticos com representação no Congresso, organizações sindicais, entidades de classe ou associações legalmente constituídas e em funcionamento há pelo menos um ano.",
    explanationCorrect:
      "O MI coletivo tem rol de legitimados mais amplo que o MSC: inclui MP e Defensoria, que não constam no Art. 5°, LXX. O requisito de pré-constituição de um ano vale para associações/entidades de classe, não para MP, Defensoria e partidos políticos.",
    explanationWrong:
      "O cidadão comum não tem legitimidade para o MI coletivo — tem para o individual. O MI coletivo é reservado a entes coletivos que representem os interesses do grupo afetado pela omissão normativa.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── dc_r14_c06: Legalidade Penal, Presunção de Inocência e Silêncio ───────

  {
    id: "dc_r14_c06_q01",
    contentId: "dc_r14_c06",
    statement:
      "O princípio da legalidade penal (Art. 5°, XXXIX, CF) — 'nullum crimen, nulla poena sine lege' — exige que a lei penal seja:",
    alternatives: [
      { letter: "A", text: "Prévia, escrita, estrita e certa — os quatro atributos são cumulativos." },
      { letter: "B", text: "Apenas prévia e escrita — os demais atributos são decorrência lógica." },
      { letter: "C", text: "Prévia e certa — a lei pode ser elaborada por decreto quando o Congresso não legislar." },
      { letter: "D", text: "Somente estrita — a analogia é vedada em qualquer caso no direito penal." },
      { letter: "E", text: "Escrita e prévia — admite-se o costume como fonte do direito penal." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "A legalidade penal exige quatro atributos cumulativos: (1) lex praevia — anterior ao fato; (2) lex scripta — lei formal, vedado o costume incriminador; (3) lex stricta — vedada a analogia in malam partem; (4) lex certa — clara e determinada, vedado o tipo penal vago.",
    explanationCorrect:
      "Os quatro atributos são garantias distintas: a anterioridade protege a confiança; o texto escrito proíbe costume como fonte penal; a estriteza veda analogia prejudicial; a certeza proíbe tipos vagos que permitam interpretação arbitrária.",
    explanationWrong:
      "Decretos não podem criar tipos penais — isso viola a legalidade (reserva legal absoluta para o direito penal). A analogia é vedada apenas in malam partem (para prejudicar o réu); in bonam partem (favorável) é admitida.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c06_q02",
    contentId: "dc_r14_c06",
    statement:
      "O princípio da irretroatividade da lei penal (Art. 5°, XL, CF) — 'a lei penal não retroagirá, salvo para beneficiar o réu' — aplica-se também a:",
    alternatives: [
      { letter: "A", text: "Medidas de segurança e efeitos extrapenais da sentença, apenas quando mais graves." },
      { letter: "B", text: "Exclusivamente às penas privativas de liberdade, não às restritivas de direitos." },
      { letter: "C", text: "Qualquer norma penal — incluindo processuais penais materiais, medidas de segurança e contravenções." },
      { letter: "D", text: "Apenas a leis tipificadoras de crimes, não às que definem excludentes de ilicitude." },
      { letter: "E", text: "Somente às condenações transitadas em julgado — não alcança réus em processo em andamento." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O princípio da retroatividade benigna aplica-se a toda norma penal em sentido material: cominação de pena, medidas de segurança, contravenções, normas processuais com conteúdo material (prescrição, decadência), e até causas excludentes de ilicitude e culpabilidade.",
    explanationCorrect:
      "A lei penal mais benéfica retroage para alcançar: (a) réus em processo em andamento; (b) condenados com trânsito em julgado. O juízo da execução aplica a lei mais benéfica sobrevinda mesmo após o trânsito (Art. 2°, §1° do CP e Súmula 611/STF).",
    explanationWrong:
      "Normas puramente processuais (sem conteúdo material penal) aplicam-se de imediato a processos em andamento (tempus regit actum), mas normas processuais materiais (prescrição, decadência) seguem a retroatividade benigna.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c06_q03",
    contentId: "dc_r14_c06",
    statement:
      "O direito ao silêncio no âmbito de CPI (Comissão Parlamentar de Inquérito) garante ao investigado:",
    alternatives: [
      { letter: "A", text: "O direito de não comparecer à CPI quando intimado." },
      { letter: "B", text: "O direito de permanecer calado apenas em relação a perguntas que possam incriminá-lo — deve responder às demais." },
      { letter: "C", text: "O direito de permanecer em silêncio a todas as perguntas, sem qualquer consequência." },
      { letter: "D", text: "O direito de responder apenas por escrito, evitando confronto com os parlamentares." },
      { letter: "E", text: "O silêncio é vedado na CPI — o investigado é obrigado a responder, sob pena de perjúrio." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O STF pacificou que o direito ao silêncio perante CPI é pleno: o investigado (não a testemunha comum) pode permanecer em silêncio a TODAS as perguntas sem ser penalizado. O silêncio não gera confissão ficta nem pode ser usado como prova contra ele.",
    explanationCorrect:
      "O investigado na CPI tem o status de acusado — aplicam-se todos os direitos do Art. 5°, LXIII. Testemunhas comuns têm o dever de depor, mas podem invocar o direito de não se autoincriminar em perguntas específicas. O investigado pode silenciar integralmente.",
    explanationWrong:
      "Não existe perjúrio por silêncio no direito brasileiro. O investigado não é obrigado a comparecer pessoalmente (pode se fazer representar por advogado e permanecer em silêncio). O direito ao silêncio na CPI decorre do nemo tenetur se detegere.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c06_q04",
    contentId: "dc_r14_c06",
    statement:
      "A vedação da pena de morte no Brasil (Art. 5°, XLVII) admite exceção em caso de:",
    alternatives: [
      { letter: "A", text: "Crimes hediondos com resultado morte, mediante sentença do Tribunal do Júri." },
      { letter: "B", text: "Guerra externa declarada." },
      { letter: "C", text: "Crimes contra o Estado Democrático de Direito (terrorismo e golpe de Estado)." },
      { letter: "D", text: "Sentença do STF em crimes de lesa-pátria." },
      { letter: "E", text: "Estado de sítio decretado pelo Congresso Nacional." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, XLVII veda pena de morte, de caráter perpétuo, de trabalhos forçados, de banimento e cruéis. A única exceção expressa à pena de morte é o caso de guerra externa declarada, regulado pelo Código Penal Militar.",
    explanationCorrect:
      "Em tempo de paz, a pena de morte é absolutamente vedada para qualquer crime, por mais grave que seja. Em guerra externa formalmente declarada pelo Congresso (Art. 84, XIX), o Código Penal Militar prevê a pena de morte para determinados crimes militares.",
    explanationWrong:
      "Crimes hediondos, terrorismo, golpe de Estado e estado de sítio não são exceções à vedação da pena de morte. A exceção constitucional é única e taxativa: guerra externa declarada.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c06_q05",
    contentId: "dc_r14_c06",
    statement:
      "O princípio da personalidade da pena (Art. 5°, XLV, CF) estabelece que a pena não passará da pessoa do condenado. Sobre as consequências civis e administrativas da condenação criminal:",
    alternatives: [
      { letter: "A", text: "Também não podem atingir terceiros — a personalidade da pena abrange todas as consequências." },
      { letter: "B", text: "A obrigação de reparar o dano e a decretação do perdimento de bens podem atingir os sucessores até o limite da herança." },
      { letter: "C", text: "Os sucessores respondem integralmente pelas dívidas penais do falecido." },
      { letter: "D", text: "A perda de cargo público do condenado não afeta seus dependentes em nenhuma hipótese." },
      { letter: "E", text: "A personalidade da pena é absoluta — nem os efeitos civis da condenação atingem herdeiros." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 5°, XLV é expresso: a pena não passará da pessoa do condenado, MAS a obrigação de reparar o dano e a decretação do perdimento de bens poderão ser estendidas aos sucessores e contra eles executadas, até o limite do valor do patrimônio transferido.",
    explanationCorrect:
      "A personalidade é da PENA (prisão, restrição de direitos): só o condenado cumpre. Mas os efeitos patrimoniais (reparação do dano à vítima, perdimento de bens ilícitos) podem atingir herdeiros até o limite da herança — evitando que o crime compense via herança.",
    explanationWrong:
      "A personalidade da pena não é absoluta quanto aos efeitos patrimoniais. A própria CF cria a exceção: sucessores respondem patrimonialmente até o limite do que herdaram do condenado.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "dc_r14_c06_q06",
    contentId: "dc_r14_c06",
    statement:
      "O art. 5°, LVII, CF declara que 'ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória.' Com base nesse princípio, é inconstitucional:",
    alternatives: [
      { letter: "A", text: "A prisão preventiva decretada por juiz durante o processo penal." },
      { letter: "B", text: "A exigência de antecedentes criminais em concurso público com base em inquérito policial arquivado." },
      { letter: "C", text: "A suspensão preventiva de servidor público réu em processo criminal, durante o processo." },
      { letter: "D", text: "A exigência de boa conduta em contratos administrativos com base em condenações transitadas em julgado." },
      { letter: "E", text: "A decretação de indisponibilidade de bens do réu em ação de improbidade administrativa." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O STF (Súmula Vinculante 22 e precedentes) entende que o uso de inquérito arquivado ou ação penal sem condenação transitada em julgado como critério eliminatório em concurso público viola a presunção de inocência (Art. 5°, LVII) e a isonomia.",
    explanationCorrect:
      "Inquérito arquivado significa que não houve elementos suficientes para indiciamento — usá-lo como eliminatório é tratar o candidato como culpado sem processo e sem condenação. Condenações sem trânsito em julgado também não podem ser usadas para esse fim.",
    explanationWrong:
      "Prisão preventiva (cautelar) é constitucional — não é execução de pena, mas medida processual. A suspensão de servidor réu tem previsão legal (estatuto) como medida cautelar administrativa. Indisponibilidade de bens em improbidade também é medida cautelar, não pena.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n========================================================");
  console.log("  SEED R46 — DENSIFICAÇÃO DIR_CONSTITUCIONAL dc_r14_*");
  console.log("========================================================\n");

  // Resolve subjectId e topicId a partir do primeiro átomo existente
  const refRows = (await db.execute(sql`
    SELECT "subjectId", "topicId" FROM "Content" WHERE id = 'dc_r14_c01' LIMIT 1
  `)) as any[];

  if (!refRows.length) {
    console.error("❌ Átomo dc_r14_c01 não encontrado. Execute seed-direito-constitucional-art5-r14.ts primeiro.");
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
  console.error("\n❌ ERRO no seed R46:", err.message ?? err);
  process.exit(1);
});
