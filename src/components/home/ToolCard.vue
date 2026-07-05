<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useFavoritesStore } from '@/stores/favorites'
import type { Tool } from '@/types/tool'

const props = defineProps<{ tool: Tool; query?: string; featured?: boolean }>()

const { t, locale } = useI18n()
const router = useRouter()
const favs = useFavoritesStore()

const isFav = computed(() => favs.isFavorite(props.tool.id))
const name = computed(() => t(props.tool.nameKey))
const desc = computed(() => t(props.tool.descKey))
const enterLabel = computed(() => (locale.value.startsWith('zh') ? '进入' : 'Enter'))

const cardRef = ref<HTMLElement | null>(null)

function onMouseMove(e: MouseEvent) {
  const el = cardRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}

function onClick(e: MouseEvent) {
  // Star click toggles favorite instead of navigating
  if ((e.target as HTMLElement).closest('[data-fav]')) return
  router.push(props.tool.path)
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c)
}
function highlight(text: string, q?: string) {
  if (!q) return escapeHtml(text)
  const safe = escapeHtml(text)
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig')
  return safe.replace(re, '<mark>$1</mark>')
}
</script>

<template>
  <article
    ref="cardRef"
    :class="['mkt-card', featured && 'featured', !tool.implemented && 'dim']"
    @mousemove="onMouseMove"
    @click="onClick"
  >
    <!-- Top row: status badge + favorite -->
    <div class="top">
      <span v-if="featured" class="badge hot">{{ t('home.featured.title') }}</span>
      <span v-else-if="!tool.implemented" class="badge soon">{{ t('tool.comingSoon.title') }}</span>
      <span v-else class="spacer" />

      <button
        :class="['star', isFav && 'active']"
        data-fav
        :aria-label="t('tool.favorite')"
        @click.stop.prevent="favs.toggle(tool.id)"
      >
        <AppIcon :name="isFav ? 'star' : 'starOutline'" :size="14" />
      </button>
    </div>

    <!-- Body: icon + name + desc -->
    <div class="body">
      <span class="ic"><AppIcon :name="tool.icon" :size="20" /></span>
      <div class="text">
        <div class="name" v-html="highlight(name, query)" />
        <div class="desc" v-html="highlight(desc, query)" />
      </div>
    </div>

    <!-- Footer: category tag + enter -->
    <div class="foot">
      <span class="cat-tag">{{ t(`categories.${tool.category}`) }}</span>
      <span class="enter">
        <span class="enter-text">{{ enterLabel }}</span>
        <AppIcon name="arrowRight" :size="14" />
      </span>
    </div>
  </article>
</template>

<style scoped>
.mkt-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  padding: var(--sp-4);
  border-radius: var(--r-xl);
  border: 1px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  overflow: hidden;
  transition:
    border-color var(--dur) var(--ease),
    transform var(--dur) var(--ease),
    box-shadow var(--dur) var(--ease),
    background-color var(--dur) var(--ease);
}
.mkt-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    280px circle at var(--mx, 50%) var(--my, 0%),
    var(--accent-soft),
    transparent 60%
  );
  opacity: 0;
  transition: opacity var(--dur) var(--ease);
  pointer-events: none;
}
.mkt-card:hover {
  border-color: var(--border-strong);
  transform: translateY(-3px);
  box-shadow: var(--shadow-2);
}
.mkt-card:hover::before { opacity: 1; }
.mkt-card.dim { opacity: 0.78; }
.mkt-card.dim:hover { opacity: 1; }

/* Top row */
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 22px;
}
.spacer { width: 1px; }
.star {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--r-sm);
  background: transparent;
  border: none;
  color: var(--faint);
  transition: color var(--dur-fast) var(--ease), background-color var(--dur-fast) var(--ease);
}
.star:hover { background: var(--surface-2); color: var(--amber); }
.star.active { color: var(--amber); }

/* Body */
.body {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-3);
  flex: 1;
  min-width: 0;
}
.ic {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: var(--r-md);
  background: var(--surface-2);
  color: var(--muted);
  flex-shrink: 0;
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}
.mkt-card:hover .ic {
  background: var(--accent-soft);
  color: var(--accent-text);
}
.text { flex: 1; min-width: 0; }
.name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--fs-md);
  color: var(--text-strong);
  letter-spacing: -0.01em;
  margin-bottom: 4px;
}
.desc {
  color: var(--muted);
  font-size: var(--fs-sm);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Footer */
.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 2px;
}
.cat-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: var(--r-pill);
  background: var(--surface-2);
  color: var(--muted-2);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
}
.enter {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--muted-2);
  font-size: var(--fs-xs);
  font-weight: 600;
  transition: color var(--dur-fast) var(--ease);
}
.enter :deep(svg) { transition: transform var(--dur-fast) var(--ease); }
.mkt-card:hover .enter { color: var(--accent-text); }
.mkt-card:hover .enter :deep(svg) { transform: translateX(2px); }
</style>
