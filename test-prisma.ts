import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 Testando Prisma...\n')
  
  // 1. Contar planos
  const planCount = await prisma.plan.count()
  console.log(`✅ ${planCount} planos no banco`)
  
  // 2. Listar planos
  const plans = await prisma.plan.findMany({
    select: { name: true, displayName: true, priceMonthly: true }
  })
  console.log('\n📋 Planos:')
  plans.forEach(p => {
    console.log(`  - ${p.displayName}: R$ ${p.priceMonthly}/mês`)
  })
  
  // 3. Contar matérias
  const subjectCount = await prisma.subject.count()
  console.log(`\n✅ ${subjectCount} matérias no banco`)
  
  // 4. Contar cargos
  const cargoCount = await prisma.cargo.count()
  console.log(`✅ ${cargoCount} cargos no banco`)
  
  console.log('\n✅ Prisma funcionando perfeitamente!')
}

main()
  .catch(e => {
    console.error('❌ Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
