import { supabase } from "@/lib/supabase/client";
import { contentFromRow, emptyContent, tenantFromRow, type TenantContentRow, type TenantRow } from "@/lib/supabase/mappers";
import type { TenantWithContent } from "@/lib/types";

// Lectura pública: usa la anon key, gobernada por las políticas RLS
// "tenants_public_select_published" / "tenant_content_public_select_published"
// (ver /supabase/migrations/20260810120500_enable_rls_and_policies.sql).
// Nunca puede devolver un tenant en borrador aunque el código de la página
// olvide filtrar por estado — RLS es la última línea de defensa, no la
// única (el llamador igual valida estadoLanding, ver /app/[slug]/page.tsx).
export async function getTenantBySlug(slug: string): Promise<TenantWithContent | null> {
  const { data: tenantRow } = await supabase.from("tenants").select("*").eq("slug", slug).maybeSingle<TenantRow>();
  if (!tenantRow) return null;

  const { data: contentRow } = await supabase
    .from("tenant_content")
    .select("*")
    .eq("tenant_id", tenantRow.id)
    .maybeSingle<TenantContentRow>();

  return {
    tenant: tenantFromRow(tenantRow),
    content: contentRow ? contentFromRow(contentRow) : emptyContent(tenantRow.id),
  };
}

export async function getAllSlugs(): Promise<string[]> {
  const { data } = await supabase.from("tenants").select("slug");
  return (data ?? []).map((row) => row.slug as string);
}
