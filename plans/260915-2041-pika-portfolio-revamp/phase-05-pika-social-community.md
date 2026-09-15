---
phase: 5
title: "Pika: Social Media & Community"
status: done
effort: "2.5h"
dependencies: [1, 4]
---

# Phase 5: Pika — Social Media & Community

## Context

- Guidelines mục "Social Media & Community"
- Ảnh sẵn có trong `CV & Portfolio/Portfolio guidelines/images/`:
  - `image2.png` — ảnh chụp bài đăng
  - `image5.png` — ảnh bìa video (dọc 280×496)
  - `image8.jpg`, `image7.jpg` — ảnh feed
  - `image4.png` — bảng hiệu suất kênh 1 tháng
- Link: fanpage `https://www.facebook.com/robotpika`; bài mẫu Google Doc
  `16CUJMcOlG89agsPV0IYFvzKA6z8r5vcuZNsal32Xuuo`; community Sheet
  `1OWPts1wn7VudvWT9gh_uxuL7lCUByqQmP6Kh9one8II`
- TikTok: `.../video/7631920982978039060`, `.../video/7637851947772448020`

## Overview

Section Social & Community của dự án Pika: 4 nhóm bằng chứng — bài đăng, video, feed, số liệu
kênh — cộng khối Community dẫn file kế hoạch cộng đồng.

## Requirements

Functional
- Khối "Kênh phụ trách": tên kênh + link `https://www.facebook.com/robotpika` + ảnh chụp fanpage.
- Khối "Post mẫu": ảnh `image2.png` + link Google Doc bài mẫu.
- Khối "Feed": 2 ảnh `image8.jpg`, `image7.jpg` hiển thị dạng cụm ảnh dọc.
- Khối "Video": ảnh bìa `image5.png` + 2 link TikTok, mỗi link là thẻ bấm được (không nhúng
  iframe — tránh script bên thứ ba và giữ 0 KB JS).
- Khối "Hiệu suất kênh": ảnh `image4.png` + caption **trung thực**:
  nêu 4.481.451 lượt xem / 1.169.990 người xem / 27.353 lượt xem ≥3 giây / 3.636 lượt xem ≥1 phút
  trong kỳ 1 tháng. **Không gọi là "tăng trưởng"** vì ảnh ghi -36,4% so với 32 ngày trước.
- Khối "Community": mô tả ngắn cách vận hành cộng đồng + link file "Community Planning".

Non-functional
- Ảnh từ thư mục guidelines được copy (không sửa gốc) vào `src/assets/images/pika/` với tên nói
  rõ nội dung: `pika-post-sample.png`, `pika-video-cover.png`, `pika-feed-01.jpg`,
  `pika-feed-02.jpg`, `pika-channel-stats.png`.
- `image-map.ts` đã hỗ trợ `.jpg` từ Phase 1 — nếu chưa, xử lý trước.
- Mọi link ngoài: `rel="noopener noreferrer"`, `target="_blank"`, có nhãn rõ điểm đến.

## Files owned

- `src/data/social.json`
- `src/components/sections/social-community.astro`
- `src/components/sections/social/channel-card.astro` (tạo)
- `src/assets/images/pika/pika-post-sample.png`, `pika-video-cover.png`, `pika-feed-01.jpg`,
  `pika-feed-02.jpg`, `pika-channel-stats.png`, `pika-fanpage-screenshot.png`
- `src/types/content-sections.ts`

## Steps

1. Copy 5 ảnh từ thư mục guidelines sang `src/assets/images/pika/`, đổi tên, nén (`sharp` đã có
   trong devDependencies; ảnh feed 1206×1899 nên resize xuống ≤ 1000px chiều rộng).
2. Chụp fanpage `https://www.facebook.com/robotpika` bằng browser automation, cắt phần header
   kênh. Nếu Facebook dựng tường đăng nhập → bỏ ảnh, chỉ dùng `channel-card` dạng link, ghi lý do
   vào báo cáo phase.
3. Viết `social.json` theo 6 khối yêu cầu ở trên; caption hiệu suất kênh viết đúng con số trong
   ảnh, không thêm diễn giải.
4. Viết lại `social-community.astro` dùng `evidence-card` (từ Phase 4) + `channel-card` mới.
5. Kiểm tra link Google Doc bài mẫu và Sheet community; nếu 401 → ghi vào Phase 8 checklist.
6. `pnpm check && pnpm build`.

## Validation

- 5 ảnh guidelines đều xuất hiện trên trang, không ảnh nào vỡ (`image()` ném lỗi lúc build nếu
  sai tên).
- Caption số liệu khớp từng con số đọc được trong `image4.png`; không có từ "tăng trưởng".
- Mọi thẻ link mở đúng URL trong guidelines (đối chiếu từng URL một).
- 390px: cụm feed không tràn ngang, ảnh dọc không cao quá 80vh.
- `pnpm check && pnpm build` sạch.

## Risk & rollback

- **Rủi ro:** Facebook chặn ảnh chụp tự động → fallback link card, đã định nghĩa sẵn.
- **Rủi ro:** ảnh feed là ảnh sản phẩm của công ty; cần chắc được phép đăng công khai.
- **Rollback:** revert commit `feat(pika-social)`.
