-- ============================================================================
-- RLS — mismo patrón que Seles (webya.md sección 5): admin ve/edita todos
-- los tenants, cliente normal solo el suyo. Además, las landings públicas
-- (sitioya.vercel.app/{slug}) necesitan poder leerse sin login siempre que
-- estén publicadas, así que se suma un tercer nivel: público/anon.
-- ============================================================================

alter table public.tenants enable row level security;
alter table public.tenant_content enable row level security;
alter table public.admins enable row level security;
alter table public.tenant_users enable row level security;

-- ----------------------------------------------------------------------------
-- tenants
-- ----------------------------------------------------------------------------

-- Público (incluye anon, para renderizar la landing sin login): solo
-- tenants ya publicados. Los borradores no deben ser visibles públicamente.
create policy "tenants_public_select_published"
  on public.tenants
  for select
  to anon, authenticated
  using (estado_landing = 'publicado');

-- Cliente dueño: puede ver su propio tenant aunque esté en borrador
-- (necesario para la vista previa antes de publicar).
create policy "tenants_owner_select"
  on public.tenants
  for select
  to authenticated
  using (public.is_tenant_owner(id));

-- Admin: acceso total (dashboard, alta de clientes, publicar, etc).
create policy "tenants_admin_all"
  on public.tenants
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- tenant_content
-- ----------------------------------------------------------------------------

-- Público: contenido solo de tenants publicados (misma regla que arriba,
-- vía subquery porque tenant_content no tiene su propia columna de estado).
create policy "tenant_content_public_select_published"
  on public.tenant_content
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.tenants t
      where t.id = tenant_content.tenant_id
        and t.estado_landing = 'publicado'
    )
  );

-- Cliente dueño: puede ver y editar (panel de autoedición) el contenido de
-- su propio tenant. Sin INSERT/DELETE: la fila la crea el admin en la carga
-- inicial de contenido; el cliente solo actualiza campos existentes.
create policy "tenant_content_owner_select"
  on public.tenant_content
  for select
  to authenticated
  using (public.is_tenant_owner(tenant_id));

create policy "tenant_content_owner_update"
  on public.tenant_content
  for update
  to authenticated
  using (public.is_tenant_owner(tenant_id))
  with check (public.is_tenant_owner(tenant_id));

-- Admin: acceso total (carga inicial de contenido, correcciones, etc).
create policy "tenant_content_admin_all"
  on public.tenant_content
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- admins
-- ----------------------------------------------------------------------------

-- Un admin puede confirmar su propio estado de admin (útil para que el
-- frontend sepa qué panel mostrar). Ver la lista completa de admins queda
-- reservado a is_admin() para no exponer la nómina completa a cada admin
-- individual sin necesidad.
create policy "admins_self_select"
  on public.admins
  for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

-- Sin políticas de insert/update/delete: gestión de admins vía dashboard de
-- Supabase / service_role key únicamente (ver comentario en la migración
-- que crea la tabla).

-- ----------------------------------------------------------------------------
-- tenant_users
-- ----------------------------------------------------------------------------

-- El cliente puede ver su propio vínculo (para saber cuál es "su" tenant_id
-- desde el frontend del panel de autoedición).
create policy "tenant_users_self_select"
  on public.tenant_users
  for select
  to authenticated
  using (user_id = auth.uid());

-- Admin: gestiona los vínculos (generar accesos de cliente).
create policy "tenant_users_admin_all"
  on public.tenant_users
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
