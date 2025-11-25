import { supabase } from './lib/supabase'

async function testConnection() {
  console.log('🧪 Testando conexão com Supabase...')
  
  // Testar buscar planos
  const { data, error } = await supabase
    .from('Plan')
    .select('*')
    .limit(3)
  
  if (error) {
    console.error('❌ Erro:', error.message)
    return
  }
  
  console.log('✅ Conexão OK!')
  console.log('📊 Planos encontrados:', data?.length)
  console.log('Planos:', data)
}

testConnection()
