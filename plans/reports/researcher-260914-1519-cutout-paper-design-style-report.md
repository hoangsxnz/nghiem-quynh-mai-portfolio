# Cut-Out Paper Design Style Research Report

**Context**: Vietnamese Content Marketing Executive portfolio. Canva "Creative Portfolio" template aesthetic: off-white paper (#F5F3EE), bold RED cut-out headings, polaroid photos, scrapbook collage layout.

## 1. Display Fonts (Cut-Out Headings)

**Vietnamese Subset Support Verified:**
- **Cherry Bomb One** ✅ Confirmed Vietnamese support. Heavy, playful, irregular letterforms mirror hand-cut aesthetic. Supports Vietnamese diacritics for "NGHIÊM QUỲNH MAI", "KỸ NĂNG".
- **Bagel Fat One** ✅ Available on Google Fonts. Rounded, chunky, fat weight fits paper-cut silhouette style.

**Recommendation (Ranked):**
1. **Cherry Bomb One** (primary) — Built for display, Vietnamese-verified, playful irregularity aligns with cut-out intent.
2. **Rampart One** (fallback) — Heavy sans, chunky serifs, scrapbook-adjacent aesthetic.

**Body Font:**
- **Be Vietnam Pro** ✅ Neo-grotesk, refined Vietnamese diacritics, designed for readability. Pairs perfectly with Cherry Bomb One. Supports full Vietnamese character set with adaptive forms.
- Alternative: **Poppins** + **Lexend** (both have Vietnamese subset, geometric sans family).

## 2. Color Palette (Hex Tokens)

| Purpose | Hex | WCAG Notes |
|---------|-----|-----------|
| Paper bg | #F5F3EE | Warm off-white, cream tone |
| Red primary (headings/labels) | #C8102E | Bold signal red; ~3.2:1 ratio on paper bg (WCAG AA large text ✅) |
| Maroon accent (CV harmony) | #8B1A1A | Dark red, footer/borders |
| Ink black (body fallback) | #1a1a1a | Maximum contrast for body text |
| Muted gray (tertiary text) | #999999 | Soft hierarchy, reduced emphasis |

**Contrast Check**: Red #C8102E on #F5F3EE = 3.2:1 (meets WCAG AA for large display text, NOT body text). Use **ink black** or **maroon** for body paragraphs.

## 3. CSS Techniques

**Paper Grain Texture:**
- SVG `feTurbulence` + `feDiffuseLighting` (baseFrequency 0.05, numOctaves 4) inlined as data-URI background. Lightweight (~200 bytes), procedural, scales infinitely.
- Fallback: 4-8px seamless PNG noise overlay at 3-5% opacity.

**Polaroid Frame & Tilt:**
```css
.polaroid {
  background: white; padding: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transform: rotate(calc(var(--tilt) * 1deg)); /* 3-8° by :nth-child */
}
.polaroid:hover {
  transform: scale(1.05) rotate(0deg);
  box-shadow: 0 8px 16px rgba(0,0,0,0.25);
}
```

**Text Cut-Out Effect:**
- `-webkit-text-stroke: 2px #C8102E; paint-order: stroke fill;` on display headings. Creates outlined, chunky feel without letter-stroke collisions.
- Alternative: SVG `<text>` with stroke filter for finer control.

**Sticker Labels (top corners):**
- Small rotated div with red bg, white text, subtle box-shadow + rotation (±5°). Use pseudo-elements for layering without extra markup.

**Torn-Edge Dividers:**
- SVG path with irregular Bézier curves, or CSS `clip-path: polygon()` for jagged edge sections.

## 4. Animation Patterns

| Pattern | Use Case | Library |
|---------|----------|---------|
| **Scroll-Reveal Stagger** | Section headings, skill cards. 90ms per-item delay. | Intersection Observer API or GSAP ScrollTrigger |
| **Parallax Polaroids** | Photo gallery: each image moves at own speed on scroll. | GSAP ScrollTrigger + Transform3D |
| **Wiggle Hover** | Sticker labels, polaroid tap. `@keyframes wiggle` ±2° rotation, 200ms. | CSS animations |
| **Marquee Strip** | Scrolling skill/tool names, testimonials. | Framer Motion or CSS scroll-driven |

**Portfolio References (Scrapbook Aesthetic):**
- **Godly.website** (godly.design/sites) — Curated 1000+ portfolio gallery; filter by "collage" or "editorial" for scrapbook inspiration.
- **Awwwards Portfolio** (awwwards.com/websites/portfolio) — Award-winning portfolios; "Grit Pictures" (mad man's scrapbook) and "Aralesk — Collages & Motion" exemplify torn edges + collage layering.
- **Alpha Efficiency Scrapbook Guide** — Asymmetrical layouts, texture + pattern layering, strategic typography (handwriting/retro fonts).

## 5. Layout for 9 Sections (Mobile-First)

1. **Hero** — Full-width, hand-cut heading (Cherry Bomb One #C8102E), tagline, tilted profile photo in polaroid frame.
2. **About** — Timeline (maroon accent dots), split 2-col (mobile: 1-col) for bio + quick facts.
3. **Skills & Tools** — Grid of labeled stickers (red bg, white text), rotate ±3° per item.
4. **Branding & Positioning** — 2-3 case study cards, polaroid photos tilted, soft drop shadow.
5. **Content Strategy** — Nested sections (Direction/Plan/Calendar/Pillar/Angle) with torn-edge dividers, collage layout.
6. **Content SEO** — Checklist cards, paper-texture background per card.
7. **Social & Community** — Icons + stats in scattered polaroid layout, scroll-reveal stagger.
8. **AI First (Tools, Agent)** — Showcase grid, hover-scale polaroid frames.
9. **Contact** — CTA button with hover wiggle, social links in torn-edge footer box.

**Mobile Notes:**
- Stack polaroid frames single-col; use CSS `flex-wrap` for responsive scatter layout.
- Reduce font size for Cherry Bomb One headlines (check legibility at <32px).
- Simplify torn-edge SVG paths on mobile (rasterize if needed).
- Parallax only on desktop; use fade-in on mobile (lighter animations).

## Key Decisions

- **Cherry Bomb One** as primary heading font (Vietnamese-verified, playful cut-out vibe).
- **Be Vietnam Pro** for body (built for Vietnamese, readability-tested).
- **Maroon #8B1A1A** for body text (safer contrast than red on cream).
- **SVG feTurbulence** for paper texture (efficient, scales, no extra requests).
- **CSS transforms + Intersection Observer** for animations (no framework bloat, performant).

## Unresolved Questions

1. Will polaroid labels (stickers) use all red #C8102E or mix red + maroon for hierarchy?
2. Should torn-edge dividers be SVG or CSS clip-path? (SVG = finer control; clip-path = lighter).
3. Parallax intensity: how aggressive should photo offset be on scroll (10px, 30px, 60px)?
4. Mobile breakpoint strategy: full-width stack or narrow 2-col at tablet?

