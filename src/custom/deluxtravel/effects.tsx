"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/engine/gsap";
import type { Testimonio } from "@/lib/types";

// Extensiones de animación específicas de DeluxTravel (webya.md sección 5:
// "extendiéndolo con GSAP directo si hace falta un efecto que el motor no
// cubre todavía, documentando por qué"). Viven acá, no en
// src/templates/engine/, porque todavía no tienen un segundo caso de uso
// confirmado fuera de esta página — si otro tenant cinematográfico las
// necesita, ese es el momento de promoverlas al motor compartido.
//
// Pedido explícito del dueño del proyecto para esta página: cada bloque
// (100vh) tiene su propio tratamiento de animación, no el mismo repetido.
// ScrollReveal (fade/slide) y Parallax (traslación en scroll) del motor ya
// cubren dos de esos tratamientos — acá se agregan los que faltan: zoom
// tipo Ken Burns (escala), paneo horizontal, revelado por wipe/clip-path,
// una "postal" que entra flotando con rotación, texto por palabras, y
// contador numérico. Todas respetan prefers-reduced-motion con el mismo
// patrón gsap.matchMedia() que ScrollReveal/Parallax.

interface BgImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

// Ken Burns: zoom lento y continuo, atado al progreso de scroll de la
// sección (misma técnica de scrub que Parallax, pero animando escala en
// vez de traslación) — para los bloques donde el "wow" viene de acercarse
// lentamente a la foto (hero, maleta empacándose, asesor saludando).
export function KenBurnsBg({ src, alt, className, priority }: BgImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ref.current,
          { scale: 1 },
          {
            scale: 1.18,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [] },
  );

  return (
    <div ref={ref} className={`absolute inset-0 ${className ?? ""}`} style={{ willChange: "transform" }}>
      <Image src={src} alt={alt} fill priority={priority} sizes="100vw" className="object-cover" />
    </div>
  );
}

// Paneo horizontal lento atado al scroll — variación deliberada del
// parallax vertical del motor, para que el bloque de Buenos Aires (única
// ciudad sin mar entre los 4 destinos) se distinga por movimiento, no solo
// por foto.
export function PannerBg({ src, alt, className, priority }: BgImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ref.current,
          { xPercent: 2, scale: 1.15 },
          {
            xPercent: -10,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [] },
  );

  return (
    <div ref={ref} className={`absolute inset-0 ${className ?? ""}`} style={{ willChange: "transform" }}>
      <Image src={src} alt={alt} fill priority={priority} sizes="100vw" className="object-cover" />
    </div>
  );
}

// Revelado por wipe (clip-path inset, izquierda a derecha) al entrar en
// viewport — mecánica discreta (play/reverse una vez al cruzar el umbral),
// distinta de los scrubs continuos de arriba. Para San Andrés, el destino
// de playa más "postal" de los 4, se guarda este efecto como cierre de la
// tanda de destinos.
export function ClipRevealBg({ src, alt, className, priority }: BgImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(ref.current, { clipPath: "inset(0% 0% 0% 0%)" });
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ref.current,
          { clipPath: "inset(0% 100% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.3,
            ease: "power3.inOut",
            scrollTrigger: { trigger: ref.current, start: "top 70%", toggleActions: "play none none reverse" },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [] },
  );

  return (
    <div ref={ref} className={`absolute inset-0 ${className ?? ""}`}>
      <Image src={src} alt={alt} fill priority={priority} sizes="100vw" className="object-cover" />
    </div>
  );
}

// "Postal" con marco blanco que entra flotando con rotación leve y queda
// respirando en bucle — usado para insertar la foto real local del Cristo
// Redentor sobre el fondo de playa de Río, como si fuera una foto física
// pegada sobre el paisaje. Rotación no la cubre ScrollReveal (solo
// opacidad/y/escala), de ahí la extensión.
export function PostcardFloat({ src, alt, className }: BgImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(ref.current, { opacity: 1, y: 0, rotate: -3, scale: 1 });
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(ref.current, { opacity: 0, y: 70, rotate: -12, scale: 0.88 });
        gsap.to(ref.current, {
          opacity: 1,
          y: 0,
          rotate: -3,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none reverse" },
        });
        const idle = gsap.to(ref.current, { y: "-=12", rotate: -1, duration: 2.8, delay: 1.3, repeat: -1, yoyo: true, ease: "sine.inOut" });
        return () => {
          idle.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [] },
  );

  return (
    <div ref={ref} className={`w-48 rounded-xl border-4 border-white bg-white p-1.5 shadow-2xl sm:w-64 ${className ?? ""}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
        <Image src={src} alt={alt} fill sizes="256px" className="object-cover" />
      </div>
    </div>
  );
}

// Texto revelado palabra por palabra (stagger) — para el titular del hero.
// ScrollReveal anima el bloque completo de una vez; acá cada palabra tiene
// su propio retraso, un tratamiento más "cinematográfico" reservado para
// el titular principal, no repetido en el resto de la página.
export function WordReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const targets = ref.current?.querySelectorAll("[data-word]");
      if (!targets) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(targets, { opacity: 1, y: 0 });
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(targets, { opacity: 0, y: 24 });
        gsap.to(targets, { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, delay, ease: "power2.out" });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [text, delay] },
  );

  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} data-word className="inline-block">
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

// Contador numérico al entrar en viewport — signature del bloque de
// cifras. decimals se infiere del propio número (4.8 -> 1 decimal, 1200 ->
// 0) para no forzar un campo nuevo en tenant_content.cifras.
export function CountUp({ to, suffix = "", duration = 1.8, className }: { to: number; suffix?: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const decimals = Number.isInteger(to) ? 0 : 1;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (ref.current) ref.current.textContent = `${to.toFixed(decimals)}${suffix}`;
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: to,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            if (ref.current) ref.current.textContent = `${counter.val.toFixed(decimals)}${suffix}`;
          },
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [to, suffix, duration] },
  );

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}

// Carrusel de testimonios por tiempo (no por scroll) — mecánica
// deliberadamente distinta a todo lo demás en la página (todo lo demás
// reacciona a scroll; esto reacciona al reloj, como una vitrina que sigue
// "viva" aunque el usuario deje de scrollear). Reutiliza la keyframe
// .animate-fade-in-up ya definida en globals.css (Nivel 1/START) en vez de
// escribir una nueva animación CSS o sumar GSAP — remontar el nodo vía
// `key` la vuelve a disparar en cada cambio, sin JS de animación extra.
export function TestimonialCycle({ testimonios, acento }: { testimonios: Testimonio[]; acento: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonios.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonios.length), 5000);
    return () => clearInterval(id);
  }, [testimonios.length]);

  const t = testimonios[index];
  if (!t) return null;

  return (
    <div key={index} className="animate-fade-in-up max-w-md">
      <p className="text-lg leading-relaxed text-[#f1ece0]/90">&ldquo;{t.texto}&rdquo;</p>
      <p className="mt-3 text-sm font-medium tracking-wide" style={{ color: acento }}>
        {t.autor} · {"★".repeat(t.rating)}
      </p>
    </div>
  );
}
