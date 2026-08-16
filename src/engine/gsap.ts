import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Punto único de registro del plugin — módulos de animación (ScrollReveal,
// Parallax, y los que se agreguen a futuro) importan de acá en vez de
// registrar ScrollTrigger cada uno por su cuenta.
gsap.registerPlugin(ScrollTrigger);

// Bug real encontrado 2026-08-16 (landing de 26st, pero afecta a cualquier
// página que use ScrollReveal/Parallax): ScrollTrigger calcula la posición
// de disparo de cada elemento en el momento en que se crea, antes de que
// las fuentes web (next/font) terminen de cargar. Cuando una fuente entra
// después y cambia la altura del texto, ese cálculo queda desactualizado —
// el síntoma es contenido ya visible en el viewport al cargar (headline,
// botones, CTAs) que se queda con opacity:0 para siempre, hasta que el
// usuario hace scroll o redimensiona la ventana (lo que fuerza a
// ScrollTrigger a recalcular). Se reprodujo de forma consistente y se
// confirmó que `window.dispatchEvent(new Event("resize"))` lo destraba.
//
// Un solo listener de `document.fonts.ready`/`load` a nivel de módulo NO
// alcanza: ese código corre una vez al evaluarse el módulo, que puede ser
// antes de que los componentes (ScrollReveal, Parallax, etc.) lleguen a
// crear sus propios ScrollTrigger en sus efectos de React — si las fuentes
// ya estaban en caché, el refresh se dispara sin nada todavía que
// refrescar. `scheduleRefresh()` en cambio la llama cada módulo de
// animación DESPUÉS de crear su propio ScrollTrigger (dentro de su propio
// efecto, por lo tanto ya montado).
//
// Un solo `requestAnimationFrame` tampoco resultó suficiente en pruebas
// reales (páginas con muchos ScrollReveal seguidos: algunos quedaban bien,
// otros — normalmente los últimos en montar — seguían atascados en
// opacity:0). En vez de perseguir el timing exacto de GSAP/React, se
// agregan dos reintentos con `setTimeout` como red de seguridad: cubren
// imágenes/fuentes que todavía están asentando el layout unos cientos de
// milisegundos después del primer frame. `ScrollTrigger.refresh()` es
// barato y no reinicia animaciones ya en curso, así que llamarlo de más no
// tiene costo visible para el usuario.
let refreshScheduled = false;
export function scheduleRefresh() {
  if (typeof window === "undefined" || refreshScheduled) return;
  refreshScheduled = true;
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    setTimeout(() => ScrollTrigger.refresh(), 300);
    setTimeout(() => {
      ScrollTrigger.refresh();
      refreshScheduled = false;
    }, 1200);
  });
}

export { gsap, ScrollTrigger };
