"use client";

import { useActionState, useState } from "react";
import { Images, MessageCircle, Plus, Sparkles, Store, Users, X, type LucideIcon } from "lucide-react";
import { actualizarContenidoClienteAction } from "@/app/panel/actions";
import { VistaPreviaLanding } from "@/app/panel/[slug]/_components/VistaPreviaLanding";
import { SelectorFotos } from "@/components/SelectorFotos";
import { SelectorHorarios } from "@/components/SelectorHorarios";
import { inputClass, labelClass, primaryButtonClass } from "@/lib/form-styles";
import { FORMAS_PAGO_DISPONIBLES, type CategoriaProducto, type FaqItem, type FormaPago, type Foto, type HorarioDia, type Pilar, type TenantContent } from "@/lib/types";

const ESTADO_INICIAL = { error: null };

export function EditorContenidoCliente({ slug, content, publicado }: { slug: string; content: TenantContent; publicado: boolean }) {
  const [state, formAction, isPending] = useActionState(actualizarContenidoClienteAction, ESTADO_INICIAL);

  // Cuenta cuántos guardados exitosos hubo — VistaPreviaLanding usa este
  // número como key/querystring del iframe para forzar que recargue.
  // Actualizar estado durante el render (comparando contra la última
  // referencia de `state` vista) en vez de en un useEffect es el patrón que
  // React recomienda para esto — useActionState ya devuelve un objeto
  // nuevo en cada acción completada, así que no hace falta useEffect para
  // "reaccionar" al cambio, y se evita el re-render en cascada que
  // dispararía un setState dentro de un efecto.
  const [ultimoEstadoVisto, setUltimoEstadoVisto] = useState(state);
  const [previewToken, setPreviewToken] = useState(0);
  if (state !== ultimoEstadoVisto) {
    setUltimoEstadoVisto(state);
    if (state.error === null) setPreviewToken((n) => n + 1);
  }

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
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="horariosJson" value={JSON.stringify(horarios)} />
        <input type="hidden" name="categoriasJson" value={JSON.stringify(categorias)} />
        <input type="hidden" name="fotosJson" value={JSON.stringify(fotos)} />
        <input type="hidden" name="fotoDestacadaJson" value={JSON.stringify(fotoDestacada)} />
        <input type="hidden" name="pilaresJson" value={JSON.stringify(pilares)} />
        <input type="hidden" name="pasosJson" value={JSON.stringify(pasos)} />
        <input type="hidden" name="formasPagoJson" value={JSON.stringify(formasPago)} />
        <input type="hidden" name="faqJson" value={JSON.stringify(faq)} />

        <Seccion icon={Store} titulo="Identidad" descripcion="Cómo se presenta tu negocio en el hero de la landing.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Frase corta (tagline)" name="tagline" value={tagline} onChange={setTagline} />
            <Campo label="Qué te distingue" name="diferenciador" value={diferenciador} onChange={setDiferenciador} />
          </div>
          <div>
            <label className={labelClass}>Descripción del negocio</label>
            <textarea
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
        </Seccion>

        <Seccion icon={MessageCircle} titulo="Contacto y horario" descripcion="De dónde sale el botón de WhatsApp y cuándo apareces como abierto.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="WhatsApp" name="telefonoWhatsapp" value={telefonoWhatsapp} onChange={setTelefonoWhatsapp} />
            <Campo label="Dirección" name="direccion" value={direccion} onChange={setDireccion} />
          </div>
          <div>
            <label className={`${labelClass} mb-2`}>Horario</label>
            <SelectorHorarios horarios={horarios} onChange={setHorarios} />
          </div>
        </Seccion>

        <Seccion icon={Sparkles} titulo="Catálogo y precios" descripcion="Lo que vendes, agrupado por categoría, y cómo hablas de precios.">
          <div>
            <label className={`${labelClass} mb-2`}>Productos por categoría</label>
            <div className="space-y-3">
              {categorias.map((cat, i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-1/3">
                    <input
                      value={cat.nombre}
                      onChange={(e) =>
                        setCategorias((prev) => prev.map((row, idx) => (idx === i ? { ...row, nombre: e.target.value } : row)))
                      }
                      placeholder="Categoría"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex-1">
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
                      className={inputClass}
                    />
                  </div>
                  <BotonQuitar onClick={() => setCategorias((prev) => prev.filter((_, idx) => idx !== i))} />
                </div>
              ))}
              <BotonAgregar label="Agregar categoría" onClick={() => setCategorias((prev) => [...prev, { nombre: "", items: [] }])} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Nota sobre precios</label>
            <input value={precioNota} onChange={(e) => setPrecioNota(e.target.value)} name="precioNota" className={inputClass} />
          </div>

          <div>
            <label className={`${labelClass} mb-2`}>Formas de pago</label>
            <div className="flex flex-wrap gap-4">
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
        </Seccion>

        <Seccion icon={Images} titulo="Fotos" descripcion="La primera foto se usa como fondo del hero de tu landing.">
          <div>
            <label className={labelClass}>Foto de producto destacado</label>
            <p className="mb-2 text-xs text-zinc-500">
              La foto que &ldquo;flota&rdquo; en la sección de efecto visual de tu landing. Mejor resultado con fondo
              limpio o transparente.
            </p>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  value={fotoDestacada.url}
                  onChange={(e) => setFotoDestacada((prev) => ({ ...prev, url: e.target.value }))}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
              <div className="w-1/3">
                <input
                  value={fotoDestacada.alt}
                  onChange={(e) => setFotoDestacada((prev) => ({ ...prev, alt: e.target.value }))}
                  placeholder="Descripción"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Fotos de la galería</label>
            <SelectorFotos slug={slug} fotos={fotos} onChange={setFotos} />
          </div>
        </Seccion>

        <Seccion icon={Users} titulo="Confianza" descripcion="Lo que convierte una visita en un pedido.">
          <div>
            <label className={labelClass}>Por qué elegirte (3 pilares)</label>
            <p className="mb-2 text-xs text-zinc-500">Sin al menos uno, esta sección no aparece en tu landing.</p>
            <div className="space-y-3">
              {pilares.map((pilar, i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-1/3">
                    <input
                      value={pilar.titulo}
                      onChange={(e) => setPilares((prev) => prev.map((row, idx) => (idx === i ? { ...row, titulo: e.target.value } : row)))}
                      placeholder="Título"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      value={pilar.descripcion}
                      onChange={(e) =>
                        setPilares((prev) => prev.map((row, idx) => (idx === i ? { ...row, descripcion: e.target.value } : row)))
                      }
                      placeholder="1-2 líneas"
                      className={inputClass}
                    />
                  </div>
                  <BotonQuitar onClick={() => setPilares((prev) => prev.filter((_, idx) => idx !== i))} />
                </div>
              ))}
              <BotonAgregar label="Agregar pilar" onClick={() => setPilares((prev) => [...prev, { titulo: "", descripcion: "" }])} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Cómo pedir (pasos)</label>
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
                  <BotonQuitar onClick={() => setPasos((prev) => prev.filter((_, idx) => idx !== i))} />
                </div>
              ))}
              <BotonAgregar label="Agregar paso" onClick={() => setPasos((prev) => [...prev, ""])} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Preguntas frecuentes</label>
            <p className="mb-2 text-xs text-zinc-500">Sin personalizar, se muestran algunas preguntas genéricas por defecto.</p>
            <div className="space-y-3">
              {faq.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-1/3">
                    <input
                      value={item.pregunta}
                      onChange={(e) => setFaq((prev) => prev.map((row, idx) => (idx === i ? { ...row, pregunta: e.target.value } : row)))}
                      placeholder="Pregunta"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      value={item.respuesta}
                      onChange={(e) => setFaq((prev) => prev.map((row, idx) => (idx === i ? { ...row, respuesta: e.target.value } : row)))}
                      placeholder="Respuesta"
                      className={inputClass}
                    />
                  </div>
                  <BotonQuitar onClick={() => setFaq((prev) => prev.filter((_, idx) => idx !== i))} />
                </div>
              ))}
              <BotonAgregar label="Agregar pregunta" onClick={() => setFaq((prev) => [...prev, { pregunta: "", respuesta: "" }])} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Instagram (URL)" name="instagramUrl" value={instagramUrl} onChange={setInstagramUrl} />
            <Campo label="Facebook (URL)" name="facebookUrl" value={facebookUrl} onChange={setFacebookUrl} />
          </div>
        </Seccion>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button type="submit" disabled={isPending} className={primaryButtonClass}>
          {isPending ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
      <div className="lg:sticky lg:top-6">
        <VistaPreviaLanding slug={slug} publicado={publicado} refreshToken={previewToken} />
      </div>
    </div>
  );
}

// Cada bloque del formulario es una tarjeta con ícono + título — mismo
// tratamiento visual que el panel admin ya usa a nivel de página (Card en
// admin/(protected)/[id]/page.tsx), pero aplicado dentro del formulario de
// contenido, que hasta ahora era una lista plana de campos sin agrupar ni
// estilo propio (pedido explícito de Paul, 2026-09-09, al ver el panel real
// junto al preview elegante de la derecha).
function Seccion({ icon: Icon, titulo, descripcion, children }: { icon: LucideIcon; titulo: string; descripcion?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4 flex items-start gap-2.5">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" strokeWidth={2} aria-hidden />
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{titulo}</h2>
          {descripcion && <p className="mt-0.5 text-xs text-zinc-500">{descripcion}</p>}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function BotonQuitar({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
    >
      <X className="h-4 w-4" strokeWidth={2} />
    </button>
  );
}

function BotonAgregar({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
    >
      <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
      {label}
    </button>
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
