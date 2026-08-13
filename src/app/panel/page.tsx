import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// /panel ya no pide el slug a mano (era el stub de antes de tener Auth
// real) — ahora solo decide a dónde mandar según haya o no sesión.
export default async function PanelRootPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/panel/login");

  const { data: vinculo } = await supabase.from("tenant_users").select("tenant_id").eq("user_id", user.id).maybeSingle();
  if (!vinculo) redirect("/panel/login");

  const { data: tenant } = await supabase.from("tenants").select("slug").eq("id", vinculo.tenant_id).maybeSingle();
  if (!tenant) redirect("/panel/login");

  redirect(`/panel/${tenant.slug}`);
}
