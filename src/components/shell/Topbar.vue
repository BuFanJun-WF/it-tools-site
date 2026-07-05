<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { useUiStore } from '@/stores/ui'
import AppIcon from '@/components/ui/AppIcon.vue'
import IconBtn from '@/components/ui/IconBtn.vue'
import LangSwitch from './LangSwitch.vue'

const { t } = useI18n()
const router = useRouter()
const theme = useThemeStore()
const ui = useUiStore()

function onSearchInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  ui.setSearch(v)
  if (router.currentRoute.value.path !== '/') router.push('/')
}
</script>

<template>
  <header class="topbar">
    <button
      class="menu-toggle"
      :aria-label="t('app.actions.theme')"
      @click="ui.toggleMobileNav()"
    >
      <AppIcon name="menu" :size="20" />
    </button>

    <div class="topbar-search">
      <span class="ic-search"><AppIcon name="search" :size="16" /></span>
      <input
        id="global-search"
        type="search"
        :placeholder="t('app.search.placeholder')"
        :value="ui.search"
        autocomplete="off"
        spellcheck="false"
        @input="onSearchInput"
      />
      <span class="kbd">{{ t('app.search.shortcut') }}</span>
    </div>

    <div class="topbar-actions">
      <LangSwitch />
      <IconBtn :title="t('app.actions.home')" @click="router.push('/')">
        <AppIcon name="grid" :size="18" />
      </IconBtn>
      <IconBtn
        :title="theme.isDark ? t('app.actions.themeLight') : t('app.actions.themeDark')"
        @click="theme.toggle()"
      >
        <AppIcon :name="theme.isDark ? 'sun' : 'moon'" :size="18" />
      </IconBtn>
      <IconBtn
        tag="a"
        href="https://github.com/CorentinTh/it-tools"
        target="_blank"
        :title="t('app.actions.github')"
      >
        <AppIcon name="github" :size="18" />
      </IconBtn>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  height: var(--topbar-h);
  padding: 0 var(--sp-6);
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  backdrop-filter: saturate(180%) blur(14px);
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  border-bottom: 1px solid var(--border);
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

.topbar-search {
  position: relative;
  flex: 1;
  max-width: 560px;
}
.topbar-search input {
  width: 100%;
  height: 40px;
  padding: 0 64px 0 38px;
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: var(--fs-sm);
  transition: border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease);
}
.topbar-search input::placeholder { color: var(--muted-2); }
.topbar-search input:focus {
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
  right: 10px;
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

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

@media (max-width: 920px) {
  .topbar { padding: 0 var(--sp-4); gap: var(--sp-3); }
  .menu-toggle { display: inline-flex; }
  .kbd { display: none; }
}
@media (max-width: 560px) {
  .topbar-search { max-width: none; }
}
</style>
