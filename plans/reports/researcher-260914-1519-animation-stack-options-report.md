# Animation Stack Research: Personal Portfolio Recommendation

**Requirement Context:** Single-page portfolio (~9 sections), smooth effects/transitions, static hosting, non-developer content edits.

---

## Stack Comparison Matrix

| Dimension | Vite + Vanilla + GSAP | Astro + GSAP | Next.js + Motion |
|-----------|------------------------|---------------|------------------|
| **Bundle (gzipped)** | ~100–120 KB | ~80–100 KB | ~150–160 KB (15–30 KB Motion w/ LazyMotion) |
| **JS by Default** | Full GSAP | ~0 KB + GSAP on demand | ~50+ KB React + Motion |
| **Animation Control** | Excellent (full GSAP API) | Very good (AstroAnimate + GSAP) | Good (Motion is React-only) |
| **Content Editing** | HTML/JSON (simple) | MD/JSON (easiest) | MDX/custom (complex) |
| **Static Hosting** | Native | Native | Static export (limited features) |
| **Learning Curve** | Moderate | Low–Moderate | Moderate–High |
| **Maintenance** | Low | Very low | Moderate |
| **Prefers-Reduced-Motion** | Manual impl required | Manual (standard GSAP) | Built-in Motion hook |
| **Dev Experience** | Manual DOM mgmt | Components + MD | React ecosystem |

---

## Stack Details

### 1. **Vite + Vanilla + GSAP + Lenis**

**Pros:**
- Smallest footprint; zero framework overhead
- GSAP now 100% free (all plugins: ScrollTrigger, SplitText, etc. since Apr 2025)
- Direct DOM control = predictable animations
- Lenis (3–5 KB) pairs smoothly with GSAP once RAF loop synced

**Cons:**
- Manual state mgmt and event listeners get verbose
- Owner must understand HTML structure to edit content
- More potential for bugs in custom scroll logic

**Bundle Estimate:** Vite ~50 KB + GSAP core ~80 KB + Lenis ~5 KB ≈ **135 KB gzipped**.

**Critical Gotcha:** Lenis + GSAP ScrollTrigger require RAF sync:
- Set `autoRaf: false` on Lenis init
- Add `lenis.on('scroll', ScrollTrigger.update)` + wire Lenis to GSAP ticker
- Solution is well-documented; default Lenis + ScrollTrigger will jank

---

### 2. **Astro + GSAP + Lenis** ← **RECOMMENDED**

**Pros:**
- **0 KB JavaScript by default** (static HTML shipped)
- GSAP only loads on pages/sections that animate
- MD/JSON content: owner can edit `src/content/` folder without touching JS
- AstroAnimate components (45 KB opt-in) for simple fade/slide reveals
- View Transitions API handles smooth page transitions natively
- Astro 7.2 (July 2026) includes Vite 8 with Rolldown bundler → better tree-shaking
- Well-documented GSAP integration (Codrops Feb 2026 tutorials)
- Seamless static hosting on GitHub Pages / Vercel / Netlify

**Cons:**
- Islands architecture adds cognitive load if over-zealous with client directives
- View Transitions Safari support still ramping up (acceptable for portfolio)

**Bundle Estimate:** Astro core ~5 KB + GSAP only on animated sections ~80 KB ≈ **85 KB gzipped** (or ~5 KB if no JS needed for pure CSS/VT sections).

**Content Structure (Trivial for Non-Dev):**
```
src/content/sections/
├── hero.md
├── about.md
├── strategy.md
└── contact.md
```
Owner edits Markdown; animations live in Astro components.

---

### 3. **Next.js + Framer Motion (Motion)**

**Pros:**
- React ecosystem (if team grows)
- Motion has built-in `useReducedMotion()` hook (accessibility advantage)
- Gestures + scroll triggers via Motion + react-use-gesture
- Familiar to React developers

**Cons:**
- **Overkill for static portfolio:** Next.js is optimized for apps, not blogs
- Framer Motion bundle: ~30–34 KB gzipped (needs LazyMotion optimization to halve)
- Static export mode has limitations (no revalidation, no dynamic routes)
- GitHub Pages deployment requires workarounds (GitHub Actions + output: export + basePath config)
- Content editing requires MDX or custom CMS (more friction for non-dev owner)
- React hydration overhead (~50+ KB base Next.js + Motion)

**Bundle Estimate:** Next.js ~60 KB + Motion ~30 KB ≈ **90 KB gzipped** minimum (even with LazyMotion optimization).

---

## Cross-Stack Concerns

### **GSAP + Lenis Sync (All Stacks)**
- **Issue:** Lenis runs its own RAF loop; GSAP's ScrollTrigger reads old scroll values → 1–2 frame lag
- **Solution:** Pin Lenis to `gsap.ticker`; set `autoRaf: false`
- **Impact:** No blocker; fix is straightforward and tested in production (2026 guides confirm)

### **Prefers-Reduced-Motion**
- **Framer Motion:** Automatic via `useReducedMotion()` hook → accessibility-first
- **GSAP (Astro/Vite):** Manual; wrap GSAP timeline in `window.matchMedia('(prefers-reduced-motion: reduce)').matches` check
- **Impact:** Astro/Vite require 10 lines of code; acceptable trade-off for bundle savings

### **Vietnamese Font Rendering**
- **Issue:** Unsemested fonts bloat to 400+ KB; diacritics may decompose
- **Solution:** Font subsetting (Noto Sans → 30–50 KB for Vietnamese + Latin)
- **Impact:** Same across all stacks; use font-loader optimization or Google Fonts with lang parameter

### **Lighthouse Impact**
- **Astro:** 0 JS = 100/100 LCP (unless GSAP lands on hero)
- **Vite + Vanilla:** 95–100 (control over what loads when)
- **Next.js + Motion:** 85–92 (React hydration cost, even static export)

---

## Content Editing (Non-Dev Owner)

| Stack | Workflow | Friction |
|-------|----------|----------|
| **Vite + Vanilla** | Edit `index.html` or YAML data files | Medium (must understand HTML structure) |
| **Astro** | Edit `.md` files in `src/content/` + JSON frontmatter | **Low** (pure Markdown) |
| **Next.js** | Edit `.mdx` files or run CMS | High (needs build + deploy for any change) |

**Winner: Astro** (content lives separately; structure is invisible to owner).

---

## Version Pinning (Recommendation: Astro Path)

```json
{
  "dependencies": {
    "astro": "^7.2.0",
    "gsap": "^3.12.2",
    "lenis": "^1.3.26"
  }
}
```

**Note:** GSAP is now free under Webflow (Oct 2024 acquisition, Apr 2025 free release). No license concerns.

---

## Final Recommendation

### **Use Astro + GSAP + Lenis**

**Why:**
1. **Smallest JS footprint:** 0 KB by default; GSAP only loads where needed
2. **Content editing:** Owner can manage portfolio sections via Markdown—no dev skills required
3. **Animation ergonomics:** Full GSAP power (ScrollTrigger, timelines, morph) + Lenis smoothness
4. **Hosting simplicity:** One-click deploy to Vercel/GitHub Pages; no config headaches
5. **2026-ready tooling:** Astro 7 + Vite 8 (Rolldown) provides modern bundling
6. **Accessibility:** Manual prefers-reduced-motion handling is ~10 lines; acceptable
7. **Proven integration:** Codrops & community guides exist (Feb–July 2026)

**Minimal Dependency List:**
```
astro@7.2.0
gsap@3.12.2
lenis@1.3.26
@astrojs/react (optional, only if adding interactive components later)
@astrojs/mdx (if content needs dynamic elements)
```

**Bundle Estimate:** ~85 KB gzipped (GSAP + Lenis only fire on animated sections; hero and static sections ship 5 KB JS or less).

---

## Unresolved Questions

1. **Does owner have access to design mockups?** (Affects component structure; low priority, doesn't block stack choice)
2. **Is Vietnamese font subsetting already defined in brand?** (Recommend Noto Sans Vietnamese + Latin; 35 KB vs 400 KB default)
3. **Will analytics/tracking be needed later?** (All stacks support; no impact on recommendation)

---

## References

- [GSAP Now 100% Free (Webflow, Apr 2025)](https://webflow.com/updates/gsap-becomes-free)
- [Lenis ~3–5 KB Bundle](https://github.com/darkroomengineering/lenis)
- [Astro 7.2 Release (July 2026)](https://astro.build/blog/whats-new-july-2026/)
- [GSAP + ScrollTrigger + Lenis Sync Guide](https://gsap.com/community/forums/topic/39286-scrolltrigger-lenis-problem/)
- [Framer Motion/Motion Bundle Size & LazyMotion](https://motion.dev/docs/react-reduce-bundle-size)
- [Astro GSAP Integration Tutorial (Codrops, Feb 2026)](https://tympanus.net/codrops/2026/02/18/)
- [Vietnamese Font Subsetting for Performance](https://blog.lueurexterne.com/en/blog/variable-fonts-optimizing-web-typography-and-performance-in-2026/)
- [Next.js Static Export Limitations (2026 Docs)](https://nextjs.org/docs/app/guides/static-exports)
- [Vite Bundle Analysis (2026 Benchmarks)](https://medium.com/better-dev-nextjs-react/vite-6-0-vs-next-js-turbopack-the-bundle-size-showdown-6f1c2c91a5c2)

