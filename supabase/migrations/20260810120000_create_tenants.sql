-- ============================================================================
-- tenants
-- ----------------------------------------------------------------------------
-- Tabla central del modelo multi-tenant. Un tenant = un negocio con landing.
-- Ver webya.md, sección 5 "Modelo multi-tenant" para la referencia original.
-- ============================================================================

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),

  -- Identificador en la URL: sitioya.vercel.app/{slug} (Fase 1) y luego
  -- {slug}.sitioya.com (Fase 2). Formato restringido a minúsculas/números/
  -- guiones porque termina siendo parte de una URL pública y de un
  -- subdominio real más adelante.
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),

  nombre text not null,

  -- 'template'    -> usa una plantilla del catálogo + tenant_content
  -- 'custom_code' -> página propia en /app/custom/[slug]/page.tsx
  plan text not null
    check (plan in ('template', 'custom_code')),

  -- Nivel de sofisticación (1/2/3), solo aplica si plan = 'template'.
  nivel smallint
    check (nivel in (1, 2, 3)),

  -- Id de la plantilla del catálogo (ej. 'plantilla_carniceria_pizarra').
  -- No es FK a una tabla: el catálogo de plantillas vive en código
  -- (componentes Next.js), no en la base de datos (ver sección 5 del doc).
  plantilla_id text,

  -- Refuerza a nivel de base de datos la regla de negocio de la sección 5:
  -- plan=template siempre debe traer nivel + plantilla_id; plan=custom_code
  -- nunca los usa (esos tenants no tienen plantilla parametrizada).
  constraint tenants_plan_fields_check check (
    (plan = 'template' and nivel is not null and plantilla_id is not null)
    or
    (plan = 'custom_code' and nivel is null and plantilla_id is null)
  ),

  dominio_tipo text not null default 'subdominio'
    check (dominio_tipo in ('subdominio', 'dominio_propio')),

  dominio_custom text,

  -- Vínculo futuro con Seles (facturación electrónica). Sin FK real: Seles
  -- vive en un proyecto Supabase separado (ver sección 6 del doc).
  seles_tenant_id uuid,

  -- 'borrador' hasta que el admin revisa y publica desde el panel.
  estado_landing text not null default 'borrador'
    check (estado_landing in ('borrador', 'publicado', 'pausado')),

  fecha_alta timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

-- dominio_custom debe ser único, pero solo cuando existe (la mayoría de
-- tenants en Fase 1/2 no tienen dominio propio todavía).
create unique index if not exists tenants_dominio_custom_unique
  on public.tenants (dominio_custom)
  where dominio_custom is not null;

create index if not exists tenants_estado_landing_idx
  on public.tenants (estado_landing);

comment on table public.tenants is
  'Un registro por negocio/cliente. Fuente de verdad del modelo multi-tenant.';
