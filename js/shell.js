/* =========================================================================
   IT-Tools · App shell renderer (sidebar, topbar, command palette)
   ========================================================================= */

import { icons, iconSVG, categoryMeta } from "./icons.js";
import { catalog, categories, toolsByCategory } from "./catalog.js";
import {
  getState, subscribe, navigate, setSearch, setActiveCategory,
  toggleFavorite, isFavorite, setTheme, applyTheme, favoriteTools,
} from "./store.js";

/* ---------------- helpers ---------------- */
function icon(name) { return icons[name] || icons.grid; }
function starHTML(id) {
  return isFavorite(id)
    ? `<span class="star active" data-fav="${id}">${icons.star}</span>`
    : `<span class="star" data-fav="${id}">${icons.starOutline}</span>`;
}

/* ---------------- sidebar ---------------- */
function renderSidebar() {
  const s = getState();
  const fav = favoriteTools();

  const sections = [];
  if (fav.length) {
    sections.push(`
      <div class="nav-section">
        <div class="nav-section-label">Favorites <span class="count">${fav.length}</span></div>
        ${fav.map(t => navItem(t, s)).join("")}
      </div>`);
  }
  for (const cat of categories) {
    const tools = toolsByCategory(cat);
    sections.push(`
      <div class="nav-section">
        <div class="nav-section-label">
          <span style="display:inline-flex;align-items:center;gap:7px;">
            ${iconSVG(categoryMeta[cat]?.icon || "grid", "ic")}
            ${cat}
          </span>
          <span class="count">${tools.length}</span>
        </div>
        ${tools.map(t => navItem(t, s)).join("")}
      </div>`);
  }

  return `
    <aside class="sidebar" id="sidebar">
      <div class="brand">
        <div class="brand-mark">${icons.logo}</div>
        <div class="brand-name">it<span>·</span>tools</div>
      </div>
      <div class="sidebar-nav" id="sidebar-nav">
        ${sections.join("")}
      </div>
      <div style="padding: var(--sp-3) var(--sp-5); border-top: 1px solid var(--border-soft); flex-shrink:0;">
        <a href="https://github.com/CorentinTh/it-tools" target="_blank" rel="noopener"
           style="display:flex;align-items:center;gap:8px;color:var(--muted);font-size:var(--fs-xs);">
          ${iconSVG("github")} <span>Inspired by CorentinTh/it-tools</span>
        </a>
      </div>
    </aside>`;
}

function navItem(t, s) {
  const active = s.route === t.path;
  return `<a class="nav-item ${active ? "active" : ""} ${isFavorite(t.id) ? "is-fav" : ""}"
             href="#${t.path}" data-path="${t.path}">
    <span class="ic">${icon(t.icon)}</span>
    <span class="label">${t.name}</span>
    <span class="star">${icons.star}</span>
  </a>`;
}

/* ---------------- topbar ---------------- */
function renderTopbar() {
  const s = getState();
  const themeIcon = s.theme === "dark" ? icons.sun : (s.theme === "light" ? icons.moon : icons.moon);
  return `
    <header class="topbar">
      <button class="menu-toggle" id="menu-toggle" aria-label="Toggle menu">${icons.menu}</button>
      <div class="topbar-search">
        <span class="ic-search">${icons.search}</span>
        <input id="global-search" type="search" placeholder="Search tools…"
               value="${escapeAttr(s.search)}" autocomplete="off" spellcheck="false">
        <span class="kbd">⌘K</span>
      </div>
      <div class="topbar-actions">
        <button class="icon-btn" id="home-btn" title="Home" aria-label="Home">${icons.grid}</button>
        <button class="icon-btn" id="theme-btn" title="Toggle theme" aria-label="Toggle theme">${themeIcon}</button>
        <a class="icon-btn" href="https://github.com/CorentinTh/it-tools" target="_blank" rel="noopener"
           title="Original project" aria-label="GitHub">${icons.github}</a>
      </div>
    </header>`;
}

function escapeAttr(s) { return String(s).replace(/"/g, "&quot;"); }

/* ---------------- mobile scrim ---------------- */
function renderScrim() {
  return `<div class="scrim" id="scrim"></div>`;
}

/* ---------------- mount / re-render ---------------- */
let mounted = false;
export function mountShell() {
  const app = document.getElementById("app");
  app.className = "app";
  app.innerHTML = renderSidebar() + renderScrim() + `
    <div class="main">
      ${renderTopbar()}
      <main class="content" id="content"></main>
    </div>
    <div id="palette-root"></div>
  `;
  applyTheme();
  bindShell();
  mounted = true;
}

function bindShell() {
  // Search
  const search = document.getElementById("global-search");
  search.addEventListener("input", (e) => {
    setSearch(e.target.value);
    if (getState().route !== "/") navigate("/");
    // open mobile sidebar? no.
  });

  // Home button
  document.getElementById("home-btn").addEventListener("click", () => navigate("/"));

  // Theme button
  document.getElementById("theme-btn").addEventListener("click", () => {
    const s = getState();
    // toggle based on resolved
    const resolved = s.theme ||
      (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    setTheme(resolved === "dark" ? "light" : "dark");
  });

  // Mobile menu
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("scrim");
  document.getElementById("menu-toggle").addEventListener("click", () => {
    sidebar.classList.toggle("open");
    scrim.classList.toggle("show");
  });
  scrim.addEventListener("click", () => {
    sidebar.classList.remove("open");
    scrim.classList.remove("show");
  });
  // Close mobile sidebar on navigation
  document.getElementById("sidebar").addEventListener("click", (e) => {
    const item = e.target.closest("[data-path]");
    if (item) {
      sidebar.classList.remove("open");
      scrim.classList.remove("show");
    }
    // favorite star click
    const star = e.target.closest("[data-fav]");
    if (star) {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(star.dataset.fav);
    }
  });

  // Command palette
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (getState().route !== "/") navigate("/");
      setTimeout(() => document.getElementById("global-search").focus(), 30);
    }
  });

  // Re-render shell parts on state change (favorites, theme)
  subscribe(() => {
    if (!mounted) return;
    // Sidebar reflects fav state + active
    document.getElementById("sidebar-nav").innerHTML = rebuildSidebarNav();
    // Topbar theme icon
    const tb = document.getElementById("theme-btn");
    const s = getState();
    const ti = s.theme === "dark" ? icons.sun : icons.moon;
    tb.innerHTML = ti;
  });
}

function rebuildSidebarNav() {
  const s = getState();
  const fav = favoriteTools();
  const sections = [];
  if (fav.length) {
    sections.push(`<div class="nav-section">
      <div class="nav-section-label">Favorites <span class="count">${fav.length}</span></div>
      ${fav.map(t => navItem(t, s)).join("")}
    </div>`);
  }
  for (const cat of categories) {
    const tools = toolsByCategory(cat);
    sections.push(`<div class="nav-section">
      <div class="nav-section-label">
        <span style="display:inline-flex;align-items:center;gap:7px;">${iconSVG(categoryMeta[cat]?.icon || "grid", "ic")} ${cat}</span>
        <span class="count">${tools.length}</span>
      </div>
      ${tools.map(t => navItem(t, s)).join("")}
    </div>`);
  }
  return sections.join("");
}

export function renderContent(inner) {
  const c = document.getElementById("content");
  if (c) c.innerHTML = inner;
}
