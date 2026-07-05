<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'

const { t } = useI18n()
const router = useRouter()

const year = new Date().getFullYear()

const productLinks = [
  { key: 'hall', to: '/hall' },
  { key: 'changelog', to: '/blog' },
  { key: 'popular', to: '/hall' },
] as const

const supportLinks = [
  { key: 'docs', to: '/blog' },
  { key: 'feedback', to: '/feedback' },
] as const

const aboutLinks = [
  { key: 'about', to: '/about' },
  { key: 'privacy', to: '/about' },
  { key: 'terms', to: '/about' },
] as const

const socials = [
  { key: 'github', icon: 'github', href: 'https://github.com/BuFanJun-WF/it-tools-site' },
  { key: 'wechat', icon: 'wechat', href: '#' },
  { key: 'weibo', icon: 'weibo', href: '#' },
  { key: 'x', icon: 'x', href: '#' },
] as const

function go(to: string) {
  router.push(to)
}
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <!-- Brand column -->
        <div class="brand-col">
          <div class="brand-row">
            <span class="brand-mark"><AppIcon name="logo" :size="20" /></span>
            <span class="brand-name">{{ t('app.name') }}</span>
          </div>
          <p class="tagline">{{ t('footer.tagline') }}</p>
          <div class="socials">
            <a
              v-for="s in socials"
              :key="s.key"
              :href="s.href"
              target="_blank"
              rel="noopener"
              :title="t(`footer.social.${s.key}`)"
              :aria-label="t(`footer.social.${s.key}`)"
            >
              <AppIcon :name="s.icon" :size="16" />
            </a>
          </div>
        </div>

        <!-- Product -->
        <div class="link-col">
          <h4>{{ t('footer.columns.product') }}</h4>
          <button v-for="l in productLinks" :key="l.key" class="f-link" @click="go(l.to)">
            {{ t(`footer.links.${l.key}`) }}
          </button>
        </div>

        <!-- Support -->
        <div class="link-col">
          <h4>{{ t('footer.columns.support') }}</h4>
          <button v-for="l in supportLinks" :key="l.key" class="f-link" @click="go(l.to)">
            {{ t(`footer.links.${l.key}`) }}
          </button>
        </div>

        <!-- About -->
        <div class="link-col">
          <h4>{{ t('footer.columns.about') }}</h4>
          <button v-for="l in aboutLinks" :key="l.key" class="f-link" @click="go(l.to)">
            {{ t(`footer.links.${l.key}`) }}
          </button>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="rights">{{ t('footer.rights', { year }) }}</p>
        <p class="made">
          <AppIcon name="heart" :size="13" />
          <span>{{ t('footer.madeWith') }}</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: auto;
  background: var(--footer-bg);
  border-top: 1px solid var(--footer-border);
}
.footer-inner {
  max-width: var(--nav-max);
  margin: 0 auto;
  padding: var(--sp-12) var(--sp-5) var(--sp-6);
}
.footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: var(--sp-8);
  padding-bottom: var(--sp-8);
  border-bottom: 1px solid var(--border);
}

/* Brand column */
.brand-col { max-width: 320px; }
.brand-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: var(--sp-3);
}
.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--r-md);
  background: linear-gradient(135deg, var(--accent), var(--amber));
  color: #fff;
}
.brand-mark :deep(svg) { color: #fff; }
.brand-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--fs-lg);
  letter-spacing: -0.02em;
  color: var(--text-strong);
}
.tagline {
  color: var(--muted);
  font-size: var(--fs-sm);
  line-height: 1.6;
  margin: 0 0 var(--sp-4);
}
.socials { display: flex; gap: 8px; }
.socials a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--muted);
  transition: color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease);
}
.socials a:hover {
  color: var(--accent-text);
  border-color: var(--accent);
  transform: translateY(-2px);
}

/* Link columns */
.link-col { display: flex; flex-direction: column; gap: 2px; }
.link-col h4 {
  font-family: var(--font-display);
  font-size: var(--fs-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-strong);
  margin: 0 0 var(--sp-3);
}
.f-link {
  text-align: left;
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: var(--fs-sm);
  padding: 6px 0;
  border-radius: var(--r-sm);
  cursor: pointer;
  transition: color var(--dur-fast) var(--ease);
}
.f-link:hover { color: var(--accent-text); }

/* Bottom row */
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
  padding-top: var(--sp-5);
  flex-wrap: wrap;
}
.rights { color: var(--muted-2); font-size: var(--fs-xs); margin: 0; }
.made {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--muted-2);
  font-size: var(--fs-xs);
  margin: 0;
}
.made :deep(svg) { color: var(--rose); }

@media (max-width: 920px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-6) var(--sp-5);
  }
  .brand-col { grid-column: 1 / -1; max-width: none; }
  .footer-inner { padding: var(--sp-8) var(--sp-4) var(--sp-5); }
}
@media (max-width: 560px) {
  .footer-grid { grid-template-columns: 1fr; }
  .footer-bottom { justify-content: flex-start; }
}
</style>
