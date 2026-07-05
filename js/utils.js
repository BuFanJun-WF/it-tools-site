/* =========================================================================
   IT-Tools · Utilities: clipboard, escape, debounce, formatting
   ========================================================================= */

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch { document.body.removeChild(ta); return false; }
    document.body.removeChild(ta);
    return true;
  }
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function debounce(fn, ms = 200) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}

// A safe JSON parse that throws a friendly Error
export function parseJSON(s) {
  if (!s.trim()) throw new Error("Input is empty");
  return JSON.parse(s);
}

// Make a button reflect a "copied" state for a moment
export function flashCopy(btn) {
  if (!btn) return;
  const original = btn.innerHTML;
  btn.classList.add("copied");
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied`;
  setTimeout(() => {
    btn.classList.remove("copied");
    btn.innerHTML = original;
  }, 1300);
}

// Build a "Copy" button element
export function makeCopyButton(getText, label = "Copy") {
  const btn = document.createElement("button");
  btn.className = "copy-btn";
  btn.type = "button";
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> ${label}`;
  btn.addEventListener("click", async () => {
    const text = typeof getText === "function" ? getText() : getText;
    if (!text) return;
    const ok = await copyText(text);
    if (ok) flashCopy(btn);
  });
  return btn;
}

export function download(filename, content, mime = "text/plain") {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
