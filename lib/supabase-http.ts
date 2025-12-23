// Cliente HTTP puro para Supabase (sem WebSocket/Realtime)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

interface SupabaseResponse<T> {
  data: T | null
  error: any | null
}

async function supabaseFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  useServiceKey = false
): Promise<SupabaseResponse<T>> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`
    const key = useServiceKey ? SUPABASE_SERVICE_KEY : SUPABASE_KEY
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'apikey': key!,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      return { data: null, error: { message: error, status: response.status } }
    }

    const data = await response.json()
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error.message } }
  }
}

// Funções helper
export const supabaseHttp = {
  from: (table: string) => ({
    select: async (columns = '*', filters: Record<string, any> = {}) => {
      let endpoint = `${table}?select=${columns}`
      
      Object.entries(filters).forEach(([key, value]) => {
        endpoint += `&${key}=eq.${value}`
      })
      
      return supabaseFetch<any[]>(endpoint)
    },
    
    insert: async (data: any) => {
      return supabaseFetch<any>(table, {
        method: "POST",
        body: JSON.stringify(data),
      }, true);
    },

    update: async (data: any, filters: Record<string, any>) => {
      let endpoint = `${table}?`
      
      Object.entries(filters).forEach(([key, value], i) => {
        if (i > 0) endpoint += '&'
        endpoint += `${key}=eq.${value}`
      })
      
      return supabaseFetch<any>(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
    
    delete: async (filters: Record<string, any>) => {
      let endpoint = `${table}?`
      
      Object.entries(filters).forEach(([key, value], i) => {
        if (i > 0) endpoint += '&'
        endpoint += `${key}=eq.${value}`
      })
      
      return supabaseFetch<any>(endpoint, {
        method: 'DELETE',
      })
    },
  }),
}

export const supabaseHttpAdmin = {
  from: (table: string) => ({
    select: async (columns = '*', filters: Record<string, any> = {}) => {
      let endpoint = `${table}?select=${columns}`
      
      Object.entries(filters).forEach(([key, value]) => {
        endpoint += `&${key}=eq.${value}`
      })
      
      return supabaseFetch<any[]>(endpoint, {}, true)
    },
    
    insert: async (data: any) => {
      // Usar service key para insert
      return supabaseFetch<any>(table, {
        method: 'POST',
        },
        true
      )
    },
    insertOld: async (data: any) => {
      return supabaseFetch<any>(table, {
        method: 'POST',
        body: JSON.stringify(data),
      }, true)
    },
  }),
}
