import prisma from './db/prisma'
import { hashPassword } from './server/auth'

async function main() {
  console.log('🔧 Criando admin de teste...')
  
  const hashedPassword = await hashPassword('admin123')
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@passarei.com' },
    update: {},
    create: {
      email: 'admin@passarei.com',
      password: hashedPassword,
      name: 'Admin Teste',
      role: 'SUPER_ADMIN',
      isActive: true
    }
  })
  
  console.log('✅ Admin criado:')
  console.log(`   Email: ${admin.email}`)
  console.log(`   Senha: admin123`)
  console.log(`   Role: ${admin.role}`)
}

main()
  .catch(e => {
    console.error('❌ Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
