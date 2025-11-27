import { supabaseHttpAdmin } from './lib/supabase-http'
import { hashPassword } from './server/auth-minimal'
import { nanoid } from 'nanoid'

async function createAdmin() {
  console.log('👤 Criando admin no Supabase...')
  
  try {
    const password = await hashPassword('admin123')
    
    const { data, error } = await supabaseHttpAdmin.from('Admin').insert({
      id: nanoid(),
      email: 'admin@passarei.com',
      password: password,
      name: 'Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    
    if (error) {
      console.error('❌ Erro:', error)
      return
    }
    
    console.log('✅ Admin criado com sucesso!')
    console.log('📧 Email: admin@passarei.com')
    console.log('🔑 Senha: admin123')
    
  } catch (err: any) {
    console.error('❌ Erro:', err.message)
  }
}

createAdmin()
