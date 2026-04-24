import { BACKGROUND_PRESETS, SITE, type BackgroundPreset } from "@/config";

export const BG_PRESET_STORAGE_KEY = "site-bg-preset";

const isPreset = (v: string | null): v is BackgroundPreset =>
  v !== null && (BACKGROUND_PRESETS as readonly string[]).includes(v);

/** Apply saved light-mode background preset to `<html>` (no-op in dark). */
export function applyBgPresetFromStorage(): void {
  const html = document.documentElement;
  const theme = html.getAttribute("data-theme");
  if (theme !== "light") return;

  const saved = localStorage.getItem(BG_PRESET_STORAGE_KEY);
  const preset = isPreset(saved) ? saved : SITE.backgroundPreset;
  html.setAttribute("data-bg-preset", preset);
}

/** Persist and apply preset (when light); in dark only saves for next light session. */
export function setBgPreset(preset: BackgroundPreset): void {
  localStorage.setItem(BG_PRESET_STORAGE_KEY, preset);
  if (document.documentElement.getAttribute("data-theme") === "light") {
    document.documentElement.setAttribute("data-bg-preset", preset);
  }
  window.dispatchEvent(
    new CustomEvent("site-bg-preset", { detail: { preset } })
  );
}
