import { Archivo, Space_Mono } from "next/font/google";
import Image from "next/image";
import { ChevronDown, Clock, MapPin, MessageCircle } from "lucide-react";
import type { CategoriaProducto, Foto, TenantWithContent } from "@/lib/types";
import { ScrollReveal } from "@/engine/ScrollReveal";
import { Parallax } from "@/engine/Parallax";
import { CotaDivider, MarcasEsquina } from "@/custom/estudio-arquitectura/effects";
import { ProyectosGaleria, type CategoriaResuelta, type ProyectoResuelto } from "@/custom/estudio-arquitectura/ProyectosGaleria";

// Estudio de Arquitectura — octava página de código a medida bajo el
// modelo de webya.md sección 5 (reset del catálogo, 2026-08-12). Cliente
// real de Paul: sin nombre comercial propio ("el dueño no dio un nombre
// más específico"), WhatsApp 0939671012. Paso 4 del proceso del agente
// constructor — criterio de nicho para ESTE negocio (no la categoría
// genérica "estudio de arquitectura"):
//
// - ¿Qué objetos/materiales/texturas pertenecen genuinamente a este
//   negocio? El plano acotado (línea de cota con flechas y medida), el
//   cuadro de rotulación de una lámina técnica, hormigón visto, madera,
//   ladrillo — los materiales reales con los que se construye en Cuenca —
//   no renders 3D genéricos ni un "hero de agencia" con gente sonriendo en
//   una oficina. De ahí que la firma visual (ver abajo) sea literalmente
//   una convención de dibujo técnico, no un adorno decorativo importado.
// - ¿Qué vocabulario usaría el dueño? "Anteproyecto", "planos", "área de
//   construcción", "dirección de obra", "levantamiento del terreno",
//   "permisos municipales" — no "experiencias espaciales inmersivas" ni
//   relleno corporativo de estudio internacional.
// - ¿Qué necesita ver un cliente antes de escribir por WhatsApp? Trabajo
//   real ya construido (de ahí el portafolio por categoría con galería +
//   info de cada proyecto — pedido explícito de Paul), qué tipo de
//   proyectos hace el estudio (vivienda/comercio, no solo uno), y si se
//   encarga también de permisos/dirección de obra o solo de los planos.
//
// Nombre de marca: se usa `tenant.nombre` tal cual (mismo patrón que el
// resto de páginas del proyecto, ej. DeluxTravel/JYWCC) en vez de inventar
// un nombre más "trabajado" — Paul confirmó que el valor real es
// literalmente "Estudio de Arquitectura". Es un nombre plano pero honesto
// (no se fabrica una historia o un apellido de fundador que no existe);
// el tratamiento tipográfico (lockup en dos líneas + regla + marca de
// cota, ver header) es lo que le da carácter de marca sin inventar datos.
//
// Firma visual (webya.md sección 7, "un elemento firma único por
// landing"): "Acotado" — la línea de cota de un plano técnico
// (`CotaDivider`, src/custom/estudio-arquitectura/effects.tsx) que se
// traza con el scroll entre secciones, y fichas de proyecto con marcas de
// esquina tipo registro de plano + cuadro de rotulación ("A-01", "A-02"…)
// en vez de tarjetas de portafolio genéricas. No reutiliza ningún motivo
// de página hermana (nada de medallones/sellos de jyw-cc, muestras de
// pintura de jmj, pase de embarque de travel-agency, etc.).
//
// Patrón de interacción del portafolio (pedido explícito de Paul, "podría
// ser un popup/modal"): las CATEGORÍAS se filtran con pestañas en línea
// (no modal — evita anidar modal sobre modal y es más descubrible); cada
// PROYECTO sí abre un modal con galería + info (detalle secundario, no
// navegación primaria) — ver el razonamiento completo en
// ProyectosGaleria.tsx.
//
// Convención de tenant_content para esta página (documentada porque no
// hay una lista fija de qué significa cada campo):
// - `content.precios.categorias` son las categorías de proyectos (Vivienda
//   y Comercio son obligatorias por pedido de Paul; se agregó
//   "Institucional" como tercera porque es un tipo de encargo real y
//   habitual de un estudio de arquitectura en Ecuador — colegios, centros
//   comunitarios, equipamiento barrial — sin inflar el alcance con una
//   cuarta categoría que Paul no pidió).
// - `cat.items[]` es un proyecto por entrada, codificado en una sola línea
//   como "Nombre · Ubicación · Año · Área · Descripción" (separador " · ",
//   NUNCA coma — el editor de categorías del panel admin,
//   EditorContenido.tsx, une/separa items por coma; una coma dentro de un
//   campo rompería el parseo). Año/Área/Descripción pueden ir vacíos
//   (ej. "Casa X · Cuenca ·  · 280 m² · Descripción…") y el segmento
//   simplemente no se muestra.
// - Fotos de cada proyecto: por convención de nombre de archivo en
//   `content.fotos`, "{categoria-en-slug}-{índice del proyecto en la
//   categoría}-{índice de foto}.jpg" (ej. "vivienda-0-1.jpg",
//   "vivienda-0-2.jpg" para las dos fotos del primer proyecto de
//   Vivienda). Sin fotos reales que calcen, el proyecto se muestra sin
//   fotos en vez de tomar prestada una foto de otro proyecto — mostrar la
//   foto equivocada de un proyecto real sería peor que no mostrar ninguna.
// - `content.precios.nota` es el texto de cierre de la sección de
//   contacto/cotización (mismo patrón que jyw-cc/El Establo: sin precio
//   fijo publicado, dirige a WhatsApp).
//
// IMPORTANTE — por qué los proyectos por defecto NO tienen nombres propios
// ni año (ASUNCIÓN explícita del agente constructor, distinta del resto de
// tenants de este proyecto): Paul no dio ningún proyecto real todavía (ni
// fotos, ni nombres, ni ubicaciones, ni años). A diferencia de rellenar una
// categoría genérica de producto (ej. "Anillos: plata 925…" en jyw-cc, que
// describe un TIPO de producto sin afirmar un hecho puntual), inventar un
// proyecto de arquitectura con nombre propio, ubicación y año concretos
// habría sido fabricar una historia de obra construida que nunca existió —
// exactamente lo que webya.md sección 7 prohíbe ("anclar al mundo real del
// negocio, no inventar"). Por eso los 6 proyectos de muestra de abajo: (a)
// se nombran por TIPO ("Vivienda unifamiliar", no un nombre propio de
// cliente), (b) nunca llevan año, y (c) llevan una etiqueta visible
// "Proyecto de muestra" en cada ficha (ver ProyectosGaleria.tsx) — nadie
// que visite la página puede confundirlos con obra real entregada. En
// cuanto Paul cargue proyectos reales desde el panel admin
// (`content.precios.categorias`), estos defaults y la etiqueta desaparecen
// automáticamente.
//
// Fotos: negocio real, sin fotos propias todavía (ninguna proporcionada) —
// 14 fotos de muestra de Unsplash (licencia de uso comercial libre),
// descargadas a public/tenants/estudio-arquitectura/. Ping de tracking
// obligatorio ya disparado a `links.download_location` de cada una durante
// la construcción. Atribución completa en el footer. NINGUNA de estas
// fotos es de un proyecto real de este estudio — no debería publicarse
// como está hasta reemplazarlas por fotos reales de obra propia.
//
// No usa `ProductVisual`: este negocio no tiene un producto físico
// protagonista que "flote" (una edificación no es una pieza de joyería o
// un frasco de producto) — mismo criterio que Moonvet/Travel Agency de no
// forzar esa capa del motor donde no encaja.

const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-archivo" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" });

function waHref(telefono: string, mensaje: string): string {
  const digitos = telefono.replace(/\D/g, "");
  const conCodigoPais = digitos.length === 10 && digitos.startsWith("0") ? `593${digitos.slice(1)}` : digitos;
  return `https://wa.me/${conCodigoPais}?text=${encodeURIComponent(mensaje)}`;
}

const WHATSAPP_MSG_DEFAULT = "Hola, quisiera más información sobre sus proyectos de arquitectura";

// ---------------------------------------------------------------------
// Convención de proyecto en texto plano (ver nota de arriba). serializar()
// solo se usa para construir los defaults de abajo; parseProyecto() es el
// único camino real de lectura (defaults y contenido real del panel pasan
// por la misma función, para no tener dos formas distintas de interpretar
// el campo).
// ---------------------------------------------------------------------
interface ProyectoData {
  nombre: string;
  ubicacion: string;
  anio: string;
  area: string;
  descripcion: string;
}

function serializarProyecto(p: ProyectoData): string {
  return [p.nombre, p.ubicacion, p.anio, p.area, p.descripcion].join(" · ");
}

function parseProyecto(item: string): ProyectoData {
  const partes = item.split("·").map((s) => s.trim());
  return {
    nombre: partes[0] || "Proyecto",
    ubicacion: partes[1] || "",
    anio: partes[2] || "",
    area: partes[3] || "",
    descripcion: partes.slice(4).join(" · ") || "",
  };
}

function slugCategoria(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Fotos de un proyecto REAL (contenido cargado por el panel admin): busca
// en content.fotos por el prefijo "{categoria}-{índice}-" (ver convención
// documentada arriba). Sin coincidencias, el proyecto queda sin fotos —
// nunca se le presta una foto de otro proyecto o de Unsplash a un proyecto
// que el admin marcó como real.
function fotosProyectoReal(fotos: Foto[], categoriaNombre: string, indice: number): Foto[] {
  const prefijo = `${slugCategoria(categoriaNombre)}-${indice}-`;
  return fotos.filter((f) => f.url.includes(prefijo));
}

// --- Datos de muestra (ver nota "IMPORTANTE" arriba: sin nombres propios
// ni año, marcados como "Proyecto de muestra" en la UI) ---
interface ProyectoMuestra extends ProyectoData {
  fotos: [string, string];
}
interface CategoriaMuestra {
  nombre: string;
  proyectos: ProyectoMuestra[];
}

const CATEGORIAS_MUESTRA: CategoriaMuestra[] = [
  {
    nombre: "Vivienda",
    proyectos: [
      {
        nombre: "Vivienda unifamiliar",
        ubicacion: "Cuenca",
        anio: "",
        area: "320 m²",
        descripcion:
          "Casa de tres niveles con fachada en hormigón visto y madera, y ventanales orientados al valle para aprovechar la luz natural durante todo el día.",
        fotos: ["vivienda-valle-1.jpg", "vivienda-valle-2.jpg"],
      },
      {
        nombre: "Vivienda con patio interior",
        ubicacion: "Cuenca",
        anio: "",
        area: "280 m²",
        descripcion: "Distribución en dos niveles alrededor de un patio central, con una escalera de hormigón como eje de circulación y luz.",
        fotos: ["vivienda-mirador-1.jpg", "vivienda-mirador-2.jpg"],
      },
    ],
  },
  {
    nombre: "Comercio",
    proyectos: [
      {
        nombre: "Local comercial",
        ubicacion: "Cuenca",
        anio: "",
        area: "95 m²",
        descripcion: "Adecuación de un local en planta baja para atención al público, con vitrina y un recorrido de exhibición pensado para el cliente.",
        fotos: ["comercio-local-1.jpg", "comercio-local-2.jpg"],
      },
      {
        nombre: "Oficinas",
        ubicacion: "Cuenca",
        anio: "",
        area: "540 m²",
        descripcion: "Planta libre de oficinas con estructura de hormigón visto y cerramientos de vidrio hacia las áreas comunes.",
        fotos: ["comercio-oficinas-1.jpg", "comercio-oficinas-2.jpg"],
      },
    ],
  },
  {
    nombre: "Institucional",
    proyectos: [
      {
        nombre: "Centro comunitario",
        ubicacion: "Cuenca",
        anio: "",
        area: "610 m²",
        descripcion: "Equipamiento barrial con salón de usos múltiples y fachada de hormigón expuesto.",
        fotos: ["institucional-centro-1.jpg", "institucional-centro-2.jpg"],
      },
      {
        nombre: "Ampliación de centro educativo",
        ubicacion: "Cuenca",
        anio: "",
        area: "430 m²",
        descripcion: "Nuevos espacios de aprendizaje con estructura de madera vista y grandes aberturas hacia el patio.",
        fotos: ["institucional-escuela-1.jpg", "institucional-escuela-2.jpg"],
      },
    ],
  },
];

const CATEGORIAS_DEFAULT: CategoriaProducto[] = CATEGORIAS_MUESTRA.map((c) => ({
  nombre: c.nombre,
  items: c.proyectos.map(serializarProyecto),
}));

function fotoMuestra(archivo: string, alt: string): Foto {
  return { url: `/tenants/estudio-arquitectura/${archivo}`, alt };
}

const PILARES_DEFAULT = [
  {
    titulo: "Diseño a medida, no un catálogo",
    descripcion: "Cada proyecto parte del terreno, el presupuesto y cómo realmente vas a usar el espacio — no de un plano genérico repetido.",
  },
  {
    titulo: "Acompañamiento hasta la obra",
    descripcion: "No solo entregamos planos: te acompañamos en la tramitación de permisos y, si lo necesitas, en la dirección de la obra.",
  },
  {
    titulo: "Comunicación directa por WhatsApp",
    descripcion: "Consultas, avances y cambios se resuelven directamente con el arquitecto a cargo, sin intermediarios.",
  },
];

const PASOS_DEFAULT = [
  "Reunión inicial y levantamiento del terreno o el espacio",
  "Anteproyecto: primeras ideas, distribución y volumetría",
  "Planos definitivos y trámite de permisos municipales",
  "Dirección de obra, si lo necesitas, hasta la entrega",
];

const FAQ_DEFAULT = [
  {
    pregunta: "¿Cuánto tiempo toma el diseño de un proyecto?",
    respuesta: "Depende del tamaño y la complejidad — un anteproyecto de vivienda suele tomar algunas semanas; te damos un tiempo estimado apenas conocemos tu terreno y tus necesidades.",
  },
  {
    pregunta: "¿Ustedes tramitan los permisos de construcción?",
    respuesta: "Sí, podemos encargarnos de la elaboración de planos y la tramitación de permisos ante el municipio como parte del servicio.",
  },
  {
    pregunta: "¿También dirigen la construcción o solo hacen los planos?",
    respuesta: "Ofrecemos ambos: diseño y planos, y también dirección de obra si quieres que supervisemos la construcción hasta la entrega.",
  },
  {
    pregunta: "¿Cómo se cotiza un proyecto?",
    respuesta: "El costo depende del área, la complejidad y el alcance (solo diseño, o diseño + dirección de obra) — escríbenos por WhatsApp con los datos de tu terreno o local y te damos una propuesta.",
  },
];

const NOTA_COTIZACION_DEFAULT =
  "Cada proyecto se cotiza según área, ubicación y alcance — escríbenos por WhatsApp con los datos de tu terreno o local y te damos una propuesta.";

// Atribución obligatoria (webya.md sección 3/7) — fotografía de muestra,
// ilustrativa, con licencia Unsplash de uso comercial libre. Ninguna de
// estas fotos es de un proyecto real de este estudio (ver footer).
const CREDITOS_UNSPLASH = [
  { nombre: "Marko Sun", perfil: "https://unsplash.com/@amgras" },
  { nombre: "Daniel McCullough", perfil: "https://unsplash.com/@d_mccullough" },
  { nombre: "Alef Morais", perfil: "https://unsplash.com/@alef_visuals" },
  { nombre: "Michael Alake", perfil: "https://unsplash.com/@mikeberyl" },
  { nombre: "Salvo Media LLC", perfil: "https://unsplash.com/@salvomedia" },
  { nombre: "Dorsa Masghati", perfil: "https://unsplash.com/@dorsamasghati" },
  { nombre: "Anton Borzenkov", perfil: "https://unsplash.com/@borzenkov" },
  { nombre: "Joel Filipe", perfil: "https://unsplash.com/@joelfilip" },
  { nombre: "Bernd Dittrich", perfil: "https://unsplash.com/@hdbernd" },
  { nombre: "Mitchell Luo", perfil: "https://unsplash.com/@mitchel3uo" },
  { nombre: "Simone Hutsch", perfil: "https://unsplash.com/@heysupersimi" },
  { nombre: "Ken Z", perfil: "https://unsplash.com/@a_flip_project" },
  { nombre: "Stanislav Rabunski", perfil: "https://unsplash.com/@stanislau93" },
  { nombre: "daniel mironov", perfil: "https://unsplash.com/@cheesy_daniel" },
];

// CTA de WhatsApp — ícono + relleno sólido del acento + hover con
// elevación (mismo estándar ya validado en el resto del proyecto).
function WhatsAppCTA({ href, children, size = "md" }: { href: string; children: React.ReactNode; size?: "sm" | "md" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 rounded-full font-semibold shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 ${
        size === "sm" ? "px-4 py-2.5 text-sm" : "px-6 py-3.5 text-sm sm:text-base"
      }`}
      style={{ backgroundColor: "var(--tenant-acento)", color: "var(--tenant-fondo)" }}
    >
      <MessageCircle className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} strokeWidth={2.5} aria-hidden />
      {children}
    </a>
  );
}

export function EstudioArquitectura({ tenant, content }: TenantWithContent) {
  const acento = content.coloresMarca.acento;
  const fondo = content.coloresMarca.fondo;
  const texto = content.coloresMarca.texto;

  const usaCategoriasDefault = content.precios.categorias.length === 0;
  const categoriasFuente = usaCategoriasDefault ? CATEGORIAS_DEFAULT : content.precios.categorias;

  const categoriasResueltas: CategoriaResuelta[] = categoriasFuente.map((cat, ci) => {
    const muestra = usaCategoriasDefault ? CATEGORIAS_MUESTRA[ci] : undefined;
    const proyectos: ProyectoResuelto[] = cat.items.map((item, pi) => {
      const datos = parseProyecto(item);
      let fotos: Foto[];
      if (usaCategoriasDefault && muestra?.proyectos[pi]) {
        const [f1, f2] = muestra.proyectos[pi].fotos;
        fotos = [fotoMuestra(f1, `${datos.nombre} — vista 1`), fotoMuestra(f2, `${datos.nombre} — vista 2`)];
      } else {
        fotos = fotosProyectoReal(content.fotos, cat.nombre, pi);
      }
      return { ...datos, fotos };
    });
    return { nombre: cat.nombre, proyectos };
  });

  const pilares = content.pilares.length > 0 ? content.pilares : PILARES_DEFAULT;
  const pasos = content.pasos.length > 0 ? content.pasos : PASOS_DEFAULT;
  const faq = content.faq.length > 0 ? content.faq : FAQ_DEFAULT;
  const notaCotizacion = content.precios.nota || NOTA_COTIZACION_DEFAULT;

  const mostrarContacto = Boolean(content.textos.direccion) || content.horarios.length > 0;
  const mapaSrc = content.textos.direccion ? `https://www.google.com/maps?q=${encodeURIComponent(content.textos.direccion)}&output=embed` : null;

  const fotoHero = fotoMuestra("hero.jpg", "Fachada de un edificio moderno de hormigón visto, fotografiada al atardecer");
  const fotoProceso = fotoMuestra("proceso.jpg", "Arquitecto revisando planos extendidos sobre una mesa de trabajo");

  return (
    <div
      style={{ ["--tenant-acento" as string]: acento, ["--tenant-fondo" as string]: fondo, backgroundColor: fondo, color: texto }}
      className={`${archivo.variable} ${spaceMono.variable} min-h-screen font-sans`}
    >
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-3 px-6 py-4 backdrop-blur-[3px] sm:px-10" style={{ backgroundColor: `${fondo}d9` }}>
        <div className="leading-[1.05]">
          <p className="text-sm font-bold tracking-tight uppercase sm:text-base">{tenant.nombre}</p>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-50">Diseño arquitectónico</p>
        </div>
        <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_DEFAULT)} size="sm">
          WhatsApp
        </WhatsAppCTA>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-32 pb-16 sm:px-10 sm:pt-40 sm:pb-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <ScrollReveal y={0} duration={0.5}>
              <p className="mb-4 flex items-center gap-2 font-mono text-xs tracking-[0.25em] uppercase opacity-60">
                <span className="h-px w-8" style={{ backgroundColor: acento }} />
                Vivienda · Comercio · Institucional
              </p>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.1} duration={0.7}>
              <h1 className="text-4xl leading-[1.08] font-bold tracking-tight sm:text-5xl lg:text-[3.4rem]">
                {content.textos.tagline || "Arquitectura pensada desde el terreno, no desde el catálogo"}
              </h1>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.25} duration={0.7}>
              <p className="mt-6 max-w-lg text-base opacity-80 sm:text-lg">
                {content.textos.descripcion ||
                  `${tenant.nombre} — diseño de vivienda, locales comerciales y proyectos institucionales, con acompañamiento desde el anteproyecto hasta la obra.`}
              </p>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.4} duration={0.7}>
              <div className="mt-8 flex flex-wrap gap-3">
                <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_DEFAULT)}>Escribir por WhatsApp</WhatsAppCTA>
                <a
                  href="#proyectos"
                  className="inline-flex items-center gap-2 rounded-full border-2 px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 sm:text-base"
                  style={{ borderColor: `${texto}30` }}
                >
                  Ver proyectos
                </a>
              </div>
            </ScrollReveal>
          </div>

          <Parallax speed={0.15} className="relative mx-auto w-full max-w-md">
            <div className="relative overflow-hidden rounded-sm border" style={{ borderColor: `${texto}25` }}>
              <Image src={fotoHero.url} alt={fotoHero.alt} width={900} height={1050} className="aspect-[4/5] w-full object-cover" priority />
              <MarcasEsquina tono="rgba(255,255,255,0.85)" />
            </div>
          </Parallax>
        </div>

        <div className="pointer-events-none relative mt-14 hidden justify-center opacity-40 sm:flex">
          <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden />
        </div>
      </section>

      <CotaDivider label={content.textos.diferenciador ? undefined : "Nuestro enfoque"} tono={`${texto}55`} fondo={fondo} className="py-4" />

      {content.textos.diferenciador && (
        <section className="px-6 py-10 text-center sm:px-10">
          <ScrollReveal className="mx-auto max-w-2xl">
            <p className="text-lg leading-relaxed opacity-85 sm:text-xl">{content.textos.diferenciador}</p>
          </ScrollReveal>
        </section>
      )}

      {/* PROYECTOS — pedido explícito de Paul: organizados por categoría,
          galería + info por proyecto, patrón de interacción decidido en
          ProyectosGaleria.tsx. */}
      <section id="proyectos" className="scroll-mt-24 px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal className="mb-10 text-center">
            <p className="mb-2 font-mono text-xs tracking-[0.25em] uppercase opacity-60">Portafolio</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Proyectos</h2>
          </ScrollReveal>
          <ProyectosGaleria
            categorias={categoriasResueltas}
            acento={acento}
            fondo={fondo}
            texto={texto}
            telefono={content.telefonoWhatsapp}
            esDefault={usaCategoriasDefault}
          />
        </div>
      </section>

      <CotaDivider label="Cómo trabajamos" tono={`${texto}55`} fondo={fondo} className="py-4" />

      {/* CÓMO TRABAJAMOS */}
      <section className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <div aria-hidden className="absolute top-2 bottom-2 left-5 w-px opacity-25" style={{ backgroundColor: acento }} />
            <div className="space-y-10">
              {pasos.map((paso, i) => (
                <ScrollReveal key={paso} delay={i * 0.12}>
                  <div className="relative flex items-start gap-5">
                    <span
                      className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-bold"
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

      {/* POR QUÉ ELEGIRNOS */}
      <section className="px-6 py-16 sm:px-10 sm:py-20" style={{ backgroundColor: `${acento}0c` }}>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <ScrollReveal className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-sm border" style={{ borderColor: `${texto}25` }}>
              <Image src={fotoProceso.url} alt={fotoProceso.alt} width={800} height={650} className="aspect-[6/5] w-full object-cover" />
              <MarcasEsquina tono="rgba(255,255,255,0.85)" />
            </div>
          </ScrollReveal>
          <div className="order-1 lg:order-2">
            <ScrollReveal>
              <p className="mb-2 font-mono text-xs tracking-[0.25em] uppercase opacity-60">Por qué elegirnos</p>
            </ScrollReveal>
            <div className="mt-4 space-y-7">
              {pilares.map((pilar, i) => (
                <ScrollReveal key={pilar.titulo} delay={i * 0.1}>
                  <div className="border-l-2 pl-5" style={{ borderColor: acento }}>
                    <h3 className="text-xl font-semibold">{pilar.titulo}</h3>
                    <p className="mt-1.5 text-sm opacity-75 sm:text-base">{pilar.descripcion}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CIFRAS — a diferencia de "cómo trabajamos"/FAQ (contenido genérico,
          seguro de dar por defecto), los años de experiencia o el número de
          proyectos son datos puntuales de ESTE estudio: no se inventa un
          valor por defecto acá (mismo principio que evitó nombres/años
          falsos en el portafolio de arriba). La sección se omite limpio si
          Paul no cargó cifras reales desde el panel. */}
      {content.cifras.length > 0 && (
        <section className="px-6 py-14 sm:px-10 sm:py-16">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {content.cifras.map((c) => (
              <ScrollReveal key={c.etiqueta} className="text-center">
                <p className="text-4xl font-bold sm:text-5xl" style={{ color: acento }}>
                  {c.numero}
                  {c.sufijo}
                </p>
                <p className="mt-1 text-sm opacity-70">{c.etiqueta}</p>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="px-6 py-16 sm:px-10 sm:py-20" style={{ backgroundColor: `${acento}0c` }}>
        <div className="mx-auto max-w-2xl">
          <ScrollReveal>
            <p className="mb-2 font-mono text-xs tracking-[0.25em] uppercase opacity-60">Antes de escribirnos</p>
            <h2 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Preguntas frecuentes</h2>
          </ScrollReveal>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <ScrollReveal key={item.pregunta} delay={i * 0.06}>
                <details className="rounded-sm border p-4" style={{ borderColor: `${texto}25` }}>
                  <summary className="cursor-pointer font-medium">{item.pregunta}</summary>
                  <p className="mt-2 text-sm opacity-70">{item.respuesta}</p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO — se omite por completo si el tenant no cargó ni
          dirección ni horario (nada real que mostrar todavía), mismo
          criterio que el resto del proyecto. */}
      {mostrarContacto && (
        <section className="px-6 py-16 sm:px-10 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <ScrollReveal>
              <p className="mb-2 font-mono text-xs tracking-[0.25em] uppercase opacity-60">Visítanos</p>
              <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">Conversemos de tu proyecto</h2>

              {content.textos.direccion && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0" style={{ color: acento }} strokeWidth={1.8} aria-hidden />
                  <p className="opacity-80">{content.textos.direccion}</p>
                </div>
              )}
              {content.horarios.length > 0 && (
                <div className="mt-4 flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0" style={{ color: acento }} strokeWidth={1.8} aria-hidden />
                  <ul className="space-y-0.5 text-sm opacity-75">
                    {content.horarios.map((h) => (
                      <li key={h.dia} className="flex gap-2">
                        <span className="opacity-70">{h.dia}:</span>
                        <span>{h.horas}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="mt-5 max-w-md text-sm opacity-70">{notaCotizacion}</p>

              <div className="mt-8">
                <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_DEFAULT)}>Escribir por WhatsApp</WhatsAppCTA>
              </div>
            </ScrollReveal>

            {mapaSrc && (
              <ScrollReveal scale={0.96}>
                <div className="overflow-hidden rounded-sm border" style={{ borderColor: `${texto}25` }}>
                  <iframe src={mapaSrc} className="h-80 w-full grayscale" loading="lazy" title={`Mapa de ${tenant.nombre}`} />
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t px-6 py-10 text-xs opacity-70 sm:px-10" style={{ borderColor: `${texto}20` }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>
            {tenant.nombre}
            {content.textos.direccion ? ` — ${content.textos.direccion}` : ""}
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
          {tenant.nombre} todavía no tiene fotos propias de proyectos cargadas — las fotos de esta página son de muestra, con licencia Unsplash (uso
          comercial gratuito), ilustrativas de arquitectura en general (ninguna es de un proyecto real de este estudio), por{" "}
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
