<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { catalog, CATEGORIES, toolsByCategory } from '@/data/catalog'
import { categoryMeta } from '@/data/icons'
import { useUiStore } from '@/stores/ui'
import { useFuzzySearch } from '@/composables/useFuzzySearch'
import AppIcon from '@/components/ui/AppIcon.vue'
import ToolCard from '@/components/home/ToolCard.vue'

const { t, locale } = useI18n()
const ui = useUiStore()

const query = computed(() => ui.search)
const activeCat = computed(() => ui.activeCategory)
const results = useFuzzySearch(query, activeCat)

const ALL_LABELS = { en: 'All', 'zh-CN': '全部' } as const

const chips = computed(() => [
  { key: 'All', icon: 'grid', count: catalog.length },
  ...CATEGORIES.map(c => ({ key: c, icon: categoryMeta[c]?.icon ?? 'grid', count: toolsByCategory(c).length })),
])

function chipLabel(key: string) {
  if (key === 'All') return ALL_LABELS[locale.value as 'en' | 'zh-CN']
  return t(`categories.${key}`)
}

function pickCat(key: string) {
  ui.setActiveCategory(key)
}

const noResultTitle = computed(() => {
  const q = query.value.trim()
  return t('home.noResults.title', { q: q ? ` “${q}”` : '' })
})
</script>

<template>
  <div class="page page-enter">
    <!-- Header -->
    <section class="hall-head">
      <h1>
        <span class="h-ic"><AppIcon name="grid" :size="22" /></span>
        {{ t('hall.title') }}
      </h1>
      <p class="sub">{{ t('hall.subtitle', { n: catalog.length }) }}</p>

      <!-- Page-level search -->
      <div class="hall-search">
        <span class="ic-search"><AppIcon name="search" :size="16" /></span>
        <input
          type="search"
          :value="ui.search"
          :placeholder="t('hall.searchPlaceholder')"
          autocomplete="off"
          spellcheck="false"
          @input="ui.setSearch(($event.target as HTMLInputElement).value)"
        />
        <button v-if="ui.search" class="clear" :aria-label="t('common.clear')" @click="ui.clearSearch()">
          <AppIcon name="x" :size="14" />
        </button>
      </div>
    </section>

    <!-- Category tabs -->
    <div class="cat-bar">
      <button
        v-for="chip in chips"
        :key="chip.key"
        :class="['cat-chip', activeCat === chip.key && 'active']"
        @click="pickCat(chip.key)"
      >
        <AppIcon :name="chip.icon" :size="14" />
        <span>{{ chipLabel(chip.key) }}</span>
        <span class="n">{{ chip.count }}</span>
      </button>
    </div>

    <!-- Section label -->
    <div class="grid-head">
      <h2>
        {{ activeCat === 'All' ? t('hall.all') : t(`categories.${activeCat}`) }}
        <span class="count">{{ t('hall.countSuffix', { n: results.length }) }}</span>
      </h2>
    </div>

    <!-- Grid -->
    <div v-if="results.length" class="tool-grid">
      <ToolCard
        v-for="tool in results"
        :key="tool.id"
        :tool="tool"
        :query="query.trim().toLowerCase()"
      />
    </div>

    <!-- Empty -->
    <div v-else class="empty-state">
      <AppIcon name="search" :size="48" />
      <h3 v-html="noResultTitle" />
      <p>{{ t('home.noResults.body') }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Header */
.hall-head {
  padding: var(--sp-8) 0 var(--sp-6);
  border-bottom: 1px solid var(--border);
  margin-bottom: var(--sp-6);
}
.hall-head h1 {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  font-size: var(--fs-2xl);
  font-weight: 700;
  color: var(--text-strong);
  letter-spacing: -0.02em;
}
.h-ic {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--r-md);
  background: var(--accent-soft);
  color: var(--accent-text);
}
.hall-head .sub {
  margin: var(--sp-3) 0 var(--sp-5);
  color: var(--muted);
  font-size: var(--fs-md);
  max-width: 60ch;
}

.hall-search {
  position: relative;
  max-width: 560px;
}
.hall-search input {
  width: 100%;
  height: 44px;
  padding: 0 44px 0 40px;
  border-radius: var(--r-pill);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: var(--fs-sm);
  transition: border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease);
}
.hall-search input::placeholder { color: var(--muted-2); }
.hall-search input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}
.ic-search {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-2);
  display: inline-flex;
}
.clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--r-sm);
  border: none;
  background: var(--surface-2);
  color: var(--muted);
}
.clear:hover { background: var(--surface-3); color: var(--text); }

/* Category bar */
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
  height: 34px;
  padding: 0 var(--sp-3);
  border-radius: var(--r-pill);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--muted);
  font-size: var(--fs-xs);
  font-weight: 600;
  white-space: nowrap;
  transition: background-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease);
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

/* Grid head */
.grid-head { margin-bottom: var(--sp-5); }
.grid-head h2 {
  font-size: var(--fs-lg);
  font-weight: 600;
  color: var(--text-strong);
}
.grid-head .count {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--muted-2);
  margin-left: var(--sp-2);
  font-weight: 500;
}

/* Grid */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--sp-4);
}

/* Empty */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--sp-16) var(--sp-6);
  color: var(--muted);
}
.empty-state :deep(svg) { color: var(--faint); margin-bottom: var(--sp-4); }
.empty-state h3 {
  font-size: var(--fs-xl);
  color: var(--text-strong);
  margin-bottom: var(--sp-2);
}
.empty-state p { max-width: 36ch; }

@media (max-width: 920px) {
  .hall-head { padding: var(--sp-6) 0 var(--sp-5); }
}
</style>
