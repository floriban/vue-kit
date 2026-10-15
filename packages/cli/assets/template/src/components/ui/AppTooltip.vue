<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId } from 'vue'

type Placement = 'top' | 'bottom' | 'left' | 'right'

const props = withDefaults(
  defineProps<{
    text: string
    label: string
    placement?: Placement
    delay?: number
    offset?: number
    disabled?: boolean
    triggerVariant?: 'solid' | 'outline' | 'soft' | 'ghost'
    triggerColor?: 'primary' | 'neutral' | 'info' | 'success' | 'warning' | 'danger'
    triggerSize?: 'sm' | 'md' | 'lg'
    iconOnly?: boolean
  }>(),
  {
    placement: 'top',
    delay: 250,
    offset: 9,
    disabled: false,
    triggerVariant: 'outline',
    triggerColor: 'neutral',
    triggerSize: 'md',
    iconOnly: false,
  },
)

const visible = ref(false)
const positioned = ref(false)
const resolvedPlacement = ref<Placement>(props.placement)
const triggerRef = ref<HTMLButtonElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const style = ref<Record<string, string>>({})
const tooltipId = 'tooltip-' + useId()
let showTimer: ReturnType<typeof setTimeout> | undefined

function calculatePosition() {
  if (!triggerRef.value || !tooltipRef.value) return

  const trigger = triggerRef.value.getBoundingClientRect()
  const tooltip = tooltipRef.value.getBoundingClientRect()
  const padding = 8
  const spaces = {
    top: trigger.top,
    bottom: window.innerHeight - trigger.bottom,
    left: trigger.left,
    right: window.innerWidth - trigger.right,
  }
  const required = props.placement === 'top' || props.placement === 'bottom' ? tooltip.height : tooltip.width
  let placement = props.placement

  if (spaces[placement] < required + props.offset) {
    const opposite: Record<Placement, Placement> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }
    if (spaces[opposite[placement]] > spaces[placement]) placement = opposite[placement]
  }

  let top = trigger.top + trigger.height / 2 - tooltip.height / 2
  let left = trigger.left + trigger.width / 2 - tooltip.width / 2

  if (placement === 'top') top = trigger.top - tooltip.height - props.offset
  if (placement === 'bottom') top = trigger.bottom + props.offset
  if (placement === 'left') left = trigger.left - tooltip.width - props.offset
  if (placement === 'right') left = trigger.right + props.offset

  top = Math.max(padding, Math.min(top, window.innerHeight - tooltip.height - padding))
  left = Math.max(padding, Math.min(left, window.innerWidth - tooltip.width - padding))

  resolvedPlacement.value = placement
  style.value = { top: Math.round(top) + 'px', left: Math.round(left) + 'px' }
  positioned.value = true
}

async function show(immediate = false) {
  if (props.disabled) return
  clearTimeout(showTimer)

  const activate = async () => {
    visible.value = true
    positioned.value = false
    await nextTick()
    calculatePosition()
    window.addEventListener('resize', calculatePosition)
    window.addEventListener('scroll', calculatePosition, true)
  }

  if (immediate || props.delay <= 0) await activate()
  else showTimer = setTimeout(activate, props.delay)
}

function hide() {
  clearTimeout(showTimer)
  visible.value = false
  window.removeEventListener('resize', calculatePosition)
  window.removeEventListener('scroll', calculatePosition, true)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') hide()
}

onBeforeUnmount(hide)
</script>

<template>
  <span class="app-tooltip">
    <button
      ref="triggerRef"
      type="button"
      class="app-button app-tooltip__trigger"
      :class="[
        'app-button--' + triggerVariant,
        'app-button--' + triggerColor,
        'app-button--' + triggerSize,
        { 'app-button--icon-only': iconOnly },
      ]"
      :disabled="disabled"
      :aria-label="iconOnly ? label : undefined"
      :aria-describedby="visible ? tooltipId : undefined"
      @mouseenter="show(false)"
      @mouseleave="hide"
      @focus="show(true)"
      @blur="hide"
      @keydown="handleKeydown"
    >
      <slot>{{ label }}</slot>
    </button>

    <Teleport to="body">
      <Transition name="app-tooltip-fade">
        <span
          v-if="visible"
          :id="tooltipId"
          ref="tooltipRef"
          class="app-tooltip__bubble"
          :class="['app-tooltip__bubble--' + resolvedPlacement, { 'app-tooltip__bubble--positioned': positioned }]"
          :style="style"
          role="tooltip"
        >
          {{ text }}
        </span>
      </Transition>
    </Teleport>
  </span>
</template>
