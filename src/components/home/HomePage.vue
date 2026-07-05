<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { catalog, CATEGORIES, toolsByCategory } from '@/data/catalog'
import { categoryMeta } from '@/data/icons'
import { useUiStore } from '@/stores/ui'
import { useFavoritesStore } from '@/stores/favorites'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ToolCard from './ToolCard.vue'

const { t, locale } = useI18n()
const router = useRouter()
const ui = useUiStore()
const favs = useFavoritesStore()

const localeToolWord = computed(() => (locale.value.startsWith('zh') ? '个工具' : 'tools'))

// Hero stats
const stats = computed(() => [
  { num: String(catalog.filter(t => t.implemented).length), accent: '.', lbl: t('home.hero.stats.tools') },
  { num: String(CATEGORIES.length), accent: '', lbl: t('home.hero.stats.categories') },
  { num: '0', accent: 'kb', lbl: t('home.hero.stats.zeroKb') },
  { num: '100', accent: '%', lbl: t('home.hero.stats.inBrowser') },
])

// Title is rendered as: <prefix> <accent>highlight</accent> <suffix>
const titleSegments = computed(() => {
  const raw = t('home.hero.title')
  const openIdx = raw.indexOf('{accent}')
  const closeIdx = raw.indexOf('{accentEnd}')
  if (openIdx === -1 || closeIdx === -1) return { before: raw, highlight: '', after: '' }
  return {
    before: raw.slice(0, openIdx),
    highlight: raw.slice(openIdx + '{accent}'.length, closeIdx),
    after: raw.slice(closeIdx + '{accentEnd}'.length),
  }
})

// Featured: pick a curated handful of implemented tools, in priority order.
const FEATURED_IDS = [
  'json-prettify',
  'base64-string-converter',
  'uuid-generator',
  'hash-text',
  'qrcode-generator',
  'regex-tester',
  'jwt-parser',
  'date-time-converter',
]
const featured = computed(() =>
  FEATURED_IDS
    .map(id => catalog.find(t => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t) && Boolean(t!.implemented)),
)

// Favorites row
const favTools = computed(() =>
  favs.ids
    .map(id => catalog.find(tool => tool.id === id))
    .filter((x): x is NonNullable<typeof x> => Boolean(x)),
)

// Category showcase cards
const categoryCards = computed(() =>
  CATEGORIES.map(c => ({ cat: c, count: toolsByCategory(c).length })),
)

function goHall(cat?: string) {
  if (cat) ui.setActiveCategory(cat)
  else ui.setActiveCategory('All')
  ui.clearSearch()
  router.push('/hall')
}

function goFeedback() {
  router.push('/feedback')
}
</script>

<template>
  <div class="page page-enter">
    <!-- ============== HERO ============== -->
    <section class="hero">
      <span class="eyebrow"><span class="dot" />{{ t('home.hero.eyebrow') }}</span>

      <h1>
        <span>{{ titleSegments.before }}</span>
        <span class="accent">{{ titleSegments.highlight }}</span>
        <span>{{ titleSegments.after }}</span>
      </h1>

      <p class="lead">{{ t('home.hero.lead', { count: catalog.length }) }}</p>

      <div class="hero-cta">
        <BaseButton variant="primary" @click="goHall()">
          <AppIcon name="grid" :size="16" />
          <span>{{ t('home.hero.cta.hall') }}</span>
        </BaseButton>
        <BaseButton variant="ghost" @click="goFeedback()">
          <AppIcon name="sparkles" :size="16" />
          <span>{{ t('home.hero.cta.feedback') }}</span>
        </BaseButton>
      </div>

      <div class="hero-stats">
        <div v-for="s in stats" :key="s.lbl" class="hero-stat">
          <div class="num">{{ s.num }}<span class="accent">{{ s.accent }}</span></div>
          <div class="lbl">{{ s.lbl }}</div>
        </div>
      </div>
    </section>

    <!-- ============== FEATURED ============== -->
    <section class="block">
      <div class="block-head">
        <div>
          <h2>{{ t('home.featured.title') }}</h2>
          <p class="sub">{{ t('home.featured.subtitle') }}</p>
        </div>
        <button class="more-link" @click="goHall()">
          <span>{{ t('home.featured.more') }}</span>
          <AppIcon name="arrowRight" :size="15" />
        </button>
      </div>
      <div class="tool-grid">
        <ToolCard
          v-for="tool in featured"
          :key="tool.id"
          :tool="tool"
          featured
        />
      </div>
    </section>

    <!-- ============== FAVORITES ============== -->
    <section v-if="favTools.length" class="block">
      <div class="block-head">
        <div>
          <h2>{{ t('home.yourFavorites') }}</h2>
        </div>
        <span class="count-pill">{{ favTools.length }}</span>
      </div>
      <div class="tool-grid">
        <ToolCard v-for="tool in favTools" :key="tool.id" :tool="tool" />
      </div>
    </section>

    <!-- ============== CATEGORIES ============== -->
    <section class="block">
      <div class="block-head">
        <div>
          <h2>{{ t('home.categories.title') }}</h2>
          <p class="sub">{{ t('home.categories.subtitle', { n: CATEGORIES.length }) }}</p>
        </div>
      </div>
      <div class="cat-grid">
        <button
          v-for="c in categoryCards"
          :key="c.cat"
          class="cat-card"
          :style="{ '--cat-color': categoryMeta[c.cat]?.color ?? 'var(--accent)' }"
          @click="goHall(c.cat)"
        >
          <span class="cat-ic"><AppIcon :name="categoryMeta[c.cat]?.icon ?? 'grid'" :size="20" /></span>
          <span class="cat-info">
            <span class="cat-name">{{ t(`categories.${c.cat}`) }}</span>
            <span class="cat-count">{{ t('home.count', { n: c.count }) }} {{ localeToolWord }}</span>
          </span>
          <AppIcon class="cat-arrow" name="arrowUpRight" :size="16" />
        </button>
      </div>
    </section>

    <!-- ============== WHY ============== -->
    <section class="block">
      <div class="why">
        <div class="why-head">
          <h2>{{ t('home.about.title') }}</h2>
          <p class="sub">{{ t('home.about.subtitle') }}</p>
        </div>
        <div class="why-grid">
          <div class="why-card">
            <span class="why-ic"><AppIcon name="lockShield" :size="20" /></span>
            <h3>{{ t('home.about.points.local.title') }}</h3>
            <p>{{ t('home.about.points.local.body') }}</p>
          </div>
          <div class="why-card">
            <span class="why-ic"><AppIcon name="zap" :size="20" /></span>
            <h3>{{ t('home.about.points.fast.title') }}</h3>
            <p>{{ t('home.about.points.fast.body') }}</p>
          </div>
          <div class="why-card">
            <span class="why-ic"><AppIcon name="github" :size="20" /></span>
            <h3>{{ t('home.about.points.open.title') }}</h3>
            <p>{{ t('home.about.points.open.body') }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ============== HERO ============== */
.hero {
  position: relative;
  padding: var(--sp-12) 0 var(--sp-10);
  margin-bottom: var(--sp-8);
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute;
  inset: -40px 0 0 0;
  height: 420px;
  background: var(--hero-glow);
  pointer-events: none;
  z-index: -1;
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  border-radius: var(--r-pill);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--accent-text);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
  animation: pulse 2s var(--ease) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

h1 {
  font-size: var(--fs-3xl);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.06;
  margin: var(--sp-5) 0 var(--sp-4);
  max-width: 18ch;
}
.accent {
  background: linear-gradient(120deg, var(--accent), var(--amber));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.lead {
  max-width: 62ch;
  color: var(--muted);
  font-size: var(--fs-md);
  line-height: 1.65;
}

.hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  margin-top: var(--sp-6);
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-8);
  margin-top: var(--sp-8);
  padding-top: var(--sp-6);
  border-top: 1px solid var(--border);
}
.hero-stat .num {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--fs-2xl);
  letter-spacing: -0.02em;
  color: var(--text-strong);
  line-height: 1;
}
.hero-stat .num .accent { color: var(--accent); -webkit-text-fill-color: var(--accent); }
.hero-stat .lbl {
  margin-top: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted-2);
}

/* ============== BLOCKS ============== */
.block { margin-bottom: var(--sp-12); }
.block-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--sp-4);
  margin-bottom: var(--sp-5);
}
.block-head h2 {
  font-size: var(--fs-xl);
  font-weight: 700;
  color: var(--text-strong);
  letter-spacing: -0.02em;
}
.block-head .sub {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: var(--fs-sm);
}
.more-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 12px;
  border-radius: var(--r-pill);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--muted);
  font-size: var(--fs-xs);
  font-weight: 600;
  transition: color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), background-color var(--dur-fast) var(--ease);
}
.more-link:hover {
  color: var(--accent-text);
  border-color: var(--accent);
  background: var(--accent-soft);
}
.more-link :deep(svg) { transition: transform var(--dur-fast) var(--ease); }
.more-link:hover :deep(svg) { transform: translateX(2px); }

.count-pill {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--muted-2);
  background: var(--surface-2);
  padding: 3px 10px;
  border-radius: var(--r-pill);
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--sp-4);
}

/* ============== CATEGORY CARDS ============== */
.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--sp-3);
}
.cat-card {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-4);
  border-radius: var(--r-lg);
  border: 1px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  text-align: left;
  transition: border-color var(--dur) var(--ease), transform var(--dur) var(--ease), background-color var(--dur) var(--ease);
}
.cat-card:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
  background: var(--surface);
}
.cat-ic {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r-md);
  background: color-mix(in srgb, var(--cat-color) 14%, transparent);
  color: var(--cat-color);
  flex-shrink: 0;
}
.cat-info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.cat-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--fs-md);
  color: var(--text-strong);
}
.cat-count { font-size: var(--fs-xs); color: var(--muted-2); }
.cat-arrow { color: var(--muted-2); transition: transform var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease); }
.cat-card:hover .cat-arrow { color: var(--accent-text); transform: translate(2px, -2px); }

/* ============== WHY ============== */
.why {
  padding: var(--sp-10);
  border-radius: var(--r-xl);
  border: 1px solid var(--border);
  background:
    radial-gradient(600px 300px at 100% 0%, var(--accent-soft), transparent 60%),
    var(--surface);
}
.why-head { max-width: 60ch; margin-bottom: var(--sp-8); }
.why-head h2 {
  font-size: var(--fs-2xl);
  font-weight: 700;
  color: var(--text-strong);
  letter-spacing: -0.02em;
}
.why-head .sub { margin: 6px 0 0; color: var(--muted); }
.why-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--sp-5);
}
.why-card { display: flex; flex-direction: column; gap: var(--sp-2); }
.why-ic {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r-md);
  background: var(--surface-2);
  color: var(--accent-text);
  margin-bottom: var(--sp-2);
}
.why-card h3 {
  font-size: var(--fs-md);
  font-weight: 600;
  color: var(--text-strong);
}
.why-card p {
  margin: 0;
  color: var(--muted);
  font-size: var(--fs-sm);
  line-height: 1.6;
}

/* ============== RESPONSIVE ============== */
@media (max-width: 920px) {
  .hero { padding: var(--sp-8) 0 var(--sp-6); }
  .hero-stats { gap: var(--sp-6); }
  .why { padding: var(--sp-6); }
}
@media (max-width: 560px) {
  .hero-stats { gap: var(--sp-5); }
  .hero-stat .num { font-size: var(--fs-xl); }
}
</style>
