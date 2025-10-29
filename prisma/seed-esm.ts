import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // ===== CATEGORIAS (Concursos) =====
  
  const categories = [
    { name: 'Polícia Federal', slug: 'pf', type: 'POLICE_TYPE', sphere: 'FEDERAL' },
    { name: 'Polícia Rodoviária Federal', slug: 'prf', type: 'POLICE_TYPE', sphere: 'FEDERAL' },
    { name: 'Polícia Civil', slug: 'pc', type: 'POLICE_TYPE', sphere: 'ESTADUAL' },
    { name: 'Polícia Militar', slug: 'pm', type: 'POLICE_TYPE', sphere: 'ESTADUAL' },
    { name: 'Polícia Penal', slug: 'pp', type: 'POLICE_TYPE', sphere: 'ESTADUAL' },
    { name: 'Guarda Municipal', slug: 'gm', type: 'POLICE_TYPE', sphere: 'MUNICIPAL' },
    { name: 'Polícia Legislativa', slug: 'pl', type: 'POLICE_TYPE', sphere: 'FEDERAL' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
  }

  console.log('✅ Categorias criadas');

  // ===== MATÉRIAS =====

  const subjects = [
    // Conhecimentos Básicos
    { name: 'Língua Portuguesa', slug: 'lingua-portuguesa', category: 'CONHECIMENTOS_BASICOS' },
    { name: 'Raciocínio Lógico', slug: 'raciocinio-logico', category: 'CONHECIMENTOS_BASICOS' },
    { name: 'Matemática', slug: 'matematica', category: 'CONHECIMENTOS_BASICOS' },
    { name: 'Informática', slug: 'informatica', category: 'CONHECIMENTOS_BASICOS' },
    { name: 'Atualidades', slug: 'atualidades', category: 'CONHECIMENTOS_BASICOS' },
    { name: 'Geografia', slug: 'geografia', category: 'CONHECIMENTOS_BASICOS' },
    { name: 'História', slug: 'historia', category: 'CONHECIMENTOS_BASICOS' },
    { name: 'Ética no Serviço Público', slug: 'etica-servico-publico', category: 'CONHECIMENTOS_BASICOS' },
    { name: 'Língua Estrangeira', slug: 'lingua-estrangeira', category: 'CONHECIMENTOS_BASICOS' },
    { name: 'Estatística', slug: 'estatistica', category: 'CONHECIMENTOS_BASICOS' },

    // Direito
    { name: 'Direito Penal', slug: 'direito-penal', category: 'DIREITO' },
    { name: 'Direito Processual Penal', slug: 'direito-processual-penal', category: 'DIREITO' },
    { name: 'Direito Constitucional', slug: 'direito-constitucional', category: 'DIREITO' },
    { name: 'Direito Administrativo', slug: 'direito-administrativo', category: 'DIREITO' },
    { name: 'Direito Civil', slug: 'direito-civil', category: 'DIREITO' },
    { name: 'Direitos Humanos', slug: 'direitos-humanos', category: 'DIREITO' },
    { name: 'Legislação Especial', slug: 'legislacao-especial', category: 'DIREITO' },
    { name: 'Direito Penal Militar', slug: 'direito-penal-militar', category: 'DIREITO' },
    { name: 'Direito Processual Penal Militar', slug: 'direito-processual-penal-militar', category: 'DIREITO' },

    // Específicas
    { name: 'Criminologia', slug: 'criminologia', category: 'ESPECIFICAS' },
    { name: 'Medicina Legal', slug: 'medicina-legal', category: 'ESPECIFICAS' },
    { name: 'Legislação de Trânsito', slug: 'legislacao-transito', category: 'ESPECIFICAS' },
    { name: 'Noções de Física', slug: 'nocoes-fisica', category: 'ESPECIFICAS' },
    { name: 'Geopolítica', slug: 'geopolitica', category: 'ESPECIFICAS' },
    { name: 'Primeiros Socorros', slug: 'primeiros-socorros', category: 'ESPECIFICAS' },
    { name: 'Contabilidade', slug: 'contabilidade', category: 'ESPECIFICAS' },
    { name: 'Arquivologia', slug: 'arquivologia', category: 'ESPECIFICAS' },
    { name: 'Administração Pública', slug: 'administracao-publica', category: 'ESPECIFICAS' },
    { name: 'Lei de Execução Penal', slug: 'lei-execucao-penal', category: 'ESPECIFICAS' },
    { name: 'Segurança Penitenciária', slug: 'seguranca-penitenciaria', category: 'ESPECIFICAS' },
    { name: 'Estatuto das Guardas Municipais', slug: 'estatuto-guardas-municipais', category: 'ESPECIFICAS' },
    { name: 'Defesa Civil', slug: 'defesa-civil', category: 'ESPECIFICAS' }
  ];

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { slug: subject.slug },
      update: {},
      create: subject
    });
  }

  console.log('✅ Matérias criadas');

  // ===== ADMIN PADRÃO =====

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.adminUser.upsert({
    where: { email: 'admin@passarei.com.br' },
    update: {},
    create: {
      email: 'admin@passarei.com.br',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN'
    }
  });

  console.log('✅ Admin criado (admin@passarei.com.br / admin123)');
  console.log('🎉 Seed concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
