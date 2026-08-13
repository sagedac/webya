"use client";

import { useActionState } from "react";
import { FileEdit, CheckCircle2, PauseCircle } from "lucide-react";
import { actualizarEstadoAction, type AccionState } from "@/app/admin/actions";
import type { EstadoLanding } from "@/lib/types";

const ESTADOS: { value: EstadoLanding; label: string; icon: typeof FileEdit }[] = [
  { value: "borrador", label: "Borrador", icon: FileEdit },
  { value: "publicado", label: "Publicado", icon: CheckCircle2 },
  { value: "pausado", label: "Pausado", icon: PauseCircle },
];

const ESTADO_INICIAL: AccionState = { error: null };

// Componente cliente (antes eran 3 <form> independientes en la página de
// servidor) porque intentar publicar un Nivel 3 sin foto destacada
// necesita mostrar un error sin recargar la página — actualizarEstadoAction
// ahora devuelve {error}, así que hace falta useActionState para leerlo.
export function EstadoLandingForm({ tenantId, estadoActual }: { tenantId: string; estadoActual: EstadoLanding }) {
  const [state, formAction, isPending] = useActionState(actualizarEstadoAction, ESTADO_INICIAL);

  return (
    <div>
      <form action={formAction} className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
        <input type="hidden" name="tenantId" value={tenantId} />
        {ESTADOS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="submit"
            name="estado"
            value={value}
            disabled={isPending || estadoActual === value}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              estadoActual === value
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
            {label}
          </button>
        ))}
      </form>
      {state.error && <p className="mt-2 max-w-md text-sm text-red-600">{state.error}</p>}
    </div>
  );
}
