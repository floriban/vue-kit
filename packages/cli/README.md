# Vue Kit CLI

Inicializa Vue Kit en un proyecto Vue existente:

```bash
npx @dediho/vue-kit init
```

Crea un dashboard nuevo:

```bash
npx @dediho/vue-kit create mi-dashboard
```

Instala componentes y presets bajo demanda:

```bash
npx @dediho/vue-kit add input-group
npx @dediho/vue-kit add table pagination
npx @dediho/vue-kit add forms
```

Agrega integraciones mediante wrappers de Vue Kit:

```bash
npx @dediho/vue-kit add sweet-alert
npx @dediho/vue-kit add sortable
npx @dediho/vue-kit add editor
npx @dediho/vue-kit add chart
npx @dediho/vue-kit add flatpickr
```

Usa `npx @dediho/vue-kit list` para consultar el registro. Antes de publicar el paquete ejecuta `npm run registry:build` desde la raíz.

## Proyectos anteriores

Vue Kit reemplaza a `@dediho/app-ui`. El comando `vue-kit add` también reconoce
`app-ui.json` y conserva los estilos de los proyectos creados con el paquete anterior.
Los proyectos nuevos usan `vue-kit.json` y archivos de estilos `vue-kit`.
