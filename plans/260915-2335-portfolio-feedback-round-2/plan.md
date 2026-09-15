---
title: "Portfolio — Sửa web theo feedback vòng 2"
description: "Xử lý 17 mục feedback vòng 2: sửa nhịp dọc toàn trang (khoảng trống), đổ bóng + viền ảnh bìa, thêm ảnh Robot Pika tách nền, đổi ảnh kịch bản Ads sang bản dài, gom bố cục Feed và UGC, thay 2 kênh Facebook, và sửa 4 cụm chữ."
status: done
priority: P1
effort: "9h"
branch: "main"
tags: [astro, layout, spacing, content-fix, portfolio, pika]
blockedBy: []
blocks: []
created: "2026-09-15T23:35:00+07:00"
createdBy: "ak:plan"
source: skill
---

# Portfolio — Sửa web theo feedback vòng 2

## Overview

Nguồn yêu cầu: `CV & Portfolio/feedback_round_2/feedback/Portfolioguidelines.html` + 6 ảnh trong
`CV & Portfolio/feedback_round_2/feedback/images/`.

Web hiện tại (commit `ed41afb`) đã đúng nội dung vòng 1. Feedback vòng 2 không đòi viết lại nội
dung, mà đòi **sửa nhịp và bố cục**: lấp các khoảng trống lớn, gom những khối đang bị kéo giãn, và
thay 5 tư liệu ảnh. Kèm theo là 4 chỉnh sửa chữ nhỏ.

### Nguyên nhân gốc của các khoảng trống

`global.css` đặt nhịp dọc bằng một luật duy nhất:

```css
.section > .container > * + * { margin-top: var(--section-y); }   /* 160px @1440 */
```

Nhưng phần lớn component đặt `margin: 0` trên phần tử gốc của mình (`.chain`, `.facts`, `.cards`,
`.tools`, `.split`). Style scoped của Astro có cùng độ đặc hiệu nhưng đứng sau trong cascade, nên
`margin: 0` thắng. Hệ quả đo được ở 1440px:

| Cặp phần tử | Khoảng cách thực | Feedback |
|---|---|---|
| Intro Content Strategy → lưới 7 thẻ | **0px** | "text box quá gần cụm văn bản phía trên" |
| Ảnh minh hoạ → nút link file (3 section) | **130–149px** | "đặt link gần hơn với ảnh minh hoạ" |
| Marquee tools → tiêu đề dự án | **355px** | "trống giữa dòng tools và Dự án nổi bật" |
| Tiêu đề dự án → Branding & Positioning | **32px** | "Branding tách xa" → cần **giãn ra** |
| Quote AI First → Contact | **387px** | "khoảng trống quá nhiều giữa Contact và quote" |

Tức là nhịp dọc hiện tại chỉ có hai giá trị: 0px hoặc 160px, không có mức trung gian. Phase 3 lập
lại một hợp đồng nhịp ba mức và áp dụng nhất quán, thay vì vá từng chỗ bằng số lẻ.

## Ánh xạ feedback → phase

| # | Feedback | Phase |
|---|---|---|
| 1 | Đổ bóng + viền nét ảnh profile trang bìa | 3 |
| 2 | Trống góc phải giữa Bìa và About me | 3 |
| 3 | Trống giữa marquee tools và "Dự án nổi bật gần đây" | 3 |
| 4 | Branding & Positioning quá sát mục trên, cần giãn | 3 |
| 5 | Link file Excel (Branding + Strategy) gần ảnh minh hoạ hơn | 3 |
| 6 | Text box Content Strategy quá gần văn bản trên | 3 |
| 7 | Link bài mẫu Content Ads gần ảnh minh hoạ hơn | 3 |
| 8 | Trống quá nhiều giữa Contact và quote trên | 3 |
| 9 | Làm mục Ngôn ngữ nổi bật hơn | 3 |
| 10 | Thêm ảnh Robot Pika tách nền cạnh tiêu đề dự án | 2 + 3 |
| 11 | Content Ads: đổi ảnh sang kịch bản dài | 2 + 4 |
| 12 | Social: 2 ảnh Feed xếp chồng, rút ngắn bố cục | 4 |
| 13 | Social: thay cụm văn bản -36,4% bằng đánh giá khách quan | 1 |
| 14 | UGC: 4 text box bên phải, 2 ảnh xếp chồng bên trái | 5 |
| 15 | UGC: bỏ cụm văn bản giải thích Facebook login | 5 |
| 16 | UGC: 2 link TikTok + 2 link Facebook mới thay bằng link + ảnh kênh | 2 + 5 |
| 17 | AI First: bỏ 1 câu, thay câu ranh giới; Contact: đổi xưng hô | 1 |

## Phases

| Phase | Tên | Effort | Phụ thuộc | Chặn bởi tư liệu |
|---|---|---|---|---|
| 1 | [Chữ & dữ liệu](./phase-01-copy-fixes.md) | 0.5h | — | — |
| 2 | [Tư liệu ảnh](./phase-02-assets.md) | 2.5h | — | 5 ảnh feedback + `Kịch bản Ads mẫu.xlsx` |
| 3 | [Bìa & nhịp dọc](./phase-03-cover-and-rhythm.md) | 3h | 2 (ảnh robot) | — |
| 4 | [Content Ads & Social](./phase-04-ads-social-layout.md) | 1.5h | 2 (ảnh kịch bản dài) | — |
| 5 | [UGC & kênh](./phase-05-ugc-layout.md) | 1.5h | 2 (4 ảnh kênh) | — |
| 6 | [QA & docs](./phase-06-qa-docs.md) | 1h | 1–5 | — |

Phase 1 và 2 chạy được song song và không đụng file nhau. Phase 3, 4, 5 đều cần Phase 2 xong về
tư liệu. Phase 6 chạy cuối.

**Hai ràng buộc về quyền sở hữu file — đọc trước khi chia việc song song:**

- `src/data/social.json`: Phase 1 sửa `statsNote`, Phase 4 sửa `blocks[2]` và caption ảnh feed.
  Chạy Phase 1 xong trước Phase 4.
- `src/types/content-sections.ts`: Phase 4 thêm `stack?: boolean` vào `SocialBlock`, Phase 5 xoá
  `channelNote` khỏi `UgcContent`. Chạy Phase 4 và 5 tuần tự, hoặc để cùng một người làm cả hai.

Phase 3 sở hữu toàn bộ CSS và markup bố cục, không đụng file dữ liệu nào, nên chạy song song với
Phase 4 hoặc 5 được — trừ `content-ads.astro` và `ai-first.astro`, nơi Phase 3 chỉ sửa khoảng
cách còn nội dung nằm trong JSON của phase khác.

## Acceptance criteria

Đo ở viewport 1440×900, sau khi tắt reveal animation:

1. **Nhịp dọc** — mọi cặp "văn bản giới thiệu → lưới thẻ ngay dưới nó" cách nhau 40–80px, không
   còn cặp nào 0px.
2. **Link file** — khoảng cách từ ảnh minh hoạ cuối tới nút link file ≤ 48px, và nhỏ hơn khoảng
   cách từ nút link tới section kế tiếp ít nhất 3 lần.
3. **Marquee → tiêu đề dự án** — ≤ 160px (hiện 355px).
4. **Tiêu đề dự án → Branding** — 120–200px (hiện 32px).
5. **Quote AI First → Contact** — ≤ 200px (hiện 387px).
6. **Bìa** — ảnh profile có viền sáng ≥ 2px bám theo silhouette và bóng đổ thấy rõ trên nền
   `--paper`; nửa phải giữa đáy ảnh và header About Me không còn dải trống cao hơn 120px.
7. **Chiều cao trang** — giảm so với mốc hiện tại 26.600px, không tăng.
8. **Không hồi quy** — `pnpm check` và `pnpm build` sạch; không tràn ngang ở 390 / 768 / 1440px;
   19+ ảnh vẫn đủ `alt`; thứ tự heading không nhảy cấp.

## Ranh giới phạm vi

- Không viết lại nội dung ngoài 4 cụm chữ feedback nêu đích danh. Các chỗ khác vẫn xưng "mình"
  (About Me, Branding, UGC) vì feedback chỉ yêu cầu đổi ở Contact.
- Không thêm thư viện mới. Vẫn chỉ GSAP + Lenis.
- Không đổi màu, font, hay bộ token. Chỉ đổi giá trị khoảng cách và bố cục.
- Không đụng vào 13 ảnh mồ côi từ vòng trước; đó vẫn là quyết định của chủ sở hữu.

## Rủi ro

| Rủi ro | Mức | Xử lý |
|---|---|---|
| Ảnh kênh Facebook có mặt trẻ em trong thumbnail reels | Cao | Phase 2 dừng lại hỏi chủ sở hữu trước khi đưa lên web. Fallback: thẻ link không ảnh, như hiện tại. |
| Sửa luật nhịp trong `global.css` làm xê dịch toàn trang | Trung bình | Phase 3 đo trước/sau ở cả 9 section, không chỉ 5 chỗ feedback nêu. |
| Ảnh Feed xếp chồng gây tràn ngang ở 390px | Trung bình | Chỉ xếp chồng từ 900px trở lên; dưới đó về xếp dọc như cũ. |
| Viền nét bằng chuỗi `drop-shadow` tốn GPU khi scroll | Thấp | Ảnh bìa là ảnh tĩnh duy nhất dùng filter; đo lại FPS lúc scroll ở Phase 6. |

## Câu hỏi đã chốt với chủ sở hữu

- "Branding & Positioning tách xa khỏi dự án nổi bật" nghĩa là đang **quá sát** mục trên và cần
  giãn ra theo chiều dọc, không phải đang cách quá xa.
- Cụm văn bản -36,4% thay bằng mô tả trung tính vẫn giữ nguyên con số, không giải thích dấu trừ.
