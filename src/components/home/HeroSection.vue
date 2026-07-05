<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { catalog } from '@/data/catalog'
import { CATEGORIES } from '@/data/catalog'

const { t } = useI18n()

const stats = computed(() => [
  { num: String(catalog.length), accent: '.', lbl: t('home.hero.stats.tools') },
  { num: String(CATEGORIES.length), accent: '', lbl: t('home.hero.stats.categories') },
  { num: '0', accent: 'kb', lbl: t('home.hero.stats.zeroKb') },
  { num: '100', accent: '%', lbl: t('home.hero.stats.inBrowser') },
])

// Title is rendered as: <prefix> <accent>highlight</accent> <suffix>
// We store the full sentence in i18n with the highlight part wrapped by
// the special tokens {accent} ... {accentEnd}, then split on them here.
const titleSegments = computed(() => {
  const raw = t('home.hero.title')
  // Split keeping the inner segment. Tokens are {accent} and {accentEnd}.
  const openIdx = raw.indexOf('{accent}')
  const closeIdx = raw.indexOf('{accentEnd}')
  if (openIdx === -1 || closeIdx === -1) return { before: raw, highlight: '', after: '' }
  return {
    before: raw.slice(0, openIdx),
    highlight: raw.slice(openIdx + '{accent}'.length, closeIdx),
    after: raw.slice(closeIdx + '{accentEnd}'.length),
  }
})
</script>

<template>
  <section class="home-hero">
    <span class="eyebrow"><span class="dot" />{{ t('home.hero.eyebrow') }}</span>

    <h1>
      <span>{{ titleSegments.before }}</span>
      <span class="accent">{{ titleSegments.highlight }}</span>
      <span>{{ titleSegments.after }}</span>
    </h1>

    <p class="lead">
      {{ t('home.hero.lead', { count: catalog.length }) }}
    </p>

    <div class="hero-stats">
      <div v-for="s in stats" :key="s.lbl" class="hero-stat">
        <div class="num">{{ s.num }}<span class="accent">{{ s.accent }}</span></div>
        <div class="lbl">{{ s.lbl }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-hero {
  position: relative;
  padding: var(--sp-12) 0 var(--sp-10);
  margin-bottom: var(--sp-8);
  overflow: hidden;
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
  max-width: 16ch;
}
.accent {
  background: linear-gradient(120deg, var(--accent), var(--amber));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.lead {
  max-width: 60ch;
  color: var(--muted);
  font-size: var(--fs-md);
  line-height: 1.65;
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

@media (max-width: 920px) {
  .home-hero { padding: var(--sp-8) 0 var(--sp-6); }
  .hero-stats { gap: var(--sp-6); }
}
</style>
