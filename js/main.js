/* =========================================================================
   IT-Tools · Application entry
   Wires shell + router + tool registry
   ========================================================================= */

import { mountShell, renderContent } from "./shell.js";
import { getState, subscribe } from "./store.js";
import { renderHome, bindHome } from "./views/home.js";
import { renderToolView, bindToolView } from "./views/tool.js";
import { findTool } from "./catalog.js";

// ---- Register every implemented tool ----
import "./tools/index.js";

mountShell();

function route() {
  const s = getState();
  const route = s.route || "/";

  // Home
  if (route === "/" || route === "") {
    renderContent(renderHome());
    bindHome();
    return;
  }

  // Tool page
  if (findTool(route)) {
    renderContent(renderToolView(route));
    bindToolView(route);
    return;
  }

  // Unknown
  renderContent(`<div class="empty-state" style="padding: var(--sp-16);">
    <h3>404 — page not found</h3>
    <p>That route doesn't exist.</p>
    <a class="btn btn-primary" style="margin-top: var(--sp-4);" href="#/">Back home</a>
  </div>`);
}

// initial
route();

// re-render on every state change
subscribe(route);

// Scroll active sidebar item into view on route
subscribe(() => {
  const active = document.querySelector(".nav-item.active");
  if (active) active.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
});
