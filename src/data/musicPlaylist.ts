/**
 * Local music: `src/assets/music/*.mp3` (Vite `?url`).
 * Cover priority: (1) sidecar image same stem as mp3, (2) id3 from `predev`/`prebuild` (see
 * `scripts/extract-music-covers.mjs` → `musicCoverByMp3Path.json` + `public/music-covers-extracted/`),
 * (3) `default-art.jpg`.
 */
import defaultArt from "../assets/music/default-art.jpg?url";
import id3Covers from "./musicCoverByMp3Path.json" with { type: "json" };

const audioModules = import.meta.glob<string>("../assets/music/*.mp3", {
  eager: true,
  import: "default",
  query: "?url",
});

const imageModules = import.meta.glob<string>(
  "../assets/music/*.{png,jpg,jpeg,webp,svg}",
  {
    eager: true,
    import: "default",
    query: "?url",
  }
);

const pathNoExt = (p: string) => {
  const i = p.lastIndexOf(".");
  return i > 0 ? p.slice(0, i) : p;
};

/** Map basename-without-ext → art URL (images only; `default-art` used as fallback, not a track key). */
const artByPathStem = new Map<string, string>();
for (const [p, url] of Object.entries(imageModules)) {
  if (p.includes("default-art.")) continue;
  artByPathStem.set(pathNoExt(p), url);
}

const id3ByMp3 = id3Covers as Record<string, string>;

/** `astro dev` always uses Vite URLs from `src/assets/music`. */
const normalizeMusicCdnOrigin = (raw: string | undefined): string | null => {
  if (!raw || typeof raw !== "string") return null;
  const t = raw.trim();
  if (!t) return null;
  const withScheme = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  return withScheme.replace(/\/+$/, "");
};

/**
 * When `PUBLIC_MUSIC_CDN_ORIGIN` is set at build time, point audio at CDN while keeping the same path as on Pages (CDN origin → GitHub).
 */
const rewriteAudioSrcForCdn = (viteUrl: string): string => {
  if (import.meta.env.DEV) return viteUrl;
  const origin = normalizeMusicCdnOrigin(
    import.meta.env.PUBLIC_MUSIC_CDN_ORIGIN
  );
  if (!origin) return viteUrl;
  try {
    const pathFromUrl = new URL(
      viteUrl,
      "https://placeholder.local"
    ).pathname;
    return `${origin}${pathFromUrl}`;
  } catch {
    return viteUrl;
  }
};

function filenameToLabel(path: string): string {
  const base = path.split("/").pop() ?? "Track";
  return base.replace(/\.mp3$/i, "").replace(/_/g, " ");
}

export type MusicTrack = {
  src: string;
  label: string;
  /** Resolved cover image URL */ artwork: string;
};

export const MUSIC_TRACKS: MusicTrack[] = Object.entries(audioModules)
  .map(([path, src]) => {
    const stem = pathNoExt(path);
    return {
      src: rewriteAudioSrcForCdn(src),
      label: filenameToLabel(path),
      artwork: artByPathStem.get(stem) ?? id3ByMp3[path] ?? defaultArt,
    };
  })
  .sort((a, b) => a.label.localeCompare(b.label, "en"));
