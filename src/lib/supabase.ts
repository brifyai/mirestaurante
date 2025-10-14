import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://pmpbwtxcwlmjprfmnpny.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtcGJ3dHhjd2xtanByZm1ucG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTgyMTAsImV4cCI6MjA3NTY5NDIxMH0.W3hMgNerh_4rW-eDJIgs38O-yLCRMf3GS7MzLiQjHrk";
const supabaseServiceRoleKey =
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtcGJ3dHhjd2xtanByZm1ucG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTgyMTAsImV4cCI6MjA3NTY5NDIxMH0.W3hMgNerh_4rW-eDJIgs38O-yLCRMf3GS7MzLiQjHrk";

// Cliente para uso en el navegador (con clave anónima)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente para uso en el servidor (con clave de servicio)
export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);

// Configuración de conexión directa a PostgreSQL para operaciones complejas
export const supabaseDirectConfig = {
  host: process.env.SUPABASE_HOST || "aws-1-us-east-2.pooler.supabase.com",
  port: parseInt(process.env.SUPABASE_PORT || "6543"),
  database: process.env.SUPABASE_DATABASE || "postgres",
  user: process.env.SUPABASE_USER || "postgres.zumuzfusdjxciehieabx",
  password: process.env.SUPABASE_PASSWORD || "GrsDQVccEy5YbJx8",
  pool_mode: process.env.SUPABASE_POOL_MODE || "transaction",
};
