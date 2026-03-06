/**
 * Seed R34 — Geopolítica: Segurança Internacional e Economia Global
 * 6 átomos de conteúdo  (geo_gl_c01–c06)
 * 12 questões           (geo_gl_q01–q12)
 *
 * Execução (Replit): npx tsx db/seed-geopolitica-r34.ts
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

// ─── CONTEÚDOS ───────────────────────────────────────────────────────────────

const contents = [
  {
    id: "geo_gl_c01",
    title: "Nova Ordem Mundial — Multipolaridade e BRICS+",
    difficulty: "MEDIO",
    mnemonic:
      "MULTI: MULTIpolaridade = vários centros de poder. EUA + China + UE + Rússia + Sul Global. " +
      "BRICS+ (2024): Brasil, Rússia, Índia, China, África do Sul + Etiópia, Egito, EAU, Irã, Arábia Saudita. " +
      "Fim da Guerra Fria (1991) → unipolaridade EUA → crise 2008 → multipolaridade atual.",
    keyPoint:
      "• Fim da Guerra Fria (1991): fim da bipolaridade EUA x URSS\n" +
      "• Breve unipolaridade americana (1991–2008): 'momento unipolar' de Krauthammer\n" +
      "• Multipolaridade atual: EUA, China, UE, Rússia, potências emergentes\n" +
      "• BRICS original (2009): Brasil, Rússia, Índia, China, África do Sul\n" +
      "• BRICS+ (janeiro 2024): incorporou Etiópia, Egito, EAU, Irã e Arábia Saudita\n" +
      "• China: segunda economia do mundo (PIB nominal); líder em PPP\n" +
      "• Sul Global: termo para economias emergentes e em desenvolvimento que buscam alternativa à ordem ocidental",
    practicalExample:
      "ABIN: 'O mundo pós-Guerra Fria é caracterizado por uma ordem multipolar, na qual o poder está distribuído entre múltiplos atores.' — CERTO. " +
      "CESPE: 'O BRICS foi criado em 2009 e incluía originalmente 5 países.' — CERTO. " +
      "FGV: A nova Rota da Seda chinesa é instrumento de projeção de poder e influência econômica da China no Sul Global.",
    textContent:
      "A ordem internacional do século XXI é marcada pela transição da bipolaridade da Guerra Fria " +
      "para uma configuração multipolar, na qual diferentes centros de poder competem por influência global.\n\n" +
      "DA BIPOLARIDADE À MULTIPOLARIDADE:\n" +
      "A Guerra Fria (1947–1991) foi marcada pela rivalidade entre EUA (polo capitalista) e URSS (polo socialista). " +
      "Com a dissolução da URSS em 1991, os EUA emergiram como potência hegemônica — o 'momento unipolar'. " +
      "A crise financeira de 2008, as guerras no Iraque e Afeganistão e o ascenso da China erodiu essa hegemonia. " +
      "O mundo contemporâneo é multipolar: EUA, China, União Europeia, Rússia e potências regionais " +
      "(Índia, Brasil, Turquia, Irã, Arábia Saudita) competem por influência.\n\n" +
      "RIVALIDADE ESTRATÉGICA EUA-CHINA:\n" +
      "A disputa sino-americana é a principal tensão geopolítica do século XXI. " +
      "Eixos de competição: tecnologia (5G, semicondutores, inteligência artificial), comércio (guerra tarifária iniciada em 2018), " +
      "Taiwan (China reivindica soberania), Mar do Sul da China (ilhas artificiais e rotas comerciais) " +
      "e influência no Sul Global (investimentos via Rota da Seda vs. parcerias ocidentais).\n\n" +
      "BRICS E BRICS+:\n" +
      "O BRICS foi criado em 2009 como fórum de cooperação entre Brasil, Rússia, Índia, China e (a partir de 2010) África do Sul. " +
      "Representa cerca de 40% da população mundial e 25% do PIB global.\n" +
      "Em janeiro de 2024, o grupo foi ampliado para BRICS+, incorporando: Etiópia, Egito, Emirados Árabes Unidos, " +
      "Irã e Arábia Saudita. Outros países manifestaram interesse em aderir (Argentina, Indonésia, entre outros).\n" +
      "Objetivos do BRICS+: reformar a governança global (FMI, Banco Mundial), reduzir dependência do dólar " +
      "(desdolarização), fortalecer o Banco de Desenvolvimento dos BRICS (NBD) e ampliar a cooperação Sul-Sul.\n\n" +
      "SUL GLOBAL:\n" +
      "O termo 'Sul Global' (em substituição a 'Terceiro Mundo' ou 'países em desenvolvimento') designa as nações " +
      "da África, América Latina, Ásia e Oceania que buscam maior representação na ordem internacional. " +
      "Não é um conceito geográfico estrito — inclui países como a Austrália e exclui países pobres do hemisfério norte.\n\n" +
      "NOVA ROTA DA SEDA (BELT AND ROAD INITIATIVE — BRI):\n" +
      "Lançada pela China em 2013, a BRI é o maior projeto de infraestrutura global da história contemporânea. " +
      "Envolve mais de 140 países e investimentos em portos, ferrovias, dutos e infraestrutura digital. " +
      "Críticos apontam a chamada 'diplomacia da armadilha da dívida' — países endividados com a China " +
      "acabariam cedendo ativos estratégicos. A BRI é o principal instrumento de projeção de poder chinês.",
  },
  {
    id: "geo_gl_c02",
    title: "Conflitos Contemporâneos — Ucrânia, Gaza e Tensões Globais",
    difficulty: "DIFICIL",
    mnemonic:
      "3 FOCOS: UCRÂNIA (Rússia x OTAN por proxy), GAZA (Israel x Hamas + questão palestina), TAIWAN (China x EUA/Japão). " +
      "Ucrânia: invasão fev/2022 — grãos + energia + OTAN. " +
      "Gaza: 7/out/2023 Hamas atacou Israel — conflito em Gaza com acusações ao TPI. " +
      "Taiwan: redline chinesa — deterrência nuclear implícita.",
    keyPoint:
      "Guerra Rússia-Ucrânia (fev/2022–presente):\n" +
      "• Causas: expansão da OTAN, Crimeia (2014), Donbass, interesses energéticos\n" +
      "• Impactos globais: crise alimentar (grãos), crise energética na Europa, rearmamento da OTAN\n" +
      "• Finlândia (2023) e Suécia (2024) ingressaram na OTAN\n" +
      "Conflito Israel-Hamas (out/2023–presente):\n" +
      "• Ataque do Hamas em 7/out/2023 + operação israelense em Gaza\n" +
      "• TPI emitiu mandado de prisão contra Netanyahu e líder do Hamas (2024)\n" +
      "• TIJ (caso África do Sul x Israel): medidas cautelares de proteção a civis\n" +
      "Tensões no Indo-Pacífico:\n" +
      "• Taiwan: China reivindica reunificação — EUA mantém ambiguidade estratégica\n" +
      "• Mar do Sul da China: ilhas artificiais, rota de 30% do comércio global",
    practicalExample:
      "ABIN: A invasão russa da Ucrânia em fevereiro de 2022 representou a maior operação militar na Europa desde a 2ª Guerra Mundial. " +
      "CESPE: O ingresso da Finlândia e da Suécia na OTAN foi diretamente motivado pela invasão russa da Ucrânia. " +
      "FGV: O TPI emitiu mandado de prisão contra o primeiro-ministro israelense Netanyahu em 2024 — instrumento de responsabilização por crimes de guerra.",
    textContent:
      "O mundo contemporâneo é marcado por múltiplos focos de conflito que redefinem a ordem internacional " +
      "e testam os limites das instituições multilaterais.\n\n" +
      "GUERRA RÚSSIA-UCRÂNIA (fevereiro de 2022–presente):\n" +
      "Em 24 de fevereiro de 2022, a Rússia lançou uma invasão em larga escala da Ucrânia — " +
      "o maior conflito armado na Europa desde a Segunda Guerra Mundial.\n\n" +
      "Contexto e causas:\n" +
      "  Expansão da OTAN para o leste (da qual a Rússia sempre se opôs).\n" +
      "  Anexação da Crimeia pela Rússia em 2014 e conflito no Donbass (2014–2022).\n" +
      "  Aspirações ucranianas de integração europeia (Acordo de Associação com a UE, 2014).\n" +
      "  Interesses geopolíticos e energéticos russos na região.\n\n" +
      "Impactos globais:\n" +
      "  Crise alimentar: Ucrânia e Rússia respondem por cerca de 30% das exportações mundiais de trigo.\n" +
      "  Crise energética: Europa dependia do gás russo — acelerou a transição para fontes alternativas.\n" +
      "  Rearmamento: países europeus aumentaram gastos militares; Alemanha rompeu com pacifismo histórico.\n" +
      "  Expansão da OTAN: Finlândia ingressou em 2023; Suécia em 2024 — quebrando décadas de neutralidade.\n\n" +
      "CONFLITO ISRAEL-HAMAS (outubro de 2023–presente):\n" +
      "Em 7 de outubro de 2023, o Hamas lançou o maior ataque terrorista da história israelense — " +
      "1.200 mortos e cerca de 250 reféns. Israel respondeu com operação militar em Gaza de alta intensidade.\n\n" +
      "Dimensão jurídica internacional:\n" +
      "  TIJ (Tribunal Internacional de Justiça): A África do Sul acionou o tribunal acusando Israel de genocídio. " +
      "O TIJ emitiu medidas cautelares determinando proteção a civis palestinos.\n" +
      "  TPI (Tribunal Penal Internacional): em novembro de 2024, emitiu mandados de prisão contra o " +
      "primeiro-ministro israelense Benjamin Netanyahu e o ministro da Defesa, além de líderes do Hamas.\n\n" +
      "Questão palestina:\n" +
      "Solução de dois Estados (Israel e Palestina): defendida pela ONU e comunidade internacional, " +
      "mas sem implementação prática. Em 2024, mais de 140 países reconheciam o Estado da Palestina.\n\n" +
      "TENSÕES NO INDO-PACÍFICO:\n" +
      "Taiwan: A China considera Taiwan parte inseparável de seu território e não descarta uso da força " +
      "para a reunificação. Os EUA mantêm 'ambiguidade estratégica' — vendem armas a Taiwan sem reconhecer formalmente sua independência.\n" +
      "Mar do Sul da China: A China construiu ilhas artificiais com instalações militares, " +
      "reivindicando soberania sobre áreas contestadas por Vietnã, Filipinas, Malásia e Brunei. " +
      "Cerca de 30% do comércio marítimo global passa por essa região.",
  },
  {
    id: "geo_gl_c03",
    title: "Segurança Cibernética Global e Guerra Híbrida",
    difficulty: "MEDIO",
    mnemonic:
      "HÍBRIDA = convencional + ciber + desinformação + econômico. " +
      "APT = Advanced Persistent Threat (grupo hacker estatal). " +
      "APT28/29 = Rússia (Fancy Bear/Cozy Bear). APT41 = China. Lazarus = Coreia do Norte. " +
      "Stuxnet (2010): EUA + Israel destruíram centrífugas nucleares do Irã — 1º ciberarma de destruição física.",
    keyPoint:
      "• Guerra híbrida: combina meios militares convencionais + ciberataques + desinformação + guerra econômica\n" +
      "• Stuxnet (2010): primeiro ciberataque a causar destruição física — centrifugadoras nucleares do Irã (EUA + Israel)\n" +
      "• SolarWinds (2020): ataque de cadeia de suprimentos atribuído à Rússia — comprometeu agências americanas\n" +
      "• Infraestruturas críticas: energia, água, comunicações, sistema financeiro — alvos principais\n" +
      "• Espionagem industrial: roubo de propriedade intelectual, segredos militares e tecnológicos\n" +
      "• Deepfakes e desinformação: interferência em eleições, manipulação de opinião pública\n" +
      "• Brasil: Lei nº 14.600/2023 criou o Programa Nacional de Segurança Cibernética",
    practicalExample:
      "ABIN: A guerra híbrida russa na Ucrânia incluiu ciberataques a infraestruturas críticas antes e durante a invasão de 2022. " +
      "CESPE: Stuxnet foi o primeiro malware desenvolvido para causar danos físicos reais — destruiu centrífugas nucleares iranianas. " +
      "FGV: A desinformação (fake news) em redes sociais é considerada componente da guerra híbrida contemporânea.",
    textContent:
      "O domínio cibernético tornou-se o quinto domínio da guerra, ao lado dos tradicionais " +
      "terrestre, marítimo, aéreo e espacial. A segurança cibernética é hoje uma dimensão estratégica nacional.\n\n" +
      "GUERRA HÍBRIDA:\n" +
      "Conceito que descreve conflitos que combinam simultaneamente:\n" +
      "  Meios militares convencionais (forças armadas, artilharia, drones).\n" +
      "  Ciberataques (infraestruturas, sistemas de comando e controle).\n" +
      "  Desinformação e propaganda (manipulação da opinião pública, fake news).\n" +
      "  Guerra econômica (sanções, embargos, manipulação de mercados).\n" +
      "  Operações de influência (interferência em eleições, compra de ativos estratégicos).\n\n" +
      "A Rússia é considerada pioneira na sistematização da guerra híbrida — 'Doutrina Gerasimov'. " +
      "A invasão da Ucrânia em 2022 foi precedida por ciberataques massivos a sites governamentais e infraestruturas.\n\n" +
      "MARCOS DO CIBERCONFLITO GLOBAL:\n\n" +
      "Stuxnet (2010):\n" +
      "Primeiro ciberataque da história a causar destruição física. " +
      "Desenvolvido pelos EUA e Israel, o vírus infectou os sistemas de controle das centrífugas de enriquecimento de urânio " +
      "em Natanz, Irã, causando sua destruição física e atrasando o programa nuclear iraniano por anos. " +
      "Inaugurou a era das ciberarmas de efeito cinético.\n\n" +
      "SolarWinds (2020):\n" +
      "Ataque de cadeia de suprimentos atribuído ao grupo APT29 russo (SVR). " +
      "Comprometeu o software de gerenciamento de TI usado por centenas de empresas e agências governamentais americanas, " +
      "incluindo o Departamento do Tesouro e o Departamento de Estado.\n\n" +
      "GRUPOS HACKERS ESTATAIS (APTs — Advanced Persistent Threats):\n" +
      "APT28 (Fancy Bear) — Rússia/GRU: interferência em eleições americanas (2016), ataques à OTAN.\n" +
      "APT29 (Cozy Bear) — Rússia/SVR: espionagem diplomática, SolarWinds.\n" +
      "APT41 — China/MSS: espionagem industrial, roubo de propriedade intelectual, ataques a farmacêuticas.\n" +
      "Lazarus Group — Coreia do Norte: roubo de criptomoedas, ataques bancários (SWIFT), WannaCry (2017).\n\n" +
      "INFRAESTRUTURAS CRÍTICAS:\n" +
      "São os sistemas cuja perturbação causaria grave impacto na segurança nacional: " +
      "redes de energia elétrica, sistemas de abastecimento de água, telecomunicações, " +
      "sistema financeiro, hospitais e sistemas de transporte. " +
      "O apagão na Ucrânia (2015–2016), causado por ciberataque russo, foi o primeiro ataque " +
      "confirmado a deixar consumidores sem energia.\n\n" +
      "DESINFORMAÇÃO E INTERFERÊNCIA ELEITORAL:\n" +
      "O uso de redes sociais, bots e deepfakes para manipular eleições tornou-se tema central " +
      "da segurança global. A Rússia é sistematicamente acusada de interferir em eleições nos EUA (2016), " +
      "França (2017) e outros países ocidentais. " +
      "A IA generativa amplificou o risco de desinformação com a criação de conteúdo falso convincente.\n\n" +
      "BRASIL E SEGURANÇA CIBERNÉTICA:\n" +
      "O Brasil criou o Programa Nacional de Segurança Cibernética (PNSiC) e o Gabinete de Segurança Institucional (GSI) " +
      "coordena a proteção de infraestruturas críticas nacionais. " +
      "A ABIN tem papel central na contrainteligência e monitoramento de ameaças cibernéticas ao Estado brasileiro.",
  },
  {
    id: "geo_gl_c04",
    title: "Blocos Econômicos — UE, Mercosul, USMCA e a Rota da Seda",
    difficulty: "FACIL",
    mnemonic:
      "BloEco: UE (27 membros, Euro) · Mercosul (BR+AR+UY+PY) · USMCA (EUA+CAN+MEX) · ASEAN (10 SE Asiático) · RCEP (maior em comércio). " +
      "BREXIT = saída do Reino Unido da UE (2020). " +
      "RCEP = Regional Comprehensive Economic Partnership = maior bloco comercial do mundo por população e PIB.",
    keyPoint:
      "• União Europeia (UE): 27 membros, moeda única (Euro em 20 países), livre circulação, Brexit em 2020\n" +
      "• Mercosul: Brasil, Argentina, Uruguai, Paraguai (Venezuela suspensa desde 2016)\n" +
      "• USMCA (2020, ex-NAFTA): EUA, Canadá e México — maior acordo de livre comércio da América\n" +
      "• RCEP (2022): maior bloco comercial do mundo — 15 países da Ásia-Pacífico, China liderando\n" +
      "• ASEAN: 10 países do Sudeste Asiático — cooperação política e econômica\n" +
      "• Nova Rota da Seda (BRI): China, 140+ países, infraestrutura global como instrumento de influência\n" +
      "• Acordo Mercosul-UE: negociado desde 1999, texto fechado em 2019, ainda sem ratificação plena",
    practicalExample:
      "CESPE: 'O Reino Unido deixou formalmente a União Europeia em 31 de janeiro de 2020.' — CERTO. " +
      "FGV: 'O RCEP é atualmente o maior acordo comercial do mundo em termos de PIB dos membros.' — CERTO. " +
      "ABIN: A Nova Rota da Seda é o principal instrumento de projeção de poder econômico e geopolítico da China — conecta 140+ países em infraestrutura.",
    textContent:
      "Os blocos econômicos são arranjos de cooperação entre países que buscam integração comercial, " +
      "econômica e, em alguns casos, política.\n\n" +
      "UNIÃO EUROPEIA (UE):\n" +
      "O maior e mais profundo processo de integração regional do mundo. " +
      "Fundada em 1957 (Tratado de Roma como CEE), renomeada UE pelo Tratado de Maastricht (1992). " +
      "Membros: 27 países (após o Brexit). " +
      "Principais características: mercado único (livre circulação de bens, serviços, pessoas e capitais); " +
      "moeda comum (Euro, adotado por 20 dos 27 membros); parlamento europeu eleito; tribunal de justiça supranacional.\n\n" +
      "Brexit:\n" +
      "O Reino Unido votou pela saída da UE no referendo de 2016 (51,9% a favor). " +
      "A saída formal ocorreu em 31 de janeiro de 2020, com período de transição até 31 de dezembro de 2020. " +
      "O Brexit gerou profundos impactos econômicos para o Reino Unido e a UE, " +
      "especialmente em termos de comércio, imigração e estabilidade política (Irlanda do Norte).\n\n" +
      "MERCOSUL:\n" +
      "Criado pelo Tratado de Assunção em 1991. Membros plenos: Brasil, Argentina, Uruguai e Paraguai. " +
      "A Venezuela foi suspensa em 2016 por violação da cláusula democrática e excluída em 2017. " +
      "A Bolívia assinou o protocolo de adesão, mas ainda não finalizou o processo. " +
      "Em 2019, o Mercosul e a UE fecharam um acordo de associação após 20 anos de negociações — " +
      "mas a ratificação plena ainda enfrenta obstáculos políticos.\n\n" +
      "USMCA (Acordo Estados Unidos-México-Canadá):\n" +
      "Substituiu o NAFTA em 2020. É o maior acordo de livre comércio das Américas. " +
      "Inova com regras de origem para automóveis, proteção de propriedade intelectual e cláusulas trabalhistas.\n\n" +
      "RCEP (Parceria Econômica Regional Abrangente):\n" +
      "Entrou em vigor em janeiro de 2022. É atualmente o maior bloco comercial do mundo em termos de " +
      "PIB combinado, população e volume de comércio. Inclui 15 países da Ásia-Pacífico: China, Japão, " +
      "Coreia do Sul, Austrália, Nova Zelândia e os 10 países da ASEAN. " +
      "Notavelmente, os EUA não fazem parte do RCEP — o que reforça a influência chinesa na região.\n\n" +
      "NOVA ROTA DA SEDA (Belt and Road Initiative — BRI):\n" +
      "Lançada pelo presidente chinês Xi Jinping em 2013. " +
      "Envolve mais de 140 países e trilhões de dólares em investimentos em portos, ferrovias, " +
      "dutos, parques industriais e infraestrutura digital. " +
      "Componentes: Cinturão Econômico da Rota da Seda (terrestre) e Rota da Seda Marítima do século XXI.\n\n" +
      "ASEAN (Associação das Nações do Sudeste Asiático):\n" +
      "Fundada em 1967. 10 membros: Indonésia, Malásia, Filipinas, Singapura, Tailândia, " +
      "Brunei, Vietnã, Laos, Mianmar e Camboja. " +
      "Princípio da não interferência nos assuntos internos. " +
      "Maior potência demográfica jovem do mundo — projetada como polo econômico relevante nas próximas décadas.",
  },
  {
    id: "geo_gl_c05",
    title: "Organismos Internacionais — ONU, OTAN, TPI e OEA",
    difficulty: "MEDIO",
    mnemonic:
      "ONU: 193 membros, CS com 5 P5 com VETO (EUA, RU, FR, RUS, CHI). " +
      "OTAN: Art. 5º = ataque a um = ataque a todos (defesa coletiva). " +
      "TPI: processa PESSOAS (crimes de guerra, genocídio, humanidade). " +
      "TIJ: julga ESTADOS (conflitos interestatais). " +
      "AIEA: controla energia nuclear (tratados de não proliferação).",
    keyPoint:
      "ONU (1945):\n" +
      "• 193 membros, sede em Nova York\n" +
      "• Conselho de Segurança: 5 membros permanentes com poder de veto (EUA, RU, França, Rússia, China) + 10 rotativos\n" +
      "• Assembleia Geral: um país = um voto (sem poder vinculante)\n" +
      "OTAN (1949):\n" +
      "• 32 membros (Suécia ingressou em 2024)\n" +
      "• Art. 5º: ataque a um membro = ataque a todos (cláusula de defesa coletiva)\n" +
      "TPI vs TIJ:\n" +
      "• TPI: julga indivíduos por crimes de guerra, genocídio e crimes contra a humanidade\n" +
      "• TIJ: julga conflitos entre Estados (jurisdição contenciosa e consultiva)\n" +
      "OEA:\n" +
      "• 35 membros, sede em Washington\n" +
      "• Cláusula democrática — suspendeu Cuba (1962, reintegrada 2009) e Venezuela (debates em curso)",
    practicalExample:
      "ABIN: O poder de veto no Conselho de Segurança da ONU tem bloqueado resoluções sobre a Ucrânia (veto russo) e Gaza (veto americano). " +
      "CESPE: 'O Art. 5º do Tratado do Atlântico Norte prevê que um ataque armado contra qualquer membro é considerado ataque contra todos.' — CERTO. " +
      "FGV: O TPI emitiu mandados de prisão contra líderes russos e israelenses em 2024 — mas sua efetividade depende da cooperação dos Estados.",
    textContent:
      "Os organismos internacionais são estruturas multilaterais criadas por tratados para promover " +
      "cooperação, resolver conflitos e estabelecer normas de convivência entre os Estados.\n\n" +
      "ORGANIZAÇÃO DAS NAÇÕES UNIDAS (ONU):\n" +
      "Fundada em 1945, após a Segunda Guerra Mundial, com sede em Nova York. " +
      "Reúne 193 Estados-membros (quase todos os países do mundo).\n\n" +
      "Principais órgãos:\n" +
      "Conselho de Segurança (CS): responsabilidade primária pela manutenção da paz e segurança internacionais. " +
      "Composto por 5 membros permanentes (P5) com poder de veto — EUA, Reino Unido, França, Rússia e China — " +
      "e 10 membros rotativos eleitos pela Assembleia Geral por 2 anos.\n" +
      "O poder de veto paralisa frequentemente o CS — Rússia e China vetaram resoluções sobre Síria, Ucrânia e Gaza.\n" +
      "Assembleia Geral: todos os membros, um voto cada. Resoluções não são vinculantes, mas têm peso político.\n\n" +
      "Agências especializadas: AIEA (nuclear), OMS (saúde), FAO (alimentação), UNESCO (educação/cultura), " +
      "ACNUR (refugiados), PNUD (desenvolvimento).\n\n" +
      "OTAN (Organização do Tratado do Atlântico Norte):\n" +
      "Fundada em 1949, durante a Guerra Fria, como aliança militar ocidental. " +
      "Atualmente com 32 membros — último ingresso foi a Suécia em março de 2024 " +
      "(Finlândia havia ingressado em abril de 2023).\n\n" +
      "Artigo 5º do Tratado de Washington:\n" +
      "'As Partes concordam em que um ataque armado contra uma ou várias delas na Europa ou na América do Norte " +
      "será considerado um ataque contra todas.' Trata-se da cláusula de defesa coletiva — coração da OTAN.\n" +
      "O Art. 5º foi invocado pela primeira e única vez após os ataques de 11 de setembro de 2001.\n\n" +
      "TRIBUNAL PENAL INTERNACIONAL (TPI):\n" +
      "Criado pelo Estatuto de Roma (1998), com sede em Haia, Países Baixos. " +
      "Julga indivíduos (não Estados) por crimes de guerra, crimes contra a humanidade, genocídio e crime de agressão. " +
      "Tem caráter complementar — só atua quando o Estado não pode ou não quer julgar. " +
      "Em 2023–2024, emitiu mandados de prisão contra Putin (Rússia/Ucrânia) e Netanyahu/líderes do Hamas (Gaza).\n\n" +
      "TRIBUNAL INTERNACIONAL DE JUSTIÇA (TIJ):\n" +
      "Principal órgão judicial da ONU, com sede em Haia. " +
      "Julga CONFLITOS ENTRE ESTADOS (não indivíduos). " +
      "Em 2024, África do Sul acionou o TIJ contra Israel pelo crime de genocídio em Gaza — " +
      "o tribunal emitiu medidas cautelares determinando proteção a civis palestinos.\n\n" +
      "ORGANIZAÇÃO DOS ESTADOS AMERICANOS (OEA):\n" +
      "Fundada em 1948, sede em Washington D.C. 35 membros — todos os países das Américas. " +
      "Cuba foi suspensa em 1962 e reintegrada em 2009. " +
      "Possui mecanismos de defesa da democracia (Carta Democrática Interamericana, 2001). " +
      "O Sistema Interamericano de Direitos Humanos (CIDH e Corte IDH) julga violações de direitos humanos.",
  },
  {
    id: "geo_gl_c06",
    title: "Questões Ambientais, Energia e Geopolítica do Clima",
    difficulty: "MEDIO",
    mnemonic:
      "PARIS-OPEP-LITIO: Acordo de PARIS (1,5°C) · COP30 em BELÉM (2025) · OPEP+ controla petróleo · LÍTIO = triângulo (ARG+BOL+CHI). " +
      "Transição energética: solar + eólica + hidrogênio verde. " +
      "Amazônia: maior floresta tropical — 60% no Brasil — símbolo da tensão soberania vs. clima global.",
    keyPoint:
      "• Acordo de Paris (2015): manter aquecimento global abaixo de 2°C, esforços para 1,5°C\n" +
      "• COP: Conferência das Partes da UNFCCC — COP28 em Dubai (2023), COP30 em Belém/Brasil (2025)\n" +
      "• OPEP+: Organização dos Países Exportadores de Petróleo + Rússia — controla ~40% da produção global\n" +
      "• Geopolítica do lítio: Argentina, Bolívia e Chile detêm ~60% das reservas mundiais (triângulo do lítio)\n" +
      "• Hidrogênio verde: combustível limpo produzido por eletrólise com energia renovável — corrida tecnológica\n" +
      "• COP30 em Belém (2025): Brasil anfitria — destaque para desmatamento e financiamento climático\n" +
      "• Dívida climática: países ricos devem financiar transição de países pobres (fundo de US$ 100 bi/ano — não cumprido)",
    practicalExample:
      "ABIN/CESPE: 'O Acordo de Paris estabelece como meta limitar o aumento da temperatura média global a 1,5°C acima dos níveis pré-industriais.' — CERTO (meta mais ambiciosa). " +
      "FGV: A geopolítica do lítio é determinante para a transição para veículos elétricos — países do triângulo do lítio ganham relevância estratégica. " +
      "ANAC: A COP30 será realizada em Belém, no Pará, em 2025 — primeira COP sediada na Amazônia.",
    textContent:
      "As questões ambientais e energéticas tornaram-se dimensões centrais da geopolítica global, " +
      "criando novas alianças, disputas e assimetrias de poder entre os países.\n\n" +
      "ACORDO DE PARIS E AGENDA CLIMÁTICA:\n" +
      "Adotado em dezembro de 2015, na COP21, o Acordo de Paris é o principal instrumento jurídico " +
      "internacional de combate às mudanças climáticas. " +
      "Meta central: manter o aumento da temperatura média global bem abaixo de 2°C em relação aos níveis " +
      "pré-industriais, com esforços para limitar a 1,5°C.\n\n" +
      "Mecanismo: cada país apresenta Contribuições Nacionalmente Determinadas (NDCs) — compromissos voluntários " +
      "de redução de emissões. Não há sanção jurídica para o descumprimento.\n\n" +
      "CONFERÊNCIAS DAS PARTES (COP):\n" +
      "A COP é a reunião anual dos signatários da Convenção-Quadro das Nações Unidas sobre Mudanças Climáticas (UNFCCC).\n" +
      "COP27 (Sharm el-Sheikh, Egito, 2022): criou o Fundo de Perdas e Danos para países vulneráveis.\n" +
      "COP28 (Dubai, EAU, 2023): primeiro 'balanço global' do Acordo de Paris; acordo para transição para longe dos combustíveis fósseis.\n" +
      "COP30 (Belém, Brasil, 2025): primeira COP sediada na Amazônia. O Brasil terá papel protagonista " +
      "nas negociações sobre financiamento climático e proteção de florestas tropicais.\n\n" +
      "GEOPOLÍTICA DO PETRÓLEO — OPEP+:\n" +
      "A Organização dos Países Exportadores de Petróleo (OPEP), fundada em 1960, controla cerca de 40% " +
      "da produção mundial de petróleo. A OPEP+ (desde 2016) inclui a Rússia e outros 10 países não-OPEP, " +
      "ampliando o controle do cartel sobre os preços globais.\n" +
      "Tensão geopolítica: preços elevados beneficiam exportadores (Rússia, Arábia Saudita, Irã) " +
      "e pressionam economias importadoras. A guerra na Ucrânia usou o gás como arma geopolítica.\n\n" +
      "GEOPOLÍTICA DO LÍTIO:\n" +
      "O lítio é o mineral estratégico do século XXI — essencial para baterias de veículos elétricos e " +
      "armazenamento de energia renovável. " +
      "Argentina, Bolívia e Chile formam o 'triângulo do lítio', que detém aproximadamente 60% " +
      "das reservas mundiais conhecidas. " +
      "Disputas sobre a extração, royalties e industrialização do lítio tornaram-se centrais " +
      "na política interna e externa desses países.\n\n" +
      "HIDROGÊNIO VERDE:\n" +
      "Produzido por eletrólise da água utilizando energia renovável (solar e eólica), " +
      "o hidrogênio verde é apontado como solução para descarbonizar setores de difícil eletrificação " +
      "(aço, cimento, aviação, navegação). " +
      "Brasil, Austrália, Chile e países do Oriente Médio disputam posição na cadeia de produção global.\n\n" +
      "AMAZÔNIA E SOBERANIA CLIMÁTICA:\n" +
      "A Amazônia abriga a maior floresta tropical do mundo — 60% em território brasileiro. " +
      "Absorve cerca de 2 bilhões de toneladas de CO₂ por ano (quando saudável). " +
      "O debate entre soberania nacional sobre recursos naturais e responsabilidade climática global " +
      "é uma tensão permanente nas relações Brasil-mundo. " +
      "O desmatamento zero até 2030 é um dos compromissos do Brasil no Acordo de Paris revisado.\n\n" +
      "DÍVIDA CLIMÁTICA E FINANCIAMENTO:\n" +
      "Países ricos (responsáveis históricos pelas emissões) comprometeram-se a destinar " +
      "US$ 100 bilhões por ano a países em desenvolvimento para adaptação e mitigação — " +
      "meta não cumprida por anos, que gerou tensão nas COPs. " +
      "Na COP29 (Azerbaijão, 2024), o novo objetivo de financiamento climático foi fixado em US$ 300 bilhões anuais.",
  },
];

// ─── QUESTÕES ─────────────────────────────────────────────────────────────────

const questions = [
  // ── Q01 — geo_gl_c01 — Múltipla Escolha ──
  {
    id: "geo_gl_q01",
    contentId: "geo_gl_c01",
    statement:
      "(ABIN/CESPE — Adaptada) Em janeiro de 2024, o BRICS passou por um processo de expansão, " +
      "sendo denominado BRICS+. Assinale a alternativa que lista CORRETAMENTE os países " +
      "que aderiram ao grupo nessa expansão.",
    alternatives: [
      {
        letter: "A",
        text: "Argentina, México, Indonésia, Turquia e Arábia Saudita.",
      },
      {
        letter: "B",
        text: "Etiópia, Egito, Emirados Árabes Unidos, Irã e Arábia Saudita.",
      },
      {
        letter: "C",
        text: "Venezuela, Argélia, Nigéria, Paquistão e Tailândia.",
      },
      {
        letter: "D",
        text: "Bangladesh, Cazaquistão, Vietnam, Egito e Irã.",
      },
      {
        letter: "E",
        text: "Turquia, Indonésia, Etiópia, Emirados Árabes Unidos e México.",
      },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "B = CORRETO: Em janeiro de 2024, aderiram ao BRICS+: Etiópia, Egito, Emirados Árabes Unidos, " +
      "Irã e Arábia Saudita. " +
      "Argentina, que havia sido convidada, recusou o ingresso após a eleição de Javier Milei. " +
      "A expansão elevou o BRICS+ para representar cerca de 45% da população mundial e 35% do PIB global.",
    explanationCorrect:
      "Correto! BRICS+ (janeiro 2024): os 5 originais (Brasil, Rússia, Índia, China, África do Sul) " +
      "mais Etiópia, Egito, EAU, Irã e Arábia Saudita. " +
      "Argentina foi convidada mas recusou. " +
      "O BRICS+ representa agora uma alternativa ao G7 no sistema de governança global.",
    explanationWrong:
      "A expansão do BRICS+ em 2024 incluiu: Etiópia, Egito, Emirados Árabes Unidos, Irã e Arábia Saudita. " +
      "Argentina foi convidada mas não aderiu (decisão de Milei). " +
      "Países como Indonésia, Turquia e outros manifestaram interesse, mas não ingressaram nessa rodada. " +
      "O BRICS+ é estratégico por reunir produtores de petróleo (Rússia, Arábia Saudita, EAU, Irã) " +
      "com economias emergentes de grande população.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q02 — geo_gl_c01 — CERTO/ERRADO ──
  {
    id: "geo_gl_q02",
    contentId: "geo_gl_c01",
    statement:
      "(CESPE — Adaptada) A ordem internacional contemporânea é caracterizada pela unipolaridade, " +
      "com os Estados Unidos exercendo hegemonia inquestionável sobre todos os demais atores " +
      "internacionais, inclusive na dimensão econômica, militar e tecnológica.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. A ordem internacional contemporânea é multipolar — múltiplos centros de poder competem pela influência global. " +
      "A China é a segunda maior economia do mundo (e a maior em PPP), desafiando a hegemonia econômica americana. " +
      "A Rússia mantém capacidade nuclear e poder de veto no CS-ONU. " +
      "A UE é um polo econômico e normativo autônomo. " +
      "O 'momento unipolar' americano, descrito após 1991, claramente terminou com a crise de 2008 e o ascenso chinês.",
    explanationCorrect:
      "Correto! O item está ERRADO. O mundo é MULTIPOLAR, não unipolar. " +
      "China lidera em PIB/PPP e é rival tecnológica dos EUA. " +
      "Rússia mantém capacidade nuclear e veto no CS-ONU. " +
      "O BRICS+ e o Sul Global representam alternativas à hegemonia ocidental. " +
      "Os EUA são ainda a maior potência militar, mas sua hegemonia econômica e normativa é contestada.",
    explanationWrong:
      "O item está ERRADO. Multipolaridade = vários centros de poder. " +
      "EUA: maior potência militar, moeda de reserva (dólar). " +
      "China: segunda economia (PPP líder), maior credor global, líder em manufatura e tecnologias verdes. " +
      "Rússia: potência nuclear, veto no CS-ONU, influência no espaço pós-soviético. " +
      "UE: maior bloco econômico regulatório ('efeito Bruxelas'). " +
      "O unipolarismo americano foi o período 1991–2008 — não mais o presente.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  // ── Q03 — geo_gl_c02 — Múltipla Escolha ──
  {
    id: "geo_gl_q03",
    contentId: "geo_gl_c02",
    statement:
      "(CESPE/CEBRASPE — Adaptada) A invasão russa da Ucrânia, iniciada em fevereiro de 2022, " +
      "produziu consequências geopolíticas que ultrapassaram o conflito bilateral. " +
      "Assinale a alternativa que indica corretamente um dessas consequências.",
    alternatives: [
      {
        letter: "A",
        text: "A Finlândia e a Suécia reduziram seus gastos militares e declararam neutralidade, evitando envolvimento no conflito.",
      },
      {
        letter: "B",
        text: "O conflito não afetou os mercados de commodities globais, pois Rússia e Ucrânia têm participação marginal no comércio internacional de grãos.",
      },
      {
        letter: "C",
        text: "A Finlândia e a Suécia ingressaram na OTAN, encerrando décadas de neutralidade e não alinhamento militar.",
      },
      {
        letter: "D",
        text: "A União Europeia aprofundou sua dependência do gás russo para garantir estabilidade energética durante o conflito.",
      },
      {
        letter: "E",
        text: "A Rússia foi excluída do Conselho de Segurança da ONU por violação da Carta das Nações Unidas.",
      },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "C = CORRETO: a invasão russa motivou diretamente o ingresso da Finlândia na OTAN (abril 2023) " +
      "e da Suécia (março 2024), encerrando décadas de neutralidade e política de não alinhamento militar. " +
      "A = ERRADO: fizeram o oposto — ingressaram na OTAN. " +
      "B = ERRADO: Rússia e Ucrânia juntas respondem por ~30% das exportações mundiais de trigo — causaram crise alimentar global. " +
      "D = ERRADO: a UE buscou ativamente reduzir a dependência do gás russo. " +
      "E = ERRADO: membros permanentes do CS-ONU não podem ser excluídos sem reforma da Carta — politicamente inviável.",
    explanationCorrect:
      "Correto! A invasão russa foi o catalisador para o fim da neutralidade histórica de Finlândia e Suécia. " +
      "A Finlândia faz fronteira de 1.340 km com a Rússia — seu ingresso dobrou a fronteira terrestre da OTAN com a Rússia. " +
      "A Suécia (neutra desde 1814) concluiu o processo em março de 2024.",
    explanationWrong:
      "Consequências reais da guerra na Ucrânia:\n" +
      "Finlândia (2023) e Suécia (2024): ingressaram na OTAN — fim da neutralidade.\n" +
      "Crise alimentar: Ucrânia e Rússia = ~30% do trigo mundial e significativa parte do milho e girassol.\n" +
      "Europa: acelerou diversificação energética (GNL, renováveis) para reduzir dependência do gás russo.\n" +
      "CS-ONU: Rússia não pode ser excluída (membro permanente com veto) — paralisia institucional.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q04 — geo_gl_c02 — CERTO/ERRADO ──
  {
    id: "geo_gl_q04",
    contentId: "geo_gl_c02",
    statement:
      "(FGV — Adaptada) Em novembro de 2024, o Tribunal Penal Internacional (TPI) emitiu " +
      "mandados de prisão contra o primeiro-ministro israelense Benjamin Netanyahu e o " +
      "ex-ministro da Defesa de Israel, no âmbito das investigações sobre o conflito em Gaza, " +
      "o que representa um precedente histórico na aplicação do direito penal internacional.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Em 21 de novembro de 2024, o TPI emitiu mandados de prisão contra Benjamin Netanyahu " +
      "(primeiro-ministro de Israel) e Yoav Gallant (ex-ministro da Defesa) por crimes de guerra e crimes " +
      "contra a humanidade em Gaza. Também emitiu mandado contra Mohammed Deif (líder militar do Hamas). " +
      "É historicamente significativo por ser o primeiro mandado do TPI contra um líder de país ocidental aliado dos EUA.",
    explanationCorrect:
      "Correto! O TPI emitiu os mandados em novembro de 2024 — fato histórico e controverso. " +
      "Os países membros do TPI têm obrigação de prender os acusados em seu território. " +
      "EUA (não membro do TPI) e Israel rejeitaram os mandados. " +
      "Representa a extensão do direito penal internacional a atores que até então se consideravam imunes.",
    explanationWrong:
      "O item está CERTO. O TPI emitiu mandados de prisão contra Netanyahu e Gallant em novembro de 2024. " +
      "Isso gerou debate sobre a efetividade do tribunal — países membros têm obrigação de cumprir, " +
      "mas potências que não ratificaram o Estatuto de Roma (EUA, Israel, Rússia, China) rejeitam a jurisdição. " +
      "Anteriormente, o TPI já havia emitido mandado contra Vladimir Putin (2023) pelo caso ucraniano.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
  // ── Q05 — geo_gl_c03 — Múltipla Escolha ──
  {
    id: "geo_gl_q05",
    contentId: "geo_gl_c03",
    statement:
      "(CESPE/ABIN — Adaptada) Em relação à segurança cibernética e à guerra híbrida no contexto internacional, " +
      "assinale a alternativa CORRETA.",
    alternatives: [
      {
        letter: "A",
        text: "O vírus Stuxnet, descoberto em 2010, foi desenvolvido pela Coreia do Norte para atacar usinas nucleares americanas.",
      },
      {
        letter: "B",
        text: "Guerra híbrida é um conceito que descreve conflitos que combinam meios militares convencionais com ciberataques, desinformação e guerra econômica.",
      },
      {
        letter: "C",
        text: "Infraestruturas críticas como redes elétricas, sistemas de água e comunicações são imunes a ciberataques por possuírem sistemas fechados (air gap).",
      },
      {
        letter: "D",
        text: "O grupo hacker APT41, associado à China, é especializado em interferência eleitoral nos países ocidentais, sem interesse em espionagem industrial.",
      },
      {
        letter: "E",
        text: "A OTAN não considera o domínio cibernético como área de aplicação do Art. 5º do Tratado de Washington.",
      },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "B = CORRETO: guerra híbrida combina meios convencionais + ciberataques + desinformação + guerra econômica — definição consolidada. " +
      "A = ERRADO: Stuxnet foi criado pelos EUA e Israel contra o Irã (não pela Coreia do Norte). " +
      "C = ERRADO: infraestruturas críticas JÁ foram atacadas — apagão na Ucrânia (2015–2016) prova isso; sistemas 'air gap' não são invioláveis (o próprio Stuxnet atravessou um). " +
      "D = ERRADO: APT41 faz espionagem industrial E ataques motivados financeiramente. " +
      "E = ERRADO: em 2016, a OTAN reconheceu o ciberespaço como domínio operacional — ciberataque pode acionar o Art. 5º.",
    explanationCorrect:
      "Correto! Guerra híbrida (conceito de Frank Hoffman): combinação de capacidades convencionais, " +
      "irregulares e cibernéticas + desinformação para criar ambiguidade estratégica. " +
      "A Rússia é considerada sua maior praticante atual — como demonstrado no conflito ucraniano.",
    explanationWrong:
      "Pontos-chave sobre segurança cibernética:\n" +
      "Stuxnet: EUA + Israel → Irã (centrífugas nucleares de Natanz). NÃO foi a Coreia do Norte.\n" +
      "APT41 (China): espionagem industrial + crimes cibernéticos com motivação financeira.\n" +
      "APT28/29 (Rússia): interferência eleitoral + espionagem governamental.\n" +
      "Lazarus (Coreia do Norte): roubo financeiro + criptomoedas.\n" +
      "OTAN: reconheceu ciberespaço como domínio operacional em 2016 — ciberataque pode acionar Art. 5º.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q06 — geo_gl_c03 — CERTO/ERRADO ──
  {
    id: "geo_gl_q06",
    contentId: "geo_gl_c03",
    statement:
      "(CESPE — Adaptada) O vírus Stuxnet, descoberto em 2010, é considerado o primeiro " +
      "ciberataque a provocar destruição física real, tendo sido desenvolvido pela Coreia do Norte " +
      "para atacar a infraestrutura nuclear do Irã e demonstrar capacidade de guerra cibernética.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. O Stuxnet foi desenvolvido pelos EUA e Israel (operação 'Jogos Olímpicos'), não pela Coreia do Norte. " +
      "O vírus visava especificamente as centrífugas de enriquecimento de urânio em Natanz, Irã, " +
      "fazendo-as girar em velocidades destrutivas enquanto exibia leituras normais nos monitores. " +
      "A Coreia do Norte tem capacidade cibernética significativa (Grupo Lazarus), mas não foi responsável pelo Stuxnet.",
    explanationCorrect:
      "Correto! O item está ERRADO. Stuxnet = operação dos EUA + Israel. " +
      "Foi revelado publicamente por investigações jornalísticas (New York Times, 2012) e confirmado por ex-funcionários americanos. " +
      "A Coreia do Norte (Grupo Lazarus) é famosa por ataques financeiros — roubo do Banco Central de Bangladesh (2016), WannaCry (2017).",
    explanationWrong:
      "O item está ERRADO. Stuxnet: desenvolvido pelos EUA e Israel.\n" +
      "Alvo: centrífugas de enriquecimento de urânio em Natanz, Irã.\n" +
      "Impacto: destruiu fisicamente ~1.000 centrífugas, atrasando o programa nuclear iraniano.\n" +
      "Primeiro ciberataque a causar destruição física confirmada — inaugurou a era das 'ciberarmas'.\n" +
      "Coreia do Norte (Lazarus): roubo de criptomoedas, ataques bancários — não o Stuxnet.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  // ── Q07 — geo_gl_c04 — Múltipla Escolha ──
  {
    id: "geo_gl_q07",
    contentId: "geo_gl_c04",
    statement:
      "(FGV — Adaptada) Sobre os principais blocos econômicos e acordos comerciais da atualidade, " +
      "assinale a alternativa CORRETA.",
    alternatives: [
      {
        letter: "A",
        text: "O MERCOSUL atualmente conta com cinco membros plenos: Brasil, Argentina, Uruguai, Paraguai e Venezuela.",
      },
      {
        letter: "B",
        text: "O RCEP (Parceria Econômica Regional Abrangente), em vigor desde 2022, é considerado o maior bloco comercial do mundo em população e PIB combinado.",
      },
      {
        letter: "C",
        text: "O Brexit foi aprovado em referendo no Reino Unido em 2016, mas a saída formal da UE nunca foi concluída por decisão do Parlamento britânico.",
      },
      {
        letter: "D",
        text: "O USMCA substituiu o NAFTA em 2018, mantendo exatamente as mesmas regras e sem alterar as condições comerciais entre EUA, Canadá e México.",
      },
      {
        letter: "E",
        text: "A União Europeia possui atualmente 30 membros após o ingresso de vários países balcânicos em 2023.",
      },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "B = CORRETO: o RCEP, em vigor desde janeiro de 2022, reúne 15 países da Ásia-Pacífico " +
      "(incluindo China, Japão, Coreia do Sul, Austrália e ASEAN) — é o maior bloco comercial do mundo em PIB e população. " +
      "A = ERRADO: Venezuela foi suspensa do Mercosul em 2016 e excluída em 2017 — são 4 membros plenos. " +
      "C = ERRADO: Brexit foi concluído formalmente em 31/jan/2020. " +
      "D = ERRADO: USMCA (2020, não 2018) introduziu mudanças significativas nas regras de origem, trabalho e propriedade intelectual. " +
      "E = ERRADO: UE tem 27 membros (após Brexit) — sem adesões em 2023.",
    explanationCorrect:
      "Correto! RCEP (Regional Comprehensive Economic Partnership): " +
      "15 países (ASEAN + China + Japão + Coreia do Sul + Austrália + Nova Zelândia). " +
      "Em vigor desde jan/2022. Maior bloco do mundo em PIB combinado e população — " +
      "e os EUA estão DE FORA, o que fortalece a influência chinesa na Ásia-Pacífico.",
    explanationWrong:
      "Fatos essenciais dos blocos:\n" +
      "Mercosul: 4 membros plenos (Brasil, Argentina, Uruguai, Paraguai). Venezuela excluída em 2017.\n" +
      "Brexit: concluído em 31/jan/2020. UE passou de 28 para 27 membros.\n" +
      "USMCA: entrou em vigor em julho de 2020 (não 2018), com mudanças relevantes em relação ao NAFTA.\n" +
      "RCEP: em vigor desde jan/2022 — maior bloco comercial do mundo, liderado pela China.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q08 — geo_gl_c04 — CERTO/ERRADO ──
  {
    id: "geo_gl_q08",
    contentId: "geo_gl_c04",
    statement:
      "(CESPE — Adaptada) O Reino Unido saiu formalmente da União Europeia em 31 de janeiro " +
      "de 2020, após referendo realizado em 2016, em que 51,9% dos britânicos votaram pela saída. " +
      "O processo foi denominado Brexit e resultou na redução do número de membros da UE de 28 para 27.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Todos os dados estão corretos: referendo em junho de 2016 com 51,9% a favor do Leave; " +
      "saída formal em 31 de janeiro de 2020 (Dia do Brexit); " +
      "a UE passou de 28 para 27 membros. " +
      "O período de transição foi até 31 de dezembro de 2020, quando as relações comerciais foram plenamente redefinidas.",
    explanationCorrect:
      "Correto! Brexit — fatos: " +
      "Referendo: 23 jun 2016 — 51,9% Leave vs 48,1% Remain. " +
      "Saída formal: 31 jan 2020. " +
      "Transição: até 31 dez 2020. " +
      "UE: de 28 para 27 membros. " +
      "O Brexit foi o primeiro caso de saída voluntária de um Estado-membro da UE na história da integração europeia.",
    explanationWrong:
      "O item está CERTO. Todos os dados estão precisos:\n" +
      "Data do referendo: 23 de junho de 2016.\n" +
      "Resultado: 51,9% Leave (saída) vs 48,1% Remain (permanência).\n" +
      "Saída formal: 31 de janeiro de 2020.\n" +
      "Número de membros: UE passou de 28 para 27 estados-membros.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  // ── Q09 — geo_gl_c05 — Múltipla Escolha ──
  {
    id: "geo_gl_q09",
    contentId: "geo_gl_c05",
    statement:
      "(CESPE/CEBRASPE — Adaptada) Sobre o Conselho de Segurança da ONU e sua composição, " +
      "assinale a alternativa CORRETA.",
    alternatives: [
      {
        letter: "A",
        text: "O Conselho de Segurança da ONU é composto por 10 membros permanentes com poder de veto, todos pertencentes ao G20.",
      },
      {
        letter: "B",
        text: "O poder de veto no CS-ONU pode ser exercido por qualquer um dos 15 membros do Conselho, tanto permanentes quanto rotativos.",
      },
      {
        letter: "C",
        text: "Os cinco membros permanentes do CS-ONU são EUA, Reino Unido, França, Rússia e China, todos com poder de veto.",
      },
      {
        letter: "D",
        text: "A Alemanha e o Japão, como principais financiadores da ONU, foram incluídos como membros permanentes do CS em 1990.",
      },
      {
        letter: "E",
        text: "O Brasil ocupa assento permanente no CS-ONU em razão de seu protagonismo na criação da organização em 1945.",
      },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "C = CORRETO: os 5 membros permanentes (P5) do CS-ONU são EUA, Reino Unido, França, Rússia e China — " +
      "todos com poder de veto (art. 27 da Carta da ONU). " +
      "A = ERRADO: são CINCO membros permanentes, não dez. " +
      "B = ERRADO: apenas os 5 membros permanentes têm veto — os 10 rotativos não têm. " +
      "D = ERRADO: Alemanha e Japão não têm assento permanente — há décadas debatem a reforma do CS sem sucesso. " +
      "E = ERRADO: o Brasil participou da conferência de São Francisco (1945), mas sem assento permanente.",
    explanationCorrect:
      "Correto! P5 (membros permanentes com veto): EUA, Reino Unido, França, Rússia e China. " +
      "São os vencedores da 2ª Guerra Mundial. O CS tem 15 membros no total: 5 permanentes + 10 rotativos (2 anos). " +
      "O veto é o instrumento que mais paralisa o CS — Rússia e China vetam resoluções sobre Ucrânia e Gaza.",
    explanationWrong:
      "CS-ONU: 15 membros = 5 permanentes (P5) + 10 rotativos.\n" +
      "P5 com veto: EUA, Reino Unido, França, Rússia, China.\n" +
      "Membros rotativos: eleitos por 2 anos pela Assembleia Geral — sem poder de veto.\n" +
      "Alemanha e Japão pleiteiam assento permanente há décadas — ainda sem sucesso.\n" +
      "Brasil: participou da fundação em 1945, mas não tem assento permanente.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q10 — geo_gl_c05 — CERTO/ERRADO ──
  {
    id: "geo_gl_q10",
    contentId: "geo_gl_c05",
    statement:
      "(CESPE — Adaptada) O art. 5º do Tratado do Atlântico Norte (OTAN) estabelece que " +
      "um ataque armado contra qualquer membro da aliança na Europa ou na América do Norte " +
      "será considerado ataque contra todos os membros, consagrando o princípio da defesa " +
      "coletiva como fundamento da aliança.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. O Art. 5º do Tratado de Washington (1949) é a cláusula de defesa coletiva da OTAN — " +
      "'um por todos, todos por um'. Foi invocado pela única vez após o 11 de setembro de 2001. " +
      "Com a invasão russa da Ucrânia (2022), o Art. 5º ganhou renovada relevância — " +
      "é o principal argumento da Finlândia e Suécia para ingressar na OTAN.",
    explanationCorrect:
      "Correto! Art. 5º OTAN: ataque a um = ataque a todos (defesa coletiva). " +
      "Invocado apenas uma vez: após 11/set/2001, quando EUA foram atacados. " +
      "Com ingresso de Finlândia e Suécia (2023–2024), a OTAN expandiu sua fronteira com a Rússia, " +
      "tornando o Art. 5º ainda mais relevante no contexto do conflito ucraniano.",
    explanationWrong:
      "O item está CERTO. Art. 5º do Tratado de Washington (1949):\n" +
      "'Um ataque armado contra uma ou várias [partes] na Europa ou na América do Norte " +
      "será considerado um ataque contra todas as partes.'\n" +
      "Invocado 1x: 12 de setembro de 2001 (após ataques de 11/set nos EUA).\n" +
      "É o fundamento da coesão da aliança — e o principal argumento para países fronteriços à Rússia aderirem à OTAN.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  // ── Q11 — geo_gl_c06 — Múltipla Escolha ──
  {
    id: "geo_gl_q11",
    contentId: "geo_gl_c06",
    statement:
      "(ANAC/CESPE — Adaptada) Sobre o Acordo de Paris e a agenda climática global, " +
      "assinale a alternativa CORRETA.",
    alternatives: [
      {
        letter: "A",
        text: "O Acordo de Paris foi adotado na COP21, em 2015, e estabelece como única meta limitar o aquecimento global a 2°C acima dos níveis industriais do século XX.",
      },
      {
        letter: "B",
        text: "O Acordo de Paris tem caráter vinculante pleno — os países que descumprirem suas metas de redução de emissões serão penalizados com sanções econômicas internacionais.",
      },
      {
        letter: "C",
        text: "O Acordo de Paris busca manter o aquecimento global abaixo de 2°C, com esforços para limitar a 1,5°C, e cada país apresenta contribuições voluntárias (NDCs).",
      },
      {
        letter: "D",
        text: "A COP30 será realizada em Brasília, no ano de 2025, e é a primeira Conferência das Partes sediada no Brasil.",
      },
      {
        letter: "E",
        text: "Os EUA nunca ratificaram o Acordo de Paris e estão permanentemente fora do regime climático internacional.",
      },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "C = CORRETO: o Acordo de Paris (COP21, 2015) estabelece duas metas: abaixo de 2°C (hard limit) " +
      "e esforços para 1,5°C (meta mais ambiciosa). As NDCs (Contribuições Nacionalmente Determinadas) são voluntárias. " +
      "A = ERRADO: a meta de 1,5°C também está no acordo (não é 'única meta de 2°C'). " +
      "B = ERRADO: o acordo NÃO prevê sanções para descumprimento — é baseado em transparência e pressão política. " +
      "D = ERRADO: COP30 é em BELÉM, não em Brasília. " +
      "E = ERRADO: EUA ratificaram em 2016 (Obama), saíram em 2020 (Trump) e retornaram em 2021 (Biden).",
    explanationCorrect:
      "Correto! Acordo de Paris (COP21, Paris, 2015):\n" +
      "Meta 1: bem abaixo de 2°C vs. níveis pré-industriais.\n" +
      "Meta 2: esforços para limitar a 1,5°C (mais ambiciosa).\n" +
      "NDCs: compromissos nacionais voluntários — sem sanção pelo descumprimento.\n" +
      "COP30: Belém, Pará, Brasil, 2025.",
    explanationWrong:
      "Acordo de Paris — pontos críticos:\n" +
      "Duas metas: abaixo de 2°C E esforços para 1,5°C.\n" +
      "Sem sanções pelo descumprimento — baseado em transparência e revisão periódica das NDCs.\n" +
      "COP30: Belém (PA), não Brasília. Primeira COP na Amazônia.\n" +
      "EUA: ratificaram (2016) → saíram (2020, Trump) → retornaram (2021, Biden) → " +
      "Trump venceu novamente em 2024 e anunciou nova saída — histórico de instabilidade.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q12 — geo_gl_c06 — CERTO/ERRADO ──
  {
    id: "geo_gl_q12",
    contentId: "geo_gl_c06",
    statement:
      "(CESPE — Adaptada) Argentina, Bolívia e Chile formam o denominado 'triângulo do lítio', " +
      "região que concentra aproximadamente 60% das reservas mundiais conhecidas desse mineral, " +
      "tornando-se estratégica para a transição energética global, especialmente para a " +
      "produção de baterias de veículos elétricos.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. O triângulo do lítio (Argentina, Bolívia e Chile) concentra cerca de 55–60% das reservas mundiais de lítio. " +
      "O lítio é o mineral estratégico central para a produção de baterias de íons de lítio, usadas em veículos elétricos " +
      "e armazenamento de energia renovável. A disputa por controle e industrialização do lítio é uma das principais " +
      "questões geopolíticas da América do Sul no século XXI.",
    explanationCorrect:
      "Correto! Triângulo do lítio: Argentina, Bolívia e Chile. " +
      "~60% das reservas mundiais. " +
      "Lítio = 'ouro branco' do século XXI — essencial para baterias de veículos elétricos e energia renovável. " +
      "A Bolívia tem as maiores reservas (Salar de Uyuni), mas menor produção por questões políticas e infraestrutura.",
    explanationWrong:
      "O item está CERTO. Triângulo do lítio:\n" +
      "Argentina: produção crescente, políticas de atração de investimento estrangeiro.\n" +
      "Bolívia: maiores reservas (Salar de Uyuni) — política de nacionalização do litio.\n" +
      "Chile: maior produtor atual, Atacama.\n" +
      "Lítio = 'ouro branco': baterias de Li-ion para EVs, smartphones, armazenamento de energia solar/eólica.\n" +
      "A corrida pelo lítio envolve China, EUA, UE e empresas privadas globais.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
];

// ─── RUNNER ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Seed R34 — Geopolítica: Segurança Internacional e Economia Global ===\n");

  // 1. Resolver Subject — tenta múltiplos padrões
  let subjectId: string | null = null;

  const patterns = [
    "%Atualidades%",
    "%Geopolítica%",
    "%Geopolitica%",
    "%Contempor%",
    "%Mundo%",
  ];

  for (const pattern of patterns) {
    const rows = (await db.execute(sql`
      SELECT id, name FROM "Subject"
      WHERE name ILIKE ${pattern}
      ORDER BY name
      LIMIT 1
    `)) as any[];

    if (rows[0]) {
      subjectId = rows[0].id;
      console.log(`Subject encontrado: "${rows[0].name}" (id: ${subjectId})`);
      break;
    }
  }

  if (!subjectId) {
    throw new Error(
      'Nenhum Subject com "Atualidades", "Geopolítica" ou padrões similares foi encontrado. ' +
      'Verifique os subjects cadastrados no banco com: SELECT id, name FROM "Subject" ORDER BY name;'
    );
  }

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

  console.log("\n=== R34 concluído: 6 átomos + 12 questões de Geopolítica ===");
  process.exit(0);
}

main().catch((err) => {
  console.error("ERRO no seed R34:", err);
  process.exit(1);
});
