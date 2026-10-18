<script setup lang="ts">
import type { Component } from 'vue'
import { ExternalLink } from '@lucide/vue'
import DocsPageHeader from './DocsPageHeader.vue'

defineProps<{
  title: string
  website: string
  icons: { name: string; component: Component }[]
}>()
</script>

<template>
  <DocsPageHeader :eyebrow="`Iconos / ${title}`" :title="title"
    description="Una selección de iconos para navegación, acciones y contenido." />
  <a class="icon-library-link showcase-panel" :href="website" target="_blank" rel="noopener noreferrer">
    <div><strong>Explora el catálogo completo de {{ title }}</strong><span>{{ website }}</span></div>
    <ExternalLink :size="20" aria-hidden="true" />
    <span class="sr-only">(se abre en una pestaña nueva)</span>
  </a>
  <section class="component-section" aria-label="Selección de iconos">
    <div class="section-heading">
      <div><span>01</span>
        <h2>Selección de iconos</h2>
      </div>
      <p>{{ icons.length }} iconos de uso frecuente. Encuentra más en la web oficial.</p>
    </div>
    <ul class="icon-gallery">
      <li v-for="icon in icons" :key="icon.name" class="icon-gallery-item showcase-panel">
        <component :is="icon.component" :size="28" aria-hidden="true" />
        <code>{{ icon.name }}</code>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.icon-library-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: inherit;
  text-decoration: none;
  margin-top: 20px;
}

.icon-library-link strong,
.icon-library-link span {
  display: block;
}

.icon-library-link span {
  margin-top: .4rem;
  font-size: .875rem;
  opacity: .7;
}

.icon-library-link:hover {
  color: var(--color-primary, #6366f1);
}

.icon-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
  gap: 1rem;
  padding: 0;
  list-style: none;
}

.icon-gallery-item {
  display: flex;
  min-height: 120px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 0;
  padding: 1rem;
}

.icon-gallery-item code {
  font-size: .75rem;
  overflow-wrap: anywhere;
  text-align: center;
}
</style>
