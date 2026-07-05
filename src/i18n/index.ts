import { createI18n } from 'vue-i18n'
import en from './locales/en'
import zhCN from './locales/zh-CN'

export type AppLocale = 'en' | 'zh-CN'

export const SUPPORTED_LOCALES: { value: AppLocale; label: string; short: string }[] = [
  { value: 'en', label: 'English', short: 'EN' },
  { value: 'zh-CN', label: '中文', short: '中' },
]

const LANG_KEY = 'it-tools:lang'

/** Read persisted language, fall back to browser preference, then 'en'. */
export function detectInitialLocale(): AppLocale {
  const stored = localStorage.getItem(LANG_KEY) as AppLocale | null
  if (stored === 'en' || stored === 'zh-CN') return stored
  const nav = navigator.language?.toLowerCase() ?? ''
  if (nav.startsWith('zh')) return 'zh-CN'
  return 'en'
}

export function persistLocale(locale: AppLocale) {
  localStorage.setItem(LANG_KEY, locale)
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: detectInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-CN': zhCN,
  },
})

export default i18n
