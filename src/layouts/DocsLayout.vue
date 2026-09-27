<script setup lang="ts">
import { computed, onErrorCaptured, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronsLeft } from '@lucide/vue'
import DocsHeader from '../components/docs/DocsHeader.vue'
import DocsNavigation from '../components/docs/DocsNavigation.vue'
import AppDrawer from '../components/ui/AppDrawer.vue'
import AppState from '../components/ui/AppState.vue'
import { dashboardItem, findNavigationItem, navigationGroups } from '../config/navigation'

const logoUrl = `${import.meta.env.BASE_URL}logo.png`

const route = useRoute()
const renderError = ref(false)
onErrorCaptured(() => { renderError.value = true; return false })
const collapsed = ref(true)
const mobileOpen = ref(false)
const isMobile = ref(false)
let mobileQuery: MediaQueryList | undefined
function syncViewport() { isMobile.value = mobileQuery?.matches ?? false; if (!isMobile.value) mobileOpen.value = false }
onMounted(() => { mobileQuery = window.matchMedia('(max-width: 991.98px)'); syncViewport(); mobileQuery.addEventListener('change', syncViewport) })
onBeforeUnmount(() => mobileQuery?.removeEventListener('change', syncViewport))
const openGroup = ref('')
const currentTitle = computed(() => route.name === 'not-found' ? 'Página no encontrada' : route.name === 'route-error' ? 'Error de carga' : String(route.meta.title ?? findNavigationItem(route.name)?.label ?? 'Componentes'))
const activeGroup = computed(() => navigationGroups.find((group) => group.items.some((item) => item.name === (route.name === 'not-found' ? 'http-404' : route.name))))

watch(() => route.name, () => {
  renderError.value = false
  mobileOpen.value = false
  if (activeGroup.value) openGroup.value = activeGroup.value.id
}, { immediate: true })

function reloadPage() { window.location.reload() }
function handleMobileNavigation(event: MouseEvent) {
  if (event.target instanceof Element && event.target.closest('a')) mobileOpen.value = false
}
</script>

<template>
  <div class="docs-layout" :class="{ 'docs-layout--collapsed': collapsed }">
    <aside class="docs-sidebar">
      <div class="sidebar-header">
        <RouterLink class="brand" :to="{ name: dashboardItem.name }" aria-label="Vue Kit, Dashboard">
          <span class="brand__mark shrink-0 select-none"><img :src="logoUrl" alt="" width="38" height="38" /></span>
          <span class="brand__text"><strong>Vue Kit</strong><small>Componentes Vue</small></span>
        </RouterLink>
        <button class="sidebar-toggle" type="button" :aria-label="collapsed ? 'Fijar menú expandido' : 'Plegar menú'"
          :aria-expanded="!collapsed" aria-controls="main-navigation"
          :title="collapsed ? 'Fijar menú expandido' : 'Plegar menú'" @click="collapsed = !collapsed">
          <ChevronsLeft :size="20" aria-hidden="true" />
        </button>
      </div>

      <DocsNavigation id="main-navigation" v-model="openGroup" :active-group="activeGroup?.id" />

      <div class="sidebar-note">
        <span>v0.1</span>
        <p>Base visual para proyectos propios con Vue y TypeScript.</p>
      </div>
    </aside>
    <main class="docs-main min-w-0">
      <DocsHeader :title="currentTitle" :mobile-menu-open="mobileOpen" @open-menu="mobileOpen = true" />
      <div class="docs-content">
        <AppState v-if="renderError" state="error" title="No pudimos mostrar este componente"
          description="Recarga la página para volver a intentarlo." action-label="Recargar" @action="reloadPage" />
        <RouterView v-else v-slot="{ Component }">
          <Suspense timeout="0">
            <component :is="Component" />
            <template #fallback>
              <AppState state="loading" compact title="Cargando componente" />
            </template>
          </Suspense>
        </RouterView>
      </div>
    </main>
    <AppDrawer v-if="isMobile" v-model="mobileOpen" title="Vue Kit" description="Catálogo de componentes"
      placement="left" size="sm" panel-class="mobile-navigation-drawer" id="mobile-navigation-panel">
      <DocsNavigation id="mobile-navigation" v-model="openGroup" :active-group="activeGroup?.id"
        @click="handleMobileNavigation" />
    </AppDrawer>
  </div>
</template>
