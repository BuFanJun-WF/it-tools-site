import { computed } from 'vue'
import { toolsFromIds } from '@/data/catalog'
import { useFavoritesStore } from '@/stores/favorites'

/**
 * Resolve the user's favorited tool ids to their full Tool metadata, in the
 * order they were favorited. Unknown ids (e.g. a tool removed from the
 * catalog) are dropped. Shared by the sidebar and the home favorites row.
 */
export function useFavoriteTools() {
  const favs = useFavoritesStore()
  const favTools = computed(() => toolsFromIds(favs.ids))
  return { favTools }
}
