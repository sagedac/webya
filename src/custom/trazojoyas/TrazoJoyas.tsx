import type { TenantWithContent } from "@/lib/types";
import { ScrollReveal } from "@/templates/engine/ScrollReveal";
import { ProductVisual } from "@/templates/engine/ProductVisual";
import { PiezasList } from "@/custom/trazojoyas/PiezasList";

// Trazo Joyas — primera página de código a medida bajo el modelo nuevo
// (webya.md sección 5, reset del catálogo 2026-08-12): sin plantilla
// reutilizable de por medio, construida directo para este tenant. Nivel
// 3/EXPERIENCE (usa ProductVisual del motor compartido).
//
// Fotos: el negocio es ficticio (demo de validación) y todavía no hay
// fotos reales de un cliente real — se usan fotos de muestra de Unsplash
// (licencia de uso comercial libre, credenciales en .env.local) cargadas
// en content.fotos/content.fotoDestacada desde el panel admin, con
// atribución al fotógrafo en el footer (requisito de las guías de la API
// de Unsplash). No son "la foto real" de Trazo Joyas — son un mockup para
// mostrarle al dueño de un negocio real cómo necesitaría las fotos.

const WHATSAPP_MSG = "Hola, quisiera más información sobre sus piezas";

function waHref(telefono: string) {
  return `https://wa.me/${telefono.replace(/\D/g, "")}?text=${encodeURIComponent(WHATSAPP_MSG)}`;
}

const FAQ_DEFAULT = [
  { pregunta: "¿Las piezas son de plata/oro real?", respuesta: "Sí — plata 925, acero quirúrgico hipoalergénico o chapado en oro fino, según la pieza. El material de cada una está indicado en su ficha." },
  { pregunta: "¿Hacen envíos?", respuesta: "Sí, coordinamos envío a todo Ecuador. Escríbenos por WhatsApp para cotizar según tu ciudad." },
  { pregunta: "¿Puedo pedir una pieza para regalo?", respuesta: "Claro — cuéntanos por WhatsApp y te ayudamos a elegir según ocasión y presupuesto." },
];

export function TrazoJoyas({ tenant, content }: TenantWithContent) {
  const acento = content.coloresMarca.acento;
  const fondo = content.coloresMarca.fondo;
  const texto = content.coloresMarca.texto;
  const faq = content.faq.length > 0 ? content.faq : FAQ_DEFAULT;
  const mapaSrc = content.textos.direccion
    ? `https://www.google.com/maps?q=${encodeURIComponent(content.textos.direccion)}&output=embed`
    : null;

  return (
    <div style={{ ["--tenant-acento" as string]: acento, backgroundColor: fondo, color: texto }} className="min-h-screen font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="text-lg font-semibold tracking-tight">{tenant.nombre}</span>
        <a
          href={waHref(content.telefonoWhatsapp)}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border px-4 py-2 text-sm font-medium transition hover:opacity-70"
          style={{ borderColor: acento, color: acento }}
        >
          WhatsApp
        </a>
      </header>

      {/* Hero */}
      <section className="grid gap-10 px-6 pt-6 pb-16 sm:px-10 lg:grid-cols-2 lg:items-center lg:gap-6 lg:pt-12">
        <div className="max-w-lg">
          {content.textos.tagline && <p className="mb-3 text-sm tracking-wide uppercase opacity-60">{content.textos.tagline}</p>}
          <h1 className="text-4xl leading-tight font-semibold sm:text-5xl">{tenant.nombre}</h1>
          {content.textos.descripcion && <p className="mt-5 text-base opacity-80">{content.textos.descripcion}</p>}
          <a
            href={waHref(content.telefonoWhatsapp)}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-block rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: acento }}
          >
            Escribir por WhatsApp
          </a>
        </div>

        {content.fotoDestacada && (
          <ProductVisual src={content.fotoDestacada.url} alt={content.fotoDestacada.alt} />
        )}
      </section>

      {/* Piezas */}
      <section className="px-6 py-14 sm:px-10">
        <ScrollReveal>
          <h2 className="mb-8 text-2xl font-semibold">Piezas</h2>
        </ScrollReveal>

        <PiezasList categorias={content.precios.categorias} fotos={content.fotos} acento={acento} />
        {content.precios.nota && <p className="mt-6 text-sm opacity-60">{content.precios.nota}</p>}
      </section>

      {/* Ubicación */}
      {mapaSrc && (
        <section className="px-6 py-14 sm:px-10">
          <ScrollReveal>
            <h2 className="mb-4 text-2xl font-semibold">Dónde encontrarnos</h2>
            <p className="mb-5 opacity-80">{content.textos.direccion}</p>
            <div className="overflow-hidden rounded-2xl border" style={{ borderColor: `${acento}30` }}>
              <iframe src={mapaSrc} className="h-72 w-full" loading="lazy" title={`Mapa de ${tenant.nombre}`} />
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* FAQ */}
      <section className="px-6 py-14 sm:px-10">
        <ScrollReveal>
          <h2 className="mb-6 text-2xl font-semibold">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {faq.map((item) => (
              <details key={item.pregunta} className="rounded-xl border p-4" style={{ borderColor: `${acento}30` }}>
                <summary className="cursor-pointer font-medium">{item.pregunta}</summary>
                <p className="mt-2 text-sm opacity-70">{item.respuesta}</p>
              </details>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-xs opacity-50 sm:px-10" style={{ borderColor: `${acento}20` }}>
        <p>
          {tenant.nombre} — {content.textos.direccion}
        </p>
        <p className="mt-2">
          Fotos de muestra:{" "}
          <a href="https://unsplash.com/@lucaslenzi" target="_blank" rel="noreferrer" className="underline">Lucas Lenzi</a>,{" "}
          <a href="https://unsplash.com/@whynotnatali" target="_blank" rel="noreferrer" className="underline">Natali Hordiiuk</a>,{" "}
          <a href="https://unsplash.com/@iantalmacs" target="_blank" rel="noreferrer" className="underline">Ian Talmacs</a>,{" "}
          <a href="https://unsplash.com/@zeralton" target="_blank" rel="noreferrer" className="underline">Zeralton Gallery</a>,{" "}
          <a href="https://unsplash.com/@samahosseini" target="_blank" rel="noreferrer" className="underline">Sama Hosseini</a> y{" "}
          <a href="https://unsplash.com/@thewildflowerpress" target="_blank" rel="noreferrer" className="underline">Tessa Edmiston</a> en{" "}
          <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="underline">Unsplash</a> — de muestra mientras se cargan fotos reales del negocio.
        </p>
      </footer>

      {/* WhatsApp fijo móvil */}
      <a
        href={waHref(content.telefonoWhatsapp)}
        target="_blank"
        rel="noreferrer"
        className="fixed right-5 bottom-5 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg sm:hidden"
        style={{ backgroundColor: acento }}
      >
        WhatsApp
      </a>
    </div>
  );
}
