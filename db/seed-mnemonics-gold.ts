/**
 * db/seed-mnemonics-gold.ts
 *
 * Seed dos 33 Mnemônicos Estratégicos — Passarei Gold
 * ---------------------------------------------------
 * Insere na tabela `mnemonics` (criada via auto-migrate.ts).
 * Subject_id resolvido dinamicamente via SELECT no banco.
 * Idempotente: usa ON CONFLICT (title) DO NOTHING.
 *
 * Uso: npx tsx db/seed-mnemonics-gold.ts
 */

import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function findSubjectId(nameLike: string): Promise<string | null> {
  const rows = await sql`
    SELECT id FROM "Subject" WHERE name ILIKE ${"%" + nameLike + "%"} LIMIT 1
  `;
  return rows[0]?.id ?? null;
}

interface Mnemonic {
  title: string;
  phrase: string;
  meaning: string;
  category: "POLICIAL" | "MILITAR" | "GERAL";
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  subjectSearch: string;
}

const MNEMONICS: Mnemonic[] = [

  // ═══════════════════════════════════════════════════════════
  // ⚖️  DIREITO CONSTITUCIONAL
  // ═══════════════════════════════════════════════════════════
  {
    title: "Fundamentos da República Federativa do Brasil (Art. 1º CF)",
    phrase: "SO-CI-DI-VA-PLU",
    meaning: `**SO**berania · **CI**dadania · **DI**gnidade da pessoa humana · **VA**lores sociais do trabalho e da livre iniciativa · **PLU**ralismo político

> 💡 *Como cai no Cebraspe:* A banca costuma trocar "pluralismo político" por "pluripartidarismo" ou incluir "separação dos poderes" — que é princípio, não fundamento. Atenção à distinção entre fundamentos (Art. 1º) e objetivos (Art. 3º).`,
    category: "GERAL",
    difficulty: "FACIL",
    subjectSearch: "Constitucional",
  },
  {
    title: "Objetivos Fundamentais da República (Art. 3º CF)",
    phrase: "CON-GA-ER-PRO",
    meaning: `Sempre **verbos no infinitivo** — a República quer:

**CON**struir uma sociedade livre, justa e solidária · **GA**rantir o desenvolvimento nacional · **ER**radicar a pobreza e a marginalização e reduzir as desigualdades sociais e regionais · **PRO**mover o bem de todos, sem preconceitos

> 💡 *Como cai no Cebraspe:* A banca troca "construir" por "estabelecer" ou omite "reduzir as desigualdades regionais". Os 4 verbos no infinitivo são o gatilho da questão.`,
    category: "GERAL",
    difficulty: "FACIL",
    subjectSearch: "Constitucional",
  },
  {
    title: "Princípios das Relações Internacionais (Art. 4º CF)",
    phrase: "IN-PRE-AUTO-NÃO-IGUAL-DE-PAZ-RE-CO-ASI",
    meaning: `Os 10 incisos do Art. 4º em ordem:

**IN**dependência nacional (I) · **PRE**valência dos direitos humanos (II) · **AUTO**determinação dos povos (III) · **NÃO**-intervenção (IV) · **IGUAL**dade entre os Estados (V) · **DE**fesa da paz (VI) · **PAZ** — solução pacífica dos conflitos (VII) · **RE**púdio ao terrorismo e ao racismo (VIII) · **CO**operação entre os povos para o progresso da humanidade (IX) · **ASI**lo político — concessão (X)

> ⚠️ *Atenção:* Não confundir com os fundamentos (Art. 1º) nem com os objetivos (Art. 3º). Cebraspe gosta de testar se "independência nacional" é fundamento ou princípio das relações internacionais — é relações internacionais (Art. 4º, I).`,
    category: "GERAL",
    difficulty: "MEDIO",
    subjectSearch: "Constitucional",
  },

  // ═══════════════════════════════════════════════════════════
  // 🏛️  DIREITO ADMINISTRATIVO
  // ═══════════════════════════════════════════════════════════
  {
    title: "Princípios Expressos da Administração Pública (Art. 37 CF)",
    phrase: "L.I.M.P.E.",
    meaning: `**L**egalidade · **I**mpessoalidade · **M**oralidade · **P**ublicidade · **E**ficiência

> 💡 *Como cai:* Eficiência foi inserida pela EC 19/98 — é a mais recente e a que mais cai em questões sobre reforma administrativa. Cebraspe costuma acrescentar "proporcionalidade" ou "razoabilidade" como se fossem expressos — são implícitos, não estão no caput do Art. 37.`,
    category: "POLICIAL",
    difficulty: "FACIL",
    subjectSearch: "Administrativo",
  },
  {
    title: "Atributos do Ato Administrativo",
    phrase: "P.A.T.I.",
    meaning: `**P**resunção de legitimidade e veracidade · **A**utoexecutoriedade · **T**ipicidade · **I**mperatividade

> 💡 *Como cai:* Nem todo ato tem todos os atributos — autoexecutoriedade e imperatividade não estão presentes em todos (ex: atos negociais). A banca testa se o candidato sabe distinguir quais atributos são universais (presunção de legitimidade) dos que são condicionais.`,
    category: "POLICIAL",
    difficulty: "MEDIO",
    subjectSearch: "Administrativo",
  },
  {
    title: "Elementos (Requisitos) do Ato Administrativo",
    phrase: "COM-FI-FOR-MO-OB",
    meaning: `**COM**petência · **FI**nalidade · **FOR**ma · **MO**tivo · **OB**jeto

> 💡 *Como cai:* "Mérito" do ato (conveniência e oportunidade) está dentro do **motivo** e do **objeto** — não é um elemento autônomo. Vícios em competência, forma e finalidade geram **nulidade**; vícios no motivo e objeto podem gerar anulação. Cebraspe testa isso em questões sobre convalidação.`,
    category: "POLICIAL",
    difficulty: "MEDIO",
    subjectSearch: "Administrativo",
  },
  {
    title: "Poderes Administrativos",
    phrase: "DI-VI-HI-RE",
    meaning: `**DI**scricionário · **VI**nculado · **HI**erárquico · **RE**gulamentar

> 💡 *Atenção:* O mnemônico original usava "PO" de "Poárquico", mas o nome correto é **Hierárquico**. Somam-se ainda os poderes **Disciplinar** e **de Polícia** que a banca costuma testar separadamente. DI-VI-HI-RE cobre os 4 mais cobrados em questões de classificação.`,
    category: "POLICIAL",
    difficulty: "MEDIO",
    subjectSearch: "Administrativo",
  },
  {
    title: "Formas de Provimento em Cargo Público (Art. 8º Lei 8.112/90)",
    phrase: "PANRE4",
    meaning: `**P**romoção · **A**proveitamento · **N**omeação *(única forma originária)* · **R**eadaptação *(limitação física ou mental superveniente)* · **R**eversão *("vovô voltou" — aposentado retorna)* · **R**eintegração *(demitido por decisão judicial)* · **R**econdução *(estável reprovado no estágio probatório de novo cargo)*

> 💡 *Como cai:* Nomeação é a **única forma originária** — todas as demais são derivadas. Cebraspe adora perguntar se "aproveitamento" é forma originária ou derivada. É **derivada** (servidor que estava em disponibilidade).`,
    category: "POLICIAL",
    difficulty: "MEDIO",
    subjectSearch: "Administrativo",
  },
  {
    title: "Formas de Extinção do Ato Administrativo",
    phrase: "CA-RE-CA-CA",
    meaning: `**CA**ssação — beneficiário descumpriu condições do ato · **RE**vogação — conveniência e oportunidade (mérito), só para atos válidos · **CA**ducidade — nova lei tornou o ato anterior incompatível · **CA**ncelamento/Anulação — vício de legalidade na origem do ato

> 💡 *Como cai:* Cebraspe diferencia revogação (mérito, ato válido, efeitos *ex nunc*) de anulação (legalidade, efeitos *ex tunc*). "Caducidade" é frequentemente trocada por "decadência" na prova — são institutos distintos.`,
    category: "POLICIAL",
    difficulty: "DIFICIL",
    subjectSearch: "Administrativo",
  },
  {
    title: "Excludentes da Responsabilidade Civil do Estado",
    phrase: "FOR-CA-CUL",
    meaning: `O Estado **não** indeniza quando houver:

**FOR**ça maior *(eventos imprevisíveis e inevitáveis da natureza)* · **CA**so fortuito *(em regra — dano causado por terceiros ou multidão)* · **CUL**pa exclusiva da vítima

> 💡 *Como cai:* A responsabilidade do Estado é **objetiva** (teoria do risco administrativo) — o Estado só se exime provando uma dessas três excludentes. Cebraspe testa se culpa concorrente da vítima exclui ou apenas **atenua** a responsabilidade — a resposta é: apenas atenua.`,
    category: "POLICIAL",
    difficulty: "MEDIO",
    subjectSearch: "Administrativo",
  },

  // ═══════════════════════════════════════════════════════════
  // 🚔  DIREITO PENAL
  // ═══════════════════════════════════════════════════════════
  {
    title: "Causas de Exclusão de Ilicitude (Art. 23 CP)",
    phrase: "L.E.E.P.",
    meaning: `**L**egítima defesa (Art. 25) · **E**stado de necessidade (Art. 24) · **E**strito cumprimento do dever legal · **P**exercício regular de direito

> 💡 *Como cai:* Cebraspe testa se "obediência hierárquica" exclui ilicitude — **não exclui**, exclui **culpabilidade**. Legítima defesa putativa (imaginária) é **erro de tipo** quando o erro for escusável, afastando dolo e culpa.`,
    category: "POLICIAL",
    difficulty: "FACIL",
    subjectSearch: "Penal",
  },
  {
    title: "Crimes Inafiançáveis e Imprescritíveis (Art. 5º, XLII e XLIV CF)",
    phrase: "R.A.C.H.A.",
    meaning: `**RA**cismo (inafiançável + imprescritível — Art. 5º, XLII) · **A**ção de grupos armados civis ou militares contra a ordem constitucional e o Estado democrático (inafiançável + imprescritível — Art. 5º, XLIV)

> 💡 *Como cai:* **Só** esses dois crimes são **imprescritíveis** na CF. Terrorismo, tortura e hediondos são inafiançáveis mas **prescritíveis**. Banca cobra essa distinção com frequência.`,
    category: "POLICIAL",
    difficulty: "FACIL",
    subjectSearch: "Penal",
  },
  {
    title: "Crimes Inafiançáveis e Insuscetíveis de Graça ou Anistia (Art. 5º, XLIII CF)",
    phrase: "3T + H",
    meaning: `**T**ortura · **T**ráfico ilícito de entorpecentes e drogas afins · **T**errorismo · crimes **H**ediondos

> 💡 *Como cai:* São inafiançáveis e insuscetíveis de graça ou anistia — mas **prescritíveis** (diferente de racismo e ação de grupos armados). A Lei 8.072/90 regulamenta os hediondos. Cebraspe cobra se "lavagem de dinheiro" é hediondo — **não é**.`,
    category: "POLICIAL",
    difficulty: "FACIL",
    subjectSearch: "Penal",
  },
  {
    title: "Tempo e Lugar do Crime",
    phrase: "L.U.T.A.",
    meaning: `**LU**gar do crime = Teoria da **U**biquidade — lugar da ação *ou* do resultado (Art. 6º CP)

**T**empo do crime = Teoria da **A**tividade — momento da ação ou omissão, ainda que outro seja o momento do resultado (Art. 4º CP)

> 💡 *Como cai:* LUTA = **Lu**gar/**U**biquidade · **T**empo/**A**tividade. Cebraspe inverte os dois para testar. Para crimes à distância (resultado em outro país), aplica-se a ubiquidade.`,
    category: "POLICIAL",
    difficulty: "FACIL",
    subjectSearch: "Penal",
  },
  {
    title: "Erro de Tipo vs. Erro de Proibição",
    phrase: "Tipo = O QUÊ faz / Proibição = SE PODE fazer",
    meaning: `**Erro de Tipo** — o agente *não sabe o que está fazendo* (ex: leva a mala de outro achando ser a sua). Exclui o **dolo**; se escusável, exclui também a culpa → **atípico**.

**Erro de Proibição** — o agente *sabe o que faz, mas crê ser permitido* (ex: acha que pode matar em legítima defesa imaginária). Exclui a **culpabilidade**; se inevitável, isenta de pena; se evitável, reduz a pena.

> 💡 *Como cai:* Banca testa: "O agente matou achando que a vítima era um animal" → Erro de **tipo** (não sabia o que fazia). "O agente praticou ato sexual com menor achando ser permitido em sua cultura" → Erro de **proibição** (sabia o que fazia, mas achava lícito).`,
    category: "POLICIAL",
    difficulty: "MEDIO",
    subjectSearch: "Penal",
  },
  {
    title: "Crimes contra a Administração Pública praticados por Funcionário (Caput Art. 312–359 CP)",
    phrase: "P.P.C.C.O.",
    meaning: `**P**eculato — apropriar-se de dinheiro público (Art. 312) · **P**revaricação — retardar ato para satisfazer interesse pessoal (Art. 319) · **C**oncussão — exigir vantagem indevida com violência ou grave ameaça (Art. 316) · **C**orrupção passiva — solicitar ou receber vantagem indevida (Art. 317) · **C**ondescendência criminosa — deixar de punir subordinado por indulgência (Art. 320)

> 💡 *Como cai:* Peculato doloso admite tentativa; peculato culposo tem **extinção da punibilidade** se o agente repara o dano antes do trânsito em julgado. Cebraspe diferencia Concussão (exigir) de Corrupção Passiva (solicitar/receber sem violência).`,
    category: "POLICIAL",
    difficulty: "MEDIO",
    subjectSearch: "Penal",
  },

  // ═══════════════════════════════════════════════════════════
  // 📋  DIREITO PROCESSUAL PENAL
  // ═══════════════════════════════════════════════════════════
  {
    title: "Características do Inquérito Policial",
    phrase: "I.D.E.O.S.A.",
    meaning: `**I**nquisitivo — não há contraditório nem ampla defesa plenos · **D**ispensável — o MP pode oferecer denúncia sem ele · **E**scrito — todos os atos são documentados · **O**ficioso — instaurado de ofício pela autoridade · **S**igiloso — para terceiros (advogado tem acesso às peças já documentadas — Súmula Vinculante 14) · **A**dministrativo — não jurisdicional, não produz coisa julgada

> 💡 *Como cai:* "O IP é imprescindível para a ação penal" → **ERRADO**, é dispensável. "O indiciado não tem direito a advogado no IP" → **ERRADO** — SV 14 garante acesso às peças documentadas.`,
    category: "POLICIAL",
    difficulty: "MEDIO",
    subjectSearch: "Processual Penal",
  },
  {
    title: "Fases da Prisão em Flagrante",
    phrase: "Pre-Ca-La-No",
    meaning: `**Pre**ndere — captura do flagrante · **Ca**ndere — condução coercitiva à delegacia · **La**vrare — lavratura do auto de prisão em flagrante · **No**tare — recolhimento ao cárcere com entrega da nota de culpa

> 💡 *Como cai:* A nota de culpa deve ser entregue ao preso em **24h**. O delegado deve comunicar a prisão ao juiz e ao MP em **24h**. A audiência de custódia deve ocorrer em **24h** após a prisão (ADPF 347).`,
    category: "POLICIAL",
    difficulty: "MEDIO",
    subjectSearch: "Processual Penal",
  },
  {
    title: "Requisitos da Prisão Preventiva (Art. 312 CPP)",
    phrase: "G.O.P.E.",
    meaning: `**G**arantia da ordem pública · **O**rdem econômica · **P**reservação da instrução criminal (conveniência da instrução) · **E**fetivação da aplicação da lei penal (assegurar)

> 💡 *Como cai:* A prisão preventiva exige **fumus comissi delicti** (indícios de autoria e materialidade) + **periculum libertatis** (um dos 4 requisitos do GOPE). Decretada de ofício pelo juiz **apenas** na fase processual — na fase investigativa, depende de requerimento. EC 35/2023 vedou prisão preventiva de ofício.`,
    category: "POLICIAL",
    difficulty: "MEDIO",
    subjectSearch: "Processual Penal",
  },
  {
    title: "Características do Inquérito Policial — versão compacta",
    phrase: "S.E.I.D.O.",
    meaning: `**S**igiloso · **E**scrito · **I**nquisitivo · **D**ispensável · **O**ficioso

> 💡 *Versão reduzida do IDEOSA — use quando a prova exigir marcar V/F em lista de características. Qualquer item fora desse conjunto (ex: "contraditório", "oral") estará errado.`,
    category: "POLICIAL",
    difficulty: "FACIL",
    subjectSearch: "Processual Penal",
  },

  // ═══════════════════════════════════════════════════════════
  // 🛡️  LEGISLAÇÃO ESPECIAL
  // ═══════════════════════════════════════════════════════════
  {
    title: "Lei de Drogas — Causas de Aumento de Pena (Art. 40 Lei 11.343/06)",
    phrase: "TRANS-INTER-HOSP-PRIS-ADMIN",
    meaning: `**TRANS**fronteiriço ou internacional (inciso I) · **INTER**estadual (inciso V) · **HOSP**itais, escolas ou proximidades (inciso III) · **PRIS**ões — interior de estabelecimentos prisionais (inciso IV) · **ADMIN**istração pública — praticado por funcionário público no exercício da função (inciso VII)

> 💡 *Como cai:* O Art. 40 tem 7 incisos; TRANS-INTER-HOSP-PRIS-ADMIN cobre os 5 mais cobrados. Noite (inciso VI) e uso de arma ou violência (inciso II) completam o rol. Banca testa se "tráfico interestadual" aumenta a pena — **aumenta** (inciso V).`,
    category: "POLICIAL",
    difficulty: "MEDIO",
    subjectSearch: "Legislação Especial",
  },
  {
    title: "Abuso de Autoridade — Finalidades Específicas (Art. 1º Lei 13.869/19)",
    phrase: "P.E.M.P.",
    meaning: `O crime de abuso de autoridade só existe se o agente agir com intenção específica de:

**P**rejudicar outrem · **B**eneficiar a si mesmo ou a terceiro *(o "E" original foi corrigido — a lei usa "beneficiar")* · **M**ero capricho · **P**repotência / satisfação pessoal

> ⚠️ *Correção:* A lei diz "prejudicar outrem, beneficiar a si mesmo ou a terceiro, por mero capricho ou satisfação pessoal". O "E" deve ser lido como **b**Eneficiar. Sem uma dessas finalidades, **não** há crime de abuso de autoridade — pode haver outra infração.`,
    category: "POLICIAL",
    difficulty: "MEDIO",
    subjectSearch: "Legislação Especial",
  },
  {
    title: "Crimes de Trânsito que Admitem Prisão em Flagrante (mesmo prestado socorro)",
    phrase: "RA-PE-DR",
    meaning: `Nos três crimes abaixo, o condutor **pode ser preso em flagrante** mesmo que preste socorro à vítima:

**RA**cha — participação em competição não autorizada (Art. 308 CTB) · **PE**rigo de dano — direção que gera perigo concreto (Art. 309 CTB) · **DR**ogado — embriaguez ao volante (Art. 306 CTB)

> 💡 *Como cai:* Em regra, prestar socorro afasta a prisão em flagrante nos crimes de trânsito (Art. 301 CTB). Nos crimes RA-PE-DR, o socorro não impede o flagrante pois a gravidade é maior. PRF cobra esse ponto com frequência.`,
    category: "POLICIAL",
    difficulty: "FACIL",
    subjectSearch: "Legislação Especial",
  },

  // ═══════════════════════════════════════════════════════════
  // 🧪  CRIMINALÍSTICA / MEDICINA LEGAL
  // ═══════════════════════════════════════════════════════════
  {
    title: "Fenômenos Cadavéricos Consecutivos (Sinais de Morte Real)",
    phrase: "L.I.A.R.",
    meaning: `**L**ivor mortis — manchas hipostáticas (por acúmulo de sangue nas partes declives do corpo; fixam-se em 6–12h) · **I**ngurgitamento — ingurgitamento visceral · **A**lgor mortis — esfriamento progressivo do corpo (≈ 1 °C/h) · **R**igor mortis — rigidez cadavérica (inicia em 2–6h, máxima em 12–24h, desaparece em 36–48h)

> 💡 *Como cai em PC/Perito:* Livores que mudam de posição indicam que o corpo foi movido **antes** de 6h da morte. Rigidez já estabelecida = morte há mais de 12h. Banca testa a cronologia dos fenômenos para calcular o intervalo post-mortem.`,
    category: "POLICIAL",
    difficulty: "MEDIO",
    subjectSearch: "Medicina Legal",
  },

  // ═══════════════════════════════════════════════════════════
  // 🪖  MILITARES
  // ═══════════════════════════════════════════════════════════
  {
    title: "Atributos da Hierarquia e Disciplina Militares",
    phrase: "V.E.R.A.",
    meaning: `**V**alores — os valores militares orientam a conduta · **E**tica — padrão moral de comportamento · **R**espeito — à hierarquia e à dignidade dos pares · **A**utoridade — exercício legítimo do comando

> 💡 *Como cai (ESA/EsPCEx/CFO):* Hierarquia e disciplina são as bases das instituições militares (Art. 142 CF). Questões pedem o conceito de cada um e a diferença entre hierarquia (graus de autoridade) e disciplina (cumprimento das normas).`,
    category: "MILITAR",
    difficulty: "FACIL",
    subjectSearch: "Legislação Institucional",
  },
  {
    title: "Valores Militares Fundamentais",
    phrase: "PA-DE-CI-LE-PRO",
    meaning: `**PA**triotismo — amor e dedicação à Pátria · **DE**ver — cumprimento das obrigações militares · **CI**vismo — respeito às instituições democráticas · **LE**aldade — fidelidade à Constituição e à hierarquia · **PRO**bidade — honestidade e integridade no exercício da função

> 💡 *Como cai:* Questões de ética e deontologia militar pedem a listagem dos valores. "Coragem" e "disciplina" podem aparecer como distratores — não estão neste conjunto canônico de 5.`,
    category: "MILITAR",
    difficulty: "FACIL",
    subjectSearch: "Legislação Institucional",
  },
  {
    title: "Sanções Disciplinares Militares (do mais leve ao mais grave)",
    phrase: "AD-RE-DE-EX",
    meaning: `Em ordem crescente de gravidade:

**AD**vertência — verbal ou escrita, para infrações leves · **RE**preensão — comunicação formal registrada · **DE**tenção — afastamento temporário das atividades · **EX**clusão / Expulsão — desligamento do serviço militar

> 💡 *Como cai:* A sequência do mais leve ao mais grave é o que a banca testa. "Licenciamento" é diferente de "exclusão" — o licenciamento pode ser a pedido ou por conclusão do serviço. Exclusão/expulsão é punição disciplinar máxima.`,
    category: "MILITAR",
    difficulty: "FACIL",
    subjectSearch: "Legislação Institucional",
  },
  {
    title: "Deveres Militares Essenciais",
    phrase: "PRO-PRO-DIS-HI-LE",
    meaning: `**PRO**bidade — agir com honestidade e retidão · **PRO**ntidão — estar pronto para o cumprimento da missão a qualquer momento · **DIS**ciplina — obediência às normas e regulamentos · **HI**erarquia — respeito aos graus de autoridade · **LE**aldade — fidelidade irrestrita à Constituição e à instituição

> 💡 *Como cai:* "Prontidão" é dever **exclusivo dos militares** — não existe no Estatuto dos Servidores Civis. Questões de concursos militares (ESA, BM, CFO PM) cobram essa distinção.`,
    category: "MILITAR",
    difficulty: "MEDIO",
    subjectSearch: "Legislação Institucional",
  },

  // ═══════════════════════════════════════════════════════════
  // ✍️  LÍNGUA PORTUGUESA
  // ═══════════════════════════════════════════════════════════
  {
    title: "Conjunções Concessivas — As que Mais Caem",
    phrase: "EM-CON-MAI-QUE-POR",
    meaning: `**EM**bora · **CON**quanto · **MAI**s que / Ainda que · **QUE** — Posto que / Bem que · **POR** mais que / Por muito que

> 💡 *Como cai:* A banca troca conjunção concessiva por causal ou adversativa. Concessiva admite uma **ressalva** que não impede o resultado ("*Embora* chovesse, saímos"). A adversativa simplesmente contrasta ("*Mas* choveu"). Cebraspe cobra essa distinção na análise de conectivos em textos.`,
    category: "GERAL",
    difficulty: "MEDIO",
    subjectSearch: "Portugues",
  },
  {
    title: "Orações Causais vs. Consecutivas",
    phrase: "Causa = ORIGEM / Consequência = CHICOTE",
    meaning: `**Causa** — o fato que originou o resultado; vem **antes** do fato principal na relação lógica:
*"Ficou em casa **porque** estava doente."* (doença → causa do ficar em casa)

**Consequência** — o resultado intensificado; introduzida por **"tão/tanto/tamanho… que"**:
*"Correu **tão** rápido **que** ninguém o alcançou."*

> 💡 *Como cai:* Cebraspe cobra reescrita substituindo um conectivo por outro de mesma relação. "Como" pode ser **causal** ("*Como* choveu, molhou") ou **conformativa** — o contexto decide.`,
    category: "GERAL",
    difficulty: "FACIL",
    subjectSearch: "Portugues",
  },
  {
    title: "Pronomes Relativos — Regência e Uso Correto",
    phrase: "QUEM preposiciona / ONDE fixa / CUJO possui",
    meaning: `**QUEM** — refere-se a **pessoa** e sempre exige **preposição** quando a regência do verbo a pedir: *"A pessoa **a quem** me referi."*

**ONDE** — refere-se apenas a **lugar físico** concreto: *"A cidade **onde** moro."* *(Errado: "O momento onde tudo mudou" — use "em que")*

**CUJO** — indica **posse/pertencimento**; **nunca** aceita artigo depois: *"O autor **cujo** livro li."* *(Errado: "cujo **o** livro")*

> 💡 *Como cai:* Substituição indevida de "onde" por "em que" ou "no qual" é armadilha frequente. "Cujo o" é sempre errado — banca marca como incorreto.`,
    category: "GERAL",
    difficulty: "MEDIO",
    subjectSearch: "Portugues",
  },
  {
    title: "Crase Proibida — Quando NUNCA usar o acento grave",
    phrase: "Masculina / Verbo / Pronome / Repetida",
    meaning: `Nunca há crase antes de:

**Palavras masculinas:** *A pé, a prazo, a crédito* · **Verbos:** *A partir de, a cantar, a correr* · **Pronomes pessoais e de tratamento:** *A ela, a você, a Vossa Excelência* · **Palavras repetidas (idênticas):** *Dia a dia, face a face, gota a gota*

> 💡 *Como cai:* "Às" (crase obrigatória) antes de horas femininas. "A" sem crase antes de pronomes possessivos depende de regência: *"Refiro-me **à** sua proposta"* (regência de "referir-se a" + artigo "a" feminino = crase). Cebraspe testa os casos limítrofes.`,
    category: "GERAL",
    difficulty: "MEDIO",
    subjectSearch: "Portugues",
  },
  {
    title: "Uso da Vírgula — Ordem Direta Não Admite Separação",
    phrase: "S.V.C.O.",
    meaning: `Na **ordem direta**, **não se usa vírgula** para separar:

**S**ujeito **→** **V**erbo **→** **C**omplemento **→** **O**bjunto adverbial

*Errado: "O aluno, estudou muito."* ✗ (vírgula entre S e V)
*Errado: "Ele entregou, o trabalho ontem."* ✗ (vírgula entre V e OD)

Vírgula é **obrigatória** quando há **inversão** (adjunto adverbial no início), **aposto**, **vocativo** ou **oração intercalada**.

> 💡 *Como cai:* Cebraspe apresenta reescritas e pede para identificar se a pontuação está correta. SVCO = ordem direta → sem vírgula entre os termos.`,
    category: "GERAL",
    difficulty: "MEDIO",
    subjectSearch: "Portugues",
  },
];

async function seedMnemonics() {
  console.log("🧠 Seedando Mnemônicos Estratégicos — Passarei Gold\n");
  console.log("=".repeat(60));

  let inserted = 0;
  let skipped = 0;
  let subjectMissing = 0;

  for (const m of MNEMONICS) {
    const subjectId = await findSubjectId(m.subjectSearch);

    if (!subjectId) {
      console.log(`  ⚠️  Subject não encontrado para "${m.subjectSearch}" — inserindo sem subject_id`);
      subjectMissing++;
    }

    try {
      const result = await sql`
        INSERT INTO mnemonics (subject_id, title, phrase, meaning, category, difficulty)
        VALUES (
          ${subjectId},
          ${m.title},
          ${m.phrase},
          ${m.meaning},
          ${m.category},
          ${m.difficulty}
        )
        ON CONFLICT (title) DO NOTHING
        RETURNING id
      `;

      if (result.length > 0) {
        console.log(`  ✅ "${m.phrase}" — ${m.title.substring(0, 50)}`);
        inserted++;
      } else {
        console.log(`  ⏭️  Já existe: "${m.title.substring(0, 50)}"`);
        skipped++;
      }
    } catch (err: any) {
      // Se não tiver constraint UNIQUE em title ainda, insere normalmente
      if (err.message?.includes("unique") || err.message?.includes("duplicate")) {
        console.log(`  ⏭️  Já existe: "${m.title.substring(0, 50)}"`);
        skipped++;
      } else {
        console.error(`  ❌ Erro em "${m.title}":`, err.message);
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`📊 RESULTADO:`);
  console.log(`   ✅ Inseridos:          ${inserted}`);
  console.log(`   ⏭️  Já existiam:        ${skipped}`);
  console.log(`   ⚠️  Sem subject_id:     ${subjectMissing}`);
  console.log(`   📝 Total processados:  ${MNEMONICS.length}`);
  console.log("=".repeat(60));

  await sql.end();
  process.exit(0);
}

seedMnemonics().catch(async (err) => {
  console.error("❌ Erro fatal:", err.message);
  await sql.end();
  process.exit(1);
});
