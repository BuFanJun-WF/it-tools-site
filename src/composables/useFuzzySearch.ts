import { computed, type Ref } from 'vue'
import { catalog } from '@/data/catalog'
import { useI18n } from 'vue-i18n'
import type { Tool } from '@/types/tool'

/**
 * Filter the catalog by free-text query and (optionally) active category.
 * Search matches the localized name/description for the current locale plus
 * the bilingual keywords array. Case-insensitive, token-AND.
 */
export function useFuzzySearch(query: Ref<string>, category: Ref<string>) {
  const { t, tm } = useI18n()

  return computed<Tool[]>(() => {
    const q = query.value.trim().toLowerCase()
    const tokens = q ? q.split(/\s+/).filter(Boolean) : []

    let pool = catalog
    if (category.value !== 'All') {
      pool = pool.filter(tool => tool.category === category.value)
    }

    if (tokens.length === 0) return pool

    return pool.filter(tool => {
      // Build a haystack from localized name/description + keyword list.
      const name = String(t(tool.nameKey)).toLowerCase()
      const desc = String(t(tool.descKey)).toLowerCase()
      const kws = tool.keywords.map(k => k.toLowerCase())
      // Also pull the other locale's name/desc so EN↔ZH search works both ways.
      const altName = String((tm(tool.nameKey) as Record<string, string> | string | undefined) ?? '').toLowerCase()
      const altDesc = String((tm(tool.descKey) as Record<string, string> | string | undefined) ?? '').toLowerCase()
      const haystack = [name, desc, altName, altDesc, ...kws].join(' \u0001 ')
      return tokens.every(tok => haystack.includes(tok))
    })
  })
}
