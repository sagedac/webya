"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  actualizarContenido,
  actualizarDominio,
  actualizarEstado,
  crearTenant,
  getTenantById,
} from "@/lib/admin-tenants";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { CategoriaProducto, ColoresMarca, DominioTipo, EstadoLanding, FaqItem, FormaPago, Foto, HorarioDia, Nivel, Pilar, Rubro, Plan } from "@/lib/types";

export async function signOutAdminAction(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export interface GenerarAccesoState {
  error: string | null;
  credenciales: { email: string; password: string } | null;
}

function generarPasswordTemporal(): string {
  return randomBytes(9).toString("base64url");
}

// Único lugar (además de src/lib/supabase/admin.ts en sí) que todavía usa
// la service_role key para escribir: auth.admin.createUser es un endpoint
// administrativo de GoTrue, no una tabla — no existe forma de crearlo vía
// RLS/anon. Por eso se verifica "a mano" que quien llama es admin antes de
// usarla, en vez de confiar en que solo un admin pueda llegar hasta acá.
export async function generarAccesoAction(_prevState: GenerarAccesoState, formData: FormData): Promise<GenerarAccesoState> {
  const tenantId = String(formData.get("tenantId") ?? "");
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "El email es obligatorio.", credenciales: null };

  const supabase = await createServerSupabaseClient();
  const {
    data: { user: caller },
  } = await supabase.auth.getUser();
  if (!caller) return { error: "Sesión inválida.", credenciales: null };

  const { data: adminRow } = await supabase.from("admins").select("id").eq("id", caller.id).maybeSingle();
  if (!adminRow) return { error: "Solo un admin puede generar accesos.", credenciales: null };

  const password = generarPasswordTemporal();
  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    return { error: createError?.message ?? "No se pudo crear la cuenta.", credenciales: null };
  }

  // El insert en tenant_users va por el cliente de sesión (no supabaseAdmin):
  // ya confirmamos arriba que quien llama es admin, así que
  // tenant_users_admin_all lo permite igual, manteniendo la escritura
  // gobernada por RLS en vez de saltársela sin necesidad.
  const { error: linkError } = await supabase.from("tenant_users").insert({ user_id: created.user.id, tenant_id: tenantId });
  if (linkError) return { error: linkError.message, credenciales: null };

  return { error: null, credenciales: { email, password } };
}

export interface AccionState {
  error: string | null;
}

function parseHorarios(json: string): HorarioDia[] {
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return [];
    return arr.filter((h) => h && typeof h.dia === "string" && typeof h.horas === "string");
  } catch {
    return [];
  }
}

// undefined (campo ausente del form, tenant no es nivel 3) significa "no
// tocar este campo" — distinto de null (URL vacía enviada a propósito,
// "quitar la foto"). admin-tenants.ts actualizarContenido distingue los
// dos casos con un chequeo !== undefined.
function parseFotoDestacada(json: FormDataEntryValue | null): Foto | null | undefined {
  if (json === null) return undefined;
  try {
    const foto = JSON.parse(String(json));
    if (!foto || typeof foto.url !== "string" || !foto.url.trim()) return null;
    return { url: foto.url, alt: typeof foto.alt === "string" ? foto.alt : "" };
  } catch {
    return null;
  }
}

function parsePilares(json: string): Pilar[] {
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return [];
    return arr.filter((p) => p && typeof p.titulo === "string" && typeof p.descripcion === "string" && p.titulo.trim());
  } catch {
    return [];
  }
}

function parsePasos(json: string): string[] {
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return [];
    return arr.filter((p): p is string => typeof p === "string" && p.trim().length > 0);
  } catch {
    return [];
  }
}

const FORMAS_PAGO_VALIDAS = new Set<FormaPago>(["efectivo", "transferencia", "tarjeta"]);
function parseFormasPago(json: string): FormaPago[] {
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return [];
    return arr.filter((f): f is FormaPago => FORMAS_PAGO_VALIDAS.has(f));
  } catch {
    return [];
  }
}

function parseFaq(json: string): FaqItem[] {
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return [];
    return arr.filter((p) => p && typeof p.pregunta === "string" && typeof p.respuesta === "string" && p.pregunta.trim());
  } catch {
    return [];
  }
}

const RUBROS_VALIDOS = new Set<Rubro>(["restaurante", "cafeteria", "panaderia", "carniceria_tienda", "tienda_retail", "servicios", "otro"]);
function parseRubro(raw: FormDataEntryValue | null): Rubro | null {
  const value = String(raw ?? "").trim();
  return RUBROS_VALIDOS.has(value as Rubro) ? (value as Rubro) : null;
}

// number(...) de un input vacío da NaN, no 0 — hay que distinguirlo de
// "el admin puso 0" a propósito.
function parseNumeroOpcional(raw: FormDataEntryValue | null): number | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function crearTenantAction(_prevState: AccionState, formData: FormData): Promise<AccionState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const plan = String(formData.get("plan") ?? "template") as Plan;
  const nivelRaw = formData.get("nivel");
  const nivel = nivelRaw ? (Number(nivelRaw) as Nivel) : null;
  const plantillaId = plan === "template" ? String(formData.get("plantillaId") ?? "") || null : null;
  const telefonoWhatsapp = String(formData.get("telefonoWhatsapp") ?? "").trim();
  const direccion = String(formData.get("direccion") ?? "").trim();
  const horarios = parseHorarios(String(formData.get("horariosJson") ?? "[]"));

  if (!nombre || !slug) {
    return { error: "Nombre y slug son obligatorios." };
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return { error: "El slug solo puede tener minúsculas, números y guiones." };
  }

  let nuevoId: string;
  try {
    const nuevo = await crearTenant({ nombre, slug, plan, nivel, plantillaId, telefonoWhatsapp, direccion, horarios });
    nuevoId = nuevo.tenant.id;
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath("/admin");
  redirect(`/admin/${nuevoId}`);
}

export async function actualizarContenidoAction(_prevState: AccionState, formData: FormData): Promise<AccionState> {
  const tenantId = String(formData.get("tenantId") ?? "");
  if (!(await getTenantById(tenantId))) return { error: "Tenant no encontrado." };

  const categorias: CategoriaProducto[] = (() => {
    try {
      const arr = JSON.parse(String(formData.get("categoriasJson") ?? "[]"));
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  })();

  const coloresMarca: ColoresMarca = {
    fondo: String(formData.get("colorFondo") ?? "#1a1a1a"),
    acento: String(formData.get("colorAcento") ?? "#d2a75a"),
    texto: String(formData.get("colorTexto") ?? "#f5ecd9"),
  };

  try {
    await actualizarContenido(tenantId, {
      textos: {
        tagline: String(formData.get("tagline") ?? ""),
        descripcion: String(formData.get("descripcion") ?? ""),
        diferenciador: String(formData.get("diferenciador") ?? ""),
        direccion: String(formData.get("direccion") ?? ""),
      },
      precios: {
        nota: String(formData.get("precioNota") ?? ""),
        categorias,
      },
      horarios: parseHorarios(String(formData.get("horariosJson") ?? "[]")),
      telefonoWhatsapp: String(formData.get("telefonoWhatsapp") ?? ""),
      coloresMarca,
      fotoDestacada: parseFotoDestacada(formData.get("fotoDestacadaJson")),
      pilares: parsePilares(String(formData.get("pilaresJson") ?? "[]")),
      pasos: parsePasos(String(formData.get("pasosJson") ?? "[]")),
      formasPago: parseFormasPago(String(formData.get("formasPagoJson") ?? "[]")),
      instagramUrl: String(formData.get("instagramUrl") ?? "").trim() || null,
      facebookUrl: String(formData.get("facebookUrl") ?? "").trim() || null,
      faq: parseFaq(String(formData.get("faqJson") ?? "[]")),
      rubro: parseRubro(formData.get("rubro")),
      googleRating: parseNumeroOpcional(formData.get("googleRating")),
      googleReviewCount: parseNumeroOpcional(formData.get("googleReviewCount")),
    });
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath(`/admin/${tenantId}`);
  revalidatePath("/");
  return { error: null };
}

// Ya no hay un bloqueo automático de "falta foto_destacada" acá. Existía
// porque el nivel 3/EXPERIENCE garantizaba una sección ProductVisual en
// TODA página — pero desde que se retiró la estructura de secciones
// predeterminada (webya.md sección 2, 2026-08-13) no se puede asumir que
// una página use ProductVisual solo porque existe: cada página de código
// a medida decide su propia estructura, y no hay ningún campo que registre
// "esta página usa ProductVisual" para condicionar el bloqueo
// correctamente. Revisar manualmente antes de publicar (o durante el Paso
// 7 del agente que construyó la página) sigue siendo necesario si esa
// página en particular sí depende de una foto destacada.
export async function actualizarEstadoAction(_prevState: AccionState, formData: FormData): Promise<AccionState> {
  const tenantId = String(formData.get("tenantId") ?? "");
  const estado = String(formData.get("estado") ?? "") as EstadoLanding;

  await actualizarEstado(tenantId, estado);
  revalidatePath(`/admin/${tenantId}`);
  revalidatePath("/admin");
  revalidatePath("/");
  return { error: null };
}

export async function actualizarDominioAction(_prevState: AccionState, formData: FormData): Promise<AccionState> {
  const tenantId = String(formData.get("tenantId") ?? "");
  const dominioTipo = String(formData.get("dominioTipo") ?? "subdominio") as DominioTipo;
  const dominioCustomRaw = String(formData.get("dominioCustom") ?? "").trim();
  const dominioCustom = dominioTipo === "dominio_propio" && dominioCustomRaw ? dominioCustomRaw : null;

  if (dominioTipo === "dominio_propio" && !dominioCustom) {
    return { error: "Especifica el dominio custom." };
  }

  try {
    await actualizarDominio(tenantId, dominioTipo, dominioCustom);
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath(`/admin/${tenantId}`);
  return { error: null };
}
