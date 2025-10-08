
// Re-export de db.ts para compatibilidad
// Este archivo mantiene la compatibilidad con código existente que importa desde './prisma'
export { prisma, supabase, supabaseServer } from './db';
