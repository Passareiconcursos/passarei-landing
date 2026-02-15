import { supabaseHttp } from '../supabase-http'
import { nanoid } from 'nanoid'

export async function getAllLeads() {
  const { data, error } = await supabaseHttp.from('leads').select('*')
  
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
  const { data, error } = await supabaseHttp.from('leads').insert({
    id: nanoid(), // Gerar ID único
    name: leadData.name,
    email: leadData.email,
    phone: leadData.phone,
    exam_type: leadData.examType,
    state: leadData.state,
    accepted_whats_app: leadData.acceptedWhatsApp ?? false,
    status: 'NOVO',
    source: 'landing_page',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })

  if (error) {
    if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
      throw new Error('EMAIL_DUPLICADO')
    }
    throw error
  }

  return Array.isArray(data) ? data[0] : data
}
