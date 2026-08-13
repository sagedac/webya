"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Inbox } from "lucide-react";
import { NIVEL_LABELS } from "@/lib/catalogo-plantillas";
import type { TenantWithContent } from "@/lib/types";

const ESTADO_ESTILO: Record<string, string> = {
  borrador: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  publicado: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  pausado: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
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
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" strokeWidth={2} />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o slug..."
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-3 pl-9 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-indigo-950"
          />
        </div>
        <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setEstadoFiltro(f.value)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                estadoFiltro === f.value
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-zinc-400">
          <Inbox className="h-8 w-8" strokeWidth={1.5} />
          <p className="text-sm">Sin resultados.</p>
        </div>
      ) : (
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-900">
          {filtrados.map(({ tenant }) => (
            <li key={tenant.id}>
              <Link
                href={`/admin/${tenant.id}`}
                className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  {tenant.nombre.slice(0, 1).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{tenant.nombre}</p>
                  <p className="truncate text-xs text-zinc-500">
                    /{tenant.slug} · {tenant.plan}
                    {tenant.nivel ? ` · ${NIVEL_LABELS[tenant.nivel]}` : ""}
                  </p>
                </div>

                <span className="hidden text-xs text-zinc-400 sm:block">
                  {tenant.dominioTipo === "dominio_propio" ? tenant.dominioCustom : "subdominio"}
                </span>

                <span
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${ESTADO_ESTILO[tenant.estadoLanding]}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${ESTADO_DOT[tenant.estadoLanding]}`} />
                  {tenant.estadoLanding}
                </span>

                <ChevronRight className="h-4 w-4 shrink-0 text-zinc-300" strokeWidth={2} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
