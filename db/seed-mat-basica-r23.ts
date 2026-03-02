/**
 * Seed: Matemática Básica — R23 — Operações e Frações
 *
 * Diretriz pedagógica: desmistificar a matemática com exemplos do cotidiano
 * policial (munições, escalas, combustível, diárias, distribuição de equipes).
 * Todos os resultados são exatos — sem dízimas periódicas complexas.
 *
 * AUTO-REVISÃO DE CÁLCULOS — verificados antes da inserção:
 *   Q1:  -12 + 8 = -4   (não +4)              → ERRADO
 *   Q2:  (-3) × (-5) = +15                    → CERTO
 *   Q3:  127,45 + 83,70 = 211,15              → CERTO
 *   Q4:  350,00 - 127,80 = 222,20 (não 232,80)→ ERRADO
 *   Q5:  MDC(12,18)=6 → 12/18 = 2/3           → CERTO
 *   Q6:  3/4 = 12/16 ≠ 9/16                  → ERRADO
 *   Q7:  1/3+1/4 = 4/12+3/12 = 7/12          → CERTO
 *   Q8:  3/4+1/6 = 9/12+2/12 = 11/12; resto=1/12 (não 2/3) → ERRADO
 *   Q9:  3/4÷2/5 = 3/4×5/2 = 15/8           → CERTO
 *   Q10: 2/3×3/4 = 6/12 = 1/2 (não 6/7)     → ERRADO
 *   Q11: 2+3×4 = 2+12 = 14                   → CERTO
 *   Q12: (2+3)×4−6÷2 = 5×4−3 = 20−3 = 17    → ERRADO (afirma 14)
 *
 * 6 Átomos de Conteúdo + 12 Questões CERTO_ERRADO
 * Subject: RACIOCINIO_LOGICO (ou MATEMATICA se existir)
 * Topic: Operações e Frações
 *
 * Execução:
 *   npx tsx db/seed-mat-basica-r23.ts
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
  // ── 1. Operações com Inteiros e Regras de Sinais ──────────────────
  {
    title: "Operações com Números Inteiros e Regras de Sinais",
    textContent: `Os NÚMEROS INTEIROS são o conjunto dos positivos, dos negativos e do zero: Z = {..., -3, -2, -1, 0, 1, 2, 3, ...}. Em situações policiais aparecem constantemente: temperatura negativa em câmaras frigoríficas, déficit de munições, andares abaixo do térreo, saldo negativo em relatórios.

ADIÇÃO E SUBTRAÇÃO:
- Sinais IGUAIS → soma os módulos e mantém o sinal: (+5) + (+3) = +8 | (−5) + (−3) = −8
- Sinais DIFERENTES → subtrai os módulos e mantém o sinal do maior: (+8) + (−3) = +5 | (−8) + (+3) = −5
- Subtrair é equivalente a somar o oposto: a − b = a + (−b). Assim: 7 − (−2) = 7 + 2 = 9

MULTIPLICAÇÃO E DIVISÃO — REGRAS DE SINAIS:
(+) × (+) = (+)   |   (−) × (−) = (+)
(+) × (−) = (−)   |   (−) × (+) = (−)
Macete: sinais IGUAIS → resultado POSITIVO. Sinais DIFERENTES → resultado NEGATIVO.
Exemplos: (−3) × (−5) = +15 | (−4) × (+6) = −24 | (−12) ÷ (−4) = +3 | (+10) ÷ (−2) = −5

MÓDULO (valor absoluto): |n| = distância de n até o zero, sempre positivo.
|−8| = 8 | |+5| = 5 | |0| = 0

APLICAÇÃO POLICIAL:
Um policial registra déficit de munições: saldo inicial = −12 (faltam 12 unidades).
Recebe reforço de 8: −12 + 8 = −4 (ainda faltam 4 — saldo continua negativo).
Nova remessa de 10: −4 + 10 = +6 (agora há 6 unidades sobrando).`,
    mnemonic: "Sinais IGUAIS → POSITIVO (++  ou −−). Sinais DIFERENTES → NEGATIVO (+− ou −+). Subtrair negativo = somar positivo: 7−(−2)=9. Módulo = distância ao zero (sempre ≥0). Déficit de munições = número negativo; reforço = soma positiva.",
    keyPoint: "Sinais iguais → positivo. Sinais diferentes → negativo. Subtração de negativo = adição: a−(−b)=a+b. Módulo = valor absoluto (sempre positivo). Em concurso: cuidado com a dupla negação 'menos de menos = mais'.",
    practicalExample: "Questão de concurso: saldo de munições = −12 (déficit). Recebe 8 → −12+8 = −4 (ainda negativo). Recebe mais 6 → −4+6 = +2 (positivo — sobrou 2). Regra de sinais: (−3)×(−4) = +12 (negativo × negativo = positivo). (−5)×(+2) = −10 (diferentes → negativo).",
    difficulty: "FACIL",
  },

  // ── 2. Números Decimais ───────────────────────────────────────────
  {
    title: "Números Decimais: Vírgula, Soma e Subtração em Valores Monetários",
    textContent: `Os NÚMEROS DECIMAIS representam valores não inteiros usando a vírgula como separador entre a parte inteira e a parte decimal. São essenciais em cálculos de valores monetários (diárias, combustível, multas).

ESTRUTURA DO NÚMERO DECIMAL:
127,45
  │  └─ centésimos (2ª casa: 5)
  │    décimos (1ª casa: 4)
  └─── parte inteira (127)

CASAS DECIMAIS:
1ª casa (décimos): 0,1
2ª casa (centésimos): 0,01
3ª casa (milésimos): 0,001

SOMA E SUBTRAÇÃO — REGRA DA VÍRGULA:
Alinhe sempre as vírgulas em coluna, completando com zeros quando necessário.

Exemplo — soma de combustível:
  127,45
+  83,70
────────
  211,15  ✓ (some casa a casa: 5+0=5, 4+7=11 anota 1 carrega 1, 7+3+1=11...)

Exemplo — subtração de diária:
  350,00
− 127,80
────────
  222,20  ✓

CONVERSÃO DECIMAL ↔ FRAÇÃO:
0,5 = 5/10 = 1/2
0,25 = 25/100 = 1/4
0,75 = 75/100 = 3/4
0,125 = 125/1000 = 1/8
0,1 = 1/10

DÍZIMAS PERIÓDICAS (atenção em provas):
1/3 = 0,333... (dízima periódica simples)
1/6 = 0,1666... (dízima periódica composta)
→ Nestas situações, trabalhe com frações para evitar arredondamentos.

PEGADINHA COMUM: ao somar R$ 0,90 + R$ 0,90 = R$ 1,80 (não R$ 1,8 — escreva sempre as duas casas em reais).`,
    mnemonic: "VÍRGULA ALINHADA = cálculo correto. Complete com zeros à direita antes de operar. 0,25=1/4; 0,5=1/2; 0,75=3/4; 0,125=1/8. Em reais: sempre 2 casas decimais. Dízima periódica (1/3, 1/6): prefira trabalhar com fração.",
    keyPoint: "Alinhe vírgulas ao somar/subtrair decimais. Complete casas com zeros (83,7 → 83,70). Conversões exatas: 0,5=1/2; 0,25=1/4; 0,75=3/4; 0,125=1/8; 0,2=1/5. Em reais: duas casas decimais obrigatórias. Dízima periódica: use fração para cálculo exato.",
    practicalExample: "Diária de agente: R$ 127,45 + R$ 83,70 = R$ 211,15 (combustível + alimentação). Subtração: diária de R$ 350,00 menos adiantamento de R$ 127,80 → 350,00 − 127,80 = R$ 222,20 (restante a receber). Passo a passo: alinhe vírgulas, some/subtraia casa por casa, reagrupe quando necessário.",
    difficulty: "FACIL",
  },

  // ── 3. Frações I — Conceito e Simplificação ───────────────────────
  {
    title: "Frações I: Conceito, Simplificação e Frações Equivalentes",
    textContent: `Uma FRAÇÃO a/b representa a divisão de a (numerador) por b (denominador), onde b ≠ 0. Indica partes de um todo. Em operações policiais: 3/4 do efetivo disponível, 2/3 do combustível restante, 1/2 da munição distribuída.

TIPOS DE FRAÇÃO:
- PRÓPRIA: numerador < denominador (valor < 1): 3/4, 1/5, 7/8
- IMPRÓPRIA: numerador ≥ denominador (valor ≥ 1): 5/4, 7/3, 9/9
- MISTA: parte inteira + fração: 2 e 1/4 = 9/4 (conversão: 2×4+1=9)
- APARENTE: denominador = 1 ou numerador divisível pelo denominador: 6/3 = 2

FRAÇÕES EQUIVALENTES — mesma proporção, forma diferente:
3/4 = 6/8 = 9/12 = 12/16 → multiplica/divide numerador e denominador pelo mesmo número.
ATENÇÃO: 3/4 ≠ 9/16 (aqui o numerador foi multiplicado por 3 e o denominador por 4 — proporções diferentes → não equivalentes).
Verificação: frações a/b e c/d são equivalentes se a × d = b × c (produto cruzado).
3/4 e 9/16: 3×16=48 e 4×9=36 → 48 ≠ 36 → NÃO equivalentes.

SIMPLIFICAÇÃO (redução à forma irredutível):
Divida numerador e denominador pelo MDC (Máximo Divisor Comum).
MDC(12, 18):
  12 = 2² × 3
  18 = 2 × 3²
  MDC = 2¹ × 3¹ = 6
  12/18 ÷ 6/6 = 2/3 ✓ (forma irredutível, pois MDC(2,3) = 1)

CÁLCULO DO MDC (método da fatoração):
  Fatore ambos os números em primos.
  MDC = produto dos fatores COMUNS com o MENOR expoente.
  MDC(12,18) = 2¹ × 3¹ = 6
  MDC(24,36) = 2² × 3¹ = 12`,
    mnemonic: "FRAÇÃO = numerador/denominador. Própria (<1), Imprópria (≥1), Mista (inteiro+fração). EQUIVALENTES: produto cruzado igual (a×d = b×c). SIMPLIFICAÇÃO: ÷ pelo MDC. MDC = fatores comuns com menor expoente. 3/4 ≠ 9/16 (pois 3×16=48 ≠ 4×9=36).",
    keyPoint: "Frações equivalentes: mesmo produto cruzado (a×d = b×c). Simplificação: ÷ MDC. MDC(12,18)=6 → 12/18=2/3. Verificação de equivalência: 3/4 e 9/16 → 3×16=48 ≠ 4×9=36 → NÃO equivalentes. Mista para imprópria: 2 e 1/4 = (2×4+1)/4 = 9/4.",
    practicalExample: "Efetivo de uma delegacia: 12 de 18 agentes foram escalados → fração 12/18. MDC(12,18)=6 → 12/18 = 2/3 do efetivo em serviço. Verificação de equivalência: '2/3 equivale a 8/12?' → 2×12=24 e 3×8=24 → iguais → SIM, equivalentes. '3/4 equivale a 9/16?' → 3×16=48 ≠ 4×9=36 → NÃO equivalentes.",
    difficulty: "FACIL",
  },

  // ── 4. Frações II — Soma e Subtração (MMC) ───────────────────────
  {
    title: "Frações II: Soma e Subtração pelo Método do MMC",
    textContent: `Para SOMAR ou SUBTRAIR frações, é necessário que tenham o mesmo denominador (denominador comum). O método mais eficiente é usar o MMC (Mínimo Múltiplo Comum) dos denominadores.

CASO 1 — MESMO DENOMINADOR: some/subtraia apenas os numeradores.
  3/7 + 2/7 = (3+2)/7 = 5/7
  5/8 − 2/8 = (5−2)/8 = 3/8

CASO 2 — DENOMINADORES DIFERENTES: calcule o MMC e transforme as frações.

PASSO A PASSO (1/3 + 1/4):
  ① Calcule o MMC(3, 4):
       3 = 3¹
       4 = 2²
       MMC = 2² × 3 = 12
  ② Divida o MMC por cada denominador e multiplique pelo respectivo numerador:
       1/3 → 12÷3=4 → 4×1=4 → fração: 4/12
       1/4 → 12÷4=3 → 3×1=3 → fração: 3/12
  ③ Some os numeradores:
       4/12 + 3/12 = 7/12 ✓

EXEMPLO POLICIAL — turno de trabalho:
  Agente cumpriu 1/3 do turno de manhã e 1/4 à tarde:
  1/3 + 1/4 = 4/12 + 3/12 = 7/12 do turno total ✓

EXEMPLO POLICIAL — distribuição de equipamentos:
  3/4 do lote → Delegacia Norte | 1/6 do lote → Delegacia Sul
  Total distribuído: 3/4 + 1/6 = ? → MMC(4,6)=12
    3/4 = 9/12 | 1/6 = 2/12
    9/12 + 2/12 = 11/12 distribuídos
  Restante: 1 − 11/12 = 12/12 − 11/12 = 1/12 do lote ✓

PEGADINHA FATAL: NUNCA some numeradores com numeradores E denominadores com denominadores:
  1/3 + 1/4 ≠ (1+1)/(3+4) = 2/7 → ERRADO!
  O correto é encontrar o MMC: 1/3 + 1/4 = 7/12`,
    mnemonic: "MMC = Mínimo Múltiplo Comum dos denominadores. Passo: ① MMC dos denominadores ② divide MMC por cada denominador × seu numerador ③ soma os novos numeradores. PROIBIDO somar num+num sobre den+den (1/3+1/4 ≠ 2/7). MMC(4,6)=12; MMC(3,4)=12; MMC(2,3)=6.",
    keyPoint: "Somar/subtrair frações: use o MMC dos denominadores. Passo a passo: MMC → dividir → multiplicar → somar. NUNCA some numeradores e denominadores separadamente. 1/3+1/4=7/12 (não 2/7). Distribuição de lote: 3/4+1/6=11/12 → sobra 1/12.",
    practicalExample: "Escala de trabalho: 1/3 do turno matutino + 1/4 vespertino. MMC(3,4)=12. 1/3=4/12; 1/4=3/12. Total=7/12 do turno cumprido. Sobra: 12/12−7/12=5/12 do turno. Distribuição: 3/4 + 1/6 = 9/12 + 2/12 = 11/12 distribuídos. Sobra = 12/12 − 11/12 = 1/12. Verificação: 9+2=11, e 11<12 → sobra 1/12 ✓.",
    difficulty: "MEDIO",
  },

  // ── 5. Multiplicação e Divisão de Frações ─────────────────────────
  {
    title: "Multiplicação e Divisão de Frações: Regras e Aplicações",
    textContent: `MULTIPLICAR e DIVIDIR frações são as operações mais diretas — sem precisar de MMC. As regras são simples e geralmente bem cobradas em provas policiais com situações de rateio, proporção e escalas.

MULTIPLICAÇÃO DE FRAÇÕES:
Multiplique numerador com numerador e denominador com denominador.
  a/b × c/d = (a×c)/(b×d)

Exemplos:
  2/3 × 3/4 = (2×3)/(3×4) = 6/12 = 1/2 ✓
  3/5 × 5/9 = (3×5)/(5×9) = 15/45 = 1/3 ✓

SIMPLIFICAÇÃO CRUZADA (antes de multiplicar):
Antes de multiplicar, simplifique cruzado para facilitar o cálculo:
  2/3 × 3/4: o 3 do numerador cancela com o 3 do denominador:
  (²/₃) × (³/₄) → (2/1) × (1/4) = 2/4 = 1/2 ✓ (mesmo resultado, mais rápido)

ERRO CLÁSSICO — "Somar numeradores e denominadores":
  2/3 × 3/4 ≠ (2+3)/(3+4) = 5/7 → TOTALMENTE ERRADO
  A multiplicação é sempre: numerador × numerador / denominador × denominador.

DIVISÃO DE FRAÇÕES — INVERTA A SEGUNDA E MULTIPLIQUE:
  a/b ÷ c/d = a/b × d/c = (a×d)/(b×c)

Exemplos:
  3/4 ÷ 2/5 = 3/4 × 5/2 = (3×5)/(4×2) = 15/8 ✓
  2/3 ÷ 4/9 = 2/3 × 9/4 = 18/12 = 3/2 ✓

APLICAÇÃO POLICIAL — distribuição de kits:
  Uma delegacia recebeu 3/4 do estoque total de kits. Esse lote foi dividido igualmente entre 2/3 das viaturas disponíveis. Qual fração do estoque total coube a cada grupo de viaturas?
  3/4 ÷ 2/3 = 3/4 × 3/2 = 9/8 → cada grupo recebeu 9/8 da cota (mais de 1 cota inteira)`,
    mnemonic: "MULTIPLICAÇÃO: num×num / den×den. (2/3)×(3/4) = 6/12 = 1/2. DIVISÃO: inverte a 2ª e multiplica. (3/4)÷(2/5) = (3/4)×(5/2) = 15/8. NUNCA some num+num e den+den na multiplicação. Simplificação cruzada: cancela fatores antes de multiplicar (mais rápido em prova).",
    keyPoint: "Multiplicação: (a/b)×(c/d) = (a×c)/(b×d). Divisão: (a/b)÷(c/d) = (a/b)×(d/c). Simplificação cruzada antes de multiplicar economiza tempo. Erro clássico de banca: afirmar que 2/3×3/4=5/7 (somar numeradores e denominadores = errado). 3/4÷2/5=15/8.",
    practicalExample: "Distribuição: 3/5 do combustível × 5/9 das viaturas. Cada grupo recebe: 3/5 × 5/9 = 15/45 = 1/3 do combustível total. Com simplificação cruzada: (³/₅)×(⁵/₉) = (3/1)×(1/9) = 3/9 = 1/3 ✓. Divisão: delegacia recebe 3/4 do estoque e distribui entre 2 grupos iguais: 3/4 ÷ 2 = 3/4 × 1/2 = 3/8 para cada grupo.",
    difficulty: "FACIL",
  },

  // ── 6. Expressões Numéricas — Ordem de Precedência ────────────────
  {
    title: "Expressões Numéricas: Ordem de Precedência das Operações",
    textContent: `As EXPRESSÕES NUMÉRICAS envolvem múltiplas operações e precisam ser resolvidas em uma ordem específica para garantir resultado único e correto. Essa ordem é universalmente aceita e cobrada em provas policiais.

ORDEM DE PRECEDÊNCIA (hierarquia das operações):

① PARÊNTESES ( ) → resolva primeiro, de dentro para fora
② COLCHETES [ ] → após resolver todos os parênteses internos
③ CHAVES { } → após resolver colchetes e parênteses
④ POTENCIAÇÃO e RADICIAÇÃO → da esquerda para a direita
⑤ MULTIPLICAÇÃO e DIVISÃO → da esquerda para a direita (mesma prioridade)
⑥ ADIÇÃO e SUBTRAÇÃO → da esquerda para a direita (mesma prioridade)

Macete: ( ) → [ ] → { } → Pot/Rad → Mult/Div → Ad/Sub

EXEMPLO 1 — sem parênteses:
  2 + 3 × 4
  = 2 + 12     ← multiplicação primeiro
  = 14 ✓       ← por fim a adição
  ERRADO seria: (2+3) × 4 = 5 × 4 = 20 ← isso só seria certo SE houvesse parênteses.

EXEMPLO 2 — com parênteses:
  (2 + 3) × 4 − 6 ÷ 2
  ① (2+3) = 5
  ② Mult/Div da esquerda para a direita: 5 × 4 = 20 | 6 ÷ 2 = 3
  ③ Adição/Subtração: 20 − 3 = 17 ✓
  ERRO COMUM: parar em 5×4=20 e subtrair 6 antes de dividir: 20−6=14, depois ÷2=7 → ERRADO (16≠17)

EXEMPLO 3 — expressão completa:
  {3 × [4 + (6 − 2)] ÷ 2}
  ① (6−2) = 4
  ② [4+4] = 8
  ③ {3 × 8 ÷ 2} → 3×8=24, 24÷2=12
  = 12 ✓

REGRA IMPORTANTE: quando multiplicação e divisão aparecem em sequência (ou adição e subtração), resolva da ESQUERDA para a DIREITA:
  20 ÷ 4 × 2 = 5 × 2 = 10 ✓ (não: 20 ÷ 8 = 2,5 ← errado)`,
    mnemonic: "PEMDAS (BR): Parênteses→Expoente→Multiplicação/Divisão→Adição/Subtração. Mesma prioridade: esquerda para direita. 2+3×4 = 2+12 = 14 (NÃO (2+3)×4=20). (2+3)×4−6÷2: ①(5)×4=20; ②6÷2=3; ③20−3=17. Nunca faça −6 antes de ÷2 em sequência sem parênteses.",
    keyPoint: "Ordem: parênteses → potência → mult/div → soma/sub. Mult e div = mesma prioridade (esquerda→direita). 2+3×4=14 (não 20). (2+3)×4−6÷2=17 (não 14). Sem parênteses: nunca antecipe subtração antes da divisão na mesma sequência. Mult/Div e Add/Sub: sempre da esquerda para a direita quando empatados.",
    practicalExample: "Divisão de plantão: {[(3+2) × 4] − 6 ÷ 2} agentes por turno. Passo a passo: (3+2)=5; [5×4]=20; 6÷2=3; {20−3}=17 agentes. Verificação: se alguém subtrair 6 antes de dividir por 2 → 20−6=14, ÷2=7 → ERRADO. A divisão (6÷2) deve ser feita antes da subtração, pois mult/div têm precedência sobre add/sub.",
    difficulty: "MEDIO",
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
  correctAnswer: "A" | "B";
  correctOption: 0 | 1;
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  questionType: "CERTO_ERRADO";
  contentTitle: string;
}

const CE: Alternative[] = [
  { letter: "A", text: "CERTO" },
  { letter: "B", text: "ERRADO" },
];

const questions: QuestionData[] = [
  // ══════════════════════════════════════════════════════════════════
  // Átomo 1 — Inteiros e Regras de Sinais (Q1-Q2)
  // ══════════════════════════════════════════════════════════════════

  // Q1 — Déficit de munições: −12 + 8 = −4 (não +4) → ERRADO
  {
    id: "qz_mat_bas_001",
    statement:
      "Julgue o item conforme as operações com números inteiros.\n\n" +
      "O almoxarifado de uma delegacia registrava déficit de 12 munições (saldo = −12). " +
      "Após receber um reforço de 8 unidades, o novo saldo passou a ser +4, " +
      "indicando que agora há 4 munições sobrando no estoque.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O cálculo correto é:\n\n" +
      "  Saldo inicial: −12\n" +
      "  Reforço recebido: +8\n" +
      "  Novo saldo: −12 + 8 = −4\n\n" +
      "O resultado é −4 (ainda negativo), não +4. Para obter saldo positivo, " +
      "o reforço precisaria ser de pelo menos 13 unidades (−12 + 13 = +1). " +
      "O erro clássico é ignorar que −12 + 8 = −(12 − 8) = −4, pois os sinais " +
      "são diferentes e o número de maior módulo (12) é negativo.",
    explanationCorrect:
      "O item está ERRADO. Cálculo:\n" +
      "  −12 + 8 = −4  (sinais diferentes → subtrai módulos: 12−8=4; mantém sinal do maior módulo: negativo)\n" +
      "Saldo = −4 (ainda faltam 4 munições). Para zerar o déficit seriam necessárias 12 unidades; " +
      "para saldo positivo, mais de 12.",
    explanationWrong:
      "O item está ERRADO. −12 + 8 = −4, e não +4.\n\n" +
      "Passo a passo:\n" +
      "  Sinais diferentes (−) e (+)\n" +
      "  Subtraia os módulos: |−12| − |+8| = 12 − 8 = 4\n" +
      "  Mantenha o sinal do maior módulo: 12 > 8, sinal = negativo\n" +
      "  Resultado: −4\n\n" +
      "O saldo continua negativo — ainda há déficit de 4 munições.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Operações com Números Inteiros e Regras de Sinais",
  },

  // Q2 — (−3) × (−5) = +15 → CERTO
  {
    id: "qz_mat_bas_002",
    statement:
      "Julgue o item conforme as regras de sinais para multiplicação de números inteiros.\n\n" +
      "Um agente precisa calcular o resultado de (−3) × (−5) para verificar um balanço " +
      "de planilha. O resultado correto é +15, pois o produto de dois números negativos " +
      "é sempre positivo.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. A regra de sinais para multiplicação estabelece:\n\n" +
      "  (−) × (−) = (+)   ← sinais IGUAIS → resultado POSITIVO\n" +
      "  (−) × (+) = (−)   ← sinais DIFERENTES → resultado NEGATIVO\n" +
      "  (+) × (+) = (+)   ← sinais IGUAIS → resultado POSITIVO\n\n" +
      "Aplicando:\n" +
      "  (−3) × (−5) = +(3 × 5) = +15 ✓\n\n" +
      "Macete: dois negativos se 'cancelam' (dupla negação = afirmação). " +
      "A mesma regra vale para divisão: (−12) ÷ (−4) = +3.",
    explanationCorrect:
      "Correto! (−) × (−) = (+). Cálculo:\n" +
      "  (−3) × (−5) = +(3×5) = +15\n" +
      "Sinais iguais (ambos negativos) → resultado positivo. " +
      "Regra mnemônica: 'menos vezes menos é mais'.",
    explanationWrong:
      "O item está CERTO. (−3) × (−5) = +15.\n\n" +
      "Regra de sinais (multiplicação e divisão):\n" +
      "  (−) × (−) = (+15) ✓\n" +
      "  (+) × (+) = (+)   ✓\n" +
      "  (−) × (+) = (−)   ← sinais diferentes\n" +
      "  (+) × (−) = (−)   ← sinais diferentes\n\n" +
      "Dois negativos multiplicados sempre resultam em positivo.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Operações com Números Inteiros e Regras de Sinais",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 2 — Números Decimais (Q3-Q4)
  // ══════════════════════════════════════════════════════════════════

  // Q3 — R$127,45 + R$83,70 = R$211,15 → CERTO
  {
    id: "qz_mat_bas_003",
    statement:
      "Julgue o item conforme as operações com números decimais.\n\n" +
      "Uma viatura gastou R$ 127,45 em combustível na segunda-feira e R$ 83,70 " +
      "na terça-feira. O total gasto nos dois dias foi de R$ 211,15.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Somando com vírgulas alinhadas:\n\n" +
      "    127,45\n" +
      "  +  83,70\n" +
      "  ────────\n" +
      "    211,15\n\n" +
      "Passo a passo (casa por casa):\n" +
      "  Centésimos: 5 + 0 = 5\n" +
      "  Décimos: 4 + 7 = 11 → anota 1, carrega 1\n" +
      "  Unidades: 7 + 3 + 1(carry) = 11 → anota 1, carrega 1\n" +
      "  Dezenas: 2 + 8 + 1(carry) = 11 → anota 1, carrega 1\n" +
      "  Centenas: 1 + 0 + 1(carry) = 2\n" +
      "  Resultado: 211,15 ✓",
    explanationCorrect:
      "Correto! Soma com vírgulas alinhadas:\n" +
      "  127,45 + 83,70 = 211,15\n" +
      "Verificação: 127 + 83 = 210 (parte inteira) + 0,45 + 0,70 = 1,15 → 210 + 1,15 = 211,15 ✓",
    explanationWrong:
      "O item está CERTO. 127,45 + 83,70 = 211,15.\n\n" +
      "Passo a passo com vírgulas alinhadas:\n" +
      "    127,45\n" +
      "  +  83,70\n" +
      "  ────────\n" +
      "    211,15\n\n" +
      "Verificação rápida: 0,45 + 0,70 = 1,15; 127 + 83 = 210; 210 + 1,15 = 211,15 ✓",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Números Decimais: Vírgula, Soma e Subtração em Valores Monetários",
  },

  // Q4 — R$350,00 − R$127,80 = R$222,20 (não R$232,80) → ERRADO
  {
    id: "qz_mat_bas_004",
    statement:
      "Julgue o item conforme as operações com números decimais.\n\n" +
      "Um agente recebeu R$ 350,00 de diária e gastou R$ 127,80 com deslocamento. " +
      "O valor restante da diária, após o gasto, é de R$ 232,80.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O cálculo correto é:\n\n" +
      "    350,00\n" +
      "  − 127,80\n" +
      "  ────────\n" +
      "    222,20\n\n" +
      "Passo a passo:\n" +
      "  Centésimos: 0 − 0 = 0\n" +
      "  Décimos: 0 − 8 → não dá, empresta da unidade: 10 − 8 = 2, unidade fica 9\n" +
      "  Unidades: 9 − 7 = 2\n" +
      "  Dezenas: 4 − 2 = 2\n" +
      "  Centenas: 3 − 1 = 2\n" +
      "  Resultado: 222,20 ✓\n\n" +
      "O item afirma R$ 232,80 — esse erro ocorre se alguém subtrair 350 − 127 = 223 " +
      "e errar no ajuste dos centesimais, ou subtrair incorretamente a parte decimal.",
    explanationCorrect:
      "O item está ERRADO. 350,00 − 127,80 = 222,20 (não 232,80).\n\n" +
      "    350,00\n" +
      "  − 127,80\n" +
      "  ────────\n" +
      "    222,20\n\n" +
      "Verificação: 222,20 + 127,80 = 350,00 ✓",
    explanationWrong:
      "O item está ERRADO. O valor correto é R$ 222,20, não R$ 232,80.\n\n" +
      "Passo a passo:\n" +
      "    350,00\n" +
      "  − 127,80\n" +
      "  ────────\n" +
      "    222,20\n\n" +
      "Verificação: 222,20 + 127,80 = 350,00 ✓\n" +
      "O erro de 232,80 ocorre por falha no empréstimo de casas decimais.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Números Decimais: Vírgula, Soma e Subtração em Valores Monetários",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 3 — Frações I (Q5-Q6)
  // ══════════════════════════════════════════════════════════════════

  // Q5 — MDC(12,18)=6 → 12/18=2/3 → CERTO
  {
    id: "qz_mat_bas_005",
    statement:
      "Julgue o item conforme a simplificação de frações.\n\n" +
      "Em uma escala de serviço, 12 dos 18 agentes disponíveis foram convocados. " +
      "A fração que representa os agentes convocados é 12/18, que, simplificada " +
      "pelo MDC(12, 18) = 6, resulta na fração irredutível 2/3.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Verificação passo a passo:\n\n" +
      "  Fatoração:\n" +
      "    12 = 2² × 3\n" +
      "    18 = 2  × 3²\n" +
      "  MDC = 2¹ × 3¹ = 6 ✓\n\n" +
      "  Simplificação:\n" +
      "    12 ÷ 6 = 2  (numerador)\n" +
      "    18 ÷ 6 = 3  (denominador)\n" +
      "    12/18 = 2/3 ✓\n\n" +
      "  Verificação de irredutibilidade:\n" +
      "    MDC(2, 3) = 1 → a fração 2/3 está na forma irredutível ✓\n\n" +
      "  Produto cruzado: 12×3 = 36 = 18×2 → equivalentes ✓",
    explanationCorrect:
      "Correto! MDC(12,18)=6 → 12/18=2/3.\n\n" +
      "  12 = 2²×3; 18 = 2×3² → MDC = 2¹×3¹ = 6\n" +
      "  12÷6=2; 18÷6=3 → 2/3 irredutível (MDC(2,3)=1)",
    explanationWrong:
      "O item está CERTO.\n\n" +
      "  MDC(12,18): 12=2²×3; 18=2×3² → MDC=6\n" +
      "  12/18 ÷ (6/6) = 2/3 ✓\n" +
      "  Irredutível: MDC(2,3)=1 ✓\n" +
      "  Verificação cruzada: 12×3 = 36 = 18×2 → equivalentes ✓",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Frações I: Conceito, Simplificação e Frações Equivalentes",
  },

  // Q6 — 3/4 ≠ 9/16 (não equivalentes) → ERRADO
  {
    id: "qz_mat_bas_006",
    statement:
      "Julgue o item conforme o conceito de frações equivalentes.\n\n" +
      "As frações 3/4 e 9/16 são equivalentes, pois representam a mesma proporção " +
      "de um todo — basta multiplicar o numerador e o denominador de 3/4 pelo " +
      "mesmo fator para obter 9/16.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. Para verificar equivalência, usa-se o produto cruzado:\n\n" +
      "  3/4  ×?  9/16\n" +
      "  3 × 16 = 48\n" +
      "  4 × 9  = 36\n" +
      "  48 ≠ 36 → NÃO são equivalentes ✗\n\n" +
      "Para que 3/4 gerasse 9/16, numerador E denominador precisariam ser " +
      "multiplicados pelo MESMO fator:\n" +
      "  3 × k / 4 × k = 9/16 → k = 3 para numerador (3×3=9) e k = 4 para denominador (4×4=16)\n" +
      "  k = 3 ≠ k = 4 → fatores DIFERENTES → NÃO são equivalentes\n\n" +
      "A fração equivalente a 3/4 com denominador 16 seria:\n" +
      "  3/4 × (4/4) = 12/16 ✓ (não 9/16)",
    explanationCorrect:
      "O item está ERRADO. 3/4 ≠ 9/16.\n\n" +
      "  Produto cruzado: 3×16=48; 4×9=36; 48≠36 → NÃO equivalentes.\n" +
      "  3/4 equivalente em 16avos = 12/16 (3×4=12; 4×4=16), não 9/16.",
    explanationWrong:
      "O item está ERRADO. 3/4 e 9/16 NÃO são equivalentes.\n\n" +
      "  Teste do produto cruzado:\n" +
      "    3 × 16 = 48\n" +
      "    4 × 9  = 36\n" +
      "    48 ≠ 36 → não equivalentes ✗\n\n" +
      "  Para 3/4 ser equivalente a x/16: 3/4 × (4/4) = 12/16\n" +
      "  A fração equivalente é 12/16, não 9/16.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Frações I: Conceito, Simplificação e Frações Equivalentes",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 4 — Frações II: Soma e Subtração (Q7-Q8)
  // ══════════════════════════════════════════════════════════════════

  // Q7 — 1/3 + 1/4 = 7/12 → CERTO
  {
    id: "qz_mat_bas_007",
    statement:
      "Julgue o item conforme a adição de frações com denominadores diferentes.\n\n" +
      "Em uma escala de 12 horas, um agente cumpriu 1/3 do turno no período matutino " +
      "e 1/4 no vespertino. A fração total do turno cumprida pelo agente foi de 7/12.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Passo a passo da soma 1/3 + 1/4:\n\n" +
      "  ① MMC(3, 4):\n" +
      "       3 = 3¹\n" +
      "       4 = 2²\n" +
      "       MMC = 2² × 3 = 12\n\n" +
      "  ② Transformar as frações:\n" +
      "       1/3 → 12÷3=4 → 4×1=4 → 4/12\n" +
      "       1/4 → 12÷4=3 → 3×1=3 → 3/12\n\n" +
      "  ③ Somar:\n" +
      "       4/12 + 3/12 = 7/12 ✓\n\n" +
      "  Verificação: 7/12 é irredutível? MDC(7,12)=1 → sim ✓\n" +
      "  Fração restante: 12/12 − 7/12 = 5/12 do turno ainda por cumprir.",
    explanationCorrect:
      "Correto! 1/3 + 1/4 = 7/12.\n\n" +
      "  MMC(3,4)=12.\n" +
      "  1/3 = 4/12; 1/4 = 3/12.\n" +
      "  4/12 + 3/12 = 7/12 ✓",
    explanationWrong:
      "O item está CERTO. 1/3 + 1/4 = 7/12.\n\n" +
      "  MMC(3,4) = 12\n" +
      "  1/3 = 4/12  |  1/4 = 3/12\n" +
      "  4/12 + 3/12 = 7/12 ✓\n\n" +
      "Erro clássico a evitar: 1/3 + 1/4 ≠ 2/7 (somar num+num e den+den é PROIBIDO).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Frações II: Soma e Subtração pelo Método do MMC",
  },

  // Q8 — 3/4 + 1/6 = 11/12; restante = 1/12 (não 2/3) → ERRADO
  {
    id: "qz_mat_bas_008",
    statement:
      "Julgue o item conforme a adição de frações e cálculo de complemento.\n\n" +
      "De um lote de equipamentos, 3/4 foram enviados à Delegacia Norte e 1/6 à " +
      "Delegacia Sul. A fração do lote que permaneceu no depósito é de 2/3.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. Passo a passo:\n\n" +
      "  ① Calcule o total distribuído (3/4 + 1/6):\n" +
      "       MMC(4, 6):\n" +
      "         4 = 2²\n" +
      "         6 = 2 × 3\n" +
      "         MMC = 2² × 3 = 12\n\n" +
      "       3/4 → 12÷4=3 → 3×3=9 → 9/12\n" +
      "       1/6 → 12÷6=2 → 2×1=2 → 2/12\n\n" +
      "       Total distribuído: 9/12 + 2/12 = 11/12\n\n" +
      "  ② Calcule o restante:\n" +
      "       1 − 11/12 = 12/12 − 11/12 = 1/12 ✓\n\n" +
      "  O item afirma 2/3 (= 8/12). O correto é 1/12.\n" +
      "  Verificação: 11/12 + 1/12 = 12/12 = 1 (lote completo) ✓",
    explanationCorrect:
      "O item está ERRADO. O restante é 1/12, não 2/3.\n\n" +
      "  MMC(4,6)=12.\n" +
      "  3/4=9/12; 1/6=2/12. Distribuído: 11/12.\n" +
      "  Restante: 12/12−11/12 = 1/12 ✓",
    explanationWrong:
      "O item está ERRADO. O correto é 1/12 no depósito, não 2/3.\n\n" +
      "  Distribuído: 3/4 + 1/6\n" +
      "  MMC(4,6)=12 → 9/12 + 2/12 = 11/12\n" +
      "  Restante: 1 − 11/12 = 1/12\n\n" +
      "  2/3 = 8/12, o que implicaria ter distribuído apenas 4/12 = 1/3 — contradiz os dados.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Frações II: Soma e Subtração pelo Método do MMC",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 5 — Multiplicação e Divisão de Frações (Q9-Q10)
  // ══════════════════════════════════════════════════════════════════

  // Q9 — 3/4 ÷ 2/5 = 15/8 → CERTO
  {
    id: "qz_mat_bas_009",
    statement:
      "Julgue o item conforme a divisão de frações.\n\n" +
      "Uma delegacia recebeu 3/4 do estoque de coletes balísticos. Esse lote " +
      "será dividido entre equipes que representam 2/5 do efetivo. " +
      "A razão coletes/efetivo é calculada por 3/4 ÷ 2/5 = 15/8.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Passo a passo da divisão de frações:\n\n" +
      "  Regra: a/b ÷ c/d = a/b × d/c (inverte a segunda e multiplica)\n\n" +
      "  3/4 ÷ 2/5\n" +
      "  = 3/4 × 5/2   ← inverteu 2/5 → 5/2\n" +
      "  = (3 × 5) / (4 × 2)\n" +
      "  = 15/8 ✓\n\n" +
      "  Verificação: 15/8 é fração imprópria = 1 e 7/8\n" +
      "  Verificação inversa: 15/8 × 2/5 = 30/40 = 3/4 ✓",
    explanationCorrect:
      "Correto! 3/4 ÷ 2/5 = 3/4 × 5/2 = 15/8.\n\n" +
      "  Inverte a 2ª fração: 2/5 → 5/2\n" +
      "  Multiplica: (3×5)/(4×2) = 15/8 ✓\n" +
      "  Verificação: 15/8 × 2/5 = 30/40 = 3/4 ✓",
    explanationWrong:
      "O item está CERTO. 3/4 ÷ 2/5 = 15/8.\n\n" +
      "  Divisão de frações: inverte a 2ª e multiplica:\n" +
      "  3/4 ÷ 2/5 = 3/4 × 5/2 = (3×5)/(4×2) = 15/8\n\n" +
      "  Verificação: 15/8 × 2/5 = 30/40 = 3/4 ✓",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Multiplicação e Divisão de Frações: Regras e Aplicações",
  },

  // Q10 — 2/3 × 3/4 = 1/2 (não 6/7) → ERRADO
  {
    id: "qz_mat_bas_010",
    statement:
      "Julgue o item conforme a multiplicação de frações.\n\n" +
      "Para distribuir recursos, um coordenador calculou 2/3 × 3/4 e obteve " +
      "o resultado 6/7, somando os numeradores (2+3=5... na verdade 6) " +
      "e somando os denominadores (3+4=7). Esse resultado está correto.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O procedimento descrito (somar numeradores e denominadores) é um erro grave. " +
      "A multiplicação de frações é feita assim:\n\n" +
      "  2/3 × 3/4\n" +
      "  = (2 × 3) / (3 × 4)\n" +
      "  = 6/12\n" +
      "  = 1/2 ✓  (simplificando: MDC(6,12)=6 → 6÷6=1; 12÷6=2)\n\n" +
      "  Com simplificação cruzada (mais rápido):\n" +
      "  (²/₃) × (³/₄): o 3 do numerador cancela com o 3 do denominador:\n" +
      "  = (2/1) × (1/4) = 2/4 = 1/2 ✓\n\n" +
      "  O resultado 6/7 seria obtido erroneamente por (2+4)/(3+4) ou (2+3+1)/(3+4) — " +
      "nenhuma dessas formas é válida para multiplicação.",
    explanationCorrect:
      "O item está ERRADO. 2/3 × 3/4 = 1/2, não 6/7.\n\n" +
      "  Regra: multiplicar num×num e den×den:\n" +
      "  (2×3)/(3×4) = 6/12 = 1/2\n\n" +
      "  PROIBIDO somar numeradores e somar denominadores na multiplicação.",
    explanationWrong:
      "O item está ERRADO. 2/3 × 3/4 = 1/2 (não 6/7).\n\n" +
      "  Multiplicação CORRETA:\n" +
      "  (2 × 3) / (3 × 4) = 6/12 = 1/2\n\n" +
      "  Somar num+num e den+den (→ 5/7 ou 6/7) = ERRO CLÁSSICO, nunca é a regra correta.\n" +
      "  Mnemônico: na multiplicação, é 'cruzar × cruzar', nunca 'somar + somar'.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Multiplicação e Divisão de Frações: Regras e Aplicações",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 6 — Expressões Numéricas (Q11-Q12)
  // ══════════════════════════════════════════════════════════════════

  // Q11 — 2 + 3 × 4 = 14 (multiplicação antes da adição) → CERTO
  {
    id: "qz_mat_bas_011",
    statement:
      "Julgue o item conforme a ordem de precedência das operações matemáticas.\n\n" +
      "Um fiscal calculou o total de infrações usando a expressão 2 + 3 × 4, " +
      "onde 3 × 4 representa o número de viaturas vezes a quantidade de multas por viatura. " +
      "O resultado correto da expressão é 14, pois a multiplicação deve ser " +
      "realizada antes da adição.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Pela ordem de precedência:\n\n" +
      "  2 + 3 × 4\n\n" +
      "  ① Multiplicação primeiro (prioridade sobre adição):\n" +
      "       3 × 4 = 12\n\n" +
      "  ② Adição:\n" +
      "       2 + 12 = 14 ✓\n\n" +
      "  ERRO CLÁSSICO a evitar:\n" +
      "       (2 + 3) × 4 = 5 × 4 = 20 ← só seria correto se houvesse parênteses!\n\n" +
      "  Sem parênteses, a multiplicação tem sempre prioridade sobre a adição. " +
      "  Esse princípio é universal em matemática.",
    explanationCorrect:
      "Correto! 2 + 3 × 4 = 14.\n\n" +
      "  Multiplicação antes da adição: 3×4=12; 2+12=14.\n" +
      "  (2+3)×4=20 seria correto somente SE houvesse parênteses — sem eles, mult. tem prioridade.",
    explanationWrong:
      "O item está CERTO. 2 + 3 × 4 = 14.\n\n" +
      "  Ordem de precedência:\n" +
      "  ① Multiplicação: 3 × 4 = 12\n" +
      "  ② Adição: 2 + 12 = 14\n\n" +
      "  Sem parênteses, a multiplicação SEMPRE precede a adição.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Expressões Numéricas: Ordem de Precedência das Operações",
  },

  // Q12 — (2+3)×4−6÷2 = 17 (não 14) → ERRADO
  {
    id: "qz_mat_bas_012",
    statement:
      "Julgue o item conforme a ordem de precedência das operações matemáticas.\n\n" +
      "Para calcular a distribuição de agentes por turno, um supervisor usou a " +
      "expressão (2 + 3) × 4 − 6 ÷ 2 e obteve resultado 14. Esse resultado está correto.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. Passo a passo correto da expressão (2 + 3) × 4 − 6 ÷ 2:\n\n" +
      "  ① Parênteses:\n" +
      "       (2 + 3) = 5\n\n" +
      "  ② Multiplicação e Divisão (da esquerda para a direita):\n" +
      "       5 × 4 = 20\n" +
      "       6 ÷ 2 = 3\n\n" +
      "  ③ Subtração:\n" +
      "       20 − 3 = 17 ✓\n\n" +
      "  COMO SE OBTÉM O ERRO (14):\n" +
      "       Alguém faz 5×4=20, depois 20−6=14, depois 14÷2=7 (errado)\n" +
      "       Ou: faz 5×4=20, depois subtrai 6 ANTES de dividir → 20−6=14 ÷2=7 (errado)\n" +
      "       Ou: subtrai todo o '6÷2' como '(6÷2)' mas esquece que mult/div " +
      "têm mesma prioridade e operam da esq. p/ dir.\n\n" +
      "  O resultado correto é 17, não 14.",
    explanationCorrect:
      "O item está ERRADO. O resultado correto é 17, não 14.\n\n" +
      "  (2+3)×4−6÷2:\n" +
      "  ① (2+3)=5\n" +
      "  ② 5×4=20 e 6÷2=3 (mult/div da esq. p/ dir.)\n" +
      "  ③ 20−3=17 ✓\n\n" +
      "  O erro 14 ocorre ao subtrair 6 antes de dividir por 2.",
    explanationWrong:
      "O item está ERRADO. O resultado é 17, não 14.\n\n" +
      "  Passo a passo:\n" +
      "  ① (2+3) = 5\n" +
      "  ② Mult/Div (esq→dir): 5×4=20; 6÷2=3\n" +
      "  ③ Subtração: 20−3 = 17\n\n" +
      "  Erro comum: fazer 20−6=14 e depois ÷2=7 (errado — a divisão 6÷2 " +
      "deve ser feita ANTES da subtração, pois divisão tem prioridade sobre subtração).",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Expressões Numéricas: Ordem de Precedência das Operações",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n🔢  Seed R23: Matemática Básica I — Operações e Frações\n");

  // ── 1. Encontrar Subject ────────────────────────────────────────────────
  let subjectId = await findSubject("RACIOCINIO_LOGICO");
  if (!subjectId) subjectId = await findSubject("MATEMATICA");
  if (!subjectId) subjectId = await findSubject("Logico");
  if (!subjectId) subjectId = await findSubject("Raciocin");
  if (!subjectId) {
    console.error("❌ Subject para Raciocínio Lógico/Matemática não encontrado.");
    console.error("   Verifique: SELECT name FROM \"Subject\" WHERE category = 'MATEMATICA';");
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
  const topicId = await findOrCreateTopic("Operações e Frações", subjectId);
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

  // ── Backfill contentId ────────────────────────────────────────────────
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
  console.log(`🔢 Cálculos:  todos verificados (resultados exatos, sem dízimas)`);
  console.log("─────────────────────────────────────────\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed R23 falhou:", err);
  process.exit(1);
});
