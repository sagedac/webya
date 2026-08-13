"use client";

import { useActionState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { signInAdminAction } from "@/app/admin/login/actions";
import { inputClass, labelClass, primaryButtonClass } from "@/lib/form-styles";

const ESTADO_INICIAL = { error: null };

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, isPending] = useActionState(signInAdminAction, ESTADO_INICIAL);

  return (
    <form action={formAction} className="space-y-3 text-left">
      <input type="hidden" name="next" value={next} />
      <div>
        <label className={labelClass}>Email</label>
        <input type="email" name="email" required autoComplete="email" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Contraseña</label>
        <input type="password" name="password" required autoComplete="current-password" className={inputClass} />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" disabled={isPending} className={`w-full justify-center ${primaryButtonClass}`}>
        <LogIn className="h-4 w-4" strokeWidth={2} />
        {isPending ? "Entrando..." : "Entrar"}
      </button>
      <Link href="/forgot-password" className="block text-center text-sm text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400">
        ¿Olvidaste tu contraseña?
      </Link>
    </form>
  );
}
