import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { signOutAdminAction } from "@/app/admin/actions";
import { Sidebar } from "@/app/admin/(protected)/_components/Sidebar";

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
      <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-3 bg-zinc-50 px-6 text-center dark:bg-zinc-950">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Esta cuenta ({user.email}) no tiene permiso de administrador.
        </p>
        <form action={signOutAdminAction}>
          <button type="submit" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
            Cerrar sesión
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <Sidebar nombre={adminRow.nombre} email={user.email ?? ""} />
      <main className="flex-1 overflow-x-hidden px-8 py-8 lg:px-12">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
