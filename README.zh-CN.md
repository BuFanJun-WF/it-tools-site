# it·tools — 重新构想的开发者工具箱

本仓库源码：**[BuFanJun-WF/it-tools-site](https://github.com/BuFanJun-WF/it-tools-site)**。
同样的使命 —— 一组 handy、完全在浏览器端运行的开发者小工具集合 —— 但用
**Vue 3 + TypeScript + Vite** 重新打造，配上原创的暖色「Builder SaaS」设计系统、
Marketplace 风格布局，并完整支持 **English / 中文** 双语切换。

> 所有工具逻辑 **100% 在浏览器中运行**。没有后端、没有网络请求，数据永远不会离开客户端。

---

## 与原版的区别

| 维度 | 原版 it-tools | 本构建 |
|---|---|---|
| 框架 | Vue 3 + Naive UI | **Vue 3 + TypeScript（自研组件）** |
| 构建 | Vite / pnpm | **Vite** |
| 国际化 | 仅英文 | **英文 + 简体中文，实时切换** |
| 设计系统 | Naive 默认 | 自研暖色「Builder SaaS」令牌（熔岩橙） |
| 布局 | 侧栏外壳 | **Marketplace 风格：顶部导航 + 页脚，无侧栏** |
| 状态 | Pinia | **Pinia + @vueuse/core** |
| 路由 | vue-router | **vue-router（hash 模式，`/tools/` 子路径）** |
| 组件 | Naive UI | **自研（AppIcon、CopyButton、OutputBox……）** |

---

## 快速开始

```bash
npm install
npm run dev      # → http://localhost:5173/tools/   （base 路径为 /tools/）
```

```bash
npm run build    # vue-tsc --noEmit && vite build → dist/
npm run preview  # 预览生产构建
npm run typecheck# vue-tsc --noEmit（CI 友好的快速类型检查）
```

> **本项目没有接入测试运行器或 lint。** `npm run build`（在 strict 模式下包含
> `vue-tsc --noEmit`）是唯一的自动校验关卡 —— 在宣布任务完成前请务必运行它。
> TypeScript 处于 `strict` 模式，且开启了 `noUnusedLocals` / `noUnusedParameters`，
> 多余的导入或变量会让构建失败。

---

## 工具集

共收录 **10 个分类下的 62 个工具**，其中 **17 个在本构建中已完整实现**；
其余展示友好的「敬请期待」占位，但同样出现在搜索、导航、收藏与最近访问中。

### 已实现（17 个）

| 分类 | 工具 |
|---|---|
| **加密** | 文本哈希（SHA 系列 + SHA-3）、UUID 生成器 |
| **转换器** | Base64 字符串、JSON 美化、日期时间转换 |
| **Web** | JWT 解析、HTTP 状态码、JSON Diff |
| **图片与视频** | 二维码生成器 |
| **开发** | 正则测试、Cron 表达式生成、Chmod 计算器 |
| **网络** | IPv4 子网计算器 |
| **数学** | 数学表达式求值 |
| **度量** | 温度转换 |
| **文本** | Emoji 选择器 |
| **数据** | IBAN 校验 |

### 目录中的徽标

- **`hot`**（7 个）—— 高频工具，作为首页「快速访问」chip 展示：
  `uuid-generator`、`base64-string-converter`、`json-prettify`、`date-time-converter`、
  `jwt-parser`、`qrcode-generator`、`regex-tester`。
- **`isNew`**（2 个）—— 近期上线：`json-diff`、`iban-validator-and-parser`。

> 工具列表的唯一真源是 `src/data/catalog.ts`。每个工具条目的 `id` 必须与
> 它的 i18n key（`tools.<id>.name` / `tools.<id>.description`）保持一致；
> 若已实现，还要与 `src/tools/index.ts` 中的注册条目一致。

---

## 特性

- **🔍 双语搜索** —— 模糊匹配名称、描述与关键词，**同时**命中两种语言
  （输入中文或英文均可）。token 之间为 AND，大小写不敏感。`⌘K` / `Ctrl+K` 聚焦全局搜索框。
- **⭐ 收藏** —— 收藏任意工具，持久化到 `localStorage`（`it-tools:favorites`）。
- **🕑 最近访问** —— 已实现工具被访问时记录（`localStorage` `it-tools:recent`）。
- **🌗 深色 / 浅色主题** —— 自动跟随系统，手动切换会被记住（`it-tools:theme`）。
- **🌐 语言切换** —— English / 简体中文，自动检测浏览器语言并持久化（`it-tools:lang`）。
- **🏠 Marketplace 首页** —— 带实时搜索 + 快速访问 chip 的 Hero、品牌带、
  精选 / 最近 / 收藏 区块、分类展示卡、「为什么」面板。
- **🏛 Hall / Tool / 404 页面** —— 独立的浏览页（分类 tab + 计数）、工具详情页、友好的 404。
- **🔗 Hash 路由** —— 可深链接、前进后退可用、刷新安全；在 `/tools/` 子路径下零服务端配置即可工作。
- **⚡ 工具懒加载** —— 每个已实现工具都是独立的异步分包；带组件实例级缓存与
  `onError` 恢复，瞬时 chunk 加载失败也无需整页刷新。
- **📱 响应式** —— 在 `920px`、`560px` 两个断点做流式间距与字号调整。

---

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Vue 3.5（`<script setup lang="ts">`） |
| 语言 | TypeScript 5（`strict`） |
| 构建 | Vite 5 |
| 路由 | vue-router 4（hash history） |
| 状态 | Pinia（favorites · recent · theme · ui · locale） |
| 国际化 | vue-i18n 9（Composition API，`legacy: false`） |
| 工具库 | @vueuse/core |
| 字体 | @fontsource-variable（Space Grotesk、Hanken Grotesk）+ JetBrains Mono |

### 可选运行时库（仅被用到它们的工具加载）

- `js-sha3` —— SHA-3 哈希（hash-text 工具）
- `qrious` —— 二维码渲染（qrcode-generator 工具）

---

## 设计系统

声明式定义（见 `src/styles/tokens.css`）：

- **流派**：现代工具 / Builder SaaS，暖色变体（Linear / Raycast 血统）
- **配色**：深色底 `#100f0d` · 熔岩橙强调色 `#ff6b35` · 琥珀色辅色 `#f5a623`
- **字体**：Space Grotesk（标题）· Hanken Grotesk（正文）· JetBrains Mono（代码）
- **间距**：4px 基线 / 8px 网格（`--sp-1 … --sp-16`）
- **圆角**：6 / 8 / 12 / 20px 分层（`--r-sm/md/lg/xl/pill`）
- **动效**：120 / 180 / 320ms，`cubic-bezier(0.2, 0.7, 0.2, 1)`

`main.ts` 中的全局样式引入顺序是关键的：
**tokens → fonts → base → transitions**。

所有 UI 原语位于 `src/components/ui/` —— `FieldLabel`、`TextInput`、`TextArea`、
`SelectInput`、`OutputBox`、`CopyButton`、`BaseButton`、`IconBtn`、`Stack`、`Row`、
`Grid2`、`AppIcon`、`TagBadge`、`NoticeBox`、`KvList`。请复用它们，不要用原始
`<input>`/`<textarea>` 重新发明表单控件。

---

## 国际化

所有用户可见文案都流经 [`vue-i18n`](https://vue-i18n.nuxtjs.org/)。语言文件位于
`src/i18n/locales/{en,zh-CN}.ts`。工具名与描述以 key（`tools.<id>.name`、
`tools.<id>.description`）索引；工具内标签位于 `impl.<id>.*` 下。两者都在渲染时解析，
因此整个界面——导航、卡片、工具头、工具内标签——都能在切换语言时即时翻转，无需刷新。

模糊搜索 composable（`src/composables/useFuzzySearch.ts`）在模块加载时为每个工具
预构建双语 haystack —— 两种语言的 name/description **外加** 每个工具的 `keywords`
数组 —— 因此用任一语言输入都能命中。

**新增文案时，请在同一次改动中同时更新两个语言文件** —— 缺失的 key 会静默回退成
key 路径本身，从而上线一个语言下的破损界面。

---

## 目录结构

```
it-tools-site/
├── index.html
├── package.json
├── vite.config.ts / tsconfig*.json / env.d.ts
├── public/favicon.svg
└── src/
    ├── main.ts                       ← 应用入口：Pinia + Router + i18n + 全局样式
    ├── App.vue                       ← 挂载 <MarketLayout />
    ├── router/index.ts               ← / /hall /about /blog /feedback /:toolId + 404（hash）
    ├── i18n/
    │   ├── index.ts                  ← createI18n + 语言检测/持久化
    │   └── locales/{en.ts, zh-CN.ts} ← 双语文案
    ├── stores/                       ← Pinia：favorites、recent、theme、ui、locale
    ├── styles/                       ← tokens.css、fonts.css、base.css、transitions.css
    ├── composables/                  ← useClipboard、useToolMeta、useFuzzySearch、
    │                                   useFavoriteTools、useRecentTools
    ├── data/
    │   ├── catalog.ts                ← 62 个工具、CATEGORIES、findTool()、countByCategory
    │   └── icons.ts                  ← 79 个内联 SVG 图标（key → markup）
    ├── types/tool.ts                 ← Tool、ToolCategory、CategoryMeta、qrious shim
    ├── components/
    │   ├── shell/                    ← MarketLayout、MarketHeader、SiteFooter、LangSwitch、SimplePage
    │   ├── home/                     ← HomePage、ToolCard
    │   ├── hall/                     ← HallPage（浏览 + 分类 tab + 搜索）
    │   ├── tool/                     ← ToolView、ToolHeader、ComingSoon
    │   ├── ui/                       ← 设计系统原语
    │   └── NotFound.vue
    └── tools/
        ├── index.ts                  ← toolRegistry：{ id → 懒加载 SFC import }
        └── implementations/          ← 每个已实现工具一个 SFC，按分类组织
```

### 请求生命周期（一个工具如何渲染）

1. `vue-router`（hash 模式）匹配 `/:toolId` → `ToolView.vue`。
2. `ToolView` 调用 `findTool(id)` 查询 `catalog.ts`；未知 id → `<NotFound />`。
3. 若 `tool.implemented && toolRegistry[id]` → 渲染懒加载 SFC
   （`defineAsyncComponent`，按组件实例缓存；`onError` 时清掉缓存）。
4. 否则 → `<ComingSoon :tool />`。
5. 已实现工具在访问时把自身 id 推入 `recent` store。

---

## 在本仓库中工作

贡献指引（面向 AI 代理的完整指南见 [`AGENTS.md`](./AGENTS.md)）：

- **新增工具**：先加 catalog 条目 → 在**两个**语言文件中加 `tools.<id>.*` 键 →
  （若已实现）在 `src/tools/implementations/<category>/` 下放 SFC，并在 `toolRegistry` 注册。
- **文案**：一律走 `useI18n()` 的 `t()`，不要在模板里硬编码中文或英文。
- **样式**：使用设计令牌（`var(--sp-3)`、`var(--fs-sm)`……），仅用 scoped `<style>`。
- **TypeScript**：优先使用 `@/*` 别名；不要压制类型错误 —— 修掉它。
- **提交信息**：Conventional Commits（`feat:`、`fix:`、`refactor:`、`style:`、`docs:`）。

---

## 致谢

- 本前端：原创作品，从零设计与构建 —— **[BuFanJun-WF/it-tools-site](https://github.com/BuFanJun-WF/it-tools-site)**

---

🌐 **[English README](./README.md)**
