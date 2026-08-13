# SitioYa — Landings para negocios locales (Ecuador)
> Documento maestro de referencia para construcción con Claude Code.
> Última actualización: 2026-08-10 · v3

**Nombre de marca:** tentativo, pendiente de confirmar (candidatos: SitioYa, WebRapida — ver sección 4).

---

## 0. Instrucciones para Claude Code — leer antes de empezar

- **Alcance del primer build:** enfocarse solo en los pasos 1-5 del roadmap (sección 8) — Nivel 1 completo y funcional de punta a punta: esquema de Supabase, primera plantilla (El Establo), ruteo Fase 1 (path-based, sin dominio), panel administrador, y panel de autoedición. **No intentar construir Niveles 2/3, Fases 2/3 de dominio, ni la integración con Seles todavía** — quedan documentados a propósito para no bloquear la arquitectura, pero son trabajo futuro, no parte de este build.
- **Migraciones de Supabase:** el proyecto real de Supabase todavía no existe (no hay credenciales aún). Escribir los archivos de migración SQL (tablas `tenants`, `tenant_content`, `admins`, políticas RLS) en `/supabase/migrations/`, bien comentados, pero **no asumir que se pueden ejecutar contra una base de datos real todavía**. Mientras tanto, continuar en paralelo con el resto del código del proyecto (estructura Next.js, componentes de plantilla, lógica del panel administrador y de autoedición) usando ese esquema como referencia. Cuando Paul cree el proyecto Supabase real y provea las credenciales (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, etc.), esas migraciones se ejecutan y se conecta todo.
- Si hace falta tomar una decisión de diseño no cubierta aquí, preferir la opción más simple que no cierre la puerta a lo ya documentado (plantillas, niveles, dominios, Seles) — no sobre-construir por adelantado.

---

## 1. Qué es esto

Servicio de landing pages para negocios locales ecuatorianos que **ya tienen buenas reseñas en Google pero no tienen sitio web**. Se les vende una landing profesional, editable por ellos mismos, a un precio muy por debajo del mercado local. Parte del ecosistema de proyectos de Paul (miboleto.ec, Seles, Domiship, Turnova, Convia, SAGEDAC).

**Demo de validación:** landing de prueba para *El Establo Cárnicos* (carnicería real en Cuenca) — ver sección 10. Sirve como referencia visual del primer caso construido (Nivel 1). Desde el reset del catálogo de plantillas (2026-08-12, sección 5), ya no es "el primer template del catálogo" — cada negocio nuevo se construye como código a medida, no como instancia de una plantilla reutilizable.

---

## 2. Modelo de negocio

### Segmento objetivo
Negocios locales con buenas reseñas en Google, sin web propia, que atienden pedidos/consultas por WhatsApp.

### Estructura de producto: 3 niveles + código a medida

En vez de un solo producto, se ofrecen **3 niveles de landing** (por sofisticación visual e interactiva) más un nivel aparte de **código a medida** para necesidades fuera de catálogo. Los tres niveles comparten la misma base de secciones (navbar, hero, productos/servicios, **por qué elegirnos (3 pilares)**, **cómo pedir (pasos)**, galería, testimonios, **mapa de ubicación (Google Maps embebido)**, horarios/contacto, **formas de pago**, **redes sociales**, **FAQ (acordeón)**, WhatsApp, footer) y se diferencian por la capa de animación/interacción que se agrega encima — no por cantidad de secciones. Ver arquitectura recomendada ("Landing Engine") en la sección 5.

**Estado (2026-08-12, reset del catálogo de plantillas — decisión de negocio, no solo técnica):** se descarta el modelo de "plantilla reutilizable por rubro" (`plan="template"`, catálogo en código, Flujo A construye una vez / Flujo B reutiliza infinitas veces). El resultado visual de las 4 plantillas construidas hasta ese punto (carnicería, juguetería, joyería, vitrina demo) no estaba funcionando, así que se borraron por completo — ver sección 5 para el detalle técnico. **Camino único de acá en adelante: cada negocio nuevo es una página de código a medida** (`plan="custom_code"`, componente propio en `src/custom/registro.ts`), construida con la información real de ese negocio. Los **3 niveles START/PRO/EXPERIENCE se mantienen** como estructura comercial — ya no diferencian "qué plantilla" sino "cuánta sofisticación visual/interactiva" se construye para esa página específica (el motor compartido `src/templates/engine/` — ScrollReveal, Parallax, ProductVisual — sigue siendo la caja de herramientas reutilizable). Flujo de trabajo con imágenes mientras no hay fotos reales del cliente: usar fotografía de Unsplash (licencia de uso comercial libre, ver credenciales en `.env.local`) como contenido de **muestra/mockup** para mostrarle al dueño del negocio cómo necesitaría las fotos reales — nunca como sustituto permanente ni presentado como "la foto real" de su producto (sigue aplicando el principio de fotografía real de la sección 7).

**Estado (2026-08-11, FAQ):** implementado en `plantilla_carniceria_pizarra`, común a los 3 niveles, ubicado antes del footer. Contenido editable desde `tenant_content.faq` en ambos paneles (admin y autoedición); sin personalizar, la plantilla usa un set de 3-4 preguntas por defecto (definido en código como fallback, no contenido fijo — `FAQ_DEFAULT`). Acordeón vía `<details>/<summary>` nativo (sin JS necesario para colapsar/expandir); START es instantáneo, PRO/EXPERIENCE suman una transición de altura suave por CSS puro (grid-template-rows, sin GSAP — no hacía falta para esto).

**Estado (2026-08-11, bloques de confianza/información):** implementados en `plantilla_carniceria_pizarra`, comunes a los 3 niveles (no diferenciación de tier) — "Por qué elegirnos" y "formas de pago"/"redes sociales" se omiten limpiamente si el tenant no cargó ese contenido; "Cómo pedir" usa un set de 3 pasos por defecto razonable si no se personaliza. START los muestra sin animación (o con el fade-in-up general de la columna); PRO/EXPERIENCE suman scroll-reveal. Editables tanto desde el panel admin como desde el panel de autoedición del cliente.

**Estado (2026-08-11):** el mapa está implementado como parte de la sección de Contacto (no una sección aparte) — embed básico de Google Maps sin API key (`google.com/maps?q={dirección}&output=embed`), construido a partir del campo dirección que ya se captura en el panel admin. Es base en los 3 niveles: START lo muestra estático (mismo fade-in-up de la columna); PRO/EXPERIENCE le suman un reveal propio con leve scale-in (mismo mecanismo `ScrollReveal`, ahora con soporte de `scale`). Si el tenant no tiene dirección cargada, la sección se omite en vez de mostrar un mapa roto.

| Nivel | Nombre | Qué incluye | Herramientas | Precio sugerido |
|---|---|---|---|---|
| **1** | 🟢 START | Fotografía real obligatoria en posiciones prominentes (hero + productos, nunca placeholders genéricos), tipografía con jerarquía fuerte (títulos grandes, seguros), hero asimétrico (alineado a la izquierda) con 1 CTA (WhatsApp), filas de producto numeradas grandes, transición de entrada simple (fade/slide) por CSS puro — sin GSAP/ScrollTrigger, para mantener el nivel liviano | HTML + CSS + JS — sistema de plantillas propio (Next.js) | $99–149 |
| **2** | 🟡 PRO | Todo lo de START + GSAP/ScrollTrigger completo (parallax, marquesina, scroll-reveals), hover y tinte alternado en las filas de producto, 2 CTAs en el hero (WhatsApp + "ver productos") | GSAP + Antigravity (Google) para acelerar generación de diseño/animación | $250–400 |
| **3** | 🔴 EXPERIENCE | Todo lo de PRO + sección `ProductVisual` (producto flotando, con fotos reales, no modelo 3D) **obligatoria y garantizada, no condicional** — regla de proceso: un tenant Nivel 3 no puede publicarse sin la foto de producto destacado cargada, queda en "borrador" con mensaje claro de qué falta — tipografía de hero aún más grande, indicador de scroll ("Desliza ↓") | GSAP (+ Three.js/WebGL opcional, solo si un caso puntual lo justifica) | $400–800 |
| **Código a medida** | — | Desde el reset de 2026-08-12 (ver nota de arriba) ya no es un cuarto nivel aparte — es cómo se construyen los 3 niveles de arriba ahora: cada landing es una página propia, sin plantilla reutilizable de por medio | Desarrollo normal | Mismos rangos de precio por nivel que arriba, cotizado según complejidad real del negocio |

**Estado de build (2026-08-11):** implementado en `plantilla_carniceria_pizarra` — hero asimétrico, tipografía, filas numeradas y transición CSS de START; Parallax + ScrollReveal + hover de PRO; `ProductVisual` obligatorio de EXPERIENCE (bloqueado en `actualizarEstadoAction`, `src/app/admin/actions.ts`, si falta `foto_destacada`). **Pendiente:** el efecto de "marquesina" (texto en scroll continuo/ticker) mencionado en PRO todavía no está construido — solo parallax y scroll-reveals lo están.

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
id, slug, nombre, plan (template | custom_code), nivel (1 | 2 | 3, solo si plan=template),
plantilla_id (nullable, solo si plan=template),
dominio_tipo (subdominio | dominio_propio), dominio_custom (nullable),
seles_tenant_id (nullable, futuro), estado_landing (borrador | publicado | pausado), fecha_alta
```

**Tabla `tenant_content`** (aplica a tenants tipo `template`, cualquier nivel):
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

**Tenants tipo `custom_code`:** no usan `tenant_content` genérico — su página vive como componente propio en el código, escrito a mano (o generado con Antigravity) para ese cliente, **dentro del mismo proyecto Next.js** — no como deploy separado. Esta es la decisión estándar: así el cliente hereda automáticamente subdominio/dominio propio, aparece en el panel administrador, y si se decide que ciertos campos sean editables (precio, horario), esos sí se conectan a `tenant_content` igual que cualquier otro tenant; el resto queda fijo en el código.

**Estado (2026-08-11):** implementado. La URL sigue siendo la misma `/{slug}` de cualquier tenant (no una ruta `/custom/` aparte) — `src/app/[slug]/page.tsx` revisa `tenant.plan`, y si es `custom_code` busca el componente en `src/custom/registro.ts` (`REGISTRO_CUSTOM`, un mapa `slug → componente`, mismo mecanismo que `CATALOGO_PLANTILLAS` para tenants tipo `template`). Hoy el registro está vacío — no existe ningún cliente custom_code todavía — así que un tenant así, aunque se publique, da 404 hasta que alguien complete el Flujo A de abajo y lo agregue al registro. Antes de este cambio daba 404 siempre, sin excepción posible.

*Excepción:* un deploy Vercel totalmente separado solo se justifica si el cliente pide explícitamente ser dueño del código/hosting — en ese caso deja de ser un tenant de SitioYa y pasa a ser un proyecto de desarrollo tradicional aparte.

**Flujo de construcción para código a medida:**
1. Antigravity (en el computador, ver sección 5) genera el diseño/código a partir de lo descrito para ese cliente — puede partir de un diseño en Stitch (herramienta de diseño de Google que se integra con Antigravity) o directo de una descripción en lenguaje natural
2. El código se integra como ruta propia dentro del proyecto Next.js existente
3. Se da de alta en el panel administrador como cualquier tenant, marcado `plan = custom_code`
4. Hereda subdominio, dominio propio si aplica, y aparece en el dashboard

### Sistema de plantillas (catálogo) — arquitectura "Landing Engine"

No se construyen tres sistemas independientes (uno por nivel). La estrategia es un **Landing Engine** de componentes reutilizables, al que cada nivel le agrega capas progresivas:

- **Componentes base** (todos los niveles): Navbar, Hero, Products, Services, Gallery, Testimonials, Location, WhatsApp, Footer.
- **Módulos de animación reutilizables** (Nivel 2/PRO en adelante): ScrollReveal, Parallax, ProductHover, TextAnimation, PageTransition. **Estado (2026-08-11):** `ScrollReveal` y `Parallax` ya están implementados (`src/templates/engine/`, GSAP + `@gsap/react`) y en uso en `plantilla_carniceria_pizarra`. `ProductHover`/`TextAnimation`/`PageTransition` siguen siendo futuro.
- **Módulos visuales avanzados** (Nivel 3/EXPERIENCE): ProductVisual, Particles, Lighting, y escenas 3D solo cuando un caso puntual lo justifique. **Estado (2026-08-11, tratamiento premium):** `ProductVisual` implementado (`src/templates/engine/`) con tratamiento visual trabajado, no solo una foto flotando: parallax de scroll (la sección se desplaza a velocidad distinta al resto del contenido), glow ambiental con el color de acento de cada tenant (nunca hardcodeado), flotación idle + pedestal sincronizados, marco con borde de acento y marcas de esquina tipo "objeto en exhibición", y al pasar el mouse — escala sutil + intensificación del glow + tilt. Genérico para cualquier rubro. El contenedor del producto (`stageRef`, dimensiones fijas) queda preparado a propósito para recibir un `<model-viewer>` (visor 3D real) más adelante sin rehacer el layout — por ahora es una foto, no un modelo 3D real. `Particles`/`Lighting` siguen siendo futuro. Nota: el negocio ideal para EXPERIENCE es donde el producto es protagonista (los ejemplos de la sección 3 son solo eso, ejemplos — cualquier negocio puede usar cualquier nivel, el sistema se adapta).

Cada cliente reutiliza esta misma arquitectura y se personaliza por contenido, imágenes, colores, tipografía y estilo — no por código nuevo. `tenants.plantilla_id` sigue identificando la plantilla base por tipo de negocio; `tenants.nivel` determina qué capas del engine se activan sobre esa plantilla.

**Estado (2026-08-12, reset del catálogo):** `CATALOGO_PLANTILLAS` (`src/lib/catalogo-plantillas.ts`) quedó vacío — decisión explícita de Paul: el resultado visual de las 4 plantillas construidas hasta ese punto no estaba funcionando, así que se borró todo el código (`src/templates/plantilla-*`, salvo `src/templates/engine/` que se mantiene por ser motor compartido, no plantilla) para repensar el enfoque de diseño desde cero, en vez de seguir iterando sobre lo ya construido. Impacto asumido a sabiendas: los 8 tenants publicados que dependían de estas plantillas (El Establo, Panadería Doña Carmela, Café Altura, Toquilla Andina, Fuego Callejero → `plantilla_carniceria_pizarra`; Barro Andino, DeluxTravel → `plantilla_vitrina_demo_21st`; Toy Land → `plantilla_jugueteria`) quedaron rotos (404) hasta que se construya una plantilla nueva o se les reasigne una — sus registros en Supabase (`tenants`/`tenant_content`) no se tocaron, solo el código de presentación. El tenant de demo `trazojoyas` (`plantilla_joyeria`, nunca llegó a publicarse) también quedó sin plantilla.

**Estado (2026-08-13, primeros dos tenants `custom_code`):** `REGISTRO_CUSTOM` (`src/custom/registro.ts`) ya no está vacío — la nota de la línea de arriba sobre "hoy el registro está vacío" quedó desactualizada. `trazojoyas` (`src/custom/trazojoyas/TrazoJoyas.tsx`, demo, nunca publicada, fotos de muestra Unsplash) fue el primero. `deluxtravel` (`src/custom/deluxtravel/DeluxTravel.tsx`) es el segundo y el primer caso de **revivificación**: tenant real publicado antes del reset (agencia de viajes en Cuenca, dependía de `plantilla_vitrina_demo_21st`), reconstruido como código a medida con su contenido real ya existente en `tenant_content` (no se tocó Supabase). Dirección visual pedida explícitamente para este caso: cada sección a pantalla completa (100dvh), fotografía de playa/mar predominante, animación propia por bloque (extiende `ScrollReveal`/`Parallax` del motor compartido con GSAP directo en `src/custom/deluxtravel/effects.tsx` — Ken Burns, paneo, wipe/clip-path, postal flotante, texto por palabras, contador — documentado ahí mismo). Combina las 7 fotos reales del negocio ya cargadas (`public/tenants/deluxtravel/`) con 5 fotos de paisaje de playa con licencia Unsplash (destino, no producto — la agencia no tiene fotos propias de sus destinos), atribuidas en el footer. De paso se agregó `"agencia_viajes"` (schema.org `TravelAgency`) al enum `Rubro` (`src/lib/types.ts`, `src/lib/json-ld.ts`), mismo criterio que `"joyeria"` — el tenant sigue con `rubro="servicios"` en Supabase hasta que se actualice desde el panel.

Registro histórico de lo que existió antes del reset (por si sirve de referencia al reconstruir, no como código vigente):

- `plantilla_carniceria_pizarra` — la original, basada en El Establo Cárnicos, con las 3 capas (START/PRO/EXPERIENCE) validadas en producción real con 5 tenants.
- `plantilla_jugueteria` (2026-08-12, caso Toy Land) — filas numeradas con foto real por producto, estilo Neo-Brutalism, paleta multicolor extraída del logo. Reconstruida una vez ese mismo día por el agente constructor de plantillas tras descartar un primer borrador hecho a mano.
- `plantilla_joyeria` (2026-08-12) — joyería accesible de uso diario, grid Swiss/minimalista sin reskinear las plantillas hermanas, sin tenant real de validación (usaba marcadores de posición).
- `plantilla_vitrina_demo_21st` — experimento comparativo con componentes de 21st MCP (sección 12).
- `plantilla_restaurante`, `plantilla_servicios_profesional`, `plantilla_tienda_retail` — nunca llegaron a construirse (quedaban como "futuras").

**Estrategia de producción con Antigravity:** construir primero las plantillas base de START, validar estructura y velocidad de producción; luego añadir la capa PRO (animaciones/interacciones); luego EXPERIENCE (profundidad visual, efectos de producto). Medir consumo de IA y tiempo de producción real antes de contratar planes pagos de herramientas adicionales.

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

| | Flujo A — Construcción/catálogo | Flujo B — Alta de cliente |
|---|---|---|
| **Dónde** | Antigravity o Claude Code, instalados en el computador, trabajando directo sobre archivos del proyecto | Panel administrador, en el navegador |
| **Cuándo** | Ocasional — al crear una plantilla nueva, agregar GSAP (Nivel 2), construir el visor 3D (Nivel 3), o hacer un proyecto de código a medida | Constante — cada vez que entra un cliente real |
| **Qué produce** | Código nuevo, se sube al repo y se despliega en Vercel | Un registro nuevo en Supabase (`tenants` + `tenant_content`) |
| **Requiere tocar código** | Sí | No |

**La conexión entre ambos:** el Flujo A construye la capacidad una sola vez (ej. el visor 3D dentro de una plantilla); el Flujo B la reutiliza infinitas veces sin código. El cliente #47 que compra Nivel 3 no necesita que se abra un editor — solo sube sus fotos por el panel, y el sistema ya sabe mostrarlas porque esa capacidad ya existe. La única excepción real es `custom_code`, donde cada cliente sí pasa por el Flujo A completo, por definición.

### Panel administrador (interno, Paul) — dos paneles distintos, no confundir

1. **Panel administrador** — solo Paul (y futuro equipo). Acceso total a todos los tenants.
2. **Panel de autoedición** — cada cliente, acceso solo a su propio tenant.

**Autenticación:** Supabase Auth con rol `admin` (tabla `admins` o claim en JWT). RLS separa: `admin` ve/edita todos los tenants, cliente normal solo el suyo.

**Qué hace el panel administrador:**

| Función | Detalle |
|---|---|
| Dashboard de clientes | Lista de tenants: nombre, plan, nivel, estado, tipo de dominio — con búsqueda y filtros |
| Crear cliente nuevo | Nombre, slug, WhatsApp, dirección, horario, plan, nivel (1/2/3), plantilla del catálogo. **Paso de confirmación obligatorio:** el formulario muestra en vivo la URL resultante (`elnombre.sitioya.com`) a partir del slug, valida que no esté repetido, y pide confirmar explícitamente que el nombre del negocio y el subdominio están bien escritos antes de guardar — cambiarlo después de publicado rompe enlaces ya compartidos y SEO |
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

---

## 8. Roadmap de construcción

1. **Esquema Supabase completo** — tablas `tenants` (con `nivel`, dominio, `estado_landing`, `seles_tenant_id`), `tenant_content`, `admins`, RLS.
2. **Primera plantilla del catálogo (Nivel 1)** — convertir El Establo en `plantilla_carniceria_pizarra`.
3. **Ruteo Fase 1 (path-based)** — funcional en `sitioya.vercel.app/negocio`.
4. **Panel administrador** — dashboard, crear cliente, carga inicial, vista previa, publicar.
5. **Panel de autoedición (cliente)**.
6. **Nivel 2 / PRO** — ✅ implementado para `plantilla_carniceria_pizarra` (2026-08-11): ScrollReveal + Parallax vía GSAP. Falta extender la capa de animación (ProductHover, TextAnimation, PageTransition) e integrarla a futuras plantillas del catálogo.
7. **Nivel 3 / EXPERIENCE** — ✅ `ProductVisual` implementado para `plantilla_carniceria_pizarra` (2026-08-11): flotación + sombra + glow + tilt por mouse con fotos reales, sin modelo 3D real ni `<model-viewer>`. Falta `Particles`/`Lighting` e integrarlo a futuras plantillas.
8. **(Futuro) Fase 2** — dominio propio de la plataforma + subdominios wildcard.
9. **(Futuro) Fase 3** — dominio propio por cliente.
10. **(Futuro, exploratorio) Integración Seles.**
11. **(Futuro) Plantillas adicionales** al catálogo.
12. **vitrina-demo:** experimento comparativo construido 100% con componentes de 21st MCP, pendiente de revisión para decidir qué adoptar en las plantillas de producción.

---

## 9. Próximos pasos inmediatos

- [ ] Confirmar nombre de marca
- [ ] Crear proyecto Next.js + proyecto Supabase nuevo
- [ ] Paso 1 del roadmap: esquema Supabase completo
- [ ] Paso 2: convertir El Establo en la primera plantilla parametrizada (Nivel 1)
- [ ] Definir 2-3 negocios reales candidatos para los primeros clientes de prueba
- [ ] Decidir qué negocio candidato sería el primer caso de Nivel 3 (idealmente algo con producto físico simple: sombrero, joya, pieza de cuero)

---

## 10. Referencia: demo de El Establo Cárnicos

- **Negocio:** El Establo Cárnicos, Av. Ordóñez Lasso, Cuenca — tel/WhatsApp +593 93 967 1012
- **Horario:** Lun-Vie 8am-8pm, Sáb 8am-9pm, Dom 8am-6pm
- **Diferenciador:** precio y variedad, cambia a diario · canal de pedidos: WhatsApp
- **Concepto visual:** "pizarra de precios" — paleta oxblood/carbón/latón, tipografía Oswald + Karla + Space Mono
- **Archivo:** `el-establo-carnicos-demo.html` — base de `plantilla_carniceria_pizarra` (Nivel 1)
