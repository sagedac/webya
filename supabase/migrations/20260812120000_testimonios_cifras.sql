-- ============================================================================
-- Experimento vitrina-demo (webya.md sección 8, roadmap): dos secciones base
-- que hasta ahora no existían en tenant_content — "Testimonios" y "Contador
-- de estadísticas". Mismo patrón aditivo que pilares/pasos/formas_pago
-- (20260811210000_pilares_pasos_pago_redes.sql): columnas nullable-safe con
-- default vacío, no rompen los tenants existentes (quedan con arrays vacíos,
-- sección omitida en su render porque plantilla_carniceria_pizarra no las
-- usa todavía).
-- ============================================================================

alter table public.tenant_content
  add column testimonios jsonb not null default '[]'::jsonb,
  add column cifras jsonb not null default '[]'::jsonb;

comment on column public.tenant_content.testimonios is
  'Array de {autor, texto, rating} — sección "Testimonios". Vacío = sección omitida.';

comment on column public.tenant_content.cifras is
  'Array de {numero, sufijo, etiqueta} — sección "Contador de estadísticas". numero separado de sufijo para poder animar el valor numérico limpio. Vacío = sección omitida.';
