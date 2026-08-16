import { redirect } from "next/navigation";
import { Bitter, Work_Sans } from "next/font/google";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { signOutAdminAction } from "@/app/admin/actions";
import { Sidebar } from "@/app/admin/(protected)/_components/Sidebar";

// Identidad visual propia del panel admin (2026-08-16, pedido explícito de
// Paul: "acopla también el dashboard del admin, se ve muy regular") — mismo
// criterio de marca que la landing de 26st (src/marketing/26st/Home26st.tsx):
// tema oscuro fijo + acento cálido, en vez del zinc/indigo genérico de
// boilerplate que tenía antes. A propósito NO se ligó al toggle de
// prefers-color-scheme del sistema (`dark:` de Tailwind, ver globals.css) —
// ese mecanismo es el que hacía que el panel se viera "regular" solo por
// heredar lo que sea que tenga configurado el sistema operativo de quien lo
// abra, en vez de una identidad propia y consistente. Alcance acotado a
// este layout + Sidebar + dashboard de clientes (lo que Paul mostró en la
// captura) — los formularios internos (editor de contenido, alta de
// cliente, etc.) no se tocaron, siguen con su estilo zinc/indigo actual
// dentro de `<main>`; llevarlos a este mismo sistema es un cambio aparte.
const bitter = Bitter({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-bitter" });
const workSans = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-work-sans" });

// Panel administrador (webya.md sección 5): acceso total a todos los
// tenants, uso interno de Paul (y futuro equipo).
//
// El proxy (src/proxy.ts) ya garantiza que quien llega aquí tiene una
// sesión válida — lo que falta verificar es que esa sesión sea
// específicamente de un admin (tabla `admins`), no de un cliente con
// panel de autoedición. Sin esto, un cliente logueado que navegue a /admin
// vería errores confusos de RLS en vez de un mensaje claro.
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: adminRow } = await supabase.from("admins").select("nombre").eq("id", user.id).maybeSingle();

  if (!adminRow) {
    return (
      <div className={`${workSans.variable} flex min-h-screen flex-1 flex-col items-center justify-center gap-3 bg-[#0b0c0e] px-6 text-center font-sans text-[#f2efe9]`}>
        <p className="text-sm text-[#f2efe9]/60">Esta cuenta ({user.email}) no tiene permiso de administrador.</p>
        <form action={signOutAdminAction}>
          <button type="submit" className="text-sm text-[#ff7a33] hover:underline">
            Cerrar sesión
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={`${bitter.variable} ${workSans.variable} flex min-h-screen bg-[#0b0c0e] font-sans text-[#f2efe9]`}>
      <Sidebar nombre={adminRow.nombre} email={user.email ?? ""} />
      <main className="flex-1 overflow-x-hidden px-8 py-8 lg:px-12">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
