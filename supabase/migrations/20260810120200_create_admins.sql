-- ============================================================================
-- admins
-- ----------------------------------------------------------------------------
-- Marca qué usuarios de Supabase Auth son administradores internos (Paul y
-- futuro equipo), con acceso total a todos los tenants. Ver webya.md
-- sección 5, "Panel administrador".
--
-- id referencia directamente a auth.users: un admin ES un usuario de Auth
-- que además tiene fila aquí. No hay password propio ni tabla paralela.
-- ============================================================================

create table if not exists public.admins (
  id uuid primary key
    references auth.users (id) on delete cascade,

  nombre text,

  created_at timestamptz not null default now()
);

comment on table public.admins is
  'Usuarios de Supabase Auth con rol administrador (acceso a todos los tenants).';

-- No hay política de INSERT para authenticated: dar de alta un admin nuevo
-- es una operación manual y poco frecuente (Paul + futuro equipo), se hace
-- desde el dashboard de Supabase o con la service_role key, nunca desde el
-- cliente. Mantiene la superficie de ataque mínima.
