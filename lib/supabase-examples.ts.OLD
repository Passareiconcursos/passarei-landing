import { supabase, supabaseAdmin } from './supabase'

// ==========================================
// EXEMPLOS DE QUERIES COM SUPABASE CLIENT
// ==========================================

// 1. SELECT - Buscar todos os planos
export async function getPlans() {
  const { data, error } = await supabase
    .from('Plan')
    .select('*')
    .eq('isActive', true)
    .order('sortOrder')
  
  if (error) throw error
  return data
}

// 2. SELECT ONE - Buscar um usuário por telefone
export async function getUserByPhone(phone: string) {
  const { data, error } = await supabase
    .from('User')
    .select('*')
    .eq('phone', phone)
    .single()
  
  if (error) throw error
  return data
}

// 3. INSERT - Criar novo lead
export async function createLead(leadData: {
  name: string
  email: string
  phone: string
  examType: string
  state: string
}) {
  const { data, error } = await supabase
    .from('Lead')
    .insert(leadData)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// 4. UPDATE - Atualizar usuário
export async function updateUser(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('User')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// 5. DELETE - Deletar (soft delete)
export async function deactivateUser(userId: string) {
  const { data, error } = await supabase
    .from('User')
    .update({ isActive: false })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// 6. JOIN - Buscar conteúdo com matéria
export async function getContentWithSubject(contentId: string) {
  const { data, error } = await supabase
    .from('Content')
    .select(`
      *,
      Subject:subjectId (
        id,
        name,
        displayName,
        category
      )
    `)
    .eq('id', contentId)
    .single()
  
  if (error) throw error
  return data
}

// 7. COUNT - Contar registros
export async function countActiveUsers() {
  const { count, error } = await supabase
    .from('User')
    .select('*', { count: 'exact', head: true })
    .eq('isActive', true)
  
  if (error) throw error
  return count
}

// 8. TRANSAÇÃO - Usar RPC para operações complexas
export async function createUserWithProfile(userData: any, profileData: any) {
  // Nota: Para transações complexas, melhor criar uma função no Supabase
  // e chamar via RPC
  const { data, error } = await supabaseAdmin
    .rpc('create_user_with_profile', {
      user_data: userData,
      profile_data: profileData
    })
  
  if (error) throw error
  return data
}
