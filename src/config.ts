/** Light-mode page background diagonal gradient. Dark mode stays solid (see `global.css`). */
export const BACKGROUND_PRESETS = [
  "yellow",
  "blue",
  "green",
  "pink",
  "purple",
] as const;
export type BackgroundPreset = (typeof BACKGROUND_PRESETS)[number];

export const SITE = {
  website: "https://devosfera.vercel.app/",
  author: "SchurNewYorkFroggy",
  profile: "https://github.com/schurfroggy",
  desc: "A space where curiosity becomes code. Exploring web development, software architecture and everything that makes the tech world spin.",
  title: "Schurfroggy的小屋",
  ogImage: "devosfera-og.webp", // located in the public folder
  lightAndDarkMode: true,
  /** Light: diagonal gradient preset. Dark: unchanged solid theme. */
  backgroundPreset: "blue" satisfies BackgroundPreset,
  postPerIndex: 6,
  postPerPage: 12,
  showArchives: true,
  showGalleries: true,
  showGalleriesInIndex: true, // Show galleries in the general paginated list (only if showGalleries is true)
  showBackButton: true, // show back button in post detail
  heroTerminalPrompt: {
    prefix: "~", // highlighted part on the left
    path: "/ready-to-go", // central prompt text
    suffix: "$", // terminal symbol on the right
  },
  /** Homepage hero lines under the title: auto-rotate + click for next (see `heroTaglineIntervalMs`). */
  heroTaglineIntervalMs: 20_000,
  heroTaglines: [
    "🐊🐊🐊我是最神奇的猫咪🐊🐊🐊",
    "🐊🐊🐊你我一起 改变世界🐊🐊🐊",
    "🐊🐊🐊不做无法实现的梦🐊🐊🐊",
    "🐊🐊🐊Bombardino Crocodilo🐊🐊🐊",
    "🐊🐊🐊混乱将随后而至🐊🐊🐊",
    "🐊🐊🐊饿啊🐊🐊🐊",
    "🐊🐊🐊🐊🐊🐊🐊🐊🐊",
  ],
  backdropEffects: {
    cursorGlow: false, // cursor tracking with soft halo
    grain: false, // background noise layer (off)
    trail: true, // cursor trail: light rainbow dots / dark sparks (canvas)
  },
  editPost: {
    enabled: true,
    text: "Edit this post",
    url: "https://github.com/Schurfroggy/Schurfroggy.github.io/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Shanghai", // 北京时间（IANA）https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  /** Home + header music: `src/assets/music/*.mp3` (see `src/data/musicPlaylist.ts`). */
  introAudio: {
    enabled: true,
  },
  /** CDN TLS certificate `notAfter` (Asia/Shanghai). Footer shows days until / since expiry. */
  sslCertExpiresAt: "2026-07-25T07:59:59+08:00",
} as const;
