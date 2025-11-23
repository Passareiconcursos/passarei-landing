import prisma from './db/prisma'

async function main() {
  console.log('🧪 Testando conexão Prisma...\n')
  
  try {
    // Testar conexão
    await prisma.$connect()
    console.log('✅ Conexão estabelecida!')
    
    // Contar registros
    const planCount = await prisma.plan.count()
    const userCount = await prisma.user.count()
    const cargoCount = await prisma.cargo.count()
    
    console.log(`\n📊 Registros no banco:`)
    console.log(`  - Planos: ${planCount}`)
    console.log(`  - Usuários: ${userCount}`)
    console.log(`  - Cargos: ${cargoCount}`)
    
    console.log('\n✅ Tudo funcionando!')
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
