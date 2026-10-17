/**
 * Games shown on `/games`.
 * Add an entry here and drop its preview image into `src/assets/games/` — no page edits needed.
 */
import type { ImageMetadata } from "astro";
import openFrontCover from "@/assets/games/openfront.jpg";

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
    play: "http://124.222.245.42/",
    repo: "https://github.com/Schurfroggy/OpenFrontFroggy",
  },
];
