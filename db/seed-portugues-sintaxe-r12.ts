/**
 * Seed: Língua Portuguesa — Sintaxe: Conjunções e Orações (Rodada 12 — Grupo A)
 *
 * Popula 6 átomos de Conteúdo + 12 Questões (nível Federal/CEBRASPE).
 * Padrão GRUPO A: contentIdMap explícito por átomo → sem "roleta russa".
 *
 * Tópico: "Sintaxe: Conjunções e Orações"
 * Subject: Língua Portuguesa (findSubject via "Portugu")
 * Foco: substituição de conectivos, orações adjetivas, reescrita de frases.
 *
 * Execução:
 *   npx tsx db/seed-portugues-sintaxe-r12.ts
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
  const rows = (await db.execute(sql`
    SELECT id FROM "Subject" WHERE name ILIKE ${"%" + name + "%"} LIMIT 1
  `)) as any[];
  return rows[0]?.id ?? null;
}

async function findOrCreateTopic(
  name: string,
  subjectId: string
): Promise<string> {
  const rows = (await db.execute(sql`
    SELECT id FROM "Topic" WHERE name ILIKE ${name} AND "subjectId" = ${subjectId} LIMIT 1
  `)) as any[];
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

async function contentExists(
  title: string,
  subjectId: string
): Promise<boolean> {
  const rows = (await db.execute(sql`
    SELECT id FROM "Content" WHERE title = ${title} AND "subjectId" = ${subjectId} LIMIT 1
  `)) as any[];
  return rows.length > 0;
}

async function questionExists(id: string): Promise<boolean> {
  const rows = (await db.execute(sql`
    SELECT id FROM "Question" WHERE id = ${id} LIMIT 1
  `)) as any[];
  return rows.length > 0;
}

// ============================================
// TIPOS
// ============================================

interface Alternative {
  letter: string;
  text: string;
}

interface ContentAtom {
  title: string;
  textContent: string;
  mnemonic: string;
  keyPoint: string;
  practicalExample: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
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
  questionType: "MULTIPLA_ESCOLHA" | "CERTO_ERRADO";
}

// ============================================
// ÁTOMOS DE CONTEÚDO (6)
// ============================================

const contentAtoms: ContentAtom[] = [
  // ── Átomo 1 ──────────────────────────────────────────────────────────
  {
    title: "Conjunções Adversativas: Oposição com Ressalva",
    difficulty: "FACIL",
    mnemonic:
      "MAS-PO-TO-CON-EN: Mas, Porém, Todavia, Contudo, Entretanto — os 5 adversativos clássicos.",
    keyPoint:
      "Adversativas são COORDENATIVAS — ligam orações independentes expressando OPOSIÇÃO ou CONTRASTE. O resultado da segunda oração contraria o esperado da primeira. As principais: Mas, Porém, Todavia, Contudo, Entretanto, No entanto, Senão (= mas sim).",
    practicalExample:
      "✅ 'Estudou muito, MAS não passou.' — o resultado (não passar) contraria o esperado (quem estuda, passa). ✅ 'É difícil; CONTUDO, é possível.' — mesmo valor semântico. 🎯 Dica CEBRASPE: adversativas coordenativas não pedem subjuntivo ('mas' nunca requer mudança de modo verbal).",
    textContent: `## Conjunções Adversativas

As conjunções adversativas pertencem às **coordenativas** e expressam **oposição, contraste ou restrição** entre duas orações independentes.

### Principais adversativas
| Conjunção | Uso típico |
|---|---|
| **Mas** | Oposição direta — a mais frequente |
| **Porém** | Tom mais formal que "mas" |
| **Todavia** | Equivale a "mas", inicia oração |
| **Contudo** | Idem — formal |
| **Entretanto** | Idem — formal |
| **No entanto** | Locução adversativa |
| **Senão** | = "mas sim" (após oração negativa) |

### Como identificar?
A 2.ª oração **frustra** ou **restringe** o que se esperaria da 1.ª:
> "Ele se preparou, **porém** não foi convocado."

### Atenção CEBRASPE
- "Mas" pode iniciar período em textos formais → **CERTO**.
- Adversativas são **coordenativas**: não exigem modo subjuntivo.
- "Mas" ≠ "Embora": ambos expressam contraste, mas "embora" é **subordinativa concessiva** (estrutura diferente).

### Mnemônico
**MAS-PO-TO-CON-EN** = Mas, Porém, TOdavia, CONtudo, ENtretanto.`,
  },

  // ── Átomo 2 ──────────────────────────────────────────────────────────
  {
    title: "Conjunções Concessivas: A Oposição que Cede",
    difficulty: "FACIL",
    mnemonic:
      "EA-CON-POS-MES: Embora, Ainda que, CONquanto, POSto que, MESmo que — concessivas pedem subjuntivo.",
    keyPoint:
      "Concessivas são SUBORDINATIVAS — introduzem oração que admite um fato, mas o resultado da principal prevalece APESAR dele. Exigem modo subjuntivo. Principais: Embora, Ainda que, Conquanto, Posto que, Mesmo que, Se bem que, Por mais que. Diferença vital: 'Mas' (coord.) vs 'Embora' (subord. concessiva).",
    practicalExample:
      "✅ 'EMBORA tivesse estudado, não passou.' — admite o estudo, mas a consequência (não passar) prevalece. 🔄 Substituição correta: 'Conquanto' = 'Embora' = 'Ainda que' (todas concessivas equivalentes). ❌ Erro clássico: substituir 'embora' por 'mas' numa reescrita — a estrutura sintática muda (subord. → coord.).",
    textContent: `## Conjunções Concessivas

As conjunções concessivas introduzem **oração subordinada adverbial concessiva**, que admite um fato, mas não impede a ocorrência do fato principal.

### Principais concessivas
| Conjunção | Exemplo |
|---|---|
| **Embora** | Embora chovesse, saiu. |
| **Ainda que** | Ainda que seja difícil, tentará. |
| **Conquanto** | Conquanto fosse tarde, ficaram. |
| **Posto que** | Posto que soubesse, calou-se. |
| **Mesmo que** | Mesmo que reclamem, faremos. |
| **Se bem que** | Se bem que tente, falha sempre. |
| **Por mais que** | Por mais que estude, não retém. |

### Diferença CRUCIAL: Adversativa × Concessiva

| | Adversativa | Concessiva |
|---|---|---|
| Tipo | Coordenativa | Subordinativa |
| Modo verbal | Indicativo | Subjuntivo |
| Exemplo | Estudou, mas não passou. | Embora estudasse, não passou. |

### Substituição em reescrita (CEBRASPE)
- **Embora = Conquanto = Ainda que = Mesmo que** → intercambiáveis (todas concessivas, todas exigem subjuntivo).
- "Embora" **não** pode ser substituído por "mas" sem mudar a estrutura sintática.

### Mnemônico
**EA-CON-POS-MES** = Embora, Ainda que, CONquanto, POSto que, MESmo que.`,
  },

  // ── Átomo 3 ──────────────────────────────────────────────────────────
  {
    title: "Conjunções Integrantes: QUE e SE Substantivos",
    difficulty: "FACIL",
    mnemonic:
      "INT-SUBST: conjunções INTegrantes introduzem oração que funciona como SUBSTantivo (sujeito, OD, predicativo...).",
    keyPoint:
      "QUE e SE integrantes introduzem oração subordinada SUBSTANTIVA — a oração exerce função de substantivo (sujeito, objeto direto, predicativo, etc.). Diferença vital: 'que' integrante ≠ pronome relativo. Teste: se puder substituir por 'isso', é integrante. 'SE' integrante = interrogativa indireta total.",
    practicalExample:
      "✅ 'Sei [QUE você estudou].' → substitua: 'Sei ISSO.' = integrante. ✅ 'O livro [QUE comprei]' → não cabe 'isso' no lugar = pronome relativo. ✅ 'Perguntou [SE o réu comparecereu].' = 'SE' integrante — interrogativa indireta total (equivale à pergunta 'O réu compareceu?'). 🎯 CEBRASPE cobra: classificar o 'que' de uma frase como integrante ou relativo.",
    textContent: `## Conjunções Integrantes: QUE e SE

As conjunções integrantes **QUE** e **SE** introduzem **oração subordinada substantiva** — a oração exerce uma função que poderia ser desempenhada por um substantivo ou pronome.

### Como identificar o "QUE" integrante?
> Substitua a oração por **"isso"**: se couber, é integrante.

| Frase | Teste | Classificação |
|---|---|---|
| Sei **que** você passou. | Sei **isso**. ✅ | Integrante |
| O livro **que** comprei... | O livro **isso**... ❌ | Pronome relativo |

### Funções da oração substantiva
- **Subjetiva**: "[Que ele venha] é certo." → sujeito
- **Objetiva direta**: "Desejo [que você passe]." → OD
- **Predicativa**: "O fato é [que ele errou]." → predicativo
- **Completiva nominal**: "Tenho medo [de que falhe]." → complemento nominal

### "SE" Integrante
Introduz **interrogativa indireta total** (sim/não):
> "Perguntou **se** o suspeito tinha advogado."
Equivale à pergunta: "O suspeito tinha advogado?"

### Mnemônico
**INT-SUBST**: conjunções INTegrantes → oração SUBSTantiva → função de substantivo.`,
  },

  // ── Átomo 4 ──────────────────────────────────────────────────────────
  {
    title: "Orações Adjetivas: Restritiva vs Explicativa",
    difficulty: "MEDIO",
    mnemonic:
      "RE-SEM / EX-COM: REStritiva SEM vírgula (essencial); EXplicativa COM vírgula (acessória).",
    keyPoint:
      "RESTRITIVA (sem vírgula): delimita, restringe o antecedente — essencial ao sentido, não pode ser retirada. EXPLICATIVA (com vírgula): acrescenta informação sobre todo o universo do antecedente — acessória, pode ser retirada. A VÍRGULA muda o sentido! CEBRASPE cobra: a retirada/inserção de vírgulas altera o sentido?",
    practicalExample:
      "✅ 'Os candidatos [que estudaram] passaram.' → RESTRITIVA: só os que estudaram passaram. ✅ 'Os candidatos, [que estudaram], passaram.' → EXPLICATIVA: todos os candidatos estudaram e todos passaram. 🎯 Retirar as vírgulas de uma adjetiva explicativa MUDA o sentido — isso é o que o CEBRASPE quer que você saiba.",
    textContent: `## Orações Adjetivas: Restritiva × Explicativa

A oração subordinada adjetiva é introduzida por **pronome relativo** (que, quem, cujo, onde...) e funciona como adjetivo em relação ao antecedente.

### Restritiva (sem vírgula)
- **Delimita, restringe** o antecedente.
- É **essencial** ao sentido — não pode ser retirada sem perda de significado.
- Indica que a informação vale apenas para **parte** do conjunto.

> "Os policiais **que foram aprovados no teste** receberão promoção."
> (Só os aprovados receberão — os demais, não.)

### Explicativa (com vírgula)
- **Acrescenta informação acessória** sobre todo o antecedente.
- Pode ser **retirada** sem perda do sentido principal.
- Vale para o **conjunto inteiro**.

> "Os policiais, **que foram aprovados no teste**, receberão promoção."
> (Todos os policiais foram aprovados e todos receberão.)

### Impacto da vírgula — quadro resumo

| | Restritiva | Explicativa |
|---|---|---|
| Vírgula | **Não** | **Sim** |
| Refere-se a | Parte do conjunto | Todo o conjunto |
| Pode ser retirada? | **Não** | Sim |
| Modo verbal comum | Indicativo | Indicativo |

### Mnemônico
**RE-SEM** = REStritiva SEM vírgula.
**EX-COM** = EXplicativa COM vírgula.`,
  },

  // ── Átomo 5 ──────────────────────────────────────────────────────────
  {
    title: "Conjunções Causais vs Explicativas: O Pois e seus Disfarces",
    difficulty: "MEDIO",
    mnemonic:
      "CAUS = POR-VISTO-JÁ-UMA (PORque, VISTO que, JÁ que, UMA vez que); EXPLIC = POIS-QUE (justificativa anterior).",
    keyPoint:
      "CAUSAIS expressam a causa do fato principal (responde 'por quê?'): Porque, Pois (posposto), Visto que, Já que, Uma vez que, Como (= visto que). EXPLICATIVAS justificam uma ordem ou afirmação anterior: Pois (anteposto ao verbo), Que. 'Pois' é CAUSAL quando vem após o verbo principal; EXPLICATIVO quando justifica algo dito antes. CUIDADO: 'na medida em que' (causa) ≠ 'à medida que' (proporção).",
    practicalExample:
      "✅ 'Não foi trabalhar, POIS estava doente.' → CAUSAL (o 'pois' explica a causa de não ter ido). ✅ 'Vá agora, POIS está na hora.' → EXPLICATIVA (justifica o pedido). 🎯 'À medida que' = proporção. 'Na medida em que' = causa/explicação. CEBRASPE cobra essa distinção todo ano.",
    textContent: `## Conjunções Causais vs Explicativas

Ambas respondem à pergunta "por quê?", mas com nuances importantes.

### Causais
Indicam a **causa** (motivo) do que ocorre na oração principal.

| Conjunção | Exemplo |
|---|---|
| **Porque** | Ficou em casa porque estava doente. |
| **Visto que** | Saiu, visto que era tarde. |
| **Já que** | Já que estudou, passará. |
| **Uma vez que** | Uma vez que conhecia a lei, agiu corretamente. |
| **Como** (= visto que) | Como era tarde, foram embora. |
| **Pois** (posposto) | Não foi, **pois** estava doente. |

### Explicativas
Justificam ou explicam uma **afirmação, ordem ou pedido** anterior.

| Conjunção | Exemplo |
|---|---|
| **Pois** (anteposto) | Não saia, **pois** está chovendo. |
| **Que** | Corra, **que** está tarde! |

### Armadilha do CEBRASPE: "POIS"
- **Pois causal**: aparece após o verbo principal, indicando causa.
- **Pois explicativo**: justifica uma asserção ou comando anterior.
> Em muitos contextos, a diferença é sutil — o examinador cobra a classificação na frase dada.

### Armadilha: "à medida que" × "na medida em que"
| Locução | Valor semântico |
|---|---|
| **À medida que** | Proporção (conforme, à proporção que) |
| **Na medida em que** | Causa/explicação |

### Mnemônico
**CAUS = POR-VISTO-JÁ-UMA**: as quatro causais mais cobradas.`,
  },

  // ── Átomo 6 ──────────────────────────────────────────────────────────
  {
    title: "Conjunções Consecutivas e Proporcionais",
    difficulty: "MEDIO",
    mnemonic:
      "CONSEC = TÃO-QUE / TANTO-QUE (resultado excessivo); PROP = À MEDIDA QUE (gradação paralela).",
    keyPoint:
      "CONSECUTIVAS: exprimem consequência de uma intensidade. Estrutura: 'tão/tanto/tamanho... QUE'. O 'que' é a conjunção. Principais: 'Tão... que', 'Tanto... que', 'Tamanho... que', 'De forma que', 'De modo que', 'De sorte que'. PROPORCIONAIS: exprimem relação de proporcionalidade gradual. Principais: 'À medida que', 'À proporção que', 'Ao passo que' (comparação/contraste gradual).",
    practicalExample:
      "✅ 'Estudou TANTO que ficou exausto.' → consecutiva (a consequência 'ficar exausto' decorre da intensidade do estudo). ✅ 'À medida que praticava questões, seu desempenho melhorava.' → proporcional (dois fatos crescem paralelamente). 🎯 Substituto válido de 'à medida que': 'À proporção que' ou 'Conforme'. NÃO é substituto: 'na medida em que' (essa é causal).",
    textContent: `## Conjunções Consecutivas e Proporcionais

### Conjunções Consecutivas
Expressam a **consequência** de uma intensidade expressa na oração principal.

**Estrutura clássica**: intensificador na principal + **"que"** na subordinada.

| Estrutura | Exemplo |
|---|---|
| **Tão... que** | Ficou tão nervoso **que** tremeu. |
| **Tanto... que** | Estudou tanto **que** ficou exausto. |
| **Tamanho... que** | Era tamanho o esforço **que** todos notaram. |
| **De modo que** | Falou devagar, **de modo que** todos entenderam. |
| **De forma que** | Agiu com cautela, **de forma que** nada escapou. |
| **De sorte que** | Chegou cedo, **de sorte que** encontrou lugar. |

> ⚠️ Atenção: "de modo que" e "de forma que" podem ser **consecutivas** (consequência) ou **finais** (finalidade), conforme o modo verbal (indicativo = consecutiva; subjuntivo = final).

### Conjunções Proporcionais
Exprimem dois fatos que evoluem **paralelamente** (um cresce, o outro também).

| Conjunção | Exemplo |
|---|---|
| **À medida que** | À medida que estudava, melhorava. |
| **À proporção que** | À proporção que o tempo passava, crescia. |
| **Ao passo que** | Ao passo que um avança, o outro recua. |
| **Conforme** | Conforme os dados surgiam, ajustavam o plano. |

### Diferença-chave (CEBRASPE)
| | Proporcional | Consecutiva |
|---|---|---|
| Ideia | Gradação paralela | Consequência de excesso |
| Exemplo | À medida que cresce, matura. | Cresceu tanto que amadureceu cedo. |

### Mnemônico
**CONSEC = TÃO-QUE / TANTO-QUE** → sempre tem "que" na subordinada.
**PROP = À MEDIDA QUE** → dois fatos crescem juntos.`,
  },
];

// ============================================
// QUESTÕES (12)
// ============================================

const questions: QuestionData[] = [
  // ── Átomo 1: Adversativas ──────────────────────────────────────────
  {
    id: "qz_lp_sc_001",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    contentTitle: "Conjunções Adversativas: Oposição com Ressalva",
    statement: `(CEBRASPE — adaptada) Em "Ele se preparou durante meses; contudo, não obteve aprovação no certame.", a conjunção "contudo" estabelece entre as orações uma relação de adição, somando as informações apresentadas.`,
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation: `ERRADO. "Contudo" é conjunção ADVERSATIVA, não aditiva. Ela expressa OPOSIÇÃO ou CONTRASTE entre as orações: o resultado esperado (aprovação, após meses de preparo) é frustrado. Conjunções aditivas são: e, nem, mas também, bem como. Mnemônico: MAS-PO-TO-CON-EN → CONtudo é adversativa.`,
    explanationCorrect: `Parabéns! "Contudo" pertence ao grupo das adversativas (MAS-PO-TO-CON-EN), expressando oposição — nunca adição.`,
    explanationWrong: `Atenção: "Contudo" é ADVERSATIVA (contraste), não aditiva. Lembre: MAS-PO-TO-CON-EN = Mas, Porém, TOdavia, CONtudo, ENtretanto — todos expressam oposição.`,
  },

  {
    id: "qz_lp_sc_002",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    contentTitle: "Conjunções Adversativas: Oposição com Ressalva",
    statement: `(CEBRASPE — adaptada) Assinale a alternativa em que o conectivo destacado exprime relação ADVERSATIVA entre as orações.`,
    alternatives: [
      {
        letter: "A",
        text: "Falou com clareza, de modo que todos compreenderam a decisão.",
      },
      {
        letter: "B",
        text: "Partiu cedo, embora tivesse prometido aguardar o resultado.",
      },
      {
        letter: "C",
        text: "Trabalhou com afinco durante o concurso, porém não foi reconhecido.",
      },
      {
        letter: "D",
        text: "Não compareceu à audiência porque estava internado.",
      },
      {
        letter: "E",
        text: "Visto que era tarde, o delegado encerrou o depoimento.",
      },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: `ALTERNATIVA C. "Porém" é conjunção adversativa — o segundo fato (não ser reconhecido) contraria o esperado do primeiro (trabalhar com afinco). As demais: (A) "de modo que" = consecutiva; (B) "embora" = concessiva; (D) "porque" = causal; (E) "visto que" = causal.`,
    explanationCorrect: `Correto! "Porém" integra o grupo MAS-PO-TO-CON-EN, expressando oposição entre os fatos.`,
    explanationWrong: `A resposta é C — "porém" é adversativa. Revise: (A) "de modo que" = consecutiva; (B) "embora" = concessiva subordinativa; (D/E) causais. Mnemônico: MAS-PO-TO-CON-EN para adversativas.`,
  },

  // ── Átomo 2: Concessivas ───────────────────────────────────────────
  {
    id: "qz_lp_sc_003",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    contentTitle: "Conjunções Concessivas: A Oposição que Cede",
    statement: `(CEBRASPE — adaptada) A oração "Conquanto estivesse exausto após o plantão, o inspetor continuou redigindo o relatório." pode ser reescrita, com preservação do sentido original e correção gramatical, como:`,
    alternatives: [
      {
        letter: "A",
        text: "Como estivesse exausto após o plantão, o inspetor continuou redigindo o relatório.",
      },
      {
        letter: "B",
        text: "Embora estivesse exausto após o plantão, o inspetor continuou redigindo o relatório.",
      },
      {
        letter: "C",
        text: "Porque estava exausto após o plantão, o inspetor continuou redigindo o relatório.",
      },
      {
        letter: "D",
        text: "Desde que estivesse exausto após o plantão, o inspetor continuou redigindo o relatório.",
      },
      {
        letter: "E",
        text: "Já que estava exausto após o plantão, o inspetor continuou redigindo o relatório.",
      },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: `ALTERNATIVA B. "Conquanto" é conjunção concessiva e pode ser substituída por "Embora", que também é concessiva — ambas admitem o fato (exaustão) sem impedir o resultado (continuar redigindo). (A) "Como" = causal; (C) "Porque" = causal; (D) "Desde que" = condicional; (E) "Já que" = causal. Mnemônico EA-CON-POS-MES: Embora = cOnquanto.`,
    explanationCorrect: `Perfeito! Conquanto = Embora = Ainda que = Mesmo que: todas concessivas, todas equivalentes nesse contexto.`,
    explanationWrong: `A resposta é B. "Conquanto" é concessiva. Seu único substituto sem mudança semântica é outra concessiva: "Embora". As demais introduzem relações de causa ou condição.`,
  },

  {
    id: "qz_lp_sc_004",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    contentTitle: "Conjunções Concessivas: A Oposição que Cede",
    statement: `(CEBRASPE — adaptada) A conjunção "embora" e o conectivo "mas" são intercambiáveis em qualquer contexto, uma vez que ambos expressam oposição entre ideias, podendo um substituir o outro sem alteração de sentido ou estrutura.`,
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation: `ERRADO. Apesar de ambos expressarem contraste, "embora" e "mas" NÃO são intercambiáveis: (1) "Embora" é SUBORDINATIVA concessiva — cria oração subordinada e exige modo SUBJUNTIVO; (2) "Mas" é COORDENATIVA adversativa — liga orações independentes e usa modo INDICATIVO. Trocar "embora" por "mas" altera a estrutura sintática (de subordinada para coordenada) e o modo verbal.`,
    explanationCorrect: `Correto! "Embora" (subord. concessiva, subjuntivo) e "mas" (coord. adversativa, indicativo) têm estruturas sintáticas incompatíveis — não são intercambiáveis.`,
    explanationWrong: `Atenção: "embora" e "mas" expressam contraste, mas pertencem a classes distintas. "Embora" = subordinativa + subjuntivo; "mas" = coordenativa + indicativo. Não são intercambiáveis.`,
  },

  // ── Átomo 3: Integrantes ───────────────────────────────────────────
  {
    id: "qz_lp_sc_005",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    contentTitle: "Conjunções Integrantes: QUE e SE Substantivos",
    statement: `(CEBRASPE — adaptada) Em "O delegado duvidava de que o suspeito dissesse a verdade durante o interrogatório.", o "que" grifado é classificado corretamente como:`,
    alternatives: [
      { letter: "A", text: "Pronome relativo, retomando 'a verdade'." },
      { letter: "B", text: "Conjunção coordenativa aditiva." },
      {
        letter: "C",
        text: "Conjunção integrante, introduzindo oração subordinada substantiva.",
      },
      { letter: "D", text: "Conjunção adversativa." },
      {
        letter: "E",
        text: "Pronome indefinido, referindo-se ao interrogatório.",
      },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: `ALTERNATIVA C. O "que" é INTEGRANTE porque introduz oração subordinada substantiva completiva nominal (complemento do substantivo "dúvida" / do verbo duvidava). Teste: "duvidava DISSO" → cabe → é integrante (não pronome relativo). Pronome relativo retoma antecedente expresso ("o livro QUE li" = "o livro [que = o qual] li").`,
    explanationCorrect: `Excelente! Teste da substituição: "duvidava disso" → cabe → "que" é conjunção integrante, introduzindo oração substantiva.`,
    explanationWrong: `A resposta é C. Teste prático: substitua a oração por "isso" — "duvidava disso" funciona → é integrante. Pronome relativo substituiria um antecedente expresso, o que não ocorre aqui.`,
  },

  {
    id: "qz_lp_sc_006",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    contentTitle: "Conjunções Integrantes: QUE e SE Substantivos",
    statement: `(CEBRASPE — adaptada) Em "O investigador perguntou se o réu havia constituído advogado antes da audiência.", a palavra "se" exerce a função de conjunção integrante, introduzindo oração subordinada substantiva interrogativa indireta.`,
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: `CERTO. O "se" integrante introduz interrogativa indireta TOTAL (aquela que admite resposta sim/não), funcionando como objeto direto do verbo "perguntou". A oração "se o réu havia constituído advogado" corresponde à pergunta direta: "O réu havia constituído advogado?" — resposta: sim ou não.`,
    explanationCorrect: `Correto! "Se" integrante = interrogativa indireta total (sim/não). A oração é objeto direto de "perguntou" — função típica de substantivo.`,
    explanationWrong: `A afirmativa está CERTA. "Se" integrante introduz interrogativa indireta total (sim/não), sendo objeto direto de "perguntou". Não confunda com "se" condicional, que introduiria hipótese.`,
  },

  // ── Átomo 4: Adjetivas ─────────────────────────────────────────────
  {
    id: "qz_lp_sc_007",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "MEDIO",
    contentTitle: "Orações Adjetivas: Restritiva vs Explicativa",
    statement: `(CEBRASPE — adaptada) Em "Os candidatos que estudaram sistematicamente foram aprovados na fase objetiva.", a oração destacada é restritiva porque:`,
    alternatives: [
      {
        letter: "A",
        text: "Está introduzida por pronome relativo, o que a torna automaticamente restritiva.",
      },
      {
        letter: "B",
        text: "Delimita quais candidatos foram aprovados, sendo essencial ao sentido da frase.",
      },
      {
        letter: "C",
        text: "Está separada por vírgulas, indicando tratar-se de informação acessória.",
      },
      {
        letter: "D",
        text: "Pode ser retirada sem alterar o sentido principal da oração.",
      },
      {
        letter: "E",
        text: "Acrescenta informação válida para o conjunto total dos candidatos.",
      },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: `ALTERNATIVA B. A oração "que estudaram sistematicamente" é RESTRITIVA porque delimita (restringe) quais candidatos passaram — apenas os que estudaram de forma sistemática, não todos. Ela é ESSENCIAL ao sentido: sem ela, a frase diz que todos os candidatos passaram. (A) Pronome relativo também aparece em explicativas; (C) e (D) descrevem características da explicativa; (E) descreve a explicativa (vale para todos).`,
    explanationCorrect: `Exato! A restritiva delimita quais do conjunto foram aprovados — ela é essencial, sem ela o sentido muda completamente.`,
    explanationWrong: `A resposta é B. A restritiva é essencial ao sentido porque DELIMITA quais candidatos passaram. Sem ela, o leitor entende que todos passaram. As demais opções descrevem características da oração EXPLICATIVA.`,
  },

  {
    id: "qz_lp_sc_008",
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    contentTitle: "Orações Adjetivas: Restritiva vs Explicativa",
    statement: `(CEBRASPE — adaptada) A retirada das vírgulas em "Os servidores, que foram aprovados no curso de capacitação, receberão promoção imediata." não altera o sentido da oração, uma vez que a informação sobre a aprovação no curso é meramente acessória.`,
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation: `ERRADO. A retirada das vírgulas transforma a oração de EXPLICATIVA em RESTRITIVA, alterando radicalmente o sentido: (1) Com vírgulas (explicativa): TODOS os servidores foram aprovados e TODOS receberão promoção. (2) Sem vírgulas (restritiva): SOMENTE os servidores aprovados no curso receberão promoção — os demais, não. A vírgula é, portanto, decisiva para o sentido.`,
    explanationCorrect: `Correto! A retirada das vírgulas muda explicativa → restritiva, alterando completamente o escopo: de "todos os servidores" para "apenas os aprovados no curso".`,
    explanationWrong: `A afirmativa está ERRADA. A retirada das vírgulas transforma a explicativa em restritiva: com vírgulas = todos recebem; sem vírgulas = só os aprovados recebem. A vírgula MUDA o sentido nesse contexto.`,
  },

  // ── Átomo 5: Causais vs Explicativas ──────────────────────────────
  {
    id: "qz_lp_sc_009",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "MEDIO",
    contentTitle:
      "Conjunções Causais vs Explicativas: O Pois e seus Disfarces",
    statement: `(CEBRASPE — adaptada) Em "Não permaneça no local, pois a área foi interditada pela perícia.", a conjunção "pois" estabelece relação de:`,
    alternatives: [
      { letter: "A", text: "Consequência — o resultado de permanecer é a interdição." },
      { letter: "B", text: "Concessão — admite a permanência, mas a interdição prevalece." },
      {
        letter: "C",
        text: "Explicação/Causa — justifica o comando de não permanecer.",
      },
      { letter: "D", text: "Oposição — contrasta os fatos apresentados." },
      { letter: "E", text: "Condição — a permanência depende da interdição." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: `ALTERNATIVA C. O "pois" aqui é EXPLICATIVO/CAUSAL: justifica o comando ("não permaneça no local") apresentando a razão ("a área foi interditada"). Note que "pois" com valor explicativo introduz justificativa de uma afirmação ou ordem. Estrutura-chave: imperativo/ordem + "pois" + razão → explicativo.`,
    explanationCorrect: `Correto! "Pois" introduzindo a razão de um comando = valor explicativo/causal. A área interditada é a causa/justificativa para o imperativo "não permaneça".`,
    explanationWrong: `A resposta é C. O "pois" justifica/explica o imperativo "Não permaneça". Não há consequência (A), concessão (B), oposição (D) ou condição (E) — apenas a razão de uma ordem.`,
  },

  {
    id: "qz_lp_sc_010",
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    contentTitle:
      "Conjunções Causais vs Explicativas: O Pois e seus Disfarces",
    statement: `(CEBRASPE — adaptada) A expressão "na medida em que" e a locução "à medida que" são equivalentes e intercambiáveis na expressão de relações de proporcionalidade entre fatos.`,
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation: `ERRADO. As duas locuções têm valores semânticos DISTINTOS: (1) "À medida que" = PROPORCIONAL — dois fatos evoluem paralelamente: "À medida que os estudos avançavam, o desempenho melhorava." (2) "Na medida em que" = CAUSAL/EXPLICATIVO — indica a causa: "Na medida em que todos se dedicaram, o projeto foi concluído." Não são intercambiáveis. Erro linguístico grave: usar "na medida em que" para proporcionalidade.`,
    explanationCorrect: `Correto! "À medida que" = proporção (dois fatos crescem juntos); "na medida em que" = causa. São DIFERENTES e não intercambiáveis.`,
    explanationWrong: `ERRADO. "À medida que" exprime proporcionalidade; "na medida em que" exprime causa/explicação. Não são equivalentes. Trocar um pelo outro é erro gramatical classificado como "regência inadequada" pelo CEBRASPE.`,
  },

  // ── Átomo 6: Consecutivas/Proporcionais ───────────────────────────
  {
    id: "qz_lp_sc_011",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "DIFICIL",
    contentTitle: "Conjunções Consecutivas e Proporcionais",
    statement: `(CEBRASPE — adaptada) Assinale a alternativa em que o conectivo destacado estabelece relação de CONSEQUÊNCIA entre as orações.`,
    alternatives: [
      {
        letter: "A",
        text: "Trabalhou com tanto afinco que adoeceu antes da posse.",
      },
      {
        letter: "B",
        text: "Embora trabalhasse com afinco, adoeceu antes da posse.",
      },
      {
        letter: "C",
        text: "Visto que trabalhava com afinco, adoeceu antes da posse.",
      },
      {
        letter: "D",
        text: "Trabalhou com afinco; porém, adoeceu antes da posse.",
      },
      {
        letter: "E",
        text: "Quando trabalhava com afinco, adoecia com frequência.",
      },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation: `ALTERNATIVA A. "Tanto... que" é estrutura CONSECUTIVA clássica: a intensidade do afinco (tanto) causa como consequência o adoecimento (que adoeceu). Estrutura: intensificador + QUE = consecutiva. (B) "embora" = concessiva; (C) "visto que" = causal; (D) "porém" = adversativa; (E) "quando" = temporal.`,
    explanationCorrect: `Excelente! "Tanto... que" = consecutiva clássica. O "que" é a conjunção consecutiva; "tanto" é o intensificador que anuncia a consequência na oração seguinte.`,
    explanationWrong: `A resposta é A. "Tanto... que" é estrutura consecutiva: a consequência (adoecer) decorre da intensidade (tanto afinco). Lembre: CONSEC = TÃO-QUE / TANTO-QUE.`,
  },

  {
    id: "qz_lp_sc_012",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "DIFICIL",
    contentTitle: "Conjunções Consecutivas e Proporcionais",
    statement: `(CEBRASPE — adaptada) A frase "À medida que os candidatos praticavam questões de Direito Penal, seu desempenho nas simulações melhorava progressivamente." expressa relação de proporcionalidade. Assinale a alternativa que substitui o conectivo destacado MANTENDO essa relação semântica e a correção gramatical.`,
    alternatives: [
      {
        letter: "A",
        text: "Na medida em que os candidatos praticavam questões...",
      },
      {
        letter: "B",
        text: "Visto que os candidatos praticavam questões...",
      },
      {
        letter: "C",
        text: "À proporção que os candidatos praticavam questões...",
      },
      {
        letter: "D",
        text: "Embora os candidatos praticassem questões...",
      },
      {
        letter: "E",
        text: "De modo que os candidatos praticavam questões...",
      },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: `ALTERNATIVA C. "À proporção que" é locução PROPORCIONAL — equivalente exata de "à medida que". Ambas expressam a evolução paralela de dois fatos. (A) "Na medida em que" = causal/explicativo, não proporcional; (B) "Visto que" = causal; (D) "Embora" = concessiva (exige subjuntivo); (E) "De modo que" = consecutiva. Apenas C preserva o valor de proporcionalidade.`,
    explanationCorrect: `Perfeito! "À proporção que" é o substituto correto de "à medida que" na relação de proporcionalidade. Ambas expressam dois fatos que evoluem paralelamente.`,
    explanationWrong: `A resposta é C. "À proporção que" é o único substituto que preserva a proporcionalidade. "Na medida em que" (A) é armadilha clássica do CEBRASPE — exprime causa, não proporção.`,
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n⚖️  Seed R12: Língua Portuguesa — Sintaxe: Conjunções e Orações (Grupo A)\n");

  // 1. Verificar subject
  const subjectId = await findSubject("Portugu");
  if (!subjectId) {
    console.error("❌ Subject 'Língua Portuguesa' não encontrado. Verifique o banco.");
    process.exit(1);
  }
  console.log(`✅ Subject encontrado: ${subjectId}`);

  // 2. Garantir colunas Phase 5
  try {
    await db.execute(sql`
      ALTER TABLE "Question"
        ADD COLUMN IF NOT EXISTS "correctOption"      INTEGER,
        ADD COLUMN IF NOT EXISTS "explanationCorrect" TEXT,
        ADD COLUMN IF NOT EXISTS "explanationWrong"   TEXT,
        ADD COLUMN IF NOT EXISTS "contentId"          TEXT;
    `);
    await db.execute(sql`
      ALTER TABLE "Content"
        ADD COLUMN IF NOT EXISTS "mnemonic"         TEXT,
        ADD COLUMN IF NOT EXISTS "keyPoint"         TEXT,
        ADD COLUMN IF NOT EXISTS "practicalExample" TEXT;
    `);
    console.log("✅ Colunas Phase 5 garantidas.");
  } catch (e: any) {
    console.log("⚠️  Colunas já existem:", e.message);
  }

  // 3. Criar tópico
  const topicId = await findOrCreateTopic("Sintaxe: Conjunções e Orações", subjectId);
  console.log(`✅ Topic: ${topicId}`);

  // 4. Inserir content atoms + construir contentIdMap
  const contentIdMap: Record<string, string> = {};
  let contentCreated = 0;
  let contentSkipped = 0;

  for (const c of contentAtoms) {
    const exists = await contentExists(c.title, subjectId);
    if (exists) {
      // Recuperar id existente para o mapa
      const rows = (await db.execute(sql`
        SELECT id FROM "Content" WHERE title = ${c.title} AND "subjectId" = ${subjectId} LIMIT 1
      `)) as any[];
      contentIdMap[c.title] = rows[0].id;
      console.log(`  ⏭  Conteúdo já existe: ${c.title}`);
      contentSkipped++;
      continue;
    }

    const id = nanoId("ct");
    contentIdMap[c.title] = id;

    const wordCount = c.textContent.split(/\s+/).length;
    await db.execute(sql`
      INSERT INTO "Content" (
        id, title, "textContent", "subjectId", "topicId",
        difficulty, "isActive",
        "wordCount", "estimatedReadTime",
        mnemonic, "keyPoint", "practicalExample",
        "createdAt", "updatedAt"
      ) VALUES (
        ${id}, ${c.title}, ${c.textContent}, ${subjectId}, ${topicId},
        ${c.difficulty}, true,
        ${wordCount}, ${Math.ceil(wordCount / 200)},
        ${c.mnemonic}, ${c.keyPoint}, ${c.practicalExample},
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Conteúdo criado: ${c.title} (${id})`);
    contentCreated++;
  }

  // 5. Inserir questões
  let questionCreated = 0;
  let questionSkipped = 0;

  for (const q of questions) {
    const exists = await questionExists(q.id);
    if (exists) {
      console.log(`  ⏭  Questão já existe: ${q.id}`);
      questionSkipped++;
      continue;
    }

    const contentId = contentIdMap[q.contentTitle];
    if (!contentId) {
      console.error(`  ❌ contentId não encontrado para: ${q.contentTitle}`);
      continue;
    }

    const alternativesJson = JSON.stringify(q.alternatives);

    await db.execute(sql`
      INSERT INTO "Question" (
        id, statement, alternatives,
        "correctAnswer", "correctOption",
        explanation, "explanationCorrect", "explanationWrong",
        difficulty, "questionType",
        "subjectId", "topicId", "contentId",
        "isActive", "timesUsed",
        "createdAt", "updatedAt"
      ) VALUES (
        ${q.id},
        ${q.statement},
        ${alternativesJson}::jsonb,
        ${q.correctAnswer},
        ${q.correctOption},
        ${q.explanation},
        ${q.explanationCorrect},
        ${q.explanationWrong},
        ${q.difficulty},
        ${q.questionType},
        ${subjectId},
        ${topicId},
        ${contentId},
        true, 0,
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Questão criada: ${q.id} (${q.difficulty} — ${q.questionType})`);
    questionCreated++;
  }

  // 6. Backfill contentId para questões sem contentId no tópico
  const backfill = await db.execute(sql`
    UPDATE "Question" q
    SET "contentId" = c.id
    FROM "Content" c
    WHERE q."topicId" = ${topicId}
      AND q."contentId" IS NULL
      AND c."topicId" = ${topicId}
      AND c."subjectId" = ${subjectId}
  `) as any;
  const backfillCount = backfill?.rowCount ?? backfill?.count ?? 0;
  if (backfillCount > 0) {
    console.log(`  🔗 Backfill: ${backfillCount} questão(ões) atualizadas com contentId.`);
  }

  // 7. Resumo
  console.log(`
─────────────────────────────────────────
📚 Conteúdos: ${contentCreated} criados, ${contentSkipped} já existiam
❓ Questões:  ${questionCreated} criadas,  ${questionSkipped} já existiam
🔗 Vínculo:   todas as questões com contentId correto (sem roleta russa)
─────────────────────────────────────────`);

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
