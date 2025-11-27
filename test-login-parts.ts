import { findAdminByEmail } from './lib/db/auth'
import { verifyPassword } from './server/auth-minimal'
import { createAdminSession } from './lib/db/auth'

async function test() {
  console.log('🧪 TESTANDO PARTES DO LOGIN...\n')
  
  try {
    console.log('1️⃣ Testando findAdminByEmail...')
    const admin = await findAdminByEmail('admin@passarei.com')
    console.log('✅ Admin encontrado:', admin ? admin.email : 'não encontrado')
    console.log('')
    
    if (!admin) {
      console.log('❌ Admin não existe no banco')
      return
    }
    
    console.log('2️⃣ Testando verifyPassword...')
    const isValid = await verifyPassword('admin123', admin.password)
    console.log('✅ Senha válida:', isValid)
    console.log('')
    
    console.log('3️⃣ Testando createAdminSession...')
    const token = await createAdminSession(admin.id)
    console.log('✅ Token criado:', token.substring(0, 20) + '...')
    console.log('')
    
    console.log('🎉 TODAS AS PARTES FUNCIONAM!')
    
  } catch (error: any) {
    console.error('❌ Erro:', error.message)
  }
}

test()
