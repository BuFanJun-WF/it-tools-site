<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { catalog, CATEGORIES, toolsByCategory } from '@/data/catalog'
import { categoryMeta } from '@/data/icons'
import { useUiStore } from '@/stores/ui'
import AppIcon from '@/components/ui/AppIcon.vue'

const { t } = useI18n()
const ui = useUiStore()

const chips = computed(() => [
  { key: 'All', icon: 'grid', count: catalog.length },
  ...CATEGORIES.map(c => ({ key: c, icon: categoryMeta[c]?.icon ?? 'grid', count: toolsByCategory(c).length })),
])

const ALL_LABELS = { en: 'All', 'zh-CN': '全部' } as const

function label(key: string) {
  if (key === 'All') {
    const locale = useI18n().locale.value
    return ALL_LABELS[locale as 'en' | 'zh-CN']
  }
  return t(`categories.${key}`)
}
</script>

<template>
  <div class="cat-bar">
    <button
      v-for="chip in chips"
      :key="chip.key"
      :class="['cat-chip', ui.activeCategory === chip.key && 'active']"
      @click="ui.setActiveCategory(chip.key)"
    >
      <AppIcon :name="chip.icon" :size="14" />
      <span>{{ label(chip.key) }}</span>
      <span class="n">{{ chip.count }}</span>
    </button>
  </div>
</template>

<style scoped>
.cat-bar {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;
  margin-bottom: var(--sp-6);
  scrollbar-width: none;
}
.cat-bar::-webkit-scrollbar { display: none; }
.cat-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 32px;
  padding: 0 var(--sp-3);
  border-radius: var(--r-pill);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--muted);
  font-size: var(--fs-xs);
  font-weight: 600;
  letter-spacing: -0.005em;
  white-space: nowrap;
  transition:
    background-color var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease);
}
.cat-chip:hover {
  color: var(--text);
  border-color: var(--border-strong);
}
.cat-chip.active {
  background: var(--accent);
  border-color: transparent;
  color: #fff;
}
.cat-chip.active .n { color: rgba(255, 255, 255, 0.7); }
.cat-chip .n {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--muted-2);
}
</style>
