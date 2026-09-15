---
phase: 4
title: "Content Ads & Social Media"
status: done
effort: "1.5h"
dependencies: [2]
---

# Phase 4: Content Ads & Social Media

## Context

Hai mục feedback về tư liệu và bố cục:

- Content Ads đang hiển thị ảnh trích sheet **"Kịch bản ngắn"**, feedback muốn đổi sang **"Kịch
  bản dài"**.
- Khối Feed trong Social Media đang xếp hai ảnh polaroid dọc thành một cột cao 1.778px, để trống
  gần trọn nửa trái. Feedback muốn hai ảnh **xếp chồng lên nhau** để rút ngắn bố cục.

Câu chữ `statsNote` thuộc Phase 1, không làm lại ở đây.

## Requirements

### 4.1 Content Ads — đổi sang ảnh kịch bản dài

`src/data/ads.json` → `evidence[0]`:

```json
{
  "src": "pika-ads-script-long.png",
  "alt": "Trích kịch bản quảng cáo bản dài của Robot Pika",
  "caption": "Sheet \"Kịch bản dài\": mỗi phân cảnh ghi đủ thoại, hướng dẫn hình ảnh và text hiển thị trên màn hình."
}
```

Caption phải nói đúng số phân cảnh có trong ảnh Phase 2 dựng ra — nếu ảnh chỉ trích 6 phân cảnh
đầu thì caption không được viết "18 phân cảnh". Đối chiếu lại sau khi có ảnh.

`intro` giữ nguyên: nó đang mô tả cả hai bản (dài 18 phân cảnh, ngắn 5 phân cảnh) và vẫn đúng.

Sau khi đổi xong, xoá `src/assets/images/pika/pika-ads-script.png` — ảnh này chỉ mồ côi vì thay
đổi của lần này.

### 4.2 Social Media — xếp chồng hai ảnh Feed

Khối Feed là `blocks[2]` trong `social.json`, hai ảnh `pika-feed-01.jpg` và `pika-feed-02.jpg`,
render qua `.block__media` (flex, wrap, gap). Ở 1440px cột media rộng 7fr nhưng mỗi polaroid rộng
420px + khung, nên chúng wrap thành hai hàng.

Thêm biến thể xếp chồng cho riêng khối này:

- Thêm cờ `stack: true` vào `blocks[2]` trong `social.json`, và field tương ứng trong
  `SocialBlock` (`stack?: boolean`).
- Trong `social-community.astro`, khi `block.stack`, gắn class `block__media--stack`.
- CSS (chỉ từ 900px trở lên):

```css
.block__media--stack {
  display: grid;
  place-items: start center;
}
.block__media--stack > * {
  grid-area: 1 / 1;                 /* hai ảnh chồng cùng ô */
}
.block__media--stack > :last-child {
  translate: 18% 12%;               /* lệch để lộ ảnh dưới, giữ cảm giác xếp giấy */
  z-index: 1;
}
```

- Dưới 900px giữ nguyên hành vi hiện tại (xếp dọc, không chồng) — chồng ảnh ở 390px sẽ che gần
  hết ảnh dưới và dễ tràn ngang.
- Giảm chiều rộng mỗi ảnh Feed từ 420 → 360px để cụm chồng vừa trong cột media.
- Hover: ảnh trên đã có `rotate: 0` + `scale: 1.03` từ `polaroid.astro`; thêm `z-index: 2` khi
  hover để ảnh dưới nổi lên được khi người xem rê chuột vào nó.

Mục tiêu đo được: chiều cao khối Feed giảm từ 1.778px xuống ≤ 1.100px.

### 4.3 Caption của hai ảnh Feed

Khi hai ảnh chồng nhau, hai caption riêng ("Feed fanpage — các trụ cột…" và "Feed fanpage — phần
tiếp theo") sẽ đè lên nhau. Bỏ caption của ảnh thứ hai (`pika-feed-02.jpg`), giữ caption ảnh đầu
và sửa thành: "Feed fanpage — các trụ cột nội dung xen kẽ theo nhịp đã định". Ảnh thứ hai vẫn giữ
nguyên `alt` để người dùng screen reader biết đó là phần tiếp theo của lưới feed.

## Files owned

- `src/data/ads.json`
- `src/data/social.json` *(chỉ `blocks[2]` và caption ảnh feed; `statsNote` thuộc Phase 1 — hai
  phase đụng cùng file này nên chạy Phase 1 trước, hoặc gộp hai thay đổi vào một lần sửa)*
- `src/components/sections/social-community.astro`
- `src/types/content-sections.ts` *(thêm `stack?: boolean` vào `SocialBlock`)*
- `src/assets/images/pika/pika-ads-script.png` (xoá)

## Steps

1. Chờ Phase 2 giao `pika-ads-script-long.png`.
2. Đổi `evidence[0]` trong `ads.json`, đối chiếu caption với nội dung ảnh thật.
3. Thêm `stack?: boolean` vào type, bật cờ cho `blocks[2]`.
4. Viết CSS xếp chồng trong `social-community.astro`, kiểm ở 1440 / 900 / 899 / 390px.
5. Sửa caption ảnh feed.
6. Xoá `pika-ads-script.png`, chạy `pnpm build` để chắc không còn chỗ nào tham chiếu.
7. `pnpm check && pnpm build`.

## Validation

- Ảnh Content Ads trên web là bản dài; caption khớp đúng số phân cảnh trong ảnh.
- `grep -rn "pika-ads-script.png" src/` → rỗng.
- Chiều cao khối Feed ≤ 1.100px ở 1440px (hiện 1.778px).
- Ở 899px trở xuống: hai ảnh Feed xếp dọc, không chồng, không tràn ngang.
- Ở 390px: `scrollWidth === clientWidth`.
- Hover từng ảnh trong cụm chồng đều đưa được ảnh đó lên trên.
- `pnpm check && pnpm build` sạch.

## Risk & rollback

- **Rủi ro tràn ngang:** cụm chồng dùng `translate` nên phần lệch có thể chọc ra ngoài cột. Kiểm
  `scrollWidth` ở cả 3 breakpoint; nếu tràn thì giảm độ lệch từ 18% xuống 12%.
- **Rủi ro caption sai sự thật:** caption ảnh Ads phải khớp đúng nội dung ảnh Phase 2 dựng, không
  chép lại mô tả của bản ngắn.
- **Rollback:** revert commit `fix(ads-social)`; khôi phục `pika-ads-script.png` từ git.
