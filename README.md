# Vue Kit

[Ver demo en vivo](https://lingering-boat-6e61.floriban.workers.dev/dashboard)

Catálogo de componentes reutilizables con Vue 3, TypeScript, Vite y Tailwind CSS 4.
Incluye componentes visuales, formularios, datos, navegación, feedback, páginas HTTP e integraciones con Tiptap, Flatpickr, ECharts, SweetAlert2 y SortableJS.

## Plantilla y CLI

El catálogo también funciona como fuente de una plantilla instalable. El CLI está en
`packages/cli` y el registro generado puede consultarse en `registry/index.json`.

Durante el desarrollo local:

```sh
npm run registry:build
node packages/cli/src/index.js list
node packages/cli/src/index.js create mi-dashboard
```

Dentro de un proyecto Vue existente:

```sh
node /ruta/vue-kit/packages/cli/src/index.js init
node /ruta/vue-kit/packages/cli/src/index.js add input-group
```

El paquete está disponible en [npm](https://www.npmjs.com/package/@dediho/vue-kit). Puedes usarlo directamente:

```sh
npx @dediho/vue-kit create mi-dashboard
npx @dediho/vue-kit init
npx @dediho/vue-kit add input-group
npx @dediho/vue-kit add sweet-alert
npx @dediho/vue-kit add sortable
npx @dediho/vue-kit add flatpickr
npx @dediho/vue-kit list
```

`create` genera un dashboard mínimo y funcional. `init` prepara un proyecto Vue
existente sin reemplazar sus vistas. `add` resuelve dependencias entre componentes,
instala los paquetes externos necesarios y agrega únicamente sus archivos y estilos.

Antes de publicar una versión:

```sh
npm test --workspace packages/cli
npm run cli:pack
```

El proyecto y el paquete se distribuyen con [licencia MIT](LICENSE).

## Desarrollo

Node: `^22.18.0 || >=24.12.0`. El gestor declarado es `pnpm@12.5.1`;
las versiones de dependencias se guardan en `pnpm-lock.yaml`.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

Si las dependencias ya están instaladas y el lanzador local de pnpm falla,
puedes ejecutar `npm run dev` y `npm run build`. No hace falta reinstalar.
`build` comprueba TypeScript y genera `dist/`. `pnpm preview` sirve esa compilación.

## Estructura

- `src/components/ui/`: componentes reutilizables.
- `src/components/docs/`: header, bloques de código y documentación del catálogo.
- `src/docs/`: ejemplos de uso.
- `src/views/`: páginas de demostración.
- `src/layouts/`: estructura general y navegación lateral.
- `src/assets/main.css`: punto de entrada e importaciones de estilos.
- `src/assets/styles/theme.css`: colores, fuentes, radios y sombras.
- `src/assets/styles/base.css`: estilos globales del documento.
- `src/assets/styles/layout.css`: menú, header y distribución responsive.
- `src/assets/styles/components/`: CSS de botones, formularios, alertas, tarjetas, tablas, modales, notificaciones, dropdowns, tabs, accordions, badges, avatares, progreso, paginación, tooltips y popovers.
- `src/assets/styles/docs.css`: presentación de ejemplos y documentación.
- `src/assets/styles/accessibility.css`: utilidades accesibles y reducción de movimiento.

## Convenciones de estilos

1. Define colores y valores compartidos en `theme.css`. Reutiliza variables con `var(--color-primary)`.
2. Conserva CSS propio para variantes, estados y selectores de componentes.
3. Usa utilidades de Tailwind para composiciones sencillas. `@apply` es opcional.
4. Mantén las reglas responsive junto a los estilos que modifican.
5. No mezcles estilos exclusivos de ejemplos con los de los componentes UI.
6. `accessibility.css` se importa al final para que la reducción de movimiento prevalezca.

Los aliases del tema conservan nombres semánticos y apuntan a un valor compartido.
Las variables locales como `--button-color` seleccionan los colores de cada variante.

## Documentar un componente

Las páginas de componentes e integraciones incluyen documentación de uso:
- Ejemplos visuales y código desplegable que se puede copiar.
- Botones: demostración interactiva de carga, deshabilitado y clics.
- Formularios: campos, selección, validación, mensajes asociados y envío.
- Alertas: estados, variantes, título opcional, cierre y restauración.
- Tarjetas: iconos de Lucide, título, subtítulo, toolbar y encabezados personalizados.
- Tablas: composición dentro de AppCard, filas compactas/alternadas, hover y estado vacío.
- Modales: tamaños, posición, fondo estático, scroll, confirmación y control accesible del foco.
- Notificaciones: estados, acciones, duración, seis posiciones y administración de la pila.
- Dropdowns: alineación, posición automática, selección múltiple y menús de acciones.
- Tabs: variantes, iconos, badges, orientación vertical y navegación automática por teclado.
- Accordion: apertura única o múltiple, panel requerido, elementos deshabilitados y variantes.
- Badges: colores, variantes, tamaños, iconos, puntos y cierre.
- Avatares: imagen, iniciales, tamaños, formas, presencia y grupos.
- Progress: indicadores lineales, circulares, animados e indeterminados.
- Pagination: elipsis, páginas vecinas, extremos y estado deshabilitado.
- Tooltips: cuatro posiciones, espera, foco, Escape y ajuste automático.
- Popovers: paneles contextuales con acciones, formularios, foco y posicionamiento.
- Tabla de propiedades con tipos y valores predeterminados.
- Eventos nativos, atributos heredados, slots y notas de accesibilidad.

Usa `DocsCodeBlock` para el código; el contenido se muestra como texto, sin ejecutar HTML.
Los fragmentos cortos presuponen que el componente correspondiente está importado; los ejemplos completos incluyen el import.

## Estado de esta etapa

- CSS organizado y colores centralizados.
- AppButton, AppAlert, AppCard, AppTable, AppModal, Toast, Dropdown, Tabs, Accordion, Badge, Avatar, Progress, Pagination, Tooltip, Popover y los controles de formulario están documentados con ejemplos copiables, API y pruebas interactivas.
- Git iniciado con una versión anterior a la reorganización.
- Las páginas del catálogo incluyen documentación y demostraciones interactivas.
- Los controles de acciones del header son visuales, sin operaciones conectadas.

Próxima etapa: construir una pantalla funcional que combine los componentes.

No hay backend ni autenticación. Los datos actuales son ejemplos.

## Demo en Cloudflare

Ejecuta `npm run build` y sube **todo el contenido de `dist`**, incluido `_redirects`,
en **New deployment** del Worker existente `lingering-boat-6e61`.
Las reglas de `public/_redirects` sirven `index.html` para las rutas del catálogo
y permiten abrirlas directamente o recargarlas. Al agregar rutas nuevas, actualiza
este archivo; no uses una regla global que reescriba también JavaScript, CSS e imágenes.

Para desplegar con Wrangler, la configuración `wrangler.jsonc` activa el modo SPA
también para rutas desconocidas, que Vue mostrará como página no encontrada:

```sh
npm run build
npx wrangler deploy
```

El archivo `wrangler.jsonc` se utiliza al desplegar con Wrangler; subir solamente
el `dist` por el panel no aplica esa configuración.
