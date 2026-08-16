"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/engine/gsap";

// Extensiones de animación específicas de JYW CC (mismo criterio que
// src/custom/travel-agency/effects.tsx y src/custom/moonvet/effects.tsx:
// viven acá, no en src/engine/, porque todavía no tienen un segundo caso de
// uso confirmado fuera de esta página). Las dos piezas de acá sostienen la
// firma visual "Sello de Ley" de esta página (ver comentario de criterio de
// nicho en JYWCC.tsx): un sello de orfebre que se "presiona" sobre la
// pieza/tarjeta al entrar en pantalla, y una cadena de eslabones que se
// arma eslabón por eslabón como divisor entre secciones.

// SelloPress — simula un sello de orfebre presionándose sobre metal: el
// medallón entra con una caída corta (y negativo -> 0) + un settle rápido
// de escala (power3.out, sin rebote exagerado — un sello real no rebota),
// y en el mismo instante se dispara un anillo de "onda de impacto"
// (ringRef) que se expande y se desvanece, como la marca que deja la
// presión al levantar el sello. Distinto del rebote elástico de
// StampReveal (src/custom/travel-agency/effects.tsx, sello de tinta
// cayendo con rotación exagerada) — acá no hay rotación ni caída grande,
// es una presión corta y seca, más cercana a un troquel que a un sello de
// aduana.
export function SelloPress({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(wrapRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(ringRef.current, { opacity: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(wrapRef.current, { opacity: 0, scale: 1.5, y: -8 });
        gsap.set(ringRef.current, { opacity: 0, scale: 1 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: wrapRef.current, start: "top 88%", toggleActions: "play none none reverse" },
        });
        tl.to(wrapRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.4, delay, ease: "power3.out" });
        tl.fromTo(ringRef.current, { opacity: 0.6, scale: 1 }, { opacity: 0, scale: 1.85, duration: 0.5, ease: "power2.out" }, "<");

        return () => {
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: wrapRef, dependencies: [delay] },
  );

  return (
    <div ref={wrapRef} className={`relative inline-flex ${className ?? ""}`}>
      <span aria-hidden ref={ringRef} className="pointer-events-none absolute inset-0 rounded-full border-2" style={{ borderColor: "currentColor" }} />
      {children}
    </div>
  );
}

// ChainDivider — divisor de eslabones (óvalos alternados en horizontal y
// vertical, como una cadena real vista de perfil) que se "arma" eslabón por
// eslabón con el scroll: cada eslabón entra con un stagger corto y un
// rebote leve (back.out), como si se fueran enganchando uno detrás de
// otro. Ligado genuinamente al negocio (cadenas es una de las categorías
// reales de producto, no un adorno importado de otra página) — a
// diferencia de la "cinta métrica" de JMJ o el "pase de embarque" de
// Travel Agency, acá el divisor y el elemento firma (sello de orfebre) son
// dos piezas del mismo mundo, no dos motivos sueltos.
export function ChainDivider({ tono, className, count = 26 }: { tono: string; className?: string; count?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const links = ref.current?.querySelectorAll<HTMLSpanElement>("[data-link]");
      if (!links || links.length === 0) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(links, { opacity: 1, scale: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(links, { opacity: 0, scale: 0.15 });
        gsap.to(links, {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          stagger: 0.02,
          ease: "back.out(2.6)",
          scrollTrigger: { trigger: ref.current, start: "top 90%", toggleActions: "play none none reverse" },
        });
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [count] },
  );

  return (
    <div ref={ref} aria-hidden className={`flex items-center justify-center overflow-hidden ${className ?? ""}`}>
      <div className="flex">
        {Array.from({ length: count }).map((_, i) => (
          // El giro de cada eslabón (horizontal/vertical alternado) vive en
          // el div contenedor, ESTÁTICO — GSAP solo anima opacity/scale del
          // <span data-link> interior, así los dos transforms nunca compiten
          // por la misma propiedad del mismo elemento.
          <div key={i} className="-ml-[3px] first:ml-0" style={{ transform: i % 2 === 0 ? "rotate(0deg)" : "rotate(90deg)" }}>
            <span data-link className="block h-4 w-2.5 rounded-full border-2" style={{ borderColor: tono }} />
          </div>
        ))}
      </div>
    </div>
  );
}
