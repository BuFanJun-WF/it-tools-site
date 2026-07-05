# it·tools — 重新构想的开发者工具箱

基于备受喜爱的 **[it-tools](https://github.com/CorentinTh/it-tools)**（作者 CorentinTh）重新设计。
本仓库源码：**[BuFanJun-WF/it-tools-site](https://github.com/BuFanJun-WF/it-tools-site)**。
同样的使命 —— 一组 handy、完全在浏览器端运行的开发者小工具集合 —— 但用 **Vue 3 + TypeScript + Vite**
重新打造，配上原创的暖色「Builder SaaS」设计系统，并完整支持 **English / 中文** 双语切换。

## 与原版的区别

| 维度 | 原版 it-tools | 本构建 |
|---|---|---|
| 框架 | Vue 3 + Naive UI | **Vue 3 + TypeScript（自研组件）** |
| 构建 | Vite / pnpm | **Vite** |
| 国际化 | 仅英文 | **英文 + 简体中文，实时切换** |
| 设计系统 | Naive 默认 | 自研暖色「Builder SaaS」令牌（熔岩橙） |
| 状态 | Pinia | **Pinia + @vueuse/core** |
| 路由 | vue-router | **vue-router（hash 模式）** |
| 组件 | Naive UI | **自研（AppIcon、CopyButton、OutputBox……）** |

所有工具逻辑 **100% 在浏览器中运行**，数据不会离开客户端。

## 运行

```bash
npm install
npm run dev      # → http://localhost:5173/
```

```bash
npm run build    # 类型检查 + 生产构建到 dist/
npm run preview  # 预览生产构建
```

## 工具集

共收录 **10 个分类下的 62 个工具**，其中 **17 个在本构建中已完整实现**；
其余展示友好的「敬请期待」占位，但同样出现在搜索、导航与收藏中。

**已实现（17 个）：**

- **加密** —— 文本哈希（SHA 系列 + SHA-3）、UUID 生成器
- **转换器** —— Base64 字符串、JSON 美化、日期时间转换
- **Web** —— JWT 解析、HTTP 状态码、JSON Diff
- **图片与视频** —— 二维码生成器
- **开发** —— 正则测试、Cron 表达式生成、Chmod 计算器
- **网络** —— IPv4 子网计算器
- **数学** —— 数学表达式求值
- **度量** —— 温度转换
- **文本** —— Emoji 选择器
- **数据** —— IBAN 校验

## 特性

- **🔍 搜索** —— 模糊匹配名称、描述、关键词（支持中英双语，输入中文或英文均可）；`⌘K` / `Ctrl+K` 聚焦
- **⭐ 收藏** —— 收藏任意工具，持久化到 `localStorage`
- **🌗 深色 / 浅色主题** —— 自动跟随系统，手动切换会被记住
- **🌐 语言切换** —— English / 简体中文，自动检测浏览器语言并持久化
- **📱 响应式** —— 920px 以下侧栏折叠为抽屉
- **🔗 Hash 路由** —— 可深链接、前进后退可用、刷新安全
- **⚡ 工具懒加载** —— 每个工具独立异步分包

## 设计系统

声明式定义（见 `src/styles/tokens.css`）：

- **流派**：现代工具 / Builder SaaS，暖色变体（Linear / Raycast 血统）
- **配色**：深色底 `#100f0d` · 熔岩橙强调色 `#ff6b35` · 琥珀色辅色 `#f5a623`
- **字体**：Space Grotesk（标题）· Hanken Grotesk（正文）· JetBrains Mono（代码）
- **间距**：4px 基线 / 8px 网格
- **圆角**：6 / 8 / 12 / 20px 分层
- **动效**：120 / 180 / 320ms，`cubic-bezier(0.2, 0.7, 0.2, 1)`

## 国际化

所有用户可见文案都流经 [`vue-i18n`](https://vue-i18n.nuxtjs.org/)。语言文件位于
`src/i18n/locales/{en,zh-CN}.ts`。工具名与描述以 key（`tools.<id>.name`、
`tools.<id>.description`）索引、渲染时解析，因此整个界面——侧栏、卡片、工具头、工具内标签——
都能在切换语言时即时翻转，无需刷新。搜索同时匹配两种语言的关键词。

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Vue 3.5（`<script setup lang="ts">`） |
| 语言 | TypeScript 5（strict） |
| 构建 | Vite 5 |
| 路由 | vue-router 4（hash history） |
| 状态 | Pinia |
| 国际化 | vue-i18n 9（Composition API） |
| 工具库 | @vueuse/core |
| 字体 | @fontsource-variable（Space Grotesk、Hanken Grotesk）+ JetBrains Mono |

### 可选运行时库（仅被用到它们的工具加载）

- `js-sha3` —— SHA-3 哈希（hash-text 工具）
- `qrious` —— 二维码渲染（qrcode-generator 工具）

## 目录结构

```
it-tools-site/
├── index.html
├── package.json
├── vite.config.ts / tsconfig*.json / env.d.ts
├── public/favicon.svg
└── src/
    ├── main.ts                       ← 应用入口（Pinia + Router + i18n）
    ├── App.vue
    ├── router/index.ts               ← / + /:toolId + 404（hash 模式）
    ├── i18n/
    │   ├── index.ts                  ← createI18n + 语言检测/持久化
    │   └── locales/{en.ts, zh-CN.ts} ← 双语文案
    ├── stores/                       ← Pinia：favorites、theme、ui、locale
    ├── styles/                       ← tokens.css、base.css、fonts.css、transitions.css
    ├── composables/                  ← useClipboard、useToolMeta、useFuzzySearch
    ├── data/                         ← catalog.ts（62 个工具）、icons.ts（115 个 SVG）
    ├── types/                        ← Tool、ToolCategory、CategoryMeta、qrious shim
    ├── components/
    │   ├── shell/                    ← AppShell、Sidebar、NavItem、Topbar、LangSwitch
    │   ├── home/                     ← HomeView、HeroSection、CategoryBar、ToolCard
    │   ├── tool/                     ← ToolView、ToolHeader、ComingSoon
    │   ├── ui/                       ← AppIcon、CopyButton、BaseButton、输入框、OutputBox……
    │   └── NotFound.vue
    └── tools/
        ├── index.ts                  ← { id → 懒加载 SFC } 注册表
        └── implementations/          ← 每个已实现工具一个 SFC，按分类组织
```

## 致谢

- 原项目及所有出色工具的创意：**[CorentinTh/it-tools](https://github.com/CorentinTh/it-tools)**（GPL-3.0）
- 本前端：原创作品，从零设计与构建 —— **[BuFanJun-WF/it-tools-site](https://github.com/BuFanJun-WF/it-tools-site)**

---

🌐 **[English README](./README.md)**
