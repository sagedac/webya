import { Wordmark } from "@/components/Wordmark";
import { LoginForm } from "@/app/admin/login/_components/LoginForm";

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/admin";

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 dark:bg-zinc-900">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <Wordmark subtitle="Panel administrador" />
        <LoginForm next={next} />
      </div>
    </div>
  );
}
