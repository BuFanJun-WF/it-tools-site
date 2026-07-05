import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const FAV_KEY = 'it-tools:favorites'

function load(): string[] {
  try {
    const raw = localStorage.getItem(FAV_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref<string[]>(load())

  function persist() {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(ids.value)) } catch { /* 隐私模式/配额超限，静默 */ }
  }

  const count = computed(() => ids.value.length)

  function isFavorite(id: string): boolean {
    return ids.value.includes(id)
  }

  function toggle(id: string) {
    const i = ids.value.indexOf(id)
    if (i === -1) ids.value.push(id)
    else ids.value.splice(i, 1)
    persist()
  }

  return { ids, count, isFavorite, toggle }
})
