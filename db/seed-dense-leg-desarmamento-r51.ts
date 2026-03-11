/**
 * Seed R51 — DENSIFICAÇÃO: LEG_ESPECIAL — Estatuto do Desarmamento (Lei 10.826/2003)
 * Átomos: lpe_da_c01–c06 (já existentes no banco)
 * 48 questões novas: 8 por átomo (4 CE + 4 ME), progressão FACIL→DIFICIL
 * Execução: npx tsx db/seed-dense-leg-desarmamento-r51.ts
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

  // ── lpe_da_c01 — Posse Irregular vs Porte Ilegal (Arts. 12 e 14) ─────────

  {
    id: "lpe_da_c01_q01",
    contentId: "lpe_da_c01",
    statement: "O crime de posse irregular de arma de fogo de uso permitido (art. 12 da Lei 10.826/2003) é punido com pena de detenção de 1 a 3 anos e multa.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Art. 12 da Lei 10.826/2003: posse irregular de arma de uso permitido — pena de detenção de 1 a 3 anos + multa.",
    explanationCorrect: "Certo: art. 12 prevê detenção de 1 a 3 anos + multa. Detenção (não reclusão) porque é o tipo menos grave da lei.",
    explanationWrong: "Não há erro. A pena é exatamente detenção de 1 a 3 anos + multa, conforme art. 12 da Lei 10.826/2003.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c01_q02",
    contentId: "lpe_da_c01",
    statement: "O crime de porte ilegal de arma de fogo (art. 14 da Lei 10.826/2003) somente se configura se a arma estiver municiada e em condições de efetuar disparos.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Os crimes dos arts. 12 e 14 são de PERIGO ABSTRATO. A arma desmuniciada configura o crime — não é necessário que esteja apta a disparar (STJ, jurisprudência consolidada).",
    explanationCorrect: "Errado: os crimes do Estatuto do Desarmamento são de perigo abstrato. Arma desmuniciada configura o tipo. Exceção: arma completamente inapta para disparo (defeituosa/desmontada) pode afastar a tipicidade.",
    explanationWrong: "A alternativa afirma que a arma precisa estar municiada — isso está errado. Basta a posse/porte irregular, independentemente de estar municiada.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c01_q03",
    contentId: "lpe_da_c01",
    statement: "A posse irregular (art. 12) e o porte ilegal (art. 14) de arma de fogo são classificados como crimes permanentes, admitindo prisão em flagrante enquanto perdurar a situação ilícita.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Ambos são crimes permanentes: a consumação se protrai no tempo enquanto o agente mantém a arma em seu poder sem autorização. O flagrante pode ser lavrado a qualquer momento.",
    explanationCorrect: "Certo: crimes permanentes — a situação ilícita persiste enquanto o agente mantém a arma. Isso autoriza a prisão em flagrante a qualquer tempo, sem necessidade de mandado judicial.",
    explanationWrong: "A afirmação está correta. Ambos os crimes são permanentes, permitindo flagrante enquanto perdurar a conduta ilícita.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c01_q04",
    contentId: "lpe_da_c01",
    statement: "Segundo o STJ, a arma de fogo completamente inapta para disparar, por ser defeituosa e desmontada, afasta a tipicidade dos crimes do Estatuto do Desarmamento.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "O STJ admite a atipicidade quando a arma é absolutamente inapta para disparo — distinguindo da arma apenas desmuniciada (que configura o crime). Arma defeituosa sem possibilidade de uso afasta o perigo abstrato.",
    explanationCorrect: "Certo: STJ admite exceção para arma completamente inapta (defeituosa/desmontada sem possibilidade de uso). Isso difere da arma apenas desmuniciada — que continua configurando o crime de perigo abstrato.",
    explanationWrong: "A afirmação está correta — esta é a exceção reconhecida pelo STJ para armas absolutamente ineficazes.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c01_q05",
    contentId: "lpe_da_c01",
    statement: "Quanto à distinção entre posse irregular (art. 12) e porte ilegal (art. 14) de arma de fogo de uso permitido, assinale a opção correta.",
    alternatives: [
      { letter: "A", text: "Ambos têm a mesma pena, pois tratam da mesma conduta em locais distintos." },
      { letter: "B", text: "A posse (art. 12) refere-se à arma mantida em local fixo (residência ou estabelecimento), com pena de detenção; o porte (art. 14) refere-se à arma em circulação ou consigo, com pena de reclusão." },
      { letter: "C", text: "O porte (art. 14) é crime menos grave que a posse (art. 12), pois o agente expõe apenas a si mesmo ao perigo." },
      { letter: "D", text: "A posse e o porte são crimes de dano — exigem resultado lesivo concreto para a configuração do tipo." },
      { letter: "E", text: "O porte ilegal configura crime somente quando praticado em via pública — dentro de veículo particular não há crime." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "A distinção central: posse (art. 12) = local fixo (casa/trabalho), pena de detenção 1-3 anos; porte (art. 14) = mobilidade/circulação, pena de reclusão 2-4 anos. Porte é mais grave.",
    explanationCorrect: "B: posse (art. 12) = arma em local fixo, detenção 1-3 anos. Porte (art. 14) = arma em circulação/consigo, reclusão 2-4 anos. A mobilidade é o elemento diferenciador — porte é mais grave.",
    explanationWrong: "A: penas diferentes. C: porte é mais grave (reclusão) que posse (detenção). D: são crimes de perigo abstrato, não de dano. E: o porte dentro de veículo também configura crime.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "lpe_da_c01_q06",
    contentId: "lpe_da_c01",
    statement: "Policial civil, durante busca domiciliar, encontra revólver calibre .38 sem registro dentro do quarto do morador. O crime praticado pelo morador é:",
    alternatives: [
      { letter: "A", text: "Porte ilegal de arma de fogo (art. 14) — reclusão de 2 a 4 anos." },
      { letter: "B", text: "Posse irregular de arma de fogo (art. 12) — detenção de 1 a 3 anos." },
      { letter: "C", text: "Tráfico ilícito de arma de fogo (art. 18) — reclusão de 8 a 16 anos." },
      { letter: "D", text: "Porte ilegal de arma de uso restrito (art. 16) — reclusão de 3 a 6 anos." },
      { letter: "E", text: "Não há crime, pois a Constituição garante o direito à propriedade privada no domicílio." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Arma encontrada dentro da residência sem registro = posse irregular (art. 12), pena de detenção de 1 a 3 anos. O art. 14 (porte) exige mobilidade — trazer consigo fora do local fixo.",
    explanationCorrect: "B: arma encontrada na residência = posse irregular (art. 12), detenção 1-3 anos. Revólver .38 é calibre de uso permitido. Posse = local fixo. Se estivesse na cintura do agente em via pública = porte (art. 14).",
    explanationWrong: "A: porte (art. 14) exige mobilidade — arma em circulação, não em local fixo. C: art. 18 é tráfico internacional — não se aplica. D: art. 16 é uso restrito — .38 é uso permitido. E: a CF não autoriza posse irregular de arma.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "lpe_da_c01_q07",
    contentId: "lpe_da_c01",
    statement: "A pena do porte ilegal de arma de fogo de uso permitido (art. 14) é mais grave do que a da posse irregular (art. 12) porque:",
    alternatives: [
      { letter: "A", text: "O porte é considerado crime hediondo, ao passo que a posse não." },
      { letter: "B", text: "O porte expõe a coletividade a maior risco — a arma é levada a locais públicos, aumentando o perigo abstrato para terceiros." },
      { letter: "C", text: "O porte só é crime quando praticado por pessoa com antecedentes criminais." },
      { letter: "D", text: "A diferença de pena se deve à natureza da arma — no porte, a arma deve ser de maior calibre." },
      { letter: "E", text: "Não há diferença de pena — ambos têm detenção de 1 a 3 anos." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O porte (art. 14) é mais grave porque expõe a coletividade a risco maior — a arma circula em locais públicos. A posse (art. 12) tem risco mais limitado ao local fixo.",
    explanationCorrect: "B: a maior gravidade do porte decorre do risco coletivo ampliado — a arma circula em vias públicas e espaços coletivos, expondo terceiros a perigo abstrato de maior extensão.",
    explanationWrong: "A: nem posse nem porte (arts. 12 e 14) são hediondos — apenas arts. 16, 17 e 18. C: o porte independe de antecedentes. D: ambos tratam de armas de uso permitido. E: penas diferentes: posse = detenção 1-3; porte = reclusão 2-4.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "lpe_da_c01_q08",
    contentId: "lpe_da_c01",
    statement: "Sobre os crimes do Estatuto do Desarmamento e a classificação doutrinária quanto ao resultado, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "São crimes de perigo concreto — exigem demonstração de risco efetivo à vítima determinada." },
      { letter: "B", text: "São crimes de dano — consumam-se com a lesão ao bem jurídico protegido." },
      { letter: "C", text: "São crimes de perigo abstrato — a simples prática da conduta gera presunção legal de perigo, independentemente de resultado." },
      { letter: "D", text: "São crimes formais com resultado naturalístico, exigindo uso efetivo da arma." },
      { letter: "E", text: "São crimes habituais — a conduta isolada de uma única vez não configura o tipo penal." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Os crimes da Lei 10.826/2003 (arts. 12 e 14) são de perigo abstrato — a simples prática da conduta (ter/portar arma sem autorização) já configura o crime, sem necessidade de resultado concreto.",
    explanationCorrect: "C: perigo abstrato — a presunção de perigo é legal e absoluta. Não precisa demonstrar risco efetivo a pessoa determinada. Por isso arma desmuniciada também configura o crime (salvo arma completamente inapta).",
    explanationWrong: "A: não é perigo concreto — não precisa demonstrar risco efetivo. B: não é crime de dano — não exige lesão. D: não exige uso efetivo da arma. E: não são crimes habituais — um único ato já configura o tipo.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── lpe_da_c02 — Arts. 6º e 7º — Autorizados ────────────────────────────

  {
    id: "lpe_da_c02_q01",
    contentId: "lpe_da_c02",
    statement: "Segundo a Lei 10.826/2003, o empresário que comprova fundado temor por sua vida pode obter autorização de porte de arma de fogo por via administrativa, desde que apresente laudo psicológico favorável.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "O art. 6° da Lei 10.826/2003 traz lista TAXATIVA de quem pode portar arma. Empresário comum não consta da lista — alegação de risco pessoal não autoriza o porte. A autorização exige enquadramento em uma das categorias do art. 6°.",
    explanationCorrect: "Errado: a lista do art. 6° é taxativa (numerus clausus). Empresário comum, ainda que comprove risco, não está no rol — não há autorização por via administrativa por mero temor.",
    explanationWrong: "A afirmação está incorreta: a lista do art. 6° é taxativa e não inclui empresário comum por temor pessoal.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c02_q02",
    contentId: "lpe_da_c02",
    statement: "Os membros do Ministério Público são expressamente autorizados pela Lei 10.826/2003 a possuir e portar arma de fogo.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Art. 6°, X da Lei 10.826/2003: membros do Ministério Público estão expressamente no rol de autorizados a possuir e portar arma de fogo.",
    explanationCorrect: "Certo: art. 6°, X — membros do Ministério Público são expressamente incluídos. Também estão incluídos membros do Poder Judiciário (art. 6°, XI).",
    explanationWrong: "A afirmação está correta — o MP está no art. 6°, X da Lei 10.826/2003.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c02_q03",
    contentId: "lpe_da_c02",
    statement: "Todos os guardas municipais do país estão autorizados a portar arma de fogo, independentemente do porte populacional do município em que atuam.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Art. 6°, VIII: guardas municipais autorizados APENAS nas capitais dos estados e nos municípios com mais de 500.000 habitantes. Municípios menores não estão incluídos na autorização.",
    explanationCorrect: "Errado: a autorização para guardas municipais é restrita às capitais estaduais e municípios com mais de 500.000 habitantes (art. 6°, VIII). Municípios menores não têm essa autorização.",
    explanationWrong: "A afirmação está incorreta — a autorização para guardas municipais é condicionada ao porte do município (capitais ou >500 mil habitantes).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c02_q04",
    contentId: "lpe_da_c02",
    statement: "Policiais civis e militares da reserva remunerada ou reformados estão autorizados a possuir e portar arma de fogo pela Lei 10.826/2003.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Art. 6°, VI e VII da Lei 10.826/2003: policiais civis e militares da reserva remunerada ou reformados estão expressamente incluídos no rol de autorizados.",
    explanationCorrect: "Certo: art. 6°, VI — policiais civis e militares da reserva/reformados. Art. 6°, VII — militares das FFAA reformados. Ambos mantêm a autorização mesmo após deixarem o serviço ativo.",
    explanationWrong: "A afirmação está correta — reformados e da reserva remunerada estão no art. 6°, VI e VII.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c02_q05",
    contentId: "lpe_da_c02",
    statement: "Sobre o porte de arma de fogo por guardas municipais, conforme a Lei 10.826/2003, assinale a opção correta.",
    alternatives: [
      { letter: "A", text: "Todos os guardas municipais do país podem portar arma de fogo em serviço e fora de serviço." },
      { letter: "B", text: "Apenas guardas municipais das capitais dos estados e de municípios com mais de 500.000 habitantes, em regra apenas em serviço." },
      { letter: "C", text: "Apenas guardas municipais de municípios com mais de 1 milhão de habitantes." },
      { letter: "D", text: "Guardas municipais não estão na lista do art. 6° — precisam de autorização judicial individual." },
      { letter: "E", text: "Guardas municipais podem portar arma de fogo em qualquer município, desde que aprovados em curso de capacitação." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Art. 6°, VIII: guardas municipais das capitais dos estados e dos municípios com mais de 500.000 habitantes, autorizados em regra apenas em serviço (conforme regulamentação específica).",
    explanationCorrect: "B: art. 6°, VIII da Lei 10.826/2003 — capitais dos estados e municípios com +500 mil habitantes. A autorização é em regra restrita ao serviço — conforme regulamentação do estatuto municipal e normas complementares.",
    explanationWrong: "A: não é em qualquer município nem fora de serviço em regra. C: o limite é 500 mil — não 1 milhão. D: guardas municipais estão no art. 6°, VIII. E: a capacitação é condição necessária, mas não suficiente — o porte também depende do porte do município.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "lpe_da_c02_q06",
    contentId: "lpe_da_c02",
    statement: "Juiz federal que recebe ameaças de morte deseja portar arma de fogo. Com base na Lei 10.826/2003, essa autorização:",
    alternatives: [
      { letter: "A", text: "Depende de autorização judicial específica do tribunal a que pertence." },
      { letter: "B", text: "É vedada, pois a magistratura não está no rol do art. 6°." },
      { letter: "C", text: "Decorre diretamente do art. 6°, XI da lei, que inclui membros do Poder Judiciário." },
      { letter: "D", text: "Só é possível se o juiz também integrar a reserva das forças armadas." },
      { letter: "E", text: "Depende de demonstração de risco concreto ao CNJ." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Art. 6°, XI da Lei 10.826/2003: membros do Poder Judiciário estão expressamente no rol de autorizados. A autorização não depende de ameaça — é inerente ao cargo.",
    explanationCorrect: "C: art. 6°, XI — membros do Poder Judiciário estão expressamente autorizados pela lei. Não precisa demonstrar ameaça, pedir autorização judicial ou ser da reserva das FFAA.",
    explanationWrong: "A: não depende de autorização judicial do tribunal. B: magistratura está no art. 6°, XI. D: não precisa ser da reserva. E: não precisa demonstrar risco ao CNJ — a autorização é ex lege.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "lpe_da_c02_q07",
    contentId: "lpe_da_c02",
    statement: "Integrante de empresa de segurança privada é abordado pela polícia com arma de fogo enquanto faz escolta de valores. Considerando a Lei 10.826/2003, esse profissional:",
    alternatives: [
      { letter: "A", text: "Pratica porte ilegal — empresas privadas não estão no rol do art. 6°." },
      { letter: "B", text: "Está autorizado pelo art. 6°, IX, desde que em serviço e devidamente habilitado." },
      { letter: "C", text: "Está autorizado apenas se a empresa tiver contrato com o poder público." },
      { letter: "D", text: "Pratica crime de comércio ilegal por transportar arma de fogo sem ser titular." },
      { letter: "E", text: "Só está autorizado em municípios com mais de 500.000 habitantes." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Art. 6°, IX: integrantes de empresas de segurança privada e de transporte de valores estão no rol de autorizados — desde que em serviço e habilitados na forma do regulamento.",
    explanationCorrect: "B: art. 6°, IX da Lei 10.826/2003 — empresas de segurança privada e transporte de valores estão no rol. Condição: em serviço e habilitado conforme regulamentação (treinamento, registro na PF).",
    explanationWrong: "A: empresas de segurança privada estão no art. 6°, IX. C: não exige contrato com poder público. D: transporte de arma em serviço não é comércio ilegal. E: não há restrição por porte do município para segurança privada.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "lpe_da_c02_q08",
    contentId: "lpe_da_c02",
    statement: "O art. 7° da Lei 10.826/2003 estabelece condições para o porte de arma de fogo pelos autorizados. Entre essas condições NÃO se inclui:",
    alternatives: [
      { letter: "A", text: "Capacitação técnica para o manuseio da arma." },
      { letter: "B", text: "Aptidão psicológica atestada por profissional competente." },
      { letter: "C", text: "Autorização específica da autoridade competente." },
      { letter: "D", text: "Residência em município com delegacia de polícia federal instalada." },
      { letter: "E", text: "Regularidade no cumprimento dos requisitos periódicos de habilitação." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "O art. 7° exige capacitação técnica, aptidão psicológica e autorização da autoridade competente. Não exige residência em município com delegacia da PF — esse não é requisito legal.",
    explanationCorrect: "D: residência em município com delegacia federal instalada não é requisito do art. 7°. Os requisitos são: capacitação técnica, aptidão psicológica e autorização da autoridade competente.",
    explanationWrong: "A, B, C e E são condições efetivamente previstas ou decorrentes do art. 7°. Apenas D (residência com delegacia da PF) não é requisito legal.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── lpe_da_c03 — Crimes Hediondos na Lei 10.826 (Arts. 16, 17 e 18) ──────

  {
    id: "lpe_da_c03_q01",
    contentId: "lpe_da_c03",
    statement: "O crime de posse irregular de arma de fogo de uso permitido (art. 12 da Lei 10.826/2003) é equiparado a hediondo.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "O art. 12 (posse irregular, uso permitido) NÃO é hediondo — é crime comum. Os crimes equiparados a hediondos na Lei 10.826/2003 são apenas os arts. 16, 17 e 18.",
    explanationCorrect: "Errado: arts. 12 e 14 são crimes comuns (não hediondos). Apenas arts. 16, 17 e 18 são equiparados a hediondos pela Lei 8.072/90.",
    explanationWrong: "A afirmação está incorreta — posse irregular (art. 12) é crime comum, não hediondo.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c03_q02",
    contentId: "lpe_da_c03",
    statement: "O porte ilegal de arma de fogo de uso restrito (art. 16 da Lei 10.826/2003) é equiparado a crime hediondo.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "O art. 16 da Lei 10.826/2003 (uso restrito ou arma com numeração adulterada) é expressamente equiparado a hediondo pela Lei 8.072/90, art. 2°.",
    explanationCorrect: "Certo: art. 16 é equiparado a hediondo (Lei 8.072/90). Também são hediondos: art. 17 (comércio ilegal) e art. 18 (tráfico internacional). Não são hediondos: arts. 12 e 14.",
    explanationWrong: "A afirmação está correta — art. 16 é equiparado a hediondo.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c03_q03",
    contentId: "lpe_da_c03",
    statement: "Nos crimes equiparados a hediondos da Lei 10.826/2003, são vedados a anistia, a graça e o indulto, nos termos da Constituição Federal.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "CF, art. 5°, XLIII: crimes hediondos e equiparados (tráfico, tortura, terrorismo) são insuscetíveis de anistia, graça e indulto. Os arts. 16, 17 e 18 da Lei 10.826 são equiparados — sujeitos a essas vedações.",
    explanationCorrect: "Certo: CF art. 5°, XLIII — crimes hediondos e equiparados: vedados anistia, graça e indulto. Os arts. 16, 17 e 18 da Lei 10.826/2003 são equiparados, portanto sujeitos a essas vedações.",
    explanationWrong: "A afirmação está correta — as vedações da CF para crimes hediondos se aplicam aos arts. 16, 17 e 18 da Lei 10.826/2003.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c03_q04",
    contentId: "lpe_da_c03",
    statement: "A progressão de regime nos crimes hediondos e equiparados exige o cumprimento de 1/3 da pena para réus primários.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Lei 8.072/90 (com redação dada pelo Pacote Anticrime): progressão exige 2/5 para réu primário e 3/5 para reincidente em crime hediondo ou equiparado. O prazo de 1/3 é o da regra geral do LEP — não dos hediondos.",
    explanationCorrect: "Errado: para crimes hediondos, a progressão exige 2/5 (réu primário) ou 3/5 (reincidente) — não 1/3. O prazo de 1/3 é da regra geral do LEP para crimes comuns.",
    explanationWrong: "A afirmação está incorreta: 1/3 é o prazo da regra geral. Para hediondos: 2/5 (primário) e 3/5 (reincidente), conforme Lei 8.072/90.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c03_q05",
    contentId: "lpe_da_c03",
    statement: "Quais artigos da Lei 10.826/2003 são equiparados a crimes hediondos pela Lei 8.072/1990?",
    alternatives: [
      { letter: "A", text: "Arts. 12, 14 e 16." },
      { letter: "B", text: "Arts. 14, 16 e 17." },
      { letter: "C", text: "Arts. 16, 17 e 18." },
      { letter: "D", text: "Arts. 12, 17 e 18." },
      { letter: "E", text: "Todos os artigos da Lei 10.826/2003 são equiparados a hediondos." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Os crimes equiparados a hediondos na Lei 10.826/2003 são: art. 16 (uso restrito/adulterado), art. 17 (comércio ilegal) e art. 18 (tráfico internacional). Arts. 12 e 14 são crimes comuns.",
    explanationCorrect: "C: arts. 16, 17 e 18. Regra mnemônica: 16-17-18 = hediondos. 12 e 14 = crimes comuns. A distinção: uso permitido (arts. 12/14) = comum; uso restrito/comércio/tráfico (arts. 16/17/18) = hediondo.",
    explanationWrong: "A, B e D incluem arts. 12 e/ou 14 — que são crimes comuns. E: não são todos hediondos — apenas 16, 17 e 18.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "lpe_da_c03_q06",
    contentId: "lpe_da_c03",
    statement: "Para progressão de regime em crime hediondo, réu primário deve cumprir:",
    alternatives: [
      { letter: "A", text: "1/6 da pena." },
      { letter: "B", text: "1/4 da pena." },
      { letter: "C", text: "1/3 da pena." },
      { letter: "D", text: "2/5 da pena." },
      { letter: "E", text: "3/5 da pena." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "Lei 8.072/90 (art. 2°, §2°, com redação do Pacote Anticrime): progressão de regime em crime hediondo — 2/5 para réu primário; 3/5 para reincidente em crime hediondo.",
    explanationCorrect: "D: 2/5 para réu primário em crime hediondo ou equiparado. Para reincidente específico: 3/5. Para crimes comuns: 1/6 (LEP) ou 1/3 (conforme o crime). Os hediondos têm fração específica mais elevada.",
    explanationWrong: "A (1/6) e C (1/3): regras dos crimes comuns (LEP e regra geral). B (1/4): não existe como regra legal. E (3/5): é para REINCIDENTE em hediondo, não primário.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "lpe_da_c03_q07",
    contentId: "lpe_da_c03",
    statement: "O STF, no julgamento do HC 111.840, entendeu que o regime inicial fechado obrigatório para crimes hediondos:",
    alternatives: [
      { letter: "A", text: "É constitucional e deve ser mantido como regra absoluta." },
      { letter: "B", text: "É inconstitucional — o regime inicial deve ser fixado conforme as circunstâncias do caso concreto." },
      { letter: "C", text: "É aplicável apenas para tráfico de drogas, não para os hediondos do Estatuto do Desarmamento." },
      { letter: "D", text: "Foi declarado constitucional apenas para réus reincidentes." },
      { letter: "E", text: "Foi confirmado pelo Pacote Anticrime, que restaurou o regime fechado obrigatório." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "HC 111.840 STF: o regime inicial fechado obrigatório para crimes hediondos é inconstitucional — viola os princípios da individualização da pena e da proporcionalidade. O juiz deve fixar o regime conforme o caso concreto.",
    explanationCorrect: "B: STF (HC 111.840) afastou o regime inicial fechado obrigatório para hediondos — inconstitucional por violar a individualização da pena. O juiz deve analisar o caso concreto para fixar o regime inicial.",
    explanationWrong: "A: STF declarou inconstitucional. C: a decisão abrange todos os hediondos. D: STF não restringiu a réus reincidentes. E: o Pacote Anticrime não restaurou o regime fechado obrigatório.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "lpe_da_c03_q08",
    contentId: "lpe_da_c03",
    statement: "Sobre os efeitos da hediondez nos crimes dos arts. 16, 17 e 18 da Lei 10.826/2003, é INCORRETO afirmar que:",
    alternatives: [
      { letter: "A", text: "São vedados anistia, graça e indulto." },
      { letter: "B", text: "A progressão de regime exige fração maior do que nos crimes comuns." },
      { letter: "C", text: "O regime inicial é necessariamente fechado, por força da Lei 8.072/90." },
      { letter: "D", text: "A fiança é vedada para esses crimes." },
      { letter: "E", text: "O prazo de prisão temporária é de 30 dias, prorrogável por mais 30." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O STF (HC 111.840) afastou o regime inicial fechado obrigatório para hediondos — é inconstitucional. As demais alternativas são corretas: anistia/graça/indulto vedados, progressão com 2/5-3/5, fiança vedada, temporária 30+30 dias.",
    explanationCorrect: "C é incorreta: o regime inicial NÃO é necessariamente fechado — o STF declarou inconstitucional o fechado obrigatório. O juiz fixa o regime conforme o caso concreto (HC 111.840 STF).",
    explanationWrong: "A: correto — vedados. B: correto — 2/5 ou 3/5. D: correto — inafiançável (CF art. 5°, XLIII). E: correto — Lei 8.072/90 art. 2°, §4° — temporária 30+30 dias para hediondos.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── lpe_da_c04 — Arts. 17 e 18 — Comércio Ilegal e Tráfico Internacional ─

  {
    id: "lpe_da_c04_q01",
    contentId: "lpe_da_c04",
    statement: "O crime de tráfico internacional de arma de fogo (art. 18 da Lei 10.826/2003) tem pena de reclusão de 4 a 8 anos.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Art. 18: tráfico internacional de arma de fogo — pena de reclusão de 8 a 16 anos. A pena de 4-8 anos é do comércio ilegal (art. 17). O art. 18 tem pena exatamente dobrada em relação ao art. 17.",
    explanationCorrect: "Errado: art. 18 = reclusão 8 a 16 anos (não 4 a 8). A pena de 4-8 anos é do art. 17 (comércio ilegal). Art. 18 dobra a pena por causa da transnacionalidade.",
    explanationWrong: "A afirmação está incorreta: art. 18 tem pena de 8-16 anos, não 4-8.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c04_q02",
    contentId: "lpe_da_c04",
    statement: "O comércio ilegal de arma de fogo (art. 17 da Lei 10.826/2003) é equiparado a crime hediondo.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "O art. 17 da Lei 10.826/2003 (comércio ilegal de arma de fogo) é expressamente equiparado a hediondo pela Lei 8.072/90. Pena: reclusão de 4 a 8 anos.",
    explanationCorrect: "Certo: art. 17 = comércio ilegal = equiparado a hediondo (Lei 8.072/90). Também são hediondos: art. 16 (uso restrito) e art. 18 (tráfico internacional).",
    explanationWrong: "A afirmação está correta — art. 17 é equiparado a hediondo.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c04_q03",
    contentId: "lpe_da_c04",
    statement: "A pena mínima do tráfico internacional de arma de fogo (art. 18) é exatamente o dobro da pena mínima do comércio ilegal (art. 17) da Lei 10.826/2003.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Art. 17: pena de 4 a 8 anos. Art. 18: pena de 8 a 16 anos. A pena mínima (4 vs 8) e a máxima (8 vs 16) do art. 18 são exatamente o dobro do art. 17.",
    explanationCorrect: "Certo: art. 17 = 4-8 anos; art. 18 = 8-16 anos. Dobro em todos os parâmetros. A transnacionalidade justifica a maior reprovabilidade e a pena em dobro.",
    explanationWrong: "A afirmação está correta — a relação de dobro entre art. 18 e art. 17 se verifica tanto na pena mínima (4→8) quanto na máxima (8→16).",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c04_q04",
    contentId: "lpe_da_c04",
    statement: "O porte ilegal de arma de fogo (art. 14) e o comércio ilegal (art. 17) têm as mesmas condutas típicas, diferindo apenas na pena.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Os tipos são distintos: art. 14 (porte) tem como elemento diferenciador o uso pessoal/individual; art. 17 (comércio) caracteriza-se pela finalidade de fazer circular armas no mercado ilegal. A finalidade é o elemento diferenciador.",
    explanationCorrect: "Errado: não são as mesmas condutas. O art. 14 é porte para uso pessoal; o art. 17 envolve atos de circulação comercial (vender, expor à venda, dar, emprestar com fins de comércio). A finalidade de fazer circular no comércio ilegal distingue os tipos.",
    explanationWrong: "A afirmação está incorreta — os tipos têm condutas e finalidades distintas.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c04_q05",
    contentId: "lpe_da_c04",
    statement: "Qual a principal distinção entre o comércio ilegal de arma de fogo (art. 17) e o tráfico internacional (art. 18) da Lei 10.826/2003?",
    alternatives: [
      { letter: "A", text: "O art. 17 envolve armas de uso permitido; o art. 18, de uso restrito." },
      { letter: "B", text: "O art. 17 é crime comum; o art. 18 é equiparado a hediondo." },
      { letter: "C", text: "O art. 17 diz respeito ao comércio interno (sem cruzar fronteiras); o art. 18 à transnacionalidade (entrada ou saída do território nacional)." },
      { letter: "D", text: "O art. 17 só pode ser praticado por comerciantes registrados; o art. 18, por qualquer pessoa." },
      { letter: "E", text: "O art. 17 é crime permanente; o art. 18 é crime instantâneo de efeitos permanentes." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "A distinção central: art. 17 = comércio ilegal INTERNO (sem cruzar fronteiras). Art. 18 = tráfico TRANSNACIONAL (importar, exportar, favorecer entrada/saída do território). Ambos são hediondos.",
    explanationCorrect: "C: art. 17 = comércio interno; art. 18 = transnacional (cruzar fronteiras). Ambos são hediondos. A transnacionalidade justifica a pena dobrada do art. 18 (8-16) em relação ao art. 17 (4-8).",
    explanationWrong: "A: ambos abrangem qualquer tipo de arma, inclusive de uso restrito. B: ambos são hediondos. D: art. 17 pode ser praticado por qualquer pessoa — inclusive sem registro. E: a distinção de crime permanente/instantâneo não é o critério diferenciador entre eles.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "lpe_da_c04_q06",
    contentId: "lpe_da_c04",
    statement: "Quadrilha especializada importa fuzis do Paraguai sem autorização. O enquadramento correto na Lei 10.826/2003 é:",
    alternatives: [
      { letter: "A", text: "Art. 14 — porte ilegal de arma de fogo de uso permitido." },
      { letter: "B", text: "Art. 16 — porte de arma de uso restrito." },
      { letter: "C", text: "Art. 17 — comércio ilegal de arma de fogo." },
      { letter: "D", text: "Art. 18 — tráfico internacional de arma de fogo, pena de 8 a 16 anos." },
      { letter: "E", text: "Art. 12 — posse irregular de arma de fogo." },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation: "Importar fuzis do Paraguai (transnacionalidade) = art. 18 (tráfico internacional), pena de reclusão de 8 a 16 anos, equiparado a hediondo. A entrada no território nacional é elemento do tipo.",
    explanationCorrect: "D: art. 18 — tráfico internacional = importar arma de fogo sem autorização. Fuzil = arma de uso restrito, agravando ainda mais. Pena: 8-16 anos, hediondo. A transnacionalidade (cruzar fronteiras) é o elemento típico.",
    explanationWrong: "A: art. 14 é porte interno de uso permitido, sem transnacionalidade. B: art. 16 é porte/posse de uso restrito interno — sem cruzar fronteiras. C: art. 17 é comércio interno — sem fronteiras internacionais. E: art. 12 é posse em local fixo.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "lpe_da_c04_q07",
    contentId: "lpe_da_c04",
    statement: "O sujeito ativo do crime de comércio ilegal de arma de fogo (art. 17 da Lei 10.826/2003) é:",
    alternatives: [
      { letter: "A", text: "Somente o comerciante formal registrado que vende sem autorização específica." },
      { letter: "B", text: "Qualquer pessoa — inclusive quem pratica atos de comércio sem ser registrado como comerciante." },
      { letter: "C", text: "Apenas pessoas jurídicas com registro no SINARM para comércio de armas." },
      { letter: "D", text: "Apenas o importador ou exportador de armas sem autorização." },
      { letter: "E", text: "Apenas quem vende armas de uso restrito sem autorização." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O art. 17 é crime comum — qualquer pessoa pode ser sujeito ativo, inclusive quem pratica atos de comércio (vender, dar, emprestar com finalidade comercial) sem ser comerciante registrado.",
    explanationCorrect: "B: crime de mão própria — não é exigida condição especial do agente. Qualquer pessoa que pratique os atos descritos no art. 17 (vender, dar, emprestar armas sem autorização com finalidade comercial) é sujeito ativo.",
    explanationWrong: "A: não exige ser comerciante formal. C: pessoas físicas também podem praticar. D: importar/exportar é o art. 18. E: art. 17 abrange qualquer tipo de arma, não apenas restrita.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "lpe_da_c04_q08",
    contentId: "lpe_da_c04",
    statement: "Cidadão com arma de fogo registrada empresta a pistola a um amigo por uma semana. Essa conduta pode configurar:",
    alternatives: [
      { letter: "A", text: "Atípica — empréstimo de arma entre conhecidos é ato lícito se o proprietário tem registro." },
      { letter: "B", text: "Posse irregular (art. 12) pelo proprietário — por permitir uso fora de local fixo." },
      { letter: "C", text: "Potencialmente o art. 17 (comércio ilegal) pelo proprietário e art. 14 (porte ilegal) pelo amigo sem autorização." },
      { letter: "D", text: "Apenas porte ilegal pelo amigo — o proprietário não responde por emprestar arma registrada." },
      { letter: "E", text: "Crime de facilitação do porte (art. 19 da Lei 10.826/2003) pelo proprietário." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Emprestar arma consta no art. 17 (comércio ilegal — entre as condutas: 'emprestar, ceder'). O amigo sem autorização de porte comete art. 14. Ambos podem responder criminalmente.",
    explanationCorrect: "C: o ato de 'emprestar' está previsto no rol do art. 17, que inclui: vender, expor à venda, ceder, dar, emprestar, remeter. O amigo sem autorização pratica art. 14 (porte ilegal). Ambos respondem.",
    explanationWrong: "A: empréstimo de arma consta no art. 17 como conduta típica — não é atípico. B: a conduta do proprietário pode se enquadrar no art. 17, não no art. 12. D: o proprietário também pode responder pelo empréstimo (art. 17). E: art. 19 trata de causas de aumento — não é tipo autônomo de 'facilitação'.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── lpe_da_c05 — SINARM e SIGMA ──────────────────────────────────────────

  {
    id: "lpe_da_c05_q01",
    contentId: "lpe_da_c05",
    statement: "O SINARM (Sistema Nacional de Armas) é administrado pelo Exército Brasileiro.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "O SINARM é administrado pela POLÍCIA FEDERAL — não pelo Exército. O Exército administra o SIGMA. Essa inversão é a armadilha clássica em provas sobre esse tema.",
    explanationCorrect: "Errado: SINARM = Polícia Federal (armas de uso permitido). SIGMA = Exército Brasileiro (armas de uso restrito/proibido). A confusão entre os dois sistemas é frequente nas bancas.",
    explanationWrong: "A afirmação está incorreta — SINARM é da PF, não do Exército.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c05_q02",
    contentId: "lpe_da_c05",
    statement: "O SIGMA (Sistema de Gerenciamento Militar de Armas) é responsável pelo cadastro, registro e controle de armas de fogo de uso restrito.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "O SIGMA, administrado pelo Exército Brasileiro, controla armas de uso restrito e proibido — fuzis, metralhadoras, pistolas militares e todo o armamento de uso exclusivo das forças regulares.",
    explanationCorrect: "Certo: SIGMA = Exército = uso restrito/proibido. SINARM = Polícia Federal = uso permitido (civis). Tabela: SINARM/PF/permitido vs SIGMA/Exército/restrito.",
    explanationWrong: "A afirmação está correta — SIGMA controla armas de uso restrito.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c05_q03",
    contentId: "lpe_da_c05",
    statement: "O SINARM e o SIGMA foram instituídos pelo Estatuto do Desarmamento (Lei 10.826/2003).",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Ambos os sistemas (SINARM e SIGMA) foram criados pela Lei 10.826/2003 (Estatuto do Desarmamento) para controle e rastreamento de armas de fogo no Brasil.",
    explanationCorrect: "Certo: a Lei 10.826/2003 criou ambos os sistemas. SINARM para uso permitido (PF) e SIGMA para uso restrito (Exército). Ambos têm base legal na mesma lei.",
    explanationWrong: "A afirmação está correta — ambos foram criados pela Lei 10.826/2003.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c05_q04",
    contentId: "lpe_da_c05",
    statement: "As armas de calibres autorizados para uso por civis, como o revólver calibre .38, são controladas pelo SIGMA, administrado pela Polícia Federal.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "Armas de uso PERMITIDO (revólver .38) são controladas pelo SINARM, administrado pela Polícia Federal — não pelo SIGMA. O SIGMA controla armas de uso RESTRITO (Exército).",
    explanationCorrect: "Errado: revólver .38 = arma de uso permitido = SINARM = Polícia Federal. O SIGMA controla armas de uso restrito, administrado pelo Exército. A questão inverteu os sistemas.",
    explanationWrong: "A afirmação mistura os dois sistemas incorretamente — SINARM é da PF para uso permitido; SIGMA é do Exército para uso restrito.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c05_q05",
    contentId: "lpe_da_c05",
    statement: "Qual órgão é responsável pela administração do SINARM — Sistema Nacional de Armas?",
    alternatives: [
      { letter: "A", text: "Exército Brasileiro." },
      { letter: "B", text: "Polícia Federal." },
      { letter: "C", text: "Ministério da Defesa." },
      { letter: "D", text: "Polícia Rodoviária Federal." },
      { letter: "E", text: "Conselho Nacional de Segurança Pública (CNSSP)." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "O SINARM é administrado pelo Departamento de Polícia Federal (DPF), sob o Ministério da Justiça. Controla armas de uso permitido (civis).",
    explanationCorrect: "B: SINARM = Polícia Federal. O DPF administra o sistema que registra armas de uso permitido de pessoas físicas e jurídicas civis em todo o território nacional.",
    explanationWrong: "A: Exército administra o SIGMA, não o SINARM. C: Ministério da Defesa supervisiona as FFAA — não administra o SINARM diretamente. D: PRF não administra sistemas de controle de armas. E: CNSSP não administra sistemas de armas.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "lpe_da_c05_q06",
    contentId: "lpe_da_c05",
    statement: "Sobre as funções do SIGMA — Sistema de Gerenciamento Militar de Armas — é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "Registra armas de uso permitido comercializadas em lojas autorizadas para civis." },
      { letter: "B", text: "É administrado pela Polícia Federal para controle de armas de civis." },
      { letter: "C", text: "Registra e controla armas de uso restrito e proibido, incluindo fuzis e metralhadoras das FFAA e policiais." },
      { letter: "D", text: "Só registra armas das Forças Armadas — policiais usam o SINARM mesmo para armas restritas." },
      { letter: "E", text: "Foi extinto pelo Pacote Anticrime (Lei 13.964/2019), sendo substituído pelo SINARM ampliado." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "O SIGMA, administrado pelo Exército, registra e controla armas de uso restrito e proibido — fuzis, metralhadoras, pistolas militares — usadas por FFAA e policiais que recebem armamento restrito.",
    explanationCorrect: "C: SIGMA = Exército = uso restrito/proibido (fuzis, metralhadoras, armas militares). Isso inclui também o armamento restrito distribuído às polícias. SINARM = PF = uso permitido (civis).",
    explanationWrong: "A: uso permitido para civis = SINARM (PF), não SIGMA. B: SIGMA é administrado pelo Exército, não pela PF. D: policiais com armamento restrito usam o SIGMA, não o SINARM. E: SIGMA não foi extinto pelo Pacote Anticrime.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "lpe_da_c05_q07",
    contentId: "lpe_da_c05",
    statement: "Cidadão adquire legalmente pistola 9mm de uso permitido em loja de armas autorizada. Qual sistema registra essa arma?",
    alternatives: [
      { letter: "A", text: "SIGMA — pois pistola 9mm é arma de uso restrito das polícias." },
      { letter: "B", text: "SINARM — pois se trata de arma de uso permitido adquirida por civil." },
      { letter: "C", text: "Ambos — SINARM para o civil e SIGMA para a loja." },
      { letter: "D", text: "Nenhum — apenas o cartório de registro local faz o registro." },
      { letter: "E", text: "SIGMA — pois pistolas só são registradas pelo Exército, independentemente do calibre." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Pistola 9mm de uso permitido adquirida por civil = SINARM (Polícia Federal). O SIGMA registra armas de uso restrito — em certas configurações a 9mm pode ser restrita, mas na versão de uso permitido para civis é registrada no SINARM.",
    explanationCorrect: "B: arma de uso permitido adquirida por civil = SINARM (PF). O SIGMA registra uso restrito (Exército). A distinção SINARM/SIGMA segue a classificação uso permitido × uso restrito.",
    explanationWrong: "A: SIGMA é para uso restrito — pistola de uso permitido não vai para o SIGMA. C: não há duplo registro para o mesmo ato. D: o registro é feito no SINARM pela PF — não em cartório. E: pistolas de uso permitido são registradas no SINARM.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "lpe_da_c05_q08",
    contentId: "lpe_da_c05",
    statement: "Sobre a classificação de armas de fogo e sua relação com os sistemas SINARM e SIGMA, é correto afirmar que:",
    alternatives: [
      { letter: "A", text: "Armas de uso proibido são registradas no SINARM pela Polícia Federal." },
      { letter: "B", text: "A classificação 'uso permitido' abrange calibres de menor poder ofensivo autorizados para civis; 'uso restrito' abrange calibres/modelos de uso exclusivo de militares e policiais." },
      { letter: "C", text: "Toda arma de fogo, independentemente da classificação, é registrada no SINARM." },
      { letter: "D", text: "A distinção entre uso permitido e restrito é irrelevante para fins penais — ambos geram o mesmo enquadramento criminal." },
      { letter: "E", text: "Armas de uso proibido podem ser portadas por qualquer pessoa com autorização do Exército." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Uso permitido = calibres de menor poder ofensivo autorizados para civis (ex: .38, 9mm em versão civil). Uso restrito = exclusivo de militares/policiais (fuzis, calibres militares). Uso proibido = vedado para todos exceto casos excepcionais.",
    explanationCorrect: "B: a distinção reflete o poder ofensivo e a destinação das armas. Uso permitido (civis) → SINARM/PF. Uso restrito (militares/policiais) → SIGMA/Exército. Uso proibido → vedado para todos.",
    explanationWrong: "A: armas de uso proibido são registradas no SIGMA (Exército), não no SINARM. C: armas de uso restrito vão ao SIGMA — não ao SINARM. D: a distinção é relevante penalmente (art. 14 vs art. 16 — penas e hediondez diferentes). E: armas de uso proibido são vedadas para todos — nenhuma autorização administrativa as libera.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },

  // ── lpe_da_c06 — Art. 16 e Arts. 19-20 — Uso Restrito e Causas de Aumento ─

  {
    id: "lpe_da_c06_q01",
    contentId: "lpe_da_c06",
    statement: "A adulteração do número de série de uma arma de fogo de uso permitido (como um revólver .38) enquadra a conduta no art. 16 da Lei 10.826/2003, equiparado a hediondo.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Art. 16, parágrafo único, IV: portar arma com numeração raspada/adulterada = art. 16 (hediondo), independentemente da classe da arma. Mesmo uma arma de uso permitido com numeração adulterada enquadra no art. 16.",
    explanationCorrect: "Certo: art. 16, parágrafo único — a adulteração da numeração enquadra no art. 16 (hediondo) independentemente da classe da arma. A adulteração em si é o elemento que torna hediondo, mesmo que a arma seja de uso permitido.",
    explanationWrong: "A afirmação está correta — numeração adulterada = art. 16 = hediondo, independentemente de a arma ser de uso permitido ou restrito.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c06_q02",
    contentId: "lpe_da_c06",
    statement: "O art. 20 da Lei 10.826/2003 prevê aumento de pena da metade quando o crime é praticado por integrante de organização criminosa ou milícia privada.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Art. 20, II da Lei 10.826/2003: penas aumentadas da metade quando o crime é praticado por integrante de organização criminosa ou milícia privada. O art. 20, I prevê o mesmo aumento para agentes autorizados (arts. 6°, 7° e 8°).",
    explanationCorrect: "Certo: art. 20, II — aumento de metade para integrantes de organização criminosa ou milícia. Art. 20, I — mesmo aumento para agentes que deveriam zelar pelo uso legal das armas (policiais, militares, etc.).",
    explanationWrong: "A afirmação está correta — art. 20, II prevê aumento de metade para organização criminosa/milícia.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c06_q03",
    contentId: "lpe_da_c06",
    statement: "O art. 16 da Lei 10.826/2003, que tipifica o porte ilegal de arma de uso restrito, tem pena de reclusão de 3 a 6 anos e é equiparado a hediondo.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "C",
    correctOption: 0,
    explanation: "Art. 16: reclusão de 3 a 6 anos + multa. Equiparado a hediondo. Abrange arma de uso restrito E arma com numeração adulterada (independentemente da classe).",
    explanationCorrect: "Certo: art. 16 = reclusão 3-6 anos + multa, hediondo. Escada: art. 12 (1-3 detenção) → art. 14 (2-4 reclusão) → art. 16 (3-6 reclusão, HEDIONDO) → art. 17 (4-8, HEDIONDO) → art. 18 (8-16, HEDIONDO).",
    explanationWrong: "A afirmação está correta — art. 16: reclusão 3-6 anos, hediondo.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c06_q04",
    contentId: "lpe_da_c06",
    statement: "A pena do porte ilegal de arma de uso permitido (art. 14) é maior do que a do porte de arma de uso restrito (art. 16) da Lei 10.826/2003.",
    alternatives: [{ letter: "C", text: "Certo" }, { letter: "E", text: "Errado" }],
    correctAnswer: "E",
    correctOption: 1,
    explanation: "A pena do art. 16 (reclusão 3-6 anos) é MAIOR que a do art. 14 (reclusão 2-4 anos). O art. 16 é mais grave (uso restrito, hediondo). Art. 14 é menos grave (uso permitido, não hediondo).",
    explanationCorrect: "Errado: art. 14 (porte, uso permitido) = reclusão 2-4 anos (não hediondo). Art. 16 (porte, uso restrito) = reclusão 3-6 anos (hediondo). O art. 16 é sempre mais grave.",
    explanationWrong: "A afirmação está incorreta — art. 16 (3-6 anos) é mais grave que art. 14 (2-4 anos).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  {
    id: "lpe_da_c06_q05",
    contentId: "lpe_da_c06",
    statement: "Sobre as condutas equiparadas previstas no parágrafo único do art. 16 da Lei 10.826/2003, assinale a opção correta.",
    alternatives: [
      { letter: "A", text: "O parágrafo único pune apenas quem modifica a arma para uso restrito — não abrange a adulteração de numeração." },
      { letter: "B", text: "Suprimir ou adulterar marca, numeração ou qualquer sinal de identificação de arma de fogo está equiparado ao caput do art. 16 e é hediondo." },
      { letter: "C", text: "O parágrafo único do art. 16 só se aplica a armas de uso restrito — armas de uso permitido com numeração raspada enquadram no art. 12." },
      { letter: "D", text: "A modificação de arma para torná-la restrita é conduta atípica se praticada pelo próprio proprietário." },
      { letter: "E", text: "Apenas policiais podem ser sujeitos ativos das condutas do parágrafo único do art. 16." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Art. 16, parágrafo único: suprimir ou adulterar numeração/marca de identificação de arma é conduta equiparada ao caput, portanto hediondo. Independentemente da classe da arma.",
    explanationCorrect: "B: art. 16, parágrafo único — suprimir/adulterar numeração ou marca é conduta tipificada e equiparada ao caput (hediondo). A adulteração da numeração, por si só, enquadra no art. 16 — mesmo que a arma seja de uso permitido.",
    explanationWrong: "A: a adulteração de numeração está expressamente no parágrafo único. C: o parágrafo único abrange qualquer arma com numeração adulterada — inclusive as de uso permitido. D: modificar arma para torná-la restrita é conduta típica para qualquer pessoa. E: qualquer pessoa pode ser sujeito ativo.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "lpe_da_c06_q06",
    contentId: "lpe_da_c06",
    statement: "Policial militar flagrado portando ilegalmente pistola .40 (arma de uso restrito) fora de serviço e sem autorização. O enquadramento correto, considerando a causa de aumento do art. 20:",
    alternatives: [
      { letter: "A", text: "Art. 14 (porte ilegal de uso permitido), sem causa de aumento." },
      { letter: "B", text: "Art. 16 (porte de uso restrito, hediondo) + art. 20, I (aumento de metade, pois é agente autorizado)." },
      { letter: "C", text: "Art. 12 (posse irregular) — o policial tem autorização e apenas cometeu irregularidade administrativa." },
      { letter: "D", text: "Art. 16, somente — o art. 20 não se aplica a policiais militares." },
      { letter: "E", text: "Art. 14 + art. 20, II (organização criminosa) — se houver suspeita de envolvimento com milícia." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Policial com pistola .40 (uso restrito) fora de serviço e sem autorização = art. 16 (hediondo). Sendo agente autorizado (art. 6°), incide o art. 20, I: aumento de metade da pena.",
    explanationCorrect: "B: art. 16 (pistola .40 = uso restrito = hediondo) + art. 20, I (agente autorizado que viola a lei = aumento de metade). O agente que deveria zelar pelo uso legal e viola a norma tem pena aumentada pela maior reprovabilidade.",
    explanationWrong: "A: .40 é uso restrito — art. 16, não art. 14. C: fora de serviço sem autorização = crime, não mera irregularidade. D: o art. 20, I se aplica expressamente a integrantes dos órgãos referidos nos arts. 6°, 7° e 8° — inclui policiais militares. E: sem prova de organização criminosa, não incide art. 20, II.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "lpe_da_c06_q07",
    contentId: "lpe_da_c06",
    statement: "A escada punitiva da Lei 10.826/2003, em ordem crescente de gravidade das penas, é:",
    alternatives: [
      { letter: "A", text: "Art. 16 → Art. 12 → Art. 14 → Art. 17 → Art. 18." },
      { letter: "B", text: "Art. 12 → Art. 14 → Art. 16 → Art. 17 → Art. 18." },
      { letter: "C", text: "Art. 14 → Art. 12 → Art. 17 → Art. 16 → Art. 18." },
      { letter: "D", text: "Art. 12 → Art. 16 → Art. 14 → Art. 18 → Art. 17." },
      { letter: "E", text: "Art. 17 → Art. 14 → Art. 12 → Art. 16 → Art. 18." },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation: "Escada: art. 12 (detenção 1-3) → art. 14 (reclusão 2-4) → art. 16 (reclusão 3-6, hediondo) → art. 17 (reclusão 4-8, hediondo) → art. 18 (reclusão 8-16, hediondo).",
    explanationCorrect: "B: escada crescente: 12 (1-3 detenção) → 14 (2-4 reclusão) → 16 (3-6 reclusão, hediondo) → 17 (4-8 reclusão, hediondo) → 18 (8-16 reclusão, hediondo). Regra: uso permitido = comum (12/14); uso restrito/adulterado/comércio/tráfico = hediondo (16/17/18).",
    explanationWrong: "A, C, D e E: ordenações incorretas. A escada correta é 12→14→16→17→18, com a linha divisória hediondo/não-hediondo entre o 14 e o 16.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  {
    id: "lpe_da_c06_q08",
    contentId: "lpe_da_c06",
    statement: "O art. 20 da Lei 10.826/2003 prevê aumento de pena da metade em quais situações?",
    alternatives: [
      { letter: "A", text: "Quando o crime resultar em morte ou lesão grave da vítima." },
      { letter: "B", text: "Quando o crime for praticado por menor de 18 anos ou reincidente." },
      { letter: "C", text: "Quando o crime for praticado por integrante dos órgãos autorizados (arts. 6°, 7° e 8°) ou por integrante de organização criminosa ou milícia privada." },
      { letter: "D", text: "Quando o crime for praticado em concurso de pessoas com mais de três agentes." },
      { letter: "E", text: "Quando o crime envolver arma de uso proibido, em vez de uso restrito." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation: "Art. 20 da Lei 10.826/2003: aumento de metade quando praticado por (I) integrantes dos órgãos autorizados (arts. 6°, 7° e 8°) — que deveriam zelar pelo uso legal — ou (II) integrantes de organização criminosa ou milícia.",
    explanationCorrect: "C: art. 20 — duas hipóteses de aumento de metade: I) agentes autorizados (quem devia zelar pelo uso legal e viola a norma); II) integrantes de organização criminosa ou milícia privada.",
    explanationWrong: "A: resultado morte/lesão grave é o art. 19 — não o art. 20. B: menoridade e reincidência não estão no art. 20. D: concurso de pessoas não é a causa do art. 20. E: a classe da arma não é a causa do art. 20.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("\n🚀 Seed R51 — Densificação: Estatuto do Desarmamento (lpe_da_c01–c06)\n");

  const atomIds = [
    "lpe_da_c01", "lpe_da_c02", "lpe_da_c03",
    "lpe_da_c04", "lpe_da_c05", "lpe_da_c06",
  ];

  // 1. Verificar existência dos átomos
  for (const atomId of atomIds) {
    const rows = (await db.execute(sql`
      SELECT id, title FROM "Content" WHERE id = ${atomId} LIMIT 1
    `)) as any[];
    if (rows[0]) {
      console.log(`  ✅ Átomo encontrado: ${atomId} — ${rows[0].title}`);
    } else {
      console.warn(`  ⚠️  AVISO: Átomo NÃO encontrado: ${atomId} — execute seed-leg-desarmamento-r27.ts primeiro`);
    }
  }

  console.log("");

  // 2. Inserir questões
  let inseridas = 0;
  let ignoradas = 0;

  for (const q of questions) {
    // Buscar subjectId e topicId do átomo de conteúdo
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
