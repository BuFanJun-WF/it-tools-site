import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const FAV_KEY = 'it-tools:favorites'

function load(): string[] {
  try {
    const raw = localStorage.getItem(FAV_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref<string[]>(load())

  function persist() {
    localStorage.setItem(FAV_KEY, JSON.stringify(ids.value))
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
