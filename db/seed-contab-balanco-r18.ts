/**
 * Seed: Contabilidade Geral — R18 — Balanço Patrimonial
 * (Equação Fundamental, Ativo Circulante, Passivo Exigível,
 *  Patrimônio Líquido, Estrutura do BP, Variações Patrimoniais)
 *
 * AUTO-REVISÃO DE CÁLCULOS — todos os valores numéricos verificados:
 *   Q2:  AT=500.000; PL=200.000 → P = 500.000-200.000 = 300.000
 *        Afirmativa diz P=700.000 → ERRADO ✓
 *   Q5:  AC=280.000; ANC=420.000 → AT = 280.000+420.000 = 700.000 → CERTO ✓
 *   Q12: Inicial: A=100.000, P=40.000, PL=60.000 (100=40+60 ✓)
 *        Compra a prazo 20.000: A=120.000, P=60.000, PL=60.000 (120=60+60 ✓)
 *        Afirmativa diz permutativa (PL inalterado) → CERTO ✓
 *
 * Popula 6 átomos de Conteúdo + 12 Questões.
 * Idempotente: verifica existência antes de inserir.
 * TODAS as questões: tipo CERTO_ERRADO + contentId vinculado ao átomo correto.
 * Subject: busca por "CONTABILIDADE_GERAL" (match exato — requer seed-subjects-fix.ts).
 *
 * Execução (ORDEM OBRIGATÓRIA):
 *   1. npx tsx db/seed-subjects-fix.ts
 *   2. npx tsx db/seed-contab-balanco-r18.ts
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
// CONTEÚDOS (6 átomos)
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
  // ── 1. Equação Fundamental ─────────────────────────────────────────────
  {
    title: "Equação Fundamental do Patrimônio: Ativo = Passivo + Patrimônio Líquido",
    textContent: `A EQUAÇÃO FUNDAMENTAL DO PATRIMÔNIO (EFP) é o alicerce de toda a Contabilidade:

ATIVO = PASSIVO EXIGÍVEL + PATRIMÔNIO LÍQUIDO
A = P + PL

Onde:
- ATIVO (A): bens e direitos de propriedade da entidade (o que a empresa TEM ou tem a receber).
- PASSIVO EXIGÍVEL (P): obrigações com terceiros (o que a empresa DEVE a terceiros).
- PATRIMÔNIO LÍQUIDO (PL): diferença entre ativo e passivo — recursos próprios dos sócios/acionistas.

DERIVAÇÕES:
PL = A - P  (patrimônio líquido = ativo menos passivo)
P = A - PL  (passivo = ativo menos patrimônio líquido)

SITUAÇÃO PATRIMONIAL:
- PL > 0: situação líquida ativa (empresa solvente).
- PL = 0: situação nula ou equiparada (ativo = passivo).
- PL < 0: passivo a descoberto (empresa insolvente — passivo > ativo).

EQUILÍBRIO: o Balanço Patrimonial SEMPRE se equilibra — a equação A = P + PL é sempre verdadeira, pois todo bem da empresa tem uma origem (capital de terceiros = P ou capital próprio = PL).`,
    mnemonic: "A = P + PL. Ativo = o que TEM. Passivo = o que DEVE a terceiros. PL = o que é dos SÓCIOS. PL negativo = passivo a descoberto = insolvência. Equilíbrio = sempre verdadeiro.",
    keyPoint: "A equação A = P + PL é sempre verdadeira (o balanço sempre fecha). PL = A - P. Passivo a descoberto = PL negativo = sinal de insolvência. Cada bem (ativo) tem uma origem (passivo ou PL) — daí o equilíbrio eterno.",
    practicalExample: "Empresa tem Ativo Total de R$ 500.000 e Passivo de R$ 300.000 → PL = 500.000 - 300.000 = R$ 200.000 (situação ativa). Se o Passivo fosse R$ 600.000 → PL = 500.000 - 600.000 = -R$ 100.000 (passivo a descoberto = situação insolvente). Verificação: 500.000 = 300.000 + 200.000 ✓.",
    difficulty: "FACIL",
  },
  // ── 2. Ativo Circulante ────────────────────────────────────────────────
  {
    title: "Ativo Circulante: Subgrupos, Ordem de Liquidez e Exemplos",
    textContent: `O ATIVO CIRCULANTE (AC) compreende os bens e direitos que serão convertidos em caixa ou utilizados em até 12 meses (ou dentro do ciclo operacional da empresa, se mais longo).

SUBGRUPOS DO ATIVO CIRCULANTE (ordem de liquidez — do mais líquido para o menos):
1. DISPONIBILIDADES: caixa, banco (conta corrente), aplicações financeiras de curtíssimo prazo.
2. APLICAÇÕES FINANCEIRAS: títulos para negociação e disponíveis para venda com vencimento ≤ 12 meses.
3. CONTAS A RECEBER (Clientes): duplicatas a receber, notas promissórias de clientes.
4. ESTOQUES: mercadorias, matéria-prima, produtos em elaboração, produtos acabados.
5. DESPESAS DO EXERCÍCIO SEGUINTE (pré-pagas): seguros a vencer, aluguéis antecipados.

ORDEM NO BALANÇO: o ativo circulante é apresentado antes do ativo não circulante. Dentro do AC, a ordem vai do mais líquido para o menos líquido.

ATIVO NÃO CIRCULANTE (ANC): o que NÃO se converte em caixa em até 12 meses:
- Realizável a Longo Prazo (RLP): direitos com prazo > 12 meses.
- Investimentos: participações em outras empresas.
- Imobilizado: bens tangíveis de longa duração (máquinas, veículos, imóveis).
- Intangível: bens incorpóreos (marcas, patentes, software).`,
    mnemonic: "AC = até 12 meses. Subgrupos (mais → menos líquido): DiAp = Disponibilidades → Aplicações → Contas a receber → Estoque → Despesas pré-pagas. ANC = imobilizado, intangível, investimento, RLP.",
    keyPoint: "Ativo Circulante: conversão em caixa em até 12 meses (ou ciclo operacional). Ordem: mais líquido para menos líquido. Estoques: menos líquidos dentro do AC. ANC: imobilizado, intangível, investimentos e RLP.",
    practicalExample: "Balancete da empresa XYZ: Caixa=R$20.000 (AC-dispon.), Duplicatas a receber=R$80.000 (AC-clientes), Estoque=R$120.000 (AC-estoque), Máquinas=R$300.000 (ANC-imobilizado). AC total = 20.000+80.000+120.000 = R$220.000. ANC = R$300.000. AT = R$520.000.",
    difficulty: "FACIL",
  },
  // ── 3. Passivo Exigível ────────────────────────────────────────────────
  {
    title: "Passivo Exigível: Circulante, Não Circulante e Diferença do Patrimônio Líquido",
    textContent: `O PASSIVO EXIGÍVEL representa as obrigações da entidade com terceiros — valores que a empresa DEVE e terá de pagar. Difere do Patrimônio Líquido, que representa obrigações com os próprios sócios (capital investido).

PASSIVO CIRCULANTE (PC): obrigações com vencimento em até 12 meses (ou dentro do ciclo operacional).
Exemplos: fornecedores a pagar, salários a pagar, impostos a recolher (ISS, ICMS, IR), empréstimos de curto prazo, aluguéis a pagar.

PASSIVO NÃO CIRCULANTE (PNC): obrigações com vencimento em mais de 12 meses.
Exemplos: financiamentos de longo prazo (BNDES), debêntures de longo prazo, provisão para litígios de longo prazo.

CAPITAL DE TERCEIROS: soma do PC + PNC — representa o total de recursos de terceiros (credores) aplicados na empresa.

DIFERENÇA PASSIVO × PL:
- Passivo: obrigação exigível — credores PODEM cobrar por meios legais.
- PL: obrigação não exigível — sócios só recebem de volta o capital na liquidação da empresa.

CAPITAL DE GIRO LÍQUIDO (CGL): AC - PC. Positivo = empresa tem folga de curto prazo. Negativo = empresa pode ter dificuldade em honrar compromissos imediatos.`,
    mnemonic: "Passivo = o que DEVE a TERCEIROS (exigível). PC = vence em até 12 meses. PNC = vence em mais de 12 meses. PL ≠ Passivo: PL é dos sócios (não exigível). CGL = AC - PC (folga de curto prazo).",
    keyPoint: "Passivo exigível: obrigações com terceiros (exigíveis). PC: até 12 meses. PNC: mais de 12 meses. PL: obrigação com sócios (não exigível). Capital de giro líquido = AC - PC. PC negativo isolado pode indicar problema de liquidez.",
    practicalExample: "Empresa deve: salários R$15.000 (PC), financiamento bancário com vencimento em 5 anos R$200.000 (PNC). PC Total = R$15.000. PNC = R$200.000. Total Passivo = R$215.000. Se AC = R$50.000 → CGL = 50.000 - 15.000 = R$35.000 (positivo, boa liquidez de curto prazo).",
    difficulty: "FACIL",
  },
  // ── 4. Patrimônio Líquido ──────────────────────────────────────────────
  {
    title: "Patrimônio Líquido: Capital Social, Reservas e Resultados Acumulados",
    textContent: `O PATRIMÔNIO LÍQUIDO (PL) representa a parcela do ativo financiada pelos próprios sócios/acionistas — a diferença entre o que a empresa possui (ativo) e o que ela deve a terceiros (passivo exigível).

COMPOSIÇÃO DO PL (conforme Lei 6.404/76 — Lei das S/A, aplicável à Contabilidade Geral):

1. CAPITAL SOCIAL: valor integralizado pelos sócios/acionistas — subscrito e integralizado.

2. RESERVAS DE CAPITAL: valores recebidos de terceiros que não transitam pelo resultado (ex.: ágio na emissão de ações, doações e subvenções para investimento).

3. AJUSTES DE AVALIAÇÃO PATRIMONIAL: variações de valor justo de ativos/passivos não realizadas.

4. RESERVAS DE LUCROS: lucros retidos na empresa (reserva legal, estatutária, de expansão, de lucros a realizar etc.).
   - RESERVA LEGAL: obrigatória por lei (5% do lucro líquido até atingir 20% do capital social).

5. AÇÕES EM TESOURARIA: ações próprias recompradas — valor DEDUTIVO do PL (aparece com sinal negativo).

6. PREJUÍZOS ACUMULADOS: saldo devedor de resultados — REDUZ o PL (aparece com sinal negativo).

PL NEGATIVO: quando o passivo exigível supera o ativo → "passivo a descoberto" → sinal de insolvência.`,
    mnemonic: "PL = Capital Social + Reservas de Capital + Ajustes + Reservas de Lucro - Ações em Tesouraria - Prejuízos. Reserva Legal: 5% do LL até 20% do CS. PL negativo = passivo a descoberto.",
    keyPoint: "Componentes do PL: capital social + reservas de capital + ajustes + reservas de lucro − ações em tesouraria − prejuízos. Reserva legal: obrigatória (5% do LL, teto 20% do CS). Prejuízos acumulados e ações em tesouraria REDUZEM o PL.",
    practicalExample: "Empresa XYZ: Capital Social=R$500.000, Reserva Legal=R$25.000, Reservas de Lucro=R$75.000, Prejuízos Acumulados=-R$30.000. PL = 500.000+25.000+75.000-30.000 = R$570.000. Verificação: ativo deve ser R$570.000 mais o passivo exigível. Reserva legal: 5% de R$100.000 de lucro = R$5.000.",
    difficulty: "MEDIO",
  },
  // ── 5. Estrutura do Balanço Patrimonial ────────────────────────────────
  {
    title: "Estrutura do Balanço Patrimonial: Ordem, Equilíbrio e Apresentação",
    textContent: `O BALANÇO PATRIMONIAL (BP) é a demonstração contábil que evidencia, em uma data determinada, a posição patrimonial e financeira da entidade. Estruturado em dois lados que SEMPRE se equilibram.

ESTRUTURA (conforme Lei 6.404/76 e CPC 26):

LADO ESQUERDO — ATIVO:
  ├── ATIVO CIRCULANTE (AC)
  │     Disponibilidades → Aplicações → Clientes → Estoques → Outros
  └── ATIVO NÃO CIRCULANTE (ANC)
        Realizável a Longo Prazo → Investimentos → Imobilizado → Intangível

LADO DIREITO — PASSIVO + PL:
  ├── PASSIVO CIRCULANTE (PC)
  │     Fornecedores → Salários → Impostos → Empréstimos CP → Outros
  ├── PASSIVO NÃO CIRCULANTE (PNC)
  │     Financiamentos LP → Provisões LP → Outros
  └── PATRIMÔNIO LÍQUIDO (PL)
        Capital Social → Reservas → Ajustes → Resultados

PRINCÍPIO DO EQUILÍBRIO: ATIVO TOTAL = PASSIVO CIRCULANTE + PASSIVO NÃO CIRCULANTE + PL
AT = PC + PNC + PL

ORDEM: ativo → liquidez decrescente (mais líquido primeiro). Passivo → exigibilidade crescente (vence antes = aparece primeiro).

DATA DE REFERÊNCIA: o BP é uma "foto" da empresa em uma data específica (normalmente 31/12), diferente da DRE que é um "vídeo" (período).`,
    mnemonic: "BP = foto do patrimônio em uma data. Esquerdo = ATIVO (liquidez ↓). Direito = PASSIVO (exigib. ↑) + PL. AT = PC + PNC + PL. Sempre equilibrado — nunca fecha errado.",
    keyPoint: "Estrutura: Ativo (esquerdo, liquidez decrescente) = Passivo Circulante + Passivo Não Circulante + PL (direito). O BP é uma demonstração estática (data específica). DRE = demonstração dinâmica (período). Equilíbrio sempre obrigatório.",
    practicalExample: "BP em 31/12: Lado Ativo: AC=R$220.000 (caixa+clientes+estoque), ANC=R$480.000 (imóvel+máquinas). AT=R$700.000. Lado Direito: PC=R$80.000 (fornecedores+salários), PNC=R$120.000 (financiamento LP), PL=R$500.000 (capital+reservas). PC+PNC+PL=80.000+120.000+500.000=R$700.000 ✓ (equilibrado).",
    difficulty: "MEDIO",
  },
  // ── 6. Variações Patrimoniais ──────────────────────────────────────────
  {
    title: "Variações Patrimoniais: Permutativas vs Modificativas (Aumentativas e Diminutivas)",
    textContent: `As VARIAÇÕES PATRIMONIAIS são as alterações que ocorrem nos elementos patrimoniais em decorrência dos fatos contábeis. Classificam-se em:

VARIAÇÕES PERMUTATIVAS (QUALITATIVAS): alteram a composição do patrimônio sem modificar o valor do PL. Há troca entre contas do mesmo grupo ou de grupos distintos, mas o PL permanece inalterado.
Exemplos:
- Compra de mercadoria à vista: Estoque ↑, Caixa ↓ (AC muda internamente — PL inalterado).
- Pagamento de fornecedor: Caixa ↓, Fornecedores ↓ (AC ↓ e PC ↓ pelo mesmo valor — PL inalterado).
- Obtenção de empréstimo bancário: Caixa ↑, Empréstimos a pagar ↑ (AT ↑, Passivo ↑ — PL inalterado).

VARIAÇÕES MODIFICATIVAS (QUANTITATIVAS): alteram o valor do PL.
- AUMENTATIVAS: aumentam o PL. Exemplos: receitas de vendas, rendimentos de aplicações, integralização de capital.
- DIMINUTIVAS: reduzem o PL. Exemplos: despesas de pessoal, depreciacão, pagamento de tributos como custo.

FATOS MISTOS: combinam permutação + modificação. Exemplo: venda de mercadoria a prazo com lucro — parte é permutativa (troca estoque por cliente) e parte é modificativa (lucro aumenta o PL).

TESTE RÁPIDO: se o PL mudou → modificativa. Se o PL ficou igual → permutativa.`,
    mnemonic: "PL mudou? → MODIFICATIVA (aumentativa se ↑, diminutiva se ↓). PL igual? → PERMUTATIVA (troca). Compra à vista = permutativa (caixa ↓, estoque ↑). Receita de venda = modificativa aumentativa. Despesa = modificativa diminutiva.",
    keyPoint: "Permutativa: PL não muda (troca de contas). Modificativa: PL muda (aumentativa = receita; diminutiva = despesa). Fato misto: combina os dois. Teste: PL mudou? Modificativa. PL igual? Permutativa.",
    practicalExample: "Compra de estoque R$30.000 à vista: Estoque+30.000, Caixa-30.000 → PERMUTATIVA (PL inalterado, AC muda internamente). Venda a prazo R$50.000 com custo R$30.000: Clientes+50.000, Estoque-30.000, Receita+50.000, CMV-30.000 → MISTO (permutativa na troca clientes/estoque + modificativa no lucro de R$20.000). Pagamento de salários R$10.000: Caixa-10.000, PL-10.000 → MODIFICATIVA DIMINUTIVA.",
    difficulty: "DIFICIL",
  },
];

// ============================================
// QUESTÕES (12) — TODAS CERTO_ERRADO
// ============================================

interface Alternative {
  letter: string;
  text: string;
}

interface QuestionData {
  id: string;
  statement: string;
  alternatives: Alternative[];
  correctAnswer: "A" | "B";    // A=CERTO, B=ERRADO
  correctOption: 0 | 1;        // 0=CERTO, 1=ERRADO
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  questionType: "CERTO_ERRADO";
  contentTitle: string;
}

// Alternativas fixas para CERTO/ERRADO
const CE: Alternative[] = [
  { letter: "A", text: "CERTO" },
  { letter: "B", text: "ERRADO" },
];

const questions: QuestionData[] = [
  // ══════════════════════════════════════════════════════════════════
  // Átomo 1 — Equação Fundamental do Patrimônio (Q1-Q2)
  // ══════════════════════════════════════════════════════════════════

  // Q1 — Conceito A = P + PL (FACIL, CERTO)
  {
    id: "qz_contab_bp_001",
    statement:
      "Julgue o item conforme os princípios de Contabilidade Geral.\n\n" +
      "A equação fundamental do patrimônio é expressa como Ativo = Passivo Exigível + Patrimônio Líquido, " +
      "significando que os recursos aplicados na entidade (ativo) têm como origens o capital de terceiros " +
      "(passivo) e o capital próprio dos sócios (patrimônio líquido).",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. A = P + PL é a equação fundamental. O Ativo representa onde os recursos estão aplicados " +
      "(bens e direitos); o Passivo representa a origem dos recursos de terceiros; e o PL representa a " +
      "origem dos recursos dos próprios sócios. O balanço sempre se equilibra por essa identidade.",
    explanationCorrect:
      "Correto! A = P + PL: Ativo (aplicação) = Passivo (origem de terceiros) + PL (origem dos sócios). " +
      "Derivações: PL = A - P e P = A - PL. Essa equação é uma identidade permanente — o balanço sempre fecha.",
    explanationWrong:
      "O item está CERTO. A equação fundamental é A = P + PL. Ativo = bens e direitos (aplicação dos recursos). " +
      "Passivo = obrigações com terceiros. PL = recursos dos sócios. O balanço sempre se equilibra por essa identidade.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Equação Fundamental do Patrimônio: Ativo = Passivo + Patrimônio Líquido",
  },

  // Q2 — Cálculo passivo: afirmação errada (FACIL, ERRADO)
  // VERIFICAÇÃO: AT=500.000; PL=200.000 → P = 500.000 - 200.000 = 300.000 (não 700.000)
  {
    id: "qz_contab_bp_002",
    statement:
      "Julgue o item conforme os princípios de Contabilidade Geral.\n\n" +
      "Uma empresa possui Ativo Total de R$ 500.000 e Patrimônio Líquido de R$ 200.000. " +
      "Pela equação fundamental do patrimônio (A = P + PL), o Passivo Exigível Total dessa empresa é de R$ 700.000.\n" +
      "[Verificação: 500.000 = P + 200.000 → P = ?]",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. Pela equação A = P + PL → P = A - PL = 500.000 - 200.000 = R$ 300.000. " +
      "O valor de R$ 700.000 seria A + PL (soma incorreta). Verificação: 500.000 = 300.000 + 200.000 ✓. " +
      "Nunca some A + PL para obter o passivo — use sempre P = A - PL.",
    explanationCorrect:
      "O item está ERRADO. P = A - PL = 500.000 - 200.000 = R$ 300.000 (não R$ 700.000). " +
      "O valor de 700.000 seria A + PL — operação matematicamente incorreta. " +
      "Verificação: 500.000 = 300.000 + 200.000 ✓.",
    explanationWrong:
      "O item está ERRADO. P = A - PL = 500.000 - 200.000 = R$ 300.000. " +
      "Nunca use A + PL para calcular o passivo. Verificação: 500.000 = 300.000 + 200.000 ✓. " +
      "R$ 700.000 é a soma de A + PL, não a diferença.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Equação Fundamental do Patrimônio: Ativo = Passivo + Patrimônio Líquido",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 2 — Ativo Circulante (Q3-Q4)
  // ══════════════════════════════════════════════════════════════════

  // Q3 — Ordem de liquidez no AC: afirmação errada (FACIL, ERRADO)
  {
    id: "qz_contab_bp_003",
    statement:
      "Julgue o item conforme as normas contábeis brasileiras (CPC 26).\n\n" +
      "No Ativo Circulante, os estoques de mercadorias são apresentados antes das duplicatas a receber " +
      "de clientes, pois têm maior valor nominal e importância operacional para a maioria das empresas.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. No Ativo Circulante, a ordem segue a liquidez decrescente (do mais ao menos líquido): " +
      "Disponibilidades → Aplicações Financeiras → Contas a Receber (clientes/duplicatas) → Estoques → " +
      "Despesas antecipadas. Os estoques ficam DEPOIS das duplicatas a receber, pois são menos líquidos " +
      "(precisam ser vendidos antes de gerar caixa). O critério é liquidez, não valor ou importância.",
    explanationCorrect:
      "O item está ERRADO. Ordem no AC (liquidez decrescente): Disponibilidades → Aplicações → Clientes → " +
      "Estoques. Duplicatas a receber aparecem ANTES dos estoques. O critério é liquidez (facilidade de " +
      "conversão em caixa), não valor nominal.",
    explanationWrong:
      "O item está ERRADO. A ordem no AC vai do mais ao menos líquido: Disponibilidades → Aplicações → " +
      "Clientes (duplicatas) → Estoques. Estoques vêm DEPOIS das duplicatas, pois são menos líquidos. " +
      "O critério é liquidez — não valor ou importância operacional.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Ativo Circulante: Subgrupos, Ordem de Liquidez e Exemplos",
  },

  // Q4 — Veículos da frota = ANC Imobilizado (FACIL, CERTO)
  {
    id: "qz_contab_bp_004",
    statement:
      "Julgue o item conforme as normas contábeis brasileiras.\n\n" +
      "Os veículos utilizados pela empresa na entrega de mercadorias (frota própria) são classificados no " +
      "Ativo Não Circulante, subgrupo Imobilizado, por serem bens tangíveis de longa duração que não se " +
      "convertem em caixa em até 12 meses no curso normal das operações.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Veículos da frota são bens tangíveis de uso operacional de longa duração → classificados no " +
      "ANC-Imobilizado. Para integrar o Ativo Circulante, o bem precisaria ser convertido em caixa em até " +
      "12 meses (ou dentro do ciclo operacional). Veículos em uso não são vendidos no curso normal das " +
      "operações — permanecem no ANC até sua baixa ou alienação.",
    explanationCorrect:
      "Correto! Veículos da frota = ANC-Imobilizado: bens tangíveis de longa duração, utilizados nas " +
      "operações e não destinados à venda. Não se convertem em caixa em 12 meses → ANC. Se fossem " +
      "veículos para revenda (concessionária), seriam estoque (AC).",
    explanationWrong:
      "O item está CERTO. Veículos da frota = ANC (Imobilizado). Bens tangíveis de longa duração em uso " +
      "operacional não se convertem em caixa em 12 meses → ficam no ANC. Seriam AC apenas se a empresa " +
      "fosse uma concessionária (veículo como estoque para venda).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Ativo Circulante: Subgrupos, Ordem de Liquidez e Exemplos",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 3 — Passivo Exigível (Q5-Q6)
  // ══════════════════════════════════════════════════════════════════

  // Q5 — Calcular ativo total: afirmação correta (FACIL, CERTO)
  // VERIFICAÇÃO: AT = AC + ANC = 280.000 + 420.000 = 700.000 ✓
  {
    id: "qz_contab_bp_005",
    statement:
      "Julgue o item conforme os princípios de Contabilidade Geral.\n\n" +
      "O Balanço Patrimonial de uma empresa apresenta Ativo Circulante de R$ 280.000 e Ativo Não " +
      "Circulante de R$ 420.000. O Ativo Total dessa empresa é de R$ 700.000.\n" +
      "[Verificação: AT = AC + ANC = 280.000 + 420.000 = 700.000 ✓]",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. AT = AC + ANC = R$ 280.000 + R$ 420.000 = R$ 700.000. O Ativo Total é a soma de todos os " +
      "subgrupos do ativo — circulante (realização em até 12 meses) e não circulante (realização após 12 " +
      "meses). Verificação: 280.000 + 420.000 = 700.000 ✓.",
    explanationCorrect:
      "Correto! AT = AC + ANC = 280.000 + 420.000 = R$ 700.000. O Ativo Total compreende todos os bens e " +
      "direitos da entidade, seja qual for o prazo de realização — circulante (≤12 meses) + não circulante (>12 meses).",
    explanationWrong:
      "O item está CERTO. AT = AC + ANC = 280.000 + 420.000 = R$ 700.000. O Ativo Total inclui todos os " +
      "bens e direitos — tanto os de curto prazo (AC) quanto os de longo prazo (ANC). A soma está correta.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Passivo Exigível: Circulante, Não Circulante e Diferença do Patrimônio Líquido",
  },

  // Q6 — Passivo a descoberto (FACIL, CERTO)
  {
    id: "qz_contab_bp_006",
    statement:
      "Julgue o item conforme os conceitos de Contabilidade Geral.\n\n" +
      "Quando o Passivo Exigível Total de uma empresa supera o seu Ativo Total, o resultado é um " +
      "Patrimônio Líquido negativo — situação denominada 'passivo a descoberto', indicativa de " +
      "insolvência patrimonial.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Quando P > A, temos PL = A - P < 0. Essa situação é chamada de 'passivo a descoberto' ou " +
      "'situação líquida passiva'. Significa que os recursos de terceiros (passivo) superam todos os bens " +
      "e direitos da empresa (ativo) — indicativo de insolvência patrimonial. O balanço continua " +
      "equilibrado (A = P + PL), mas o PL aparece como valor negativo no lado direito.",
    explanationCorrect:
      "Correto! PL < 0 = passivo a descoberto = insolvência patrimonial. Quando P > A: PL = A - P < 0. " +
      "O balanço ainda fecha (A = P + PL), mas o PL negativo sinaliza que a empresa deve mais do que possui.",
    explanationWrong:
      "O item está CERTO. Quando P > A → PL = A - P < 0 → passivo a descoberto → insolvência patrimonial. " +
      "O balanço ainda se equilibra, mas o PL aparece negativo — os sócios devem capital à empresa (em tese).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Passivo Exigível: Circulante, Não Circulante e Diferença do Patrimônio Líquido",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 4 — Patrimônio Líquido (Q7-Q8)
  // ══════════════════════════════════════════════════════════════════

  // Q7 — Prejuízos e ações em tesouraria reduzem o PL (MEDIO, ERRADO)
  {
    id: "qz_contab_bp_007",
    statement:
      "Julgue o item conforme a Lei 6.404/76 (Lei das S/A).\n\n" +
      "Os prejuízos acumulados e as ações em tesouraria são componentes do Patrimônio Líquido que " +
      "aumentam o seu valor total, pois representam recursos retidos ou recomprados pela empresa " +
      "para uso ou distribuição futura.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. Tanto os prejuízos acumulados quanto as ações em tesouraria são componentes que REDUZEM o " +
      "PL — aparecem com sinal negativo no balanço. Prejuízos acumulados: saldo devedor de resultados, " +
      "que diminui os recursos próprios. Ações em tesouraria: ações recompradas pela própria empresa, " +
      "apresentadas como conta dedutiva do PL (valor negativo). Os elementos que AUMENTAM o PL são: " +
      "capital social integralizado, reservas de capital e reservas de lucros.",
    explanationCorrect:
      "O item está ERRADO. Prejuízos acumulados e ações em tesouraria REDUZEM o PL (aparecem com sinal " +
      "negativo). Prejuízos: saldo devedor de resultados. Ações em tesouraria: conta dedutiva do PL. " +
      "Elementos que aumentam o PL: capital social, reservas de capital, reservas de lucros.",
    explanationWrong:
      "O item está ERRADO. Prejuízos acumulados (saldo devedor de resultados) e ações em tesouraria (conta " +
      "dedutiva) REDUZEM o PL — aparecem com sinal negativo. Não confundir com reservas de lucros (que " +
      "aumentam o PL) ou passivo (que são obrigações com terceiros).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Patrimônio Líquido: Capital Social, Reservas e Resultados Acumulados",
  },

  // Q8 — Reserva legal: 5% do LL até 20% do CS (MEDIO, CERTO)
  {
    id: "qz_contab_bp_008",
    statement:
      "Julgue o item conforme a Lei 6.404/76 (Lei das S/A).\n\n" +
      "A reserva legal é de constituição obrigatória para as sociedades anônimas, correspondendo à " +
      "destinação de 5% do lucro líquido de cada exercício até atingir o limite de 20% do capital " +
      "social — sendo a constituição da reserva facultativa após atingido esse limite.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Conforme o art. 193 da Lei 6.404/76, a reserva legal é obrigatória: 5% do lucro líquido " +
      "de cada exercício, até o limite de 20% do capital social. Atingido o limite, a empresa fica " +
      "desobrigada de continuar destinando recursos para essa reserva. A reserva legal tem como " +
      "finalidade proteger o capital social de eventuais prejuízos futuros.",
    explanationCorrect:
      "Correto! Reserva legal: 5% do LL por exercício, teto 20% do CS. Obrigatória (art. 193, Lei " +
      "6.404/76). Após atingir 20% do CS, encerra-se a obrigação. Finalidade: proteger o capital social " +
      "de prejuízos futuros. Integra as reservas de lucros no PL.",
    explanationWrong:
      "O item está CERTO. Reserva legal: 5% do lucro líquido, até 20% do capital social — obrigatória " +
      "por lei (art. 193, Lei 6.404/76). Após atingir o limite de 20%, a destinação deixa de ser " +
      "compulsória. Finalidade: resguardar o capital social contra prejuízos.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Patrimônio Líquido: Capital Social, Reservas e Resultados Acumulados",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 5 — Estrutura do BP (Q9-Q10)
  // ══════════════════════════════════════════════════════════════════

  // Q9 — Ordem lado direito: PL não aparece antes do PC (MEDIO, ERRADO)
  {
    id: "qz_contab_bp_009",
    statement:
      "Julgue o item conforme as normas contábeis brasileiras (CPC 26).\n\n" +
      "No lado direito do Balanço Patrimonial, o Patrimônio Líquido é apresentado antes do Passivo " +
      "Circulante, por representar recursos permanentes e de maior estabilidade para a entidade.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O lado direito do BP segue a ordem crescente de exigibilidade (vence mais cedo aparece " +
      "primeiro): (1) Passivo Circulante — vence em até 12 meses; (2) Passivo Não Circulante — vence " +
      "em mais de 12 meses; (3) Patrimônio Líquido — não é exigível (aparece por ÚLTIMO). O PL nunca " +
      "precede o passivo circulante — é justamente por não ser exigível que fica no final.",
    explanationCorrect:
      "O item está ERRADO. Ordem no lado direito: PC → PNC → PL (exigibilidade crescente). O PL aparece " +
      "DEPOIS do passivo (circulante e não circulante), pois não é exigível — representar os recursos " +
      "permanentes dos sócios não o coloca antes das dívidas no balanço.",
    explanationWrong:
      "O item está ERRADO. Ordem correta: PC (mais exigível) → PNC → PL (não exigível, por último). " +
      "O PL aparece APÓS os dois grupos do passivo, não antes do PC. O critério é a exigibilidade " +
      "(quando vence), e o PL não tem vencimento — por isso vem por último.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Estrutura do Balanço Patrimonial: Ordem, Equilíbrio e Apresentação",
  },

  // Q10 — BP sempre equilibrado pela partida dobrada (MEDIO, CERTO)
  {
    id: "qz_contab_bp_010",
    statement:
      "Julgue o item conforme os princípios contábeis geralmente aceitos.\n\n" +
      "O Balanço Patrimonial sempre se equilibra (Ativo Total = Passivo Total + PL), pois qualquer " +
      "fato contábil que altere um elemento patrimonial necessariamente altera outro elemento de " +
      "igual valor — garantindo o equilíbrio pela partida dobrada.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. O Balanço Patrimonial sempre se equilibra por força do método das partidas dobradas: todo " +
      "débito tem um crédito de mesmo valor. Qualquer fato que aumente o ativo aumenta necessariamente o " +
      "passivo ou o PL (ou reduz outro ativo). O equilíbrio A = P + PL é uma identidade matemática " +
      "contábil — nunca pode ser violada em um balanço corretamente elaborado.",
    explanationCorrect:
      "Correto! O BP SEMPRE equilibra — pela partida dobrada, todo lançamento afeta dois (ou mais) " +
      "elementos de forma que A = P + PL seja mantida. Um balanço desequilibrado indica erro contábil, " +
      "não uma situação patrimonial possível.",
    explanationWrong:
      "O item está CERTO. O BP SEMPRE se equilibra. Pela partida dobrada, todo débito tem um crédito de " +
      "mesmo valor → A = P + PL é uma identidade permanente. Um balanço que não fecha indica erro " +
      "contábil — é matematicamente impossível que o balanço seja correto e desequilibrado.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Estrutura do Balanço Patrimonial: Ordem, Equilíbrio e Apresentação",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 6 — Variações Patrimoniais (Q11-Q12)
  // ══════════════════════════════════════════════════════════════════

  // Q11 — Compra à vista = permutativa, NÃO modificativa (DIFICIL, ERRADO)
  {
    id: "qz_contab_bp_011",
    statement:
      "Julgue o item conforme a teoria das variações patrimoniais.\n\n" +
      "A compra de mercadorias à vista é classificada como uma variação patrimonial modificativa " +
      "aumentativa, pois aumenta o Ativo da empresa (entrada de estoque) sem contrapartida que " +
      "reduza o Patrimônio Líquido.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. A compra de mercadorias à vista é PERMUTATIVA, não modificativa. Na operação: " +
      "Estoque ↑ (AC) e Caixa ↓ (AC) pelo mesmo valor — há troca interna no ativo, e o PL PERMANECE " +
      "INALTERADO. Como o PL não mudou, a variação é PERMUTATIVA. Para ser modificativa aumentativa, " +
      "o PL precisaria aumentar (o que ocorre com receitas, por exemplo). O teste: PL mudou? Se não → permutativa.",
    explanationCorrect:
      "O item está ERRADO. Compra à vista = PERMUTATIVA (não modificativa): Estoque ↑, Caixa ↓ pelo " +
      "mesmo valor → PL inalterado. Para ser modificativa, o PL precisaria mudar. Teste: PL mudou? Não → permutativa.",
    explanationWrong:
      "O item está ERRADO. Compra à vista: Estoque+, Caixa- → é uma TROCA dentro do ativo (AC muda " +
      "internamente), PL fica igual → PERMUTATIVA. Não é modificativa porque o PL não mudou. " +
      "Modificativa aumentativa ocorre com receitas (ex.: receita de aluguel → Caixa+, PL+).",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Variações Patrimoniais: Permutativas vs Modificativas (Aumentativas e Diminutivas)",
  },

  // Q12 — Caso prático: compra a prazo = permutativa (DIFICIL, CERTO)
  // VERIFICAÇÃO:
  //   Inicial: A=100.000; P=40.000; PL=60.000 → 100.000 = 40.000 + 60.000 ✓
  //   Compra a prazo R$20.000: Estoque+20.000; Fornecedores+20.000
  //   Novo: A=120.000; P=60.000; PL=60.000 → 120.000 = 60.000 + 60.000 ✓ (permutativa)
  {
    id: "qz_contab_bp_012",
    statement:
      "Julgue o item conforme a teoria das variações patrimoniais.\n\n" +
      "Uma empresa apresenta: Ativo Total = R$ 100.000, Passivo Exigível = R$ 40.000 e PL = R$ 60.000 " +
      "(verificação: 100.000 = 40.000 + 60.000 ✓). Ao comprar mercadorias a prazo por R$ 20.000, " +
      "o Ativo Total passa a R$ 120.000, o Passivo a R$ 60.000 e o PL permanece em R$ 60.000 " +
      "(verificação: 120.000 = 60.000 + 60.000 ✓) — configurando uma variação patrimonial permutativa.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Compra a prazo: Estoque (AC) ↑ R$20.000 e Fornecedores (PC) ↑ R$20.000. " +
      "Novo AT = 100.000 + 20.000 = R$120.000. Novo P = 40.000 + 20.000 = R$60.000. " +
      "PL permanece = R$60.000. Verificação: 120.000 = 60.000 + 60.000 ✓. " +
      "Como o PL não mudou, a variação é PERMUTATIVA (troca: ativo ↑ e passivo ↑ pelo mesmo valor).",
    explanationCorrect:
      "Correto! Compra a prazo: Estoque +20.000 (AC↑) e Fornecedores +20.000 (PC↑). " +
      "AT: 100.000+20.000=120.000. P: 40.000+20.000=60.000. PL: 60.000 (inalterado). " +
      "Verificação: 120.000 = 60.000 + 60.000 ✓. PL não mudou → PERMUTATIVA. O balanço equilibra.",
    explanationWrong:
      "O item está CERTO. Compra a prazo: Estoque+20.000 (AC↑) + Fornecedores+20.000 (PC↑). " +
      "AT passa para R$120.000; P para R$60.000; PL permanece R$60.000. " +
      "Verificação: 120.000 = 60.000 + 60.000 ✓. PL inalterado → PERMUTATIVA (não modificativa).",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Variações Patrimoniais: Permutativas vs Modificativas (Aumentativas e Diminutivas)",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n📊  Seed R18: Contabilidade Geral — Balanço Patrimonial (CERTO_ERRADO)\n");

  // ── 1. Encontrar Subject ────────────────────────────────────────────────
  let subjectId = await findSubject("CONTABILIDADE_GERAL");
  if (!subjectId) subjectId = await findSubject("Contab");
  if (!subjectId) {
    console.error("❌ Subject para Contabilidade não encontrado.");
    console.error("   Execute primeiro: npx tsx db/seed-subjects-fix.ts");
    process.exit(1);
  }
  console.log(`✅ Subject encontrado: ${subjectId}`);

  // ── 2. Garantir colunas Phase 5 em Question ────────────────────────────
  for (const [col, def] of [
    ["correctOption", "INTEGER"],
    ["explanationCorrect", "TEXT"],
    ["explanationWrong", "TEXT"],
    ["contentId", "TEXT"],
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
  const topicId = await findOrCreateTopic("Balanço Patrimonial", subjectId);
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
        ${q.explanationCorrect}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${subjectId}, ${topicId}, ${contentId},
        true, ${q.difficulty},
        0, ${q.questionType},
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Questão criada: ${q.id} (${q.correctAnswer === "A" ? "CERTO" : "ERRADO"})`);
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
  console.log(`📝 Tipo:      TODAS CERTO_ERRADO (12/12)`);
  console.log("─────────────────────────────────────────\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed falhou:", err);
  process.exit(1);
});
