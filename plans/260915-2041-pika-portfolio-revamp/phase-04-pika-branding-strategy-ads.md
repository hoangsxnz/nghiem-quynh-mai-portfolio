---
phase: 4
title: "Pika: Branding, Content Strategy, Content Ads"
status: done
effort: "4h"
dependencies: [1]
---

# Phase 4: Pika — Branding & Positioning, Content Strategy, Content Ads

## Context

- Guidelines mục "Tiêu đề lớn Dự án nổi bật gần đây: Robot dạy tiếng Anh Pika"
- Nguồn dữ liệu (đều private, chủ sở hữu tự export vào `assets-inbox/`):
  - Branding & Positioning — Sheet `1no-kfxe7MaY6RW4piu1TUKlHzQ3Uipak7a5wQ0gWgVU`
    ("Robot Pika - Fanpage Facebook")
  - Content Strategy — Sheet `13Q1H3WvToCSXaUtV0hEJpHY1uyItSbpyIB7l6DGZh1c`
    ("Robot Pika - Fanpage", gid 1926247286)
  - Content Ads — Sheet `1MYc9jIARbe3e7tRrGFRJMGXeKdPanMvrzEFkyxpm9qw` ("Kịch bản Ads mẫu")

## Overview

Ba section đầu của nhóm dự án Pika. Mỗi section theo cùng một khuôn: đoạn mô tả do agent viết dựa
trên nội dung file thật → ảnh chụp phần highlight của file → nút dẫn link file gốc.

**Chặn cứng:** không viết một dòng mô tả nào trước khi đọc file export. Nếu tới lúc thực thi mà
`assets-inbox/` chưa có file, dừng phase và báo lại, không bịa nội dung.

## Requirements

Functional
- Section `#branding` — Branding & Positioning:
  - Mô tả định vị thương hiệu Robot Pika rút ra từ file thật (đối tượng, insight, brand voice,
    thông điệp lõi) — viết theo đúng dữ liệu, không thêm số liệu không có trong file.
  - 1–3 ảnh chụp highlight từ file, mỗi ảnh có caption nói rõ đang xem phần nào.
  - Nút "Xem file: Robot Pika — Fanpage Facebook" dẫn link Sheets gốc.
- Section `#strategy` — Content Strategy:
  - Hiển thị đúng 7 mắt xích theo guidelines: **Direction, Plan, Pillar, Angle, Calendar, KPI,
    Đo lường**, mỗi mắt xích một đoạn ngắn lấy từ file thật.
  - Ảnh chụp highlight (ví dụ bảng pillar/angle, calendar, bảng KPI) + caption.
  - Nút dẫn link Sheets gốc.
- Section `#ads` — Content Ads (Kịch bản mẫu):
  - Ảnh chụp 1–2 kịch bản ads mẫu + mô tả cách tiếp cận (hook, insight khai thác, CTA).
  - Nút "Xem kịch bản Ads mẫu" dẫn link Sheets gốc.
  - `id="ads"` khớp mục nav ADS từ Phase 1.

Non-functional
- Ảnh chụp che/loại bỏ thông tin nhạy cảm (ngân sách chi tiết, dữ liệu cá nhân, tên nhân sự) nếu
  có trong file — hỏi lại chủ sở hữu khi gặp, không tự quyết.
- Ảnh nén ≤ 300 KB/ảnh, đặt trong `src/assets/images/pika/`, đặt tên
  `pika-branding-01.png`, `pika-strategy-calendar.png`, `pika-ads-script-01.png`…
- Mỗi component < 200 dòng.

## Files owned

- `src/data/branding.json`, `src/data/strategy.json`, `src/data/ads.json` (tạo mới)
- `src/components/sections/branding-positioning.astro`
- `src/components/sections/content-strategy.astro`
- `src/components/sections/content-ads.astro` (tạo, thay chỗ `content-seo.astro` đã xoá)
- `src/components/sections/pika/evidence-card.astro` (tạo — khối ảnh + caption + link dùng chung
  cho phase 4, 5, 6)
- `src/components/ui/file-link.astro` (tạo — nút dẫn file Google có icon + nhãn)
- `src/types/content-sections.ts`
- `src/assets/images/pika/*`

## Steps

1. Kiểm tra `assets-inbox/` có đủ 3 file export (hoặc ảnh chụp). Thiếu → dừng, báo lại.
2. Đọc từng file, ghi tóm tắt vào `plans/reports/` trước khi viết copy, để copy có nguồn truy vết.
3. Tạo `evidence-card.astro` và `file-link.astro` (dùng lại ở phase 5, 6).
4. Viết `branding.json` + sửa `branding-positioning.astro`.
5. Viết `strategy.json` với đúng 7 mắt xích + sửa `content-strategy.astro`.
6. Viết `ads.json` + tạo `content-ads.astro`, cắm vào `index.astro` giữa Strategy và Social.
7. Cắt/nén ảnh highlight, đưa vào `src/assets/images/pika/`.
8. `pnpm check && pnpm build`.

## Validation

- Mỗi section có đủ 3 thành phần: mô tả · ảnh highlight · link file.
- 7 mắt xích Content Strategy hiển thị đúng tên và đúng thứ tự guidelines.
- `curl -s -o /dev/null -w "%{http_code}" <mỗi link>` → 200 (nếu 401 thì báo chủ sở hữu mở
  quyền; ghi vào Phase 8 checklist).
- Không có câu nào trong copy chứa số liệu không tìm thấy trong file nguồn.
- `pnpm check && pnpm build` sạch.

## Risk & rollback

- **Rủi ro cao nhất:** file export về muộn → toàn phase treo. Giảm thiểu: làm Phase 2, 3, 7 trước.
- **Rủi ro nội dung:** dữ liệu nội bộ Step Up Education có thể không được phép công bố. Nếu file
  có dấu hiệu nhạy cảm (doanh thu, chi phí, hợp đồng) → dừng, hỏi chủ sở hữu.
- **Rollback:** revert commit `feat(pika-core)`.
