-- ============================================================================
-- Reset del catálogo de plantillas (webya.md sección 5, 2026-08-12): se
-- descarta el modelo de "plantilla reutilizable por rubro" — cada negocio
-- nuevo se construye como página propia (plan='custom_code', componente
-- en src/custom/registro.ts), no reutilizando una plantilla del catálogo.
--
-- Pero los 3 niveles START/PRO/EXPERIENCE (webya.md sección 2) siguen
-- siendo parte del modelo comercial — antes solo aplicaban a plan=
-- 'template' porque nivel determinaba qué capas del engine activaba una
-- plantilla; ahora determinan la sofisticación de cualquier página, sea
-- de plantilla (legado, 8 tenants existentes) o a medida (el camino
-- único de acá en adelante). Se relaja tenants_plan_fields_check para
-- exigir nivel en los dos planes, y mantener plantilla_id exclusivo de
-- plan='template' (nulo en custom_code, sin catálogo al que apuntar).
-- ============================================================================

alter table public.tenants
  drop constraint tenants_plan_fields_check;

alter table public.tenants
  add constraint tenants_plan_fields_check check (
    (plan = 'template' and nivel is not null and plantilla_id is not null)
    or
    (plan = 'custom_code' and nivel is not null and plantilla_id is null)
  );

comment on column public.tenants.nivel is
  'Nivel de sofisticación (1 START / 2 PRO / 3 EXPERIENCE) — aplica a cualquier plan desde 2026-08-12, no solo a plan=template (webya.md sección 5, reset del catálogo).';
