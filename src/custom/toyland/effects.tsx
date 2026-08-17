"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, scheduleRefresh } from "@/engine/gsap";

// Extensiones de animación específicas de ToyLand (mismo criterio que
// src/custom/deluxtravel/effects.tsx, src/custom/jyw-cc/effects.tsx, etc.:
// viven acá porque todavía no tienen un segundo caso de uso confirmado
// fuera de esta página).
//
// Firma visual de esta página (webya.md sección 7, "un elemento firma
// único por landing"): "En la percha" — cada categoría de producto se
// presenta como una funda blister colgada de un gancho de percha, con un
// leve balanceo constante (como si de verdad colgara de un gancho de
// tienda física) — el motivo más genuino de cualquier juguetería real
// (paredes de percha/pegboard llenas de juguetes empacados), no un adorno
// decorativo importado de otro rubro. Se combina con textura de
// perforaciones tipo pegboard (CSS puro, sin JS) y ráfagas tipo cómic
// (`PopIn`) para el resto de la energía "anime/manga".

// Balanceo idle continuo — reposo ±rotación, como una funda colgada real
// respondiendo a que alguien pasó cerca del gancho. Nunca se detiene
// (repeat: -1), a diferencia de ScrollReveal que dispara una sola vez.
export function HookSway({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(ref.current, { rotate: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(ref.current, { transformOrigin: "50% -6px" });
        gsap.fromTo(
          ref.current,
          { rotate: -1.8 },
          { rotate: 1.8, duration: 2.1, delay, ease: "sine.inOut", repeat: -1, yoyo: true },
        );
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [delay] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Entrada tipo "pop" de cómic (escala + leve giro con rebote exagerado) —
// más juguetón que el fade/slide de ScrollReveal, reservado para títulos y
// ráfagas decorativas.
export function PopIn({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(ref.current, { opacity: 1, scale: 1, rotate: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(ref.current, { opacity: 0, scale: 0.55, rotate: -10 });
        gsap.to(ref.current, {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.65,
          delay,
          ease: "back.out(2.2)",
          scrollTrigger: { trigger: ref.current, start: "top 88%", toggleActions: "play none none reverse" },
        });
        document.fonts.ready.then(scheduleRefresh);
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [delay] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Gancho de percha — el trazo de metal curvo del que "cuelga" cada funda
// blister, dibujado en SVG (no una imagen). `tono` es el color del trazo.
export function GanchoPercha({ tono, className }: { tono: string; className?: string }) {
  return (
    <svg viewBox="0 0 40 34" className={className} aria-hidden>
      <path d="M20 2 C11 2 8 9 13 13 C17 16 23 16 27 13 C32 9 29 2 20 2" fill="none" stroke={tono} strokeWidth={3} strokeLinecap="round" />
      <line x1="20" y1="14" x2="20" y2="30" stroke={tono} strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}
