<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  size?: 1 | 2 | 3 | 4 | 5
  count?: number
  max?: number
  dot?: boolean
  pulse?: boolean
  showZero?: boolean
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
}>(), { size: 1, count: 0, max: 99, dot: false, pulse: false, showZero: false, color: 'danger' })

const total = computed(() => Number.isFinite(props.count) ? Math.max(0, Math.floor(props.count)) : 0)
const limit = computed(() => Number.isFinite(props.max) ? Math.max(1, Math.floor(props.max)) : 99)
const visible = computed(() => total.value > 0 || props.showZero)
const label = computed(() => total.value > limit.value ? `${limit.value}+` : String(total.value))
</script>

<template>
  <span class="app-notification-badge" :class="['app-notification-badge--' + color, 'app-notification-badge--size-' + size]">
    <slot />
    <span v-if="visible" class="app-notification-badge__indicator" :class="{ 'is-dot': dot, 'is-pulsing': pulse && total > 0 }" aria-hidden="true">{{ dot ? '' : label }}</span>
  </span>
</template>
