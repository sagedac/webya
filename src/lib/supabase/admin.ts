import "server-only";
import { createClient } from "@supabase/supabase-js";

// Cliente con la service_role key: salta TODAS las políticas RLS. Por eso
// el `import "server-only"` de arriba — Next.js falla el build si algún
// Client Component llega a importar este archivo, así este key nunca
// puede terminar en el bundle del navegador.
//
// Es un puente temporal: is_admin() / is_tenant_owner() en las políticas
// RLS (ver /supabase/migrations/20260810120400_helper_functions.sql)
// dependen de auth.uid(), que no existe sin una sesión real de Supabase
// Auth. Mientras el panel admin y el de autoedición no tengan login,
// operan con este cliente. Cuando se implemente Auth, estas escrituras
// deberían volver a pasar por el cliente con sesión del usuario y dejar de
// depender de la service_role key.
export const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});
