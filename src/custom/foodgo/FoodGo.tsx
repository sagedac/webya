import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import Image from "next/image";
import {
  Pizza,
  Beef,
  Fish,
  Salad,
  CakeSlice,
  Flame,
  Search,
  ShoppingBag,
  Bike,
  Star,
  Clock3,
  MapPinned,
  Store,
  ShieldCheck,
  Wallet,
  Zap,
  Smartphone,
  Download,
} from "lucide-react";
import type { CategoriaProducto, Cifra, FaqItem, Foto, Pilar, TenantWithContent } from "@/lib/types";
import { ScrollReveal } from "@/engine/ScrollReveal";
import { Parallax } from "@/engine/Parallax";
import { LiveTrackingCard, RouteDivider, CountUp } from "@/custom/foodgo/effects";

// FoodGo — décimo tenant de código a medida bajo el modelo de webya.md
// sección 5 (reset del catálogo, 2026-08-12). A diferencia del resto de
// tenants del proyecto, ESTE no es un negocio físico existente: es la
// landing de un producto futuro (marketplace de delivery de comida para el
// mercado ecuatoriano, propuesta de valor tipo Rappi/Uber Eats/PedidosYa,
// pedido explícito de Paul) — todavía sin nombre comercial definitivo, sin
// alta real en Supabase, y sin lanzamiento. Audiencia de esta landing:
// comensales que descargan la app, NO restaurantes buscando ser aliados
// (esa sería una landing B2B distinta, fuera de alcance de este pedido).
//
// Paso 4 del proceso del agente constructor — criterio de nicho para ESTE
// negocio (una plataforma, no un local):
//
// - ¿Qué objetos/materiales/texturas pertenecen genuinamente a este
//   negocio? No hay un "producto físico protagonista" (por eso esta página
//   NO usa ProductVisual/fotoDestacada, a diferencia de trazojoyas/jyw-cc) —
//   lo genuino acá es la EXPERIENCIA de pedir: el repartidor en su moto, el
//   mapa de seguimiento en vivo con el ETA bajando, el teléfono en la mano
//   del usuario. De ahí la firma visual "Ruta en vivo" (ver
//   src/custom/foodgo/effects.tsx): una tarjeta de seguimiento de pedido
//   real (stepper + mapa + ETA) construida con SVG/GSAP, no una captura de
//   pantalla inventada de una app que no existe todavía.
// - ¿Qué vocabulario usaría este negocio? "Antojo", "pide", "en camino",
//   "restaurantes aliados", "tu pedido", "llega en minutos" — no
//   "soluciones logísticas omnicanal de última milla" ni relleno
//   corporativo de startup B2B.
// - ¿Qué necesita ver/saber un comensal antes de descargar la app? Qué tipo
//   de comida/restaurantes va a encontrar (categorías), qué tan rápido
//   llega, que puede seguir el pedido en vivo (no quedarse a ciegas
//   esperando), y que va a estar disponible en su ciudad pronto — de ahí el
//   orden de secciones: hero con la promesa central, cómo funciona,
//   categorías, restaurantes de muestra, cifras/confianza, por qué FoodGo,
//   preguntas frecuentes, y un cierre de descarga.
//
// Nombre de marca: el cliente todavía no tiene nombre comercial definitivo
// (brief explícito) — "FoodGo" es el placeholder. Para que sea trivial de
// reemplazar más adelante (sin tocar 20 lugares del archivo), todo el copy
// de esta página lee la constante `marca` (una sola línea, ver más abajo en
// el componente) en vez de escribir "FoodGo" a mano — `marca` se resuelve
// primero desde `tenant.nombre` (así el día que se confirme el nombre real
// y se cargue en Supabase, esta página lo hereda solo con el alta del
// admin, sin deploy de código) y cae al placeholder si el tenant todavía no
// tiene nombre cargado.
//
// Reglas de marca de WebYa (webya.md sección 7) que esta página SÍ rompe a
// propósito, mismo criterio de excepción documentada que usó SAGEDAC:
// - Sin WhatsApp como CTA principal: este negocio no tiene un canal de
//   WhatsApp de atención (es una app, no un local con pedidos por chat) —
//   `content.telefonoWhatsapp` existe en el esquema pero esta página no lo
//   lee ni renderiza ningún botón de WhatsApp. El CTA principal es
//   "Descargar la app" (botones de App Store/Google Play, visuales — no
//   enlazan a nada real todavía, pedido explícito de Paul) y la barra fija
//   móvil reemplaza al botón fijo de WhatsApp del resto del proyecto con el
//   mismo propósito (CTA siempre alcanzable en el pulgar).
// - Sin dirección/mapa: es un negocio multi-ciudad sin una sola dirección
//   física que mostrar — `content.textos.direccion` queda sin usar,
//   siguiendo el mismo principio de JMJ/Travel Agency/Moonvet de omitir un
//   dato impreciso antes que inventar uno.
// - Sin `googleRating`/reseñas de Google: no hay un local físico con ficha
//   de Google Business todavía.
// La fotografía real sigue siendo la regla (fotos de comida/delivery de
// Unsplash, con licencia de uso comercial y atribución completa en el
// footer — ver nota de fotos más abajo) y WhatsApp deja de ser el CTA
// principal por una razón real de este negocio, no por comodidad.
//
// `content.rubro`: ninguno de los valores existentes en el enum `Rubro`
// (src/lib/types.ts) describe con precisión un marketplace de delivery
// multi-ciudad — no es un restaurante (no cocina nada), ni un
// "LocalBusiness" con una sola dirección (schema.org LocalBusiness asume
// una ubicación física). En vez de forzar un rubro que no calza o inventar
// uno nuevo para un negocio que ni siquiera tiene alta real en Supabase
// todavía, esta página asume `content.rubro === "otro"` (mismo valor que
// usó SAGEDAC por el mismo motivo: no hay "negocio físico local" que
// describir con schema.org LocalBusiness).
//
// `coloresMarca`: paleta pedida explícita por Paul — naranja/rojo
// apetitoso, cálido, moderno y enérgico (línea Rappi/Uber Eats, sin ser un
// clon visual de ninguna de las dos). `tenant_content.coloresMarca` solo
// expone 3 campos editables desde el panel admin (`fondo`, `acento`,
// `texto` — EditorContenido.tsx no tiene campo para secundario1/2/3), así
// que se leen esos 3 desde `content` (fondo=crema cálido, acento=naranja-
// rojo, texto=carbón cálido) y el resto de la paleta (rojo profundo, ámbar
// y carbón de fondo oscuro) queda en las constantes fijas de abajo — mismo
// patrón ya usado por ToyLand. Sin alta real en Supabase todavía, esta
// página hereda el default oscuro/dorado de `emptyContent()`
// (src/lib/supabase/mappers.ts) hasta que el admin cargue los 3 colores
// reales al dar de alta el tenant (ver reporte de esta sesión).
//
// Fotos: producto sin lanzar, sin restaurantes aliados reales todavía — 9
// fotos de muestra Unsplash (licencia de uso comercial libre), elegidas
// deliberadamente SIN ningún logo/marca real de comida reconocible
// (se revisaron y descartaron candidatas con cajas de delivery de marcas
// reales — Telepizza, iFood — y menús de restaurante con nombre propio
// visible antes de elegir las definitivas). Descargadas a
// public/tenants/foodgo/, ping de tracking obligatorio ya disparado a
// `links.download_location` de cada una durante la construcción,
// atribución completa en el footer. Los "restaurantes de muestra" de la
// sección correspondiente son nombres inventados para ilustrar el formato
// de tarjeta (rotulados "Ejemplo" en la UI, no facturas ni negocios
// reales) — mismo principio que los proyectos de muestra de
// Estudio de Arquitectura (webya.md sección 5, "no inventar" historia real).
//
// No usa `ProductVisual`/`fotoDestacada` (ver arriba: sin producto físico
// protagonista). Cifras de la sección de confianza están enmarcadas como
// METAS de lanzamiento ("restaurantes aliados", "tiempo de entrega
// objetivo", "ciudades de lanzamiento"), no como cifras ya alcanzadas —
// presentar un historial que todavía no existe como si fuera real hubiera
// sido inventar (webya.md sección 7); enmarcarlas como meta es honesto y
// sigue cumpliendo el pedido explícito de Paul de una sección de
// "cifras de confianza".

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-jakarta" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });

// Paleta fija complementaria a los 3 campos editables de coloresMarca (ver
// nota de arriba) — no vienen de tenant_content.
const ROJO_PROFUNDO = "#C81E3D";
const AMBAR = "#FFB020";
const CARBON = "#1C1310";
const CREMA = "#FFF8F1";

function foto(fotos: Foto[], archivo: string, altPorDefecto: string): Foto {
  return fotos.find((f) => f.url.endsWith(archivo)) ?? { url: `/tenants/foodgo/${archivo}`, alt: altPorDefecto };
}

const CATEGORIAS_DEFAULT: CategoriaProducto[] = [
  { nombre: "Pizza", items: ["Masa artesanal, recién horneada"] },
  { nombre: "Hamburguesas", items: ["Carne jugosa, pan brioche"] },
  { nombre: "Sushi", items: ["Rolls frescos, para compartir"] },
  { nombre: "Saludable", items: ["Bowls, ensaladas y opciones fit"] },
  { nombre: "Postres", items: ["Para cerrar con broche de oro"] },
  { nombre: "Comida mexicana", items: ["Tacos auténticos, con todo"] },
];

const FOTOS_CATEGORIAS_DEFAULT = ["categoria-pizza.jpg", "categoria-burger.jpg", "categoria-sushi.jpg", "categoria-saludable.jpg", "categoria-postres.jpg", "categoria-tacos.jpg"];
const ICONOS_CATEGORIA = [Pizza, Beef, Fish, Salad, CakeSlice, Flame];

interface RestauranteMuestra {
  nombre: string;
  categoria: string;
  archivo: string;
  alt: string;
  rating: number;
  tiempo: string;
  precio: string;
}

// Nombres/ratings inventados a propósito para ilustrar el formato de
// tarjeta — ver nota de fotos arriba, rotulados "Ejemplo" en la UI.
const RESTAURANTES_MUESTRA: RestauranteMuestra[] = [
  { nombre: "Pizzería del Barrio", categoria: "Pizza", archivo: "categoria-pizza.jpg", alt: "Pizza margherita recién horneada", rating: 4.8, tiempo: "20-30 min", precio: "$$" },
  { nombre: "Burger Local", categoria: "Hamburguesas", archivo: "categoria-burger.jpg", alt: "Hamburguesa doble con papas fritas", rating: 4.7, tiempo: "15-25 min", precio: "$$" },
  { nombre: "Cevichería El Puerto", categoria: "Comida ecuatoriana", archivo: "plato-ceviche.jpg", alt: "Ceviche de camarón en tazón blanco", rating: 4.9, tiempo: "25-35 min", precio: "$$$" },
  { nombre: "Wok & Noodles", categoria: "Asiática", archivo: "plato-noodles.jpg", alt: "Noodles salteados con vegetales", rating: 4.6, tiempo: "20-30 min", precio: "$$" },
];

const PASOS_DEFAULT = [
  "Explora restaurantes cerca de ti y elige lo que se te antoja",
  "Arma tu pedido, elige cómo pagar y confirma en segundos",
  "Sigue tu pedido en vivo hasta que llegue a tu puerta",
];
const ICONOS_PASO = [Search, ShoppingBag, Bike];

const CIFRAS_DEFAULT: Cifra[] = [
  { numero: 150, sufijo: "+", etiqueta: "Restaurantes aliados (meta de lanzamiento)" },
  { numero: 25, sufijo: " min", etiqueta: "Tiempo promedio de entrega" },
  { numero: 3, sufijo: "", etiqueta: "Ciudades para el lanzamiento" },
];

function pilaresDefault(formasPago: string[]): Pilar[] {
  return [
    { titulo: "Entrega rápida", descripcion: "Repartidores cerca de ti — tu pedido llega en minutos, no en horas." },
    { titulo: "Seguimiento en vivo", descripcion: "Ve exactamente dónde está tu pedido, desde la cocina hasta tu puerta." },
    {
      titulo: "Pagos seguros",
      descripcion: formasPago.length > 0 ? `Aceptamos ${formasPago.join(", ")} — paga como prefieras, sin vueltas.` : "Paga con tarjeta, transferencia o efectivo al recibir — como prefieras.",
    },
    { titulo: "Variedad real", descripcion: "De la pizzería del barrio al restaurante de siempre, todo en un solo lugar." },
  ];
}
const ICONOS_PILAR = [Zap, MapPinned, ShieldCheck, Wallet];

const FAQ_DEFAULT: FaqItem[] = [
  { pregunta: "¿En qué ciudades va a estar disponible?", respuesta: "Lanzamos primero en las ciudades principales de Ecuador y vamos sumando más a medida que crecemos — síguenos para enterarte cuándo llega a la tuya." },
  { pregunta: "¿Cómo pago mi pedido?", respuesta: "Con tarjeta desde la app, o efectivo/transferencia al recibir, según lo que acepte cada restaurante aliado." },
  { pregunta: "¿Puedo ver dónde va mi pedido?", respuesta: "Sí — apenas el restaurante lo confirma puedes seguirlo en vivo en el mapa, desde que sale hasta que llega." },
  { pregunta: "¿Qué hago si mi pedido llega mal o incompleto?", respuesta: "Lo reportas desde la app y te ayudamos a resolverlo — reembolso o reenvío, según el caso." },
];

const CREDITOS_UNSPLASH = [
  { nombre: "Rowan Freeman", perfil: "https://unsplash.com/@rowanfreeman" },
  { nombre: "Blake Wisz", perfil: "https://unsplash.com/@blakewisz" },
  { nombre: "Jonathan Borba", perfil: "https://unsplash.com/@jonathanborba" },
  { nombre: "Louis Hansel", perfil: "https://unsplash.com/@louishansel" },
  { nombre: "Anna Pelzer", perfil: "https://unsplash.com/@annapelzer" },
  { nombre: "Bozhin Karaivanov", perfil: "https://unsplash.com/@bkaraivanov" },
  { nombre: "We The Creators", perfil: "https://unsplash.com/@wethecreators" },
  { nombre: "Jose Ruales", perfil: "https://unsplash.com/@jaruales" },
  { nombre: "Focused on You", perfil: "https://unsplash.com/@focusedonyou" },
];

// Badge de descarga decorativo — deliberadamente NO reproduce los logos
// oficiales de Apple/Google (son activos de marca con lineamientos propios
// de uso); comunica lo mismo con un ícono genérico + texto, como pidió
// Paul ("no hace falta que enlacen a nada real, pueden ser visuales").
function BadgeDescarga({ tienda, sub }: { tienda: string; sub: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 backdrop-blur-sm">
      <Download className="h-6 w-6 shrink-0 text-white" strokeWidth={2} aria-hidden />
      <div className="leading-tight">
        <p className="text-[10px] text-white/70">{sub}</p>
        <p className="text-sm font-bold text-white">{tienda}</p>
      </div>
    </div>
  );
}

export function FoodGo({ tenant, content }: TenantWithContent) {
  const marca = tenant.nombre?.trim() || "FoodGo";
  const fondo = content.coloresMarca.fondo;
  const acento = content.coloresMarca.acento;
  const texto = content.coloresMarca.texto;

  const usaCategoriasDefault = content.precios.categorias.length === 0;
  const categorias = usaCategoriasDefault ? CATEGORIAS_DEFAULT : content.precios.categorias;
  const pasos = content.pasos.length > 0 ? content.pasos : PASOS_DEFAULT;
  const pilares = content.pilares.length > 0 ? content.pilares : pilaresDefault(content.formasPago);
  const faq = content.faq.length > 0 ? content.faq : FAQ_DEFAULT;
  const cifras = content.cifras.length > 0 ? content.cifras : CIFRAS_DEFAULT;
  const notaRestaurantes = content.precios.nota || "Precios y tiempos de entrega varían según el restaurante y tu ubicación.";

  const fotoHero = foto(content.fotos, "hero.jpg", "Repartidor en moto entregando comida por la noche");

  return (
    <div
      style={{ ["--tenant-acento" as string]: acento, backgroundColor: fondo, color: texto }}
      className={`${jakarta.variable} ${inter.variable} min-h-screen font-[var(--font-inter)]`}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[var(--tenant-fondo)]/90 backdrop-blur-md" style={{ ["--tenant-fondo" as string]: fondo }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ backgroundColor: acento }}>
              <ShoppingBag className="h-5 w-5" strokeWidth={2.5} aria-hidden />
            </span>
            <span className={`${jakarta.className} text-xl font-extrabold tracking-tight`}>{marca}</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <a href="#como-funciona" className="opacity-70 transition hover:opacity-100">Cómo funciona</a>
            <a href="#categorias" className="opacity-70 transition hover:opacity-100">Categorías</a>
            <a href="#restaurantes" className="opacity-70 transition hover:opacity-100">Restaurantes</a>
            <a href="#preguntas" className="opacity-70 transition hover:opacity-100">Preguntas</a>
          </nav>
          <a
            href="#descargar"
            className="rounded-full px-4 py-2 text-xs font-extrabold text-white transition hover:brightness-110 sm:px-5 sm:py-2.5 sm:text-sm"
            style={{ backgroundColor: acento }}
          >
            Descargar app
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Parallax speed={0.1} className="absolute inset-0">
            <Image src={fotoHero.url} alt={fotoHero.alt} fill sizes="100vw" className="scale-110 object-cover" priority />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 lg:hidden" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pt-14 pb-16 sm:px-8 sm:pt-20 sm:pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
          <div>
            <p className="animate-fade-in-up mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase backdrop-blur-sm">
              Delivery de comida en Ecuador
            </p>
            <h1
              className={`${jakarta.className} animate-fade-in-up text-4xl leading-[1.05] font-extrabold text-white sm:text-5xl lg:text-6xl`}
              style={{ animationDelay: "0.1s" }}
            >
              {content.textos.tagline || (
                <>
                  Tu antojo, a un toque de <span style={{ color: acento }}>distancia</span>
                </>
              )}
            </h1>
            <p className="animate-fade-in-up mt-6 max-w-lg text-base font-medium text-white/85 sm:text-lg" style={{ animationDelay: "0.2s" }}>
              {content.textos.descripcion || `${marca} conecta tus restaurantes favoritos con tu puerta — pide en segundos y sigue tu pedido en vivo hasta que llegue.`}
            </p>

            <div className="animate-fade-in-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.3s" }}>
              <BadgeDescarga sub="Descárgala en" tienda="App Store" />
              <BadgeDescarga sub="Disponible en" tienda="Google Play" />
            </div>

            <div className="animate-fade-in-up mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/90" style={{ animationDelay: "0.4s" }}>
              <span className="inline-flex items-center gap-1.5">
                <Store className="h-4 w-4" style={{ color: acento }} strokeWidth={2.5} aria-hidden />
                {Math.round(cifras[0]?.numero ?? 150)}
                {cifras[0]?.sufijo ?? "+"} restaurantes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4" style={{ color: acento }} strokeWidth={2.5} aria-hidden />
                Entrega en ~{Math.round(cifras[1]?.numero ?? 25)} min
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPinned className="h-4 w-4" style={{ color: acento }} strokeWidth={2.5} aria-hidden />
                {Math.round(cifras[2]?.numero ?? 3)} ciudades
              </span>
            </div>
          </div>

          <div className="animate-fade-in-up mx-auto w-full max-w-sm lg:mx-0" style={{ animationDelay: "0.35s" }}>
            <LiveTrackingCard acento={acento} className="w-full rounded-3xl border border-black/5 bg-white/97 p-5 shadow-2xl backdrop-blur-sm" />
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="scroll-mt-20 px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal className="mb-14 text-center">
            <p className="mb-2 text-xs font-extrabold tracking-[0.3em] uppercase opacity-50">Cómo funciona</p>
            <h2 className={`${jakarta.className} text-3xl font-extrabold sm:text-4xl`}>De un antojo a tu puerta, en 3 pasos</h2>
          </ScrollReveal>

          <div className="flex flex-col gap-10 sm:flex-row sm:items-start">
            {pasos.map((paso, i) => {
              const Icono = ICONOS_PASO[i % ICONOS_PASO.length];
              return (
                <div key={paso} className="flex flex-1 flex-col items-center text-center">
                  <ScrollReveal delay={i * 0.12} className="flex flex-col items-center">
                    <span
                      className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-extrabold text-white"
                      style={{ backgroundColor: [acento, ROJO_PROFUNDO, CARBON][i % 3] }}
                    >
                      <Icono className="h-7 w-7" strokeWidth={2} aria-hidden />
                    </span>
                    <p className="mb-1 text-xs font-extrabold tracking-widest opacity-50">PASO {i + 1}</p>
                    <p className="max-w-[220px] text-base font-semibold">{paso}</p>
                  </ScrollReveal>
                  {i < pasos.length - 1 && <RouteDivider color={acento} className="mt-8 hidden w-full sm:mx-2 sm:block" />}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CATEGORÍAS DESTACADAS */}
      <section id="categorias" className="scroll-mt-20 overflow-hidden px-5 py-16 sm:px-8 sm:py-24" style={{ backgroundColor: CARBON }}>
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-10 text-center">
            <p className="mb-2 text-xs font-extrabold tracking-[0.3em] text-white/50 uppercase">Categorías</p>
            <h2 className={`${jakarta.className} text-3xl font-extrabold text-white sm:text-4xl`}>¿Con qué se te antoja hoy?</h2>
          </ScrollReveal>

          <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
            {categorias.map((cat, i) => {
              const Icono = ICONOS_CATEGORIA[i % ICONOS_CATEGORIA.length];
              const fotoCat = usaCategoriasDefault ? foto(content.fotos, FOTOS_CATEGORIAS_DEFAULT[i % FOTOS_CATEGORIAS_DEFAULT.length], cat.nombre) : null;
              return (
                <ScrollReveal key={cat.nombre} delay={(i % 6) * 0.06} className="w-40 shrink-0 snap-start sm:w-auto">
                  <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl sm:aspect-square">
                    {fotoCat ? (
                      <Image
                        src={fotoCat.url}
                        alt={fotoCat.alt}
                        fill
                        sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 40vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div aria-hidden className="absolute inset-0" style={{ backgroundColor: `${acento}30` }} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                    <span className="absolute top-2.5 left-2.5 flex h-8 w-8 items-center justify-center rounded-full text-white" style={{ backgroundColor: acento }}>
                      <Icono className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                    </span>
                    <div className="absolute right-3 bottom-3 left-3">
                      <p className="text-sm leading-tight font-extrabold text-white">{cat.nombre}</p>
                      {cat.items[0] && <p className="mt-0.5 line-clamp-2 text-[11px] text-white/70">{cat.items[0]}</p>}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* RESTAURANTES DE MUESTRA */}
      <section id="restaurantes" className="scroll-mt-20 px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal className="mb-4 text-center">
            <p className="mb-2 text-xs font-extrabold tracking-[0.3em] uppercase opacity-50">Restaurantes</p>
            <h2 className={`${jakarta.className} text-3xl font-extrabold sm:text-4xl`}>Así se ve un pedido en {marca}</h2>
          </ScrollReveal>
          <p className="mb-10 text-center text-sm opacity-60">Ejemplo ilustrativo del formato — {marca} todavía no tiene restaurantes aliados confirmados.</p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {RESTAURANTES_MUESTRA.map((r, i) => {
              const f = foto(content.fotos, r.archivo, r.alt);
              return (
                <ScrollReveal key={r.nombre} delay={(i % 4) * 0.08}>
                  <div className="group overflow-hidden rounded-2xl border border-black/5 bg-white/60 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image src={f.url} alt={f.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">Ejemplo</span>
                    </div>
                    <div className="p-4">
                      <p className="truncate text-sm font-extrabold">{r.nombre}</p>
                      <p className="mb-2 text-xs opacity-60">{r.categoria}</p>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="inline-flex items-center gap-1" style={{ color: AMBAR }}>
                          <Star className="h-3.5 w-3.5 fill-current" strokeWidth={0} aria-hidden />
                          {r.rating.toFixed(1)}
                        </span>
                        <span className="inline-flex items-center gap-1 opacity-70">
                          <Clock3 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                          {r.tiempo}
                        </span>
                        <span className="opacity-70">{r.precio}</span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
          <p className="mt-8 text-center text-xs opacity-50">{notaRestaurantes}</p>
        </div>
      </section>

      {/* CIFRAS DE CONFIANZA */}
      <section className="px-5 py-14 sm:px-8 sm:py-20" style={{ background: `linear-gradient(120deg, ${acento}, ${ROJO_PROFUNDO})` }}>
        <div className="mx-auto max-w-5xl">
          <ScrollReveal className="mb-10 text-center">
            <p className="mb-2 text-xs font-extrabold tracking-[0.3em] text-white/70 uppercase">Nuestra meta de lanzamiento</p>
            <h2 className={`${jakarta.className} text-2xl font-extrabold text-white sm:text-3xl`}>Así queremos empezar en Ecuador</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4 sm:gap-8">
            {cifras.slice(0, 3).map((c) => (
              <ScrollReveal key={c.etiqueta}>
                <CountUp to={c.numero} sufijo={c.sufijo} className={`${jakarta.className} block text-3xl font-extrabold text-white sm:text-4xl`} />
                <p className="mt-2 text-xs font-semibold text-white/80 sm:text-sm">{c.etiqueta}</p>
              </ScrollReveal>
            ))}
            <ScrollReveal delay={0.18}>
              <span className={`${jakarta.className} block text-2xl font-extrabold text-white sm:text-3xl`}>7:00–23:00</span>
              <p className="mt-2 text-xs font-semibold text-white/80 sm:text-sm">Todos los días de la semana</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* POR QUÉ FOODGO */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal className="mb-12 text-center">
            <p className="mb-2 text-xs font-extrabold tracking-[0.3em] uppercase opacity-50">Por qué {marca}</p>
            <h2 className={`${jakarta.className} mb-3 text-3xl font-extrabold sm:text-4xl`}>Pensado para que no tengas que esperar</h2>
            <p className="mx-auto max-w-xl text-sm opacity-70 sm:text-base">
              {content.textos.diferenciador || "Rapidez, variedad y seguimiento en vivo — así de simple."}
            </p>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pilares.map((pilar, i) => {
              const Icono = ICONOS_PILAR[i % ICONOS_PILAR.length];
              return (
                <ScrollReveal key={pilar.titulo} delay={(i % 4) * 0.08}>
                  <div className="flex h-full flex-col gap-3 rounded-2xl border border-black/5 bg-black/[0.02] p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ backgroundColor: acento }}>
                      <Icono className="h-5 w-5" strokeWidth={2} aria-hidden />
                    </span>
                    <h3 className="text-base font-extrabold">{pilar.titulo}</h3>
                    <p className="text-sm opacity-70">{pilar.descripcion}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="preguntas" className="scroll-mt-20 px-5 py-16 sm:px-8 sm:py-24" style={{ backgroundColor: `${acento}0d` }}>
        <div className="mx-auto max-w-2xl">
          <ScrollReveal>
            <p className="mb-2 text-xs font-extrabold tracking-[0.3em] uppercase opacity-50">Antes de descargar</p>
            <h2 className={`${jakarta.className} mb-8 text-3xl font-extrabold sm:text-4xl`}>Preguntas frecuentes</h2>
          </ScrollReveal>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <ScrollReveal key={item.pregunta} delay={i * 0.06}>
                <details className="group rounded-xl border border-black/5 bg-white/70 p-4">
                  <summary className="cursor-pointer list-none font-bold [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-3">
                      {item.pregunta}
                      <span className="shrink-0 text-lg opacity-40 transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-2 text-sm opacity-70">{item.respuesta}</p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* DESCARGA LA APP */}
      <section id="descargar" className="scroll-mt-20 px-5 py-16 text-center sm:px-8 sm:py-24" style={{ backgroundColor: CARBON }}>
        <ScrollReveal className="mx-auto max-w-2xl">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold text-white uppercase" style={{ backgroundColor: acento }}>
            <Smartphone className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
            Muy pronto
          </span>
          <h2 className={`${jakarta.className} mb-4 text-3xl font-extrabold text-white sm:text-4xl`}>Descarga {marca} y pide en minutos</h2>
          <p className="mb-8 text-base text-white/70">Estamos preparando el lanzamiento en Ecuador — sé de los primeros en pedir apenas abramos en tu ciudad.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <BadgeDescarga sub="Descárgala en" tienda="App Store" />
            <BadgeDescarga sub="Disponible en" tienda="Google Play" />
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="px-5 py-12 text-xs opacity-80 sm:px-8" style={{ backgroundColor: CARBON, color: CREMA }}>
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg text-white" style={{ backgroundColor: acento }}>
                <ShoppingBag className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </span>
              <span className={`${jakarta.className} text-base font-extrabold text-white`}>{marca}</span>
            </div>
            <p className="max-w-xs opacity-60">Delivery de comida para el mercado ecuatoriano — pide en segundos, sigue tu pedido en vivo.</p>
          </div>
          <div>
            <p className="mb-3 font-bold text-white/90">Producto</p>
            <ul className="space-y-2 opacity-70">
              <li><a href="#como-funciona" className="hover:underline">Cómo funciona</a></li>
              <li><a href="#categorias" className="hover:underline">Categorías</a></li>
              <li><a href="#restaurantes" className="hover:underline">Restaurantes</a></li>
              <li><a href="#preguntas" className="hover:underline">Preguntas frecuentes</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-bold text-white/90">Síguenos</p>
            <ul className="space-y-2 opacity-70">
              {content.instagramUrl && (
                <li>
                  <a href={content.instagramUrl} target="_blank" rel="noreferrer" className="hover:underline">Instagram</a>
                </li>
              )}
              {content.facebookUrl && (
                <li>
                  <a href={content.facebookUrl} target="_blank" rel="noreferrer" className="hover:underline">Facebook</a>
                </li>
              )}
              {!content.instagramUrl && !content.facebookUrl && <li className="opacity-40">Próximamente</li>}
            </ul>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 leading-relaxed opacity-50">
          {marca} todavía no tiene fotos propias — las fotos de esta página son de muestra, con licencia Unsplash (uso comercial gratuito), ilustrativas de comida y
          delivery en general (ningún plato ni restaurante mostrado es un negocio real), por{" "}
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
        <p className="mx-auto mt-4 max-w-6xl opacity-40">© {new Date().getFullYear()} {marca}. Todos los derechos reservados.</p>
      </footer>

      {/* Barra fija de descarga en móvil — reemplaza al botón fijo de
          WhatsApp del resto del proyecto (ver nota de reglas rotas arriba):
          este negocio no tiene canal de WhatsApp, así que el CTA siempre
          alcanzable en el pulgar es "descargar la app". */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-[var(--tenant-fondo)]/95 px-4 py-3 backdrop-blur-md sm:hidden" style={{ ["--tenant-fondo" as string]: fondo }}>
        <a href="#descargar" className="flex items-center justify-center gap-2 rounded-full py-3 text-sm font-extrabold text-white" style={{ backgroundColor: acento }}>
          <Download className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          Descargar {marca} gratis
        </a>
      </div>
      {/* Espaciador para que la barra fija no tape el footer en móvil */}
      <div className="h-16 sm:hidden" aria-hidden />
    </div>
  );
}
