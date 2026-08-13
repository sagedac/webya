import { listTenants } from "@/lib/admin-tenants";
import { FormularioNuevoTenant } from "@/app/admin/(protected)/nuevo/_components/FormularioNuevoTenant";

export default async function NuevoClientePage() {
  const tenants = await listTenants();
  const slugsExistentes = tenants.map((t) => t.tenant.slug);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Nuevo cliente</h1>
        <p className="mt-1 text-sm text-zinc-500">Da de alta un negocio nuevo en la plataforma.</p>
      </div>
      <FormularioNuevoTenant slugsExistentes={slugsExistentes} />
    </div>
  );
}
