"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/engine/gsap";

// Extensiones de animación específicas de Estudio de Arquitectura (mismo
// criterio que src/custom/deluxtravel/effects.tsx, src/custom/jyw-cc/effects.tsx,
// etc.: viven acá porque todavía no tienen un segundo caso de uso confirmado
// fuera de esta página — si otro tenant técnico/editorial las necesita, ese
// es el momento de promoverlas a src/engine/).
//
// Firma visual de esta página (webya.md sección 7, "un elemento firma único
// por landing"): "Acotado" — la línea de cota (dimension line) de un plano
// arquitectónico real: una línea fina con flechas en los extremos y una
// etiqueta central, que se "traza" con el scroll en vez de aparecer de
// golpe. Es el vocabulario visual más genuino de la profesión (todo plano
// técnico acota distancias así) — no un adorno importado de otro rubro.

export function CotaDivider({ label, tono, fondo, className }: { label?: string; tono: string; fondo: string; className?: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(pathRef.current, { strokeDashoffset: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const length = pathRef.current?.getTotalLength() ?? 0;
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: wrapRef.current, start: "top 88%", end: "bottom 65%", scrub: true },
        });
      });

      return () => mm.revert();
    },
    { scope: wrapRef, dependencies: [] },
  );

  return (
    <div ref={wrapRef} className={`relative mx-auto flex max-w-xl items-center justify-center px-6 ${className ?? ""}`}>
      <svg viewBox="0 0 400 16" preserveAspectRatio="none" className="h-4 w-full" aria-hidden>
        <path
          ref={pathRef}
          d="M6 8 L15 3 M6 8 L15 13 M6 8 H394 M385 3 L394 8 L385 13"
          fill="none"
          stroke={tono}
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label && (
        <span
          className="absolute px-3 text-[10px] font-medium tracking-[0.3em] uppercase"
          style={{ color: tono, backgroundColor: fondo }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// Marcas de esquina tipo "registro de imprenta/plano técnico" — decoran el
// marco de cada ficha de proyecto (ver ProyectosGaleria.tsx) sin necesitar
// SVG animado; son estáticas a propósito (el movimiento ya lo aporta
// CotaDivider y el hover de la propia ficha).
export function MarcasEsquina({ tono }: { tono: string }) {
  const base = "absolute h-3 w-3";
  return (
    <>
      <span aria-hidden className={`${base} top-2 left-2 border-t border-l`} style={{ borderColor: tono }} />
      <span aria-hidden className={`${base} top-2 right-2 border-t border-r`} style={{ borderColor: tono }} />
      <span aria-hidden className={`${base} bottom-2 left-2 border-b border-l`} style={{ borderColor: tono }} />
      <span aria-hidden className={`${base} right-2 bottom-2 border-r border-b`} style={{ borderColor: tono }} />
    </>
  );
}
