"use client";

import { useActionState } from "react";
import { restablecerPasswordAction } from "@/lib/auth-actions";
import { inputClass, labelClass, primaryButtonClass } from "@/lib/form-styles";

const ESTADO_INICIAL = { error: null, ok: false };

export function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(restablecerPasswordAction, ESTADO_INICIAL);

  return (
    <form action={formAction} className="space-y-3 text-left">
      <div>
        <label className={labelClass}>Contraseña nueva</label>
        <input type="password" name="passwordNueva" required minLength={8} autoComplete="new-password" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Confirmar contraseña</label>
        <input type="password" name="passwordConfirmar" required minLength={8} autoComplete="new-password" className={inputClass} />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" disabled={isPending} className={`w-full justify-center ${primaryButtonClass}`}>
        {isPending ? "Guardando..." : "Guardar contraseña"}
      </button>
    </form>
  );
}
