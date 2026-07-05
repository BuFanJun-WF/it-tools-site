import { defineStore } from 'pinia'
import { ref } from 'vue'

const RECENT_KEY = 'it-tools:recent'
const MAX_RECENT = 8

function load(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export const useRecentStore = defineStore('recent', () => {
  const ids = ref<string[]>(load())

  function persist() {
    localStorage.setItem(RECENT_KEY, JSON.stringify(ids.value))
  }

  /** Record a tool visit: dedupe, move to front, cap at MAX_RECENT. */
  function push(id: string) {
    const i = ids.value.indexOf(id)
    if (i !== -1) ids.value.splice(i, 1)
    ids.value.unshift(id)
    if (ids.value.length > MAX_RECENT) ids.value.length = MAX_RECENT
    persist()
  }

  return { ids, push }
})
