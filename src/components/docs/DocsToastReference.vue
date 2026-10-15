<script setup lang="ts">
import AppCard from '../ui/AppCard.vue'
import AppTable from '../ui/AppTable.vue'

const toastProperties = [
  ['toast', 'ToastItem', 'requerido', 'Datos de una notificación administrada por useToast.'],
]

const viewportProperties = [
  ['position', 'ToastPosition', "'top-right'", 'Ubicación de la pila en el viewport.'],
]

const methods = [
  ['show(options)', 'Crea una notificación con todas sus opciones.'],
  ['info(message, options?)', 'Crea una notificación informativa.'],
  ['success(message, options?)', 'Crea una confirmación.'],
  ['warning(message, options?)', 'Crea una advertencia.'],
  ['danger(message, options?)', 'Crea un error urgente.'],
  ['dismiss(id)', 'Cierra una notificación por su identificador.'],
  ['clear()', 'Cierra toda la pila.'],
]
</script>

<template>
  <section class="component-section">
    <div class="section-heading">
      <div><span>06</span><h2>Referencia de AppToast</h2></div>
      <p>Componentes, opciones y métodos para administrar notificaciones.</p>
    </div>

    <AppCard title="API del componente">
      <div class="docs-reference">
        <h3>AppToast</h3>
        <AppTable label="Propiedades de AppToast" compact>
          <thead><tr><th scope="col">Propiedad</th><th scope="col">Tipo</th><th scope="col">Por defecto</th><th scope="col">Descripción</th></tr></thead>
          <tbody><tr v-for="property in toastProperties" :key="property[0]">
            <td><code>{{ property[0] }}</code></td><td><code>{{ property[1] }}</code></td>
            <td><code>{{ property[2] }}</code></td><td>{{ property[3] }}</td>
          </tr></tbody>
        </AppTable>

        <h3>AppToastViewport</h3>
        <AppTable label="Propiedades de AppToastViewport" compact>
          <thead><tr><th scope="col">Propiedad</th><th scope="col">Tipo</th><th scope="col">Por defecto</th><th scope="col">Descripción</th></tr></thead>
          <tbody><tr v-for="property in viewportProperties" :key="property[0]">
            <td><code>{{ property[0] }}</code></td><td><code>{{ property[1] }}</code></td>
            <td><code>{{ property[2] }}</code></td><td>{{ property[3] }}</td>
          </tr></tbody>
        </AppTable>

        <h3>Opciones de una notificación</h3>
        <p><code>title</code>, <code>message</code>, <code>status</code>, <code>duration</code>, <code>closable</code> y <code>action</code>. Una duración de <code>0</code> mantiene la notificación visible.</p>

        <h3>Métodos de useToast</h3>
        <ul>
          <li v-for="method in methods" :key="method[0]"><code>{{ method[0] }}</code>: {{ method[1] }}</li>
        </ul>

        <h3>Accesibilidad</h3>
        <p>Los mensajes informativos usan una región de estado y los errores usan alerta. El temporizador se pausa con hover y foco para permitir leer o activar acciones. El botón de cierre incluye el contenido de la notificación en su nombre accesible.</p>
      </div>
    </AppCard>
  </section>
</template>
