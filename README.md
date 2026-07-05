# it·tools — a re-imagined developer toolbox

A redesigned take on the beloved **[it-tools](https://github.com/CorentinTh/it-tools)** by CorentinTh.
Same mission — a handy, fully client-side collection of developer utilities — rebuilt with
**Vue 3 + TypeScript + Vite**, an original warm "Builder SaaS" design system, and full
**English / 中文** bilingual support.

## What's different from the original

| Aspect | Original it-tools | This build |
|---|---|---|
| Framework | Vue 3 + Naive UI | **Vue 3 + TypeScript (self-built components)** |
| Build | Vite / pnpm | **Vite** |
| i18n | English only | **English + 简体中文, live toggle** |
| Design system | Naive defaults | Custom warm "Builder SaaS" tokens (molten orange) |
| State | Pinia | **Pinia + @vueuse/core** |
| Routing | vue-router | **vue-router (hash mode)** |
| Components | Naive UI | **Self-built (AppIcon, CopyButton, OutputBox, …)** |

All tool logic runs **100% in the browser**. No data leaves the client.

## Run it

```bash
npm install
npm run dev      # → http://localhost:5173/
```

```bash
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
```

## The tools

**62 tools across 10 categories** are catalogued. **17 are fully implemented** in this
build; the rest show a friendly "Coming soon" placeholder but still appear in search,
navigation and favorites.

**Implemented (17):**

- **Crypto** — Hash text (SHA family + SHA-3), UUID generator
- **Converter** — Base64 string, JSON prettify, Date-time converter
- **Web** — JWT parser, HTTP status codes, JSON diff
- **Images & Videos** — QR code generator
- **Development** — Regex tester, Crontab generator, Chmod calculator
- **Network** — IPv4 subnet calculator
- **Math** — Math evaluator
- **Measurement** — Temperature converter
- **Text** — Emoji picker
- **Data** — IBAN validator

## Features

- **🔍 Search** — fuzzy across name, description, keywords (bilingual — type EN or 中文); `⌘K` / `Ctrl+K` to focus
- **⭐ Favorites** — star any tool; persisted in `localStorage`
- **🌗 Dark / light theme** — respects OS preference, manual toggle persisted
- **🌐 Language toggle** — English / 简体中文, persisted; auto-detects browser language on first visit
- **📱 Responsive** — sidebar collapses to a drawer below 920px
- **🔗 Hash routing** — deep-linkable, back/forward works, refresh-safe
- **⚡ Lazy-loaded tools** — each tool is its own async chunk

## Design system

Declared up-front (see `src/styles/tokens.css`):

- **School**: Modern tool / Builder SaaS, warm variant (Linear / Raycast lineage)
- **Palette**: dark `#100f0d` bg · molten orange `#ff6b35` accent · amber `#f5a623` secondary
- **Type**: Space Grotesk (display) · Hanken Grotesk (body) · JetBrains Mono (code)
- **Spacing**: 4px base / 8px grid
- **Radius**: 6 / 8 / 12 / 20px hierarchical
- **Motion**: 120 / 180 / 320ms, `cubic-bezier(0.2, 0.7, 0.2, 1)`

## Internationalization

Every user-visible string flows through [`vue-i18n`](https://vue-i18n.nuxtjs.org/). Locale
files live in `src/i18n/locales/{en,zh-CN}.ts`. Tool names and descriptions are keyed
(`tools.<id>.name`, `tools.<id>.description`) and resolved at render time, so the whole
UI — sidebar, cards, tool headers, in-tool labels — flips language instantly without a
reload. Search matches both locales' keywords.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Vue 3.5 (`<script setup lang="ts">`) |
| Language | TypeScript 5 (strict) |
| Build | Vite 5 |
| Router | vue-router 4 (hash history) |
| State | Pinia |
| i18n | vue-i18n 9 (Composition API) |
| Utilities | @vueuse/core |
| Fonts | @fontsource-variable (Space Grotesk, Hanken Grotesk) + JetBrains Mono |

### Optional runtime libraries (only loaded by the tools that need them)

- `js-sha3` — SHA-3 hashing (hash-text tool)
- `qrious` — QR code rendering (qrcode-generator tool)

## File layout

```
it-tools-site/
├── index.html
├── package.json
├── vite.config.ts / tsconfig*.json / env.d.ts
├── public/favicon.svg
└── src/
    ├── main.ts                       ← app entry (Pinia + Router + i18n)
    ├── App.vue
    ├── router/index.ts               ← / + /:toolId + 404 (hash mode)
    ├── i18n/
    │   ├── index.ts                  ← createI18n + locale detection/persistence
    │   └── locales/{en.ts, zh-CN.ts} ← bilingual strings
    ├── stores/                       ← Pinia: favorites, theme, ui, locale
    ├── styles/                       ← tokens.css, base.css, fonts.css, transitions.css
    ├── composables/                  ← useClipboard, useToolMeta, useFuzzySearch
    ├── data/                         ← catalog.ts (62 tools), icons.ts (115 SVGs)
    ├── types/                        ← Tool, ToolCategory, CategoryMeta, qrious shim
    ├── components/
    │   ├── shell/                    ← AppShell, Sidebar, NavItem, Topbar, LangSwitch
    │   ├── home/                     ← HomeView, HeroSection, CategoryBar, ToolCard
    │   ├── tool/                     ← ToolView, ToolHeader, ComingSoon
    │   ├── ui/                       ← AppIcon, CopyButton, BaseButton, inputs, OutputBox…
    │   └── NotFound.vue
    └── tools/
        ├── index.ts                  ← { id → lazy SFC } registry
        └── implementations/          ← one SFC per implemented tool, by category
```

## Credits

- Original project & all the great tool ideas: **[CorentinTh/it-tools](https://github.com/CorentinTh/it-tools)** (GPL-3.0)
- This front-end: original work, designed and built from scratch.
