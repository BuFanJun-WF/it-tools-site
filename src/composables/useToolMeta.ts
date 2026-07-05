import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { findTool } from '@/data/catalog'
import type { Tool } from '@/types/tool'

/** Returns the Tool metadata for the current route, or undefined. */
export function useToolMeta() {
  const route = useRoute()
  const tool = computed<Tool | undefined>(() => {
    const id = route.params.toolId as string | undefined
    if (!id) return undefined
    return findTool(id)
  })
  return { tool }
}
