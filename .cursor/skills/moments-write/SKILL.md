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
