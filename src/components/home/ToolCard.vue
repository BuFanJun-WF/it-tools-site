<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useFavoritesStore } from '@/stores/favorites'
import type { Tool } from '@/types/tool'

const props = defineProps<{ tool: Tool; query?: string }>()

const { t } = useI18n()
const router = useRouter()
const favs = useFavoritesStore()

const isFav = computed(() => favs.isFavorite(props.tool.id))
const name = computed(() => t(props.tool.nameKey))
const desc = computed(() => t(props.tool.descKey))

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
    :class="['tool-card', !tool.implemented && 'dim']"
    @mousemove="onMouseMove"
    @click="onClick"
  >
    <div class="top">
      <span class="ic"><AppIcon :name="tool.icon" :size="20" /></span>
      <button
        :class="['star', isFav && 'active']"
        data-fav
        :aria-label="$t('tool.favorite')"
        @click.stop.prevent="favs.toggle(tool.id)"
      >
        <AppIcon :name="isFav ? 'star' : 'starOutline'" :size="14" />
      </button>
    </div>

    <div class="body">
      <div class="name" v-html="highlight(name, query)" />
      <div class="desc" v-html="highlight(desc, query)" />
    </div>

    <div class="meta">
      <span class="cat-tag">{{ t(`categories.${tool.category}`) }}</span>
      <span v-if="!tool.implemented" class="soon-tag">{{ t('tool.comingSoon.title') }}</span>
    </div>
  </article>
</template>

<style scoped>
.tool-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  padding: var(--sp-4);
  border-radius: var(--r-lg);
  border: 1px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  overflow: hidden;
  transition:
    border-color var(--dur) var(--ease),
    transform var(--dur) var(--ease),
    background-color var(--dur) var(--ease);
}
.tool-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    260px circle at var(--mx, 50%) var(--my, 0%),
    var(--accent-soft),
    transparent 60%
  );
  opacity: 0;
  transition: opacity var(--dur) var(--ease);
  pointer-events: none;
}
.tool-card:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
  background: var(--surface);
}
.tool-card:hover::before { opacity: 1; }
.tool-card.dim { opacity: 0.78; }
.tool-card.dim:hover { opacity: 1; }

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ic {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--r-md);
  background: var(--surface-2);
  color: var(--muted);
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}
.tool-card:hover .ic {
  background: var(--accent-soft);
  color: var(--accent-text);
}
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

.body { flex: 1; min-width: 0; }
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

.meta {
  display: flex;
  align-items: center;
  gap: 6px;
}
.cat-tag,
.soon-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--r-pill);
  background: var(--surface-2);
  color: var(--muted-2);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
}
.soon-tag {
  background: var(--amber-soft);
  color: var(--amber);
}
</style>
