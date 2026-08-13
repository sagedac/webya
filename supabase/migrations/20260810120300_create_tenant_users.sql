-- ============================================================================
-- tenant_users
-- ----------------------------------------------------------------------------
-- NOTA DE DISEÑO: esta tabla no está listada explícitamente en el esquema
-- de la sección 5 del doc, pero es necesaria para que la regla descrita ahí
-- se pueda aplicar: "Panel de autoedición: cada cliente, acceso solo a su
-- propio tenant" + "RLS separa: admin ve/edita todos los tenants, cliente
-- normal solo el suyo". Sin una tabla que vincule un usuario de Auth con
-- SU tenant, no hay forma de que una política RLS sepa cuál es "el suyo".
--
-- Es la opción más simple posible (webya.md sección 0): un usuario de
-- autoedición = dueño de exactamente un tenant. Cuando el admin usa
-- "Gestión de acceso del cliente" para generar credenciales, ese flujo
-- crea el usuario en Supabase Auth y una fila aquí.
-- ============================================================================

create table if not exists public.tenant_users (
  -- PK en user_id (no id propio) porque el modelo es 1 usuario -> 1 tenant.
  user_id uuid primary key
    references auth.users (id) on delete cascade,

  tenant_id uuid not null
    references public.tenants (id) on delete cascade,

  created_at timestamptz not null default now()
);

create index if not exists tenant_users_tenant_id_idx
  on public.tenant_users (tenant_id);

comment on table public.tenant_users is
  'Vincula un usuario de Supabase Auth (cliente) con el tenant que puede autoeditar.';
