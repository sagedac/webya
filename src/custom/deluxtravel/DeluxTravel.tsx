import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type { Foto, TenantWithContent } from "@/lib/types";
import { ScrollReveal } from "@/engine/ScrollReveal";
import { Parallax } from "@/engine/Parallax";
import { KenBurnsBg, PannerBg, ClipRevealBg, PostcardFloat, WordReveal, CountUp, TestimonialCycle } from "@/custom/deluxtravel/effects";

// DeluxTravel — segunda página de código a medida bajo el modelo de
// webya.md sección 5 (reset del catálogo 2026-08-12). Tenant real,
// publicado antes del reset, revivido acá como componente propio — no es
// un reskin de Trazo Joyas, ni de ninguna plantilla vieja.
//
// Paso 4 del proceso del agente constructor — criterio de nicho para ESTE
// negocio (agencia de viajes de barrio en Cuenca, no una OTA genérica):
//
// - ¿Qué objetos/materiales/texturas pertenecen genuinamente a este
//   negocio? Pasaporte y pase de abordar, maleta a medio empacar, la pista
//   del aeropuerto Mariscal Lamar al atardecer, el mostrador donde un
//   asesor saluda a un cliente de Cuenca — no un "banner de ofertas" de
//   agencia genérica. Esas 4 fotos reales ya existen y son el ancla del
//   sitio (Paso 2, fotografía real obligatoria). Lo que NO tienen es
//   playa/mar propio (el negocio vende destinos, no tiene fotos propias
//   de Río, Buenos Aires, Panamá o San Andrés) — de ahí la fotografía de
//   destino vía Unsplash, con atribución, tratada como ilustración
//   editorial del lugar (como el catálogo impreso de cualquier agencia),
//   nunca presentada como "foto de un viaje real de un cliente".
// - ¿Qué vocabulario usaría el dueño? "Paquete", "salida directa desde
//   Cuenca", "todo incluido", "abono", "asesor" — no "experiencias
//   inmersivas de bienestar global" ni relleno corporativo de agencia de
//   turismo internacional. Los textos ya cargados en tenant_content (ver
//   GET de referencia) usan exactamente ese registro; este componente los
//   consume tal cual, sin reescribirlos.
// - ¿Qué necesita ver/saber un cliente de Cuenca antes de escribir por
//   WhatsApp? Que el vuelo sale DIRECTO desde su ciudad (no tiene que
//   volar primero a Guayaquil/Quito), el precio "desde" por destino y qué
//   incluye, que hay un humano real atendiendo (foto del asesor, no un
//   bot), y las dudas típicas de primer viaje internacional (visa,
//   cuotas, cancelación) — de ahí que el FAQ real ya cargado se mantenga
//   completo y visible, no recortado por estética.
//
// Dirección visual pedida explícitamente para este tenant (no es el
// criterio por defecto de otras páginas del proyecto): cada bloque ocupa
// pantalla completa (100dvh) con una foto de fondo dominante y su propia
// animación de scroll — "resort de lujo/cinematográfico", con mar/playa
// predominando. Paso 2 (reglas de marca WebYa) se mantiene por encima
// donde no choca con ese pedido: WhatsApp como CTA principal en cada
// bloque relevante, fotografía real del negocio en las posiciones que le
// corresponden (nunca reemplazada por Unsplash), y las filas numeradas
// grandes como firma visual — adaptadas acá a numerales gigantes sobre
// cada bloque de destino/pilar en vez de una lista plana, para no romper
// el formato de pantalla completa pedido pero sin perder la firma.

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-playfair" });

const WHATSAPP_MSG_DEFAULT = "Hola, quisiera información sobre destinos y paquetes de viaje";

function waHref(telefono: string, mensaje: string = WHATSAPP_MSG_DEFAULT) {
  return `https://wa.me/${telefono.replace(/\D/g, "")}?text=${encodeURIComponent(mensaje)}`;
}

// Busca la foto real ya cargada en content.fotos por nombre de archivo
// (así el alt text sigue siendo editable desde el panel admin) y solo cae
// al literal hardcodeado si esa foto llegara a desaparecer del arreglo —
// los 7 archivos ya existen en public/tenants/deluxtravel/ (ver tarea).
function foto(fotos: Foto[], destacada: Foto | null, archivo: string, altPorDefecto: string): Foto {
  if (destacada?.url.endsWith(archivo)) return destacada;
  return fotos.find((f) => f.url.endsWith(archivo)) ?? { url: `/tenants/deluxtravel/${archivo}`, alt: altPorDefecto };
}

const FAQ_DEFAULT = [
  { pregunta: "¿Los precios incluyen los vuelos?", respuesta: "Sí, nuestros paquetes incluyen vuelo, hotel y traslados — el precio que ves es el paquete completo." },
  { pregunta: "¿Puedo pagar en cuotas?", respuesta: "Sí, con un abono inicial y el resto en cuotas antes del viaje." },
  { pregunta: "¿Salen directo desde Cuenca?", respuesta: "Sí, todos los paquetes parten del aeropuerto Mariscal Lamar." },
];

const PASOS_DEFAULT = ["Escríbenos por WhatsApp con tu destino y fechas", "Te armamos un paquete a tu medida", "Reservas con un abono y viajas"];

// Fotografía de destino con licencia Unsplash (uso comercial libre) —
// ilustrativa del lugar, no fotos de clientes reales de DeluxTravel (ver
// nota de criterio de nicho arriba). Ping de tracking obligatorio de la
// API ya disparado a `links.download_location` de cada una durante la
// construcción (requisito de los términos de uso, no repetible en
// runtime). Atribución completa en el footer.
const UNSPLASH = {
  heroPlaya: "https://images.unsplash.com/photo-1618064541372-289bdb6f5b7b?auto=format&fit=crop&w=1920&q=80",
  rioPlaya: "https://images.unsplash.com/photo-1637876308735-74230b34461a?auto=format&fit=crop&w=1920&q=80",
  panamaPlaya: "https://images.unsplash.com/photo-1627512729059-fb322f8436f7?auto=format&fit=crop&w=1920&q=80",
  sanAndresPlaya: "https://images.unsplash.com/photo-1639387130096-7737fc425ec8?auto=format&fit=crop&w=1920&q=80",
  oceanoAtardecer: "https://images.unsplash.com/photo-1616036740257-9449ea1f6605?auto=format&fit=crop&w=1920&q=80",
};

const CREDITOS_UNSPLASH = [
  { nombre: "Hugh Whyte", perfil: "https://unsplash.com/@opixels" },
  { nombre: "Honório", perfil: "https://unsplash.com/@hoonorioo" },
  { nombre: "Azzedine Rouichi", perfil: "https://unsplash.com/@rouichi" },
  { nombre: "Holger Woizick", perfil: "https://unsplash.com/@howyblackbelt" },
  { nombre: "Sergio Mena Ferreira", perfil: "https://unsplash.com/@sergiomenamx" },
];

// Numeral gigante — adaptación de la firma visual "filas numeradas
// grandes" (webya.md sección 7) al formato de pantalla completa: en vez de
// una lista, el número vive como marca de agua sobre cada bloque de
// destino/pilar, con su propia capa de profundidad (Parallax a velocidad
// distinta a la del fondo, para reforzar la sensación 3D del scroll).
function Numeral({ n, speed = 0.5 }: { n: string; speed?: number }) {
  return (
    <Parallax speed={speed} className="pointer-events-none absolute top-6 right-6 select-none sm:top-10 sm:right-10">
      <span className={`${playfair.className} text-[6rem] leading-none font-semibold text-[#f1ece0]/20 sm:text-[9rem]`}>{n}</span>
    </Parallax>
  );
}

function Scrim({ desde = "from-[#0b2436]", intensidad = "via-[#0b2436]/45" }: { desde?: string; intensidad?: string }) {
  return <div aria-hidden className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${desde} ${intensidad} to-transparent`} />;
}

export function DeluxTravel({ tenant, content }: TenantWithContent) {
  const acento = content.coloresMarca.acento;
  const fondo = content.coloresMarca.fondo;
  const texto = content.coloresMarca.texto;

  const faq = content.faq.length > 0 ? content.faq : FAQ_DEFAULT;
  const pasos = content.pasos.length > 0 ? content.pasos : PASOS_DEFAULT;
  const mapaSrc = content.textos.direccion ? `https://www.google.com/maps?q=${encodeURIComponent(content.textos.direccion)}&output=embed` : null;

  const fotoAvion = foto(content.fotos, content.fotoDestacada, "hero.jpg", "Ala de avión sobre nubes iluminadas por el atardecer");
  const fotoBuenosAires = foto(content.fotos, content.fotoDestacada, "destino-buenosaires.jpg", "Obelisco de Buenos Aires con un colectivo urbano en primer plano");
  const fotoRio = foto(content.fotos, content.fotoDestacada, "destino-rio.jpg", "Cristo Redentor sobre el cerro Corcovado al atardecer, Río de Janeiro");
  const fotoAtencion = foto(content.fotos, content.fotoDestacada, "pilar-atencion.jpg", "Asesor de viajes saludando de mano a una clienta");
  const fotoVuelos = foto(content.fotos, content.fotoDestacada, "pilar-vuelos.jpg", "Avión despegando al atardecer sobre la pista");
  const fotoTodoIncluido = foto(content.fotos, content.fotoDestacada, "pilar-todoincluido.jpg", "Vista cenital de una maleta siendo empacada");
  const fotoFaq = foto(content.fotos, content.fotoDestacada, "faq.jpg", "Pasaporte y pase de abordar sobre un equipaje de mano");

  // Fondo/animación por destino, en el mismo orden en que ya vienen
  // cargadas las 4 categorías en tenant_content.precios.categorias (Río,
  // Buenos Aires, Panamá, San Andrés — confirmado con el GET de
  // referencia). Buenos Aires es la única sin foto de playa a propósito:
  // es un destino de ciudad, no de costa — forzar una playa ahí habría
  // sido inexacto, así que se distingue con paneo horizontal en vez de
  // zoom, y con su propia foto real de ciudad en vez de una de Unsplash.
  const destinos = [
    {
      numero: "01",
      kicker: "Playas cariocas",
      fondo: <KenBurnsBg src={UNSPLASH.rioPlaya} alt="Vista aérea de playa con ciudad al fondo, Río de Janeiro" />,
      postal: fotoRio,
      align: "justify-end text-right items-end" as const,
    },
    {
      numero: "02",
      kicker: "Ciudad y tango",
      fondo: <PannerBg src={fotoBuenosAires.url} alt={fotoBuenosAires.alt} />,
      postal: null,
      align: "justify-start text-left items-start" as const,
    },
    {
      numero: "03",
      kicker: "Entre dos océanos",
      fondo: (
        <div className="absolute inset-0 overflow-hidden">
          <Parallax speed={0.4} className="absolute inset-x-0 -top-[15%] h-[130%]">
            <Image src={UNSPLASH.panamaPlaya} alt="Palmera sobre playa de arena blanca en las islas San Blas, Panamá" fill sizes="100vw" className="object-cover" />
          </Parallax>
        </div>
      ),
      postal: null,
      align: "justify-end text-right items-end" as const,
    },
    {
      numero: "04",
      kicker: "Mar de los siete colores",
      fondo: <ClipRevealBg src={UNSPLASH.sanAndresPlaya} alt="Playa de arena blanca con palmeras y mar turquesa en el Caribe" />,
      postal: null,
      align: "justify-start text-left items-start" as const,
    },
  ];

  return (
    <div style={{ ["--tenant-acento" as string]: acento, backgroundColor: fondo, color: texto }} className={`${playfair.variable} min-h-screen font-sans`}>
      {/* Navbar flotante — legible sobre cualquier foto de fondo gracias al
          degradado, sin necesidad de detectar scroll con JS. */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-gradient-to-b from-black/55 to-transparent px-6 py-5 sm:px-10">
        <span className={`${playfair.className} text-lg font-semibold tracking-tight text-[#f1ece0]`}>{tenant.nombre}</span>
        <a
          href={waHref(content.telefonoWhatsapp)}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border px-4 py-2 text-sm font-medium text-[#f1ece0] backdrop-blur-sm transition hover:opacity-80"
          style={{ borderColor: acento }}
        >
          WhatsApp
        </a>
      </header>

      {/* HERO — único bloque con fotografía de playa "genérica" en el
          sentido de portada (aérea, sin marca de lugar) porque es la
          promesa general de la agencia, no un destino puntual todavía. */}
      <section className="relative flex min-h-dvh items-end overflow-hidden">
        <KenBurnsBg src={UNSPLASH.heroPlaya} alt="Vista aérea de playa tropical con aguas turquesas" priority className="scale-105" />
        <Scrim intensidad="via-[#0b2436]/55" />
        <div className="relative z-10 w-full px-6 pb-20 sm:px-10 sm:pb-28">
          <ScrollReveal y={0} duration={0.5}>
            <p className="mb-4 text-xs font-medium tracking-[0.3em] uppercase" style={{ color: acento }}>
              Agencia de viajes en Cuenca
            </p>
          </ScrollReveal>
          <h1 className={`${playfair.className} max-w-3xl text-4xl leading-[1.1] font-semibold text-[#f1ece0] sm:text-6xl lg:text-7xl`}>
            <WordReveal text={content.textos.tagline || tenant.nombre} delay={0.15} />
          </h1>
          <ScrollReveal y={16} delay={0.5} duration={0.7}>
            <p className="mt-6 max-w-xl text-base text-[#f1ece0]/85 sm:text-lg">{content.textos.descripcion}</p>
          </ScrollReveal>
          <ScrollReveal y={16} delay={0.7} duration={0.7}>
            <a
              href={waHref(content.telefonoWhatsapp)}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block rounded-full px-7 py-3.5 text-sm font-semibold text-[#0b2436] shadow-lg transition hover:opacity-90"
              style={{ backgroundColor: acento }}
            >
              Escribir por WhatsApp
            </a>
          </ScrollReveal>
        </div>
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-[#f1ece0]/70">
          <span className="text-[0.65rem] tracking-[0.25em] uppercase">Desliza</span>
          <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden />
        </div>
      </section>

      {/* CÓMO RESERVAR — foto real del avión despegando: el motivo "estás a
          punto de partir" encaja tanto para el diferenciador (salida
          directa) como para los pasos de reserva. Parallax de fondo (motor
          compartido) + numerales grandes en vez de bullets. */}
      <section className="relative flex min-h-dvh items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <Parallax speed={0.35} className="absolute inset-x-0 -top-[15%] h-[130%]">
            <Image src={fotoAvion.url} alt={fotoAvion.alt} fill sizes="100vw" className="object-cover" />
          </Parallax>
        </div>
        <Scrim intensidad="via-[#0b2436]/60" />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 sm:px-10">
          <ScrollReveal>
            <p className="mb-3 text-xs font-medium tracking-[0.3em] uppercase" style={{ color: acento }}>
              {content.textos.diferenciador}
            </p>
            <h2 className={`${playfair.className} mb-10 text-3xl font-semibold text-[#f1ece0] sm:text-4xl`}>Así de fácil es viajar con nosotros</h2>
          </ScrollReveal>
          <div className="space-y-6">
            {pasos.map((paso, i) => (
              <ScrollReveal key={paso} delay={i * 0.12}>
                <div className="flex items-baseline gap-5 border-b border-[#f1ece0]/15 pb-6">
                  <span className={`${playfair.className} w-14 shrink-0 text-4xl font-semibold text-[#f1ece0]/30 sm:text-5xl`}>{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-lg text-[#f1ece0]/90 sm:text-xl">{paso}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINOS */}
      {content.precios.categorias.slice(0, 4).map((cat, i) => {
        const meta = destinos[i];
        if (!meta) return null;
        const [duracion, detalle, precio] = cat.items;

        return (
          <section key={cat.nombre} className="relative flex min-h-dvh flex-col overflow-hidden">
            {meta.fondo}
            <Scrim intensidad="via-[#0b2436]/50" />
            <Numeral n={meta.numero} speed={0.3 + i * 0.08} />

            <div className={`relative z-10 flex h-full w-full flex-1 flex-col px-6 py-24 sm:px-10 ${meta.align}`}>
              <ScrollReveal className="max-w-lg">
                <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase" style={{ color: acento }}>
                  {meta.kicker}
                </p>
                <h2 className={`${playfair.className} text-4xl font-semibold text-[#f1ece0] sm:text-5xl`}>{cat.nombre}</h2>
                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#f1ece0]/80">
                  {duracion && <span>{duracion}</span>}
                  {detalle && (
                    <>
                      <span aria-hidden>·</span>
                      <span>{detalle}</span>
                    </>
                  )}
                </div>
                {precio && (
                  <p className={`${playfair.className} mt-4 text-3xl font-semibold`} style={{ color: acento }}>
                    {precio}
                  </p>
                )}
                <a
                  href={waHref(content.telefonoWhatsapp, `Hola, quisiera más información sobre el paquete a ${cat.nombre}`)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-block rounded-full border px-6 py-2.5 text-sm font-semibold text-[#f1ece0] transition hover:bg-[#f1ece0]/10"
                  style={{ borderColor: acento }}
                >
                  Consultar por WhatsApp
                </a>
              </ScrollReveal>

              {meta.postal && (
                <div className="mt-10">
                  <PostcardFloat src={meta.postal.url} alt={meta.postal.alt} />
                </div>
              )}
            </div>
          </section>
        );
      })}

      {content.precios.nota && (
        <p className="border-y px-6 py-4 text-center text-xs text-[#f1ece0]/60 sm:px-10" style={{ borderColor: `${acento}25` }}>
          {content.precios.nota}
        </p>
      )}

      {/* POR QUÉ ELEGIRNOS — 3 sub-bloques, cada uno con su propia foto real
          y su propio tratamiento (el tercero, deliberadamente sin
          movimiento de fondo, como respiro después de dos bloques con
          zoom/paneo). */}
      {content.pilares.length > 0 && (
        <>
          <section className="relative flex min-h-dvh items-end overflow-hidden">
            <KenBurnsBg src={fotoAtencion.url} alt={fotoAtencion.alt} />
            <Scrim intensidad="via-[#0b2436]/45" />
            <Numeral n="01" speed={0.25} />
            <div className="relative z-10 w-full px-6 pb-20 sm:px-10">
              <ScrollReveal className="max-w-lg">
                <h3 className={`${playfair.className} text-3xl font-semibold text-[#f1ece0] sm:text-4xl`}>{content.pilares[0].titulo}</h3>
                <p className="mt-4 text-base text-[#f1ece0]/85 sm:text-lg">{content.pilares[0].descripcion}</p>
              </ScrollReveal>
            </div>
          </section>

          {content.pilares[1] && (
            <section className="relative flex min-h-dvh items-center justify-center overflow-hidden text-center">
              <div className="absolute inset-0 overflow-hidden">
                <Parallax speed={0.35} className="absolute inset-x-0 -top-[15%] h-[130%]">
                  <Image src={fotoVuelos.url} alt={fotoVuelos.alt} fill sizes="100vw" className="object-cover" />
                </Parallax>
              </div>
              <Scrim desde="from-[#0b2436]" intensidad="via-[#0b2436]/55" />
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b2436]/40 to-transparent" />
              <Numeral n="02" speed={0.25} />
              <ScrollReveal scale={0.94} className="relative z-10 mx-auto max-w-xl px-6">
                <h3 className={`${playfair.className} text-3xl font-semibold text-[#f1ece0] sm:text-4xl`}>{content.pilares[1].titulo}</h3>
                <p className="mt-4 text-base text-[#f1ece0]/85 sm:text-lg">{content.pilares[1].descripcion}</p>
              </ScrollReveal>
            </section>
          )}

          {content.pilares[2] && (
            <section className="relative flex min-h-dvh items-start overflow-hidden">
              <Image src={fotoTodoIncluido.url} alt={fotoTodoIncluido.alt} fill sizes="100vw" className="object-cover" />
              <Scrim desde="from-transparent" intensidad="via-[#0b2436]/70" />
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b2436]/70 via-transparent to-transparent" />
              <Numeral n="03" speed={0.25} />
              <div className="relative z-10 w-full px-6 pt-24 sm:px-10 sm:pt-32">
                <ScrollReveal scale={0.96} className="ml-auto max-w-lg text-right">
                  <h3 className={`${playfair.className} text-3xl font-semibold text-[#f1ece0] sm:text-4xl`}>{content.pilares[2].titulo}</h3>
                  <p className="mt-4 text-base text-[#f1ece0]/85 sm:text-lg">{content.pilares[2].descripcion}</p>
                </ScrollReveal>
              </div>
            </section>
          )}
        </>
      )}

      {/* CIFRAS + TESTIMONIOS — única sección con una animación atada al
          reloj (TestimonialCycle) en vez de al scroll, para que la vitrina
          se sienta viva incluso si el visitante deja de hacer scroll. */}
      {(content.cifras.length > 0 || content.testimonios.length > 0) && (
        <section className="relative flex min-h-dvh items-center overflow-hidden">
          <Image src={UNSPLASH.oceanoAtardecer} alt="Olas rompiendo en la orilla durante el atardecer" fill sizes="100vw" className="object-cover" />
          <Scrim intensidad="via-[#0b2436]/70" />
          <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-14 px-6 sm:px-10 lg:grid-cols-2 lg:items-center">
            {content.cifras.length > 0 && (
              <div className="grid grid-cols-2 gap-x-6 gap-y-10">
                {content.cifras.map((c) => (
                  <ScrollReveal key={c.etiqueta}>
                    <p className={`${playfair.className} text-4xl font-semibold sm:text-5xl`} style={{ color: acento }}>
                      <CountUp to={c.numero} suffix={c.sufijo} />
                    </p>
                    <p className="mt-1 text-sm text-[#f1ece0]/75">{c.etiqueta}</p>
                  </ScrollReveal>
                ))}
              </div>
            )}
            {content.testimonios.length > 0 && (
              <ScrollReveal>
                <TestimonialCycle testimonios={content.testimonios} acento={acento} />
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      {/* FAQ — foto real (pasaporte + pase de abordar), muy oscurecida
          para que el acordeón de texto denso siga siendo legible sin dejar
          de ser una "foto a pantalla completa" de fondo. */}
      <section className="relative flex min-h-dvh items-center overflow-hidden">
        <Image src={fotoFaq.url} alt={fotoFaq.alt} fill sizes="100vw" className="object-cover" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#0b2436]/80" />
        <div className="relative z-10 mx-auto w-full max-w-2xl px-6 py-24 sm:px-10">
          <ScrollReveal>
            <h2 className={`${playfair.className} mb-8 text-3xl font-semibold text-[#f1ece0] sm:text-4xl`}>Preguntas frecuentes</h2>
          </ScrollReveal>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <ScrollReveal key={item.pregunta} delay={i * 0.06}>
                <details className="rounded-xl border p-4" style={{ borderColor: `${acento}40` }}>
                  <summary className="cursor-pointer font-medium text-[#f1ece0]">{item.pregunta}</summary>
                  <p className="mt-2 text-sm text-[#f1ece0]/75">{item.respuesta}</p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* MAPA / CONTACTO — el mapa a pantalla completa es la "foto" de
          este bloque; la tarjeta flotante suma el resto de datos de
          contacto reales ya cargados. */}
      {mapaSrc && (
        <section className="relative flex min-h-dvh items-center overflow-hidden">
          <iframe src={mapaSrc} className="absolute inset-0 h-full w-full grayscale" loading="lazy" title={`Mapa de ${tenant.nombre}`} />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#0b2436]/35" />
          <div className="relative z-10 mx-6 sm:mx-10">
            <ScrollReveal scale={0.95}>
              <div className="max-w-sm rounded-2xl border bg-[#0b2436]/90 p-7 shadow-2xl backdrop-blur-sm" style={{ borderColor: `${acento}40` }}>
                <h2 className={`${playfair.className} text-2xl font-semibold text-[#f1ece0]`}>Visítanos</h2>
                <p className="mt-3 text-sm text-[#f1ece0]/85">{content.textos.direccion}</p>
                {content.horarios.length > 0 && (
                  <ul className="mt-4 space-y-1 text-sm text-[#f1ece0]/75">
                    {content.horarios.map((h) => (
                      <li key={h.dia} className="flex justify-between gap-4">
                        <span>{h.dia}</span>
                        <span>{h.horas}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <a
                  href={waHref(content.telefonoWhatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-block rounded-full px-6 py-3 text-sm font-semibold text-[#0b2436]"
                  style={{ backgroundColor: acento }}
                >
                  Escribir por WhatsApp
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t px-6 py-10 text-xs text-[#f1ece0]/60 sm:px-10" style={{ borderColor: `${acento}25` }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>
            {tenant.nombre} — {content.textos.direccion}
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
          Fotos del equipo, vuelos, empaque y trámites: propias de {tenant.nombre}. Fotos de playa de Río de Janeiro, Panamá y San Andrés: fotografía de
          paisaje con licencia Unsplash, ilustrativa del destino (no fotos de viajes de clientes reales), por{" "}
          {CREDITOS_UNSPLASH.map((c, i) => (
            <span key={c.nombre}>
              <a href={c.perfil} target="_blank" rel="noreferrer" className="underline">
                {c.nombre}
              </a>
              {i < CREDITOS_UNSPLASH.length - 1 ? (i === CREDITOS_UNSPLASH.length - 2 ? " y " : ", ") : ""}
            </span>
          ))}{" "}
          en <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="underline">Unsplash</a>.
        </p>
      </footer>

      {/* WhatsApp fijo móvil */}
      <a
        href={waHref(content.telefonoWhatsapp)}
        target="_blank"
        rel="noreferrer"
        className="fixed right-5 bottom-5 z-40 rounded-full px-5 py-3 text-sm font-semibold text-[#0b2436] shadow-lg sm:hidden"
        style={{ backgroundColor: acento }}
      >
        WhatsApp
      </a>
    </div>
  );
}
