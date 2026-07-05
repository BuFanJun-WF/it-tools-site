/* =========================================================================
   IT-Tools · Reactive store (favorites + theme + route)
   Lightweight pub/sub — no framework needed.
   ========================================================================= */

import { catalog } from "./catalog.js";

const FAV_KEY = "it-tools:favorites";
const THEME_KEY = "it-tools:theme";

function loadFavorites() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); } catch { return []; }
}
function loadTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return null; // follow OS
}

const state = {
  route: location.hash.slice(1) || "/",
  search: "",
  activeCategory: "All",
  favorites: loadFavorites(),
  theme: loadTheme(),
};

const listeners = new Set();
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit() { for (const fn of listeners) fn(state); }

export function getState() { return state; }

export function navigate(path) {
  if (state.route === path) return;
  state.route = path;
  if (location.hash.slice(1) !== path) location.hash = path;
  emit();
  // scroll content to top
  const c = document.querySelector(".content");
  if (c) c.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

export function setSearch(s) { state.search = s; emit(); }
export function setActiveCategory(c) { state.activeCategory = c; emit(); }

export function isFavorite(id) { return state.favorites.includes(id); }

export function toggleFavorite(id) {
  const i = state.favorites.indexOf(id);
  if (i === -1) state.favorites.push(id);
  else state.favorites.splice(i, 1);
  localStorage.setItem(FAV_KEY, JSON.stringify(state.favorites));
  emit();
}

export function setTheme(t) {
  state.theme = t;
  if (t === null) localStorage.removeItem(THEME_KEY);
  else localStorage.setItem(THEME_KEY, t);
  applyTheme();
  emit();
}

export function applyTheme() {
  const el = document.documentElement;
  if (state.theme === "light" || state.theme === "dark") {
    el.setAttribute("data-theme", state.theme);
  } else {
    el.removeAttribute("data-theme");
  }
}

// Sync on hash change (back/forward)
window.addEventListener("hashchange", () => {
  const r = location.hash.slice(1) || "/";
  if (state.route !== r) { state.route = r; emit(); }
});

// Favorites section as a synthetic category
export function favoriteTools() {
  return state.favorites
    .map(id => catalog.find(t => t.id === id))
    .filter(Boolean);
}
