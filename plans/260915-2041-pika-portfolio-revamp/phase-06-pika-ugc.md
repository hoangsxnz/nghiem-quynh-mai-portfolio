---
phase: 6
title: "Pika: UGC — Thử thách 30 ngày học cùng Pika"
status: done
effort: "2h"
dependencies: [1, 4]
---

# Phase 6: Pika — Dự án UGC

## Context

- Guidelines mục "Dự án UGC: Thử thách 30 ngày học cùng Pika"
- File nguồn (private, cần export): "Định hướng nội dung chị Minh Trang"
  `1B2rwIDWs9PEFRkqQKJoB6H_MdslXSmtTfR5AZZgS7XM`; "PIKA SUMMER CAMPAIGN"
  `1j7SrdHVVmnGFEq-l_3th_HTIkk9EtxTPYxtcNH4s5AI`
- 4 kênh cần chụp màn hình + dẫn link:
  - `https://www.facebook.com/chau.chau.660751/reels/`
  - `https://www.facebook.com/tranhien9996/reels/`
  - `https://www.tiktok.com/@bovalinda`
  - `https://www.tiktok.com/@conca.muahe`

## Overview

Thay hoàn toàn chiến dịch "Món quà ẩn" (đã xoá ở Phase 1) bằng dự án UGC có thật. Cấu trúc theo
đúng các mục guidelines liệt kê: Quy mô · Vai trò · Sản phẩm · Quy trình vận hành & tracking ·
Overview các kênh nổi bật.

## Requirements

Functional
- Thẻ thông tin dự án:
  - **Quy mô:** 30 phụ huynh đã sử dụng sản phẩm trong community.
  - **Vai trò:** vận hành, định hướng khách hàng sáng tạo nội dung UGC — kèm link file
    "Định hướng nội dung chị Minh Trang".
  - **Sản phẩm:** Robot Pika.
  - **Quy trình vận hành & tracking phụ huynh** — kèm link file "PIKA SUMMER CAMPAIGN".
- Khối "Overview các kênh nổi bật": 4 thẻ (2 Facebook reels, 2 TikTok), mỗi thẻ gồm ảnh chụp
  kênh + tên kênh + link.
- Mô tả ngắn cách vận hành rút từ 2 file thật (sau khi đọc export), không bịa số liệu kết quả.

Non-functional
- Ảnh chụp kênh của phụ huynh là nội dung người thật: chỉ dùng ảnh chụp trang công khai, không
  phóng to khuôn mặt trẻ em, không hiển thị bình luận có tên người khác. Nếu chủ sở hữu chưa xin
  phép các kênh này, hỏi trước khi đăng ảnh — fallback là thẻ link không ảnh.
- Ảnh đặt trong `src/assets/images/pika/`, tên `ugc-channel-fb-01.png`, `ugc-channel-tt-01.png`…

## Files owned

- `src/data/ugc.json`
- `src/components/sections/ugc-showcase.astro`
- `src/components/sections/ugc/channel-grid.astro` (tạo, hoặc dùng lại `social/channel-card`)
- `src/assets/images/pika/ugc-channel-*.png`
- `src/types/content-sections.ts`

## Steps

1. Kiểm tra 2 file export trong `assets-inbox/`; thiếu → dừng phase, báo lại.
2. Đọc file, ghi tóm tắt vào `plans/reports/` rồi mới viết copy.
3. Chụp 4 kênh bằng browser automation (TikTok thường cho xem không cần đăng nhập; Facebook có
   thể chặn → fallback thẻ link).
4. Viết `ugc.json` theo 5 mục yêu cầu; xoá sạch cấu trúc `campaign`/`guardrails` cũ.
5. Viết lại `ugc-showcase.astro`, dùng `evidence-card` + `file-link` từ Phase 4.
6. `pnpm check && pnpm build`.

## Validation

- Đủ 4 thẻ kênh, mỗi thẻ mở đúng URL trong guidelines.
- `grep -n "Hidden Menu\|Món quà ẩn" src/` → rỗng.
- Không có số liệu kết quả nào không truy được về file nguồn.
- 390px: lưới kênh xếp 1 cột, không tràn.
- `pnpm check && pnpm build` sạch.

## Risk & rollback

- **Rủi ro riêng tư:** ảnh chụp kênh cá nhân của phụ huynh. Xử lý theo mục Non-functional; khi
  nghi ngờ thì hỏi, không tự đăng.
- **Rollback:** revert commit `feat(pika-ugc)`.
