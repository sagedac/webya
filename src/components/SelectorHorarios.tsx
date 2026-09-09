"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { inputClass } from "@/lib/form-styles";
import { DIAS_SEMANA, formatearDias, parseDiasSeleccionados } from "@/lib/horarios";
import type { HorarioDia } from "@/lib/types";

const DIAS_ABREVIADOS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Cada fila guarda `dia` como texto plano (esquema sin cambios), pero acá se
// edita como una selección de chips de días — formateados a texto legible
// ("Lunes a Viernes", "Sábado y Domingo") antes de guardarse. Si el texto ya
// guardado no se puede interpretar como selección de días (contenido viejo
// escrito a mano, ej. "Feriados"), la fila cae en modo texto libre en vez de
// perder o corromper ese contenido.
export function SelectorHorarios({
  horarios,
  onChange,
}: {
  horarios: HorarioDia[];
  onChange: (horarios: HorarioDia[]) => void;
}) {
  const [textoLibre, setTextoLibre] = useState<Set<number>>(new Set());

  function diasOcupadosPorOtrasFilas(indiceActual: number): boolean[] {
    const ocupados = new Array(7).fill(false);
    horarios.forEach((fila, idx) => {
      if (idx === indiceActual || textoLibre.has(idx)) return;
      parseDiasSeleccionados(fila.dia)?.forEach((activo, d) => {
        if (activo) ocupados[d] = true;
      });
    });
    return ocupados;
  }

  function actualizarFila(indice: number, cambios: Partial<HorarioDia>) {
    onChange(horarios.map((fila, idx) => (idx === indice ? { ...fila, ...cambios } : fila)));
  }

  function alternarDia(indice: number, diaIndex: number) {
    const seleccion = parseDiasSeleccionados(horarios[indice].dia) ?? new Array(7).fill(false);
    seleccion[diaIndex] = !seleccion[diaIndex];
    actualizarFila(indice, { dia: formatearDias(seleccion) });
  }

  function eliminarFila(indice: number) {
    onChange(horarios.filter((_, idx) => idx !== indice));
    setTextoLibre((prev) => {
      const siguiente = new Set<number>();
      prev.forEach((idx) => {
        if (idx < indice) siguiente.add(idx);
        else if (idx > indice) siguiente.add(idx - 1);
      });
      return siguiente;
    });
  }

  function alternarModoLibre(indice: number) {
    setTextoLibre((prev) => {
      const siguiente = new Set(prev);
      if (siguiente.has(indice)) {
        siguiente.delete(indice);
        actualizarFila(indice, { dia: "" });
      } else {
        siguiente.add(indice);
      }
      return siguiente;
    });
  }

  return (
    <div className="space-y-3">
      {horarios.map((fila, i) => {
        const esLibre = textoLibre.has(i) || parseDiasSeleccionados(fila.dia) === null;
        const seleccion = esLibre ? null : parseDiasSeleccionados(fila.dia) ?? new Array(7).fill(false);
        const ocupados = diasOcupadosPorOtrasFilas(i);

        return (
          <div key={i} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
            <div className="mb-2 flex items-start justify-between gap-2">
              {esLibre ? (
                <input
                  value={fila.dia}
                  onChange={(e) => actualizarFila(i, { dia: e.target.value })}
                  placeholder="Ej. Feriados"
                  className={`${inputClass} flex-1`}
                />
              ) : (
                <div className="flex flex-1 flex-wrap gap-1.5">
                  {DIAS_SEMANA.map((nombreDia, d) => {
                    const activo = seleccion?.[d] ?? false;
                    const ocupadoPorOtra = ocupados[d] && !activo;
                    return (
                      <button
                        key={nombreDia}
                        type="button"
                        disabled={ocupadoPorOtra}
                        title={ocupadoPorOtra ? `${nombreDia} ya tiene otro horario asignado` : nombreDia}
                        onClick={() => alternarDia(i, d)}
                        className={`rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
                          activo
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : ocupadoPorOtra
                              ? "cursor-not-allowed border-zinc-100 text-zinc-300 dark:border-zinc-800 dark:text-zinc-700"
                              : "border-zinc-200 text-zinc-600 hover:border-indigo-300 dark:border-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {DIAS_ABREVIADOS[d]}
                      </button>
                    );
                  })}
                </div>
              )}
              <button
                type="button"
                onClick={() => eliminarFila(i)}
                className="flex w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={fila.horas}
                onChange={(e) => actualizarFila(i, { horas: e.target.value })}
                placeholder="9:00 - 18:00"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => alternarModoLibre(i)}
                className="shrink-0 text-xs whitespace-nowrap text-zinc-400 underline hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                {esLibre ? "Usar selector de días" : "Escribir texto libre"}
              </button>
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => onChange([...horarios, { dia: "", horas: "" }])}
        className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
        Agregar horario
      </button>
    </div>
  );
}
