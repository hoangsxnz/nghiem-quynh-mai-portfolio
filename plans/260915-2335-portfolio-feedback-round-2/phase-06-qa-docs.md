---
phase: 6
title: "QA & docs"
status: done
effort: "1h"
dependencies: [1, 2, 3, 4, 5]
---

# Phase 6: QA & docs

## Context

Vòng trước đã có một báo cáo QA đầy đủ (`plans/reports/qa-260915-2123-pika-portfolio-revamp.md`).
Phase này chạy lại đúng bộ kiểm đó để bắt hồi quy, cộng thêm phần đo khoảng cách vì lần này thay
đổi chủ yếu là nhịp dọc.

## Requirements

### 6.1 Đối chiếu 17 mục feedback

Lập bảng: mỗi mục feedback → trạng thái (xong / bỏ qua kèm lý do) → bằng chứng (số đo, ảnh chụp,
hoặc lệnh `grep`). Mục nào bỏ qua phải ghi rõ lý do, không để trống.

### 6.2 Kiểm kỹ thuật

| Hạng mục | Cách kiểm | Ngưỡng |
|---|---|---|
| Type | `pnpm check` | 0 lỗi, 0 cảnh báo |
| Build | `pnpm build` | thành công |
| Console | mở trang, đọc console | 0 lỗi |
| Tràn ngang | `scrollWidth` vs `clientWidth` ở 390 / 768 / 1440px | bằng nhau |
| Chiều cao trang | so với mốc 26.600px | giảm, không tăng |
| `alt` ảnh | đếm `<img>` có `alt` | 100% |
| Thứ tự heading | duyệt h1→h4 | không nhảy cấp |
| `aria-labelledby` | 9 section trỏ tới id tồn tại | 9/9 |
| Anchor nav | bấm từng mục nav | 9/9 đúng section |
| `prefers-reduced-motion` | bật rồi tải lại | nội dung hiện đủ, không animation |
| FPS lúc scroll | ghi profile ngắn ở màn bìa | không tụt dưới 50fps vì chuỗi `drop-shadow` |
| Dung lượng ảnh trang | tổng sau nén | ≤ 4MB, mỗi ảnh ≤ 300KB |
| Ảnh mồ côi do lần này | `grep` tên file trong `src/` | `pika-ads-script.png` đã xoá |

### 6.3 Đo lại toàn bộ nhịp

Chạy lại script đo của Phase 3 trên cả 9 section, đưa bảng trước/sau vào báo cáo. Bất kỳ section
nào xê dịch quá 10% mà không nằm trong danh sách feedback đều phải giải thích được.

### 6.4 Cập nhật docs

`docs/content-source.md`:

- Bảng **Screenshots**: thêm dòng cho `pika-robot-cutout.png`, `pika-ads-script-long.png`,
  `ugc-channel-fb-01.png`, `ugc-channel-fb-02.png`; cập nhật nguồn của `ugc-channel-tt-01.png`,
  `-02.png` sang ảnh feedback vòng 2; bỏ dòng `pika-ads-script.png`.
- Câu "Facebook serves a login wall to an automated browser, so the fanpage and the two parent
  Reels profiles are link cards without a screenshot" — không còn đúng cho hai kênh phụ huynh.
  Sửa lại: fanpage Pika vẫn là thẻ link, hai kênh phụ huynh giờ có ảnh do chủ sở hữu tự chụp.
- Mục **Numbers rule**: câu cuối đang mô tả cách diễn giải -36,4%. Cập nhật theo câu mới của
  Phase 1, giữ nguyên nguyên tắc "chỉ đưa con số có trong file nguồn".
- Ghi nhận hai kênh Facebook cũ đã bị thay bằng hai kênh mới.

Không đụng `docs/design-guidelines.md` trừ khi hợp đồng nhịp ba mức của Phase 3 mâu thuẫn với
những gì đang ghi ở đó — nếu có, cập nhật đúng phần khoảng cách.

### 6.5 Báo cáo

Viết `plans/reports/qa-260915-2335-portfolio-feedback-round-2.md` gồm: bảng đối chiếu 17 mục,
bảng đo nhịp trước/sau, bảng kiểm kỹ thuật, phần riêng tư (ảnh kênh phụ huynh đã được duyệt hay
chưa), và các câu hỏi còn treo.

## Files owned

- `docs/content-source.md`
- `plans/reports/qa-260915-2335-portfolio-feedback-round-2.md` (tạo)
- `plans/260915-2335-portfolio-feedback-round-2/*.md` (cập nhật `status`)

## Steps

1. Chạy `pnpm check && pnpm build`.
2. Chạy script đo nhịp trên 9 section, so với mốc Phase 3 bước 1.
3. Kiểm tràn ngang và chiều cao trang ở 3 breakpoint.
4. Kiểm a11y: alt, heading, aria, nav, reduced-motion.
5. Đo FPS lúc scroll màn bìa.
6. Đối chiếu 17 mục feedback.
7. Cập nhật `docs/content-source.md`.
8. Viết báo cáo QA, đổi `status` của 6 phase sang `done`.

## Validation

- Mọi ngưỡng ở bảng 6.2 đạt.
- 17/17 mục feedback có trạng thái và bằng chứng.
- `docs/content-source.md` không còn câu nào sai so với web thật (kiểm từng dòng bảng screenshot
  bằng cách mở đúng file ảnh đó).
- Báo cáo QA tồn tại và liệt kê được câu hỏi còn treo.

## Risk & rollback

- Phase này chỉ đọc và viết tài liệu, không đổi hành vi web. Nếu phát hiện hồi quy thì quay lại
  phase tương ứng, không vá trong phase này.
