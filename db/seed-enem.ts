/**
 * Script para adicionar ENEM ao sistema
 *
 * Cria:
 * - Concurso ENEM (ordem 99, no final da lista)
 * - Cargo ENEM_GERAL
 * - Subjects faltantes (REDACAO, BIOLOGIA, FILOSOFIA, SOCIOLOGIA, LITERATURA)
 * - Matérias para ENEM_GERAL com pesos baseados na frequência
 * - Conteúdos básicos para os novos subjects
 */

import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";
import { randomBytes } from "crypto";

// Gerar ID no formato CUID-like
function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = randomBytes(8).toString("hex");
  return `c${timestamp}${randomPart}`.slice(0, 25);
}

// Novos Subjects necessários para ENEM
const NEW_SUBJECTS = [
  {
    name: "REDACAO",
    displayName: "Redação",
    category: "LINGUAGENS",
    sortOrder: 0, // Primeiro por ser mais importante
  },
  {
    name: "BIOLOGIA",
    displayName: "Biologia",
    category: "CIENCIAS_NATUREZA",
    sortOrder: 1,
  },
  {
    name: "FILOSOFIA",
    displayName: "Filosofia",
    category: "CIENCIAS_HUMANAS",
    sortOrder: 3,
  },
  {
    name: "SOCIOLOGIA",
    displayName: "Sociologia",
    category: "CIENCIAS_HUMANAS",
    sortOrder: 4,
  },
  {
    name: "LITERATURA",
    displayName: "Literatura",
    category: "LINGUAGENS",
    sortOrder: 3,
  },
];

// Matérias do ENEM com pesos (baseado na frequência e importância)
const ENEM_MATERIAS = [
  { nome: "Redação", codigo: "REDACAO", peso: 5, ordem: 1 },
  { nome: "Matemática", codigo: "MATEMATICA", peso: 4, ordem: 2 },
  { nome: "Língua Portuguesa", codigo: "PORTUGUES", peso: 4, ordem: 3 },
  { nome: "Biologia", codigo: "BIOLOGIA", peso: 3, ordem: 4 },
  { nome: "Física", codigo: "FISICA", peso: 3, ordem: 5 },
  { nome: "Química", codigo: "QUIMICA", peso: 3, ordem: 6 },
  { nome: "História", codigo: "HISTORIA", peso: 3, ordem: 7 },
  { nome: "Geografia", codigo: "GEOGRAFIA", peso: 3, ordem: 8 },
  { nome: "Filosofia", codigo: "FILOSOFIA", peso: 2, ordem: 9 },
  { nome: "Sociologia", codigo: "SOCIOLOGIA", peso: 2, ordem: 10 },
  { nome: "Literatura", codigo: "LITERATURA", peso: 2, ordem: 11 },
  { nome: "Inglês", codigo: "INGLES", peso: 2, ordem: 12 },
];

// Conteúdos para os novos subjects
const NEW_CONTENTS: Record<string, { title: string; textContent: string; difficulty: string }[]> = {
  REDACAO: [
    { title: "Estrutura da Redação ENEM", textContent: "A redação do ENEM segue o modelo dissertativo-argumentativo. Estrutura: Introdução (apresentação do tema e tese), Desenvolvimento (2 a 3 parágrafos com argumentos e exemplos) e Conclusão (retomada da tese e proposta de intervenção). A proposta de intervenção deve ser detalhada, com agente, ação, meio, finalidade e detalhamento.", difficulty: "MEDIO" },
    { title: "Competência 1: Norma Culta", textContent: "A Competência 1 avalia o domínio da norma culta da língua portuguesa. Inclui: ortografia, acentuação, concordância verbal e nominal, regência, pontuação, uso de pronomes, crase. Erros graves (como desvios de grafia que comprometem a compreensão) podem zerar esta competência. Pratique revisão cuidadosa.", difficulty: "FACIL" },
    { title: "Competência 2: Compreensão do Tema", textContent: "A Competência 2 avalia se o candidato compreendeu a proposta e desenvolveu o tema dentro dos limites estruturais do texto dissertativo-argumentativo. Tangenciar o tema (fugir parcialmente) reduz a nota. Fuga total ao tema resulta em zero na redação inteira. Leia atentamente os textos motivadores.", difficulty: "MEDIO" },
    { title: "Competência 3: Argumentação", textContent: "A Competência 3 avalia a capacidade de selecionar, relacionar, organizar e interpretar informações para defender um ponto de vista. Use dados estatísticos, citações, exemplos históricos, referências filosóficas. Evite argumentos de senso comum. Estabeleça relação clara entre argumentos e tese.", difficulty: "MEDIO" },
    { title: "Competência 4: Coesão Textual", textContent: "A Competência 4 avalia o uso de mecanismos linguísticos para construir a argumentação. Conectivos: além disso, portanto, entretanto, assim, dessa forma. Referenciação: pronomes, sinônimos, hiperônimos. Evite repetições e frases soltas. Cada parágrafo deve se conectar ao anterior e ao seguinte.", difficulty: "MEDIO" },
    { title: "Competência 5: Proposta de Intervenção", textContent: "A Competência 5 avalia a proposta de intervenção para o problema. Deve conter 5 elementos: AGENTE (quem faz), AÇÃO (o que fazer), MEIO/MODO (como fazer), FINALIDADE (para quê) e DETALHAMENTO (de qualquer elemento). Deve respeitar direitos humanos. Seja específico e viável.", difficulty: "DIFICIL" },
    { title: "Temas Recorrentes ENEM", textContent: "Temas frequentes no ENEM: meio ambiente e sustentabilidade, tecnologia e sociedade, saúde pública, educação, violência, direitos de minorias, mobilidade urbana, cultura e identidade nacional. Acompanhe notícias de relevância social. O tema 2024 foi 'Desafios para a valorização da herança africana no Brasil'.", difficulty: "FACIL" },
    { title: "Repertório Sociocultural", textContent: "Repertório sociocultural são conhecimentos que enriquecem a argumentação: citações de filósofos (Kant, Rousseau, Bauman), dados do IBGE/ONU, referências históricas, obras literárias, filmes, séries com crítica social. O repertório deve ser pertinente e bem articulado ao argumento, não apenas 'jogado' no texto.", difficulty: "MEDIO" },
    { title: "Erros que Zeram a Redação", textContent: "Situações que resultam em nota zero: fuga total ao tema, não atender ao tipo textual (dissertativo-argumentativo), texto com até 7 linhas, cópia dos textos motivadores, impropérios/desenhos, texto em língua estrangeira, folha em branco, desrespeito aos direitos humanos na proposta de intervenção.", difficulty: "FACIL" },
    { title: "Dicas para Nota 1000", textContent: "Para alcançar nota máxima: leia muito e pratique semanalmente, estude redações nota 1000 anteriores, domine a estrutura, use repertório variado e pertinente, faça proposta de intervenção completa (5 elementos), revise ortografia e coesão, administre o tempo (50-60 min), escreva de 28 a 30 linhas.", difficulty: "DIFICIL" },
  ],
  BIOLOGIA: [
    { title: "Ecologia: Cadeias e Teias Alimentares", textContent: "Cadeia alimentar é a sequência linear de organismos onde um serve de alimento para o outro. Produtores (autótrofos) → Consumidores primários (herbívoros) → Consumidores secundários (carnívoros) → Decompositores. Teia alimentar é o conjunto de cadeias interligadas. A energia diminui a cada nível trófico (regra dos 10%).", difficulty: "FACIL" },
    { title: "Ecologia: Ciclos Biogeoquímicos", textContent: "Ciclos biogeoquímicos são as trajetórias dos elementos químicos na natureza. Ciclo do carbono: fotossíntese (absorção) e respiração/decomposição (liberação). Ciclo do nitrogênio: fixação por bactérias, nitrificação, desnitrificação. Ciclo da água: evaporação, condensação, precipitação. O desequilíbrio causa problemas como efeito estufa.", difficulty: "MEDIO" },
    { title: "Genética: Leis de Mendel", textContent: "1ª Lei (Segregação): cada característica é determinada por um par de fatores (alelos) que se separam na formação dos gametas. 2ª Lei (Segregação Independente): os fatores para duas ou mais características segregam-se independentemente. Dominância: AA ou Aa = fenótipo dominante; aa = recessivo.", difficulty: "MEDIO" },
    { title: "Genética Molecular: DNA e RNA", textContent: "DNA (ácido desoxirribonucleico): dupla hélice, bases A-T e C-G, armazena informação genética. RNA (ácido ribonucleico): fita simples, bases A-U e C-G, participa da síntese proteica. Replicação: DNA → DNA. Transcrição: DNA → RNA. Tradução: RNA → Proteína. Código genético: trincas de bases = aminoácidos.", difficulty: "DIFICIL" },
    { title: "Biotecnologia: Engenharia Genética", textContent: "Engenharia genética manipula o DNA para obter organismos com características desejadas. Transgênicos (OGMs): recebem genes de outras espécies. Clonagem: cópia genética idêntica. Terapia gênica: correção de genes defeituosos. CRISPR: técnica de edição genética precisa. Debates éticos envolvem riscos ambientais e limites da manipulação.", difficulty: "MEDIO" },
    { title: "Citologia: Estrutura Celular", textContent: "Célula procarionte (bactérias): sem núcleo definido, DNA circular no nucleoide. Célula eucarionte: núcleo com carioteca, organelas membranosas. Organelas principais: mitocôndria (respiração celular), ribossomos (síntese proteica), retículo endoplasmático, complexo de Golgi, lisossomos. Célula vegetal: parede celular, cloroplastos, vacúolo central.", difficulty: "MEDIO" },
    { title: "Fisiologia Humana: Sistema Circulatório", textContent: "Coração: 4 câmaras (2 átrios, 2 ventrículos), circulação dupla e completa. Pequena circulação: coração → pulmões → coração (hematose). Grande circulação: coração → corpo → coração. Sangue arterial: rico em O₂. Sangue venoso: rico em CO₂. Artérias saem do coração; veias chegam ao coração.", difficulty: "MEDIO" },
    { title: "Evolução: Teorias Evolutivas", textContent: "Lamarckismo: uso e desuso + herança de caracteres adquiridos (incorreto). Darwinismo: seleção natural sobre variações aleatórias. Neodarwinismo: seleção natural + mutações + recombinação gênica. Evidências: fósseis, anatomia comparada (homologia/analogia), embriologia, biologia molecular. Especiação: formação de novas espécies por isolamento.", difficulty: "MEDIO" },
    { title: "Ecologia: Impactos Ambientais", textContent: "Poluição do ar: efeito estufa (CO₂), chuva ácida (SO₂, NOₓ), inversão térmica. Poluição da água: eutrofização (excesso de nutrientes), magnificação trófica (acúmulo de poluentes). Desmatamento: perda de biodiversidade, erosão, alteração climática. Soluções: desenvolvimento sustentável, energia limpa, reciclagem, legislação ambiental.", difficulty: "MEDIO" },
    { title: "Saúde: Doenças e Prevenção", textContent: "Doenças bacterianas: tuberculose, cólera, tétano (prevenção: vacinas, saneamento). Doenças virais: dengue, COVID-19, gripe (prevenção: vacinas, controle de vetores). Parasitoses: esquistossomose, malária, doença de Chagas (prevenção: saneamento, controle de vetores). Vacinas estimulam imunidade ativa; soros fornecem anticorpos prontos (imunidade passiva).", difficulty: "FACIL" },
  ],
  FILOSOFIA: [
    { title: "Filosofia Antiga: Sócrates, Platão e Aristóteles", textContent: "Sócrates: maiêutica (parto das ideias), 'Só sei que nada sei', busca da verdade pelo diálogo. Platão: Teoria das Ideias (mundo sensível vs. mundo inteligível), Alegoria da Caverna, República. Aristóteles: lógica formal, ética das virtudes (meio-termo), política (homem como animal político), metafísica (ser enquanto ser).", difficulty: "MEDIO" },
    { title: "Ética: Conceitos Fundamentais", textContent: "Ética: reflexão filosófica sobre a moral. Moral: conjunto de normas de uma sociedade. Ética deontológica (Kant): ação correta segue o dever, imperativo categórico ('Age apenas segundo uma máxima que possas querer que se torne lei universal'). Ética utilitarista (Bentham, Mill): ação correta maximiza a felicidade geral.", difficulty: "MEDIO" },
    { title: "Filosofia Política: Contratualismo", textContent: "Hobbes: estado de natureza é guerra de todos contra todos; contrato social cria Estado absoluto para garantir segurança. Locke: estado de natureza tem direitos naturais (vida, liberdade, propriedade); contrato cria Estado limitado; direito de resistência. Rousseau: homem nasce bom, sociedade corrompe; vontade geral; soberania popular.", difficulty: "MEDIO" },
    { title: "Teoria do Conhecimento: Racionalismo e Empirismo", textContent: "Racionalismo (Descartes): conhecimento vem da razão; ideias inatas; método da dúvida; 'Penso, logo existo'. Empirismo (Locke, Hume): conhecimento vem da experiência sensível; mente como 'tábula rasa'. Kant: síntese - conhecimento resulta da experiência organizada por categorias a priori da razão.", difficulty: "DIFICIL" },
    { title: "Filosofia Contemporânea: Existencialismo", textContent: "Sartre: 'A existência precede a essência' - não há natureza humana predefinida; somos condenados à liberdade; má-fé é negar a própria liberdade; engajamento. Heidegger: Dasein (ser-aí), autenticidade vs. inautenticidade. Camus: o absurdo da existência, revolta como resposta.", difficulty: "DIFICIL" },
    { title: "Escola de Frankfurt: Teoria Crítica", textContent: "Adorno e Horkheimer: indústria cultural padroniza e aliena; razão instrumental domina a natureza e o homem. Marcuse: sociedade unidimensional reprime alternativas. Habermas: razão comunicativa como alternativa; esfera pública e democracia deliberativa. Crítica à sociedade capitalista e à cultura de massas.", difficulty: "DIFICIL" },
    { title: "Filosofia da Ciência", textContent: "Positivismo (Comte): só o conhecimento científico é válido. Popper: falsificacionismo - teoria científica deve ser falseável. Kuhn: paradigmas e revoluções científicas; ciência normal vs. ciência revolucionária. Feyerabend: anarquismo epistemológico ('tudo vale'). Debate sobre neutralidade e objetividade da ciência.", difficulty: "MEDIO" },
    { title: "Mito e Filosofia", textContent: "Mito: narrativa simbólica que explica origens e fenômenos; pensamento mágico-religioso. Filosofia: surge na Grécia (séc. VI a.C.); busca explicações racionais (logos); Tales de Mileto (primeiro filósofo); physis (natureza) como objeto. Passagem do mito ao logos não é ruptura total, mas transformação gradual.", difficulty: "FACIL" },
    { title: "Direitos Humanos e Cidadania", textContent: "Direitos naturais (jusnaturalismo): anteriores ao Estado, inerentes à condição humana. Declaração dos Direitos do Homem (1789): liberdade, igualdade, propriedade. Declaração Universal (ONU, 1948): direitos civis, políticos, sociais, econômicos, culturais. Gerações de direitos: 1ª (liberdades), 2ª (sociais), 3ª (coletivos/difusos).", difficulty: "FACIL" },
    { title: "Ideologia e Alienação", textContent: "Marx: ideologia é visão de mundo da classe dominante apresentada como universal; oculta contradições sociais. Alienação: trabalhador separado do produto, do processo, de si mesmo e dos outros. Gramsci: hegemonia cultural. Althusser: aparelhos ideológicos do Estado (escola, mídia, igreja). Ideologia naturaliza o que é histórico.", difficulty: "MEDIO" },
  ],
  SOCIOLOGIA: [
    { title: "Clássicos da Sociologia: Durkheim", textContent: "Émile Durkheim (1858-1917): fundador da sociologia como ciência. Fato social: exterior, coercitivo, geral. Consciência coletiva: conjunto de crenças e sentimentos comuns. Solidariedade mecânica (sociedades simples) vs. orgânica (sociedades complexas). Anomia: ausência de normas. Obra: 'As Regras do Método Sociológico', 'O Suicídio'.", difficulty: "MEDIO" },
    { title: "Clássicos da Sociologia: Weber", textContent: "Max Weber (1864-1920): sociologia compreensiva. Ação social: comportamento com sentido orientado pelo outro. Tipos de ação: tradicional, afetiva, racional com relação a valores, racional com relação a fins. Tipos ideais: construções teóricas. Burocracia: dominação racional-legal. Ética protestante e espírito do capitalismo. Desencantamento do mundo.", difficulty: "MEDIO" },
    { title: "Clássicos da Sociologia: Marx", textContent: "Karl Marx (1818-1883): materialismo histórico e dialético. Modo de produção: forças produtivas + relações de produção. Luta de classes: motor da história. Mais-valia: diferença entre valor produzido e salário pago. Infraestrutura (economia) determina superestrutura (política, cultura, ideologia). Obra: 'O Capital', 'Manifesto Comunista'.", difficulty: "MEDIO" },
    { title: "Estratificação e Desigualdade Social", textContent: "Estratificação: divisão da sociedade em camadas. Classes sociais (Marx): posição nas relações de produção. Status (Weber): prestígio social. Mobilidade social: ascendente ou descendente, intergeracional ou intrageracional. Desigualdade no Brasil: índice de Gini elevado, concentração de renda, desigualdade racial e de gênero.", difficulty: "MEDIO" },
    { title: "Cultura e Identidade", textContent: "Cultura: conjunto de valores, crenças, práticas de um grupo. Etnocentrismo: julgar outras culturas pelos próprios valores. Relativismo cultural: compreender culturas em seus próprios termos. Indústria cultural (Adorno): padronização e mercantilização da cultura. Identidade: construção social, múltipla, em transformação.", difficulty: "FACIL" },
    { title: "Trabalho e Sociedade", textContent: "Trabalho: atividade transformadora; central na vida social. Fordismo: produção em massa, linha de montagem, consumo de massa. Toyotismo: produção flexível, just in time, trabalhador polivalente. Precarização: terceirização, uberização, informalidade. Desemprego estrutural: causado por mudanças tecnológicas e econômicas.", difficulty: "MEDIO" },
    { title: "Movimentos Sociais", textContent: "Movimentos sociais: ações coletivas que buscam mudança ou resistência. Movimentos tradicionais: operário, camponês. Novos movimentos sociais: feminista, negro, LGBTQIA+, ambientalista, indígena. Características: identidade coletiva, adversário definido, projeto de sociedade. No Brasil: MST, movimento negro, feminismo, indígenas.", difficulty: "FACIL" },
    { title: "Estado e Poder", textContent: "Estado: instituição com monopólio legítimo da violência (Weber). Democracia: governo do povo; direta ou representativa. Cidadania: direitos civis, políticos e sociais (Marshall). Poder simbólico (Bourdieu): dominação através da cultura. Biopolítica (Foucault): poder sobre a vida das populações. Estado de bem-estar social vs. neoliberalismo.", difficulty: "MEDIO" },
    { title: "Globalização", textContent: "Globalização: integração econômica, cultural e política mundial. Dimensões: econômica (capital transnacional), cultural (homogeneização e hibridismo), política (organismos internacionais). Críticas: aumento da desigualdade, perda de soberania, homogeneização cultural. Antiglobalização: movimentos de resistência. Glocalização: adaptação local do global.", difficulty: "FACIL" },
    { title: "Violência e Sociedade", textContent: "Violência física: uso da força para causar dano. Violência simbólica (Bourdieu): imposição de significados como legítimos. Violência estrutural: produzida pelas estruturas sociais (pobreza, desigualdade). Violência de gênero: feminicídio, assédio. Violência racial: racismo estrutural. Violência urbana: relação com desigualdade e segregação espacial.", difficulty: "MEDIO" },
  ],
  LITERATURA: [
    { title: "Movimentos Literários: Trovadorismo e Humanismo", textContent: "Trovadorismo (séc. XII-XIV): poesia oral, cantigas de amor (eu-lírico masculino sofre por dama), cantigas de amigo (eu-lírico feminino), cantigas de escárnio e maldizer. Humanismo (séc. XV): transição medieval-renascentista; prosa de Fernão Lopes (crônicas históricas); teatro de Gil Vicente (crítica social); poesia palaciana.", difficulty: "MEDIO" },
    { title: "Movimentos Literários: Classicismo e Barroco", textContent: "Classicismo (séc. XVI): Renascimento; equilíbrio, razão, mitologia greco-romana; Camões ('Os Lusíadas': epopeia, viagem de Vasco da Gama). Barroco (séc. XVII): dualidade (carne/espírito), cultismo (linguagem rebuscada), conceptismo (jogo de ideias); Gregório de Matos (poesia satírica), Padre Vieira (sermões).", difficulty: "MEDIO" },
    { title: "Movimentos Literários: Arcadismo", textContent: "Arcadismo (séc. XVIII): reação ao Barroco; simplicidade, natureza idealizada (locus amoenus), carpe diem, pastoralismo, pseudônimos. Brasil: Tomás Antônio Gonzaga ('Marília de Dirceu': liras amorosas), Cláudio Manuel da Costa, Basílio da Gama ('O Uraguai': épico indianista). Contexto: Iluminismo, Inconfidência Mineira.", difficulty: "MEDIO" },
    { title: "Movimentos Literários: Romantismo", textContent: "Romantismo (séc. XIX): subjetivismo, emoção, liberdade, nacionalismo. Gerações brasileiras: 1ª (nacionalista/indianista: Gonçalves Dias), 2ª (ultrarromântica/mal do século: Álvares de Azevedo), 3ª (condoreira/social: Castro Alves). Prosa: José de Alencar (indianismo, regionalismo, urbano). Egocentrismo, idealização amorosa, escapismo.", difficulty: "MEDIO" },
    { title: "Movimentos Literários: Realismo e Naturalismo", textContent: "Realismo (2ª metade séc. XIX): objetividade, crítica social, análise psicológica. Machado de Assis: pessimismo, ironia, metalinguagem ('Memórias Póstumas', 'Dom Casmurro'). Naturalismo: determinismo (raça, meio, momento), temas patológicos, zoomorfização. Aluísio Azevedo ('O Cortiço'). Contexto: cientificismo, abolição, república.", difficulty: "MEDIO" },
    { title: "Movimentos Literários: Parnasianismo e Simbolismo", textContent: "Parnasianismo: arte pela arte, forma perfeita, soneto, objetividade, temas clássicos. Olavo Bilac, Alberto de Oliveira, Raimundo Correia. Simbolismo: subjetividade, musicalidade, sinestesia, misticismo, sugestão. Cruz e Sousa ('Broquéis': sonetos), Alphonsus de Guimaraens. Oposição entre objetividade parnasiana e subjetividade simbolista.", difficulty: "MEDIO" },
    { title: "Modernismo: Primeira Fase", textContent: "Semana de Arte Moderna (1922): ruptura com academicismo. Características: liberdade formal, verso livre, linguagem coloquial, nacionalismo crítico, antropofagia (devorar cultura estrangeira). Mário de Andrade ('Macunaíma'), Oswald de Andrade ('Pau-Brasil'), Manuel Bandeira ('Libertinagem'). 'Abaixo o purismo; abaixo Coimbra!'", difficulty: "MEDIO" },
    { title: "Modernismo: Segunda Fase", textContent: "Segunda fase (1930-1945): amadurecimento, engajamento social, regionalismo. Poesia: Carlos Drummond de Andrade (eu maior que o mundo, angústia existencial), Cecília Meireles, Vinícius de Moraes. Prosa regionalista: Graciliano Ramos ('Vidas Secas'), Jorge Amado, Rachel de Queiroz, José Lins do Rego. Romance de 30: nordeste, seca, desigualdade.", difficulty: "MEDIO" },
    { title: "Modernismo: Terceira Fase e Contemporâneos", textContent: "Terceira fase (1945-): Geração de 45 retoma formalismo (João Cabral de Melo Neto: 'Morte e Vida Severina'). Concretismo (1956): poesia visual, Haroldo e Augusto de Campos. Prosa contemporânea: Clarice Lispector (introspecção), Guimarães Rosa ('Grande Sertão: Veredas': inovação linguística). Tropicalismo, poesia marginal.", difficulty: "DIFICIL" },
    { title: "Análise de Texto Literário", textContent: "Elementos de análise: eu-lírico (voz do poema) vs. narrador (voz da prosa). Figuras de linguagem: metáfora, metonímia, antítese, ironia, hipérbole. Tipos de narrador: 1ª pessoa (protagonista, observador) e 3ª pessoa (onisciente, observador). Intertextualidade: paródia, paráfrase, citação. Sempre relacione texto ao contexto histórico-literário.", difficulty: "FACIL" },
  ],
};

async function seedEnem() {
  console.log("🎓 Criando ENEM no sistema...\n");

  try {
    // 1. Criar concurso ENEM
    console.log("📋 Criando concurso ENEM...");
    const existingConcurso = await db.execute(sql`
      SELECT id FROM concursos WHERE sigla = 'ENEM'
    `) as any[];

    let concursoId: string;

    if (existingConcurso.length > 0) {
      concursoId = existingConcurso[0].id;
      console.log("   ⏭️ Concurso ENEM já existe");
    } else {
      const result = await db.execute(sql`
        INSERT INTO concursos (nome, sigla, esfera, exam_type, ordem, is_active, descricao)
        VALUES (
          'Exame Nacional do Ensino Médio',
          'ENEM',
          'FEDERAL',
          'OUTRO',
          99,
          true,
          'Exame para ingresso em universidades públicas e privadas. Usado no SISU, PROUNI e FIES.'
        )
        RETURNING id
      `) as any[];
      concursoId = result[0].id;
      console.log("   ✅ Concurso ENEM criado");
    }

    // 2. Criar cargo ENEM_GERAL
    console.log("\n📋 Criando cargo ENEM_GERAL...");
    const existingCargo = await db.execute(sql`
      SELECT id FROM cargos WHERE codigo = 'ENEM_GERAL'
    `) as any[];

    let cargoId: string;

    if (existingCargo.length > 0) {
      cargoId = existingCargo[0].id;
      console.log("   ⏭️ Cargo ENEM_GERAL já existe");
    } else {
      const result = await db.execute(sql`
        INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, is_active, descricao, ordem)
        VALUES (
          ${concursoId},
          'ENEM - Preparação Completa',
          'ENEM_GERAL',
          'MEDIO',
          true,
          'Preparação completa para o ENEM, cobrindo todas as áreas de conhecimento e redação.',
          1
        )
        RETURNING id
      `) as any[];
      cargoId = result[0].id;
      console.log("   ✅ Cargo ENEM_GERAL criado");
    }

    // 3. Criar Subjects faltantes
    console.log("\n📚 Criando Subjects faltantes...");
    let subjectsCreated = 0;

    for (const subject of NEW_SUBJECTS) {
      const existing = await db.execute(sql`
        SELECT id FROM "Subject" WHERE name = ${subject.name}
      `) as any[];

      if (existing.length > 0) {
        console.log(`   ⏭️ Subject já existe: ${subject.name}`);
        continue;
      }

      const newId = generateId();
      await db.execute(sql`
        INSERT INTO "Subject" (id, name, "displayName", category, "sortOrder", "isActive", "updatedAt")
        VALUES (${newId}, ${subject.name}, ${subject.displayName}, ${subject.category}, ${subject.sortOrder}, true, NOW())
      `);
      subjectsCreated++;
      console.log(`   ✅ Subject criado: ${subject.name}`);
    }

    // 4. Criar conteúdos para novos subjects
    console.log("\n📝 Criando conteúdos para novos Subjects...");
    let contentsCreated = 0;

    for (const [subjectName, contents] of Object.entries(NEW_CONTENTS)) {
      const subjectResult = await db.execute(sql`
        SELECT id FROM "Subject" WHERE name = ${subjectName}
      `) as any[];

      if (subjectResult.length === 0) {
        console.log(`   ⚠️ Subject não encontrado: ${subjectName}`);
        continue;
      }

      const subjectId = subjectResult[0].id;

      for (const content of contents) {
        const existingContent = await db.execute(sql`
          SELECT id FROM "Content" WHERE title = ${content.title} AND "subjectId" = ${subjectId}
        `) as any[];

        if (existingContent.length > 0) {
          continue;
        }

        const contentId = generateId();
        await db.execute(sql`
          INSERT INTO "Content" (id, "subjectId", title, "textContent", difficulty, "wordCount", "estimatedReadTime", "isActive", "updatedAt")
          VALUES (
            ${contentId},
            ${subjectId},
            ${content.title},
            ${content.textContent},
            ${content.difficulty},
            ${content.textContent.split(' ').length},
            ${Math.ceil(content.textContent.split(' ').length / 200)},
            true,
            NOW()
          )
        `);
        contentsCreated++;
      }
      console.log(`   📝 ${subjectName}: ${contents.length} conteúdos`);
    }

    // 5. Criar matérias para ENEM_GERAL
    console.log("\n📋 Criando matérias para ENEM_GERAL...");
    let materiasCreated = 0;

    for (const materia of ENEM_MATERIAS) {
      const existing = await db.execute(sql`
        SELECT id FROM cargo_materias WHERE cargo_id = ${cargoId} AND codigo = ${materia.codigo}
      `) as any[];

      if (existing.length > 0) {
        continue;
      }

      await db.execute(sql`
        INSERT INTO cargo_materias (cargo_id, nome, codigo, peso, ordem, is_active)
        VALUES (${cargoId}, ${materia.nome}, ${materia.codigo}, ${materia.peso}, ${materia.ordem}, true)
      `);
      materiasCreated++;
    }
    console.log(`   ✅ ${materiasCreated} matérias criadas para ENEM_GERAL`);

    // 6. Atualizar o generateConcursosKeyboard no database.ts para incluir ícone do ENEM
    console.log("\n📊 RESUMO");
    console.log("═".repeat(50));
    console.log(`✅ Concurso ENEM: ${existingConcurso.length > 0 ? 'já existia' : 'criado'}`);
    console.log(`✅ Cargo ENEM_GERAL: ${existingCargo.length > 0 ? 'já existia' : 'criado'}`);
    console.log(`✅ Subjects criados: ${subjectsCreated}`);
    console.log(`✅ Conteúdos criados: ${contentsCreated}`);
    console.log(`✅ Matérias criadas: ${materiasCreated}`);
    console.log("═".repeat(50));

  } catch (error) {
    console.error("❌ Erro:", error);
    throw error;
  }
}

// Executar
seedEnem()
  .then(() => {
    console.log("\n✅ ENEM adicionado com sucesso!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Falha ao adicionar ENEM:", error);
    process.exit(1);
  });
