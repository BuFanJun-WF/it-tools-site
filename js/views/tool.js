/* =========================================================================
   IT-Tools · Tool view container + registry
   ========================================================================= */

import { icons } from "../icons.js";
import { findTool } from "../catalog.js";
import { navigate, isFavorite, toggleFavorite } from "../store.js";
import { iconSVG } from "../icons.js";

const registry = new Map();
export function registerTool(id, mod) { registry.set(id, mod); }
export function getToolModule(id) { return registry.get(id); }

export function renderToolView(path) {
  const tool = findTool(path);
  if (!tool) return notFound();

  const fav = isFavorite(tool.id);
  const header = `
    <div class="tool-header">
      <div class="ic-wrap">${icons[tool.icon] || icons.grid}</div>
      <div style="min-width:0;flex:1;">
        <h1>${tool.name}</h1>
        <div class="desc">${tool.description}</div>
        <div class="cat"><span class="tag tag-accent">${tool.category}</span></div>
      </div>
      <button class="icon-btn tool-fav-btn ${fav ? "active" : ""}" id="tool-fav" title="Add to favorites" aria-label="Toggle favorite">
        ${fav ? icons.star : icons.starOutline}
      </button>
    </div>`;

  let body;
  if (tool.impl && registry.has(tool.id)) {
    body = `<div class="tool-body" id="tool-body"></div>`;
  } else {
    body = comingSoon(tool);
  }

  return header + body;
}

export function bindToolView(path) {
  const tool = findTool(path);
  if (!tool) return;

  const favBtn = document.getElementById("tool-fav");
  if (favBtn) {
    favBtn.addEventListener("click", () => {
      toggleFavorite(tool.id);
      const nowFav = isFavorite(tool.id);
      favBtn.classList.toggle("active", nowFav);
      favBtn.innerHTML = nowFav ? icons.star : icons.starOutline;
    });
  }

  if (tool.impl && registry.has(tool.id)) {
    const mod = registry.get(tool.id);
    const body = document.getElementById("tool-body");
    if (body && typeof mod.mount === "function") {
      try {
        mod.mount(body);
      } catch (err) {
        body.innerHTML = `<div class="notice">${icons.alert}<div>Couldn't render this tool: <code>${err.message}</code></div></div>`;
        console.error(err);
      }
    }
  }
}

function comingSoon(tool) {
  return `<div class="tool-body">
    <div class="notice">${icons.alert}<div><strong>${tool.name}</strong> is catalogued, but its interactive implementation is not yet wired into this redesigned build. Its metadata, search and favorites still work.</div></div>
    <div style="margin-top: var(--sp-6); display:flex; gap: var(--sp-3); flex-wrap:wrap;">
      <span class="tag">id: ${tool.id}</span>
      <span class="tag">category: ${tool.category}</span>
      ${tool.keywords.slice(0,6).map(k => `<span class="tag">${k}</span>`).join("")}
    </div>
  </div>`;
}

function notFound() {
  return `<div class="empty-state" style="padding: var(--sp-16);">
    ${icons.search}
    <h3>404 — page not found</h3>
    <p>The tool you're looking for doesn't exist here.</p>
    <button class="btn btn-primary" style="margin-top: var(--sp-4);" onclick="location.hash='/'">Back home</button>
  </div>`;
}
