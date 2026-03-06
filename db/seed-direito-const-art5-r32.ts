/**
 * Seed R32 — Direito Constitucional: Direitos Individuais e Coletivos (Art. 5º CF/88)
 * 6 átomos de conteúdo  (con_dg_c01–c06)
 * 12 questões           (con_dg_q01–q12)
 *
 * Execução (Replit): npx tsx db/seed-direito-const-art5-r32.ts
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

// ─── CONTEÚDOS ───────────────────────────────────────────────────────────────

const contents = [
  {
    id: "con_dg_c01",
    title: "Igualdade e Direito à Vida — Art. 5º, Caput e Incisos",
    difficulty: "FACIL",
    mnemonic:
      "VIDA-IGUAL: Vida começa na concepção (STF). IGUALdade FORMAL = todos iguais perante a LEI. " +
      "IGUALdade MATERIAL = tratar DESiguais DESigualmente na medida de suas desigualdades. " +
      "Pena de morte: vedada — EXCETO guerra externa declarada.",
    keyPoint:
      "• Igualdade formal (art. 5º, caput): homens e mulheres iguais em direitos e obrigações\n" +
      "• Igualdade material: tratamento diferenciado para promover igualdade real (cotas, ações afirmativas)\n" +
      "• Direito à vida: desde a concepção (STF) — valor supremo\n" +
      "• Pena de morte: vedada em tempo de paz — permitida em caso de guerra externa declarada\n" +
      "• Tortura e tratamento desumano: absolutamente vedados (sem exceção)\n" +
      "• Vedação ao racismo: crime inafiançável e imprescritível (art. 5º, XLII)",
    practicalExample:
      "CESPE: 'A pena de morte é absolutamente vedada pela CF/88.' — ERRADO: admitida em guerra externa declarada. " +
      "FGV: Cotas raciais em universidades = igualdade MATERIAL — STF ADPF 186. " +
      "FCC: A vedação à tortura é cláusula pétrea e não admite exceção alguma — CERTO.",
    textContent:
      "O art. 5º da CF/88 consagra os direitos e garantias fundamentais, sendo a base de todo o ordenamento jurídico brasileiro. " +
      "Os direitos individuais e coletivos ali previstos vinculam tanto o Estado quanto os particulares (eficácia horizontal).\n\n" +
      "IGUALDADE FORMAL (art. 5º, caput e I):\n" +
      "Todos são iguais perante a lei, sem distinção de qualquer natureza. " +
      "Homens e mulheres são iguais em direitos e obrigações nos termos da Constituição. " +
      "Trata-se da igualdade perante a lei — proibição de discriminações arbitrárias pelo Estado ou por particulares. " +
      "É a igualdade na aplicação da lei, garantindo que a norma incida igualmente sobre todos.\n\n" +
      "IGUALDADE MATERIAL:\n" +
      "Vai além da igualdade formal: busca a igualdade real, tratando desigualmente os desiguais " +
      "na medida de suas desigualdades. Fundamenta as ações afirmativas (cotas raciais, por exemplo), " +
      "os benefícios a grupos vulneráveis e as políticas de inclusão. " +
      "O STF reconheceu a constitucionalidade das cotas raciais nas universidades (ADPF 186, 2012).\n\n" +
      "DIREITO À VIDA:\n" +
      "É o direito mais fundamental — pressuposto de todos os demais. " +
      "Inclui o direito de nascer e o direito de não ser morto arbitrariamente pelo Estado. " +
      "O STF reconheceu que a vida se inicia desde a concepção, embora o Código Penal permita o aborto " +
      "em caso de risco de vida da mãe, gravidez decorrente de estupro e, por decisão judicial (ADPF 54, 2012), " +
      "em caso de anencefalia fetal.\n\n" +
      "PENA DE MORTE:\n" +
      "A CF/88 veda a pena de morte como regra. Exceção: casos de guerra externa declarada " +
      "(art. 5º, XLVII, 'a'). Em tempos de paz, é absolutamente proibida.\n\n" +
      "VEDAÇÃO À TORTURA E TRATAMENTO DESUMANO (art. 5º, III):\n" +
      "Ninguém será submetido à tortura nem a tratamento desumano ou degradante. " +
      "Trata-se de direito absoluto — sem qualquer exceção. A prática de tortura é crime inafiançável e insuscetível de graça ou anistia (art. 5º, XLIII).\n\n" +
      "RACISMO (art. 5º, XLII):\n" +
      "A prática do racismo constitui crime inafiançável e imprescritível, sujeito à pena de reclusão. " +
      "Imprescritível significa que não há prazo para o Estado punir — a pretensão punitiva nunca se extingue pelo tempo.\n\n" +
      "APLICABILIDADE:\n" +
      "Os direitos fundamentais do art. 5º têm aplicabilidade imediata (art. 5º, §1º) — " +
      "não dependem de lei regulamentadora para produzir efeitos.",
  },
  {
    id: "con_dg_c02",
    title: "Inviolabilidade do Domicílio — Art. 5º, XI",
    difficulty: "MEDIO",
    mnemonic:
      "3+1: Flagrante, Desastre e Socorro — QUALQUER HORA. Ordem judicial — SÓ DE DIA. " +
      "Dia = 6h às 21h (STF). Mnemônico: 'FDS pode à noite; Juiz só de dia.' " +
      "STF HC 598.051: busca domiciliar exige fundadas razões documentadas.",
    keyPoint:
      "• Casa é asilo inviolável — ninguém pode entrar sem consentimento do morador (regra)\n" +
      "• Exceções que permitem entrada a qualquer hora (dia ou noite): flagrante delito, desastre e socorro\n" +
      "• Exceção que permite entrada APENAS DURANTE O DIA: cumprimento de ordem judicial\n" +
      "• Dia = entre 6h e 21h (entendimento do STF)\n" +
      "• 'Casa' = conceito amplo: quarto de hotel, trailer, embarcação — qualquer espaço privativo\n" +
      "• STF HC 598.051/SP (2020): busca domiciliar em operações policiais exige fundadas razões individualizadas e documentadas",
    practicalExample:
      "CESPE clássico: 'Decisão judicial autoriza busca domiciliar a qualquer hora.' — ERRADO: só de dia. " +
      "FGV: 'Policial pode entrar na casa para socorrer vítima de mal súbito às 3h da manhã.' — CERTO: socorro = qualquer hora. " +
      "STF HC 598.051: mera intuição policial sem fundadas razões não justifica busca domiciliar — nulidade.",
    textContent:
      "Art. 5º, XI: 'A casa é asilo inviolável do indivíduo, ninguém nela podendo penetrar sem consentimento " +
      "do morador, salvo em caso de flagrante delito ou desastre, ou para prestar socorro, ou, durante o dia, " +
      "por determinação judicial.'\n\n" +
      "REGRA — INVIOLABILIDADE:\n" +
      "A casa é protegida como extensão da personalidade e da intimidade do indivíduo. " +
      "A regra é a inviolabilidade: ninguém pode penetrar no domicílio sem a anuência do morador.\n\n" +
      "EXCEÇÕES — ENTRADA SEM CONSENTIMENTO:\n\n" +
      "1. FLAGRANTE DELITO — qualquer hora:\n" +
      "Quando estiver ocorrendo um crime dentro da residência (ou em seus arredores imediatos). " +
      "Pode ser cumprido a qualquer hora do dia ou da noite.\n\n" +
      "2. DESASTRE — qualquer hora:\n" +
      "Situações de emergência como incêndio, explosão, inundação. " +
      "A necessidade de socorro justifica a entrada a qualquer momento.\n\n" +
      "3. SOCORRO — qualquer hora:\n" +
      "Para prestar socorro à vítima de acidente, mal súbito ou situação de risco. " +
      "A urgência do socorro não admite restrição de horário.\n\n" +
      "4. CUMPRIMENTO DE ORDEM JUDICIAL — APENAS DURANTE O DIA:\n" +
      "Mandados de busca e apreensão e outras ordens judiciais só podem ser cumpridos durante o dia. " +
      "O STF fixou que 'dia' corresponde ao período entre 6h e 21h.\n\n" +
      "CONCEITO AMPLO DE 'CASA':\n" +
      "O STF interpreta 'casa' de forma ampla — inclui qualquer espaço privativo onde o indivíduo " +
      "exerce sua intimidade: quarto de hotel ocupado, escritório, consultório, trailer, barco-moradia. " +
      "A proteção alcança o espaço, não apenas a estrutura física da residência.\n\n" +
      "STF — HC 598.051/SP (2020):\n" +
      "O STF fixou tese de que a entrada forçada em domicílio sem mandado judicial só é lícita " +
      "quando amparada em fundadas razões, devidamente justificadas a posteriori, que indiquem " +
      "situação de flagrância. A mera intuição ou denúncia anônima não é suficiente. " +
      "Provas obtidas em busca domiciliar ilegal são ilícitas (prova ilícita — art. 5º, LVI).\n\n" +
      "VIOLAÇÃO DO DOMICÍLIO (art. 150, CP):\n" +
      "Entrar ou permanecer em casa alheia sem autorização, ou nela permanecer contra a vontade do morador, " +
      "configura crime de violação de domicílio — inclusive pelo agente público que atua sem respaldo legal.",
  },
  {
    id: "con_dg_c03",
    title: "Liberdades, Sigilo e Vedação ao Anonimato — Art. 5º, IV, V, IX, XII",
    difficulty: "MEDIO",
    mnemonic:
      "SINAL: Sigilo de correspondência e comunicações — regra; INTERCEPTAÇÃO exige JUIZ + CRIME PENAL. " +
      "ANONIMATO: VEDADO — mas autor pode manter segredo do público (sigilo da fonte). " +
      "Quebra de sigilo bancário/fiscal: CPI pode; Receita Federal pode (STF); polícia civil NÃO pode diretamente.",
    keyPoint:
      "• Vedação ao anonimato (art. 5º, IV): manifestação do pensamento é livre, mas identificação obrigatória\n" +
      "• Direito de resposta proporcional ao agravo (art. 5º, V)\n" +
      "• Inviolabilidade da correspondência, comunicações telegráficas, dados e telefônicas (art. 5º, XII)\n" +
      "• Interceptação telefônica: exige ORDEM JUDICIAL + investigação criminal OU instrução processual penal (Lei 9.296/96)\n" +
      "• Sigilo da fonte: jornalista pode manter fonte em sigilo — não é anonimato\n" +
      "• CPI: pode quebrar sigilo bancário e fiscal (STF MS 23.452)\n" +
      "• Liberdade de consciência, crença e culto: art. 5º, VI–VIII — escusa de consciência admitida",
    practicalExample:
      "CESPE: 'A CF/88 protege o anonimato como forma de livre expressão.' — ERRADO: anonimato é VEDADO. " +
      "FGV: Interceptação telefônica sem ordem judicial = prova ilícita (art. 5º, LVI). " +
      "STF: CPI pode determinar a quebra de sigilo bancário sem autorização judicial (poderes de instrução).",
    textContent:
      "O art. 5º da CF/88 consagra um amplo conjunto de liberdades individuais, com especial atenção " +
      "à liberdade de expressão e ao sigilo das comunicações.\n\n" +
      "LIBERDADE DE MANIFESTAÇÃO DO PENSAMENTO (art. 5º, IV):\n" +
      "É livre a manifestação do pensamento. Entretanto, é VEDADO O ANONIMATO. " +
      "O indivíduo pode se expressar livremente, mas deve se identificar — isso permite " +
      "a responsabilização por danos causados a terceiros. " +
      "Não se confunde com o sigilo de fonte jornalística: o jornalista se identifica, " +
      "mas pode preservar a identidade de sua fonte.\n\n" +
      "DIREITO DE RESPOSTA (art. 5º, V):\n" +
      "Assegurado o direito de resposta, proporcional ao agravo, além da indenização por dano material, " +
      "moral ou à imagem. A resposta deve ser proporcional ao tamanho e alcance do agravo.\n\n" +
      "LIBERDADE DE CONSCIÊNCIA, CRENÇA E CULTO (art. 5º, VI–VIII):\n" +
      "Inviolável a liberdade de consciência e de crença, sendo assegurado o livre exercício dos cultos religiosos. " +
      "Ninguém será privado de direitos por motivo de crença religiosa ou convicção filosófica, " +
      "salvo se as invocar para eximir-se de obrigação legal a todos imposta (escusa de consciência) " +
      "e não se dispuser a cumprir prestação alternativa.\n\n" +
      "INVIOLABILIDADE DAS COMUNICAÇÕES (art. 5º, XII):\n" +
      "É inviolável o sigilo da correspondência e das comunicações telegráficas, de dados e das comunicações telefônicas. " +
      "EXCEÇÃO — comunicações telefônicas:\n" +
      "Admite-se a interceptação telefônica por ordem judicial, nas hipóteses e na forma que a lei estabelecer, " +
      "para fins de investigação criminal ou instrução processual penal.\n\n" +
      "REQUISITOS DA INTERCEPTAÇÃO TELEFÔNICA (Lei 9.296/96):\n" +
      "  (a) Ordem judicial fundamentada.\n" +
      "  (b) Finalidade: investigação criminal ou instrução processual penal (não serve para processo civil).\n" +
      "  (c) Prazo: 15 dias, renovável uma vez por igual período (STJ: pode ser renovado mais de uma vez).\n" +
      "  (d) Indícios razoáveis de autoria ou participação em infração penal.\n" +
      "  (e) A prova não puder ser feita por outros meios disponíveis.\n\n" +
      "QUEBRA DO SIGILO BANCÁRIO E FISCAL:\n" +
      "O sigilo bancário e fiscal não é absoluto. Pode ser quebrado:\n" +
      "  Por ordem judicial (regra geral).\n" +
      "  Por CPI (Comissão Parlamentar de Inquérito) — poderes investigatórios equivalentes aos judiciais (STF MS 23.452).\n" +
      "  Pela Receita Federal: STF RE 601.314 (repercussão geral) — autoriza o Fisco a acessar dados bancários " +
      "sem autorização judicial para fins tributários.\n" +
      "  Pelo COAF: no âmbito da Lei de Lavagem de Dinheiro.\n\n" +
      "PROVA ILÍCITA (art. 5º, LVI):\n" +
      "São inadmissíveis as provas obtidas por meios ilícitos. " +
      "Interceptação telefônica sem ordem judicial = prova ilícita = deve ser desentranhada do processo.",
  },
  {
    id: "con_dg_c04",
    title: "Direito de Reunião e Associação — Art. 5º, XVI–XXI",
    difficulty: "MEDIO",
    mnemonic:
      "REUNIÃO = FPAP: Fins pacíficos · sem Armas · local Público · Prévio aviso (NÃO autorização). " +
      "ASSOCIAÇÃO = livre criação, não obrigatória, vedada paramilitar. " +
      "Dissolução compulsória: APENAS por decisão judicial.",
    keyPoint:
      "Direito de reunião (art. 5º, XVI):\n" +
      "• Fins pacíficos, sem armas, em locais abertos ao público\n" +
      "• Prévio aviso à autoridade — NÃO é autorização prévia\n" +
      "• Independe de autorização; pode ser dissolvida apenas por decisão judicial (ou em estado de defesa/sítio)\n" +
      "Direito de associação (art. 5º, XVII–XXI):\n" +
      "• Criação livre (independe de autorização estatal)\n" +
      "• Ninguém é obrigado a associar-se ou permanecer associado\n" +
      "• Vedadas associações de caráter paramilitar\n" +
      "• Suspensão: apenas por decisão judicial; dissolução compulsória: apenas por decisão judicial transitada em julgado",
    practicalExample:
      "CESPE: 'O direito de reunião exige autorização prévia da autoridade policial.' — ERRADO: apenas prévio aviso. " +
      "FGV: 'A dissolução de associação pode ser determinada por ato do Executivo.' — ERRADO: apenas decisão judicial. " +
      "FCC: A vedação às associações paramilitares é absoluta na CF/88 — não admite exceção.",
    textContent:
      "O art. 5º da CF/88 garante os direitos de reunião e de associação como manifestações da liberdade coletiva.\n\n" +
      "DIREITO DE REUNIÃO (art. 5º, XVI):\n" +
      "'Todos podem reunir-se pacificamente, sem armas, em locais abertos ao público, independentemente de autorização, " +
      "desde que não frustrem outra reunião anteriormente convocada para o mesmo local, sendo apenas exigido prévio aviso à autoridade competente.'\n\n" +
      "REQUISITOS DA REUNIÃO:\n" +
      "1. Fins pacíficos: a reunião deve ter propósito lícito e não violento.\n" +
      "2. Sem armas: presença de armas descaracteriza o direito constitucional de reunião.\n" +
      "3. Local aberto ao público: ruas, praças, parques — espaços públicos de acesso geral.\n" +
      "4. Prévio aviso à autoridade: o aviso tem o objetivo de que o poder público possa garantir a ordem e " +
      "evitar conflito com outra reunião no mesmo local. NÃO é autorização — a autoridade não pode negar o direito.\n" +
      "5. Sem frustrar reunião anteriormente convocada para o mesmo local.\n\n" +
      "IMPORTANTE — PRÉVIO AVISO vs. AUTORIZAÇÃO:\n" +
      "O texto constitucional é claro: o direito de reunião independe de AUTORIZAÇÃO. " +
      "O prévio aviso é mera comunicação — não é condição de validade da reunião. " +
      "Autoridade que impede reunião lícita por ausência de aviso prévio viola direito fundamental.\n\n" +
      "DISSOLUÇÃO DA REUNIÃO:\n" +
      "Reuniões podem ser dissolvidas em casos excepcionais previstos em lei ou durante estado de defesa e estado de sítio. " +
      "Fora dessas hipóteses, a dissolução requer decisão judicial.\n\n" +
      "DIREITO DE ASSOCIAÇÃO (art. 5º, XVII–XXI):\n\n" +
      "Art. 5º, XVII: É plena a liberdade de associação para fins lícitos, vedada a de caráter paramilitar.\n" +
      "Art. 5º, XVIII: A criação de associações e, na forma da lei, a de cooperativas independem de autorização, " +
      "sendo vedada a interferência estatal em seu funcionamento.\n" +
      "Art. 5º, XIX: As associações só poderão ser compulsoriamente dissolvidas ou ter suas atividades suspensas " +
      "por decisão judicial, exigindo-se, no primeiro caso, o trânsito em julgado.\n" +
      "Art. 5º, XX: Ninguém poderá ser compelido a associar-se ou a permanecer associado.\n" +
      "Art. 5º, XXI: As entidades associativas, quando expressamente autorizadas, têm legitimidade para representar " +
      "seus filiados judicial ou extrajudicialmente.\n\n" +
      "DISTINÇÃO IMPORTANTE:\n" +
      "Suspensão de atividades: basta decisão judicial (sem necessidade de trânsito em julgado).\n" +
      "Dissolução compulsória: exige decisão judicial TRANSITADA EM JULGADO.\n\n" +
      "VEDAÇÃO PARAMILITAR:\n" +
      "Associações de caráter paramilitar são vedadas pela CF/88 sem qualquer exceção. " +
      "Organizações que simulam estrutura militar, usam uniformes e hierarquia castrense sem autorização legal " +
      "são inconstitucionais.",
  },
  {
    id: "con_dg_c05",
    title: "Remédios Constitucionais: Habeas Corpus e Habeas Data",
    difficulty: "MEDIO",
    mnemonic:
      "HC = Habeas CORPUS = proteção do CORPO (liberdade de locomoção). " +
      "HD = Habeas DATA = proteção dos DADOS pessoais. " +
      "HC: qualquer pessoa impetra, qualquer pessoa beneficia. " +
      "HD: apenas o próprio titular (não serve para terceiros). " +
      "HD: exige pedido administrativo PRÉVIO frustrado (STF Súmula 2).",
    keyPoint:
      "Habeas Corpus (art. 5º, LXVIII):\n" +
      "• Protege a liberdade de locomoção (ir, ficar e vir)\n" +
      "• HC liberatório: libera quem está preso ilegalmente\n" +
      "• HC preventivo: salvo-conduto para quem está ameaçado\n" +
      "• Qualquer pessoa pode impetrar, em favor de qualquer pessoa\n" +
      "• Gratuito e sem formalidades especiais\n" +
      "Habeas Data (art. 5º, LXXII):\n" +
      "• Assegura conhecimento, retificação ou complementação de informações SOBRE O PRÓPRIO IMPETRANTE\n" +
      "• Em registros ou bancos de dados de entidades governamentais ou de caráter público\n" +
      "• Não serve para terceiros\n" +
      "• Exige recusa ou omissão administrativa prévia (Súmula 2, STJ)",
    practicalExample:
      "CESPE: 'HC pode ser impetrado por qualquer pessoa, mesmo sem advogado.' — CERTO. " +
      "FGV: 'HD pode ser usado para obter informações sobre terceiro em banco de dados governamental.' — ERRADO: apenas sobre o próprio impetrante. " +
      "STJ Súmula 2: não cabe HD se não houve recusa de informações por parte da autoridade administrativa.",
    textContent:
      "Os remédios constitucionais são ações constitucionais que protegem direitos fundamentais " +
      "contra abusos do Estado. O art. 5º prevê seis remédios: HC, HD, MS (individual e coletivo), MI e Ação Popular.\n\n" +
      "HABEAS CORPUS (art. 5º, LXVIII):\n" +
      "'Conceder-se-á habeas corpus sempre que alguém sofrer ou se achar ameaçado de sofrer " +
      "violência ou coação em sua liberdade de locomoção, por ilegalidade ou abuso de poder.'\n\n" +
      "MODALIDADES:\n" +
      "Liberatório (ou repressivo): quando já há prisão ou constrangimento ilegal. O HC livra o paciente.\n" +
      "Preventivo: quando há ameaça de prisão ilegal (iminente). O juiz expede salvo-conduto.\n\n" +
      "CARACTERÍSTICAS:\n" +
      "Legitimidade ativa: qualquer pessoa, inclusive o próprio paciente, em favor de si mesmo ou de outrem. " +
      "Não precisa de advogado. Pode ser impetrado por escrito ou verbalmente (em caso de urgência).\n" +
      "Legitimidade passiva: autoridade pública ou particular que constranja a liberdade.\n" +
      "Gratuidade: o HC é sempre gratuito — sem custas.\n" +
      "Hipóteses de cabimento: prisão sem flagrante ou sem mandado; prisão além do prazo legal; " +
      "prisão por crime afiançável com fiança não arbitrada; coação ilegal no curso do processo.\n\n" +
      "HC NÃO CABE PARA (STF/STJ):\n" +
      "Punição disciplinar militar (regra — salvo incompetência, vício de forma ou ilegalidade flagrante).\n" +
      "Proteção de direitos patrimoniais ou não relacionados à liberdade de locomoção.\n" +
      "Quando já extinta a pena privativa de liberdade.\n\n" +
      "HABEAS DATA (art. 5º, LXXII):\n" +
      "'Conceder-se-á habeas data:\n" +
      "a) para assegurar o conhecimento de informações relativas à pessoa do impetrante, constantes de " +
      "registros ou bancos de dados de entidades governamentais ou de caráter público;\n" +
      "b) para a retificação de dados, quando não se prefira fazê-lo por processo sigiloso, judicial ou administrativo.'\n\n" +
      "CARACTERÍSTICAS:\n" +
      "Legitimidade: somente o próprio titular das informações — não serve para obter informações sobre terceiros.\n" +
      "Objeto: informações pessoais constantes de registros públicos ou de entidades de caráter público.\n" +
      "Retificação: quando os dados estão incorretos ou desatualizados.\n" +
      "Complementação: acrescentar informação faltante (incluído pela doutrina).\n\n" +
      "REQUISITO ESSENCIAL — STJ SÚMULA 2:\n" +
      "'Não cabe o habeas data se não houve recusa de informações por parte da autoridade administrativa.' " +
      "Ou seja, é necessário que o impetrante tenha previamente formulado pedido administrativo " +
      "e tenha sido negado ou ignorado. Sem essa recusa prévia, falta interesse de agir.\n\n" +
      "DIFERENÇA HC vs. HD:\n" +
      "HC protege liberdade de locomoção (ir e vir).\n" +
      "HD protege informações pessoais em bancos de dados.\n" +
      "HC pode ser impetrado por e para qualquer pessoa.\n" +
      "HD só pode ser impetrado pelo próprio titular das informações.",
  },
  {
    id: "con_dg_c06",
    title: "Remédios Constitucionais: Mandado de Segurança e Ação Popular",
    difficulty: "MEDIO",
    mnemonic:
      "MS = Direito LÍQUIDO e CERTO (comprovado de plano, sem dilação probatória) + ato de AUTORIDADE. " +
      "MS NÃO cabe onde cabe HC ou HD. Prazo: 120 DIAS do ato impugnado. " +
      "AÇÃO POPULAR = CIDADÃO (eleitor em dia) protege patrimônio PÚBLICO. Isento de custas (salvo má-fé).",
    keyPoint:
      "Mandado de Segurança (art. 5º, LXIX–LXX):\n" +
      "• Protege direito líquido e certo não amparado por HC ou HD\n" +
      "• Contra ato ilegal ou com abuso de poder de autoridade pública ou agente de pessoa jurídica no exercício de atribuições públicas\n" +
      "• Prazo: 120 dias do ato impugnado (decadencial — não se suspende nem interrompe)\n" +
      "• MS individual (qualquer pessoa) e coletivo (partidos, sindicatos, associações)\n" +
      "Ação Popular (art. 5º, LXXIII):\n" +
      "• Legitimado: qualquer CIDADÃO (titular de direitos políticos — eleitor em dia)\n" +
      "• Objeto: anular ato lesivo ao patrimônio público, moralidade administrativa, meio ambiente, patrimônio histórico e cultural\n" +
      "• Isento de custas, salvo má-fé\n" +
      "• Estrangeiros e pessoas jurídicas NÃO têm legitimidade",
    practicalExample:
      "CESPE: 'O prazo para impetrar MS é de 120 dias, contados da ciência do ato impugnado.' — CERTO. " +
      "FGV: 'Estrangeiro residente no Brasil pode ajuizar ação popular.' — ERRADO: só CIDADÃO (eleitor em dia). " +
      "FCC: MS coletivo pode ser impetrado por entidade de classe em defesa dos interesses de seus membros — CERTO (art. 5º, LXX, 'b').",
    textContent:
      "MANDADO DE SEGURANÇA INDIVIDUAL (art. 5º, LXIX):\n" +
      "'Conceder-se-á mandado de segurança para proteger direito líquido e certo, não amparado por habeas corpus " +
      "ou habeas data, quando o responsável pela ilegalidade ou abuso de poder for autoridade pública ou agente de " +
      "pessoa jurídica no exercício de atribuições do Poder Público.'\n\n" +
      "REQUISITOS DO MS:\n" +
      "1. Direito líquido e certo: direito comprovado de plano, sem necessidade de dilação probatória. " +
      "Os fatos devem ser demonstráveis por documentação inequívoca (prova pré-constituída).\n" +
      "2. Não amparado por HC ou HD: caráter residual — o MS cobre o espaço não protegido pelos outros remédios.\n" +
      "3. Ato de autoridade: praticado por autoridade pública ou agente de pessoa jurídica no exercício de função pública.\n" +
      "4. Ilegalidade ou abuso de poder.\n\n" +
      "PRAZO — DECADÊNCIA:\n" +
      "O MS deve ser impetrado em até 120 dias, contados da ciência pelo interessado do ato impugnado. " +
      "Trata-se de prazo DECADENCIAL — não se suspende nem se interrompe. Após esse prazo, o direito ao MS se extingue " +
      "(o direito material pode subsistir, mas não via MS).\n\n" +
      "MANDADO DE SEGURANÇA COLETIVO (art. 5º, LXX):\n" +
      "Pode ser impetrado por:\n" +
      "(a) Partido político com representação no Congresso Nacional.\n" +
      "(b) Organização sindical, entidade de classe ou associação legalmente constituída e em funcionamento há pelo menos um ano, " +
      "em defesa dos interesses de seus membros ou associados.\n\n" +
      "AÇÃO POPULAR (art. 5º, LXXIII):\n" +
      "'Qualquer cidadão é parte legítima para propor ação popular que vise a anular ato lesivo ao patrimônio público " +
      "ou de entidade de que o Estado participe, à moralidade administrativa, ao meio ambiente e ao patrimônio histórico e cultural, " +
      "ficando o autor, salvo comprovada má-fé, isento de custas judiciais e do ônus da sucumbência.'\n\n" +
      "LEGITIMIDADE ATIVA — CIDADÃO:\n" +
      "Apenas CIDADÃO pode propor ação popular. Cidadão = brasileiro nato ou naturalizado no pleno gozo dos direitos políticos " +
      "(eleitor em dia com a Justiça Eleitoral). " +
      "NÃO têm legitimidade: estrangeiros, pessoas jurídicas (empresas, entidades), apátridas, " +
      "brasileiros com direitos políticos suspensos ou perdidos.\n\n" +
      "OBJETO DA AÇÃO POPULAR:\n" +
      "1. Patrimônio público (bens e dinheiro do Estado).\n" +
      "2. Moralidade administrativa.\n" +
      "3. Meio ambiente.\n" +
      "4. Patrimônio histórico e cultural.\n\n" +
      "CUSTAS:\n" +
      "O cidadão-autor é isento de custas e do ônus da sucumbência. " +
      "Exceção: se agir de má-fé (propor ação sabidamente infundada), responde pelas custas e danos processuais.\n\n" +
      "SENTENÇA:\n" +
      "Procedente: anula o ato lesivo e condena os responsáveis a ressarcir o erário.\n" +
      "Improcedente: o réu não paga custas (salvo má-fé do autor).",
  },
];

// ─── QUESTÕES ─────────────────────────────────────────────────────────────────

const questions = [
  // ── Q01 — con_dg_c01 — Múltipla Escolha ──
  {
    id: "con_dg_q01",
    contentId: "con_dg_c01",
    statement:
      "(CESPE/CEBRASPE — Adaptada) Sobre o princípio da igualdade e o direito à vida " +
      "previstos no art. 5º da CF/88, assinale a alternativa CORRETA.",
    alternatives: [
      {
        letter: "A",
        text: "A pena de morte é absolutamente vedada pela CF/88, sem qualquer exceção, em razão de sua condição de cláusula pétrea.",
      },
      {
        letter: "B",
        text: "A igualdade formal trata desigualmente os desiguais na medida de suas desigualdades, fundamentando as cotas raciais.",
      },
      {
        letter: "C",
        text: "A vedação à tortura admite exceção nos casos de estado de sítio ou estado de defesa, quando a segurança nacional estiver ameaçada.",
      },
      {
        letter: "D",
        text: "A prática do racismo constitui crime inafiançável e imprescritível, nos termos do art. 5º, XLII, da CF/88.",
      },
      {
        letter: "E",
        text: "A igualdade prevista no caput do art. 5º aplica-se apenas aos brasileiros, excluindo os estrangeiros residentes no país.",
      },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "D = CORRETO: racismo = crime inafiançável + imprescritível (art. 5º, XLII). " +
      "A = ERRADO: pena de morte é vedada, mas tem exceção — guerra externa declarada (art. 5º, XLVII, 'a'). " +
      "B = ERRADO: confunde formal com material — igualdade MATERIAL trata desiguais desigualmente. " +
      "C = ERRADO: vedação à tortura é ABSOLUTA — não admite exceção sequer em estado de sítio. " +
      "E = ERRADO: o caput do art. 5º garante os direitos a brasileiros E estrangeiros residentes no país.",
    explanationCorrect:
      "Correto! Art. 5º, XLII: 'A prática do racismo constitui crime inafiançável e imprescritível, " +
      "sujeito à pena de reclusão, nos termos da lei.' " +
      "Imprescritível = a pretensão punitiva não se extingue com o tempo. " +
      "Inafiançável = não pode ser posto em liberdade provisória mediante fiança.",
    explanationWrong:
      "Atenção aos detalhes do art. 5º: Pena de morte é vedada, SALVO guerra externa declarada. " +
      "Igualdade FORMAL = perante a lei (tratamento idêntico); MATERIAL = trata desiguais desigualmente. " +
      "Tortura: absolutamente vedada — sem exceção, nem em estado de sítio. " +
      "Art. 5º, caput: 'brasileiros e estrangeiros residentes no País' — inclui estrangeiros.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q02 — con_dg_c01 — CERTO/ERRADO ──
  {
    id: "con_dg_q02",
    contentId: "con_dg_c01",
    statement:
      "(FGV — Adaptada) A Constituição Federal de 1988 veda a pena de morte em qualquer " +
      "hipótese, incluindo os casos de guerra externa declarada, por se tratar de cláusula " +
      "pétrea que protege o direito à vida de forma absoluta.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. O art. 5º, XLVII, 'a', da CF/88 veda a pena de morte SALVO em caso de guerra externa declarada. " +
      "A vedação à pena de morte é cláusula pétrea (art. 60, §4º, IV), mas a exceção da guerra também está na própria CF. " +
      "Portanto, em caso de guerra externa formalmente declarada pelo Congresso Nacional (art. 49, II, CF), " +
      "a pena de morte pode ser aplicada nos crimes militares definidos em lei.",
    explanationCorrect:
      "Correto! O item está ERRADO. A CF/88 veda a pena de morte como regra, " +
      "mas prevê expressamente a exceção para guerra externa declarada (art. 5º, XLVII, 'a'). " +
      "A cláusula pétrea não é absoluta nesse ponto — a própria CF prevê a exceção.",
    explanationWrong:
      "O item está ERRADO. Art. 5º, XLVII: 'não haverá penas: a) de morte, salvo em caso de guerra externa declarada.' " +
      "A guerra deve ser EXTERNA (não conflito interno) e DECLARADA (formalmente, pelo Congresso). " +
      "Fora dessa hipótese, a pena de morte é proibida. A exceção integra o próprio texto constitucional.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  // ── Q03 — con_dg_c02 — Múltipla Escolha ──
  {
    id: "con_dg_q03",
    contentId: "con_dg_c02",
    statement:
      "(CESPE/CEBRASPE — Adaptada) Sobre a inviolabilidade do domicílio prevista no art. 5º, XI, " +
      "da CF/88, assinale a situação em que é constitucionalmente VEDADA a entrada de agente " +
      "policial no domicílio sem o consentimento do morador.",
    alternatives: [
      {
        letter: "A",
        text: "Para prender em flagrante o morador que praticou crime dentro da residência, às 23h.",
      },
      {
        letter: "B",
        text: "Para prestar socorro ao morador vítima de mal súbito, às 2h da manhã.",
      },
      {
        letter: "C",
        text: "Para cumprir mandado de busca e apreensão expedido por juiz, às 22h.",
      },
      {
        letter: "D",
        text: "Para combater incêndio que ameaça se alastrar para residências vizinhas, às 4h da manhã.",
      },
      {
        letter: "E",
        text: "Para resgatar vítima de sequestro confinada no interior da residência, às 1h da manhã.",
      },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "C = VEDADO: mandado judicial (ordem judicial) só pode ser cumprido DURANTE O DIA (6h às 21h). " +
      "Às 22h está fora do período diurno — entrada é constitucionalmente vedada. " +
      "A = PERMITIDO: flagrante delito, a qualquer hora. " +
      "B = PERMITIDO: socorro, a qualquer hora. " +
      "D = PERMITIDO: desastre (incêndio), a qualquer hora. " +
      "E = PERMITIDO: socorro/flagrante, a qualquer hora.",
    explanationCorrect:
      "Correto! A CF/88 é clara: cumprimento de ordem judicial = APENAS DURANTE O DIA. " +
      "O STF fixou que 'dia' = 6h às 21h. Às 22h, o mandado não pode ser cumprido — " +
      "o agente deve aguardar o período diurno. " +
      "Flagrante, desastre e socorro: qualquer hora, dia ou noite.",
    explanationWrong:
      "Regra de ouro: 3 exceções a qualquer hora (FDS = Flagrante, Desastre, Socorro). " +
      "1 exceção só de dia (6h–21h): ordem judicial. " +
      "C está vedado porque às 22h é noite — mandado não pode ser cumprido fora do período diurno. " +
      "A, B, D e E estão enquadrados nas exceções que independem do horário.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q04 — con_dg_c02 — CERTO/ERRADO ──
  {
    id: "con_dg_q04",
    contentId: "con_dg_c02",
    statement:
      "(STF — Adaptada) Conforme entendimento firmado pelo STF no HC 598.051/SP, " +
      "a entrada de policiais em domicílio para verificação de denúncia anônima de tráfico " +
      "de drogas, sem mandado judicial e sem situação de flagrância preexistente perceptível " +
      "externamente, é constitucional, pois o combate ao tráfico justifica a flexibilização " +
      "da inviolabilidade do domicílio.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. No HC 598.051/SP (2020), o STF firmou tese contrária: a entrada forçada em domicílio " +
      "sem mandado judicial só é lícita quando amparada em fundadas razões individualizadas e " +
      "devidamente justificadas. Denúncia anônima por si só não é suficiente. " +
      "Provas obtidas em busca domiciliar ilegal são ilícitas e devem ser desentranhadas do processo. " +
      "O combate ao tráfico não afasta a proteção constitucional do domicílio.",
    explanationCorrect:
      "Correto! O item está ERRADO. O STF no HC 598.051 protegeu a inviolabilidade do domicílio " +
      "mesmo no contexto do tráfico de drogas. " +
      "A entrada sem mandado exige fundadas razões documentadas — denúncia anônima não basta. " +
      "A gravidade do crime não justifica, por si só, a violação do domicílio.",
    explanationWrong:
      "O item está ERRADO. O STF (HC 598.051/SP, 2020) fixou que:\n" +
      "1. A entrada sem mandado exige fundadas razões individualizadas.\n" +
      "2. Mera denúncia anônima não configura fundadas razões.\n" +
      "3. A gravidade do crime (tráfico) não justifica per se a violação do domicílio.\n" +
      "4. Provas obtidas em busca ilegal são ilícitas (art. 5º, LVI, CF).\n" +
      "Combate ao tráfico é relevante, mas não afasta garantias fundamentais.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
  // ── Q05 — con_dg_c03 — Múltipla Escolha ──
  {
    id: "con_dg_q05",
    contentId: "con_dg_c03",
    statement:
      "(FCC — Adaptada) Em relação à inviolabilidade das comunicações e ao sigilo " +
      "previsto no art. 5º, XII, da CF/88, assinale a alternativa CORRETA.",
    alternatives: [
      {
        letter: "A",
        text: "A interceptação telefônica pode ser determinada pelo delegado de polícia, independentemente de autorização judicial, nos casos de investigação de crime organizado.",
      },
      {
        letter: "B",
        text: "O sigilo das comunicações telefônicas é absoluto, não admitindo interceptação mesmo com ordem judicial.",
      },
      {
        letter: "C",
        text: "A interceptação telefônica ordenada judicialmente pode ser utilizada como prova em processo civil, quando envolver questão de alta relevância.",
      },
      {
        letter: "D",
        text: "A Comissão Parlamentar de Inquérito (CPI) pode determinar a quebra de sigilo bancário e fiscal, sem necessidade de autorização judicial.",
      },
      {
        letter: "E",
        text: "A vedação ao anonimato impede que jornalistas mantenham suas fontes em sigilo, pois todo emissor de informação deve ser identificado.",
      },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "D = CORRETO: CPI possui poderes investigatórios equivalentes aos das autoridades judiciais (art. 58, §3º, CF) " +
      "— pode quebrar sigilo bancário e fiscal diretamente (STF MS 23.452). " +
      "A = ERRADO: interceptação exige ORDEM JUDICIAL — delegado não pode determinar sozinho. " +
      "B = ERRADO: sigilo telefônico admite exceção por ordem judicial para fins criminais (art. 5º, XII). " +
      "C = ERRADO: interceptação telefônica se destina exclusivamente à investigação criminal ou instrução processual penal (Lei 9.296/96). " +
      "E = ERRADO: vedação ao anonimato não impede sigilo de fonte — são institutos distintos.",
    explanationCorrect:
      "Correto! CPI tem poderes de investigação próprios de autoridades judiciais (art. 58, §3º, CF). " +
      "O STF consolidou que CPI pode determinar quebra de sigilo bancário e fiscal sem autorização judicial. " +
      "Isso não vale, porém, para interceptação telefônica — essa exige ordem judicial (cláusula de reserva jurisdicional).",
    explanationWrong:
      "Interceptação telefônica: sempre exige ORDEM JUDICIAL + fins penais (Lei 9.296/96). " +
      "Delegado sozinho não pode — reserva de jurisdição. " +
      "CPI pode quebrar sigilo bancário/fiscal (STF), mas NÃO pode interceptar telefone (só juiz). " +
      "Sigilo de fonte ≠ anonimato: jornalista se identifica, mas preserva a fonte.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q06 — con_dg_c03 — CERTO/ERRADO ──
  {
    id: "con_dg_q06",
    contentId: "con_dg_c03",
    statement:
      "(CESPE/CEBRASPE — Adaptada) A Constituição Federal de 1988 protege o anonimato " +
      "como forma de garantir a liberdade de expressão, permitindo que o indivíduo " +
      "manifeste suas opiniões sem necessidade de se identificar perante a sociedade.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. A CF/88 faz o contrário: garante a liberdade de manifestação do pensamento, " +
      "mas VEDA o anonimato (art. 5º, IV). O indivíduo pode expressar sua opinião livremente, " +
      "mas deve se identificar — isso assegura a responsabilização por eventuais danos causados a terceiros. " +
      "O anonimato é proibido justamente para inibir abusos da liberdade de expressão.",
    explanationCorrect:
      "Correto! O item está ERRADO. Art. 5º, IV: 'é livre a manifestação do pensamento, sendo vedado o anonimato.' " +
      "A Constituição simultaneamente garante a liberdade de expressão E veda o anonimato. " +
      "A identificação do emissor é pressuposto da responsabilidade civil e penal.",
    explanationWrong:
      "O item está ERRADO. Art. 5º, IV: 'é livre a manifestação do pensamento, sendo VEDADO O ANONIMATO.' " +
      "A CF garante a expressão, mas exige identificação. " +
      "Não confunda: sigilo de fonte (o jornalista se identifica, mas protege a fonte) " +
      "é diferente de anonimato (o autor não se identifica). " +
      "O anonimato é expressamente proibido pela Constituição.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  // ── Q07 — con_dg_c04 — Múltipla Escolha ──
  {
    id: "con_dg_q07",
    contentId: "con_dg_c04",
    statement:
      "(FGV — Adaptada) Com relação ao direito de reunião previsto no art. 5º, XVI, da CF/88, " +
      "assinale a alternativa que apresenta os requisitos constitucionalmente exigidos para " +
      "o exercício válido desse direito.",
    alternatives: [
      {
        letter: "A",
        text: "Fins pacíficos, sem armas, em local aberto ao público, com autorização prévia da autoridade policial.",
      },
      {
        letter: "B",
        text: "Fins pacíficos, sem armas, em local aberto ao público, com prévio aviso à autoridade competente e sem frustrar outra reunião previamente convocada para o mesmo local.",
      },
      {
        letter: "C",
        text: "Fins pacíficos, em local aberto ao público, com prévio aviso e mínimo de 50 participantes para configurar reunião constitucionalmente protegida.",
      },
      {
        letter: "D",
        text: "Fins pacíficos, sem armas, com autorização do poder público e realização em dias úteis, em horário comercial.",
      },
      {
        letter: "E",
        text: "Fins lícitos, sem armas, em qualquer local, com aviso prévio de 48 horas à autoridade policial competente.",
      },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "B = CORRETO: art. 5º, XVI — reunião pacífica, sem armas, local público, prévio aviso, " +
      "sem frustrar outra reunião no mesmo local — independente de autorização. " +
      "A = ERRADO: autorização prévia da polícia NÃO é requisito — apenas aviso. " +
      "C = ERRADO: não há exigência de número mínimo de participantes. " +
      "D = ERRADO: a CF não prevê restrição de dias/horários, nem autorização. " +
      "E = ERRADO: 'fins lícitos' é mais amplo que o texto constitucional (que diz 'fins pacíficos'); " +
      "prazo de 48h não está na CF.",
    explanationCorrect:
      "Correto! Os requisitos constitucionais (art. 5º, XVI) são exatamente: " +
      "(1) fins pacíficos; (2) sem armas; (3) locais abertos ao público; " +
      "(4) prévio aviso à autoridade; (5) sem frustrar reunião anterior no mesmo local. " +
      "O direito independe de AUTORIZAÇÃO — isso é fundamental para provas.",
    explanationWrong:
      "Ponto crítico: o direito de reunião INDEPENDE DE AUTORIZAÇÃO (art. 5º, XVI: 'independentemente de autorização'). " +
      "O prévio aviso é simples comunicação — não é pedido de permissão. " +
      "A CF não fixa número mínimo de participantes nem restrições de horário. " +
      "Autoridade que condiciona reunião à sua autorização viola direito fundamental.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q08 — con_dg_c04 — CERTO/ERRADO ──
  {
    id: "con_dg_q08",
    contentId: "con_dg_c04",
    statement:
      "(FCC — Adaptada) A dissolução compulsória de associação pode ser determinada " +
      "por ato administrativo do Poder Executivo, quando a associação praticar atos " +
      "contrários à ordem pública ou à segurança nacional.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. Art. 5º, XIX: 'as associações só poderão ser compulsoriamente dissolvidas ou ter suas " +
      "atividades suspensas por decisão judicial, exigindo-se, no primeiro caso, o trânsito em julgado.' " +
      "Portanto, a dissolução compulsória exige: (1) decisão judicial; e (2) trânsito em julgado. " +
      "Ato administrativo do Executivo não tem esse poder — violaria a garantia constitucional.",
    explanationCorrect:
      "Correto! O item está ERRADO. A dissolução de associação exige DECISÃO JUDICIAL TRANSITADA EM JULGADO. " +
      "O Executivo não pode dissolver associação por ato administrativo — " +
      "isso seria grave violação à liberdade de associação e à separação de poderes.",
    explanationWrong:
      "O item está ERRADO. Art. 5º, XIX — distinção essencial:\n" +
      "Suspensão de atividades: basta decisão judicial (sem trânsito em julgado).\n" +
      "Dissolução compulsória: exige decisão judicial TRANSITADA EM JULGADO.\n" +
      "Em nenhum caso o Poder Executivo pode dissolver uma associação por ato administrativo — " +
      "somente o Judiciário tem esse poder.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  // ── Q09 — con_dg_c05 — Múltipla Escolha ──
  {
    id: "con_dg_q09",
    contentId: "con_dg_c05",
    statement:
      "(CESPE/CEBRASPE — Adaptada) Sobre os remédios constitucionais habeas corpus e habeas data, " +
      "assinale a alternativa CORRETA.",
    alternatives: [
      {
        letter: "A",
        text: "O habeas data pode ser impetrado por qualquer pessoa para obter informações sobre terceiros em bancos de dados governamentais.",
      },
      {
        letter: "B",
        text: "O habeas corpus é cabível para proteger direito à informação pessoal constante de banco de dados de entidade pública.",
      },
      {
        letter: "C",
        text: "O habeas data prescinde de prévio requerimento administrativo, podendo ser impetrado diretamente no Judiciário.",
      },
      {
        letter: "D",
        text: "O habeas corpus preventivo é concedido na forma de salvo-conduto para proteger quem está ameaçado de sofrer violência em sua liberdade de locomoção.",
      },
      {
        letter: "E",
        text: "O habeas corpus exige representação por advogado e recolhimento de custas, em razão de sua natureza de ação constitucional.",
      },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "D = CORRETO: HC preventivo (ou salvo-conduto) — cabe quando há AMEAÇA de constrangimento à liberdade (art. 5º, LXVIII). " +
      "A = ERRADO: HD é apenas para informações SOBRE O PRÓPRIO IMPETRANTE — não serve para terceiros. " +
      "B = ERRADO: direito à informação pessoal em banco de dados = remédio é o HD, não o HC. " +
      "C = ERRADO: HD exige prévio requerimento administrativo frustrado — STJ Súmula 2. " +
      "E = ERRADO: HC não exige advogado e é gratuito — pode ser impetrado por qualquer pessoa.",
    explanationCorrect:
      "Correto! HC preventivo = salvo-conduto: protege quem está NA IMINÊNCIA de ter sua liberdade de " +
      "locomoção violada. Ao receber o salvo-conduto, o paciente não pode ser preso pela autoridade que " +
      "ameaçava fazê-lo. Compare com o HC liberatório, que liberta quem já está preso.",
    explanationWrong:
      "Diferencie: HC = liberdade de locomoção (ir e vir). HD = informações pessoais em bancos de dados. " +
      "HD é para o próprio titular — não serve a terceiros. " +
      "HD exige requerimento administrativo prévio (Súmula 2 STJ). " +
      "HC é gratuito e dispensa advogado — qualquer pessoa pode impetrar. " +
      "HC preventivo = salvo-conduto (ameaça); liberatório = livra quem está preso.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q10 — con_dg_c05 — CERTO/ERRADO ──
  {
    id: "con_dg_q10",
    contentId: "con_dg_c05",
    statement:
      "(STJ — Adaptada) O habeas data pode ser impetrado diretamente no Poder Judiciário, " +
      "independentemente de prévio requerimento administrativo, sempre que o impetrante " +
      "demonstrar urgência na obtenção das informações pessoais junto à entidade pública.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. O STJ, na Súmula 2, fixou que não cabe habeas data se não houve prévia recusa " +
      "de informações por parte da autoridade administrativa. A urgência não afasta essa exigência. " +
      "O prévio requerimento administrativo é condição de admissibilidade do HD — sem ele, falta " +
      "interesse de agir (ausência de resistência a afastar). Se não houve negativa, não há lide.",
    explanationCorrect:
      "Correto! O item está ERRADO. STJ Súmula 2: habeas data exige prévia recusa administrativa. " +
      "Sem o requerimento administrativo e sua negativa (ou omissão por prazo razoável), " +
      "o HD não é admissível — falta interesse processual. Urgência não supre esse requisito.",
    explanationWrong:
      "O item está ERRADO. STJ Súmula 2: 'Não cabe o habeas data se não houve recusa de informações " +
      "por parte da autoridade administrativa.' " +
      "Ordem: (1) requerer administrativamente; (2) ser recusado ou ignorado; (3) impetrar HD. " +
      "Se pular a etapa 1, o HD é extinto sem resolução do mérito (falta de interesse de agir). " +
      "Urgência não dispensa o prévio requerimento.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  // ── Q11 — con_dg_c06 — Múltipla Escolha ──
  {
    id: "con_dg_q11",
    contentId: "con_dg_c06",
    statement:
      "(FCC — Adaptada) Sobre o mandado de segurança e a ação popular previstos no art. 5º da CF/88, " +
      "assinale a alternativa CORRETA.",
    alternatives: [
      {
        letter: "A",
        text: "O mandado de segurança pode ser impetrado a qualquer tempo, pois o prazo decadencial de 120 dias aplica-se apenas ao mandado de segurança coletivo.",
      },
      {
        letter: "B",
        text: "Qualquer pessoa, inclusive estrangeira não residente, pode ajuizar ação popular para proteger o patrimônio público.",
      },
      {
        letter: "C",
        text: "O mandado de segurança coletivo pode ser impetrado por partido político com representação no Congresso Nacional, em defesa de interesses coletivos.",
      },
      {
        letter: "D",
        text: "Na ação popular, o autor é sempre condenado ao pagamento das custas processuais em caso de improcedência da ação.",
      },
      {
        letter: "E",
        text: "O mandado de segurança é cabível para proteger direito líquido e certo ameaçado por ato de particular que não exerce qualquer função pública.",
      },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "C = CORRETO: art. 5º, LXX, 'a' — partido político com representação no Congresso pode impetrar MS coletivo. " +
      "A = ERRADO: o prazo de 120 dias aplica-se ao MS individual e coletivo. " +
      "B = ERRADO: ação popular é exclusiva de CIDADÃO (brasileiro eleitor) — não serve a estrangeiros. " +
      "D = ERRADO: o autor de ação popular é isento de custas, salvo má-fé (art. 5º, LXXIII). " +
      "E = ERRADO: MS cabe contra ato de autoridade pública ou agente de pessoa jurídica no exercício de atribuições públicas — não contra particular comum.",
    explanationCorrect:
      "Correto! Art. 5º, LXX: MS coletivo pode ser impetrado por partido político com representação " +
      "no Congresso Nacional (basta 1 parlamentar) ou por organização sindical, entidade de classe " +
      "ou associação com pelo menos 1 ano de constituição, em defesa de seus membros.",
    explanationWrong:
      "MS: prazo de 120 dias (decadencial) vale para individual e coletivo. " +
      "Ação popular: só CIDADÃO (eleitor em dia) — excluídos estrangeiros, PJs, eleitores com direitos suspensos. " +
      "Ação popular: autor isento de custas SALVO má-fé. " +
      "MS: exige ato de AUTORIDADE (pública ou agente de PJ em função pública) — não cabe contra particular comum.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q12 — con_dg_c06 — CERTO/ERRADO ──
  {
    id: "con_dg_q12",
    contentId: "con_dg_c06",
    statement:
      "(CESPE/CEBRASPE — Adaptada) Qualquer pessoa, brasileira ou estrangeira, " +
      "residente ou não no Brasil, tem legitimidade para ajuizar ação popular visando " +
      "à anulação de ato lesivo ao patrimônio público, por se tratar de direito " +
      "fundamental garantido a todos pelo art. 5º da CF/88.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. Art. 5º, LXXIII: 'qualquer cidadão é parte legítima para propor ação popular'. " +
      "CIDADÃO = brasileiro nato ou naturalizado no pleno gozo dos direitos políticos (eleitor em dia). " +
      "Estrangeiros, apátridas, pessoas jurídicas e brasileiros com direitos políticos suspensos ou perdidos " +
      "NÃO têm legitimidade para a ação popular. O art. 5º do caput garante direitos a estrangeiros, " +
      "mas a ação popular é reservada a quem é eleitor.",
    explanationCorrect:
      "Correto! O item está ERRADO. A ação popular exige a condição de CIDADÃO, " +
      "que é mais restrita do que 'qualquer pessoa'. " +
      "Cidadão = brasileiro (nato ou naturalizado) + eleitor em dia com a Justiça Eleitoral. " +
      "Estrangeiros, mesmo residentes, não têm essa legitimidade.",
    explanationWrong:
      "O item está ERRADO. Ação popular: legitimado = CIDADÃO (art. 5º, LXXIII). " +
      "Cidadão, no direito constitucional brasileiro, é o nacional que detém direitos políticos e está quite com a Justiça Eleitoral. " +
      "Não são cidadãos para fins de ação popular: estrangeiros (com ou sem residência), " +
      "brasileiros com direitos políticos suspensos (art. 15, CF), menores de 16 anos sem título eleitoral.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
];

// ─── RUNNER ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Seed R32 — Direito Constitucional: Direitos Individuais e Coletivos (Art. 5º) ===\n");

  // 1. Resolver Subject
  const subjectRows = (await db.execute(sql`
    SELECT id FROM "Subject"
    WHERE name ILIKE '%Constitucional%'
       OR name ILIKE '%Dir%Constitucional%'
    ORDER BY name
    LIMIT 1
  `)) as any[];

  if (!subjectRows[0]) {
    throw new Error('Subject com "Constitucional" não encontrado. Verifique o banco.');
  }
  const subjectId = subjectRows[0].id;
  console.log(`Subject encontrado: ${subjectId}`);

  // 2. Resolver Topic
  const topicRows = (await db.execute(sql`
    SELECT id FROM "Topic"
    WHERE "subjectId" = ${subjectId}
    ORDER BY name
    LIMIT 1
  `)) as any[];

  if (!topicRows[0]) {
    throw new Error("Nenhum Topic encontrado para este Subject.");
  }
  const topicId = topicRows[0].id;
  console.log(`Topic encontrado: ${topicId}`);

  // 3. Inserir Conteúdos
  console.log("\n--- Inserindo Conteúdos ---");
  for (const c of contents) {
    const wordCount = c.textContent.split(/\s+/).filter(Boolean).length;
    const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

    await db.execute(sql`
      INSERT INTO "Content" (
        id, title, "textContent", "subjectId", "topicId",
        "mnemonic", "keyPoint", "practicalExample",
        difficulty, "wordCount", "estimatedReadTime", "isActive", "createdAt", "updatedAt"
      ) VALUES (
        ${c.id}, ${c.title}, ${c.textContent}, ${subjectId}, ${topicId},
        ${c.mnemonic}, ${c.keyPoint}, ${c.practicalExample},
        ${c.difficulty}, ${wordCount}, ${estimatedReadTime}, true, NOW(), NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `);
    console.log(`  OK: ${c.id} — ${c.title} (${wordCount} palavras, ~${estimatedReadTime} min)`);
  }

  // 4. Inserir Questões
  console.log("\n--- Inserindo Questões ---");
  for (const q of questions) {
    const contentRows = (await db.execute(sql`
      SELECT id FROM "Content" WHERE id = ${q.contentId} LIMIT 1
    `)) as any[];

    if (!contentRows[0]) {
      console.warn(`  SKIP: contentId ${q.contentId} não encontrado para questão ${q.id}`);
      continue;
    }
    const resolvedContentId = contentRows[0].id;
    const alternativesJson = JSON.stringify(q.alternatives);

    await db.execute(sql`
      INSERT INTO "Question" (
        "id", "statement", "alternatives", "correctAnswer", "correctOption",
        "explanation", "explanationCorrect", "explanationWrong",
        "subjectId", "topicId", "contentId",
        "isActive", "difficulty", "timesUsed", "questionType",
        "createdAt", "updatedAt"
      ) VALUES (
        ${q.id}, ${q.statement}, ${alternativesJson}::jsonb, ${q.correctAnswer}, ${q.correctOption},
        ${q.explanation}, ${q.explanationCorrect}, ${q.explanationWrong},
        ${subjectId}, ${topicId}, ${resolvedContentId},
        true, ${q.difficulty}, 0, ${q.questionType}, NOW(), NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `);
    console.log(`  OK: ${q.id} [${q.questionType}] — ${q.statement.substring(0, 60)}...`);
  }

  console.log("\n=== R32 concluído: 6 átomos + 12 questões de Direitos Individuais e Coletivos (Art. 5º) ===");
  process.exit(0);
}

main().catch((err) => {
  console.error("ERRO no seed R32:", err);
  process.exit(1);
});
