/**
 * Full-viewport cursor trail (canvas).
 * Light: discrete rainbow mini-sparkles along the path (no continuous line), smoothed positions.
 * Dark: sparkle particles + screen blend. Pointer-events none; respects reduced motion + coarse pointer.
 */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  rot: number;
  spin: number;
  size: number;
  hueShift: number;
};

type TrailPoint = {
  x: number;
  y: number;
  life: number;
};

const MAX_PARTICLES = 96;
const SPAWN_EVERY_MS = 22;
const MIN_MOVE_PX = 3;

/** Light ribbon: fewer raw samples + time gate reduces “hair” jitter from oversampling. */
const MIN_MOVE_PX_LIGHT = 9;
const SPAWN_EVERY_MS_LIGHT = 28;
const MAX_TRAIL_POINTS = 44;
const TRAIL_LIFE_DECAY = 0.024;
const TRAIL_SPAWN_LIFE = 1;

function parseCssColor(prop: string): { r: number; g: number; b: number } {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(prop)
    .trim();
  if (!raw) return { r: 53, g: 53, b: 56 };
  if (raw.startsWith("#")) {
    const hex = raw.slice(1);
    const full =
      hex.length === 3
        ? hex
            .split("")
            .map(c => c + c)
            .join("")
        : hex;
    const n = parseInt(full, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  const m = raw.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (m) {
    return {
      r: Math.round(Number(m[1])),
      g: Math.round(Number(m[2])),
      b: Math.round(Number(m[3])),
    };
  }
  return { r: 53, g: 53, b: 56 };
}

function readAccentRgb(): { r: number; g: number; b: number } {
  return parseCssColor("--accent");
}

function isLightTheme(): boolean {
  return document.documentElement.getAttribute("data-theme") === "light";
}

/** 3-tap blur on polyline vertices (draw-only) to remove high-frequency mouse noise. */
function smoothTrailForDraw(trail: TrailPoint[]): TrailPoint[] {
  const n = trail.length;
  if (n < 2) return trail.slice();
  const out: TrailPoint[] = [];
  for (let i = 0; i < n; i++) {
    const cur = trail[i]!;
    let x = cur.x;
    let y = cur.y;
    if (i > 0 && i < n - 1) {
      const p = trail[i - 1]!;
      const q = trail[i + 1]!;
      x = (p.x + 2 * cur.x + q.x) * 0.25;
      y = (p.y + 2 * cur.y + q.y) * 0.25;
    } else if (i === 0) {
      const q = trail[1]!;
      x = (cur.x * 2 + q.x) / 3;
      y = (cur.y * 2 + q.y) / 3;
    } else {
      const p = trail[n - 2]!;
      x = (p.x + cur.x * 2) / 3;
      y = (p.y + cur.y * 2) / 3;
    }
    out.push({ x, y, life: cur.life });
  }
  return out;
}

function hsla(h: number, s: number, l: number, a: number): string {
  return `hsla(${h % 360}, ${s}%, ${l}%, ${a})`;
}

/** One rainbow sparkle per trail sample (discrete dots, not a polyline). */
function drawRainbowDots(
  ctx: CanvasRenderingContext2D,
  trail: TrailPoint[],
  nowMs: number
): void {
  const pts = smoothTrailForDraw(trail);
  if (pts.length === 0) return;

  const hueShift = (nowMs * 0.02) % 360;
  const n = pts.length;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  for (let i = 0; i < n; i++) {
    const pt = pts[i]!;
    const fade = pt.life * pt.life;
    if (fade < 0.035) continue;

    const headBias = n > 1 ? i / (n - 1) : 1;
    const hue = hueShift + headBias * 300;
    const rot = i * 0.82 + nowMs * 0.00075;
    const s = 1.75 + 6.2 * fade * (0.35 + 0.65 * headBias);

    ctx.save();
    ctx.translate(pt.x, pt.y);
    ctx.rotate(rot);

    ctx.shadowBlur = 13 * fade;
    ctx.shadowColor = hsla(hue, 88, 58, 0.5 * fade);

    ctx.fillStyle = hsla(hue, 82, 72, 0.2 * fade);
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.56, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = hsla(0, 0, 100, 0.42 * fade);
    ctx.lineWidth = 1.35;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(0, s);
    ctx.moveTo(-s, 0);
    ctx.lineTo(s, 0);
    ctx.stroke();

    ctx.strokeStyle = hsla(hue, 90, 54, 0.78 * fade);
    ctx.lineWidth = 1.05;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.48);
    ctx.lineTo(0, s * 0.48);
    ctx.moveTo(-s * 0.48, 0);
    ctx.lineTo(s * 0.48, 0);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = hsla(hue, 96, 64, 0.92 * fade);
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.19, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

function drawSpark(
  ctx: CanvasRenderingContext2D,
  p: Particle,
  rgb: { r: number; g: number; b: number }
): void {
  const t = p.life / p.maxLife;
  const alpha = t * t;
  const { r, g, b } = rgb;
  const wr = Math.min(255, Math.round(r + p.hueShift * 40));
  const wg = Math.min(255, Math.round(g + p.hueShift * 25));
  const wb = Math.min(255, Math.round(b + p.hueShift * 55));

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);

  const s = p.size * (0.6 + 0.4 * alpha);

  ctx.shadowBlur = 10 * alpha;
  ctx.shadowColor = `rgba(${wr},${wg},${wb},${0.55 * alpha})`;

  ctx.strokeStyle = `rgba(255,255,255,${0.35 * alpha})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.lineTo(0, s);
  ctx.moveTo(-s, 0);
  ctx.lineTo(s, 0);
  ctx.stroke();

  ctx.strokeStyle = `rgba(${wr},${wg},${wb},${0.85 * alpha})`;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.55);
  ctx.lineTo(0, s * 0.55);
  ctx.moveTo(-s * 0.55, 0);
  ctx.lineTo(s * 0.55, 0);
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.fillStyle = `rgba(255,255,255,${0.55 * alpha})`;
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

const TRAIL_STORAGE_KEY = "site-trail-enabled";

function isTrailUserEnabled(): boolean {
  const v = localStorage.getItem(TRAIL_STORAGE_KEY);
  if (v === null) return true;
  return v === "1";
}

function setTrailUserEnabled(enabled: boolean): void {
  localStorage.setItem(TRAIL_STORAGE_KEY, enabled ? "1" : "0");
  if (enabled) {
    mount();
  } else {
    disposePrevious?.();
    disposePrevious = null;
  }
  syncTrailToggleButtons();
}

function syncTrailToggleButtons(): void {
  const on = isTrailUserEnabled();
  const label = on ? "Turn off cursor trail" : "Turn on cursor trail";
  for (const id of ["#trail-toggle-btn", "#trail-toggle-btn-mobile"] as const) {
    const el = document.querySelector(id);
    if (!el) continue;
    el.setAttribute("data-trail-on", on ? "true" : "false");
    el.setAttribute("aria-pressed", on ? "true" : "false");
    el.setAttribute("aria-label", label);
    el.setAttribute("title", label);
  }
}

function wireTrailToggleButton(selector: string): void {
  const btn = document.querySelector(selector);
  if (!btn || !(btn instanceof HTMLElement)) return;

  const fresh = btn.cloneNode(true) as HTMLElement;
  btn.replaceWith(fresh);

  const on = isTrailUserEnabled();
  fresh.setAttribute("data-trail-on", on ? "true" : "false");
  fresh.setAttribute("aria-pressed", on ? "true" : "false");
  fresh.setAttribute(
    "aria-label",
    on ? "Turn off cursor trail" : "Turn on cursor trail"
  );
  fresh.setAttribute(
    "title",
    on ? "Turn off cursor trail" : "Turn on cursor trail"
  );

  fresh.addEventListener("click", () => {
    setTrailUserEnabled(!isTrailUserEnabled());
  });
}

function initTrailFromSettings(): void {
  wireTrailToggleButton("#trail-toggle-btn");
  wireTrailToggleButton("#trail-toggle-btn-mobile");
  if (isTrailUserEnabled()) {
    mount();
  } else {
    disposePrevious?.();
    disposePrevious = null;
  }
}

let disposePrevious: (() => void) | null = null;

function mount(): void {
  disposePrevious?.();
  disposePrevious = null;

  if (!isTrailUserEnabled()) {
    return;
  }

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(pointer: coarse)").matches
  ) {
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.className = "site-trail-canvas";
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "10050",
    mixBlendMode: isLightTheme() ? "normal" : "screen",
  } as CSSStyleDeclaration);
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    canvas.remove();
    return;
  }

  const particles: Particle[] = [];
  const trail: TrailPoint[] = [];
  let lastX = 0;
  let lastY = 0;
  let lastSpawn = 0;
  let raf = 0;
  const ac = new AbortController();
  const { signal } = ac;

  const resize = (): void => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();

  const onResize = (): void => resize();
  window.addEventListener("resize", onResize, { signal, passive: true });

  const spawnStars = (x: number, y: number): void => {
    const n = 1 + (Math.random() < 0.35 ? 1 : 0);
    for (let i = 0; i < n; i++) {
      if (particles.length >= MAX_PARTICLES) particles.shift();
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.15 + Math.random() * 0.55;
      const maxLife = 28 + Math.random() * 22;
      particles.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.12,
        life: maxLife,
        maxLife,
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.08,
        size: 3 + Math.random() * 5,
        hueShift: Math.random() - 0.5,
      });
    }
  };

  const pushTrail = (x: number, y: number): void => {
    trail.push({ x, y, life: TRAIL_SPAWN_LIFE });
    while (trail.length > MAX_TRAIL_POINTS) trail.shift();
  };

  const onMove = (e: MouseEvent): void => {
    const now = performance.now();
    const light = isLightTheme();
    const minMove = light ? MIN_MOVE_PX_LIGHT : MIN_MOVE_PX;
    const minMs = light ? SPAWN_EVERY_MS_LIGHT : SPAWN_EVERY_MS;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const dist = Math.hypot(dx, dy);
    if (dist < minMove && now - lastSpawn < minMs) return;
    lastX = e.clientX;
    lastY = e.clientY;
    lastSpawn = now;

    if (light) {
      pushTrail(e.clientX, e.clientY);
    } else {
      spawnStars(e.clientX, e.clientY);
    }
  };

  document.addEventListener("mousemove", onMove, { signal, passive: true });

  const tick = (): void => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const light = isLightTheme();
    const nowMs = performance.now();
    canvas.style.mixBlendMode = light ? "normal" : "screen";

    ctx.clearRect(0, 0, w, h);

    if (light) {
      particles.length = 0;
      for (let i = trail.length - 1; i >= 0; i--) {
        const pt = trail[i]!;
        pt.life -= TRAIL_LIFE_DECAY;
        if (pt.life <= 0) trail.splice(i, 1);
      }
      drawRainbowDots(ctx, trail, nowMs);
    } else {
      trail.length = 0;
      const rgb = readAccentRgb();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]!;
        p.life -= 1;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.018;
        p.vx *= 0.985;
        p.rot += p.spin;
        drawSpark(ctx, p, rgb);
      }
    }

    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  disposePrevious = (): void => {
    cancelAnimationFrame(raf);
    ac.abort();
    canvas.remove();
    disposePrevious = null;
  };
}

document.addEventListener("astro:page-load", initTrailFromSettings);
initTrailFromSettings();

window.addEventListener("storage", e => {
  if (e.key !== TRAIL_STORAGE_KEY) return;
  if (isTrailUserEnabled()) {
    mount();
  } else {
    disposePrevious?.();
    disposePrevious = null;
  }
  syncTrailToggleButtons();
});
