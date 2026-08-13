import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Adonde llega el link del correo de recuperación de contraseña (y, en el
// futuro, cualquier otro flujo de Supabase Auth basado en link: invites,
// confirmación de email nuevo, etc). Supabase manda un `code` que hay que
// canjear por una sesión real — recién ahí el usuario "está logueado" y
// puede llamar auth.updateUser() para poner la contraseña nueva.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/forgot-password?error=link_invalido`);
}
