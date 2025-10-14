# Guía para Solucionar Problemas de RLS en Subida de Imágenes

## Problema Detectado

Al intentar subir una imagen de perfil, aparece el error:
```
Error: Error al subir la imagen al almacenamiento: new row violates row-level security policy
```

## Causa del Problema

Las políticas de Row Level Security (RLS) en Supabase están configuradas para usar `auth.uid()`, pero la aplicación utiliza autenticación personalizada (custom auth), lo que hace que `auth.uid()` retorne `null` y bloquee las operaciones.

## Soluciones Propuestas

### Opción 1: Solución Rápida (Recomendada para desarrollo)

Ejecuta los siguientes scripts SQL en el Dashboard de Supabase:

#### 1. Arreglar Políticas RLS para Tablas
```sql
-- Ejecutar: sql-fixes/fix_rls_policies.sql
```

#### 2. Configurar Storage Bucket
```sql
-- Ejecutar: sql-fixes/setup_storage.sql
```

### Opción 2: Configuración Manual en Dashboard

#### Paso 1: Configurar Bucket 'img'

1. Ve a **Storage** en el Dashboard de Supabase
2. Si no existe el bucket 'img', créalo:
   - Name: `img`
   - Public: `true`
   - File size limit: `5242880` (5MB)
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

#### Paso 2: Configurar Políticas de Storage

1. Ve a **Storage → Policies**
2. Crea las siguientes políticas para el bucket 'img':

**Política 1: Permitir uploads de avatares**
```sql
CREATE POLICY "Allow avatar uploads" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'img' AND
        (storage.foldername(name))[1] = 'avatars'
    );
```

**Política 2: Permitir lectura pública**
```sql
CREATE POLICY "Allow public read access to img bucket" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'img'
    );
```

**Política 3: Permitir actualizaciones**
```sql
CREATE POLICY "Allow avatar updates" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'img' AND
        (storage.foldername(name))[1] = 'avatars'
    ) WITH CHECK (
        bucket_id = 'img' AND
        (storage.foldername(name))[1] = 'avatars'
    );
```

#### Paso 3: Arreglar Políticas de Tablas

1. Ve a **Authentication → Policies**
2. Para la tabla `users`, elimina las políticas existentes y crea:
```sql
CREATE POLICY "Enable all operations for users table" ON users
    FOR ALL USING (true) WITH CHECK (true);
```

### Opción 3: Solución Temporal en el Código

La aplicación ya incluye una solución temporal que:

1. Intenta la operación con el cliente regular
2. Si falla por RLS, usa el cliente de servicio
3. Muestra mensajes de error descriptivos

Esta solución funciona pero no es recomendable para producción.

## Verificación

Después de aplicar las soluciones:

1. **Verificar el bucket:**
   ```sql
   SELECT * FROM storage.buckets WHERE id = 'img';
   ```

2. **Verificar políticas de storage:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
   ```

3. **Probar la subida:**
   - Inicia sesión en la aplicación
   - Ve a tu perfil
   - Intenta subir una imagen
   - Debería funcionar sin errores

## Archivos Modificados

1. `src/pages/perfil/_components/perfil-content.tsx`
   - Mejorado manejo de errores RLS
   - Implementada solución temporal con fallback
   - Mejorados mensajes de error

2. `src/pages/auth/signin/page.tsx`
   - Corregido para usar tabla `users`
   - Usar campos `email` y `password`

3. `src/pages/auth/signup/page.tsx`
   - Implementada lógica de registro completa
   - Usar tabla `users`

## Notas Importantes

### Seguridad
- La solución rápida habilita permisos amplios (para desarrollo)
- Para producción, implementa políticas más específicas
- Considera migrar a autenticación de Supabase para mejor seguridad

### Alternativas a Largo Plazo

1. **Migrar a Auth de Supabase:**
   ```typescript
   const { data, error } = await supabase.auth.signInWithPassword({
     email,
     password,
   });
   ```

2. **Implementar JWT Personalizado:**
   - Configurar custom JWT
   - Modificar políticas para usar el JWT

3. **Seguridad a Nivel de Aplicación:**
   - Deshabilitar RLS
   - Implementar validación en el backend

## Soporte

Si el problema persiste después de aplicar estas soluciones:

1. Verifica que el bucket 'img' exista
2. Revisa las políticas en Storage → Policies
3. Verifica las variables de entorno
4. Revisa la consola del navegador para errores detallados

---

**Última actualización:** Esta guía fue creada para solucionar específicamente el problema de RLS en la subida de imágenes de perfil con autenticación personalizada.