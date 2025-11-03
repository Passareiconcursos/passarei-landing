import { db } from "./index";
import { admins, categories, subjects } from "./schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🌱 Iniciando seed do Drizzle...");

  // ===== ADMIN PADRÃO =====
  const adminEmail = "admin@passarei.com";

  const existingAdmin = await db
    .select()
    .from(admins)
    .where(eq(admins.email, adminEmail));

  if (existingAdmin.length > 0) {
    console.log("ℹ️  Admin já existe:", adminEmail);
  } else {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(admins).values({
      email: adminEmail,
      passwordHash: hashedPassword,
      name: "Administrador",
      role: "SUPER_ADMIN",
      isActive: true,
    });
    console.log("✅ Admin criado!");
  }

  // ===== CATEGORIAS (Concursos) =====
  console.log("\n📂 Criando categorias...");

  const categoriasData = [
    {
      name: "Polícia Federal",
      slug: "pf",
      examType: "PF",
      description: "Concursos da Polícia Federal",
    },
    {
      name: "Polícia Rodoviária Federal",
      slug: "prf",
      examType: "PRF",
      description: "Concursos da PRF",
    },
    {
      name: "Polícia Civil",
      slug: "pc",
      examType: "PC",
      description: "Concursos de Polícia Civil Estadual",
    },
    {
      name: "Polícia Militar",
      slug: "pm",
      examType: "PM",
      description: "Concursos de Polícia Militar Estadual",
    },
    {
      name: "Polícia Penal",
      slug: "pp",
      examType: "OUTRO",
      description: "Concursos de Polícia Penal",
    },
    {
      name: "Guarda Municipal",
      slug: "gm",
      examType: "OUTRO",
      description: "Concursos de Guarda Municipal",
    },
    {
      name: "Polícia Legislativa",
      slug: "pl",
      examType: "OUTRO",
      description: "Concursos de Polícia Legislativa",
    },
  ];

  for (const cat of categoriasData) {
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, cat.slug));

    if (existing.length === 0) {
      await db.insert(categories).values(cat as any);
      console.log(`  ✅ ${cat.name}`);
    } else {
      console.log(`  ℹ️  ${cat.name} (já existe)`);
    }
  }

  // ===== MATÉRIAS =====
  console.log("\n📚 Criando matérias...");

  const materiasData = [
    // Direito
    {
      name: "Direito Penal",
      slug: "direito-penal",
      subjectEnum: "DIREITO_PENAL",
      category: "DIREITO",
    },
    {
      name: "Direito Constitucional",
      slug: "direito-constitucional",
      subjectEnum: "DIREITO_CONSTITUCIONAL",
      category: "DIREITO",
    },
    {
      name: "Direito Administrativo",
      slug: "direito-administrativo",
      subjectEnum: "DIREITO_ADMINISTRATIVO",
      category: "DIREITO",
    },
    {
      name: "Direito Processual Penal",
      slug: "direito-processual-penal",
      subjectEnum: "DIREITO_PROCESSUAL_PENAL",
      category: "DIREITO",
    },
    {
      name: "Direito Civil",
      slug: "direito-civil",
      subjectEnum: "DIREITO_CIVIL",
      category: "DIREITO",
    },
    {
      name: "Direitos Humanos",
      slug: "direitos-humanos",
      subjectEnum: "DIREITOS_HUMANOS",
      category: "DIREITO",
    },
    {
      name: "Legislação Especial",
      slug: "legislacao-especial",
      subjectEnum: "LEGISLACAO_ESPECIAL",
      category: "DIREITO",
    },

    // Conhecimentos Básicos
    {
      name: "Língua Portuguesa",
      slug: "lingua-portuguesa",
      subjectEnum: "PORTUGUES",
      category: "CONHECIMENTOS_BASICOS",
    },
    {
      name: "Raciocínio Lógico",
      slug: "raciocinio-logico",
      subjectEnum: "RACIOCINIO_LOGICO",
      category: "CONHECIMENTOS_BASICOS",
    },
    {
      name: "Matemática",
      slug: "matematica",
      subjectEnum: "MATEMATICA",
      category: "CONHECIMENTOS_BASICOS",
    },
    {
      name: "Informática",
      slug: "informatica",
      subjectEnum: "INFORMATICA",
      category: "CONHECIMENTOS_BASICOS",
    },
    {
      name: "Atualidades",
      slug: "atualidades",
      subjectEnum: "ATUALIDADES",
      category: "CONHECIMENTOS_BASICOS",
    },
    {
      name: "Geografia",
      slug: "geografia",
      subjectEnum: "GEOGRAFIA",
      category: "CONHECIMENTOS_BASICOS",
    },
    {
      name: "História",
      slug: "historia",
      subjectEnum: "HISTORIA",
      category: "CONHECIMENTOS_BASICOS",
    },

    // Conhecimentos Técnicos
    {
      name: "Criminologia",
      slug: "criminologia",
      subjectEnum: "CRIMINOLOGIA",
      category: "CONHECIMENTOS_TECNICOS",
    },
    {
      name: "Medicina Legal",
      slug: "medicina-legal",
      subjectEnum: "MEDICINA_LEGAL",
      category: "CONHECIMENTOS_TECNICOS",
    },
  ];

  for (const mat of materiasData) {
    const existing = await db
      .select()
      .from(subjects)
      .where(eq(subjects.slug, mat.slug));

    if (existing.length === 0) {
      await db.insert(subjects).values(mat as any);
      console.log(`  ✅ ${mat.name}`);
    } else {
      console.log(`  ℹ️  ${mat.name} (já existe)`);
    }
  }

  console.log("\n🎉 Seed concluído!");
  console.log("\n📊 Resumo:");
  console.log("  • Admin: admin@passarei.com / admin123");
  console.log("  • 7 categorias de concursos");
  console.log("  • 16+ matérias");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
