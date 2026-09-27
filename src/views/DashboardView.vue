<script setup lang="ts">
import { ArrowRight, Boxes, FolderTree, Sparkles } from '@lucide/vue'
import DocsPageHeader from '../components/docs/DocsPageHeader.vue'
import AppCard from '../components/ui/AppCard.vue'
import { navigationGroups } from '../config/navigation'

const totalComponents = navigationGroups.reduce((total, group) => total + group.items.length, 0)
</script>

<template>
  <DocsPageHeader eyebrow="Vue Kit / Inicio" title="Dashboard" description="Explora la colección de componentes Vue, organizada por su función dentro de una interfaz." />

  <section class="dashboard-overview" aria-label="Resumen del catálogo">
    <article><span class="dashboard-overview__icon dashboard-overview__icon--primary"><Boxes :size="23" /></span><div><strong>{{ totalComponents }}</strong><small>componentes documentados</small></div></article>
    <article><span class="dashboard-overview__icon dashboard-overview__icon--info"><FolderTree :size="23" /></span><div><strong>{{ navigationGroups.length }}</strong><small>grupos funcionales</small></div></article>
    <article><span class="dashboard-overview__icon dashboard-overview__icon--success"><Sparkles :size="23" /></span><div><strong>Vue 3</strong><small>TypeScript y CSS reutilizable</small></div></article>
  </section>

  <section class="component-section">
    <div class="section-heading"><div><span>01</span><h2>Explorar componentes</h2></div><p>Cada grupo reúne patrones con una responsabilidad similar.</p></div>
    <div class="dashboard-group-grid">
      <AppCard v-for="group in navigationGroups" :key="group.id" :title="group.label" :subtitle="group.description" :icon="group.icon" icon-color="primary">
        <nav class="dashboard-component-list" :aria-label="group.label">
          <RouterLink v-for="item in group.items" :key="item.name" :to="{ name: item.name }">
            <i aria-hidden="true"></i><span>{{ item.label }}</span><ArrowRight :size="15" aria-hidden="true" />
          </RouterLink>
        </nav>
      </AppCard>
    </div>
  </section>
</template>
