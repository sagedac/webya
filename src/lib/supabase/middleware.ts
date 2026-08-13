import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Patrón estándar de @supabase/ssr para middleware: refresca el token de
// sesión en cada request (si expiró) y expone el usuario actual. Es el
// único lugar donde las cookies de auth se pueden reescribir "libremente"
// en respuesta a una request entrante.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // No quitar este await aunque no se use `user` en todas las llamadas:
  // es lo que dispara el refresh del token cuando expiró.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
