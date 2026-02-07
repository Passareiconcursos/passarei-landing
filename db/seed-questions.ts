/**
 * Seed de Questões - Fase 5
 * ~120 questões reais estilo concurso para 24 subjects
 * Mix de MULTIPLA_ESCOLHA e CERTO_ERRADO
 */

import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";
import { randomBytes } from "crypto";

function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = randomBytes(8).toString("hex");
  return `q${timestamp}${randomPart}`.slice(0, 25);
}

interface QuestionSeed {
  statement: string;
  questionType: "MULTIPLA_ESCOLHA" | "CERTO_ERRADO";
  alternatives: { letter: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
}

// ============================================
// QUESTÕES POR SUBJECT (chave = Subject.name)
// ============================================

const QUESTIONS: Record<string, QuestionSeed[]> = {

  // ── DIREITO CONSTITUCIONAL ──
  DIR_CONSTITUCIONAL: [
    {
      statement: "Segundo o art. 5° da Constituição Federal, qual dos seguintes NÃO é um direito fundamental?",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Direito à vida" },
        { letter: "B", text: "Direito à liberdade" },
        { letter: "C", text: "Direito ao lucro empresarial" },
        { letter: "D", text: "Direito à igualdade" },
      ],
      correctAnswer: "C",
      explanation: "O art. 5° da CF garante o direito à vida, à liberdade, à igualdade, à segurança e à propriedade. O 'direito ao lucro empresarial' não é um direito fundamental previsto na Constituição.",
      difficulty: "FACIL",
    },
    {
      statement: "São fundamentos da República Federativa do Brasil (art. 1° CF), EXCETO:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Soberania" },
        { letter: "B", text: "Cidadania" },
        { letter: "C", text: "Desenvolvimento nacional" },
        { letter: "D", text: "Dignidade da pessoa humana" },
      ],
      correctAnswer: "C",
      explanation: "Desenvolvimento nacional é um OBJETIVO fundamental (art. 3°), não um fundamento. Os fundamentos (art. 1°) são: soberania, cidadania, dignidade da pessoa humana, valores sociais do trabalho e da livre iniciativa, e pluralismo político.",
      difficulty: "MEDIO",
    },
    {
      statement: "O Habeas Data é o remédio constitucional adequado para proteger o direito de locomoção.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "O remédio para proteger o direito de locomoção é o Habeas Corpus, não o Habeas Data. O Habeas Data serve para assegurar o acesso a informações pessoais constantes de registros ou bancos de dados de entidades governamentais ou de caráter público.",
      difficulty: "FACIL",
    },
    {
      statement: "São cargos privativos de brasileiro NATO, EXCETO:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Presidente da República" },
        { letter: "B", text: "Ministro do STF" },
        { letter: "C", text: "Senador da República" },
        { letter: "D", text: "Presidente da Câmara dos Deputados" },
      ],
      correctAnswer: "C",
      explanation: "Senador NÃO é cargo privativo de brasileiro nato. Qualquer brasileiro (nato ou naturalizado) pode ser Senador. São privativos de nato: Presidente e Vice, Presidente da Câmara e do Senado, Ministro do STF, carreira diplomática, oficial das Forças Armadas e Ministro de Estado da Defesa.",
      difficulty: "MEDIO",
    },
    {
      statement: "A Constituição Federal de 1988 admite a pena de morte no Brasil em caso de guerra declarada.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "Conforme o art. 5°, XLVII, 'a', da CF, não haverá pena de morte, SALVO em caso de guerra declarada, nos termos do art. 84, XIX. Portanto, excepcionalmente, a pena de morte é admitida no ordenamento jurídico brasileiro.",
      difficulty: "DIFICIL",
    },
  ],

  // ── DIREITO PENAL ──
  DIREITO_PENAL: [
    {
      statement: "São elementos do fato típico, EXCETO:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Conduta" },
        { letter: "B", text: "Resultado" },
        { letter: "C", text: "Culpabilidade" },
        { letter: "D", text: "Nexo causal" },
      ],
      correctAnswer: "C",
      explanation: "Culpabilidade NÃO é elemento do fato típico. Os elementos do fato típico são: conduta, resultado, nexo causal e tipicidade. A culpabilidade é o terceiro substrato do crime na teoria tripartida (fato típico + ilicitude + culpabilidade).",
      difficulty: "MEDIO",
    },
    {
      statement: "No Direito Penal brasileiro, a tentativa é punida com a mesma pena do crime consumado.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "A tentativa é punida com a pena do crime consumado, DIMINUÍDA de 1/3 a 2/3 (art. 14, parágrafo único, CP). A redução é obrigatória e varia conforme o iter criminis percorrido: quanto mais próximo da consumação, menor a redução.",
      difficulty: "FACIL",
    },
    {
      statement: "Qual das alternativas apresenta uma causa de exclusão da ilicitude?",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Coação moral irresistível" },
        { letter: "B", text: "Estado de necessidade" },
        { letter: "C", text: "Erro de proibição inevitável" },
        { letter: "D", text: "Inimputabilidade" },
      ],
      correctAnswer: "B",
      explanation: "Estado de necessidade é causa de exclusão da ilicitude (art. 23, I, CP), ao lado da legítima defesa, estrito cumprimento do dever legal e exercício regular de direito. Coação moral irresistível e erro de proibição são excludentes de culpabilidade. Inimputabilidade também exclui culpabilidade.",
      difficulty: "MEDIO",
    },
    {
      statement: "Sobre o princípio da insignificância, é correto afirmar que:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Está expressamente previsto no Código Penal" },
        { letter: "B", text: "Exclui a tipicidade material da conduta" },
        { letter: "C", text: "Aplica-se a todos os crimes sem exceção" },
        { letter: "D", text: "Foi criado pela Constituição Federal de 1988" },
      ],
      correctAnswer: "B",
      explanation: "O princípio da insignificância (bagatela) exclui a tipicidade MATERIAL da conduta, pois a lesão ao bem jurídico é irrelevante. Não está previsto expressamente em lei (é construção doutrinária e jurisprudencial) e não se aplica a todos os crimes (ex: tráfico de drogas, violência doméstica).",
      difficulty: "DIFICIL",
    },
    {
      statement: "O crime de homicídio culposo admite tentativa.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "Crimes culposos NÃO admitem tentativa, pois na culpa o agente não deseja o resultado. A tentativa pressupõe dolo (vontade de alcançar o resultado). Também não admitem tentativa: crimes preterdolosos, contravenções penais e crimes omissivos próprios.",
      difficulty: "FACIL",
    },
  ],

  // ── DIREITO ADMINISTRATIVO ──
  DIREITO_ADMINISTRATIVO: [
    {
      statement: "São princípios expressos da Administração Pública no art. 37 da CF (LIMPE):",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência" },
        { letter: "B", text: "Legalidade, Igualdade, Moralidade, Proporcionalidade e Eficiência" },
        { letter: "C", text: "Legitimidade, Impessoalidade, Motivação, Publicidade e Economicidade" },
        { letter: "D", text: "Legalidade, Impessoalidade, Moralidade, Proporcionalidade e Especialidade" },
      ],
      correctAnswer: "A",
      explanation: "O art. 37, caput, da CF expressa os princípios LIMPE: Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência. Os demais princípios citados (proporcionalidade, motivação, etc.) são princípios implícitos ou reconhecidos pela doutrina.",
      difficulty: "FACIL",
    },
    {
      statement: "Os atos administrativos vinculados admitem revogação pela Administração Pública.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "Atos vinculados NÃO admitem revogação, pois não há margem de discricionariedade. A revogação é exclusiva de atos discricionários, por razões de conveniência e oportunidade. Atos vinculados podem ser anulados quando ilegais.",
      difficulty: "MEDIO",
    },
    {
      statement: "A modalidade de licitação obrigatória para concessão de serviço público é:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Tomada de preços" },
        { letter: "B", text: "Concorrência" },
        { letter: "C", text: "Convite" },
        { letter: "D", text: "Pregão" },
      ],
      correctAnswer: "B",
      explanation: "Para concessão de serviço público, a modalidade obrigatória é a CONCORRÊNCIA (art. 2°, II, da Lei 8.987/95). O pregão é destinado à aquisição de bens e serviços comuns. Tomada de preços e convite são modalidades de menor abrangência.",
      difficulty: "MEDIO",
    },
    {
      statement: "A respeito dos poderes administrativos, o poder disciplinar permite à Administração:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Editar normas gerais e abstratas" },
        { letter: "B", text: "Aplicar sanções aos agentes públicos e particulares com vínculo especial" },
        { letter: "C", text: "Restringir direitos individuais em prol do interesse público" },
        { letter: "D", text: "Organizar a estrutura interna da administração" },
      ],
      correctAnswer: "B",
      explanation: "O poder disciplinar permite à Administração apurar infrações e aplicar penalidades a servidores públicos e particulares que possuam vínculo jurídico especial com o Estado (ex: contratados, concessionários). Poder normativo (A), poder de polícia (C) e poder hierárquico (D) são poderes distintos.",
      difficulty: "MEDIO",
    },
    {
      statement: "A anulação de ato administrativo ilegal produz efeitos ex nunc (não retroativos).",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "A anulação produz efeitos EX TUNC (retroativos), alcançando o ato desde sua origem. É a REVOGAÇÃO que produz efeitos ex nunc (não retroativos). Anulação = ilegalidade = ex tunc. Revogação = conveniência/oportunidade = ex nunc.",
      difficulty: "FACIL",
    },
  ],

  // ── LÍNGUA PORTUGUESA ──
  PORTUGUES: [
    {
      statement: "Em 'Os alunos cujos pais compareceram foram aprovados', a função sintática de 'cujos pais' é:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Sujeito" },
        { letter: "B", text: "Adjunto adnominal" },
        { letter: "C", text: "Complemento nominal" },
        { letter: "D", text: "Objeto direto" },
      ],
      correctAnswer: "A",
      explanation: "'Cujos pais' é o sujeito do verbo 'compareceram' na oração subordinada adjetiva. 'Cujos' é pronome relativo com valor possessivo (= dos quais os). A oração 'cujos pais compareceram' funciona como adjunto adnominal de 'alunos'.",
      difficulty: "MEDIO",
    },
    {
      statement: "A crase é obrigatória antes de palavras masculinas.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "A crase (fusão da preposição 'a' com o artigo feminino 'a') NÃO ocorre antes de palavras masculinas em regra. Há exceções em expressões consagradas como 'à moda de' (subentendido), mas a regra geral é que não há crase antes de palavras masculinas.",
      difficulty: "FACIL",
    },
    {
      statement: "Assinale a alternativa em que a concordância verbal está CORRETA:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Fazem dois anos que não o vejo" },
        { letter: "B", text: "Houveram muitos problemas na reunião" },
        { letter: "C", text: "Existem várias soluções para o problema" },
        { letter: "D", text: "Podem haver erros no documento" },
      ],
      correctAnswer: "C",
      explanation: "'Existem' concorda com 'várias soluções' (sujeito plural). 'Fazer' (tempo) é impessoal: 'FAZ dois anos'. 'Haver' (existir) é impessoal: 'HOUVE muitos problemas'. 'Poder haver' mantém impessoalidade: 'PODE haver erros'.",
      difficulty: "MEDIO",
    },
    {
      statement: "Na frase 'É necessário que todos participem', o verbo 'participem' está no modo:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Indicativo" },
        { letter: "B", text: "Subjuntivo" },
        { letter: "C", text: "Imperativo" },
        { letter: "D", text: "Infinitivo" },
      ],
      correctAnswer: "B",
      explanation: "'Participem' está no presente do subjuntivo. O subjuntivo é usado em orações subordinadas que expressam dúvida, desejo, hipótese ou necessidade. A expressão 'É necessário que' exige subjuntivo na oração seguinte.",
      difficulty: "FACIL",
    },
    {
      statement: "O uso da vírgula antes de 'e' é sempre proibido na língua portuguesa.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "A vírgula antes de 'e' é permitida quando: os sujeitos são diferentes ('Maria estudou, e João trabalhou'), em polissíndeto, ou para separar orações com sujeitos distintos. Não é uma proibição absoluta.",
      difficulty: "MEDIO",
    },
  ],

  // ── MATEMÁTICA ──
  MATEMATICA: [
    {
      statement: "Um produto que custava R$ 200,00 sofreu um aumento de 15% seguido de um desconto de 15%. O preço final é:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "R$ 200,00" },
        { letter: "B", text: "R$ 195,50" },
        { letter: "C", text: "R$ 199,00" },
        { letter: "D", text: "R$ 195,00" },
      ],
      correctAnswer: "B",
      explanation: "200 × 1,15 = 230 (após aumento). 230 × 0,85 = 195,50 (após desconto). Aumentos e descontos sucessivos de mesma porcentagem NÃO se anulam. O fator multiplicativo é 1,15 × 0,85 = 0,9775, resultando em uma perda de 2,25%.",
      difficulty: "MEDIO",
    },
    {
      statement: "Se um capital de R$ 10.000,00 aplicado a juros compostos de 10% ao mês rende R$ 2.100,00 em 2 meses, então o montante é:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "R$ 12.000,00" },
        { letter: "B", text: "R$ 12.100,00" },
        { letter: "C", text: "R$ 11.000,00" },
        { letter: "D", text: "R$ 12.200,00" },
      ],
      correctAnswer: "B",
      explanation: "M = C(1+i)^t = 10.000 × (1,10)² = 10.000 × 1,21 = 12.100. Os juros são R$ 2.100,00. Note que em juros compostos, no 2° mês os juros incidem sobre 11.000 (não sobre 10.000), gerando 1.100, totalizando 2.100 de juros.",
      difficulty: "MEDIO",
    },
    {
      statement: "Em uma PA de razão 3, o primeiro termo é 5. O décimo termo vale:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "30" },
        { letter: "B", text: "32" },
        { letter: "C", text: "35" },
        { letter: "D", text: "27" },
      ],
      correctAnswer: "B",
      explanation: "Termo geral da PA: an = a1 + (n-1)r. a10 = 5 + (10-1) × 3 = 5 + 27 = 32. A PA é: 5, 8, 11, 14, 17, 20, 23, 26, 29, 32.",
      difficulty: "FACIL",
    },
    {
      statement: "Uma urna contém 3 bolas vermelhas e 7 bolas azuis. A probabilidade de sortear uma bola vermelha é de 30%.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "P(vermelha) = 3/10 = 0,30 = 30%. São 3 bolas vermelhas em um total de 10 bolas (3+7). A probabilidade é a razão entre casos favoráveis e casos possíveis.",
      difficulty: "FACIL",
    },
    {
      statement: "O determinante da matriz [[2,3],[4,1]] é igual a:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "10" },
        { letter: "B", text: "-10" },
        { letter: "C", text: "14" },
        { letter: "D", text: "-5" },
      ],
      correctAnswer: "B",
      explanation: "O determinante de uma matriz 2×2 [[a,b],[c,d]] é ad - bc. Portanto: (2×1) - (3×4) = 2 - 12 = -10.",
      difficulty: "MEDIO",
    },
  ],

  // ── RACIOCÍNIO LÓGICO ──
  RACIOCINIO_LOGICO: [
    {
      statement: "Se 'Todo policial é corajoso' é verdadeiro, então é CORRETO concluir que:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Todo corajoso é policial" },
        { letter: "B", text: "Algum corajoso é policial" },
        { letter: "C", text: "Quem não é policial não é corajoso" },
        { letter: "D", text: "Nenhum policial é covarde" },
      ],
      correctAnswer: "B",
      explanation: "Se todo policial é corajoso, então existe pelo menos um corajoso que é policial (os próprios policiais). A conversa (A) não é válida. A negação (C) é a recíproca da inversa, não necessariamente verdadeira. D é equivalente à proposição original e também é válida, mas B é a conclusão mais direta.",
      difficulty: "MEDIO",
    },
    {
      statement: "A negação da proposição 'Se chove, então a rua fica molhada' é:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Se não chove, então a rua não fica molhada" },
        { letter: "B", text: "Chove e a rua não fica molhada" },
        { letter: "C", text: "Não chove ou a rua fica molhada" },
        { letter: "D", text: "Se a rua fica molhada, então chove" },
      ],
      correctAnswer: "B",
      explanation: "A negação de P→Q é P∧¬Q (P e não Q). Ou seja: 'Chove E a rua NÃO fica molhada'. A negação da condicional NÃO é outra condicional, mas sim uma conjunção onde o antecedente é verdadeiro e o consequente é falso.",
      difficulty: "FACIL",
    },
    {
      statement: "Na sequência 2, 6, 18, 54, ..., o próximo termo é:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "108" },
        { letter: "B", text: "162" },
        { letter: "C", text: "72" },
        { letter: "D", text: "216" },
      ],
      correctAnswer: "B",
      explanation: "É uma PG de razão 3: cada termo é multiplicado por 3. 2×3=6, 6×3=18, 18×3=54, 54×3=162. O próximo termo é 162.",
      difficulty: "FACIL",
    },
    {
      statement: "Se p é verdadeiro e q é falso, então a proposição 'p OU q' é falsa.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "A disjunção (OU) é falsa SOMENTE quando ambas as proposições são falsas. Se p é V e q é F, então 'p OU q' é VERDADEIRO. A tabela verdade do OU: V∨V=V, V∨F=V, F∨V=V, F∨F=F.",
      difficulty: "FACIL",
    },
    {
      statement: "Em uma reunião com 8 pessoas, quantos apertos de mão são possíveis se cada pessoa cumprimenta todas as outras?",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "56" },
        { letter: "B", text: "28" },
        { letter: "C", text: "64" },
        { letter: "D", text: "36" },
      ],
      correctAnswer: "B",
      explanation: "É uma combinação de 8 pessoas tomadas 2 a 2: C(8,2) = 8!/(2!×6!) = (8×7)/2 = 28. A ordem não importa (aperto de mão A-B é o mesmo que B-A).",
      difficulty: "MEDIO",
    },
  ],

  // ── NOÇÕES DE INFORMÁTICA ──
  INFORMATICA: [
    {
      statement: "Qual protocolo é utilizado para a transferência segura de páginas web?",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "FTP" },
        { letter: "B", text: "SMTP" },
        { letter: "C", text: "HTTPS" },
        { letter: "D", text: "POP3" },
      ],
      correctAnswer: "C",
      explanation: "HTTPS (HyperText Transfer Protocol Secure) é o protocolo para transferência segura de páginas web, utilizando criptografia SSL/TLS. FTP é transferência de arquivos, SMTP é envio de e-mail e POP3 é recebimento de e-mail.",
      difficulty: "FACIL",
    },
    {
      statement: "No sistema operacional Windows, o atalho Ctrl+Z serve para:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Copiar" },
        { letter: "B", text: "Colar" },
        { letter: "C", text: "Desfazer a última ação" },
        { letter: "D", text: "Selecionar tudo" },
      ],
      correctAnswer: "C",
      explanation: "Ctrl+Z é o atalho universal para DESFAZER (Undo) a última ação. Ctrl+C = Copiar, Ctrl+V = Colar, Ctrl+A = Selecionar tudo, Ctrl+X = Recortar.",
      difficulty: "FACIL",
    },
    {
      statement: "Phishing é uma técnica de engenharia social que visa obter dados pessoais por meio de mensagens fraudulentas.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "Phishing é uma técnica fraudulenta de engenharia social que usa e-mails, sites falsos ou mensagens para enganar usuários e obter informações confidenciais como senhas, números de cartão de crédito e dados bancários.",
      difficulty: "FACIL",
    },
    {
      statement: "Em uma planilha do Excel/Calc, a função que soma valores com base em critérios é:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "SOMA" },
        { letter: "B", text: "SOMASE" },
        { letter: "C", text: "CONT.SE" },
        { letter: "D", text: "MÉDIA" },
      ],
      correctAnswer: "B",
      explanation: "SOMASE (SUMIF) soma valores que atendem a um critério específico. SOMA soma todos os valores. CONT.SE conta células que atendem a um critério. MÉDIA calcula a média aritmética.",
      difficulty: "MEDIO",
    },
    {
      statement: "A computação em nuvem (cloud computing) permite acessar dados e aplicativos pela internet sem necessidade de instalação local.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "Cloud computing permite acessar recursos de TI (armazenamento, processamento, aplicativos) pela internet sob demanda, sem necessidade de infraestrutura ou instalação local. Exemplos: Google Drive, Microsoft 365 Online, AWS.",
      difficulty: "FACIL",
    },
  ],

  // ── ÉTICA NO SERVIÇO PÚBLICO ──
  ETICA_SERVICO_PUBLICO: [
    {
      statement: "Segundo o Decreto 1.171/94, a moralidade da Administração Pública:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Limita-se à legalidade formal dos atos" },
        { letter: "B", text: "Não se limita à distinção entre bem e mal, devendo acrescentar a ideia de que o fim é sempre o bem comum" },
        { letter: "C", text: "É opcional para servidores em estágio probatório" },
        { letter: "D", text: "Aplica-se somente aos servidores de carreira" },
      ],
      correctAnswer: "B",
      explanation: "O Decreto 1.171/94 (Código de Ética do Servidor Público) estabelece que a moralidade administrativa não se limita à distinção entre o bem e o mal. O agente deve decidir entre o honesto e o desonesto, acrescentando a ideia de que o fim é SEMPRE o bem comum.",
      difficulty: "MEDIO",
    },
    {
      statement: "O servidor público pode exercer atividade privada incompatível com o cargo, desde que autorizado pelo superior hierárquico.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "É VEDADO ao servidor exercer atividade incompatível com o exercício do cargo, emprego ou função pública, independentemente de autorização. Essa vedação é absoluta e visa preservar a moralidade e a eficiência do serviço público.",
      difficulty: "FACIL",
    },
    {
      statement: "O princípio da publicidade na Administração Pública significa que:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "O servidor deve fazer propaganda pessoal de seus atos" },
        { letter: "B", text: "Todos os atos devem ser divulgados na imprensa" },
        { letter: "C", text: "Os atos da Administração devem ser transparentes e acessíveis ao público" },
        { letter: "D", text: "Informações sigilosas devem ser publicadas" },
      ],
      correctAnswer: "C",
      explanation: "O princípio da publicidade determina que os atos da Administração sejam transparentes e acessíveis ao público, garantindo o controle social. Não significa publicidade pessoal nem divulgação irrestrita de informações sigilosas.",
      difficulty: "FACIL",
    },
    {
      statement: "A cortesia, a boa vontade e o respeito ao cidadão são deveres do servidor público federal.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "Conforme o Decreto 1.171/94, são deveres do servidor público: tratar com urbanidade, cortesia, boa vontade e respeito a qualquer pessoa que necessite de atendimento. O servidor é reflexo da Administração perante o cidadão.",
      difficulty: "FACIL",
    },
    {
      statement: "As Comissões de Ética criadas pelo Decreto 1.171/94 têm competência para aplicar pena de demissão.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "As Comissões de Ética podem apenas aplicar a pena de CENSURA ao servidor público. A demissão é competência da autoridade administrativa competente, após processo administrativo disciplinar (PAD). A Comissão de Ética atua no âmbito ético-disciplinar com poder sancionatório limitado.",
      difficulty: "MEDIO",
    },
  ],

  // ── LÍNGUA INGLESA ──
  INGLES: [
    {
      statement: "Choose the correct sentence in the Simple Past tense:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "She has gone to the store yesterday" },
        { letter: "B", text: "She went to the store yesterday" },
        { letter: "C", text: "She goes to the store yesterday" },
        { letter: "D", text: "She is going to the store yesterday" },
      ],
      correctAnswer: "B",
      explanation: "'Went' is the Simple Past of 'go'. 'Yesterday' requires Simple Past, not Present Perfect ('has gone'), Simple Present ('goes'), or Present Continuous ('is going'). Time markers like 'yesterday', 'last week', 'ago' require Simple Past.",
      difficulty: "FACIL",
    },
    {
      statement: "In the sentence 'If I had studied harder, I would have passed the exam', the conditional used is:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Zero Conditional" },
        { letter: "B", text: "First Conditional" },
        { letter: "C", text: "Second Conditional" },
        { letter: "D", text: "Third Conditional" },
      ],
      correctAnswer: "D",
      explanation: "Third Conditional uses 'If + Past Perfect, would have + Past Participle'. It refers to unreal situations in the past (things that didn't happen). 'If I had studied' (but I didn't) → 'I would have passed' (but I didn't).",
      difficulty: "MEDIO",
    },
    {
      statement: "The word 'although' is used to express:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Cause" },
        { letter: "B", text: "Contrast" },
        { letter: "C", text: "Addition" },
        { letter: "D", text: "Consequence" },
      ],
      correctAnswer: "B",
      explanation: "'Although' (embora, apesar de que) is a conjunction used to express CONTRAST or concession. It introduces an idea that contrasts with the main clause. Similar words: though, even though, despite, in spite of.",
      difficulty: "FACIL",
    },
    {
      statement: "The expression 'to break the ice' means to start physical exercise.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "'To break the ice' is an idiom that means to initiate conversation or reduce tension in a social situation, NOT to start physical exercise. Example: 'He told a joke to break the ice at the meeting.'",
      difficulty: "FACIL",
    },
    {
      statement: "Choose the correct passive voice for: 'The police arrested the suspect.'",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "The suspect was arrested by the police" },
        { letter: "B", text: "The suspect is arrested by the police" },
        { letter: "C", text: "The suspect has been arrested by the police" },
        { letter: "D", text: "The suspect were arrested by the police" },
      ],
      correctAnswer: "A",
      explanation: "Active: Subject + Past Simple verb + Object → Passive: Object + was/were + Past Participle + by + Agent. 'The suspect' (singular) + 'was arrested' (Past Simple passive) + 'by the police'.",
      difficulty: "MEDIO",
    },
  ],

  // ── DIREITO PROCESSUAL PENAL ──
  DIREITO_PROCESSUAL_PENAL: [
    {
      statement: "O inquérito policial é peça obrigatória para o oferecimento da denúncia pelo Ministério Público.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "O inquérito policial é DISPENSÁVEL. O MP pode oferecer denúncia com base em qualquer peça de informação que contenha elementos suficientes de autoria e materialidade. O IP é útil, mas não é condição obrigatória para a ação penal.",
      difficulty: "FACIL",
    },
    {
      statement: "O Tribunal do Júri tem competência para julgar crimes dolosos contra a vida. A respeito, qual dos princípios abaixo NÃO é do Júri?",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Plenitude de defesa" },
        { letter: "B", text: "Sigilo das votações" },
        { letter: "C", text: "Soberania dos veredictos" },
        { letter: "D", text: "Publicidade das deliberações" },
      ],
      correctAnswer: "D",
      explanation: "Os princípios do Tribunal do Júri (art. 5°, XXXVIII, CF) são: plenitude de defesa, sigilo das votações, soberania dos veredictos e competência para crimes dolosos contra a vida. 'Publicidade das deliberações' contradiz o princípio do sigilo das votações.",
      difficulty: "MEDIO",
    },
    {
      statement: "A prisão preventiva pode ser decretada de ofício pelo juiz durante a investigação policial.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "Após o Pacote Anticrime (Lei 13.964/2019), o juiz NÃO pode decretar prisão preventiva de ofício, nem durante a investigação nem durante o processo. Precisa de requerimento do MP, do querelante ou do assistente, ou de representação da autoridade policial.",
      difficulty: "MEDIO",
    },
    {
      statement: "A interceptação telefônica pode ser autorizada para investigação de qualquer tipo de crime.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "A interceptação telefônica (Lei 9.296/96) só pode ser autorizada para investigação de crimes punidos com RECLUSÃO. Crimes apenados com detenção não admitem interceptação. Além disso, exige autorização judicial e indícios razoáveis de autoria.",
      difficulty: "MEDIO",
    },
    {
      statement: "O prazo para conclusão do inquérito policial com réu preso é de:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "30 dias" },
        { letter: "B", text: "15 dias" },
        { letter: "C", text: "10 dias" },
        { letter: "D", text: "5 dias" },
      ],
      correctAnswer: "C",
      explanation: "Conforme o art. 10 do CPP, o inquérito policial deve ser concluído em 10 DIAS quando o indiciado estiver preso e 30 dias quando estiver solto. No âmbito da Polícia Federal, os prazos são 15 dias (preso, prorrogável) e 30 dias (solto).",
      difficulty: "FACIL",
    },
  ],

  // ── FÍSICA ──
  FISICA: [
    {
      statement: "Um corpo é lançado verticalmente para cima com velocidade de 20 m/s (g=10 m/s²). O tempo para atingir a altura máxima é:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "1 segundo" },
        { letter: "B", text: "2 segundos" },
        { letter: "C", text: "4 segundos" },
        { letter: "D", text: "10 segundos" },
      ],
      correctAnswer: "B",
      explanation: "Na altura máxima, v=0. Usando v = v₀ - gt: 0 = 20 - 10t → t = 2 segundos. A altura máxima é H = v₀²/2g = 400/20 = 20 metros.",
      difficulty: "FACIL",
    },
    {
      statement: "A 1ª Lei de Newton (Inércia) afirma que todo corpo em repouso ou MRU permanece nesse estado a menos que uma força resultante atue sobre ele.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "A 1ª Lei de Newton (Lei da Inércia) afirma que um corpo em repouso tende a permanecer em repouso, e um corpo em movimento retilíneo uniforme (MRU) tende a permanecer em MRU, a menos que uma força resultante externa atue sobre ele.",
      difficulty: "FACIL",
    },
    {
      statement: "Uma onda sonora NÃO pode se propagar no vácuo porque:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "É uma onda eletromagnética" },
        { letter: "B", text: "É uma onda mecânica que necessita de meio material" },
        { letter: "C", text: "Sua frequência é muito baixa" },
        { letter: "D", text: "A velocidade da luz impede sua propagação" },
      ],
      correctAnswer: "B",
      explanation: "O som é uma onda MECÂNICA longitudinal que precisa de um meio material (ar, água, sólido) para se propagar. No vácuo, não há partículas para transmitir a vibração. Ondas eletromagnéticas (luz, rádio) se propagam no vácuo.",
      difficulty: "FACIL",
    },
    {
      statement: "Dois resistores de 6Ω cada, ligados em paralelo, possuem resistência equivalente de:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "12 Ω" },
        { letter: "B", text: "6 Ω" },
        { letter: "C", text: "3 Ω" },
        { letter: "D", text: "36 Ω" },
      ],
      correctAnswer: "C",
      explanation: "Em paralelo: 1/Req = 1/R1 + 1/R2 = 1/6 + 1/6 = 2/6 → Req = 3Ω. Para dois resistores iguais em paralelo, a resistência equivalente é sempre metade de cada um (R/2). Em série seria 12Ω.",
      difficulty: "MEDIO",
    },
    {
      statement: "A 2ª Lei da Termodinâmica afirma que é possível construir uma máquina térmica com 100% de rendimento.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "A 2ª Lei da Termodinâmica estabelece que é IMPOSSÍVEL construir uma máquina térmica com rendimento de 100% (Enunciado de Kelvin-Planck). Sempre haverá dissipação de calor para a fonte fria. O rendimento máximo teórico é o do ciclo de Carnot.",
      difficulty: "MEDIO",
    },
  ],

  // ── QUÍMICA ──
  QUIMICA: [
    {
      statement: "O número atômico de um elemento indica:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "O número de nêutrons" },
        { letter: "B", text: "O número de prótons" },
        { letter: "C", text: "A massa atômica" },
        { letter: "D", text: "O número de elétrons na camada de valência" },
      ],
      correctAnswer: "B",
      explanation: "O número atômico (Z) indica a quantidade de PRÓTONS no núcleo do átomo. É a identidade do elemento. O número de massa (A) = prótons + nêutrons. Em átomos neutros, Z também corresponde ao número de elétrons.",
      difficulty: "FACIL",
    },
    {
      statement: "A ligação iônica ocorre tipicamente entre metais e ametais.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "A ligação iônica ocorre por transferência de elétrons, tipicamente entre um METAL (que perde elétrons, formando cátion) e um AMETAL (que ganha elétrons, formando ânion). Exemplo: NaCl (sódio-metal + cloro-ametal).",
      difficulty: "FACIL",
    },
    {
      statement: "Uma solução aquosa com pH igual a 3 é considerada:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Neutra" },
        { letter: "B", text: "Básica" },
        { letter: "C", text: "Ácida" },
        { letter: "D", text: "Anfótera" },
      ],
      correctAnswer: "C",
      explanation: "pH < 7 = solução ÁCIDA. pH = 7 = neutra. pH > 7 = básica (alcalina). pH 3 indica uma solução ácida. Quanto menor o pH, mais ácida a solução. Exemplos: suco de limão (pH ~2), vinagre (pH ~3).",
      difficulty: "FACIL",
    },
    {
      statement: "Na reação 2H₂ + O₂ → 2H₂O, o número total de mols de reagentes é:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "2 mols" },
        { letter: "B", text: "3 mols" },
        { letter: "C", text: "4 mols" },
        { letter: "D", text: "5 mols" },
      ],
      correctAnswer: "B",
      explanation: "Os reagentes são 2H₂ (2 mols) + O₂ (1 mol) = 3 mols de reagentes no total. Os coeficientes estequiométricos indicam a proporção molar. São produzidos 2 mols de H₂O.",
      difficulty: "FACIL",
    },
    {
      statement: "Isótopos são átomos de mesmo elemento com diferentes números de massa.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "Isótopos têm o MESMO número atômico (Z) mas DIFERENTE número de massa (A), pois possuem diferentes quantidades de nêutrons. Ex: Hidrogênio (¹H), Deutério (²H), Trítio (³H) - todos com Z=1 mas A diferente.",
      difficulty: "FACIL",
    },
  ],

  // ── BIOLOGIA ──
  BIOLOGIA: [
    {
      statement: "A mitose é um processo de divisão celular que resulta em:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "4 células haploides" },
        { letter: "B", text: "2 células diploides geneticamente idênticas" },
        { letter: "C", text: "2 células haploides" },
        { letter: "D", text: "4 células diploides" },
      ],
      correctAnswer: "B",
      explanation: "A mitose produz 2 células-filhas DIPLOIDES (2n) geneticamente idênticas à célula-mãe. Ocorre nas células somáticas para crescimento e regeneração. A meiose é que produz 4 células haploides (gametas).",
      difficulty: "FACIL",
    },
    {
      statement: "O DNA é formado por uma dupla hélice de nucleotídeos ligados por pontes de hidrogênio entre as bases nitrogenadas.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "O DNA (ácido desoxirribonucleico) é formado por duas fitas antiparalelas em forma de dupla hélice. As bases nitrogenadas se pareiam por pontes de hidrogênio: Adenina-Timina (2 pontes) e Citosina-Guanina (3 pontes).",
      difficulty: "FACIL",
    },
    {
      statement: "A fotossíntese ocorre em qual organela celular?",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Mitocôndria" },
        { letter: "B", text: "Cloroplasto" },
        { letter: "C", text: "Ribossomo" },
        { letter: "D", text: "Complexo de Golgi" },
      ],
      correctAnswer: "B",
      explanation: "A fotossíntese ocorre nos CLOROPLASTOS, organelas presentes em células vegetais e algas. Utilizam luz solar, CO₂ e H₂O para produzir glicose e O₂. As mitocôndrias realizam respiração celular. Ribossomos fazem síntese de proteínas.",
      difficulty: "FACIL",
    },
    {
      statement: "Vírus são considerados seres vivos porque possuem metabolismo próprio.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "Vírus NÃO possuem metabolismo próprio. São parasitas intracelulares obrigatórios que dependem da maquinaria celular do hospedeiro para se replicar. Por isso, há debate sobre classificá-los como seres vivos. São acelulares (não possuem células).",
      difficulty: "FACIL",
    },
    {
      statement: "Na cadeia alimentar, os decompositores atuam:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Apenas no primeiro nível trófico" },
        { letter: "B", text: "Em todos os níveis tróficos, degradando matéria orgânica morta" },
        { letter: "C", text: "Somente como consumidores primários" },
        { letter: "D", text: "Transformando energia solar em matéria orgânica" },
      ],
      correctAnswer: "B",
      explanation: "Decompositores (fungos e bactérias) atuam em TODOS os níveis tróficos, degradando matéria orgânica morta e reciclando nutrientes para o ecossistema. Não ocupam um nível trófico específico, mas interagem com todos.",
      difficulty: "MEDIO",
    },
  ],

  // ── GEOGRAFIA ──
  GEOGRAFIA: [
    {
      statement: "O bioma brasileiro que ocupa a maior extensão territorial é:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Cerrado" },
        { letter: "B", text: "Amazônia" },
        { letter: "C", text: "Mata Atlântica" },
        { letter: "D", text: "Caatinga" },
      ],
      correctAnswer: "B",
      explanation: "A Amazônia ocupa cerca de 49% do território brasileiro, sendo o maior bioma. Cerrado ~24%, Mata Atlântica ~13%, Caatinga ~10%, Pampa ~2% e Pantanal ~2%.",
      difficulty: "FACIL",
    },
    {
      statement: "O efeito estufa é um fenômeno exclusivamente causado pela ação humana.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "O efeito estufa é um fenômeno NATURAL essencial para a vida na Terra, mantendo a temperatura média em ~15°C. A ação humana INTENSIFICA o efeito estufa por meio da emissão excessiva de gases como CO₂ e metano, causando o aquecimento global.",
      difficulty: "FACIL",
    },
    {
      statement: "A migração interna no Brasil do tipo êxodo rural significa:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Deslocamento da cidade para o campo" },
        { letter: "B", text: "Deslocamento do campo para a cidade" },
        { letter: "C", text: "Migração entre estados" },
        { letter: "D", text: "Imigração de outros países" },
      ],
      correctAnswer: "B",
      explanation: "Êxodo rural é o deslocamento de população do CAMPO para a CIDADE. Foi intenso no Brasil entre 1950-1980, impulsionado pela industrialização e mecanização agrícola. Resultou em urbanização acelerada e formação de periferias.",
      difficulty: "FACIL",
    },
    {
      statement: "O IDH (Índice de Desenvolvimento Humano) considera três dimensões: saúde, educação e renda.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "O IDH mede o desenvolvimento humano em três dimensões: saúde (expectativa de vida ao nascer), educação (anos médios e esperados de escolaridade) e renda (PIB per capita em dólares PPC). Varia de 0 a 1 (maior = mais desenvolvido).",
      difficulty: "FACIL",
    },
    {
      statement: "A globalização econômica caracteriza-se por:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Isolamento dos mercados nacionais" },
        { letter: "B", text: "Integração de mercados, fluxo de capitais e interdependência entre países" },
        { letter: "C", text: "Redução do comércio internacional" },
        { letter: "D", text: "Eliminação completa das desigualdades" },
      ],
      correctAnswer: "B",
      explanation: "A globalização econômica se caracteriza pela integração crescente dos mercados, livre fluxo de capitais, expansão das multinacionais e interdependência entre economias nacionais. Não elimina desigualdades e pode até acentuá-las.",
      difficulty: "MEDIO",
    },
  ],

  // ── HISTÓRIA ──
  HISTORIA: [
    {
      statement: "A Proclamação da República no Brasil ocorreu em:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "7 de setembro de 1822" },
        { letter: "B", text: "15 de novembro de 1889" },
        { letter: "C", text: "13 de maio de 1888" },
        { letter: "D", text: "1 de janeiro de 1891" },
      ],
      correctAnswer: "B",
      explanation: "A República foi proclamada em 15 de novembro de 1889, liderada pelo Marechal Deodoro da Fonseca. 7/9/1822 = Independência do Brasil. 13/5/1888 = Lei Áurea (abolição). 1891 = promulgação da primeira Constituição republicana.",
      difficulty: "FACIL",
    },
    {
      statement: "A Lei Áurea, de 1888, aboliu a escravidão no Brasil com indenização aos escravizados.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "A Lei Áurea (Lei 3.353/1888) aboliu a escravidão SEM INDENIZAÇÃO nem aos proprietários nem aos escravizados. Não houve nenhuma política de reparação, integração social ou distribuição de terras para os ex-escravizados, o que perpetuou desigualdades.",
      difficulty: "MEDIO",
    },
    {
      statement: "O AI-5 (1968) durante a ditadura militar no Brasil:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Restaurou a democracia" },
        { letter: "B", text: "Ampliou os direitos civis" },
        { letter: "C", text: "Suspendeu direitos políticos e fechou o Congresso" },
        { letter: "D", text: "Convocou eleições diretas" },
      ],
      correctAnswer: "C",
      explanation: "O Ato Institucional nº 5 (AI-5), de dezembro de 1968, foi o mais repressivo da ditadura militar. Permitia: fechar o Congresso, cassar mandatos, suspender habeas corpus, censurar a imprensa e decretar estado de sítio sem limites.",
      difficulty: "MEDIO",
    },
    {
      statement: "A Era Vargas (1930-1945) incluiu o período chamado Estado Novo, de caráter ditatorial.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "A Era Vargas dividiu-se em: Governo Provisório (1930-34), Governo Constitucional (1934-37) e Estado Novo (1937-45). O Estado Novo foi uma ditadura: Vargas fechou o Congresso, impôs nova Constituição (1937), censurou a imprensa e perseguiu opositores.",
      difficulty: "FACIL",
    },
    {
      statement: "A Revolução Francesa de 1789 teve como lema:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Ordem e Progresso" },
        { letter: "B", text: "Liberdade, Igualdade e Fraternidade" },
        { letter: "C", text: "Deus, Pátria e Família" },
        { letter: "D", text: "Paz, Terra e Pão" },
      ],
      correctAnswer: "B",
      explanation: "'Liberdade, Igualdade e Fraternidade' (Liberté, Égalité, Fraternité) foi o lema da Revolução Francesa. 'Ordem e Progresso' é do positivismo (bandeira do Brasil). 'Paz, Terra e Pão' foi lema da Revolução Russa.",
      difficulty: "FACIL",
    },
  ],

  // ── FILOSOFIA ──
  FILOSOFIA: [
    {
      statement: "Sócrates é conhecido por seu método de ensino chamado:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Método cartesiano" },
        { letter: "B", text: "Maiêutica" },
        { letter: "C", text: "Dialética hegeliana" },
        { letter: "D", text: "Fenomenologia" },
      ],
      correctAnswer: "B",
      explanation: "A maiêutica socrática é o método de ensino por perguntas que leva o interlocutor a descobrir a verdade por si mesmo. Sócrates comparava ao ofício de parteira: ajudar a 'dar à luz' o conhecimento. O método cartesiano é de Descartes, a dialética hegeliana de Hegel.",
      difficulty: "FACIL",
    },
    {
      statement: "'Penso, logo existo' (Cogito, ergo sum) é a proposição fundamental de:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Aristóteles" },
        { letter: "B", text: "Platão" },
        { letter: "C", text: "René Descartes" },
        { letter: "D", text: "Immanuel Kant" },
      ],
      correctAnswer: "C",
      explanation: "'Penso, logo existo' é a base do racionalismo de René Descartes. Após duvidar de tudo (dúvida metódica), Descartes chegou à única certeza: o próprio ato de pensar prova a existência do pensante. É o fundamento do racionalismo moderno.",
      difficulty: "FACIL",
    },
    {
      statement: "O imperativo categórico de Kant afirma que devemos agir segundo interesses pessoais.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "O imperativo categórico de Kant determina que devemos agir segundo uma máxima que possamos querer que se torne LEI UNIVERSAL, não por interesses pessoais. A ética kantiana é deontológica: o dever moral é independente das consequências ou interesses particulares.",
      difficulty: "MEDIO",
    },
    {
      statement: "A Alegoria da Caverna de Platão representa:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "A importância da experiência sensorial" },
        { letter: "B", text: "A passagem da ignorância ao conhecimento verdadeiro" },
        { letter: "C", text: "A superioridade do mundo material" },
        { letter: "D", text: "A impossibilidade do conhecimento" },
      ],
      correctAnswer: "B",
      explanation: "A Alegoria da Caverna (República, Livro VII) representa a passagem do mundo das sombras (opinião, doxa) para o mundo da luz (conhecimento verdadeiro, episteme). Os prisioneiros veem sombras; ao sair da caverna, alcançam a verdade (Mundo das Ideias).",
      difficulty: "MEDIO",
    },
    {
      statement: "Para o empirismo, todo conhecimento deriva exclusivamente da experiência sensorial.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "O empirismo (Locke, Hume, Bacon) defende que TODO conhecimento provém da experiência sensorial. A mente é uma 'tábula rasa' (folha em branco) ao nascer, e o conhecimento é construído pela experiência. Opõe-se ao racionalismo (conhecimento inato/razão).",
      difficulty: "FACIL",
    },
  ],

  // ── SOCIOLOGIA ──
  SOCIOLOGIA: [
    {
      statement: "Para Émile Durkheim, o fato social se caracteriza por ser:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Individual, subjetivo e espontâneo" },
        { letter: "B", text: "Exterior, coercitivo e geral" },
        { letter: "C", text: "Econômico, material e histórico" },
        { letter: "D", text: "Racional, livre e consciente" },
      ],
      correctAnswer: "B",
      explanation: "Durkheim definiu fato social por três características: EXTERIORIDADE (existe fora do indivíduo), COERCITIVIDADE (exerce pressão sobre o indivíduo) e GENERALIDADE (é coletivo, geral na sociedade). Exemplos: leis, costumes, religião.",
      difficulty: "MEDIO",
    },
    {
      statement: "Max Weber é considerado o fundador da sociologia compreensiva, que busca entender o sentido da ação social.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "Weber propôs a sociologia compreensiva (Verstehen): o objetivo é COMPREENDER o sentido subjetivo que os indivíduos atribuem às suas ações. A ação social é o conceito central: comportamento dotado de sentido e orientado pela ação de outros.",
      difficulty: "MEDIO",
    },
    {
      statement: "Para Karl Marx, a história das sociedades é a história da:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Evolução tecnológica" },
        { letter: "B", text: "Cooperação entre classes" },
        { letter: "C", text: "Luta de classes" },
        { letter: "D", text: "Democracia participativa" },
      ],
      correctAnswer: "C",
      explanation: "'A história de todas as sociedades até hoje existentes é a história da LUTA DE CLASSES' (Manifesto Comunista, 1848). Para Marx, o motor da história é o conflito entre classes sociais: senhor/escravo, suserano/servo, burguesia/proletariado.",
      difficulty: "FACIL",
    },
    {
      statement: "Estratificação social é sinônimo de mobilidade social.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "São conceitos diferentes. ESTRATIFICAÇÃO social é a divisão da sociedade em camadas hierárquicas (classes, castas, estamentos). MOBILIDADE social é a possibilidade de um indivíduo mudar de posição entre as camadas (ascendente ou descendente).",
      difficulty: "FACIL",
    },
    {
      statement: "O conceito de 'indústria cultural' foi desenvolvido por:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Karl Marx" },
        { letter: "B", text: "Adorno e Horkheimer (Escola de Frankfurt)" },
        { letter: "C", text: "Auguste Comte" },
        { letter: "D", text: "Max Weber" },
      ],
      correctAnswer: "B",
      explanation: "O conceito de 'indústria cultural' foi desenvolvido por Theodor Adorno e Max Horkheimer da Escola de Frankfurt. Refere-se à produção cultural em massa que padroniza, aliena e transforma a cultura em mercadoria, servindo ao sistema capitalista.",
      difficulty: "MEDIO",
    },
  ],

  // ── LITERATURA ──
  LITERATURA: [
    {
      statement: "Machado de Assis é o principal representante do Realismo brasileiro. Qual obra abaixo é de sua autoria?",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "O Cortiço" },
        { letter: "B", text: "Dom Casmurro" },
        { letter: "C", text: "O Guarani" },
        { letter: "D", text: "A Moreninha" },
      ],
      correctAnswer: "B",
      explanation: "Dom Casmurro (1899) é de Machado de Assis, grande nome do Realismo. O Cortiço é de Aluísio Azevedo (Naturalismo). O Guarani é de José de Alencar (Romantismo). A Moreninha é de Joaquim Manuel de Macedo (Romantismo).",
      difficulty: "FACIL",
    },
    {
      statement: "O Modernismo brasileiro teve como marco inicial a Semana de Arte Moderna de:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "1912" },
        { letter: "B", text: "1922" },
        { letter: "C", text: "1930" },
        { letter: "D", text: "1945" },
      ],
      correctAnswer: "B",
      explanation: "A Semana de Arte Moderna de 1922, realizada no Teatro Municipal de São Paulo, é o marco inicial do Modernismo brasileiro. Participaram Mário de Andrade, Oswald de Andrade, Anita Malfatti, Villa-Lobos, entre outros.",
      difficulty: "FACIL",
    },
    {
      statement: "O Romantismo brasileiro se caracteriza pela valorização do indígena como herói nacional.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "O Indianismo é uma das marcas do Romantismo brasileiro (1ª geração). O índio é idealizado como herói nacional, símbolo de bravura e pureza. Principais obras: O Guarani e Iracema (José de Alencar), I-Juca-Pirama (Gonçalves Dias).",
      difficulty: "FACIL",
    },
    {
      statement: "Grande Sertão: Veredas, de Guimarães Rosa, pertence à segunda fase do Modernismo.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "Grande Sertão: Veredas (1956) pertence à TERCEIRA fase do Modernismo (Geração de 45). A segunda fase (1930-45) inclui autores como Graciliano Ramos, Rachel de Queiroz e Jorge Amado. A terceira fase se caracteriza por experimentação linguística.",
      difficulty: "MEDIO",
    },
    {
      statement: "O Naturalismo se diferencia do Realismo por:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Valorizar os sentimentos e a subjetividade" },
        { letter: "B", text: "Enfatizar o determinismo biológico e social" },
        { letter: "C", text: "Idealizar a natureza e o campo" },
        { letter: "D", text: "Utilizar linguagem poética e rebuscada" },
      ],
      correctAnswer: "B",
      explanation: "O Naturalismo é uma radicalização do Realismo que enfatiza o DETERMINISMO (biológico, social e ambiental). O ser humano é visto como produto do meio, da raça e do momento histórico. Aborda temas como patologias, instintos e miséria social.",
      difficulty: "MEDIO",
    },
  ],

  // ── ATUALIDADES ──
  ATUALIDADES: [
    {
      statement: "O BRICS é um grupo de países que inclui o Brasil. Que tipo de organização é o BRICS?",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Organização militar" },
        { letter: "B", text: "Bloco de cooperação entre economias emergentes" },
        { letter: "C", text: "Acordo de livre comércio" },
        { letter: "D", text: "Organização exclusivamente europeia" },
      ],
      correctAnswer: "B",
      explanation: "O BRICS é um bloco de cooperação entre economias emergentes: Brasil, Rússia, Índia, China e África do Sul (e novos membros a partir de 2024). Não é organização militar nem bloco comercial formal, mas fórum de cooperação econômica e política.",
      difficulty: "FACIL",
    },
    {
      statement: "A Inteligência Artificial (IA) generativa, como o ChatGPT, trouxe debates sobre regulamentação no Brasil.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "O Marco Legal da Inteligência Artificial está em discussão no Congresso brasileiro. O debate envolve regulamentação de IA, proteção de dados, responsabilidade civil, transparência algorítmica e impactos no mercado de trabalho.",
      difficulty: "FACIL",
    },
    {
      statement: "A reforma tributária aprovada no Brasil em 2023 prevê a criação do IVA dual, composto por:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "IRPF e IRPJ" },
        { letter: "B", text: "CBS (federal) e IBS (estadual/municipal)" },
        { letter: "C", text: "IOF e ITBI" },
        { letter: "D", text: "ICMS e ISS mantidos sem alteração" },
      ],
      correctAnswer: "B",
      explanation: "A Reforma Tributária (EC 132/2023) cria o IVA dual: CBS (Contribuição sobre Bens e Serviços, federal, substituindo PIS e Cofins) e IBS (Imposto sobre Bens e Serviços, estadual/municipal, substituindo ICMS e ISS).",
      difficulty: "MEDIO",
    },
    {
      statement: "O desmatamento na Amazônia brasileira é uma questão relevante apenas no contexto nacional.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "O desmatamento na Amazônia é uma questão GLOBAL. A floresta é essencial para o equilíbrio climático mundial, biodiversidade e ciclo da água. É pauta constante em acordos internacionais (COP, Acordo de Paris) e pressões diplomáticas.",
      difficulty: "FACIL",
    },
    {
      statement: "O Mercosul foi fundado pelo Tratado de Assunção em:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "1985" },
        { letter: "B", text: "1991" },
        { letter: "C", text: "2000" },
        { letter: "D", text: "1967" },
      ],
      correctAnswer: "B",
      explanation: "O Mercosul foi fundado pelo Tratado de Assunção em 1991, inicialmente por Brasil, Argentina, Paraguai e Uruguai. É um bloco econômico do tipo união aduaneira (com livre comércio interno e tarifa externa comum).",
      difficulty: "MEDIO",
    },
  ],

  // ── ADMINISTRAÇÃO PÚBLICA ──
  ADMINISTRACAO: [
    {
      statement: "A administração pública gerencial se diferencia da burocrática por focar em:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Processos e formalidades" },
        { letter: "B", text: "Resultados e eficiência" },
        { letter: "C", text: "Hierarquia e controle" },
        { letter: "D", text: "Impessoalidade e normas rígidas" },
      ],
      correctAnswer: "B",
      explanation: "A administração gerencial foca em RESULTADOS e EFICIÊNCIA, enquanto a burocrática foca em processos e formalidades. A gerencial surgiu como resposta à rigidez burocrática, buscando descentralização, flexibilidade e orientação ao cidadão-cliente.",
      difficulty: "MEDIO",
    },
    {
      statement: "O modelo burocrático de Max Weber tem como características a impessoalidade, a hierarquia e a meritocracia.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "A burocracia weberiana se caracteriza por: impessoalidade, hierarquia, meritocracia, formalismo, profissionalização, divisão do trabalho e competência técnica. Weber a via como a forma mais racional e eficiente de organização.",
      difficulty: "FACIL",
    },
    {
      statement: "O ciclo PDCA (Plan, Do, Check, Act) é uma ferramenta de:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Recrutamento de pessoal" },
        { letter: "B", text: "Melhoria contínua de processos" },
        { letter: "C", text: "Auditoria financeira" },
        { letter: "D", text: "Planejamento estratégico exclusivamente" },
      ],
      correctAnswer: "B",
      explanation: "O PDCA (Planejar, Executar, Verificar, Agir) é uma ferramenta de MELHORIA CONTÍNUA de processos. É cíclico: após agir para corrigir, volta-se a planejar. Idealizado por Deming, é amplamente usado em gestão da qualidade.",
      difficulty: "FACIL",
    },
    {
      statement: "Governança pública é sinônimo de governo eletrônico.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "Governança pública se refere ao conjunto de mecanismos de liderança, estratégia e controle para avaliar, direcionar e monitorar a atuação da gestão. Governo eletrônico (e-gov) é a utilização de TI para prestar serviços públicos. São conceitos relacionados, mas distintos.",
      difficulty: "MEDIO",
    },
    {
      statement: "O BSC (Balanced Scorecard) considera quantas perspectivas para avaliação do desempenho organizacional?",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "2 perspectivas" },
        { letter: "B", text: "3 perspectivas" },
        { letter: "C", text: "4 perspectivas" },
        { letter: "D", text: "5 perspectivas" },
      ],
      correctAnswer: "C",
      explanation: "O BSC (Kaplan e Norton) utiliza 4 perspectivas: Financeira, Clientes, Processos Internos e Aprendizado/Crescimento. Permite uma visão equilibrada (balanced) da organização, indo além dos indicadores financeiros.",
      difficulty: "MEDIO",
    },
  ],

  // ── LEGISLAÇÃO ESPECIAL ──
  LEGISLACAO_ESPECIAL: [
    {
      statement: "De acordo com o Estatuto do Desarmamento (Lei 10.826/03), o porte de arma de fogo no Brasil é:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Livre para qualquer cidadão maior de 18 anos" },
        { letter: "B", text: "Proibido para civis em qualquer circunstância" },
        { letter: "C", text: "Permitido mediante autorização, com requisitos legais" },
        { letter: "D", text: "Exclusivo para militares das Forças Armadas" },
      ],
      correctAnswer: "C",
      explanation: "O Estatuto do Desarmamento prevê que o porte de arma é permitido mediante AUTORIZAÇÃO, exigindo requisitos como idoneidade, capacidade técnica e psicológica, ocupação lícita e residência fixa. Não é livre nem absolutamente proibido.",
      difficulty: "MEDIO",
    },
    {
      statement: "O crime de tráfico de drogas é inafiançável e insuscetível de graça ou anistia.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "Conforme o art. 5°, XLIII, da CF, o tráfico ilícito de entorpecentes é crime INAFIANÇÁVEL e INSUSCETÍVEL de graça ou anistia. A Lei 11.343/2006 (Lei de Drogas) regulamenta os tipos penais e as penas.",
      difficulty: "FACIL",
    },
    {
      statement: "A Lei Maria da Penha (Lei 11.340/06) se aplica exclusivamente à violência física contra a mulher.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "A Lei Maria da Penha protege a mulher contra TODAS as formas de violência doméstica: física, psicológica, sexual, patrimonial e moral. Não se limita à violência física. A violência psicológica foi tipificada como crime pelo art. 147-B do CP.",
      difficulty: "FACIL",
    },
    {
      statement: "De acordo com o ECA (Estatuto da Criança e do Adolescente), é considerado criança a pessoa com até:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "10 anos incompletos" },
        { letter: "B", text: "12 anos incompletos" },
        { letter: "C", text: "14 anos incompletos" },
        { letter: "D", text: "16 anos incompletos" },
      ],
      correctAnswer: "B",
      explanation: "Conforme o art. 2° do ECA (Lei 8.069/90): CRIANÇA é a pessoa até 12 anos incompletos; ADOLESCENTE é entre 12 e 18 anos. Crianças são inimputáveis e recebem medidas de proteção; adolescentes podem receber medidas socioeducativas.",
      difficulty: "FACIL",
    },
    {
      statement: "A Lei de Abuso de Autoridade (Lei 13.869/2019) pune exclusivamente policiais civis.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "A Lei de Abuso de Autoridade se aplica a QUALQUER agente público (servidor ou não) que, no exercício de suas funções, cometa os crimes nela tipificados. Inclui policiais, juízes, promotores, agentes penitenciários, entre outros.",
      difficulty: "FACIL",
    },
  ],

  // ── LEGISLAÇÃO DE TRÂNSITO ──
  LEGISLACAO_TRANSITO: [
    {
      statement: "De acordo com o CTB, qual a velocidade máxima permitida em vias locais urbanas, salvo sinalização?",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "40 km/h" },
        { letter: "B", text: "30 km/h" },
        { letter: "C", text: "50 km/h" },
        { letter: "D", text: "60 km/h" },
      ],
      correctAnswer: "B",
      explanation: "O CTB (art. 61) define velocidades máximas em áreas urbanas: vias locais = 30 km/h, vias coletoras = 40 km/h, vias arteriais = 50 km/h, vias de trânsito rápido = 80 km/h. Esses limites valem quando não há sinalização indicando valor diferente.",
      difficulty: "MEDIO",
    },
    {
      statement: "Dirigir sob a influência de álcool é infração gravíssima com penalidade de multa e suspensão do direito de dirigir.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "Dirigir sob influência de álcool (art. 165 CTB) é infração GRAVÍSSIMA, com multa (multiplicada por 10), suspensão do direito de dirigir por 12 meses e recolhimento do documento. Se configurar crime (art. 306), há pena de detenção.",
      difficulty: "FACIL",
    },
    {
      statement: "A CNH (Carteira Nacional de Habilitação) deve ser renovada a cada:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "3 anos para todos os condutores" },
        { letter: "B", text: "5 anos (ou 10 anos para menores de 50 anos sem infrações graves)" },
        { letter: "C", text: "10 anos para todos os condutores" },
        { letter: "D", text: "2 anos" },
      ],
      correctAnswer: "B",
      explanation: "A validade da CNH varia: até 10 anos para condutores com menos de 50 anos (sem infrações graves/gravíssimas nos últimos 5 anos); 5 anos para 50 a 69 anos; 3 anos para 70 anos ou mais. Condutores com infrações graves podem ter prazo reduzido.",
      difficulty: "MEDIO",
    },
    {
      statement: "O pedestre sempre tem preferência de passagem sobre os veículos.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "O pedestre tem preferência na faixa de pedestres e na ausência de sinalização. Porém, NÃO tem preferência absoluta em todas as situações. Em vias com semáforo, deve respeitar a sinalização. Não deve adentrar rodovias ou vias rápidas onde for proibido.",
      difficulty: "MEDIO",
    },
    {
      statement: "As infrações de trânsito são classificadas em quantas naturezas?",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "3 (leve, média, grave)" },
        { letter: "B", text: "4 (leve, média, grave, gravíssima)" },
        { letter: "C", text: "5 (leve, média, grave, gravíssima, especial)" },
        { letter: "D", text: "2 (leve e grave)" },
      ],
      correctAnswer: "B",
      explanation: "O CTB classifica infrações em 4 naturezas: LEVE (3 pontos), MÉDIA (4 pontos), GRAVE (5 pontos) e GRAVÍSSIMA (7 pontos). Gravíssima com fator multiplicador pode gerar multas maiores.",
      difficulty: "FACIL",
    },
  ],

  // ── REDAÇÃO ──
  REDACAO: [
    {
      statement: "A estrutura clássica de uma dissertação argumentativa é composta por:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Narração, clímax e desfecho" },
        { letter: "B", text: "Introdução, desenvolvimento e conclusão" },
        { letter: "C", text: "Tese, antítese e síntese" },
        { letter: "D", text: "Apresentação, complicação e resolução" },
      ],
      correctAnswer: "B",
      explanation: "A dissertação argumentativa segue: INTRODUÇÃO (contextualização + tese), DESENVOLVIMENTO (argumentos que sustentam a tese, geralmente 2 parágrafos) e CONCLUSÃO (retomada da tese + proposta de intervenção em provas discursivas).",
      difficulty: "FACIL",
    },
    {
      statement: "Em provas discursivas de concursos, a redação que desrespeitar os direitos humanos pode ser anulada ou receber nota zero.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "Bancas como CESPE/CEBRASPE e FCC podem ZERAR a redação que desrespeite os direitos humanos. A proposta de intervenção deve respeitar os direitos humanos. Propostas que incentivem violência, discriminação ou intolerância podem anular a redação.",
      difficulty: "FACIL",
    },
    {
      statement: "A coesão textual se refere à ligação entre as ideias e partes do texto. Qual elemento abaixo é um conectivo de oposição?",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Além disso" },
        { letter: "B", text: "Entretanto" },
        { letter: "C", text: "Consequentemente" },
        { letter: "D", text: "Porque" },
      ],
      correctAnswer: "B",
      explanation: "'Entretanto' é conectivo de OPOSIÇÃO/contraste (assim como: porém, contudo, todavia, no entanto). 'Além disso' = adição. 'Consequentemente' = consequência. 'Porque' = causa/explicação.",
      difficulty: "FACIL",
    },
    {
      statement: "Em provas discursivas de concursos, a proposta de intervenção deve conter o agente, a ação, o modo/meio e o detalhamento.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "Uma proposta de intervenção completa deve conter 5 elementos: AGENTE (quem vai fazer), AÇÃO (o que será feito), MODO/MEIO (como será feito), EFEITO/FINALIDADE (para quê) e DETALHAMENTO de pelo menos um dos anteriores. Bancas como CESPE valorizam propostas específicas e viáveis.",
      difficulty: "MEDIO",
    },
    {
      statement: "É recomendável usar gírias e linguagem coloquial na redação de concursos para demonstrar naturalidade.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "E",
      explanation: "Redações de concursos e vestibulares exigem a NORMA CULTA da língua portuguesa. Gírias, expressões coloquiais, abreviações e linguagem informal devem ser evitadas. A linguagem deve ser formal, clara, objetiva e gramaticalmente correta.",
      difficulty: "FACIL",
    },
  ],

  // ── NOÇÕES DE AVIAÇÃO CIVIL ──
  NOCOES_AVIACAO: [
    {
      statement: "A ANAC (Agência Nacional de Aviação Civil) é responsável por:",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "Controlar o tráfego aéreo" },
        { letter: "B", text: "Regular e fiscalizar a aviação civil no Brasil" },
        { letter: "C", text: "Gerenciar aeroportos militares" },
        { letter: "D", text: "Fabricar aeronaves" },
      ],
      correctAnswer: "B",
      explanation: "A ANAC é a agência reguladora que REGULA e FISCALIZA a aviação civil brasileira. O controle de tráfego aéreo é responsabilidade do DECEA/CINDACTA. Aeroportos são geridos pela Infraero ou concessionárias. A ANAC não fabrica aeronaves.",
      difficulty: "FACIL",
    },
    {
      statement: "O Código Brasileiro de Aeronáutica (CBA) é regulado pela Lei 7.565/86.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "O Código Brasileiro de Aeronáutica (CBA) é regulado pela Lei 7.565/1986. Estabelece normas sobre espaço aéreo, aeronaves, infraestrutura aeronáutica, serviços aéreos, responsabilidade civil e penal no âmbito da aviação.",
      difficulty: "FACIL",
    },
    {
      statement: "De acordo com a regulamentação da aviação civil, o comandante da aeronave é a autoridade máxima a bordo.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "Conforme o CBA (art. 166), o comandante é a AUTORIDADE MÁXIMA a bordo da aeronave. É responsável pela operação e segurança do voo, pela disciplina da tripulação e dos passageiros, e pode tomar decisões emergenciais.",
      difficulty: "FACIL",
    },
    {
      statement: "O espaço aéreo brasileiro é classificado pela ICAO em quantas classes?",
      questionType: "MULTIPLA_ESCOLHA",
      alternatives: [
        { letter: "A", text: "3 classes (A, B, C)" },
        { letter: "B", text: "5 classes (A, B, C, D, E)" },
        { letter: "C", text: "7 classes (A, B, C, D, E, F, G)" },
        { letter: "D", text: "4 classes (1, 2, 3, 4)" },
      ],
      correctAnswer: "C",
      explanation: "A ICAO classifica o espaço aéreo em 7 classes (A a G). Classe A: apenas IFR, separação total. Classe G: espaço não controlado. O Brasil utiliza principalmente as classes A, C, D e G em seu espaço aéreo.",
      difficulty: "DIFICIL",
    },
    {
      statement: "A Convenção de Chicago (1944) é o tratado internacional que rege a aviação civil internacional.",
      questionType: "CERTO_ERRADO",
      alternatives: [
        { letter: "C", text: "Certo" },
        { letter: "E", text: "Errado" },
      ],
      correctAnswer: "C",
      explanation: "A Convenção sobre Aviação Civil Internacional (Chicago, 1944) é o marco regulatório da aviação civil mundial. Criou a ICAO (Organização da Aviação Civil Internacional) e estabeleceu princípios como soberania do espaço aéreo e liberdades do ar.",
      difficulty: "MEDIO",
    },
  ],
};

// ============================================
// EXECUÇÃO
// ============================================

async function seedQuestions() {
  console.log("=== SEED DE QUESTÕES - FASE 5 ===\n");

  let totalCreated = 0;
  let totalSkipped = 0;

  for (const [subjectName, questions] of Object.entries(QUESTIONS)) {
    // Buscar subjectId pelo campo name
    const subjectResult = await db.execute(sql`
      SELECT id, "displayName" FROM "Subject"
      WHERE name = ${subjectName} AND "isActive" = true
      LIMIT 1
    `) as any[];

    if (subjectResult.length === 0) {
      console.log(`⚠️ Subject ${subjectName} não encontrado, pulando...`);
      totalSkipped += questions.length;
      continue;
    }

    const subject = subjectResult[0];
    let created = 0;

    for (const q of questions) {
      // Verificar se já existe questão com mesmo enunciado
      const existing = await db.execute(sql`
        SELECT id FROM "Question"
        WHERE "subjectId" = ${subject.id}
          AND "statement" = ${q.statement}
        LIMIT 1
      `) as any[];

      if (existing.length > 0) {
        continue;
      }

      const id = generateId();

      await db.execute(sql`
        INSERT INTO "Question" (
          "id", "subjectId", "statement", "questionType",
          "alternatives", "correctAnswer", "explanation",
          "difficulty", "isActive", "timesUsed", "updatedAt"
        ) VALUES (
          ${id}, ${subject.id}, ${q.statement}, ${q.questionType},
          ${JSON.stringify(q.alternatives)}::jsonb, ${q.correctAnswer}, ${q.explanation},
          ${q.difficulty}, true, 0, NOW()
        )
      `);

      created++;
    }

    totalCreated += created;
    console.log(`✅ ${subject.displayName}: +${created} questões (${questions.length} planejadas)`);
  }

  // Resumo
  console.log(`\n=== RESUMO ===`);
  console.log(`Total criadas: ${totalCreated}`);
  console.log(`Total puladas (subject não encontrado): ${totalSkipped}`);

  const finalCount = await db.execute(sql`
    SELECT COUNT(*)::int as total FROM "Question" WHERE "isActive" = true
  `) as any[];
  console.log(`Total no banco: ${finalCount[0]?.total}`);

  const perSubject = await db.execute(sql`
    SELECT s."displayName", COUNT(q.id)::int as total
    FROM "Subject" s
    LEFT JOIN "Question" q ON q."subjectId" = s.id AND q."isActive" = true
    WHERE s."isActive" = true
    GROUP BY s."displayName"
    ORDER BY total DESC
  `) as any[];

  console.log(`\nQuestões por Subject:`);
  for (const s of perSubject as any[]) {
    console.log(`  ${s.total.toString().padStart(3)} | ${s.displayName}`);
  }
}

seedQuestions()
  .then(() => {
    console.log("\n✅ Seed de questões concluído!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Erro no seed:", err);
    process.exit(1);
  });
