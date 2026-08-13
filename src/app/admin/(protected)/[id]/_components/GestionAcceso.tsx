"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import { generarAccesoAction } from "@/app/admin/actions";
import { inputClass, labelClass, secondaryButtonClass } from "@/lib/form-styles";

const ESTADO_INICIAL = { error: null, credenciales: null };

export function GestionAcceso({ tenantId, nombreTenant }: { tenantId: string; nombreTenant: string }) {
  const [state, formAction, isPending] = useActionState(generarAccesoAction, ESTADO_INICIAL);

  if (state.credenciales) {
    return (
      <div className="max-w-sm rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm dark:border-emerald-900 dark:bg-emerald-950/60">
        <p className="mb-2 font-medium text-emerald-800 dark:text-emerald-300">
          Cuenta creada para {nombreTenant}. Copia estas credenciales ahora — no se van a volver a mostrar:
        </p>
        <p className="text-emerald-900 dark:text-emerald-200">
          Email: <span className="font-mono">{state.credenciales.email}</span>
        </p>
        <p className="text-emerald-900 dark:text-emerald-200">
          Contraseña: <span className="font-mono">{state.credenciales.password}</span>
        </p>
        <p className="mt-2 text-xs text-emerald-700/70 dark:text-emerald-400/70">
          Entran en /panel/login. Compártelas por un canal seguro (WhatsApp, etc).
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="max-w-sm space-y-3">
      <input type="hidden" name="tenantId" value={tenantId} />
      <div>
        <label className={labelClass}>Email del cliente</label>
        <input type="email" name="email" required className={inputClass} placeholder="dueño@negocio.com" />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" disabled={isPending} className={secondaryButtonClass}>
        <KeyRound className="h-4 w-4" strokeWidth={2} />
        {isPending ? "Creando..." : "Generar acceso de cliente"}
      </button>
    </form>
  );
}
