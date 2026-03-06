/**
 * Seed R33 — Direito Penal: Teoria do Crime
 * 6 átomos de conteúdo  (pen_tc_c01–c06)
 * 12 questões           (pen_tc_q01–q12)
 *
 * Execução (Replit): npx tsx db/seed-direito-penal-teoria-crime-r33.ts
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

// ─── CONTEÚDOS ───────────────────────────────────────────────────────────────

const contents = [
  {
    id: "pen_tc_c01",
    title: "Conceito Analítico de Crime — Teoria Tripartida",
    difficulty: "MEDIO",
    mnemonic:
      "TIC: Típico + Ilícito + Culpável = CRIME. " +
      "Teoria Tripartida (majoritária): todos os 3 elementos integram o conceito de crime. " +
      "Teoria Bipartida (Damásio/Mirabete): crime = FT + Ilicitude; culpabilidade = pressuposto da PENA. " +
      "Para provas de carreira policial: adote a TRIPARTIDA (posição do CP e STF).",
    keyPoint:
      "Teoria Tripartida (majoritária — CP e STF):\n" +
      "• Fato Típico: conduta + resultado + nexo causal + tipicidade (adequação ao tipo penal)\n" +
      "• Ilicitude (antijuridicidade): ausência de excludentes (LD, EN, ECDU, ERD)\n" +
      "• Culpabilidade: imputabilidade + potencial consciência da ilicitude + exigibilidade de conduta diversa\n" +
      "Teoria Bipartida: culpabilidade é pressuposto da pena, não do crime\n" +
      "Infração penal: crime (reclusão/detenção) + contravenção penal (prisão simples/multa)",
    practicalExample:
      "CESPE: 'Segundo a teoria tripartida, a culpabilidade integra o conceito analítico de crime.' — CERTO. " +
      "FGV: Ausência de fato típico = atipicidade — absolve sem necessidade de analisar ilicitude ou culpabilidade. " +
      "FCC: Contravenção penal difere do crime pela pena abstrata — prisão simples (não reclusão ou detenção).",
    textContent:
      "O conceito analítico de crime decompõe o crime em seus elementos estruturantes, " +
      "permitindo análise sistemática e progressiva de cada requisito.\n\n" +
      "TEORIA TRIPARTIDA (majoritária no Brasil):\n" +
      "Crime é o fato típico, ilícito (antijurídico) e culpável. " +
      "Adotada pelo Código Penal brasileiro e pela maioria da doutrina e jurisprudência.\n\n" +
      "1. FATO TÍPICO:\n" +
      "É a conduta humana que se enquadra no modelo legal descrito no tipo penal. Compõe-se de:\n" +
      "  Conduta: ação ou omissão voluntária e consciente (humana).\n" +
      "  Resultado: modificação do mundo exterior causada pela conduta (nem todo crime exige resultado naturalístico).\n" +
      "  Nexo de causalidade: ligação entre conduta e resultado.\n" +
      "  Tipicidade: adequação formal da conduta ao tipo penal (e, para a teoria conglobante, tipicidade material).\n\n" +
      "2. ILICITUDE (ANTIJURIDICIDADE):\n" +
      "É a contrariedade do fato típico com o ordenamento jurídico como um todo. " +
      "Presume-se com o fato típico — ao acusado cabe provar a excludente. " +
      "Excludentes de ilicitude (causas justificantes — art. 23 CP): " +
      "Legítima Defesa, Estado de Necessidade, Estrito Cumprimento do Dever Legal e Exercício Regular de Direito.\n\n" +
      "3. CULPABILIDADE:\n" +
      "É o juízo de reprovação do agente pelo fato típico e ilícito praticado. " +
      "Elementos: imputabilidade + potencial consciência da ilicitude + exigibilidade de conduta diversa. " +
      "Causas de exclusão da culpabilidade (dirimente): inimputabilidade, erro de proibição invencível, " +
      "coação moral irresistível, obediência hierárquica.\n\n" +
      "TEORIA BIPARTIDA:\n" +
      "Defendida por Damásio de Jesus e Mirabete: crime = fato típico + ilicitude. " +
      "A culpabilidade é pressuposto da pena (não do crime). " +
      "Minoria doutrinária — mas cobrada em provas para diferenciar das teorias.\n\n" +
      "TEORIA QUADRIPARTIDA:\n" +
      "Acrescenta a punibilidade como quarto elemento. Pouco adotada no Brasil.\n\n" +
      "INFRAÇÃO PENAL:\n" +
      "Gênero que comporta duas espécies:\n" +
      "  Crime (delito): punido com reclusão ou detenção, cumulativa ou alternativamente com multa.\n" +
      "  Contravenção penal: punida com prisão simples ou multa.\n\n" +
      "ANÁLISE ESTRATIFICADA:\n" +
      "A análise segue ordem lógica: se o fato NÃO for típico, encerra-se a análise (atipicidade). " +
      "Se for típico mas houver excludente de ilicitude, não há crime. " +
      "Se for típico e ilícito, mas o agente for inimputável, não há culpabilidade — " +
      "aplica-se medida de segurança (não pena).",
  },
  {
    id: "pen_tc_c02",
    title: "Fato Típico e Nexo Causal — Art. 13 do Código Penal",
    difficulty: "MEDIO",
    mnemonic:
      "CONDITIO: Teoria da equivalência dos antecedentes (art. 13 CP) — tudo que contribuiu é causa. " +
      "ROMPE O NEXO: causa superveniente RELATIVAMENTE independente que POR SI SÓ produziu o resultado (art. 13, §1º). " +
      "NÃO ROMPE: causas preexistentes e concomitantes (mesmo relativamente independentes).",
    keyPoint:
      "• Nexo causal (art. 13 CP): teoria da equivalência dos antecedentes (conditio sine qua non)\n" +
      "• Crime material: exige resultado naturalístico (homicídio)\n" +
      "• Crime formal: resultado é dispensável para consumação (extorsão)\n" +
      "• Crime de mera conduta: sem resultado previsto no tipo (violação de domicílio)\n" +
      "• Causa superveniente relativamente independente que POR SI SÓ produziu o resultado: ROMPE o nexo (art. 13, §1º)\n" +
      "• Causas preexistentes e concomitantes relativamente independentes: NÃO rompem o nexo\n" +
      "• Crime omissivo: punível quando o agente tem dever de agir (art. 13, §2º — garantidor)",
    practicalExample:
      "CESPE clássico: 'A' esfaqueia 'B'; durante o transporte ao hospital, ambulância capota e 'B' morre. " +
      "Causa SUPERVENIENTE relativamente independente que por si só produziu o resultado — ROMPE o nexo. " +
      "'A' responde por lesão corporal, não por homicídio. " +
      "FGV: 'A' esfaqueia hemofílico 'B'; B morre por excesso de hemorragia. Causa PREEXISTENTE — NÃO rompe o nexo — 'A' responde por homicídio.",
    textContent:
      "O fato típico é o primeiro substrato do crime e exige a presença de quatro elementos cumulativos: " +
      "conduta, resultado, nexo de causalidade e tipicidade.\n\n" +
      "CONDUTA:\n" +
      "É o comportamento humano voluntário e consciente (ação ou omissão). " +
      "Excluem a conduta: atos reflexos, coação física irresistível (vis absoluta), sonambulismo, hipnose.\n" +
      "Crimes comissivos: praticados por ação (fazer o que a lei proíbe).\n" +
      "Crimes omissivos próprios: praticados por omissão descrita no tipo (art. 135 CP — omissão de socorro).\n" +
      "Crimes omissivos impróprios (comissivos por omissão): agente garantidor que devia e podia agir não age.\n\n" +
      "RESULTADO:\n" +
      "Crime material: tipo exige a produção de resultado naturalístico (ex: homicídio — morte da vítima).\n" +
      "Crime formal (de consumação antecipada): tipo não exige o resultado; consuma-se com a conduta (ex: extorsão).\n" +
      "Crime de mera conduta: tipo não prevê resultado algum (ex: violação de domicílio).\n\n" +
      "NEXO CAUSAL — TEORIA DA EQUIVALÊNCIA DOS ANTECEDENTES (art. 13 CP):\n" +
      "'Considera-se causa a ação ou omissão sem a qual o resultado não teria ocorrido.' " +
      "Todo antecedente que, suprimido mentalmente (método hipotético de Thyrén), fizer com que o resultado " +
      "desapareça, é considerado causa.\n\n" +
      "CAUSA SUPERVENIENTE RELATIVAMENTE INDEPENDENTE (art. 13, §1º CP):\n" +
      "'A superveniência de causa relativamente independente exclui a imputação quando, por si só, " +
      "produziu o resultado; os fatos anteriores, entretanto, imputam-se a quem os praticou.'\n\n" +
      "Interpretação: se a causa superveniente, sozinha, foi capaz de produzir o resultado (saindo da linha " +
      "normal de desdobramento da conduta original), ROMPE o nexo causal.\n" +
      "Exemplo: tiro não letal + infecção hospitalar que mata — infecção superveniente rompe o nexo.\n" +
      "Se NÃO saiu da linha de desdobramento normal: NÃO rompe. Ex: tiro + hemorragia grave + morte — previsível.\n\n" +
      "CAUSAS PREEXISTENTES E CONCOMITANTES (relativamente independentes):\n" +
      "NÃO rompem o nexo causal — o agente responde pelo resultado integral.\n" +
      "Preexistente: a vítima hemofílica, que morre de hemorragia por facada que não mataria pessoa normal.\n" +
      "Concomitante: outro agente dispara ao mesmo tempo.\n\n" +
      "CRIME OMISSIVO — GARANTIDOR (art. 13, §2º CP):\n" +
      "Responde pela omissão quem tinha o dever de agir (garantidor):\n" +
      "  (a) Tenha por lei obrigação de cuidado (pais/filhos, médico de plantão).\n" +
      "  (b) Assumiu a responsabilidade de impedir o resultado.\n" +
      "  (c) Criou, com comportamento anterior, situação de risco.",
  },
  {
    id: "pen_tc_c03",
    title: "Dolo vs. Culpa — A Distinção Mais Cobrada em Provas",
    difficulty: "DIFICIL",
    mnemonic:
      "DOLO DIRETO: quer o resultado. DOLO EVENTUAL: 'dane-se, assumo o risco' (assume + aceita). " +
      "CULPA CONSCIENTE: prevê o resultado, mas confia que NÃO vai acontecer ('não vai acontecer comigo'). " +
      "CULPA INCONSCIENTE: não prevê, mas deveria prever. " +
      "Chave: ACEITAR o resultado = dolo eventual. NÃO ACEITAR = culpa consciente.",
    keyPoint:
      "Dolo direto (1º grau): o agente QUER diretamente o resultado\n" +
      "Dolo de 2º grau (consequências necessárias): aceita consequências inevitáveis do fim desejado\n" +
      "Dolo eventual: prevê o resultado como possível e ASSUME o risco de produzi-lo\n" +
      "Culpa consciente: prevê o resultado mas ACREDITA QUE NÃO OCORRERÁ (confia na evitabilidade)\n" +
      "Culpa inconsciente: não prevê o resultado, mas poderia e deveria prevê-lo\n" +
      "Espécies de culpa: Imprudência (ação positiva arriscada) · Negligência (omissão de cuidado) · Imperícia (falta de habilidade técnica)\n" +
      "STF: racha de automóveis → dolo eventual (não culpa consciente)",
    practicalExample:
      "CESPE: 'Motorista que dirige embriagado a 180 km/h e atropela pedestre age com dolo eventual.' — em tese, CERTO (depende das circunstâncias). " +
      "FGV: 'No dolo eventual, o agente quer diretamente o resultado.' — ERRADO: apenas assume o risco. " +
      "STF RHC 117.076: racha automobilístico com morte = dolo eventual, não culpa consciente. " +
      "FCC: Imprudência = ação positiva (dirigir em velocidade excessiva). Negligência = omissão (não verificar freios).",
    textContent:
      "A distinção entre dolo eventual e culpa consciente é uma das mais difíceis e frequentes " +
      "nas provas de concursos de carreiras policiais. Ambos envolvem a previsão do resultado, " +
      "mas o elemento volitivo é radicalmente diferente.\n\n" +
      "DOLO (art. 18, I, CP):\n" +
      "'Diz-se o crime: doloso, quando o agente quis o resultado ou assumiu o risco de produzi-lo.'\n\n" +
      "DOLO DIRETO DE 1º GRAU:\n" +
      "O agente prevê o resultado e QUER diretamente produzi-lo. " +
      "Elemento volitivo pleno: vontade + consciência dirigidas ao resultado.\n" +
      "Exemplo: 'A' aponta a arma para 'B' e atira para matá-lo.\n\n" +
      "DOLO DIRETO DE 2º GRAU (DE CONSEQUÊNCIAS NECESSÁRIAS):\n" +
      "O agente não quer diretamente o resultado colateral, mas o aceita como consequência inevitável do fim desejado.\n" +
      "Exemplo: 'A' planta bomba em avião para matar 'B'; aceita a morte dos demais passageiros.\n\n" +
      "DOLO EVENTUAL:\n" +
      "O agente prevê o resultado como possível, mas não muda sua conduta — " +
      "assume e aceita o risco de produzi-lo. Fórmula de Frank: 'seja como for, ocorra ou não o resultado, não me importo'.\n" +
      "O agente diz internamente: 'dane-se' ou 'tanto faz'.\n" +
      "Exemplos: racha de automóveis; disparo a esmo em via pública; roleta-russa.\n\n" +
      "CULPA (art. 18, II, CP):\n" +
      "'Diz-se o crime: culposo, quando o agente deu causa ao resultado por imprudência, negligência ou imperícia.'\n\n" +
      "CULPA CONSCIENTE (LUXÚRIA):\n" +
      "O agente prevê o resultado como possível, mas acredita sinceramente que ele NÃO vai ocorrer " +
      "(confia em sua habilidade para evitá-lo). Distingue-se do dolo eventual pela REJEIÇÃO do resultado.\n" +
      "Fórmula: 'Eu sei que pode acontecer, mas tenho certeza que não vai acontecer comigo.'\n" +
      "Exemplo: piloto experiente que faz manobras arriscadas confiando em sua habilidade.\n\n" +
      "CULPA INCONSCIENTE:\n" +
      "O agente não prevê o resultado, mas poderia e deveria tê-lo previsto. " +
      "Ausência total do elemento intelectivo em relação ao resultado.\n" +
      "Exemplo: motorista que não vê pedestre porque está distraído com celular.\n\n" +
      "ESPÉCIES DE CULPA:\n" +
      "Imprudência: ação positiva com falta de cuidado (dirigir a 200 km/h em área urbana).\n" +
      "Negligência: omissão de cautela devida (não verificar os freios antes de viajar).\n" +
      "Imperícia: falta de aptidão técnica ou habilidade específica (cirurgião que opera sem competência).\n\n" +
      "CHAVE DA DISTINÇÃO DOLO EVENTUAL vs. CULPA CONSCIENTE:\n" +
      "Ambos: preveem o resultado como possível.\n" +
      "Dolo eventual: ACEITA o resultado (assume o risco).\n" +
      "Culpa consciente: REJEITA o resultado (confia na evitabilidade).\n\n" +
      "JURISPRUDÊNCIA DO STF:\n" +
      "Racha automobilístico com resultado morte: o STF consolidou o entendimento de que configura " +
      "DOLO EVENTUAL — o agente que disputa racha assume o risco de matar (RHC 117.076 e outros).",
  },
  {
    id: "pen_tc_c04",
    title: "Excludentes de Ilicitude — Art. 23 do Código Penal",
    difficulty: "MEDIO",
    mnemonic:
      "LEED: Legítima Defesa · Estado de Necessidade · Estrito Cumprimento do Dever Legal · Exercício Regular de Direito. " +
      "LD: agressão INJUSTA (atual ou iminente) + meios NECESSÁRIOS + MODERAÇÃO. " +
      "EN: perigo ATUAL + não provocado + inevitável + proporcionalidade. " +
      "STF ADPF 779 (2021): 'legítima defesa da honra' é INCONSTITUCIONAL.",
    keyPoint:
      "Art. 23 CP — Excludentes de ilicitude (causas justificantes):\n" +
      "• Legítima Defesa: agressão injusta (atual ou iminente) + meios necessários + moderação + direito próprio ou alheio\n" +
      "• Estado de Necessidade: perigo atual não provocado voluntariamente + inevitável + razoabilidade do sacrifício\n" +
      "• Estrito Cumprimento do Dever Legal: agente público agindo dentro da lei (prisão em flagrante, execução de mandado)\n" +
      "• Exercício Regular de Direito: médico que opera, advogado que acusa, esporte violento com regras\n" +
      "• Excesso punível (art. 23, §único): doloso ou culposo — exclui a excludente\n" +
      "• STF ADPF 779/2021: 'legítima defesa da honra' viola CF/88 — tese inconstitucional",
    practicalExample:
      "CESPE: 'Age em legítima defesa quem repele agressão futura (não iminente).' — ERRADO: só atual ou IMINENTE. " +
      "FGV: Policial que mata suspeito fugindo pelas costas sem apresentar perigo atual — excesso punível ou ausência de LD. " +
      "STF ADPF 779: proibiu o uso da tese de 'legítima defesa da honra' como estratégia de defesa em casos de feminicídio.",
    textContent:
      "As excludentes de ilicitude (causas de justificação) são situações em que o fato típico é praticado, " +
      "mas a lei autoriza a conduta — afastando a antijuridicidade e, consequentemente, o crime.\n\n" +
      "ART. 23 DO CÓDIGO PENAL:\n" +
      "'Não há crime quando o agente pratica o fato:\n" +
      "I — em estado de necessidade;\n" +
      "II — em legítima defesa;\n" +
      "III — em estrito cumprimento de dever legal ou no exercício regular de direito.'\n\n" +
      "1. LEGÍTIMA DEFESA (art. 25 CP):\n" +
      "'Entende-se em legítima defesa quem, usando moderadamente dos meios necessários, repele injusta agressão, " +
      "atual ou iminente, a direito seu ou de outrem.'\n\n" +
      "Requisitos cumulativos:\n" +
      "  (a) Agressão INJUSTA: contrária ao direito (não precisa ser crime). Agressão justa (policial cumprindo mandado) não autoriza LD.\n" +
      "  (b) ATUAL ou IMINENTE: está acontecendo ou prestes a acontecer. Agressão futura ou passada = vingança, não LD.\n" +
      "  (c) Meios NECESSÁRIOS: o meio mais suave disponível capaz de repelir a agressão.\n" +
      "  (d) Uso MODERADO dos meios: proporcionalidade — não pode exceder o necessário.\n" +
      "  (e) Proteção de direito PRÓPRIO ou ALHEIO: pode defender terceiro (LD de terceiros).\n\n" +
      "Legítima defesa putativa: o agente imagina erroneamente que há agressão (erro — não é excludente real).\n\n" +
      "STF — ADPF 779 (2021):\n" +
      "O STF declarou a tese da 'legítima defesa da honra' inconstitucional. " +
      "Não é possível invocar legítima defesa da honra para justificar feminicídio ou qualquer violência contra a mulher " +
      "em razão de ciúme ou suposta infidelidade conjugal. A tese viola a dignidade da pessoa humana e o princípio da igualdade.\n\n" +
      "2. ESTADO DE NECESSIDADE (art. 24 CP):\n" +
      "'Considera-se em estado de necessidade quem pratica o fato para salvar de perigo atual, que não provocou por sua vontade, " +
      "nem podia de outro modo evitar, direito próprio ou alheio, cujo sacrifício, nas circunstâncias, não era razoável exigir-se.'\n\n" +
      "Requisitos:\n" +
      "  (a) Perigo ATUAL (não futuro).\n" +
      "  (b) Não provocado voluntariamente pelo agente.\n" +
      "  (c) Inevitável por outro meio.\n" +
      "  (d) Razoabilidade do sacrifício do bem alheio.\n\n" +
      "3. ESTRITO CUMPRIMENTO DO DEVER LEGAL:\n" +
      "O agente, no exercício de função pública, realiza conduta típica autorizada por lei. " +
      "Exemplos: policial que prende em flagrante, verdugo que aplica pena de morte (em países que a admitem), " +
      "oficial de justiça que realiza penhora.\n\n" +
      "4. EXERCÍCIO REGULAR DE DIREITO:\n" +
      "Condutas típicas mas autorizadas pelo direito: intervenção cirúrgica, esportes de luta com regras, " +
      "penhor de bem (credor), atividade jornalística de denúncia.\n\n" +
      "EXCESSO PUNÍVEL (art. 23, §único):\n" +
      "O agente que excede os limites da excludente responde pelo excesso doloso ou culposo. " +
      "Excesso intensivo: ultrapassa os meios necessários. " +
      "Excesso extensivo: continua agindo após cessada a agressão.",
  },
  {
    id: "pen_tc_c05",
    title: "Culpabilidade — Imputabilidade, Consciência e Exigibilidade",
    difficulty: "MEDIO",
    mnemonic:
      "ICE: Imputabilidade + Consciência potencial da ilicitude + Exigibilidade de conduta diversa. " +
      "Sem ICE, não há culpabilidade (há fato típico e ilícito, mas não crime punível). " +
      "Inimputável: menor de 18 + doente mental (art. 26) — medida de segurança, não pena. " +
      "ALIC = Actio Libera In Causa: embriaguez PREORDENADA não exclui imputabilidade.",
    keyPoint:
      "Elementos da culpabilidade:\n" +
      "• Imputabilidade: capacidade de entender e querer (excluída pela menoridade < 18 e por doença mental)\n" +
      "• Semi-imputabilidade (art. 26, §único): reduz a pena de 1/3 a 2/3\n" +
      "• Potencial consciência da ilicitude: saber que a conduta é errada (erro de proibição invencível exclui)\n" +
      "• Exigibilidade de conduta diversa: poder agir diferente nas circunstâncias (excluída por coação moral irresistível e obediência hierárquica)\n" +
      "• Embriaguez voluntária (não preordenada): NÃO exclui imputabilidade\n" +
      "• Embriaguez preordenada (actio libera in causa): agrava a pena",
    practicalExample:
      "CESPE: 'A embriaguez voluntária completa exclui a imputabilidade do agente.' — ERRADO: reforma de 1984 aboliu isso. " +
      "FGV: 'Erro de proibição invencível exclui a culpabilidade.' — CERTO (art. 21 CP). " +
      "FCC: Menor de 18 anos é inimputável — responde pelo ECA, não pelo CP; aplica-se medida socioeducativa, não pena.",
    textContent:
      "A culpabilidade é o terceiro substrato do crime na teoria tripartida. " +
      "Sem ela, não se aplica pena — embora o fato seja típico e ilícito.\n\n" +
      "ELEMENTO 1 — IMPUTABILIDADE:\n" +
      "É a capacidade do agente de entender o caráter ilícito do fato e de determinar-se segundo esse entendimento. " +
      "Exige desenvolvimento mental suficiente e ausência de doença mental grave.\n\n" +
      "CAUSAS DE EXCLUSÃO DA IMPUTABILIDADE (INIMPUTABILIDADE):\n\n" +
      "A) Menoridade (art. 27 CP):\n" +
      "Menores de 18 anos são penalmente inimputáveis. " +
      "Respondem pelo Estatuto da Criança e do Adolescente (ECA) — medidas socioeducativas.\n" +
      "Critério adotado: biológico/etário — não se avalia o desenvolvimento mental individual.\n\n" +
      "B) Doença mental (art. 26 CP):\n" +
      "É isento de pena quem, ao tempo da conduta, por doença mental ou desenvolvimento mental incompleto ou retardado, " +
      "era INTEIRAMENTE incapaz de entender o caráter ilícito do fato ou de determinar-se segundo esse entendimento.\n" +
      "Critério: biopsicológico (biológico + psicológico).\n" +
      "Consequência: medida de segurança (internação ou tratamento ambulatorial) — não pena.\n\n" +
      "C) Semi-imputabilidade (art. 26, §único CP):\n" +
      "Quando a doença mental reduz (mas não elimina) a capacidade de entendimento. " +
      "O juiz pode substituir a pena por medida de segurança OU reduzir a pena de 1/3 a 2/3.\n\n" +
      "D) Embriaguez completa acidental (art. 28, §1º CP):\n" +
      "Embriaguez proveniente de caso fortuito ou força maior que torna o agente inteiramente incapaz — " +
      "exclui a imputabilidade. ATENÇÃO: embriaguez voluntária ou culposa NÃO exclui.\n\n" +
      "ACTIO LIBERA IN CAUSA (embriaguez preordenada):\n" +
      "O agente se embriaga propositalmente para praticar o crime ou para ter 'coragem'. " +
      "A imputabilidade é aferida no momento em que o agente tinha livre-arbítrio (antes de se embriagar). " +
      "Consequência: não há exclusão da imputabilidade — o agente responde normalmente.\n\n" +
      "ELEMENTO 2 — POTENCIAL CONSCIÊNCIA DA ILICITUDE:\n" +
      "O agente deve ter a possibilidade de conhecer o caráter ilícito de sua conduta. " +
      "Não se exige conhecimento técnico da lei — basta a possibilidade de compreender que o ato é errado.\n\n" +
      "Erro de Proibição (art. 21 CP):\n" +
      "Invencível (inevitável): o agente não poderia conhecer a ilicitude mesmo com diligência normal. " +
      "Efeito: EXCLUI a culpabilidade.\n" +
      "Vencível (evitável): o agente poderia conhecer a ilicitude com maior cuidado. " +
      "Efeito: reduz a pena de 1/6 a 1/3.\n\n" +
      "ELEMENTO 3 — EXIGIBILIDADE DE CONDUTA DIVERSA:\n" +
      "Só é culpável quem podia agir diferente nas circunstâncias concretas.\n" +
      "Causas de exclusão:\n" +
      "  Coação moral irresistível (vis compulsiva): ameaça grave que elimina a liberdade de escolha.\n" +
      "  Obediência hierárquica: ordem de superior hierárquico não manifestamente ilegal.\n" +
      "  (A coação física absoluta — vis absoluta — exclui a conduta, não só a culpabilidade.)",
  },
  {
    id: "pen_tc_c06",
    title: "Iter Criminis e Tentativa — O Caminho do Crime",
    difficulty: "MEDIO",
    mnemonic:
      "CPEC: Cogitação → Preparação → Execução → Consumação. " +
      "COGITAÇÃO: nunca punível. PREPARAÇÃO: regra = não punível (exceção: crime autônomo). " +
      "EXECUÇÃO: tentativa punível. CONSUMAÇÃO: crime perfeito. " +
      "DESISTÊNCIA VOLUNTÁRIA e ARREPENDIMENTO EFICAZ: 'pontes de ouro' — respondem pelos atos já praticados.",
    keyPoint:
      "Iter criminis (caminho do crime):\n" +
      "• Cogitação: fase interna — nunca punível ('cogitationis poenam nemo patitur')\n" +
      "• Preparação: atos preparatórios — em regra não punível; exceção quando a lei tipifica autonomamente (ex: petrechos para falsificação)\n" +
      "• Execução: início dos atos de execução — tentativa punível (art. 14, II, CP)\n" +
      "• Consumação: todos os elementos do tipo estão realizados\n" +
      "Tentativa: redução de pena de 1/3 a 2/3 (art. 14, §único CP)\n" +
      "Desistência voluntária (art. 15 CP): abandona voluntariamente — responde pelos atos praticados\n" +
      "Arrependimento eficaz (art. 15 CP): age para impedir o resultado — responde pelos atos praticados\n" +
      "Crime impossível (art. 17 CP): absoluta ineficácia do meio ou absoluta impropriedade do objeto — impunível",
    practicalExample:
      "CESPE: 'A tentativa se configura quando o crime não se consuma por circunstâncias ALHEIAS à vontade do agente.' — CERTO (art. 14, II). " +
      "FGV: 'Desistência voluntária e arrependimento eficaz excluem a tentativa — o agente não responde por nada.' — ERRADO: responde pelos atos já praticados. " +
      "FCC: Crime impossível — agente tenta matar com açúcar pensando ser veneno — absoluta ineficácia do meio — não punível.",
    textContent:
      "O iter criminis é o caminho percorrido pelo agente desde a ideação do crime até sua consumação. " +
      "Compreender cada fase é essencial para identificar a punibilidade do agente.\n\n" +
      "FASE 1 — COGITAÇÃO:\n" +
      "É a fase puramente interna — o agente pensa, planeja e delibera sobre o crime. " +
      "Princípio: 'cogitationis poenam nemo patitur' — ninguém pode ser punido por seus pensamentos. " +
      "NUNCA punível, independentemente da gravidade do crime planejado.\n\n" +
      "FASE 2 — PREPARAÇÃO (ATOS PREPARATÓRIOS):\n" +
      "O agente exterioriza sua intenção, adquirindo meios ou criando condições para executar o crime. " +
      "Regra: não punível (não há início de execução do crime pretendido).\n" +
      "Exceção: quando o ato preparatório constitui crime autônomo tipificado em lei.\n" +
      "Exemplos de preparação tipificada autonomamente: quadrilha ou bando (hoje associação criminosa — art. 288 CP), " +
      "petrechos para falsificação de moeda (art. 291 CP), posse de entorpecentes (art. 28 Lei 11.343/06).\n\n" +
      "FASE 3 — EXECUÇÃO:\n" +
      "O agente inicia os atos de execução do crime. É a partir daqui que surge a tentativa punível. " +
      "A distinção entre preparação e execução é um dos temas mais controvertidos do Direito Penal.\n" +
      "Teorias para distinguir preparação de execução:\n" +
      "  Teoria objetiva (Frank): início da conduta descrita no tipo.\n" +
      "  Teoria subjetiva: intenção do agente de executar o crime.\n" +
      "  Teoria objetivo-individual (adotada no Brasil): atos que, segundo o plano do agente, " +
      "imediatamente precedem a conduta descrita no tipo.\n\n" +
      "TENTATIVA (art. 14, II, CP):\n" +
      "'Diz-se o crime: tentado, quando, iniciada a execução, não se consuma por circunstâncias alheias à vontade do agente.'\n" +
      "Requisitos: início de execução + não consumação + circunstância alheia à vontade.\n" +
      "Redução da pena: de 1/3 a 2/3 (art. 14, §único CP).\n" +
      "Crimes que não admitem tentativa: culposos, preterdolosos, omissivos próprios, habituais, " +
      "contravencionais e de mera conduta em regra.\n\n" +
      "FASE 4 — CONSUMAÇÃO:\n" +
      "Todos os elementos do tipo penal estão realizados. O crime está perfeito e acabado.\n\n" +
      "DESISTÊNCIA VOLUNTÁRIA E ARREPENDIMENTO EFICAZ (art. 15 CP — 'Pontes de Ouro'):\n" +
      "Desistência voluntária: o agente, podendo prosseguir, ABANDONA voluntariamente a execução.\n" +
      "Arrependimento eficaz: o agente já praticou todos os atos, mas AGE para impedir o resultado.\n" +
      "Efeito: excluem a tentativa — o agente responde APENAS pelos atos já praticados.\n" +
      "Distinção da tentativa: na tentativa, a não consumação é por causa ALHEIA; na desistência, " +
      "é por VONTADE do próprio agente.\n\n" +
      "ARREPENDIMENTO POSTERIOR (art. 16 CP):\n" +
      "O crime já foi consumado — o agente repara o dano ou restitui a coisa até o recebimento da denúncia. " +
      "Efeito: redução de pena de 1/3 a 2/3 (não exclui o crime).\n\n" +
      "CRIME IMPOSSÍVEL (art. 17 CP):\n" +
      "'Não se pune a tentativa quando, por ineficácia absoluta do meio ou por absoluta impropriedade do objeto, " +
      "é impossível consumar-se o crime.'\n" +
      "Exemplos: tentar matar com açúcar crendo ser veneno (absoluta ineficácia do meio); " +
      "atirar em cadáver crendo estar vivo (absoluta impropriedade do objeto).\n" +
      "A ineficácia/impropriedade deve ser ABSOLUTA — relativa não configura crime impossível.",
  },
];

// ─── QUESTÕES ─────────────────────────────────────────────────────────────────

const questions = [
  // ── Q01 — pen_tc_c01 — Múltipla Escolha ──
  {
    id: "pen_tc_q01",
    contentId: "pen_tc_c01",
    statement:
      "(CESPE/CEBRASPE — Adaptada) Segundo a teoria tripartida (analítica) do crime, " +
      "adotada majoritariamente pela doutrina brasileira e pelo STF, " +
      "assinale a alternativa que apresenta corretamente os três elementos do crime.",
    alternatives: [
      { letter: "A", text: "Fato típico, antijuridicidade e punibilidade." },
      { letter: "B", text: "Conduta, resultado e tipicidade." },
      { letter: "C", text: "Fato típico, ilicitude e culpabilidade." },
      { letter: "D", text: "Imputabilidade, consciência da ilicitude e exigibilidade de conduta diversa." },
      { letter: "E", text: "Dolo, culpa e preterdolo." },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "C = CORRETO: Teoria Tripartida — Crime = Fato Típico + Ilicitude (antijuridicidade) + Culpabilidade. " +
      "A = ERRADO: punibilidade não é elemento do crime — é consequência (teoria quadripartida minoritária). " +
      "B = ERRADO: conduta, resultado e tipicidade são elementos do FATO TÍPICO, não do crime como um todo. " +
      "D = ERRADO: imputabilidade, consciência e exigibilidade são elementos da CULPABILIDADE. " +
      "E = ERRADO: dolo, culpa e preterdolo são elementos subjetivos da conduta.",
    explanationCorrect:
      "Correto! Teoria Tripartida (TIC): Típico + Ilícito + Culpável = CRIME. " +
      "Fato Típico = conduta + resultado + nexo + tipicidade. " +
      "Ilicitude = ausência de excludentes (LD, EN, ECDU, ERD). " +
      "Culpabilidade = imputabilidade + potencial consciência + exigibilidade.",
    explanationWrong:
      "A teoria tripartida estrutura o crime em 3 substratos progressivos: " +
      "Fato Típico (adequação ao tipo), Ilicitude (contrariedade ao direito) e Culpabilidade (reprovabilidade). " +
      "Punibilidade é CONSEQUÊNCIA do crime, não elemento. " +
      "Dolo e culpa são elementos da conduta (1º substrato). " +
      "Imputabilidade integra a culpabilidade (3º substrato).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q02 — pen_tc_c01 — CERTO/ERRADO ──
  {
    id: "pen_tc_q02",
    contentId: "pen_tc_c01",
    statement:
      "(FGV — Adaptada) De acordo com a teoria bipartida do crime, defendida por parcela " +
      "da doutrina brasileira, a culpabilidade não integra o conceito de crime, " +
      "funcionando como pressuposto da aplicação da pena.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. A teoria bipartida (Damásio de Jesus, Mirabete) define crime como fato típico + ilícito. " +
      "A culpabilidade, nessa concepção, é pressuposto da pena — não do crime. " +
      "Assim, o inimputável pratica crime (fato típico e ilícito), mas não recebe pena — recebe medida de segurança. " +
      "A teoria tripartida (majoritária) inclui a culpabilidade no conceito de crime.",
    explanationCorrect:
      "Correto! A teoria bipartida separa crime (FT + ilicitude) de culpabilidade (pressuposto da pena). " +
      "Para os bipartidos, o inimputável pratica crime, mas não é punível — recebe medida de segurança. " +
      "Para os tripartidos, o inimputável não pratica crime (falta culpabilidade) — recebe medida de segurança.",
    explanationWrong:
      "O item está CERTO. A teoria bipartida (minoritária) retira a culpabilidade do conceito de crime. " +
      "Consequência prática: tanto para bipartidos quanto tripartidos, o inimputável recebe medida de segurança — " +
      "a diferença é terminológica (pratica ou não 'crime'). " +
      "Para concursos, a posição majoritária (tripartida) é a mais cobrada.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  // ── Q03 — pen_tc_c02 — Múltipla Escolha ──
  {
    id: "pen_tc_q03",
    contentId: "pen_tc_c02",
    statement:
      "(CESPE/CEBRASPE — Adaptada) 'A' desfere facada em 'B', causando ferimento não letal. " +
      "Durante o transporte ao hospital, a ambulância é atingida por outro veículo e 'B' morre " +
      "em razão do acidente, e não do ferimento. Com base no art. 13 do CP, qual a responsabilidade de 'A'?",
    alternatives: [
      {
        letter: "A",
        text: "Homicídio doloso consumado, pois 'A' deu início ao processo causal que resultou na morte.",
      },
      {
        letter: "B",
        text: "Homicídio culposo, pois a morte era previsível como consequência do transporte hospitalar.",
      },
      {
        letter: "C",
        text: "Lesão corporal dolosa, pois a causa superveniente relativamente independente (acidente) rompeu o nexo causal em relação à morte.",
      },
      {
        letter: "D",
        text: "Tentativa de homicídio, pois houve intenção de matar, independentemente da causa da morte.",
      },
      {
        letter: "E",
        text: "Nenhum crime, pois o resultado morte não foi causado pela conduta de 'A'.",
      },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "C = CORRETO: O acidente de ambulância é causa SUPERVENIENTE RELATIVAMENTE INDEPENDENTE " +
      "que POR SI SÓ produziu o resultado (morte), conforme art. 13, §1º, CP. " +
      "Essa causa rompe o nexo causal em relação à morte — 'A' responde apenas pela lesão corporal dolosa. " +
      "A = ERRADO: para o homicídio, seria necessário que a morte resultasse do ferimento, não de causa estranha. " +
      "D = ERRADO: tentativa de homicídio exigiria que 'A' tivesse agido com dolo de matar.",
    explanationCorrect:
      "Correto! Art. 13, §1º CP: causa superveniente relativamente independente que POR SI SÓ produziu o resultado = rompe o nexo. " +
      "O acidente de ambulância foi inesperado e saiu da linha normal de desdobramento da facada. " +
      "'A' responde pela lesão corporal (ato que efetivamente praticou), não pelo homicídio.",
    explanationWrong:
      "Regra: causa superveniente relativamente independente QUE POR SI SÓ produziu o resultado = rompe o nexo (art. 13, §1º). " +
      "O acidente de ambulância é causa estranha ao desdobramento natural da facada — estava fora da linha causal esperada. " +
      "Compare: se 'B' morresse de infecção pela ferida (causa dentro do desdobramento normal), 'A' responderia por homicídio.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q04 — pen_tc_c02 — CERTO/ERRADO ──
  {
    id: "pen_tc_q04",
    contentId: "pen_tc_c02",
    statement:
      "(FCC — Adaptada) Segundo o art. 13, §1º, do Código Penal, as causas preexistentes " +
      "e as causas concomitantes relativamente independentes também rompem o nexo causal, " +
      "afastando a imputação do resultado ao agente, da mesma forma que ocorre com as " +
      "causas supervenientes relativamente independentes.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. O art. 13, §1º, CP trata APENAS das causas SUPERVENIENTES relativamente independentes " +
      "que por si só produziram o resultado — e apenas essas rompem o nexo. " +
      "Causas PREEXISTENTES (ex.: hemofilia da vítima) e CONCOMITANTES relativamente independentes " +
      "NÃO rompem o nexo causal — o agente responde pelo resultado integral. " +
      "São as chamadas condições pessoais ou circunstâncias existentes antes ou durante a conduta.",
    explanationCorrect:
      "Correto! O item está ERRADO. Apenas causas SUPERVENIENTES relativamente independentes " +
      "que por si só produziram o resultado rompem o nexo. " +
      "Preexistentes e concomitantes: NÃO rompem. " +
      "Hemofílico que morre de hemorragia por facada leve: causa preexistente — agente responde por homicídio.",
    explanationWrong:
      "O item está ERRADO. Distinção fundamental do art. 13 CP:\n" +
      "Causa superveniente relativamente independente que por si só produziu o resultado: ROMPE o nexo.\n" +
      "Causa preexistente relativamente independente: NÃO rompe (hemofilia, cardiopatia pré-existente).\n" +
      "Causa concomitante relativamente independente: NÃO rompe.\n" +
      "O agente que dispara em vítima hemofílica responde por homicídio — a condição preexistente não o exonera.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  // ── Q05 — pen_tc_c03 — Múltipla Escolha ──
  {
    id: "pen_tc_q05",
    contentId: "pen_tc_c03",
    statement:
      "(CESPE/CEBRASPE — Adaptada) Dois amigos disputam racha de automóveis em via pública. " +
      "Ambos sabem do risco de atropelar pedestres, mas continuam a corrida. " +
      "Um pedestre é atropelado e morre. Qual o elemento subjetivo que melhor caracteriza a conduta dos racistas?",
    alternatives: [
      { letter: "A", text: "Culpa inconsciente, pois não previram o resultado morte." },
      {
        letter: "B",
        text: "Culpa consciente, pois previram o resultado mas acreditavam na própria habilidade para evitá-lo.",
      },
      {
        letter: "C",
        text: "Dolo eventual, pois previram o resultado como possível e assumiram o risco de produzi-lo.",
      },
      { letter: "D", text: "Dolo direto de 1º grau, pois queriam matar o pedestre." },
      {
        letter: "E",
        text: "Preterdolo, pois a conduta foi dolosa mas o resultado morte foi culposo.",
      },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "C = CORRETO: O STF consolidou que racha automobilístico com resultado morte configura DOLO EVENTUAL. " +
      "Os agentes previram a morte como resultado possível e assumiram o risco — " +
      "internamente adotaram postura de 'tanto faz, dane-se'. " +
      "B = ERRADO: culpa consciente exigiria que ACREDITASSEM na não ocorrência do resultado — " +
      "quem disputa racha não pode genuinamente confiar que nada vai acontecer. " +
      "D = ERRADO: dolo direto exigiria que QUISESSEM matar — não é o caso.",
    explanationCorrect:
      "Correto! STF (RHC 117.076 e outros): racha = dolo eventual. " +
      "Os racistas preveem o risco de morte e continuam — isso é ASSUMIR o risco (art. 18, I, CP, parte final). " +
      "Dolo eventual ≠ culpa consciente: no dolo eventual o agente aceita o resultado; na culpa consciente, rejeita.",
    explanationWrong:
      "A chave: CULPA CONSCIENTE = prevê + confia que NÃO vai ocorrer. DOLO EVENTUAL = prevê + assume que PODE ocorrer. " +
      "Quem disputa racha em via pública não pode, racionalmente, confiar que não atropelará ninguém — " +
      "o STF entende que há assunção do risco = dolo eventual. " +
      "Responde por homicídio doloso (Júri), não culposo (juiz singular).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q06 — pen_tc_c03 — CERTO/ERRADO ──
  {
    id: "pen_tc_q06",
    contentId: "pen_tc_c03",
    statement:
      "(FGV — Adaptada) No dolo eventual, o agente quer diretamente o resultado lesivo, " +
      "razão pela qual recebe o mesmo tratamento jurídico do dolo direto de 1º grau, " +
      "sendo equiparado a este para fins de responsabilização penal.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. No dolo eventual, o agente NÃO quer diretamente o resultado — ele apenas ASSUME o risco de produzi-lo. " +
      "Querer diretamente = dolo direto de 1º grau. Assumir o risco = dolo eventual. " +
      "Embora ambos sejam chamados de dolo e recebam tratamento semelhante (crime doloso), " +
      "eles diferem no elemento volitivo: no direto há vontade dirigida ao resultado; no eventual há apenas assunção do risco.",
    explanationCorrect:
      "Correto! O item está ERRADO. Dolo eventual: o agente prevê o resultado como possível e ASSUME o risco, " +
      "mas NÃO o quer diretamente. " +
      "Dolo direto: o agente QUER o resultado. " +
      "Ambos são 'dolo' para fins de responsabilização penal (crime doloso), mas o elemento volitivo é diferente.",
    explanationWrong:
      "O item está ERRADO. Distinção essencial:\n" +
      "Dolo direto 1º grau: agente QUER o resultado diretamente (vontade plena).\n" +
      "Dolo eventual: agente ASSUME o risco de produzi-lo (vontade condicionada).\n" +
      "Fórmula de Frank para dolo eventual: 'seja como for, aconteça ou não o resultado, não mudo minha conduta.'\n" +
      "Para fins penais, ambos geram crime doloso — a distinção importa para dosimetria e competência do júri.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  // ── Q07 — pen_tc_c04 — Múltipla Escolha ──
  {
    id: "pen_tc_q07",
    contentId: "pen_tc_c04",
    statement:
      "(FCC — Adaptada) Sobre as excludentes de ilicitude previstas no art. 23 do CP, " +
      "assinale a alternativa que contém TODOS os requisitos da legítima defesa.",
    alternatives: [
      {
        letter: "A",
        text: "Perigo atual, não provocado voluntariamente, inevitável por outro meio e proporcionalidade.",
      },
      {
        letter: "B",
        text: "Agressão injusta atual ou iminente, uso moderado dos meios necessários e proteção de direito próprio ou alheio.",
      },
      {
        letter: "C",
        text: "Ordem de superior hierárquico, agressão injusta e uso proporcional da força.",
      },
      {
        letter: "D",
        text: "Agressão injusta futura, meios necessários e proteção de bem jurídico relevante.",
      },
      {
        letter: "E",
        text: "Perigo iminente, uso moderado e consentimento da vítima.",
      },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "B = CORRETO: Art. 25 CP — legítima defesa exige: agressão INJUSTA (atual ou iminente) + " +
      "uso MODERADO dos meios NECESSÁRIOS + proteção de direito PRÓPRIO ou ALHEIO. " +
      "A = ERRADO: são os requisitos do ESTADO DE NECESSIDADE (art. 24 CP), não da LD. " +
      "C = ERRADO: obediência hierárquica é causa de exclusão da CULPABILIDADE, não da ilicitude. " +
      "D = ERRADO: agressão FUTURA (não atual ou iminente) não autoriza LD — seria vingança.",
    explanationCorrect:
      "Correto! Legítima Defesa (art. 25 CP): " +
      "(1) Agressão injusta — atual ou iminente; " +
      "(2) Meios necessários — o menos gravoso disponível para repelir; " +
      "(3) Uso moderado — proporcional à agressão; " +
      "(4) Direito próprio ou alheio — pode defender terceiro. " +
      "Compare com EN: EN protege de PERIGO (não de agressão injusta).",
    explanationWrong:
      "Não confunda Legítima Defesa com Estado de Necessidade:\n" +
      "LD: reage a AGRESSÃO INJUSTA (de pessoa) — atual ou iminente — com MODERAÇÃO.\n" +
      "EN: reage a PERIGO (pode vir de animal, natureza ou pessoa) — atual — inevitável.\n" +
      "Agressão FUTURA não autoriza LD (seria vingança ou crime preventivo).\n" +
      "Obediência hierárquica exclui CULPABILIDADE, não ilicitude.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q08 — pen_tc_c04 — CERTO/ERRADO ──
  {
    id: "pen_tc_q08",
    contentId: "pen_tc_c04",
    statement:
      "(STF — Adaptada) A tese da legítima defesa da honra, historicamente utilizada como " +
      "estratégia de defesa em casos de feminicídio, foi reconhecida pelo STF como compatível " +
      "com a Constituição Federal, por encontrar amparo na excludente de ilicitude prevista " +
      "no art. 23 do Código Penal.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. Na ADPF 779 (julgada em 2021), o STF declarou a tese da 'legítima defesa da honra' " +
      "INCONSTITUCIONAL, por violar a dignidade da pessoa humana, a igualdade e a vedação à discriminação. " +
      "Essa tese não tem amparo jurídico — honra não é bem jurídico que autorize a matar. " +
      "O STF proibiu que defesa técnica, juízes e promotores utilizem essa tese em plenário do júri.",
    explanationCorrect:
      "Correto! O item está ERRADO. STF, ADPF 779 (2021): " +
      "'A legítima defesa da honra é recurso argumentativo/retórico inconstitucional.' " +
      "O STF vedou o uso dessa tese porque instrumentaliza o feminicídio e viola a isonomia de gênero. " +
      "Juízes devem dissolver imediatamente o conselho de sentença se a tese for usada.",
    explanationWrong:
      "O item está ERRADO. STF ADPF 779/2021 foi um marco histórico:\n" +
      "A tese da 'legítima defesa da honra' foi declarada INCONSTITUCIONAL.\n" +
      "Fundamentos: viola a dignidade da pessoa humana (art. 1º, III, CF), " +
      "a igualdade de gênero (art. 5º, I, CF) e a vedação à discriminação.\n" +
      "Honra não é bem jurídico que autorize o homicídio.\n" +
      "A decisão vincula advogados de defesa, MP, juízes e jurados no tribunal do júri.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  // ── Q09 — pen_tc_c05 — Múltipla Escolha ──
  {
    id: "pen_tc_q09",
    contentId: "pen_tc_c05",
    statement:
      "(CESPE/CEBRASPE — Adaptada) Sobre a culpabilidade e seus elementos, " +
      "assinale a alternativa CORRETA.",
    alternatives: [
      {
        letter: "A",
        text: "A embriaguez voluntária completa exclui a imputabilidade do agente, pois afasta sua capacidade de compreender o caráter ilícito do fato.",
      },
      {
        letter: "B",
        text: "O erro de proibição invencível reduz a pena de 1/6 a 1/3, sem excluir a culpabilidade do agente.",
      },
      {
        letter: "C",
        text: "A coação moral irresistível exclui a exigibilidade de conduta diversa, sendo causa de exclusão da culpabilidade.",
      },
      {
        letter: "D",
        text: "O menor de 18 anos é inimputável e, portanto, isento de qualquer consequência jurídica por atos infracionais.",
      },
      {
        letter: "E",
        text: "A semi-imputabilidade decorrente de doença mental implica necessariamente absolvição do réu.",
      },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "C = CORRETO: coação moral irresistível exclui a exigibilidade de conduta diversa (art. 22 CP) — " +
      "é causa de exclusão da culpabilidade. " +
      "A = ERRADO: embriaguez voluntária NÃO exclui imputabilidade (reforma de 1984 do CP). " +
      "B = ERRADO: erro de proibição INVENCÍVEL EXCLUI a culpabilidade; o vencível é que reduz a pena. " +
      "D = ERRADO: menor inimputável responde perante o ECA — aplica-se medida socioeducativa. " +
      "E = ERRADO: semi-imputável pode ter pena REDUZIDA ou ser substituída por medida de segurança — não necessariamente absolvido.",
    explanationCorrect:
      "Correto! Coação moral irresistível (vis compulsiva): elimina a liberdade de escolha do agente — " +
      "não se pode exigir conduta diversa de quem age sob ameaça grave e irresistível. " +
      "Exclui a culpabilidade (exigibilidade de conduta diversa) — o coagido não é punido; o coator, sim.",
    explanationWrong:
      "Pontos críticos da culpabilidade:\n" +
      "Embriaguez voluntária: NÃO exclui imputabilidade (art. 28 CP). Só exclui se acidental (caso fortuito/FM).\n" +
      "Erro proibição INVENCÍVEL: exclui culpabilidade. VENCÍVEL: reduz pena (art. 21 CP).\n" +
      "Semi-imputável: redução de pena OU medida de segurança — não é absolvição.\n" +
      "Menor de 18: inimputável pelo CP, mas responde pelo ECA (medidas socioeducativas).",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q10 — pen_tc_c05 — CERTO/ERRADO ──
  {
    id: "pen_tc_q10",
    contentId: "pen_tc_c05",
    statement:
      "(FGV — Adaptada) A embriaguez voluntária e completa, nos termos do art. 28 do " +
      "Código Penal, exclui a imputabilidade do agente, de modo que aquele que pratica " +
      "crime em estado de embriaguez total decorrente de consumo voluntário de álcool " +
      "não pode ser responsabilizado penalmente.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. O art. 28, II, CP é expresso: 'não excluem a imputabilidade penal: a embriaguez, " +
      "voluntária ou culposa, pelo álcool ou substância de efeitos análogos.' " +
      "A reforma de 1984 eliminou a antiga previsão que excluía a imputabilidade do ébrio completo voluntário. " +
      "Apenas a embriaguez acidental (caso fortuito ou força maior) completa exclui a imputabilidade.",
    explanationCorrect:
      "Correto! O item está ERRADO. Art. 28 CP: embriaguez voluntária ou culposa = NÃO exclui imputabilidade. " +
      "O agente que bebe voluntariamente e depois comete crime responde penalmente. " +
      "Exceção: embriaguez acidental completa (caso fortuito/força maior) exclui imputabilidade (art. 28, §1º CP).",
    explanationWrong:
      "O item está ERRADO. Art. 28, II, CP: embriaguez voluntária NÃO exclui imputabilidade. " +
      "Tabela do art. 28:\n" +
      "Embriaguez voluntária/culposa: NÃO exclui, NÃO reduz pena.\n" +
      "Embriaguez preordenada (actio libera in causa): NÃO exclui e é agravante.\n" +
      "Embriaguez acidental completa (caso fortuito/FM): EXCLUI imputabilidade (§1º).\n" +
      "Embriaguez acidental incompleta: REDUZ pena de 1/3 a 2/3 (§2º).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  // ── Q11 — pen_tc_c06 — Múltipla Escolha ──
  {
    id: "pen_tc_q11",
    contentId: "pen_tc_c06",
    statement:
      "(FCC — Adaptada) 'A' decide matar 'B'. Compra uma faca (ato preparatório) e vai à casa de 'B'. " +
      "Ao levantar a faca para desferir o golpe, 'C' (vizinho) intervém e imobiliza 'A', impedindo o golpe. " +
      "Com base no iter criminis, qual o estágio em que a conduta de 'A' foi interrompida " +
      "e qual crime praticou?",
    alternatives: [
      {
        letter: "A",
        text: "Preparação — 'A' não praticou crime, pois a execução não foi iniciada.",
      },
      {
        letter: "B",
        text: "Execução — 'A' praticou tentativa de homicídio, pois iniciou os atos de execução e não consumou por circunstância alheia à sua vontade.",
      },
      {
        letter: "C",
        text: "Consumação — 'A' praticou homicídio consumado por dolo direto.",
      },
      {
        letter: "D",
        text: "Preparação — 'A' praticou lesão corporal por ter portado a faca.",
      },
      {
        letter: "E",
        text: "Execução — 'A' praticou desistência voluntária ao ser imobilizado por 'C'.",
      },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "B = CORRETO: ao levantar a faca para desferir o golpe, 'A' iniciou os ATOS DE EXECUÇÃO. " +
      "A interrupção por 'C' é circunstância ALHEIA à vontade de 'A' — configura TENTATIVA de homicídio (art. 14, II, CP). " +
      "A = ERRADO: comprar a faca é preparação (não punível autonomamente), mas levantar para golpear JÁ é execução. " +
      "E = ERRADO: desistência voluntária pressupõe que o agente VOLUNTARIAMENTE abandone — ser imobilizado por terceiro não é voluntário.",
    explanationCorrect:
      "Correto! Iter criminis: Cogitação → Preparação → Execução → Consumação. " +
      "Levantar a faca para golpear = ato de execução (início do tipo 'matar alguém'). " +
      "Interrupção por terceiro = circunstância alheia à vontade = TENTATIVA. " +
      "Pena: homicídio tentado com redução de 1/3 a 2/3.",
    explanationWrong:
      "Distingua: PREPARAÇÃO (comprar a faca, ir ao local) vs. EXECUÇÃO (levantar o braço para golpear). " +
      "A execução começa com o ato imediatamente anterior à conduta descrita no tipo. " +
      "Ser imobilizado = causa alheia = TENTATIVA (não desistência voluntária). " +
      "Desistência voluntária = o próprio agente para, podendo continuar.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q12 — pen_tc_c06 — CERTO/ERRADO ──
  {
    id: "pen_tc_q12",
    contentId: "pen_tc_c06",
    statement:
      "(CESPE/CEBRASPE — Adaptada) Nos casos de desistência voluntária e arrependimento eficaz, " +
      "previstos no art. 15 do CP, o agente não responde por nenhum crime, pois tais institutos " +
      "excluem completamente a ilicitude da conduta praticada.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. A desistência voluntária e o arrependimento eficaz NÃO excluem a ilicitude. " +
      "Eles afastam a tentativa e a punição pelo crime que o agente pretendia consumar, " +
      "mas o agente RESPONDE PELOS ATOS JÁ PRATICADOS. " +
      "Art. 15 CP: 'O agente que, voluntariamente, desiste de prosseguir na execução ou impede que o resultado se produza, " +
      "só responde pelos atos já praticados.' " +
      "Ex.: 'A' esfaqueia 'B' e se arrepende, levando-o ao hospital. Responde pela lesão corporal.",
    explanationCorrect:
      "Correto! O item está ERRADO. Desistência voluntária e arrependimento eficaz = 'pontes de ouro'. " +
      "Efeito: afasta a tentativa do crime pretendido. " +
      "MAS o agente responde pelos atos já praticados. " +
      "Se apenas arranhou 'B' antes de desistir = lesão corporal leve. " +
      "Não há absolvição total.",
    explanationWrong:
      "O item está ERRADO. Art. 15 CP — 'pontes de ouro':\n" +
      "Desistência voluntária: abandona voluntariamente a execução (ainda podendo continuar).\n" +
      "Arrependimento eficaz: após praticar todos os atos, age para impedir o resultado.\n" +
      "EFEITO: afasta a tentativa do crime-fim; o agente responde APENAS pelos atos já praticados.\n" +
      "Compare com arrependimento posterior (art. 16 CP): crime consumado + repara dano = reduz pena (não exclui crime).",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
];

// ─── RUNNER ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Seed R33 — Direito Penal: Teoria do Crime ===\n");

  // 1. Resolver Subject
  const subjectRows = (await db.execute(sql`
    SELECT id FROM "Subject"
    WHERE name ILIKE '%Direito Penal%'
       OR name ILIKE '%Penal%'
    ORDER BY name
    LIMIT 1
  `)) as any[];

  if (!subjectRows[0]) {
    throw new Error('Subject com "Penal" não encontrado. Verifique o banco.');
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

  console.log("\n=== R33 concluído: 6 átomos + 12 questões de Teoria do Crime ===");
  process.exit(0);
}

main().catch((err) => {
  console.error("ERRO no seed R33:", err);
  process.exit(1);
});
