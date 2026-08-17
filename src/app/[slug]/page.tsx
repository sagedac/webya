import { existsSync } from "node:fs";
import path from "node:path";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getTenantBySlug } from "@/lib/tenants";
import { REGISTRO_CUSTOM } from "@/custom/registro";

// Favicon por tenant: cada página de negocio (src/custom/{slug}/) ya busca
// su logo en public/tenants/{slug}/ con esta misma lista de nombres
// candidatos (patrón `foto()` ya usado en jmj, moonvet, etc.) — reusar el
// mismo archivo como favicon evita mantener una segunda copia o una
// convención aparte. Si el tenant no tiene ninguno de estos archivos
// todavía, `icons` queda sin definir y Next cae solo al favicon.ico global
// de src/app/ (el ícono genérico que ya usan todas las páginas hoy).
const CANDIDATOS_FAVICON = ["logo.png", "logo.jpg", "logo-mark.png", "favicon.png", "favicon.ico"];

function faviconDelTenant(slug: string): string | undefined {
  for (const archivo of CANDIDATOS_FAVICON) {
    if (existsSync(path.join(process.cwd(), "public", "tenants", slug, archivo))) {
      return `/tenants/${slug}/${archivo}`;
    }
  }
  return undefined;
}

// Fase 1 del ruteo (webya.md sección 5): sitioya.vercel.app/{slug}, sin
// dominio propio de la plataforma todavía.
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// x-forwarded-proto lo pone Vercel (y cualquier proxy real) automático;
// en dev local no existe, así que cae a http. No hay NEXT_PUBLIC_SITE_URL
// configurada todavía porque en Fase 1 no hay dominio propio de la
// plataforma — se arma desde el host real de cada request.
async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "production" ? "https" : "http");
  return `${proto}://${host}`;
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getTenantBySlug(slug);
  if (!data) return {};

  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/${slug}`;
  const fotoHero = data.content.fotos[0]?.url;
  const imagen = fotoHero ? (fotoHero.startsWith("http") ? fotoHero : `${baseUrl}${fotoHero}`) : undefined;

  const favicon = faviconDelTenant(slug);

  return {
    title: data.tenant.nombre,
    description: data.content.textos.descripcion,
    icons: favicon ? { icon: favicon } : undefined,
    openGraph: {
      title: data.tenant.nombre,
      description: data.content.textos.descripcion,
      url,
      type: "website",
      images: imagen ? [{ url: imagen }] : undefined,
    },
  };
}

export default async function TenantPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const data = await getTenantBySlug(slug);

  // Borradores y tenants pausados no son visibles públicamente — misma
  // regla que la política RLS "tenants_public_select_published".
  if (!data || data.tenant.estadoLanding !== "publicado") {
    notFound();
  }

  // Tenants custom_code no tienen plantillaId — su página es un componente
  // a medida registrado en src/custom/registro.ts (webya.md sección 5).
  if (data.tenant.plan === "custom_code") {
    const CustomPage = REGISTRO_CUSTOM[slug];
    if (!CustomPage) notFound();
    return <CustomPage {...data} />;
  }

  // Reset del catálogo de plantillas (webya.md sección 5, 2026-08-12): no
  // existe ni va a reconstruirse un sistema de plantillas reutilizables —
  // cada negocio nuevo nace como plan="custom_code" (ver más arriba). Un
  // tenant plan="template" (legado, de antes del reset) cae acá y da 404.
  notFound();
}
