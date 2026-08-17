"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Check, X, ZoomIn } from "lucide-react";
import { recortarImagenAFavicon } from "@/lib/image-crop";

// Editor de recorte interactivo (arrastrar + zoom) para el favicon — pedido
// explícito de Paul, 2026-08-17: el logo que le mandan los clientes casi
// nunca viene ya cuadrado (suele ser un wordmark rectangular), y un
// favicon forzado a cuadrado sin recorte se ve estirado/deformado en la
// pestaña del navegador. `react-easy-crop` resuelve el gesto de
// arrastrar/zoom (mismo patrón que subir foto de perfil en redes
// sociales); el recorte real a un PNG cuadrado lo hace
// `recortarImagenAFavicon` (src/lib/image-crop.ts) con canvas, a partir
// del área en píxeles que devuelve `onCropComplete`.
export function RecortadorFavicon({ imageSrc, onConfirm, onCancel }: { imageSrc: string; onConfirm: (blob: Blob) => void; onCancel: () => void }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixeles, setAreaPixeles] = useState<Area | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_areaPorcentaje: Area, areaEnPixeles: Area) => {
    setAreaPixeles(areaEnPixeles);
  }, []);

  async function confirmar() {
    if (!areaPixeles) return;
    setProcesando(true);
    setError(null);
    try {
      const blob = await recortarImagenAFavicon(imageSrc, areaPixeles);
      onConfirm(blob);
    } catch {
      setError("No se pudo recortar la imagen. Intenta de nuevo.");
      setProcesando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-4 dark:bg-zinc-900">
        <p className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">Encuadra el favicon</p>

        <div className="relative h-64 w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} cropShape="rect" showGrid onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <ZoomIn className="h-4 w-4 shrink-0 text-zinc-400" strokeWidth={2} aria-hidden />
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-indigo-600"
            aria-label="Zoom"
          />
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={procesando}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" strokeWidth={2} />
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmar}
            disabled={procesando || !areaPixeles}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check className="h-4 w-4" strokeWidth={2} />
            {procesando ? "Recortando..." : "Usar este recorte"}
          </button>
        </div>
      </div>
    </div>
  );
}
