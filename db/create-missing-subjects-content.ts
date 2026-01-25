/**
 * Fase 4: Criar Subjects e Conteúdos para matérias faltantes
 *
 * Matérias sem conteúdo:
 * 1. DIREITO_PROCESSUAL_PENAL (15 cargos)
 * 2. INGLES (12 cargos)
 * 3. FISICA (9 cargos)
 * 4. GEOGRAFIA (9 cargos)
 * 5. HISTORIA (9 cargos)
 * 6. QUIMICA (8 cargos)
 * 7. ATUALIDADES (6 cargos)
 * 8. LEGISLACAO_ESPECIAL (4 cargos)
 * 9. ADMINISTRACAO (3 cargos)
 * 10. NOCOES_AVIACAO (2 cargos)
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

// Subjects a criar
// Categorias válidas: CIENCIAS_HUMANAS, CIENCIAS_NATUREZA, CONHECIMENTOS_GERAIS, DIREITO, ESPECIFICAS, INFORMATICA, LINGUAGENS, MATEMATICA
const NEW_SUBJECTS = [
  {
    name: "DIREITO_PROCESSUAL_PENAL",
    displayName: "Direito Processual Penal",
    category: "DIREITO",
    sortOrder: 7,
  },
  {
    name: "INGLES",
    displayName: "Língua Inglesa",
    category: "LINGUAGENS",
    sortOrder: 2,
  },
  {
    name: "FISICA",
    displayName: "Física",
    category: "CIENCIAS_NATUREZA",
    sortOrder: 3,
  },
  {
    name: "GEOGRAFIA",
    displayName: "Geografia",
    category: "CIENCIAS_HUMANAS",
    sortOrder: 1,
  },
  {
    name: "HISTORIA",
    displayName: "História",
    category: "CIENCIAS_HUMANAS",
    sortOrder: 2,
  },
  {
    name: "QUIMICA",
    displayName: "Química",
    category: "CIENCIAS_NATUREZA",
    sortOrder: 4,
  },
  {
    name: "ATUALIDADES",
    displayName: "Atualidades",
    category: "CONHECIMENTOS_GERAIS",
    sortOrder: 3,
  },
  {
    name: "LEGISLACAO_ESPECIAL",
    displayName: "Legislação Especial",
    category: "DIREITO",
    sortOrder: 8,
  },
  {
    name: "ADMINISTRACAO",
    displayName: "Administração Pública",
    category: "ESPECIFICAS",
    sortOrder: 1,
  },
  {
    name: "NOCOES_AVIACAO",
    displayName: "Noções de Aviação Civil",
    category: "ESPECIFICAS",
    sortOrder: 2,
  },
  {
    name: "DIREITO_CONSTITUCIONAL",
    displayName: "Direito Constitucional",
    category: "DIREITO",
    sortOrder: 4,
  },
];

// Conteúdos para cada Subject (10 conteúdos por matéria)
const CONTENTS: Record<string, { title: string; textContent: string; difficulty: string }[]> = {
  DIREITO_PROCESSUAL_PENAL: [
    { title: "Inquérito Policial", textContent: "O inquérito policial é um procedimento administrativo pré-processual, de natureza inquisitiva, presidido pela autoridade policial, que visa apurar a autoria e materialidade de infrações penais. Não é obrigatório para a propositura da ação penal, sendo dispensável quando o Ministério Público já possui elementos suficientes.", difficulty: "MEDIO" },
    { title: "Prisão em Flagrante", textContent: "A prisão em flagrante ocorre quando o agente é surpreendido cometendo a infração penal, acaba de cometê-la, é perseguido logo após, ou é encontrado com instrumentos ou objetos que façam presumir ser o autor. Qualquer pessoa pode prender quem esteja em flagrante, e as autoridades policiais têm o dever de fazê-lo.", difficulty: "MEDIO" },
    { title: "Prisão Preventiva", textContent: "A prisão preventiva é uma medida cautelar de natureza pessoal, decretada pelo juiz em qualquer fase do inquérito ou da ação penal, quando presentes os requisitos do art. 312 do CPP: garantia da ordem pública, conveniência da instrução criminal, ou para assegurar a aplicação da lei penal.", difficulty: "DIFICIL" },
    { title: "Prisão Temporária", textContent: "A prisão temporária é cabível durante o inquérito policial, por prazo de 5 dias (prorrogáveis por mais 5), nos crimes previstos na Lei 7.960/89. Para crimes hediondos, o prazo é de 30 dias, prorrogáveis por igual período. Só pode ser decretada pelo juiz mediante representação da autoridade policial ou requerimento do MP.", difficulty: "MEDIO" },
    { title: "Ação Penal Pública", textContent: "A ação penal pública é de titularidade do Ministério Público. Pode ser incondicionada (independe de qualquer condição) ou condicionada à representação do ofendido ou requisição do Ministro da Justiça. É regida pelos princípios da obrigatoriedade, indisponibilidade, oficialidade e divisibilidade.", difficulty: "MEDIO" },
    { title: "Ação Penal Privada", textContent: "A ação penal privada é de iniciativa do ofendido ou seu representante legal, através de queixa-crime. Rege-se pelos princípios da oportunidade, disponibilidade e indivisibilidade. O prazo decadencial é de 6 meses, contados do conhecimento da autoria.", difficulty: "MEDIO" },
    { title: "Competência Criminal", textContent: "A competência criminal é fixada pelo lugar da infração (art. 70, CPP), pela natureza da infração, pela prerrogativa de função e pela conexão ou continência. A competência por prerrogativa de função prevalece sobre as demais. A conexão e continência podem modificar a competência originária.", difficulty: "DIFICIL" },
    { title: "Provas no Processo Penal", textContent: "No processo penal brasileiro, são admitidas todas as provas lícitas, mesmo que não previstas em lei. São inadmissíveis as provas obtidas por meios ilícitos, devendo ser desentranhadas dos autos. O ônus da prova incumbe a quem alega, cabendo ao MP provar a autoria e materialidade.", difficulty: "MEDIO" },
    { title: "Habeas Corpus", textContent: "O habeas corpus é uma ação constitucional que tutela a liberdade de locomoção. Pode ser preventivo (salvo-conduto) ou liberatório (alvará de soltura). Qualquer pessoa pode impetrá-lo em seu favor ou de terceiro. Não é cabível contra punições disciplinares militares.", difficulty: "FACIL" },
    { title: "Recursos no Processo Penal", textContent: "Os principais recursos no processo penal são: apelação, recurso em sentido estrito, embargos de declaração, agravo em execução, recurso ordinário constitucional, recurso especial e recurso extraordinário. O prazo geral é de 5 dias, salvo exceções legais.", difficulty: "DIFICIL" },
  ],
  INGLES: [
    { title: "Simple Present Tense", textContent: "The Simple Present is used for habits, routines, general truths, and scheduled events. Affirmative: Subject + Verb (add -s/-es for he/she/it). Negative: Subject + do/does not + base verb. Question: Do/Does + Subject + base verb? Example: 'She works at a police station.'", difficulty: "FACIL" },
    { title: "Simple Past Tense", textContent: "The Simple Past describes completed actions in the past. Regular verbs add -ed (worked, played). Irregular verbs have unique forms (went, saw, had). Negative: Subject + did not + base verb. Question: Did + Subject + base verb? Example: 'The officer investigated the case.'", difficulty: "FACIL" },
    { title: "Present Perfect Tense", textContent: "The Present Perfect connects past actions to the present. Structure: Subject + have/has + past participle. Used for experiences, recent actions with present results, and unfinished time periods. Example: 'The detective has solved many cases.' Keywords: already, yet, ever, never, just.", difficulty: "MEDIO" },
    { title: "Passive Voice", textContent: "Passive Voice emphasizes the action or receiver, not the doer. Structure: Object + to be + past participle (+ by agent). Example: Active: 'The police arrested the suspect.' Passive: 'The suspect was arrested by the police.' Common in formal and legal texts.", difficulty: "MEDIO" },
    { title: "Conditional Sentences", textContent: "Type 0: General truths (If + present, present). Type 1: Real/possible future (If + present, will + base verb). Type 2: Unreal present (If + past, would + base verb). Type 3: Unreal past (If + past perfect, would have + past participle).", difficulty: "MEDIO" },
    { title: "Modal Verbs", textContent: "Modal verbs express ability (can, could), permission (may, might), obligation (must, have to, should), and possibility (may, might, could). They don't take -s in third person and are followed by base verb. Example: 'Officers must follow protocol.'", difficulty: "FACIL" },
    { title: "Relative Clauses", textContent: "Relative clauses add information about nouns using who (people), which (things), that (both), where (places), when (time), whose (possession). Defining clauses are essential; non-defining clauses add extra info and use commas. Example: 'The officer who investigated the case retired.'", difficulty: "MEDIO" },
    { title: "Reported Speech", textContent: "Reported Speech conveys what someone said without quoting directly. Changes: pronouns, tenses (backshift), time expressions. Direct: 'I will arrest him.' Reported: 'He said he would arrest him.' Questions: asked if/whether + statement order.", difficulty: "DIFICIL" },
    { title: "Connectors and Linking Words", textContent: "Addition: and, also, moreover, furthermore. Contrast: but, however, although, despite. Cause: because, since, as. Result: so, therefore, consequently. Purpose: to, in order to, so that. These words improve text cohesion and are essential for reading comprehension.", difficulty: "FACIL" },
    { title: "Reading Comprehension Strategies", textContent: "Key strategies: 1) Skim for main idea. 2) Scan for specific information. 3) Use context clues for unknown words. 4) Identify topic sentences. 5) Recognize text structure (cause-effect, comparison, chronological). 6) Pay attention to transition words.", difficulty: "MEDIO" },
  ],
  FISICA: [
    { title: "Cinemática: Movimento Uniforme", textContent: "No Movimento Uniforme (MU), a velocidade é constante e a aceleração é zero. Equação horária: S = S₀ + v.t, onde S é a posição, S₀ é a posição inicial, v é a velocidade e t é o tempo. O gráfico S×t é uma reta, e o gráfico v×t é uma reta horizontal.", difficulty: "FACIL" },
    { title: "Cinemática: Movimento Uniformemente Variado", textContent: "No MUV, a aceleração é constante. Equações: v = v₀ + a.t e S = S₀ + v₀.t + ½.a.t². A equação de Torricelli (v² = v₀² + 2.a.ΔS) relaciona velocidade e posição sem usar o tempo. O gráfico v×t é uma reta inclinada.", difficulty: "MEDIO" },
    { title: "Leis de Newton", textContent: "1ª Lei (Inércia): corpo em repouso ou MU permanece assim, salvo ação de força. 2ª Lei: F = m.a (força resultante = massa × aceleração). 3ª Lei (Ação e Reação): toda força tem uma reação igual em módulo e direção, mas de sentido oposto.", difficulty: "MEDIO" },
    { title: "Trabalho e Energia", textContent: "Trabalho: W = F.d.cosθ (força × deslocamento × cosseno do ângulo). Energia Cinética: Ec = ½.m.v². Energia Potencial Gravitacional: Ep = m.g.h. Teorema Trabalho-Energia: W = ΔEc. Conservação de Energia: Em = Ec + Ep = constante (sistemas conservativos).", difficulty: "MEDIO" },
    { title: "Gravitação Universal", textContent: "Lei de Newton da Gravitação: F = G.M.m/d², onde G = 6,67×10⁻¹¹ N.m²/kg². Aceleração gravitacional: g = G.M/R². Velocidade orbital: v = √(G.M/r). Leis de Kepler descrevem órbitas elípticas, áreas iguais em tempos iguais, e T² ∝ R³.", difficulty: "DIFICIL" },
    { title: "Hidrostática: Pressão e Empuxo", textContent: "Pressão: P = F/A (força por área). Pressão hidrostática: P = ρ.g.h. Princípio de Pascal: pressão se transmite integralmente em fluidos. Princípio de Arquimedes: Empuxo E = ρ.g.V (peso do fluido deslocado). Corpo flutua quando E ≥ Peso.", difficulty: "MEDIO" },
    { title: "Termologia: Calor e Temperatura", textContent: "Temperatura mede agitação molecular. Calor é energia em trânsito. Calor sensível: Q = m.c.ΔT. Calor latente: Q = m.L. Dilatação linear: ΔL = L₀.α.ΔT. Equilíbrio térmico: Q cedido = Q recebido (Lei Zero da Termodinâmica).", difficulty: "MEDIO" },
    { title: "Óptica Geométrica", textContent: "Princípios: propagação retilínea, independência dos raios, reversibilidade. Reflexão: ângulo de incidência = ângulo de reflexão. Refração: n₁.senθ₁ = n₂.senθ₂ (Lei de Snell). Espelhos planos: imagem virtual, simétrica. Lentes convergentes e divergentes.", difficulty: "MEDIO" },
    { title: "Eletrostática", textContent: "Carga elétrica: q = n.e (n = número de elétrons, e = 1,6×10⁻¹⁹ C). Lei de Coulomb: F = k.q₁.q₂/d². Campo elétrico: E = F/q = k.Q/d². Potencial elétrico: V = k.Q/d. Energia potencial: U = k.q₁.q₂/d.", difficulty: "DIFICIL" },
    { title: "Eletrodinâmica", textContent: "Corrente elétrica: i = ΔQ/Δt. Lei de Ohm: V = R.i. Resistores em série: Req = R₁ + R₂. Paralelo: 1/Req = 1/R₁ + 1/R₂. Potência: P = V.i = R.i² = V²/R. Energia: E = P.t. Leis de Kirchhoff para circuitos complexos.", difficulty: "MEDIO" },
  ],
  GEOGRAFIA: [
    { title: "Geopolítica Mundial", textContent: "A Nova Ordem Mundial pós-Guerra Fria é caracterizada pela multipolaridade econômica (EUA, União Europeia, China, Japão) e unipolaridade militar (EUA). Organizações como ONU, OTAN, BRICS e G20 são centrais nas relações internacionais. Conflitos atuais envolvem disputas por recursos, território e influência.", difficulty: "MEDIO" },
    { title: "Globalização", textContent: "A globalização é o processo de integração econômica, cultural e política mundial. Características: fluxo de capitais, empresas transnacionais, divisão internacional do trabalho, revolução técnico-científica-informacional. Críticas: aumento da desigualdade, homogeneização cultural, degradação ambiental.", difficulty: "MEDIO" },
    { title: "Urbanização Brasileira", textContent: "O Brasil passou de rural a urbano no século XX. Taxa de urbanização: ~87%. Características: macrocefalia urbana, metropolização, conurbação, favelização, segregação socioespacial. Principais regiões metropolitanas: São Paulo, Rio de Janeiro, Belo Horizonte, Porto Alegre, Recife.", difficulty: "FACIL" },
    { title: "Questão Agrária no Brasil", textContent: "O Brasil tem alta concentração fundiária (índice de Gini ~0,85). Movimentos sociais: MST, Via Campesina. Políticas: reforma agrária, PRONAF, agricultura familiar. Conflitos envolvem latifúndios, agronegócio, demarcação de terras indígenas e quilombolas.", difficulty: "MEDIO" },
    { title: "Biomas Brasileiros", textContent: "Amazônia (49%): maior biodiversidade, desmatamento crescente. Cerrado (24%): savana, fronteira agrícola. Mata Atlântica (13%): mais devastada, hotspot de biodiversidade. Caatinga (10%): semiárido nordestino. Pampa (2%): campos sulinos. Pantanal (2%): maior planície inundável.", difficulty: "FACIL" },
    { title: "Recursos Hídricos", textContent: "O Brasil possui 12% da água doce mundial. Bacias: Amazônica (maior), Tocantins-Araguaia, São Francisco, Paraná, Paraguai. Problemas: poluição, desperdício, conflitos de uso, crise hídrica no Sudeste (2014-2015). Aquífero Guarani: um dos maiores reservatórios subterrâneos.", difficulty: "MEDIO" },
    { title: "Matriz Energética Brasileira", textContent: "Matriz predominantemente renovável (45%): hidrelétricas (65% da eletricidade), biomassa, eólica, solar. Petróleo e gás (Pré-Sal) são importantes para exportação. Desafios: diversificação, impactos de hidrelétricas na Amazônia, transição energética.", difficulty: "MEDIO" },
    { title: "Indústria Brasileira", textContent: "Concentração no Sudeste (São Paulo é o maior parque industrial). Desconcentração relativa desde os anos 1970: guerra fiscal, Zona Franca de Manaus, polos do Nordeste. Setores: automobilístico, alimentício, químico, siderúrgico, aeronáutico (Embraer).", difficulty: "MEDIO" },
    { title: "Fronteiras e Faixa de Fronteira", textContent: "O Brasil faz fronteira com 10 países (todos da América do Sul, exceto Chile e Equador). Faixa de fronteira: 150 km da divisa, área de segurança nacional. Questões: narcotráfico, contrabando, crimes transfronteiriços, integração regional (Mercosul).", difficulty: "FACIL" },
    { title: "Clima do Brasil", textContent: "Tipos climáticos: Equatorial (Amazônia), Tropical (maior parte), Semiárido (Nordeste interior), Tropical de Altitude (serras), Subtropical (Sul). Fatores: latitude, altitude, massas de ar, continentalidade, maritimidade. Fenômenos: El Niño, La Niña afetam precipitações.", difficulty: "FACIL" },
  ],
  HISTORIA: [
    { title: "Brasil Colônia: Período Pré-Colonial", textContent: "O período pré-colonial (1500-1530) foi marcado pela exploração do pau-brasil através do escambo com indígenas. Não havia colonização efetiva. As expedições guarda-costas tentavam proteger o território de franceses. A falta de metais preciosos desestimulou a ocupação inicial.", difficulty: "FACIL" },
    { title: "Brasil Colônia: Capitanias e Governo Geral", textContent: "As Capitanias Hereditárias (1534) dividiram o território em 15 lotes. Maioria fracassou, exceto Pernambuco e São Vicente. O Governo Geral (1549) centralizou a administração em Salvador. Tomé de Sousa foi o primeiro governador-geral, trazendo os jesuítas.", difficulty: "MEDIO" },
    { title: "Brasil Colônia: Economia Açucareira", textContent: "O açúcar foi o primeiro grande ciclo econômico (séculos XVI-XVII). Sistema de plantation: latifúndio, monocultura, escravidão, exportação. Nordeste era o centro produtor. Engenhos eram unidades produtivas complexas. Decadência veio com a concorrência antilhana após invasão holandesa.", difficulty: "MEDIO" },
    { title: "Brasil Colônia: Mineração", textContent: "O ciclo do ouro (século XVIII) deslocou o eixo econômico para Minas Gerais. Sociedade mais urbana e diversificada. Intendências das Minas e Casa de Fundição controlavam a produção. O quinto era o imposto de 20%. A derrama gerou revoltas como a Inconfidência Mineira (1789).", difficulty: "MEDIO" },
    { title: "Brasil Império: Independência", textContent: "A vinda da família real (1808) e a abertura dos portos mudaram o Brasil. O retorno de D. João VI (1821) e as tentativas de recolonização levaram ao Grito do Ipiranga (7/9/1822). A independência foi conservadora: manteve monarquia, escravidão e estrutura social.", difficulty: "FACIL" },
    { title: "Brasil Império: Primeiro e Segundo Reinado", textContent: "Primeiro Reinado (1822-1831): D. Pedro I, Constituição de 1824 (outorgada, Poder Moderador), Guerra da Cisplatina, abdicação. Regências (1831-1840): revoltas (Cabanagem, Farroupilha, Balaiada). Segundo Reinado (1840-1889): D. Pedro II, parlamentarismo às avessas, Guerra do Paraguai, abolição.", difficulty: "MEDIO" },
    { title: "República Velha (1889-1930)", textContent: "Proclamação em 15/11/1889. Constituição de 1891: federalismo, presidencialismo, voto aberto. Política dos Governadores e Café com Leite. Coronelismo no interior. Economia: café dominante. Revoltas: Canudos, Contestado, Revolta da Vacina, Tenentismo. Crise de 1929 derrubou o sistema.", difficulty: "MEDIO" },
    { title: "Era Vargas (1930-1945)", textContent: "Revolução de 1930 encerrou a República Velha. Governo Provisório (1930-1934), Constitucional (1934-1937), Estado Novo (1937-1945). Trabalhismo: CLT, salário mínimo, Justiça do Trabalho. Nacionalismo econômico: CSN, Vale do Rio Doce, Petrobras (1953). Queda em 1945 e suicídio em 1954.", difficulty: "MEDIO" },
    { title: "Ditadura Militar (1964-1985)", textContent: "Golpe em 31/3/1964. Atos Institucionais concentraram poder (AI-5, 1968). Milagre econômico (1969-1973) e crise. Repressão: tortura, censura, exílio, mortes. Abertura lenta e gradual (Geisel, Figueiredo). Diretas Já (1984). Tancredo eleito indiretamente (1985), morre antes de assumir.", difficulty: "DIFICIL" },
    { title: "Nova República (1985-presente)", textContent: "Sarney: Plano Cruzado, Constituição de 1988 (cidadã). Collor: abertura econômica, impeachment (1992). FHC: Plano Real, privatizações, reeleição. Lula: programas sociais, crescimento, escândalos. Dilma: impeachment (2016). Temer, Bolsonaro e Lula novamente.", difficulty: "MEDIO" },
  ],
  QUIMICA: [
    { title: "Estrutura Atômica", textContent: "O átomo é formado por prótons (p⁺) e nêutrons (n⁰) no núcleo, e elétrons (e⁻) na eletrosfera. Número atômico (Z) = número de prótons. Número de massa (A) = p + n. Isótopos: mesmo Z, diferente A. Modelo de Bohr: elétrons em camadas (K, L, M, N, O, P, Q).", difficulty: "FACIL" },
    { title: "Tabela Periódica", textContent: "Organizada por número atômico crescente. Períodos (7 linhas): número de camadas. Famílias/Grupos (18 colunas): propriedades semelhantes. Metais (maioria), ametais, semimetais, gases nobres. Propriedades periódicas: raio atômico, eletronegatividade, energia de ionização.", difficulty: "MEDIO" },
    { title: "Ligações Químicas", textContent: "Iônica: transferência de elétrons (metal + ametal), formam cristais, conduzem eletricidade fundidos/dissolvidos. Covalente: compartilhamento de elétrons (ametais), moléculas ou redes. Metálica: mar de elétrons (metais), conduzem eletricidade e calor.", difficulty: "MEDIO" },
    { title: "Funções Inorgânicas: Ácidos e Bases", textContent: "Ácidos (Arrhenius): liberam H⁺ em água. Nomenclatura: ácido + nome do ânion. Exemplos: HCl (clorídrico), H₂SO₄ (sulfúrico). Bases: liberam OH⁻ em água. Nomenclatura: hidróxido de + cátion. Exemplos: NaOH (soda cáustica), Ca(OH)₂ (cal hidratada).", difficulty: "MEDIO" },
    { title: "Funções Inorgânicas: Sais e Óxidos", textContent: "Sais: formados na neutralização ácido-base. Nomenclatura: nome do ânion + de + nome do cátion. Exemplo: NaCl (cloreto de sódio). Óxidos: compostos binários com oxigênio. Tipos: ácidos (SO₃), básicos (Na₂O), anfóteros (Al₂O₃), neutros (CO).", difficulty: "MEDIO" },
    { title: "Reações Químicas", textContent: "Tipos: síntese (A + B → AB), decomposição (AB → A + B), simples troca (A + BC → AC + B), dupla troca (AB + CD → AD + CB). Balanceamento: igualar átomos nos reagentes e produtos. Reações de oxirredução envolvem transferência de elétrons.", difficulty: "MEDIO" },
    { title: "Estequiometria", textContent: "Cálculo das quantidades nas reações. 1 mol = 6,02×10²³ entidades = massa molar em gramas = 22,4 L de gás (CNTP). Proporção estequiométrica vem dos coeficientes da equação balanceada. Pureza e rendimento ajustam cálculos para situações reais.", difficulty: "DIFICIL" },
    { title: "Soluções", textContent: "Soluções são misturas homogêneas. Soluto + Solvente = Solução. Concentrações: g/L, mol/L (molaridade), título (massa ou volume). Diluição: C₁V₁ = C₂V₂. Solubilidade depende de temperatura e pressão. Coeficiente de solubilidade: máximo dissolvido.", difficulty: "MEDIO" },
    { title: "Termoquímica", textContent: "Estuda calor nas reações. Entalpia (H): energia em pressão constante. Reações exotérmicas: liberam calor (ΔH < 0). Endotérmicas: absorvem calor (ΔH > 0). Lei de Hess: ΔH total = soma das etapas. Energia de ligação, formação, combustão.", difficulty: "DIFICIL" },
    { title: "Eletroquímica", textContent: "Pilhas: reação espontânea gera corrente (ânodo: oxidação, cátodo: redução). Eletrólise: corrente força reação não espontânea. ddp = E°cátodo - E°ânodo. Corrosão é oxidação indesejada. Proteção catódica e galvanização previnem corrosão.", difficulty: "DIFICIL" },
  ],
  ATUALIDADES: [
    { title: "Conflito Rússia-Ucrânia", textContent: "Iniciado em 2022, o conflito envolve a invasão russa da Ucrânia. Causas: expansão da OTAN, questão da Crimeia (anexada em 2014), regiões separatistas de Donbass. Consequências globais: crise energética na Europa, alta de commodities, reestruturação geopolítica, milhões de refugiados.", difficulty: "MEDIO" },
    { title: "Crise Climática Global", textContent: "Aquecimento global causado por emissões de CO₂ e metano. Acordo de Paris (2015): limitar aumento a 1,5°C. COP (Conferência das Partes) é o fórum de negociações. Eventos extremos aumentam: secas, enchentes, ondas de calor. Transição energética e descarbonização são urgentes.", difficulty: "MEDIO" },
    { title: "Inteligência Artificial", textContent: "A IA generativa (ChatGPT, 2022) revolucionou tecnologia. Aplicações: automação, saúde, educação, segurança. Debates: regulamentação, impacto no emprego, vieses algorítmicos, deepfakes, direitos autorais. União Europeia lidera em regulamentação (AI Act).", difficulty: "MEDIO" },
    { title: "Política Brasileira Atual", textContent: "Eleições 2022: polarização Lula × Bolsonaro, vitória apertada de Lula. Eventos de 8 de janeiro de 2023: invasão dos Três Poderes. Governo Lula 3: arcabouço fiscal, reforma tributária, política ambiental, relações internacionais renovadas. Desafios: fiscal, inflação, polarização.", difficulty: "MEDIO" },
    { title: "Economia Global", textContent: "Pós-pandemia: inflação global, alta de juros, crise de oferta. EUA: Fed elevou juros. Europa: crise energética. China: desaceleração, crise imobiliária. Brasil: Selic elevada, câmbio volátil. Nearshoring e friendshoring redefinem cadeias produtivas.", difficulty: "MEDIO" },
    { title: "Conflito Israel-Hamas", textContent: "Escalada em outubro de 2023 após ataque do Hamas a Israel. Resposta israelense em Gaza com alto número de vítimas civis. Debates sobre direito humanitário, solução de dois Estados, papel internacional. Impactos regionais e risco de ampliação do conflito.", difficulty: "MEDIO" },
    { title: "Migração e Refugiados", textContent: "Crise migratória global: mais de 100 milhões de deslocados. Causas: guerras, perseguições, clima, economia. Rotas: Mediterrâneo, América Central-EUA, Venezuela-vizinhos. Debates: soberania × direitos humanos, xenofobia, integração. Brasil recebe venezuelanos e haitianos.", difficulty: "MEDIO" },
    { title: "Saúde Pública Pós-COVID", textContent: "Pandemia de COVID-19 (2020-2023) matou milhões. Legado: vacinas mRNA, sistemas de saúde fragilizados, saúde mental em crise, desigualdade no acesso a vacinas. OMS mantém vigilância sobre novas variantes e outras doenças emergentes.", difficulty: "FACIL" },
    { title: "Segurança Pública no Brasil", textContent: "Desafios: facções criminosas (PCC, CV), tráfico de drogas, milícias, violência policial, encarceramento em massa. Políticas: SUSP, Força Nacional, operações federais. Debates: legalização de drogas, reforma da polícia, sistema prisional. Estatísticas melhoraram, mas permanecem altas.", difficulty: "MEDIO" },
    { title: "Meio Ambiente no Brasil", textContent: "Amazônia: desmatamento teve pico e depois queda. Cerrado: nova fronteira de desmate. Política ambiental: Ministério do Meio Ambiente fortalecido, combate ao garimpo ilegal. Demarcação de terras indígenas retomada. Brasil volta ao protagonismo em fóruns climáticos.", difficulty: "MEDIO" },
  ],
  LEGISLACAO_ESPECIAL: [
    { title: "Lei de Drogas (Lei 11.343/2006)", textContent: "Define crimes relacionados a drogas. Art. 28: posse para uso pessoal (penas alternativas). Art. 33: tráfico (5-15 anos de reclusão). Art. 35: associação para o tráfico. Tráfico privilegiado (§4º): redução de pena para réu primário, bons antecedentes, não integrante de organização.", difficulty: "MEDIO" },
    { title: "Lei de Crimes Hediondos (Lei 8.072/1990)", textContent: "Crimes hediondos são inafiançáveis e insuscetíveis de graça, anistia e indulto. Lista: homicídio qualificado, latrocínio, extorsão com resultado morte, estupro, genocídio, etc. Progressão de regime: 40% (primário) a 70% (reincidente específico em hediondo).", difficulty: "MEDIO" },
    { title: "Estatuto do Desarmamento (Lei 10.826/2003)", textContent: "Regula registro, posse e porte de armas de fogo. Posse: para defesa de domicílio (requisitos: idade, antecedentes, capacidade técnica). Porte: restrito a categorias (policiais, militares, vigilantes, etc.). Crimes: posse ilegal (1-3 anos), porte ilegal (2-4 anos), comércio ilegal (4-8 anos).", difficulty: "MEDIO" },
    { title: "Lei Maria da Penha (Lei 11.340/2006)", textContent: "Combate violência doméstica e familiar contra a mulher. Formas de violência: física, psicológica, sexual, patrimonial, moral. Medidas protetivas de urgência: afastamento do agressor, proibição de aproximação. Não cabe Lei 9.099. Prisão preventiva do agressor é possível.", difficulty: "FACIL" },
    { title: "Estatuto da Criança e Adolescente (Lei 8.069/1990)", textContent: "ECA protege menores de 18 anos. Criança: até 12 anos incompletos. Adolescente: 12 a 18 anos. Ato infracional: conduta descrita como crime. Medidas socioeducativas: advertência, obrigação de reparar, prestação de serviços, liberdade assistida, semiliberdade, internação (máximo 3 anos).", difficulty: "MEDIO" },
    { title: "Lei de Abuso de Autoridade (Lei 13.869/2019)", textContent: "Define crimes de abuso de autoridade por agentes públicos. Elemento subjetivo: dolo específico de prejudicar ou beneficiar alguém. Condutas: prisão ilegal, constrangimento, violação de domicílio, etc. Penas: detenção de 1-4 anos + multa. Perda do cargo é efeito da condenação.", difficulty: "MEDIO" },
    { title: "Lei de Lavagem de Dinheiro (Lei 9.613/1998)", textContent: "Lavagem é ocultar/dissimular origem ilícita de bens. Fases: colocação, ocultação, integração. Pena: 3-10 anos + multa. Crime autônomo: independe de condenação pelo crime antecedente. COAF (UIF) fiscaliza operações suspeitas. Delação premiada é prevista.", difficulty: "DIFICIL" },
    { title: "Lei de Organizações Criminosas (Lei 12.850/2013)", textContent: "Organização criminosa: 4+ pessoas, estruturada, com divisão de tarefas. Pena: 3-8 anos. Meios de investigação: infiltração de agentes, colaboração premiada, captação ambiental, ação controlada. Colaboração premiada: requisitos, benefícios, homologação judicial.", difficulty: "MEDIO" },
    { title: "Lei de Tortura (Lei 9.455/1997)", textContent: "Tortura é crime inafiançável, insuscetível de graça ou anistia. Condutas: constranger com violência/grave ameaça para obter informação, provocar ação/omissão criminosa, ou por discriminação. Pena: 2-8 anos. Se resulta morte: 8-16 anos. Crime próprio quando praticado por agente público.", difficulty: "MEDIO" },
    { title: "Código de Trânsito Brasileiro (Lei 9.503/1997)", textContent: "Crimes de trânsito: homicídio culposo (2-4 anos), lesão culposa (6 meses-2 anos), embriaguez ao volante (6 meses-3 anos), racha (6 meses-3 anos), direção sem habilitação gerando perigo. Agravantes: sem habilitação, faixa de pedestres, calçada. Suspensão/proibição de dirigir é automática.", difficulty: "MEDIO" },
  ],
  ADMINISTRACAO: [
    { title: "Princípios da Administração Pública", textContent: "LIMPE: Legalidade (só faz o que a lei permite), Impessoalidade (sem favorecimentos), Moralidade (ética, boa-fé), Publicidade (transparência), Eficiência (resultados com economia). Previstos no art. 37 da CF/88. São de observância obrigatória por todos os Poderes e entes federativos.", difficulty: "FACIL" },
    { title: "Organização Administrativa", textContent: "Administração Direta: União, Estados, DF, Municípios e seus órgãos. Administração Indireta: autarquias, fundações públicas, empresas públicas, sociedades de economia mista. Descentralização: transfere para outra pessoa jurídica. Desconcentração: distribui dentro da mesma pessoa jurídica (cria órgãos).", difficulty: "MEDIO" },
    { title: "Atos Administrativos", textContent: "Ato administrativo é manifestação unilateral de vontade da Administração. Requisitos: competência, finalidade, forma, motivo, objeto. Atributos: presunção de legitimidade, imperatividade, autoexecutoriedade, tipicidade. Extinção: anulação (ilegalidade), revogação (mérito), cassação, caducidade.", difficulty: "MEDIO" },
    { title: "Poderes Administrativos", textContent: "Poder vinculado: lei determina todos os elementos. Discricionário: margem de escolha (oportunidade e conveniência). Hierárquico: organização interna, delegação, avocação. Disciplinar: punição de servidores e particulares com vínculo. Regulamentar: decretos para fiel execução das leis. Polícia: limitação de direitos.", difficulty: "MEDIO" },
    { title: "Licitação", textContent: "Procedimento para contratação pela Administração. Lei 14.133/2021 (Nova Lei de Licitações). Modalidades: pregão, concorrência, concurso, leilão, diálogo competitivo. Princípios: isonomia, vantajosidade, vinculação ao edital, julgamento objetivo. Dispensa e inexigibilidade são exceções.", difficulty: "MEDIO" },
    { title: "Contratos Administrativos", textContent: "Contratos têm cláusulas exorbitantes: alteração unilateral, rescisão unilateral, fiscalização, sanções, ocupação temporária. Equilíbrio econômico-financeiro deve ser mantido. Prazo máximo: geralmente vinculado ao crédito orçamentário. Garantias: até 5% do valor (10% para alta complexidade).", difficulty: "MEDIO" },
    { title: "Servidores Públicos", textContent: "Regime jurídico único (estatutário) para a maioria. Formas de provimento: nomeação, promoção, readaptação, reversão, aproveitamento, reintegração, recondução. Estabilidade: após 3 anos de efetivo exercício. Perda do cargo: sentença judicial, PAD, avaliação de desempenho, excesso de despesa.", difficulty: "MEDIO" },
    { title: "Responsabilidade Civil do Estado", textContent: "Responsabilidade objetiva (art. 37, §6°, CF): independe de culpa. Teoria do risco administrativo: Estado indeniza, salvo culpa exclusiva da vítima. Ação regressiva contra o agente se houve dolo ou culpa. Prescrição: 5 anos para a vítima cobrar do Estado.", difficulty: "MEDIO" },
    { title: "Controle da Administração Pública", textContent: "Controle interno: exercido pelo próprio órgão/entidade. Externo: Legislativo (com auxílio do TCU/TCE), Judiciário. Controle social: participação popular (audiências públicas, conselhos). TCU julga contas e aplica sanções. Ministério Público atua via ação civil pública e inquérito civil.", difficulty: "MEDIO" },
    { title: "Improbidade Administrativa (Lei 14.230/2021)", textContent: "Atos de improbidade: enriquecimento ilícito, prejuízo ao erário, contra princípios. Exigem dolo (não mais culpa). Sanções: perda de função, suspensão de direitos políticos, multa, ressarcimento. Ação de improbidade prescreve em 8 anos. Acordo de não persecução cível é possível.", difficulty: "DIFICIL" },
  ],
  NOCOES_AVIACAO: [
    { title: "ANAC e Regulação da Aviação Civil", textContent: "A ANAC (Agência Nacional de Aviação Civil) é a autoridade de aviação civil brasileira. Vinculada ao Ministério de Portos e Aeroportos. Competências: regular, fiscalizar e certificar atividades de aviação civil. Emite certificados de aeronavegabilidade, licenças de pilotos, autorizações de funcionamento de aeródromos.", difficulty: "FACIL" },
    { title: "Código Brasileiro de Aeronáutica", textContent: "Lei 7.565/1986 regula a aviação civil no Brasil. Define espaço aéreo brasileiro, registro de aeronaves, serviços aéreos, infraestrutura aeroportuária, responsabilidade civil, investigação de acidentes. Aeronave: aparelho que pode se sustentar na atmosfera por reações do ar que não sejam contra a superfície da Terra.", difficulty: "MEDIO" },
    { title: "Espaço Aéreo Brasileiro", textContent: "Soberania no espaço aéreo sobre território e mar territorial (12 milhas). DECEA (Departamento de Controle do Espaço Aéreo) gerencia o controle de tráfego aéreo. Classes de espaço aéreo (A a G) com diferentes requisitos de voo. FIR (Região de Informação de Voo): Brasília, Recife, Amazônica, Curitiba, Atlântico.", difficulty: "MEDIO" },
    { title: "Segurança de Aviação Civil (AVSEC)", textContent: "AVSEC são medidas para proteção contra atos de interferência ilícita (terrorismo, sequestro, sabotagem). Inclui: controle de acesso, inspeção de passageiros e bagagens, vigilância. PNAVSEC é o programa nacional. Aeroportos têm Áreas Restritas de Segurança (ARS) com controle rigoroso.", difficulty: "MEDIO" },
    { title: "Acidentes e Incidentes Aeronáuticos", textContent: "CENIPA (Centro de Investigação e Prevenção de Acidentes Aeronáuticos) investiga para prevenção, não para punição. Acidente: ocorrência com lesão grave/fatal ou dano substancial. Incidente grave: quase acidente. Relatório final é público. SIPAER é o sistema de investigação e prevenção.", difficulty: "MEDIO" },
    { title: "Transporte Aéreo Regular e Não Regular", textContent: "Transporte aéreo público: regular (linhas com horários, rotas fixas) e não regular (charter, táxi aéreo). Requer concessão ou autorização da ANAC. Empresas devem ter Certificado de Homologação de Empresa de Transporte Aéreo (CHETA). ANAC monitora regularidade, pontualidade e segurança operacional.", difficulty: "MEDIO" },
    { title: "Direitos dos Passageiros Aéreos", textContent: "Resolução ANAC 400/2016 regula direitos. Atraso: informação, comunicação, alimentação (1h), acomodação (4h), reacomodação/reembolso (4h). Cancelamento/preterição: mesmas assistências + opção de reembolso integral. Extravio de bagagem: localização em 7 dias (nacional) ou 21 dias (internacional), indenização.", difficulty: "FACIL" },
    { title: "Operador Aéreo e Certificação", textContent: "Para operar comercialmente, empresa precisa de certificação da ANAC: Certificado de Operador Aéreo (COA) para transporte público. Requisitos: capacidade financeira, estrutura organizacional, pessoal qualificado, programa de manutenção, manuais operacionais aprovados. Auditorias periódicas verificam conformidade.", difficulty: "MEDIO" },
    { title: "Infraestrutura Aeroportuária", textContent: "Aeroportos podem ser públicos ou privados. Infraero administra principais aeroportos (em redução após concessões). Concessões: Guarulhos, Congonhas, Galeão, Brasília, etc. Aeródromo: área destinada a pouso, decolagem e movimentação de aeronaves. Tipos: aeroporto, heliporto, heliponto.", difficulty: "FACIL" },
    { title: "Profissionais da Aviação Civil", textContent: "Aeronautas: tripulantes (pilotos, comissários). Lei 13.475/2017 regulamenta a profissão. Aeroviários: trabalhadores em terra (check-in, bagagem, manutenção). Licenças de piloto: PPR (privado), PCH (comercial helicóptero), PCA (comercial avião), PLA (linha aérea). Exames médicos (CMA) são obrigatórios.", difficulty: "MEDIO" },
  ],
};

async function createMissingSubjectsAndContent() {
  console.log("📚 Fase 4: Criando Subjects e Conteúdos faltantes...\n");

  try {
    let subjectsCreated = 0;
    let contentsCreated = 0;

    for (const subject of NEW_SUBJECTS) {
      // Verificar se Subject já existe
      const existing = await db.execute(sql`
        SELECT id FROM "Subject" WHERE name = ${subject.name}
      `) as any[];

      let subjectId: string;

      if (existing.length > 0) {
        subjectId = existing[0].id;
        console.log(`⏭️ Subject já existe: ${subject.name}`);
      } else {
        // Criar Subject com ID gerado
        const newId = generateId();
        await db.execute(sql`
          INSERT INTO "Subject" (id, name, "displayName", category, "sortOrder", "isActive", "updatedAt")
          VALUES (${newId}, ${subject.name}, ${subject.displayName}, ${subject.category}, ${subject.sortOrder}, true, NOW())
        `);

        subjectId = newId;
        subjectsCreated++;
        console.log(`✅ Subject criado: ${subject.name}`);
      }

      // Criar conteúdos para este Subject
      const contents = CONTENTS[subject.name];
      if (contents) {
        for (const content of contents) {
          // Verificar se conteúdo já existe
          const existingContent = await db.execute(sql`
            SELECT id FROM "Content" WHERE title = ${content.title} AND "subjectId" = ${subjectId}
          `) as any[];

          if (existingContent.length > 0) {
            continue; // Já existe
          }

          // Criar conteúdo com ID gerado
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
        console.log(`   📝 Conteúdos para ${subject.name}: ${contents.length}`);
      }
    }

    console.log("\n" + "═".repeat(50));
    console.log("📊 RESUMO");
    console.log("═".repeat(50));
    console.log(`✅ Subjects criados: ${subjectsCreated}`);
    console.log(`📝 Conteúdos criados: ${contentsCreated}`);

    // Contar totais
    const totals = await db.execute(sql`
      SELECT
        (SELECT COUNT(*) FROM "Subject") as subjects,
        (SELECT COUNT(*) FROM "Content" WHERE "isActive" = true) as contents
    `) as any[];

    console.log(`\n📊 Totais no banco:`);
    console.log(`   Subjects: ${totals[0].subjects}`);
    console.log(`   Conteúdos: ${totals[0].contents}`);
    console.log("═".repeat(50));

  } catch (error) {
    console.error("❌ Erro:", error);
    throw error;
  }
}

// Executar
createMissingSubjectsAndContent()
  .then(() => {
    console.log("\n✅ Fase 4 (parte 1) concluída!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fase 4 falhou:", error);
    process.exit(1);
  });
