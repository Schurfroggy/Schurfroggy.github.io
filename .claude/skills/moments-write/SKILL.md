---
name: moments-write
description: >-
  Creates or edits one moment entry under src/data/moments by filling frontmatter
  from user-provided title/content/time. If title is missing, auto-generate
  "开发动态#x月x日" based on the user-specified date; if that day already has
  other moments, append （二）, （三）, … to the auto title for the 2nd, 3rd, … entry.
---

# moments-write

## 何时使用

- 用户要新增或编辑 `src/data/moments/**` 条目。
- 用户提供内容（可含标题、时间）。

## 输入与处理规则

1. 用户提供**内容**（必需）和**时间**（建议提供）。
2. 若用户提供了标题，直接使用该标题写入 frontmatter 的 `title`。
3. 若用户没有提供标题，自动生成：`开发动态#x月x日`  
   - `x月x日` 必须使用用户指定的时间里的月和日（例如 `4月28日`）。
   - 若该**自然日**在 `src/data/moments/` 中已有其他 Moment（以文件名日期或 `pubDatetime` 的当地日历日为准），自动标题需区分多篇：当天第一篇不加后缀，第二篇起依次在末尾加 `（二）`、`（三）`……。**新建**时先统计除本篇外当日已有条目数 `n`：`n=0` 无后缀，`n=1` 为 `（二）`，`n=2` 为 `（三）`，依此类推。
4. 为条目补全 frontmatter，至少包含：
   - `title`
   - `pubDatetime`
5. `---` 之后正文使用用户提供内容，不做无关扩写。

## 输出要求

- 在 `src/data/moments/` 下写入或更新单个 Markdown 文件。
- 目标是“用户给标题/内容（或仅内容）-> AI 自动补 frontmatter -> 可直接使用”。

## 与代码实现的对应关系

- 展示层已在 `src/utils/momentTitle.ts` 兜底：`title` 缺失时渲染为 `开发动态#M月D日`（按 `SITE.timezone` 或该条的 `timezone`）。因此当天**唯一**且不写 suffix 时，显式写 `title` 与省略 `title` 的显示结果相同。
- 但**同日去重后缀没有在代码里实现**：若当天多条且都不写 `title`，它们会显示成同一个标题。所以规则 3 的 `（二）（三）` 仍是**必须手写**的，不能依赖代码。
- 稳妥做法：无论是否首条，都显式写入带后缀的 `title`，避免以后插入新条目时顺序错乱。
