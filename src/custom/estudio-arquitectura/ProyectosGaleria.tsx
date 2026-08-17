"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, MessageCircle, Ruler, X } from "lucide-react";
import type { Foto } from "@/lib/types";
import { ScrollReveal } from "@/engine/ScrollReveal";
import { MarcasEsquina } from "@/custom/estudio-arquitectura/effects";

// Grid de proyectos + modal de galería/info — la pieza interactiva central
// de esta página (pedido explícito de Paul: "categoría o proyecto podría
// ser un popup/modal"). Decisión de patrón (Paso 4 del agente constructor):
//
// - Las CATEGORÍAS se navegan con pestañas en línea (no modal): filtrar un
//   grid es un patrón estándar, predecible y descubrible — apilar un modal
//   sobre otro modal (categoría -> proyecto) habría sido peor UX que un
//   filtro simple, y ui-ux-pro-max marca "modal-vs-navigation" como
//   anti-patrón cuando el modal reemplaza navegación primaria.
// - El PROYECTO sí se abre en un modal (galería + info): es una vista de
//   detalle secundaria ("ver más"), no navegación primaria — caso de uso
//   legítimo de modal (mismo criterio que una vitrina tipo Pinterest/Behance),
//   evita perder el contexto de scroll/CTA de WhatsApp de la página y no
//   exige crear una ruta nueva por proyecto (este tenant es un componente
//   único, no un set de páginas — webya.md sección 5).
//
// Referencia de 21st MCP adaptada (no instalada como dependencia — mismo
// criterio del resto del proyecto): "Gallery Grid with Lightbox" (grid
// filtrable + lightbox animado) e "Image Preview" (miniatura -> modal a
// pantalla completa con botón de cierre), reconstruidos acá a mano con el
// motor compartido (ScrollReveal) + estado propio, sin la composición
// visual literal de ninguna referencia.

export interface ProyectoResuelto {
  nombre: string;
  ubicacion: string;
  anio: string;
  area: string;
  descripcion: string;
  fotos: Foto[];
}

export interface CategoriaResuelta {
  nombre: string;
  proyectos: ProyectoResuelto[];
}

interface ProyectosGaleriaProps {
  categorias: CategoriaResuelta[];
  acento: string;
  fondo: string;
  texto: string;
  telefono: string;
  esDefault: boolean;
}

function waHref(telefono: string, mensaje: string): string {
  const digitos = telefono.replace(/\D/g, "");
  const conCodigoPais = digitos.length === 10 && digitos.startsWith("0") ? `593${digitos.slice(1)}` : digitos;
  return `https://wa.me/${conCodigoPais}?text=${encodeURIComponent(mensaje)}`;
}

interface ProyectoConCategoria extends ProyectoResuelto {
  categoria: string;
}

function FichaProyecto({
  proyecto,
  numero,
  acento,
  texto,
  fondo,
  esDefault,
  onAbrir,
}: {
  proyecto: ProyectoConCategoria;
  numero: string;
  acento: string;
  texto: string;
  fondo: string;
  esDefault: boolean;
  onAbrir: () => void;
}) {
  const portada = proyecto.fotos[0];
  return (
    <button
      type="button"
      onClick={onAbrir}
      className="group relative flex flex-col overflow-hidden rounded-sm border text-left transition hover:-translate-y-1"
      style={{ borderColor: `${texto}30`, backgroundColor: fondo }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {portada ? (
          <Image
            src={portada.url}
            alt={portada.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div aria-hidden className="absolute inset-0" style={{ backgroundColor: `${acento}15` }} />
        )}
        <MarcasEsquina tono="rgba(255,255,255,0.85)" />
        {esDefault && (
          <span
            className="absolute top-3 right-3 rounded-sm px-2 py-0.5 text-[9px] font-medium tracking-[0.2em] uppercase"
            style={{ backgroundColor: fondo, color: texto }}
          >
            Proyecto de muestra
          </span>
        )}
      </div>
      {/* Cajetín inferior — franja tipo "cuadro de rotulación" de un plano
          técnico: número de lámina, categoría, nombre. */}
      <div className="flex items-center justify-between gap-3 border-t px-3 py-2.5" style={{ borderColor: `${texto}20` }}>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{proyecto.nombre}</p>
          <p className="text-[11px] tracking-[0.15em] uppercase opacity-60">{proyecto.categoria}</p>
        </div>
        <span className="shrink-0 font-mono text-[11px] tracking-wider opacity-50">A-{numero}</span>
      </div>
    </button>
  );
}

function ModalProyecto({
  proyecto,
  acento,
  texto,
  fondo,
  telefono,
  onCerrar,
}: {
  proyecto: ProyectoConCategoria;
  acento: string;
  texto: string;
  fondo: string;
  telefono: string;
  onCerrar: () => void;
}) {
  const [fotoIndex, setFotoIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const fotos = proyecto.fotos;

  useEffect(() => {
    // Un tick para que el estado inicial (oculto) pinte antes de animar —
    // mismo motivo que ScrollReveal fija el estado oculto solo por
    // gsap.set(), acá con clases CSS: evita saltos de layout con JS
    // deshabilitado (el modal ya nace visible sin transición en ese caso).
    const id = requestAnimationFrame(() => setVisible(true));
    cerrarRef.current?.focus();
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCerrar();
      if (e.key === "ArrowRight") setFotoIndex((i) => (i + 1) % fotos.length);
      if (e.key === "ArrowLeft") setFotoIndex((i) => (i - 1 + fotos.length) % fotos.length);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fotos.length, onCerrar]);

  const foto = fotos[fotoIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={proyecto.nombre}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm transition-opacity duration-300 sm:p-8 ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={onCerrar}
    >
      <div
        className={`relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-sm shadow-2xl transition-all duration-300 ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.98] opacity-0"}`}
        style={{ backgroundColor: fondo, color: texto }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={cerrarRef}
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
        >
          <X className="h-4.5 w-4.5" strokeWidth={2} aria-hidden />
        </button>

        {/* Galería */}
        <div className="relative aspect-[4/3] w-full shrink-0 sm:aspect-[16/9]">
          {foto && <Image src={foto.url} alt={foto.alt} fill sizes="(min-width: 640px) 768px, 100vw" className="object-cover" priority />}
          {fotos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Foto anterior"
                onClick={() => setFotoIndex((i) => (i - 1 + fotos.length) % fotos.length)}
                className="absolute top-1/2 left-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/65"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Foto siguiente"
                onClick={() => setFotoIndex((i) => (i + 1) % fotos.length)}
                className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/65"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {fotos.map((f, i) => (
                  <button
                    key={f.url}
                    type="button"
                    aria-label={`Ver foto ${i + 1}`}
                    onClick={() => setFotoIndex(i)}
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: i === fotoIndex ? "1.25rem" : "0.375rem", backgroundColor: i === fotoIndex ? acento : "rgba(255,255,255,0.6)" }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Cuadro de rotulación + info */}
        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          <p className="mb-1 text-[11px] font-medium tracking-[0.25em] uppercase" style={{ color: acento }}>
            {proyecto.categoria}
          </p>
          <h3 className="text-2xl font-semibold sm:text-3xl">{proyecto.nombre}</h3>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-y py-3 text-sm" style={{ borderColor: `${texto}20` }}>
            {proyecto.ubicacion && (
              <span className="flex items-center gap-1.5 opacity-80">
                <MapPin className="h-4 w-4" style={{ color: acento }} strokeWidth={1.8} aria-hidden />
                {proyecto.ubicacion}
              </span>
            )}
            {proyecto.area && (
              <span className="flex items-center gap-1.5 opacity-80">
                <Ruler className="h-4 w-4" style={{ color: acento }} strokeWidth={1.8} aria-hidden />
                {proyecto.area}
              </span>
            )}
            {proyecto.anio && <span className="font-mono opacity-60">{proyecto.anio}</span>}
          </div>

          {proyecto.descripcion && <p className="mt-4 text-sm leading-relaxed opacity-85 sm:text-base">{proyecto.descripcion}</p>}

          <a
            href={waHref(telefono, `Hola, quisiera más información sobre el proyecto "${proyecto.nombre}"`)}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5"
            style={{ backgroundColor: acento, color: fondo }}
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export function ProyectosGaleria({ categorias, acento, fondo, texto, telefono, esDefault }: ProyectosGaleriaProps) {
  const nombresCategorias = categorias.map((c) => c.nombre);
  const [filtro, setFiltro] = useState<string>("Todos");
  const [abierto, setAbierto] = useState<ProyectoConCategoria | null>(null);

  const todos: ProyectoConCategoria[] = categorias.flatMap((c) => c.proyectos.map((p) => ({ ...p, categoria: c.nombre })));
  const visibles = filtro === "Todos" ? todos : todos.filter((p) => p.categoria === filtro);

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {["Todos", ...nombresCategorias].map((cat) => {
          const activo = cat === filtro;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFiltro(cat)}
              className="rounded-full border px-4 py-2 text-sm font-medium transition"
              style={
                activo
                  ? { backgroundColor: acento, borderColor: acento, color: fondo }
                  : { backgroundColor: "transparent", borderColor: `${texto}30`, color: texto }
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      {visibles.length === 0 ? (
        <p className="py-16 text-center text-sm opacity-60">Todavía no hay proyectos cargados en esta categoría.</p>
      ) : (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((p, i) => (
            <ScrollReveal key={`${p.categoria}-${p.nombre}-${i}`} delay={(i % 3) * 0.08} y={22}>
              <FichaProyecto
                proyecto={p}
                numero={String(i + 1).padStart(2, "0")}
                acento={acento}
                texto={texto}
                fondo={fondo}
                esDefault={esDefault}
                onAbrir={() => setAbierto(p)}
              />
            </ScrollReveal>
          ))}
        </div>
      )}

      {abierto && (
        <ModalProyecto proyecto={abierto} acento={acento} texto={texto} fondo={fondo} telefono={telefono} onCerrar={() => setAbierto(null)} />
      )}
    </>
  );
}
