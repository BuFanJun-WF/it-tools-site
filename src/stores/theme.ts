import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const THEME_KEY = 'it-tools:theme'
type Theme = 'dark' | 'light'

function loadStored(): Theme | null {
  const stored = localStorage.getItem(THEME_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

function systemPrefersDark(): boolean {
  return !window.matchMedia('(prefers-color-scheme: light)').matches
}

function resolvedTheme(stored: Theme | null): Theme {
  if (stored) return stored
  return systemPrefersDark() ? 'dark' : 'light'
}

function apply(theme: Theme | null) {
  const el = document.documentElement
  if (theme === 'dark' || theme === 'light') el.setAttribute('data-theme', theme)
  else el.removeAttribute('data-theme')
}

let mediaMql: MediaQueryList | null = null

export const useThemeStore = defineStore('theme', () => {
  const stored = ref<Theme | null>(loadStored())
  const resolved = computed<Theme>(() => resolvedTheme(stored.value))
  const isDark = computed(() => resolved.value === 'dark')

  function init() {
    apply(resolved.value)
    // 未显式选择主题时，跟随系统的深浅色变化。
    mediaMql = window.matchMedia('(prefers-color-scheme: dark)')
    mediaMql.addEventListener('change', () => {
      if (!stored.value) apply(resolvedTheme(null))
    })
  }

  function toggle() {
    const next: Theme = resolved.value === 'dark' ? 'light' : 'dark'
    stored.value = next
    localStorage.setItem(THEME_KEY, next)
    apply(next)
  }

  return { stored, resolved, isDark, init, toggle }
})
