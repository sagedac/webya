// Convierte entre el texto libre guardado en HorarioDia.dia (ej. "Lunes a
// Viernes", "Sábado y Domingo") y una selección de días de la semana, para
// que el selector de horarios pueda mostrar chips en vez de un input de
// texto — sin cambiar el esquema (`dia` sigue siendo un string plano en
// Supabase, formateado acá antes de guardar).

export const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;

function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

const DIAS_NORMALIZADOS = DIAS_SEMANA.map(normalizar);

// null = el texto no se pudo interpretar como una selección de días (texto
// libre preexistente, ej. "Feriados" o algo escrito a mano que no calza).
export function parseDiasSeleccionados(dia: string): boolean[] | null {
  if (!dia.trim()) return new Array(7).fill(false);

  const partes = dia.split(",").flatMap((parte) => parte.split(/\s+y\s+/i));
  const seleccion = new Array(7).fill(false);

  for (const parteRaw of partes) {
    const parte = parteRaw.trim();
    if (!parte) continue;

    const rango = parte.split(/\s+a\s+/i);
    if (rango.length === 2) {
      const inicio = DIAS_NORMALIZADOS.indexOf(normalizar(rango[0]));
      const fin = DIAS_NORMALIZADOS.indexOf(normalizar(rango[1]));
      if (inicio === -1 || fin === -1 || fin < inicio) return null;
      for (let i = inicio; i <= fin; i++) seleccion[i] = true;
      continue;
    }

    const idx = DIAS_NORMALIZADOS.indexOf(normalizar(parte));
    if (idx === -1) return null;
    seleccion[idx] = true;
  }

  return seleccion;
}

function formatearBloque(inicio: number, fin: number): string {
  if (inicio === fin) return DIAS_SEMANA[inicio];
  if (fin === inicio + 1) return `${DIAS_SEMANA[inicio]} y ${DIAS_SEMANA[fin]}`;
  return `${DIAS_SEMANA[inicio]} a ${DIAS_SEMANA[fin]}`;
}

export function formatearDias(seleccion: boolean[]): string {
  const indices = seleccion.map((activo, i) => (activo ? i : -1)).filter((i) => i !== -1);
  if (indices.length === 0) return "";

  const bloques: string[] = [];
  let inicio = indices[0];
  let anterior = indices[0];

  for (let k = 1; k <= indices.length; k++) {
    const actual = indices[k];
    if (actual === anterior + 1) {
      anterior = actual;
      continue;
    }
    bloques.push(formatearBloque(inicio, anterior));
    inicio = actual;
    anterior = actual;
  }

  if (bloques.length === 1) return bloques[0];
  return `${bloques.slice(0, -1).join(", ")} y ${bloques[bloques.length - 1]}`;
}
