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
      src,
      label: filenameToLabel(path),
      artwork: artByPathStem.get(stem) ?? id3ByMp3[path] ?? defaultArt,
    };
  })
  .sort((a, b) => a.label.localeCompare(b.label, "en"));
