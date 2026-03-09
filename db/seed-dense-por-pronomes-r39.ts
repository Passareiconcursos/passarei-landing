/**
 * Seed R39 — Densificação: Português — Pronomes
 * Modo: DENSIFICAÇÃO — apenas questões; átomos de conteúdo já existem no banco.
 *
 * Átomos-alvo (5 átomos × 8 questões = 40 questões):
 *   ct_mm8jve69f1dfau  — Pronomes Pessoais: Reto, Oblíquo e Funções Sintáticas em Provas
 *   ct_mm8jvekuyq74hu  — Pronomes de Tratamento: Hierarquia, Concordância e Uso Oficial
 *   ct_mm8jvez80gtsbk  — Pronomes Possessivos e Demonstrativos: Usos e Armadilhas de Prova
 *   ct_mm8jvfrv89pszs  — Pronomes Indefinidos e Interrogativos: Variáveis vs Invariáveis
 *   ct_mm8jvfdl5vk30g  — Pronomes Relativos: 'cujo', 'onde' e as Pegadinhas de Banca
 *
 * Execução: git pull && npx tsx db/seed-dense-por-pronomes-r39.ts
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

const CONTENT_IDS = {
  pessoais:              "ct_mm8jve69f1dfau",
  tratamento:            "ct_mm8jvekuyq74hu",
  possessivosDemo:       "ct_mm8jvez80gtsbk",
  indefinidosInterrog:   "ct_mm8jvfrv89pszs",
  relativos:             "ct_mm8jvfdl5vk30g",
};

// ─── QUESTÕES ─────────────────────────────────────────────────────────────────

const questions = [

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 1 — Pronomes Pessoais: Reto, Oblíquo e Funções Sintáticas
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_pr_pe_q01",
    contentId: CONTENT_IDS.pessoais,
    statement:
      "(CESPE — Adaptada) Em qual alternativa o pronome pessoal está corretamente " +
      "empregado como OBJETO DIRETO do verbo?",
    alternatives: [
      { letter: "A", text: "A delegada chamou eu para depor." },
      { letter: "B", text: "O inspetor me chamou para a reunião de briefing." },
      { letter: "C", text: "Entregaram o relatório para eu assinar." },
      { letter: "D", text: "O juiz condenou ele sem provas suficientes." },
      { letter: "E", text: "A promotora acusou ela de obstrução." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'me chamou' — 'me' é pronome oblíquo átono de 1ª pessoa, " +
      "funciona como objeto direto de 'chamou'. " +
      "A: 'chamou eu' — errado; 'eu' é pronome reto (sujeito), não pode ser OD. Correto: 'chamou-me'. " +
      "C: 'para eu assinar' — correto (sujeito de infinitivo com preposição). " +
      "D e E: 'ele' e 'ela' são pronomes retos → não podem ser OD. Correto: 'o condenou', 'a acusou'.",
    explanationCorrect:
      "Exato! 'Me' = oblíquo átono de 1ª pessoa → OD. " +
      "Pronomes retos (eu, tu, ele, ela, nós, vós, eles) exercem apenas função de sujeito.",
    explanationWrong:
      "Resposta: B. 'Me' = oblíquo átono → OD. " +
      "Pronomes retos (eu, ele, ela) NÃO são OD — erro clássico de concurso. Use oblíquos: me, te, o, a, nos.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_pr_pe_q02",
    contentId: CONTENT_IDS.pessoais,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Entre mim e ele, não há segredos profissionais', " +
      "os pronomes 'mim' e 'ele' estão corretamente empregados após preposição.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Após preposição, usa-se pronome OBLÍQUO TÔNICO: mim, ti, si, nós, vós, ele/ela. " +
      "'Entre' é preposição → exige oblíquo tônico. " +
      "'Mim' = oblíquo tônico de 1ª pessoa ✓. " +
      "'Ele' = pronome reto que, EXCEPCIONALMENTE, funciona como oblíquo tônico de 3ª pessoa " +
      "(ele/ela/eles/elas admitem uso após preposição). " +
      "Erro comum: 'entre eu e ele' → 'eu' é reto, nunca após preposição.",
    explanationCorrect:
      "Correto! 'Entre mim e ele': preposição + oblíquo tônico. " +
      "'Mim' (1ª pessoa oblíqua) e 'ele' (3ª pessoa, aceita após preposição). Correto.",
    explanationWrong:
      "O item está CERTO. Preposição exige oblíquo tônico. " +
      "'Mim' correto (1ª p.). 'Ele' aceito após preposição. Erro clássico: 'entre eu e ele' (eu = reto = errado).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "por_pr_pe_q03",
    contentId: CONTENT_IDS.pessoais,
    statement:
      "(CESPE — Adaptada) Em qual alternativa o pronome oblíquo 'lhe' está corretamente " +
      "empregado como OBJETO INDIRETO?",
    alternatives: [
      { letter: "A", text: "O delegado lhe prendeu ontem à noite." },
      { letter: "B", text: "A perita lhe examinou cuidadosamente." },
      { letter: "C", text: "O inspetor lhe obedeceu prontamente às ordens." },
      { letter: "D", text: "A delegada lhe entregou o mandado ao suspeito." },
      { letter: "E", text: "O juiz lhe conferiu o direito ao réu." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'lhe obedeceu' — 'obedecer' é verbo transitivo indireto (obedecer a alguém). " +
      "'Lhe' substitui o OI 'a ele/ela'. " +
      "A e B: 'prender' e 'examinar' são VTD → OD = 'o/a', nunca 'lhe'. " +
      "D e E: há redundância ('lhe' + 'ao suspeito'/'ao réu' duplicando o OI). " +
      "Regra: 'lhe' = OI (verbo pede preposição 'a'). 'o/a' = OD (verbo sem preposição).",
    explanationCorrect:
      "Exato! 'Obedecer' é VTI (obedecer a) → OI → 'lhe'. " +
      "Verbos VTD (prender, examinar) pedem OD → 'o/a', nunca 'lhe'.",
    explanationWrong:
      "Resposta: C. 'Lhe obedeceu' = OI correto ('obedecer a alguém'). " +
      "Regra fundamental: lhe = OI (VTI); o/a = OD (VTD). Confundir os dois é erro gravíssimo em provas.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_pr_pe_q04",
    contentId: CONTENT_IDS.pessoais,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Não me disseram nada sobre o caso', " +
      "o pronome 'me' está em próclise, posição justificada pela presença de palavra " +
      "atrativa (advérbio de negação 'não') antes do verbo.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Não me disseram' — próclise obrigatória: o advérbio de negação 'não' atrai " +
      "o pronome para antes do verbo. " +
      "Palavras que atraem o pronome (próclise obrigatória): " +
      "advérbios (não, nunca, jamais, sempre, aqui, ontem...), " +
      "pronomes indefinidos (alguém, ninguém, tudo...), " +
      "conjunções subordinativas, pronomes relativos e demonstrativos. " +
      "Ênclise (após verbo) só em início de oração, após pausa ou com futuro/condicional.",
    explanationCorrect:
      "Correto! Advérbio de negação 'não' → próclise obrigatória: 'não me disseram'. " +
      "'Me disseram não' ou 'Não disseram-me' seriam incorretos neste contexto.",
    explanationWrong:
      "O item está CERTO. 'Não' (advérbio) atrai o pronome → próclise. " +
      "Palavras atrativas: advérbios, pronomes relativos/indefinidos, conjunções subordinativas.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_pr_pe_q05",
    contentId: CONTENT_IDS.pessoais,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa que apresenta o pronome pessoal " +
      "corretamente empregado após preposição.",
    alternatives: [
      { letter: "A", text: "O perito foi até eu para entregar o laudo." },
      { letter: "B", text: "A delegada falou sobre eu durante a reunião." },
      { letter: "C", text: "O suspeito agiu conforme eu havia previsto." },
      { letter: "D", text: "Ninguém é mais dedicado do que eu nesta equipe." },
      { letter: "E", text: "O advogado entregou os documentos para eu analisar." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "CORRETO: 'mais dedicado do que eu' — após 'do que' comparativo, usa-se pronome reto " +
      "quando o pronome é sujeito implícito de oração elíptica: 'do que eu [sou]'. " +
      "A: 'até eu' → errado; após preposição de lugar, use 'mim'. Correto: 'até mim'. " +
      "B: 'sobre eu' → errado. Correto: 'sobre mim'. " +
      "C: 'conforme eu' → 'conforme' aqui é conjunção (não preposição), e 'eu' é sujeito da oração — aceito. " +
      "E: 'para eu analisar' — 'para' rege sujeito de infinitivo → 'eu' correto (sujeito, não objeto).",
    explanationCorrect:
      "Exato! 'Do que eu' = correto: 'eu' é sujeito de oração elíptica ('do que eu sou'). " +
      "Após preposição de lugar/regime: 'mim'. Após 'do que' com sujeito implícito: pronome reto.",
    explanationWrong:
      "Resposta: D. 'Do que eu' correto — 'eu' é sujeito de elipse ('do que eu [sou]'). " +
      "Preposições de lugar (até, sobre, para com sentido de destino) exigem 'mim', não 'eu'.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_pr_pe_q06",
    contentId: CONTENT_IDS.pessoais,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Nós, policiais, devemos cumprir nossas obrigações', " +
      "o pronome 'nós' está em aposto ao sujeito implícito e o uso está correto.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Nós, policiais' — 'nós' é pronome pessoal reto que funciona como sujeito, " +
      "e 'policiais' é aposto explicativo de 'nós'. " +
      "A vírgula isola o aposto. O verbo 'devemos' concorda com 'nós' (1ª pessoa do plural). " +
      "Construção correta e formal, comum em discursos e textos oficiais.",
    explanationCorrect:
      "Correto! 'Nós' = sujeito; 'policiais' = aposto. " +
      "Verbo concorda com o pronome sujeito 'nós' → 'devemos'. Uso correto e formal.",
    explanationWrong:
      "O item está CERTO. 'Nós, policiais' = pronome sujeito + aposto. " +
      "Verbo 'devemos' concorda corretamente com 'nós' (1ª pl.). Construção formal e correta.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "por_pr_pe_q07",
    contentId: CONTENT_IDS.pessoais,
    statement:
      "(CESPE — Adaptada) Em qual alternativa a colocação pronominal está INCORRETA " +
      "segundo a norma culta escrita?",
    alternatives: [
      { letter: "A", text: "Ninguém me informou sobre a mudança de horário." },
      { letter: "B", text: "Far-me-ão a proposta amanhã durante a reunião." },
      { letter: "C", text: "Entregaram-me os documentos logo após a audiência." },
      { letter: "D", text: "Me disseram que a operação seria cancelada." },
      { letter: "E", text: "Os agentes trouxeram-me o relatório completo." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "INCORRETO: 'Me disseram' em início absoluto de oração — na norma culta escrita, " +
      "pronome átono não pode iniciar oração (próclise no início absoluto é proibida). " +
      "Correto: 'Disseram-me que...' (ênclise) ou, se houver palavra atrativa: 'Não me disseram...'. " +
      "A: próclise por 'ninguém' (palavra atrativa) ✓. " +
      "B: mesóclise com verbo no futuro ('far-me-ão') ✓. " +
      "C: ênclise com verbo no início após pausa ✓. " +
      "E: ênclise com verbo no início ✓.",
    explanationCorrect:
      "Exato! Início absoluto de oração → NÃO pode ter próclise. " +
      "'Me disseram' no início = errado. Correto: 'Disseram-me'. Regra clássica de concurso.",
    explanationWrong:
      "Resposta: D. Pronome átono não inicia oração na norma culta escrita. " +
      "'Me disseram' (início) = errado. Correto: 'Disseram-me'. " +
      "Mesóclise (B) usa-se com futuro do presente/pretérito do indicativo.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_pr_pe_q08",
    contentId: CONTENT_IDS.pessoais,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Contar-te-ei tudo sobre a investigação amanhã', " +
      "a colocação pronominal é denominada mesóclise e é obrigatória quando o verbo " +
      "está no futuro do presente ou futuro do pretérito do indicativo, sem palavras atrativas.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Contar-te-ei' = mesóclise: pronome inserido no interior do verbo no futuro. " +
      "Regra: verbo no futuro do indicativo (presente ou pretérito) + sem palavra atrativa = mesóclise obrigatória. " +
      "Estrutura: radical + pronome + desinência: contar- + -te- + -ei. " +
      "Se houvesse palavra atrativa (advérbio, negação), a próclise seria obrigatória: 'Não te contarei nada'.",
    explanationCorrect:
      "Correto! Mesóclise: pronome no interior do verbo futuro. " +
      "'Contar-te-ei' = radical + pronome + desinência. Obrigatória com futuro sem atrativo.",
    explanationWrong:
      "O item está CERTO. Mesóclise = pronome no interior do futuro do indicativo. " +
      "Com palavra atrativa → próclise: 'Não te contarei'. Sem atrativo → mesóclise: 'Contar-te-ei'.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 2 — Pronomes de Tratamento: Hierarquia, Concordância e Uso Oficial
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_pr_tr_q01",
    contentId: CONTENT_IDS.tratamento,
    statement:
      "(CESPE — Adaptada) Um investigador de polícia precisa redigir um ofício ao Governador " +
      "do Estado. Qual pronome de tratamento deve ser utilizado?",
    alternatives: [
      { letter: "A", text: "Vossa Senhoria (V. Sa.)" },
      { letter: "B", text: "Vossa Magnificência (V. Mag.ª)" },
      { letter: "C", text: "Vossa Reverendíssima (V. Rev.ma)" },
      { letter: "D", text: "Vossa Excelência (V. Exa.)" },
      { letter: "E", text: "Vossa Santidade (V. S.)" },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "CORRETO: 'Vossa Excelência' para o Governador do Estado — chefe do Poder Executivo estadual. " +
      "Uso de 'Vossa Excelência': presidente, vice-presidente, ministros, governadores, " +
      "prefeitos de capitais, senadores, deputados, desembargadores, ministros de tribunais superiores. " +
      "A: V. Senhoria = oficiais militares até coronel, autoridades diversas de nível intermediário. " +
      "B: V. Magnificência = reitores de universidade. " +
      "C: V. Reverendíssima = sacerdotes, bispos. " +
      "E: V. Santidade = papa.",
    explanationCorrect:
      "Exato! 'Vossa Excelência' = chefes dos três poderes, ministros, governadores, senadores, desembargadores. " +
      "Para o governador: V. Exa. é obrigatório.",
    explanationWrong:
      "Resposta: D. Governador do Estado = 'Vossa Excelência'. " +
      "Hierarquia: V. Exa. (altas autoridades) > V. Senhoria (autoridades intermediárias) > outros específicos.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_pr_tr_q02",
    contentId: CONTENT_IDS.tratamento,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Vossa Excelência deve apresentar sua decisão até amanhã', " +
      "a concordância verbal e pronominal está correta: o verbo 'deve' e o possessivo 'sua' " +
      "estão em 3ª pessoa, conforme exige o tratamento com pronomes de tratamento.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Pronomes de tratamento, apesar de iniciarem com 'Vossa' (que remete à 2ª pessoa), " +
      "exigem concordância em 3ª pessoa do singular: " +
      "'Vossa Excelência deve' (3ª p. sg.) — não 'deveis'. " +
      "'sua decisão' — possessivo de 3ª pessoa — não 'vossa decisão'. " +
      "Regra mnemônica: 'Vossa' = fala-se COM a pessoa; 'Sua' = fala-se DA pessoa. " +
      "Mas o verbo sempre fica na 3ª pessoa.",
    explanationCorrect:
      "Correto! Pronomes de tratamento → concordância em 3ª pessoa. " +
      "'Vossa Excelência deve' (3ª sg.); 'sua decisão' (possessivo 3ª). Jamais 'deveis' ou 'vossa decisão'.",
    explanationWrong:
      "O item está CERTO. Pronomes de tratamento → 3ª pessoa (verbo e possessivos). " +
      "'Deve' (não 'deveis'), 'sua' (não 'vossa') — regra absoluta em provas.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "por_pr_tr_q03",
    contentId: CONTENT_IDS.tratamento,
    statement:
      "(CESPE — Adaptada) Um delegado de polícia precisa endereçar um ofício ao " +
      "Presidente do Tribunal de Justiça do Estado. Qual o tratamento correto?",
    alternatives: [
      { letter: "A", text: "Vossa Senhoria, pois é autoridade estadual." },
      { letter: "B", text: "Vossa Excelência, pois presidentes de TJ têm tratamento de excelência." },
      { letter: "C", text: "Vossa Magnificência, reservado para magistrados." },
      { letter: "D", text: "Vossa Meritíssima, tratamento padrão para juízes e desembargadores." },
      { letter: "E", text: "Senhor Presidente, sem uso de pronome de tratamento formal." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'Vossa Excelência' — desembargadores e presidentes de tribunais de justiça " +
      "recebem tratamento de 'Vossa Excelência'. " +
      "A: V. Senhoria seria subestimar o cargo. " +
      "C: V. Magnificência é exclusivo para reitores de universidade. " +
      "D: 'Vossa Meritíssima' — embora popular, não é o tratamento oficial padrão do Manual de Redação " +
      "da Presidência da República (que preconiza V. Exa. para desembargadores). " +
      "E: ausência de tratamento formal seria inadequado em ofício oficial.",
    explanationCorrect:
      "Exato! Presidente de TJ = desembargador → 'Vossa Excelência'. " +
      "Magistrados de 2ª instância e acima: V. Exa. Juízes de 1ª instância: V. Exa. (atual) ou V. Meritíssima (uso consagrado).",
    explanationWrong:
      "Resposta: B. Presidente de TJ = 'Vossa Excelência'. " +
      "Tribunais superiores e de 2ª instância: V. Exa. V. Magnificência = só reitores.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_pr_tr_q04",
    contentId: CONTENT_IDS.tratamento,
    statement:
      "(CEBRASPE — Adaptada) A expressão 'Sua Excelência, o Ministro, autorizou a operação' " +
      "está correta: usa-se 'Sua Excelência' quando se fala DA autoridade (em 3ª pessoa), " +
      "ao passo que 'Vossa Excelência' é usado quando se fala COM a autoridade diretamente.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Distinção fundamental: " +
      "'Vossa Excelência' = interlocução direta (falando COM a autoridade): " +
      "'Vossa Excelência poderá assinar o documento.' " +
      "'Sua Excelência' = referência em terceira pessoa (falando DA autoridade): " +
      "'Sua Excelência, o Ministro, assinou o documento.' " +
      "Mnemônico: Vossa = Você (falando com); Sua = Ela (falando dela).",
    explanationCorrect:
      "Correto! 'Sua Excelência' = referência em 3ª pessoa (fala-se DA autoridade). " +
      "'Vossa Excelência' = interlocução direta (fala-se COM a autoridade). Distinção clássica.",
    explanationWrong:
      "O item está CERTO. 'Sua Excelência' = fala-se DA autoridade (3ª pessoa). " +
      "'Vossa Excelência' = fala-se COM a autoridade (2ª pessoa gramatical → concordância 3ª). " +
      "Mnemônico: Vossa = Você (com); Sua = Ela (dela).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_pr_tr_q05",
    contentId: CONTENT_IDS.tratamento,
    statement:
      "(CESPE — Adaptada) Assinale a abreviatura INCORRETA de pronome de tratamento.",
    alternatives: [
      { letter: "A", text: "Vossa Excelência → V. Exa." },
      { letter: "B", text: "Vossa Senhoria → V. Sa." },
      { letter: "C", text: "Vossa Magnificência → V. Mag.ª" },
      { letter: "D", text: "Vossa Reverendíssima → V. Rev.ma" },
      { letter: "E", text: "Vossa Excelência → V. Ex.ª" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "INCORRETO: 'V. Sa.' para Vossa Senhoria está ERRADO. " +
      "A abreviatura correta é 'V. S.ª' (com o 'a' sobrescrito indicando o feminino do 'Senhoria'). " +
      "A: 'V. Exa.' ✓ (forma aceita). " +
      "C: 'V. Mag.ª' ✓. " +
      "D: 'V. Rev.ma' ✓. " +
      "E: 'V. Ex.ª' ✓ (também aceita para Vossa Excelência). " +
      "Atenção: a abreviatura de 'Senhoria' sempre termina com 'a' sobrescrito (ª): V. S.ª",
    explanationCorrect:
      "Exato! 'V. Sa.' está errado. Correto: 'V. S.ª' (Senhoria com 'a' sobrescrito). " +
      "Abreviaturas exigem o 'a' final sobrescrito para os femininos: Exa., S.ª, Mag.ª",
    explanationWrong:
      "Resposta: B. 'V. Sa.' errado → correto: 'V. S.ª'. " +
      "O 'a' sobrescrito indica o feminino de 'Senhoria'. Sem o sobrescrito, a abreviatura está incompleta.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_pr_tr_q06",
    contentId: CONTENT_IDS.tratamento,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Vossa Excelência se manifestou de forma brilhante, " +
      "deixando todos impressionados com sua argumentação', o uso de 'sua' em vez de 'vossa' " +
      "para o possessivo está correto.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Sua argumentação' está correto ao se referir a 'Vossa Excelência'. " +
      "Regra: pronomes de tratamento exigem possessivos de 3ª pessoa (seu, sua, seus, suas), " +
      "não de 2ª pessoa (vosso, vossa). " +
      "Erro clássico: 'Vossa Excelência e vossa equipe' → errado. " +
      "Correto: 'Vossa Excelência e sua equipe'.",
    explanationCorrect:
      "Correto! Possessivo para pronomes de tratamento = 3ª pessoa: 'sua' (não 'vossa'). " +
      "'Sua argumentação' correto. 'Vossa argumentação' seria erro de concordância.",
    explanationWrong:
      "O item está CERTO. Com pronomes de tratamento, o possessivo é de 3ª pessoa: 'seu/sua'. " +
      "Jamais use 'vosso/vossa' como possessivo de 'Vossa Excelência'.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "por_pr_tr_q07",
    contentId: CONTENT_IDS.tratamento,
    statement:
      "(CESPE — Adaptada) Em um ofício dirigido ao Secretário de Segurança Pública, " +
      "qual é o tratamento e a concordância verbal CORRETOS?",
    alternatives: [
      { letter: "A", text: "Vossa Senhoria comunicais que a operação foi bem-sucedida." },
      { letter: "B", text: "Vossa Excelência comunicastes que a operação foi bem-sucedida." },
      { letter: "C", text: "Vossa Excelência comunica que a operação foi bem-sucedida." },
      { letter: "D", text: "Vossa Senhoria comunicastes que a operação foi bem-sucedida." },
      { letter: "E", text: "Sua Excelência comunicais que a operação foi bem-sucedida." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'Vossa Excelência comunica' — Secretário de Segurança Pública é autoridade " +
      "de alto escalão (equiparado a ministro em nível estadual) → V. Exa. " +
      "Concordância: 3ª pessoa do singular ('comunica', não 'comunicais' nem 'comunicastes'). " +
      "A: V. Senhoria pode ser aceitável por alguns, mas 'comunicais' (2ª p. pl.) é errado. " +
      "B e D: 'comunicastes' (2ª p. pl.) = errado. " +
      "E: 'Sua Excelência' = referência em 3ª pessoa, não interlocução + 'comunicais' errado.",
    explanationCorrect:
      "Exato! V. Exa. + 3ª pessoa: 'Vossa Excelência comunica'. " +
      "Nunca 'comunicais' (2ª p. pl.) nem 'comunicastes'. Pronomes de tratamento → 3ª p. sg.",
    explanationWrong:
      "Resposta: C. 'Vossa Excelência comunica' = correto. " +
      "Tratamento adequado para Secretário de Estado + verbo em 3ª pessoa singular.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_pr_tr_q08",
    contentId: CONTENT_IDS.tratamento,
    statement:
      "(CEBRASPE — Adaptada) Ao se dirigir a dois senadores simultaneamente em um documento " +
      "oficial, o correto é usar 'Vossas Excelências', com o pronome no plural e " +
      "a concordância verbal em 3ª pessoa do plural.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. O plural de 'Vossa Excelência' é 'Vossas Excelências'. " +
      "Com dois destinatários de igual tratamento, usa-se o plural. " +
      "A concordância permanece em 3ª pessoa — agora no plural: " +
      "'Vossas Excelências devem...' (3ª p. pl., não 'deveis'). " +
      "Possessivo também no plural: 'suas decisões' (não 'vossas decisões').",
    explanationCorrect:
      "Correto! 'Vossas Excelências' (plural) + 3ª pessoa do plural. " +
      "'Vossas Excelências devem' (não 'deveis'). A concordância nunca vai para 2ª pessoa.",
    explanationWrong:
      "O item está CERTO. Plural = 'Vossas Excelências' + verbo 3ª p. pl. ('devem'). " +
      "A regra da 3ª pessoa mantém-se no plural. Jamais usar 'deveis' ou 'vossas' como possessivo.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 3 — Pronomes Possessivos e Demonstrativos
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_pr_pd_q01",
    contentId: CONTENT_IDS.possessivosDemo,
    statement:
      "(CESPE — Adaptada) Em qual alternativa há pronome DEMONSTRATIVO (e não possessivo)?",
    alternatives: [
      { letter: "A", text: "O delegado assinou seu relatório antes da reunião." },
      { letter: "B", text: "A investigadora apresentou suas conclusões ao júri." },
      { letter: "C", text: "Nossa equipe concluiu o inquérito no prazo." },
      { letter: "D", text: "Aquele suspeito foi identificado pela câmera de segurança." },
      { letter: "E", text: "Teu depoimento foi fundamental para o caso." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "CORRETO: 'Aquele' é pronome demonstrativo — indica um ser distante do falante e do ouvinte. " +
      "Demonstrativos: este/esse/aquele (e variações), isto/isso/aquilo, o/a/os/as (em certos contextos). " +
      "A, B, E: 'seu', 'suas', 'teu' = pronomes possessivos (indicam posse/pertencimento). " +
      "C: 'nossa' = possessivo (de 1ª pessoa do plural).",
    explanationCorrect:
      "Exato! 'Aquele' = demonstrativo (indica posição/distância). " +
      "Possessivos: meu, teu, seu, nosso, vosso (e variações feminino/plural).",
    explanationWrong:
      "Resposta: D. 'Aquele' = demonstrativo (distância do falante e do ouvinte). " +
      "Possessivos (seu, minha, nossa, teu) indicam pertencimento.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_pr_pd_q02",
    contentId: CONTENT_IDS.possessivosDemo,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Este relatório será entregue hoje; esse que você " +
      "tem é o rascunho', o uso de 'este' e 'esse' está correto: 'este' refere-se ao que " +
      "está próximo do falante e 'esse' ao que está próximo do ouvinte.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Distinção clássica (uso dêitico — posição no espaço): " +
      "'Este' = próximo do falante (1ª pessoa). " +
      "'Esse' = próximo do ouvinte/interlocutor (2ª pessoa). " +
      "'Aquele' = distante de ambos (3ª pessoa). " +
      "No texto escrito (uso anafórico): " +
      "'Este' = o que vem a seguir (catáfora). " +
      "'Esse' = o que foi mencionado antes (anáfora retrospectiva).",
    explanationCorrect:
      "Correto! 'Este' (próximo do falante) / 'esse' (próximo do ouvinte). " +
      "Uso dêitico: posição espacial em relação aos interlocutores.",
    explanationWrong:
      "O item está CERTO. 'Este' = próximo do falante; 'esse' = próximo do ouvinte. " +
      "Distinção fundamental entre demonstrativos — cobradíssima em provas.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "por_pr_pd_q03",
    contentId: CONTENT_IDS.possessivosDemo,
    statement:
      "(CESPE — Adaptada) Na frase 'O delegado pediu à sua equipe que revisasse " +
      "o laudo antes de entregá-lo', o pronome 'sua' pode ser ambíguo. " +
      "A qual substantivo 'sua' mais naturalmente se refere?",
    alternatives: [
      { letter: "A", text: "Ao laudo — 'seu' laudo." },
      { letter: "B", text: "À entrega — a entrega é dele." },
      { letter: "C", text: "À equipe — a equipe é dele ou dela." },
      { letter: "D", text: "Ao delegado — a equipe pertence ao delegado." },
      { letter: "E", text: "Ao relatório — documento mencionado antes." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "A: O pronome 'sua' mais naturalmente remete ao sujeito da oração principal: 'o delegado'. " +
      "Portanto, 'sua equipe' = a equipe do delegado (D). " +
      "A ambiguidade existe porque 'seu/sua' pode referir-se a 2ª ou 3ª pessoa. " +
      "Em contexto com sujeito expresso (o delegado), a leitura mais natural é possessivo de 3ª pessoa, " +
      "referente ao sujeito mais próximo. " +
      "Para evitar ambiguidade, seria melhor: 'à equipe dele' ou 'à própria equipe'.",
    explanationCorrect:
      "Exato! 'Sua equipe' → mais naturalmente refere-se ao sujeito 'o delegado'. " +
      "Ambiguidade de 'seu/sua': pode ser 2ª ou 3ª pessoa. Para clareza: 'equipe dele'.",
    explanationWrong:
      "Resposta: D. 'Sua equipe' = equipe do delegado (sujeito da oração). " +
      "Ambiguidade de 'seu/sua' é clássica em provas — 'dele/dela' resolvem a ambiguidade.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_pr_pd_q04",
    contentId: CONTENT_IDS.possessivosDemo,
    statement:
      "(CEBRASPE — Adaptada) No texto 'Dois fatores determinaram o resultado: a rapidez " +
      "da resposta e a qualidade das evidências. Este foi decisivo para a condenação', " +
      "o pronome 'este' retoma anaforicamente o último elemento mencionado " +
      "('a qualidade das evidências').",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Em uso textual (anafórico com dois referentes): " +
      "'este' retoma o elemento mais próximo (último mencionado = 'a qualidade das evidências'). " +
      "'aquele' retomaria o elemento mais distante ('a rapidez da resposta'). " +
      "Regra textual: este = mais próximo/último; aquele = mais distante/primeiro. " +
      "Diferente do uso dêitico (espaço físico).",
    explanationCorrect:
      "Correto! 'Este' = retoma o último elemento mencionado ('a qualidade das evidências'). " +
      "'Aquele' retomaria o primeiro ('a rapidez'). Uso anafórico textual: este/aquele com dois referentes.",
    explanationWrong:
      "O item está CERTO. Uso textual: 'este' = último referente; 'aquele' = primeiro referente. " +
      "'Este foi decisivo' → retoma 'a qualidade das evidências' (último citado). Regra clássica.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_pr_pd_q05",
    contentId: CONTENT_IDS.possessivosDemo,
    statement:
      "(CESPE — Adaptada) Em qual alternativa 'o' funciona como pronome DEMONSTRATIVO?",
    alternatives: [
      { letter: "A", text: "O delegado assinou o mandado." },
      { letter: "B", text: "O suspeito foi detido à tarde." },
      { letter: "C", text: "Ele é mais experiente do que o esperado." },
      { letter: "D", text: "A equipe o informou sobre o prazo do inquérito." },
      { letter: "E", text: "O relatório foi entregue com antecedência." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'do que o esperado' — 'o' é pronome demonstrativo neutro, equivalente a 'aquilo'. " +
      "Pode ser parafraseado: 'do que aquilo que era esperado'. " +
      "A, B, E: 'o' é artigo definido antes de substantivo. " +
      "D: 'o informou' — 'o' é pronome pessoal oblíquo átono (OD de 3ª pessoa). " +
      "Distinção: 'o' + substantivo = artigo; 'o' substituindo ideia/oração = demonstrativo; " +
      "'o' substituindo pessoa = pronome pessoal OD.",
    explanationCorrect:
      "Exato! 'Do que o esperado' = demonstrativo neutro (= 'aquilo que era esperado'). " +
      "Três funções de 'o': artigo (antes de subst.), OD pessoal (substitui pessoa), demonstrativo (substitui ideia).",
    explanationWrong:
      "Resposta: C. 'O esperado' = pronome demonstrativo (= 'aquilo que era esperado'). " +
      "Artigo precede substantivo. OD pessoal (D) substitui pessoa. Demonstrativo substitui ideia/conceito.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_pr_pd_q06",
    contentId: CONTENT_IDS.possessivosDemo,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'A investigadora e seu parceiro concluíram o caso', " +
      "o pronome possessivo 'seu' está corretamente empregado concordando com " +
      "'investigadora' (feminino singular).",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. O pronome possessivo concorda com o SUBSTANTIVO QUE ACOMPANHA (o possuído), " +
      "não com o possuidor. " +
      "'Seu parceiro' — 'seu' concorda com 'parceiro' (masculino singular), " +
      "independentemente de quem é a investigadora. " +
      "Se fosse 'sua parceira', 'sua' concordaria com 'parceira' (feminino). " +
      "O gênero/número do possessivo reflete o objeto possuído, não o sujeito possuidor.",
    explanationCorrect:
      "Correto! O item está ERRADO. 'Seu' concorda com 'parceiro' (possuído, masculino) — não com 'investigadora'. " +
      "Regra: possessivo concorda com o substantivo que acompanha (o possuído).",
    explanationWrong:
      "O item está ERRADO. Possessivo concorda com o ser possuído ('parceiro' = masc.), não com o possuidor. " +
      "'Seu parceiro' = correto (parceiro é masc.). 'Sua parceira' também seria correto (parceira = fem.).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "por_pr_pd_q07",
    contentId: CONTENT_IDS.possessivosDemo,
    statement:
      "(CESPE — Adaptada) Na frase 'O próprio delegado conduziu a investigação', " +
      "a palavra 'próprio' exerce função de:",
    alternatives: [
      { letter: "A", text: "Adjetivo — qualifica o substantivo 'delegado'." },
      { letter: "B", text: "Pronome demonstrativo enfático — equivale a 'ele mesmo'." },
      { letter: "C", text: "Advérbio — modifica o verbo 'conduziu'." },
      { letter: "D", text: "Pronome indefinido — indica imprecisão." },
      { letter: "E", text: "Artigo — determina 'delegado' de forma definida." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'próprio' é pronome demonstrativo enfático — reforça e individualiza o sujeito, " +
      "equivalendo a 'ele mesmo' ou 'pessoalmente'. " +
      "'O próprio delegado conduziu' = 'o delegado mesmo/pessoalmente conduziu'. " +
      "Não é adjetivo porque não qualifica uma propriedade do delegado — apenas o enfatiza. " +
      "Outros pronomes enfáticos: mesmo, próprio, idêntico (quando usados com valor de ênfase pessoal).",
    explanationCorrect:
      "Exato! 'Próprio' = pronome demonstrativo enfático (= 'ele mesmo', 'pessoalmente'). " +
      "Reforça a identidade do sujeito. Não é adjetivo — não atribui qualidade.",
    explanationWrong:
      "Resposta: B. 'O próprio delegado' = pronome demonstrativo enfático (= 'o delegado mesmo'). " +
      "Diferencia-se de adjetivo: não atribui característica, apenas enfatiza identidade.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_pr_pd_q08",
    contentId: CONTENT_IDS.possessivosDemo,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Isso é o que mais preocupa os investigadores: " +
      "a falta de testemunhas', o pronome demonstrativo 'Isso' exerce função catafórica, " +
      "pois antecipa o referente que vem a seguir ('a falta de testemunhas').",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. 'Isso' é pronome demonstrativo que, nesta frase, exerce função ANAFÓRICA — " +
      "retoma algo já pressuposto no contexto ou funciona como sujeito genérico. " +
      "A catáfora (antecipação) ocorre com 'isto', 'este', quando o referente vem depois e é explicado: " +
      "'Isto preocupa os investigadores: a falta de testemunhas' — aqui 'isto' antecipa 'a falta'. " +
      "'Isso' em início de período tende ao uso anafórico (retoma o que foi dito antes). " +
      "A classificação catafórica seria mais precisa com 'isto' ou 'o seguinte'.",
    explanationCorrect:
      "Correto! O item está ERRADO. 'Isso' = tendência anafórica (retoma contexto anterior). " +
      "Catáfora = 'isto/este' antecipando referente posterior. 'Isso' aponta para o que já foi dito.",
    explanationWrong:
      "O item está ERRADO. 'Isso' = uso anafórico (referente contextual anterior). " +
      "Catáfora usa 'isto/este': 'Isto é a verdade: a falta de testemunhas'. " +
      "'Isso' em geral retoma (anáfora), 'este/isto' antecipa (catáfora).",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 4 — Pronomes Indefinidos e Interrogativos: Variáveis vs Invariáveis
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_pr_ii_q01",
    contentId: CONTENT_IDS.indefinidosInterrog,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa que apresenta APENAS pronomes indefinidos INVARIÁVEIS.",
    alternatives: [
      { letter: "A", text: "Algum, nenhum, todo, muito." },
      { letter: "B", text: "Alguém, ninguém, tudo, nada." },
      { letter: "C", text: "Outro, certo, pouco, tanto." },
      { letter: "D", text: "Qualquer, algum, quanto, cada." },
      { letter: "E", text: "Vário, muito, quanto, próprio." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'alguém, ninguém, tudo, nada' são todos invariáveis. " +
      "Pronomes indefinidos invariáveis: alguém, ninguém, algo, nada, tudo, outrem, cada, mais, menos. " +
      "A: 'algum, nenhum, todo, muito' são variáveis (alguma, nenhuma, toda, muita). " +
      "C: 'outro, certo, pouco, tanto' são variáveis (outra, certa, pouca, tanta). " +
      "D: 'algum' e 'quanto' são variáveis. " +
      "E: 'vário, muito, quanto, próprio' são variáveis.",
    explanationCorrect:
      "Exato! Invariáveis: alguém, ninguém, algo, nada, tudo, outrem, cada. " +
      "Não flexionam em gênero nem número — ficam sempre iguais.",
    explanationWrong:
      "Resposta: B. Invariáveis: alguém, ninguém, tudo, nada. " +
      "Variáveis: algum/a, nenhum/a, todo/a, muito/a, pouco/a, etc. Distinção clássica de provas.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_pr_ii_q02",
    contentId: CONTENT_IDS.indefinidosInterrog,
    statement:
      "(CEBRASPE — Adaptada) O pronome indefinido 'alguém' é invariável e, portanto, " +
      "não admite as formas 'alguma' ou 'algum' como sinônimos nessa função.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Alguém' é invariável: refere-se a pessoa indefinida sem especificação de gênero/número. " +
      "'Algum/alguma' são pronomes DIFERENTES — variáveis — que acompanham substantivos: " +
      "'algum policial', 'alguma testemunha'. " +
      "'Alguém' não acompanha substantivo — funciona sozinho: 'alguém chegou'. " +
      "Portanto, não há sinonímia direta: são pronomes distintos com usos distintos.",
    explanationCorrect:
      "Correto! 'Alguém' = invariável, funciona sozinho (sem substantivo). " +
      "'Algum/alguma' = variáveis, acompanham substantivos. São pronomes distintos.",
    explanationWrong:
      "O item está CERTO. 'Alguém' é pronome indefinido invariável — não se confunde com 'algum/alguma'. " +
      "'Alguém' não acompanha substantivo; 'algum/alguma' sim.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "por_pr_ii_q03",
    contentId: CONTENT_IDS.indefinidosInterrog,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que a diferença de sentido entre " +
      "'todo policial' e 'todo o policial' está corretamente explicada.",
    alternatives: [
      { letter: "A", text: "'Todo policial' = cada policial individualmente; 'todo o policial' = o policial inteiro." },
      { letter: "B", text: "'Todo policial' = todos os policiais; 'todo o policial' = cada policial individualmente." },
      { letter: "C", text: "Não há diferença de sentido — as formas são intercambiáveis." },
      { letter: "D", text: "'Todo policial' = o policial inteiro (totalidade); 'todo o policial' = cada policial." },
      { letter: "E", text: "'Todo o policial' é incorreto — artigo após pronome indefinido é proibido." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CORRETO: " +
      "'Todo policial' (sem artigo) = cada policial, qualquer policial — sentido distributivo/universal. " +
      "Ex.: 'Todo policial deve portar identificação' = cada um deve. " +
      "'Todo o policial' (com artigo) = o policial inteiro, a integralidade do ser — sentido de totalidade. " +
      "Ex.: 'Todo o policial estava uniformizado' = o policial por completo. " +
      "Diferença sutil mas cobrada em provas de alto nível.",
    explanationCorrect:
      "Exato! 'Todo' + subst. = distributivo (cada um). 'Todo o' + subst. = totalidade (o ser inteiro). " +
      "Distinção de sentido clássica no uso de 'todo' como indefinido.",
    explanationWrong:
      "Resposta: A. 'Todo policial' = sentido distributivo (cada). 'Todo o policial' = totalidade (inteiro). " +
      "O artigo 'o' entre 'todo' e o substantivo muda o sentido radicalmente.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_pr_ii_q04",
    contentId: CONTENT_IDS.indefinidosInterrog,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Quaisquer evidências encontradas devem ser " +
      "preservadas', o pronome indefinido 'quaisquer' está corretamente empregado " +
      "como plural de 'qualquer'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Qualquer' tem o plural 'quaisquer' — é o único pronome indefinido terminado em " +
      "'-quer' que possui forma plural. " +
      "'Quaisquer evidências' = evidências de qualquer tipo/natureza — uso correto e necessário " +
      "porque 'evidências' está no plural. " +
      "Erro comum: usar 'qualquer evidências' (falta de concordância) ou " +
      "'qualquers' (forma inventada e inexistente).",
    explanationCorrect:
      "Correto! 'Quaisquer' = plural correto de 'qualquer'. " +
      "Regra: qualquer → quaisquer (troca -quer por -isquer, mas o acento mantém: quaisquer).",
    explanationWrong:
      "O item está CERTO. 'Quaisquer' = plural de 'qualquer'. " +
      "Uso correto concordando com 'evidências' (plural). 'Qualquer evidências' seria errado.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_pr_ii_q05",
    contentId: CONTENT_IDS.indefinidosInterrog,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que 'que' exerce função de " +
      "pronome INTERROGATIVO.",
    alternatives: [
      { letter: "A", text: "O investigador disse que o suspeito fugiu." },
      { letter: "B", text: "O agente que estava de plantão registrou o boletim." },
      { letter: "C", text: "Que evidências foram encontradas na cena do crime?" },
      { letter: "D", text: "É necessário que todos cooperem com a investigação." },
      { letter: "E", text: "Há muito tempo que a delegacia não resolvia um caso assim." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'Que evidências foram encontradas?' — 'que' é pronome interrogativo que " +
      "determina o substantivo 'evidências' em pergunta direta. " +
      "A: 'que' = conjunção integrante (objetiva direta de 'disse'). " +
      "B: 'que' = pronome relativo (antecedente: 'agente'). " +
      "D: 'que' = conjunção integrante (oração subjetiva). " +
      "E: 'que' = expletivo/de realce.",
    explanationCorrect:
      "Exato! 'Que evidências?' = pronome interrogativo (introduz pergunta, determina substantivo). " +
      "Distingue-se do 'que' integrante, relativo e expletivo pelo contexto de interrogação.",
    explanationWrong:
      "Resposta: C. 'Que evidências?' = interrogativo (pergunta direta + determina substantivo). " +
      "Os demais: integrante (A, D), relativo (B), expletivo (E).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_pr_ii_q06",
    contentId: CONTENT_IDS.indefinidosInterrog,
    statement:
      "(CEBRASPE — Adaptada) O pronome indefinido 'cada' é invariável e não admite " +
      "forma plural (*'cadas'). Em consequência, o verbo que tem 'cada' como núcleo " +
      "do sujeito deve sempre concordar no singular.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Cada' é invariável (não existe 'cadas'). " +
      "O verbo concordará com o substantivo que 'cada' acompanha, geralmente no singular: " +
      "'Cada policial deve portar seu crachá' — 'deve' no singular (concorda com 'policial', singular). " +
      "Nota: quando 'cada' acompanha substantivo plural (raro), o verbo vai para o plural: " +
      "'Cada dois policiais formam uma dupla.'",
    explanationCorrect:
      "Correto! 'Cada' invariável → concordância com o substantivo que acompanha (normalmente singular). " +
      "'Cada policial deve' (sing.). 'Cadas' não existe.",
    explanationWrong:
      "O item está CERTO. 'Cada' não tem plural. Concordância geralmente no singular: " +
      "'Cada agente deve registrar seu ponto.' — verbo e possessivo no singular.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "por_pr_ii_q07",
    contentId: CONTENT_IDS.indefinidosInterrog,
    statement:
      "(CESPE — Adaptada) Em qual alternativa a palavra 'certo' funciona como " +
      "pronome indefinido (e não como adjetivo)?",
    alternatives: [
      { letter: "A", text: "O delegado tomou a decisão certa no momento certo." },
      { letter: "B", text: "A resposta certa foi identificada pelo perito forense." },
      { letter: "C", text: "Certo investigador trouxe novas informações sobre o caso." },
      { letter: "D", text: "O agente estava certo quanto ao horário do crime." },
      { letter: "E", text: "A única saída certa era confiar nas evidências físicas." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'Certo investigador' — 'certo' antes do substantivo sem artigo funciona como " +
      "pronome indefinido, equivalendo a 'um certo', 'determinado'. " +
      "Indica vagueza/indeterminação: não se sabe exatamente qual investigador. " +
      "A, B, E: 'certa', 'certa', 'certa' após ou antes com artigo = adjetivo (correto, sem erro). " +
      "D: 'estava certo' = predicativo do sujeito (adjetivo após VL). " +
      "Distinção: antes do subst. sem artigo = indefinido; com artigo ou após VL = adjetivo.",
    explanationCorrect:
      "Exato! 'Certo' + substantivo (sem artigo) = pronome indefinido (= 'um certo', 'determinado'). " +
      "Com artigo ou após verbo de ligação = adjetivo. Distinção de função pela posição.",
    explanationWrong:
      "Resposta: C. 'Certo investigador' = indefinido ('determinado investigador', sem especificação). " +
      "Adjetivo: 'o investigador certo', 'o certo investigador'. Posição e artigo determinam a classe.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_pr_ii_q08",
    contentId: CONTENT_IDS.indefinidosInterrog,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Outrem não pode ser responsabilizado por " +
      "seus atos', o pronome indefinido 'outrem' refere-se a pessoas indeterminadas " +
      "e é equivalente a 'outra pessoa' ou 'outro'. É pronome invariável.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Outrem' = pronome indefinido invariável, arcaico, que significa 'outra pessoa', " +
      "'alguém além de si mesmo'. Não flexiona em gênero ou número. " +
      "Uso frequente em textos jurídicos e literários: 'prejudicar outrem', 'direitos de outrem'. " +
      "Equivale a 'outra pessoa' mas não é idêntico a 'outro' (que é variável: outro/outra/outros/outras).",
    explanationCorrect:
      "Correto! 'Outrem' = pronome indefinido invariável (= 'outra pessoa'). " +
      "Frequente em textos jurídicos. Não se confunde com 'outro' (variável).",
    explanationWrong:
      "O item está CERTO. 'Outrem' = invariável, significa 'outra pessoa'. " +
      "Arcaico mas ainda cobrado em provas jurídicas. Diferente de 'outro' (variável: outra/outros/outras).",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 5 — Pronomes Relativos: 'cujo', 'onde' e as Pegadinhas de Banca
  // ══════════════════════════════════════════════════════════════════════════

  // Q01 — ME — FACIL
  {
    id: "por_pr_re_q01",
    contentId: CONTENT_IDS.relativos,
    statement:
      "(CESPE — Adaptada) Assinale a alternativa em que a palavra sublinhada é pronome RELATIVO.",
    alternatives: [
      { letter: "A", text: "O delegado _que_ ordenou a operação foi parabenizado." },
      { letter: "B", text: "A perita disse _que_ o laudo estava pronto." },
      { letter: "C", text: "É necessário _que_ todos cooperem com a investigação." },
      { letter: "D", text: "Há muito tempo _que_ não havia um caso assim." },
      { letter: "E", text: "_Que_ tipo de crime foi registrado?" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CORRETO: 'O delegado que ordenou...' — 'que' é pronome relativo (antecedente: 'delegado'). " +
      "Pode ser substituído por 'o qual': 'o delegado o qual ordenou'. " +
      "B e C: 'que' = conjunção integrante (oração substantiva). " +
      "D: 'que' = expletivo de realce. " +
      "E: 'que' = pronome interrogativo. " +
      "Pronome relativo sempre tem antecedente e pode ser substituído por 'o qual/a qual'.",
    explanationCorrect:
      "Exato! 'Que' relativo: tem antecedente ('delegado') + pode ser substituído por 'o qual'. " +
      "Teste rápido: se tem antecedente nominal → relativo.",
    explanationWrong:
      "Resposta: A. 'Que' = relativo (antecedente: 'delegado'; substituível por 'o qual'). " +
      "Sem antecedente = integrante (B, C) ou expletivo (D) ou interrogativo (E).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 — CE — FACIL
  {
    id: "por_pr_re_q02",
    contentId: CONTENT_IDS.relativos,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O policial cujo depoimento foi gravado recebeu " +
      "proteção especial', o uso de 'cujo' está correto, e seria erro inserir artigo " +
      "entre 'cujo' e 'depoimento' ('cujo o depoimento').",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Cujo' é pronome relativo que exprime posse — NÃO admite artigo depois de si. " +
      "'Cujo depoimento' ✓ — 'cujo o depoimento' ✗ (artigo entre cujo e subst. é erro grave). " +
      "Regra mnemônica: 'cujo ≠ cujo+artigo'. " +
      "Cujo concorda com o possuído (não com o possuidor): " +
      "'o policial cujo depoimento' = depoimento (masc.) → 'cujo' (masc.). " +
      "Se fosse 'a policial cuja declaração' = declaração (fem.) → 'cuja' (fem.).",
    explanationCorrect:
      "Correto! 'Cujo' sem artigo depois — regra absoluta. 'Cujo o' é erro clássico de concurso. " +
      "Cujo concorda com o possuído: depoimento (masc.) → cujo (masc.).",
    explanationWrong:
      "O item está CERTO. 'Cujo' NÃO admite artigo depois: 'cujo depoimento' correto. " +
      "'Cujo o depoimento' = erro gravíssimo e cobradíssimo. Cujo = de quem / do qual (posse).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },

  // Q03 — ME — MEDIO
  {
    id: "por_pr_re_q03",
    contentId: CONTENT_IDS.relativos,
    statement:
      "(CESPE — Adaptada) Em qual alternativa o uso de 'onde' está INCORRETO?",
    alternatives: [
      { letter: "A", text: "A delegacia onde o suspeito foi preso fica no centro." },
      { letter: "B", text: "O local onde ocorreu o crime foi isolado pela perícia." },
      { letter: "C", text: "A situação onde todos perdem é a pior possível." },
      { letter: "D", text: "O bairro onde a vítima morava foi monitorado." },
      { letter: "E", text: "A sala onde a reunião aconteceu foi interditada." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "INCORRETO: 'A situação onde...' — 'onde' só deve ser usado com antecedente de lugar (físico ou metafórico). " +
      "'Situação' não é lugar → erro. Correto: 'A situação em que todos perdem...' " +
      "A, B, D, E: antecedentes são lugares físicos (delegacia, local, bairro, sala) → 'onde' correto. " +
      "Regra: 'onde' = antecedente de lugar. Com abstrações (situação, momento, caso, contexto) → use 'em que'.",
    explanationCorrect:
      "Exato! 'Onde' = antecedente de lugar. 'Situação' não é lugar → 'onde' incorreto. " +
      "Correto: 'situação em que'. Pegadinha clássica: 'onde' com antecedente abstrato.",
    explanationWrong:
      "Resposta: C. 'A situação onde' = errado. 'Situação' não é lugar. " +
      "Correto: 'a situação em que'. 'Onde' só com antecedentes de lugar (delegacia, sala, bairro, local).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 — CE — MEDIO
  {
    id: "por_pr_re_q04",
    contentId: CONTENT_IDS.relativos,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O investigador cuja família foi ameaçada " +
      "recebeu proteção policial', o pronome 'cuja' concorda com 'investigador' " +
      "(possuidor), ficando no masculino.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. 'Cujo/cuja' concorda com o POSSUÍDO, não com o possuidor. " +
      "'Investigador' = possuidor (masculino). " +
      "'Família' = possuído (feminino) → 'cuja' (feminino) ✓. " +
      "Se fosse 'o investigador cujo irmão foi ameaçado' → 'cujo' (masc., concorda com 'irmão'). " +
      "Regra: cujo/cuja/cujos/cujas concordam em gênero e número com o substantivo que acompanham (o possuído).",
    explanationCorrect:
      "Correto! O item está ERRADO. 'Cuja' concorda com 'família' (possuído, feminino) — não com 'investigador'. " +
      "Regra do cujo: concordância com o possuído, não com o possuidor.",
    explanationWrong:
      "O item está ERRADO. 'Cuja' concorda com 'família' (fem.) = o ser possuído. " +
      "Nunca com o possuidor. Regra: cujo/cuja/cujos/cujas = concordância com o possuído.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q05 — ME — MEDIO
  {
    id: "por_pr_re_q05",
    contentId: CONTENT_IDS.relativos,
    statement:
      "(CESPE — Adaptada) Em qual alternativa o pronome relativo está corretamente " +
      "empregado com preposição?",
    alternatives: [
      { letter: "A", text: "O caso que o delegado falou já foi arquivado." },
      { letter: "B", text: "A operação que participei foi bem-sucedida." },
      { letter: "C", text: "O suspeito com quem o investigador conversou negou tudo." },
      { letter: "D", text: "A testemunha que depôs é a pessoa que vi ontem." },
      { letter: "E", text: "O inquérito que todos colaboraram foi concluído." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "CORRETO: 'com quem o investigador conversou' — 'quem' aceita preposição antes e refere-se a pessoa. " +
      "Estrutura: preposição + quem + oração relativa. " +
      "A: 'o caso que o delegado falou' — 'falar de algo' exige preposição: 'do qual o delegado falou'. " +
      "B: 'a operação que participei' — 'participar de' exige preposição: 'da qual participei'. " +
      "D: correto no uso de 'que', mas sem preposição necessária. " +
      "E: 'o inquérito que todos colaboraram' — 'colaborar com' exige preposição: 'com o qual'.",
    explanationCorrect:
      "Exato! 'Com quem' = preposição + relativo correto para pessoa. " +
      "Verbos transitivos indiretos (falar de, participar de, colaborar com) exigem preposição no relativo.",
    explanationWrong:
      "Resposta: C. 'Com quem conversou' = correto (prep. + relativo para pessoa). " +
      "Verbos com preposição (falar de, participar de) exigem 'do qual/da qual' no relativo — nunca 'que' nu.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 — CE — MEDIO
  {
    id: "por_pr_re_q06",
    contentId: CONTENT_IDS.relativos,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'Aonde o investigador foi, encontrou pistas importantes', " +
      "o uso de 'aonde' está correto porque o verbo 'foi' indica movimento.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'Aonde' = 'a' + 'onde' — usado com verbos de MOVIMENTO (ir, chegar, levar, trazer). " +
      "'Foi' = verbo de movimento → 'aonde' correto. " +
      "'Onde' = usado com verbos de estado/permanência (estar, ficar, morar, permanecer). " +
      "Exemplos: 'Onde você mora?' (estado). 'Aonde você vai?' (movimento). " +
      "Distinção importante: aonde = direção; onde = lugar.",
    explanationCorrect:
      "Correto! 'Aonde' com verbo de movimento ('foi') = correto. " +
      "'Onde' = estado (morar, estar). 'Aonde' = movimento (ir, chegar). Distinção clássica de concurso.",
    explanationWrong:
      "O item está CERTO. 'Aonde' = verbo de movimento. 'Onde' = verbo de estado. " +
      "'Foi' (movimento) → 'aonde' correto. 'Estava' (estado) → 'onde'.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },

  // Q07 — ME — DIFICIL
  {
    id: "por_pr_re_q07",
    contentId: CONTENT_IDS.relativos,
    statement:
      "(CESPE — Adaptada) Em qual alternativa o pronome relativo 'quanto' está " +
      "corretamente empregado?",
    alternatives: [
      { letter: "A", text: "O investigador quanto mais estudava, mais aprendia." },
      { letter: "B", text: "Trouxeram tudo quanto era necessário para a perícia." },
      { letter: "C", text: "O delegado quanto presidia a reunião foi aplaudido." },
      { letter: "D", text: "A testemunha quanto depôs mentiu sobre o horário." },
      { letter: "E", text: "O perito quanto analisou as evidências chegou à conclusão." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "CORRETO: 'tudo quanto era necessário' — 'quanto' é pronome relativo correlacionado com " +
      "o pronome indefinido 'tudo'. " +
      "Uso correto: 'tudo quanto', 'tanto quanto', 'todos quantos'. " +
      "Estrutura: pronome/advérbio + quanto + oração relativa. " +
      "A, C, D, E: 'quanto' não tem correlato adequado e não é pronome relativo nesses contextos — " +
      "seriam usos incompatíveis.",
    explanationCorrect:
      "Exato! 'Tudo quanto' = pronome indefinido + relativo 'quanto'. " +
      "Outros correlatos: 'tanto quanto', 'todos quantos'. 'Quanto' relativo exige correlativo anterior.",
    explanationWrong:
      "Resposta: B. 'Tudo quanto era necessário' = 'quanto' relativo correlacionado com 'tudo'. " +
      "Estrutura: tudo/tanto/todos + quanto/quantos. Sem correlato, 'quanto' não funciona como relativo.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 — CE — DIFICIL
  {
    id: "por_pr_re_q08",
    contentId: CONTENT_IDS.relativos,
    statement:
      "(CEBRASPE — Adaptada) Na frase 'O suspeito foi preso, o que surpreendeu " +
      "toda a equipe', o pronome relativo 'o que' retoma toda a oração anterior " +
      "('o suspeito foi preso'), e não apenas um substantivo específico.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. 'O que' (pronome relativo composto) pode retomar uma oração inteira — " +
      "fenômeno chamado de 'antecedente oracional'. " +
      "Neste caso, o fato de 'o suspeito ter sido preso' é o que surpreendeu a equipe — " +
      "a oração anterior é o antecedente. " +
      "Outros relativos que admitem antecedente oracional: 'o qual', 'o que'. " +
      "Não confundir com 'o que' interrogativo ('O que você quer?').",
    explanationCorrect:
      "Correto! 'O que' pode ter como antecedente uma oração inteira (antecedente oracional). " +
      "'O que surpreendeu' = o fato de ter sido preso. Uso culto e correto.",
    explanationWrong:
      "O item está CERTO. 'O que' com antecedente oracional é uso correto e sofisticado. " +
      "Retoma toda a ideia anterior: 'o fato de o suspeito ter sido preso surpreendeu a equipe'.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
];

// ─── RUNNER ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Seed R39 — Densificação: Português — Pronomes (40 questões) ===\n");

  // 1. Verificar se os átomos existem e coletar subjectId/topicId do primeiro
  console.log("--- Verificando átomos de conteúdo ---");
  let subjectId: string | null = null;
  let topicId: string | null = null;

  for (const [nome, contentId] of Object.entries(CONTENT_IDS)) {
    const rows = (await db.execute(sql`
      SELECT id, "subjectId", "topicId" FROM "Content" WHERE id = ${contentId} LIMIT 1
    `)) as any[];

    if (!rows[0]) {
      console.warn(`  AVISO: átomo '${nome}' (${contentId}) não encontrado no banco.`);
    } else {
      console.log(`  OK: ${nome} → ${contentId}`);
      if (!subjectId) {
        subjectId = rows[0].subjectId;
        topicId   = rows[0].topicId;
      }
    }
  }

  if (!subjectId) {
    throw new Error(
      "Nenhum átomo de pronomes encontrado. Verifique se os IDs estão corretos:\n" +
      JSON.stringify(CONTENT_IDS, null, 2)
    );
  }

  console.log(`\nSubject: ${subjectId}`);
  console.log(`Topic:   ${topicId}`);

  // 2. Inserir Questões
  console.log("\n--- Inserindo Questões ---");
  let inseridos = 0;
  let pulados   = 0;

  for (const q of questions) {
    const contentRows = (await db.execute(sql`
      SELECT id FROM "Content" WHERE id = ${q.contentId} LIMIT 1
    `)) as any[];

    if (!contentRows[0]) {
      console.warn(`  SKIP: contentId ${q.contentId} não encontrado para ${q.id}`);
      pulados++;
      continue;
    }

    const alternativesJson = JSON.stringify(q.alternatives);

    await db.execute(sql`
      INSERT INTO "Question" (
        "id", "statement", "alternatives", "correctAnswer", "correctOption",
        "explanation", "explanationCorrect", "explanationWrong",
        "subjectId", "topicId", "contentId",
        "isActive", "difficulty", "timesUsed", "questionType",
        "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternativesJson}::jsonb,
        ${q.correctAnswer}, ${q.correctOption},
        ${q.explanation}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${subjectId}, ${topicId}, ${q.contentId},
        true, ${q.difficulty}, 0, ${q.questionType}, NOW(), NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `);

    console.log(`  OK: ${q.id} [${q.questionType}] — ${q.statement.substring(0, 55)}...`);
    inseridos++;
  }

  console.log(`\n=== R39 concluído ===`);
  console.log(`  Questões inseridas : ${inseridos}`);
  console.log(`  Puladas (duplicata): ${pulados}`);
  console.log(`  Total processado   : ${questions.length}`);
  console.log(`\n  Distribuição por átomo:`);
  console.log(`    Pronomes Pessoais          : 8 questões → ${CONTENT_IDS.pessoais}`);
  console.log(`    Pronomes de Tratamento     : 8 questões → ${CONTENT_IDS.tratamento}`);
  console.log(`    Possessivos e Demonstrat.  : 8 questões → ${CONTENT_IDS.possessivosDemo}`);
  console.log(`    Indefinidos e Interrogat.  : 8 questões → ${CONTENT_IDS.indefinidosInterrog}`);
  console.log(`    Pronomes Relativos         : 8 questões → ${CONTENT_IDS.relativos}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("ERRO no seed R39:", err);
  process.exit(1);
});
