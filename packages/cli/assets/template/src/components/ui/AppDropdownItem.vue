<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Check } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    icon?: Component
    description?: string
    shortcut?: string
    disabled?: boolean
    danger?: boolean
    checked?: boolean
  }>(),
  {
    icon: undefined,
    description: undefined,
    shortcut: undefined,
    disabled: false,
    danger: false,
    checked: undefined,
  },
)

const emit = defineEmits<{
  select: []
}>()

const role = computed(() => (props.checked === undefined ? 'menuitem' : 'menuitemcheckbox'))
</script>

<template>
  <button
    type="button"
    class="app-dropdown-item"
    :class="{ 'app-dropdown-item--danger': danger, 'app-dropdown-item--checked': checked }"
    :role="role"
    :aria-checked="checked === undefined ? undefined : checked"
    :disabled="disabled"
    @click="emit('select')"
  >
    <span class="app-dropdown-item__icon" aria-hidden="true">
      <Check v-if="checked !== undefined" :class="{ 'is-hidden': !checked }" :size="17" />
      <component :is="icon" v-else-if="icon" :size="17" />
    </span>
    <span class="app-dropdown-item__content">
      <span class="app-dropdown-item__label"><slot /></span>
      <small v-if="description">{{ description }}</small>
    </span>
    <kbd v-if="shortcut" class="app-dropdown-item__shortcut">{{ shortcut }}</kbd>
  </button>
</template>
