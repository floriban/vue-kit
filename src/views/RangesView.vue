<script setup lang="ts">
import { computed, ref } from 'vue'
import AppRange from '../components/ui/AppRange.vue'
import AppSlider from '../components/ui/AppSlider.vue'
import AppSwitch from '../components/ui/AppSwitch.vue'
import AppButton from '../components/ui/AppButton.vue'
import AppCard from '../components/ui/AppCard.vue'
import AppField from '../components/ui/AppField.vue'
import DocsPageHeader from '../components/docs/DocsPageHeader.vue'
import DocsCodeBlock from '../components/docs/DocsCodeBlock.vue'
import DocsApiReference from '../components/docs/DocsApiReference.vue'
const volume = ref(65)
const brightness = ref(.7)
const price = ref<[number, number]>([200, 750])
const disabled = ref(false)
function reset() { volume.value = 65; brightness.value = .7; price.value = [200, 750]; disabled.value = false }
const demoMin = ref<number | string>(0)
const demoMax = ref<number | string>(100)
const demoStep = ref<number | string>(5)
const demoLabel = ref('Valor de prueba')
const demoUnit = ref('%')
const demoValue = ref(40)
const demoInterval = ref<[number, number]>([20, 80])
const demoDisabled = ref(false)
const demoShowValue = ref(true)
const demoError = computed(() => {
  if (![demoMin.value, demoMax.value, demoStep.value].every(value => typeof value === 'number' && Number.isFinite(value))) return 'Completa mínimo, máximo y paso con números válidos.'
  if (Number(demoMax.value) <= Number(demoMin.value)) return 'El máximo debe ser mayor que el mínimo.'
  if (Number(demoStep.value) <= 0) return 'El paso debe ser mayor que cero.'
  if (Number(demoStep.value) > Number(demoMax.value) - Number(demoMin.value)) return 'El paso no debe superar la diferencia entre máximo y mínimo.'
  return ''
})
function resetDemo() {
  demoMin.value = 0; demoMax.value = 100; demoStep.value = 5
  demoLabel.value = 'Valor de prueba'; demoUnit.value = '%'
  demoValue.value = 40; demoInterval.value = [20, 80]
  demoDisabled.value = false; demoShowValue.value = true
}
const demoCode = computed(() => `<script setup lang="ts">
import { ref } from 'vue'
import AppRange from '@/components/ui/AppRange.vue'
import AppSlider from '@/components/ui/AppSlider.vue'

const value = ref(${demoValue.value})
const interval = ref<[number, number]>([${demoInterval.value.join(', ')}])
const label = ${JSON.stringify(demoLabel.value || 'Valor de prueba')}
const unit = ${JSON.stringify(demoUnit.value)}
<\/script>

<template>
  <AppRange v-model="value" :label="label" :unit="unit"
    :min="${Number(demoMin.value)}" :max="${Number(demoMax.value)}" :step="${Number(demoStep.value)}"
    :show-value="${demoShowValue.value}" :disabled="${demoDisabled.value}" />
  <AppSlider v-model="interval" :label="label + ' (intervalo)'" :unit="unit"
    :min="${Number(demoMin.value)}" :max="${Number(demoMax.value)}" :step="${Number(demoStep.value)}"
    :disabled="${demoDisabled.value}" />
</template>`)
const code = `<script setup lang="ts">
import { ref } from 'vue'
import AppRange from '@/components/ui/AppRange.vue'
import AppSlider from '@/components/ui/AppSlider.vue'

const volume = ref(65)
const price = ref<[number, number]>([200, 750])
<\/script>

<template>
  <AppRange v-model="volume" label="Volumen" :min="0" :max="100" unit="%" />
  <AppSlider v-model="price" label="Precio" :min="0" :max="1000" :step="50" unit=" S/" />
</template>`
const rangeProperties = [
  ['v-model', 'number', '0', 'Valor numérico. Se ajusta a los límites y al paso.'],
  ['label', 'string', 'requerido', 'Etiqueta visible y nombre accesible del control.'],
  ['min / max', 'number', '0 / 100', 'Límites del control.'],
  ['step', 'number', '1', 'Incremento positivo; admite decimales.'],
  ['unit', 'string', "''", 'Sufijo mostrado junto al valor, por ejemplo %.'],
  ['disabled', 'boolean', 'false', 'Deshabilita la interacción.'],
  ['show-value', 'boolean', 'true', 'Muestra el valor actual.'],
  ['id / name', 'string', 'automático / —', 'Identificador y nombre del input para formularios.'],
] as const
const sliderProperties = [
  ['v-model', '[number, number]', '[0, 100]', 'Extremos del intervalo. No permite cruzar los controles.'],
  ['label', 'string', 'requerido', 'Etiqueta del grupo; cada extremo tiene nombre accesible.'],
  ['min / max / step', 'number', '0 / 100 / 1', 'Límites y paso numérico compartidos.'],
  ['unit', 'string', "''", 'Sufijo de los valores.'],
  ['disabled', 'boolean', 'false', 'Deshabilita los dos extremos.'],
  ['min-name / max-name', 'string', '—', 'Nombres de ambos valores para formularios.'],
] as const
</script>

<template>
  <DocsPageHeader eyebrow="Formularios / Rango y slider" title="Rango y slider" description="Elige un valor con el input de rango o un intervalo con el slider de dos extremos." />
  <section class="component-section">
    <div class="section-heading"><div><span>01</span><h2>Input de rango</h2></div><p>Controles nativos con teclado, pasos y valores decimales.</p></div>
    <div class="docs-form-component-grid">
      <AppCard title="Volumen"><AppRange v-model="volume" label="Nivel de audio" unit="%" :disabled="disabled" name="volume" /></AppCard>
      <AppCard title="Pasos decimales"><AppRange v-model="brightness" label="Brillo" :min="0" :max="1" :step=".1" :disabled="disabled" /></AppCard>
    </div>
  </section>
  <section class="component-section">
    <div class="section-heading"><div><span>02</span><h2>Slider de intervalo</h2></div><p>Dos controles sobre una pista para definir un mínimo y un máximo.</p></div>
    <AppCard title="Filtro de precios"><AppSlider v-model="price" label="Presupuesto" :max="1000" :step="50" unit=" S/" :disabled="disabled" min-name="minPrice" max-name="maxPrice" /><p class="ranges-demo-result" role="status">Mostrar productos entre S/ {{ price[0] }} y S/ {{ price[1] }}.</p></AppCard>
    <div class="showcase-panel ranges-demo-controls"><AppSwitch v-model="disabled" label="Deshabilitar controles" /><AppButton variant="outline" size="sm" @click="reset">Restablecer valores</AppButton><p>Tab selecciona cada extremo; las flechas ajustan el valor y Home / End recorren los límites.</p></div>
    <DocsCodeBlock :code="code" />
  </section>
  <section class="component-section">
    <div class="section-heading"><div><span>03</span><h2>Prueba interactiva</h2></div><p>Modifica las propiedades y prueba ambos componentes con la misma configuración.</p></div>
    <div class="showcase-panel ranges-playground">
      <div class="ranges-playground-fields">
        <AppField label="Mínimo" for-id="range-demo-min"><input id="range-demo-min" v-model.number="demoMin" type="number" step="any" class="app-control app-control--md" :aria-invalid="!!demoError" :aria-describedby="demoError ? 'range-demo-error' : undefined" /></AppField>
        <AppField label="Máximo" for-id="range-demo-max"><input id="range-demo-max" v-model.number="demoMax" type="number" step="any" class="app-control app-control--md" :aria-invalid="!!demoError" :aria-describedby="demoError ? 'range-demo-error' : undefined" /></AppField>
        <AppField label="Paso" for-id="range-demo-step"><input id="range-demo-step" v-model.number="demoStep" type="number" step="any" class="app-control app-control--md" :aria-invalid="!!demoError" :aria-describedby="demoError ? 'range-demo-error' : undefined" /></AppField>
        <AppField label="Etiqueta" for-id="range-demo-label"><input id="range-demo-label" v-model="demoLabel" class="app-control app-control--md" /></AppField>
        <AppField label="Unidad o sufijo" for-id="range-demo-unit"><input id="range-demo-unit" v-model="demoUnit" class="app-control app-control--md" placeholder="%, S/, kg…" /></AppField>
      </div>
      <div class="ranges-playground-options"><AppSwitch v-model="demoDisabled" label="Deshabilitar prueba" /><AppSwitch v-model="demoShowValue" label="Mostrar valor del rango" /><AppButton size="sm" variant="outline" @click="resetDemo">Restablecer prueba</AppButton></div>
      <p v-if="demoError" id="range-demo-error" class="ranges-playground-error" role="alert">{{ demoError }}</p>
      <template v-else>
        <div class="ranges-playground-previews">
          <AppCard title="Vista previa · Input de rango"><AppRange v-model="demoValue" :label="demoLabel || 'Valor de prueba'" :min="Number(demoMin)" :max="Number(demoMax)" :step="Number(demoStep)" :unit="demoUnit" :disabled="demoDisabled" :show-value="demoShowValue" /></AppCard>
          <AppCard title="Vista previa · Slider"><AppSlider v-model="demoInterval" :label="(demoLabel || 'Valor de prueba') + ' (intervalo)'" :min="Number(demoMin)" :max="Number(demoMax)" :step="Number(demoStep)" :unit="demoUnit" :disabled="demoDisabled" /></AppCard>
        </div>
        <div class="ranges-playground-fields">
          <AppField label="Valor del rango" for-id="range-demo-value"><input id="range-demo-value" v-model.number="demoValue" type="number" :min="Number(demoMin)" :max="Number(demoMax)" :step="Number(demoStep)" :disabled="demoDisabled" class="app-control app-control--md" /></AppField>
          <AppField label="Extremo mínimo" for-id="range-demo-lower"><input id="range-demo-lower" v-model.number="demoInterval[0]" type="number" :min="Number(demoMin)" :max="Number(demoMax)" :step="Number(demoStep)" :disabled="demoDisabled" class="app-control app-control--md" /></AppField>
          <AppField label="Extremo máximo" for-id="range-demo-upper"><input id="range-demo-upper" v-model.number="demoInterval[1]" type="number" :min="Number(demoMin)" :max="Number(demoMax)" :step="Number(demoStep)" :disabled="demoDisabled" class="app-control app-control--md" /></AppField>
        </div>
        <p class="docs-value-preview" role="status">Rango: <strong>{{ demoValue }}</strong> · Slider: <strong>[{{ demoInterval.join(', ') }}]</strong></p>
      </template>
    </div>
    <DocsCodeBlock v-if="!demoError" :code="demoCode" label="Ver código de la configuración actual" />
  </section>
  <DocsApiReference component-name="AppRange" :rows="rangeProperties" index="04" />
  <DocsApiReference component-name="AppSlider" :rows="sliderProperties" index="05" note="Los valores externos se ordenan, se limitan y se alinean al paso desde min. Si max no coincide con el paso, el último valor seleccionable es el paso anterior." />
</template>

<style scoped>
.ranges-demo-result { margin: 24px 0 0; color: var(--color-muted); font-size: .85rem; }
.ranges-demo-controls { display: flex; gap: 20px; align-items: center; flex-wrap: wrap; margin-top: 20px; }
.ranges-demo-controls p { flex: 1 1 250px; margin: 0; color: var(--color-muted); font-size: .8rem; }
.ranges-playground { display: grid; gap: 24px; }
.ranges-playground-fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; }
.ranges-playground-options { display: flex; flex-wrap: wrap; align-items: center; gap: 20px; }
.ranges-playground-previews { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.ranges-playground-error { margin: 0; color: var(--color-danger); }
@media (max-width: 700px) { .ranges-playground-previews { grid-template-columns: 1fr; } }
</style>
