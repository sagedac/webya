import Link from "next/link";
import { getAllSlugs, getTenantBySlug } from "@/lib/tenants";

// Placeholder de raíz. No hay homepage de marketing pública en el alcance
// del primer build (webya.md sección 0, pasos 1-5) — esto solo evita dejar
// el boilerplate de create-next-app y da un link directo a las landings
// activas mientras se define el resto.
export default async function Home() {
  const slugs = await getAllSlugs();
  const tenants = await Promise.all(slugs.map((slug) => getTenantBySlug(slug)));

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center dark:bg-black">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">SitioYa</h1>
      <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
        Landings para negocios locales. Fase 1: ruteo por path, sin dominio propio todavía.
      </p>
      <ul className="flex flex-col gap-2">
        {tenants.map(
          (data) =>
            data && (
              <li key={data.tenant.slug}>
                <Link href={`/${data.tenant.slug}`} className="text-sm font-medium underline underline-offset-4">
                  /{data.tenant.slug} — {data.tenant.nombre}
                </Link>
              </li>
            ),
        )}
      </ul>
    </div>
  );
}
