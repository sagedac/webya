import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye, ExternalLink } from "lucide-react";
import { getTenantById } from "@/lib/admin-tenants";
import { EditorContenido } from "@/app/admin/(protected)/[id]/_components/EditorContenido";
import { EstadoLandingForm } from "@/app/admin/(protected)/[id]/_components/EstadoLandingForm";
import { FormularioDominio } from "@/app/admin/(protected)/[id]/_components/FormularioDominio";
import { GestionAcceso } from "@/app/admin/(protected)/[id]/_components/GestionAcceso";
import { NIVEL_LABELS } from "@/lib/catalogo-plantillas";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
      {children}
    </section>
  );
}

export default async function TenantDetailPage({ params }: PageProps<"/admin/[id]">) {
  const { id } = await params;
  const data = await getTenantById(id);
  if (!data) notFound();

  const { tenant, content } = data;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/admin" className="mb-2 flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Clientes
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{tenant.nombre}</h1>
        <p className="mt-1 text-sm text-zinc-500">
          /{tenant.slug} · {tenant.plan}
          {tenant.nivel ? ` · ${NIVEL_LABELS[tenant.nivel]}` : ""}
          {tenant.plantillaId ? ` · ${tenant.plantillaId}` : ""}
        </p>
      </div>

      <Card title="Estado y vista previa">
        <div className="flex flex-wrap items-center gap-4">
          <EstadoLandingForm tenantId={tenant.id} estadoActual={tenant.estadoLanding} />

          <div className="flex items-center gap-4 text-sm">
            <Link
              href={`/admin/${tenant.id}/preview`}
              target="_blank"
              className="flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400"
            >
              <Eye className="h-3.5 w-3.5" strokeWidth={2} />
              Vista previa
            </Link>
            {tenant.estadoLanding === "publicado" && (
              <Link
                href={`/${tenant.slug}`}
                target="_blank"
                className="flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
                Ver landing pública
              </Link>
            )}
          </div>
        </div>
      </Card>

      <Card title="Contenido">
        <EditorContenido tenantId={tenant.id} content={content} nivel={tenant.nivel} />
      </Card>

      <Card title="Dominio">
        <FormularioDominio tenantId={tenant.id} dominioTipo={tenant.dominioTipo} dominioCustom={tenant.dominioCustom} />
      </Card>

      <Card title="Acceso del cliente">
        <GestionAcceso tenantId={tenant.id} nombreTenant={tenant.nombre} />
      </Card>
    </div>
  );
}
