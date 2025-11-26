import { supabaseHttpAdmin } from '../supabase-http'

export async function getAllAdmins() {
  const { data, error } = await supabaseHttpAdmin
    .from('Admin')
    .select('id,email,name,role,isActive,createdAt')

  if (error) throw error
  return data || []
}

export async function getAdminById(id: string) {
  const { data, error } = await supabaseHttpAdmin
    .from('Admin')
    .select('*', { id })

  if (error) throw error
  return data && data.length > 0 ? data[0] : null
}
