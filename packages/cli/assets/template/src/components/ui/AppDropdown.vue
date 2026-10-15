<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import { ChevronDown } from '@lucide/vue'

type DropdownAlign = 'start' | 'end'
type DropdownSide = 'top' | 'bottom'
type FocusTarget = 'first' | 'last'

const props = withDefaults(
  defineProps<{
    label: string
    menuLabel?: string
    align?: DropdownAlign
    side?: DropdownSide
    offset?: number
    disabled?: boolean
    closeOnSelect?: boolean
    triggerVariant?: 'solid' | 'outline' | 'soft' | 'ghost'
    triggerColor?: 'primary' | 'neutral' | 'info' | 'success' | 'warning' | 'danger'
    triggerSize?: 'sm' | 'md' | 'lg'
    iconOnly?: boolean
  }>(),
  {
    menuLabel: undefined,
    align: 'start',
    side: 'bottom',
    offset: 8,
    disabled: false,
    closeOnSelect: true,
    triggerVariant: 'outline',
    triggerColor: 'neutral',
    triggerSize: 'md',
    iconOnly: false,
  },
)

const model = defineModel<boolean>({ default: false })
const emit = defineEmits<{
  open: []
  close: []
}>()

const triggerRef = ref<HTMLButtonElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const menuStyle = ref<Record<string, string>>({})
const positioned = ref(false)
const menuId = 'dropdown-menu-' + useId()
const triggerId = 'dropdown-trigger-' + useId()
let pendingFocus: FocusTarget = 'first'
let restoreFocus = true

const itemSelector = '[role="menuitem"]:not([disabled]), [role="menuitemcheckbox"]:not([disabled])'

function getItems() {
  if (!menuRef.value) return []

  return Array.from(menuRef.value.querySelectorAll<HTMLElement>(itemSelector)).filter(
    (element) => element.getClientRects().length > 0,
  )
}

function focusItem(target: FocusTarget) {
  const items = getItems()
  const item = target === 'first' ? items[0] : items.at(-1)
  item?.focus()
}

function updatePosition() {
  if (!triggerRef.value || !menuRef.value) return

  const trigger = triggerRef.value.getBoundingClientRect()
  const menu = menuRef.value.getBoundingClientRect()
  const viewportPadding = 8
  const spaceBelow = window.innerHeight - trigger.bottom
  const spaceAbove = trigger.top
  let resolvedSide = props.side

  if (props.side === 'bottom' && menu.height + props.offset > spaceBelow && spaceAbove > spaceBelow) {
    resolvedSide = 'top'
  } else if (props.side === 'top' && menu.height + props.offset > spaceAbove && spaceBelow > spaceAbove) {
    resolvedSide = 'bottom'
  }

  let top =
    resolvedSide === 'bottom'
      ? trigger.bottom + props.offset
      : trigger.top - menu.height - props.offset

  let left = props.align === 'start' ? trigger.left : trigger.right - menu.width

  top = Math.max(viewportPadding, Math.min(top, window.innerHeight - menu.height - viewportPadding))
  left = Math.max(viewportPadding, Math.min(left, window.innerWidth - menu.width - viewportPadding))

  menuStyle.value = {
    top: Math.round(top) + 'px',
    left: Math.round(left) + 'px',
    minWidth: Math.max(190, Math.round(trigger.width)) + 'px',
  }
  positioned.value = true
}

function openMenu(focus: FocusTarget = 'first') {
  if (props.disabled) return

  pendingFocus = focus
  restoreFocus = true

  if (model.value) {
    focusItem(focus)
  } else {
    model.value = true
  }
}

function closeMenu(shouldRestoreFocus = true) {
  restoreFocus = shouldRestoreFocus
  model.value = false
}

function toggleMenu() {
  if (model.value) closeMenu()
  else openMenu()
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (['ArrowDown', 'Enter', ' '].includes(event.key)) {
    event.preventDefault()
    openMenu('first')
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    openMenu('last')
  }
}

function handleMenuKeydown(event: KeyboardEvent) {
  const items = getItems()
  const currentIndex = items.indexOf(document.activeElement as HTMLElement)

  if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu()
    return
  }

  if (event.key === 'Tab') {
    closeMenu(false)
    return
  }

  if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    focusItem(event.key === 'Home' ? 'first' : 'last')
    return
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    const direction = event.key === 'ArrowDown' ? 1 : -1
    const nextIndex =
      currentIndex === -1
        ? direction === 1 ? 0 : items.length - 1
        : (currentIndex + direction + items.length) % items.length
    items[nextIndex]?.focus()
    return
  }

  if (event.key.length === 1 && /\S/.test(event.key)) {
    const query = event.key.toLocaleLowerCase()
    const match = items.find((item, index) => {
      return index > currentIndex && item.textContent?.trim().toLocaleLowerCase().startsWith(query)
    }) ?? items.find((item) => item.textContent?.trim().toLocaleLowerCase().startsWith(query))
    match?.focus()
  }
}

function handleMenuClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  const item = target.closest<HTMLElement>('[role="menuitem"], [role="menuitemcheckbox"]')

  if (item && !item.hasAttribute('disabled') && props.closeOnSelect) closeMenu()
}

function handleOutsidePointer(event: PointerEvent) {
  const target = event.target as Node

  if (triggerRef.value?.contains(target) || menuRef.value?.contains(target)) return
  closeMenu(false)
}

function addGlobalListeners() {
  document.addEventListener('pointerdown', handleOutsidePointer)
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
}

function removeGlobalListeners() {
  document.removeEventListener('pointerdown', handleOutsidePointer)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
}

watch(model, async (isOpen) => {
  if (isOpen) {
    positioned.value = false
    addGlobalListeners()
    await nextTick()
    updatePosition()
    await nextTick()
    focusItem(pendingFocus)
    emit('open')
  } else {
    removeGlobalListeners()
    if (restoreFocus) await nextTick(() => triggerRef.value?.focus())
    emit('close')
  }
})

onBeforeUnmount(removeGlobalListeners)
</script>

<template>
  <span class="app-dropdown">
    <button
      :id="triggerId"
      ref="triggerRef"
      type="button"
      class="app-button app-dropdown__trigger"
      :class="[
        'app-button--' + triggerVariant,
        'app-button--' + triggerColor,
        'app-button--' + triggerSize,
        { 'app-button--icon-only': iconOnly },
      ]"
      :disabled="disabled"
      aria-haspopup="menu"
      :aria-expanded="model"
      :aria-controls="model ? menuId : undefined"
      :aria-label="iconOnly ? label : undefined"
      @click="toggleMenu"
      @keydown="handleTriggerKeydown"
    >
      <slot name="trigger">{{ label }}</slot>
      <ChevronDown v-if="!iconOnly" class="app-dropdown__chevron" :size="16" aria-hidden="true" />
    </button>

    <Teleport to="body">
      <Transition name="app-dropdown-menu">
        <div
          v-if="model"
          :id="menuId"
          ref="menuRef"
          class="app-dropdown__menu"
          :class="{ 'app-dropdown__menu--positioned': positioned }"
          :style="menuStyle"
          role="menu"
          :aria-label="menuLabel"
          :aria-labelledby="menuLabel ? undefined : triggerId"
          @click="handleMenuClick"
          @keydown="handleMenuKeydown"
        >
          <slot />
        </div>
      </Transition>
    </Teleport>
  </span>
</template>
