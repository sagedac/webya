"use client";

import { useEffect, useState } from "react";
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
  X,
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
// construcción. Atribución completa en el footer, en inglés y español
// (ver nota de idioma abajo). El logo (2026-08-16) sí es real, enviado por
// el dueño — se resuelve con el mismo helper `foto()` que el resto.
//
// Selector de idioma EN/ES (2026-08-16, pedido explícito de Paul): esta
// página es "use client" a partir de acá porque el toggle necesita estado
// de React (useState) — antes era un componente de servidor puro, pero no
// usa ninguna API exclusiva de servidor (tenant/content ya llegan resueltos
// como props desde src/app/[slug]/page.tsx), así que convertirla a cliente
// no cambia nada más. Alcance real del toggle, para que quede documentado:
//   - Todo el texto fijo de la interfaz (títulos de sección, botones, FAQ
//     por defecto, servicios/pilares/pasos por defecto) SÍ tiene traducción
//     completa — vive en código en los diccionarios de abajo (T, y los
//     *_EN/*_ES de cada sección), igual en espíritu a como ya funcionaban
//     los `_DEFAULT` (contenido de respaldo cuando el admin no cargó nada
//     propio), solo que ahora hay dos versiones por idioma en vez de una.
//   - El tagline y la descripción SÍ tienen contenido real ya cargado por
//     el admin en tenant_content.textos (no están vacíos, así que no entran
//     por el camino de "usa el default"). Para esos dos campos se agregó
//     una traducción "instantánea" (TAGLINE_ES/DESCRIPCION_ES) del texto
//     que había en inglés al momento de construir esto — es una traducción
//     fija en código, no una columna nueva en la base de datos (tenant_
//     content no guarda variantes por idioma, sección 5 de webya.md). Si el
//     dueño edita el texto en inglés desde el panel admin más adelante, la
//     versión en español queda desactualizada hasta que alguien la
//     actualice a mano acá — limitación conocida y aceptada, no un bug.
//   - Si el admin llega a cargar sus propios servicios/pilares/pasos/FAQ
//     personalizados (reemplazando los `_DEFAULT`), esos SIGUEN el idioma
//     en el que el admin los escribió, sin importar el toggle — no hay
//     traducción automática de contenido arbitrario cargado por el admin,
//     solo del contenido que ya vivía en código.

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

type Idioma = "en" | "es";

const WHATSAPP_MSG_ESTIMATE: Record<Idioma, string> = {
  en: "Hi, I'd like to request a free estimate for a project. Here are some photos:",
  es: "Hola, quisiera solicitar una cotización gratis para un proyecto. Aquí van algunas fotos:",
};

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
// arriesgar un formato incorrecto. Mismo formato en los dos idiomas — un
// número de teléfono no se "traduce".
function formatoTelefono(telefono: string): string {
  const digitos = telefono.replace(/\D/g, "").slice(-10);
  if (digitos.length !== 10) return telefono;
  return `(${digitos.slice(0, 3)}) ${digitos.slice(3, 6)}-${digitos.slice(6)}`;
}

// Busca la foto real ya cargada en content.fotos por nombre de archivo (el
// alt queda editable desde el panel admin); si el tenant todavía no cargó
// ninguna, cae a las fotos de muestra/logo locales (mismo mecanismo que
// Moonvet/DeluxTravel).
function foto(fotos: Foto[], archivo: string, altPorDefecto: string): Foto {
  return fotos.find((f) => f.url.endsWith(archivo)) ?? { url: `/tenants/jmj/${archivo}`, alt: altPorDefecto };
}

// Íconos de los 9 servicios por defecto, en el MISMO orden que
// SERVICIOS_DEFAULT_EN/ES de abajo — independiente del idioma, para que
// traducir el nombre del servicio nunca rompa qué ícono le corresponde
// (antes se resolvía por palabra clave en inglés dentro del nombre, lo cual
// se habría roto apenas el nombre estuviera en español).
const SERVICIOS_ICONOS = [Bath, ChefHat, Warehouse, PaintRoller, Fence, Layers, LayoutGrid, Blocks, Droplets];

// Alcance de cada servicio — ASUNCIÓN razonable del agente constructor a
// partir del nombre del servicio (el sitio viejo listaba los 9 nombres,
// sin detalle de qué incluye cada uno), no confirmada palabra por palabra
// por el dueño. Editable desde el panel admin en cualquier momento sin
// tocar código (precios.categorias) — si el admin carga sus propios
// servicios, reemplazan a ESTOS dos arrays por completo, en el idioma que
// el admin haya escrito (ver nota de alcance del toggle más arriba). Ver
// reporte de construcción original para el detalle de esta asunción.
const SERVICIOS_DEFAULT_EN: CategoriaProducto[] = [
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

const SERVICIOS_DEFAULT_ES: CategoriaProducto[] = [
  { nombre: "Remodelación de Baños", items: ["Azulejos, tocadores y accesorios", "Renovaciones completas", "Iluminación y ventilación"] },
  { nombre: "Remodelación de Cocinas", items: ["Gabinetes y encimeras", "Cambios de diseño", "Salpicadero e iluminación"] },
  { nombre: "Remodelación de Sótanos", items: ["Espacio habitable terminado", "Estructura y paneles de yeso", "Pisos y molduras"] },
  { nombre: "Pintura", items: ["Interior y exterior", "Restauración de gabinetes", "Preparación limpia y líneas precisas"] },
  { nombre: "Reparación e Instalación de Decks", items: ["Construcción de decks nuevos", "Reparación de tablas y barandas", "Tinte y sellado"] },
  { nombre: "Paneles de Yeso (Drywall)", items: ["Instalación y masillado", "Parches y reparaciones", "Acabado listo para pintar"] },
  { nombre: "Pisos", items: ["Madera y laminado", "Instalación de azulejos", "Reparación de subsuelo"] },
  { nombre: "Adoquines y Concreto", items: ["Senderos y patios", "Entradas de auto", "Muros de contención"] },
  { nombre: "Hidrolavado", items: ["Revestimientos y entradas", "Decks y patios", "Preparación de superficies antes de pintar"] },
];

// Ícono por servicio CARGADO POR EL ADMIN (no uno de los defaults, que usan
// SERVICIOS_ICONOS por índice — ver arriba) — intenta calzar por palabra
// clave en inglés dentro del nombre y cae a Hammer si no reconoce ninguna.
// Limitación conocida y ya existente antes del toggle de idioma: si el
// admin escribe el nombre del servicio en español, esto no lo va a matchear
// (las palabras clave son en inglés) y caerá a Hammer — no es una
// regresión del toggle, es el mismo comportamiento que ya tenía esta
// función para cualquier texto que no contuviera esas palabras en inglés.
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

const PILARES_DEFAULT_EN = [
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

const PILARES_DEFAULT_ES = [
  {
    titulo: "Años de experiencia práctica",
    descripcion: "Llevamos años remodelando y pintando casas en el centro de Nueva Jersey — sabemos lo que necesita una casa de esta edad, y no aprendemos con tu proyecto.",
  },
  {
    titulo: "Atención personalizada",
    descripcion: "Trabajas directamente con la cuadrilla que hace el trabajo, no con un centro de llamadas. Recorremos el proyecto contigo y respondemos tus preguntas sin rodeos.",
  },
  {
    titulo: "Cotizaciones gratis, sin presión",
    descripcion: "Llama o escríbenos y vamos a revisar tu proyecto — sin costo, sin compromiso, sin trucos.",
  },
];

const PASOS_DEFAULT_EN = [
  "Call or reach out for a free estimate — tell us what you're planning",
  "We walk the job with you and give you a straight, no-pressure quote",
  "We get to work, on schedule, and keep you in the loop until it's done",
];

const PASOS_DEFAULT_ES = [
  "Llama o escríbenos para una cotización gratis — cuéntanos qué estás planeando",
  "Recorremos el proyecto contigo y te damos una cotización clara, sin presión",
  "Nos ponemos a trabajar, a tiempo, y te mantenemos informado hasta terminar",
];

const FAQ_DEFAULT_EN = [
  { pregunta: "Do you really offer free estimates?", respuesta: "Yes — call us and we'll come take a look at your project at no cost and no obligation. Phone estimates work too for smaller jobs." },
  { pregunta: "What areas do you serve?", respuesta: "We're based in East Brunswick and serve East Central New Jersey. Not sure we cover your town? Just give us a call." },
  { pregunta: "Do you handle both painting and remodeling on the same project?", respuesta: "Yes — a lot of our jobs combine both, like a kitchen remodel that also needs fresh paint and trim. One crew, one point of contact, start to finish." },
  { pregunta: "How far out are you booking?", respuesta: "It depends on the season and the size of the job. Call for a free estimate and we'll give you a realistic timeline for your project." },
];

const FAQ_DEFAULT_ES = [
  { pregunta: "¿De verdad ofrecen cotizaciones gratis?", respuesta: "Sí — llámanos y vamos a revisar tu proyecto sin costo ni compromiso. Para trabajos pequeños, también podemos darte una cotización por teléfono." },
  { pregunta: "¿Qué zonas atienden?", respuesta: "Estamos ubicados en East Brunswick y atendemos el centro-este de Nueva Jersey. ¿No estás seguro si cubrimos tu ciudad? Solo llámanos." },
  { pregunta: "¿Hacen pintura y remodelación en el mismo proyecto?", respuesta: "Sí — muchos de nuestros trabajos combinan ambas cosas, como una remodelación de cocina que también necesita pintura y molduras nuevas. Una sola cuadrilla, un solo contacto, de principio a fin." },
  { pregunta: "¿Con cuánta anticipación están agendando?", respuesta: "Depende de la temporada y del tamaño del trabajo. Llama para una cotización gratis y te daremos un tiempo estimado realista para tu proyecto." },
];

// Traducción "instantánea" del contenido real ya cargado en
// tenant_content.textos (tagline/descripción) — ver nota de alcance del
// toggle más arriba para el porqué de este patrón y su limitación conocida.
const TAGLINE_ES = "El Remodelador Líder del Centro de Nueva Jersey";
const DESCRIPCION_ES =
  "Como el remodelador líder del centro-este de Nueva Jersey, JMJ Painting & Remodeling está listo para mejorar tu hogar. Años de experiencia, profesionales calificados y trabajo de calidad en cada proyecto — desde una sola habitación hasta una renovación completa.";

// Diccionario de todo el texto fijo de la interfaz (títulos, botones,
// etiquetas) — la otra mitad del toggle de idioma, junto con los `_EN/_ES`
// de arriba. `s.callConNumero(tel)` en vez de una plantilla de string
// directa porque el orden "Llamar al {tel}" vs "Call {tel}" cambia entre
// idiomas, no solo la palabra.
const T = {
  en: {
    callNow: "Call Now",
    heroEyebrow: "General Contractor · East Brunswick, NJ",
    badgeEstimate: "Free estimates",
    badgePainting: "Painting & full remodeling",
    badgeArea: "East Central NJ",
    callConNumero: (tel: string) => `Call ${tel}`,
    getEstimate: "Get a Free Estimate",
    heroPhotoBadge: "No. 04 — INTERIOR",
    servicesEyebrow: "What we do",
    servicesTitle: "Pick your project",
    servicesSubtitle: "Nine services, one crew — painting and remodeling under the same roof.",
    portfolioEyebrow: "The kind of work we do",
    portfolioTitle: "Kitchens, baths & outdoor spaces",
    portfolioKitchen: "Kitchen remodeling",
    portfolioBathroom: "Bathroom remodeling",
    portfolioDeck: "Deck installation & repair",
    whyEyebrow: "Why homeowners choose us",
    howEyebrow: "How it works",
    howTitle: "From a call to a finished job",
    estimateEyebrow: "No obligation, no cost",
    estimateTitle: "Get a Free Estimate",
    estimateBody: "Tell us about your project and we'll come take a look — call for the fastest answer, or send us a text with a few photos.",
    textPhotos: "Text us photos",
    faqEyebrow: "Common questions",
    faqTitle: "Frequently asked questions",
    areaEyebrow: "Service area",
    areaTitle: "We come to you",
    paymentMethods: "Payment methods: ",
    footerNotice: (nombre: string) =>
      `${nombre} doesn't have its own photos loaded yet — the photos on this page are sample images, licensed via Unsplash (free for commercial use), illustrative of remodeling and painting work in general (not actual completed jobs of this business), by `,
    footerOn: " on ",
    footerAnd: " and ",
    modalClose: "Close",
    modalCtaBody: "Get a free, no-obligation estimate for this project.",
    waMensajeServicio: (nombre: string) => `Hi, I'd like a free estimate for: ${nombre}`,
  },
  es: {
    callNow: "Llamar ahora",
    heroEyebrow: "Contratista General · East Brunswick, NJ",
    badgeEstimate: "Cotizaciones gratis",
    badgePainting: "Pintura y remodelación completa",
    badgeArea: "Centro-Este de NJ",
    callConNumero: (tel: string) => `Llamar al ${tel}`,
    getEstimate: "Solicita una Cotización Gratis",
    heroPhotoBadge: "No. 04 — INTERIOR",
    servicesEyebrow: "Qué hacemos",
    servicesTitle: "Elige tu proyecto",
    servicesSubtitle: "Nueve servicios, una sola cuadrilla — pintura y remodelación bajo un mismo techo.",
    portfolioEyebrow: "El tipo de trabajo que hacemos",
    portfolioTitle: "Cocinas, baños y espacios exteriores",
    portfolioKitchen: "Remodelación de cocina",
    portfolioBathroom: "Remodelación de baño",
    portfolioDeck: "Instalación y reparación de deck",
    whyEyebrow: "Por qué los dueños de casa nos eligen",
    howEyebrow: "Cómo funciona",
    howTitle: "De una llamada a un trabajo terminado",
    estimateEyebrow: "Sin compromiso, sin costo",
    estimateTitle: "Solicita una Cotización Gratis",
    estimateBody: "Cuéntanos sobre tu proyecto y vamos a revisarlo — llama para la respuesta más rápida, o envíanos un mensaje de texto con algunas fotos.",
    textPhotos: "Envíanos fotos por texto",
    faqEyebrow: "Preguntas comunes",
    faqTitle: "Preguntas frecuentes",
    areaEyebrow: "Zona de servicio",
    areaTitle: "Vamos hasta ti",
    paymentMethods: "Formas de pago: ",
    footerNotice: (nombre: string) =>
      `${nombre} todavía no tiene fotos propias cargadas — las fotos de esta página son imágenes de muestra, con licencia de Unsplash (uso comercial gratuito), ilustrativas de trabajos de remodelación y pintura en general (no son trabajos reales terminados de este negocio), por `,
    footerOn: " en ",
    footerAnd: " y ",
    modalClose: "Cerrar",
    modalCtaBody: "Solicita una cotización gratis y sin compromiso para este proyecto.",
    waMensajeServicio: (nombre: string) => `Hola, quisiera una cotización gratis para: ${nombre}`,
  },
} as const satisfies Record<Idioma, Record<string, string | ((arg: string) => string)>>;

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

// Toggle EN/ES — dos botones tipo pastilla, el idioma activo resaltado con
// el color de acento del tenant. Deliberadamente texto ("EN"/"ES"), no un
// ícono de globo/idioma: para el público de esta página (dueños de casa
// buscando un contratista) es más inmediato que un ícono ambiguo.
function LanguageToggle({ lang, onChange }: { lang: Idioma; onChange: (l: Idioma) => void }) {
  return (
    <div className="flex items-center overflow-hidden rounded-lg border" style={{ borderColor: "var(--tenant-acento)" }}>
      {(["en", "es"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          aria-pressed={lang === l}
          aria-label={l === "en" ? "Switch to English" : "Cambiar a español"}
          className="px-2.5 py-1.5 text-xs font-semibold tracking-wide transition sm:px-3"
          style={
            lang === l
              ? { backgroundColor: "var(--tenant-acento)", color: "#fff" }
              : { color: "var(--tenant-acento)" }
          }
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// Tarjeta "muestra de pintura" — la firma visual de esta página (ver nota
// arriba). Foto del servicio con un tinte del tono de la muestra encima
// (mantiene el look de "paint chip" sin perder la foto real), un "código de
// muestra" arriba (No. 01, 02...) y el ícono; nombre y alcance abajo, como
// una tarjeta de tienda de pinturas. Es un <button>, no un <div> — la
// tarjeta completa abre el popup de detalle (2026-08-16, pedido explícito
// de Paul: fotos en las tarjetas + click para ver detalle y pedir cotización
// de ese servicio específico).
function MuestraServicio({
  numero,
  nombre,
  items,
  tono,
  icono: Icono,
  fondoTarjeta,
  delay,
  fotoSrc,
  fotoAlt,
  onClick,
}: {
  numero: string;
  nombre: string;
  items: string[];
  tono: string;
  icono: typeof Hammer;
  fondoTarjeta: string;
  delay: number;
  fotoSrc?: string;
  fotoAlt?: string;
  onClick: () => void;
}) {
  return (
    <ScrollReveal delay={delay} y={20}>
      <button
        type="button"
        onClick={onClick}
        className="group block h-full w-full overflow-hidden rounded-2xl border text-left shadow-sm transition-shadow hover:shadow-md"
        style={{ borderColor: `${tono}35` }}
      >
        <div className="relative flex h-24 items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.03] sm:h-28" style={{ backgroundColor: tono }}>
          {fotoSrc && <Image src={fotoSrc} alt={fotoAlt ?? ""} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />}
          <div aria-hidden className="absolute inset-0" style={{ backgroundColor: tono, opacity: fotoSrc ? 0.55 : 1 }} />
          <span className="absolute top-2.5 left-3 font-mono text-[11px] tracking-[0.15em] text-white/85">No. {numero}</span>
          <Icono className="relative h-8 w-8 text-white/95" strokeWidth={1.6} aria-hidden />
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
      </button>
    </ScrollReveal>
  );
}

// Popup de detalle de servicio — se abre al hacer click en una tarjeta de
// MuestraServicio (estado servicioAbierto en JMJPainting). Mismo patrón de
// lightbox (backdrop click + Escape + scroll lock del body) que
// src/custom/trazojoyas/PiezasList.tsx, adaptado acá para mostrar detalle +
// CTA de cotización en vez de una galería de fotos.
function ModalServicio({
  numero,
  nombre,
  items,
  tono,
  fotoSrc,
  fotoAlt,
  telHrefPrincipal,
  telFormateado,
  waHrefServicio,
  onClose,
  s,
}: {
  numero: string;
  nombre: string;
  items: string[];
  tono: string;
  fotoSrc?: string;
  fotoAlt?: string;
  telHrefPrincipal: string;
  telFormateado: string;
  waHrefServicio: string;
  onClose: () => void;
  s: (typeof T)[Idioma];
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflowPrevio;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={nombre}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-6"
    >
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label={s.modalClose}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
        >
          <X className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>
        {fotoSrc && (
          <div className="relative h-48 w-full sm:h-56">
            <Image src={fotoSrc} alt={fotoAlt ?? ""} fill sizes="512px" className="object-cover" />
            <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundColor: tono, opacity: 0.28 }} />
            <span className="absolute bottom-3 left-4 rounded px-2 py-1 font-mono text-[11px] tracking-widest text-white" style={{ backgroundColor: `${tono}e6` }}>
              No. {numero}
            </span>
          </div>
        )}
        <div className="max-h-[55vh] overflow-y-auto p-6 text-neutral-900 sm:p-7">
          <h3 className={`${bitter.className} text-2xl font-semibold`}>{nombre}</h3>
          {items.length > 0 && (
            <ul className="mt-4 space-y-2 text-sm opacity-80">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: tono }} strokeWidth={2} aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-5 text-sm opacity-70">{s.modalCtaBody}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <CallCTA href={telHrefPrincipal} variant="solido">
              {s.callConNumero(telFormateado)}
            </CallCTA>
            <a
              href={waHrefServicio}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{ borderColor: `${tono}60`, color: tono }}
            >
              <MessageCircle className="h-5 w-5" strokeWidth={2.5} aria-hidden />
              {s.textPhotos}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function JMJPainting({ tenant, content }: TenantWithContent) {
  const [lang, setLang] = useState<Idioma>("en");
  const s = T[lang];
  const [servicioAbierto, setServicioAbierto] = useState<number | null>(null);

  const acento = content.coloresMarca.acento;
  const fondo = content.coloresMarca.fondo;
  const texto = content.coloresMarca.texto;

  const usaServiciosDefault = content.precios.categorias.length === 0;
  const servicios = usaServiciosDefault ? (lang === "es" ? SERVICIOS_DEFAULT_ES : SERVICIOS_DEFAULT_EN) : content.precios.categorias;
  const pilares = content.pilares.length > 0 ? content.pilares : lang === "es" ? PILARES_DEFAULT_ES : PILARES_DEFAULT_EN;
  const pasos = content.pasos.length > 0 ? content.pasos : lang === "es" ? PASOS_DEFAULT_ES : PASOS_DEFAULT_EN;
  const faq = content.faq.length > 0 ? content.faq : lang === "es" ? FAQ_DEFAULT_ES : FAQ_DEFAULT_EN;

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

  const fotoBasement = foto(content.fotos, "basement.jpg", "A finished basement living space with wood-look flooring");
  const fotoPainting = foto(content.fotos, "painting.jpg", "A painter rolling paint onto an interior wall");
  const fotoDrywall = foto(content.fotos, "drywall.jpg", "A person applying joint compound to drywall seams");
  const fotoFlooring = foto(content.fotos, "flooring.jpg", "A person installing wood flooring boards");

  // Tonos de la muestra de pintura, cíclicos entre el acento del tenant y
  // los dos tonos fijos de esta página (ver nota arriba) — un "paint deck"
  // real tampoco usa un color distinto por cada muestra, repite una
  // familia acotada de tonos.
  const tonosSwatch = [acento, SWATCH_TERRACOTTA, SWATCH_MADERA];

  // Foto por servicio, en el MISMO orden que SERVICIOS_DEFAULT_EN/ES y
  // SERVICIOS_ICONOS (independiente del idioma, mismo criterio que los
  // íconos — ver nota arriba). "Pavers & Concrete" y "Power Washing"
  // reutilizan fotoExterior (entrada de concreto): calza razonablemente con
  // ambos servicios y evita dejarlos sin foto mientras no haya una muestra
  // dedicada para cada uno. Solo se usa cuando el admin no cargó sus propios
  // servicios (usaServiciosDefault) — un servicio escrito a mano por el
  // admin no tiene forma de saber qué foto le corresponde, así que esas
  // tarjetas se muestran sin foto (ver MuestraServicio, fotoSrc opcional).
  const FOTOS_SERVICIOS_DEFAULT: Foto[] = [
    fotoBathroom,
    fotoKitchen,
    fotoBasement,
    fotoPainting,
    fotoDeck,
    fotoDrywall,
    fotoFlooring,
    fotoExterior,
    fotoExterior,
  ];

  // Precalculado una sola vez y reutilizado tanto por el grid de tarjetas
  // como por el popup (servicioAbierto guarda el índice, no una copia de los
  // datos) — evita recalcular tono/ícono/foto con lógica distinta en dos
  // lugares.
  const serviciosConMeta = servicios.map((cat, i) => ({
    cat,
    numero: String(i + 1).padStart(2, "0"),
    tono: tonosSwatch[i % tonosSwatch.length],
    icono: usaServiciosDefault ? SERVICIOS_ICONOS[i % SERVICIOS_ICONOS.length] : iconoServicio(cat.nombre),
    foto: usaServiciosDefault ? FOTOS_SERVICIOS_DEFAULT[i % FOTOS_SERVICIOS_DEFAULT.length] : undefined,
  }));
  const servicioModal = servicioAbierto != null ? serviciosConMeta[servicioAbierto] : undefined;

  return (
    <div
      style={{ ["--tenant-acento" as string]: acento, backgroundColor: fondo, color: texto }}
      className={`${bitter.variable} ${workSans.variable} min-h-screen font-sans`}
    >
      {/* Header — logo real del negocio + toggle de idioma + CTA. */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-3 px-6 py-4 backdrop-blur-[2px] sm:px-10" style={{ backgroundColor: `${fondo}e6` }}>
        <Image src={logo.url} alt={logo.alt} width={160} height={48} className="h-9 w-auto sm:h-10" priority />
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle lang={lang} onChange={setLang} />
          <CallCTA href={telHrefPrincipal} size="sm">
            {s.callNow}
          </CallCTA>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-28 pb-16 sm:px-10 sm:pt-36 sm:pb-24">
        <div aria-hidden className="pointer-events-none absolute top-0 left-0 h-[28rem] w-[28rem] rounded-full opacity-[0.14] blur-[110px]" style={{ backgroundColor: acento }} />

        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <ScrollReveal y={0} duration={0.5}>
              <p className="mb-4 text-xs font-medium tracking-[0.3em] uppercase opacity-70">{s.heroEyebrow}</p>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.1} duration={0.7}>
              <h1 className={`${bitter.className} text-4xl leading-[1.08] font-semibold sm:text-5xl lg:text-[3.4rem]`}>
                {lang === "es" ? TAGLINE_ES : content.textos.tagline || "Premier Remodeler in Central New Jersey"}
              </h1>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.25} duration={0.7}>
              <p className="mt-6 max-w-lg text-base opacity-80 sm:text-lg">
                {lang === "es"
                  ? DESCRIPCION_ES
                  : content.textos.descripcion ||
                    `${tenant.nombre} stands ready to enhance your home — painting and full remodeling, from qualified professionals who treat your project like their own.`}
              </p>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.4} duration={0.7}>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm opacity-80">
                <span className="flex items-center gap-1.5">
                  <ClipboardCheck className="h-4 w-4" style={{ color: acento }} strokeWidth={2} aria-hidden />
                  {s.badgeEstimate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Hammer className="h-4 w-4" style={{ color: acento }} strokeWidth={2} aria-hidden />
                  {s.badgePainting}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" style={{ color: acento }} strokeWidth={2} aria-hidden />
                  {s.badgeArea}
                </span>
              </div>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.55} duration={0.7}>
              <div className="mt-8 flex flex-wrap gap-3">
                <CallCTA href={telHrefPrincipal}>{s.callConNumero(telFormateado)}</CallCTA>
                <a
                  href="#estimate"
                  className="inline-flex items-center gap-2 rounded-lg border-2 px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 sm:text-base"
                  style={{ borderColor: `${texto}30` }}
                >
                  {s.getEstimate}
                </a>
              </div>
            </ScrollReveal>
          </div>

          <Parallax speed={0.15} className="relative mx-auto w-full max-w-md">
            <div aria-hidden className="pointer-events-none absolute -inset-6 rounded-[2rem] opacity-25 blur-2xl" style={{ backgroundColor: acento }} />
            <div className="relative overflow-hidden rounded-[1.75rem] border" style={{ borderColor: `${acento}40` }}>
              <Image src={fotoHero.url} alt={fotoHero.alt} width={800} height={950} className="aspect-[4/5] w-full object-cover" priority />
              <div className="absolute top-4 left-4 rounded-lg px-3 py-1.5 font-mono text-[11px] tracking-widest text-white/90 shadow-lg" style={{ backgroundColor: `${acento}e6` }}>
                {s.heroPhotoBadge}
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
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">{s.servicesEyebrow}</p>
            <h2 className={`${bitter.className} mb-2 text-3xl font-semibold sm:text-4xl`}>{s.servicesTitle}</h2>
            <p className="mb-10 max-w-xl text-sm opacity-70 sm:text-base">{s.servicesSubtitle}</p>
          </ScrollReveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviciosConMeta.map((m, i) => (
              <MuestraServicio
                key={m.cat.nombre}
                numero={m.numero}
                nombre={m.cat.nombre}
                items={m.cat.items}
                tono={m.tono}
                icono={m.icono}
                fondoTarjeta={fondo}
                delay={(i % 3) * 0.08}
                fotoSrc={m.foto?.url}
                fotoAlt={m.foto?.alt}
                onClick={() => setServicioAbierto(i)}
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
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">{s.portfolioEyebrow}</p>
            <h2 className={`${bitter.className} mb-10 text-3xl font-semibold sm:text-4xl`}>{s.portfolioTitle}</h2>
          </ScrollReveal>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { foto: fotoKitchen, etiqueta: s.portfolioKitchen },
              { foto: fotoBathroom, etiqueta: s.portfolioBathroom },
              { foto: fotoDeck, etiqueta: s.portfolioDeck },
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
              <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">{s.whyEyebrow}</p>
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
            <p className="mb-2 text-center text-xs font-medium tracking-[0.3em] uppercase opacity-60">{s.howEyebrow}</p>
            <h2 className={`${bitter.className} mb-12 text-center text-3xl font-semibold sm:text-4xl`}>{s.howTitle}</h2>
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
            <p className="mb-3 text-xs font-medium tracking-[0.3em] text-white/70 uppercase">{s.estimateEyebrow}</p>
            <h2 className={`${bitter.className} mb-5 text-3xl font-semibold text-white sm:text-4xl`}>{s.estimateTitle}</h2>
            <p className="mx-auto mb-8 max-w-lg text-base text-white/85 sm:text-lg">{s.estimateBody}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <CallCTA href={telHrefPrincipal}>{s.callConNumero(telFormateado)}</CallCTA>
              <TextCTA href={waHref(telefono, WHATSAPP_MSG_ESTIMATE[lang])}>{s.textPhotos}</TextCTA>
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
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">{s.faqEyebrow}</p>
            <h2 className={`${bitter.className} mb-8 text-3xl font-semibold sm:text-4xl`}>{s.faqTitle}</h2>
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
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">{s.areaEyebrow}</p>
            <h2 className={`${bitter.className} mb-6 text-3xl font-semibold sm:text-4xl`}>{s.areaTitle}</h2>

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
              <CallCTA href={telHrefPrincipal}>{s.callConNumero(telFormateado)}</CallCTA>
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
        {content.formasPago.length > 0 && (
          <p className="mt-3">
            {s.paymentMethods}
            {content.formasPago.join(", ")}
          </p>
        )}
        <p className="mt-4 max-w-3xl leading-relaxed">
          {s.footerNotice(tenant.nombre)}
          {CREDITOS_UNSPLASH.map((c, i) => (
            <span key={c.nombre}>
              <a href={c.perfil} target="_blank" rel="noreferrer" className="underline">
                {c.nombre}
              </a>
              {i < CREDITOS_UNSPLASH.length - 1 ? (i === CREDITOS_UNSPLASH.length - 2 ? s.footerAnd : ", ") : ""}
            </span>
          ))}
          {s.footerOn}
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
          {s.callNow}
        </CallCTA>
      </div>

      {/* Popup de detalle de servicio (click en una tarjeta del "Swatch
          Board") — CTA de cotización con mensaje de WhatsApp personalizado
          para el servicio abierto, mismo criterio que el CTA por destino de
          DeluxTravel. */}
      {servicioModal && (
        <ModalServicio
          numero={servicioModal.numero}
          nombre={servicioModal.cat.nombre}
          items={servicioModal.cat.items}
          tono={servicioModal.tono}
          fotoSrc={servicioModal.foto?.url}
          fotoAlt={servicioModal.foto?.alt}
          telHrefPrincipal={telHrefPrincipal}
          telFormateado={telFormateado}
          waHrefServicio={waHref(telefono, s.waMensajeServicio(servicioModal.cat.nombre))}
          onClose={() => setServicioAbierto(null)}
          s={s}
        />
      )}
    </div>
  );
}

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
  { nombre: "Point3D Commercial Imaging Ltd.", perfil: "https://unsplash.com/@3dottawa" },
  { nombre: "Andrew Itaga", perfil: "https://unsplash.com/@and73w" },
  { nombre: "Joao", perfil: "https://unsplash.com/@zymot" },
  { nombre: "Jimmy Nilsson Masth", perfil: "https://unsplash.com/@jimmynilssonmasth" },
];
