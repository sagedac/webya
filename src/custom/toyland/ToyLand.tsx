import { Baloo_2, Nunito } from "next/font/google";
import Image from "next/image";
import { Clock, MapPin, MessageCircle, PartyPopper, Sparkles, Truck } from "lucide-react";
import type { CategoriaProducto, Foto, TenantWithContent } from "@/lib/types";
import { ScrollReveal } from "@/engine/ScrollReveal";
import { Parallax } from "@/engine/Parallax";
import { GanchoPercha, HookSway, PopIn } from "@/custom/toyland/effects";

// ToyLand — novena página de código a medida bajo el modelo de webya.md
// sección 5 (reset del catálogo, 2026-08-12). Cliente real de Paul:
// juguetería de temática anime en el Batán Shopping (Cuenca), 3era planta.
//
// Nota de continuidad del proyecto: "Toy Land" existió antes como uno de
// los 8 tenants originales sobre `plantilla_jugueteria` (webya.md sección
// 5, registro histórico) — se borró en el reset del catálogo (2026-08-12)
// junto con el resto de plantillas y quedó en la lista de negocios "sin
// página" (sección 9). Esta NO es una restauración de aquel código (que ya
// no existe, era Neo-Brutalism con paleta extraída de un logo que tampoco
// existe acá) — es una página nueva construida desde cero con el criterio
// de hoy (código a medida, sin catálogo), que por coincidencia converge en
// una estética similarmente audaz porque es genuinamente la que le queda
// bien a este tipo de negocio, no porque se haya copiado nada.
//
// Paso 4 del proceso del agente constructor — criterio de nicho para ESTE
// negocio:
//
// - ¿Qué objetos/materiales/texturas pertenecen genuinamente a este
//   negocio? Fundas blister colgadas de ganchos en una pared de percha
//   (pegboard) — así se ve por dentro cualquier juguetería real —,
//   máquinas de cápsulas/gachapon, estantes de figuras y peluches. De ahí
//   la firma visual "En la percha" (ver abajo), no un ícono genérico de
//   "juguete" importado de un banco de íconos.
// - ¿Qué vocabulario usaría el dueño? "Figuras", "peluches", "funko",
//   "coleccionables", "encargos", "preventas", "stock" — no "experiencias
//   de entretenimiento familiar premium" ni relleno corporativo de
//   franquicia internacional.
// - ¿Qué necesita ver un cliente antes de escribir por WhatsApp? Qué tipo
//   de productos maneja (no es lo mismo buscar un funko que un peluche),
//   si los productos son originales/licenciados, si hacen preventas de
//   piezas específicas, y dónde queda exactamente el local (Batán
//   Shopping, 3era planta — dato real dado por Paul).
//
// Paleta: pedido explícito de Paul — amarillo de fondo, con rojo, verde,
// negro y naranja como el resto de la paleta. El esquema de
// `tenant_content.coloresMarca` (ver src/lib/types.ts) solo tiene 3
// colores editables desde el panel admin hoy (`fondo`, `acento`, `texto`
// — ver EditorContenido.tsx, sin campo para secundario1/2/3 todavía), así
// que se usan para fondo=amarillo, acento=rojo (color principal de CTA) y
// texto=negro; verde y naranja quedan como constantes fijas en este
// componente (VERDE/NARANJA más abajo) en vez de en tenant_content, para
// no depender de un campo que hoy no se puede editar sin tocar la base de
// datos a mano. Documentado también en el reporte de esta sesión: Paul
// debe cargar fondo/acento/texto en el panel admin al dar de alta el
// tenant con los tonos exactos (ver reporte), si no hereda el default
// oscuro/dorado de `emptyContent()` (src/lib/supabase/mappers.ts).
//
// Firma visual (webya.md sección 7, "un elemento firma único por
// landing"): "En la percha" — cada categoría de producto es una funda
// blister que cuelga de un gancho de metal (`GanchoPercha`,
// `src/custom/toyland/effects.tsx`) con un balanceo idle constante
// (`HookSway`, nunca se detiene, a diferencia del resto de animaciones de
// la página que disparan una sola vez al hacer scroll) sobre una pared con
// textura de perforaciones tipo pegboard (CSS puro) — así es una pared de
// juguetería real, no una grilla de tarjetas genérica. Se combina con
// entradas tipo "pop" de cómic (`PopIn`, rebote exagerado) y un patrón de
// puntos de trama (halftone, impresión de cómic/manga) como textura de
// fondo — energía "anime" sin depender de ningún personaje con derechos de
// autor (ver nota de fotos abajo).
//
// Convención de tenant_content para esta página (documentada porque no
// hay una lista fija de qué significa cada campo): `precios.categorias`
// son las categorías de producto (Figuras de acción, Funko Pop, Peluches,
// Accesorios y merch por defecto) — `cat.items` describe variedad/tipo de
// esa categoría, NO precios individuales (sin precios confirmados por
// Paul). `precios.nota` es la única mención de precio, dirige a WhatsApp
// (mismo patrón que El Establo/JYW CC).
//
// Fotos: negocio real, sin fotos propias todavía — 6 fotos de muestra
// Unsplash (licencia de uso comercial libre), elegidas deliberadamente
// GENÉRICAS (máquinas de cápsulas, figuras "monstruo" sin franquicia
// identificable, peluches, llaveros) y evitando cualquier foto que muestre
// un personaje o logo de una franquicia de anime con derechos de autor
// reconocibles (Goku, Pikachu, etc.) — el problema de derechos de una foto
// así no lo cubre la licencia del fotógrafo en Unsplash, es una capa
// aparte. Descargadas a public/tenants/toyland/. Ping de tracking
// obligatorio ya disparado a `links.download_location` de cada una durante
// la construcción. Atribución completa en el footer. NINGUNA de estas
// fotos es del local real de ToyLand.
//
// No usa `ProductVisual`: el catálogo de este negocio es variado (figuras,
// peluches, funko, merch) — no hay un único "producto protagonista" que
// tenga sentido flotando en el hero, a diferencia de una joyería.

const baloo = Baloo_2({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-baloo" });
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-nunito" });

// Verde y naranja de la paleta pedida por Paul — constantes fijas (ver
// nota de paleta arriba), no vienen de tenant_content.coloresMarca.
const VERDE = "#2E9E4F";
const NARANJA = "#F2811D";
const PAPEL = "#FFF6E0"; // "papel de cómic" — fondo de las fichas/tarjetas, para que el texto no quede directo sobre el amarillo saturado.

function waHref(telefono: string, mensaje: string): string {
  const digitos = telefono.replace(/\D/g, "");
  const conCodigoPais = digitos.length === 10 && digitos.startsWith("0") ? `593${digitos.slice(1)}` : digitos;
  return `https://wa.me/${conCodigoPais}?text=${encodeURIComponent(mensaje)}`;
}

const WHATSAPP_MSG_DEFAULT = "Hola, quisiera más información sobre sus productos";
function waMensajeCategoria(nombre: string): string {
  return `Hola, quisiera más información sobre ${nombre}`;
}

// Busca la foto real ya cargada en content.fotos por nombre de archivo (el
// alt queda editable desde el panel admin); si el tenant todavía no cargó
// ninguna, cae a las 6 fotos de muestra locales (mismo mecanismo que
// jyw-cc/moonvet/jmj).
function foto(fotos: Foto[], archivo: string, altPorDefecto: string): Foto {
  return fotos.find((f) => f.url.endsWith(archivo)) ?? { url: `/tenants/toyland/${archivo}`, alt: altPorDefecto };
}

const DIRECCION_DEFAULT = "Batán Shopping, 3era planta";

// Categorías por defecto — ASUNCIÓN del agente constructor (mismo patrón
// que jyw-cc): Paul no cargó catálogo real todavía. `items` describe
// variedad/tipo, NO precios. Editable desde el panel admin
// (precios.categorias) en cualquier momento.
const CATEGORIAS_DEFAULT: CategoriaProducto[] = [
  { nombre: "Figuras de acción", items: ["Anime, videojuegos y películas", "Ediciones estándar y coleccionables", "Nuevas llegadas cada mes"] },
  { nombre: "Funko Pop", items: ["Personajes de tus series favoritas", "Ediciones exclusivas y chase", "Ideal para coleccionar o regalar"] },
  { nombre: "Peluches", items: ["Tallas chica, mediana y grande", "Personajes tiernos y clásicos", "Suaves y de buena calidad"] },
  { nombre: "Accesorios y merch", items: ["Llaveros, pines y mochilas", "Poleras y gorras estampadas", "Tazas y artículos de escritorio"] },
];

// Fotos por categoría — solo se asignan a las categorías por defecto
// (mismo criterio que jyw-cc/JMJ/Travel Agency): una categoría escrita a
// mano por el admin no tiene forma confiable de saber qué foto le
// corresponde.
const FOTOS_CATEGORIAS_DEFAULT = ["figuras.jpg", "funko.jpg", "peluches.jpg", "merch.jpg"];

const NOTA_PRECIO_DEFAULT = "Los precios varían según producto y disponibilidad — escríbenos por WhatsApp y te cotizamos al instante.";

const PILARES_DEFAULT = [
  { titulo: "Novedades constantes", descripcion: "Nuevas figuras, funko y peluches llegan seguido — síguenos para no perderte los lanzamientos." },
  { titulo: "Encargos y preventas", descripcion: "¿No encuentras lo que buscas? Coordinamos encargos y preventas de piezas específicas." },
  { titulo: "Atención directa por WhatsApp", descripcion: "Consultas de stock, precio o disponibilidad las resolvemos al toque, sin catálogo genérico." },
];

const PASOS_DEFAULT = [
  "Escríbenos por WhatsApp con el producto o personaje que buscas",
  "Te confirmamos disponibilidad, precio y si hay que encargarlo",
  "Retiras en el local o coordinamos entrega",
];

const FAQ_DEFAULT = [
  { pregunta: "¿Los productos son originales?", respuesta: "Trabajamos con productos originales y licenciados — nada de imitaciones sin avisarte." },
  { pregunta: "¿Hacen preventas de figuras o funko?", respuesta: "Sí, coordinamos preventas y encargos de piezas específicas — pregúntanos por WhatsApp." },
  { pregunta: "¿Puedo reservar un producto?", respuesta: "Sí, puedes reservar con un abono mientras lo retiras o coordinas el envío." },
  { pregunta: "¿Tienen envíos a otras ciudades?", respuesta: "Sí, coordinamos envío — el costo depende de tu ciudad." },
];

// Atribución obligatoria (webya.md sección 3/7) — fotografía de muestra,
// ilustrativa, con licencia Unsplash de uso comercial libre. Ninguna es
// una foto real del local de ToyLand.
const CREDITOS_UNSPLASH = [
  { nombre: "Dohyuk You", perfil: "https://unsplash.com/@okdohyuk" },
  { nombre: "Jeremy Brady", perfil: "https://unsplash.com/@jeremygbrady" },
  { nombre: "Alex Moiseev", perfil: "https://unsplash.com/@indepty" },
  { nombre: "Saravanan Narayanan", perfil: "https://unsplash.com/@nsnclicks" },
  { nombre: "현우 지", perfil: "https://unsplash.com/@binguridangdang" },
  { nombre: "Mirna Wabi-Sabi", perfil: "https://unsplash.com/@mirnawabisabi" },
];

// Textura "pegboard" (pared de percha perforada) — puntos regulares vía
// CSS puro (radial-gradient repetido), sin imagen ni JS.
function ParedPercha({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 opacity-[0.14] ${className ?? ""}`}
      style={{
        backgroundImage: "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
        backgroundSize: "22px 22px",
      }}
    />
  );
}

// Trama de puntos (halftone) tipo impresión de cómic/manga.
function Halftone({ tono, className }: { tono: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 opacity-[0.5] ${className ?? ""}`}
      style={{
        backgroundImage: `radial-gradient(circle, ${tono} 2px, transparent 2px)`,
        backgroundSize: "14px 14px",
      }}
    />
  );
}

// CTA de WhatsApp — ícono + relleno sólido + borde negro grueso tipo cómic
// + hover con elevación (mismo estándar del resto del proyecto, adaptado
// al lenguaje visual de esta página: borde grueso + sombra "dura" en vez
// de shadow difuminada).
function WhatsAppCTA({ href, children, size = "md" }: { href: string; children: React.ReactNode; size?: "sm" | "md" }) {
  const tamano = size === "sm" ? "px-4 py-2 text-sm" : "px-6 py-3.5 text-base";
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 rounded-full border-[3px] border-black font-extrabold text-white shadow-[4px_4px_0_0_#000] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-y-0 active:shadow-[2px_2px_0_0_#000] ${tamano}`}
      style={{ backgroundColor: "var(--tenant-acento)" }}
    >
      <MessageCircle className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} strokeWidth={2.5} aria-hidden />
      {children}
    </a>
  );
}

interface FichaCategoriaProps {
  cat: CategoriaProducto;
  fotoCat: Foto | null;
  telefono: string;
  tono: string;
  delay: number;
}

function FichaCategoria({ cat, fotoCat, telefono, tono, delay }: FichaCategoriaProps) {
  return (
    <PopIn delay={delay} className="flex w-full flex-col items-center">
      <GanchoPercha tono="#2a2a2a" className="h-8 w-8" />
      <HookSway delay={delay} className="w-full">
        <div
          className="flex h-full flex-col overflow-hidden rounded-2xl border-[3px] border-black shadow-[6px_6px_0_0_#000]"
          style={{ backgroundColor: PAPEL }}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden border-b-[3px] border-black">
            {fotoCat ? (
              <Image src={fotoCat.url} alt={fotoCat.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            ) : (
              <div aria-hidden className="absolute inset-0" style={{ backgroundColor: `${tono}25` }} />
            )}
            <span
              className="absolute top-2 left-2 rounded-full border-2 border-black px-2.5 py-0.5 text-[11px] font-extrabold text-white"
              style={{ backgroundColor: tono }}
            >
              {cat.nombre}
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-2.5 p-4">
            {cat.items.length > 0 && (
              <ul className="space-y-1.5 text-sm text-black/75">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: tono }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            <a
              href={waHref(telefono, waMensajeCategoria(cat.nombre))}
              target="_blank"
              rel="noreferrer"
              className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-extrabold text-black underline-offset-4 hover:underline"
            >
              Preguntar por WhatsApp →
            </a>
          </div>
        </div>
      </HookSway>
    </PopIn>
  );
}

export function ToyLand({ tenant, content }: TenantWithContent) {
  const fondo = content.coloresMarca.fondo;
  const acento = content.coloresMarca.acento;
  const texto = content.coloresMarca.texto;

  const usaCategoriasDefault = content.precios.categorias.length === 0;
  const categorias = usaCategoriasDefault ? CATEGORIAS_DEFAULT : content.precios.categorias;
  const pilares = content.pilares.length > 0 ? content.pilares : PILARES_DEFAULT;
  const pasos = content.pasos.length > 0 ? content.pasos : PASOS_DEFAULT;
  const faq = content.faq.length > 0 ? content.faq : FAQ_DEFAULT;
  const notaPrecio = content.precios.nota || NOTA_PRECIO_DEFAULT;
  const direccion = content.textos.direccion || DIRECCION_DEFAULT;

  // A diferencia de otros tenants (donde la sección de contacto se omite
  // sin dirección real cargada), acá SIEMPRE se muestra: Paul dio la
  // ubicación real del local (Batán Shopping, 3era planta) directo en el
  // pedido de este build, así que DIRECCION_DEFAULT no es un placeholder
  // inventado — es el dato real, en lo que se replica también en
  // `content.textos.direccion` desde el panel admin. El mapa embebido sí
  // depende de ese campo real (mapaSrc abajo): mientras no esté cargado
  // ahí, se muestra una foto de la tienda en su lugar (ver JSX).
  const mapaSrc = content.textos.direccion ? `https://www.google.com/maps?q=${encodeURIComponent(content.textos.direccion)}&output=embed` : null;

  const fotoHero = foto(content.fotos, "hero.jpg", "Máquinas de cápsulas (gachapon) coloridas en una tienda de juguetes");
  const fotoTienda = foto(content.fotos, "tienda.jpg", "Vitrina de una juguetería con juguetes en exhibición");

  const tonoCategoria = [acento, VERDE, NARANJA, "#1a1a1a"];

  return (
    <div
      style={{ ["--tenant-acento" as string]: acento, backgroundColor: fondo, color: texto }}
      className={`${baloo.variable} ${nunito.variable} min-h-screen font-sans`}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b-[3px] border-black px-6 py-3 sm:px-10" style={{ backgroundColor: PAPEL }}>
        <span className={`${baloo.className} text-2xl font-extrabold tracking-tight text-black italic sm:text-3xl`}>{tenant.nombre}</span>
        <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_DEFAULT)} size="sm">
          WhatsApp
        </WhatsAppCTA>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b-[3px] border-black px-6 pt-14 pb-16 sm:px-10 sm:pt-20 sm:pb-24">
        <Halftone tono="#000" className="opacity-[0.06]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <ScrollReveal y={0} duration={0.5}>
              <p
                className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-black px-3 py-1 text-xs font-extrabold tracking-wide text-black uppercase"
                style={{ backgroundColor: PAPEL }}
              >
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                Figuras · Funko · Peluches · Merch
              </p>
            </ScrollReveal>
            <ScrollReveal y={18} delay={0.1} duration={0.7}>
              <h1 className={`${baloo.className} text-4xl leading-[1.05] font-extrabold text-black sm:text-5xl lg:text-6xl`}>
                {content.textos.tagline || "Todo lo que buscas del mundo anime, en un solo lugar"}
              </h1>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.25} duration={0.7}>
              <p className="mt-6 max-w-lg text-base font-semibold text-black/80 sm:text-lg">
                {content.textos.descripcion ||
                  `${tenant.nombre} — figuras de acción, peluches, funko pop y accesorios de tus series y animes favoritos, en el Batán Shopping.`}
              </p>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.4} duration={0.7}>
              <div className="mt-8 flex flex-wrap gap-3">
                <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_DEFAULT)}>Escribir por WhatsApp</WhatsAppCTA>
                <a
                  href="#catalogo"
                  className="inline-flex items-center gap-2 rounded-full border-[3px] border-black bg-white px-6 py-3.5 text-base font-extrabold text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000]"
                >
                  Ver catálogo
                </a>
              </div>
            </ScrollReveal>
          </div>

          <Parallax speed={0.12} className="relative mx-auto w-full max-w-md">
            <div className="relative overflow-hidden rounded-2xl border-[3px] border-black shadow-[8px_8px_0_0_#000]" style={{ backgroundColor: NARANJA }}>
              <Image src={fotoHero.url} alt={fotoHero.alt} width={900} height={1000} className="aspect-[9/10] w-full object-cover" priority />
            </div>
          </Parallax>
        </div>
      </section>

      {/* CATÁLOGO — firma visual "En la percha" */}
      <section id="catalogo" className="relative scroll-mt-20 overflow-hidden px-6 py-16 sm:px-10 sm:py-20" style={{ backgroundColor: "#1a1a1a" }}>
        <ParedPercha />
        <div className="relative mx-auto max-w-6xl">
          <ScrollReveal className="mb-14 text-center">
            <p className="mb-2 text-xs font-extrabold tracking-[0.3em] text-white/60 uppercase">Catálogo</p>
            <h2 className={`${baloo.className} text-3xl font-extrabold text-white sm:text-4xl`}>Directo de la percha</h2>
          </ScrollReveal>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {categorias.map((cat, i) => (
              <FichaCategoria
                key={cat.nombre}
                cat={cat}
                fotoCat={usaCategoriasDefault ? foto(content.fotos, FOTOS_CATEGORIAS_DEFAULT[i % FOTOS_CATEGORIAS_DEFAULT.length], cat.nombre) : null}
                telefono={content.telefonoWhatsapp}
                tono={tonoCategoria[i % tonoCategoria.length]}
                delay={(i % 4) * 0.1}
              />
            ))}
          </div>
          <p className="mt-12 text-center text-sm font-semibold text-white/60">{notaPrecio}</p>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS — bloques de color sólido, uno por pilar */}
      <section className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal className="mb-10 text-center">
            <p className="mb-2 text-xs font-extrabold tracking-[0.3em] text-black/60 uppercase">Por qué elegirnos</p>
            <h2 className={`${baloo.className} text-3xl font-extrabold text-black sm:text-4xl`}>¿Por qué comprar en {tenant.nombre}?</h2>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-3">
            {pilares.map((pilar, i) => {
              const tonos = [acento, VERDE, NARANJA];
              return (
                <PopIn key={pilar.titulo} delay={i * 0.1} className="w-full">
                  <div
                    className="flex h-full flex-col gap-3 rounded-2xl border-[3px] border-black p-6 text-white shadow-[6px_6px_0_0_#000]"
                    style={{ backgroundColor: tonos[i % tonos.length] }}
                  >
                    <PartyPopper className="h-6 w-6" strokeWidth={2} aria-hidden />
                    <h3 className="text-lg font-extrabold">{pilar.titulo}</h3>
                    <p className="text-sm opacity-95">{pilar.descripcion}</p>
                  </div>
                </PopIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* CÓMO COMPRAR */}
      <section className="relative overflow-hidden border-y-[3px] border-black px-6 py-16 sm:px-10 sm:py-20" style={{ backgroundColor: PAPEL }}>
        <Halftone tono={acento} className="opacity-[0.08]" />
        <div className="relative mx-auto max-w-3xl">
          <ScrollReveal className="mb-12 text-center">
            <p className="mb-2 text-xs font-extrabold tracking-[0.3em] text-black/60 uppercase">Cómo comprar</p>
            <h2 className={`${baloo.className} text-3xl font-extrabold text-black sm:text-4xl`}>De WhatsApp a tus manos</h2>
          </ScrollReveal>
          <div className="space-y-8">
            {pasos.map((paso, i) => (
              <ScrollReveal key={paso} delay={i * 0.12}>
                <div className="flex items-center gap-5">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-black text-lg font-extrabold text-white"
                    style={{ backgroundColor: [acento, VERDE, NARANJA][i % 3] }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-base font-semibold text-black sm:text-lg">{paso}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <ScrollReveal>
            <p className="mb-2 text-xs font-extrabold tracking-[0.3em] text-black/60 uppercase">Antes de escribirnos</p>
            <h2 className={`${baloo.className} mb-8 text-3xl font-extrabold text-black sm:text-4xl`}>Preguntas frecuentes</h2>
          </ScrollReveal>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <ScrollReveal key={item.pregunta} delay={i * 0.06}>
                <details className="rounded-xl border-[3px] border-black p-4" style={{ backgroundColor: PAPEL }}>
                  <summary className="cursor-pointer font-extrabold text-black">{item.pregunta}</summary>
                  <p className="mt-2 text-sm text-black/75">{item.respuesta}</p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO / UBICACIÓN */}
      <section className="border-t-[3px] border-black px-6 py-16 sm:px-10 sm:py-20" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <ScrollReveal>
              <p className="mb-2 text-xs font-extrabold tracking-[0.3em] text-white/60 uppercase">Visítanos</p>
              <h2 className={`${baloo.className} mb-6 text-3xl font-extrabold text-white sm:text-4xl`}>Encuéntranos</h2>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0" style={{ color: NARANJA }} strokeWidth={2} aria-hidden />
                <p className="font-semibold text-white/90">{direccion}</p>
              </div>
              {content.horarios.length > 0 && (
                <div className="mt-4 flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0" style={{ color: VERDE }} strokeWidth={2} aria-hidden />
                  <ul className="space-y-0.5 text-sm text-white/75">
                    {content.horarios.map((h) => (
                      <li key={h.dia} className="flex gap-2">
                        <span className="opacity-70">{h.dia}:</span>
                        <span>{h.horas}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-4 flex items-start gap-3">
                <Truck className="mt-0.5 h-5 w-5 shrink-0" style={{ color: acento }} strokeWidth={2} aria-hidden />
                <p className="text-sm text-white/75">Coordinamos entrega si no puedes pasar por el local.</p>
              </div>

              <div className="mt-8">
                <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_DEFAULT)}>Escribir por WhatsApp</WhatsAppCTA>
              </div>
            </ScrollReveal>

            {mapaSrc ? (
              <ScrollReveal scale={0.96}>
                <div className="overflow-hidden rounded-2xl border-[3px] border-black">
                  <iframe src={mapaSrc} className="h-80 w-full" loading="lazy" title={`Mapa de ${tenant.nombre}`} />
                </div>
              </ScrollReveal>
            ) : (
              <ScrollReveal scale={0.96}>
                <div className="overflow-hidden rounded-2xl border-[3px] border-black">
                  <Image src={fotoTienda.url} alt={fotoTienda.alt} width={900} height={650} className="aspect-[4/3] w-full object-cover" />
                </div>
              </ScrollReveal>
            )}
          </div>
      </section>

      {/* Footer */}
      <footer className="border-t-[3px] border-black px-6 py-10 text-xs text-black/70 sm:px-10" style={{ backgroundColor: PAPEL }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-semibold">
            {tenant.nombre} — {direccion}
          </p>
          <div className="flex gap-4">
            {content.instagramUrl && (
              <a href={content.instagramUrl} target="_blank" rel="noreferrer" className="font-semibold underline">
                Instagram
              </a>
            )}
            {content.facebookUrl && (
              <a href={content.facebookUrl} target="_blank" rel="noreferrer" className="font-semibold underline">
                Facebook
              </a>
            )}
          </div>
        </div>
        {content.formasPago.length > 0 && <p className="mt-3">Formas de pago: {content.formasPago.join(", ")}</p>}
        <p className="mt-4 max-w-3xl leading-relaxed">
          {tenant.nombre} todavía no tiene fotos propias del local cargadas — las fotos de esta página son de muestra, con licencia Unsplash (uso
          comercial gratuito), ilustrativas de juguetería/coleccionables en general (no son productos ni el local real de este negocio), por{" "}
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
