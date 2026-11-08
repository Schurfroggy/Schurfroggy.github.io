/**
 * Games shown on `/games`.
 * Add an entry here and drop its preview image into `src/assets/games/` — no page edits needed.
 */
import type { ImageMetadata } from "astro";
import openFrontCover from "@/assets/games/openfront.jpg";
import minecraftCaicaiCover from "@/assets/games/mc-caicai-cover.png";

export type GameStatus = "playable" | "wip" | "offline";

export type Game = {
  /** Anchor id + React-ish key; keep it URL-safe. */
  slug: string;
  title: string;
  /** One line under the title. */
  tagline: string;
  description: string;
  /** 16:9 preview, rendered through `astro:assets` (auto WebP). */
  cover: ImageMetadata;
  tags: string[];
  status: GameStatus;
  /** Direct play URL. Omit while the game is not publicly playable. */
  play?: string;
  /** Source repository. */
  repo?: string;
};

export const GAME_STATUS_LABEL: Record<GameStatus, string> = {
  playable: "可玩",
  wip: "开发中",
  offline: "维护中",
};

export const GAMES: Game[] = [
  {
    slug: "openfrontfroggy",
    title: "OpenFrontFroggy",
    tagline: "领地扩张 · 实时多人对战",
    description:
      "OpenFront 的社区改版：简体中文界面、本地账号、成就系统与自定义大厅。多人在同一张世界地图上扩张领土、结盟与开战。",
    cover: openFrontCover,
    tags: ["RTS", "多人", "中文"],
    status: "playable",
    play: "https://openfront.schurfroggy.art/",
    repo: "https://github.com/Schurfroggy/OpenFrontFroggy",
  },
  {
    slug: "minecraftcaicai",
    title: "我的世界猜词",
    tagline: "Minecraft 猜猜我是谁 · 单人益智",
    description:
      "从 2,436 条 Minecraft 词条中猜出隐藏答案，根据名称、加入版本、类型、标签、特征、字数与维度的颜色提示逐步推理。支持无限猜测、自定义范围与历史记录。",
    cover: minecraftCaicaiCover,
    tags: ["Minecraft", "猜词", "中文"],
    status: "playable",
    play: "https://minecraftcaicai.terrencelamnerds.workers.dev/",
  },
];
