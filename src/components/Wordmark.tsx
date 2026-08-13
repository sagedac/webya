import { Store } from "lucide-react";

export function Wordmark({ subtitle }: { subtitle?: string }) {
  return (
    <div className="mb-6 flex flex-col items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 shadow-sm shadow-indigo-500/30">
        <Store className="h-5 w-5 text-white" strokeWidth={2.25} />
      </div>
      <div className="text-center leading-tight">
        <p className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">SitioYa</p>
        {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
      </div>
    </div>
  );
}
