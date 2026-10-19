# Vue Kit

Crea un dashboard con Vue 3 y TypeScript, o agrega componentes a un proyecto Vue existente. El CLI copia los archivos a tu proyecto para que puedas adaptarlos.

[Ver demo](https://lingering-boat-6e61.floriban.workers.dev/dashboard) · [Repositorio en GitHub](https://github.com/floriban/vue-kit) · [Paquete en npm](https://www.npmjs.com/package/@dediho/vue-kit)

## Requisitos

- Node.js `^22.18.0 || >=24.12.0` para crear y ejecutar la plantilla.
- npm y npx disponibles en la terminal.
- Para integrar componentes en un proyecto existente: Vue 3 y una entrada `src/main.ts` o `src/main.js`.

El CLI por sí solo admite Node.js 20 o superior; la plantilla utiliza Vite y requiere las versiones indicadas arriba.

## Inicio rápido: crear un dashboard

Ejecuta en la carpeta donde quieres crear tu proyecto:

```sh
npx @dediho/vue-kit create mi-dashboard
cd mi-dashboard
npm run dev
```

Abre la dirección que muestre Vite en la terminal. El comando crea la carpeta e instala las dependencias con npm; no necesitas ejecutar `init` después.

Los nuevos dashboards incluyen Tailwind CSS 4 configurado desde el inicio, tanto en desarrollo como en la compilación de producción. Puedes usar sus utilidades, variantes responsive y colores del kit, por ejemplo `flex gap-4 p-6 md:grid-cols-3 bg-primary`.

La plantilla incluye navegación lateral plegable, modo claro y oscuro, una vista de dashboard y una página para rutas no encontradas. Es un punto de partida para tu aplicación; el demo muestra además el catálogo completo de componentes e integraciones. Los datos son de ejemplo y no incluye backend ni autenticación.

Para generar y revisar la compilación de producción, dentro del proyecto:

```sh
npm run build
npm run preview
```

## Agregar y usar componentes

Dentro de tu dashboard, instala los componentes que necesites:

```sh
npx @dediho/vue-kit add button
npx @dediho/vue-kit add table pagination
```

El CLI copia los componentes a `src/components/ui/`, agrega sus estilos e instala las dependencias necesarias. Los componentes se importan en la vista donde los vas a usar; no se registran globalmente.

Por ejemplo, después de agregar `button`, puedes usarlo en una vista:

```vue
<script setup lang="ts">
import AppButton from '../components/ui/AppButton.vue'

function guardar() {
  console.log('Guardar cambios')
}
</script>

<template>
  <AppButton @click="guardar">Guardar cambios</AppButton>
</template>
```

La ruta del import corresponde a una vista dentro de `src/views/`. Consulta el [demo](https://lingering-boat-6e61.floriban.workers.dev/dashboard) para ver ejemplos, propiedades y eventos.

### Presets e integraciones

Un preset instala un conjunto de componentes relacionados:

| Preset | Incluye |
| --- | --- |
| `forms` | Campos, controles de formulario y grupos de entradas y botones. |
| `data-table` | Tabla, paginación, estados y spinner. |
| `feedback` | Alertas, modales, notificaciones y estados. |
| `flatpickr` | Selectores de fecha y hora. |

```sh
npx @dediho/vue-kit add forms
npx @dediho/vue-kit add data-table
```

También puedes agregar integraciones individualmente:

| Comando | Integración |
| --- | --- |
| `npx @dediho/vue-kit add editor` | Editor de texto con Tiptap. |
| `npx @dediho/vue-kit add chart` | Gráficos con ECharts. |
| `npx @dediho/vue-kit add sweet-alert` | Diálogos con SweetAlert2. |
| `npx @dediho/vue-kit add sortable` | Listas ordenables con SortableJS. |
| `npx @dediho/vue-kit add flatpickr` | Fecha y hora con Flatpickr. |

Consulta los nombres disponibles con `npx @dediho/vue-kit list`.

## Usar en un proyecto Vue existente

Desde la raíz de tu proyecto, donde está `package.json`:

```sh
npx @dediho/vue-kit init
npx @dediho/vue-kit add button input-group
```

`init` crea `vue-kit.json`, copia los estilos base e importa `./assets/vue-kit.css` en la entrada. No agrega el dashboard ni reemplaza tus vistas o rutas. Los estilos base incluyen tipografía, colores y reglas globales; revisa cómo se combinan con los estilos de tu aplicación.

Para instalar dependencias, `init` y `add` usan pnpm si encuentran `pnpm-lock.yaml`, Yarn si encuentran `yarn.lock` y npm en los demás casos.

Los proyectos anteriores de `@dediho/app-ui` pueden usar `add`: el CLI reconoce `app-ui.json` y conserva su configuración y sus archivos de estilos.

## Personalización

Los archivos instalados pertenecen a tu proyecto y puedes editarlos directamente.

| Qué quieres cambiar | Archivo en el proyecto generado |
| --- | --- |
| Logo | `public/logo.png` |
| Nombre, subtítulo y enlaces del menú | `src/layouts/AppDashboardLayout.vue` |
| Header, tooltips y menú del usuario | `src/components/layout/AppDashboardHeader.vue` |
| Rutas y títulos de las páginas | `src/router/index.ts` |
| Contenido del dashboard | `src/views/DashboardView.vue` |
| Colores y variables de los modos claro y oscuro | `src/assets/vue-kit/theme.css` |
| Comportamiento del tema | `src/composables/useTheme.ts` |
| Componentes agregados | `src/components/ui/` |
| Estilos de los componentes agregados | `src/assets/styles/components/` |

`src/assets/vue-kit.css` es la entrada de estilos base y `src/assets/vue-kit-components.css` reúne los imports de los componentes instalados.

## Referencia de comandos

Ejecuta los comandos con `npx @dediho/vue-kit` seguido de:

| Comando | Qué hace |
| --- | --- |
| `create <nombre>` | Crea un dashboard en una carpeta nueva o vacía e instala sus dependencias. |
| `init` | Prepara un proyecto Vue existente. |
| `add <nombre...>` | Agrega uno o varios componentes o presets y sus dependencias. |
| `list` | Muestra los componentes y presets disponibles. |
| `--help` | Muestra la ayuda del CLI. |

| Opción | Qué hace |
| --- | --- |
| `--cwd <ruta>` | Usa otra carpeta como directorio de trabajo. En `create`, el proyecto se crea dentro de ella. |
| `--skip-install` | Copia los archivos sin ejecutar la instalación de dependencias. |
| `--overwrite` o `--force` | Permite reemplazar los archivos que copia `init` o `add`. |

Por defecto, `init` y `add` conservan los archivos existentes. Usa `--overwrite` solo si quieres sustituir tus versiones locales.

Si usas `create --skip-install`, ejecuta `npm install` dentro del proyecto antes de iniciarlo. Si usas `init` o `add` con esa opción, instala las dependencias pendientes que indique el CLI.

## Licencia

Distribuido bajo la [licencia MIT](https://github.com/floriban/vue-kit/blob/main/LICENSE).

<!-- npm-readme:end -->

## Desarrollo y contribuciones

Esta sección corresponde al repositorio del catálogo y del CLI. Para usar Vue Kit en tu aplicación, sigue la guía anterior.

### Ejecutar el catálogo localmente

El repositorio usa Node.js `^22.18.0 || >=24.12.0` y `pnpm@12.5.1`. Las versiones de dependencias se guardan en `pnpm-lock.yaml`.

```sh
git clone https://github.com/floriban/vue-kit.git
cd vue-kit
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm build` comprueba TypeScript y genera `dist/`. Usa `pnpm preview` para revisar esa compilación.

### Probar el CLI local

Desde la raíz del repositorio:

```sh
npm run registry:build
node packages/cli/src/index.js list
node packages/cli/src/index.js create mi-dashboard --skip-install
```

Para probarlo en un proyecto existente, usa `node packages/cli/src/index.js init --cwd /ruta/al/proyecto` y después `node packages/cli/src/index.js add button --cwd /ruta/al/proyecto`.

### Estructura del repositorio

| Ruta | Contenido |
| --- | --- |
| `src/components/ui/` | Componentes reutilizables. |
| `src/components/docs/` y `src/docs/` | Documentación y ejemplos copiables. |
| `src/views/` y `src/layouts/` | Páginas del demo y navegación. |
| `src/assets/styles/` | Tema, estilos del catálogo y de componentes. |
| `packages/cli/src/` | Implementación de los comandos. |
| `packages/cli/assets/core/` | Estilos base para proyectos existentes. |
| `packages/cli/assets/template/` | Plantilla del dashboard. |
| `packages/cli/scripts/build-assets.mjs` | Generación del registro, sincronización del logo y del README de npm. |
| `registry/index.json` | Registro generado de componentes y presets. |

Define valores compartidos en `theme.css`, mantén los estilos de cada componente separados de los ejemplos y conserva sus reglas responsive junto a ellos. La documentación de un componente debe incluir ejemplos copiables, propiedades, eventos, slots y notas de accesibilidad. Usa `DocsCodeBlock` para mostrar código como texto.

### Comprobar y empaquetar

```sh
npm run check
npm test --workspace packages/cli
npm run cli:pack
```

El empaquetado regenera los recursos del CLI. La guía de uso de este README es la fuente común: todo lo anterior al marcador HTML `npm-readme:end` se copia a `packages/cli/README.md` al ejecutar `npm run registry:build`, las pruebas del CLI o el empaquetado. Edita aquí la guía compartida y regenera los recursos.

Estos comandos no publican el paquete en npm.

### Despliegue del demo

Para desplegar con la configuración de `wrangler.jsonc`:

```sh
npm run build
npx wrangler deploy
```

Si usas el panel de Cloudflare, sube todo el contenido de `dist/`, incluido `_redirects`, al Worker del demo. Las reglas de `public/_redirects` permiten abrir y recargar las rutas del catálogo; actualízalas al agregar rutas nuevas. La configuración de `wrangler.jsonc` solo se aplica al desplegar con Wrangler.
