import { Geist, Geist_Mono } from "next/font/google";
import { Bus, ChevronDown, Headset, Monitor, Network, Receipt, Smartphone, Store, Stethoscope, Truck } from "lucide-react";
import type { CategoriaProducto, TenantWithContent } from "@/lib/types";
import { ScrollReveal } from "@/engine/ScrollReveal";
import { NodePop, ProjectsTrunk, SelesFlow } from "@/custom/sagedac/effects";

// SAGEDAC — séptima página de código a medida (webya.md sección 5), y la
// primera que no es un negocio local. Encargo directo de Paul: SAGEDAC es
// su holding/base digital personal — la entidad matriz de la que nacen y
// desde la que se conectan sus otros proyectos (Domiship, miboleto.ec,
// Seles, Turnova, Convia). Es una página informativa/de referencia
// (portafolio personal, "snapshot visual" del ecosistema), sin venta y sin
// CTA — por eso rompe deliberadamente varios principios de webya.md
// sección 7 que sí son obligatorios para el resto de tenants:
//   - Sin fotografía real (ni de muestra Unsplash): el diseño es
//     estrictamente abstracto/geométrico (nodos, líneas, tipografía) sobre
//     blanco y negro puro. No hay "negocio físico" del que fotografiar
//     nada — forzar una foto de stock de "oficina tech genérica" habría
//     sido justo el placeholder sin avisar que la sección 7 prohíbe.
//   - Sin WhatsApp/CTA de ningún tipo: no vende nada, así que
//     `content.telefonoWhatsapp` existe en el esquema pero esta página no
//     lo lee ni renderiza ningún botón de contacto.
//   - Sin precios: `content.precios.nota` se reutiliza (ver convención de
//     datos más abajo) pero no para un precio, para el copy de cierre.
//   - `content.rubro` no tiene un valor real para una holding — se usa
//     "otro" (valor ya existente en el enum `Rubro`, src/lib/types.ts) en
//     vez de forzar un rubro de negocio local que no aplica.
//   - `content.coloresMarca` (el mecanismo que usa cualquier otro tenant
//     custom_code para su paleta editable desde el panel) tampoco se lee
//     acá: el blanco y negro estricto es una decisión de marca fija de
//     SAGEDAC, no una paleta que deba quedar editable por campo — pedido
//     explícito de Paul ("SIN colores de acento de ningún tipo").
//
// Paso 4 del proceso del agente constructor — criterio para ESTE
// "negocio" (una holding tecnológica, no un negocio de atención al
// público):
// - ¿Qué objetos/materiales/texturas pertenecen genuinamente a esto? Nada
//   físico — SAGEDAC no tiene local, producto ni vitrina. Lo que sí tiene
//   es una estructura real: un origen común (la base) del que parten
//   ramas (los proyectos) que además se conectan entre sí (Seles
//   prestando facturación electrónica a Domiship y Turnova). De ahí la
//   firma visual: un sistema radicular — nodo central, eje que crece con
//   el scroll, ramas que brotan de él — en vez de cualquier motivo
//   decorativo importado de otra industria.
// - ¿Qué vocabulario usaría Paul? "Base", "ecosistema", "conecta con",
//   "consume el servicio de" — nunca "panel", "dashboard" ni "monitoreo"
//   para describir a SAGEDAC en sí (recordatorio explícito del brief):
//   SAGEDAC es el origen estructural de los proyectos, no una herramienta
//   externa que los observa.
// - ¿Qué necesita ver/saber alguien antes de nada? Esta página no tiene
//   "cliente" que necesite decidir escribir por WhatsApp — es una
//   referencia para el propio Paul y quien la vea con él. Lo que sí debe
//   quedar claro de inmediato es la relación estructural: que los 5
//   proyectos no son islas, que nacen de la misma base, y que Seles es el
//   conector que literalmente presta un servicio (facturación
//   electrónica) al resto — de ahí que esa conexión tenga su propio
//   diagrama animado, el momento visual más importante de la página.
//
// Firma visual (webya.md sección 7, "un elemento firma único por
// landing" — no reutiliza el motivo de ningún tenant hermano: ni la placa
// de calle de 26st, ni la fase lunar de Moonvet, ni la cinta métrica de
// JMJ, ni el pase de embarque de Travel Agency, ni el sello de joyero de
// JYW CC): "Sistema radicular". El hero es un nodo central del que nacen
// líneas finas hacia abajo (dibujadas con CSS puro al cargar, ver nota de
// ScrollReveal más abajo); conforme se hace scroll, un eje vertical
// (`ProjectsTrunk`, src/custom/sagedac/effects.tsx) crece hacia abajo
// -nunca al revés- y cada proyecto "brota" de él (`NodePop`) uno tras
// otro. Seles, el conector clave, muestra además un diagrama de flujo
// (`SelesFlow`) con líneas que se trazan y luego pulsan en bucle hacia
// Domiship y Turnova, visualizando la facturación electrónica compartida.
//
// Convención de datos — tenant_content no tiene un campo dedicado para
// "proyectos de un ecosistema", así que este componente reinterpreta el
// esquema genérico así (documentado acá porque no es obvio desde fuera):
//   - content.precios.categorias  -> los 5 proyectos del ecosistema.
//       - cat.nombre    -> nombre del proyecto (ej. "Seles").
//       - cat.items[0]  -> rol/one-liner corto (ej. "El conector clave").
//       - cat.items[1]  -> descripción completa (párrafo).
//   - content.precios.nota        -> copy de la sección de cierre ("lo que
//     viene" / app de delivery en el radar) — no una nota de precio.
//   - content.textos.tagline      -> titular del hero.
//   - content.textos.descripcion  -> subtítulo del hero.
//   - content.textos.diferenciador -> statement de la sección de
//     transición ("no son proyectos separados, es un ecosistema
//     conectado").
// El resto de tenant_content (fotos, foto_destacada, pilares, pasos,
// horarios, FAQ, testimonios, cifras, formas de pago, redes sociales,
// google rating, WhatsApp) se deja sin usar a propósito — no aplican a una
// página de este tipo, y forzarlos habría sido justo el "reskin de
// negocio local" que esta página no es.
//
// El ícono por proyecto (`ICONOS_PROYECTO`) y la detección de cuál
// proyecto es Seles (para mostrar `SelesFlow`) son metadata puramente
// visual que tampoco vive en tenant_content — se resuelven acá por nombre
// normalizado, mismo patrón que `DESTINO_META` en
// src/custom/travel-agency/TravelAgency.tsx.

// Mismo request exacto (sin `weight` explícito, fuente variable) que
// src/app/layout.tsx — reimportar con una selección de pesos distinta
// fuerza a Next a resolver un recurso de fuente nuevo/no cacheado, que en
// este entorno de build no logró resolverse contra fonts.gstatic.com
// (error real encontrado en la verificación de esta página: "Module not
// found" en el chunk de fuente de Turbopack). Coincidir con el request del
// layout raíz reutiliza el mismo recurso ya resuelto ahí.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const FONDO = "#050505";
const TEXTO = "#F4F3EF";

const TAGLINE_DEFAULT = "La base de la que nace todo.";
const DESCRIPCION_DEFAULT =
  "SAGEDAC es la estructura raíz sobre la que se construyen y se conectan Domiship, miboleto.ec, Seles, Turnova y Convia — no un panel que los observa desde afuera, sino el origen común del que parten.";
const DIFERENCIADOR_DEFAULT = "No son proyectos separados. Es un ecosistema conectado — con una sola base.";
const NOTA_CIERRE_DEFAULT =
  "Una app de delivery para el mercado ecuatoriano, al estilo Rappi o PedidosYa, ya está en conversación. No es uno de los cinco proyectos activos todavía — pero nace de la misma base.";

const PROYECTOS_DEFAULT: CategoriaProducto[] = [
  {
    nombre: "Domiship",
    items: [
      "La puerta de entrada",
      "Marketplace de e-commerce enfocado en ayudar a negocios locales a digitalizarse — lleva comercios físicos al mundo digital, desde cero.",
    ],
  },
  {
    nombre: "miboleto.ec",
    items: [
      "Digitalización operativa, no solo boletos",
      "Va más allá de vender boletos en línea: digitaliza la operación completa de empresas de transporte interprovincial — venta de boletos y gestión operativa, en un solo lugar.",
    ],
  },
  {
    nombre: "Seles",
    items: [
      "El conector clave",
      "Sistema contable enfocado en mejorar costos, con portafolios para que contadores gestionen múltiples clientes de forma centralizada. Facturación electrónica integrada: solo subes tu firma electrónica y ya puedes emitir comprobantes. Seles no es un proyecto aislado — es el motor de facturación electrónica que se expande hacia el resto del ecosistema: las tiendas de Domiship podrán emitir comprobantes a través de Seles, y Turnova lo usa para que los consultorios facturen a sus pacientes.",
    ],
  },
  {
    nombre: "Turnova",
    items: [
      "Salud y bienestar, conectado",
      "Gestión de consultorios individuales o múltiples, con agendamiento de citas y fichas técnicas de pacientes. Consume el servicio de facturación electrónica de Seles para emitir comprobantes a sus pacientes.",
    ],
  },
  {
    nombre: "Convia",
    items: [
      "Atención compartida del ecosistema",
      "Motor de call center omnicanal. Su prueba piloto es interna: primero da servicio a las propias empresas del ecosistema (miboleto, Seles, Turnova, Domiship) antes de ofrecerse como servicio a terceros.",
    ],
  },
];

function normalizarNombre(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

const ICONOS_PROYECTO: Record<string, typeof Store> = {
  domiship: Store,
  miboletoec: Bus,
  seles: Receipt,
  turnova: Stethoscope,
  convia: Headset,
};

// Nodo central del hero — SVG con 5 líneas finas que "brotan" hacia abajo,
// insinuando los proyectos que se van a revelar con el scroll. Se dibujan
// con CSS puro (utilidad `animate-draw-line`, globals.css) en vez de
// GSAP/ScrollTrigger: es contenido garantizado visible al cargar la
// página (el hero, sin scroll de por medio), el mismo caso que llevó al
// bug real de ScrollReveal documentado en webya.md 2026-08-16 — contenido
// ya en viewport que depende de un umbral de scroll para revelarse puede
// quedarse en opacity:0 para siempre. `pathLength="1"` normaliza cada
// trazo a una longitud de 1 así la animación CSS no necesita calcular el
// largo real de cada curva.
function HeroNode() {
  const ramas = [
    "M160,36 C160,84 62,108 42,196",
    "M160,36 C160,84 112,118 102,196",
    "M160,36 C160,88 160,140 160,198",
    "M160,36 C160,84 208,118 218,196",
    "M160,36 C160,84 258,108 278,196",
  ];
  return (
    <svg viewBox="0 0 320 220" className="mx-auto h-40 w-full max-w-xs sm:h-52 sm:max-w-sm" aria-hidden>
      {ramas.map((d, i) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          stroke="white"
          strokeOpacity="0.4"
          strokeWidth="1"
          strokeDasharray="1"
          fill="none"
          strokeLinecap="round"
          className="animate-draw-line"
          style={{ animationDelay: `${0.15 + i * 0.12}s` }}
        />
      ))}
      <circle cx="160" cy="36" r="16" fill="none" stroke="white" strokeOpacity="0.18" />
      <circle cx="160" cy="36" r="6" fill="white" />
    </svg>
  );
}

function PlatformBadge({ className }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full border border-white/15 px-4 py-2 font-mono text-[11px] tracking-[0.2em] text-white/55 uppercase ${className ?? ""}`}
    >
      <span className="flex items-center gap-1.5">
        <Smartphone className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
        App
      </span>
      <span aria-hidden className="h-3 w-px bg-white/20" />
      <span className="flex items-center gap-1.5">
        <Monitor className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
        Web
      </span>
    </div>
  );
}

interface ProjectSectionProps {
  numero: number;
  cat: CategoriaProducto;
}

function ProjectSection({ numero, cat }: ProjectSectionProps) {
  const key = normalizarNombre(cat.nombre);
  const Icono = ICONOS_PROYECTO[key] ?? Network;
  const kicker = cat.items[0] || "";
  const descripcion = cat.items[1] || "";
  const esSeles = key === "seles";

  return (
    <div className="relative pl-14 sm:pl-24">
      <NodePop delay={0.05} className="absolute top-0.5 left-5 -translate-x-1/2 sm:left-7">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-[#050505] font-mono text-xs font-semibold text-white/80 sm:h-12 sm:w-12 sm:text-sm">
          {String(numero).padStart(2, "0")}
        </span>
      </NodePop>

      <ScrollReveal delay={0.08}>
        <div className="mb-3 flex items-center gap-2 text-white/45">
          <Icono className="h-4 w-4" strokeWidth={1.6} aria-hidden />
          <p className="text-xs font-medium tracking-[0.25em] uppercase">{kicker}</p>
        </div>
        <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{cat.nombre}</h3>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{descripcion}</p>
        <PlatformBadge className="mt-6" />

        {esSeles && (
          <div className="mt-12 w-full max-w-md">
            {/* El contenedor con position:relative envuelve SOLO el
                diagrama, con su propio aspect-ratio — así su altura queda
                fija y las etiquetas posicionadas por porcentaje (top: 88%)
                caen sobre el borde del diagrama. Antes envolvía también el
                párrafo de abajo, que sí ocupa espacio en el flujo normal:
                eso estiraba la altura del contenedor más allá del SVG, y
                "88%" terminaba cayendo encima del texto en vez del
                diagrama — bug real encontrado en la verificación visual
                2026-08-16. */}
            <div className="relative aspect-[2/1] w-full">
              <SelesFlow className="h-full w-full" />
              <span
                className="absolute -translate-x-1/2 rounded-full border border-white/30 bg-[#050505] px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-white/70 uppercase"
                style={{ left: "50%", top: "0%" }}
              >
                Seles
              </span>
              <span
                className="absolute rounded-full border border-white/12 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase"
                style={{ left: "0%", top: "88%" }}
              >
                Domiship
              </span>
              <span
                className="absolute rounded-full border border-white/12 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase"
                style={{ right: "0%", top: "88%" }}
              >
                Turnova
              </span>
            </div>
            <p className="mt-6 max-w-sm text-xs text-white/40 italic">
              Facturación electrónica prestada en vivo a las tiendas de Domiship y a los consultorios de Turnova.
            </p>
          </div>
        )}
      </ScrollReveal>
    </div>
  );
}

export function Sagedac({ content }: TenantWithContent) {
  const proyectos = content.precios.categorias.length > 0 ? content.precios.categorias : PROYECTOS_DEFAULT;
  const nombresProyectos = proyectos.map((p) => p.nombre);

  return (
    <div style={{ backgroundColor: FONDO, color: TEXTO }} className={`${geist.variable} ${geistMono.variable} min-h-screen font-sans`}>
      {/* Header — sin CTA (esta página no vende nada), solo el wordmark y
          el conteo de proyectos como referencia de estructura, no como
          navegación de venta. */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 backdrop-blur-md sm:px-10" style={{ backgroundColor: `${FONDO}cc` }}>
        <span className="font-mono text-sm font-semibold tracking-[0.3em] uppercase">SAGEDAC</span>
        <span className="font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase">{proyectos.length} proyectos conectados</span>
      </header>

      {/* HERO — nodo central + texto, animado con CSS puro
          (animate-fade-in-up / animate-draw-line, globals.css), nunca con
          ScrollReveal: es contenido garantizado visible al cargar, sin
          scroll de por medio (ver nota de HeroNode arriba y webya.md,
          bug real 2026-08-16). */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16 text-center sm:px-10">
        <div className="animate-fade-in-up" style={{ animationDelay: "0s" }}>
          <HeroNode />
        </div>
        <p className="mt-2 animate-fade-in-up font-mono text-xs tracking-[0.35em] text-white/40 uppercase" style={{ animationDelay: "0.2s" }}>
          Ecosistema propio
        </p>
        <h1
          className="mt-5 animate-fade-in-up max-w-3xl text-4xl leading-[1.08] font-semibold tracking-tight text-white sm:text-6xl lg:text-[3.6rem]"
          style={{ animationDelay: "0.35s" }}
        >
          {content.textos.tagline || TAGLINE_DEFAULT}
        </h1>
        <p className="mt-6 max-w-xl animate-fade-in-up text-base text-white/65 sm:text-lg" style={{ animationDelay: "0.5s" }}>
          {content.textos.descripcion || DESCRIPCION_DEFAULT}
        </p>
        <div className="mt-14 flex animate-fade-in-up flex-col items-center gap-1 text-white/40" style={{ animationDelay: "0.65s" }}>
          <span className="text-[0.65rem] tracking-[0.25em] uppercase">Desliza</span>
          <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden />
        </div>
      </section>

      {/* TRANSICIÓN — statement de la filosofía del ecosistema. Contenido
          bajo el fold: ScrollReveal es el mecanismo correcto acá (no hay
          bug de contenido ya visible sin scroll). */}
      <section className="px-6 py-24 sm:px-10 sm:py-32">
        <ScrollReveal className="mx-auto max-w-2xl text-center" scale={0.97}>
          <p className="text-2xl leading-snug font-medium tracking-tight text-white sm:text-4xl">
            {content.textos.diferenciador || DIFERENCIADOR_DEFAULT}
          </p>
        </ScrollReveal>
      </section>

      {/* PROYECTOS — el eje crece con el scroll (ProjectsTrunk) y cada
          proyecto brota de él (NodePop), en el mismo orden en que
          tenant_content.precios.categorias los trae. */}
      <section className="px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <ProjectsTrunk className="space-y-24 sm:space-y-32">
            {proyectos.map((cat, i) => (
              <ProjectSection key={cat.nombre} numero={i + 1} cat={cat} />
            ))}
          </ProjectsTrunk>
        </div>
      </section>

      {/* CIERRE / VISIÓN — mención breve y deliberadamente de menor
          jerarquía visual (nodo punteado, "fantasma", desconectado del eje
          principal): insinúa la app de delivery sin tratarla como un sexto
          proyecto activo. */}
      <section className="px-6 py-24 text-center sm:px-10 sm:py-32">
        <div className="mx-auto flex max-w-md flex-col items-center">
          <div aria-hidden className="h-14 w-px border-l border-dashed border-white/20" />
          <ScrollReveal>
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/15 px-8 py-8">
              <Truck className="h-5 w-5 text-white/35" strokeWidth={1.6} aria-hidden />
              <p className="mt-4 font-mono text-[11px] tracking-[0.25em] text-white/40 uppercase">En el radar</p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">{content.precios.nota || NOTA_CIERRE_DEFAULT}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-10 text-xs text-white/40 sm:px-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
          <span className="font-mono text-sm font-semibold tracking-[0.3em] text-white/70 uppercase">SAGEDAC</span>
          <p className="font-mono text-[11px] tracking-[0.15em] uppercase">{nombresProyectos.join(" · ")}</p>
          <p className="max-w-md leading-relaxed">
            Página de referencia interna — un snapshot visual del ecosistema, sin canal de contacto público. No es una página de venta.
          </p>
        </div>
      </footer>
    </div>
  );
}
