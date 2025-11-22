import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // ==================== 1. PLANOS ====================
  console.log('\n📋 Criando Planos...')
  
  const planFree = await prisma.plan.upsert({
    where: { name: 'FREE' },
    update: {},
    create: {
      name: 'FREE',
      displayName: 'Plano Gratuito',
      description: 'Experimente o Passarei gratuitamente',
      priceMonthly: 0,
      priceYearly: 0,
      dailyContentLimit: 2,
      dailyCorrectionLimit: 2,
      dailyEssayLimit: 0,
      features: JSON.stringify(['Onboarding', '2 matérias/dia']),
      allowsAffiliate: false,
      isActive: true,
      sortOrder: 1
    }
  })
  
  const planCalouro = await prisma.plan.upsert({
    where: { name: 'CALOURO' },
    update: {},
    create: {
      name: 'CALOURO',
      displayName: 'Plano Calouro',
      description: 'Para quem está começando',
      priceMonthly: 12.90,
      dailyContentLimit: 10,
      dailyCorrectionLimit: 10,
      dailyEssayLimit: 1,
      features: JSON.stringify(['10 matérias/dia', '1 redação/dia']),
      allowsAffiliate: false,
      isActive: true,
      sortOrder: 2
    }
  })
  
  const planVeterano = await prisma.plan.upsert({
    where: { name: 'VETERANO' },
    update: {},
    create: {
      name: 'VETERANO',
      displayName: 'Plano Veterano',
      description: 'Para concurseiros dedicados',
      priceMonthly: 9.90,
      priceYearly: 118.80,
      dailyContentLimit: 30,
      dailyCorrectionLimit: 30,
      dailyEssayLimit: 3,
      features: JSON.stringify(['30 matérias/dia', '3 redações/dia', 'Afiliados 20%']),
      allowsAffiliate: true,
      affiliateCommission: 20.00,
      isActive: true,
      sortOrder: 3
    }
  })
  
  console.log(`✅ Planos criados: FREE, CALOURO, VETERANO`)

  // ==================== 2. MATÉRIAS ====================
  console.log('\n📚 Criando Matérias...')
  
  const subjects = [
    { name: 'PORTUGUES', displayName: 'Língua Portuguesa', category: 'LINGUAGENS' },
    { name: 'MATEMATICA', displayName: 'Matemática', category: 'MATEMATICA' },
    { name: 'DIR_CONSTITUCIONAL', displayName: 'Direito Constitucional', category: 'DIREITO' },
    { name: 'DIR_ADMINISTRATIVO', displayName: 'Direito Administrativo', category: 'DIREITO' },
    { name: 'DIR_PENAL', displayName: 'Direito Penal', category: 'DIREITO' },
  ]
  
  for (const subj of subjects) {
    await prisma.subject.upsert({
      where: { name: subj.name },
      update: {},
      create: {
        name: subj.name,
        displayName: subj.displayName,
        category: subj.category as any,
        isActive: true,
        sortOrder: subjects.indexOf(subj)
      }
    })
  }
  
  console.log(`✅ ${subjects.length} matérias criadas`)

  // ==================== 3. CARGOS ====================
  console.log('\n👮 Criando Cargos...')
  
  const cargos = [
    {
      name: 'PM-SP-SOLDADO',
      displayName: 'PM-SP - Soldado',
      organization: 'PM',
      state: 'SP',
      level: 'MEDIO',
      salario: 3192.00
    },
    {
      name: 'PRF-AGENTE',
      displayName: 'PRF - Agente',
      organization: 'PRF',
      state: null,
      level: 'SUPERIOR',
      salario: 9300.00
    },
  ]
  
  for (const cargo of cargos) {
    await prisma.cargo.upsert({
      where: { name: cargo.name },
      update: {},
      create: {
        name: cargo.name,
        displayName: cargo.displayName,
        organization: cargo.organization,
        state: cargo.state,
        level: cargo.level as any,
        salario: cargo.salario,
        isActive: true
      }
    })
  }
  
  console.log(`✅ ${cargos.length} cargos criados`)

  console.log('\n✅ Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
