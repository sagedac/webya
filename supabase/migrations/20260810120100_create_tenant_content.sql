-- ============================================================================
-- tenant_content
-- ----------------------------------------------------------------------------
-- Contenido editable de la landing de un tenant (textos, precios, horarios,
-- fotos, etc). Ver webya.md sección 5.
--
-- Relación 1:1 con tenants: tenant_id es a la vez PK y FK. Un tenant tiene
-- como máximo una fila de contenido.
--
-- Aplica principalmente a tenants con plan='template', pero el doc deja la
-- puerta abierta a que un tenant custom_code también use campos puntuales
-- de aquí (ej. precio, horario) si se decide que sean editables — por eso
-- esta tabla NO restringe por plan, para no cerrar esa puerta.
-- ============================================================================

create table if not exists public.tenant_content (
  tenant_id uuid primary key
    references public.tenants (id) on delete cascade,

  textos jsonb not null default '{}'::jsonb,
  precios jsonb not null default '{}'::jsonb,
  horarios jsonb not null default '{}'::jsonb,
  telefono_whatsapp text,
  colores_marca jsonb not null default '{}'::jsonb,

  -- Array de URLs (o de objetos {url, alt}) de fotos del negocio.
  fotos jsonb not null default '[]'::jsonb,

  -- Array de URLs de modelos GLB. Solo tiene datos para tenants Nivel 3;
  -- se deja disponible en todas las filas para no acoplar el esquema al
  -- nivel del tenant (que puede cambiar si el cliente hace upgrade).
  modelos_3d jsonb not null default '[]'::jsonb,

  updated_at timestamptz not null default now()
);

comment on table public.tenant_content is
  'Contenido editable por el panel de autoedición del cliente. 1 fila por tenant.';

-- Mantiene updated_at al día en cada edición, sin depender de que el
-- cliente (Next.js) recuerde setearlo manualmente.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tenant_content_set_updated_at on public.tenant_content;
create trigger tenant_content_set_updated_at
  before update on public.tenant_content
  for each row
  execute function public.set_updated_at();
