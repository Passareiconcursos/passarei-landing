/**
 * Seed R30 — Língua Portuguesa: Sintaxe — Termos da Oração
 * 6 átomos de conteúdo  (por_si_c01–c06)
 * 12 questões           (por_si_q01–q12)
 *
 * Execução (Replit): npx tsx db/seed-portugues-sintaxe-r30.ts
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

// ─── CONTEÚDOS ───────────────────────────────────────────────────────────────

const contents = [
  {
    id: "por_si_c01",
    title: "Frase, Oração e Período",
    difficulty: "FACIL",
    mnemonic: "FOP: Frase tem sentido, Oração tem Verbo, Período tem Oração(ões). Frase sem verbo = frase nominal.",
    keyPoint:
      "• Frase: enunciado com sentido completo — pode ou não ter verbo\n" +
      "• Oração: enunciado com verbo ou locução verbal — é sempre uma frase\n" +
      "• Período simples: formado por uma única oração\n" +
      "• Período composto: formado por duas ou mais orações\n" +
      "• Frase nominal: frase sem verbo ('Silêncio!', 'Que dia lindo!')",
    practicalExample:
      "CESPE: 'Fogo!' → frase nominal (sem verbo). " +
      "'O candidato estudou.' → frase + oração + período simples. " +
      "'Quando estudou, passou.' → período composto por duas orações.",
    textContent:
      "A análise sintática começa pela distinção entre frase, oração e período — conceitos fundamentais " +
      "para toda a gramática normativa e frequentemente cobrados em concursos.\n\n" +
      "FRASE:\n" +
      "É qualquer enunciado com sentido completo, capaz de transmitir uma mensagem. " +
      "A frase pode ou não conter verbo. Quando não contém verbo, chama-se frase nominal.\n" +
      "Exemplos de frases nominais: 'Silêncio!', 'Que calor!', 'Socorro!', 'Proibido fumar.'\n" +
      "Exemplos de frases verbais: 'O policial prendeu o suspeito.', 'Chove muito em janeiro.'\n\n" +
      "ORAÇÃO:\n" +
      "É o enunciado estruturado em torno de um verbo ou locução verbal. " +
      "Toda oração é uma frase, mas nem toda frase é uma oração. " +
      "A oração pode não ter sujeito explícito (oração sem sujeito), mas sempre terá predicado.\n" +
      "Exemplo: 'Choveu.' — oração com verbo, sem sujeito.\n\n" +
      "PERÍODO:\n" +
      "É a frase constituída por uma ou mais orações, encerrada por ponto final, ponto de exclamação, " +
      "ponto de interrogação ou reticências.\n\n" +
      "• Período simples: contém apenas uma oração (chamada oração absoluta).\n" +
      "  Exemplo: 'O delegado indiciou o réu.'\n\n" +
      "• Período composto: contém duas ou mais orações.\n" +
      "  Exemplo: 'O juiz determinou que o acusado fosse preso.' (duas orações)\n\n" +
      "ATENÇÃO EM PROVAS:\n" +
      "Bancas como FCC e CESPE frequentemente apresentam frases nominais e perguntam se são orações. " +
      "Lembre-se: frase nominal NÃO é oração, pois não possui verbo. " +
      "Verboides (infinitivo, gerúndio e particípio) isolados NÃO formam oração — precisam de verbo auxiliar.",
  },
  {
    id: "por_si_c02",
    title: "Sujeito: Tipos e Identificação",
    difficulty: "MEDIO",
    mnemonic: "SADIE: Sujeito pode ser Simples, composto, Ausente (inexistente), Determinado (oculto), Indeterminado ou Expresso.",
    keyPoint:
      "• Sujeito simples: um núcleo nominal\n" +
      "• Sujeito composto: dois ou mais núcleos\n" +
      "• Sujeito oculto/elíptico: identificado pela desinência verbal\n" +
      "• Sujeito indeterminado: verbo 3ª p. plural sem referente OU verbo+se com VTI\n" +
      "• Oração sem sujeito: verbos impessoais (fenômenos naturais, HAVER existência, FAZER tempo)\n" +
      "• 'Haver' no sentido de existir é IMPESSOAL — fica no singular",
    practicalExample:
      "FGV: 'Venderam o imóvel.' → sujeito indeterminado (3ª p. plural). " +
      "'Precisa-se de funcionários.' → sujeito indeterminado (VTI + se). " +
      "'Há muitas vagas.' → sem sujeito (haver = existir, impessoal).",
    textContent:
      "O sujeito é o termo da oração sobre o qual se faz uma declaração. " +
      "Sua correta identificação é essencial para acertar questões de concordância verbal e nominal.\n\n" +
      "TIPOS DE SUJEITO:\n\n" +
      "1. Sujeito simples: possui um único núcleo.\n" +
      "   Exemplo: 'O agente redigiu o boletim.'\n\n" +
      "2. Sujeito composto: possui dois ou mais núcleos.\n" +
      "   Exemplo: 'O delegado e o escrivão assinaram o auto.'\n\n" +
      "3. Sujeito oculto (elíptico ou desinencial): não está expresso, mas é identificável " +
      "pela desinência do verbo ou pelo contexto.\n" +
      "   Exemplo: 'Estudamos para o concurso.' (sujeito: nós)\n\n" +
      "4. Sujeito indeterminado: não é possível identificar com precisão quem pratica a ação.\n" +
      "   Casos: (a) verbo na 3ª pessoa do plural sem sujeito expresso anterior;\n" +
      "   (b) verbo transitivo indireto ou de ligação acompanhado de 'se' (índice de indeterminação).\n" +
      "   Exemplos: 'Roubaram minha carteira.' / 'Precisa-se de policiais concursados.'\n\n" +
      "5. Oração sem sujeito (sujeito inexistente): ocorre com verbos impessoais.\n" +
      "   • Verbos de fenômenos naturais: chover, nevar, trovejar, amanhecer, anoitecer.\n" +
      "   • Verbo 'haver' com sentido de existir ou indicar tempo decorrido.\n" +
      "   • Verbo 'fazer' indicando tempo ou fenômeno climático.\n" +
      "   • Verbo 'ser' indicando hora, data ou distância.\n" +
      "   Exemplos: 'Choveu ontem.' / 'Há vagas disponíveis.' / 'Faz dois anos que me formei.'\n\n" +
      "ATENÇÃO — ERRO CLÁSSICO EM PROVAS:\n" +
      "O verbo 'haver' com sentido de existir é SEMPRE impessoal — fica no singular.\n" +
      "ERRADO: 'Haviam muitos candidatos.' CORRETO: 'Havia muitos candidatos.'\n" +
      "O verbo 'ter' coloquialmente substitui 'haver', mas em norma culta deve permanecer no singular nesse uso.",
  },
  {
    id: "por_si_c03",
    title: "Predicação Verbal: Transitividade",
    difficulty: "MEDIO",
    mnemonic: "VI não quer nada. VTD quer direto (sem prep). VTI quer indireto (com prep). VL liga sujeito ao predicativo.",
    keyPoint:
      "• VI (intransitivo): não exige complemento ('O pássaro voou.')\n" +
      "• VTD (transitivo direto): exige OD sem preposição ('Ele comprou o carro.')\n" +
      "• VTI (transitivo indireto): exige OI com preposição ('Ela gosta de música.')\n" +
      "• VTDI (transitivo direto e indireto): exige OD + OI ('Dei o livro ao aluno.')\n" +
      "• VL (ligação): liga sujeito ao predicativo ('Ela parece cansada.')\n" +
      "• Mesmo verbo pode ter predicações diferentes conforme o contexto",
    practicalExample:
      "FCC: 'assistir' = VTI (assistir A algo — ao jogo) mas também VTD (assistir alguém = ajudar). " +
      "'Chegar', 'sair', 'voltar' = VI. 'Ser', 'estar', 'parecer', 'ficar' = VL em certos contextos.",
    textContent:
      "A transitividade verbal determina se o verbo necessita ou não de complemento para completar seu sentido. " +
      "Este é um dos temas mais cobrados em questões de regência verbal.\n\n" +
      "VERBO INTRANSITIVO (VI):\n" +
      "Não exige complemento — seu sentido é completo. Pode ser seguido de adjunto adverbial.\n" +
      "Exemplos: 'O suspeito fugiu.' / 'O réu compareceu ao tribunal.' (ao tribunal = adjunto adverbial)\n\n" +
      "VERBO TRANSITIVO DIRETO (VTD):\n" +
      "Exige complemento SEM preposição obrigatória (objeto direto).\n" +
      "Exemplos: 'O juiz julgou o caso.' / 'A policia prendeu o suspeito.'\n\n" +
      "VERBO TRANSITIVO INDIRETO (VTI):\n" +
      "Exige complemento COM preposição (objeto indireto).\n" +
      "Exemplos: 'Ela gosta de concursos.' / 'O perito duvidou das provas.' / 'Necessito de ajuda.'\n\n" +
      "VERBO TRANSITIVO DIRETO E INDIRETO (VTDI):\n" +
      "Exige dois complementos: objeto direto (sem prep) e objeto indireto (com prep).\n" +
      "Exemplos: 'Entreguei o relatório ao delegado.' / 'Ele informou o fato à chefia.'\n\n" +
      "VERBO DE LIGAÇÃO (VL):\n" +
      "Liga o sujeito a uma qualidade ou estado (predicativo do sujeito). Não exprime ação.\n" +
      "Principais VLs: ser, estar, parecer, permanecer, ficar, continuar, tornar-se, andar.\n" +
      "Exemplo: 'O réu permaneceu calado durante o interrogatório.'\n\n" +
      "ATENÇÃO — VERBOS DE PREDICAÇÃO DUPLA:\n" +
      "Alguns verbos mudam de predicação conforme o contexto:\n" +
      "• 'Assistir' = VTD (assistir alguém = ajudar) ou VTI (assistir a algo = ver)\n" +
      "• 'Querer' = VTD (querer algo) ou VTI (querer a alguém = estimar)\n" +
      "• 'Chegar/Ir' = VI normalmente, mas exigem preposição em adjunto adverbial de lugar",
  },
  {
    id: "por_si_c04",
    title: "Objeto Direto e Objeto Indireto",
    difficulty: "MEDIO",
    mnemonic: "OD = sem prep (Quem/O que? após VTD). OI = com prep obrigatória (A quem? De quê? após VTI).",
    keyPoint:
      "• Objeto direto (OD): complemento de VTD, sem preposição obrigatória\n" +
      "• Objeto indireto (OI): complemento de VTI, com preposição obrigatória\n" +
      "• OD preposicionado: admite preposição por clareza ('Amava a Deus acima de tudo.')\n" +
      "• Objeto pleonástico: OD/OI retomado por pronome átono para ênfase\n" +
      "• Pronomes OD: o, a, os, as (e variantes: lo, la, no, na)\n" +
      "• Pronomes OI: lhe, lhes",
    practicalExample:
      "VUNESP: 'O delegado interrogou o suspeito.' — 'o suspeito' = OD. " +
      "'Ele obedeceu ao regulamento.' — 'ao regulamento' = OI. " +
      "'As flores, eu as reguei.' — 'as flores' = OD pleonástico; 'as' = OD.",
    textContent:
      "Os complementos verbais — objeto direto e objeto indireto — são os termos que completam o sentido " +
      "dos verbos transitivos. Sua identificação correta é base para questões de regência e pronomes.\n\n" +
      "OBJETO DIRETO (OD):\n" +
      "Complemento do verbo transitivo direto, sem preposição obrigatória.\n" +
      "Pergunta de identificação: 'O quê?' ou 'Quem?' após o verbo.\n" +
      "Exemplos:\n" +
      "• 'O perito analisou as provas.' → analisou o quê? → 'as provas' = OD\n" +
      "• 'O juiz condenou o réu.' → condenou quem? → 'o réu' = OD\n\n" +
      "OBJETO DIRETO PREPOSICIONADO:\n" +
      "Em alguns casos, o OD admite preposição por questões estilísticas, de clareza ou porque o verbo " +
      "exige ('amar a', 'honrar a', 'estimar a'). Mesmo com preposição, continua sendo OD.\n" +
      "Exemplo: 'Amo a minha profissão.' (OD preposicionado)\n\n" +
      "OBJETO INDIRETO (OI):\n" +
      "Complemento do verbo transitivo indireto, com preposição obrigatória (a, de, em, com, para).\n" +
      "Pergunta de identificação: 'A quem?', 'De quê?', 'Em quê?', 'Para quem?'\n" +
      "Exemplos:\n" +
      "• 'Ela gosta de literatura jurídica.' → gosta de quê? → 'de literatura jurídica' = OI\n" +
      "• 'Obedecemos às leis.' → obedecemos a quê? → 'às leis' = OI\n\n" +
      "OBJETO PLEONÁSTICO:\n" +
      "Repetição enfática do objeto por meio de pronome átono.\n" +
      "Exemplo: 'O relatório, o delegado o entregou ontem.' ('o relatório' = OD pleonástico)\n\n" +
      "PRONOMES E COMPLEMENTOS:\n" +
      "• Pronomes que substituem OD: o, a, os, as (e variantes lo/la após -r/-s/-z; no/na após nasais)\n" +
      "• Pronomes que substituem OI: lhe, lhes\n" +
      "• ERRO CLÁSSICO: 'Eu lhe amo.' — errado na norma culta; correto: 'Eu o amo.' (amar = VTD)",
  },
  {
    id: "por_si_c05",
    title: "Adjunto Adnominal vs. Complemento Nominal",
    difficulty: "DIFICIL",
    mnemonic: "COMP-nome: Complemento Nominal completa nome de sentido INCOMPLETO (paciente/agente da ação). ADJUNTO qualifica nome de sentido COMPLETO.",
    keyPoint:
      "• Complemento nominal (CN): completa o sentido de nome (substantivo/adjetivo/advérbio) com sentido relacional\n" +
      "• Adjunto adnominal (AA): modifica/qualifica nome, indicando característica, posse, origem\n" +
      "• Diferença-chave: CN é exigido pelo nome; AA é opcional e apenas qualifica\n" +
      "• Se o nome é deverbativo (derivado de verbo), o complemento tende a ser CN\n" +
      "• 'Amor à pátria' → CN (amor = ação, pátria = objeto da ação)\n" +
      "• 'Carro do João' → AA (posse, João não é paciente nem agente de ação)",
    practicalExample:
      "CESPE: 'A destruição da floresta' → 'da floresta' = CN (floresta é paciente da destruição). " +
      "'O livro de direito' → 'de direito' = AA (especifica o tipo, não completa ação). " +
      "'Necessidade de ajuda' → 'de ajuda' = CN (necessidade exige o complemento).",
    textContent:
      "A distinção entre adjunto adnominal e complemento nominal é um dos pontos mais difíceis da " +
      "sintaxe e um favorito das bancas CESPE e FCC em questões de nível alto.\n\n" +
      "COMPLEMENTO NOMINAL (CN):\n" +
      "Completa o sentido de um nome (substantivo, adjetivo ou advérbio) que, por si só, " +
      "apresenta sentido incompleto — geralmente porque esse nome é derivado de verbo (nome deverbativo) " +
      "e mantém a relação verbo-complemento.\n" +
      "O CN é NECESSÁRIO para o nome fazer sentido pleno.\n" +
      "Introdução: preposição (a, de, em, com, para, por).\n\n" +
      "Exemplos de CN:\n" +
      "• 'amor à pátria' — amor exige o objeto amado (pátria = paciente)\n" +
      "• 'destruição da floresta' — floresta é o que foi destruído (paciente)\n" +
      "• 'obediência às leis' — leis é o que se obedece (paciente)\n" +
      "• 'necessidade de recursos' — recursos completam 'necessidade'\n" +
      "• 'favorável ao acordo' — ao acordo complementa o adjetivo 'favorável'\n" +
      "• 'longe do quartel' — do quartel complementa o advérbio 'longe'\n\n" +
      "ADJUNTO ADNOMINAL (AA):\n" +
      "Termo que modifica ou qualifica um nome, indicando: característica, posse, matéria, origem, " +
      "espécie, destino. É opcional — sua retirada não compromete a estrutura da oração.\n\n" +
      "Exemplos de AA:\n" +
      "• 'livro de direito' — especifica o tipo de livro (não há relação verbo-complemento)\n" +
      "• 'mesa de madeira' — indica a matéria\n" +
      "• 'carro do delegado' — indica posse\n" +
      "• 'chegada do trem' — 'do trem' é AA (trem é agente que chega, não paciente)\n\n" +
      "CRITÉRIO PRÁTICO:\n" +
      "Quando o substantivo é deverbativo e a relação é de paciente (aquele que sofre a ação), " +
      "o termo preposicionado tende a ser CN. " +
      "Quando é de posse, matéria ou especificação sem relação verbal, tende a ser AA.\n\n" +
      "CASO ESPECIAL — 'chegada do trem':\n" +
      "Discutido em gramáticas: 'do trem' é geralmente classificado como AA, pois 'trem' é o agente " +
      "da chegada, e o AA pode indicar o agente de ação em nomes deverbativos.",
  },
  {
    id: "por_si_c06",
    title: "Vozes Verbais: Ativa, Passiva e Reflexiva",
    difficulty: "MEDIO",
    mnemonic: "ATIVA pratica. PASSIVA sofre (ser + particípio ou VTD + SE + sujeito paciente). REFLEXIVA pratica E sofre.",
    keyPoint:
      "• Voz ativa: sujeito agente pratica a ação ('O juiz assinou o alvará.')\n" +
      "• Voz passiva analítica: ser/estar/ficar + particípio + agente da passiva\n" +
      "• Voz passiva sintética: VTD + se + sujeito paciente ('Vendeu-se o imóvel.')\n" +
      "• Voz reflexiva: sujeito pratica e sofre ('Ele se machucou.')\n" +
      "• Transformação ativa→passiva: OD vira sujeito; sujeito vira agente da passiva (por/pelo)\n" +
      "• Passiva sintética: 'se' é apassivador, NÃO índice de indeterminação",
    practicalExample:
      "FGV: 'A polícia prendeu o suspeito.' (ativa) → 'O suspeito foi preso pela polícia.' (passiva analítica). " +
      "'Venderam-se os imóveis.' (passiva sintética) → 'os imóveis' = sujeito paciente; verbo concorda.",
    textContent:
      "A voz verbal indica a relação entre o sujeito e a ação expressa pelo verbo. " +
      "É tema constante em questões de transformação de frases e análise sintática.\n\n" +
      "VOZ ATIVA:\n" +
      "O sujeito é o agente — pratica a ação.\n" +
      "Exemplo: 'O delegado indiciou o suspeito.'\n\n" +
      "VOZ PASSIVA ANALÍTICA:\n" +
      "O sujeito é o paciente — sofre a ação. Estrutura: verbo auxiliar (ser, estar, ficar) + particípio.\n" +
      "O agente da passiva é introduzido pelas preposições 'por' (pelo, pela, pelos, pelas) ou, raramente, 'de'.\n" +
      "Exemplo: 'O suspeito foi indiciado pelo delegado.'\n\n" +
      "TRANSFORMAÇÃO ATIVA → PASSIVA ANALÍTICA:\n" +
      "Passo 1: O OD da voz ativa torna-se o sujeito da voz passiva.\n" +
      "Passo 2: O sujeito da voz ativa torna-se o agente da passiva (introduzido por 'por').\n" +
      "Passo 3: O verbo é transformado em: ser (no mesmo tempo) + particípio.\n" +
      "Exemplo: 'A banca elaborou as questões.' → 'As questões foram elaboradas pela banca.'\n\n" +
      "VOZ PASSIVA SINTÉTICA:\n" +
      "Utiliza o pronome 'se' como partícula apassivadora, junto com verbo transitivo direto. " +
      "O sujeito é paciente e o verbo concorda com ele.\n" +
      "Exemplo: 'Vendeu-se o apartamento.' / 'Venderam-se os apartamentos.'\n" +
      "ATENÇÃO: na passiva sintética, o 'se' é apassivador (o verbo concorda com o sujeito). " +
      "No sujeito indeterminado, o 'se' é índice de indeterminação (o verbo fica no singular com VTI).\n\n" +
      "VOZ REFLEXIVA:\n" +
      "O sujeito pratica e sofre a ação simultaneamente. O pronome reflexivo (me, te, se, nos, vos) " +
      "indica que a ação recai sobre o próprio sujeito.\n" +
      "Exemplo: 'O agente se feriu durante a perseguição.'\n\n" +
      "DICA DE PROVA — DISTINÇÃO PASSIVA SINTÉTICA vs. SUJEITO INDETERMINADO:\n" +
      "Passiva sintética (VTD + se): verbo concorda com o sujeito.\n" +
      "'Venderam-se os carros.' (os carros = sujeito paciente → verbo no plural)\n" +
      "Indeterminação (VTI/VL + se): verbo sempre no singular.\n" +
      "'Precisa-se de funcionários.' (funcionários = OI → verbo no singular)",
  },
];

// ─── QUESTÕES ─────────────────────────────────────────────────────────────────

const questions = [
  // ── Q01 — por_si_c01 — Múltipla Escolha ──
  {
    id: "por_si_q01",
    contentId: "por_si_c01",
    statement:
      "Assinale a alternativa em que TODOS os enunciados são orações (possuem verbo).",
    alternatives: [
      { letter: "A", text: "'Silêncio!' / 'Fogo!' / 'Atenção!'" },
      { letter: "B", text: "'Que tragédia!' / 'Paz e amor.' / 'Proibido estacionar.'" },
      { letter: "C", text: "'Choveu.' / 'O réu foi absolvido.' / 'Estudem!'" },
      { letter: "D", text: "'Auxílio emergencial.' / 'Está aprovado.' / 'Vencemos.'" },
      { letter: "E", text: "'Silêncio nos corredores.' / 'Muito barulho.' / 'Ordem!'" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Na alternativa C, todos os enunciados possuem verbo: 'Choveu' (verbo chover), " +
      "'O réu foi absolvido' (locução verbal foi + absolvido) e 'Estudem!' (verbo estudar). " +
      "As demais alternativas contêm frases nominais (sem verbo).",
    explanationCorrect:
      "Correto! Oração é o enunciado estruturado em torno de um verbo ou locução verbal. " +
      "'Choveu', 'foi absolvido' e 'Estudem' são os verbos de cada oração. " +
      "Frases nominais ('Silêncio!', 'Fogo!') são frases, mas não orações.",
    explanationWrong:
      "Atenção: oração exige verbo ou locução verbal. " +
      "Frases como 'Silêncio!', 'Fogo!', 'Que tragédia!' e 'Ordem!' são frases nominais — " +
      "possuem sentido completo, mas não têm verbo, portanto não são orações. " +
      "Apenas a alternativa C apresenta exclusivamente orações.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q02 — por_si_c01 — CERTO/ERRADO ──
  {
    id: "por_si_q02",
    contentId: "por_si_c01",
    statement:
      "(FCC — Adaptada) O enunciado 'Proibido fumar nas dependências do órgão.' constitui " +
      "uma oração, pois transmite uma mensagem completa e apresenta sentido declarativo.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. O enunciado é uma FRASE, não uma oração. " +
      "Frase é qualquer enunciado com sentido completo, com ou sem verbo. " +
      "Oração é o enunciado organizado em torno de um verbo. " +
      "'Proibido fumar' não possui verbo — é uma frase nominal, portanto não é uma oração.",
    explanationCorrect:
      "Correto! 'Proibido fumar' é frase nominal — há sentido completo, mas não há verbo conjugado. " +
      "Sem verbo, não há oração. O enunciado é apenas uma frase.",
    explanationWrong:
      "O enunciado está ERRADO. Ter sentido completo é condição para ser FRASE, não para ser ORAÇÃO. " +
      "Oração exige verbo. 'Proibido fumar' usa o particípio 'proibido' como adjetivo, sem verbo conjugado. " +
      "Portanto, é frase nominal — não é oração.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  // ── Q03 — por_si_c02 — Múltipla Escolha ──
  {
    id: "por_si_q03",
    contentId: "por_si_c02",
    statement:
      "Considerando as orações abaixo, assinale aquela em que o sujeito é INDETERMINADO.",
    alternatives: [
      { letter: "A", text: "'Choveu forte durante a madrugada.'" },
      { letter: "B", text: "'Há muitos candidatos inscritos no concurso.'" },
      { letter: "C", text: "'Precisa-se de médicos para o interior.'" },
      { letter: "D", text: "'Nós aprovamos o projeto por unanimidade.'" },
      { letter: "E", text: "'O diretor e a secretária assinaram o documento.'" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "'Precisa-se de médicos' apresenta sujeito indeterminado: o verbo 'precisar' é transitivo indireto " +
      "(precisar de algo) e está acompanhado do pronome 'se' como índice de indeterminação do sujeito. " +
      "A = sem sujeito (chover = impessoal); B = sem sujeito (haver = impessoal); D = sujeito 'nós' (oculto); E = sujeito composto.",
    explanationCorrect:
      "Correto! 'Precisa-se de médicos' tem sujeito indeterminado: VTI (precisar de) + 'se' (índice de indeterminação). " +
      "Não é possível identificar quem precisa. " +
      "Compare: 'Vende-se imóvel' = passiva sintética (imóvel é sujeito paciente).",
    explanationWrong:
      "Atenção às diferenças: (A) 'Choveu' = oração SEM sujeito — verbo impessoal de fenômeno natural. " +
      "(B) 'Há muitos candidatos' = SEM sujeito — 'haver' com sentido de existir é impessoal. " +
      "(C) 'Precisa-se de médicos' = sujeito INDETERMINADO — VTI + se índice de indeterminação. " +
      "A alternativa correta é C.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q04 — por_si_c02 — CERTO/ERRADO ──
  {
    id: "por_si_q04",
    contentId: "por_si_c02",
    statement:
      "(CESPE/CEBRASPE — Adaptada) Na oração 'Haviam muitos erros no relatório', " +
      "o verbo 'haver' está corretamente flexionado no plural, concordando com 'muitos erros', " +
      "que funciona como sujeito da oração.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. O verbo 'haver' com sentido de existir é impessoal — não tem sujeito e deve " +
      "permanecer SEMPRE no singular. 'Muitos erros' é objeto direto, não sujeito. " +
      "A forma correta é: 'Havia muitos erros no relatório.'",
    explanationCorrect:
      "Correto! 'Haver' (sentido de existir) é impessoal — fica no singular. " +
      "'Muitos erros' é objeto direto, não sujeito. Forma correta: 'Havia muitos erros.'",
    explanationWrong:
      "O item está ERRADO. 'Haver' no sentido de existir é sempre impessoal e deve ficar no singular. " +
      "'Muitos erros' funciona como objeto direto, não como sujeito. " +
      "Correto: 'Havia muitos erros no relatório.' " +
      "O mesmo vale para 'fazer' e os verbos de fenômeno natural.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  // ── Q05 — por_si_c03 — Múltipla Escolha ──
  {
    id: "por_si_q05",
    contentId: "por_si_c03",
    statement:
      "Assinale a alternativa em que o verbo sublinhado é TRANSITIVO INDIRETO.",
    alternatives: [
      { letter: "A", text: "'O perito [analisou] as evidências encontradas na cena.'" },
      { letter: "B", text: "'A vítima [recebeu] o laudo do exame de corpo de delito.'" },
      { letter: "C", text: "'O agente [duvidou] das informações prestadas pelo suspeito.'" },
      { letter: "D", text: "'O promotor [leu] os autos do processo em voz alta.'" },
      { letter: "E", text: "'A testemunha [confirmou] a versão apresentada pela defesa.'" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "'Duvidou' é VTI: 'duvidar de algo' exige complemento com preposição obrigatória 'de'. " +
      "'Das informações' = objeto indireto. " +
      "A, B, D, E: 'analisou', 'recebeu', 'leu' e 'confirmou' são VTD — exigem OD sem preposição.",
    explanationCorrect:
      "Excelente! 'Duvidar' é VTI — exige complemento com preposição 'de' (duvidar de algo). " +
      "'Das informações' = objeto indireto. Nos demais casos, os verbos são VTD com objeto direto sem preposição.",
    explanationWrong:
      "Relembre: VTI exige complemento COM preposição obrigatória. " +
      "Pergunte: 'duvidou de quê?' → 'das informações' (preposição 'de' obrigatória) = OI → VTI. " +
      "'Analisou o quê?', 'recebeu o quê?', 'leu o quê?', 'confirmou o quê?' → sem preposição = OD → VTD.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q06 — por_si_c03 — CERTO/ERRADO ──
  {
    id: "por_si_q06",
    contentId: "por_si_c03",
    statement:
      "(FGV — Adaptada) O verbo 'assistir', na oração 'O médico assistiu o ferido no pronto-socorro', " +
      "funciona como transitivo indireto, exigindo complemento com preposição.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. Nesta oração, 'assistir' está empregado no sentido de 'socorrer, ajudar', " +
      "que é o uso transitivo DIRETO do verbo. 'O ferido' é objeto direto (sem preposição). " +
      "'Assistir' é VTI somente no sentido de 'ver, presenciar' (assistir A algo).",
    explanationCorrect:
      "Correto! 'Assistir' no sentido de 'socorrer/ajudar' é VTD — 'o ferido' é objeto direto sem preposição. " +
      "No sentido de 'ver/presenciar', é VTI: 'assistir ao jogo' (com preposição a). " +
      "O contexto determina a predicação.",
    explanationWrong:
      "'Assistir' tem predicação dupla: VTD (sentido de ajudar/socorrer) e VTI (sentido de ver/presenciar). " +
      "Na oração 'o médico assistiu o ferido', o sentido é 'socorrer' → VTD → 'o ferido' = OD sem preposição. " +
      "O item está ERRADO ao classificar como VTI.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  // ── Q07 — por_si_c04 — Múltipla Escolha ──
  {
    id: "por_si_q07",
    contentId: "por_si_c04",
    statement:
      "Na oração 'O escrivão entregou os autos ao delegado', identifique corretamente " +
      "o objeto direto e o objeto indireto.",
    alternatives: [
      { letter: "A", text: "OD: 'ao delegado' / OI: 'os autos'" },
      { letter: "B", text: "OD: 'os autos' / OI: 'ao delegado'" },
      { letter: "C", text: "OD: 'o escrivão' / OI: 'os autos'" },
      { letter: "D", text: "OD: 'os autos' / não há OI na oração" },
      { letter: "E", text: "OD: 'ao delegado' / não há OI, pois 'ao delegado' é adjunto" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "'Entregar' é VTDI: exige OD e OI. " +
      "'Os autos' = OD (sem preposição, responde 'entregou o quê?'). " +
      "'Ao delegado' = OI (com preposição, responde 'entregou a quem?'). " +
      "'O escrivão' é o sujeito da oração.",
    explanationCorrect:
      "Correto! 'Entregar' é VTDI — exige dois complementos. " +
      "OD: 'os autos' (sem preposição, objeto entregue). " +
      "OI: 'ao delegado' (com preposição 'a', destinatário). " +
      "Sujeito: 'o escrivão' (quem entregou).",
    explanationWrong:
      "Relembre: OD responde 'o quê?' sem preposição; OI responde 'a quem?/de quê?' com preposição. " +
      "'Entregou o quê?' → 'os autos' = OD. 'Entregou a quem?' → 'ao delegado' = OI. " +
      "'O escrivão' é o sujeito (quem pratica a ação), não complemento.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q08 — por_si_c04 — CERTO/ERRADO ──
  {
    id: "por_si_q08",
    contentId: "por_si_c04",
    statement:
      "(VUNESP — Adaptada) Na oração 'Eu lhe telefonei ontem', o pronome 'lhe' " +
      "exerce a função de objeto direto, pois 'telefonar' é verbo transitivo direto.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. O verbo 'telefonar' é transitivo indireto — telefonar A alguém. " +
      "O pronome 'lhe' é a forma átona que substitui o objeto indireto (equivale a 'a ele/a ela'). " +
      "Portanto, 'lhe' exerce função de OBJETO INDIRETO, não de objeto direto.",
    explanationCorrect:
      "Correto! 'Telefonar' é VTI (telefonar a alguém). " +
      "O pronome 'lhe' substitui o OI — é a forma oblíqua átona de 3ª pessoa que representa 'a ele/a ela'. " +
      "O item está ERRADO ao classificar 'lhe' como OD.",
    explanationWrong:
      "O pronome 'lhe' é sempre objeto INDIRETO — substitui 'a ele/a ela' (OI). " +
      "'Telefonar' é VTI: telefonar A alguém (preposição obrigatória). " +
      "O item está ERRADO. Erro clássico: usar 'lhe' com verbos VTD. Ex.: 'Eu o amo' (não 'lhe amo').",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  // ── Q09 — por_si_c05 — Múltipla Escolha ──
  {
    id: "por_si_q09",
    contentId: "por_si_c05",
    statement:
      "Assinale a alternativa em que o termo destacado é COMPLEMENTO NOMINAL.",
    alternatives: [
      { letter: "A", text: "'O carro [do delegado] estava estacionado em frente ao fórum.'" },
      { letter: "B", text: "'Ele comprou um livro [de direito penal] para o concurso.'" },
      { letter: "C", text: "'A destruição [das provas] comprometeu o inquérito policial.'" },
      { letter: "D", text: "'Ela usava um casaco [de lã] nas noites frias de inverno.'" },
      { letter: "E", text: "'O policial entregou o relatório [do mês] ao seu supervisor.'" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "'Das provas' é complemento nominal: 'destruição' é nome deverbativo (de 'destruir') " +
      "e 'as provas' é o paciente da ação de destruir — o termo completa o sentido do substantivo. " +
      "A, B, D, E: os termos indicam posse, matéria ou especificação — são adjuntos adnominais.",
    explanationCorrect:
      "Correto! 'Destruição das provas': 'destruição' deriva de 'destruir'. " +
      "'As provas' é o que foi destruído (paciente da ação) → complemento nominal. " +
      "Compare: 'do delegado' = posse (AA), 'de direito penal' = especificação (AA), 'de lã' = matéria (AA).",
    explanationWrong:
      "Complemento nominal completa nome deverbativo com relação verbo-objeto. " +
      "'Destruição' deriva de 'destruir' → 'das provas' = o que foi destruído (paciente) = CN. " +
      "Os demais indicam posse ('do delegado'), matéria ('de lã'), especificação ('de direito penal') — todos AA.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q10 — por_si_c05 — CERTO/ERRADO ──
  {
    id: "por_si_q10",
    contentId: "por_si_c05",
    statement:
      "(CESPE — Adaptada) Na expressão 'necessidade de cautela', o termo 'de cautela' " +
      "exerce a função de adjunto adnominal, pois modifica o substantivo 'necessidade' " +
      "indicando uma característica.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. 'De cautela' é COMPLEMENTO NOMINAL. O substantivo 'necessidade' apresenta " +
      "sentido incompleto e exige complemento para se completar — necessidade de quê? de cautela. " +
      "É análogo ao OI do verbo 'necessitar': 'necessitar de cautela' → 'necessidade de cautela' (CN).",
    explanationCorrect:
      "Correto! 'De cautela' é complemento nominal: 'necessidade' exige o complemento para ter sentido pleno. " +
      "Compare com o verbo correspondente: 'necessitar de' (VTI) → 'necessidade de' exige CN.",
    explanationWrong:
      "O item está ERRADO. 'De cautela' é complemento nominal, não adjunto. " +
      "O substantivo 'necessidade' tem sentido relacional — exige de quê se tem necessidade. " +
      "Critério: se o nome deriva de verbo e o complemento é paciente ou 'objeto' da ação, é CN. " +
      "Adjunto adnominal apenas qualifica sem ser exigido.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
  // ── Q11 — por_si_c06 — Múltipla Escolha ──
  {
    id: "por_si_q11",
    contentId: "por_si_c06",
    statement:
      "Assinale a alternativa que apresenta a correta transformação para a voz passiva analítica: " +
      "'A perícia coletou as amostras de DNA.'",
    alternatives: [
      { letter: "A", text: "'As amostras de DNA foram coletadas pela perícia.'" },
      { letter: "B", text: "'As amostras de DNA coletou-se pela perícia.'" },
      { letter: "C", text: "'A perícia foi coletada pelas amostras de DNA.'" },
      { letter: "D", text: "'As amostras de DNA foram coletadas da perícia.'" },
      { letter: "E", text: "'As amostras de DNA coletaram-se pela perícia.'" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "Transformação: OD 'as amostras de DNA' → sujeito paciente; " +
      "verbo 'coletou' (pretérito perfeito) → 'foram coletadas' (ser no mesmo tempo + particípio); " +
      "sujeito 'a perícia' → agente da passiva 'pela perícia' (por + artigo).",
    explanationCorrect:
      "Correto! Passo a passo: 'as amostras de DNA' (OD) → sujeito; " +
      "'coletou' → 'foram coletadas' (ser pretérito perfeito + particípio concordando com o sujeito feminino plural); " +
      "'a perícia' (sujeito) → 'pela perícia' (agente da passiva). Alternativa A perfeita.",
    explanationWrong:
      "Regra da transformação ativa→passiva: (1) OD vira sujeito; (2) verbo: ser + particípio; " +
      "(3) sujeito vira agente da passiva com 'por/pelo/pela'. " +
      "B usa 'se' (passiva sintética, não analítica). C inverteu sujeito e objeto. " +
      "D usa 'da' em vez de 'pela'. E usa passiva sintética com concordância errada.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q12 — por_si_c06 — CERTO/ERRADO ──
  {
    id: "por_si_q12",
    contentId: "por_si_c06",
    statement:
      "(FGV — Adaptada) Na oração 'Venderam-se os apartamentos do condomínio', " +
      "o pronome 'se' funciona como índice de indeterminação do sujeito e o verbo " +
      "deveria permanecer no singular: 'Vendeu-se os apartamentos'.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. O verbo 'vender' é transitivo direto (VTD). Com 'se' apassivador, " +
      "'os apartamentos' funciona como SUJEITO PACIENTE — e o verbo deve concordar com ele. " +
      "Como o sujeito está no plural, o verbo vai para o plural: 'Venderam-se os apartamentos.' " +
      "(Passiva sintética, não indeterminação do sujeito.)",
    explanationCorrect:
      "Correto! 'Vender' é VTD → 'se' é apassivador → 'os apartamentos' é sujeito paciente → verbo no plural. " +
      "Correto: 'Venderam-se os apartamentos.' O item está ERRADO ao chamar de indeterminação.",
    explanationWrong:
      "O item está ERRADO. Distinção essencial: com VTD + se, temos passiva sintética — " +
      "'os apartamentos' é sujeito paciente e o verbo concorda com ele (plural → venderam). " +
      "Com VTI + se (indeterminação), o verbo fica no singular: 'Precisa-se de apartamentos.' " +
      "'Venderam-se os apartamentos' está correto como passiva sintética.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
];

// ─── RUNNER ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Seed R30 — Língua Portuguesa: Sintaxe — Termos da Oração ===\n");

  // 1. Resolver Subject
  const subjectRows = await db.execute(sql`
    SELECT id FROM "Subject"
    WHERE name ILIKE '%Portugu%'
       OR name ILIKE '%L%ngua%Portugu%'
    ORDER BY name
    LIMIT 1
  `) as any[];

  if (!subjectRows[0]) {
    throw new Error('Subject com "Português" não encontrado. Verifique o banco.');
  }
  const subjectId = subjectRows[0].id;
  console.log(`Subject encontrado: ${subjectId}`);

  // 2. Resolver Topic
  const topicRows = await db.execute(sql`
    SELECT id FROM "Topic"
    WHERE "subjectId" = ${subjectId}
    ORDER BY name
    LIMIT 1
  `) as any[];

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
    const contentRows = await db.execute(sql`
      SELECT id FROM "Content" WHERE id = ${q.contentId} LIMIT 1
    `) as any[];

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

  console.log("\n=== R30 concluído: 6 átomos + 12 questões de Sintaxe ===");
  process.exit(0);
}

main().catch((err) => {
  console.error("ERRO no seed R30:", err);
  process.exit(1);
});
