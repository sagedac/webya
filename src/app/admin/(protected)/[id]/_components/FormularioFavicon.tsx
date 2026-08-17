"use client";

import { useActionState, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { actualizarFaviconAction, type FaviconState } from "@/app/admin/actions";
import { RecortadorFavicon } from "@/app/admin/(protected)/[id]/_components/RecortadorFavicon";

const ESTADO_INICIAL: FaviconState = { error: null, faviconUrl: null };

// Sube el favicon de este tenant al bucket de Storage "tenant-assets"
// (migración 20260817120000_favicon_upload.sql) — pedido explícito de Paul,
// 2026-08-17: quería poder subirlo él mismo desde el panel admin cuando el
// cliente le manda el logo, en vez de que quede en manos de colocar el
// archivo a mano en el repo (que sigue siendo el fallback si no se sube
// nada acá — ver src/app/[slug]/page.tsx).
//
// Flujo con recorte (mismo pedido, ampliado): el logo real casi nunca
// llega ya cuadrado, así que elegir el archivo abre `RecortadorFavicon`
// (arrastrar + zoom) antes de subir nada — el envío real solo ocurre
// después de confirmar el recorte, vía `requestSubmit()` sobre el mismo
// <form>/Server Action de siempre, sustituyendo el archivo del <input> por
// el PNG cuadrado ya recortado (truco estándar: asignar un FileList nuevo
// vía DataTransfer, porque `input.files` no se puede asignar un array
// directamente).
export function FormularioFavicon({ tenantId, faviconActual }: { tenantId: string; faviconActual: string | null }) {
  const [state, formAction, isPending] = useActionState(actualizarFaviconAction, ESTADO_INICIAL);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [imagenParaRecortar, setImagenParaRecortar] = useState<string | null>(null);
  const [previewRecorte, setPreviewRecorte] = useState<string | null>(null);

  const faviconMostrado = previewRecorte ?? state.faviconUrl ?? faviconActual;

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagenParaRecortar(URL.createObjectURL(file));
  }

  function onCancelarRecorte() {
    if (imagenParaRecortar) URL.revokeObjectURL(imagenParaRecortar);
    setImagenParaRecortar(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function onConfirmarRecorte(blob: Blob) {
    if (imagenParaRecortar) URL.revokeObjectURL(imagenParaRecortar);
    setImagenParaRecortar(null);

    const archivo = new File([blob], "favicon.png", { type: "image/png" });
    const transferencia = new DataTransfer();
    transferencia.items.add(archivo);
    if (inputRef.current) inputRef.current.files = transferencia.files;

    if (previewRecorte) URL.revokeObjectURL(previewRecorte);
    setPreviewRecorte(URL.createObjectURL(blob));

    formRef.current?.requestSubmit();
  }

  return (
    <>
      <form ref={formRef} action={formAction} className="max-w-sm space-y-3">
        <input type="hidden" name="tenantId" value={tenantId} />

        <div className="flex items-center gap-3">
          {faviconMostrado ? (
            <Image
              src={faviconMostrado}
              alt="Favicon actual"
              width={32}
              height={32}
              unoptimized
              className="h-8 w-8 rounded border border-zinc-200 object-contain dark:border-zinc-700"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded border border-dashed border-zinc-300 text-[10px] text-zinc-400 dark:border-zinc-700">—</div>
          )}
          <p className="text-xs text-zinc-500">{faviconMostrado ? "Favicon actual" : "Sin favicon propio — usa el genérico de la plataforma"}</p>
          {isPending && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" strokeWidth={2} aria-hidden />}
        </div>

        <input
          ref={inputRef}
          type="file"
          name="favicon"
          accept="image/png,image/jpeg,image/x-icon,image/vnd.microsoft.icon,image/svg+xml"
          required
          disabled={isPending}
          onChange={onFileChange}
          className="block w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200 disabled:opacity-50 dark:text-zinc-400 dark:file:bg-zinc-800 dark:file:text-zinc-300 dark:hover:file:bg-zinc-700"
        />
        <p className="text-xs text-zinc-400">PNG, JPG, ICO o SVG — máximo 2MB. Después de elegir el archivo lo puedes encuadrar antes de subirlo.</p>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state.faviconUrl && !state.error && !isPending && <p className="text-sm text-emerald-600">Favicon actualizado.</p>}
      </form>

      {imagenParaRecortar && <RecortadorFavicon imageSrc={imagenParaRecortar} onConfirm={onConfirmarRecorte} onCancel={onCancelarRecorte} />}
    </>
  );
}
