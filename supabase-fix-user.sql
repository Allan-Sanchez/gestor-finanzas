-- =====================================================
-- FIX: Crear perfiles de usuario faltantes
-- =====================================================
-- Este script crea perfiles en public.users para usuarios
-- que existen en auth.users pero no tienen perfil
-- =====================================================

-- Insertar perfiles para usuarios que no los tienen
INSERT INTO public.users (id, full_name, avatar_url, currency)
SELECT
  au.id,
  au.raw_user_meta_data->>'full_name' as full_name,
  au.raw_user_meta_data->>'avatar_url' as avatar_url,
  COALESCE(au.raw_user_meta_data->>'currency', 'GTQ') as currency
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
);

-- Verificar que todos los usuarios ahora tienen perfil
SELECT
  au.id as auth_user_id,
  au.email,
  CASE
    WHEN pu.id IS NOT NULL THEN 'PERFIL CREADO ✓'
    ELSE 'FALTA PERFIL ✗'
  END as status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at DESC;
