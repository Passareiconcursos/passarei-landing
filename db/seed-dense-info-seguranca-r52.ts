/**
 * Seed R52 — DENSIFICAÇÃO: INFORMÁTICA — Segurança da Informação
 * Átomos: inf_si_c01–c06 (já existentes no banco)
 * 48 questões novas: 8 por átomo (4 CE + 4 ME), progressão FACIL→DIFICIL
 * Execução: npx tsx db/seed-dense-info-seguranca-r52.ts
 */

import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

// ============================================
// INTERFACES
// ============================================

interface Alternative {
  letter: string;
  text: string;
}

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
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  questionType: "MULTIPLA_ESCOLHA" | "CERTO_ERRADO";
}

// ============================================
// QUESTÕES — 48 no total (8 por átomo)
// ============================================

const questions: Question[] = [

  // ── inf_si_c01 — Backup: Completo, Incremental e Diferencial ─────────────

  {
    id: "inf_si_c01_q01",
    contentId: "inf_si_c01",
    statement: "O backup incremental copia apenas os dados alterados desde o último backup completo, ignorando os incrementais intermediários.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "O backup incremental copia apenas os dados alterados desde o ÚLTIMO backup (seja completo ou incremental anterior). É o backup DIFERENCIAL que copia tudo desde o último completo.",
    explanationCorrect: "Errado: incremental = copia desde o último backup de qualquer tipo (completo ou incremental). Diferencial = copia desde o último backup COMPLETO. A questão descreveu o diferencial, não o incremental.",
    explanationWrong: "A afirmação está incorreta — ela descreve o backup diferencial, não o incremental.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c01_q02",
    contentId: "inf_si_c01",
    statement: "O backup diferencial NÃO zera o bit de arquivo (archive bit) após a cópia dos dados.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "O backup diferencial NÃO zera o bit de arquivo — por isso ele continua acumulando todas as alterações desde o último completo. Os backups completo e incremental zeram o bit de arquivo.",
    explanationCorrect: "Certo: diferencial NÃO zera o bit de arquivo → acumula progressivamente. Completo e incremental ZERAM o bit → cada um começa do zero a contagem de alterações.",
    explanationWrong: "A afirmação está correta — o diferencial NÃO zera o bit de arquivo.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c01_q03",
    contentId: "inf_si_c01",
    statement: "Para restaurar um sistema que usa backup completo semanal + incrementais diários, é necessário apenas o backup completo e o último incremental.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Na estratégia incremental, a restauração exige o backup completo MAIS TODOS os incrementais em sequência até o ponto desejado — não apenas o último incremental.",
    explanationCorrect: "Errado: incremental exige completo + TODOS os incrementais em cadeia. Ex: completo domingo + incremental seg, ter, qua → restaurar quarta = 4 mídias. Apenas 2 mídias seria a vantagem do DIFERENCIAL.",
    explanationWrong: "A afirmação descreve o comportamento do backup diferencial (completo + último diferencial = 2 mídias), não do incremental.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c01_q04",
    contentId: "inf_si_c01",
    statement: "O RPO (Recovery Point Objective) define o tempo máximo aceitável para restaurar um sistema após uma falha.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "O RPO define a quantidade máxima de dados que pode ser perdida (ex: 24h = backup diário). O RTO (Recovery Time Objective) é que define o tempo máximo para restaurar o sistema.",
    explanationCorrect: "Errado: RPO = quantidade máxima de dados perdidos (ponto de recuperação). RTO = tempo máximo para restaurar o sistema. A questão inverteu as definições.",
    explanationWrong: "A afirmação descreve o RTO, não o RPO. RPO é sobre perda de dados; RTO é sobre tempo de recuperação.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c01_q05",
    contentId: "inf_si_c01",
    statement: "Quanto à comparação entre os tipos de backup, assinale a opção correta.",
    alternatives: [
      { letter: "A", text: "O backup incremental oferece restauração mais rápida que o diferencial, pois copia menos dados." },
      { letter: "B", text: "O backup completo é o mais lento para executar e ocupa mais espaço, mas permite restauração com apenas uma mídia." },
      { letter: "C", text: "O backup diferencial é sempre mais rápido de executar que o incremental, pois copia apenas os dados recentes." },
      { letter: "D", text: "O backup incremental não zera o bit de arquivo, acumulando progressivamente as alterações." },
      { letter: "E", text: "O backup completo e o diferencial zeram o bit de arquivo; apenas o incremental não zera." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O backup completo copia todos os dados → mais lento e maior espaço, mas restauração com apenas 1 mídia. Incremental: mais rápido, menor espaço, restauração lenta (N mídias). Diferencial: médio, restauração com 2 mídias.",
    explanationCorrect: "B: completo = mais lento de executar, mais espaço, mas restauração com 1 mídia. É o mais simples para restaurar, porém o mais custoso para realizar.",
    explanationWrong: "A: incremental tem restauração mais lenta (N mídias), não mais rápida. C: diferencial cresce progressivamente — no final da semana pode ser mais lento que o incremental do mesmo dia. D: incremental ZERA o bit. E: apenas o diferencial NÃO zera; completo e incremental zeram.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_si_c01_q06",
    contentId: "inf_si_c01",
    statement: "Empresa faz backup completo aos domingos e backup diferencial de segunda a sábado. Na quinta-feira ocorre uma falha. Para restaurar, serão necessárias:",
    alternatives: [
      { letter: "A", text: "Apenas a mídia do backup completo de domingo." },
      { letter: "B", text: "As mídias do backup completo de domingo + todos os diferenciais de segunda a quinta." },
      { letter: "C", text: "As mídias do backup completo de domingo + apenas o diferencial de quinta-feira." },
      { letter: "D", text: "Apenas o backup diferencial de quinta-feira." },
      { letter: "E", text: "As mídias de todos os backups desde domingo até quinta-feira (5 mídias)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Backup diferencial: restauração exige apenas 2 mídias — o backup completo (referência) + o último diferencial (que já contém todas as alterações desde o completo).",
    explanationCorrect: "C: diferencial acumula tudo desde o último completo → o diferencial de quinta já inclui as alterações de segunda, terça, quarta e quinta. Portanto: completo (domingo) + diferencial de quinta = 2 mídias. Vantagem do diferencial.",
    explanationWrong: "B: essa seria a estratégia do incremental — não do diferencial. D: sem o completo, não é possível restaurar. E: o diferencial não exige todos os backups intermediários.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_si_c01_q07",
    contentId: "inf_si_c01",
    statement: "Sobre o bit de arquivo (archive bit) e sua relação com os tipos de backup, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "Apenas o backup completo zera o bit de arquivo; incremental e diferencial não alteram o bit." },
      { letter: "B", text: "O backup diferencial zera o bit de arquivo, garantindo que cada diferencial parta do zero." },
      { letter: "C", text: "O backup incremental zera o bit de arquivo após a cópia; o diferencial não zera, acumulando alterações desde o último completo." },
      { letter: "D", text: "Nenhum tipo de backup zera o bit de arquivo — o bit é controlado exclusivamente pelo sistema operacional." },
      { letter: "E", text: "O bit de arquivo é zerado pelo backup completo e pelo diferencial, mas não pelo incremental." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Completo: zera o bit. Incremental: zera o bit. Diferencial: NÃO zera o bit → por isso acumula progressivamente tudo desde o último completo.",
    explanationCorrect: "C: incremental ZERA o bit (começa do zero a cada execução). Diferencial NÃO zera (acumula). Essa diferença é a razão pela qual o diferencial cresce progressivamente e o incremental não.",
    explanationWrong: "A: incremental também zera. B: diferencial NÃO zera — se zerasse seria equivalente ao incremental. D: os backups alteram o bit sim. E: diferencial NÃO zera; completo e incremental zeram.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_si_c01_q08",
    contentId: "inf_si_c01",
    statement: "A estratégia de backup que garante o menor tempo de restauração, mas exige o maior espaço de armazenamento e o maior tempo de execução, é o backup:",
    alternatives: [
      { letter: "A", text: "Incremental." },
      { letter: "B", text: "Diferencial." },
      { letter: "C", text: "Completo." },
      { letter: "D", text: "Sintético." },
      { letter: "E", text: "Espelho (mirror)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Backup completo: restauração com 1 mídia (mais rápida), mas é o que ocupa mais espaço e leva mais tempo para executar. É o custo-benefício invertido em relação ao incremental.",
    explanationCorrect: "C: backup completo = menor tempo de restauração (1 mídia), maior espaço de armazenamento, maior tempo de execução. É a referência base para os outros tipos.",
    explanationWrong: "A: incremental tem restauração mais lenta (N mídias). B: diferencial tem restauração média (2 mídias) e espaço/tempo médios. D e E: não são os tipos principais cobrados em provas.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── inf_si_c02 — Ataques de Rede: DoS, DDoS, MitM e Replay ──────────────

  {
    id: "inf_si_c02_q01",
    contentId: "inf_si_c02",
    statement: "O ataque DoS (Denial of Service) é originado de múltiplas fontes coordenadas (botnet), tornando-o mais difícil de mitigar que o DDoS.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "É o contrário: DoS vem de UMA única fonte; DDoS vem de MÚLTIPLAS fontes (botnet). O DDoS é mais difícil de mitigar justamente por ter múltiplas origens.",
    explanationCorrect: "Errado: DoS = 1 fonte. DDoS = múltiplas fontes (botnet). O DDoS é mais difícil de mitigar — não o DoS. A questão inverteu a definição dos dois ataques.",
    explanationWrong: "A afirmação está invertida — DoS é de uma única fonte; DDoS usa botnet (múltiplas fontes distribuídas).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c02_q02",
    contentId: "inf_si_c02",
    statement: "O ataque Man-in-the-Middle (MitM) compromete principalmente a disponibilidade do sistema alvo.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "O MitM compromete CONFIDENCIALIDADE (intercepta dados) e INTEGRIDADE (pode alterar mensagens). A disponibilidade é comprometida pelo DoS/DDoS — não pelo MitM.",
    explanationCorrect: "Errado: MitM = compromete confidencialidade (intercepta) e integridade (pode alterar). Disponibilidade é o alvo do DoS/DDoS. O MitM posiciona o atacante no meio da comunicação para espionar ou manipular dados.",
    explanationWrong: "A afirmação está incorreta — MitM ataca confidencialidade e integridade, não disponibilidade.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c02_q03",
    contentId: "inf_si_c02",
    statement: "O ataque de Replay pode ser bloqueado pelo uso de nonce (número usado uma única vez) ou timestamps de validade nas comunicações.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "O ataque de Replay reutiliza dados válidos capturados. O nonce e o timestamp tornam cada comunicação única — uma captura reutilizada será rejeitada por já ter sido usada ou expirada.",
    explanationCorrect: "Certo: nonce (número de uso único) e timestamp de validade são as principais contramedidas contra Replay. Se o pacote foi usado ou expirou, o servidor o rejeita — impossibilitando a reutilização da captura.",
    explanationWrong: "A afirmação está correta — nonce e timestamp são contramedidas eficazes contra o ataque de Replay.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c02_q04",
    contentId: "inf_si_c02",
    statement: "O ataque SYN Flood é uma variante do DDoS que explora a etapa de handshake do protocolo TCP para sobrecarregar o servidor alvo.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "SYN Flood é variante do DoS (não DDoS necessariamente) que explora o handshake TCP. Pode ser de uma única fonte. Quando originado de múltiplas fontes, seria DDoS, mas o SYN Flood por si só é classificado como DoS.",
    explanationCorrect: "Errado: SYN Flood é variante do DoS (não necessariamente DDoS). Pode ser executado de uma única fonte. O DDoS exige múltiplas origens coordenadas via botnet. O SYN Flood explora o handshake TCP — isso está correto.",
    explanationWrong: "A classificação como DDoS está incorreta — SYN Flood é tipicamente DoS (pode ser de uma fonte). O restante da afirmação (explorar handshake TCP) está correto.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c02_q05",
    contentId: "inf_si_c02",
    statement: "Sobre o ataque DDoS e sua infraestrutura, assinale a opção correta.",
    alternatives: [
      { letter: "A", text: "No DDoS, o atacante usa apenas um computador de alto desempenho para gerar tráfego suficiente para derrubar o alvo." },
      { letter: "B", text: "O DDoS utiliza uma botnet — rede de dispositivos comprometidos (zumbis) controlados por um servidor C2 — para coordenar o ataque de múltiplas origens." },
      { letter: "C", text: "O DDoS é mais fácil de mitigar que o DoS, pois o tráfego malicioso tem padrão uniforme e identificável." },
      { letter: "D", text: "Botnet é um software antivírus utilizado para detectar e bloquear ataques DDoS em tempo real." },
      { letter: "E", text: "O servidor C2 (Command and Control) é o alvo do ataque DDoS — não o controlador." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "DDoS usa botnet (rede de zumbis) controlada por servidor C2 (Command and Control) para atacar o alvo de múltiplas origens simultaneamente.",
    explanationCorrect: "B: botnet = rede de dispositivos comprometidos (zumbis). C2 = servidor de comando e controle que envia ordens aos bots para atacar o alvo. A distribuição das origens dificulta muito a mitigação.",
    explanationWrong: "A: DDoS usa múltiplos computadores — não apenas um. C: DDoS é mais difícil de mitigar (não mais fácil). D: botnet é a rede de zumbis do atacante, não antivírus. E: C2 é o controlador, não o alvo do ataque.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_si_c02_q06",
    contentId: "inf_si_c02",
    statement: "Um atacante intercepta a comunicação entre um usuário e seu banco online, podendo ler e modificar as mensagens sem que nenhum dos dois perceba. Esse ataque é denominado:",
    alternatives: [
      { letter: "A", text: "DoS (Denial of Service)." },
      { letter: "B", text: "Ataque de Replay." },
      { letter: "C", text: "Man-in-the-Middle (MitM)." },
      { letter: "D", text: "IP Spoofing." },
      { letter: "E", text: "DDoS distribuído." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "MitM = atacante se posiciona entre duas partes comunicantes, interceptando e possivelmente alterando mensagens sem que as vítimas percebam. Compromete confidencialidade e integridade.",
    explanationCorrect: "C: Man-in-the-Middle — o atacante se insere silenciosamente entre o usuário e o servidor. Técnicas: ARP Spoofing, SSL Stripping, Evil Twin Wi-Fi. Contramedida: TLS/HTTPS com autenticação mútua.",
    explanationWrong: "A: DoS torna o serviço indisponível — não intercepta. B: Replay reutiliza dados capturados, não intercepta em tempo real para modificar. D: IP Spoofing é falsificação de endereço — pode ser parte de um MitM mas não é o nome do ataque descrito. E: DDoS sobrecarrega o alvo.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_si_c02_q07",
    contentId: "inf_si_c02",
    statement: "Um atacante captura o token de autenticação de um usuário durante o login e o reutiliza horas depois para acessar o sistema sem conhecer a senha. Trata-se de:",
    alternatives: [
      { letter: "A", text: "Ataque de Brute Force." },
      { letter: "B", text: "Man-in-the-Middle." },
      { letter: "C", text: "Ataque de Replay." },
      { letter: "D", text: "SQL Injection." },
      { letter: "E", text: "Phishing." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Ataque de Replay: captura de transmissão legítima (token/pacote de autenticação) e reenvio posterior para obter acesso, sem necessidade de decifrar o conteúdo.",
    explanationCorrect: "C: Replay = reutilizar dados válidos capturados. O atacante não precisa conhecer a senha — usa o token capturado. Contramedida: nonce (token de uso único), timestamp de validade.",
    explanationWrong: "A: Brute Force testa senhas — não captura tokens. B: MitM intercepta em tempo real durante a comunicação — não armazena para uso posterior. D: SQL Injection ataca bancos de dados. E: Phishing engana a vítima para fornecer credenciais.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_si_c02_q08",
    contentId: "inf_si_c02",
    statement: "Qual princípio da segurança da informação (DICAI) é PRIMARIAMENTE comprometido por um ataque DoS/DDoS bem-sucedido?",
    alternatives: [
      { letter: "A", text: "Confidencialidade." },
      { letter: "B", text: "Integridade." },
      { letter: "C", text: "Disponibilidade." },
      { letter: "D", text: "Autenticidade." },
      { letter: "E", text: "Irretratabilidade (Não-repúdio)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "DoS/DDoS compromete primariamente a DISPONIBILIDADE — o serviço fica inacessível para usuários legítimos. A confidencialidade e integridade não são o alvo primário do DoS.",
    explanationCorrect: "C: Disponibilidade (D do DICAI) — DoS/DDoS torna o serviço indisponível para usuários autorizados. Ataques: SYN Flood, HTTP Flood, botnet DDoS. Contramedidas: firewalls, rate limiting, CDN anti-DDoS.",
    explanationWrong: "A: confidencialidade é alvo do MitM/phishing. B: integridade é alvo do MitM (alteração de dados). D: autenticidade é alvo do Replay/phishing. E: irretratabilidade é comprometida por ataques a logs/assinaturas.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── inf_si_c03 — VPN e Protocolos de Tunelamento ─────────────────────────

  {
    id: "inf_si_c03_q01",
    contentId: "inf_si_c03",
    statement: "O protocolo IPSec opera na camada 3 (Rede) do modelo OSI e pode funcionar em dois modos: Transporte e Túnel.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "IPSec opera na camada 3 (Rede/IP). Modo Transporte: criptografa apenas o payload. Modo Túnel: criptografa o pacote inteiro (mais seguro) — usado em VPNs site-to-site.",
    explanationCorrect: "Certo: IPSec na camada 3, dois modos: Transporte (payload apenas) e Túnel (pacote inteiro). O modo Túnel é mais seguro e usado em VPNs corporativas site-to-site.",
    explanationWrong: "A afirmação está correta — IPSec camada 3, modos Transporte e Túnel.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c03_q02",
    contentId: "inf_si_c03",
    statement: "O protocolo AH (Authentication Header) do IPSec garante confidencialidade, autenticação e integridade dos dados transmitidos.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "O AH garante apenas AUTENTICAÇÃO e INTEGRIDADE — NÃO criptografa os dados (sem confidencialidade). Para criptografia, usa-se o ESP (Encapsulating Security Payload).",
    explanationCorrect: "Errado: AH = autenticação + integridade (sem criptografia). ESP = autenticação + integridade + criptografia. Para VPN com sigilo dos dados, usa-se ESP, não AH.",
    explanationWrong: "A afirmação está incorreta — AH não garante confidencialidade. Confidencialidade é função do ESP.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c03_q03",
    contentId: "inf_si_c03",
    statement: "O L2TP, por si só, não oferece criptografia — sendo quase sempre combinado com IPSec para prover segurança ao túnel.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "L2TP (Layer 2 Tunneling Protocol) cria o túnel na camada 2, mas não oferece criptografia nativa. A combinação L2TP/IPSec é a solução padrão para VPNs com segurança.",
    explanationCorrect: "Certo: L2TP sozinho = sem criptografia. L2TP/IPSec = combinação padrão. O L2TP opera na camada 2 (Enlace) e é sucessor do PPTP (considerado inseguro).",
    explanationWrong: "A afirmação está correta — L2TP não criptografa por conta própria e precisa do IPSec para segurança.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c03_q04",
    contentId: "inf_si_c03",
    statement: "O TLS (Transport Layer Security) é o protocolo que substitui e aprimora o SSL, sendo a base das conexões HTTPS utilizadas na web.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "TLS é o sucessor e versão mais segura do SSL (que está depreciado). Toda conexão HTTPS utiliza TLS para criptografar o tráfego HTTP. TLS opera na camada 4/5 do modelo OSI.",
    explanationCorrect: "Certo: TLS substituiu o SSL (depreciado). TLS = base do HTTPS. Opera nas camadas 4/5 do modelo OSI (Transporte/Sessão). VPNs SSL/TLS (como OpenVPN) usam TLS como protocolo de tunelamento.",
    explanationWrong: "A afirmação está correta — TLS é o sucessor do SSL e base do HTTPS.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c03_q05",
    contentId: "inf_si_c03",
    statement: "Sobre os modos de operação do IPSec, assinale a opção correta.",
    alternatives: [
      { letter: "A", text: "O modo Transporte criptografa o pacote IP inteiro, incluindo o cabeçalho — mais seguro para VPNs site-to-site." },
      { letter: "B", text: "O modo Túnel criptografa o pacote IP inteiro (cabeçalho + payload) e adiciona novo cabeçalho IP — mais seguro e usado em VPNs corporativas." },
      { letter: "C", text: "O modo Transporte é mais seguro que o modo Túnel, pois criptografa mais camadas do pacote." },
      { letter: "D", text: "O IPSec em modo Transporte é o único recomendado para comunicação ponto-a-ponto entre redes distintas." },
      { letter: "E", text: "O modo Túnel não altera o cabeçalho original do pacote IP — apenas criptografa o payload." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Modo Túnel: criptografa o pacote inteiro (cabeçalho + payload original) e adiciona novo cabeçalho IP — mais seguro, usado em VPNs site-to-site. Modo Transporte: criptografa apenas o payload.",
    explanationCorrect: "B: modo Túnel = criptografa pacote inteiro + adiciona novo cabeçalho. Usado em VPNs site-to-site corporativas. Modo Transporte = apenas payload (cabeçalho IP exposto) — usado em comunicação host-to-host.",
    explanationWrong: "A: modo Transporte criptografa apenas o payload (não o cabeçalho). C: Túnel é mais seguro (não o Transporte). D: para redes distintas, usa-se modo Túnel. E: Túnel adiciona novo cabeçalho e criptografa o cabeçalho original.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_si_c03_q06",
    contentId: "inf_si_c03",
    statement: "Uma empresa deseja interligar sua filial de Brasília à matriz de São Paulo com comunicação segura e criptografada. A solução mais adequada é:",
    alternatives: [
      { letter: "A", text: "L2TP isolado, pois opera na camada 2 e oferece tunelamento sem overhead." },
      { letter: "B", text: "PPTP, pois é o protocolo mais moderno e seguro para VPNs corporativas." },
      { letter: "C", text: "IPSec em modo Túnel, que criptografa o pacote inteiro — ideal para VPNs site-to-site corporativas." },
      { letter: "D", text: "AH do IPSec, pois garante confidencialidade, integridade e autenticação simultaneamente." },
      { letter: "E", text: "SSL/TLS, pois é o único protocolo que oferece criptografia na camada de rede." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "VPN site-to-site corporativa: IPSec em modo Túnel — criptografa o pacote inteiro e adiciona novo cabeçalho. É a solução padrão para interligar redes corporativas de forma segura.",
    explanationCorrect: "C: IPSec modo Túnel = padrão para VPN site-to-site. Criptografa o pacote IP inteiro, garantindo confidencialidade dos dados e dos endereços internos.",
    explanationWrong: "A: L2TP isolado não criptografa. B: PPTP é considerado inseguro e obsoleto. D: AH não oferece confidencialidade (sem criptografia). E: SSL/TLS opera na camada 4/5 — não na camada de rede (3).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_si_c03_q07",
    contentId: "inf_si_c03",
    statement: "Sobre a comparação entre os protocolos IPSec AH e ESP, assinale a opção correta.",
    alternatives: [
      { letter: "A", text: "AH e ESP oferecem as mesmas funcionalidades — a diferença é apenas o algoritmo de criptografia utilizado." },
      { letter: "B", text: "AH garante autenticação e integridade; ESP garante autenticação, integridade e também criptografia dos dados." },
      { letter: "C", text: "ESP não oferece autenticação — apenas criptografia dos dados." },
      { letter: "D", text: "AH é mais seguro que ESP, pois autentica o cabeçalho IP original sem expô-lo." },
      { letter: "E", text: "O AH pode ser utilizado isoladamente para garantir a confidencialidade em VPNs corporativas." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "AH: autenticação + integridade (SEM criptografia). ESP: autenticação + integridade + criptografia. Para sigilo dos dados, é obrigatório usar ESP.",
    explanationCorrect: "B: AH = autenticação + integridade (sem criptografia dos dados). ESP = autenticação + integridade + criptografia. Para VPN com confidencialidade, usa-se ESP (ou ESP+AH combinados).",
    explanationWrong: "A: diferenças vão além do algoritmo — AH não criptografa; ESP criptografa. C: ESP também oferece autenticação. D: ESP é mais completo (criptografa também). E: AH não oferece confidencialidade — não serve para VPN com sigilo.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_si_c03_q08",
    contentId: "inf_si_c03",
    statement: "Em qual camada do modelo OSI o protocolo L2TP opera?",
    alternatives: [
      { letter: "A", text: "Camada 1 (Física)." },
      { letter: "B", text: "Camada 2 (Enlace)." },
      { letter: "C", text: "Camada 3 (Rede)." },
      { letter: "D", text: "Camada 4 (Transporte)." },
      { letter: "E", text: "Camada 7 (Aplicação)." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "L2TP (Layer 2 Tunneling Protocol) opera na camada 2 (Enlace) do modelo OSI. O '2' no nome já indica a camada. IPSec: camada 3. SSL/TLS: camada 4/5.",
    explanationCorrect: "B: L2TP = camada 2 (Enlace). O nome 'Layer 2' indica a camada. Comparação: L2TP (2), IPSec (3), SSL/TLS (4/5). L2TP não criptografa — combina com IPSec para segurança.",
    explanationWrong: "A: física é a camada 1 — cabo, sinal. C: camada 3 é o IPSec. D: camada 4 é o TCP/UDP/TLS. E: camada 7 são os aplicativos (HTTP, FTP, DNS).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── inf_si_c04 — CVE, CVSS e Patch Management ────────────────────────────

  {
    id: "inf_si_c04_q01",
    contentId: "inf_si_c04",
    statement: "O identificador CVE segue o formato CVE-ANO-NÚMERO e é mantido pela MITRE Corporation.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "CVE (Common Vulnerabilities and Exposures): formato CVE-ANO-NÚMERO (ex: CVE-2021-44228). Mantido pela MITRE Corporation, patrocinado pela CISA.",
    explanationCorrect: "Certo: CVE-ANO-NÚMERO é o formato padrão. A MITRE mantém o sistema; o NVD (NIST) complementa com scores CVSS. Exemplo real: CVE-2021-44228 = Log4Shell (CVSS 10.0).",
    explanationWrong: "A afirmação está correta — CVE-ANO-NÚMERO, mantido pela MITRE.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c04_q02",
    contentId: "inf_si_c04",
    statement: "Uma vulnerabilidade com pontuação CVSS de 9.5 é classificada como 'Alta'.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "CVSS 9.5 está na faixa Crítica (9.0–10.0), não Alta. A faixa Alta é 7.0–8.9. A distinção Alta × Crítica é frequentemente cobrada em provas.",
    explanationCorrect: "Errado: CVSS 9.5 = CRÍTICA (9.0–10.0). Alta = 7.0–8.9. Escala: Nenhuma (0.0) → Baixa (0.1–3.9) → Média (4.0–6.9) → Alta (7.0–8.9) → Crítica (9.0–10.0).",
    explanationWrong: "A afirmação está incorreta — 9.5 é classificado como Crítico, não Alto.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c04_q03",
    contentId: "inf_si_c04",
    statement: "Uma vulnerabilidade zero-day é aquela para a qual o fabricante já disponibilizou um patch, mas os administradores ainda não o aplicaram.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Zero-day: vulnerabilidade explorada ANTES que o fabricante tome conhecimento ou lance um patch — sem correção disponível no momento da exploração. Quando o patch já existe, não é mais zero-day.",
    explanationCorrect: "Errado: zero-day = exploração antes de patch disponível. A situação descrita (patch disponível mas não aplicado) é falha de Patch Management — não zero-day.",
    explanationWrong: "A definição está incorreta — zero-day exige ausência de patch. Se o patch existe, a vulnerabilidade deixou de ser zero-day.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c04_q04",
    contentId: "inf_si_c04",
    statement: "O 'Patch Tuesday' é o dia em que a Microsoft disponibiliza suas atualizações de segurança mensalmente — ocorre toda segunda terça-feira de cada mês.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Patch Tuesday: ciclo mensal da Microsoft para lançamento de patches de segurança — toda segunda terça-feira de cada mês. Permite planejamento previsível de atualizações.",
    explanationCorrect: "Certo: Patch Tuesday = segunda terça-feira de cada mês. A previsibilidade permite que administradores planejem a janela de manutenção para aplicar os patches.",
    explanationWrong: "A afirmação está correta — Patch Tuesday ocorre toda segunda terça-feira de cada mês.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c04_q05",
    contentId: "inf_si_c04",
    statement: "Sobre a escala CVSS v3.1, qual a classificação correta de severidade para uma vulnerabilidade com pontuação 6.5?",
    alternatives: [
      { letter: "A", text: "Baixa (0.1–3.9)." },
      { letter: "B", text: "Média (4.0–6.9)." },
      { letter: "C", text: "Alta (7.0–8.9)." },
      { letter: "D", text: "Crítica (9.0–10.0)." },
      { letter: "E", text: "Nenhuma (0.0)." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "CVSS 6.5 está na faixa Média (4.0–6.9). Escala CVSS v3.1: Nenhuma (0.0), Baixa (0.1–3.9), Média (4.0–6.9), Alta (7.0–8.9), Crítica (9.0–10.0).",
    explanationCorrect: "B: Média = 4.0–6.9. CVSS 6.5 está dentro dessa faixa. Organizações maduras definem SLA por faixa: crítica (<24h ou 72h), alta (1–2 semanas), média (1 mês), baixa (próximo ciclo).",
    explanationWrong: "A: Baixa = 0.1–3.9. C: Alta = 7.0–8.9. D: Crítica = 9.0–10.0. E: Nenhuma = exatamente 0.0.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_si_c04_q06",
    contentId: "inf_si_c04",
    statement: "A equipe de segurança recebe alerta de vulnerabilidade CVE-2024-1234 com CVSS 9.8. Qual ação está alinhada com boas práticas de Patch Management?",
    alternatives: [
      { letter: "A", text: "Aguardar o próximo ciclo mensal (Patch Tuesday) para aplicar o patch de forma controlada." },
      { letter: "B", text: "Priorizar a aplicação imediata do patch (ou workaround) por se tratar de vulnerabilidade crítica — dentro de 24 a 72 horas." },
      { letter: "C", text: "Ignorar o patch até que incidentes reais sejam reportados na organização." },
      { letter: "D", text: "Aplicar o patch diretamente em produção sem testes, pois CVSS 9.8 exige urgência máxima." },
      { letter: "E", text: "Registrar o CVE no SINARM para rastreamento interno." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Vulnerabilidade crítica (CVSS ≥9.0): SLA padrão de 24h a 72h para aplicação de patch ou workaround. Organizações maduras definem prazos por criticidade no processo de Patch Management.",
    explanationCorrect: "B: CVSS 9.8 = crítica → patch imediato (24h–72h) conforme SLA de Patch Management maduro. Workaround pode ser aplicado como medida temporária enquanto o patch é testado.",
    explanationWrong: "A: aguardar o Patch Tuesday é aceitável para patches de menor criticidade — não para críticos. C: ignorar é violação grave de Patch Management. D: aplicar diretamente em produção sem testes pode gerar incidentes de disponibilidade. E: SINARM é sistema de armas — não de TI.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_si_c04_q07",
    contentId: "inf_si_c04",
    statement: "Sobre o conceito de vulnerabilidade zero-day, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "É uma vulnerabilidade antiga com patch disponível mas não aplicado por descuido do administrador." },
      { letter: "B", text: "É explorada apenas por atacantes com acesso físico ao sistema." },
      { letter: "C", text: "É uma vulnerabilidade conhecida e explorada antes que o fabricante tome conhecimento ou lance um patch de correção." },
      { letter: "D", text: "Zero-day refere-se ao tempo de resposta zero de um sistema sob ataque DoS." },
      { letter: "E", text: "Toda vulnerabilidade divulgada no CVE é automaticamente classificada como zero-day." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Zero-day: vulnerabilidade explorada antes que o fabricante saiba ou lance patch. O atacante tem 'zero dias' de vantagem do fabricante para se defender.",
    explanationCorrect: "C: zero-day = exploração antes de patch disponível. O nome vem do fato de que o fabricante tem 'zero dias' para proteger os usuários — a correção não existe ainda.",
    explanationWrong: "A: descuido de aplicar patch disponível não é zero-day. B: zero-day pode ser explorado remotamente. D: zero-day é sobre patches, não tempo de resposta DoS. E: vulnerabilidades publicadas no CVE já foram divulgadas — geralmente deixam de ser zero-day.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_si_c04_q08",
    contentId: "inf_si_c04",
    statement: "O processo de Patch Management inclui, entre suas etapas, o teste do patch em ambiente controlado antes da implantação em produção. Essa etapa tem como objetivo principal:",
    alternatives: [
      { letter: "A", text: "Reduzir o custo de licenciamento do software de atualização." },
      { letter: "B", text: "Verificar se o patch não causa impactos indesejados (incompatibilidades, falhas de sistema) antes de afetar o ambiente produtivo." },
      { letter: "C", text: "Permitir que os usuários finais avaliem a interface após a atualização." },
      { letter: "D", text: "Cumprir exclusivamente requisitos de auditoria interna, sem impacto real na segurança." },
      { letter: "E", text: "Atrasar propositalmente a aplicação do patch para aguardar que outros sistemas sejam atacados primeiro." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O teste em ambiente controlado garante que o patch não cause regressões, incompatibilidades ou falhas em produção. Equilibra urgência da segurança com estabilidade operacional.",
    explanationCorrect: "B: testes em homologação identificam incompatibilidades, falhas de integração e impactos não planejados antes que o patch atinja o ambiente produtivo — preservando disponibilidade e estabilidade.",
    explanationWrong: "A: teste não reduz custos de licenciamento. C: avaliação de interface não é o foco de Patch Management. D: o teste tem impacto real — evita downtime em produção. E: aguardar outros serem atacados viola os princípios de segurança.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── inf_si_c05 — Engenharia Social ───────────────────────────────────────

  {
    id: "inf_si_c05_q01",
    contentId: "inf_si_c05",
    statement: "O spear phishing é uma variante do phishing direcionada a indivíduos ou organizações específicas, com personalização de dados reais para aumentar a credibilidade do ataque.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Spear phishing = phishing direcionado e personalizado (nome, cargo, empresa, dados reais). Diferente do phishing genérico, que usa mensagens iguais para milhares de vítimas.",
    explanationCorrect: "Certo: spear phishing = ataque personalizado com dados reais do alvo. Ex: e-mail com nome, cargo e empresa da vítima, fingindo ser colega ou superior. Muito mais eficaz que phishing genérico.",
    explanationWrong: "A afirmação está correta — spear phishing é o phishing direcionado e personalizado.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c05_q02",
    contentId: "inf_si_c05",
    statement: "O vishing é um ataque de engenharia social realizado por meio de mensagens de texto (SMS) para induzir a vítima a clicar em links maliciosos.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Vishing = Voice Phishing = por TELEFONE (voz). Mensagem de texto é o SMISHING (SMS Phishing). A distinção vishing/smishing é clássica em provas.",
    explanationCorrect: "Errado: vishing = telefone (voz). SMS/WhatsApp = smishing. A questão descreveu o smishing, não o vishing. Vishing: atacante liga fingindo ser banco, suporte técnico ou entidade governamental.",
    explanationWrong: "A afirmação descreve o smishing, não o vishing. Vishing usa a voz (telefone).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c05_q03",
    contentId: "inf_si_c05",
    statement: "O pharming redireciona o usuário para um site falso mesmo quando ele digita corretamente a URL no navegador, por meio de envenenamento de DNS ou do arquivo hosts.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Pharming: envenenamento do DNS ou do arquivo hosts para redirecionar a URL correta digitada para um servidor falso. A vítima digita a URL certa mas é levada ao site falso.",
    explanationCorrect: "Certo: pharming = envenenamento DNS ou arquivo hosts. A vítima não precisa clicar em link suspeito — a própria URL correta é sequestrada. Diferente do phishing, que usa URL falsa.",
    explanationWrong: "A afirmação está correta — pharming envenena DNS/hosts para redirecionar a URL legítima.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c05_q04",
    contentId: "inf_si_c05",
    statement: "O baiting, na engenharia social, consiste em oferecer ajuda técnica falsa em troca de credenciais de acesso ao sistema.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Baiting = usar isca física (ex: pendrive infectado deixado em local público). Oferecer ajuda técnica falsa em troca de credenciais é o ataque 'quid pro quo' — não baiting.",
    explanationCorrect: "Errado: baiting = isca física (pendrive infectado em local público). Quid pro quo = oferecer ajuda técnica falsa em troca de credenciais. A questão descreveu o quid pro quo.",
    explanationWrong: "A afirmação descreve o quid pro quo. Baiting usa mídia física como isca.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c05_q05",
    contentId: "inf_si_c05",
    statement: "Funcionária do RH recebe e-mail aparentemente enviado pelo CEO com nome, foto e assinatura corretos, solicitando urgentemente uma transferência bancária para conta de 'fornecedor estratégico'. Esse ataque é classificado como:",
    alternatives: [
      { letter: "A", text: "Smishing — ataque por mensagem de texto." },
      { letter: "B", text: "Vishing — ataque por telefone com urgência fabricada." },
      { letter: "C", text: "Whaling — spear phishing direcionado a alto executivo ou usando sua identidade para atingir a organização." },
      { letter: "D", text: "Pharming — redirecionamento de URL corporativa." },
      { letter: "E", text: "Baiting — mídia física com vírus direcionada ao RH." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Whaling: spear phishing que envolve alto executivo — seja como alvo ou como identidade usada pelo atacante. O e-mail fingindo ser o CEO para obter transferência é um exemplo clássico de whaling (Business Email Compromise).",
    explanationCorrect: "C: whaling = spear phishing envolvendo alto escalão (CEO, CFO) — como alvo ou como identidade falsificada. BEC (Business Email Compromise) é uma forma de whaling amplamente usada em fraudes financeiras.",
    explanationWrong: "A: smishing usa SMS. B: vishing usa telefone. D: pharming é redirecionamento de DNS — não e-mail. E: baiting usa mídia física. O ataque descrito é por e-mail personalizado com identidade do CEO = whaling.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_si_c05_q06",
    contentId: "inf_si_c05",
    statement: "Sobre o pretexting como técnica de engenharia social, assinale a opção correta.",
    alternatives: [
      { letter: "A", text: "Pretexting é sinônimo de phishing — ambos usam e-mail fraudulento para obter credenciais." },
      { letter: "B", text: "No pretexting, o atacante cria um cenário fictício elaborado e assume identidade falsa para extrair informações confidenciais da vítima." },
      { letter: "C", text: "O pretexting é uma técnica exclusivamente digital — não pode ser realizada por telefone ou presencialmente." },
      { letter: "D", text: "Pretexting e baiting são a mesma técnica — ambos usam isca para atrair a vítima." },
      { letter: "E", text: "O pretexting não envolve manipulação psicológica — é um ataque técnico de força bruta." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Pretexting: criação de cenário fictício elaborado (identidade falsa de auditor, TI, investigador) para extrair informações. Mais sofisticado que o phishing — envolve construção de contexto convincente.",
    explanationCorrect: "B: pretexting = identidade falsa + cenário elaborado (pretexto) para obter informações. Ex: atacante liga para RH fingindo ser novo funcionário precisando de acesso. Pode ser por telefone ou presencialmente.",
    explanationWrong: "A: pretexting e phishing são técnicas distintas — phishing usa e-mail falso; pretexting usa cenário elaborado (geralmente por telefone ou presencialmente). C: pretexting pode ser por telefone ou pessoalmente. D: baiting usa isca física — diferente. E: pretexting é exatamente manipulação psicológica.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_si_c05_q07",
    contentId: "inf_si_c05",
    statement: "Usuário encontra um pendrive com etiqueta 'Salários 2024 — CONFIDENCIAL' no estacionamento da empresa e o conecta ao computador do trabalho por curiosidade. Esse vetor de ataque é denominado:",
    alternatives: [
      { letter: "A", text: "Phishing." },
      { letter: "B", text: "Vishing." },
      { letter: "C", text: "Pretexting." },
      { letter: "D", text: "Baiting (isca)." },
      { letter: "E", text: "Tailgating." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "Baiting: uso de isca física (pendrive, CD, HD externo) em local público para induzir a vítima a conectá-la ao computador — instalando malware automaticamente.",
    explanationCorrect: "D: baiting = isca física. A etiqueta 'Salários CONFIDENCIAL' é a isca que explora a curiosidade. Ao conectar o pendrive, malware é instalado automaticamente. Contramedida: política de bloqueio de USB, conscientização.",
    explanationWrong: "A: phishing é por e-mail. B: vishing é por telefone. C: pretexting envolve identidade falsa com cenário elaborado. E: tailgating é acesso físico não autorizado seguindo pessoa autorizada.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_si_c05_q08",
    contentId: "inf_si_c05",
    statement: "Qual das situações abaixo descreve corretamente o ataque de tailgating (piggybacking)?",
    alternatives: [
      { letter: "A", text: "Atacante envia e-mail falso com link para site malicioso usando nome de empresa conhecida." },
      { letter: "B", text: "Atacante liga para a vítima fingindo ser suporte técnico e solicita a senha de acesso." },
      { letter: "C", text: "Atacante entra fisicamente em área restrita aproveitando-se de pessoa autorizada que abriu a porta." },
      { letter: "D", text: "Atacante deixa pendrive infectado no banheiro da empresa esperando alguém conectá-lo." },
      { letter: "E", text: "Atacante redireciona o DNS da empresa para servidor sob seu controle." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Tailgating/Piggybacking: acesso físico não autorizado obtido ao seguir de perto uma pessoa autorizada que abriu uma porta ou catraca — sem usar credenciais próprias.",
    explanationCorrect: "C: tailgating = exploração de acesso físico. Atacante passa pela porta segura imediatamente após pessoa autorizada, sem autenticação própria. Contramedida: catracas individuais, câmeras, conscientização.",
    explanationWrong: "A: phishing. B: vishing. D: baiting. E: pharming (DNS). Tailgating é o único ataque físico entre as alternativas.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── inf_si_c06 — DICAI: Não-repúdio e Autenticidade ──────────────────────

  {
    id: "inf_si_c06_q01",
    contentId: "inf_si_c06",
    statement: "O princípio da irretratabilidade (não-repúdio) garante que o emissor de uma mensagem não possa negar tê-la enviado, sendo implementado por meio de assinatura digital.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Não-repúdio/Irretratabilidade: garante que o autor de uma ação ou mensagem não possa negá-la posteriormente. Implementado por assinatura digital (chave privada do emissor) + carimbo de tempo.",
    explanationCorrect: "Certo: irretratabilidade = não-repúdio. A assinatura digital usa a chave privada do emissor — só ele pode assinar. Isso impede que negue a autoria. Carimbo de tempo complementa.",
    explanationWrong: "A afirmação está correta — não-repúdio é implementado por assinatura digital.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c06_q02",
    contentId: "inf_si_c06",
    statement: "O princípio da confidencialidade, no modelo DICAI, é garantido principalmente pelo uso de funções de hash (como SHA-256).",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Hash (SHA-256, MD5) garante INTEGRIDADE — detecta alterações nos dados. Confidencialidade é garantida por CRIPTOGRAFIA. A questão trocou os mecanismos.",
    explanationCorrect: "Errado: hash garante integridade (detecta alterações). Confidencialidade é garantida por criptografia (AES, RSA). A questão inverteu: hash → integridade; criptografia → confidencialidade.",
    explanationWrong: "A afirmação está incorreta — hash garante integridade, não confidencialidade.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c06_q03",
    contentId: "inf_si_c06",
    statement: "A autenticação multifator (MFA) é um mecanismo que contribui principalmente para o princípio da autenticidade no modelo DICAI.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "MFA verifica que a entidade (usuário) é genuinamente quem afirma ser — princípio da Autenticidade (A do DICAI). Usa múltiplos fatores: algo que sabe (senha) + algo que tem (token) + algo que é (biometria).",
    explanationCorrect: "Certo: MFA reforça a autenticidade — garante que o usuário é quem afirma ser, combinando múltiplos fatores. Outros mecanismos de autenticidade: certificados digitais X.509, HMAC.",
    explanationWrong: "A afirmação está correta — MFA contribui para o princípio da autenticidade.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c06_q04",
    contentId: "inf_si_c06",
    statement: "O princípio da disponibilidade (D do DICAI) é comprometido por ataques de phishing que roubam credenciais de usuários.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Phishing compromete CONFIDENCIALIDADE (roubo de credenciais/dados) e AUTENTICIDADE (identidade falsa). Disponibilidade é comprometida por DoS/DDoS e falhas de hardware.",
    explanationCorrect: "Errado: phishing compromete confidencialidade (credenciais roubadas) e autenticidade (identidade do emissor falsa). Disponibilidade é alvo do DoS/DDoS — não do phishing.",
    explanationWrong: "A afirmação está incorreta — phishing ataca confidencialidade e autenticidade, não disponibilidade.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_si_c06_q05",
    contentId: "inf_si_c06",
    statement: "Sobre os cinco princípios do modelo DICAI (Disponibilidade, Integridade, Confidencialidade, Autenticidade, Irretratabilidade), assinale a opção que apresenta corretamente o mecanismo principal de cada princípio.",
    alternatives: [
      { letter: "A", text: "Disponibilidade: criptografia. Integridade: hash. Confidencialidade: firewall. Autenticidade: backup. Irretratabilidade: antivírus." },
      { letter: "B", text: "Disponibilidade: redundância/alta disponibilidade. Integridade: hash (SHA-256). Confidencialidade: criptografia. Autenticidade: assinatura digital/MFA. Irretratabilidade: assinatura digital + carimbo de tempo." },
      { letter: "C", text: "Disponibilidade: hash. Integridade: criptografia. Confidencialidade: assinatura digital. Autenticidade: firewall. Irretratabilidade: backup." },
      { letter: "D", text: "Todos os princípios do DICAI são garantidos exclusivamente pela criptografia simétrica." },
      { letter: "E", text: "Autenticidade e irretratabilidade são o mesmo princípio — implementados pelos mesmos mecanismos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "DICAI e mecanismos: Disponibilidade → redundância/SLA. Integridade → hash. Confidencialidade → criptografia. Autenticidade → assinatura digital/MFA. Irretratabilidade → assinatura digital + carimbo de tempo.",
    explanationCorrect: "B: mapeamento correto dos 5 princípios e seus mecanismos. A tabela DICAI é fundamental para provas: D=redundância, I=hash, C=criptografia, A=assinatura/MFA, I=assinatura+timestamp.",
    explanationWrong: "A, C e D: mecanismos incorretos ou misturados. E: autenticidade (quem é) e irretratabilidade (não pode negar) são princípios distintos — embora a assinatura digital suporte ambos.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_si_c06_q06",
    contentId: "inf_si_c06",
    statement: "Qual a diferença entre autenticação e não-repúdio no contexto da segurança da informação?",
    alternatives: [
      { letter: "A", text: "Não há diferença — autenticação e não-repúdio são sinônimos no modelo DICAI." },
      { letter: "B", text: "Autenticação prova a identidade do usuário no momento do acesso; não-repúdio garante que aquela ação específica não pode ser negada posteriormente pelo autor." },
      { letter: "C", text: "Autenticação garante que dados não foram alterados; não-repúdio garante que o sistema está disponível." },
      { letter: "D", text: "Não-repúdio é mais fraco que autenticação, pois depende apenas de senha para funcionar." },
      { letter: "E", text: "Autenticação é um princípio do DICAI; não-repúdio é apenas um conceito jurídico sem aplicação técnica." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Autenticação: prova de identidade no momento do acesso (quem é você agora). Não-repúdio: impossibilidade de negar ter praticado uma ação (você fez isso e não pode negar depois).",
    explanationCorrect: "B: autenticação = identidade no momento (login). Não-repúdio = impossibilidade de negar ação posterior (assinatura digital vincula o ato ao autor de forma irrefutável). Ex: autenticação = entrar no sistema; não-repúdio = provar que foi você quem enviou aquele e-mail assinado digitalmente.",
    explanationWrong: "A: são princípios distintos. C: confunde com integridade (dados) e disponibilidade. D: não-repúdio usa assinatura digital (chave privada) — mais robusto que senha. E: não-repúdio tem implementação técnica (assinatura digital) além do aspecto jurídico.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_si_c06_q07",
    contentId: "inf_si_c06",
    statement: "O certificado digital ICP-Brasil tem como função principal garantir qual princípio do DICAI?",
    alternatives: [
      { letter: "A", text: "Disponibilidade — garante que o site esteja sempre acessível." },
      { letter: "B", text: "Integridade — verifica que os dados não foram alterados durante a transmissão." },
      { letter: "C", text: "Autenticidade — garante que a chave pública pertence de fato à entidade identificada, por meio de uma Autoridade Certificadora credenciada." },
      { letter: "D", text: "Confidencialidade — criptografa os dados de ponta a ponta." },
      { letter: "E", text: "Irretratabilidade — registra o horário exato de cada acesso ao sistema." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Certificado digital ICP-Brasil: emitido por Autoridade Certificadora credenciada, vincula a identidade de uma entidade à sua chave pública — garantindo autenticidade. A AC atesta: 'essa chave pública pertence a essa entidade'.",
    explanationCorrect: "C: certificado digital garante autenticidade — a Autoridade Certificadora (AC) atesta que a chave pública pertence àquela entidade. Isso evita ataques MitM com chave pública falsa.",
    explanationWrong: "A: disponibilidade é sobre acesso ao sistema, não certificado. B: integridade é garantida por hash, não pelo certificado em si. D: criptografia é a confidencialidade — o certificado autentica a chave usada para criptografar. E: registro de horário é log de auditoria — não certificado digital.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_si_c06_q08",
    contentId: "inf_si_c06",
    statement: "Sobre o mapeamento entre ataques e princípios DICAI comprometidos, assinale a opção correta.",
    alternatives: [
      { letter: "A", text: "Um ataque DDoS compromete principalmente a Confidencialidade dos dados." },
      { letter: "B", text: "Um ataque MitM compromete Disponibilidade e Irretratabilidade." },
      { letter: "C", text: "Um ataque de Replay compromete a Autenticidade, pois utiliza identidade falsa via dados capturados válidos." },
      { letter: "D", text: "Um ataque de phishing compromete exclusivamente a Disponibilidade do sistema." },
      { letter: "E", text: "Alteração não autorizada de arquivo compromete a Autenticidade do sistema operacional." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Replay: compromete Autenticidade — o atacante usa dados válidos capturados para se passar por usuário legítimo. Cada ataque afeta princípios específicos: DDoS → Disponibilidade; MitM → Confidencialidade + Integridade.",
    explanationCorrect: "C: Replay compromete Autenticidade — utiliza token/credencial válida capturada para fingir ser o usuário legítimo. A identidade apresentada é de outra sessão — violação de autenticidade.",
    explanationWrong: "A: DDoS → Disponibilidade (não confidencialidade). B: MitM → Confidencialidade + Integridade (não disponibilidade). D: phishing → Confidencialidade (rouba credenciais) — não disponibilidade. E: alteração não autorizada de arquivo → Integridade (não autenticidade do SO).",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n🚀 Seed R52 — Densificação: Informática — Segurança da Informação (inf_si_c01–c06)\n");

  const atomIds = [
    "inf_si_c01", "inf_si_c02", "inf_si_c03",
    "inf_si_c04", "inf_si_c05", "inf_si_c06",
  ];

  // 1. Verificar existência dos átomos
  for (const atomId of atomIds) {
    const rows = (await db.execute(sql`
      SELECT id, title FROM "Content" WHERE id = ${atomId} LIMIT 1
    `)) as any[];
    if (rows[0]) {
      console.log(`  ✅ Átomo encontrado: ${atomId} — ${rows[0].title}`);
    } else {
      console.warn(`  ⚠️  AVISO: Átomo NÃO encontrado: ${atomId} — execute seed-info-seguranca-r28.ts primeiro`);
    }
  }

  console.log("");

  // 2. Inserir questões
  let inseridas = 0;
  let ignoradas = 0;

  for (const q of questions) {
    const contentRows = (await db.execute(sql`
      SELECT "subjectId", "topicId" FROM "Content" WHERE id = ${q.contentId} LIMIT 1
    `)) as any[];

    if (!contentRows[0]) {
      console.warn(`  ⚠️  Conteúdo não encontrado para questão ${q.id} — pulando`);
      ignoradas++;
      continue;
    }

    const qSubjectId = contentRows[0].subjectId;
    const qTopicId = contentRows[0].topicId;
    const alternativesJson = JSON.stringify(q.alternatives);

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

    const affected = result.rowCount ?? result.count ?? 0;
    if (affected > 0) {
      console.log(`  ✅ ${q.id}`);
      inseridas++;
    } else {
      console.log(`  ⏭  ${q.id} (já existia)`);
      ignoradas++;
    }
  }

  // 3. Relatório final
  console.log("\n─────────────────────────────────────────");
  console.log(`✅ Inseridas : ${inseridas}`);
  console.log(`⏭  Ignoradas : ${ignoradas}`);
  console.log(`📊 Total     : ${questions.length}`);
  console.log("─────────────────────────────────────────\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed falhou:", err);
  process.exit(1);
});
