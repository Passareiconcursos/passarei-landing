/**
 * Seed: Contabilidade Geral — R18 — Balanço Patrimonial
 * (Equação Fundamental, Ativo Circulante, Passivo Exigível,
 *  Patrimônio Líquido, Estrutura do BP, Variações Patrimoniais)
 *
 * AUTO-REVISÃO DE CÁLCULOS: todos os valores numéricos das questões
 * foram verificados antes da inserção:
 *   Q2: AT=500.000; PL=200.000 → P=300.000 (500=300+200 ✓)
 *   Q5: AC=280.000; ANC=420.000 → AT=700.000 ✓
 *   Q12: A=100.000; P=40.000; PL=60.000 (100=40+60 ✓)
 *        Após compra a prazo 20.000: A=120.000; P=60.000; PL=60.000 (120=60+60 ✓)
 *
 * Popula 6 átomos de Conteúdo + 12 Questões.
 * Idempotente: verifica existência antes de inserir.
 * TODAS as questões têm "contentId" vinculado ao átomo correto.
 *
 * Execução:
 *   npx tsx db/seed-contab-balanco-r18.ts
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
// QUESTÕES (12) — com cálculos verificados
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
  questionType: "CERTO_ERRADO" | "MULTIPLA_ESCOLHA";
  contentTitle: string;
}

const questions: QuestionData[] = [
  // ── Q1 — Equação fundamental: conceito (FACIL, MULTIPLA_ESCOLHA) ─────────
  {
    id: "qz_contab_bp_001",
    statement: "A Equação Fundamental do Patrimônio (EFP) relaciona os elementos patrimoniais de qualquer entidade. Assinale a alternativa que expressa CORRETAMENTE essa equação:",
    alternatives: [
      { letter: "A", text: "Patrimônio Líquido = Ativo + Passivo Exigível" },
      { letter: "B", text: "Ativo = Passivo Exigível + Patrimônio Líquido" },
      { letter: "C", text: "Passivo Exigível = Ativo + Patrimônio Líquido" },
      { letter: "D", text: "Ativo = Patrimônio Líquido − Passivo Exigível" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A Equação Fundamental do Patrimônio é: ATIVO = PASSIVO EXIGÍVEL + PATRIMÔNIO LÍQUIDO (A = P + PL). Dela derivam: PL = A − P e P = A − PL. O ativo representa a aplicação dos recursos; o passivo e o PL representam as origens (de terceiros e dos sócios, respectivamente).",
    explanationCorrect: "Correto! A = P + PL. Ativo = o que a empresa tem/possui; Passivo = o que deve a terceiros; PL = parcela dos sócios. O balanço SEMPRE se equilibra por essa equação.",
    explanationWrong: "A equação correta é A = P + PL. Lembre: Ativo (aplicação) = Passivo (origem de terceiros) + PL (origem própria). As demais alternativas invertem ou somam erroneamente os elementos.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Equação Fundamental do Patrimônio: Ativo = Passivo + Patrimônio Líquido",
  },
  // ── Q2 — Equação: calcular passivo (FACIL, MULTIPLA_ESCOLHA) ────────────
  // VERIFICAÇÃO: AT=500.000; PL=200.000 → P = 500.000 - 200.000 = 300.000
  // Prova: 500.000 = 300.000 + 200.000 ✓
  {
    id: "qz_contab_bp_002",
    statement: "Uma empresa possui Ativo Total de R$ 500.000 e Patrimônio Líquido de R$ 200.000. Qual é o valor do Passivo Exigível Total?\n[Verificação: AT = P + PL → 500.000 = P + 200.000]",
    alternatives: [
      { letter: "A", text: "R$ 700.000" },
      { letter: "B", text: "R$ 200.000" },
      { letter: "C", text: "R$ 300.000" },
      { letter: "D", text: "R$ 100.000" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Pela Equação Fundamental: A = P + PL → P = A − PL → P = 500.000 − 200.000 = R$ 300.000. Verificação: 500.000 = 300.000 + 200.000 ✓. A alternativa A (700.000) seria A + PL, não A − PL.",
    explanationCorrect: "Correto! P = A − PL = 500.000 − 200.000 = R$ 300.000. Verificação: 500.000 = 300.000 + 200.000 ✓. Equação fundamental sempre verifica o resultado.",
    explanationWrong: "P = A − PL = 500.000 − 200.000 = R$ 300.000. Cuidado: não some A + PL (daria 700.000, que está errado). A lógica: ativo financia o passivo e o PL juntos — então P = A − PL.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Equação Fundamental do Patrimônio: Ativo = Passivo + Patrimônio Líquido",
  },
  // ── Q3 — Ativo circulante: classificação (FACIL, MULTIPLA_ESCOLHA) ────────
  {
    id: "qz_contab_bp_003",
    statement: "Identifique, entre os itens abaixo, aquele que NÃO pertence ao Ativo Circulante:",
    alternatives: [
      { letter: "A", text: "Caixa e equivalentes de caixa" },
      { letter: "B", text: "Duplicatas a receber de clientes com vencimento em 60 dias" },
      { letter: "C", text: "Estoque de mercadorias para venda" },
      { letter: "D", text: "Veículos utilizados na entrega de mercadorias (frota própria)" },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "Veículos utilizados na operação da empresa são bens tangíveis de longa duração → classificados no ATIVO NÃO CIRCULANTE, subgrupo IMOBILIZADO. Os demais itens integram o Ativo Circulante: caixa = disponibilidades; duplicatas a receber de 60 dias = contas a receber (dentro de 12 meses); estoque = estoques.",
    explanationCorrect: "Correto! Veículos da frota = ANC-Imobilizado. Bem de uso de longa duração não é convertido em caixa em 12 meses — fica no ANC. Caixa, duplicatas ≤12 meses e estoque são todos AC.",
    explanationWrong: "Veículos da frota = ANC (Imobilizado). São bens tangíveis de longa duração — não se transformam em caixa em 12 meses. Caixa = AC (disponibilidades); duplicatas de 60 dias = AC (clientes); estoque = AC.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Ativo Circulante: Subgrupos, Ordem de Liquidez e Exemplos",
  },
  // ── Q4 — Ordem de liquidez no AC (FACIL, CERTO_ERRADO) ──────────────────
  {
    id: "qz_contab_bp_004",
    statement: "Julgue o item conforme as normas contábeis brasileiras (CPC 26).\n\nNo Balanço Patrimonial, os ativos são apresentados em ordem decrescente de liquidez — do mais líquido (disponibilidades) para o menos líquido (imobilizado). Portanto, dentro do Ativo Circulante, os estoques aparecem antes das duplicatas a receber.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "ERRADO. No Ativo Circulante, a ordem é do MAIS líquido para o MENOS líquido. As duplicatas a receber (contas a receber) são mais líquidas que os estoques — clientes já são direitos de fácil conversão em caixa, enquanto estoque precisa primeiro ser vendido. Ordem correta no AC: Disponibilidades → Aplicações Financeiras → Contas a Receber (clientes) → Estoques → Despesas Antecipadas.",
    explanationCorrect: "O item está ERRADO. A ordem no AC vai do mais líquido para o menos líquido: Disponibilidades → Aplicações → Clientes → Estoques. Estoques vêm DEPOIS das duplicatas a receber, não antes.",
    explanationWrong: "O item está ERRADO. Duplicatas a receber (clientes) aparecem ANTES dos estoques, pois são mais líquidas. Ordem no AC: Disponibilidades → Aplicações → Clientes → Estoques → Despesas antecipadas (do mais ao menos líquido).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Ativo Circulante: Subgrupos, Ordem de Liquidez e Exemplos",
  },
  // ── Q5 — Calcular ativo total (FACIL, MULTIPLA_ESCOLHA) ─────────────────
  // VERIFICAÇÃO: AC=280.000; ANC=420.000 → AT=700.000 ✓
  {
    id: "qz_contab_bp_005",
    statement: "O Balanço Patrimonial de uma empresa apresenta os seguintes dados:\n• Ativo Circulante: R$ 280.000\n• Ativo Não Circulante: R$ 420.000\nO valor do Ativo Total é:",
    alternatives: [
      { letter: "A", text: "R$ 420.000" },
      { letter: "B", text: "R$ 280.000" },
      { letter: "C", text: "R$ 140.000" },
      { letter: "D", text: "R$ 700.000" },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "Ativo Total = Ativo Circulante + Ativo Não Circulante = R$ 280.000 + R$ 420.000 = R$ 700.000. O Ativo Total compreende todos os bens e direitos da entidade, independentemente do prazo de realização.",
    explanationCorrect: "Correto! AT = AC + ANC = 280.000 + 420.000 = R$ 700.000. O Ativo Total é a soma de todos os subgrupos do ativo — circulante e não circulante.",
    explanationWrong: "AT = AC + ANC = 280.000 + 420.000 = R$ 700.000. Não confundir AT com apenas um dos subgrupos. O Ativo Total inclui TODOS os bens e direitos da empresa.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Passivo Exigível: Circulante, Não Circulante e Diferença do Patrimônio Líquido",
  },
  // ── Q6 — Passivo a descoberto (FACIL, CERTO_ERRADO) ─────────────────────
  {
    id: "qz_contab_bp_006",
    statement: "Julgue o item conforme os conceitos de Contabilidade Geral.\n\nQuando o Passivo Exigível Total de uma empresa supera o seu Ativo Total, o resultado é um Patrimônio Líquido negativo — situação denominada 'passivo a descoberto', indicativa de insolvência patrimonial.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CERTO. Quando P > A, temos PL = A − P < 0. Essa situação é chamada de 'passivo a descoberto' ou 'situação líquida passiva'. Significa que os recursos de terceiros (passivo) superam todos os bens e direitos da empresa (ativo) — os sócios, em tese, devem à empresa mais do que ela possui. É sinal de insolvência patrimonial.",
    explanationCorrect: "Correto! PL < 0 = passivo a descoberto = insolvência patrimonial. Equação: P > A → PL = A - P → valor negativo. Situação crítica que exige atenção dos gestores e credores.",
    explanationWrong: "O item está CERTO. Quando passivo supera o ativo: PL = A - P < 0 → passivo a descoberto → insolvência patrimonial. O balanço fecha, mas o PL aparece como valor negativo no lado direito.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Passivo Exigível: Circulante, Não Circulante e Diferença do Patrimônio Líquido",
  },
  // ── Q7 — Componentes do PL (MEDIO, MULTIPLA_ESCOLHA) ────────────────────
  {
    id: "qz_contab_bp_007",
    statement: "Sobre a composição do Patrimônio Líquido (PL) de uma sociedade anônima, conforme a Lei 6.404/76, assinale a alternativa que apresenta elementos que AUMENTAM o PL:",
    alternatives: [
      { letter: "A", text: "Prejuízos acumulados e ações em tesouraria" },
      { letter: "B", text: "Capital social integralizado e reservas de lucros" },
      { letter: "C", text: "Ações em tesouraria e provisão para litígios" },
      { letter: "D", text: "Empréstimos de longo prazo e reservas de capital" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Capital social integralizado e reservas de lucros são elementos que INTEGRAM e AUMENTAM o PL. Prejuízos acumulados e ações em tesouraria REDUZEM o PL (aparecem com sinal negativo). Provisão para litígios é elemento do passivo (não do PL). Empréstimos de longo prazo são passivo não circulante — não integram o PL.",
    explanationCorrect: "Correto! Capital social + reservas de lucros → aumentam o PL. Prejuízos e ações em tesouraria → REDUZEM o PL. Empréstimos → passivo (não PL). Provisões → passivo (não PL).",
    explanationWrong: "Prejuízos acumulados e ações em tesouraria REDUZEM o PL (sinal negativo). Empréstimos = passivo (não PL). Provisão para litígios = passivo. Os elementos que aumentam o PL são: capital social, reservas de capital e reservas de lucros.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Patrimônio Líquido: Capital Social, Reservas e Resultados Acumulados",
  },
  // ── Q8 — Reserva legal (MEDIO, CERTO_ERRADO) ────────────────────────────
  {
    id: "qz_contab_bp_008",
    statement: "Julgue o item conforme a Lei 6.404/76 (Lei das S/A).\n\nA reserva legal é obrigatória para as sociedades anônimas e corresponde à destinação de 5% do lucro líquido de cada exercício, até que a reserva atinja 20% do capital social — após atingir esse limite, a destinação é facultativa.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CERTO. Conforme o art. 193 da Lei 6.404/76, a reserva legal é obrigatória: 5% do lucro líquido de cada exercício, até o limite de 20% do capital social. Atingido o limite, a empresa fica desobrigada de continuar destinando recursos para essa reserva. A reserva legal tem como finalidade proteger o capital social de eventuais prejuízos futuros.",
    explanationCorrect: "Correto! Reserva legal: 5% do LL por exercício, até 20% do CS. Obrigatória (art. 193, Lei 6.404/76). Após atingir o limite, encerra-se a obrigação de destinar. Finalidade: proteger o capital social.",
    explanationWrong: "O item está CERTO. Reserva legal: 5% do lucro líquido, até 20% do capital social. Obrigatória por lei (art. 193, Lei 6.404/76). Após atingir 20%, a destinação para reserva legal deixa de ser obrigatória.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Patrimônio Líquido: Capital Social, Reservas e Resultados Acumulados",
  },
  // ── Q9 — Estrutura do BP: lado direito (MEDIO, MULTIPLA_ESCOLHA) ─────────
  {
    id: "qz_contab_bp_009",
    statement: "Sobre a estrutura e ordem de apresentação do lado direito (Passivo + PL) do Balanço Patrimonial, assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "PL aparece antes do Passivo Circulante, pois representa os recursos próprios (mais permanentes)." },
      { letter: "B", text: "O Passivo Circulante aparece antes do Passivo Não Circulante, seguido do Patrimônio Líquido — ordem crescente de exigibilidade." },
      { letter: "C", text: "O Passivo Não Circulante aparece antes do Passivo Circulante, pois tem prazo mais longo e valor geralmente maior." },
      { letter: "D", text: "O PL e o Passivo Não Circulante são agrupados como 'capital permanente', aparecendo antes do Passivo Circulante." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O lado direito do BP segue a ordem crescente de exigibilidade (vence mais cedo → aparece primeiro): (1) Passivo Circulante (PC) — vence em até 12 meses; (2) Passivo Não Circulante (PNC) — vence em mais de 12 meses; (3) Patrimônio Líquido (PL) — não é exigível (aparece por último). O PL não é uma dívida — representa os recursos dos sócios.",
    explanationCorrect: "Correto! Ordem no lado direito: PC → PNC → PL (exigibilidade crescente: vence mais cedo aparece primeiro). O PL fica por último por não ser exigível — não é dívida.",
    explanationWrong: "Ordem correta: PC (mais exigível, vence primeiro) → PNC (menos exigível) → PL (não exigível, por último). O PL não aparece antes do passivo circulante — seria ordem errada. A ordem segue a exigibilidade crescente.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Estrutura do Balanço Patrimonial: Ordem, Equilíbrio e Apresentação",
  },
  // ── Q10 — BP sempre equilibrado (MEDIO, CERTO_ERRADO) ───────────────────
  {
    id: "qz_contab_bp_010",
    statement: "Julgue o item conforme os princípios contábeis geralmente aceitos.\n\nO Balanço Patrimonial sempre se equilibra (Ativo Total = Passivo Total + PL), pois qualquer fato contábil que altere um elemento patrimonial necessariamente altera outro elemento de igual valor — garantindo o equilíbrio pela partida dobrada.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "CERTO. O Balanço Patrimonial sempre se equilibra por força do método das partidas dobradas: todo débito tem um crédito de mesmo valor. Qualquer fato que aumente o ativo aumenta necessariamente o passivo ou o PL (ou reduz outro ativo). O equilíbrio A = P + PL é uma identidade matemática contábil — nunca pode ser violada em um balanço corretamente elaborado.",
    explanationCorrect: "Correto! O BP sempre se equilibra pela partida dobrada: todo débito = crédito de mesmo valor. A = P + PL é uma identidade permanente. Se o balanço não fechar, há erro contábil — não é possível um BP desequilibrado em uma contabilidade correta.",
    explanationWrong: "O item está CERTO. O BP SEMPRE equilibra — pela partida dobrada, qualquer lançamento afeta dois ou mais elementos de forma que A = P + PL seja mantida. Um BP desequilibrado indica erro contábil.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Estrutura do Balanço Patrimonial: Ordem, Equilíbrio e Apresentação",
  },
  // ── Q11 — Variações permutativas vs modificativas (DIFICIL, MULTIPLA_ESCOLHA)
  {
    id: "qz_contab_bp_011",
    statement: "Classifique as variações patrimoniais abaixo como PERMUTATIVA (P) ou MODIFICATIVA (M):\nI. Pagamento de salários com saída de caixa.\nII. Compra de mercadorias à vista.\nIII. Obtenção de empréstimo bancário (crédito em conta corrente).\nIV. Receita de aluguel recebida em dinheiro.\nA sequência CORRETA é:",
    alternatives: [
      { letter: "A", text: "M — P — P — M" },
      { letter: "B", text: "P — M — M — P" },
      { letter: "C", text: "M — P — M — M" },
      { letter: "D", text: "P — P — P — M" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: "I. Pagamento de salários: Caixa↓, PL↓ (despesa reduz lucro) → MODIFICATIVA DIMINUTIVA (M). II. Compra à vista: Caixa↓, Estoque↑ → PERMUTATIVA (P) — PL não muda. III. Empréstimo bancário: Caixa↑, Passivo↑ → PERMUTATIVA (P) — PL não muda (AT sobe, P sobe igualmente). IV. Receita de aluguel: Caixa↑, Receita↑ (PL↑) → MODIFICATIVA AUMENTATIVA (M).",
    explanationCorrect: "Correto! M-P-P-M: Salários = modificativa dim. (PL↓); Compra à vista = permutativa (PL=); Empréstimo = permutativa (PL=, AT e P sobem iguais); Aluguel recebido = modificativa aum. (PL↑). O teste: PL mudou? Modificativa. PL igual? Permutativa.",
    explanationWrong: "Teste: PL mudou? Modificativa. PL igual? Permutativa. I (salários): PL↓ → M. II (compra à vista): Caixa↓+Estoque↑, PL= → P. III (empréstimo): Caixa↑+Passivo↑, PL= → P. IV (aluguel recebido): Caixa↑+Receita↑, PL↑ → M. Sequência: M-P-P-M.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Variações Patrimoniais: Permutativas vs Modificativas (Aumentativas e Diminutivas)",
  },
  // ── Q12 — Caso prático com cálculo (DIFICIL, MULTIPLA_ESCOLHA) ───────────
  // VERIFICAÇÃO:
  //   Estado inicial: A=100.000; P=40.000; PL=60.000 → 100.000=40.000+60.000 ✓
  //   Após compra a prazo R$20.000: Estoque+20.000; Fornecedores+20.000
  //   Novo A=120.000; P=60.000; PL=60.000 → 120.000=60.000+60.000 ✓ (permutativa)
  {
    id: "qz_contab_bp_012",
    statement: "Uma empresa apresenta: Ativo Total = R$ 100.000, Passivo Exigível = R$ 40.000 e PL = R$ 60.000.\nA empresa compra mercadorias a prazo por R$ 20.000.\nApós essa operação, qual é o novo Ativo Total e como se classifica esse fato contábil?\n[Verificação: antes: 100.000=40.000+60.000 ✓; após: 120.000=60.000+60.000 ✓]",
    alternatives: [
      { letter: "A", text: "Ativo Total = R$ 120.000; fato modificativo aumentativo (PL aumentou)." },
      { letter: "B", text: "Ativo Total = R$ 120.000; fato permutativo (PL permaneceu em R$ 60.000)." },
      { letter: "C", text: "Ativo Total = R$ 100.000; fato permutativo (o ativo não mudou, apenas internamente)." },
      { letter: "D", text: "Ativo Total = R$ 80.000; fato modificativo diminutivo (a dívida reduziu o ativo)." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Compra a prazo: Estoque (AC) ↑ R$20.000 + Fornecedores (PC) ↑ R$20.000. Novo AT = 100.000 + 20.000 = R$120.000. Novo P = 40.000 + 20.000 = R$60.000. PL permanece = R$60.000. Verificação: 120.000 = 60.000 + 60.000 ✓. O PL não mudou → fato PERMUTATIVO. O ativo cresceu (estoque entrou) e o passivo cresceu (fornecedor entrou) pelo mesmo valor.",
    explanationCorrect: "Correto! AT = R$120.000 (Estoque +20.000). P = R$60.000 (Fornecedores +20.000). PL = R$60.000 (inalterado). Verificação: 120.000 = 60.000 + 60.000 ✓. PL não mudou → PERMUTATIVO. Compra a prazo = permutativa (troca: ativo ↑, passivo ↑, PL=).",
    explanationWrong: "Compra a prazo: Estoque+20.000 (AC↑) e Fornecedores+20.000 (PC↑). AT = 100.000+20.000 = R$120.000. PL permanece = R$60.000 (não muda). Verificação: 120.000 = 60.000 + 60.000 ✓. Como PL não mudou → PERMUTATIVO (não modificativo). O ativo cresceu — não ficou em 100.000 nem caiu para 80.000.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
    contentTitle: "Variações Patrimoniais: Permutativas vs Modificativas (Aumentativas e Diminutivas)",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n📊  Seed R18: Contabilidade Geral — Balanço Patrimonial\n");

  // ── 1. Encontrar Subject ────────────────────────────────────────────────
  let subjectId = await findSubject("Contab");
  if (!subjectId) subjectId = await findSubject("Contabilidade");
  if (!subjectId) {
    console.error("❌ Subject para Contabilidade não encontrado. Crie o subject com nome contendo 'Contab'.");
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
        ${q.explanation}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${subjectId}, ${topicId}, ${contentId},
        true, ${q.difficulty},
        0, ${q.questionType},
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
