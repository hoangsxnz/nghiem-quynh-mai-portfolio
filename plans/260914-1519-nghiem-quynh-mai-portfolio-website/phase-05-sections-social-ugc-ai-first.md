---
phase: 5
title: "Sections Social UGC AI First"
status: completed
effort: "4h"
dependencies: [1, 2, 3, 4]
---

# Phase 5: Sections Social UGC AI First

## Context

- `docs/content-source.md` — Case Study 2 (95% / 3+ / 50+), Selected Works (8 thumbnails), F&B "Món quà ẩn" campaign, AI tools bullets
- Phase 4 output: `strategy/case-study.astro` (generic), `src/lib/placeholder.ts`, phase-5 anchor in `index.astro`

## Overview

Priority P1. The last three sections, and the last of the drafted copy.

| Section | Source | Copy status |
|---------|--------|-------------|
| Social Media & Community | partial | Case Study 2 verbatim; Post/Photo/Video split built from Selected Works |
| UGC | none | **Drafted** from the F&B "Món quà ẩn" (Hidden Menu) campaign |
| AI First | none | **Drafted** from the CV's AI tooling bullets |

After this phase the page is content-complete and phase 6 can wire motion to a stable DOM.

## Requirements

Functional
- Social: Case Study 2 through the phase-4 component, a Post / Photo / Video tri-split, and the eight `work-*.png` as a polaroid wall.
- UGC: the campaign mechanic (insight, mechanic, content ladder, measurement) with every result as a placeholder.
- AI First: tool stack, where AI sits in the workflow, and an agent/automation block; a stated human-in-the-loop boundary.
- All copy from `social.json`, `ugc.json`, `ai-first.json`.

Non-functional
- Section files < 200 lines; the polaroid wall is its own component.
- No result number in UGC or AI First that the CV does not state.
- The eight work images are 225–400 px: never render them wider than their intrinsic width.

## Architecture

```
index.astro (phase-5 anchor)
  + SocialCommunity      social.json
        |- CaseStudy            (imported from phase 4, not forked)
        +- social/works-wall.astro
  + TornDivider
  + UgcShowcase          ugc.json
  + TornDivider
  + AiFirst              ai-first.json
```

Image-width contract: nothing to do here. `polaroid.astro` (phase 2) already clamps every rendered
width against the source's intrinsic width, so the eight 225–400 px thumbnails cannot be upscaled and
they sharpen automatically once the owner supplies hi-res files. `works-wall.astro` passes layout
intent and lets the primitive decide.

## Related Code Files

Create
- `src/components/sections/social-community.astro`
- `src/components/sections/social/works-wall.astro`
- `src/components/sections/ugc-showcase.astro`
- `src/components/sections/ai-first.astro`
- `src/data/social.json`, `src/data/ugc.json`, `src/data/ai-first.json`

Modify
- `src/pages/index.astro` (phase-5 anchor only)
- `src/types/content.ts` (**append** `SocialContent`, `UgcContent`, `AiFirstContent`)

## Implementation Steps

1. **`social.json`**:

```json
{
  "meta": { "id": "social", "index": "05", "title": "Social Media & Community",
            "subtitle": "Nội dung để kết nối, không chỉ để xem." },
  "formats": [
    { "kind": "Post", "vi": "Bài viết",
      "body": "Tuyến bài theo trụ nội dung, mỗi bài một góc tiếp cận riêng cho từng nhóm khán giả.",
      "images": ["work-content-pyramid-post.png", "work-womens-day-poster.png"] },
    { "kind": "Photo", "vi": "Hình ảnh",
      "body": "Tư duy hình ảnh cho social: bố cục, ánh sáng và màu sắc phục vụ thông điệp bán hàng.",
      "images": ["work-croissant-photo.png", "work-watch-photo.png"] },
    { "kind": "Video", "vi": "Video ngắn",
      "body": "30+ kịch bản video ngắn và dài, trung bình 3-4 video/tuần, tối ưu hook và nhịp cắt.",
      "images": [] }
  ],
  "community": {
    "title": "Gắn kết đội ngũ qua trải nghiệm nội bộ",
    "challenge": "Giữ nhịp gắn kết cho 30-50+ nhân sự qua các hoạt động nội bộ tại Grand Nutrition và PJICO.",
    "solutions": [
      { "title": "Bản tin nội bộ", "body": "Tuyến bài truyền thông nội bộ đều đặn, giọng văn gần gũi." },
      { "title": "Sự kiện & workshop", "body": "Tổ chức 2+ sự kiện nội bộ, từ kịch bản đến điều phối." },
      { "title": "Team building", "body": "Thiết kế hoạt động để nhân sự tham gia chứ không chỉ có mặt." }
    ],
    "metrics": [
      { "value": "95%", "label": "Tỷ lệ tham gia", "note": "sự kiện nội bộ" },
      { "value": "3+", "label": "Hoạt động", "note": "team building, workshop, bản tin" },
      { "value": "50+", "label": "Phản hồi tích cực", "note": "" }
    ],
    "gallery": []
  },
  "works": {
    "title": "Selected Works",
    "items": [
      { "src": "work-content-ideas-sheet.png", "alt": "Bảng ý tưởng nội dung theo tuần", "caption": "Content ideas", "tilt": 1 },
      { "src": "work-content-pyramid-post.png", "alt": "Bài đăng mô hình kim tự tháp nội dung", "caption": "Content pyramid", "tilt": 2 },
      { "src": "work-cv-article.png", "alt": "Bài viết về tối ưu quy trình đọc CV", "caption": "Long-form", "tilt": 3 },
      { "src": "work-smartrecruit-article.png", "alt": "Bài viết SmartRecruit AI cho khách hàng B2B", "caption": "B2B SEO", "tilt": 4 },
      { "src": "work-womens-day-poster.png", "alt": "Poster chúc mừng ngày Phụ nữ", "caption": "Poster", "tilt": 2 },
      { "src": "work-business-brochure.png", "alt": "Brochure giới thiệu doanh nghiệp", "caption": "Brochure", "tilt": 1 },
      { "src": "work-croissant-photo.png", "alt": "Ảnh bánh croissant chụp cho nội dung F&B", "caption": "F&B", "tilt": 3 },
      { "src": "work-watch-photo.png", "alt": "Ảnh đồng hồ chụp cho nội dung sản phẩm", "caption": "Product", "tilt": 4 }
    ],
    "note": "[PLACEHOLDER: ảnh chất lượng cao cho 8 sản phẩm này — bản hiện tại chỉ 225-400px]"
  }
}
```

2. **`social-community.astro`** — `SectionHeader`, then the three `formats` as a tri-split (desktop
   3-col, mobile stacked) where each format shows its `kind` in display type, the Vietnamese gloss as
   meta, the body, and its images as small polaroids; the Video format has no image, so it renders a
   red outline paper tile with the text "30+ kịch bản" — a CV-sourced number, not an invented one.
   Then `<CaseStudy {...social.community} />` imported from `@components/sections/strategy/case-study.astro`.
   Then `<WorksWall {...social.works} />`.

3. **`social/works-wall.astro`** — Props `{ title, items, note }`. A masonry-ish scatter: CSS
   `columns: 3` desktop / `columns: 2` at 768 px / `1` below, with `break-inside: avoid` on each
   polaroid and per-item tilt from JSON. Pass each item straight to `<Polaroid>` and let the primitive
   clamp the width. Alternating `parallax` values on desktop columns. `note` renders through
   `isPlaceholder()` as a muted caption with the "cần bổ sung" sticker.

4. **`ugc.json`** — drafted from the F&B campaign line in the source:

```json
{
  "meta": { "id": "ugc", "index": "06", "title": "UGC",
            "subtitle": "Để khách hàng kể chuyện thay thương hiệu." },
  "belief": "Một nội dung do khách hàng tự quay có sức thuyết phục mà không ngân sách quảng cáo nào mua được.",
  "campaign": {
    "name": "Món quà ẩn (Hidden Menu)",
    "industry": "F&B",
    "insight": "Khách mua \"nội dung\" để chia sẻ và quyết định trong 3 giây đầu; một món không có trên menu là cái cớ hoàn hảo để họ khoe.",
    "mechanic": [
      "Đặt một món không xuất hiện trên menu, chỉ gọi được bằng một câu mật khẩu.",
      "Câu mật khẩu được hé lộ nhỏ giọt qua short-video trên TikTok/Reels.",
      "Khách quay lại khoảnh khắc gọi món và nhận quà, gắn hashtag chiến dịch.",
      "Nội dung khách quay được chọn lọc đăng lại trên kênh chính thức."
    ],
    "contentLadder": [
      { "stage": "Seeding", "body": "Short-video hé lộ, tạo tò mò trước khi công bố." },
      { "stage": "Kích hoạt", "body": "Hướng dẫn cách tham gia trong 15 giây, đủ đơn giản để nhớ." },
      { "stage": "Khuếch đại", "body": "Đăng lại nội dung khách quay, gắn tên người tạo." }
    ],
    "measurement": ["Số nội dung khách tự đăng", "Tỷ lệ nội dung đủ chuẩn để đăng lại", "Lượt tiếp cận từ nội dung khách so với nội dung thương hiệu"],
    "results": "[PLACEHOLDER: kết quả thực tế của chiến dịch Hidden Menu nếu đã triển khai]",
    "images": ["work-croissant-photo.png"],
    "imageNote": "[PLACEHOLDER: ảnh/video UGC thật từ khách hàng]"
  },
  "guardrails": [
    "Xin phép trước khi đăng lại nội dung của khách.",
    "Luôn ghi nguồn người tạo nội dung.",
    "Không chỉnh sửa nội dung khách tới mức sai lệch trải nghiệm thật."
  ]
}
```

   `measurement` lists metric *names*, never values — that is the line between describing a method
   and claiming a result.

5. **`ugc-showcase.astro`** — `SectionHeader`, belief as a display pull-quote, campaign name as an
   `<h3>` with an `F&B` sticker, insight in a tilted paper card, `mechanic` as a numbered `<ol>` laid
   out as four stepping-stone tiles, `contentLadder` as three ascending tiles (each offset upward by
   `var(--gap)` on desktop), `measurement` as a checklist, `guardrails` as a small maroon-bordered
   note box. `results` and `imageNote` render as placeholder stickers.

6. **`ai-first.json`** — drafted from the CV's AI bullets:

```json
{
  "meta": { "id": "ai-first", "index": "07", "title": "AI First",
            "subtitle": "AI rút ngắn quãng đường từ insight tới bản nháp, người viết giữ phần quyết định." },
  "tools": [
    { "name": "ChatGPT", "use": "Nghiên cứu insight, dựng khung kịch bản, biến thể tiêu đề." },
    { "name": "Gemini", "use": "Cập nhật xu hướng, tổng hợp nguồn nhanh." },
    { "name": "Claude", "use": "Biên tập bản dài, giữ giọng văn thống nhất qua nhiều bài." },
    { "name": "Leonardo", "use": "Dựng moodboard và ảnh concept trước khi brief designer." },
    { "name": "Canva", "use": "Hoàn thiện ấn phẩm social theo bộ nhận diện." },
    { "name": "CapCut", "use": "Dựng và tinh chỉnh nhịp video ngắn." }
  ],
  "workflow": [
    { "stage": "Research", "human": "Đặt câu hỏi và chọn nguồn", "ai": "Tổng hợp, phân cụm dữ liệu" },
    { "stage": "Ideation", "human": "Chốt góc tiếp cận", "ai": "Sinh 10+ biến thể để sàng lọc" },
    { "stage": "Draft", "human": "Viết phần cảm xúc và thông điệp bán hàng", "ai": "Dựng khung, gợi ý hook" },
    { "stage": "Polish", "human": "Kiểm chứng số liệu, chỉnh giọng văn", "ai": "Soát lỗi, rút gọn" }
  ],
  "agent": {
    "title": "Agent & tự động hóa",
    "body": "Gom các bước lặp lại — thu thập trend, tóm tắt bình luận, dựng bản nháp theo template — vào một quy trình chạy sẵn để mỗi tuần bắt đầu từ bản nháp thay vì trang trắng.",
    "status": "[PLACEHOLDER: mô tả agent/automation cụ thể đã tự xây dựng, kèm công cụ và kết quả]"
  },
  "boundary": "Mọi số liệu, tên thương hiệu và cam kết sản phẩm đều do người kiểm chứng trước khi xuất bản. AI không ký tên dưới bài viết.",
  "speedClaim": "[PLACEHOLDER: mức rút ngắn thời gian sản xuất thực tế, ví dụ số giờ/tuần tiết kiệm]"
}
```

7. **`ai-first.astro`** — `SectionHeader`, tools as a sticker grid (name in display font, use in body
   under it), `workflow` as a four-row human/AI split table rendered as paper cards (`<h3>` stage, two
   labelled columns — on mobile the two columns stack with "Người" / "AI" labels retained, so the
   contrast survives the reflow), `agent` as a wide tilted card, `boundary` as the closing statement in
   display type. This section sits on `var(--paper-2)`.

8. **`index.astro`** — replace the phase-5 comment with the three sections plus dividers, checking the
   final order reads Hero, Nav, About, Branding, Strategy, SEO, Social, UGC, AI First, Contact.

9. **Verify.** `pnpm check`, `pnpm build`, walk all nine nav links, and run
   `grep -rn "\[PLACEHOLDER" src/data/` — expect 13 total (1 phase 3, 7 phase 4, 5 here: works note,
   UGC results, UGC imageNote, agent status, speedClaim). Record the number; phase 7 prints it in the README.

## Todo List

- [ ] social.json + social-community.astro (CaseStudy reused, not forked)
- [ ] social/works-wall.astro (layout only; width clamp inherited from polaroid.astro)
- [ ] ugc.json + ugc-showcase.astro
- [ ] ai-first.json + ai-first.astro
- [ ] index.astro anchor filled, final section order verified

## Success Criteria

- [ ] All nine sections present in the documented order; every nav link resolves
- [ ] `grep -n "case-study" src/components/sections/social-community.astro` shows the phase-4 import; no second case-study component exists
- [ ] No `work-*.png` renders wider than its intrinsic width (check `width` attributes in the built HTML against the source PNG dimensions)
- [ ] UGC and AI First contain no numeric result outside a `[PLACEHOLDER]` string, except CV-sourced counts (30+, 4+, 3-4/tuần)
- [ ] `grep -rn "\[PLACEHOLDER" src/data/ | wc -l` returns 13
- [ ] Works wall shows no horizontal scrollbar at 390 px
- [ ] `pnpm check` 0 errors; every file < 200 lines

## Risk Assessment

| Risk | L x I | Mitigation |
|------|-------|------------|
| Low-res thumbnails upscaled, page looks amateur | H x H | Intrinsic-width clamp lives in `polaroid.astro` (phase 2) and applies here for free; hi-res request is a named content gap in plan.md |
| UGC section reads as a delivered campaign rather than a proposed mechanic | H x H | Section framed as approach; `results` is a placeholder; `measurement` lists metric names only |
| AI First reads as tool-name soup | M x M | The human/AI workflow table and the `boundary` statement carry the point; tools are supporting detail |
| CSS `columns` reorders the works wall unpredictably across breakpoints | M x L | Order is not meaningful here; captions identify each piece |
| `[PLACEHOLDER]` count drifts and the README figure goes stale | M x L | Count asserted in step 9 and re-asserted in phase 7 step for the README |
| Case Study 2 has no gallery | L x M | `gallery: []` passed explicitly; the `gallery.length > 0` guard is already specified in phase 4 step 7 |

## Security Considerations

No user-submitted content is actually collected; UGC is described, not implemented. No form, no
analytics, no third-party script.

## Next Steps

Phase 6 attaches motion to the now-stable DOM. Do not reorder sections after this phase without
re-checking `nav.json` and the ScrollTrigger anchors.
