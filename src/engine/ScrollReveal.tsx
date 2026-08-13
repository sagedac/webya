"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/engine/gsap";

export interface ScrollRevealProps {
  children: ReactNode;
  /** Distancia en px desde la que entra el elemento. */
  y?: number;
  /** Escala inicial (ej. 0.96 para un leve scale-in). Sin especificar, no anima escala — compatible con todo lo que ya usa ScrollReveal. */
  scale?: number;
  /** Retraso en segundos, útil para escalonar varios ScrollReveal seguidos. */
  delay?: number;
  duration?: number;
  /** Umbral de ScrollTrigger para disparar la animación. */
  start?: string;
  className?: string;
}

// Fade + slide-in (y opcional scale-in) al entrar en viewport. El estado oculto inicial se fija solo
// vía gsap.set() dentro del efecto, nunca como clase en el JSX — así el
// HTML servido por Next siempre muestra el contenido visible, con o sin
// JS. La animación es una mejora progresiva, no una condición para ver el
// contenido.
export function ScrollReveal({ children, y = 24, scale, delay = 0, duration = 0.6, start = "top 85%", className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(ref.current, { opacity: 1, y: 0, scale: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(ref.current, { opacity: 0, y, ...(scale !== undefined ? { scale } : {}) });
        gsap.to(ref.current, {
          opacity: 1,
          y: 0,
          ...(scale !== undefined ? { scale: 1 } : {}),
          duration,
          delay,
          ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start, toggleActions: "play none none reverse" },
        });
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [y, scale, delay, duration, start] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
