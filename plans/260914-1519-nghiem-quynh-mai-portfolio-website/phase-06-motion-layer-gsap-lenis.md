---
phase: 6
title: "Motion Layer GSAP Lenis"
status: completed
effort: "3h"
dependencies: [1, 2, 3, 4, 5]
---

# Phase 6: Motion Layer GSAP Lenis

## Context

- `docs/tech-stack.md` "Integration rules" — the Lenis/GSAP contract
- `docs/design-guidelines.md` "Motion" — per-pattern specs
- `plans/reports/researcher-260914-1519-animation-stack-options-report.md` — the RAF-sync gotcha
- Phase 2 motion contract: `data-reveal`, `data-reveal-group`, `data-parallax`, `data-split`, `data-nav`

## Overview

Priority P2. Add the only JavaScript the site ships. Motion is strictly additive: the page is
complete, readable and navigable before any of this runs, and stays that way for reduced-motion users
and if the bundle fails to load.

## Requirements

Functional
- Smooth scroll via Lenis, `lerp: .1`, `duration: 1.2`, driven by the GSAP ticker.
- Reveal on enter for every `data-reveal`, staggered inside `data-reveal-group`.
- Hero content animates on load without waiting for a scroll.
- Word-split entrance for `data-split` headings.
- Parallax on `data-parallax` elements, desktop only.
- Nav hides on scroll down, shows on scroll up.
- Anchor clicks scroll smoothly through Lenis and still work with JS disabled.

Non-functional
- Every motion file < 200 lines; each owns one concern.
- Motion lives inside `gsap.matchMedia()`; reduced-motion users get no Lenis, no reveals, no parallax and full opacity.
- No layout shift caused by motion: reveal animates `transform` and `opacity` only.
- Total added JS under ~60 KB gzipped (GSAP core + ScrollTrigger + Lenis).

## Architecture

```
base-layout.astro
  <head>
    <script is:inline>document.documentElement.classList.add('js')</script>   <- render-blocking, by design
  <body>
    <script> import '../scripts/motion/index.ts' </script>                     <- module, deferred, bundled
        |
        v
  motion/index.ts        registers ScrollTrigger, opens two gsap.matchMedia() queries:
        |- lenis-setup.ts   createLenis() -> { lenis, destroy }
        |- reveals.ts       initReveals() (hero timeline + split + group + stray)
        |- parallax.ts      initParallax()   (second query only)
        +- nav-scroll.ts    initNavScroll()

  split-words.ts           pure DOM helper, no GSAP import
```

**The `js` class must be set in `<head>`, inline, before first paint.** The reveal pre-state hides
elements, and it is gated on `html.js`. If that class were added by the deferred module instead, the
browser would paint the page fully visible and then blank the reveal elements a moment later — a
flash of content on every load, on the LCP element among others. An inline head script runs before
the first paint, so the pre-state is in effect from the very first frame. This is the one place in the
project where a render-blocking script is correct; it is a single statement.

The pre-state itself, in `global.css`:

```css
@media (prefers-reduced-motion: no-preference) {
  html.js [data-reveal] { opacity: 0; transform: translateY(40px); will-change: transform, opacity; }
}
```

Two independent gates: the media query covers reduced-motion users, the class covers JS-off users.
Either one failing open leaves content visible, which is the safe direction.

## Related Code Files

Create
- `src/scripts/motion/index.ts`
- `src/scripts/motion/lenis-setup.ts`
- `src/scripts/motion/reveals.ts`
- `src/scripts/motion/split-words.ts`
- `src/scripts/motion/parallax.ts`
- `src/scripts/motion/nav-scroll.ts`

Modify
- `src/layouts/base-layout.astro` — inline head script, module script at the end of body, Lenis stylesheet import
- `src/styles/global.css` — `html.js` reveal pre-state, `html:not(.lenis)` scroll-behavior, `.word` rules, nav transition

## Implementation Steps

1. **`lenis-setup.ts`** — the integration rule from `docs/tech-stack.md`, verbatim:

```ts
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function createLenis(): { lenis: Lenis; destroy: () => void } {
  const lenis = new Lenis({ lerp: 0.1, duration: 1.2, autoRaf: false });

  const raf = (time: number) => lenis.raf(time * 1000);   // gsap.ticker is seconds, lenis wants ms
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  lenis.on('scroll', ScrollTrigger.update);

  document.documentElement.classList.add('lenis');

  return {
    lenis,
    destroy() {
      gsap.ticker.remove(raf);
      lenis.destroy();
      document.documentElement.classList.remove('lenis');
    },
  };
}
```

   Import `lenis/dist/lenis.css` once in `base-layout.astro` (the package exposes `./dist/*`), or
   hand-write the three rules it contains if the extra file is not wanted.

2. **Anchor handling.** Native `#id` clicks fight Lenis. Lenis ships an `anchors` option that would
   handle the scroll, but it does not move keyboard focus, so a custom delegated handler is used
   instead — the focus move is the reason this code exists:

```ts
document.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest?.('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href')!.slice(1);
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  lenis.scrollTo(target, { offset: -80 });     // clears the sticky nav
  target.setAttribute('tabindex', '-1');
  (target as HTMLElement).focus({ preventScroll: true });
});
```

   Without the focus move, a keyboard user who activates a nav link keeps focus on the nav and the
   next Tab goes nowhere useful. With JS off, the browser's native anchor jump does both things already.

3. **`split-words.ts`** — no GSAP dependency, so it stays cheap and testable:

```ts
export function splitWords(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? '';
  el.setAttribute('aria-label', text);          // keep the heading readable as one string
  el.textContent = '';
  return text.split(/\s+/).filter(Boolean).map((word) => {
    const outer = document.createElement('span');
    outer.className = 'word';                    // overflow: hidden; display: inline-block
    outer.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    inner.className = 'word-inner';
    inner.textContent = word;
    outer.append(inner);
    el.append(outer, document.createTextNode(' '));
    return inner;
  });
}
```

   `aria-label` plus `aria-hidden` children keeps screen readers announcing the whole heading instead
   of a word-per-node stutter. Only applied to `[data-split]`, which is h1 and h2 only.

4. **`reveals.ts`, hero first.** Hero content is above the fold on every load, so it runs as a plain
   timeline rather than waiting on a ScrollTrigger, and it is excluded from the later passes:

```ts
export function initReveals() {
  const hero = document.querySelectorAll<HTMLElement>('#hero [data-reveal]');
  if (hero.length) {
    gsap.timeline().to(hero, {
      y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .08, delay: .1,
    });
  }
  // ... split, group and stray passes below, all skipping #hero
}
```

5. **`reveals.ts`, the scroll passes.** Every selector excludes the hero so nothing animates twice:

```ts
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const words = splitWords(el);
    gsap.from(words, {
      yPercent: 110, rotate: 4, duration: .8, ease: 'power3.out', stagger: .04,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });

  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    if (group.closest('#hero')) return;
    gsap.to(group.querySelectorAll('[data-reveal]'), {
      y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .08,
      scrollTrigger: { trigger: group, start: 'top 80%', once: true },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal]')
    .filter((el) => !el.closest('#hero') && !el.closest('[data-reveal-group]'))
    .forEach((el) => gsap.to(el, {
      y: 0, opacity: 1, duration: .8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    }));
```

   `gsap.to(..., { opacity: 1 })` against the CSS pre-state, never `gsap.from`: `from` would re-hide
   an element that is already visible if the script runs late. `once: true` keeps the trigger count low
   and means nothing re-animates on scroll-up. The hero `data-split` h1 still goes through the split
   pass; its ScrollTrigger fires immediately because it starts in view.

6. **`parallax.ts`** — desktop only, called from the second matchMedia query, with the range clamped to
   the design guideline's `yPercent: ±12`:

```ts
export function initParallax() {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const raw = Number(el.dataset.parallax) || 0.1;
    const amount = gsap.utils.clamp(-12, 12, raw * 100);   // 0.12 -> 12, -0.06 -> -6
    gsap.fromTo(el,
      { yPercent: -amount / 2 },
      { yPercent: amount / 2, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });
}
```

   `gsap.utils.clamp` handles negative values correctly, which a bare `Math.min` would not — phase 5
   passes `-0.06` for alternating columns.

7. **`nav-scroll.ts`** — hide on down, show on up:

```ts
export function initNavScroll() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;
  ScrollTrigger.create({
    start: 'top -120',           // never hide while the hero is on screen
    end: 'max',
    onUpdate: ({ direction }) => nav.classList.toggle('is-hidden', direction === 1),
    onLeaveBack: () => nav.classList.remove('is-hidden'),
  });
}
```

   CSS in `global.css`: `[data-nav] { transition: transform .3s ease }`, `[data-nav].is-hidden {
   transform: translateY(-100%) }`, and `[data-nav]:focus-within { transform: none }` so a keyboard
   user tabbing into a hidden nav brings it back.

8. **`index.ts`** — two matchMedia queries, not one with a nested condition:

```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createLenis } from './lenis-setup';
import { initReveals } from './reveals';
import { initNavScroll } from './nav-scroll';
import { initParallax } from './parallax';

gsap.registerPlugin(ScrollTrigger);
const mm = gsap.matchMedia();

// 1. Everything that should run once, at any width, when motion is welcome.
mm.add('(prefers-reduced-motion: no-preference)', () => {
  const { destroy } = createLenis();
  initReveals();
  initNavScroll();
  return () => destroy();
});

// 2. Parallax only: desktop and motion-friendly.
mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
  initParallax();
});
```

   The `js` class is **not** set here; it is already on the element from the inline head script.

   Why two queries instead of one with `ctx.conditions.desktop`: a single query containing a width
   condition re-runs its whole callback every time the width condition flips. Crossing 768 px would
   destroy and rebuild Lenis, re-split every headline (doubling the `.word` spans) and re-animate
   elements the visitor has already seen. Splitting them means the resize only adds or removes the
   parallax tweens, which is exactly the intended scope. GSAP reverts the tweens created inside a
   query when that query stops matching, so no manual parallax cleanup is needed; only Lenis, which
   lives outside GSAP's knowledge, needs the explicit `destroy`.

9. **`base-layout.astro`** — two additions. In `<head>`, immediately after `<meta charset>`:

```astro
<script is:inline>document.documentElement.classList.add('js')</script>
```

   and at the end of `<body>`:

```astro
<script>
  import '../scripts/motion/index.ts';
</script>
```

   The second one has no `is:inline` on purpose: Vite must process its imports. Astro bundles and
   defers it automatically.

10. **`global.css` edits** — add the `html.js` reveal pre-state from the Architecture section, the
    `.word` / `.word-inner` rules (`display: inline-block; overflow: hidden` on the outer,
    `display: inline-block` on the inner), the nav transition rules, and narrow the phase-1
    `html { scroll-behavior: smooth }` to `html:not(.lenis) { scroll-behavior: smooth }` so native
    smooth scrolling stays for the no-JS and reduced-motion paths but never fights Lenis.

11. **Verify.** Run the matrix below, then `pnpm build` and check the emitted JS size.

## Test Matrix

| Case | How | Expected |
|------|-----|----------|
| Cold load, motion on | Hard reload at 1440 px | Hero animates in without any scroll; no flash of visible-then-hidden content at any point |
| Motion on, desktop | Chrome 1440 px | Lenis smooth, reveals stagger, parallax on polaroids, nav hides/shows |
| Motion on, mobile | Chrome 390 px | Reveals and Lenis yes, parallax absent (no scrub trigger in `ScrollTrigger.getAll()`) |
| Reduced motion | DevTools Rendering → prefers-reduced-motion: reduce, reload | No Lenis (`html` has no `.lenis`), all content visible at full opacity, marquee static, nav always visible |
| JS disabled | DevTools → Disable JavaScript, reload | Every section visible, all nav anchors jump natively, no `js` class |
| Resize across 768 px | Drag window wide → narrow → wide | No console error; parallax tweens added/reverted only. `document.querySelectorAll('.word').length` is **constant** across the resize, and no already-visible `[data-reveal]` re-animates |
| Keyboard nav | Tab + Enter on each nav link | Page scrolls, focus lands inside the target section, hidden nav reappears on focus |
| Screen reader heading read | VoiceOver/NVDA on the hero h1 | Full name announced once, not word by word |

## Todo List

- [ ] inline `js` class script in `<head>` of base-layout
- [ ] lenis-setup.ts (ticker sync, anchor delegation with focus move)
- [ ] split-words.ts with aria-label preservation
- [ ] reveals.ts (hero timeline first, then split/group/stray passes excluding `#hero`)
- [ ] parallax.ts (desktop query only, `gsap.utils.clamp` range)
- [ ] nav-scroll.ts (+ focus-within escape)
- [ ] index.ts with two matchMedia queries
- [ ] base-layout module script + lenis.css
- [ ] global.css: html.js pre-state, .word rules, nav transition, scroll-behavior guard
- [ ] full test matrix run

## Success Criteria

- [ ] All eight test-matrix rows pass
- [ ] `.word` count identical before and after a resize across 768 px
- [ ] `ScrollTrigger.getAll().length` stable after scrolling the page twice (no leak)
- [ ] No cumulative layout shift attributable to reveals (Performance panel: CLS contribution 0)
- [ ] Added JS under 60 KB gzipped in the build output
- [ ] With JS disabled, zero elements compute to `opacity: 0`
- [ ] Each motion file < 200 lines
- [ ] `pnpm check` 0 errors

## Risk Assessment

| Risk | L x I | Mitigation |
|------|-------|------------|
| Reveal pre-state hides content when JS fails or reduced motion is on — a blank page | H x **Critical** | Two independent gates, both failing open: the `html.js` class and the `no-preference` media query. Two dedicated test-matrix rows; a success criterion asserts computed opacity |
| Flash of visible content before the pre-state applies | H x H | The `js` class is set by an inline `<head>` script that runs before first paint, not by the deferred module |
| Lenis and ScrollTrigger desync, janky scrub | M x H | `autoRaf: false` + ticker drive + `lagSmoothing(0)` + `lenis.on('scroll', ScrollTrigger.update)`, exactly as the approved integration rule |
| Resize across 768 px duplicates word spans or re-animates seen content | M x H | Lenis, reveals and nav live in a width-free query; only parallax sits behind the width query. Asserted by the resize row and the `.word` count criterion |
| `gsap.ticker` callback survives a matchMedia revert, double RAF | M x M | `destroy()` returned from `createLenis` removes the exact callback reference; the query cleanup calls it |
| Negative parallax value mangled by a naive clamp | M x M | `gsap.utils.clamp(-12, 12, ...)` handles the sign; phase 5 passes `-0.06` |
| Sticky nav covers the heading after an anchor jump | M x M | `scrollTo` offset -80 plus `scroll-margin-top` from phase 2 |
| Word split breaks screen-reader heading announcement | M x H | `aria-label` on the heading, `aria-hidden` on generated spans; verified in the matrix |
| Word split runs on a heading containing element children, markup lost | L x H | `data-split` sits only on `SectionHeader`'s h2 and the hero h1, both plain text; `splitWords` reads `textContent`, so keep the attribute off any rich heading |
| GSAP loaded but unused by reduced-motion visitors | M x L | Accepted: one shared bundle is simpler than conditional loading. Revisit only if phase 7 Lighthouse drops below 90 |

## Security Considerations

No `innerHTML` anywhere: `splitWords` builds nodes with `createElement` and `textContent`, so content
from JSON can never be parsed as markup. The inline head script is a single static statement with no
interpolated data. No third-party script origin; GSAP and Lenis are bundled.

## Next Steps

Phase 7 measures the result. If Lighthouse performance lands under 90, the first lever is deferring
GSAP until first interaction, not cutting reveals.
