---
phase: 7
title: "Responsive A11y QA Build Deploy"
status: completed
effort: "4h"
dependencies: [1, 2, 3, 4, 5, 6]
---

# Phase 7: Responsive A11y QA Build Deploy

## Context

- `docs/design-guidelines.md` — measured contrast ratios and the red/maroon usage rule
- Phase 6 test matrix — the reduced-motion and no-JS rows are re-run here as regression checks
- Local tooling verified: `google-chrome` at `/usr/bin/google-chrome`, Node 24.10.0, pnpm 10.33.1

## Overview

Priority P1. Nothing new is built here. The page is measured, fixed where it fails, documented for a
non-developer owner, and deployed to Vercel.

Placeholders stay visible on purpose. They are the owner's to-do list, so the README reports their
count and location instead of the build failing on them.

## Requirements

Functional
- Layout holds at 360, 390, 768, 1024, 1440 px with no horizontal scroll.
- Lighthouse ≥ 90 on performance, accessibility, best practices and SEO.
- Images ship as WebP at sensible widths; the hero is the LCP element and is not lazy.
- README explains editing content, replacing placeholders, and deploying.
- The site is publicly indexable from the first deploy.

Non-functional
- No regression in the phase-6 matrix.
- Every source file still < 200 lines.

## Architecture

Verification pipeline, all local, no CI dependency:

```
pnpm check --> pnpm build --> pnpm preview (:4321)
                                   |
        +--------------------------+---------------------------+
        v                          v                           v
  chrome --headless          npx lighthouse            chrome --headless
  --screenshot 390/1440      --preset=desktop|mobile   --dump-dom (grep checks)
        |                          |                           |
        +----------> results pasted into the README QA table <-+
```

Deployment is Vercel only. There is no `base` path to manage, no workflow file, and no GitHub Pages
configuration anywhere in the project: `base` stays `/`, and `site` in `astro.config.mjs` exists only
so `Astro.site` can build the canonical and `og:url` values. Vercel detects Astro, runs `pnpm build`
and serves `dist/` with zero configuration.

## Related Code Files

Create
- `public/robots.txt`, `public/favicon.svg` (favicon may already exist from phase 1)
- `plans/260914-1519-nghiem-quynh-mai-portfolio-website/qa/` — screenshots and Lighthouse reports

Modify
- `README.md` (full rewrite from the phase-1 stub)
- `src/styles/global.css`, section `<style>` blocks — responsive and contrast fixes found here
- `src/data/*.json` — alt-text fixes only
- `astro.config.mjs` — final `site` value
- `src/layouts/base-layout.astro` — drop the unused Be Vietnam Pro 700 import if step 3 confirms it is unused
- `.gitignore` — add the `qa/` Lighthouse JSON if the reports are kept locally

## Implementation Steps

1. **Responsive pass.** `pnpm preview`, then walk 360 / 390 / 768 / 1024 / 1440 px. Check at each: no
   horizontal scroll (`document.documentElement.scrollWidth === clientWidth`), no text under 14 px, no
   more than two tilted elements per mobile viewport, tap targets ≥ 44 px, and clean reflow of the
   works wall and the timeline. Fix in the owning component's scoped style, not in `global.css`,
   unless the fix is genuinely global.

2. **Accessibility pass.**
   - Heading order: one h1, h2 per section, h3 inside; no skips. Read it from the DevTools
     accessibility tree, not from the source.
   - Landmarks: one `<main>`, one `<nav aria-label>`, one `<footer>`; every `<section>` has
     `aria-labelledby` pointing at its own h2.
   - Contrast: verify every text node computes to ≥ 4.5:1. The measured ratios on `--paper`
     (`#F5F3EE`) are red 5.3:1 and maroon 8.4:1, so both pass for normal text. The one case that needs
     re-checking is red on `--paper-2` (`#EDE9E0`), measured at 4.86:1 — it passes, but it is the
     thinnest margin in the palette, so any future darkening of `--paper-2` breaks it. Confirm no text
     sits on a shadow or image without a solid backing.
   - Alt text: every image's alt comes from JSON and describes content, not the file. Decorative SVGs
     (torn divider) carry `aria-hidden="true"`.
   - Focus: tab the whole page; every interactive element shows the `:focus-visible` ring and nothing
     is reachable-but-invisible behind the hidden nav.
   - Re-run the phase-6 reduced-motion and JS-disabled rows.

3. **Fonts and images.**
   - Confirm the emitted font files include `*-vietnamese-400-normal.woff2` for both families, and
     check whether any rule actually resolves to weight 700. The design tokens use 400 and 600 only,
     so if 700 is unreferenced, drop `@fontsource/be-vietnam-pro/700.css` from `base-layout.astro` and
     save roughly 35 KB.
   - Confirm every `<img>` in the built HTML is WebP with explicit `width` and `height`.
   - Check `photo-mai-cafe.png` (1304x869, 942 KB source) renders around 900 px on desktop and that
     its WebP output is under ~150 KB. The eight `work-*.png` keep the intrinsic clamp from
     `polaroid.astro`. Only the hero image is `loading="eager"`.

4. **Build and screenshots.**

```bash
pnpm check && pnpm build && pnpm preview &
QA=plans/260914-1519-nghiem-quynh-mai-portfolio-website/qa
mkdir -p "$QA"
google-chrome --headless --disable-gpu --hide-scrollbars \
  --window-size=390,2400 --screenshot="$QA/mobile-390.png" http://localhost:4321/
google-chrome --headless --disable-gpu --hide-scrollbars \
  --window-size=1440,2400 --screenshot="$QA/desktop-1440.png" http://localhost:4321/
```

   Full-page capture needs a tall `--window-size` or a per-section pass. Take one hero-only shot at
   each width as well, because the diacritics check depends on reading the headline clearly.

5. **Vietnamese rendering check.** Open `qa/desktop-1440.png` at 100% and confirm the hero headline
   `NGHIÊM QUỲNH MAI` renders every diacritic in Protest Guerrilla — no glyph falling back to Impact
   (obvious by letterform), no missing tone mark, no mark clipped at the cap line. Repeat for one
   section h2 and for a Vietnamese subtitle. This is the check that the self-hosted Vietnamese subset
   is actually being served; a failure here almost always means the wrong fontsource CSS entry was
   imported in phase 1.

6. **Lighthouse.**

```bash
npx lighthouse http://localhost:4321/ --preset=desktop \
  --chrome-flags="--headless --disable-gpu" --output=json --output=html \
  --output-path="$QA/lighthouse-desktop"
npx lighthouse http://localhost:4321/ \
  --chrome-flags="--headless --disable-gpu" --output=json --output=html \
  --output-path="$QA/lighthouse-mobile"
```

   Target ≥ 90 on all four categories, both presets. Record the numbers in the README QA table. If
   performance misses on mobile, the levers in order: image widths, then the unused font weight, then
   deferring GSAP to first interaction, then dropping the parallax triggers. Do not cut reveals; they
   are the design.

7. **Built-output greps.** Against the built HTML:
   - `[PLACEHOLDER` never appears inside `href="`, `src="` or `content="`.
   - `<h1` appears exactly once.
   - No `.png` in an `<img src>` (all WebP).
   - No `console.log`, no `fonts.googleapis.com`.
   Then count the remaining placeholders in source, `grep -rn "\[PLACEHOLDER" src/data/ | wc -l`
   (13 as of phase 5), and paste the per-file list into the README.

8. **`robots.txt`.** The owner wants the page indexed from day one, so:

```
User-agent: *
Allow: /
```

   No sitemap: a single page with no internal routes gains nothing from one.

9. **`README.md`** — written for the owner, not for a developer. Sections:
   - **Chạy tại máy**: `pnpm install`, `pnpm dev`, `pnpm build`.
   - **Sửa nội dung**: one table mapping page section → JSON file → which keys are safe to edit. State
     plainly that editing JSON is all that is needed and that quotes and commas must stay intact.
   - **Thay placeholder**: lead with this. The exact grep command, the current count, and a line-by-line
     list of what each placeholder needs: LinkedIn URL, brand voice, positioning proof, Beauty image,
     case-study permission, SEO article URL and metrics, second SEO example, hi-res work images, UGC
     results, UGC imagery, agent description, speed claim.
   - **Ảnh**: drop new files into `src/assets/images/`, then reference the filename in JSON; the build
     fails loudly on a typo.
   - **Deploy (Vercel)**: import the repository at vercel.com, framework preset Astro, build command
     `pnpm build`, output directory `dist`. Set the final domain in `astro.config.mjs` `site` so the
     canonical and OG URLs are right. Every push to `main` redeploys.
   - **QA**: the Lighthouse table and the screenshot paths.
   - **Riêng tư**: the page publishes a phone number and an email, and is indexable. To remove either,
     delete its entry from the `cards` array in `src/data/contact.json` and rebuild.

10. **Deploy.** Push to the repository, import it on Vercel, verify the live URL renders the Vietnamese
    headline correctly, check the canonical URL matches the final domain, and re-run Lighthouse once
    against the deployed URL.

11. **Final regression.** `pnpm check`, `pnpm build`, re-run the phase-6 test matrix after all fixes,
    and confirm `wc -l` over `src/` shows no file at or above 200 lines.

## Todo List

- [ ] Responsive pass at 5 widths, fixes in owning components
- [ ] A11y pass: headings, landmarks, contrast, alt, focus, reduced motion, no-JS
- [ ] Font subset and weight audit; image formats and widths verified in built output
- [ ] Screenshots at 390 and 1440 saved to `qa/`
- [ ] Vietnamese diacritics confirmed in the display font
- [ ] Lighthouse desktop + mobile, all four categories ≥ 90
- [ ] Built-output greps clean
- [ ] robots.txt
- [ ] README rewritten for the owner, placeholder list first
- [ ] Vercel deploy + live re-check
- [ ] Final regression run

## Success Criteria

- [ ] No horizontal scroll at 360, 390, 768, 1024, 1440 px
- [ ] Lighthouse ≥ 90 on performance, accessibility, best practices, SEO — desktop and mobile, numbers recorded in the README
- [ ] Accessibility tree shows one h1, ordered h2/h3, labelled landmarks; every text node ≥ 4.5:1 contrast
- [ ] Every `<img>` in the built HTML is WebP with width and height; only the hero is eager
- [ ] Hero screenshot shows every Vietnamese diacritic rendered in Protest Guerrilla
- [ ] `[PLACEHOLDER` appears in no `href`, `src` or `content` attribute of the built HTML
- [ ] README lists the placeholder count and every placeholder's required input
- [ ] Reduced-motion and JS-disabled passes show fully visible content
- [ ] Live Vercel URL renders correctly and its canonical matches the configured `site`
- [ ] Every source file < 200 lines

## Risk Assessment

| Risk | L x I | Mitigation |
|------|-------|------------|
| Lighthouse performance < 90 on mobile from GSAP, Lenis and ~128 KB of fonts | M x M | Levers ranked in step 6: image widths, unused font weight, defer GSAP to first interaction, drop parallax. Reveals are not cut |
| Red on `--paper-2` is the thinnest contrast margin at 4.86:1 | L x M | Measured and recorded here; any future change to `--paper-2` requires re-measuring, noted in the design guidelines |
| Wrong fontsource entry imported in phase 1, Vietnamese falls back to Impact | M x H | Step 5 is a visual check on a real screenshot, plus the emitted-filename grep in step 3 |
| `site` left at the placeholder domain, canonical and OG point nowhere | M x M | Step 10 verifies the canonical on the live URL; it is also a success criterion |
| Full-page headless screenshot truncates at a fixed window height | H x L | Tall `--window-size` plus per-section captures; these are QA artefacts, not shipped assets |
| Low-res `work-*.png` drag down perceived quality regardless of Lighthouse | H x M | The clamp keeps them honest; hi-res files are the top content gap in plan.md |
| Placeholders visible to a recruiter viewing the live site | M x H | By design, and the owner accepted it. The README leads with the placeholder list so they can be cleared before the URL is shared |
| Publishing phone and email on an indexable page invites scraping | M x M | Accepted by the owner. The README documents the one-line removal path |

## Security Considerations

No secrets in the repository. The site has no third-party runtime origin at all: fonts are bundled and
there is no analytics or embed. `robots.txt` allows indexing, which is the owner's explicit choice for
a page that carries personal contact details.

## Next Steps

Hand over: the live URL, the README, the placeholder list and the Lighthouse numbers. Once the owner
supplies hi-res work images and the missing statements, the follow-up is a content-only edit in
`src/data/*.json` and a push — no code change.
