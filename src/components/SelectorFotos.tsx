"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { subirFotoClienteAction } from "@/app/panel/actions";
import { inputClass } from "@/lib/form-styles";
import type { Foto } from "@/lib/types";

const TIPOS_ACEPTADOS = ["image/png", "image/jpeg", "image/webp"];

// Dropzone real (arrastrar o elegir archivo) para la galería de fotos del
// panel de autoedición — reemplaza el "por ahora pega la URL de la foto"
// que traía EditorContenidoCliente.tsx (pedido explícito de Paul,
// 2026-09-09). Cada archivo se sube en cuanto se suelta, uno por uno y en
// paralelo (subirFotoClienteAction, Storage vía RLS — ver migración
// 20260909120000_tenant_photos_upload.sql), sin esperar al botón "Guardar
// cambios" del formulario general. La URL manual sigue disponible por si el
// cliente ya tiene la foto alojada en otro lado (ej. quiere reusar una de
// Instagram) — no se le quita esa opción, solo deja de ser la única.
export function SelectorFotos({ slug, fotos, onChange }: { slug: string; fotos: Foto[]; onChange: (fotos: Foto[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [subiendo, setSubiendo] = useState<{ nombre: string; error?: string }[]>([]);

  async function subirArchivos(archivos: FileList | File[]) {
    const lista = Array.from(archivos).filter((f) => TIPOS_ACEPTADOS.includes(f.type));
    if (lista.length === 0) return;

    setSubiendo((prev) => [...prev, ...lista.map((f) => ({ nombre: f.name }))]);

    await Promise.all(
      lista.map(async (file) => {
        const resultado = await subirFotoClienteAction(slug, file);
        if ("error" in resultado) {
          setSubiendo((prev) => prev.map((s) => (s.nombre === file.name ? { ...s, error: resultado.error } : s)));
          return;
        }
        onChange([...fotos, { url: resultado.url, alt: "" }]);
        setSubiendo((prev) => prev.filter((s) => s.nombre !== file.name));
      }),
    );
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setArrastrando(false);
    if (e.dataTransfer.files.length) subirArchivos(e.dataTransfer.files);
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setArrastrando(true);
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${
          arrastrando
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40"
            : "border-zinc-300 hover:border-indigo-400 dark:border-zinc-700"
        }`}
      >
        <ImagePlus className="h-5 w-5 text-zinc-400" strokeWidth={2} aria-hidden />
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Arrastra tus fotos aquí, o <span className="font-medium text-indigo-600 dark:text-indigo-400">haz clic para elegir</span>
        </p>
        <p className="text-xs text-zinc-400">PNG, JPG o WEBP — máximo 5MB por foto</p>
        <input
          ref={inputRef}
          type="file"
          accept={TIPOS_ACEPTADOS.join(",")}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) subirArchivos(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {subiendo.length > 0 && (
        <div className="space-y-1">
          {subiendo.map((s, i) => (
            <div key={`${s.nombre}-${i}`} className="flex items-center gap-2 text-xs">
              {s.error ? (
                <>
                  <X className="h-3.5 w-3.5 shrink-0 text-red-500" strokeWidth={2} />
                  <span className="text-red-600">
                    {s.nombre}: {s.error}
                  </span>
                </>
              ) : (
                <>
                  <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-zinc-400" strokeWidth={2} />
                  <span className="text-zinc-500">Subiendo {s.nombre}...</span>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {fotos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {fotos.map((foto, i) => (
            <div key={i} className="space-y-1.5">
              <div className="relative aspect-square overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                {foto.url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- previsualización de una URL cualquiera (subida o pegada a mano), no vale la pena la configuración de dominios remotos de next/image para esto
                  <img src={foto.url} alt={foto.alt || "Foto"} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">Sin foto</div>
                )}
                <button
                  type="button"
                  onClick={() => onChange(fotos.filter((_, idx) => idx !== i))}
                  className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>
              </div>
              <input
                value={foto.alt}
                onChange={(e) => onChange(fotos.map((f, idx) => (idx === i ? { ...f, alt: e.target.value } : f)))}
                placeholder="Descripción"
                className={`${inputClass} text-xs`}
              />
            </div>
          ))}
        </div>
      )}

      <details className="text-xs text-zinc-400">
        <summary className="cursor-pointer select-none hover:text-zinc-600 dark:hover:text-zinc-300">
          O pega la URL de una foto ya alojada en otro lado
        </summary>
        <div className="mt-2 flex gap-2">
          <input
            id="url-foto-manual"
            placeholder="https://..."
            className={`${inputClass} flex-1`}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
              const valor = e.currentTarget.value.trim();
              if (!valor) return;
              onChange([...fotos, { url: valor, alt: "" }]);
              e.currentTarget.value = "";
            }}
          />
        </div>
      </details>
    </div>
  );
}
