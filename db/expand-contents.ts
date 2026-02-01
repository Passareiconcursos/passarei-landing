/**
 * Expansão de Conteúdos - Meta: ~25 conteúdos por Subject
 *
 * Estado atual: 249 conteúdos em 24 subjects (média 10)
 * Meta: ~600 conteúdos (média 25/subject)
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

// ============================================
// NOVOS CONTEÚDOS POR SUBJECT
// ============================================

const EXPANSION: Record<string, ContentItem[]> = {
  // MATEMÁTICA (atualmente 5 → meta 25 = +20)
  MATEMATICA: [
    { title: "Regra de Três Simples", textContent: "A regra de três simples resolve problemas com duas grandezas diretamente ou inversamente proporcionais. Diretamente proporcionais: ao aumentar uma, a outra aumenta na mesma proporção. Inversamente proporcionais: ao aumentar uma, a outra diminui. Multiplica-se em cruz para encontrar o valor desconhecido.", difficulty: "FACIL" },
    { title: "Porcentagem", textContent: "Porcentagem representa uma fração de denominador 100. Para calcular X% de um valor: multiplique por X e divida por 100. Aumento de 20%: multiplica por 1,20. Desconto de 15%: multiplica por 0,85. Aumentos sucessivos de 10% e 20%: multiplica por 1,10 × 1,20 = 1,32 (aumento real de 32%).", difficulty: "FACIL" },
    { title: "Equação do Primeiro Grau", textContent: "Equação com uma incógnita de expoente 1: ax + b = 0. Resolução: isolar x. Exemplo: 3x + 6 = 0, logo x = -2. Em problemas: traduzir o enunciado em linguagem matemática, definir a incógnita, montar e resolver a equação.", difficulty: "FACIL" },
    { title: "Equação do Segundo Grau", textContent: "Forma geral: ax² + bx + c = 0. Discriminante: Δ = b² - 4ac. Se Δ > 0: duas raízes reais distintas. Se Δ = 0: duas raízes iguais. Se Δ < 0: sem raízes reais. Fórmula de Bhaskara: x = (-b ± √Δ) / 2a. Soma das raízes: -b/a. Produto das raízes: c/a.", difficulty: "MEDIO" },
    { title: "Sistemas de Equações", textContent: "Sistema linear com duas equações e duas incógnitas. Métodos: substituição (isolar uma variável e substituir na outra), adição (somar equações para eliminar uma variável). Sistema possível determinado: uma solução. Possível indeterminado: infinitas soluções. Impossível: nenhuma solução.", difficulty: "MEDIO" },
    { title: "Razão e Proporção", textContent: "Razão é o quociente entre dois números (a/b). Proporção é a igualdade entre duas razões (a/b = c/d). Propriedade fundamental: a×d = b×c. Grandezas diretamente proporcionais: y/x = k (constante). Inversamente proporcionais: x×y = k. Aplicação em escalas de mapas e divisão proporcional.", difficulty: "FACIL" },
    { title: "Progressão Aritmética", textContent: "PA é uma sequência onde a diferença entre termos consecutivos é constante (razão r). Termo geral: an = a1 + (n-1)r. Soma dos n primeiros termos: Sn = (a1 + an)n/2. PA crescente: r > 0. PA decrescente: r < 0. PA constante: r = 0.", difficulty: "MEDIO" },
    { title: "Progressão Geométrica", textContent: "PG é uma sequência onde o quociente entre termos consecutivos é constante (razão q). Termo geral: an = a1 × q^(n-1). Soma dos n primeiros termos: Sn = a1(q^n - 1)/(q - 1). Soma infinita (|q| < 1): S = a1/(1 - q).", difficulty: "MEDIO" },
    { title: "Probabilidade Básica", textContent: "Probabilidade de um evento: P(E) = casos favoráveis / casos possíveis. Varia de 0 (impossível) a 1 (certo). Eventos complementares: P(A') = 1 - P(A). Eventos independentes: P(A e B) = P(A) × P(B). Eventos mutuamente exclusivos: P(A ou B) = P(A) + P(B).", difficulty: "MEDIO" },
    { title: "Análise Combinatória", textContent: "Princípio fundamental da contagem: se um evento pode ocorrer de m formas e outro de n formas, os dois juntos podem ocorrer de m×n formas. Permutação: Pn = n!. Arranjo: A(n,p) = n!/(n-p)!. Combinação: C(n,p) = n!/(p!(n-p)!). Combinação é usada quando a ordem não importa.", difficulty: "DIFICIL" },
    { title: "Geometria Plana: Triângulos", textContent: "Classificação por lados: equilátero (3 iguais), isósceles (2 iguais), escaleno (todos diferentes). Por ângulos: acutângulo, retângulo (90°), obtusângulo. Soma dos ângulos internos: 180°. Área: A = b×h/2. Teorema de Pitágoras (retângulo): a² = b² + c².", difficulty: "FACIL" },
    { title: "Geometria Plana: Circunferência", textContent: "Circunferência: conjunto de pontos equidistantes do centro. Raio: distância do centro à circunferência. Diâmetro: 2r. Comprimento: C = 2πr. Área do círculo: A = πr². Ângulo central: mesmo valor do arco. Ângulo inscrito: metade do arco.", difficulty: "MEDIO" },
    { title: "Estatística Básica", textContent: "Média aritmética: soma dos valores dividida pela quantidade. Mediana: valor central dos dados ordenados. Moda: valor mais frequente. Variância: média dos quadrados dos desvios. Desvio padrão: raiz quadrada da variância. Maior desvio padrão indica maior dispersão dos dados.", difficulty: "MEDIO" },
    { title: "Juros Simples", textContent: "Nos juros simples, os juros incidem apenas sobre o capital inicial. J = C × i × t (juros = capital × taxa × tempo). Montante: M = C + J = C(1 + i×t). Taxa e tempo devem estar na mesma unidade. Muito cobrado em concursos com problemas de investimento e empréstimos.", difficulty: "FACIL" },
    { title: "Juros Compostos", textContent: "Nos juros compostos, os juros incidem sobre o montante acumulado (juros sobre juros). Montante: M = C(1 + i)^t. Juros: J = M - C. Comparado aos juros simples, o montante composto é maior após o primeiro período. Usado em financiamentos, investimentos e inflação.", difficulty: "MEDIO" },
    { title: "Funções: Conceito e Tipos", textContent: "Função é uma relação que associa cada elemento do domínio a exatamente um elemento do contradomínio. Função afim: f(x) = ax + b (reta). Função quadrática: f(x) = ax² + bx + c (parábola). Função exponencial: f(x) = a^x. Função logarítmica: f(x) = log_a(x). Domínio, imagem e gráficos são temas recorrentes.", difficulty: "MEDIO" },
    { title: "Conjuntos e Operações", textContent: "Conjunto é uma coleção de elementos. União (A∪B): elementos de A ou B. Interseção (A∩B): elementos de A e B. Diferença (A-B): elementos de A que não estão em B. Complementar: elementos que não pertencem ao conjunto. Diagrama de Venn auxilia na resolução de problemas.", difficulty: "FACIL" },
    { title: "Logaritmos", textContent: "Logaritmo: log_a(b) = x significa a^x = b, com a > 0, a ≠ 1, b > 0. Propriedades: log(a×b) = log(a) + log(b). log(a/b) = log(a) - log(b). log(a^n) = n×log(a). Mudança de base: log_a(b) = log_c(b)/log_c(a). log(1) = 0 para qualquer base.", difficulty: "DIFICIL" },
    { title: "Trigonometria no Triângulo Retângulo", textContent: "Seno: cateto oposto/hipotenusa. Cosseno: cateto adjacente/hipotenusa. Tangente: cateto oposto/cateto adjacente. Ângulos notáveis: sen30° = 1/2, cos30° = √3/2, sen45° = cos45° = √2/2, sen60° = √3/2, cos60° = 1/2. Relação fundamental: sen²θ + cos²θ = 1.", difficulty: "MEDIO" },
    { title: "Matrizes e Determinantes", textContent: "Matriz é uma tabela de números com m linhas e n colunas. Operações: soma (elemento a elemento), multiplicação por escalar, multiplicação de matrizes (linhas × colunas). Determinante 2×2: ad - bc. Determinante 3×3: regra de Sarrus. Matriz inversa existe quando det ≠ 0.", difficulty: "DIFICIL" },
  ],

  // DIREITO CONSTITUCIONAL (atualmente 7 → meta 25 = +18)
  DIR_CONSTITUCIONAL: [
    { title: "Princípios Fundamentais da República", textContent: "Fundamentos (art. 1°): soberania, cidadania, dignidade da pessoa humana, valores sociais do trabalho e livre iniciativa, e pluralismo político. Objetivos fundamentais (art. 3°): sociedade livre, justa e solidária; erradicar pobreza; reduzir desigualdades; promover o bem de todos.", difficulty: "FACIL" },
    { title: "Direitos e Deveres Individuais", textContent: "Art. 5° CF: todos são iguais perante a lei. Direito à vida, liberdade, igualdade, segurança e propriedade são invioláveis. Ninguém será obrigado a fazer ou deixar de fazer algo senão em virtude de lei. A casa é asilo inviolável. É livre a manifestação do pensamento, vedado o anonimato.", difficulty: "FACIL" },
    { title: "Remédios Constitucionais", textContent: "Habeas Corpus: protege liberdade de locomoção. Habeas Data: acesso a informações pessoais em bancos de dados. Mandado de Segurança: protege direito líquido e certo não amparado por HC ou HD. Mandado de Injunção: quando falta norma regulamentadora. Ação Popular: qualquer cidadão pode anular ato lesivo.", difficulty: "MEDIO" },
    { title: "Direitos Sociais", textContent: "Art. 6° CF: educação, saúde, alimentação, trabalho, moradia, transporte, lazer, segurança, previdência social, proteção à maternidade e infância, assistência aos desamparados. Art. 7°: direitos dos trabalhadores urbanos e rurais (salário mínimo, FGTS, 13°, férias + 1/3, licença-maternidade/paternidade).", difficulty: "MEDIO" },
    { title: "Nacionalidade", textContent: "Brasileiros natos: nascidos no Brasil (jus soli), filhos de brasileiros nascidos no exterior registrados ou que optem pela nacionalidade. Naturalizados: estrangeiros que cumpram requisitos legais. Cargos privativos de natos: Presidente, Vice, Presidente da Câmara e Senado, Ministro do STF, carreira diplomática, oficial das Forças Armadas.", difficulty: "MEDIO" },
    { title: "Direitos Políticos", textContent: "Alistamento e voto obrigatórios para maiores de 18 anos. Facultativo para analfabetos, maiores de 70 anos e entre 16 e 18 anos. Inalistáveis: estrangeiros e conscritos. Inelegíveis: inalistáveis e analfabetos. Condições de elegibilidade: nacionalidade brasileira, pleno exercício dos direitos políticos, domicílio eleitoral, filiação partidária.", difficulty: "MEDIO" },
    { title: "Organização do Estado: União", textContent: "A União é pessoa jurídica de direito público interno, autônoma. Competências exclusivas (art. 21): relações com Estados estrangeiros, defesa nacional, emitir moeda, manter serviço postal. Competências privativas para legislar (art. 22): direito civil, penal, processual, eleitoral, trabalho, trânsito.", difficulty: "MEDIO" },
    { title: "Organização do Estado: Estados e Municípios", textContent: "Estados: auto-organização (Constituições estaduais), autogoverno, autoadministração. Competência residual. Municípios: Lei Orgânica, competência para legislar sobre interesse local, suplementar legislação federal e estadual. Distrito Federal: competências de Estado e Município, não pode ser dividido.", difficulty: "MEDIO" },
    { title: "Poder Legislativo", textContent: "Congresso Nacional: Câmara dos Deputados (513, proporcional à população) + Senado Federal (81, 3 por estado). Legislatura: 4 anos. Senadores: mandato de 8 anos, renovação 1/3 e 2/3. Processo legislativo: emendas à CF, leis complementares, ordinárias, delegadas, medidas provisórias, decretos legislativos, resoluções.", difficulty: "MEDIO" },
    { title: "Poder Executivo", textContent: "Presidente da República: Chefe de Estado e de Governo. Eleito por maioria absoluta (dois turnos se necessário). Mandato de 4 anos com reeleição. Pode editar medidas provisórias com força de lei. Competências privativas (art. 84): sancionar, vetar, nomear ministros, decretar estado de defesa/sítio.", difficulty: "MEDIO" },
    { title: "Poder Judiciário", textContent: "Órgãos: STF (guarda da Constituição, 11 ministros), STJ (uniformização de lei federal), TST, TSE, STM, TRFs, TJs. Garantias dos magistrados: vitaliciedade, inamovibilidade, irredutibilidade de subsídios. CNJ: controle administrativo e financeiro do Judiciário, não exerce jurisdição.", difficulty: "DIFICIL" },
    { title: "Controle de Constitucionalidade", textContent: "Controle difuso: qualquer juiz pode declarar inconstitucionalidade no caso concreto (incidental). Controle concentrado: STF julga em abstrato via ADI, ADC, ADPF. Legitimados para ADI (art. 103): Presidente, Mesa do Senado/Câmara, Governador, PGR, OAB, partido com representação no CN, confederação sindical.", difficulty: "DIFICIL" },
    { title: "Administração Pública: Princípios", textContent: "Art. 37 CF - LIMPE: Legalidade (agir conforme a lei), Impessoalidade (sem favorecimentos), Moralidade (ética e probidade), Publicidade (transparência dos atos), Eficiência (resultados com menor custo). Concurso público obrigatório para cargos efetivos. Vedado acumulação de cargos, salvo exceções.", difficulty: "FACIL" },
    { title: "Segurança Pública", textContent: "Art. 144 CF: dever do Estado, direito e responsabilidade de todos. Órgãos: Polícia Federal, PRF, PFF, Polícias Civis, Polícias Militares e Corpos de Bombeiros Militares, Polícias Penais. PMs e Bombeiros são forças auxiliares do Exército. Guardas municipais para proteção de bens, serviços e instalações.", difficulty: "FACIL" },
    { title: "Ordem Econômica e Financeira", textContent: "Art. 170 CF: fundada na valorização do trabalho humano e livre iniciativa. Princípios: soberania nacional, propriedade privada, função social da propriedade, livre concorrência, defesa do consumidor, defesa do meio ambiente, redução das desigualdades, busca do pleno emprego.", difficulty: "MEDIO" },
    { title: "Ordem Social", textContent: "Art. 193 CF: base é o primado do trabalho, objetivo é o bem-estar e justiça social. Seguridade social: saúde (universal e gratuita), previdência social (contributiva) e assistência social (a quem necessitar). Educação: dever do Estado e da família. Meio ambiente ecologicamente equilibrado: direito de todos.", difficulty: "MEDIO" },
    { title: "Estado de Defesa e Estado de Sítio", textContent: "Estado de Defesa (art. 136): preservar ou restabelecer ordem pública ou paz social em locais restritos. Decretado pelo Presidente após ouvir Conselho da República e Defesa. Prazo: 30 dias prorrogável uma vez. Estado de Sítio (art. 137): comoção grave ou guerra. Decretado com autorização do Congresso.", difficulty: "DIFICIL" },
    { title: "Processo Legislativo: Emenda Constitucional", textContent: "Proposta por 1/3 da Câmara ou Senado, Presidente da República, ou mais da metade das Assembleias Legislativas. Aprovação: 3/5 dos membros de cada Casa, em dois turnos. Limitações: não pode abolir cláusulas pétreas (forma federativa, voto direto/secreto/universal/periódico, separação de poderes, direitos individuais).", difficulty: "DIFICIL" },
  ],

  // DIREITO PENAL (atualmente 18 → meta 30 = +12)
  DIREITO_PENAL: [
    { title: "Crimes contra a Pessoa: Homicídio", textContent: "Art. 121 CP: matar alguém. Simples: pena de 6 a 20 anos. Qualificado: motivo torpe, fútil, emprego de veneno, fogo, asfixia, traição, emboscada, feminicídio. Privilegiado: relevante valor moral ou social, violenta emoção. Culposo: 1 a 3 anos de detenção.", difficulty: "MEDIO" },
    { title: "Crimes contra a Pessoa: Lesão Corporal", textContent: "Art. 129 CP: ofender a integridade corporal ou saúde de outrem. Leve: 3 meses a 1 ano. Grave: resulta incapacidade para ocupações habituais por mais de 30 dias, perigo de vida, debilidade permanente. Gravíssima: incapacidade permanente, enfermidade incurável, perda de membro, aborto. Lesão corporal seguida de morte.", difficulty: "MEDIO" },
    { title: "Crimes contra o Patrimônio: Furto e Roubo", textContent: "Furto (art. 155): subtrair coisa alheia móvel sem violência. Pena: 1 a 4 anos. Qualificado: arrombamento, abuso de confiança, escalada. Roubo (art. 157): subtrair com violência ou grave ameaça. Pena: 4 a 10 anos. Majorantes: emprego de arma, concurso de pessoas, restrição de liberdade da vítima.", difficulty: "MEDIO" },
    { title: "Crimes contra o Patrimônio: Estelionato", textContent: "Art. 171 CP: obter vantagem ilícita em prejuízo alheio, induzindo ou mantendo alguém em erro mediante artifício, ardil ou qualquer meio fraudulento. Pena: 1 a 5 anos e multa. Figuras equiparadas: duplicata simulada, abuso de incapazes, fraude no pagamento, fraude eletrônica (§ 2°-A).", difficulty: "MEDIO" },
    { title: "Crimes contra a Administração Pública: Peculato", textContent: "Art. 312 CP: apropriar-se o funcionário público de dinheiro, valor ou bem móvel público ou particular de que tem a posse em razão do cargo. Peculato-furto: concorre para subtração por outrem. Peculato culposo: concorre culposamente para o crime de outrem. Pena: reclusão de 2 a 12 anos e multa.", difficulty: "DIFICIL" },
    { title: "Crimes contra a Administração: Corrupção", textContent: "Corrupção passiva (art. 317): funcionário público solicitar ou receber vantagem indevida em razão da função. Pena: 2 a 12 anos. Corrupção ativa (art. 333): oferecer ou prometer vantagem a funcionário público para que pratique ou retarde ato. Pena: 2 a 12 anos. A mera solicitação já configura o crime.", difficulty: "DIFICIL" },
    { title: "Crimes contra a Fé Pública", textContent: "Falsificação de documento público (art. 297): pena de 2 a 6 anos. Falsificação de documento particular (art. 298): 1 a 5 anos. Uso de documento falso (art. 304): mesma pena da falsificação. Falsa identidade (art. 307): atribuir-se falsa identidade para obter vantagem ou causar dano. Pena: 3 meses a 1 ano.", difficulty: "MEDIO" },
    { title: "Lei de Drogas (Lei 11.343/2006)", textContent: "Art. 28: uso pessoal - advertência, prestação de serviços, medida educativa (não há pena de prisão). Art. 33: tráfico - pena de 5 a 15 anos, inafiançável. Art. 35: associação para o tráfico - 3 a 10 anos. Tráfico privilegiado (§4°, art. 33): redução de 1/6 a 2/3 para réu primário sem antecedentes.", difficulty: "DIFICIL" },
    { title: "Lei Maria da Penha (Lei 11.340/2006)", textContent: "Protege mulheres contra violência doméstica e familiar. Tipos de violência: física, psicológica, sexual, patrimonial e moral. Medidas protetivas de urgência: afastamento do lar, proibição de aproximação. Não se aplica Lei 9.099 (JECrim). Lesão corporal: ação penal pública incondicionada.", difficulty: "MEDIO" },
    { title: "Crimes Hediondos (Lei 8.072/1990)", textContent: "Crimes hediondos são inafiançáveis e insuscetíveis de graça, indulto ou anistia. Lista inclui: homicídio qualificado, latrocínio, extorsão com morte, estupro, epidemia com morte, genocídio, falsificação de medicamentos. Regime inicial fechado (STF declarou inconstitucional o regime integralmente fechado).", difficulty: "DIFICIL" },
    { title: "Concurso de Crimes", textContent: "Concurso material (art. 69): duas ou mais ações, dois ou mais crimes - somam-se as penas. Concurso formal (art. 70): uma ação, dois ou mais crimes - aplica-se a mais grave aumentada de 1/6 a 1/2. Crime continuado (art. 71): mesmas condições de tempo, lugar e modo - aplica-se a mais grave aumentada de 1/6 a 2/3.", difficulty: "DIFICIL" },
    { title: "Extinção da Punibilidade", textContent: "Causas (art. 107 CP): morte do agente, anistia/graça/indulto, abolitio criminis, prescrição, decadência, perempção, renúncia/perdão do ofendido, retratação do agente. Prescrição: perda do direito de punir pelo decurso do tempo. Prescrição da pretensão punitiva e da pretensão executória.", difficulty: "MEDIO" },
  ],

  // DIREITO ADMINISTRATIVO (atualmente 15 → meta 25 = +10)
  DIREITO_ADMINISTRATIVO: [
    { title: "Serviços Públicos", textContent: "Serviço público é toda atividade prestada pelo Estado ou seus delegados sob regime de direito público para satisfação de necessidades coletivas. Princípios: continuidade, generalidade, modicidade, cortesia. Formas de delegação: concessão (licitação, contrato) e permissão (ato unilateral, precário).", difficulty: "MEDIO" },
    { title: "Responsabilidade Civil do Estado", textContent: "Art. 37, §6° CF: responsabilidade objetiva do Estado (independe de culpa). Teoria do risco administrativo: Estado responde por danos causados por seus agentes. Excludentes: culpa exclusiva da vítima, caso fortuito, força maior. Direito de regresso contra o agente que agiu com dolo ou culpa.", difficulty: "DIFICIL" },
    { title: "Bens Públicos", textContent: "Classificação: uso comum do povo (ruas, praças), uso especial (repartições, escolas), dominicais (patrimônio disponível). Características: imprescritíveis (não sofrem usucapião), impenhoráveis, não oneráveis (sem penhor ou hipoteca). Alienação de dominicais: autorização legislativa, avaliação prévia, licitação.", difficulty: "MEDIO" },
    { title: "Processo Administrativo", textContent: "Lei 9.784/99 regula o processo administrativo federal. Princípios: legalidade, finalidade, motivação, razoabilidade, proporcionalidade, ampla defesa, contraditório, segurança jurídica, interesse público, eficiência. Prazos: decisão em 30 dias (prorrogável). Recurso: 10 dias, decidido em 30 dias.", difficulty: "MEDIO" },
    { title: "Controle da Administração Pública", textContent: "Controle interno: pela própria Administração (autotutela). Controle externo: Legislativo (com auxílio do Tribunal de Contas), Judiciário (atos ilegais) e popular (ação popular). Tribunal de Contas: julga contas dos administradores, aprecia legalidade de admissões e aposentadorias, aplica sanções.", difficulty: "DIFICIL" },
    { title: "Regime Jurídico dos Servidores", textContent: "Lei 8.112/90: Estatuto dos Servidores Públicos Federais. Formas de provimento: nomeação, promoção, readaptação, reversão, aproveitamento, reintegração, recondução. Estágio probatório: 3 anos. Estabilidade após aprovação. Vacância: exoneração, demissão, promoção, readaptação, aposentadoria, posse em outro cargo, falecimento.", difficulty: "MEDIO" },
    { title: "Improbidade Administrativa", textContent: "Lei 8.429/92: atos de improbidade e sanções. Enriquecimento ilícito (art. 9°): perda de bens, suspensão dos direitos políticos 8-10 anos. Prejuízo ao erário (art. 10°): ressarcimento, suspensão 5-8 anos. Violação de princípios (art. 11°): suspensão 3-5 anos. Ação de improbidade é imprescritível para ressarcimento.", difficulty: "DIFICIL" },
    { title: "Organização Administrativa: Descentralização", textContent: "Descentralização: criação de entidades com personalidade jurídica própria. Administração indireta: autarquias (regime público), fundações, empresas públicas (capital 100% público), sociedades de economia mista (capital misto, maioria público). Vinculação ao órgão supervisor (tutela administrativa).", difficulty: "MEDIO" },
    { title: "Poderes da Administração: Poder de Polícia", textContent: "Poder de polícia: limitar liberdades individuais em favor do interesse público. Atributos: discricionariedade, autoexecutoriedade, coercibilidade. Exemplos: fiscalização sanitária, ambiental, trânsito, construções. Pode ser delegado a entidades da administração indireta (autarquias).", difficulty: "MEDIO" },
    { title: "Contratos Administrativos", textContent: "Regidos pela Lei 14.133/2021 (Nova Lei de Licitações). Características: formalismo, bilateralidade, comutatividade, cláusulas exorbitantes. Cláusulas exorbitantes: alteração unilateral, rescisão unilateral, fiscalização, aplicação de sanções. Prazo máximo: duração do crédito orçamentário, prorrogável.", difficulty: "DIFICIL" },
  ],

  // LÍNGUA PORTUGUESA (atualmente 14 → meta 25 = +11)
  PORTUGUES: [
    { title: "Concordância Verbal", textContent: "O verbo concorda com o sujeito em número e pessoa. Sujeito composto antes do verbo: plural. Sujeito composto posposto: concorda com o mais próximo ou vai ao plural. Partícula 'se' apassivadora: verbo concorda com sujeito paciente. 'Se' índice de indeterminação: verbo no singular.", difficulty: "MEDIO" },
    { title: "Concordância Nominal", textContent: "O adjetivo concorda com o substantivo em gênero e número. Adjetivo posposto a dois substantivos: concorda com o mais próximo ou vai ao plural. Adjetivo anteposto: concorda com o mais próximo. Expressões 'é necessário', 'é proibido', 'é bom': ficam invariáveis sem artigo.", difficulty: "MEDIO" },
    { title: "Regência Verbal", textContent: "A regência verbal define a relação do verbo com seus complementos. Assistir (ver): transitivo indireto (a). Aspirar (desejar): transitivo indireto (a). Visar (objetivar): transitivo indireto (a). Obedecer/desobedecer: transitivo indireto (a). Preferir: transitivo direto e indireto (algo a algo).", difficulty: "MEDIO" },
    { title: "Crase", textContent: "Crase é a fusão da preposição 'a' com o artigo 'a'. Usa-se crase quando: verbo ou nome exige preposição 'a' + substantivo feminino com artigo. Não se usa antes de: palavras masculinas, verbos, pronomes pessoais, artigos indefinidos, entre palavras repetidas. Facultativa antes de pronomes possessivos femininos.", difficulty: "MEDIO" },
    { title: "Período Composto: Orações Subordinadas", textContent: "Subordinadas substantivas: subjetiva, objetiva direta, objetiva indireta, completiva nominal, predicativa, apositiva. Subordinadas adjetivas: restritiva (sem vírgula, restringe) e explicativa (com vírgula, explica). Subordinadas adverbiais: temporal, causal, concessiva, condicional, comparativa, consecutiva, conformativa, final, proporcional.", difficulty: "DIFICIL" },
    { title: "Pontuação: Vírgula", textContent: "Usa-se vírgula para: separar termos de mesma função (enumeração), isolar aposto, isolar vocativo, separar adjunto adverbial deslocado, separar orações coordenadas, isolar oração subordinada adjetiva explicativa. Não se usa vírgula entre sujeito e verbo, verbo e complemento.", difficulty: "FACIL" },
    { title: "Coesão e Coerência Textual", textContent: "Coesão: ligação entre elementos do texto (referencial, sequencial, lexical). Elementos coesivos: pronomes, conjunções, advérbios, sinônimos, hiperônimos. Coerência: sentido lógico do texto, não contradição. Tipos de coerência: semântica, sintática, pragmática. Ambos essenciais para interpretação.", difficulty: "MEDIO" },
    { title: "Semântica: Sinonímia e Antonímia", textContent: "Sinônimos: palavras com significado semelhante (belo/formoso). Antônimos: significado oposto (bom/mau). Polissemia: uma palavra com vários significados. Homonímia: mesma escrita ou pronúncia, significados diferentes. Paronímia: palavras parecidas na escrita (comprimento/cumprimento, eminente/iminente).", difficulty: "FACIL" },
    { title: "Figuras de Linguagem", textContent: "Metáfora: comparação implícita. Metonímia: substituição por contiguidade. Hipérbole: exagero. Eufemismo: suavização. Ironia: dizer o contrário. Antítese: oposição de ideias. Paradoxo: ideias contraditórias. Personificação: atribuir características humanas a seres inanimados. Muito cobradas em interpretação de texto.", difficulty: "FACIL" },
    { title: "Tipos e Gêneros Textuais", textContent: "Tipos textuais: narração (fatos), descrição (características), dissertação (argumentação), injunção (instruções), exposição (informações). Gêneros: artigo, editorial, crônica, notícia, relatório, requerimento, ofício. Em concursos: foco em dissertativo-argumentativo para redações e interpretação de diversos gêneros.", difficulty: "MEDIO" },
    { title: "Vozes Verbais", textContent: "Voz ativa: sujeito pratica a ação. Voz passiva: sujeito sofre a ação (analítica: ser + particípio; sintética: verbo + se). Voz reflexiva: sujeito pratica e sofre a ação. Conversão: objeto direto da ativa vira sujeito da passiva. Nem todo verbo admite voz passiva (apenas transitivos diretos).", difficulty: "MEDIO" },
  ],

  // RACIOCÍNIO LÓGICO (atualmente 10 → meta 25 = +15)
  RACIOCINIO_LOGICO: [
    { title: "Proposições e Conectivos Lógicos", textContent: "Proposição é uma sentença declarativa que pode ser verdadeira ou falsa. Conectivos: negação (~p), conjunção (p ∧ q: 'e'), disjunção (p ∨ q: 'ou'), condicional (p → q: 'se...então'), bicondicional (p ↔ q: 'se e somente se'). Cada conectivo tem tabela-verdade específica.", difficulty: "FACIL" },
    { title: "Tabela-Verdade", textContent: "Ferramenta para avaliar o valor lógico de proposições compostas. Conjunção (∧): só V quando ambas V. Disjunção (∨): só F quando ambas F. Condicional (→): só F quando V→F. Bicondicional (↔): V quando ambas têm mesmo valor. Negação (~): inverte o valor. Com n proposições: 2^n linhas.", difficulty: "MEDIO" },
    { title: "Equivalências Lógicas", textContent: "Equivalências fundamentais: p→q ≡ ~q→~p (contrapositiva). p→q ≡ ~p∨q. ~(p∧q) ≡ ~p∨~q (De Morgan). ~(p∨q) ≡ ~p∧~q (De Morgan). p↔q ≡ (p→q)∧(q→p). São essenciais para resolver questões de concurso sobre inferências lógicas.", difficulty: "MEDIO" },
    { title: "Negação de Proposições Compostas", textContent: "Negação da conjunção: ~(p∧q) = ~p∨~q. Negação da disjunção: ~(p∨q) = ~p∧~q. Negação da condicional: ~(p→q) = p∧~q. Negação da bicondicional: ~(p↔q) = (p∧~q)∨(~p∧q). Regra prática: nega as duas e troca o conectivo (∧↔∨).", difficulty: "MEDIO" },
    { title: "Argumentos Lógicos", textContent: "Argumento válido: se as premissas são verdadeiras, a conclusão é necessariamente verdadeira. Modus Ponens: p→q, p, logo q. Modus Tollens: p→q, ~q, logo ~p. Silogismo hipotético: p→q, q→r, logo p→r. Silogismo disjuntivo: p∨q, ~p, logo q.", difficulty: "MEDIO" },
    { title: "Lógica de Primeira Ordem: Quantificadores", textContent: "Quantificador universal (∀): 'para todo', 'qualquer'. Quantificador existencial (∃): 'existe', 'algum'. Negação: ~(∀x, P(x)) ≡ ∃x, ~P(x). ~(∃x, P(x)) ≡ ∀x, ~P(x). Troca o quantificador e nega a proposição.", difficulty: "DIFICIL" },
    { title: "Diagramas Lógicos", textContent: "Diagramas de Euler-Venn representam relações entre conjuntos. Todo A é B: A está dentro de B. Nenhum A é B: A e B não se interceptam. Algum A é B: A e B se interceptam. Algum A não é B: A não está totalmente dentro de B. Útil para resolver silogismos categóricos.", difficulty: "FACIL" },
    { title: "Sequências Lógicas", textContent: "Identificar o padrão e encontrar o próximo elemento. Tipos: aritméticas (+k), geométricas (×k), Fibonacci (soma dos dois anteriores), alternadas, quadrados/cubos perfeitos, diferenças crescentes. Estratégia: calcular as diferenças entre termos consecutivos para encontrar o padrão.", difficulty: "FACIL" },
    { title: "Problemas de Verdades e Mentiras", textContent: "Pessoas que sempre mentem ou sempre dizem a verdade. Estratégia: assumir uma hipótese e verificar consistência. Se um mentiroso diz 'eu sou mentiroso', contradição (mentiroso não pode dizer verdade sobre si). Analisar todas as combinações possíveis até encontrar a consistente.", difficulty: "MEDIO" },
    { title: "Princípio da Casa dos Pombos", textContent: "Se n+1 objetos são distribuídos em n gavetas, pelo menos uma gaveta terá 2 ou mais objetos. Aplicação: em um grupo de 13 pessoas, pelo menos 2 fazem aniversário no mesmo mês. Em 27 alunos, pelo menos 2 têm a mesma letra inicial do nome (26 letras).", difficulty: "MEDIO" },
    { title: "Orientação Espacial e Temporal", textContent: "Problemas de posição relativa: quem está à direita/esquerda, acima/abaixo, antes/depois. Estratégia: desenhar esquema visual. Calendário: dias da semana, meses. Relógios: ângulo entre ponteiros. Usar diagramas e tabelas para organizar as informações do enunciado.", difficulty: "FACIL" },
    { title: "Problemas com Frações", textContent: "Operações: soma/subtração (mesmo denominador), multiplicação (numerador×numerador, denominador×denominador), divisão (inverte e multiplica). Fração de um valor: multiplica. Problemas tipo: 'Maria gastou 1/3 do salário, depois 1/4 do que sobrou'. Resolver passo a passo.", difficulty: "FACIL" },
    { title: "Raciocínio Lógico: Associação", textContent: "Problemas que associam elementos de diferentes categorias (pessoas, cores, profissões). Estratégia: criar tabela de dupla entrada, marcar com V ou F. Usar eliminação: se João é médico, nenhum outro é médico. Cada pista elimina possibilidades até restar uma única combinação.", difficulty: "MEDIO" },
    { title: "Lógica de Argumentação", textContent: "Identificar premissas e conclusão de argumentos em texto. Falácias comuns: ad hominem (atacar a pessoa), apelo à autoridade, generalização apressada, falsa causa, petição de princípio (argumento circular). Distinguir fatos de opiniões. Muito cobrado em interpretação lógica.", difficulty: "MEDIO" },
    { title: "Operações com Conjuntos", textContent: "União (A∪B): total = n(A) + n(B) - n(A∩B). Para 3 conjuntos: n(A∪B∪C) = n(A) + n(B) + n(C) - n(A∩B) - n(A∩C) - n(B∩C) + n(A∩B∩C). Complementar: n(A') = n(U) - n(A). Problemas de pesquisa de opinião são resolvidos com Venn.", difficulty: "MEDIO" },
  ],

  // ÉTICA NO SERVIÇO PÚBLICO (atualmente 10 → meta 20 = +10)
  ETICA_SERVICO_PUBLICO: [
    { title: "Decreto 1.171/1994: Código de Ética", textContent: "Estabelece regras deontológicas do servidor público civil federal. Dignidade, decoro, zelo e eficácia são deveres fundamentais. A moralidade administrativa integra o direito. Omissão é ato de desonestidade. O servidor deve ter consciência de que seu trabalho é regido por princípios éticos.", difficulty: "FACIL" },
    { title: "Deveres do Servidor Público (Decreto 1.171)", textContent: "Principais deveres: desempenhar com zelo suas atribuições, ser leal, tratar o cidadão com urbanidade, ser honesto, zelar pela economia do material, resistir a pressões de superiores hierárquicos ou de contratantes que possam comprometer a ética, denunciar irregularidades.", difficulty: "FACIL" },
    { title: "Vedações ao Servidor Público", textContent: "É vedado: usar cargo para obter vantagem, prejudicar deliberadamente a reputação de outros, permitir perseguições, simpatias ou antipatias, usar informação privilegiada em proveito próprio, aceitar presentes de interessados, alterar documentos, desviar servidor para atendimento particular.", difficulty: "MEDIO" },
    { title: "Comissão de Ética", textContent: "Cada órgão da Administração Federal deve ter Comissão de Ética com 3 membros titulares e 3 suplentes. Competências: apurar infrações éticas, aconselhar sobre ética, aplicar censura ética. O servidor deve prestar informações quando solicitado. As decisões são fundamentadas.", difficulty: "MEDIO" },
    { title: "Lei 8.112/90: Deveres do Servidor", textContent: "Art. 116: exercer com zelo e dedicação as atribuições do cargo, ser leal às instituições, observar as normas legais, cumprir ordens superiores (exceto manifestamente ilegais), atender com presteza ao público, levar irregularidades ao conhecimento da autoridade superior, zelar pela economia do material.", difficulty: "FACIL" },
    { title: "Lei 8.112/90: Proibições ao Servidor", textContent: "Art. 117: ausentar-se sem autorização, retirar documento sem permissão, recusar fé a documentos, opor resistência ao andamento de processos, promover manifestação de apreço/desapreço, cometer a pessoa estranha a atribuição do cargo, coagir subordinados no sentido de filiação partidária, exercer comércio.", difficulty: "MEDIO" },
    { title: "Penalidades Disciplinares", textContent: "Advertência: irregularidades de menor gravidade. Suspensão: até 90 dias, por reincidência ou violação de proibições leves. Demissão: crimes contra a Administração, improbidade, incontinência pública, insubordinação grave, abandono de cargo (30 dias), inassiduidade habitual (60 dias em 12 meses).", difficulty: "MEDIO" },
    { title: "Processo Administrativo Disciplinar", textContent: "PAD apura infrações de servidores. Fases: instauração (portaria), inquérito (instrução, defesa, relatório) e julgamento (autoridade competente). Comissão com 3 servidores estáveis. Prazo: 60 dias, prorrogável por mais 60. Garantias: contraditório e ampla defesa. Prescrição: 5 anos (demissão), 2 anos (suspensão), 180 dias (advertência).", difficulty: "DIFICIL" },
    { title: "Acumulação de Cargos Públicos", textContent: "Regra: vedada acumulação remunerada de cargos públicos. Exceções (se compatível com horário): dois cargos de professor, um de professor + um técnico/científico, dois cargos de profissionais de saúde. Aplica-se a cargos, empregos e funções em todas as esferas (federal, estadual, municipal).", difficulty: "FACIL" },
    { title: "Conflito de Interesses (Lei 12.813/2013)", textContent: "Situação em que interesse particular do agente público pode influenciar sua atuação. Exemplos: exercer atividade incompatível com o cargo, prestar consultoria a quem tenha interesse em decisão do agente, divulgar informação privilegiada. Quarentena: 6 meses após deixar o cargo, com remuneração.", difficulty: "DIFICIL" },
  ],

  // NOÇÕES DE INFORMÁTICA (atualmente 10 → meta 20 = +10)
  INFORMATICA: [
    { title: "Hardware: Componentes do Computador", textContent: "CPU (processador): unidade central de processamento. Memória RAM: volátil, armazena dados em uso. HD/SSD: armazenamento permanente. Placa-mãe: conecta todos os componentes. GPU: processamento gráfico. Periféricos de entrada (teclado, mouse), saída (monitor, impressora) e entrada/saída (pendrive).", difficulty: "FACIL" },
    { title: "Sistemas Operacionais", textContent: "Software que gerencia hardware e executa aplicativos. Windows: mais usado em desktops, interface gráfica. Linux: código aberto, várias distribuições (Ubuntu, Debian). Funções: gerenciamento de processos, memória, arquivos, dispositivos. Sistema de arquivos: NTFS (Windows), ext4 (Linux).", difficulty: "FACIL" },
    { title: "Redes de Computadores", textContent: "LAN: rede local. WAN: rede de longa distância. Internet: rede mundial. Protocolo TCP/IP: base da internet. IP: endereçamento (IPv4: 32 bits, IPv6: 128 bits). DNS: traduz nomes em IPs. DHCP: atribui IPs automaticamente. Topologias: estrela, anel, barramento, mesh.", difficulty: "MEDIO" },
    { title: "Segurança da Informação", textContent: "Princípios: Confidencialidade (acesso autorizado), Integridade (dados não alterados), Disponibilidade (acesso quando necessário), Autenticidade (identidade verificada). Ameaças: vírus, worm, trojan, ransomware, phishing, spyware. Proteção: antivírus, firewall, backup, senhas fortes, autenticação em dois fatores.", difficulty: "MEDIO" },
    { title: "Navegadores e Internet", textContent: "Navegadores: Chrome, Firefox, Edge, Safari. HTTP/HTTPS: protocolos de transferência (HTTPS é criptografado). URL: endereço web. Cookies: armazenam preferências. Cache: armazena páginas visitadas. Modo privado/anônimo: não salva histórico. Certificado SSL: garante segurança da conexão.", difficulty: "FACIL" },
    { title: "Computação em Nuvem", textContent: "Serviços pela internet sem instalação local. IaaS: infraestrutura (servidores virtuais). PaaS: plataforma (ambiente de desenvolvimento). SaaS: software (Gmail, Office 365). Nuvem pública: compartilhada. Nuvem privada: exclusiva. Nuvem híbrida: combinação. Vantagens: escalabilidade, economia, acesso remoto.", difficulty: "MEDIO" },
    { title: "Correio Eletrônico", textContent: "Protocolos: SMTP (envio), POP3 (download para o dispositivo), IMAP (sincronização servidor/dispositivo). Webmail: acesso pelo navegador. Cliente de e-mail: Outlook, Thunderbird. CC (cópia): destinatários visíveis. CCO (cópia oculta): destinatários invisíveis. Anexos: arquivos enviados junto.", difficulty: "FACIL" },
    { title: "Microsoft Word: Funções Essenciais", textContent: "Processador de texto. Formatação: fonte, tamanho, negrito, itálico, sublinhado. Parágrafos: alinhamento, espaçamento, recuo. Cabeçalho e rodapé. Tabelas. Mala direta: personalizar documentos em massa. Revisão: ortografia, comentários, controle de alterações. Atalhos: Ctrl+C (copiar), Ctrl+V (colar), Ctrl+Z (desfazer).", difficulty: "FACIL" },
    { title: "Microsoft Excel: Funções Básicas", textContent: "Planilha eletrônica. Célula: interseção de linha e coluna (A1, B2). Fórmulas iniciam com =. Funções: SOMA, MÉDIA, MÁXIMO, MÍNIMO, SE, CONT.SE, PROCV. Referência relativa (A1): muda ao copiar. Referência absoluta ($A$1): fixa. Gráficos: barras, linhas, pizza. Filtros e classificação de dados.", difficulty: "MEDIO" },
    { title: "Backup e Recuperação de Dados", textContent: "Backup: cópia de segurança dos dados. Tipos: completo (tudo), incremental (apenas alterações desde último backup), diferencial (alterações desde último backup completo). Mídias: HD externo, nuvem, fita. Estratégia 3-2-1: 3 cópias, 2 mídias diferentes, 1 fora do local. Restauração: processo de recuperar dados.", difficulty: "MEDIO" },
  ],

  // LÍNGUA INGLESA (atualmente 10 → meta 20 = +10)
  INGLES: [
    { title: "Future Tenses", textContent: "Will + base verb: decisions, predictions, promises. Going to + base verb: plans, intentions, evidence-based predictions. Present Continuous: fixed arrangements. Simple Present: schedules/timetables. Example: 'I will help you' (spontaneous). 'I'm going to study tonight' (planned).", difficulty: "MEDIO" },
    { title: "Phrasal Verbs", textContent: "Verbs combined with prepositions/adverbs that change meaning. Look up: search for information. Give up: stop trying. Turn off: switch off. Carry out: perform/execute. Break down: stop functioning. Set up: establish. Put off: postpone. Get along: have a good relationship. Very common in reading comprehension.", difficulty: "MEDIO" },
    { title: "Prepositions of Time and Place", textContent: "Time: at (specific time: at 5pm), on (days/dates: on Monday), in (months/years/periods: in January). Place: at (specific location: at school), on (surfaces: on the table), in (enclosed spaces: in the room). Other: by (deadline), until (duration), during (within a period), for (length of time).", difficulty: "FACIL" },
    { title: "Word Formation: Prefixes and Suffixes", textContent: "Prefixes change meaning: un- (not), re- (again), pre- (before), dis- (opposite), over- (too much), mis- (wrongly). Suffixes change word class: -tion (verb→noun), -ment (verb→noun), -ful (noun→adj), -less (without), -ly (adj→adv), -able (can be). Essential for vocabulary questions.", difficulty: "MEDIO" },
    { title: "Comparatives and Superlatives", textContent: "Short adjectives: -er (taller), -est (tallest). Long adjectives: more + adj (more important), most + adj (most important). Irregular: good/better/best, bad/worse/worst, far/farther/farthest. As...as: equality. Not as...as: inequality. The more...the more: parallel increase.", difficulty: "FACIL" },
    { title: "Articles: A, An, The, Zero Article", textContent: "A/An (indefinite): first mention, one of many. The (definite): specific, already known, unique. Zero article: generalizations, uncountable nouns, abstract concepts. The + superlative (the best). A/An + singular countable. No article + plural/uncountable for general meaning.", difficulty: "FACIL" },
    { title: "Text Genres in English", textContent: "Common genres in exams: news articles, opinion pieces, scientific texts, instructions, emails, reports. Each has specific language features. News: past tense, quotes, 5W1H. Opinion: first person, modals, linking words. Scientific: passive voice, technical terms. Instructions: imperative mood.", difficulty: "MEDIO" },
    { title: "False Cognates", textContent: "Words similar to Portuguese but with different meanings. Actually: na verdade (not atualmente). Pretend: fingir (not pretender). Push: empurrar (not puxar). Parents: pais (not parentes). Library: biblioteca (not livraria). Attend: participar (not atender). College: faculdade (not colégio). Commonly tested in exams.", difficulty: "FACIL" },
    { title: "Gerunds and Infinitives", textContent: "Gerund (-ing): after prepositions, as subject, after certain verbs (enjoy, avoid, consider, suggest). Infinitive (to + verb): after certain verbs (want, need, decide, hope), to express purpose. Some verbs take both with different meanings: stop doing (cease) vs stop to do (pause in order to).", difficulty: "DIFICIL" },
    { title: "Passive Voice Advanced", textContent: "Passive with modals: can be done, should be completed. Passive with reporting verbs: It is said that..., He is believed to be... Get-passive (informal): get fired, get promoted. Have something done (causative): I had my car repaired. Common in formal, legal, and academic texts found in exams.", difficulty: "DIFICIL" },
  ],

  // HISTÓRIA (atualmente 10 → meta 20 = +10)
  HISTORIA: [
    { title: "Brasil Colônia: Capitanias Hereditárias", textContent: "Em 1534, D. João III dividiu o Brasil em 15 capitanias hereditárias, doadas a donatários. Objetivo: colonizar sem gastos para a Coroa. Maioria fracassou por falta de recursos, distância e ataques indígenas. Exceções: São Vicente (Martin Afonso de Sousa) e Pernambuco (Duarte Coelho) prosperaram com o açúcar.", difficulty: "FACIL" },
    { title: "Brasil Império: Independência", textContent: "Processo iniciado com a vinda da família real (1808), abertura dos portos e elevação do Brasil a Reino Unido. Revolução do Porto (1820) exigiu retorno de D. João VI. Pedro ficou como regente. Dia do Fico (9/jan/1822), Grito do Ipiranga (7/set/1822). Independência conservadora: manteve a monarquia e a escravidão.", difficulty: "MEDIO" },
    { title: "República Velha (1889-1930)", textContent: "Primeira República brasileira. Política do Café com Leite: alternância entre SP (café) e MG (leite) na presidência. Coronelismo: poder local dos coronéis. Política dos Governadores: apoio mútuo federal-estadual. Voto de cabresto. Revoltas: Canudos (1896), Cangaço, Revolta da Vacina (1904), Tenentismo (1920s).", difficulty: "MEDIO" },
    { title: "Era Vargas (1930-1945)", textContent: "Getúlio Vargas governou de 1930 a 1945. Governo Provisório (1930-34), Constitucional (1934-37), Estado Novo (1937-45, ditadura). Realizações: CLT, voto feminino, industrialização, CSN. Estado Novo: censura (DIP), centralização, Constituição outorgada. Entrada na II Guerra. Deposto pelos militares em 1945.", difficulty: "MEDIO" },
    { title: "Ditadura Militar (1964-1985)", textContent: "Golpe de 1964 depôs João Goulart. Atos Institucionais: AI-5 (1968) foi o mais repressivo. Governo Médici: 'milagre econômico', repressão violenta. Abertura: Geisel (distensão lenta e gradual) e Figueiredo (anistia). Diretas Já (1984): movimento popular. Tancredo Neves eleito indiretamente em 1985.", difficulty: "MEDIO" },
    { title: "Revolução Francesa (1789)", textContent: "Causas: crise econômica, desigualdade social (3 estados), ideias iluministas. Queda da Bastilha (14/jul/1789). Declaração dos Direitos do Homem e do Cidadão. Fases: Assembleia Nacional, Convenção (Terror de Robespierre), Diretório. Consequências: fim do absolutismo, início da Era Napoleônica, influência em independências americanas.", difficulty: "MEDIO" },
    { title: "Primeira Guerra Mundial (1914-1918)", textContent: "Causas: imperialismo, nacionalismo, corrida armamentista, sistema de alianças (Tríplice Aliança vs Tríplice Entente). Estopim: assassinato do arquiduque Franz Ferdinand. Guerra de trincheiras. EUA entram em 1917. Tratado de Versalhes (1919): Alemanha humilhada. Consequências: Liga das Nações, mapa europeu redesenhado.", difficulty: "MEDIO" },
    { title: "Segunda Guerra Mundial (1939-1945)", textContent: "Causas: Tratado de Versalhes, ascensão do nazifascismo, expansionismo alemão. Eixo (Alemanha, Itália, Japão) vs Aliados (Reino Unido, URSS, EUA, França). Holocausto: extermínio de 6 milhões de judeus. Bombas atômicas em Hiroshima e Nagasaki. Consequências: ONU, Guerra Fria, descolonização.", difficulty: "MEDIO" },
    { title: "Guerra Fria (1947-1991)", textContent: "Bipolaridade: EUA (capitalismo) vs URSS (socialismo). Não houve confronto direto. Conflitos indiretos: Coreia, Vietnã, Afeganistão. Corrida espacial e armamentista. OTAN vs Pacto de Varsóvia. Muro de Berlim (1961-1989). Queda do Muro e dissolução da URSS (1991) marcaram o fim.", difficulty: "MEDIO" },
    { title: "Constituições Brasileiras", textContent: "1824: outorgada, império, voto censitário, 4 poderes. 1891: república, federalismo, 3 poderes, voto descoberto. 1934: voto feminino, direitos trabalhistas. 1937: Estado Novo, autoritária. 1946: redemocratização. 1967/69: ditadura militar. 1988: 'Constituição Cidadã', direitos fundamentais amplos.", difficulty: "DIFICIL" },
  ],

  // GEOGRAFIA (atualmente 10 → meta 20 = +10)
  GEOGRAFIA: [
    { title: "Urbanização Brasileira", textContent: "Brasil: 87% urbano. Êxodo rural intenso desde 1950 (industrialização). Problemas: favelização, poluição, trânsito, desigualdade. Megacidades: São Paulo (12 milhões), Rio de Janeiro. Metrópoles nacionais, regionais e sub-regionais. Conurbação e regiões metropolitanas. Verticalização e especulação imobiliária.", difficulty: "MEDIO" },
    { title: "Clima e Vegetação do Brasil", textContent: "Climas: equatorial (Amazônia), tropical (maior parte), semiárido (Nordeste interior), subtropical (Sul), tropical de altitude (planaltos). Vegetação: Amazônia (maior floresta tropical), Cerrado (savana), Caatinga (semiárido), Mata Atlântica (devastada), Pampas (campos), Pantanal (alagado).", difficulty: "FACIL" },
    { title: "Questão Ambiental no Brasil", textContent: "Desmatamento da Amazônia: pecuária, soja, madeira ilegal. Queimadas no Cerrado e Pantanal. Poluição de rios e oceanos. Legislação: Código Florestal (reserva legal, APP). Unidades de conservação: parques nacionais, reservas extrativistas. Protocolo de Kyoto e Acordo de Paris sobre mudanças climáticas.", difficulty: "MEDIO" },
    { title: "Globalização", textContent: "Processo de integração econômica, cultural e política mundial. Características: livre comércio, empresas transnacionais, internet, fluxos migratórios. Organismos: OMC, FMI, Banco Mundial. Blocos econômicos: União Europeia, Mercosul, USMCA. Críticas: desigualdade, perda de identidade cultural, exploração trabalhista.", difficulty: "MEDIO" },
    { title: "Fontes de Energia", textContent: "Renováveis: solar, eólica, hidrelétrica, biomassa. Não renováveis: petróleo, gás natural, carvão, nuclear. Brasil: 65% hidrelétrica, crescimento de eólica e solar. Pré-sal: reservas de petróleo em águas profundas. Matriz energética vs matriz elétrica. Transição energética e sustentabilidade.", difficulty: "MEDIO" },
    { title: "População Brasileira", textContent: "215 milhões de habitantes. Transição demográfica: queda da natalidade e mortalidade, envelhecimento. IDH médio-alto (0,754). Desigualdade regional: Sudeste mais desenvolvido, Norte e Nordeste com menores indicadores. Miscigenação étnica. Movimentos migratórios internos: Nordeste→Sudeste, fronteira agrícola.", difficulty: "FACIL" },
    { title: "Relevo Brasileiro", textContent: "Classificação de Jurandyr Ross: planaltos, planícies e depressões. Planaltos: Atlântico, Meridional, das Guianas. Planícies: Amazônica, Pantanal, costeira. Depressões: periféricas. Ponto mais alto: Pico da Neblina (2.994m). Solo predominante: laterita (ferro e alumínio). Processos: erosão, sedimentação, intemperismo.", difficulty: "FACIL" },
    { title: "Hidrografia Brasileira", textContent: "Maior reserva de água doce do mundo. Bacias: Amazônica (maior do mundo), Tocantins-Araguaia, São Francisco (integração), Paraná, Paraguai. Aquífero Guarani: maior reserva subterrânea da América do Sul. Transposição do São Francisco: levar água ao semiárido. Usinas hidrelétricas: Itaipu, Belo Monte, Tucuruí.", difficulty: "FACIL" },
    { title: "Industrialização Brasileira", textContent: "Fases: substituição de importações (1930-50), Plano de Metas de JK (1956-61), milagre econômico (1968-73), abertura econômica (1990). Concentração no Sudeste, desconcentração para Sul e Nordeste. Indústrias de base, bens de consumo, alta tecnologia. Zonas industriais: ABC Paulista, Zona Franca de Manaus.", difficulty: "MEDIO" },
    { title: "Agropecuária Brasileira", textContent: "Brasil: maior exportador de soja, café, açúcar, carne bovina, suco de laranja. Agronegócio: 25% do PIB. Fronteira agrícola: expansão para Cerrado e Amazônia. Agricultura familiar: 70% dos alimentos consumidos. Reforma agrária: MST, INCRA. Problemas: desmatamento, uso de agrotóxicos, concentração fundiária.", difficulty: "MEDIO" },
  ],
};

// ============================================
// EXECUÇÃO
// ============================================

async function expandContents() {
  console.log("=== EXPANSÃO DE CONTEÚDOS ===\n");

  let totalCreated = 0;

  for (const [subjectName, contents] of Object.entries(EXPANSION)) {
    // Buscar subjectId
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
      // Verificar se já existe conteúdo com mesmo título
      const existing = await db.execute(sql`
        SELECT id FROM "Content"
        WHERE "subjectId" = ${subject.id} AND "title" = ${content.title}
        LIMIT 1
      `) as any[];

      if (existing.length > 0) {
        continue; // Já existe, pular
      }

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
    console.log(`✅ ${subject.displayName}: +${created} conteúdos (${contents.length} planejados)`);
  }

  // Resumo
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
