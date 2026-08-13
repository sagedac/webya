-- ============================================================================
-- FAQ (acordeón, común a los 3 niveles) + datos para SEO local / JSON-LD
-- LocalBusiness (webya.md sección 2/7). `rubro` y el rating de Google son
-- campos nuevos: no existía nada de esto en el schema todavía pese a que
-- se pidieron como "ya existentes" — ver nota en la conversación. El
-- rating se escribe a mano por el admin (no hay integración con la API de
-- Google Places en el proyecto), y `rubro` es un select de opciones fijas
-- para poder mapear de forma confiable a un @type de schema.org en vez de
-- adivinarlo por texto libre del nombre/descripción.
-- ============================================================================

alter table public.tenant_content
  add column faq jsonb not null default '[]'::jsonb,
  add column rubro text,
  add column google_rating numeric(2, 1),
  add column google_review_count integer;

comment on column public.tenant_content.faq is
  'Array de {pregunta, respuesta}. Vacío = la plantilla usa un set de 3-4 preguntas por defecto (definido en código, no en DB) — mismo criterio que "pasos".';

comment on column public.tenant_content.rubro is
  'Categoría del negocio de un set fijo (ver Rubro en src/lib/types.ts) — determina el @type de schema.org en el JSON-LD (Restaurant, Bakery, CafeOrCoffeeShop, etc.). Null = LocalBusiness genérico.';

comment on column public.tenant_content.google_rating is
  'Rating de Google (0.0-5.0), cargado a mano por el admin desde la ficha de Google del negocio. Null = no se incluye aggregateRating en el JSON-LD.';

comment on column public.tenant_content.google_review_count is
  'Cantidad de reseñas de Google correspondiente a google_rating. Null = no se incluye aggregateRating.';
