import { Bitter, Work_Sans } from "next/font/google";
import Image from "next/image";
import {
  Bath,
  Blocks,
  ChefHat,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Droplets,
  Fence,
  Hammer,
  Layers,
  LayoutGrid,
  MapPin,
  MessageCircle,
  Phone,
  PaintRoller,
  Warehouse,
} from "lucide-react";
import type { CategoriaProducto, Foto, TenantWithContent } from "@/lib/types";
import { ScrollReveal } from "@/engine/ScrollReveal";
import { Parallax } from "@/engine/Parallax";

// JMJ Painting & Remodeling — East Brunswick, NJ, EE.UU. Cuarta página de
// código a medida bajo el modelo de webya.md sección 5 (reset del catálogo,
// 2026-08-12) y la primera fuera de Ecuador: negocio real, contratista de
// remodelación y pintura residencial. El dueño tenía un sitio propio
// (jmjpaintingandremodeling.com) que quedó comprometido/hackeado (contenido
// spam inyectado por un tercero) — este componente se construye desde cero
// con el contenido real y legítimo del negocio (nombre, slogan, teléfono,
// zona de servicio, lista de servicios, énfasis en experiencia/atención
// personalizada/cotización gratis), sin ninguna referencia al sitio viejo
// ni a su contenido inyectado.
//
// Paso 4 del proceso del agente constructor — criterio de nicho para ESTE
// negocio (contratista de remodelación + pintura de casa, no una
// constructora corporativa ni una cuadrilla de un solo oficio):
//
// - ¿Qué objetos/materiales/texturas pertenecen genuinamente a este
//   negocio? El rodillo y la brocha, la cinta métrica desplegada sobre un
//   plano, la muestra de pintura (paint chip) que cualquiera reconoce de
//   una ferretería, el drywall recién instalado, la cubierta (deck) de
//   madera, la manguera de hidrolavado sobre una entrada de auto. Sin fotos
//   propias todavía (ver nota de fotos abajo), las 7 fotos de muestra de
//   Unsplash se eligieron priorizando manos trabajando y resultado
//   terminado por sobre una persona posando de "contratista genérico de
//   stock" (mismo criterio ya aplicado en Moonvet/DeluxTravel).
// - ¿Qué vocabulario usaría el dueño? "Free estimate", "remodel", "crew",
//   "job", "on schedule" — no "integrated home transformation solutions"
//   ni relleno corporativo de constructora. El slogan real ya cargado
//   ("Premier Remodeler in Central New Jersey") se mantiene tal cual.
// - ¿Qué necesita ver/saber un cliente antes de llamar? Qué servicios
//   cubren exactamente (son 9, de baño a hidrolavado — muchos dueños de
//   casa no saben que el mismo contratista hace ambas cosas), que la
//   cotización es gratis y sin compromiso, en qué zona trabajan (East
//   Brunswick / East Central NJ, sin dirección de oficina exacta — es un
//   negocio que va a la casa del cliente, no un local con vitrina), y que
//   van a hablar con alguien real, no un buzón de voz corporativo.
//
// Firma visual (webya.md sección 7): "Swatch Board" — cada uno de los 9
// servicios se presenta como una muestra de pintura (paint chip) real:
// bloque de color sólido arriba con un "código de muestra" tipo ferretería
// (No. 01, No. 02...) y el nombre del servicio abajo, como una tarjeta que
// alguien se llevaría de una tienda de pinturas. Tiene sentido genuino para
// ESTE negocio porque "Painting" es literalmente la primera palabra del
// nombre — no es un patrón decorativo importado de otra página del
// proyecto. Se refuerza con un divisor tipo "cinta métrica" (marcas de
// pulgada en SVG) entre secciones en vez de un simple borde, ligado al
// mismo mundo de herramientas de un contratista.
//
// CTA principal: llamada telefónica (no WhatsApp) — a diferencia de los
// tenants ecuatorianos del proyecto, en EE.UU. lo normal para un
// contratista es que te llamen. `content.telefonoWhatsapp` sigue siendo el
// campo de esquema usado para guardar el número (mismo campo que usan las
// páginas de WhatsApp, solo que acá se renderiza como `tel:`), formateado
// a `+1XXXXXXXXXX`. Se ofrece un botón secundario de WhatsApp/mensaje de
// texto únicamente en el bloque de "Free Estimate" (varios contratistas sí
// usan ese canal para recibir fotos del proyecto antes de cotizar) — nunca
// como CTA primario ni repetido en cada sección, para no diluir la
// instrucción de "llama".
//
// Fotos: negocio real, pero sin fotos propias todavía — 7 fotos de muestra
// de Unsplash (licencia de uso comercial libre), descargadas a
// public/tenants/jmj/ (mismo patrón que Moonvet, no DeluxTravel: ese
// tenant sí tenía fotos reales de negocio así que solo el destino era
// Unsplash; acá TODO el set es de muestra). Ping de tracking obligatorio ya
// disparado a `links.download_location` de cada una durante la
// construcción. Atribución completa en el footer, en inglés (público
// angloparlante).
//
// Convención de tenant_content para esta página (documentada porque no hay
// una lista fija de secciones ni de qué significa cada campo):
// `precios.categorias` se usa como "Services" (nombre = servicio, items =
// qué incluye ese servicio) — mismo patrón ya usado en TrazoJoyas/Moonvet.
// `precios.nota` no se usa (este negocio no tiene una nota de precios
// variables que comunicar — la cotización es siempre gratis y a medida).
// `pilares`/`pasos`/`faq` con sus fallbacks de siempre (vacío = usa el set
// por defecto de esta página, documentado más abajo, todo en inglés).
// `textos.direccion` en este tenant NO es una dirección postal exacta
// geocodificable — JMJ es un negocio de zona de servicio, sin oficina con
// vitrina (ver nota de mapa/JSON-LD abajo); se usa como texto libre para
// describir la zona de servicio ("East Brunswick, NJ & East Central New
// Jersey"), mostrado en la sección de contacto y el footer, pero esta
// página deliberadamente NO intenta convertirlo en un embed de Google
// Maps — un pin geocodificado a partir de una zona de servicio (no una
// calle) sería impreciso o directamente engañoso (mismo principio que ya
// usan Moonvet/DeluxTravel de omitir el mapa antes que mostrar uno roto o
// incorrecto). `horarios` es opcional; si no se carga, la sección de
// contacto simplemente no muestra un horario en vez de inventar uno.
//
// Nota sobre JSON-LD (src/lib/json-ld.ts): ese archivo tenía
// `addressLocality: "Cuenca"` y `addressCountry: "EC"` hardcodeados —
// correcto para los tenants ecuatorianos anteriores, pero incorrecto para
// este (East Brunswick, NJ, EE.UU.). Se corrigió ahí mismo (no en esta
// página) para dejar de asumir Ecuador: ahora solo completa
// `streetAddress` con el texto libre que ya existe, sin inventar
// localidad/país que tenant_content no captura como campos propios. Ver
// comentario en ese archivo para el detalle.

const bitter = Bitter({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-bitter" });
const workSans = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-work-sans" });

// Tonos fijos de la "muestra de pintura" (Swatch Board) — a diferencia del
// acento (editable por tenant vía content.coloresMarca.acento), estos dos
// tonos son parte de la dirección de arte específica de esta página (mismo
// criterio que el "#0b2436" hardcodeado de DeluxTravel), no un campo de
// tenant_content: tenant_content.coloresMarca solo tiene fondo/acento/texto
// como campos que el panel admin sabe editar hoy (secundario1-3 existen en
// el tipo pero no en el formulario), así que forzar a que el admin cargue
// tonos adicionales para que esta página se vea bien no sería razonable.
const SWATCH_TERRACOTTA = "#C1652F";
const SWATCH_MADERA = "#8C6239";

const WHATSAPP_MSG_ESTIMATE = "Hi, I'd like to request a free estimate for a project. Here are some photos:";

// "732-709-6449" -> "17327096449". Antepone el código de país (+1, EE.UU.)
// cuando el número cargado tiene los 10 dígitos locales típicos de EE.UU. —
// si ya viene con código de país (11 dígitos) se respeta tal cual. Usado
// tanto por `telHref` (tel:) como por `waHref` (wa.me, que también necesita
// el número completo con código de país, no solo el local).
function digitosConCodigoPais(telefono: string): string {
  const digitos = telefono.replace(/\D/g, "");
  return digitos.length === 10 ? `1${digitos}` : digitos;
}

function telHref(telefono: string): string {
  return `tel:+${digitosConCodigoPais(telefono)}`;
}

function waHref(telefono: string, mensaje: string): string {
  return `https://wa.me/${digitosConCodigoPais(telefono)}?text=${encodeURIComponent(mensaje)}`;
}

// "7327096449" -> "(732) 709-6449". Si el número no tiene 10 dígitos (dato
// cargado distinto a lo esperado), se muestra tal cual llegó en vez de
// arriesgar un formato incorrecto.
function formatoTelefono(telefono: string): string {
  const digitos = telefono.replace(/\D/g, "").slice(-10);
  if (digitos.length !== 10) return telefono;
  return `(${digitos.slice(0, 3)}) ${digitos.slice(3, 6)}-${digitos.slice(6)}`;
}

// Busca la foto real ya cargada en content.fotos por nombre de archivo (el
// alt queda editable desde el panel admin); si el tenant todavía no cargó
// ninguna, cae a las 7 fotos de muestra locales (mismo mecanismo que
// Moonvet/DeluxTravel).
function foto(fotos: Foto[], archivo: string, altPorDefecto: string): Foto {
  return fotos.find((f) => f.url.endsWith(archivo)) ?? { url: `/tenants/jmj/${archivo}`, alt: altPorDefecto };
}

// Alcance de cada servicio — ASUNCIÓN razonable del agente constructor a
// partir del nombre del servicio (el sitio viejo listaba los 9 nombres,
// sin detalle de qué incluye cada uno), no confirmada palabra por palabra
// por el dueño. Editable desde el panel admin en cualquier momento sin
// tocar código (precios.categorias). Ver reporte de construcción.
const SERVICIOS_DEFAULT: CategoriaProducto[] = [
  { nombre: "Bathroom Remodeling", items: ["Tile, vanities & fixtures", "Full gut renovations", "Lighting & ventilation"] },
  { nombre: "Kitchen Remodeling", items: ["Cabinets & countertops", "Layout changes", "Backsplash & lighting"] },
  { nombre: "Basement Remodeling", items: ["Finished living space", "Framing & drywall", "Flooring & trim"] },
  { nombre: "Painting", items: ["Interior & exterior", "Cabinet refinishing", "Clean prep & sharp lines"] },
  { nombre: "Deck Repair & Installation", items: ["New deck builds", "Board & railing repair", "Staining & sealing"] },
  { nombre: "Drywall", items: ["Hanging & taping", "Patch & repair", "Paint-ready finish"] },
  { nombre: "Flooring", items: ["Hardwood & laminate", "Tile installation", "Subfloor repair"] },
  { nombre: "Pavers & Concrete", items: ["Walkways & patios", "Driveways", "Retaining work"] },
  { nombre: "Power Washing", items: ["Siding & driveways", "Decks & patios", "Pre-paint surface prep"] },
];

const PILARES_DEFAULT = [
  {
    titulo: "Years of hands-on experience",
    descripcion: "We've been remodeling and painting homes across central New Jersey for years — we know what a house this age needs, and we don't learn on your job.",
  },
  {
    titulo: "Personalized attention",
    descripcion: "You work directly with the crew doing the work, not a call center. We walk the job with you and answer your questions straight.",
  },
  {
    titulo: "Free estimates, no pressure",
    descripcion: "Call or reach out and we'll come take a look at your project — no cost, no obligation, no games.",
  },
];

const PASOS_DEFAULT = [
  "Call or reach out for a free estimate — tell us what you're planning",
  "We walk the job with you and give you a straight, no-pressure quote",
  "We get to work, on schedule, and keep you in the loop until it's done",
];

const FAQ_DEFAULT = [
  { pregunta: "Do you really offer free estimates?", respuesta: "Yes — call us and we'll come take a look at your project at no cost and no obligation. Phone estimates work too for smaller jobs." },
  { pregunta: "What areas do you serve?", respuesta: "We're based in East Brunswick and serve East Central New Jersey. Not sure we cover your town? Just give us a call." },
  { pregunta: "Do you handle both painting and remodeling on the same project?", respuesta: "Yes — a lot of our jobs combine both, like a kitchen remodel that also needs fresh paint and trim. One crew, one point of contact, start to finish." },
  { pregunta: "How far out are you booking?", respuesta: "It depends on the season and the size of the job. Call for a free estimate and we'll give you a realistic timeline for your project." },
];

// Atribución obligatoria (webya.md sección 3/7) — fotografía de muestra,
// ilustrativa, con licencia Unsplash de uso comercial libre. No son fotos
// de trabajos reales de JMJ (ver footer).
const CREDITOS_UNSPLASH = [
  { nombre: "Ali Mkumbwa", perfil: "https://unsplash.com/@mkumbwajr" },
  { nombre: "Zac Gudakov", perfil: "https://unsplash.com/@zacgudakov" },
  { nombre: "Clay Banks", perfil: "https://unsplash.com/@claybanks" },
  { nombre: "Sasun Bughdaryan", perfil: "https://unsplash.com/@sasun1990" },
  { nombre: "josh A. D.", perfil: "https://unsplash.com/@mista_j" },
  { nombre: "web seo", perfil: "https://unsplash.com/@webseoweb" },
];

// Ícono por servicio: intenta calzar por palabra clave del nombre (así el
// admin puede renombrar/reordenar servicios sin romper el ícono) y cae a
// Hammer si no reconoce ninguna.
function iconoServicio(nombre: string) {
  const n = nombre.toLowerCase();
  if (n.includes("bath")) return Bath;
  if (n.includes("kitchen")) return ChefHat;
  if (n.includes("basement")) return Warehouse;
  if (n.includes("paint")) return PaintRoller;
  if (n.includes("deck")) return Fence;
  if (n.includes("drywall")) return Layers;
  if (n.includes("floor")) return LayoutGrid;
  if (n.includes("paver") || n.includes("concrete")) return Blocks;
  if (n.includes("power wash") || n.includes("pressure wash")) return Droplets;
  return Hammer;
}

// Divisor "cinta métrica" — marcas de pulgada en SVG, la firma visual de
// esta página extendida a los separadores de sección (webya.md sección 7:
// ancla al mundo real de un contratista, no un simple <hr>). `id` evita
// colisión de <pattern> si el divisor se usa más de una vez en la página
// (los ids de SVG son globales al documento).
function CintaMetrica({ id, tono }: { id: string; tono: string }) {
  return (
    <div aria-hidden className="h-6 w-full sm:h-7" style={{ backgroundColor: `${tono}0f` }}>
      <svg viewBox="0 0 200 28" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <pattern id={id} width="20" height="28" patternUnits="userSpaceOnUse">
            <line x1="0.5" y1="28" x2="0.5" y2="9" stroke={tono} strokeWidth="1.4" opacity="0.5" />
            <line x1="10.5" y1="28" x2="10.5" y2="17" stroke={tono} strokeWidth="1" opacity="0.32" />
            <line x1="15.5" y1="28" x2="15.5" y2="21" stroke={tono} strokeWidth="1" opacity="0.2" />
            <line x1="5.5" y1="28" x2="5.5" y2="21" stroke={tono} strokeWidth="1" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="200" height="28" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

// CTA de llamada — equivalente al WhatsAppCTA de TrazoJoyas/DeluxTravel/
// Moonvet (webya.md sección 2: ícono + relleno sólido del color de acento +
// hover con elevación) pero para `tel:`, que es el canal primario pedido
// para este negocio. `var(--tenant-acento)` porque este componente vive
// fuera del closure de JMJPainting (mismo motivo que WhatsAppCTA en
// DeluxTravel) — se usa tanto dentro del componente principal como en la
// barra fija de móvil.
function CallCTA({
  href,
  children,
  size = "md",
  variant = "solido",
}: {
  href: string;
  children: React.ReactNode;
  size?: "sm" | "md";
  variant?: "solido" | "outline";
}) {
  const base = "inline-flex items-center gap-2 rounded-lg font-semibold shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0";
  const tamano = size === "sm" ? "px-4 py-2.5 text-sm" : "px-6 py-3.5 text-sm sm:text-base";
  return (
    <a
      href={href}
      className={`${base} ${tamano} ${variant === "solido" ? "text-white" : "border-2 border-current/30 bg-transparent"}`}
      style={variant === "solido" ? { backgroundColor: "var(--tenant-acento)" } : { color: "var(--tenant-acento)" }}
    >
      <Phone className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} strokeWidth={2.5} aria-hidden />
      {children}
    </a>
  );
}

// Botón secundario de texto/WhatsApp — solo usado en el bloque de Free
// Estimate (ver nota de CTA arriba), nunca como acción primaria.
function TextCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border-2 border-white/40 bg-black/20 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/70 sm:text-base"
    >
      <MessageCircle className="h-5 w-5" strokeWidth={2.5} aria-hidden />
      {children}
    </a>
  );
}

// Tarjeta "muestra de pintura" — la firma visual de esta página (ver nota
// arriba). Bloque de color sólido con el ícono del servicio + un "código de
// muestra" arriba (No. 01, 02...), nombre y alcance del servicio abajo,
// como una tarjeta de tienda de pinturas.
function MuestraServicio({
  numero,
  nombre,
  items,
  tono,
  icono: Icono,
  fondoTarjeta,
  delay,
}: {
  numero: string;
  nombre: string;
  items: string[];
  tono: string;
  icono: typeof Hammer;
  fondoTarjeta: string;
  delay: number;
}) {
  return (
    <ScrollReveal delay={delay} y={20}>
      <div className="group h-full overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md" style={{ borderColor: `${tono}35` }}>
        <div className="relative flex h-24 items-center justify-center transition-transform duration-300 group-hover:scale-[1.03] sm:h-28" style={{ backgroundColor: tono }}>
          <span className="absolute top-2.5 left-3 font-mono text-[11px] tracking-[0.15em] text-white/75">No. {numero}</span>
          <Icono className="h-8 w-8 text-white/95" strokeWidth={1.6} aria-hidden />
        </div>
        <div className="p-5" style={{ backgroundColor: fondoTarjeta }}>
          <h3 className={`${bitter.className} text-lg font-semibold`}>{nombre}</h3>
          {items.length > 0 && (
            <ul className="mt-2.5 space-y-1 text-sm opacity-75">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-1.5">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-60" strokeWidth={2} aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}

export function JMJPainting({ tenant, content }: TenantWithContent) {
  const acento = content.coloresMarca.acento;
  const fondo = content.coloresMarca.fondo;
  const texto = content.coloresMarca.texto;

  const servicios = content.precios.categorias.length > 0 ? content.precios.categorias : SERVICIOS_DEFAULT;
  const pilares = content.pilares.length > 0 ? content.pilares : PILARES_DEFAULT;
  const pasos = content.pasos.length > 0 ? content.pasos : PASOS_DEFAULT;
  const faq = content.faq.length > 0 ? content.faq : FAQ_DEFAULT;

  const telefono = content.telefonoWhatsapp;
  const telHrefPrincipal = telHref(telefono);
  const telFormateado = formatoTelefono(telefono);
  const zonaServicio = content.textos.direccion || "East Brunswick, NJ & East Central New Jersey";

  const fotoHero = foto(content.fotos, "hero.jpg", "A painter rolling warm yellow paint onto an interior wall");
  const fotoKitchen = foto(content.fotos, "kitchen.jpg", "A remodeled kitchen with a marble island and white cabinets");
  const fotoBathroom = foto(content.fotos, "bathroom.jpg", "A remodeled bathroom with green cabinets and a marble shower");
  const fotoDeck = foto(content.fotos, "deck.jpg", "A finished wooden deck with a table and chairs");
  const fotoCraft = foto(content.fotos, "craftsmanship.jpg", "Hands applying plaster to a wall with a trowel");
  const fotoEstimate = foto(content.fotos, "estimate.jpg", "A person holding a tape measure");
  const fotoExterior = foto(content.fotos, "exterior.jpg", "A concrete driveway in front of a house");
  const logo = foto(content.fotos, "logo.png", "JMJ Painting & Remodeling logo");

  // Tonos de la muestra de pintura, cíclicos entre el acento del tenant y
  // los dos tonos fijos de esta página (ver nota arriba) — un "paint deck"
  // real tampoco usa un color distinto por cada muestra, repite una
  // familia acotada de tonos.
  const tonosSwatch = [acento, SWATCH_TERRACOTTA, SWATCH_MADERA];

  return (
    <div
      style={{ ["--tenant-acento" as string]: acento, backgroundColor: fondo, color: texto }}
      className={`${bitter.variable} ${workSans.variable} min-h-screen font-sans`}
    >
      {/* Header — logo real del negocio (2026-08-16, reemplaza el ícono
          genérico + wordmark que se usaba mientras no había logo). El
          logo se resuelve con el mismo helper `foto()` que el resto de
          fotos: si el admin llega a subir otro archivo con este nombre
          desde el panel, lo reemplaza sin tocar código. */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-4 backdrop-blur-[2px] sm:px-10" style={{ backgroundColor: `${fondo}e6` }}>
        <Image src={logo.url} alt={logo.alt} width={160} height={48} className="h-9 w-auto sm:h-10" priority />
        <CallCTA href={telHrefPrincipal} size="sm">
          Call Now
        </CallCTA>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-28 pb-16 sm:px-10 sm:pt-36 sm:pb-24">
        <div aria-hidden className="pointer-events-none absolute top-0 left-0 h-[28rem] w-[28rem] rounded-full opacity-[0.14] blur-[110px]" style={{ backgroundColor: acento }} />

        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <ScrollReveal y={0} duration={0.5}>
              <p className="mb-4 text-xs font-medium tracking-[0.3em] uppercase opacity-70">General Contractor · East Brunswick, NJ</p>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.1} duration={0.7}>
              <h1 className={`${bitter.className} text-4xl leading-[1.08] font-semibold sm:text-5xl lg:text-[3.4rem]`}>
                {content.textos.tagline || "Premier Remodeler in Central New Jersey"}
              </h1>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.25} duration={0.7}>
              <p className="mt-6 max-w-lg text-base opacity-80 sm:text-lg">
                {content.textos.descripcion ||
                  `${tenant.nombre} stands ready to enhance your home — painting and full remodeling, from qualified professionals who treat your project like their own.`}
              </p>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.4} duration={0.7}>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm opacity-80">
                <span className="flex items-center gap-1.5">
                  <ClipboardCheck className="h-4 w-4" style={{ color: acento }} strokeWidth={2} aria-hidden />
                  Free estimates
                </span>
                <span className="flex items-center gap-1.5">
                  <Hammer className="h-4 w-4" style={{ color: acento }} strokeWidth={2} aria-hidden />
                  Painting &amp; full remodeling
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" style={{ color: acento }} strokeWidth={2} aria-hidden />
                  East Central NJ
                </span>
              </div>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.55} duration={0.7}>
              <div className="mt-8 flex flex-wrap gap-3">
                <CallCTA href={telHrefPrincipal}>Call {telFormateado}</CallCTA>
                <a
                  href="#estimate"
                  className="inline-flex items-center gap-2 rounded-lg border-2 px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 sm:text-base"
                  style={{ borderColor: `${texto}30` }}
                >
                  Get a Free Estimate
                </a>
              </div>
            </ScrollReveal>
          </div>

          <Parallax speed={0.15} className="relative mx-auto w-full max-w-md">
            <div aria-hidden className="pointer-events-none absolute -inset-6 rounded-[2rem] opacity-25 blur-2xl" style={{ backgroundColor: acento }} />
            <div className="relative overflow-hidden rounded-[1.75rem] border" style={{ borderColor: `${acento}40` }}>
              <Image src={fotoHero.url} alt={fotoHero.alt} width={800} height={950} className="aspect-[4/5] w-full object-cover" priority />
              <div className="absolute top-4 left-4 rounded-lg px-3 py-1.5 font-mono text-[11px] tracking-widest text-white/90 shadow-lg" style={{ backgroundColor: `${acento}e6` }}>
                No. 04 — INTERIOR
              </div>
            </div>
          </Parallax>
        </div>

        <div className="pointer-events-none relative mt-14 hidden justify-center opacity-40 sm:flex">
          <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden />
        </div>
      </section>

      <CintaMetrica id="cinta-hero" tono={texto} />

      {/* SERVICIOS — "Swatch Board", la firma visual de esta página */}
      <section className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">What we do</p>
            <h2 className={`${bitter.className} mb-2 text-3xl font-semibold sm:text-4xl`}>Pick your project</h2>
            <p className="mb-10 max-w-xl text-sm opacity-70 sm:text-base">Nine services, one crew — painting and remodeling under the same roof.</p>
          </ScrollReveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {servicios.map((cat, i) => (
              <MuestraServicio
                key={cat.nombre}
                numero={String(i + 1).padStart(2, "0")}
                nombre={cat.nombre}
                items={cat.items}
                tono={tonosSwatch[i % tonosSwatch.length]}
                icono={iconoServicio(cat.nombre)}
                fondoTarjeta={fondo}
                delay={(i % 3) * 0.08}
              />
            ))}
          </div>
        </div>
      </section>

      <CintaMetrica id="cinta-servicios" tono={texto} />

      {/* PORTFOLIO ILUSTRATIVO — fotos de muestra (ver footer), agrupadas
          por tipo de proyecto en vez de presentarse como trabajos reales
          de JMJ ya realizados. */}
      <section className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">The kind of work we do</p>
            <h2 className={`${bitter.className} mb-10 text-3xl font-semibold sm:text-4xl`}>Kitchens, baths &amp; outdoor spaces</h2>
          </ScrollReveal>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { foto: fotoKitchen, etiqueta: "Kitchen remodeling" },
              { foto: fotoBathroom, etiqueta: "Bathroom remodeling" },
              { foto: fotoDeck, etiqueta: "Deck installation & repair" },
            ].map((item, i) => (
              <ScrollReveal key={item.etiqueta} delay={i * 0.1}>
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border" style={{ borderColor: `${acento}30` }}>
                  <Image src={item.foto.url} alt={item.foto.alt} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-sm font-medium text-white">{item.etiqueta}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="px-6 py-16 sm:px-10 sm:py-20" style={{ backgroundColor: `${acento}0c` }}>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <ScrollReveal className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-2xl border" style={{ borderColor: `${acento}30` }}>
              <Image src={fotoCraft.url} alt={fotoCraft.alt} width={800} height={650} className="aspect-[6/5] w-full object-cover" />
            </div>
          </ScrollReveal>
          <div className="order-1 lg:order-2">
            <ScrollReveal>
              <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Why homeowners choose us</p>
            </ScrollReveal>
            <div className="mt-4 space-y-7">
              {pilares.map((pilar, i) => (
                <ScrollReveal key={pilar.titulo} delay={i * 0.1}>
                  <div className="border-l-2 pl-5" style={{ borderColor: acento }}>
                    <h3 className={`${bitter.className} text-xl font-semibold`}>{pilar.titulo}</h3>
                    <p className="mt-1.5 text-sm opacity-75 sm:text-base">{pilar.descripcion}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <p className="mb-2 text-center text-xs font-medium tracking-[0.3em] uppercase opacity-60">How it works</p>
            <h2 className={`${bitter.className} mb-12 text-center text-3xl font-semibold sm:text-4xl`}>From a call to a finished job</h2>
          </ScrollReveal>
          <div className="relative">
            <div aria-hidden className="absolute top-2 bottom-2 left-5 w-px opacity-25" style={{ backgroundColor: acento }} />
            <div className="space-y-10">
              {pasos.map((paso, i) => (
                <ScrollReveal key={paso} delay={i * 0.12}>
                  <div className="relative flex items-start gap-5 pl-0">
                    <span
                      className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold"
                      style={{ borderColor: acento, backgroundColor: fondo }}
                    >
                      {i + 1}
                    </span>
                    <p className="pt-2 text-base opacity-85 sm:text-lg">{paso}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FREE ESTIMATE — banda de conversión dedicada (id="estimate" es el
          destino del CTA secundario del hero), la mayor concentración de
          intención de "pedir cotización" de la página. */}
      <section id="estimate" className="relative flex min-h-[24rem] items-center overflow-hidden px-6 py-20 sm:px-10">
        <Image src={fotoEstimate.url} alt={fotoEstimate.alt} fill sizes="100vw" className="object-cover" />
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundColor: `${texto}cc` }} />
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <ScrollReveal>
            <p className="mb-3 text-xs font-medium tracking-[0.3em] text-white/70 uppercase">No obligation, no cost</p>
            <h2 className={`${bitter.className} mb-5 text-3xl font-semibold text-white sm:text-4xl`}>Get a Free Estimate</h2>
            <p className="mx-auto mb-8 max-w-lg text-base text-white/85 sm:text-lg">
              Tell us about your project and we&apos;ll come take a look — call for the fastest answer, or send us a text with a few photos.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <CallCTA href={telHrefPrincipal}>Call {telFormateado}</CallCTA>
              <TextCTA href={waHref(telefono, WHATSAPP_MSG_ESTIMATE)}>Text us photos</TextCTA>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <CintaMetrica id="cinta-estimate" tono={texto} />

      {/* EXTERIOR — respiro visual antes del FAQ, foto real de muestra de
          exterior de casa (asfalto/concreto) ligada a Pavers & Concrete /
          Power Washing. */}
      <section className="relative overflow-hidden">
        <Parallax speed={0.2} className="relative h-56 w-full sm:h-72">
          <Image src={fotoExterior.url} alt={fotoExterior.alt} fill sizes="100vw" className="object-cover" />
        </Parallax>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <ScrollReveal>
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Common questions</p>
            <h2 className={`${bitter.className} mb-8 text-3xl font-semibold sm:text-4xl`}>Frequently asked questions</h2>
          </ScrollReveal>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <ScrollReveal key={item.pregunta} delay={i * 0.06}>
                <details className="rounded-xl border p-4" style={{ borderColor: `${acento}30` }}>
                  <summary className="cursor-pointer font-medium">{item.pregunta}</summary>
                  <p className="mt-2 text-sm opacity-70">{item.respuesta}</p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO / ZONA DE SERVICIO — sin mapa (ver nota arriba: zona de
          servicio, no dirección exacta geocodificable). */}
      <section className="px-6 py-16 sm:px-10 sm:py-20" style={{ backgroundColor: `${acento}0c` }}>
        <div className="mx-auto max-w-2xl text-center">
          <ScrollReveal>
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Service area</p>
            <h2 className={`${bitter.className} mb-6 text-3xl font-semibold sm:text-4xl`}>We come to you</h2>

            <div className="flex flex-col items-center gap-3 text-base opacity-85">
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5 shrink-0" style={{ color: acento }} strokeWidth={1.8} aria-hidden />
                {zonaServicio}
              </span>
              {content.horarios.length > 0 && (
                <span className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0" style={{ color: acento }} strokeWidth={1.8} aria-hidden />
                  <span className="text-left">
                    {content.horarios.map((h) => (
                      <span key={h.dia} className="flex gap-2">
                        <span className="opacity-70">{h.dia}:</span>
                        <span>{h.horas}</span>
                      </span>
                    ))}
                  </span>
                </span>
              )}
            </div>

            <div className="mt-8">
              <CallCTA href={telHrefPrincipal}>Call {telFormateado}</CallCTA>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-10 text-xs opacity-70 sm:px-10" style={{ borderColor: `${acento}25` }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>
            {tenant.nombre} — {zonaServicio}
          </p>
          <div className="flex gap-4">
            {content.instagramUrl && (
              <a href={content.instagramUrl} target="_blank" rel="noreferrer" className="underline">
                Instagram
              </a>
            )}
            {content.facebookUrl && (
              <a href={content.facebookUrl} target="_blank" rel="noreferrer" className="underline">
                Facebook
              </a>
            )}
          </div>
        </div>
        {content.formasPago.length > 0 && <p className="mt-3">Payment methods: {content.formasPago.join(", ")}</p>}
        <p className="mt-4 max-w-3xl leading-relaxed">
          {tenant.nombre} doesn&apos;t have its own photos loaded yet — the photos on this page are sample images, licensed via Unsplash (free for
          commercial use), illustrative of remodeling and painting work in general (not actual completed jobs of this business), by{" "}
          {CREDITOS_UNSPLASH.map((c, i) => (
            <span key={c.nombre}>
              <a href={c.perfil} target="_blank" rel="noreferrer" className="underline">
                {c.nombre}
              </a>
              {i < CREDITOS_UNSPLASH.length - 1 ? (i === CREDITOS_UNSPLASH.length - 2 ? " and " : ", ") : ""}
            </span>
          ))}{" "}
          on{" "}
          <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="underline">
            Unsplash
          </a>
          .
        </p>
      </footer>

      {/* Call fijo móvil */}
      <div className="fixed right-5 bottom-5 z-40 sm:hidden">
        <span aria-hidden className="absolute inset-0 animate-ping rounded-full opacity-60" style={{ backgroundColor: acento }} />
        <CallCTA href={telHrefPrincipal} size="sm">
          Call Now
        </CallCTA>
      </div>
    </div>
  );
}
