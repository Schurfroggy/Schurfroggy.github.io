# Feature: Games

> Technical documentation for the **Games** feature at `/games`, implemented on 18/10/2026.
> Companion docs: [GALLERIES.md](GALLERIES.md) · [README.md](README.md)

---

## Table of contents

1. [Overview](#overview)
2. [Files involved](#files-involved)
3. [Data model](#data-model)
4. [How to add a game](#how-to-add-a-game)
5. [Preview images](#preview-images)
6. [Card anatomy](#card-anatomy)
7. [Page layout](#page-layout)
8. [Navigation and visibility flags](#navigation-and-visibility-flags)
9. [External links (HTTP vs HTTPS)](#external-links-http-vs-https)
10. [Verification](#verification)
11. [Known limitations](#known-limitations)
12. [Future extensions](#future-extensions)

---

## Overview

`/games` is a hand-curated gallery of small games and experiments. Each entry is rendered as a
large card with a 16:9 preview image and up to two outbound links: **play** (the live build) and
**repo** (source code).

Design decisions:

- **No content collection.** The roster is a short, typed array in `src/data/games.ts` — no Zod
  schema, no folder-per-entry, no MDX body. Adding a game is one object literal plus one image.
- **Links, not iframes.** Cards open the game in a new tab. Embedding a game would require HTTPS on
  the game host (an iframe served over `http://` inside an `https://` page is blocked as mixed
  content), `allow="fullscreen"`, and a host that does not send `X-Frame-Options: DENY`.
- **Two-column grid** on `md+`, single column below; an odd roster is balanced by a placeholder
  card rather than leaving a hole.

---

## Files involved

| File | Role |
|---|---|
| `src/config.ts` | `SITE.showGames` visibility flag |
| `src/data/games.ts` | `Game` type, `GAMES` array, `GAME_STATUS_LABEL` |
| `src/assets/games/` | Preview images (imported, not `public/`) |
| `src/components/GameCard.astro` | Large card: cover, status pill, tags, action buttons |
| `src/pages/games/index.astro` | Listing page `/games` (hero + grid + placeholder) |
| `src/components/Header.astro` | Desktop nav entry (after `Search`) |
| `src/components/MobileMenu.astro` | Mobile nav entry + `--i` stagger index |
| `src/layouts/Layout.astro` | `title` / `description` / OG tags (consumed via props, unchanged) |

---

## Data model

```ts
export type GameStatus = "playable" | "wip" | "offline";

export type Game = {
  slug: string;          // anchor id on /games; keep it URL-safe
  title: string;
  tagline: string;       // one line under the title
  description: string;   // 1–3 sentences, shown in the card body
  cover: ImageMetadata;  // 16:9 preview, imported from src/assets/games/
  tags: string[];        // rendered as small chips
  status: GameStatus;    // drives the pill label + dot color
  play?: string;         // live build; omit when not publicly playable
  repo?: string;         // source repository
};
```

`GAME_STATUS_LABEL` maps status → Chinese label (`playable` → 可玩, `wip` → 开发中,
`offline` → 维护中). Add a status by extending the union **and** the label map — TypeScript will
flag a missing label.

Current entry:

```ts
{
  slug: "openfrontfroggy",
  title: "OpenFrontFroggy",
  tagline: "领地扩张 · 实时多人对战",
  description: "OpenFront 的社区改版：……",
  cover: openFrontCover,
  tags: ["RTS", "多人", "中文"],
  status: "playable",
  play: "http://124.222.245.42/",
  repo: "https://github.com/Schurfroggy/OpenFrontFroggy",
}
```

---

## How to add a game

1. **Drop the preview image** into `src/assets/games/` — 16:9, at least 1200 px wide
   (e.g. `openfront.jpg`).
2. **Append an object** to `GAMES` in `src/data/games.ts`, importing the image at the top:

   ```ts
   import myGameCover from "@/assets/games/my-game.jpg";
   ```

3. **Run `npm run build`.** No page or component edits are required; the grid and the hero
   counters derive from `GAMES.length`.

Ordering is array order — the first entry renders first. There is no date field and no sorting
logic, so put the game you want seen first at the top.

---

## Preview images

Images live in `src/assets/games/` (not `public/`) so they go through the **Astro Assets**
pipeline. `GameCard.astro` renders:

```astro
<Image
  src={cover}
  widths={[480, 800, 1200]}
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
/>
```

Build-time output for the current cover (source: 230 KB JPEG, 1376×768):

| Variant | Size |
|---|---|
| 480w WebP (srcset) | 21 KB |
| 800w WebP (srcset) | 49 KB |
| 1200w WebP (srcset) | 96 KB |
| 1376w WebP (fallback `src`) | 126 KB |

The `<img>` keeps the intrinsic `width`/`height` (1376×768), so the browser reserves the box before
the image loads.

Notes:

- The card is `aspect-video` with `object-cover`, so a non-16:9 source gets cropped, not stretched.
  Keep the important content away from the top edge — the status pill and a 64 px scrim sit there.
- Images are `loading="lazy"`; the first card is still above the fold on desktop, so keep it small.
- Do **not** import from `public/` — files there skip optimization and are served as-is.

---

## Card anatomy

`src/components/GameCard.astro` renders an `<article>` with two regions:

```
┌───────────────────────────────────────┐
│  cover (aspect-video, hover scale 1.04)│
│                          [● 可玩]      │  ← status pill + 64px top scrim
├───────────────────────────────────────┤
│  Title                                 │
│  Tagline (accent)                      │
│  Description (foreground/65)           │
│  [RTS] [多人] [中文]                    │  ← tag chips
│  [▶ 开始游戏] [GitHub]                  │  ← actions, mt-auto
└───────────────────────────────────────┘
```

Behavior details:

- The **cover itself is a link** — it targets `play`, falling back to `repo`. It carries
  `tabindex="-1"` so keyboard users only stop on the real buttons.
- `开始游戏` renders only when `play` is set; `GitHub` only when `repo` is set. A game with neither
  still renders (text-only card).
- Both buttons use `target="_blank" rel="noopener noreferrer"` and include an `sr-only`
  “（新标签页打开）” hint.
- Status colors: `playable` green, `wip` amber, `offline` gray — defined as scoped classes in the
  component (`status-playable` / `status-wip` / `status-offline`).
- Hover: card lifts 4 px, border and shadow shift to accent, title turns accent.

---

## Page layout

`src/pages/games/index.astro`:

1. **Hero** — aurora orbs + `glow-text` title, description, and two badges (`N games`,
   `N playable now`, the latter hidden when zero are playable).
2. **Grid** — `<ul class="grid grid-cols-1 gap-6 md:grid-cols-2">`; each `<li>` is `h-full` and
   carries `id={game.slug}` + `scroll-mt-28` so `/games#openfrontfroggy` links work.
3. **Placeholder** — rendered only when `gameCount % 2 === 1`, so an odd roster never leaves a
   dangling half-row. Remove the `showComingSoon` branch if you prefer a ragged grid.
4. **Empty state** — when `GAMES` is empty, a short hint points at `src/data/games.ts`.

The hero + aurora styles are scoped to this page (copied from the same pattern used by
`/posts` and `/galleries`); they are not shared CSS, so restyling `/games` cannot break other pages.

---

## Navigation and visibility flags

| Surface | Behavior |
|---|---|
| `src/config.ts` | `showGames: true` — set `false` to remove the nav entry and 404 the page |
| Desktop nav (`Header.astro`) | `<li>` inserted **after** `Search`, styled with the shared `nav-link` class |
| Mobile menu (`MobileMenu.astro`) | Same order; `style="--i:N"` controls the staggered fade-in |
| Page guard | `if (!SITE.showGames) return Astro.redirect("/404")` |
| Sitemap | Automatic — the page is emitted like any other route |
| Search (Pagefind) | Not indexed: `/games` has no `data-pagefind-body` |

> ⚠️ When inserting a nav entry, **renumber the `--i` stagger indices** in `MobileMenu.astro`.
> They are hardcoded `0…8`; a duplicate index makes two links animate at the same time.

---

## External links (HTTP vs HTTPS)

The live game is currently reachable at a bare IP over plain HTTP
(`http://124.222.245.42/`) because the domain has no ICP filing yet.

- A **top-level link** from the HTTPS site to an HTTP URL is allowed by browsers — only a
  subresource (iframe, script, image) would be blocked as mixed content.
- The address bar will show “not secure” on the game page. That is expected until the domain gets
  filed and TLS is issued.
- When that happens, change **only** the `play` string in `src/data/games.ts`.
- If you later want to embed the game instead of linking out, the game host must be HTTPS,
  otherwise the iframe will be silently refused.

---

## Verification

```bash
npm run build     # astro check + astro build + pagefind
```

Checks worth running after editing `games.ts`:

- The build lists the page count and finishes with `0 errors` (a bad `cover` import or a missing
  `description` fails `astro check`).
- `dist/games/index.html` contains one card per entry and the expected `href`s.
- With an odd number of entries, `更多游戏筹备中` appears exactly once.

---

## Known limitations

- **No detail page.** Cards link straight out; there is no `/games/<slug>` route, so a game cannot
  have a long write-up.
- **No filtering or sorting.** Array order is display order; `status` does not reorder anything.
- **Playability is manual.** `status: "playable"` is a label, not a health check — nothing probes
  the game host.
- **No tags page integration.** Game tags are decorative chips; they are not fed into `/tags`.
- **Placeholder assumes a 2-column grid.** If the grid becomes 3 columns, the `% 2` balance breaks.

---

## Future extensions

- Promote games to a content collection (`src/data/games/**/index.md`) if entries grow past ~10 or
  need body copy per game.
- Add `/games/<slug>` with an embeddable player and a “open in new tab” fallback, once the host is
  HTTPS.
- Derive the pill automatically (HEAD request at build time) instead of storing `status` by hand.
- Feed game tags into the global tag index for cross-surface discovery.
