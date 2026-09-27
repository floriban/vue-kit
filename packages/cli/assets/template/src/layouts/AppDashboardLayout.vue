<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { LayoutDashboard, Menu, Moon, PackagePlus, Sun, X } from '@lucide/vue'
import { useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'

const logoUrl = `${import.meta.env.BASE_URL}logo.png`

const route = useRoute()
const mobileOpen = ref(false)
const title = computed(() => String(route.meta.title ?? 'Dashboard'))
const { theme, toggleTheme } = useTheme()
watch(() => route.fullPath, () => { mobileOpen.value = false })
</script>

<template>
  <div class="app-shell">
    <button v-if="mobileOpen" class="app-shell__backdrop" aria-label="Cerrar navegación" @click="mobileOpen = false"></button>
    <aside class="app-shell__sidebar" :class="{ 'is-open': mobileOpen }">
      <RouterLink class="app-shell__brand" :to="{ name: 'dashboard' }"><span><img :src="logoUrl" alt="" width="35" height="35" /></span><strong>Vue Kit</strong></RouterLink>
      <button class="app-shell__close" type="button" aria-label="Cerrar menú" @click="mobileOpen = false"><X :size="20" /></button>
      <nav aria-label="Navegación principal">
        <RouterLink :to="{ name: 'dashboard' }"><LayoutDashboard :size="19" /><span>Dashboard</span></RouterLink>
      </nav>
      <div class="app-shell__tip"><PackagePlus :size="18" /><p>Agrega componentes con <code>vue-kit add</code>.</p></div>
    </aside>
    <div class="app-shell__page">
      <header class="app-shell__header">
        <button class="app-shell__menu" type="button" aria-label="Abrir navegación" @click="mobileOpen = true"><Menu :size="22" /></button>
        <div><small>Área de trabajo</small><h1>{{ title }}</h1></div>
        <button class="app-shell__theme" type="button" :aria-label="theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'" @click="toggleTheme"><Sun v-if="theme === 'dark'" :size="20" /><Moon v-else :size="20" /></button>
      </header>
      <main class="app-shell__content"><RouterView /></main>
    </div>
  </div>
</template>

<style scoped>
.app-shell { display: grid; grid-template-columns: 250px minmax(0, 1fr); min-height: 100vh; }
.app-shell__sidebar { position: sticky; top: 0; display: flex; flex-direction: column; height: 100vh; padding: 24px 17px; background: #1e1e2d; color: #a2a3b7; }
.app-shell__brand { display: flex; align-items: center; gap: 12px; padding: 0 9px 24px; color: white; text-decoration: none; }
.app-shell__brand > span { display: grid; place-items: center; width: 35px; height: 35px; border-radius: 9px; overflow: hidden; flex-shrink: 0; }
.app-shell__brand img { display: block; width: 100%; height: 100%; object-fit: contain; transform: scale(1.65); }
.app-shell__brand strong { font-size: .95rem; font-weight: 600; }
.app-shell__sidebar nav { display: grid; gap: 5px; }
.app-shell__sidebar nav a { display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 12px; border-radius: 7px; color: #a2a3b7; font-size: .82rem; text-decoration: none; }
.app-shell__sidebar nav a:hover, .app-shell__sidebar nav a.router-link-active { color: white; background: #29293d; }
.app-shell__tip { display: flex; gap: 10px; align-items: flex-start; margin-top: auto; padding: 14px; border: 1px solid #34344a; border-radius: 8px; font-size: .7rem; line-height: 1.65; }
.app-shell__tip p { margin: 0; }.app-shell__tip code { color: white; }
.app-shell__page { min-width: 0; }
.app-shell__header { display: flex; align-items: center; gap: 14px; min-height: 82px; padding: 15px clamp(20px, 4vw, 46px); border-bottom: 1px solid var(--color-border); background: var(--color-surface); }
.app-shell__header small { color: var(--color-muted); font-size: .68rem; }.app-shell__header h1 { margin: 2px 0 0; color: var(--color-dark); font-size: 1.05rem; font-weight: 600; }
.app-shell__theme, .app-shell__menu, .app-shell__close { display: grid; place-items: center; width: 40px; height: 40px; border: 0; border-radius: 8px; background: var(--color-light); color: var(--color-gray-700); cursor: pointer; }
.app-shell__theme { margin-left: auto; }.app-shell__menu, .app-shell__close { display: none; }
.app-shell__content { padding: clamp(22px, 4vw, 46px); }
.app-shell__backdrop { display: none; }
@media (max-width: 800px) {
  .app-shell { grid-template-columns: 1fr; }
  .app-shell__sidebar { position: fixed; z-index: 20; inset: 0 auto 0 0; width: min(280px, 85vw); transform: translateX(-100%); transition: transform .2s; }
  .app-shell__sidebar.is-open { transform: translateX(0); }
  .app-shell__menu, .app-shell__close { display: grid; }.app-shell__close { position: absolute; top: 20px; right: 16px; background: #29293d; color: white; }
  .app-shell__backdrop { position: fixed; z-index: 19; inset: 0; display: block; width: 100%; border: 0; background: rgba(15, 18, 30, .58); }
}
</style>
