/* =========================================================================
   IT-Tools · Home view (hero, categories, tool grid)
   ========================================================================= */

import { icons, iconSVG, categoryMeta } from "../icons.js";
import { catalog, categories, toolsByCategory } from "../catalog.js";
import { getState, navigate, setSearch, setActiveCategory, toggleFavorite, isFavorite, favoriteTools } from "../store.js";

function highlight(text, q) {
  if (!q) return text;
  const escaped = text.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  return escaped.replace(re, "<mark>$1</mark>");
}

function toolCard(t, q) {
  const fav = isFavorite(t.id);
  return `
    <article class="tool-card" data-path="${t.path}" data-id="${t.id}">
      <div class="top">
        <div class="ic">${icons[t.icon] || icons.grid}</div>
        <button class="star ${fav ? "active" : ""}" data-fav="${t.id}" aria-label="Favorite">${fav ? icons.star : icons.starOutline}</button>
      </div>
      <div>
        <div class="name">${highlight(t.name, q)}</div>
        <div class="desc">${highlight(t.description, q)}</div>
      </div>
      <div class="meta">
        <span class="cat-tag">${t.category}</span>
      </div>
    </article>`;
}

export function renderHome() {
  const s = getState();
  const q = s.search.trim().toLowerCase();

  // Category chips
  const chips = [`All`, ...categories];
  const chipHTML = chips.map(c => {
    const active = s.activeCategory === c;
    const count = c === "All" ? catalog.length : toolsByCategory(c).length;
    const ic = c === "All" ? "grid" : (categoryMeta[c]?.icon || "grid");
    return `<button class="cat-chip ${active ? "active" : ""}" data-cat="${c}">
      ${iconSVG(ic, "ic")} ${c} <span class="n">${count}</span>
    </button>`;
  }).join("");

  // Tool list
  let tools;
  if (q) {
    tools = catalog.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some(k => k.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q));
  } else {
    tools = s.activeCategory === "All" ? catalog : toolsByCategory(s.activeCategory);
  }

  const gridHTML = tools.length
    ? `<div class="tool-grid">${tools.map(t => toolCard(t, q)).join("")}</div>`
    : emptyState(q);

  // Hero only on default view
  const hero = (s.activeCategory === "All" && !q) ? `
    <section class="home-hero">
      <span class="eyebrow"><span class="dot"></span> All client-side · No data leaves your browser</span>
      <h1>A curated box of <span class="accent">developer tools</span>, one click away.</h1>
      <p class="lead">A re-imagined take on the beloved <strong>it-tools</strong> — ${catalog.length} hand-built utilities for crypto, conversion, web, network and everyday text work. Fast, offline-capable, with an interface designed to disappear so the work can take the stage.</p>
      <div class="hero-stats">
        <div class="hero-stat"><div class="num">${catalog.length}<span class="accent">.</span></div><div class="lbl">Working tools</div></div>
        <div class="hero-stat"><div class="num">${categories.length}</div><div class="lbl">Categories</div></div>
        <div class="hero-stat"><div class="num">0<span class="accent">kb</span></div><div class="lbl">Server calls</div></div>
        <div class="hero-stat"><div class="num">100<span class="accent">%</span></div><div class="lbl">Runs in-browser</div></div>
      </div>
    </section>` : "";

  // Section title for grid
  let sectionTitle = "";
  if (q) {
    sectionTitle = `<div class="section-head"><h2>Results for “${escapeHtml(s.search)}”</h2><span class="count">${tools.length} tool${tools.length === 1 ? "" : "s"}</span></div>`;
  } else if (s.activeCategory !== "All") {
    sectionTitle = `<div class="section-head"><h2>${s.activeCategory}</h2><span class="count">${tools.length} tools</span></div>`;
  }

  // Favorites row (only on All, no search)
  const fav = favoriteTools();
  const favHTML = (s.activeCategory === "All" && !q && fav.length) ? `
    <div class="section-head"><h2>Your favorites</h2><span class="count">${fav.length}</span></div>
    <div class="tool-grid">${fav.map(t => toolCard(t, "")).join("")}</div>` : "";

  return `
    ${hero}
    ${favHTML}
    <div class="cat-bar" id="cat-bar">${chipHTML}</div>
    ${sectionTitle}
    ${gridHTML}
  `;
}

function emptyState(q) {
  return `<div class="empty-state">
    ${icons.search}
    <h3>No tools found${q ? ` for “${escapeHtml(q)}”` : ""}</h3>
    <p>Try a different keyword, or browse by category.</p>
  </div>`;
}
function escapeHtml(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

export function bindHome() {
  // Category chips
  document.querySelectorAll(".cat-chip").forEach(btn => {
    btn.addEventListener("click", () => setActiveCategory(btn.dataset.cat));
  });
  // Tool cards
  document.querySelectorAll(".tool-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
    card.addEventListener("click", (e) => {
      if (e.target.closest("[data-fav]")) return;
      navigate(card.dataset.path);
    });
  });
  // Favorite stars
  document.querySelectorAll("[data-fav]").forEach(star => {
    star.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(star.dataset.fav);
    });
  });
}
