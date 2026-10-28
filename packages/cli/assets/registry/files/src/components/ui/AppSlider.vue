<script setup lang="ts">
import { computed, ref, useId, watchEffect } from 'vue'
import { rangeBounds, snapRange } from '../../composables/rangeValues'

const props = withDefaults(defineProps<{
  label: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  unit?: string
  minName?: string
  maxName?: string
}>(), { min: 0, max: 100, step: 1, unit: '' })
const model = defineModel<[number, number]>({ default: () => [0, 100] })
const id = `slider-${useId()}`
const lowerInput = ref<HTMLInputElement>()
const upperInput = ref<HTMLInputElement>()
const bounds = computed(() => rangeBounds(props.min, props.max, props.step))
const values = computed<[number, number]>(() => {
  const { min, max, step } = bounds.value
  const first = snapRange(model.value[0], min, max, step)
  const second = snapRange(model.value[1], min, max, step)
  return [Math.min(first, second), Math.max(first, second)]
})
const fill = computed(() => {
  const { min, max } = bounds.value
  const percent = (n: number) => max > min ? (n - min) / (max - min) * 100 : 0
  return { left: percent(values.value[0]) + '%', width: percent(values.value[1]) - percent(values.value[0]) + '%' }
})
watchEffect(() => {
  if (!Object.is(model.value[0], values.value[0]) || !Object.is(model.value[1], values.value[1])) model.value = values.value
})
function update(which: 0 | 1, value: number) {
  const { min, max, step } = bounds.value
  const next = snapRange(value, min, max, step)
  model.value = which === 0 ? [Math.min(next, values.value[1]), values.value[1]] : [values.value[0], Math.max(next, values.value[0])]
}
function input(which: 0 | 1, event: Event) {
  const target = event.target as HTMLInputElement
  update(which, Number(target.value))
  // Native inputs also move when clamped to an unchanged model value.
  target.value = String(values.value[which])
}
function selectTrack(event: PointerEvent) {
  if (props.disabled || bounds.value.min === bounds.value.max) return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const value = bounds.value.min + Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) * (bounds.value.max - bounds.value.min)
  const which = value < (values.value[0] + values.value[1]) / 2 ? 0 : 1
  update(which, value)
  ;(which === 0 ? lowerInput.value : upperInput.value)?.focus()
}
</script>

<template>
  <fieldset class="app-slider" :disabled="disabled || bounds.min === bounds.max">
    <legend>{{ label }}</legend>
    <output class="app-slider__value" :for="`${id}-min ${id}-max`">{{ values[0] }}{{ unit }} – {{ values[1] }}{{ unit }}</output>
    <div class="app-slider__track" @pointerdown.self="selectTrack">
      <div class="app-slider__fill" :style="fill" />
      <label class="sr-only" :for="`${id}-min`">{{ label }}: mínimo</label>
      <input :id="`${id}-min`" ref="lowerInput" class="app-slider__input app-slider__input--lower" type="range" :name="minName"
        :min="bounds.min" :max="bounds.max" :step="bounds.step" :value="values[0]"
        :aria-valuemax="values[1]" :aria-valuetext="`${values[0]}${unit}`" @input="input(0, $event)" />
      <label class="sr-only" :for="`${id}-max`">{{ label }}: máximo</label>
      <input :id="`${id}-max`" ref="upperInput" class="app-slider__input app-slider__input--upper" type="range" :name="maxName"
        :min="bounds.min" :max="bounds.max" :step="bounds.step" :value="values[1]"
        :aria-valuemin="values[0]" :aria-valuetext="`${values[1]}${unit}`" @input="input(1, $event)" />
    </div>
    <div class="app-range__limits" aria-hidden="true"><span>{{ bounds.min }}{{ unit }}</span><span>{{ bounds.max }}{{ unit }}</span></div>
  </fieldset>
</template>
