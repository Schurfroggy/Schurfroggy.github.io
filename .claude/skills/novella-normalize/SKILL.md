---
name: novella-normalize
description: >-
  Normalizes novella markdown files for this repo by adjusting only frontmatter
  fields for src/data/novella. Use when formatting, importing, or fixing novella
  entries while preserving body text exactly. The agent must not modify any body
  content; it may only add or update title, description, pubDatetime, and tags
  in frontmatter according to project rules.
---

# Novella 规范化（仅 Frontmatter）

## 何时使用

- 处理 `src/data/novella/**` 下的小说 Markdown（新建、导入、迁移、修复 schema）。
- 用户要求“规范化小说”且强调正文不可改动时。

## 强约束（必须遵守）

- **绝对不能修改小说正文的任何内容**（`---` 之后的 body 必须逐字保持不变）。
- 仅允许在文件开头处理 frontmatter 字段：`title`、`description`、`pubDatetime`、`tags`。
- 不得新增本 skill 未要求的推断性正文、摘要、润色、重写。

## 字段规则

- `title`
  - 若文章原本含有标题，则将其设置为 `title`。
  - 标题来源优先级：
    1) 现有 frontmatter 的 `title`；
    2) 正文首个 Markdown 标题（`# ` 开头）。
  - 若没有可用标题，不强行生成新标题。

- `description`
  - 若用户或原文已提供，则写入该值。
  - 若没有提供 `description`，设置为 **`null`**（不要自动生成描述）。

- `pubDatetime`
  - 保留已有值；若用户明确提供发布时间则写入。
  - 推荐 ISO 8601（例如 `2026-04-28T18:00:00+08:00`）。
  - 未提供时不要臆造时间。

- `tags`
  - 仅使用原文或用户提供的标签。
  - **没有提供 tags 的情况下不要自动生成**。
  - 若无标签，可省略该字段；若显式要求存在则可写 `tags: []`。

## 操作流程

1. 读取目标小说文件，定位 frontmatter 与正文分界。
2. 解析是否已有 `title/description/pubDatetime/tags`。
3. 按“字段规则”最小化修改 frontmatter。
4. 写回文件时确保正文 byte-to-byte 不变（仅允许 frontmatter 区域变化）。
5. 若仓库有内容校验流程，运行 `npx astro check` 或 `npm run build` 做验证。

## 前置模板（可选）

当文件缺少 frontmatter 时，可添加最小头部：

```markdown
---
title: "..."
description: null
pubDatetime: 2026-04-28T18:00:00+08:00
---
```

> 仅在有明确来源时填写 `title` / `pubDatetime`。`tags` 没有来源就不要补。

## 适用范围声明

- 本 skill 只用于 `src/data/novella/**`。
- `src/data/blog/**` 使用 `blog-article-format` skill。
- `src/data/moments/**` 使用 `moments-write` skill。
