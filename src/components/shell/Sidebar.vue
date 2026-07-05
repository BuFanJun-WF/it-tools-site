<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { catalog, CATEGORIES, toolsByCategory } from '@/data/catalog'
import { categoryMeta } from '@/data/icons'
import { useFavoritesStore } from '@/stores/favorites'
import { useUiStore } from '@/stores/ui'
import AppIcon from '@/components/ui/AppIcon.vue'
import NavItem from './NavItem.vue'

const { t } = useI18n()
const favs = useFavoritesStore()
const ui = useUiStore()

const favTools = computed(() =>
  favs.ids
    .map(id => catalog.find(tool => tool.id === id))
    .filter((x): x is NonNullable<typeof x> => Boolean(x)),
)

function catLabel(cat: string) {
  return t(`categories.${cat}`)
}
</script>

<template>
  <aside :class="['sidebar', ui.mobileNavOpen && 'open']">
    <RouterLink to="/" class="brand">
      <span class="brand-mark"><AppIcon name="logo" :size="20" /></span>
      <span class="brand-name">it<span>·</span>tools</span>
    </RouterLink>

    <nav class="sidebar-nav">
      <div v-if="favTools.length" class="nav-section">
        <div class="nav-section-label">
          <span class="label-text">
            <AppIcon name="star" :size="13" />
            {{ t('app.nav.favorites') }}
          </span>
          <span class="count">{{ favTools.length }}</span>
        </div>
        <NavItem v-for="tool in favTools" :key="tool.id" :tool="tool" />
      </div>

      <div v-for="cat in CATEGORIES" :key="cat" class="nav-section">
        <div class="nav-section-label">
          <span class="label-text">
            <AppIcon :name="categoryMeta[cat]?.icon ?? 'grid'" :size="13" />
            {{ catLabel(cat) }}
          </span>
          <span class="count">{{ toolsByCategory(cat).length }}</span>
        </div>
        <NavItem v-for="tool in toolsByCategory(cat)" :key="tool.id" :tool="tool" />
      </div>
    </nav>

    <div class="sidebar-footer">
      <a href="https://github.com/BuFanJun-WF/it-tools-site" target="_blank" rel="noopener">
        <AppIcon name="github" :size="14" />
        <span>{{ t('app.actions.inspiredBy') }}</span>
      </a>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border-right: 1px solid var(--border);
  overflow: hidden;
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  height: var(--topbar-h);
  padding: 0 var(--sp-5);
  border-bottom: 1px solid var(--border-soft);
  flex-shrink: 0;
}
.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--r-md);
  background: linear-gradient(135deg, var(--accent), var(--amber));
  color: #fff;
  box-shadow: 0 4px 14px -6px var(--accent);
}
.brand-mark :deep(svg) { color: #fff; }
.brand-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--fs-lg);
  letter-spacing: -0.02em;
  color: var(--text-strong);
}
.brand-name span { color: var(--accent); }

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--sp-3);
}

.nav-section { margin-bottom: var(--sp-4); }
.nav-section-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-2) var(--sp-3) var(--sp-1);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted-2);
}
.nav-section-label .label-text {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.nav-section-label .count {
  font-family: var(--font-mono);
  color: var(--faint);
}

.sidebar-footer {
  padding: var(--sp-3) var(--sp-5);
  border-top: 1px solid var(--border-soft);
  flex-shrink: 0;
}
.sidebar-footer a {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: var(--fs-xs);
}
.sidebar-footer a:hover { color: var(--text); }

@media (max-width: 920px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    transform: translateX(-100%);
    transition: transform var(--dur-slow) var(--ease-out);
    z-index: 50;
    box-shadow: var(--shadow-pop);
  }
  .sidebar.open { transform: translateX(0); }
}
</style>
