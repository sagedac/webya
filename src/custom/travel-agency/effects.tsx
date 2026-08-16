"use client";

import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/engine/gsap";

// Extensiones de animación específicas de Travel Agency (webya.md sección 5:
// cada página puede extender el motor compartido con GSAP directo para un
// efecto propio que no amerita generalizarse todavía — ver
// src/custom/deluxtravel/effects.tsx y src/custom/jmj/JMJPainting.tsx como
// precedente del patrón). Las tres piezas de acá sostienen la firma visual
// de esta página ("pase de embarque" — ver comentario de criterio de nicho
// en TravelAgency.tsx): un titular que se arma letra por letra como un
// tablero de salidas de aeropuerto (Solari board / split-flap), una ruta de
// vuelo punteada que se "traza" con el scroll entre origen y destino, y un
// sello de tinta que cae de golpe como un sello de aduana/pasaporte.

// FlipReveal — titular tipo tablero de salidas (split-flap): cada carácter
// entra con un giro en el eje X (como si la tarjeta del tablero volteara
// hasta mostrar la letra), no una traducción simple como WordReveal de
// DeluxTravel. Es la pieza más "firma" de las tres: ningún otro tenant del
// proyecto usa un flip 3D por carácter todavía.
export function FlipReveal({ text, className, delay = 0, stagger = 0.028 }: { text: string; className?: string; delay?: number; stagger?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Palabras completas como unidad de wrap (cada una un inline-block que
  // contiene sus propios caracteres animables) en vez de aplanar todo el
  // texto en spans de un solo carácter sueltos — con caracteres sueltos el
  // navegador puede cortar la línea en cualquier punto (incluida una coma
  // suelta al inicio de línea, o una palabra a la mitad), que es justo lo
  // que pasó en la primera versión de este componente ("Sudamérica" seguido
  // de una "," huérfana en la línea siguiente). Agrupar por palabra
  // garantiza que el salto de línea solo ocurra en un espacio real.
  const words = text.split(" ");

  useGSAP(
    () => {
      const targets = ref.current?.querySelectorAll("[data-char]");
      if (!targets) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(targets, { opacity: 1, rotateX: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(targets, { opacity: 0, rotateX: -100, transformPerspective: 420, transformOrigin: "50% 50%" });
        gsap.to(targets, { opacity: 1, rotateX: 0, duration: 0.55, stagger, delay, ease: "power2.out" });
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [text, delay, stagger] },
  );

  return (
    <span ref={ref} className={className} style={{ perspective: 420 }}>
      {words.map((word, wi) => (
        // El espacio queda como nodo de texto HERMANO (fuera del span
        // whitespace-nowrap), no dentro — así el navegador conserva el
        // punto de quiebre de línea normal ahí (como cualquier texto con
        // espacios), mientras que `whitespace-nowrap` en el span de la
        // palabra le impide partirse a la mitad entre sus propios
        // caracteres animables.
        <Fragment key={`${word}-${wi}`}>
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((c, i) => (
              <span key={`${c}-${i}`} data-char className="inline-block">
                {c}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </span>
  );
}

// RouteLine — traza punteada entre el código de origen y el de destino de
// cada pase de embarque, dibujada con el progreso de scroll (stroke-dashoffset
// de 100% a 0), con un avioncito que recorre la línea. La ruta real de vuelo
// es el dato más literal de una agencia de viajes; una línea recta sin
// dibujarse hubiera sido decorativa, esta se siente "trazada" al entrar en
// pantalla.
export function RouteLine({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;
      const length = path.getTotalLength();
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(path, { strokeDashoffset: 0 });
        gsap.set(planeRef.current, { offsetDistance: "100%" });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.set(planeRef.current, { offsetDistance: "0%", opacity: 0 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: wrapRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        });
        tl.to(path, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" });
        tl.to(planeRef.current, { opacity: 1, duration: 0.15 }, 0.1);
        tl.to(planeRef.current, { offsetDistance: "100%", duration: 1.1, ease: "power2.inOut" }, 0);
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
      <svg viewBox="0 0 200 16" preserveAspectRatio="none" className="h-4 w-full overflow-visible">
        <path ref={pathRef} d="M4 8 H196" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 5" strokeLinecap="round" fill="none" opacity="0.85" />
        <g ref={planeRef} style={{ offsetPath: "path('M4 8 H196')", offsetRotate: "0deg" }}>
          <path d="M-5 0 L5 0 L2 -3 L-2 -3 Z M-5 0 L5 0 L2 3 L-2 3 Z" fill="currentColor" transform="rotate(90)" />
        </g>
      </svg>
    </div>
  );
}

// StampReveal — sello de tinta que "cae" sobre la tarjeta (escala desde
// grande + rotación exagerada hasta el tamaño y ángulo final, con rebote
// `back.out`) — mismo espíritu que un sello de aduana o de pasaporte
// estampándose de golpe, distinto de la entrada suave de ScrollReveal.
export function StampReveal({
  children,
  className,
  rotate = -10,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(ref.current, { opacity: 1, scale: 1, rotate });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(ref.current, { opacity: 0, scale: 2.4, rotate: rotate * 2.5 });
        gsap.to(ref.current, {
          opacity: 1,
          scale: 1,
          rotate,
          duration: 0.6,
          delay,
          ease: "back.out(2.2)",
          scrollTrigger: { trigger: ref.current, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [rotate, delay] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
