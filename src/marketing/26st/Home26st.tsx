import Image from "next/image";
import Link from "next/link";
import { Bitter, Work_Sans } from "next/font/google";
import { ArrowRight, Check, Code2, MessageCircle, Smartphone, ExternalLink, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/engine/ScrollReveal";
import { Parallax } from "@/engine/Parallax";
import { CountUp } from "./effects";
import { FormularioContacto } from "./FormularioContacto";

// Landing de marketing de 26st — no es la página de un negocio (no lee
// tenant_content), es la vitrina de la plataforma misma: reemplaza el
// placeholder que había en esta ruta (webya.md, "no hay homepage de
// marketing pública en el alcance del primer build" — dejó de ser cierto
// acá, 2026-08-16, pedido explícito de Paul). Vive en src/marketing/26st/
// en vez de src/custom/ porque no es un tenant — mismo espíritu de "código
// a medida" que cualquier página de negocio, pero para la plataforma.
//
// Nombre de marca: "26st" (no "SitioYa" — SitioYa queda como nombre
// interno/tentativo sin confirmar, ver webya.md sección 4; "26st" es el que
// Paul pidió usar en esta landing específicamente, dominio real ya en uso:
// 26st.vercel.app). Alcance deliberadamente acotado a esta página — el
// título del sitio, el panel admin y los metadatos siguen diciendo
// "SitioYa" por ahora (decisión explícita de Paul, no un descuido).
//
// Firma visual: placa de número de calle — "26" grande + "ST" en una placa
// con relieve, como una placa de dirección real. Ancla genuina para ESTE
// negocio (a diferencia de una firma decorativa importada): el nombre
// literalmente es una dirección, y el producto son páginas para negocios
// con una dirección real detrás. Portafolio numerado igual (No. 01, 02...)
// para reforzarlo sin repetir el mismo motivo que ya usa JMJ (cinta
// métrica) o Moonvet (luna).
//
// Portafolio: las 4 páginas de código a medida reales/demo que existen hoy
// (trazojoyas, deluxtravel, moonvet, jmj — ver src/custom/registro.ts),
// todas publicadas (confirmado 2026-08-16, Paul las publicó a propósito
// para poder mostrarlas acá). Screenshots reales del hero de cada una en
// public/26st/portfolio/ (capturados en vivo, no mockups). El link de cada
// tarjeta es relativo (`/${slug}`) a propósito: esta landing ya vive en el
// mismo dominio que las páginas de negocio, así que no hace falta
// hardcodear el host.
//
// Formulario de contacto en vez de WhatsApp/teléfono (pedido explícito de
// Paul, 2026-08-16): sin un canal de contacto propio para 26st todavía, el
// CTA principal guarda el lead en Supabase (landing_leads, ver
// src/app/actions.ts) para revisión manual — no hay panel de gestión de
// leads todavía, se consulta directo desde el SQL editor de Supabase
// mientras no haga falta más que eso.

const bitter = Bitter({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-bitter" });
const workSans = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-work-sans" });

const ACENTO = "#FF7A33";
const FONDO = "#0B0C0E";
const FONDO_ELEVADO = "#151719";

interface PiezaPortafolio {
  slug: string;
  nombre: string;
  descripcion: string;
  etiqueta: "Cliente real" | "Demo";
  imagen: string;
}

const PORTAFOLIO: PiezaPortafolio[] = [
  {
    slug: "deluxtravel",
    nombre: "DeluxTravel",
    descripcion: "Agencia de viajes en Cuenca — paquetes internacionales, salida desde el aeropuerto Mariscal Lamar.",
    etiqueta: "Cliente real",
    imagen: "/26st/portfolio/deluxtravel.jpg",
  },
  {
    slug: "jmj",
    nombre: "JMJ Painting & Remodeling",
    descripcion: "Contratista de remodelación y pintura en East Brunswick, Nueva Jersey (EE.UU.) — nuestro primer cliente fuera de Ecuador.",
    etiqueta: "Cliente real",
    imagen: "/26st/portfolio/jmj.jpg",
  },
  {
    slug: "moonvet",
    nombre: "Moonvet",
    descripcion: "Clínica veterinaria 24 horas en Cuenca — la firma visual (fase lunar en vivo) nace del nombre del negocio.",
    etiqueta: "Cliente real",
    imagen: "/26st/portfolio/moonvet.jpg",
  },
  {
    slug: "trazojoyas",
    nombre: "Trazo Joyas",
    descripcion: "Joyería minimalista, plata 925 y acero quirúrgico — demo interno para mostrar el estándar de nivel producto.",
    etiqueta: "Demo",
    imagen: "/26st/portfolio/trazojoyas.jpg",
  },
];

const PILARES = [
  {
    icono: Code2,
    titulo: "Código a medida, no plantillas",
    descripcion: "Cada página se escribe para tu negocio real — tus fotos, tu historia, tu diferenciador. Nunca un genérico con tu logo pegado encima.",
  },
  {
    icono: Sparkles,
    titulo: "Un solo estándar: el más alto",
    descripcion: "No hay versión recortada. Animaciones, diseño mobile-first y SEO local en cada página, sin importar el rubro del negocio.",
  },
  {
    icono: MessageCircle,
    titulo: "Hecha para WhatsApp",
    descripcion: "Tus clientes ya te escriben por WhatsApp. Tu página lleva directo ahí, con botón fijo también en el celular.",
  },
];

const PASOS = [
  { numero: "01", titulo: "Nos cuentas tu negocio", descripcion: "Nombre, WhatsApp, fotos reales, qué te hace diferente de los demás." },
  { numero: "02", titulo: "Construimos tu página, a medida", descripcion: "Código propio para tu negocio — no una plantilla reciclada de otro rubro." },
  { numero: "03", titulo: "La revisas antes de publicar", descripcion: "Ajustes hasta que quede tal como la quieres, sin costo adicional." },
  { numero: "04", titulo: "Queda en línea, y la editas tú", descripcion: "Panel propio para cambiar precios, fotos y horarios cuando quieras." },
];

// Placa de dirección — la firma visual de esta página (ver nota arriba).
function PlacaCalle({ className }: { className?: string }) {
  return (
    <div
      className={`relative flex aspect-[4/5] w-full max-w-sm flex-col items-center justify-center rounded-[2rem] border-4 shadow-2xl ${className ?? ""}`}
      style={{ borderColor: `${ACENTO}55`, backgroundColor: FONDO_ELEVADO }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-3 rounded-[1.6rem] border border-white/10" />
      <span className="font-mono text-xs tracking-[0.4em] text-white/40 uppercase">No. 26</span>
      <span className={`${bitter.className} mt-2 text-8xl font-extrabold sm:text-9xl`} style={{ color: ACENTO }}>
        26
      </span>
      <span className="mt-2 text-2xl font-semibold tracking-[0.5em] text-white/85 uppercase">St</span>
      <div aria-hidden className="pointer-events-none absolute top-6 left-6 h-2.5 w-2.5 rounded-full bg-white/15" />
      <div aria-hidden className="pointer-events-none absolute top-6 right-6 h-2.5 w-2.5 rounded-full bg-white/15" />
      <div aria-hidden className="pointer-events-none absolute bottom-6 left-6 h-2.5 w-2.5 rounded-full bg-white/15" />
      <div aria-hidden className="pointer-events-none absolute right-6 bottom-6 h-2.5 w-2.5 rounded-full bg-white/15" />
    </div>
  );
}

export function Home26st() {
  return (
    <div
      style={{ ["--26st-acento" as string]: ACENTO, backgroundColor: FONDO, color: "#F2EFE9" }}
      className={`${bitter.variable} ${workSans.variable} min-h-screen font-sans`}
    >
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-3 px-6 py-4 backdrop-blur-md sm:px-10" style={{ backgroundColor: `${FONDO}cc` }}>
        <span className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-extrabold text-black"
            style={{ backgroundColor: ACENTO }}
          >
            26
          </span>
          <span className={`${bitter.className} text-lg font-bold tracking-tight`}>26st</span>
        </span>
        <nav className="hidden items-center gap-8 text-sm text-white/70 sm:flex">
          <a href="#portafolio" className="transition hover:text-white">
            Portafolio
          </a>
          <a href="#precio" className="transition hover:text-white">
            Precio
          </a>
          <a href="#como-funciona" className="transition hover:text-white">
            Cómo funciona
          </a>
        </nav>
        <a
          href="#contacto"
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-black transition hover:-translate-y-0.5"
          style={{ backgroundColor: ACENTO }}
        >
          Quiero mi página
        </a>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-32 pb-20 sm:px-10 sm:pt-40 sm:pb-28">
        <div aria-hidden className="pointer-events-none absolute top-0 right-0 h-[30rem] w-[30rem] rounded-full opacity-[0.12] blur-[120px]" style={{ backgroundColor: ACENTO }} />

        <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <ScrollReveal y={0} duration={0.5}>
              <p className="mb-5 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Páginas web para negocios locales</p>
            </ScrollReveal>
            <ScrollReveal y={18} delay={0.1} duration={0.7}>
              <h1 className={`${bitter.className} text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-[3.3rem]`}>
                El buen negocio ya lo tienes. Te falta la página que lo demuestre.
              </h1>
            </ScrollReveal>
            <ScrollReveal y={18} delay={0.25} duration={0.7}>
              <p className="mt-6 max-w-lg text-base opacity-75 sm:text-lg">
                26st construye páginas web a medida — código propio, no plantillas — para negocios con buenas reseñas en Google que todavía no tienen sitio.
              </p>
            </ScrollReveal>
            <ScrollReveal y={18} delay={0.4} duration={0.7}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contacto"
                  className="inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-black shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
                  style={{ backgroundColor: ACENTO }}
                >
                  Quiero mi página
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                </a>
                <a
                  href="#portafolio"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-white/20 px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-white/40 sm:text-base"
                >
                  Ver portafolio
                </a>
              </div>
            </ScrollReveal>
            <ScrollReveal y={18} delay={0.55} duration={0.7}>
              <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
                <div>
                  <CountUp to={4} className={`${bitter.className} text-3xl font-extrabold`} style={{ color: ACENTO }} />
                  <p className="mt-1 text-xs tracking-wide text-white/50 uppercase">Páginas ya en línea</p>
                </div>
                <div>
                  <CountUp to={100} prefix="$" className={`${bitter.className} text-3xl font-extrabold`} style={{ color: ACENTO }} />
                  <p className="mt-1 text-xs tracking-wide text-white/50 uppercase">Por página, sin sorpresas</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <Parallax speed={0.15} className="relative mx-auto w-full">
            <PlacaCalle className="mx-auto" />
          </Parallax>
        </div>
      </section>

      {/* PILARES */}
      <section className="px-6 py-16 sm:px-10 sm:py-20" style={{ backgroundColor: FONDO_ELEVADO }}>
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Por qué 26st</p>
            <h2 className={`${bitter.className} mb-12 max-w-2xl text-3xl font-bold sm:text-4xl`}>No vendemos plantillas. Construimos tu página.</h2>
          </ScrollReveal>
          <div className="grid gap-8 sm:grid-cols-3">
            {PILARES.map((p, i) => (
              <ScrollReveal key={p.titulo} delay={i * 0.1}>
                <p.icono className="h-7 w-7" style={{ color: ACENTO }} strokeWidth={1.8} aria-hidden />
                <h3 className={`${bitter.className} mt-4 text-lg font-semibold`}>{p.titulo}</h3>
                <p className="mt-2 text-sm opacity-70">{p.descripcion}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PORTAFOLIO */}
      <section id="portafolio" className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Portafolio</p>
            <h2 className={`${bitter.className} mb-2 text-3xl font-bold sm:text-4xl`}>Páginas reales, no maquetas</h2>
            <p className="mb-10 max-w-xl text-sm opacity-70 sm:text-base">Cada tarjeta lleva a la página publicada — ábrela y navégala como lo haría un cliente.</p>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {PORTAFOLIO.map((pieza, i) => (
              <ScrollReveal key={pieza.slug} delay={(i % 2) * 0.1}>
                <Link
                  href={`/${pieza.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group block overflow-hidden rounded-2xl border border-white/10 transition hover:border-white/25"
                  style={{ backgroundColor: FONDO_ELEVADO }}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={pieza.imagen}
                      alt={`Captura de la página de ${pieza.nombre}`}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover object-left-top transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span
                      className="absolute top-3 left-3 rounded px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase"
                      style={{ backgroundColor: pieza.etiqueta === "Cliente real" ? `${ACENTO}e6` : "rgba(255,255,255,0.15)", color: pieza.etiqueta === "Cliente real" ? "#000" : "#fff" }}
                    >
                      {pieza.etiqueta}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`${bitter.className} text-lg font-semibold`}>{pieza.nombre}</h3>
                      <ExternalLink className="h-4 w-4 shrink-0 opacity-50 transition group-hover:opacity-100" strokeWidth={2} aria-hidden />
                    </div>
                    <p className="mt-2 text-sm opacity-70">{pieza.descripcion}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRECIO */}
      <section id="precio" className="px-6 py-16 sm:px-10 sm:py-20" style={{ backgroundColor: FONDO_ELEVADO }}>
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Precio</p>
            <h2 className={`${bitter.className} mb-4 text-3xl font-bold sm:text-4xl`}>Un solo estándar. Un solo precio.</h2>
            <p className="mx-auto mb-10 max-w-lg text-sm opacity-70 sm:text-base">
              No hay versión barata de la que amortizar menos trabajo — cada página se construye con el mismo nivel, sin importar el rubro.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1} scale={0.96}>
            <div className="mx-auto max-w-sm rounded-3xl border-2 p-8" style={{ borderColor: ACENTO }}>
              <p className={`${bitter.className} text-5xl font-extrabold`} style={{ color: ACENTO }}>
                $100
              </p>
              <p className="mt-1 text-sm opacity-60">por página</p>
              <ul className="mt-6 space-y-2.5 text-left text-sm">
                {["Código a medida para tu negocio", "Animaciones y diseño mobile-first", "SEO local (datos estructurados)", "Botón de WhatsApp fijo en el celular", "Panel para editar tú mismo cuando quieras"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ACENTO }} strokeWidth={2.5} aria-hidden />
                    <span className="opacity-85">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contacto"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5"
                style={{ backgroundColor: ACENTO }}
              >
                Quiero mi página
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <p className="mb-2 text-center text-xs font-medium tracking-[0.3em] uppercase opacity-60">Cómo funciona</p>
            <h2 className={`${bitter.className} mb-12 text-center text-3xl font-bold sm:text-4xl`}>De una conversación a tu página en línea</h2>
          </ScrollReveal>
          <div className="relative">
            <div aria-hidden className="absolute top-2 bottom-2 left-6 w-px opacity-15" style={{ backgroundColor: ACENTO }} />
            <div className="space-y-9">
              {PASOS.map((paso, i) => (
                <ScrollReveal key={paso.numero} delay={i * 0.1}>
                  <div className="relative flex items-start gap-5">
                    <span
                      className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-semibold"
                      style={{ borderColor: ACENTO, backgroundColor: FONDO }}
                    >
                      {paso.numero}
                    </span>
                    <div className="pt-2">
                      <h3 className={`${bitter.className} text-lg font-semibold`}>{paso.titulo}</h3>
                      <p className="mt-1 text-sm opacity-70">{paso.descripcion}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="px-6 py-16 sm:px-10 sm:py-20" style={{ backgroundColor: FONDO_ELEVADO }}>
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <ScrollReveal>
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Contacto</p>
            <h2 className={`${bitter.className} mb-4 text-3xl font-bold sm:text-4xl`}>Cuéntanos de tu negocio</h2>
            <p className="max-w-sm text-sm opacity-70 sm:text-base">
              Sin compromiso. Nos escribes, te contamos cómo se vería tu página y qué necesitamos de ti para construirla.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm opacity-70">
              <Smartphone className="h-5 w-5" style={{ color: ACENTO }} strokeWidth={1.8} aria-hidden />
              Diseñado mobile-first, como el 72%+ de las búsquedas locales.
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <FormularioContacto />
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-10 text-xs opacity-60 sm:px-10" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded text-[11px] font-extrabold text-black" style={{ backgroundColor: ACENTO }}>
              26
            </span>
            26st — páginas web para negocios locales.
          </span>
          <a href="#portafolio" className="underline underline-offset-4">
            Ver portafolio
          </a>
        </div>
      </footer>
    </div>
  );
}
