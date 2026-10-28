<script setup lang="ts">
import { ref } from 'vue'
import AppImageViewer from '../components/ui/AppImageViewer.vue'
import AppButton from '../components/ui/AppButton.vue'
import AppSwitch from '../components/ui/AppSwitch.vue'
import DocsPageHeader from '../components/docs/DocsPageHeader.vue'
import DocsCodeBlock from '../components/docs/DocsCodeBlock.vue'
import DocsApiReference from '../components/docs/DocsApiReference.vue'

const open = ref(false)
const index = ref(0)
const loop = ref(true)
const errorOpen = ref(false)
const emptyOpen = ref(false)
const base = import.meta.env.BASE_URL
const images = [
  { src: `${base}demo/gallery/mountains.svg`, alt: 'Montañas nevadas junto a un lago azul', title: 'Lago entre montañas' },
  { src: `${base}demo/gallery/coast.svg`, alt: 'Acantilado y velero junto a una playa', title: 'Un día en la costa' },
  { src: `${base}demo/gallery/desert.svg`, alt: 'Dunas de arena al atardecer', title: 'Colores del desierto' },
]
// A deliberately invalid image demonstrates recovery without depending on a remote server.
const brokenImages = [{ src: 'data:image/png;base64,AAAA', alt: 'Ejemplo de imagen no disponible', title: 'Error de carga' }]
function view(position: number) { index.value = position; open.value = true }
const code = `<script setup lang="ts">
import { ref } from 'vue'
import AppImageViewer from '@/components/ui/AppImageViewer.vue'

const open = ref(false)
const index = ref(0)
const images = [
  { src: '/fotos/producto-1.jpg', alt: 'Producto de frente', title: 'Vista frontal' },
  { src: '/fotos/producto-2.jpg', alt: 'Producto de costado', title: 'Vista lateral' },
]
<\/script>

<template>
  <button type="button" @click="open = true">Ver imágenes</button>
  <AppImageViewer v-model="open" v-model:index="index" :images="images" loop />
</template>`
const properties = [
  ['v-model', 'boolean', 'false', 'Abre o cierra el visor.'],
  ['v-model:index', 'number', '0', 'Índice de la imagen seleccionada, comenzando en cero.'],
  ['images', 'ViewerImage[]', 'requerido', 'Cada imagen requiere src y alt. title y thumbnail son opcionales.'],
  ['loop', 'boolean', 'false', 'Permite pasar de la última imagen a la primera y viceversa.'],
] as const
</script>

<template>
  <DocsPageHeader eyebrow="Elementos visuales / Visor de imágenes" title="Visor de imágenes"
    description="Explora una galería con zoom, miniaturas y navegación mediante teclado o gestos." />
  <section class="component-section">
    <div class="section-heading"><div><span>01</span><h2>Galería interactiva</h2></div><p>Pulsa una imagen para abrir el visor.</p></div>
    <div class="viewer-demo-gallery">
      <button v-for="(image, position) in images" :key="image.src" type="button" class="showcase-panel viewer-demo-card" :aria-label="`Abrir ${image.title}`" @click="view(position)">
        <img :src="image.src" :alt="image.alt" width="1200" height="800" /><strong>{{ image.title }}</strong><span>Ver imagen ↗</span>
      </button>
    </div>
    <div class="showcase-panel viewer-demo-options"><AppSwitch v-model="loop" label="Navegación circular" /><p>Usa ← y → para navegar, + y − para el zoom y Esc para cerrar. Arrastra al ampliar; desliza en el móvil para cambiar de imagen.</p></div>
    <DocsCodeBlock :code="code" />
  </section>
  <section class="component-section">
    <div class="section-heading"><div><span>02</span><h2>Estados del visor</h2></div><p>Una imagen, colección vacía y recuperación ante errores.</p></div>
    <div class="showcase-panel viewer-demo-options"><AppButton variant="outline" @click="errorOpen = true">Probar error de carga</AppButton><AppButton variant="outline" @click="emptyOpen = true">Probar galería vacía</AppButton></div>
  </section>
  <DocsApiReference component-name="AppImageViewer" :rows="properties" note="Reutiliza AppModal: mantiene el foco dentro del diálogo, restaura el foco al cerrar y bloquea el scroll. Zoom de 100% a 300%." />
  <AppImageViewer v-model="open" v-model:index="index" :images="images" :loop="loop" />
  <AppImageViewer v-model="errorOpen" :images="brokenImages" />
  <AppImageViewer v-model="emptyOpen" :images="[]" />
</template>

<style scoped>
.viewer-demo-gallery { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.viewer-demo-card { display: flex; flex-direction: column; gap: 10px; padding: 12px; text-align: left; color: var(--color-dark); cursor: pointer; }
.viewer-demo-card img { width: 100%; height: auto; aspect-ratio: 3 / 2; object-fit: cover; border-radius: 6px; }
.viewer-demo-card span { font-size: .8rem; color: var(--color-primary); }
.viewer-demo-card:focus-visible { outline: 3px solid var(--color-focus-ring); }
.viewer-demo-options { display: flex; gap: 20px; flex-wrap: wrap; align-items: center; margin-top: 20px; }
.viewer-demo-options p { flex: 1 1 280px; margin: 0; font-size: .85rem; color: var(--color-muted); }
@media (max-width: 700px) { .viewer-demo-gallery { grid-template-columns: 1fr; } }
</style>
