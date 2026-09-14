# Red Team Review: Assumption Destroyer — Nghiêm Quỳnh Mai Portfolio Plan

Reviewer role: fact checker. Every concrete claim below was verified against npm registry output, extracted package sources (astro 7.3.2, gsap 3.15.0, lenis 1.3.26, @astrojs/check 0.9.10), the live Google Fonts CSS2 response, the actual 13 PNGs in `public/images/`, the GitHub API for `withastro/action`, and direct WCAG contrast computation. Package/font version claims in the plan are accurate. The findings below are real defects, not style nitpicks.

## Finding 1: Polaroid upscales below-resolution source images beyond the plan's own stated mitigation
- **Severity:** High
- **Location:** Phase 3, "about-me.astro composition" (implicit portrait Polaroid, no width override) and Phase 4, section "branding-positioning.astro" step 3 ("Industry images use `<Polaroid width={360}>`")
- **Flaw:** `photo-mai-avatar.png` is 225x225px (measured). Phase 2's `polaroid.astro` defaults `width` to 480 and always requests `densities={[1,2]}` (i.e. up to 960px for the 2x variant). Phase 3 never overrides this for the About portrait. Separately, `work-croissant-photo.png` is 225x226px but Phase 4 explicitly requests `<Polaroid width={360}>` for it — a 60% upscale on a named, non-placeholder deliverable image.
- **Failure scenario:** Astro's built-in sharp image service resizes with the `withoutEnlargement: true` option set (confirmed by reading the published astro@7.3.2 package's compiled `assets/services/sharp.js`), so it silently caps output at the source's native resolution instead of erroring. The generated `<img>` still carries `width="480"`/`width="360"` attributes, so the browser stretches a ~225px asset to fill that box — visibly blurry, exactly the defect the plan explicitly calls out for the 8 `work-*.png` thumbnails (plan.md:66, phase-05 "Image-width contract" with an intrinsic-width clamp) but never applies to the avatar portrait or the croissant/watch photos used at fixed widths in Phase 4.
- **Evidence:** measured `photo-mai-avatar.png` = 225x225, `work-croissant-photo.png` = 225x226 (via PIL); `polaroid.astro` Props `width?: number; // default 480` (phase-02-shared-components.md:102); `<Polaroid width={360}>` (phase-04-sections-branding-strategy-seo.md:130); sharp resize call confirmed to use `withoutEnlargement: true` in the extracted astro@7.3.2 package's compiled sharp image service module.
- **Suggested fix:** Reuse the `works-wall.astro` intrinsic-width clamp (`Math.min(requested, meta.width)`) inside `polaroid.astro` itself, so every consumer gets the protection, not just the one component built for it in phase 5.

## Finding 2: `@layouts/*` path alias never defined, worked around with a fragile relative escape
- **Severity:** High
- **Location:** Phase 1, "tsconfig.json" step 3; Phase 3, "index.astro" step 11
- **Flaw:** Phase 1 defines path aliases as exactly `@data/*`, `@components/*`, `@styles/*`, `@types/*` (phase-01-scaffold-tokens-fonts-data.md:121). `base-layout.astro` lives in `src/layouts/`, which has no alias. Phase 3's only `index.astro` example imports it as `import BaseLayout from '@components/../layouts/base-layout.astro';` (phase-03-sections-hero-about-contact.md:204).
- **Failure scenario:** This relies on `@components/*` (`src/components/*`) plus a literal `..` segment textually collapsing to `src/layouts/...`. Whether Astro/Vite's alias resolver normalizes `..` the same way TypeScript's `paths` matcher does is implementation-dependent; at minimum this is undocumented, unreviewed behavior for the single most load-bearing import in the app (every page depends on `BaseLayout`). No other phase file even attempts this import, so it was never exercised against the actual toolchain during planning.
- **Evidence:** alias list at phase-01-scaffold-tokens-fonts-data.md:121; the escape-import at phase-03-sections-hero-about-contact.md:204; grep across all 7 phase files shows zero other reference to `@layouts`.
- **Suggested fix:** Add `"@layouts/*": ["src/layouts/*"]` to the phase-1 tsconfig paths list now, before phase 2 starts (per the plan's own rule: "Do not rename a token after phase 2 starts").

## Finding 3: "typescript@7 breaks install" claim contradicts pnpm's actual default behavior
- **Severity:** Medium
- **Location:** plan.md:51 ("Key decisions"); Phase 1, step 1 note ("`typescript@7`... breaks install")
- **Flaw:** `@astrojs/check@0.9.10` peerDependencies is `{"typescript": "^5.0.0 || ^6.0.0"}` (confirmed via `npm view`), and current `typescript@latest` is `7.0.2` (confirmed). But pnpm's documented default is to print `WARN Issues with peer dependencies found` and **continue the install** — it only hard-fails with `ERR_PNPM_PEER_DEP_ISSUES` when `strict-peer-dependencies` is explicitly enabled. The plan creates a `.npmrc` file (phase-01 "Related Code Files") but never specifies its contents, so there's no evidence this setting is actually turned on.
- **Failure scenario:** Whoever implements Phase 1 pins `typescript: 6.0.3` on the stated premise that `typescript@7` "breaks install" and never revisits it; later, someone bumps typescript for an unrelated reason and is confused when `pnpm install` succeeds with only a warning, undermining trust in the plan's stated constraints.
- **Evidence:** `npm view @astrojs/check@0.9.10 peerDependencies` → `{ typescript: '^5.0.0 || ^6.0.0' }`; `npm view typescript version` → `7.0.2`; pnpm default peer-dependency behavior (warn, not fail, absent `strict-peer-dependencies`).
- **Suggested fix:** Either state the `.npmrc` must set `strict-peer-dependencies=true` to actually get the described failure, or rephrase the risk as "unmet peer dependency warning," not "breaks install."

## Finding 4: `image.responsiveStyles: true` config option is inert given how `<Image>` is actually used
- **Severity:** Medium
- **Location:** Phase 1, "astro.config.mjs" step 2 (`image: { responsiveStyles: true }`)
- **Flaw:** Astro 7.3.2's own type declarations state `responsiveStyles` "is only used when `layout` is set to `constrained`, `full-width`, or `fixed`" (confirmed by reading the published package's compiled `assets/types.d.ts`). The `Image` component's prop types make `layout` and `densities` mutually exclusive (`densities?: (...); widths?: never; layout?: never`). Phase 2's `polaroid.astro` — the only image wrapper in the whole project — always passes `densities={[1, 2]}` and never a `layout` prop.
- **Failure scenario:** No functional break, but the config line does nothing for the entire build; anyone reading `astro.config.mjs` will believe responsive-image styling is active when it never fires.
- **Evidence:** `image.responsiveStyles` doc comment in the astro@7.3.2 package's compiled `assets/public/config.d.ts`; `densities?: never`-exclusion in the same package's compiled `assets/types.d.ts`; Polaroid call site in phase-02-shared-components.md:108 (`densities={[1, 2]}`, no `layout`).
- **Suggested fix:** Either drop the config line (dead code) or switch `polaroid.astro` to `widths`+`layout="constrained"` if responsive styles are actually wanted.

## Finding 5: GitHub Actions pin is 3 major versions stale, breaking the plan's own verification discipline
- **Severity:** Medium
- **Location:** Phase 7, step 9 (`.github/workflows/deploy-github-pages.yml`, `uses: withastro/action@v3`)
- **Flaw:** Every npm dependency in this plan carries a "verified on npm 2026-09-14" annotation, but the GitHub Action reference was not checked the same way. Live GitHub API query shows the current release is `v6.1.2` (tag `v6` also exists).
- **Failure scenario:** Not a hard break (old tags stay resolvable), but the plan misses v6 defaults/features it would otherwise want — e.g. v6's `node-version` input now defaults to `"24"` (matching the stated Node 24 stack) and adds `cache`/`out-dir` inputs the plan's Lighthouse-performance risk mitigation (phase 7 risk table, "image widths... defer GSAP... drop parallax") never considers.
- **Evidence:** `curl https://api.github.com/repos/withastro/action/releases/latest` → `"tag_name": "v6.1.2"`; the action's own metadata file at tag `v6` shows `node-version` default `"24"`.
- **Suggested fix:** Pin `withastro/action@v6` (or `@v6.1.2`) and drop the explicit `node-version: 22` input already present in the plan, since v6's default now matches the project's actual Node 24 baseline.

## Finding 6: design-guidelines.md contrast figures are measurably wrong, undermining Phase 7's accessibility rule
- **Severity:** Medium
- **Location:** `docs/design-guidelines.md:29` ("Contrast: red on paper = 3.2:1... display text ≥ 24px only. Body copy uses `--maroon` (6.9:1)"); consumed by Phase 7, "Accessibility pass" ("Red is display-only and only at ≥ 24 px. Audit every red text node's computed font-size; anything red under 24 px moves to maroon")
- **Flaw:** Computed WCAG 2.x contrast ratio for `#C8102E` on `#F5F3EE` is ≈5.3:1, not 3.2:1; `#8B1A1A` on `#F5F3EE` is ≈8.4:1, not 6.9:1 (standard relative-luminance formula, verified by direct calculation).
- **Failure scenario:** The actual red-on-paper ratio (5.3:1) clears WCAG AA's 4.5:1 threshold for *normal-size* text, not just large text — so the ≥24px-only restriction that Phase 7 treats as a hard accessibility gate is built on a number that's wrong by ~66%. This doesn't create an a11y failure (the real number is better than claimed), but it means Phase 7's audit step enforces a constraint whose documented justification doesn't hold, and if a *different* token pairing is verified with the same flawed methodology, the error could point the wrong way next time.
- **Evidence:** direct WCAG contrast computation for `#C8102E`/`#F5F3EE` = 5.305, `#8B1A1A`/`#F5F3EE` = 8.378 (relative-luminance formula, computed in this review).
- **Suggested fix:** Recompute and correct the contrast figures in `design-guidelines.md` before Phase 7 treats the 24px threshold as load-bearing; re-derive the actual minimum safe font-size from the corrected ratio.

## Finding 7: Hand-rolled Lenis anchor handling duplicates a built-in library feature with no stated rationale
- **Severity:** Low
- **Location:** Phase 6, `lenis-setup.ts` step 2 ("Anchor handling")
- **Flaw:** Lenis 1.3.26's `LenisOptions` includes `anchors?: boolean | ScrollToOptions` — "If `true`, Lenis will automatically handle anchor links automatically" (confirmed in the package's own type declaration file, default `false`). The plan instead hand-writes a global `click` listener plus manual `focus({ preventScroll: true })` management to replicate this.
- **Failure scenario:** Not a bug by itself, but it's an unexamined assumption — the plan (and `docs/tech-stack.md`'s "Integration rules") never mentions this native option exists or explains why it was rejected in favor of ~15 lines of custom code that must independently get focus-management right, when the library's own feature might already handle it (or might not — that's exactly the unverified assumption).
- **Evidence:** `anchors?: boolean | ScrollToOptions` with `@default false` in the extracted lenis@1.3.26 package's type declaration file (LenisOptions).
- **Suggested fix:** Either document why the built-in `anchors` option was rejected (e.g. it doesn't move keyboard focus, which the plan's custom code correctly does), or drop the custom listener in favor of `anchors: true` plus a smaller focus-only patch.

## Summary

7 evidence-backed findings: 2 High, 4 Medium, 1 Low. The most serious gap is that the plan's own low-res-image mitigation (built for the 8 work thumbnails in Phase 5) doesn't cover the avatar portrait or the explicitly-widened croissant photo, both of which will visibly blur. Second most serious is a missing `@layouts` alias forcing an unverified relative-escape import for the single most critical file in the app. Package/font version claims (astro 7.3.2, gsap 3.15.0, lenis 1.3.26, @astrojs/check 0.9.10, Vietnamese font subsets, gsap.matchMedia API) all checked out as accurate.

## Unresolved Questions

- Does Astro/Vite's alias resolver actually normalize the `@components/../layouts/...` escape the same way TypeScript does? Not verified against a running build (no source code exists yet in this repo).
