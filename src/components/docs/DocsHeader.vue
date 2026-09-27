<script setup lang="ts">
import { Bell, FilePlus2, LayoutGrid, Moon, Search, Sun, Menu, PanelLeft, UserRound, X } from '@lucide/vue'

import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '../../composables/useTheme'

const logoUrl = `${import.meta.env.BASE_URL}logo.png`

const { theme, toggleTheme } = useTheme()

defineProps<{ title: string; mobileMenuOpen?: boolean }>()
const emit = defineEmits<{ 'open-menu': [] }>()
const mobilePanel = ref<'navigation' | 'tools' | null>(null)
const headerElement = ref<HTMLElement>()
const route = useRoute()
const navigationToggle = ref<HTMLButtonElement>()
const toolsToggle = ref<HTMLButtonElement>()
let viewport: MediaQueryList | undefined
function togglePanel(panel: 'navigation' | 'tools') { mobilePanel.value = mobilePanel.value === panel ? null : panel }
function closeOutside(event: PointerEvent) { if (!headerElement.value?.contains(event.target as Node)) mobilePanel.value = null }
function handleEscape(event: KeyboardEvent) {
 if (event.key !== 'Escape' || !mobilePanel.value) return
 const control = mobilePanel.value === 'navigation' ? navigationToggle.value : toolsToggle.value
 mobilePanel.value = null
 control?.focus()
}
function resetPanel() { mobilePanel.value = null }
watch(() => route.fullPath, resetPanel)
onMounted(() => {
 document.addEventListener('pointerdown', closeOutside)
 document.addEventListener('keydown', handleEscape)
 viewport = window.matchMedia('(max-width: 991.98px)')
 viewport.addEventListener('change', resetPanel)
})
onBeforeUnmount(() => {
 document.removeEventListener('pointerdown', closeOutside)
 document.removeEventListener('keydown', handleEscape)
 viewport?.removeEventListener('change', resetPanel)
})
</script>

<template>
  <header ref="headerElement" class="dashboard-header" :class="{ 'dashboard-header--navigation-open': mobilePanel === 'navigation', 'dashboard-header--tools-open': mobilePanel === 'tools' }">
    <div class="dashboard-mobile-bar">
      <RouterLink :to="{ name: 'dashboard' }" class="dashboard-mobile-brand" aria-label="Vue Kit, Dashboard"><span class="brand__mark"><img :src="logoUrl" alt="" width="38" height="38" /></span><strong>Vue Kit</strong></RouterLink>
      <div class="dashboard-mobile-controls">
        <button type="button" aria-label="Abrir menú principal" title="Menú principal" aria-controls="mobile-navigation-panel" :aria-expanded="Boolean(mobileMenuOpen)" @click="mobilePanel = null; emit('open-menu')"><PanelLeft :size="23" /></button>
        <button ref="navigationToggle" type="button" aria-label="Navegación superior" title="Navegación superior" aria-controls="dashboard-shortcuts" :aria-expanded="mobilePanel === 'navigation'" @click="togglePanel('navigation')"><X v-if="mobilePanel === 'navigation'" :size="23" /><Menu v-else :size="23" /></button>
        <button ref="toolsToggle" type="button" aria-label="Herramientas de usuario" title="Herramientas de usuario" aria-controls="dashboard-user-tools" :aria-expanded="mobilePanel === 'tools'" @click="togglePanel('tools')"><UserRound :size="23" /></button>
      </div>
    </div>
    <div class="dashboard-topbar">
      <nav id="dashboard-shortcuts" class="dashboard-topbar__nav" aria-label="Navegación superior">
        <RouterLink :to="{ name: 'dashboard' }" class="dashboard-topbar__link">Dashboard</RouterLink>
        <RouterLink :to="{ name: 'buttons' }" class="dashboard-topbar__link">Componentes</RouterLink>
        <RouterLink :to="{ name: 'forms' }" class="dashboard-topbar__link">Formularios</RouterLink>
        <RouterLink :to="{ name: 'tables' }" class="dashboard-topbar__link">Tablas</RouterLink>
      </nav>
      <div id="dashboard-user-tools" class="dashboard-topbar__tools">
        <button type="button" class="dashboard-icon-button" :aria-label="theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'" :title="theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'" @click="toggleTheme">
          <Sun v-if="theme === 'dark'" :size="21" aria-hidden="true" />
          <Moon v-else :size="21" aria-hidden="true" />
        </button>
        <button type="button" class="dashboard-icon-button" aria-label="Buscar" title="Buscar"><Search :size="21" aria-hidden="true" /></button>
        <button type="button" class="dashboard-icon-button" aria-label="Notificaciones" title="Notificaciones"><Bell :size="21" aria-hidden="true" /><span class="dashboard-notification-dot" aria-hidden="true"></span></button>
        <button type="button" class="dashboard-icon-button dashboard-topbar__apps" aria-label="Aplicaciones" title="Aplicaciones"><LayoutGrid :size="21" aria-hidden="true" /></button>
        <div class="dashboard-user"><span class="dashboard-user__greeting">Hola, <strong>Deddy</strong></span><span class="dashboard-user__avatar" aria-hidden="true">D</span></div>
      </div>
    </div>

    <div class="dashboard-subheader">
      <div class="dashboard-subheader__heading">
        <h2>{{ title }}</h2>
        <nav aria-label="Ruta de navegación">
          <ol class="dashboard-breadcrumb">
            <li v-if="title !== 'Dashboard'"><RouterLink :to="{ name: 'dashboard' }">Dashboard</RouterLink></li>
            <li aria-current="page">{{ title }}</li>
          </ol>
        </nav>
      </div>
      <div class="dashboard-subheader__actions">
        <button type="button" class="dashboard-action">Acciones</button>
        <button type="button" class="dashboard-icon-button dashboard-icon-button--success" aria-label="Nuevo registro" title="Nuevo registro"><FilePlus2 :size="23" aria-hidden="true" /></button>
      </div>
    </div>
  </header>
</template>
