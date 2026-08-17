import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { contentFromRow, emptyContent, tenantFromRow, type TenantContentRow, type TenantRow } from "@/lib/supabase/mappers";
import type { DominioTipo, EstadoLanding, Nivel, Plan, TenantContent, TenantWithContent } from "@/lib/types";

// Toda la lectura/escritura del panel admin y del panel de autoedición pasa
// por aquí, con el cliente de sesión (src/lib/supabase/server.ts). Ya NO
// usa la service_role key: ahora que hay Supabase Auth real, las políticas
// RLS (is_admin() / is_tenant_owner(), ver
// /supabase/migrations/20260810120500_enable_rls_and_policies.sql) son las
// que de verdad deciden qué puede hacer cada sesión — si alguien sin
// permiso llega a llamar estas funciones, Postgres devuelve cero filas o
// rechaza el write, no el código de aquí. La service_role key queda
// reservada solo para crear cuentas de Auth (ver GestionAcceso).

export interface CrearTenantInput {
  nombre: string;
  slug: string;
  plan: Plan;
  nivel: Nivel | null;
  plantillaId: string | null;
  telefonoWhatsapp: string;
  direccion: string;
  horarios: { dia: string; horas: string }[];
}

export async function listTenants(): Promise<TenantWithContent[]> {
  const supabase = await createServerSupabaseClient();

  const { data: tenantRows } = await supabase.from("tenants").select("*").order("fecha_alta", { ascending: false });
  if (!tenantRows || tenantRows.length === 0) return [];

  const { data: contentRows } = await supabase
    .from("tenant_content")
    .select("*")
    .in(
      "tenant_id",
      tenantRows.map((row) => row.id),
    );

  const contentByTenant = new Map((contentRows ?? []).map((row) => [row.tenant_id, row as TenantContentRow]));

  return (tenantRows as TenantRow[]).map((row) => ({
    tenant: tenantFromRow(row),
    content: contentByTenant.has(row.id) ? contentFromRow(contentByTenant.get(row.id)!) : emptyContent(row.id),
  }));
}

export async function getTenantById(id: string): Promise<TenantWithContent | null> {
  const supabase = await createServerSupabaseClient();

  const { data: tenantRow } = await supabase.from("tenants").select("*").eq("id", id).maybeSingle<TenantRow>();
  if (!tenantRow) return null;

  const { data: contentRow } = await supabase
    .from("tenant_content")
    .select("*")
    .eq("tenant_id", id)
    .maybeSingle<TenantContentRow>();

  return { tenant: tenantFromRow(tenantRow), content: contentRow ? contentFromRow(contentRow) : emptyContent(id) };
}

// Usado por el panel de autoedición para ubicar su tenant por slug. Con
// sesión de admin, RLS deja ver cualquier slug; con sesión de cliente,
// tenants_owner_select solo deja ver el propio — si alguien intenta abrir
// el panel de otro negocio, esto devuelve null y la página hace notFound().
export async function getTenantBySlugAdmin(slug: string): Promise<TenantWithContent | null> {
  const supabase = await createServerSupabaseClient();

  const { data: tenantRow } = await supabase.from("tenants").select("*").eq("slug", slug).maybeSingle<TenantRow>();
  if (!tenantRow) return null;

  const { data: contentRow } = await supabase
    .from("tenant_content")
    .select("*")
    .eq("tenant_id", tenantRow.id)
    .maybeSingle<TenantContentRow>();

  return {
    tenant: tenantFromRow(tenantRow),
    content: contentRow ? contentFromRow(contentRow) : emptyContent(tenantRow.id),
  };
}

export async function crearTenant(input: CrearTenantInput): Promise<TenantWithContent> {
  // Repite a nivel de aplicación el constraint que ya existe en la
  // migración SQL (tenants_plan_fields_check), para dar feedback inmediato
  // en el formulario en vez de esperar el error de Postgres. `nivel` sigue
  // siendo NOT NULL en la base de datos aunque ya no varía (webya.md
  // sección 2, "fin de los 3 niveles de precio", 2026-08-13) — el
  // formulario de alta lo fija en 3 sin preguntarlo.
  if (!input.nivel) {
    throw new Error("El nivel es obligatorio.");
  }
  if (input.plan === "template" && !input.plantillaId) {
    throw new Error("Un tenant de tipo 'template' requiere una plantilla.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: tenantRow, error: tenantError } = await supabase
    .from("tenants")
    .insert({
      slug: input.slug,
      nombre: input.nombre,
      plan: input.plan,
      nivel: input.nivel,
      plantilla_id: input.plan === "template" ? input.plantillaId : null,
      dominio_tipo: "subdominio",
      estado_landing: "borrador",
    })
    .select()
    .single<TenantRow>();

  if (tenantError || !tenantRow) {
    // 23505 = unique_violation (constraint tenants_slug_key)
    if (tenantError?.code === "23505") throw new Error(`El slug "${input.slug}" ya está en uso.`);
    // Si la sesión no es admin, tenants_admin_all rechaza el insert y
    // Postgres devuelve una violación de RLS — el mensaje ya es claro.
    throw new Error(tenantError?.message ?? "No se pudo crear el tenant.");
  }

  const { data: contentRow, error: contentError } = await supabase
    .from("tenant_content")
    .insert({
      tenant_id: tenantRow.id,
      textos: { tagline: "", descripcion: "", diferenciador: "", direccion: input.direccion },
      precios: { nota: "", categorias: [] },
      horarios: input.horarios,
      telefono_whatsapp: input.telefonoWhatsapp,
      colores_marca: { fondo: "#1a1a1a", acento: "#d2a75a", texto: "#f5ecd9" },
      fotos: [],
      foto_destacada: null,
      pilares: [],
      pasos: [],
      formas_pago: [],
      instagram_url: null,
      facebook_url: null,
      faq: [],
      rubro: null,
      google_rating: null,
      google_review_count: null,
    })
    .select()
    .single<TenantContentRow>();

  if (contentError || !contentRow) throw new Error(contentError?.message ?? "No se pudo crear el contenido inicial.");

  return { tenant: tenantFromRow(tenantRow), content: contentFromRow(contentRow) };
}

export async function actualizarContenido(tenantId: string, patch: Partial<TenantContent>): Promise<TenantWithContent> {
  const payload: Record<string, unknown> = {};
  if (patch.textos) payload.textos = patch.textos;
  if (patch.precios) payload.precios = patch.precios;
  if (patch.horarios) payload.horarios = patch.horarios;
  if (patch.telefonoWhatsapp !== undefined) payload.telefono_whatsapp = patch.telefonoWhatsapp;
  if (patch.coloresMarca) payload.colores_marca = patch.coloresMarca;
  if (patch.fotos) payload.fotos = patch.fotos;
  // !== undefined (no truthy-check): null es un valor válido acá, significa
  // "quitar la foto destacada", no "no la toques".
  if (patch.fotoDestacada !== undefined) payload.foto_destacada = patch.fotoDestacada;
  if (patch.pilares) payload.pilares = patch.pilares;
  if (patch.pasos) payload.pasos = patch.pasos;
  if (patch.formasPago) payload.formas_pago = patch.formasPago;
  if (patch.instagramUrl !== undefined) payload.instagram_url = patch.instagramUrl;
  if (patch.facebookUrl !== undefined) payload.facebook_url = patch.facebookUrl;
  if (patch.faq) payload.faq = patch.faq;
  if (patch.rubro !== undefined) payload.rubro = patch.rubro;
  if (patch.googleRating !== undefined) payload.google_rating = patch.googleRating;
  if (patch.googleReviewCount !== undefined) payload.google_review_count = patch.googleReviewCount;
  if (patch.testimonios) payload.testimonios = patch.testimonios;
  if (patch.cifras) payload.cifras = patch.cifras;

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("tenant_content").update(payload).eq("tenant_id", tenantId);
  if (error) throw new Error(error.message);

  const full = await getTenantById(tenantId);
  if (!full) throw new Error("Tenant no encontrado.");
  return full;
}

export async function actualizarEstado(tenantId: string, estado: EstadoLanding): Promise<TenantWithContent> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("tenants").update({ estado_landing: estado }).eq("id", tenantId);
  if (error) throw new Error(error.message);

  const full = await getTenantById(tenantId);
  if (!full) throw new Error("Tenant no encontrado.");
  return full;
}

// Extensión de nombre de archivo a partir del MIME type — el nombre
// original del archivo no importa (se guarda siempre como "favicon.{ext}",
// con upsert), pero la extensión sí para que el navegador/CDN sirvan el
// content-type correcto por la URL.
const EXTENSION_POR_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
  "image/svg+xml": "svg",
};

const FAVICON_MAX_BYTES = 2 * 1024 * 1024; // 2MB, generoso para un ícono

// Sube el favicon al bucket de Storage "tenant-assets" (migración
// 20260817120000_favicon_upload.sql) con el cliente de sesión — RLS
// (tenant_assets_admin_insert/update, is_admin()) es lo que de verdad
// impide que alguien sin sesión de admin escriba acá, no este código.
// `upsert: true` con un nombre de archivo fijo por tenant ("favicon.{ext}")
// para que resubir simplemente reemplace la anterior sin acumular archivos
// huérfanos en el bucket.
export async function actualizarFavicon(tenantId: string, file: File): Promise<string> {
  const extension = EXTENSION_POR_MIME[file.type];
  if (!extension) {
    throw new Error("Formato no soportado — usa PNG, JPG, ICO o SVG.");
  }
  if (file.size > FAVICON_MAX_BYTES) {
    throw new Error("El archivo pesa más de 2MB — usa una imagen más liviana.");
  }

  const supabase = await createServerSupabaseClient();
  const path = `${tenantId}/favicon.${extension}`;

  const { error: uploadError } = await supabase.storage.from("tenant-assets").upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("tenant-assets").getPublicUrl(path);

  // Cache-bust: mismo path siempre, así que sin esto el navegador/CDN
  // podría seguir sirviendo la versión vieja tras un upsert.
  const urlConVersion = `${publicUrl}?v=${Date.now()}`;

  const { error: updateError } = await supabase.from("tenant_content").update({ favicon_url: urlConVersion }).eq("tenant_id", tenantId);
  if (updateError) throw new Error(updateError.message);

  return urlConVersion;
}

export async function actualizarDominio(
  tenantId: string,
  dominioTipo: DominioTipo,
  dominioCustom: string | null,
): Promise<TenantWithContent> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("tenants")
    .update({ dominio_tipo: dominioTipo, dominio_custom: dominioCustom })
    .eq("id", tenantId);
  if (error) throw new Error(error.message);

  const full = await getTenantById(tenantId);
  if (!full) throw new Error("Tenant no encontrado.");
  return full;
}
