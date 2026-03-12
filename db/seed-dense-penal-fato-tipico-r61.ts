/**
 * Seed R61 — Densificação: Direito Penal — Fato Típico
 * Modo: DENSIFICAÇÃO — átomos com IDs dinâmicos do seed-penal-fato-tipico-r26.ts.
 * ContentIds resolvidos em runtime por título + subjectId.
 *
 * Átomos-alvo (6 átomos × 6 questões = 36 questões):
 *   "Conceito Analítico de Crime: A Tripartição (Fato Típico, Ilicitude e Culpabilidade)"
 *   "Conduta: Comissiva e Omissiva (Omissão Própria e Imprópria — Os Garantes)"
 *   "Resultado e Nexo Causal: Teoria da Equivalência dos Antecedentes (Conditio Sine Qua Non)"
 *   "Tipicidade: Formal vs Material e o Princípio da Insignificância"
 *   "Dolo e Culpa: Dolo Direto, Eventual e Culpa Consciente — A Linha Divisória"
 *   "Iter Criminis: Da Cogitação à Consumação — Tentativa e Desistência Voluntária"
 *
 * Execução: git pull && npx tsx db/seed-dense-penal-fato-tipico-r61.ts
 */

import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

// Títulos exatos dos átomos (conforme criados no seed-penal-fato-tipico-r26.ts)
const ATOM_TITLES = {
  tripartição: "Conceito Analítico de Crime: A Tripartição (Fato Típico, Ilicitude e Culpabilidade)",
  conduta:     "Conduta: Comissiva e Omissiva (Omissão Própria e Imprópria — Os Garantes)",
  nexo:        "Resultado e Nexo Causal: Teoria da Equivalência dos Antecedentes (Conditio Sine Qua Non)",
  tipicidade:  "Tipicidade: Formal vs Material e o Princípio da Insignificância",
  doloculpa:   "Dolo e Culpa: Dolo Direto, Eventual e Culpa Consciente — A Linha Divisória",
  iter:        "Iter Criminis: Da Cogitação à Consumação — Tentativa e Desistência Voluntária",
} as const;

type AtomKey = keyof typeof ATOM_TITLES;

interface Question {
  id: string;
  atomKey: AtomKey;
  statement: string;
  alternatives: Array<{ letter: string; text: string }>;
  correctAnswer: string;
  correctOption: number;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  questionType: "MULTIPLA_ESCOLHA" | "CERTO_ERRADO";
}

const questions: Question[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 1 — Tripartição: Fato Típico, Ilicitude e Culpabilidade
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "pen_tri_q01",
    atomKey: "tripartição",
    statement: "Julgue: Pela teoria tripartida, crime é toda conduta típica, ilícita e culpável — a ausência de qualquer desses três substratos afasta a existência do crime.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Teoria tripartida (majoritária no Brasil e adotada pelo STF/STJ): crime = fato típico + ilicitude (antijuridicidade) + culpabilidade. Se qualquer substrato faltar — ex.: excludente de tipicidade, causa de justificação ou causa de exculpação — não há crime.",
    explanationWrong: "Teorias do conceito de crime: Tripartida (fato típico + ilicitude + culpabilidade) — majoritária. Bipartida (fato típico + ilicitude; culpabilidade = pressuposto da pena) — minoritária. Quadripartida (acrescenta punibilidade). Para concursos, adotar a tripartida salvo indicação contrária.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "pen_tri_q02",
    atomKey: "tripartição",
    statement: "Um agente pratica fato típico e ilícito, mas possui doença mental que o tornava inteiramente incapaz de entender o caráter ilícito do fato. Segundo a teoria tripartida:",
    alternatives: [
      { letter: "A", text: "Há crime, pois o fato típico e ilícito já é suficiente para a condenação." },
      { letter: "B", text: "Não há crime, pois falta a culpabilidade — o agente pode receber medida de segurança." },
      { letter: "C", text: "Não há crime nem medida de segurança, pois a ausência de culpabilidade extingue toda responsabilidade." },
      { letter: "D", text: "Há crime, mas a doença mental é apenas atenuante da pena." },
      { letter: "E", text: "Depende do tipo penal praticado — para crimes hediondos, a inimputabilidade não afasta o crime." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Inimputabilidade por doença mental (art. 26 CP) afasta a culpabilidade → não há crime na teoria tripartida. Mas o fato continua sendo típico e ilícito → o juiz pode aplicar medida de segurança (internação ou tratamento ambulatorial) em vez de pena.",
    explanationWrong: "Inimputável (art. 26 CP): isento de pena, mas pode receber medida de segurança. Diferença: pena (pressupõe culpabilidade) vs medida de segurança (pressupõe periculosidade — fato típico e ilícito). Teoria tripartida: sem culpabilidade = sem crime = sem pena; mas medida de segurança é possível.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tri_q03",
    atomKey: "tripartição",
    statement: "Julgue: Na teoria bipartida, a culpabilidade é pressuposto da pena, não elemento do crime — portanto, para que haja crime basta fato típico e ilícito.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Teoria bipartida (Welzel, Jescheck): crime = fato típico + ilicitude. A culpabilidade é pressuposto de aplicação da pena, não elemento do crime. Para essa teoria, o inimputável comete crime (fato típico e ilícito), mas não pode ser punido por ausência de culpabilidade.",
    explanationWrong: "Bipartida: crime = fato típico + ilícito; culpabilidade → pressuposto da pena. Tripartida: crime = fato típico + ilícito + culpável. Na prática para concursos: a diferença aparece no inimputável — pela bipartida ele comete crime (mas não é punido); pela tripartida não comete crime (falta culpabilidade).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "pen_tri_q04",
    atomKey: "tripartição",
    statement: "A legítima defesa é causa que afasta qual dos substratos do conceito analítico de crime?",
    alternatives: [
      { letter: "A", text: "Tipicidade — o fato deixa de ser típico." },
      { letter: "B", text: "Culpabilidade — afasta a imputabilidade do agente." },
      { letter: "C", text: "Ilicitude (antijuridicidade) — o fato é típico, mas não é ilícito." },
      { letter: "D", text: "Punibilidade — o crime existe, mas a pena é extinta." },
      { letter: "E", text: "Tipicidade material — o fato é formalmente típico, mas insignificante." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. A legítima defesa (art. 25 CP) é causa de exclusão da ILICITUDE (antijuridicidade). O fato permanece típico (ex.: lesão corporal ou homicídio), mas não é ilícito — o ordenamento jurídico autoriza a conduta defensiva. Resultado: sem ilicitude = sem crime.",
    explanationWrong: "Causas de exclusão da ilicitude (art. 23 CP): estado de necessidade, legítima defesa, estrito cumprimento do dever legal, exercício regular do direito. Causas de exclusão da tipicidade: atipicidade formal, princípio da insignificância. Causas de exclusão da culpabilidade: inimputabilidade, erro de proibição inevitável, coação moral irresistível.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tri_q05",
    atomKey: "tripartição",
    statement: "Julgue: O erro de proibição inevitável (art. 21 CP) afasta a culpabilidade, enquanto o erro de tipo essencial inevitável (art. 20 CP) afasta a tipicidade.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Erro de tipo inevitável (art. 20 CP): o agente não conhece elementar do tipo → afasta dolo e culpa → exclui a tipicidade. Erro de proibição inevitável (art. 21 CP): o agente não sabe que a conduta é proibida → afasta a culpabilidade (potencial consciência da ilicitude). Ambos isentam de pena, mas por substratos diferentes.",
    explanationWrong: "Erro de tipo: recai sobre elementares do fato (ex.: agente que furta coisa própria pensando ser alheia) → afasta tipicidade (inevitável) ou apenas o dolo (evitável, responde por culpa). Erro de proibição: recai sobre a ilicitude (ex.: crê que a conduta é permitida) → afasta culpabilidade (inevitável) ou atenua a pena (evitável).",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "pen_tri_q06",
    atomKey: "tripartição",
    statement: "Para a teoria finalista da ação (Hans Welzel), o dolo e a culpa integram:",
    alternatives: [
      { letter: "A", text: "A culpabilidade — são elementos do juízo de reprovação." },
      { letter: "B", text: "O fato típico — são elementos subjetivos do tipo penal." },
      { letter: "C", text: "A ilicitude — determinam se a conduta é antijurídica." },
      { letter: "D", text: "A punibilidade — definem a pena aplicável." },
      { letter: "E", text: "Nenhum substrato — dolo e culpa são categorias processuais." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Teoria finalista (Welzel): o dolo e a culpa integram o FATO TÍPICO (elemento subjetivo do tipo). Isso é diferente da teoria causalista (clássica), para a qual dolo e culpa ficavam na culpabilidade. O finalismo é a teoria adotada pelo CP brasileiro de 1984 (Reforma da Parte Geral).",
    explanationWrong: "Causalismo (Von Liszt/Beling): ação é movimento corporal causal; dolo e culpa → culpabilidade. Finalismo (Welzel): ação é comportamento humano final (dirigido a um fim); dolo e culpa → fato típico. O CP/84 adotou o finalismo: art. 18 define dolo e culpa como elementos do tipo, não da culpabilidade.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 2 — Conduta: Comissiva, Omissiva e Os Garantes
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "pen_cnd_q01",
    atomKey: "conduta",
    statement: "Julgue: A omissão própria (pura) ocorre quando o tipo penal descreve expressamente o não agir, como na omissão de socorro (art. 135 CP), dispensando a posição de garante.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Omissão própria (pura): o tipo penal descreve o não-fazer (ex.: art. 135 — omissão de socorro; art. 269 — omissão de notificação). Qualquer pessoa pode ser sujeito ativo — não exige posição de garante. O crime se consuma com a simples omissão, independentemente de resultado.",
    explanationWrong: "Omissão própria: tipo descreve o não-agir → qualquer pessoa pode praticar (crime comum). Omissão imprópria (comissão por omissão, art. 13, §2º CP): o tipo descreve ação (ex.: homicídio), mas o agente garante se omite → responde como se tivesse causado ativamente o resultado. Exige posição de garante.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "pen_cnd_q02",
    atomKey: "conduta",
    statement: "São fontes do dever jurídico de agir (posição de garante), conforme o art. 13, §2º do CP:",
    alternatives: [
      { letter: "A", text: "Apenas a lei — somente obrigação legal cria o dever de garante." },
      { letter: "B", text: "Lei, contrato e criação do risco pela conduta anterior do próprio agente." },
      { letter: "C", text: "Moral, religião e lei — qualquer obrigação ética cria o dever de agir." },
      { letter: "D", text: "Apenas contrato e criação do risco — a lei não é fonte de garante." },
      { letter: "E", text: "Solidariedade humana — toda pessoa próxima da vítima é garante." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Art. 13, §2º CP — três fontes do dever de garante: ① Obrigação legal (ex.: pais em relação a filhos, bombeiro em serviço); ② Contrato ou assunção voluntária (ex.: babá, salva-vidas, cuidador); ③ Ingerência — criação do risco pela conduta anterior do próprio agente (ex.: acende fogo, tem dever de apagar).",
    explanationWrong: "Fontes do garante (art. 13, §2º CP): a) lei (dever legal); b) assunção de responsabilidade por contrato ou de fato (ingerência negocial); c) comportamento anterior criador do risco (ingerência). Mnemônico: L-A-I (Lei, Assunção/contrato, Ingerência). Apenas essas três fontes são reconhecidas pelo CP.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_cnd_q03",
    atomKey: "conduta",
    statement: "Julgue: Um socorrista voluntário que assume o salvamento de uma vítima e depois abandona o resgate — tornando a situação pior — passa a ter dever jurídico de agir (garante por assunção).",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Garante por assunção: quem voluntariamente assume a responsabilidade pelo bem jurídico alheio (mesmo sem obrigação legal ou contratual prévia) torna-se garante. Se depois se omitir e o resultado ocorrer, responde por omissão imprópria. A assunção voluntária cria o vínculo de garante.",
    explanationWrong: "Garante por assunção (art. 13, §2º, 'b' CP): ingerência negocial — quem assume de fato a proteção de outrem. Exemplos: médico de plantão que assume o caso, banhista que começa a socorrer e para. A assunção voluntária cria responsabilidade: ao abandonar sem transferir a outro, responde pelo resultado.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "pen_cnd_q04",
    atomKey: "conduta",
    statement: "Na omissão imprópria (comissão por omissão), o garante que se omite e o resultado ocorre responde:",
    alternatives: [
      { letter: "A", text: "Por crime omissivo próprio (ex.: omissão de socorro) com pena reduzida." },
      { letter: "B", text: "Pelo crime comissivo correspondente ao resultado (ex.: homicídio), como se tivesse agido ativamente." },
      { letter: "C", text: "Apenas por responsabilidade civil, sem repercussão penal." },
      { letter: "D", text: "Por tentativa do crime comissivo, nunca pela forma consumada." },
      { letter: "E", text: "Pelo crime mais leve, em razão da menor reprovabilidade da omissão." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Omissão imprópria: o garante responde pelo crime comissivo correspondente ao resultado. Ex.: mãe que deixa filho morrer de fome responde por homicídio (art. 121 CP), não por omissão de socorro (art. 135). A omissão do garante equivale causalmente à ação (art. 13, §2º CP).",
    explanationWrong: "Omissão própria: responde pelo tipo omissivo descrito (ex.: art. 135 — omissão de socorro). Omissão imprópria: responde pelo crime do resultado (ex.: homicídio, lesão corporal). A diferença é crucial: no impróprio, a omissão é equiparada à causação ativa porque havia dever jurídico de evitar o resultado.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_cnd_q05",
    atomKey: "conduta",
    statement: "Julgue: A teoria finalista exige que a conduta seja um comportamento humano voluntário e consciente, dirigido a uma finalidade — atos reflexos e movimentos em inconsciência absoluta não são condutas penalmente relevantes.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Pelo finalismo, conduta é comportamento humano, voluntário, consciente, dirigido a um fim. Atos reflexos (espirro, contração reflexa), movimentos em estado de inconsciência absoluta (sonambulismo, convulsão), coação física irresistível — não são condutas, afastando a tipicidade desde a base.",
    explanationWrong: "Ausência de conduta: ① Atos reflexos (reação neuromuscular automática); ② Coação física irresistível (vis absoluta — o agente é mero instrumento); ③ Movimentos em inconsciência total (sonambulismo, convulsão, hipnose profunda). Nesses casos não há conduta → não há fato típico → não há crime.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "pen_cnd_q06",
    atomKey: "conduta",
    statement: "O pai que deliberadamente não alimenta o filho recém-nascido e este morre de inanição responde por:",
    alternatives: [
      { letter: "A", text: "Omissão de socorro (art. 135 CP) — crime omissivo próprio." },
      { letter: "B", text: "Abandono de incapaz (art. 133 CP) — único tipo aplicável ao pai." },
      { letter: "C", text: "Homicídio doloso (art. 121 CP) — omissão imprópria, garante por lei." },
      { letter: "D", text: "Nenhum crime — pais têm dever moral, não jurídico." },
      { letter: "E", text: "Lesão corporal seguida de morte — nunca homicídio em forma omissiva." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. O pai é garante por LEI (art. 13, §2º, 'a' CP + art. 229 CF). Ao deliberadamente omitir-se e causar a morte do filho, pratica homicídio doloso por omissão imprópria (art. 121 c/c art. 13, §2º CP). É um dos exemplos clássicos de omissão imprópria em concursos.",
    explanationWrong: "Garante legal: pais (em relação a filhos), tutores, curadores, cônjuges entre si em situação de perigo. Omissão imprópria: garante + omissão + resultado = crime comissivo correspondente. Pai que não alimenta filho → garante por lei → omissão imprópria → homicídio doloso (se queria a morte) ou culposo (se imprudente).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 3 — Resultado e Nexo Causal: Teoria da Equivalência
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "pen_nxc_q01",
    atomKey: "nexo",
    statement: "Julgue: Pela teoria da equivalência dos antecedentes (conditio sine qua non), considera-se causa do resultado toda condição que, suprimida mentalmente, faria desaparecer o resultado concreto.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Processo hipotético de eliminação (Thyrén): suprima mentalmente a conduta; se o resultado desaparecer → a conduta É causa. Se o resultado persistiria mesmo sem a conduta → não é causa. Art. 13, caput CP: 'O resultado, de que depende a existência do crime, somente é imputável a quem lhe deu causa.'",
    explanationWrong: "Teoria adotada pelo CP (regra geral, art. 13 caput): equivalência dos antecedentes. Crítica: regressus ad infinitum (causa da causa, causa de toda causa...). Solução do CP: filtra-se pelo dolo e pela culpa — só responde quem agiu com dolo ou culpa (art. 18 CP), evitando regressão infinita.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "pen_nxc_q02",
    atomKey: "nexo",
    statement: "Uma causa superveniente relativamente independente que, por si só, produziu o resultado (ex.: vítima morre de infecção hospitalar adquirida durante cirurgia decorrente do crime) tem qual efeito sobre o nexo causal?",
    alternatives: [
      { letter: "A", text: "Não afeta o nexo — o agente continua respondendo pelo resultado morte." },
      { letter: "B", text: "Exclui o nexo causal — o agente responde apenas pelos atos anteriores (art. 13, §1º CP)." },
      { letter: "C", text: "Exclui apenas a ilicitude, sem afetar o nexo causal." },
      { letter: "D", text: "Afasta a culpabilidade, mas mantém o fato típico." },
      { letter: "E", text: "Somente exclui o nexo se a causa superveniente for dolosa." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Art. 13, §1º CP: a causa superveniente RELATIVAMENTE independente que por si só produziu o resultado exclui o nexo — o agente responde pelos fatos anteriores. Ex.: agente dá facada; vítima morre de infecção hospitalar (causa superveniente que por si só produziu a morte) → agente responde por tentativa, não por homicídio consumado.",
    explanationWrong: "Art. 13, §1º CP — causa superveniente relativamente independente: ① Se 'por si só produziu o resultado' → EXCLUI o nexo → agente responde pelos atos até então. ② Se é desdobramento normal (complicação cirúrgica direta, embolia pulmonar pós-lesão) → NÃO exclui → agente responde pelo resultado. Causas preexistentes e concomitantes: não excluem o nexo.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_nxc_q03",
    atomKey: "nexo",
    statement: "Julgue: Causas preexistentes relativamente independentes (ex.: vítima hemofílica que morre de hemorragia por lesão que normalmente não seria fatal) NÃO excluem o nexo causal — o agente responde pelo resultado morte.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Causas preexistentes (existiam antes da conduta) e concomitantes (surgem ao mesmo tempo) relativamente independentes NÃO excluem o nexo causal. A regra do art. 13, §1º CP (exclusão do nexo) só se aplica a causas SUPERVENIENTES. Pelo processo de eliminação: sem a lesão, a morte não ocorreria → conduta É causa.",
    explanationWrong: "Regra: causas preexistentes e concomitantes relativamente independentes → NÃO excluem o nexo → agente responde pelo resultado. Exceção (art. 13, §1º CP): causa SUPERVENIENTE relativamente independente que POR SI SÓ produziu o resultado → exclui o nexo. Tabela: Preexistente/Concomitante = responde; Superveniente 'por si só' = não responde pelo resultado.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "pen_nxc_q04",
    atomKey: "nexo",
    statement: "O 'processo hipotético de eliminação' (fórmula de Thyrén), utilizado na teoria da equivalência, consiste em:",
    alternatives: [
      { letter: "A", text: "Eliminar fisicamente o agente do local e verificar se o crime teria ocorrido." },
      { letter: "B", text: "Suprimir mentalmente a conduta e verificar se o resultado desapareceria." },
      { letter: "C", text: "Calcular a probabilidade estatística de que a conduta causaria o resultado." },
      { letter: "D", text: "Identificar apenas a causa mais próxima (imediata) do resultado." },
      { letter: "E", text: "Somar todas as causas concorrentes e atribuir responsabilidade proporcional." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Processo hipotético de eliminação: mentalmente elimine a conduta do agente. Se o resultado também desaparece → a conduta é causa (conditio sine qua non). Se o resultado persistiria de qualquer modo → a conduta não é causa do resultado específico.",
    explanationWrong: "Fórmula: suprima a conduta → resultado some? SIM → é causa. Não → não é causa. Limitação: pode indicar causas de causas de causas (regressus ad infinitum). Solução: o dolo e a culpa (art. 18 CP) filtram quem responde penalmente — não basta ser causa, precisa ter agido com dolo ou culpa.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_nxc_q05",
    atomKey: "nexo",
    statement: "Julgue: O art. 13, caput do CP adota como regra geral a teoria da equivalência dos antecedentes causais (conditio sine qua non) para definir o nexo causal nos crimes materiais.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Art. 13, caput CP: 'O resultado, de que depende a existência do crime, somente é imputável a quem lhe deu causa. Considera-se causa a ação ou omissão sem a qual o resultado não teria ocorrido.' — Esta é exatamente a definição da teoria da equivalência dos antecedentes (conditio sine qua non).",
    explanationWrong: "CP, art. 13: adota a equivalência (conditio sine qua non) como regra. Exceção: art. 13, §1º — causas supervenientes relativamente independentes que por si só produzem o resultado quebram o nexo. A teoria da imputação objetiva não está prevista no CP, mas é admitida por parte da doutrina como filtro adicional.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "pen_nxc_q06",
    atomKey: "nexo",
    statement: "Para evitar o 'regressus ad infinitum' na teoria da equivalência dos antecedentes, o Código Penal utiliza como filtro:",
    alternatives: [
      { letter: "A", text: "A teoria da causalidade adequada — só é causa a conduta apta a produzir o resultado." },
      { letter: "B", text: "O dolo e a culpa — só responde penalmente quem agiu com dolo ou culpa (art. 18 CP)." },
      { letter: "C", text: "O princípio da insignificância — condutas sem lesividade não geram nexo." },
      { letter: "D", text: "A teoria do risco — só responde quem criou risco juridicamente desaprovado." },
      { letter: "E", text: "A tipicidade formal — apenas condutas previstas expressamente em tipo penal têm nexo causal." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. A solução do CP para o regressus ad infinitum é o elemento subjetivo: só é responsabilizado penalmente quem agiu com DOLO ou CULPA (art. 18 CP). Ex.: o marceneiro que vendeu a faca que foi usada no homicídio é 'causa' pela equivalência, mas não responde porque não agiu com dolo ou culpa.",
    explanationWrong: "Regressus ad infinitum: pela equivalência, a causa da causa também é causa (ex.: fabricante da arma é causa do homicídio). Solução do CP: exigência de dolo ou culpa (art. 18). Sem dolo nem culpa, não há responsabilidade penal — mesmo que haja nexo causal físico. 'Salvo os casos expressos em lei' (art. 18, parágrafo único) = nulla poena sine culpa.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 4 — Tipicidade: Formal vs Material e Insignificância
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "pen_tip_q01",
    atomKey: "tipicidade",
    statement: "Julgue: A tipicidade formal consiste na mera adequação do fato concreto à descrição abstrata do tipo penal, sem análise da relevância da lesão ao bem jurídico.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Tipicidade formal: subsunção do fato ao tipo penal — verificação se o comportamento do agente corresponde a todos os elementos descritos na norma penal (ex.: subtrair coisa alheia móvel = tipo do furto). Não analisa a gravidade ou relevância da lesão — isso é tipicidade material.",
    explanationWrong: "Tipicidade formal: adequação fato-norma (subsunção). Tipicidade material: exige lesão relevante ao bem jurídico (antecipação do princípio da lesividade no tipo). Tipicidade conglobante (Zaffaroni): exige que o ato não seja imposto ou fomentado por outra norma do ordenamento. O CP adota tipicidade formal + material.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "pen_tip_q02",
    atomKey: "tipicidade",
    statement: "O princípio da insignificância (bagatela) afeta qual aspecto da tipicidade?",
    alternatives: [
      { letter: "A", text: "A tipicidade formal — o fato não se enquadra no tipo penal." },
      { letter: "B", text: "A ilicitude — o fato é típico, mas a lesão mínima justifica a conduta." },
      { letter: "C", text: "A tipicidade material — o fato é formalmente típico, mas a lesão é insignificante." },
      { letter: "D", text: "A culpabilidade — a reprovabilidade é tão baixa que afasta o juízo de censura." },
      { letter: "E", text: "A punibilidade — o fato é crime, mas a pena não é aplicada." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. O princípio da insignificância afasta a TIPICIDADE MATERIAL: o fato é formalmente típico (adequado ao tipo), mas não apresenta lesão de magnitude relevante ao bem jurídico. Sem tipicidade material → sem tipicidade plena → sem crime. É construção doutrinária e jurisprudencial, não previsto expressamente no CP.",
    explanationWrong: "Insignificância: afasta tipicidade MATERIAL (lesão irrelevante ao bem jurídico). O fato continua formalmente típico (ex.: subtração de objeto de R$ 5 = formalmente furto). Mas sem lesividade relevante → ausência de tipicidade material → atipicidade → sem crime. Diferente de excludente de ilicitude (que pressupõe tipicidade completa).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tip_q03",
    atomKey: "tipicidade",
    statement: "Julgue: Segundo o STF, os vetores para aplicação do princípio da insignificância são: mínima ofensividade da conduta, ausência de periculosidade social da ação, reduzido grau de reprovabilidade do comportamento e inexpressividade da lesão jurídica.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. STF fixou 4 vetores (HC 84.412/SP, Rel. Min. Celso de Mello): ① Mínima ofensividade da conduta; ② Ausência de periculosidade social da ação; ③ Reduzido grau de reprovabilidade do comportamento; ④ Inexpressividade da lesão jurídica. TODOS devem estar presentes simultaneamente.",
    explanationWrong: "4 vetores STF (mnemônico MARE): Mínima ofensividade, Ausência de periculosidade social, Reduzido grau de reprovabilidade, Expressividade mínima da lesão. Devem ser CUMULATIVOS. A falta de qualquer um impede a aplicação do princípio. Ex.: reincidente habitual tem alto grau de reprovabilidade → pode ser impedido de aplicar insignificância.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "pen_tip_q04",
    atomKey: "tipicidade",
    statement: "Um servidor público furta R$ 25,00 do erário. O princípio da insignificância:",
    alternatives: [
      { letter: "A", text: "Deve ser aplicado, pois R$ 25,00 é valor ínfimo em qualquer contexto." },
      { letter: "B", text: "Não se aplica aos crimes contra a administração pública, segundo jurisprudência consolidada do STJ/STF." },
      { letter: "C", text: "Aplica-se, pois a quantia não supera o salário mínimo." },
      { letter: "D", text: "Aplica-se apenas se o servidor for réu primário e de bons antecedentes." },
      { letter: "E", text: "Aplica-se automaticamente para furtos abaixo de R$ 100,00." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. STJ e STF (majoritário): o princípio da insignificância NÃO se aplica aos crimes contra a Administração Pública, pois a moralidade administrativa e a probidade são bens jurídicos que não se medem apenas pelo valor subtraído. A conduta do servidor afeta a confiança pública nas instituições.",
    explanationWrong: "Crimes onde STJ/STF recusam a insignificância (mesmo em valores baixos): crimes contra a Administração Pública (peculato, corrupção), tráfico de drogas, crimes de violência doméstica (Lei Maria da Penha), roubo, extorsão. Nesses, o bem jurídico tutelado vai além do valor material lesado.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tip_q05",
    atomKey: "tipicidade",
    statement: "Julgue: A adequação típica por subordinação mediata (extensão) ocorre quando, para a subsunção do fato ao tipo penal, é necessária a utilização de uma norma de extensão — como as regras da tentativa ou da participação.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Adequação típica imediata: o fato se enquadra diretamente no tipo (ex.: homicídio consumado). Mediata (por extensão): a adequação exige uma norma extensiva da Parte Geral. Ex.: tentativa (art. 14, II CP) + tipo da Parte Especial; participação (art. 29 CP) + tipo da Parte Especial.",
    explanationWrong: "Adequação típica imediata: fato → tipo diretamente (sem norma extensiva). Mediata: fato → norma extensiva + tipo (ex.: tentativa de homicídio = art. 121 + art. 14, II; participação em furto = art. 155 + art. 29). As normas extensivas da Parte Geral ampliam a incidência dos tipos da Parte Especial.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "pen_tip_q06",
    atomKey: "tipicidade",
    statement: "A diferença entre tipo penal aberto e tipo penal fechado está em que:",
    alternatives: [
      { letter: "A", text: "O tipo fechado exige interpretação analógica; o aberto não admite analogia." },
      { letter: "B", text: "O tipo aberto exige complementação pelo julgador (ex.: crimes culposos); o tipo fechado é totalmente descrito na lei." },
      { letter: "C", text: "Tipos abertos são inconstitucionais por violar o princípio da legalidade." },
      { letter: "D", text: "O tipo fechado é exclusivo de crimes dolosos; o aberto é exclusivo de contravenções." },
      { letter: "E", text: "Não há diferença prática — ambos têm a mesma técnica de redação." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Tipo fechado: todos os elementos estão descritos na lei (ex.: furto — art. 155 CP). Tipo aberto: a conduta proibida exige complementação valorativa pelo intérprete/julgador (ex.: crimes culposos — art. 18, II CP; crimes omissivos impróprios — art. 13, §2º CP). A culpa, em si, é cláusula aberta.",
    explanationWrong: "Tipo fechado: lei descreve completamente a conduta proibida (ex.: homicídio doloso, furto). Tipo aberto: requer valoração complementar para definir a conduta proibida (ex.: crimes culposos — o que é 'imprudência, negligência, imperícia' depende do caso concreto; tipos omissivos impróprios — depende de quem é garante). Tipos abertos são constitucionais — aceitos pela doutrina e pelo STF.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 5 — Dolo e Culpa: Dolo Direto, Eventual e Culpa Consciente
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "pen_dlc_q01",
    atomKey: "doloculpa",
    statement: "Julgue: Dolo de 2º grau (dolo de consequências necessárias) ocorre quando o agente, para atingir seu fim, aceita resultado colateral certo e necessário — não querido em si, mas inevitável.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Dolo direto de 2º grau: o agente quer o resultado principal (1º grau) e aceita o resultado colateral necessário (2º grau). Ex.: terrorista que explode aeronave para matar uma pessoa específica — aceita a morte dos demais passageiros como consequência necessária. É dolo direto, não eventual.",
    explanationWrong: "Dolo direto: ① 1º grau: o agente quer o resultado como fim (objetivo primário). ② 2º grau: o agente aceita resultado colateral certo e necessário (efeito lateral inevitável). Dolo eventual: resultado é possível, não certo — o agente 'assume o risco'. A certeza do efeito colateral é o que diferencia dolo de 2º grau do eventual.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "pen_dlc_q02",
    atomKey: "doloculpa",
    statement: "A diferença fundamental entre dolo eventual e culpa consciente é:",
    alternatives: [
      { letter: "A", text: "No dolo eventual o agente prevê o resultado; na culpa consciente ele não prevê." },
      { letter: "B", text: "No dolo eventual o agente ACEITA o resultado (assume o risco); na culpa consciente o agente ACREDITA que o resultado não ocorrerá." },
      { letter: "C", text: "Não há diferença — dolo eventual e culpa consciente são sinônimos no CP." },
      { letter: "D", text: "No dolo eventual o agente age por imprudência; na culpa consciente por negligência." },
      { letter: "E", text: "O dolo eventual exige planejamento prévio; a culpa consciente ocorre apenas em crimes instantâneos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Ambos envolvem PREVISÃO do resultado. O que os diferencia é a atitude interna: ① Dolo eventual: agente prevê o resultado e diz 'se ocorrer, tudo bem' — ACEITA, ASSUME O RISCO (art. 18, I, in fine CP). ② Culpa consciente: agente prevê o resultado mas confia sinceramente que ele não ocorrerá (imprudência consciente).",
    explanationWrong: "Linha divisória dolo eventual / culpa consciente: PREVISÃO: ambos têm. ACEITAÇÃO: dolo eventual — sim (assume o risco); culpa consciente — não (confia que não ocorrerá). Fórmula Frank: 'Se assim fosse, ainda agiria' (dolo eventual) vs 'Se assim fosse, não agiria' (culpa consciente). Diferença prática: racha → dolo eventual; excesso de velocidade → culpa consciente.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_dlc_q03",
    atomKey: "doloculpa",
    statement: "Julgue: O dolo eventual está expressamente previsto no art. 18, I, do CP, quando a lei refere que o agente 'assumiu o risco de produzi-lo'.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Art. 18, I CP: 'Diz-se o crime: I — doloso, quando o agente quis o resultado ou assumiu o risco de produzi-lo.' A primeira parte ('quis o resultado') = dolo direto. A segunda parte ('assumiu o risco') = dolo eventual. A distinção está no próprio texto legal.",
    explanationWrong: "Art. 18 CP: ① Dolo (inciso I): quis o resultado (direto) OU assumiu o risco (eventual). ② Culpa (inciso II): imprudência, negligência ou imperícia. Parágrafo único: salvo os casos expressos em lei, ninguém pode ser punido por fato previsto como crime sem ter agido com dolo ou culpa (culpabilidade subjetiva).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "pen_dlc_q04",
    atomKey: "doloculpa",
    statement: "Na culpa inconsciente, o agente:",
    alternatives: [
      { letter: "A", text: "Prevê o resultado mas confia que não ocorrerá." },
      { letter: "B", text: "Não prevê o resultado, mas era previsível para uma pessoa mediana." },
      { letter: "C", text: "Prevê o resultado e aceita que ele ocorra." },
      { letter: "D", text: "Não prevê o resultado e ele também era imprevisível." },
      { letter: "E", text: "Prevê o resultado e age para evitá-lo, mas sem sucesso." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Culpa inconsciente (sem previsão): o agente não prevê o resultado, mas este era PREVISÍVEL para uma pessoa comum de atenção e prudência medianas. O dever de cuidado foi violado por desatenção (negligência) ou falta de habilidade (imperícia). É a forma mais comum de culpa.",
    explanationWrong: "Formas de culpa: Inconsciente (sem previsão): não prevê, mas o resultado era objetivamente previsível. Consciente (com previsão): prevê, mas confia que não ocorrerá. A previsibilidade objetiva é essencial: se o resultado era imprevisível → caso fortuito → sem culpa → sem crime culposo.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_dlc_q05",
    atomKey: "doloculpa",
    statement: "Julgue: A teoria da vontade explica o dolo direto; a teoria do assentimento (consentimento) explica o dolo eventual.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Teoria da vontade: há dolo quando o agente quer o resultado (dolo direto). Teoria da representação: basta que o agente preveja o resultado como possível (critica: abrangeria também a culpa consciente). Teoria do assentimento (consentimento): dolo eventual quando o agente prevê e consente/aceita o resultado, mesmo não o querendo como fim.",
    explanationWrong: "Teorias do dolo: Vontade → dolo direto (quer o resultado). Assentimento → dolo eventual (prevê e aceita). Representação → basta prever como possível (inclui culpa consciente, por isso criticada). O CP brasileiro adota: vontade para dolo direto + assentimento para dolo eventual (art. 18, I: 'quis' + 'assumiu o risco').",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "pen_dlc_q06",
    atomKey: "doloculpa",
    statement: "Dois motoristas realizam racha em via pública. Um pedestre é atropelado e morre. Os motoristas respondem por:",
    alternatives: [
      { letter: "A", text: "Homicídio culposo (art. 302 CTB) — imprudência no trânsito." },
      { letter: "B", text: "Lesão corporal culposa — apenas se a vítima tivesse sobrevivido." },
      { letter: "C", text: "Homicídio doloso (dolo eventual — art. 121 CP) — assumiram o risco de matar." },
      { letter: "D", text: "Contravenção penal de direção perigosa — sem responsabilidade pelo resultado morte." },
      { letter: "E", text: "Homicídio culposo na modalidade imprudência + agravante de racha." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. Racha (velocidade extrema em via pública): STF e STJ firmaram que configura DOLO EVENTUAL — os agentes assumem o risco de matar ao disputar corrida em via pública. Resposta: homicídio doloso (art. 121 CP) — não culposo do CTB. A diferença importa: dolo → júri; culpa → juiz singular.",
    explanationWrong: "Racha → dolo eventual → homicídio doloso → competência do Tribunal do Júri. Homicídio culposo no trânsito (art. 302 CTB) → imprudência normal → juiz singular. O STF distingue: velocidade excessiva simples = culpa consciente; racha/acrobacia extrema = dolo eventual. A distinção tem enorme consequência processual e penal.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 6 — Iter Criminis: Cogitação à Consumação
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "pen_itr_q01",
    atomKey: "iter",
    statement: "Julgue: A cogitação (simples pensamento criminoso, sem qualquer ato externo) não é punível no direito penal brasileiro, em respeito ao princípio 'cogitationis poenam nemo patitur'.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. 'Cogitationis poenam nemo patitur' (ninguém é punido apenas por cogitar). A cogitação é fase interna, puramente mental — planejamento do crime sem qualquer ato externo. O direito penal só intervém a partir de atos externos (preparação tipificada ou execução). Punir pensamentos seria inquisitorial.",
    explanationWrong: "Iter criminis: ① Cogitação (fase interna — não punível); ② Preparação (fase externa, em regra não punível, salvo tipificação autônoma — ex.: petrechos de falsificação art. 291 CP); ③ Execução (punível como tentativa se não consumar); ④ Consumação (crime completo); ⑤ Exaurimento (posterior à consumação — influencia pena).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "pen_itr_q02",
    atomKey: "iter",
    statement: "Os atos preparatórios, em regra, são:",
    alternatives: [
      { letter: "A", text: "Puníveis como tentativa, pois já revelam a intenção criminosa." },
      { letter: "B", text: "Impuníveis, exceto quando tipificados autonomamente como crime independente." },
      { letter: "C", text: "Puníveis apenas nos crimes hediondos, pela gravidade elevada." },
      { letter: "D", text: "Sempre impuníveis — o direito penal não alcança nenhuma fase anterior à execução." },
      { letter: "E", text: "Puníveis se o agente possuir antecedentes criminais." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Atos preparatórios: em regra IMPUNÍVEIS (ainda não configuram tentativa — não se iniciou a execução). Exceção: quando a lei tipifica o ato preparatório como crime autônomo. Ex.: art. 291 CP (petrechos para falsificação), art. 253 (fabrico de explosivos), associação criminosa (art. 288) — este último é punido independentemente da execução do crime-fim.",
    explanationWrong: "Linha entre preparação e execução é crucial: preparação → impunível (regra). Execução → tentativa punível. Teorias para distinguir: ① Objetiva formal: execução = início da conduta descrita no tipo. ② Objetiva material: execução = ato imediatamente perigoso ao bem jurídico. O CP não define expressamente a fronteira — cabe à doutrina e jurisprudência.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_itr_q03",
    atomKey: "iter",
    statement: "Julgue: Na tentativa (art. 14, II CP), o agente inicia a execução do crime, mas não o consuma por circunstâncias alheias à sua vontade — a pena é reduzida de 1 a 2/3.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Tentativa (art. 14, II CP): ① início dos atos de execução; ② não consumação; ③ por circunstâncias alheias à vontade do agente. Pena: a do crime consumado reduzida de 1/3 a 2/3 (art. 14, parágrafo único). A redução varia conforme a proximidade da consumação (quanto mais próximo, menor a redução).",
    explanationWrong: "Tentativa: inicia execução + não consuma + por razões alheias à vontade. Redução: 1/3 a 2/3 (não é pena distinta — é redução da pena do crime consumado). Tentativa branca: vítima não atingida → maior redução. Tentativa vermelha: vítima atingida mas sobrevive → menor redução. Crimes que não admitem tentativa: culposos, contravenções, omissivos próprios, habituais.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "pen_itr_q04",
    atomKey: "iter",
    statement: "A desistência voluntária (art. 15 CP) ocorre quando:",
    alternatives: [
      { letter: "A", text: "O agente não consegue consumar o crime por obstáculos externos." },
      { letter: "B", text: "O agente, podendo prosseguir na execução, voluntariamente decide não consumar o crime." },
      { letter: "C", text: "O agente já esgotou todos os atos executórios e age para impedir o resultado." },
      { letter: "D", text: "O agente é preso antes de iniciar a execução." },
      { letter: "E", text: "A vítima consegue fugir antes de ser atingida." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Desistência voluntária: agente pode prosseguir ('ainda não esgotou os meios') mas decide voluntariamente não consumar. O agente 'pode mas não quer'. Resultado: só responde pelos atos já praticados (ex.: dano à porta), não pela tentativa do crime pretendido. É a 'ponte de ouro' de Von Liszt.",
    explanationWrong: "Desistência voluntária (art. 15 CP): 'pode mas não quer' → responde pelos atos anteriores. Arrependimento eficaz (art. 15 CP): 'esgotou os atos mas age para impedir o resultado' → se o resultado não ocorre, responde pelos atos praticados. Tentativa: 'quer mas não pode' (circunstâncias externas impedem). Fórmula Frank: DV = poderia mas não quis; AE = tentou tudo, mas desfez.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_itr_q05",
    atomKey: "iter",
    statement: "Julgue: No arrependimento eficaz (art. 15 CP), o agente já concluiu os atos de execução, mas atua para evitar o resultado — se o resultado não ocorrer, responde apenas pelos atos já praticados, não pela tentativa.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Arrependimento eficaz: agente esgotou os atos executivos ('deu tudo que tinha') mas atua para impedir o resultado. Se o resultado não ocorrer → responde pelos atos praticados, não pela tentativa do crime-fim. Se o resultado ocorrer apesar do esforço → responde pelo crime consumado (frustrado).",
    explanationWrong: "Art. 15 CP (desistência voluntária e arrependimento eficaz): em ambos o agente só responde pelos atos já praticados. Diferença: DV — interrompe a execução antes de esgotar meios; AE — já esgotou os meios, age para desfazer. Exemplo AE: envenena a vítima e depois dá o antídoto. Se vítima sobrevive → lesão corporal; se morre → homicídio.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "pen_itr_q06",
    atomKey: "iter",
    statement: "A 'tentativa branca' ou 'tentativa incruenta' é aquela em que:",
    alternatives: [
      { letter: "A", text: "O agente desiste voluntariamente antes de consumar o crime." },
      { letter: "B", text: "A vítima não é fisicamente atingida, embora o agente tenha iniciado a execução." },
      { letter: "C", text: "O crime é tentado mas o dano patrimonial é mínimo." },
      { letter: "D", text: "A tentativa ocorre em crime culposo — admitida em casos excepcionais." },
      { letter: "E", text: "O agente atinge a vítima mas esta sobrevive por atendimento médico." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Tentativa branca (incruenta): a vítima NÃO é atingida. O agente iniciou a execução (disparou, golpeou), mas não alcançou o corpo da vítima. Tentativa vermelha (cruenta): a vítima É atingida mas sobrevive. A distinção importa na dosimetria da pena: tentativa branca → maior redução (mais afastada da consumação).",
    explanationWrong: "Tentativa branca/incruenta: vítima não atingida fisicamente → maior redução de pena (1/3 a 2/3 — tende ao máximo). Tentativa vermelha/cruenta: vítima atingida + sobrevive → menor redução (tende ao mínimo). Regra: quanto mais próximo da consumação, menor a redução da pena na tentativa (art. 14, parágrafo único CP).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

];

async function main() {
  console.log("\n🚀 Seed R61 — Densificação: Direito Penal — Fato Típico\n");

  // 1. Encontrar subjectId de Direito Penal
  const subjectRows = await db.execute(sql`
    SELECT id FROM "Subject" WHERE name ILIKE ${"%" + "PENAL" + "%"} LIMIT 1
  `) as any[];
  if (!subjectRows[0]) {
    console.error("❌ Subject Direito Penal não encontrado.");
    process.exit(1);
  }
  const subjectId: string = subjectRows[0].id;
  console.log(`  ✅ Subject: ${subjectId}`);

  // 2. Resolver contentIds por título
  const contentIdMap: Record<AtomKey, string | null> = {
    tripartição: null, conduta: null, nexo: null,
    tipicidade: null, doloculpa: null, iter: null,
  };

  for (const [key, title] of Object.entries(ATOM_TITLES) as [AtomKey, string][]) {
    const rows = await db.execute(sql`
      SELECT id FROM "Content" WHERE title = ${title} AND "subjectId" = ${subjectId} LIMIT 1
    `) as any[];
    if (rows[0]) {
      contentIdMap[key as AtomKey] = rows[0].id;
      console.log(`  ✅ Átomo [${key}]: ${rows[0].id}`);
    } else {
      console.warn(`  ⚠️  Átomo NÃO encontrado: "${title}" — execute seed-penal-fato-tipico-r26.ts primeiro`);
    }
  }

  const availableAtoms = Object.values(contentIdMap).filter(Boolean).length;
  if (availableAtoms === 0) {
    console.error("\n❌ Nenhum átomo encontrado. Abortando.");
    process.exit(1);
  }

  // 3. Inserir questões
  let inserted = 0;
  let skipped = 0;

  for (const q of questions) {
    const contentId = contentIdMap[q.atomKey];
    if (!contentId) {
      console.warn(`  ⚠️  Átomo '${q.atomKey}' não disponível — pulando ${q.id}`);
      skipped++;
      continue;
    }

    const exists = await db.execute(sql`SELECT id FROM "Question" WHERE id = ${q.id} LIMIT 1`) as any[];
    if (exists.length > 0) {
      console.log(`  ⏭️  Já existe: ${q.id}`);
      skipped++;
      continue;
    }

    const contentRows = await db.execute(sql`
      SELECT "subjectId", "topicId" FROM "Content" WHERE id = ${contentId} LIMIT 1
    `) as any[];
    if (!contentRows[0]) { skipped++; continue; }

    const { subjectId: sid, topicId } = contentRows[0];
    const alternativesJson = JSON.stringify(q.alternatives);

    await db.execute(sql`
      INSERT INTO "Question" (
        id, statement, alternatives, "correctAnswer", "correctOption",
        explanation, "explanationCorrect", "explanationWrong",
        "questionType", difficulty,
        "subjectId", "topicId", "contentId",
        "isActive", "timesUsed", "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternativesJson}::jsonb,
        ${q.correctAnswer}, ${q.correctOption},
        ${q.explanationCorrect}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${q.questionType}, ${q.difficulty},
        ${sid}, ${topicId}, ${contentId},
        true, 0, NOW(), NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `);

    console.log(`  ✅ ${q.id} [${q.difficulty}] ${q.questionType === "CERTO_ERRADO" ? "CE" : "ME"} → ${q.atomKey}`);
    inserted++;
  }

  console.log("\n─────────────────────────────────────────");
  console.log(`✅ Inseridas : ${inserted}`);
  console.log(`⏭  Ignoradas : ${skipped}`);
  console.log(`📊 Total     : ${questions.length}`);
  console.log("─────────────────────────────────────────\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
