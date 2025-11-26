// Teste DIRETO do cliente HTTP (sem passar pelo servidor)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function testDirect() {
  console.log('🧪 Testando cliente HTTP puro...')
  console.log('URL:', SUPABASE_URL)
  console.log('Key:', SUPABASE_KEY ? 'OK' : 'FALTANDO')
  console.log('')
  
  try {
    const url = `${SUPABASE_URL}/rest/v1/Lead?select=*&limit=3`
    
    console.log('📡 Fazendo requisição para:', url)
    
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('📊 Status:', response.status)
    
    if (!response.ok) {
      const error = await response.text()
      console.error('❌ Erro:', error)
      return
    }

    const data = await response.json()
    console.log('✅ Sucesso!')
    console.log('📦 Leads encontrados:', data.length)
    console.log('Dados:', JSON.stringify(data, null, 2))
  } catch (error: any) {
    console.error('❌ Erro:', error.message)
  }
}

testDirect()
