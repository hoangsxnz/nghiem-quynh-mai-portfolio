---
phase: 4
title: "Sections Branding Strategy SEO"
status: completed
effort: "4h"
dependencies: [1, 2, 3]
---

# Phase 4: Sections Branding Strategy SEO

## Context

- `docs/content-source.md` — 3S framework, Case Study 1, Strategic Thinking (F&B/B2B/Beauty), "As a Marketer", Selected Works (SmartRecruit article)
- `docs/design-guidelines.md` — Metric tile, torn divider, section header pattern
- Phase 3 output: `src/pages/index.astro` with the phase-4 comment anchor

## Overview

Priority P1. Three sections, two source levels:

| Section | Source | Copy status |
|---------|--------|-------------|
| Branding & Positioning | none in CV/deck | **Drafted** from the 3S framework + "As a Marketer" + the three industry taglines |
| Content Strategy | full | Verbatim: 3S, Case Study 1 with real charts |
| Content SEO | none | **Drafted** from the SmartRecruit AI article in Selected Works |

Every drafted claim, metric and asset that the source does not support is written as a literal
`[PLACEHOLDER: ...]` string inside the JSON so the owner can find it with one grep.

## Requirements

Functional
- Branding: positioning statement, brand-voice pillars, three industry positioning cards (F&B, B2B, Beauty) with insight/execution/tagline.
- Strategy: 3S framework, the five workflow blocks (Direction, Plan, Calendar, Pillar, Angle), Case Study 1 with the two chart images and the content-plan sheet, `+200%` / `+35%` metric tiles.
- SEO: approach steps, an on-page checklist, the SmartRecruit article as a worked example.
- All copy from `branding.json`, `strategy.json`, `seo.json`.

Non-functional
- Placeholder discipline: no invented number appears without the `[PLACEHOLDER: ...]` wrapper.
- Section files < 200 lines; Strategy splits into sub-components.
- Chart images are data screenshots: alt text must state what the chart shows, not "biểu đồ".

## Architecture

```
index.astro (phase-4 anchor)
  + BrandingPositioning   branding.json
  + TornDivider
  + ContentStrategy       strategy.json
        |- strategy/framework-3s.astro     (3 cards)
        |- strategy/workflow-blocks.astro  (Direction/Plan/Calendar/Pillar/Angle)
        +- strategy/case-study.astro       (reused by phase 5 for Case 2)
  + TornDivider
  + ContentSeo            seo.json
```

`strategy/case-study.astro` is built generic on purpose — Props `{ title, challenge, solutions,
metrics, gallery }` — because phase 5 renders Case Study 2 through the same component. This is the
one place the DRY line is drawn between phases 4 and 5; phase 5 may not fork it.

Placeholder rendering contract (shared by phases 4 and 5): a value beginning with `[PLACEHOLDER`
renders as `<Sticker tone="maroon" label="cần bổ sung" />` next to the surrounding text, never inside
an `href`, `src` or a metric tile's big number. Implement once as
`src/lib/placeholder.ts` -> `isPlaceholder(value: string): boolean`.

## Related Code Files

Create
- `src/lib/placeholder.ts`
- `src/components/sections/branding-positioning.astro`
- `src/components/sections/content-strategy.astro`
- `src/components/sections/strategy/framework-3s.astro`
- `src/components/sections/strategy/workflow-blocks.astro`
- `src/components/sections/strategy/case-study.astro`
- `src/components/sections/content-seo.astro`
- `src/data/branding.json`, `src/data/strategy.json`, `src/data/seo.json`

Modify
- `src/pages/index.astro` (insert three sections at the phase-4 anchor; do not touch phase-3 lines)
- `src/types/content.ts` (**append** `BrandingContent`, `StrategyContent`, `SeoContent`, `CaseStudy`)

## Implementation Steps

1. **`src/lib/placeholder.ts`** — six lines:

```ts
export const isPlaceholder = (v: string | null | undefined): boolean =>
  typeof v === 'string' && v.trimStart().startsWith('[PLACEHOLDER');
```

2. **`branding.json`** — drafted. Derivation is explicit so a reviewer can trace each line:

```json
{
  "meta": { "id": "branding", "index": "02", "title": "Branding & Positioning",
            "subtitle": "Định vị thương hiệu bằng nghiên cứu, kể lại bằng câu chuyện." },
  "statement": "Nghiên cứu sâu - Tư duy rộng - Thực thi chuẩn xác: mỗi thương hiệu cần một chỗ đứng riêng trước khi cần một nội dung hay.",
  "pillars": [
    { "label": "S-Research", "note": "Nghiên cứu thị trường, phân tích đối thủ, hiểu sâu hành vi người dùng." },
    { "label": "S-Story", "note": "Xây dựng kịch bản độc đáo, narrative hấp dẫn, phù hợp brand voice." },
    { "label": "S-Solution", "note": "Tối ưu hóa chuyển đổi, tăng tương tác, đo lường hiệu quả chiến dịch." }
  ],
  "industries": [
    { "name": "F&B", "headline": "Chạm vị giác từ cái nhìn đầu tiên.",
      "insight": "Khách mua \"nội dung\" để chia sẻ, quyết định trong 3 giây đầu.",
      "execution": "Chuỗi short-video TikTok/Reels nhịp nhanh, ASMR, màu rực.",
      "tagline": "Gói trọn hương vị vào khung hình - Khơi nguồn trải nghiệm, chạm niềm tin.",
      "image": "work-croissant-photo.png" },
    { "name": "B2B", "headline": "Xây dựng vị thế chuyên gia dẫn dắt thị trường.", "...": "..." },
    { "name": "Beauty", "headline": "Trải nghiệm ảo, cam kết thật.", "...": "..." }
  ],
  "valueProps": [
    { "label": "Đa nhiệm đa dạng", "note": "Content Marketing & truyền thông nội bộ, sáng tạo và quy chuẩn." },
    { "label": "Tư duy ngôn ngữ", "note": "Pháp - Anh - Trung, mở rộng cơ hội đa văn hóa." },
    { "label": "Tối ưu hiệu suất đa kênh", "note": "Làm chủ hệ sinh thái AI và phần mềm sáng tạo." }
  ],
  "brandVoice": "[PLACEHOLDER: 3-5 tính từ mô tả brand voice cá nhân của Mai]",
  "positioningProof": "[PLACEHOLDER: 1 dự án định vị thương hiệu cụ thể + kết quả đo được]"
}
```

   Sources: `statement` from the Strategic Thinking intro; `pillars` verbatim from 3S; `industries`
   verbatim from the three industry blocks; `valueProps` verbatim from "As a Marketer". Only
   `brandVoice` and `positioningProof` are gaps, and both are placeholders.

3. **`branding-positioning.astro`** — `SectionHeader`, statement as a display pull-quote, three
   pillar cards (`Sticker` label + note), then the three industry cards as a staggered collage:
   desktop three columns with each card offset vertically by `calc(var(--gap) * n)` and tilted
   alternately, mobile stacked. `valueProps` render as a three-up row of small paper tiles at the
   bottom. Industry images use `<Polaroid width={360}>`; croissant and watch photos are the only
   available imagery, so the Beauty card takes `[PLACEHOLDER: ảnh minh họa ngành Beauty]` and renders
   a red outline paper rectangle with the placeholder sticker instead of an image.

4. **`strategy.json`** — mostly verbatim:

```json
{
  "meta": { "id": "strategy", "index": "03", "title": "Content Strategy",
            "subtitle": "Từ nghiên cứu đến lịch đăng: một quy trình, năm mắt xích." },
  "framework": [ { "code": "S-Research", "title": "...", "body": "..." }, ... ],
  "workflow": [
    { "step": "Direction", "vi": "Định hướng",
      "body": "Xác định mục tiêu kênh, chân dung khán giả mục tiêu và thông điệp lõi trước khi viết dòng đầu tiên." },
    { "step": "Plan", "vi": "Kế hoạch",
      "body": "Xây dựng 4+ tuyến nội dung chính cho mỗi kênh và đề xuất ý tưởng theo tuần." },
    { "step": "Calendar", "vi": "Lịch nội dung",
      "body": "Lịch sản xuất 3-4 video/tuần, bám sát tiến độ quay dựng và thời điểm đăng.",
      "image": "sheet-content-plan.png" },
    { "step": "Pillar", "vi": "Trụ nội dung",
      "body": "Phân loại nội dung theo mục tiêu và hành trình khách hàng.",
      "image": "work-content-pyramid-post.png" },
    { "step": "Angle", "vi": "Góc tiếp cận",
      "body": "Mỗi trụ nội dung được khai thác bằng nhiều góc nhìn khác nhau để tránh lặp và giữ chân người xem.",
      "image": "work-content-ideas-sheet.png" }
  ],
  "caseStudy": {
    "title": "Tối ưu tăng trưởng kênh Video",
    "challenge": "Tăng trưởng trong thị trường video đã bão hòa, cạnh tranh cực cao.",
    "solutions": [
      { "title": "Giải mã khán giả", "body": "Đào sâu insight Target Audience để tìm \"điểm chạm\" mới." },
      { "title": "Storytelling hóa kịch bản", "body": "Bắt trend nhưng giữ bản sắc thương hiệu." },
      { "title": "Tối ưu Pacing", "body": "Phối hợp hậu kỳ tinh chỉnh nhịp video." }
    ],
    "metrics": [
      { "value": "+200%", "label": "Reach", "note": "trong 3 tháng" },
      { "value": "+35%", "label": "Retention", "note": "nhờ tối ưu cấu trúc kịch bản" }
    ],
    "gallery": [
      { "src": "chart-views-gained.png", "alt": "Biểu đồ lượt xem tăng dần theo tháng của kênh video", "tilt": 1, "width": 720 },
      { "src": "chart-subscribers-gained.png", "alt": "Biểu đồ người đăng ký mới theo tháng của kênh video", "tilt": 2, "width": 720 }
    ],
    "disclaimer": "[PLACEHOLDER: xác nhận với chủ sở hữu kênh trước khi công bố số liệu và ảnh chụp màn hình]"
  }
}
```

   `workflow[].body` for Direction and Angle is drafted from the CV's Bodhi bullets (4+ tuyến nội
   dung, 30+ kịch bản, 3-4 video/tuần); the numbers used are the CV's own, so they are not
   placeholders. Nothing new is invented.

5. **`strategy/framework-3s.astro`** — Props `{ framework }`. Three tall paper cards, each with a big
   display-font code (`S-Research`), title and body; alternating tilt; `data-reveal-group`.

6. **`strategy/workflow-blocks.astro`** — Props `{ workflow }`. Five numbered blocks in a vertical
   zig-zag: odd blocks text-left/image-right, even blocks mirrored; the number rendered as a `<Stamp>`.
   Blocks with no `image` key render text full-width. `<ol>` for semantics; the English step name is
   the `<h3>`, the Vietnamese gloss a `<span class="meta">` inside it.

7. **`strategy/case-study.astro`** — generic, Props `{ title, challenge, solutions, metrics, gallery,
   disclaimer? }`. Layout: title in display type, "Thách thức" paragraph, solutions as three numbered
   paper notes, `MetricTile` row, gallery as a scattered polaroid cluster with `parallax` values
   `0.08` and `-0.06`. A `disclaimer` that `isPlaceholder()` matches renders as a muted caption under
   the gallery with the "cần bổ sung" sticker — visible to the owner, harmless to a visitor.

   The gallery must be guarded explicitly, because phase 5 passes Case Study 2 with `gallery: []`:

```astro
{gallery.length > 0 && (
  <div class="case-gallery" data-reveal-group>
    {gallery.map((pic) => <Polaroid {...pic} parallax={0.08} />)}
  </div>
)}
```

   Each gallery item carries its own `width` (the charts use 720); `polaroid.astro` clamps it against
   the intrinsic size, so this component never computes a width itself.

8. **`content-strategy.astro`** — composes `SectionHeader` + `Framework3s` + `WorkflowBlocks` +
   `CaseStudy` (from `strategy.caseStudy`). Background `var(--paper-2)` with torn dividers on both
   sides, per the alternating-section rule.

9. **`seo.json`** — drafted from the one SEO artefact in the source (the SmartRecruit AI article):

```json
{
  "meta": { "id": "seo", "index": "04", "title": "Content SEO",
            "subtitle": "Viết cho người đọc trước, cho công cụ tìm kiếm ngay sau đó." },
  "approach": [
    { "step": "Từ khóa & ý định tìm kiếm", "body": "Phân nhóm từ khóa theo hành trình khách hàng, ưu tiên nhóm có ý định chuyển đổi rõ ràng." },
    { "step": "Cấu trúc bài", "body": "Dàn ý theo H1-H2-H3, mỗi phần trả lời trọn một câu hỏi của người đọc." },
    { "step": "Tối ưu on-page", "body": "Tiêu đề, meta description, ảnh có alt, liên kết nội bộ giữa các bài cùng chủ đề." },
    { "step": "Đo lường & cập nhật", "body": "Theo dõi thứ hạng và thời gian đọc, cập nhật lại bài cũ theo dữ liệu." }
  ],
  "checklist": [
    "Tiêu đề chứa từ khóa chính, dưới 60 ký tự",
    "Meta description có lời hứa giá trị rõ ràng",
    "Một H1 duy nhất, H2/H3 theo đúng thứ bậc",
    "Ảnh có alt mô tả nội dung, dung lượng đã nén",
    "Liên kết nội bộ tới ít nhất 2 bài cùng chủ đề",
    "Đoạn mở đầu trả lời ngay câu hỏi của người tìm kiếm"
  ],
  "example": {
    "title": "Giải Phóng HR Khỏi \"Núi\" CV: Tối Ưu Quy Trình Tuyển Dụng Với SmartRecruit AI",
    "note": "Bài viết chuẩn SEO cho sản phẩm B2B: tiêu đề đánh trúng nỗi đau, cấu trúc dẫn từ vấn đề đến giải pháp.",
    "image": "work-smartrecruit-article.png",
    "url": "[PLACEHOLDER: link bài viết SmartRecruit đã xuất bản]",
    "metrics": "[PLACEHOLDER: thứ hạng từ khóa / lượt đọc của bài viết]"
  },
  "secondExample": {
    "title": "[PLACEHOLDER: bài SEO thứ hai nếu có]",
    "image": "work-cv-article.png"
  }
}
```

   The approach and checklist are craft knowledge, not claims about the owner's results, so they
   carry no numbers and need no placeholder. Every result-shaped statement is a placeholder.

10. **`content-seo.astro`** — `SectionHeader`, four approach steps as a numbered horizontal strip
    (desktop) / stacked list (mobile), checklist as a two-column list of paper tiles each prefixed
    with a hand-drawn-style check glyph in `var(--red)` (CSS `::before`, `aria-hidden`), then the
    worked example: `<Polaroid src={example.image}>` beside title, note and — only if
    `!isPlaceholder(example.url)` — a `CtaButton external`. Otherwise the "cần bổ sung" sticker.
    `secondExample` renders only when its title is not a placeholder.

11. **`index.astro`** — replace the phase-4 comment with the three sections plus their dividers.
    Touch nothing else in the file.

12. **Verify.** `pnpm check`, `pnpm build`, click the Branding / Strategy / SEO nav links, and run
    `grep -rn "\[PLACEHOLDER" src/data/ | wc -l` — expect 8 (1 from phase 3 plus 7 here: brandVoice,
    positioningProof, Beauty image, case disclaimer, SEO url, SEO metrics, secondExample title).

## Todo List

- [ ] placeholder.ts + shared placeholder render rule
- [ ] branding.json (drafted, sources traced) + branding-positioning.astro
- [ ] strategy.json (verbatim + workflow drafts)
- [ ] strategy/framework-3s.astro
- [ ] strategy/workflow-blocks.astro
- [ ] strategy/case-study.astro (generic, phase-5 reusable)
- [ ] content-strategy.astro
- [ ] seo.json + content-seo.astro
- [ ] index.astro anchor filled

## Success Criteria

- [ ] Three new sections render, nav links scroll to each
- [ ] `strategy/case-study.astro` takes all content via props — `grep -c "json" strategy/case-study.astro` returns 0
- [ ] No `href`, `src` or metric value in the built HTML contains the string `[PLACEHOLDER`
- [ ] Every placeholder in JSON produces one visible "cần bổ sung" sticker on the page
- [ ] `+200%` and `+35%` tiles read correctly at 390 px without wrapping mid-number
- [ ] Chart images have descriptive alt text, not "biểu đồ"
- [ ] `pnpm check` 0 errors; every file < 200 lines

## Risk Assessment

| Risk | L x I | Mitigation |
|------|-------|------------|
| Drafted copy reads as a claim the owner never made | H x H | Craft statements only (process, checklist); every result-shaped sentence is a `[PLACEHOLDER]`. Sources for each drafted block are listed in this phase for review |
| Case-study numbers published without permission | M x H | `disclaimer` placeholder renders on-page until the owner clears it; also listed in plan.md "Content gaps" |
| `case-study.astro` forked in phase 5 instead of reused | M x M | Built generic here with Case 2's shape already accounted for (metrics array of 3, no gallery); phase 5 success criteria re-assert the import |
| Chart screenshots unreadable at mobile width | M x M | `width: 720` is set on the gallery items in `strategy.json` (step 4), and the charts render full-width on mobile rather than inside a 2-col grid; phase 7 screenshot check |
| `case-study.astro` crashes or renders an empty frame for Case Study 2 | M x H | Explicit `gallery.length > 0` guard in step 7, written now rather than discovered in phase 5 |
| Beauty card without an image breaks the 3-col rhythm | M x L | Placeholder tile is a same-size red outline rectangle, so the grid holds |
| Placeholder count drifts as copy is edited | M x L | Exact expected count asserted in step 12 and reported in the README (phase 7) |

## Security Considerations

`isPlaceholder` gates href emission, so no placeholder string ever becomes a navigable URL. External
article links use `CtaButton external` with `rel="noopener noreferrer"`.

## Next Steps

Phase 5 imports `strategy/case-study.astro` for Case Study 2 and fills the phase-5 anchor in
`index.astro`.
