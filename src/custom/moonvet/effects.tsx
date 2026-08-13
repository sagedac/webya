"use client";

import { useSyncExternalStore } from "react";

// Extensiones específicas de Moonvet (mismo criterio que
// src/custom/deluxtravel/effects.tsx: viven acá, no en src/engine/, porque
// todavía no tienen un segundo caso de uso confirmado fuera de esta
// página). Ambas usan useSyncExternalStore (no useEffect+setState, que el
// linter del proyecto marca como anti-patrón de cascading renders) para
// leer el reloj real del visitante: `getServerSnapshot` devuelve null (así
// el HTML servido por Next, generado en build vía generateStaticParams,
// nunca muestra una hora/fase lunar "congelada" del momento del build) y
// `getSnapshot` calcula el valor real una vez hidratado en el cliente.

const FASES_LUNA = [
  "luna nueva",
  "luna creciente",
  "cuarto creciente",
  "gibosa creciente",
  "luna llena",
  "gibosa menguante",
  "cuarto menguante",
  "luna menguante",
];

// Cálculo aproximado de fase lunar (ciclo sinódico de 29.53 días desde una
// luna nueva conocida, 6 de enero de 2000). No pretende precisión
// astronómica — es un detalle de marca ("esta noche: luna llena"), no un
// dato que el negocio deba operar. Documentado acá para quien lo audite.
function calcularFaseLunar(fecha: Date): string {
  const sinodico = 29.53058867;
  const lunaNuevaConocidaUTC = Date.UTC(2000, 0, 6, 18, 14);
  const diasDesde = (fecha.getTime() - lunaNuevaConocidaUTC) / 86400000;
  const fase = ((diasDesde % sinodico) + sinodico) % sinodico;
  const indice = Math.floor((fase / sinodico) * FASES_LUNA.length) % FASES_LUNA.length;
  return FASES_LUNA[indice];
}

function formatearHoraCuenca(): string {
  return new Intl.DateTimeFormat("es-EC", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Guayaquil" }).format(new Date());
}

// No hace falta re-renderizar en cada tick del reloj del navegador: basta
// con recalcular cuando algo dispare un nuevo render. Se suscribe a un
// intervalo de 30s solo para que el minuto mostrado no quede fijo si el
// visitante deja la pestaña abierta mucho tiempo.
function suscribirseAlReloj(notificar: () => void) {
  const id = setInterval(notificar, 30_000);
  return () => clearInterval(id);
}

function snapshotServidor(): null {
  return null;
}

// Firma visual de Moonvet (webya.md sección 7 — "un elemento firma único
// por landing"): el negocio atiende 24 horas y se llama "Moonvet" — en vez
// de una firma decorativa sin relación con el negocio, esta insignia hace
// literal la promesa ("no importa la hora, siempre abierto") con un reloj
// en vivo de Cuenca. El punto animado reutiliza animate-ping (Tailwind,
// CSS puro, ya usado para el WhatsApp fijo de DeluxTravel) — no hace falta
// GSAP para un pulso continuo simple.
export function AbiertoAhora({ className }: { className?: string }) {
  const hora = useSyncExternalStore(suscribirseAlReloj, formatearHoraCuenca, snapshotServidor);

  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-full border border-current/15 bg-current/5 px-4 py-2 backdrop-blur-sm ${className ?? ""}`}
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span aria-hidden className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: "var(--tenant-acento)" }} />
        <span aria-hidden className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--tenant-acento)" }} />
      </span>
      <span className="text-xs font-medium tracking-wide opacity-90 sm:text-sm">Abierto ahora{hora ? ` · ${hora} en Cuenca` : ""}</span>
    </div>
  );
}

// "Esta noche: luna llena" — mismo detalle que AbiertoAhora pero para la
// sección de emergencias 24h. La fase lunar no necesita recalcularse en
// vivo (cambia en escala de días, no de segundos), así que no se suscribe
// a nada — solo evita mostrarse hasta que React confirme que ya está en
// el cliente (snapshot de servidor null).
function suscribirseNoop() {
  return () => {};
}

function snapshotFaseLunar(): string {
  return calcularFaseLunar(new Date());
}

export function FaseLunarEsta({ className }: { className?: string }) {
  const fase = useSyncExternalStore(suscribirseNoop, snapshotFaseLunar, snapshotServidor);

  if (!fase) return null;
  return <span className={className}>Esta noche: {fase}</span>;
}
