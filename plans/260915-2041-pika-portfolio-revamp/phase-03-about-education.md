---
phase: 3
title: "About Me, Kinh nghiệm & Học vấn"
status: done
effort: "3h"
dependencies: [1]
---

# Phase 3: About Me, Kinh nghiệm & Học vấn

## Context

- Guidelines mục "About Me" + ảnh mẫu `images/image3.png` (2 polaroid trái, chữ phải)
- `src/components/sections/about-me.astro`, `src/data/about.json`
- `src/components/sections/about/timeline.astro` (chứa cả "Hành trình" lẫn "Kinh nghiệm")
- `src/components/sections/about/skills-grid.astro`, `about/education-list.astro`

## Overview

Viết lại About Me theo ảnh mẫu: cụm 2 ảnh polaroid (một trên, một dưới, hơi lệch nhau) chiếm nửa
trái, cụm chữ nửa phải. Bỏ khối "Hành trình", đổi nội dung text box, xếp lại Kỹ năng thành 4 box
một hàng, đổi nội dung Ngôn ngữ và Tools, phóng to Học vấn & Chứng chỉ và chuyển lên ngay sau
Kinh nghiệm làm việc.

## Requirements

Functional
- Bố cục: cụm ảnh (2 polaroid xếp so le, cái trên lệch phải, cái dưới lệch trái như `image3.png`)
  bên trái, text box bên phải; dưới 900px xếp dọc ảnh trước, chữ sau.
- Text box duy nhất tiêu đề **"Mục tiêu nghề nghiệp"**, nội dung nguyên văn 3 đoạn bắt đầu bằng
  "Xin chào, mình là Quỳnh Mai." (chép đúng từ guidelines).
- Text box "Mục tiêu nghề nghiệp" cũ (đoạn "Content Marketing Executive +2 năm kinh nghiệm…")
  bị xoá khỏi `about.json`.
- Giữ nguyên câu quote: "Nội dung không chỉ để xem, nội dung phải để kết nối và tạo giá trị."
- Xoá hoàn toàn khối "Hành trình" (`eras`), giữ nguyên "Kinh nghiệm làm việc" (`experience`).
- Thứ tự mới: About → Kinh nghiệm làm việc → **Học vấn & Chứng chỉ** → Kỹ năng → Ngôn ngữ →
  Tools marquee.
- Học vấn & Chứng chỉ: cỡ chữ và khoảng cách lớn hơn hiện tại (tiêu đề `--fs-h3`, mỗi mục là thẻ
  có viền/đổ bóng theo phong cách paper-cut), nổi bật hơn các khối lân cận.
- Kỹ năng: 4 nhóm hiện có nằm **cùng một hàng** trên desktop (grid 4 cột), 2 cột ở tablet,
  1 cột ở mobile.
- Ngôn ngữ đổi thành: Tiếng Pháp — Thành thạo · Tiếng Anh — Thành thạo · Tiếng Trung — Giao tiếp
  cơ bản.
- Tools marquee: bỏ `Microsoft Office`, thêm `Google Sheets`, `Google Slides`, `Google Docs`.

Non-functional
- `about-me.astro` giữ dưới 200 dòng; tách `about/photo-stack.astro` nếu cần.
- Cụm 2 ảnh không được làm tràn ngang ở 390px (bài học polaroid 520px của phase cũ).

## Files owned

- `src/data/about.json`
- `src/components/sections/about-me.astro`
- `src/components/sections/about/timeline.astro` (đổi tên khối, bỏ `eras`)
- `src/components/sections/about/skills-grid.astro`
- `src/components/sections/about/education-list.astro`
- `src/components/sections/about/photo-stack.astro` (tạo)
- `src/types/content-sections.ts` (interface `AboutContent`)
- `src/assets/images/photo-mai-polaroid-1.jpg`, `photo-mai-polaroid-2.jpg` (thêm khi có ảnh)

## Steps

1. `about.json`: xoá `bio`, `eras`, `touchpoints` (không có trong cấu trúc mới); đổi `objective`
   thành `{ title: "Mục tiêu nghề nghiệp", body: [3 đoạn mới] }`; đổi `languages`, `tools`;
   thêm `portraits: [{src, alt, tilt}, {src, alt, tilt}]`.
2. Cập nhật `AboutContent` trong `content-sections.ts` khớp cấu trúc mới.
3. Tạo `photo-stack.astro`: 2 `<Polaroid>` xếp chồng lệch nhau bằng grid + `translate`, tilt lấy
   từ `--tilt-1` / `--tilt-3`.
4. Sửa `about-me.astro`: lead thành grid 2 cột (ảnh | text box), bỏ `touchpoints`, giữ `quote`.
5. `timeline.astro`: bỏ nhánh render `eras`, chỉ còn `experience`; đổi tên file thành
   `experience-list.astro` nếu tên cũ gây hiểu nhầm.
6. Chuyển `<EducationList>` lên ngay sau khối kinh nghiệm trong `about-me.astro`; nâng cỡ chữ,
   thêm nền thẻ + `--shadow`, cho mỗi mục một `data-reveal` riêng.
7. `skills-grid.astro`: đổi grid thành `repeat(4, 1fr)` ≥1100px, `repeat(2, 1fr)` ≥640px,
   1 cột dưới 640px. Ngôn ngữ giữ thiết kế cũ, chỉ đổi dữ liệu.
8. Ảnh polaroid thật chưa có → tạm dùng `photo-mai-avatar.png` + `photo-mai-cafe.png`, đánh dấu
   một `TODO` duy nhất trong `about.json`.

## Validation

- So sánh ảnh chụp màn hình với `images/image3.png`: cụm ảnh trái, chữ phải, 2 ảnh so le.
- `grep -n "Hành trình\|eras" src/` → rỗng.
- `grep -n "Microsoft Office" src/data/about.json` → rỗng.
- DevTools 390 / 768 / 1440px: không scroll ngang; 4 box kỹ năng đúng số cột theo breakpoint.
- `pnpm check && pnpm build` sạch.

## Risk & rollback

- **Rủi ro:** `timeline.astro` đang gộp 2 khối; cắt sai làm mất phần Kinh nghiệm. Kiểm bằng cách
  đếm số công ty hiển thị = 4 trước và sau khi sửa.
- **Rollback:** revert commit `feat(about)`.
