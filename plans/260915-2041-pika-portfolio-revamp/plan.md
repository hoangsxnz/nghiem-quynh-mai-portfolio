---
title: "Portfolio Revamp theo Portfolio Guidelines — Robot Pika"
description: "Viết lại nội dung và bố cục portfolio theo file Portfolio guidelines: cover mới, About Me mới, gom toàn bộ phần dự án về một dự án Robot Pika có bằng chứng thật, AI First rút gọn, Contact mới."
status: done
priority: P1
effort: 19h
branch: "main"
tags: [astro, content-rewrite, portfolio, pika]
blockedBy: []
blocks: []
created: "2026-09-15T20:41:00+07:00"
createdBy: "ak:plan"
source: skill
---

# Portfolio Revamp theo Portfolio Guidelines — Robot Pika

## Overview

Nguồn yêu cầu: `CV & Portfolio/Portfolio guidelines/Portfolioguidelines.html` + 8 ảnh trong
`CV & Portfolio/Portfolio guidelines/images/`.

Web hiện tại (commit `21f996d`) có 9 section, trong đó 5 khối nội dung là case tự nghĩ hoặc thuộc
công ty cũ. Guidelines yêu cầu chuyển portfolio thành **một dự án nổi bật duy nhất — Robot dạy
tiếng Anh Pika** — với tư liệu thật (Google Sheets, ảnh chụp kênh, link TikTok/Facebook), đồng thời
viết lại Cover, About Me, AI First và Contact.

Cấu trúc đích (đã chốt với chủ sở hữu):

```
Cover (PORTFOLIO + tên + tagline mới)
About Me (2 polaroid trái, text phải)
Kinh nghiệm làm việc          (giữ nguyên nội dung)
Học vấn & Chứng chỉ           (phóng to, chuyển lên ngay sau Kinh nghiệm)
Kỹ năng (4 box cùng hàng) + Ngôn ngữ + Tools marquee
── DỰ ÁN NỔI BẬT GẦN ĐÂY: ROBOT DẠY TIẾNG ANH PIKA ──
   Branding & Positioning
   Content Strategy (Direction, Plan, Pillar, Angle, Calendar, KPI, Đo lường)
   Content Ads (Kịch bản mẫu)
   Social Media & Community
   Dự án UGC — Thử thách 30 ngày học cùng Pika
AI First (giữ nội dung, đổi bố cục, agent chỉ liệt kê tên)
Contact (bỏ section header, text canh giữa, thêm LinkedIn)
```

## Phases

| Phase | Name | Effort | Status | Blocked by asset |
|-------|------|--------|--------|------------------|
| 1 | [Foundation & Cleanup](./phase-01-foundation-cleanup.md) | 3h | Done | — |
| 2 | [Cover](./phase-02-cover.md) | 2h | Done | Ảnh profile |
| 3 | [About Me, Kinh nghiệm & Học vấn](./phase-03-about-education.md) | 3h | Done | 2 ảnh polaroid |
| 4 | [Pika: Branding, Strategy, Ads](./phase-04-pika-branding-strategy-ads.md) | 4h | Done | 3 file Excel |
| 5 | [Pika: Social & Community](./phase-05-pika-social-community.md) | 2.5h | Done | 1 file Excel |
| 6 | [Pika: UGC 30 ngày](./phase-06-pika-ugc.md) | 2h | Done | 2 file Excel |
| 7 | [AI First & Contact](./phase-07-ai-first-contact.md) | 1.5h | Done | — |
| 8 | [Motion, QA & Docs](./phase-08-motion-qa-docs.md) | 3h | Done | — |

Phase 1 → 8 chạy tuần tự. Phase 2–7 chỉ phụ thuộc Phase 1 về mặt code, nên nếu tư liệu Excel về
muộn thì làm 2, 3, 7 trước, 4–6 sau.

## Kết quả

Hoàn thành 2026-09-15. Báo cáo nghiệm thu:
`plans/reports/qa-260915-2123-pika-portfolio-revamp.md`.

Ba giả định trong kế hoạch bị thực tế bác bỏ, đã xử lý và ghi vào báo cáo:

- Cả 7 link Google đều đã công khai (HTTP 200), không còn 401.
- Hai file Sheets bị gán nhầm vai: nghiên cứu thương hiệu nằm trong "Robot Pika - Fanpage",
  chiến lược nội dung nằm trong "Robot Pika - Fanpage Facebook". Web dùng theo nội dung thật.
- Facebook chặn ảnh chụp tự động, nên fanpage và 2 kênh Facebook của phụ huynh dùng thẻ dẫn link
  (đúng phương án dự phòng đã định trong Phase 5/6). Hai kênh TikTok có ảnh chụp.

Hai câu hỏi mở của kế hoạch đã có trả lời: guidelines yêu cầu **giữ** câu CTA cuối trang (chỉ bỏ
khối tiêu đề section), và chủ sở hữu chọn phương án "chỉ mô tả phương pháp, không nêu số nội bộ".

## Key decisions

- **Xoá hẳn nội dung không phải Pika.** Bỏ section Content SEO, 3 case ngành F&B/B2B/Beauty,
  case study video Bodhi, community nội bộ Grand Nutrition/PJICO, tường Selected Works 8 ảnh,
  chiến dịch UGC "Món quà ẩn". Xoá cả file JSON và component tương ứng, không để code chết.
- **Tư liệu Google do chủ sở hữu tự export.** Cả 6 file Sheets/Docs trong guidelines đều trả
  HTTP 401 (private). Chủ sở hữu tự export/chụp và bỏ vào `assets-inbox/`; agent không đăng nhập
  Google. Xem `assets-inbox/README.md` cho danh sách chính xác.
- **Link công khai là điều kiện bắt buộc trước khi publish.** Nếu 6 file vẫn private, nút "Xem
  file" trên web sẽ dẫn tới trang xin quyền. Phase 8 có bước kiểm tra lại HTTP status của từng link.
- **Ảnh chụp kênh do agent tự chụp** bằng browser automation từ URL công khai (fanpage Pika,
  2 profile FB reels, 2 profile TikTok). Trang Facebook có thể dựng tường đăng nhập — fallback
  là link card không ảnh, ghi rõ trong phase 5/6.
- **Ảnh cá nhân chưa có.** Ảnh profile (tách nền + đổ bóng) và 2 ảnh polaroid About Me nằm trên
  Google Drive, chủ sở hữu sẽ đưa sau. Phase 2/3 dựng layout với ảnh hiện có làm placeholder và
  để lại một bước swap-in duy nhất.
- **Giữ nguyên kiến trúc hiện tại.** Astro 7.3, JSON-per-section trong `src/data/`, type trong
  `src/types/content-sections.ts`, ảnh qua `src/lib/image-map.ts`, motion GSAP/Lenis. Không thêm
  dependency mới. Mọi file giữ dưới 200 dòng.
- **Số liệu phải mô tả đúng sự thật.** Ảnh `image4.png` mà guidelines gọi là "biểu đồ tăng trưởng
  kênh" thực tế hiển thị 4.481.451 lượt xem kèm **-36,4% so với 32 ngày trước**. Caption trên web
  sẽ ghi trung thực là tổng quan hiệu suất 1 tháng, không gọi là tăng trưởng. Xem Phase 5.

## Acceptance criteria (toàn kế hoạch)

1. Mọi gạch đầu dòng trong `Portfolioguidelines.html` đều có một dòng tương ứng trong một phase,
   hoặc được ghi rõ lý do không làm.
2. `pnpm build` và `pnpm check` sạch lỗi; trang build ra 0 KB JS ngoài lớp motion hiện có.
3. Không còn chuỗi `[PLACEHOLDER` nào trong `src/data/*.json` khi phase 8 đóng.
4. Không còn nội dung không phải Pika trong phần dự án.
5. Mọi link ngoài mở được (HTTP 200) hoặc bị gỡ khỏi web, không có link chết.
6. Responsive 390px → 1440px không tràn ngang; `prefers-reduced-motion` tắt hiệu ứng.

## Non-goals

- Không đổi hệ design token, font, hay phong cách paper-cut.
- Không dựng CMS, không thêm trang thứ hai, không đổi hosting.
- Không tự suy diễn số liệu hiệu quả (reach, retention, doanh số) khi không có bằng chứng.

## Open questions

- Guidelines viết "Bỏ textbox 09/keep in touch, tiêu đề KEEP IN TOUCH, subtitle *Let's make magic
  happen* trên đầu trang". Kế hoạch hiểu là **bỏ khối tiêu đề section ở đầu phần Contact**, giữ
  câu CTA cuối trang. Nếu ý là bỏ luôn câu CTA thì Phase 7 phải sửa.
- Chưa rõ có được công bố công khai nội dung 6 file Google của Step Up Education hay không
  (dữ liệu nội bộ của công ty). Cần xác nhận trước Phase 8.
