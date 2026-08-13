import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Punto único de registro del plugin — módulos de animación (ScrollReveal,
// Parallax, y los que se agreguen a futuro) importan de acá en vez de
// registrar ScrollTrigger cada uno por su cuenta.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
