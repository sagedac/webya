"use client";

import { useActionState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { enviarLeadAction, type LeadFormState } from "@/app/actions";

const ESTADO_INICIAL: LeadFormState = { error: null, ok: false };

// Sin WhatsApp/teléfono propio para esta landing (a diferencia de las
// páginas de negocio, que sí lo tienen — pedido explícito de Paul,
// 2026-08-16): el CTA principal es este formulario, que guarda el lead en
// landing_leads (ver src/app/actions.ts) para revisión manual.
export function FormularioContacto() {
  const [state, formAction, isPending] = useActionState(enviarLeadAction, ESTADO_INICIAL);

  if (state.ok) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-6">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[var(--26st-acento)]" strokeWidth={2} aria-hidden />
        <div>
          <p className="font-semibold text-white">Recibido.</p>
          <p className="mt-1 text-sm text-white/70">Te escribimos apenas revisemos tu mensaje.</p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="mb-1.5 block text-xs font-medium tracking-wide text-white/60 uppercase">
          Tu nombre o el de tu negocio
        </label>
        <input
          id="nombre"
          name="nombre"
          required
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[var(--26st-acento)]"
          placeholder="Ej. Panadería Doña Carmela"
        />
      </div>
      <div>
        <label htmlFor="contacto" className="mb-1.5 block text-xs font-medium tracking-wide text-white/60 uppercase">
          Correo o WhatsApp
        </label>
        <input
          id="contacto"
          name="contacto"
          required
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[var(--26st-acento)]"
          placeholder="Como prefieras que te contactemos"
        />
      </div>
      <div>
        <label htmlFor="mensaje" className="mb-1.5 block text-xs font-medium tracking-wide text-white/60 uppercase">
          Contanos de tu negocio (opcional)
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={3}
          className="w-full resize-none rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[var(--26st-acento)]"
          placeholder="A qué se dedica, en qué ciudad, qué te gustaría que tenga tu página..."
        />
      </div>
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-black shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:opacity-60 sm:w-auto"
        style={{ backgroundColor: "var(--26st-acento)" }}
      >
        <Send className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        {isPending ? "Enviando..." : "Quiero mi página"}
      </button>
    </form>
  );
}
