-- ============================================================================
-- Repropone la columna modelos_3d (pensada originalmente para URLs de
-- modelos GLB, generados por IA a partir de fotos) como foto_destacada: un
-- único objeto {url, alt} o null. La columna nunca llegó a usarse — la
-- decisión revisada de Nivel 3/EXPERIENCE (webya.md sección 2, 2026-08-11)
-- reemplazó el flujo de modelo 3D real por un efecto pseudo-3D con GSAP
-- sobre una foto real del producto (componente ProductVisual). En vez de
-- sumar una columna nueva al lado de una muerta, se renombra y cambia de
-- forma esta.
-- ============================================================================

alter table public.tenant_content
  rename column modelos_3d to foto_destacada;

-- Hay que soltar el not null/default ANTES del update de abajo — si no,
-- el propio update viola la restricción que todavía sigue activa después
-- del rename (fue el error real la primera vez que se corrió esto).
alter table public.tenant_content
  alter column foto_destacada drop not null,
  alter column foto_destacada drop default;

-- Los valores existentes son todos '[]'::jsonb (el default anterior; nunca
-- se escribió nada real ahí) — se limpian a null, la forma nueva del campo.
update public.tenant_content
  set foto_destacada = null
  where foto_destacada = '[]'::jsonb;

comment on column public.tenant_content.foto_destacada is
  'Foto de producto destacado para el efecto ProductVisual (Nivel 3/EXPERIENCE, webya.md sección 2). Objeto {url, alt} o null — no hay foto por defecto.';
