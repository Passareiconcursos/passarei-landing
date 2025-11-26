import axios from 'axios'

const BASE_URL = 'http://localhost:5000'

async function testSupabaseRoutes() {
  console.log('🧪 TESTANDO ROTAS SUPABASE')
  console.log('==========================\n')

  try {
    // 1. Testar GET /api/leads
    console.log('1️⃣ Testando GET /api/leads...')
    const leadsResponse = await axios.get(`${BASE_URL}/api/leads`)
    console.log('✅ Leads encontrados:', leadsResponse.data.leads?.length || 0)
    console.log('')

    // 2. Testar POST /api/leads (criar novo lead)
    console.log('2️⃣ Testando POST /api/leads...')
    const newLead = {
      name: 'Teste Supabase',
      email: `teste.supabase.${Date.now()}@example.com`,
      phone: '11999999999',
      examType: 'PRF',
      state: 'SP',
      acceptedWhatsApp: true
    }
    const createLeadResponse = await axios.post(`${BASE_URL}/api/leads`, newLead)
    console.log('✅ Lead criado:', createLeadResponse.data.leadId)
    console.log('')

    // 3. Testar POST /api/admin/login
    console.log('3️⃣ Testando POST /api/admin/login...')
    const loginResponse = await axios.post(
      `${BASE_URL}/api/admin/login`,
      {
        email: 'admin@passarei.com',
        password: 'admin123'
      },
      {
        withCredentials: true
      }
    )
    console.log('✅ Login realizado:', loginResponse.data.admin.email)
    
    // Pegar o cookie do login
    const cookies = loginResponse.headers['set-cookie']
    const token = cookies?.[0]?.split(';')[0]
    console.log('✅ Token recebido')
    console.log('')

    // 4. Testar GET /api/admin/me (rota protegida)
    console.log('4️⃣ Testando GET /api/admin/me (autenticado)...')
    const meResponse = await axios.get(
      `${BASE_URL}/api/admin/me`,
      {
        headers: {
          Cookie: token
        }
      }
    )
    console.log('✅ Admin autenticado:', meResponse.data.admin.email)
    console.log('')

    console.log('🎉 TODOS OS TESTES PASSARAM!')
    console.log('✅ Rotas Supabase funcionando perfeitamente!')

  } catch (error: any) {
    console.error('❌ ERRO NO TESTE:')
    console.error('Status:', error.response?.status)
    console.error('Mensagem:', error.response?.data?.error || error.message)
    console.error('Detalhes:', error.response?.data)
  }
}

testSupabaseRoutes()
