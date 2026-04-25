/**
 * Persists scroll position for blog post detail pages in localStorage and restores
 * on return (full load or View Transitions). Skips when URL has a hash.
 */

const STORAGE_PREFIX = "post-read-pos:v1:";
const MIN_Y_SAVE = 120;
const MIN_MAX_SCROLL = 100;
const NEAR_END_RATIO = 0.985;
const TOAST_MS = 3200;

declare global {
  interface Window {
    __postReadingPositionBound?: true;
  }
}

const normalizePathname = (pathname: string) => {
  const p = pathname || "/";
  if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
  return p;
};

/** `/posts/foo` article vs `/posts` or `/posts/2` list pagination */
const isBlogPostDetailPathname = (pathname: string): boolean => {
  const p = normalizePathname(pathname);
  if (!p.startsWith("/posts")) return false;
  const rest = p === "/posts" ? "" : p.slice("/posts".length).replace(/^\//, "");
  if (rest === "") return false;
  if (/^\d+$/.test(rest)) return false;
  return true;
};

type Stored = { ratio: number; y: number; v: 1 };

const storageKey = (pathname: string) => `${STORAGE_PREFIX}${normalizePathname(pathname)}`;

const readStored = (pathname: string): Stored | null => {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(pathname));
    if (!raw) return null;
    const o = JSON.parse(raw) as Partial<Stored>;
    if (o.v !== 1 || typeof o.ratio !== "number" || !Number.isFinite(o.ratio)) return null;
    return {
      ratio: Math.min(1, Math.max(0, o.ratio)),
      y: typeof o.y === "number" && Number.isFinite(o.y) ? o.y : 0,
      v: 1,
    };
  } catch {
    return null;
  }
};

const maxScrollY = () => {
  const el = document.documentElement;
  return Math.max(0, el.scrollHeight - el.clientHeight);
};

const writeStored = (pathname: string, ratio: number, y: number) => {
  try {
    localStorage.setItem(
      storageKey(pathname),
      JSON.stringify({ ratio, y, v: 1 } satisfies Stored)
    );
  } catch {
    /* quota / private mode */
  }
};

const removeStored = (pathname: string) => {
  try {
    localStorage.removeItem(storageKey(pathname));
  } catch {
    /* ignore */
  }
};

let saveRaf = 0;

const scheduleSave = () => {
  if (saveRaf) return;
  saveRaf = requestAnimationFrame(() => {
    saveRaf = 0;
    const pathname = location.pathname;
    if (!isBlogPostDetailPathname(pathname)) return;
    if (location.hash) return;

    const y = window.scrollY;
    const max = maxScrollY();

    if (max < MIN_MAX_SCROLL) {
      removeStored(pathname);
      return;
    }

    if (y < MIN_Y_SAVE) {
      removeStored(pathname);
      return;
    }

    const ratio = max > 0 ? y / max : 0;
    if (ratio >= NEAR_END_RATIO) {
      removeStored(pathname);
      return;
    }

    writeStored(pathname, ratio, y);
  });
};

const scrollFromStored = (s: Stored) => {
  const max = maxScrollY();
  if (max <= 0) return;
  const y = Math.min(max, Math.round(s.ratio * max));
  window.scrollTo({ left: 0, top: y, behavior: "instant" });
};

let toastEl: HTMLDivElement | null = null;
let lastToastAt = 0;

const showRestoredToast = () => {
  if (typeof document === "undefined") return;
  const now = Date.now();
  if (now - lastToastAt < 900) return;
  lastToastAt = now;
  toastEl?.remove();
  const el = document.createElement("div");
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.className =
    "reading-position-toast fixed bottom-6 left-1/2 z-[60] max-w-[min(90vw,20rem)] -translate-x-1/2 rounded-full border border-border/50 bg-background/95 px-4 py-2 text-center text-sm text-foreground/90 shadow-lg backdrop-blur-md";
  el.textContent = "已恢复上次阅读位置";
  document.body.appendChild(el);
  toastEl = el;
  window.setTimeout(() => {
    el.classList.add("opacity-0", "transition-opacity", "duration-500");
    window.setTimeout(() => {
      el.remove();
      if (toastEl === el) toastEl = null;
    }, 500);
  }, TOAST_MS);
};

const restoreForPathname = (pathname: string): boolean => {
  if (location.hash) return false;
  if (!isBlogPostDetailPathname(pathname)) return false;
  const s = readStored(pathname);
  if (!s) return false;

  const run = () => {
    if (location.hash || normalizePathname(location.pathname) !== normalizePathname(pathname))
      return;
    const again = readStored(pathname);
    if (!again) return;
    scrollFromStored(again);
  };

  queueMicrotask(run);
  requestAnimationFrame(run);
  window.setTimeout(run, 120);
  window.setTimeout(run, 450);

  showRestoredToast();
  return true;
};

const afterSwapOrPageLoad = () => {
  if (location.hash) return;
  const path = location.pathname;
  if (restoreForPathname(path)) return;
  window.scrollTo({ left: 0, top: 0, behavior: "instant" });
};

/** Call once from blog post layout; guards duplicate listeners across VT. */
export const initPostReadingPosition = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.__postReadingPositionBound) return;
  window.__postReadingPositionBound = true;

  document.addEventListener("scroll", scheduleSave, { passive: true });

  document.addEventListener("astro:after-swap", () => {
    afterSwapOrPageLoad();
  });

  document.addEventListener("astro:page-load", () => {
    afterSwapOrPageLoad();
  });
};
