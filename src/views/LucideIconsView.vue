<script setup lang="ts">
import {
  House, Search, Menu, X, ArrowLeft, ArrowRight, ChevronDown, Check,
  Plus, Minus, Pencil, Trash2, Copy, Download, Upload, ExternalLink,
  User, Users, Settings, Bell, Mail, Calendar, Clock, Heart,
  Star, Bookmark, Folder, FileText, Image, Camera, ShoppingCart, Shield,
} from '@lucide/vue'
import DocsIconGallery from '../components/docs/DocsIconGallery.vue'

const icons = Object.entries({
  House, Search, Menu, X, ArrowLeft, ArrowRight, ChevronDown, Check,
  Plus, Minus, Pencil, Trash2, Copy, Download, Upload, ExternalLink,
  User, Users, Settings, Bell, Mail, Calendar, Clock, Heart,
  Star, Bookmark, Folder, FileText, Image, Camera, ShoppingCart, Shield,
}).map(([name, component]) => ({ name, component }))
</script>

<template>
  <DocsIconGallery title="Lucide" website="https://lucide.dev/icons/" :icons="icons" />
</template>
