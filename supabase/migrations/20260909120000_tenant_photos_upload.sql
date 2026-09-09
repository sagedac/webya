-- ============================================================================
-- Subida de fotos de galería por el propio cliente (dueño del tenant)
-- ----------------------------------------------------------------------------
-- Hasta ahora, escribir en el bucket de Storage "tenant-assets" (creado en
-- 20260817120000_favicon_upload.sql) era exclusivo de is_admin() — el panel
-- de autoedición solo dejaba pegar una URL externa para `tenant_content.fotos`
-- (ver aviso "Subida de archivos pendiente de Supabase Storage" que traía
-- EditorContenidoCliente.tsx). Pedido explícito de Paul, 2026-09-09: que el
-- cliente pueda arrastrar sus propias fotos.
--
-- No se crea un bucket nuevo: se reutiliza "tenant-assets" (ya público para
-- lectura), y se agregan políticas de escritura para el dueño del tenant,
-- acotadas a su propia carpeta `{tenant_id}/...` dentro del bucket — un
-- cliente no puede escribir en la carpeta de otro tenant porque
-- is_tenant_owner() valida el primer segmento del path contra
-- auth.uid()/tenant_users, no solo que exista sesión. `storage.foldername()`
-- es la utilidad estándar de Supabase para extraer los segmentos de carpeta
-- de `storage.objects.name`; el primer segmento es el tenant_id (ver
-- convención de path en subirFotoTenant/actualizarFavicon,
-- src/lib/admin-tenants.ts).
-- ============================================================================

create policy "tenant_assets_owner_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'tenant-assets'
    and public.is_tenant_owner(((storage.foldername(name))[1])::uuid)
  );

create policy "tenant_assets_owner_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'tenant-assets'
    and public.is_tenant_owner(((storage.foldername(name))[1])::uuid)
  )
  with check (
    bucket_id = 'tenant-assets'
    and public.is_tenant_owner(((storage.foldername(name))[1])::uuid)
  );

create policy "tenant_assets_owner_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'tenant-assets'
    and public.is_tenant_owner(((storage.foldername(name))[1])::uuid)
  );
