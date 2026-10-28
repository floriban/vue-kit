<script setup lang="ts">
import {
  House, Search, Menu, X, ArrowLeft, ArrowRight, ChevronDown, Check,
  Plus, Minus, Pencil, Trash2, Copy, Download, Upload, ExternalLink,
  User, Users, Settings, Bell, Mail, Calendar, Clock, Heart,
  Star, Bookmark, Folder, FileText, Image, Camera, ShoppingCart, Shield,
} from '@lucide/vue'
import DocsIconGallery from '../components/docs/DocsIconGallery.vue'
import DocsIconUsage from '../components/docs/DocsIconUsage.vue'
import AppButton from '../components/ui/AppButton.vue'

const example = `<script setup lang="ts">
import { House, Search, Heart } from '@lucide/vue'
<\/script>

<template>
  <span><House :size="20" aria-hidden="true" /> Inicio</span>
  <Heart :size="28" color="#c2273a" :stroke-width="1.5" aria-label="Favorito" role="img" />
  <button type="button" aria-label="Buscar">
    <Search :size="20" aria-hidden="true" />
  </button>
</template>`

const icons = Object.entries({
  House, Search, Menu, X, ArrowLeft, ArrowRight, ChevronDown, Check,
  Plus, Minus, Pencil, Trash2, Copy, Download, Upload, ExternalLink,
  User, Users, Settings, Bell, Mail, Calendar, Clock, Heart,
  Star, Bookmark, Folder, FileText, Image, Camera, ShoppingCart, Shield,
}).map(([name, component]) => ({ name, component }))
</script>

<template>
  <DocsIconGallery title="Lucide" website="https://lucide.dev/icons/" :icons="icons" />
  <DocsIconUsage library="Lucide" command="npm install @lucide/vue" :code="example" documentation="https://lucide.dev/guide/vue">
    <span class="icon-demo-label"><House :size="20" aria-hidden="true" /> Inicio</span>
    <Heart :size="28" color="#c2273a" :stroke-width="1.5" aria-label="Favorito" role="img" />
    <AppButton variant="outline" icon-only aria-label="Buscar"><Search :size="20" aria-hidden="true" /></AppButton>
  </DocsIconUsage>
</template>

<style scoped>
.icon-demo-label { display: inline-flex; align-items: center; gap: 8px; }
</style>
