import prisma from './db/prisma'

async function main() {
  const token = "38a6cca0ad521b15b490ba34167f927120ce62acaaf514678ec08400e72c37fb"
  
  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: { admin: true }
  })
  
  console.log('Sessão encontrada:', session ? 'SIM' : 'NÃO')
  if (session) {
    console.log('Admin:', session.admin.email)
    console.log('Expira em:', session.expiresAt)
  }
}

main().finally(() => prisma.$disconnect())
