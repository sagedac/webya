import Link from "next/link";
import type { ComponentType } from "react";
import { Plus, Store, CheckCircle2, FileEdit, PauseCircle } from "lucide-react";
import { listTenants } from "@/lib/admin-tenants";
import { TablaTenants } from "@/app/admin/(protected)/_components/TablaTenants";

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="h-4 w-4" strokeWidth={2.25} />
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

export default async function AdminDashboard() {
  const tenants = await listTenants();
  const publicados = tenants.filter((t) => t.tenant.estadoLanding === "publicado").length;
  const borradores = tenants.filter((t) => t.tenant.estadoLanding === "borrador").length;
  const pausados = tenants.filter((t) => t.tenant.estadoLanding === "pausado").length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="mt-1 text-sm text-zinc-500">Landings activas y en gestión.</p>
        </div>
        <Link
          href="/admin/nuevo"
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Nuevo cliente
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total" value={tenants.length} icon={Store} tone="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300" />
        <StatCard label="Publicados" value={publicados} icon={CheckCircle2} tone="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" />
        <StatCard label="Borrador" value={borradores} icon={FileEdit} tone="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300" />
        <StatCard label="Pausados" value={pausados} icon={PauseCircle} tone="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400" />
      </div>

      <TablaTenants tenants={tenants} />
    </div>
  );
}
