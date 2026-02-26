/**
 * Seed: Informática — Segurança da Informação
 * (Princípios DICAI, Malware, Phishing, Criptografia e MFA)
 *
 * Popula 6 átomos de Conteúdo + 12 Questões.
 * Idempotente: verifica existência antes de inserir.
 *
 * Execução:
 *   npx tsx db/seed-informatica-seguranca.ts
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
  const rows = await db.execute(sql`
    SELECT id FROM "Subject" WHERE name ILIKE ${"%" + name + "%"} LIMIT 1
  `) as any[];
  return rows[0]?.id ?? null;
}

async function findOrCreateTopic(name: string, subjectId: string): Promise<string> {
  const rows = await db.execute(sql`
    SELECT id FROM "Topic" WHERE name ILIKE ${name} AND "subjectId" = ${subjectId} LIMIT 1
  `) as any[];
  if (rows[0]?.id) {
    console.log(`  ⏭  Tópico já existe: ${name}`);
    return rows[0].id;
  }
  const id = nanoId("tp");
  await db.execute(sql`
    INSERT INTO "Topic" (id, name, "subjectId", "createdAt", "updatedAt")
    VALUES (${id}, ${name}, ${subjectId}, NOW(), NOW())
  `);
  console.log(`  ✅ Tópico criado: ${name} (${id})`);
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
// CONTEÚDOS (6 átomos — < 500 chars cada)
// ============================================

interface ContentAtom {
  title: string;
  textContent: string;
  mnemonic: string;
  keyPoint: string;
  practicalExample: string;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
}

const contents: ContentAtom[] = [
  // ── 1. Princípios DICAI ───────────────────────────────────────────────────
  {
    title: "Segurança da Informação: Princípios DICAI",
    textContent: `Os 5 pilares da Segurança da Informação — DICAI: Disponibilidade (sistema acessível quando necessário), Integridade (dados não alterados indevidamente), Confidencialidade (acesso apenas a autorizados), Autenticidade (garantia da identidade do emissor) e Irretratabilidade/Não-repúdio (emissor não pode negar o envio). Alguns normativos adicionam Legalidade e Privacidade.`,
    mnemonic: "DICAI: Disponibilidade · Integridade · Confidencialidade · Autenticidade · Irretratabilidade. 'Di Ci Au Ir' — a sigla mais cobrada de Informática em concursos.",
    keyPoint: "DDoS viola Disponibilidade. Alteração de registro viola Integridade. Vazamento de dados viola Confidencialidade. Spoofing de identidade viola Autenticidade.",
    practicalExample: "Sistemas da delegacia fora do ar por ataque DDoS = violação de Disponibilidade. Vazamento da base de dados de investigados = violação de Confidencialidade. Adulteração de laudo digital = violação de Integridade.",
    difficulty: "FACIL",
  },
  // ── 2. Vírus vs. Worm ────────────────────────────────────────────────────
  {
    title: "Malware: Vírus e Worm — A Diferença Fundamental",
    textContent: `VÍRUS: precisa de um HOSPEDEIRO (arquivo executável) para existir e propagar-se — depende de ação do usuário para se espalhar. WORM (verme): auto-replica-se de forma autônoma pela rede, explorando vulnerabilidades de sistemas, SEM necessidade de hospedeiro ou interação humana. Worms causam degradação da rede pelo alto volume de tráfego gerado na auto-propagação.`,
    mnemonic: "VÍRUS = hospedeiro obrigatório (como um vírus biológico). WORM = autônomo, rasteja sozinho pela rede (como uma minhoca).",
    keyPoint: "A diferença central: VÍRUS precisa de arquivo hospedeiro + ação do usuário. WORM não precisa de hospedeiro e se propaga automaticamente — por isso worms são mais rápidos e difíceis de conter.",
    practicalExample: "Computador do investigador recebe pen-drive com vírus: só infecta se executar o arquivo. Worm como WannaCry (2017): propagou-se sozinho por toda a rede da Polícia Nacional UK sem nenhuma ação dos usuários.",
    difficulty: "FACIL",
  },
  // ── 3. Bot, Trojan, Ransomware e Spyware ─────────────────────────────────
  {
    title: "Malware: Bot, Trojan, Ransomware e Spyware",
    textContent: `BOT: transforma o dispositivo em 'zumbi' controlado remotamente (C&C); grupo de bots = BOTNET. TROJAN (cavalo de Tróia): disfarça-se de software legítimo para enganar o usuário e instalar código malicioso. RANSOMWARE: cifra os arquivos e exige resgate (ransom) em criptomoeda para restaurar o acesso. SPYWARE: monitora silenciosamente as atividades e transmite dados (senhas, hábitos) ao atacante.`,
    mnemonic: "BTRS: Bot (zumbi), Trojan (disfarce), Ransomware (sequestro de dados), Spyware (espião). Cada um tem sua tática, todos são maliciosos.",
    keyPoint: "Ransomware: nunca pagar sem garantia — não há obrigação do criminoso em devolver o acesso. A solução correta é: isolamento da máquina + restore de backup limpo + comunicação ao CSIRT.",
    practicalExample: "Criminoso envia 'atualização de firmware' para computador da delegacia (Trojan). Ao executar, instala ransomware que cifra todos os boletins de ocorrência. Exige 5 BTC para devolver o acesso.",
    difficulty: "MEDIO",
  },
  // ── 4. Phishing e Engenharia Social ──────────────────────────────────────
  {
    title: "Phishing e Engenharia Social",
    textContent: `Phishing: mensagens fraudulentas que simulam fontes confiáveis (bancos, órgãos públicos) para roubar credenciais ou instalar malware. Engenharia Social: manipulação psicológica de pessoas para obter informações — explora o elo humano, não técnico. Variantes: Spear Phishing (alvo específico, personalizado), Vishing (voz/telefone), Smishing (SMS), Whaling (alvo é executivo/alto cargo).`,
    mnemonic: "Phishing = isca digital. Spear = lança (alvo específico). Vishing = voz. Smishing = SMS. Whaling = baleia (grande alvo). ENGENHARIA SOCIAL = atacar o humano, não o sistema.",
    keyPoint: "O phishing explora o princípio da urgência e autoridade — 'sua conta será bloqueada em 24h, clique aqui'. Verificar sempre o domínio real do remetente e nunca clicar em links de e-mails suspeitos.",
    practicalExample: "Policial federal recebe e-mail do 'Ministério da Justiça' solicitando login em link urgente para 'recadastramento'. URL real é 'mj-gov.com.br' (falso). Isso é Spear Phishing — alvo específico, domínio clonado.",
    difficulty: "MEDIO",
  },
  // ── 5. Criptografia Simétrica vs. Assimétrica ────────────────────────────
  {
    title: "Criptografia: Simétrica vs. Assimétrica (Chave Pública)",
    textContent: `SIMÉTRICA: mesma chave para cifrar e decifrar (ex.: AES-256, DES). Rápida, mas exige canal seguro para distribuir a chave. ASSIMÉTRICA: par de chaves — chave PÚBLICA (distribuída livremente, cifra mensagens ou verifica assinatura) e chave PRIVADA (secreta, decifra mensagens ou assina). O HTTPS usa assimétrica para negociar a chave simétrica da sessão (TLS Handshake).`,
    mnemonic: "SIMÉTRICA = 1 chave (rapidez). ASSIMÉTRICA = par público+privado. Cifra com PÚBLICA → decifra com PRIVADA. Assina com PRIVADA → verifica com PÚBLICA.",
    keyPoint: "Para enviar mensagem sigilosa: cifre com a chave PÚBLICA do destinatário. Somente ele poderá decifrar com sua chave PRIVADA. Para assinar: assine com sua PRIVADA; qualquer um verifica com sua PÚBLICA.",
    practicalExample: "Agente da PF envia relatório sigiloso para o delegado: cifra com a chave PÚBLICA do delegado → só o delegado decifra com sua chave PRIVADA. O delegado assina o relatório com sua PRIVADA → qualquer um verifica a autoria com a PÚBLICA do delegado.",
    difficulty: "MEDIO",
  },
  // ── 6. MFA e Certificado Digital ─────────────────────────────────────────
  {
    title: "Autenticação Multifator (MFA) e Certificado Digital (ICP-Brasil)",
    textContent: `MFA combina dois ou mais fatores: SABE (senha, PIN), TEM (token OTP, celular, smart card), É (biometria — digital, íris, face). Certificado Digital: documento eletrônico que vincula criptograficamente a identidade a uma chave pública, emitido por Autoridade Certificadora (AC) credenciada. No Brasil, a ICP-Brasil regula os certificados e-CPF e e-CNPJ. Garante autenticidade e não-repúdio (Irretratabilidade do DICAI).`,
    mnemonic: "MFA = SABE + TEM + É (dois ou mais fatores distintos). Certificado Digital = identidade + chave pública chancelada por AC confiável.",
    keyPoint: "Dois fatores do MESMO tipo (ex.: senha + PIN) NÃO configuram MFA real — devem ser de categorias distintas. Certificado digital garante Autenticidade e Irretratabilidade — dois dos cinco pilares do DICAI.",
    practicalExample: "Login no sistema SINESP: senha (SABE) + código enviado ao celular corporativo (TEM) = MFA legítimo. Assinar um auto de prisão em flagrante digitalmente com e-CPF ICP-Brasil = certificado digital garantindo autoria e não-repúdio.",
    difficulty: "DIFICIL",
  },
];

// ============================================
// QUESTÕES (12)
// ============================================

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
  contentTitle: string;
}

const questions: QuestionData[] = [
  // ── Q1 — DICAI: Princípio violado pelo DDoS (Municipal / FACIL) ───────────
  {
    id: "qz_info_seg_001",
    statement: "A rede interna da delegacia fica indisponível por 6 horas em razão de um ataque volumétrico de negação de serviço (DDoS). Qual princípio da Segurança da Informação foi diretamente violado?",
    alternatives: [
      { letter: "A", text: "Confidencialidade — dados sigilosos foram expostos a terceiros." },
      { letter: "B", text: "Integridade — os dados foram alterados sem autorização." },
      { letter: "C", text: "Disponibilidade — o sistema ficou inacessível para os usuários legítimos." },
      { letter: "D", text: "Irretratabilidade — o atacante não pode negar ter enviado os pacotes." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "DDoS (Distributed Denial of Service) é um ataque que sobrecarrega o servidor com tráfego falso, tornando-o inacessível para usuários legítimos. Isso viola diretamente o princípio da DISPONIBILIDADE — a garantia de que o sistema estará acessível quando necessário. Não há exposição de dados (confidencialidade) nem alteração (integridade).",
    explanationCorrect: "Correto! DDoS = ataque à DISPONIBILIDADE. Sistema fora do ar = princípio D do DICAI violado. É o mapeamento mais direto e frequente em provas.",
    explanationWrong: "Lembre do DICAI: Disponibilidade = sistema acessível quando necessário. DDoS torna o sistema INDISPONÍVEL — é a violação clássica desse princípio. Confidencialidade seria vazamento de dados; Integridade seria adulteração.",
    difficulty: "FACIL",
    contentTitle: "Segurança da Informação: Princípios DICAI",
  },
  // ── Q2 — Vírus vs. Worm (Municipal / FACIL) ──────────────────────────────
  {
    id: "qz_info_seg_002",
    statement: "Sobre as características de vírus e worm, assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "O worm necessita de um arquivo hospedeiro para se propagar, enquanto o vírus se auto-replica autonomamente." },
      { letter: "B", text: "Vírus e worm são termos técnicos equivalentes para o mesmo tipo de software malicioso." },
      { letter: "C", text: "O vírus precisa de um arquivo hospedeiro e da ação do usuário para se propagar; o worm se replica automaticamente pela rede, sem hospedeiro." },
      { letter: "D", text: "O worm só afeta redes locais (LAN); o vírus pode se propagar pela Internet." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A distinção fundamental: VÍRUS depende de arquivo hospedeiro (ex.: documento .exe ou .docm infectado) e da ação do usuário para se executar e propagar. WORM é autossuficiente — explora vulnerabilidades de rede para se replicar automaticamente, sem intervenção humana. O WannaCry (2017) é o exemplo clássico de worm que devastou redes mundiais.",
    explanationCorrect: "Perfeito! VÍRUS = hospedeiro + ação do usuário. WORM = autônomo, propaga-se sozinho pela rede. Essa diferença é a mais cobrada sobre malware em concursos.",
    explanationWrong: "As alternativas foram invertidas! O VÍRUS precisa de hospedeiro; o WORM não. Pense em analogia biológica: vírus parasita o hospedeiro; worm (verme) rasteja sozinho pela rede.",
    difficulty: "FACIL",
    contentTitle: "Malware: Vírus e Worm — A Diferença Fundamental",
  },
  // ── Q3 — Ransomware (Municipal / FACIL) ──────────────────────────────────
  {
    id: "qz_info_seg_003",
    statement: "O tipo de malware que cifra os arquivos da vítima e exige pagamento em criptomoedas para restaurar o acesso denomina-se:",
    alternatives: [
      { letter: "A", text: "Spyware" },
      { letter: "B", text: "Adware" },
      { letter: "C", text: "Worm" },
      { letter: "D", text: "Ransomware" },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "Ransomware (de ransom = resgate) é o malware que 'sequestra' os dados — cifra os arquivos com chave que só o atacante possui e exige pagamento (geralmente em Bitcoin ou Monero) para fornecer a chave de descriptografia. Exemplos reais: WannaCry, Ryuk, LockBit. Spyware monitora sem bloquear; Adware exibe anúncios; Worm se propaga pela rede.",
    explanationCorrect: "Correto! Ransomware = cifra + sequestro + resgate. É o malware de maior impacto recente em órgãos públicos — delegacias, hospitais e prefeituras foram alvos frequentes.",
    explanationWrong: "Ransomware é o malware do 'sequestro de dados' — cifra os arquivos e pede resgate. Spyware espiona sem bloquear. Adware mostra anúncios. Worm se propaga. O sufixo '-ware' significa 'software de...' → Ransom-ware = software de resgate.",
    difficulty: "FACIL",
    contentTitle: "Malware: Bot, Trojan, Ransomware e Spyware",
  },
  // ── Q4 — Phishing (Municipal / FACIL) ────────────────────────────────────
  {
    id: "qz_info_seg_004",
    statement: "Um guarda municipal recebe e-mail de 'Recursos Humanos da Prefeitura' solicitando que ele clique em link e atualize seus dados bancários para o pagamento do salário. A URL redireciona para site falso. Esse ataque é classificado como:",
    alternatives: [
      { letter: "A", text: "Ransomware — pois o sistema pode ser cifrado ao clicar." },
      { letter: "B", text: "DDoS — pois sobrecarga o sistema de RH da Prefeitura." },
      { letter: "C", text: "Phishing — simulação de fonte confiável para roubo de credenciais ou dados." },
      { letter: "D", text: "Brute force — tentativa sistemática de descobrir a senha do servidor." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Phishing: o atacante 'lança a isca' simulando uma entidade confiável (RH, banco, órgão governamental) para capturar credenciais ou dados. O e-mail falso + URL clonada é o padrão clássico. Este caso específico poderia ser Spear Phishing se o guarda foi individualmente selecionado. Brute force é ataque de força bruta a senhas; DDoS é sobrecarga de servidores.",
    explanationCorrect: "Correto! Phishing = isca digital com simulação de fonte legítima. E-mail + URL falsa + urgência = tríade clássica do phishing. É o vetor de ataque nº 1 em órgãos públicos no Brasil.",
    explanationWrong: "Phishing é a técnica de 'pescar' credenciais usando engodo: e-mail, site ou mensagem que simula fonte confiável. A característica central é o DISFARCE de entidade legítima — não envolve força bruta nem sobrecarga de servidores.",
    difficulty: "FACIL",
    contentTitle: "Phishing e Engenharia Social",
  },
  // ── Q5 — Botnet (Estadual / MEDIO) ───────────────────────────────────────
  {
    id: "qz_info_seg_005",
    statement: "Sobre bots e botnets no contexto de ataques cibernéticos, é CORRETO afirmar que:",
    alternatives: [
      { letter: "A", text: "Um bot é um programa que exibe propaganda indesejada ao usuário enquanto navega na web." },
      { letter: "B", text: "Botnet é o nome do servidor central que distribui atualizações para antivírus corporativos." },
      { letter: "C", text: "Um computador infectado por bot (zumbi) é controlado remotamente pelo atacante e pode ser usado para ataques DDoS, envio de spam ou mineração de criptomoedas sem o conhecimento do dono." },
      { letter: "D", text: "Botnets só funcionam em redes com endereços IP estáticos e não afetam usuários domésticos." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Bot transforma o dispositivo em 'zumbi' — controlado remotamente por um Command & Control (C&C) sem o conhecimento do proprietário. A rede formada por esses zumbis é a botnet. O atacante (botmaster) pode usar todos os zumbis simultaneamente para: ataques DDoS massivos, envio de spam, cliques fraudulentos ou mineração de criptomoedas.",
    explanationCorrect: "Correto! Bot = zumbi. Botnet = exército de zumbis. O botmaster controla remotamente (C&C) e direciona os ataques. É o modelo por trás dos maiores ataques DDoS da história.",
    explanationWrong: "Bot NÃO é adware (que exibe anúncios). Botnet NÃO é servidor de antivírus. A característica central do bot é o CONTROLE REMOTO por um atacante — o dono do computador não sabe que seu dispositivo está sendo usado criminosamente.",
    difficulty: "MEDIO",
    contentTitle: "Malware: Bot, Trojan, Ransomware e Spyware",
  },
  // ── Q6 — Trojan (Estadual / MEDIO) ───────────────────────────────────────
  {
    id: "qz_info_seg_006",
    statement: "O malware denominado Trojan (cavalo de Tróia) caracteriza-se por:",
    alternatives: [
      { letter: "A", text: "Auto-replicar-se pela rede sem necessidade de hospedeiro ou interação humana." },
      { letter: "B", text: "Cifrar os arquivos da vítima e exigir resgate para restaurar o acesso." },
      { letter: "C", text: "Disfarçar-se de software legítimo (aplicativo, jogo, ferramenta) para induzir o usuário a executá-lo voluntariamente e instalar o código malicioso." },
      { letter: "D", text: "Monitorar exclusivamente o tráfego de rede sem infectar o sistema operacional do host." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Trojan (analogia ao Cavalo de Tróia da mitologia grega): parece inofensivo ou útil por fora, mas carrega código malicioso por dentro. O usuário é enganado a executá-lo voluntariamente. Diferente do worm (não precisa de hospedeiro e se auto-replica) e do ransomware (foca em cifrar dados). O Trojan frequentemente abre um backdoor para o atacante ou instala outros malwares.",
    explanationCorrect: "Perfeito! Trojan = disfarce de software legítimo. O usuário é o agente que o executa voluntariamente, sem saber que é malicioso. Clássico: 'gerador de serial grátis' que instala backdoor.",
    explanationWrong: "Auto-replicação autônoma é característica do WORM. Cifrar dados e pedir resgate é o RANSOMWARE. O TROJAN se diferencia pelo DISFARCE: parece legítimo, mas é malicioso — o usuário o executa por engano.",
    difficulty: "MEDIO",
    contentTitle: "Malware: Bot, Trojan, Ransomware e Spyware",
  },
  // ── Q7 — Criptografia Simétrica (Estadual / MEDIO) ───────────────────────
  {
    id: "qz_info_seg_007",
    statement: "Sobre a criptografia simétrica, assinale a alternativa CORRETA:",
    alternatives: [
      { letter: "A", text: "Utiliza um par de chaves distintas — chave pública (para cifrar) e chave privada (para decifrar)." },
      { letter: "B", text: "É significativamente mais lenta que a criptografia assimétrica, por isso raramente usada em sistemas reais." },
      { letter: "C", text: "A mesma chave é utilizada tanto para cifrar quanto para decifrar a mensagem, exigindo compartilhamento seguro da chave entre as partes." },
      { letter: "D", text: "Resolve o problema de distribuição segura de chaves por ser baseada em chaves descartáveis de uso único." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Criptografia simétrica: UMA única chave secreta compartilhada entre remetente e destinatário. Exemplos: AES (Advanced Encryption Standard), DES, 3DES. É MAIS RÁPIDA que a assimétrica — por isso é usada em HTTPS para cifrar o conteúdo da sessão (a chave simétrica de sessão é negociada via TLS, que usa assimétrica apenas no handshake inicial).",
    explanationCorrect: "Correto! Simétrica = uma chave para tudo. A vantagem é a VELOCIDADE; a desvantagem é o desafio de distribuir a chave de forma segura. AES-256 é o padrão atual.",
    explanationWrong: "Par de chaves pública/privada é a ASSIMÉTRICA. A simétrica usa UMA chave para cifrar e decifrar. E ao contrário — a simétrica é MAIS RÁPIDA que a assimétrica, sendo usada para cifrar grandes volumes de dados.",
    difficulty: "MEDIO",
    contentTitle: "Criptografia: Simétrica vs. Assimétrica (Chave Pública)",
  },
  // ── Q8 — Engenharia Social (Estadual / MEDIO) ─────────────────────────────
  {
    id: "qz_info_seg_008",
    statement: "A engenharia social, como vetor de ataque, diferencia-se dos ataques técnicos porque:",
    alternatives: [
      { letter: "A", text: "Explora vulnerabilidades em sistemas operacionais e softwares desatualizados." },
      { letter: "B", text: "Requer ferramentas sofisticadas de varredura de portas e análise de tráfego de rede." },
      { letter: "C", text: "Baseia-se na manipulação psicológica de pessoas para obter informações ou acesso privilegiado, sem necessidade de exploração técnica de sistemas." },
      { letter: "D", text: "É uma técnica exclusivamente remota — nunca envolve interação física ou presencial." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Engenharia Social explora o 'elo mais fraco': o ser humano. Usa técnicas psicológicas como autoridade ('Sou o chefe de TI'), urgência ('seu sistema será bloqueado'), simpatia e reciprocidade para induzir vítimas a revelar senhas, abrir arquivos ou conceder acessos. O phishing é uma forma de engenharia social. Pode ser presencial (physical social engineering) ou remota.",
    explanationCorrect: "Exato! Engenharia social = atacar o fator humano. Não explora falhas técnicas de sistemas — explora a psicologia humana (autoridade, urgência, confiança). É o vetor de ataque mais eficaz porque humanos são o elo mais fraco.",
    explanationWrong: "Exploração de vulnerabilidades de software é ataque TÉCNICO. Engenharia Social não precisa de nenhuma ferramenta tecnológica avançada — basta convencer a pessoa certa. E pode ser presencial (ex.: se passar por técnico de TI para entrar fisicamente no prédio).",
    difficulty: "MEDIO",
    contentTitle: "Phishing e Engenharia Social",
  },
  // ── Q9 — CERTO/ERRADO CEBRASPE: Criptografia Assimétrica (Federal / MEDIO) ─
  {
    id: "qz_info_seg_009",
    statement: "Julgue o item conforme os conceitos de criptografia assimétrica.\n\nPara enviar uma mensagem confidencial a um destinatário usando criptografia assimétrica, o remetente deve cifrar o conteúdo com a CHAVE PRIVADA do destinatário, pois essa chave é secreta e garante que somente ele poderá ler a mensagem.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "ERRADO. Na criptografia assimétrica, para garantir CONFIDENCIALIDADE, o remetente deve cifrar com a CHAVE PÚBLICA do destinatário — que é de livre distribuição. Somente o destinatário, que possui a correspondente CHAVE PRIVADA (secreta), poderá decifrar. A chave privada NUNCA é compartilhada — é justamente por ser privada que o remetente não pode usá-la para cifrar.",
    explanationCorrect: "Gabarito: ERRADO. Parabéns! O erro está em 'chave privada do destinatário' — o remetente cifra com a PÚBLICA do destinatário. A privada pertence exclusivamente ao seu titular e nunca sai de sua posse.",
    explanationWrong: "Na criptografia assimétrica: confidencialidade → cifra com PÚBLICA do destinatário (decifra com PRIVADA). Assinatura digital → assina com PRIVADA do remetente (verifica com PÚBLICA). Confundir esses papéis é o erro mais cobrado em CEBRASPE sobre criptografia.",
    difficulty: "MEDIO",
    contentTitle: "Criptografia: Simétrica vs. Assimétrica (Chave Pública)",
  },
  // ── Q10 — CERTO/ERRADO CEBRASPE: Ransomware — Resposta Correta (Federal) ──
  {
    id: "qz_info_seg_010",
    statement: "Julgue o item com base nas melhores práticas de resposta a incidentes.\n\nAo detectar que os sistemas de registros da delegacia foram cifrados por ransomware, a conduta mais recomendada é realizar o pagamento do resgate solicitado imediatamente, pois isso garante a recuperação dos dados com o menor impacto operacional e incentiva o criminoso a fornecer a chave de descriptografia.",
    alternatives: [
      { letter: "A", text: "CERTO" },
      { letter: "B", text: "ERRADO" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "ERRADO. O pagamento do resgate NÃO é recomendado pelas autoridades (FBI, ANPD, CERT.br) pelos seguintes motivos: (1) não há garantia de que o criminoso fornecerá a chave; (2) financia e incentiva novos ataques; (3) pode gerar responsabilização legal (financiamento ao crime). A resposta correta: isolar imediatamente a máquina da rede, ativar o plano de continuidade de negócios e restaurar a partir de backups limpos e offline.",
    explanationCorrect: "Gabarito: ERRADO. Correto! Pagar o resgate é contraindicado por FBI, CERT.br e ANPD. A solução é: isolamento da máquina + backup limpo + comunicação ao CSIRT nacional.",
    explanationWrong: "Pagar o resgate é a pior decisão: não há garantia de devolução dos dados, financia criminosos e pode configurar cumplicidade. Boas práticas: backup offline regular (regra 3-2-1), isolamento imediato da rede e plano de resposta a incidentes (IRP).",
    difficulty: "MEDIO",
    contentTitle: "Malware: Bot, Trojan, Ransomware e Spyware",
  },
  // ── Q11 — MFA: Fatores Distintos (Federal / DIFICIL) ─────────────────────
  {
    id: "qz_info_seg_011",
    statement: "O modelo de autenticação multifator (MFA) exige a combinação de dois ou mais fatores de CATEGORIAS DISTINTAS. Identifique a única alternativa que representa um MFA legítimo:",
    alternatives: [
      { letter: "A", text: "Senha alfanumérica + PIN de 6 dígitos — dois elementos 'algo que você sabe'." },
      { letter: "B", text: "Reconhecimento facial + leitura de íris — dois elementos 'algo que você é'." },
      { letter: "C", text: "Senha (algo que você sabe) + código OTP enviado ao celular corporativo (algo que você tem)." },
      { letter: "D", text: "Nome de usuário + senha — dois campos de autenticação 'algo que você sabe'." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "MFA exige fatores de CATEGORIAS distintas: (1) Conhecimento/SABE (senha, PIN, pergunta secreta), (2) Posse/TEM (token, smartphone, smart card, certificado digital), (3) Inerência/É (biometria: digital, face, íris, voz). As alternativas A, B e D combinam elementos da MESMA categoria — isso é autenticação de um único fator (mesmo que use dois campos). Apenas C combina SABE + TEM.",
    explanationCorrect: "Exato! MFA real = categorias diferentes. Senha (SABE) + OTP no celular (TEM) = dois fatores distintos = MFA legítimo. Senha + PIN = dois 'SABE' = fator único reforçado, não MFA.",
    explanationWrong: "MFA não é ter dois campos de senha — é ter dois TIPOS diferentes de fator. Senha e PIN são ambos 'algo que você SABE'. Só é MFA quando combina, por exemplo, SABE + TEM, ou SABE + É, ou TEM + É.",
    difficulty: "DIFICIL",
    contentTitle: "Autenticação Multifator (MFA) e Certificado Digital (ICP-Brasil)",
  },
  // ── Q12 — Certificado Digital e ICP-Brasil (Federal / DIFICIL) ────────────
  {
    id: "qz_info_seg_012",
    statement: "O certificado digital emitido no âmbito da ICP-Brasil (Infraestrutura de Chaves Públicas Brasileira) tem como função primordial:",
    alternatives: [
      { letter: "A", text: "Cifrar o disco rígido do computador do titular para proteger seus arquivos contra acesso físico." },
      { letter: "B", text: "Criar um canal VPN entre o titular e os servidores do governo federal." },
      { letter: "C", text: "Vincular criptograficamente a identidade do titular à sua chave pública, com chancela de uma Autoridade Certificadora confiável, garantindo autenticidade e não-repúdio." },
      { letter: "D", text: "Substituir completamente a necessidade de senha nos sistemas governamentais, eliminando o fator 'algo que você sabe'." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O certificado digital é o 'RG digital' — documento eletrônico que vincula: (identidade do titular) ↔ (chave pública). Essa vinculação é chancelada por uma Autoridade Certificadora (AC) da ICP-Brasil, que garante a confiabilidade. Isso assegura Autenticidade (a mensagem/documento veio realmente do titular) e Irretratabilidade/Não-repúdio (o titular não pode negar ter assinado). Exemplos: e-CPF, e-CNPJ, certificados de advogados (OAB) e médicos (CFM).",
    explanationCorrect: "Correto! Certificado digital = identidade + chave pública + chancela da AC. Garante os pilares A (Autenticidade) e I (Irretratabilidade) do DICAI. Muito cobrado em CEBRASPE/PF.",
    explanationWrong: "Certificado digital não criptografa disco nem cria VPN. Ele é o instrumento que PROVA que uma determinada chave pública pertence a uma determinada pessoa — a AC da ICP-Brasil é a 'cartório' digital que valida essa vinculação.",
    difficulty: "DIFICIL",
    contentTitle: "Autenticação Multifator (MFA) e Certificado Digital (ICP-Brasil)",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n🔐 Seed: Informática — Segurança da Informação\n");

  // ── 1. Encontrar Subject ────────────────────────────────────────────────
  const subjectId = await findSubject("INFORMATICA");
  if (!subjectId) {
    console.error("❌ Subject 'INFORMATICA' não encontrado no banco.");
    process.exit(1);
  }
  console.log(`✅ Subject encontrado: ${subjectId}`);

  // ── 2. Garantir colunas Phase 5 em Question ────────────────────────────
  for (const [col, def] of [
    ["correctOption", "INTEGER"],
    ["explanationCorrect", "TEXT"],
    ["explanationWrong", "TEXT"],
  ] as const) {
    try {
      await db.execute(sql.raw(`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "${col}" ${def}`));
    } catch (e: any) {
      console.warn(`⚠️  Question.${col}: ${e?.message?.split("\n")[0]}`);
    }
  }

  // ── 3. Garantir colunas Phase 5 em Content ─────────────────────────────
  for (const [col, def] of [
    ["mnemonic", "TEXT"],
    ["keyPoint", "TEXT"],
    ["practicalExample", "TEXT"],
  ] as const) {
    try {
      await db.execute(sql.raw(`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS "${col}" ${def}`));
    } catch (e: any) {
      console.warn(`⚠️  Content.${col}: ${e?.message?.split("\n")[0]}`);
    }
  }
  console.log("✅ Colunas Phase 5 garantidas.");

  // ── 4. Encontrar ou criar Topic ────────────────────────────────────────
  const topicId = await findOrCreateTopic("Segurança da Informação", subjectId);
  console.log(`✅ Topic: ${topicId}`);

  // ── 5. Inserir Conteúdos ────────────────────────────────────────────────
  const contentIdMap: Record<string, string> = {};
  let contentCreated = 0, contentSkipped = 0;

  for (const c of contents) {
    if (await contentExists(c.title, subjectId)) {
      const existingId = await getContentId(c.title, subjectId);
      if (existingId) contentIdMap[c.title] = existingId;
      console.log(`  ⏭  Conteúdo já existe: ${c.title}`);
      contentSkipped++;
      continue;
    }

    const id = nanoId("ct");
    const wordCount = c.textContent.split(/\s+/).length;
    await db.execute(sql`
      INSERT INTO "Content" (
        "id", "title", "textContent", "subjectId", "topicId",
        "isActive", "difficulty",
        "wordCount", "estimatedReadTime",
        "mnemonic", "keyPoint", "practicalExample",
        "createdAt", "updatedAt"
      ) VALUES (
        ${id}, ${c.title}, ${c.textContent}, ${subjectId}, ${topicId},
        true, ${c.difficulty},
        ${wordCount}, ${Math.ceil(wordCount / 200)},
        ${c.mnemonic}, ${c.keyPoint}, ${c.practicalExample},
        NOW(), NOW()
      )
    `);
    contentIdMap[c.title] = id;
    console.log(`  ✅ Conteúdo criado: ${c.title} (${id})`);
    contentCreated++;
  }

  // ── 6. Inserir Questões ─────────────────────────────────────────────────
  let questionCreated = 0, questionSkipped = 0;

  for (const q of questions) {
    if (await questionExists(q.id)) {
      console.log(`  ⏭  Questão já existe: ${q.id}`);
      questionSkipped++;
      continue;
    }

    const contentId = contentIdMap[q.contentTitle];
    if (!contentId) {
      console.warn(`  ⚠️  Conteúdo não encontrado para questão ${q.id}: '${q.contentTitle}'`);
      continue;
    }

    const alternativesJson = JSON.stringify(q.alternatives);

    await db.execute(sql`
      INSERT INTO "Question" (
        "id", "statement", "alternatives", "correctAnswer", "correctOption",
        "explanation", "explanationCorrect", "explanationWrong",
        "subjectId", "topicId", "contentId",
        "isActive", "difficulty",
        "timesUsed", "questionType",
        "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternativesJson}::jsonb, ${q.correctAnswer}, ${q.correctOption},
        ${q.explanation}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${subjectId}, ${topicId}, ${contentId},
        true, ${q.difficulty},
        0, 'MULTIPLA_ESCOLHA',
        NOW(), NOW()
      )
    `);
    console.log(`  ✅ Questão criada: ${q.id}`);
    questionCreated++;
  }

  // ── Backfill contentId em questões já existentes (sem contentId) ─────────
  let backfillCount = 0;
  for (const q of questions) {
    const contentId = contentIdMap[q.contentTitle];
    if (!contentId) continue;
    const result = await db.execute(sql`
      UPDATE "Question" SET "contentId" = ${contentId}
      WHERE id = ${q.id} AND "contentId" IS NULL
    `) as any;
    if ((result.rowCount ?? result.count ?? 0) > 0) backfillCount++;
  }
  if (backfillCount > 0) console.log(`  🔧 Backfill contentId: ${backfillCount} questões atualizadas`);

  // ── Relatório ────────────────────────────────────────────────────────────
  console.log("\n─────────────────────────────────────────");
  console.log(`📚 Conteúdos: ${contentCreated} criados, ${contentSkipped} já existiam`);
  console.log(`❓ Questões:  ${questionCreated} criadas,  ${questionSkipped} já existiam`);
  console.log("─────────────────────────────────────────\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed falhou:", err);
  process.exit(1);
});
