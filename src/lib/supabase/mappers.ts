import type { CategoriaProducto, Cifra, DominioTipo, EstadoLanding, FaqItem, FormaPago, Foto, HorarioDia, Nivel, Pilar, Plan, Rubro, Tenant, TenantContent, Testimonio } from "@/lib/types";

// Forma cruda de las filas tal como las devuelve PostgREST (snake_case,
// igual que las columnas de /supabase/migrations). Estos tipos son el
// único lugar que conoce ese detalle — el resto de la app solo ve los
// tipos camelCase de src/lib/types.ts.
export interface TenantRow {
  id: string;
  slug: string;
  nombre: string;
  plan: Plan;
  nivel: Nivel | null;
  plantilla_id: string | null;
  dominio_tipo: DominioTipo;
  dominio_custom: string | null;
  seles_tenant_id: string | null;
  estado_landing: EstadoLanding;
  fecha_alta: string;
}

export interface TenantContentRow {
  tenant_id: string;
  textos: TenantContent["textos"] | null;
  precios: { nota: string; categorias: CategoriaProducto[] } | null;
  horarios: HorarioDia[] | null;
  telefono_whatsapp: string | null;
  colores_marca: TenantContent["coloresMarca"] | null;
  fotos: Foto[] | null;
  foto_destacada: Foto | null;
  pilares: Pilar[] | null;
  pasos: string[] | null;
  formas_pago: FormaPago[] | null;
  instagram_url: string | null;
  facebook_url: string | null;
  faq: FaqItem[] | null;
  rubro: Rubro | null;
  google_rating: number | null;
  google_review_count: number | null;
  testimonios: Testimonio[] | null;
  cifras: Cifra[] | null;
  favicon_url: string | null;
}

export function tenantFromRow(row: TenantRow): Tenant {
  return {
    id: row.id,
    slug: row.slug,
    nombre: row.nombre,
    plan: row.plan,
    nivel: row.nivel,
    plantillaId: row.plantilla_id,
    dominioTipo: row.dominio_tipo,
    dominioCustom: row.dominio_custom,
    selesTenantId: row.seles_tenant_id,
    estadoLanding: row.estado_landing,
    fechaAlta: row.fecha_alta,
  };
}

export function contentFromRow(row: TenantContentRow): TenantContent {
  return {
    tenantId: row.tenant_id,
    textos: row.textos ?? { tagline: "", descripcion: "", diferenciador: "", direccion: "" },
    precios: row.precios ?? { nota: "", categorias: [] },
    horarios: row.horarios ?? [],
    telefonoWhatsapp: row.telefono_whatsapp ?? "",
    coloresMarca: row.colores_marca ?? { fondo: "#1a1a1a", acento: "#d2a75a", texto: "#f5ecd9" },
    fotos: row.fotos ?? [],
    fotoDestacada: row.foto_destacada ?? null,
    pilares: row.pilares ?? [],
    pasos: row.pasos ?? [],
    formasPago: row.formas_pago ?? [],
    instagramUrl: row.instagram_url ?? null,
    facebookUrl: row.facebook_url ?? null,
    faq: row.faq ?? [],
    rubro: row.rubro ?? null,
    googleRating: row.google_rating ?? null,
    googleReviewCount: row.google_review_count ?? null,
    testimonios: row.testimonios ?? [],
    cifras: row.cifras ?? [],
    faviconUrl: row.favicon_url ?? null,
  };
}

// Un tenant creado sin fila de tenant_content todavía (no debería pasar en
// flujos normales, ya que crearTenant siempre inserta ambas) usa esto como
// resguardo para no romper el render.
export function emptyContent(tenantId: string): TenantContent {
  return {
    tenantId,
    textos: { tagline: "", descripcion: "", diferenciador: "", direccion: "" },
    precios: { nota: "", categorias: [] },
    horarios: [],
    telefonoWhatsapp: "",
    coloresMarca: { fondo: "#1a1a1a", acento: "#d2a75a", texto: "#f5ecd9" },
    fotos: [],
    fotoDestacada: null,
    pilares: [],
    pasos: [],
    formasPago: [],
    instagramUrl: null,
    facebookUrl: null,
    faq: [],
    rubro: null,
    googleRating: null,
    googleReviewCount: null,
    testimonios: [],
    cifras: [],
    faviconUrl: null,
  };
}
