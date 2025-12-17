import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL || '', { max: 1 });

// IDs das matérias existentes
const SUBJECTS = {
  PORTUGUES: 'cmichej5t0003rpiy2giws0j9',
  MATEMATICA: 'cmichej610004rpiyjq7iswhn',
  DIR_CONSTITUCIONAL: 'cmichej6a0005rpiyxqjqmyzr',
  DIR_ADMINISTRATIVO: 'cmichej6f0006rpiyqzrso6dc',
  DIR_PENAL: 'cmichej6m0007rpiyf4nkyj67',
};

// Conteúdos organizados por matéria e dificuldade
const CONTENTS = [
  // DIREITO CONSTITUCIONAL
  {
    subjectId: SUBJECTS.DIR_CONSTITUCIONAL,
    title: 'Princípios Fundamentais da República',
    textContent: 'A República Federativa do Brasil tem como fundamentos: soberania, cidadania, dignidade da pessoa humana, valores sociais do trabalho e da livre iniciativa, e pluralismo político (Art. 1º, CF).',
    difficulty: 'FACIL',
  },
  {
    subjectId: SUBJECTS.DIR_CONSTITUCIONAL,
    title: 'Separação dos Poderes',
    textContent: 'São Poderes da União, independentes e harmônicos entre si, o Legislativo, o Executivo e o Judiciário. Nenhum poder pode delegar suas funções típicas a outro, salvo exceções constitucionais.',
    difficulty: 'FACIL',
  },
  {
    subjectId: SUBJECTS.DIR_CONSTITUCIONAL,
    title: 'Direitos e Garantias Fundamentais',
    textContent: 'Os direitos fundamentais são normas que protegem a dignidade humana. Incluem direitos individuais (vida, liberdade, igualdade, segurança, propriedade), coletivos, sociais, de nacionalidade e políticos.',
    difficulty: 'MEDIO',
  },
  {
    subjectId: SUBJECTS.DIR_CONSTITUCIONAL,
    title: 'Remédios Constitucionais',
    textContent: 'São instrumentos para proteger direitos fundamentais: Habeas Corpus (liberdade de locomoção), Habeas Data (acesso a dados pessoais), Mandado de Segurança (direito líquido e certo), Mandado de Injunção (falta de norma regulamentadora) e Ação Popular (anular ato lesivo ao patrimônio público).',
    difficulty: 'MEDIO',
  },
  {
    subjectId: SUBJECTS.DIR_CONSTITUCIONAL,
    title: 'Controle de Constitucionalidade',
    textContent: 'É a verificação da compatibilidade de leis e atos normativos com a Constituição. Pode ser difuso (qualquer juiz, caso concreto) ou concentrado (STF, efeito erga omnes). ADI, ADC e ADPF são ações do controle concentrado.',
    difficulty: 'DIFICIL',
  },

  // DIREITO PENAL
  {
    subjectId: SUBJECTS.DIR_PENAL,
    title: 'Princípio da Legalidade Penal',
    textContent: 'Não há crime sem lei anterior que o defina, nem pena sem prévia cominação legal (Art. 1º, CP). É a base do Direito Penal, garantindo que ninguém será punido por conduta não prevista em lei.',
    difficulty: 'FACIL',
  },
  {
    subjectId: SUBJECTS.DIR_PENAL,
    title: 'Conceito de Crime',
    textContent: 'Crime é fato típico (conduta descrita em lei), ilícito (contrário ao direito) e culpável (reprovável). A ausência de qualquer elemento exclui o crime. Adota-se a teoria tripartite no Brasil.',
    difficulty: 'FACIL',
  },
  {
    subjectId: SUBJECTS.DIR_PENAL,
    title: 'Excludentes de Ilicitude',
    textContent: 'Afastam a ilicitude do fato: legítima defesa, estado de necessidade, estrito cumprimento do dever legal e exercício regular de direito (Art. 23, CP). O agente não responde pelo crime.',
    difficulty: 'MEDIO',
  },
  {
    subjectId: SUBJECTS.DIR_PENAL,
    title: 'Crimes contra a Administração Pública',
    textContent: 'Incluem peculato (apropriação de bem público), corrupção passiva (solicitar vantagem), prevaricação (retardar ato de ofício), concussão (exigir vantagem). São crimes próprios de funcionário público.',
    difficulty: 'MEDIO',
  },
  {
    subjectId: SUBJECTS.DIR_PENAL,
    title: 'Teoria da Pena',
    textContent: 'A pena tem tríplice finalidade: retributiva (castigo), preventiva (evitar novos crimes) e ressocializadora (reintegração). O sistema adota penas privativas de liberdade, restritivas de direitos e multa.',
    difficulty: 'DIFICIL',
  },

  // DIREITO ADMINISTRATIVO
  {
    subjectId: SUBJECTS.DIR_ADMINISTRATIVO,
    title: 'Princípios da Administração Pública',
    textContent: 'LIMPE: Legalidade (agir conforme a lei), Impessoalidade (sem favorecimentos), Moralidade (ética), Publicidade (transparência) e Eficiência (resultados). São expressos no Art. 37 da CF.',
    difficulty: 'FACIL',
  },
  {
    subjectId: SUBJECTS.DIR_ADMINISTRATIVO,
    title: 'Atos Administrativos',
    textContent: 'São manifestações unilaterais da Administração que produzem efeitos jurídicos. Elementos: competência, finalidade, forma, motivo e objeto. Atributos: presunção de legitimidade, imperatividade, autoexecutoriedade e tipicidade.',
    difficulty: 'MEDIO',
  },
  {
    subjectId: SUBJECTS.DIR_ADMINISTRATIVO,
    title: 'Poder de Polícia',
    textContent: 'É a faculdade da Administração de limitar direitos individuais em prol do interesse público. Características: discricionariedade, autoexecutoriedade e coercibilidade. Exemplos: fiscalização, multas de trânsito.',
    difficulty: 'MEDIO',
  },
  {
    subjectId: SUBJECTS.DIR_ADMINISTRATIVO,
    title: 'Licitações e Contratos',
    textContent: 'Licitação é procedimento para selecionar a proposta mais vantajosa. Modalidades: concorrência, tomada de preços, convite, concurso, leilão e pregão. A Nova Lei de Licitações (14.133/21) trouxe o diálogo competitivo.',
    difficulty: 'DIFICIL',
  },
  {
    subjectId: SUBJECTS.DIR_ADMINISTRATIVO,
    title: 'Responsabilidade Civil do Estado',
    textContent: 'O Estado responde objetivamente pelos danos que seus agentes causarem a terceiros (Art. 37, §6º, CF). Requisitos: conduta, dano e nexo causal. Pode haver ação regressiva contra o agente em caso de dolo ou culpa.',
    difficulty: 'DIFICIL',
  },

  // PORTUGUÊS
  {
    subjectId: SUBJECTS.PORTUGUES,
    title: 'Concordância Verbal',
    textContent: 'O verbo concorda com o sujeito em número e pessoa. Regras especiais: sujeito coletivo (verbo no singular), sujeito composto antes do verbo (plural), expressões partitivas admitem singular ou plural.',
    difficulty: 'FACIL',
  },
  {
    subjectId: SUBJECTS.PORTUGUES,
    title: 'Uso da Crase',
    textContent: 'Crase é a fusão de "a" (preposição) + "a" (artigo). Ocorre antes de palavras femininas. Não ocorre antes de verbos, palavras masculinas, pronomes em geral, e expressões com palavras repetidas.',
    difficulty: 'MEDIO',
  },
  {
    subjectId: SUBJECTS.PORTUGUES,
    title: 'Interpretação de Texto',
    textContent: 'Compreensão textual exige identificar: tema central, argumentos, intenção do autor, inferências e relações entre ideias. Atenção a conectivos, que indicam relações lógicas (causa, consequência, oposição).',
    difficulty: 'MEDIO',
  },
  {
    subjectId: SUBJECTS.PORTUGUES,
    title: 'Coesão e Coerência',
    textContent: 'Coesão é a ligação entre elementos do texto (pronomes, conectivos, sinônimos). Coerência é a lógica das ideias, sem contradições. Ambas garantem um texto bem estruturado e compreensível.',
    difficulty: 'DIFICIL',
  },

  // RACIOCÍNIO LÓGICO / MATEMÁTICA
  {
    subjectId: SUBJECTS.MATEMATICA,
    title: 'Proposições Lógicas',
    textContent: 'Proposição é uma sentença declarativa que pode ser verdadeira ou falsa. Conectivos: E (conjunção), OU (disjunção), SE...ENTÃO (condicional), SE E SOMENTE SE (bicondicional), NÃO (negação).',
    difficulty: 'FACIL',
  },
  {
    subjectId: SUBJECTS.MATEMATICA,
    title: 'Tabela Verdade',
    textContent: 'Ferramenta para determinar o valor lógico de proposições compostas. A conjunção (E) só é V se ambas forem V. A disjunção (OU) só é F se ambas forem F. O condicional só é F quando V implica F.',
    difficulty: 'MEDIO',
  },
  {
    subjectId: SUBJECTS.MATEMATICA,
    title: 'Porcentagem',
    textContent: 'Porcentagem representa uma fração de denominador 100. Para calcular X% de um valor, multiplica-se por X/100. Aumentos e descontos sucessivos não se somam diretamente.',
    difficulty: 'FACIL',
  },
  {
    subjectId: SUBJECTS.MATEMATICA,
    title: 'Regra de Três',
    textContent: 'Método para resolver problemas de proporcionalidade. Direta: grandezas aumentam ou diminuem juntas. Inversa: quando uma aumenta, a outra diminui. Organizar em tabela facilita a resolução.',
    difficulty: 'FACIL',
  },
  {
    subjectId: SUBJECTS.MATEMATICA,
    title: 'Probabilidade',
    textContent: 'Probabilidade = casos favoráveis / casos possíveis. Eventos independentes: multiplicam-se as probabilidades. Eventos mutuamente exclusivos: somam-se as probabilidades. Valor sempre entre 0 e 1.',
    difficulty: 'MEDIO',
  },
];

async function seed() {
  console.log('🌱 Iniciando seed de conteúdos...\n');
  
  let created = 0;
  let skipped = 0;

  for (const content of CONTENTS) {
    // Verificar se já existe
    const existing = await client`
      SELECT id FROM "Content" WHERE title = ${content.title}
    `;
    
    if (existing.length > 0) {
      console.log(`⏭️  Já existe: ${content.title}`);
      skipped++;
      continue;
    }

    // Criar novo conteúdo
    const id = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await client`
      INSERT INTO "Content" (
        id, "subjectId", title, "textContent", difficulty, 
        "wordCount", "estimatedReadTime", "isActive", version,
        "createdAt", "updatedAt"
      ) VALUES (
        ${id},
        ${content.subjectId},
        ${content.title},
        ${content.textContent},
        ${content.difficulty},
        ${content.textContent.split(' ').length},
        ${Math.ceil(content.textContent.split(' ').length / 200)},
        true,
        1,
        NOW(),
        NOW()
      )
    `;
    
    console.log(`✅ Criado: ${content.title} (${content.difficulty})`);
    created++;
  }

  console.log(`\n📊 Resultado: ${created} criados, ${skipped} já existiam`);
  
  // Contar total
  const total = await client`SELECT COUNT(*) as count FROM "Content" WHERE "isActive" = true`;
  console.log(`📚 Total de conteúdos ativos: ${total[0].count}`);
  
  process.exit(0);
}

seed().catch(console.error);
