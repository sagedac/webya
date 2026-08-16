"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserPlus, KeyRound, LogOut } from "lucide-react";
import { signOutAdminAction } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Clientes", icon: LayoutDashboard, exact: true },
  { href: "/admin/nuevo", label: "Nuevo cliente", icon: UserPlus, exact: true },
  { href: "/admin/cambiar-password", label: "Contraseña", icon: KeyRound, exact: true },
];

export function Sidebar({ nombre, email }: { nombre: string | null; email: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/[0.06] bg-[#0e1013]">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-extrabold text-black" style={{ backgroundColor: "#ff7a33" }}>
          S
        </div>
        <div className="leading-tight">
          <p className="text-[15px] font-bold tracking-tight text-[#f2efe9]" style={{ fontFamily: "var(--font-bitter)" }}>
            SitioYa
          </p>
          <p className="text-[11px] tracking-wide text-[#f2efe9]/40 uppercase">Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3.5 py-2">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? "text-[#ff7a33]" : "text-[#f2efe9]/55 hover:bg-white/[0.04] hover:text-[#f2efe9]"
              }`}
              style={active ? { backgroundColor: "rgba(255,122,51,0.12)" } : undefined}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] p-3.5">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-xs font-semibold text-[#f2efe9]/80">
            {(nombre ?? email).slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-[#f2efe9]/90">{nombre ?? "Admin"}</p>
            <p className="truncate text-[11px] text-[#f2efe9]/40">{email}</p>
          </div>
        </div>
        <form action={signOutAdminAction}>
          <button
            type="submit"
            className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-[#f2efe9]/55 transition-colors hover:bg-white/[0.04] hover:text-[#f2efe9]"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
