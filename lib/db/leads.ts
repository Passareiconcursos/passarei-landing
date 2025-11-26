import { supabaseHttp } from '../supabase-http'

export async function getAllLeads() {
  const { data, error } = await supabaseHttp.from('Lead').select('*')
  
  if (error) throw error
  return data || []
}

export async function createLead(leadData: {
  name: string
  email: string
  phone: string
  examType: string
  state: string
  acceptedWhatsApp?: boolean
}) {
  const { data, error } = await supabaseHttp.from('Lead').insert({
    ...leadData,
    acceptedWhatsApp: leadData.acceptedWhatsApp ?? false,
    status: 'NOVO',
    source: 'landing_page'
  })

  if (error) {
    if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
      throw new Error('EMAIL_DUPLICADO')
    }
    throw error
  }

  return Array.isArray(data) ? data[0] : data
}
