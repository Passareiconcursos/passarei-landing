/**
 * Expansão de Conteúdos - Rodada 2
 * 13 subjects ainda com 10 conteúdos → meta 20 cada
 */

import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";
import { randomBytes } from "crypto";

function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = randomBytes(8).toString("hex");
  return `c${timestamp}${randomPart}`.slice(0, 25);
}

interface ContentItem {
  title: string;
  textContent: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
}

const EXPANSION: Record<string, ContentItem[]> = {

  // DIREITO PROCESSUAL PENAL (10 → 20 = +10)
  DIREITO_PROCESSUAL_PENAL: [
    { title: "Princípios do Processo Penal", textContent: "Princípios fundamentais: devido processo legal, contraditório e ampla defesa, presunção de inocência (ninguém será considerado culpado até trânsito em julgado), juiz natural (competência predeterminada), verdade real (busca dos fatos como ocorreram), publicidade dos atos processuais, economia processual.", difficulty: "FACIL" },
    { title: "Sujeitos Processuais", textContent: "Juiz: imparcial, conduz o processo. Ministério Público: titular da ação penal pública, fiscal da lei. Acusado: parte passiva, direito à defesa. Defensor: técnico (advogado) ou dativo (nomeado pelo juiz). Assistente de acusação: ofendido que se habilita na ação pública. Auxiliares da justiça: escrivão, oficial de justiça, perito.", difficulty: "FACIL" },
    { title: "Atos Processuais e Prazos", textContent: "Atos processuais são praticados em dias úteis, das 6h às 20h. Citação: chama o réu ao processo. Intimação: comunica ato processual. Prazos para o MP: 15 dias (réu preso) ou 15 dias (réu solto) para denúncia. Prazo de defesa prévia: 10 dias. Alegações finais: 5 dias. Sentença: 10 dias.", difficulty: "MEDIO" },
    { title: "Tribunal do Júri", textContent: "Competência: julgar crimes dolosos contra a vida (homicídio, infanticídio, aborto, instigação ao suicídio). Princípios: plenitude de defesa, sigilo das votações, soberania dos veredictos. Composição: 1 juiz presidente + 25 jurados (7 sorteados por sessão). Quesitos: materialidade, autoria, absolvição, causas de aumento/diminuição.", difficulty: "DIFICIL" },
    { title: "Medidas Cautelares Diversas da Prisão", textContent: "Lei 12.403/2011 criou alternativas à prisão preventiva (art. 319 CPP): comparecimento periódico em juízo, proibição de acesso a determinados lugares, proibição de manter contato com pessoa determinada, proibição de ausentar-se da comarca, recolhimento domiciliar noturno, monitoração eletrônica, fiança.", difficulty: "MEDIO" },
    { title: "Nulidades Processuais", textContent: "Nulidade absoluta: viola garantia constitucional, pode ser reconhecida de ofício, não se convalida (ex: falta de defensor, incompetência absoluta). Nulidade relativa: viola norma infraconstitucional, deve ser arguida no momento oportuno, pode ser convalidada. Princípio do prejuízo: pas de nullité sans grief.", difficulty: "DIFICIL" },
    { title: "Sentença Penal", textContent: "Requisitos: relatório, fundamentação (obrigatória sob pena de nulidade) e dispositivo. Sentença condenatória: fixa pena, regime, reconhece agravantes/atenuantes. Sentença absolutória: imprópria (aplica medida de segurança) ou própria (sem sanção). Absolvição sumária: art. 397 CPP, antes da instrução.", difficulty: "MEDIO" },
    { title: "Execução Penal (Lei 7.210/84)", textContent: "Regimes de cumprimento: fechado (penitenciária), semiaberto (colônia), aberto (casa de albergado). Progressão de regime: cumprimento de 1/6 da pena (primário) ou 2/5 (reincidente). Remição: 3 dias de trabalho = 1 dia de pena. Livramento condicional: cumprimento de 1/3 (primário) ou 1/2 (reincidente).", difficulty: "MEDIO" },
    { title: "Investigação Criminal", textContent: "Inquérito policial: peça informativa, inquisitiva, dispensável. Pode ser instaurado de ofício, por requisição do MP/juiz, ou por representação do ofendido. Prazo: 10 dias (réu preso) ou 30 dias (réu solto). Pode ser arquivado apenas pelo MP com homologação judicial. Indiciamento: ato privativo do delegado.", difficulty: "FACIL" },
    { title: "Interceptação Telefônica", textContent: "Lei 9.296/96: autorizada judicialmente para investigação criminal e instrução processual penal. Requisitos: indícios razoáveis de autoria, indispensabilidade, crime punido com reclusão. Prazo: 15 dias, renovável. Decisão fundamentada do juiz. Prova obtida sem autorização judicial é ilícita.", difficulty: "DIFICIL" },
  ],

  // FÍSICA (10 → 20 = +10)
  FISICA: [
    { title: "Ondas: Conceitos Fundamentais", textContent: "Onda é perturbação que se propaga transportando energia, não matéria. Mecânicas: precisam de meio (som). Eletromagnéticas: propagam-se no vácuo (luz). Transversais: vibração perpendicular à propagação. Longitudinais: vibração paralela. Grandezas: frequência (f), período (T=1/f), comprimento de onda (λ), velocidade (v=λf).", difficulty: "MEDIO" },
    { title: "Acústica: Som", textContent: "Som é onda mecânica longitudinal. Velocidade no ar: ~340 m/s (aumenta com temperatura). Propriedades: intensidade (forte/fraco), altura (grave/agudo, depende da frequência), timbre (qualidade, diferencia instrumentos). Frequência audível: 20 Hz a 20.000 Hz. Infrassom: < 20 Hz. Ultrassom: > 20.000 Hz.", difficulty: "FACIL" },
    { title: "Eletromagnetismo", textContent: "Carga em movimento cria campo magnético. Lei de Ampère: corrente elétrica gera campo magnético circular. Lei de Faraday: variação de fluxo magnético gera fem induzida. Lei de Lenz: corrente induzida se opõe à variação. Aplicações: transformadores, motores elétricos, geradores, indução eletromagnética.", difficulty: "DIFICIL" },
    { title: "Termodinâmica: Leis", textContent: "1ª Lei: conservação de energia. ΔU = Q - W (energia interna = calor - trabalho). 2ª Lei: calor flui espontaneamente do quente para o frio, nunca o contrário. Entropia do universo sempre aumenta. Máquina térmica: rendimento η = W/Q_quente. Rendimento máximo: ciclo de Carnot. 3ª Lei: zero absoluto inatingível.", difficulty: "DIFICIL" },
    { title: "Movimento Circular Uniforme", textContent: "Movimento com velocidade escalar constante em trajetória circular. Período (T): tempo de uma volta. Frequência (f = 1/T): voltas por segundo. Velocidade angular: ω = 2π/T = 2πf. Velocidade linear: v = ωR. Aceleração centrípeta: a = v²/R = ω²R. Força centrípeta: F = mv²/R.", difficulty: "MEDIO" },
    { title: "Lançamento de Projéteis", textContent: "Composição de MU (horizontal) e queda livre (vertical). Lançamento horizontal: vx = v₀ (constante), vy = gt, alcance = v₀√(2h/g). Lançamento oblíquo: vx = v₀cosθ, vy = v₀senθ - gt. Alcance máximo: ângulo de 45°. Altura máxima: H = v₀²sen²θ/2g. Simetria da parábola.", difficulty: "MEDIO" },
    { title: "Quantidade de Movimento e Impulso", textContent: "Quantidade de movimento (momentum): p = mv. Impulso: I = FΔt = Δp. Conservação: em sistemas isolados, a quantidade de movimento total se conserva. Colisão elástica: conserva energia cinética e momentum. Colisão inelástica: conserva apenas momentum. Perfeitamente inelástica: corpos se unem.", difficulty: "MEDIO" },
    { title: "Calorimetria", textContent: "Calor é energia transferida entre corpos com temperaturas diferentes. Calor sensível: Q = mcΔT (m: massa, c: calor específico, ΔT: variação de temperatura). Calor latente: Q = mL (mudança de estado, sem variação de temperatura). Equilíbrio térmico: Q_cedido + Q_recebido = 0. Água: c = 1 cal/g°C.", difficulty: "FACIL" },
    { title: "Espelhos Esféricos", textContent: "Côncavo: face refletora interna, convergente. Convexo: face refletora externa, divergente. Equação de Gauss: 1/f = 1/p + 1/p'. Ampliação: A = -p'/p. Focos: real (côncavo) ou virtual (convexo). Imagem real: invertida, formada por raios convergentes. Imagem virtual: direita, formada por prolongamentos.", difficulty: "MEDIO" },
    { title: "Leis de Kepler", textContent: "1ª Lei (Órbitas): planetas descrevem órbitas elípticas com o Sol em um dos focos. 2ª Lei (Áreas): a reta planeta-Sol varre áreas iguais em tempos iguais (velocidade maior perto do Sol). 3ª Lei (Períodos): T²/R³ = constante para todos os planetas. R é o semieixo maior da órbita.", difficulty: "MEDIO" },
  ],

  // QUÍMICA (10 → 20 = +10)
  QUIMICA: [
    { title: "Tabela Periódica: Organização", textContent: "Organizada por número atômico crescente. 7 períodos (linhas) e 18 famílias/grupos (colunas). Famílias 1A: metais alcalinos. 2A: alcalinoterrosos. 6A: calcogênios. 7A: halogênios. 8A/0: gases nobres. Propriedades periódicas: raio atômico, eletronegatividade, energia de ionização, afinidade eletrônica.", difficulty: "FACIL" },
    { title: "Ligações Químicas", textContent: "Iônica: transferência de elétrons (metal + ametal), forma cristais, alto ponto de fusão. Covalente: compartilhamento de elétrons (ametal + ametal), moléculas, pode ser polar ou apolar. Metálica: mar de elétrons entre cátions metálicos, condutividade elétrica e térmica, brilho, maleabilidade.", difficulty: "FACIL" },
    { title: "Estequiometria", textContent: "Cálculo de quantidades em reações químicas. Mol: 6,02×10²³ partículas (Avogadro). Massa molar: massa de 1 mol em g/mol. Volume molar (CNTP): 22,4 L/mol. Balanceamento: conservação de massa. Reagente limitante: determina a quantidade de produto. Rendimento: real/teórico × 100%.", difficulty: "MEDIO" },
    { title: "Soluções", textContent: "Mistura homogênea de soluto + solvente. Concentração comum: C = m/V (g/L). Molaridade: M = n/V (mol/L). Título: T = m_soluto/m_solução. Diluição: C₁V₁ = C₂V₂. Solubilidade: quantidade máxima dissolvida. Saturada: atingiu o limite. Supersaturada: excedeu o limite (instável).", difficulty: "MEDIO" },
    { title: "Ácidos e Bases", textContent: "Arrhenius: ácido libera H⁺ em água, base libera OH⁻. Brønsted-Lowry: ácido doa próton, base aceita próton. pH: escala de 0 a 14 (pH < 7 ácido, pH = 7 neutro, pH > 7 básico). pH = -log[H⁺]. Indicadores: fenolftaleína (rosa em base), tornassol (vermelho em ácido, azul em base).", difficulty: "MEDIO" },
    { title: "Reações Químicas: Classificação", textContent: "Síntese (A + B → AB). Decomposição (AB → A + B). Simples troca (A + BC → AC + B). Dupla troca (AB + CD → AD + CB). Oxirredução: transferência de elétrons (oxidação: perde e⁻, redução: ganha e⁻). Combustão: reação com O₂ gerando CO₂ e H₂O.", difficulty: "FACIL" },
    { title: "Cinética Química", textContent: "Estuda a velocidade das reações. Fatores que aumentam velocidade: temperatura, concentração dos reagentes, superfície de contato, catalisador. Catalisador: diminui energia de ativação sem ser consumido. Lei da velocidade: v = k[A]ᵃ[B]ᵇ. Teoria das colisões: moléculas precisam colidir com energia e orientação adequadas.", difficulty: "MEDIO" },
    { title: "Equilíbrio Químico", textContent: "Reação reversível: velocidade direta = velocidade inversa. Constante de equilíbrio: Kc = [produtos]/[reagentes]. Kc > 1: favorece produtos. Kc < 1: favorece reagentes. Princípio de Le Chatelier: sistema tende a minimizar perturbações. Aumentar concentração de reagente: desloca para produtos.", difficulty: "DIFICIL" },
    { title: "Eletroquímica", textContent: "Pilha: reação espontânea gera corrente elétrica. Ânodo: oxidação (polo negativo na pilha). Cátodo: redução (polo positivo na pilha). Eletrólise: corrente elétrica força reação não espontânea. Aplicações: galvanoplastia, produção de alumínio, baterias recarregáveis.", difficulty: "DIFICIL" },
    { title: "Química Orgânica: Hidrocarbonetos", textContent: "Compostos de carbono e hidrogênio. Alcanos: ligações simples (CₙH₂ₙ₊₂), ex: metano CH₄. Alcenos: uma dupla (CₙH₂ₙ), ex: etileno C₂H₄. Alcinos: uma tripla (CₙH₂ₙ₋₂), ex: acetileno C₂H₂. Aromáticos: anel benzênico. Nomenclatura IUPAC: prefixo (nº C) + infixo (ligação) + sufixo (função).", difficulty: "MEDIO" },
  ],

  // BIOLOGIA (10 → 20 = +10)
  BIOLOGIA: [
    { title: "Citologia: Célula Eucarionte", textContent: "Célula com núcleo delimitado por membrana nuclear. Organelas: mitocôndrias (respiração celular), ribossomos (síntese proteica), retículo endoplasmático (transporte), complexo de Golgi (secreção), lisossomos (digestão). Célula vegetal: parede celular, cloroplastos, vacúolo central. Célula animal: centríolos, lisossomos.", difficulty: "FACIL" },
    { title: "Genética: Leis de Mendel", textContent: "1ª Lei (Segregação): cada caráter é determinado por um par de fatores (genes) que se separam na formação dos gametas. 2ª Lei (Segregação Independente): genes em cromossomos diferentes segregam independentemente. Dominância: gene dominante se expressa no heterozigoto. Recessivo: só se expressa em homozigose.", difficulty: "MEDIO" },
    { title: "Ecologia: Cadeias e Teias Alimentares", textContent: "Cadeia alimentar: sequência linear de organismos. Produtores (autótrofos): fotossíntese. Consumidores primários: herbívoros. Secundários: carnívoros. Decompositores: bactérias e fungos. Teia alimentar: conjunto de cadeias interligadas. Pirâmide de energia: sempre diminui a cada nível trófico (10% de eficiência).", difficulty: "FACIL" },
    { title: "Evolução: Darwinismo", textContent: "Seleção natural: indivíduos mais adaptados ao ambiente sobrevivem e reproduzem mais (sobrevivência dos mais aptos). Variabilidade genética: mutações e recombinação. Especiação: formação de novas espécies por isolamento geográfico ou reprodutivo. Evidências: fósseis, anatomia comparada, embriologia, biologia molecular.", difficulty: "MEDIO" },
    { title: "Fisiologia Humana: Sistema Circulatório", textContent: "Coração: 4 câmaras (2 átrios, 2 ventrículos). Circulação dupla: pulmonar (coração-pulmão) e sistêmica (coração-corpo). Artérias: sangue do coração. Veias: sangue para o coração. Capilares: trocas gasosas. Sangue: plasma, hemácias (O₂), leucócitos (defesa), plaquetas (coagulação). Pressão arterial: sistólica/diastólica.", difficulty: "MEDIO" },
    { title: "Fisiologia: Sistema Nervoso", textContent: "Sistema nervoso central: encéfalo (cérebro, cerebelo, tronco encefálico) e medula espinhal. Sistema nervoso periférico: nervos e gânglios. Neurônio: corpo celular, dendritos (recebem), axônio (transmite). Sinapse: transmissão entre neurônios por neurotransmissores. Arco reflexo: resposta involuntária rápida.", difficulty: "MEDIO" },
    { title: "Biomas Brasileiros", textContent: "Amazônia: maior biodiversidade, clima equatorial, floresta densa. Cerrado: savana tropical, solo ácido, fogo natural. Mata Atlântica: 93% desmatada, hotspot de biodiversidade. Caatinga: semiárido, plantas xerófitas. Pantanal: maior área alagável, rica fauna. Pampas: campos do Sul, solo fértil.", difficulty: "FACIL" },
    { title: "Biotecnologia e Engenharia Genética", textContent: "DNA recombinante: inserir genes de um organismo em outro. Transgênicos (OGMs): organismos geneticamente modificados. PCR: amplificação de DNA. Clonagem: cópia genética. Células-tronco: diferenciação em vários tipos celulares. Terapia gênica: corrigir genes defeituosos. CRISPR: edição genômica precisa.", difficulty: "DIFICIL" },
    { title: "Microbiologia: Vírus e Bactérias", textContent: "Vírus: acelulares, parasitas intracelulares obrigatórios, DNA ou RNA, reprodução dentro de células. Doenças virais: gripe, dengue, COVID-19, AIDS. Bactérias: unicelulares, procariontes. Cocos, bacilos, espirilos. Doenças bacterianas: tuberculose, cólera, tétano. Antibióticos: combatem bactérias, não vírus.", difficulty: "FACIL" },
    { title: "Fotossíntese e Respiração Celular", textContent: "Fotossíntese: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (luz + clorofila). Ocorre nos cloroplastos. Etapas: fase clara (tilacoides) e ciclo de Calvin (estroma). Respiração celular: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energia (ATP). Ocorre nas mitocôndrias. Etapas: glicólise, ciclo de Krebs, cadeia respiratória.", difficulty: "DIFICIL" },
  ],

  // FILOSOFIA (10 → 20 = +10)
  FILOSOFIA: [
    { title: "Filosofia Antiga: Sócrates", textContent: "Sócrates (470-399 a.C.): 'Só sei que nada sei'. Método socrático: maiêutica (arte de parir ideias) através de perguntas. Ironia socrática: fazer o interlocutor perceber suas contradições. Não deixou escritos, conhecemos por Platão e Xenofonte. Condenado à morte por 'corromper a juventude'.", difficulty: "FACIL" },
    { title: "Platão: Mundo das Ideias", textContent: "Platão (428-348 a.C.): discípulo de Sócrates. Teoria das Ideias/Formas: o mundo sensível é cópia imperfeita do mundo inteligível (das Ideias). Alegoria da Caverna: prisioneiros veem sombras e as tomam por realidade. O filósofo é quem sai da caverna e contempla a verdade. Fundou a Academia.", difficulty: "MEDIO" },
    { title: "Aristóteles: Lógica e Ética", textContent: "Aristóteles (384-322 a.C.): discípulo de Platão. Criou a lógica formal (silogismo). Ética das virtudes: felicidade (eudaimonia) alcançada pela prática da virtude (justo meio entre extremos). Política: 'homem é animal político'. Classificou formas de governo. Fundou o Liceu.", difficulty: "MEDIO" },
    { title: "Filosofia Medieval: Santo Agostinho e Tomás de Aquino", textContent: "Santo Agostinho (354-430): conciliou platonismo e cristianismo. Teoria da iluminação divina. Cidade de Deus vs Cidade dos Homens. São Tomás de Aquino (1225-1274): conciliou aristotelismo e cristianismo. Cinco vias para provar a existência de Deus. Escolástica: razão a serviço da fé.", difficulty: "MEDIO" },
    { title: "Racionalismo: Descartes", textContent: "René Descartes (1596-1650): 'Penso, logo existo' (Cogito ergo sum). Método da dúvida: duvidar de tudo até encontrar certeza indubitável. Dualismo: mente (res cogitans) e corpo (res extensa). Racionalismo: conhecimento vem da razão, não dos sentidos. Pai da filosofia moderna.", difficulty: "FACIL" },
    { title: "Empirismo: Locke e Hume", textContent: "John Locke (1632-1704): mente é 'tábula rasa', conhecimento vem da experiência. Empirismo: sentidos são fonte do conhecimento. David Hume (1711-1776): ceticismo radical, causalidade é hábito mental. Distinção entre impressões (vividas) e ideias (cópias das impressões). Influenciaram a ciência moderna.", difficulty: "MEDIO" },
    { title: "Kant: Crítica da Razão Pura", textContent: "Immanuel Kant (1724-1804): síntese entre racionalismo e empirismo. Conhecimento começa com a experiência, mas nem todo vem dela. Categorias a priori: espaço e tempo são formas da sensibilidade. Imperativo categórico: 'age como se a máxima da tua ação devesse se tornar lei universal'. Criticismo kantiano.", difficulty: "DIFICIL" },
    { title: "Marx: Materialismo Histórico", textContent: "Karl Marx (1818-1883): a história é movida pela luta de classes. Infraestrutura econômica determina a superestrutura (cultura, política, direito). Mais-valia: exploração do trabalho pelo capital. Alienação: trabalhador não se reconhece no produto. Socialismo como superação do capitalismo.", difficulty: "MEDIO" },
    { title: "Existencialismo: Sartre", textContent: "Jean-Paul Sartre (1905-1980): 'A existência precede a essência'. O ser humano primeiro existe, depois se define por suas escolhas. Liberdade radical: estamos 'condenados a ser livres'. Má-fé: negar a própria liberdade. Angústia: consciência da responsabilidade total. O outro como limitação da liberdade.", difficulty: "MEDIO" },
    { title: "Ética: Utilitarismo", textContent: "Jeremy Bentham e John Stuart Mill: a ação moralmente correta é a que produz maior felicidade para o maior número de pessoas. Princípio da utilidade: maximizar prazer e minimizar dor. Mill distingue prazeres superiores (intelectuais) e inferiores (corporais). Base para políticas públicas e legislação.", difficulty: "MEDIO" },
  ],

  // SOCIOLOGIA (10 → 20 = +10)
  SOCIOLOGIA: [
    { title: "Émile Durkheim: Fato Social", textContent: "Durkheim (1858-1917): pai da sociologia como ciência. Fato social: maneiras de agir, pensar e sentir exteriores ao indivíduo, dotadas de poder coercitivo. Características: exterioridade, coercitividade, generalidade. Solidariedade mecânica (semelhança) e orgânica (interdependência). Anomia: ausência de normas.", difficulty: "MEDIO" },
    { title: "Max Weber: Ação Social", textContent: "Weber (1864-1920): sociologia compreensiva. Ação social: comportamento orientado pelo comportamento dos outros. Tipos: racional com relação a fins, racional com relação a valores, afetiva, tradicional. Tipos ideais: modelos analíticos. Burocracia: racionalização da administração. Ética protestante e o espírito do capitalismo.", difficulty: "MEDIO" },
    { title: "Karl Marx: Classes Sociais", textContent: "Marx (1818-1883): a sociedade se divide em classes conforme a relação com os meios de produção. Burguesia: proprietária. Proletariado: vende força de trabalho. Luta de classes é o motor da história. Ideologia: conjunto de ideias da classe dominante que se apresentam como universais. Infraestrutura e superestrutura.", difficulty: "MEDIO" },
    { title: "Desigualdade Social no Brasil", textContent: "Brasil é um dos países mais desiguais do mundo. Índice de Gini mede concentração de renda. Desigualdade racial: população negra com menores indicadores sociais. Desigualdade de gênero: mulheres ganham menos que homens. Desigualdade regional: Sudeste concentra riqueza. Políticas: Bolsa Família, cotas, salário mínimo.", difficulty: "FACIL" },
    { title: "Cultura e Indústria Cultural", textContent: "Cultura: conjunto de valores, crenças, costumes, arte de um grupo. Etnocentrismo: julgar outras culturas pela própria. Relativismo cultural: compreender cada cultura em seu contexto. Indústria cultural (Adorno e Horkheimer): produção em massa de bens culturais padronizados, alienação, transformar cultura em mercadoria.", difficulty: "MEDIO" },
    { title: "Movimentos Sociais", textContent: "Ações coletivas organizadas para mudança social. Tipos: trabalhistas (sindicatos), ambientalistas, feministas, LGBTQIA+, antirracistas, sem-terra (MST), sem-teto (MTST). Novos movimentos sociais: identidade, reconhecimento, direitos. Redes sociais amplificam mobilização. Papel na democracia: pressão por políticas públicas.", difficulty: "FACIL" },
    { title: "Estado e Poder", textContent: "Estado: monopólio legítimo da violência (Weber). Três poderes: Executivo, Legislativo, Judiciário (Montesquieu). Democracia: governo do povo. Autoritarismo: concentração de poder sem participação. Totalitarismo: controle total da vida social. Cidadania: direitos civis, políticos e sociais (T.H. Marshall).", difficulty: "MEDIO" },
    { title: "Trabalho e Sociedade", textContent: "Trabalho é central na organização social. Taylorismo: divisão científica do trabalho. Fordismo: produção em massa, linha de montagem. Toyotismo: produção flexível, just-in-time. Precarização: informalidade, uberização, trabalho sem direitos. Desemprego estrutural: tecnologia substitui trabalhadores.", difficulty: "MEDIO" },
    { title: "Violência e Segurança Pública", textContent: "Brasil: altas taxas de homicídio, concentradas em jovens negros periféricos. Violência estrutural: desigualdade, exclusão. Violência simbólica (Bourdieu): imposição de cultura dominante. Encarceramento em massa: 3ª maior população carcerária. Debate: policiamento comunitário vs repressão, causas sociais da criminalidade.", difficulty: "MEDIO" },
    { title: "Globalização e Identidade", textContent: "Globalização intensifica fluxos de informação, mercadorias e pessoas. Homogeneização cultural: padrões globais (americanização). Resistência: valorização de culturas locais, hibridismo cultural. Identidade: construção social, múltipla, fluida. Pós-modernidade: fragmentação de identidades, sociedade líquida (Bauman).", difficulty: "DIFICIL" },
  ],

  // LITERATURA (10 → 20 = +10)
  LITERATURA: [
    { title: "Quinhentismo e Barroco", textContent: "Quinhentismo (1500-1601): literatura informativa (Carta de Caminha) e catequética (Padre Anchieta). Barroco (1601-1768): dualismo entre fé e razão, linguagem rebuscada, antíteses, cultismo (jogos de palavras) e conceptismo (jogos de ideias). Autores: Gregório de Matos (poesia), Padre Antônio Vieira (sermões).", difficulty: "MEDIO" },
    { title: "Arcadismo", textContent: "Arcadismo (1768-1836): reação ao Barroco. Valorização da simplicidade, natureza, vida pastoril. Lema: Inutilia Truncat (cortar o inútil). Fugere urbem (fugir da cidade). Carpe diem (aproveitar o momento). Autores: Cláudio Manuel da Costa, Tomás Antônio Gonzaga (Marília de Dirceu), Basílio da Gama (O Uraguai).", difficulty: "MEDIO" },
    { title: "Romantismo Brasileiro", textContent: "Romantismo (1836-1881): subjetivismo, idealização, nacionalismo. 1ª geração: indianismo, nacionalismo (Gonçalves Dias: Canção do Exílio). 2ª geração: ultrarromantismo, mal do século, morte (Álvares de Azevedo). 3ª geração: condoreirismo, abolição (Castro Alves: Navio Negreiro). Prosa: José de Alencar (Iracema, Senhora).", difficulty: "MEDIO" },
    { title: "Realismo e Naturalismo", textContent: "Realismo (1881-1893): objetividade, crítica social, análise psicológica. Machado de Assis: maior escritor brasileiro (Memórias Póstumas de Brás Cubas, Dom Casmurro). Naturalismo: determinismo biológico e social, temas polêmicos. Aluísio Azevedo: O Cortiço. Raul Pompeia: O Ateneu.", difficulty: "MEDIO" },
    { title: "Modernismo: 1ª Fase", textContent: "Semana de Arte Moderna (1922): ruptura com tradição acadêmica. Liberdade formal, linguagem coloquial, temas nacionais. Oswald de Andrade: Manifesto Antropófago, Pau-Brasil. Mário de Andrade: Macunaíma, Paulicéia Desvairada. Manuel Bandeira: Libertinagem. Irreverência, humor, paródia.", difficulty: "MEDIO" },
    { title: "Modernismo: 2ª Fase", textContent: "Romance de 30: regionalismo, denúncia social, seca, miséria. Graciliano Ramos: Vidas Secas, São Bernardo. Jorge Amado: Capitães da Areia, Gabriela. Rachel de Queiroz: O Quinze. José Lins do Rego: Menino de Engenho. Poesia: Carlos Drummond de Andrade (Sentimento do Mundo), Cecília Meireles, Vinícius de Moraes.", difficulty: "MEDIO" },
    { title: "Modernismo: 3ª Fase e Contemporâneos", textContent: "Geração de 45: experimentalismo formal. João Cabral de Melo Neto: Morte e Vida Severina (poesia antilírica). Guimarães Rosa: Grande Sertão: Veredas (renovação da linguagem). Clarice Lispector: A Hora da Estrela (introspecção). Contemporâneos: Rubem Fonseca, Lygia Fagundes Telles, Caio Fernando Abreu.", difficulty: "DIFICIL" },
    { title: "Gêneros Literários", textContent: "Lírico: expressão de sentimentos, subjetivo (poemas). Épico/Narrativo: conta histórias (romances, contos, crônicas, novelas). Dramático: representação teatral (tragédia, comédia, drama). Elementos da narrativa: narrador, personagem, tempo, espaço, enredo. Figuras de linguagem são transversais a todos os gêneros.", difficulty: "FACIL" },
    { title: "Parnasianismo e Simbolismo", textContent: "Parnasianismo (1882): arte pela arte, perfeição formal, temas clássicos, objetividade. Olavo Bilac: Via Láctea. Alberto de Oliveira, Raimundo Correia. Simbolismo (1893): musicalidade, subjetividade, misticismo, sinestesia, sugestão. Cruz e Sousa: Broquéis. Alphonsus de Guimaraens.", difficulty: "MEDIO" },
    { title: "Interpretação de Textos Literários", textContent: "Elementos para análise: contexto histórico, movimento literário, estilo do autor, figuras de linguagem, tema central. Intertextualidade: diálogo entre textos. Metalinguagem: texto sobre o próprio texto. Ironia: dizer o oposto. Ambiguidade: múltiplos sentidos. Em provas: relacionar forma e conteúdo.", difficulty: "FACIL" },
  ],

  // ATUALIDADES (10 → 20 = +10)
  ATUALIDADES: [
    { title: "Crise Climática Global", textContent: "Aquecimento global causado por emissão de gases de efeito estufa (CO₂, metano). Acordo de Paris (2015): limitar aquecimento a 1,5°C. Consequências: derretimento de geleiras, elevação do nível do mar, eventos extremos, desertificação. COP: Conferência das Partes da ONU sobre clima. Transição energética é urgente.", difficulty: "MEDIO" },
    { title: "Inteligência Artificial e Sociedade", textContent: "IA está transformando trabalho, educação, saúde e segurança. ChatGPT e IA generativa: criação de textos, imagens, código. Debates: substituição de empregos, deepfakes, privacidade, viés algorítmico. Regulamentação: União Europeia lidera com AI Act. Impacto em concursos: novas competências exigidas.", difficulty: "MEDIO" },
    { title: "Conflitos Geopolíticos Atuais", textContent: "Guerra Rússia-Ucrânia (2022-): invasão russa, sanções ocidentais, crise energética na Europa, reorganização de alianças. Tensões China-Taiwan: disputa de soberania. Conflito Israel-Palestina: escalada em 2023-24. BRICS expandido: novo eixo geopolítico. Multipolaridade vs hegemonia americana.", difficulty: "MEDIO" },
    { title: "Reforma Tributária no Brasil", textContent: "EC 132/2023: maior reforma tributária em décadas. Substituição de 5 tributos (PIS, Cofins, IPI, ICMS, ISS) por 2: IBS (estadual/municipal) e CBS (federal). Imposto seletivo sobre produtos nocivos. Cashback para população de baixa renda. Transição gradual até 2033. Objetivo: simplificar e reduzir litigiosidade.", difficulty: "MEDIO" },
    { title: "Pandemia e Pós-Pandemia", textContent: "COVID-19 (2020-2023): maior crise sanitária em um século. Vacinação em massa permitiu controle. Legados: trabalho remoto/híbrido, telemedicina, educação a distância, aceleração digital. Desafios pós-pandemia: saúde mental, recuperação econômica, desigualdade ampliada, preparação para futuras pandemias.", difficulty: "FACIL" },
    { title: "Segurança Pública no Brasil", textContent: "Brasil: cerca de 45 mil homicídios/ano. Perfil das vítimas: jovens, negros, periféricos. Debate: policiamento comunitário vs ostensivo. Uso de câmeras corporais por policiais. Sistema penitenciário superlotado. Facções criminosas. Políticas: integração entre forças de segurança, inteligência, prevenção social.", difficulty: "MEDIO" },
    { title: "Meio Ambiente no Brasil: Desmatamento", textContent: "Amazônia: desmatamento acelerado e posterior redução. Cerrado: avanço do agronegócio. Queimadas: Pantanal e Amazônia. Fiscalização: IBAMA, ICMBio. Código Florestal: reserva legal (80% na Amazônia). CAR: Cadastro Ambiental Rural. Créditos de carbono: mercado em crescimento. Pressão internacional.", difficulty: "MEDIO" },
    { title: "Economia Brasileira Atual", textContent: "PIB brasileiro: entre as 10 maiores economias. Agronegócio: principal setor exportador. Inflação: meta de 3% (Banco Central). Taxa Selic: instrumento de política monetária. Dívida pública: debate sobre teto de gastos. Reforma tributária e previdenciária. Reindustrialização e transição energética como desafios.", difficulty: "MEDIO" },
    { title: "Tecnologia e Privacidade Digital", textContent: "LGPD (Lei 13.709/2018): proteção de dados pessoais no Brasil. Dados pessoais: informações que identificam uma pessoa. Consentimento: base legal principal. ANPD: Autoridade Nacional de Proteção de Dados. GDPR: legislação europeia similar. Vazamentos de dados: responsabilização das empresas. Direito ao esquecimento.", difficulty: "MEDIO" },
    { title: "Educação no Brasil: Desafios", textContent: "IDEB: Índice de Desenvolvimento da Educação Básica. PISA: avaliação internacional (Brasil abaixo da média OCDE). Evasão escolar: 2 milhões de jovens fora da escola. Analfabetismo funcional: 29% da população. Ensino técnico: expansão necessária. Políticas de acesso ao ensino superior em expansão. Educação a distância em crescimento.", difficulty: "FACIL" },
  ],

  // ADMINISTRAÇÃO PÚBLICA (10 → 20 = +10)
  ADMINISTRACAO: [
    { title: "Modelos de Administração Pública", textContent: "Patrimonialista: Estado como extensão do poder do soberano, nepotismo, corrupção. Burocrático (Weber): impessoalidade, formalismo, hierarquia, meritocracia. Gerencial (New Public Management): foco em resultados, eficiência, descentralização, controle a posteriori. Governance: participação social, redes, transparência.", difficulty: "MEDIO" },
    { title: "Planejamento Governamental", textContent: "PPA (Plano Plurianual): 4 anos, diretrizes, objetivos e metas. LDO (Lei de Diretrizes Orçamentárias): anual, metas e prioridades. LOA (Lei Orçamentária Anual): receitas e despesas. Ciclo orçamentário: elaboração, aprovação, execução, controle. Princípios: unidade, universalidade, anualidade, exclusividade.", difficulty: "MEDIO" },
    { title: "Gestão de Pessoas no Setor Público", textContent: "Recrutamento: concurso público (regra), processo seletivo simplificado (temporários). Capacitação: escolas de governo, educação continuada. Avaliação de desempenho: estágio probatório, progressão funcional. Gestão por competências: conhecimentos, habilidades e atitudes (CHA). Motivação e clima organizacional.", difficulty: "FACIL" },
    { title: "Governança e Accountability", textContent: "Governança: conjunto de mecanismos de liderança, estratégia e controle. Accountability: prestação de contas e responsabilização. Tipos: vertical (eleições), horizontal (entre poderes), social (sociedade civil). Transparência: Lei de Acesso à Informação (LAI). Portal da Transparência. Ouvidorias públicas.", difficulty: "MEDIO" },
    { title: "Políticas Públicas: Ciclo", textContent: "Formação de agenda: identificação do problema. Formulação: análise de alternativas e decisão. Implementação: execução da política. Avaliação: verificação de resultados. Tipos: distributivas (benefícios a grupos), redistributivas (transferência de recursos), regulatórias (regras), constitutivas (procedimentos).", difficulty: "MEDIO" },
    { title: "Lei de Responsabilidade Fiscal", textContent: "LC 101/2000: normas de finanças públicas. Limites de gastos com pessoal: 50% da receita (União), 60% (Estados e Municípios). Limite de endividamento. Metas fiscais na LDO. Vedação de operações de crédito entre entes. Transparência fiscal obrigatória. Descumprimento: sanções pessoais e institucionais.", difficulty: "DIFICIL" },
    { title: "E-Government: Governo Digital", textContent: "Uso de tecnologia para melhorar serviços públicos. Gov.br: plataforma única de serviços federais. Identidade digital: CPF como chave. Assinatura eletrônica: validade jurídica. Dados abertos: transparência e inovação. Inclusão digital: desafio de acesso. Inteligência artificial na administração: chatbots, análise de dados.", difficulty: "FACIL" },
    { title: "Gestão de Projetos no Setor Público", textContent: "Projeto: esforço temporário para resultado único. Metodologias: PMBOK (waterfall), ágeis (Scrum). Fases: iniciação, planejamento, execução, monitoramento, encerramento. Escritório de projetos (PMO): governança. Indicadores: prazo, custo, qualidade, escopo. Gestão de riscos: identificar, analisar, responder.", difficulty: "MEDIO" },
    { title: "Controle Social e Participação", textContent: "Mecanismos de participação: conselhos de políticas públicas, conferências, audiências públicas, orçamento participativo. Controle social: fiscalização da administração pela sociedade. Instrumentos: LAI, Portal da Transparência, ouvidorias. Organizações sociais e OSCIPs: parcerias com o terceiro setor.", difficulty: "FACIL" },
    { title: "Licitações: Nova Lei (14.133/2021)", textContent: "Modalidades: pregão (mais usado), concorrência, concurso, leilão, diálogo competitivo. Critérios de julgamento: menor preço, melhor técnica, técnica e preço, maior retorno econômico. Dispensa e inexigibilidade de licitação. Fase preparatória obrigatória com estudo técnico preliminar. Portal Nacional de Contratações Públicas.", difficulty: "DIFICIL" },
  ],

  // LEGISLAÇÃO ESPECIAL (10 → 20 = +10)
  LEGISLACAO_ESPECIAL: [
    { title: "Estatuto do Desarmamento (Lei 10.826/2003)", textContent: "Regula posse e porte de armas de fogo. Posse: manter em residência/local de trabalho (autorização do Sinarm, 25+ anos). Porte: transportar fora (restrito a categorias). Crimes: posse ilegal (1-3 anos), porte ilegal (2-4 anos), tráfico internacional (4-8 anos). Arma de uso restrito: pena maior.", difficulty: "MEDIO" },
    { title: "Lei de Abuso de Autoridade (Lei 13.869/2019)", textContent: "Tipifica crimes de abuso de autoridade por agentes públicos. Necessário elemento subjetivo: finalidade específica de prejudicar, beneficiar-se ou por capricho. Crimes: decretação de medida privativa sem fundamentação, constrangimento de preso, violação de domicílio funcional. Penas: 1 a 4 anos conforme o crime.", difficulty: "MEDIO" },
    { title: "Lei de Tortura (Lei 9.455/1997)", textContent: "Crime inafiançável e insuscetível de graça ou anistia. Constranger mediante violência ou grave ameaça, causando sofrimento físico ou mental para obter confissão, provocar ação/omissão criminosa, ou por discriminação. Pena: 2 a 8 anos. Qualificada (lesão grave ou morte): 4 a 10 anos ou 8 a 16 anos.", difficulty: "DIFICIL" },
    { title: "Código de Trânsito Brasileiro (Lei 9.503/1997)", textContent: "CTB regula trânsito de veículos e pedestres. Infrações: leve (3 pontos), média (4), grave (5), gravíssima (7). Cassação: acumular 20 pontos em 12 meses. Crimes de trânsito: homicídio culposo (2-4 anos), embriaguez ao volante (6m-3 anos), racha (6m-3 anos). CONTRAN: órgão normativo máximo.", difficulty: "MEDIO" },
    { title: "Lei Antidrogas: Aspectos Penais", textContent: "Lei 11.343/2006. Usuário (art. 28): advertência, prestação de serviços, comparecimento a programa educativo - sem pena privativa de liberdade. Tráfico (art. 33): 5-15 anos, multa. Associação (art. 35): 3-10 anos. Tráfico privilegiado: réu primário, bons antecedentes, não integra organização - redução de 1/6 a 2/3.", difficulty: "DIFICIL" },
    { title: "Lei de Improbidade Administrativa", textContent: "Lei 8.429/1992 (alterada pela Lei 14.230/2021). Atos: enriquecimento ilícito (dolo), prejuízo ao erário (dolo), violação de princípios (dolo). Exige dolo específico após reforma. Sanções: perda de função, suspensão de direitos políticos, multa, proibição de contratar. Ação de improbidade: prazo de 8 anos.", difficulty: "DIFICIL" },
    { title: "Lei de Acesso à Informação (LAI)", textContent: "Lei 12.527/2011: regula acesso a informações públicas. Princípio: publicidade é regra, sigilo é exceção. Qualquer pessoa pode solicitar sem justificativa. Prazo: 20 dias (prorrogável por 10). Classificação: ultrassecreta (25 anos), secreta (15 anos), reservada (5 anos). Transparência ativa: divulgação independente de solicitação.", difficulty: "FACIL" },
    { title: "Lei de Organizações Criminosas (Lei 12.850/2013)", textContent: "Define organização criminosa: 4+ pessoas, estruturada, com divisão de tarefas, para obter vantagem mediante infrações com pena máxima > 4 anos. Meios de prova: colaboração premiada, captação ambiental, infiltração de agentes, interceptação. Colaboração premiada: redução de pena, perdão judicial ou substituição.", difficulty: "DIFICIL" },
    { title: "Estatuto da Pessoa com Deficiência", textContent: "Lei 13.146/2015 (Lei Brasileira de Inclusão). Pessoa com deficiência: impedimento de longo prazo que dificulta participação plena. Direitos: acessibilidade, educação inclusiva, trabalho, saúde, moradia. Cotas em empresas com 100+ empregados. Reserva de vagas em concursos: 5% a 20%. Capacidade civil plena.", difficulty: "FACIL" },
    { title: "Lei Anticorrupção (Lei 12.846/2013)", textContent: "Responsabilidade objetiva de pessoas jurídicas por atos contra a Administração Pública. Não precisa provar culpa da empresa. Sanções administrativas: multa de 0,1% a 20% do faturamento. Programa de integridade (compliance): atenuante. Acordo de leniência: redução de penas em troca de colaboração. CGU: órgão competente na esfera federal.", difficulty: "MEDIO" },
  ],

  // LEGISLAÇÃO DE TRÂNSITO (10 → 20 = +10)
  LEGISLACAO_TRANSITO: [
    { title: "Sistema Nacional de Trânsito", textContent: "Composto por: CONTRAN (normas), DENATRAN/SENATRAN (coordenação), DETRANs (estaduais), JARI (recursos), PRF e PMs (fiscalização). Competência municipal: engenharia de tráfego, sinalização, fiscalização em vias urbanas. Estados: fiscalização em rodovias estaduais. União: rodovias federais.", difficulty: "FACIL" },
    { title: "Habilitação para Dirigir", textContent: "Categorias: A (moto), B (carro até 8 passageiros), C (carga > 3.500kg), D (passageiros > 8), E (articulado/reboque). Permissão para Dirigir (PPD): 1 ano após aprovação. CNH definitiva: se não cometer infração grave ou gravíssima. Renovação: 10 anos (até 50 anos), 5 anos (50-70), 3 anos (70+).", difficulty: "FACIL" },
    { title: "Infrações de Trânsito", textContent: "Classificação: leve (3 pontos, R$88,38), média (4 pontos, R$130,16), grave (5 pontos, R$195,23), gravíssima (7 pontos, R$293,47). Gravíssima com fator multiplicador: dirigir sem CNH (×3), velocidade >50% acima (×3). Suspensão: 20+ pontos em 12 meses. Medida administrativa: recolhimento do documento, remoção do veículo.", difficulty: "MEDIO" },
    { title: "Crimes de Trânsito", textContent: "Homicídio culposo no trânsito (art. 302): 2-4 anos. Lesão corporal culposa (art. 303): 6 meses a 2 anos. Embriaguez ao volante (art. 306): 6 meses a 3 anos. Participação em racha (art. 308): 6 meses a 3 anos. Fuga do local de acidente (art. 305): 6 meses a 1 ano. Direção sem habilitação gerando perigo (art. 309).", difficulty: "MEDIO" },
    { title: "Sinalização de Trânsito", textContent: "Sinalização vertical: regulamentação (R, fundo branco/vermelho), advertência (A, fundo amarelo), indicação (fundo verde/azul/marrom). Sinalização horizontal: faixas, marcas no pavimento. Branca: regulamenta fluxos de mesmo sentido. Amarela: fluxos opostos. Semáforo: vermelho (pare), amarelo (atenção), verde (siga). Gestos de agentes.", difficulty: "FACIL" },
    { title: "Direção Defensiva", textContent: "Conjunto de técnicas para prevenir acidentes. Pilares: conhecimento, atenção, previsão, decisão, habilidade. Distância de seguimento: regra dos 2 segundos (3 em chuva). Condições adversas: chuva, neblina, noite, pista molhada. Aquaplanagem: pneus perdem contato com o pavimento. Ponto cego: áreas não visíveis pelos retrovisores.", difficulty: "FACIL" },
    { title: "Primeiros Socorros no Trânsito", textContent: "Art. 176 CTB: omissão de socorro é infração gravíssima. Sinalizar o local, chamar socorro (192/193), não movimentar vítima com suspeita de lesão na coluna. PAS: Proteger, Avaliar, Socorrer. Verificar consciência e respiração. RCP: 30 compressões torácicas + 2 ventilações. Não dar líquidos a vítima inconsciente.", difficulty: "FACIL" },
    { title: "Meio Ambiente e Trânsito", textContent: "Veículos são fonte significativa de poluição atmosférica. Programa de Controle da Poluição do Ar por Veículos (PROCONVE). Inspeção Veicular: emissão de gases e ruídos. Rodízio de veículos: São Paulo. Combustíveis: etanol (menos poluente), biodiesel, veículos elétricos. CTB art. 104: condições de emissão de poluentes.", difficulty: "MEDIO" },
    { title: "Responsabilidade Civil e Criminal no Trânsito", textContent: "Responsabilidade civil: reparação de danos (material e moral). DPVAT/SPVAT: seguro obrigatório para vítimas. Responsabilidade criminal: crimes de trânsito (pena privativa de liberdade). Circunstâncias agravantes: embriaguez, excesso de velocidade, faixa de pedestres. Penas alternativas: prestação de serviços, suspensão da CNH.", difficulty: "MEDIO" },
    { title: "Veículos: Requisitos e Equipamentos", textContent: "Equipamentos obrigatórios: cinto de segurança, espelhos retrovisores, extintor (revogado para particulares), triângulo, macaco, chave de roda. Crianças: cadeirinha até 4 anos, assento elevado 4-7,5 anos, banco traseiro até 10 anos. Película: 75% de transparência (para-brisa), 70% (laterais dianteiras). CRLV e licenciamento anual.", difficulty: "FACIL" },
  ],

  // REDAÇÃO (10 → 20 = +10)
  REDACAO: [
    { title: "Estrutura da Dissertação-Argumentativa", textContent: "Formato padrão de redação para concursos públicos. Introdução: contextualização + tese (posicionamento). Desenvolvimento (2-3 parágrafos): argumentos com evidências. Conclusão: retomada da tese + proposta de intervenção. Estrutura: apresentação → argumentação → conclusão. Mínimo: 20 linhas. Máximo: 30 linhas.", difficulty: "FACIL" },
    { title: "Competências da Redação em Concursos", textContent: "5 competências comuns em bancas (CESPE, FCC): C1 (norma culta), C2 (compreensão do tema e gênero dissertativo), C3 (organização e argumentação), C4 (coesão textual: conectivos), C5 (proposta de intervenção: agente, ação, meio, detalhamento, finalidade). Fuga ao tema ou texto insuficiente podem zerar a redação.", difficulty: "MEDIO" },
    { title: "Introdução: Técnicas de Abertura", textContent: "Contextualização histórica: partir de um fato do passado. Citação: frase de autor relevante. Dados estatísticos: números que impressionam. Alusão cultural: filme, livro, música. Pergunta retórica: questionamento para reflexão. Declaração impactante: afirmação forte. Tese deve estar clara no final da introdução.", difficulty: "FACIL" },
    { title: "Desenvolvimento: Estratégias Argumentativas", textContent: "Argumento de autoridade: citação de especialista. Argumento por exemplificação: caso concreto. Argumento por comparação: relação entre situações. Argumento de causa-consequência: cadeia lógica. Argumento por dados estatísticos: números e pesquisas. Cada parágrafo: tópico frasal + desenvolvimento + conclusão parcial.", difficulty: "MEDIO" },
    { title: "Conectivos e Coesão Textual", textContent: "Adição: além disso, ademais, outrossim. Oposição: entretanto, contudo, todavia, porém. Causa: pois, visto que, uma vez que. Consequência: logo, portanto, destarte. Exemplificação: por exemplo, como, a título de ilustração. Conclusão: em suma, por fim, em síntese. Usar variados evita repetição.", difficulty: "FACIL" },
    { title: "Proposta de Intervenção em Redação", textContent: "Frequente na conclusão de provas discursivas. 5 elementos: agente (quem vai agir: governo, escola, sociedade), ação (o que fazer), meio/modo (como), detalhamento (especificar um dos elementos), finalidade (para quê). Deve respeitar direitos humanos. Proposta genérica perde pontos. Quanto mais específica e viável, melhor.", difficulty: "MEDIO" },
    { title: "Erros Gramaticais Frequentes em Redações", textContent: "Crase indevida. Concordância verbal/nominal incorreta. Regência verbal errada (aspirar, visar, assistir). Uso inadequado de 'onde' (só para lugar). 'A nível de' (incorreto), 'em nível de' (correto). Gerundismo ('vou estar fazendo'). Vírgula entre sujeito e verbo. Mau/mal, mais/mas, há/a.", difficulty: "FACIL" },
    { title: "Repertório Sociocultural", textContent: "Referências que enriquecem a argumentação. Filósofos: Bauman (modernidade líquida), Foucault (poder), Kant (imperativo categórico). Sociólogos: Durkheim (anomia), Weber (racionalização). Obras: 1984 (Orwell), Admirável Mundo Novo (Huxley). Dados: IBGE, ONU, OMS. Legislação: CF, ECA, LGPD. Filmes e séries também valem.", difficulty: "MEDIO" },
    { title: "Temas Frequentes de Redação em Concursos", textContent: "Segurança pública, reforma do Estado, ética no serviço público, combate à corrupção, direitos fundamentais, saúde mental, tecnologia e privacidade, violência urbana, educação, meio ambiente, invisibilidade social. Dica: ler notícias, editais e provas anteriores da banca. Manter repertório atualizado com dados e citações.", difficulty: "MEDIO" },
    { title: "Revisão e Reescrita", textContent: "Após escrever o rascunho: verificar ortografia e acentuação, conferir concordância, eliminar repetições (usar sinônimos), checar coesão entre parágrafos, verificar se a tese está clara, avaliar se os argumentos sustentam a tese, confirmar proposta de intervenção completa. Passar a limpo com letra legível.", difficulty: "FACIL" },
  ],

  // NOÇÕES DE AVIAÇÃO CIVIL (10 → 20 = +10)
  NOCOES_AVIACAO: [
    { title: "ANAC: Estrutura e Competências", textContent: "Agência Nacional de Aviação Civil: autarquia federal vinculada ao Ministério de Portos e Aeroportos. Competências: regular e fiscalizar aviação civil e infraestrutura aeroportuária, certificar aeronaves e empresas aéreas, homologar aeródromos, regular serviços aéreos. Diretoria colegiada com 3 membros, mandato de 5 anos.", difficulty: "FACIL" },
    { title: "Código Brasileiro de Aeronáutica", textContent: "Lei 7.565/1986: regula o espaço aéreo, aeronaves, infraestrutura e serviços aéreos. Espaço aéreo brasileiro é soberano. Aeronave: aparelho que pode sustentar-se na atmosfera. Registro de aeronaves: RAB (Registro Aeronáutico Brasileiro). Responsabilidade do comandante: autoridade máxima a bordo.", difficulty: "MEDIO" },
    { title: "Segurança de Voo: CENIPA", textContent: "Centro de Investigação e Prevenção de Acidentes Aeronáuticos. Investiga acidentes e incidentes aeronáuticos. Objetivo: prevenção (não punição). Relatório Final: recomendações de segurança. SIPAER: Sistema de Investigação e Prevenção. Cultura de segurança: relato voluntário de ocorrências. Fator humano: principal causa de acidentes.", difficulty: "MEDIO" },
    { title: "Regulamentos Brasileiros da Aviação Civil", textContent: "RBAC: normas técnicas da ANAC. RBAC 01: definições. RBAC 61: licenças e habilitações de tripulantes. RBAC 91: regras gerais de operação. RBAC 121: operações domésticas e internacionais regulares. RBAC 135: operações complementares. RBAC 137: operações aeroagrícolas. Harmonização com normas ICAO.", difficulty: "DIFICIL" },
    { title: "Direitos dos Passageiros", textContent: "Resolução ANAC 400/2016: atraso > 1h: comunicação. > 2h: alimentação. > 4h: reacomodação, reembolso ou execução por outro meio. Cancelamento: mesmos direitos + assistência material. Overbooking: procurar voluntários primeiro, compensação obrigatória. Bagagem: 10kg de mão, 23kg despachada (voos domésticos).", difficulty: "FACIL" },
    { title: "ICAO: Organização da Aviação Civil Internacional", textContent: "Agência da ONU criada pela Convenção de Chicago (1944). 193 países membros. Estabelece SARPs (Standards and Recommended Practices): padrões internacionais de segurança, navegação aérea, facilitação. 19 Anexos técnicos. Brasil é membro fundador. OACI em português. Idiomas oficiais: inglês, francês, espanhol, russo, chinês, árabe.", difficulty: "MEDIO" },
    { title: "Aeródromos e Aeroportos", textContent: "Aeródromo: área destinada a pouso e decolagem. Aeroporto: aeródromo público com instalações para embarque/desembarque. Classificação: civil (público ou privado) e militar. Infraero e concessionárias privadas operam os principais. Pista de pouso: comprimento varia com altitude e temperatura. Luzes de aproximação e sinalização.", difficulty: "FACIL" },
    { title: "Espaço Aéreo Brasileiro", textContent: "Dividido em regiões de informação de voo (FIR): Amazônica, Recife, Brasília, Curitiba, Atlântico. DECEA: Departamento do Controle do Espaço Aéreo. Classes de espaço aéreo: A a G (diferentes regras de voo IFR/VFR). Controle de tráfego: ACC (rota), APP (aproximação), TWR (torre/aeródromo).", difficulty: "DIFICIL" },
    { title: "Transporte Aéreo: Modalidades", textContent: "Regular: horários e rotas fixos, venda ao público. Não regular: charter, táxi aéreo. Serviço aéreo especializado: agrícola, fotografia, combate a incêndio. Aviação geral: privada, instrução, recreativa. Concessão: ato da ANAC para operar linhas regulares. Liberdades do ar: bilateral e multilateral.", difficulty: "MEDIO" },
    { title: "Profissionais da Aviação Civil", textContent: "Piloto: licenças PP (privado), PC (comercial), PLA (linha aérea). Comissário de voo: segurança e atendimento a bordo. Mecânico de manutenção: certificação ANAC. Despachante operacional de voo: planejamento. Controlador de tráfego aéreo: DECEA. AEROVIÁRIO: trabalhador de empresa de transporte aéreo.", difficulty: "FACIL" },
  ],
};

// ============================================
// EXECUÇÃO
// ============================================

async function expandContents() {
  console.log("=== EXPANSÃO DE CONTEÚDOS - RODADA 2 ===\n");

  let totalCreated = 0;

  for (const [subjectName, contents] of Object.entries(EXPANSION)) {
    const subjectResult = await db.execute(sql`
      SELECT id, "displayName" FROM "Subject"
      WHERE name = ${subjectName} AND "isActive" = true
      LIMIT 1
    `) as any[];

    if (subjectResult.length === 0) {
      console.log(`⚠️ Subject ${subjectName} não encontrado, pulando...`);
      continue;
    }

    const subject = subjectResult[0];
    let created = 0;

    for (const content of contents) {
      const existing = await db.execute(sql`
        SELECT id FROM "Content"
        WHERE "subjectId" = ${subject.id} AND "title" = ${content.title}
        LIMIT 1
      `) as any[];

      if (existing.length > 0) continue;

      const id = generateId();
      const wordCount = content.textContent.split(/\s+/).length;
      const readTime = Math.max(1, Math.round(wordCount / 200));

      await db.execute(sql`
        INSERT INTO "Content" (
          "id", "subjectId", "title", "textContent",
          "difficulty", "wordCount", "estimatedReadTime",
          "isActive", "version", "updatedAt"
        ) VALUES (
          ${id}, ${subject.id}, ${content.title}, ${content.textContent},
          ${content.difficulty}, ${wordCount}, ${readTime},
          true, 1, NOW()
        )
      `);

      created++;
    }

    totalCreated += created;
    console.log(`✅ ${subject.displayName}: +${created} conteúdos`);
  }

  console.log(`\n=== RESUMO ===`);
  console.log(`Total criados: ${totalCreated}`);

  const finalCount = await db.execute(sql`
    SELECT COUNT(*)::int as total FROM "Content" WHERE "isActive" = true
  `) as any[];
  console.log(`Total no banco: ${finalCount[0]?.total}`);

  const perSubject = await db.execute(sql`
    SELECT s."displayName", COUNT(c.id)::int as total
    FROM "Subject" s
    LEFT JOIN "Content" c ON c."subjectId" = s.id AND c."isActive" = true
    WHERE s."isActive" = true
    GROUP BY s."displayName"
    ORDER BY total DESC
  `) as any[];

  console.log(`\nConteúdos por Subject:`);
  for (const s of perSubject as any[]) {
    console.log(`  ${s.total.toString().padStart(3)} | ${s.displayName}`);
  }
}

expandContents()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  });
