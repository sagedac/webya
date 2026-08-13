"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/templates/engine/gsap";

export interface ParallaxProps {
  children: ReactNode;
  /** Fracción de desplazamiento relativa al scroll (0-1). */
  speed?: number;
  className?: string;
}

// Nivel 2/PRO en adelante: desplazamiento continuo atado al scroll (no hay
// estado inicial que ocultar, así que no hay riesgo de FOUC como en
// ScrollReveal — el valor de reposo ya es 0).
export function Parallax({ children, speed = 0.3, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(ref.current, {
          yPercent: speed * -30,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [speed] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
