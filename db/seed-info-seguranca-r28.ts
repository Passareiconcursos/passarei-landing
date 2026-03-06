/**
 * Seed: Informatica — R28 — Seguranca da Informacao Avancada
 * (Backup, Ataques de Rede, VPN, Gestao de Vulnerabilidades, Engenharia Social, DICAI)
 *
 * Popula 6 atomos de Conteudo + 12 Questoes.
 * Idempotente: verifica existencia antes de inserir.
 * TODAS as questoes tem contentId vinculado ao atomo correto.
 * correctOption e SEMPRE numerico (0-4): A=0, B=1, C=2, D=3, E=4.
 *
 * Execucao:
 *   npx tsx db/seed-info-seguranca-r28.ts
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
  const attempts = [name, "Informatica", "INFORMATICA", "Informática"];
  for (const attempt of attempts) {
    const rows = await db.execute(sql`
      SELECT id FROM "Subject" WHERE name ILIKE ${"%" + attempt + "%"} LIMIT 1
    `) as any[];
    if (rows[0]?.id) return rows[0].id;
  }
  return null;
}

async function findOrCreateTopic(name: string, subjectId: string): Promise<string> {
  const rows = await db.execute(sql`
    SELECT id FROM "Topic" WHERE name ILIKE ${name} AND "subjectId" = ${subjectId} LIMIT 1
  `) as any[];
  if (rows[0]?.id) {
    console.log(`  skip  Topico ja existe: ${name}`);
    return rows[0].id;
  }
  const id = nanoId("tp");
  await db.execute(sql`
    INSERT INTO "Topic" (id, name, "subjectId", "createdAt", "updatedAt")
    VALUES (${id}, ${name}, ${subjectId}, NOW(), NOW())
  `);
  console.log(`  OK Topico criado: ${name} (${id})`);
  return id;
}

async function contentExists(title: string, subjectId: string): Promise<boolean> {
  const rows = await db.execute(sql`
    SELECT id FROM "Content" WHERE title = ${title} AND "subjectId" = ${subjectId} LIMIT 1
  `) as any[];
  return rows.length > 0;
}

async function getContentId(title: string, subjectId: string): Promise<string | null> {
  const rows = await db.execute(sql`
    SELECT id FROM "Content" WHERE title = ${title} AND "subjectId" = ${subjectId} LIMIT 1
  `) as any[];
  return rows[0]?.id ?? null;
}

async function questionExists(id: string): Promise<boolean> {
  const rows = await db.execute(sql`
    SELECT id FROM "Question" WHERE id = ${id} LIMIT 1
  `) as any[];
  return rows.length > 0;
}

// ============================================
// INTERFACES
// ============================================

interface ContentAtom {
  id: string;
  title: string;
  textContent: string;
  mnemonic: string;
  keyPoint: string;
  practicalExample: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
}

interface Alternative {
  letter: string;
  text: string;
}

interface QuestionData {
  id: string;
  statement: string;
  alternatives: Alternative[];
  correctAnswer: string;
  correctOption: number;
  explanation: string;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  questionType: "CERTO_ERRADO" | "MULTIPLA_ESCOLHA";
  contentTitle: string;
}

// ============================================
// CONTEUDOS (6 atomos)
// ============================================

const contents: ContentAtom[] = [
  // -- 1. Backup --
  {
    id: "inf_si_c01",
    title: "Backup: Completo, Incremental e Diferencial",
    textContent: `Backup e o processo de copia de dados para permitir recuperacao em caso de perda, corrucao ou desastre. Concursos exploram as diferencas entre os tres tipos principais e suas implicacoes em tempo e espaco.

BACKUP COMPLETO (Full Backup):
Copia TODOS os dados, independentemente de alteracoes anteriores.
Vantagem: restauracao mais rapida (apenas um backup necessario).
Desvantagem: maior tempo de execucao e maior uso de espaco de armazenamento.
Atributo de arquivo: zera o bit de arquivo (archive bit) apos a copia.
Frequencia tipica: semanal ou quinzenal.

BACKUP INCREMENTAL:
Copia apenas os dados alterados DESDE O ULTIMO BACKUP (completo ou incremental anterior).
Vantagem: menor tempo de execucao e menor uso de espaco.
Desvantagem: restauracao mais lenta — exige o backup completo + TODOS os incrementais em sequencia.
Atributo de arquivo: zera o bit de arquivo apos a copia.
Exemplo: Completo (domingo) + Incremental (seg, ter, qua...) = restaurar tudo ate quarta requer 4 midias.

BACKUP DIFERENCIAL:
Copia todos os dados alterados DESDE O ULTIMO BACKUP COMPLETO (ignora os diferenciais intermediarios).
Vantagem: restauracao mais rapida que o incremental (apenas completo + ultimo diferencial).
Desvantagem: cresce progressivamente a cada dia — mais espaco que o incremental, mas menos que o completo.
Atributo de arquivo: NAO zera o bit de arquivo.
Exemplo: Completo (domingo) + Diferencial (quarta) = restaurar requer apenas 2 midias.

TABELA COMPARATIVA:
               | Completo  | Incremental | Diferencial
Espaco         | Muito alto | Baixo       | Medio (cresce)
Tempo backup   | Lento      | Rapido      | Medio
Tempo restauro | Rapido     | Lento       | Medio
Midias restau. | 1          | N (varios)  | 2 (completo + ultimo dif)
Zera bit arq.  | Sim        | Sim         | NAO

ESTRATEGIA MISTA COMUM: backup completo semanal + incrementais diarios OU completo semanal + diferenciais diarios.

PONTO DE RECUPERACAO (RPO) E PONTO DE OBJETIVO DE TEMPO (RTO):
RPO (Recovery Point Objective): quantidade maxima de dados que pode ser perdida (ex: 24h = backup diario).
RTO (Recovery Time Objective): tempo maximo aceitavel para restaurar o sistema.`,
    mnemonic: "COMPLETO = tudo sempre (1 midia, restaura rapido). INCREMENTAL = so o que mudou desde ONTEM (N midias, restaura devagar). DIFERENCIAL = tudo que mudou desde o COMPLETO (2 midias, restaura medio). Dif NAO zera o bit.",
    keyPoint: "Incremental: copia desde o ultimo backup (qualquer tipo) — restauracao exige todos os backups em cadeia. Diferencial: copia desde o ultimo COMPLETO — restauracao exige apenas 2 midias. Diferencial NAO zera bit de arquivo; incremental zera.",
    practicalExample: "Empresa faz backup completo domingo. Se usa incremental: segunda copia 10 arquivos, terca mais 5, quarta mais 8 — restaurar quarta = completo + 3 incrementais. Se usa diferencial: segunda copia 10, terca 15 (10+5), quarta 23 (10+5+8) — restaurar quarta = completo + 1 diferencial. Espaco maior no diferencial, restauracao mais simples.",
    difficulty: "FACIL",
  },

  // -- 2. Ataques de Rede --
  {
    id: "inf_si_c02",
    title: "Ataques de Rede: DoS, DDoS, Man-in-the-Middle e Replay",
    textContent: `Ataques de rede visam comprometer a disponibilidade, integridade ou confidencialidade de sistemas por meio da exploracao de vulnerabilidades em protocolos e infraestrutura de comunicacao.

DoS (Denial of Service — Negacao de Servico):
Ataque originado de UMA unica fonte que sobrecarrega o alvo com trafego ou requisicoes ilegitimas, tornando o servico indisponivel para usuarios legitimos.
Compromete: DISPONIBILIDADE (principio D do DICAI).
Exemplos: SYN Flood (explora handshake TCP), HTTP Flood, Ping of Death.

DDoS (Distributed Denial of Service — Negacao de Servico Distribuida):
Variante do DoS em que o ataque e coordenado por MULTIPLAS fontes (botnet — rede de dispositivos comprometidos/zumbis).
Muito mais dificil de mitigar que o DoS simples, pois o trafego malicioso vem de milhares de IPs diferentes.
O controlador envia comandos ao servidor C2 (Command and Control) que repassa para os bots.
Ataque mais comum contra grandes servicos online (sites de governo, bancos, e-commerce).

MAN-IN-THE-MIDDLE (MitM — Homem no Meio):
Atacante se posiciona entre duas partes comunicantes, interceptando e possivelmente alterando as mensagens sem que as vitimas percebam.
Compromete: CONFIDENCIALIDADE e INTEGRIDADE.
Tecnicas comuns: ARP Spoofing/Poisoning, DNS Spoofing, SSL Stripping, Evil Twin (Wi-Fi falso).
Contramedidas: criptografia ponta-a-ponta (TLS/HTTPS), autenticacao mutua com certificados, VPN.

ATAQUE DE REPLAY (Reproducao):
O atacante captura uma transmissao legitima (ex: pacote de autenticacao) e a reenvia posteriormente para obter acesso nao autorizado, sem precisar decifrar o conteudo.
Nao compromete a criptografia em si — o ataque usa dados validos capturados.
Contramedidas: uso de NONCE (numero usado uma unica vez), timestamps de validade, tokens de sessao descartaveis.
Exemplo: capturar token de autenticacao e reenviar horas depois para acessar o sistema.

OUTROS ATAQUES RELEVANTES:
IP Spoofing: falsificacao do endereco IP de origem para mascarar identidade ou bypassar filtros.
Smurf Attack: tipo de DDoS que usa broadcast ICMP com IP de origem falsificado (da vitima).`,
    mnemonic: "DoS = 1 fonte. DDoS = muitas fontes (botnet). MitM = intercepta no meio (quebra conf. + integ.). Replay = reutiliza captura valida (precisa de NONCE para bloquear). Todos os 4 sao temas de prova de PF/PC.",
    keyPoint: "DoS: 1 origem, sobrecarga. DDoS: multiplas origens via botnet. MitM: intercepta comunicacao — compromete confidencialidade e integridade. Replay: reenvia dados validos capturados — bloqueado por nonce/timestamp.",
    practicalExample: "Site de banco sai do ar por 2 horas: DDoS (botnet de milhares de IPs). Senhas interceptadas em Wi-Fi publico: MitM via Evil Twin. Credencial de login capturada e reutilizada 1h depois: ataque de Replay. Ataque de SYN Flood de um unico IP: DoS classico.",
    difficulty: "MEDIO",
  },

  // -- 3. VPN e Tunelamento --
  {
    id: "inf_si_c03",
    title: "VPN e Protocolos de Tunelamento: IPSec, SSL/TLS e L2TP",
    textContent: `VPN (Virtual Private Network — Rede Privada Virtual) e uma tecnologia que cria um canal de comunicacao seguro (tunel) sobre uma rede publica (geralmente a Internet), permitindo que dados trafeguem como se estivessem em uma rede privada.

FUNCIONALIDADE DA VPN:
Encapsula e criptografa os pacotes de dados antes de transmiti-los.
Garante: confidencialidade (criptografia), integridade (verificacao de integridade), autenticacao das partes.
Casos de uso: acesso remoto seguro a redes corporativas, protecao em redes Wi-Fi publicas, interligacao de filiais.

IPSEC (Internet Protocol Security):
Conjunto de protocolos que opera na CAMADA 3 (Rede) do modelo OSI.
Dois modos de operacao:
  - Modo Transporte: criptografa apenas o PAYLOAD (dados) do pacote IP — cabecalho IP permanece exposto.
  - Modo Tunel: criptografa o pacote IP INTEIRO (cabecalho + payload) e adiciona novo cabecalho IP — mais seguro.
Dois protocolos principais:
  - AH (Authentication Header): garante autenticacao e integridade — NAO criptografa os dados.
  - ESP (Encapsulating Security Payload): garante autenticacao, integridade E criptografia dos dados.
Usado em VPNs site-to-site corporativas (interligacao de filiais).

SSL/TLS (Secure Sockets Layer / Transport Layer Security):
Opera na CAMADA 4/5 do modelo OSI (Transporte/Sessao).
TLS e o sucessor e versao mais segura do SSL (SSL esta depreciado).
Base do HTTPS — toda conexao HTTPS usa TLS para criptografar o trafego HTTP.
VPN baseada em SSL/TLS (ex: OpenVPN): acessivel por qualquer navegador, nao exige cliente especifico de VPN.
Mais facil de configurar em ambientes com NAT e firewalls.

L2TP (Layer 2 Tunneling Protocol):
Opera na CAMADA 2 (Enlace) do modelo OSI.
POR SI SO nao oferece criptografia — apenas cria o tunel.
Quase sempre combinado com IPSec para fornecer seguranca: L2TP/IPSec.
Sucessor do PPTP (Point-to-Point Tunneling Protocol) — PPTP e considerado inseguro.

COMPARATIVO:
          | Camada OSI | Criptografia | Uso Tipico
IPSec     | 3 (Rede)   | Sim (modo ESP)| Site-to-site
SSL/TLS   | 4/5        | Sim           | Acesso remoto via browser
L2TP      | 2 (Enlace) | NAO (sozinho) | Combinado c/ IPSec`,
    mnemonic: "IPSec = camada 3 (Rede), modo Tunel = criptografa tudo. AH = autentica, NAO criptografa. ESP = autentica E criptografa. SSL/TLS = camada 4/5, base do HTTPS. L2TP = camada 2, sem criptografia propria — usa IPSec por baixo.",
    keyPoint: "IPSec: camada 3, modo tunel criptografa pacote inteiro, ESP criptografa + autentica. AH apenas autentica. SSL/TLS: base HTTPS, camada 4/5. L2TP: camada 2, sem criptografia — sempre combinado com IPSec. PPTP: inseguro, obsoleto.",
    practicalExample: "Funcionario acessa o sistema do banco de casa com seguranca: VPN com IPSec modo tunel. Compra online com HTTPS: TLS protegendo os dados do cartao. Empresa conecta filial de SP com matriz do RJ: VPN site-to-site IPSec. L2TP/IPSec: tipo de VPN disponivel nativamente no Windows para acesso remoto.",
    difficulty: "FACIL",
  },

  // -- 4. Gestao de Vulnerabilidades --
  {
    id: "inf_si_c04",
    title: "Gestao de Vulnerabilidades: CVE, CVSS e Patch Management",
    textContent: `Gestao de Vulnerabilidades e o processo continuo de identificar, classificar, priorizar, remediar e monitorar vulnerabilidades de seguranca em sistemas de informacao.

CVE (Common Vulnerabilities and Exposures):
Sistema de identificacao padronizado de vulnerabilidades conhecidas publicamente.
Mantido pela MITRE Corporation e patrocinado pela CISA (agencia de seguranca dos EUA).
Formato do identificador: CVE-ANO-NUMERO (ex: CVE-2021-44228 — Log4Shell).
Cada CVE descreve: o tipo de vulnerabilidade, o sistema afetado e a versao vulneravel.
O banco de dados NVD (National Vulnerability Database) do NIST complementa o CVE com scores CVSS.

CVSS (Common Vulnerability Scoring System):
Sistema de pontuacao padronizado para avaliar a SEVERIDADE de vulnerabilidades.
Versao atual: CVSS v3.1 (e CVSS v4.0 em adocao).
Escala: 0.0 a 10.0.
  - 0.0       : Nenhuma
  - 0.1 - 3.9 : Baixa
  - 4.0 - 6.9 : Media
  - 7.0 - 8.9 : Alta
  - 9.0 - 10.0: Critica
Metricas de base: vetor de ataque (rede/local/fisico), complexidade, privilegios exigidos, interacao do usuario, escopo, impactos em C, I e A (Confidencialidade, Integridade, Disponibilidade).

PATCH MANAGEMENT (Gerenciamento de Patches/Correcoes):
Processo sistematico de identificar, testar e aplicar atualizacoes (patches) de software para corrigir vulnerabilidades.
Etapas: inventario de ativos → identificacao de patches disponíveis → teste em ambiente controlado → aprovacao → implantacao → verificacao → documentacao.
Zero-day: vulnerabilidade explorada ANTES que o fabricante tome conhecimento ou lance patch — sem correcao disponivel.
Workaround: medida temporaria para reduzir o risco ate o patch ser lancado.
Patch Tuesday: dia em que a Microsoft lanca patches mensalmente (segunda terca-feira de cada mes).

CICLO DE VIDA:
Descoberta → Divulgacao responsavel (fabricante notificado) → Desenvolvimento do patch → Publicacao do CVE → Distribuicao do patch → Aplicacao nos sistemas.
SLA de patch critico: organizacoes maduras definem prazo maximo para aplicar patches criticos (ex: 72h para CVSS >= 9.0).`,
    mnemonic: "CVE = identificador unico de vulnerabilidade (CVE-ANO-NUM). CVSS = nota de 0 a 10 (critica: 9-10). Patch Management = identificar → testar → aplicar. Zero-day = sem patch disponivel. Patch Tuesday = Microsoft, toda segunda terca.",
    keyPoint: "CVE: identificador padrao de vulnerabilidades — formato CVE-ANO-NUMERO, mantido pela MITRE. CVSS: pontuacao 0-10 de severidade — critica 9.0-10.0. Patch Management: processo de aplicar correcoes. Zero-day: vulnerabilidade sem patch. Patch Tuesday: ciclo mensal Microsoft.",
    practicalExample: "CVE-2021-44228 (Log4Shell): vulnerabilidade critica (CVSS 10.0) na biblioteca Java Log4j, afetou milhares de sistemas em 2021. Equipe de seguranca recebe alerta: CVSS 9.8 — prioridade maxima, patch em 24h. Sistema sem patch ha 6 meses com CVE publicado = falha grave de Patch Management.",
    difficulty: "MEDIO",
  },

  // -- 5. Engenharia Social --
  {
    id: "inf_si_c05",
    title: "Engenharia Social: Phishing, Vishing, Smishing e Pretexting",
    textContent: `Engenharia Social e a manipulacao psicologica de pessoas para que revelem informacoes confidenciais ou executem acoes que comprometam a seguranca — explorando o fator humano, considerado o elo mais fraco da seguranca da informacao.

PHISHING:
Ataque por e-mail fraudulento que imita comunicacao legitima (banco, governo, empresa conhecida) para induzir a vitima a clicar em links maliciosos, baixar anexos infectados ou fornecer credenciais.
Variante — Spear Phishing: ataque DIRECIONADO a individuo ou organizacao especifica, com personalizacao de dados reais (nome, cargo, empresa) para aumentar credibilidade.
Variante — Whaling: spear phishing direcionado a executivos de alto escalao (CEO, CFO).
Variante — Pharming: redireciona o usuario para site falso mesmo quando digita a URL correta (envenena DNS ou arquivo hosts).

VISHING (Voice Phishing):
Phishing realizado por CHAMADA TELEFONICA (voz). O atacante finge ser funcionario de banco, suporte tecnico, policia ou entidade governamental.
Caracteristico: urgencia fabricada ("sua conta foi bloqueada", "ha uma atividade suspeita").
Contramedida: nunca fornecer dados por telefone a ligacao recebida; ligar de volta para numero oficial.

SMISHING (SMS Phishing):
Phishing realizado via MENSAGEM DE TEXTO (SMS ou mensageiros como WhatsApp).
Geralmente contem link encurtado para site malicioso ou numero de telefone para "atendimento".
Exemplo: "Seu pacote esta retido. Clique aqui para regularizar: bit.ly/xxxx"

PRETEXTING:
Criacao de um CENARIO FICTICIO (pretexto) elaborado para extrair informacoes. O atacante assume uma identidade falsa (auditor, tecnico de TI, investigador) e cria contexto convincente antes de fazer o pedido.
Diferenca do phishing: o pretexting e uma manipulacao mais elaborada e personalizada, geralmente por telefone ou presencialmente.
Exemplo: atacante liga para RH fingindo ser funcionario novo precisando de acesso ao sistema.

OUTROS VETORES:
Baiting: deixar midia fisica (pendrive) em local publico esperando que a curiosidade leve a vitima a conecta-la.
Quid pro quo: oferecer ajuda tecnica falsa em troca de credenciais.
Tailgating/Piggybacking: acesso fisico nao autorizado seguindo uma pessoa autorizada.`,
    mnemonic: "PHISHING = e-mail falso. SPEAR = direcionado. VISHING = voz (telefone). SMISHING = SMS. PRETEXTING = cenario ficticio elaborado. Baiting = pendrive perdido. Whaling = CEO/alto escalao.",
    keyPoint: "Phishing: e-mail. Spear phishing: direcionado e personalizado. Whaling: alvo e alto executivo. Vishing: telefone. Smishing: SMS/WhatsApp. Pharming: envenena DNS — vitima digita URL certa mas cai em site falso. Pretexting: identidade e cenario falsos para extrair info.",
    practicalExample: "E-mail do 'Banco do Brasil' pedindo para confirmar senha: phishing. Mesmo e-mail com seu nome, cargo e ultimo acesso real: spear phishing. Ligacao de 'suporte Microsoft' pedindo acesso remoto: vishing. SMS com link para rastrear entrega inexistente: smishing. Pendrive com 'Folha de Pagamento.xlsx' deixado no estacionamento: baiting.",
    difficulty: "FACIL",
  },

  // -- 6. DICAI Aprofundado --
  {
    id: "inf_si_c06",
    title: "Principios DICAI: Nao-repudio e Autenticidade Aprofundados",
    textContent: `Os cinco principios fundamentais da Seguranca da Informacao formam o acronimo DICAI (ou CID em inglês CIA). Concursos avancados exploram especialmente Nao-repudio e Autenticidade, que sao os menos compreendidos.

OS 5 PRINCIPIOS — DICAI:
D — Disponibilidade: garantia de que sistemas e dados estejam acessiveis quando necessario para usuarios autorizados. Ataques: DoS/DDoS, falhas de hardware.
I — Integridade: garantia de que dados nao foram alterados de forma nao autorizada. Mecanismo: hash (MD5, SHA-256). Ataques: MitM, alteracao de arquivos.
C — Confidencialidade: garantia de que informacoes so sao acessiveis por partes autorizadas. Mecanismo: criptografia. Ataques: interceptacao, phishing.
A — Autenticidade: garantia de que a identidade do emissor/usuario e genuina. Mecanismo: assinatura digital, certificado digital, MFA.
I — Irretratabilidade (Nao-repudio): garantia de que o emissor NAO PODE NEGAR ter enviado uma mensagem ou realizado uma acao. Mecanismo: assinatura digital + carimbo de tempo (timestamp).

NAO-REPUDIO (Irretratabilidade) — APROFUNDAMENTO:
Impede que um usuario negue ter executado uma transacao ou enviado uma mensagem.
Mecanismo tecnico: assinatura digital (usa chave PRIVADA do emissor — so ele pode assinar).
Exemplo juridico: contrato eletronico assinado digitalmente via ICP-Brasil tem validade legal e o signatario nao pode negar.
Diferenca de autenticacao: autenticacao prova QUEM e o usuario no momento do acesso; nao-repudio prova que AQUELA ACAO especifica foi praticada por aquele usuario e nao pode ser negada depois.
Logs de auditoria + assinatura digital = base tecnica do nao-repudio em sistemas.

AUTENTICIDADE — APROFUNDAMENTO:
Verifica que a entidade (usuario, servidor, mensagem) e quem afirma ser.
Mecanismos: certificados digitais X.509 (ICP-Brasil), autenticacao multifator (MFA/2FA), HMAC (hash com chave secreta).
Autenticidade de mensagem vs. autenticidade de usuario:
  - Usuario: login + senha + token (MFA).
  - Mensagem: assinatura digital ou HMAC verifica que a mensagem nao foi alterada E veio do remetente correto.
Certificado digital ICP-Brasil: emitido por Autoridade Certificadora (AC) credenciada — garante autenticidade da chave publica de uma entidade.

MAPA DE ATAQUES X PRINCIPIOS:
Ataque de Replay         → compromete Autenticidade (identidade falsa via replay)
DDoS                     → compromete Disponibilidade
MitM com alteracao       → compromete Integridade + Confidencialidade
Repudiacao de transacao  → falha de Nao-repudio (sem assinatura digital)`,
    mnemonic: "DICAI: Disponibilidade, Integridade, Confidencialidade, Autenticidade, Irretratabilidade (Nao-repudio). Nao-repudio = chave PRIVADA assina = nao pode negar. Autenticidade = certificado + MFA. Integridade = hash. Confidencialidade = criptografia.",
    keyPoint: "Nao-repudio (irretratabilidade): impede que o autor negue a acao — mecanismo: assinatura digital com chave privada. Autenticidade: verifica identidade genuina — mecanismo: certificado digital, MFA, HMAC. Integridade: hash. Confidencialidade: criptografia. Disponibilidade: redundancia/anti-DDoS.",
    practicalExample: "Contribuinte envia declaracao do IR pelo e-CAC assinada digitalmente: nao-repudio garante que a Receita Federal pode provar que FOI voce. Usuario tenta negar transferencia bancaria autorizada: assinatura digital com token fisico impede o repudio. E-mail com hash SHA-256 verificado: integridade confirmada. HTTPS com certificado valido: autenticidade do servidor confirmada.",
    difficulty: "DIFICIL",
  },
];

// ============================================
// QUESTOES (12 no total, 2 por atomo)
// ============================================

const questions: QuestionData[] = [
  // ========== inf_si_c01 — Backup ==========

  // Q01 FACIL
  {
    id: "inf_si_q01",
    contentTitle: "Backup: Completo, Incremental e Diferencial",
    statement: "Em relacao aos tipos de backup, assinale a alternativa CORRETA sobre o backup diferencial.",
    alternatives: [
      { letter: "A", text: "O backup diferencial copia apenas os arquivos alterados desde o ultimo backup de qualquer tipo (completo ou incremental)." },
      { letter: "B", text: "O backup diferencial zera o bit de arquivo (archive bit) apos a realizacao da copia." },
      { letter: "C", text: "O backup diferencial copia todos os arquivos alterados desde o ultimo backup COMPLETO e nao zera o bit de arquivo." },
      { letter: "D", text: "A restauracao via backup diferencial exige o backup completo e todos os backups diferenciais intermediarios." },
      { letter: "E", text: "O backup diferencial ocupa menos espaco que o incremental para o mesmo periodo de tempo." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O backup diferencial copia TUDO que mudou desde o ultimo backup COMPLETO — independentemente de backups diferenciais intermediarios. Por isso cresce progressivamente a cada dia. O bit de arquivo NAO e zerado, diferentemente do completo e do incremental. Na restauracao, sao necessarios apenas 2 conjuntos de midia: o completo + o ultimo diferencial.",
    explanationCorrect: "Correto! Diferencial = desde o ultimo COMPLETO + NAO zera bit de arquivo. Isso o diferencia do incremental (que copia desde o ultimo backup de qualquer tipo e ZERA o bit).",
    explanationWrong: "Atencao: o diferencial copia desde o ultimo COMPLETO (nao desde o ultimo backup de qualquer tipo — isso e incremental). E ele NAO zera o bit de arquivo. Na restauracao, apenas 2 midias sao necessarias: completo + ultimo diferencial.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q02 MEDIO
  {
    id: "inf_si_q02",
    contentTitle: "Backup: Completo, Incremental e Diferencial",
    statement: "Uma empresa realiza backup completo todo domingo e backups incrementais de segunda a sabado. Ocorre uma falha catastrofica na quarta-feira as 23h. Para restaurar o sistema ao estado do final de quarta-feira, a equipe de TI precisara utilizar, NO MINIMO, quantas midias de backup?",
    alternatives: [
      { letter: "A", text: "1 midia (apenas o backup completo do domingo)." },
      { letter: "B", text: "2 midias (backup completo + backup incremental de quarta)." },
      { letter: "C", text: "4 midias (backup completo + incrementais de segunda, terca e quarta)." },
      { letter: "D", text: "3 midias (backup completo + incrementais de terca e quarta)." },
      { letter: "E", text: "7 midias (todos os backups da semana)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Com backup incremental, cada copia contem apenas o que mudou desde o backup ANTERIOR (seja ele completo ou incremental). Para restaurar ao estado de quarta-feira, e necessario: (1) backup completo do domingo, (2) incremental de segunda, (3) incremental de terca, (4) incremental de quarta — totalizando 4 midias em sequencia. Este e o principal ponto fraco do incremental: restauracao lenta e que exige toda a cadeia.",
    explanationCorrect: "Perfeito! Incremental = cadeia completa: completo + todos os incrementais ate a data desejada. Domingo + Seg + Ter + Qua = 4 midias.",
    explanationWrong: "Lembre-se: incremental copia apenas o que mudou desde o ULTIMO backup (qualquer tipo). Para restaurar quarta: completo (domingo) + incremental segunda + incremental terca + incremental quarta = 4 midias. Se fosse diferencial, seriam apenas 2 (completo + diferencial de quarta).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ========== inf_si_c02 — Ataques de Rede ==========

  // Q03 FACIL
  {
    id: "inf_si_q03",
    contentTitle: "Ataques de Rede: DoS, DDoS, Man-in-the-Middle e Replay",
    statement: "O ataque do tipo DDoS (Distributed Denial of Service) se distingue do DoS (Denial of Service) classico principalmente por:",
    alternatives: [
      { letter: "A", text: "Utilizar criptografia para mascarar o trafego malicioso." },
      { letter: "B", text: "Ser originado de multiplas fontes distribuidas (botnet), tornando a mitigacao mais complexa." },
      { letter: "C", text: "Explorar vulnerabilidades na camada de aplicacao exclusivamente, enquanto o DoS atua na camada de rede." },
      { letter: "D", text: "Comprometer a integridade dos dados, enquanto o DoS compromete apenas a confidencialidade." },
      { letter: "E", text: "Ser sempre silencioso e dificil de detectar, ao contrario do DoS, que gera alertas imediatos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A diferenca fundamental entre DoS e DDoS e a ORIGEM do ataque. DoS: 1 fonte. DDoS: multiplas fontes coordenadas (botnet — rede de dispositivos comprometidos, chamados de 'zumbis', controlados por um servidor C2). O DDoS e muito mais dificil de mitigar porque o trafego malicioso vem de milhares de IPs distintos, impossibilitando o simples bloqueio de uma origem. Ambos comprometem DISPONIBILIDADE.",
    explanationCorrect: "Correto! DDoS = Distributed = multiplas fontes via botnet. Isso e o que o torna tao devastador e dificil de bloquear.",
    explanationWrong: "A diferenca central entre DoS e DDoS e a quantidade de origens: DoS = 1 origem; DDoS = multiplas origens (botnet). Ambos comprometem disponibilidade, podem atuar em varias camadas, e sao detectaveis. A criptografia nao e caracteristica do DDoS.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q04 MEDIO
  {
    id: "inf_si_q04",
    contentTitle: "Ataques de Rede: DoS, DDoS, Man-in-the-Middle e Replay",
    statement: "Analise o cenario: um analista de seguranca detecta que tokens de autenticacao validos estao sendo reutilizados horas apos a sessao original, permitindo acesso nao autorizado ao sistema. A contramedida mais adequada para esse tipo especifico de ataque e:",
    alternatives: [
      { letter: "A", text: "Criptografar o trafego com TLS — impede a leitura dos tokens em transito." },
      { letter: "B", text: "Implementar firewall de aplicacao web (WAF) para bloquear IPs suspeitos." },
      { letter: "C", text: "Utilizar NONCE (numero utilizado uma unica vez) e timestamps de expiracao nos tokens de sessao." },
      { letter: "D", text: "Adotar autenticacao por certificado digital para substituir o uso de tokens." },
      { letter: "E", text: "Aumentar a complexidade da senha exigida para autenticacao." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O cenario descreve um ataque de REPLAY: o atacante capturou tokens validos e os reutiliza. A criptografia (alternativa A) nao resolve — o atacante nao precisa decifrar, apenas reenviar o token capturado. A contramedida especifica para replay e usar NONCE (cada token e valido para uma unica requisicao) combinado com timestamp de expiracao curta — mesmo que o token seja capturado, nao pode ser reutilizado.",
    explanationCorrect: "Exato! Ataque de Replay = reutilizacao de dados validos capturados. Contramedida = NONCE (uso unico) + timestamp de expiracao. A criptografia nao basta pois o atacante nao precisa decifrar — so reenvia.",
    explanationWrong: "Este e um ataque de Replay — o atacante usa tokens VALIDOS capturados, sem precisar decifrar nada. Logo, TLS ajuda a dificultar a captura, mas nao e a contramedida ESPECIFICA. O NONCE (numero de uso unico) + timestamp e a solucao canonicamente correta para replay.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ========== inf_si_c03 — VPN ==========

  // Q05 FACIL
  {
    id: "inf_si_q05",
    contentTitle: "VPN e Protocolos de Tunelamento: IPSec, SSL/TLS e L2TP",
    statement: "Em relacao ao protocolo IPSec, e CORRETO afirmar que:",
    alternatives: [
      { letter: "A", text: "O protocolo AH (Authentication Header) do IPSec garante autenticacao E criptografia dos dados transmitidos." },
      { letter: "B", text: "O modo transporte do IPSec criptografa o pacote IP inteiro, incluindo o cabecalho IP original." },
      { letter: "C", text: "O protocolo ESP (Encapsulating Security Payload) garante autenticacao, integridade e criptografia dos dados." },
      { letter: "D", text: "O IPSec opera na camada de aplicacao (camada 7) do modelo OSI." },
      { letter: "E", text: "O L2TP, por si so, oferece criptografia nativa equivalente ao IPSec." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O ESP (Encapsulating Security Payload) e o componente do IPSec que oferece autenticacao, integridade E criptografia. O AH (Authentication Header) oferece apenas autenticacao e integridade — SEM criptografia. O modo transporte criptografa apenas o payload (nao o cabecalho IP inteiro — isso e o modo tunel). O IPSec opera na camada 3 (Rede). O L2TP nao possui criptografia propria — e sempre combinado com IPSec.",
    explanationCorrect: "Correto! ESP = autentica + integridade + criptografia. AH = autentica + integridade APENAS (sem criptografar). Essa distincao cai muito em provas de PF e CESPE.",
    explanationWrong: "Atencao: AH nao criptografa — apenas autentica e verifica integridade. O ESP e que criptografa. O modo TUNEL criptografa o pacote inteiro; o modo TRANSPORTE so o payload. IPSec e camada 3. L2TP nao tem criptografia propria.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q06 MEDIO
  {
    id: "inf_si_q06",
    contentTitle: "VPN e Protocolos de Tunelamento: IPSec, SSL/TLS e L2TP",
    statement: "Uma organizacao precisa disponibilizar acesso remoto seguro para funcionarios que trabalham de casa, utilizando apenas um navegador web comum, sem a necessidade de instalar um cliente VPN dedicado. O protocolo mais adequado para esse cenario e:",
    alternatives: [
      { letter: "A", text: "IPSec em modo tunel com protocolo AH." },
      { letter: "B", text: "L2TP/IPSec — protocolo nativo do sistema operacional." },
      { letter: "C", text: "PPTP — protocolo mais simples e amplamente suportado." },
      { letter: "D", text: "VPN baseada em SSL/TLS (ex: OpenVPN ou SSL VPN) — acessivel via navegador." },
      { letter: "E", text: "IPSec em modo transporte — mais leve e adequado para acesso remoto individual." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "O requisito central e 'apenas um navegador web, sem cliente dedicado'. Isso define SSL/TLS VPN — a tecnologia que opera sobre HTTPS e pode ser acessada por qualquer navegador moderno. IPSec (modos tunel ou transporte) e L2TP/IPSec exigem configuracao de cliente VPN especifico no sistema operacional. PPTP e obsoleto e inseguro (uso deve ser evitado). SSL VPN e a solucao corporativa moderna para acesso remoto via browser.",
    explanationCorrect: "Correto! SSL/TLS VPN = acesso via browser, sem instalacao de cliente. E a solucao ideal para acesso remoto quando se quer simplicidade e compatibilidade maxima.",
    explanationWrong: "O ponto chave e 'sem cliente VPN dedicado, apenas navegador'. Isso elimina IPSec e L2TP (exigem configuracao no SO) e PPTP (inseguro e obsoleto). A resposta correta e SSL/TLS VPN — opera sobre HTTPS, acessivel por qualquer browser.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ========== inf_si_c04 — Gestao de Vulnerabilidades ==========

  // Q07 MEDIO
  {
    id: "inf_si_q07",
    contentTitle: "Gestao de Vulnerabilidades: CVE, CVSS e Patch Management",
    statement: "O sistema CVSS (Common Vulnerability Scoring System) e utilizado para classificar a severidade de vulnerabilidades de seguranca. Uma vulnerabilidade com score CVSS de 9.5 e classificada como:",
    alternatives: [
      { letter: "A", text: "Alta — exige correcao em ate 30 dias conforme boas praticas de Patch Management." },
      { letter: "B", text: "Critica — score entre 9.0 e 10.0, demandando atencao e correcao imediata." },
      { letter: "C", text: "Media — score entre 7.0 e 9.9 conforme escala CVSS v3.1." },
      { letter: "D", text: "Maxima — score acima de 9.0 e classificado como 'Maxima' no padrao CVSS." },
      { letter: "E", text: "Alta — pois apenas o score 10.0 e considerado Critico no CVSS." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "No CVSS v3.1, a escala de classificacao e: 0.0 = Nenhuma; 0.1-3.9 = Baixa; 4.0-6.9 = Media; 7.0-8.9 = Alta; 9.0-10.0 = CRITICA. Um score de 9.5 cai exatamente na faixa Critica. A alternativa D usa a nomenclatura 'Maxima', que nao existe no padrao CVSS. A Alta abrange apenas 7.0 a 8.9. Vulnerabilidades criticas devem ser tratadas com SLA de horas, nao dias.",
    explanationCorrect: "Correto! CVSS 9.0-10.0 = CRITICA. Score 9.5 = critico. Boas praticas de seguranca recomendam patch em menos de 72h para vulnerabilidades criticas.",
    explanationWrong: "No CVSS v3.1: Alta = 7.0 a 8.9. CRITICA = 9.0 a 10.0. Score 9.5 e Critico, nao Alto. Nao existe a classificacao 'Maxima' no CVSS. E todo o range 9.0-10.0 e critico — nao apenas o 10.0.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q08 DIFICIL
  {
    id: "inf_si_q08",
    contentTitle: "Gestao de Vulnerabilidades: CVE, CVSS e Patch Management",
    statement: "Considere a seguinte afirmacao: 'Uma vulnerabilidade Zero-day, por definicao, ja possui patch disponivel do fabricante no momento em que e explorada pelos atacantes, o que justifica a urgencia na aplicacao do patch pelas equipes de TI.' Essa afirmacao e:",
    alternatives: [
      { letter: "A", text: "Correta, pois o termo 'zero-day' refere-se ao dia zero de aplicacao do patch ja lancado pelo fabricante." },
      { letter: "B", text: "Correta, pois o CVE so e publicado apos o patch estar disponivel, garantindo o tempo de correcao." },
      { letter: "C", text: "Incorreta, pois uma vulnerabilidade Zero-day e explorada ANTES que o fabricante tome conhecimento ou lance patch — sem correcao disponivel no momento da exploracao." },
      { letter: "D", text: "Incorreta, pois vulnerabilidades Zero-day nunca recebem patches — sao tratadas apenas com workarounds permanentes." },
      { letter: "E", text: "Correta parcialmente, pois o patch existe mas nao foi testado e aprovado para producao." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A afirmacao e INCORRETA. 'Zero-day' significa que a vulnerabilidade foi explorada com ZERO dias de aviso para o fabricante — ou seja, antes que o fabricante soubesse do problema e, portanto, sem patch disponivel. E a situacao mais perigosa em seguranca da informacao pois nao existe correcao imediata. A equipe de seguranca deve adotar workarounds temporarios (desativar servicos, isolar sistemas) ate o fabricante lancar o patch. A alternativa C expressa corretamente esse conceito.",
    explanationCorrect: "Correto! Zero-day = 0 dias de conhecimento previo do fabricante = SEM patch no momento da exploracao. E a pior situacao possivel para uma equipe de seguranca pois nao ha correcao disponivel.",
    explanationWrong: "Pegadinha classica de banca! Zero-day NAO tem patch disponivel. O 'zero' refere-se ao tempo que o fabricante teve para corrigir antes da exploracao — ou seja, zero dias. Quando o patch existe, deixa de ser zero-day tecnicamente. Ate o patch ser lancado, a defesa e por workarounds.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ========== inf_si_c05 — Engenharia Social ==========

  // Q09 FACIL
  {
    id: "inf_si_q09",
    contentTitle: "Engenharia Social: Phishing, Vishing, Smishing e Pretexting",
    statement: "Um funcionario de uma empresa recebe um SMS com o seguinte texto: 'Seu pacote dos Correios esta retido por falta de pagamento de taxa aduaneira. Regularize agora: [link encurtado]'. Esse tipo de ataque de engenharia social e denominado:",
    alternatives: [
      { letter: "A", text: "Phishing" },
      { letter: "B", text: "Vishing" },
      { letter: "C", text: "Smishing" },
      { letter: "D", text: "Pretexting" },
      { letter: "E", text: "Pharming" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O canal de entrega do ataque define a nomenclatura: Phishing = e-mail; Vishing = voz (telefone); Smishing = SMS/mensagem de texto; Pharming = envenenamento de DNS. O cenario descreve um ataque via SMS, portanto e SMISHING. O conteudo (falsa retencao de pacote + link malicioso) e classico do smishing. Pretexting e uma tecnica de construcao de cenario que pode usar qualquer canal, mas o nome especifico por canal aqui e smishing.",
    explanationCorrect: "Correto! SMS + link malicioso = SMISHING. A formula e simples: o canal define o nome. E-mail = phishing, telefone = vishing, SMS = smishing.",
    explanationWrong: "Atencao ao canal: phishing = e-mail, vishing = voz/telefone, smishing = SMS ou mensageiro de texto. A mensagem chegou via SMS, entao e smishing. Pharming e diferente — envenena o DNS para redirecionar URLs legitimas para sites falsos.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q10 MEDIO
  {
    id: "inf_si_q10",
    contentTitle: "Engenharia Social: Phishing, Vishing, Smishing e Pretexting",
    statement: "Um atacante pesquisa no LinkedIn o nome do gerente de TI de uma empresa, descobre que ele usa o sistema SAP e que ha uma reuniao de diretoria na proxima semana. Em seguida, envia um e-mail para a secretaria da empresa dizendo: 'Oi [nome da secretaria], sou [nome real do gerente], preciso de urgencia que voce me envie as credenciais de acesso ao SAP antes da reuniao de quinta — meu acesso expirou.' Esse tipo de ataque e classificado como:",
    alternatives: [
      { letter: "A", text: "Phishing convencional — ataque por e-mail com link malicioso." },
      { letter: "B", text: "Vishing — o atacante usa informacoes de voz para convencer a vitima." },
      { letter: "C", text: "Spear Phishing — e-mail de phishing direcionado e personalizado com informacoes reais da vitima." },
      { letter: "D", text: "Baiting — o atacante usa uma isca (a urgencia da reuniao) para obter acesso." },
      { letter: "E", text: "Whaling — ataque direcionado especificamente ao gerente de TI (executivo de alto nivel)." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O ataque e via e-mail (canal = phishing), MAS e altamente personalizado com dados reais coletados antecipadamente (nome do gerente, sistema SAP, data da reuniao). Isso define SPEAR PHISHING — phishing direcionado. Phishing convencional seria um e-mail generico sem personalizacao. Whaling e spear phishing direcionado a EXECUTIVOS de alto escalao (CEO, CFO) — o gerente de TI pode nao se qualificar como alvo whaling e, mais importante, o ALVO do ataque aqui e a SECRETARIA, nao o gerente. Baiting usa isca fisica (pendrive). O elemento de 'urgencia' e tecnica de engenharia social, nao define o tipo.",
    explanationCorrect: "Correto! E-mail personalizado com dados reais coletados sobre a vitima = SPEAR PHISHING. A pesquisa previa no LinkedIn + uso de nome real + detalhes especificos (SAP, reuniao) sao as marcas registradas do spear phishing.",
    explanationWrong: "Phishing convencional = e-mail generico. Spear phishing = e-mail DIRECIONADO com pesquisa previa e dados reais. Whaling = spear phishing cujo alvo e um EXECUTIVO de alto escalao (CEO, CFO, CMO). Baiting = isca fisica (pendrive). O canal aqui e e-mail com personalizacao = spear phishing.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ========== inf_si_c06 — DICAI ==========

  // Q11 MEDIO
  {
    id: "inf_si_q11",
    contentTitle: "Principios DICAI: Nao-repudio e Autenticidade Aprofundados",
    statement: "Qual principio da seguranca da informacao e diretamente garantido pela assinatura digital com uso da chave PRIVADA do emissor, impedindo que este negue posteriormente ter enviado uma mensagem ou realizado uma transacao eletronicamente?",
    alternatives: [
      { letter: "A", text: "Confidencialidade — a chave privada garante que apenas o destinatario possa ler a mensagem." },
      { letter: "B", text: "Integridade — a assinatura digital verifica que o conteudo nao foi alterado em transito." },
      { letter: "C", text: "Disponibilidade — a assinatura garante que o sistema esteja disponivel para processar a transacao." },
      { letter: "D", text: "Irretratabilidade (Nao-repudio) — o emissor nao pode negar a autoria da acao assinada com sua chave privada." },
      { letter: "E", text: "Autenticidade — a assinatura digital comprova a identidade do emissor no momento do acesso." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "A assinatura digital com chave PRIVADA e o mecanismo tecnico canonico do NAO-REPUDIO (irretratabilidade). Como so o detentor da chave privada pode assinar, qualquer mensagem assinada com ela prova indubitavelmente a autoria — o emissor nao pode negar ('repudiar') ter assinado. Confidencialidade usa criptografia com chave PUBLICA do destinatario (nao privada do emissor). Integridade e garantida pelo hash, mas a assinatura digital vai alem: prova tambem a autoria. Autenticidade confirma identidade no acesso, mas nao impede repudiacao posterior.",
    explanationCorrect: "Correto! Chave privada + assinatura digital = NAO-REPUDIO. So o dono da chave privada pode assinar — portanto nao pode negar a autoria. Esse e o principio 'I' do DICAI (Irretratabilidade).",
    explanationWrong: "Distincao critica: Autenticidade = prova QUEM e o usuario no momento do acesso. Nao-repudio = prova que AQUELA ACAO especifica foi praticada e o autor NAO PODE NEGAR depois. A chave privada assina = nao-repudio. Confidencialidade usa a chave PUBLICA do destinatario para criptografar.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // Q12 DIFICIL
  {
    id: "inf_si_q12",
    contentTitle: "Principios DICAI: Nao-repudio e Autenticidade Aprofundados",
    statement: "Considere o seguinte cenario: um sistema bancario autentica o usuario com login e senha (fator 1) e token fisico (fator 2). Apos a autenticacao bem-sucedida, o usuario realiza uma transferencia de R$ 50.000,00. Dias depois, o usuario alega que nao realizou a transferencia. O principio de seguranca da informacao que a instituicao devera invocar para refutar essa alegacao, e o mecanismo tecnico que o sustenta, sao, respectivamente:",
    alternatives: [
      { letter: "A", text: "Autenticidade — certificado digital X.509 da sessao HTTPS." },
      { letter: "B", text: "Integridade — hash SHA-256 do log da transacao." },
      { letter: "C", text: "Nao-repudio — assinatura digital da transacao com a chave privada do usuario e logs de auditoria com timestamp." },
      { letter: "D", text: "Disponibilidade — logs de disponibilidade do sistema no momento da transacao." },
      { letter: "E", text: "Confidencialidade — criptografia TLS garantindo que apenas o usuario e o banco viram os dados." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O usuario esta tentando REPUDIAR (negar) uma acao que realizou. O principio que impede isso e o NAO-REPUDIO (Irretratabilidade). O mecanismo tecnico e a assinatura digital da transacao com a chave privada do usuario (so ele pode assinar) combinado com logs de auditoria com carimbo de tempo (timestamp) que registram a acao. O MFA (login + token) garante a AUTENTICIDADE no momento do acesso, mas para o nao-repudio posterior e necessaria a assinatura digital especifica da transacao. Integridade garante que o log nao foi alterado, mas nao prova autoria. A alternativa C combina corretamente principio + mecanismo.",
    explanationCorrect: "Excelente! Repudiacao de transacao = ataca o Nao-repudio. Defesa = assinatura digital com chave privada + logs auditados com timestamp. O MFA prova autenticidade no login; a assinatura digital prova autoria na TRANSACAO especifica.",
    explanationWrong: "Pegadinha de nivel 'Elite': autenticidade (MFA) prova que o usuario era quem dizia ser no LOGIN — mas nao impede repudiacao da TRANSACAO especifica. Para provar que ELE realizou AQUELA transferencia e que nao pode negar, o mecanismo e o Nao-repudio via assinatura digital da transacao + logs auditados. Integridade (hash) prova que o log nao foi alterado, mas nao prova autoria.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("==============================================");
  console.log(" Seed R28 — Seguranca da Informacao Avancada");
  console.log("==============================================\n");

  // ── Phase 1: Subject ────────────────────────────────────────────────────────
  console.log("[ Phase 1 ] Buscando Subject: Informatica...");
  const subjectId = await findSubject("Informatica");
  if (!subjectId) {
    console.error("ERRO: Subject 'Informatica' nao encontrado. Verifique o banco de dados.");
    process.exit(1);
  }
  console.log(`  OK subjectId: ${subjectId}\n`);

  // ── Phase 2: Topic ──────────────────────────────────────────────────────────
  console.log("[ Phase 2 ] Garantindo Topic: Seguranca da Informacao...");
  const topicId = await findOrCreateTopic("Seguranca da Informacao", subjectId);
  console.log(`  OK topicId: ${topicId}\n`);

  // ── Phase 3: Contents ───────────────────────────────────────────────────────
  console.log("[ Phase 3 ] Inserindo atomos de conteudo...");

  // Phase 5 column guarantees for Content
  const contentColGuarantees = [
    sql`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS "mnemonic" TEXT`,
    sql`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS "keyPoint" TEXT`,
    sql`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS "practicalExample" TEXT`,
  ];
  for (const stmt of contentColGuarantees) {
    try { await db.execute(stmt); } catch (_e) { /* coluna ja existe */ }
  }

  for (const c of contents) {
    const exists = await contentExists(c.title, subjectId);
    if (exists) {
      console.log(`  skip  Conteudo ja existe: ${c.title}`);
      continue;
    }
    await db.execute(sql`
      INSERT INTO "Content" (
        id, title, "textContent", "subjectId", "topicId",
        "mnemonic", "keyPoint", "practicalExample",
        difficulty, "isActive", "createdAt", "updatedAt"
      ) VALUES (
        ${c.id}, ${c.title}, ${c.textContent}, ${subjectId}, ${topicId},
        ${c.mnemonic}, ${c.keyPoint}, ${c.practicalExample},
        ${c.difficulty}, true, NOW(), NOW()
      )
    `);
    console.log(`  OK Conteudo inserido: ${c.title} (${c.id})`);
  }
  console.log();

  // ── Phase 4: Build contentIdMap ─────────────────────────────────────────────
  console.log("[ Phase 4 ] Construindo mapa contentTitle → contentId...");
  const contentIdMap: Record<string, string> = {};
  for (const c of contents) {
    const id = await getContentId(c.title, subjectId);
    if (id) {
      contentIdMap[c.title] = id;
      console.log(`  mapa: '${c.title}' → ${id}`);
    } else {
      console.warn(`  AVISO: conteudo nao encontrado no banco: ${c.title}`);
    }
  }
  console.log();

  // ── Phase 5: Questions ──────────────────────────────────────────────────────
  console.log("[ Phase 5 ] Inserindo questoes...");

  // Phase 5 column guarantees for Question
  const questionColGuarantees = [
    sql`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "explanationCorrect" TEXT`,
    sql`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "explanationWrong" TEXT`,
    sql`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "correctAnswer" TEXT`,
  ];
  for (const stmt of questionColGuarantees) {
    try { await db.execute(stmt); } catch (_e) { /* coluna ja existe */ }
  }

  for (const q of questions) {
    const exists = await questionExists(q.id);
    if (exists) {
      console.log(`  skip  Questao ja existe: ${q.id}`);
      continue;
    }

    const resolvedContentId = contentIdMap[q.contentTitle] ?? null;
    if (!resolvedContentId) {
      console.warn(`  AVISO: contentId nao resolvido para questao ${q.id} (contentTitle: '${q.contentTitle}')`);
    }

    const optA = q.alternatives.find(a => a.letter === "A")?.text ?? "";
    const optB = q.alternatives.find(a => a.letter === "B")?.text ?? "";
    const optC = q.alternatives.find(a => a.letter === "C")?.text ?? "";
    const optD = q.alternatives.find(a => a.letter === "D")?.text ?? "";
    const optE = q.alternatives.find(a => a.letter === "E")?.text ?? null;

    await db.execute(sql`
      INSERT INTO "Question" (
        id, statement, "optionA", "optionB", "optionC", "optionD", "optionE",
        "correctAnswer", "correctOption",
        explanation, "explanationCorrect", "explanationWrong",
        difficulty, "questionType",
        "subjectId", "topicId", "contentId",
        "isActive", "timesUsed", "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${optA}, ${optB}, ${optC}, ${optD}, ${optE},
        ${q.correctAnswer}, ${q.correctOption},
        ${q.explanation}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${q.difficulty}, ${q.questionType},
        ${subjectId}, ${topicId}, ${resolvedContentId},
        true, 0, NOW(), NOW()
      )
    `);
    console.log(`  OK Questao inserida: ${q.id} [${q.difficulty}] → content: ${resolvedContentId ?? "ORFAO"}`);
  }
  console.log();

  // ── Backfill: vincular questoes orfas ao topico ─────────────────────────────
  console.log("[ Backfill ] Vinculando questoes sem topicId ao topic correto...");
  const backfill = await db.execute(sql`
    UPDATE "Question"
    SET "topicId" = ${topicId}
    WHERE "subjectId" = ${subjectId}
      AND "topicId" IS NULL
      AND id IN (${sql.join(questions.map(q => sql`${q.id}`), sql`, `)})
    RETURNING id
  `) as any[];
  if (backfill.length > 0) {
    console.log(`  OK Backfill: ${backfill.length} questao(oes) vinculada(s) ao topicId ${topicId}`);
  } else {
    console.log("  skip  Nenhuma questao orfaa para vincular.");
  }
  console.log();

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log("==============================================");
  console.log(" Seed R28 concluido com sucesso!");
  console.log(`   - 6 atomos de conteudo (inf_si_c01 a inf_si_c06)`);
  console.log(`   - 12 questoes (inf_si_q01 a inf_si_q12)`);
  console.log(`   - 4 FACIL | 6 MEDIO | 2 DIFICIL`);
  console.log(`   - Subject: Informatica (${subjectId})`);
  console.log(`   - Topic: Seguranca da Informacao (${topicId})`);
  console.log("==============================================");
}

main()
  .catch((err) => {
    console.error("ERRO FATAL no seed R28:", err);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
