<script setup lang="ts">
import { computed, useId, watchEffect } from 'vue'
import { rangeBounds, snapRange } from '../../composables/rangeValues'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  id?: string
  label: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  name?: string
  showValue?: boolean
  unit?: string
}>(), { min: 0, max: 100, step: 1, showValue: true, unit: '' })
const model = defineModel<number>({ default: 0 })
const generatedId = useId()
const inputId = computed(() => props.id ?? `range-${generatedId}`)
const bounds = computed(() => rangeBounds(props.min, props.max, props.step))
const value = computed(() => snapRange(model.value, bounds.value.min, bounds.value.max, bounds.value.step))
const progress = computed(() => bounds.value.max > bounds.value.min ? (value.value - bounds.value.min) / (bounds.value.max - bounds.value.min) * 100 : 0)
watchEffect(() => { if (!Object.is(model.value, value.value)) model.value = value.value })
function update(event: Event) { model.value = Number((event.target as HTMLInputElement).value) }
</script>

<template>
  <div class="app-range" :class="{ 'app-range--disabled': disabled }">
    <div class="app-range__heading">
      <label :for="inputId">{{ label }}</label>
      <output v-if="showValue" :for="inputId">{{ value }}{{ unit }}</output>
    </div>
    <input v-bind="$attrs" :id="inputId" class="app-range__input" type="range" :name="name"
      :min="bounds.min" :max="bounds.max" :step="bounds.step" :value="value"
      :disabled="disabled || bounds.min === bounds.max" :aria-valuetext="`${value}${unit}`"
      :style="{ '--range-progress': progress + '%' }" @input="update" />
    <div class="app-range__limits" aria-hidden="true"><span>{{ bounds.min }}{{ unit }}</span><span>{{ bounds.max }}{{ unit }}</span></div>
  </div>
</template>
