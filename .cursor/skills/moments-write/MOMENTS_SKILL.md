---
name: moments-write
description: >-
  Creates or edits Astro Content Collection `moments` for `/now`: one file under
  src/data/moments/ with valid frontmatter and body per README and
  src/content.config.ts. Use when the user gives a time and short moment text
  (or asks to add a now-stream note), or when working on src/data/moments.
---

# Moments 撰写（`/now` 动态流）

## 何时使用

- 用户**只提供时间 + 正文**（要新增一条 moment）时，**直接创建文件**，不要只给步骤让用户自己做。
- 用户编辑、迁移或修复 `src/data/moments/**` 中的条目时，按本规范对齐 frontmatter 与正文。

## 用户输入如何映射

| 用户给 | 处理方式 |
|--------|----------|
| 时间 | 解析为**一条真实时刻**，写入 `pubDatetime`，使用 **ISO 8601 带时区偏移**（与仓库现有条目一致时可用 `+08:00`；若用户说明其它时区，用对应偏移或 `Z`）。默认站点时区为 **`Asia/Shanghai`**（见 `src/config.ts` 的 `SITE.timezone`）；用户未提及时区时，**与现有多数 moments 一致用 `+08:00` 表示东八区**即可。 |
| 正文 | 作为 Markdown **body**（`---` 之后），原样或轻微整理标点；不要擅自改成英文。 |
| 未给日期/时间 | 先向用户补全，或仅在用户明确用「今天」等且对话中有可靠日期时再用该日期。 |

**时间解析示例**（均写入前 matter）:

- `2026/4/26 19:00` → `2026-04-26T19:00:00+08:00`（未说明时区且默认中国时间）
- `2026-04-26 19:00:00+08:00` → 原样采用（格式合法即可）

## 必须遵守的仓库约定（摘自 README + schema）

- **路径**：`src/data/moments/` 下**每个 moment 一个** `.md` 或 `.mdx` 文件；**不是**把多条写进同一个文件。
- **排序**：构建时按 **`pubDatetime` 降序**；时间写在 **front matter**，不要依赖文件名排序。
- **文件名**：仅便于人类识别，规则建议：`YYYY-MM-DD-HHmm-<short-kebab-slug>.md`（与现有如 `2026-04-24-2238-music-box.md` 一致）。`<short-kebab-slug>` 用英文小写与连字符，能概括内容即可（可从中文概括成 2–5 个英文词）；避免空格与特殊字符。同一分钟多条时加区分词或秒级时间进 `pubDatetime` 即可，文件名可再加后缀区分。
- **忽略规则**：`_*` 文件被 glob 排除，**不要**用 `_` 前缀作为正式条目。
- **展示范围**：`moments` 不出现在博客列表、标签、RSS；**不需要**博客那套 `remark-toc` / 目录块。
- **正文**：
  - 不要用单个 `#` 作为正文标题（与页面标题层级冲突）。**`##` / `###` 可以**。
  - 一段、列表、引用均可，保持简短即可。

## Front matter（以 `src/content.config.ts` 的 `moments` 为准）

**必填**

- `pubDatetime`: `z.date()` — YAML 中写**带时区**的日期时间字符串（如 `2026-04-26T19:00:00+08:00`）。

**可选**

- `title` — 短标题；省略则界面上以日期 + 正文为主。
- `modDatetime` — 有「修改」时填；会驱动 UI 的 “Updated” 等展示，**不改变**主排序。
- `draft: true` — 仅开发环境展示（`src/pages/now/index.astro` 在非 DEV 时过滤）。
- `timezone` — 可选；不设则与 `SITE.timezone` 行为一致，README 中说明为默认站点时区。

## 创建步骤（对 Agent）

1. 从用户输入得到 **`pubDatetime`** 与**正文**（见上表）。
2. 在 `src/data/moments/` 新建 `YYYY-MM-DD-HHmm-<short-kebab-slug>.md`。
3. 写入 front matter + 空行 + 正文，保存。
4. 运行 **`npx astro check`**，若有 schema/解析错误则修正。

## 文件模板

```markdown
---
pubDatetime: 2026-04-26T19:00:00+08:00
---

正文内容写在这里。可以多段。

> 需要时可用引用。
```

**带可选字段示例：**

```markdown
---
title: "短标题"
pubDatetime: 2026-04-26T19:00:00+08:00
modDatetime: 2026-04-26T20:00:00+08:00
draft: false
timezone: "Asia/Shanghai"
---

正文。
```

## 与博客区分

- **仅**对 `src/data/moments/**` 使用本 skill；博客请用 `blog-article-format` skill（`src/data/blog`）。

## 相关文件（按需打开）

- Schema：`src/content.config.ts`（`moments` 集合）
- 说明：`README.md` 中 “The `/now` stream (`src/data/moments/`)” 一节
- 页面：`src/pages/now/index.astro`；单条展示：`src/components/MomentItem.astro`
