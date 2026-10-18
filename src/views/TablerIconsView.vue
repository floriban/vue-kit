<script setup lang="ts">
import {
  IconHome, IconSearch, IconMenu2, IconX, IconArrowLeft, IconArrowRight, IconChevronDown, IconCheck,
  IconPlus, IconMinus, IconPencil, IconTrash, IconCopy, IconDownload, IconUpload, IconExternalLink,
  IconUser, IconUsers, IconSettings, IconBell, IconMail, IconCalendar, IconClock, IconHeart,
  IconStar, IconBookmark, IconFolder, IconFileText, IconPhoto, IconCamera, IconShoppingCart, IconShield,
} from '@tabler/icons-vue'
import DocsIconGallery from '../components/docs/DocsIconGallery.vue'

const icons = Object.entries({
  IconHome, IconSearch, IconMenu2, IconX, IconArrowLeft, IconArrowRight, IconChevronDown, IconCheck,
  IconPlus, IconMinus, IconPencil, IconTrash, IconCopy, IconDownload, IconUpload, IconExternalLink,
  IconUser, IconUsers, IconSettings, IconBell, IconMail, IconCalendar, IconClock, IconHeart,
  IconStar, IconBookmark, IconFolder, IconFileText, IconPhoto, IconCamera, IconShoppingCart, IconShield,
}).map(([name, component]) => ({ name, component }))
</script>

<template>
  <DocsIconGallery title="Tabler Icons" website="https://tabler.io/icons" :icons="icons" />
</template>
