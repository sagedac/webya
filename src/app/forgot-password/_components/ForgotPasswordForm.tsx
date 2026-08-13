"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { solicitarRecuperacionAction } from "@/lib/auth-actions";
import { inputClass, labelClass, primaryButtonClass } from "@/lib/form-styles";

const ESTADO_INICIAL = { error: null, ok: false };

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(solicitarRecuperacionAction, ESTADO_INICIAL);

  if (state.ok) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Si ese email tiene una cuenta, te llegó un link para restablecer la contraseña. Revisa tu bandeja (y spam).
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-3 text-left">
      <div>
        <label className={labelClass}>Email</label>
        <input type="email" name="email" required autoComplete="email" className={inputClass} />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" disabled={isPending} className={`w-full justify-center ${primaryButtonClass}`}>
        <Send className="h-4 w-4" strokeWidth={2} />
        {isPending ? "Enviando..." : "Enviar link de recuperación"}
      </button>
    </form>
  );
}
