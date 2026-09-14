---
phase: 3
title: "Sections Hero About Contact"
status: completed
effort: "4h"
dependencies: [1, 2]
---

# Phase 3: Sections Hero About Contact

## Context

- `docs/content-source.md` — Identity, About Me, Experience, Journey, Education, Skills & Tools, Contact intro
- `docs/design-guidelines.md` — Layout, Timeline, Section header pattern
- Phase 2 primitives: `sticker`, `stamp`, `polaroid`, `section-header`, `metric-tile`, `cta-button`, `marquee`, `nav`, `torn-divider`

## Overview

Priority P1. Build the page's bookends plus the biggest section. Hero and About carry all the
verified CV content; Contact closes with the real phone/email. This phase also creates the real
`src/pages/index.astro` and owns it — phases 4 and 5 only append to it.

All copy here is **sourced**, not drafted. The only `[PLACEHOLDER: ...]` in this phase is the
LinkedIn URL.

## Requirements

Functional
- Hero: name, role, three-part tagline, one-liner, cafe photo in a polaroid, `OPEN TO WORK` stamp, quick contact chips, scroll cue.
- Nav renders immediately after the hero, listing the eight non-hero anchors; the brand sticker links to `#hero`.
- About: bio, career objective, mindset quote with the three touchpoints, career timeline, skills grid, tools marquee, education and certificates.
- Contact: intro paragraph, four contact cards, mailto CTA, closing line, footer.
- Every string comes from `hero.json`, `nav.json`, `about.json`, `contact.json`.

Non-functional
- Heading order strictly h1 (hero) then h2 per section then h3 inside; no skips.
- Section files < 200 lines; split About into sub-components rather than growing past it.
- Vietnamese copy is never uppercased by CSS (diacritics), only English display titles are.

## Architecture

```
index.astro
  BaseLayout
    slot "nav"  -> Nav (nav.json)
    main
      HeroCover      (hero.json)
      TornDivider
      AboutMe        (about.json)  -> about/timeline.astro, about/skills-grid.astro, about/education-list.astro
      ... phases 4-5 insert here ...
      ContactEnd     (contact.json)
    slot "footer" -> rendered by ContactEnd
```

Nav sits after the hero in DOM order (per the fixed section order) and is `position: sticky`, so it
pins to the top once the hero scrolls past. That gives a table-of-content on first paint and a
persistent nav afterwards, with no JS.

## Related Code Files

Create
- `src/components/sections/hero-cover.astro`
- `src/components/sections/about-me.astro`
- `src/components/sections/about/timeline.astro`
- `src/components/sections/about/skills-grid.astro`
- `src/components/sections/about/education-list.astro`
- `src/components/sections/contact-end.astro`

- `src/data/about.json`, `src/data/contact.json` (this phase creates them; phase 1 only made site/nav/hero)

Modify
- `src/pages/index.astro` (rewrite from the phase-1 shell; **owned by this phase**)
- `src/data/hero.json` (phase 1 created it; fill or correct the copy here)
- `src/types/content.ts` (**append** `AboutContent` and `ContactContent`; do not touch the atoms)

## Implementation Steps

1. **`hero.json`** — created in phase 1; confirm the copy matches `docs/content-source.md` "Identity":

```json
{
  "name": "Nghiêm Quỳnh Mai",
  "role": "Content Marketing Executive",
  "tagline": ["Content Creation", "Strategic Thinking", "Human Connection"],
  "oneLiner": "Lan tỏa giá trị thực qua những câu chuyện sáng tạo và tư duy chiến lược.",
  "stamp": "OPEN TO WORK",
  "photo": {
    "src": "photo-mai-cafe.png",
    "alt": "Nghiêm Quỳnh Mai ngồi làm việc tại quán cà phê",
    "tilt": 2
  },
  "quickLinks": [
    { "label": "quynhmainghiem340@gmail.com", "href": "mailto:quynhmainghiem340@gmail.com" },
    { "label": "0368 327 616", "href": "tel:+84368327616" }
  ],
  "scrollCue": "Cuộn để khám phá"
}
```

2. **`hero-cover.astro`** — `<section id="hero">`, full-viewport-ish (`min-height: 100svh`, not `100vh`, so mobile browser chrome does not clip). Desktop layout: 12-col grid, `h1` spanning cols 1–7 at `var(--fs-h1)` with `data-split`, polaroid in cols 7–12 offset downward, stamp absolutely placed over the photo corner, tagline as three `<Sticker>` chips, one-liner below in body type, quick links as text links. Mobile: single column, h1 first, photo after the tagline, stamp inline. Photo uses `priority` (LCP element) and `parallax={0.1}`.

3. **`nav.json`** — created in phase 1; verify it here. Brand `PORTFOLIO` plus the eight anchors, with
   English labels matching the deck: `About Me`, `Branding`, `Strategy`, `SEO`, `Social`, `UGC`,
   `AI First`, `Contact`. Hero is not a list item; the brand sticker links to `#hero`.

4. **`about.json`** — largest file; shape:

```json
{
  "meta": { "id": "about", "index": "01", "title": "About Me",
            "subtitle": "Người làm Marketing thích 'thổi hồn' cho những con số." },
  "portrait": { "src": "photo-mai-avatar.png", "alt": "Ảnh chân dung Nghiêm Quỳnh Mai", "tilt": 1 },
  "bio": ["Tôi là Nghiêm Quỳnh Mai - ...", "Bước ra từ chuyên ngành ...", "Mục tiêu của tôi luôn rõ ràng: ..."],
  "objective": { "title": "Mục tiêu nghề nghiệp", "body": "Content Marketing Executive +2 năm ..." },
  "quote": "Nội dung không chỉ để xem, nội dung phải để kết nối và tạo giá trị.",
  "touchpoints": [
    { "label": "User-Centric", "note": "Thấu hiểu khán giả" },
    { "label": "Data-Driven", "note": "Sáng tạo dựa trên số liệu" },
    { "label": "Purpose-Driven", "note": "Giải quyết bài toán thương hiệu" }
  ],
  "eras": [
    { "range": "2020 - 2024", "title": "Nền tảng & Sự dấn thân", "body": "Phó Ban Đối ngoại dự án SpeedUp 2021; gây quỹ 250+ triệu VNĐ cho dự án \"Xuân về no ấm\"..." },
    { "range": "2023 - 2024", "title": "Chuyên nghiệp hóa", "body": "..." },
    { "range": "2024 - 2026", "title": "Tăng trưởng & Đột phá", "body": "..." }
  ],
  "experience": [
    { "period": "4/2026 - Hiện tại", "company": "Công ty Cổ phần Step Up Education",
      "role": "Nhân viên Content Marketing",
      "bullets": ["Nghiên cứu tâm lý khách hàng ...", "Sáng tạo kịch bản ...", "Ứng dụng hiệu quả AI tools ..."] }
  ],
  "skillGroups": [
    { "title": "Xây dựng & triển khai nội dung", "items": ["..."] },
    { "title": "Content Strategy", "items": ["..."] },
    { "title": "Phối hợp sản xuất & tư duy hình ảnh", "items": ["..."] },
    { "title": "Tổ chức sự kiện & truyền thông nội bộ", "items": ["..."] }
  ],
  "languages": [
    { "name": "Tiếng Pháp", "level": "Thành thạo" },
    { "name": "Tiếng Anh", "level": "Tốt (đọc & viết tài liệu marketing)" },
    { "name": "Tiếng Trung", "level": "Giao tiếp cơ bản" }
  ],
  "tools": ["Canva", "CapCut", "Microsoft Office", "ChatGPT", "Gemini", "Claude", "Leonardo"],
  "education": [
    { "year": "2020 - 2024", "title": "Đại học Ngoại thương (FTU)",
      "note": "Tiếng Pháp thương mại — Tốt nghiệp loại Giỏi", "kind": "degree" },
    { "year": "2026", "title": "Content Social Viral", "note": "Nghề Content", "kind": "cert" },
    { "year": "2026", "title": "Content Performance chuyên sâu", "note": "Gigan Training Center", "kind": "cert" },
    { "year": "2025", "title": "Marketing Foundation", "note": "University of Pennsylvania", "kind": "cert" }
  ]
}
```

   All four experience entries from the CV table go in `experience`, newest first. Copy the bullet
   text verbatim; do not paraphrase numbers.

5. **`about/timeline.astro`** — Props `{ eras, experience }`. Vertical maroon 2px line, red dot per
   entry, year in display font (design guidelines "Timeline"). Renders eras as three wide markers and
   experience entries as the detailed nodes under them. Semantics: `<ol>`, each entry `<li>` with
   `<h3>` = role + company, `<p class="meta">` = period, `<ul>` = bullets. At < 768 px the line moves
   to the left edge and dots shrink; no horizontal timeline on mobile.

6. **`about/skills-grid.astro`** — Props `{ skillGroups, languages }`. Two-column card grid desktop,
   one column mobile; each group is `<h3>` + `<ul>` of `<Sticker as="li">`. Languages render as a small
   definition list. Alternate `--paper` / `--paper-2` card backgrounds, tilt every third card by
   `var(--tilt-3)`.

7. **`about/education-list.astro`** — Props `{ education }`. Each row: `<Stamp text={year} size="sm" />`
   + title + note. `kind: 'degree'` gets the red stamp, `'cert'` gets maroon, so the degree reads first.

8. **`about-me.astro`** — composes `SectionHeader` + portrait polaroid + bio paragraphs + objective
   card + pull-quote (display font, `var(--red)`, `font-size: var(--fs-h3)`, not uppercased) +
   touchpoints row + `Timeline` + `SkillsGrid` + `Marquee items={tools}` + `EducationList`. Wraps the
   whole section in `data-reveal-group` and tags each block `data-reveal`. `<section id="about"
   aria-labelledby="about-title">`.

9. **`contact.json`**:

```json
{
  "meta": { "id": "contact", "index": "09", "title": "Keep In Touch", "subtitle": "Let's make magic happen!" },
  "intro": "Nếu Quý doanh nghiệp cần một mảnh ghép đa nhiệm - kết hợp hài hòa giữa tư duy chiến lược và năng lực thực thi ... tôi đã sẵn sàng.",
  "cards": [
    { "kind": "email", "label": "Email", "value": "quynhmainghiem340@gmail.com", "href": "mailto:quynhmainghiem340@gmail.com" },
    { "kind": "phone", "label": "Điện thoại", "value": "0368 327 616", "href": "tel:+84368327616" },
    { "kind": "location", "label": "Khu vực", "value": "Cầu Giấy, Hà Nội", "href": null },
    { "kind": "linkedin", "label": "LinkedIn", "value": "Quỳnh Mai Nghiêm",
      "href": "[PLACEHOLDER: LinkedIn URL]" }
  ],
  "cta": { "label": "Gửi email cho Mai", "href": "mailto:quynhmainghiem340@gmail.com?subject=Cơ%20hội%20hợp%20tác" },
  "closing": "Keep in touch. Let's make magic happen!",
  "footer": "© 2026 Nghiêm Quỳnh Mai"
}
```

10. **`contact-end.astro`** — `SectionHeader`, intro paragraph, four cards as tilted paper tiles
    (`var(--paper-2)`, `var(--shadow)`, alternating tilts), `CtaButton` from `cta`, closing line in
    display type, `<footer>` with the copyright. A card whose `href` is `null` renders as plain text;
    a card whose `href` still starts with `[PLACEHOLDER` renders as text **plus** a visible
    `<Sticker label="chưa cập nhật" tone="maroon" />`, so a forgotten placeholder is obvious on the
    page and greppable in the JSON. Never emit `<a href="[PLACEHOLDER: ...]">`.

11. **`index.astro`** — rewrite:

```astro
---
import BaseLayout from '@layouts/base-layout.astro';
import Nav from '@components/ui/nav.astro';
import TornDivider from '@components/ui/torn-divider.astro';
import HeroCover from '@components/sections/hero-cover.astro';
import AboutMe from '@components/sections/about-me.astro';
import ContactEnd from '@components/sections/contact-end.astro';
import site from '@data/site.json';
import navData from '@data/nav.json';
---
<BaseLayout title={site.title} description={site.description}>
  <Nav slot="nav" {...navData} />
  <HeroCover />
  <TornDivider from="paper" to="paper-2" />
  <AboutMe />
  <!-- phase 4: Branding, Strategy, SEO -->
  <!-- phase 5: Social, UGC, AI First -->
  <ContactEnd />
</BaseLayout>
```

    Each section component imports its own JSON; `index.astro` stays a table of contents and does not
    thread props through.

12. **Verify.** `pnpm check`, `pnpm build`, click every nav link (only About and Contact resolve so
    far — the rest land in phase 4/5), confirm the hero photo emits WebP with explicit width/height,
    and run a heading-order pass in DevTools accessibility tree.

## Todo List

- [ ] hero.json + hero-cover.astro
- [ ] nav.json wired into index.astro
- [ ] about.json complete (bio, objective, quote, touchpoints, 3 eras, 4 jobs, skills, languages, tools, education)
- [ ] about/timeline.astro
- [ ] about/skills-grid.astro
- [ ] about/education-list.astro
- [ ] about-me.astro composition
- [ ] contact.json + contact-end.astro (placeholder-safe LinkedIn)
- [ ] index.astro rewritten with phase 4/5 comment anchors

## Success Criteria

- [ ] Hero fills the viewport at 390x844 with the h1 fully visible, no clipped diacritics
- [ ] `grep -rn "Nghiêm\|Quỳnh\|Tôi là" src/components/` returns nothing — copy is JSON-only
- [ ] Accessibility tree shows h1 once, then h2 About, h2 Contact, with h3 under each
- [ ] All four CV jobs and all four education entries render
- [ ] `mailto:` and `tel:` links open the right handler; LinkedIn card shows "chưa cập nhật" and emits no anchor
- [ ] `grep -rn "\[PLACEHOLDER" src/data/` returns exactly one line (LinkedIn URL)
- [ ] Every file < 200 lines

## Risk Assessment

| Risk | L x I | Mitigation |
|------|-------|------------|
| Placeholder URL shipped as a live href, broken link in Lighthouse | M x M | Step 10 renders placeholders as text plus a visible "chưa cập nhật" sticker; success criterion greps the count |
| About section grows past 200 lines | H x L | Pre-split into `about/timeline`, `about/skills-grid`, `about/education-list` from the start |
| `100vh` hero clipped by mobile browser chrome | M x M | `min-height: 100svh` with a `100vh` fallback line above it |
| Hero h1 at `clamp(3.5rem, 9vw, 8rem)` overflows with the long name | M x M | `overflow-wrap: break-word` plus an explicit line break opportunity between "Nghiêm Quỳnh" and "Mai" in the component, not the JSON |
| Publishing a personal phone number | M x H | Already public in the CV; README asks the owner to confirm before the first deploy. Removing it is a one-line JSON edit |
| Timeline reads as an unordered jumble to screen readers | L x M | `<ol>` with explicit period text per entry, not visual-order-only |

## Security Considerations

`mailto:`/`tel:` only, no form, no third-party embed. Email and phone are scraped easily once public —
noted in the README so the owner decides knowingly.

## Next Steps

Phase 4 appends Branding, Strategy and SEO at the marked comment in `index.astro`. Do not reorder
sections; the nav order is the fixed page order.
