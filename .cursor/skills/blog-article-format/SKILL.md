---
name: blog-article-format
description: >-
  Rewrites drafts, translations, or AI exports into Astro Content Collection blog
  posts for this repo: frontmatter per src/content.config.ts, heading hierarchy
  (no duplicate H1), Markdown/Mermaid/table cleanup, remark-toc and Table of
  contents conventions. Use when editing or adding src/data/blog, converting
  articles to site format, fixing Zod content errors, or when the user @-mentions
  blog format, blog-article-format, or 博客格式.
---

# Blog article format (Schurfroggy.github.io)

## When to apply

Use this skill whenever the task touches **`src/data/blog/*.md(x)`**: new post, rewrite, translation, or fixing build/content errors for the blog collection.

## Workflow

1. Open **`src/content.config.ts`** and confirm the `blog` schema fields required for the change.
2. Add or fix **YAML frontmatter** at the top of the file (see checklist below).
3. Normalize the **Markdown body** (headings, escapes, Mermaid, tables).
4. Run **`npx astro check`** (or `npm run build`) and fix reported schema or parse issues.

## Checklist (must)

- [ ] **`title`**, **`description`**, **`pubDatetime`** (ISO 8601, e.g. `2026-04-24T12:00:00.000Z`), **`tags`** (YAML array, at least one tag).
- [ ] **No duplicate H1**: layout uses `title` as the page H1 — body starts at **`##`**, then `###` / `####` without skipping levels.
- [ ] **Strip bogus escapes** from exports: `\#`, `\.`, `` \`\`\` ``, `\-\->` in diagrams, broken HTML entities for apostrophes, etc.
- [ ] **Mermaid**: real triple-backtick fences; `-->` arrows; nodes as `A[...]` or `A["..."]`; decision edges like `E -->|yes| F`; `timeline` uses `section` and `label : text`.
- [ ] **Blog vs gallery**: only **`src/data/blog`** uses the blog schema — do not mix in gallery frontmatter (`src/data/galleries/**/index.md`).

## Optional frontmatter

`draft`, `featured`, `modDatetime`, `author` (defaults from `SITE`), `ogImage`, `canonicalURL`, `hideEditPost`, `timezone` — see schema in `src/content.config.ts`.

## Markdown stack (this repo)

- **`remark-toc`** + **`remark-collapse`**: collapsible block targets the heading **`Table of contents`** (exact text). English long posts may use `## Table of contents` per existing articles.
- **Shiki** for fenced code; language tags on code fences.

## Full tables and examples

For the complete field table, filename rules, figure/attribution patterns, and pre-ship checks, read **[reference.md](reference.md)** in this directory.
