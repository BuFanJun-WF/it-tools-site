<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { catalog } from '@/data/catalog'
import { useUiStore } from '@/stores/ui'
import { useFavoritesStore } from '@/stores/favorites'
import { useFuzzySearch } from '@/composables/useFuzzySearch'
import AppIcon from '@/components/ui/AppIcon.vue'
import HeroSection from './HeroSection.vue'
import CategoryBar from './CategoryBar.vue'
import ToolCard from './ToolCard.vue'

const { t } = useI18n()
const ui = useUiStore()
const favs = useFavoritesStore()

const query = computed(() => ui.search)
const activeCat = computed(() => ui.activeCategory)
const results = useFuzzySearch(query, activeCat)

const showHero = computed(() => activeCat.value === 'All' && !query.value.trim())

const favTools = computed(() =>
  favs.ids
    .map(id => catalog.find(tool => tool.id === id))
    .filter((x): x is NonNullable<typeof x> => Boolean(x)),
)
const showFavRow = computed(() => activeCat.value === 'All' && !query.value.trim() && favTools.value.length > 0)

const noResultTitle = computed(() => {
  const q = query.value.trim()
  return t('home.noResults.title', { q: q ? ` “${q}”` : '' })
})
</script>

<template>
  <div>
    <HeroSection v-if="showHero" />

    <section v-if="showFavRow" class="fav-section">
      <div class="section-head">
        <h2>{{ t('home.yourFavorites') }}</h2>
        <span class="count">{{ favTools.length }}</span>
      </div>
      <div class="tool-grid">
        <ToolCard v-for="tool in favTools" :key="tool.id" :tool="tool" />
      </div>
    </section>

    <CategoryBar />

    <div v-if="query.trim() || activeCat !== 'All'" class="section-head">
      <h2>
        <template v-if="query.trim()">{{ t('home.resultsFor', { q: query.trim() }) }}</template>
        <template v-else>{{ t(`categories.${activeCat}`) }}</template>
      </h2>
      <span class="count">{{ results.length }}</span>
    </div>

    <div v-if="results.length" class="tool-grid">
      <ToolCard
        v-for="tool in results"
        :key="tool.id"
        :tool="tool"
        :query="query.trim().toLowerCase()"
      />
    </div>

    <div v-else class="empty-state">
      <AppIcon name="search" :size="48" />
      <h3 v-html="noResultTitle" />
      <p>{{ t('home.noResults.body') }}</p>
    </div>
  </div>
</template>

<style scoped>
.section-head {
  display: flex;
  align-items: baseline;
  gap: var(--sp-3);
  margin-bottom: var(--sp-5);
}
.section-head h2 {
  font-size: var(--fs-xl);
  font-weight: 600;
  color: var(--text-strong);
}
.section-head .count {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--muted-2);
}
.fav-section { margin-bottom: var(--sp-10); }

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--sp-4);
}

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
</style>
