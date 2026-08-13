"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserPlus, KeyRound, LogOut, Store } from "lucide-react";
import { signOutAdminAction } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Clientes", icon: LayoutDashboard, exact: true },
  { href: "/admin/nuevo", label: "Nuevo cliente", icon: UserPlus, exact: true },
  { href: "/admin/cambiar-password", label: "Contraseña", icon: KeyRound, exact: true },
];

export function Sidebar({ nombre, email }: { nombre: string | null; email: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 text-zinc-100">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
          <Store className="h-4.5 w-4.5 text-white" strokeWidth={2.25} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">SitioYa</p>
          <p className="text-[11px] text-zinc-500">Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-indigo-500/15 text-indigo-300" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800 p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300">
            {(nombre ?? email).slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-zinc-200">{nombre ?? "Admin"}</p>
            <p className="truncate text-[11px] text-zinc-500">{email}</p>
          </div>
        </div>
        <form action={signOutAdminAction}>
          <button
            type="submit"
            className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
