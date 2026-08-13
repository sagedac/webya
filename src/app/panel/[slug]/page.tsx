import Link from "next/link";
import { notFound } from "next/navigation";
import { getTenantBySlugAdmin } from "@/lib/admin-tenants";
import { signOutPanelAction } from "@/app/panel/login/actions";
import { EditorContenidoCliente } from "@/app/panel/[slug]/_components/EditorContenidoCliente";

export default async function PanelClientePage({ params }: PageProps<"/panel/[slug]">) {
  const { slug } = await params;
  // Con sesión de cliente, RLS (tenants_owner_select) solo deja ver el
  // propio tenant — si alguien intenta abrir el panel de otro negocio,
  // esto devuelve null y cae en notFound(). Con sesión de admin, ve
  // cualquiera (útil para soporte).
  const data = await getTenantBySlugAdmin(slug);
  if (!data) notFound();

  const { tenant, content } = data;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{tenant.nombre}</h1>
          <p className="text-sm text-zinc-500">Edita la información de tu landing.</p>
        </div>
        <div className="flex items-center gap-3">
          {tenant.estadoLanding === "publicado" && (
            <Link href={`/${tenant.slug}`} target="_blank" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
              Ver mi landing ↗
            </Link>
          )}
          <Link href="/panel/cambiar-password" className="text-sm text-zinc-500 hover:underline">
            Cambiar contraseña
          </Link>
          <form action={signOutPanelAction}>
            <button type="submit" className="text-sm text-zinc-500 hover:underline">
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
      <EditorContenidoCliente slug={tenant.slug} content={content} nivel={tenant.nivel} />
    </div>
  );
}
