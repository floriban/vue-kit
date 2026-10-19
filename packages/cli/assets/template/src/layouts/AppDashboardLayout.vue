<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { ChevronsLeft, LayoutDashboard, PackagePlus } from '@lucide/vue'
import { useRoute } from 'vue-router'
import AppDashboardHeader from '../components/layout/AppDashboardHeader.vue'
import AppDrawer from '../components/ui/AppDrawer.vue'

const logoUrl = `${import.meta.env.BASE_URL}logo.png`

const route = useRoute()
const mobileOpen = ref(false)
const collapsed = ref(true)
const isMobile = ref(false)
let mobileQuery: MediaQueryList | undefined
function syncViewport() {
  isMobile.value = mobileQuery?.matches ?? false
  if (!isMobile.value) mobileOpen.value = false
}
onMounted(() => {
  mobileQuery = window.matchMedia('(max-width: 991.98px)')
  syncViewport()
  mobileQuery.addEventListener('change', syncViewport)
})
onBeforeUnmount(() => mobileQuery?.removeEventListener('change', syncViewport))
const title = computed(() => String(route.meta.title ?? 'Dashboard'))
watch(() => route.fullPath, () => { mobileOpen.value = false })
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell--collapsed': collapsed }">
    <aside class="app-shell__sidebar">
      <div class="app-shell__sidebar-header">
        <RouterLink class="app-shell__brand" :to="{ name: 'dashboard' }" aria-label="Vue Kit, Dashboard"><span class="app-shell__mark"><img :src="logoUrl" alt="" width="38" height="38" /></span><span class="app-shell__brand-text"><strong>Vue Kit</strong><small>Componentes Vue</small></span></RouterLink>
        <button class="app-shell__toggle" type="button" :aria-label="collapsed ? 'Fijar menú expandido' : 'Plegar menú'" :title="collapsed ? 'Fijar menú expandido' : 'Plegar menú'" :aria-expanded="!collapsed" aria-controls="main-navigation" @click="collapsed = !collapsed"><ChevronsLeft :size="20" aria-hidden="true" /></button>
      </div>
      <nav id="main-navigation" aria-label="Navegación principal">
        <RouterLink :to="{ name: 'dashboard' }"><LayoutDashboard :size="19" /><span>Dashboard</span></RouterLink>
      </nav>
      <div class="app-shell__tip"><PackagePlus :size="18" /><p>Agrega componentes con <code>vue-kit add</code>.</p></div>
    </aside>
    <div class="app-shell__page">
      <AppDashboardHeader :title="title" :mobile-menu-open="mobileOpen" @open-menu="mobileOpen = true" />
      <main class="app-shell__content docs-content"><RouterView /></main>
    </div>
    <AppDrawer v-if="isMobile" v-model="mobileOpen" title="Vue Kit" description="Navegación principal"
      placement="left" size="sm" panel-class="mobile-navigation-drawer" id="mobile-navigation-panel">
      <nav class="app-mobile-navigation" aria-label="Navegación principal">
        <RouterLink :to="{ name: 'dashboard' }" @click="mobileOpen = false">
          <LayoutDashboard :size="19" aria-hidden="true" /><span>Dashboard</span>
        </RouterLink>
      </nav>
    </AppDrawer>
  </div>
</template>

<style scoped>
.app-shell { display: grid; grid-template-columns: 265px minmax(0, 1fr); transition: grid-template-columns 280ms ease; min-height: 100vh; }
.app-shell__sidebar { position: sticky; z-index: 20; top: 0; display: flex; flex-direction: column; width: 265px; overflow-x: hidden; height: 100vh; padding: 0 0 24px; transition: width 280ms ease, box-shadow 280ms ease; background: var(--color-sidebar); color: var(--color-sidebar-text); }
.app-shell__brand { display: flex; align-items: center; gap: 12px; min-height: 65px; padding: 0 48px 0 18px; color: white; text-decoration: none; }
.app-shell__mark { display: grid; place-items: center; width: 38px; height: 38px; border-radius: var(--radius-sm); flex-shrink: 0; }
.app-shell__brand img { display: block; width: 100%; height: 100%; object-fit: contain; transform: scale(1.65); }
.app-shell__brand strong { display: block; font-size: 1rem; font-weight: 700; }
.app-shell__sidebar nav { display: grid; gap: 4px; margin-top: 24px; padding: 0 15px; }
.app-shell__sidebar nav a { display: flex; align-items: center; gap: 14px; min-height: 44px; padding: 9px 12px; border-radius: 7px; color: var(--color-sidebar-text); font-size: .86rem; text-decoration: none; }
.app-shell__sidebar nav a:hover, .app-shell__sidebar nav a.router-link-active { color: white; background: var(--color-sidebar-active); }
.app-shell__tip { display: flex; gap: 10px; align-items: flex-start; margin: auto 15px 0; padding: 14px; border: 1px solid #34344a; border-radius: 8px; font-size: .7rem; line-height: 1.65; }
.app-shell__tip p { margin: 0; }.app-shell__tip code { color: white; }
.app-shell__page { min-width: 0; }
.app-shell__header { display: flex; align-items: center; gap: 14px; min-height: 82px; padding: 15px clamp(20px, 4vw, 46px); border-bottom: 1px solid var(--color-border); background: var(--color-surface); }
.app-shell__header small { color: var(--color-muted); font-size: .68rem; }.app-shell__header h1 { margin: 2px 0 0; color: var(--color-dark); font-size: 1.05rem; font-weight: 600; }
.app-shell__theme, .app-shell__menu, .app-shell__close { display: grid; place-items: center; width: 40px; height: 40px; border: 0; border-radius: 8px; background: var(--color-light); color: var(--color-gray-700); cursor: pointer; }
.app-shell__theme { margin-left: auto; }.app-shell__menu, .app-shell__close { display: none; }
.app-shell__backdrop { display: none; }
@media (min-width: 992px) {
  .app-shell--collapsed { grid-template-columns: 74px minmax(0, 1fr); }
  .app-shell--collapsed .app-shell__sidebar { width: 74px; }
  .app-shell--collapsed .app-shell__toggle svg { transform: rotate(180deg); }
  .app-shell--collapsed .app-shell__sidebar:is(:hover, :focus-within) { width: 265px; box-shadow: 12px 0 30px rgba(24, 28, 50, .15); }
  .app-shell--collapsed .app-shell__sidebar:not(:hover):not(:focus-within) :is(.app-shell__brand-text, nav a span, .app-shell__tip) { opacity: 0; pointer-events: none; }
  .app-shell--collapsed .app-shell__sidebar:not(:hover):not(:focus-within) .app-shell__mark { visibility: hidden; }
  .app-shell--collapsed .app-shell__sidebar:not(:hover):not(:focus-within) .app-shell__toggle { right: 21px; }
}
@media (max-width: 991.98px) {
  .app-shell__page { padding-top: 55px; }
  .app-shell { grid-template-columns: 1fr; }
  .app-shell__sidebar { display: none; }
  .app-shell__sidebar.is-open { transform: translateX(0); }
  .app-shell__menu, .app-shell__close { display: grid; }.app-shell__close { position: absolute; top: 20px; right: 16px; background: #29293d; color: white; }
  .app-shell__backdrop { position: fixed; z-index: 19; inset: 0; display: block; width: 100%; border: 0; background: rgba(15, 18, 30, .58); }
}
.app-shell__sidebar-header { position: relative; flex: 0 0 auto; min-height: 65px; background: var(--color-sidebar-header); }
.app-shell__brand-text, .app-shell__sidebar nav a span { white-space: nowrap; }
.app-shell__brand small { display: block; margin-top: 2px; color: var(--color-sidebar-text); font-size: .72rem; }
.app-shell__toggle { position: absolute; right: 10px; top: 17px; display: grid; place-items: center; width: 32px; height: 32px; padding: 0; border: 0; border-radius: var(--radius-sm); color: var(--color-sidebar-text); background: var(--color-sidebar-border); cursor: pointer; }
.app-shell__toggle:hover { color: var(--color-primary); }
.app-shell__toggle:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
.app-shell__toggle svg { transition: transform 280ms ease; }
.app-shell__sidebar nav a svg { flex-shrink: 0; color: var(--color-sidebar-icon); }
.app-shell__sidebar nav a.router-link-active svg { color: var(--color-primary); }
.app-shell__tip { flex-shrink: 0; width: 235px; }
@media (max-width: 991.98px) { .app-shell__toggle { display: none; } }
.app-mobile-navigation { display: grid; margin-top: 16px; padding: 0 15px; }
.app-mobile-navigation a { display: flex; align-items: center; gap: 14px; min-height: 46px; padding: 9px 12px; border-radius: 7px; color: var(--color-sidebar-text); font-size: .86rem; text-decoration: none; }
.app-mobile-navigation a.router-link-active { color: white; background: var(--color-sidebar-active); }
.app-mobile-navigation svg { flex-shrink: 0; color: var(--color-primary); }
</style>
