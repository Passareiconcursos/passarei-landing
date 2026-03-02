/**
 * Seed: Língua Portuguesa — R24 — Sintaxe da Oração: Termos Essenciais e Integrantes
 *
 * Diretriz pedagógica: sintaxe é o ponto mais cobrado em provas policiais de nível superior
 * (PF, PRF, PC). Cada átomo foca em identificação de funções sintáticas com a "pergunta ao verbo"
 * como ferramenta principal: "Quem é que...?" (sujeito), "o quê?" / "a quem?" (OD/OI),
 * transformações de voz passiva e a distinção CN × AA que o Cebraspe adora explorar.
 *
 * 6 Átomos de Conteúdo:
 *   1. Frase, Oração e Período: Estrutura da Sintaxe da Oração
 *   2. Sujeito: Tipos, Classificação e Casos Especiais
 *   3. Predicado e Transitividade Verbal: VTD, VTI, VTDI, VI e VL
 *   4. Complementos Verbais: Objeto Direto e Objeto Indireto
 *   5. Complemento Nominal vs Adjunto Adnominal: A Diferença que as Bancas Adoram
 *   6. Agente da Passiva e as Transformações de Voz Verbal
 *
 * 12 Questões — TODAS CERTO_ERRADO
 * Subject: Língua Portuguesa (busca por "Portugu")
 * Topic: Sintaxe (novo tópico)
 *
 * Execução:
 *   npx tsx db/seed-port-sintaxe-r24.ts
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
  // ── 1. Frase / Oração / Período ───────────────────────────────────────
  {
    title: "Frase, Oração e Período: Estrutura da Sintaxe da Oração",
    textContent: `A SINTAXE estuda as funções que as palavras exercem na oração e as relações que estabelecem entre si. O ponto de partida é distinguir três conceitos fundamentais cobrados em prova: FRASE, ORAÇÃO e PERÍODO.

FRASE: qualquer enunciado com sentido completo em determinada situação comunicativa. Pode ou não ter verbo.
  Com verbo: "O delegado chegou." | Sem verbo: "Fogo!" / "Silêncio!" / "Que belo trabalho!"

ORAÇÃO: frase (ou parte de frase) que obrigatoriamente possui um VERBO ou LOCUÇÃO VERBAL. Toda oração é frase (ou parte dela), mas nem toda frase é oração.
  Exemplos: "O agente investigou o caso." (1 oração) | "Quando o suspeito fugiu, a equipe o perseguiu." (2 orações)

PERÍODO: a frase constituída por uma ou mais orações.
  PERÍODO SIMPLES → contém UMA ÚNICA oração: "A promotora apresentou as provas."
  PERÍODO COMPOSTO → contém DUAS OU MAIS orações:
    • Por COORDENAÇÃO: orações independentes ligadas por conjunções coordenativas (e, mas, ou, pois, portanto): "O réu entrou na sala e o júri o observou."
    • Por SUBORDINAÇÃO: uma oração depende gramaticalmente da outra: "Espero que o veredito seja justo."
    • Misto: coordenação + subordinação no mesmo período.

LOCUÇÃO VERBAL: auxiliar + verbo principal. Conta como verbo único para fins de identificação de oração: "Ela estava sendo interrogada" = 1 verbo (locução) = 1 oração.

ORAÇÃO REDUZIDA: oração sem conjunção introdutória e com verbo em forma nominal (infinitivo, gerúndio ou particípio): "Ao sair da delegacia, o suspeito foi fotografado." ('Ao sair' = oração subordinada reduzida de gerúndio.)

ATENÇÃO — Pegadinha de prova:
Frases nominais (sem verbo) são FRASES mas NÃO são ORAÇÕES: "Que silêncio!" / "Proibida a entrada." / "Máxima atenção!" Bancas costumam afirmar erroneamente que "toda frase é uma oração" — ERRADO.`,
    mnemonic: "FRASE = sentido completo (com ou sem verbo). ORAÇÃO = tem VERBO obrigatoriamente. PERÍODO SIMPLES = 1 oração; PERÍODO COMPOSTO = 2+ orações (coordenação ou subordinação). Frase nominal (sem verbo) = frase, mas NÃO oração. Locução verbal = conta como 1 verbo.",
    keyPoint: "Frase: enunciado com sentido completo (pode ser sem verbo). Oração: tem verbo (obrigatório). Período simples: 1 oração. Período composto: 2+ orações. Frase nominal (sem verbo) ≠ oração. Período composto por coordenação: orações independentes. Por subordinação: uma depende da outra.",
    practicalExample: "Prova PF/Cebraspe clássica: 'Silêncio!' → FRASE (sentido completo) mas NÃO oração (sem verbo). 'O agente saiu e o suspeito ficou' → período composto por coordenação (2 orações independentes). 'Todos sabiam que o crime havia sido planejado' → período composto por subordinação (oração principal + subordinada substantiva objetiva direta). Pegadinha: 'Proibido fumar' = frase nominal = frase, não oração.",
    difficulty: "FACIL",
  },

  // ── 2. Sujeito ────────────────────────────────────────────────────────
  {
    title: "Sujeito: Tipos, Classificação e Casos Especiais em Provas Policiais",
    textContent: `O SUJEITO é o termo da oração sobre o qual o predicado diz algo. É o ser de quem se fala ou que pratica/recebe a ação. A pergunta fundamental é: "QUEM É QUE + verbo?" ou "O QUÊ é que + verbo?".

CLASSIFICAÇÃO DOS SUJEITOS:

1. SUJEITO DETERMINADO (identificável):
   a) SIMPLES: um único núcleo nominal. "Os investigadores chegaram." (núcleo: investigadores)
   b) COMPOSTO: dois ou mais núcleos. "O delegado e a perita assinaram o laudo." (núcleos: delegado + perita)

2. SUJEITO OCULTO / DESINENCIAL / ELÍPTICO: identificado pela desinência verbal ou pelo contexto, mas não expresso na oração.
   "Saí cedo da delegacia." → sujeito: eu (identificado pela desinência -i)
   "Prometemos investigar tudo." → sujeito: nós (desinência -mos)

3. SUJEITO INDETERMINADO: existe, mas não pode ser identificado ou o falante não quer identificar.
   Dois casos:
   a) Verbo na 3ª pessoa do plural sem referência anterior: "Roubaram os arquivos da delegacia." (quem? não se sabe)
   b) Verbo intransitivo ou de ligação + SE (índice de indeterminação): "Precisa-se de agentes experientes." (precisar = VTI → se = índice de indeterm.)

4. SUJEITO INEXISTENTE / ORAÇÃO SEM SUJEITO: verbos impessoais ou usados impessoalmente.
   • Fenômenos naturais: "Choveu durante toda a operação." / "Nevou na serra."
   • "HAVER" (existência/ocorrência): "Há provas suficientes." / "Houve conflito." (NUNCA concorda com complemento)
   • "FAZER" (tempo decorrido/clima): "Faz três dias que o réu desapareceu." / "Faz frio aqui."
   • "SER" (hora/data/distância com sujeito indeterminado): "É meia-noite." / "São duas horas."

ATENÇÃO — SUJEITO PÓS-POSTO (pegadinha clássica!):
Em português, o sujeito pode aparecer APÓS o verbo. Isso NÃO torna o sujeito inexistente ou indeterminado.
"Chegaram os reforços da corporação." → sujeito: "os reforços da corporação" (pós-posto, mas determinado)
"Foram encontradas duas armas." → sujeito: "duas armas" (pós-posto, passiva)

CONCORDÂNCIA COM SUJEITO COMPOSTO:
• Antes do verbo → verbo no plural: "O delegado e a perita assinaram."
• Após o verbo → pode concordar com o mais próximo: "Assinaram o delegado e a perita." ou "Assinou o delegado e a perita."`,
    mnemonic: "SUJEITO = responde 'Quem é que + verbo?'. SIMPLES = 1 núcleo; COMPOSTO = 2+ núcleos; OCULTO = identificado pela desinência; INDETERMINADO = existe mas não sei quem (3ª pl. sem referência OU VTI/VI + se); INEXISTENTE = fenômeno natural + HAVER/FAZER/SER impessoais. PÓS-POSTO ≠ inexistente! 'Chegaram os reforços' → sujeito = 'os reforços'.",
    keyPoint: "Sujeito: responde 'Quem é que + verbo?'. Simples (1 núcleo) / Composto (2+ núcleos) / Oculto (desinência) / Indeterminado (3ª pl. s/ ref. OU VTI+se) / Inexistente (fenômenos naturais, HAVER existencial, FAZER temporal). ATENÇÃO: sujeito pós-posto ≠ inexistente. HAVER impessoal = sem sujeito (não concorda).",
    practicalExample: "Questão PF: 'Chegaram os laudos periciais' → sujeito pós-posto 'os laudos periciais' — DETERMINADO (não inexistente). 'Houve irregularidades na licitação' → HAVER impessoal → SEM sujeito (irregularidades = objeto direto, não sujeito). 'Roubaram os documentos' → sujeito indeterminado (3ª pessoa plural sem referência). 'Precisava-se de mais agentes' → SE = índice de indeterminação → sujeito indeterminado.",
    difficulty: "MEDIO",
  },

  // ── 3. Predicado e Transitividade ─────────────────────────────────────
  {
    title: "Predicado e Transitividade Verbal: VTD, VTI, VTDI, VI e VL",
    textContent: `O PREDICADO é tudo o que se diz sobre o sujeito. O NÚCLEO do predicado pode ser um verbo (predicado verbal) ou um nome — substantivo ou adjetivo — (predicado nominal), ou ambos simultaneamente (predicado verbo-nominal).

TIPOS DE PREDICADO:

1. PREDICADO VERBAL: núcleo = verbo significativo (ação, processo). Subdivide-se pela TRANSITIVIDADE:
   a) VERBO TRANSITIVO DIRETO (VTD): exige complemento SEM preposição (objeto direto — OD). Pergunta: "verbo + o quê? / quem?"
      "O delegado prendeu o suspeito." → prendeu quem? → o suspeito = OD.
   b) VERBO TRANSITIVO INDIRETO (VTI): exige complemento COM preposição obrigatória (objeto indireto — OI). Pergunta: "verbo + a quem? / de quê? / em quê?"
      "O agente confiou nas provas." → confiou em quê? → nas provas = OI.
   c) VERBO TRANSITIVO DIRETO E INDIRETO (VTDI): exige dois complementos — OD + OI.
      "O perito entregou o laudo ao delegado." → OD: o laudo; OI: ao delegado.
   d) VERBO INTRANSITIVO (VI): não exige complemento.
      "O réu fugiu." / "A testemunha chegou."

2. PREDICADO NOMINAL: núcleo = nome (predicativo do sujeito). Verbo é de LIGAÇÃO (VL).
   VERBOS DE LIGAÇÃO: ser, estar, parecer, ficar, tornar-se, permanecer, continuar, andar (no sentido de estar), virar.
   "A delegada parecia cansada." → verbo de ligação: parecia; predicativo do sujeito: cansada.
   "O suspeito ficou nervoso durante o interrogatório."

3. PREDICADO VERBO-NOMINAL: núcleo duplo — verbo significativo + predicativo do sujeito ou do objeto.
   "O réu confessou nervoso." → confessou (ação) + nervoso (predicativo do sujeito: estado simultâneo)
   "O delegado encontrou o laudo incompleto." → encontrou (ação) + incompleto (predicativo do objeto)

VERBOS QUE MUDAM DE TRANSITIVIDADE CONFORME O SENTIDO:
• "assistir a" (VTI = ver/presenciar) × "assistir" (VTD = ajudar, amparar): "Assisti ao julgamento." (VTI) × "O médico assistiu o ferido." (VTD)
• "aspirar a" (VTI = almejar) × "aspirar" (VTD = inalar): "Ele aspira ao cargo." × "O aparelho aspira o pó."
• "visar a" (VTI = ter como objetivo) × "visar" (VTD = dar visto): "O projeto visa ao bem público." × "O cartório visou o documento."`,
    mnemonic: "VTD = o quê? (sem preposição). VTI = a quem? / de quê? / em quê? (com preposição). VTDI = OD + OI. VI = sem complemento. VL = ser/estar/parecer/ficar/tornar/permanecer → liga sujeito ao predicativo. PREDICATIVO = estado/qualidade do sujeito ou objeto. Verb. VERBO-NOMINAL = ação + predicativo simultâneos.",
    keyPoint: "VTD: complemento sem preposição (o quê? / quem?). VTI: complemento com preposição (a quem? / de quê?). VTDI: OD + OI. VI: sem complemento. VL: ser/estar/parecer/ficar/tornar-se/permanecer → predicado nominal. Atenção: 'assistir a' (VTI = ver) ≠ 'assistir' (VTD = ajudar). Verbo-nominal = ação + predicativo simultâneos.",
    practicalExample: "Questão PF/PRF clássica: 'O agente assistiu ao depoimento' → 'assistir a' = VTI (sentido: ver/presenciar); 'ao depoimento' = OI. ERRADO seria classificar como OD. Outro exemplo: 'O perito achou o laudo incompleto' → predicado verbo-nominal: 'achou' (ação) + 'incompleto' (predicativo do objeto 'o laudo'). 'A delegada ficou satisfeita com o resultado' → VL 'ficou' + predicativo do sujeito 'satisfeita' = predicado nominal.",
    difficulty: "FACIL",
  },

  // ── 4. Complementos Verbais ───────────────────────────────────────────
  {
    title: "Complementos Verbais: Objeto Direto e Objeto Indireto",
    textContent: `Os COMPLEMENTOS VERBAIS completam o sentido dos verbos transitivos. São dois: OBJETO DIRETO (OD) e OBJETO INDIRETO (OI). Identificá-los corretamente é essencial para gabaritar questões de sintaxe em provas policiais.

OBJETO DIRETO (OD):
• Completa verbo TRANSITIVO DIRETO (VTD).
• Ligado ao verbo SEM preposição (ou com preposição acidental, não exigida pelo verbo).
• Pergunta: "verbo + O QUÊ?" ou "verbo + QUEM?"
• Exemplos:
  "O delegado assinou o mandado." → assinou o quê? → "o mandado" = OD.
  "A policial prendeu os fugitivos." → prendeu quem? → "os fugitivos" = OD.
• OBJETO DIRETO PREPOSICIONADO: em alguns casos, o OD é precedido por preposição com valor de ênfase/estilo — não confundir com OI:
  "Amo a minha pátria." (a = preposição estilística; "minha pátria" = OD preposicionado)
  "Vi a todos na formatura." (a = preposição, mas "a todos" = OD preposicionado)

OBJETO INDIRETO (OI):
• Completa verbo TRANSITIVO INDIRETO (VTI).
• Ligado ao verbo SEMPRE COM PREPOSIÇÃO exigida pelo verbo (de, a, em, com, por).
• Pergunta: "verbo + A QUEM?" / "verbo + DE QUÊ?" / "verbo + EM QUÊ?" / "verbo + COM QUEM?"
• Exemplos:
  "O agente confiou nas evidências." → confiou em quê? → "nas evidências" = OI.
  "O perito gostou do resultado." → gostou de quê? → "do resultado" = OI.
  "O delegado falou ao suspeito." → falou a quem? → "ao suspeito" = OI.

VERBOS COM DOIS COMPLEMENTOS (VTDI — OD + OI):
"O juiz concedeu liberdade ao réu." → OD: "liberdade" (quê?); OI: "ao réu" (a quem?).
"A escrivã informou o advogado sobre a audiência." → OD: "o advogado" (quem?); OI: "sobre a audiência" (sobre quê?).

SUBSTITUIÇÃO PRONOMINAL — teste rápido:
• OD → substituível por "o/a/os/as": "Prendeu os suspeitos" → "Prendeu-os" ✓ (OD confirmado)
• OI → substituível por "lhe/lhes" (3ª pessoa, preposição "a"): "Falou ao delegado" → "Lhe falou" ✓ (OI confirmado)

ATENÇÃO — Verbos "gostar", "precisar", "confiar", "depender", "necessitar" = VTI (sempre OI, preposição obrigatória):
"Gostou DO trabalho." / "Precisou DE ajuda." / "Confiou NO sistema." → NUNCA OD.`,
    mnemonic: "OD = sem preposição exigida pelo verbo (o quê? / quem?). OI = COM preposição exigida pelo verbo (a quem? / de quê? / em quê?). Teste pronomial: OD → o/a/os/as; OI → lhe/lhes. Gostar/Precisar/Confiar/Depender = VTI = sempre OI. VTDI = OD + OI juntos.",
    keyPoint: "OD: sem preposição exigida (o quê? / quem?) → substituível por o/a/os/as. OI: COM preposição exigida (a quem? / de quê? / em quê?) → substituível por lhe/lhes. VTI clássicos: gostar de, precisar de, confiar em, depender de, necessitar de → sempre OI. OD preposicionado (estilístico) ≠ OI.",
    practicalExample: "Questão PF/Cebraspe: 'Os peritos gostaram da evidência encontrada' → 'da evidência' = OI (gostar DE = VTI), NÃO objeto direto. Outra: 'O delegado informou o suspeito dos seus direitos' → OD: 'o suspeito' (informou quem?); OI: 'dos seus direitos' (informou de quê?). Teste: 'informou-o' (OD = o) + 'informou-lhe' (OI = lhe para preposição 'a') — aqui é 'de' então sem pronome lhe, mas o contexto confirma a estrutura.",
    difficulty: "MEDIO",
  },

  // ── 5. Complemento Nominal vs Adjunto Adnominal ───────────────────────
  {
    title: "Complemento Nominal vs Adjunto Adnominal: A Diferença que as Bancas Adoram",
    textContent: `A distinção entre COMPLEMENTO NOMINAL (CN) e ADJUNTO ADNOMINAL (AA) é um dos tópicos mais cobrados pelo Cebraspe em provas policiais. Ambos são termos ligados a um SUBSTANTIVO, mas com funções sintáticas radicalmente diferentes.

COMPLEMENTO NOMINAL (CN):
• Completa o sentido de um SUBSTANTIVO, ADJETIVO ou ADVÉRBIO que tenha sentido INCOMPLETO (sentido "verbal" — derivado de verbo ou adjetivo que exige complementação).
• Sempre introduzido por PREPOSIÇÃO.
• O nome "pede" o complemento: sem ele, o sentido fica incompleto.
• Pergunta: "[nome] + DE QUÊ? / A QUEM? / EM QUEM? / SOBRE QUÊ?"
• A relação é PASSIVA: o substantivo recebe a ação ou estado.
• Exemplos:
  "O agente tinha necessidade DE PROVAS." → necessidade de quê? = CN (necessidade ← necessitar → pede complemento)
  "O réu demonstrou consciência DO CRIME." → consciência de quê? = CN
  "A decisão do juiz foi favorável AO RÉU." → favorável a quem? = CN (adjetivo)
  "O delegado falou suficientemente SOBRE O CASO." → suficientemente de quê? = CN (advérbio)

ADJUNTO ADNOMINAL (AA):
• Modifica, qualifica ou especifica um substantivo. É FACULTATIVO — sem ele, o sentido do substantivo permanece completo.
• Pode ser: adjetivo, locução adjetiva, artigo, pronome adjetivo, numeral adjetivo, locução preposicionada especificadora.
• A relação é ATIVA: o substantivo pratica a ação ou é o agente.
• Exemplos:
  "O relatório SOBRE O CRIME foi entregue." → "sobre o crime" especifica qual relatório = AA (não é exigido por "relatório")
  "O delegado DA CORPORAÇÃO interrogou o suspeito." → "da corporação" especifica qual delegado = AA
  "O policial COMPETENTE concluiu a investigação." → "competente" = adjetivo = AA

TESTE PRÁTICO PARA DISTINGUIR:
1. Pergunte se o NOME "pede" o complemento (é incompleto sem ele):
   • SIM → provável COMPLEMENTO NOMINAL
   • NÃO (o sentido já está completo) → provável ADJUNTO ADNOMINAL
2. Substitua o SP por pronome possessivo: se couber "seu/sua", tende a ser CN (relação de objeto); se couber "de + nome", tende a ser AA especificador.
3. Verifique se o substantivo tem base VERBAL ou ADJETIVAL: "necessidade" (← necessitar), "confiança" (← confiar), "medo" (← temer) = exigem CN. "Relatório", "delegado", "sala" = substantivos comuns sem exigência = tendem a ter AA.

CASOS ESPECIAIS — mesma preposição, funções diferentes:
"A confiança DO DELEGADO [nas provas]." → "do delegado" = AA (agente, pratica a confiança) OU CN (objeto da confiança, dependendo do contexto). Análise pelo papel semântico: AGENTE → AA; PACIENTE/OBJETO → CN.`,
    mnemonic: "CN = nome INCOMPLETO pede complemento (necessidade DE, consciência DO, medo DE, amor A). AA = nome COMPLETO, complemento é facultativo (o delegado DA PF, o relatório SOBRE o crime). Teste: sem o termo, o nome ainda faz sentido? SIM → AA. NÃO → CN. Base verbal/adjetival → CN. Agente → AA; Paciente/Objeto → CN.",
    keyPoint: "CN: completa nome incompleto (sentido verbal/adjetival); preposição obrigatória; relação passiva (nome recebe ação). AA: modifica nome completo; facultativo; pode ser adjetivo, locução adjetiva, etc. Distinção chave: 'necessidade de provas' (CN — necessidade pede) vs 'relatório sobre o crime' (AA — relatório não pede, apenas especifica). Agente → AA; Paciente → CN.",
    practicalExample: "Questão PF clássica: 'O agente tinha medo DE FALHAR' → 'de falhar' = CN (medo de quê? — medo exige complementação). Vs 'O relatório SOBRE O CRIME' → 'sobre o crime' = AA (relatório é completo; apenas especifica). Armadilha: 'A acusação DO RÉU' → 'do réu' pode ser AA (agente: o réu acusou algo) OU CN (paciente: o réu foi acusado). O Cebraspe explora esse tipo de ambiguidade pedindo análise contextual.",
    difficulty: "DIFICIL",
  },

  // ── 6. Agente da Passiva ───────────────────────────────────────────────
  {
    title: "Agente da Passiva e as Transformações de Voz Verbal",
    textContent: `A VOZ VERBAL indica a relação entre o sujeito e a ação do verbo. Provas policiais cobram especialmente a transformação entre voz ATIVA e PASSIVA ANALÍTICA e a identificação do AGENTE DA PASSIVA.

VOZES VERBAIS:
1. VOZ ATIVA: o sujeito PRATICA a ação. "O delegado prendeu o suspeito."
   → Sujeito agente: "o delegado"; OD: "o suspeito".

2. VOZ PASSIVA ANALÍTICA: o sujeito RECEBE a ação. Formada por: verbo SER/ESTAR + particípio + agente da passiva (introduzido por POR/DE).
   "O suspeito foi preso pelo delegado."
   → Sujeito paciente: "o suspeito"; agente da passiva: "pelo delegado"; verbo passivo: "foi preso".

3. VOZ PASSIVA SINTÉTICA (pronominal): VTD/VTDI + SE (partícula apassivadora). O sujeito é paciente.
   "Prendeu-se o suspeito." / "Venderam-se os veículos apreendidos." (sujeito: "os veículos")

TRANSFORMAÇÃO ATIVA → PASSIVA ANALÍTICA:
• O OD da ativa → Sujeito da passiva.
• O sujeito da ativa → Agente da passiva (precedido de "por").
• Verbo: SER (no mesmo tempo) + particípio do verbo principal.

Exemplo passo a passo:
Ativa: "A juíza condenou o réu."
         ↓ sujeito     ↓ verbo   ↓ OD
Passiva: "O réu foi condenado pela juíza."
          ↓ sujeito    ↓ verbo passivo   ↓ agente da passiva

Ativa: "Os agentes investigarão o caso."
Passiva: "O caso será investigado pelos agentes."

AGENTE DA PASSIVA:
• Termo que indica quem pratica a ação em orações na voz passiva.
• Introduzido pelas preposições POR (mais comum) ou DE (em contextos estilísticos formais ou com verbos de estado):
  "A decisão foi aplaudida PELO réu." (por + o = pelo)
  "A medida era temida DE TODOS." (de = preposição arcaica/estilística)

QUANDO NÃO HÁ TRANSFORMAÇÃO POSSÍVEL:
• Verbos INTRANSITIVOS: "O suspeito fugiu." → sem OD → sem passiva.
• Verbos de LIGAÇÃO: "O agente parece competente." → sem passiva.
• HAVER impessoal: "Houve tumulto." → sem sujeito → sem passiva.
• FAZER temporal/climático: "Faz cinco dias." → sem sujeito → sem passiva.`,
    mnemonic: "ATIVA = sujeito PRATICA. PASSIVA ANALÍTICA = SER + particípio + pelo/de. PASSIVA SINTÉTICA = VTD + SE. Transformação: OD da ativa → sujeito da passiva; sujeito da ativa → agente da passiva (por/de). Sem OD (VI, VL, HAVER, FAZER impessoal) = sem voz passiva. Preposição do agente: POR (quase sempre) ou DE (arcaico/estilístico).",
    keyPoint: "Voz passiva analítica: SER + particípio + agente (por/de). Transformação: OD → sujeito; sujeito → agente. Passiva sintética: VTD + SE (sujeito paciente). Agente da passiva: introduzido por 'por' (mais comum) ou 'de'. HAVER impessoal, VL, VI = não admitem transformação passiva. Verificar concordância: o verbo SER concorda com o sujeito paciente.",
    practicalExample: "Questão PF: 'A equipe elaborou o relatório' → passiva: 'O relatório foi elaborado pela equipe' ('pela' = por + a). Teste de gabarito: 'pelo delegado' = agente da passiva ✓. Pegadinha: 'Houve irregularidades no processo' → HAVER impessoal → sem passiva possível ('Irregularidades foram havidas' = ERRADO). Outro: 'Prendeu-se o suspeito' = passiva sintética → sujeito = 'o suspeito' (paciente).",
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
  // Átomo 1 — Frase / Oração / Período (Q1-Q2)
  // ══════════════════════════════════════════════════════════════════

  // Q1 — Frase nominal sem verbo ≠ oração (FACIL, CERTO)
  {
    id: "qz_port_sint_001",
    statement:
      "Julgue o item conforme a norma da língua portuguesa.\n\n" +
      "O enunciado 'Fogo!' constitui uma FRASE, mas não uma ORAÇÃO, pois não contém verbo. " +
      "A oração, ao contrário da frase, requer obrigatoriamente a presença de um verbo ou " +
      "locução verbal para ser assim classificada.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. 'Fogo!' é uma frase porque tem sentido completo em situação comunicativa — " +
      "porém NÃO é oração, pois falta o verbo (elemento obrigatório para a oração). Frase = " +
      "enunciado com sentido completo (com ou sem verbo). Oração = frase ou parte de frase que " +
      "OBRIGATORIAMENTE tem verbo. Exemplos de frases sem oração: 'Silêncio!', 'Proibida a entrada!', " +
      "'Que beleza!'. Frases com oração: 'O agente chegou.' Regra: toda oração é frase, mas nem " +
      "toda frase é oração.",
    explanationCorrect:
      "Correto! Frase = sentido completo (com ou sem verbo). Oração = tem verbo obrigatoriamente. " +
      "'Fogo!' = frase nominal (sem verbo) = frase, mas não oração. Regra: toda oração é frase, " +
      "mas nem toda frase é oração. Frases nominais (sem verbo) aparecem em exclamações, ordens, " +
      "títulos e slogans.",
    explanationWrong:
      "O item está CERTO. Frase = enunciado com sentido completo (sem exigir verbo). Oração = " +
      "tem verbo obrigatoriamente. 'Fogo!' não tem verbo → é frase, não oração. Outros exemplos de " +
      "frases sem oração: 'Silêncio!', 'Máxima atenção!', 'Proibida a entrada!'. Regra do Cebraspe: " +
      "toda oração é frase, mas nem toda frase é oração.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Frase, Oração e Período: Estrutura da Sintaxe da Oração",
  },

  // Q2 — Período simples ≠ duas orações (FACIL, ERRADO)
  {
    id: "qz_port_sint_002",
    statement:
      "Julgue o item conforme a norma da língua portuguesa.\n\n" +
      "O período simples é aquele formado por duas ou mais orações ligadas por conjunções " +
      "coordenativas. Quando as orações se unem por conjunções subordinativas — criando relação " +
      "de dependência —, o período passa a ser classificado como composto por subordinação.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O item erra na definição de período simples. PERÍODO SIMPLES é aquele formado " +
      "por UMA ÚNICA ORAÇÃO — independentemente de conjunções. PERÍODO COMPOSTO é o que contém " +
      "DUAS OU MAIS ORAÇÕES, e pode ser: por coordenação (orações independentes, ligadas por " +
      "conjunções coordenativas: e, mas, ou, pois, portanto) OU por subordinação (uma oração " +
      "depende da outra). O item afirmou erroneamente que período simples contém 'duas ou mais " +
      "orações' — isso é a definição de período COMPOSTO.",
    explanationCorrect:
      "O item está ERRADO. Período simples = 1 única oração. Período composto = 2 ou mais orações " +
      "(por coordenação ou subordinação). O item inverteu a definição: atribuiu ao período simples " +
      "a característica do composto. Exemplos: 'O agente saiu.' = período simples. 'O agente saiu " +
      "e o suspeito ficou.' = período composto por coordenação.",
    explanationWrong:
      "O item está ERRADO. A primeira parte erra: período simples = 1 oração (não 'duas ou mais'). " +
      "A segunda parte está correta (período por subordinação = orações com dependência). " +
      "Definições corretas: simples = 1 oração; composto por coordenação = 2+ orações independentes; " +
      "composto por subordinação = oração principal + oração(ões) dependente(s).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Frase, Oração e Período: Estrutura da Sintaxe da Oração",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 2 — Sujeito (Q3-Q4)
  // ══════════════════════════════════════════════════════════════════

  // Q3 — Sujeito simples com adjuntos não é sujeito composto (FACIL, CERTO)
  {
    id: "qz_port_sint_003",
    statement:
      "Julgue o item conforme a análise sintática da língua portuguesa.\n\n" +
      "Na oração 'Os investigadores da Polícia Federal identificaram os suspeitos', o sujeito é " +
      "'Os investigadores da Polícia Federal', classificado como sujeito SIMPLES, pois possui " +
      "um único NÚCLEO nominal ('investigadores'), ainda que acompanhado de adjuntos adnominais " +
      "('os', 'da Polícia Federal').",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. O sujeito é 'Os investigadores da Polícia Federal'. Para classificar o sujeito, " +
      "analisa-se o NÚCLEO — o substantivo (ou pronome) principal ao redor do qual os demais " +
      "termos giram. Aqui, o núcleo é 'investigadores' (único substantivo nuclear do sujeito). " +
      "Os termos 'os' (artigo = adjunto adnominal) e 'da Polícia Federal' (locução adjetiva = " +
      "adjunto adnominal) apenas MODIFICAM 'investigadores', sem constituir novos núcleos. " +
      "Sujeito COMPOSTO exigiria dois ou mais núcleos: 'O delegado E A PERITA chegaram.' " +
      "Pergunta ao verbo: 'Quem identificou?' → 'os investigadores...' = sujeito simples.",
    explanationCorrect:
      "Correto! Sujeito simples = 1 único núcleo. 'Os investigadores da Polícia Federal' tem " +
      "núcleo 'investigadores' — os demais termos (artigo 'os' + locução adjetiva 'da PF') são " +
      "adjuntos adnominais que modificam o núcleo. Sujeito composto exigiria 2+ núcleos: " +
      "'O delegado e a perita...' Pergunta: 'quem identificou?' → 'investigadores' = núcleo único.",
    explanationWrong:
      "O item está CERTO. Sujeito simples = 1 núcleo nominal. Adjuntos adnominais (artigos, " +
      "locuções adjetivas) não criam novos núcleos. 'Os investigadores da PF' → núcleo: " +
      "'investigadores' (único). Para ser composto, precisaria de dois substantivos/pronomes " +
      "nucleares: 'O delegado e a perita identificaram...'",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Sujeito: Tipos, Classificação e Casos Especiais em Provas Policiais",
  },

  // Q4 — Sujeito pós-posto ≠ sujeito inexistente (MEDIO, ERRADO)
  {
    id: "qz_port_sint_004",
    statement:
      "Julgue o item conforme a análise sintática da língua portuguesa.\n\n" +
      "Na frase 'Chegaram os reforços da corporação durante a operação', o sujeito é inexistente, " +
      "pois o verbo 'chegaram' está na 3ª pessoa do plural sem que haja um ser identificado antes " +
      "dele como praticante da ação.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. A oração tem sujeito — ele apenas está em posição PÓS-POSTA (após o verbo). " +
      "O sujeito é 'os reforços da corporação': pergunta ao verbo 'Quem é que chegou?' → " +
      "'os reforços da corporação' (sujeito simples determinado). Em português, o sujeito pode " +
      "aparecer ANTES ou APÓS o verbo, sem que isso altere sua existência ou classificação. " +
      "Sujeito INEXISTENTE ocorre com verbos impessoais: fenômenos naturais ('Choveu'), HAVER " +
      "existencial ('Houve conflito'), FAZER temporal ('Faz dois dias'). 'Chegar' não é verbo " +
      "impessoal — tem sujeito pós-posto.",
    explanationCorrect:
      "O item está ERRADO. 'Chegaram os reforços' → sujeito pós-posto = 'os reforços da corporação' " +
      "(determinado simples). A posição pós-verbal NÃO torna o sujeito inexistente. Pergunta: " +
      "'Quem chegou?' → 'os reforços'. Sujeito inexistente: verbos impessoais (chover, haver " +
      "existencial, fazer temporal). 'Chegar' tem sujeito normal.",
    explanationWrong:
      "O item está ERRADO. 'Chegaram os reforços da corporação' tem sujeito pós-posto: 'os reforços " +
      "da corporação'. Em português, o sujeito pode vir após o verbo. Isso não o torna inexistente. " +
      "Sujeito inexistente: 'Choveu.' / 'Houve conflito.' / 'Faz três dias.' — verbos impessoais. " +
      "'Chegar' + sujeito pós-posto = sujeito simples determinado.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Sujeito: Tipos, Classificação e Casos Especiais em Provas Policiais",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 3 — Predicado e Transitividade (Q5-Q6)
  // ══════════════════════════════════════════════════════════════════

  // Q5 — VL + predicativo = predicado nominal (FACIL, CERTO)
  {
    id: "qz_port_sint_005",
    statement:
      "Julgue o item conforme a análise sintática da língua portuguesa.\n\n" +
      "Na oração 'A delegada parecia cansada após o longo interrogatório', o verbo 'parecer' " +
      "funciona como verbo de ligação, conectando o sujeito 'A delegada' ao predicativo do " +
      "sujeito 'cansada'. O predicado dessa oração é, portanto, classificado como predicado " +
      "nominal.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. 'Parecer' é um verbo de ligação (VL) — não exprime ação, mas conecta o sujeito " +
      "a uma qualidade ou estado (o predicativo). Os principais VL: ser, estar, parecer, ficar, " +
      "tornar-se, permanecer, continuar, andar (no sentido de estar), virar. O predicativo do " +
      "sujeito é 'cansada' — indica o estado em que a delegada se encontrava. Predicado nominal = " +
      "VL + predicativo do sujeito: o núcleo do predicado é o NOME ('cansada'), não o verbo. " +
      "Pergunta: 'Como estava a delegada?' → 'cansada' = predicativo do sujeito.",
    explanationCorrect:
      "Correto! 'Parecer' = VL (verbo de ligação). 'Cansada' = predicativo do sujeito. " +
      "Predicado nominal = VL + predicativo: núcleo é o NOME, não o verbo. Verbos de ligação: " +
      "ser, estar, parecer, ficar, tornar-se, permanecer, continuar, andar (estar), virar.",
    explanationWrong:
      "O item está CERTO. 'Parecer' = verbo de ligação. 'Cansada' = predicativo do sujeito. " +
      "Predicado nominal: núcleo é o nome ('cansada'), não o verbo. VL clássicos: ser/estar/parecer/" +
      "ficar/tornar-se/permanecer/continuar. Predicado nominal × verbal: verbal tem ação (VTD/VTI/VI); " +
      "nominal tem VL + predicativo.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Predicado e Transitividade Verbal: VTD, VTI, VTDI, VI e VL",
  },

  // Q6 — 'assistir' no sentido de ver = VTI, não VTD (MEDIO, ERRADO)
  {
    id: "qz_port_sint_006",
    statement:
      "Julgue o item conforme a norma culta da língua portuguesa.\n\n" +
      "O verbo 'assistir', no sentido de 'ver, presenciar', é transitivo direto. Portanto, a " +
      "construção correta é 'O agente assistiu o depoimento da testemunha' (sem preposição " +
      "antes do complemento), e não 'O agente assistiu ao depoimento da testemunha'.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. 'Assistir' no sentido de 'VER, PRESENCIAR' é TRANSITIVO INDIRETO (VTI): exige " +
      "complemento introduzido pela preposição 'A'. A construção correta é 'O agente assistiu " +
      "AO depoimento' (a + o = ao). O VTD de 'assistir' ocorre apenas no sentido de 'AJUDAR, " +
      "AMPARAR, SOCORRER': 'O médico assistiu o ferido.' (sem preposição). Regra prática: " +
      "assistir A (ver/presenciar/ter direito) = VTI; assistir alguém (ajudar) = VTD. Outros " +
      "verbos com mesma lógica: 'visar A' (VTI = objetivar) × 'visar' (VTD = dar visto); " +
      "'aspirar A' (VTI = almejar) × 'aspirar' (VTD = inalar).",
    explanationCorrect:
      "O item está ERRADO. 'Assistir a' (ver/presenciar) = VTI → exige preposição 'a': 'assistiu " +
      "AO depoimento' ✓. 'Assistir' (ajudar/amparar) = VTD → sem preposição. O item inverteu os " +
      "sentidos: afirmou VTD para 'ver', mas o correto é VTI + preposição 'a'.",
    explanationWrong:
      "O item está ERRADO. 'Assistir a' (ver/presenciar) = VTI: complemento introduzido por 'a'. " +
      "'Assistiu ao depoimento' (a + o = ao) = CORRETO. VTD de assistir = sentido de ajudar: " +
      "'assistiu o ferido'. Mesma lógica: 'aspirar a um cargo' (VTI = almejar) × 'aspirar o pó' " +
      "(VTD = inalar). Cebraspe cobra essa distinção frequentemente.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Predicado e Transitividade Verbal: VTD, VTI, VTDI, VI e VL",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 4 — Complementos Verbais OD / OI (Q7-Q8)
  // ══════════════════════════════════════════════════════════════════

  // Q7 — OD + OI em VTDI com 'entregar' (FACIL, CERTO)
  {
    id: "qz_port_sint_007",
    statement:
      "Julgue o item conforme a análise sintática da língua portuguesa.\n\n" +
      "Na frase 'O perito entregou o laudo ao delegado', 'o laudo' é objeto direto — identificado " +
      "pela pergunta 'entregou o quê?' (sem preposição) — e 'ao delegado' é objeto indireto — " +
      "identificado pela pergunta 'entregou a quem?' (com preposição 'a'). O verbo 'entregar', " +
      "portanto, é transitivo direto e indireto (VTDI).",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. 'Entregar' é VTDI: exige dois complementos simultaneamente. Análise: " +
      "'entregou O QUÊ?' → 'o laudo' = OD (sem preposição exigida pelo verbo). " +
      "'entregou A QUEM?' → 'ao delegado' (a + o = ao) = OI (preposição 'a' exigida pelo verbo). " +
      "Outros VTDI clássicos: dar (deu o documento ao réu), conceder (concedeu liberdade ao preso), " +
      "informar (informou o fato ao superior), comunicar (comunicou a decisão à equipe). " +
      "Substituição: OD → 'entregou-o' (o = pronome OD); OI → 'entregou-lhe' (lhe = pronome OI).",
    explanationCorrect:
      "Correto! 'Entregar' = VTDI. OD: 'o laudo' (o quê? sem preposição). OI: 'ao delegado' " +
      "(a quem? com preposição 'a'). Teste pronominal: OD → o/a ('entregou-o'); " +
      "OI → lhe ('entregou-lhe'). VTDI clássicos: dar, entregar, conceder, informar, comunicar.",
    explanationWrong:
      "O item está CERTO. 'Entregou o laudo' → OD (o quê? sem preposição). 'Ao delegado' → OI " +
      "(a quem? com preposição 'a'). Verbo = VTDI (transitivo direto E indireto). Distinção: OD " +
      "sem preposição exigida; OI sempre com preposição exigida pelo verbo.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Complementos Verbais: Objeto Direto e Objeto Indireto",
  },

  // Q8 — 'confiar em' = VTI → OI, não OD (MEDIO, ERRADO)
  {
    id: "qz_port_sint_008",
    statement:
      "Julgue o item conforme a análise sintática da língua portuguesa.\n\n" +
      "Na oração 'Os peritos confiaram na eficiência do laboratório', o sintagma 'na eficiência " +
      "do laboratório' é OBJETO DIRETO do verbo 'confiar', pois completa o sentido do verbo sem " +
      "indicar movimento, direção ou qualquer outra noção semântica específica.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O verbo 'confiar' é TRANSITIVO INDIRETO (VTI): exige complemento introduzido " +
      "pela preposição 'EM'. 'Na eficiência' = EM + A (artigo) = 'na' — portanto é OBJETO INDIRETO " +
      "(OI). Pergunta: 'confiaram EM QUÊ?' → 'na eficiência do laboratório' = OI. Objeto direto " +
      "NÃO é introduzido por preposição exigida pelo verbo. Verbos VTI que exigem preposição 'EM': " +
      "confiar EM, acreditar EM, insistir EM, pensar EM, reparar EM. Confundir OD com OI por " +
      "ignorar a preposição é erro clássico cobrado pelo Cebraspe.",
    explanationCorrect:
      "O item está ERRADO. 'Confiar' = VTI (exige preposição 'em'). 'Na eficiência' = OI " +
      "(confiar EM quê?). Objeto direto não tem preposição exigida. OI = preposição obrigatória " +
      "determinada pelo verbo. Outros VTI com 'em': acreditar em, insistir em, pensar em, reparar em.",
    explanationWrong:
      "O item está ERRADO. 'Confiar EM' = VTI. 'Na eficiência do laboratório' = OI (objeto indireto: " +
      "preposição 'em' contraída com artigo 'a' = 'na'). Para ser OD, não deveria haver preposição " +
      "exigida pelo verbo. VTI clássicos: gostar DE, precisar DE, confiar EM, depender DE, necessitar DE.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Complementos Verbais: Objeto Direto e Objeto Indireto",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 5 — Complemento Nominal vs Adjunto Adnominal (Q9-Q10)
  // ══════════════════════════════════════════════════════════════════

  // Q9 — CN de substantivo com sentido verbal (MEDIO, CERTO)
  {
    id: "qz_port_sint_009",
    statement:
      "Julgue o item conforme a análise sintática da língua portuguesa.\n\n" +
      "Em 'O agente tinha consciência dos riscos da missão', o sintagma 'dos riscos da missão' " +
      "é COMPLEMENTO NOMINAL do substantivo 'consciência', pois completa o sentido desse nome — " +
      "que carrega sentido verbal/nominal incompleto — respondendo à pergunta 'consciência de quê?'.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. 'Consciência' deriva semanticamente do verbo 'ter consciência de' e carrega sentido " +
      "que exige complementação: 'consciência DE quê?' A resposta ('dos riscos da missão') é o " +
      "COMPLEMENTO NOMINAL — termo que, introduzido por preposição, completa o sentido de um nome " +
      "(substantivo, adjetivo ou advérbio) que seria incompleto sem ele. Outros CN clássicos: " +
      "'necessidade DE provas' (necessidade de quê?), 'medo DO fracasso' (medo de quê?), " +
      "'confiança NO sistema' (confiança em quê?). A relação é passiva: 'consciência' recebe/abrange " +
      "os riscos — o substantivo é como um 'paciente' da relação.",
    explanationCorrect:
      "Correto! 'Consciência' exige complementação (consciência de quê?). 'Dos riscos da missão' = " +
      "CN (complementa o substantivo com sentido verbal incompleto). CN: nome pede complemento + " +
      "preposição + relação passiva. Outros: 'necessidade de', 'medo de', 'confiança em', 'amor a'.",
    explanationWrong:
      "O item está CERTO. 'Consciência de quê?' → 'dos riscos da missão' = complemento nominal. " +
      "O substantivo 'consciência' tem sentido incompleto sem o complemento. CN: completa nome que " +
      "exige complementação (sentido verbal/adjetival). Adjunto Adnominal seria facultativo e o " +
      "substantivo teria sentido completo sem ele.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Complemento Nominal vs Adjunto Adnominal: A Diferença que as Bancas Adoram",
  },

  // Q10 — SP preposicionado de substantivo completo = AA, não CN (DIFICIL, ERRADO)
  {
    id: "qz_port_sint_010",
    statement:
      "Julgue o item conforme a análise sintática da língua portuguesa.\n\n" +
      "Na frase 'O relatório sobre o crime foi entregue ao promotor', o sintagma preposicionado " +
      "'sobre o crime' é COMPLEMENTO NOMINAL do substantivo 'relatório', pois é introduzido por " +
      "preposição e, ao completar o sentido do substantivo, satisfaz a exigência do nome.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. 'Sobre o crime' é ADJUNTO ADNOMINAL, não complemento nominal. A distinção é " +
      "fundamental: COMPLEMENTO NOMINAL é exigido pelo substantivo (que sem ele fica com sentido " +
      "incompleto, pois carrega base verbal ou adjetival incompleta). ADJUNTO ADNOMINAL é facultativo " +
      "— apenas especifica/qualifica o substantivo que já é completo por si mesmo. 'Relatório' " +
      "é um substantivo comum sem base verbal que exija complementação: 'O relatório foi entregue' " +
      "já faz sentido completo. 'Sobre o crime' apenas especifica QUAL relatório — função de " +
      "adjunto adnominal. Se fosse 'necessidade sobre o crime' (necessidade DE quê?) → CN.",
    explanationCorrect:
      "O item está ERRADO. 'Relatório sobre o crime' → 'sobre o crime' = adjunto adnominal " +
      "(apenas especifica qual relatório; 'relatório' tem sentido completo sem ele). " +
      "CN: substantivo exige complementação (tem sentido incompleto). AA: substantivo é completo, " +
      "o SP é facultativo. 'Relatório' ≠ necessidade/medo/consciência (que exigem complemento).",
    explanationWrong:
      "O item está ERRADO. 'Relatório' é substantivo com sentido completo — não exige complementação. " +
      "'Sobre o crime' apenas qualifica qual relatório = adjunto adnominal (facultativo). " +
      "CN seria para: 'necessidade de provas', 'medo do fracasso', 'consciência dos riscos' — " +
      "nomes que ficam incompletos sem o complemento. Cebraspe cobra: preposição + SP não basta " +
      "para ser CN — o substantivo precisa exigir complementação.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Complemento Nominal vs Adjunto Adnominal: A Diferença que as Bancas Adoram",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 6 — Agente da Passiva (Q11-Q12)
  // ══════════════════════════════════════════════════════════════════

  // Q11 — Transformação ativa → passiva analítica correta (MEDIO, CERTO)
  {
    id: "qz_port_sint_011",
    statement:
      "Julgue o item conforme a análise sintática da língua portuguesa.\n\n" +
      "Na transformação da oração 'A juíza condenou o réu' para a voz passiva analítica, " +
      "obtém-se 'O réu foi condenado pela juíza', em que 'pela juíza' é o AGENTE DA PASSIVA " +
      "— termo que identifica o ser que pratica a ação expressa pelo verbo passivo — " +
      "introduzido pela preposição 'por' (contraída com o artigo 'a': pela).",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. A transformação voz ativa → passiva analítica segue regras fixas: " +
      "1) O OBJETO DIRETO da ativa torna-se o SUJEITO da passiva: 'o réu' (OD) → 'O réu' (sujeito paciente). " +
      "2) O SUJEITO da ativa torna-se o AGENTE DA PASSIVA, introduzido por 'por': 'A juíza' → 'pela juíza'. " +
      "3) O VERBO recebe forma passiva: SER + particípio no mesmo tempo: 'condenou' (pret. perfeito) → 'foi condenado'. " +
      "A preposição do agente da passiva é normalmente 'POR' (ou sua contração: pelo/pela/pelos/pelas). " +
      "Em casos estilísticos ou com verbos de estado pode-se usar 'DE': 'era temido de todos'.",
    explanationCorrect:
      "Correto! Transformação: OD da ativa → sujeito da passiva. Sujeito da ativa → agente da passiva (por). " +
      "Verbo: SER + particípio (mesmo tempo). 'A juíza condenou o réu' → 'O réu foi condenado pela juíza'. " +
      "Agente da passiva: introduzido por 'por' (pelo/pela/pelos/pelas) ou raramente 'de'.",
    explanationWrong:
      "O item está CERTO. 'A juíza condenou o réu' → passiva analítica: 'O réu foi condenado pela juíza'. " +
      "OD ('o réu') → sujeito paciente. Sujeito ('a juíza') → agente da passiva ('pela juíza' = por + a). " +
      "Verbo passivo: 'foi condenado' (ser + particípio, pretérito perfeito). Agente: preposição 'por'.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Agente da Passiva e as Transformações de Voz Verbal",
  },

  // Q12 — HAVER impessoal não admite transformação para passiva (DIFICIL, ERRADO)
  {
    id: "qz_port_sint_012",
    statement:
      "Julgue o item conforme a análise sintática da língua portuguesa.\n\n" +
      "A oração 'Haverá reuniões extraordinárias neste mês' admite transformação para a voz " +
      "passiva analítica. Nessa transformação, 'reuniões extraordinárias' — que é objeto direto " +
      "do verbo 'haver' — torna-se sujeito paciente da oração passiva resultante.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. 'Haver' no sentido de EXISTÊNCIA ou OCORRÊNCIA é verbo IMPESSOAL: não tem sujeito " +
      "e é conjugado apenas na 3ª pessoa do singular. 'Reuniões extraordinárias' funciona como " +
      "OBJETO DIRETO do 'haver' impessoal (haverá o quê? = reuniões). Por ser impessoal — sem " +
      "sujeito — não é possível a transformação para a voz passiva analítica: esta exige que haja " +
      "sujeito na ativa que se torne agente na passiva. Verbos impessoais que NÃO admitem passiva: " +
      "HAVER (existir/ocorrer), FAZER (fenômeno/tempo), CHOVER, NEVAR, TROVEJAR. Erro grave de prova: " +
      "afirmar que 'Reuniões foram havidas' = INCORRETO.",
    explanationCorrect:
      "O item está ERRADO. 'Haver' existencial/impessoal = sem sujeito → não admite transformação " +
      "passiva. 'Reuniões extraordinárias' = OD do 'haver' impessoal (não sujeito). Passiva exige " +
      "sujeito na ativa. HAVER impessoal: sempre 3ª pessoa singular, sem sujeito, sem passiva.",
    explanationWrong:
      "O item está ERRADO. 'Haver' no sentido de existência/ocorrência é impessoal: sem sujeito, " +
      "sempre na 3ª pessoa singular. 'Reuniões extraordinárias' = OD (haverá o quê?), mas como " +
      "o verbo é impessoal (sem sujeito agente), não há como fazer a transformação passiva. " +
      "'Reuniões foram havidas' = ERRADO. Cebraspe cobra: 'havia provas' / 'houve conflito' → " +
      "impessoal → sem passiva, complemento = OD (não sujeito).",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Agente da Passiva e as Transformações de Voz Verbal",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n📝  Seed R24: Língua Portuguesa — Sintaxe da Oração\n");

  // ── 1. Encontrar Subject ────────────────────────────────────────────────
  let subjectId = await findSubject("Portugu");
  if (!subjectId) subjectId = await findSubject("LINGUA_PORTUGUESA");
  if (!subjectId) subjectId = await findSubject("Língua");
  if (!subjectId) {
    console.error("❌ Subject para Língua Portuguesa não encontrado.");
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

  // ── 4. Criar tópico 'Sintaxe' ───────────────────────────────────────────
  const topicId = await findOrCreateTopic("Sintaxe", subjectId);
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
  console.error("❌ Seed R24 falhou:", err);
  process.exit(1);
});
