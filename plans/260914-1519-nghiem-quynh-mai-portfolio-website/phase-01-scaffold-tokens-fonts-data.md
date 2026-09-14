---
phase: 1
title: "Scaffold Tokens Fonts Data"
status: completed
effort: "3h"
dependencies: []
---

# Phase 1: Scaffold Tokens Fonts Data

## Context

- `docs/tech-stack.md` — approved stack and integration rules
- `docs/design-guidelines.md` — token table, typography scale, paper texture spec
- `docs/content-source.md` — all copy, asset list
- `plans/reports/researcher-260914-1519-animation-stack-options-report.md`

## Overview

Priority P1. Create the Astro project, the design-token layer, self-hosted fonts, the paper texture,
and the typed content foundation. Nothing visual ships yet beyond a blank paper page; every later
phase depends on the token names, the shared content atoms and the image resolver fixed here.

## Requirements

Functional
- `pnpm dev` serves a blank paper-coloured page at `localhost:4321` with fonts and noise applied.
- `pnpm build` emits a static output folder with 0 KB of JS.
- Hero, nav and site metadata have real JSON; later phases create their own section JSON.
- Images are importable through one helper, addressed by filename from JSON.

Non-functional
- Every file < 200 lines. Kebab-case filenames.
- No Tailwind, no CSS-in-JS, no UI library.
- `astro check` passes with zero errors.
- No third-party origin at runtime: fonts are bundled, not fetched from Google.

## Architecture

```
Data flow:  src/data/*.json --typed by--> src/types/content.ts
                   |
                   |- section props --> src/components/sections/*.astro (phases 3-5)
                   +- image filename --> src/lib/image-map.ts --> ImageMetadata --> <Image>

Style flow: tokens.css (custom properties, no selector but :root)
                   +--> global.css (reset, type scale, utilities, body::before noise)
                             +--> scoped <style> per component (may only read var(--*))

Font flow:  @fontsource/*  --> base-layout frontmatter import --> Vite bundles woff2 + hashes URLs
```

`base-layout.astro` is the only place that emits `<head>`, imports fonts and global stylesheets, and
(from phase 6) loads the motion entry script.

**Type ownership.** `src/types/content.ts` is created here with the shared atoms plus the three
interfaces this phase needs. Phases 3, 4 and 5 **append** their own interfaces to the same file.
Nobody fills a stub someone else declared, so no phase blocks on another's type edit.

## Related Code Files

Create
- `package.json`, `pnpm-lock.yaml` (generated)
- `astro.config.mjs`, `tsconfig.json`, `env.d.ts`
- `src/layouts/base-layout.astro`
- `src/styles/tokens.css`, `src/styles/global.css`
- `src/types/content.ts` — atoms + `SiteMeta`, `NavContent`, `HeroContent` only
- `src/lib/image-map.ts`
- `src/data/site.json`, `src/data/nav.json`, `src/data/hero.json` — only these three; phases 3-5 create the rest
- `src/pages/index.astro` (minimal shell; phase 3 takes ownership)
- `public/favicon.svg`
- `README.md` (stub; phase 7 completes it)

Modify
- `.gitignore` — already covers `node_modules/`, build output, `.astro/`; no change expected

Move
- `public/images/*.png` -> `src/assets/images/*.png` (13 files)

No `.npmrc`: pnpm 10 already defaults `auto-install-peers=true`, so the file would be noise.

## Implementation Steps

1. **Init.** `pnpm create astro@latest . -- --template minimal --no-install --no-git --typescript strict`, then overwrite `package.json` with the pinned set below (all versions verified on npm 2026-09-14):

```json
{
  "name": "nghiem-quynh-mai-portfolio",
  "type": "module",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "@fontsource/be-vietnam-pro": "5.3.0",
    "@fontsource/protest-guerrilla": "5.3.0",
    "astro": "7.3.2",
    "gsap": "3.15.0",
    "lenis": "1.3.26"
  },
  "devDependencies": {
    "@astrojs/check": "0.9.10",
    "sharp": "0.35.4",
    "typescript": "6.0.3"
  }
}
```

   `typescript` is pinned to 6.0.3 on purpose. `@astrojs/check@0.9.10` declares
   `peerDependencies: { typescript: "^5.0.0 || ^6.0.0" }` while npm `latest` is 7.0.2, so an
   unpinned install prints an unmet-peer warning and puts `astro check` on an unsupported compiler.
   Pinning keeps the type check trustworthy.

2. **`astro.config.mjs`.** Vercel is the only host, so `base` stays `/` and no base-path plumbing is
   needed anywhere. `site` exists purely so `Astro.site` can build the canonical and OG URLs.

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',   // PLACEHOLDER: final domain, used for canonical + og:url
  output: 'static',
});
```

   Nothing else belongs here. `build.assets` and `image.responsiveStyles` were considered and
   dropped: the defaults are correct, and `responsiveStyles` is inert when the images use `densities`.

3. **`tsconfig.json`** extends `astro/tsconfigs/strict`, sets `"baseUrl": "."` and these paths:

```json
{
  "paths": {
    "@layouts/*":    ["src/layouts/*"],
    "@components/*": ["src/components/*"],
    "@data/*":       ["src/data/*"],
    "@styles/*":     ["src/styles/*"],
    "@types/*":      ["src/types/*"],
    "@lib/*":        ["src/lib/*"]
  }
}
```

   `resolveJsonModule` comes from the preset; verify it is on.

4. **Move images.** `mkdir -p src/assets/images && git mv public/images/*.png src/assets/images/`. Leave `public/` for `favicon.svg` and (phase 7) `robots.txt`.

5. **`src/lib/image-map.ts`** (~20 lines) — one eager glob, filename to `ImageMetadata`:

```ts
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/*.png',
  { eager: true },
);

const byName = new Map<string, ImageMetadata>(
  Object.entries(files).map(([path, mod]) => [path.split('/').pop()!, mod.default]),
);

export function image(name: string): ImageMetadata {
  const found = byName.get(name);
  if (!found) throw new Error(`Unknown image "${name}" — check src/data/*.json`);
  return found;
}
```

   The build-time `throw` is deliberate: a typo in JSON fails the build instead of shipping a broken `<img>`.

6. **`src/styles/tokens.css`** — copy the token block from `docs/design-guidelines.md` verbatim, then add the scale tokens the components need:

```css
:root {
  --paper: #F5F3EE; --paper-2: #EDE9E0;
  --red: #C8102E; --maroon: #8B1A1A; --ink: #1A1A1A; --muted: #7A7269;
  --white: #FFFFFF;
  --shadow: 0 6px 18px rgba(26,26,26,.14);
  --shadow-lg: 0 14px 34px rgba(26,26,26,.22);
  --radius: 4px;
  --tilt-1: -4deg; --tilt-2: 3deg; --tilt-3: -2deg; --tilt-4: 6deg;

  --font-display: 'Protest Guerrilla', Impact, sans-serif;
  --font-body: 'Be Vietnam Pro', system-ui, sans-serif;
  --fs-h1: clamp(3.5rem, 9vw, 8rem);
  --fs-h2: clamp(2.5rem, 6vw, 5rem);
  --fs-h3: clamp(1.25rem, 2.4vw, 1.75rem);
  --fs-body: clamp(1rem, 1.1vw, 1.0625rem);
  --fs-meta: 0.8125rem;
  --lh-display: .95; --lh-body: 1.65;
  --measure: 62ch;
  --container: 1200px;
  --pad-x: clamp(1rem, 5vw, 4rem);
  --section-y: clamp(4.5rem, 12vw, 10rem);
  --gap: clamp(1rem, 2.5vw, 2rem);
}
```

7. **`src/styles/global.css`** (< 160 lines): box-sizing reset, margin reset, `-webkit-text-size-adjust: 100%`, `body { background: var(--paper); color: var(--maroon); font: 400 var(--fs-body)/var(--lh-body) var(--font-body) }`, display-heading rules (`font-family: var(--font-display); color: var(--red); text-transform: uppercase; line-height: var(--lh-display)`), `p { max-width: var(--measure) }`, `img { display:block; max-width:100%; height:auto }`, utilities `.container`, `.section`, `.visually-hidden`, `.skip-link`, and:

```css
:focus-visible { outline: 3px solid var(--maroon); outline-offset: 3px; }
html { scroll-behavior: smooth; }   /* phase 6 narrows this to html:not(.lenis) */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .001ms !important; transition-duration: .001ms !important; }
}
body::before {                       /* paper grain, per design-guidelines */
  content: ''; position: fixed; inset: 0; z-index: 9999;
  pointer-events: none; mix-blend-mode: multiply; opacity: .06;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

8. **Fonts, self-hosted.** In `base-layout.astro` frontmatter, above the stylesheet imports:

```ts
import '@fontsource/protest-guerrilla/400.css';
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import '@styles/tokens.css';
import '@styles/global.css';
```

   **Import the weight files, never the per-subset files.** Verified on the published packages:
   `400.css` carries one `@font-face` per subset *with* `unicode-range` (Protest Guerrilla: 5 subsets;
   Be Vietnam Pro: latin, latin-ext, vietnamese), so the browser downloads only the subsets the page
   actually uses. The per-subset files (`vietnamese-400.css`, `latin-400.css`) declare the same family
   and weight with **no** `unicode-range`; importing two of them makes the later rule shadow the
   earlier one, and Vietnamese glyphs fall through to the Impact fallback. Fontsource already sets
   `font-display: swap` in every rule, so nothing extra is needed.

   Expected download for this page, woff2, verified file sizes:

   | Face | Vietnamese | Latin |
   |------|-----------|-------|
   | Protest Guerrilla 400 | 7.5 KB | 19.1 KB |
   | Be Vietnam Pro 400 | 11.5 KB | 21.2 KB |
   | Be Vietnam Pro 600 | 12.2 KB | 22.0 KB |
   | Be Vietnam Pro 700 | 12.5 KB | 22.2 KB |

   About 128 KB total. Weight 700 is not referenced by any token in step 6; phase 7 re-checks and
   drops the import if it is still unused, saving ~35 KB.

9. **`src/layouts/base-layout.astro`** (< 90 lines). Props `{ title, description, lang = 'vi' }`. Head
   holds charset, viewport, title, description, `og:*` + `twitter:card` from `site.json`, canonical
   from `Astro.site`, and the favicon. No `preconnect`, no external stylesheet — the fonts are in the
   bundle. Body: `<a class="skip-link" href="#main">Bỏ qua tới nội dung</a>`, `<slot name="nav" />`,
   `<main id="main">`, `<slot />`, `<slot name="footer" />`. Phase 6 adds one inline head script and
   one module script here.

10. **`src/types/content.ts`** (< 80 lines in this phase) — shared atoms plus the three interfaces
    used now. `Picture` carries an optional explicit width so data can override the component default:

```ts
export interface Sticker { label: string; tone?: 'red' | 'maroon'; }
export interface Picture {
  src: string; alt: string; caption?: string;
  tilt?: 1 | 2 | 3 | 4;
  width?: number;          // overrides the polaroid default; charts use 720
}
export interface Metric { value: string; label: string; note?: string; }
export interface SectionMeta { id: string; index: string; title: string; subtitle?: string; }

export interface SiteMeta { title: string; description: string; ogImage: string; }
export interface NavContent { brand: string; items: { id: string; label: string }[]; }
export interface HeroContent {
  name: string; role: string; tagline: string[]; oneLiner: string;
  stamp: string; photo: Picture; scrollCue: string;
  quickLinks: { label: string; href: string }[];
}
```

11. **`src/data/site.json`, `nav.json`, `hero.json`** — real content now (phase 3 uses them
    immediately). Anchor ids are fixed here and every later phase must match them:
    `about, branding, strategy, seo, social, ugc, ai-first, contact`. Hero is reachable through the
    nav brand sticker, so it is not a list item. Consumption pattern, identical everywhere:

```astro
---
import raw from '@data/hero.json';
import type { HeroContent } from '@types/content';
const hero = raw as HeroContent;
---
```

12. **`src/pages/index.astro`** minimal: import `BaseLayout` from `@layouts/base-layout.astro`, render an empty `<main>`. Phase 3 owns it afterwards.

13. **`README.md` stub** — project name, `pnpm install / dev / build`, one line: content lives in `src/data/*.json`. Phase 7 expands it.

14. **Verify.** `pnpm install && pnpm check && pnpm build`, confirm the built HTML has no `<script` tag,
    and confirm the emitted font files include `protest-guerrilla-vietnamese-400-normal` — its absence
    means the wrong CSS entry was imported.

## Todo List

- [ ] package.json pinned, `pnpm install` clean (no unmet-peer warning)
- [ ] astro.config.mjs: site + output only
- [ ] tsconfig paths incl. `@layouts/*`
- [ ] images moved to `src/assets/images/`, `public/` holds only the favicon
- [ ] image-map.ts throws on unknown name
- [ ] tokens.css + global.css
- [ ] fonts imported from the weight CSS files, not the subset files
- [ ] base-layout.astro with skip-link and noise, zero external origins
- [ ] types/content.ts: atoms + SiteMeta/NavContent/HeroContent
- [ ] site.json, nav.json, hero.json
- [ ] README stub

## Success Criteria

- [ ] `pnpm build` exits 0; built HTML contains no `<script>` tag and no `fonts.googleapis.com`
- [ ] `pnpm check` reports 0 errors, 0 warnings
- [ ] Built assets include a `*-vietnamese-400-normal.woff2` for both families
- [ ] Page background renders `#F5F3EE` with visible grain; DevTools Network shows the Vietnamese woff2 requested
- [ ] A test heading `NGHIÊM QUỲNH MAI` renders with correct diacritics in Protest Guerrilla (keep the screenshot for phase 7 comparison)
- [ ] Pointing any image name in JSON at a bogus file fails the build with the `Unknown image` error
- [ ] Every created file < 200 lines

## Risk Assessment

| Risk | L x I | Mitigation |
|------|-------|------------|
| Per-subset font CSS imported instead of the weight file, Vietnamese silently falls back to Impact | M x H | Step 8 states the rule and the reason; step 14 greps the emitted font filenames; phase 7 confirms visually in a screenshot |
| `typescript@7` pulled in transitively, `astro check` runs on an unsupported compiler | M x M | Exact pin `6.0.3`; run `pnpm why typescript` after install |
| Font payload (~128 KB) drags first render | M x M | woff2 is pre-compressed, `font-display: swap` ships by default, subsets are unicode-range gated. Phase 7 measures and drops the unused 700 weight |
| `import.meta.glob` absolute pattern breaks if images move again | L x M | Single call inside `image-map.ts`; one place to edit |
| Noise overlay at `z-index: 9999` swallows clicks | L x H | `pointer-events: none` in the same rule; click a link during step 14 |
| Token renamed after phase 2 starts, silent style breakage | M x M | Tokens frozen at the end of this phase; a rename after that is a cross-phase change, not a local one |

## Security Considerations

No backend, no forms, no secrets. Self-hosted fonts mean the site has **no** third-party runtime
origin at all, which also removes the Google Fonts privacy question. `contact.json` (phase 3) carries
a phone number and email that are already public in the CV; the owner has confirmed publishing both.

## Next Steps

Phase 2 consumes `tokens.css`, the content atoms and `image-map.ts`. Do not rename a token after
phase 2 starts.
