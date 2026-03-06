/**
 * Seed R31 — Direito Administrativo: Atos Administrativos
 * 6 átomos de conteúdo  (adm_aa_c01–c06)
 * 12 questões           (adm_aa_q01–q12)
 *
 * Execução (Replit): npx tsx db/seed-direito-adm-atos-r31.ts
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

// ─── CONTEÚDOS ───────────────────────────────────────────────────────────────

const contents = [
  {
    id: "adm_aa_c01",
    title: "Elementos (Requisitos) do Ato Administrativo — COMFIM",
    difficulty: "MEDIO",
    mnemonic:
      "COMFIM: Competência · Objeto · Motivo · Forma · fInalidade. " +
      "Dica extra: 'CO-MO-FI' — COmpetência, MOtivo, FInalidade (os 3 vinculam SEMPRE nos atos vinculados). " +
      "Objeto e Forma: vinculados nos atos vinculados; com margem nos discricionários.",
    keyPoint:
      "Os 5 elementos (requisitos) do ato administrativo são:\n" +
      "• Competência: quem pratica o ato (elemento sempre vinculado)\n" +
      "• Objeto: conteúdo imediato — o que o ato dispõe (lícito, possível, determinado)\n" +
      "• Motivo: causa de fato e de direito que autoriza o ato\n" +
      "• Finalidade: resultado mediato — interesse público (sempre vinculado)\n" +
      "• Forma: modo de exteriorização (escrita como regra, salvo urgência/costume)\n" +
      "Vício em qualquer elemento = ato inválido (nulo ou anulável)",
    practicalExample:
      "CESPE: 'A teoria dos motivos determinantes vincula a Administração ao motivo declarado.' " +
      "Se o motivo for falso ou inexistente, o ato é nulo — mesmo que fosse discricionário. " +
      "FGV: Desvio de finalidade ocorre quando o agente usa o ato para fim diverso do previsto em lei (vício de finalidade).",
    textContent:
      "Os elementos do ato administrativo são os requisitos de validade sem os quais o ato é inválido. " +
      "A doutrina clássica (Hely Lopes Meirelles) e a jurisprudência do STJ consolidaram cinco elementos essenciais.\n\n" +
      "1. COMPETÊNCIA:\n" +
      "É o poder legal atribuído ao agente para praticar o ato. Decorre sempre de lei — não pode ser presumida " +
      "nem ampliada por vontade do agente. É elemento sempre VINCULADO: o agente só faz o que a lei autoriza.\n" +
      "Vício de competência: ato praticado por agente sem atribuição legal — ato anulável (em regra) ou nulo " +
      "(competência exclusiva ou em razão da matéria).\n" +
      "Competência pode ser DELEGADA ou AVOCADA, salvo quando a lei proibir ou tratar-se de competência exclusiva.\n\n" +
      "2. OBJETO:\n" +
      "É o conteúdo imediato do ato — aquilo que o ato dispõe, altera ou extingue. " +
      "Deve ser lícito (conforme a lei), possível (materialmente exequível) e determinado ou determinável.\n" +
      "Nos atos vinculados: o objeto está predeterminado em lei. " +
      "Nos atos discricionários: a Administração tem margem de escolha dentro dos limites legais (mérito).\n\n" +
      "3. MOTIVO:\n" +
      "É a situação de fato e o fundamento jurídico que autorizam ou exigem a prática do ato. " +
      "Motivo de fato: ocorrência concreta que enseja o ato (ex.: infração cometida). " +
      "Motivo de direito: norma legal que prevê a situação.\n" +
      "TEORIA DOS MOTIVOS DETERMINANTES: uma vez declarado o motivo, a Administração fica a ele vinculada. " +
      "Se o motivo declarado for falso, inexistente ou juridicamente inadequado, o ato é inválido — " +
      "mesmo que fosse discricionário.\n\n" +
      "4. FINALIDADE:\n" +
      "É o resultado mediato do ato — o fim de interesse público que a lei visa proteger. " +
      "Elemento sempre VINCULADO: todo ato administrativo deve buscar o interesse público. " +
      "Desvio de finalidade (desvio de poder): o agente pratica o ato com fim diverso do previsto em lei " +
      "(ex.: remoção de servidor por perseguição, não por necessidade do serviço). " +
      "Vício insanável — ato nulo.\n\n" +
      "5. FORMA:\n" +
      "É o modo pelo qual o ato se exterioriza. Como regra, os atos administrativos devem ser escritos " +
      "para garantir publicidade e controle. Excepcionalmente admite-se forma oral (ordem verbal) ou " +
      "simbólica (sinalização de trânsito).\n" +
      "Forma essencial: a lei exige determinada forma — sua inobservância gera nulidade.\n" +
      "Forma não essencial (requisito de publicidade): vício sanável por convalidação.\n\n" +
      "RESUMO PARA PROVA:\n" +
      "Competência e Finalidade: SEMPRE vinculados — a lei não dá margem.\n" +
      "Motivo e Objeto: vinculados nos atos vinculados; discricionários nos discricionários.\n" +
      "Forma: em regra vinculada (escrita); excepcionalmente admite outras formas.",
  },
  {
    id: "adm_aa_c02",
    title: "Atributos do Ato Administrativo — PATI",
    difficulty: "MEDIO",
    mnemonic:
      "PATI: Presunção de legitimidade · Autoexecutoriedade · Tipicidade · Imperatividade. " +
      "'PA-TI' — a Administração age por conta própria (PA = Presunção + Autoexecutoriedade) " +
      "e impõe obrigações (TI = Tipicidade + Imperatividade).",
    keyPoint:
      "Os 4 atributos (características) do ato administrativo:\n" +
      "• Presunção de legitimidade/veracidade: ato presume-se legal e verdadeiro (juris tantum — admite prova em contrário)\n" +
      "• Autoexecutoriedade: Adm. executa o ato sem autorização judicial prévia (apenas para atos urgentes ou previstos em lei)\n" +
      "• Tipicidade: ato deve corresponder a uma figura legal prévia (afasta atos inominados)\n" +
      "• Imperatividade: ato impõe obrigações unilateralmente, independentemente da concordância do particular\n" +
      "Atenção: nem todos os atos têm todos os atributos (ex.: certidão não tem imperatividade)",
    practicalExample:
      "CESPE: 'A presunção de legitimidade é absoluta.' — ERRADO: é relativa (juris tantum). " +
      "CESPE: 'A autoexecutoriedade autoriza a Administração a executar coercitivamente suas decisões independentemente de autorização judicial.' " +
      "— CERTO, mas apenas quando a lei previr ou houver urgência. " +
      "FGV: Autorização e certidão não possuem imperatividade — são exemplos de atos sem esse atributo.",
    textContent:
      "Os atributos do ato administrativo são as características que o diferenciam dos atos jurídicos privados " +
      "e que decorrem do regime jurídico de direito público.\n\n" +
      "1. PRESUNÇÃO DE LEGITIMIDADE E VERACIDADE:\n" +
      "Os atos administrativos presumem-se válidos, legítimos e verdadeiros até prova em contrário.\n" +
      "Presunção de legitimidade: o ato está em conformidade com o ordenamento jurídico.\n" +
      "Presunção de veracidade: os fatos declarados pela Administração são presumivelmente verdadeiros.\n" +
      "IMPORTANTE: trata-se de presunção RELATIVA (juris tantum) — pode ser afastada por prova do particular.\n" +
      "Consequência prática: o ônus da prova de invalidade recai sobre o administrado, não sobre a Administração.\n\n" +
      "2. IMPERATIVIDADE (COERCIBILIDADE):\n" +
      "O ato impõe obrigações e restrições unilateralmente ao particular, " +
      "independentemente de sua concordância ou vontade.\n" +
      "O particular é compelido a cumprir o ato mesmo sem concordar.\n" +
      "Exceção: atos ampliativos de direito (autorização, licença, certidão) não apresentam imperatividade, " +
      "pois são favoráveis ao administrado.\n\n" +
      "3. AUTOEXECUTORIEDADE (EXECUTORIEDADE):\n" +
      "A Administração pode executar os atos diretamente, com seus próprios meios, " +
      "sem necessidade de autorização prévia do Poder Judiciário.\n" +
      "Hipóteses em que a autoexecutoriedade é admitida:\n" +
      "  (a) quando a lei expressamente autorizar;\n" +
      "  (b) quando houver urgência ou situação de emergência.\n" +
      "Atenção: a autoexecutoriedade não afasta o controle judicial POSTERIOR.\n\n" +
      "4. TIPICIDADE:\n" +
      "O ato administrativo deve corresponder a uma figura definida e autorizada em lei — " +
      "não há atos administrativos inominados (sem previsão legal).\n" +
      "Garante segurança jurídica ao administrado: sabe quais atos podem ser praticados.\n" +
      "Decorrência do princípio da legalidade estrita que rege o Direito Administrativo.\n\n" +
      "ATENÇÃO — NEM TODOS OS ATOS TÊM TODOS OS ATRIBUTOS:\n" +
      "Certidão, atestado, parecer: não têm imperatividade nem autoexecutoriedade.\n" +
      "Atos negociais (licença, autorização): não têm imperatividade sobre o beneficiário.\n" +
      "A presunção de legitimidade é o único atributo presente em TODOS os atos.",
  },
  {
    id: "adm_aa_c03",
    title: "Vinculação vs. Discricionariedade",
    difficulty: "MEDIO",
    mnemonic:
      "VINDI vs DISC: VINculado = DIreito do particular se preencher os requisitos. " +
      "DISCricionário = mérito = oportunidade + conveniência = ZONA DE LIBERDADE da Administração. " +
      "Judiciário controla LEGALIDADE — nunca substitui o mérito.",
    keyPoint:
      "• Ato vinculado: todos os elementos fixados em lei — sem margem de escolha\n" +
      "• Ato discricionário: motivo e objeto com espaço de escolha (mérito administrativo)\n" +
      "• Mérito = oportunidade (momento) + conveniência (modo/conteúdo)\n" +
      "• Controle judicial: abrange LEGALIDADE de qualquer ato (vinculado ou discricionário)\n" +
      "• Judiciário NÃO substitui o mérito — apenas anula o ato ilegal\n" +
      "• Excesso de poder (uso além da competência) e desvio de poder (fim ilegal) são controláveis\n" +
      "• Discricionariedade é diferente de arbitrariedade: escolha deve ser proporcional e razoável",
    practicalExample:
      "STJ: 'O controle jurisdicional dos atos discricionários não implica invasão do mérito administrativo, " +
      "limitando-se à verificação de legalidade.' " +
      "CESPE: Licença para construir (ato vinculado) — Adm. NÃO pode negar se preenchidos os requisitos. " +
      "Autorização de porte de arma (ato discricionário) — Adm. pode negar mesmo preenchidos os requisitos.",
    textContent:
      "A distinção entre atos vinculados e discricionários é uma das mais importantes do Direito Administrativo, " +
      "com reflexos diretos no controle judicial e na atuação da Administração Pública.\n\n" +
      "ATO VINCULADO:\n" +
      "É aquele em que a lei estabelece com absoluta precisão todos os elementos do ato. " +
      "A Administração não tem margem de escolha: se presentes os requisitos legais, o ato DEVE ser praticado.\n" +
      "Exemplos: aposentadoria compulsória por idade, licença para construir (preenchidos os requisitos), " +
      "progressão funcional por mérito com avaliação positiva.\n" +
      "O particular tem DIREITO SUBJETIVO à prática do ato quando preenchidos os requisitos.\n\n" +
      "ATO DISCRICIONÁRIO:\n" +
      "É aquele em que a lei confere à Administração margem de escolha quanto ao motivo e/ou ao objeto do ato. " +
      "Essa margem chama-se MÉRITO ADMINISTRATIVO, composto por:\n" +
      "  Oportunidade: o momento mais adequado para praticar o ato.\n" +
      "  Conveniência: o conteúdo ou o modo mais apropriado para o ato.\n" +
      "Exemplos: autorização de porte de arma, nomeação para cargo em comissão, " +
      "exoneração de cargo em comissão, autorização para uso de bem público.\n\n" +
      "CONTROLE JUDICIAL DOS ATOS DISCRICIONÁRIOS:\n" +
      "O Judiciário pode (e deve) controlar a LEGALIDADE de qualquer ato administrativo, " +
      "inclusive os discricionários. Entretanto, não pode SUBSTITUIR a escolha administrativa dentro " +
      "da zona de discricionariedade — isso violaria a separação de poderes.\n" +
      "O Judiciário PODE anular ato discricionário quando:\n" +
      "  Houver desvio de finalidade (vício de finalidade).\n" +
      "  Houver excesso de poder (extrapolação da competência).\n" +
      "  A escolha violar o princípio da proporcionalidade ou razoabilidade.\n" +
      "  O motivo declarado for falso (teoria dos motivos determinantes).\n\n" +
      "DISCRICIONARIEDADE DIFERE DE ARBITRARIEDADE:\n" +
      "A discricionariedade é a liberdade dentro dos limites da lei. " +
      "A arbitrariedade é o ato praticado fora ou contra a lei — sempre inválida e controlável judicialmente.\n\n" +
      "PRINCÍPIOS LIMITADORES DA DISCRICIONARIEDADE:\n" +
      "Proporcionalidade, razoabilidade, motivação, moralidade e eficiência são princípios que " +
      "restringem a margem discricionária e permitem controle judicial mesmo no mérito administrativo " +
      "quando claramente violados.",
  },
  {
    id: "adm_aa_c04",
    title: "Espécies de Atos Administrativos — NONEP",
    difficulty: "MEDIO",
    mnemonic:
      "NONEP: Normativos · Ordinatórios · Negociais · Enunciativos · Punitivos. " +
      "'NO-NE-P' — Normativos criam regras gerais; Negociais ampliam direitos; " +
      "Punitivos restringem direitos; Enunciativos atestam; Ordinatórios disciplinam internamente.",
    keyPoint:
      "5 espécies de atos administrativos:\n" +
      "• Normativos: criam normas gerais e abstratas (decreto, regulamento, instrução normativa)\n" +
      "• Ordinatórios: disciplinam o funcionamento interno da Adm. (portaria, circular, memorando)\n" +
      "• Negociais: ampliam direitos do particular mediante concordância (licença, autorização, permissão, concessão)\n" +
      "• Enunciativos: certificam, atestam ou opinam (certidão, atestado, parecer, apostila)\n" +
      "• Punitivos: sancionam infrações (multa, interdição, cassação, suspensão)\n" +
      "Licença = vinculada; Autorização = discricionária — diferença clássica de prova!",
    practicalExample:
      "CESPE: 'A licença é ato vinculado e definitivo; a autorização é discricionária e precária.' — CERTO. " +
      "FGV: Decreto regulamentar = ato normativo. Portaria disciplinando horário de trabalho = ato ordinatório. " +
      "Multa por infração de trânsito = ato punitivo. Certidão de antecedentes = ato enunciativo.",
    textContent:
      "Os atos administrativos são classificados em espécies conforme seu conteúdo e efeitos. " +
      "O sistema NONEP é o mais cobrado em concursos de nível médio e superior.\n\n" +
      "1. ATOS NORMATIVOS:\n" +
      "Contêm comandos gerais e abstratos, com a finalidade de complementar a lei e orientar sua execução.\n" +
      "Exemplos: Decreto regulamentar (expedido pelo Chefe do Executivo), Regulamento, " +
      "Instrução Normativa (ministérios, autarquias reguladoras), Resolução, Deliberação.\n" +
      "Atenção: decreto regulamentar não pode inovar na ordem jurídica — apenas regulamenta a lei.\n\n" +
      "2. ATOS ORDINATÓRIOS:\n" +
      "Disciplinam o funcionamento interno da Administração, dirigindo-se aos próprios agentes públicos.\n" +
      "Exemplos: Portaria (ampla — pode disciplinar servidores e terceiros), Circular (orienta servidores), " +
      "Memorando (comunicação interna), Ordem de Serviço, Aviso.\n" +
      "Efeitos: em regra internos; não criam direitos para particulares.\n\n" +
      "3. ATOS NEGOCIAIS:\n" +
      "Envolvem concordância de vontades entre Administração e particular. Ampliam ou confirmam direitos.\n" +
      "Licença: ato vinculado, definitivo — obrigatório quando preenchidos os requisitos legais.\n" +
      "  (Licença para construir, licença para dirigir, licença sanitária)\n" +
      "Autorização: ato discricionário, precário — Adm. pode revogar a qualquer tempo sem indenização.\n" +
      "  (Autorização para porte de arma, uso de bem público, funcionamento de estabelecimento)\n" +
      "Permissão: ato discricionário e precário para uso de bem público ou serviço público.\n" +
      "Aprovação: ato de controle que valida ato de outro órgão.\n\n" +
      "4. ATOS ENUNCIATIVOS:\n" +
      "Certificam, atestam ou opinam sobre fatos ou direitos. Não criam nem extinguem relações jurídicas.\n" +
      "Exemplos: Certidão (reproduz registro existente — fé pública), Atestado (afirma fato presente), " +
      "Parecer (opinião técnica ou jurídica — pode ser facultativo, obrigatório ou vinculante), " +
      "Apostila (anotação em documento para complementar ou retificar).\n\n" +
      "5. ATOS PUNITIVOS:\n" +
      "Aplicam sanções por infrações administrativas, penais ou disciplinares.\n" +
      "Exemplos: Multa administrativa, Embargo de obra, Interdição de estabelecimento, " +
      "Cassação de alvará ou licença, Suspensão e demissão de servidor.\n" +
      "Exigem contraditório e ampla defesa (art. 5º, LV, CF/88) — exceto medidas cautelares urgentes.\n\n" +
      "DIFERENÇA CLÁSSICA — LICENÇA vs. AUTORIZAÇÃO:\n" +
      "Licença: direito subjetivo, ato vinculado, Adm. não pode negar se preenchidos os requisitos, " +
      "e não pode revogar sem indenização (salvo hipótese legal).\n" +
      "Autorização: ato discricionário, precário, revogável a qualquer tempo sem indenização ao particular.",
  },
  {
    id: "adm_aa_c05",
    title: "Extinção: Anulação vs. Revogação",
    difficulty: "MEDIO",
    mnemonic:
      "ANulação = ANormalidade (vício de legalidade) — efeito ex TUnc (TUdo retroage). " +
      "REvogação = REtirada por mérito — efeito ex NUnc (NUlo do futuro em diante). " +
      "Mnemônico: 'A-NUL + TU / RE-VOG + NU': ANULACAO-TUnc / REVOGacao-NUnc.",
    keyPoint:
      "• Anulação: vício de LEGALIDADE — efeitos ex tunc (retroativos) — pode ser feita pela Adm. ou Judiciário\n" +
      "• Revogação: razão de MÉRITO (oportunidade/conveniência) — efeitos ex nunc (prospectivos) — APENAS pela Administração\n" +
      "• Súmula 473 STF: 'A Administração pode anular seus próprios atos quando eivados de vícios... ou revogá-los por motivo de conveniência ou oportunidade.'\n" +
      "• Prazo para anulação de atos com efeitos favoráveis ao particular: 5 anos (Lei 9.784/99, art. 54) — boa-fé\n" +
      "• Atos que não podem ser revogados: atos vinculados, atos que geraram direito adquirido, atos processuais, atos já exauridos",
    practicalExample:
      "STF Súmula 473 e Lei 9.784/99, art. 54: decadência da anulação em 5 anos. " +
      "CESPE clássico: 'O Judiciário pode revogar atos administrativos ilegais.' — ERRADO: " +
      "Judiciário ANULA (controle de legalidade), não revoga. Revogação é exclusiva da Administração. " +
      "FGV: Ato que gerou direito adquirido NÃO pode ser revogado (mas pode ser anulado se ilegal).",
    textContent:
      "A extinção dos efeitos do ato administrativo pode ocorrer por diversas causas. " +
      "As mais cobradas em concursos são a anulação e a revogação — institutos com regimes jurídicos completamente distintos.\n\n" +
      "ANULAÇÃO (INVALIDAÇÃO):\n" +
      "Fundamento: vício de LEGALIDADE — o ato nasceu com defeito (incompetência, vício de forma, desvio de finalidade, etc.).\n" +
      "Efeitos: EX TUNC — retroage à data da prática do ato, desfazendo todos os efeitos já produzidos " +
      "(como se o ato nunca tivesse existido).\n" +
      "Quem pode anular: A própria Administração (autotutela — Súmula 473 STF) e o Poder Judiciário.\n" +
      "Prazo: Para atos que geraram efeitos favoráveis ao particular de boa-fé, a Administração tem " +
      "5 anos para anular, contados da data em que foram praticados (art. 54, Lei 9.784/99). " +
      "Após esse prazo, o ato se convalida pela decadência.\n\n" +
      "REVOGAÇÃO:\n" +
      "Fundamento: razão de MÉRITO — o ato é legal, mas a Administração decide retirá-lo por razões de " +
      "oportunidade e/ou conveniência (conveniência e oportunidade = mérito administrativo).\n" +
      "Efeitos: EX NUNC — não retroage; os efeitos já produzidos são mantidos. " +
      "A revogação opera para o futuro.\n" +
      "Quem pode revogar: APENAS a Administração. O Judiciário NÃO revoga atos administrativos " +
      "(isso violaria a separação de poderes e a discricionariedade administrativa).\n\n" +
      "ATOS IRREVOGÁVEIS:\n" +
      "Alguns atos não podem ser revogados mesmo por razões de mérito:\n" +
      "  Atos vinculados (a lei não deixa margem de mérito para revogar).\n" +
      "  Atos que geraram direito adquirido.\n" +
      "  Atos que já exauriram seus efeitos (ex.: licença já usufruída).\n" +
      "  Meros atos administrativos (certidão, atestado — não têm conteúdo volitivo).\n" +
      "  Atos que integram procedimento (cada etapa é condição da seguinte).\n\n" +
      "SUMULA 473 DO STF:\n" +
      "'A Administração pode anular seus próprios atos, quando eivados de vícios que os tornem ilegais, " +
      "porque deles não se originam direitos; ou revogá-los, por motivo de conveniência ou oportunidade, " +
      "respeitados os direitos adquiridos, e ressalvada, em todos os casos, a apreciação judicial.'\n\n" +
      "TABELA COMPARATIVA:\n" +
      "Anulação: fundamento = ilegalidade | efeito = ex tunc | quem faz = Adm. + Judiciário.\n" +
      "Revogação: fundamento = mérito | efeito = ex nunc | quem faz = somente Administração.",
  },
  {
    id: "adm_aa_c06",
    title: "Convalidação e Vícios do Ato Administrativo",
    difficulty: "DIFICIL",
    mnemonic:
      "CONVALIDA = sanar vício SANAVEL. Vícios sanáveis: Competência (salvo exclusiva e matéria) + Forma (salvo essencial). " +
      "Vícios INSANAVEIS — NULIDADE: Objeto ilícito, Finalidade desviada, Motivo inexistente ou falso. " +
      "Mnemônico: 'CO-FO podem SALVAR' (COmpetência + FOrma). 'OFiMo MATA' (Objeto+Finalidade+Motivo = insanáveis).",
    keyPoint:
      "• Convalidação (sanatória): ato supre retroativamente o vício, com efeitos ex tunc\n" +
      "• Vícios SANÁVEIS (convalidáveis): vício de competência (exceto exclusiva e em razão da matéria) e vício de forma (exceto forma essencial)\n" +
      "• Vícios INSANÁVEIS (nulidade): vício de objeto (ilícito/impossível), finalidade (desvio de poder), motivo inexistente/falso\n" +
      "• A convalidação é uma FACULDADE da Administração (não obrigatória) — pode anular em vez de convalidar\n" +
      "• Se o vício causar prejuízo ao particular, é mais indicada a anulação do que a convalidação\n" +
      "• Ratificação: convalidação do vício de competência; Reforma: supressão parcial com ato novo",
    practicalExample:
      "CESPE: 'Ato praticado por agente incompetente pode ser convalidado.' — CERTO: " +
      "vício de competência é sanável, salvo competência exclusiva. " +
      "FGV: 'Ato com objeto ilícito pode ser convalidado.' — ERRADO: vício de objeto é insanável — nulidade absoluta. " +
      "STJ: A convalidação retroage (ex tunc) ao momento da prática do ato original.",
    textContent:
      "A convalidação é o instituto pelo qual a Administração sana retroativamente o vício de um ato " +
      "administrativo, preservando seus efeitos. Representa uma alternativa à anulação quando o vício é sanável.\n\n" +
      "CONCEITO DE CONVALIDAÇÃO:\n" +
      "Convalidar é tornar válido um ato que nasceu com defeito, pela prática de ato posterior que supre o vício. " +
      "Os efeitos da convalidação retroagem à data do ato original (ex tunc), diferentemente da anulação.\n" +
      "A convalidação é uma FACULDADE da Administração — ela pode optar por anular ou convalidar o ato, " +
      "conforme o interesse público e os direitos dos administrados.\n\n" +
      "VÍCIOS SANÁVEIS — ADMITEM CONVALIDAÇÃO:\n\n" +
      "1. Vício de COMPETÊNCIA:\n" +
      "Quando o ato é praticado por agente sem atribuição legal, mas essa competência poderia ter sido delegada " +
      "ou não é exclusiva. A autoridade competente ratifica o ato, suprindo o vício.\n" +
      "Exceções (insanável): competência exclusiva (ex.: competência privativa do Presidente da República) " +
      "e competência em razão da matéria.\n" +
      "Instituto: RATIFICAÇÃO — o competente manifesta sua concordância com o ato.\n\n" +
      "2. Vício de FORMA:\n" +
      "Quando o ato não observou a forma legal, mas essa forma não era essencial para garantir direitos " +
      "ou finalidade do ato. A Administração repratica o ato na forma correta.\n" +
      "Exceção (insanável): forma essencial — quando a lei exige determinada forma sob pena de nulidade.\n\n" +
      "VÍCIOS INSANÁVEIS — GERAM NULIDADE ABSOLUTA:\n\n" +
      "3. Vício de OBJETO:\n" +
      "Quando o conteúdo do ato é ilícito, impossível ou indeterminável. Não há como sanear " +
      "um objeto ilícito — o ato deve ser anulado.\n\n" +
      "4. Vício de FINALIDADE (Desvio de Poder/Finalidade):\n" +
      "Quando o agente pratica o ato com fim diverso do previsto em lei ou do interesse público. " +
      "Vício moral gravíssimo — insanável.\n\n" +
      "5. Vício de MOTIVO:\n" +
      "Quando o motivo declarado é falso, inexistente ou juridicamente inadequado " +
      "(teoria dos motivos determinantes). O ato perde sua base fática/jurídica — insanável.\n\n" +
      "MODALIDADES DE CONVALIDAÇÃO:\n" +
      "Ratificação: convalida vício de competência (autoridade competente ratifica).\n" +
      "Confirmação: reafirma o ato com a forma correta (convalida vício de forma).\n" +
      "Reforma: suprime a parte viciada e mantém a parte válida (vício parcial).\n\n" +
      "CONVALIDAÇÃO vs. CONVERSÃO:\n" +
      "Convalidação: sana o vício, mantendo o mesmo tipo de ato.\n" +
      "Conversão: transforma o ato inválido em outro tipo de ato para o qual preenche os requisitos.",
  },
];

// ─── QUESTÕES ─────────────────────────────────────────────────────────────────

const questions = [
  // ── Q01 — adm_aa_c01 — Múltipla Escolha ──
  {
    id: "adm_aa_q01",
    contentId: "adm_aa_c01",
    statement:
      "(CESPE/CEBRASPE — Adaptada) Em relação aos elementos (requisitos) do ato administrativo, " +
      "assinale a alternativa CORRETA.",
    alternatives: [
      {
        letter: "A",
        text: "A presunção de legitimidade e a autoexecutoriedade são elementos essenciais do ato administrativo.",
      },
      {
        letter: "B",
        text: "O motivo é o resultado mediato do ato, consistindo no interesse público que a norma visa a proteger.",
      },
      {
        letter: "C",
        text: "A competência e a finalidade são elementos sempre vinculados, independentemente de o ato ser discricionário ou vinculado.",
      },
      {
        letter: "D",
        text: "O objeto do ato administrativo corresponde ao modo de exteriorização da vontade administrativa.",
      },
      {
        letter: "E",
        text: "Nos atos discricionários, a Administração tem liberdade para escolher a finalidade do ato conforme sua conveniência.",
      },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Competência e finalidade são SEMPRE vinculados: a lei determina quem pratica o ato (competência) " +
      "e qual fim deve ser atingido (finalidade = interesse público). " +
      "A = PATI são atributos, não elementos. B = confunde motivo com finalidade. " +
      "D = confunde objeto com forma. E = finalidade é sempre vinculada ao interesse público — " +
      "praticar ato para fim diverso é desvio de finalidade, vício insanável.",
    explanationCorrect:
      "Correto! Competência (quem pratica) e Finalidade (interesse público a atingir) são sempre vinculados — " +
      "a lei não dá margem de escolha nesses dois elementos, mesmo nos atos discricionários. " +
      "Motivo e Objeto podem ser discricionários; Forma em regra é vinculada.",
    explanationWrong:
      "Relembre os 5 elementos: Competência, Objeto, Motivo, Forma, Finalidade (COMFIM). " +
      "PATI são ATRIBUTOS — não se confunda. Finalidade = resultado mediato (interesse público), " +
      "sempre vinculada. Motivo = causa fática + jurídica. Objeto = conteúdo imediato. Forma = modo de exteriorização.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q02 — adm_aa_c01 — CERTO/ERRADO ──
  {
    id: "adm_aa_q02",
    contentId: "adm_aa_c01",
    statement:
      "(CESPE/CEBRASPE — Adaptada) De acordo com a teoria dos motivos determinantes, " +
      "a Administração Pública fica vinculada aos motivos declarados no ato administrativo, " +
      "de modo que, se o motivo declarado for falso ou inexistente, o ato será inválido, " +
      "ainda que se trate de ato discricionário.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. A teoria dos motivos determinantes vincula a Administração ao motivo declarado. " +
      "Mesmo nos atos discricionários, uma vez declarado o motivo, ele integra a validade do ato. " +
      "Se o motivo for falso, inexistente ou juridicamente inadequado, o ato é inválido — " +
      "independentemente do grau de discricionariedade. Exemplo clássico: exoneração de cargo em comissão " +
      "declarando motivo de 'reestruturação' que não ocorreu — ato nulo pela teoria dos motivos.",
    explanationCorrect:
      "Correto! A teoria dos motivos determinantes é posição consolidada no STJ e STF. " +
      "A Administração que declara um motivo fica a ele vinculada: se o motivo for falso ou inexistente, " +
      "o ato cai, mesmo sendo discricionário. Motivo falso = vício insanável = nulidade.",
    explanationWrong:
      "O item está CERTO. A teoria dos motivos determinantes aplica-se também a atos discricionários. " +
      "Uma vez declarado o motivo, ele passa a integrar a validade do ato. " +
      "Motivo falso = vício de motivo = ato nulo. O STJ aplica esse entendimento especialmente em " +
      "exonerações e revogações de atos com motivo declarado.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  // ── Q03 — adm_aa_c02 — Múltipla Escolha ──
  {
    id: "adm_aa_q03",
    contentId: "adm_aa_c02",
    statement:
      "(FGV — Adaptada) Sobre os atributos dos atos administrativos (PATI), " +
      "assinale a alternativa que indica o atributo que permite à Administração executar " +
      "coercitivamente suas decisões SEM necessidade de prévia autorização judicial.",
    alternatives: [
      { letter: "A", text: "Presunção de legitimidade" },
      { letter: "B", text: "Imperatividade" },
      { letter: "C", text: "Autoexecutoriedade" },
      { letter: "D", text: "Tipicidade" },
      { letter: "E", text: "Legalidade" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Autoexecutoriedade: permite à Administração executar seus atos com seus próprios meios, " +
      "sem autorização judicial prévia — quando a lei autorizar ou houver urgência. " +
      "Imperatividade (B) impõe obrigações, mas não autoriza execução direta sem decisão judicial. " +
      "Presunção (A) torna o ato válido até prova em contrário. " +
      "Tipicidade (D) exige correspondência a figura legal. " +
      "Legalidade (E) é princípio, não atributo do ato.",
    explanationCorrect:
      "Correto! Autoexecutoriedade = execução direta pela Administração sem autorização judicial. " +
      "Exemplo: demolição de obra clandestina em área de risco (urgência). " +
      "Compare: imperatividade impõe obrigação, mas a execução coercitiva (uso da força) exige lei ou urgência.",
    explanationWrong:
      "Relembre o PATI: Presunção (legitimidade/veracidade), Autoexecutoriedade (execução direta), " +
      "Tipicidade (previsão legal), Imperatividade (obrigação unilateral). " +
      "Execução coercitiva sem ir ao Judiciário = AUTOEXECUTORIEDADE. " +
      "Imperatividade é impor a obrigação; autoexecutoriedade é executá-la pela própria Administração.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q04 — adm_aa_c02 — CERTO/ERRADO ──
  {
    id: "adm_aa_q04",
    contentId: "adm_aa_c02",
    statement:
      "(CESPE/CEBRASPE — Adaptada) A presunção de legitimidade dos atos administrativos " +
      "é absoluta, de modo que o particular não pode produzir prova em contrário para " +
      "afastar a validade do ato praticado pela Administração Pública.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. A presunção de legitimidade dos atos administrativos é RELATIVA (juris tantum) — " +
      "admite prova em contrário. O particular pode produzir prova para afastar a presunção de validade. " +
      "Apenas inverte-se o ônus da prova: cabe ao particular demonstrar a invalidade do ato, " +
      "não à Administração demonstrar sua validade.",
    explanationCorrect:
      "Correto! A presunção de legitimidade é juris tantum (relativa), não juris et de jure (absoluta). " +
      "O particular pode contestá-la em juízo ou via recurso administrativo. " +
      "O efeito prático é a inversão do ônus da prova — quem alega a invalidade deve prová-la.",
    explanationWrong:
      "O item está ERRADO. Presunção de legitimidade = RELATIVA (juris tantum) — admite prova em contrário. " +
      "Se fosse absoluta (juris et de jure), o particular nunca poderia questionar nenhum ato. " +
      "Isso violaria o princípio do acesso à justiça (art. 5º, XXXV, CF). " +
      "O efeito da presunção é apenas inverter o ônus da prova: o particular prova a invalidade.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  // ── Q05 — adm_aa_c03 — Múltipla Escolha ──
  {
    id: "adm_aa_q05",
    contentId: "adm_aa_c03",
    statement:
      "(CESPE/CEBRASPE — Adaptada) Com base na distinção entre atos vinculados e discricionários, " +
      "assinale a alternativa CORRETA sobre o controle judicial dos atos administrativos.",
    alternatives: [
      {
        letter: "A",
        text: "O Judiciário pode substituir a escolha administrativa nos atos discricionários, desde que a decisão administrativa seja inconveniente.",
      },
      {
        letter: "B",
        text: "O controle judicial dos atos administrativos abrange exclusivamente os atos vinculados, pois nos discricionários vigora a separação de poderes.",
      },
      {
        letter: "C",
        text: "O Judiciário pode anular ato discricionário quando a escolha administrativa violar princípios como proporcionalidade e razoabilidade.",
      },
      {
        letter: "D",
        text: "Nos atos discricionários, a Administração tem liberdade ilimitada, podendo agir de qualquer forma que julgue conveniente.",
      },
      {
        letter: "E",
        text: "A licença para construir, por ser ato discricionário, pode ser negada pela Administração mesmo quando preenchidos todos os requisitos legais.",
      },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "O Judiciário controla a LEGALIDADE de todos os atos — inclusive discricionários. " +
      "Quando o ato viola proporcionalidade/razoabilidade, o Judiciário pode anulá-lo sem invadir o mérito. " +
      "A = errado: Judiciário não substitui o mérito por 'inconveniência'. " +
      "B = errado: controle alcança todos os atos. " +
      "D = errado: discricionariedade é diferente de arbitrariedade. " +
      "E = errado: licença é ato VINCULADO — obrigação de conceder quando preenchidos os requisitos.",
    explanationCorrect:
      "Correto! O Judiciário controla a legalidade de qualquer ato, incluindo discricionários. " +
      "A proporcionalidade e a razoabilidade são princípios de legalidade em sentido amplo — " +
      "sua violação justifica anulação judicial. O que o Judiciário NÃO pode é substituir a escolha legítima da Administração.",
    explanationWrong:
      "Regra: Judiciário controla LEGALIDADE (qualquer ato), mas não substitui MÉRITO (discricionário). " +
      "Exceção: pode anular discricionário por violação de proporcionalidade/razoabilidade. " +
      "Licença = ato vinculado = direito subjetivo do particular. " +
      "Arbitrariedade (fora da lei) é diferente de discricionariedade (dentro da lei).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q06 — adm_aa_c03 — CERTO/ERRADO ──
  {
    id: "adm_aa_q06",
    contentId: "adm_aa_c03",
    statement:
      "(FGV — Adaptada) O Poder Judiciário, ao apreciar ato administrativo discricionário " +
      "que considera inconveniente para o interesse público, pode revogá-lo e substituí-lo " +
      "por decisão que repute mais adequada, no exercício do controle da Administração Pública.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. O Judiciário controla a LEGALIDADE dos atos, não o MÉRITO (oportunidade/conveniência). " +
      "Revogar ato por 'inconveniência' é controle de mérito — exclusivo da Administração. " +
      "Além disso, o Judiciário não revoga atos administrativos: ANULA (vício de legalidade). " +
      "A revogação é competência exclusiva da Administração, por razão de mérito.",
    explanationCorrect:
      "Correto! O Judiciário não pode revogar nem substituir ato discricionário por razão de mérito. " +
      "Só pode ANULAR ato ilegal. Revogação = exclusividade da Administração. " +
      "O item está ERRADO por atribuir ao Judiciário poder de revogação e substituição por mérito.",
    explanationWrong:
      "O item está ERRADO — dois erros graves: (1) O Judiciário não REVOGA, apenas ANULA; " +
      "(2) O Judiciário não controla mérito (conveniência/oportunidade) — só legalidade. " +
      "Revogar por 'inconveniência' é função exclusiva da Administração e violaria a separação de poderes. " +
      "Súmula 473 STF: revogação é poder da Administração.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  // ── Q07 — adm_aa_c04 — Múltipla Escolha ──
  {
    id: "adm_aa_q07",
    contentId: "adm_aa_c04",
    statement:
      "(FCC — Adaptada) Analise os atos abaixo e assinale a alternativa que os classifica " +
      "corretamente quanto às espécies de atos administrativos (NONEP):\n" +
      "I — Decreto do Presidente regulamentando lei de licitações.\n" +
      "II — Portaria do diretor estabelecendo horário de funcionamento do órgão.\n" +
      "III — Licença para construir concedida ao particular.\n" +
      "IV — Multa aplicada a empresa por infração ambiental.\n" +
      "V — Certidão de antecedentes expedida pela delegacia.",
    alternatives: [
      {
        letter: "A",
        text: "I-Ordinatório / II-Normativo / III-Negocial / IV-Enunciativo / V-Punitivo",
      },
      {
        letter: "B",
        text: "I-Normativo / II-Ordinatório / III-Negocial / IV-Punitivo / V-Enunciativo",
      },
      {
        letter: "C",
        text: "I-Normativo / II-Normativo / III-Negocial / IV-Punitivo / V-Enunciativo",
      },
      {
        letter: "D",
        text: "I-Negocial / II-Ordinatório / III-Normativo / IV-Punitivo / V-Enunciativo",
      },
      {
        letter: "E",
        text: "I-Normativo / II-Ordinatório / III-Enunciativo / IV-Punitivo / V-Negocial",
      },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "I — Decreto regulamentando lei = ato NORMATIVO (norma geral e abstrata, complementa a lei). " +
      "II — Portaria de horário = ato ORDINATÓRIO (disciplina interna do órgão). " +
      "III — Licença para construir = ato NEGOCIAL (amplia direito do particular, vinculado). " +
      "IV — Multa ambiental = ato PUNITIVO (sanção por infração). " +
      "V — Certidão de antecedentes = ato ENUNCIATIVO (atesta/certifica fato — fé pública).",
    explanationCorrect:
      "Correto! NONEP aplicado: Decreto = Normativo; Portaria de rotina = Ordinatório; " +
      "Licença = Negocial (vinculado); Multa = Punitivo; Certidão = Enunciativo. " +
      "Lembre: Negocial envolve concordância do particular (licença, autorização, permissão). " +
      "Enunciativo apenas atesta ou opina — sem criar obrigações.",
    explanationWrong:
      "Classifique pelo conteúdo: Normativo = norma geral/abstrata (decreto, instrução normativa). " +
      "Ordinatório = disciplina interna (portaria, circular, memorando). " +
      "Negocial = amplia direito do particular (licença, autorização, permissão). " +
      "Enunciativo = certifica, atesta, opina (certidão, atestado, parecer). " +
      "Punitivo = aplica sanção (multa, embargo, cassação).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q08 — adm_aa_c04 — CERTO/ERRADO ──
  {
    id: "adm_aa_q08",
    contentId: "adm_aa_c04",
    statement:
      "(CESPE/CEBRASPE — Adaptada) A licença é ato administrativo discricionário e precário, " +
      "podendo a Administração revogá-la a qualquer tempo, sem necessidade de indenização, " +
      "da mesma forma que ocorre com a autorização.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. A afirmação descreve a AUTORIZAÇÃO, não a licença. " +
      "Licença é ato VINCULADO (obrigatório se preenchidos os requisitos) e, uma vez concedida, " +
      "gera direito adquirido — não pode ser revogada arbitrariamente sem indenização. " +
      "Autorização é DISCRICIONÁRIA e PRECÁRIA — pode ser revogada a qualquer tempo sem indenização. " +
      "Essa é uma das pegadinhas mais clássicas de Direito Administrativo.",
    explanationCorrect:
      "Correto! A licença é VINCULADA (não discricionária) e não é precária. " +
      "Uma vez concedida a licença, o particular tem direito adquirido. " +
      "Quem é discricionária e precária é a AUTORIZAÇÃO. " +
      "O item está ERRADO ao atribuir à licença as características da autorização.",
    explanationWrong:
      "O item está ERRADO. Diferença fundamental:\n" +
      "LICENÇA: ato vinculado, definitivo, direito subjetivo do particular quando preenchidos os requisitos.\n" +
      "AUTORIZAÇÃO: ato discricionário, precário, revogável a qualquer tempo sem indenização.\n" +
      "Exemplos de licença: licença para construir, licença para dirigir, licença sanitária.\n" +
      "Exemplos de autorização: porte de arma, uso de bem público, funcionamento de estabelecimento.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  // ── Q09 — adm_aa_c05 — Múltipla Escolha ──
  {
    id: "adm_aa_q09",
    contentId: "adm_aa_c05",
    statement:
      "(CESPE/CEBRASPE — Adaptada) Com relação à extinção dos atos administrativos, " +
      "assinale a alternativa que apresenta diferença CORRETA entre anulação e revogação.",
    alternatives: [
      {
        letter: "A",
        text: "A revogação pode ser realizada pela Administração e pelo Judiciário; a anulação é competência exclusiva da Administração.",
      },
      {
        letter: "B",
        text: "A anulação tem efeitos ex nunc; a revogação tem efeitos ex tunc.",
      },
      {
        letter: "C",
        text: "A revogação tem fundamento em vício de legalidade; a anulação decorre de conveniência e oportunidade.",
      },
      {
        letter: "D",
        text: "A anulação tem efeitos ex tunc e pode ser feita pela Administração ou pelo Judiciário; a revogação tem efeitos ex nunc e é competência exclusiva da Administração.",
      },
      {
        letter: "E",
        text: "Atos que geraram direito adquirido podem ser revogados, mas não anulados, pela Administração.",
      },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "D = CORRETO: Anulação — ilegalidade — ex tunc — Adm. + Judiciário. " +
      "Revogação — mérito — ex nunc — exclusivo da Administração. " +
      "A = invertido: Judiciário anula, não revoga. " +
      "B = invertido: anulação = ex tunc; revogação = ex nunc. " +
      "C = invertido: anulação = legalidade; revogação = mérito. " +
      "E = invertido: atos com direito adquirido não podem ser revogados (mas podem ser anulados se ilegais).",
    explanationCorrect:
      "Correto! Tabela essencial:\n" +
      "Anulação: fundamento=ilegalidade | efeito=ex tunc (retroativo) | quem=Adm.+Judiciário.\n" +
      "Revogação: fundamento=mérito | efeito=ex nunc (prospectivo) | quem=somente Administração.\n" +
      "Súmula 473 STF confirma esse entendimento.",
    explanationWrong:
      "Grave: revogação é exclusiva da Administração — o Judiciário não revoga atos por mérito. " +
      "Anulação — ex tunc (retroage, como se o ato nunca tivesse existido). " +
      "Revogação — ex nunc (preserva efeitos passados). " +
      "Anulação — vício de legalidade. Revogação — mérito (conveniência/oportunidade). " +
      "Ato com direito adquirido NÃO pode ser revogado (mas pode ser anulado se ilegal).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q10 — adm_aa_c05 — CERTO/ERRADO ──
  {
    id: "adm_aa_q10",
    contentId: "adm_aa_c05",
    statement:
      "(FGV — Adaptada) O Poder Judiciário, ao constatar ilegalidade em ato administrativo " +
      "discricionário, pode revogá-lo com efeitos retroativos (ex tunc), desfazendo todos " +
      "os efeitos jurídicos por ele produzidos desde sua edição.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. Dois erros: (1) o Judiciário não REVOGA — ANULA. Revogação é poder exclusivo da Administração. " +
      "(2) A afirmação confunde os efeitos: anulação = ex tunc (retroativo); revogação = ex nunc (futuro). " +
      "O Judiciário, ao reconhecer ilegalidade, ANULA o ato com efeitos ex tunc — o enunciado diz 'revoga', o que está errado.",
    explanationCorrect:
      "Correto! O Judiciário ANULA (não revoga) atos ilegais. " +
      "A anulação tem efeitos ex tunc. O termo 'revogar' no enunciado torna o item ERRADO: " +
      "revogação é exclusividade da Administração e tem fundamento em mérito (não em ilegalidade).",
    explanationWrong:
      "O item está ERRADO. O Judiciário diante de ilegalidade: ANULA (não revoga). " +
      "Anulação judicial: fundamento = legalidade | efeito = ex tunc | competência = Judiciário ou Adm. " +
      "Revogação: fundamento = mérito | efeito = ex nunc | competência = somente Administração. " +
      "O enunciado usa 'revoga' onde deveria ser 'anula' — erro técnico grave.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  // ── Q11 — adm_aa_c06 — Múltipla Escolha ──
  {
    id: "adm_aa_q11",
    contentId: "adm_aa_c06",
    statement:
      "(CESPE/CEBRASPE — Adaptada) Sobre a convalidação de atos administrativos viciados, " +
      "assinale a alternativa CORRETA.",
    alternatives: [
      {
        letter: "A",
        text: "O vício de finalidade (desvio de poder) pode ser convalidado pela Administração, pois se trata de vício de forma.",
      },
      {
        letter: "B",
        text: "Apenas o vício de competência exclusiva pode ser convalidado; os demais vícios geram nulidade absoluta.",
      },
      {
        letter: "C",
        text: "A convalidação opera efeitos ex nunc, preservando apenas os efeitos futuros do ato e não retroagindo à data de sua prática.",
      },
      {
        letter: "D",
        text: "Os vícios de competência (exceto exclusiva) e de forma (exceto forma essencial) são sanáveis e podem ser convalidados pela Administração.",
      },
      {
        letter: "E",
        text: "O vício de objeto ilícito pode ser convalidado quando o interesse público assim o exigir, a critério discricionário da Administração.",
      },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "D = CORRETO: Vícios sanáveis — convalidação: competência (exceto exclusiva e em razão da matéria) + forma (exceto essencial). " +
      "A = ERRADO: desvio de finalidade é vício insanável. " +
      "B = ERRADO: invertido — competência EXCLUSIVA é justamente a que NÃO pode ser convalidada. " +
      "C = ERRADO: convalidação tem efeitos ex tunc (retroage). " +
      "E = ERRADO: vício de objeto ilícito é sempre insanável, sem exceção.",
    explanationCorrect:
      "Correto! Vícios sanáveis (convalidáveis): competência + forma (com exceções). " +
      "Vícios insanáveis (nulidade): objeto ilícito, finalidade desviada, motivo falso/inexistente. " +
      "Efeitos da convalidação: EX TUNC (retroagem ao momento da prática do ato). " +
      "Convalidação de competência = RATIFICAÇÃO. Convalidação de forma = CONFIRMAÇÃO.",
    explanationWrong:
      "Memorize: CO-FO podem ser CONVALIDADOS (COmpetência + FOrma) — com exceções. " +
      "NÃO são convalidáveis: Objeto ilícito, Finalidade desviada (desvio de poder), Motivo falso. " +
      "Competência EXCLUSIVA também não é convalidável. " +
      "Forma ESSENCIAL também não é convalidável. " +
      "Convalidação opera EX TUNC — retroage.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q12 — adm_aa_c06 — CERTO/ERRADO ──
  {
    id: "adm_aa_q12",
    contentId: "adm_aa_c06",
    statement:
      "(FGV — Adaptada) Ato administrativo praticado com vício de objeto — cujo conteúdo é " +
      "ilícito — pode ser convalidado pela autoridade competente quando o interesse público " +
      "assim recomendar, tendo em vista o princípio da continuidade do serviço público.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. Vício de objeto ilícito é insanável — gera NULIDADE ABSOLUTA. " +
      "Não pode ser convalidado sob NENHUMA hipótese, nem por razão de interesse público, " +
      "nem por continuidade do serviço. O ato com objeto ilícito deve ser ANULADO. " +
      "Apenas vícios de competência (salvo exclusiva) e de forma (salvo essencial) admitem convalidação.",
    explanationCorrect:
      "Correto! Vício de objeto ilícito = nulidade absoluta = insanável. " +
      "Nenhum princípio (nem continuidade do serviço, nem interesse público) autoriza a manutenção " +
      "de ato com conteúdo ilícito. O item está ERRADO. Convalida-se apenas: vício de competência + vício de forma.",
    explanationWrong:
      "O item está ERRADO. Objeto ilícito é vício INSANÁVEL — nulidade absoluta. " +
      "A continuidade do serviço e o interesse público não justificam a convalidação de objeto ilícito. " +
      "Um ato ilícito mantido em nome do interesse público seria contradição nos próprios termos. " +
      "Somente competência e forma (com suas exceções) admitem convalidação.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
];

// ─── RUNNER ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Seed R31 — Direito Administrativo: Atos Administrativos ===\n");

  // 1. Resolver Subject
  const subjectRows = (await db.execute(sql`
    SELECT id FROM "Subject"
    WHERE name ILIKE '%Administrativo%'
       OR name ILIKE '%Dir%Administrativo%'
    ORDER BY name
    LIMIT 1
  `)) as any[];

  if (!subjectRows[0]) {
    throw new Error('Subject com "Administrativo" não encontrado. Verifique o banco.');
  }
  const subjectId = subjectRows[0].id;
  console.log(`Subject encontrado: ${subjectId}`);

  // 2. Resolver Topic
  const topicRows = (await db.execute(sql`
    SELECT id FROM "Topic"
    WHERE "subjectId" = ${subjectId}
    ORDER BY name
    LIMIT 1
  `)) as any[];

  if (!topicRows[0]) {
    throw new Error("Nenhum Topic encontrado para este Subject.");
  }
  const topicId = topicRows[0].id;
  console.log(`Topic encontrado: ${topicId}`);

  // 3. Inserir Conteúdos
  console.log("\n--- Inserindo Conteúdos ---");
  for (const c of contents) {
    const wordCount = c.textContent.split(/\s+/).filter(Boolean).length;
    const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

    await db.execute(sql`
      INSERT INTO "Content" (
        id, title, "textContent", "subjectId", "topicId",
        "mnemonic", "keyPoint", "practicalExample",
        difficulty, "wordCount", "estimatedReadTime", "isActive", "createdAt", "updatedAt"
      ) VALUES (
        ${c.id}, ${c.title}, ${c.textContent}, ${subjectId}, ${topicId},
        ${c.mnemonic}, ${c.keyPoint}, ${c.practicalExample},
        ${c.difficulty}, ${wordCount}, ${estimatedReadTime}, true, NOW(), NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `);
    console.log(`  OK: ${c.id} — ${c.title} (${wordCount} palavras, ~${estimatedReadTime} min)`);
  }

  // 4. Inserir Questões
  console.log("\n--- Inserindo Questões ---");
  for (const q of questions) {
    const contentRows = (await db.execute(sql`
      SELECT id FROM "Content" WHERE id = ${q.contentId} LIMIT 1
    `)) as any[];

    if (!contentRows[0]) {
      console.warn(`  SKIP: contentId ${q.contentId} não encontrado para questão ${q.id}`);
      continue;
    }
    const resolvedContentId = contentRows[0].id;
    const alternativesJson = JSON.stringify(q.alternatives);

    await db.execute(sql`
      INSERT INTO "Question" (
        "id", "statement", "alternatives", "correctAnswer", "correctOption",
        "explanation", "explanationCorrect", "explanationWrong",
        "subjectId", "topicId", "contentId",
        "isActive", "difficulty", "timesUsed", "questionType",
        "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternativesJson}::jsonb, ${q.correctAnswer}, ${q.correctOption},
        ${q.explanation}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${subjectId}, ${topicId}, ${resolvedContentId},
        true, ${q.difficulty}, 0, ${q.questionType}, NOW(), NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `);
    console.log(`  OK: ${q.id} [${q.questionType}] — ${q.statement.substring(0, 60)}...`);
  }

  console.log("\n=== R31 concluído: 6 átomos + 12 questões de Atos Administrativos ===");
  process.exit(0);
}

main().catch((err) => {
  console.error("ERRO no seed R31:", err);
  process.exit(1);
});
