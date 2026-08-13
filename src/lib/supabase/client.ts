import { createClient } from "@supabase/supabase-js";

// Cliente con la anon key: respeta RLS (ver /supabase/migrations). Válido
// tanto en Server Components como en el navegador — no hay nada secreto
// aquí, la anon key está diseñada para exponerse en el cliente.
//
// TODO: cuando se implemente login real de Supabase Auth (admin y panel de
// autoedición), este cliente simple se reemplaza por el patrón de
// @supabase/ssr (cliente de browser + cliente de servidor con cookies),
// necesario para que las policies que dependen de auth.uid() funcionen con
// sesión. Mientras tanto sirve para lectura/escritura pública gobernada
// por las políticas "anon"/"authenticated" ya escritas.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
