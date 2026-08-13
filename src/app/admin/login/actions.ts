"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface LoginState {
  error: string | null;
}

export async function signInAdminAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) return { error: "Email y contraseña son obligatorios." };

  const supabase = await createServerSupabaseClient();
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError || !signInData.user) return { error: "Email o contraseña incorrectos." };

  // El login de Supabase Auth por sí solo no dice si esta cuenta es admin
  // — eso lo decide la tabla `admins`. Si no tiene fila ahí, es una cuenta
  // válida (quizás de cliente) pero sin permiso para este panel.
  const { data: adminRow } = await supabase.from("admins").select("id").eq("id", signInData.user.id).maybeSingle();
  if (!adminRow) {
    await supabase.auth.signOut();
    return { error: "Esta cuenta no tiene permiso de administrador." };
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}
