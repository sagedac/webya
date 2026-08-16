"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, scheduleRefresh } from "@/engine/gsap";

// Extensiones de animación específicas de SAGEDAC (webya.md sección 5: cada
// página puede extender el motor compartido con GSAP directo para un efecto
// propio que no amerita generalizarse todavía — ver
// src/custom/travel-agency/effects.tsx como precedente del patrón, en
// particular la técnica de `RouteLine` con path.getTotalLength() +
// stroke-dashoffset + offsetPath, reutilizada acá para `SelesFlow` con un
// propósito distinto: no una ruta de vuelo, sino el flujo de facturación
// electrónica que Seles presta al resto del ecosistema).
//
// Tres piezas sostienen la firma visual de esta página ("sistema
// radicular" — ver comentario de criterio en Sagedac.tsx):
//   - `NodePop`: el nodo/marcador que "brota" sobre el eje central al
//     entrar en pantalla, para cada proyecto.
//   - `ProjectsTrunk`: el eje/tronco vertical que crece con el scroll
//     (scaleY 0→1, scrubbed) por detrás de los 5 proyectos — la base de la
//     que "nacen las ramas", literal, no decorativa.
//   - `SelesFlow`: el diagrama de líneas que se traza y luego pulsa de
//     forma continua entre Seles y Domiship/Turnova — el momento visual
//     más importante de la página (ver brief).
//
// Nota de la advertencia técnica del brief (bug de ScrollReveal con
// `start: "top 85%"` en contenido garantizado visible sin scroll): ninguna
// de estas tres piezas se usa en el hero (ver Sagedac.tsx, que anima el
// hero con `animate-fade-in-up` de globals.css, CSS puro). Todas las de
// acá viven más abajo en la página, donde SÍ hace falta que el usuario
// haga scroll para verlas por primera vez — el caso de uso correcto para
// ScrollTrigger.

// NodePop — el marcador circular de cada proyecto "brota" sobre el eje con
// un ligero rebote (scale 0.4→1, `back.out`) en vez de la entrada lineal de
// ScrollReveal — refuerza la sensación de que cada proyecto literalmente
// emerge del tronco, no que "aparece" sin más.
export function NodePop({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(ref.current, { opacity: 1, scale: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(ref.current, { opacity: 0, scale: 0.4 });
        gsap.to(ref.current, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay,
          ease: "back.out(2.4)",
          scrollTrigger: { trigger: ref.current, start: "top 82%", toggleActions: "play none none reverse" },
        });
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

// ProjectsTrunk — envuelve los 5 proyectos con un eje vertical que crece
// con el scroll (línea base tenue siempre visible + línea blanca que se
// "llena" por encima, scaleY 0→1 con transformOrigin arriba, atada al
// progreso de scroll del contenedor completo con `scrub`). Es la pieza
// central de la firma visual: SAGEDAC es la base de la que las ramas
// (proyectos) crecen, no un panel que las vigila desde arriba — por eso el
// eje crece hacia ABAJO, desde el nodo del hero hacia cada proyecto, nunca
// al revés.
export function ProjectsTrunk({ children, className }: { children: ReactNode; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(lineRef.current, { scaleY: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top center" });
        gsap.to(lineRef.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: wrapRef.current, start: "top 60%", end: "bottom 75%", scrub: 0.6 },
        });
        document.fonts.ready.then(scheduleRefresh);
      });

      return () => mm.revert();
    },
    { scope: wrapRef, dependencies: [] },
  );

  return (
    <div ref={wrapRef} className={`relative ${className ?? ""}`}>
      <div aria-hidden className="absolute top-0 bottom-0 left-[19px] w-px bg-white/12 sm:left-6" />
      <div ref={lineRef} aria-hidden className="absolute top-0 bottom-0 left-[19px] w-px bg-white/70 sm:left-6" />
      {children}
    </div>
  );
}

// SelesFlow — el momento visual más importante de la página (ver brief):
// dos curvas se trazan desde el nodo de Seles hacia Domiship y Turnova
// (stroke-dashoffset animado con path.getTotalLength(), mismo cálculo real
// que RouteLine en src/custom/travel-agency/effects.tsx), y una vez
// trazadas, un pulso recorre cada curva en bucle suave (offsetPath, mismo
// mecanismo que el avioncito de RouteLine) para transmitir "servicio en
// curso", no un adorno estático — Seles no conecta una vez, presta
// facturación electrónica de forma continua.
export function SelesFlow({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathLeftRef = useRef<SVGPathElement>(null);
  const pathRightRef = useRef<SVGPathElement>(null);
  const dotLeftRef = useRef<SVGCircleElement>(null);
  const dotRightRef = useRef<SVGCircleElement>(null);

  useGSAP(
    () => {
      const left = pathLeftRef.current;
      const right = pathRightRef.current;
      if (!left || !right) return;
      const lenLeft = left.getTotalLength();
      const lenRight = right.getTotalLength();
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([left, right], { strokeDashoffset: 0 });
        gsap.set([dotLeftRef.current, dotRightRef.current], { opacity: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(left, { strokeDasharray: lenLeft, strokeDashoffset: lenLeft });
        gsap.set(right, { strokeDasharray: lenRight, strokeDashoffset: lenRight });
        gsap.set([dotLeftRef.current, dotRightRef.current], { opacity: 0, offsetDistance: "0%" });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: wrapRef.current, start: "top 72%", toggleActions: "play none none reverse" },
        });
        tl.to(left, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" });
        tl.to(right, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, 0.15);
        // Pulso continuo tras el trazo: simula el flujo de facturación
        // electrónica "en curso" que Seles presta a los otros proyectos,
        // no una animación de una sola vez.
        tl.to(dotLeftRef.current, { opacity: 1, offsetDistance: "100%", duration: 1.3, ease: "power1.inOut", repeat: -1, repeatDelay: 0.6 }, 0.9);
        tl.to(dotRightRef.current, { opacity: 1, offsetDistance: "100%", duration: 1.3, ease: "power1.inOut", repeat: -1, repeatDelay: 0.6 }, 1.05);

        return () => {
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: wrapRef, dependencies: [] },
  );

  return (
    <div ref={wrapRef} className={className}>
      <svg viewBox="0 0 200 100" className="h-full w-full overflow-visible" aria-hidden>
        <path ref={pathLeftRef} d="M100,12 C60,12 34,55 20,86" stroke="white" strokeOpacity="0.55" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path ref={pathRightRef} d="M100,12 C140,12 166,55 180,86" stroke="white" strokeOpacity="0.55" strokeWidth="1" fill="none" strokeLinecap="round" />
        <circle ref={dotLeftRef} r="2.4" fill="white" style={{ offsetPath: "path('M100,12 C60,12 34,55 20,86')" }} />
        <circle ref={dotRightRef} r="2.4" fill="white" style={{ offsetPath: "path('M100,12 C140,12 166,55 180,86')" }} />
      </svg>
    </div>
  );
}
