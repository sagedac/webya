import { Wordmark } from "@/components/Wordmark";
import { ForgotPasswordForm } from "@/app/forgot-password/_components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 dark:bg-zinc-900">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <Wordmark subtitle="Recuperar contraseña" />
        <p className="mb-6 text-sm text-zinc-500">Te mandamos un link para elegir una nueva.</p>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
