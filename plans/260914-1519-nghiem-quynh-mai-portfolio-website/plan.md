---
title: "Nghiêm Quỳnh Mai Portfolio Website"
description: "Single-page Astro portfolio in cut-out paper style, Vietnamese copy from JSON, GSAP + Lenis motion, Vercel deploy."
status: completed
priority: P2
effort: 25h
branch: "main"
tags: [astro, gsap, lenis, portfolio, static-site]
blockedBy: []
blocks: []
created: "2026-09-14T08:34:42.828Z"
createdBy: "ck:plan"
source: skill
---

# Nghiêm Quỳnh Mai Portfolio Website

## Overview

One static page, nine sections, Astro 7.3 + vanilla CSS tokens + GSAP/Lenis. All Vietnamese copy lives in `src/data/*.json` so the owner edits text, not markup. Design from `docs/design-guidelines.md`, copy from `docs/content-source.md`; four sections have no source and get drafted copy with literal `[PLACEHOLDER: ...]` markers.
Order: Hero → Nav → About → Branding & Positioning → Content Strategy → Content SEO → Social Media & Community → UGC → AI First → Contact. Effort 3/3/4/4/4/3/4 h.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Scaffold Tokens Fonts Data](./phase-01-scaffold-tokens-fonts-data.md) | Complete |
| 2 | [Shared Components](./phase-02-shared-components.md) | Complete |
| 3 | [Sections Hero About Contact](./phase-03-sections-hero-about-contact.md) | Complete |
| 4 | [Sections Branding Strategy SEO](./phase-04-sections-branding-strategy-seo.md) | Complete |
| 5 | [Sections Social UGC AI First](./phase-05-sections-social-ugc-ai-first.md) | Complete |
| 6 | [Motion Layer GSAP Lenis](./phase-06-motion-layer-gsap-lenis.md) | Complete |
| 7 | [Responsive A11y QA Build Deploy](./phase-07-responsive-a11y-qa-build-deploy.md) | Complete |

## Key decisions

- **Content/markup split.** One JSON per section, typed in `src/types/content.ts`; each phase appends its own interfaces. No Vietnamese literal in any `.astro` file.
- **Fonts self-hosted** via Fontsource 5.3.0. Import the weight files, never the per-subset files: only the weight files carry `unicode-range`, so combining subset files makes Vietnamese fall back to the system font. No third-party runtime origin.
- **Vercel only.** `base` stays `/`; `site` exists for canonical and OG URLs. No base-path plumbing anywhere, no CI workflow file.
- **Images via `astro:assets`.** PNGs move to `src/assets/images/` in phase 1; JSON stores filenames, `src/lib/image-map.ts` resolves them, and `polaroid.astro` is the single authority on rendered width, clamped against intrinsic size.
- **Motion is progressive enhancement.** An inline `<head>` script sets `html.js` before first paint so the reveal pre-state never flashes. Everything is gated on `prefers-reduced-motion: no-preference`, parallax sits in a separate desktop query, and Lenis runs off the GSAP ticker with `autoRaf: false`.
- **Vanilla CSS only** (`tokens.css`, `global.css`, scoped `<style>`); no ui-kit page; `typescript@6.0.3` because `@astrojs/check` peer-requires `^5 || ^6`.
- Every file < 200 lines, kebab-case names, `<html lang="vi">`, English section titles over Vietnamese body copy.

## Execution notes (2026-09-14)

All seven phases complete. Deviations from the plan, each forced by a defect found while verifying:

| # | Plan said | Reality | Why changed |
|---|-----------|---------|-------------|
| 1 | `@types/*` path alias | `@content-types/*` | TypeScript reserves `@types`; the import failed with ts(6137) |
| 2 | `sticker.astro` takes `as?: 'span' \| 'li'` | prop removed, callers wrap in `<li>` | A dynamic root tag makes Astro type the whole component's props `any`; an invalid `tone` compiled clean |
| 3 | `--lh-display: .95` | `1.08` | At .95 the stacked Vietnamese tone marks (Ê, Ỳ) clipped at the cap line and collided with the line above |
| 4 | `--muted: #7A7269` | `#6B645C` | Measured 3.91:1 on `--paper-2`, 4.27:1 on `--paper` — both below AA. Design doc had only ever measured red and maroon |
| 5 | `content.ts` single file | barrel over `content-atoms.ts` + `content-sections.ts` | Reached 239 lines; the plan's own append-per-phase design collides with the <200-line rule |
| 6 | hero h1 with an explicit `<br>` | plain text | `splitWords` reads `textContent`; the `<br>` would have merged two words. Natural wrapping gives the same three-line stack |

Further fixes with no plan conflict: polaroid `width: fit-content` (page overflowed to 651px at 390px
because the 520px hero image sized its grid track); the section rhythm rule moved to `global.css`
(Astro's `[data-astro-cid-*]` scoping tied specificity with each list's `margin: 0`, so blocks sat
flush); inline padding on works-wall items (rotated polaroids overflowed their column); an empty-group
guard in `reveals.ts`; 44px minimum on nav brand, hero quick links and contact card links; `og:image`
rendered as a 96 KB JPEG rather than shipping the raw 942 KB PNG; the unused Be Vietnam Pro 700 import
dropped.

Not done: the Vercel deploy itself (step 10 of phase 7) — the repository has no commits and no remote,
so it is the owner's call. `site` in `astro.config.mjs` is still `https://example.com`.

## Dependencies

Order: 1 → 2 → (3 → 4 → 5) → 6 → 7. Phases 3–5 all append to `src/pages/index.astro`, so they are **sequential, not parallel**; phase 3 owns the file, 4 and 5 fill marked anchors.
Phase 6 needs the motion hook attributes 3–5 emit; phase 7 needs a complete page to measure.

## Content gaps for owner

- `[PLACEHOLDER: LinkedIn URL]` for the contact card; brand voice and a positioning proof point to replace the 3S-derived draft.
- **Branding & Positioning, Content SEO, UGC, AI First** — drafted from adjacent material, every unverified claim marked. Find them with `grep -rn "\[PLACEHOLDER" src/data/` (13 as of phase 5).
- **Hi-res work images** — the eight `work-*.png` are 225–400 px and render clamped until originals arrive.
- **Case-study permission** — confirm the `+200%` / `+35%` numbers and the chart screenshots may be published.

## Red Team Review

### Session — 2026-09-14

Four reviewers (assumption destroyer, failure-mode analyst, scope critic, security adversary) raised 25 findings, 22 unique after dedup.
Adjudicated: 18 accepted (+1 issue found while applying: per-subset Fontsource import breaks Vietnamese), 1 rejected, 3 decided by the owner.

| # | Finding group | Severity | Disposition | Applied to |
|---|---------------|----------|-------------|------------|
| 1 | Motion correctness: pre-state flashes before the deferred module runs; one matchMedia query rebuilds Lenis and re-splits headlines on resize; hero waits on scroll; naive clamp mangles negative parallax | High | Accepted (4) | ph6 |
| 2 | Fonts: Google adds a third-party origin, and the per-subset CSS import silently breaks Vietnamese | Med | Accepted (2) | ph1, tech-stack, design-guidelines |
| 3 | Duplication and guards: width clamp in two places, unguarded empty gallery, chart width only in a risk row, type/JSON stub ownership straddling phases | Med | Accepted (5) | ph1–ph5 |
| 4 | Scope and accuracy: ui-kit page as a second surface, config noise, missing `@layouts` alias, wrong import path, TS pin rationale, nav anchor count, unmentioned Lenis `anchors` option | Low–Med | Accepted (7) | ph1, 2, 3, 6, 7 |
| 5 | Contrast stated as 3.2:1; measured 5.3:1 red, 8.4:1 maroon, 4.86:1 red on `--paper-2` — a design rule, not an a11y limit | Med | Accepted (1) | ph7, design-guidelines |
| 6 | Merge phases 1 and 2 to cut overhead | Med | **Rejected** | Checkpoint value outweighs the saving |
| 7 | Hosting split across two hosts; publishing phone/email on an indexable page; chart screenshots may expose client data | High–Med | **Owner-decided (3)** | Vercel only (ph1, ph7); publish and index (ph7); charts kept with disclaimer (ph4) |

### Whole-Plan Consistency Sweep

Swept the seven phase files and both docs for `ui-kit`, `BASE_URL`, `base:`, `github`, `Pages`, `fonts.googleapis`, `responsiveStyles`, `nine anchors` and `fill \``. Zero unintended hits.
Four matches remain and all are deliberate negative assertions: phase 2 stating no ui-kit page exists, phase 7 stating there is no GitHub Pages config, and two build-check criteria requiring `fonts.googleapis.com` to be absent. Two further `responsiveStyles` hits record why that option was dropped.
Every other `Pages` match is an `src/pages/` file path.
