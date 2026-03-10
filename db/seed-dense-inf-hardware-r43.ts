import { db } from "./index";
import { sql } from "drizzle-orm";

// R43 — DENSIFICAÇÃO: Informática — Hardware e Segurança da Informação
// 4 átomos × 8 questões = 32 questões
// Padrão: 4 CE + 4 ME por átomo (FACIL → MEDIO → DIFICIL)

const CONTENT_IDS: Record<string, string> = {
  "Hardware: Componentes do Computador":              "cml47i37abcac193b37e14909",
  "Segurança da Informação":                          "cml47i3hje53fa28fc68d41f6",
  "Hardware - Componentes Básicos do Computador":     "content_1767461263033_vy284vpmf",
  "Segurança da Informação - Conceitos Fundamentais": "content_1767461486663_jr0ibvpin",
};

type Difficulty = "FACIL" | "MEDIO" | "DIFICIL";
type QuestionType = "MULTIPLA_ESCOLHA" | "CERTO_ERRADO";

interface Alternative { letter: string; text: string; }
interface Question {
  id: string;
  contentId: string;
  statement: string;
  alternatives: Alternative[];
  correctAnswer: string;
  correctOption: number;
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: Difficulty;
  questionType: QuestionType;
}

const questions: Question[] = [

  // ═══════════════════════════════════════════════════════════
  // ÁTOMO 1 — Hardware: Componentes do Computador (cml47i37abcac193b37e14909)
  // ═══════════════════════════════════════════════════════════

  {
    id: "inf_hw_cp_q01",
    contentId: "cml47i37abcac193b37e14909",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "A CPU (Unidade Central de Processamento) é o principal componente responsável pelo processamento de dados em um computador.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "A CPU é o cérebro do computador: executa instruções, realiza cálculos aritméticos e lógicos e coordena os demais componentes. Correto.",
    explanationCorrect: "A CPU é o cérebro do computador: executa instruções, realiza cálculos aritméticos e lógicos e coordena os demais componentes. Correto.",
    explanationWrong: "A CPU (Central Processing Unit) é de fato o principal responsável pelo processamento de dados em um computador.",
  },
  {
    id: "inf_hw_cp_q02",
    contentId: "cml47i37abcac193b37e14909",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "A memória RAM é um tipo de memória não volátil, o que significa que seus dados são preservados mesmo quando o computador é desligado.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "A RAM (Random Access Memory) é memória VOLÁTIL: perde todo o conteúdo quando o computador é desligado. Memória não volátil é o HD, SSD ou ROM.",
    explanationCorrect: "A RAM (Random Access Memory) é memória VOLÁTIL: perde todo o conteúdo quando o computador é desligado. Memória não volátil é o HD, SSD ou ROM.",
    explanationWrong: "A RAM é memória volátil — perde os dados ao desligar. Exemplos de memória não volátil: HD, SSD, pen drive.",
  },
  {
    id: "inf_hw_cp_q03",
    contentId: "cml47i37abcac193b37e14909",
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    statement: "Um SSD (Solid State Drive) utiliza memória flash para armazenar dados e, em geral, apresenta velocidades de leitura e escrita superiores às de um HD (Hard Disk).",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "SSDs usam memória flash NAND, sem partes mecânicas móveis, resultando em velocidades de leitura/escrita muito superiores às dos HDs tradicionais. Correto.",
    explanationCorrect: "SSDs usam memória flash NAND, sem partes mecânicas móveis, resultando em velocidades de leitura/escrita muito superiores às dos HDs tradicionais. Correto.",
    explanationWrong: "SSD usa memória flash e é significativamente mais rápido que HD para leitura e escrita de dados.",
  },
  {
    id: "inf_hw_cp_q04",
    contentId: "cml47i37abcac193b37e14909",
    questionType: "CERTO_ERRADO",
    difficulty: "DIFICIL",
    statement: "A memória cache L1 possui maior capacidade de armazenamento que a cache L3, embora seja mais lenta.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Na hierarquia de cache, L1 é a MENOR e MAIS RÁPIDA; L3 é a MAIOR e MAIS LENTA. A afirmação inverte as características: L1 tem menor capacidade, não maior.",
    explanationCorrect: "Na hierarquia de cache, L1 é a MENOR e MAIS RÁPIDA; L3 é a MAIOR e MAIS LENTA. A afirmação inverte as características: L1 tem menor capacidade, não maior.",
    explanationWrong: "A relação é inversa: L1 (menor e mais rápida) → L2 → L3 (maior e mais lenta).",
  },
  {
    id: "inf_hw_cp_q05",
    contentId: "cml47i37abcac193b37e14909",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "Qual dos componentes abaixo é responsável por conectar e permitir a comunicação entre todos os outros componentes do computador?",
    alternatives: [
      { letter: "A", text: "CPU" },
      { letter: "B", text: "RAM" },
      { letter: "C", text: "Placa-mãe" },
      { letter: "D", text: "GPU" },
      { letter: "E", text: "HD" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A placa-mãe (motherboard) é o componente que interliga CPU, RAM, HD/SSD, GPU e demais periféricos, permitindo a comunicação entre eles via barramentos.",
    explanationCorrect: "A placa-mãe (motherboard) é o componente que interliga CPU, RAM, HD/SSD, GPU e demais periféricos, permitindo a comunicação entre eles via barramentos.",
    explanationWrong: "A placa-mãe conecta todos os componentes do computador. CPU processa; RAM armazena temporariamente; GPU processa gráficos; HD armazena.",
  },
  {
    id: "inf_hw_cp_q06",
    contentId: "cml47i37abcac193b37e14909",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "Qual é a unidade de medida comumente usada para expressar a velocidade (frequência de clock) de um processador?",
    alternatives: [
      { letter: "A", text: "GB (Gigabyte)" },
      { letter: "B", text: "MB/s (Megabyte por segundo)" },
      { letter: "C", text: "GHz (Gigahertz)" },
      { letter: "D", text: "Watts" },
      { letter: "E", text: "ms (milissegundos)" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A velocidade do processador é medida em Hz (hertz) e seus múltiplos — MHz e GHz. Um processador de 3,5 GHz executa 3,5 bilhões de ciclos por segundo.",
    explanationCorrect: "A velocidade do processador é medida em Hz (hertz) e seus múltiplos — MHz e GHz. Um processador de 3,5 GHz executa 3,5 bilhões de ciclos por segundo.",
    explanationWrong: "Frequência de clock é medida em GHz. GB mede armazenamento; MB/s mede taxa de transferência; Watts mede consumo de energia.",
  },
  {
    id: "inf_hw_cp_q07",
    contentId: "cml47i37abcac193b37e14909",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "MEDIO",
    statement: "Sobre a memória RAM e o armazenamento em HD/SSD, qual afirmativa está CORRETA?",
    alternatives: [
      { letter: "A", text: "A RAM armazena dados permanentemente; o HD/SSD armazena temporariamente" },
      { letter: "B", text: "A RAM é mais lenta que o HD e mais lenta que o SSD" },
      { letter: "C", text: "A RAM armazena dados temporariamente (volátil); o HD/SSD armazena permanentemente (não volátil)" },
      { letter: "D", text: "RAM e HD são o mesmo tipo de memória, diferindo apenas na capacidade" },
      { letter: "E", text: "O HD executa os programas diretamente, sem envolver a RAM" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "RAM é memória volátil (temporária, rápida, usada durante a execução); HD/SSD são memórias não voláteis (permanentes, mais lentas, usadas para armazenamento).",
    explanationCorrect: "RAM é memória volátil (temporária, rápida, usada durante a execução); HD/SSD são memórias não voláteis (permanentes, mais lentas, usadas para armazenamento).",
    explanationWrong: "RAM = temporária/volátil (perde ao desligar). HD/SSD = permanente/não volátil (mantém após desligar).",
  },
  {
    id: "inf_hw_cp_q08",
    contentId: "cml47i37abcac193b37e14909",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "DIFICIL",
    statement: "Em relação à hierarquia de memória, a ordem correta do componente MAIS RÁPIDO e MENOR para o MAIS LENTO e MAIOR é:",
    alternatives: [
      { letter: "A", text: "Cache L1 → Cache L2 → RAM → Registradores → HD" },
      { letter: "B", text: "Registradores → Cache L1 → Cache L2 → RAM → HD" },
      { letter: "C", text: "RAM → Cache L1 → Cache L2 → Registradores → HD" },
      { letter: "D", text: "Cache L1 → Registradores → RAM → Cache L2 → HD" },
      { letter: "E", text: "HD → RAM → Cache L2 → Cache L1 → Registradores" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Hierarquia de memória (do mais rápido/menor para o mais lento/maior): Registradores (dentro da CPU) → Cache L1 → Cache L2 → Cache L3 → RAM → HD/SSD.",
    explanationCorrect: "Hierarquia de memória (do mais rápido/menor para o mais lento/maior): Registradores (dentro da CPU) → Cache L1 → Cache L2 → Cache L3 → RAM → HD/SSD.",
    explanationWrong: "Os registradores são os mais rápidos (dentro da CPU), seguidos das caches L1, L2 e L3, depois RAM e por último o armazenamento secundário (HD/SSD).",
  },

  // ═══════════════════════════════════════════════════════════
  // ÁTOMO 2 — Segurança da Informação (cml47i3hje53fa28fc68d41f6)
  // ═══════════════════════════════════════════════════════════

  {
    id: "inf_si_ii_q01",
    contentId: "cml47i3hje53fa28fc68d41f6",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "Os três pilares fundamentais da segurança da informação são Confidencialidade, Integridade e Disponibilidade, formando o modelo CID (ou CIA, em inglês).",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "O modelo CID (Confidentiality, Integrity, Availability — CIA Triad) é o framework base da segurança da informação. Cada pilar protege um aspecto distinto da informação. Correto.",
    explanationCorrect: "O modelo CID (Confidentiality, Integrity, Availability — CIA Triad) é o framework base da segurança da informação. Cada pilar protege um aspecto distinto da informação. Correto.",
    explanationWrong: "Os três pilares são Confidencialidade, Integridade e Disponibilidade — a tríade CID/CIA.",
  },
  {
    id: "inf_si_ii_q02",
    contentId: "cml47i3hje53fa28fc68d41f6",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "A confidencialidade garante que a informação esteja sempre disponível para os usuários autorizados, mesmo em caso de falhas de sistema.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "O enunciado descreve DISPONIBILIDADE (garantir acesso quando necessário), não confidencialidade. Confidencialidade garante que apenas pessoas autorizadas acessem a informação.",
    explanationCorrect: "O enunciado descreve DISPONIBILIDADE (garantir acesso quando necessário), não confidencialidade. Confidencialidade garante que apenas pessoas autorizadas acessem a informação.",
    explanationWrong: "Isso é Disponibilidade, não Confidencialidade. Confidencialidade = acesso restrito a autorizados. Disponibilidade = sistema acessível quando necessário.",
  },
  {
    id: "inf_si_ii_q03",
    contentId: "cml47i3hje53fa28fc68d41f6",
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    statement: "Na criptografia assimétrica, a chave pública é usada para cifrar os dados e a chave privada para decifrá-los.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Na criptografia assimétrica (ex: RSA), o remetente cifra com a chave pública do destinatário, e somente o destinatário decifra com sua chave privada. Correto.",
    explanationCorrect: "Na criptografia assimétrica (ex: RSA), o remetente cifra com a chave pública do destinatário, e somente o destinatário decifra com sua chave privada. Correto.",
    explanationWrong: "Na criptografia assimétrica: chave pública cifra, chave privada decifra. Ambas são matematicamente relacionadas mas distintas.",
  },
  {
    id: "inf_si_ii_q04",
    contentId: "cml47i3hje53fa28fc68d41f6",
    questionType: "CERTO_ERRADO",
    difficulty: "DIFICIL",
    statement: "O não repúdio (irretratabilidade) é o princípio de segurança que garante que o emissor de uma mensagem não possa negar sua autoria, sendo implementado tipicamente por assinatura digital.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Não repúdio/irretratabilidade: garante que o emissor não negue ter enviado uma mensagem. A assinatura digital (baseada em criptografia assimétrica) é o mecanismo padrão para implementá-lo. Correto.",
    explanationCorrect: "Não repúdio/irretratabilidade: garante que o emissor não negue ter enviado uma mensagem. A assinatura digital (baseada em criptografia assimétrica) é o mecanismo padrão para implementá-lo. Correto.",
    explanationWrong: "O não repúdio impede que o emissor negue o envio. A assinatura digital garante autoria e integridade, implementando o não repúdio.",
  },
  {
    id: "inf_si_ii_q05",
    contentId: "cml47i3hje53fa28fc68d41f6",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "Qual princípio da segurança da informação garante que apenas pessoas autorizadas possam acessar determinada informação?",
    alternatives: [
      { letter: "A", text: "Disponibilidade" },
      { letter: "B", text: "Integridade" },
      { letter: "C", text: "Confidencialidade" },
      { letter: "D", text: "Autenticidade" },
      { letter: "E", text: "Não repúdio" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Confidencialidade: garante que a informação só seja acessível a quem tem autorização. É implementada por controle de acesso, criptografia e autenticação.",
    explanationCorrect: "Confidencialidade: garante que a informação só seja acessível a quem tem autorização. É implementada por controle de acesso, criptografia e autenticação.",
    explanationWrong: "Confidencialidade = acesso restrito a autorizados. Disponibilidade = sistema acessível. Integridade = dados não alterados indevidamente.",
  },
  {
    id: "inf_si_ii_q06",
    contentId: "cml47i3hje53fa28fc68d41f6",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "Qual das alternativas descreve corretamente o princípio de Integridade em segurança da informação?",
    alternatives: [
      { letter: "A", text: "A informação deve estar sempre acessível quando o usuário autorizado necessitar" },
      { letter: "B", text: "Apenas pessoas autorizadas podem acessar a informação" },
      { letter: "C", text: "A informação não pode ser alterada ou corrompida por pessoas não autorizadas" },
      { letter: "D", text: "O emissor não pode negar o envio de uma mensagem" },
      { letter: "E", text: "O sistema deve ser resistente a ataques de negação de serviço" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Integridade garante que a informação não seja modificada de forma não autorizada — mantendo sua precisão e completude. A = Disponibilidade; B = Confidencialidade; D = Não repúdio.",
    explanationCorrect: "Integridade garante que a informação não seja modificada de forma não autorizada — mantendo sua precisão e completude. A = Disponibilidade; B = Confidencialidade; D = Não repúdio.",
    explanationWrong: "Integridade = dado não alterado indevidamente. Disponibilidade = sistema disponível. Confidencialidade = acesso restrito.",
  },
  {
    id: "inf_si_ii_q07",
    contentId: "cml47i3hje53fa28fc68d41f6",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "MEDIO",
    statement: "O algoritmo AES (Advanced Encryption Standard) é classificado como qual tipo de criptografia?",
    alternatives: [
      { letter: "A", text: "Assimétrica, com par de chaves pública e privada" },
      { letter: "B", text: "Simétrica, utilizando a mesma chave para cifrar e decifrar" },
      { letter: "C", text: "Hash, gerando um resumo de tamanho fixo" },
      { letter: "D", text: "Assimétrica, baseada em curvas elípticas" },
      { letter: "E", text: "Híbrida, combinando chave simétrica e assimétrica" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "AES é um algoritmo de criptografia simétrica: usa a mesma chave para cifrar e decifrar. É o padrão atual do governo americano, com tamanhos de chave de 128, 192 ou 256 bits.",
    explanationCorrect: "AES é um algoritmo de criptografia simétrica: usa a mesma chave para cifrar e decifrar. É o padrão atual do governo americano, com tamanhos de chave de 128, 192 ou 256 bits.",
    explanationWrong: "AES = simétrico (mesma chave). RSA = assimétrico (par de chaves). SHA = hash.",
  },
  {
    id: "inf_si_ii_q08",
    contentId: "cml47i3hje53fa28fc68d41f6",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "DIFICIL",
    statement: "Um certificado digital utiliza qual tecnologia para garantir a autenticidade e a integridade de documentos eletrônicos?",
    alternatives: [
      { letter: "A", text: "Criptografia simétrica (AES) e firewall de aplicação" },
      { letter: "B", text: "Assinatura digital baseada em criptografia assimétrica, validada por Autoridade Certificadora (AC)" },
      { letter: "C", text: "VPN com túnel SSL/TLS e autenticação por senha" },
      { letter: "D", text: "Hash MD5 e controle de acesso por senha" },
      { letter: "E", text: "Backup incremental e registro de auditoria (log)" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Certificados digitais usam criptografia assimétrica (par de chaves) e são emitidos/validados por Autoridades Certificadoras (AC). A assinatura digital garante autenticidade, integridade e não repúdio.",
    explanationCorrect: "Certificados digitais usam criptografia assimétrica (par de chaves) e são emitidos/validados por Autoridades Certificadoras (AC). A assinatura digital garante autenticidade, integridade e não repúdio.",
    explanationWrong: "Certificado digital = assinatura digital (criptografia assimétrica) + Autoridade Certificadora que valida a identidade.",
  },

  // ═══════════════════════════════════════════════════════════
  // ÁTOMO 3 — Hardware - Componentes Básicos (content_1767461263033_vy284vpmf)
  // ═══════════════════════════════════════════════════════════

  {
    id: "inf_hw_cb_q01",
    contentId: "content_1767461263033_vy284vpmf",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "O teclado e o mouse são exemplos de dispositivos de entrada de dados.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Dispositivos de entrada recebem dados do usuário para o computador. Teclado (inserir texto) e mouse (movimento/clique) são os exemplos mais comuns. Correto.",
    explanationCorrect: "Dispositivos de entrada recebem dados do usuário para o computador. Teclado (inserir texto) e mouse (movimento/clique) são os exemplos mais comuns. Correto.",
    explanationWrong: "Teclado e mouse são dispositivos de ENTRADA — enviam informações do usuário para o computador.",
  },
  {
    id: "inf_hw_cb_q02",
    contentId: "content_1767461263033_vy284vpmf",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "O monitor e a impressora são exemplos de dispositivos de entrada de dados.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Monitor e impressora são dispositivos de SAÍDA — apresentam dados processados ao usuário. Não são de entrada. Exemplos de entrada: teclado, mouse, scanner, microfone.",
    explanationCorrect: "Monitor e impressora são dispositivos de SAÍDA — apresentam dados processados ao usuário. Não são de entrada. Exemplos de entrada: teclado, mouse, scanner, microfone.",
    explanationWrong: "Monitor e impressora são dispositivos de SAÍDA (exibem resultados para o usuário), não de entrada.",
  },
  {
    id: "inf_hw_cb_q03",
    contentId: "content_1767461263033_vy284vpmf",
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    statement: "Pen drives e cartões de memória SD utilizam memória flash, o mesmo tipo de tecnologia presente nos SSDs.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Pen drives, cartões SD e SSDs utilizam memória flash NAND — tecnologia de armazenamento não volátil sem partes mecânicas. Correto.",
    explanationCorrect: "Pen drives, cartões SD e SSDs utilizam memória flash NAND — tecnologia de armazenamento não volátil sem partes mecânicas. Correto.",
    explanationWrong: "Todos usam memória flash NAND. A diferença entre eles está na forma, capacidade e velocidade de interface.",
  },
  {
    id: "inf_hw_cb_q04",
    contentId: "content_1767461263033_vy284vpmf",
    questionType: "CERTO_ERRADO",
    difficulty: "DIFICIL",
    statement: "A arquitetura RISC (Reduced Instruction Set Computer) caracteriza-se por um conjunto reduzido de instruções simples e uniformes, favorecendo a execução em pipeline e alto desempenho em operações simples.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "RISC usa instruções simples e de tamanho fixo, executadas em um único ciclo de clock, o que facilita o pipeline. Em contraste, CISC (Complex Instruction Set) tem instruções mais complexas e de tamanho variável. Correto.",
    explanationCorrect: "RISC usa instruções simples e de tamanho fixo, executadas em um único ciclo de clock, o que facilita o pipeline. Em contraste, CISC (Complex Instruction Set) tem instruções mais complexas e de tamanho variável. Correto.",
    explanationWrong: "RISC = conjunto reduzido de instruções simples → melhor pipeline. CISC = conjunto complexo de instruções → mais poderoso, mas mais difícil de otimizar.",
  },
  {
    id: "inf_hw_cb_q05",
    contentId: "content_1767461263033_vy284vpmf",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "Qual dos itens abaixo é um dispositivo de SAÍDA?",
    alternatives: [
      { letter: "A", text: "Teclado" },
      { letter: "B", text: "Scanner" },
      { letter: "C", text: "Mouse" },
      { letter: "D", text: "Impressora" },
      { letter: "E", text: "Microfone" },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "Impressora é dispositivo de saída (produz resultado físico). Teclado, mouse e microfone são de entrada. Scanner também é de entrada (digitaliza documentos para o computador).",
    explanationCorrect: "Impressora é dispositivo de saída (produz resultado físico). Teclado, mouse e microfone são de entrada. Scanner também é de entrada (digitaliza documentos para o computador).",
    explanationWrong: "Dispositivos de saída: impressora, monitor, caixa de som, projetor. Dispositivos de entrada: teclado, mouse, scanner, microfone.",
  },
  {
    id: "inf_hw_cb_q06",
    contentId: "content_1767461263033_vy284vpmf",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "Qual é a função principal da memória RAM em um computador?",
    alternatives: [
      { letter: "A", text: "Armazenar permanentemente o sistema operacional e os arquivos do usuário" },
      { letter: "B", text: "Processar instruções aritméticas e lógicas da CPU" },
      { letter: "C", text: "Armazenar temporariamente os dados e programas em execução" },
      { letter: "D", text: "Conectar os componentes internos ao monitor" },
      { letter: "E", text: "Gerenciar a distribuição de energia entre os componentes" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A RAM armazena temporariamente os dados e programas que estão sendo usados no momento — oferece acesso rápido à CPU. É volátil: perde o conteúdo ao desligar.",
    explanationCorrect: "A RAM armazena temporariamente os dados e programas que estão sendo usados no momento — oferece acesso rápido à CPU. É volátil: perde o conteúdo ao desligar.",
    explanationWrong: "RAM = memória temporária (volátil) para dados em uso. HD/SSD armazena permanentemente. CPU processa. Fonte de alimentação distribui energia.",
  },
  {
    id: "inf_hw_cb_q07",
    contentId: "content_1767461263033_vy284vpmf",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "MEDIO",
    statement: "Qual das afirmativas sobre HD (Hard Disk) e SSD (Solid State Drive) está CORRETA?",
    alternatives: [
      { letter: "A", text: "O HD é mais rápido que o SSD para leitura e escrita de dados" },
      { letter: "B", text: "O SSD não possui partes mecânicas móveis, sendo mais resistente a impactos físicos" },
      { letter: "C", text: "O HD utiliza memória flash para armazenar dados" },
      { letter: "D", text: "O SSD gera mais ruído que o HD durante o funcionamento" },
      { letter: "E", text: "HD e SSD possuem a mesma velocidade de acesso aos dados" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "SSD não tem partes mecânicas (sem prato giratório nem cabeça de leitura), sendo mais resistente a choques e impactos. HDs usam pratos magnéticos; SSDs usam memória flash.",
    explanationCorrect: "SSD não tem partes mecânicas (sem prato giratório nem cabeça de leitura), sendo mais resistente a choques e impactos. HDs usam pratos magnéticos; SSDs usam memória flash.",
    explanationWrong: "SSD = sem partes mecânicas → mais rápido, silencioso e resistente a impactos. HD = partes mecânicas (prato + cabeça de leitura).",
  },
  {
    id: "inf_hw_cb_q08",
    contentId: "content_1767461263033_vy284vpmf",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "DIFICIL",
    statement: "Um computador executa um programa. Qual é a sequência correta do fluxo de dados, do armazenamento permanente até a execução?",
    alternatives: [
      { letter: "A", text: "CPU → RAM → HD → Cache" },
      { letter: "B", text: "Cache → CPU → RAM → HD" },
      { letter: "C", text: "HD/SSD → RAM → Cache → CPU (registradores)" },
      { letter: "D", text: "RAM → HD → Cache → CPU" },
      { letter: "E", text: "CPU → Cache → HD → RAM" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O programa fica no HD/SSD → é carregado na RAM → partes em uso vão para a cache → a CPU acessa via registradores. O fluxo segue a hierarquia de memória: HD → RAM → Cache → CPU.",
    explanationCorrect: "O programa fica no HD/SSD → é carregado na RAM → partes em uso vão para a cache → a CPU acessa via registradores. O fluxo segue a hierarquia de memória: HD → RAM → Cache → CPU.",
    explanationWrong: "Fluxo de execução: HD/SSD (armazena) → RAM (carrega) → Cache (acelera acesso da CPU) → Registradores (CPU executa).",
  },

  // ═══════════════════════════════════════════════════════════
  // ÁTOMO 4 — Segurança da Informação - Conceitos Fundamentais (content_1767461486663_jr0ibvpin)
  // ═══════════════════════════════════════════════════════════

  {
    id: "inf_si_fn_q01",
    contentId: "content_1767461486663_jr0ibvpin",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "Um vírus de computador necessita de um arquivo hospedeiro para se propagar, diferentemente de um worm, que pode se replicar de forma autônoma pela rede.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Vírus = parasita (precisa de hospedeiro/arquivo para se propagar). Worm = autônomo (se replica sozinho pela rede, sem precisar infectar arquivos). Correto.",
    explanationCorrect: "Vírus = parasita (precisa de hospedeiro/arquivo para se propagar). Worm = autônomo (se replica sozinho pela rede, sem precisar infectar arquivos). Correto.",
    explanationWrong: "Correto: vírus precisa de hospedeiro; worm se propaga sozinho pela rede.",
  },
  {
    id: "inf_si_fn_q02",
    contentId: "content_1767461486663_jr0ibvpin",
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    statement: "A autenticação de dois fatores (2FA) utiliza dois métodos do mesmo tipo — por exemplo, duas senhas diferentes — para verificar a identidade do usuário.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "2FA exige dois fatores de CATEGORIAS DIFERENTES: (1) algo que você SABE (senha), (2) algo que você TEM (token, celular) ou (3) algo que você É (biometria). Duas senhas = mesmo fator, não é 2FA.",
    explanationCorrect: "2FA exige dois fatores de CATEGORIAS DIFERENTES: (1) algo que você SABE (senha), (2) algo que você TEM (token, celular) ou (3) algo que você É (biometria). Duas senhas = mesmo fator, não é 2FA.",
    explanationWrong: "2FA combina fatores de TIPOS DIFERENTES (ex: senha + token). Dois fatores do mesmo tipo (duas senhas) não configuram 2FA.",
  },
  {
    id: "inf_si_fn_q03",
    contentId: "content_1767461486663_jr0ibvpin",
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    statement: "O princípio do menor privilégio determina que cada usuário ou processo deve ter acesso apenas aos recursos estritamente necessários para desempenhar sua função.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Princípio do Menor Privilégio (Principle of Least Privilege): minimizar os direitos de acesso reduz a superfície de ataque e limita o impacto de comprometimentos. Correto.",
    explanationCorrect: "Princípio do Menor Privilégio (Principle of Least Privilege): minimizar os direitos de acesso reduz a superfície de ataque e limita o impacto de comprometimentos. Correto.",
    explanationWrong: "Correto. Cada usuário/processo só deve ter as permissões mínimas necessárias — isso reduz o risco em caso de comprometimento.",
  },
  {
    id: "inf_si_fn_q04",
    contentId: "content_1767461486663_jr0ibvpin",
    questionType: "CERTO_ERRADO",
    difficulty: "DIFICIL",
    statement: "Um ataque do tipo Man-in-the-Middle (MitM) ocorre quando um atacante intercepta a comunicação entre duas partes sem que elas percebam, podendo ler, modificar ou injetar mensagens.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "No ataque MitM, o invasor se posiciona entre duas partes comunicantes, interceptando e potencialmente alterando as mensagens sem que nenhuma das partes perceba. Correto.",
    explanationCorrect: "No ataque MitM, o invasor se posiciona entre duas partes comunicantes, interceptando e potencialmente alterando as mensagens sem que nenhuma das partes perceba. Correto.",
    explanationWrong: "MitM = intercepção silenciosa da comunicação. O atacante fica no meio, lendo e podendo modificar as mensagens entre as duas partes.",
  },
  {
    id: "inf_si_fn_q05",
    contentId: "content_1767461486663_jr0ibvpin",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "O que é uma vulnerabilidade no contexto de segurança da informação?",
    alternatives: [
      { letter: "A", text: "Um ataque cibernético direcionado a sistemas governamentais" },
      { letter: "B", text: "Uma fraqueza em um sistema que pode ser explorada por uma ameaça para causar dano" },
      { letter: "C", text: "Um programa malicioso que se replica automaticamente pela rede" },
      { letter: "D", text: "Uma técnica de criptografia considerada obsoleta" },
      { letter: "E", text: "Um sistema de firewall com configuração desatualizada" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Vulnerabilidade = fraqueza/falha num sistema que pode ser explorada por uma ameaça. Ameaça explora vulnerabilidade → risco. Exemplo: software desatualizado, senha fraca.",
    explanationCorrect: "Vulnerabilidade = fraqueza/falha num sistema que pode ser explorada por uma ameaça. Ameaça explora vulnerabilidade → risco. Exemplo: software desatualizado, senha fraca.",
    explanationWrong: "Vulnerabilidade = fraqueza que pode ser explorada. Ameaça = quem/o que pode explorar. Risco = probabilidade × impacto.",
  },
  {
    id: "inf_si_fn_q06",
    contentId: "content_1767461486663_jr0ibvpin",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "FACIL",
    statement: "Qual das alternativas representa um exemplo de autenticação por fator de POSSE (algo que você possui)?",
    alternatives: [
      { letter: "A", text: "Senha alfanumérica" },
      { letter: "B", text: "Reconhecimento facial" },
      { letter: "C", text: "Token físico (hardware token) ou código OTP no celular" },
      { letter: "D", text: "Pergunta de segurança" },
      { letter: "E", text: "Impressão digital" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Fatores de autenticação: SABER (senha, PIN, pergunta secreta), TER/POSSUIR (token físico, smartphone, cartão), SER (biometria: digital, face, íris). Token físico = posse.",
    explanationCorrect: "Fatores de autenticação: SABER (senha, PIN, pergunta secreta), TER/POSSUIR (token físico, smartphone, cartão), SER (biometria: digital, face, íris). Token físico = posse.",
    explanationWrong: "Senha/PIN = saber. Token/celular = ter (possuir). Digital/face = ser (biometria).",
  },
  {
    id: "inf_si_fn_q07",
    contentId: "content_1767461486663_jr0ibvpin",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "MEDIO",
    statement: "O que diferencia um trojan (cavalo de Troia) de um vírus de computador?",
    alternatives: [
      { letter: "A", text: "O trojan se replica automaticamente pela rede sem arquivo hospedeiro" },
      { letter: "B", text: "O trojan se disfarça de programa legítimo para enganar o usuário, mas não se replica sozinho" },
      { letter: "C", text: "O vírus rouba dados bancários; o trojan, apenas arquivos pessoais" },
      { letter: "D", text: "O trojan usa criptografia para se ocultar; o vírus não" },
      { letter: "E", text: "Não há diferença prática — trojan e vírus são sinônimos" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Trojan = disfarça-se de software legítimo (ex: jogo, utilitário) para ser instalado pelo usuário, mas NÃO se replica. Vírus = precisa de hospedeiro e se replica. Worm = se replica sozinho.",
    explanationCorrect: "Trojan = disfarça-se de software legítimo (ex: jogo, utilitário) para ser instalado pelo usuário, mas NÃO se replica. Vírus = precisa de hospedeiro e se replica. Worm = se replica sozinho.",
    explanationWrong: "Trojan = engana o usuário se passando por programa útil, mas não se replica. Vírus = parasita com replicação. Worm = replicação autônoma.",
  },
  {
    id: "inf_si_fn_q08",
    contentId: "content_1767461486663_jr0ibvpin",
    questionType: "MULTIPLA_ESCOLHA",
    difficulty: "DIFICIL",
    statement: "O conceito de \"defesa em profundidade\" (defense in depth) em segurança da informação consiste em:",
    alternatives: [
      { letter: "A", text: "Utilizar um único firewall de alta capacidade para proteger toda a rede" },
      { letter: "B", text: "Aplicar múltiplas camadas de controles de segurança independentes, de modo que a falha de uma não comprometa o sistema todo" },
      { letter: "C", text: "Restringir o acesso à rede apenas a usuários com autenticação biométrica" },
      { letter: "D", text: "Criptografar todos os dados em repouso e em trânsito com AES-256" },
      { letter: "E", text: "Realizar auditorias de segurança mensais em todos os sistemas" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Defesa em profundidade = múltiplas camadas de controles (ex: firewall + IDS + antivírus + autenticação + criptografia + backups). Se uma camada falhar, as demais ainda protegem o sistema.",
    explanationCorrect: "Defesa em profundidade = múltiplas camadas de controles (ex: firewall + IDS + antivírus + autenticação + criptografia + backups). Se uma camada falhar, as demais ainda protegem o sistema.",
    explanationWrong: "Defense in depth = várias camadas de segurança sobrepostas. Nenhuma camada isolada é suficiente — a soma das camadas garante a proteção.",
  },
];

async function main() {
  console.log("=== R43 — DENSIFICAÇÃO: Informática — Hardware e Segurança da Informação ===");
  console.log(`Total de questões a inserir: ${questions.length}`);

  // 1. Verificar existência dos átomos
  let subjectId: string | null = null;
  let topicId: string | null = null;

  for (const [nome, contentId] of Object.entries(CONTENT_IDS)) {
    const rows = (await db.execute(sql`
      SELECT id, "subjectId", "topicId" FROM "Content" WHERE id = ${contentId} LIMIT 1
    `)) as any[];
    if (!rows[0]) {
      console.warn(`AVISO: átomo não encontrado — ${nome} (${contentId})`);
    } else {
      console.log(`  ✓ ${nome} (${contentId})`);
      if (!subjectId && rows[0].subjectId) {
        subjectId = rows[0].subjectId;
        topicId = rows[0].topicId;
      }
    }
  }

  if (!subjectId) {
    throw new Error("Nenhum átomo encontrado. Verifique os IDs de Content.");
  }

  // 2. Inserir questões
  let inseridos = 0;
  let ignorados = 0;

  for (const q of questions) {
    const alternativesJson = JSON.stringify(q.alternatives);

    const contentRows = (await db.execute(sql`
      SELECT "subjectId", "topicId" FROM "Content" WHERE id = ${q.contentId} LIMIT 1
    `)) as any[];

    const qSubjectId = contentRows[0]?.subjectId ?? subjectId;
    const qTopicId   = contentRows[0]?.topicId   ?? topicId;

    const result = (await db.execute(sql`
      INSERT INTO "Question" (
        id, statement, alternatives, "correctAnswer", "correctOption",
        explanation, "explanationCorrect", "explanationWrong",
        "contentId", "subjectId", "topicId",
        "isActive", difficulty, "timesUsed",
        "questionType", "createdAt", "updatedAt"
      ) VALUES (
        ${q.id},
        ${q.statement},
        ${alternativesJson}::jsonb,
        ${q.correctAnswer},
        ${q.correctOption},
        ${q.explanation},
        ${q.explanationCorrect},
        ${q.explanationWrong},
        ${q.contentId},
        ${qSubjectId},
        ${qTopicId},
        true,
        ${q.difficulty},
        0,
        ${q.questionType},
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `)) as any;

    if (result.rowCount === 0) {
      console.log(`  skip (já existe): ${q.id}`);
      ignorados++;
    } else {
      console.log(`  OK: ${q.id} [${q.questionType}] — ${q.statement.substring(0, 55)}...`);
      inseridos++;
    }
  }

  console.log(`\n=== CONCLUÍDO ===`);
  console.log(`  Inseridas: ${inseridos}`);
  console.log(`  Ignoradas: ${ignorados}`);
  console.log(`  Total:     ${inseridos + ignorados} / ${questions.length}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
