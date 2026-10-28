<script setup lang="ts">
import DocsCodeBlock from './DocsCodeBlock.vue'
defineProps<{ library: string; command: string; code: string; documentation: string }>()
</script>

<template>
  <section class="component-section" :aria-label="`Instalación y uso de ${library}`">
    <div class="section-heading">
      <div><span>02</span><h2>Instalación y uso</h2></div>
      <p>Importa únicamente los iconos que necesites en cada componente.</p>
    </div>
    <div class="showcase-panel">
      <p>Instala {{ library }} en tu proyecto:</p>
      <pre class="icon-usage-command" tabindex="0" aria-label="Comando de instalación"><code>{{ command }}</code></pre>
      <div class="icon-usage-preview" aria-label="Ejemplos de uso de iconos"><slot /></div>
      <DocsCodeBlock :code="code" label="Ver ejemplo con Vue" />
      <p class="icon-usage-note">Los iconos que acompañan texto usan <code>aria-hidden="true"</code>. Los botones que solo muestran un icono llevan <code>aria-label</code>.</p>
      <p><a :href="documentation" target="_blank" rel="noopener noreferrer">Documentación oficial de {{ library }} (se abre en otra pestaña)</a></p>
      <slot name="footer" />
    </div>
  </section>
</template>

<style scoped>
.icon-usage-command { overflow-x: auto; padding: 1rem; border-radius: .5rem; background: var(--color-light); font-size: .8rem; }
.icon-usage-preview { display: flex; align-items: center; flex-wrap: wrap; gap: 20px; padding: 20px 0; }
.icon-usage-note { color: var(--color-muted); font-size: .85rem; }
</style>
