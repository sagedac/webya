-- ============================================================================
-- Bloques de confianza/información (webya.md sección 2, "estructura común"):
-- "Por qué elegirnos" (pilares), "Cómo pedir" (pasos), formas de pago y
-- redes sociales. Son información, no diferenciación de nivel — aplican
-- por igual a los 3 niveles. Todos nullable/con default vacío: un tenant
-- sin estos campos cargados simplemente omite esas secciones (excepto
-- "pasos", que usa un set por defecto razonable definido en código si el
-- tenant no lo personaliza — no hace falta sembrarlo acá).
-- ============================================================================

alter table public.tenant_content
  add column pilares jsonb not null default '[]'::jsonb,
  add column pasos jsonb not null default '[]'::jsonb,
  add column formas_pago jsonb not null default '[]'::jsonb,
  add column instagram_url text,
  add column facebook_url text;

comment on column public.tenant_content.pilares is
  'Array de {titulo, descripcion} — sección "Por qué elegirnos" (3 pilares sugeridos, no forzado). Vacío = sección omitida.';

comment on column public.tenant_content.pasos is
  'Array de strings — sección "Cómo pedir", numerada por posición. Vacío = la plantilla usa un set de 3 pasos por defecto (definido en código, no en DB).';

comment on column public.tenant_content.formas_pago is
  'Array de strings, valores de un set fijo (efectivo | transferencia | tarjeta) — checkboxes en el panel, no texto libre.';

comment on column public.tenant_content.instagram_url is
  'URL del perfil de Instagram del negocio. Null = no se muestra el ícono.';

comment on column public.tenant_content.facebook_url is
  'URL de la página de Facebook del negocio. Null = no se muestra el ícono.';
