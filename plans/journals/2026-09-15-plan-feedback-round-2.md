---
title: "Lập kế hoạch sửa portfolio theo feedback vòng 2"
summary: "Đo nhịp dọc bằng Playwright, tìm ra nguyên nhân gốc là style scoped ghi đè luật nhịp global, rồi lập kế hoạch 6 phase"
date: "2026-09-15"
---

# Lập kế hoạch sửa portfolio theo feedback vòng 2

## Bối cảnh

Feedback vòng 2 (`CV & Portfolio/feedback_round_2/`) có 17 mục, trong đó 9 mục là biến thể của
cùng một câu: "chỗ này trống quá" hoặc "chỗ này sát quá". Thay vì đọc feedback rồi đoán chỗ nào
cần sửa, mình mở dev server đang chạy ở `127.0.0.1:4321` và đo bằng Playwright, sau khi tắt reveal
animation (`opacity=1; transform=none`) để số đo không bị GSAP làm lệch.

Kết quả đo ở 1440×900:

| Cặp phần tử | Khoảng cách |
|---|---|
| Intro Content Strategy → lưới 7 thẻ | 0px |
| Ảnh minh hoạ → nút link file (3 section) | 130–149px |
| Marquee tools → tiêu đề dự án | 355px |
| Tiêu đề dự án → Branding & Positioning | 32px |
| Quote AI First → Contact | 387px |

Nhịp dọc chỉ có hai giá trị: 0px hoặc 160px, không có mức trung gian nào.

## Nguyên nhân gốc

`global.css` đặt nhịp bằng một luật duy nhất:

```css
.section > .container > * + * { margin-top: var(--section-y); }   /* độ đặc hiệu (0,2,0) */
```

Nhưng gần như mọi component đặt `margin: 0` trên phần tử gốc để xoá margin mặc định của
`<ul>`/`<ol>`: `.chain`, `.facts`, `.cards`, `.tools`, `.split`. Style scoped của Astro biên dịch
thành `.chain[data-astro-cid-xxx]` — cũng (0,2,0), nhưng nằm sau trong cascade nên thắng.

Xác nhận bằng `getComputedStyle(.chain).marginTop` → `0px`, trong khi phần tử anh em liền trước
(một `<div>` bọc `EvidenceCard`, không reset margin) vẫn nhận đủ 160px.

Nghĩa là: block nào là `<div>` thì cách 160px, block nào là `<ul>`/`<ol>` thì cách 0px. Sự phân bố
đó không do ai thiết kế, nó là tai nạn cascade — và nó giải thích được 5 trong 9 mục feedback về
khoảng cách.

## Quyết định

Không đi xoá `margin: 0` ở năm component. Làm vậy sẽ trả lại margin mặc định của trình duyệt ở
những vị trí khác và đẻ ra lỗi mới ở chỗ chưa ai phàn nàn. Thay vào đó thêm hai luật opt-in có độ
đặc hiệu cao hơn:

```css
.section > .container > * + .flow-related { margin-top: var(--space-related); }  /* (0,3,0) */
.section > .container > * + .flow-tight   { margin-top: var(--space-tight); }
```

(0,3,0) thắng (0,2,0) bất kể thứ tự cascade, nên sửa được mà không phải đụng vào style scoped của
component nào. Nhịp thành ba mức: `--space-block` 160px cho hai khối rời nhau, `--space-related`
~48px cho "văn bản dẫn → lưới thẻ", `--space-tight` ~32px cho "ảnh → link file".

## Một chi tiết đáng nhớ

Feedback ghi "Phần Branding & Positioning tách xa khỏi dự án nổi bật gần đây", nằm trong danh sách
có tiêu đề "Vị trí những khoảng trống". Đo ra 32px — cặp sát nhau nhất trang.

Mình đã suýt lập kế hoạch theo hướng ngược lại (hiểu là chỗ trống nằm ở nửa phải của tiêu đề dự
án, nên lấp bằng ảnh robot) vì cách đọc đó vừa khớp với tiêu đề "khoảng trống", vừa khớp với một
mục feedback khác. Hỏi lại chủ sở hữu thì ý đơn giản hơn nhiều: đang quá sát, cần giãn ra.

Bài học: khi số đo mâu thuẫn với chữ trong feedback, đừng chọn cách đọc nào khớp với giả định của
mình rồi đi tiếp. Chi phí một câu hỏi rẻ hơn nhiều so với làm ngược hẳn một mục rồi phải sửa lại.

## Ghi chú công cụ

`ak journal create` hỏng trên máy này: `journals: rename: invalid argument`. Repo nằm trên mount
`/mnt/01DAC8DEA845E9E0` (không phải ext4), nhiều khả năng CLI ghi file tạm rồi `rename` qua ranh
giới filesystem. Entry này viết tay theo đúng quy ước đặt tên `YYYY-MM-DD-<slug>.md`.

## Next steps

- Kế hoạch ở `plans/260915-2335-portfolio-feedback-round-2/` (plan.md + 6 phase), chạy bằng
  `/ak:cook`.
- Chốt chặn ở Phase 2: hai ảnh kênh Facebook mới có mặt trẻ em trong thumbnail reels. Phải hỏi
  chủ sở hữu đã xin phép chưa trước khi commit; fallback là thẻ link không ảnh như hiện tại.
- Phase 2 phải dựng ảnh trích sheet "Kịch bản dài" theo đúng quy trình openpyxl → HTML giả giao
  diện Sheets → chrome headless @2x → auto-crop, đã ghi ở journal vòng trước.
