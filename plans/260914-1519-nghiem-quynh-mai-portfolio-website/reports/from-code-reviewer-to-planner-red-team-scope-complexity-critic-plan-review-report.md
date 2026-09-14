# Red-Team Scope & Complexity Critic — Plan Review

Reviewer role: SCOPE & COMPLEXITY CRITIC (YAGNI enforcer) + CONTRACT VERIFIER.
Scope reviewed: plan.md and phase-01..07 in this plan folder, cross-checked against
docs/tech-stack.md, docs/design-guidelines.md, docs/content-source.md, and public/images/.

Constraints NOT flagged as over-engineering (user-confirmed): Astro + GSAP + Lenis stack;
content in src/data/*.json; vanilla CSS tokens; files < 200 lines; the 9-section order;
Protest Guerrilla + Be Vietnam Pro fonts; [PLACEHOLDER] draft copy for 4 sections;
reduced-motion support; GitHub Pages + Vercel deploy notes.

---

## Finding 1: Nav item count contradicts itself within Phase 3
- **Severity:** Medium
- **Location:** Phase 3, "Requirements" and step 3 "nav.json"
- **Flaw:** Requirements says the nav lists "all nine anchors," but step 3 says "brand plus the nine anchors" and then lists only 8 labels (About Me, Branding, Strategy, SEO, Social, UGC, AI First, Contact), explicitly stating "Hero is not in the list." Nine sections exist on the page, but the nav — by design — only links to eight of them.
- **Failure scenario / cost:** Whoever implements this from the phase file alone will either add a spurious 9th nav item to satisfy the "nine anchors" line (breaking the stated "Hero is not in the list" rule) or leave it at 8 and wonder if they missed one. Either way it's a 10-minute confusion tax paid by the implementer, and it's a self-contained fix.
- **Evidence:** phase-03-sections-hero-about-contact.md:30 "Nav renders immediately after the hero, listing all nine anchors." vs phase-03-sections-hero-about-contact.md:100-102 "brand plus the nine anchors ... `PORTFOLIO` / `About Me`, `Branding`, `Strategy`, `SEO`, `Social`, `UGC`, `AI First`, `Contact`. Hero is not in the list"
- **Suggested fix:** Change line 30 to "listing the eight non-hero anchors" (or equivalent), matching step 3.

## Finding 2: Full dual-host deploy pipeline built speculatively before the owner has picked a host
- **Severity:** High
- **Location:** Phase 1 step 2 (astro.config.mjs), Phase 7 steps 8-9 (README deploy section, GitHub Actions workflow)
- **Flaw:** `docs/tech-stack.md` itself says hosting is "Decided at deploy time" — i.e., unknown. Yet the plan unconditionally builds a full GitHub Actions Pages workflow (permissions, concurrency group, deploy-pages action) and threads base-path awareness (`import.meta.env.BASE_URL`, `site`/`base` PLACEHOLDER) through Phase 1's config and Phase 7's QA/README, covering both GitHub Pages *and* Vercel, for an owner who is "a non-developer" and will pick exactly one.
- **Failure scenario / cost:** If the owner deploys to Vercel (which "needs no workflow file" per the plan's own table), the entire `.github/workflows/deploy-github-pages.yml` file, the GH-Pages-specific base-path testing in Phase 7 step 1, and the dual-target row in the README are wasted effort with zero payoff — a straight subtraction from the 4h Phase 7 budget for a page nobody asked to be GH-Pages-ready.
- **Evidence:** docs/tech-stack.md:18 "Hosting | Static (GitHub Pages / Vercel / Netlify) | - | Decided at deploy time"; phase-01-scaffold-tokens-fonts-data.md:109-113 (dual-target comment + PLACEHOLDER site); phase-07-responsive-a11y-qa-build-deploy.md:57-59, 166-196 (full workflow YAML + dual deploy notes)
- **Suggested fix:** Ask the owner which host before Phase 7, or ship only the simplest path (Vercel needs nothing extra — zero-config static Astro build) and defer the GitHub Actions workflow to a follow-up task if/when GH Pages is actually chosen.

## Finding 3: Phase 1 and Phase 2 are artificially split with no intervening deliverable
- **Severity:** Medium
- **Location:** Phase 1 (Scaffold Tokens Fonts Data, 3h) and Phase 2 (Shared Components, 3h)
- **Flaw:** Phase 2's only dependency is Phase 1, both are priority P1, both phases explicitly produce nothing visible to the owner ("nothing visual ships yet beyond a blank paper page" — Phase 1; components only get eyeballed on a dev-only `/ui-kit` page — Phase 2). The plan's own dependency graph is "1 → 2 → (3→4→5) → 6 → 7" with no fan-out at this point, i.e. one person doing foundation setup then immediately doing component primitives, back to back, with no external checkpoint in between.
- **Failure scenario / cost:** Two "Context / Overview / Related Code Files / Implementation Steps / Todo / Success Criteria / Risk / Security / Next Steps" phase documents (22KB total) exist where one would do — same total effort (6h), but double the report boilerplate, double the "pnpm check && pnpm build" verify cycles, and a phase-transition report that adds no information (Phase 2's "Context" section literally just points back at Phase 1's outputs).
- **Evidence:** plan.md:56 "Phases run in order. 1 → 2 → (3 → 4 → 5) → 6 → 7."; phase-01-scaffold-tokens-fonts-data.md:20-22 "Nothing visual ships yet beyond a blank paper page"; phase-02-shared-components.md:15 "Phase 1 output: `src/styles/tokens.css`, `src/types/content.ts`, `src/lib/image-map.ts`"
- **Suggested fix:** Merge into one "Foundation" phase (scaffold + tokens + types + the 9 UI primitives), single verify pass at the end.

## Finding 4: Dev-only `/ui-kit` showcase page is scope the owner never asked for, and its fate is left unresolved for two phases
- **Severity:** Medium
- **Location:** Phase 2 step 10, Phase 7 README section
- **Flaw:** Building a full component-showcase page (every variant of all 9 primitives, noindex, "never linked from index.astro") is a design-system practice that pays off when multiple developers reuse components across multiple pages. This is a single static page with one owner and one implementer. The plan doesn't even commit to keeping or deleting it — it punts the decision five phases later ("Phase 7 decides keep-hidden vs delete and records the decision in the README").
- **Failure scenario / cost:** Extra file to build, verify (`pnpm check`, `pnpm build`, visual compare against the reference image) and maintain in Phase 2, plus a leftover decision debt that Phase 7 has to remember to resolve. If left in the shipped `dist/`, it's a stray unauthenticated page indexable by URL guessing (mitigated only by `noindex`, not by removal) that nobody but the builder will ever open.
- **Evidence:** phase-02-shared-components.md:122 "dev-only gallery ... Phase 7 decides keep-hidden vs delete and records the decision in the README."; phase-07-responsive-a11y-qa-build-deploy.md:164 "state whether `/ui-kit` was kept ... or deleted, and how to delete it."
- **Suggested fix:** Skip the dedicated page; verify each primitive visually in-situ as sections are built (phases 3-5 already render every component in context). Decide now (delete before ship) rather than deferring the decision.

## Finding 5: `content.ts` interface stubs are declared in Phase 1 then re-opened for edits in three later phases, with no parallelism benefit
- **Severity:** Low-Medium
- **Location:** Phase 1 step 9, "Modify" lists in Phases 3, 4, 5
- **Flaw:** Phase 1 pre-declares `content.ts` with only `HeroContent`/`NavContent` fleshed out and a comment "same pattern, each defined by the phase that fills it (3-5) but declared here in phase 1." Phases 3, 4, and 5 then each reopen the same file to "fill" `AboutContent`/`ContactContent`, then `BrandingContent`/`StrategyContent`/`SeoContent`/`CaseStudy`, then `SocialContent`/`UgcContent`/`AiFirstContent`. Since phases run strictly sequentially (1→2→(3→4→5)→6→7, single implementer per plan.md), there is no parallel-work reason to pre-declare stubs — the interface could just be added in full at the phase that first needs it.
- **Failure scenario / cost:** Three extra "modify this shared file" touchpoints across phases that must each avoid clobbering the others' additions, for no benefit (no other phase or teammate reads the empty stub in between). Small, but it's process overhead invented for a scenario (parallel/team access to a shared types file) that this plan does not have.
- **Evidence:** phase-01-scaffold-tokens-fonts-data.md:213-215 "same pattern, each defined by the phase that fills it (3-5) but declared here in phase 1"; phase-03:72, phase-04:80, phase-05:69 (each "fill" instruction)
- **Suggested fix:** Let each phase add its own interfaces to `content.ts` in full when first consumed; drop the "declare stub in phase 1" step.

## Finding 6: Empty-gallery guard for the shared `case-study.astro` is a known risk with no file-ownership path to fix it
- **Severity:** High
- **Location:** Phase 4 "Related Code Files" (Create/Modify lists) vs Phase 5 Risk Assessment
- **Flaw:** Phase 4 creates `strategy/case-study.astro` generically so Phase 5 can reuse it for Case Study 2, which has `gallery: []`. Phase 5's own risk table flags: "Case Study 2 has no gallery, phase-4 component assumes one ... `case-study.astro` must guard on empty array — add the guard here if phase 4 missed it." But Phase 5's "Related Code Files → Modify" list (`src/pages/index.astro`, `src/data/social.json`, `ugc.json`, `ai-first.json`, `src/types/content.ts`) does **not** include `strategy/case-study.astro` — that file belongs to Phase 4 per the ownership convention stated in Phase 4's own "Next Steps" ("phase 5 may not fork it").
- **Failure scenario / cost:** If Phase 4's implementation of `case-study.astro` doesn't already guard on an empty gallery array (plausible, since Phase 4's own spec for the component never mentions the empty case — it only appears in Phase 5's risk table), Phase 5 has no documented permission to edit the file that needs the fix, or must edit an out-of-scope file, violating the plan's own file-ownership rule and silently expanding the phase's touched-files list.
- **Evidence:** phase-04-sections-branding-strategy-seo.md:77-80 (Modify list, no gallery-empty guard called out); phase-05-sections-social-ugc-ai-first.md:249 "Case Study 2 has no gallery ... add the guard here if phase 4 missed it"; phase-05-sections-social-ugc-ai-first.md:66-69 (Modify list omits case-study.astro)
- **Suggested fix:** Add the empty-gallery guard explicitly to Phase 4's implementation steps for `case-study.astro` now (it already knows Phase 5 needs it), removing the "if phase 4 missed it" contingency, or add `strategy/case-study.astro` to Phase 5's Modify list.

## Finding 7: Chart image width override (`width={720}`) has no field in the data contract or component Props to carry it
- **Severity:** Medium
- **Location:** Phase 4, Risk Assessment vs `strategy.json` shape (step 4) and `case-study.astro` Props (Architecture / step 7)
- **Flaw:** The Risk Assessment table says "Charts get `width={720}`" to keep them legible on mobile, overriding `polaroid.astro`'s documented default of 480. But `strategy.json`'s `caseStudy.gallery` items are typed `{ src, alt, tilt }` (no width field), and `case-study.astro`'s stated Props are `{ title, challenge, solutions, metrics, gallery, disclaimer? }` — no per-item or per-gallery width override is mentioned anywhere in the component spec (step 7).
- **Failure scenario / cost:** The implementer has no specified mechanism to make Case Study 1's charts render wider than Case Study 2's (gallery-less) or the works-wall's differently-sized thumbnails. They must guess: hardcode `width={720}` inside `case-study.astro` for every gallery image (silently affecting any future generic reuse), or add an undocumented field to the JSON schema after the fact.
- **Evidence:** phase-04-sections-branding-strategy-seo.md:168-171 (gallery array: `src`, `alt`, `tilt` only, no `width`); phase-04-sections-branding-strategy-seo.md:279 "Charts get `width={720}`"; phase-04-sections-branding-strategy-seo.md:189-193 (case-study.astro Props list has no width field)
- **Suggested fix:** Either state a fixed `width={720}` inside `case-study.astro`'s gallery rendering (component-level constant, documented in step 7) or add an explicit `width?` field to the gallery item shape in `strategy.json` and thread it through Props.

## Finding 8: `Cap ... by clamping amount to 12` is asserted but no clamp appears in the shown implementation
- **Severity:** Low
- **Location:** Phase 6 step 6 (`parallax.ts`)
- **Flaw:** The prose says "Cap the effective range at `yPercent: ±12` (design guidelines) by clamping `amount` to 12," but the code block immediately above computes `const amount = Number(el.dataset.parallax || 0.1) * 100;` with no `Math.min`/clamp call before it's used in `gsap.fromTo`. As written, a `data-parallax="0.2"` value (yPercent ±20) would exceed the design guideline's stated cap.
- **Failure scenario / cost:** Cosmetic/low risk since current data only uses values ≤0.12 (hero) and ≤0.08 (case study), but the plan documents a safety invariant that its own reference code doesn't enforce — a future content edit that bumps a `parallax` prop above 0.12 would silently violate the design spec with no code-level guard to catch it.
- **Evidence:** phase-06-motion-layer-gsap-lenis.md:213-224 (code, no clamp) and phase-06-motion-layer-gsap-lenis.md:227 "Cap the effective range at `yPercent: ±12` (design guidelines) by clamping `amount` to 12."
- **Suggested fix:** Add `const amount = Math.min(Number(el.dataset.parallax || 0.1) * 100, 12);` to the shown snippet so the prose and code agree.

---

## Verified consistent (not flaws, no action needed)

- The `[PLACEHOLDER]` running counts (1 → 8 → 13) across phases 3/4/5 all arithmetically check out against each phase's itemized list.
- All 13 image filenames referenced across every phase's JSON snippets exist in `public/images/`.
- The `data-reveal` / `data-reveal-group` / `data-parallax` / `data-split` / `data-nav` attribute contract defined in Phase 2 is consumed consistently by Phase 6, with no undefined or unused attribute.
- `polaroid`, `nav`, `works-wall`, and `case-study` component Props match their call sites in Phases 3-5.

## Unresolved questions

- None outstanding; all findings above are self-contained with a suggested fix.

**Status:** DONE
