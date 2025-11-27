import { getAllLeads } from './lib/db/leads'

async function test() {
  console.log('🧪 Testando getAllLeads diretamente...')
  
  try {
    const leads = await getAllLeads()
    console.log('✅ Sucesso!')
    console.log('📦 Leads:', leads.length)
  } catch (error: any) {
    console.error('❌ Erro:', error.message)
  }
}

test()
