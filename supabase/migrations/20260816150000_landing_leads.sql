-- ============================================================================
-- landing_leads
-- ----------------------------------------------------------------------------
-- Formulario de contacto de la landing de marketing de 26st (src/app/page.tsx,
-- 2026-08-16) — dueños de negocio interesados en tener su propia página
-- pidiendo que los contactemos. No hay canal de WhatsApp/teléfono propio para
-- esta landing todavía (a diferencia de los tenants, que sí lo tienen), así
-- que en vez de eso el lead queda guardado acá para revisión manual — sin
-- panel de gestión todavía, se consulta directo desde el dashboard de
-- Supabase o el SQL editor mientras no exista esa necesidad.
-- `origen` no es una FK a `tenants`: esta tabla no es por-tenant, es de la
-- landing de la plataforma misma — se deja como texto libre por si en el
-- futuro más de una página de marketing reutiliza el mismo mecanismo.
-- ============================================================================

create table if not exists public.landing_leads (
  id uuid primary key default gen_random_uuid(),

  origen text not null default '26st',

  nombre text not null,

  -- Email o teléfono, lo que el visitante haya preferido escribir — texto
  -- libre a propósito (mismo criterio que tenant_content.textos.direccion):
  -- no vale la pena forzar dos campos separados para un formulario de una
  -- sola línea de contacto.
  contacto text not null,

  mensaje text,

  created_at timestamptz not null default now()
);

create index if not exists landing_leads_created_at_idx
  on public.landing_leads (created_at desc);

comment on table public.landing_leads is
  'Leads del formulario de contacto de la landing de marketing (no de un tenant).';

alter table public.landing_leads enable row level security;

-- Cualquier visitante (incluye anon) puede enviar el formulario, pero nunca
-- leer los leads de otros — mismo patrón "insert público, lectura
-- restringida" que el resto del proyecto usa para escritura pública (ver
-- webya.md sección 5, RLS-first).
create policy "landing_leads_public_insert"
  on public.landing_leads
  for insert
  to anon, authenticated
  with check (true);

-- Solo admin puede leer/gestionar los leads recibidos.
create policy "landing_leads_admin_all"
  on public.landing_leads
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
