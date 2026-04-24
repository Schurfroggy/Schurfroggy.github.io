# Schurfroggy’s hut (Devosfera)

**[简体中文 README](README.zh-CN.md)**

This repository is the source of **[Schurfroggy的小屋](https://devosfera.vercel.app/)**—a static personal site for notes on development, software, and the occasional gallery. I’m [Schur NewYork Froggy](https://github.com/schurfroggy): a developer and graduate student who documents what I learn and what I build.

*A space where curiosity becomes code. Exploring web development, software architecture and everything that makes the tech world spin.* — as the tagline in [`src/config.ts`](src/config.ts) puts it.

If you are reading this for **how the site is built** rather than who I am, the sections below still cover the layout of the project, the scripts I run every day, and how posts and embeds are authored.

![Site social preview](public/devosfera-og.webp)

> The UI started from a heavily customized [AstroPaper](https://github.com/satnaing/astro-paper) fork (glass UI, galleries, search, and more). You are welcome to reuse the stack; the license and upstream credits are at the bottom of this file.

---

## On the live site

- **Posts** on tech topics, with tags, RSS, and optional [featured](https://devosfera.vercel.app/) items on the home page.
- **Galleries** of images with a lightbox at `/galleries`, and a mixed feed of posts and albums in the archives, lists, and RSS when enabled in config.
- **Search** with ⌘K / Ctrl+K (Pagefind; the index is produced when you run a **production build**).
- **Intro music** in the header and hero, driven by `src/data/musicPlaylist.ts` and `src/assets/music/*.mp3` (covers are updated by a pre-build script; see *Commands*).
- An **[About](https://devosfera.vercel.app/about/)** page for a bit more on me, games, and this blog’s purpose.

More visual and design notes live in [CUSTOMIZATIONS.md](CUSTOMIZATIONS.md). Gallery and album behavior are documented in [GALLERIES.md](GALLERIES.md).

---

## Project structure

```
/
├── public/
│   ├── audio/                  # e.g. intro SFX
│   ├── pagefind/               # search index (copied here after `npm run build`)
│   └── music-covers-extracted/ # ID3 art for the player (regenerated in prebuild)
├── scripts/                    # e.g. extract-music-covers
├── src/
│   ├── assets/                 # fonts, icons, images, gifs, music, default art
│   ├── components/             # Astro + MDX components
│   ├── data/
│   │   ├── blog/               # posts: .md / .mdx
│   │   ├── galleries/          # one folder per album (see GALLERIES.md)
│   │   ├── musicPlaylist.ts   # home / header music list
│   │   └── musicCoverByMp3Path.json
│   ├── layouts/
│   ├── pages/
│   ├── styles/                 # global + typography
│   └── utils/
└── astro.config.ts
```

---

## Local development

**Requirements:** Node.js 20+ and a package manager (`npm` or `pnpm` both work; the repo may contain more than one lockfile).

```bash
npm install
npm run dev
# → http://localhost:4321
```

**Search in dev:** Pagefind is generated only in the production build. After a successful build, `public/pagefind/` is populated, so you can use `npm run build` and then `npm run preview` (or `dev`) to test ⌘K search.

### Docker

```bash
docker build -t devosfera-blog .
docker run -p 4321:80 devosfera-blog
```

---

## Commands

| Command | Action |
| :------ | :----- |
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server at `http://localhost:4321` |
| `npm run build` | Runs `extract-music-covers` (prebuild) → `astro check` + build → Pagefind, then copies the index to `public/pagefind/` |
| `npm run preview` | Serves the production build locally |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting without writing |
| `npm run lint` | ESLint |

Replace `npm` with `pnpm` if you use the pnpm lockfile. The prebuild music script keeps cover art in `public/music-covers-extracted/` in sync with your MP3s; it runs automatically before `dev` and `build` via npm lifecycle hooks.

---

## Configuration, content & components

This section is for **tuning the site** and **writing** posts, galleries, and embeds. Global behavior lives in `src/config.ts` (`SITE`) and `src/constants.ts` (social and share links). Deeper design toggles and typography are summarized in [CUSTOMIZATIONS.md](CUSTOMIZATIONS.md); gallery details in [GALLERIES.md](GALLERIES.md).

### Writing posts (`src/data/blog/`)

Create a `.md` or `.mdx` file with at least the following frontmatter (full schema: `src/content.config.ts`):

```yaml
---
title: "Post title"
pubDatetime: 2026-01-15T10:00:00Z   # required — ISO 8601 with timezone
description: "Short description for SEO and cards"
tags: ["astro", "dev"]
featured: false       # true = show in the home “Featured” strip
draft: false          # hidden in production
timezone: "America/Guatemala"  # overrides SITE.timezone
hideEditPost: false
---
```

- **MDX:** JSX is allowed; the gallery component below is globally available in `.mdx` (no import).
- **Table of contents:** add a `## Table of contents` heading; `remark-toc` + `remark-collapse` will generate a collapsible TOC.
- **Annotated code** (Shiki), e.g. `// [!code highlight]`, `// [!code ++]`, `fileName: example.ts`.

### Galleries (`src/data/galleries/`)

1. Create `src/data/galleries/<slug>/`.
2. Add `index.md` plus your images; use `01-`, `02-`, … prefixes to fix order.
3. Public URL: `/galleries/<slug>`. Turn albums on in `SITE.showGalleries` and, if you like, mix them into the home and list pages with `SITE.showGalleriesInIndex`.

For frontmatter, covers, and image optimization, see [GALLERIES.md](GALLERIES.md).

### The `GalleryEmbed` component (MDX)

Embed an album **inside a post** without an import:

```mdx
<GalleryEmbed slug="my-trip-to-tokyo" />
```

Optional props: `limit` (`0` = all), `cols` (`2` \| `3` \| `4`), `showLink`. For edge cases, props reference, and lightbox behavior, see [GALLERIES.md](GALLERIES.md#galleryembed--gallery-inside-mdx-posts).

---

## Credits, upstream fixes & license

Theme foundation: [AstroPaper](https://github.com/satnaing/astro-paper) by [Sat Naing](https://satnaing.dev). The MIT license in [LICENSE](LICENSE) applies. This fork’s custom work carries its own copyright line in that file; see also [CUSTOMIZATIONS.md](CUSTOMIZATIONS.md).

Fixes and features merged from the upstream AstroPaper tracker (this codebase):

| Issue | Note |
| :---- | :--- |
| [#614](https://github.com/satnaing/astro-paper/issues/614) | “Back to top” and pagination when share links are empty — `BackToTopButton.astro` |
| [#574](https://github.com/satnaing/astro-paper/issues/574) | Table overflow on mobile — `typography.css` (thanks [GladerJ](https://github.com/GladerJ)) |
| [#569](https://github.com/satnaing/astro-paper/issues/569) | Consistent back-to-top on desktop — `BackToTopButton.astro`, `PostDetails.astro` |
| [#566](https://github.com/satnaing/astro-paper/issues/566) | Share links in new tab — [PR #611](https://github.com/satnaing/astro-paper/pull/611) |
| [#131](https://github.com/satnaing/astro-paper/issues/131) | MDX with `@astrojs/mdx` — `astro.config.ts`, `content.config.ts` |
| [#495](https://github.com/satnaing/astro-paper/issues/495) | Timezone-aware post filtering — `postFilter.ts` (see [kj-9’s reference](https://github.com/satnaing/astro-paper/compare/main...kj-9:astro-paper:fix-post-filter-date)) |
| [#553](https://github.com/satnaing/astro-paper/issues/553) | Galleries section, lightbox, `GalleryEmbed` — [GALLERIES.md](GALLERIES.md) |

If something here helps your own project, a star on the original AstroPaper or a mention in your README is a nice way to pass it on.
