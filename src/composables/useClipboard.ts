import { ref } from 'vue'

/** Copy text to the clipboard with a transient "copied" flag. */
export function useClipboard(timeout = 1300) {
  const copied = ref(false)
  let timer: number | undefined

  async function copy(text: string | (() => string)): Promise<boolean> {
    const value = typeof text === 'function' ? text() : text
    if (!value) return false
    let ok = false
    try {
      await navigator.clipboard.writeText(value)
      ok = true
    } catch {
      // Fallback for insecure contexts
      const ta = document.createElement('textarea')
      ta.value = value
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
        ok = true
      } catch {
        ok = false
      }
      document.body.removeChild(ta)
    }
    if (ok) {
      copied.value = true
      window.clearTimeout(timer)
      timer = window.setTimeout(() => (copied.value = false), timeout)
    }
    return ok
  }

  function reset() {
    copied.value = false
    window.clearTimeout(timer)
  }

  return { copied, copy, reset }
}
