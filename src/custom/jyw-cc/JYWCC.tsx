import { Cormorant_Garamond, Jost } from "next/font/google";
import Image from "next/image";
import { CalendarHeart, ChevronDown, Clock, Droplets, Gift, MapPin, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import type { CategoriaProducto, Foto, TenantWithContent } from "@/lib/types";
import { ScrollReveal } from "@/engine/ScrollReveal";
import { Parallax } from "@/engine/Parallax";
import { ProductVisual } from "@/engine/ProductVisual";
import { ChainDivider, SelloPress } from "@/custom/jyw-cc/effects";

// JYW CC — sexta página de código a medida bajo el modelo de webya.md
// sección 5 (reset del catálogo, 2026-08-12). Cliente real de Paul: "JYW
// CC" (nombre real del negocio, tal cual lo dio Paul — no se expande ni se
// reinterpreta como sigla de otra cosa), joyería. WhatsApp 0939671012.
//
// A diferencia de los últimos tenants (Moonvet, JMJ, Travel Agency), Paul
// NO dio ningún detalle de producto más allá del nombre y el rubro: sin
// tipo de joyería (fina/bisutería), sin materiales, sin precios, sin
// fotos. Paso 4 del proceso del agente constructor — criterio de nicho
// para ESTE negocio, con las ASUNCIONES marcadas explícitamente (todas
// editables desde el panel admin sin tocar código):
//
// - ¿Qué objetos/materiales/texturas pertenecen genuinamente a este
//   negocio? Sin una foto o descripción real que lo confirme, se asume el
//   segmento más común de joyería vendida por WhatsApp en Ecuador: piezas
//   de uso diario en plata 925, acero quirúrgico hipoalergénico y oro
//   laminado — no alta joyería con piedras preciosas certificadas. El
//   objeto genuino de ESE mundo (no de la joyería fina) es el sello de
//   orfebre/ley que certifica el material (925, 750, etc.) — un troquel
//   real que cualquier joyero usa para garantizar que lo que vende es lo
//   que dice ser. Se convirtió en la firma visual de esta página (ver
//   abajo) precisamente porque "qué material es realmente esta pieza" es
//   la pregunta más razonable que un comprador se hace ante un negocio de
//   joyería que todavía no conoce.
// - ¿Qué vocabulario usaría el dueño? "Pieza", "colección", "material",
//   "medida/talla", "acero quirúrgico", "plata 925", "chapado/laminado en
//   oro" — no "experiencias de lujo atemporal" ni relleno corporativo de
//   casa de alta joyería (ese registro no calza con un negocio que atiende
//   por WhatsApp y del que no hay una sola foto real todavía).
// - ¿Qué necesita ver/saber un cliente antes de escribir por WhatsApp? De
//   qué material real es cada pieza (de ahí el sello por categoría), qué
//   tan bien resiste el uso diario (agua, sudor, perfume — de ahí la
//   sección de cuidado), y para qué ocasión le sirve (regalo, uso diario,
//   aniversario) — no un catálogo de precios fijos que Paul nunca dio.
//
// Firma visual (webya.md sección 7, "un elemento firma único por
// landing"): "Sello de Ley" — un medallón tipo troquel de orfebre (código
// de material embebido: 925 / A.Q. / O.L.) que se "presiona" sobre la
// pantalla al entrar en scroll (SelloPress, src/custom/jyw-cc/effects.tsx),
// más un divisor de cadena que se arma eslabón por eslabón (ChainDivider,
// mismo archivo) entre secciones — "cadenas" es una categoría real del
// catálogo, no un adorno importado. Deliberadamente NO reutiliza la firma
// de trazojoyas (grid Swiss minimalista, sin ningún adorno ni motivo — ver
// src/custom/trazojoyas/TrazoJoyas.tsx): esta página sí tiene un motivo
// ornamental propio, con textura y peso, porque el diferenciador elegido
// acá es justamente "material real, certificado", no "minimalismo". Tampoco
// reutiliza el sello de tinta de Travel Agency (StampReveal, caída con
// rotación exagerada tipo aduana) ni las muestras de pintura de JMJ — ver
// el comentario de cada efecto en effects.tsx para el detalle de en qué se
// diferencia el movimiento.
//
// Convención de tenant_content para esta página (documentada porque no hay
// una lista fija de qué significa cada campo): `precios.categorias` son
// las colecciones/categorías de producto (Anillos, Aretes, Cadenas,
// Pulseras por defecto) — `cat.items` son detalles de material/variedad de
// esa categoría, NO precios individuales (Paul no dio precios reales).
// `precios.nota` es la única mención de precio en toda la página, y
// dirige a WhatsApp para cotización — mismo patrón ya usado en El Establo
// (precio variable, sección 10 de webya.md) y en Moonvet, adaptado acá
// porque no hay ningún precio confirmado que mostrar. La sección "Cuidado
// de tus piezas" es contenido fijo en código (no vive en tenant_content:
// no hay un campo dedicado para tips de cuidado) — información genérica
// pero real sobre cómo cuidar plata/acero/oro laminado, no un dato
// inventado sobre ESTE negocio en particular.
//
// ProductVisual (webya.md sección 3, "joyería es el ejemplo canónico" para
// esta capa del motor): se usa en el hero, condicionado a
// `content.fotoDestacada` — igual que trazojoyas. Hoy ese campo está en
// null (Paul no ha cargado nada desde el panel admin todavía), así que el
// hero cae a un tratamiento de foto enmarcada normal (Parallax + marco)
// con la foto de muestra de Unsplash; en cuanto Paul suba una foto de
// producto real con fondo limpio/aislado como foto_destacada, el hero
// pasa a mostrar ProductVisual automáticamente, sin tocar código. NO se
// alimenta ProductVisual con la foto de muestra de Unsplash a propósito:
// esa foto (ver abajo) es una toma editorial con fondo oscuro/follaje, no
// un producto aislado — forzarla dentro del "escenario" de ProductVisual
// (pensado para fondo limpio, ver src/engine/ProductVisual.tsx) se vería
// mal recortada. IMPORTANTE para quien publique este tenant: si se quiere
// que el hero muestre el efecto ProductVisual, hace falta cargar una foto
// destacada REAL de una pieza con fondo aislado desde el panel admin — no
// hay bloqueo automático de publicación por esto (se quitó, ver
// src/app/admin/actions.ts), así que es responsabilidad de revisión manual.
//
// Fotos: negocio real, sin fotos propias todavía (confirmado por Paul) —
// 7 fotos de muestra de Unsplash (licencia de uso comercial libre),
// elegidas priorizando primeros planos de piezas reales (anillos, aretes,
// cadenas, pulseras) y del oficio (un joyero trabajando) por sobre una
// modelo posando genérica de stock — mismo criterio ya aplicado en el
// resto del proyecto. Descargadas a public/tenants/jyw-cc/. Ping de
// tracking obligatorio ya disparado a `links.download_location` de cada
// una durante la construcción. Atribución completa en el footer. NINGUNA
// de estas fotos es "la foto real" de una pieza de JYW CC.

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--font-cormorant" });
const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-jost" });

// "0939671012" -> "593939671012" (10 dígitos locales de Ecuador -> antepone
// +593, quitando el 0 inicial) — mismo criterio ya usado en el resto del
// proyecto (ver src/custom/travel-agency/TravelAgency.tsx).
function waHref(telefono: string, mensaje: string): string {
  const digitos = telefono.replace(/\D/g, "");
  const conCodigoPais = digitos.length === 10 && digitos.startsWith("0") ? `593${digitos.slice(1)}` : digitos;
  return `https://wa.me/${conCodigoPais}?text=${encodeURIComponent(mensaje)}`;
}

const WHATSAPP_MSG_DEFAULT = "Hola, quisiera más información sobre sus piezas";
function waMensajeColeccion(nombre: string): string {
  return `Hola, quisiera más información sobre la colección de ${nombre}`;
}

// Busca la foto real ya cargada en content.fotos por nombre de archivo (el
// alt queda editable desde el panel admin); si el tenant todavía no cargó
// ninguna, cae a las 7 fotos de muestra locales (mismo mecanismo que
// Moonvet/JMJ/Travel Agency).
function foto(fotos: Foto[], archivo: string, altPorDefecto: string): Foto {
  return fotos.find((f) => f.url.endsWith(archivo)) ?? { url: `/tenants/jyw-cc/${archivo}`, alt: altPorDefecto };
}

// Los 3 sellos de material — ASUNCIÓN del agente constructor (ver
// comentario de criterio arriba): son contenido fijo, no tenant_content
// (no hay un campo dedicado a "materiales que trabaja el negocio"; forzar
// esto dentro de precios.categorias habría mezclado dos conceptos
// distintos — colecciones de producto vs. materiales disponibles). Si
// Paul confirma otros materiales más adelante, este array se edita acá.
interface SelloMaterialInfo {
  codigo: string;
  nombre: string;
  detalle: string;
}
const SELLOS_MATERIAL: SelloMaterialInfo[] = [
  { codigo: "925", nombre: "Plata 925", detalle: "Plata esterlina — el estándar real para piezas de uso diario, no una aleación sin nombre." },
  { codigo: "A.Q.", nombre: "Acero quirúrgico", detalle: "Hipoalergénico, resiste agua y sudor sin perder color ni oxidarse." },
  { codigo: "O.L.", nombre: "Oro laminado", detalle: "Baño de oro sobre base resistente — el brillo del oro, a otro precio." },
];

const OCASIONES = [
  { icono: Gift, nombre: "Regalo", detalle: "Cumpleaños, San Valentín, Día de la Madre — cuéntanos para quién y te ayudamos a elegir." },
  { icono: Sparkles, nombre: "Uso diario", detalle: "Piezas livianas y resistentes, pensadas para llevar todos los días, no solo para ocasiones especiales." },
  { icono: CalendarHeart, nombre: "Aniversario / fecha especial", detalle: "Para marcar un momento que quieres recordar cada vez que te la pongas." },
];

// Categorías por defecto — ASUNCIÓN del agente constructor: Paul no cargó
// ningún producto todavía. `items` describe material/variedad, NO precios
// (no hay precios reales que mostrar — ver precios.nota más abajo).
// Editable desde el panel admin (precios.categorias) en cualquier momento.
const CATEGORIAS_DEFAULT: CategoriaProducto[] = [
  { nombre: "Anillos", items: ["Plata 925 y acero quirúrgico", "Con y sin circonias", "Ajustables o por talla"] },
  { nombre: "Aretes", items: ["Argollas, topos y colgantes", "Plata 925 y acero hipoalergénico", "Pensados también para piel sensible"] },
  { nombre: "Cadenas", items: ["Plata 925, acero y oro laminado", "Distintos gruesos y largos", "Solas o para combinar con dijes"] },
  { nombre: "Pulseras", items: ["Cadena, tenis y brazalete rígido", "Plata 925 y acero quirúrgico", "Ajuste cómodo para todos los días"] },
];

const NOTA_PRECIO_DEFAULT = "Los precios varían según pieza, material y personalización — escríbenos por WhatsApp y te cotizamos al instante.";

const PILARES_DEFAULT = [
  { titulo: "Material real, sin adivinar", descripcion: "Cada pieza indica su material exacto — plata 925, acero quirúrgico u oro laminado — nunca 'aleación' sin más detalle." },
  { titulo: "Pensada para el uso diario", descripcion: "Piezas hipoalergénicas y resistentes, para llevar todos los días — no solo para guardar en una caja." },
  { titulo: "Atención directa por WhatsApp", descripcion: "Sin catálogo genérico ni bot: preguntas de talla, material o disponibilidad las resuelve una persona real." },
];

const PASOS_DEFAULT = [
  "Escríbenos por WhatsApp contándonos qué pieza buscas — o mándanos una foto de inspiración",
  "Te confirmamos material, medida y disponibilidad al instante",
  "Coordinamos entrega o envío — confirmas tu pedido cuando estés lista/o",
];

const FAQ_DEFAULT = [
  { pregunta: "¿De qué material son realmente las piezas?", respuesta: "Trabajamos principalmente con plata 925, acero quirúrgico hipoalergénico y oro laminado — el material exacto de cada pieza está indicado en su ficha, sin letra pequeña." },
  { pregunta: "¿Me puedo duchar o hacer ejercicio con ellas puestas?", respuesta: "El acero quirúrgico resiste bien el agua y el uso diario. La plata y el oro laminado es mejor cuidarlos del agua, el perfume y el cloro para que no pierdan el brillo (ver sección de cuidado más abajo)." },
  { pregunta: "¿Hacen envíos?", respuesta: "Sí, coordinamos envío a nivel nacional — el costo y tiempo dependen de tu ciudad, te confirmamos por WhatsApp." },
  { pregunta: "¿Puedo pedir una pieza para regalo?", respuesta: "Claro — cuéntanos la ocasión y tu presupuesto por WhatsApp y te ayudamos a elegir la pieza correcta." },
];

// Tips de cuidado — contenido fijo (no tenant_content, ver nota arriba),
// información genuina sobre cómo cuidar plata/acero/oro laminado, no un
// dato inventado sobre este negocio puntual.
const CUIDADO_TIPS = [
  "Evita el contacto con perfume, cremas, alcohol y cloro",
  "Guarda cada pieza por separado, para que no se rayen entre sí",
  "Límpiala con un paño suave y seco — sin productos abrasivos",
  "Quítatela para dormir, hacer ejercicio intenso o nadar",
];

// Atribución obligatoria (webya.md sección 3/7) — fotografía de muestra,
// ilustrativa, con licencia Unsplash de uso comercial libre. Ninguna es
// una foto real de una pieza de JYW CC (ver footer).
const CREDITOS_UNSPLASH = [
  { nombre: "Joel De Vera", perfil: "https://unsplash.com/@joel_devera" },
  { nombre: "Alexis Antoine", perfil: "https://unsplash.com/@alexisantoine" },
  { nombre: "PRAHANT STUDIO", perfil: "https://unsplash.com/@prahantstudio" },
  { nombre: "Sama Hosseini", perfil: "https://unsplash.com/@samahosseini" },
  { nombre: "Amy Vann", perfil: "https://unsplash.com/@girl_behindthelens" },
  { nombre: "Jess Bailey", perfil: "https://unsplash.com/@jessbaileydesigns" },
];

// CTA de WhatsApp — ícono + relleno sólido del color de acento + hover con
// elevación (mismo estándar ya validado en el resto del proyecto).
// `var(--tenant-acento)` porque algunos usos viven fuera del closure de
// JYWCC (mismo motivo documentado en DeluxTravel/JMJ/Travel Agency).
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
      style={variant === "solido" ? { backgroundColor: "var(--tenant-acento)", color: "#1a1610" } : { borderColor: "var(--tenant-acento)", color: "var(--tenant-acento)" }}
    >
      <MessageCircle className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} strokeWidth={2.5} aria-hidden />
      {children}
    </a>
  );
}

// Medallón "sello de ley" — la unidad visual base de la firma de esta
// página. `tono` es el color de fondo del medallón (distinto por material
// en la franja de confianza, siempre el acento de marca en las tarjetas de
// colección); `texto` es el color del código grabado.
function SelloMedallon({ codigo, tono, texto, tamano = "md" }: { codigo: string; tono: string; texto: string; tamano?: "sm" | "md" | "lg" }) {
  const dims = tamano === "lg" ? "h-20 w-20 text-base" : tamano === "sm" ? "h-11 w-11 text-[10px]" : "h-16 w-16 text-sm";
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center rounded-full border-2 border-dashed font-semibold tracking-wide ${dims}`}
      style={{ backgroundColor: `${tono}`, color: texto, borderColor: `${texto}55` }}
    >
      <span className="absolute inset-[3px] rounded-full border" style={{ borderColor: `${texto}30` }} />
      {codigo}
    </span>
  );
}

function SelloMaterialCard({ sello, tono, delay }: { sello: SelloMaterialInfo; tono: string; delay: number }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <SelloPress delay={delay}>
        <SelloMedallon codigo={sello.codigo} tono={tono} texto="#1c1a15" tamano="lg" />
      </SelloPress>
      <h3 className="text-lg font-semibold">{sello.nombre}</h3>
      <p className="max-w-[16rem] text-sm opacity-70">{sello.detalle}</p>
    </div>
  );
}

interface CategoriaCardProps {
  cat: CategoriaProducto;
  numero: string;
  fotoCat: Foto | null;
  acento: string;
  fondo: string;
  telefono: string;
  delay: number;
}

function CategoriaCard({ cat, numero, fotoCat, acento, fondo, telefono, delay }: CategoriaCardProps) {
  return (
    <ScrollReveal delay={delay} y={22} className="h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm" style={{ borderColor: `${acento}35`, backgroundColor: fondo }}>
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          {fotoCat ? (
            <Image
              src={fotoCat.url}
              alt={fotoCat.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div aria-hidden className="absolute inset-0" style={{ backgroundColor: `${acento}18` }} />
          )}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute -bottom-6 left-4">
            <SelloPress delay={delay + 0.1}>
              <SelloMedallon codigo={`Nº${numero}`} tono={acento} texto="#1a1610" />
            </SelloPress>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5 pt-8">
          <h3 className={`${cormorant.className} text-2xl font-semibold`}>{cat.nombre}</h3>
          {cat.items.length > 0 && (
            <ul className="space-y-1.5 text-sm opacity-75">
              {cat.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: acento }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-auto pt-2">
            <a
              href={waHref(telefono, waMensajeColeccion(cat.nombre))}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
              style={{ color: acento }}
            >
              Preguntar por esta colección →
            </a>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export function JYWCC({ tenant, content }: TenantWithContent) {
  const acento = content.coloresMarca.acento;
  const fondo = content.coloresMarca.fondo;
  const texto = content.coloresMarca.texto;

  const usaCategoriasDefault = content.precios.categorias.length === 0;
  const categorias = usaCategoriasDefault ? CATEGORIAS_DEFAULT : content.precios.categorias;
  const pilares = content.pilares.length > 0 ? content.pilares : PILARES_DEFAULT;
  const pasos = content.pasos.length > 0 ? content.pasos : PASOS_DEFAULT;
  const faq = content.faq.length > 0 ? content.faq : FAQ_DEFAULT;
  const notaPrecio = content.precios.nota || NOTA_PRECIO_DEFAULT;

  const mostrarContacto = Boolean(content.textos.direccion) || content.horarios.length > 0;
  const mapaSrc = content.textos.direccion ? `https://www.google.com/maps?q=${encodeURIComponent(content.textos.direccion)}&output=embed` : null;

  const fotoHero = foto(content.fotos, "hero.jpg", "Anillo solitario de plata iluminado suavemente contra un fondo oscuro");
  const fotoAnillos = foto(content.fotos, "anillos.jpg", "Dos anillos dorados entrelazados sobre tela de yute");
  const fotoAretes = foto(content.fotos, "aretes.jpg", "Aretes de plata con circonias puestos en una oreja");
  const fotoCadenas = foto(content.fotos, "cadenas.jpg", "Cadena de eslabones bicolor sobre tela negra");
  const fotoPulseras = foto(content.fotos, "pulseras.jpg", "Mano con pulseras de plata y piedras alrededor de la muñeca");
  const fotoTaller = foto(content.fotos, "taller.jpg", "Manos de una joyera trabajando una pieza en el taller");
  const fotoRegalo = foto(content.fotos, "regalo.jpg", "Caja de regalo envuelta con cinta rosada");

  // Solo se asigna foto a categorías por defecto (mismo criterio que
  // JMJ/Travel Agency): una categoría escrita a mano por el admin no tiene
  // forma confiable de saber qué foto le corresponde.
  const FOTOS_CATEGORIAS_DEFAULT: Foto[] = [fotoAnillos, fotoAretes, fotoCadenas, fotoPulseras];

  const tonosMateriales = ["#C7CDD3", "#9AA5AD", acento];

  return (
    <div
      style={{ ["--tenant-acento" as string]: acento, backgroundColor: fondo, color: texto }}
      className={`${cormorant.variable} ${jost.variable} min-h-screen font-sans`}
    >
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-3 px-6 py-4 backdrop-blur-[3px] sm:px-10" style={{ backgroundColor: `${fondo}d9` }}>
        <span className={`${cormorant.className} text-xl font-semibold tracking-tight italic sm:text-2xl`}>{tenant.nombre}</span>
        <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_DEFAULT)} size="sm">
          WhatsApp
        </WhatsAppCTA>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-28 pb-16 sm:px-10 sm:pt-36 sm:pb-24">
        <div aria-hidden className="pointer-events-none absolute top-0 right-0 h-[30rem] w-[30rem] rounded-full opacity-[0.16] blur-[110px]" style={{ backgroundColor: acento }} />

        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <ScrollReveal y={0} duration={0.5}>
              <p className="mb-4 flex items-center gap-2 text-xs font-medium tracking-[0.3em] uppercase opacity-70">
                <span className="h-px w-8" style={{ backgroundColor: acento }} />
                Joyería
              </p>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.1} duration={0.7}>
              <h1 className={`${cormorant.className} text-5xl leading-[1.05] font-semibold italic sm:text-6xl lg:text-[3.75rem]`}>
                {content.textos.tagline || "Joyas para tu día a día, con el material que prometemos"}
              </h1>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.25} duration={0.7}>
              <p className="mt-6 max-w-lg text-base opacity-80 sm:text-lg">
                {content.textos.descripcion ||
                  `${tenant.nombre} — anillos, aretes, cadenas y pulseras en plata 925, acero quirúrgico y oro laminado. Cada pieza indica su material real, sin sorpresas.`}
              </p>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.4} duration={0.7}>
              <div className="mt-8 flex flex-wrap gap-3">
                <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_DEFAULT)}>Escribir por WhatsApp</WhatsAppCTA>
                <a
                  href="#colecciones"
                  className="inline-flex items-center gap-2 rounded-full border-2 px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 sm:text-base"
                  style={{ borderColor: `${texto}30` }}
                >
                  Ver colecciones
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* Hero visual — ProductVisual si ya hay foto_destacada real
              cargada (ver nota arriba); si no, foto de muestra enmarcada
              con Parallax, mismo tratamiento que Moonvet/JMJ. */}
          {content.fotoDestacada ? (
            <ProductVisual src={content.fotoDestacada.url} alt={content.fotoDestacada.alt} />
          ) : (
            <Parallax speed={0.15} className="relative mx-auto w-full max-w-md">
              <div aria-hidden className="pointer-events-none absolute -inset-6 rounded-[2rem] opacity-25 blur-2xl" style={{ backgroundColor: acento }} />
              <div className="relative overflow-hidden rounded-[1.75rem] border" style={{ borderColor: `${acento}40` }}>
                <Image src={fotoHero.url} alt={fotoHero.alt} width={800} height={950} className="aspect-[4/5] w-full object-cover" priority />
              </div>
            </Parallax>
          )}
        </div>

        <div className="pointer-events-none relative mt-14 hidden justify-center opacity-40 sm:flex">
          <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden />
        </div>
      </section>

      {/* SELLO DE LEY — franja de confianza de materiales, la firma visual
          de esta página presentada por primera vez. */}
      <section className="px-6 py-14 sm:px-10 sm:py-16" style={{ backgroundColor: `${acento}0c` }}>
        <div className="mx-auto max-w-5xl">
          <ScrollReveal className="text-center">
            <p className="mb-2 flex items-center justify-center gap-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Nuestro sello de ley
            </p>
            <h2 className={`${cormorant.className} mb-10 text-3xl font-semibold italic sm:text-4xl`}>El material que dice la ficha es el material real</h2>
          </ScrollReveal>
          <div className="grid gap-10 sm:grid-cols-3">
            {SELLOS_MATERIAL.map((sello, i) => (
              <SelloMaterialCard key={sello.codigo} sello={sello} tono={tonosMateriales[i % tonosMateriales.length]} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      <ChainDivider tono={`${texto}40`} className="h-6" />

      {/* COLECCIONES */}
      <section id="colecciones" className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Catálogo</p>
            <h2 className={`${cormorant.className} mb-2 text-3xl font-semibold italic sm:text-4xl`}>Nuestras colecciones</h2>
            <p className="mb-10 max-w-xl text-sm opacity-70 sm:text-base">Cada pieza indica su material — escríbenos por WhatsApp para ver disponibilidad y medidas.</p>
          </ScrollReveal>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {categorias.map((cat, i) => (
              <CategoriaCard
                key={cat.nombre}
                cat={cat}
                numero={String(i + 1).padStart(2, "0")}
                fotoCat={usaCategoriasDefault ? FOTOS_CATEGORIAS_DEFAULT[i % FOTOS_CATEGORIAS_DEFAULT.length] : null}
                acento={acento}
                fondo={fondo}
                telefono={content.telefonoWhatsapp}
                delay={(i % 4) * 0.08}
              />
            ))}
          </div>
          <p className="mt-8 text-center text-xs opacity-60">{notaPrecio}</p>
        </div>
      </section>

      <ChainDivider tono={`${texto}40`} className="h-6" />

      {/* OCASIONES */}
      <section className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <ScrollReveal>
            <div className="overflow-hidden rounded-2xl border" style={{ borderColor: `${acento}30` }}>
              <Image src={fotoRegalo.url} alt={fotoRegalo.alt} width={800} height={650} className="aspect-[6/5] w-full object-cover" />
            </div>
          </ScrollReveal>
          <div>
            <ScrollReveal>
              <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Para cada ocasión</p>
              <h2 className={`${cormorant.className} mb-8 text-3xl font-semibold italic sm:text-4xl`}>¿Para quién es la pieza?</h2>
            </ScrollReveal>
            <div className="space-y-6">
              {OCASIONES.map((oc, i) => {
                const Icono = oc.icono;
                return (
                  <ScrollReveal key={oc.nombre} delay={i * 0.1}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${acento}1f` }}>
                        <Icono className="h-5 w-5" style={{ color: acento }} strokeWidth={1.8} aria-hidden />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{oc.nombre}</h3>
                        <p className="mt-1 text-sm opacity-75">{oc.detalle}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="px-6 py-16 sm:px-10 sm:py-20" style={{ backgroundColor: `${acento}0c` }}>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <ScrollReveal className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-2xl border" style={{ borderColor: `${acento}30` }}>
              <Image src={fotoTaller.url} alt={fotoTaller.alt} width={800} height={650} className="aspect-[6/5] w-full object-cover" />
            </div>
          </ScrollReveal>
          <div className="order-1 lg:order-2">
            <ScrollReveal>
              <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Por qué elegirnos</p>
            </ScrollReveal>
            <div className="mt-4 space-y-7">
              {pilares.map((pilar, i) => (
                <ScrollReveal key={pilar.titulo} delay={i * 0.1}>
                  <div className="border-l-2 pl-5" style={{ borderColor: acento }}>
                    <h3 className={`${cormorant.className} text-xl font-semibold`}>{pilar.titulo}</h3>
                    <p className="mt-1.5 text-sm opacity-75 sm:text-base">{pilar.descripcion}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO PEDIR */}
      <section className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <p className="mb-2 text-center text-xs font-medium tracking-[0.3em] uppercase opacity-60">Cómo pedir</p>
            <h2 className={`${cormorant.className} mb-12 text-center text-3xl font-semibold italic sm:text-4xl`}>De WhatsApp a tu pieza</h2>
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

      <ChainDivider tono={`${texto}40`} className="h-6" />

      {/* CUIDADO DE TUS PIEZAS */}
      <section className="px-6 py-16 sm:px-10 sm:py-20" style={{ backgroundColor: `${acento}0c` }}>
        <div className="mx-auto max-w-3xl">
          <ScrollReveal className="text-center">
            <p className="mb-2 flex items-center justify-center gap-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">
              <Droplets className="h-3.5 w-3.5" aria-hidden />
              Cuidado de tus piezas
            </p>
            <h2 className={`${cormorant.className} mb-10 text-3xl font-semibold italic sm:text-4xl`}>Para que el brillo dure</h2>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {CUIDADO_TIPS.map((tip, i) => (
              <ScrollReveal key={tip} delay={i * 0.08}>
                <div className="flex items-start gap-3 rounded-xl border p-4" style={{ borderColor: `${acento}30` }}>
                  <SelloMedallon codigo={String(i + 1)} tono={acento} texto="#1a1610" tamano="sm" />
                  <p className="pt-1.5 text-sm opacity-85">{tip}</p>
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
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Antes de escribirnos</p>
            <h2 className={`${cormorant.className} mb-8 text-3xl font-semibold italic sm:text-4xl`}>Preguntas frecuentes</h2>
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

      {/* CONTACTO / UBICACIÓN — se omite por completo si el tenant no
          cargó ni dirección ni horario (nada real que mostrar todavía),
          mismo criterio que el resto del proyecto de omitir antes que
          mostrar un dato vacío o inventado. */}
      {mostrarContacto && (
        <section className="px-6 py-16 sm:px-10 sm:py-20" style={{ backgroundColor: `${acento}0c` }}>
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <ScrollReveal>
              <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Visítanos</p>
              <h2 className={`${cormorant.className} mb-6 text-3xl font-semibold italic sm:text-4xl`}>Encuéntranos</h2>

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

              <div className="mt-8">
                <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_DEFAULT)}>Escribir por WhatsApp</WhatsAppCTA>
              </div>
            </ScrollReveal>

            {mapaSrc && (
              <ScrollReveal scale={0.96}>
                <div className="overflow-hidden rounded-2xl border" style={{ borderColor: `${acento}30` }}>
                  <iframe src={mapaSrc} className="h-80 w-full" loading="lazy" title={`Mapa de ${tenant.nombre}`} />
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t px-6 py-10 text-xs opacity-70 sm:px-10" style={{ borderColor: `${acento}25` }}>
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
          {tenant.nombre} todavía no tiene fotos propias cargadas — las fotos de esta página son de muestra, con licencia Unsplash (uso comercial
          gratuito), ilustrativas de joyería en general (no son piezas reales de este negocio), por{" "}
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
