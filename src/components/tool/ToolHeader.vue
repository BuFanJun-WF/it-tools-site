<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/ui/AppIcon.vue'
import IconBtn from '@/components/ui/IconBtn.vue'
import TagBadge from '@/components/ui/TagBadge.vue'
import { useFavoritesStore } from '@/stores/favorites'
import type { Tool } from '@/types/tool'

const props = defineProps<{ tool: Tool }>()
const { t } = useI18n()
const favs = useFavoritesStore()

function onFav() {
  favs.toggle(props.tool.id)
}
</script>

<template>
  <header class="tool-header">
    <div class="ic-wrap"><AppIcon :name="tool.icon" :size="24" /></div>
    <div class="meta">
      <h1>{{ t(tool.nameKey) }}</h1>
      <p class="desc">{{ t(tool.descKey) }}</p>
      <div class="cat-row">
        <TagBadge variant="accent">{{ t(`categories.${tool.category}`) }}</TagBadge>
        <TagBadge v-if="!tool.implemented">{{ t('tool.comingSoon.title') }}</TagBadge>
      </div>
    </div>
    <IconBtn
      :active="favs.isFavorite(tool.id)"
      :title="favs.isFavorite(tool.id) ? t('tool.unfavorite') : t('tool.favorite')"
      @click="onFav"
    >
      <AppIcon :name="favs.isFavorite(tool.id) ? 'star' : 'starOutline'" :size="18" />
    </IconBtn>
  </header>
</template>

<style scoped>
.tool-header {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-4);
  margin-bottom: var(--sp-6);
}
.ic-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--r-lg);
  background: var(--accent-soft);
  color: var(--accent-text);
  flex-shrink: 0;
}
.meta { flex: 1; min-width: 0; }
.meta h1 {
  font-size: var(--fs-2xl);
  font-weight: 700;
  color: var(--text-strong);
  margin-bottom: 4px;
}
.desc {
  color: var(--muted);
  font-size: var(--fs-sm);
  line-height: 1.55;
  margin-bottom: var(--sp-3);
  max-width: 70ch;
}
.cat-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

@media (max-width: 920px) {
  .meta h1 { font-size: var(--fs-xl); }
}
</style>
