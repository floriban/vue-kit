<script setup lang="ts">
import { ClipboardList, LogOut, Mail, Settings, Bell, FilePlus2, LayoutGrid, Moon, Search, Sun, Menu, PanelLeft, UserRound, X } from '@lucide/vue'

import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppNotificationBadge from '../ui/AppNotificationBadge.vue'
import AppDrawer from '../ui/AppDrawer.vue'
import AppTooltip from '../ui/AppTooltip.vue'
import AppDropdown from '../ui/AppDropdown.vue'
import AppDropdownItem from '../ui/AppDropdownItem.vue'
import AppDropdownSeparator from '../ui/AppDropdownSeparator.vue'
import { useTheme } from '../../composables/useTheme'

const logoUrl = `${import.meta.env.BASE_URL}logo.png`

const { theme, toggleTheme } = useTheme()

withDefaults(defineProps<{
  title: string
  mobileMenuOpen?: boolean
  navigationItems?: { name: string; label: string }[]
  indicatorsRoute?: string
}>(), { navigationItems: () => [{ name: 'dashboard', label: 'Dashboard' }] })
const emit = defineEmits<{ 'open-menu': [] }>()
const userMenuOpen = ref(false)
const sessionActive = ref(true)
const accountPanel = ref<'Mi perfil' | 'Tareas' | 'Correo' | 'Configuración' | null>(null)
function openAccountPanel(panel: NonNullable<typeof accountPanel.value>) {
  accountPanel.value = panel
}
function signOut() {
  sessionActive.value = false
  userMenuOpen.value = false
  accountPanel.value = null
  notificationsOpen.value = false
  mobilePanel.value = null
}
const notificationsOpen = ref(false)
const unreadCount = ref(3)
const notifications = ['Tu dashboard está listo para personalizar.', 'Explora los nuevos componentes del catálogo.', 'Prueba los contadores y el indicador pulse en Indicadores.']
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
<RouterLink v-for="item in navigationItems" :key="item.name" :to="{ name: item.name }" class="dashboard-topbar__link">{{ item.label }}</RouterLink>
      </nav>
      <div id="dashboard-user-tools" class="dashboard-topbar__tools">
        <AppTooltip class="dashboard-tool-tooltip" :text="theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'" :label="theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'" placement="bottom" trigger-variant="ghost" trigger-color="primary" icon-only @click="toggleTheme">
          <Sun v-if="theme === 'dark'" :size="21" aria-hidden="true" /><Moon v-else :size="21" aria-hidden="true" />
        </AppTooltip>
        <AppTooltip class="dashboard-tool-tooltip" text="Buscar" label="Buscar" placement="bottom" trigger-variant="ghost" trigger-color="primary" icon-only><Search :size="21" aria-hidden="true" /></AppTooltip>
        <AppNotificationBadge :count="unreadCount" dot pulse color="success">
          <AppTooltip class="dashboard-tool-tooltip" text="Ver notificaciones" :label="'Notificaciones: ' + unreadCount + ' sin leer'" placement="bottom" trigger-variant="ghost" trigger-color="primary" icon-only @click="notificationsOpen = true"><Bell :size="21" aria-hidden="true" /></AppTooltip>
        </AppNotificationBadge>
        <AppTooltip class="dashboard-tool-tooltip" text="Aplicaciones" label="Aplicaciones" placement="bottom" trigger-variant="ghost" trigger-color="primary" icon-only><LayoutGrid :size="21" aria-hidden="true" /></AppTooltip>
        <AppDropdown v-if="sessionActive" v-model="userMenuOpen" class="dashboard-user-menu" label="Menú de Usuario" menu-label="Mi cuenta" align="end" trigger-variant="ghost">
          <template #trigger><span class="dashboard-user"><span class="dashboard-user__greeting">Hola, <strong>Usuario</strong></span><span class="dashboard-user__avatar" aria-hidden="true">U</span></span></template>
          <AppDropdownItem :icon="UserRound" @select="openAccountPanel('Mi perfil')">Mi perfil</AppDropdownItem>
          <AppDropdownItem :icon="ClipboardList" @select="openAccountPanel('Tareas')">Tareas</AppDropdownItem>
          <AppDropdownItem :icon="Mail" @select="openAccountPanel('Correo')">Correo</AppDropdownItem>
          <AppDropdownItem :icon="Settings" @select="openAccountPanel('Configuración')">Configuración</AppDropdownItem>
          <AppDropdownSeparator />
          <AppDropdownItem :icon="LogOut" danger @select="signOut">Salir</AppDropdownItem>
        </AppDropdown>
        <button v-else type="button" class="dashboard-action" @click="sessionActive = true">Iniciar demo</button>
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
  <AppDrawer :model-value="accountPanel !== null" :title="accountPanel ?? 'Mi cuenta'" description="Cuenta de demostración de Vue Kit. Estos datos son ejemplos locales." @update:model-value="value => { if (!value) accountPanel = null }">
    <template v-if="accountPanel === 'Mi perfil'"><h3>Usuario</h3><p>Usuario de demostración</p><p>Personaliza este panel con los datos de tu cuenta.</p></template>
    <template v-else-if="accountPanel === 'Tareas'"><h3>Mis tareas</h3><ul><li>Personalizar el dashboard</li><li>Revisar los componentes disponibles</li><li>Conectar los datos de la aplicación</li></ul></template>
    <template v-else-if="accountPanel === 'Correo'"><h3>Bandeja de entrada</h3><p>No hay un servicio de correo conectado.</p><p>Conecta aquí la bandeja de mensajes de tu aplicación.</p></template>
    <template v-else-if="accountPanel === 'Configuración'"><h3>Apariencia</h3><button type="button" class="dashboard-action" @click="toggleTheme">{{ theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro' }}</button></template>
  </AppDrawer>
  <AppDrawer v-model="notificationsOpen" title="Notificaciones" description="Ejemplos del catálogo; sin conexión a un servicio de mensajes.">
    <p role="status">{{ unreadCount }} notificaciones sin leer</p>
    <ul><li v-for="notification in notifications" :key="notification">{{ notification }}</li></ul>
    <button type="button" class="dashboard-action" :disabled="unreadCount === 0" @click="unreadCount = 0">Marcar todas como leídas</button>
    <p v-if="indicatorsRoute"><RouterLink :to="{ name: indicatorsRoute }" @click="notificationsOpen = false">Ver indicadores y contadores</RouterLink></p>
  </AppDrawer>
</template>
