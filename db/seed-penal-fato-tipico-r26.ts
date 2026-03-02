/**
 * Seed: Direito Penal — R26 — Teoria do Crime: O Fato Típico
 *
 * Diretriz pedagógica: base absoluta do Direito Penal. Se o aluno não domina o Fato Típico,
 * não entende o que é crime. O foco é o conceito analítico tripartite (majoritário no Brasil),
 * com exemplos práticos da atividade policial (abordagens, disparos, prisões).
 * Cada explanation cita o artigo do Código Penal pertinente para dar autoridade ao conteúdo.
 *
 * 6 Átomos de Conteúdo:
 *   1. Conceito Analítico de Crime: A Tripartição (Fato Típico, Ilicitude e Culpabilidade)
 *   2. Conduta: Comissiva (Ação) vs Omissiva (Própria e Imprópria — Garantes)
 *   3. Resultado e Nexo Causal: Teoria da Equivalência dos Antecedentes (Conditio Sine Qua Non)
 *   4. Tipicidade: Formal vs Material (Princípio da Insignificância)
 *   5. Dolo e Culpa: Dolo Direto, Eventual e Culpa Consciente
 *   6. Iter Criminis: Da Cogitação à Consumação (Tentativa e Desistência Voluntária)
 *
 * 12 Questões — TODAS CERTO_ERRADO
 * Subject: Direito Penal (busca por "DIREITO_PENAL" com fallbacks)
 * Topic: Teoria do Crime (novo tópico)
 *
 * Execução:
 *   npx tsx db/seed-penal-fato-tipico-r26.ts
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
  // ── 1. Conceito Analítico de Crime ────────────────────────────────────
  {
    title: "Conceito Analítico de Crime: A Tripartição (Fato Típico, Ilicitude e Culpabilidade)",
    textContent: `O CONCEITO ANALÍTICO DE CRIME decompõe o crime em elementos essenciais para fins de análise. É o mais cobrado em concursos policiais no Brasil.

TEORIA TRIPARTITE (majoritária — adotada pelo CP e pela doutrina dominante):
Crime = FATO TÍPICO + ILICITUDE (antijuridicidade) + CULPABILIDADE.
A ausência de qualquer um desses elementos EXCLUI O CRIME.

TEORIA BIPARTITE (Damásio de Jesus, Celso Delmanto — minoritária):
Crime = fato típico + ilicitude. A culpabilidade seria pressuposto da pena, não do crime.
⚠️ Para concursos: adote a TEORIA TRIPARTITE, salvo se a banca indicar o contrário.

─────────────────────────────────────────────────────────
ELEMENTO 1 — FATO TÍPICO: conduta humana que se amolda ao tipo penal.
Composto por: conduta + resultado + nexo causal + tipicidade.
EXCLUDENTE: atipicidade (fato não previsto em lei, princípio da insignificância etc.)
─────────────────────────────────────────────────────────
ELEMENTO 2 — ILICITUDE (antijuridicidade): o fato é contrário ao ordenamento jurídico.
Regra: todo fato típico presume-se ilícito (presunção relativa = teoria da ratio cognoscendi).
EXCLUDENTES DE ILICITUDE (art. 23, CP): estado de necessidade (art. 24), legítima defesa (art. 25),
estrito cumprimento do dever legal e exercício regular do direito.
Atenção: legítima defesa EXCLUI A ILICITUDE, não a tipicidade!
O fato permanece típico — apenas torna-se lícito.
─────────────────────────────────────────────────────────
ELEMENTO 3 — CULPABILIDADE: juízo de reprovação pessoal do agente.
Composta por: imputabilidade + potencial consciência da ilicitude + exigibilidade de conduta diversa.
EXCLUDENTES: inimputabilidade (arts. 26 e 27 CP — doença mental, menor de 18 anos),
erro de proibição inevitável (art. 21 CP), coação moral irresistível e obediência hierárquica (art. 22 CP).

RESUMO MNEMÔNICO:
Crime = TIC (Típico + Ilícito + Culpável)
Cada elemento tem suas EXCLUDENTES que eliminam o crime naquele nível.`,
    mnemonic: "TIC = Típico + Ilícito + Culpável (tripartite, majoritária). EXCLUDENTES: tipicidade (atipicidade); ilicitude (art. 23: LG/EN/ECD/ERD); culpabilidade (inimputabilidade/erro proibição/coação). ATENÇÃO: legítima defesa = exclui ILICITUDE (não tipicidade). Fato continua típico, mas é lícito.",
    keyPoint: "Crime (teoria tripartite): fato típico + ilícito + culpável. Falta qualquer um → não há crime. Excludentes de ilicitude (art. 23 CP): estado de necessidade, legítima defesa, estrito cumprimento do dever legal, exercício regular do direito. Legítima defesa NÃO exclui tipicidade — exclui ilicitude. Culpabilidade: imputabilidade + potencial consciência + exigibilidade.",
    practicalExample: "Questão PF/Cebraspe: 'O policial que realiza disparo fatal em legítima defesa pratica fato típico?' SIM — o fato É típico (se amolda ao art. 121 CP — homicídio). Porém, a legítima defesa (art. 25 CP) EXCLUI A ILICITUDE → não há crime. Outro exemplo: menor de 16 anos que furta pratica fato típico e ilícito, mas NÃO culpável (inimputável — art. 27 CP) → não há crime para fins penais.",
    difficulty: "FACIL",
  },

  // ── 2. Conduta ────────────────────────────────────────────────────────
  {
    title: "Conduta: Comissiva e Omissiva (Omissão Própria e Imprópria — Os Garantes)",
    textContent: `A CONDUTA é o primeiro elemento do fato típico. Para a teoria finalista (adotada pelo CP de 1984), conduta é toda ação ou omissão humana, consciente e voluntária, dirigida a uma finalidade.

─────────────────────────────────────────────────────────
CONDUTA COMISSIVA (AÇÃO): o agente pratica um movimento corporal positivo proibido.
Exemplo: atirar, ferir, subtrair. A maioria dos crimes é comissiva.
─────────────────────────────────────────────────────────
CONDUTA OMISSIVA: o agente deixa de fazer o que era juridicamente obrigado.

OMISSÃO PRÓPRIA (pura): o tipo penal descreve apenas a omissão, independentemente do resultado.
O agente responde pela OMISSÃO EM SI, não pelo resultado produzido.
Exemplos:
• Art. 135 CP — Omissão de socorro: "deixar de prestar assistência, quando possível fazê-lo..."
• Art. 269 CP — Omissão de notificação de doença.
Qualquer pessoa pode praticar omissão própria (não exige qualidade especial).

OMISSÃO IMPRÓPRIA (comissão por omissão — art. 13, §2°, CP): o GARANTE (agente com dever
especial de evitar o resultado) deixa de agir e responde pelo RESULTADO PRODUZIDO.
O resultado é imputado ao omitente como se ele o tivesse causado ativamente.
Responde por crime comissivo na forma omissiva: ex. homicídio por omissão.

QUEM SÃO OS GARANTES (art. 13, §2°, CP)?
a) OBRIGAÇÃO LEGAL: quem tem dever de proteção por força de lei.
   → Policiais (em relação a pessoas sob sua custódia), bombeiros, médicos de plantão,
     pais em relação aos filhos menores.
b) ASSUNÇÃO VOLUNTÁRIA: quem assumiu a responsabilidade de cuidado.
   → Salva-vidas, babá, guia de montanha, enfermeiro contratado.
c) COMPORTAMENTO ANTERIOR (ingerência): quem criou risco com conduta precedente.
   → Motorista que atropela alguém tem dever de socorrer.

ATENÇÃO — Distinção cobrada em prova:
• Omissão PRÓPRIA: todos podem praticar / responde pela omissão / resultado indiferente para tipificação.
• Omissão IMPRÓPRIA: só garantes / responde pelo resultado / art. 13, §2°, CP.`,
    mnemonic: "COMISSIVA = ação proibida. OMISSIVA PRÓPRIA = qualquer pessoa + responde pela omissão (não pelo resultado) ex: art. 135. OMISSIVA IMPRÓPRIA = só GARANTES (lei/assunção/ingerência) + responde pelo RESULTADO + art. 13, §2°. Garantes: policial, pais, bombeiro, salva-vidas, quem criou risco.",
    keyPoint: "Omissão própria: tipo descreve a omissão; qualquer pessoa; responde pela omissão (art. 135). Omissão imprópria: garante (art. 13, §2°); responde pelo resultado como se ativo fosse. Garantes: a) lei (policial, pais, bombeiro); b) assunção voluntária (babá, salva-vidas); c) criou risco anterior (motorista que atropelou). Distinção: quem é garante + responde pelo resultado.",
    practicalExample: "Questão PF: 'O policial que, podendo agir, nada faz para impedir afogamento de detento sob sua custódia — responde por quê?' Policial = garante por LEI (art. 13, §2°, a). Omissão IMPRÓPRIA → responde pelo resultado (homicídio doloso ou culposo por omissão). Contraste: cidadão comum que passa pela cena e nada faz → omissão PRÓPRIA → art. 135 (omissão de socorro) — não responde pela morte.",
    difficulty: "MEDIO",
  },

  // ── 3. Resultado e Nexo Causal ────────────────────────────────────────
  {
    title: "Resultado e Nexo Causal: Teoria da Equivalência dos Antecedentes (Conditio Sine Qua Non)",
    textContent: `O NEXO CAUSAL é o vínculo entre a conduta e o resultado naturalístico. Sem nexo, não há fato típico nos crimes materiais.

TEORIA ADOTADA PELO CP — EQUIVALÊNCIA DOS ANTECEDENTES CAUSAIS (art. 13, caput):
"Considera-se causa a ação ou omissão sem a qual o resultado não teria ocorrido."
Também chamada de: conditio sine qua non / teoria da condição necessária.

MÉTODO: PROCESSO HIPOTÉTICO DE ELIMINAÇÃO (Thyrén):
Suprime-se mentalmente a conduta. Se o resultado NÃO teria ocorrido → a conduta É CAUSA.
Se o resultado TERIA ocorrido de qualquer modo → a conduta NÃO é causa.

PROBLEMA: regressão ao infinito (causa das causas). Por isso aplica-se a teoria da imputação objetiva
(Roxin) como complemento — mas o CP adota a equivalência como regra geral.

─────────────────────────────────────────────────────────
CAUSAS INDEPENDENTES (quebram ou modificam o nexo):

1. CAUSAS ABSOLUTAMENTE INDEPENDENTES (preexistentes, concomitantes ou supervenientes):
   Produzem o resultado POR SI SÓSS, sem qualquer relação com a conduta do agente.
   O agente responde apenas pelos atos praticados (ex: tentativa), NUNCA pelo resultado.
   Exemplo: A envenena B, mas B morre em acidente de carro antes do veneno fazer efeito.
   → A responde por tentativa de homicídio (não pela morte).

2. CAUSAS RELATIVAMENTE INDEPENDENTES:
   Existem conexão com a conduta, mas outro fator colabora para o resultado.
   • Preexistentes e concomitantes: NÃO excluem a imputação do resultado.
     Exemplo: A atira em B, hemofílico. A responde pela morte (a hemofilia preexistia).
   • SUPERVENIENTES que por si sós produzam o resultado (art. 13, §1°, CP):
     EXCLUEM a imputação do resultado (agente responde apenas pelos atos praticados).
     Exemplo clássico: A esfaqueia B levemente. B vai ao hospital e morre em incêndio no hospital.
     → A responde apenas pela lesão (não pela morte). O incêndio é causa superveniente relativa
     que por si só produziu o resultado → exclui a imputação da morte a A.
     ATENÇÃO: se o incêndio decorreu da própria cirurgia/tratamento da facada → não exclui
     (é desdobramento normal da conduta inicial).`,
    mnemonic: "CONDITIO: 'sem a qual o resultado não teria ocorrido' (art. 13). ELIMINAÇÃO HIPOTÉTICA: suprime conduta → resultado some = é causa. CAUSAS INDEPENDENTES: absolutamente (nenhuma relação = responde só pelos atos) vs relativamente independentes supervenientes que por si sós produzem resultado (art. 13, §1° = exclui imputação do resultado). Preexistentes/concomitantes relativas = NÃO excluem.",
    keyPoint: "Art. 13, caput CP: conditio sine qua non — causa = condição necessária para o resultado. Método: supressão hipotética. Art. 13, §1°: causas relativamente independentes supervenientes que por si sós produzem o resultado excluem a imputação (agente responde só pelos atos). Causas preexistentes e concomitantes (relativas): não excluem. Causas absolutamente independentes: sempre excluem nexo.",
    practicalExample: "Questão PRF: 'A esfaqueia B levemente. B é levado ao hospital e, durante internação, morre em incêndio no hospital. A responde pela morte?' NÃO (art. 13, §1° CP) — incêndio = causa superveniente relativamente independente que por si só produziu o resultado → A responde apenas pela lesão corporal. Contraste: 'B morre de infecção hospitalar decorrente da facada' → A responde pela morte (desdobramento normal/previsível da conduta inicial).",
    difficulty: "MEDIO",
  },

  // ── 4. Tipicidade ─────────────────────────────────────────────────────
  {
    title: "Tipicidade: Formal vs Material e o Princípio da Insignificância",
    textContent: `A TIPICIDADE é o juízo de adequação entre a conduta praticada e o tipo penal descrito em lei. É exigência do princípio da legalidade (art. 5°, XXXIX, CF e art. 1°, CP): "Não há crime sem lei anterior que o defina."

─────────────────────────────────────────────────────────
TIPICIDADE FORMAL: adequação/subsunção da conduta ao tipo penal descrito na lei.
O agente fez exatamente o que a norma proíbe? SIM = formalmente típico.
Exemplo: subtrair coisa alheia → se amolda ao art. 155 CP (furto) → formalmente típico.
─────────────────────────────────────────────────────────
TIPICIDADE MATERIAL: além de enquadrar-se formalmente, a conduta deve causar LESÃO RELEVANTE
ou AMEAÇA REAL ao bem jurídico tutelado. Se a lesão for ínfima, o fato é formalmente típico
mas materialmente atípico → não há crime.
─────────────────────────────────────────────────────────
PRINCÍPIO DA INSIGNIFICÂNCIA (crime de bagatela — construção doutrinária e jurisprudencial):
Afasta a TIPICIDADE MATERIAL. O fato permanece formalmente típico, mas é materialmente atípico.

REQUISITOS (STF — HC 84.412/SP — Ministro Celso de Mello):
1. Mínima ofensividade da conduta
2. Nenhuma periculosidade social da ação
3. Reduzidíssimo grau de reprovabilidade do comportamento
4. Inexpressividade da lesão jurídica provocada

CASOS EM QUE O STF/STJ NÃO ADMITE A INSIGNIFICÂNCIA:
• Crimes praticados com VIOLÊNCIA ou GRAVE AMEAÇA à pessoa (ex: roubo — nunca bagatela)
• TRÁFICO DE DROGAS (STF: lesão à saúde pública não é bagatela — Súmula 512 STJ indiretamente)
• Crimes contra a ADMINISTRAÇÃO PÚBLICA (STF: probidade não admite relativização)
• Reincidência específica habitual (pode afastar a bagatela, conforme caso concreto)
• Violência doméstica e familiar contra a mulher (STJ)
• Moeda falsa (STJ — fé pública não admite bagatela)

TIPICIDADE CONGLOBANTE (Zaffaroni): a conduta também deve ser ANTINORMATIVA — não pode ser
fomentada ou permitida por outra norma do ordenamento. Corrente minoritária no Brasil.`,
    mnemonic: "TIPICIDADE FORMAL = lei proíbe? MATERIAL = lesão relevante ao bem jurídico? INSIGNIFICÂNCIA = afasta tipicidade MATERIAL (fato continua formalmente típico). Requisitos STF: MPRR (Mínima ofensividade, nenhuma Periculosidade, Reduzidíssima reprovabilidade, inexpressividade da Lesão). NÃO aplica: violência/grave ameaça, tráfico, adm. pública, violência doméstica.",
    keyPoint: "Tipicidade formal: subsunção ao tipo. Material: lesão relevante ao bem jurídico. Insignificância: exclui tipicidade MATERIAL (fato permanece formalmente típico). Requisitos STF: min. ofensividade + nenhuma periculosidade + reduzidíssima reprovabilidade + inexpressiva lesão. Não aplica: roubo (violência), tráfico, crimes contra administração pública, violência doméstica.",
    practicalExample: "Questão PF/Cebraspe: 'O furto de um pacote de bolacha (R$2,50) de supermercado é atípico pelo princípio da insignificância?' Possível SIM (tipicidade material ausente, se atendidos os 4 requisitos). MAS: 'O roubo de R$2,50 é atípico pela insignificância?' NÃO — violência/grave ameaça afasta o princípio. Outro: 'Funcionário público que desvia R$0,50 dos cofres públicos é beneficiado pela insignificância?' STF: NÃO — crimes contra a administração pública não admitem bagatela (moralidade e probidade administrativa).",
    difficulty: "MEDIO",
  },

  // ── 5. Dolo e Culpa ───────────────────────────────────────────────────
  {
    title: "Dolo e Culpa: Dolo Direto, Eventual e Culpa Consciente — A Linha Divisória",
    textContent: `O elemento subjetivo do tipo é o DOLO ou a CULPA. O CP adota o sistema da excepcionalidade do crime culposo: só há punição por culpa quando expressamente previsto em lei (art. 18, parágrafo único, CP).

─────────────────────────────────────────────────────────
DOLO (art. 18, I, CP): "quando o agente quis o resultado ou assumiu o risco de produzi-lo."

DOLO DIRETO DE 1° GRAU: o agente QUER o resultado (é o fim almejado).
Exemplo: atirar em alguém com vontade de matá-lo.

DOLO DIRETO DE 2° GRAU (dolo de consequências necessárias):
O resultado não é o fim, mas é CONSEQUÊNCIA CERTA E INEVITÁVEL do meio escolhido.
O agente o aceita como efeito necessário, ainda que indesejado.
Exemplo: para matar A que embarca em avião, o agente detona uma bomba → mata todos os passageiros.
Os demais passageiros = dolo de 2° grau (resultado CERTO, não desejado mas aceito).

DOLO EVENTUAL: o agente prevê o resultado como POSSÍVEL (não certo) e ASSUME O RISCO de produzi-lo.
"Seja lá o que acontecer, me importa pouco." — teoria do assentimento/consentimento.
Exemplo: "pega na malandragem" (racha na rua) — morte prevista como possível e aceita.
Art. 18, I, parte final: "assumiu o risco de produzi-lo."

─────────────────────────────────────────────────────────
CULPA (art. 18, II, CP): "quando o agente deu causa ao resultado por imprudência, negligência ou imperícia."

CULPA INCONSCIENTE: o agente NÃO prevê o resultado, embora fosse previsível.
Exemplo: motorista que não olha o espelho e atropela ciclista.

CULPA CONSCIENTE: o agente PREVÊ o resultado como possível, mas ACREDITA SINCERAMENTE que
ele não ocorrerá — confia na sua habilidade/sorte para evitá-lo.
Exemplo: motorista experiente que ultrapassa em curva prevendo acidente mas confia que não ocorrerá.

─────────────────────────────────────────────────────────
A LINHA DIVISÓRIA MAIS COBRADA EM PROVAS:

DOLO EVENTUAL × CULPA CONSCIENTE:
Ambos PREVEEM o resultado. A diferença: aceitação.
• DOLO EVENTUAL: ASSUME O RISCO (aceita o resultado se ocorrer) → "dane-se"
• CULPA CONSCIENTE: CONFIA que NÃO ocorrerá → "não vai acontecer comigo"

DOLO DIRETO DE 2° GRAU × DOLO EVENTUAL:
• 2° grau: resultado CERTO e inevitável (agente aceita o CERTO)
• Eventual: resultado POSSÍVEL (agente aceita o INCERTO)`,
    mnemonic: "Art. 18 CP. DOLO DIRETO 1°: quer o resultado. DOLO DIRETO 2°: resultado CERTO como efeito necessário (aceita o inevitável). DOLO EVENTUAL: resultado POSSÍVEL + ASSUME O RISCO ('dane-se'). CULPA CONSCIENTE: prevê + confia que NÃO ocorrerá. CULPA INCONSCIENTE: não prevê (mas era previsível). Linha dolo×culpa: ASSUNÇÃO DO RISCO vs CONFIANÇA NA NÃO OCORRÊNCIA.",
    keyPoint: "Art. 18, I CP: dolo = quer o resultado OU assume o risco. Dolo eventual: prevê como possível + assume risco ('dane-se'). Culpa consciente: prevê como possível + confia que não ocorrerá. Distinção: assunção do risco (dolo eventual) vs confiança na não-ocorrência (culpa consciente). Dolo 2° grau: resultado certo/inevitável (diferente do eventual: resultado incerto). Culpa: só punível quando previsto em lei (art. 18, §único).",
    practicalExample: "Questão PRF: 'Motorista em racha na Esplanada dos Ministérios — dolo eventual ou culpa consciente?' STF entende: DOLO EVENTUAL (previu e assumiu o risco — Caso Yoki/Adélio). Distinção prática: 'Previu a morte? + Aceitou que ela ocorresse?' → dolo eventual. 'Previu mas confiou que teria habilidade para evitar?' → culpa consciente. Questão: 'Bombeiro experiente que usa mangueira em alta pressão e acerta colega prevendo a possibilidade mas confiando em sua técnica' → CULPA CONSCIENTE (confiou na perícia).",
    difficulty: "DIFICIL",
  },

  // ── 6. Iter Criminis ──────────────────────────────────────────────────
  {
    title: "Iter Criminis: Da Cogitação à Consumação — Tentativa e Desistência Voluntária",
    textContent: `ITER CRIMINIS é o caminho do crime — as etapas que vão do pensamento criminoso até a consumação. É fundamental para saber em que fase policial intervém e o que é punível.

─────────────────────────────────────────────────────────
FASES DO ITER CRIMINIS:

1. COGITAÇÃO: o crime existe apenas na mente do agente (pensamento, planejamento).
   NUNCA É PUNÍVEL — Direito Penal não pune pensamentos. "Cogitationis poenam nemo patitur."

2. PREPARAÇÃO (atos preparatórios): o agente adquire instrumentos, se posiciona, organiza.
   EM REGRA, NÃO É PUNÍVEL — a preparação é indiferente penal, salvo quando a própria
   preparação configura crime autônomo (ex: art. 291 CP — petrechos para falsificação de moeda;
   associação criminosa — art. 288 CP).

3. EXECUÇÃO (atos executórios): o agente inicia a realização do tipo penal.
   É AQUI QUE COMEÇA A PUNIBILIDADE (tentativa — art. 14, II, CP).
   Distinção preparação × execução: critério objetivo-formal — a execução é o início
   da realização do verbo núcleo do tipo (matar, subtrair, etc.).

4. CONSUMAÇÃO: todos os elementos do tipo penal estão realizados (art. 14, I, CP).
   Crime consumado = punição integral.

5. EXAURIMENTO: esgotamento dos efeitos do crime após a consumação.
   NÃO altera a consumação, mas pode agravar a pena (ex: corrupção passiva consumada
   quando o funcionário aceita a vantagem; o exaurimento = receber a vantagem).

─────────────────────────────────────────────────────────
TENTATIVA (CRIME TENTADO — art. 14, II, CP):
"Quando, iniciada a execução, não se consuma por circunstâncias alheias à vontade do agente."
PENA: reduzida de 1/3 a 2/3 (art. 14, parágrafo único, CP).
Critério de redução: quanto mais próximo da consumação, menor a redução.

DESISTÊNCIA VOLUNTÁRIA e ARREPENDIMENTO EFICAZ (art. 15, CP — "Ponte de Ouro"):
DESISTÊNCIA VOLUNTÁRIA: o agente CESSA a execução voluntariamente (podia continuar, mas parou).
ARREPENDIMENTO EFICAZ: o agente concluiu a execução mas IMPEDE o resultado (age para neutralizá-lo).
Em ambos: responde APENAS PELOS ATOS JÁ PRATICADOS — NÃO pela tentativa do crime pretendido.
Fórmula: "Posso prosseguir, mas não quero" = desistência (voluntária). × "Não posso prosseguir" = tentativa.

CRIME IMPOSSÍVEL (art. 17, CP): absoluta ineficácia do meio OU absoluta impropriedade do objeto.
Não é punível — nem tentativa.`,
    mnemonic: "ITER: Cogitação (nunca punível) → Preparação (regra: não punível) → Execução (início da tentativa: art. 14 II) → Consumação (art. 14 I) → Exaurimento. TENTATIVA: pena −1/3 a −2/3. DESISTÊNCIA VOLUNTÁRIA: 'posso mas não quero' → responde só pelos atos (art. 15). ARREPENDIMENTO EFICAZ: concluiu + impediu resultado → só pelos atos. CRIME IMPOSSÍVEL: art. 17 = não punível.",
    keyPoint: "Cogitação: nunca punível. Preparação: regra não punível (exceção: crime autônomo). Execução: inicia punibilidade → tentativa (art. 14, II). Tentativa: pena reduzida de 1/3 a 2/3. Desistência voluntária: cessa execução voluntariamente → responde só pelos atos praticados (art. 15) — NÃO pela tentativa. Arrependimento eficaz: impede resultado após execução → idem. Crime impossível (art. 17): não punível.",
    practicalExample: "Questão PF: 'Agente inicia execução de roubo mas, antes de consumar, desiste voluntariamente — responde por tentativa de roubo?' NÃO (art. 15 CP) — desistência voluntária → responde apenas pelos atos praticados. Se não usou violência, pode responder apenas pela abordagem ou nada (caso sem atos delituosos concluídos). Pegadinha: 'Desistência forçada pela chegada de uma viatura' → NÃO é voluntária → continua sendo tentativa (circunstância alheia à vontade = art. 14, II).",
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
  // Átomo 1 — Conceito Analítico (Q1-Q2)
  // ══════════════════════════════════════════════════════════════════

  // Q1 — Tripartição: ausência de elemento exclui crime (FACIL, CERTO)
  {
    id: "qz_pen_tip_001",
    statement:
      "Julgue o item conforme a teoria do crime adotada pelo Código Penal brasileiro.\n\n" +
      "Pela teoria tripartite — majoritária na doutrina e adotada pelo CP —, crime é " +
      "um fato típico, ilícito e culpável. A ausência de qualquer um desses três elementos " +
      "é suficiente para afastar a configuração do crime, independentemente de qual elemento " +
      "esteja ausente.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. O CP brasileiro adota a teoria tripartite do crime: crime = fato típico + " +
      "ilicitude + culpabilidade. A falta de qualquer elemento exclui o crime:\n" +
      "• Atipicidade → sem fato típico → sem crime.\n" +
      "• Excludente de ilicitude (art. 23 CP: estado de necessidade, legítima defesa, " +
      "estrito cumprimento do dever legal, exercício regular do direito) → sem ilicitude → sem crime.\n" +
      "• Excludente de culpabilidade (inimputabilidade — arts. 26/27 CP; erro de proibição " +
      "inevitável — art. 21 CP; coação moral irresistível/obediência hierárquica — art. 22 CP) " +
      "→ sem culpabilidade → sem crime.\n" +
      "A teoria bipartite (Damásio) considera culpabilidade pressuposto da pena — posição minoritária.",
    explanationCorrect:
      "Correto! Teoria tripartite: fato típico + ilícito + culpável. Falta qualquer um → sem crime. " +
      "Excludentes: tipicidade (atipicidade); ilicitude (art. 23 CP); culpabilidade (arts. 21/22/26/27 CP). " +
      "Adotada pelo CP e pela doutrina majoritária.",
    explanationWrong:
      "O item está CERTO. Teoria tripartite (majoritária, adotada pelo CP): crime = fato típico + " +
      "ilícito + culpável. Ausência de qualquer elemento → não há crime. Art. 23 CP: excludentes de " +
      "ilicitude. Arts. 26/27: inimputabilidade. Art. 21: erro de proibição. Teoria bipartite " +
      "(Damásio — minoritária) considera culpabilidade pressuposto da pena, não do crime.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Conceito Analítico de Crime: A Tripartição (Fato Típico, Ilicitude e Culpabilidade)",
  },

  // Q2 — Legítima defesa exclui ILICITUDE, não tipicidade (FACIL, ERRADO)
  {
    id: "qz_pen_tip_002",
    statement:
      "Julgue o item conforme a teoria do crime adotada pelo Código Penal brasileiro.\n\n" +
      "O policial que, em serviço, realiza disparo fatal contra um criminoso em situação " +
      "de legítima defesa pratica um fato ATÍPICO, pois a conduta, por ser autorizada " +
      "pelo ordenamento jurídico, não se enquadra em nenhum tipo penal incriminador.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. A legítima defesa (art. 25 CP) é EXCLUDENTE DE ILICITUDE (antijuridicidade), " +
      "não de tipicidade. O disparo fatal CONTINUA sendo fato típico — amolda-se ao art. 121 CP " +
      "(homicídio). O que a legítima defesa faz é AFASTAR A ILICITUDE, tornando o fato lícito " +
      "mesmo sendo típico. Portanto, o fato é: TÍPICO + LÍCITO (por força do art. 25 CP) + " +
      "CULPÁVEL → não há crime, mas a ausência se dá no segundo elemento (ilicitude), não no primeiro.\n" +
      "Excludentes de TIPICIDADE: atipicidade formal (conduta não prevista em lei), princípio " +
      "da insignificância (ausência de tipicidade material).\n" +
      "Excludentes de ILICITUDE (art. 23 CP): estado de necessidade, legítima defesa, " +
      "estrito cumprimento do dever legal, exercício regular do direito.",
    explanationCorrect:
      "O item está ERRADO. Legítima defesa (art. 25 CP) = excludente de ILICITUDE, não de " +
      "tipicidade. O disparo = fato típico (art. 121 CP). O fato é típico e culpável — mas " +
      "lícito (art. 25). Sem crime, porém a ausência está na ILICITUDE, não na tipicidade.",
    explanationWrong:
      "O item está ERRADO. Legítima defesa não exclui a tipicidade — exclui a ILICITUDE (art. 23, " +
      "II, CP). O disparo fatal continua se amoldando ao art. 121 CP (homicídio = fato típico). " +
      "A legítima defesa torna o fato LÍCITO, mas ele permanece típico. Excludentes de tipicidade: " +
      "atipicidade formal e princípio da insignificância. Excludentes de ilicitude: art. 23 CP.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Conceito Analítico de Crime: A Tripartição (Fato Típico, Ilicitude e Culpabilidade)",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 2 — Conduta e Omissão (Q3-Q4)
  // ══════════════════════════════════════════════════════════════════

  // Q3 — Policial garante: omissão imprópria + responde pelo resultado (MEDIO, CERTO)
  {
    id: "qz_pen_tip_003",
    statement:
      "Julgue o item conforme o Código Penal brasileiro.\n\n" +
      "O policial que, podendo agir, permanece inerte e nada faz para evitar o " +
      "afogamento de um detento sob sua custódia pode ser responsabilizado por " +
      "homicídio doloso ou culposo na modalidade omissiva imprópria, por ser considerado " +
      "garante da não ocorrência do resultado, nos termos do art. 13, §2°, do CP.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. O policial é GARANTE por força de lei (art. 13, §2°, alínea 'a', CP): " +
      "tem a obrigação legal de proteção em relação às pessoas sob sua custódia. " +
      "Ao deixar de agir (quando podia e devia), pratica OMISSÃO IMPRÓPRIA (comissão por omissão): " +
      "o resultado morte lhe é imputado como se tivesse praticado ação positiva.\n" +
      "• Dolo (sabia e quis a morte) → responde por homicídio doloso omissivo (art. 121 CP).\n" +
      "• Culpa (negligência — podia agir mas não agiu sem intenção letal) → homicídio culposo " +
      "omissivo (art. 121, §3°, CP).\n" +
      "Distinção: cidadão comum que passa e nada faz → omissão PRÓPRIA (art. 135 CP — " +
      "omissão de socorro) → NÃO responde pela morte, apenas pela omissão.",
    explanationCorrect:
      "Correto! Policial = garante por lei (art. 13, §2°, a, CP). Omissão imprópria: responde " +
      "pelo resultado (morte). Dolo → homicídio doloso omissivo; culpa → homicídio culposo. " +
      "Contraste: civil comum = omissão própria (art. 135) = responde só pela omissão, não pela morte.",
    explanationWrong:
      "O item está CERTO. Art. 13, §2°, CP: policial é garante por lei → omissão imprópria. " +
      "Responde pelo resultado produzido (homicídio doloso ou culposo por omissão). " +
      "Diferente da omissão própria (art. 135), em que qualquer pessoa omitente responde " +
      "apenas pela omissão — não pelo resultado da morte.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Conduta: Comissiva e Omissiva (Omissão Própria e Imprópria — Os Garantes)",
  },

  // Q4 — Omissão própria x imprópria: item inverte as definições (MEDIO, ERRADO)
  {
    id: "qz_pen_tip_004",
    statement:
      "Julgue o item conforme o Código Penal brasileiro.\n\n" +
      "Na omissão própria, o agente — por ter o dever jurídico especial de evitar o " +
      "resultado — responde pelo resultado produzido, como se o tivesse causado ativamente. " +
      "Já na omissão imprópria, o agente responde apenas pela omissão em si, " +
      "independentemente do resultado final.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O item INVERTEU as definições de omissão própria e imprópria:\n" +
      "• OMISSÃO PRÓPRIA: qualquer pessoa omitente; o tipo penal pune apenas a OMISSÃO " +
      "em si, independentemente do resultado. Exemplo: art. 135 CP (omissão de socorro) — " +
      "mesmo que a vítima não morra, há crime. Não exige qualidade especial do agente.\n" +
      "• OMISSÃO IMPRÓPRIA (comissão por omissão — art. 13, §2°, CP): exige que o agente " +
      "seja GARANTE (dever jurídico especial). O garante responde pelo RESULTADO como se " +
      "o tivesse causado por ação positiva. Exemplo: policial que deixa preso morrer asfixiado " +
      "→ responde por homicídio (não apenas por omissão de socorro).\n" +
      "Resumo: própria = omissão / imprópria = resultado (via garante).",
    explanationCorrect:
      "O item está ERRADO. As definições estão invertidas. Omissão PRÓPRIA: responde pela " +
      "omissão (não pelo resultado) — qualquer pessoa — art. 135. Omissão IMPRÓPRIA: garante " +
      "(art. 13, §2°) responde pelo RESULTADO. O item atribuiu à própria o que é da imprópria " +
      "e vice-versa.",
    explanationWrong:
      "O item está ERRADO. Houve inversão das definições. PRÓPRIA: responde pela omissão " +
      "(não pelo resultado) — ex: art. 135 CP. IMPRÓPRIA: garante (art. 13, §2°) responde " +
      "pelo resultado como se o tivesse causado. Lembrete: 'própria = punida pela própria omissão'; " +
      "'imprópria = punida pelo resultado, como se ativo fosse'.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Conduta: Comissiva e Omissiva (Omissão Própria e Imprópria — Os Garantes)",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 3 — Nexo Causal (Q5-Q6)
  // ══════════════════════════════════════════════════════════════════

  // Q5 — Conditio sine qua non: supressão hipotética (MEDIO, CERTO)
  {
    id: "qz_pen_tip_005",
    statement:
      "Julgue o item conforme o Código Penal brasileiro.\n\n" +
      "Pela teoria da equivalência dos antecedentes causais (conditio sine qua non), " +
      "adotada no art. 13, caput, do CP, para verificar se uma conduta é causa de um " +
      "resultado, utiliza-se o processo hipotético de eliminação: suprime-se mentalmente " +
      "a conduta e, se o resultado não teria ocorrido como ocorreu, ela é considerada causa.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Art. 13, caput, CP: 'O resultado, de que depende a existência do crime, " +
      "somente é imputável a quem lhe deu causa. Considera-se causa a ação ou omissão sem " +
      "a qual o resultado não teria ocorrido.' Essa é a conditio sine qua non.\n" +
      "Método de verificação (Thyrén): ELIMINA-SE MENTALMENTE a conduta. Se o resultado " +
      "NÃO teria ocorrido (como ocorreu, nas mesmas condições) → a conduta É CAUSA.\n" +
      "Exemplo: 'A vendeu a arma para B. B usou a arma para matar C. A vendeu a arma é causa " +
      "da morte de C?' Suprime-se a venda: sem a arma, a morte teria ocorrido? Depende — por " +
      "isso o CP limita a retroação causal pela exigência de dolo/culpa.",
    explanationCorrect:
      "Correto! Art. 13, caput, CP: conditio sine qua non — causa = condição necessária para " +
      "o resultado. Método: supressão hipotética — elimina a conduta; se resultado some = é causa. " +
      "Problema: regressão ao infinito (mitigado pela exigência de dolo/culpa).",
    explanationWrong:
      "O item está CERTO. Art. 13, caput, CP: 'considera-se causa a ação ou omissão sem a qual " +
      "o resultado não teria ocorrido.' Método da supressão hipotética (Thyrén): elimina a conduta " +
      "mentalmente — se o resultado desaparece = é causa. O CP limita a regressão ao infinito " +
      "pela exigência de dolo ou culpa do agente.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Resultado e Nexo Causal: Teoria da Equivalência dos Antecedentes (Conditio Sine Qua Non)",
  },

  // Q6 — Causa superveniente relativa que por si só produz resultado EXCLUI imputação (MEDIO, ERRADO)
  {
    id: "qz_pen_tip_006",
    statement:
      "Julgue o item conforme o Código Penal brasileiro.\n\n" +
      "Na teoria da equivalência dos antecedentes causais, a causa relativamente " +
      "independente superveniente que, por si só, produz o resultado é considerada " +
      "mais uma das condições do crime, mantendo a responsabilidade do agente " +
      "originário pelo resultado final produzido.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O art. 13, §1°, CP prevê EXATAMENTE O CONTRÁRIO: 'A superveniência de " +
      "causa relativamente independente exclui a imputação quando, por si só, produziu " +
      "o resultado.' Ou seja, quando a causa superveniente relativamente independente " +
      "produz o resultado POR SI SÓ (ou seja, rompendo o nexo causal), o agente original " +
      "NÃO responde pelo resultado — responde apenas pelos atos já praticados.\n" +
      "Exemplo: A esfaqueia B levemente. B vai ao hospital e morre em incêndio no hospital.\n" +
      "→ O incêndio = causa superveniente relativamente independente que por si só produziu " +
      "a morte → A responde apenas pela lesão corporal, NÃO pelo homicídio.\n" +
      "Contraste: se B morresse de infecção decorrente da facada → desdobramento normal " +
      "da conduta → A responde pela morte (sem exclusão de imputação).",
    explanationCorrect:
      "O item está ERRADO. Art. 13, §1°, CP: causa superveniente relativamente independente " +
      "que por si só produz o resultado EXCLUI a imputação do resultado. O agente responde " +
      "apenas pelos atos praticados. O item afirmou o contrário — que manteria a responsabilidade.",
    explanationWrong:
      "O item está ERRADO. Art. 13, §1°, CP: 'A superveniência de causa relativamente independente " +
      "EXCLUI a imputação quando, por si só, produziu o resultado.' O agente responde só pelos atos " +
      "praticados. Exemplo: vítima de facada morre em incêndio no hospital → causador da facada " +
      "responde pela lesão, não pela morte. Só não exclui se a causa superveniente for desdobramento " +
      "normal/previsível da conduta (ex: infecção hospitalar da própria ferida).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Resultado e Nexo Causal: Teoria da Equivalência dos Antecedentes (Conditio Sine Qua Non)",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 4 — Tipicidade e Insignificância (Q7-Q8)
  // ══════════════════════════════════════════════════════════════════

  // Q7 — Insignificância exclui tipicidade MATERIAL (FACIL, CERTO)
  {
    id: "qz_pen_tip_007",
    statement:
      "Julgue o item conforme a jurisprudência do STF e a doutrina penal.\n\n" +
      "O princípio da insignificância (crime de bagatela) exclui a tipicidade MATERIAL " +
      "do fato: a conduta permanece formalmente típica (enquadra-se no tipo penal), " +
      "mas a lesão ao bem jurídico tutelado é tão ínfima que não justifica a intervenção " +
      "do Direito Penal, resultando em fato materialmente atípico.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. O STF (HC 84.412/SP — Min. Celso de Mello) consolidou que o princípio da " +
      "insignificância afasta a tipicidade MATERIAL, não a formal. O fato continua se " +
      "enquadrando na descrição legal (tipicidade formal), mas a lesão ao bem jurídico " +
      "é tão inexpressiva que o sistema penal não deve reagir.\n" +
      "Requisitos cumulativos (STF):\n" +
      "1) Mínima ofensividade da conduta\n" +
      "2) Nenhuma periculosidade social da ação\n" +
      "3) Reduzidíssimo grau de reprovabilidade do comportamento\n" +
      "4) Inexpressividade da lesão jurídica\n" +
      "Resultado: fato FORMALMENTE TÍPICO + MATERIALMENTE ATÍPICO → sem crime.",
    explanationCorrect:
      "Correto! Insignificância = exclui tipicidade MATERIAL (lesão ínfima ao bem jurídico). " +
      "Fato permanece formalmente típico. Requisitos STF (HC 84.412): mínima ofensividade + " +
      "nenhuma periculosidade + reduzidíssima reprovabilidade + inexpressiva lesão.",
    explanationWrong:
      "O item está CERTO. Princípio da insignificância (STF — HC 84.412): exclui tipicidade " +
      "MATERIAL. Fato é formalmente típico (se enquadra na lei) mas materialmente atípico " +
      "(lesão ínfima ao bem jurídico). Resultado: sem crime. Quatro requisitos cumulativos: " +
      "mínima ofensividade, nenhuma periculosidade, reduzidíssima reprovabilidade, " +
      "inexpressividade da lesão.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Tipicidade: Formal vs Material e o Princípio da Insignificância",
  },

  // Q8 — Insignificância NÃO se aplica a crimes com violência/grave ameaça (MEDIO, ERRADO)
  {
    id: "qz_pen_tip_008",
    statement:
      "Julgue o item conforme a jurisprudência do STF e do STJ.\n\n" +
      "O princípio da insignificância pode ser aplicado a qualquer crime previsto no " +
      "Código Penal, inclusive aos crimes cometidos com violência ou grave ameaça à " +
      "pessoa, desde que o resultado material seja de pequeno valor econômico e o " +
      "agente seja primário.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O STF firmou entendimento de que o princípio da insignificância NÃO se " +
      "aplica indistintamente a qualquer crime. Casos em que os tribunais superiores " +
      "AFASTAM a bagatela:\n" +
      "• Crimes cometidos com VIOLÊNCIA OU GRAVE AMEAÇA à pessoa: ex. roubo (art. 157 CP) — " +
      "jamais pode ser bagatela, pois além do patrimônio, há ofensa à integridade e liberdade.\n" +
      "• TRÁFICO DE DROGAS: o STF entende que a saúde pública é bem jurídico de alta relevância.\n" +
      "• Crimes contra a ADMINISTRAÇÃO PÚBLICA: STF não admite (probidade e moralidade " +
      "administrativa não comportam relativização).\n" +
      "• VIOLÊNCIA DOMÉSTICA e familiar contra a mulher: STJ — Súmula 589.\n" +
      "• MOEDA FALSA: STJ — fé pública não admite bagatela.\n" +
      "O valor econômico pequeno é relevante mas não suficiente — a natureza do crime importa.",
    explanationCorrect:
      "O item está ERRADO. Insignificância NÃO se aplica a crimes com violência ou grave ameaça " +
      "(ex: roubo). STF/STJ vedam também para: tráfico de drogas, crimes contra a administração " +
      "pública, violência doméstica (Súm. 589 STJ), moeda falsa. O valor pequeno é necessário " +
      "mas não suficiente — a natureza do crime define a aplicabilidade.",
    explanationWrong:
      "O item está ERRADO. Crimes com VIOLÊNCIA ou GRAVE AMEAÇA (ex: roubo) NÃO admitem " +
      "insignificância — o STF entende que a ofensa vai além do patrimônio. Outros vedados: " +
      "tráfico de drogas (saúde pública), crimes contra a administração pública (probidade), " +
      "violência doméstica (Súm. 589/STJ). Primariedade e valor ínfimo são condições necessárias " +
      "mas não suficientes — a natureza do crime deve permitir a aplicação do princípio.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Tipicidade: Formal vs Material e o Princípio da Insignificância",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 5 — Dolo e Culpa (Q9-Q10)
  // ══════════════════════════════════════════════════════════════════

  // Q9 — Dolo eventual vs culpa consciente: distinção = assunção do risco (MEDIO, CERTO)
  {
    id: "qz_pen_tip_009",
    statement:
      "Julgue o item conforme o art. 18 do Código Penal brasileiro.\n\n" +
      "No dolo eventual, o agente prevê o resultado como possível e ASSUME O RISCO de " +
      "produzi-lo, conformando-se com sua ocorrência. Na culpa consciente, o agente " +
      "também prevê o resultado como possível, mas ACREDITA SINCERAMENTE que ele não " +
      "ocorrerá, confiando em suas habilidades ou na sorte para evitá-lo. A diferença " +
      "fundamental entre ambos está na aceitação ou não do resultado previsto.",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Art. 18, I, CP: 'doloso, quando o agente quis o resultado ou assumiu o " +
      "risco de produzi-lo.' A segunda parte ('assumiu o risco') define o DOLO EVENTUAL.\n" +
      "DOLO EVENTUAL: prevê + ACEITA (conforma-se, assume o risco). Fórmula: 'Se ocorrer, " +
      "que seja — dane-se.' Teoria do assentimento/consentimento.\n" +
      "CULPA CONSCIENTE: prevê + CONFIA QUE NÃO OCORRERÁ. Fórmula: 'Prevejo, mas " +
      "minha habilidade vai evitar.' Teoria da representação.\n" +
      "Ambos PREVEEM o resultado — o que os diferencia é a ACEITAÇÃO:\n" +
      "• Aceita → dolo eventual.\n" +
      "• Confia que não ocorrerá → culpa consciente.",
    explanationCorrect:
      "Correto! Art. 18, I, CP (dolo eventual): 'assumiu o risco de produzi-lo.' " +
      "Dolo eventual: prevê + assume (aceita). Culpa consciente: prevê + confia que não ocorrerá. " +
      "Distinção: ASSUNÇÃO DO RISCO vs CONFIANÇA NA NÃO-OCORRÊNCIA. Ambos preveem o resultado.",
    explanationWrong:
      "O item está CERTO. Art. 18, I, CP: dolo eventual = 'assumiu o risco de produzi-lo'. " +
      "Distinção exata: dolo eventual → prevê + aceita ('dane-se'). Culpa consciente → prevê + " +
      "confia que não ocorre. O que diferencia: ACEITAÇÃO do resultado. Ambos preveem — só o " +
      "dolo eventual aceita.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Dolo e Culpa: Dolo Direto, Eventual e Culpa Consciente — A Linha Divisória",
  },

  // Q10 — Dolo eventual ≠ dolo direto de 2° grau: resultado possível vs certo (DIFICIL, ERRADO)
  {
    id: "qz_pen_tip_010",
    statement:
      "Julgue o item conforme a doutrina penal brasileira.\n\n" +
      "O dolo eventual e o dolo direto de segundo grau são figuras equivalentes, pois, " +
      "em ambos os casos, o agente prevê e aceita o resultado como possível. A única " +
      "distinção entre eles é a certeza sobre a ocorrência do resultado: no dolo " +
      "eventual, o resultado é provável; no dolo de segundo grau, o resultado é certo.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O item identifica corretamente que a distinção está na certeza, mas afirma " +
      "equivocadamente que as figuras são 'equivalentes'. Elas são DISTINTAS:\n\n" +
      "DOLO DIRETO DE 2° GRAU (dolo de consequências necessárias):\n" +
      "• O resultado não é o FIM almejado, mas é EFEITO CERTO E INEVITÁVEL do meio escolhido.\n" +
      "• O agente ACEITA resultado CERTO (ainda que indesejado).\n" +
      "• Exemplo: para matar A que está em avião, o agente coloca uma bomba. Os demais " +
      "passageiros também morrem — resultado CERTO e aceito. Dolo de 2° grau em relação a eles.\n\n" +
      "DOLO EVENTUAL:\n" +
      "• O resultado é POSSÍVEL (incerto, pode ou não ocorrer).\n" +
      "• O agente ASSUME O RISCO de um resultado INCERTO.\n" +
      "• Exemplo: motorista em racha que aceita o risco de morte dos pedestres — resultado possível, não certo.\n\n" +
      "Não são equivalentes: 2° grau = resultado CERTO (art. 18, I, 1ª parte); " +
      "eventual = resultado POSSÍVEL (art. 18, I, parte final).",
    explanationCorrect:
      "O item está ERRADO. Dolo de 2° grau e dolo eventual NÃO são equivalentes. " +
      "2° grau: resultado certo/inevitável como consequência necessária do meio. " +
      "Eventual: resultado possível/incerto + assume o risco. A certeza não é apenas " +
      "uma nuance — define duas figuras dolosas distintas (art. 18, I, CP).",
    explanationWrong:
      "O item está ERRADO. Dolo de 2° grau: resultado CERTO como efeito necessário do meio " +
      "(ex: bomba em avião mata todos — certo e inevitável). Dolo eventual: resultado POSSÍVEL " +
      "(incerto) — agente assume o risco de algo que pode ou não ocorrer. São figuras distintas: " +
      "certeza (2° grau) vs possibilidade (eventual). A afirmação de que são 'equivalentes' está " +
      "errada — diferem em natureza, não apenas em grau de certeza.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Dolo e Culpa: Dolo Direto, Eventual e Culpa Consciente — A Linha Divisória",
  },

  // ══════════════════════════════════════════════════════════════════
  // Átomo 6 — Iter Criminis (Q11-Q12)
  // ══════════════════════════════════════════════════════════════════

  // Q11 — Cogitação nunca punível; tentativa: pena -1/3 a -2/3 (FACIL, CERTO)
  {
    id: "qz_pen_tip_011",
    statement:
      "Julgue o item conforme o Código Penal brasileiro.\n\n" +
      "No iter criminis, a fase de cogitação nunca é punível, pois o Direito Penal " +
      "não pune o mero pensamento criminoso. A tentativa, por sua vez, ocorre quando " +
      "o agente inicia os atos executórios mas não consuma o crime por circunstâncias " +
      "alheias à sua vontade, sendo a pena reduzida de 1/3 a 2/3 em relação ao " +
      "crime consumado (art. 14, parágrafo único, CP).",
    alternatives: CE,
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "CERTO. Princípio consagrado: 'Cogitationis poenam nemo patitur' — ninguém é punido " +
      "por seus pensamentos. A cogitação é fase interna e juridicamente irrelevante.\n" +
      "Art. 14, II, CP: 'Diz-se o crime tentado quando, iniciada a execução, não se consuma " +
      "por circunstâncias alheias à vontade do agente.'\n" +
      "Art. 14, parágrafo único, CP: pena da tentativa = pena do crime consumado reduzida " +
      "de 1/3 a 2/3. Critério da redução: quanto mais próximo da consumação, menor a redução " +
      "(iter criminis mais percorrido = redução menor; iter pouco percorrido = redução maior).\n" +
      "Atos preparatórios: em regra também não puníveis (exceção: crime autônomo — " +
      "ex: art. 291 CP, art. 288 CP).",
    explanationCorrect:
      "Correto! Cogitação: nunca punível (princípio 'cogitationis poenam nemo patitur'). " +
      "Tentativa: art. 14, II (execução iniciada + não consumação por causas alheias). " +
      "Pena: art. 14, §único = redução de 1/3 a 2/3. Quanto mais próximo da consumação, " +
      "menor a redução.",
    explanationWrong:
      "O item está CERTO. Cogitação = nunca punível (direito penal não pune pensamentos). " +
      "Tentativa: art. 14, II, CP (inicia execução + não consuma por circunstâncias alheias). " +
      "Pena: art. 14, §único = reduzida de 1/3 a 2/3 conforme quanto o iter foi percorrido.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
    contentTitle: "Iter Criminis: Da Cogitação à Consumação — Tentativa e Desistência Voluntária",
  },

  // Q12 — Desistência voluntária ≠ tentativa: responde pelos atos praticados (art. 15) (MEDIO, ERRADO)
  {
    id: "qz_pen_tip_012",
    statement:
      "Julgue o item conforme o Código Penal brasileiro.\n\n" +
      "O agente que inicia a execução de um roubo (art. 157, CP), mas desiste " +
      "voluntariamente de consumá-lo antes de subtrair qualquer bem ou usar violência " +
      "adicional, responde por TENTATIVA DE ROUBO com redução de pena de 1/3 a 2/3, " +
      "pois já havia iniciado os atos executórios do crime.",
    alternatives: CE,
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "ERRADO. O art. 15, CP estabelece a DESISTÊNCIA VOLUNTÁRIA (e o arrependimento eficaz), " +
      "que funciona como 'ponte de ouro': o agente que desiste VOLUNTARIAMENTE da execução " +
      "NÃO responde pela tentativa do crime inicialmente pretendido.\n" +
      "Art. 15, CP: 'O agente que, voluntariamente, desiste de prosseguir na execução ou " +
      "impede que o resultado se produza, só responde pelos atos já praticados.'\n" +
      "• 'POSSO PROSSEGUIR, MAS NÃO QUERO' = desistência voluntária → sem tentativa.\n" +
      "• 'QUERO PROSSEGUIR, MAS NÃO POSSO' (chegou viatura) = tentativa (circunstância alheia).\n" +
      "No exemplo do item: se não houve subtração nem violência → responde apenas pelos " +
      "atos praticados (que podem não configurar crime autônomo). NÃO há tentativa de roubo.\n" +
      "Distinção: tentativa (art. 14, II) = causas ALHEIAS; desistência (art. 15) = voluntária.",
    explanationCorrect:
      "O item está ERRADO. Desistência VOLUNTÁRIA (art. 15, CP): agente responde apenas pelos " +
      "atos praticados — NÃO por tentativa do crime pretendido. 'Posso, mas não quero' = " +
      "desistência. 'Quero, mas não posso' = tentativa. Art. 15 é chamado de 'ponte de ouro' — " +
      "incentiva a não-consumação.",
    explanationWrong:
      "O item está ERRADO. Art. 15, CP (desistência voluntária): o agente que desiste " +
      "voluntariamente responde APENAS pelos atos já praticados — não pela tentativa do crime " +
      "pretendido. Tentativa (art. 14, II) exige circunstância ALHEIA à vontade que impeça a " +
      "consumação. Desistência voluntária = sem tentativa. Fórmula: 'posso mas não quero' = " +
      "desistência (art. 15); 'quero mas não posso' = tentativa (art. 14, II).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
    contentTitle: "Iter Criminis: Da Cogitação à Consumação — Tentativa e Desistência Voluntária",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n⚖️   Seed R26: Direito Penal — Teoria do Crime (O Fato Típico)\n");

  // ── 1. Encontrar Subject ────────────────────────────────────────────────
  let subjectId = await findSubject("DIREITO_PENAL");
  if (!subjectId) subjectId = await findSubject("Direito Penal");
  if (!subjectId) subjectId = await findSubject("penal");
  if (!subjectId) subjectId = await findSubject("Penal");
  if (!subjectId) {
    console.error("❌ Subject para Direito Penal não encontrado.");
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

  // ── 4. Criar tópico 'Teoria do Crime' ──────────────────────────────────
  const topicId = await findOrCreateTopic("Teoria do Crime", subjectId);
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
  console.error("❌ Seed R26 falhou:", err);
  process.exit(1);
});
