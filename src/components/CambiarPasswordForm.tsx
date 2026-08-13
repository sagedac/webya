"use client";

import { useActionState } from "react";
import { cambiarPasswordAction } from "@/lib/auth-actions";
import { inputClass, labelClass, primaryButtonClass } from "@/lib/form-styles";

const ESTADO_INICIAL = { error: null, ok: false };

// Compartido entre /admin y /panel — cambiar contraseña estando logueado
// es exactamente la misma operación para ambos (ver src/lib/auth-actions.ts).
export function CambiarPasswordForm() {
  const [state, formAction, isPending] = useActionState(cambiarPasswordAction, ESTADO_INICIAL);

  return (
    <form action={formAction} className="max-w-sm space-y-4">
      <div>
        <label className={labelClass}>Contraseña actual</label>
        <input type="password" name="passwordActual" required autoComplete="current-password" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Contraseña nueva</label>
        <input type="password" name="passwordNueva" required minLength={8} autoComplete="new-password" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Confirmar contraseña nueva</label>
        <input type="password" name="passwordConfirmar" required minLength={8} autoComplete="new-password" className={inputClass} />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.ok && <p className="text-sm text-emerald-600">Contraseña actualizada.</p>}
      <button type="submit" disabled={isPending} className={primaryButtonClass}>
        {isPending ? "Guardando..." : "Cambiar contraseña"}
      </button>
    </form>
  );
}
