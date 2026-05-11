# Schurfroggy 的小屋（Devosfera）

本仓库是 **[schurfroggy 的小屋](https://devosfera.vercel.app/)** 的源码站：用静态站记录开发笔记、技术随笔，以及不时更新的图集。我是 [Schur NewYork Froggy](https://github.com/schurfroggy)，开发者兼研究生，在这里整理学习与动手做东西时的想法。

*让好奇心落进代码里。折腾 Web 开发、软件架构，以及一切让技术世界转起来的东西。* — 站点简介与 [`src/config.ts`](src/config.ts) 中的 `desc` 一致。

若你更关心**站点如何搭建、如何写文**，可跳过个人介绍，直接从下方「项目结构」与「配置与组件」读起。

![社交分享预览图](public/devosfera-og.webp)

> 界面在 [AstroPaper](https://github.com/satnaing/astro-paper) 基础上深度二开（玻璃拟态、画廊、搜索等）。欢迎参考技术栈；许可证与主题致谢见文末。

**→ [English README](README.md)**

---

## 网站上有什么

- **文章**：带标签、RSS、首页可设 **精选**（`featured: true` 的文章会出现在精选区，其余在列表中）。
- **图集**：`/galleries` 灯箱浏览；在配置中开启时，图集还可与文章一起出现在首页信息流、归档、标签页与 RSS。
- **/now 动态流**：`src/data/moments/` 中每条一个 Markdown 文件，发布页按 `pubDatetime` 从新到旧展示（见「配置与组件」）。
- **搜索**：⌘K / Ctrl+K 打开（Pagefind）；索引在**生产构建**时生成，见下文命令说明。
- **头图与页头的音乐播放**：由 `src/data/musicPlaylist.ts` 与 `src/assets/music/*.mp3` 驱动，构建前脚本会更新封面，详见「命令」。
- **[关于我](https://devosfera.vercel.app/about/)**：多写了一些身份、游戏喜好与开博初衷。

更细的视觉与设计说明见 [CUSTOMIZATIONS.md](CUSTOMIZATIONS.md)；图集、封面与嵌入行为见 [GALLERIES.md](GALLERIES.md)。

---

## 项目结构

```
/
├── public/
│   ├── audio/                  # 如片头音效等
│   ├── pagefind/               # 搜索索引（执行 `pnpm run build` 后复制到此处）
│   └── music-covers-extracted/ # 从 MP3 抽出的封面（预构建脚本会更新）
├── scripts/                    # 如 extract-music-covers
├── src/
│   ├── assets/                 # 字体、图标、图、动图、音乐、默认封面等
│   ├── components/             # Astro / MDX 组件
│   ├── data/
│   │   ├── blog/               # 文章 .md / .mdx
│   │   ├── moments/            # /now 轻量短动态（多文件、按时间排序，见下）
│   │   ├── galleries/          # 每个专辑一个目录（见 GALLERIES.md）
│   │   ├── musicPlaylist.ts   # 首页与页头播放列表
│   │   └── musicCoverByMp3Path.json
│   ├── layouts/
│   ├── pages/
│   ├── styles/                 # 全局与正文排版
│   └── utils/
└── astro.config.ts
```

---

## 安装与本地开发

**环境：** Node.js 20.19+（GitHub Actions 与 Docker 使用 **22**）。推荐使用 **pnpm**：锁文件为 [`pnpm-lock.yaml`](pnpm-lock.yaml)，[`package.json`](package.json) 中的 `packageManager` 供 Corepack 使用。本地也可用 **npm**，但 CI 不会执行 `npm ci`；若曾提交过 `package-lock.json`，建议从 git 中移除以免与 pnpm 锁文件分叉。

```bash
pnpm install
pnpm run dev
# → http://localhost:4321
```

**本地试搜索：** Pagefind 在开发模式下不会凭空存在；需先 `pnpm run build` 把索引写入 `public/pagefind/`，再 `pnpm run preview` 或 `dev` 时即可用 ⌘K 搜索。

### Docker

```bash
docker build -t devosfera-blog .
docker run -p 4321:80 devosfera-blog
```

---

## 命令

| 命令 | 作用 |
| :--- | :--- |
| `pnpm install` | 安装依赖 |
| `pnpm run dev` | 本地开发，默认 `http://localhost:4321` |
| `pnpm run build` | 预执行 `extract-music-covers`（prebuild）→ `astro check`、构建、Pagefind，最后把索引拷到 `public/pagefind/` |
| `pnpm run preview` | 本地预览生产构建结果 |
| `pnpm run format` | Prettier 写入格式化 |
| `pnpm run format:check` | 只检查不写入 |
| `pnpm run lint` | ESLint |

`predev` / `prebuild` 会在开发或构建前跑音乐封面脚本，与 `public/music-covers-extracted/` 中的封面保持同步。

---

## 配置与组件

本小节把 **全站设置** 与 **写作** 放在一起：前者在 `src/config.ts`（`SITE`）和 `src/constants.ts`（社交、分享）里；更细的动效、字体可查阅 [CUSTOMIZATIONS.md](CUSTOMIZATIONS.md)；图集专篇见 [GALLERIES.md](GALLERIES.md)。

### 文章（`src/data/blog/`）

在 `.md` 或 `.mdx` 顶部填写 frontmatter（完整字段以 `src/content.config.ts` 的 Zod 为准）：

```yaml
---
title: "文章标题"
pubDatetime: 2026-01-15T10:00:00Z   # 必填 — 带时区的 ISO 8601
description: "用于 SEO 与列表摘要的短句"
tags: ["astro", "dev"]
featured: false       # true 则出现在首页精选区
draft: false          # 生产环境是否隐藏
timezone: "America/Guatemala"  # 可覆盖全站 SITE.timezone
hideEditPost: false
---
```

- **MDX** 中可直接使用 JSX；下文 **GalleryEmbed** 在 MDX 里**无需 import**（若工程已全局注册）。
- **目录**：在正文里写 `## Table of contents`（与 remark 配置配合），`remark-toc` + `remark-collapse` 会生成可折叠目录。
- **带标注的代码块**（Shiki），例如 `// [!code highlight]`、`// [!code ++]`、以及 `fileName: xxx` 行。

### 图集（`src/data/galleries/`）

1. 在 `src/data/galleries/<slug>/` 建目录。  
2. 放入 `index.md` 与图片；需固定顺序时给文件名加 `01-`、`02-` 等前缀。  
3. 最终访问路径为 `/galleries/<slug>`。在 `SITE` 中打开 `showGalleries`；若要在首页/列表/归档/RSS 中混入图集，再开 `showGalleriesInIndex`（前提仍是 `showGalleries: true`）。

更细的 index 元数据、封面、alt 与图片优化，见 [GALLERIES.md](GALLERIES.md)。

### /now 动态流（`src/data/moments/`）

- **作用**：在 [`/now`](https://devosfera.vercel.app/now/) 以「时间线」形式展示**短状态**，与 [About](https://devosfera.vercel.app/about/) 的长段自我介绍、与博客长文 **分开维护**；每条是仓库里的**单独** `.md` 或 `.mdx` 文件，并非单文件多段切分。
- **排序（最新在上）**：构建时取所有条目的 `pubDatetime`，按**时间由新到旧** 排序；`modDatetime` 可填（用于在卡片上显示与 `Datetime` 组件一致的“已更新”态），**不** 参与主排序。文件名仅便于人类检索，**不会影响** 排序，请以 frontmatter 日期为准。

在每条文件顶部写 frontmatter（完整字段以 `src/content.config.ts` 的 `moments` 集合 Zod 为准；下方为常见写法）：

```yaml
---
title: "可选的短标题" # 可省略，省略时只显示日期 + 正文
pubDatetime: 2026-04-25T12:00:00+08:00
modDatetime: 2026-04-25T15:00:00+08:00   # 可选
draft: false                            # 可选；true 时仅在 `astro dev` 中显示
timezone: "Asia/Shanghai"               # 可选；不填则沿用 SITE.timezone
---
```

- **正文体裁**：用一两段话、列表或引用即可；避免使用 `#` 级标题，以免与页面/卡片内标题层级重复；`##` / `###` 在一条内部可用。
- **不纳入目录**：`moments` **不会** 出现在主文章列表、标签或 RSS 中，与 `src/data/blog` 的约定（如 `remark-toc` 目录、标签）**相互独立**；如不需要某条，用 `draft: true` 或从仓库中删除/改名。
- **以 `_` 开头** 的 `.md` / `.mdx` 会按与博客相同的 glob 规则被**忽略**（不加载进集合），可用于本地备忘。

**实现速览**（需改行为时自搜）：`src/pages/now/index.astro` 拉取集合并 `render`；`src/components/MomentItem.astro` 为单条卡片与排版。

### `GalleryEmbed` 组件

在 **MDX 文章** 里嵌入整本相册，**不用手动 import**：

```mdx
<GalleryEmbed slug="my-trip-to-tokyo" />
```

常用可选属性：`limit`（`0` 表示不截断）、`cols`（`2` / `3` / `4`）、`showLink`（是否显示到完整图集页的链接）。完整说明、无效 slug 行为、灯箱等见 [GALLERIES.md](GALLERIES.md#galleryembed--gallery-inside-mdx-posts) 中对应章节。

---

## 致谢、上游与许可证

网站骨架来自 [AstroPaper](https://github.com/satnaing/astro-paper)（[Sat Naing](https://satnaing.dev)），以 [LICENSE](LICENSE) 中的 MIT 为准；本仓库另含 fork 后定制部分的版权声明。

以下条目对应上游 AstroPaper 中曾讨论的问题/需求，本仓库已合并或实现相关能力：

| Issue | 说明 |
| :---- | :--- |
| [#614](https://github.com/satnaing/astro-paper/issues/614) | 分享区为空时「回到顶部」与分页按钮 — `BackToTopButton.astro` |
| [#574](https://github.com/satnaing/astro-paper/issues/574) | 移动端表格撑破 — `typography.css`（[GladerJ 方案](https://github.com/satnaing/astro-paper/issues/574#issuecomment-3427381261)） |
| [#569](https://github.com/satnaing/astro-paper/issues/569) | 桌面端回到顶部统一样式 — `BackToTopButton.astro`, `PostDetails.astro` |
| [#566](https://github.com/satnaing/astro-paper/issues/566) | 分享新标签打开 — [PR #611](https://github.com/satnaing/astro-paper/pull/611) |
| [#131](https://github.com/satnaing/astro-paper/issues/131) | MDX 与 `extendMarkdownConfig` — `astro.config.ts`, `content.config.ts` |
| [#495](https://github.com/satnaing/astro-paper/issues/495) | 时区下发文过滤 — `postFilter.ts`（参考 [kj-9 分支](https://github.com/satnaing/astro-paper/compare/main...kj-9:astro-paper:fix-post-filter-date)） |
| [#553](https://github.com/satnaing/astro-paper/issues/553) | 图集、灯箱、GalleryEmbed — 详见 [GALLERIES.md](GALLERIES.md) |

若本仓库对你有参考意义，给上游 AstroPaper 一个 star 或在自项目的 README 里提一句来源，会是很贴心的回馈方式。
