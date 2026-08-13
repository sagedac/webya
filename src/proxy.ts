import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Solo hace de portero de autenticación (¿hay sesión?) — la autorización
// fina (¿esta sesión es admin? ¿es dueña de este tenant?) la deciden las
// políticas RLS una vez dentro, vía el cliente de src/lib/supabase/server.ts.
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const esAdminProtegida = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const esPanelProtegida = /^\/panel\/[^/]+/.test(pathname) && pathname !== "/panel/login";

  if (!user && (esAdminProtegida || esPanelProtegida)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = esAdminProtegida ? "/admin/login" : "/panel/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/panel/:path*"],
};
