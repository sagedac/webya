import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Convención estándar de shadcn/ui — casi todo componente traído de 21st.dev
// la importa desde "@/lib/utils". Se agrega acá tal cual para no tener que
// reescribir cada componente adaptado.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
