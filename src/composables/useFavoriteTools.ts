import { computed } from 'vue'
import { catalog } from '@/data/catalog'
import { useFavoritesStore } from '@/stores/favorites'
import type { Tool } from '@/types/tool'

/**
 * Resolve the user's favorited tool ids to their full Tool metadata, in the
 * order they were favorited. Unknown ids (e.g. a tool removed from the
 * catalog) are dropped. Shared by the sidebar and the home favorites row.
 */
export function useFavoriteTools() {
  const favs = useFavoritesStore()

  const favTools = computed<Tool[]>(() =>
    favs.ids
      .map(id => catalog.find(tool => tool.id === id))
      .filter((tool): tool is Tool => Boolean(tool)),
  )

  return { favTools }
}
