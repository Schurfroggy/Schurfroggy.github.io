/**
 * Local music: `src/assets/music/*.mp3` (Vite `?url`).
 * All tracks share `default.png` as cover art.
 */
import defaultArt from "../assets/music/default.png?url";

const audioModules = import.meta.glob<string>("../assets/music/*.mp3", {
  eager: true,
  import: "default",
  query: "?url",
});

function filenameToLabel(path: string): string {
  const base = path.split("/").pop() ?? "Track";
  return base.replace(/\.mp3$/i, "").replace(/_/g, " ");
}

export type MusicTrack = {
  src: string;
  label: string;
  /** Shared cover image URL */
  artwork: string;
};

export const MUSIC_ARTWORK = defaultArt;

export const MUSIC_TRACKS: MusicTrack[] = Object.entries(audioModules)
  .map(([path, src]) => ({
    src,
    label: filenameToLabel(path),
    artwork: MUSIC_ARTWORK,
  }))
  .sort((a, b) => a.label.localeCompare(b.label, "en"));
