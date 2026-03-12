/**
 * Seed R57 — Densificação: Geopolítica Mundial (geo_gl_c01–c06)
 * Modo: DENSIFICAÇÃO — apenas questões; átomos já existem (seed-geopolitica-r34.ts).
 *
 * Átomos-alvo (6 átomos × 6 questões = 36 questões):
 *   geo_gl_c01 — Nova Ordem Mundial — Multipolaridade e BRICS+
 *   geo_gl_c02 — Conflitos Contemporâneos — Ucrânia, Gaza e Tensões Globais
 *   geo_gl_c03 — Segurança Cibernética Global e Guerra Híbrida
 *   geo_gl_c04 — Blocos Econômicos — UE, Mercosul, USMCA e a Rota da Seda
 *   geo_gl_c05 — Organismos Internacionais — ONU, OTAN, TPI e OEA
 *   geo_gl_c06 — Questões Ambientais, Energia e Geopolítica do Clima
 *
 * NOTA: Os 12 registros base (geo_gl_q01–q12) foram criados pelo seed R34.
 * Este seed usa IDs de formato geo_gl_cXX_qYY para evitar conflitos.
 *
 * Execução: git pull && npx tsx db/seed-dense-geopolitica-r57.ts
 */

import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

interface Question {
  id: string;
  contentId: string;
  statement: string;
  alternatives: Array<{ letter: string; text: string }>;
  correctAnswer: string;
  correctOption: number;
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  questionType: "MULTIPLA_ESCOLHA" | "CERTO_ERRADO";
}

const questions: Question[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 1 — Nova Ordem Mundial — Multipolaridade e BRICS+ (geo_gl_c01)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "geo_gl_c01_q01",
    contentId: "geo_gl_c01",
    statement: "Julgue: O BRICS, que originalmente reunia Brasil, Rússia, Índia, China e África do Sul, passou por uma expansão em 2024 com a adesão de novos membros, incluindo Irã, Emirados Árabes Unidos e Etiópia.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Em agosto de 2023, na cúpula de Joanesburgo, o BRICS convidou 6 países para adesão a partir de 2024: Arábia Saudita, Argentina (recusou), Etiópia, Egito, Emirados Árabes e Irã. Formou-se o BRICS+.",
    explanationCorrect: "CERTO. Na cúpula de Joanesburgo (agosto/2023), o BRICS expandiu-se para o BRICS+. Em 1º de janeiro de 2024, ingressaram: Irã, Emirados Árabes Unidos, Etiópia, Egito e Arábia Saudita (com condições). A Argentina rejeitou o convite sob o governo Milei.",
    explanationWrong: "O BRICS original (Brasil, Rússia, Índia, China, África do Sul) foi criado em 2006. A expansão para BRICS+ ocorreu em 2024. A Argentina foi convidada mas recusou após mudança de governo (Milei, eleito em dezembro/2023).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "geo_gl_c01_q02",
    contentId: "geo_gl_c01",
    statement: "O conceito de 'multipolaridade' no contexto da nova ordem mundial refere-se a:",
    alternatives: [
      { letter: "A", text: "Um sistema com um único poder hegemônico dominante (unipolar), como os EUA após 1991." },
      { letter: "B", text: "Um sistema internacional com dois blocos rivais principais, como na Guerra Fria." },
      { letter: "C", text: "Um sistema com múltiplos centros de poder (EUA, China, Rússia, UE, BRICS), sem hegemonia única." },
      { letter: "D", text: "A ausência de qualquer estrutura de poder no cenário internacional." },
      { letter: "E", text: "A predominância das organizações internacionais sobre os Estados nacionais." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Multipolaridade: vários polos de poder com influência global. A Guerra Fria foi bipolar (EUA vs URSS); o pós-1991 foi unipolar (EUA). A ordem atual tende à multipolaridade com ascensão de China, Índia, Rússia e bloco BRICS.",
    explanationCorrect: "Alternativa C. Multipolaridade = múltiplos centros de poder (polos). No contexto atual: EUA (poder militar dominante), China (poder econômico e tecnológico crescente), Rússia (poder nuclear e energético), UE (poder econômico-normativo), BRICS+ (poder emergente coletivo).",
    explanationWrong: "Tipos de polaridade: Unipolar = 1 hegemon (EUA, 1991-2000s). Bipolar = 2 superpotências (EUA-URSS, Guerra Fria). Multipolar = vários centros de poder (séc. XIX; tendência atual). A transição do unipolar para o multipolar é um dos temas centrais da geopolítica contemporânea.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "geo_gl_c01_q03",
    contentId: "geo_gl_c01",
    statement: "Julgue: O NDB (New Development Bank), banco multilateral criado pelo BRICS com sede em Xangai, foi estabelecido como alternativa ao Banco Mundial e ao FMI, com foco em financiamento de infraestrutura em países em desenvolvimento.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "O NDB (Novo Banco de Desenvolvimento) foi criado em 2014 e iniciou operações em 2016, com sede em Xangai. Capital inicial: US$ 100 bilhões. Objetivo: financiar infraestrutura e desenvolvimento sustentável, como alternativa às instituições de Bretton Woods.",
    explanationCorrect: "CERTO. O NDB (New Development Bank / Banco dos BRICS) foi criado em 2014 (Fortaleza), com sede em Xangai. Capital autorizado: US$ 100 bilhões. É uma alternativa ao Banco Mundial e FMI — historicamente controlados por EUA e Europa. O Brasil foi membro fundador.",
    explanationWrong: "O NDB foi criado junto com o Acordo de Reservas Contingentes (ARC, equivalente ao FMI) na cúpula de Fortaleza (2014). Representa a tentativa do BRICS de construir uma arquitetura financeira independente das instituições de Bretton Woods.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "geo_gl_c01_q04",
    contentId: "geo_gl_c01",
    statement: "A ascensão da China como potência global é ilustrada, no campo econômico, pelo fato de que:",
    alternatives: [
      { letter: "A", text: "A China ultrapassou os EUA como maior economia do mundo em PIB nominal em 2023." },
      { letter: "B", text: "A China é a maior economia do mundo em PIB pela paridade de poder de compra (PPP) e a segunda em PIB nominal, com crescimento sustentado há décadas." },
      { letter: "C", text: "A China tem o maior PIB per capita do mundo, superando os países europeus." },
      { letter: "D", text: "A moeda chinesa (yuan/renminbi) substituiu o dólar como principal moeda de reserva global." },
      { letter: "E", text: "A China tem mais empresas no ranking Fortune 500 que qualquer outro país." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Em PIB nominal (dólar corrente), EUA ainda lideram (~US$ 28 tri vs ~US$ 18 tri China em 2024). Em PIB PPP (poder de compra), China lidera desde 2014. O yuan não substituiu o dólar, mas ganhou relevância com o petrodólar do Oriente Médio.",
    explanationCorrect: "Alternativa B. Em PIB nominal: EUA 1°, China 2° (~US$ 18 trilhões em 2024). Em PIB pela Paridade de Poder de Compra (PPP): China lidera desde ~2014. O PIB per capita chinês (~US$ 13.000) ainda é bem inferior ao dos países desenvolvidos.",
    explanationWrong: "Distinção importante: PIB nominal (em dólares) x PIB PPP (poder de compra interno). Os EUA ainda lideram em nominal. A China lidera em PPP. O yuan ganhou espaço (inclusão no SDR do FMI em 2016), mas o dólar ainda domina as reservas globais (~60%).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "geo_gl_c01_q05",
    contentId: "geo_gl_c01",
    statement: "Julgue: A Iniciativa Cinturão e Rota (Belt and Road Initiative — BRI), lançada pela China em 2013, consiste em um projeto de infraestrutura global que visa conectar Ásia, Europa e África através de rotas terrestres e marítimas, com financiamento chinês.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "A BRI (Nova Rota da Seda) foi lançada por Xi Jinping em 2013: Cinturão Econômico (terrestre, Ásia-Europa) e Rota Marítima da Seda (oceano Índico-Mar Mediterrâneo). Envolve mais de 140 países e trilhões de dólares em financiamento de infraestrutura.",
    explanationCorrect: "CERTO. A BRI (Belt and Road Initiative), também chamada de Nova Rota da Seda, foi lançada por Xi Jinping em 2013. Dois eixos: terrestre (Cinturão Econômico da Rota da Seda, Ásia-Europa) e marítimo (Rota Marítima do Séc. XXI, Oceano Índico). Foco: portos, ferrovias, energia, telecomunicações.",
    explanationWrong: "A BRI é a principal iniciativa de política externa da China sob Xi Jinping. Críticos apontam a 'diplomacia da armadilha da dívida' — países que não conseguem pagar perdem ativos estratégicos (ex: porto de Hambantota, Sri Lanka). O Brasil aderiu à BRI em 2023.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "geo_gl_c01_q06",
    contentId: "geo_gl_c01",
    statement: "O 'Quad' (Quadrilateral Security Dialogue) é uma aliança informal de segurança que inclui:",
    alternatives: [
      { letter: "A", text: "EUA, China, Índia e Rússia." },
      { letter: "B", text: "EUA, Austrália, Japão e Índia, com foco na segurança do Indo-Pacífico." },
      { letter: "C", text: "EUA, Reino Unido, Canadá e Austrália (aliança Five Eyes)." },
      { letter: "D", text: "EUA, Reino Unido e Austrália (AUKUS)." },
      { letter: "E", text: "Japão, Coreia do Sul, Austrália e Nova Zelândia." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Quad: EUA, Austrália, Japão e Índia — diálogo de segurança focado no Indo-Pacífico, visto como contrapeso à expansão naval chinesa. Five Eyes: EUA, UK, Canadá, Austrália, Nova Zelândia (inteligência). AUKUS: EUA, UK, Austrália (submarinos nucleares).",
    explanationCorrect: "Alternativa B. O Quad (Quadrilateral Security Dialogue) reúne EUA, Austrália, Japão e Índia. Criado em 2007 (Abe/Cheney), relançado em 2017. Foco: Indo-Pacífico Livre e Aberto, contraponto à influência chinesa no Mar do Sul da China e Oceano Índico.",
    explanationWrong: "Alianças recentes no Indo-Pacífico: Quad (EUA+Aus+Japão+Índia), AUKUS (EUA+UK+Aus, submarinos nucleares), Five Eyes (inteligência anglófona: EUA+UK+Canadá+Aus+NZ). O objetivo comum é o balanceamento da China na região.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 2 — Conflitos Contemporâneos (geo_gl_c02)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "geo_gl_c02_q01",
    contentId: "geo_gl_c02",
    statement: "Julgue: A invasão russa da Ucrânia em fevereiro de 2022 foi precedida pela anexação da Crimeia por parte da Rússia em 2014 e pelo conflito no Donbas, região leste ucraniana com população de fala russa.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "O conflito russo-ucraniano tem raízes em 2014: anexação da Crimeia após referendo controverso e início do conflito no Donbas (regiões de Donetsk e Luhansk), com separatistas pró-Rússia. A invasão em larga escala ocorreu em 24/02/2022.",
    explanationCorrect: "CERTO. Linha do tempo: 2014 — Euromaidã, queda de Yanukovich, anexação da Crimeia pela Rússia, início do conflito no Donbas. 2022 — invasão em larga escala (24/02). A Rússia alegou NATO-fobia e proteção de russos étnicos como justificativas.",
    explanationWrong: "O conflito Rússia-Ucrânia em 2022 não surgiu do nada: há um contexto desde 2014 com a Crimeia e o Donbas. A NATO e o processo de integração europeia da Ucrânia são fatores geopolíticos centrais no conflito.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "geo_gl_c02_q02",
    contentId: "geo_gl_c02",
    statement: "O conflito entre Israel e Hamas, que se intensificou com o ataque do Hamas em 7 de outubro de 2023, tem como contexto histórico:",
    alternatives: [
      { letter: "A", text: "A rivalidade entre Sunitas e Xiitas pelo controle do petróleo do Oriente Médio." },
      { letter: "B", text: "A disputa territorial na Faixa de Gaza e Cisjordânia, territórios palestinos ocupados desde a Guerra dos Seis Dias de 1967." },
      { letter: "C", text: "O conflito entre Turquia e Grécia pelo controle do Mar Egeu." },
      { letter: "D", text: "A questão do controle do Canal de Suez entre Egito e Israel." },
      { letter: "E", text: "A rivalidade secular entre os países árabes pelo controle de Jerusalém." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O conflito israelense-palestino: raízes na criação de Israel em 1948 (Nakba), Guerra dos Seis Dias (1967) com ocupação de Gaza, Cisjordânia e Golan. Hamas controla Gaza desde 2007. O ataque de 7/10/2023 foi o mais mortal contra judeus desde o Holocausto.",
    explanationCorrect: "Alternativa B. O cerne do conflito é territorial: a Faixa de Gaza e a Cisjordânia, territórios palestinos capturados por Israel na Guerra dos Seis Dias (1967). A solução dos dois Estados (Estado Palestino + Israel) é defendida pela ONU mas não implementada.",
    explanationWrong: "O conflito israelense-palestino envolve: território (1948/1967), status de Jerusalém (cidade santa para as três religiões abraâmicas), direito de retorno dos refugiados palestinos, e agora o bloqueio de Gaza. O Hamas é considerado organização terrorista pelos EUA e UE.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "geo_gl_c02_q03",
    contentId: "geo_gl_c02",
    statement: "Julgue: O Tribunal Penal Internacional (TPI), com sede em Haia, emitiu mandado de prisão contra Vladimir Putin em 2023, acusando-o de deportação ilegal de crianças ucranianas para a Rússia — crime de guerra sob o Estatuto de Roma.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Em março de 2023, o TPI emitiu mandados de prisão contra Vladimir Putin e Maria Lvova-Belova (Comissária para Direitos da Criança) pela deportação ilegal de crianças ucranianas. Foi a primeira vez que um mandado de prisão foi emitido contra um chefe de Estado de uma potência nuclear.",
    explanationCorrect: "CERTO. O TPI emitiu o mandado de prisão em 17 de março de 2023. A acusação é o crime de guerra de deportação ilegal de crianças ucranianas para o território russo. Os 124 países membros do TPI são obrigados a prender Putin se ele entrar em seus territórios.",
    explanationWrong: "O mandado de prisão do TPI contra Putin (2023) tem impacto geopolítico significativo: Putin não pode visitar os 124 países signatários do Estatuto de Roma sem risco de prisão. Rússia, EUA, China e Índia não são membros do TPI e não reconhecem sua jurisdição.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "geo_gl_c02_q04",
    contentId: "geo_gl_c02",
    statement: "Qual das afirmativas sobre as tensões no Mar do Sul da China está correta?",
    alternatives: [
      { letter: "A", text: "A China e os EUA compartilham o controle do Mar do Sul da China por acordo da ASEAN." },
      { letter: "B", text: "A China reivindica soberania sobre quase todo o Mar do Sul da China com base na 'linha dos nove traços', contestada por Vietnã, Filipinas, Malásia, Brunei e Taiwan." },
      { letter: "C", text: "O Tribunal Internacional do Mar reconheceu as reivindicações chinesas sobre o Mar do Sul da China em 2016." },
      { letter: "D", text: "O Mar do Sul da China não possui relevância estratégica, pois não há reservas de petróleo ou rotas comerciais importantes na região." },
      { letter: "E", text: "As Filipinas cederam suas reivindicações territoriais à China em 2023 por acordo bilateral." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A China usa a 'linha dos nove traços' para reivindicar ~90% do Mar do Sul da China, incluindo ilhas artificiais construídas. Em 2016, o Tribunal de Arbitragem da ONU (Filipinas vs. China) rejeitou as reivindicações — a China ignorou a decisão.",
    explanationCorrect: "Alternativa B. A 'linha dos nove traços' (nine-dash line) é a reivindicação territorial chinesa sobre quase todo o Mar do Sul da China, incluindo as Ilhas Spratly e Paracel. Vietnã, Filipinas, Malásia, Brunei e Taiwan têm reivindicações sobrepostas. Importância: 30% do comércio marítimo global passa pela região.",
    explanationWrong: "Em 2016, o Tribunal Permanente de Arbitragem (Haia) julgou procedente a reclamação filipina e declarou inválida a linha dos nove traços — a China recusou-se a participar do processo e ignorou a decisão. A construção de ilhas artificiais com bases militares agrava as tensões.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "geo_gl_c02_q05",
    contentId: "geo_gl_c02",
    statement: "Julgue: O Iêmen vive um conflito civil desde 2015, com o grupo Houthi (respaldado pelo Irã) em conflito com o governo reconhecido internacionalmente (apoiado pela Arábia Saudita e Emirados Árabes), gerando uma das maiores crises humanitárias do mundo.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "O conflito iemenita desde 2015 é um proxy war (guerra por procuração) entre Irã (Houthis) e Arábia Saudita/EAU (governo Mansur Hadi). Os Houthis também atacaram navios no Mar Vermelho em 2023-2024 em apoio ao Hamas, atingindo o tráfego marítimo global.",
    explanationCorrect: "CERTO. O Iêmen é um dos piores conflitos humanitários do século XXI: centenas de milhares de mortos, milhões de deslocados, crise de fome. É também um proxy war regional: Houthis (xiitas, apoio iraniano) vs. coalizão liderada pela Arábia Saudita (sunita). Em 2024, os Houthis passaram a atacar navios no Mar Vermelho.",
    explanationWrong: "O conflito iemenita ilustra a rivalidade sectária e geopolítica entre Irã (potência xiita) e Arábia Saudita (potência sunita) por influência no Oriente Médio. Em 2023-2024, os ataques Houthis ao tráfego marítimo no Mar Vermelho afetaram o comércio global.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "geo_gl_c02_q06",
    contentId: "geo_gl_c02",
    statement: "Em relação ao conflito russo-ucraniano, qual organização internacional foi acionada em 2022 para coordenar a resposta do Ocidente e expandiu-se com a adesão da Suécia e Finlândia?",
    alternatives: [
      { letter: "A", text: "ASEAN — Associação de Nações do Sudeste Asiático." },
      { letter: "B", text: "OEA — Organização dos Estados Americanos." },
      { letter: "C", text: "OTAN (NATO) — Organização do Tratado do Atlântico Norte." },
      { letter: "D", text: "SCO — Organização de Cooperação de Xangai." },
      { letter: "E", text: "OCS — Organização para a Cooperação e Segurança na Europa." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A OTAN (NATO) coordenou a resposta ocidental à invasão russa. A Finlândia aderiu em abril de 2023 (32° membro) e a Suécia em março de 2024 (33° membro), quebrando décadas de neutralidade — irônico resultado da invasão russa que pretendia impedir a expansão da OTAN.",
    explanationCorrect: "Alternativa C. A OTAN (Organização do Tratado do Atlântico Norte) expandiu-se como consequência direta da invasão russa. A Finlândia (32° membro, abril/2023) e a Suécia (33° membro, março/2024) aderiram, aumentando significativamente a fronteira OTAN-Rússia.",
    explanationWrong: "A invasão russa, cujo um dos objetivos declarados era impedir a expansão da OTAN, produziu o resultado oposto: a aliança fortaleceu-se e dois países historicamente neutros (Finlândia e Suécia) aderiram. A OTAN agora faz fronteira com a Rússia por mais de 1.300 km (Finlândia).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 3 — Segurança Cibernética Global e Guerra Híbrida (geo_gl_c03)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "geo_gl_c03_q01",
    contentId: "geo_gl_c03",
    statement: "Julgue: A 'guerra híbrida' é um conceito militar que combina operações convencionais com táticas não convencionais, incluindo ataques cibernéticos, desinformação, sabotagem e uso de proxies, dificultando a atribuição e a resposta.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Guerra híbrida (conceito popularizado após 2014): mistura de meios militares convencionais + guerra irregular + operações cibernéticas + desinformação/propaganda + pressão econômica + agentes proxy. Objetivo: criar ambiguidade e impedir resposta clara do adversário.",
    explanationCorrect: "CERTO. A guerra híbrida combina: forças convencionais, guerra irregular (guerrilha, proxy), ataques cibernéticos (infraestrutura crítica), desinformação (manipulação de opinião pública), e pressão econômica. A ambiguidade sobre a autoria é intencional, dificultando resposta da OTAN (cláusula do Artigo 5°).",
    explanationWrong: "Exemplos de guerra híbrida: interferência russa nas eleições de 2016 (EUA), ataques cibernéticos à Ucrânia, campanhas de desinformação via redes sociais. O ataque Stuxnet (EUA/Israel contra o programa nuclear iraniano) é considerado um ato pioneiro de guerra cibernética.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "geo_gl_c03_q02",
    contentId: "geo_gl_c03",
    statement: "Qual foi o significado geopolítico do ataque Stuxnet, descoberto em 2010?",
    alternatives: [
      { letter: "A", text: "Foi o primeiro ataque de ransomware em larga escala, afetando hospitais nos EUA." },
      { letter: "B", text: "Foi um worm sofisticado atribuído a EUA e Israel que danificou centrifugadoras do programa nuclear iraniano, marcando o início da era da guerra cibernética entre Estados." },
      { letter: "C", text: "Foi um ataque russo que derrubou a rede elétrica da Ucrânia em 2015." },
      { letter: "D", text: "Foi o ataque que comprometeu os dados do Escritório de Pessoal dos EUA (OPM) pela China." },
      { letter: "E", text: "Foi o malware que infectou sistemas de votação nas eleições americanas de 2016." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Stuxnet (2010): worm altamente sofisticado que atacou especificamente as centrifugadoras Siemens do programa de enriquecimento de urânio no Irã (Natanz). Atribuído a NSA (EUA) + Unidade 8200 (Israel). Considerado o primeiro ato de guerra cibernética entre Estados.",
    explanationCorrect: "Alternativa B. O Stuxnet foi um marco histórico: primeiro malware projetado especificamente para destruir infraestrutura física real (centrifugadoras de enriquecimento de urânio), não apenas para espionagem. Evidenciou que a guerra cibernética pode causar danos físicos equivalentes a ataques militares.",
    explanationWrong: "O Stuxnet foi um 'tiro certeiro' digital: atacou apenas os PLCs Siemens S7-315 controlando as centrifugadoras iranianas a uma velocidade específica. Atrasou o programa nuclear iraniano em anos. Revelou que armas cibernéticas de Estado existem e são eficazes.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "geo_gl_c03_q03",
    contentId: "geo_gl_c03",
    statement: "Julgue: A inteligência artificial (IA) representa uma nova dimensão geopolítica, com EUA e China competindo pelo domínio tecnológico em chips, modelos de linguagem e aplicações militares de IA.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "A corrida por IA tornou-se uma dimensão central da competição EUA-China: EUA restringiram exportação de chips avançados (NVIDIA H100/A100) para a China desde 2022; China investe massivamente em IA nacional (Baidu, Huawei, Cambricon). Quem dominar IA pode ter vantagem militar decisiva.",
    explanationCorrect: "CERTO. A disputa tecnológica EUA-China inclui: chips semicondutores (TSMC, ASML, NVIDIA), IA (ChatGPT/OpenAI vs DeepSeek/Baidu), 5G (Huawei vs Ericsson/Nokia), quantum computing. Em 2022-2024, os EUA impuseram restrições severas à exportação de chips avançados para a China.",
    explanationWrong: "Em 2024, a China lançou o DeepSeek-R1, modelo de IA competitivo com GPT-4 a custo muito menor, causando impacto nas bolsas americanas (queda da NVIDIA). Isso demonstra que a competição em IA tem implicações econômicas e militares imediatas.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "geo_gl_c03_q04",
    contentId: "geo_gl_c03",
    statement: "O conceito de 'infraestrutura crítica' em cibersegurança refere-se a:",
    alternatives: [
      { letter: "A", text: "Apenas as redes militares e governamentais de um país." },
      { letter: "B", text: "Sistemas cujo comprometimento pode ter impacto grave na saúde pública, segurança nacional, economia ou serviços essenciais, como energia elétrica, água, transporte e comunicações." },
      { letter: "C", text: "Somente as bolsas de valores e sistemas bancários que movimentam trilhões de dólares." },
      { letter: "D", text: "As redes de internet de alta velocidade que suportam o tráfego de dados globais." },
      { letter: "E", text: "Os servidores de grandes empresas de tecnologia como Google, Amazon e Microsoft." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Infraestrutura crítica: setores vitais para a função de uma nação — energia (elétrica, petróleo, gás), água e esgoto, transporte (aviação, ferrovias), comunicações (telecomunicações, internet), saúde, setor financeiro. Ataques a esses sistemas podem paralisar países.",
    explanationCorrect: "Alternativa B. Infraestrutura crítica inclui os sistemas fundamentais para o funcionamento da sociedade: energia, água, transporte, comunicações, saúde, setor financeiro, setor nuclear. Ataques a esses setores (como o ataque à Colonial Pipeline em 2021 nos EUA) têm impacto nacional imediato.",
    explanationWrong: "Exemplos de ataques a infraestrutura crítica: Colonial Pipeline (EUA, 2021 — combustível); rede elétrica ucraniana (2015/2016 — Sandworm/Rússia); sistema de água de Oldsmar, FL (2021 — tentativa de envenenar água). São alvos prioritários em conflitos híbridos.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "geo_gl_c03_q05",
    contentId: "geo_gl_c03",
    statement: "Julgue: A desinformação em escala global, potencializada pelas redes sociais e pela IA generativa (deepfakes, textos sintéticos), é considerada um instrumento de guerra híbrida capaz de influenciar eleições, polarizar sociedades e desestabilizar governos.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Operações de influência via desinformação: Cambridge Analytica (2016), Internet Research Agency russa nas eleições americanas, deepfakes de líderes políticos. A IA generativa (GPT, Sora) amplifica exponencialmente a capacidade de criar desinformação convincente.",
    explanationCorrect: "CERTO. A desinformação como arma geopolítica é uma realidade documentada: a Internet Research Agency russa criou conteúdo para interferir nas eleições americanas de 2016. IA generativa amplia o risco: deepfakes de líderes, notícias falsas em escala industrial, polarização intencional de sociedades.",
    explanationWrong: "O Manual de Tallinn (2017) da OTAN tenta definir regras para guerra cibernética/informacional. A desinformação é particularmente difícil de combater pois: viraliza mais rápido que a verdade, explora vieses cognitivos, é barata e tem atribuição difícil.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "geo_gl_c03_q06",
    contentId: "geo_gl_c03",
    statement: "A explosão dos cabos submarinos Nord Stream 1 e 2, no Mar Báltico em setembro de 2022, é relevante para a geopolítica energética porque:",
    alternatives: [
      { letter: "A", text: "Destruiu a principal rota de exportação de petróleo saudita para a Europa." },
      { letter: "B", text: "Danificou os gasodutos que transportavam gás natural russo para a Alemanha e Europa, revelando a vulnerabilidade das infraestruturas críticas submarinas." },
      { letter: "C", text: "Interrompeu os cabos de fibra óptica que conectavam Europa e América, derrubando a internet global." },
      { letter: "D", text: "Destruiu oleodutos que supriam petróleo norueguês para o Reino Unido." },
      { letter: "E", text: "Afetou o fornecimento de energia nuclear francesa para a Alemanha." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Os Nord Stream 1 e 2 eram gasodutos no leito do Mar Báltico que transportavam gás natural russo para a Alemanha. A explosão em setembro/2022 revelou a extrema vulnerabilidade de infraestruturas críticas submarinas — nenhum país assumiu a autoria publicamente.",
    explanationCorrect: "Alternativa B. Nord Stream 1 e 2: gasodutos russos no fundo do Mar Báltico, cruciais para o fornecimento de gás à Europa, especialmente Alemanha. A sabotagem subaquática (setembro/2022) demonstrou que infraestruturas críticas submarinas são vulneráveis e difíceis de proteger ou atribuir responsabilidade.",
    explanationWrong: "A sabotagem dos Nord Stream simbolizou a ruptura da dependência energética europeia do gás russo. A Europa acelerou a diversificação: GNL americano/qatari, energias renováveis, reconexão de terminais de GNL. A autoria ainda é controversa (Rússia? Ucrânia? outros?).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 4 — Blocos Econômicos (geo_gl_c04)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "geo_gl_c04_q01",
    contentId: "geo_gl_c04",
    statement: "Julgue: A União Europeia (UE) é o bloco econômico mais integrado do mundo, possuindo moeda única (euro), livre circulação de pessoas, bens, serviços e capitais, bem como estruturas de governança supranacional.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "A UE representa o estágio mais avançado de integração regional: mercado único (livre circulação de bens, serviços, capitais e pessoas), moeda única (euro, 20 dos 27 membros), parlamento e comissão supranacionais, tribunais, banco central (BCE).",
    explanationCorrect: "CERTO. A UE é a integração regional mais profunda do mundo: Mercado Único (4 liberdades: bens, serviços, capitais, pessoas), Zona Euro (moeda única para 20 dos 27 membros), Parlamento Europeu eleito diretamente, Comissão Europeia, Tribunal de Justiça da UE, Banco Central Europeu.",
    explanationWrong: "Níveis de integração econômica: Área de Livre Comércio (NAFTA/USMCA) → União Aduaneira (Mercosul parcial) → Mercado Comum (MERCOSUL meta, UE realidade) → União Econômica (UE) → União Monetária (Zona Euro). A UE chegou ao estágio mais alto.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "geo_gl_c04_q02",
    contentId: "geo_gl_c04",
    statement: "O MERCOSUL (Mercado Comum do Sul) tem como membros fundadores:",
    alternatives: [
      { letter: "A", text: "Brasil, Argentina, Uruguai, Paraguai e Venezuela." },
      { letter: "B", text: "Brasil, Argentina, Chile e Bolívia." },
      { letter: "C", text: "Brasil, Argentina, Uruguai e Paraguai." },
      { letter: "D", text: "Brasil, Argentina, Peru e Colômbia." },
      { letter: "E", text: "Todos os países da América do Sul." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Membros fundadores do Mercosul (Tratado de Assunção, 1991): Brasil, Argentina, Uruguai e Paraguai. A Venezuela foi membro pleno (2012-2016) mas foi suspensa. Bolívia e Chile são membros associados.",
    explanationCorrect: "Alternativa C. O Mercosul foi criado pelo Tratado de Assunção (26/03/1991) por Brasil, Argentina, Uruguai e Paraguai. A Venezuela foi admitida em 2012 e suspensa definitivamente em 2016 por violação da cláusula democrática. Bolívia tem processo de adesão em curso.",
    explanationWrong: "Membros plenos do Mercosul: Brasil, Argentina, Uruguai, Paraguai. Venezuela: suspensa. Membros associados: Chile, Bolívia, Peru, Colômbia, Equador, Guiana, Suriname. O acordo UE-Mercosul, negociado em 1999 e concluído em 2019, ainda aguarda ratificação.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "geo_gl_c04_q03",
    contentId: "geo_gl_c04",
    statement: "Julgue: O USMCA (Acordo Estados Unidos-México-Canadá), que substituiu o NAFTA em 2020, é um exemplo de acordo de livre comércio trilateral que elimina tarifas entre os três países membros da América do Norte.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "O USMCA (United States-Mexico-Canada Agreement), ou T-MEC no México / ACEUM no Canadá, substituiu o NAFTA em julho de 2020. Mantém a zona de livre comércio trilateral com atualizações: propriedade intelectual, comércio digital, regras de origem para automóveis.",
    explanationCorrect: "CERTO. O USMCA (firmado em 2018, em vigor desde 2020) substituiu o NAFTA (1994). É um acordo de livre comércio entre EUA, México e Canadá. Novidades em relação ao NAFTA: capítulo digital, proteção de dados, regras de origem mais rígidas para automóveis (75% de conteúdo regional).",
    explanationWrong: "NAFTA (1994) → USMCA (2020): renomeado e atualizado. A renegociação foi uma promessa de campanha de Trump (2016). O bloco EUA-México-Canadá é a maior zona de livre comércio em PIB combinado (~US$ 30 trilhões), superando a UE.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "geo_gl_c04_q04",
    contentId: "geo_gl_c04",
    statement: "A 'guerra comercial' entre EUA e China, intensificada a partir de 2018, envolveu principalmente:",
    alternatives: [
      { letter: "A", text: "Sanções militares e restrições de acesso a portos." },
      { letter: "B", text: "Imposição recíproca de tarifas sobre centenas de bilhões de dólares em produtos, além de restrições tecnológicas (Huawei, chips semicondutores)." },
      { letter: "C", text: "Embargo total do petróleo chinês pelo Ocidente." },
      { letter: "D", text: "Exclusão da China do sistema SWIFT de pagamentos internacionais." },
      { letter: "E", text: "Confisco de ativos chineses depositados em bancos americanos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A guerra comercial EUA-China (2018-presente) inclui: tarifas recíprocas (EUA: 25% sobre US$250bi de produtos chineses; China: retaliação), lista negra do Departamento de Comércio (Huawei, SMIC, ZTE), restrições à exportação de chips avançados para China.",
    explanationCorrect: "Alternativa B. A guerra comercial EUA-China envolve: tarifas bilionárias (Trump, 2018; mantidas por Biden), restrições tecnológicas (Huawei banida das redes 5G aliadas, embargo de chips avançados de 2022 e 2023), e disputas de propriedade intelectual. Biden expandiu as restrições de chips em 2023.",
    explanationWrong: "A guerra comercial EUA-China tem duas frentes: (1) Tarifas sobre produtos manufaturados (soja, aço, eletrônicos); (2) Guerra tecnológica: chips, 5G, IA. A exclusão do SWIFT foi usada contra a Rússia (2022), não a China. O objetivo americano é desacelerar o avanço tecnológico chinês.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "geo_gl_c04_q05",
    contentId: "geo_gl_c04",
    statement: "Julgue: O RCEP (Regional Comprehensive Economic Partnership), que entrou em vigor em 2022, é o maior bloco de livre comércio do mundo em termos de PIB combinado e população, reunindo China, Japão, Coreia do Sul, ASEAN, Austrália e Nova Zelândia.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "RCEP: firmado em novembro/2020, em vigor desde janeiro/2022. Inclui 15 países: 10 da ASEAN + China, Japão, Coreia do Sul, Austrália, Nova Zelândia. Representa ~30% do PIB mundial e ~2,2 bilhões de pessoas — maior zona de livre comércio do mundo.",
    explanationCorrect: "CERTO. O RCEP (Regional Comprehensive Economic Partnership) é historicamente o maior acordo de livre comércio: 15 países, ~30% do PIB global, ~30% do comércio mundial, ~2,2 bilhões de pessoas. É liderado de facto pela China e não inclui os EUA (que saíram do TPP em 2017).",
    explanationWrong: "O RCEP é relevante pois inclui pela primeira vez um acordo de livre comércio entre China, Japão e Coreia do Sul (antigas rivalidades históricas). A ausência dos EUA no RCEP e no CPTPP é vista como perda de influência americana no Indo-Pacífico.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "geo_gl_c04_q06",
    contentId: "geo_gl_c04",
    statement: "O Brexit (saída do Reino Unido da União Europeia), oficialmente concluído em 2021, teve como principal consequência imediata para a economia britânica:",
    alternatives: [
      { letter: "A", text: "O imediato crescimento do PIB britânico em 10% por recuperar a soberania aduaneira." },
      { letter: "B", text: "O fim das liberdades de circulação, criação de barreiras comerciais com a UE, impacto no setor financeiro de Londres e queda da libra esterlina." },
      { letter: "C", text: "A adesão imediata ao NAFTA/USMCA como alternativa comercial aos europeus." },
      { letter: "D", text: "O aumento do déficit comercial com os EUA que substituiu a UE como principal parceiro." },
      { letter: "E", text: "A expulsão do Reino Unido da OTAN por violação dos tratados europeus." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O Brexit gerou: fim da livre circulação (impacto em trabalhadores europeus no RU e britânicos na UE), fricções comerciais (alfândega, burocracia), saída de bancos de Londres para Amsterdã/Frankfurt, e desaceleração econômica. A libra caiu significativamente pós-referendo (2016).",
    explanationCorrect: "Alternativa B. O Brexit criou barreiras comerciais onde havia livre comércio, fim da livre circulação de pessoas, burocracia alfandegária, e migração de parte do setor financeiro de Londres para a UE. O Acordo de Comércio e Cooperação UE-UK (2020) mitigou parte dos danos, mas não os eliminou.",
    explanationWrong: "O Brexit foi aprovado no referendo de junho/2016 (52% a 48%) e concluído formalmente em 31/12/2020. As consequências incluíram: escassez de trabalhadores (principalmente agrícola e saúde), longas filas nas fronteiras, e debates sobre a reunificação irlandesa e independência escocesa.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 5 — Organismos Internacionais (geo_gl_c05)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "geo_gl_c05_q01",
    contentId: "geo_gl_c05",
    statement: "Julgue: O Conselho de Segurança da ONU tem cinco membros permanentes com poder de veto: EUA, Reino Unido, França, Rússia e China, que podem bloquear qualquer resolução sobre ameaças à paz e segurança internacionais.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "O Conselho de Segurança da ONU tem 15 membros: 5 permanentes (P5: EUA, RU, França, Rússia e China) com poder de veto + 10 não permanentes eleitos por 2 anos. Uma resolução é bloqueada se qualquer P5 votar contra.",
    explanationCorrect: "CERTO. Os P5 (Permanent Five) são os membros permanentes com poder de veto: EUA, Reino Unido, França, Rússia e China — refletindo o equilíbrio de poder de 1945. Qualquer P5 pode vetar uma resolução, o que paralisa o CSNU em conflitos que envolvam essas potências (como na Ucrânia e Gaza).",
    explanationWrong: "O poder de veto é uma das questões mais controversas da ONU: críticos argumentam que é um anacronismo de 1945 que impede ação em crises onde os P5 têm interesses. A Assembleia Geral (193 membros) não tem poder executivo — suas resoluções são recomendações.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "geo_gl_c05_q02",
    contentId: "geo_gl_c05",
    statement: "Qual é a função do Tribunal Penal Internacional (TPI) e em que ele se diferencia da Corte Internacional de Justiça (CIJ)?",
    alternatives: [
      { letter: "A", text: "TPI e CIJ são a mesma instituição com nomes diferentes." },
      { letter: "B", text: "O TPI julga indivíduos por crimes internacionais (genocídio, crimes de guerra, crimes contra a humanidade); a CIJ resolve disputas entre Estados." },
      { letter: "C", text: "O TPI resolve disputas comerciais entre países; a CIJ julga criminosos de guerra." },
      { letter: "D", text: "Ambos julgam indivíduos, mas em esferas diferentes: TPI para crimes cibernéticos e CIJ para crimes de guerra." },
      { letter: "E", text: "O TPI é órgão da ONU, enquanto a CIJ é independente com sede em Genebra." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "TPI (sede em Haia, Estatuto de Roma, 1998): corte criminal internacional permanente para julgar INDIVÍDUOS por genocídio, crimes de guerra, crimes contra a humanidade e crime de agressão. CIJ: órgão judicial da ONU para disputas entre ESTADOS.",
    explanationCorrect: "Alternativa B. TPI (Tribunal Penal Internacional): julga pessoas físicas por crimes internacionais — genocídio, crimes de guerra, crimes contra a humanidade, agressão. CIJ (Corte Internacional de Justiça): julga disputas entre Estados (ex: Nicarágua vs EUA, Qatar vs EAU). São instituições distintas, ambas em Haia.",
    explanationWrong: "TPI x CIJ: TPI = sujeito passivo é PESSOA FÍSICA (indivíduo). CIJ = sujeito é o ESTADO. TPI tem 124 estados-membros (EUA, Rússia e China não aderiram). CIJ é órgão principal da ONU (Capítulo XIV da Carta). Ambos ficam em Haia, Holanda.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "geo_gl_c05_q03",
    contentId: "geo_gl_c05",
    statement: "Julgue: A OTAN (Organização do Tratado do Atlântico Norte) é uma aliança militar fundada em 1949 cujo Artigo 5° estabelece que um ataque a qualquer membro será considerado ataque a todos os membros, obrigando resposta coletiva.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "A OTAN foi fundada em 1949 (Tratado de Washington). O Artigo 5° é a cláusula de defesa coletiva — foi invocado UMA VEZ na história, após o 11/09/2001 (EUA solicitou apoio dos aliados). Não obriga automaticamente resposta militar — cada membro decide como contribuir.",
    explanationCorrect: "CERTO. O Artigo 5° do Tratado de Washington (OTAN, 1949) é a cláusula de defesa coletiva. Primeiro e único acionamento: após o 11 de setembro de 2001, a pedido dos próprios EUA. No conflito Ucrânia-Rússia, a OTAN não acionou o Art. 5° pois a Ucrânia não é membro.",
    explanationWrong: "A OTAN foi criada como aliança ocidental frente à URSS (Guerra Fria). Após 1991, expandiu-se para o leste europeu (ex-países soviéticos). Rússia vê essa expansão como ameaça. O Art. 5° não obriga envio de tropas — cada membro decide sua contribuição ('o que julgar necessário').",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "geo_gl_c05_q04",
    contentId: "geo_gl_c05",
    statement: "O FMI (Fundo Monetário Internacional) e o Banco Mundial foram criados em:",
    alternatives: [
      { letter: "A", text: "1919, após a 1ª Guerra Mundial, para reconstruir a Europa." },
      { letter: "B", text: "1945-1946, como resultado dos Acordos de Bretton Woods (1944), para estabilizar o sistema financeiro internacional e financiar o desenvolvimento." },
      { letter: "C", text: "1991, após o fim da Guerra Fria, para apoiar a transição das economias soviéticas." },
      { letter: "D", text: "1969, como reação à crise do petróleo e necessidade de regular commodities." },
      { letter: "E", text: "1956, durante a Conferência de Bandung, como alternativa ao sistema financeiro ocidental." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Conferência de Bretton Woods (julho de 1944, New Hampshire, EUA): criou o FMI (estabilidade monetária, empréstimos a países em crise de balanço de pagamentos) e o Banco Mundial/BIRD (reconstrução e desenvolvimento). Também criou o padrão ouro-dólar (1944-1971).",
    explanationCorrect: "Alternativa B. As Instituições de Bretton Woods foram criadas em 1944 e operacionalizadas em 1945-1946. FMI: empréstimos de estabilização a países com crise cambial/fiscal + supervisão macroeconômica. Banco Mundial (BIRD): empréstimos para desenvolvimento e redução de pobreza. Ambos refletem o poder americano no pós-2ª Guerra.",
    explanationWrong: "Bretton Woods (1944) também criou o sistema de câmbio fixo dólar-ouro ($35/onça), que vigorou até 1971 quando Nixon suspendeu a conversibilidade (Nixon Shock). O FMI e o Banco Mundial sobreviveram e continuam como instituições centrais da governança econômica global.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "geo_gl_c05_q05",
    contentId: "geo_gl_c05",
    statement: "Julgue: A OEA (Organização dos Estados Americanos), criada em 1948, inclui todos os 35 países independentes das Américas, sendo Cuba o único que teve sua participação suspensa entre 1962 e 2009.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Cuba foi suspensa da OEA em 1962 (durante a crise dos mísseis/Guerra Fria) e readmitida em 2009, embora ainda não participe ativamente. A OEA tem 35 estados membros (todos países soberanos das Américas) — sede em Washington, D.C.",
    explanationCorrect: "CERTO. A OEA foi fundada em 1948 (Bogotá). Cuba foi suspensa em 1962 por pressão americana (conflito ideológico Guerra Fria/Misseis). Em 2009, a Assembleia Geral da OEA suspendeu a resolução de 1962, readmitindo Cuba formalmente, embora o país não participe das atividades.",
    explanationWrong: "A OEA tem 35 estados membros e é o principal fórum hemisférico para direitos humanos, democracia e segurança. A Comissão Interamericana de Direitos Humanos (CIDH) e a Corte Interamericana (ambas vinculadas à OEA) têm papel relevante na proteção de direitos na América Latina.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "geo_gl_c05_q06",
    contentId: "geo_gl_c05",
    statement: "A Organização Mundial do Comércio (OMC) tem como principal função:",
    alternatives: [
      { letter: "A", text: "Fixar tarifas alfandegárias uniformes para todos os países membros." },
      { letter: "B", text: "Criar uma moeda de reserva global alternativa ao dólar americano." },
      { letter: "C", text: "Fornecer um fórum para negociações comerciais multilaterais e resolver disputas comerciais entre países membros por meio de seu sistema de solução de controvérsias." },
      { letter: "D", text: "Subsidiar exportações de países em desenvolvimento para equilibrar o comércio global." },
      { letter: "E", text: "Regular os investimentos estrangeiros diretos e evitar monopólios globais." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A OMC (1995, sucessora do GATT) tem duas funções: (1) fórum para negociações multilaterais de redução de tarifas e barreiras ao comércio; (2) sistema de solução de controvérsias (DSB) para resolver disputas comerciais entre países membros. Ex: Brasil vs EUA (algodão), China vs EUA (tarifas).",
    explanationCorrect: "Alternativa C. A OMC (Geneva, 1995) substitui o GATT. Funções: ① negociações multilaterais (Rodadas: Doha, Uruguay) para reduzir tarifas/barreiras; ② DSB (Dispute Settlement Body) para arbitrar conflitos comerciais — membros podem apresentar queixas e receber decisões vinculantes.",
    explanationWrong: "A OMC não fixa tarifas — negocia sua redução. Não cria moedas. Seus princípios: não discriminação (Cláusula da Nação Mais Favorecida), reciprocidade, transparência. O Órgão de Solução de Controvérsias da OMC sofre desde 2019 com o bloqueio americano à nomeação de árbitros no Órgão de Apelação.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 6 — Questões Ambientais, Energia e Geopolítica do Clima (geo_gl_c06)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "geo_gl_c06_q01",
    contentId: "geo_gl_c06",
    statement: "Julgue: O Acordo de Paris (2015), no âmbito da UNFCCC, estabeleceu a meta de limitar o aquecimento global a 1,5°C–2°C acima dos níveis pré-industriais, com metas nacionais voluntárias (NDCs) de redução de emissões.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Acordo de Paris (COP21, dezembro/2015): meta de 1,5°C (ambiciosa) a 2°C (mínima) de aquecimento. NDCs (Nationally Determined Contributions): metas voluntárias de cada país, revisadas a cada 5 anos. EUA saíram em 2017 (Trump) e readeriam em 2021 (Biden).",
    explanationCorrect: "CERTO. O Acordo de Paris (COP21, Paris, dezembro/2015) é o principal marco do direito climático internacional. Metas: limitar aquecimento a 1,5°C ou no máximo 2°C em relação ao pré-industrial. NDCs são contribuições nacionais voluntárias — bottom-up, diferente do Protocolo de Kyoto (top-down).",
    explanationWrong: "Protocolo de Kyoto (1997): metas obrigatórias para países desenvolvidos — poucos ratificaram, EUA nunca ratificou. Acordo de Paris (2015): sistema voluntário/NDC — mais países aderiram, incluindo EUA (Obama), China e Índia. Os EUA saíram sob Trump e readeriram sob Biden.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "geo_gl_c06_q02",
    contentId: "geo_gl_c06",
    statement: "A geopolítica dos recursos energéticos é exemplificada pela importância estratégica do Estreito de Ormuz porque:",
    alternatives: [
      { letter: "A", text: "É o principal ponto de passagem de carvão mineral australiano para a Ásia." },
      { letter: "B", text: "Cerca de 20% do petróleo negociado globalmente e 30% do GNL passam por ele, controlado entre Irã e Omã, sendo um ponto de estrangulamento crítico." },
      { letter: "C", text: "É onde estão localizadas as maiores reservas de terras raras do mundo, disputadas por China e EUA." },
      { letter: "D", text: "É a principal rota de cabo submarino de fibra óptica entre Europa e Ásia." },
      { letter: "E", text: "Conecta o Oceano Atlântico ao Mediterrâneo, sendo vital para o comércio europeu." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Estreito de Ormuz: estreito entre Irã e Omã (Golfo Pérsico → Golfo de Omã → Oceano Índico). ~20% do petróleo mundial e ~30% do GNL global passam por aqui. Uma crise com Irã pode fechar o estreito, causando choque global de energia.",
    explanationCorrect: "Alternativa B. O Estreito de Ormuz é o mais importante ponto de estrangulamento (chokepoint) energético do mundo. Irã tem repetidamente ameaçado fechá-lo como resposta a sanções. Os países exportadores: Arábia Saudita, Emirados, Kuwait, Qatar e Iraque dependem do estreito para exportar petróleo/gás.",
    explanationWrong: "Pontos de estrangulamento marítimos críticos: Estreito de Ormuz (petróleo do Golfo Pérsico), Canal de Suez (comércio Europa-Ásia), Estreito de Malaca (energia para China/Japão/Coreia), Estreito de Hormuz, Canal do Panamá. Bloqueio de qualquer um causa disruption global.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "geo_gl_c06_q03",
    contentId: "geo_gl_c06",
    statement: "Julgue: O degelo do Ártico, consequência das mudanças climáticas, tem implicações geopolíticas porque abre novas rotas marítimas (Passagem do Noroeste e Rota do Mar do Norte) e possibilita acesso a reservas de petróleo, gás e minerais antes inacessíveis.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "O degelo ártico é tanto consequência climática quanto oportunidade geopolítica: novas rotas marítimas (Rota do Mar do Norte reduz em ~40% a distância Europa-Ásia vs. Canal de Suez) e acesso a reservas estimadas em 30% do gás natural e 13% do petróleo não descobertos do mundo.",
    explanationCorrect: "CERTO. O Ártico aquece 2-3x mais rápido que a média global. Consequências geopolíticas: (1) Passagem do Noroeste (Canadá) e Rota do Mar do Norte (Rússia) tornam-se navegáveis; (2) Reservas de hidrocarbonetos e minerais acessíveis; (3) Disputa por soberania (Rússia, Canadá, Dinamarca/Groenlândia, EUA, Noruega).",
    explanationWrong: "A corrida pelo Ártico envolve: Rússia (reivindica extensa plataforma continental e investe em quebra-gelos nucleares), Canadá (Passagem do Noroeste), Dinamarca (via Groenlândia), EUA (Alasca), Noruega. China se autointitula 'Estado quase-ártico' e tem interesses na região.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "geo_gl_c06_q04",
    contentId: "geo_gl_c06",
    statement: "As 'terras raras' (rare earth elements) são estrategicamente importantes porque:",
    alternatives: [
      { letter: "A", text: "São usadas como combustível em usinas nucleares de última geração." },
      { letter: "B", text: "São essenciais para a fabricação de tecnologias de ponta como smartphones, turbinas eólicas, veículos elétricos, lasers militares e mísseis guiados, e a China controla ~60% da produção global." },
      { letter: "C", text: "São a principal fonte de geração de energia renovável substituindo o petróleo." },
      { letter: "D", text: "São utilizadas como lastro para as moedas dos países do BRICS na proposta de desdolarização." },
      { letter: "E", text: "São depósitos de carbono usados para compensar emissões de CO2 por países industrializados." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Terras raras (17 elementos como neodímio, lantânio, disprósio): essenciais para imãs de turbinas eólicas e motores elétricos, baterias, chips, armas de precisão, lasers. China produz ~60% e processa ~85% do total mundial — controle geopolítico crítico.",
    explanationCorrect: "Alternativa B. Terras raras são o 'petróleo do séc. XXI': 17 elementos essenciais para tecnologias verdes (turbinas, EVs) e militares (mísseis, lasers, drones). China domina produção e processamento. EUA, Europa e Austrália tentam desenvolver cadeias alternativas por segurança nacional.",
    explanationWrong: "A dependência ocidental de terras raras chinesas é uma vulnerabilidade estratégica. Em 2010, a China restringiu exportações para o Japão durante disputa territorial (Ilhas Senkaku). Em 2023, a China proibiu exportação de gálio e germânio (usados em semicondutores) como retaliação a sanções americanas de chips.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "geo_gl_c06_q05",
    contentId: "geo_gl_c06",
    statement: "Julgue: A transição energética global, impulsionada pela necessidade de reduzir emissões de CO2, está aumentando a demanda por minerais como lítio, cobalto e níquel — utilizados em baterias para veículos elétricos — criando novas dependências geopolíticas.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "A transição para energia limpa cria novas dependências: lítio (Triângulo do Lítio: Bolívia-Argentina-Chile controla ~60% das reservas), cobalto (70% na República Democrática do Congo), níquel (Indonésia, Rússia, Filipinas). De petróleo para minerais críticos.",
    explanationCorrect: "CERTO. A transição energética troca dependências: do petróleo (Golfo Pérsico, Rússia) para minerais críticos (lítio na América do Sul, cobalto no Congo, níquel na Indonésia). O Triângulo do Lítio (Bolívia, Argentina, Chile) é estratégico para a produção de baterias de VEs.",
    explanationWrong: "Minerais críticos para a transição: Lítio (baterias) → Triângulo do Lítio (Bolívia, Argentina, Chile). Cobalto → Congo (DRC, 70%). Cobre (condutores) → Chile, Peru. Níquel (baterias NMC) → Indonésia. A China processa grande parte desses minerais, criando nova dependência estratégica.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "geo_gl_c06_q06",
    contentId: "geo_gl_c06",
    statement: "O conceito de 'justiça climática' (climate justice), central nas negociações da COP, refere-se principalmente à:",
    alternatives: [
      { letter: "A", text: "Criação de tribunais internacionais para processar países que não cumprem metas de emissão." },
      { letter: "B", text: "Reivindicação de que países historicamente mais responsáveis pelo acúmulo de GEE (industrializados) devem apoiar financeiramente os países mais vulneráveis (em desenvolvimento) nos custos de adaptação e perdas e danos." },
      { letter: "C", text: "Distribuição igualitária das reservas de petróleo entre todos os países do mundo." },
      { letter: "D", text: "Proibição de exportação de tecnologias de energia fóssil para países em desenvolvimento." },
      { letter: "E", text: "Igualdade na distribuição das estações do ano entre os hemisférios Norte e Sul." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Justiça climática: países em desenvolvimento emitem pouco mas sofrem mais os impactos climáticos (ilhas do Pacífico, Bangladesh, Sahel). Na COP27 (Egito, 2022), foi estabelecido o fundo 'Loss and Damage' — compensação pelos países ricos aos mais vulneráveis pelos danos climáticos.",
    explanationCorrect: "Alternativa B. Justiça climática baseia-se no princípio das 'responsabilidades comuns, porém diferenciadas' (UNFCCC): países industrializados causaram o acúmulo histórico de GEE e devem arcar com mais custo da transição. Na COP27, criou-se o fundo Loss and Damage. Na COP28 (Dubai), debateu-se o phase-out de combustíveis fósseis.",
    explanationWrong: "As COPs são anuais: COP26=Glasgow (2021), COP27=Sharm el-Sheikh/Egito (2022, Loss & Damage), COP28=Dubai/EAU (2023, primeiro inventário global do Acordo de Paris). Os países em desenvolvimento (G77+China) reivindicam financiamento climático de US$ 100 bilhões/ano (promessa de 2009 não cumprida).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
];

// ─── MAIN ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🚀 Seed R57 — Densificação: Geopolítica Mundial (geo_gl_c01–c06)\n");

  const atomIds = ["geo_gl_c01", "geo_gl_c02", "geo_gl_c03", "geo_gl_c04", "geo_gl_c05", "geo_gl_c06"];
  const foundAtoms = new Set<string>();

  for (const atomId of atomIds) {
    const rows = await db.execute(sql`SELECT id FROM "Content" WHERE id = ${atomId} LIMIT 1`) as any[];
    if (rows.length === 0) {
      console.warn(`  ⚠️  AVISO: Átomo NÃO encontrado: ${atomId} — execute seed-geopolitica-r34.ts primeiro`);
    } else {
      foundAtoms.add(atomId);
    }
  }

  if (foundAtoms.size === 0) {
    console.error("\n❌ Nenhum átomo encontrado. Abortando.");
    process.exit(1);
  }

  let inserted = 0;
  let skipped = 0;

  for (const q of questions) {
    if (!foundAtoms.has(q.contentId)) {
      console.warn(`  ⚠️  Conteúdo não encontrado para questão ${q.id} — pulando`);
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
      SELECT "subjectId", "topicId" FROM "Content" WHERE id = ${q.contentId} LIMIT 1
    `) as any[];

    if (!contentRows[0]) {
      console.warn(`  ⚠️  Falha ao buscar subjectId/topicId para ${q.contentId} — pulando ${q.id}`);
      skipped++;
      continue;
    }

    const { subjectId, topicId } = contentRows[0];
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
        ${subjectId}, ${topicId}, ${q.contentId},
        true, 0, NOW(), NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `);

    console.log(`  ✅ ${q.id} [${q.difficulty}] ${q.questionType === "CERTO_ERRADO" ? "CE" : "ME"} → ${q.contentId}`);
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
