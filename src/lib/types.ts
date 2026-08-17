// Estos tipos reflejan 1:1 el esquema de /supabase/migrations. Cuando el
// proyecto Supabase real exista, este archivo es el punto de referencia
// para tipar las respuestas del cliente de Supabase (o para generarlas con
// `supabase gen types typescript`).

export type Nivel = 1 | 2 | 3;
export type Plan = "template" | "custom_code";
export type DominioTipo = "subdominio" | "dominio_propio";
export type EstadoLanding = "borrador" | "publicado" | "pausado";

export interface Tenant {
  id: string;
  slug: string;
  nombre: string;
  plan: Plan;
  nivel: Nivel | null;
  plantillaId: string | null;
  dominioTipo: DominioTipo;
  dominioCustom: string | null;
  selesTenantId: string | null;
  estadoLanding: EstadoLanding;
  fechaAlta: string;
}

export interface HorarioDia {
  dia: string;
  horas: string;
}

export interface ColoresMarca {
  fondo: string;
  acento: string;
  texto: string;
  secundario1?: string;
  secundario2?: string;
  secundario3?: string;
}

export interface Foto {
  url: string;
  alt: string;
}

export interface CategoriaProducto {
  nombre: string;
  items: string[];
}

// Bloques de confianza/información (webya.md sección 2) — comunes a los 3
// niveles, no diferenciación de tier.
export interface Pilar {
  titulo: string;
  descripcion: string;
}

export type FormaPago = "efectivo" | "transferencia" | "tarjeta";

export const FORMAS_PAGO_DISPONIBLES: { value: FormaPago; label: string }[] = [
  { value: "efectivo", label: "Efectivo" },
  { value: "transferencia", label: "Transferencia" },
  { value: "tarjeta", label: "Tarjeta" },
];

export interface FaqItem {
  pregunta: string;
  respuesta: string;
}

// Sección "Testimonios" (experimento vitrina-demo, webya.md sección 8).
// Vacío = sección omitida, mismo patrón que pilares/faq.
export interface Testimonio {
  autor: string;
  texto: string;
  rating: number;
}

// Sección "Contador de estadísticas" (experimento vitrina-demo). numero
// separado de sufijo para que el componente pueda animar solo el valor
// numérico limpio (ej. numero: 4.9, sufijo: "★" en vez de un string "4.9★").
export interface Cifra {
  numero: number;
  sufijo: string;
  etiqueta: string;
}

// Set fijo (no texto libre) para poder mapear de forma confiable al @type
// de schema.org correcto en el JSON-LD (ver src/lib/json-ld.ts) — adivinar
// el rubro por texto libre del nombre/descripción sería frágil.
// "joyeria" se agregó junto con plantilla_joyeria (2026-08-12) — hay un
// @type de schema.org específico y real (JewelryStore, subtipo de Store)
// que no calzaba en ninguno de los valores previos sin perder precisión
// SEO, así que se agregó en los 3 lugares que usan este enum en vez de
// caer a "tienda_retail" (ver src/lib/json-ld.ts RUBRO_SCHEMA_TYPE y el
// <select> de rubro en EditorContenido.tsx, que itera RUBROS_DISPONIBLES
// sin necesitar cambios propios).
// "agencia_viajes" se agregó junto con el caso DeluxTravel (código a
// medida, 2026-08-13) — mismo criterio que "joyeria": TravelAgency existe
// en schema.org como subtipo real de LocalBusiness y describe mejor una
// agencia de viajes que el "servicios"/LocalBusiness genérico que tenía
// cargado el tenant hasta ahora. El registro real en Supabase sigue
// diciendo "servicios" (no se tocó Supabase para este build) — este valor
// queda disponible para cuando se actualice el contenido desde el panel.
// "veterinaria" se agregó junto con el caso Moonvet (código a medida,
// 2026-08-13) — mismo criterio: VeterinaryCare existe en schema.org como
// subtipo real de LocalBusiness (organización médica veterinaria) y es
// más preciso que "servicios" genérico para una clínica veterinaria.
// "contratista_remodelacion" se agregó junto con el caso JMJ Painting &
// Remodeling (código a medida, 2026-08-16, primer tenant fuera de Ecuador
// — East Brunswick, NJ, EE.UU.) — mismo criterio que joyeria/agencia_viajes/
// veterinaria: GeneralContractor existe en schema.org como subtipo real de
// HomeAndConstructionBusiness (a su vez subtipo de LocalBusiness) y es más
// preciso que "servicios" genérico para un contratista de remodelación y
// pintura residencial.
// "estudio_arquitectura" se agregó junto con el caso Estudio de Arquitectura
// (código a medida, 2026-08-17) — Architect existe en schema.org como
// subtipo real de LocalBusiness (servicio profesional) y es más preciso que
// "servicios" genérico para un estudio de diseño arquitectónico.
export type Rubro = "restaurante" | "cafeteria" | "panaderia" | "carniceria_tienda" | "tienda_retail" | "joyeria" | "agencia_viajes" | "veterinaria" | "contratista_remodelacion" | "estudio_arquitectura" | "servicios" | "otro";

export const RUBROS_DISPONIBLES: { value: Rubro; label: string }[] = [
  { value: "restaurante", label: "Restaurante" },
  { value: "cafeteria", label: "Cafetería" },
  { value: "panaderia", label: "Panadería" },
  { value: "carniceria_tienda", label: "Carnicería / tienda de alimentos" },
  { value: "tienda_retail", label: "Tienda / retail" },
  { value: "joyeria", label: "Joyería" },
  { value: "agencia_viajes", label: "Agencia de viajes" },
  { value: "veterinaria", label: "Clínica veterinaria" },
  { value: "contratista_remodelacion", label: "Contratista / remodelación" },
  { value: "estudio_arquitectura", label: "Estudio de arquitectura" },
  { value: "servicios", label: "Servicios profesionales" },
  { value: "otro", label: "Otro / sin especificar" },
];

export interface TenantContent {
  tenantId: string;
  textos: {
    tagline: string;
    descripcion: string;
    diferenciador: string;
    // El doc de negocio (webya.md sección 5) pide capturar "dirección" en
    // el alta de cliente, pero el esquema de tenant_content no tiene una
    // columna dedicada para eso — vive dentro de este jsonb, igual que el
    // resto de textos libres.
    direccion: string;
  };
  precios: {
    // El diferenciador de El Establo es precio+variedad que cambia a
    // diario (ver webya.md sección 10) — por eso el esquema no fuerza
    // precios fijos por producto, solo categorías + una nota que dirige
    // a WhatsApp para el precio del día.
    nota: string;
    categorias: CategoriaProducto[];
  };
  horarios: HorarioDia[];
  telefonoWhatsapp: string;
  coloresMarca: ColoresMarca;
  fotos: Foto[];
  // Foto que usa el efecto ProductVisual (webya.md sección 2), obligatoria
  // para publicar. null si el tenant no tiene una asignada todavía.
  fotoDestacada: Foto | null;
  // "Por qué elegirnos". Vacío = sección omitida en el render.
  pilares: Pilar[];
  // "Cómo pedir". Vacío = la página puede usar un set de pasos por defecto (a criterio de cada componente).
  pasos: string[];
  formasPago: FormaPago[];
  instagramUrl: string | null;
  facebookUrl: string | null;
  // FAQ. Vacío = la página puede usar un set de preguntas por defecto (a criterio de cada componente).
  faq: FaqItem[];
  // Testimonios y cifras (experimento vitrina-demo). Vacío = sección omitida.
  testimonios: Testimonio[];
  cifras: Cifra[];
  // SEO local / JSON-LD LocalBusiness (webya.md sección 7). Todos
  // opcionales: sin rubro cae a LocalBusiness genérico; sin rating no se
  // incluye aggregateRating.
  rubro: Rubro | null;
  googleRating: number | null;
  googleReviewCount: number | null;
  // URL pública del favicon subido por el admin (Supabase Storage, bucket
  // tenant-assets — ver migración 20260817120000_favicon_upload.sql). null
  // = sin favicon propio subido todavía; src/app/[slug]/page.tsx cae en ese
  // caso al archivo estático en public/tenants/{slug}/ si existe, y si no,
  // al favicon genérico de la plataforma.
  faviconUrl: string | null;
}

export interface TenantWithContent {
  tenant: Tenant;
  content: TenantContent;
}
