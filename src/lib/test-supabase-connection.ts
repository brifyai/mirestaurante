import { supabase, supabaseServer } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('Probando conexión con Supabase...')
    
    // Probar conexión básica
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('Error de conexión con Supabase:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Conexión exitosa con Supabase')
    return { success: true, count: data?.[0]?.count || 0 }
  } catch (err) {
    console.error('Error inesperado al probar conexión:', err)
    return { success: false, error: (err as Error).message }
  }
}

// Función para ejecutar consultas SQL directas
export async function executeRawQuery(query: string) {
  try {
    // Nota: Esta función requiere el uso de la API RPC de Supabase
    // o una conexión directa a PostgreSQL
    const { data, error } = await supabaseServer.rpc('exec_sql', { sql_query: query })
    
    if (error) {
      console.error('Error ejecutando consulta:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (err) {
    console.error('Error inesperado ejecutando consulta:', err)
    return { success: false, error: (err as Error).message }
  }
}

// Función para verificar si las tablas existen
export async function checkTablesExist() {
  const tables = [
    'users',
    'restaurants',
    'accounts',
    'sessions',
    'qr_configurations',
    'qr_scans',
    'reservations',
    'system_permissions',
    'user_permissions',
    'review_requests',
    'review_metrics',
    'google_place_data',
    'review_templates',
    'review_incentives'
  ]
  
  const results: Record<string, boolean> = {}
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      results[table] = !error
      if (error) {
        console.log(`Tabla ${table} no existe o no es accesible:`, error.message)
      }
    } catch (err) {
      results[table] = false
      console.error(`Error verificando tabla ${table}:`, err)
    }
  }
  
  return results
}