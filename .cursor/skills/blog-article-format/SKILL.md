---
name: blog-article-format
description: >-
  Adds or fixes frontmatter for blog posts in src/data/blog. User must provide
  at least title, pubDatetime, and tags. Defaults: featured=false, draft=false,
  timezone=SITE.timezone. If description is missing, read the article and
  generate a short description.
---

# blog-article-format

## 何时使用

- 用户新增或编辑 `src/data/blog/**` 文章。
- 目标只处理 frontmatter，不做正文格式化。

## 输入要求

用户至少需要提供：

- `title`
- `pubDatetime`
- `tags`

## Frontmatter 处理规则

1. 为文章添加或更新 frontmatter。
2. 必须包含：`title`、`pubDatetime`、`tags`、`description`。
3. `featured` 默认为 `false`（用户未显式给出时）。
4. `draft` 默认为 `false`（用户未显式给出时）。
5. `timezone` 默认为当前 `SITE.timezone`（用户未显式给出时）。
6. 若用户没有提供 `description`，必须通读文章正文后生成一条简短描述（1-2 句）。

## 输出要求

- 仅在 `src/data/blog/` 目标文件中写入或修正 frontmatter。
- 正文内容保持原意，不做与 frontmatter 无关的重写。
