import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  /** Free-text search in the topbar. */
  const search = ref('')
  /** Active category filter ("All" by default). */
  const activeCategory = ref<string>('All')

  function setSearch(value: string) {
    search.value = value
  }
  function clearSearch() {
    search.value = ''
  }
  function setActiveCategory(c: string) {
    activeCategory.value = c
  }

  return {
    search,
    activeCategory,
    setSearch,
    clearSearch,
    setActiveCategory,
  }
})
