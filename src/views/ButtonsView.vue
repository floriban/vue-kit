<script setup lang="ts">
import { ref } from 'vue'
import AppCheckbox from '../components/ui/AppCheckbox.vue'
import DocsCodeBlock from '../components/docs/DocsCodeBlock.vue'
import DocsButtonReference from '../components/docs/DocsButtonReference.vue'
import { buttonExamples } from '../docs/buttonExamples'

const loading = ref(false)
const disabled = ref(false)
const clicks = ref(0)

import { ArrowRight, Download, Plus, Save, Search, Trash2 } from '@lucide/vue'
import DocsPageHeader from '../components/docs/DocsPageHeader.vue'
import AppButton from '../components/ui/AppButton.vue'
import AppButtonGroup from '../components/ui/AppButtonGroup.vue'

const colors = [
  { value: 'primary', label: 'Primary' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'info', label: 'Info' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'danger', label: 'Danger' },
] as const
</script>

<template>
  <DocsPageHeader eyebrow="Componentes / Botones" title="Botones"
    description="Acciones con jerarquías, colores semánticos, tamaños y estados consistentes." />

  <section class="component-section">
    <div class="section-heading">
      <div><span>01</span>
        <h2>Variantes</h2>
      </div>
      <p>Define la importancia visual de cada acción.</p>
    </div>
    <div class="showcase-panel">
      <div class="component-row">
        <AppButton>Solid</AppButton>
        <AppButton variant="outline">Outline</AppButton>
        <AppButton variant="soft">Soft</AppButton>
        <AppButton variant="ghost">Ghost</AppButton>
      </div>
    </div>
    <DocsCodeBlock :code="buttonExamples.variants" />
  </section>

  <section class="component-section">
    <div class="section-heading">
      <div><span>02</span>
        <h2>Colores semánticos</h2>
      </div>
      <p>El color comunica el propósito de la acción.</p>
    </div>
    <div class="showcase-panel color-groups">
      <div v-for="color in colors" :key="color.value" class="color-group">
        <span>{{ color.label }}</span>
        <div class="component-row">
          <AppButton :color="color.value">Solid</AppButton>
          <AppButton :color="color.value" variant="outline">Outline</AppButton>
          <AppButton :color="color.value" variant="soft">Soft</AppButton>
          <AppButton :color="color.value" variant="ghost">Ghost</AppButton>
        </div>
      </div>
    </div>
    <DocsCodeBlock :code="buttonExamples.colors" />
  </section>

  <section class="component-section">
    <div class="section-heading">
      <div><span>03</span>
        <h2>Tamaños y estados</h2>
      </div>
      <p>Opciones para distintos contextos de interfaz.</p>
    </div>
    <div class="showcase-panel">
      <div class="component-row">
        <AppButton size="sm">Pequeño</AppButton>
        <AppButton size="md">Mediano</AppButton>
        <AppButton size="lg">Grande</AppButton>
      </div>
      <div class="component-row">
        <AppButton loading>Guardando</AppButton>
        <AppButton disabled>Deshabilitado</AppButton>
        <AppButton color="danger" variant="outline">Eliminar registro</AppButton>
      </div>
    </div>
    <DocsCodeBlock :code="buttonExamples.states" />
  </section>

  <section class="component-section">
    <div class="section-heading">
      <div><span>04</span>
        <h2>Con iconos</h2>
      </div>
      <p>Lucide refuerza el significado de las acciones.</p>
    </div>
    <div class="showcase-panel">
      <div class="component-row">
        <AppButton>
          <Save :size="17" aria-hidden="true" /> Guardar
        </AppButton>
        <AppButton color="success">
          <Download :size="17" aria-hidden="true" /> Descargar
        </AppButton>
        <AppButton variant="outline">
          <Plus :size="17" aria-hidden="true" /> Nuevo registro
        </AppButton>
        <AppButton color="danger" variant="soft">
          <Trash2 :size="17" aria-hidden="true" /> Eliminar
        </AppButton>
        <AppButton variant="ghost"> Continuar
          <ArrowRight :size="17" aria-hidden="true" />
        </AppButton>
      </div>
      <div class="component-row">
        <AppButton icon-only aria-label="Buscar">
          <Search :size="18" aria-hidden="true" />
        </AppButton>
        <AppButton icon-only aria-label="Añadir" variant="outline">
          <Plus :size="18" aria-hidden="true" />
        </AppButton>
        <AppButton icon-only aria-label="Eliminar" color="danger" variant="soft">
          <Trash2 :size="18" aria-hidden="true" />
        </AppButton>
      </div>
    </div>
    <DocsCodeBlock :code="buttonExamples.icons" />
  </section>

  <section class="component-section">
    <div class="section-heading">
      <div><span>05</span>
        <h2>Block</h2>
      </div>
      <p>Ocupa todo el ancho disponible del contenedor.</p>
    </div>
    <div class="showcase-panel narrow-showcase">
      <AppButton block>
        <Save :size="17" aria-hidden="true" /> Guardar cambios
      </AppButton>
      <AppButton block variant="outline">Cancelar</AppButton>
    </div>
    <DocsCodeBlock :code="buttonExamples.block" />
  </section>

  <section class="component-section">
    <div class="section-heading">
      <div><span>06</span>
        <h2>Button group</h2>
      </div>
      <p>Agrupa acciones relacionadas en un solo control visual.</p>
    </div>
    <p class="docs-reference-note">Para este ejemplo instala el grupo: <code>npx @dediho/vue-kit@latest add button-group</code>. Este comando incluye también AppButton.</p>
    <div class="showcase-panel component-row">
      <AppButtonGroup label="Alineación del contenido">
        <AppButton color="neutral" variant="outline">Izquierda</AppButton>
        <AppButton color="neutral" variant="outline">Centro</AppButton>
        <AppButton color="neutral" variant="outline">Derecha</AppButton>
      </AppButtonGroup>
      <AppButtonGroup label="Acciones de búsqueda">
        <AppButton variant="outline">
          <Search :size="17" aria-hidden="true" /> Buscar
        </AppButton>
        <AppButton>
          <Plus :size="17" aria-hidden="true" /> Crear
        </AppButton>
      </AppButtonGroup>
    </div>
    <DocsCodeBlock :code="buttonExamples.groups" />
  </section>

  <section class="component-section">
    <div class="section-heading">
      <div><span>07</span><h2>Prueba interactiva</h2></div>
      <p>Comprueba cómo la carga y el bloqueo afectan a los clics.</p>
    </div>
    <div class="showcase-panel">
      <div class="component-row">
        <AppCheckbox v-model="loading" label="Estado de carga" />
        <AppCheckbox v-model="disabled" label="Deshabilitado" />
      </div>
      <div class="component-row">
        <AppButton :loading="loading" :disabled="disabled" @click="clicks++">
          {{ loading ? 'Guardando' : 'Probar clic' }}
        </AppButton>
        <p role="status">Clics registrados: {{ clicks }}</p>
      </div>
    </div>
    <DocsCodeBlock :code="buttonExamples.interactive" />
  </section>
  <DocsButtonReference />
</template>
