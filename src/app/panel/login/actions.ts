"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface LoginState {
  error: string | null;
}

export async function signInPanelAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Email y contraseña son obligatorios." };

  const supabase = await createServerSupabaseClient();
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError || !signInData.user) return { error: "Email o contraseña incorrectos." };

  // tenant_users vincula esta cuenta con SU negocio (ver
  // /supabase/migrations/20260810120300_create_tenant_users.sql). Sin fila
  // ahí, es una cuenta válida pero sin ningún panel de autoedición
  // asignado — probablemente todavía no se le generó el acceso desde /admin.
  const { data: vinculo } = await supabase
    .from("tenant_users")
    .select("tenant_id")
    .eq("user_id", signInData.user.id)
    .maybeSingle();

  if (!vinculo) {
    await supabase.auth.signOut();
    return { error: "Esta cuenta no tiene ningún negocio asignado todavía." };
  }

  const { data: tenant } = await supabase.from("tenants").select("slug").eq("id", vinculo.tenant_id).maybeSingle();
  if (!tenant) {
    await supabase.auth.signOut();
    return { error: "No se encontró el negocio asociado a esta cuenta." };
  }

  redirect(`/panel/${tenant.slug}`);
}

export async function signOutPanelAction(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/panel/login");
}
