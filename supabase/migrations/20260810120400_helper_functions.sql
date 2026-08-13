-- ============================================================================
-- Funciones auxiliares para las políticas RLS de la siguiente migración.
-- ----------------------------------------------------------------------------
-- Ambas son SECURITY DEFINER a propósito: una política RLS sobre `tenants`
-- que hiciera "select 1 from admins where id = auth.uid()" directamente
-- dispararía a su vez el RLS de `admins` para evaluar esa subconsulta, y
-- con SECURITY INVOKER eso puede derivar en recursión/errores según qué
-- política se evalúe primero. SECURITY DEFINER ejecuta la función con los
-- privilegios de su dueño (owner del esquema), evitando ese problema. Es el
-- patrón estándar recomendado por Supabase para checks de rol dentro de RLS.
-- ============================================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins where id = auth.uid()
  );
$$;

comment on function public.is_admin() is
  'True si el usuario autenticado actual es administrador (fila en admins).';

create or replace function public.is_tenant_owner(check_tenant_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.tenant_users
    where tenant_id = check_tenant_id
      and user_id = auth.uid()
  );
$$;

comment on function public.is_tenant_owner(uuid) is
  'True si el usuario autenticado actual es el dueño (cliente) del tenant dado.';
