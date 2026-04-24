# 博客文章格式 — 详细参考（Schurfroggy.github.io）

面向本仓库（Astro Content Collections + `src/data/blog`）的操作要点。外部草稿、翻译稿或 AI 导出稿改写成可合并的 Markdown 时，与本 Skill 的 `SKILL.md`  checklist 对照使用。

---

## 1. 文件位置与命名

| 规则 | 说明 |
|------|------|
| 路径 | `src/data/blog/` 下任意 `*.md` 或 `*.mdx` |
| 忽略规则 | Loader 使用 `**/[^_]*.{md,mdx}`，**文件名不要以下划线 `_` 开头** |
| 单篇单文件 | 一篇博文一个文件；长标题可用中文或英文文件名，URL slug 由内容路径决定 |

---

## 2. Frontmatter（必填与约定）

Schema 定义在 `src/content.config.ts` 的 `blog` 集合。**文首必须是合法 YAML**。

### 必填

| 字段 | 类型 | 要求 |
|------|------|------|
| `title` | string | 与页面主标题一致；正文不要再写重复的 `# 标题` |
| `description` | string | **一两句摘要**，用于列表卡片与 SEO |
| `pubDatetime` | date | **ISO 8601**，如 `2026-04-24T12:00:00.000Z` |
| `tags` | string[] | 至少一项；多词标签在 YAML 中用引号，如 `"Harness Engineering"` |

### 常用可选

| 字段 | 说明 |
|------|------|
| `draft` | `true` 时一般不在正式环境展示；定稿设为 `false` |
| `featured` | `true` 可上首页 Featured 区 |
| `modDatetime` | 有实质修订时再填 |
| `author` | 省略则默认为 `SITE.author`（`src/config.ts`） |
| `ogImage` | 站内 `image()` 或外链字符串 |
| `canonicalURL` / `hideEditPost` / `timezone` | 按需，见 schema |

### 示例骨架

```yaml
---
title: "文章标题"
description: 一句话说明文章价值与范围，方便列表与搜索引擎展示。
pubDatetime: 2026-04-24T12:00:00.000Z
tags:
  - ai
  - topic-name
draft: false
---
```

---

## 3. 正文标题层级

- 页面单独渲染 **`title` 为 H1**，正文**不要**再以 `# 全文标题` 开头。
- 正文最高级用 **`##`**；依次为 **`###` → `####`**，**不跳级**。
- 编号章节（「一、」或「1.」）放在 `##` / `###` 上，全篇一致。

---

## 4. Markdown 卫生（导出稿清理）

| 问题 | 正确处理 |
|------|----------|
| 转义过的标题 | `\#\#\#` → `###` |
| 转义过的链接/标点 | `example\.com`、`\-`、`\+` → 正常字符 |
| HTML 实体冒充撇号 | `\'` 类写法 → 直接使用 `'` |
| 假代码块 fence | 去掉反斜杠，使用标准 ` ```mermaid ` |
| Mermaid 箭头 | `\-\-\>` → `-->` |
| Mermaid 节点 | `A\[...\]` → `A[...]` 或 `A["…"]` |
| 多行节点 | 合并为一行或 `["…"]` |
| 决策边 | `E -->|是| F` |
| `timeline` | `section` + `条目 : 说明` |
| 表格 | GitHub 风格；单元格内避免裸 `|` 破坏列 |

---

## 5. 图文与引用

- **外链图**：`<figure>` + `<img … alt="">` + `<figcaption>`；`alt` 必填。
- **站内资源**：`src/assets/` 或 `public/`，按仓库现有用法。
- **转载/译文**：引用块写明原文、作者、链接。

---

## 6. 成稿前自检

1. `npx astro check` 或 `npm run build` — Zod 无报错。
2. 预览：目录层级、Mermaid、表格、列表。
3. `tags` 命名风格与标签页 URL（中文标签会编码）。

---

## 7. 与图集区分

图集：`src/data/galleries/**/index.md`，schema 不同；勿混用博客 frontmatter。

---

## 8. 一句话记忆

**合法 frontmatter + 正文从 `##` 起 + 去假转义 + Mermaid/表格合法 + `astro check` 通过** = 符合本站博客格式。
