/**
 * db/seed-dense-pen-tc-r48.ts
 * DENSIFICAÇÃO — DIR_PENAL grupo pen_tc_*
 *
 * Átomos-alvo: 6 átomos, 2 questões existentes cada → +6 por átomo = 36 novas questões
 * pen_tc_c01 — Conceito Analítico de Crime — Teoria Tripartida
 * pen_tc_c02 — Fato Típico e Nexo Causal — Art. 13 do Código Penal
 * pen_tc_c03 — Dolo vs. Culpa — A Distinção Mais Cobrada em Provas
 * pen_tc_c04 — Excludentes de Ilicitude — Art. 23 do Código Penal
 * pen_tc_c05 — Culpabilidade — Imputabilidade, Consciência e Exigibilidade
 * pen_tc_c06 — Iter Criminis e Tentativa — O Caminho do Crime
 *
 * Execução: npx tsx db/seed-dense-pen-tc-r48.ts
 */

import { db } from "../db/index";
import { sql } from "drizzle-orm";

const questions = [

  // ── pen_tc_c01: Conceito Analítico de Crime — Teoria Tripartida ──────────

  {
    id: "pen_tc_c01_q01",
    contentId: "pen_tc_c01",
    statement:
      "Segundo a Teoria Tripartida do crime, adotada majoritariamente no Brasil, para que haja crime são necessários:",
    alternatives: [
      { letter: "A", text: "Fato típico e culpabilidade — a ilicitude é presumida do fato típico." },
      { letter: "B", text: "Fato típico, ilicitude e culpabilidade — os três elementos são cumulativos e integram o conceito analítico de crime." },
      { letter: "C", text: "Fato típico e ilicitude — a culpabilidade é pressuposto da pena, não do crime." },
      { letter: "D", text: "Conduta, resultado, nexo causal e tipicidade apenas — os demais elementos são irrelevantes." },
      { letter: "E", text: "Fato típico, ilicitude, culpabilidade e punibilidade — os quatro são indispensáveis." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A Teoria Tripartida (majoritária no Brasil, adotada pelo Código Penal e pelo STF) exige três elementos cumulativos para caracterizar o crime: fato típico, ilicitude (antijuridicidade) e culpabilidade.",
    explanationCorrect:
      "Os três substratos são analisados em ordem: se ausente o primeiro (fato típico), encerra-se a análise. Se típico mas há excludente de ilicitude, não há crime. Se típico e ilícito mas o agente é inimputável, não há culpabilidade — aplicam-se medidas de segurança.",
    explanationWrong:
      "A Teoria Bipartida (Damásio, Mirabete) considera a culpabilidade pressuposto da pena — mas essa é posição minoritária. A Teoria Quadripartida exige um quarto elemento (punibilidade), igualmente minoritária. Para concursos de carreira policial, adotar sempre a Tripartida.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c01_q02",
    contentId: "pen_tc_c01",
    statement:
      "A contravenção penal difere do crime pela pena abstratamente cominada. A pena de uma contravenção penal é:",
    alternatives: [
      { letter: "A", text: "Reclusão ou detenção, iguais às do crime." },
      { letter: "B", text: "Prisão simples ou multa." },
      { letter: "C", text: "Apenas multa — contravenção não admite pena privativa de liberdade." },
      { letter: "D", text: "Detenção exclusivamente — a reclusão é reservada para crimes graves." },
      { letter: "E", text: "Prisão simples, detenção ou multa, conforme a gravidade." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A distinção entre crime e contravenção penal reside na pena: crimes são punidos com reclusão ou detenção (isoladas, alternativas ou cumulativamente com multa); contravenções são punidas com prisão simples ou multa.",
    explanationCorrect:
      "A prisão simples é pena exclusiva da contravenção — não pode ser cumprida em regime fechado. Esse critério formal (pena abstrata) diferencia as duas espécies de infração penal, que são o gênero 'infração penal'.",
    explanationWrong:
      "Contravenções podem sim ter pena privativa de liberdade (prisão simples), mas nunca reclusão ou detenção. A detenção é exclusiva dos crimes, não das contravenções.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c01_q03",
    contentId: "pen_tc_c01",
    statement:
      "A análise estratificada do crime segue ordem lógica. A consequência prática da ausência de fato típico é:",
    alternatives: [
      { letter: "A", text: "O agente é absolvido por falta de ilicitude — analisa-se o segundo substrato." },
      { letter: "B", text: "O agente é absolvido por atipicidade — encerra-se a análise sem examinar ilicitude ou culpabilidade." },
      { letter: "C", text: "O agente é absolvido por inimputabilidade, aplicando-se medida de segurança." },
      { letter: "D", text: "O agente responde por crime culposo, pois a ausência do tipo doloso não afasta a culposa." },
      { letter: "E", text: "O juiz passa à análise da culpabilidade, podendo absolver por inexigibilidade de conduta diversa." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A análise do crime é progressiva e condicionada: se o fato não é típico (atipicidade), encerra-se imediatamente. Não faz sentido analisar ilicitude ou culpabilidade de um fato que sequer se enquadra em tipo penal algum.",
    explanationCorrect:
      "A absolvição por atipicidade é a mais ampla: significa que a conduta não está prevista em lei como crime. Exemplos: porte de arma de fogo desmuniciada sem acesso fácil à munição (atípico segundo STF); autolesão sem fraude a seguro.",
    explanationWrong:
      "A ausência de fato típico não gera análise de culpabilidade nem aplicação de medida de segurança (esta exige fato típico e ilícito). O fluxo é: típico? → ilícito? → culpável? — cada nível depende do anterior.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c01_q04",
    contentId: "pen_tc_c01",
    statement:
      "Um agente pratica fato típico e ilícito, mas é constatado ser portador de doença mental que o tornava inteiramente incapaz de entender o caráter ilícito do fato ao tempo da conduta. A consequência jurídica é:",
    alternatives: [
      { letter: "A", text: "Condenação com pena reduzida de 1/3 a 2/3 pela semi-imputabilidade." },
      { letter: "B", text: "Absolvição imprópria: o juiz aplica medida de segurança, não pena." },
      { letter: "C", text: "Absolvição própria: o juiz absolve sem qualquer medida de segurança." },
      { letter: "D", text: "Suspensão condicional do processo até o restabelecimento da saúde." },
      { letter: "E", text: "Condenação normal, pois o fato típico e ilícito foi comprovado." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O inimputável por doença mental (Art. 26 do CP) que pratica fato típico e ilícito recebe absolvição imprópria: é absolvido da pena, mas sujeito à medida de segurança (internação ou tratamento ambulatorial), pois o fato foi cometido.",
    explanationCorrect:
      "A absolvição imprópria mantém a medida de segurança porque o fato foi praticado — há periculosidade a tratar. Já a absolvição própria (sem nenhuma medida) ocorre quando não há fato típico ou ilícito. A distinção é fundamental para provas.",
    explanationWrong:
      "A pena reduzida (1/3 a 2/3) é para o semi-imputável (Art. 26, §único), não para o inteiramente incapaz. Condenar o inimputável seria inconstitucional — viola a culpabilidade como fundamento da pena.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c01_q05",
    contentId: "pen_tc_c01",
    statement:
      "Sobre a distinção entre Teoria Tripartida e Teoria Bipartida, é correto afirmar:",
    alternatives: [
      { letter: "A", text: "Na Teoria Bipartida, a culpabilidade integra o crime junto com fato típico e ilicitude." },
      { letter: "B", text: "Na Teoria Tripartida, crime = fato típico + ilicitude; culpabilidade é pressuposto da pena." },
      { letter: "C", text: "Na Teoria Bipartida, crime = fato típico + ilicitude; culpabilidade é pressuposto da pena — posição de Damásio de Jesus e Mirabete." },
      { letter: "D", text: "Ambas as teorias concordam que a culpabilidade é elemento do crime, divergindo apenas na terminologia." },
      { letter: "E", text: "A Teoria Tripartida é minoritária no Brasil — o Código Penal adotou a Bipartida." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "A Teoria Bipartida (Damásio de Jesus e Mirabete) considera crime o fato típico e ilícito — a culpabilidade é pressuposto para aplicação da pena, não elemento do crime. A Teoria Tripartida (majoritária) inclui culpabilidade no próprio conceito de crime.",
    explanationCorrect:
      "Para concursos: a Teoria Tripartida é a adotada pelo Código Penal e pelo STF. A Teoria Bipartida é minoritária. A diferença prática é: na Bipartida, o inimputável 'comete crime' (fato típico + ilícito) mas não é punível; na Tripartida, o inimputável não 'comete crime' por falta de culpabilidade.",
    explanationWrong:
      "O Código Penal adotou a Teoria Tripartida como referência majoritária na doutrina e na jurisprudência do STF. A Bipartida é posição doutrinária minoritária, cobrada em provas para diferenciação.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c01_q06",
    contentId: "pen_tc_c01",
    statement:
      "O crime de formação de quadrilha/bando (hoje associação criminosa — Art. 288 do CP) é exemplo clássico em que:",
    alternatives: [
      { letter: "A", text: "O ato preparatório do crime-fim foi tipificado autonomamente como crime independente." },
      { letter: "B", text: "A cogitação é punível por ser exteriorizada por mais de uma pessoa." },
      { letter: "C", text: "A tentativa é impossível, pois o crime se consuma na cogitação." },
      { letter: "D", text: "Os coautores só respondem pelo crime consumado, não pela associação prévia." },
      { letter: "E", text: "O Código Penal abandona a teoria tripartida, punindo mera preparação sem tipicidade." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "A associação criminosa (Art. 288 CP) é o exemplo paradigmático de ato preparatório tipificado autonomamente: a mera formação do grupo (antes de qualquer crime concreto) já constitui crime independente, sem necessidade de execução do crime-fim.",
    explanationCorrect:
      "A regra é que atos preparatórios não são puníveis. A exceção existe quando o legislador decide tipificar o ato preparatório como crime autônomo — como na associação criminosa, nos petrechos para falsificação de moeda (Art. 291 CP), e na embriaguez preordenada ao volante.",
    explanationWrong:
      "A punição da associação criminosa não viola a teoria tripartida — o ato de se associar é plenamente típico (Art. 288 CP), ilícito e culpável. Não é cogitação nem tentativa — é crime consumado de forma antecipada pelo legislador.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── pen_tc_c02: Fato Típico e Nexo Causal ────────────────────────────────

  {
    id: "pen_tc_c02_q01",
    contentId: "pen_tc_c02",
    statement:
      "'A' esfaqueia 'B', causando ferimento grave mas não letal. Durante o transporte ao hospital, a ambulância é atingida por outro veículo em acidente, e 'B' morre. Sobre a responsabilidade penal de 'A':",
    alternatives: [
      { letter: "A", text: "Responde por homicídio consumado — a teoria da equivalência dos antecedentes o vincula à morte." },
      { letter: "B", text: "Responde apenas por lesão corporal — o acidente da ambulância é causa superveniente relativamente independente que por si só produziu a morte." },
      { letter: "C", text: "Responde por homicídio doloso tentado, pois queria matar." },
      { letter: "D", text: "Responde por nada — o nexo causal foi totalmente rompido pela causa superveniente." },
      { letter: "E", text: "Responde por homicídio culposo, pois o resultado morte era previsível." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O acidente da ambulância é causa superveniente RELATIVAMENTE independente que, por si só, produziu o resultado morte — hipótese do Art. 13, §1° do CP. Isso rompe o nexo causal entre a facada de 'A' e a morte. 'A' responde apenas pela lesão corporal.",
    explanationCorrect:
      "O Art. 13, §1° do CP é preciso: 'a superveniência de causa relativamente independente exclui a imputação quando, por si só, produziu o resultado.' O acidente não era desdobramento normal e esperado da facada — saiu da linha causal natural.",
    explanationWrong:
      "A teoria da equivalência dos antecedentes (conditio sine qua non) não é absoluta: o próprio Art. 13, §1° cria a exceção das causas supervenientes que por si só produzem o resultado. Sem essa exceção, qualquer nexo remoto geraria imputação — o que o CP rejeita.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c02_q02",
    contentId: "pen_tc_c02",
    statement:
      "'A' esfaqueia 'B', que é hemofílico (condição preexistente desconhecida de 'A'). 'B' morre em decorrência de hemorragia grave que não ocorreria em pessoa sem hemofilia. Sobre a responsabilidade de 'A':",
    alternatives: [
      { letter: "A", text: "Responde apenas por lesão corporal — a hemofilia rompeu o nexo causal." },
      { letter: "B", text: "Responde por homicídio — a hemofilia é causa preexistente relativamente independente que não rompe o nexo causal." },
      { letter: "C", text: "Não responde por nada — o resultado era imprevisível para 'A'." },
      { letter: "D", text: "Responde por lesão corporal seguida de morte, pois não havia dolo de matar." },
      { letter: "E", text: "Responde por homicídio culposo — deveria ter verificado a saúde da vítima antes de atacar." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A hemofilia é causa PREEXISTENTE relativamente independente — e o Art. 13, §1° só rompe o nexo para causas SUPERVENIENTES que por si só produzam o resultado. Causas preexistentes e concomitantes NÃO rompem o nexo. 'A' responde pelo resultado integral.",
    explanationCorrect:
      "Princípio: o agente assume a vítima como ela é ('teoria do fim protetor da norma'). Se 'A' quis matar, responde por homicídio consumado. Se queria apenas lesionar, pode responder por lesão seguida de morte. A hemofilia preexistente não é imprevisível o suficiente para romper o nexo.",
    explanationWrong:
      "A distinção entre causas preexistentes, concomitantes e supervenientes é essencial: apenas as supervenientes que por si só produziram o resultado rompem o nexo. Preexistentes nunca rompem — o agente responde pelo resultado final.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c02_q03",
    contentId: "pen_tc_c02",
    statement:
      "O crime de homicídio (Art. 121 CP) é classificado quanto ao resultado como crime:",
    alternatives: [
      { letter: "A", text: "Formal — consuma-se com a conduta, independentemente da morte." },
      { letter: "B", text: "De mera conduta — não exige resultado naturalístico." },
      { letter: "C", text: "Material — exige a produção do resultado naturalístico (morte da vítima)." },
      { letter: "D", text: "Omissivo próprio — pune a omissão de socorro descrita no tipo." },
      { letter: "E", text: "De perigo concreto — consuma-se com a exposição da vítima a risco." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O homicídio é crime material: o tipo penal exige a produção do resultado naturalístico (morte da vítima). Sem a morte, há tentativa de homicídio, não homicídio consumado.",
    explanationCorrect:
      "Crimes materiais: o resultado naturalístico (modificação do mundo exterior) é exigido pelo tipo. Exemplos: homicídio (morte), furto (subtração da coisa), lesão corporal (dano à integridade). Sem o resultado, o crime fica na tentativa.",
    explanationWrong:
      "Crime formal (extorsão, ameaça): consuma-se com a conduta, o resultado é mero exaurimento. Crime de mera conduta (violação de domicílio): o tipo não prevê resultado algum. Essas distinções são recorrentes em provas de concursos policiais.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c02_q04",
    contentId: "pen_tc_c02",
    statement:
      "O crime omissivo impróprio (comissivo por omissão) exige que o omitente seja 'garantidor'. São garantidores, segundo o Art. 13, §2°, do CP:",
    alternatives: [
      { letter: "A", text: "Apenas os pais em relação aos filhos menores." },
      { letter: "B", text: "Qualquer pessoa que presenciar situação de perigo — há dever geral de agir." },
      { letter: "C", text: "Quem tenha por lei obrigação de cuidado, quem assumiu a responsabilidade de impedir o resultado, e quem criou com conduta anterior a situação de perigo." },
      { letter: "D", text: "Apenas agentes públicos (policiais, bombeiros, médicos de hospital público)." },
      { letter: "E", text: "Qualquer pessoa que tenha capacidade física de evitar o resultado." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O Art. 13, §2° do CP define as três hipóteses de garantidor: (a) obrigação legal de cuidado (pais, cônjuge, médico de plantão); (b) quem assumiu voluntariamente a responsabilidade (babá, guia de alpinismo); (c) quem criou com conduta anterior a situação de risco.",
    explanationCorrect:
      "A terceira hipótese (ingerência) é a mais cobrada: quem causa o perigo tem dever de impedir o resultado. Exemplo: quem convida alguém para nadar em lugar perigoso tem dever de salvar se a pessoa se afoga. Ausente o dever de garante, omissão = crime omissivo próprio (omissão de socorro), não impróprio.",
    explanationWrong:
      "Não existe dever geral de agir como garantidor — apenas o omissivo próprio (Art. 135 CP, omissão de socorro) é exigível de qualquer pessoa. O garantidor tem vínculo específico (legal, contratual ou por ingerência) que justifica a equiparação da omissão à ação.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c02_q05",
    contentId: "pen_tc_c02",
    statement:
      "A teoria da equivalência dos antecedentes causais (conditio sine qua non) usa o método hipotético de eliminação para identificar a causa. Esse método consiste em:",
    alternatives: [
      { letter: "A", text: "Somar todas as causas do resultado e responsabilizar todos os agentes igualmente." },
      { letter: "B", text: "Eliminar mentalmente a conduta: se o resultado desaparece, a conduta é causa; se persiste, não é causa." },
      { letter: "C", text: "Avaliar qual causa foi mais relevante para o resultado e imputar ao agente dessa causa." },
      { letter: "D", text: "Presumir que toda conduta contemporânea ao resultado é sua causa." },
      { letter: "E", text: "Calcular a probabilidade de cada causa ter contribuído para o resultado." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O método hipotético de Thyrén (conditio sine qua non): elimina-se mentalmente a conduta do agente. Se o resultado deixar de ocorrer na forma como ocorreu, a conduta é causa. Se o resultado persistiria independentemente, a conduta não é causa.",
    explanationCorrect:
      "Exemplo: 'A' dispara em 'B', que morre. Elimina-se mentalmente o disparo — 'B' não teria morrido. Logo, o disparo é causa. Crítica: pode levar a regressus ad infinitum (fabricante da arma também seria causa). Por isso, a causalidade objetiva é limitada pelo dolo e pela culpa (imputação subjetiva).",
    explanationWrong:
      "A teoria não avalia relevância (isso seria a teoria da causalidade adequada) nem presume causas por contemporaneidade. A conditio é objetiva e usa a supressão mental como critério.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c02_q06",
    contentId: "pen_tc_c02",
    statement:
      "A extorsão (Art. 158 CP) é classificada como crime formal. Isso significa que:",
    alternatives: [
      { letter: "A", text: "Só se consuma quando a vítima efetivamente entrega o dinheiro exigido." },
      { letter: "B", text: "Consuma-se com a exigência (conduta) — a obtenção da vantagem é mero exaurimento, não necessária para a consumação." },
      { letter: "C", text: "A vítima não precisa sofrer violência ou grave ameaça para que o crime se consuma." },
      { letter: "D", text: "O resultado patrimonial é elemento do tipo — sem prejuízo, não há crime." },
      { letter: "E", text: "Admite tentativa apenas se a vítima resistir ativamente à exigência." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A extorsão é crime formal: consuma-se com a exigência (conduta de violentar ou ameaçar para obter vantagem), independentemente de a vítima ceder ou entregar a vantagem. A obtenção da vantagem é exaurimento, não consumação.",
    explanationCorrect:
      "A classificação em crime formal tem impacto prático: a extorsão tentada ocorre quando a exigência não chega ao conhecimento da vítima (ex.: carta de extorsão interceptada antes de ser lida). Se chegou, já consuma — a vítima ceder ou não é irrelevante para a consumação.",
    explanationWrong:
      "Confundir crime formal com crime material é erro clássico. No crime material (furto, homicídio), o resultado é elementar do tipo. No formal (extorsão, ameaça), o resultado é consequência esperada, mas a consumação antecede o resultado.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── pen_tc_c03: Dolo vs. Culpa ────────────────────────────────────────────

  {
    id: "pen_tc_c03_q01",
    contentId: "pen_tc_c03",
    statement:
      "Um motorista participa de racha de automóveis em via pública a 180 km/h. Atropela e mata um pedestre. O STF classifica esse comportamento como:",
    alternatives: [
      { letter: "A", text: "Homicídio culposo na direção de veículo automotor (Art. 302 CTB)." },
      { letter: "B", text: "Homicídio culposo inconsciente — o motorista não previu o resultado." },
      { letter: "C", text: "Homicídio doloso com dolo eventual — o motorista assumiu o risco de matar ao participar do racha." },
      { letter: "D", text: "Homicídio culposo consciente — previu o resultado mas confiou que não ocorreria." },
      { letter: "E", text: "Lesão corporal seguida de morte — o dolo era de lesionar, não de matar." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O STF (RHC 117.076 e outros) consolidou que o racha automobilístico com resultado morte configura homicídio doloso com dolo eventual, não culpa consciente. O motorista prevê a possibilidade de matar e assume esse risco ao prosseguir com o racha.",
    explanationCorrect:
      "A chave: no dolo eventual, o agente diz internamente 'dane-se' — assume e aceita o risco. Na culpa consciente, o agente diz 'não vai acontecer comigo' — confia na evitabilidade. O STF considera que quem participa de racha demonstra indiferença ao resultado morte.",
    explanationWrong:
      "Classificar o racha como culpa (consciente ou inconsciente) afastaria o julgamento pelo Tribunal do Júri, pois o homicídio culposo no trânsito é de competência do juízo singular. O STF manteve o júri por se tratar de dolo eventual.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c03_q02",
    contentId: "pen_tc_c03",
    statement:
      "O dolo de segundo grau (dolo de consequências necessárias) caracteriza-se quando:",
    alternatives: [
      { letter: "A", text: "O agente quer diretamente o resultado e planeja cada etapa." },
      { letter: "B", text: "O agente aceita consequências inevitáveis de seu fim desejado, mesmo sem querê-las diretamente." },
      { letter: "C", text: "O agente prevê o resultado como possível e decide continuar, assumindo o risco." },
      { letter: "D", text: "O agente não prevê o resultado, mas poderia e deveria prevê-lo." },
      { letter: "E", text: "O agente prevê o resultado mas confia que não vai ocorrer por sua habilidade." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O dolo de segundo grau ocorre quando o agente persegue um fim desejado, mas aceita as consequências secundárias inevitáveis desse fim. Ele não quer diretamente as consequências acessórias, mas as aceita como necessárias.",
    explanationCorrect:
      "Exemplo clássico: 'A' deseja matar 'B', que está num avião. Planta uma bomba para explodir o avião. Não quer matar os demais passageiros, mas aceita suas mortes como consequência inevitável. As mortes dos outros são dolosas (dolo de 2° grau).",
    explanationWrong:
      "Dolo direto (1° grau): quer o resultado. Dolo eventual: prevê resultado possível e assume o risco. Culpa consciente: prevê mas confia que não ocorrerá. Culpa inconsciente: não prevê. Essas quatro categorias devem ser claramente distinguidas.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c03_q03",
    contentId: "pen_tc_c03",
    statement:
      "Um médico realiza cirurgia complexa de altíssimo risco, dentro de sua especialidade. Prevê que o paciente pode morrer durante o procedimento, mas acredita em sua habilidade para evitar o óbito. O paciente morre. O médico age com:",
    alternatives: [
      { letter: "A", text: "Dolo eventual — previu o resultado e continuou a agir." },
      { letter: "B", text: "Dolo direto — sabia que o paciente poderia morrer." },
      { letter: "C", text: "Culpa consciente — previu o resultado mas confiou em sua habilidade para evitá-lo." },
      { letter: "D", text: "Culpa inconsciente — não previu a morte, pois é especialista." },
      { letter: "E", text: "Não há crime — o estrito cumprimento do dever legal afasta a ilicitude." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O médico age com culpa consciente: prevê o resultado (morte) como possível, mas confia em sua habilidade para evitá-lo. Ele não aceita o resultado — rejeita-o. Isso distingue a culpa consciente do dolo eventual.",
    explanationCorrect:
      "A fórmula: culpa consciente = previsão + rejeição + confiança na habilidade. Dolo eventual = previsão + aceitação + indiferença. O médico competente que opera em alto risco não é indiferente à morte do paciente — ao contrário, usa toda sua habilidade para evitá-la.",
    explanationWrong:
      "Dolo eventual exigiria que o médico fosse indiferente à morte — o que não é o caso de um profissional que atua dentro de sua especialidade. O exercício regular de direito (Art. 23, III CP) pode afastar a ilicitude em cirurgias consentidas, mas o elemento subjetivo é culpa consciente.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c03_q04",
    contentId: "pen_tc_c03",
    statement:
      "A imprudência, a negligência e a imperícia são as três modalidades de culpa. A imperícia caracteriza-se por:",
    alternatives: [
      { letter: "A", text: "Ação positiva com falta de cuidado — fazer algo de forma arriscada." },
      { letter: "B", text: "Omissão de cautela devida — não fazer o que deveria ser feito para evitar o risco." },
      { letter: "C", text: "Falta de aptidão técnica ou habilidade específica para o exercício de atividade profissional ou técnica." },
      { letter: "D", text: "Conhecimento do risco aliado à indiferença pelo resultado." },
      { letter: "E", text: "Omissão de verificação de segurança antes de praticar a conduta." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Imperícia é a falta de aptidão técnica ou habilidade para o exercício de atividade profissional ou técnica. Ocorre quando o agente pratica ato para o qual não tem a qualificação necessária ou excede os limites de sua competência técnica.",
    explanationCorrect:
      "Exemplos de imperícia: cirurgião que opera em área fora de sua especialidade e causa dano; motorista que desconhece técnicas básicas de direção; eletricista que executa instalação sem o conhecimento técnico mínimo. A imperícia pressupõe atividade que exija capacidade técnica específica.",
    explanationWrong:
      "Imprudência: ação positiva arriscada (dirigir acima da velocidade). Negligência: omissão de cautela (não verificar os freios antes de viajar). Imperícia: falta de habilidade técnica (cirurgião sem competência). As três são espécies de culpa stricto sensu.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c03_q05",
    contentId: "pen_tc_c03",
    statement:
      "Sobre o crime preterdoloso (dolo no antecedente + culpa no consequente), assinale a alternativa correta:",
    alternatives: [
      { letter: "A", text: "É crime doloso — o agente quer o resultado mais grave." },
      { letter: "B", text: "O agente quer o resultado inicial (dolo) e o resultado mais grave decorre de culpa — não era pretendido." },
      { letter: "C", text: "É crime culposo — nem o resultado inicial nem o final eram queridos." },
      { letter: "D", text: "O resultado mais grave no crime preterdoloso sempre exige dolo eventual." },
      { letter: "E", text: "O preterdolo é vedado no Código Penal brasileiro — não há tipo penal que o preveja." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O crime preterdoloso tem estrutura híbrida: dolo no antecedente (o agente quer praticar o crime-base) e culpa no consequente (o resultado mais grave decorre de culpa — o agente não o queria nem o assumiu). Exemplo: lesão corporal seguida de morte (Art. 129, §3° CP).",
    explanationCorrect:
      "Na lesão corporal seguida de morte: o agente quer lesionar (dolo de lesão), mas a morte ocorre por culpa (desdobramento imprevisto da lesão). Se o agente queria a morte, seria homicídio doloso; se era imprevisível, poderia ser caso fortuito.",
    explanationWrong:
      "O preterdolo não exige dolo eventual no resultado mais grave — exige culpa. Se houvesse dolo eventual no resultado morte, seria homicídio doloso, não preterdoloso. O CP prevê vários crimes preterdolosos: latrocínio, extorsão seguida de morte, lesão seguida de morte.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c03_q06",
    contentId: "pen_tc_c03",
    statement:
      "O Art. 18, parágrafo único, do CP determina que 'salvo os casos expressos em lei, ninguém pode ser punido por fato previsto como crime, senão quando o pratica dolosamente.' Isso significa que:",
    alternatives: [
      { letter: "A", text: "Crimes culposos são inconstitucionais — o CP não admite punição por culpa." },
      { letter: "B", text: "A culpa é excepcional: só existe crime culposo quando o tipo penal expressamente prevê a modalidade culposa." },
      { letter: "C", text: "O dolo é excepcional — presume-se a culpa em todos os crimes." },
      { letter: "D", text: "Toda conduta perigosa é automaticamente crime doloso, independentemente da intenção." },
      { letter: "E", text: "O legislador pode criar crimes objetivos (sem dolo ou culpa) quando expressamente previsto." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 18, §único consagra o princípio da excepcionalidade do crime culposo: o dolo é a regra; a culpa, a exceção. Só haverá crime culposo quando o tipo penal expressamente prever a modalidade culposa (ex.: 'Art. 121, §3° — se o homicídio é culposo...').",
    explanationCorrect:
      "Exemplos: homicídio doloso (Art. 121) e homicídio culposo (Art. 121, §3°) — ambos expressos. Furto culposo não existe — o tipo do Art. 155 CP não prevê modalidade culposa. Se o agente subtrai coisa alheia sem querer (equívoco), pode ser caso de estado de necessidade ou atipicidade.",
    explanationWrong:
      "Crimes objetivos (sem elemento subjetivo) violam o princípio da culpabilidade — o CP os rejeita. A regra é o dolo; a exceção é a culpa expressamente prevista. Nunca o inverso.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── pen_tc_c04: Excludentes de Ilicitude ─────────────────────────────────

  {
    id: "pen_tc_c04_q01",
    contentId: "pen_tc_c04",
    statement:
      "Policial militar atira nas costas de suspeito que fugia correndo, sem apresentar resistência ou perigo atual. O policial alega legítima defesa. Essa alegação é:",
    alternatives: [
      { letter: "A", text: "Válida — o policial tem dever de capturar o suspeito, podendo usar força letal se necessário." },
      { letter: "B", text: "Inválida — não há legítima defesa sem agressão injusta atual ou iminente; atirar em quem foge é excesso punível ou uso desnecessário de força letal." },
      { letter: "C", text: "Válida — o policial age em estrito cumprimento do dever legal ao capturar suspeito." },
      { letter: "D", text: "Válida se o crime investigado for hediondo — a lei autoriza força letal para crimes graves." },
      { letter: "E", text: "Inválida somente se a vítima for menor de idade ou mulher." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A legítima defesa exige agressão injusta ATUAL ou IMINENTE. Suspeito que foge sem apresentar perigo atual não está agredindo — não há legítima defesa. O uso de força letal nessas circunstâncias configura excesso punível ou até homicídio doloso.",
    explanationCorrect:
      "O STF e o STJ são firmes: a mera fuga não autoriza uso de força letal. O policial pode perseguir e usar meios proporcionais para deter, mas não pode atirar para matar em quem não representa perigo atual. A alegação de 'legítima defesa' nesses casos é rejeitada sistematicamente.",
    explanationWrong:
      "O estrito cumprimento do dever legal (Art. 23, III CP) autoriza o policial a prender e a usar força proporcional — mas não autoriza execução sumária de suspeito. A gravidade do crime investigado não é fundamento para uso de força letal sem perigo atual.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c04_q02",
    contentId: "pen_tc_c04",
    statement:
      "O STF, na ADPF 779 (2021), declarou inconstitucional a tese da 'legítima defesa da honra'. Qual o fundamento da decisão?",
    alternatives: [
      { letter: "A", text: "A honra não é bem jurídico protegido pela Constituição Federal." },
      { letter: "B", text: "A tese viola a dignidade da pessoa humana, o princípio da igualdade de gênero e o dever do Estado de combater a violência doméstica." },
      { letter: "C", text: "A legítima defesa exige agressão injusta atual, e ciúme não é agressão." },
      { letter: "D", text: "A honra masculina não integra os direitos fundamentais protegidos pela CF." },
      { letter: "E", text: "A tese viola apenas o princípio da proporcionalidade — matar para defender a honra é desproporcional." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O STF (ADPF 779) declarou inconstitucional a tese da 'legítima defesa da honra' por violar: (a) a dignidade da pessoa humana; (b) a proteção à vida; (c) a igualdade entre gêneros; (d) as convenções internacionais de combate à violência contra a mulher (CEDAW, Convenção de Belém do Pará).",
    explanationCorrect:
      "A tese também viola a própria legítima defesa: ciúme por suposta infidelidade não é 'agressão injusta atual ou iminente'. A decisão proibiu que advogados de defesa usem essa tese no Tribunal do Júri — o juiz deve impedir sua veiculação como argumento de defesa.",
    explanationWrong:
      "A honra é bem jurídico protegido pela CF (Art. 5°, X). A decisão não se limitou à proporcionalidade — foi além, declarando que a tese é incompatível com os fundamentos constitucionais do Estado Democrático de Direito.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c04_q03",
    contentId: "pen_tc_c04",
    statement:
      "No estado de necessidade, o Art. 24, §1° do CP estabelece que não pode alegar estado de necessidade quem tinha o dever legal de enfrentar o perigo. Esse dispositivo aplica-se a:",
    alternatives: [
      { letter: "A", text: "Qualquer cidadão que presenciar situação de perigo e preferir não agir." },
      { letter: "B", text: "Policiais, bombeiros, médicos de emergência e outros profissionais com dever legal de enfrentar riscos inerentes à função." },
      { letter: "C", text: "Apenas policiais militares em serviço ativo." },
      { letter: "D", text: "Somente ao Corpo de Bombeiros, pois é a única instituição com dever expresso de enfrentar perigo." },
      { letter: "E", text: "A ninguém — a CF garante a integridade física de todos, inclusive servidores." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Quem tem dever legal de enfrentar o perigo (policiais, bombeiros, médicos de emergência, fiscais sanitários) não pode alegar estado de necessidade para justificar a fuga do perigo inerente à sua função — isso equivaleria a abandono do dever legal.",
    explanationCorrect:
      "Exemplo: policial não pode invocar estado de necessidade para se recusar a enfrentar criminoso armado em flagrante. O risco é inerente à função. Isso não o impede de usar os meios necessários para se defender legitimamente, mas a fuga do dever é vedada.",
    explanationWrong:
      "A limitação não é absoluta: o policial não tem dever de suicídio. Em situações de perigo absolutamente desproporcional (ex.: arma nuclear), o estado de necessidade pode ser cogitado. Mas o risco ordinário da função não autoriza a recusa.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c04_q04",
    contentId: "pen_tc_c04",
    statement:
      "O excesso punível nas excludentes de ilicitude (Art. 23, §único CP) pode ser:",
    alternatives: [
      { letter: "A", text: "Apenas doloso — excesso culposo não é punível." },
      { letter: "B", text: "Doloso ou culposo — ambas as modalidades de excesso são puníveis." },
      { letter: "C", text: "Apenas culposo — excesso doloso configura crime autônomo, não excesso." },
      { letter: "D", text: "Impunível quando praticado por agente público em serviço." },
      { letter: "E", text: "Punível somente se causar resultado morte." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 23, §único é expresso: 'O agente, em qualquer das hipóteses deste artigo, responderá pelo excesso doloso ou culposo.' Ambas as modalidades de excesso são puníveis — o agente que extrapola os limites da excludente responde pelo que excedeu.",
    explanationCorrect:
      "Excesso intensivo: o agente usa meio excessivo (moderação falta). Excesso extensivo: continua agindo após cessada a agressão. Ambos podem ser dolosos (agente sabe que excedeu) ou culposos (agente não percebeu que excedeu). Nas duas hipóteses, há punição.",
    explanationWrong:
      "O excesso doloso configura o crime praticado com dolo (ex.: homicídio doloso no excesso doloso da legítima defesa). O excesso culposo configura o crime culposo correspondente. Nem a qualidade de agente público nem a ausência de resultado morte afastam a punição.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c04_q05",
    contentId: "pen_tc_c04",
    statement:
      "A legítima defesa putativa (imaginária) ocorre quando:",
    alternatives: [
      { letter: "A", text: "O agente defende outrem acreditando erroneamente ser sua legítima defesa." },
      { letter: "B", text: "O agente supõe, por erro, que está sofrendo agressão injusta que na realidade não existe." },
      { letter: "C", text: "O agente usa meios excessivos na legítima defesa real." },
      { letter: "D", text: "O agente defende bem jurídico alheio (de terceiro) sem ser solicitado." },
      { letter: "E", text: "O agente age em legítima defesa contra agressor que também age em legítima defesa." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A legítima defesa putativa é hipótese de erro: o agente imagina erroneamente que está sofrendo agressão injusta. A situação justificante (excludente de ilicitude) existe apenas na mente do agente — não na realidade. Pode configurar erro de tipo permissivo (descriminante putativa).",
    explanationCorrect:
      "Exemplo: 'A' acredita que 'B' vai sacar uma arma e atira primeiro — mas 'B' apenas ia tirar o celular do bolso. 'A' agiu em legítima defesa putativa. A consequência jurídica depende se o erro era invencível (isenta de pena) ou vencível (reduz a pena — culpa).",
    explanationWrong:
      "A defesa de terceiro (legítima defesa de terceiros) é legítima defesa real. O excesso nos meios é excesso, não putatividade. A legítima defesa recíproca (mútua) é impossível: se um age em legítima defesa real, o outro está agredindo injustamente — logo não pode alegar legítima defesa.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c04_q06",
    contentId: "pen_tc_c04",
    statement:
      "O exercício regular de direito (Art. 23, III CP) como excludente de ilicitude aplica-se a situações como:",
    alternatives: [
      { letter: "A", text: "Policial que prende suspeito em flagrante delito — é estrito cumprimento do dever legal, não exercício regular de direito." },
      { letter: "B", text: "Médico que realiza cirurgia de amputação com consentimento do paciente — intervenção típica mas autorizada pelo direito." },
      { letter: "C", text: "Cidadão que se defende de agressão injusta — é legítima defesa, não exercício regular de direito." },
      { letter: "D", text: "Qualquer conduta praticada dentro dos limites da lei — a excludente é genérica." },
      { letter: "E", text: "Apenas atividades regulamentadas por lei específica (CRM, OAB, CREA etc.)." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O exercício regular de direito abrange condutas típicas autorizadas pelo ordenamento jurídico: cirurgias com consentimento (causam lesão, mas são lícitas), esportes de luta com regras (UFC, boxe), penhor de credor, atividade jornalística de denúncia pública.",
    explanationCorrect:
      "A diferença com o estrito cumprimento do dever legal: o dever legal é obrigação (o agente DEVE fazer); o exercício regular de direito é faculdade (o agente PODE fazer). A prisão em flagrante é dever do policial; a cirurgia é direito do médico.",
    explanationWrong:
      "A excludente não exige lei específica — basta que o direito exercido seja reconhecido pelo ordenamento (lei, costume, ato normativo). Práticas esportivas com regras são exercício regular de direito mesmo sem lei específica que as autorize expressamente.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── pen_tc_c05: Culpabilidade ─────────────────────────────────────────────

  {
    id: "pen_tc_c05_q01",
    contentId: "pen_tc_c05",
    statement:
      "Sobre a embriaguez e a imputabilidade penal, é correto afirmar:",
    alternatives: [
      { letter: "A", text: "A embriaguez voluntária completa sempre exclui a imputabilidade." },
      { letter: "B", text: "A embriaguez voluntária ou culposa, mesmo completa, não exclui a imputabilidade." },
      { letter: "C", text: "A embriaguez culposa exclui a imputabilidade, mas a voluntária não." },
      { letter: "D", text: "A embriaguez preordenada exclui a imputabilidade por não ter sido voluntária a prática do crime." },
      { letter: "E", text: "Qualquer embriaguez completa, qualquer que seja a causa, exclui a imputabilidade." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 28, II do CP é expresso: 'A embriaguez, voluntária ou culposa, pelo álcool ou substância de efeitos análogos não exclui a imputabilidade penal.' Apenas a embriaguez acidental (caso fortuito ou força maior) completa exclui.",
    explanationCorrect:
      "A reforma penal de 1984 aboliu a antiga teoria da actio libera in causa como fundamento para punir — hoje, o fundamento é o próprio Art. 28, II: a lei simplesmente não exclui a imputabilidade para embriaguez voluntária ou culposa, por razões de política criminal.",
    explanationWrong:
      "A embriaguez preordenada (o agente se embriaga para praticar o crime) agrava a pena — não exclui nem reduz a imputabilidade. A embriaguez acidental completa (caso fortuito) é a única hipótese que exclui (Art. 28, §1° CP).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c05_q02",
    contentId: "pen_tc_c05",
    statement:
      "O erro de proibição invencível (inevitável) exclui a culpabilidade pois elimina:",
    alternatives: [
      { letter: "A", text: "A imputabilidade do agente — que desconhecia a lei." },
      { letter: "B", text: "A potencial consciência da ilicitude — o agente não podia conhecer o caráter ilícito da conduta, mesmo com diligência normal." },
      { letter: "C", text: "A exigibilidade de conduta diversa — o agente não podia agir diferente." },
      { letter: "D", text: "O dolo — que pressupõe consciência da ilicitude." },
      { letter: "E", text: "A tipicidade — sem consciência da ilicitude, o fato é atípico." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O erro de proibição afeta a potencial consciência da ilicitude (segundo elemento da culpabilidade). Se o erro é invencível (o agente não poderia conhecer a ilicitude mesmo sendo diligente), exclui a culpabilidade. Se vencível (poderia conhecer com mais cuidado), reduz a pena de 1/6 a 1/3.",
    explanationCorrect:
      "Exemplo de erro de proibição invencível: colono de região isolada que desconhece que determinada conduta foi recentemente tipificada. Erro de proibição vencível: pessoa que poderia consultar um advogado mas não o fez. A distinção vencível/invencível é crucial para a consequência jurídica.",
    explanationWrong:
      "O erro de proibição não afeta a imputabilidade (capacidade biológica) nem a tipicidade (adequação ao tipo). O erro de tipo (Art. 20 CP) exclui o dolo — é diferente do erro de proibição. A potencial consciência da ilicitude não exige conhecimento técnico da lei.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c05_q03",
    contentId: "pen_tc_c05",
    statement:
      "A coação moral irresistível exclui a culpabilidade do coagido. Para ser eficaz como excludente, a coação deve ser:",
    alternatives: [
      { letter: "A", text: "Física e absoluta — a coação moral (psicológica) nunca exclui a culpabilidade." },
      { letter: "B", text: "Irresistível — a ameaça deve ser grave o suficiente para eliminar a liberdade de escolha do coagido, tornando inexigível conduta diversa." },
      { letter: "C", text: "Proveniente de superior hierárquico — somente a hierarquia gera coação excludente." },
      { letter: "D", text: "Registrada por escrito — prova documental é necessária para a excludente." },
      { letter: "E", text: "Contemporânea à conduta — coação anterior ao crime não exclui a culpabilidade." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A coação moral irresistível (vis compulsiva) exclui a exigibilidade de conduta diversa: se a ameaça é tão grave que elimina razoavelmente a liberdade de escolha, não se pode exigir que o coagido aja diferente. O coator responde pelo crime; o coagido é isento de pena.",
    explanationCorrect:
      "A coação física absoluta (vis absoluta) exclui a própria conduta — o coagido é mero instrumento. Já a coação moral exclui a culpabilidade (elemento da exigibilidade). Para ser irresistível, a ameaça deve ser séria, atual ou iminente, e capaz de intimidar pessoa normal.",
    explanationWrong:
      "A coação pode ser anterior à execução do crime (ameaça de morte se o coagido não praticar o crime até amanhã). A prova é livre — não exige documento. A coação de superior hierárquico é outra causa (obediência hierárquica — Art. 22, parte final do CP).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c05_q04",
    contentId: "pen_tc_c05",
    statement:
      "A menoridade penal (Art. 27 CP) é causa de exclusão da imputabilidade. O critério adotado pelo Código Penal para definir a menoridade é:",
    alternatives: [
      { letter: "A", text: "Biopsicológico — avalia-se o desenvolvimento mental individual de cada menor." },
      { letter: "B", text: "Biológico/etário puro — todo menor de 18 anos é inimputável, independentemente de seu desenvolvimento." },
      { letter: "C", text: "Psicológico puro — o juiz avalia caso a caso se o menor tinha discernimento." },
      { letter: "D", text: "Misto — biológico para menores de 14 e biopsicológico para 14 a 17 anos." },
      { letter: "E", text: "Cronológico relativo — o menor de 16 é absolutamente inimputável; o de 16 a 17 pode ser imputável." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O Art. 27 CP adota critério biológico/etário puro: todo menor de 18 anos é inimputável, sem avaliação individual do desenvolvimento mental. Essa opção de política criminal visa proteger o menor do sistema penal comum.",
    explanationCorrect:
      "O critério biopsicológico é usado para doença mental (Art. 26 CP): verifica-se tanto a existência da doença (biológico) quanto a incapacidade de entender ou autodeterminar-se (psicológico). Para menoridade, o critério é apenas etário — basta ter menos de 18 anos.",
    explanationWrong:
      "Não existe gradação entre 14 e 17 anos no CP. O ECA diferencia criança (até 11 anos) de adolescente (12 a 17 anos) para fins das medidas socioeducativas — mas o CP é categórico: menor de 18 = inimputável. Proposta de redução da maioridade penal é debate político, não regra vigente.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c05_q05",
    contentId: "pen_tc_c05",
    statement:
      "A obediência hierárquica como excludente de culpabilidade (Art. 22, parte final, CP) exige que a ordem:",
    alternatives: [
      { letter: "A", text: "Seja de qualquer superior — inclusive de empresa privada ou chefe de família." },
      { letter: "B", text: "Seja de superior hierárquico público e não seja manifestamente ilegal." },
      { letter: "C", text: "Seja de superior público ou privado, desde que formal e escrita." },
      { letter: "D", text: "Seja legal — ordem ilegal jamais exclui a culpabilidade do subordinado." },
      { letter: "E", text: "Seja urgente — apenas ordens em situação de emergência excluem a culpabilidade." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A obediência hierárquica só exclui a culpabilidade quando: (a) a relação é de hierarquia pública (entre servidores públicos); (b) a ordem não é manifestamente ilegal. Se a ordem for manifestamente ilegal, o subordinado que a cumpre responde pelo crime.",
    explanationCorrect:
      "O subordinado tem o dever de questionar ordens manifestamente ilegais. Se a ilegalidade é sutil e o subordinado de boa-fé a cumpre, exclui-se a culpabilidade do subordinado — o superior responde como autor mediato. Ordens de chefes privados não geram essa excludente.",
    explanationWrong:
      "Hierarquia privada (empresa, família) não gera a excludente do Art. 22 CP — pode ser considerada para atenuar a pena, mas não exclui a culpabilidade. A ordem legal jamais gera problema — a questão é a ordem ilegal não manifestamente ilegal.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c05_q06",
    contentId: "pen_tc_c05",
    statement:
      "A semi-imputabilidade (Art. 26, §único, CP) ocorre quando a doença mental:",
    alternatives: [
      { letter: "A", text: "Elimina totalmente a capacidade de entendimento ou de autodeterminação." },
      { letter: "B", text: "Reduz (mas não elimina) a capacidade de entendimento ou de autodeterminação." },
      { letter: "C", text: "É diagnosticada após a prática do crime — imputabilidade superveniente." },
      { letter: "D", text: "Não existia ao tempo do crime, mas surgiu durante o processo." },
      { letter: "E", text: "É leve e não interfere no discernimento do agente." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A semi-imputabilidade ocorre quando a doença mental ou o desenvolvimento mental incompleto/retardado reduz (sem eliminar) a capacidade de entendimento ou autodeterminação. O juiz pode substituir a pena por medida de segurança OU reduzir a pena de 1/3 a 2/3.",
    explanationCorrect:
      "A diferença com a inimputabilidade plena: inimputável pleno = capacidade INTEIRAMENTE eliminada → medida de segurança (nunca pena). Semi-imputável = capacidade REDUZIDA → pena reduzida OU medida de segurança (substitutiva — o sistema vicariante do CP de 1984).",
    explanationWrong:
      "A doença mental superveniente ao crime não afeta a imputabilidade (que é aferida ao tempo da conduta). Ela pode acarretar a suspensão do processo (Art. 152 CPP) e internação provisória, mas não retroage para alterar a culpabilidade.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── pen_tc_c06: Iter Criminis e Tentativa ─────────────────────────────────

  {
    id: "pen_tc_c06_q01",
    contentId: "pen_tc_c06",
    statement:
      "A tentativa (Art. 14, II, CP) exige que o crime não se consume 'por circunstâncias alheias à vontade do agente'. Isso significa que:",
    alternatives: [
      { letter: "A", text: "A tentativa ocorre quando o agente quer o crime mas desiste voluntariamente." },
      { letter: "B", text: "A tentativa ocorre quando a consumação é impedida por fator externo, independente da vontade do agente." },
      { letter: "C", text: "A tentativa exige que o agente tenha iniciado a fase de cogitação do crime." },
      { letter: "D", text: "A tentativa é punível apenas em crimes graves (com pena de reclusão)." },
      { letter: "E", text: "A tentativa só é punível se o agente causar dano à vítima antes da interrupção." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "A tentativa pressupõe que a consumação foi impedida por causa externa (alheia) à vontade do agente: intervenção policial, resistência da vítima, falha do meio. Se o agente deixa de consumar por vontade própria, há desistência voluntária ou arrependimento eficaz — não tentativa.",
    explanationCorrect:
      "A tentativa requer três elementos: (1) início de execução; (2) não consumação; (3) por circunstância alheia à vontade. Se o agente não consuma por VONTADE PRÓPRIA, aplica-se o Art. 15 (desistência/arrependimento). A causa externa pode ser qualquer fator: policial, vítima que foge, arma que falha.",
    explanationWrong:
      "A cogitação nunca é punível. Tentativa de contravenção penal não é punível (Art. 4° da LCP). Não exige dano prévio — basta ter iniciado a execução e sido interrompido externamente.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c06_q02",
    contentId: "pen_tc_c06",
    statement:
      "'A' aponta arma para 'B' e anuncia assalto. 'B' finge entregar a carteira, mas lança pimenta nos olhos de 'A', que foge sem os objetos. 'A' praticou:",
    alternatives: [
      { letter: "A", text: "Roubo consumado — o tipo exige apenas a violência ou grave ameaça, que ocorreu." },
      { letter: "B", text: "Roubo tentado — a subtração da coisa não foi consumada por circunstância alheia à vontade de 'A'." },
      { letter: "C", text: "Desistência voluntária — 'A' desistiu de roubar ao fugir." },
      { letter: "D", text: "Extorsão tentada — usou ameaça para obter vantagem." },
      { letter: "E", text: "Ato preparatório não punível — a subtração não chegou a ser iniciada." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O roubo é crime material (exige subtração + violência/grave ameaça para a consumação completa). 'A' iniciou a execução (ameaça com arma), mas a subtração foi impedida por ação de 'B' (pimenta nos olhos) — circunstância alheia à vontade de 'A'. Logo: roubo tentado.",
    explanationCorrect:
      "Para o STJ, o roubo se consuma com a inversão da posse do bem, ainda que por breve momento. Se a inversão não ocorreu por resistência da vítima, é tentativa. A fuga de 'A' não é desistência voluntária — foi forçada pela reação de 'B'.",
    explanationWrong:
      "Desistência voluntária exige que o agente pudesse prosseguir e escolheu não fazê-lo. 'A' não escolheu — foi impedido pela reação de 'B'. Extorsão exige que a vítima faça ou deixe de fazer algo por conta da coação — o roubo é direto.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c06_q03",
    contentId: "pen_tc_c06",
    statement:
      "'A' decide matar 'B' com veneno. Coloca o veneno na comida de 'B'. 'B' come e passa mal, mas é salvo a tempo no hospital. Antes de 'B' ser atendido, 'A' se arrepende e liga para o hospital alertando sobre o envenenamento. O comportamento de 'A' após o arrependimento configura:",
    alternatives: [
      { letter: "A", text: "Tentativa de homicídio — o arrependimento posterior reduz a pena mas não exclui o crime." },
      { letter: "B", text: "Arrependimento eficaz — 'A' agiu para impedir o resultado e, se 'B' sobreviveu, responde apenas pelos atos praticados (envenenamento = lesão corporal)." },
      { letter: "C", text: "Desistência voluntária — 'A' abandonou voluntariamente a conduta." },
      { letter: "D", text: "Arrependimento posterior — reduz a pena de 1/3 a 2/3 após a consumação." },
      { letter: "E", text: "Crime impossível — o veneno não era suficiente para matar 'B'." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O arrependimento eficaz (Art. 15 CP) ocorre quando o agente já praticou todos os atos mas age ativamente para impedir o resultado. Se o resultado é efetivamente impedido, o agente não responde pela tentativa — responde apenas pelos atos já praticados (no caso, lesão corporal pelo envenenamento).",
    explanationCorrect:
      "A 'ponte de ouro' do arrependimento eficaz: o agente pode retroceder do crime e ser beneficiado. Se 'B' tivesse morrido apesar do alerta de 'A', seria homicídio consumado (o arrependimento foi ineficaz). A eficácia é condição para o benefício.",
    explanationWrong:
      "Desistência voluntária: agente abandona antes de praticar todos os atos. 'A' já havia completado o envenenamento — não cabe desistência, mas arrependimento eficaz. Arrependimento posterior (Art. 16 CP): crime já consumado, repara o dano — não exclui o resultado, apenas reduz a pena.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c06_q04",
    contentId: "pen_tc_c06",
    statement:
      "O crime impossível (Art. 17 CP) por absoluta ineficácia do meio exige que a ineficácia seja ABSOLUTA. Assinale a alternativa que configura crime impossível por ineficácia absoluta do meio:",
    alternatives: [
      { letter: "A", text: "Agente tenta matar com faca enferrujada — a faca poderia não penetrar adequadamente." },
      { letter: "B", text: "Agente tenta matar com arma de fogo que trava durante o disparo — falha mecânica relativa." },
      { letter: "C", text: "Agente tenta matar com açúcar, crendo ser veneno letal." },
      { letter: "D", text: "Agente tenta matar com dose de veneno insuficiente para causar morte." },
      { letter: "E", text: "Agente tenta furtar de bolso de policial de folga que estava desatento." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Açúcar não tem qualquer potencial letal — é absolutamente ineficaz como meio de matar. Configura crime impossível por ineficácia absoluta do meio: em nenhuma circunstância o açúcar poderia causar a morte pretendida.",
    explanationCorrect:
      "A distinção absoluto/relativo é crucial: ineficácia relativa (dose insuficiente de veneno, arma que trava) = tentativa punível. Ineficácia absoluta (substância inócua, gestos mágicos para matar) = crime impossível impunível. A faca enferrujada e a dose insuficiente de veneno são ineficácias relativas.",
    explanationWrong:
      "Faca enferrujada, arma que trava por falha mecânica e dose insuficiente de veneno são meios relativamente ineficazes — poderiam ter funcionado em outras condições. Logo, são tentativas, não crimes impossíveis. Furto de policial de folga é crime impossível por impropriedade absoluta do objeto em algumas circunstâncias (depende se havia bens).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c06_q05",
    contentId: "pen_tc_c06",
    statement:
      "O arrependimento posterior (Art. 16 CP) difere do arrependimento eficaz porque:",
    alternatives: [
      { letter: "A", text: "O arrependimento posterior exclui o crime; o eficaz apenas reduz a pena." },
      { letter: "B", text: "O arrependimento posterior ocorre após a consumação do crime e reduz a pena; o eficaz impede a consumação e exclui a tentativa." },
      { letter: "C", text: "O arrependimento posterior é exclusivo de crimes dolosos; o eficaz aplica-se a todos os crimes." },
      { letter: "D", text: "O arrependimento posterior exige que o agente confesse o crime; o eficaz não tem esse requisito." },
      { letter: "E", text: "São institutos idênticos — ambos excluem a pena se o dano for reparado antes da sentença." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "O arrependimento eficaz (Art. 15 CP) impede a consumação — o crime não se consuma, o agente responde pelos atos já praticados. O arrependimento posterior (Art. 16 CP) ocorre após a consumação: o crime já ocorreu, o agente repara o dano até o recebimento da denúncia, e a pena é reduzida de 1/3 a 2/3.",
    explanationCorrect:
      "O arrependimento eficaz é mais benéfico: exclui a tentativa do crime pretendido. O posterior é mais limitado: apenas reduz a pena do crime já consumado. O posterior se aplica a crimes cometidos sem violência ou grave ameaça à pessoa.",
    explanationWrong:
      "O arrependimento posterior não exige confissão — basta reparação do dano ou restituição antes do recebimento da denúncia. Nenhum dos dois exclui a pena completamente (o eficaz exclui a tentativa, mas o agente ainda responde pelos atos praticados).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "pen_tc_c06_q06",
    contentId: "pen_tc_c06",
    statement:
      "Crimes que NÃO admitem tentativa são aqueles em que a execução já implica a consumação ou cuja natureza é incompatível com o fracionamento do iter criminis. Assinale a alternativa que lista CORRETAMENTE crimes que não admitem tentativa:",
    alternatives: [
      { letter: "A", text: "Homicídio doloso e roubo — são consumados imediatamente." },
      { letter: "B", text: "Crimes culposos, omissivos próprios e crimes habituais." },
      { letter: "C", text: "Crimes hediondos e equiparados — a lei proíbe a tentativa." },
      { letter: "D", text: "Crimes com pena de multa — a tentativa é inviável economicamente." },
      { letter: "E", text: "Todos os crimes formais — consumam-se com a conduta e não admitem tentativa." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "Crimes que não admitem tentativa: culposos (não há dolo para tentar o resultado); omissivos próprios (ou omite e o crime está consumado, ou não omite e não há crime); habituais (exigem reiteração — não há habitualidade tentada); preterdolosos e de mera conduta (em regra).",
    explanationCorrect:
      "Crime culposo: o resultado não é querido — não faz sentido 'tentar' um resultado não desejado. Crime omissivo próprio (omissão de socorro): ou o agente omite socorro (crime consumado) ou presta socorro (sem crime). Crime habitual (exercício ilegal da medicina): exige reiteração — um único ato não configura o crime.",
    explanationWrong:
      "Homicídio doloso e roubo admitem tentativa perfeitamente. Crimes hediondos não têm restrição de tentativa — apenas têm regime especial de pena. Crimes formais podem admitir tentativa (extorsão por carta interceptada).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n========================================================");
  console.log("  SEED R48 — DENSIFICAÇÃO DIR_PENAL pen_tc_*");
  console.log("========================================================\n");

  const refRows = (await db.execute(sql`
    SELECT "subjectId", "topicId" FROM "Content" WHERE id = 'pen_tc_c01' LIMIT 1
  `)) as any[];

  if (!refRows.length) {
    console.error("❌ Átomo pen_tc_c01 não encontrado. Execute seed-direito-penal-teoria-crime-r33.ts primeiro.");
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
  console.error("\n❌ ERRO no seed R48:", err.message ?? err);
  process.exit(1);
});
