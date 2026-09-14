---
phase: 2
title: "Shared Components"
status: completed
effort: "3h"
dependencies: [1]
---

# Phase 2: Shared Components

## Context

- `docs/design-guidelines.md` — Components section is the spec for every file here
- `plans/reports/researcher-260914-1519-cutout-paper-design-style-report.md` — polaroid/sticker CSS
- Phase 1 output: `src/styles/tokens.css`, content atoms in `src/types/content.ts`, `src/lib/image-map.ts`

## Overview

Priority P1. Build the nine reusable UI primitives that every section is assembled from. This is the
DRY layer: after this phase no section file writes its own polaroid, sticker or divider CSS, and no
section file decides how wide an image may be rendered.

## Requirements

Functional
- Nine components, each with a typed `Props` interface, each rendering correctly with only required props.
- Components carry the motion hook attributes (`data-reveal`, `data-parallax`, `data-split`) but no JS.
- `polaroid.astro` is the single authority on rendered image width.

Non-functional
- Each component < 200 lines including its scoped `<style>`; most land under 80.
- Components read `var(--*)` only. No hex literal, no hardcoded px for anything a token covers.
- No Vietnamese copy inside a component; labels arrive as props.
- Zero client JS shipped by this phase.

## Architecture

```
section .astro (phase 3-5)
   |  props from src/data/*.json
   v
components/ui/*.astro  -- scoped <style>, reads tokens
   |
   +- polaroid.astro --> image() --> width clamp --> <Image> (astro:assets, webp)
   +- nav.astro ------> <a href="#id">  (ids fixed in phase 1 nav.json)
```

Motion contract (consumed in phase 6, emitted here):

| Attribute | Where | Meaning |
|-----------|-------|---------|
| `data-reveal` | any block element | fade + rise on enter |
| `data-reveal-group` | a wrapper | stagger its `data-reveal` children |
| `data-parallax="0.12"` | polaroid wrapper | yPercent scrub, desktop only |
| `data-split` | h1/h2 | word-split headline entrance |
| `data-nav` | nav root | hide/show on scroll direction |

Phase 6 may only read these attributes; it never adds classes that components also use.

**Image width authority.** The eight `work-*.png` are 225–400 px and `photo-mai-avatar.png` is 225 px.
Upscaling them turns the collage to mush, so the clamp lives inside `polaroid.astro` and every caller
inherits it. No section component repeats this logic.

## Related Code Files

Create
- `src/components/ui/nav.astro`
- `src/components/ui/section-header.astro`
- `src/components/ui/sticker.astro`
- `src/components/ui/polaroid.astro`
- `src/components/ui/torn-divider.astro`
- `src/components/ui/metric-tile.astro`
- `src/components/ui/stamp.astro`
- `src/components/ui/cta-button.astro`
- `src/components/ui/marquee.astro`

Modify
- `src/pages/index.astro` — temporary scratch rendering for visual verification (step 10), reverted before the phase closes

There is no `ui-kit.astro`. A separate gallery page would be a second place to keep in sync, and it
would ship to production unless someone remembered to delete it. Components get verified in the
scratch shell here and in situ during phases 3–5.

## Implementation Steps

1. **`sticker.astro`** — red chip label. Props:

```ts
interface Props {
  label: string;
  tone?: 'red' | 'maroon';   // default 'red'
  tilt?: 1 | 2 | 3 | 4;      // maps to var(--tilt-N), default 1
  as?: 'span' | 'li';        // default 'span'
}
```

   Style: `background: var(--red); color: var(--paper); font-family: var(--font-display); font-size: .875rem; padding: 4px 10px; rotate: var(--tilt-1); box-shadow: var(--shadow); border-radius: var(--radius)`. Hover: rotate to `0deg`, 200ms. Tone `maroon` swaps the background token only.

2. **`stamp.astro`** — oval outline badge (the "2030"-style stamp). Props `{ text: string; size?: 'sm' | 'md' }`. `border: 2px solid var(--red); border-radius: 50%; aspect-ratio: 1.4/1; display: grid; place-items: center; color: var(--red); font-family: var(--font-display)`. Used for `OPEN TO WORK` in the hero and for year markers.

3. **`polaroid.astro`** — the only image wrapper in the project. Props:

```ts
interface Props {
  src: string;            // filename, resolved through image()
  alt: string;
  caption?: string;
  tilt?: 1 | 2 | 3 | 4;
  width?: number;         // requested width; clamped below
  priority?: boolean;     // hero image only -> loading="eager", fetchpriority="high"
  parallax?: number;      // emits data-parallax; desktop-only in phase 6
}
```

   Width clamp, the part that matters:

```astro
---
const meta = image(src);
const w = Math.min(width ?? 480, meta.width);
const densities = meta.width >= w * 2 ? [1, 2] : [1];
---
<Image src={meta} alt={alt} width={w} densities={densities}
       format="webp" loading={priority ? 'eager' : 'lazy'}
       fetchpriority={priority ? 'high' : undefined} decoding="async" />
```

   Two low-res cases this handles without any caller knowing: `photo-mai-avatar.png` and
   `work-croissant-photo.png` are 225 px, so a 480 px request renders at 225 px with `densities: [1]`
   rather than a blurry 2x upscale. `photo-mai-cafe.png` at 1304 px still gets the full `[1, 2]`
   treatment. When the owner supplies hi-res work images, the clamp relaxes automatically.

   Frame style per design guidelines: white frame, `padding: 12px 12px 40px`, `var(--shadow)`,
   `rotate: var(--tilt-N)`; hover `rotate: 0deg; scale: 1.03; box-shadow: var(--shadow-lg)` over 300ms
   `ease-out`. `alt` is required by the interface, so a missing alt is a type error rather than an
   accessibility bug found in phase 7.

4. **`section-header.astro`** — the repeated section opener. Props `{ index: string; title: string; subtitle?: string; id: string }`. Renders `<Sticker label={`${index} / ${title}`} />`, `<h2 id={`${id}-title`} data-split>{title}</h2>`, optional `<p class="subtitle">`. The `id` lets each `<section aria-labelledby>` point at its own heading.

5. **`torn-divider.astro`** — inline SVG jagged edge between colour changes. Props `{ from: 'paper' | 'paper-2'; to: 'paper' | 'paper-2'; flip?: boolean }`. One `<svg viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">` with a fixed jagged path; fill driven by the `to` prop; `flip` applies `scaleY(-1)`. `display: block` on the svg to kill the inline gap.

6. **`metric-tile.astro`** — Props `{ value: string; label: string; note?: string }`. Value in `var(--font-display)`, `var(--red)`, `clamp(2.5rem, 6vw, 4.5rem)`; label in body maroon. Carries `data-reveal`. Used for 95% / 3+ / 50+ / +200% / +35%.

7. **`cta-button.astro`** — Props `{ href: string; label: string; external?: boolean }`. `<a>` with red fill, paper text, display font, `rotate: -1deg`; hover wiggles to `+2deg`. When `external`, adds `target="_blank" rel="noopener noreferrer"` and a visually-hidden "(mở tab mới)" — the one allowed Vietnamese literal in `ui/`, since it is an accessibility affordance rather than content. Minimum hit area 44x44 px.

8. **`marquee.astro`** — CSS-only scrolling strip. Props `{ items: string[]; duration?: number; ariaLabel: string }`. Duplicate the list twice in the DOM, mark the second copy `aria-hidden="true"`, animate the track with `@keyframes marquee { to { transform: translateX(-50%) } }`, `duration` default 40s linear infinite. `:hover, :focus-within { animation-play-state: paused }`. Inside `@media (prefers-reduced-motion: reduce)` set `animation: none` and `flex-wrap: wrap` so items stay readable. Root is a `<ul>`.

9. **`nav.astro`** — the table-of-content bar that sits directly after the hero. Props `{ brand: string; items: { id: string; label: string }[] }`. `<nav data-nav aria-label="Mục lục">` > brand `<Sticker>` linking to `#hero` + `<ul>` of `<a href={`#${id}`}>`. Style: `position: sticky; top: 0; z-index: 50; background: color-mix(in srgb, var(--paper) 92%, transparent); backdrop-filter: blur(4px)`, links Be Vietnam Pro 600 13px uppercase. Mobile (< 768px): horizontal scroll strip, `overflow-x: auto; scrollbar-width: none`, links at least 44 px tall. Hide/show on scroll arrives in phase 6 via `data-nav`; the default state must be visible so the nav still works with JS off.

10. **Verify, then revert.** Render every component with every documented variant (all four tilts, both
    sticker tones, divider both directions, marquee, a polaroid of a 225 px image and of the 1304 px
    cafe photo) inside `src/pages/index.astro`, compare against `docs/design/reference-canva-template.png`
    at 390 px and 1440 px, run `pnpm check` and `pnpm build`, then revert `index.astro` to the phase-1
    shell. Phase 3 rewrites it anyway, so the scratch content must not survive the phase.

## Todo List

- [ ] sticker.astro
- [ ] stamp.astro
- [ ] polaroid.astro (astro:assets, required alt, intrinsic width clamp)
- [ ] section-header.astro
- [ ] torn-divider.astro
- [ ] metric-tile.astro
- [ ] cta-button.astro
- [ ] marquee.astro (reduced-motion fallback)
- [ ] nav.astro (sticky, mobile scroll strip)
- [ ] scratch verification done and `index.astro` reverted

## Success Criteria

- [ ] Every component renders in the scratch shell; no console error, no layout overflow at 390 px or 1440 px
- [ ] `pnpm check` 0 errors — in particular `<Polaroid>` without `alt` fails to compile
- [ ] A 225 px source rendered through `<Polaroid width={480}>` emits `width="225"` and a single-density `src`, no `2x` candidate
- [ ] Built HTML references `.webp`, not `.png`
- [ ] Marquee stops animating under forced `prefers-reduced-motion: reduce` (DevTools rendering panel)
- [ ] Keyboard tab shows a visible focus ring on every nav link and CTA
- [ ] `grep -rn "#C8102E\|#F5F3EE\|#8B1A1A" src/components/` returns nothing (tokens only)
- [ ] `src/pages/index.astro` is back to the phase-1 shell at the end of the phase
- [ ] Every component file < 200 lines

## Risk Assessment

| Risk | L x I | Mitigation |
|------|-------|------------|
| `backdrop-filter` on nav costs paint on low-end mobile | M x M | Solid `var(--paper)` fallback via `@supports not (backdrop-filter: blur(4px))`; re-check in phase 7 Lighthouse |
| Sticky nav overlaps anchor targets, headings land under the bar | H x M | `scroll-margin-top: 5rem` on every `section[id]` in `global.css`; verify by clicking each nav link in phase 3 |
| Torn divider SVG leaves a hairline gap at fractional device pixel ratios | M x L | `display: block`, `preserveAspectRatio="none"`, and a 1px negative-margin overlap into the next section |
| Tilted elements cause horizontal scroll on mobile | M x H | `overflow-x: hidden` on `body` plus the design rule of max two tilted elements per mobile viewport; phase 7 checks `scrollWidth === clientWidth` at 390 px |
| Duplicated marquee list read twice by screen readers | M x M | Second copy `aria-hidden="true"`, wrapper labelled by `ariaLabel` |
| Scratch verification content accidentally committed | M x M | Revert is a success criterion, and phase 3 rewrites the file from scratch |
| Clamp hides the low-res problem instead of surfacing it | M x M | Intentional: the clamp protects the visual, and the hi-res request stays a named content gap in plan.md |

## Security Considerations

`cta-button` with `external` always emits `rel="noopener noreferrer"`. No `set:html` anywhere in `ui/` —
all props render as text, so JSON content cannot inject markup.

## Next Steps

Phases 3–5 compose these only. If a section needs a tenth primitive, add it here rather than inlining
bespoke CSS in a section file.
