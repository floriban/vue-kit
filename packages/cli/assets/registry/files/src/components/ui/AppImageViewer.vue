<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from '@lucide/vue'
import AppModal from './AppModal.vue'

export interface ViewerImage { src: string; alt: string; title?: string; thumbnail?: string }
const props = withDefaults(defineProps<{ images: readonly ViewerImage[]; loop?: boolean }>(), { loop: false })
const open = defineModel<boolean>({ default: false })
const index = defineModel<number>('index', { default: 0 })
const activeIndex = computed(() => Math.max(0, Math.min(props.images.length - 1, Math.trunc(index.value) || 0)))
const image = computed(() => props.images[activeIndex.value])
const loading = ref(true)
const failed = ref(false)
const zoom = ref(1)
const offset = ref({ x: 0, y: 0 })
const dragging = ref(false)
const imageElement = ref<HTMLImageElement>()
const stage = ref<HTMLElement>()
const attempt = ref(0)
let gesture: { id: number; x: number; y: number; originX: number; originY: number } | undefined
const canPrevious = computed(() => props.images.length > 1 && (props.loop || activeIndex.value > 0))
const canNext = computed(() => props.images.length > 1 && (props.loop || activeIndex.value < props.images.length - 1))

function resetZoom() { zoom.value = 1; offset.value = { x: 0, y: 0 }; dragging.value = false; gesture = undefined }
function resetImage() { loading.value = true; failed.value = false; resetZoom() }
function move(direction: number) {
  if (direction < 0 ? !canPrevious.value : !canNext.value) return
  index.value = (activeIndex.value + direction + props.images.length) % props.images.length
}
function changeZoom(delta: number) {
  zoom.value = Math.max(1, Math.min(3, Number((zoom.value + delta).toFixed(1))))
  // Recenter when changing magnification so that the picture stays within reach.
  offset.value = { x: 0, y: 0 }
}
function pointerDown(event: PointerEvent) {
  if (!image.value || loading.value || failed.value || event.button !== 0 || !event.isPrimary) return
  gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, originX: offset.value.x, originY: offset.value.y }
  dragging.value = zoom.value > 1
  stage.value?.setPointerCapture(event.pointerId)
}
function pointerMove(event: PointerEvent) {
  if (!gesture || event.pointerId !== gesture.id || zoom.value === 1) return
  const rect = stage.value?.getBoundingClientRect()
  const width = imageElement.value?.clientWidth ?? 0
  const height = imageElement.value?.clientHeight ?? 0
  const maxX = Math.max(0, (width * zoom.value - (rect?.width ?? width)) / 2)
  const maxY = Math.max(0, (height * zoom.value - (rect?.height ?? height)) / 2)
  offset.value = {
    x: Math.max(-maxX, Math.min(maxX, gesture.originX + event.clientX - gesture.x)),
    y: Math.max(-maxY, Math.min(maxY, gesture.originY + event.clientY - gesture.y)),
  }
}
function pointerUp(event: PointerEvent) {
  if (!gesture || event.pointerId !== gesture.id) return
  const dx = event.clientX - gesture.x
  const dy = event.clientY - gesture.y
  if (zoom.value === 1 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx > 0 ? -1 : 1)
  gesture = undefined
  dragging.value = false
}
function cancelGesture() { gesture = undefined; dragging.value = false }
function keydown(event: KeyboardEvent) {
  if (!open.value || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
  if (event.target instanceof HTMLElement && (event.target.matches('input, textarea, select') || event.target.isContentEditable)) return
  if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
  else if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
  else if (!loading.value && !failed.value && image.value && (event.key === '+' || event.key === '=')) { event.preventDefault(); changeZoom(.5) }
  else if (!loading.value && !failed.value && image.value && event.key === '-') { event.preventDefault(); changeZoom(-.5) }
}
watch([activeIndex, () => image.value?.src], resetImage, { flush: 'sync' })
watch([index, () => props.images.length], () => {
  if (index.value !== activeIndex.value) index.value = activeIndex.value
}, { immediate: true })
watch(open, (value) => {
  if (typeof document === 'undefined') return
  document.removeEventListener('keydown', keydown)
  if (value) { resetImage(); document.addEventListener('keydown', keydown) }
}, { immediate: true })
onBeforeUnmount(() => { if (typeof document !== 'undefined') document.removeEventListener('keydown', keydown) })
</script>

<template>
  <AppModal v-model="open" :title="image?.title || 'Visor de imágenes'" size="xl" close-label="Cerrar visor de imágenes">
    <div class="app-image-viewer">
      <div class="app-image-viewer__toolbar">
        <span role="status" aria-live="polite">{{ images.length ? activeIndex + 1 : 0 }} de {{ images.length }}</span>
        <div class="app-image-viewer__actions">
          <button type="button" aria-label="Reducir zoom" :disabled="zoom <= 1 || loading || failed || !image" @click="changeZoom(-.5)"><ZoomOut :size="18" aria-hidden="true" /></button>
          <output aria-label="Nivel de zoom">{{ Math.round(zoom * 100) }}%</output>
          <button type="button" aria-label="Ampliar imagen" :disabled="zoom >= 3 || loading || failed || !image" @click="changeZoom(.5)"><ZoomIn :size="18" aria-hidden="true" /></button>
          <button type="button" aria-label="Restablecer zoom" :disabled="zoom === 1" @click="resetZoom"><RotateCcw :size="18" aria-hidden="true" /></button>
        </div>
      </div>
      <div ref="stage" class="app-image-viewer__stage" :class="{ 'is-zoomed': zoom > 1, 'is-dragging': dragging }"
        :aria-busy="loading && !!image" @pointerdown="pointerDown" @pointermove="pointerMove" @pointerup="pointerUp"
        @pointercancel="cancelGesture" @lostpointercapture="cancelGesture">
        <p v-if="!image" role="status">No hay imágenes para mostrar.</p>
        <div v-else-if="failed" class="app-image-viewer__message" role="alert">
          <p>No se pudo cargar la imagen.</p>
          <button type="button" @click="attempt++; resetImage()">Volver a intentar</button>
        </div>
        <template v-else>
          <p v-if="loading" class="app-image-viewer__loading" role="status">Cargando imagen…</p>
          <img :key="`${image.src}-${attempt}`" ref="imageElement" :src="image.src" :alt="image.alt" draggable="false"
            :class="{ 'is-loading': loading }" :style="{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }"
            @load="loading = false" @error="loading = false; failed = true" />
        </template>
      </div>
      <div class="app-image-viewer__navigation">
        <button type="button" aria-label="Imagen anterior" :disabled="!canPrevious" @click="move(-1)"><ChevronLeft :size="20" aria-hidden="true" /><span>Anterior</span></button>
        <p>{{ image?.alt }}</p>
        <button type="button" aria-label="Imagen siguiente" :disabled="!canNext" @click="move(1)"><span>Siguiente</span><ChevronRight :size="20" aria-hidden="true" /></button>
      </div>
      <div v-if="images.length > 1" class="app-image-viewer__thumbnails" aria-label="Imágenes de la galería">
        <button v-for="(item, position) in images" :key="position" type="button" :aria-label="`Ver imagen ${position + 1}: ${item.alt}`"
          :aria-current="position === activeIndex ? 'true' : undefined" @click="index = position">
          <img :src="item.thumbnail || item.src" alt="" loading="lazy" draggable="false" />
        </button>
      </div>
    </div>
  </AppModal>
</template>
