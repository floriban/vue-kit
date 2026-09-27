<script setup lang="ts">
import { ArrowUpRight, CircleCheck, Clock3, Users } from '@lucide/vue'
const metrics = [
  { label: 'Usuarios activos', value: '1,248', detail: '+8.2% este mes', icon: Users },
  { label: 'Tareas completadas', value: '86%', detail: '312 de 364 tareas', icon: CircleCheck },
  { label: 'Tiempo promedio', value: '4.2 h', detail: '12 min menos que ayer', icon: Clock3 },
]
</script>

<template>
  <section class="dashboard-welcome">
    <div><span>PLANTILLA BASE</span><h2>Todo listo para comenzar</h2><p>Esta instalación contiene solamente la estructura esencial. Añade los componentes que necesite cada proyecto mediante el CLI.</p></div>
    <code>npx @dediho/vue-kit add button</code>
  </section>
  <section class="dashboard-metrics" aria-label="Resumen">
    <article v-for="metric in metrics" :key="metric.label">
      <component :is="metric.icon" :size="22" />
      <p>{{ metric.label }}</p><strong>{{ metric.value }}</strong><small>{{ metric.detail }}</small>
    </article>
  </section>
  <section class="dashboard-next">
    <div><span>Próximo paso</span><h2>Instala solo lo que vas a utilizar</h2><p>Explora el registro con <code>vue-kit list</code> y agrega uno o varios componentes.</p></div>
    <ArrowUpRight :size="28" />
  </section>
</template>

<style scoped>
.dashboard-welcome, .dashboard-next { display: flex; align-items: center; justify-content: space-between; gap: 30px; padding: clamp(25px, 5vw, 48px); border-radius: 12px; background: var(--color-surface); box-shadow: var(--shadow-card); }
.dashboard-welcome > div { max-width: 650px; }.dashboard-welcome span, .dashboard-next span { color: var(--color-primary); font-size: .66rem; font-weight: 600; letter-spacing: .16em; }
h2 { margin: 10px 0; color: var(--color-dark); font-size: clamp(1.25rem, 3vw, 2rem); }p { margin: 0; color: var(--color-muted); font-size: .82rem; line-height: 1.8; }
.dashboard-welcome > code { flex: 0 0 auto; padding: 13px 17px; border-radius: 7px; background: var(--color-dark); color: var(--color-surface); font-size: .75rem; }
.dashboard-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-block: 20px; }
.dashboard-metrics article { padding: 24px; border: 1px solid var(--color-border); border-radius: 10px; background: var(--color-surface); }
.dashboard-metrics svg { color: var(--color-primary); }.dashboard-metrics p { margin-top: 18px; }.dashboard-metrics strong { display: block; margin: 7px 0 4px; color: var(--color-dark); font-size: 1.7rem; }.dashboard-metrics small { color: var(--color-muted); font-size: .7rem; }
.dashboard-next { box-shadow: none; border: 1px solid var(--color-border); }.dashboard-next > div { max-width: 570px; }.dashboard-next svg { color: var(--color-primary); }
@media (max-width: 700px) { .dashboard-welcome { align-items: flex-start; flex-direction: column; }.dashboard-metrics { grid-template-columns: 1fr; } }
</style>
