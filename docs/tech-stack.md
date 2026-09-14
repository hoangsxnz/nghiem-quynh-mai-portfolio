# Tech Stack

Approved 2026-09-14. Source: `plans/reports/researcher-260914-1519-animation-stack-options-report.md`.

## Decision

Single-page static portfolio. **Astro + GSAP + Lenis.** No backend, no CMS.

| Layer | Choice | Version (npm, verified 2026-09-14) | Why |
|-------|--------|-----------------------------------|-----|
| Framework | Astro | 7.3.x | 0 KB JS by default, static output, content in plain data files |
| Animation | GSAP + ScrollTrigger | 3.15.x | Free (Webflow), scroll-reveal, parallax, pinning |
| Smooth scroll | Lenis | 1.3.x | 3-5 KB, pairs with GSAP ticker |
| Styling | Vanilla CSS (custom properties) | - | No Tailwind; design tokens in one file |
| Fonts | Self-hosted: `@fontsource/protest-guerrilla` (display), `@fontsource/be-vietnam-pro` (body) | 5.3.0 | Both verified Vietnamese subset; no third-party origin |
| Package manager | pnpm | 10.x | Available locally |
| Runtime | Node | 24.x | Local |
| Hosting | Vercel | - | Decided 2026-09-14; `base` stays `/`, no base-path handling anywhere |

## Rejected

- **Next.js + Motion**: React hydration overhead, static export limits, overkill for one page.
- **Vite + vanilla HTML**: fine, but content editing means touching HTML; Astro components + data files are easier for a non-dev owner.

## Integration rules

- Lenis: `autoRaf: false`; drive via `gsap.ticker.add(t => lenis.raf(t * 1000))`; `lenis.on('scroll', ScrollTrigger.update)`.
- Wrap all motion in `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`; reduced-motion users get static layout.
- Parallax only at `(min-width: 768px)`; mobile gets fade/slide reveals only.
- Fonts self-hosted via Fontsource, imported in `base-layout.astro`. Import the **weight** files
  (`@fontsource/protest-guerrilla/400.css`, `@fontsource/be-vietnam-pro/{400,600,700}.css` — 700 is
  imported initially and dropped in phase 7 if no rule resolves to it), never the
  per-subset files: the weight files carry `unicode-range` per subset, the subset files do not, so
  combining two subset files makes the later rule shadow the earlier one and Vietnamese glyphs fall
  back. Fontsource already sets `font-display: swap`.
- Content lives in `src/data/*.json` (one file per section). Components never hardcode copy.

## Commands

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # -> dist/
pnpm preview
```
