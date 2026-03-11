/**
 * db/seed-dense-adm-aa-r49.ts
 * DENSIFICAÇÃO — DIR_ADMINISTRATIVO grupo adm_aa_*
 *
 * Átomos-alvo: 6 átomos, 2 questões existentes cada → +6 por átomo = 36 novas questões
 * adm_aa_c01 — Elementos (Requisitos) do Ato Administrativo — COMFIM
 * adm_aa_c02 — Atributos do Ato Administrativo — PATI
 * adm_aa_c03 — Vinculação vs. Discricionariedade
 * adm_aa_c04 — Espécies de Atos Administrativos — NONEP
 * adm_aa_c05 — Extinção: Anulação vs. Revogação
 * adm_aa_c06 — Convalidação e Vícios do Ato Administrativo
 *
 * Execução: npx tsx db/seed-dense-adm-aa-r49.ts
 */

import { db } from "../db/index";
import { sql } from "drizzle-orm";

const questions = [

  // ── adm_aa_c01: Elementos do Ato Administrativo — COMFIM ─────────────────

  {
    id: "adm_aa_c01_q01",
    contentId: "adm_aa_c01",
    statement:
      "A teoria dos motivos determinantes vincula a Administração Pública ao motivo declarado para a prática do ato. As consequências práticas dessa teoria são:",
    alternatives: [
      { letter: "A", text: "O motivo declarado pode ser alterado após a prática do ato, sem implicações jurídicas." },
      { letter: "B", text: "Se o motivo declarado for falso, inexistente ou juridicamente inadequado, o ato é inválido — mesmo que fosse discricionário." },
      { letter: "C", text: "A teoria aplica-se apenas a atos vinculados — nos discricionários, o motivo é irrelevante." },
      { letter: "D", text: "A Administração pode complementar o motivo declarado com novos fatos após a impugnação judicial." },
      { letter: "E", text: "A teoria obriga a Administração a declarar o motivo apenas em atos punitivos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A teoria dos motivos determinantes vincula a Administração ao motivo efetivamente declarado: se o motivo for falso (ex.: servidor removido por 'necessidade do serviço', mas a real razão era perseguição pessoal), o ato é nulo — mesmo que a remoção fosse ato discricionário.",
    explanationCorrect:
      "A teoria tem implicação importante: a Administração não pode, após a impugnação, apresentar novo motivo para salvar o ato. O motivo que sustenta o ato é o declarado no momento da prática. A mudança de motivação posterior não convalida o ato.",
    explanationWrong:
      "A teoria aplica-se a atos vinculados E discricionários. No discricionário, o agente tem liberdade de escolher o motivo — mas uma vez declarado, está vinculado a ele. A obrigação de motivar (Art. 50 da Lei 9.784/99) abrange atos vinculados e discricionários.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c01_q02",
    contentId: "adm_aa_c01",
    statement:
      "O desvio de finalidade (desvio de poder) é vício que afeta qual dos elementos do ato administrativo?",
    alternatives: [
      { letter: "A", text: "Competência — o agente age fora de suas atribuições." },
      { letter: "B", text: "Objeto — o conteúdo do ato é ilícito." },
      { letter: "C", text: "Finalidade — o agente pratica o ato visando fim diverso do interesse público previsto em lei." },
      { letter: "D", text: "Forma — o ato não observou o procedimento legal." },
      { letter: "E", text: "Motivo — o fato que ensejou o ato era inexistente." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O desvio de finalidade (desvio de poder) é vício de FINALIDADE: o agente usa o ato para fim diverso do previsto em lei, ainda que o ato pareça formal e externamente regular. Exemplo: prefeito usa desapropriação para prejudicar inimigo político, não para fim público.",
    explanationCorrect:
      "O desvio de finalidade é vício insanável — o ato é nulo. É de difícil comprovação, pois o agente normalmente apresenta justificativa formal plausível. A prova costuma ser indireta (contexto político, ausência de necessidade pública real, benefício pessoal do agente).",
    explanationWrong:
      "Vício de competência: agente incompetente (ex.: portaria assinada por servidor sem delegação). Vício de objeto: conteúdo ilícito (ex.: demissão de servidor estável sem processo administrativo). Vício de motivo: motivo falso ou inexistente. Vício de forma: inobservância do procedimento formal.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c01_q03",
    contentId: "adm_aa_c01",
    statement:
      "A competência administrativa pode ser delegada, exceto em três hipóteses. Assinale a alternativa que lista CORRETAMENTE casos em que a delegação é VEDADA:",
    alternatives: [
      { letter: "A", text: "Atos de mera comunicação interna, atos ordinatórios e atos de expediente." },
      { letter: "B", text: "Edição de atos de caráter normativo, decisão de recursos administrativos e matérias de competência exclusiva." },
      { letter: "C", text: "Atos de gestão patrimonial, atos de pessoal e atos financeiros." },
      { letter: "D", text: "Atos urgentes, atos de estado de emergência e atos de defesa nacional." },
      { letter: "E", text: "Atos que dependam de aprovação legislativa prévia." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A Lei 9.784/99 (Art. 13) veda a delegação para: (I) edição de atos de caráter normativo; (II) decisão de recursos administrativos; (III) matérias de competência exclusiva do órgão ou autoridade. Essas funções são consideradas indelegáveis por sua natureza.",
    explanationCorrect:
      "A delegação é regra; a vedação, exceção. Os três casos do Art. 13 garantem que decisões de maior relevância não sejam transferidas informalmente: atos normativos criam regras gerais (poder normativo); recursos administrativos revisam atos (controle interno); competência exclusiva já é exceção à regra.",
    explanationWrong:
      "Atos urgentes, de pessoal ou financeiros são delegáveis, em regra. A vedação do Art. 13 é taxativa: apenas os três casos listados. A avocação (trazer de volta competência delegada) é sempre possível pela autoridade superior.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c01_q04",
    contentId: "adm_aa_c01",
    statement:
      "O elemento 'forma' do ato administrativo é, em regra, a escrita. Atos administrativos praticados por outras formas (oral, simbólica) são:",
    alternatives: [
      { letter: "A", text: "Sempre nulos — a escrita é forma essencial em todos os atos administrativos." },
      { letter: "B", text: "Válidos excepcionalmente quando a lei os admite ou quando a urgência e o costume o justificam." },
      { letter: "C", text: "Válidos apenas para atos internos da Administração — atos externos exigem sempre forma escrita." },
      { letter: "D", text: "Admitidos apenas por servidores de nível superior — agentes de nível médio devem sempre usar forma escrita." },
      { letter: "E", text: "Somente admitidos durante estados de exceção (estado de defesa ou sítio)." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A forma escrita é a regra para garantir publicidade, controle e prova do ato. Excepcionalmente, admitem-se outras formas: ordem verbal do superior ao inferior (urgência), sinal sonoro (sirene policial), sinalização de trânsito (simbólica). O costume administrativo também legitima certas formas.",
    explanationCorrect:
      "Exemplos clássicos: policial que para veículo com gesto (forma simbólica); superior que ordena verbalmente em situação de emergência (forma oral). Esses atos são válidos porque a própria natureza da situação justifica a forma alternativa.",
    explanationWrong:
      "Atos externos também podem ter formas não escritas (sinalização de trânsito é ato externo por excelência). A qualificação do servidor não determina a forma válida. O estado de exceção não é condição para formas alternativas.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c01_q05",
    contentId: "adm_aa_c01",
    statement:
      "O princípio da motivação obriga a Administração a explicitar os fundamentos de fato e de direito de seus atos. A Lei 9.784/99 torna a motivação obrigatória em diversas hipóteses. Sobre motivação, é correto afirmar:",
    alternatives: [
      { letter: "A", text: "A motivação é obrigatória apenas em atos vinculados — nos discricionários, é facultativa." },
      { letter: "B", text: "A motivação pode ser feita por remissão (referência a outro ato ou parecer), desde que o documento referenciado esteja acessível." },
      { letter: "C", text: "A falta de motivação em ato discricionário não gera nulidade — o mérito supre a motivação." },
      { letter: "D", text: "A motivação deve sempre ser extensa e detalhada para atos de qualquer natureza." },
      { letter: "E", text: "Atos de nomeação para cargos em comissão não precisam ser motivados por serem de livre nomeação." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 50, §1° da Lei 9.784/99 admite motivação aliunde (por referência ou remissão): o ato pode se remeter a pareceres, informações técnicas ou outros documentos, desde que estes sejam acessíveis e integrem o processo. A motivação por referência é válida.",
    explanationCorrect:
      "A motivação é exigida em atos que neguem, limitem ou afetem direitos (Art. 50 da Lei 9.784/99). O STJ consolidou que a falta de motivação em atos que exijam motivação gera nulidade. Atos de livre nomeação podem ter motivação implícita (interesse público geral), mas atos de exoneração de cargo em comissão por punição exigem motivação expressa.",
    explanationWrong:
      "A motivação é exigida em atos vinculados E em muitos discricionários (Art. 50 da Lei 9.784/99 é amplo). A falta de motivação em ato que deveria ser motivado gera nulidade — o mérito não supre a forma obrigatória.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c01_q06",
    contentId: "adm_aa_c01",
    statement:
      "O excesso de poder é vício que afeta qual dos elementos do ato administrativo?",
    alternatives: [
      { letter: "A", text: "Finalidade — o agente age para fim diverso do interesse público." },
      { letter: "B", text: "Motivo — o motivo declarado é falso." },
      { letter: "C", text: "Competência — o agente extrapola os limites de sua competência legal." },
      { letter: "D", text: "Objeto — o conteúdo do ato excede o permitido por lei." },
      { letter: "E", text: "Forma — o ato não observou o procedimento previsto." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O excesso de poder é vício de COMPETÊNCIA: o agente age além dos limites de sua atribuição legal, praticando ato que não lhe compete ou ultrapassando os limites que a lei lhe confere. Diferente do desvio de poder (vício de finalidade).",
    explanationCorrect:
      "Exemplo de excesso de poder: inspetor fiscal que, ao realizar auditoria, determina a demolição de imóvel sem ter competência para tal. Exemplo de desvio de poder: fiscal que usa auto de infração por motivo pessoal, não por infração real. Ambos são formas de abuso de poder.",
    explanationWrong:
      "A distinção excesso × desvio de poder é clássica em provas: excesso = competência extrapolada; desvio = finalidade desviada. O abuso de poder abrange os dois. Vício de objeto: conteúdo ilícito. Vício de motivo: motivo falso/inexistente. Vício de forma: procedimento inobservado.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── adm_aa_c02: Atributos do Ato Administrativo — PATI ───────────────────

  {
    id: "adm_aa_c02_q01",
    contentId: "adm_aa_c02",
    statement:
      "A presunção de legitimidade do ato administrativo é relativa (juris tantum). As consequências práticas dessa presunção são:",
    alternatives: [
      { letter: "A", text: "O ônus da prova de validade do ato é da Administração — ela deve provar que o ato é legal." },
      { letter: "B", text: "O ônus da prova de invalidade recai sobre o administrado — o ato é válido até que seja impugnado com prova de invalidade." },
      { letter: "C", text: "O Judiciário não pode questionar a validade do ato sem prova apresentada pelo Ministério Público." },
      { letter: "D", text: "O ato produz efeitos imediatos e absolutos, sem possibilidade de suspensão liminar." },
      { letter: "E", text: "O administrado que questionar o ato deve pagar caução proporcional ao valor do ato impugnado." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A presunção relativa de legitimidade inverte o ônus da prova: o administrado que alega a invalidade do ato deve provar seu argumento. A Administração não precisa provar que o ato é válido — a validade é presumida até que o contrário seja demonstrado.",
    explanationCorrect:
      "Essa inversão do ônus tem reflexos processuais: em mandado de segurança contra ato administrativo, o impetrante deve demonstrar a ilegalidade ou abuso de poder. A Administração se defende demonstrando que o ato é legítimo — mas o ônus inicial é do impugnante.",
    explanationWrong:
      "A presunção relativa não afasta o controle judicial — o Judiciário pode (e deve) anular atos ilegais. Liminar judicial pode suspender ato administrativo quando há fumaça do bom direito e risco de dano irreparável. Não existe caução para questionar atos administrativos.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c02_q02",
    contentId: "adm_aa_c02",
    statement:
      "A autoexecutoriedade permite à Administração executar seus atos sem autorização judicial prévia. Esse atributo é admitido:",
    alternatives: [
      { letter: "A", text: "Para qualquer ato administrativo, sempre que a Administração entender necessário." },
      { letter: "B", text: "Apenas quando a lei expressamente o previr OU quando houver urgência que impossibilite a espera por decisão judicial." },
      { letter: "C", text: "Apenas para atos que não gerem qualquer ônus ao administrado." },
      { letter: "D", text: "Somente em situações de estado de defesa ou estado de sítio declarados." },
      { letter: "E", text: "Para todos os atos punitivos, sem restrição." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A autoexecutoriedade não é ilimitada. Admite-se apenas quando: (a) a lei expressamente prevê a execução direta pela Administração; (b) há urgência que torna a espera por decisão judicial inviável (demolição de edificação prestes a desabar, apreensão de alimentos contaminados).",
    explanationCorrect:
      "Exemplo de autoexecutoriedade prevista em lei: apreensão de veículo irregular (CTB). Exemplo por urgência: demolição de imóvel em risco iminente de desabamento sem prévia autorização judicial. O controle judicial POSTERIOR sempre é cabível.",
    explanationWrong:
      "A autoexecutoriedade não é geral para todos os atos. Multas, por exemplo, não são autoexecutáveis: a Administração lança a dívida, mas para cobrá-la forçadamente precisa da execução fiscal (judicial). O estado de exceção não é condição para a autoexecutoriedade.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c02_q03",
    contentId: "adm_aa_c02",
    statement:
      "A imperatividade (coercibilidade) como atributo do ato administrativo significa que:",
    alternatives: [
      { letter: "A", text: "O administrado pode se recusar a cumprir o ato se discordar de seu conteúdo." },
      { letter: "B", text: "O ato impõe obrigações ao particular independentemente de sua concordância, podendo ser executado coercitivamente." },
      { letter: "C", text: "Todos os atos administrativos têm imperatividade — sem exceção." },
      { letter: "D", text: "A imperatividade autoriza a Administração a usar força física diretamente contra o administrado resistente." },
      { letter: "E", text: "A imperatividade é exclusiva de atos punitivos — atos ampliativos não têm esse atributo." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A imperatividade é o atributo pelo qual o ato administrativo impõe obrigações unilateralmente ao particular, que deve cumpri-lo independentemente de concordar. A desobediência pode gerar execução coercitiva (com ou sem autorização judicial, conforme o caso).",
    explanationCorrect:
      "Exceções: atos ampliativos de direitos (licença, autorização, certidão, atestado) não têm imperatividade sobre o beneficiário — são favoráveis, não impositivos. Somente atos que impõem deveres ou restrições têm imperatividade.",
    explanationWrong:
      "Nem todos os atos têm imperatividade: certidão negativa, atestado e autorização não impõem nada ao administrado. A imperatividade não autoriza uso arbitrário de força — o uso de força segue normas específicas (poder de polícia, código de conduta).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c02_q04",
    contentId: "adm_aa_c02",
    statement:
      "A tipicidade como atributo do ato administrativo garante que:",
    alternatives: [
      { letter: "A", text: "A Administração pode criar qualquer tipo de ato, desde que motivado e razoável." },
      { letter: "B", text: "O ato deve corresponder a figura definida e autorizada em lei — vedados atos administrativos inominados." },
      { letter: "C", text: "Atos administrativos típicos são absolutamente vinculados — sem margem de discricionariedade." },
      { letter: "D", text: "A tipicidade só se aplica a atos punitivos — atos normativos não têm tipo previsto." },
      { letter: "E", text: "Atos sem tipo legal expresso são nulos de pleno direito, não podendo ser convalidados." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A tipicidade garante que a Administração só pratica os atos previstos em lei — não há 'atos administrativos inominados' sem fundamento legal. Isso protege o administrado (sabe quais atos esperar) e decorre do princípio da legalidade administrativa.",
    explanationCorrect:
      "A tipicidade não implica vinculação absoluta: o ato pode ser típico (previsto em lei) e ainda assim discricionário (com margem de escolha no motivo e no objeto). Exemplos: autorização de uso de bem público (tipo definido em lei + discricionariedade no conteúdo).",
    explanationWrong:
      "A distinção tipicidade × vinculação é importante: todo ato administrativo deve ser típico (atributo), mas nem todo ato típico é vinculado (pode ser discricionário). A tipicidade é atributo de todos os atos — não apenas dos punitivos.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c02_q05",
    contentId: "adm_aa_c02",
    statement:
      "Uma certidão negativa de débitos emitida pela Receita Federal é ato administrativo que NÃO possui qual dos atributos (PATI)?",
    alternatives: [
      { letter: "A", text: "Presunção de legitimidade — certidões são emitidas sem controle de legalidade." },
      { letter: "B", text: "Autoexecutoriedade e imperatividade — a certidão apenas certifica fatos, sem impor obrigações ou se autoexecutar." },
      { letter: "C", text: "Tipicidade — certidões são atos inominados sem tipo legal definido." },
      { letter: "D", text: "Todos os atributos — a certidão não é ato administrativo." },
      { letter: "E", text: "Nenhum atributo — certidões são atos de direito privado." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A certidão negativa de débitos é ato enunciativo: apenas certifica a inexistência de débitos. Não impõe obrigações (sem imperatividade) e não se autoexecuta (sem autoexecutoriedade). Tem presunção de legitimidade (é ato público) e tipicidade (prevista em lei).",
    explanationCorrect:
      "Atos enunciativos (certidão, atestado, parecer) têm presunção de legitimidade e tipicidade, mas não têm imperatividade nem autoexecutoriedade — pois não impõem nada ao administrado. São atos declaratórios, não constitutivos ou modificativos.",
    explanationWrong:
      "Certidões são atos administrativos — emitidas por autoridade pública no exercício de função administrativa. Têm presunção de legitimidade (fé pública) e tipicidade (Lei 9.784/99 e legislação específica as preveem). O erro é atribuir a elas os atributos que só existem em atos imperativos.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c02_q06",
    contentId: "adm_aa_c02",
    statement:
      "O atributo da autoexecutoriedade não autoriza a Administração a cobrar multas administrativas sem processo judicial. Isso significa que:",
    alternatives: [
      { letter: "A", text: "Multas administrativas nunca podem ser aplicadas — exigem processo judicial prévio." },
      { letter: "B", text: "A Administração pode aplicar (lavrar) a multa administrativamente, mas para cobrá-la forçadamente do devedor resistente, deve ajuizar execução fiscal." },
      { letter: "C", text: "A Administração pode descontar a multa diretamente do patrimônio do devedor sem qualquer processo." },
      { letter: "D", text: "Multas só podem ser aplicadas em processo judicial com contraditório prévio." },
      { letter: "E", text: "A autoexecutoriedade permite a penhora de bens do devedor pela própria Administração." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A multa administrativa é aplicada pela Administração (autoexecutoriedade na fase de aplicação), mas sua cobrança forçada — quando o devedor não paga voluntariamente — exige inscrição em dívida ativa e execução fiscal (processo judicial). A autoexecutoriedade não chega ao ponto de penhorar bens.",
    explanationCorrect:
      "O sistema é: (1) Administração lavra auto de infração e aplica a multa; (2) contribuinte pode pagar voluntariamente; (3) se não pagar, a Administração inscreve na dívida ativa; (4) ajuíza execução fiscal para cobrar. A penhora e a alienação de bens são atos judiciais.",
    explanationWrong:
      "Multas são plenamente aplicáveis pela Administração (poder de polícia). O que falta é a cobrança forçada direta — que exige o Judiciário. Isso não é limitação da autoexecutoriedade em geral, mas especificidade das obrigações de pagar (que diferem das obrigações de fazer ou de não fazer).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── adm_aa_c03: Vinculação vs. Discricionariedade ─────────────────────────

  {
    id: "adm_aa_c03_q01",
    contentId: "adm_aa_c03",
    statement:
      "Um candidato aprovado em concurso público dentro das vagas ofertadas requer sua nomeação, mas a Administração nega alegando conveniência. Sobre essa situação:",
    alternatives: [
      { letter: "A", text: "A Administração agiu corretamente — nomeação é ato discricionário baseado em conveniência." },
      { letter: "B", text: "A Administração violou direito subjetivo do candidato: aprovado dentro das vagas, a nomeação é ato vinculado — o candidato tem direito líquido e certo à nomeação." },
      { letter: "C", text: "A Administração pode negar a nomeação desde que motive o ato com fundamento em interesse público." },
      { letter: "D", text: "O candidato deve aguardar o prazo de validade do concurso — somente após o vencimento pode questionar." },
      { letter: "E", text: "A nomeação é discricionária até a posse — a Administração pode revogar até o candidato tomar posse." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O STF (RE 598.099 — repercussão geral) consolidou que candidato aprovado dentro das vagas tem direito SUBJETIVO à nomeação — não é mera expectativa. A Administração só pode deixar de nomear por motivo superveniente devidamente comprovado (corte orçamentário grave, extinção do cargo).",
    explanationCorrect:
      "A nomeação de aprovado dentro das vagas é ato vinculado: presentes os requisitos (aprovação + vaga + prazo de validade), a Administração DEVE nomear. A conveniência administrativa é razão insuficiente para recusar — caberia mandado de segurança para garantir a nomeação.",
    explanationWrong:
      "A jurisprudência do STF transformou o que era discricionariedade em vinculação para candidatos aprovados dentro das vagas. A Administração tem discricionariedade para definir quantas vagas oferecer no edital — mas após a oferta, deve cumpri-la.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c03_q02",
    contentId: "adm_aa_c03",
    statement:
      "O controle judicial dos atos discricionários alcança:",
    alternatives: [
      { letter: "A", text: "Apenas os atos vinculados — o Judiciário não pode analisar atos discricionários." },
      { letter: "B", text: "A legalidade do ato discricionário (inclusive proporcionalidade e razoabilidade), mas não o mérito em si." },
      { letter: "C", text: "O mérito administrativo — o juiz pode substituir a escolha da Administração pela sua." },
      { letter: "D", text: "Apenas o procedimento formal do ato — nunca o conteúdo." },
      { letter: "E", text: "Somente atos discricionários de entidades da Administração indireta." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Judiciário controla a LEGALIDADE dos atos discricionários — incluindo os princípios da proporcionalidade e razoabilidade. O que o Judiciário não pode fazer é substituir a escolha administrativa dentro da zona legítima de discricionariedade (isso violaria a separação de poderes).",
    explanationCorrect:
      "Exemplo: se a Administração derruba edifício histórico para construir estacionamento, o Judiciário pode anular por violação à proporcionalidade e ao princípio da eficiência — sem substituir a escolha administrativa por outra. O Judiciário anula; a Administração deve redecidir.",
    explanationWrong:
      "O controle judicial abrange todos os atos administrativos — vinculados e discricionários. O limite é o mérito: o juiz não diz 'deveria ter sido assim', mas apenas 'esse ato foi ilegal'. Controlar legalidade é diferente de rever o mérito.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c03_q03",
    contentId: "adm_aa_c03",
    statement:
      "A diferença entre discricionariedade e arbitrariedade é fundamental no Direito Administrativo. Assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "Discricionariedade e arbitrariedade são sinônimos — ambas expressam liberdade de escolha da Administração." },
      { letter: "B", text: "Discricionariedade é liberdade DENTRO dos limites da lei; arbitrariedade é ato praticado FORA ou CONTRA a lei — sempre inválida." },
      { letter: "C", text: "A arbitrariedade é permitida em situações de emergência administrativa." },
      { letter: "D", text: "A discricionariedade é vedada pelo princípio da legalidade — toda ação administrativa deve ser vinculada." },
      { letter: "E", text: "O Judiciário não pode anular atos arbitrários sem prévia manifestação do TCU." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A discricionariedade é a liberdade conferida pela lei para que a Administração escolha entre opções igualmente válidas. A arbitrariedade é o ato praticado sem fundamento legal, contra a lei ou além dos limites da competência — é sempre inválida e anulável.",
    explanationCorrect:
      "A discricionariedade opera dentro da lei (intra legem). O controle judicial pode alcançar a discricionariedade apenas quando esta extrapola a razoabilidade. A arbitrariedade é ilegal por definição — o Judiciário pode e deve anulá-la sem limitações.",
    explanationWrong:
      "A discricionariedade não viola o princípio da legalidade — ao contrário, ela é conferida PELA lei. A própria lei cria a margem de escolha. Emergências não autorizam arbitrariedade — o Estado de Direito exige fundamento legal mesmo em crises.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c03_q04",
    contentId: "adm_aa_c03",
    statement:
      "Em atos discricionários, o mérito administrativo refere-se à:",
    alternatives: [
      { letter: "A", text: "Qualidade técnica do servidor que praticou o ato." },
      { letter: "B", text: "Liberdade da Administração de escolher o momento (oportunidade) e o conteúdo/modo (conveniência) mais adequados para o ato." },
      { letter: "C", text: "Fundamento legal que autoriza a prática do ato." },
      { letter: "D", text: "Análise que o Judiciário faz da adequação do ato ao interesse público." },
      { letter: "E", text: "Resultado patrimonial esperado do ato para o erário." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O mérito administrativo é composto por dois elementos: oportunidade (quando praticar o ato — o momento mais adequado) e conveniência (como praticar e qual conteúdo dar ao ato). É a zona de liberdade legítima da Administração, insuscetível de revisão judicial.",
    explanationCorrect:
      "Exemplo: a Administração pode construir uma escola em um bairro carente agora ou em 2 anos (oportunidade) e pode optar por escola de 10 salas ou 20 salas (conveniência). Ambas as escolhas são mérito — o Judiciário não substitui essas decisões, desde que dentro da lei.",
    explanationWrong:
      "O fundamento legal é o elemento 'competência' ou 'motivo de direito', não o mérito. O Judiciário não analisa o mérito — apenas a legalidade. O resultado patrimonial é análise de eficiência, não de mérito em sentido técnico.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c03_q05",
    contentId: "adm_aa_c03",
    statement:
      "A autorização de porte de arma de fogo para uso pessoal (fora de serviço) é ato:",
    alternatives: [
      { letter: "A", text: "Vinculado — preenchidos os requisitos do Estatuto do Desarmamento, a Administração deve conceder." },
      { letter: "B", text: "Discricionário — a Administração avalia a conveniência e oportunidade, podendo negar mesmo que os requisitos estejam presentes." },
      { letter: "C", text: "Inexistente no ordenamento — o porte de arma civil é proibido pela CF." },
      { letter: "D", text: "Vinculado apenas para militares ativos — discricionário para civis." },
      { letter: "E", text: "Vinculado após decisão judicial favorável ao requerente." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O porte de arma civil (para uso pessoal fora de serviço) é ato discricionário: a Administração (Polícia Federal) avalia a necessidade, os antecedentes e as circunstâncias — e pode negar mesmo que os requisitos formais estejam presentes, com base na oportunidade e conveniência.",
    explanationCorrect:
      "Contraste com a licença para porte (de agentes de segurança privada, por exemplo, em serviço): há hipóteses mais vinculadas. Para o cidadão civil comum, o porte é concessão discricionária — a CF não garante o porte como direito absoluto.",
    explanationWrong:
      "O Estatuto do Desarmamento (Lei 10.826/2003) regulamenta o porte civil como ato discricionário — não como direito subjetivo. A CF (Art. 5°, caput) protege o direito à segurança, mas não confere direito incondicional ao porte de arma.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c03_q06",
    contentId: "adm_aa_c03",
    statement:
      "O princípio da proporcionalidade limita a discricionariedade administrativa. Uma decisão desproporcional pode ser:",
    alternatives: [
      { letter: "A", text: "Anulada pelo Judiciário — a desproporcionalidade é vício de legalidade, não apenas de mérito." },
      { letter: "B", text: "Apenas revista pela própria Administração — o Judiciário não pode anular por desproporcionalidade." },
      { letter: "C", text: "Convalidada se a Administração apresentar nova motivação proporcional após a impugnação." },
      { letter: "D", text: "Punida com multa ao agente público, mas o ato permanece válido." },
      { letter: "E", text: "Anulada apenas pelo TCU em sede de controle externo." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "A proporcionalidade é princípio constitucional implícito (decorrente do Estado de Direito e da razoabilidade) e o STF reconhece que sua violação configura ilegalidade — não apenas juízo de mérito. Logo, o Judiciário pode anular ato desproporcional sem invadir o mérito.",
    explanationCorrect:
      "Exemplo: Administração que suspende servidor por 90 dias por falta leve que a lei puniria com advertência age desproporcionalmente. O Judiciário pode anular por violação à proporcionalidade — pois a punição extrapola os limites legais da discricionariedade punitiva.",
    explanationWrong:
      "A proporcionalidade foi absorvida pela legalidade: descumprir a proporcionalidade é descumprir a lei (que exige atos razoáveis). O Judiciário pode anular — não substituir a escolha administrativa. A Administração deve redecidir de forma proporcional.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── adm_aa_c04: Espécies de Atos Administrativos — NONEP ─────────────────

  {
    id: "adm_aa_c04_q01",
    contentId: "adm_aa_c04",
    statement:
      "A diferença entre licença e autorização é tema clássico em concursos de Direito Administrativo. Assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "Licença é ato discricionário e precário; autorização é ato vinculado e definitivo." },
      { letter: "B", text: "Licença é ato vinculado e definitivo (a Adm. deve conceder se preenchidos os requisitos); autorização é discricionária e precária (a Adm. pode revogar sem indenização)." },
      { letter: "C", text: "Licença e autorização são atos vinculados — a diferença é apenas o prazo de validade." },
      { letter: "D", text: "Licença é ato punitivo; autorização é ato negocial. A diferença é o efeito — restritivo vs. ampliativo." },
      { letter: "E", text: "Ambos são atos discricionários; a diferença é que a licença exige motivação e a autorização não." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Licença: ato vinculado — preenchidos os requisitos, a Administração é obrigada a conceder (o particular tem direito subjetivo). Não pode ser revogada discricionariamente. Exemplos: licença para construir, licença para dirigir (CNH), licença sanitária.",
    explanationCorrect:
      "Autorização: ato discricionário e precário — a Administração pode negar mesmo preenchidos os requisitos e pode revogar a qualquer tempo sem indenização. Exemplos: autorização de porte de arma, autorização para uso de bem público, autorização para funcionamento de estabelecimento.",
    explanationWrong:
      "A confusão entre licença e autorização é frequente. A chave: licença = direito subjetivo = vinculado. Autorização = concessão graciosa = discricionário. Quando a questão diz 'a Adm. pode negar mesmo preenchidos os requisitos', é autorização.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c04_q02",
    contentId: "adm_aa_c04",
    statement:
      "O decreto regulamentar (ato normativo do Executivo) pode:",
    alternatives: [
      { letter: "A", text: "Criar obrigações novas não previstas em lei, desde que seja para regulamentar atividade econômica." },
      { letter: "B", text: "Regulamentar a execução da lei, detalhando seu conteúdo sem criar obrigações autônomas que excedam o previsto na lei regulamentada." },
      { letter: "C", text: "Revogar leis que se tornem incompatíveis com a política governamental." },
      { letter: "D", text: "Criar tipos penais administrativos sem lei prévia, em situações de emergência." },
      { letter: "E", text: "Inovar no ordenamento jurídico desde que seja submetido ao controle do Congresso em 30 dias." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O decreto regulamentar (Art. 84, IV da CF) apenas regulamenta a lei — detalha procedimentos, define critérios, especifica condições previstas genericamente na lei. Não pode inovar na ordem jurídica criando obrigações ou direitos não previstos na lei regulamentada.",
    explanationCorrect:
      "Exemplo: a lei proíbe o porte de certos produtos e o decreto regulamenta o procedimento de fiscalização (documentos, fluxo, prazo). O decreto não pode proibir o que a lei não proibiu nem autorizar o que a lei vedou.",
    explanationWrong:
      "O decreto autônomo (Art. 84, VI da CF) é exceção: pode organizar a estrutura administrativa sem lei prévia — mas apenas quanto à organização e funcionamento interno, sem criar ou extinguir cargos ou alterar vencimentos. Decretos autônomos não criam obrigações ao cidadão.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c04_q03",
    contentId: "adm_aa_c04",
    statement:
      "Um auto de infração lavrado por fiscal da Receita Federal contra contribuinte por sonegação fiscal é classificado como ato administrativo da espécie:",
    alternatives: [
      { letter: "A", text: "Normativo — cria regra geral para todos os contribuintes." },
      { letter: "B", text: "Enunciativo — certifica a existência de infração tributária." },
      { letter: "C", text: "Punitivo — aplica sanção (lançamento de ofício com multa) por infração à legislação tributária." },
      { letter: "D", text: "Ordinatório — disciplina o comportamento interno da Receita Federal." },
      { letter: "E", text: "Negocial — depende da concordância do contribuinte para produzir efeitos." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O auto de infração é ato punitivo: aplica sanção (multa + lançamento do tributo devido) por infração verificada pela Administração tributária. Decorre do poder de polícia fiscal do Estado.",
    explanationCorrect:
      "Atos punitivos exigem contraditório e ampla defesa (Art. 5°, LV da CF) antes de sua execução definitiva — o contribuinte pode impugnar o auto de infração administrativamente (processo administrativo fiscal) ou judicialmente. A multa não é autoexecutável sem processo judicial (execução fiscal).",
    explanationWrong:
      "Ato enunciativo certificaria um fato (certidão de regularidade fiscal, por exemplo). Ato normativo criaria regra geral. O auto de infração é individualizado (atinge um contribuinte específico) e impõe sanção — características dos atos punitivos.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c04_q04",
    contentId: "adm_aa_c04",
    statement:
      "O parecer jurídico vinculante (obrigatório e vinculante) emitido pela Advocacia-Geral da União (AGU) tem a natureza de ato administrativo da espécie:",
    alternatives: [
      { letter: "A", text: "Normativo — cria norma geral aplicável a todos os órgãos da Administração Federal." },
      { letter: "B", text: "Enunciativo — expressa opinião técnico-jurídica, mas vincula a Administração quando aprovado pelo Presidente." },
      { letter: "C", text: "Punitivo — tem caráter coercitivo sobre os advogados públicos." },
      { letter: "D", text: "Negocial — depende da concordância dos órgãos afetados para produzir efeitos." },
      { letter: "E", text: "Ordinatório — disciplina o funcionamento interno da AGU." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O parecer é ato enunciativo (opinião técnica). No caso do parecer normativo da AGU aprovado pelo Presidente da República, ele vincula toda a Administração Federal (Art. 40, §1° da LC 73/93) — mas continua sendo ato enunciativo em sua natureza, com efeito vinculante especial.",
    explanationCorrect:
      "A natureza enunciativa não se confunde com os efeitos do parecer: um parecer pode ser facultativo (a Administração pode ou não solicitar), obrigatório (deve solicitar, mas não precisa seguir) ou vinculante (deve solicitar e seguir). O parecer normativo da AGU aprovado pelo Chefe do Executivo vincula.",
    explanationWrong:
      "O parecer não cria norma geral no sentido dos atos normativos — ele interpreta e aplica normas existentes. A vinculação decorre da aprovação pelo Presidente, não da natureza do ato (que permanece enunciativa).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c04_q05",
    contentId: "adm_aa_c04",
    statement:
      "A permissão de uso de bem público (ex.: barraca em calçada para ambulante) é ato:",
    alternatives: [
      { letter: "A", text: "Vinculado e definitivo — preenchidos os requisitos, o ambulante tem direito à permissão." },
      { letter: "B", text: "Discricionário e precário — a Administração pode revogar a qualquer tempo sem indenização, por razões de conveniência." },
      { letter: "C", text: "Vinculado com prazo — a Administração deve renovar automaticamente ao final do prazo." },
      { letter: "D", text: "Contrato administrativo — exige licitação e gera direito adquirido ao permissionário." },
      { letter: "E", text: "Ato punitivo — impõe restrição ao uso do bem público por terceiros." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A permissão de uso de bem público é ato discricionário e precário: a Administração concede o uso por razões de interesse público e pode revogar a qualquer momento, também por razões de interesse público (obras, outros usos, reorganização urbana), sem gerar indenização.",
    explanationCorrect:
      "A precariedade é a marca da permissão: o permissionário sabe que o uso pode cessar a qualquer tempo. Por isso, não faz grandes investimentos — o risco é dele. Se a Administração impuser prazo e criar expectativa legítima de continuidade, pode surgir direito à indenização por revogação antecipada.",
    explanationWrong:
      "A permissão de uso de bem público é ato unilateral da Administração, não contrato. A concessão de uso (modalidade mais estável) é contratual e gera mais proteção ao concessionário. A permissão de serviço público tem algumas características contratuais, mas a de bem público é ato precário.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c04_q06",
    contentId: "adm_aa_c04",
    statement:
      "A apostila é ato administrativo enunciativo que tem por função:",
    alternatives: [
      { letter: "A", text: "Criar novo ato administrativo com efeitos modificativos." },
      { letter: "B", text: "Anotar, complementar ou retificar dado em ato preexistente, sem alterar-lhe o conteúdo essencial." },
      { letter: "C", text: "Aplicar sanção a servidor público por incorreção em documento oficial." },
      { letter: "D", text: "Substituir ato anulado por novo ato com conteúdo idêntico." },
      { letter: "E", text: "Convalidar retroativamente ato administrativo com vício de forma." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A apostila é ato enunciativo que serve para anotar ou retificar dados em atos existentes — sem alterar o conteúdo essencial. Exemplo: apostila em diploma para corrigir grafia do nome; apostila em portaria de nomeação para registrar progressão funcional.",
    explanationCorrect:
      "A apostila não cria, modifica nem extingue direitos — apenas anota ou corrige informação em documento preexistente. Tem natureza meramente declaratória: declara que aquela informação passou a constar do registro oficial.",
    explanationWrong:
      "A apostila não convalida nem substitui atos — essas funções pertencem a outros institutos (convalidação, substituição). Não é sancionatória. É uma anotação marginal ou complementar — nada mais.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── adm_aa_c05: Extinção: Anulação vs. Revogação ─────────────────────────

  {
    id: "adm_aa_c05_q01",
    contentId: "adm_aa_c05",
    statement:
      "O Judiciário pode anular ato administrativo legal por razões de conveniência e oportunidade?",
    alternatives: [
      { letter: "A", text: "Sim — o controle judicial é amplo e alcança qualquer vício, inclusive de mérito." },
      { letter: "B", text: "Não — o Judiciário apenas anula por ilegalidade; a revogação por mérito é exclusiva da Administração." },
      { letter: "C", text: "Sim, quando o ato prejudicar direitos fundamentais do administrado." },
      { letter: "D", text: "Sim, mas apenas em ação popular proposta por cidadão." },
      { letter: "E", text: "Não, mas pode declarar a conveniência de revogação, vinculando a Administração." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Judiciário controla a LEGALIDADE dos atos administrativos — não o mérito. Revogar por conveniência e oportunidade é prerrogativa exclusiva da Administração Pública. O Judiciário não pode revogar ato legal por entender que existe opção melhor.",
    explanationCorrect:
      "A Súmula 473 do STF é clara: a própria Administração pode anular atos ilegais OU revogá-los por mérito. O Judiciário só anula — nunca revoga. Se o Judiciário revogasse atos por mérito, estaria substituindo a vontade administrativa e violando a separação de poderes.",
    explanationWrong:
      "Ação popular pode questionar atos lesivos ao patrimônio público, à moralidade, ao meio ambiente ou ao patrimônio histórico — mas o fundamento ainda é a ilegalidade/imoralidade, não a simples inconveniência. O juiz que julga a ação popular anula; não revoga.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c05_q02",
    contentId: "adm_aa_c05",
    statement:
      "O prazo decadencial de 5 anos para a Administração anular seus atos que geraram efeitos favoráveis ao particular de boa-fé (Art. 54 da Lei 9.784/99) tem como objetivo:",
    alternatives: [
      { letter: "A", text: "Punir a Administração pela demora em detectar irregularidades." },
      { letter: "B", text: "Proteger a segurança jurídica e a confiança legítima do administrado que agiu de boa-fé sob um ato que presumia legítimo." },
      { letter: "C", text: "Tornar permanentes todos os atos administrativos após 5 anos, independentemente de vício." },
      { letter: "D", text: "Compensar o particular financeiramente pela demora na anulação." },
      { letter: "E", text: "Restringir o controle judicial de atos administrativos antigos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 54 da Lei 9.784/99 protege a segurança jurídica e a confiança legítima: o particular que agiu de boa-fé em consonância com um ato administrativo não pode ser prejudicado indefinidamente por vício que a própria Administração demorou a detectar.",
    explanationCorrect:
      "Após 5 anos, o ato se convalida pela decadência — mesmo sendo ilegal, a Administração perde o poder de anulá-lo de ofício. O particular mantém os efeitos favoráveis. Exceção: má-fé do particular (que obteve o ato mediante fraude) afasta a proteção do Art. 54.",
    explanationWrong:
      "O prazo não pune a Administração — é norma de proteção ao administrado. Não torna os atos permanentes em absoluto: atos que causam danos a terceiros ou ao erário podem ser atacados por outros meios (ação popular, ação civil pública) mesmo após os 5 anos.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c05_q03",
    contentId: "adm_aa_c05",
    statement:
      "Atos administrativos que geraram direito adquirido ao particular:",
    alternatives: [
      { letter: "A", text: "Podem ser revogados normalmente — a revogação é poder soberano da Administração." },
      { letter: "B", text: "Não podem ser revogados (direito adquirido é limite à revogação), mas podem ser anulados se ilegais." },
      { letter: "C", text: "São irrevogáveis E inanuláveis — geram proteção absoluta ao particular." },
      { letter: "D", text: "Podem ser revogados com indenização ao titular do direito adquirido." },
      { letter: "E", text: "Dependem de aprovação do Congresso para revogação quando envolvam servidores públicos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Atos que geraram direito adquirido são IRREVOGÁVEIS: a Administração não pode usar a conveniência e oportunidade para desfazê-los. Contudo, se ilegais, podem ser ANULADOS — a ilegalidade não é sanada pelo direito adquirido (salvo decadência do Art. 54 da Lei 9.784/99).",
    explanationCorrect:
      "Exemplo: servidor que completou os requisitos de aposentadoria e já está aposentado tem direito adquirido — a aposentadoria não pode ser revogada por mudança de critério. Mas se a aposentadoria foi obtida com fraude (ilegalidade), pode ser anulada mesmo após anos.",
    explanationWrong:
      "A revogação com indenização não está prevista em lei como regra geral — exceto nas hipóteses de responsabilidade civil do Estado. A irrevogabilidade do ato com direito adquirido é absoluta (não há revogação compensada). A aprovação do Congresso não é requisito para revogação.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c05_q04",
    contentId: "adm_aa_c05",
    statement:
      "A anulação do ato administrativo tem efeito ex tunc. A consequência prática desse efeito retroativo é:",
    alternatives: [
      { letter: "A", text: "Os efeitos do ato são mantidos até a data da anulação — o ex tunc afeta apenas os efeitos futuros." },
      { letter: "B", text: "O ato é considerado inválido desde o início — todos os efeitos produzidos devem ser desfeitos, como se o ato nunca tivesse existido." },
      { letter: "C", text: "O ex tunc aplica-se apenas à anulação judicial — a anulação administrativa tem efeito ex nunc." },
      { letter: "D", text: "Os terceiros de boa-fé que se beneficiaram do ato anulado perdem todos os seus direitos imediatamente." },
      { letter: "E", text: "O ex tunc apenas retroage a 5 anos — limite máximo da retroação administrativa." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O efeito ex tunc da anulação significa retroatividade à data da prática do ato: juridicamente, o ato nunca existiu. Os efeitos produzidos devem ser desfeitos — inclusive pagamentos feitos, concessões, atos derivados do ato nulo.",
    explanationCorrect:
      "Exceção importante: terceiros de boa-fé que se beneficiaram do ato nulo podem ter proteção — a retroação não pode sempre atingi-los. O STJ/STF protegem o terceiro de boa-fé em algumas hipóteses (Ex.: demissão de servidor nomeado ilegalmente — os atos praticados por ele durante o período são válidos — teoria do funcionário de fato).",
    explanationWrong:
      "O ex tunc não se limita a 5 anos — esse é o prazo decadencial para a Administração anular atos favoráveis ao particular de boa-fé (Art. 54 da Lei 9.784/99). A retroação da anulação judicial não tem esse limite temporal. Anulação administrativa e judicial têm o mesmo efeito ex tunc.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c05_q05",
    contentId: "adm_aa_c05",
    statement:
      "A cassação (modalidade de extinção do ato administrativo) diferencia-se da revogação porque:",
    alternatives: [
      { letter: "A", text: "A cassação tem efeito ex nunc; a revogação tem efeito ex tunc." },
      { letter: "B", text: "A cassação ocorre quando o beneficiário descumpre as condições sob as quais o ato foi concedido; a revogação ocorre por mérito administrativo superveniente." },
      { letter: "C", text: "A cassação é forma de anulação — ambos os institutos têm efeito ex tunc." },
      { letter: "D", text: "A cassação só se aplica a atos normativos; a revogação aplica-se a atos individuais." },
      { letter: "E", text: "São institutos idênticos — cassação é o termo usado no âmbito federal e revogação no estadual." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A cassação é modalidade de extinção do ato por descumprimento das condições impostas ao beneficiário: o ato era válido, mas o particular não cumpriu as obrigações que justificavam sua manutenção. Exemplo: cassação de alvará de funcionamento por violação de normas sanitárias.",
    explanationCorrect:
      "Diferenças: revogação = Administração decide por mérito que não quer mais o ato (sem ilicitude do particular). Cassação = o particular não cumpriu as condições do ato (ilicitude do beneficiário). Anulação = o ato nasceu com vício. Caducidade = mudança na legislação tornou o ato incompatível.",
    explanationWrong:
      "A cassação não é anulação — o ato era válido quando praticado; a extinção ocorre por fato posterior (descumprimento). A revogação pode ter efeito ex nunc; a cassação também tem efeito futuro (prospectivo). Ambas diferem da anulação (ex tunc).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c05_q06",
    contentId: "adm_aa_c05",
    statement:
      "A caducidade (como forma de extinção do ato administrativo) ocorre quando:",
    alternatives: [
      { letter: "A", text: "O prazo de validade do ato se extingue normalmente." },
      { letter: "B", text: "Superveniência de norma jurídica que torna o ato incompatível com o novo ordenamento — o ato caduca por incompatibilidade superveniente." },
      { letter: "C", text: "A Administração decide revogar o ato por razões de conveniência." },
      { letter: "D", text: "O beneficiário renuncia expressamente ao direito conferido pelo ato." },
      { letter: "E", text: "O ato é anulado pelo Judiciário por vício insanável." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A caducidade (ou decaimento) é a extinção do ato administrativo em razão de lei superveniente que tornou sua situação incompatível com o novo ordenamento. O ato era válido quando criado, mas uma nova lei o torna juridicamente insustentável.",
    explanationCorrect:
      "Exemplo: permissão de uso de área ribeirinha que era legal, mas nova legislação ambiental proibiu qualquer edificação na área. O ato caduca — não é anulação (o ato era legal) nem revogação (o fundamento não é mérito, mas incompatibilidade legal superveniente).",
    explanationWrong:
      "O término do prazo de validade é extinção natural (pelo esgotamento). A renúncia é extinção pela vontade do beneficiário. A revogação é extinção por mérito. A anulação é extinção por ilegalidade. A caducidade é extinção por incompatibilidade com nova lei.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── adm_aa_c06: Convalidação e Vícios do Ato Administrativo ──────────────

  {
    id: "adm_aa_c06_q01",
    contentId: "adm_aa_c06",
    statement:
      "A convalidação (sanatória) do ato administrativo tem efeito:",
    alternatives: [
      { letter: "A", text: "Ex nunc — sana o vício apenas para o futuro, mantendo a invalidade dos efeitos passados." },
      { letter: "B", text: "Ex tunc — retroage à data da prática do ato original, sanando o vício desde o início." },
      { letter: "C", text: "Suspensivo — suspende os efeitos do ato até que o vício seja comprovadamente sanado." },
      { letter: "D", text: "Condicionado — depende de aprovação do Congresso para produzir efeitos retroativos." },
      { letter: "E", text: "Prospectivo — vale somente para atos futuros da mesma natureza." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A convalidação tem efeito ex tunc: retroage à data da prática do ato original, sanando o vício desde o início. Isso significa que o ato convalidado é considerado válido desde quando foi praticado — não apenas a partir da convalidação.",
    explanationCorrect:
      "O efeito ex tunc da convalidação é fundamental: se tivesse efeito ex nunc, os efeitos produzidos entre a prática do ato viciado e a convalidação seriam inválidos. Com o efeito retroativo, preservam-se todos os efeitos produzidos pelo ato desde sua origem.",
    explanationWrong:
      "A convalidação não suspende os efeitos — ao contrário, os valida retroativamente. Não depende de aprovação do Congresso (é ato da própria Administração ou de autoridade superior). Não tem efeito prospectivo — sanear o passado é a sua essência.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c06_q02",
    contentId: "adm_aa_c06",
    statement:
      "Sobre os vícios sanáveis (convalidáveis) e insanáveis (que geram nulidade), assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "Vício de motivo (motivo falso) é sanável — a Administração pode apresentar novo motivo para convalidar o ato." },
      { letter: "B", text: "Vício de competência (salvo competência exclusiva e em razão da matéria) e vício de forma (salvo forma essencial) são sanáveis; vícios de objeto, finalidade e motivo são insanáveis." },
      { letter: "C", text: "Todos os vícios são sanáveis pela convalidação — a Administração tem ampla discricionariedade para decidir." },
      { letter: "D", text: "Vício de finalidade é sanável quando a Administração comprova que o fim público foi atingido." },
      { letter: "E", text: "Apenas o vício de forma é sanável — vícios de competência são sempre insanáveis." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A doutrina e a Lei 9.784/99 distinguem: vícios sanáveis (convalidáveis) — competência relativa e forma não essencial; vícios insanáveis (nulidade) — objeto ilícito, finalidade desviada (desvio de poder) e motivo inexistente ou falso. Vícios insanáveis só permitem anulação.",
    explanationCorrect:
      "Mnemônico CO-FO = sanáveis (COmpetência relativa + FOrma não essencial). OFiMo = insanáveis (Objeto + Finalidade + Motivo). A ratificação é a convalidação do vício de competência — a autoridade competente confirma o ato praticado pelo incompetente.",
    explanationWrong:
      "O vício de motivo (motivo falso ou inexistente) é insanável — não se pode apresentar novo motivo após o ato para convalidá-lo. A teoria dos motivos determinantes vincula o ato ao motivo declarado; motivo falso = ato nulo. Vício de finalidade (desvio de poder) é sempre insanável.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c06_q03",
    contentId: "adm_aa_c06",
    statement:
      "A convalidação é FACULDADE ou DEVER da Administração? Assinale a alternativa mais completa e correta:",
    alternatives: [
      { letter: "A", text: "É dever — a Administração deve sempre convalidar atos com vícios sanáveis para preservar os efeitos produzidos." },
      { letter: "B", text: "É faculdade — a Administração pode convalidar OU anular o ato com vício sanável, segundo a conveniência e oportunidade, desde que a decisão seja motivada e não cause prejuízo ao particular." },
      { letter: "C", text: "É obrigatória apenas quando o particular de boa-fé já exerceu os direitos decorrentes do ato." },
      { letter: "D", text: "É proibida — a Administração deve sempre anular atos viciados, por força do princípio da legalidade." },
      { letter: "E", text: "É dever apenas para vícios de competência — para vícios de forma, é faculdade." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A convalidação é FACULDADE da Administração: ela pode optar por convalidar (quando o vício é sanável e os efeitos úteis devem ser preservados) ou anular (quando a anulação atende melhor ao interesse público). A escolha deve ser motivada e razoável.",
    explanationCorrect:
      "A doutrina é majoritária no sentido de que a convalidação é discricionária: a Administração pondera os efeitos produzidos, os direitos dos particulares e o interesse público. Se a convalidação prejudicar terceiros ou o interesse público, é preferível a anulação.",
    explanationWrong:
      "A convalidação obrigatória criaria problemas: a Administração poderia ser forçada a manter ato que, embora sanável formalmente, cause dano real. A solução equilibrada é a faculdade motivada — o agente público decide, fundamentadamente, qual caminho melhor atende o interesse público.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c06_q04",
    contentId: "adm_aa_c06",
    statement:
      "A ratificação, como modalidade de convalidação, é utilizada para sanar o vício de:",
    alternatives: [
      { letter: "A", text: "Forma — o ato é refeito na forma correta." },
      { letter: "B", text: "Competência — a autoridade competente confirma o ato praticado pela autoridade incompetente." },
      { letter: "C", text: "Objeto — o conteúdo ilícito é corrigido pela autoridade superior." },
      { letter: "D", text: "Finalidade — a Administração declara que o fim público foi atingido." },
      { letter: "E", text: "Motivo — novo motivo é apresentado para justificar o ato." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A ratificação é a modalidade de convalidação que sana o vício de COMPETÊNCIA: a autoridade que tinha a competência para praticar o ato confirma e valida o ato praticado por quem não tinha a competência delegada ou legal.",
    explanationCorrect:
      "Exemplo: ato assinado por diretor sem delegação expressa — o Ministro (competente) o ratifica, sanando o vício de competência com efeito retroativo (ex tunc). A reforma é outra modalidade: mantém parte do ato e substitui a parte inválida por conteúdo novo.",
    explanationWrong:
      "Vício de forma: a forma correta é adotada retroativamente (convalidação de forma). Vício de objeto e de finalidade são insanáveis — não há modalidade de convalidação para eles. Vício de motivo inexistente ou falso também é insanável.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c06_q05",
    contentId: "adm_aa_c06",
    statement:
      "O ato administrativo praticado com objeto ilícito é:",
    alternatives: [
      { letter: "A", text: "Anulável — pode ser convalidado pela Administração com nova motivação." },
      { letter: "B", text: "Nulo — vício de objeto é insanável e não admite convalidação." },
      { letter: "C", text: "Ineficaz — produz efeitos, mas depende de confirmação posterior para ter validade plena." },
      { letter: "D", text: "Inexistente apenas se o objeto for impossível — objeto ilícito apenas enseja anulação." },
      { letter: "E", text: "Válido se a ilicitude for superveniente à prática do ato." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Vício de objeto é insanável: o ato com conteúdo ilícito (impossível, indeterminado ou que viola diretamente a lei) é NULO — não anulável, não convalidável. Só pode ser anulado, com efeito ex tunc.",
    explanationCorrect:
      "Exemplo: ato que demite servidor estável sem processo administrativo (objeto ilícito — viola Art. 41, §1° da CF). Esse ato é nulo — não pode ser ratificado, reformado ou confirmado. A demissão deve ser desfeita e o servidor reintegrado.",
    explanationWrong:
      "Ato anulável admite convalidação (vícios sanáveis). Ato nulo por vício insanável não admite. A distinção nulo × anulável no Direito Administrativo não segue exatamente o Direito Civil — no Direito Administrativo, os vícios insanáveis geram nulidade absoluta.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "adm_aa_c06_q06",
    contentId: "adm_aa_c06",
    statement:
      "A teoria do funcionário de fato ('de facto officer doctrine') reconhece que:",
    alternatives: [
      { letter: "A", text: "Funcionário que pratica atos sem cargo legal é sempre responsabilizado penalmente pelos atos praticados." },
      { letter: "B", text: "Os atos praticados por agente público investido irregularmente (cargo nulo ou anulado) são válidos em relação a terceiros de boa-fé, para preservar a segurança jurídica." },
      { letter: "C", text: "O funcionário de fato tem os mesmos direitos e deveres do funcionário de direito." },
      { letter: "D", text: "A nomeação irregular de funcionário gera direito à regularização automática do vínculo." },
      { letter: "E", text: "A teoria é inaplicável quando o cargo foi criado por lei inconstitucional." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A teoria do funcionário de fato protege os terceiros de boa-fé que se relacionaram com o agente público irregularmente investido: os atos por ele praticados são válidos para esses terceiros, pois eles não poderiam saber da irregularidade da investidura.",
    explanationCorrect:
      "Exemplo clássico: servidor nomeado em cargo declarado inconstitucional. Após a anulação da nomeação, os atos que praticou (certidões, decisões, autuações) permanecem válidos — não se pode punir o administrado de boa-fé pela irregularidade que foi do Estado.",
    explanationWrong:
      "O funcionário de fato não tem os mesmos direitos do de direito — não faz jus aos vencimentos normalmente (há divergência doutrinária sobre indenização pelo trabalho prestado). A teoria não regulariza o vínculo — apenas preserva os efeitos dos atos em relação a terceiros.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n========================================================");
  console.log("  SEED R49 — DENSIFICAÇÃO DIR_ADMINISTRATIVO adm_aa_*");
  console.log("========================================================\n");

  const refRows = (await db.execute(sql`
    SELECT "subjectId", "topicId" FROM "Content" WHERE id = 'adm_aa_c01' LIMIT 1
  `)) as any[];

  if (!refRows.length) {
    console.error("❌ Átomo adm_aa_c01 não encontrado. Execute seed-direito-adm-atos-r31.ts primeiro.");
    process.exit(1);
  }

  const subjectId = refRows[0].subjectId;
  const topicId   = refRows[0].topicId;
  console.log(`✅ subjectId: ${subjectId}`);
  console.log(`✅ topicId:   ${topicId}\n`);

  const contentIds = [...new Set(questions.map((q) => q.contentId))];
  for (const cid of contentIds) {
    const rows = (await db.execute(sql`SELECT id FROM "Content" WHERE id = ${cid} LIMIT 1`)) as any[];
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
  console.error("\n❌ ERRO no seed R49:", err.message ?? err);
  process.exit(1);
});
