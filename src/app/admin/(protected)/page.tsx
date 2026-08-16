import Link from "next/link";
import type { ComponentType } from "react";
import { Plus, Store, CheckCircle2, FileEdit, PauseCircle } from "lucide-react";
import { listTenants } from "@/lib/admin-tenants";
import { TablaTenants } from "@/app/admin/(protected)/_components/TablaTenants";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#111316] p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#f2efe9]/50">{label}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}1f`, color }}>
          <Icon className="h-4 w-4" strokeWidth={2.25} />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-[#f2efe9]" style={{ fontFamily: "var(--font-bitter)" }}>
        {value}
      </p>
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
          <h1 className="text-2xl font-bold tracking-tight text-[#f2efe9]" style={{ fontFamily: "var(--font-bitter)" }}>
            Clientes
          </h1>
          <p className="mt-1 text-sm text-[#f2efe9]/50">Landings activas y en gestión.</p>
        </div>
        <Link
          href="/admin/nuevo"
          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-black shadow-lg transition hover:-translate-y-0.5"
          style={{ backgroundColor: "#ff7a33" }}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Nuevo cliente
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total" value={tenants.length} icon={Store} color="#f2efe9" />
        <StatCard label="Publicados" value={publicados} icon={CheckCircle2} color="#34d399" />
        <StatCard label="Borrador" value={borradores} icon={FileEdit} color="#f2efe9" />
        <StatCard label="Pausados" value={pausados} icon={PauseCircle} color="#fbbf24" />
      </div>

      <TablaTenants tenants={tenants} />
    </div>
  );
}
