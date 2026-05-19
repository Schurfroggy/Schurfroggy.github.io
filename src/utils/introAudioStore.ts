import { MUSIC_TRACKS, type MusicTrack } from "@/data/musicPlaylist";

export { type MusicTrack } from "@/data/musicPlaylist";

const STORAGE_KEY_VOL = "intro-audio:volume";
const STORAGE_KEY_MODE = "intro-audio:mode";
const DEFAULT_VOLUME = 0.7;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Do not fetch audio until the user plays; avoid eager full-file downloads. */
const PRELOAD_IDLE: HTMLMediaElement["preload"] = "none";
const PRELOAD_PLAYING: HTMLMediaElement["preload"] = "auto";

const loadStoredVolume = (): number => {
  if (typeof window === "undefined" || !window.localStorage)
    return DEFAULT_VOLUME;
  const raw = window.localStorage.getItem(STORAGE_KEY_VOL);
  if (raw === null) return DEFAULT_VOLUME;
  const n = Number(raw);
  if (!Number.isFinite(n)) return DEFAULT_VOLUME;
  return clamp01(n);
};

const loadStoredMode = (): "sequential" | "shuffle" | null => {
  if (typeof window === "undefined" || !window.localStorage) return null;
  const raw = window.localStorage.getItem(STORAGE_KEY_MODE);
  if (raw === "sequential" || raw === "shuffle") return raw;
  return null;
};

/** Full permutation, Fisher–Yates; if avoidFirst is set, first song ≠ avoidFirst (for n>1). */
const newShuffleOrder = (n: number, avoidFirst: number | null): number[] => {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  if (n > 1 && avoidFirst !== null && a[0] === avoidFirst) {
    const k = a.findIndex((v, i) => i > 0 && v !== avoidFirst);
    if (k > 0) [a[0], a[k]] = [a[k]!, a[0]!];
  }
  return a;
};

type Store = {
  tracks: MusicTrack[];
  playMode: "sequential" | "shuffle";
  catalogIndex: number;
  /** indices into `tracks` */
  shuffleOrder: number[];
  posInShuffle: number;
  audio: HTMLAudioElement;
  volume: number;
  listenersBound: boolean;
  hasStarted: boolean;
  /** Catalog index last assigned to `audio.src`, or null before first bind */
  loadedTrackIndex: number | null;
};

export type IntroAudioState = {
  src: string;
  label: string;
  isStream: false;
  playing: boolean;
  hasStarted: boolean;
  currentTime: number;
  duration: number;
  playMode: "sequential" | "shuffle";
  trackIndex: number;
  trackCount: number;
  volume: number;
  artworkUrl: string;
};

export const INTRO_AUDIO_STATE_EVENT = "intro-audio:state";

declare global {
  interface Window {
    __introAudioStore?: Store;
  }
}

const getCatalogIndex = (s: Store): number => {
  if (s.tracks.length === 0) return 0;
  if (s.playMode === "sequential") return s.catalogIndex % s.tracks.length;
  ensureShuffleOrder(s);
  return s.shuffleOrder[s.posInShuffle] ?? 0;
};

const applySrc = (s: Store, wasPlaying: boolean) => {
  const i = getCatalogIndex(s);
  const t = s.tracks[i];
  if (!t) return;

  s.audio.preload = wasPlaying ? PRELOAD_PLAYING : PRELOAD_IDLE;
  const needsNewSrc = s.loadedTrackIndex !== i;
  if (needsNewSrc) {
    s.audio.src = t.src;
    s.loadedTrackIndex = i;
    if (wasPlaying) {
      s.audio.load();
    }
  } else if (wasPlaying) {
    s.audio.load();
  }

  if (wasPlaying) {
    void s.audio.play().catch(() => {
      /* autoplay blocked */
    });
  }
};

const ensureShuffleOrder = (s: Store) => {
  const n = s.tracks.length;
  if (n === 0) return;
  if (s.shuffleOrder.length !== n) {
    const cur =
      s.shuffleOrder.length > 0 && s.posInShuffle < s.shuffleOrder.length
        ? s.shuffleOrder[s.posInShuffle]!
        : 0;
    s.shuffleOrder = newShuffleOrder(n, null);
    const p = s.shuffleOrder.indexOf(cur);
    s.posInShuffle = p >= 0 ? p : 0;
  }
};

const readState = (s: Store): IntroAudioState => {
  const i = getCatalogIndex(s);
  const t = s.tracks[i];
  const d = s.audio.duration;
  const mediaDuration =
    s.loadedTrackIndex !== null && Number.isFinite(d) && d > 0 ? d : 0;
  return {
    src: t?.src ?? "",
    label: t?.label ?? "",
    isStream: false,
    playing: !s.audio.paused,
    hasStarted: s.hasStarted,
    currentTime: s.loadedTrackIndex !== null ? s.audio.currentTime : 0,
    duration: mediaDuration,
    playMode: s.playMode,
    trackIndex: i,
    trackCount: s.tracks.length,
    volume: s.audio.volume,
    artworkUrl: t?.artwork ?? "",
  };
};

export const emitIntroAudioState = (s: Store) => {
  window.dispatchEvent(
    new CustomEvent<IntroAudioState>(INTRO_AUDIO_STATE_EVENT, {
      detail: readState(s),
    })
  );
};

const setVolume = (s: Store, v: number) => {
  const v2 = clamp01(v);
  s.audio.volume = v2;
  s.volume = v2;
  try {
    window.localStorage.setItem(STORAGE_KEY_VOL, String(v2));
  } catch {
    /* ignore */
  }
  emitIntroAudioState(s);
};

const goNext = (s: Store) => {
  const n = s.tracks.length;
  if (n === 0) return;
  if (s.playMode === "sequential") {
    s.catalogIndex = (s.catalogIndex + 1) % n;
  } else {
    ensureShuffleOrder(s);
    if (s.posInShuffle < n - 1) {
      s.posInShuffle++;
    } else {
      const last = s.shuffleOrder[s.posInShuffle] ?? 0;
      s.shuffleOrder = newShuffleOrder(n, last);
      s.posInShuffle = 0;
    }
  }
  if (!s.audio.paused) {
    applySrc(s, true);
  }
  emitIntroAudioState(s);
};

const goPrev = (s: Store) => {
  const n = s.tracks.length;
  if (n === 0) return;
  if (s.playMode === "sequential") {
    s.catalogIndex = (s.catalogIndex - 1 + n) % n;
  } else {
    ensureShuffleOrder(s);
    s.posInShuffle = s.posInShuffle > 0 ? s.posInShuffle - 1 : n - 1;
  }
  if (!s.audio.paused) {
    applySrc(s, true);
  }
  emitIntroAudioState(s);
};

const onEnded = (s: Store) => {
  const n = s.tracks.length;
  if (n === 0) return;
  if (s.playMode === "sequential") {
    s.catalogIndex = (s.catalogIndex + 1) % n;
    applySrc(s, true);
  } else {
    ensureShuffleOrder(s);
    if (s.posInShuffle < n - 1) {
      s.posInShuffle++;
    } else {
      const last = s.shuffleOrder[s.posInShuffle] ?? 0;
      s.shuffleOrder = newShuffleOrder(n, last);
      s.posInShuffle = 0;
    }
    applySrc(s, true);
  }
  emitIntroAudioState(s);
};

const setPlayMode = (s: Store, mode: "sequential" | "shuffle") => {
  if (s.tracks.length === 0) return;
  if (s.playMode === mode) {
    emitIntroAudioState(s);
    return;
  }
  const cur = getCatalogIndex(s);
  s.playMode = mode;
  if (mode === "shuffle") {
    s.shuffleOrder = newShuffleOrder(s.tracks.length, null);
    const p = s.shuffleOrder.indexOf(cur);
    s.posInShuffle = p >= 0 ? p : 0;
  } else {
    s.catalogIndex = cur;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY_MODE, mode);
  } catch {
    /* ignore */
  }
  const was = !s.audio.paused;
  if (s.loadedTrackIndex !== null) {
    applySrc(s, was);
  }
  emitIntroAudioState(s);
};

const bind = (s: Store) => {
  if (s.listenersBound) return;
  s.listenersBound = true;
  const emit = () => emitIntroAudioState(s);
  s.audio.addEventListener("play", () => {
    s.hasStarted = true;
    emit();
  });
  s.audio.addEventListener("pause", emit);
  s.audio.addEventListener("ended", () => {
    onEnded(s);
  });
  s.audio.addEventListener("timeupdate", emit);
  s.audio.addEventListener("loadedmetadata", emit);
  s.audio.addEventListener("durationchange", emit);
  s.audio.addEventListener("volumechange", emit);
};

export const getIntroAudioStore = () => {
  const existing = window.__introAudioStore;
  if (existing) {
    bind(existing);
    emitIntroAudioState(existing);
    return existing;
  }

  const tracks = MUSIC_TRACKS;
  const storedMode = loadStoredMode();
  const vol = loadStoredVolume();

  const n = tracks.length;
  const initialMode: "sequential" | "shuffle" = storedMode ?? "sequential";
  const initialShuffle =
    initialMode === "shuffle" && n > 0 ? newShuffleOrder(n, null) : [];
  const audio = new Audio();
  audio.preload = PRELOAD_IDLE;
  audio.volume = vol;

  const s: Store = {
    tracks,
    playMode: n > 0 ? initialMode : "sequential",
    catalogIndex: 0,
    shuffleOrder: initialShuffle,
    posInShuffle: 0,
    audio,
    volume: vol,
    listenersBound: false,
    hasStarted: false,
    loadedTrackIndex: null,
  };

  if (initialMode === "shuffle" && n > 0) {
    s.posInShuffle = 0;
  }

  bind(s);
  window.__introAudioStore = s;
  emitIntroAudioState(s);
  return s;
};

export const storeGoNext = () => {
  const s = getIntroAudioStore();
  goNext(s);
};

export const storeGoPrev = () => {
  const s = getIntroAudioStore();
  goPrev(s);
};

export const storeSetVolume = (v: number) => {
  const s = getIntroAudioStore();
  setVolume(s, v);
};

export const storeSetPlayMode = (mode: "sequential" | "shuffle") => {
  const s = getIntroAudioStore();
  setPlayMode(s, mode);
};

export const storeToggle = () => {
  const s = getIntroAudioStore();
  if (s.audio.paused) {
    if (s.loadedTrackIndex === null && s.tracks.length > 0) {
      applySrc(s, true);
      emitIntroAudioState(s);
      return;
    }
    s.audio.preload = PRELOAD_PLAYING;
    void s.audio.play().catch(() => {});
  } else {
    s.audio.pause();
  }
};

export const storeSeek = (t: number) => {
  const s = getIntroAudioStore();
  if (s.loadedTrackIndex === null) return;
  s.audio.currentTime = t;
  emitIntroAudioState(s);
};
