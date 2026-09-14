# Design Guidelines

Direction approved 2026-09-14: Canva "Creative Portfolio" cut-out paper style, harmonised with the maroon CV.
References: `docs/design/reference-canva-template.png`, `reference-cv.png`, `reference-old-portfolio-*.png`, `font-specimen-vietnamese.png`.
Research: `plans/reports/researcher-260914-1519-cutout-paper-design-style-report.md`.

## Mood

Scrapbook / paper-cut collage. Off-white paper with faint grain, bold red hand-cut headlines, tilted polaroid photos with soft shadows, small red "sticker" labels in corners, generous whitespace. Confident, warm, a little playful. Never glossy, never gradient-heavy.

## Tokens

```css
:root {
  --paper: #F5F3EE;        /* page background */
  --paper-2: #EDE9E0;      /* card / alt section */
  --red: #C8102E;          /* display headings, labels, CTA */
  --maroon: #8B1A1A;       /* body text, borders (CV harmony) */
  --ink: #1A1A1A;          /* max-contrast body fallback */
  --muted: #6B645C;        /* captions, meta */
  --white: #FFFFFF;        /* polaroid frame */
  --shadow: 0 6px 18px rgba(26,26,26,.14);
  --shadow-lg: 0 14px 34px rgba(26,26,26,.22);
  --radius: 4px;           /* almost square; paper, not pills */
  --tilt-1: -4deg; --tilt-2: 3deg; --tilt-3: -2deg; --tilt-4: 6deg;
}
```

Contrast (measured, WCAG 2.x): red `#C8102E` on paper `#F5F3EE` = **5.3:1**, on `--paper-2` `#EDE9E0` = **4.86:1**; maroon `#8B1A1A` on paper = **8.4:1**; muted `#6B645C` on paper = **5.26:1**, on `--paper-2` = **4.81:1**, on white = **5.83:1**. Muted was darkened from `#7A7269` in phase 7: that value measured 3.91:1 on `--paper-2` and 4.27:1 on `--paper`, failing AA for the 13px meta text it carries. All pass AA for normal text, so the red/maroon split is a **design** rule, not an accessibility constraint: red carries display headings and labels, maroon carries long-form body so the page keeps one loud voice and one quiet one. Red on `--paper-2` is the thinnest margin in the palette — re-measure if `--paper-2` is ever darkened.

## Typography

| Role | Font | Size (desktop / mobile) | Notes |
|------|------|-------------------------|-------|
| H1 hero | Protest Guerrilla | clamp(56px, 9vw, 128px) | uppercase, red, line-height 1.08, letter-spacing .01em |
| H2 section | Protest Guerrilla | clamp(40px, 6vw, 80px) | uppercase, red |
| H3 / labels | Protest Guerrilla | 20-28px | uppercase, red or maroon |
| Body | Be Vietnam Pro 400 | 17px / 16px | maroon, line-height 1.65, max-width 62ch |
| Emphasis | Be Vietnam Pro 600 | inherit | |
| Meta / caption | Be Vietnam Pro 400 | 13px | muted, uppercase, letter-spacing .08em |

Display line-height is **1.08**, not the .95 originally specified: at .95 the stacked Vietnamese tone marks (Ê, Ỳ, Ễ) clip at the cap line and collide with the line above. Measured in phase 7; 1.08 is the tightest value that clears both.

Vietnamese: both fonts ship the `vietnamese` subset and are self-hosted via Fontsource (see `tech-stack.md` for the import rule — weight files, not subset files). Never use `text-transform: uppercase` on body copy (breaks reading of diacritics at small size); OK on display.

## Components

- **Paper background**: `body::before` fixed overlay, SVG `feTurbulence` noise (baseFrequency .8, numOctaves 3) as data URI, `opacity: .06`, `mix-blend-mode: multiply`, `pointer-events: none`.
- **Polaroid**: white frame, `padding: 12px 12px 40px`, `box-shadow: var(--shadow)`, `transform: rotate(var(--tilt))`; optional caption in bottom band (Be Vietnam Pro 13px). Hover: `rotate(0) scale(1.03)`, `--shadow-lg`, 300ms ease-out.
- **Sticker label**: red bg, paper-colour text, Protest Guerrilla 13-15px, `padding: 4px 10px`, `rotate(-3deg)`, small shadow. Used for section index ("01 / ABOUT"), tags, tool names.
- **Stamp / badge**: oval outline (`border: 2px solid var(--red); border-radius: 50%`) like the "2030" stamp on the template cover. Use for year, "OPEN TO WORK", counters.
- **Torn divider**: SVG jagged path between sections that change background (`--paper` ↔ `--paper-2`). One reusable component, flip vertically as needed.
- **Metric tile**: big number in Protest Guerrilla (red), label in body (maroon). Used for 95% / 3+ / 50+ / +200% / +35%.
- **Timeline**: vertical maroon line, red dot per entry, year in display font.
- **CTA button**: red fill, paper text, display font, slight `rotate(-1deg)`, hover wiggle ±2°.
- **Nav**: top bar, left "PORTFOLIO" sticker, right anchor links in Be Vietnam Pro 600 13px uppercase; hides on scroll down, shows on scroll up.

## Layout

- Container `max-width: 1200px`, side padding `clamp(16px, 5vw, 64px)`.
- Sections: `padding-block: clamp(72px, 12vw, 160px)`. Alternate paper / paper-2 with torn dividers.
- 12-col grid desktop, single column < 768px. Photos scatter asymmetrically (offset columns), never centred grids.
- Section header pattern: sticker index top-left → H2 → one-line subtitle (body, muted).

## Motion

| Pattern | Where | Spec |
|---------|-------|------|
| Smooth scroll | global | Lenis, `lerp: .1`, `duration: 1.2` |
| Reveal | every section | `y: 40 → 0`, `opacity 0 → 1`, 0.8s power3.out, `stagger: .08` on children |
| Headline in | H1/H2 | split by word, `yPercent: 110 → 0`, `rotate: 4 → 0`, stagger .04 |
| Polaroid parallax | photo stacks | `yPercent: ±12` scrub, desktop only |
| Marquee | skills strip | CSS `@keyframes` translateX, 40s linear, pause on hover |
| Wiggle | stickers, CTA hover | rotate -2° ↔ 2°, 400ms |
| Nav hide/show | nav | ScrollTrigger onUpdate direction |

`prefers-reduced-motion: reduce` → no Lenis, no parallax, no reveals; content fully visible.

## Do / Don't

- Do keep red for display only; body stays maroon/ink.
- Do keep every photo inside a polaroid or full-bleed with paper edge; no bare rounded images.
- Don't use gradients, glassmorphism, neon, or pill buttons.
- Don't centre everything; the collage lives on asymmetry.
- Don't show more than 2 tilted elements per viewport on mobile.
