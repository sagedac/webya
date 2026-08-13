// Clases Tailwind compartidas entre los formularios del admin y del panel
// de autoedición, para que todos los inputs se vean consistentes.
export const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-indigo-950";

export const labelClass = "mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

export const primaryButtonClass =
  "flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40";

export const secondaryButtonClass =
  "flex items-center gap-1.5 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900";
