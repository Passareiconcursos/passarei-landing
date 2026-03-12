/**
 * Seed R56 — Densificação: Informática — Redes e Segurança Ativa (inf_rs_c01–c06)
 * Modo: DENSIFICAÇÃO — apenas questões; átomos já existem (seed-info-redes-r15.ts).
 *
 * Átomos-alvo (6 átomos × 6 questões = 36 questões):
 *   inf_rs_c01 — Modelo TCP/IP: Camadas, Portas e Protocolos de Transporte
 *   inf_rs_c02 — DNS: Resolução de Nomes de Domínio e Tipos de Registros
 *   inf_rs_c03 — HTTP/HTTPS: Métodos, Códigos de Status e Protocolo TLS
 *   inf_rs_c04 — Criptografia Simétrica, Assimétrica e Funções Hash
 *   inf_rs_c05 — Malwares: Vírus, Worm, Trojan, Ransomware e Spyware
 *   inf_rs_c06 — Firewall, DMZ, IDS e IPS: Segurança Perimetral de Redes
 *
 * Execução: git pull && npx tsx db/seed-dense-redes-seguranca-r56.ts
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
  // ÁTOMO 1 — Modelo TCP/IP: Camadas, Portas e Protocolos (inf_rs_c01)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "inf_rs_c01_q01",
    contentId: "inf_rs_c01",
    statement: "Julgue: No modelo TCP/IP, o protocolo UDP é orientado à conexão e garante a entrega dos dados, sendo mais confiável que o TCP.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "UDP é NÃO orientado à conexão e NÃO garante entrega. TCP é orientado à conexão com controle de fluxo e retransmissão. UDP é mais rápido (sem handshake), usado em streaming e DNS.",
    explanationCorrect: "ERRADO. UDP (User Datagram Protocol) é NÃO orientado à conexão, sem garantia de entrega ou ordenação dos pacotes. É mais rápido e leve que TCP, usado onde velocidade importa mais que confiabilidade (DNS, streaming, VoIP). TCP é o protocolo confiável.",
    explanationWrong: "TCP = confiável, orientado a conexão, com handshake de 3 vias. UDP = não confiável, sem conexão, sem handshake — mais rápido. A questão inverteu as características.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_rs_c01_q02",
    contentId: "inf_rs_c01",
    statement: "Qual porta padrão é utilizada pelo protocolo HTTPS?",
    alternatives: [
      { letter: "A", text: "Porta 80" },
      { letter: "B", text: "Porta 21" },
      { letter: "C", text: "Porta 443" },
      { letter: "D", text: "Porta 25" },
      { letter: "E", text: "Porta 110" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Portas padrão: HTTP=80, HTTPS=443, FTP=21, SMTP=25, POP3=110, IMAP=143, DNS=53, SSH=22, RDP=3389, Telnet=23.",
    explanationCorrect: "Alternativa C — Porta 443. HTTPS (HTTP Secure) utiliza a porta 443 por padrão. O HTTP padrão usa a porta 80. Memorize o conjunto: HTTP=80, HTTPS=443, FTP=21, SSH=22, SMTP=25, DNS=53.",
    explanationWrong: "Tabela de portas essenciais: HTTP=80 | HTTPS=443 | FTP=21 | SSH=22 | SMTP=25 | DNS=53 | POP3=110 | IMAP=143 | RDP=3389. Estas são cobradas frequentemente em provas de TI.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_rs_c01_q03",
    contentId: "inf_rs_c01",
    statement: "Julgue: O protocolo IP (Internet Protocol) é responsável pelo endereçamento e roteamento dos pacotes na camada de Internet do modelo TCP/IP.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "O IP opera na camada de Internet (equivalente à camada de Rede do OSI). Responsável por endereçamento lógico (endereços IP) e roteamento de pacotes entre redes distintas.",
    explanationCorrect: "CERTO. O protocolo IP opera na camada de Internet do modelo TCP/IP (equivalente à camada de Rede no modelo OSI). É responsável pelo endereçamento lógico (IPv4/IPv6) e pelo roteamento dos datagramas entre redes.",
    explanationWrong: "Camadas TCP/IP: Acesso à Rede → Internet (IP, ICMP, ARP) → Transporte (TCP, UDP) → Aplicação (HTTP, DNS, FTP). O IP está na camada de Internet, responsável por endereçamento e roteamento.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_rs_c01_q04",
    contentId: "inf_rs_c01",
    statement: "No handshake de três vias (three-way handshake) do TCP, qual a sequência correta de mensagens?",
    alternatives: [
      { letter: "A", text: "SYN → ACK → SYN-ACK" },
      { letter: "B", text: "SYN → SYN-ACK → ACK" },
      { letter: "C", text: "ACK → SYN → SYN-ACK" },
      { letter: "D", text: "SYN-ACK → SYN → ACK" },
      { letter: "E", text: "SYN → ACK → FIN" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Handshake TCP: (1) Cliente envia SYN; (2) Servidor responde SYN-ACK; (3) Cliente confirma com ACK. Estabelece número de sequência e parâmetros da conexão.",
    explanationCorrect: "Alternativa B. O three-way handshake TCP segue: ① Cliente → Servidor: SYN (sincronizar); ② Servidor → Cliente: SYN-ACK (sincronizar + confirmar); ③ Cliente → Servidor: ACK (confirmar). Após isso a conexão está estabelecida.",
    explanationWrong: "Macete: SYN (S) → SYN-ACK (SA) → ACK (A) = SSA. O cliente inicia o processo, o servidor sincroniza e confirma, e o cliente confirma o recebimento. Só então a conexão TCP está ativa.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_rs_c01_q05",
    contentId: "inf_rs_c01",
    statement: "Julgue: O protocolo ICMP é utilizado para diagnóstico e controle de erros na camada de Internet, sendo a base dos comandos 'ping' e 'traceroute'.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "ICMP (Internet Control Message Protocol) opera na camada de Internet para reportar erros e realizar diagnósticos. O 'ping' usa ICMP Echo Request/Reply; o 'traceroute' usa ICMP Time Exceeded.",
    explanationCorrect: "CERTO. ICMP é o protocolo de diagnóstico e controle de erros da camada de Internet. O comando 'ping' envia ICMP Echo Request e aguarda Echo Reply. O 'traceroute' usa ICMP TTL Exceeded para mapear o caminho dos pacotes.",
    explanationWrong: "ICMP não transporta dados de aplicação — é usado para mensagens de controle como: host unreachable, time exceeded, echo request/reply. Ataques como Ping of Death e Smurf exploram o ICMP.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_rs_c01_q06",
    contentId: "inf_rs_c01",
    statement: "Qual das afirmativas sobre o endereço IP 192.168.1.1 está correta?",
    alternatives: [
      { letter: "A", text: "É um endereço IPv6 da classe A." },
      { letter: "B", text: "É um endereço público, roteável pela Internet." },
      { letter: "C", text: "É um endereço privado da faixa 192.168.0.0/16, não roteável diretamente na Internet." },
      { letter: "D", text: "É um endereço de loopback reservado para testes locais." },
      { letter: "E", text: "É um endereço multicast reservado para transmissões em grupo." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Faixas de IP privado (RFC 1918): 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. O 192.168.1.1 está na faixa 192.168.0.0/16 — privado, usado em redes locais, não roteado na Internet.",
    explanationCorrect: "Alternativa C. 192.168.1.1 é um endereço IPv4 privado da faixa 192.168.0.0/16 (RFC 1918). Endereços privados não são roteáveis diretamente na Internet — requerem NAT para comunicação externa. São muito usados em roteadores domésticos.",
    explanationWrong: "Faixas IPv4 privadas (RFC 1918): 10.0.0.0–10.255.255.255 | 172.16.0.0–172.31.255.255 | 192.168.0.0–192.168.255.255. O loopback é 127.0.0.1. Multicast: 224.0.0.0–239.255.255.255.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 2 — DNS: Resolução de Nomes (inf_rs_c02)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "inf_rs_c02_q01",
    contentId: "inf_rs_c02",
    statement: "Julgue: O DNS (Domain Name System) converte endereços IP numéricos em nomes de domínio legíveis, como www.pf.gov.br, utilizando a porta 53.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "DNS traduz nomes de domínio para IPs (e vice-versa). Opera na porta 53, usando UDP para consultas rápidas e TCP para transferências de zona (respostas grandes). Sem DNS, seria necessário digitar IPs para acessar sites.",
    explanationCorrect: "CERTO. O DNS (Domain Name System) é o 'catálogo telefônico' da Internet — converte nomes legíveis (www.pf.gov.br) em endereços IP numéricos. Usa a porta 53 e opera via UDP para a maioria das consultas.",
    explanationWrong: "O DNS opera na porta 53. Usa UDP para consultas normais (resposta pequena) e TCP para transferências de zona entre servidores DNS (respostas maiores que 512 bytes).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_rs_c02_q02",
    contentId: "inf_rs_c02",
    statement: "Qual tipo de registro DNS mapeia um nome de domínio para um endereço IPv4?",
    alternatives: [
      { letter: "A", text: "Registro MX" },
      { letter: "B", text: "Registro CNAME" },
      { letter: "C", text: "Registro PTR" },
      { letter: "D", text: "Registro A" },
      { letter: "E", text: "Registro AAAA" },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "Tipos de registro DNS: A=IPv4, AAAA=IPv6, MX=servidor de e-mail, CNAME=apelido/alias, PTR=DNS reverso (IP→nome), NS=servidor de nomes autoritativo, TXT=texto.",
    explanationCorrect: "Alternativa D. O registro A (Address) mapeia um nome de domínio para um endereço IPv4. O registro AAAA mapeia para IPv6. O MX aponta para servidores de e-mail. O PTR faz o DNS reverso (IP→nome).",
    explanationWrong: "Registros DNS essenciais: A (IPv4) | AAAA (IPv6) | MX (e-mail) | CNAME (apelido) | PTR (reverso) | NS (nameserver) | TXT (texto, usado para SPF/DKIM). O registro A é o mais básico e cobrado.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_rs_c02_q03",
    contentId: "inf_rs_c02",
    statement: "Julgue: O ataque de DNS Spoofing (ou DNS Cache Poisoning) consiste em inserir registros DNS falsos no cache de um servidor, redirecionando usuários para sites maliciosos.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "DNS Spoofing/Cache Poisoning: o atacante injeta respostas DNS falsas no cache do servidor recursivo, fazendo com que usuários sejam redirecionados para IPs maliciosos ao tentar acessar sites legítimos.",
    explanationCorrect: "CERTO. O DNS Cache Poisoning corrupta o cache do servidor DNS recursivo com registros falsos. Quando um usuário resolve um domínio legítimo (ex: banco.com), recebe um IP malicioso. Contramédida: DNSSEC.",
    explanationWrong: "DNS Spoofing ≠ DNS DDoS. No Spoofing o objetivo é redirecionar silenciosamente. O DNS Amplification é um tipo de ataque DDoS usando reflexão DNS. O DNSSEC é a principal defesa contra Cache Poisoning.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_rs_c02_q04",
    contentId: "inf_rs_c02",
    statement: "Na hierarquia do DNS, qual é a ordem correta de resolução de um nome de domínio (da mais alta autoridade para a mais baixa)?",
    alternatives: [
      { letter: "A", text: "Servidor local → TLD → Raiz → Autoritativo" },
      { letter: "B", text: "Raiz (.) → TLD (.br, .com) → Domínio autoritativo → Subdomínio" },
      { letter: "C", text: "TLD → Raiz → Servidor local → Autoritativo" },
      { letter: "D", text: "Autoritativo → TLD → Raiz → Servidor local" },
      { letter: "E", text: "Subdomínio → Domínio → Raiz → TLD" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Hierarquia DNS: raiz (.) no topo → TLD (Top Level Domain: .com, .br, .gov) → domínio de segundo nível (pf.gov.br) → subdomínio (www.pf.gov.br). A resolução percorre essa hierarquia de cima para baixo.",
    explanationCorrect: "Alternativa B. A hierarquia DNS é: Raiz (.) → TLD (.br, .com, .gov) → Domínio autoritativo (pf.gov.br) → Subdomínio (www.pf.gov.br). A resolução começa pelos servidores raiz e vai descendo até o servidor autoritativo do domínio.",
    explanationWrong: "Pense em uma árvore invertida: raiz (.) → galhos principais (TLD: .com, .br) → galhos secundários (domínios: pf.gov.br) → folhas (subdomínios: www.pf.gov.br). Cada nível delega a autoridade para o próximo.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_rs_c02_q05",
    contentId: "inf_rs_c02",
    statement: "Julgue: O TTL (Time To Live) de um registro DNS indica por quanto tempo os resolvedores podem manter aquele registro em cache sem consultar novamente o servidor autoritativo.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "O TTL é um valor em segundos que define a validade do cache. TTL alto = menos consultas ao servidor autoritativo (melhor desempenho). TTL baixo = atualizações mais rápidas, útil em migrações de IP.",
    explanationCorrect: "CERTO. O TTL (Time To Live) dos registros DNS define o tempo máximo de cache. Se TTL=3600, o registro pode ser cacheado por 1 hora. TTL baixo é usado quando mudanças frequentes são necessárias; TTL alto melhora desempenho.",
    explanationWrong: "TTL alto: menos tráfego DNS, resposta mais rápida (cache), mas mudanças demoram a se propagar. TTL baixo: propagação rápida de alterações, mas mais consultas ao servidor autoritativo. Ambos têm trade-offs.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_rs_c02_q06",
    contentId: "inf_rs_c02",
    statement: "Qual recurso foi desenvolvido especificamente para adicionar autenticação e integridade às respostas DNS, mitigando ataques de envenenamento de cache?",
    alternatives: [
      { letter: "A", text: "DHCP Snooping" },
      { letter: "B", text: "DNS over HTTPS (DoH)" },
      { letter: "C", text: "DNSSEC" },
      { letter: "D", text: "SPF Record" },
      { letter: "E", text: "Anycast DNS" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "DNSSEC (DNS Security Extensions) adiciona assinaturas digitais às respostas DNS, permitindo aos resolvedores verificar a autenticidade e integridade dos registros. Mitigação direta do Cache Poisoning.",
    explanationCorrect: "Alternativa C. DNSSEC (DNS Security Extensions) usa criptografia de chave pública para assinar registros DNS. O resolvedor verifica a assinatura digital, detectando registros falsificados. É a principal defesa contra DNS Spoofing/Cache Poisoning.",
    explanationWrong: "DoH (DNS over HTTPS) criptografa a consulta DNS para privacidade, mas não assina os registros. DNSSEC assina os dados em si. SPF é para autenticação de e-mail. DHCP Snooping é segurança em switches para DHCP.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 3 — HTTP/HTTPS: Métodos, Códigos de Status e TLS (inf_rs_c03)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "inf_rs_c03_q01",
    contentId: "inf_rs_c03",
    statement: "Julgue: O método HTTP GET é utilizado para enviar dados ao servidor de forma que o corpo da requisição não fica visível na URL, sendo mais seguro que o POST para transmissão de senhas.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "GET envia parâmetros na URL (visíveis). POST envia no corpo da requisição (não visível na URL, mas não criptografado sem HTTPS). O correto é que POST é o método para envio de dados sensíveis — a questão inverteu GET e POST.",
    explanationCorrect: "ERRADO. A questão inverteu os conceitos: GET envia dados na URL (visível no histórico, logs, etc.). POST envia dados no corpo da requisição (não fica na URL). Para senhas, usa-se POST com HTTPS. GET é para recuperação de recursos.",
    explanationWrong: "GET: parâmetros na URL (ex: ?user=joao) — visível, cacheável, não usar para dados sensíveis. POST: dados no body da requisição — não na URL, não cacheado por padrão. Nenhum é seguro sem HTTPS.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_rs_c03_q02",
    contentId: "inf_rs_c03",
    statement: "Qual código de status HTTP indica que uma requisição foi processada com sucesso e que um novo recurso foi criado?",
    alternatives: [
      { letter: "A", text: "200 OK" },
      { letter: "B", text: "201 Created" },
      { letter: "C", text: "301 Moved Permanently" },
      { letter: "D", text: "404 Not Found" },
      { letter: "E", text: "500 Internal Server Error" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Códigos HTTP: 1xx=informacional, 2xx=sucesso (200=OK, 201=Created, 204=No Content), 3xx=redirecionamento (301=permanente, 302=temporário), 4xx=erro cliente (400, 401, 403, 404), 5xx=erro servidor (500, 503).",
    explanationCorrect: "Alternativa B — 201 Created. Indica que a requisição foi bem-sucedida e um novo recurso foi criado (comum em requisições POST que criam dados). O 200 OK é para requisições bem-sucedidas que retornam conteúdo existente.",
    explanationWrong: "Família de códigos: 2xx=sucesso: 200(OK), 201(Created), 204(No Content). 3xx=redirecionamento. 4xx=erro do cliente: 400(Bad Request), 401(Unauthorized), 403(Forbidden), 404(Not Found). 5xx=erro servidor: 500(Internal Error).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_rs_c03_q03",
    contentId: "inf_rs_c03",
    statement: "Julgue: O HTTPS utiliza o protocolo TLS (Transport Layer Security) para criptografar os dados transmitidos entre cliente e servidor, garantindo confidencialidade, integridade e autenticação.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "HTTPS = HTTP + TLS. O TLS (successor do SSL) fornece: (1) Confidencialidade — criptografia dos dados; (2) Integridade — HMAC detecta alterações; (3) Autenticação — certificados digitais X.509 verificam o servidor.",
    explanationCorrect: "CERTO. HTTPS é o HTTP transportado sobre TLS (antigamente SSL). O TLS garante: confidencialidade (criptografia assimétrica no handshake + simétrica nos dados), integridade (HMAC) e autenticação do servidor (certificados X.509).",
    explanationWrong: "TLS ≠ SSL: SSL foi deprecado por vulnerabilidades (SSLv2, SSLv3). TLS 1.2 e 1.3 são os padrões atuais. O certificado digital TLS é emitido por uma CA (Certificate Authority) e garante que você está falando com o servidor legítimo.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_rs_c03_q04",
    contentId: "inf_rs_c03",
    statement: "O código de status HTTP 403 indica:",
    alternatives: [
      { letter: "A", text: "O recurso não foi encontrado no servidor." },
      { letter: "B", text: "O servidor encontrou um erro interno e não processou a requisição." },
      { letter: "C", text: "O cliente não está autenticado e precisa fornecer credenciais." },
      { letter: "D", text: "O servidor entendeu a requisição, mas recusa executá-la — acesso proibido." },
      { letter: "E", text: "A requisição foi redirecionada permanentemente para outro endereço." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "401 Unauthorized = não autenticado (precisa de credenciais). 403 Forbidden = autenticado mas sem permissão (acesso proibido). 404 Not Found = recurso inexistente. 500 = erro interno do servidor.",
    explanationCorrect: "Alternativa D. 403 Forbidden: o servidor entendeu a requisição, o cliente pode estar autenticado, mas não tem permissão para acessar aquele recurso. Difere do 401 (não autenticado) e do 404 (recurso inexistente).",
    explanationWrong: "Atenção à diferença 401 vs 403: 401 = 'quem é você?' (falta autenticação). 403 = 'sei quem você é, mas pode não entrar' (falta autorização). 404 = recurso não existe. 500 = problema no servidor.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_rs_c03_q05",
    contentId: "inf_rs_c03",
    statement: "Julgue: O método HTTP DELETE é utilizado para solicitar a remoção de um recurso no servidor e, em uma API RESTful, segue o princípio de idempotência.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "DELETE é idempotente: executar múltiplas vezes o mesmo DELETE para o mesmo recurso produz o mesmo resultado (recurso inexistente). Métodos HTTP idempotentes: GET, PUT, DELETE, HEAD. POST não é idempotente.",
    explanationCorrect: "CERTO. O método DELETE remove o recurso indicado. É idempotente: após o primeiro DELETE bem-sucedido, repetir a operação retorna 404 (recurso já removido) — o estado do servidor é o mesmo. Em APIs REST: GET(leitura), POST(criar), PUT(atualizar/substituir), PATCH(atualizar parcial), DELETE(remover).",
    explanationWrong: "Idempotente = executar N vezes = executar 1 vez (mesmo efeito no estado). GET, PUT, DELETE são idempotentes. POST não é (cria novo recurso a cada chamada). PATCH pode ou não ser, dependendo da implementação.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_rs_c03_q06",
    contentId: "inf_rs_c03",
    statement: "No contexto de segurança web, o ataque MITM (Man-in-the-Middle) é mais difícil de executar quando o site usa HTTPS porque:",
    alternatives: [
      { letter: "A", text: "HTTPS bloqueia fisicamente a interceptação de pacotes na rede." },
      { letter: "B", text: "O certificado digital TLS permite ao cliente verificar a identidade do servidor, detectando intermediários não autorizados." },
      { letter: "C", text: "HTTPS usa UDP, que não pode ser interceptado como o TCP." },
      { letter: "D", text: "O endereço IP do servidor fica oculto com HTTPS, impedindo o roteamento malicioso." },
      { letter: "E", text: "HTTPS utiliza senhas de uso único que expiram antes de qualquer interceptação." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "No HTTPS, o certificado digital TLS do servidor é verificado pelo cliente (via CA confiável). Em um MITM, o atacante precisaria apresentar um certificado fraudulento, o que seria detectado pelo navegador (aviso de certificado inválido).",
    explanationCorrect: "Alternativa B. O certificado TLS vincula o domínio à chave pública do servidor legítimo. Para realizar MITM em HTTPS, o atacante precisaria apresentar um certificado válido para aquele domínio, o que exige comprometer uma CA. O navegador alerta sobre certificados inválidos.",
    explanationWrong: "HTTPS não impede a interceptação física dos pacotes — eles podem ser capturados. O que HTTPS impede é a LEITURA do conteúdo (criptografia) e a impersonação do servidor (certificado digital). O MITM pode ser feito se o usuário aceitar certificados inválidos.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 4 — Criptografia Simétrica, Assimétrica e Hash (inf_rs_c04)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "inf_rs_c04_q01",
    contentId: "inf_rs_c04",
    statement: "Julgue: Na criptografia simétrica, a mesma chave é usada para cifrar e decifrar os dados, sendo mais rápida que a assimétrica, porém com o desafio de distribuição segura da chave.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Criptografia simétrica (AES, DES, RC4): mesma chave para cifrar/decifrar. Vantagem: velocidade. Desvantagem: como compartilhar a chave com segurança? Assimétrica resolve o problema de distribuição de chaves.",
    explanationCorrect: "CERTO. Criptografia simétrica: uma chave única para cifrar e decifrar (AES, 3DES). É muito mais rápida que a assimétrica. O principal problema é o 'key distribution problem' — como entregar a chave secreta com segurança ao destinatário.",
    explanationWrong: "Simétrica: 1 chave (rápida, problema de distribuição). Assimétrica: par de chaves pública/privada (lenta, resolve distribuição). Na prática, o TLS/HTTPS usa assimétrica para trocar uma chave simétrica de sessão (melhor dos dois mundos).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_rs_c04_q02",
    contentId: "inf_rs_c04",
    statement: "Na criptografia assimétrica, para enviar uma mensagem confidencial para uma pessoa, deve-se cifrá-la com:",
    alternatives: [
      { letter: "A", text: "A chave privada do remetente." },
      { letter: "B", text: "A chave privada do destinatário." },
      { letter: "C", text: "A chave pública do destinatário." },
      { letter: "D", text: "A chave pública do remetente." },
      { letter: "E", text: "Qualquer chave, pois ambas são equivalentes." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Regra da criptografia assimétrica: cifrar com chave pública do destinatário → só a chave privada do destinatário decifra (confidencialidade). Assinar com chave privada do remetente → qualquer um com a chave pública verifica (autenticidade).",
    explanationCorrect: "Alternativa C. Para confidencialidade: cifra com a CHAVE PÚBLICA do destinatário → somente o destinatário (com sua chave privada) pode decifrar. Para assinatura digital: assina com a CHAVE PRIVADA do remetente → qualquer um verifica com a chave pública.",
    explanationWrong: "Dois usos da criptografia assimétrica: ① Confidencialidade: cifra com chave pública do destinatário (só ele decifra). ② Autenticidade: cifra com chave privada do remetente (todos verificam com sua chave pública = assinatura digital).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_rs_c04_q03",
    contentId: "inf_rs_c04",
    statement: "Julgue: Uma função hash criptográfica é reversível — dado o hash, é possível recuperar a mensagem original através de operações matemáticas inversas.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Funções hash são ONE-WAY (unidirecionais): dado H(m), é computacionalmente inviável calcular m. Propriedades: pré-imagem resistente, segundo pré-imagem resistente, resistente a colisão. Exemplos: MD5, SHA-1 (fracos), SHA-256 (forte).",
    explanationCorrect: "ERRADO. Funções hash criptográficas são irreversíveis por design (one-way function). Dado o hash H(m), é computacionalmente inviável descobrir m. É exatamente essa propriedade que as torna úteis para armazenar senhas e verificar integridade.",
    explanationWrong: "Hash ≠ criptografia reversível. Hash: m → H(m) (sem volta). Criptografia simétrica/assimétrica: mensagem ↔ cifrado (reversível com a chave). Hash é usado para integridade, assinatura digital e armazenamento seguro de senhas (com salt).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_rs_c04_q04",
    contentId: "inf_rs_c04",
    statement: "Qual algoritmo de criptografia simétrica é considerado o padrão atual do governo dos EUA (NIST) para proteção de dados, com chaves de 128, 192 ou 256 bits?",
    alternatives: [
      { letter: "A", text: "DES (Data Encryption Standard)" },
      { letter: "B", text: "RC4 (Rivest Cipher 4)" },
      { letter: "C", text: "MD5 (Message Digest 5)" },
      { letter: "D", text: "AES (Advanced Encryption Standard)" },
      { letter: "E", text: "RSA (Rivest–Shamir–Adleman)" },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "AES (Advanced Encryption Standard) — adotado em 2001 pelo NIST substituindo o DES. Usa chaves de 128/192/256 bits. DES (56 bits) e 3DES são obsoletos. RSA é assimétrico. MD5 é hash (não criptografia).",
    explanationCorrect: "Alternativa D. AES (Advanced Encryption Standard) é o padrão simétrico do NIST desde 2001, sucedendo o DES. Usa blocos de 128 bits com chaves de 128, 192 ou 256 bits. É amplamente usado em TLS, disco criptografado, Wi-Fi WPA2/3.",
    explanationWrong: "Criptografia simétrica (mesma chave): DES (obsoleto, 56 bits) → 3DES (obsoleto) → AES (atual, 128-256 bits). RSA é assimétrica. MD5/SHA são funções hash, não cifradores. RC4 é stream cipher (vulnerabilidades descobertas).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_rs_c04_q05",
    contentId: "inf_rs_c04",
    statement: "Julgue: A assinatura digital de um documento é criada cifrando o HASH do documento com a chave PRIVADA do signatário, e verificada com a chave PÚBLICA do signatário.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Processo de assinatura digital: (1) Calcular hash do documento; (2) Cifrar o hash com a chave privada do signatário = assinatura. Verificação: decifrar a assinatura com a chave pública do signatário e comparar com o hash recalculado.",
    explanationCorrect: "CERTO. A assinatura digital garante autenticidade e não-repúdio. Processo: hash(doc) → cifra com chave privada → assinatura. Verificação: decifra com chave pública → compara hash. Se iguais, documento íntegro e assinado pelo titular da chave privada.",
    explanationWrong: "A assinatura digital NÃO cifra o documento inteiro (seria lento). Cifra apenas o hash (resumo). Isso garante: integridade (hash verificado), autenticidade (chave privada única do signatário) e não-repúdio (só o dono da chave privada pode assinar).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_rs_c04_q06",
    contentId: "inf_rs_c04",
    statement: "No contexto de segurança da informação, o que é um 'ataque de colisão' em funções hash?",
    alternatives: [
      { letter: "A", text: "Um ataque que tenta decifrar uma mensagem cifrada usando força bruta." },
      { letter: "B", text: "Um ataque onde o invasor encontra duas mensagens distintas que produzem o mesmo valor hash." },
      { letter: "C", text: "Um ataque que intercepta comunicações criptografadas em trânsito." },
      { letter: "D", text: "Um ataque que sobrecarrega o servidor hash com múltiplas requisições." },
      { letter: "E", text: "Um ataque que recupera a mensagem original a partir do hash (inversão)." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Ataque de colisão: encontrar m1 ≠ m2 tal que H(m1) = H(m2). O MD5 e SHA-1 têm colisões conhecidas — são considerados inseguros para assinatura digital. SHA-256 ainda é resistente a colisão.",
    explanationCorrect: "Alternativa B. Ataque de colisão: encontrar dois documentos distintos com o mesmo hash. Isso permite substituir um documento assinado por outro sem invalidar a assinatura. Foi demonstrado para MD5 e SHA-1, tornando-os inadequados para assinatura digital.",
    explanationWrong: "Tipos de ataque a hash: Colisão (H(m1)=H(m2), m1≠m2) | Pré-imagem (dado H(m), achar m) | Segunda pré-imagem (dado m1, achar m2 com H(m1)=H(m2)). MD5 e SHA-1 foram quebrados para colisão. Use SHA-256 ou SHA-3.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 5 — Malwares (inf_rs_c05)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "inf_rs_c05_q01",
    contentId: "inf_rs_c05",
    statement: "Julgue: Um vírus de computador, ao contrário de um worm, precisa se anexar a um arquivo ou programa hospedeiro para se propagar, não conseguindo se replicar de forma autônoma.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Vírus: precisa de hospedeiro (arquivo executável, macro, setor de boot) e da execução pelo usuário para se propagar. Worm: se propaga autonomamente pela rede, sem hospedeiro, explorando vulnerabilidades.",
    explanationCorrect: "CERTO. A distinção fundamental: Vírus = parasita (necessita de hospedeiro + ação do usuário). Worm = autônomo (se propaga sozinho pela rede, sem intervenção humana). Exemplos de worms famosos: Slammer, Conficker, WannaCry (componente worm).",
    explanationWrong: "Vírus: infecta arquivos, propaga-se via cópia/execução do hospedeiro. Worm: se replica pela rede explorando vulnerabilidades (ex: porta aberta, serviço vulnerável), sem precisar de hospedeiro nem ação do usuário.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_rs_c05_q02",
    contentId: "inf_rs_c05",
    statement: "O Ransomware é classificado como um tipo de malware que:",
    alternatives: [
      { letter: "A", text: "Captura silenciosamente as teclas digitadas pelo usuário." },
      { letter: "B", text: "Cria uma botnet para realizar ataques DDoS coordenados." },
      { letter: "C", text: "Criptografa arquivos da vítima e exige resgate financeiro para fornecer a chave de decriptação." },
      { letter: "D", text: "Se disfarça de software legítimo para instalar backdoors." },
      { letter: "E", text: "Monitora o tráfego de rede para interceptar credenciais." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Ransomware: encrypta arquivos/disco da vítima e exige pagamento (geralmente em criptomoeda) para fornecer a chave. Exemplos: WannaCry (2017), NotPetya, LockBit. A captura de teclas é keylogger; disfarçar de legítimo é Trojan.",
    explanationCorrect: "Alternativa C. Ransomware é extorsão digital: criptografa dados da vítima e exige resgate. WannaCry (2017) afetou hospitais e empresas em 150 países. Prevenção: backup offline, patches atualizados, segmentação de rede.",
    explanationWrong: "Tipos de malware: Ransomware=extorsão/criptografia | Keylogger=captura teclas | Trojan=disfarce | Botnet=rede de zumbis para DDoS/spam | Spyware=espionagem | Adware=propagandas. Cada um tem objetivo distinto.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_rs_c05_q03",
    contentId: "inf_rs_c05",
    statement: "Julgue: Um Trojan (Cavalo de Tróia) se diferencia de um vírus comum por se replicar automaticamente e infectar outros arquivos do sistema sem necessidade de ação do usuário.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Trojan NÃO se replica. A característica do Trojan é DISFARÇAR-SE de software legítimo para enganar o usuário a executá-lo, instalando backdoors ou malware adicional. A auto-replicação é característica de vírus/worm.",
    explanationCorrect: "ERRADO. A característica distintiva do Trojan é o disfarce — se apresenta como software legítimo (jogo, antivírus falso, utilitário). Quando executado, realiza ações maliciosas (backdoor, download de malware, roubo de dados). NÃO se replica automaticamente.",
    explanationWrong: "Trojan: engana o usuário para ser executado voluntariamente; não se replica. Vírus: se anexa a arquivos e se replica quando o hospedeiro é executado. Worm: se replica autonomamente pela rede. RAT (Remote Access Trojan) é um subtipo de Trojan.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_rs_c05_q04",
    contentId: "inf_rs_c05",
    statement: "Em um inquérito sobre crime cibernético, identificou-se que o suspeito utilizava um software que registrava todas as teclas digitadas na máquina da vítima e enviava as informações a um servidor remoto. Esse software é classificado como:",
    alternatives: [
      { letter: "A", text: "Rootkit" },
      { letter: "B", text: "Adware" },
      { letter: "C", text: "Spyware do tipo Keylogger" },
      { letter: "D", text: "Ransomware" },
      { letter: "E", text: "Backdoor" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Keylogger é um tipo de Spyware que monitora e registra as teclas digitadas. Usado para capturar senhas, dados bancários e mensagens. Rootkit oculta malware no SO; Adware exibe propaganda; Backdoor abre acesso remoto.",
    explanationCorrect: "Alternativa C. Software que registra teclas digitadas = Keylogger, subcategoria do Spyware (software espião). Envia dados capturados (senhas, PINs, mensagens) a um C&C remoto. Evidência digital forense: logs de comunicação com o servidor C&C.",
    explanationWrong: "Spyware = espiona o usuário. Subtipos: Keylogger (teclas), Screenlogger (capturas de tela), Formgrabber (dados de formulários web). Diferente de Rootkit (oculta malware no kernel), Backdoor (acesso remoto) e Adware (propaganda).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_rs_c05_q05",
    contentId: "inf_rs_c05",
    statement: "Julgue: Um Rootkit é um conjunto de ferramentas maliciosas projetadas para ocultar a presença de outros malwares no sistema operacional, dificultando sua detecção por antivírus e ferramentas de diagnóstico.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Rootkit: opera em nível de kernel (ring 0) ou modo usuário para interceptar chamadas de sistema e ocultar arquivos, processos e conexões de rede maliciosas. Extremamente difícil de remover — frequentemente requer reinstalação do SO.",
    explanationCorrect: "CERTO. Rootkit é uma das ameaças mais sofisticadas: oculta-se no sistema operacional (nível kernel) e esconde outros malwares, processos, arquivos e conexões de rede. A detecção requer ferramentas especializadas que operam fora do SO infectado.",
    explanationWrong: "Rootkit não realiza o ataque diretamente — cria persistência e stealth para outros malwares. Detectá-lo é difícil pois ele subverte as próprias ferramentas do SO. Solução: boot por mídia externa e scan offline (o rootkit não carrega).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_rs_c05_q06",
    contentId: "inf_rs_c05",
    statement: "Qual das seguintes afirmativas descreve corretamente uma BOTNET?",
    alternatives: [
      { letter: "A", text: "Software que exibe propagandas indesejadas no navegador do usuário." },
      { letter: "B", text: "Conjunto de computadores infectados e controlados remotamente por um atacante para realizar ações coordenadas, como ataques DDoS e envio de spam." },
      { letter: "C", text: "Tipo de malware que criptografa os dados da vítima e exige resgate." },
      { letter: "D", text: "Programa que simula ser software legítimo para instalar backdoors." },
      { letter: "E", text: "Ferramenta que intercepta e registra o tráfego de rede em texto claro." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Botnet (robot network): computadores zumbi infectados e controlados por um bot-herder via servidor C&C (Command and Control). Usos: DDoS, spam em massa, mineração de criptomoeda, distribuição de malware.",
    explanationCorrect: "Alternativa B. Botnet é uma rede de dispositivos comprometidos (zumbis/bots) controlados por um atacante via C&C. Podem incluir PCs, roteadores, câmeras IoT. Usos maliciosos: DDoS (volumétrico), spam, mineração de criptomoeda, roubo de dados.",
    explanationWrong: "Botnet ≠ Ransomware ≠ Trojan: Botnet = rede de zumbis para ações coordenadas. Ransomware = extorsão por criptografia. Trojan = disfarce. Adware = propaganda. Sniffer = interceptação de rede. Cada malware tem propósito e mecanismo distintos.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁTOMO 6 — Firewall, DMZ, IDS e IPS (inf_rs_c06)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "inf_rs_c06_q01",
    contentId: "inf_rs_c06",
    statement: "Julgue: Um firewall de pacotes (packet filtering) inspeciona cada pacote individualmente baseando-se em regras de IP de origem/destino, porta e protocolo, sem considerar o estado da conexão.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Firewall de filtragem de pacotes: opera na camada de rede/transporte, analisa cabeçalhos (IP de origem/destino, porta, protocolo TCP/UDP) sem manter estado da conexão. É simples e rápido, mas menos inteligente que o stateful.",
    explanationCorrect: "CERTO. O packet filtering (filtragem de pacotes) analisa cada pacote isoladamente, sem contexto da sessão. Opera com regras: porta 80 TCP permitida, IP X bloqueado. É o tipo mais básico de firewall — o stateful é mais avançado.",
    explanationWrong: "Gerações de firewall: ① Packet Filtering (sem estado) ② Stateful Inspection (mantém tabela de conexões ativas) ③ Application Layer / Next-Generation (inspeção profunda de conteúdo). Cada geração é mais sofisticada que a anterior.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_rs_c06_q02",
    contentId: "inf_rs_c06",
    statement: "A DMZ (Demilitarized Zone) em segurança de redes tem como objetivo:",
    alternatives: [
      { letter: "A", text: "Bloquear todo o tráfego externo, isolando completamente a rede interna da Internet." },
      { letter: "B", text: "Criar uma zona intermediária que abriga servidores públicos (web, e-mail, DNS), separando-os da rede interna corporativa." },
      { letter: "C", text: "Substituir o firewall, eliminando a necessidade de equipamentos de segurança adicionais." },
      { letter: "D", text: "Criptografar todo o tráfego entre a Internet e a rede interna." },
      { letter: "E", text: "Detectar e bloquear automaticamente ataques em tempo real." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "DMZ é uma zona de rede neutra entre a Internet e a rede interna. Servidores acessíveis publicamente (web, e-mail, DNS) ficam na DMZ. Se comprometidos, o atacante ainda é isolado da rede interna por um segundo firewall.",
    explanationCorrect: "Alternativa B. A DMZ (Demilitarized Zone) é uma sub-rede intermediária protegida por dois firewalls: um externo (Internet↔DMZ) e um interno (DMZ↔rede corporativa). Servidores públicos ficam na DMZ — se invadidos, não acessam diretamente a rede interna.",
    explanationWrong: "Arquitetura DMZ: Internet → [Firewall externo] → DMZ (servidores web/e-mail/DNS) → [Firewall interno] → Rede interna (dados sensíveis). A DMZ aumenta a segurança por profundidade (defense in depth), não elimina o firewall.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_rs_c06_q03",
    contentId: "inf_rs_c06",
    statement: "Julgue: A principal diferença entre IDS e IPS é que o IDS detecta e reporta atividades suspeitas sem bloqueá-las, enquanto o IPS detecta E automaticamente bloqueia ou previne ataques em tempo real.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "IDS (Intrusion Detection System): detecta e alerta — passivo. IPS (Intrusion Prevention System): detecta e age — ativo (descarta pacotes, bloqueia IPs, encerra sessões). IPS fica inline no tráfego; IDS recebe uma cópia.",
    explanationCorrect: "CERTO. IDS = passivo (sensor + alertas). IPS = ativo (fica inline e bloqueia). Analogia: IDS é o alarme do carro (avisa mas não age); IPS é o bloqueio automático do motor (impede o movimento). O IPS pode gerar falsos positivos que bloqueiam tráfego legítimo.",
    explanationWrong: "IDS (Intrusion Detection System): monitora, detecta, registra, alerta. Não interfere no tráfego. IPS (Intrusion Prevention System): monitora, detecta E BLOQUEIA em tempo real. Fica em linha (inline) no fluxo de dados.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_rs_c06_q04",
    contentId: "inf_rs_c06",
    statement: "Um IDS baseado em anomalias (anomaly-based IDS) detecta intrusões ao:",
    alternatives: [
      { letter: "A", text: "Comparar o tráfego com uma base de assinaturas de ataques conhecidos." },
      { letter: "B", text: "Estabelecer uma linha de base do comportamento normal da rede e alertar quando há desvios significativos." },
      { letter: "C", text: "Bloquear automaticamente todo tráfego não reconhecido." },
      { letter: "D", text: "Inspecionar o conteúdo dos arquivos em busca de código malicioso." },
      { letter: "E", text: "Monitorar apenas o tráfego de entrada, ignorando o tráfego de saída." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "IDS baseado em anomalias: aprende o comportamento normal (baseline) e detecta desvios estatísticos. Vantagem: detecta ataques zero-day. Desvantagem: mais falsos positivos. IDS baseado em assinaturas: compara com padrões de ataques conhecidos.",
    explanationCorrect: "Alternativa B. IDS por anomalia (behavior-based): cria perfil do tráfego/comportamento normal e alerta sobre desvios. Detecta ataques novos (zero-day) que não têm assinatura. IDS por assinatura: eficaz para ataques conhecidos, ineficaz para novos ataques.",
    explanationWrong: "Dois tipos de IDS: ① Por assinatura (signature-based): compara com padrões de ataques conhecidos — preciso para ataques conhecidos, cego para zero-day. ② Por anomalia (anomaly-based): detecta desvios do normal — detecta zero-day, gera mais falsos positivos.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "inf_rs_c06_q05",
    contentId: "inf_rs_c06",
    statement: "Julgue: Um firewall do tipo 'stateful inspection' mantém uma tabela de conexões ativas e verifica se os pacotes de retorno pertencem a uma sessão legítima previamente estabelecida.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Stateful firewall: rastreia o estado das conexões TCP/UDP em uma tabela de estado. Pacotes de resposta são automaticamente permitidos se a conexão foi iniciada internamente. O packet filtering simples não faz isso — analisa cada pacote independentemente.",
    explanationCorrect: "CERTO. O stateful inspection (inspeção com estado) é mais inteligente que o packet filtering simples. Mantém tabela de sessões: IP origem, IP destino, portas, estado (SYN_SENT, ESTABLISHED). Pacotes de retorno são validados contra essa tabela.",
    explanationWrong: "Stateful vs Stateless: Stateful (com estado) = conhece o contexto da conexão, permite retornos de sessões legítimas automaticamente. Stateless (sem estado) = analisa cada pacote isoladamente, sem saber se faz parte de uma sessão estabelecida.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "inf_rs_c06_q06",
    contentId: "inf_rs_c06",
    statement: "No contexto de segurança perimetral, o conceito de 'defense in depth' (defesa em profundidade) preconiza:",
    alternatives: [
      { letter: "A", text: "Concentrar todos os recursos de segurança em uma única camada de proteção extremamente robusta." },
      { letter: "B", text: "Implementar múltiplas camadas independentes de segurança, de modo que a falha de uma não comprometa toda a proteção." },
      { letter: "C", text: "Utilizar exclusivamente criptografia como mecanismo de proteção da rede." },
      { letter: "D", text: "Criar apenas um firewall externo de alta capacidade na fronteira da rede." },
      { letter: "E", text: "Manter todos os servidores na DMZ para facilitar o monitoramento centralizado." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Defense in Depth: múltiplas camadas de segurança (firewall externo, DMZ, firewall interno, IPS, WAF, EDR, segmentação de VLAN, criptografia) de forma que um atacante precise superar várias barreiras independentes.",
    explanationCorrect: "Alternativa B. Defense in Depth é um princípio fundamental de segurança: múltiplas camadas sobrepostas. Exemplo: firewall perimetral + DMZ + firewall interno + IPS + EDR nos endpoints + segmentação VLAN + criptografia + autenticação MFA. A falha de uma camada não compromete o todo.",
    explanationWrong: "A alternativa A descreve o oposto — ponto único de falha. Defense in Depth é redundância estratégica: se o atacante passar pelo firewall externo, ainda encontra a DMZ; se comprometer a DMZ, ainda há o firewall interno; e assim por diante.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
];

// ─── MAIN ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🚀 Seed R56 — Densificação: Informática — Redes e Segurança (inf_rs_c01–c06)\n");

  const atomIds = ["inf_rs_c01", "inf_rs_c02", "inf_rs_c03", "inf_rs_c04", "inf_rs_c05", "inf_rs_c06"];
  const foundAtoms = new Set<string>();

  for (const atomId of atomIds) {
    const rows = await db.execute(sql`SELECT id FROM "Content" WHERE id = ${atomId} LIMIT 1`) as any[];
    if (rows.length === 0) {
      console.warn(`  ⚠️  AVISO: Átomo NÃO encontrado: ${atomId} — execute seed-info-redes-r15.ts primeiro`);
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
