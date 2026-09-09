"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/engine/gsap";
import { CheckCircle2, ChefHat, Bike, PackageCheck, Store, Home as HomeIcon, Clock } from "lucide-react";

// Extensiones de animación específicas de FoodGo (mismo criterio que
// src/custom/toyland/effects.tsx, src/custom/travel-agency/effects.tsx,
// etc.: viven acá porque no tienen todavía un segundo caso de uso
// confirmado fuera de esta página).
//
// Firma visual de esta página (webya.md sección 7, "un elemento firma
// único por landing"): "Ruta en vivo" — una tarjeta de seguimiento de
// pedido en tiempo real (stepper de 4 estados + un mapa mini con una ruta
// punteada que se traza y un repartidor que la recorre + un ETA que cuenta
// regresivamente) en bucle infinito. No es un adorno importado de otro
// rubro: el mapa de seguimiento en vivo con el repartidor moviéndose es
// justo el momento de mayor confianza de cualquier app de delivery real
// (Rappi/Uber Eats/PedidosYa lo usan como pieza central de su propio
// marketing) — acá se construye desde cero con SVG + GSAP, no como
// captura de pantalla de una app que todavía no existe.

const FASES = [
  { label: "Pedido confirmado", Icono: CheckCircle2 },
  { label: "Preparando tu pedido", Icono: ChefHat },
  { label: "En camino", Icono: Bike },
  { label: "¡Entregado!", Icono: PackageCheck },
] as const;

const DURACION_FASE_MS = 2400;
const RUTA_D = "M20 58 C 90 8, 190 8, 272 50";

export function LiveTrackingCard({ acento, className }: { acento: string; className?: string }) {
  const [fase, setFase] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const scooterRef = useRef<SVGGElement>(null);
  const etaRef = useRef<HTMLSpanElement>(null);

  // Bucle de fases — reloj simple (setInterval), no GSAP: solo hay 4
  // estados discretos que rotar, un timeline completo sería sobre-ingeniería
  // para esto. Corre siempre (incluso con prefers-reduced-motion): ciclar un
  // texto/ícono y una barra de progreso angosta no es el tipo de movimiento
  // que esa preferencia busca evitar (paneo, parallax, elementos grandes
  // desplazándose) — lo que SÍ se apaga bajo esa preferencia es el trazo de
  // la ruta y el repartidor deslizándose (ver useGSAP, gsap.matchMedia).
  // setFase solo se llama desde el callback del temporizador (patrón de
  // suscripción recomendado), nunca de forma síncrona en el cuerpo del
  // efecto.
  useEffect(() => {
    const id = setInterval(() => setFase((f) => (f + 1) % FASES.length), DURACION_FASE_MS);
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;
      const length = path.getTotalLength();
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 });
        gsap.set(scooterRef.current, { offsetDistance: "62%", opacity: 1 });
        if (etaRef.current) etaRef.current.textContent = "12 min";
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.set(scooterRef.current, { offsetDistance: "0%", opacity: 0 });

        if (fase === 2) {
          const dur = DURACION_FASE_MS / 1000;
          gsap.to(path, { strokeDashoffset: 0, duration: dur, ease: "power1.inOut" });
          gsap.to(scooterRef.current, { opacity: 1, duration: 0.2 });
          gsap.to(scooterRef.current, { offsetDistance: "100%", duration: dur, ease: "power1.inOut" });
          const eta = { val: 12 };
          gsap.to(eta, {
            val: 1,
            duration: dur,
            ease: "power1.in",
            onUpdate: () => {
              if (etaRef.current) etaRef.current.textContent = `${Math.ceil(eta.val)} min`;
            },
          });
        } else if (fase === 3) {
          gsap.set(path, { strokeDashoffset: 0 });
          gsap.set(scooterRef.current, { offsetDistance: "100%", opacity: 1 });
          if (etaRef.current) etaRef.current.textContent = "¡Llegó!";
        } else if (etaRef.current) {
          etaRef.current.textContent = fase === 0 ? "18 min" : "15 min";
        }
      });

      return () => mm.revert();
    },
    { scope: wrapRef, dependencies: [fase] },
  );

  const progresoPct = (fase / (FASES.length - 1)) * 100;

  return (
    <div ref={wrapRef} className={className}>
      <div className="flex items-center justify-between gap-3 border-b border-black/5 pb-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[#241412]">Pizzería del Barrio</p>
          <p className="text-xs text-[#241412]/50">Pedido #FG-2481</p>
        </div>
        <span className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold text-white" style={{ backgroundColor: acento }}>
          {FASES[fase].label}
        </span>
      </div>

      <div className="relative my-3 h-16 w-full">
        <svg viewBox="0 0 292 66" className="h-full w-full overflow-visible" aria-hidden>
          <path d={RUTA_D} stroke={acento} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" ref={pathRef} />
          <path d={RUTA_D} stroke="#241412" strokeOpacity="0.08" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <g ref={scooterRef} style={{ offsetPath: `path('${RUTA_D}')`, offsetRotate: "0deg" }}>
            <circle r="9" fill={acento} />
            <g transform="translate(-5,-5)" stroke="white" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 7 L4 4 L7 4" />
              <circle cx="2.2" cy="8.5" r="1.6" fill="white" stroke="none" />
              <circle cx="7.8" cy="8.5" r="1.6" fill="white" stroke="none" />
            </g>
          </g>
        </svg>
        <span className="absolute top-0 left-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#241412] text-white">
          <Store className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
        </span>
        <span className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#241412] text-white">
          <HomeIcon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
        </span>
      </div>

      <div className="mb-3 flex items-center gap-1.5 text-sm font-bold" style={{ color: acento }}>
        <Clock className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        <span ref={etaRef}>18 min</span>
        <span className="font-medium text-[#241412]/50">hasta tu puerta</span>
      </div>

      <div className="relative mb-2 h-1 w-full rounded-full bg-black/10">
        <div className="h-1 rounded-full transition-[width] duration-700 ease-out" style={{ width: `${progresoPct}%`, backgroundColor: acento }} />
      </div>
      <div className="flex justify-between">
        {FASES.map(({ label, Icono }, i) => (
          <div key={label} className="flex flex-col items-center gap-1" style={{ width: "23%" }}>
            <Icono className="h-4 w-4" strokeWidth={2.5} style={{ color: i <= fase ? acento : "#24141230" }} aria-hidden />
          </div>
        ))}
      </div>
    </div>
  );
}

// RouteDivider — línea punteada horizontal que se traza una sola vez al
// entrar en pantalla (mismo `stroke-dashoffset` que RouteLine de
// travel-agency/effects.tsx), usada entre los 3 pasos de "Cómo funciona"
// para que la firma de "ruta" del hero se sienta como el mismo lenguaje
// visual en toda la página, no un motivo aislado del hero.
export function RouteDivider({ color, className }: { color: string; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;
      const length = path.getTotalLength();
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(path, { strokeDashoffset: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: "power2.inOut",
          scrollTrigger: { trigger: wrapRef.current, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });

      return () => mm.revert();
    },
    { scope: wrapRef, dependencies: [] },
  );

  return (
    <div ref={wrapRef} className={className}>
      <svg viewBox="0 0 100 8" preserveAspectRatio="none" className="h-2 w-full overflow-visible">
        <path ref={pathRef} d="M2 4 H98" stroke={color} strokeWidth="2" strokeDasharray="1 6" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

// CountUp — mismo patrón ya usado en deluxtravel/sagedac/travel-agency
// (contador que interpola un proxy numérico con GSAP y escribe el texto
// directo por ref, sin re-render de React); no está promovido a
// src/engine/ todavía porque cada tenant lo usa con pequeñas variaciones.
export function CountUp({ to, prefijo = "", sufijo = "", duration = 1.6, className }: { to: number; prefijo?: string; sufijo?: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const decimals = Number.isInteger(to) ? 0 : 1;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (ref.current) ref.current.textContent = `${prefijo}${to.toFixed(decimals)}${sufijo}`;
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: to,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            if (ref.current) ref.current.textContent = `${prefijo}${counter.val.toFixed(decimals)}${sufijo}`;
          },
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [to, prefijo, sufijo, duration] },
  );

  return (
    <span ref={ref} className={className}>
      {prefijo}0{sufijo}
    </span>
  );
}
