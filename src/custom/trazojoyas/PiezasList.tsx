"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ScrollReveal } from "@/templates/engine/ScrollReveal";
import type { CategoriaProducto, Foto } from "@/lib/types";

export interface PiezasListProps {
  categorias: CategoriaProducto[];
  fotos: Foto[];
  acento: string;
}

// Lightbox simple: clic en la miniatura de una pieza la agranda en overlay
// (clic afuera, botón X o Escape cierran). Sin librería externa — mismo
// criterio del resto del proyecto (motor propio, no dependencias nuevas
// para algo que un modal a mano ya resuelve).
export function PiezasList({ categorias, fotos, acento }: PiezasListProps) {
  const [abierta, setAbierta] = useState<number | null>(null);

  useEffect(() => {
    if (abierta === null) return;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setAbierta(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [abierta]);

  const piezaAbierta = abierta !== null ? { cat: categorias[abierta], foto: fotos[abierta] } : null;

  return (
    <>
      <div className="divide-y" style={{ borderColor: `${acento}30` }}>
        {categorias.map((cat, i) => {
          const foto = fotos[i];
          const [material, precio] = cat.items;
          return (
            <ScrollReveal key={cat.nombre} delay={i * 0.05}>
              <div className="flex items-center gap-5 py-5">
                <span className="w-8 shrink-0 font-mono text-sm opacity-40">{String(i + 1).padStart(2, "0")}</span>
                {foto && (
                  <button
                    type="button"
                    onClick={() => setAbierta(i)}
                    aria-label={`Ver foto ampliada de ${cat.nombre}`}
                    className="relative h-16 w-16 shrink-0 cursor-zoom-in overflow-hidden rounded-xl transition hover:opacity-80"
                  >
                    <Image src={foto.url} alt={foto.alt} fill sizes="64px" className="object-cover" />
                  </button>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{cat.nombre}</p>
                  {material && <p className="text-xs tracking-wide uppercase opacity-50">{material}</p>}
                </div>
                {precio && <span className="shrink-0 font-mono text-base font-semibold">{precio}</span>}
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {piezaAbierta?.foto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={piezaAbierta.cat.nombre}
          onClick={() => setAbierta(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
        >
          <button
            type="button"
            onClick={() => setAbierta(null)}
            aria-label="Cerrar"
            className="absolute top-5 right-5 text-3xl leading-none text-white/80 transition hover:text-white"
          >
            ×
          </button>
          <div className="relative max-h-[80vh] w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
              <Image src={piezaAbierta.foto.url} alt={piezaAbierta.foto.alt} fill sizes="512px" className="object-cover" />
            </div>
            <p className="mt-4 text-center text-sm font-medium text-white">{piezaAbierta.cat.nombre}</p>
          </div>
        </div>
      )}
    </>
  );
}
