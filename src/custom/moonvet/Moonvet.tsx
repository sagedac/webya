import { Fraunces } from "next/font/google";
import Image from "next/image";
import {
  BedDouble,
  ChevronDown,
  Clock,
  MapPin,
  MessageCircle,
  Moon,
  PawPrint,
  Pill,
  Scissors,
  Sparkles,
  Stethoscope,
  Syringe,
} from "lucide-react";
import type { CategoriaProducto, Foto, TenantWithContent } from "@/lib/types";
import { ScrollReveal } from "@/engine/ScrollReveal";
import { Parallax } from "@/engine/Parallax";
import { AbiertoAhora, FaseLunarEsta } from "@/custom/moonvet/effects";

// Moonvet — tercera página de código a medida bajo el modelo de webya.md
// sección 5 (reset del catálogo, 2026-08-12). Negocio real: 24 Horas
// Clínica Veterinaria Moonvet, sector Santa María de Sayausí, Cuenca.
//
// Paso 4 del proceso del agente constructor — criterio de nicho para ESTE
// negocio (clínica veterinaria de urgencias, no una consulta de barrio
// genérica):
//
// - ¿Qué objetos/materiales/texturas pertenecen genuinamente a este
//   negocio? La mesa de acero de examen, el estetoscopio, las manos que
//   sostienen a un animal asustado con calma, el carnet de vacunas, la
//   sala a las 3am con la luz encendida cuando todo lo demás está cerrado.
//   No hay fotos reales del negocio todavía (ver nota de fotos abajo), así
//   que las 4 fotos de muestra de Unsplash se eligieron priorizando manos
//   + mascota + ambiente clínico real por sobre una persona posando de
//   médico genérico (mismo criterio ya aplicado en DeluxTravel al
//   reemplazar pilar-atencion.jpg).
// - ¿Qué vocabulario usaría el dueño? "Emergencia", "urgencia", "atención
//   las 24 horas", "control", "vacunas", "cita" — no "experiencias de
//   bienestar animal integral" ni relleno corporativo de clínica
//   boutique. El dato real más fuerte de este negocio es que SIEMPRE está
//   abierto — eso tiene que sentirse en cada sección, no solo mencionarse
//   una vez.
// - ¿Qué necesita ver/saber un cliente antes de escribir por WhatsApp?
//   Que de verdad atienden a cualquier hora (la duda más razonable de
//   cualquiera que nunca ha usado una veterinaria de urgencias), qué
//   servicios cubren (consulta, vacunas, cirugía, hospitalización — no
//   solo "emergencias"), dónde queda la clínica exactamente, y que hay
//   alguien real atendiendo del otro lado del WhatsApp ahora mismo — de
//   ahí el indicador "Abierto ahora" con hora en vivo de Cuenca, en vez de
//   dejarlo como una frase más en el texto.
//
// Firma visual (webya.md sección 7): el nombre del negocio ya es la
// firma — "Moonvet" + atención 24h se traduce literalmente en un motivo
// lunar (foto de luna llena real vía Unsplash, badge "Abierto ahora" con
// reloj en vivo de Cuenca, fase lunar de la noche calculada en el
// cliente) en vez de un patrón decorativo sin relación con el negocio.
// No es un reskin de las filas numeradas de DeluxTravel ni del grid de
// Trazo Joyas — es propia de este negocio.
//
// Fotos: negocio real, pero sin fotos propias todavía (ver tarea) — se
// usan 4 fotos de muestra de Unsplash (licencia de uso comercial libre,
// credenciales en .env.local), con el ping de tracking obligatorio ya
// disparado durante la construcción y atribución completa en el footer
// (mismo patrón que src/custom/deluxtravel/DeluxTravel.tsx). No se usa
// ProductVisual: esta clínica no vende un producto físico protagonista
// (el "objeto en exhibición" con marco y marcas de esquina que usa
// ProductVisual está pensado para joyería/artesanía/producto de consumo,
// no encajaría con una foto de manos atendiendo a una mascota) — en su
// lugar, las fotos usan un tratamiento propio (tarjeta con esquinas
// redondeadas + resplandor de acento detrás + Parallax sutil), coherente
// con "ninguna capa del motor es obligatoria por sí sola" (webya.md
// sección 2).
//
// Convención de tenant_content para esta página (documentada porque no
// hay una lista fija de secciones ni de qué significa cada campo):
// `precios.categorias` se usa como "Servicios" (nombre = servicio, items =
// qué incluye) — mismo patrón exacto ya usado en TrazoJoyas para
// "piezas". `precios.nota` es la nota de precios variables, se muestra
// solo si el admin la carga. `pilares`/`pasos`/`faq` con sus fallbacks de
// siempre (vacío = usa el set por defecto de esta página, documentado más
// abajo). `horarios` es opcional y complementario — el hecho de que
// atiende 24 horas ya está confirmado y se muestra siempre,
// independientemente de si el admin cargó un horario detallado.

const fraunces = Fraunces({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--font-fraunces" });

const WHATSAPP_MSG_CONSULTA = "Hola, quisiera agendar una consulta para mi mascota";
const WHATSAPP_MSG_EMERGENCIA = "Hola, tengo una emergencia con mi mascota y necesito atención ahora";

function waHref(telefono: string, mensaje: string) {
  return `https://wa.me/${telefono.replace(/\D/g, "")}?text=${encodeURIComponent(mensaje)}`;
}

// Busca la foto real ya cargada en content.fotos por nombre de archivo (el
// alt queda editable desde el panel admin); si el tenant todavía no cargó
// ninguna, cae a las 4 fotos de muestra locales (mismo mecanismo que
// DeluxTravel).
function foto(fotos: Foto[], archivo: string, altPorDefecto: string): Foto {
  return fotos.find((f) => f.url.endsWith(archivo)) ?? { url: `/tenants/moonvet/${archivo}`, alt: altPorDefecto };
}

// Servicios por defecto de una clínica veterinaria real ecuatoriana —
// ASUNCIÓN del agente constructor, no datos confirmados por el dueño (ver
// reporte de construcción). Editable desde el panel admin en cualquier
// momento sin tocar código (precios.categorias).
const SERVICIOS_DEFAULT: CategoriaProducto[] = [
  { nombre: "Consultas y chequeos", items: ["Diagnóstico y consulta general", "Control de peso y nutrición", "Desparasitación"] },
  { nombre: "Vacunación", items: ["Plan de vacunas para cachorros y gatitos", "Refuerzos anuales", "Certificado de vacunación"] },
  { nombre: "Cirugías", items: ["Esterilización y castración", "Cirugías de tejidos blandos", "Control postoperatorio"] },
  { nombre: "Hospitalización y emergencias", items: ["Atención de urgencias a cualquier hora", "Hospitalización con monitoreo", "Fluidoterapia"] },
  { nombre: "Estética y peluquería", items: ["Baño y corte", "Limpieza de oídos y uñas"] },
  { nombre: "Farmacia veterinaria", items: ["Medicamentos y antiparasitarios", "Alimento balanceado"] },
];

const PILARES_DEFAULT = [
  { titulo: "24 horas, los 365 días", descripcion: "Una emergencia no avisa. En Moonvet siempre hay alguien despierto para atender a tu mascota, sea la hora que sea." },
  { titulo: "Trato cercano, de barrio", descripcion: "Conocemos a tu mascota por su nombre, no por un número de ficha. Te explicamos todo con calma, sin apuros." },
  { titulo: "En Santa María de Sayausí", descripcion: "Fácil de llegar, con espacio para que tu mascota se sienta tranquila desde que entra por la puerta." },
];

const PASOS_DEFAULT = [
  "Escríbenos por WhatsApp contándonos qué le pasa a tu mascota",
  "Te orientamos al instante — sea una consulta o una emergencia",
  "La atendemos en clínica, no importa la hora",
];

const FAQ_DEFAULT = [
  { pregunta: "¿De verdad atienden emergencias a cualquier hora, incluso de madrugada?", respuesta: "Sí — Moonvet atiende las 24 horas, los 365 días del año. Escríbenos por WhatsApp apenas lo necesites y te orientamos de inmediato." },
  { pregunta: "¿Necesito cita previa para una consulta?", respuesta: "Para consultas y controles agenda por WhatsApp con anticipación. Para emergencias, ven directamente o escríbenos y te esperamos." },
  { pregunta: "¿Qué debo llevar la primera vez?", respuesta: "Si tu mascota ya tiene carnet de vacunas o historial médico, tráelo. Si es su primera visita, no te preocupes — nosotros abrimos su historia clínica." },
  { pregunta: "¿Atienden otras mascotas además de perros y gatos?", respuesta: "Cuéntanos por WhatsApp qué mascota tienes y te confirmamos si podemos atenderla." },
];

// Fotografía de muestra vía Unsplash (licencia de uso comercial libre) —
// elegidas priorizando manos/mascota/ambiente clínico real por sobre una
// persona posando (ver nota de criterio de nicho arriba). Ping de
// tracking obligatorio ya disparado a links.download_location de cada una
// durante la construcción. Atribución completa en el footer.
const CREDITOS_UNSPLASH = [
  { nombre: "Judy Beth Morris", perfil: "https://unsplash.com/@judy_beth_morris_idaho" },
  { nombre: "Karsten Winegeart", perfil: "https://unsplash.com/@_karsten" },
  { nombre: "Shane", perfil: "https://unsplash.com/@theyshane" },
  { nombre: "Syed Ahmad", perfil: "https://unsplash.com/@syedabsarahmad" },
];

// Ícono por servicio: intenta calzar por palabra clave del nombre (así el
// admin puede renombrar/reordenar categorías sin romper el ícono) y cae a
// PawPrint si no reconoce ninguna — nunca deja un servicio sin ícono.
function iconoServicio(nombre: string) {
  const n = nombre.toLowerCase();
  if (n.includes("consulta") || n.includes("chequeo")) return Stethoscope;
  if (n.includes("vacun")) return Syringe;
  if (n.includes("cirug")) return Scissors;
  if (n.includes("hospital") || n.includes("emergenc") || n.includes("urgenc")) return BedDouble;
  if (n.includes("estétic") || n.includes("estetic") || n.includes("peluque") || n.includes("baño")) return Sparkles;
  if (n.includes("farmacia") || n.includes("medicamento")) return Pill;
  return PawPrint;
}

// CTA de WhatsApp adaptado al criterio de esta página (webya.md sección
// 2: "ícono + relleno sólido del color de acento + hover con elevación",
// mismo estándar que DeluxTravel pero sin copiar el componente literal —
// acá con esquinas menos redondeadas y un borde interior sutil, más
// "placa clínica" que "pastilla de agencia de viajes"). `outline` es para
// el CTA secundario del hero (agendar consulta, no urgente) — mismo
// tratamiento visual que EstadoLandingForm/GestionAcceso no tienen, así
// que se define acá.
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
  const base = "inline-flex items-center gap-2 rounded-xl font-semibold shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0";
  const tamano = size === "sm" ? "px-4 py-2.5 text-sm" : "px-6 py-3.5 text-sm sm:text-base";
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${base} ${tamano} ${variant === "solido" ? "text-[#0e1626]" : "border border-current/25 bg-transparent"}`}
      style={variant === "solido" ? { backgroundColor: "var(--tenant-acento)" } : { color: "var(--tenant-acento)" }}
    >
      <MessageCircle className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} strokeWidth={2.5} aria-hidden />
      {children}
    </a>
  );
}

export function Moonvet({ tenant, content }: TenantWithContent) {
  const acento = content.coloresMarca.acento;
  const fondo = content.coloresMarca.fondo;
  const texto = content.coloresMarca.texto;

  const servicios = content.precios.categorias.length > 0 ? content.precios.categorias : SERVICIOS_DEFAULT;
  const pilares = content.pilares.length > 0 ? content.pilares : PILARES_DEFAULT;
  const pasos = content.pasos.length > 0 ? content.pasos : PASOS_DEFAULT;
  const faq = content.faq.length > 0 ? content.faq : FAQ_DEFAULT;
  const mapaSrc = content.textos.direccion ? `https://www.google.com/maps?q=${encodeURIComponent(content.textos.direccion)}&output=embed` : null;

  const fotoHero = foto(content.fotos, "hero.jpg", "Manos con estetoscopio examinando a una gatita blanca en una clínica veterinaria");
  const fotoConsulta = foto(content.fotos, "consulta.jpg", "Cachorro sentado sobre la mesa de examen de una clínica veterinaria");
  const fotoCuidado = foto(content.fotos, "cuidado.jpg", "Manos sosteniendo con cuidado la pata de un perro");
  const fotoLuna = foto(content.fotos, "luna.jpg", "Luna llena en un cielo nocturno despejado");

  return (
    <div
      style={{ ["--tenant-acento" as string]: acento, backgroundColor: fondo, color: texto }}
      className={`${fraunces.variable} min-h-screen font-sans`}
    >
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-4 backdrop-blur-[2px] sm:px-10" style={{ backgroundColor: `${fondo}cc` }}>
        <span className="flex items-center gap-2">
          <Moon className="h-5 w-5" style={{ color: acento }} strokeWidth={2} aria-hidden />
          <span className={`${fraunces.className} text-base font-semibold tracking-tight sm:text-lg`}>Moonvet</span>
        </span>
        <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_EMERGENCIA)} size="sm">
          Emergencia
        </WhatsAppCTA>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-28 pb-20 sm:px-10 sm:pt-36 sm:pb-28">
        {/* Resplandor ambiental de fondo — mismo lenguaje visual que el
            glow de ProductVisual (radial-gradient con el acento del
            tenant), pero construido acá directo: esta sección no muestra
            un producto, así que no corresponde importar ProductVisual
            completo solo por el glow. */}
        <div aria-hidden className="pointer-events-none absolute top-0 right-0 h-[32rem] w-[32rem] rounded-full opacity-20 blur-[100px]" style={{ backgroundColor: acento }} />

        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <ScrollReveal y={0} duration={0.5}>
              <p className="mb-4 text-xs font-medium tracking-[0.3em] uppercase opacity-70">Clínica veterinaria · Cuenca</p>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.1} duration={0.7}>
              <h1 className={`${fraunces.className} text-4xl leading-[1.08] font-semibold italic sm:text-5xl lg:text-6xl`}>
                {content.textos.tagline || "Atención veterinaria las 24 horas, los 365 días"}
              </h1>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.25} duration={0.7}>
              <p className="mt-6 max-w-lg text-base opacity-80 sm:text-lg">
                {content.textos.descripcion ||
                  `${tenant.nombre} — no importa la hora, siempre hay alguien para atender a tu mascota en Santa María de Sayausí, Cuenca.`}
              </p>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.4} duration={0.7}>
              <div className="mt-7">
                <AbiertoAhora />
              </div>
            </ScrollReveal>
            <ScrollReveal y={16} delay={0.5} duration={0.7}>
              <div className="mt-8 flex flex-wrap gap-3">
                <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_EMERGENCIA)}>Es una emergencia</WhatsAppCTA>
                <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_CONSULTA)} variant="outline">
                  Agendar consulta
                </WhatsAppCTA>
              </div>
            </ScrollReveal>
          </div>

          <Parallax speed={0.15} className="relative mx-auto w-full max-w-md">
            <div aria-hidden className="pointer-events-none absolute -inset-6 rounded-[2rem] opacity-30 blur-2xl" style={{ backgroundColor: acento }} />
            <div className="relative overflow-hidden rounded-[2rem] border" style={{ borderColor: `${acento}40` }}>
              <Image src={fotoHero.url} alt={fotoHero.alt} width={800} height={950} className="aspect-[4/5] w-full object-cover" priority />
            </div>
          </Parallax>
        </div>

        <div className="pointer-events-none relative mt-16 hidden justify-center opacity-40 sm:flex">
          <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden />
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Qué hacemos</p>
            <h2 className={`${fraunces.className} mb-10 text-3xl font-semibold sm:text-4xl`}>Cuidado veterinario completo</h2>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {servicios.map((cat, i) => {
              const Icono = iconoServicio(cat.nombre);
              return (
                <ScrollReveal key={cat.nombre} delay={i * 0.07}>
                  <div className="h-full rounded-2xl border p-6" style={{ borderColor: `${acento}30` }}>
                    <Icono className="h-6 w-6" style={{ color: acento }} strokeWidth={1.8} aria-hidden />
                    <h3 className="mt-4 text-lg font-semibold">{cat.nombre}</h3>
                    {cat.items.length > 0 && (
                      <ul className="mt-3 space-y-1.5 text-sm opacity-75">
                        {cat.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
          {content.precios.nota && <p className="mt-8 text-sm opacity-60">{content.precios.nota}</p>}
        </div>
      </section>

      {/* EMERGENCIAS 24H — sección firma: motivo lunar + reloj en vivo */}
      <section className="relative overflow-hidden px-6 py-24 sm:px-10 sm:py-32" style={{ backgroundColor: `${acento}0d` }}>
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <Parallax speed={0.25} className="relative mx-auto aspect-square w-full max-w-sm">
            <div aria-hidden className="pointer-events-none absolute -inset-10 rounded-full opacity-25 blur-[80px]" style={{ backgroundColor: acento }} />
            <div className="relative h-full w-full overflow-hidden rounded-full border" style={{ borderColor: `${acento}40` }}>
              <Image src={fotoLuna.url} alt={fotoLuna.alt} fill sizes="400px" className="object-cover" />
            </div>
          </Parallax>

          <div>
            <ScrollReveal>
              <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase" style={{ color: acento }}>
                Emergencias · 24 horas
              </p>
              <h2 className={`${fraunces.className} text-3xl font-semibold sm:text-4xl`}>No importa la hora. Moonvet está encendido.</h2>
              <p className="mt-5 max-w-xl text-base opacity-80 sm:text-lg">
                {content.textos.diferenciador ||
                  "Un accidente, una intoxicación, un parto complicado — las urgencias veterinarias no avisan. Por eso en Moonvet siempre hay un equipo despierto, listo para recibir a tu mascota."}
              </p>
              <FaseLunarEsta className="mt-4 block text-sm opacity-50 italic" />
              <div className="mt-8">
                <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_EMERGENCIA)}>Escribir ahora por WhatsApp</WhatsAppCTA>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <ScrollReveal className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-[2rem] border" style={{ borderColor: `${acento}30` }}>
              <Image src={fotoCuidado.url} alt={fotoCuidado.alt} width={800} height={650} className="aspect-[6/5] w-full object-cover" />
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
                    <h3 className={`${fraunces.className} text-xl font-semibold`}>{pilar.titulo}</h3>
                    <p className="mt-1.5 text-sm opacity-75 sm:text-base">{pilar.descripcion}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="px-6 py-16 sm:px-10 sm:py-20" style={{ backgroundColor: `${acento}0d` }}>
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <p className="mb-2 text-center text-xs font-medium tracking-[0.3em] uppercase opacity-60">Cómo funciona</p>
            <h2 className={`${fraunces.className} mb-12 text-center text-3xl font-semibold sm:text-4xl`}>De WhatsApp a la consulta</h2>
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

      {/* FAQ */}
      <section className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <ScrollReveal>
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Dudas frecuentes</p>
            <h2 className={`${fraunces.className} mb-8 text-3xl font-semibold sm:text-4xl`}>Preguntas frecuentes</h2>
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

      {/* CONTACTO / MAPA */}
      <section className="px-6 py-16 sm:px-10 sm:py-20" style={{ backgroundColor: `${acento}0d` }}>
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <ScrollReveal>
            <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase opacity-60">Visítanos</p>
            <h2 className={`${fraunces.className} mb-6 text-3xl font-semibold sm:text-4xl`}>Encuéntranos</h2>

            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0" style={{ color: acento }} strokeWidth={1.8} aria-hidden />
              <div>
                <p className="font-medium">Abierto las 24 horas, los 365 días</p>
                {content.horarios.length > 0 && (
                  <ul className="mt-1 space-y-0.5 text-sm opacity-70">
                    {content.horarios.map((h) => (
                      <li key={h.dia} className="flex gap-2">
                        <span className="opacity-70">{h.dia}:</span>
                        <span>{h.horas}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {content.textos.direccion && (
              <div className="mt-4 flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0" style={{ color: acento }} strokeWidth={1.8} aria-hidden />
                <p className="opacity-80">{content.textos.direccion}</p>
              </div>
            )}

            <div className="mt-8">
              <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_EMERGENCIA)}>Escribir por WhatsApp</WhatsAppCTA>
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

      {/* CONSULTA — cierre con foto real de ambiente clínico, ScrollReveal
          simple sin Parallax (respiro visual antes del footer). */}
      <section className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border" style={{ borderColor: `${acento}30` }}>
          <ScrollReveal>
            <div className="relative aspect-[16/9] w-full">
              <Image src={fotoConsulta.url} alt={fotoConsulta.alt} fill sizes="800px" className="object-cover" />
            </div>
          </ScrollReveal>
        </div>
      </section>

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
          {tenant.nombre} todavía no tiene fotos propias cargadas — las fotos de esta página son de muestra, con licencia Unsplash
          (uso comercial libre), ilustrativas de una clínica veterinaria (no fotos reales del negocio ni de sus pacientes), por{" "}
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
        <WhatsAppCTA href={waHref(content.telefonoWhatsapp, WHATSAPP_MSG_EMERGENCIA)} size="sm">
          WhatsApp
        </WhatsAppCTA>
      </div>
    </div>
  );
}
