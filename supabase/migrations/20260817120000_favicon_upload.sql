-- ============================================================================
-- favicon_url + bucket de Storage "tenant-assets"
-- ----------------------------------------------------------------------------
-- Primer uso real de Supabase Storage en el proyecto (hasta ahora todas las
-- fotos vivían como archivos estáticos en public/tenants/{slug}/, colocados
-- a mano al construir cada página — ver webya.md sección 7, nota de
-- favicon). Esto NO reemplaza ese flujo para fotos en general (sigue
-- pendiente, ver el aviso "Subida de archivos pendiente de Supabase
-- Storage" en EditorContenidoCliente.tsx) — es específicamente para que
-- Paul pueda subir el favicon de un tenant desde el panel admin sin tocar
-- código/git, pedido explícito 2026-08-17.
-- ============================================================================

alter table public.tenant_content
  add column if not exists favicon_url text;

comment on column public.tenant_content.favicon_url is
  'URL pública del favicon subido por el admin (bucket de Storage tenant-assets). NULL = sin favicon propio todavía — src/app/[slug]/page.tsx cae al archivo estático en public/tenants/{slug}/ si existe, y si no, al favicon genérico de la plataforma.';

insert into storage.buckets (id, name, public)
values ('tenant-assets', 'tenant-assets', true)
on conflict (id) do nothing;

-- Público (incluye anon): puede LEER cualquier archivo del bucket — el
-- favicon se sirve directo desde esta URL en el <head> de cada landing
-- pública, sin sesión de por medio, igual que cualquier <img>/favicon
-- estático.
create policy "tenant_assets_public_select"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'tenant-assets');

-- Solo admin puede subir/reemplazar/borrar — mismo criterio is_admin() que
-- el resto de la escritura administrativa del proyecto (ver
-- 20260810120500_enable_rls_and_policies.sql). No hay política para
-- clientes (panel de autoedición): esta primera versión es admin-only,
-- pedido explícito de Paul ("entraría a cada empresa... y subiría el
-- favicon en esa parte" refiriéndose al panel admin).
create policy "tenant_assets_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'tenant-assets' and public.is_admin());

create policy "tenant_assets_admin_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'tenant-assets' and public.is_admin())
  with check (bucket_id = 'tenant-assets' and public.is_admin());

create policy "tenant_assets_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'tenant-assets' and public.is_admin());
