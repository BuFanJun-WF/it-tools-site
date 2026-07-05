import { defineStore } from 'pinia'
import { ref } from 'vue'

const RECENT_KEY = 'it-tools:recent'
const MAX_RECENT = 8

function load(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    // 形状校验：localStorage 被篡改成非数组/非字符串时降级为空。
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

export const useRecentStore = defineStore('recent', () => {
  const ids = ref<string[]>(load())

  function persist() {
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(ids.value)) } catch { /* 隐私模式/配额超限，静默 */ }
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
