"use client";

import { RefreshCw } from "lucide-react";

// Columna derecha del panel de autoedición: la landing real dentro de un
// iframe, al lado del formulario — pedido explícito de Paul, 2026-09-09,
// para que el cliente vea el resultado sin tener que abrir otra pestaña.
// Es "Opción A" (preview que se refresca al guardar, no en vivo tecla por
// tecla): `refreshToken` lo controla EditorContenidoCliente, incrementando
// un contador cuando el guardado termina sin error — cambiarlo fuerza que
// el <iframe> vuelva a pedir la página (se agrega como querystring porque
// cambiar solo la key también sirve, pero así además evita que el
// navegador sirva una respuesta cacheada del mismo GET anterior).
export function VistaPreviaLanding({ slug, publicado, refreshToken }: { slug: string; publicado: boolean; refreshToken: number }) {
  if (!publicado) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Tu landing todavía no está publicada</p>
        <p className="mt-1 text-xs text-zinc-400">La vista previa aparece acá en cuanto se publique.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
        <RefreshCw className="h-3 w-3" strokeWidth={2} aria-hidden />
        Vista previa — se actualiza al guardar
      </div>
      <iframe
        key={refreshToken}
        src={`/${slug}?vistaPrevia=${refreshToken}`}
        title="Vista previa de tu landing"
        className="min-h-[600px] flex-1 bg-white"
      />
    </div>
  );
}
