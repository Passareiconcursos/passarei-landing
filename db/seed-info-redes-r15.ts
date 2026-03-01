/**
 * Seed R15: Informática — Redes de Computadores e Segurança da Informação
 *
 * Cobre: Modelo TCP/IP, DNS, HTTP/HTTPS, Criptografia Simétrica/Assimétrica,
 * Malwares e Firewall/IDS/IPS.
 *
 * Grupo A: contentIdMap com vínculo total (sem roleta russa).
 * Popula 6 átomos de Conteúdo + 12 Questões estilo CEBRASPE (CERTO/ERRADO).
 * Idempotente: verifica existência antes de inserir.
 *
 * FILTRO ANTI-ALUCINAÇÃO:
 * — Portas, algoritmos e protocolos: apenas os citados no textContent
 * — Sem CVEs específicos, sem nomes de fabricantes inventados
 * — Baseado em RFC e documentação oficial
 *
 * Execução:
 *   npx tsx db/seed-info-redes-r15.ts
 */

import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

// ============================================
// HELPERS
// ============================================

function nanoId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

async function findSubject(name: string): Promise<string | null> {
  const rows = (await db.execute(sql`
    SELECT id FROM "Subject" WHERE name ILIKE ${"%" + name + "%"} LIMIT 1
  `)) as any[];
  return rows[0]?.id ?? null;
}

async function findOrCreateTopic(name: string, subjectId: string): Promise<string> {
  const rows = (await db.execute(sql`
    SELECT id FROM "Topic" WHERE name ILIKE ${name} AND "subjectId" = ${subjectId} LIMIT 1
  `)) as any[];
  if (rows[0]?.id) return rows[0].id;

  const id = nanoId("tp");
  await db.execute(sql`
    INSERT INTO "Topic" (id, name, "subjectId", "createdAt", "updatedAt")
    VALUES (${id}, ${name}, ${subjectId}, NOW(), NOW())
  `);
  console.log(`  ✅ Tópico criado: ${name} (${id})`);
  return id;
}

async function contentExists(title: string, subjectId: string): Promise<boolean> {
  const rows = (await db.execute(sql`
    SELECT id FROM "Content" WHERE title = ${title} AND "subjectId" = ${subjectId} LIMIT 1
  `)) as any[];
  return rows.length > 0;
}

async function questionExists(id: string): Promise<boolean> {
  const rows = (await db.execute(sql`
    SELECT id FROM "Question" WHERE id = ${id} LIMIT 1
  `)) as any[];
  return rows.length > 0;
}

function getCorrectAnswer(
  alternatives: Array<{ letter: string; text: string }>,
  correctOption: number,
): string {
  return alternatives[correctOption]?.letter ?? ["A", "B", "C", "D", "E"][correctOption] ?? "A";
}

// ============================================
// CONTEÚDOS (6 átomos)
// ============================================

interface ContentAtom {
  id: string;
  title: string;
  textContent: string;
  mnemonic: string;
  keyPoint: string;
  practicalExample: string;
  difficulty: string;
}

const contents: ContentAtom[] = [
  {
    id: "inf_rs_c01",
    title: "Modelo TCP/IP: Camadas, Portas e Protocolos de Transporte",
    textContent: `O modelo TCP/IP organiza a comunicação em rede em quatro camadas e define protocolos específicos para cada função.

CAMADAS DO MODELO TCP/IP:
• Acesso à Rede (Link): transmissão física de bits (Ethernet, Wi-Fi)
• Internet: endereçamento e roteamento (IP, ICMP, ARP)
• Transporte: entrega de dados entre processos (TCP, UDP)
• Aplicação: interface com o usuário (HTTP, DNS, FTP, SMTP)

TCP (Transmission Control Protocol):
• Orientado à conexão: estabelece sessão com three-way handshake (SYN → SYN-ACK → ACK)
• Confiável: confirmações (ACK), retransmissão em caso de perda, controle de fluxo
• Usado em: HTTP/HTTPS, SMTP, FTP, SSH

UDP (User Datagram Protocol):
• Sem conexão: não há handshake, não há confirmação
• Não confiável: sem garantia de entrega ou ordem
• Vantagem: baixa latência — usado em streaming, jogos, DNS, VoIP

PORTAS CONHECIDAS (0–1023):
┌──────┬─────────────────────────────────────────────┐
│ Porta│ Protocolo                                   │
├──────┼─────────────────────────────────────────────┤
│   20 │ FTP (dados)                                 │
│   21 │ FTP (controle)                              │
│   22 │ SSH                                         │
│   25 │ SMTP (envio de e-mail)                      │
│   53 │ DNS (UDP e TCP)                             │
│   80 │ HTTP                                        │
│  110 │ POP3                                        │
│  143 │ IMAP                                        │
│  443 │ HTTPS                                       │
└──────┴─────────────────────────────────────────────┘

DICA BANCA (CEBRASPE):
SMTP usa porta 25 (não 80). DNS usa UDP na porta 53 (e TCP para transferências de zona). HTTP usa porta 80; HTTPS usa 443.`,
    mnemonic: "TCP=confiável+handshake. UDP=rápido+sem garantia. Portas: SMTP=25, DNS=53, HTTP=80, HTTPS=443, SSH=22, FTP=21.",
    keyPoint: "TCP: orientado à conexão, confiável, three-way handshake. UDP: sem conexão, rápido, sem garantia. SMTP porta 25, DNS porta 53.",
    practicalExample: "Download de arquivo: usa TCP (integridade obrigatória). Chamada de vídeo: usa UDP (velocidade > integridade). E-mail enviado via SMTP na porta 25.",
    difficulty: "MEDIO",
  },
  {
    id: "inf_rs_c02",
    title: "DNS: Resolução de Nomes de Domínio e Tipos de Registros",
    textContent: `O DNS (Domain Name System) é o sistema que traduz nomes de domínio (ex: www.gov.br) em endereços IP.

FUNCIONAMENTO DA RESOLUÇÃO DNS:
1. Cliente consulta o servidor DNS recursivo (resolver) configurado no sistema
2. O resolver consulta os servidores raiz (root servers)
3. Os servidores raiz indicam o servidor TLD (ex: .br, .com)
4. O servidor TLD indica o servidor autoritativo do domínio
5. O servidor autoritativo responde com o endereço IP

TIPOS DE RESOLUÇÃO:
• Recursiva: o resolver busca a resposta completa em nome do cliente (servidor trabalha pelo cliente)
• Iterativa: o servidor indica o próximo servidor a consultar (cliente faz as consultas)

TIPOS DE REGISTROS DNS:
┌────────┬──────────────────────────────────────────────────┐
│ Tipo   │ Função                                           │
├────────┼──────────────────────────────────────────────────┤
│ A      │ Mapeia nome → endereço IPv4                      │
│ AAAA   │ Mapeia nome → endereço IPv6                      │
│ MX     │ Servidor de e-mail do domínio                    │
│ CNAME  │ Alias (apelido) para outro nome                  │
│ NS     │ Servidor de nomes autoritativo do domínio        │
│ PTR    │ Resolução reversa (IP → nome)                    │
│ TXT    │ Texto livre (usado em SPF, DKIM, verificações)   │
└────────┴──────────────────────────────────────────────────┘

PORTA: DNS usa UDP porta 53 (padrão); TCP porta 53 para transferências de zona (AXFR).

DICA BANCA:
Registro MX NÃO mapeia nome para IP — ele indica o servidor de e-mail. Quem mapeia nome para IPv4 é o registro A; para IPv6, é o AAAA.`,
    mnemonic: "DNS registros: A=IPv4, AAAA=IPv6, MX=e-mail, CNAME=alias, NS=nameserver, PTR=reverso. Porta 53 UDP (e TCP para zona).",
    keyPoint: "Registro A: nome → IPv4. AAAA: nome → IPv6. MX: servidor de e-mail (não IP). DNS porta 53 UDP. Resolução recursiva: servidor trabalha pelo cliente.",
    practicalExample: "Ao acessar 'www.passarei.com.br': DNS recursivo consulta raiz → TLD .br → servidor autoritativo → retorna IP via registro A. Para enviar e-mail, o servidor consulta o registro MX do domínio destinatário.",
    difficulty: "MEDIO",
  },
  {
    id: "inf_rs_c03",
    title: "HTTP/HTTPS: Métodos, Códigos de Status e Protocolo TLS",
    textContent: `O HTTP (HyperText Transfer Protocol) é o protocolo da web. O HTTPS adiciona segurança via TLS.

MÉTODOS HTTP:
• GET: solicita recurso (somente leitura, idempotente)
• POST: envia dados para criação/processamento (não idempotente)
• PUT: substitui recurso completamente (idempotente)
• PATCH: atualiza parcialmente um recurso
• DELETE: remove recurso (idempotente)
• HEAD: como GET, mas retorna apenas cabeçalhos (sem corpo)
• OPTIONS: lista métodos suportados pelo servidor

CÓDIGOS DE STATUS HTTP:
┌──────┬────────────────────────────────────────────┐
│ Código│ Significado                               │
├──────┼────────────────────────────────────────────┤
│ 200  │ OK — requisição bem-sucedida               │
│ 201  │ Created — recurso criado com sucesso       │
│ 301  │ Moved Permanently — redirecionamento perm. │
│ 302  │ Found — redirecionamento temporário        │
│ 400  │ Bad Request — requisição malformada        │
│ 401  │ Unauthorized — não autenticado             │
│ 403  │ Forbidden — autenticado mas sem permissão  │
│ 404  │ Not Found — recurso não encontrado         │
│ 500  │ Internal Server Error — erro no servidor   │
└──────┴────────────────────────────────────────────┘

DISTINÇÃO CRÍTICA: 401 vs 403
• 401 (Unauthorized): o cliente NÃO está autenticado — precisa fazer login
• 403 (Forbidden): o cliente está autenticado mas NÃO tem permissão

HTTPS E TLS:
• TLS (Transport Layer Security) é o protocolo que protege o HTTP
• Garante: confidencialidade (criptografia), integridade (MAC) e autenticação (certificados)
• Certificados digitais emitidos por Autoridades Certificadoras (CA) verificam a identidade do servidor
• HTTPS usa porta 443`,
    mnemonic: "HTTP métodos: GET=ler, POST=criar, PUT=substituir, DELETE=remover. Códigos: 401=não autenticado; 403=sem permissão; 404=não encontrado. HTTPS=HTTP+TLS (porta 443).",
    keyPoint: "401: não autenticado (faça login). 403: autenticado mas sem permissão (acesso negado). HTTPS: TLS garante confidencialidade + integridade + autenticação. Porta HTTPS: 443.",
    practicalExample: "Usuário acessa página protegida sem fazer login → HTTP 401. Usuário logado tenta acessar área de admin sem permissão → HTTP 403. Site com cadeado no navegador → HTTPS/TLS ativo.",
    difficulty: "MEDIO",
  },
  {
    id: "inf_rs_c04",
    title: "Criptografia Simétrica, Assimétrica e Funções Hash",
    textContent: `A criptografia protege a confidencialidade, integridade e autenticidade das informações.

CRIPTOGRAFIA SIMÉTRICA:
• Mesma chave para cifrar e decifrar
• Rápida e eficiente para grandes volumes de dados
• Principais algoritmos: AES (padrão atual), DES (obsoleto), 3DES (obsoleto)
• Problema: distribuição segura da chave compartilhada

CRIPTOGRAFIA ASSIMÉTRICA (de Chave Pública):
• Par de chaves: chave PÚBLICA (compartilhada) e chave PRIVADA (secreta)
• Mensagem cifrada com chave pública → só a chave privada correspondente decifra (confidencialidade)
• Mensagem cifrada com chave privada → qualquer um com a chave pública pode verificar (assinatura digital)
• Algoritmos: RSA, ECC (Elliptic Curve Cryptography)
• Mais lenta que a simétrica — usada para troca de chaves e assinaturas

ASSINATURA DIGITAL:
• Processo: remetente gera hash da mensagem → cifra o hash com sua chave PRIVADA
• Verificação: destinatário decifra o hash com a chave PÚBLICA do remetente → compara com hash da mensagem
• Garante: autenticidade (origem), integridade (não foi alterada) e não-repúdio

FUNÇÕES HASH:
• Transformam qualquer entrada em saída de tamanho fixo (digest)
• Unidirecionais: impossível obter a entrada a partir do hash
• SHA-256: produz hash de 256 bits — seguro e amplamente usado
• MD5: produz hash de 128 bits — INSEGURO (vulnerável a colisões), NÃO recomendado
• Uso: integridade de arquivos, senhas (com salt), assinaturas digitais

INFRAESTRUTURA DE CHAVE PÚBLICA (PKI):
• Autoridade Certificadora (CA): emite e assina certificados digitais
• Certificado digital: associa chave pública à identidade do titular`,
    mnemonic: "SIMÉTRICA: 1 chave, rápida (AES). ASSIMÉTRICA: 2 chaves pub/priv, lenta (RSA). HASH: unidirecional, integridade (SHA-256=seguro; MD5=inseguro). Assinatura: chave PRIVADA cifra, PÚBLICA verifica.",
    keyPoint: "Simétrica: mesma chave (AES). Assimétrica: chave pública cifra para confidencialidade; chave privada cifra para assinatura. SHA-256: 256 bits, seguro. MD5: 128 bits, inseguro.",
    practicalExample: "HTTPS: usa assimétrica (RSA) para trocar chave de sessão, depois simétrica (AES) para o tráfego. Download de software: site publica hash SHA-256 para verificar integridade do arquivo.",
    difficulty: "MEDIO",
  },
  {
    id: "inf_rs_c05",
    title: "Malwares: Vírus, Worm, Trojan, Ransomware e Spyware",
    textContent: `Malware (malicious software) é todo software desenvolvido para causar danos, roubar dados ou comprometer sistemas.

PRINCIPAIS CATEGORIAS:

VÍRUS:
• Precisa de um programa HOSPEDEIRO para se propagar (anexa-se a arquivos executáveis, documentos)
• Depende da ação do usuário para se disseminar (abrir o arquivo infectado)
• Pode danificar dados, corromper o sistema operacional

WORM (Verme):
• Propaga-se AUTONOMAMENTE pela rede, sem necessidade de hospedeiro
• Explora vulnerabilidades de sistemas e serviços para se disseminar
• Consome largura de banda e recursos do sistema
• Diferença-chave do vírus: NÃO precisa de arquivo hospedeiro nem de ação do usuário

TROJAN (Cavalo de Troia):
• Disfarçado de software legítimo ou útil
• Não se replica automaticamente (diferente do vírus e worm)
• Abre backdoor para acesso remoto do atacante (RAT — Remote Access Trojan)

RANSOMWARE:
• Cifra os arquivos da vítima usando criptografia assimétrica
• Exige pagamento de resgate (geralmente em criptomoeda) para fornecer a chave de decriptação
• Exemplo notório: WannaCry (2017), que explorava vulnerabilidade no protocolo SMB

SPYWARE:
• Coleta informações sobre o usuário sem seu consentimento
• Variante Keylogger: registra teclas digitadas para capturar senhas e dados

ROOTKIT:
• Oculta a presença de malware no sistema, modificando o próprio SO
• Dificulta detecção por antivírus tradicionais

PHISHING:
• Engenharia social via e-mail/mensagem falsa para obter credenciais
• Spear phishing: ataque direcionado a pessoa ou organização específica`,
    mnemonic: "VÍRUS=hospedeiro+usuário. WORM=autônomo+rede. TROJAN=disfarçado+backdoor. RANSOMWARE=cifra+resgate. SPYWARE=coleta dados silencioso. ROOTKIT=oculta malware.",
    keyPoint: "Vírus: precisa de hospedeiro e ação do usuário. Worm: autônomo, sem hospedeiro. Trojan: não se replica, abre backdoor. Ransomware: cifra arquivos e exige resgate. Spyware: coleta dados silenciosamente.",
    practicalExample: "Funcionário abre e-mail com anexo infectado → executa vírus. Servidor sem patch de segurança é automaticamente comprometido via rede → worm. Arquivos criptografados com pedido de resgate em Bitcoin → ransomware.",
    difficulty: "MEDIO",
  },
  {
    id: "inf_rs_c06",
    title: "Firewall, DMZ, IDS e IPS: Segurança Perimetral de Redes",
    textContent: `A segurança perimetral protege a rede interna contra ameaças externas utilizando um conjunto de tecnologias e arquiteturas.

FIREWALL:
• Filtra tráfego de rede com base em regras (IP, porta, protocolo, estado da conexão)
• Tipos principais:
  — Filtragem de pacotes (stateless): analisa cada pacote isoladamente por IP/porta/protocolo
  — Stateful Inspection: rastreia o estado das conexões TCP (mais inteligente)
  — Proxy/Application Layer: analisa o conteúdo da aplicação (camada 7)
• Pode ser hardware dedicado ou software

DMZ (Demilitarized Zone — Zona Desmilitarizada):
• Sub-rede isolada posicionada ENTRE a internet e a rede interna
• Hospeda servidores que precisam ser acessíveis publicamente: web, e-mail, DNS
• Proteção: mesmo que um servidor da DMZ seja comprometido, o atacante não acessa diretamente a rede interna
• Implementada com dois firewalls (ou um firewall com três interfaces de rede)

IDS (Intrusion Detection System):
• DETECTA atividades suspeitas ou maliciosas e gera ALERTAS
• Posicionamento: em modo passivo (monitora cópia do tráfego — modo espelho/SPAN)
• NÃO bloqueia o tráfego — apenas informa o administrador
• Tipos: baseado em assinatura (detecta padrões conhecidos) e baseado em anomalia (desvios do comportamento normal)

IPS (Intrusion Prevention System):
• DETECTA e BLOQUEIA ativamente o tráfego malicioso
• Posicionamento: em linha (inline) — o tráfego passa através do IPS
• Age em tempo real, sem necessidade de intervenção humana
• Diferença crítica do IDS: IPS bloqueia; IDS apenas alerta

VPN (Virtual Private Network):
• Cria túnel criptografado sobre rede pública (internet)
• Protege confidencialidade e integridade do tráfego
• Protocolos: IPSec, OpenVPN, WireGuard`,
    mnemonic: "FIREWALL=filtra por regras. DMZ=zona isolada para servidores públicos. IDS=detecta e ALERTA (passivo). IPS=detecta e BLOQUEIA (inline, ativo). VPN=túnel criptografado.",
    keyPoint: "IDS: passivo, só alerta, modo espelho. IPS: ativo, bloqueia, modo inline. DMZ: sub-rede entre internet e rede interna. Firewall stateful rastreia estado das conexões TCP.",
    practicalExample: "Servidor web da PF fica na DMZ (acessível pela internet sem expor a rede interna). IDS detecta varredura de portas e alerta o administrador. IPS descarta pacotes de ataque SQL Injection automaticamente.",
    difficulty: "MEDIO",
  },
];

// ============================================
// QUESTÕES (12 questões CERTO_ERRADO — IDs fixos)
// ============================================

interface QuestionData {
  id: string;
  statement: string;
  alternatives: Array<{ letter: string; text: string }>;
  correctOption: number;
  questionType: "CERTO_ERRADO";
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  explanationCorrect: string;
  explanationWrong: string;
  contentTitle: string;
}

const CE = [
  { letter: "A", text: "Certo" },
  { letter: "B", text: "Errado" },
];

const questions: QuestionData[] = [
  // TCP/IP (c01)
  {
    id: "qz_inf1_001",
    statement:
      "Julgue: O protocolo TCP é orientado à conexão e garante a entrega dos pacotes por meio de confirmações (ACK) e retransmissão em caso de perda, enquanto o UDP não oferece essas garantias, sendo mais indicado para aplicações que priorizam baixa latência, como streaming de vídeo e VoIP.",
    alternatives: CE,
    correctOption: 0,
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    explanationCorrect:
      "CERTO. TCP é orientado à conexão: usa three-way handshake (SYN/SYN-ACK/ACK) e garante entrega com ACK e retransmissão. UDP é não confiável e sem conexão, ideal para streaming e VoIP onde a velocidade importa mais que a integridade de cada pacote.",
    explanationWrong:
      "TCP e UDP são os dois protocolos de transporte do modelo TCP/IP. TCP = confiável, com handshake e ACK. UDP = sem conexão, sem garantia, baixa latência. Ambas as caracterizações estão corretas.",
    contentTitle: "Modelo TCP/IP: Camadas, Portas e Protocolos de Transporte",
  },
  {
    id: "qz_inf1_002",
    statement:
      "Julgue: O protocolo SMTP (Simple Mail Transfer Protocol), utilizado para o envio de e-mails entre servidores, opera na camada de Aplicação do modelo TCP/IP e utiliza, por padrão, a porta 80.",
    alternatives: CE,
    correctOption: 1,
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    explanationCorrect:
      "ERRADO. O SMTP opera na camada de Aplicação, mas utiliza a porta 25 (não 80). A porta 80 é usada pelo HTTP. O SMTP também pode usar as portas 587 (submissão com autenticação) e 465 (SMTPS). Confundir porta SMTP com porta HTTP é a pegadinha mais frequente.",
    explanationWrong:
      "SMTP está correto como protocolo de envio de e-mail na camada de Aplicação. Contudo, a porta padrão do SMTP é 25, não 80. HTTP usa a porta 80.",
    contentTitle: "Modelo TCP/IP: Camadas, Portas e Protocolos de Transporte",
  },
  // DNS (c02)
  {
    id: "qz_inf1_003",
    statement:
      "Julgue: No Sistema de Nomes de Domínio (DNS), o registro do tipo MX (Mail Exchanger) é responsável por mapear nomes de domínio para endereços IPv4, enquanto o registro do tipo AAAA realiza o mapeamento para endereços IPv6.",
    alternatives: CE,
    correctOption: 1,
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    explanationCorrect:
      "ERRADO. O registro MX (Mail Exchanger) indica o servidor de e-mail responsável pelo domínio — ele NÃO mapeia nomes para endereços IP. Quem mapeia nome para IPv4 é o registro A; para IPv6, é o registro AAAA. O CEBRASPE frequentemente troca as definições de A e MX.",
    explanationWrong:
      "Registro A → IPv4. Registro AAAA → IPv6. Registro MX → servidor de e-mail do domínio (não endereço IP). A afirmativa troca incorretamente as funções de MX e A.",
    contentTitle: "DNS: Resolução de Nomes de Domínio e Tipos de Registros",
  },
  {
    id: "qz_inf1_004",
    statement:
      "Julgue: No processo de resolução recursiva de nomes DNS, o servidor DNS recursivo (resolver) realiza as consultas necessárias em nome do cliente, consultando servidores raiz, servidores TLD e servidores autoritativos, retornando ao cliente apenas a resposta final.",
    alternatives: CE,
    correctOption: 0,
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    explanationCorrect:
      "CERTO. Na resolução recursiva, o servidor recursivo (resolver) assume toda a carga de trabalho: consulta os servidores raiz, depois os TLD (ex: .br, .com), depois os autoritativos, e retorna ao cliente somente o resultado final. O cliente faz apenas uma consulta e recebe uma resposta.",
    explanationWrong:
      "A resolução recursiva é exatamente este processo: o resolver trabalha pelo cliente, fazendo todas as consultas intermediárias (raiz → TLD → autoritativo) e retornando apenas a resposta final.",
    contentTitle: "DNS: Resolução de Nomes de Domínio e Tipos de Registros",
  },
  // HTTP/HTTPS (c03)
  {
    id: "qz_inf1_005",
    statement:
      "Julgue: O protocolo HTTPS garante a confidencialidade, a integridade e a autenticação da comunicação entre cliente e servidor por meio do uso do protocolo TLS, que realiza a criptografia dos dados em trânsito.",
    alternatives: CE,
    correctOption: 0,
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    explanationCorrect:
      "CERTO. HTTPS = HTTP sobre TLS (Transport Layer Security). O TLS garante: confidencialidade (criptografia do conteúdo), integridade (detecta alterações via MAC) e autenticação (certificados digitais verificam identidade do servidor). Usa a porta 443.",
    explanationWrong:
      "As três propriedades garantidas pelo HTTPS/TLS são: confidencialidade (cifração), integridade (MAC) e autenticação (certificados CA). A afirmativa descreve corretamente o funcionamento.",
    contentTitle: "HTTP/HTTPS: Métodos, Códigos de Status e Protocolo TLS",
  },
  {
    id: "qz_inf1_006",
    statement:
      "Julgue: O código de status HTTP 401 (Unauthorized) indica que o servidor entendeu a requisição, mas se recusa a autorizá-la, significando que o usuário foi autenticado porém não possui permissão para acessar o recurso solicitado.",
    alternatives: CE,
    correctOption: 1,
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    explanationCorrect:
      "ERRADO. O código 401 (Unauthorized) indica que o cliente NÃO está autenticado — precisa fornecer credenciais válidas. Já o código 403 (Forbidden) é o que indica que o usuário está autenticado mas não tem permissão para acessar o recurso. A afirmativa descreve o comportamento do 403, não do 401.",
    explanationWrong:
      "401 = não autenticado (faça login). 403 = autenticado mas sem permissão (acesso negado). A afirmativa inverteu os significados: descreveu 403 como se fosse 401.",
    contentTitle: "HTTP/HTTPS: Métodos, Códigos de Status e Protocolo TLS",
  },
  // Criptografia (c04)
  {
    id: "qz_inf1_007",
    statement:
      "Julgue: Na criptografia assimétrica, uma mensagem cifrada com a chave pública de um destinatário somente pode ser decifrada com a chave privada correspondente desse mesmo destinatário, garantindo a confidencialidade da comunicação.",
    alternatives: CE,
    correctOption: 0,
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    explanationCorrect:
      "CERTO. Este é o uso básico da criptografia assimétrica para confidencialidade: o remetente usa a chave PÚBLICA do destinatário para cifrar; apenas o destinatário, com sua chave PRIVADA, pode decifrar. A chave privada nunca é compartilhada.",
    explanationWrong:
      "Na criptografia assimétrica: cifragem com chave pública do destinatário → decifra somente com a chave privada correspondente. É exatamente o que a afirmativa descreve.",
    contentTitle: "Criptografia Simétrica, Assimétrica e Funções Hash",
  },
  {
    id: "qz_inf1_008",
    statement:
      "Julgue: O algoritmo de hash MD5 é considerado seguro para uso em sistemas de autenticação modernos, pois produz um resumo criptográfico (digest) de 256 bits que oferece alta resistência a colisões.",
    alternatives: CE,
    correctOption: 1,
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    explanationCorrect:
      "ERRADO. O MD5 possui DOIS erros na afirmativa: (1) produz hash de 128 bits — não 256 bits (SHA-256 é que produz 256 bits); (2) é considerado INSEGURO para autenticação, pois é vulnerável a ataques de colisão. O algoritmo recomendado atualmente é o SHA-256 ou SHA-3.",
    explanationWrong:
      "MD5: 128 bits, inseguro (colisões conhecidas). SHA-256: 256 bits, seguro. A afirmativa errou tanto o tamanho do hash (disse 256, correto é 128) quanto a classificação de segurança (disse seguro, mas MD5 é obsoleto e inseguro).",
    contentTitle: "Criptografia Simétrica, Assimétrica e Funções Hash",
  },
  // Malwares (c05)
  {
    id: "qz_inf1_009",
    statement:
      "Julgue: Diferentemente dos vírus, os worms são programas maliciosos que se propagam de forma autônoma pela rede, sem necessidade de um programa hospedeiro, podendo explorar vulnerabilidades em sistemas para se disseminar sem intervenção do usuário.",
    alternatives: CE,
    correctOption: 0,
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    explanationCorrect:
      "CERTO. A distinção fundamental entre vírus e worm: o vírus precisa de arquivo hospedeiro e da ação do usuário para se disseminar; o worm se propaga autonomamente pela rede, explorando vulnerabilidades, sem hospedeiro e sem ação do usuário.",
    explanationWrong:
      "A diferença entre vírus e worm é exatamente esta: vírus = hospedeiro + ação do usuário. Worm = autônomo + rede, sem hospedeiro. A afirmativa descreve corretamente o worm.",
    contentTitle: "Malwares: Vírus, Worm, Trojan, Ransomware e Spyware",
  },
  {
    id: "qz_inf1_010",
    statement:
      "Julgue: O ransomware é uma categoria de malware que, ao infectar um sistema, furta silenciosamente credenciais de acesso e as envia para o atacante, sem alterar, bloquear ou cifrar os arquivos da vítima.",
    alternatives: CE,
    correctOption: 1,
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    explanationCorrect:
      "ERRADO. A afirmativa descreve um spyware/keylogger, não um ransomware. O ransomware cifra os arquivos da vítima usando criptografia e exige o pagamento de resgate para fornecer a chave de decriptação. O ransomware NÃO furta credenciais silenciosamente — ele bloqueia o acesso aos dados da vítima.",
    explanationWrong:
      "Ransomware: cifra arquivos + exige resgate. Spyware/keylogger: furta credenciais silenciosamente. A afirmativa descreveu o comportamento de um spyware e chamou de ransomware — confusão clássica de banca.",
    contentTitle: "Malwares: Vírus, Worm, Trojan, Ransomware e Spyware",
  },
  // Firewall/IDS/IPS (c06)
  {
    id: "qz_inf1_011",
    statement:
      "Julgue: O IDS (Intrusion Detection System) e o IPS (Intrusion Prevention System) diferem principalmente quanto à capacidade de resposta: enquanto o IDS apenas monitora o tráfego e gera alertas sobre atividades suspeitas, o IPS é capaz de bloquear ativamente o tráfego malicioso em tempo real.",
    alternatives: CE,
    correctOption: 0,
    questionType: "CERTO_ERRADO",
    difficulty: "FACIL",
    explanationCorrect:
      "CERTO. A diferença fundamental: IDS = passivo (monitora e alerta, posicionado em modo espelho). IPS = ativo (monitora, alerta E bloqueia, posicionado em linha — inline). O IPS age automaticamente sem necessidade de intervenção humana.",
    explanationWrong:
      "IDS e IPS têm exatamente essa distinção: IDS detecta e alerta (passivo, modo espelho); IPS detecta, alerta e bloqueia (ativo, inline). A afirmativa descreve corretamente.",
    contentTitle: "Firewall, DMZ, IDS e IPS: Segurança Perimetral de Redes",
  },
  {
    id: "qz_inf1_012",
    statement:
      "Julgue: A DMZ (Zona Desmilitarizada) é uma sub-rede isolada, posicionada entre a rede interna e a internet, utilizada para hospedar servidores que precisam ser acessíveis publicamente — como servidores web e de e-mail —, de forma que um eventual comprometimento desses servidores não exponha diretamente a rede interna.",
    alternatives: CE,
    correctOption: 0,
    questionType: "CERTO_ERRADO",
    difficulty: "MEDIO",
    explanationCorrect:
      "CERTO. A DMZ é exatamente esta arquitetura: sub-rede isolada entre a internet e a rede interna, onde ficam servidores de acesso público (web, e-mail, DNS). Se um servidor da DMZ for comprometido, o atacante não terá acesso direto à rede interna — um segundo firewall protege a transição DMZ → rede interna.",
    explanationWrong:
      "A definição e o objetivo da DMZ estão corretos: zona isolada para servidores públicos, prevenindo que a comprometimento de um servidor exposto afete a rede interna.",
    contentTitle: "Firewall, DMZ, IDS e IPS: Segurança Perimetral de Redes",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("🚀 Seed R15: Informática — Redes de Computadores e Segurança da Informação");
  console.log("=".repeat(70));

  // 1. Encontrar subject
  const subjectId = await findSubject("INFORMATICA");
  if (!subjectId) {
    console.error("❌ Subject INFORMATICA não encontrado.");
    process.exit(1);
  }
  console.log(`✅ Subject: ${subjectId}`);

  // 2. Encontrar ou criar tópico
  const topicId = await findOrCreateTopic(
    "Redes de Computadores e Segurança da Informação",
    subjectId,
  );
  console.log(`✅ Tópico: ${topicId}`);

  // 3. Inserir content atoms + construir contentIdMap
  console.log("\n📚 Inserindo content atoms...");
  const contentIdMap: Record<string, string> = {};

  for (const c of contents) {
    if (await contentExists(c.title, subjectId)) {
      const rows = (await db.execute(sql`
        SELECT id FROM "Content" WHERE title = ${c.title} AND "subjectId" = ${subjectId} LIMIT 1
      `)) as any[];
      contentIdMap[c.title] = rows[0].id;
      console.log(`  ⏭️  Já existe: "${c.title}" → ${rows[0].id}`);
      continue;
    }

    const wordCount = c.textContent.split(/\s+/).length;
    const estimatedReadTime = Math.ceil(wordCount / 200);

    await db.execute(sql`
      INSERT INTO "Content" (
        id, title, "textContent", "subjectId", "topicId",
        difficulty, mnemonic, "keyPoint", "practicalExample",
        "wordCount", "estimatedReadTime",
        "createdAt", "updatedAt"
      ) VALUES (
        ${c.id}, ${c.title}, ${c.textContent}, ${subjectId}, ${topicId},
        ${c.difficulty}, ${c.mnemonic}, ${c.keyPoint}, ${c.practicalExample},
        ${wordCount}, ${estimatedReadTime},
        NOW(), NOW()
      )
    `);
    contentIdMap[c.title] = c.id;
    console.log(`  ✅ Criado: "${c.title}" (${wordCount}w)`);
  }

  // 4. Inserir questões
  console.log("\n❓ Inserindo questões...");
  let inserted = 0;
  let skipped = 0;

  for (const q of questions) {
    if (await questionExists(q.id)) {
      console.log(`  ⏭️  Já existe: ${q.id}`);
      skipped++;
      continue;
    }

    const contentId = contentIdMap[q.contentTitle];
    if (!contentId) {
      console.warn(`  ⚠️  Content não encontrado para "${q.contentTitle}" — pulando ${q.id}`);
      continue;
    }

    const alternatives = JSON.stringify(q.alternatives);
    const correctAnswer = getCorrectAnswer(q.alternatives, q.correctOption);

    await db.execute(sql`
      INSERT INTO "Question" (
        id, statement, alternatives, "correctAnswer", "correctOption",
        "questionType", difficulty,
        "explanationCorrect", "explanationWrong",
        "subjectId", "topicId", "contentId",
        "isActive", "timesUsed", "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternatives}::jsonb, ${correctAnswer}, ${q.correctOption},
        ${q.questionType}, ${q.difficulty},
        ${q.explanationCorrect}, ${q.explanationWrong},
        ${subjectId}, ${topicId}, ${contentId},
        true, 0, NOW(), NOW()
      )
    `);
    console.log(`  ✅ ${q.id} [${q.difficulty}] → "${q.contentTitle.slice(0, 45)}..."`);
    inserted++;
  }

  // 5. Relatório
  console.log("\n" + "=".repeat(70));
  console.log("📊 RELATÓRIO FINAL — R15 Informática (Redes e Segurança):");
  console.log(`   Content atoms: ${Object.keys(contentIdMap).length} (${contents.length - skipped} novos)`);
  console.log(`   Questões inseridas: ${inserted} | Já existiam: ${skipped}`);
  console.log("✅ Seed R15 concluído!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
