# SitioYa — Landings para negocios locales (Ecuador)
> Documento maestro de referencia para construcción con Claude Code.
> Última actualización: 2026-08-10 · v3

**Nombre de marca:** tentativo, pendiente de confirmar (candidatos: SitioYa, WebRapida — ver sección 4).

---

## 0. Instrucciones para Claude Code — leer antes de empezar

**Este documento describe un proyecto ya construido y en producción**, no un build desde cero — las instrucciones originales de bootstrap (esquema Supabase por escribir, primera plantilla por construir, sin credenciales todavía) quedaron obsoletas hace rato y se retiraron de acá; el histórico completo de cómo se llegó hasta acá vive en las notas "Estado (fecha)" repartidas por el documento y en `git log`.

**Estado actual (2026-08-13):** Supabase real conectado y con datos (`.env.local`), desplegado en producción en Vercel (`26st.vercel.app`), repo en GitHub. **No existe sistema de plantillas reutilizables** — ver sección 5, "reset del catálogo" — cada negocio nuevo es una página de código a medida (`plan="custom_code"`), construida por el agente `template-builder` (`.claude/agents/template-builder.md`) o directo en Claude Code, sin catálogo ni "rubro" del que heredar diseño. Los 3 niveles START/PRO/EXPERIENCE se mantienen como estructura comercial, ahora aplicados a código a medida.

- Si hace falta tomar una decisión de diseño no cubierta aquí, preferir la opción más simple que no cierre la puerta a lo ya documentado (niveles, dominios, Seles) — no sobre-construir por adelantado, y no reintroducir un sistema de plantillas reutilizables sin que Paul lo pida explícitamente (ya se intentó y se revirtió una vez, sección 5).

---

## 1. Qué es esto

Servicio de landing pages para negocios locales ecuatorianos que **ya tienen buenas reseñas en Google pero no tienen sitio web**. Se les vende una landing profesional, editable por ellos mismos, a un precio muy por debajo del mercado local. Parte del ecosistema de proyectos de Paul (miboleto.ec, Seles, Domiship, Turnova, Convia, SAGEDAC).

**Demo de validación:** landing de prueba para *El Establo Cárnicos* (carnicería real en Cuenca) — ver sección 10. Sirve como referencia visual del primer caso construido (Nivel 1). Desde el reset del catálogo de plantillas (2026-08-12, sección 5), ya no es "el primer template del catálogo" — cada negocio nuevo se construye como código a medida, no como instancia de una plantilla reutilizable.

---

## 2. Modelo de negocio

### Segmento objetivo
Negocios locales con buenas reseñas en Google, sin web propia, que atienden pedidos/consultas por WhatsApp.

### Estructura de producto: un solo estándar, código a medida

**Un solo producto, un solo estándar: desde $49 por página.** Landing de código a medida — "un solo estándar" no significa una plantilla fija con una sola variante, significa que **no hay versión barata/recortada**: cada página se construye con el mejor diseño y la mejor sofisticación visual/interactiva que el proyecto sabe hacer para ESE negocio puntual (motor compartido `src/engine/` — `ScrollReveal`, `Parallax`, `ProductVisual` — disponible completo, y los mejores componentes de frontend que encajen, búsqueda en 21st MCP, ver `.claude/agents/template-builder.md`).

**Estado (2026-08-16, ajuste de precio base):** decisión explícita de Paul — el precio baja de $100 a **desde $49 por página**. El "desde" no reintroduce niveles de sofisticación (sigue habiendo un solo estándar, sección de arriba no cambia) — refleja que el precio final puede subir si el cliente pide extras opcionales como dominio propio (Fase 3, sección 5) u hosting/mantenimiento recurrente (ver más abajo, "$8-12/mes"), no que haya una versión recortada de la página en sí. Reflejado en la landing de 26st (`src/marketing/26st/Home26st.tsx`, sección de precio y franja de cifras del hero).

**Ni la estructura ni las secciones están predeterminadas.** No existe una lista fija de secciones que toda página deba incluir (navbar/hero/pilares/pasos/galería/etc. — eso era el supuesto de la época de plantillas, ya no aplica). Qué secciones tiene una página, en qué orden, y con qué tratamiento visual, es criterio del agente que la construye según lo que ese negocio real necesita — el único requisito no negociable es el principio de sección 7 (fotografía real, WhatsApp como CTA, anclar al negocio real) y el contrato técnico de `tenant_content` (sección 5) para que el panel admin/autoedición pueda seguir editando el contenido.

**Estado (2026-08-13, fin de los 3 niveles de precio):** decisión explícita de Paul — se retiran los 3 niveles START/PRO/EXPERIENCE como productos con precio distinto (tabla vieja más abajo, dejada como referencia histórica). Ya no tenía sentido cobrar menos por "menos sofisticación" cuando cada página es código a medida de todas formas — no hay plantilla barata de la que amortizar menos trabajo, así que no hay motivo real de costo para ofrecer una versión recortada. **"El estándar más alto" no es literalmente "Nivel 3"** — es una forma de hablar de calidad, no un número de tier; evitar de acá en adelante llamarlo "Nivel 3/EXPERIENCE" en conversación o en código nuevo, aunque el campo de la base de datos siga usando ese número internamente (siguiente párrafo). El campo `tenants.nivel` sigue existiendo en la base de datos (`tenants_plan_fields_check`, sección 5, todavía `NOT NULL`, valor fijo `3` por razones puramente técnicas de esquema) pero el panel admin ya no lo pregunta al crear un cliente (`src/app/admin/(protected)/nuevo/_components/FormularioNuevoTenant.tsx`) y ya no significa "tier vendido" — es un vestigio de esquema, no un concepto de producto vigente.

**Estado (2026-08-12, reset del catálogo de plantillas — decisión de negocio, no solo técnica):** se descarta el modelo de "plantilla reutilizable por rubro" (`plan="template"`, catálogo en código, Flujo A construye una vez / Flujo B reutiliza infinitas veces). El resultado visual de las 4 plantillas construidas hasta ese punto (carnicería, juguetería, joyería, vitrina demo) no estaba funcionando, así que se borraron por completo — ver sección 5 para el detalle técnico. **Camino único de acá en adelante: cada negocio nuevo es una página de código a medida** (`plan="custom_code"`, componente propio en `src/custom/registro.ts`), construida con la información real de ese negocio. Flujo de trabajo con imágenes mientras no hay fotos reales del cliente: usar fotografía de Unsplash (licencia de uso comercial libre, ver credenciales en `.env.local`) como contenido de **muestra/mockup** para mostrarle al dueño del negocio cómo necesitaría las fotos reales — nunca como sustituto permanente ni presentado como "la foto real" de su producto (sigue aplicando el principio de fotografía real de la sección 7).

**Estado (2026-08-11, FAQ):** implementado en `plantilla_carniceria_pizarra`, común a los 3 niveles, ubicado antes del footer. Contenido editable desde `tenant_content.faq` en ambos paneles (admin y autoedición); sin personalizar, la plantilla usa un set de 3-4 preguntas por defecto (definido en código como fallback, no contenido fijo — `FAQ_DEFAULT`). Acordeón vía `<details>/<summary>` nativo (sin JS necesario para colapsar/expandir); START es instantáneo, PRO/EXPERIENCE suman una transición de altura suave por CSS puro (grid-template-rows, sin GSAP — no hacía falta para esto).

**Estado (2026-08-11, bloques de confianza/información):** implementados en `plantilla_carniceria_pizarra`, comunes a los 3 niveles (no diferenciación de tier) — "Por qué elegirnos" y "formas de pago"/"redes sociales" se omiten limpiamente si el tenant no cargó ese contenido; "Cómo pedir" usa un set de 3 pasos por defecto razonable si no se personaliza. START los muestra sin animación (o con el fade-in-up general de la columna); PRO/EXPERIENCE suman scroll-reveal. Editables tanto desde el panel admin como desde el panel de autoedición del cliente.

**Estado (2026-08-11):** el mapa está implementado como parte de la sección de Contacto (no una sección aparte) — embed básico de Google Maps sin API key (`google.com/maps?q={dirección}&output=embed`), construido a partir del campo dirección que ya se captura en el panel admin. Es base en los 3 niveles: START lo muestra estático (mismo fade-in-up de la columna); PRO/EXPERIENCE le suman un reveal propio con leve scale-in (mismo mecanismo `ScrollReveal`, ahora con soporte de `scale`). Si el tenant no tiene dirección cargada, la sección se omite en vez de mostrar un mapa roto.

**Tabla histórica (vigente hasta el 2026-08-13, ya no es el modelo de precios actual — ver nota de arriba):**

| Nivel | Nombre | Qué incluía | Herramientas |
|---|---|---|---|
| 1 | 🟢 START | Fotografía real obligatoria, tipografía con jerarquía fuerte, hero asimétrico con 1 CTA, filas de producto numeradas grandes, transición CSS simple — sin GSAP | HTML + CSS + JS — Next.js |
| 2 | 🟡 PRO | Todo START + GSAP/ScrollTrigger completo (parallax, scroll-reveals), hover en filas de producto, 2 CTAs en el hero | GSAP |
| 3 | 🔴 EXPERIENCE | Todo PRO + `ProductVisual` (producto flotando, fotos reales) obligatoria, tipografía de hero aún más grande, indicador de scroll | GSAP (+ Three.js/WebGL opcional) |

Todas las páginas nuevas se construyen hoy con lo que antes era exclusivo de EXPERIENCE (ver "Estado 2026-08-13" arriba).

**Estado de build:** hero asimétrico, tipografía, filas numeradas y transición CSS de START; Parallax + ScrollReveal + hover de PRO; `ProductVisual` obligatorio de EXPERIENCE (bloqueado en `actualizarEstadoAction`, `src/app/admin/actions.ts`, si falta `foto_destacada`) — todo esto vive hoy en `src/engine/` y se usa desde las páginas de código a medida (`trazojoyas`, `deluxtravel`), no en la plantilla original donde se construyó por primera vez (ya borrada). **Pendiente:** el efecto de "marquesina" (texto en scroll continuo/ticker) mencionado en PRO todavía no está construido — solo parallax y scroll-reveals lo están.

### Comparación de los 3 niveles

| Característica | START | PRO | EXPERIENCE |
|---|---|---|---|
| Diseño personalizado / responsive | ✓ | ✓ | ✓ |
| WhatsApp / CTA / Google Maps / Galería / Productos-servicios / SEO básico | ✓ | ✓ | ✓ |
| Animaciones | Básicas | Avanzadas | Avanzadas |
| Parallax | Básico/opcional | ✓ | ✓ |
| GSAP | — | ✓ | ✓ |
| Profundidad visual / efectos de producto | — | ✓ | ✓✓ |
| Three.js / WebGL | — | — | Opcional |
| Experiencia inmersiva | — | — | ✓ |
| Modelo 3D real | — | — | No necesario |

**Principio comercial:** cada nivel vende una diferencia de valor, no de cantidad de secciones. START vende presencia profesional; PRO vende interacción y diferenciación; EXPERIENCE vende una experiencia visual de marca memorable.

### Sobre Antigravity (herramienta, no reemplaza la arquitectura)
Antigravity es el IDE agéntico de Google (con modelos Gemini), en preview público desde noviembre 2025, actualmente gratuito durante el preview — el modelo de precios puede cambiar cuando salga de preview. Trabaja bien con Next.js/React/Tailwind (el stack ya elegido). Se usa como **herramienta de apoyo para generar diseño/animación más rápido en Nivel 2 y 3**, no reemplaza Supabase/Vercel como base de la arquitectura multi-tenant.

### Sobre el Nivel 3 (EXPERIENCE) — pseudo-3D con fotos reales, sin modelo 3D

**Decisión revisada (2026-08-11):** se descarta el flujo original de generación de modelo 3D real vía IA (Meshy/Tripo/Hyper3D Rodin) + `<model-viewer>`. El efecto tridimensional se logra con fotografía real del producto + animación GSAP/CSS — más barato y rápido de producir, sin depender de servicios externos de pago por generación, y sin la limitación de materiales reflectantes/transparentes que tenía la reconstrucción 3D real.

1. Se reciben fotos reales del producto, idealmente con **fondo transparente/aislado** (frontal, y lateral/trasera si se quiere reforzar la sensación de rotación)
2. El producto se monta "flotando" en el Hero: sombras dinámicas, glow/iluminación ambiental, desenfoque de fondo para reforzar profundidad
3. El producto responde a mouse/touch (parallax) y a scroll (acercamiento, desplazamiento, cambios de iluminación/texto/fondo coordinados, partículas)
4. Transiciones lo llevan a la siguiente sección (características, beneficios, productos relacionados) y CTA final a WhatsApp/compra/reserva
5. Three.js/WebGL queda disponible como opción si un caso puntual lo justifica, pero no es requisito para lograr la sensación 3D

**Matiz honesto a comunicar al cliente:** es una experiencia visual premium, no un modelo 3D real navegable — se vende como tal. Funciona mejor con fotos de buena calidad y fondo limpio; varios ángulos ayudan a simular rotación pero no son obligatorios.

### Pricing general (research de mercado, agosto 2026)
Mercado ecuatoriano para landing simple: $150-300 (agencias van de $147 a $2,800 según complejidad). START se mantiene competitivo por debajo de ese piso; PRO y EXPERIENCE se acercan o superan el promedio del mercado, justificado por el valor visual agregado. El nuevo enfoque de EXPERIENCE (fotos + GSAP en vez de generación 3D por IA) además mejora el margen: no hay costo variable de servicio externo por producto.

**Recurrente opcional (todos los niveles):** $8-12/mes por mantenimiento/hosting/cambios ilimitados vía panel.

---

## 3. Ejemplos de negocios por nivel (Cuenca / Ecuador)

- **START:** carnicerías, panaderías, ferreterías, restaurantes de barrio, barberías, talleres, profesionales independientes — como El Establo. El valor es presencia + confianza, no necesitan más.
- **PRO:** cafeterías de especialidad, spas, gimnasios, estudios de yoga/fitness, restaurantes de autor, hoteles boutique, concesionarios, inmobiliarias, marcas de ropa, constructoras, clínicas — la animación comunica sofisticación de marca.
- **EXPERIENCE:** negocios donde el producto físico es protagonista — **marcas de sombreros de paja toquilla** (ícono exportador de Cuenca), joyerías artesanales, marroquinería/cuero, mueblerías de diseño, cerámica artesanal, bebidas, cosmética, productos de consumo premium. Ver el producto "flotar" con profundidad y luz vende por sí solo, sin necesitar un modelo 3D real.

---

## 4. Naming

| Candidato | Estado |
|---|---|
| WebYa, ProntoWeb, WebFacil | ❌ Descartados — chocan con agencias existentes o están muy saturados |
| **SitioYa** | ✅ Candidato principal — sin choques de marca encontrados |
| **WebRapida** | ✅ Candidato secundario — sin choques de marca encontrados |

**Pendiente:** verificar disponibilidad real de dominio en NIC.ec (requiere RUC/S.A.S.) y/o Namecheap/GoDaddy para `.com`.

---

## 5. Arquitectura técnica

### Stack
- **Frontend/framework:** Next.js (middleware nativo necesario para resolver tenant por subdominio/dominio custom)
- **Backend/DB:** Supabase (proyecto nuevo, separado de miboleto/Seles)
- **Hosting:** Vercel (cuenta ya existente de Paul)
- **Dev environment:** Claude Code (base) + Antigravity (apoyo en diseño/animación para Nivel 2-3)
- **Animación/interacción:** GSAP para Nivel 2 (PRO) y Nivel 3 (EXPERIENCE); Three.js/WebGL opcional, solo si un caso puntual lo justifica en Nivel 3 — no se depende de generación de modelo 3D por IA (ver sección 2)

### Modelo multi-tenant

**Tabla `tenants`:**
```
id, slug, nombre, plan (template | custom_code), nivel (1 | 2 | 3, obligatorio en los dos planes),
plantilla_id (nullable, solo si plan=template — legado, sin plantillas nuevas desde el reset de sección 5),
dominio_tipo (subdominio | dominio_propio), dominio_custom (nullable),
seles_tenant_id (nullable, futuro), estado_landing (borrador | publicado | pausado), fecha_alta
```
**Estado (2026-08-13):** `nivel` pasó a ser obligatorio para `custom_code` también (antes solo aplicaba a `template`) — migración `20260812200000_custom_code_nivel.sql`, relaja `tenants_plan_fields_check`. Motivo: los 3 niveles siguen siendo estructura comercial (sección 2) aunque ya no exista plantilla de la que depender.

**Tabla `tenant_content`** (aplica a cualquier tenant, sea `template` o `custom_code`):
```
tenant_id, textos (jsonb), precios (jsonb), horarios (jsonb), telefono_whatsapp,
colores_marca (jsonb), fotos (jsonb con urls), foto_destacada (jsonb {url,alt} o null, solo nivel 3 — producto de ProductVisual),
pilares (jsonb, array {titulo,descripcion} — "por qué elegirnos"),
pasos (jsonb, array de strings — "cómo pedir"),
formas_pago (jsonb, array de un set fijo: efectivo | transferencia | tarjeta),
instagram_url (nullable), facebook_url (nullable)
```
RLS por `tenant_id`, mismo patrón que Seles.

(`modelos_3d`, pensada originalmente para URLs de GLB, fue renombrada a `foto_destacada` — ver migración `20260811180000_foto_destacada.sql` — cuando Nivel 3/EXPERIENCE pasó a pseudo-3D con fotos en vez de modelo 3D real, sección 2.)

**Tenants tipo `custom_code`:** su página vive como componente propio en el código, escrito a mano para ese cliente, **dentro del mismo proyecto Next.js** — no como deploy separado. Esta es la decisión estándar: así el cliente hereda automáticamente subdominio/dominio propio y aparece en el panel administrador. La suposición original de este documento era que `custom_code` "no usa `tenant_content` genérico" salvo campos puntuales — en la práctica (`trazojoyas`, `deluxtravel`) terminó siendo lo contrario: **ambos leen `tenant_content` completo** (textos, precios, fotos, colores, WhatsApp, horarios) igual que hubiera hecho un tenant `template`, y solo la composición/layout del componente es lo que varía por negocio. Es el patrón recomendado de acá en adelante — mantiene todo el contenido editable desde el panel admin sin tocar código, que es justo lo que se perdía al no tener plantilla.

**Estado (2026-08-13):** `src/app/[slug]/page.tsx` revisa `tenant.plan`, y si es `custom_code` busca el componente en `src/custom/registro.ts` (`REGISTRO_CUSTOM`, un mapa `slug → componente`) — mecanismo único ahora, no hay `CATALOGO_PLANTILLAS` con el que compararlo (se eliminó, ver sección 5). El registro ya no está vacío: `trazojoyas` y `deluxtravel` están dados de alta. Un tenant `custom_code` sin entrada en el registro da 404 al publicarse.

*Excepción:* un deploy Vercel totalmente separado solo se justifica si el cliente pide explícitamente ser dueño del código/hosting — en ese caso deja de ser un tenant de SitioYa y pasa a ser un proyecto de desarrollo tradicional aparte.

**Flujo de construcción para código a medida:**
1. Antigravity (en el computador, ver sección 5) genera el diseño/código a partir de lo descrito para ese cliente — puede partir de un diseño en Stitch (herramienta de diseño de Google que se integra con Antigravity) o directo de una descripción en lenguaje natural
2. El código se integra como ruta propia dentro del proyecto Next.js existente
3. Se da de alta en el panel administrador como cualquier tenant, marcado `plan = custom_code`
4. Hereda subdominio, dominio propio si aplica, y aparece en el dashboard

### Motor compartido de animación (`src/engine/`)

**No es un sistema de plantillas.** Es una caja de herramientas de componentes de animación que cualquier página de código a medida puede importar y usar — cada página sigue siendo un componente único en `src/custom/{slug}/`, escrito para ese negocio, que decide por sí mismo qué combinación de estos módulos usar y cómo. Nada en `src/engine/` sabe qué es un "tenant" ni asume una estructura de secciones fija.

- **`ScrollReveal`** y **`Parallax`** (`src/engine/ScrollReveal.tsx`, `Parallax.tsx`, GSAP + `@gsap/react`): fade/slide-in al entrar en viewport, y desplazamiento a velocidad distinta al scroll. Usados en `trazojoyas` y `deluxtravel`.
- **`ProductVisual`** (`src/engine/ProductVisual.tsx`): producto "flotando" con parallax de scroll, glow ambiental con el color de acento del tenant (nunca hardcodeado), flotación idle + pedestal sincronizados, marco con marcas de esquina, y tilt/escala al pasar el mouse. Genérico para cualquier rubro donde el producto sea protagonista — no es obligatorio usarlo. El contenedor (`stageRef`, dimensiones fijas) queda preparado a propósito para recibir un `<model-viewer>` (visor 3D real) más adelante sin rehacer el layout.
- Cada página nueva puede además extender el motor con GSAP directo para efectos propios que no ameritan generalizarse todavía — ver `src/custom/deluxtravel/effects.tsx` (Ken Burns, paneo, wipe/clip-path, postal flotante, texto revelado por palabras, contador numérico) como ejemplo de este patrón.

**Estado (2026-08-12, reset del catálogo):** `CATALOGO_PLANTILLAS` quedó vacío — decisión explícita de Paul: el resultado visual de las 4 plantillas construidas hasta ese punto no estaba funcionando, así que se borró todo el código de plantillas (`src/templates/plantilla-*`) para repensar el enfoque de diseño desde cero, en vez de seguir iterando sobre lo ya construido. Impacto asumido a sabiendas: los 8 tenants publicados que dependían de estas plantillas (El Establo, Panadería Doña Carmela, Café Altura, Toquilla Andina, Fuego Callejero → `plantilla_carniceria_pizarra`; Barro Andino, DeluxTravel → `plantilla_vitrina_demo_21st`; Toy Land → `plantilla_jugueteria`) quedaron rotos (404) — sus registros en Supabase (`tenants`/`tenant_content`) no se tocaron en ese momento, solo el código de presentación. El tenant de demo `trazojoyas` (`plantilla_joyeria`, nunca llegó a publicarse) también quedó sin plantilla.

**Estado (2026-08-13, limpieza final del reset):** `src/lib/catalogo-plantillas.ts` se eliminó por completo (ya no tenía nada más que un array vacío) — `NIVEL_LABELS` se movió a `src/lib/niveles.ts`, sin ninguna dependencia de un catálogo. `src/templates/engine/` se renombró a `src/engine/` — vivía bajo `src/templates/` solo porque las plantillas (ya borradas) lo importaban desde ahí; el nombre "templates" ya no describe nada real en el proyecto. `.claude/agents/template-builder.md` se reescribió: ya no describe construir "una plantilla nueva para un rubro que no existe en el catálogo", sino la página de código a medida de un negocio específico — sigue llamándose `template-builder` (nombre del agente, no se renombró el archivo) pero su proceso ya no asume catálogo ni reutilización entre negocios. Se borraron además, a pedido explícito de Paul, los 6 tenants rotos que no se iban a reconstruir (El Establo, Panadería Doña Carmela, Café Altura, Toquilla Andina, Fuego Callejero, Barro Andino) y Toy Land (el octavo, mismo motivo) — de los 8 originales solo sobreviven `trazojoyas` y `deluxtravel`, ya migrados a `custom_code`. **De acá en adelante no hay ningún resto del sistema de plantillas en el código ni en la documentación activa** — lo que queda mencionado abajo es registro histórico explícito, no arquitectura vigente.

**Estado (2026-08-13, primeros dos tenants `custom_code`):** `REGISTRO_CUSTOM` (`src/custom/registro.ts`) ya no está vacío — la nota de la línea de arriba sobre "hoy el registro está vacío" quedó desactualizada. `trazojoyas` (`src/custom/trazojoyas/TrazoJoyas.tsx`, demo, nunca publicada, fotos de muestra Unsplash) fue el primero. `deluxtravel` (`src/custom/deluxtravel/DeluxTravel.tsx`) es el segundo y el primer caso de **revivificación**: tenant real publicado antes del reset (agencia de viajes en Cuenca, dependía de `plantilla_vitrina_demo_21st`), reconstruido como código a medida con su contenido real ya existente en `tenant_content` (no se tocó Supabase). Dirección visual pedida explícitamente para este caso: cada sección a pantalla completa (100dvh), fotografía de playa/mar predominante, animación propia por bloque (extiende `ScrollReveal`/`Parallax` del motor compartido con GSAP directo en `src/custom/deluxtravel/effects.tsx` — Ken Burns, paneo, wipe/clip-path, postal flotante, texto por palabras, contador — documentado ahí mismo). Combina las 7 fotos reales del negocio ya cargadas (`public/tenants/deluxtravel/`) con 5 fotos de paisaje de playa con licencia Unsplash (destino, no producto — la agencia no tiene fotos propias de sus destinos), atribuidas en el footer. De paso se agregó `"agencia_viajes"` (schema.org `TravelAgency`) al enum `Rubro` (`src/lib/types.ts`, `src/lib/json-ld.ts`), mismo criterio que `"joyeria"` — el tenant sigue con `rubro="servicios"` en Supabase hasta que se actualice desde el panel.

**Estado (2026-08-13, tercer tenant `custom_code`):** `moonvet` (`src/custom/moonvet/Moonvet.tsx`) — 24 Horas Clínica Veterinaria Moonvet, sector Santa María de Sayausí, Cuenca. Negocio real, sin fotos propias todavía (4 fotos de muestra Unsplash, mismo protocolo de tracking/atribución que DeluxTravel). El dato real más fuerte de este negocio (atiende 24 horas) se convirtió en la firma visual de la página (webya.md sección 7): el nombre "Moonvet" se traduce literalmente en un motivo lunar (foto de luna real, badge "Abierto ahora" con reloj en vivo de Cuenca vía `useSyncExternalStore`, fase lunar calculada en el cliente en `src/custom/moonvet/effects.tsx`) en vez de una firma decorativa sin relación con el negocio. No usa `ProductVisual` (no es un negocio de producto físico protagonista) ni `foto_destacada` — las fotos usan un tratamiento propio (tarjeta redondeada + resplandor de acento + `Parallax` sutil). De paso se agregó `"veterinaria"` (schema.org `VeterinaryCare`) al enum `Rubro` (`src/lib/types.ts`, `src/lib/json-ld.ts`), mismo criterio que `"joyeria"`/`"agencia_viajes"` — el tenant real se da de alta desde el panel admin (no se tocó Supabase para este build).

**Estado (2026-08-16, cuarto tenant `custom_code` — primero fuera de Ecuador):** `jmj` (`src/custom/jmj/JMJPainting.tsx`) — JMJ Painting & Remodeling, contratista de remodelación y pintura residencial en East Brunswick, NJ, EE.UU. Negocio real: su sitio anterior (`jmjpaintingandremodeling.com`) quedó comprometido/hackeado (spam inyectado por un tercero, nunca replicado ni referenciado acá); esta página se construyó desde cero con el contenido real y legítimo del negocio. Primer tenant del proyecto en inglés y con CTA primario de llamada telefónica (`tel:+1XXXXXXXXXX`) en vez de WhatsApp — `tenant_content.telefonoWhatsapp` sigue siendo el campo de esquema usado para guardar el número, solo que esta página lo renderiza como botón de llamada; se ofrece un botón secundario de WhatsApp únicamente en el bloque de "Free Estimate" (enviar fotos), nunca como CTA primario. Firma visual: "Swatch Board" — los 9 servicios (de baño a hidrolavado) se presentan como muestras de pintura (paint chips) con código de muestra tipo ferretería, más un divisor "cinta métrica" (marcas de pulgada en SVG) entre secciones — ligado genuinamente al negocio porque "Painting" es la primera palabra del nombre. Sin fotos propias todavía: 7 fotos de muestra Unsplash descargadas a `public/tenants/jmj/` (mismo patrón que Moonvet), tracking y atribución en el footer en inglés. De paso se agregó `"contratista_remodelacion"` (schema.org `GeneralContractor`) al enum `Rubro` (`src/lib/types.ts`, `src/lib/json-ld.ts`), mismo criterio que los rubros anteriores. **Bug de `src/lib/json-ld.ts` corregido de paso:** `addressLocality: "Cuenca"` y `addressCountry: "EC"` estaban hardcodeados en el JSON-LD desde que ese archivo solo servía tenants ecuatorianos — dejó de ser correcto con este tenant (no es de Cuenca ni de Ecuador). `tenant_content` no tiene columnas separadas de localidad/país (solo `textos.direccion` como texto libre), así que en vez de agregar una heurística frágil para adivinarlos del texto, el JSON-LD ahora solo completa `streetAddress` con ese texto libre — sigue siendo `PostalAddress` válido de schema.org sin asignarle a ningún tenant una localidad/país que no le corresponde. Además, JMJ es un negocio de zona de servicio sin dirección de oficina exacta (`textos.direccion` se usa acá como descripción de zona, "East Brunswick, NJ & East Central New Jersey", no como dirección postal) — la página deliberadamente no intenta un embed de Google Maps a partir de eso, mismo principio que Moonvet/DeluxTravel de omitir el mapa antes que mostrar uno impreciso. El tenant real se da de alta desde el panel admin (no se tocó Supabase para este build).

**Estado (2026-08-16, quinto tenant `custom_code`):** `travel-agency` (`src/custom/travel-agency/TravelAgency.tsx`) — "Travel Agency" (nombre real del negocio, en inglés, confirmado tal cual por Paul), agencia de viajes que opera en Sudamérica, con 5 tours activos y precio fijo real dado por Paul (Colombia $800, Brasil $900, Argentina $1200, Perú $700, Bolivia $860). Segundo tenant de agencia de viajes del proyecto después de `deluxtravel`, pero con firma visual deliberadamente distinta (webya.md sección 7, "un elemento firma único por landing" — no hereda ni reskinea la firma cinematográfica full-bleed de DeluxTravel): "Pase de embarque" — cada tour se presenta como una tarjeta de boarding pass real (perforación punteada con muescas circulares "troqueladas", código de barras decorativo determinístico, código IATA real del aeropuerto más cercano al hito fotografiado de cada destino, precio como la "tarifa" del pase) porque el dato más fuerte y concreto de este negocio es justo eso: 5 países con precio fijo por persona. Extiende el motor compartido con tres efectos propios documentados en `src/custom/travel-agency/effects.tsx`: `FlipReveal` (titular del hero letra por letra, con giro 3D tipo tablero de salidas de aeropuerto/Solari board — agrupado por palabra para que el salto de línea nunca parta una palabra ni dañe la puntuación), `RouteLine` (ruta de vuelo punteada entre origen y destino que se traza con el scroll, con un avioncito recorriéndola) y `StampReveal` (sello de tinta que "cae" de golpe sobre la tarjeta, con rebote, como un sello de aduana/pasaporte). Sin fotos reales del negocio todavía (ni de oficina ni de los tours, confirmado por Paul): 6 fotos de muestra Unsplash (una de aeropuerto para el hero + una por destino, elegidas por ser el hito/paisaje más reconocible de cada país) descargadas a `public/tenants/travel-agency/`, tracking y atribución en el footer. No usa `ProductVisual` ni `foto_destacada` (no es un negocio de producto físico protagonista). Sin dirección de oficina exacta (Paul solo dio "opera en Sudamérica") — mismo criterio que JMJ/Moonvet de omitir el embed de Google Maps antes que mostrar uno impreciso; el código de origen "ECU" en cada pase es un recurso visual, no un código IATA real de una ciudad puntual. **Asunción del agente constructor** (mismo criterio que los 9 servicios de JMJ): Paul no dio qué incluye cada paquete ni si el precio es por persona o por grupo — se usa "Vuelos + hotel + asesoría" como contenido por defecto y se etiqueta el precio como "por persona" (interpretando la frase de Paul "precio fijo por persona/paquete"), ambos editables desde el panel admin sin tocar código. **Bug de wrapping de texto corregido de paso:** la primera versión de `FlipReveal` animaba un span por carácter suelto (sin agrupar por palabra), lo que dejaba que el navegador partiera la línea en cualquier punto — se detectó en la verificación visual (Playwright + Edge) que dejaba comas huérfanas al inicio de línea y palabras partidas a la mitad; corregido agrupando los caracteres en un `span` por palabra con `whitespace-nowrap`. También se descartó usar el emoji de bandera de cada país en las tarjetas de tour: Windows no renderiza el emoji de bandera compuesto y en su lugar muestra las dos letras del código de país sueltas (se veía como un error tipográfico) — el código IATA de 3 letras ya cumple ese rol visual sin depender de soporte de fuente emoji. El tenant real se da de alta desde el panel admin (no se tocó Supabase para este build).

**Estado (2026-08-16, sexto tenant `custom_code`):** `jyw-cc` (`src/custom/jyw-cc/JYWCC.tsx`) — "JYW CC" (nombre real del negocio tal cual lo dio Paul, sin expandir ni reinterpretar las siglas), joyería, WhatsApp 0939671012. A diferencia de los tenants anteriores, Paul no dio ningún detalle de producto más allá del nombre y el rubro (sin tipo de joyería, materiales, precios ni fotos) — el agente constructor asumió el segmento más común de joyería vendida por WhatsApp en Ecuador: piezas de uso diario (anillos, aretes, cadenas, pulseras) en plata 925, acero quirúrgico hipoalergénico y oro laminado, sin precios fijos (no hay ninguno confirmado por Paul, así que la única mención de precio en la página es una nota que dirige a WhatsApp, mismo patrón que El Establo/sección 10). Segundo tenant de joyería del proyecto después de `trazojoyas` (demo interno, nunca publicado), pero con firma visual deliberadamente distinta (webya.md sección 7): "Sello de Ley" — un medallón tipo troquel de orfebre (código de material: 925 / A.Q. / O.L.) que se "presiona" sobre la pantalla con el scroll (`SelloPress`, con un anillo de onda de impacto que se expande al asentarse), más un divisor de cadena que se arma eslabón por eslabón (`ChainDivider`) — ambos en `src/custom/jyw-cc/effects.tsx`, ligados genuinamente al negocio (certificar el material real de una pieza es justo la pregunta que un comprador se haría por WhatsApp) y sin nada del grid Swiss minimalista sin adorno de `trazojoyas`. Usa `ProductVisual` en el hero (webya.md sección 3, joyería es el ejemplo canónico), condicionado a `content.fotoDestacada` — como esa foto está en `null` (Paul no cargó nada todavía), el hero cae a una foto de muestra enmarcada con `Parallax` hasta que se cargue una foto real de pieza con fondo aislado desde el panel admin; no hay bloqueo automático de publicación por esto (se quitó, `src/app/admin/actions.ts`), queda como aviso explícito de revisión manual. Sin fotos propias del negocio todavía: 7 fotos de muestra Unsplash (anillos, aretes, cadenas, pulseras, un joyero trabajando, una caja de regalo) descargadas a `public/tenants/jyw-cc/`, tracking y atribución en el footer. El tenant real se da de alta desde el panel admin (no se tocó Supabase para este build). **Nota de verificación:** esta sesión no tuvo un navegador/Playwright disponible (a diferencia de la verificación visual de `travel-agency` arriba) — se verificó con `tsc`/`eslint`/`next build` limpios y levantando el dev server para confirmar por HTTP que la ruta renderiza sin errores de servidor, con las 7 fotos sirviendo 200 y el contenido/CTAs esperados presentes en el HTML; no reemplaza una revisión visual real antes de publicar.

**Estado (2026-08-16, landing de marketing de la plataforma):** `/` (raíz) dejó de ser el placeholder que listaba tenants — ahora es la landing de marketing de la plataforma misma (`src/marketing/26st/Home26st.tsx`, renderizada desde `src/app/page.tsx`), pedido explícito de Paul ("la más genial de todas"). No es un tenant: vive en `src/marketing/` en vez de `src/custom/`, mismo espíritu de código a medida pero para la plataforma, no para un negocio. Nombre de marca usado en esta landing: **"26st"**, no "SitioYa" — alcance deliberadamente acotado a esta página (título del sitio, panel admin y metadatos siguen diciendo "SitioYa" por ahora, no fue un descuido). Firma visual: placa de número de calle ("26" + "ST" con relieve), coherente con que el nombre de marca es literalmente una dirección. Portafolio con las 4 páginas de código a medida existentes (trazojoyas, deluxtravel, moonvet, jmj — las 4 publicadas a propósito por Paul el mismo día para poder mostrarlas acá), con screenshot real de cada una (`public/26st/portfolio/`, capturados en vivo, no mockups) y link a la página publicada. CTA principal: formulario de contacto (no WhatsApp/teléfono — esta landing no tiene canal propio todavía), guarda el lead en la tabla nueva `landing_leads` (migración `20260816150000_landing_leads.sql`, insert público vía RLS, lectura solo admin) a través de un server action (`src/app/actions.ts`) con el cliente de sesión (anon key), mismo patrón RLS-first del resto del proyecto. **Pendiente:** correr la migración `20260816150000_landing_leads.sql` contra el proyecto Supabase real (vía SQL editor del dashboard — no hay CLI de Supabase enlazado localmente) para que el formulario efectivamente guarde leads; sin eso, el formulario falla con gracia (mensaje de error) pero no persiste nada.

**Estado (2026-08-16, séptimo tenant custom_code — primera página puramente informativa):** `sagedac` (`src/custom/sagedac/Sagedac.tsx`) — SAGEDAC, la holding/base digital personal de Paul, entidad matriz de la que nacen y desde la que se conectan Domiship, miboleto.ec, Seles, Turnova y Convia (WebYa/26st queda fuera a propósito, es un proyecto personal aparte). A diferencia de los seis tenants anteriores, no es un negocio local con clientes: es una página informativa/de referencia (portafolio personal, "snapshot visual" del ecosistema), sin venta — por eso rompe deliberadamente varios principios de la sección 7 que sí son obligatorios para el resto:

- **Sin fotografía**, ni siquiera de muestra Unsplash: el diseño es estrictamente abstracto/geométrico (nodos, líneas, tipografía) sobre blanco y negro puro, sin ningún color de acento — no hay "negocio físico" que fotografiar, y forzar una foto de stock de oficina genérica habría sido justo el placeholder sin avisar que la sección 7 prohíbe.
- **Sin WhatsApp ni CTA de ningún tipo**: `content.telefonoWhatsapp` existe en el esquema pero esta página no lo lee ni renderiza ningún botón de contacto — no vende nada.
- **Sin precios**: `content.precios.nota` se reutiliza con una convención propia (ver abajo) para el copy de cierre, no para un precio.
- **`content.rubro` usa `"otro"`** (valor ya existente en el enum `Rubro`) — una holding no tiene un rubro de negocio local real.
- **No lee `content.coloresMarca`**: a diferencia de cualquier otro tenant `custom_code`, la paleta no es editable por campo — el blanco y negro estricto es una decisión de marca fija, pedido explícito de Paul ("SIN colores de acento de ningún tipo").

Sigue leyendo `tenant_content` completo como cualquier otro tenant `custom_code` (mismo criterio de sección 5), reinterpretando el esquema genérico con una convención propia documentada en el componente: `content.precios.categorias` representa los 5 proyectos (`cat.nombre` = nombre del proyecto, `cat.items[0]` = rol/one-liner, `cat.items[1]` = descripción completa), `content.precios.nota` es el copy de la sección de cierre ("lo que viene" — una futura app de delivery tipo Rappi/PedidosYa, insinuada sin ser uno de los cinco proyectos activos), y `content.textos.diferenciador` es el statement de la sección de transición ("no son proyectos separados, es un ecosistema conectado").

Firma visual: "Sistema radicular" — el hero es un nodo central del que nacen líneas finas hacia abajo (dibujadas con CSS puro al cargar la página, ver nota de ScrollReveal más abajo); conforme se hace scroll, un eje vertical crece hacia abajo (`ProjectsTrunk`, `src/custom/sagedac/effects.tsx`, scaleY 0→1 con scrub de GSAP) y cada uno de los 5 proyectos "brota" de él (`NodePop`, con rebote `back.out`) — SAGEDAC es la base de la que las ramas crecen, nunca un panel que las observa desde arriba (recordatorio de posicionamiento explícito del brief: nunca describir a SAGEDAC en sí como "panel"/"dashboard"/"monitoreo"). Seles, el conector clave del ecosistema (presta facturación electrónica a Domiship y a Turnova), muestra además `SelesFlow`: un diagrama con dos curvas que se trazan con `path.getTotalLength()` + `stroke-dashoffset` (misma técnica real que `RouteLine` en `src/custom/travel-agency/effects.tsx`) y luego pulsan en bucle vía `offsetPath` para transmitir un servicio "en curso", no una conexión de una sola vez — el momento visual más importante de la página.

**Nota técnica reutilizable (bug real, no hipotético):** `ScrollReveal` con su `start: "top 85%"` por defecto puede fallar en no revelarse nunca para contenido ya garantizado dentro del viewport al cargar (confirmado primero en la landing de 26st, 2026-08-16). El hero de SAGEDAC evita el problema de raíz usando animación CSS pura (`animate-fade-in-up`, ya existente en `globals.css`, con `animationDelay` escalonado) en vez de ScrollReveal — y de paso se agregó una segunda utilidad CSS al mismo archivo, `animate-draw-line` (trazo de un `<path>` SVG vía `pathLength="1"` + `stroke-dashoffset`, sin JS), para el mismo caso de uso pero con líneas en vez de texto/bloques — reutilizable por cualquier página futura que necesite dibujar una línea en el hero sin depender de scroll. El resto de la página (los 5 proyectos, la transición, el cierre) sí usa ScrollReveal/GSAP ScrollTrigger normalmente, porque ahí el contenido NO está garantizado visible sin scroll — es exactamente el caso de uso correcto.

El tenant real (`tenants` + `tenant_content` en Supabase) no se dio de alta en este build — a diferencia del resto de tenants recientes, esta página podría incluso no publicarse nunca como tenant público (es una referencia interna de Paul, no necesariamente algo para mostrar a terceros); queda a su criterio si alguna vez la da de alta desde el panel admin.

Registro histórico de lo que existió antes del reset (por si sirve de referencia al reconstruir, no como código vigente):

- `plantilla_carniceria_pizarra` — la original, basada en El Establo Cárnicos, con las 3 capas (START/PRO/EXPERIENCE) validadas en producción real con 5 tenants.
- `plantilla_jugueteria` (2026-08-12, caso Toy Land) — filas numeradas con foto real por producto, estilo Neo-Brutalism, paleta multicolor extraída del logo. Reconstruida una vez ese mismo día por el agente constructor de plantillas tras descartar un primer borrador hecho a mano.
- `plantilla_joyeria` (2026-08-12) — joyería accesible de uso diario, grid Swiss/minimalista sin reskinear las plantillas hermanas, sin tenant real de validación (usaba marcadores de posición).
- `plantilla_vitrina_demo_21st` — experimento comparativo con componentes de 21st MCP (sección 12).
- `plantilla_restaurante`, `plantilla_servicios_profesional`, `plantilla_tienda_retail` — nunca llegaron a construirse (quedaban como "futuras").

**Estrategia de producción por página:** construir primero la capa START (estructura, contenido real, fotografía), validar con el cliente; luego añadir PRO (animaciones/interacciones) si el nivel contratado lo incluye; luego EXPERIENCE (profundidad visual, `ProductVisual`) si aplica. Medir consumo de IA y tiempo de producción real antes de contratar planes pagos de herramientas adicionales — ya no hay una "plantilla base" que amortizar entre clientes, así que el tiempo por página es el costo real a vigilar.

### Ruteo — tres escenarios

**Fase 1 (ahora, MVP/desarrollo):** ruteo por path, sin dominio propio de la plataforma.
`sitioya.vercel.app/elestablo`

**Fase 2 (lanzamiento con clientes reales):** subdominio propio de la plataforma.
`elestablo.sitioya.com` — requiere dominio propio + wildcard en Vercel.

**Fase 3 (cliente quiere su propio dominio):** dominio custom del cliente.
1. Cliente ya tiene o compra su dominio
2. Se agrega el dominio al proyecto de Vercel y se marca `dominio_tipo = dominio_propio`, `dominio_custom = ...` en `tenants`
3. Cliente configura DNS de su dominio apuntando a Vercel
4. Vercel verifica propiedad y genera SSL automáticamente
5. Middleware resuelve el tenant por subdominio o dominio custom, evitando contenido duplicado

Upsell natural: dominio propio como servicio adicional.

### Dos flujos de trabajo — no confundir

| | Flujo A — Construcción de la página | Flujo B — Alta de cliente |
|---|---|---|
| **Dónde** | Claude Code (agente `template-builder` u otro), trabajando directo sobre archivos del proyecto | Panel administrador, en el navegador |
| **Cuándo** | Siempre que entra un negocio nuevo — no hay atajo sin código, cada página es de código a medida | Siempre que entra un cliente real, junto con el Flujo A (no en su lugar) |
| **Qué produce** | El componente de la página (`src/custom/{slug}/`), se sube al repo y se despliega en Vercel | Un registro nuevo en Supabase (`tenants` + `tenant_content`) con el contenido real del negocio |
| **Requiere tocar código** | Sí | No |

**Estado (2026-08-13):** desde el reset del catálogo (arriba), **Flujo A ya no es ocasional** — es parte obligatoria de dar de alta cualquier negocio nuevo, porque no queda ninguna capacidad ya construida que un Flujo B solo pueda reutilizar sin código (esa era la promesa del sistema de plantillas, y es justo lo que se descartó). El motor compartido (`src/engine/`) sí se reutiliza como herramienta dentro de cada Flujo A, pero no reemplaza la necesidad de escribir el componente de cada página.

### Panel administrador (interno, Paul) — dos paneles distintos, no confundir

1. **Panel administrador** — solo Paul (y futuro equipo). Acceso total a todos los tenants.
2. **Panel de autoedición** — cada cliente, acceso solo a su propio tenant.

**Autenticación:** Supabase Auth con rol `admin` (tabla `admins` o claim en JWT). RLS separa: `admin` ve/edita todos los tenants, cliente normal solo el suyo.

**Qué hace el panel administrador:**

| Función | Detalle |
|---|---|
| Dashboard de clientes | Lista de tenants: nombre, plan, nivel, estado, tipo de dominio — con búsqueda y filtros |
| Crear cliente nuevo | Nombre, slug, WhatsApp, dirección, horario, nivel (1/2/3) — sin selector de plantilla, todo tenant nuevo nace `plan="custom_code"` (`src/app/admin/(protected)/nuevo/_components/FormularioNuevoTenant.tsx`). **Paso de confirmación obligatorio:** el formulario muestra en vivo la URL resultante (`elnombre.sitioya.com`) a partir del slug, valida que no esté repetido, y pide confirmar explícitamente que el nombre del negocio y el subdominio están bien escritos antes de guardar — cambiarlo después de publicado rompe enlaces ya compartidos y SEO |
| Carga inicial de contenido | Precios, productos, textos, fotos — y para Nivel 3, subir fotos del producto para generar el modelo 3D |
| Vista previa antes de publicar | Estado `borrador` hasta revisión |
| Gestión de dominio | Tipo de dominio y registro de dominio custom si aplica |
| Gestión de acceso del cliente | Generar credenciales del panel de autoedición |

### Panel de autoedición (cliente)
Login por tenant → formulario (precios, textos, horarios, WhatsApp, fotos) → guardar → Supabase actualiza → landing pública refleja el cambio al instante. Se activa cuando el admin publica y genera el acceso.

---

## 6. Integración futura: Seles (facturación electrónica)

**Idea:** que los negocios con landing puedan emitir comprobantes electrónicos (vía SRI) conectando su cuenta de Seles.

- Campo `seles_tenant_id` en `tenants` — vincula el negocio de SitioYa con su cuenta en Seles
- Coherente con la arquitectura multi-tenant que Seles ya tiene (RLS, roles, integración SRI)

**Estado:** exploratorio, no es parte del build inicial.

### Otras sinergias con el ecosistema
- **Domiship:** cross-venta hacia el marketplace para negocios de comida/retail
- **Turnova:** clínicas/consultorios con landing calzan directo con agendamiento
- **Convia:** negocios con volumen de WhatsApp, futuro call center omnicanal
- **SAGEDAC:** clientes de SitioYa entran a la tabla compartida `crm_contactos` para visibilidad consolidada del portafolio

---

## 7. Principios de diseño (todos los niveles)

- Anclar el diseño en el mundo real del negocio — no plantilla genérica de IA
- Un elemento "firma" único por landing
- Mobile-first (72%+ de búsquedas en Ecuador son desde celular) — crítico también para Nivel 3 (modelos 3D livianos)
- CTA principal: WhatsApp
- Botón fijo de WhatsApp/llamada en móvil
- Fotos/modelos reales del negocio > stock genérico
- **SEO local con datos estructurados (JSON-LD LocalBusiness) — requisito base, no opcional, en los 3 niveles.** Cada landing debe generar automáticamente un `<script type="application/ld+json">` a partir de los datos que ya existen del tenant (nombre, dirección, teléfono, horario, rating de Google, foto, URL) — no es algo que el admin arme a mano por tenant. Usa el tipo de schema.org más específico disponible según el rubro del negocio (`Restaurant`, `Bakery`, `CafeOrCoffeeShop`, `GroceryStore`, etc.), cayendo a `LocalBusiness` genérico si no aplica ninguno. **Estado (2026-08-11):** implementado (`src/lib/json-ld.ts`, generado en `src/app/[slug]/page.tsx` antes del switch de plantilla, así toda plantilla futura lo hereda gratis). El rating de Google se carga a mano por el admin (`tenant_content.google_rating`/`google_review_count`) — no hay integración con la API de Google Places en el proyecto. De paso se agregaron meta tags Open Graph (título, descripción, imagen, URL) en el mismo `generateMetadata`, que tampoco existían antes de esto.
- **Favicon por tenant.** Estado (2026-08-17): `src/app/[slug]/page.tsx` (`generateMetadata`) resuelve el favicon de cada landing en dos pasos. **1)** `content.faviconUrl` — subido por Paul desde el panel admin (`Card "Favicon"` en `/admin/{id}`, componente `FormularioFavicon.tsx`, acción `actualizarFaviconAction`) a un bucket real de Supabase Storage (`tenant-assets`, primer uso de Storage en el proyecto — migración `20260817120000_favicon_upload.sql`, RLS: lectura pública, escritura solo `is_admin()`). Pedido explícito de Paul: quería poder subirlo él mismo por tenant sin tocar código/git cuando el cliente le manda el logo. **2)** Si no hay `faviconUrl` todavía, cae al archivo estático en `public/tenants/{slug}/` (`logo.png`/`logo.jpg`/`logo-mark.png`/`favicon.png`/`favicon.ico`, mismo orden que ya usa el helper `foto()` de cada componente para el logo del header — sigue funcionando para tenants con el logo colocado así desde antes de que existiera la subida por panel, ej. jmj). Si ninguna de las dos existe, cae al `favicon.ico` genérico de `src/app/` (el que usan hoy la landing de 26st y el panel admin). **Nota:** esto NO es la subida general de fotos pendiente (`EditorContenidoCliente.tsx` sigue con "pega la URL" para el resto de fotos) — es específica del favicon y solo desde el panel admin, no desde el panel de autoedición del cliente.

---

## 8. Roadmap de construcción

1. **Esquema Supabase completo** — tablas `tenants` (con `nivel`, dominio, `estado_landing`, `seles_tenant_id`), `tenant_content`, `admins`, RLS.
2. ~~**Primera plantilla del catálogo (Nivel 1)** — convertir El Establo en `plantilla_carniceria_pizarra`.~~ Hecho en su momento, luego borrado en el reset del catálogo (sección 5) — El Establo hoy no tiene página (su tenant se eliminó el 2026-08-13).
3. **Ruteo Fase 1 (path-based)** — funcional en `sitioya.vercel.app/negocio`.
4. **Panel administrador** — dashboard, crear cliente, carga inicial, vista previa, publicar.
5. **Panel de autoedición (cliente)**.
6. **Nivel 2 / PRO** — ✅ `ScrollReveal` + `Parallax` vía GSAP, ahora en `src/engine/`, reutilizados por cualquier página de código a medida que los necesite (`trazojoyas`, `deluxtravel`). Falta extender la capa de animación (ProductHover, TextAnimation, PageTransition) como módulos genéricos del motor.
7. **Nivel 3 / EXPERIENCE** — ✅ `ProductVisual` implementado en `src/engine/`: flotación + sombra + glow + tilt por mouse con fotos reales, sin modelo 3D real ni `<model-viewer>`. Falta `Particles`/`Lighting`.
8. **(Futuro) Fase 2** — dominio propio de la plataforma + subdominios wildcard.
9. **(Futuro) Fase 3** — dominio propio por cliente.
10. **(Futuro, exploratorio) Integración Seles.**
11. ~~**(Futuro) Plantillas adicionales al catálogo.**~~ Cancelado — reset del catálogo, 2026-08-12 (sección 5). No se van a construir más plantillas reutilizables; cada negocio nuevo es código a medida.
12. **vitrina-demo (Barro Andino):** era el experimento comparativo con componentes de 21st MCP — el tenant se borró en la limpieza del 2026-08-13 (nunca se decidió adoptar nada de ahí para "plantillas de producción", que ya no existen como concepto).

---

## 9. Próximos pasos inmediatos

Lista original de bootstrap (nombre de marca, crear proyectos, esquema Supabase, primera plantilla) — todo completado hace rato, dejó de ser "próximo" y se retiró de acá. Estado real al 2026-08-13:

- [x] Proyecto Next.js + Supabase real conectados, en producción en Vercel (`26st.vercel.app`), repo en GitHub
- [x] Panel administrador y de autoedición funcionando
- [x] Reset del catálogo de plantillas — código a medida como único camino (sección 5)
- [x] Tres páginas reales en `custom_code`: `trazojoyas` (demo, borrador), `deluxtravel` (publicado) y `moonvet` (código listo, alta del tenant real pendiente desde el panel admin)
- [ ] Reconstruir (si se decide) los negocios reales que quedaron sin página tras el reset y la limpieza posterior — hoy ninguno tiene página propia: El Establo, Panadería Doña Carmela, Café Altura, Toquilla Andina, Fuego Callejero, Barro Andino, Toy Land
- [ ] Publicar `trazojoyas` cuando tenga una foto destacada real (hoy usa fotos de muestra Unsplash, bloqueado por ser Nivel 3)
- [ ] Dar de alta el tenant real de Moonvet en Supabase (`tenants` + `tenant_content`) desde el panel admin, con WhatsApp (0939671012), dirección exacta en Santa María de Sayausí, y confirmar/corregir los servicios y diferenciadores que el agente constructor asumió (ver detalle en el reporte de construcción)
- [ ] Confirmar nombre de marca definitivo (sigue "tentativo" en el encabezado del documento)
- [ ] Fase 2 (dominio propio + subdominios wildcard) cuando haya clientes reales que lo justifiquen

---

## 10. Referencia: demo de El Establo Cárnicos

- **Negocio:** El Establo Cárnicos, Av. Ordóñez Lasso, Cuenca — tel/WhatsApp +593 93 967 1012
- **Horario:** Lun-Vie 8am-8pm, Sáb 8am-9pm, Dom 8am-6pm
- **Diferenciador:** precio y variedad, cambia a diario · canal de pedidos: WhatsApp
- **Concepto visual:** "pizarra de precios" — paleta oxblood/carbón/latón, tipografía Oswald + Karla + Space Mono
- **Estado:** su página (`plantilla_carniceria_pizarra`, Nivel 1) se borró en el reset del catálogo y el tenant se eliminó en la limpieza del 2026-08-13 — El Establo no tiene página hoy. Esta sección queda como referencia del negocio real, no como código vigente.
