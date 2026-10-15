export const notificationExample = "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport { Bell, Mail } from '@lucide/vue'\nimport AppNotificationBadge from '../components/ui/AppNotificationBadge.vue'\nconst unread = ref(3)\n</script>\n\n<template>\n  <AppNotificationBadge :count=\"unread\" dot pulse color=\"success\">\n    <button :aria-label=\"unread + ' notificaciones sin leer'\" @click=\"unread = 0\"><Bell /></button>\n  </AppNotificationBadge>\n  <AppNotificationBadge :count=\"unread\" :max=\"99\">\n    <button :aria-label=\"unread + ' mensajes sin leer'\" @click=\"unread = 0\"><Mail /></button>\n  </AppNotificationBadge>\n</template>"

export const sizeExample = `<AppNotificationBadge :count="8" :size="1">...</AppNotificationBadge>
<AppNotificationBadge :count="8" :size="5">...</AppNotificationBadge>
<AppNotificationBadge :count="1" :size="5" dot pulse>...</AppNotificationBadge>`
