/**
 * Seed: Direito Penal — Teoria do Crime: Fato Típico
 * (Conduta, Resultado, Nexo Causal, Tipicidade)
 *
 * Popula 6 átomos de Conteúdo + 12 Questões.
 * Idempotente: verifica existência antes de inserir.
 *
 * Execução:
 *   npx tsx db/seed-direito-penal-fato-tipico.ts
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

async function contentExists(title: string, subjectId: string): Promise<boolean> {
  const rows = await db.execute(sql`
    SELECT id FROM "Content" WHERE title = ${title} AND "subjectId" = ${subjectId} LIMIT 1
  `) as any[];
  return rows.length > 0;
}

async function getContentId(title: string, subjectId: string): Promise<string | null> {
  const rows = await db.execute(sql`
    SELECT id FROM "Content" WHERE title = ${title} AND "subjectId" = ${subjectId} LIMIT 1
  `) as any[];
  return rows[0]?.id ?? null;
}

async function questionExists(id: string): Promise<boolean> {
  const rows = await db.execute(sql`
    SELECT id FROM "Question" WHERE id = ${id} LIMIT 1
  `) as any[];
  return rows.length > 0;
}

// ============================================
// CONTEÚDOS (6 átomos — < 500 chars cada)
// ============================================

interface ContentAtom {
  title: string;
  textContent: string;
  mnemonic: string;
  keyPoint: string;
  practicalExample: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
}

const contents: ContentAtom[] = [
  // ── 1. Fato Típico — Os 4 Elementos ──────────────────────────────────────
  {
    title: "Fato Típico: Elementos (Conduta, Resultado, Nexo e Tipicidade)",
    textContent: `Fato típico é o 1º substrato do crime (Teoria Tripartida). Seus 4 elementos: (1) Conduta — ação ou omissão humana voluntária; (2) Resultado — modificação no mundo (crimes materiais); (3) Nexo Causal — relação causa→efeito entre conduta e resultado; (4) Tipicidade — adequação da conduta a um tipo penal expresso em lei (legalidade estrita).`,
    mnemonic: "CRNT: Conduta → Resultado → Nexo → Tipicidade. Sem qualquer um deles, o fato é ATÍPICO.",
    keyPoint: "Culpabilidade NÃO faz parte do fato típico — é o 2º substrato do crime na Teoria Tripartida. Erro clássico de prova.",
    practicalExample: "Guarda que dispara (conduta) → vítima morre (resultado) → tiro causou a morte (nexo) → homicídio está no CP (tipicidade) = fato típico. Faltando qualquer elemento, não há crime.",
    difficulty: "FACIL",
  },
  // ── 2. Conduta — Ação, Omissão, Crimes Omissivos ─────────────────────────
  {
    title: "Conduta: Ação, Omissão e Crimes Omissivos (Próprio e Impróprio)",
    textContent: `Conduta é o comportamento humano voluntário. Ação: fazer o proibido. Omissão: deixar de fazer o mandado. Crimes omissivos PRÓPRIOS: o tipo descreve a própria omissão (ex.: omissão de socorro, art. 135 CP). Crimes omissivos IMPRÓPRIOS (comissivos por omissão): praticados pelo GARANTIDOR — quem tinha dever jurídico de agir e não agiu (art. 13, §2º CP).`,
    mnemonic: "PRÓPRIO = tipo descreve a omissão (omissão de socorro). IMPRÓPRIO = garantidor que podia e devia agir e não agiu.",
    keyPoint: "Garantidor (art. 13, §2º CP): tem obrigação legal de proteção; assumiu a responsabilidade de cuidado; ou criou o perigo com sua conduta anterior.",
    practicalExample: "Policial que, podendo agir sem risco, omite socorro a vítima de agressão: crime omissivo IMPRÓPRIO (é garantidor ex lege). Médico que não liga 192 estando de folga: omissão de socorro PRÓPRIA (art. 135 CP).",
    difficulty: "FACIL",
  },
  // ── 3. Nexo Causal — Conditio Sine Qua Non ───────────────────────────────
  {
    title: "Nexo Causal: Teoria da Equivalência (Conditio Sine Qua Non)",
    textContent: `O CP adota a Teoria da Equivalência dos Antecedentes (art. 13, caput): é causa tudo que, eliminado hipoteticamente, faz o resultado desaparecer — o chamado "processo de eliminação de Thyrén". Para evitar regressão ao infinito (ex.: fabricante da arma?), exige-se DOLO ou CULPA em relação ao resultado — limite que a doutrina denomina Teoria da Imputação Objetiva.`,
    mnemonic: "ELIMINAÇÃO HIPOTÉTICA: 'Suprimo mentalmente a conduta. O resultado desaparece? Sim → era causa. Não → não era causa.'",
    keyPoint: "Conditio sine qua non literalmente: 'condição sem a qual não'. O freio ao regresso ao infinito é a exigência de dolo ou culpa — sem eles, o fato é atípico.",
    practicalExample: "Policial dispara em suspeito (A). O disparo é causa da morte? Suprima mentalmente o disparo: sem ele, a morte não ocorreria → é causa. O fornecedor da munição: dolo/culpa? Não → não é causa relevante.",
    difficulty: "FACIL",
  },
  // ── 4. Concausas ─────────────────────────────────────────────────────────
  {
    title: "Concausas: Absolutamente e Relativamente Independentes",
    textContent: `Concausa concorre com a conduta do agente. ABSOLUTAMENTE INDEPENDENTE: por si só produziria o resultado → rompe o nexo; agente responde só pelos atos. RELATIVAMENTE INDEPENDENTE PREEXISTENTE: (ex.: hemofilia) → não rompe o nexo → agente responde pelo resultado. SUPERVENIENTE QUE POR SI SÓ PRODUZIU O RESULTADO (ex.: infecção hospitalar): art. 13, §1º CP → rompe o nexo → agente responde só pela tentativa.`,
    mnemonic: "ABS-INDEP = rompe nexo. REL-PREEXIST = não rompe. REL-SUPER-POR SI SÓ = rompe (art. 13, §1º) → só tentativa.",
    keyPoint: "Art. 13, §1º CP: causa SUPERVENIENTE RELATIVAMENTE independente que POR SI SÓ produziu o resultado rompe o nexo. O agente responde apenas pela tentativa.",
    practicalExample: "Policial fere vítima hemofílica → morte por hemorragia: concausa REL-PREEXISTENTE → responde por homicídio consumado. Vítima ferida contrai infecção hospitalar fatal (causa nova) → REL-SUPER-POR SI SÓ → só tentativa.",
    difficulty: "MEDIO",
  },
  // ── 5. Dolo Direto, Dolo Eventual e Culpa Consciente ────────────────────
  {
    title: "Dolo e Culpa: Direto, Eventual e Culpa Consciente",
    textContent: `Dolo DIRETO: o agente QUER o resultado (previsão + vontade). Dolo EVENTUAL: PREVÊ o resultado como possível e ASSUME O RISCO de produzi-lo — "tanto faz se acontecer" (art. 18, I, in fine). Culpa CONSCIENTE: PREVÊ o resultado mas CONFIA sinceramente que não ocorrerá. A diferença-chave é a ACEITAÇÃO: dolo eventual ACEITA o resultado; culpa consciente o REJEITA.`,
    mnemonic: "DOLO EVENTUAL = ASSUME (aceita o resultado). CULPA CONSCIENTE = CONFIA QUE NÃO (rejeita, mas foi imprudente ao confiar).",
    keyPoint: "A fronteira dolo eventual / culpa consciente é a aceitação psíquica do resultado. Nos acidentes de trânsito, o STF analisa caso a caso: velocidade absurda + contexto = dolo eventual.",
    practicalExample: "Motorista a 200 km/h em área urbana: prevê que pode matar alguém e 'assume o risco' → dolo eventual. Motorista a 80 km/h em chuva, derrapa e mata: previu mas confiou que não ocorreria → culpa consciente.",
    difficulty: "MEDIO",
  },
  // ── 6. Tipicidade Formal/Material e Iter Criminis ────────────────────────
  {
    title: "Tipicidade Formal, Material, Iter Criminis e Tentativa",
    textContent: `Tipicidade FORMAL: adequação da conduta ao texto do tipo penal. Tipicidade MATERIAL: exige lesividade REAL e SUFICIENTE — afasta o crime quando o bem jurídico não é efetivamente lesado (princípio da insignificância). Iter criminis: Cogitação → Preparação → Execução → Consumação. PUNÍVEIS: Execução (tentativa) e Consumação. Preparação só é punida se a lei criar tipo autônomo.`,
    mnemonic: "ITER = CPEC: Cogitação → Preparação → Execução → Consumação. Punição começa na EXECUÇÃO. Insignificância afasta tipicidade MATERIAL.",
    keyPoint: "Tentativa (art. 14, II CP): início da execução + interrupção por circunstâncias ALHEIAS à vontade do agente. Desistência voluntária (art. 15) = agente para voluntariamente → responde só pelos atos já praticados.",
    practicalExample: "Agente cogita furto (impunível) → compra luvas e gazua (preparação, impunível) → arromba a porta (execução — tentativa punível) → leva o bem (consumação). Se luvas custam R$ 5 e furta R$ 20: insignificância afasta tipicidade material.",
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
  alternatives: Alternative[];
  correctAnswer: string;
  correctOption: number;
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  contentTitle: string;
}

const questions: QuestionData[] = [
  // ── Q1 — Elementos do Fato Típico (Municipal / FACIL) ────────────────────
  {
    id: "qz_dpen_ft_001",
    statement: "Sobre o fato típico e seus elementos, assinale a alternativa que indica um elemento que NÃO integra o fato típico:",
    alternatives: [
      { letter: "A", text: "Conduta humana voluntária (ação ou omissão)." },
      { letter: "B", text: "Nexo de causalidade entre conduta e resultado." },
      { letter: "C", text: "Culpabilidade (juízo de reprovação sobre o agente)." },
      { letter: "D", text: "Tipicidade (adequação da conduta ao tipo penal)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Na Teoria Tripartida do Crime (majoritária no Brasil), o crime possui três substratos: (1) Fato Típico, (2) Ilicitude e (3) Culpabilidade. O fato típico é formado por: conduta, resultado, nexo causal e tipicidade. A culpabilidade é o terceiro substrato — jamais elemento do fato típico.",
    explanationCorrect: "Correto! Culpabilidade é o 3º substrato do crime na teoria tripartida — não integra o fato típico. Os 4 elementos do fato típico são: Conduta, Resultado, Nexo e Tipicidade (CRNT).",
    explanationWrong: "Atenção: culpabilidade é o 3º substrato do crime (após fato típico e ilicitude). O fato típico tem 4 elementos: Conduta, Resultado, Nexo Causal e Tipicidade. Esse é um dos erros mais frequentes em provas.",
    difficulty: "FACIL",
    contentTitle: "Fato Típico: Elementos (Conduta, Resultado, Nexo e Tipicidade)",
  },
  // ── Q2 — Omissão Imprópria: O Garantidor (Municipal / FACIL) ─────────────
  {
    id: "qz_dpen_ft_002",
    statement: "Um salva-vidas em serviço, podendo agir sem risco pessoal, observa uma criança se afogando e não a socorre. A criança morre. A conduta do salva-vidas configura:",
    alternatives: [
      { letter: "A", text: "Crime omissivo próprio (art. 135 CP — omissão de socorro), pois a omissão está tipificada." },
      { letter: "B", text: "Fato atípico, pois o salva-vidas não causou ativamente o afogamento." },
      { letter: "C", text: "Crime omissivo impróprio (comissivo por omissão), pois o salva-vidas é garantidor com dever jurídico de agir." },
      { letter: "D", text: "Crime culposo, pois agiu com negligência ao não verificar a segurança da área de banho." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O salva-vidas assumiu a responsabilidade de cuidado — enquadra-se no art. 13, §2º, b, CP (garantidor que por ato anterior criou dever de proteção). Sua omissão equivale à ação causadora do resultado. Responde pelo crime omissivo IMPRÓPRIO (homicídio, e não mera omissão de socorro do art. 135 CP, que é crime próprio com pena bem menor).",
    explanationCorrect: "Perfeito! O salva-vidas é garantidor — assumiu o dever de proteção. Sua omissão equivale a matar, configurando crime omissivo impróprio (comissivo por omissão).",
    explanationWrong: "O art. 135 CP (omissão de socorro) aplica-se a quem NÃO tem dever especial. Quando há vínculo de garantidor (contrato, lei ou criação do perigo), a omissão é IMPRÓPRIA — o agente responde pelo resultado morte como se tivesse agido.",
    difficulty: "FACIL",
    contentTitle: "Conduta: Ação, Omissão e Crimes Omissivos (Próprio e Impróprio)",
  },
  // ── Q3 — Conditio Sine Qua Non (Municipal / FACIL) ───────────────────────
  {
    id: "qz_dpen_ft_003",
    statement: "Pela Teoria da Equivalência dos Antecedentes (conditio sine qua non), adotada pelo art. 13, caput, do Código Penal, considera-se causa do resultado:",
    alternatives: [
      { letter: "A", text: "Apenas a última conduta praticada imediatamente antes do resultado." },
      { letter: "B", text: "Somente as condutas dolosas; condutas culposas não estabelecem nexo causal." },
      { letter: "C", text: "Todo antecedente que, suprimido hipoteticamente, faria o resultado desaparecer." },
      { letter: "D", text: "Apenas a conduta mais próxima (causa próxima), excluindo-se as causas remotas." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O 'processo de eliminação hipotética de Thyrén' é o método da teoria: suprima mentalmente a conduta — se o resultado desaparece, ela era causa. Não importa se a causa é remota ou próxima; não importa se é dolosa ou culposa para fins de imputação objetiva. O freio ao regresso ao infinito é a exigência de dolo ou culpa em relação ao resultado.",
    explanationCorrect: "Exato! Conditio sine qua non = eliminação hipotética. Todo antecedente sem o qual o resultado não ocorreria é causa. Simples e direto.",
    explanationWrong: "A teoria da equivalência dos antecedentes NÃO distingue causa próxima de remota, nem dolosa de culposa para fins de nexo causal. O critério é único: suprimida mentalmente a conduta, o resultado desaparece?",
    difficulty: "FACIL",
    contentTitle: "Nexo Causal: Teoria da Equivalência (Conditio Sine Qua Non)",
  },
  // ── Q4 — Dolo Direto (Municipal / FACIL) ─────────────────────────────────
  {
    id: "qz_dpen_ft_004",
    statement: "Um policial, em legítima defesa, efetua disparos contra o agressor com a intenção deliberada de eliminar a ameaça. O elemento subjetivo da sua conduta é:",
    alternatives: [
      { letter: "A", text: "Culpa consciente, pois tinha previsão mas confiou que não precisaria atirar." },
      { letter: "B", text: "Culpa inconsciente, pois o resultado não era previsível para um policial treinado." },
      { letter: "C", text: "Dolo eventual, pois o resultado morte era apenas uma possibilidade aceita." },
      { letter: "D", text: "Dolo direto, pois o agente QUER conscientemente o resultado de sua conduta." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "Dolo direto (art. 18, I, CP): o agente representou o resultado e dirigiu sua vontade para alcançá-lo — quer o resultado. No caso, o policial conscientemente visou produzir o resultado para cessar a agressão. O dolo direto divide-se em primeiro grau (resultado visado) e segundo grau (resultado colateral certo como meio necessário).",
    explanationCorrect: "Correto! Dolo direto = representação + vontade de produzir o resultado. O policial QUIS o resultado para cessar a agressão — clássico exemplo de dolo direto de 1º grau.",
    explanationWrong: "Dolo direto ocorre quando o agente QUER o resultado (não apenas aceita). Culpa consciente e dolo eventual envolvem a previsão do resultado — mas a diferença é a aceitação: dolo eventual ACEITA; culpa consciente REJEITA.",
    difficulty: "FACIL",
    contentTitle: "Dolo e Culpa: Direto, Eventual e Culpa Consciente",
  },
  // ── Q5 — Garantidor: Dever Jurídico de Agir (Estadual / MEDIO) ───────────
  {
    id: "qz_dpen_ft_005",
    statement: "Nos crimes omissivos impróprios, o art. 13, §2º, do Código Penal prevê que o dever de agir para evitar o resultado incumbe a quem:",
    alternatives: [
      { letter: "A", text: "Qualquer cidadão que testemunhe um perigo, ainda que sem vínculo especial com a vítima." },
      { letter: "B", text: "Apenas agentes públicos com poder de polícia (policiais, bombeiros e agentes penitenciários)." },
      { letter: "C", text: "Tiver obrigação legal de proteção; tiver assumido responsabilidade de cuidado; ou tiver criado o risco com conduta anterior." },
      { letter: "D", text: "Somente quem tiver vínculo profissional ou empregatício com a vítima à época do evento." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O art. 13, §2º, CP define as três hipóteses do garantidor: (a) lei impõe dever de proteção (ex.: policial, bombeiro, pais em relação a filhos menores); (b) assumiu voluntariamente a responsabilidade de cuidado (ex.: babá, salva-vidas, médico de plantão); (c) criou o risco com comportamento anterior (ex.: quem causou o acidente deve socorrer). Fora dessas hipóteses, a omissão é própria (art. 135 CP).",
    explanationCorrect: "Perfeito! As três fontes do dever de garantidor são: lei (a), assunção voluntária (b) e criação do risco (c). Essas são as hipóteses taxativas do art. 13, §2º CP.",
    explanationWrong: "O dever de garantidor é RESTRITO às três hipóteses do art. 13, §2º CP. Cidadão comum sem vínculo especial que assiste a um crime e não age comete apenas omissão de socorro (art. 135 CP) — não responde pelo resultado.",
    difficulty: "MEDIO",
    contentTitle: "Conduta: Ação, Omissão e Crimes Omissivos (Próprio e Impróprio)",
  },
  // ── Q6 — Dolo Eventual vs. Culpa Consciente (Estadual / MEDIO) ───────────
  {
    id: "qz_dpen_ft_006",
    statement: "Um motorista dirige a 190 km/h em rodovia urbana, prevê que pode matar pedestres, mas pensa: 'pode acontecer, mas vou em frente'. Atropela e mata uma criança. Qual o elemento subjetivo em relação à morte?",
    alternatives: [
      { letter: "A", text: "Culpa inconsciente — o resultado não era previsível para o motorista." },
      { letter: "B", text: "Culpa consciente — previu o resultado mas confiou que não ocorreria." },
      { letter: "C", text: "Dolo direto — queria matar a criança especificamente." },
      { letter: "D", text: "Dolo eventual — previu o resultado como possível e assumiu o risco ('pode acontecer, vou em frente')." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "Dolo eventual: previsão do resultado + assunção do risco. O raciocínio do motorista ('pode acontecer, mas vou em frente') é a descrição textual do dolo eventual — ele não se importou com o resultado. Se pensasse 'pode acontecer, mas certamente desviarei', seria culpa consciente. A diferença é a ACEITAÇÃO interior do resultado.",
    explanationCorrect: "Exato! 'Pode acontecer e vou em frente' = dolo eventual. A frase revela que o motorista assumiu o risco, não se importando com o resultado. Art. 18, I, in fine CP.",
    explanationWrong: "Culpa consciente seria: 'prevejo que pode acontecer, MAS confio que não vai ocorrer.' No caso, o motorista não confiou — aceitou a possibilidade ('pode acontecer'). Essa aceitação é o que caracteriza o dolo eventual.",
    difficulty: "MEDIO",
    contentTitle: "Dolo e Culpa: Direto, Eventual e Culpa Consciente",
  },
  // ── Q7 — Concausa Preexistente (Estadual / MEDIO) ────────────────────────
  {
    id: "qz_dpen_ft_007",
    statement: "Um policial efetua disparo em pessoa hemofílica. Os ferimentos seriam leves em uma pessoa normal, mas a vítima morre por hemorragia incontrolável em razão da doença. Sobre a responsabilidade penal do policial, é CORRETO afirmar:",
    alternatives: [
      { letter: "A", text: "O policial responde apenas por lesão corporal, pois a hemofilia (causa absolutamente independente) rompeu o nexo causal." },
      { letter: "B", text: "O policial responde por homicídio consumado — a hemofilia é concausa relativamente independente PREEXISTENTE e não rompe o nexo causal." },
      { letter: "C", text: "Aplica-se o art. 13, §1º, CP: o policial responde somente pela tentativa de homicídio." },
      { letter: "D", text: "O resultado é imputável exclusivamente à doença, afastando a responsabilidade penal do policial." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A hemofilia é concausa relativamente independente PREEXISTENTE: existia antes da conduta do policial. Nessa hipótese, o art. 13, §1º CP NÃO se aplica (ele trata apenas da superveniente). A concausa preexistente não rompe o nexo causal — o disparo + a doença juntos produziram o resultado. O princípio é: 'o agente responde pelo resultado como ele se apresenta na vítima concreta'.",
    explanationCorrect: "Perfeito! Concausa PREEXISTENTE (hemofilia): não rompe o nexo → responde pelo resultado. Art. 13, §1º CP só se aplica à superveniente que por si só produziu o resultado.",
    explanationWrong: "Atenção às três categorias: (1) absolutamente independente → rompe nexo; (2) relativamente independente PREEXISTENTE → NÃO rompe nexo → responde pelo resultado; (3) relativamente independente SUPERVENIENTE que por si só produz → rompe nexo → só tentativa.",
    difficulty: "MEDIO",
    contentTitle: "Concausas: Absolutamente e Relativamente Independentes",
  },
  // ── Q8 — Tipicidade Material / Insignificância (Estadual / MEDIO) ─────────
  {
    id: "qz_dpen_ft_008",
    statement: "O princípio da insignificância (bagatela), reconhecido pelo STF, opera sobre qual elemento do fato típico e qual é o seu efeito?",
    alternatives: [
      { letter: "A", text: "Sobre a culpabilidade — reduz a reprovabilidade sem excluir o crime." },
      { letter: "B", text: "Sobre o nexo causal — interrompe o nexo quando o dano é mínimo." },
      { letter: "C", text: "Sobre a tipicidade material — afasta a lesividade suficiente e exclui o crime por atipicidade." },
      { letter: "D", text: "Sobre a conduta — exclui o dolo quando o bem jurídico protegido é de ínfimo valor." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A tipicidade tem duas dimensões: formal (adequação ao texto do tipo) e material (lesividade real ao bem jurídico). O STF exige quatro vetores para aplicar o princípio da insignificância: mínima ofensividade, nenhuma periculosidade social, reduzido grau de reprovabilidade e inexpressividade da lesão. O efeito é a EXCLUSÃO da tipicidade material → fato atípico.",
    explanationCorrect: "Correto! Insignificância atua sobre a tipicidade MATERIAL (não sobre culpabilidade, conduta ou nexo). Exclui a lesividade suficiente → fato atípico. STF: 4 vetores (HC 84.412/SP).",
    explanationWrong: "A insignificância não atua sobre culpabilidade nem sobre nexo causal. Ela afasta a TIPICIDADE MATERIAL — a dimensão que exige que a conduta cause lesão efetiva e relevante ao bem jurídico. Sem lesividade suficiente, o fato é atípico.",
    difficulty: "MEDIO",
    contentTitle: "Tipicidade Formal, Material, Iter Criminis e Tentativa",
  },
  // ── Q9 — CERTO/ERRADO CEBRASPE: Concausa Superveniente (Federal / MEDIO) ──
  {
    id: "qz_dpen_ft_009",
    statement: "Julgue o item conforme o Código Penal brasileiro.\n\nSe, após ser ferido por disparo de arma de fogo, a vítima contrair infecção hospitalar e vier a falecer em decorrência exclusiva dessa infecção, o atirador responderá por homicídio consumado, pois a infecção constitui mera concausa relativamente independente que não rompe o nexo causal.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "ERRADO. A infecção hospitalar que por si só causou a morte é concausa RELATIVAMENTE INDEPENDENTE SUPERVENIENTE que por si só produziu o resultado. O art. 13, §1º, CP é expresso: 'A superveniência de causa relativamente independente exclui a imputação quando, por si só, produziu o resultado.' → nexo rompido → atirador responde apenas por tentativa de homicídio (ou lesão corporal, conforme o dolo inicial).",
    explanationCorrect: "Gabarito: ERRADO. Excelente! Art. 13, §1º CP é a norma-chave: superveniente relativamente independente que POR SI SÓ produz o resultado rompe o nexo → só tentativa. Questão típica CEBRASPE/PF.",
    explanationWrong: "Atenção: infecção hospitalar que POR SI SÓ causou a morte é causa nova e autônoma. O art. 13, §1º CP a trata como rompimento do nexo → o atirador responde só pela tentativa. Se a infecção apenas ACELEROU a morte (não a causou por si só), aí sim haveria consumação.",
    difficulty: "MEDIO",
    contentTitle: "Concausas: Absolutamente e Relativamente Independentes",
  },
  // ── Q10 — Iter Criminis e Tentativa (Federal / DIFICIL) ──────────────────
  {
    id: "qz_dpen_ft_010",
    statement: "Acerca do iter criminis e da punibilidade de suas fases, é CORRETO afirmar:",
    alternatives: [
      { letter: "A", text: "A cogitação (apenas pensar no crime) é punível quando o agente demonstra inequívoca intenção por ato preparatório grave." },
      { letter: "B", text: "A preparação é punível como tentativa sempre que o agente reunir os meios necessários para o crime." },
      { letter: "C", text: "Como regra, apenas a execução (tentativa) e a consumação são puníveis; a preparação só é punida quando a lei cria tipo autônomo para o ato preparatório." },
      { letter: "D", text: "A tentativa se configura ainda na fase de preparação, bastando que o agente manifeste a intenção criminosa a terceiros." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Iter criminis: Cogitação → Preparação → Execução → Consumação. Regra geral: cogitação e preparação são IMPUNÍVEIS (Direito Penal não pune o pensamento nem meros atos preparatórios). A tentativa inicia-se com o PRIMEIRO ATO DE EXECUÇÃO. Excepcionalmente, o legislador antecipa a tutela penal e tipifica atos preparatórios como crimes autônomos (ex.: associação criminosa, art. 288 CP).",
    explanationCorrect: "Exato! Só há punição a partir da EXECUÇÃO (tentativa). Cogitação e preparação são impuníveis como regra — um dos alicerces do Estado Democrático de Direito na seara penal.",
    explanationWrong: "COGITAÇÃO = impunível sempre (Direito Penal não pune o pensamento). PREPARAÇÃO = impunível como regra (só é punível quando o legislador cria tipo autônomo). EXECUÇÃO em diante = punível (tentativa ou consumação).",
    difficulty: "DIFICIL",
    contentTitle: "Tipicidade Formal, Material, Iter Criminis e Tentativa",
  },
  // ── Q11 — Omissão Imprópria: Policial de Folga (Federal / DIFICIL) ────────
  {
    id: "qz_dpen_ft_011",
    statement: "Um policial civil, fora do horário de serviço e sem uniforme, presencia seu vizinho espancando a esposa até a morte. Podendo agir sem risco pessoal, omite-se. Sobre a responsabilidade penal do policial, é CORRETO afirmar:",
    alternatives: [
      { letter: "A", text: "Responde somente por omissão de socorro (art. 135 CP), pois estava de folga — o cargo não gera dever além do horário de trabalho." },
      { letter: "B", text: "Fato atípico — a omissão de policial fora de serviço não possui previsão típica específica." },
      { letter: "C", text: "Responde por homicídio doloso na forma omissiva imprópria, pois o policial civil tem dever legal permanente de proteção (art. 13, §2º, a, CP), independentemente de estar de folga." },
      { letter: "D", text: "Responde por prevaricação (art. 319 CP), que é o tipo específico para a omissão de servidor público." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O policial civil tem dever legal de proteção derivado da legislação que rege a carreira — enquadra-se no art. 13, §2º, a, CP (garantidor ex lege). Esse dever é PERMANENTE: não se suspende nos períodos de folga, férias ou em serviço informal. A omissão do garantidor que, podendo agir, deixa ocorrer o resultado equivale à ação causadora → crime omissivo impróprio.",
    explanationCorrect: "Correto! Garantidor ex lege (policial) tem dever permanente. Sua omissão, podendo agir sem risco, configura crime omissivo IMPRÓPRIO — homicídio doloso na modalidade omissiva. A folga não suspende o dever.",
    explanationWrong: "Art. 135 CP (omissão de socorro) aplica-se a quem não tem vínculo especial. O policial É garantidor por lei — seu silêncio omisso equivale à ação criminosa. A folga não elimina o dever legal permanente.",
    difficulty: "DIFICIL",
    contentTitle: "Conduta: Ação, Omissão e Crimes Omissivos (Próprio e Impróprio)",
  },
  // ── Q12 — Dolo Eventual em Uso de Força Policial (Federal / DIFICIL) ──────
  {
    id: "qz_dpen_ft_012",
    statement: "Um policial efetua disparo contra suspeito fugindo em viela densamente habitada. O projétil atravessa o suspeito e atinge e mata uma criança. O policial declarou que 'sabia que era arriscado, mas precisava agir'. Com qual elemento subjetivo o policial responde pelo óbito da criança?",
    alternatives: [
      { letter: "A", text: "Culpa inconsciente — resultado imprevisível para um atirador experiente em situação de stress." },
      { letter: "B", text: "Culpa consciente — previu o risco, mas confiou em sua pontaria para evitar atingir terceiros." },
      { letter: "C", text: "Dolo eventual — previu a possibilidade de atingir terceiros e, ao prosseguir, assumiu esse risco." },
      { letter: "D", text: "Dolo direto de segundo grau — o resultado era absolutamente certo como meio necessário da ação." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A declaração 'sabia que era arriscado, mas precisava agir' revela que o policial previu o resultado como possível e prosseguiu — assumindo o risco. Isso é o padrão do dolo eventual (art. 18, I, in fine CP). Culpa consciente exigiria que o policial tivesse confiado sinceramente em não atingir a criança (ex.: 'minha mira é precisa'). Dolo direto de 2º grau exigiria que o resultado fosse certo como meio necessário — o que não é o caso.",
    explanationCorrect: "Correto! 'Sabia que era arriscado e prosseguiu' = assumiu o risco = dolo eventual. Esse é o critério do art. 18, I, in fine CP. STF e TJSP aplicam esse raciocínio em casos de disparo policial em área urbanizada.",
    explanationWrong: "A culpa consciente exigiria confiança sincera de que o resultado não ocorreria (ex.: 'sei que minha mira é precisa'). A declaração do policial mostra que ele sabia do risco e agiu mesmo assim, sem essa confiança — dolo eventual. Dolo direto de 2º grau exigiria resultado CERTO (não apenas possível).",
    difficulty: "DIFICIL",
    contentTitle: "Dolo e Culpa: Direto, Eventual e Culpa Consciente",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n⚖️  Seed: Direito Penal — Fato Típico (Conduta, Resultado, Nexo, Tipicidade)\n");

  // ── 1. Encontrar Subject ────────────────────────────────────────────────
  const subjectId = await findSubject("DIREITO_PENAL");
  if (!subjectId) {
    console.error("❌ Subject 'DIREITO_PENAL' não encontrado no banco.");
    process.exit(1);
  }
  console.log(`✅ Subject encontrado: ${subjectId}`);

  // ── 2. Garantir colunas Phase 5 em Question ────────────────────────────
  for (const [col, def] of [
    ["correctOption", "INTEGER"],
    ["explanationCorrect", "TEXT"],
    ["explanationWrong", "TEXT"],
  ] as const) {
    try {
      await db.execute(sql.raw(`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "${col}" ${def}`));
    } catch (e: any) {
      console.warn(`⚠️  Question.${col}: ${e?.message?.split("\n")[0]}`);
    }
  }

  // ── 3. Garantir colunas Phase 5 em Content ─────────────────────────────
  for (const [col, def] of [
    ["mnemonic", "TEXT"],
    ["keyPoint", "TEXT"],
    ["practicalExample", "TEXT"],
  ] as const) {
    try {
      await db.execute(sql.raw(`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS "${col}" ${def}`));
    } catch (e: any) {
      console.warn(`⚠️  Content.${col}: ${e?.message?.split("\n")[0]}`);
    }
  }
  console.log("✅ Colunas Phase 5 garantidas.");

  // ── 4. Encontrar ou criar Topic ────────────────────────────────────────
  const topicId = await findOrCreateTopic("Teoria do Crime — Fato Típico", subjectId);
  console.log(`✅ Topic: ${topicId}`);

  // ── 5. Inserir Conteúdos ────────────────────────────────────────────────
  const contentIdMap: Record<string, string> = {};
  let contentCreated = 0, contentSkipped = 0;

  for (const c of contents) {
    if (await contentExists(c.title, subjectId)) {
      const existingId = await getContentId(c.title, subjectId);
      if (existingId) contentIdMap[c.title] = existingId;
      console.log(`  ⏭  Conteúdo já existe: ${c.title}`);
      contentSkipped++;
      continue;
    }

    const id = nanoId("ct");
    const wordCount = c.textContent.split(/\s+/).length;
    await db.execute(sql`
      INSERT INTO "Content" (
        "id", "title", "textContent", "subjectId", "topicId",
        "isActive", "difficulty",
        "wordCount", "estimatedReadTime",
        "mnemonic", "keyPoint", "practicalExample",
        "createdAt", "updatedAt"
      ) VALUES (
        ${id}, ${c.title}, ${c.textContent}, ${subjectId}, ${topicId},
        true, ${c.difficulty},
        ${wordCount}, ${Math.ceil(wordCount / 200)},
        ${c.mnemonic}, ${c.keyPoint}, ${c.practicalExample},
        NOW(), NOW()
      )
    `);
    contentIdMap[c.title] = id;
    console.log(`  ✅ Conteúdo criado: ${c.title} (${id})`);
    contentCreated++;
  }

  // ── 6. Inserir Questões ─────────────────────────────────────────────────
  let questionCreated = 0, questionSkipped = 0;

  for (const q of questions) {
    if (await questionExists(q.id)) {
      console.log(`  ⏭  Questão já existe: ${q.id}`);
      questionSkipped++;
      continue;
    }

    const contentId = contentIdMap[q.contentTitle];
    if (!contentId) {
      console.warn(`  ⚠️  Conteúdo não encontrado para questão ${q.id}: '${q.contentTitle}'`);
      continue;
    }

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
        ${subjectId}, ${topicId}, ${contentId},
        true, ${q.difficulty},
        0, 'MULTIPLA_ESCOLHA',
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Questão criada: ${q.id}`);
    questionCreated++;
  }

  // ── Backfill contentId em questões já existentes (sem contentId) ─────────
  let backfillCount = 0;
  for (const q of questions) {
    const contentId = contentIdMap[q.contentTitle];
    if (!contentId) continue;
    const result = await db.execute(sql`
      UPDATE "Question" SET "contentId" = ${contentId}
      WHERE id = ${q.id} AND "contentId" IS NULL
    `) as any;
    if ((result.rowCount ?? result.count ?? 0) > 0) backfillCount++;
  }
  if (backfillCount > 0) console.log(`  🔧 Backfill contentId: ${backfillCount} questões atualizadas`);

  // ── Relatório ────────────────────────────────────────────────────────────
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
