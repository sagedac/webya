import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Image from "next/image";
import { ChevronDown, MessageCircle, Route, UserRound, Wallet } from "lucide-react";
import type { CategoriaProducto, Foto, TenantWithContent } from "@/lib/types";
import { ScrollReveal } from "@/engine/ScrollReveal";
import { FlipReveal, RouteLine, StampReveal } from "@/custom/travel-agency/effects";

// Travel Agency — quinta página de código a medida bajo el modelo de
// webya.md sección 5 (reset del catálogo, 2026-08-12). Cliente real de
// Paul: "Travel Agency" (nombre real del negocio, en inglés — no es una
// descripción genérica sin traducir, así se confirmó el nombre), agencia de
// viajes que opera en Sudamérica con 5 tours activos, cada uno a un país
// distinto con precio fijo por persona/paquete (Colombia $800, Brasil $900,
// Argentina $1200, Perú $700, Bolivia $860 — dato real dado directamente
// por Paul, no inventado).
//
// Paso 4 del proceso del agente constructor — criterio de nicho para ESTE
// negocio (agencia de viajes con 5 rutas fijas a Sudamérica, no una OTA
// genérica ni un catálogo infinito de destinos):
//
// - ¿Qué objetos/materiales/texturas pertenecen genuinamente a este
//   negocio? El pase de embarque de papel con su perforación y su código de
//   barras, el código de aeropuerto de 3 letras, el sello de tinta de
//   aduana/pasaporte, el tablero de salidas tipo Solari (las letras que
//   voltean), la ventanilla ovalada del avión — no un banner genérico de
//   "ofertas de temporada" ni una foto de una pareja sonriendo en una playa
//   de stock. El dato más fuerte y concreto que dio Paul es justamente eso:
//   5 países, 5 precios fijos — un pase de embarque pone el destino y la
//   tarifa como los dos datos más grandes de la tarjeta, que es exactamente
//   lo que este negocio necesita comunicar primero.
// - ¿Qué vocabulario usaría el dueño? "Paquete", "salida", "cupos",
//   "abono", "asesor", "tarifa" — no "experiencias inmersivas de bienestar
//   global" ni relleno corporativo de agencia de turismo internacional.
// - ¿Qué necesita ver/saber un cliente antes de escribir por WhatsApp? El
//   precio exacto de CADA destino sin tener que preguntar (por eso el
//   precio va explícito en cada tarjeta, a diferencia de otros tenants del
//   proyecto donde el precio no siempre se muestra — acá Paul lo pidió
//   explícito), qué incluye el paquete, cómo es el proceso de reserva paso
//   a paso, y las dudas típicas de viajar por primera vez a otro país
//   (visa, cuotas, cambios de fecha) — de ahí que el FAQ cubra justo eso.
//
// Firma visual (webya.md sección 7, "un elemento firma único por landing" —
// no reutiliza la firma cinematográfica full-bleed de DeluxTravel, el otro
// tenant de agencia de viajes del proyecto): "Pase de embarque" — cada uno
// de los 5 tours se presenta como una tarjeta de boarding pass real, con
// perforación punteada + muescas circulares "troqueladas", código de
// barras, código de aeropuerto de origen/destino unidos por una ruta de
// vuelo que se traza con el scroll (RouteLine, src/custom/travel-agency/
// effects.tsx), número de pase, y un sello de tinta que cae de golpe sobre
// el código de destino (StampReveal). El titular del hero usa un efecto de
// tablero de salidas de aeropuerto letra por letra (FlipReveal) en vez del
// texto por palabras que ya usa DeluxTravel — mismo motor compartido
// (ScrollReveal), extensión propia y distinta para esta página.
//
// Convención de datos: tenant_content no tiene un campo dedicado para
// "código de aeropuerto" ni "incluye" por tour, así que este componente
// interpreta content.precios.categorias así (documentado acá porque no es
// obvio desde el esquema genérico):
//   - cat.nombre       -> nombre del país/destino (ej. "Colombia")
//   - cat.items[0]     -> qué incluye el paquete (texto libre)
//   - cat.items[1]     -> tarifa formateada como texto (ej. "$800")
// El código de aeropuerto de 3 letras y la foto de cada destino NO viven en
// tenant_content (no hay campo para eso) — se resuelven acá por nombre de
// país contra DESTINO_META (normalizado sin tildes/mayúsculas), con un
// fallback razonable (primeras 3 letras del nombre, sin foto) si el admin
// llega a agregar un país fuera de los 5 originales.
//
// ASUNCIÓN del agente constructor (mismo criterio que JMJ con sus 9
// servicios, ver src/custom/jmj/JMJPainting.tsx): Paul solo dio el precio
// por país, no qué incluye cada paquete — se usa "Vuelos + hotel +
// asesoría" como contenido por defecto razonable para una agencia que
// vende paquetes completos, editable desde el panel admin en cualquier
// momento sin tocar código. También se asume que el precio es una tarifa
// "por persona" (Paul lo describió como "precio fijo por persona/paquete")
// — la etiqueta "por persona" es la que se muestra junto al precio.
//
// Fotos: sin fotos reales del negocio todavía (ni de oficina ni de los
// tours, confirmado por Paul) — 6 fotos de muestra de Unsplash (licencia de
// uso comercial libre): una de aeropuerto para el hero, y una por cada uno
// de los 5 destinos, elegidas por ser el hito/paisaje más reconocible de
// cada país (no gente posando genérica de stock), descargadas a
// public/tenants/travel-agency/. Ping de tracking obligatorio ya disparado
// a `links.download_location` de cada una durante la construcción.
// Atribución completa en el footer. No usa `ProductVisual` (no es un
// negocio de producto físico protagonista) ni `foto_destacada` — no aplica
// el bloqueo de publicación de foto_destacada porque esta página nunca
// pide esa foto.
//
// Código "ECU" como origen en cada pase: Paul no dio una ciudad/oficina
// específica (el negocio "opera en Sudamérica" en general, sin dirección
// exacta) — "ECU" es un recurso visual del pase de embarque, no un código
// IATA real de un aeropuerto puntual (a diferencia de los códigos de
// destino, que sí son códigos IATA reales del aeropuerto más cercano al
// hito fotografiado: BOG Bogotá, GIG Río de Janeiro, EZE Buenos Aires, CUZ
// Cusco/Machu Picchu, UYU Uyuni). Por el mismo motivo (sin dirección
// exacta) esta página no intenta un embed de Google Maps — mismo criterio
// que JMJ/Moonvet de omitir el mapa antes que mostrar uno impreciso.

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-space-grotesk" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-jetbrains-mono" });

// "0939671012" -> "593939671012" (10 dígitos locales de Ecuador -> antepone
// +593, quitando el 0 inicial). Mismo criterio ya usado en el resto del
// proyecto para tenants ecuatorianos.
function waHref(telefono: string, mensaje: string): string {
  const digitos = telefono.replace(/\D/g, "");
  const conCodigoPais = digitos.length === 10 && digitos.startsWith("0") ? `593${digitos.slice(1)}` : digitos;
  return `https://wa.me/${conCodigoPais}?text=${encodeURIComponent(mensaje)}`;
}

const WHATSAPP_MSG_DEFAULT = "Hola, quisiera información sobre los destinos y paquetes de Travel Agency";

function waMensajeTour(pais: string): string {
  return `Hola, quisiera más información sobre el paquete a ${pais}`;
}

// Busca la foto real ya cargada en content.fotos por nombre de archivo (el
// alt queda editable desde el panel admin); si el tenant no cargó nada
// propio todavía, cae a las fotos de muestra locales (mismo mecanismo que
// Moonvet/JMJ).
function foto(fotos: Foto[], archivo: string, altPorDefecto: string): Foto {
  return fotos.find((f) => f.url.endsWith(archivo)) ?? { url: `/tenants/travel-agency/${archivo}`, alt: altPorDefecto };
}

function normalizarPais(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

interface DestinoMeta {
  codigo: string;
  archivo: string;
  alt: string;
}

// Metadata visual de cada uno de los 5 destinos reales (código IATA del
// aeropuerto más cercano al hito fotografiado, y el archivo de foto
// correspondiente en public/tenants/travel-agency/) — ver nota de
// convención de datos arriba sobre por qué esto no vive en tenant_content.
//
// Nota: se descartó usar el emoji de bandera de cada país (🇨🇴 🇧🇷 etc.) como
// parte de esta metadata — Windows (a diferencia de macOS/iOS/Android) no
// renderiza el emoji de bandera compuesto, y en su lugar muestra las dos
// letras del código de país sueltas (ej. "CO" junto al nombre), que se
// veía como un error tipográfico en vez de una bandera. El código IATA de 3
// letras ya cumple ese rol visual sin depender de soporte de fuente emoji.
const DESTINO_META: Record<string, DestinoMeta> = {
  colombia: { codigo: "BOG", archivo: "destino-colombia.jpg", alt: "Calle colonial de Cartagena con balcones y buganvillas moradas" },
  brasil: { codigo: "GIG", archivo: "destino-brasil.jpg", alt: "Cristo Redentor sobre los cerros de Río de Janeiro al atardecer" },
  argentina: { codigo: "EZE", archivo: "destino-argentina.jpg", alt: "Obelisco de Buenos Aires al final de la Avenida Corrientes" },
  peru: { codigo: "CUZ", archivo: "destino-peru.jpg", alt: "Ciudadela de Machu Picchu entre montañas y niebla" },
  bolivia: { codigo: "UYU", archivo: "destino-bolivia.jpg", alt: "Salar de Uyuni reflejando el cielo como un espejo infinito" },
};

const TOURS_DEFAULT: CategoriaProducto[] = [
  { nombre: "Colombia", items: ["Vuelos + hotel + asesoría", "$800"] },
  { nombre: "Brasil", items: ["Vuelos + hotel + asesoría", "$900"] },
  { nombre: "Argentina", items: ["Vuelos + hotel + asesoría", "$1200"] },
  { nombre: "Perú", items: ["Vuelos + hotel + asesoría", "$700"] },
  { nombre: "Bolivia", items: ["Vuelos + hotel + asesoría", "$860"] },
];

const PASOS_DEFAULT = [
  "Check-in — Escríbenos por WhatsApp con el destino y las fechas que tienes en mente",
  "Embarque — Te confirmamos cupos, itinerario y el precio exacto del paquete",
  "Despegue — Reservas con un abono y coordinamos el resto antes de viajar",
];

const PILARES_DEFAULT = [
  { titulo: "Asesoría real, no un bot", descripcion: "Un asesor te acompaña desde la primera pregunta por WhatsApp hasta que regresas del viaje." },
  { titulo: "Precio fijo, sin sorpresas", descripcion: "El valor que ves en el pase es el valor que pagas: vuelos, hotel y asesoría incluidos." },
  { titulo: "Rutas pensadas para Sudamérica", descripcion: "Cinco paquetes armados para conocer el continente, sin perder tiempo armando el itinerario solo." },
];
const PILARES_ICONOS = [UserRound, Wallet, Route];

const FAQ_DEFAULT = [
  { pregunta: "¿El precio incluye los vuelos?", respuesta: "Sí — cada paquete incluye vuelos, hotel y asesoría durante todo el viaje; el precio que ves es el precio final por persona." },
  { pregunta: "¿Puedo pagar en cuotas?", respuesta: "Sí, con un abono inicial y el resto en cuotas antes de la fecha de salida." },
  { pregunta: "¿Necesito visa para estos destinos?", respuesta: "Depende de tu pasaporte y del destino — te asesoramos caso por caso antes de reservar, sin compromiso." },
  { pregunta: "¿Qué pasa si necesito cambiar la fecha del viaje?", respuesta: "Escríbenos con anticipación y revisamos juntos las opciones de cambio disponibles para tu paquete." },
];

// Atribución obligatoria (webya.md sección 3/7) — fotografía de muestra,
// ilustrativa, con licencia Unsplash de uso comercial libre. No son fotos
// reales de Travel Agency (ver footer).
const CREDITOS_UNSPLASH = [
  { nombre: "Aaron Mrvelj", perfil: "https://unsplash.com/@aaronmrvelj" },
  { nombre: "Ronin", perfil: "https://unsplash.com/@roninkgd" },
  { nombre: "Raphael Nogueira", perfil: "https://unsplash.com/@phaelnogueira" },
  { nombre: "Santiago Alonso", perfil: "https://unsplash.com/@santiagoalonsobernal" },
  { nombre: "Willian Justen de Vasconcellos", perfil: "https://unsplash.com/@willianjusten" },
  { nombre: "Andrea Huls Pareja", perfil: "https://unsplash.com/@andreahuls" },
];

// CTA de WhatsApp — ícono + relleno sólido del color de acento + hover con
// elevación (mismo criterio ya validado en DeluxTravel/Moonvet/TrazoJoyas).
// `var(--tenant-acento)` porque algunos usos viven fuera del closure de
// TravelAgency (mismo motivo documentado en DeluxTravel/JMJ).
function WhatsAppCTA({
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
  const tamano = size === "sm" ? "px-4 py-2.5 text-sm" : "px-6 py-3.5 text-sm sm:text-base";
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 rounded-full font-semibold shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 ${tamano} ${
        variant === "outline" ? "border-2 bg-transparent" : ""
      }`}
      style={variant === "solido" ? { backgroundColor: "var(--tenant-acento)", color: "#12131a" } : { borderColor: "var(--tenant-acento)", color: "var(--tenant-acento)" }}
    >
      <MessageCircle className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} strokeWidth={2.5} aria-hidden />
      {children}
    </a>
  );
}

// Código de barras del pase — patrón determinístico a partir del código de
// destino (mismo hash simple en cada render, servidor y cliente, así no
// hay riesgo de mismatch de hidratación como habría con Math.random()).
// Puramente decorativo (no es un código de barras real ni codifica nada).
function barcodePattern(seed: string, count = 26): number[] {
  let h = 7;
  for (let i = 0; i < seed.length; i++) h = (h * 33 + seed.charCodeAt(i)) >>> 0;
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    bars.push(1 + (h % 3));
  }
  return bars;
}

function Barcode({ seed, className, style }: { seed: string; className?: string; style?: React.CSSProperties }) {
  const bars = barcodePattern(seed);
  // Posiciones precalculadas de forma pura (sin reasignar una variable
  // dentro del .map de render, que el linter de hooks marca como mutación
  // insegura) — cada barra ya sabe su propio `x` antes de renderizar.
  const barsConPosicion = bars.reduce<{ x: number; w: number }[]>((acc, w) => {
    const prev = acc[acc.length - 1];
    const x = prev ? prev.x + prev.w + 1 : 0;
    return [...acc, { x, w }];
  }, []);
  const total = barsConPosicion.reduce((acc, b) => Math.max(acc, b.x + b.w), 0);

  return (
    <svg viewBox={`0 0 ${total} 22`} className={className} style={style} preserveAspectRatio="none" aria-hidden>
      {barsConPosicion.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={22} fill="currentColor" opacity={i % 5 === 0 ? 1 : 0.7} />
      ))}
    </svg>
  );
}

// Divisor punteado con muescas circulares "troqueladas" — la perforación
// del pase de embarque entre el cuerpo principal y el talón. `bgMuesca`
// debe ser el color de fondo real de la sección para que la muesca se vea
// como un agujero, no como un círculo pintado encima.
function Perforacion({ tono, bgMuesca }: { tono: string; bgMuesca: string }) {
  return (
    <div className="relative h-0 border-t-2 border-dashed" style={{ borderColor: `${tono}45` }}>
      <span aria-hidden className="absolute -top-3 -left-3 h-6 w-6 rounded-full" style={{ backgroundColor: bgMuesca }} />
      <span aria-hidden className="absolute -top-3 -right-3 h-6 w-6 rounded-full" style={{ backgroundColor: bgMuesca }} />
    </div>
  );
}

interface TourCardProps {
  cat: CategoriaProducto;
  meta: DestinoMeta;
  fotoTour: Foto | null;
  numero: string;
  acento: string;
  texto: string;
  fondo: string;
  telefono: string;
  delay: number;
}

function TourCard({ cat, meta, fotoTour, numero, acento, texto, fondo, telefono, delay }: TourCardProps) {
  const incluye = cat.items[0] || "Vuelos + hotel + asesoría";
  const precio = cat.items[1] || "";

  return (
    <ScrollReveal delay={delay} y={24} className="h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm" style={{ borderColor: `${acento}35`, backgroundColor: fondo }}>
        <div className="relative p-5 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-60">Destino</p>
              <h3 className={`${spaceGrotesk.className} text-2xl font-semibold`}>{cat.nombre}</h3>
            </div>
            <StampReveal delay={delay} rotate={-9}>
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-dashed font-mono text-[11px] font-bold tracking-widest"
                style={{ borderColor: `${acento}80`, color: acento }}
              >
                {meta.codigo}
              </span>
            </StampReveal>
          </div>

          {fotoTour && (
            <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-xl border" style={{ borderColor: `${texto}20` }}>
              <Image src={fotoTour.url} alt={fotoTour.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              {/* Remaches de esquina — refuerzan la sensación de "ventanilla de avión" sobre la foto. */}
              <span aria-hidden className="absolute top-2 left-2 h-1.5 w-1.5 rounded-full bg-white/70" />
              <span aria-hidden className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-white/70" />
              <span aria-hidden className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-white/70" />
              <span aria-hidden className="absolute right-2 bottom-2 h-1.5 w-1.5 rounded-full bg-white/70" />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 font-mono text-xs tracking-widest opacity-70">
            <span>ECU</span>
            <RouteLine className="flex-1 text-current" />
            <span>{meta.codigo}</span>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div>
              <p className={`${jetbrainsMono.className} text-3xl font-bold`} style={{ color: acento }}>
                {precio}
              </p>
              <p className="text-xs opacity-60">por persona</p>
            </div>
            <p className="max-w-[9rem] text-right text-xs leading-snug opacity-70">{incluye}</p>
          </div>
        </div>

        <Perforacion tono={texto} bgMuesca={fondo} />

        <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-50">Pase Nº {numero}</span>
            <Barcode seed={meta.codigo + numero} className="h-4 w-24" style={{ color: texto }} />
          </div>
          <WhatsAppCTA href={waHref(telefono, waMensajeTour(cat.nombre))} size="sm">
            Reservar
          </WhatsAppCTA>
        </div>
      </div>
    </ScrollReveal>
  );
}

// Talón del pase decorativo del hero — versión simplificada de la
// perforación (sin muescas circulares "troqueladas"): la tarjeta vive sobre
// un panel de vidrio esmerilado (backdrop-blur) semitransparente, así que
// un color sólido de relleno para la muesca no calzaría con el fondo real
// detrás del vidrio (la foto del hero, desenfocada). Las tarjetas de tour
// de la grilla sí usan `Perforacion` con muescas reales porque ahí el
// fondo es un color sólido conocido (`fondo` del tenant).
function DivisorSimple({ tono }: { tono: string }) {
  return <div className="border-t-2 border-dashed" style={{ borderColor: tono }} />;
}

export function TravelAgency({ tenant, content }: TenantWithContent) {
  const acento = content.coloresMarca.acento;
  const fondo = content.coloresMarca.fondo;
  const texto = content.coloresMarca.texto;

  const tours = content.precios.categorias.length > 0 ? content.precios.categorias : TOURS_DEFAULT;
  const pasos = content.pasos.length > 0 ? content.pasos : PASOS_DEFAULT;
  const pilares = content.pilares.length > 0 ? content.pilares : PILARES_DEFAULT;
  const faq = content.faq.length > 0 ? content.faq : FAQ_DEFAULT;
  const zona = content.textos.direccion || "Ecuador · rutas a Sudamérica";

  const fotoHero = foto(content.fotos, "hero-airport.jpg", "Asientos vacíos de una sala de embarque iluminados por la luz dorada del atardecer, con la cola de un avión visible en la pista");

  return (
    <div
      style={{ ["--tenant-acento" as string]: acento, backgroundColor: fondo, color: texto }}
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} min-h-screen font-sans`}
    >
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-3 px-6 py-4 backdrop-blur-[2px] sm:px-10" style={{ backgroundColor: `${fondo}cc` }}>
        <span className={`${spaceGrotesk.className} text-lg font-semibold tracking-tight`}>{tenant.nombre}</span>
        <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_DEFAULT)} size="sm">
          WhatsApp
        </WhatsAppCTA>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-dvh items-end overflow-hidden">
        <Image src={fotoHero.url} alt={fotoHero.alt} fill priority sizes="100vw" className="object-cover" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

        <div className="relative z-10 w-full px-6 pb-16 sm:px-10 sm:pb-24">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <ScrollReveal y={0} duration={0.5}>
                <p className="mb-4 flex items-center gap-2 text-xs font-medium tracking-[0.3em] text-white/80 uppercase">
                  <span className="h-px w-8" style={{ backgroundColor: acento }} />
                  Agencia de viajes · Sudamérica
                </p>
              </ScrollReveal>
              <h1 className={`${spaceGrotesk.className} max-w-2xl text-4xl leading-[1.08] font-bold text-white sm:text-6xl lg:text-[3.6rem]`}>
                <FlipReveal text={content.textos.tagline || "Tu boleto a Sudamérica, con precio fijo"} delay={0.15} />
              </h1>
              <ScrollReveal y={16} delay={0.6} duration={0.7}>
                <p className="mt-6 max-w-lg text-base text-white/85 sm:text-lg">
                  {content.textos.descripcion ||
                    "Cinco rutas directas por Sudamérica, con vuelos, hotel y asesoría incluidos en un precio fijo — sin sorpresas ni letra pequeña."}
                </p>
              </ScrollReveal>
              <ScrollReveal y={16} delay={0.75} duration={0.7}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_DEFAULT)}>Escribir por WhatsApp</WhatsAppCTA>
                  <a
                    href="#tours"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/70 sm:text-base"
                  >
                    Ver los 5 destinos
                  </a>
                </div>
              </ScrollReveal>
            </div>

            {/* Pase de embarque decorativo del hero — introduce la firma
                visual antes de la grilla de tours. */}
            <StampReveal delay={0.9} rotate={-4} className="mx-auto w-full max-w-xs lg:mx-0 lg:ml-auto">
              <div className="overflow-hidden rounded-2xl border-2 border-white/25 bg-black/40 backdrop-blur-md">
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-white/70 uppercase">
                    <span>Pase de embarque</span>
                    <span>Nº 001</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-sm font-bold text-white">
                    <span>ECU</span>
                    <RouteLine className="flex-1 text-white/70" />
                    <span>???</span>
                  </div>
                  <p className="mt-3 text-xs text-white/70">5 rutas activas · desde $700 por persona</p>
                </div>
                <DivisorSimple tono="rgba(255,255,255,0.25)" />
                <div className="px-5 py-3">
                  <Barcode seed="hero-001" className="h-4 w-full text-white/70" />
                </div>
              </div>
            </StampReveal>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-white/70">
          <span className="text-[0.65rem] tracking-[0.25em] uppercase">Desliza</span>
          <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden />
        </div>
      </section>

      {/* CÓMO RESERVAR */}
      <section className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">{content.textos.diferenciador || "Vuelos + hotel + asesoría, en un solo precio"}</p>
            <h2 className={`${spaceGrotesk.className} mb-12 text-3xl font-bold sm:text-4xl`}>Así de fácil es reservar tu viaje</h2>
          </ScrollReveal>
          <div className="space-y-8">
            {pasos.map((paso, i) => {
              const [etapa, resto] = paso.split(" — ");
              const tieneEtapa = Boolean(resto);
              return (
                <ScrollReveal key={paso} delay={i * 0.1}>
                  <div className="flex items-start gap-5 border-b pb-8" style={{ borderColor: `${acento}25` }}>
                    <span
                      className="font-mono flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold"
                      style={{ borderColor: acento, color: acento }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="pt-1.5 text-base sm:text-lg">
                      {tieneEtapa ? (
                        <>
                          <span className={`${spaceGrotesk.className} font-semibold`} style={{ color: acento }}>
                            {etapa}
                          </span>
                          <span className="opacity-85"> — {resto}</span>
                        </>
                      ) : (
                        <span className="opacity-85">{paso}</span>
                      )}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* TOURS — la firma visual de esta página: pases de embarque */}
      <section id="tours" className="px-6 py-16 sm:px-10 sm:py-20" style={{ backgroundColor: fondo }}>
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">5 rutas activas</p>
            <h2 className={`${spaceGrotesk.className} mb-2 text-3xl font-bold sm:text-4xl`}>Elige tu destino</h2>
            <p className="mb-10 max-w-xl text-sm opacity-70 sm:text-base">Precio fijo por persona, vuelos y hotel incluidos — escríbenos y te confirmamos cupos.</p>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((cat, i) => {
              const meta = DESTINO_META[normalizarPais(cat.nombre)] ?? {
                codigo: cat.nombre.slice(0, 3).toUpperCase(),
                archivo: "",
                alt: "",
              };
              const fotoTour = meta.archivo ? foto(content.fotos, meta.archivo, meta.alt) : null;
              return (
                <TourCard
                  key={cat.nombre}
                  cat={cat}
                  meta={meta}
                  fotoTour={fotoTour}
                  numero={String(i + 1).padStart(3, "0")}
                  acento={acento}
                  texto={texto}
                  fondo={fondo}
                  telefono={content.telefonoWhatsapp}
                  delay={(i % 3) * 0.08}
                />
              );
            })}
          </div>
          {content.precios.nota && (
            <p className="mt-8 text-center text-xs opacity-60">{content.precios.nota}</p>
          )}
        </div>
      </section>

      {/* POR QUÉ VIAJAR CON NOSOTROS */}
      <section className="px-6 py-16 sm:px-10 sm:py-20" style={{ backgroundColor: `${acento}0c` }}>
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Por qué viajar con nosotros</p>
            <h2 className={`${spaceGrotesk.className} mb-12 text-3xl font-bold sm:text-4xl`}>No eres un número más en un catálogo</h2>
          </ScrollReveal>
          <div className="grid gap-8 sm:grid-cols-3">
            {pilares.map((pilar, i) => {
              const Icono = PILARES_ICONOS[i % PILARES_ICONOS.length];
              return (
                <ScrollReveal key={pilar.titulo} delay={i * 0.1}>
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${acento}1f` }}
                  >
                    <Icono className="h-6 w-6" style={{ color: acento }} strokeWidth={1.8} aria-hidden />
                  </div>
                  <h3 className={`${spaceGrotesk.className} mt-4 text-xl font-semibold`}>{pilar.titulo}</h3>
                  <p className="mt-2 text-sm opacity-75 sm:text-base">{pilar.descripcion}</p>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <ScrollReveal>
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Antes de escribirnos</p>
            <h2 className={`${spaceGrotesk.className} mb-8 text-3xl font-bold sm:text-4xl`}>Preguntas frecuentes</h2>
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

      {/* ZONA DE OPERACIÓN — sin mapa: Paul no dio una dirección de oficina
          exacta (ver nota de criterio arriba), mismo criterio que
          JMJ/Moonvet de omitir el mapa antes que mostrar uno impreciso. */}
      <section className="px-6 py-16 text-center sm:px-10 sm:py-20" style={{ backgroundColor: `${acento}0c` }}>
        <div className="mx-auto max-w-xl">
          <ScrollReveal>
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Dónde operamos</p>
            <h2 className={`${spaceGrotesk.className} mb-4 text-3xl font-bold sm:text-4xl`}>{zona}</h2>
            {content.horarios.length > 0 && (
              <ul className="mx-auto mb-6 flex max-w-xs flex-col gap-1 text-sm opacity-75">
                {content.horarios.map((h) => (
                  <li key={h.dia} className="flex justify-between gap-4">
                    <span>{h.dia}</span>
                    <span>{h.horas}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6">
              <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_DEFAULT)}>Escribir por WhatsApp</WhatsAppCTA>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-10 text-xs opacity-70 sm:px-10" style={{ borderColor: `${acento}25` }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>
            {tenant.nombre} — {zona}
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
        {content.formasPago.length > 0 && <p className="mt-3">Formas de pago: {content.formasPago.join(", ")}</p>}
        <p className="mt-4 max-w-3xl leading-relaxed">
          {tenant.nombre} todavía no tiene fotos propias cargadas — las fotos de esta página (aeropuerto y los 5 destinos) son imágenes de muestra, con
          licencia de Unsplash (uso comercial gratuito), ilustrativas del lugar (no son fotos de viajes reales de clientes de este negocio), por{" "}
          {CREDITOS_UNSPLASH.map((c, i) => (
            <span key={c.nombre}>
              <a href={c.perfil} target="_blank" rel="noreferrer" className="underline">
                {c.nombre}
              </a>
              {i < CREDITOS_UNSPLASH.length - 1 ? (i === CREDITOS_UNSPLASH.length - 2 ? " y " : ", ") : ""}
            </span>
          ))}{" "}
          en{" "}
          <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="underline">
            Unsplash
          </a>
          .
        </p>
      </footer>

      {/* WhatsApp fijo móvil */}
      <div className="fixed right-5 bottom-5 z-40 sm:hidden">
        <span aria-hidden className="absolute inset-0 animate-ping rounded-full opacity-60" style={{ backgroundColor: acento }} />
        <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_DEFAULT)} size="sm">
          WhatsApp
        </WhatsAppCTA>
      </div>
    </div>
  );
}
