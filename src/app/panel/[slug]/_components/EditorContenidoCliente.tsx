"use client";

import { useActionState, useState } from "react";
import { actualizarContenidoClienteAction } from "@/app/panel/actions";
import { FORMAS_PAGO_DISPONIBLES, type CategoriaProducto, type FaqItem, type FormaPago, type Foto, type HorarioDia, type Nivel, type Pilar, type TenantContent } from "@/lib/types";

const ESTADO_INICIAL = { error: null };

export function EditorContenidoCliente({
  slug,
  content,
  nivel,
}: {
  slug: string;
  content: TenantContent;
  nivel: Nivel | null;
}) {
  const [state, formAction, isPending] = useActionState(actualizarContenidoClienteAction, ESTADO_INICIAL);

  const [tagline, setTagline] = useState(content.textos.tagline);
  const [descripcion, setDescripcion] = useState(content.textos.descripcion);
  const [diferenciador, setDiferenciador] = useState(content.textos.diferenciador);
  const [direccion, setDireccion] = useState(content.textos.direccion);
  const [telefonoWhatsapp, setTelefonoWhatsapp] = useState(content.telefonoWhatsapp);
  const [precioNota, setPrecioNota] = useState(content.precios.nota);
  const [horarios, setHorarios] = useState<HorarioDia[]>(content.horarios);
  const [categorias, setCategorias] = useState<CategoriaProducto[]>(content.precios.categorias);
  const [fotos, setFotos] = useState<Foto[]>(content.fotos);
  const [fotoDestacada, setFotoDestacada] = useState<Foto>(content.fotoDestacada ?? { url: "", alt: "" });
  const [pilares, setPilares] = useState<Pilar[]>(content.pilares);
  const [pasos, setPasos] = useState<string[]>(content.pasos);
  const [formasPago, setFormasPago] = useState<FormaPago[]>(content.formasPago);
  const [instagramUrl, setInstagramUrl] = useState(content.instagramUrl ?? "");
  const [facebookUrl, setFacebookUrl] = useState(content.facebookUrl ?? "");
  const [faq, setFaq] = useState<FaqItem[]>(content.faq);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="horariosJson" value={JSON.stringify(horarios)} />
      <input type="hidden" name="categoriasJson" value={JSON.stringify(categorias)} />
      <input type="hidden" name="fotosJson" value={JSON.stringify(fotos)} />
      {nivel === 3 && <input type="hidden" name="fotoDestacadaJson" value={JSON.stringify(fotoDestacada)} />}
      <input type="hidden" name="pilaresJson" value={JSON.stringify(pilares)} />
      <input type="hidden" name="pasosJson" value={JSON.stringify(pasos)} />
      <input type="hidden" name="formasPagoJson" value={JSON.stringify(formasPago)} />
      <input type="hidden" name="faqJson" value={JSON.stringify(faq)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Frase corta (tagline)" name="tagline" value={tagline} onChange={setTagline} />
        <Campo label="Qué te distingue" name="diferenciador" value={diferenciador} onChange={setDiferenciador} />
        <Campo label="WhatsApp" name="telefonoWhatsapp" value={telefonoWhatsapp} onChange={setTelefonoWhatsapp} />
        <Campo label="Dirección" name="direccion" value={direccion} onChange={setDireccion} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Descripción del negocio</label>
        <textarea
          name="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Nota sobre precios</label>
        <input
          value={precioNota}
          onChange={(e) => setPrecioNota(e.target.value)}
          name="precioNota"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Horario</label>
        <div className="space-y-2">
          {horarios.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={h.dia}
                onChange={(e) =>
                  setHorarios((prev) => prev.map((row, idx) => (idx === i ? { ...row, dia: e.target.value } : row)))
                }
                className="w-1/2 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <input
                value={h.horas}
                onChange={(e) =>
                  setHorarios((prev) => prev.map((row, idx) => (idx === i ? { ...row, horas: e.target.value } : row)))
                }
                className="w-1/2 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <button
                type="button"
                onClick={() => setHorarios((prev) => prev.filter((_, idx) => idx !== i))}
                className="px-2 text-sm text-zinc-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setHorarios((prev) => [...prev, { dia: "", horas: "" }])}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            + Agregar horario
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Productos por categoría</label>
        <div className="space-y-3">
          {categorias.map((cat, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={cat.nombre}
                onChange={(e) =>
                  setCategorias((prev) => prev.map((row, idx) => (idx === i ? { ...row, nombre: e.target.value } : row)))
                }
                placeholder="Categoría"
                className="w-1/3 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
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
                className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <button
                type="button"
                onClick={() => setCategorias((prev) => prev.filter((_, idx) => idx !== i))}
                className="px-2 text-sm text-zinc-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setCategorias((prev) => [...prev, { nombre: "", items: [] }])}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            + Agregar categoría
          </button>
        </div>
      </div>

      {nivel === 3 && (
        <div>
          <label className="mb-2 block text-sm font-medium">Foto de producto destacado (EXPERIENCE)</label>
          <p className="mb-2 text-xs text-zinc-500">
            La foto que &ldquo;flota&rdquo; en la sección de efecto visual de tu landing. Mejor resultado con fondo
            limpio o transparente.
          </p>
          <div className="flex gap-2">
            <input
              value={fotoDestacada.url}
              onChange={(e) => setFotoDestacada((prev) => ({ ...prev, url: e.target.value }))}
              placeholder="https://..."
              className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <input
              value={fotoDestacada.alt}
              onChange={(e) => setFotoDestacada((prev) => ({ ...prev, alt: e.target.value }))}
              placeholder="Descripción"
              className="w-1/3 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium">Fotos</label>
        <p className="mb-2 text-xs text-zinc-500">
          Subida de archivos pendiente de Supabase Storage — por ahora pega la URL de la foto. La primera foto se usa
          como fondo del hero de tu landing.
        </p>
        <div className="space-y-2">
          {fotos.map((foto, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={foto.url}
                onChange={(e) =>
                  setFotos((prev) => prev.map((row, idx) => (idx === i ? { ...row, url: e.target.value } : row)))
                }
                placeholder="https://..."
                className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <input
                value={foto.alt}
                onChange={(e) =>
                  setFotos((prev) => prev.map((row, idx) => (idx === i ? { ...row, alt: e.target.value } : row)))
                }
                placeholder="Descripción"
                className="w-1/3 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <button
                type="button"
                onClick={() => setFotos((prev) => prev.filter((_, idx) => idx !== i))}
                className="px-2 text-sm text-zinc-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFotos((prev) => [...prev, { url: "", alt: "" }])}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            + Agregar foto
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Por qué elegirte (3 pilares)</label>
        <p className="mb-2 text-xs text-zinc-500">Sin al menos uno, esta sección no aparece en tu landing.</p>
        <div className="space-y-3">
          {pilares.map((pilar, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={pilar.titulo}
                onChange={(e) => setPilares((prev) => prev.map((row, idx) => (idx === i ? { ...row, titulo: e.target.value } : row)))}
                placeholder="Título"
                className="w-1/3 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <input
                value={pilar.descripcion}
                onChange={(e) =>
                  setPilares((prev) => prev.map((row, idx) => (idx === i ? { ...row, descripcion: e.target.value } : row)))
                }
                placeholder="1-2 líneas"
                className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <button
                type="button"
                onClick={() => setPilares((prev) => prev.filter((_, idx) => idx !== i))}
                className="px-2 text-sm text-zinc-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setPilares((prev) => [...prev, { titulo: "", descripcion: "" }])}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            + Agregar pilar
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Cómo pedir (pasos)</label>
        <p className="mb-2 text-xs text-zinc-500">Sin personalizar, se muestran 3 pasos genéricos por defecto.</p>
        <div className="space-y-2">
          {pasos.map((paso, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={paso}
                onChange={(e) => setPasos((prev) => prev.map((row, idx) => (idx === i ? e.target.value : row)))}
                placeholder={`Paso ${i + 1}`}
                className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <button
                type="button"
                onClick={() => setPasos((prev) => prev.filter((_, idx) => idx !== i))}
                className="px-2 text-sm text-zinc-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setPasos((prev) => [...prev, ""])}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            + Agregar paso
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Formas de pago</label>
        <div className="flex gap-4">
          {FORMAS_PAGO_DISPONIBLES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-1.5 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={formasPago.includes(value)}
                onChange={(e) =>
                  setFormasPago((prev) => (e.target.checked ? [...prev, value] : prev.filter((f) => f !== value)))
                }
                className="accent-zinc-900 dark:accent-white"
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
        <label className="mb-2 block text-sm font-medium">Preguntas frecuentes</label>
        <p className="mb-2 text-xs text-zinc-500">Sin personalizar, se muestran algunas preguntas genéricas por defecto.</p>
        <div className="space-y-3">
          {faq.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={item.pregunta}
                onChange={(e) => setFaq((prev) => prev.map((row, idx) => (idx === i ? { ...row, pregunta: e.target.value } : row)))}
                placeholder="Pregunta"
                className="w-1/3 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <input
                value={item.respuesta}
                onChange={(e) => setFaq((prev) => prev.map((row, idx) => (idx === i ? { ...row, respuesta: e.target.value } : row)))}
                placeholder="Respuesta"
                className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <button
                type="button"
                onClick={() => setFaq((prev) => prev.filter((_, idx) => idx !== i))}
                className="px-2 text-sm text-zinc-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFaq((prev) => [...prev, { pregunta: "", respuesta: "" }])}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            + Agregar pregunta
          </button>
        </div>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-white dark:text-zinc-900"
      >
        {isPending ? "Guardando..." : "Guardar cambios"}
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
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
    </div>
  );
}
