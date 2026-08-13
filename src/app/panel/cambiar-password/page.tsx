import { CambiarPasswordForm } from "@/components/CambiarPasswordForm";

export default function PanelCambiarPasswordPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-xl font-semibold">Cambiar contraseña</h1>
      <div className="max-w-sm rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <CambiarPasswordForm />
      </div>
    </div>
  );
}
