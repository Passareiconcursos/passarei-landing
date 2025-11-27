import { supabaseHttp } from '../supabase-http'
import { nanoid } from 'nanoid'

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
    id: nanoid(), // Gerar ID único
    ...leadData,
    acceptedWhatsApp: leadData.acceptedWhatsApp ?? false,
    status: 'NOVO',
    source: 'landing_page',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  if (error) {
    if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
      throw new Error('EMAIL_DUPLICADO')
    }
    throw error
  }

  return Array.isArray(data) ? data[0] : data
}
