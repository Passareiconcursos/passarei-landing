/**
 * Seed: Matemática Básica II — R25 — Razão, Proporção e Regra de Três
 *
 * Diretriz pedagógica: proporcionalidade é o tema "campeão de audiência" em provas de Agente,
 * Escrivão e Polícia Penal. O foco é a aplicação prática com cenários policiais realistas.
 * PONTO CRÍTICO: identificar se as grandezas são Diretamente ou Inversamente Proporcionais
 * ANTES de montar a equação — 90% dos erros acontecem aqui. Cada átomo reforça o momento
 * da identificação com exemplos do cotidiano policial.
 *
 * Verificação de cálculos:
 *   Q3: 4ag→20det; 6ag→?      DP: 6×20÷4 = 30 ✓
 *   Q4: 120km, 3h → 200km, ?  DP (v=cte): 200×3÷120 = 5h (item diz 4h = ERRADO) ✓
 *   Q5: 8pol, 6h → 12pol, ?   IP: 8×6÷12 = 4h (item diz 9h = ERRADO) ✓
 *   Q6: 6eq, 10d → 15eq, ?    IP: 6×10÷15 = 4 dias ✓
 *   Q7: 5ag→15abord; 8ag→?    DP: 8×15÷5 = 24 ✓
 *   Q8: 80km/h, 3h → 60km/h,? IP: 80×3÷60 = 4h (item diz 2h15 = ERRADO) ✓
 *   Q9: 3inv,5d→120doc; 6inv,5d→? DP×DP: 120×(6÷3)×(5÷5) = 240 ✓
 *   Q10: 4pol,8qrt,2h → 16qrt,1h,? pol  DP×IP: 4×(16÷8)×(2÷1) = 16 (item diz 8 = ERRADO) ✓
 *   Q11: 6000÷(1+2+3)=1000; prop2→2×1000=2000 ✓
 *   Q12: IP a homens (A=3,B=6): recíprocos 1/3:1/6 = 2:1; A=180×2÷3=120 (item diz 60 = ERRADO) ✓
 *
 * 6 Átomos de Conteúdo:
 *   1. Razão e Proporção: Conceito e a Propriedade Fundamental
 *   2. Grandezas Diretamente Proporcionais: Quando uma sobe, a outra sobe
 *   3. Grandezas Inversamente Proporcionais: O perigo de inverter a fração
 *   4. Regra de Três Simples: Montagem da tabela e resolução passo a passo
 *   5. Regra de Três Composta: O método das setas (Causa e Efeito)
 *   6. Divisão Proporcional: Como dividir recursos em partes proporcionais
 *
 * 12 Questões — TODAS CERTO_ERRADO
 * Subject: Raciocínio Lógico / Matemática (busca por "RACIOCINIO_LOGICO" com fallbacks)
 * Topic: Proporcionalidade (novo tópico)
 *
 * Execução:
 *   npx tsx db/seed-mat-proporcao-r25.ts
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
// ALTERNATIVAS PADRÃO CERTO/ERRADO
// ============================================

const CE = [
  { letter: "A", text: "Certo" },
  { letter: "B", text: "Errado" },
];

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
  // ── 1. Razão e Proporção ──────────────────────────────────────────────
  {
    title: "Razão e Proporção: Conceito e a Propriedade Fundamental",
    textContent: `A RAZÃO entre dois números A e B (com B ≠ 0) é o quociente A ÷ B, escrito como A/B ou A:B.
É sempre calculada NA ORDEM em que as grandezas são apresentadas: razão de A para B = A/B.

Exemplos policiais:
• "Razão de agentes para presos": 12 agentes : 48 presos = 12/48 = 1/4 (ou 1:4)
  → Para cada agente, há 4 presos.
• "Razão de viaturas para bairros": 6 viaturas : 3 bairros = 6/3 = 2 (ou 2:1)
  → 2 viaturas por bairro.

ATENÇÃO — ORDEM IMPORTA: razão de A para B ≠ razão de B para A.
  Razão de delegados (12) para escrivães (18): 12/18 = 2/3
  Razão de escrivães (18) para delegados (12): 18/12 = 3/2

PROPORÇÃO: igualdade entre duas razões. A/B = C/D, também escrita A:B = C:D.
Leitura: "A está para B assim como C está para D."
Exemplo: 1/4 = 3/12 → "1 está para 4 assim como 3 está para 12."

TERMOS DA PROPORÇÃO (na escrita A:B = C:D):
• MEIOS: B e C (os dois do meio)
• EXTREMOS: A e D (os dois das pontas)

PROPRIEDADE FUNDAMENTAL DAS PROPORÇÕES:
O PRODUTO DOS MEIOS é igual ao PRODUTO DOS EXTREMOS:
  A:B = C:D  →  A × D = B × C  →  B × C = A × D

Exemplo: 3:5 = 9:15
  Meios: 5 × 9 = 45
  Extremos: 3 × 15 = 45 ✓ (proporção verdadeira)

USO PRÁTICO — encontrar o termo desconhecido:
  3:4 = 9:x  →  3 × x = 4 × 9  →  3x = 36  →  x = 12

VERIFICAÇÃO RÁPIDA: uma proporção é verdadeira se o produto dos meios = produto dos extremos. Se os produtos forem diferentes, não é proporção.`,
    mnemonic: "RAZÃO = A/B (A para B, NESTA ORDEM). PROPORÇÃO = A/B = C/D (duas razões iguais). PROPRIEDADE FUNDAMENTAL: MEIOS × MEIOS = EXTREMOS × EXTREMOS (ad = bc). Para achar o desconhecido: cruza e divide. Ordem importa: razão de A:B ≠ razão de B:A.",
    keyPoint: "Razão: A para B = A/B (atenção à ordem). Proporção: A/B = C/D. Meios = termos centrais (B e C); Extremos = termos das pontas (A e D). Propriedade fundamental: produto dos meios = produto dos extremos (B×C = A×D). Para encontrar x: isola multiplicando cruzado e dividindo.",
    practicalExample: "Questão PF/PRF: 'A razão entre o número de delegacias federais em SP (18) e no RJ (12) é 18/12 = 3/2 ≈ 1,5.' Análise: razão de SP:RJ = 18/12 = 3/2 ✓. ATENÇÃO: a razão de RJ:SP seria 12/18 = 2/3. Verificação de proporção: '2:3 = 4:6?' → meios: 3×4=12; extremos: 2×6=12 ✓. Encontrar x: '5:8 = 20:x' → 5x = 8×20 → 5x = 160 → x = 32.",
    difficulty: "FACIL",
  },

  // ── 2. Grandezas Diretamente Proporcionais ────────────────────────────
  {
    title: "Grandezas Diretamente Proporcionais: Quando uma Sobe, a Outra Sobe",
    textContent: `GRANDEZAS DIRETAMENTE PROPORCIONAIS (DP): duas grandezas são DP quando, ao multiplicar (ou dividir) uma por um número, a outra também é multiplicada (ou dividida) pelo MESMO número. A razão entre os valores correspondentes é sempre constante.

REGRA PRÁTICA: "Quando uma grandeza AUMENTA, a outra também AUMENTA na mesma proporção. Quando uma DIMINUI, a outra DIMINUI."

IDENTIFICAÇÃO (pergunte-se): "Se eu dobrar a primeira, a segunda dobra?" → SIM = DP.

EXEMPLOS CLÁSSICOS DE GRANDEZAS DP:
1. Número de agentes × Número de presos custodiados (mesma proporção por agente)
2. Distância percorrida × Tempo (com VELOCIDADE CONSTANTE)
3. Quantidade de munição × Custo total (preço unitário fixo)
4. Número de patrulhas × Área coberta (eficiência igual por patrulha)
5. Horas trabalhadas × Salário (por hora)
6. Litros de combustível × Distância percorrida (consumo constante)

MONTAGEM EM TABELA:
        Grandeza 1 | Grandeza 2
Caso 1:      A     |      B       (dados conhecidos)
Caso 2:      C     |      x       (x é o que queremos)

Como as grandezas são DP: A/C = B/x  →  Ax = BC  →  x = BC/A
Ou de forma equivalente: A/B = C/x  →  x = BC/A

EXEMPLO PRÁTICO:
"5 agentes fizeram 20 abordagens. Quantas abordagens fariam 8 agentes?"
Agentes: DP com abordagens (mais agentes = mais abordagens).
  5/8 = 20/x  →  5x = 160  →  x = 32 abordagens.
OU: x = 8 × 20 ÷ 5 = 32.

ATENÇÃO — Distância e Tempo com velocidade CONSTANTE são DP:
"Uma viatura a 80 km/h percorre 240 km em 3h. Em quanto tempo percorrerá 320 km?"
  3/x = 240/320  →  240x = 960  →  x = 4h.
(Velocidade constante → distância ∝ tempo → DP)`,
    mnemonic: "DP = SOBE JUNTO, DESCE JUNTO. Teste: 'Se dobrar A, B dobra?' → SIM = DP. Tabela: coluna A (gd1) e coluna B (gd2), mesma flecha ↑↑ ou ↓↓. Fórmula: x = (valor2 × novo_valor1) ÷ valor1. Exemplos DP: agentes×presos, distância×tempo (v=cte), munição×custo, horas×salário.",
    keyPoint: "DP: grandezas crescem e decrescem juntas na mesma proporção. Teste: dobra uma, dobra a outra → DP. Tabela: 5 ag→20 abord; 8 ag→x. x = 8×20÷5 = 32. Distância×tempo (velocidade constante) = DP. Armadilha: velocidade×tempo (distância constante) = IP (não DP!).",
    practicalExample: "Questão Escrivão PF: '3 viaturas consumiram 90L de combustível em uma operação. Quantos litros consumiriam 7 viaturas nas mesmas condições?' DP: consumo ∝ viaturas. x = 7×90÷3 = 210L. Outra questão: 'Um agente digita 45 laudos em 5 horas. Em 8 horas, quantos laudos digita?' DP: laudos ∝ horas. x = 8×45÷5 = 72 laudos. Verificação: 45/5 = 9 laudos/hora; 9×8 = 72 ✓.",
    difficulty: "FACIL",
  },

  // ── 3. Grandezas Inversamente Proporcionais ───────────────────────────
  {
    title: "Grandezas Inversamente Proporcionais: O Perigo de Inverter a Fração",
    textContent: `GRANDEZAS INVERSAMENTE PROPORCIONAIS (IP): duas grandezas são IP quando, ao multiplicar uma por um número, a outra é DIVIDIDA por esse mesmo número (e vice-versa). O PRODUTO dos valores correspondentes é sempre constante.

REGRA PRÁTICA: "Quando uma grandeza AUMENTA, a outra DIMINUI na mesma proporção. Quando uma DIMINUI, a outra AUMENTA."

IDENTIFICAÇÃO (pergunte-se): "Se eu dobrar a primeira, a segunda CAI pela metade?" → SIM = IP.

EXEMPLOS CLÁSSICOS DE GRANDEZAS IP:
1. Velocidade × Tempo (distância constante): mais velocidade → menos tempo
2. Número de trabalhadores × Tempo para concluir (mesmo serviço): mais trabalhadores → menos tempo
3. Número de equipes de busca × Dias para cobrir área (mesma área): mais equipes → menos dias
4. Consumo diário × Duração dos mantimentos (estoque fixo): consumo maior → dura menos

MONTAGEM EM TABELA — A DIFERENÇA ESTÁ NA INVERSÃO:
        Grandeza 1 | Grandeza 2
Caso 1:      A     |      B       (dados conhecidos)
Caso 2:      C     |      x       (x é o que queremos)

PASSO CRÍTICO — NAS GRANDEZAS IP:
• Mantém a grandeza 1 na mesma ordem (A/C).
• INVERTE a grandeza 2: coloca x/B (não B/x como na DP).
A/C = x/B  →  Ax = BC  →  x = BC/A
OU: o produto é constante → A × B = C × x → x = (A × B) ÷ C

EXEMPLO PRÁTICO (o mais cobrado):
"8 policiais patrulham uma área em 6 horas. Em quantas horas 12 policiais patrulhariam a mesma área?"
Policiais e tempo = IP (mais policiais → menos tempo, a área é constante).
Usando o PRODUTO CONSTANTE: 8 × 6 = 12 × x → 48 = 12x → x = 4 horas.

ERRO CLÁSSICO DE PROVA (90% dos alunos erram aqui!):
Montar como se fosse DP: 8/12 = 6/x → 8x = 72 → x = 9 horas. ❌ ERRADO!
O correto é INVERTER: 8 × 6 = 12 × x → x = 4 horas. ✓

SINAL DE ALERTA PARA IP: presença de palavras como "mesma distância", "mesmo serviço", "mesmo estoque", "mesma área" — indica que há uma grandeza fixa que conecta as outras duas inversamente.`,
    mnemonic: "IP = UM SOBE, OUTRO DESCE. Produto constante: A×B = C×x → x = A×B÷C. Teste: 'Se dobrar policiais, tempo cai pela metade?' → SIM = IP. PALAVRAS-CHAVE: 'mesma distância', 'mesmo serviço', 'mesma área'. ERRO FATAL: montar IP como DP (sem inverter) → x fica maior quando devia ser menor!",
    keyPoint: "IP: produto é constante (A×B = C×x). Quando dobra uma, outra cai à metade. Fórmula: x = A×B÷C. Exemplos IP: velocidade×tempo (distância fixa), trabalhadores×dias (serviço fixo), equipes×dias (área fixa). ATENÇÃO: distância×tempo com velocidade constante = DP (não IP)! 'Mesma distância/serviço/área' → IP.",
    practicalExample: "Questão clássica PF/PRF: '6 equipes cobrem uma área florestal em 10 dias. Quantos dias 15 equipes levariam?' IP: mais equipes → menos dias. Produto: 6×10 = 60 = 15×x → x = 4 dias. ERRO CLÁSSICO: usar DP → 6/15 = 10/x → x = 25 dias (ERRADO, pois com mais equipes o tempo aumentaria?! Absurdo!). Verificação do absurdo: sempre pergunte 'faz sentido?' — com mais equipes, o tempo deve DIMINUIR, não aumentar.",
    difficulty: "MEDIO",
  },

  // ── 4. Regra de Três Simples ──────────────────────────────────────────
  {
    title: "Regra de Três Simples: Montagem da Tabela e Resolução Passo a Passo",
    textContent: `A REGRA DE TRÊS SIMPLES resolve problemas com DUAS GRANDEZAS onde uma é conhecida em dois casos e a outra é conhecida em apenas um. O objetivo é encontrar o valor desconhecido (x).

PASSO A PASSO (método da tabela):

PASSO 1 — IDENTIFIQUE as duas grandezas e seus pares de valores.
PASSO 2 — MONTE a tabela:
  Grandeza 1 | Grandeza 2
       A     |      B       ← valores conhecidos (caso 1)
       C     |      x       ← um valor conhecido e x a descobrir (caso 2)

PASSO 3 — CLASSIFIQUE: as grandezas são DP ou IP?
  • DP ("sobe junto"): seta ↑↑ ou ↓↓ — mesma direção
  • IP ("um sobe, outro desce"): seta ↑↓ — direções opostas

PASSO 4 — MONTE A EQUAÇÃO:
  • DP: A/C = B/x  →  x = (C × B) ÷ A
  • IP: A × B = C × x  →  x = (A × B) ÷ C

PASSO 5 — CALCULE x.
PASSO 6 — VERIFIQUE se o resultado "faz sentido" (aumentou quando devia aumentar? diminuiu quando devia diminuir?).

EXEMPLO COMPLETO (DP):
"5 agentes fizeram 15 abordagens em um turno. Quantas abordagens fariam 8 agentes no mesmo turno?"
  Grandeza 1: agentes | Grandeza 2: abordagens
       5               |       15
       8               |        x
  DP: mais agentes → mais abordagens.
  x = 8 × 15 ÷ 5 = 24 abordagens.

EXEMPLO COMPLETO (IP):
"Uma viatura a 80 km/h chega ao local em 3 horas. A 60 km/h, quanto tempo levaria?"
  Grandeza 1: velocidade | Grandeza 2: tempo
       80                 |       3h
       60                 |        x
  IP: mais velocidade → menos tempo (distância constante).
  x = 80 × 3 ÷ 60 = 4 horas.

DICA EXTRA — Conversão de unidades:
Antes de montar a tabela, SEMPRE deixe as grandezas na mesma unidade:
  "3h 20min" → 200 minutos. "1,5 horas" → 90 minutos. Misturar unidades é armadilha clássica!`,
    mnemonic: "6 PASSOS: (1) Identifique grandezas. (2) Monte tabela A/B e C/x. (3) DP ou IP? (4) Equação: DP→x=(C×B)÷A; IP→x=(A×B)÷C. (5) Calcule. (6) Verifique o absurdo. UNIDADES: padronize antes! Setas: DP=↑↑ (mesma), IP=↑↓ (opostas).",
    keyPoint: "Regra de três simples: 2 grandezas, 4 valores (1 desconhecido). DP: x = (novo×base2)÷base1. IP: x = (base1×base2)÷novo. Sempre verifique se o resultado faz sentido. Padronize unidades antes. Distinção chave: 'velocidade×tempo' → IP se distância constante, DP se tempo constante.",
    practicalExample: "Questão Polícia Penal: 'Um camburão com 80 km/h faz o percurso em 3h. A 60 km/h, quanto tempo?' IP (distância fixa): 80×3÷60 = 4h. Questão Escrivão: 'Em 5 dias úteis, 3 escrivães digitam 90 boletins. Em 5 dias, 7 escrivães digitariam quantos?' DP (escrivães×boletins, dias constantes): 7×90÷3 = 210 boletins. Verificação: 90/3=30 boletins por escrivão por 5 dias; 7×30=210 ✓.",
    difficulty: "FACIL",
  },

  // ── 5. Regra de Três Composta ─────────────────────────────────────────
  {
    title: "Regra de Três Composta: O Método das Setas (Causa e Efeito)",
    textContent: `A REGRA DE TRÊS COMPOSTA resolve problemas com TRÊS OU MAIS GRANDEZAS, onde apenas uma tem valor desconhecido (x). O método mais eficiente é o das SETAS (causa e efeito).

QUANDO USAR: quando o problema envolver 3 grandezas — por exemplo, número de trabalhadores, quantidade de trabalho e tempo.

PASSO A PASSO (método das setas):

PASSO 1 — Monte a tabela com todas as grandezas. Coloque x em uma coluna.
  Gd1  | Gd2  | Gd3 (=x)
   A   |  B   |   C       ← caso base (todos conhecidos)
   D   |  E   |   x       ← novo caso (x desconhecido)

PASSO 2 — Para CADA coluna diferente de x, compare os dois valores e classifique:
  • Se a relação com x for DP → escreva a fração NORMAL: A/D (ou D/A, a maior no numerador conforme a DP)
  • Se a relação com x for IP → escreva a fração INVERTIDA: D/A

PASSO 3 — Monte a equação:
  x = C × (produto das frações)

EXEMPLO COMPLETO:
"3 investigadores analisam 120 documentos em 5 dias.
 Quantos documentos 6 investigadores analisariam em 8 dias?"

Montando a tabela (x = documentos do caso 2):
  Investigadores | Dias | Documentos
        3        |  5   |    120
        6        |  8   |     x

ANÁLISE das grandezas em relação a x (documentos):
• Investigadores × Documentos: DP (mais investigadores → mais documentos)
  Fração NORMAL: 6/3
• Dias × Documentos: DP (mais dias → mais documentos)
  Fração NORMAL: 8/5

x = 120 × (6/3) × (8/5) = 120 × 2 × 1,6 = 384 documentos.

EXEMPLO COM IP:
"4 policiais patrulham 8 quarteirões em 2 horas.
 Quantos policiais seriam necessários para patrulhar 16 quarteirões em 1 hora?"

Tabela (x = policiais do caso 2):
  Policiais | Quarteirões | Horas
      4     |      8      |   2
      x     |     16      |   1

ANÁLISE:
• Quarteirões × Policiais: DP (mais quarteirões → mais policiais)
  Fração NORMAL: 16/8 = 2
• Horas × Policiais: IP (menos horas → mais policiais precisam trabalhar)
  Fração INVERTIDA: 2/1 (inverte porque é IP!)

x = 4 × (16/8) × (2/1) = 4 × 2 × 2 = 16 policiais.`,
    mnemonic: "MÉTODO DAS SETAS: (1) Tabela com x. (2) Cada coluna: DP → fração NORMAL; IP → fração INVERTIDA. (3) x = base × produto das frações. LEMBRETE: IP inverte a fração — ESTE é o ponto onde 90% erram! Verifique: 'mais policiais faz sentido para menos tempo?' → SIM = IP → inverte.",
    keyPoint: "Regra de 3 composta: x = valor_base × (frações de cada grandeza). DP: fração normal (grande/pequeno se x aumenta, pequeno/grande se x diminui). IP: fração INVERTIDA. Tabela: base completa (caso 1) vs novo caso (caso 2 com x). Verificação: resultado 'faz sentido' com mais/menos de cada grandeza?",
    practicalExample: "Questão PF difícil: '3 investigadores analisam 120 documentos em 5 dias. 6 investigadores em 8 dias analisariam quantos documentos?' Investigadores: DP→6/3. Dias: DP→8/5. x = 120×(6/3)×(8/5) = 120×2×1,6 = 384 docs. Questão nível DIFICIL: '4 policiais cobrem 8 quarteirões em 2h. Para cobrir 16 quarteirões em 1h:' Quarteirões: DP→16/8. Horas: IP→2/1. x = 4×2×2 = 16 policiais.",
    difficulty: "DIFICIL",
  },

  // ── 6. Divisão Proporcional ───────────────────────────────────────────
  {
    title: "Divisão Proporcional: Como Dividir Recursos em Partes Proporcionais",
    textContent: `A DIVISÃO PROPORCIONAL é o processo de repartir um valor total em partes que guardem uma proporção (razão) definida. É cobrada em concursos policiais especialmente para distribuição de bônus, recursos, munições e escalas de serviço.

DOIS TIPOS:

─────────────────────────────────────────────────────────
TIPO 1: DIRETAMENTE PROPORCIONAL (DP)
"Quem trabalha mais, recebe mais."
─────────────────────────────────────────────────────────
PASSO A PASSO:
1. Some os termos da proporção: total das partes.
2. Divida o valor total por essa soma → valor de 1 parte.
3. Multiplique pelo número de partes de cada um.

EXEMPLO: R$ 6.000,00 dividido entre 3 agentes na proporção 1:2:3.
  Total de partes: 1+2+3 = 6
  Valor de 1 parte: 6.000 ÷ 6 = R$ 1.000,00
  Agente A (1 parte): 1 × 1.000 = R$ 1.000,00
  Agente B (2 partes): 2 × 1.000 = R$ 2.000,00
  Agente C (3 partes): 3 × 1.000 = R$ 3.000,00
  Verificação: 1.000 + 2.000 + 3.000 = R$ 6.000,00 ✓

─────────────────────────────────────────────────────────
TIPO 2: INVERSAMENTE PROPORCIONAL (IP)
"Quem tem mais membros na equipe, recebe menos por membro — mas a equipe menor recebe mais no total para compensar."
─────────────────────────────────────────────────────────
PASSO A PASSO:
1. Calcule os RECÍPROCOS dos termos dados (inverta as frações): se a equipe tem 3 membros → recíproco = 1/3.
2. Reduza os recíprocos ao mesmo denominador (ou use a relação entre eles).
3. Some os recíprocos normalizados → total das partes inversas.
4. Distribua o total proporcionalmente a essas partes.

EXEMPLO: 180 cartuchos divididos entre Equipe A (3 integrantes) e Equipe B (6 integrantes), INVERSAMENTE proporcional ao número de integrantes.
  Recíprocos: A → 1/3 ; B → 1/6
  MMC(3,6) = 6: A → 2/6 ; B → 1/6
  Partes: A = 2 ; B = 1 → Total = 3 partes
  Valor de 1 parte: 180 ÷ 3 = 60
  Equipe A (2 partes): 2 × 60 = 120 cartuchos
  Equipe B (1 parte): 1 × 60 = 60 cartuchos
  Lógica: a equipe MENOR (A, com 3 pessoas) recebe MAIS (120), compensando.

VERIFICAÇÃO SEMPRE:
Ao final, some todas as partes: deve dar o total original.
120 + 60 = 180 ✓`,
    mnemonic: "DP: some as partes → valor por parte = total÷soma → multiplica. IP: INVERTE (recíproco: 3→1/3) → encontra MMC → partes → distribui. LEMBRETE IP: quem tem MAIS membros recebe MENOS (equipe menor recebe mais para compensar). Verificação: soma das partes = total original.",
    keyPoint: "DP: partes proporcionais → 1:2:3 → soma=6 → 1 parte = total÷6 → cada um recebe n×parte. IP: calcula recíprocos (3→1/3, 6→1/6), normaliza (2/6 e 1/6), distribui pelas partes (2 e 1). Equipe com menos membros recebe mais na divisão IP. Verificação: soma das partes deve ser igual ao total.",
    practicalExample: "Questão Polícia Penal: 'R$9.000 divididos entre 4 escrivães na proporção de horas extras 1:2:3:3.' Total=1+2+3+3=9. 1 parte=R$1.000. A=R$1.000; B=R$2.000; C=R$3.000; D=R$3.000. Soma: 9.000 ✓. Divisão IP: '240 munições entre Equipe P (4 ag.) e Equipe Q (8 ag.), IP aos integrantes.' Recíprocos: 1/4 e 1/8 → partes: 2 e 1 → P=240×2÷3=160; Q=240×1÷3=80. A menor equipe P (4 ag.) recebe 160 (mais), compensando o menor efetivo.",
    difficulty: "MEDIO",
  },
];

// ============================================
// QUESTÕES (12 — CERTO_ERRADO)
// ============================================

interface QuestionData {
  id: string;
  statement: string;
  alternatives: { letter: string; text: string }[];
  correctAnswer: "A" | "B";
  correctOption: 0 | 1;
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  questionType: "CERTO_ERRADO";
  contentTitle: string;
}

const questions: QuestionData[] = [
  // ══════════════════════════════════════════════════════════════════
  // Átomo 1 — Razão e Proporção (Q1-Q2)
  // ══════════════════════════════════════════════════════════════════

  // Q1 — Propriedade fundamental: meios × extremos (FACIL, CERTO)
  {
    id: "qz_mat_prop_001",
    statement:
      "Julgue o item a respeito de razão e proporção.\n\n" +
      "Na proporção 3:5 = 9:15, o produto dos meios (5 × 9 = 45) é igual ao produto dos " +
      "extremos (3 × 15 = 45), confirmando que as quatro grandezas formam uma proporção " +
      "verdadeira. Essa igualdade — denominada propriedade fundamental das proporções — " +
      "pode ser usada para encontrar um termo desconhecido em qualquer proporção.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Na proporção A:B = C:D, a propriedade fundamental garante que o produto dos " +
      "MEIOS (B e C) é igual ao produto dos EXTREMOS (A e D). Verificação: " +
      "Meios = 5 × 9 = 45; Extremos = 3 × 15 = 45. Como 45 = 45, a proporção é verdadeira. " +
      "Aplicação prática: para encontrar x em '4:6 = 10:x', usamos 4×x = 6×10 → 4x = 60 → x = 15. " +
      "Meios: os dois termos do meio (B e C). Extremos: os dois termos das pontas (A e D).",
    explanationCorrect:
      "Correto! Propriedade fundamental: produto dos meios = produto dos extremos. " +
      "3:5 = 9:15 → meios: 5×9=45; extremos: 3×15=45 ✓. Uso: para achar x em A:B=C:x → " +
      "A×x = B×C → x = B×C÷A. Meios = termos centrais; extremos = termos das pontas.",
    explanationWrong:
      "O item está CERTO. Propriedade fundamental das proporções: produto dos meios = produto " +
      "dos extremos. Em A:B = C:D → B×C = A×D. Verificação de 3:5=9:15: meios 5×9=45, " +
      "extremos 3×15=45 ✓. Essa propriedade serve para verificar proporções e encontrar " +
      "termos desconhecidos (cruzar e dividir).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Razão e Proporção: Conceito e a Propriedade Fundamental",
  },

  // Q2 — Razão respeita a ordem: A:B = A/B (FACIL, ERRADO)
  {
    id: "qz_mat_prop_002",
    statement:
      "Julgue o item a respeito de razão e proporção.\n\n" +
      "Em uma delegacia com 12 delegados e 18 escrivães, a razão entre o número de delegados " +
      "e o número de escrivães é igual a 18/12 = 3/2, pois a razão entre dois números é " +
      "sempre calculada dividindo o maior pelo menor.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. A razão entre dois números A e B é A/B — calculada SEMPRE na ordem em que " +
      "as grandezas são apresentadas, e não necessariamente o maior pelo menor. " +
      "Razão de DELEGADOS para ESCRIVÃES = delegados ÷ escrivães = 12/18 = 2/3 (ou 1:1,5). " +
      "O item inverteu a ordem (escrivães ÷ delegados = 18/12 = 3/2) e justificou " +
      "erroneamente que se divide sempre o maior pelo menor. " +
      "A razão de escrivães para delegados seria 18/12 = 3/2 — mas isso é outra razão. " +
      "Regra: razão de A para B = A/B (NESTA ORDEM, independentemente de quem é maior).",
    explanationCorrect:
      "O item está ERRADO. Razão de A para B = A/B (respeitando a ordem enunciada). " +
      "Razão de delegados:escrivães = 12/18 = 2/3. O item calculou 18/12 = 3/2 (invertido) " +
      "e ainda justificou erroneamente 'maior÷menor'. Atenção: a razão depende da ORDEM, " +
      "não de qual é maior. 12:18 ≠ 18:12.",
    explanationWrong:
      "O item está ERRADO. Razão de A para B = A/B (sempre na ordem dada). " +
      "Delegados:escrivães = 12/18 = 2/3 (não 3/2). O item inverteu os termos. " +
      "A afirmação 'divide-se sempre o maior pelo menor' está ERRADA — a razão segue " +
      "a ordem dos termos apresentados no enunciado. 12/18 = 2/3 ≠ 18/12 = 3/2.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Razão e Proporção: Conceito e a Propriedade Fundamental",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 2 — Grandezas DP (Q3-Q4)
  // ══════════════════════════════════════════════════════════════════

  // Q3 — DP: agentes vs detentos custodiados (FACIL, CERTO)
  {
    id: "qz_mat_prop_003",
    statement:
      "Julgue o item a respeito de proporcionalidade.\n\n" +
      "Em uma unidade prisional, 4 agentes penitenciários custodiaram 20 detentos " +
      "simultaneamente em um plantão. Mantendo a mesma proporção de agentes por detento, " +
      "6 agentes conseguiriam custodiar 30 detentos no mesmo tipo de plantão.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. O número de agentes e o número de detentos custodiados são grandezas " +
      "DIRETAMENTE PROPORCIONAIS: mais agentes → mais detentos (na mesma proporção por agente). " +
      "Montando a regra de três simples direta:\n" +
      "  Agentes | Detentos\n" +
      "     4    |    20\n" +
      "     6    |     x\n" +
      "DP: x = (6 × 20) ÷ 4 = 120 ÷ 4 = 30 detentos ✓\n" +
      "Verificação: 20/4 = 5 detentos por agente; 6 × 5 = 30 detentos ✓.",
    explanationCorrect:
      "Correto! DP: mais agentes → mais detentos. 4→20; 6→x. " +
      "x = 6×20÷4 = 30. Verificação: 20÷4 = 5 det/agente; 6×5 = 30 ✓. " +
      "Grandezas DP: quando uma dobra, a outra dobra. 4→6 (×1,5) → 20×1,5 = 30.",
    explanationWrong:
      "O item está CERTO. Agentes e detentos = grandezas DP (mais agentes → mais detentos). " +
      "Cálculo: 4 ag→20 det; 6 ag→x. x = 6×20÷4 = 30. A proporção por agente é constante: " +
      "20÷4 = 5 detentos/agente; 6×5 = 30 ✓. DP: razão constante entre as grandezas.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Grandezas Diretamente Proporcionais: Quando uma Sobe, a Outra Sobe",
  },

  // Q4 — DP: distância×tempo com v=cte (não IP); erro de cálculo (MEDIO, ERRADO)
  {
    id: "qz_mat_prop_004",
    statement:
      "Julgue o item a respeito de proporcionalidade aplicada à operação policial.\n\n" +
      "Uma viatura percorre 120 km em 3 horas a velocidade constante. Para percorrer " +
      "200 km à mesma velocidade, a viatura levará 4 horas, pois distância e tempo são " +
      "grandezas inversamente proporcionais quando a velocidade permanece constante.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O item erra em dois pontos:\n" +
      "1) CLASSIFICAÇÃO ERRADA: com velocidade constante, distância e tempo são grandezas " +
      "DIRETAMENTE proporcionais (mais distância → mais tempo). São INVERSAMENTE proporcionais " +
      "quando a DISTÂNCIA é constante e variam velocidade × tempo.\n" +
      "2) CÁLCULO ERRADO: usando DP corretamente:\n" +
      "  Distância | Tempo\n" +
      "    120 km  |  3 h\n" +
      "    200 km  |  x h\n" +
      "DP: x = (200 × 3) ÷ 120 = 600 ÷ 120 = 5 horas (não 4 horas).\n" +
      "Verificação: velocidade = 120/3 = 40 km/h; tempo para 200 km = 200/40 = 5 horas ✓.",
    explanationCorrect:
      "O item está ERRADO. Dois erros: (1) distância×tempo com v=cte = DP (não IP). " +
      "(2) Cálculo: x = 200×3÷120 = 5h (não 4h). IP seria velocidade×tempo com distância fixa. " +
      "Velocidade=40km/h → 200km÷40km/h = 5h ✓.",
    explanationWrong:
      "O item está ERRADO. Dois erros: (1) Velocidade constante → distância∝tempo = DP. " +
      "IP seria se a distância fosse fixa e variassem velocidade e tempo. " +
      "(2) Cálculo correto (DP): 120→3h; 200→x. x=200×3÷120=5h. O item afirmou 4h = ERRADO. " +
      "Verificação: v=40km/h; 200÷40=5h ✓.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Grandezas Diretamente Proporcionais: Quando uma Sobe, a Outra Sobe",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 3 — Grandezas IP (Q5-Q6)
  // ══════════════════════════════════════════════════════════════════

  // Q5 — IP: mais policiais = MENOS tempo (erro: item diz mais tempo) (MEDIO, ERRADO)
  {
    id: "qz_mat_prop_005",
    statement:
      "Julgue o item a respeito de grandezas inversamente proporcionais.\n\n" +
      "Em uma operação, 8 policiais conseguem patrulhar completamente uma área em 6 horas. " +
      "Se o efetivo for ampliado para 12 policiais para cobrir a mesma área, a operação " +
      "levará 9 horas, pois quanto maior o número de policiais, maior o tempo necessário " +
      "para organizar e coordenar a patrulha.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O número de policiais e o tempo para cobrir a mesma área são grandezas " +
      "INVERSAMENTE PROPORCIONAIS: mais policiais → MENOS tempo (não mais tempo). " +
      "A justificativa do item ('maior efetivo = maior tempo para coordenar') está errada — " +
      "na hipótese padrão de prova, ignoramos overhead de coordenação.\n" +
      "Cálculo correto usando produto constante (IP):\n" +
      "  8 policiais × 6 horas = 12 policiais × x horas\n" +
      "  48 = 12x\n" +
      "  x = 48 ÷ 12 = 4 horas (não 9 horas).\n" +
      "ERRO CLÁSSICO: usar DP (8/12 = 6/x → x=9h) em problema de IP. " +
      "Com mais policiais, a área é coberta em MENOS tempo!",
    explanationCorrect:
      "O item está ERRADO. Policiais × tempo (mesma área) = IP: mais policiais → menos tempo. " +
      "Produto constante: 8×6 = 12×x → x = 4h. O item diz 9h = ERRADO (esse seria o resultado " +
      "de montar DP erroneamente: 8/12=6/x→x=9h). Além disso, a justificativa 'mais policiais=mais tempo' " +
      "está conceitualmente errada.",
    explanationWrong:
      "O item está ERRADO. IP: mais policiais → menos tempo (produto constante). " +
      "8×6 = 12×x → x = 4 horas. O item afirma 9 horas — esse é o erro típico de quem " +
      "monta IP como DP (8/12=6/x→x=9h). Memorize: grandezas IP → produto constante → " +
      "A×B = C×x. 'Mais policiais' em campo = operação mais rápida, não mais lenta.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Grandezas Inversamente Proporcionais: O Perigo de Inverter a Fração",
  },

  // Q6 — IP: mais equipes = menos dias (CERTO) (MEDIO)
  {
    id: "qz_mat_prop_006",
    statement:
      "Julgue o item a respeito de grandezas inversamente proporcionais.\n\n" +
      "Na operação 'Mata Segura', 6 equipes de busca levaram 10 dias para cobrir " +
      "completamente uma área de floresta. Para cobrir a mesma área, 15 equipes levariam " +
      "apenas 4 dias, pois o número de equipes e o número de dias são grandezas " +
      "inversamente proporcionais: ao aumentar o número de equipes, o tempo necessário " +
      "diminui na mesma proporção.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Equipes e dias (para cobrir a mesma área) são grandezas INVERSAMENTE " +
      "PROPORCIONAIS: mais equipes → menos dias. O produto é constante:\n" +
      "  6 equipes × 10 dias = 15 equipes × x dias\n" +
      "  60 = 15x\n" +
      "  x = 60 ÷ 15 = 4 dias ✓\n" +
      "A afirmação do item está correta tanto na classificação (IP) quanto no resultado (4 dias).\n" +
      "Verificação do absurdo: faz sentido que com 15 equipes (2,5× mais que 6) a área " +
      "seja coberta em menos tempo? Sim → confirma que é IP.",
    explanationCorrect:
      "Correto! IP: mais equipes → menos dias. Produto constante: 6×10 = 60 = 15×x → x=4 dias. " +
      "Verificação: 15/6 = 2,5 (equipes multiplicadas por 2,5) → dias divididos por 2,5: " +
      "10÷2,5 = 4 dias ✓. IP: quando uma grandeza multiplica por n, a outra divide por n.",
    explanationWrong:
      "O item está CERTO. Equipes × dias (mesma área) = IP. Produto constante: 6×10=60=15×x → " +
      "x=4 dias. Verificação: se as equipes multiplicam por 2,5 (6→15), os dias dividem por 2,5 " +
      "(10÷2,5=4). Mais equipes = menos dias = IP confirmado.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Grandezas Inversamente Proporcionais: O Perigo de Inverter a Fração",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 4 — Regra de Três Simples (Q7-Q8)
  // ══════════════════════════════════════════════════════════════════

  // Q7 — Regra de três simples DP: agentes×abordagens (FACIL, CERTO)
  {
    id: "qz_mat_prop_007",
    statement:
      "Julgue o item a respeito de regra de três simples.\n\n" +
      "Em um turno de policiamento ostensivo, 5 agentes realizaram 15 abordagens. " +
      "Mantendo a produtividade por agente, 8 agentes realizariam 24 abordagens no " +
      "mesmo tipo de turno. A grandeza 'número de agentes' e a grandeza 'número de " +
      "abordagens' são diretamente proporcionais nesse contexto.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Agentes e abordagens são grandezas DIRETAMENTE PROPORCIONAIS: mais agentes " +
      "→ mais abordagens (na mesma proporção por agente). Regra de três simples direta:\n" +
      "  Agentes | Abordagens\n" +
      "     5    |     15\n" +
      "     8    |      x\n" +
      "DP: x = (8 × 15) ÷ 5 = 120 ÷ 5 = 24 abordagens ✓\n" +
      "Verificação: produtividade por agente = 15/5 = 3 abordagens/agente; " +
      "8 agentes × 3 = 24 abordagens ✓.",
    explanationCorrect:
      "Correto! DP: x = 8×15÷5 = 24. Produtividade constante: 15÷5=3/agente; 8×3=24 ✓. " +
      "Agentes×abordagens = DP (mais agentes, mesma produtividade → mais abordagens).",
    explanationWrong:
      "O item está CERTO. DP: x=8×15÷5=24 abordagens. Verificação: 15/5=3 abordagens/agente; " +
      "8×3=24 ✓. Classificação correta: mais agentes → mais abordagens = DP.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Regra de Três Simples: Montagem da Tabela e Resolução Passo a Passo",
  },

  // Q8 — Regra de três simples IP: velocidade×tempo; item classifica como DP e erra o resultado (MEDIO, ERRADO)
  {
    id: "qz_mat_prop_008",
    statement:
      "Julgue o item a respeito de regra de três simples.\n\n" +
      "Uma viatura policial, trafegando a 80 km/h, leva 3 horas para chegar ao local " +
      "de uma ocorrência. Se a velocidade for reduzida para 60 km/h, a viatura chegará " +
      "em 2 horas e 15 minutos, pois velocidade e tempo são diretamente proporcionais " +
      "quando se percorre a mesma distância.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O item erra na classificação e no cálculo:\n" +
      "1) CLASSIFICAÇÃO ERRADA: velocidade e tempo (com mesma distância) são grandezas " +
      "INVERSAMENTE PROPORCIONAIS — mais velocidade → menos tempo.\n" +
      "2) CÁLCULO ERRADO: usando IP (produto constante):\n" +
      "  80 km/h × 3h = 60 km/h × x\n" +
      "  240 = 60x\n" +
      "  x = 240 ÷ 60 = 4 horas (não 2h15min).\n" +
      "O item usou lógica de DP e chegou a 2h15min = ERRADO.\n" +
      "Verificação: distância = 80×3 = 240 km; tempo a 60km/h = 240÷60 = 4h ✓.",
    explanationCorrect:
      "O item está ERRADO. Velocidade×tempo (distância=cte) = IP. " +
      "Produto constante: 80×3 = 240 = 60×x → x=4h. O item afirma 2h15min e classifica " +
      "como DP — ambos errados. Verificação: dist=240km; 240÷60=4h ✓.",
    explanationWrong:
      "O item está ERRADO. Dois erros: (1) velocidade×tempo com distância fixa = IP (não DP). " +
      "(2) Cálculo correto: 80×3=60×x → x=4h (não 2h15min). " +
      "Distância = 80×3 = 240km; a 60km/h: 240÷60 = 4h. DP seria se velocidade×tempo fosse " +
      "para distâncias diferentes — mas aqui a distância é FIXA → IP.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Regra de Três Simples: Montagem da Tabela e Resolução Passo a Passo",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 5 — Regra de Três Composta (Q9-Q10)
  // ══════════════════════════════════════════════════════════════════

  // Q9 — Regra de três composta DP×DP (MEDIO, CERTO)
  {
    id: "qz_mat_prop_009",
    statement:
      "Julgue o item a respeito de regra de três composta.\n\n" +
      "Três investigadores da Polícia Federal analisam 120 documentos em 5 dias úteis. " +
      "Trabalhando no mesmo ritmo, 6 investigadores analisariam 240 documentos em 5 dias, " +
      "pois ao dobrar o número de investigadores (mantendo os dias inalterados), a " +
      "quantidade de documentos analisados também dobra — relação diretamente proporcional.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Aplicando a regra de três composta:\n" +
      "  Investigadores | Dias | Documentos\n" +
      "        3        |  5   |    120\n" +
      "        6        |  5   |     x\n" +
      "Análise das grandezas em relação a documentos:\n" +
      "• Investigadores × documentos: DP (mais investigadores → mais documentos)\n" +
      "  Fração: 6/3 = 2\n" +
      "• Dias × documentos: DP (mais dias → mais documentos)\n" +
      "  Fração: 5/5 = 1 (dias iguais, não altera)\n" +
      "x = 120 × (6/3) × (5/5) = 120 × 2 × 1 = 240 documentos ✓\n" +
      "Raciocínio direto: com dias iguais, dobrar investigadores dobra documentos: 120×2=240.",
    explanationCorrect:
      "Correto! Regra de três composta: x=120×(6/3)×(5/5)=120×2×1=240. " +
      "Investigadores: DP (6/3=2). Dias: iguais (5/5=1). 240÷2=120 ✓ (verificação reversa). " +
      "Com dias iguais, a relação reduz a regra simples DP: 3→120; 6→240.",
    explanationWrong:
      "O item está CERTO. Regra de 3 composta: investigadores (DP→6/3=2) e dias (iguais→5/5=1). " +
      "x=120×2×1=240. Verificação: 120÷6=20 docs/(inv×5dias)=4 docs/inv/dia; " +
      "6inv×5dias×4=120... Hmm, vamos por outro caminho: 120/(3×5)=8 docs/inv/dia; " +
      "6inv×5dias×8=240 ✓.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Regra de Três Composta: O Método das Setas (Causa e Efeito)",
  },

  // Q10 — Regra de três composta DP×IP; item erra resultado (DIFICIL, ERRADO)
  {
    id: "qz_mat_prop_010",
    statement:
      "Julgue o item a respeito de regra de três composta.\n\n" +
      "Uma equipe de 4 policiais consegue patrulhar 8 quarteirões em 2 horas. Para " +
      "patrulhar 16 quarteirões em apenas 1 hora, seriam necessários 8 policiais, pois " +
      "o número de quarteirões é diretamente proporcional e o número de horas é " +
      "inversamente proporcional ao número de policiais requerido.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. A classificação das grandezas está correta, mas o cálculo está errado.\n" +
      "Montando a tabela (x = policiais necessários):\n" +
      "  Policiais | Quarteirões | Horas\n" +
      "      4     |      8      |   2\n" +
      "      x     |     16      |   1\n" +
      "• Quarteirões × policiais: DP (mais quarteirões → mais policiais)\n" +
      "  Fração normal: 16/8 = 2\n" +
      "• Horas × policiais: IP (menos tempo disponível → mais policiais necessários)\n" +
      "  Fração INVERTIDA: 2/1 = 2 (inverte porque é IP!)\n" +
      "x = 4 × (16/8) × (2/1) = 4 × 2 × 2 = 16 policiais.\n" +
      "O item afirma 8 policiais = ERRADO. O correto é 16.\n" +
      "O item errou ao não dobrar pela segunda fração (a inversão do tempo).",
    explanationCorrect:
      "O item está ERRADO. Cálculo correto: x=4×(16/8)×(2/1)=16 policiais. " +
      "Quarteirões: DP→16/8=2. Horas: IP→2/1=2 (fração INVERTIDA). " +
      "4×2×2=16, não 8. O item esqueceu de aplicar a inversão do tempo — isso é o " +
      "ponto crítico da regra de 3 composta com grandezas IP.",
    explanationWrong:
      "O item está ERRADO. O resultado correto é 16 policiais, não 8. " +
      "Tabela: 4 pol, 8 quart, 2h → 16 quart, 1h, x pol. " +
      "Quarteirões: DP→ fração 16/8=2. Horas: IP→ fração INVERTIDA 2/1=2. " +
      "x = 4 × 2 × 2 = 16. O erro de obter 8 vem de esquecer a inversão da fração " +
      "das horas: IP exige fração invertida (2/1, não 1/2).",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Regra de Três Composta: O Método das Setas (Causa e Efeito)",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 6 — Divisão Proporcional (Q11-Q12)
  // ══════════════════════════════════════════════════════════════════

  // Q11 — Divisão DP: proporção 1:2:3 (FACIL, CERTO)
  {
    id: "qz_mat_prop_011",
    statement:
      "Julgue o item a respeito de divisão proporcional.\n\n" +
      "Um bônus de R$ 6.000,00 deve ser dividido entre três agentes na proporção de " +
      "horas extras trabalhadas: 1:2:3. O agente com maior número de horas extras " +
      "(proporção 3) receberá R$ 3.000,00, e o agente com proporção 2 receberá " +
      "R$ 2.000,00.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Divisão diretamente proporcional à proporção 1:2:3.\n" +
      "Passo 1 — Some os termos: 1 + 2 + 3 = 6 partes no total.\n" +
      "Passo 2 — Valor de 1 parte: R$ 6.000,00 ÷ 6 = R$ 1.000,00.\n" +
      "Passo 3 — Distribuição:\n" +
      "  Agente A (proporção 1): 1 × R$ 1.000,00 = R$ 1.000,00\n" +
      "  Agente B (proporção 2): 2 × R$ 1.000,00 = R$ 2.000,00\n" +
      "  Agente C (proporção 3): 3 × R$ 1.000,00 = R$ 3.000,00\n" +
      "Verificação: R$ 1.000 + R$ 2.000 + R$ 3.000 = R$ 6.000,00 ✓\n" +
      "O item afirma R$ 3.000 para proporção 3 e R$ 2.000 para proporção 2 — ambos corretos.",
    explanationCorrect:
      "Correto! Soma das partes: 1+2+3=6. Valor de 1 parte: 6000÷6=R$1.000. " +
      "Prop. 3 → 3×1000=R$3.000 ✓. Prop. 2 → 2×1000=R$2.000 ✓. " +
      "Verificação: 1000+2000+3000=6000 ✓. Divisão DP: quem trabalhou mais recebe mais.",
    explanationWrong:
      "O item está CERTO. Soma: 1+2+3=6. Valor por parte: 6000÷6=R$1.000. " +
      "Proporção 2 → R$2.000 ✓; Proporção 3 → R$3.000 ✓. Verificação: 1k+2k+3k=6k ✓.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Divisão Proporcional: Como Dividir Recursos em Partes Proporcionais",
  },

  // Q12 — Divisão IP: equipe menor recebe mais (MEDIO, ERRADO)
  {
    id: "qz_mat_prop_012",
    statement:
      "Julgue o item a respeito de divisão inversamente proporcional.\n\n" +
      "Uma delegacia recebe 180 cartuchos para distribuir entre a Equipe A (3 integrantes) " +
      "e a Equipe B (6 integrantes), na proporção INVERSAMENTE proporcional ao número de " +
      "integrantes — pois equipes menores precisam de mais recursos por pessoa. " +
      "Nessa divisão, a Equipe A deve receber 60 cartuchos.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. Na divisão INVERSAMENTE proporcional ao número de integrantes, a equipe " +
      "MENOR recebe MAIS cartuchos (não menos). O cálculo correto usa RECÍPROCOS:\n" +
      "Passo 1 — Recíprocos: A (3 integrantes) → 1/3; B (6 integrantes) → 1/6\n" +
      "Passo 2 — Normalizar com MMC(3,6)=6: A → 2/6; B → 1/6\n" +
      "Passo 3 — Partes: A = 2; B = 1; Total = 3 partes\n" +
      "Passo 4 — Valor de 1 parte: 180 ÷ 3 = 60 cartuchos\n" +
      "Passo 5 — Distribuição:\n" +
      "  Equipe A (2 partes): 2 × 60 = 120 cartuchos\n" +
      "  Equipe B (1 parte): 1 × 60 = 60 cartuchos\n" +
      "Verificação: 120 + 60 = 180 ✓\n" +
      "O item afirma que A recebe 60 = ERRADO. A Equipe A recebe 120 (equipe menor → mais recursos).",
    explanationCorrect:
      "O item está ERRADO. IP: recíprocos. A(3) → 1/3; B(6) → 1/6. MMC=6: partes 2 e 1. " +
      "1 parte = 180÷3=60. A=2×60=120; B=1×60=60. Total: 120+60=180 ✓. " +
      "A Equipe A (3 integrantes, menor) recebe 120 — não 60. Divisão IP: menor equipe = mais recursos.",
    explanationWrong:
      "O item está ERRADO. Divisão IP: equipe MENOR recebe MAIS. " +
      "Recíprocos: A(3)→1/3, B(6)→1/6. Normalizando: 2/6 e 1/6 → partes 2:1. " +
      "Cada parte=180÷3=60. Equipe A=2×60=120 cartuchos; Equipe B=60. " +
      "O item afirmou que A recebe 60 — esse seria o resultado para B (equipe maior).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Divisão Proporcional: Como Dividir Recursos em Partes Proporcionais",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n📐  Seed R25: Matemática Básica II — Razão, Proporção e Regra de Três\n");

  // ── 1. Encontrar Subject ────────────────────────────────────────────────
  let subjectId = await findSubject("RACIOCINIO_LOGICO");
  if (!subjectId) subjectId = await findSubject("MATEMATICA");
  if (!subjectId) subjectId = await findSubject("Logico");
  if (!subjectId) subjectId = await findSubject("Raciocin");
  if (!subjectId) {
    console.error("❌ Subject para Raciocínio Lógico/Matemática não encontrado.");
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

  // ── 4. Criar tópico 'Proporcionalidade' ────────────────────────────────
  const topicId = await findOrCreateTopic("Proporcionalidade", subjectId);
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
  console.log("─────────────────────────────────────────\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed R25 falhou:", err);
  process.exit(1);
});
