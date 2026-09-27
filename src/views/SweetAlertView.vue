<script setup lang="ts">
import { ref } from 'vue'
import { CircleCheck, CircleHelp, MessageSquareText } from '@lucide/vue'
import DocsApiReference from '../components/docs/DocsApiReference.vue'
import DocsCodeBlock from '../components/docs/DocsCodeBlock.vue'
import DocsPageHeader from '../components/docs/DocsPageHeader.vue'
import AppButton from '../components/ui/AppButton.vue'
import AppCard from '../components/ui/AppCard.vue'
import AppSweetAlert from '../components/ui/AppSweetAlert.vue'
import { useSweetAlert } from '../composables/useSweetAlert'

const successOpen = ref(false)
const confirmationOpen = ref(false)
const promptOpen = ref(false)
const recordDeleted = ref(false)
const projectName = ref('')
const sweetAlert = useSweetAlert()

function handleProjectName(value: unknown) {
  projectName.value = typeof value === 'string' ? value : ''
}

function showToast() {
  return sweetAlert.toast({
    icon: 'success',
    title: 'Notificación enviada',
  })
}

const componentCode = `<script setup lang="ts">
import { ref } from 'vue'
import AppSweetAlert from '@/components/ui/AppSweetAlert.vue'

const open = ref(false)
function removeRecord() {
  // Elimina el registro confirmado
}
<\/script>

<template>
  <button @click="open = true">Eliminar</button>
  <AppSweetAlert
    v-model="open"
    mode="confirm"
    variant="warning"
    title="¿Eliminar registro?"
    description="Esta acción no se puede deshacer."
    confirm-label="Sí, eliminar"
    danger
    @confirm="removeRecord"
  />
</template>`

const composableCode = `import { useSweetAlert } from '@/composables/useSweetAlert'

const sweetAlert = useSweetAlert()

const accepted = await sweetAlert.confirm({
  title: '¿Publicar cambios?',
  description: 'La nueva versión quedará disponible para el equipo.',
  confirmLabel: 'Publicar',
})

if (accepted) {
  await publish()
}`

const properties = [
  ['v-model', 'boolean', 'false', 'Abre o cierra la alerta controlada.'],
  ['mode', 'alert | confirm | prompt | toast', 'alert', 'Define el comportamiento principal.'],
  ['variant', 'SweetAlertIcon', 'info', 'Selecciona el icono semántico.'],
  ['title', 'string', 'requerido', 'Título principal de la alerta.'],
  ['description', 'string', 'undefined', 'Explica la situación o la acción solicitada.'],
  ['options', 'SweetAlertOptions', 'undefined', 'Permite extender la configuración original de SweetAlert2.'],
] as const
</script>

<template>
  <DocsPageHeader
    eyebrow="Integraciones / SweetAlert2"
    title="Alertas · SweetAlert2"
    description="Utiliza SweetAlert2 mediante un componente declarativo o un composable con el estilo de Vue Kit."
  />

  <section class="component-section">
    <div class="section-heading">
      <div><span>01</span><h2>AppSweetAlert</h2></div>
      <p>Controla alertas, confirmaciones y entradas con v-model.</p>
    </div>

    <div class="card-grid">
      <AppCard title="Resultado" subtitle="Confirma que una operación terminó" :icon="CircleCheck" icon-color="success">
        <AppButton color="success" @click="successOpen = true">Mostrar éxito</AppButton>
      </AppCard>

      <AppCard title="Confirmación" subtitle="Solicita una decisión irreversible" :icon="CircleHelp" icon-color="warning">
        <AppButton color="danger" variant="outline" @click="confirmationOpen = true">Confirmar eliminación</AppButton>
        <p v-if="recordDeleted" class="docs-integration-result" role="status">El registro fue eliminado.</p>
      </AppCard>

      <AppCard title="Entrada de texto" subtitle="Recoge un valor dentro del modal" :icon="MessageSquareText" icon-color="info">
        <AppButton color="info" variant="soft" @click="promptOpen = true">Solicitar nombre</AppButton>
        <p v-if="projectName" class="docs-integration-result" role="status">Proyecto: {{ projectName }}</p>
      </AppCard>

      <AppCard title="Toast" subtitle="Mensaje temporal mediante el composable">
        <AppButton variant="outline" @click="showToast">Mostrar toast</AppButton>
      </AppCard>
    </div>

    <AppSweetAlert
      v-model="successOpen"
      variant="success"
      title="Cambios guardados"
      description="La configuración se actualizó correctamente."
    />
    <AppSweetAlert
      v-model="confirmationOpen"
      mode="confirm"
      variant="warning"
      title="¿Eliminar registro?"
      description="Esta acción quitará el elemento de la lista."
      confirm-label="Sí, eliminar"
      danger
      @confirm="recordDeleted = true"
    />
    <AppSweetAlert
      v-model="promptOpen"
      mode="prompt"
      title="Nombre del proyecto"
      input-placeholder="Escribe un nombre"
      confirm-label="Guardar"
      @confirm="handleProjectName"
    />

    <DocsCodeBlock :code="componentCode" label="Ver uso como componente" />
  </section>

  <section class="component-section">
    <div class="section-heading">
      <div><span>02</span><h2>useSweetAlert</h2></div>
      <p>Ejecuta mensajes desde acciones, servicios y procesos asíncronos.</p>
    </div>
    <div class="showcase-panel">
      <p class="docs-integration-copy">El composable ofrece <code>message</code>, <code>confirm</code>, <code>toast</code> y <code>fire</code> para acceder a opciones avanzadas.</p>
    </div>
    <DocsCodeBlock :code="composableCode" label="Ver uso como composable" />
  </section>

  <DocsApiReference component-name="AppSweetAlert" :rows="properties" note="Emite open, confirm, cancel y close. El evento confirm recibe el valor ingresado cuando mode es prompt." />
</template>
