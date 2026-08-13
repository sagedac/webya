import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Wordmark } from "@/components/Wordmark";
import { ResetPasswordForm } from "@/app/reset-password/_components/ResetPasswordForm";

// Solo llega aquí con una sesión válida: /auth/callback la deja puesta
// después de canjear el `code` del link de recuperación. Sin sesión no
// hay forma legítima de haber llegado (el link expiró, ya se usó, o
// alguien entró directo a la URL).
export default async function ResetPasswordPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/forgot-password");

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 dark:bg-zinc-900">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <Wordmark subtitle={`Contraseña nueva para ${user.email}`} />
        <ResetPasswordForm />
      </div>
    </div>
  );
}
