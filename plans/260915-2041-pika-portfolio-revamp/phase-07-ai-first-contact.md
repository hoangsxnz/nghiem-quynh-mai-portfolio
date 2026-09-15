---
phase: 7
title: "AI First & Contact"
status: done
effort: "1.5h"
dependencies: [1]
---

# Phase 7: AI First & Contact

## Context

- Guidelines mục "AI first" + ảnh `images/image1.png` (danh sách 12 file agent)
- Guidelines mục "Contact"
- `src/components/sections/ai-first.astro`, `src/data/ai-first.json`
- `src/components/sections/contact-end.astro`, `src/data/contact.json`

## Overview

AI First giữ nguyên nội dung hiện có, chỉ chỉnh bố cục và bổ sung phần agent dưới dạng danh sách
tên. Contact bỏ khối tiêu đề section, canh giữa cụm văn bản, thay đoạn giới thiệu, thêm LinkedIn.

## Requirements — AI First

- Giữ toàn bộ nội dung hiện tại (bộ công cụ, bảng chia việc người/AI, ranh giới kiểm chứng).
- Chỉnh bố cục cho thoáng hơn: bộ công cụ dạng lưới thẻ, bảng chia việc dạng 2 cột rõ ràng.
- Thêm khối **"Bộ agent tự xây"** — chỉ liệt kê tên, **không hiển thị nội dung bên trong**:
  `01-content-calendar`, `02-campaign-brief`, `03-performance-audit`, `04-content-script`,
  `05-ads-copy`, `06-ugc-brief`, `07-marketing-report`, `08-competitor-research`,
  `09-customer-insight`, `10-kpi-calculator`, `11-channel-setup`, `12-landing-page-brief`.
- Xoá placeholder `agent.status` và `speedClaim` hiện có (thay bằng danh sách agent thật).
- Bổ sung 1–2 câu mô tả mỗi agent làm gì ở mức khái quát (một dòng), không dán nội dung file.

## Requirements — Contact

- Bỏ khối `SectionHeader` ở đầu section (mất số "09", tiêu đề "KEEP IN TOUCH" và subtitle
  "Let's make magic happen!" ở đầu trang). Section vẫn cần một tiêu đề ẩn cho a11y
  (`<h2 class="sr-only">Liên hệ</h2>`) để giữ `aria-labelledby`.
- Cụm văn bản canh giữa trang, thay đoạn intro cũ bằng nguyên văn:
  "Nếu team đang cần một mảnh ghép vừa biết kể chuyện thương hiệu, vừa biết tối ưu hiệu quả vận
  hành để cùng tạo nên những giá trị mới, mình rất sẵn lòng. Hãy cùng kết nối để chúng ta có thể
  trao đổi về những giải pháp nội dung thực tế, được tối ưu riêng cho những dự án sắp tới!"
- Giữ 4 thẻ contact; thẻ LinkedIn đổi `href` thành `https://www.linkedin.com/in/quynhmai37/`
  (xoá `[PLACEHOLDER: LinkedIn URL]`).
- Giữ nút "Gửi email cho Mai".
- Giữ câu kết "Keep in touch. Let's make magic happen!", làm nổi bật hơn (cỡ `--fs-h2`,
  `--font-display`) và gắn hiệu ứng cuộn (scale/opacity theo scroll, chỉ chạy khi
  `prefers-reduced-motion: no-preference`).

## Files owned

- `src/data/ai-first.json`, `src/data/contact.json`
- `src/components/sections/ai-first.astro`
- `src/components/sections/ai-first/agent-list.astro` (tạo)
- `src/components/sections/contact-end.astro`
- `src/scripts/motion/reveals.ts` (thêm hiệu ứng cho câu kết, nếu không tái dùng được reveal sẵn có)
- `src/types/content-sections.ts`

## Steps

1. `ai-first.json`: thêm mảng `agents: [{ name, note }]` × 12; xoá `agent.status`, `speedClaim`.
2. Tạo `agent-list.astro` render lưới tên agent dạng thẻ nhỏ, mono-ish, có `data-reveal` so le.
3. Chỉnh grid trong `ai-first.astro`, cắm `<AgentList>` sau bảng chia việc.
4. `contact.json`: đổi `intro`, sửa `href` LinkedIn; giữ `cta`, `closing`, `footer`.
5. `contact-end.astro`: bỏ `<SectionHeader>`, thêm `h2.sr-only`, canh giữa `.intro` và `.cards`,
   nâng cỡ `.closing`, gắn hiệu ứng cuộn.
6. `pnpm check && pnpm build`.

## Validation

- Đếm đúng 12 agent, không có nội dung chi tiết nào của file agent lộ trên trang.
- `grep -n "PLACEHOLDER" src/data/contact.json src/data/ai-first.json` → rỗng.
- Đầu section Contact không còn "09" / "KEEP IN TOUCH" / "Let's make magic happen" (chỉ còn ở
  câu kết cuối trang).
- Link LinkedIn mở đúng `https://www.linkedin.com/in/quynhmai37/`.
- `prefers-reduced-motion: reduce` → câu kết hiện tĩnh, không animation.
- `pnpm check && pnpm build` sạch.

## Risk & rollback

- **Rủi ro a11y:** bỏ `SectionHeader` làm mất `id` mà `aria-labelledby` đang trỏ tới → kiểm bằng
  axe/Lighthouse ở Phase 8.
- **Rollback:** revert commit `feat(ai-contact)`.
