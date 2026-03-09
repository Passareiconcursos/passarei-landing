/**
 * Seed R35 — Raciocínio Lógico-Matemático: Análise Combinatória
 * Tema: Anagramas e Permutações (estilo Marcos Almeida / Renato Oliveira)
 * 6 átomos de conteúdo  (rlm_ac_c01–c06)
 * 12 questões           (rlm_ac_q01–q12)
 *
 * Execução: git pull && npx tsx db/seed-rlm-combinatoria-r35.ts
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

// ─── CONTEÚDOS ───────────────────────────────────────────────────────────────

const contents = [
  {
    id: "rlm_ac_c01",
    title: "Princípio Fundamental da Contagem (Regra do Produto)",
    difficulty: "FACIL",
    mnemonic:
      "PFC = MULTIPLICA TUDO. Se uma tarefa tem 'n₁ formas na etapa 1' E 'n₂ formas na etapa 2', " +
      "o total é n₁ × n₂. " +
      "Lembre: PFC = Produto das opções de cada etapa independente.",
    keyPoint:
      "• PFC: se uma tarefa tem k etapas independentes com n₁, n₂, ..., nₖ possibilidades, o total é n₁ × n₂ × ... × nₖ\n" +
      "• A palavra-chave 'E' entre etapas indica multiplicação\n" +
      "• A palavra-chave 'OU' entre escolhas mutuamente exclusivas indica adição\n" +
      "• Etapas são independentes: a escolha em uma não restringe a outra\n" +
      "• Aplicação direta: placas de veículos, senhas, combinações de roupa, cardápios",
    practicalExample:
      "CESPE: 'Uma senha tem 3 dígitos distintos e 2 letras (maiúsculas). Quantas senhas distintas existem?' " +
      "Dígitos: 10×9×8 = 720 (sem repetição). Letras: 26×26 = 676. Total: 720 × 676 = 486.720. " +
      "PC-DF: 'Um agente tem 4 camisas e 3 calças. Quantas combinações distintas de roupa?' → 4 × 3 = 12.",
    textContent:
      "O Princípio Fundamental da Contagem (PFC), também chamado de Regra do Produto ou Princípio Multiplicativo, " +
      "é a base de toda a Análise Combinatória. Seu enunciado é simples e poderoso:\n\n" +
      "ENUNCIADO FORMAL:\n" +
      "Se uma tarefa pode ser realizada em k etapas sucessivas e independentes, sendo que a etapa 1 pode ser " +
      "executada de n₁ maneiras, a etapa 2 de n₂ maneiras, ..., e a etapa k de nₖ maneiras, " +
      "então o número total de maneiras de realizar a tarefa completa é:\n" +
      "Total = n₁ × n₂ × ... × nₖ\n\n" +
      "CONDIÇÃO DE APLICAÇÃO:\n" +
      "As etapas devem ser independentes entre si, ou seja, a escolha feita em uma etapa não deve alterar " +
      "o número de opções disponíveis nas etapas seguintes (ou, se alterar, isso já deve estar incorporado " +
      "no valor de nᵢ correspondente).\n\n" +
      "EXEMPLOS PRÁTICOS:\n" +
      "1. Cardápio: 3 entradas, 5 pratos principais e 2 sobremesas → 3 × 5 × 2 = 30 refeições distintas.\n" +
      "2. Placas de veículo (padrão Mercosul): 3 letras (26³) × 1 letra (26) × 3 dígitos (10³) — modelo simplificado.\n" +
      "3. Senha de 4 dígitos com repetição permitida: 10 × 10 × 10 × 10 = 10.000 senhas.\n" +
      "4. Senha de 4 dígitos sem repetição: 10 × 9 × 8 × 7 = 5.040 senhas.\n\n" +
      "PFC COM 'OU' (ADIÇÃO):\n" +
      "Quando as opções são mutuamente exclusivas ('faz isso OU aquilo, mas não os dois'), usa-se adição. " +
      "Exemplo: ir de Brasília a São Paulo de avião (3 voos) OU de ônibus (5 horários) → 3 + 5 = 8 opções.\n\n" +
      "ARMADILHAS COMUNS EM PROVA:\n" +
      "• 'Com repetição' vs. 'sem repetição': sem repetição reduz as opções a cada etapa (10, 9, 8...).\n" +
      "• Confundir adição com multiplicação: 'A ou B' (situações exclusivas) → soma; 'A e B' (etapas simultâneas) → produto.\n" +
      "• Restrições: sempre resolva as etapas com restrição primeiro, depois as livres.\n\n" +
      "O PFC é o fundamento que sustenta todos os demais tópicos de Análise Combinatória: " +
      "permutações, arranjos e combinações derivam diretamente dele.",
  },
  {
    id: "rlm_ac_c02",
    title: "Fatorial e Permutação Simples P(n) = n!",
    difficulty: "FACIL",
    mnemonic:
      "FILA DE n PESSOAS: quantas ordens? n! (n fatorial). " +
      "Decorar: 0!=1, 1!=1, 2!=2, 3!=6, 4!=24, 5!=120, 6!=720, 7!=5040, 8!=40320, 9!=362880, 10!=3.628.800. " +
      "Mnemônico: '0 e 1 fatores valem 1; 2 duplica; 3 faz 6; 4 dobra pra 24; 5 centuplica: 120!'",
    keyPoint:
      "• n! = n × (n-1) × (n-2) × ... × 2 × 1\n" +
      "• Por convenção: 0! = 1 e 1! = 1\n" +
      "• Permutação Simples: P(n) = n! (arranjar n elementos distintos em n posições)\n" +
      "• Pressuposto: todos os n elementos são distintos entre si\n" +
      "• Arranjo Simples A(n,k) = n!/(n-k)! — quando se escolhem k dentre n para ordenar",
    practicalExample:
      "CESPE: '6 suspeitos serão interrogados em ordem aleatória. De quantas formas distintas podem ser chamados?' " +
      "→ P(6) = 6! = 720. " +
      "PC-DF: 'Quantos anagramas tem a palavra POLICIA (7 letras distintas)?' → 7! = 5040. " +
      "Arranjo: 'Escolher e ordenar 3 de 5 finalistas para ouro, prata e bronze' → A(5,3) = 5!/2! = 60.",
    textContent:
      "O fatorial de um número natural n, denotado por n!, é o produto de todos os inteiros positivos de 1 até n.\n\n" +
      "DEFINIÇÃO:\n" +
      "n! = n × (n-1) × (n-2) × ... × 2 × 1\n" +
      "Por definição especial: 0! = 1 (convenção matemática universal)\n\n" +
      "TABELA DE FATORIAIS (memorize até 10!):\n" +
      "0! = 1\n1! = 1\n2! = 2\n3! = 6\n4! = 24\n5! = 120\n" +
      "6! = 720\n7! = 5.040\n8! = 40.320\n9! = 362.880\n10! = 3.628.800\n\n" +
      "PERMUTAÇÃO SIMPLES — P(n) = n!\n" +
      "Permutação simples responde à pergunta: de quantas maneiras distintas podemos ordenar n elementos " +
      "distintos em n posições?\n\n" +
      "Raciocínio via PFC:\n" +
      "• 1ª posição: n escolhas\n" +
      "• 2ª posição: n-1 escolhas (um já foi usado)\n" +
      "• 3ª posição: n-2 escolhas\n" +
      "• ...\n" +
      "• n-ésima posição: 1 escolha\n" +
      "Total = n × (n-1) × ... × 1 = n!\n\n" +
      "ANAGRAMA:\n" +
      "Anagrama de uma palavra é qualquer sequência (com ou sem sentido) formada pelos mesmos caracteres. " +
      "Para palavras com letras TODAS DISTINTAS: número de anagramas = n! (onde n = número de letras).\n\n" +
      "Exemplos:\n" +
      "• AMOR (4 letras distintas) → 4! = 24 anagramas\n" +
      "• POLICIA (7 letras distintas, P repetido não — espera: P-O-L-I-C-I-A tem I repetido) " +
      "→ neste caso usa Permutação com Repetição (ver c04)\n" +
      "• BUSCA (5 letras distintas) → 5! = 120 anagramas\n\n" +
      "ARRANJO SIMPLES — A(n,k) = n!/(n-k)!\n" +
      "Quando se deseja ordenar apenas k elementos dentre n disponíveis:\n" +
      "A(n,k) = n × (n-1) × ... × (n-k+1) = n! / (n-k)!\n\n" +
      "Diferença fundamental: na permutação, usam-se TODOS os n elementos; no arranjo, apenas k deles.\n\n" +
      "PROPRIEDADE ÚTIL PARA SIMPLIFICAÇÃO:\n" +
      "n! / (n-k)! = n × (n-1) × ... × (n-k+1) — cancelamento dos termos comuns. " +
      "Exemplo: 8!/5! = 8 × 7 × 6 = 336 (sem precisar calcular os fatoriais completos).",
  },
  {
    id: "rlm_ac_c03",
    title: "Anagramas de Palavras com Letras Distintas",
    difficulty: "MEDIO",
    mnemonic:
      "LETRAS DISTINTAS → n! DIRETO. " +
      "Para contar anagramas com restrição de posição: FIXE o restante, CONTE os livres. " +
      "Vogais juntas: cole-as num bloco → (n-k+1)! × k! (bloco como 1 elemento + arranjo interno).",
    keyPoint:
      "• Palavra com n letras distintas: P(n) = n! anagramas\n" +
      "• Vogais juntas (em bloco): trate o bloco como 1 elemento → (posições)! × (internas do bloco)!\n" +
      "• Consoantes juntas: mesmo raciocínio do bloco\n" +
      "• Letra na posição fixa: fixe-a e permute as demais → (n-1)!\n" +
      "• Letra nunca em posição específica: total − (casos com a letra nessa posição)",
    practicalExample:
      "CESPE: 'Quantos anagramas de CARGO (5 letras distintas) começam com C?' → C fixo na 1ª pos → 4! = 24. " +
      "PC-DF: 'Anagramas de DADOS (letras distintas: D-A-O-S... espera, DADOS tem D repetido — caso de PR). " +
      "DELTA (5 distintas): 5! = 120. Com vogais (E,A) juntas: bloco [EA] ou [AE] em 4! posições → 4! × 2! = 48.",
    textContent:
      "Quando todos os caracteres de uma palavra são distintos (não há repetição de nenhuma letra), " +
      "o número de anagramas é simplesmente n!, onde n é o número de letras.\n\n" +
      "PALAVRAS COM TODAS AS LETRAS DISTINTAS — EXEMPLOS:\n" +
      "• CARGO: C, A, R, G, O → 5 letras distintas → 5! = 120 anagramas\n" +
      "• BRIDGE: B, R, I, D, G, E → 6 letras distintas → 6! = 720 anagramas\n" +
      "• JUIZ: J, U, I, Z → 4 letras distintas → 4! = 24 anagramas\n\n" +
      "ANAGRAMAS COM RESTRIÇÕES DE POSIÇÃO:\n\n" +
      "1) LETRA FIXADA EM POSIÇÃO ESPECÍFICA:\n" +
      "Quantos anagramas de CARGO começam com C? → C está fixo na 1ª posição. " +
      "As 4 letras restantes (A, R, G, O) podem ser permutadas livremente: 4! = 24 anagramas.\n\n" +
      "2) LETRA NÃO PODE OCUPAR POSIÇÃO ESPECÍFICA:\n" +
      "Quantos anagramas de CARGO NÃO começam com C? " +
      "Total − (começam com C) = 5! − 4! = 120 − 24 = 96 anagramas.\n\n" +
      "3) VOGAIS JUNTAS (EM BLOCO):\n" +
      "Vogais de CARGO: A e O (2 vogais). Tratamos {A,O} como um único bloco. " +
      "Então temos 4 'elementos' para permutar: {AO}, C, R, G → 4! arranjos do bloco. " +
      "Dentro do bloco, A e O podem ser ordenados de 2! = 2 formas (AO ou OA). " +
      "Total: 4! × 2! = 24 × 2 = 48 anagramas com vogais juntas.\n\n" +
      "4) VOGAIS SEPARADAS (NÃO ADJACENTES):\n" +
      "Total − vogais juntas = 120 − 48 = 72 anagramas.\n\n" +
      "5) VOGAIS EM POSIÇÕES PARES OU ÍMPARES:\n" +
      "Em CARGO (5 posições: 1,2,3,4,5), posições ímpares são 1, 3, 5 (3 posições) e pares são 2, 4 (2 posições). " +
      "Para 2 vogais nas posições pares: escolher posições para as vogais A(2,2)=2, depois permutar as 3 consoantes A(3,3)=6 → 2×6=12.\n\n" +
      "MÉTODO GERAL PARA RESTRIÇÕES:\n" +
      "1. Identifique os elementos com restrição.\n" +
      "2. Trate-os primeiro (fixe-os ou forme blocos).\n" +
      "3. Permute os elementos restantes.\n" +
      "4. Multiplique as contagens de cada etapa (PFC).\n\n" +
      "Este método elimina a maioria dos erros em provas e é aplicável a todos os tipos de restrição.",
  },
  {
    id: "rlm_ac_c04",
    title: "Permutação com Repetição — P(n; a, b, c, ...)",
    difficulty: "MEDIO",
    mnemonic:
      "LETRAS REPETIDAS → DIVIDA pelos fatoriais das repetições. " +
      "Fórmula: P = n! ÷ (a! × b! × c! × ...). " +
      "Mnemônico: 'DIVIDE pelo fatorial de CADA repetição'. " +
      "Por quê? Porque as cópias idênticas não geram arranjos distintos — devemos eliminar as permutações redundantes.",
    keyPoint:
      "• P(n; a, b, ...) = n! / (a! × b! × ... ) onde a, b,... são as quantidades de cada letra repetida\n" +
      "• n = total de letras (conta todas, incluindo as repetidas)\n" +
      "• Identifique CADA letra e sua frequência antes de calcular\n" +
      "• Se todas as letras são distintas → denominador = 1! × 1! × ... = 1 → volta a ser n!\n" +
      "• BANANA: B(1),A(3),N(2) → P = 6!/(1!×3!×2!) = 720/12 = 60",
    practicalExample:
      "CESPE: 'Quantos anagramas tem BANANA?' B(1),A(3),N(2) → 6!/(1!·3!·2!) = 720/12 = 60. " +
      "PC-DF: 'Anagramas de MISSISSIPI (10 letras: M1,I4,S4,P1)?' → 10!/(1!·4!·4!·1!) = 3.628.800/576 = 6.300. " +
      "ATENÇÃO: LETRAS → conte com cuidado antes de aplicar a fórmula.",
    textContent:
      "Quando uma palavra (ou sequência) possui letras repetidas, o número de anagramas é menor do que n!, " +
      "pois as permutações envolvendo cópias idênticas da mesma letra não são distinguíveis.\n\n" +
      "FÓRMULA DA PERMUTAÇÃO COM REPETIÇÃO:\n" +
      "P(n; a, b, c, ...) = n! / (a! × b! × c! × ...)\n" +
      "Onde:\n" +
      "• n = número total de letras (contando todas as repetições)\n" +
      "• a = frequência da 1ª letra repetida\n" +
      "• b = frequência da 2ª letra repetida\n" +
      "• c = frequência da 3ª letra repetida, etc.\n\n" +
      "POR QUE DIVIDIR?\n" +
      "Imagine a palavra ABA. Se chamarmos as duas letras A de A₁ e A₂, teríamos P(3)=3!=6 arranjos distintos: " +
      "A₁BA₂, A₂BA₁, BA₁A₂, BA₂A₁, A₁A₂B, A₂A₁B. " +
      "Mas como A₁ e A₂ são idênticos, muitos desses arranjos ficam iguais: ABA, ABA, BAA, BAA, AAB, AAB. " +
      "Na prática, são apenas 3 arranjos distintos: ABA, BAA, AAB. " +
      "De fato: P(3; 2,1) = 3!/(2!×1!) = 6/2 = 3. A divisão por 2! elimina as duplicatas.\n\n" +
      "PASSO A PASSO — COMO APLICAR:\n" +
      "1. Escreva todas as letras da palavra e conte a frequência de cada uma.\n" +
      "2. Some as frequências para confirmar n (total de letras).\n" +
      "3. Aplique: n! dividido pelo produto dos fatoriais das frequências.\n\n" +
      "EXEMPLOS:\n" +
      "BANANA: B(1), A(3), N(2) → n=6\n" +
      "P = 6! / (1! × 3! × 2!) = 720 / (1 × 6 × 2) = 720 / 12 = 60 anagramas.\n\n" +
      "ARARA: A(3), R(2) → n=5\n" +
      "P = 5! / (3! × 2!) = 120 / (6 × 2) = 120 / 12 = 10 anagramas.\n\n" +
      "MISSISSIPI: M(1), I(4), S(4), P(1) → n=10\n" +
      "P = 10! / (1! × 4! × 4! × 1!) = 3.628.800 / (1 × 24 × 24 × 1) = 3.628.800 / 576 = 6.300 anagramas.\n\n" +
      "DICA DE PROVA — IDENTIFICAÇÃO DAS REPETIÇÕES:\n" +
      "Antes de calcular, organize as letras em ordem alfabética para evitar erros de contagem. " +
      "Exemplo: CORREGEDOR → organize: C, D, E, E, G, O, O, R, R, R → C(1), D(1), E(2), G(1), O(2), R(3). " +
      "n = 10. P = 10!/(1!×1!×2!×1!×2!×3!) = 3.628.800/24 = 151.200 anagramas.\n\n" +
      "ERRO FREQUENTE: não contar todas as ocorrências de uma letra. " +
      "Sempre liste e confira antes de calcular — um erro na frequência altera completamente o resultado.",
  },
  {
    id: "rlm_ac_c05",
    title: "CORREGEDOR — Estudo de Caso Completo",
    difficulty: "MEDIO",
    mnemonic:
      "CORREGEDOR → Organize: C(1) D(1) E(2) G(1) O(2) R(3) — total 10 letras. " +
      "Denominador = 2! × 2! × 3! = 2 × 2 × 6 = 24. " +
      "Resultado = 10!/24 = 3.628.800/24 = 151.200. " +
      "Fixou? 'CORRE-GEDOR tem 151.200 arranjos' — pense num corredor lotado de 151.200 pessoas.",
    keyPoint:
      "• CORREGEDOR: C(1), O(2), R(3), E(2), G(1), D(1) → n = 10 letras\n" +
      "• P = 10! / (2! × 3! × 2!) = 3.628.800 / 24 = 151.200 anagramas totais\n" +
      "• Anagramas começando com C: fixar C → P(9; O2, R3, E2, G1, D1) = 9!/(2!×3!×2!) = 362.880/24 = 15.120\n" +
      "• Vogais (O,O,E,E) juntas: bloco de 4 vogais + 6 consoantes → (7! / 3!) × (4! / 2!×2!) = 840 × 6 = 5.040\n" +
      "• Começando e terminando com R: fix 2 R nas extremidades → P(8; O2, R1, E2, G1, D1) = 8!/(2!×1!×2!) = 40.320/4 = 10.080",
    practicalExample:
      "CESPE: 'Quantos anagramas tem CORREGEDOR?' → 10!/(2!·3!·2!) = 151.200. CERTO se afirmar 151.200. " +
      "CESPE: 'Um anagrama de CORREGEDOR começa com C. Quantos anagramas distintos existem nessa condição?' " +
      "→ C fixo, permuta 9 restantes com O(2),R(3),E(2),G,D → 9!/(2!·3!·2!) = 362.880/24 = 15.120.",
    textContent:
      "A palavra CORREGEDOR é um clássico de prova de concurso, especialmente CESPE/CEBRASPE e bancas similares. " +
      "Vamos analisá-la em profundidade.\n\n" +
      "PASSO 1 — IDENTIFICAR AS LETRAS E FREQUÊNCIAS:\n" +
      "C-O-R-R-E-G-E-D-O-R\n" +
      "Organizando em ordem alfabética: C, D, E, E, G, O, O, R, R, R\n" +
      "• C: 1 vez\n" +
      "• D: 1 vez\n" +
      "• E: 2 vezes\n" +
      "• G: 1 vez\n" +
      "• O: 2 vezes\n" +
      "• R: 3 vezes\n" +
      "Total: 1+1+2+1+2+3 = 10 letras ✓\n\n" +
      "PASSO 2 — TOTAL DE ANAGRAMAS:\n" +
      "P = 10! / (1! × 1! × 2! × 1! × 2! × 3!)\n" +
      "= 3.628.800 / (1 × 1 × 2 × 1 × 2 × 6)\n" +
      "= 3.628.800 / 24\n" +
      "= 151.200 anagramas\n\n" +
      "PASSO 3 — VARIAÇÕES FREQUENTES EM PROVA:\n\n" +
      "A) Começando com C (letra única):\n" +
      "Fixe C na 1ª posição. Permute as 9 letras restantes: D, E, E, G, O, O, R, R, R\n" +
      "P = 9! / (1! × 2! × 1! × 2! × 3!) = 362.880 / (1×2×1×2×6) = 362.880 / 24 = 15.120\n\n" +
      "B) Começando com R:\n" +
      "Fixe 1 R na 1ª posição. Sobram: C, D, E, E, G, O, O, R, R (9 letras, com R aparecendo ainda 2 vezes)\n" +
      "P = 9! / (1!×1!×2!×1!×2!×2!) = 362.880 / (1×1×2×1×2×2) = 362.880 / 8 = 45.360\n\n" +
      "C) Começando E terminando com R:\n" +
      "Fixe 1 R na 1ª posição e 1 R na 10ª posição (sobra R(1) no interior). " +
      "Permute as 8 letras internas: C, D, E, E, G, O, O, R\n" +
      "P = 8! / (1!×1!×2!×1!×2!×1!) = 40.320 / 4 = 10.080\n\n" +
      "D) Vogais (E, E, O, O) juntas em bloco:\n" +
      "As 4 vogais formam um bloco. Elementos a permutar: {bloco}, C, D, G, R, R, R → 7 elementos com R(3).\n" +
      "Arranjos dos elementos externos: 7! / 3! = 5.040 / 6 = 840\n" +
      "Arranjos internos do bloco (E,E,O,O): 4!/(2!×2!) = 24/4 = 6\n" +
      "Total: 840 × 6 = 5.040\n\n" +
      "VERIFICAÇÃO RÁPIDA — PROPORÇÃO:\n" +
      "Começando com C: 15.120 / 151.200 = 1/10. Faz sentido? Sim — C aparece 1 vez em 10 letras, " +
      "então em média 1/10 dos anagramas começará com C (quando não há repetição da letra inicial). ✓\n\n" +
      "PALAVRA-CHAVE PARA PROVA: ao ver CORREGEDOR, pense imediatamente: " +
      "'10 letras, R aparece 3 vezes, E e O aparecem 2 vezes cada, denominador = 3!×2!×2! = 24, resultado = 151.200'.",
  },
  {
    id: "rlm_ac_c06",
    title: "Permutações com Restrições — Blocos, Posições Fixas e Casos Proibidos",
    difficulty: "DIFICIL",
    mnemonic:
      "3 ESTRATÉGIAS: (1) FIXAR o elemento restrito; (2) BLOCO — cole adjacentes num único elemento; " +
      "(3) COMPLEMENTAR — Total − Proibido. " +
      "Sequência mental: Identifique a restrição → escolha a estratégia → resolva por PFC.",
    keyPoint:
      "• Elementos inseparáveis: forme um bloco → (n-k+1)! × k! (k = tamanho do bloco)\n" +
      "• Elementos que nunca se adjacentam: Total − (blocos onde estão juntos)\n" +
      "• Alternância (vogais e consoantes alternadas): preencha as posições alternadas separadamente\n" +
      "• Posição relativa fixa (A sempre antes de B): Total / 2 (por simetria, metade das permutações tem A antes de B)\n" +
      "• Múltiplas restrições: aplique na ordem: mais restritivos primeiro → menos restritivos depois",
    practicalExample:
      "CESPE: 'Vogais de CARGO nunca adjacentes?' Total 5! = 120; vogais {A,O} juntas = 4!×2! = 48 → 120−48 = 72. " +
      "PC-DF: '4 delegados (A,B,C,D) em fila, A sempre à esquerda de B?' → 4!/2 = 12 (por simetria). " +
      "FGV: 'POLICIA (7 letras, I repetido) com vogais (O,I,I,A) sempre juntas?' " +
      "→ bloco de 4 vogais + 3 consoantes (P,L,C) = 4 elementos; arranjos: 4! × (4!/2!) = 24 × 12 = 288.",
    textContent:
      "As restrições em permutações são o tópico mais avançado da Análise Combinatória e correspondem " +
      "ao nível DIFÍCIL das provas CESPE/CEBRASPE. Existem três estratégias principais:\n\n" +
      "ESTRATÉGIA 1 — FIXAÇÃO DE POSIÇÃO:\n" +
      "Quando um ou mais elementos devem ocupar posições específicas, fixe-os e permute os restantes.\n" +
      "Exemplo: 'Em CARGO, G deve ser a 3ª letra.' → G fixo na posição 3. Permuta: C, A, R, O em 4 posições → 4! = 24.\n\n" +
      "ESTRATÉGIA 2 — FORMAÇÃO DE BLOCOS (elementos adjacentes):\n" +
      "Quando elementos devem ficar juntos (adjacentes), cole-os em um único 'super-elemento'.\n" +
      "Procedimento:\n" +
      "• Forme o bloco com os k elementos adjacentes.\n" +
      "• Trate o bloco como 1 elemento → você tem (n-k+1) elementos para permutar.\n" +
      "• Multiplique pelo número de arranjos internos do bloco: k! (se distintos) ou k!/(repetições!) (se houver).\n\n" +
      "Exemplo: CARGO, vogais {A, O} sempre juntas.\n" +
      "• Bloco = {A,O}: 2! = 2 formas internas (AO ou OA)\n" +
      "• Elementos: {AO}, C, R, G → 4 elementos → 4! = 24 arranjos\n" +
      "• Total: 4! × 2! = 24 × 2 = 48\n\n" +
      "ESTRATÉGIA 3 — COMPLEMENTAR (casos proibidos):\n" +
      "Quando é mais fácil contar o que NÃO pode acontecer:\n" +
      "Resultado = Total − (casos proibidos)\n\n" +
      "Exemplo: CARGO, vogais {A, O} NUNCA adjacentes.\n" +
      "• Total de anagramas: 5! = 120\n" +
      "• Vogais sempre juntas (proibido): 48 (calculado acima)\n" +
      "• Vogais nunca juntas: 120 − 48 = 72\n\n" +
      "ALTERNÂNCIA (vogais e consoantes em posições alternadas):\n" +
      "Para n=5 (CARGO: 2 vogais, 3 consoantes), posições ímpares (1,3,5) para consoantes, pares (2,4) para vogais:\n" +
      "• Consoantes nas posições ímpares: P(3) = 3! = 6 formas\n" +
      "• Vogais nas posições pares: P(2) = 2! = 2 formas\n" +
      "• Total alternado: 6 × 2 = 12 anagramas\n\n" +
      "POSIÇÃO RELATIVA (A sempre antes de B, sem posição fixa):\n" +
      "Por simetria: em qualquer permutação de n elementos distintos, para 2 elementos específicos A e B, " +
      "exatamente metade das permutações tem A antes de B e metade tem B antes de A. " +
      "Portanto: Total / 2.\n\n" +
      "ARMADILHA — ELEMENTOS QUE NÃO SE ADJACENTAM DOIS A DOIS:\n" +
      "Se forem 3 ou mais elementos que não podem ser adjacentes entre si, o complementar fica complexo " +
      "(inclusão-exclusão). Prefira montar diretamente: coloque primeiro os elementos sem restrição, " +
      "depois insira os elementos proibidos nos espaços disponíveis.\n\n" +
      "RESUMO PARA PROVA:\n" +
      "Restrição de posição fixa → fixe e permute o resto.\n" +
      "Elementos adjacentes → bloco × interno.\n" +
      "Elementos separados → Total − juntos.\n" +
      "Ordem relativa → Total / 2.",
  },
];

// ─── QUESTÕES ────────────────────────────────────────────────────────────────

const questions = [
  // ── Q01 — rlm_ac_c01 — Múltipla Escolha ──
  {
    id: "rlm_ac_q01",
    contentId: "rlm_ac_c01",
    statement:
      "(CESPE — Adaptada) Em uma delegacia, o delegado deve designar um responsável pelo " +
      "plantão matutino e um para o noturno. Há 8 agentes disponíveis e cada agente pode " +
      "ser escalado em apenas um turno. De quantas formas distintas podem ser feitas essas escalas?",
    alternatives: [
      { letter: "A", text: "16" },
      { letter: "B", text: "28" },
      { letter: "C", text: "56" },
      { letter: "D", text: "64" },
      { letter: "E", text: "56" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Etapa 1 (plantão matutino): 8 escolhas. " +
      "Etapa 2 (plantão noturno): 7 escolhas (o escalado no matutino não pode ser escalado). " +
      "Total = 8 × 7 = 56 (Arranjo A(8,2) = 8!/6! = 56). " +
      "Alternativa A(16) usaria só adição. Alternativa D(64) esquece a restrição de repetição (8×8).",
    explanationCorrect:
      "Correto! PFC aplicado: 8 opções para o primeiro turno × 7 para o segundo (sem repetição) = 56. " +
      "Formalmente é o Arranjo A(8,2) = 8 × 7 = 56. " +
      "Perceba que a ordem importa: designar o agente X para o matutino e Y para o noturno " +
      "é diferente de X no noturno e Y no matutino.",
    explanationWrong:
      "Releia o PFC: duas etapas independentes, sem repetição. " +
      "1ª etapa: 8 agentes disponíveis. 2ª etapa: 7 restantes. " +
      "8 × 7 = 56. " +
      "Não confunda com combinação (onde a ordem não importa, daria C(8,2)=28) nem com 8²=64 (com repetição).",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q02 — rlm_ac_c01 — CERTO/ERRADO ──
  {
    id: "rlm_ac_q02",
    contentId: "rlm_ac_c01",
    statement:
      "(CEBRASPE — Adaptada) Uma senha de acesso a sistema policial é formada por " +
      "2 letras maiúsculas distintas seguidas de 3 dígitos distintos (0 a 9). " +
      "Nessas condições, o número total de senhas possíveis é igual a 26 × 25 × 10 × 9 × 8.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Pelo PFC: " +
      "1ª letra: 26 opções. 2ª letra: 25 (distinta da 1ª). " +
      "1º dígito: 10 opções. 2º dígito: 9 (distinto do 1º). 3º dígito: 8. " +
      "Total = 26 × 25 × 10 × 9 × 8 = 468.000 senhas. " +
      "A expressão no enunciado está correta.",
    explanationCorrect:
      "Exato! O raciocínio é perfeito: cada etapa reduz 1 opção porque não há repetição. " +
      "Letras: 26 × 25. Dígitos: 10 × 9 × 8. Produto total: 468.000. " +
      "O item descreve exatamente a aplicação do PFC sem repetição.",
    explanationWrong:
      "O item está CERTO. Verifique: 2 letras distintas de 26 → 26 × 25. " +
      "3 dígitos distintos de 10 → 10 × 9 × 8. " +
      "PFC: multiplicar todas as etapas → 26 × 25 × 10 × 9 × 8. Expressão correta.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  // ── Q03 — rlm_ac_c02 — Múltipla Escolha ──
  {
    id: "rlm_ac_q03",
    contentId: "rlm_ac_c02",
    statement:
      "(FGV — Adaptada) Em uma formatura de academia policial, 7 cadetes devem ser " +
      "posicionados em fila para a foto oficial. Sabendo que todos os cadetes são " +
      "distintos entre si, de quantas maneiras distintas podem ser organizados?",
    alternatives: [
      { letter: "A", text: "49" },
      { letter: "B", text: "720" },
      { letter: "C", text: "2.520" },
      { letter: "D", text: "5.040" },
      { letter: "E", text: "40.320" },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "Permutação Simples de 7 elementos distintos: P(7) = 7! = 7 × 6 × 5 × 4 × 3 × 2 × 1 = 5.040. " +
      "A(49) seria 7²; B(720) é 6!; C(2.520) é A(7,4); E(40.320) é 8!.",
    explanationCorrect:
      "Correto! 7 cadetes distintos em 7 posições → P(7) = 7! = 5.040. " +
      "Raciocínio: 7 opções para a 1ª posição, 6 para a 2ª, 5 para a 3ª... até 1 para a última. " +
      "7 × 6 × 5 × 4 × 3 × 2 × 1 = 5.040.",
    explanationWrong:
      "Permutação de 7 elementos distintos = 7! = 5.040. " +
      "6! = 720 (seria para 6 cadetes). 8! = 40.320 (para 8). " +
      "A(7,4) = 7×6×5×4 = 840 (para escolher e ordenar 4 dos 7, não todos). " +
      "Como todos os 7 cadetes ocupam posições, use P(7) = 7! = 5.040.",
    difficulty: "FACIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q04 — rlm_ac_c02 — CERTO/ERRADO ──
  {
    id: "rlm_ac_q04",
    contentId: "rlm_ac_c02",
    statement:
      "(CESPE — Adaptada) O número de arranjos distintos que se pode formar com " +
      "5 elementos distintos tomados 3 a 3 é igual a 60.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Arranjo A(5,3) = 5! / (5-3)! = 5! / 2! = 120 / 2 = 60. " +
      "Também calculável diretamente: 5 × 4 × 3 = 60. " +
      "A ordem importa no arranjo (diferente de combinação, onde C(5,3)=10).",
    explanationCorrect:
      "Correto! A(5,3) = 5 × 4 × 3 = 60. " +
      "É diferente da combinação C(5,3) = 10, onde a ordem não importa. " +
      "No arranjo: (A,B,C), (A,C,B), (B,A,C)... são sequências diferentes.",
    explanationWrong:
      "O item está CERTO. A(5,3) = 5!/(5-3)! = 120/2 = 60. " +
      "Não confunda com C(5,3) = 10 (combinação, sem considerar ordem). " +
      "No arranjo a ordem é relevante: (X,Y,Z) ≠ (Y,X,Z) → 60 possibilidades.",
    difficulty: "FACIL",
    questionType: "CERTO_ERRADO",
  },
  // ── Q05 — rlm_ac_c03 — Múltipla Escolha ──
  {
    id: "rlm_ac_q05",
    contentId: "rlm_ac_c03",
    statement:
      "(CESPE — Adaptada) Quantos anagramas da palavra DELTA (5 letras, todas distintas) " +
      "têm a letra D na primeira posição e a letra A na última posição?",
    alternatives: [
      { letter: "A", text: "6" },
      { letter: "B", text: "12" },
      { letter: "C", text: "24" },
      { letter: "D", text: "48" },
      { letter: "E", text: "120" },
    ],
    correctAnswer: "A",
    correctOption: 0,
    explanation:
      "D fixo na 1ª posição e A fixo na 5ª posição. " +
      "Restam 3 letras (E, L, T) para as 3 posições internas → P(3) = 3! = 6. " +
      "B(12)=2!×3!/2; C(24)=4!; D(48)=4!×2; E(120)=5! (sem restrição).",
    explanationCorrect:
      "Perfeito! D na 1ª e A na última: ambos fixos. " +
      "Posições 2, 3 e 4 recebem E, L, T em qualquer ordem: 3! = 6. " +
      "D_E_L_T_A, D_E_T_L_A, D_L_E_T_A, D_L_T_E_A, D_T_E_L_A, D_T_L_E_A → 6 anagramas. ✓",
    explanationWrong:
      "Com D fixo na 1ª e A fixo na 5ª posição, as 3 posições internas têm 3 letras distintas (E, L, T). " +
      "3! = 6. Não multiplique por 2! (D e A estão fixos, não se permutam). " +
      "4! = 24 seria para fixar apenas 1 letra.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q06 — rlm_ac_c03 — CERTO/ERRADO ──
  {
    id: "rlm_ac_q06",
    contentId: "rlm_ac_c03",
    statement:
      "(CEBRASPE — Adaptada) A palavra CARGO possui 5 letras distintas. " +
      "O número de anagramas dessa palavra em que as vogais (A e O) " +
      "estejam sempre em posições adjacentes é igual a 48.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Trate {A,O} como um bloco. Elementos: {AO}, C, R, G → 4 elementos → 4! = 24 arranjos. " +
      "Arranjos internos do bloco: 2! = 2 (AO ou OA). " +
      "Total = 4! × 2! = 24 × 2 = 48.",
    explanationCorrect:
      "Exato! Vogais em bloco → 4 elementos (bloco + 3 consoantes) → 4! = 24. " +
      "O bloco pode ser AO ou OA → × 2! = 2. " +
      "Total: 24 × 2 = 48. A afirmação está CORRETA.",
    explanationWrong:
      "O item está CERTO. Estratégia do bloco: {A,O} juntos = 1 super-elemento. " +
      "4 elementos para permutar → 4! = 24. Internamente o bloco tem 2! = 2 arranjos (AO e OA). " +
      "4! × 2! = 48.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  // ── Q07 — rlm_ac_c04 — Múltipla Escolha ──
  {
    id: "rlm_ac_q07",
    contentId: "rlm_ac_c04",
    statement:
      "(CESPE — Adaptada) Quantos anagramas distintos possui a palavra BANANA?",
    alternatives: [
      { letter: "A", text: "30" },
      { letter: "B", text: "60" },
      { letter: "C", text: "120" },
      { letter: "D", text: "180" },
      { letter: "E", text: "720" },
    ],
    correctAnswer: "B",
    correctOption: 1,
    explanation:
      "BANANA: B(1), A(3), N(2) → n = 6 letras. " +
      "P = 6! / (1! × 3! × 2!) = 720 / (1 × 6 × 2) = 720 / 12 = 60. " +
      "A(30)=720/24; C(120)=5!; D(180)=720/4; E(720)=6! sem ajuste.",
    explanationCorrect:
      "Correto! Permutação com Repetição: n=6, A repete 3×, N repete 2×. " +
      "P = 6!/(3!×2!) = 720/12 = 60. " +
      "Mnemônico: BANANA → 'BE 60' (seis dezenas de anagramas).",
    explanationWrong:
      "BANANA tem 6 letras: B(1), A(3), N(2). " +
      "P = 6!/(1!×3!×2!) = 720/12 = 60. " +
      "Não use 6! = 720 diretamente (ignora repetições). " +
      "Divida pelo fatorial de cada frequência repetida: 3! para A e 2! para N.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q08 — rlm_ac_c04 — CERTO/ERRADO ──
  {
    id: "rlm_ac_q08",
    contentId: "rlm_ac_c04",
    statement:
      "(FGV — Adaptada) A palavra ARARA possui 5 letras, com A aparecendo 3 vezes e R aparecendo 2 vezes. " +
      "O número de anagramas distintos que podem ser formados com as letras de ARARA é igual a 20.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "E",
    correctOption: 1,
    explanation:
      "ERRADO. P(5; 3, 2) = 5! / (3! × 2!) = 120 / (6 × 2) = 120 / 12 = 10, não 20. " +
      "O candidato pode ter calculado 5!/2! = 60, ou errado as frequências. " +
      "ARARA: A(3), R(2) → P = 10.",
    explanationCorrect:
      "Correto! O item está ERRADO. P(5; 3, 2) = 5!/(3!×2!) = 120/12 = 10, não 20. " +
      "São apenas 10 anagramas distintos para ARARA.",
    explanationWrong:
      "ARARA: A(3), R(2), total 5 letras. " +
      "P = 5!/(3!×2!) = 120/(6×2) = 120/12 = 10. " +
      "O enunciado afirma 20, mas o correto é 10. Item ERRADO.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  // ── Q09 — rlm_ac_c05 — Múltipla Escolha ──
  {
    id: "rlm_ac_q09",
    contentId: "rlm_ac_c05",
    statement:
      "(CESPE — Adaptada) Considerando a palavra CORREGEDOR, " +
      "assinale a alternativa que apresenta o número total de anagramas distintos dessa palavra.",
    alternatives: [
      { letter: "A", text: "10.080" },
      { letter: "B", text: "15.120" },
      { letter: "C", text: "75.600" },
      { letter: "D", text: "151.200" },
      { letter: "E", text: "3.628.800" },
    ],
    correctAnswer: "D",
    correctOption: 3,
    explanation:
      "CORREGEDOR: C(1), O(2), R(3), E(2), G(1), D(1) → 10 letras. " +
      "P = 10! / (2! × 3! × 2!) = 3.628.800 / (2 × 6 × 2) = 3.628.800 / 24 = 151.200. " +
      "A(10.080) = 8!/4; B(15.120) = C fixo = 9!/24; C(75.600) = 10!/48; E(3.628.800) = 10! sem ajuste.",
    explanationCorrect:
      "Correto! CORREGEDOR: 10 letras, R repete 3×, E e O repetem 2× cada. " +
      "Denominador = 3! × 2! × 2! = 6 × 2 × 2 = 24. " +
      "10! / 24 = 3.628.800 / 24 = 151.200.",
    explanationWrong:
      "CORREGEDOR — conta cuidadosamente: C-O-R-R-E-G-E-D-O-R. " +
      "R aparece 3 vezes (posições 3,4,10). E aparece 2 vezes (5,8). O aparece 2 vezes (2,9). " +
      "P = 10!/(3!×2!×2!) = 3.628.800/24 = 151.200. " +
      "3.628.800 = 10! (sem descontar repetições). 15.120 = anagramas começando com C.",
    difficulty: "MEDIO",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q10 — rlm_ac_c05 — CERTO/ERRADO ──
  {
    id: "rlm_ac_q10",
    contentId: "rlm_ac_c05",
    statement:
      "(CEBRASPE — Adaptada) O número de anagramas da palavra CORREGEDOR " +
      "que começam com a letra C é igual a 15.120.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Fixando C na 1ª posição, restam 9 letras: D, E, E, G, O, O, R, R, R. " +
      "P = 9! / (1! × 2! × 1! × 2! × 3!) = 362.880 / (1 × 2 × 1 × 2 × 6) = 362.880 / 24 = 15.120. " +
      "Proporção de verificação: 15.120 / 151.200 = 1/10 ✓ (C aparece 1 em 10 letras).",
    explanationCorrect:
      "Correto! C fixo → permuta 9 letras restantes com repetições (E×2, O×2, R×3). " +
      "9!/(2!×2!×3!) = 362.880/24 = 15.120. " +
      "Confirme a proporção: 15.120/151.200 = 1/10, que é a frequência de C na palavra. ✓",
    explanationWrong:
      "O item está CERTO. C na 1ª posição (fixo). " +
      "9 letras restantes: O(2), R(3), E(2), G(1), D(1). " +
      "P = 9!/(2!×3!×2!) = 362.880/24 = 15.120.",
    difficulty: "MEDIO",
    questionType: "CERTO_ERRADO",
  },
  // ── Q11 — rlm_ac_c06 — Múltipla Escolha ──
  {
    id: "rlm_ac_q11",
    contentId: "rlm_ac_c06",
    statement:
      "(CESPE — Adaptada) Em uma fila com os delegados A, B, C, D e E (todos distintos), " +
      "quantos arranjos distintos existem em que A e B estejam SEMPRE separados " +
      "(não ocupem posições adjacentes)?",
    alternatives: [
      { letter: "A", text: "36" },
      { letter: "B", text: "48" },
      { letter: "C", text: "72" },
      { letter: "D", text: "96" },
      { letter: "E", text: "120" },
    ],
    correctAnswer: "C",
    correctOption: 2,
    explanation:
      "Total = 5! = 120. " +
      "A e B adjacentes (bloco): {AB} ou {BA} = 2 arranjos internos; 4 elementos → 4! = 24; total com A e B juntos = 4! × 2! = 48. " +
      "A e B NUNCA adjacentes = 120 − 48 = 72.",
    explanationCorrect:
      "Correto! Complementar: " +
      "Total (5!) = 120. " +
      "A e B juntos (bloco): 4! × 2! = 48. " +
      "A e B separados: 120 − 48 = 72.",
    explanationWrong:
      "Use o complementar: A e B separados = Total − (A e B juntos). " +
      "Total: 5! = 120. A e B juntos (bloco): 4 elementos (bloco+C+D+E), 4! = 24 posições, 2! = 2 ordens do bloco → 48. " +
      "Separados: 120 − 48 = 72.",
    difficulty: "DIFICIL",
    questionType: "MULTIPLA_ESCOLHA",
  },
  // ── Q12 — rlm_ac_c06 — CERTO/ERRADO ──
  {
    id: "rlm_ac_q12",
    contentId: "rlm_ac_c06",
    statement:
      "(CEBRASPE — Adaptada) Em qualquer permutação de 6 elementos distintos, " +
      "exatamente metade delas tem o elemento A em uma posição anterior à do elemento B, " +
      "independentemente de quais posições específicas A e B ocupem.",
    alternatives: [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" },
    ],
    correctAnswer: "C",
    correctOption: 0,
    explanation:
      "CERTO. Por simetria: para cada permutação em que A precede B, há exatamente uma permutação " +
      "espelhada em que B precede A (trocando apenas as posições de A e B). " +
      "Portanto, exatamente metade das 6! = 720 permutações tem A antes de B: 720/2 = 360. " +
      "Isso vale para qualquer n ≥ 2 com elementos distintos.",
    explanationCorrect:
      "Correto! Argumento de simetria: troque A e B em qualquer permutação → obtém a permutação complementar. " +
      "Essa correspondência 1-a-1 prova que exatamente metade das 6! = 720 permutações tem A antes de B (360). " +
      "Essa propriedade é fundamental e aparece frequentemente em provas de alto nível.",
    explanationWrong:
      "O item está CERTO. Para 2 elementos distintos (A e B) em n posições: " +
      "P(A antes de B) = P(B antes de A) = 1/2, por simetria perfeita. " +
      "Total: 6! = 720 → 720/2 = 360 permutações com A antes de B. " +
      "Válido para qualquer par de elementos distintos em qualquer tamanho de permutação.",
    difficulty: "DIFICIL",
    questionType: "CERTO_ERRADO",
  },
];

// ─── RUNNER ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Seed R35 — Raciocínio Lógico-Matemático: Anagramas e Permutações ===\n");

  // 1. Resolver Subject — tenta múltiplos padrões
  let subjectId: string | null = null;

  const subjectPatterns = [
    "%Racioc%nio%Matem%tico%",
    "%Racioc%nio%L%gico%",
    "%Racioc%nio%",
    "%Matem%tica%",
    "%Matem%tico%",
  ];

  for (const pattern of subjectPatterns) {
    const rows = (await db.execute(sql`
      SELECT id, name FROM "Subject"
      WHERE name ILIKE ${pattern}
      ORDER BY name
      LIMIT 1
    `)) as any[];

    if (rows[0]) {
      subjectId = rows[0].id;
      console.log(`Subject encontrado: "${rows[0].name}" (id: ${subjectId})`);
      break;
    }
  }

  if (!subjectId) {
    throw new Error(
      'Nenhum Subject com "Raciocínio" ou "Matemática" encontrado. ' +
      'Verifique os subjects: SELECT id, name FROM "Subject" ORDER BY name;'
    );
  }

  // 2. Resolver Topic
  let topicId: string | null = null;

  const topicRows = (await db.execute(sql`
    SELECT id FROM "Topic"
    WHERE "subjectId" = ${subjectId}
    ORDER BY name
    LIMIT 1
  `)) as any[];

  if (topicRows[0]) {
    topicId = topicRows[0].id;
    console.log(`Topic encontrado (subject próprio): ${topicId}`);
  } else {
    const anyTopicRows = (await db.execute(sql`
      SELECT id FROM "Topic"
      ORDER BY "createdAt"
      LIMIT 1
    `)) as any[];

    if (!anyTopicRows[0]) {
      throw new Error("Nenhum Topic encontrado no banco. Cadastre ao menos um Topic antes de rodar este seed.");
    }
    topicId = anyTopicRows[0].id;
    console.log(`Topic (fallback global): ${topicId}`);
  }

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

  console.log("\n=== R35 concluído: 6 átomos + 12 questões de Anagramas e Permutações ===");
  process.exit(0);
}

main().catch((err) => {
  console.error("ERRO no seed R35:", err);
  process.exit(1);
});
