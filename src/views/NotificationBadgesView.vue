<script setup lang="ts">
import { ref } from 'vue'
import { Bell, Mail } from '@lucide/vue'
import DocsPageHeader from '../components/docs/DocsPageHeader.vue'
import DocsCodeBlock from '../components/docs/DocsCodeBlock.vue'
import AppNotificationBadge from '../components/ui/AppNotificationBadge.vue'
import AppButton from '../components/ui/AppButton.vue'
import AppCard from '../components/ui/AppCard.vue'
import AppTable from '../components/ui/AppTable.vue'
import { notificationExample, sizeExample } from '../docs/notificationExamples'

const sizes = [1, 2, 3, 4, 5] as const
const sizePixels = [15, 16, 17, 18, 20]
const unread = ref(3)
const notificationProperties = [
  ['size', '1 | 2 | 3 | 4 | 5', '1', 'Diámetro del dot y altura del contador: 15, 16, 17, 18 y 20 px.'],
  ['count', 'number', '0', 'Cantidad pendiente; cero oculta el indicador.'],
  ['max', 'number', '99', 'Límite visual: muestra 99+ al superarlo.'],
  ['dot', 'boolean', 'false', 'Muestra solo un punto.'],
  ['pulse', 'boolean', 'false', 'Anima un halo cuando hay pendientes; respeta movimiento reducido.'],
  ['showZero', 'boolean', 'false', 'Mantiene visible el indicador con cero.'],
  ['color', 'primary | neutral | info | success | warning | danger', 'danger', 'Color del indicador.'],
]
</script>

<template>
  <DocsPageHeader eyebrow="Elementos visuales / Indicadores" title="Indicadores" description="Puntos con pulso y contadores sobre iconos para mostrar notificaciones y mensajes pendientes." />

  <section id="notification-badges" class="component-section">
    <div class="section-heading"><div><span>01</span><h2>Notificaciones y contadores</h2></div><p>Punto con pulso y cantidad de mensajes pendientes sobre un icono.</p></div>
    <AppCard title="Indicadores de notificación" subtitle="Pulsa la campana o el correo para marcar los pendientes como leídos.">
      <div class="component-row">
        <AppNotificationBadge :count="unread" dot pulse color="success">
          <button type="button" class="dashboard-icon-button" :aria-label="unread + ' notificaciones sin leer; marcar como leídas'" @click="unread = 0"><Bell :size="23" aria-hidden="true" /></button>
        </AppNotificationBadge>
        <AppNotificationBadge :count="unread" pulse>
          <button type="button" class="dashboard-icon-button" :aria-label="unread + ' mensajes sin leer; marcar como leídos'" @click="unread = 0"><Mail :size="23" aria-hidden="true" /></button>
        </AppNotificationBadge>
        <AppNotificationBadge :count="120" :max="99">
          <button type="button" class="dashboard-icon-button" aria-label="Simular 120 mensajes sin leer" @click="unread = 120"><Mail :size="23" aria-hidden="true" /></button>
        </AppNotificationBadge>
        <span role="status">{{ unread }} sin leer</span>
      </div>
      <div class="component-row">
        <AppButton size="sm" @click="unread++">Simular mensaje</AppButton>
        <AppButton size="sm" variant="outline" @click="unread = 0">Marcar como leídos</AppButton>
        <AppButton size="sm" variant="ghost" @click="unread = 3">Restablecer</AppButton>
      </div>
      <p class="docs-reference-note">El punto y el contador desaparecen al llegar a cero. El límite muestra 99+ y el pulso respeta la preferencia de movimiento reducido.</p>
    </AppCard>
    <DocsCodeBlock :code="notificationExample" />
  </section>

  <section class="component-section">
    <div class="section-heading"><div><span>02</span><h2>Tamaños</h2></div><p>Dots desde 15 px; size 1 es el predeterminado.</p></div>
    <AppCard title="Escala de indicadores">
      <div class="component-row">
        <div v-for="size in sizes" :key="size" style="display: grid; gap: 16px; padding: 12px; justify-items: center">
          <AppNotificationBadge :count="8" :size="size"><span class="dashboard-icon-button"><Mail :size="23" aria-hidden="true" /></span></AppNotificationBadge>
          <AppNotificationBadge :count="1" :size="size" dot pulse color="success"><span class="dashboard-icon-button"><Bell :size="23" aria-hidden="true" /></span></AppNotificationBadge>
          <small>Size {{ size }} · {{ sizePixels[size - 1] }} px</small>
        </div>
      </div>
    </AppCard>
    <DocsCodeBlock :code="sizeExample" />
  </section>

  <section class="component-section">
    <div class="section-heading"><div><span>03</span><h2>Referencia de AppNotificationBadge</h2></div><p>Propiedades, contenido y accesibilidad.</p></div>
    <AppCard title="API del componente">
      <div class="docs-reference">
      <AppTable label="Propiedades de AppNotificationBadge" compact>
        <thead><tr><th scope="col">Propiedad</th><th>Tipo</th><th>Por defecto</th><th>Descripción</th></tr></thead>
        <tbody><tr v-for="item in notificationProperties" :key="item[0]"><td><code>{{ item[0] }}</code></td><td><code>{{ item[1] }}</code></td><td><code>{{ item[2] }}</code></td><td>{{ item[3] }}</td></tr></tbody>
      </AppTable>
      <h3>Slot por defecto y accesibilidad</h3>
      <p>El slot contiene el botón, enlace o icono. Incluye la cantidad real en el nombre accesible del control. El componente recibe los pendientes mediante count; los mensajes de esta demostración son datos locales.</p>
      </div>
    </AppCard>
  </section>

</template>
