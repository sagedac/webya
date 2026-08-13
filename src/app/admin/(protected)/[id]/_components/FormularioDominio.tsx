"use client";

import { useActionState, useState } from "react";
import { actualizarDominioAction } from "@/app/admin/actions";
import { inputClass, secondaryButtonClass } from "@/lib/form-styles";
import type { DominioTipo } from "@/lib/types";

const ESTADO_INICIAL = { error: null };

export function FormularioDominio({
  tenantId,
  dominioTipo: dominioTipoInicial,
  dominioCustom,
}: {
  tenantId: string;
  dominioTipo: DominioTipo;
  dominioCustom: string | null;
}) {
  const [state, formAction, isPending] = useActionState(actualizarDominioAction, ESTADO_INICIAL);
  const [dominioTipo, setDominioTipo] = useState(dominioTipoInicial);

  return (
    <form action={formAction} className="max-w-sm space-y-3">
      <input type="hidden" name="tenantId" value={tenantId} />

      <select name="dominioTipo" value={dominioTipo} onChange={(e) => setDominioTipo(e.target.value as DominioTipo)} className={inputClass}>
        <option value="subdominio">Subdominio de la plataforma (Fase 1/2)</option>
        <option value="dominio_propio">Dominio propio del cliente (Fase 3)</option>
      </select>

      {dominioTipo === "dominio_propio" && (
        <input name="dominioCustom" defaultValue={dominioCustom ?? ""} placeholder="www.negociodelcliente.com" className={inputClass} />
      )}

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button type="submit" disabled={isPending} className={secondaryButtonClass}>
        {isPending ? "Guardando..." : "Guardar dominio"}
      </button>
    </form>
  );
}
