"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

// Formulario de contacto de la landing de marketing de 26st (src/app/page.tsx)
// — sin WhatsApp/teléfono propio para esta landing todavía (a diferencia de
// los tenants), así que el lead se guarda en landing_leads (migración
// 20260816150000) para revisión manual. Usa el cliente con sesión (anon key,
// createServerSupabaseClient) en vez de supabaseAdmin: no requiere estar
// autenticado — la policy "landing_leads_public_insert" permite el insert a
// `anon` directamente, mismo patrón RLS-first del resto del proyecto (nunca
// saltarse RLS con service_role cuando la policy correcta ya lo resuelve).
export interface LeadFormState {
  error: string | null;
  ok: boolean;
}

export async function enviarLeadAction(_prevState: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const contacto = String(formData.get("contacto") ?? "").trim();
  const mensaje = String(formData.get("mensaje") ?? "").trim();

  if (!nombre || !contacto) {
    return { error: "Nombre y un correo o teléfono son obligatorios.", ok: false };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("landing_leads").insert({
    nombre,
    contacto,
    mensaje: mensaje || null,
  });

  if (error) {
    return { error: "No se pudo enviar. Intenta de nuevo en un momento.", ok: false };
  }

  return { error: null, ok: true };
}
