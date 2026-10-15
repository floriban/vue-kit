<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import { X } from '@lucide/vue'
import { lockModalScroll, unlockModalScroll } from '../../composables/modalScrollLock'
const props = withDefaults(defineProps<{ title: string; description?: string; panelClass?: string; id?: string; placement?: 'left' | 'right' | 'top' | 'bottom'; size?: 'sm' | 'md' | 'lg'; closeOnBackdrop?: boolean; closeOnEscape?: boolean }>(), { placement: 'right', size: 'md', closeOnBackdrop: true, closeOnEscape: true })
const model = defineModel<boolean>({ default: false })
const emit = defineEmits<{ close: [reason: 'button' | 'backdrop' | 'escape']; open: [] }>()
const dialog = ref<HTMLDialogElement>()
const titleId = useId()
const closing = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | undefined
let locked = false
let trigger: HTMLElement | null = null
function unlock() { if (locked) { unlockModalScroll(); locked = false } }
function close(reason: 'button' | 'backdrop' | 'escape') { model.value = false; emit('close', reason) }
function finishClose() {
  if (model.value || !closing.value) return
  clearTimeout(closeTimer)
  dialog.value?.close()
  closing.value = false
  unlock()
  if (trigger?.isConnected) trigger.focus()
}
function onAnimationEnd(event: AnimationEvent) {
  if (event.target === dialog.value && !event.pseudoElement && event.animationName === 'drawer-out') finishClose()
}
watch(model, async (open) => {
  await nextTick()
  if (open !== model.value || !dialog.value) return
  clearTimeout(closeTimer)
  if (open) {
    closing.value = false
    if (!dialog.value.open) {
      trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.value.showModal()
      if (!locked) { lockModalScroll(); locked = true }
      emit('open')
    }
  } else if (dialog.value.open) {
    closing.value = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finishClose()
    else closeTimer = setTimeout(finishClose, 360)
  }
}, { immediate: true, flush: 'post' })
function onClose() {
  // Ignore a queued native close event if the panel has already reopened.
  if (dialog.value?.open) return
  clearTimeout(closeTimer)
  closing.value = false
  model.value = false
  unlock()
}
onBeforeUnmount(() => {
  clearTimeout(closeTimer)
  const wasOpen = dialog.value?.open
  dialog.value?.close()
  unlock()
  if (wasOpen && trigger?.isConnected) trigger.focus()
})
</script>
<template>
  <Teleport to="body">
    <dialog ref="dialog" :id="id" class="app-drawer" :class="[panelClass, `app-drawer--${placement}`, `app-drawer--${size}`, { 'app-drawer--closing': closing }]" @animationend="onAnimationEnd" :aria-labelledby="titleId" :aria-describedby="description ? `${titleId}-description` : undefined" @cancel.prevent="props.closeOnEscape && close('escape')" @close="onClose" @click="event => { if (props.closeOnBackdrop && event.target === dialog) { const rect = dialog!.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close('backdrop') } }">
      <header class="app-drawer__header"><div><h2 :id="titleId">{{ title }}</h2><p v-if="description" :id="`${titleId}-description`">{{ description }}</p></div><button type="button" class="dashboard-icon-button" aria-label="Cerrar panel" autofocus @click="close('button')"><X :size="20" /></button></header>
      <div class="app-drawer__body"><slot /></div>
      <footer v-if="$slots.footer" class="app-drawer__footer"><slot name="footer" /></footer>
    </dialog>
  </Teleport>
</template>
