<script setup lang="ts">
import {
  IconHome, IconSearch, IconMenu2, IconX, IconArrowLeft, IconArrowRight, IconChevronDown, IconCheck,
  IconPlus, IconMinus, IconPencil, IconTrash, IconCopy, IconDownload, IconUpload, IconExternalLink,
  IconUser, IconUsers, IconSettings, IconBell, IconMail, IconCalendar, IconClock, IconHeart,
  IconStar, IconBookmark, IconFolder, IconFileText, IconPhoto, IconCamera, IconShoppingCart, IconShield,
} from '@tabler/icons-vue'
import DocsIconGallery from '../components/docs/DocsIconGallery.vue'
import DocsIconUsage from '../components/docs/DocsIconUsage.vue'
import AppButton from '../components/ui/AppButton.vue'

const example = `<script setup lang="ts">
import { IconHome, IconSearch, IconHeart } from '@tabler/icons-vue'
<\/script>

<template>
  <span><IconHome :size="20" aria-hidden="true" /> Inicio</span>
  <IconHeart :size="28" color="#c2273a" :stroke-width="1.5" aria-label="Favorito" role="img" />
  <button type="button" aria-label="Buscar">
    <IconSearch :size="20" aria-hidden="true" />
  </button>
</template>`

const icons = Object.entries({
  IconHome, IconSearch, IconMenu2, IconX, IconArrowLeft, IconArrowRight, IconChevronDown, IconCheck,
  IconPlus, IconMinus, IconPencil, IconTrash, IconCopy, IconDownload, IconUpload, IconExternalLink,
  IconUser, IconUsers, IconSettings, IconBell, IconMail, IconCalendar, IconClock, IconHeart,
  IconStar, IconBookmark, IconFolder, IconFileText, IconPhoto, IconCamera, IconShoppingCart, IconShield,
}).map(([name, component]) => ({ name, component }))
</script>

<template>
  <DocsIconGallery title="Tabler Icons" website="https://tabler.io/icons" :icons="icons" />
  <DocsIconUsage library="Tabler Icons" command="npm install @tabler/icons-vue" :code="example" documentation="https://docs.tabler.io/icons/libraries/vue">
    <span class="icon-demo-label"><IconHome :size="20" aria-hidden="true" /> Inicio</span>
    <IconHeart :size="28" color="#c2273a" :stroke-width="1.5" aria-label="Favorito" role="img" />
    <AppButton variant="outline" icon-only aria-label="Buscar"><IconSearch :size="20" aria-hidden="true" /></AppButton>
  </DocsIconUsage>
</template>

<style scoped>
.icon-demo-label { display: inline-flex; align-items: center; gap: 8px; }
</style>
