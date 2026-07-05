<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useLocaleStore } from '@/stores/locale'
import { useFavoritesStore } from '@/stores/favorites'
import AppShell from '@/components/shell/AppShell.vue'

const theme = useThemeStore()
const locale = useLocaleStore()

onMounted(() => {
  theme.init()
  locale.init()
})

// favorites store is created eagerly so persistence is wired up
useFavoritesStore()
</script>

<template>
  <AppShell />
</template>
