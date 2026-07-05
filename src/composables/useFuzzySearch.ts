import { computed, type Ref } from 'vue'
import { catalog } from '@/data/catalog'
import en from '@/i18n/locales/en'
import zhCN from '@/i18n/locales/zh-CN'
import type { Tool } from '@/types/tool'

// 按 dotted key 从 messages 树取字符串。
function pick(messages: unknown, key: string): string {
  const val = key.split('.').reduce<unknown>((acc, k) => {
    return acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[k] : undefined
  }, messages)
  return typeof val === 'string' ? val : ''
}

// 预构建每个工具的双语 haystack（英 + 中的 name/desc + keywords）。
// 不依赖 query 或 locale，模块加载时构建一次，搜索时只做 token 匹配。
const haystacks = new Map<Tool, string>()
for (const tool of catalog) {
  const parts = [
    pick(en, tool.nameKey), pick(en, tool.descKey),
    pick(zhCN, tool.nameKey), pick(zhCN, tool.descKey),
    ...tool.keywords,
  ].map(s => s.toLowerCase())
  haystacks.set(tool, parts.join(''))
}

/**
 * 按自由文本和（可选）分类筛选 catalog。命中英/中两种语言的 name/description
 * 以及双语 keywords 数组。大小写不敏感，token 之间为 AND。
 */
export function useFuzzySearch(query: Ref<string>, category: Ref<string>) {
  return computed<Tool[]>(() => {
    const q = query.value.trim().toLowerCase()
    const tokens = q ? q.split(/\s+/).filter(Boolean) : []
    let pool = catalog
    if (category.value !== 'All') pool = pool.filter(t => t.category === category.value)
    if (tokens.length === 0) return pool
    return pool.filter(tool => {
      const haystack = haystacks.get(tool) ?? ''
      return tokens.every(tok => haystack.includes(tok))
    })
  })
}
