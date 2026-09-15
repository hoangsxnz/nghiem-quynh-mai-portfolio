---
phase: 1
title: "Foundation & Cleanup"
status: done
effort: "3h"
dependencies: []
---

# Phase 1: Foundation & Cleanup

## Context

- `CV & Portfolio/Portfolio guidelines/Portfolioguidelines.html` — yêu cầu gốc
- `src/pages/index.astro` — thứ tự section hiện tại
- `src/data/nav.json`, `src/types/content-sections.ts`, `src/lib/image-map.ts`

## Overview

Dọn nền trước khi viết nội dung mới: xoá 5 khối nội dung không phải Pika, đổi nav `SEO` → `ADS`,
dựng khối tiêu đề nhóm dự án, mở rộng image resolver cho `.jpg`, và tạo `assets-inbox/` để chủ sở
hữu bắt đầu bỏ tư liệu vào. Sau phase này web vẫn build được nhưng phần dự án tạm rỗng.

## Requirements

Functional
- Nav còn 8 mục, mục `SEO` đổi thành `ADS` trỏ tới `#ads`.
- Section `Content SEO` biến mất khỏi trang và khỏi repo.
- Có component `project-group.astro` render tiêu đề lớn "Dự án nổi bật gần đây: Robot dạy tiếng
  Anh Pika" và bọc các section con của dự án.
- `image()` resolve được cả `.png` và `.jpg`.
- `assets-inbox/README.md` liệt kê chính xác từng file chủ sở hữu cần đưa.

Non-functional
- `pnpm check` 0 lỗi, `pnpm build` thành công.
- Không còn import chết, không còn type mồ côi trong `content-sections.ts`.

## Files owned

Xoá:
- `src/data/seo.json`
- `src/components/sections/content-seo.astro`
- `src/components/sections/branding/industry-card.astro`
- `src/components/sections/strategy/case-study.astro`
- `src/components/sections/social/works-wall.astro`
- `src/components/sections/ugc/campaign-detail.astro`

Sửa:
- `src/pages/index.astro`
- `src/data/nav.json`
- `src/types/content-sections.ts`
- `src/lib/image-map.ts`
- `src/components/sections/branding-positioning.astro` (rút còn khung rỗng chờ Phase 4)
- `src/components/sections/content-strategy.astro`
- `src/components/sections/social-community.astro`
- `src/components/sections/ugc-showcase.astro`

Tạo:
- `src/components/sections/project-group.astro`
- `assets-inbox/README.md`

## Steps

1. Xoá `seo.json` + `content-seo.astro`, gỡ import và thẻ `<ContentSeo />` khỏi `index.astro`,
   gỡ interface `SeoContent` khỏi `content-sections.ts`.
2. Đổi `nav.json`: `{ "id": "seo", "label": "SEO" }` → `{ "id": "ads", "label": "ADS" }`.
3. Tạo `project-group.astro`: nhận `title`, `subtitle?`, slot; render tiêu đề cỡ `--fs-h2` với
   sticker/stamp theo phong cách paper-cut hiện có, có `data-reveal`.
4. Trong `index.astro`, bọc Branding → Strategy → Ads → Social → UGC vào `<ProjectGroup>`; giữ
   `TornDivider` giữa các section con.
5. Xoá 4 component con thuộc nội dung cũ (`industry-card`, `case-study`, `works-wall`,
   `campaign-detail`) và mọi import tới chúng; 4 section cha tạm chỉ còn `SectionHeader`.
6. Rút nội dung cũ khỏi `branding.json`, `strategy.json`, `social.json`, `ugc.json`: giữ `meta`,
   xoá `industries`, `valueProps`, `caseStudy`, `works`, `community`, `campaign`, `guardrails`;
   cập nhật type tương ứng.
7. Mở rộng glob trong `image-map.ts` thành `/src/assets/images/**/*.{png,jpg,jpeg}` và key theo
   tên file như cũ (kiểm tra không trùng tên giữa thư mục con).
8. Tạo `assets-inbox/README.md` với bảng: tên file cần đưa · nguồn · dùng ở phase nào.
9. Chạy `pnpm check && pnpm build`.

## Validation

- `pnpm check` → 0 error, 0 warning mới.
- `pnpm build` thành công.
- `grep -rn "content-seo\|industry-card\|case-study\|works-wall\|campaign-detail" src/` → rỗng.
- `grep -rn "SeoContent" src/` → rỗng.
- Mở `pnpm dev`: nav có mục ADS, trang không lỗi console, tiêu đề nhóm dự án hiển thị.

## Risk & rollback

- **Rủi ro:** xoá nhầm type mà section khác còn dùng → `astro check` bắt ngay, sửa tại chỗ.
- **Rollback:** `git checkout -- src/` (phase chưa commit) hoặc revert commit `feat(cleanup)`.
