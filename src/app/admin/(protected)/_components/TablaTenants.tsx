"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Inbox } from "lucide-react";
import type { TenantWithContent } from "@/lib/types";

const ESTADO_ESTILO: Record<string, string> = {
  borrador: "bg-white/[0.06] text-[#f2efe9]/70",
  publicado: "bg-emerald-400/15 text-emerald-400",
  pausado: "bg-amber-400/15 text-amber-400",
};

const ESTADO_DOT: Record<string, string> = {
  borrador: "bg-zinc-400",
  publicado: "bg-emerald-500",
  pausado: "bg-amber-500",
};

const FILTROS = [
  { value: "todos", label: "Todos" },
  { value: "borrador", label: "Borrador" },
  { value: "publicado", label: "Publicado" },
  { value: "pausado", label: "Pausado" },
];

export function TablaTenants({ tenants }: { tenants: TenantWithContent[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<string>("todos");

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return tenants.filter(({ tenant }) => {
      const coincideTexto = !q || tenant.nombre.toLowerCase().includes(q) || tenant.slug.toLowerCase().includes(q);
      const coincideEstado = estadoFiltro === "todos" || tenant.estadoLanding === estadoFiltro;
      return coincideTexto && coincideEstado;
    });
  }, [tenants, busqueda, estadoFiltro]);

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#111316]">
      <div className="flex flex-col gap-3 border-b border-white/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#f2efe9]/35" strokeWidth={2} />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o slug..."
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2 pr-3 pl-9 text-sm text-[#f2efe9] outline-none placeholder:text-[#f2efe9]/35 focus:border-[#ff7a33]/50"
          />
        </div>
        <div className="flex gap-1 rounded-lg bg-white/[0.04] p-1">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setEstadoFiltro(f.value)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                estadoFiltro === f.value ? "bg-white/10 text-[#f2efe9]" : "text-[#f2efe9]/45 hover:text-[#f2efe9]/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-[#f2efe9]/35">
          <Inbox className="h-8 w-8" strokeWidth={1.5} />
          <p className="text-sm">Sin resultados.</p>
        </div>
      ) : (
        <ul className="divide-y divide-white/[0.06]">
          {filtrados.map(({ tenant }) => (
            <li key={tenant.id}>
              <Link href={`/admin/${tenant.id}`} className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-white/[0.03]">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                  style={{ backgroundColor: "rgba(255,122,51,0.14)", color: "#ff7a33" }}
                >
                  {tenant.nombre.slice(0, 1).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#f2efe9]">{tenant.nombre}</p>
                  <p className="truncate text-xs text-[#f2efe9]/45">
                    /{tenant.slug} · {tenant.plan}
                  </p>
                </div>

                <span className="hidden text-xs text-[#f2efe9]/35 sm:block">
                  {tenant.dominioTipo === "dominio_propio" ? tenant.dominioCustom : "subdominio"}
                </span>

                <span
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${ESTADO_ESTILO[tenant.estadoLanding]}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${ESTADO_DOT[tenant.estadoLanding]}`} />
                  {tenant.estadoLanding}
                </span>

                <ChevronRight className="h-4 w-4 shrink-0 text-[#f2efe9]/25" strokeWidth={2} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
