// Catálogo de plantillas disponibles (webya.md sección 5). Vive en código,
// no en la base de datos — `tenants.plantilla_id` solo guarda el id como
// texto. Cuando se agregue una plantilla nueva (paso 11 del roadmap), se
// suma aquí.
export interface PlantillaCatalogo {
  id: string;
  nombre: string;
  nivelesDisponibles: (1 | 2 | 3)[];
}

// Catálogo vaciado el 2026-08-12 — decisión explícita de Paul: el
// resultado visual de las 4 plantillas construidas hasta ahora
// (plantilla_carniceria_pizarra, plantilla_jugueteria, plantilla_joyeria,
// plantilla_vitrina_demo_21st) no estaba funcionando, así que se
// descartaron por completo para repensar el enfoque de diseño desde cero.
// Ver webya.md sección 5 para el detalle. Los 8 tenants publicados que
// dependían de estas plantillas (El Establo, Panadería Doña Carmela, Café
// Altura, Toquilla Andina, Fuego Callejero, Barro Andino, DeluxTravel, Toy
// Land) quedan rotos (404) hasta que se construya una plantilla nueva o se
// les reasigne una — decisión tomada a sabiendas del impacto.
export const CATALOGO_PLANTILLAS: PlantillaCatalogo[] = [];

// Nombres comerciales de los niveles (webya.md sección 2). El admin elige
// entre los nivelesDisponibles de la plantilla seleccionada, no libremente
// 1/2/3 — hoy solo existe la capa START en código.
export const NIVEL_LABELS: Record<1 | 2 | 3, string> = {
  1: "1 — START",
  2: "2 — PRO",
  3: "3 — EXPERIENCE",
};
