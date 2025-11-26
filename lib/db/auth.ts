import { supabaseHttpAdmin } from '../supabase-http'
import { randomBytes } from 'crypto'

export async function createAdminSession(adminId: string): Promise<string> {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await supabaseHttpAdmin.from('AdminSession').insert({
    adminId,
    token,
    expiresAt: expiresAt.toISOString(),
  })

  return token
}

export async function verifyAdminSession(token: string): Promise<any | null> {
  const { data, error } = await supabaseHttpAdmin
    .from('AdminSession')
    .select('*,admin:Admin(*)', { token })

  if (error || !data || data.length === 0) {
    return null
  }

  const session = data[0]

  if (new Date(session.expiresAt) < new Date()) {
    return null
  }

  return session.admin
}

export async function logAuditAction(
  adminId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  changes: any
): Promise<void> {
  await supabaseHttpAdmin.from('AuditLog').insert({
    adminId,
    action: `${action} ${resourceType} ${resourceId}`,
    details: changes || null,
  })
}

export async function findAdminByEmail(email: string) {
  const { data, error } = await supabaseHttpAdmin
    .from('Admin')
    .select('*', { email })

  if (error || !data || data.length === 0) return null
  return data[0]
}
