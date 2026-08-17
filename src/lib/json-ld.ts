import type { Rubro, Tenant, TenantContent } from "@/lib/types";

// SEO local (webya.md sección 7): requisito base para los 3 niveles, no
// opcional. Mapea el rubro elegido por el admin al @type de schema.org
// más específico disponible — sin rubro, cae a LocalBusiness genérico.
const RUBRO_SCHEMA_TYPE: Record<Rubro, string> = {
  restaurante: "Restaurant",
  cafeteria: "CafeOrCoffeeShop",
  panaderia: "Bakery",
  carniceria_tienda: "GroceryStore",
  tienda_retail: "Store",
  // JewelryStore existe en schema.org como subtipo real de Store — se
  // agregó junto con plantilla_joyeria (2026-08-12, webya.md sección 5)
  // en vez de caer al "Store" genérico de tienda_retail.
  joyeria: "JewelryStore",
  // TravelAgency existe en schema.org como subtipo real de LocalBusiness —
  // se agregó junto con el caso DeluxTravel (código a medida, 2026-08-13),
  // mismo criterio que joyeria.
  agencia_viajes: "TravelAgency",
  // VeterinaryCare existe en schema.org como subtipo real de LocalBusiness
  // (organización médica) — se agregó junto con el caso Moonvet (código a
  // medida, 2026-08-13), mismo criterio que joyeria/agencia_viajes.
  veterinaria: "VeterinaryCare",
  // GeneralContractor existe en schema.org como subtipo real de
  // HomeAndConstructionBusiness (a su vez subtipo de LocalBusiness) — se
  // agregó junto con el caso JMJ Painting & Remodeling (código a medida,
  // 2026-08-16), mismo criterio que joyeria/agencia_viajes/veterinaria.
  contratista_remodelacion: "GeneralContractor",
  // Architect existe en schema.org como subtipo real de LocalBusiness
  // (servicio profesional) — se agregó junto con el caso Estudio de
  // Arquitectura (código a medida, 2026-08-17), mismo criterio que el
  // resto de rubros de esta lista.
  estudio_arquitectura: "Architect",
  // ToyStore existe en schema.org como subtipo real de Store — se agregó
  // junto con el caso ToyLand (código a medida, 2026-08-17), mismo
  // criterio que "joyeria" (JewelryStore).
  jugueteria: "ToyStore",
  servicios: "LocalBusiness",
  otro: "LocalBusiness",
};

const DIAS_ES: Record<string, string> = {
  lunes: "Monday",
  martes: "Tuesday",
  miércoles: "Wednesday",
  miercoles: "Wednesday",
  jueves: "Thursday",
  viernes: "Friday",
  sábado: "Saturday",
  sabado: "Saturday",
  domingo: "Sunday",
};
const ORDEN_DIAS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// "Lunes a sábado" -> ["Monday", ..., "Saturday"]. "Domingo" -> ["Sunday"].
// Texto que no calza con estos patrones (poco frecuente, pero posible en
// campo libre) devuelve null y esa fila simplemente se omite del JSON-LD
// en vez de arriesgar un dato incorrecto.
function parseDiasRango(diaTexto: string): string[] | null {
  const texto = diaTexto.toLowerCase().trim();
  const rango = texto.match(/^([a-záéíóúñ]+)\s+a\s+([a-záéíóúñ]+)$/i);
  if (rango) {
    const desde = DIAS_ES[rango[1]];
    const hasta = DIAS_ES[rango[2]];
    if (!desde || !hasta) return null;
    const i0 = ORDEN_DIAS.indexOf(desde);
    const i1 = ORDEN_DIAS.indexOf(hasta);
    if (i0 === -1 || i1 === -1 || i1 < i0) return null;
    return ORDEN_DIAS.slice(i0, i1 + 1);
  }
  const dias = texto
    .split(/\s*(?:,|y)\s*/)
    .map((d) => DIAS_ES[d.trim()])
    .filter((d): d is string => Boolean(d));
  return dias.length > 0 ? dias : null;
}

// "6:00 am" -> "06:00". Formato 12h con am/pm, único formato que usan los
// horarios cargados en el panel.
function parseHora12(horaTexto: string): string | null {
  const m = horaTexto.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const meridiano = m[3].toLowerCase();
  if (meridiano === "pm" && h !== 12) h += 12;
  if (meridiano === "am" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

// "6:00 pm – 1:00 am" -> {opens:"18:00", closes:"01:00"}. closes < opens es
// válido en schema.org (significa que cruza medianoche), no se corrige.
function parseRangoHoras(horasTexto: string): { opens: string; closes: string } | null {
  const partes = horasTexto.split(/[–-]/).map((s) => s.trim());
  if (partes.length !== 2) return null;
  const opens = parseHora12(partes[0]);
  const closes = parseHora12(partes[1]);
  return opens && closes ? { opens, closes } : null;
}

function buildOpeningHoursSpecification(horarios: TenantContent["horarios"]) {
  const spec: { "@type": "OpeningHoursSpecification"; dayOfWeek: string[]; opens: string; closes: string }[] = [];
  for (const h of horarios) {
    const dias = parseDiasRango(h.dia);
    const horas = parseRangoHoras(h.horas);
    if (dias && horas) {
      spec.push({ "@type": "OpeningHoursSpecification", dayOfWeek: dias, opens: horas.opens, closes: horas.closes });
    }
  }
  return spec;
}

// Construye el JSON-LD LocalBusiness (o subtipo más específico según
// rubro) a partir de datos que ya existen en tenant_content — nada de
// esto requiere una integración externa. `url` es la URL pública completa
// de la landing (para el campo `url`); `baseUrl` (solo protocolo+host) es
// para resolver `image` a absoluta, igual criterio que el Open Graph de
// generateMetadata — schema.org espera URLs absolutas, no relativas.
export function buildLocalBusinessJsonLd(tenant: Tenant, content: TenantContent, url: string, baseUrl: string) {
  const tipo = content.rubro ? RUBRO_SCHEMA_TYPE[content.rubro] : "LocalBusiness";

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": tipo,
    name: tenant.nombre,
    url,
  };

  if (content.textos.descripcion) jsonLd.description = content.textos.descripcion;
  if (content.telefonoWhatsapp) jsonLd.telephone = content.telefonoWhatsapp;
  const fotoHero = content.fotos[0]?.url;
  if (fotoHero) jsonLd.image = fotoHero.startsWith("http") ? fotoHero : `${baseUrl}${fotoHero}`;

  // "Cuenca"/"EC" estaban hardcodeados acá desde que este archivo solo
  // servía tenants ecuatorianos — dejó de ser correcto con el primer tenant
  // fuera de Ecuador (JMJ Painting & Remodeling, East Brunswick NJ, EE.UU.,
  // 2026-08-16). tenant_content no tiene columnas separadas para
  // localidad/país (solo `textos.direccion` como texto libre, sección 5 de
  // webya.md) y adivinarlas del texto sería frágil, así que en vez de
  // agregar una heurística poco confiable, streetAddress queda como el
  // único campo que se completa siempre — sigue siendo válido schema.org
  // (PostalAddress no exige el resto de sub-campos) y no le asigna a un
  // negocio de otro país/ciudad una localidad/país que no le corresponde.
  if (content.textos.direccion) {
    jsonLd.address = {
      "@type": "PostalAddress",
      streetAddress: content.textos.direccion,
    };
  }

  const openingHours = buildOpeningHoursSpecification(content.horarios);
  if (openingHours.length > 0) jsonLd.openingHoursSpecification = openingHours;

  if (content.googleRating != null && content.googleReviewCount != null) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: content.googleRating,
      reviewCount: content.googleReviewCount,
    };
  }

  return jsonLd;
}
