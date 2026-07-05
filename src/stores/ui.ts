import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  /** Free-text search in the topbar. */
  const search = ref('')
  /** Active category filter ("All" by default). */
  const activeCategory = ref<string>('All')
  /** Mobile sidebar drawer open state. */
  const mobileNavOpen = ref(false)

  function setSearch(value: string) {
    search.value = value
  }
  function clearSearch() {
    search.value = ''
  }
  function setActiveCategory(c: string) {
    activeCategory.value = c
  }
  function openMobileNav() {
    mobileNavOpen.value = true
  }
  function closeMobileNav() {
    mobileNavOpen.value = false
  }
  function toggleMobileNav() {
    mobileNavOpen.value = !mobileNavOpen.value
  }

  return {
    search,
    activeCategory,
    mobileNavOpen,
    setSearch,
    clearSearch,
    setActiveCategory,
    openMobileNav,
    closeMobileNav,
    toggleMobileNav,
  }
})
