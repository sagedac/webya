import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Cliente con sesión (anon key + cookies de auth): las políticas RLS que
// dependen de auth.uid() — is_admin(), is_tenant_owner() (ver
// /supabase/migrations/20260810120400_helper_functions.sql) — se evalúan
// de verdad con este cliente. Es el reemplazo de supabaseAdmin
// (service_role) para todo el CRUD del panel admin y del panel de
// autoedición: en vez de que el código de la app decida quién puede hacer
// qué, Postgres lo decide con la sesión real del usuario.
//
// Se crea una instancia nueva en cada llamada (no se puede cachear en un
// singleton de módulo) porque depende de las cookies de la request actual.
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Llamado desde un Server Component (no puede escribir cookies).
          // El middleware ya refresca la sesión en cada request, así que
          // esto es seguro de ignorar — ver src/lib/supabase/middleware.ts.
        }
      },
    },
  });
}
