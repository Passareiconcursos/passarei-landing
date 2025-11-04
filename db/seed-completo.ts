import { db } from "./db";
import {
  admins,
  categories,
  subjects,
  leads,
  users,
  content,
  questions,
} from "./db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🌱 Iniciando seed completo do Drizzle...\n");

  // ===== ADMIN PADRÃO =====
  console.log("👤 Verificando admin...");
  const adminEmail = "admin@passarei.com";

  const existingAdmin = await db
    .select()
    .from(admins)
    .where(eq(admins.email, adminEmail));

  let adminId: string;

  if (existingAdmin.length > 0) {
    console.log("  ℹ️  Admin já existe:", adminEmail);
    adminId = existingAdmin[0].id;
  } else {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const newAdmin = await db
      .insert(admins)
      .values({
        email: adminEmail,
        passwordHash: hashedPassword,
        name: "Administrador",
        role: "SUPER_ADMIN",
        isActive: true,
      })
      .returning();
    adminId = newAdmin[0].id;
    console.log("  ✅ Admin criado!");
  }

  // ===== CATEGORIAS =====
  console.log("\n📂 Verificando categorias...");
  const categoriasData = [
    {
      name: "Polícia Federal",
      slug: "pf",
      examType: "PF" as const,
      description: "Concursos da Polícia Federal",
    },
    {
      name: "Polícia Rodoviária Federal",
      slug: "prf",
      examType: "PRF" as const,
      description: "Concursos da PRF",
    },
    {
      name: "Polícia Civil",
      slug: "pc",
      examType: "PC" as const,
      description: "Concursos de Polícia Civil Estadual",
    },
    {
      name: "Polícia Militar",
      slug: "pm",
      examType: "PM" as const,
      description: "Concursos de Polícia Militar Estadual",
    },
    {
      name: "Polícia Penal",
      slug: "pp",
      examType: "OUTRO" as const,
      description: "Concursos de Polícia Penal",
    },
    {
      name: "Guarda Municipal",
      slug: "gm",
      examType: "OUTRO" as const,
      description: "Concursos de Guarda Municipal",
    },
    {
      name: "Polícia Legislativa",
      slug: "pl",
      examType: "OUTRO" as const,
      description: "Concursos de Polícia Legislativa",
    },
  ];

  for (const cat of categoriasData) {
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, cat.slug));
    if (existing.length === 0) {
      await db.insert(categories).values(cat);
      console.log(`  ✅ ${cat.name}`);
    } else {
      console.log(`  ℹ️  ${cat.name} (já existe)`);
    }
  }

  // ===== MATÉRIAS =====
  console.log("\n📚 Verificando matérias...");
  const materiasData = [
    {
      name: "Direito Penal",
      slug: "direito-penal",
      subjectEnum: "DIREITO_PENAL" as const,
      category: "DIREITO",
    },
    {
      name: "Direito Constitucional",
      slug: "direito-constitucional",
      subjectEnum: "DIREITO_CONSTITUCIONAL" as const,
      category: "DIREITO",
    },
    {
      name: "Direito Administrativo",
      slug: "direito-administrativo",
      subjectEnum: "DIREITO_ADMINISTRATIVO" as const,
      category: "DIREITO",
    },
    {
      name: "Direito Processual Penal",
      slug: "direito-processual-penal",
      subjectEnum: "DIREITO_PROCESSUAL_PENAL" as const,
      category: "DIREITO",
    },
    {
      name: "Direito Civil",
      slug: "direito-civil",
      subjectEnum: "DIREITO_CIVIL" as const,
      category: "DIREITO",
    },
    {
      name: "Direitos Humanos",
      slug: "direitos-humanos",
      subjectEnum: "DIREITOS_HUMANOS" as const,
      category: "DIREITO",
    },
    {
      name: "Legislação Especial",
      slug: "legislacao-especial",
      subjectEnum: "LEGISLACAO_ESPECIAL" as const,
      category: "DIREITO",
    },
    {
      name: "Língua Portuguesa",
      slug: "lingua-portuguesa",
      subjectEnum: "PORTUGUES" as const,
      category: "CONHECIMENTOS_BASICOS",
    },
    {
      name: "Raciocínio Lógico",
      slug: "raciocinio-logico",
      subjectEnum: "RACIOCINIO_LOGICO" as const,
      category: "CONHECIMENTOS_BASICOS",
    },
    {
      name: "Matemática",
      slug: "matematica",
      subjectEnum: "MATEMATICA" as const,
      category: "CONHECIMENTOS_BASICOS",
    },
    {
      name: "Informática",
      slug: "informatica",
      subjectEnum: "INFORMATICA" as const,
      category: "CONHECIMENTOS_BASICOS",
    },
    {
      name: "Atualidades",
      slug: "atualidades",
      subjectEnum: "ATUALIDADES" as const,
      category: "CONHECIMENTOS_BASICOS",
    },
    {
      name: "Geografia",
      slug: "geografia",
      subjectEnum: "GEOGRAFIA" as const,
      category: "CONHECIMENTOS_BASICOS",
    },
    {
      name: "História",
      slug: "historia",
      subjectEnum: "HISTORIA" as const,
      category: "CONHECIMENTOS_BASICOS",
    },
    {
      name: "Criminologia",
      slug: "criminologia",
      subjectEnum: "CRIMINOLOGIA" as const,
      category: "CONHECIMENTOS_TECNICOS",
    },
    {
      name: "Medicina Legal",
      slug: "medicina-legal",
      subjectEnum: "MEDICINA_LEGAL" as const,
      category: "CONHECIMENTOS_TECNICOS",
    },
  ];

  for (const mat of materiasData) {
    const existing = await db
      .select()
      .from(subjects)
      .where(eq(subjects.slug, mat.slug));
    if (existing.length === 0) {
      await db.insert(subjects).values(mat);
      console.log(`  ✅ ${mat.name}`);
    } else {
      console.log(`  ℹ️  ${mat.name} (já existe)`);
    }
  }

  // ===== LEADS DE TESTE =====
  console.log("\n📋 Criando leads de teste...");

  const leadsData = [
    {
      name: "João Silva",
      email: "joao.silva@email.com",
      phone: "11987654321",
      examType: "PM" as const,
      state: "SP",
      status: "NOVO" as const,
    },
    {
      name: "Maria Santos",
      email: "maria.santos@email.com",
      phone: "21987654321",
      examType: "PC" as const,
      state: "RJ",
      status: "CONTATADO" as const,
    },
    {
      name: "Pedro Costa",
      email: "pedro.costa@email.com",
      phone: "31987654321",
      examType: "PRF" as const,
      state: "MG",
      status: "QUALIFICADO" as const,
    },
    {
      name: "Ana Oliveira",
      email: "ana.oliveira@email.com",
      phone: "41987654321",
      examType: "PF" as const,
      state: "PR",
      status: "NOVO" as const,
    },
    {
      name: "Carlos Souza",
      email: "carlos.souza@email.com",
      phone: "51987654321",
      examType: "PM" as const,
      state: "RS",
      status: "CONTATADO" as const,
    },
    {
      name: "Julia Lima",
      email: "julia.lima@email.com",
      phone: "61987654321",
      examType: "PC" as const,
      state: "DF",
      status: "NOVO" as const,
    },
    {
      name: "Rafael Alves",
      email: "rafael.alves@email.com",
      phone: "71987654321",
      examType: "PRF" as const,
      state: "BA",
      status: "QUALIFICADO" as const,
    },
    {
      name: "Fernanda Dias",
      email: "fernanda.dias@email.com",
      phone: "81987654321",
      examType: "PF" as const,
      state: "PE",
      status: "NOVO" as const,
    },
  ];

  let leadsCreated = 0;
  for (const lead of leadsData) {
    const existing = await db
      .select()
      .from(leads)
      .where(eq(leads.email, lead.email));
    if (existing.length === 0) {
      await db.insert(leads).values({
        ...lead,
        acceptedWhatsApp: true,
        source: "landing_page",
      });
      leadsCreated++;
    }
  }
  console.log(
    `  ✅ ${leadsCreated} leads criados (${leadsData.length - leadsCreated} já existiam)`,
  );

  // ===== USUÁRIOS DE TESTE =====
  console.log("\n👥 Criando usuários de teste...");

  const usersData = [
    {
      name: "Bruno Martins",
      email: "bruno.martins@email.com",
      phone: "11999887766",
      examType: "PM" as const,
      state: "SP",
      plan: "FREE" as const,
      isActive: true,
      emailVerified: true,
    },
    {
      name: "Carla Ferreira",
      email: "carla.ferreira@email.com",
      phone: "21999887766",
      examType: "PC" as const,
      state: "RJ",
      plan: "CALOURO" as const,
      isActive: true,
      emailVerified: true,
      subscriptionStatus: "ACTIVE",
    },
    {
      name: "Diego Rocha",
      email: "diego.rocha@email.com",
      phone: "31999887766",
      examType: "PRF" as const,
      state: "MG",
      plan: "VETERANO" as const,
      isActive: true,
      emailVerified: true,
      subscriptionStatus: "ACTIVE",
    },
    {
      name: "Elisa Campos",
      email: "elisa.campos@email.com",
      phone: "41999887766",
      examType: "PF" as const,
      state: "PR",
      plan: "FREE" as const,
      isActive: true,
      emailVerified: false,
    },
    {
      name: "Fabio Nunes",
      email: "fabio.nunes@email.com",
      phone: "51999887766",
      examType: "PM" as const,
      state: "RS",
      plan: "CALOURO" as const,
      isActive: false,
      emailVerified: true,
      subscriptionStatus: "CANCELED",
    },
  ];

  let usersCreated = 0;
  for (const user of usersData) {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email));
    if (existing.length === 0) {
      const hashedPassword = await bcrypt.hash("senha123", 10);
      await db.insert(users).values({
        ...user,
        passwordHash: hashedPassword,
      });
      usersCreated++;
    }
  }
  console.log(
    `  ✅ ${usersCreated} usuários criados (${usersData.length - usersCreated} já existiam)`,
  );

  // ===== CONTEÚDOS DE TESTE =====
  console.log("\n📝 Criando conteúdos de teste...");

  const conteudosData = [
    {
      title: "Princípio da Legalidade",
      subject: "DIREITO_PENAL" as const,
      examType: "PM" as const,
      sphere: "FEDERAL" as const,
      definition:
        "O princípio da legalidade estabelece que não há crime sem lei anterior que o defina, nem pena sem prévia cominação legal.",
      keyPoints:
        "• Nullum crimen nulla poena sine lege\n• Proteção contra arbitrariedade\n• Base do Estado de Direito",
      example:
        "Se uma conduta não está prevista em lei como crime, não pode ser punida, mesmo que seja moralmente reprovável.",
      tip: "Atenção: o princípio também se aplica às causas de aumento e diminuição de pena!",
      tags: ["direito penal", "princípios", "legalidade"],
      status: "PUBLISHED" as const,
    },
    {
      title: "Separação dos Poderes",
      subject: "DIREITO_CONSTITUCIONAL" as const,
      examType: "PC" as const,
      sphere: "FEDERAL" as const,
      definition:
        "A separação dos poderes divide o Estado em três poderes independentes e harmônicos: Executivo, Legislativo e Judiciário.",
      keyPoints:
        "• Checks and balances (freios e contrapesos)\n• Independência entre os poderes\n• Harmonia institucional",
      example:
        "O Legislativo pode aprovar leis, mas o Executivo pode vetá-las. O Judiciário pode declarar leis inconstitucionais.",
      tip: "Cuidado: os poderes são independentes, mas não absolutos. Há mecanismos de controle mútuo.",
      tags: ["direito constitucional", "poderes", "tripartição"],
      status: "PUBLISHED" as const,
    },
    {
      title: "Ato Administrativo",
      subject: "DIREITO_ADMINISTRATIVO" as const,
      examType: "PRF" as const,
      sphere: "FEDERAL" as const,
      definition:
        "Ato administrativo é toda manifestação unilateral de vontade da Administração Pública que visa produzir efeitos jurídicos.",
      keyPoints:
        "• Atributos: presunção de legitimidade, imperatividade, autoexecutoriedade\n• Requisitos: competência, finalidade, forma, motivo, objeto",
      example:
        "Uma multa de trânsito é um ato administrativo: unilateral, vinculado e com presunção de legitimidade.",
      tip: "Memorize 'COFIFOMO' para lembrar dos requisitos: COmpetência, FInalidade, FOrma, MOtivo, Objeto.",
      tags: ["direito administrativo", "atos", "administração pública"],
      status: "PUBLISHED" as const,
    },
    {
      title: "Prisão em Flagrante",
      subject: "DIREITO_PROCESSUAL_PENAL" as const,
      examType: "PF" as const,
      sphere: "FEDERAL" as const,
      definition:
        "Prisão em flagrante é a privação da liberdade de quem está cometendo, acabou de cometer ou é perseguido logo após a prática de crime.",
      keyPoints:
        "• Modalidades: flagrante próprio, impróprio, presumido\n• Não precisa de ordem judicial\n• Obrigatória audiência de custódia em 24h",
      example:
        "Se a polícia chega durante um roubo, pode prender o autor em flagrante próprio sem mandado.",
      tip: "Flagrante presumido = quando encontrado com objetos que façam presumir autoria (até 24h após o crime).",
      tags: ["processo penal", "prisão", "flagrante"],
      status: "PUBLISHED" as const,
    },
    {
      title: "Responsabilidade Civil",
      subject: "DIREITO_CIVIL" as const,
      examType: "PM" as const,
      sphere: "ESTADUAL" as const,
      state: "SP",
      definition:
        "Responsabilidade civil é a obrigação de reparar o dano causado a outrem por ação ou omissão voluntária, negligência ou imprudência.",
      keyPoints:
        "• Elementos: conduta, dano, nexo causal, culpa (em regra)\n• Pode ser objetiva (sem culpa) ou subjetiva (com culpa)",
      example:
        "Se você bate seu carro no veículo de outra pessoa por desatenção, deve indenizá-la pelos danos.",
      tip: "Estado responde objetivamente (sem culpa). Particulares respondem subjetivamente (com culpa), salvo exceções.",
      tags: ["direito civil", "responsabilidade", "indenização"],
      status: "PUBLISHED" as const,
    },
    {
      title: "Figuras de Linguagem",
      subject: "PORTUGUES" as const,
      examType: "PC" as const,
      sphere: "ESTADUAL" as const,
      state: "RJ",
      definition:
        "Figuras de linguagem são recursos expressivos usados para dar ênfase, originalidade ou expressividade ao discurso.",
      keyPoints:
        "• Metáfora: comparação implícita\n• Metonímia: substituição de termos relacionados\n• Hipérbole: exagero intencional",
      example:
        "'Aquele rapaz é um leão' = metáfora (comparação implícita entre o rapaz e o leão por sua bravura).",
      tip: "Diferença crucial: metáfora é comparação implícita; comparação tem 'como' ou 'tal qual'.",
      tags: ["português", "figuras de linguagem", "semântica"],
      status: "PUBLISHED" as const,
    },
    {
      title: "Proposições Lógicas",
      subject: "RACIOCINIO_LOGICO" as const,
      examType: "PRF" as const,
      sphere: "FEDERAL" as const,
      definition:
        "Proposição é toda sentença declarativa que pode ser classificada como verdadeira ou falsa, mas não ambas simultaneamente.",
      keyPoints:
        "• Conectivos: ~ (não), ^ (e), v (ou), → (se...então), ↔ (se e somente se)\n• Tabela-verdade fundamental",
      example:
        "'João é policial' é uma proposição (pode ser V ou F). 'Que horas são?' não é proposição (é pergunta).",
      tip: "Decorar tabelas-verdade! O 'se...então' só é falso quando V→F. Nos demais casos é verdadeiro.",
      tags: ["raciocínio lógico", "proposições", "lógica"],
      status: "PUBLISHED" as const,
    },
    {
      title: "Regra de Três Simples",
      subject: "MATEMATICA" as const,
      examType: "PM" as const,
      sphere: "ESTADUAL" as const,
      state: "MG",
      definition:
        "Regra de três simples é um método para resolver problemas que envolvem grandezas diretamente ou inversamente proporcionais.",
      keyPoints:
        "• Diretamente proporcional: multiplica em cruz\n• Inversamente proporcional: multiplica em linha",
      example:
        "Se 3 operários constroem um muro em 6 dias, quantos dias 6 operários levam? (inversamente proporcional = 3 dias)",
      tip: "Sempre identifique se é direta ou inversa ANTES de montar a regra de três!",
      tags: ["matemática", "proporcionalidade", "regra de três"],
      status: "PUBLISHED" as const,
    },
    {
      title: "Excel: Função SE",
      subject: "INFORMATICA" as const,
      examType: "PC" as const,
      sphere: "FEDERAL" as const,
      definition:
        "A função SE retorna um valor se a condição for verdadeira e outro valor se for falsa. Sintaxe: =SE(teste; valor_se_verdadeiro; valor_se_falso)",
      keyPoints:
        "• Estrutura condicional básica\n• Pode ser aninhada (SE dentro de SE)\n• Muito cobrada em concursos",
      example:
        "=SE(A1>60; 'Aprovado'; 'Reprovado') → retorna 'Aprovado' se A1 > 60, senão 'Reprovado'",
      tip: "SE aninhado: limite de 64 níveis, mas raramente cobram mais de 3 níveis.",
      tags: ["informática", "excel", "funções"],
      status: "PUBLISHED" as const,
    },
    {
      title: "Conceito de Crime",
      subject: "CRIMINOLOGIA" as const,
      examType: "PF" as const,
      sphere: "FEDERAL" as const,
      definition:
        "Crime é um fenômeno social complexo que pode ser analisado sob aspectos formal (legal), material (lesão a bem jurídico) e analítico (fato típico, ilícito e culpável).",
      keyPoints:
        "• Aspecto formal: definido em lei\n• Aspecto material: lesão ou perigo a bem jurídico\n• Aspecto analítico: fato típico + ilicitude + culpabilidade",
      example:
        "Homicídio: formalmente é crime (art. 121, CP); materialmente lesiona o bem jurídico vida; analiticamente reúne os três elementos.",
      tip: "Criminologia estuda o crime como fenômeno social, não apenas jurídico. Foco nas causas e controle.",
      tags: ["criminologia", "crime", "teoria do crime"],
      status: "PUBLISHED" as const,
    },
  ];

  let contentsCreated = 0;
  const contentIds: string[] = [];

  for (const conteudo of conteudosData) {
    const existing = await db
      .select()
      .from(content)
      .where(eq(content.title, conteudo.title));
    if (existing.length === 0) {
      const newContent = await db
        .insert(content)
        .values({
          ...conteudo,
          body: `${conteudo.definition}\n\n${conteudo.keyPoints}\n\n${conteudo.example}\n\n${conteudo.tip}`,
          createdBy: adminId,
          generatedByAI: false,
        })
        .returning();
      contentIds.push(newContent[0].id);
      contentsCreated++;
    } else {
      contentIds.push(existing[0].id);
    }
  }
  console.log(
    `  ✅ ${contentsCreated} conteúdos criados (${conteudosData.length - contentsCreated} já existiam)`,
  );

  // ===== QUESTÕES DE TESTE =====
  console.log("\n❓ Criando questões de teste...");

  const questoesExemplo = [
    {
      contentIndex: 0,
      questionText:
        "Sobre o princípio da legalidade no Direito Penal, é correto afirmar:",
      optionA:
        "É possível punir condutas não previstas em lei se forem moralmente reprováveis.",
      optionB: "O princípio só se aplica à definição de crimes, não às penas.",
      optionC:
        "Não há crime sem lei anterior que o defina, nem pena sem prévia cominação legal.",
      optionD: "A analogia in malam partem é permitida em casos excepcionais.",
      optionE: "Costumes podem criar tipos penais incriminadores.",
      correctAnswer: "C",
      explanation:
        "O princípio da legalidade (nullum crimen nulla poena sine lege) estabelece que não há crime sem lei anterior que o defina, nem pena sem prévia cominação legal. É um dos pilares do Direito Penal moderno.",
      difficulty: "FACIL",
    },
    {
      contentIndex: 0,
      questionText: "O princípio da legalidade impede:",
      optionA: "A retroatividade da lei penal benéfica.",
      optionB: "A aplicação de analogia in bonam partem.",
      optionC: "A criação de crimes por medida provisória.",
      optionD: "A interpretação extensiva de normas penais.",
      optionE: "O uso de princípios gerais de direito.",
      correctAnswer: "C",
      explanation:
        "Medida provisória não pode ser utilizada para criar crimes ou cominar penas, pois violaria o princípio da legalidade que exige lei em sentido estrito (lei ordinária ou complementar).",
      difficulty: "MEDIO",
    },
    {
      contentIndex: 0,
      questionText: "São desdobramentos do princípio da legalidade, EXCETO:",
      optionA: "Lex praevia (lei anterior).",
      optionB: "Lex scripta (lei escrita).",
      optionC: "Lex stricta (lei estrita).",
      optionD: "Lex certa (lei certa).",
      optionE: "Lex interpretativa (lei interpretativa).",
      correctAnswer: "E",
      explanation:
        "Os desdobramentos do princípio da legalidade são: lex praevia (anterioridade), lex scripta (forma escrita), lex stricta (proibição de analogia in malam partem) e lex certa (taxatividade). 'Lex interpretativa' não é um desdobramento reconhecido.",
      difficulty: "DIFICIL",
    },
  ];

  let questionsCreated = 0;

  for (const q of questoesExemplo) {
    if (contentIds[q.contentIndex]) {
      const existing = await db
        .select()
        .from(questions)
        .where(eq(questions.questionText, q.questionText));

      if (existing.length === 0) {
        await db.insert(questions).values({
          contentId: contentIds[q.contentIndex],
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          optionE: q.optionE,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          generatedByAI: false,
          createdBy: adminId,
        });
        questionsCreated++;
      }
    }
  }

  console.log(`  ✅ ${questionsCreated} questões criadas`);

  // ===== RESUMO FINAL =====
  console.log("\n" + "=".repeat(50));
  console.log("🎉 SEED COMPLETO CONCLUÍDO!");
  console.log("=".repeat(50));
  console.log("\n📊 RESUMO DO BANCO:");
  console.log(`  • 1 Admin (admin@passarei.com / admin123)`);
  console.log(`  • 7 Categorias de concursos`);
  console.log(`  • 16 Matérias`);
  console.log(`  • ${leadsData.length} Leads de teste`);
  console.log(`  • ${usersData.length} Usuários de teste`);
  console.log(`  • ${conteudosData.length} Conteúdos de teste`);
  console.log(`  • ${questionsCreated} Questões de teste`);
  console.log("\n🚀 Próximo passo: Acesse /educ e explore o admin!");
  console.log("   URL: https://[seu-replit].replit.dev/educ");
  console.log("   Login: admin@passarei.com");
  console.log("   Senha: admin123\n");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
