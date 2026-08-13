import { notFound } from "next/navigation";
import { getTenantById } from "@/lib/admin-tenants";
import { REGISTRO_CUSTOM } from "@/custom/registro";

// A diferencia de /app/[slug], esta ruta no filtra por estado_landing —
// es justamente para que el admin pueda revisar un tenant en borrador
// antes de publicarlo (webya.md sección 5, "Vista previa antes de
// publicar").
//
// Catálogo vaciado el 2026-08-12 (webya.md sección 5, ver
// catalogo-plantillas.ts) — sin plantillas de código todavía, cualquier
// tenant tipo "template" cae a notFound() hasta que se reconstruya el
// catálogo.
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
