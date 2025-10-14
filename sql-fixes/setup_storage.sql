-- ============================================
-- STORAGE SETUP FOR BUCKET 'img'
-- ============================================

-- Insertar bucket 'img' si no existe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'img',
    'img',
    true, -- público para que las URLs públicas funcionen
    5242880, -- 5MB límite
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES FOR BUCKET 'img'
-- ============================================

-- Política para permitir subida de archivos a avatares
CREATE POLICY "Allow avatar uploads" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'img' AND
        (storage.foldername(name))[1] = 'avatars'
    );

-- Política para permitir lectura pública de archivos en el bucket img
CREATE POLICY "Allow public read access to img bucket" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'img'
    );

-- Política para permitir actualización de archivos en avatares
CREATE POLICY "Allow avatar updates" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'img' AND
        (storage.foldername(name))[1] = 'avatars'
    ) WITH CHECK (
        bucket_id = 'img' AND
        (storage.foldername(name))[1] = 'avatars'
    );

-- Política para permitir eliminación de archivos en avatares
CREATE POLICY "Allow avatar deletions" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'img' AND
        (storage.foldername(name))[1] = 'avatars'
    );

-- ============================================
-- PERMISOS ADICIONALES
-- ============================================

-- Dar permisos al rol anon para el bucket
GRANT ALL ON SCHEMA storage TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO anon;
GRANT ALL ON storage.buckets TO anon;
GRANT ALL ON storage.objects TO anon;

-- Dar permisos al rol authenticated para el bucket
GRANT ALL ON SCHEMA storage TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que el bucket existe
SELECT * FROM storage.buckets WHERE id = 'img';

-- Verificar políticas creadas
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- ============================================
-- INSTRUCCIONES DE USO
-- ============================================

/*
PARA CONFIGURAR EL STORAGE EN SUPABASE:

1. EJECUTAR ESTE SCRIPT:
   - Ve al Dashboard de Supabase
   - Ve a SQL Editor
   - Copia y pega este script
   - Ejecútalo

2. VERIFICAR BUCKET:
   - Ve a Storage en el Dashboard
   - Deberías ver el bucket 'img'
   - Asegúrate de que sea público

3. VERIFICAR POLÍTICAS:
   - Ve a Storage -> Policies
   - Deberías ver las políticas creadas

4. PROBAR LA SUBIDA:
   - Intenta subir una imagen de perfil
   - Debería funcionar sin errores RLS

SOLUCIÓN DE PROBLEMAS:
- Si el bucket no aparece, créalo manualmente en el Dashboard
- Si las políticas no funcionan, créalas manualmente en el Dashboard
- Si sigue fallando, deshabilita RLS temporalmente para storage.objects

NOTA: Estas políticas permiten acceso relativamente abierto al bucket 'img'.
Para mayor seguridad, puedes restringir los accesos según tus necesidades específicas.
*/
```

Ahora también necesito crear una guía completa para solucionar el problema:
