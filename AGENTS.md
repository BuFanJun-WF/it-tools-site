# AGENTS.md

Guidance for AI coding agents (and humans pairing with them) working on
**[it-tools-site](https://github.com/BuFanJun-WF/it-tools-site)**.

This file complements [`README.md`](./README.md) / [`README.zh-CN.md`](./README.zh-CN.md):
the READMEs describe *what* the project is; this file describes *how to work on it
without breaking the conventions the codebase already follows*.

---

## 1. Project at a glance

A re-imagined, **100% client-side** developer toolbox — Vue 3 + TypeScript + Vite,
bilingual (English / 简体中文), warm "Builder SaaS" design system. A catalogue of
62 tools across 10 categories; 17 are fully implemented, the rest show a friendly
"Coming soon" placeholder but still appear in search, navigation and favorites.

- **Runtime**: all tool logic runs in the browser. No backend, no network calls.
  Treat anything that phones home as a bug.
- **Deploy base path**: `base: '/tools/'` in `vite.config.ts` (hosted at
  `https://bufanjun.com/tools/`). Hash routing makes this transparent — do not
  switch to history mode without revisiting deployment.
- **Source of truth for the tool list**: `src/data/catalog.ts`. Every tool,
  implemented or not, has an entry here.

---

## 2. Common commands

```bash
npm install
npm run dev          # dev server → http://localhost:5173/ (base path /tools/)
npm run build        # vue-tsc --noEmit && vite build → dist/
npm run preview      # preview the production build
npm run typecheck    # vue-tsc --noEmit (CI-fast type check, no bundle)
```

There is no test runner and no linter wired up — **`npm run build` (or
`npm run typecheck`) is the only automated gate.** Run it before declaring a task
done. TypeScript is `strict`, with `noUnusedLocals`, `noUnusedParameters`,
`noImplicitOverride` all on — dead imports/vars will fail the build.

---

## 3. Architecture map

```
src/
├── main.ts                 app entry: Pinia → Router → i18n → mount
├── App.vue                 root shell
├── router/index.ts         hash history: / /hall /about /blog /feedback /:toolId + 404
├── i18n/
│   ├── index.ts            createI18n, locale detect/persist
│   └── locales/{en,zh-CN}.ts   ALL user-visible strings (bilingual)
├── stores/                 Pinia: favorites, recent, theme, ui, locale
├── styles/                 tokens.css → fonts.css → base.css → transitions.css (order matters)
├── composables/            useClipboard, useFuzzySearch, useRecentTools, useFavoriteTools, useToolMeta
├── data/
│   ├── catalog.ts          THE tool list (62 entries) + CATEGORIES + findTool()
│   └── icons.ts            SVG icon map keyed by name
├── types/tool.ts           Tool, ToolCategory, CategoryMeta, qrious shim
├── components/
│   ├── shell/              MarketLayout, MarketHeader, SiteFooter, LangSwitch, SimplePage
│   ├── home/               HomePage, ToolCard
│   ├── hall/               HallPage
│   ├── tool/               ToolView, ToolHeader, ComingSoon
│   ├── ui/                 design-system primitives (see §6)
│   └── NotFound.vue
└── tools/
    ├── index.ts            toolRegistry: { id → lazy SFC import }
    └── implementations/    one SFC per implemented tool, grouped by category
```

### Request lifecycle (how a tool renders)

1. `vue-router` (hash mode) matches `/:toolId` → `ToolView.vue`.
2. `ToolView` calls `findTool(id)` against `catalog.ts`.
   - Unknown id → `<NotFound />`.
3. If `tool.implemented && toolRegistry[id]` → render the lazy SFC
   (`defineAsyncComponent`, cached per-instance; `onError` clears the cache so a
   transient chunk load failure is recoverable without a full reload).
4. Otherwise → `<ComingSoon :tool />`.
5. Implemented tools push their id into the `recent` Pinia store on visit.

---

## 4. Conventions that matter

### 4.1 Adding / editing a tool

**Catalog first.** Every tool is an entry in `src/data/catalog.ts`:

```ts
{
  id: 'hash-text',                 // stable id == route key == i18n key segment
  path: '/hash-text',
  category: 'Crypto',              // must be one of CATEGORIES
  icon: 'hash',                    // key into src/data/icons.ts
  keywords: ['hash', 'sha256', '哈希', '摘要'],   // EN + ZH, drives bilingual search
  nameKey: 'tools.hash-text.name',
  descKey: 'tools.hash-text.description',
  implemented: true,               // false → renders <ComingSoon />
  hot: true,                       // optional badge
  isNew: false,                    // optional badge
}
```

The `id` appears in three places that must stay in sync:
1. the catalog entry's `id`,
2. the i18n keys `tools.<id>.name` / `tools.<id>.description` in **both**
   `src/i18n/locales/en.ts` and `src/i18n/locales/zh-CN.ts`,
3. (if implemented) the key in `toolRegistry` (`src/tools/index.ts`).

If you implement a tool, set `implemented: true` **and** register the SFC in
`toolRegistry` in the same change. Leaving `implemented: true` without a
registry entry renders `<ComingSoon />` silently — that is a bug.

### 4.2 Implementing a tool SFC

- One file per tool, under `src/tools/implementations/<category>/`, named
  `PascalCase.vue` (e.g. `HashText.vue`). Category folder names match the
  `CATEGORIES` list, lowercased and kebab-able (crypto, converters, web,
  images, development, network, math, measurement, text, data).
- Use `<script setup lang="ts">`. Pull UI primitives from `@/components/ui/*`
  (`FieldLabel`, `TextArea`, `TextInput`, `SelectInput`, `OutputBox`,
  `CopyButton`, `Stack`, `BaseButton`, …) — **do not** reinvent form controls
  with raw `<input>`/`<textarea>`, or you break the design system.
- **All user-visible text goes through `t()`** from `useI18n()`. Tool-internal
  labels live under `impl.<id>.*` keys in both locale files. Never hard-code
  English or Chinese strings in the template.
- Compute on the client. Reach for `crypto.subtle`, `TextEncoder`, etc. before
  adding a dependency. Optional runtime libs (`js-sha3`, `qrious`) are already
  wired — only add a new dep if the tool genuinely needs it, and keep it a
  lazy-loaded runtime dep, not a global one.
- Scoped `<style>` only; reference design tokens (`var(--sp-3)`,
  `var(--fs-sm)`, `var(--muted)`, …) rather than magic numbers or hex colors.

### 4.3 Internationalization

- Two locales: `en` and `zh-CN` (see `src/i18n/index.ts`). `legacy: false`,
  Composition API — use `const { t } = useI18n()` in setup.
- When you add a string to one locale file, **add it to the other in the same
  change**. A missing key falls back silently to the key path itself, which
  ships a broken UI in one language.
- Search (`useFuzzySearch`) pre-builds a bilingual haystack from both locales'
  name/description **plus** each tool's `keywords` array. Add keywords in both
  languages to `catalog.ts` so users can type either language.
- Locale detection: persisted `localStorage['it-tools:lang']` → browser nav
  language → `en`. Don't reorder this without reason.

### 4.4 State (Pinia)

- `favorites`, `recent`, `theme`, `ui`, `locale`. Each persists to
  `localStorage` under an `it-tools:*` key; persist calls are wrapped in
  `try/catch` (private-mode / quota) — keep that pattern.
- Keep store logic pure and side-effect-free except for the explicit
  `persist()` helper. Components subscribe via the standard Pinia composable.

### 4.5 Styling & design system

- Tokens are declared once in `src/styles/tokens.css` (type scale, spacing
  4px/8px grid, radius, color, motion). **Use the tokens**, not literals.
- Global style import order in `main.ts` is load-bearing
  (tokens → fonts → base → transitions) — don't reorder.
- Dark/light theming is token-driven and toggled by the `theme` store. New
  colors should be added as tokens that have both modes, not as one-off values.

### 4.6 TypeScript

- `@/*` alias → `src/*` (configured in both `vite.config.ts` and
  `tsconfig.json`). Prefer `@/...` imports over relative paths.
- `strict` mode is on; the build fails on unused locals/params. If a symbol
  is genuinely unused, remove it rather than `// eslint-disable`-ing.
- Type-only imports: `import type { Tool } from '@/types/tool'` (verbatim
  module syntax considerations).

### 4.7 Comments

The existing code uses concise Chinese comments for *why* (e.g. the cache +
`onError` recovery logic in `ToolView.vue`) and English for *what*. Match the
surrounding file's density and language — don't strip existing comments, don't
add redundant ones.

---

## 5. Routing & deployment notes

- Hash history (`createWebHashHistory`) — deep links look like
  `/#/hash-text` and survive the `/tools/` sub-path deploy without server
  config. Do not switch to history mode casually.
- Static asset base is `/tools/` (`vite.config.ts` `base`). Any path baked into
  `public/` or referenced absolutely must respect this prefix.
- No server, no SSR. Everything ships as static assets in `dist/`.

---

## 6. UI primitives cheat sheet

Before writing new markup, check `src/components/ui/`:

| Primitive | Use for |
|---|---|
| `FieldLabel` | label above any input |
| `TextInput` / `TextArea` / `SelectInput` | form controls (token-styled) |
| `BaseButton` / `IconBtn` | actions |
| `CopyButton` | copy-to-clipboard (uses `useClipboard`) |
| `OutputBox` | read-only result display |
| `Stack` / `Row` / `Grid2` | layout (flex helpers) |
| `AppIcon` | render an icon from `data/icons.ts` by key |
| `TagBadge` / `NoticeBox` / `KvList` | small presentational bits |

Reusing these keeps the visual language consistent and avoids one-off styling.

---

## 7. Definition of done

A change is ready to commit when:

- [ ] `npm run build` passes (this also runs `vue-tsc --noEmit`).
- [ ] New/edited tools have **both** catalog entry **and** (if implemented)
      registry entry + SFC, with `implemented` set correctly.
- [ ] Every new user-visible string exists in **both** `en.ts` and `zh-CN.ts`.
- [ ] No new runtime dependency unless justified; if added, listed in
      `package.json` and only imported by the tool that needs it.
- [ ] No secrets, no network calls, no analytics — client-side only.
- [ ] Commit message follows the existing Conventional Commits style
      (`feat:`, `fix:`, `refactor:`, `style:`, `docs:` …); recent history uses
      bilingual summaries — match the repo's tone.

---

## 8. Things to avoid

- Don't introduce a UI framework (Naive UI, Element, Vuetify, …). The project
  intentionally ships self-built primitives.
- Don't add a backend, service worker, or anything that persists data outside
  `localStorage`.
- Don't switch routing/history mode or change the `base` path without
  coordinating with deployment.
- Don't bypass the i18n layer with hard-coded strings in either language.
- Don't edit one locale file without the other.
- Don't suppress type errors — fix them, or flag the design issue.
