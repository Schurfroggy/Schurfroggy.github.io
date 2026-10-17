# 项目 Skills 使用说明

本文档用于说明本仓库内可用 skill 的触发方式、适用场景与推荐输入模板。

## Skills 文件规范（统一后）

- 每个 skill 使用一个独立目录：`.claude/skills/<skill-name>/`
- 入口文件统一为：`SKILL.md`（必须存在）
- 补充文档统一为：`REFERENCE.md`（可选）
- 不再使用根目录 skill 索引文件；统一从 `.claude/skills/` 维护
- 原先的 `.cursor/skills/` 已整体迁入 `.claude/skills/`，两者是同一套文件，不要双份维护

## 通用使用原则

- 直接用自然语言描述需求即可，Agent 会根据关键词与路径自动匹配 skill。
- 为了提高命中率，建议在同一条消息里同时写：
  - skill 名称（如 `novella-normalize`）
  - 目标路径（如 `src/data/novella/xxx.md`）
  - 关键约束（如“正文不能改”）

推荐句式：

```text
请使用 <skill-name> 处理 <path>：<constraints>
```

## 1) moments-write

- **用途**：新增/编辑 `/now` 动态（`src/data/moments/**`）
- **适合输入**：
  - “新增一条 moment，时间是 ...，内容是 ...”
  - “按 moments-write 规范修复 src/data/moments/...”

示例：

```text
请用 moments-write 在 src/data/moments 下新增一条：2026-04-28 19:00，今天把 novella 页面改好了。
```

## 2) blog-article-format

- **用途**：博客文章 frontmatter 规范化（`src/data/blog/**`）
- **边界**：只处理 frontmatter，不改正文、不重排标题层级或 markdown 结构（以 `SKILL.md` 为准）
- **适合输入**：
  - “把草稿整理成博客格式”
  - “修复 frontmatter 缺字段问题”

示例：

```text
请按 blog-article-format 规范整理 src/data/blog/my-post.md，补全 frontmatter 与 description。
```

## 3) novella-normalize

- **用途**：小说 frontmatter 规范化（`src/data/novella/**`）
- **核心约束**：只处理 frontmatter，不得修改正文内容

示例：

```text
请使用 novella-normalize 处理 src/data/novella/night-platform.md：
只规范 title/description/pubDatetime/tags，正文一个字都不要改。
```

## 触发失败时怎么写

如果你怀疑没有命中 skill，可以在提示中显式补充三要素：

1. 明确写 skill 名称  
2. 明确写目标文件路径  
3. 明确写不可违反的规则

示例：

```text
使用 novella-normalize，目标 src/data/novella/paper-planet.md。
规则：不改正文；若无 description 就省略该字段（不写 null）；无 tags 不自动生成。
```

## 相关文档（非 skill）

| 文件 | 内容 |
|---|---|
| [GALLERIES.md](GALLERIES.md) | 图片画廊的完整规格：目录结构、frontmatter、图片处理、封面、嵌入组件、灯箱 |
| [GAMES.md](GAMES.md) | 游戏页的完整规格：数据模型、卡片组件、新增游戏步骤、导航接入 |
| [README.md](README.md) | 本地开发、命令、部署与内容目录说明 |
