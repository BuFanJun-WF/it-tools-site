<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useFavoritesStore } from '@/stores/favorites'
import { useUiStore } from '@/stores/ui'
import type { Tool } from '@/types/tool'

const props = defineProps<{ tool: Tool }>()

const route = useRoute()
const { t } = useI18n()
const favs = useFavoritesStore()
const ui = useUiStore()

const isActive = computed(() => route.path === props.tool.path)
const isFav = computed(() => favs.isFavorite(props.tool.id))
</script>

<template>
  <RouterLink
    :to="tool.path"
    :class="['nav-item', isActive && 'active', isFav && 'is-fav']"
    @click="ui.closeMobileNav()"
  >
    <span class="ic"><AppIcon :name="tool.icon" /></span>
    <span class="label">{{ t(tool.nameKey) }}</span>
    <AppIcon class="star" name="star" :size="11" />
  </RouterLink>
</template>

<style scoped>
.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px var(--sp-3);
  border-radius: var(--r-md);
  color: var(--muted);
  font-size: var(--fs-sm);
  font-weight: 500;
  transition:
    background-color var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease);
}
.nav-item:hover {
  background: var(--surface-2);
  color: var(--text);
}
.nav-item.active {
  background: var(--accent-soft);
  color: var(--accent-text);
}
.nav-item .ic {
  display: inline-flex;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.nav-item .ic :deep(svg) { width: 16px; height: 16px; }
.nav-item .label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.nav-item .star {
  opacity: 0;
  color: var(--amber);
  flex-shrink: 0;
}
.nav-item.is-fav .star { opacity: 1; }
</style>
