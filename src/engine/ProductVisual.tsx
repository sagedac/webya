"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/engine/gsap";

export interface ProductVisualProps {
  src: string;
  alt: string;
  className?: string;
  /** "lg" (default, sin cambios) = el tratamiento de siempre a ancho completo.
   * "md" = versión más angosta para usar dentro de un layout de columnas
   * (ej. dos productos flanqueando texto) sin perder ninguno de los efectos. */
  size?: "lg" | "md";
}

const STAGE_SIZE_CLASSES: Record<"lg" | "md", string> = {
  lg: "w-80 sm:w-[28rem] lg:w-[600px]",
  md: "w-56 sm:w-64 lg:w-72",
};

// Sensación de producto flotando con fotos reales, sin modelo 3D —
// parallax de scroll + flotación idle + sombra/pedestal + glow ambiental
// con el color de acento de la marca + tilt y escala al pasar el mouse.
// Genérico a propósito: no asume rubro, cualquier página puede usarlo con
// cualquier foto de producto con fondo limpio/aislado.
//
// Terreno preparado para 3D real: `stageRef` de abajo es el "escenario"
// (contenedor de dimensiones fijas) que el día de mañana recibiría un
// <model-viewer> (Google) en vez de <Image> — mismo contenedor, mismas
// dimensiones, mismo lugar en el flujo de la sección, sin rehacer layout.
export function ProductVisual({ src, alt, className, size = "lg" }: ProductVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null); // parallax de scroll
  const stageRef = useRef<HTMLDivElement>(null); // flotación idle + tilt/escala al hover — acá iría <model-viewer>
  const glowRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Parallax sutil: la sección se desplaza a una velocidad distinta
        // al resto del contenido mientras se hace scroll.
        gsap.to(containerRef.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: containerRef.current, start: "top bottom", end: "bottom top", scrub: true },
        });

        // Flotación idle + pedestal + glow respirando, todo en sincro.
        const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut", duration: 2.4 } });
        tl.to(stageRef.current, { y: -14 }, 0);
        tl.to(shadowRef.current, { scaleX: 0.8, opacity: 0.4 }, 0);
        tl.to(glowRef.current, { opacity: 0.5, scale: 1.06 }, 0);

        return () => {
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [] },
  );

  // Tilt + escala + intensidad del glow al pasar el mouse: independiente
  // del matchMedia de arriba porque solo se dispara con pointermove real
  // (no pasa nada en touch), y se resetea al salir.
  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - bounds.left) / bounds.width - 0.5;
    const relY = (e.clientY - bounds.top) / bounds.height - 0.5;
    gsap.to(stageRef.current, {
      rotateY: relX * 14,
      rotateX: relY * -14,
      scale: 1.04,
      transformPerspective: 800,
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(glowRef.current, { opacity: 0.55, duration: 0.4 });
  }

  function handlePointerLeave() {
    gsap.to(stageRef.current, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.6, ease: "power2.out" });
    gsap.to(glowRef.current, { opacity: 0.3, duration: 0.6 });
  }

  return (
    <div ref={containerRef} className={`relative mx-auto max-w-2xl ${className ?? ""}`}>
      <div className="relative flex items-center justify-center" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
        {/* Glow — color de marca del tenant (--tenant-acento), nunca
            hardcodeado. Sin z-index negativo (ver nota de PlantillaCarniceriaPizarra.tsx) —
            va primero en el DOM, pinta detrás de todo lo que sigue. */}
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,var(--tenant-acento)_0%,transparent_70%)] opacity-30 blur-3xl"
        />

        {/* Escenario del producto. Marco delgado con el color de acento +
            marcas de esquina tipo "objeto en exhibición" — llenan la
            composición sin competir con el producto.

            aspect-[3/2] en vez de cuadrado: la mayoría de fotos de
            producto (esta incluida — 960x640, 3:2) son apaisadas, y un
            marco cuadrado con object-contain deja mucho margen muerto
            arriba/abajo cuando la foto es más ancha que alta (medido en
            el demo real: con marco cuadrado y foto 3:2, la imagen
            terminaba ocupando ~52% del alto del marco, no el 78%
            nominal). No es data-driven por foto (no guardamos
            ancho/alto de cada una), pero 3:2 es un default razonable
            para fotografía de producto en general. */}
        <div
          ref={stageRef}
          className={`relative flex aspect-[3/2] items-center justify-center rounded-3xl border border-[var(--tenant-acento)]/25 bg-gradient-to-b from-white/[0.04] to-transparent ${STAGE_SIZE_CLASSES[size]}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          <span aria-hidden className="absolute top-3 left-3 h-6 w-6 rounded-tl-lg border-t-2 border-l-2 border-[var(--tenant-acento)]/50" />
          <span aria-hidden className="absolute top-3 right-3 h-6 w-6 rounded-tr-lg border-t-2 border-r-2 border-[var(--tenant-acento)]/50" />
          <span aria-hidden className="absolute bottom-3 left-3 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-[var(--tenant-acento)]/50" />
          <span aria-hidden className="absolute right-3 bottom-3 h-6 w-6 rounded-br-lg border-r-2 border-b-2 border-[var(--tenant-acento)]/50" />

          <Image
            src={src}
            alt={alt}
            width={600}
            height={400}
            className="h-[92%] w-[92%] object-contain drop-shadow-[0_24px_36px_rgba(0,0,0,0.45)]"
          />
        </div>

        {/* Pedestal: elipse plana debajo, sugiere superficie de exhibición
            en vez de "flotando en el vacío". Se achica/desvanece en sincro
            con la flotación idle de arriba. */}
        <div ref={shadowRef} aria-hidden className="absolute bottom-2 h-8 w-56 rounded-full bg-black/50 blur-xl sm:w-72" />
      </div>
    </div>
  );
}
