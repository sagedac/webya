"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface AuthFormState {
  error: string | null;
  ok: boolean;
}

function getOrigin(headersList: Awaited<ReturnType<typeof headers>>): string {
  const origin = headersList.get("origin");
  if (origin) return origin;
  const host = headersList.get("host");
  return `http://${host}`;
}

// A dónde mandar a alguien después de autenticarse por un link de
// recuperación, sin saber de antemano si es admin o cliente: se fija en
// las mismas tablas que usan los logins normales (admins / tenant_users).
async function resolverDestinoSesion(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  userId: string,
): Promise<string> {
  const { data: adminRow } = await supabase.from("admins").select("id").eq("id", userId).maybeSingle();
  if (adminRow) return "/admin";

  const { data: vinculo } = await supabase.from("tenant_users").select("tenant_id").eq("user_id", userId).maybeSingle();
  if (vinculo) {
    const { data: tenant } = await supabase.from("tenants").select("slug").eq("id", vinculo.tenant_id).maybeSingle();
    if (tenant) return `/panel/${tenant.slug}`;
  }

  return "/";
}

// Cambiar contraseña estando ya logueado (admin o cliente, misma lógica
// para ambos). Se pide la contraseña actual y se re-autentica con ella
// antes de actualizar — supabase.auth.updateUser() no lo exige por sí
// solo, pero es la práctica esperada para esta acción.
export async function cambiarPasswordAction(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const passwordActual = String(formData.get("passwordActual") ?? "");
  const passwordNueva = String(formData.get("passwordNueva") ?? "");
  const passwordConfirmar = String(formData.get("passwordConfirmar") ?? "");

  if (passwordNueva.length < 8) return { error: "La contraseña nueva debe tener al menos 8 caracteres.", ok: false };
  if (passwordNueva !== passwordConfirmar) return { error: "Las contraseñas nuevas no coinciden.", ok: false };

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { error: "Sesión inválida.", ok: false };

  const { error: verifyError } = await supabase.auth.signInWithPassword({ email: user.email, password: passwordActual });
  if (verifyError) return { error: "La contraseña actual no es correcta.", ok: false };

  const { error: updateError } = await supabase.auth.updateUser({ password: passwordNueva });
  if (updateError) return { error: updateError.message, ok: false };

  return { error: null, ok: true };
}

// Pide el link de recuperación por correo. No revela si el email existe o
// no en la respuesta (mismo mensaje siempre) para no filtrar qué cuentas
// están registradas.
export async function solicitarRecuperacionAction(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "El email es obligatorio.", ok: false };

  const supabase = await createServerSupabaseClient();
  const origin = getOrigin(await headers());

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  return { error: null, ok: true };
}

// Se llama ya con la sesión que dejó /auth/callback tras verificar el link
// del correo — no pide contraseña actual porque el link ya demostró que
// el dueño de la cuenta tiene acceso al correo.
export async function restablecerPasswordAction(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const passwordNueva = String(formData.get("passwordNueva") ?? "");
  const passwordConfirmar = String(formData.get("passwordConfirmar") ?? "");

  if (passwordNueva.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres.", ok: false };
  if (passwordNueva !== passwordConfirmar) return { error: "Las contraseñas no coinciden.", ok: false };

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "El link expiró o ya se usó. Solicita uno nuevo.", ok: false };

  const { error: updateError } = await supabase.auth.updateUser({ password: passwordNueva });
  if (updateError) return { error: updateError.message, ok: false };

  const destino = await resolverDestinoSesion(supabase, user.id);
  redirect(destino);
}
