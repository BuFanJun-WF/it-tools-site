<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useUiStore } from '@/stores/ui'
import AppIcon from '@/components/ui/AppIcon.vue'
import IconBtn from '@/components/ui/IconBtn.vue'
import LangSwitch from './LangSwitch.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const theme = useThemeStore()
const ui = useUiStore()

const mobileOpen = ref(false)

// Static nav list — declared once, not re-created per render.
const navItems = [
  { key: 'home', to: '/' },
  { key: 'hall', to: '/hall' },
  { key: 'about', to: '/about' },
  { key: 'blog', to: '/blog' },
  { key: 'feedback', to: '/feedback' },
] as const

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

function onSearch(e: Event) {
  const v = (e.target as HTMLInputElement).value
  ui.setSearch(v)
  // Searching always lands the user on the hall, where results render.
  if (route.path !== '/hall') router.push('/hall')
}

function go(to: string) {
  mobileOpen.value = false
  ui.clearSearch()
  router.push(to)
}
</script>

<template>
  <header class="mkt-header">
    <div class="bar">
      <!-- Brand -->
      <button class="brand" @click="go('/')">
        <span class="brand-mark"><AppIcon name="logo" :size="22" /></span>
        <span class="brand-text">
          <span class="brand-name">{{ t('app.name') }}</span>
          <span class="brand-tag">{{ t('app.tagline') }}</span>
        </span>
      </button>

      <!-- Centered nav -->
      <nav class="primary-nav">
        <button
          v-for="item in navItems"
          :key="item.key"
          :class="['nav-link', isActive(item.to) && 'active']"
          @click="go(item.to)"
        >
          {{ t(`app.nav.items.${item.key}`) }}
        </button>
      </nav>

      <!-- Right cluster: search + actions -->
      <div class="right">
        <div class="search">
          <span class="ic-search"><AppIcon name="search" :size="16" /></span>
          <input
            id="global-search"
            type="search"
            :placeholder="t('app.search.placeholder')"
            :value="ui.search"
            autocomplete="off"
            spellcheck="false"
            @input="onSearch"
          />
          <span class="kbd">{{ t('app.search.shortcut') }}</span>
        </div>

        <LangSwitch />
        <IconBtn
          :title="theme.isDark ? t('app.actions.themeLight') : t('app.actions.themeDark')"
          @click="theme.toggle()"
        >
          <AppIcon :name="theme.isDark ? 'sun' : 'moon'" :size="18" />
        </IconBtn>
        <IconBtn
          tag="a"
          href="https://github.com/BuFanJun-WF/it-tools-site"
          target="_blank"
          :title="t('app.actions.github')"
        >
          <AppIcon name="github" :size="18" />
        </IconBtn>

        <button
          class="menu-toggle"
          :aria-label="t('app.actions.menu')"
          @click="mobileOpen = !mobileOpen"
        >
          <AppIcon :name="mobileOpen ? 'x' : 'menu'" :size="20" />
        </button>
      </div>
    </div>

    <!-- Mobile dropdown -->
    <Transition name="slide-fade">
      <nav v-if="mobileOpen" class="mobile-nav">
        <button
          v-for="item in navItems"
          :key="item.key"
          :class="['m-link', isActive(item.to) && 'active']"
          @click="go(item.to)"
        >
          {{ t(`app.nav.items.${item.key}`) }}
          <AppIcon name="chevronRight" :size="16" />
        </button>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.mkt-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: color-mix(in srgb, var(--bg) 72%, transparent);
  backdrop-filter: saturate(180%) blur(16px);
  -webkit-backdrop-filter: saturate(180%) blur(16px);
  border-bottom: 1px solid var(--border);
}

.bar {
  max-width: var(--nav-max);
  margin: 0 auto;
  height: var(--header-h);
  padding: 0 var(--sp-5);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--sp-4);
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;
  min-width: 0;
}
.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--r-md);
  background: linear-gradient(135deg, var(--accent), var(--amber));
  color: #fff;
  box-shadow: 0 6px 18px -8px var(--accent);
  flex-shrink: 0;
}
.brand-mark :deep(svg) { color: #fff; }
.brand-text { display: flex; flex-direction: column; line-height: 1.1; min-width: 0; }
.brand-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--fs-md);
  letter-spacing: -0.02em;
  color: var(--text-strong);
}
.brand-tag {
  font-size: 11px;
  color: var(--muted-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Center nav */
.primary-nav {
  display: flex;
  align-items: center;
  gap: 2px;
  justify-self: center;
}
.nav-link {
  position: relative;
  padding: 8px 14px;
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: var(--fs-sm);
  font-weight: 500;
  border-radius: var(--r-md);
  transition: color var(--dur-fast) var(--ease), background-color var(--dur-fast) var(--ease);
}
.nav-link:hover { color: var(--text); background: var(--surface-2); }
.nav-link.active { color: var(--accent-text); }
.nav-link.active::after {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 2px;
  height: 2px;
  border-radius: 2px;
  background: var(--accent);
}

/* Right cluster */
.right {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-self: end;
}
.search {
  position: relative;
  width: 220px;
  max-width: 100%;
}
.search input {
  width: 100%;
  height: 38px;
  padding: 0 60px 0 36px;
  border-radius: var(--r-pill);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: var(--fs-sm);
  transition: border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease), width var(--dur) var(--ease);
}
.search input::placeholder { color: var(--muted-2); }
.search input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}
.ic-search {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-2);
  display: inline-flex;
}
.kbd {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 7px;
  border-radius: var(--r-sm);
  background: var(--surface-2);
  color: var(--muted-2);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  pointer-events: none;
}

.menu-toggle {
  display: none;
  width: 38px;
  height: 38px;
  border-radius: var(--r-md);
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted);
  align-items: center;
  justify-content: center;
}
.menu-toggle:hover { background: var(--surface-2); color: var(--text); }

/* Mobile dropdown */
.mobile-nav {
  display: none;
  flex-direction: column;
  padding: var(--sp-2) var(--sp-4) var(--sp-4);
  border-top: 1px solid var(--border);
  background: var(--surface);
}
.m-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px var(--sp-3);
  border: none;
  background: transparent;
  color: var(--text);
  font-size: var(--fs-md);
  font-weight: 500;
  border-radius: var(--r-md);
}
.m-link:hover { background: var(--surface-2); }
.m-link.active { color: var(--accent-text); background: var(--accent-soft); }
.m-link :deep(svg) { color: var(--muted-2); }

/* ---- Responsive ---- */
@media (max-width: 1080px) {
  .brand-tag { display: none; }
  .search { width: 180px; }
}

@media (max-width: 920px) {
  .bar { grid-template-columns: 1fr auto; height: 60px; }
  .primary-nav { display: none; }
  .search { display: none; }
  .menu-toggle { display: inline-flex; }
  .mobile-nav { display: flex; }
}

@media (max-width: 560px) {
  .bar { padding: 0 var(--sp-4); }
  .kbd { display: none; }
}
</style>
