---
phase: 2
title: "Cover"
status: done
effort: "2h"
dependencies: [1]
---

# Phase 2: Cover

## Context

- Guidelines mục "Bìa" + ảnh mẫu `CV & Portfolio/Portfolio guidelines/images/image6.png`
- `src/components/sections/hero-cover.astro`, `src/data/hero.json`
- `src/components/ui/stamp.astro`, `polaroid.astro`

## Overview

Đổi hệ thống chữ trên bìa theo ảnh mẫu: dòng `CONTENT MARKETING EXECUTIVE` in đậm nằm trên,
chữ `PORTFOLIO` cỡ lớn nhất, rồi tới họ tên. Thay câu tagline, bỏ stamp "OPEN TO WORK", đổi cách
xử lý ảnh chân dung (tách nền + đổ bóng thay cho khung polaroid).

## Requirements

Functional
- Thứ tự dọc: `CONTENT MARKETING EXECUTIVE` (đậm) → `PORTFOLIO` → `Nghiêm Quỳnh Mai`.
- `PORTFOLIO` dùng `--font-display`, cỡ lớn nhất trang, màu `--red`.
- Tagline mới thay câu cũ, nguyên văn:
  "Viết đúng insight, chạm đúng thời điểm. Tối ưu từng thông điệp để mang lại giá trị thực tế từ
  mỗi điểm chạm nội dung."
- Không còn stamp "OPEN TO WORK" trên trang.
- Ảnh chân dung render dạng ảnh tách nền có `filter: drop-shadow(...)`, không khung polaroid.
- Bìa có hiệu ứng vào trang (đã có `data-split` cho tên; bổ sung reveal theo bậc cho 3 dòng chữ
  và parallax nhẹ cho ảnh).

Non-functional
- `h1` vẫn là họ tên (SEO/a11y); `PORTFOLIO` và dòng role là `p`/`span` có `aria-hidden` phù hợp
  nếu lặp nội dung.
- Giữ `data-split` chỉ trên text thuần — không chèn `<br>` vào phần tử được split.

## Files owned

- `src/data/hero.json`
- `src/components/sections/hero-cover.astro`
- `src/components/sections/hero/wordmark.astro` (tạo, nếu tách khối chữ giúp file < 200 dòng)
- `src/assets/images/photo-mai-cutout.png` (thêm khi có ảnh thật)

## Steps

1. Cập nhật `hero.json`: thêm `wordmark: "PORTFOLIO"`, sửa `oneLiner`, xoá `stamp`, đổi `photo`
   sang cấu trúc `{ src, alt, style: "cutout" }`. Cập nhật `HeroContent` trong
   `content-sections.ts`.
2. Sửa `hero-cover.astro`: bỏ `<Stamp>`; render `role` với `font-weight: 700` + letter-spacing
   theo ảnh mẫu; thêm wordmark; đổi `<Polaroid>` thành `<Image>` trần + class `.hero__cutout`.
3. CSS `.hero__cutout`: `filter: drop-shadow(0 18px 24px rgba(26,26,26,.28))`, giữ
   `max-width: 100%`, không `background`.
4. Hiệu ứng: gắn `data-reveal` theo thứ tự role → wordmark → h1 → tagline → links; giữ parallax
   0.1 cho ảnh; toàn bộ vẫn nằm trong nhánh `prefers-reduced-motion: no-preference`.
5. Ảnh thật chưa có: tạm trỏ `photo-mai-cafe.png` và ghi `TODO` duy nhất tại `hero.json`.
   Khi chủ sở hữu đưa ảnh → tách nền, xuất PNG trong suốt ≤ 900px chiều rộng, đặt tên
   `photo-mai-cutout.png`, đổi 1 dòng JSON.

## Validation

- Ảnh chụp màn hình bìa ở 1440px và 390px khớp thứ tự chữ trong `image6.png`.
- `grep -rn "OPEN TO WORK" src/` → rỗng.
- `grep -n "Lan tỏa giá trị thực" src/data/*.json` → rỗng.
- `pnpm check && pnpm build` sạch.
- Bật `prefers-reduced-motion: reduce` → không có animation nào chạy.

## Risk & rollback

- **Rủi ro:** ảnh chân dung thật chưa có nên tỷ lệ layout có thể lệch khi thay. Giảm thiểu bằng
  cách đặt khung ảnh theo `aspect-ratio` cố định thay vì chiều cao tự nhiên.
- **Rollback:** revert commit `feat(cover)`.
