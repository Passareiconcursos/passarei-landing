/**
 * Seed: Direito Administrativo — Princípios da Administração Pública
 *
 * Popula 6 átomos de Conteúdo + 12 Questões (explícitos + implícitos).
 * Idempotente: verifica existência antes de inserir.
 *
 * Execução:
 *   npx tsx db/seed-direito-administrativo-principios.ts
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
  // ── 1. LIMPE ─────────────────────────────────────────────────────────────
  {
    title: "Princípios Explícitos da Adm. Pública: LIMPE (Art. 37 CF/88)",
    textContent: `O art. 37 da CF/88 prevê 5 princípios EXPRESSOS: Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência. São os ÚNICOS constitucionalmente explícitos. Os demais — autotutela, continuidade, razoabilidade, proporcionalidade — são IMPLÍCITOS, derivados da doutrina e de leis infraconstitucionais (ex.: Lei 9.784/99).`,
    mnemonic: "LIMPE: Legalidade · Impessoalidade · Moralidade · Publicidade · Eficiência — os 5 princípios EXPRESSOS do art. 37 CF/88.",
    keyPoint: "Apenas esses 5 são explícitos no art. 37. Razoabilidade, autotutela e continuidade são implícitos — erro clássico em prova confundir as duas categorias.",
    practicalExample: "Questão PF/CEBRASPE: 'Indique o princípio NÃO expresso no art. 37 CF/88' → Razoabilidade é a resposta. Todos os do LIMPE estão errados como resposta.",
    difficulty: "FACIL",
  },
  // ── 2. Legalidade Administrativa ─────────────────────────────────────────
  {
    title: "Legalidade Administrativa: Só o Que a Lei Autoriza",
    textContent: `Para o particular: pode tudo que a lei não proíbe. Para o administrador público: só pode fazer o que a lei expressamente autoriza. Ausência de lei autorizadora equivale à proibição. Agentes públicos sujeitam-se ao regime de direito público; atos sem fundamento legal são ilegais mesmo sem norma proibitória expressa.`,
    mnemonic: "PARTICULAR: proibição implícita. ADMINISTRADOR: autorização necessária. Sem lei que permita = não pode.",
    keyPoint: "O princípio da legalidade para o administrador é mais restritivo do que para o particular. A CF/88, art. 37, caput, é a base; a Lei 9.784/99, art. 2º, regulamenta.",
    practicalExample: "Guarda municipal que aplica multa de trânsito sem lei municipal autorizando: ilegal — mesmo sem norma proibindo expressamente, falta lei permissiva.",
    difficulty: "FACIL",
  },
  // ── 3. Impessoalidade e Vedação ao Nepotismo (SV 13) ────────────────────
  {
    title: "Impessoalidade: Promoção Pessoal e Nepotismo (SV 13)",
    textContent: `Impessoalidade tem duas dimensões: (1) atos são da Administração, não do agente pessoalmente; (2) veda uso de recursos públicos para promoção pessoal. A Súmula Vinculante 13 do STF proíbe o nepotismo em toda a Administração direta e indireta, mesmo sem lei específica — deriva diretamente dos princípios da impessoalidade e da moralidade.`,
    mnemonic: "IMPESSOAL = ato é da Adm., não do servidor. SV 13 = nepotismo proibido em TODA a Adm., sem precisar de lei.",
    keyPoint: "SV 13 proíbe nomeação de parentes até 3º grau para cargos comissionados, exceto cargos políticos de natureza exclusivamente política (ex: Ministros — exceção polêmica).",
    practicalExample: "Delegado que nomeia irmão para cargo comissionado na delegacia viola SV 13. Prefeito que estampa seu rosto em obras públicas viola impessoalidade (dimensão 2).",
    difficulty: "MEDIO",
  },
  // ── 4. Moralidade ≠ Legalidade ──────────────────────────────────────────
  {
    title: "Moralidade Administrativa: Ética como Vício Autônomo",
    textContent: `Moralidade não se confunde com legalidade. Um ato pode ser formalmente legal mas violar a ética e a boa-fé. A imoralidade é vício autônomo de invalidade — independe de ilegalidade formal. A probidade é a face concreta da moralidade; sua violação configura improbidade administrativa (Lei 8.429/92), sujeita a: perda do cargo, multa, ressarcimento e inelegibilidade.`,
    mnemonic: "MORAL ≠ LEGAL. Ato legal pode ser imoral. Imoralidade = vício autônomo → invalidade + improbidade (Lei 8.429/92).",
    keyPoint: "Para invalidar ato por imoralidade, não é preciso provar ilegalidade formal. O controle de moralidade cabe ao Poder Judiciário e ao Ministério Público.",
    practicalExample: "Licitação dentro dos trâmites legais mas com superfaturamento negociado pelo gestor = legal na forma, mas imoral no conteúdo → improbidade administrativa.",
    difficulty: "MEDIO",
  },
  // ── 5. Publicidade: Regra e Exceções (SIS) ──────────────────────────────
  {
    title: "Publicidade: Regra Geral e Exceções Legítimas (SIS)",
    textContent: `Publicidade é a regra na Administração Pública. Exceções legítimas: (1) Segurança nacional; (2) Intimidade/honra da pessoa; (3) Sigilo legal previsto em lei (ex.: inquérito policial, sigilo fiscal). A falta de publicação não torna o ato nulo, mas impede sua eficácia e suspende o prazo prescricional. Publicidade ≠ publicação obrigatória em todos os casos.`,
    mnemonic: "SIS: Segurança nacional · Intimidade/honra · Sigilo legal — as 3 exceções legítimas à publicidade.",
    keyPoint: "Ausência de publicidade ≠ nulidade automática. O ato existe, mas é ineficaz. O prazo decadencial para impugná-lo não começa a correr.",
    practicalExample: "Inquérito policial tem sigilo (art. 20 CPP) — exceção SIS legítima. Já negar acesso à folha de pagamento de servidor público viola publicidade — não há exceção aqui.",
    difficulty: "MEDIO",
  },
  // ── 6. Princípios Implícitos: Autotutela, Continuidade e Razoabilidade ──
  {
    title: "Princípios Implícitos: Autotutela, Continuidade e Razoabilidade",
    textContent: `Autotutela (Súmulas 346/473 STF): a Adm. anula atos ILEGAIS (ex tunc) ou revoga por conveniência/oportunidade (ex nunc). Prazo: 5 anos para anular atos de boa-fé (art. 54, Lei 9.784/99). Continuidade: serviços essenciais não podem parar — limita greve. Razoabilidade/Proporcionalidade: medidas devem ser adequadas, necessárias e proporcionais ao fim público perseguido.`,
    mnemonic: "ARC — Autotutela (anular=ex tunc / revogar=ex nunc), Razoabilidade (proporcional), Continuidade (não pode parar).",
    keyPoint: "Anulação: ex tunc (retroage, desfaz efeitos). Revogação: ex nunc (não retroage, respeita direitos adquiridos). Prazo decadencial de 5 anos é só para anulação de atos de boa-fé.",
    practicalExample: "Delegado revoga portaria inconveniente (ex nunc — efeitos futuros) vs. anula portaria ilegal (ex tunc — efeitos retroativos). Servidor em greve em serviço essencial deve manter mínimo funcionando.",
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
  // ── Q1 — LIMPE: Princípio NÃO explícito (Municipal / FACIL) ──────────────
  {
    id: "qz_dadm_prin_001",
    statement: "Assinale a alternativa que apresenta um princípio NÃO expresso no art. 37, caput, da Constituição Federal de 1988:",
    alternatives: [
      { letter: "A", text: "Legalidade" },
      { letter: "B", text: "Publicidade" },
      { letter: "C", text: "Razoabilidade" },
      { letter: "D", text: "Eficiência" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O art. 37, caput, CF/88, prevê expressamente LIMPE: Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência. A razoabilidade não está listada no texto constitucional — é princípio implícito, extraído da doutrina e da Lei 9.784/99.",
    explanationCorrect: "Correto! Razoabilidade é princípio implícito — não aparece no art. 37, caput. O LIMPE são os únicos 5 explícitos.",
    explanationWrong: "Lembre do LIMPE: todos os seus 5 componentes (Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência) são EXPRESSOS no art. 37. Razoabilidade é implícito.",
    difficulty: "FACIL",
    contentTitle: "Princípios Explícitos da Adm. Pública: LIMPE (Art. 37 CF/88)",
  },
  // ── Q2 — Legalidade: Administrador vs. Particular (Municipal / FACIL) ────
  {
    id: "qz_dadm_prin_002",
    statement: "Em relação ao princípio da legalidade, é CORRETO afirmar que o agente público:",
    alternatives: [
      { letter: "A", text: "Pode praticar qualquer ato que não seja expressamente proibido por lei." },
      { letter: "B", text: "Só pode agir quando existe lei que expressamente autorize sua conduta." },
      { letter: "C", text: "Tem liberdade de agir sempre que o interesse público justificar, independentemente de lei." },
      { letter: "D", text: "Está sujeito às mesmas regras de legalidade que os particulares." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O princípio da legalidade para o administrador público é MAIS restritivo do que para o particular. Enquanto o particular pode fazer tudo que a lei não proíbe, o agente público só pode agir nos limites do que a lei expressamente autoriza. Ausência de norma autorizadora = impossibilidade de agir.",
    explanationCorrect: "Exato! 'Sem lei que autorize = não pode agir' — essa é a regra básica do art. 37, CF/88 para o administrador público.",
    explanationWrong: "Cuidado: a legalidade para o agente público é mais rigorosa do que para o particular. Não basta a ausência de proibição — é preciso que haja lei autorizando a conduta.",
    difficulty: "FACIL",
    contentTitle: "Legalidade Administrativa: Só o Que a Lei Autoriza",
  },
  // ── Q3 — Impessoalidade: Promoção Pessoal (Municipal / FACIL) ────────────
  {
    id: "qz_dadm_prin_003",
    statement: "Um prefeito determina que todas as obras públicas sejam sinalizadas com seu nome e foto. Qual princípio constitucional da Administração Pública é violado de forma direta?",
    alternatives: [
      { letter: "A", text: "Eficiência" },
      { letter: "B", text: "Impessoalidade" },
      { letter: "C", text: "Legalidade" },
      { letter: "D", text: "Publicidade" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A impessoalidade veda a promoção pessoal de agentes públicos às custas de recursos e atos da Administração. Os atos são da Administração, não do agente. A Constituição (art. 37, § 1º) proíbe expressamente publicidade de obras com nomes, símbolos ou imagens que caracterizem promoção pessoal.",
    explanationCorrect: "Correto! Art. 37, §1º CF/88 é a consagração legislativa da impessoalidade: vedação de promoção pessoal em publicidade de obras e serviços públicos.",
    explanationWrong: "A violação é da impessoalidade — o agente está usando os atos da Administração para promoção pessoal. O art. 37, §1º CF/88 é explícito nessa vedação.",
    difficulty: "FACIL",
    contentTitle: "Impessoalidade: Promoção Pessoal e Nepotismo (SV 13)",
  },
  // ── Q4 — Eficiência: Emenda e Caracterização (Municipal / FACIL) ─────────
  {
    id: "qz_dadm_prin_004",
    statement: "Sobre o princípio da eficiência na Administração Pública, é CORRETO afirmar:",
    alternatives: [
      { letter: "A", text: "A eficiência autoriza o administrador a ignorar formalidades legais quando isso agilizar o serviço público." },
      { letter: "B", text: "O princípio da eficiência foi inserido no art. 37 da CF/88 pela Emenda Constitucional nº 19/1998." },
      { letter: "C", text: "Eficiência e moralidade são expressões sinônimas no direito administrativo." },
      { letter: "D", text: "O princípio da eficiência se aplica apenas à Administração Pública federal, não à estadual ou municipal." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O princípio da eficiência foi introduzido no art. 37, caput, da CF/88 pela EC 19/1998 (Reforma Administrativa). Antes disso, os princípios expressos eram apenas LIMP (sem o E). A eficiência NÃO permite desrespeito à legalidade — a legalidade prevalece sobre a eficiência quando em conflito.",
    explanationCorrect: "Correto! A EC 19/98 (Reforma Administrativa) acrescentou a Eficiência ao LIMP, formando o LIMPE atual.",
    explanationWrong: "A EC 19/1998 é um dado factual muito cobrado em concursos. A eficiência foi o último a ser incluído no art. 37 e NÃO autoriza burlar a legalidade.",
    difficulty: "FACIL",
    contentTitle: "Princípios Explícitos da Adm. Pública: LIMPE (Art. 37 CF/88)",
  },
  // ── Q5 — Moralidade vs. Legalidade (Estadual / MEDIO) ───────────────────
  {
    id: "qz_dadm_prin_005",
    statement: "Sobre a relação entre os princípios da legalidade e da moralidade, marque a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "Um ato administrativo legal não pode ser, simultaneamente, imoral — são conceitos mutuamente excludentes." },
      { letter: "B", text: "A imoralidade do ato administrativo é vício autônomo que o invalida independentemente de ilegalidade formal." },
      { letter: "C", text: "A moralidade é um subprincípio da legalidade, existindo apenas quando há norma legal violada." },
      { letter: "D", text: "O Poder Judiciário não pode controlar a moralidade dos atos administrativos por se tratar de mérito." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A moralidade é princípio autônomo. Um ato pode ser formalmente legal (cumprir todos os requisitos normativos) mas ainda assim violar a boa-fé, a ética e a probidade. A imoralidade, por si só, é causa de invalidade do ato administrativo, independentemente de qualquer ilegalidade. O Judiciário pode controlar a moralidade.",
    explanationCorrect: "Perfeito! A imoralidade é vício autônomo — não depende de ilegalidade formal. O STF confirma o controle judicial da moralidade administrativa.",
    explanationWrong: "Moralidade ≠ legalidade. São princípios distintos e autônomos. Um ato pode ser legal e imoral ao mesmo tempo — e a imoralidade, sozinha, invalida o ato.",
    difficulty: "MEDIO",
    contentTitle: "Moralidade Administrativa: Ética como Vício Autônomo",
  },
  // ── Q6 — Publicidade: Exceção Legítima (Estadual / MEDIO) ────────────────
  {
    id: "qz_dadm_prin_006",
    statement: "O princípio da publicidade admite exceções. Assinale a hipótese que configura restrição LEGÍTIMA à publicidade dos atos administrativos:",
    alternatives: [
      { letter: "A", text: "Alto custo de publicação no Diário Oficial." },
      { letter: "B", text: "Conveniência do administrador público." },
      { letter: "C", text: "Necessidade de preservar a segurança da sociedade e do Estado." },
      { letter: "D", text: "Complexidade técnica do ato administrativo." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "As exceções à publicidade são taxativas e previstas constitucionalmente (art. 5º, XXXIII, XXXIV e LX, CF/88): segurança nacional e do Estado, intimidade/vida privada, e procedimentos sigilosos previstos em lei. Alto custo, conveniência e complexidade técnica NÃO são exceções válidas.",
    explanationCorrect: "Correto! Segurança da sociedade e do Estado é uma das exceções expressamente reconhecidas pela CF/88 ao princípio da publicidade.",
    explanationWrong: "As exceções à publicidade são constitucionalmente previstas e taxativas: segurança nacional, intimidade e sigilo legal (SIS). Custo, conveniência e complexidade técnica não são exceções válidas.",
    difficulty: "MEDIO",
    contentTitle: "Publicidade: Regra Geral e Exceções Legítimas (SIS)",
  },
  // ── Q7 — SV 13 / Nepotismo (Estadual / MEDIO) ────────────────────────────
  {
    id: "qz_dadm_prin_007",
    statement: "A respeito da Súmula Vinculante nº 13 do STF, que trata da vedação ao nepotismo, é CORRETO afirmar:",
    alternatives: [
      { letter: "A", text: "Aplica-se apenas à Administração Pública federal direta." },
      { letter: "B", text: "Exige lei específica proibindo o nepotismo para que a vedação seja eficaz." },
      { letter: "C", text: "Aplica-se a toda a Administração Pública direta e indireta, independentemente de lei específica." },
      { letter: "D", text: "Limita-se a proibir a nomeação de filhos; cônjuge e irmãos não estão abrangidos." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A SV 13 do STF estabelece que a vedação ao nepotismo deriva diretamente dos princípios constitucionais da impessoalidade e da moralidade (art. 37, caput, CF/88), dispensando lei ordinária específica. Alcança toda a Administração direta e indireta, nos três poderes e nos três níveis federativos, para parentes até 3º grau.",
    explanationCorrect: "Correto! A SV 13 tem efeito vinculante em toda a Administração, dispensando lei específica — deriva direto dos princípios constitucionais.",
    explanationWrong: "A SV 13 dispensa lei específica (deriva de princípios constitucionais), não se limita à esfera federal, e abrange cônjuge, pais, filhos, irmãos (até 3º grau por afinidade ou consanguinidade).",
    difficulty: "MEDIO",
    contentTitle: "Impessoalidade: Promoção Pessoal e Nepotismo (SV 13)",
  },
  // ── Q8 — Autotutela: Efeitos (Estadual / MEDIO) ──────────────────────────
  {
    id: "qz_dadm_prin_008",
    statement: "Quanto aos efeitos temporais da anulação e da revogação de atos administrativos, é CORRETO afirmar:",
    alternatives: [
      { letter: "A", text: "Ambas produzem efeitos ex nunc (prospectivos), preservando os efeitos já produzidos." },
      { letter: "B", text: "Ambas produzem efeitos ex tunc (retroativos), desfazendo todos os efeitos anteriores." },
      { letter: "C", text: "A anulação produz efeitos ex tunc; a revogação produz efeitos ex nunc." },
      { letter: "D", text: "A anulação produz efeitos ex nunc; a revogação produz efeitos ex tunc." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A anulação decorre de ilegalidade: retroage (ex tunc) e desfaz todos os efeitos do ato desde a origem. A revogação decorre de conveniência/oportunidade (mérito): produz efeitos a partir de então (ex nunc), respeitando os efeitos já produzidos e os direitos adquiridos. Súmulas 346 e 473 do STF consagram a autotutela.",
    explanationCorrect: "Perfeito! Anulação ex tunc (ilegalidade, retroage). Revogação ex nunc (conveniência, não retroage). Esse é o ponto mais cobrado sobre autotutela.",
    explanationWrong: "Memorize: ANULAÇÃO (ato ilegal) = ex TUNC (retroage, desfaz tudo). REVOGAÇÃO (ato inconveniente/inoportuno) = ex NUNC (prospectivo, respeita o passado).",
    difficulty: "MEDIO",
    contentTitle: "Princípios Implícitos: Autotutela, Continuidade e Razoabilidade",
  },
  // ── Q9 — CERTO/ERRADO CEBRASPE: Autotutela e Prazo Decadencial (Federal) ─
  {
    id: "qz_dadm_prin_009",
    statement: "Julgue o item a seguir, conforme a legislação e a jurisprudência aplicáveis.\n\nA Administração Pública pode anular seus próprios atos ilegais a qualquer tempo, sem prazo limite, pois a legalidade é princípio de ordem pública e o interesse público é indisponível.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "ERRADO. Embora a Administração possua o poder-dever de autotutela (Súmulas 346 e 473 do STF), o art. 54 da Lei 9.784/99 estabelece prazo decadencial de 5 anos para a anulação de atos administrativos que tenham gerado efeitos favoráveis a destinatários de boa-fé. Após esse prazo, o ato não pode mais ser anulado, em respeito à segurança jurídica.",
    explanationCorrect: "Gabarito: ERRADO. Ótimo! O prazo de 5 anos do art. 54 da Lei 9.784/99 é a limitação clássica ao poder de autotutela — muito cobrada em CEBRASPE.",
    explanationWrong: "Atenção: o poder de autotutela NÃO é ilimitado no tempo. O art. 54 da Lei 9.784/99 impõe prazo decadencial de 5 anos para anular atos que geraram efeitos favoráveis a beneficiários de boa-fé.",
    difficulty: "MEDIO",
    contentTitle: "Princípios Implícitos: Autotutela, Continuidade e Razoabilidade",
  },
  // ── Q10 — Continuidade vs. Greve (Federal / DIFICIL) ─────────────────────
  {
    id: "qz_dadm_prin_010",
    statement: "Sobre o princípio da continuidade do serviço público e o direito de greve dos servidores, assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "Os servidores públicos não possuem direito constitucional de greve, sendo o seu exercício inconstitucional em qualquer hipótese." },
      { letter: "B", text: "O direito de greve dos servidores existe (art. 37, VII, CF/88), mas é mitigado pelo princípio da continuidade — serviços essenciais devem manter funcionamento mínimo." },
      { letter: "C", text: "O princípio da continuidade exige que nenhum serviço público seja interrompido em qualquer circunstância, incluindo greve e caso fortuito." },
      { letter: "D", text: "Em serviços não essenciais, a greve pode paralisar completamente o serviço, sem qualquer restrição legal." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O art. 37, VII, CF/88 assegura o direito de greve aos servidores, nos termos de lei específica. O STF (MI 670, 708 e 712) determinou aplicação subsidiária da Lei 7.783/89 até lei específica. O princípio da continuidade exige manutenção de atividades mínimas, especialmente em serviços essenciais (saúde, segurança pública, etc.).",
    explanationCorrect: "Correto! O direito de greve é constitucional (art. 37, VII), mas a continuidade mitiga seu exercício — serviços essenciais devem manter mínimo obrigatório.",
    explanationWrong: "O direito de greve dos servidores está previsto na CF/88, mas é relativizado pelo princípio da continuidade. Serviços essenciais (segurança, saúde) devem manter funcionamento mínimo mesmo em greve.",
    difficulty: "DIFICIL",
    contentTitle: "Princípios Implícitos: Autotutela, Continuidade e Razoabilidade",
  },
  // ── Q11 — Razoabilidade/Proporcionalidade (Federal / DIFICIL) ───────────
  {
    id: "qz_dadm_prin_011",
    statement: "O princípio da razoabilidade no Direito Administrativo impõe que a Administração Pública:",
    alternatives: [
      { letter: "A", text: "Adote sempre a medida mais eficiente, ainda que desproporcional ao caso concreto." },
      { letter: "B", text: "Adote medidas adequadas, necessárias e proporcionais em sentido estrito ao fim público perseguido." },
      { letter: "C", text: "Aplique sanções administrativas sempre no grau máximo para garantir efeito dissuasório." },
      { letter: "D", text: "Priorize o interesse público coletivo, podendo desconsiderar direitos individuais dos administrados." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A razoabilidade (ou proporcionalidade) no Direito Administrativo exige que a medida adotada seja: (1) adequada — apta a atingir o fim; (2) necessária — o meio menos gravoso disponível; (3) proporcional em sentido estrito — os benefícios superam os custos. A Lei 9.784/99, art. 2º, consagra expressamente o princípio.",
    explanationCorrect: "Exato! Razoabilidade = adequação + necessidade + proporcionalidade em sentido estrito. Esse é o conceito correto consagrado na doutrina e na Lei 9.784/99.",
    explanationWrong: "A razoabilidade/proporcionalidade exige a adoção do meio adequado, necessário e proporcional. Sanção máxima automática e desconsideração de direitos individuais são exatamente o que o princípio proíbe.",
    difficulty: "DIFICIL",
    contentTitle: "Princípios Implícitos: Autotutela, Continuidade e Razoabilidade",
  },
  // ── Q12 — Colisão de Princípios: Eficiência vs. Legalidade (Federal / DIFICIL)
  {
    id: "qz_dadm_prin_012",
    statement: "Um agente público, buscando maior eficiência operacional, ignora exigências legais formais de um processo licitatório. Diante disso, é CORRETO afirmar que:",
    alternatives: [
      { letter: "A", text: "O ato é válido, pois a eficiência é princípio constitucional que pode relativizar exigências formais em prol do interesse público." },
      { letter: "B", text: "O ato é válido, desde que o resultado alcançado seja economicamente vantajoso para a Administração." },
      { letter: "C", text: "O ato é inválido, mas o agente não pode ser responsabilizado se demonstrar que agiu com boa intenção." },
      { letter: "D", text: "O ato é inválido por violação ao princípio da legalidade, que prevalece sobre a eficiência quando em conflito." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "No ordenamento jurídico administrativo brasileiro, a legalidade é o princípio fundante do Estado de Direito — o administrador só pode agir nos limites da lei. A eficiência não pode ser usada como fundamento para burlar formalidades legais. Ato praticado em desacordo com a lei é inválido, independentemente do resultado alcançado ou da intenção do agente.",
    explanationCorrect: "Correto! Eficiência não autoriza ilegalidade. A hierarquia principiológica no direito administrativo brasileiro coloca a legalidade como limitação inafastável à atuação administrativa.",
    explanationWrong: "Eficiência é princípio constitucional, mas NÃO prevalece sobre a legalidade. Ato ilegal é inválido mesmo que eficiente ou de boa intenção. Intenção não sana ilegalidade formal.",
    difficulty: "DIFICIL",
    contentTitle: "Legalidade Administrativa: Só o Que a Lei Autoriza",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n⚖️  Seed: Direito Administrativo — Princípios da Adm. Pública\n");

  // ── 1. Encontrar Subject ────────────────────────────────────────────────
  const subjectId = await findSubject("DIREITO_ADMINISTRATIVO");
  if (!subjectId) {
    console.error("❌ Subject 'DIREITO_ADMINISTRATIVO' não encontrado no banco.");
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
  const topicId = await findOrCreateTopic("Princípios da Administração Pública", subjectId);
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
        "subjectId", "topicId",
        "isActive", "difficulty",
        "timesUsed", "questionType",
        "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternativesJson}::jsonb, ${q.correctAnswer}, ${q.correctOption},
        ${q.explanation}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${subjectId}, ${topicId},
        true, ${q.difficulty},
        0, 'MULTIPLA_ESCOLHA',
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Questão criada: ${q.id}`);
    questionCreated++;
  }

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
