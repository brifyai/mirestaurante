-- ============================================
-- FIX RLS POLICIES FOR CUSTOM AUTHENTICATION
-- ============================================

-- Primero, eliminar las políticas existentes que usan auth.uid()
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own restaurants" ON restaurants;
DROP POLICY IF EXISTS "Users can manage own restaurants" ON restaurants;
DROP POLICY IF EXISTS "Users can view own restaurant reservations" ON reservations;
DROP POLICY IF EXISTS "Users can manage own restaurant reservations" ON reservations;
DROP POLICY IF EXISTS "Users can view own restaurant review requests" ON review_requests;
DROP POLICY IF EXISTS "Users can manage own restaurant review requests" ON review_requests;
DROP POLICY IF EXISTS "Users can view own configuration" ON configurations;
DROP POLICY IF EXISTS "Users can manage own configuration" ON configurations;
DROP POLICY IF EXISTS "Users can view own restaurant messages" ON whatsapp_messages;
DROP POLICY IF EXISTS "Users can manage own restaurant messages" ON whatsapp_messages;

-- Crear políticas más flexibles para autenticación personalizada
-- Estas políticas asumen que la autenticación se maneja a nivel de aplicación

-- Políticas para users - Permitir todo temporalmente (solución rápida)
CREATE POLICY "Enable all operations for users table" ON users
    FOR ALL USING (true)
    WITH CHECK (true);

-- Políticas para restaurants - Permitir todo temporalmente (solución rápida)
CREATE POLICY "Enable all operations for restaurants table" ON restaurants
    FOR ALL USING (true)
    WITH CHECK (true);

-- Políticas para reservations - Permitir todo temporalmente (solución rápida)
CREATE POLICY "Enable all operations for reservations table" ON reservations
    FOR ALL USING (true)
    WITH CHECK (true);

-- Políticas para review_requests - Permitir todo temporalmente (solución rápida)
CREATE POLICY "Enable all operations for review_requests table" ON review_requests
    FOR ALL USING (true)
    WITH CHECK (true);

-- Políticas para configurations - Permitir todo temporalmente (solución rápida)
CREATE POLICY "Enable all operations for configurations table" ON configurations
    FOR ALL USING (true)
    WITH CHECK (true);

-- Políticas para whatsapp_messages - Permitir todo temporalmente (solución rápida)
CREATE POLICY "Enable all operations for whatsapp_messages table" ON whatsapp_messages
    FOR ALL USING (true)
    WITH CHECK (true);

-- Políticas para customers - Permitir todo temporalmente (solución rápida)
CREATE POLICY "Enable all operations for customers table" ON customers
    FOR ALL USING (true)
    WITH CHECK (true);

-- Políticas para marketing_campaigns - Permitir todo temporalmente (solución rápida)
CREATE POLICY "Enable all operations for marketing_campaigns table" ON marketing_campaigns
    FOR ALL USING (true)
    WITH CHECK (true);

-- Políticas para customer_feedback - Permitir todo temporalmente (solución rápida)
CREATE POLICY "Enable all operations for customer_feedback table" ON customer_feedback
    FOR ALL USING (true)
    WITH CHECK (true);

-- Políticas para review_metrics - Permitir todo temporalmente (solución rápida)
CREATE POLICY "Enable all operations for review_metrics table" ON review_metrics
    FOR ALL USING (true)
    WITH CHECK (true);

-- ============================================
-- STORAGE POLICIES FOR BUCKET 'img'
-- ============================================

-- Habilitar RLS en el bucket si no está habilitado
-- Esto se hace a nivel de bucket, no de tabla SQL

-- Nota: Para las políticas de storage, necesitas ejecutar estos comandos en el Dashboard de Supabase:

-- 1. Ve a Storage -> Policies
-- 2. Crea estas políticas para el bucket 'img':

/*
-- Política para permitir上传 de avatares (ejecutar en Dashboard)
CREATE POLICY "Allow avatar uploads" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'img' AND
        (storage.foldername(name))[1] = 'avatars'
    );

-- Política para permitir lectura de avatares (ejecutar en Dashboard)
CREATE POLICY "Allow public read access to avatars" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'img' AND
        (storage.foldername(name))[1] = 'avatars'
    );

-- Política para permitir actualizar avatares (ejecutar en Dashboard)
CREATE POLICY "Allow avatar updates" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'img' AND
        (storage.foldername(name))[1] = 'avatars'
    ) WITH CHECK (
        bucket_id = 'img' AND
        (storage.foldername(name))[1] = 'avatars'
    );
*/

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

/*
ESTA ES UNA SOLUCIÓN TEMPORAL Y RÁPIDA:
1. Estas políticas permiten TODAS las operaciones (permisos muy amplios)
2. En producción, deberías implementar políticas más específicas
3. Idealmente, deberías migrar al sistema de autenticación de Supabase
4. Para una solución a largo plazo, considera implementar JWT personalizado

PARA EJECUTAR ESTE SCRIPT:
1. Ve al Dashboard de Supabase
2. Ve a SQL Editor
3. Copia y pega este script
4. Ejecútalo

PARA LAS POLÍTICAS DE STORAGE:
1. Ve a Storage en el Dashboard
2. Selecciona el bucket 'img'
3. Ve a Policies
4. Crea manualmente las políticas mencionadas arriba

ALTERNATIVA SEGURA:
Si quieres mantener la seguridad, puedes deshabilitar RLS temporalmente:
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants DISABLE ROW LEVEL SECURITY;
-- ... y así para cada tabla

Y luego implementar la seguridad a nivel de aplicación.
*/
