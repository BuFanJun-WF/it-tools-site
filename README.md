# it·tools — a re-imagined developer toolbox

Source: **[BuFanJun-WF/it-tools-site](https://github.com/BuFanJun-WF/it-tools-site)**.
Same mission — a handy, fully client-side collection of developer utilities — rebuilt with
**Vue 3 + TypeScript + Vite**, an original warm "Builder SaaS" design system, a
marketplace-style layout, and full **English / 中文** bilingual support.

> All tool logic runs **100% in the browser**. No backend, no network calls, no data
> ever leaves the client.

---

## What's different from the original

| Aspect | Original it-tools | This build |
|---|---|---|
| Framework | Vue 3 + Naive UI | **Vue 3 + TypeScript (self-built components)** |
| Build | Vite / pnpm | **Vite** |
| i18n | English only | **English + 简体中文, live toggle** |
| Design system | Naive defaults | Custom warm "Builder SaaS" tokens (molten orange) |
| Layout | Sidebar shell | **Marketplace-style top header + footer, no sidebar** |
| State | Pinia | **Pinia + @vueuse/core** |
| Routing | vue-router | **vue-router (hash mode, `/tools/` sub-path)** |
| Components | Naive UI | **Self-built (AppIcon, CopyButton, OutputBox, …)** |

---

## Quick start

```bash
npm install
npm run dev      # → http://localhost:5173/tools/   (base path is /tools/)
```

```bash
npm run build    # vue-tsc --noEmit && vite build → dist/
npm run preview  # preview the production build
npm run typecheck# vue-tsc --noEmit  (CI-fast type check)
```

> **No test runner or linter is wired up.** `npm run build` (which includes
> `vue-tsc --noEmit` under strict mode) is the only automated gate — run it
> before considering work done. TypeScript is `strict` with `noUnusedLocals`
> and `noUnusedParameters`, so dead imports/vars fail the build.

---

## The tools

**62 tools across 10 categories** are catalogued. **17 are fully implemented** in
this build; the rest show a friendly "Coming soon" placeholder but still appear in
search, navigation, favorites and recents.

### Implemented (17)

| Category | Tools |
|---|---|
| **Crypto** | Hash text (SHA family + SHA-3), UUID generator |
| **Converter** | Base64 string, JSON prettify, Date-time converter |
| **Web** | JWT parser, HTTP status codes, JSON diff |
| **Images & Videos** | QR code generator |
| **Development** | Regex tester, Crontab generator, Chmod calculator |
| **Network** | IPv4 subnet calculator |
| **Math** | Math evaluator |
| **Measurement** | Temperature converter |
| **Text** | Emoji picker |
| **Data** | IBAN validator |

### Badges in the catalog

- **`hot`** (7) — high-frequency tools, surfaced as "Quick access" chips on the home
  page: `uuid-generator`, `base64-string-converter`, `json-prettify`,
  `date-time-converter`, `jwt-parser`, `qrcode-generator`, `regex-tester`.
- **`isNew`** (2) — recently shipped: `json-diff`, `iban-validator-and-parser`.

> The single source of truth for the tool list is `src/data/catalog.ts`. Each tool
> entry's `id` must stay in sync with its i18n keys (`tools.<id>.name` /
> `tools.<id>.description`) and — if implemented — its registry entry in
> `src/tools/index.ts`.

---

## Features

- **🔍 Bilingual search** — fuzzy match across name, description and keywords in
  *both* locales simultaneously (type EN or 中文). Tokens are AND-ed,
  case-insensitive. `⌘K` / `Ctrl+K` focuses the global search.
- **⭐ Favorites** — star any tool; persisted in `localStorage` (`it-tools:favorites`).
- **🕑 Recents** — implemented tools you visit are tracked
  (`localStorage` `it-tools:recent`).
- **🌗 Dark / light theme** — respects OS preference, manual toggle persisted
  (`it-tools:theme`).
- **🌐 Language toggle** — English / 简体中文, persisted (`it-tools:lang`);
  auto-detects browser language on first visit.
- **🏠 Marketplace home** — hero with live search + quick-access chips, brand strip,
  featured/recent/favorites rails, category showcase, "why" panel.
- **🏛 Hall / Tool / 404 pages** — dedicated browse page with category tabs + counts,
  per-tool page, friendly not-found.
- **🔗 Hash routing** — deep-linkable, back/forward works, refresh-safe under the
  `/tools/` sub-path with zero server config.
- **⚡ Lazy-loaded tools** — each implemented tool is its own async chunk, with
  in-instance caching + `onError` recovery so a transient chunk failure doesn't
  require a full reload.
- **📱 Responsive** — fluid spacing/type at the `920px` and `560px` breakpoints.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Vue 3.5 (`<script setup lang="ts">`) |
| Language | TypeScript 5 (`strict`) |
| Build | Vite 5 |
| Router | vue-router 4 (hash history) |
| State | Pinia (favorites · recent · theme · ui · locale) |
| i18n | vue-i18n 9 (Composition API, `legacy: false`) |
| Utilities | @vueuse/core |
| Fonts | @fontsource-variable (Space Grotesk, Hanken Grotesk) + JetBrains Mono |

### Optional runtime libraries (only loaded by the tools that need them)

- `js-sha3` — SHA-3 hashing (hash-text tool)
- `qrious` — QR code rendering (qrcode-generator tool)

---

## Design system

Declared up-front in `src/styles/tokens.css`:

- **School**: Modern tool / Builder SaaS, warm variant (Linear / Raycast lineage)
- **Palette**: dark `#100f0d` bg · molten orange `#ff6b35` accent · amber `#f5a623` secondary
- **Type**: Space Grotesk (display) · Hanken Grotesk (body) · JetBrains Mono (code)
- **Spacing**: 4px base / 8px grid (`--sp-1 … --sp-16`)
- **Radius**: 6 / 8 / 12 / 20px hierarchical (`--r-sm/md/lg/xl/pill`)
- **Motion**: 120 / 180 / 320ms, `cubic-bezier(0.2, 0.7, 0.2, 1)`

Global style import order in `main.ts` is load-bearing:
**tokens → fonts → base → transitions**.

All UI primitives live in `src/components/ui/` — `FieldLabel`, `TextInput`,
`TextArea`, `SelectInput`, `OutputBox`, `CopyButton`, `BaseButton`, `IconBtn`,
`Stack`, `Row`, `Grid2`, `AppIcon`, `TagBadge`, `NoticeBox`, `KvList`. Reuse them;
don't reinvent form controls with raw `<input>`/`<textarea>`.

---

## Internationalization

Every user-visible string flows through [`vue-i18n`](https://vue-i18n.nuxtjs.org/).
Locale files live in `src/i18n/locales/{en,zh-CN}.ts`. Tool names and descriptions
are keyed (`tools.<id>.name`, `tools.<id>.description`); in-tool labels live under
`impl.<id>.*`. Both resolve at render time, so the whole UI flips language
instantly without a reload.

The fuzzy-search composable (`src/composables/useFuzzySearch.ts`) pre-builds a
bilingual haystack per tool — both locales' name/description **plus** each tool's
`keywords` array — once at module load, so a query typed in either language matches.

**When you add a string, add it to *both* locale files in the same change** —
missing keys fall back silently to the key path and ship a broken UI.

---

## File layout

```
it-tools-site/
├── index.html
├── package.json
├── vite.config.ts / tsconfig*.json / env.d.ts
├── public/favicon.svg
└── src/
    ├── main.ts                       ← app entry: Pinia + Router + i18n + global styles
    ├── App.vue                       ← mounts <MarketLayout />
    ├── router/index.ts               ← / /hall /about /blog /feedback /:toolId + 404 (hash)
    ├── i18n/
    │   ├── index.ts                  ← createI18n + locale detect/persist
    │   └── locales/{en.ts, zh-CN.ts} ← bilingual strings
    ├── stores/                       ← Pinia: favorites, recent, theme, ui, locale
    ├── styles/                       ← tokens.css, fonts.css, base.css, transitions.css
    ├── composables/                  ← useClipboard, useToolMeta, useFuzzySearch,
    │                                   useFavoriteTools, useRecentTools
    ├── data/
    │   ├── catalog.ts                ← 62 tools, CATEGORIES, findTool(), countByCategory
    │   └── icons.ts                  ← 79 inline SVG icons (key → markup)
    ├── types/tool.ts                 ← Tool, ToolCategory, CategoryMeta, qrious shim
    ├── components/
    │   ├── shell/                    ← MarketLayout, MarketHeader, SiteFooter, LangSwitch, SimplePage
    │   ├── home/                     ← HomePage, ToolCard
    │   ├── hall/                     ← HallPage (browse + category tabs + search)
    │   ├── tool/                     ← ToolView, ToolHeader, ComingSoon
    │   ├── ui/                       ← design-system primitives
    │   └── NotFound.vue
    └── tools/
        ├── index.ts                  ← toolRegistry: { id → lazy SFC import }
        └── implementations/          ← one SFC per implemented tool, grouped by category
```

### Request lifecycle (how a tool renders)

1. `vue-router` (hash mode) matches `/:toolId` → `ToolView.vue`.
2. `ToolView` calls `findTool(id)` against `catalog.ts`; unknown id → `<NotFound />`.
3. If `tool.implemented && toolRegistry[id]` → render the lazy SFC
   (`defineAsyncComponent`, cached per-instance; `onError` clears the cache).
4. Otherwise → `<ComingSoon :tool />`.
5. Implemented tools push their id into the `recent` store on visit.

---

## Working in this repo

Contributing pointers (the full guide for AI agents lives in
[`AGENTS.md`](./AGENTS.md)):

- **Adding a tool**: add a catalog entry → add `tools.<id>.*` keys to *both*
  locale files → (if implemented) drop the SFC under
  `src/tools/implementations/<category>/` and register it in `toolRegistry`.
- **Strings**: always via `t()` from `useI18n()`; never hard-code EN or ZH in
  templates.
- **Styling**: use the design tokens (`var(--sp-3)`, `var(--fs-sm)`, …), scoped
  `<style>` only.
- **TypeScript**: prefer the `@/*` alias; don't suppress type errors — fix them.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `refactor:`, `style:`,
  `docs:`).

---

## Credits

- This front-end: original work, designed and built from scratch — **[BuFanJun-WF/it-tools-site](https://github.com/BuFanJun-WF/it-tools-site)**

---

🌐 **[中文说明](./README.zh-CN.md)**
