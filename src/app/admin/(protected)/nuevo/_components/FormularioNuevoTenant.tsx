"use client";

import { useActionState, useMemo, useState } from "react";
import { Check, ChevronRight, ArrowLeft } from "lucide-react";
import { crearTenantAction } from "@/app/admin/actions";
import { slugify } from "@/lib/slug";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/lib/form-styles";
import { NIVEL_LABELS } from "@/lib/catalogo-plantillas";
import type { HorarioDia, Nivel } from "@/lib/types";

const ESTADO_INICIAL = { error: null };

function PasoIndicador({ paso }: { paso: "datos" | "confirmar" }) {
  const pasos = [
    { id: "datos", label: "Datos del negocio" },
    { id: "confirmar", label: "Confirmar" },
  ];
  return (
    <div className="mb-8 flex items-center gap-2">
      {pasos.map((p, i) => {
        const activo = p.id === paso;
        const completado = p.id === "datos" && paso === "confirmar";
        return (
          <div key={p.id} className="flex items-center gap-2">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                completado
                  ? "bg-indigo-600 text-white"
                  : activo
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
              }`}
            >
              {completado ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
            </div>
            <span className={`text-sm font-medium ${activo || completado ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`}>
              {p.label}
            </span>
            {i < pasos.length - 1 && <ChevronRight className="h-4 w-4 text-zinc-300" />}
          </div>
        );
      })}
    </div>
  );
}

export function FormularioNuevoTenant({ slugsExistentes }: { slugsExistentes: string[] }) {
  const [paso, setPaso] = useState<"datos" | "confirmar">("datos");
  const [confirmado, setConfirmado] = useState(false);

  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTocadoManualmente, setSlugTocadoManualmente] = useState(false);
  // Reset del catálogo de plantillas (webya.md sección 5, 2026-08-12): ya
  // no existe plan="template" en el flujo de alta — toda página nueva es
  // código a medida (src/custom/registro.ts). El nivel (START/PRO/
  // EXPERIENCE) se mantiene como parte del modelo comercial, ahora
  // independiente de cualquier plantilla.
  const [nivel, setNivel] = useState<Nivel>(1);
  const [telefonoWhatsapp, setTelefonoWhatsapp] = useState("");
  const [direccion, setDireccion] = useState("");
  const [horarios, setHorarios] = useState<HorarioDia[]>([
    { dia: "Lunes a Viernes", horas: "" },
    { dia: "Sábado", horas: "" },
    { dia: "Domingo", horas: "" },
  ]);

  const [state, formAction, isPending] = useActionState(crearTenantAction, ESTADO_INICIAL);

  const slugDisponible = useMemo(() => !slugsExistentes.includes(slug), [slugsExistentes, slug]);
  const slugValido = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
  const urlResultante = `sitioya.vercel.app/${slug || "..."}`;
  const urlFutura = `${slug || "tunombre"}.sitioya.com`;

  function handleNombreChange(valor: string) {
    setNombre(valor);
    if (!slugTocadoManualmente) setSlug(slugify(valor));
  }

  function puedeAvanzar() {
    return Boolean(nombre.trim() && slug && slugValido && slugDisponible && telefonoWhatsapp.trim());
  }

  if (paso === "datos") {
    return (
      <div className="max-w-2xl">
        <PasoIndicador paso={paso} />
        <div className="space-y-5 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div>
            <label className={labelClass}>Nombre del negocio</label>
            <input value={nombre} onChange={(e) => handleNombreChange(e.target.value)} className={inputClass} placeholder="El Establo Cárnicos" />
          </div>

          <div>
            <label className={labelClass}>Slug (URL)</label>
            <input
              value={slug}
              onChange={(e) => {
                setSlugTocadoManualmente(true);
                setSlug(slugify(e.target.value));
              }}
              className={inputClass}
              placeholder="elestablo"
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              URL resultante: <span className="font-mono text-zinc-700 dark:text-zinc-300">{urlResultante}</span>
            </p>
            {slug && !slugValido && <p className="mt-1 text-xs text-red-600">Solo minúsculas, números y guiones.</p>}
            {slug && slugValido && !slugDisponible && <p className="mt-1 text-xs text-red-600">Ese slug ya está en uso por otro cliente.</p>}
          </div>

          <div>
            <p className="mt-1.5 text-xs text-zinc-500">
              Página de código a medida — el componente para este slug tiene que existir ya en{" "}
              <code>src/custom/registro.ts</code> antes de publicar, si no la página pública da 404.
            </p>
          </div>

          <div>
            <label className={labelClass}>Nivel</label>
            <select value={nivel} onChange={(e) => setNivel(Number(e.target.value) as Nivel)} className={inputClass}>
              {([1, 2, 3] as const).map((n) => (
                <option key={n} value={n}>
                  {NIVEL_LABELS[n]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>WhatsApp</label>
              <input value={telefonoWhatsapp} onChange={(e) => setTelefonoWhatsapp(e.target.value)} className={inputClass} placeholder="+593999999999" />
            </div>
            <div>
              <label className={labelClass}>Dirección</label>
              <input value={direccion} onChange={(e) => setDireccion(e.target.value)} className={inputClass} placeholder="Av. Ordóñez Lasso, Cuenca" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Horario</label>
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
                    placeholder="8:00 am – 8:00 pm"
                    className={`${inputClass} w-1/2`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button type="button" disabled={!puedeAvanzar()} onClick={() => setPaso("confirmar")} className={`mt-5 ${primaryButtonClass}`}>
          Continuar
          <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  // Paso de confirmación obligatorio (webya.md sección 5): mostrar la URL
  // resultante y pedir confirmar explícitamente antes de guardar, porque
  // cambiar el slug después de publicado rompe enlaces ya compartidos y SEO.
  return (
    <div className="max-w-2xl">
      <PasoIndicador paso={paso} />
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Confirma antes de guardar</h2>
        <dl className="space-y-2.5 text-sm">
          <div className="flex justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-900">
            <dt className="text-zinc-500">Nombre</dt>
            <dd className="font-medium">{nombre}</dd>
          </div>
          <div className="flex justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-900">
            <dt className="text-zinc-500">URL ahora (Fase 1)</dt>
            <dd className="font-mono text-indigo-600 dark:text-indigo-400">{urlResultante}</dd>
          </div>
          <div className="flex justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-900">
            <dt className="text-zinc-500">URL futura (Fase 2)</dt>
            <dd className="font-mono text-zinc-400">{urlFutura}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Nivel</dt>
            <dd className="font-medium">{NIVEL_LABELS[nivel]}</dd>
          </div>
        </dl>

        <label className="mt-5 flex items-start gap-2.5 rounded-lg bg-amber-50 p-3 text-sm dark:bg-amber-950/40">
          <input type="checkbox" checked={confirmado} onChange={(e) => setConfirmado(e.target.checked)} className="mt-0.5 accent-indigo-600" />
          <span className="text-amber-900 dark:text-amber-200">
            Confirmo que el nombre del negocio y el subdominio están bien escritos. Entiendo que cambiarlo después de
            publicado puede romper enlaces ya compartidos.
          </span>
        </label>
      </div>

      {state.error && <p className="mt-4 text-sm text-red-600">{state.error}</p>}

      <form action={formAction} className="mt-5 flex gap-3">
        <input type="hidden" name="nombre" value={nombre} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="plan" value="custom_code" />
        <input type="hidden" name="nivel" value={nivel} />
        <input type="hidden" name="telefonoWhatsapp" value={telefonoWhatsapp} />
        <input type="hidden" name="direccion" value={direccion} />
        <input type="hidden" name="horariosJson" value={JSON.stringify(horarios.filter((h) => h.horas.trim()))} />

        <button type="button" onClick={() => setPaso("datos")} className={secondaryButtonClass}>
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Volver
        </button>
        <button type="submit" disabled={!confirmado || isPending} className={primaryButtonClass}>
          {isPending ? "Guardando..." : "Guardar cliente"}
        </button>
      </form>
    </div>
  );
}
