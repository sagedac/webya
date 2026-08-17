import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Fase 2 del ruteo (webya.md sección 5): dominio propio de la plataforma
// con un subdominio por tenant ("{slug}.tudominio.com" en vez de
// "sitioya.vercel.app/{slug}"), reescrito internamente a la misma ruta que
// ya sirve Fase 1 (/{slug}) — el componente de cada tenant no cambia en
// absoluto, solo la URL que ve el visitante.
//
// Queda inactivo (no-op, Fase 1 sigue funcionando exactamente igual) hasta
// que exista `NEXT_PUBLIC_SITE_URL` en el entorno (Vercel) — variable ya
// anticipada en el comentario de getBaseUrl(), src/app/[slug]/page.tsx.
// Para activarlo hace falta, fuera de este código:
//   1. Tener un dominio propio comprado (ej. sitioya.com — sigue
//      "tentativo" en webya.md sección 4, hay que confirmarlo).
//   2. Agregarlo al proyecto de Vercel junto con el wildcard "*.dominio"
//      (Vercel → Settings → Domains) y apuntar su DNS ahí.
//   3. Definir NEXT_PUBLIC_SITE_URL=https://tudominio.com en las variables
//      de entorno de Vercel (y en .env.local si se prueba en local).
// Ninguno de esos 3 pasos es de código — son decisiones/acciones de Paul
// (comprar dominio, acceso a su cuenta de Vercel/registrador).
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const DOMINIO_PLATAFORMA = SITE_URL ? new URL(SITE_URL).host : undefined;

// Subdominios que nunca se interpretan como slug de tenant, aunque
// existiera un tenant con ese mismo slug (no debería, pero por si acaso).
const SUBDOMINIOS_RESERVADOS = new Set(["www", "admin", "panel"]);

// "toyres.sitioya.com" -> "toyres". null si el host no es un subdominio de
// la plataforma (ej. sitioya.vercel.app en Fase 1, o el dominio raíz sin
// subdominio, que sigue sirviendo la landing de marketing de "/").
function resolverSlugDeSubdominio(host: string): string | null {
  if (!DOMINIO_PLATAFORMA) return null;
  const hostSinPuerto = host.split(":")[0];
  if (hostSinPuerto === DOMINIO_PLATAFORMA) return null;
  if (!hostSinPuerto.endsWith(`.${DOMINIO_PLATAFORMA}`)) return null;
  const sub = hostSinPuerto.slice(0, -(DOMINIO_PLATAFORMA.length + 1));
  if (!sub || sub.includes(".") || SUBDOMINIOS_RESERVADOS.has(sub)) return null;
  return sub;
}

// Solo hace de portero de autenticación (¿hay sesión?) — la autorización
// fina (¿esta sesión es admin? ¿es dueña de este tenant?) la deciden las
// políticas RLS una vez dentro, vía el cliente de src/lib/supabase/server.ts.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Reescritura de subdominio de tenant (Fase 2) — se resuelve antes de
  // tocar la sesión de Supabase, no hace falta saber quién visita para
  // esto.
  const slugTenant = resolverSlugDeSubdominio(request.headers.get("host") ?? "");
  if (slugTenant && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${slugTenant}`;
    return NextResponse.rewrite(url);
  }

  const esAdminProtegida = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const esPanelProtegida = /^\/panel\/[^/]+/.test(pathname) && pathname !== "/panel/login";
  const esRutaDeAuth = pathname.startsWith("/admin") || pathname.startsWith("/panel");

  // Fuera de /admin y /panel no hace falta refrescar la sesión de
  // Supabase — la landing de marketing y las páginas de tenant son
  // públicas y su autorización la deciden las políticas RLS al leer los
  // datos, no el proxy. Evita pagar ese round-trip en cada visita a "/"
  // (necesario en el matcher solo para poder interceptar subdominios).
  if (!esRutaDeAuth) {
    return NextResponse.next();
  }

  const { response, user } = await updateSession(request);

  if (!user && (esAdminProtegida || esPanelProtegida)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = esAdminProtegida ? "/admin/login" : "/panel/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/panel/:path*", "/"],
};
