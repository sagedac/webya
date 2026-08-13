import { CambiarPasswordForm } from "@/components/CambiarPasswordForm";

export default function AdminCambiarPasswordPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Cambiar contraseña</h1>
        <p className="mt-1 text-sm text-zinc-500">Actualiza la contraseña de tu cuenta de administrador.</p>
      </div>
      <div className="max-w-sm rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <CambiarPasswordForm />
      </div>
    </div>
  );
}
