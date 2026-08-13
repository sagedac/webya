import { notFound } from "next/navigation";
import { getTenantById } from "@/lib/admin-tenants";
import { REGISTRO_CUSTOM } from "@/custom/registro";

// A diferencia de /app/[slug], esta ruta no filtra por estado_landing —
// es justamente para que el admin pueda revisar un tenant en borrador
// antes de publicarlo (webya.md sección 5, "Vista previa antes de
// publicar").
//
// Reset del catálogo de plantillas (webya.md sección 5, 2026-08-12): no
// existe ni va a reconstruirse un sistema de plantillas reutilizables —
// cada negocio nuevo nace como plan="custom_code". Un tenant plan="template"
// (legado, de antes del reset) cae a notFound().
export default async function PreviewPage({ params }: PageProps<"/admin/[id]/preview">) {
  const { id } = await params;
  const data = await getTenantById(id);
  if (!data) notFound();

  if (data.tenant.plan === "custom_code") {
    const CustomPage = REGISTRO_CUSTOM[data.tenant.slug];
    if (!CustomPage) notFound();
    return <CustomPage {...data} />;
  }

  notFound();
}
