/**
 * Seed R60 — Densificação: Contabilidade — Balanço Patrimonial
 * Modo: DENSIFICAÇÃO — átomos com IDs dinâmicos do seed-contab-balanco-r18.ts.
 * ContentIds resolvidos em runtime por título + subjectId.
 *
 * Átomos-alvo (6 átomos × 6 questões = 36 questões):
 *   "Equação Fundamental do Patrimônio: Ativo = Passivo + Patrimônio Líquido"
 *   "Ativo Circulante: Subgrupos, Ordem de Liquidez e Exemplos"
 *   "Passivo Exigível: Circulante, Não Circulante e Diferença do Patrimônio Líquido"
 *   "Patrimônio Líquido: Capital Social, Reservas e Resultados Acumulados"
 *   "Estrutura do Balanço Patrimonial: Ordem, Equilíbrio e Apresentação"
 *   "Variações Patrimoniais: Permutativas vs Modificativas (Aumentativas e Diminutivas)"
 *
 * Execução: git pull && npx tsx db/seed-dense-contab-r60.ts
 */

import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

// Títulos exatos dos átomos (conforme criados no seed-contab-balanco-r18.ts)
const ATOM_TITLES = {
  equacao:   "Equação Fundamental do Patrimônio: Ativo = Passivo + Patrimônio Líquido",
  ativo:     "Ativo Circulante: Subgrupos, Ordem de Liquidez e Exemplos",
  passivo:   "Passivo Exigível: Circulante, Não Circulante e Diferença do Patrimônio Líquido",
  pl:        "Patrimônio Líquido: Capital Social, Reservas e Resultados Acumulados",
  balanco:   "Estrutura do Balanço Patrimonial: Ordem, Equilíbrio e Apresentação",
  variacoes: "Variações Patrimoniais: Permutativas vs Modificativas (Aumentativas e Diminutivas)",
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
  // ÁTOMO 1 — Equação Fundamental: A = PE + PL
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "cbt_eq_q01",
    atomKey: "equacao",
    statement: "Julgue: A equação fundamental do patrimônio estabelece que Ativo = Passivo Exigível + Patrimônio Líquido, refletindo o equilíbrio entre os bens/direitos e as origens dos recursos.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. A = PE + PL é a equação-base da Contabilidade. O Ativo representa os bens e direitos (aplicações de recursos); o Passivo Exigível e o PL representam as origens dos recursos (de terceiros e dos proprietários, respectivamente). O saldo deve sempre estar em equilíbrio.",
    explanationWrong: "Equação fundamental: ATIVO = PASSIVO EXIGÍVEL + PATRIMÔNIO LÍQUIDO. Esta equação é invariável — qualquer registro contábil deve manter esse equilíbrio (partidas dobradas: débito = crédito). PE = obrigações com terceiros; PL = valor residual dos proprietários.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "cbt_eq_q02",
    atomKey: "equacao",
    statement: "Uma empresa apresenta Ativo Total de R$ 950.000 e Passivo Exigível de R$ 380.000. Qual é o valor do Patrimônio Líquido?",
    alternatives: [
      { letter: "A", text: "R$ 380.000" },
      { letter: "B", text: "R$ 570.000" },
      { letter: "C", text: "R$ 950.000" },
      { letter: "D", text: "R$ 1.330.000" },
      { letter: "E", text: "R$ 190.000" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. PL = Ativo − Passivo Exigível → PL = R$ 950.000 − R$ 380.000 = R$ 570.000. A equação A = PE + PL permite isolar qualquer um dos três termos: PL = A − PE; PE = A − PL; A = PE + PL.",
    explanationWrong: "Fórmula: PL = A − PE. Ativo − Passivo Exigível = 950.000 − 380.000 = 570.000. Essa operação simples é base para interpretar a situação patrimonial: PL positivo → situação líquida ativa; PL negativo → situação líquida passiva (passivo a descoberto).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "cbt_eq_q03",
    atomKey: "equacao",
    statement: "Julgue: Se uma empresa possui Passivo Exigível superior ao Ativo Total, o Patrimônio Líquido será negativo — situação denominada 'passivo a descoberto'.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Passivo a descoberto ocorre quando PE > Ativo → PL = A − PE < 0. Indica que as dívidas superam os bens e direitos. O PL negativo não impede o funcionamento legal da empresa, mas é sinal grave de insolvência.",
    explanationWrong: "Situação líquida ativa: PL > 0 (Ativo > PE). Situação líquida passiva (passivo a descoberto): PL < 0 (PE > Ativo). Situação líquida nula: PL = 0 (Ativo = PE). O PL negativo é registrado como conta devedora no balanço, do lado do Ativo, para manter o equilíbrio.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "cbt_eq_q04",
    atomKey: "equacao",
    statement: "O princípio das partidas dobradas, que sustenta a equação A = PE + PL, implica que:",
    alternatives: [
      { letter: "A", text: "Todo lançamento possui um lado a débito e um lado a crédito de igual valor." },
      { letter: "B", text: "Cada conta só pode ter lançamentos a débito ou só a crédito, nunca ambos." },
      { letter: "C", text: "O Ativo sempre terá valor superior ao Passivo Exigível." },
      { letter: "D", text: "Os lançamentos a débito aumentam o PL e os a crédito diminuem." },
      { letter: "E", text: "O Ativo e o Passivo Exigível jamais podem se alterar simultaneamente." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanationCorrect: "Alternativa A. Partidas dobradas: para cada débito há um crédito de igual valor. É por isso que a equação A = PE + PL sempre se mantém em equilíbrio: qualquer lançamento afeta ao menos dois elementos, preservando a igualdade. Ex.: compra de estoque à vista → débito Estoque (A+) / crédito Caixa (A−).",
    explanationWrong: "As partidas dobradas garantem que débito total = crédito total em todo lançamento. Isso mantém o equilíbrio do balanço. Uma conta pode receber tanto débitos quanto créditos ao longo do tempo — o saldo resultante indica sua posição atual.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "cbt_eq_q05",
    atomKey: "equacao",
    statement: "Julgue: Uma variação patrimonial permutativa (ex.: pagamento de fornecedor à vista com dinheiro em caixa) mantém o valor do PL inalterado, pois afeta apenas o Ativo e o Passivo Exigível.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Na variação permutativa, há troca de elementos sem alterar o PL. No pagamento ao fornecedor: Caixa diminui (A−) e Fornecedores diminui (PE−) no mesmo valor. O PL permanece intacto porque não há receita nem despesa reconhecida — apenas troca de posições.",
    explanationWrong: "Variação permutativa: modifica composição do Ativo e/ou Passivo sem alterar o PL. Variação modificativa: altera o PL (receita = aumentativa; despesa = diminutiva). No pagamento de fornecedor já contabilizado: A− e PE− → permutativa. Se fosse compra a prazo: A+ e PE+ → também permutativa.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "cbt_eq_q06",
    atomKey: "equacao",
    statement: "Uma empresa integraliza capital social: os sócios depositam R$ 200.000 em dinheiro na conta da empresa. Que efeito essa operação produz na equação patrimonial?",
    alternatives: [
      { letter: "A", text: "Ativo +200.000 / Passivo Exigível +200.000 (variação permutativa)." },
      { letter: "B", text: "Ativo +200.000 / PL +200.000 (variação modificativa aumentativa)." },
      { letter: "C", text: "Ativo −200.000 / PL −200.000 (variação modificativa diminutiva)." },
      { letter: "D", text: "Passivo Exigível −200.000 / PL +200.000 (variação permutativa)." },
      { letter: "E", text: "Nenhum efeito — integralização não altera o balanço patrimonial." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Integralização de capital: Caixa +200.000 (Ativo) / Capital Social +200.000 (PL). É variação modificativa aumentativa — aumenta o Ativo e o PL simultaneamente. Não é permutativa, pois o PL se altera. Não é Passivo Exigível, pois capital social é dos sócios (PL), não de terceiros.",
    explanationWrong: "Integralização de capital → Caixa (A+) / Capital Social (PL+). O Capital Social é conta de PL — representa o investimento dos sócios. A equação A = PE + PL mantém o equilíbrio: ambos os lados sobem R$ 200.000. Esse tipo de operação é modificativa aumentativa.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 2 — Ativo Circulante: Subgrupos, Liquidez e Exemplos
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "cbt_ac_q01",
    atomKey: "ativo",
    statement: "Julgue: No Ativo Circulante, os elementos são apresentados em ordem decrescente de liquidez — do mais líquido (disponibilidades) para o menos líquido (estoques).",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. A ordem de liquidez no Ativo Circulante: ① Disponibilidades (caixa, bancos — liquidez imediata); ② Aplicações financeiras de curto prazo; ③ Contas a receber (realizável); ④ Estoques (menor liquidez no AC). Quanto mais rápido o ativo se converte em dinheiro, mais líquido é.",
    explanationWrong: "Ordem no AC (do mais para o menos líquido): Caixa/Bancos → Aplicações financeiras CP → Contas a receber → Estoques. Essa sequência reflete a rapidez de conversão em numerário. A norma brasileira (CPC 26) determina essa apresentação no balanço.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "cbt_ac_q02",
    atomKey: "ativo",
    statement: "Qual dos itens a seguir NÃO compõe o Ativo Circulante?",
    alternatives: [
      { letter: "A", text: "Caixa e equivalentes de caixa." },
      { letter: "B", text: "Contas a receber de clientes com vencimento em 90 dias." },
      { letter: "C", text: "Estoques de mercadorias para venda." },
      { letter: "D", text: "Terreno adquirido para uso futuro em expansão da fábrica." },
      { letter: "E", text: "Aplicação financeira com vencimento em 60 dias." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanationCorrect: "Alternativa D. Terreno adquirido para uso futuro é Ativo Não Circulante — subgrupo Imobilizado (se for para uso próprio) ou Investimentos (se especulativo). O AC engloba apenas bens/direitos conversíveis em caixa em até 12 meses (ou no ciclo operacional, se maior).",
    explanationWrong: "AC: realizável em até 12 meses (ou no ciclo operacional). A, B, C, E: todos se realizam em curto prazo → AC. Terreno para uso futuro: não se realiza em 12 meses → ANC (Imobilizado ou Investimentos). A linha divisória entre AC e ANC é a realização em até 12 meses.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "cbt_ac_q03",
    atomKey: "ativo",
    statement: "Julgue: Contas a receber de clientes com vencimento em 18 meses integram o Ativo Circulante, pois representam direitos da empresa.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanationCorrect: "ERRADO. Contas a receber com vencimento em 18 meses (mais de 12 meses) integram o Ativo NÃO Circulante — subgrupo Realizável a Longo Prazo. Apenas direitos realizáveis em até 12 meses (ou dentro do ciclo operacional) são classificados no AC.",
    explanationWrong: "Critério de classificação entre AC e ANC: prazo de realização. ≤ 12 meses → AC. > 12 meses → ANC (Realizável a Longo Prazo). O prazo de 18 meses coloca esse crédito no ANC. Quando o vencimento se aproximar de 12 meses, pode ser reclassificado para o AC.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "cbt_ac_q04",
    atomKey: "ativo",
    statement: "Os subgrupos do Ativo Circulante, na ordem correta de liquidez, são:",
    alternatives: [
      { letter: "A", text: "Estoques → Contas a receber → Disponibilidades → Aplicações financeiras." },
      { letter: "B", text: "Disponibilidades → Aplicações financeiras CP → Contas a receber → Estoques." },
      { letter: "C", text: "Contas a receber → Estoques → Disponibilidades → Aplicações CP." },
      { letter: "D", text: "Imobilizado → Disponibilidades → Estoques → Contas a receber." },
      { letter: "E", text: "Todos os subgrupos têm liquidez equivalente no Ativo Circulante." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Ordem de liquidez no AC: ① Disponibilidades (caixa, bancos — liquidez imediata); ② Aplicações financeiras de curto prazo (quase caixa); ③ Contas a receber (aguarda recebimento); ④ Estoques (precisa ser vendido primeiro para gerar caixa).",
    explanationWrong: "Mnemônico de liquidez no AC: D-A-C-E (Disponibilidades → Aplicações CP → Contas a receber → Estoques). O Imobilizado é ANC, não AC. A ordem reflete a rapidez de conversão em dinheiro — fundamental para análise de liquidez do balanço.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "cbt_ac_q05",
    atomKey: "ativo",
    statement: "Julgue: Estoque de produtos acabados, prontos para venda, compõe o Ativo Circulante de uma empresa industrial.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Estoques (matéria-prima, produtos em elaboração, produtos acabados, mercadorias) são classificados no Ativo Circulante, pois se espera que sejam realizados no ciclo operacional normal (vendidos, processados ou consumidos). É o subgrupo de menor liquidez dentro do AC.",
    explanationWrong: "Estoques integram o AC porque se realizam no ciclo operacional (normalmente < 12 meses): matéria-prima → produção → produto acabado → venda → crédito → caixa. Cada etapa corresponde a um subgrupo do AC. Somente estoques de uso permanente (estratégico) poderiam ir para ANC.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "cbt_ac_q06",
    atomKey: "ativo",
    statement: "Uma empresa emprestou R$ 300.000 a uma coligada com prazo de 24 meses para resgate. Como esse valor deve ser classificado no balanço?",
    alternatives: [
      { letter: "A", text: "Ativo Circulante — Aplicações Financeiras." },
      { letter: "B", text: "Ativo Não Circulante — Realizável a Longo Prazo." },
      { letter: "C", text: "Ativo Não Circulante — Investimentos." },
      { letter: "D", text: "Passivo Circulante — Obrigações com coligadas." },
      { letter: "E", text: "Patrimônio Líquido — Reserva de investimentos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Prazo de 24 meses > 12 meses → ANC. Como é um empréstimo (direito de receber), vai para 'Realizável a Longo Prazo'. O subgrupo 'Investimentos' do ANC é para participações societárias permanentes (cotas, ações), não para empréstimos.",
    explanationWrong: "ANC possui 4 subgrupos: ① Realizável a Longo Prazo (direitos com prazo > 12m); ② Investimentos (participações societárias permanentes); ③ Imobilizado (uso/operação — tangível); ④ Intangível (uso/operação — intangível). Empréstimo a coligada com prazo > 12m → ARLP.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 3 — Passivo Exigível: Circulante, PELP e Diferença do PL
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "cbt_pe_q01",
    atomKey: "passivo",
    statement: "Julgue: O Passivo Exigível representa obrigações da empresa com terceiros (fornecedores, bancos, governo), devendo ser liquidadas com entrega de bens, serviços ou dinheiro.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. O Passivo Exigível (ou simplesmente Passivo) representa obrigações exigíveis — dívidas com terceiros que devem ser liquidadas. São exemplos: fornecedores a pagar, empréstimos bancários, salários a pagar, impostos a recolher. Distingue-se do PL, que representa recursos dos próprios sócios.",
    explanationWrong: "Passivo Exigível = obrigações com TERCEIROS (externos à empresa). PL = obrigações com os próprios proprietários/sócios (não exigível no sentido técnico). Classificação: Passivo Circulante (PE com vencimento ≤ 12m) + Passivo Não Circulante / PELP (> 12m).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "cbt_pe_q02",
    atomKey: "passivo",
    statement: "Uma empresa contraiu um financiamento bancário de R$ 1.200.000 a ser pago em 5 anos. Como deve ser classificado no balanço patrimonial?",
    alternatives: [
      { letter: "A", text: "Passivo Circulante, pois envolve obrigação financeira." },
      { letter: "B", text: "Patrimônio Líquido, pois é fonte de recursos para a empresa." },
      { letter: "C", text: "Passivo Não Circulante (PELP), pois o prazo supera 12 meses." },
      { letter: "D", text: "Ativo Não Circulante, pois é um direito futuro de crédito." },
      { letter: "E", text: "Passivo Circulante e Não Circulante, divididos em partes iguais." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. Financiamento com prazo total de 5 anos → Passivo Não Circulante (PELP). Contudo, a parcela vencível nos próximos 12 meses deve ser reclassificada para o Passivo Circulante na data do balanço. A alternativa C está correta como classificação geral do saldo de longo prazo.",
    explanationWrong: "Regra: prazo ≤ 12m → Passivo Circulante; prazo > 12m → Passivo Não Circulante (PELP). Na prática, financiamentos longos são divididos: parcelas dos próximos 12m → PC; restante → PELP. Para fins de prova, financiamento de 5 anos = PELP (salvo se a questão perguntar sobre as parcelas do próximo ano).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "cbt_pe_q03",
    atomKey: "passivo",
    statement: "Julgue: Salários a pagar dos funcionários referentes ao mês atual integram o Passivo Circulante.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Salários a pagar são obrigações com vencimento no curtíssimo prazo (até o 5º dia útil do mês seguinte, pela CLT) → Passivo Circulante. Outros exemplos típicos de PC: fornecedores a pagar (30-90 dias), impostos a recolher, aluguéis a pagar.",
    explanationWrong: "Passivo Circulante: obrigações exigíveis em até 12 meses. Exemplos: salários, fornecedores, INSS, FGTS, impostos de curto prazo, aluguéis. Passivo Não Circulante: financiamentos longos, debêntures, provisões para contingências de longo prazo.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "cbt_pe_q04",
    atomKey: "passivo",
    statement: "A principal diferença entre o Passivo Exigível e o Patrimônio Líquido é que:",
    alternatives: [
      { letter: "A", text: "O PE é sempre de curto prazo; o PL pode ser de longo prazo." },
      { letter: "B", text: "O PE representa obrigações com terceiros (exigível); o PL representa recursos dos proprietários (não exigível por terceiros)." },
      { letter: "C", text: "O PE e o PL são intercambiáveis dependendo da política contábil adotada." },
      { letter: "D", text: "O PL representa dívidas bancárias; o PE representa dívidas com fornecedores." },
      { letter: "E", text: "Não há diferença — ambos representam origens de recursos para o Ativo." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. PE = obrigações com TERCEIROS (credores, fornecedores, governo) — são exigíveis: terceiros podem cobrar judicialmente. PL = recursos dos PROPRIETÁRIOS (sócios/acionistas) — não são exigíveis por terceiros: representam o valor residual após pagar todas as dívidas.",
    explanationWrong: "PE e PL são ambos origens de recursos (lado direito do balanço), mas têm natureza distinta: PE → capital de terceiros (exigível, tem data de vencimento); PL → capital próprio (não exigível, permanece enquanto a empresa existir). Essa distinção é crucial para análise de endividamento.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "cbt_pe_q05",
    atomKey: "passivo",
    statement: "Julgue: O Patrimônio Líquido negativo (passivo a descoberto) pode coexistir com Passivo Exigível positivo, resultando em uma situação onde o PE supera o Ativo Total.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Passivo a descoberto: PE > Ativo → PL negativo. A equação A = PE + PL se mantém, mas com PL negativo. Exemplo: Ativo = 500; PE = 700 → PL = −200. O PE (700) supera o Ativo (500). Situação de insolvência técnica — credores não seriam totalmente pagos com os ativos disponíveis.",
    explanationWrong: "Passivo a descoberto: PE > A → PL < 0. Equação: A = PE + PL → 500 = 700 + (−200) → equilíbrio mantido. O PL negativo é apresentado no lado do Ativo do balanço como dedução, para manter o equilíbrio formal. É sinal de grave comprometimento financeiro.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "cbt_pe_q06",
    atomKey: "passivo",
    statement: "Uma empresa possui Ativo Total = R$ 800.000, Passivo Circulante = R$ 200.000, Passivo Não Circulante = R$ 350.000. Qual é o valor do Patrimônio Líquido?",
    alternatives: [
      { letter: "A", text: "R$ 200.000" },
      { letter: "B", text: "R$ 250.000" },
      { letter: "C", text: "R$ 350.000" },
      { letter: "D", text: "R$ 550.000" },
      { letter: "E", text: "R$ 150.000" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. PE Total = PC + PELP = 200.000 + 350.000 = 550.000. PL = A − PE = 800.000 − 550.000 = 250.000. A equação A = PE + PL: 800.000 = 550.000 + 250.000 ✓.",
    explanationWrong: "Passo a passo: ① PE Total = PC + PNC = 200.000 + 350.000 = 550.000. ② PL = A − PE = 800.000 − 550.000 = 250.000. Verificação: A = PE + PL → 800.000 = 550.000 + 250.000 ✓. Resposta: R$ 250.000 (alternativa B).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 4 — Patrimônio Líquido: Capital Social, Reservas e Resultados
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "cbt_pl_q01",
    atomKey: "pl",
    statement: "Julgue: O Patrimônio Líquido representa o valor residual dos ativos da entidade após a dedução de todos os seus passivos exigíveis.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. PL = Ativo − Passivo Exigível. É o valor que 'sobra' para os sócios/acionistas após pagamento de todas as dívidas com terceiros. Composto por: Capital Social (integralizado), Reservas de Capital, Reservas de Lucros, Lucros/Prejuízos Acumulados e Outros Resultados Abrangentes.",
    explanationWrong: "PL = A − PE: o que resta do Ativo após honrar todas as obrigações com terceiros. Não é 'quanto a empresa tem em dinheiro' (isso é Caixa/Disponibilidades) nem o valor de mercado da empresa (isso é valor de mercado/capitalização). É o valor contábil líquido pertencente aos sócios.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "cbt_pl_q02",
    atomKey: "pl",
    statement: "Qual dos seguintes itens NÃO integra o Patrimônio Líquido?",
    alternatives: [
      { letter: "A", text: "Capital Social integralizado." },
      { letter: "B", text: "Reservas de lucros (reserva legal, reserva de contingências)." },
      { letter: "C", text: "Prejuízos acumulados." },
      { letter: "D", text: "Fornecedores a pagar no prazo de 60 dias." },
      { letter: "E", text: "Reservas de capital (ágio na emissão de ações)." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanationCorrect: "Alternativa D. Fornecedores a pagar é conta do Passivo Circulante (obrigação com terceiros) — não integra o PL. O PL é composto por: Capital Social, Reservas de Capital, Ajustes de Avaliação Patrimonial, Reservas de Lucros, Ações em Tesouraria e Lucros/Prejuízos Acumulados.",
    explanationWrong: "Componentes do PL: Capital Social + Reservas de Capital + Ajustes de Avaliação Patrimonial + Reservas de Lucros + Ações em Tesouraria (dedutora) + Lucros/Prejuízos Acumulados. Fornecedores: PE (Passivo Circulante). Mnemônico PL: C-R-A-R-A-L (Capital, Reservas Capital, Ajustes, Reservas Lucros, Ações Tesouraria, Lucros/Prejuízos).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "cbt_pl_q03",
    atomKey: "pl",
    statement: "Julgue: Prejuízos acumulados reduzem o Patrimônio Líquido, podendo torná-lo negativo (passivo a descoberto) se superarem o capital e as reservas.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Prejuízos acumulados são conta redutora do PL. Se os prejuízos somados superarem o Capital Social e as Reservas, o PL torna-se negativo (passivo a descoberto). Isso indica que as perdas consumiram todo o capital investido pelos sócios e ainda criaram déficit.",
    explanationWrong: "PL = Capital Social + Reservas − Prejuízos Acumulados (simplificado). Se prejuízos > capital + reservas → PL negativo. Exemplo: CS = 500.000; Reservas = 100.000; Prejuízos acumulados = 700.000 → PL = 500.000 + 100.000 − 700.000 = −100.000 (passivo a descoberto).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "cbt_pl_q04",
    atomKey: "pl",
    statement: "A reserva legal, exigida pela Lei das S/As (art. 193), é constituída com:",
    alternatives: [
      { letter: "A", text: "5% do lucro líquido do exercício, até o limite de 20% do capital social." },
      { letter: "B", text: "10% do faturamento bruto anual." },
      { letter: "C", text: "5% do Ativo Total da empresa." },
      { letter: "D", text: "Todo o lucro líquido, após distribuição de dividendos obrigatórios." },
      { letter: "E", text: "10% do lucro líquido, sem limite máximo." },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanationCorrect: "Alternativa A. Reserva Legal (art. 193, Lei 6.404/76): 5% do lucro líquido do exercício, até o limite de 20% do capital social. Após atingir 20% do CS, a empresa não precisa mais constituí-la. Finalidade: proteger o capital social contra perdas futuras.",
    explanationWrong: "Reserva Legal: ① Alíquota: 5% do lucro líquido. ② Limite: 20% do Capital Social. ③ Obrigatoriedade: S/As (obrigatório); limitadas (facultativo). Destinação: absorção de prejuízos ou aumento de capital. É a reserva mais cobrada em concursos de Contabilidade.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "cbt_pl_q05",
    atomKey: "pl",
    statement: "Julgue: O Capital Social integralizado representa o valor efetivamente aportado pelos sócios/acionistas na empresa, sendo parte do Patrimônio Líquido.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Capital Social integralizado: valor que os sócios/acionistas já entregaram à empresa (dinheiro, bens, direitos). É a principal conta do PL. Capital subscrito > capital integralizado quando há parcela ainda não entregue pelos sócios (capital a integralizar → conta redutora do PL).",
    explanationWrong: "Capital Social: subscrito (prometido pelos sócios) vs integralizado (efetivamente entregue). Capital a integralizar = Capital subscrito − Capital integralizado → é conta redutora do PL. Para a prova: Capital Social (líquido) = Capital subscrito − Capital a integralizar. O integralizado vai para o Caixa/Ativo.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "cbt_pl_q06",
    atomKey: "pl",
    statement: "Uma empresa encerrou o exercício com lucro líquido de R$ 500.000. Decidiu distribuir R$ 200.000 como dividendos e reter R$ 300.000. O efeito no PL é:",
    alternatives: [
      { letter: "A", text: "PL aumenta R$ 500.000; dividendos não afetam o PL." },
      { letter: "B", text: "PL aumenta R$ 300.000 (lucros retidos); dividendos de R$ 200.000 reduzem o PL ao serem distribuídos." },
      { letter: "C", text: "PL não se altera, pois o lucro pertencia à empresa antes do fechamento." },
      { letter: "D", text: "PL reduz R$ 200.000 somente no exercício seguinte." },
      { letter: "E", text: "O PL só aumenta após os dividendos serem efetivamente pagos em dinheiro." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. O lucro líquido aumenta o PL no exercício. Dos R$ 500.000: ① R$ 300.000 retidos → ficam no PL (Lucros Acumulados ou Reservas). ② R$ 200.000 distribuídos → saem do PL (Dividendos a pagar → Passivo) quando deliberada a distribuição. Resultado líquido: PL sobe R$ 300.000.",
    explanationWrong: "Fluxo do lucro no PL: Lucro → PL+ (no fechamento) → parte vai para Reservas (permanece no PL) → parte para Dividendos a pagar (sai do PL → vai para PC). No final: PL líquido aumenta pelo valor retido (R$ 300.000). A distribuição de dividendos reduz o PL quando deliberada (não quando paga).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 5 — Estrutura do Balanço Patrimonial
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "cbt_bp_q01",
    atomKey: "balanco",
    statement: "Julgue: No Balanço Patrimonial, o Ativo é apresentado à esquerda (ou acima) e o Passivo + Patrimônio Líquido à direita (ou abaixo), e os dois lados devem sempre ter valores iguais.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. O BP é uma fotografia patrimonial em determinada data. Lado esquerdo (ou superior): Ativo (aplicações de recursos). Lado direito (ou inferior): Passivo + PL (origens de recursos). A = PE + PL — equilíbrio é invariável. Qualquer diferença indica erro de escrituração.",
    explanationWrong: "Estrutura do BP: Ativo (esquerda) = Passivo Exigível + PL (direita). Analogia: o lado do Ativo mostra 'onde o dinheiro está aplicado'; o lado do Passivo+PL mostra 'de onde veio o dinheiro' (de terceiros ou dos sócios). O equilíbrio é garantido pelo método das partidas dobradas.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "cbt_bp_q02",
    atomKey: "balanco",
    statement: "A ordem de apresentação dos grupos no Ativo do Balanço Patrimonial é:",
    alternatives: [
      { letter: "A", text: "Ativo Não Circulante (mais permanente) antes do Ativo Circulante (mais líquido)." },
      { letter: "B", text: "Ativo Circulante (mais líquido) antes do Ativo Não Circulante (menos líquido)." },
      { letter: "C", text: "Os grupos são apresentados em ordem alfabética pelo nome da conta." },
      { letter: "D", text: "Primeiro Imobilizado, depois Intangível, depois Circulante, depois Investimentos." },
      { letter: "E", text: "A ordem é irrelevante, conforme a política contábil da empresa." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Pela Lei 6.404/76 e CPC 26, o Ativo é apresentado em ordem decrescente de liquidez: primeiro o Ativo Circulante (mais líquido), depois o Ativo Não Circulante (Realizável LP → Investimentos → Imobilizado → Intangível). O mais líquido aparece primeiro.",
    explanationWrong: "Ordem no Ativo: ① AC (Circulante — mais líquido) → ② ANC: Realizável a LP → Investimentos → Imobilizado → Intangível (menos líquido). Ordem no Passivo: ① PC → ② PNC → ③ PL. Regra geral: dos mais líquidos/exigíveis para os menos, de cima para baixo.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "cbt_bp_q03",
    atomKey: "balanco",
    statement: "Julgue: Uma marca registrada desenvolvida internamente pela empresa, que foi adquirida e valorizada comercialmente, é classificada no subgrupo Intangível do Ativo Não Circulante.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. O Intangível (ANC) engloba ativos sem substância física identificável que a empresa controla e dos quais espera benefícios futuros: marcas, patentes, softwares, direitos autorais, fundo de comércio (goodwill). Marcas adquiridas ou com custo identificável → Intangível.",
    explanationWrong: "Subgrupos do ANC: ① Realizável a LP (direitos > 12m); ② Investimentos (participações societárias); ③ Imobilizado (tangível: máquinas, imóveis, veículos, equipamentos); ④ Intangível (sem corpo físico: marcas, patentes, softwares, goodwill). Marcas → Intangível, não Imobilizado.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "cbt_bp_q04",
    atomKey: "balanco",
    statement: "A Depreciação Acumulada é apresentada no Balanço Patrimonial como:",
    alternatives: [
      { letter: "A", text: "Despesa no resultado do exercício, reduzindo diretamente o lucro." },
      { letter: "B", text: "Conta redutora (retificadora) do Ativo Imobilizado, diminuindo o valor contábil líquido." },
      { letter: "C", text: "Passivo Circulante, pois representa obrigação futura de reposição do ativo." },
      { letter: "D", text: "Conta do Patrimônio Líquido, como reserva para reposição de bens." },
      { letter: "E", text: "Ativo Circulante, como provisão para reposição de equipamentos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Depreciação Acumulada: conta retificadora do Imobilizado (ANC). Apresentada com sinal negativo sob o bem depreciado. Valor Contábil Líquido = Custo Histórico − Depreciação Acumulada. A despesa de depreciação do período vai ao resultado (DRE), reduzindo o lucro.",
    explanationWrong: "Depreciação: ① Despesa de depreciação (DRE — reduz lucro); ② Depreciação Acumulada (Balanço — conta redutora do Imobilizado). São duas 'faces' do mesmo fenômeno: o desgaste econômico do ativo. Valor líquido contábil = Custo − Depr. Acumulada. Não é passivo, não é PL.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "cbt_bp_q05",
    atomKey: "balanco",
    statement: "Julgue: O Balanço Patrimonial é uma demonstração estática — retrata a posição financeira da empresa em uma data específica, não em um período.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. O BP é demonstração ESTÁTICA (ou posicional) — fotografia do patrimônio em uma data (ex.: 31/12/20XX). Contrasta com demonstrações dinâmicas (de fluxo): DRE (resultado do período), DFC (fluxo de caixa do período), DMPL (mutações do PL no período).",
    explanationWrong: "Demonstrações contábeis: Estáticas (posição em uma data): BP. Dinâmicas (movimento em um período): DRE, DFC, DVA, DMPL. O BP responde 'quanto temos?' em X de data. A DRE responde 'quanto ganhamos/perdemos?' de data A a data B. A DFC responde 'quanto entrou/saiu de caixa?' no período.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "cbt_bp_q06",
    atomKey: "balanco",
    statement: "Uma empresa tem: AC = R$ 400.000; ANC = R$ 600.000; PC = R$ 250.000; PNC = R$ 350.000. Qual é o Patrimônio Líquido?",
    alternatives: [
      { letter: "A", text: "R$ 150.000" },
      { letter: "B", text: "R$ 200.000" },
      { letter: "C", text: "R$ 400.000" },
      { letter: "D", text: "R$ 600.000" },
      { letter: "E", text: "R$ 250.000" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. Ativo Total = AC + ANC = 400.000 + 600.000 = 1.000.000. PE Total = PC + PNC = 250.000 + 350.000 = 600.000. PL = A − PE = 1.000.000 − 600.000 = 400.000. Verificação: A = PE + PL → 1.000.000 = 600.000 + 400.000 ✓.",
    explanationWrong: "Cálculo: ① A = AC + ANC = 400k + 600k = 1.000k. ② PE = PC + PNC = 250k + 350k = 600k. ③ PL = A − PE = 1.000k − 600k = 400k. Resposta: R$ 400.000 (alternativa C). Equilíbrio: 1.000k = 600k + 400k ✓.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 6 — Variações Patrimoniais: Permutativas vs Modificativas
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "cbt_vp_q01",
    atomKey: "variacoes",
    statement: "Julgue: As variações patrimoniais permutativas alteram a composição do patrimônio sem modificar o valor do Patrimônio Líquido.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Variação permutativa: troca de elementos patrimoniais sem alterar o PL. Exemplos: compra de mercadoria à vista (A+ / A−), compra a prazo (A+ / PE+), pagamento de fornecedor (A− / PE−). Em todos os casos, o PL permanece inalterado — apenas composição do Ativo e/ou Passivo muda.",
    explanationWrong: "Permutativas: PL inalterado. Modificativas: PL se altera. Mista: combinação das duas. Fórmula de verificação: se a operação envolve reconhecimento de receita ou despesa → modificativa. Se envolve apenas troca de ativos ou ativos por passivos → permutativa.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "cbt_vp_q02",
    atomKey: "variacoes",
    statement: "Uma empresa presta serviço e recebe R$ 15.000 à vista. Qual é o tipo de variação patrimonial e o efeito no PL?",
    alternatives: [
      { letter: "A", text: "Permutativa — PL não se altera, pois só ocorreu troca de elementos." },
      { letter: "B", text: "Modificativa aumentativa — PL aumenta R$ 15.000 (receita de serviço)." },
      { letter: "C", text: "Modificativa diminutiva — PL reduz R$ 15.000 (despesa de prestação de serviço)." },
      { letter: "D", text: "Permutativa mista — PL aumenta apenas R$ 7.500." },
      { letter: "E", text: "Nenhum tipo — prestação de serviço não altera o patrimônio." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. Recebimento de serviço prestado: Caixa +15.000 (Ativo) / Receita de Serviços +15.000 (PL via resultado). O reconhecimento de RECEITA é sempre variação modificativa AUMENTATIVA — aumenta o Ativo e o PL simultaneamente. É o motor do crescimento patrimonial.",
    explanationWrong: "Variações modificativas aumentativas (aumentam o PL): reconhecimento de receitas (vendas, serviços, aluguéis recebidos). Diminutivas (reduzem o PL): reconhecimento de despesas (salários, aluguéis pagos, depreciação, juros). Permutativas: não envolvem resultado — apenas trocas entre contas.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "cbt_vp_q03",
    atomKey: "variacoes",
    statement: "Julgue: O pagamento de um fornecedor cujo valor já estava registrado como obrigação (fornecedores a pagar) constitui variação patrimonial permutativa.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Pagamento de fornecedor já contabilizado: Caixa −X (Ativo) / Fornecedores −X (Passivo). Apenas dois elementos patrimoniais se alteram (A e PE), ambos diminuindo no mesmo valor. O PL permanece intacto — não há reconhecimento de receita ou despesa nova neste momento.",
    explanationWrong: "A despesa foi reconhecida quando a compra foi registrada (variação modificativa diminutiva: A+ / Despesa no resultado / PE+). O pagamento posterior é permutativo: apenas quita a dívida (A− / PE−). O erro comum é confundir o pagamento com o reconhecimento da despesa.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "cbt_vp_q04",
    atomKey: "variacoes",
    statement: "O reconhecimento da despesa de depreciação do mês (R$ 8.000) em uma empresa é classificado como:",
    alternatives: [
      { letter: "A", text: "Variação permutativa — apenas transfere valor entre contas do Ativo." },
      { letter: "B", text: "Variação modificativa aumentativa — aumenta o PL pela criação de reserva." },
      { letter: "C", text: "Variação modificativa diminutiva — reduz o PL pela despesa reconhecida." },
      { letter: "D", text: "Sem efeito patrimonial — depreciação é lançamento extraconta." },
      { letter: "E", text: "Variação mista — aumenta o Ativo e reduz o PL simultaneamente." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanationCorrect: "Alternativa C. Depreciação: Despesa de Depreciação (resultado/PL−) / Depreciação Acumulada (ANC−). O PL reduz pelo valor da despesa. É variação modificativa diminutiva: não há saída de caixa (despesa não-caixa), mas o patrimônio líquido decresce, refletindo o desgaste econômico do ativo.",
    explanationWrong: "Depreciação: variação modificativa diminutiva. Lançamento: D — Despesa de Depreciação (resultado) / C — Depreciação Acumulada (retificadora do Ativo). Efeito: PL cai (despesa) + Ativo líquido cai (valor contábil do bem se reduz). Não é permutativa, pois o PL se altera.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "cbt_vp_q05",
    atomKey: "variacoes",
    statement: "Julgue: A compra de um imóvel a prazo (financiamento de longo prazo), sem entrada, é uma variação patrimonial permutativa, pois aumenta o Ativo e o Passivo no mesmo valor, sem alterar o PL.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanationCorrect: "CERTO. Compra de imóvel a prazo: Imobilizado +X (Ativo) / Financiamentos +X (Passivo). Ambos os lados sobem igualmente, e o PL permanece inalterado. É variação permutativa: não há receita, não há despesa — apenas troca de forma: o imóvel entra como ativo e a dívida entra como passivo.",
    explanationWrong: "Compra a prazo: A+ / PE+ → permutativa (PL inalterado). Compra à vista: A+ / A− → também permutativa. Só haverá efeito no PL quando reconhecer depreciação do imóvel (modificativa diminutiva) ou quando eventualmente vender com lucro/prejuízo (modificativa aumentativa/diminutiva).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "cbt_vp_q06",
    atomKey: "variacoes",
    statement: "Uma empresa vende mercadoria a prazo por R$ 30.000 (custo R$ 18.000). Essa operação gera:",
    alternatives: [
      { letter: "A", text: "Variação permutativa — A+ e PE+, sem efeito no PL." },
      { letter: "B", text: "Variação modificativa aumentativa de R$ 30.000 (receita) e diminutiva de R$ 18.000 (custo) — PL líquido +R$ 12.000." },
      { letter: "C", text: "Variação modificativa diminutiva — reduz PL pelo custo da mercadoria vendida." },
      { letter: "D", text: "Variação permutativa mista — o lucro vai para reservas automaticamente." },
      { letter: "E", text: "Sem efeito no PL — o lucro só é reconhecido quando recebido em dinheiro." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanationCorrect: "Alternativa B. A venda a prazo gera DOIS lançamentos: ① Clientes +30.000 (A) / Receita de Vendas +30.000 (PL+) — modificativa aumentativa. ② CMV +18.000 (PL−) / Estoques −18.000 (A) — modificativa diminutiva. Resultado líquido no PL: +30.000 − 18.000 = +12.000 (lucro bruto).",
    explanationWrong: "Venda gera dois registros simultâneos: ① Receita (PL+): Clientes/Caixa + / Receita de Vendas +. ② CMV (PL−): CMV − / Estoques −. PL líquido: + Receita − CMV = + Margem Bruta. Regime de competência: receita é reconhecida na venda (não no recebimento). Variação mista: modificativa aumentativa + diminutiva no mesmo evento.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

];

async function main() {
  console.log("\n🚀 Seed R60 — Densificação: Contabilidade — Balanço Patrimonial\n");

  // 1. Encontrar subjectId de Contabilidade
  const subjectRows = await db.execute(sql`
    SELECT id FROM "Subject" WHERE name ILIKE ${"%" + "CONTAB" + "%"} LIMIT 1
  `) as any[];
  if (!subjectRows[0]) {
    console.error("❌ Subject Contabilidade não encontrado.");
    process.exit(1);
  }
  const subjectId: string = subjectRows[0].id;
  console.log(`  ✅ Subject: ${subjectId}`);

  // 2. Resolver contentIds por título
  const contentIdMap: Record<AtomKey, string | null> = {
    equacao: null, ativo: null, passivo: null,
    pl: null, balanco: null, variacoes: null,
  };

  for (const [key, title] of Object.entries(ATOM_TITLES) as [AtomKey, string][]) {
    const rows = await db.execute(sql`
      SELECT id FROM "Content" WHERE title = ${title} AND "subjectId" = ${subjectId} LIMIT 1
    `) as any[];
    if (rows[0]) {
      contentIdMap[key] = rows[0].id;
      console.log(`  ✅ Átomo [${key}]: ${rows[0].id}`);
    } else {
      console.warn(`  ⚠️  Átomo NÃO encontrado: "${title}" — execute seed-contab-balanco-r18.ts primeiro`);
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
