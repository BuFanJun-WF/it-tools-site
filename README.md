# it·tools — a re-imagined developer toolbox

A redesigned take on the beloved **[it-tools](https://github.com/CorentinTh/it-tools)** by CorentinTh.
Same mission — a handy, fully client-side collection of developer utilities — built from scratch
with a **completely original front-end** (no Vue, no Naive UI, no build step).

## What's different from the original

| Aspect | Original it-tools | This build |
|---|---|---|
| Framework | Vue 3 + Naive UI | Vanilla JS (ES modules) |
| Build | Vite / pnpm | **None** — open `index.html` |
| Design system | Naive defaults | Custom warm "Builder SaaS" tokens |
| Accent | Blue | **Molten orange** (`#ff6b35`) |
| Type | System | Space Grotesk + Hanken Grotesk + JetBrains Mono |
| Routing | vue-router | Hash-based, hand-rolled |
| State | Pinia | Lightweight pub/sub store |

All tool logic runs **100% in the browser**. No data leaves the client.

## Run it

```bash
cd it-tools-site
python3 -m http.server 8765
# → open http://localhost:8765/
```

Any static file server works (no build step required).

## The 62 tools, across 10 categories

- **Crypto (10)** — hash text (SHA family + SHA-3), bcrypt, UUID, ULID, token, HMAC, RSA keygen, password strength, BIP39, AES encrypt/decrypt
- **Converter (13)** — base64 (string + file), JSON prettify, JSON⇄YAML, JSON⇄TOML, case, color, text⇄binary, NATO, integer base, date-time, Roman numerals, YAML prettify
- **Web (12)** — URL encode/decode, URL parser, HTML entities, JWT parser, user-agent parser, HTTP status codes, MIME types, keycode info, device info, basic auth, slugify, JSON diff
- **Images & Videos (3)** — QR code, WiFi QR code, SVG placeholder
- **Development (8)** — git cheatsheet, random port, crontab, chmod, regex tester, JSON minify, SQL prettify, docker run → compose
- **Network (3)** — IPv4 subnet calculator, IPv4 address converter, MAC address generator
- **Math (2)** — math evaluator, percentage calculator
- **Measurement (2)** — chronometer, temperature converter
- **Text (7)** — lorem ipsum, text statistics, text diff, string obfuscator, list converter, emoji picker, numeronym
- **Data (2)** — phone parser, IBAN validator

## Features

- **Search** — fuzzy across name, description, keywords, category (⌘K / Ctrl+K to focus)
- **Favorites** — star any tool; persisted in `localStorage`; drag-free reorder via sidebar
- **Dark / light theme** — respects OS preference, manual toggle persisted
- **Responsive** — sidebar collapses to a drawer below 920px
- **Hash routing** — deep-linkable, back/forward works

## Design system

Declared up-front (see `css/tokens.css`):

- **School**: Modern tool / Builder SaaS, warm variant (Linear/Raycast lineage)
- **Palette**: dark `#100f0d` bg · molten orange `#ff6b35` accent · amber `#f5a623` secondary
- **Type**: Space Grotesk (display) · Hanken Grotesk (body) · JetBrains Mono (code)
- **Spacing**: 4px base / 8px grid
- **Radius**: 6/8/12/20px hierarchical
- **Motion**: 160ms `cubic-bezier(.2,.7,.2,1)`

## Third-party libraries (all via CDN)

- `bcryptjs` — bcrypt hashing
- `js-yaml` — YAML parsing
- `js-sha3` — SHA-3 (not in WebCrypto)
- `qrious` — QR code rendering
- `libphonenumber-js` — phone number parsing

## File layout

```
it-tools-site/
├── index.html              ← entry, loads CDN libs + main.js
├── css/
│   ├── tokens.css          ← design tokens (colors, type, spacing, themes)
│   ├── base.css            ← layout shell, components, responsive
│   └── home.css            ← hero, category chips, tool grid
└── js/
    ├── main.js             ← app entry + router
    ├── shell.js            ← sidebar, topbar, theme toggle
    ├── store.js            ← reactive state (favorites, theme, route)
    ├── catalog.js          ← tool metadata (62 tools)
    ├── icons.js            ← SVG icon set
    ├── utils.js            ← clipboard, escape, debounce, copy-button
    ├── views/
    │   ├── home.js         ← home/catalog view
    │   └── tool.js         ← tool view wrapper + registry
    └── tools/
        ├── index.js        ← imports all tool modules
        ├── crypto.js       ← 10 crypto tools
        ├── converters.js   ← 13 converter tools
        ├── web.js          ← 12 web tools
        ├── images.js       ← 3 image tools
        ├── development.js  ← 8 dev tools
        ├── misc.js         ← network, math, measurement, text, data
        ├── text.js         ← emoji picker
        └── toml.js         ← tiny JSON⇄TOML helper
```

## Credits

- Original project & all the great tool ideas: **[CorentinTh/it-tools](https://github.com/CorentinTh/it-tools)** (GPL-3.0)
- This front-end: original work, designed and built from scratch.
