import { defineStore } from 'pinia'
import { ref } from 'vue'
import i18n, {
  detectInitialLocale,
  persistLocale,
  type AppLocale,
  SUPPORTED_LOCALES,
} from '@/i18n'

export const useLocaleStore = defineStore('locale', () => {
  const current = ref<AppLocale>(detectInitialLocale())

  function apply(locale: AppLocale) {
    i18n.global.locale.value = locale
    document.documentElement.lang = locale
  }

  function set(locale: AppLocale) {
    current.value = locale
    persistLocale(locale)
    apply(locale)
  }

  function toggle() {
    set(current.value === 'en' ? 'zh-CN' : 'en')
  }

  function init() {
    apply(current.value)
  }

  return { current, options: SUPPORTED_LOCALES, set, toggle, init }
})
