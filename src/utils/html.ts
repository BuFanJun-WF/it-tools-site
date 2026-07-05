/** 项目级共享的纯函数工具。 */

/** 转义 HTML 特殊字符，防止 v-html 渲染用户输入时产生 XSS。 */
export function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c)
}

/** 高亮文本中的查询串：先转义，再用 <mark> 包裹匹配项，结果可直接用于 v-html。 */
export function highlight(text: string, q?: string): string {
  const safe = escapeHtml(text)
  if (!q) return safe
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig')
  return safe.replace(re, '<mark>$1</mark>')
}
