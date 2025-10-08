import { createClient } from '@supabase/supabase-js'
import { supabaseDirectConfig } from './supabase'

// Cliente de Supabase para uso general
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Cliente para uso en el navegador (con clave anónima)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para uso en el servidor (con clave de servicio)
export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey)

// Mantenemos la exportación de prisma para compatibilidad temporal
// pero ahora apunta a una función que utiliza Supabase
export const prisma = {
  // Modelos principales
  user: {
    findUnique: async ({ where }: any) => {
      const { data, error } = await supabaseServer
        .from('users')
        .select('*')
        .match(where)
        .single()
      
      if (error) throw error
      return data
    },
    findMany: async ({ where, include }: any) => {
      let query = supabaseServer.from('users').select('*')
      
      if (where) {
        Object.entries(where).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data
    },
    create: async ({ data }: any) => {
      const { data: newData, error } = await supabaseServer
        .from('users')
        .insert([data])
        .select()
        .single()
      
      if (error) throw error
      return newData
    },
    update: async ({ where, data }: any) => {
      const { data: updatedData, error } = await supabaseServer
        .from('users')
        .update(data)
        .match(where)
        .select()
        .single()
      
      if (error) throw error
      return updatedData
    },
    delete: async ({ where }: any) => {
      const { error } = await supabaseServer
        .from('users')
        .delete()
        .match(where)
      
      if (error) throw error
      return { success: true }
    }
  },
  
  // Otros modelos se irán agregando según se necesiten
  // Por ahora, esta es una implementación básica para compatibilidad
  
  // Función genérica para consultas
  $queryRaw: async (query: string, ...values: any[]) => {
    // Para consultas raw, usaremos la conexión directa a PostgreSQL
    // Esta implementación es temporal y debería mejorarse
    console.warn('Raw queries not fully implemented yet')
    return []
  },
  
  $transaction: async (operations: any[]) => {
    // Implementación básica de transacciones
    try {
      const results = []
      for (const operation of operations) {
        results.push(await operation())
      }
      return results
    } catch (error) {
      console.error('Transaction failed:', error)
      throw error
    }
  }
}

// Variable global para mantener compatibilidad
const globalForDb = globalThis as unknown as {
  db: typeof prisma | undefined
}

if (process.env.NODE_ENV !== 'production') globalForDb.db = prisma
