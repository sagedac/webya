"use client";

import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, scheduleRefresh } from "@/engine/gsap";

// Extensión propia de esta página (mismo criterio que
// src/custom/deluxtravel/effects.tsx: vive acá porque todavía no tiene un
// segundo caso de uso confirmado fuera de la landing de 26st). Contador
// numérico para la franja de cifras del hero — prefix/suffix en vez de
// asumir formato, para poder mostrar "$49" y "4" con el mismo componente.
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
  style,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (ref.current) ref.current.textContent = `${prefix}${to}${suffix}`;
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: to,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            if (ref.current) ref.current.textContent = `${prefix}${Math.round(counter.val)}${suffix}`;
          },
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        });
        document.fonts.ready.then(scheduleRefresh);
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [to, prefix, suffix, duration] },
  );

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}0{suffix}
    </span>
  );
}
