import { computed } from 'vue'
import { toolsFromIds } from '@/data/catalog'
import { useRecentStore } from '@/stores/recent'

/**
 * Resolve the user's recently-visited tool ids to their full Tool metadata,
 * most-recent first. Unknown ids (e.g. a tool removed from the catalog) are
 * dropped. Used by the home "recently used" row.
 */
export function useRecentTools() {
  const recent = useRecentStore()
  const recentTools = computed(() => toolsFromIds(recent.ids))
  return { recentTools }
}
