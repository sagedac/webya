"use client";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import { actualizarContenidoAction } from "@/app/admin/actions";
import { inputClass, labelClass, primaryButtonClass } from "@/lib/form-styles";
import {
  FORMAS_PAGO_DISPONIBLES,
  RUBROS_DISPONIBLES,
  type CategoriaProducto,
  type ColoresMarca,
  type FaqItem,
  type FormaPago,
  type Foto,
  type HorarioDia,
  type Pilar,
  type Rubro,
  type TenantContent,
} from "@/lib/types";

const ESTADO_INICIAL = { error: null };

export function EditorContenido({ tenantId, content }: { tenantId: string; content: TenantContent }) {
  const [state, formAction, isPending] = useActionState(actualizarContenidoAction, ESTADO_INICIAL);

  const [tagline, setTagline] = useState(content.textos.tagline);
  const [descripcion, setDescripcion] = useState(content.textos.descripcion);
  const [diferenciador, setDiferenciador] = useState(content.textos.diferenciador);
  const [direccion, setDireccion] = useState(content.textos.direccion);
  const [telefonoWhatsapp, setTelefonoWhatsapp] = useState(content.telefonoWhatsapp);
  const [precioNota, setPrecioNota] = useState(content.precios.nota);
  const [colores, setColores] = useState<ColoresMarca>(content.coloresMarca);
  const [horarios, setHorarios] = useState<HorarioDia[]>(content.horarios);
  const [categorias, setCategorias] = useState<CategoriaProducto[]>(content.precios.categorias);
  const [fotoDestacada, setFotoDestacada] = useState<Foto>(content.fotoDestacada ?? { url: "", alt: "" });
  const [pilares, setPilares] = useState<Pilar[]>(content.pilares);
  const [pasos, setPasos] = useState<string[]>(content.pasos);
  const [formasPago, setFormasPago] = useState<FormaPago[]>(content.formasPago);
  const [instagramUrl, setInstagramUrl] = useState(content.instagramUrl ?? "");
  const [facebookUrl, setFacebookUrl] = useState(content.facebookUrl ?? "");
  const [faq, setFaq] = useState<FaqItem[]>(content.faq);
  const [rubro, setRubro] = useState<Rubro | "">(content.rubro ?? "");
  const [googleRating, setGoogleRating] = useState(content.googleRating?.toString() ?? "");
  const [googleReviewCount, setGoogleReviewCount] = useState(content.googleReviewCount?.toString() ?? "");

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="tenantId" value={tenantId} />
      <input type="hidden" name="horariosJson" value={JSON.stringify(horarios)} />
      <input type="hidden" name="categoriasJson" value={JSON.stringify(categorias)} />
      <input type="hidden" name="fotoDestacadaJson" value={JSON.stringify(fotoDestacada)} />
      <input type="hidden" name="pilaresJson" value={JSON.stringify(pilares)} />
      <input type="hidden" name="pasosJson" value={JSON.stringify(pasos)} />
      <input type="hidden" name="formasPagoJson" value={JSON.stringify(formasPago)} />
      <input type="hidden" name="faqJson" value={JSON.stringify(faq)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Tagline" name="tagline" value={tagline} onChange={setTagline} />
        <Campo label="Diferenciador" name="diferenciador" value={diferenciador} onChange={setDiferenciador} />
        <Campo label="WhatsApp" name="telefonoWhatsapp" value={telefonoWhatsapp} onChange={setTelefonoWhatsapp} />
        <Campo label="Dirección" name="direccion" value={direccion} onChange={setDireccion} />
      </div>

      <div>
        <label className={labelClass}>Descripción</label>
        <textarea name="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Nota de precios</label>
        <input name="precioNota" value={precioNota} onChange={(e) => setPrecioNota(e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className={`${labelClass} mb-2`}>Foto de producto destacado</label>
        <p className="mb-2 text-xs text-zinc-500">
          La foto que &ldquo;flota&rdquo; en la sección de efecto visual. Mejor resultado con fondo limpio o transparente.
        </p>
        {!content.fotoDestacada && (
          <p className="mb-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            Obligatoria — sin esta foto no vas a poder publicar este tenant.
          </p>
        )}
        <div className="flex gap-2">
          <input
            value={fotoDestacada.url}
            onChange={(e) => setFotoDestacada((prev) => ({ ...prev, url: e.target.value }))}
            placeholder="https://..."
            className={`${inputClass} flex-1`}
          />
          <input
            value={fotoDestacada.alt}
            onChange={(e) => setFotoDestacada((prev) => ({ ...prev, alt: e.target.value }))}
            placeholder="Descripción"
            className={`${inputClass} w-1/3`}
          />
        </div>
      </div>

      <div>
        <label className={`${labelClass} mb-2`}>Colores de marca</label>
        <div className="flex gap-5">
          {(["fondo", "acento", "texto"] as const).map((key) => (
            <div key={key} className="flex flex-col items-center gap-1.5">
              <input
                type="color"
                name={`color${key.charAt(0).toUpperCase()}${key.slice(1)}`}
                value={colores[key]}
                onChange={(e) => setColores((prev) => ({ ...prev, [key]: e.target.value }))}
                className="h-9 w-14 cursor-pointer rounded-md border border-zinc-200 dark:border-zinc-700"
              />
              <span className="text-xs text-zinc-500 capitalize">{key}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className={`${labelClass} mb-2`}>Horario</label>
        <div className="space-y-2">
          {horarios.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={h.dia}
                onChange={(e) => setHorarios((prev) => prev.map((row, idx) => (idx === i ? { ...row, dia: e.target.value } : row)))}
                className={`${inputClass} w-1/2`}
              />
              <input
                value={h.horas}
                onChange={(e) => setHorarios((prev) => prev.map((row, idx) => (idx === i ? { ...row, horas: e.target.value } : row)))}
                className={`${inputClass} w-1/2`}
              />
              <button
                type="button"
                onClick={() => setHorarios((prev) => prev.filter((_, idx) => idx !== i))}
                className="flex w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setHorarios((prev) => [...prev, { dia: "", horas: "" }])}
            className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            Agregar horario
          </button>
        </div>
      </div>

      <div>
        <label className={`${labelClass} mb-2`}>Categorías de producto</label>
        <div className="space-y-3">
          {categorias.map((cat, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={cat.nombre}
                onChange={(e) => setCategorias((prev) => prev.map((row, idx) => (idx === i ? { ...row, nombre: e.target.value } : row)))}
                placeholder="Categoría"
                className={`${inputClass} w-1/3`}
              />
              <input
                value={cat.items.join(", ")}
                onChange={(e) =>
                  setCategorias((prev) =>
                    prev.map((row, idx) =>
                      idx === i
                        ? { ...row, items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }
                        : row,
                    ),
                  )
                }
                placeholder="Productos separados por coma"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => setCategorias((prev) => prev.filter((_, idx) => idx !== i))}
                className="flex w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setCategorias((prev) => [...prev, { nombre: "", items: [] }])}
            className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            Agregar categoría
          </button>
        </div>
      </div>

      <div>
        <label className={`${labelClass} mb-2`}>Por qué elegirnos (3 pilares)</label>
        <p className="mb-2 text-xs text-zinc-500">Sin al menos uno, esta sección no aparece en la landing.</p>
        <div className="space-y-3">
          {pilares.map((pilar, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={pilar.titulo}
                onChange={(e) => setPilares((prev) => prev.map((row, idx) => (idx === i ? { ...row, titulo: e.target.value } : row)))}
                placeholder="Título"
                className={`${inputClass} w-1/3`}
              />
              <input
                value={pilar.descripcion}
                onChange={(e) => setPilares((prev) => prev.map((row, idx) => (idx === i ? { ...row, descripcion: e.target.value } : row)))}
                placeholder="1-2 líneas"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => setPilares((prev) => prev.filter((_, idx) => idx !== i))}
                className="flex w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setPilares((prev) => [...prev, { titulo: "", descripcion: "" }])}
            className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            Agregar pilar
          </button>
        </div>
      </div>

      <div>
        <label className={`${labelClass} mb-2`}>Cómo pedir (pasos)</label>
        <p className="mb-2 text-xs text-zinc-500">Sin personalizar, se muestran 3 pasos genéricos por defecto.</p>
        <div className="space-y-2">
          {pasos.map((paso, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={paso}
                onChange={(e) => setPasos((prev) => prev.map((row, idx) => (idx === i ? e.target.value : row)))}
                placeholder={`Paso ${i + 1}`}
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => setPasos((prev) => prev.filter((_, idx) => idx !== i))}
                className="flex w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setPasos((prev) => [...prev, ""])}
            className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            Agregar paso
          </button>
        </div>
      </div>

      <div>
        <label className={`${labelClass} mb-2`}>Formas de pago</label>
        <div className="flex gap-4">
          {FORMAS_PAGO_DISPONIBLES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-1.5 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={formasPago.includes(value)}
                onChange={(e) =>
                  setFormasPago((prev) => (e.target.checked ? [...prev, value] : prev.filter((f) => f !== value)))
                }
                className="accent-indigo-600"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Instagram (URL)" name="instagramUrl" value={instagramUrl} onChange={setInstagramUrl} />
        <Campo label="Facebook (URL)" name="facebookUrl" value={facebookUrl} onChange={setFacebookUrl} />
      </div>

      <div>
        <label className={`${labelClass} mb-2`}>Preguntas frecuentes (FAQ)</label>
        <p className="mb-2 text-xs text-zinc-500">Sin personalizar, se muestran 3-4 preguntas genéricas por defecto.</p>
        <div className="space-y-3">
          {faq.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={item.pregunta}
                onChange={(e) => setFaq((prev) => prev.map((row, idx) => (idx === i ? { ...row, pregunta: e.target.value } : row)))}
                placeholder="Pregunta"
                className={`${inputClass} w-1/3`}
              />
              <input
                value={item.respuesta}
                onChange={(e) => setFaq((prev) => prev.map((row, idx) => (idx === i ? { ...row, respuesta: e.target.value } : row)))}
                placeholder="Respuesta"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => setFaq((prev) => prev.filter((_, idx) => idx !== i))}
                className="flex w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFaq((prev) => [...prev, { pregunta: "", respuesta: "" }])}
            className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            Agregar pregunta
          </button>
        </div>
      </div>

      <div>
        <label className={`${labelClass} mb-2`}>SEO local (Google)</label>
        <p className="mb-2 text-xs text-zinc-500">
          Para los datos estructurados que ayudan a aparecer mejor en búsquedas de Google. El rating se carga a mano
          desde la ficha de Google del negocio — no se trae automático.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Rubro</label>
            <select name="rubro" value={rubro} onChange={(e) => setRubro(e.target.value as Rubro | "")} className={inputClass}>
              <option value="">Sin especificar</option>
              {RUBROS_DISPONIBLES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <Campo label="Rating de Google" name="googleRating" value={googleRating} onChange={setGoogleRating} />
          <Campo label="Cantidad de reseñas" name="googleReviewCount" value={googleReviewCount} onChange={setGoogleReviewCount} />
        </div>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button type="submit" disabled={isPending} className={primaryButtonClass}>
        {isPending ? "Guardando..." : "Guardar contenido"}
      </button>
    </form>
  );
}

function Campo({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input name={name} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
    </div>
  );
}
