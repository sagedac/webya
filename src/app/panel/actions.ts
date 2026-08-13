"use server";

import { revalidatePath } from "next/cache";
import { actualizarContenido, getTenantBySlugAdmin } from "@/lib/admin-tenants";
import type { CategoriaProducto, FaqItem, FormaPago, Foto, HorarioDia, Pilar } from "@/lib/types";

export interface AccionState {
  error: string | null;
}

function parseJsonArray<T>(json: string): T[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

// undefined (campo ausente, tenant no es nivel 3) = "no tocar"; null (URL
// vacía enviada a propósito) = "quitar la foto". Mismo criterio que
// src/app/admin/actions.ts.
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

// Campos que el doc (webya.md sección 5) le da al cliente: "precios,
// textos, horarios, WhatsApp, fotos" + los bloques de confianza/info
// (pilares, pasos, formas de pago, redes, FAQ) sumados 2026-08-11, que son
// contenido común a los 3 niveles, no identidad de marca. Deliberadamente
// NO toca colores_marca (decisión de diseño), estado_landing/dominio
// (control exclusivo del admin), ni rubro/rating de Google (datos de SEO
// que el admin cura a mano, no autoedición) — misma frontera que separan
// las políticas RLS tenant_content_owner_update vs tenants_admin_all.
export async function actualizarContenidoClienteAction(_prevState: AccionState, formData: FormData): Promise<AccionState> {
  const slug = String(formData.get("slug") ?? "");
  const data = await getTenantBySlugAdmin(slug);
  if (!data) return { error: "Negocio no encontrado." };

  const categorias = parseJsonArray<CategoriaProducto>(String(formData.get("categoriasJson") ?? "[]"));
  const horarios = parseJsonArray<HorarioDia>(String(formData.get("horariosJson") ?? "[]"));
  const fotos = parseJsonArray<Foto>(String(formData.get("fotosJson") ?? "[]"));

  try {
    await actualizarContenido(data.tenant.id, {
      textos: {
        ...data.content.textos,
        tagline: String(formData.get("tagline") ?? ""),
        descripcion: String(formData.get("descripcion") ?? ""),
        diferenciador: String(formData.get("diferenciador") ?? ""),
        direccion: String(formData.get("direccion") ?? ""),
      },
      precios: {
        nota: String(formData.get("precioNota") ?? ""),
        categorias,
      },
      horarios,
      telefonoWhatsapp: String(formData.get("telefonoWhatsapp") ?? ""),
      fotos,
      fotoDestacada: parseFotoDestacada(formData.get("fotoDestacadaJson")),
      pilares: parsePilares(String(formData.get("pilaresJson") ?? "[]")),
      pasos: parsePasos(String(formData.get("pasosJson") ?? "[]")),
      formasPago: parseFormasPago(String(formData.get("formasPagoJson") ?? "[]")),
      instagramUrl: String(formData.get("instagramUrl") ?? "").trim() || null,
      facebookUrl: String(formData.get("facebookUrl") ?? "").trim() || null,
      faq: parseFaq(String(formData.get("faqJson") ?? "[]")),
    });
  } catch (e) {
    return { error: (e as Error).message };
  }

  // La landing pública lee de la misma base, así que el cambio ya es
  // visible; revalidatePath solo limpia el cache de Next para ese path.
  revalidatePath(`/${slug}`);
  revalidatePath(`/panel/${slug}`);
  return { error: null };
}
