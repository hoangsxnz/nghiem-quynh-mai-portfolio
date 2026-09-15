---
phase: 8
title: "Motion, QA & Docs"
status: done
effort: "3h"
dependencies: [2, 3, 4, 5, 6, 7]
---

# Phase 8: Motion, QA & Docs

## Context

- Guidelines câu mở đầu: "Toàn bộ portfolio thêm hiệu ứng và elements phù hợp theo template mẫu
  và nội dung"
- `src/scripts/motion/*`, `src/styles/global.css`
- `docs/content-source.md`, `docs/design-guidelines.md`

## Overview

Phase đóng: rà hiệu ứng toàn trang cho đồng nhất, kiểm tra chất lượng (link, ảnh, a11y,
responsive, hiệu năng), đối chiếu lại từng gạch đầu dòng của guidelines, cập nhật docs.

## Requirements

Functional
- Mỗi section có ít nhất một lớp chuyển động phù hợp: reveal theo bậc cho chữ, parallax nhẹ cho
  ảnh, marquee cho tools, hiệu ứng cuộn cho câu kết. Không thêm thư viện mới.
- Elements paper-cut (sticker, stamp, torn divider) phân bố đều, không cụm hết vào một section.
- Mọi link ngoài trả HTTP 200. Link nào còn 401 → hoặc chủ sở hữu mở quyền, hoặc gỡ nút đó khỏi
  web (không để link chết).

Non-functional
- `pnpm check`, `pnpm build` sạch.
- Không còn `[PLACEHOLDER` hay `TODO` trong `src/data/*.json`.
- Responsive 390 / 768 / 1024 / 1440px: không scroll ngang, không chữ tràn.
- Contrast AA cho mọi cặp màu mới; heading tăng cấp đúng thứ tự (h1 → h2 → h3).
- `prefers-reduced-motion: reduce` tắt toàn bộ animation.
- Tổng dung lượng ảnh trang < 4 MB.

## Files owned

- `src/scripts/motion/*`
- `src/styles/global.css`
- `docs/content-source.md`, `docs/design-guidelines.md`
- `plans/reports/qa-260915-pika-revamp.md` (tạo)

## Steps

1. Rà motion: liệt kê từng section và lớp hiệu ứng đang có; bổ sung cho section thiếu, gỡ chỗ dày
   quá.
2. Kiểm link: chạy `curl -s -o /dev/null -w "%{http_code} %{url_effective}\n" -L` cho từng URL
   ngoài (6 file Google + fanpage + 2 TikTok video + 4 kênh UGC + LinkedIn). Ghi bảng kết quả vào
   báo cáo QA.
3. Kiểm ảnh: mọi `image()` resolve được, không ảnh nào > 500 KB sau nén.
4. Kiểm a11y: heading order, `alt` cho mọi ảnh, focus ring, `aria-labelledby` còn hợp lệ sau khi
   bỏ SectionHeader ở Contact.
5. Kiểm responsive ở 4 breakpoint, chụp màn hình lưu vào `plans/.../qa/`.
6. Đối chiếu từng gạch đầu dòng trong `Portfolioguidelines.html` với web: đánh dấu Done / Skipped
   + lý do. Đây là tiêu chí nghiệm thu chính.
7. Cập nhật `docs/content-source.md` (nguồn nội dung mới: guidelines + 6 file Google) và
   `docs/design-guidelines.md` (nếu có token/pattern mới).
8. Commit theo conventional commits, không nhắc AI trong message.

## Validation

- Bảng đối chiếu guidelines: 100% dòng có trạng thái, 0 dòng bỏ quên không lý do.
- Bảng link: mọi dòng 200, hoặc có ghi chú "đã gỡ khỏi web".
- `grep -rn "PLACEHOLDER\|TODO" src/data/` → rỗng.
- `pnpm build` sạch; mở `dist/` qua `pnpm preview` không lỗi console.

## Risk & rollback

- **Rủi ro:** link Google vẫn private lúc publish → web đầy nút dẫn tới trang xin quyền. Bước 2
  là cửa chặn; không đóng phase khi bảng link còn 401 chưa xử lý.
- **Rollback:** revert commit `chore(qa)`; các phase trước vẫn đứng độc lập.
