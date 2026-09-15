---
phase: 3
title: "Bìa & nhịp dọc"
status: done
effort: "3h"
dependencies: [2]
---

# Phase 3: Bìa & nhịp dọc

## Context

Phase lớn nhất: 9 trong 17 mục feedback đều là khoảng cách dọc hoặc chỗ trống. Sửa từng chỗ bằng
số lẻ sẽ để lại một trang không có nhịp. Phase này lập lại **một hợp đồng nhịp ba mức** rồi áp
dụng, nên mọi chỗ feedback nêu được sửa bằng cùng một cơ chế.

Nhắc lại nguyên nhân gốc (đo ở 1440px): `global.css` đặt nhịp bằng
`.section > .container > * + * { margin-top: var(--section-y) }` (0,2,0 độ đặc hiệu), còn các
component đặt `margin: 0` trên phần tử gốc — cùng độ đặc hiệu nhưng đứng sau trong cascade nên
thắng. Kết quả: nhịp chỉ có 0px hoặc 160px.

## Requirements

### 3.1 Hợp đồng nhịp ba mức

Thêm vào `tokens.css`:

```css
--space-block:   var(--section-y);              /* hai khối không liên quan  ~160px */
--space-related: clamp(2rem, 4vw, 3.5rem);      /* văn bản dẫn → lưới thẻ     ~48px */
--space-tight:   var(--gap);                    /* ảnh → link file            ~32px */
```

Thêm vào `global.css`, ngay sau luật nhịp hiện có:

```css
.section > .container > * + .flow-related { margin-top: var(--space-related); }
.section > .container > * + .flow-tight   { margin-top: var(--space-tight); }
```

Hai luật này có độ đặc hiệu (0,3,0), cao hơn `margin: 0` của component (0,2,0), nên thắng mà không
phải sửa style scoped của từng component. Đây là lý do chọn cách này thay vì đi xoá `margin: 0`
ở năm chỗ — xoá sẽ làm `<ul>`/`<ol>` lấy lại margin mặc định của trình duyệt ở những vị trí khác.

Áp dụng:

| Phần tử | Class thêm vào | Trước | Sau (mục tiêu) |
|---|---|---|---|
| `<ol class="chain">` trong `chain-steps.astro` | `flow-related` | 0px | 40–56px |
| `<div>` bọc `FileLink` trong `branding-positioning.astro` | `flow-tight` | 130px | ~32px |
| `<div>` bọc `FileLink` trong `content-strategy.astro` | `flow-tight` | 137px | ~32px |
| `<div>` bọc `FileLink` trong `content-ads.astro` | `flow-tight` | 149px | ~32px |

Sau khi sửa, khoảng cách từ nút link file tới section kế tiếp vẫn là 185px, nên tỷ lệ trên:dưới
đạt khoảng 1:5.8 — nút link đọc ra là phần đuôi của khối ảnh, đúng ý "đặt link gần hơn với ảnh
minh hoạ".

### 3.2 Marquee tools → tiêu đề dự án (355px → ≤160px)

`about-me.astro` đang có `section > :global(.marquee) { margin-block: var(--section-y) }`, trong
khi `project-group.astro` lại có `padding-block: var(--section-y) 0` — hai khoảng cách cộng dồn.

Bỏ margin dưới của marquee: `margin-block: var(--section-y) 0`. Khoảng cách còn lại do
`.group__header` cung cấp.

### 3.3 Branding & Positioning giãn khỏi tiêu đề dự án (32px → 120–200px)

`project-group.astro` có:

```css
.group > :global(section:first-of-type) { padding-top: var(--gap); }
```

Đổi `var(--gap)` → `var(--section-y)`. Chủ sở hữu đã xác nhận ý feedback là Branding đang **quá
sát** mục trên và cần giãn ra, không phải đang cách quá xa.

### 3.4 Quote AI First → Contact (387px → ≤200px)

387px là tổng của: padding dưới `#ai-first` (160px) + chiều cao torn divider + padding trên
`#contact` (160px). Giảm cả hai đầu, không giảm một đầu:

```css
/* ai-first.astro */  #ai-first.section { padding-bottom: clamp(2rem, 5vw, 4rem); }
/* contact-end.astro */ #contact.section { padding-top: clamp(2rem, 5vw, 4rem); }
```

Không đụng `.closing` (câu "Keep in touch…") — nó đang có `margin-top: var(--section-y)` cố ý và
feedback không nhắc tới.

### 3.5 Bìa — đổ bóng và viền nét ảnh profile

Tham chiếu `image4.png`: silhouette có viền sáng mỏng bám theo đường biên, cộng bóng xám mềm lệch
xuống phải. Ảnh hiện tại chỉ có `drop-shadow(0 18px 24px rgba(26,26,26,.28))`, gần như chìm vào
nền `--paper`.

Dựng viền bằng chuỗi `drop-shadow` (mỗi filter áp lên kết quả của filter trước, nên lặp lại sẽ
dày dần), rồi mới tới bóng:

```css
.hero__cutout {
  filter:
    drop-shadow(0 0 1.5px var(--white))
    drop-shadow(0 0 1.5px var(--white))
    drop-shadow(0 0 1.5px var(--white))
    drop-shadow(10px 16px 22px rgba(26, 26, 26, .30));
}
```

Không dùng `outline`, `border` hay `box-shadow`: ảnh là PNG trong suốt, ba thứ đó bám vào hộp chữ
nhật chứ không bám silhouette.

### 3.6 Bìa — lấp chỗ trống góc phải giữa Bìa và About me

Hiện có dải trống cao ~760px ở nửa phải, giữa đáy ảnh profile (y≈1096) và sticker "01 / About Me"
(y≈1857). Dùng ba đòn bẩy, đo lại sau mỗi đòn, dừng khi đạt mục tiêu ≤120px:

1. `.hero__media { align-self: end }` và tăng chiều rộng ảnh từ 420 → 480px, để ảnh xuống sát
   torn divider hơn.
2. Giảm padding trên của About: `#about.section { padding-top: clamp(2.5rem, 6vw, 5rem) }`.
3. Đưa `.hero__cue` ("Cuộn để khám phá") về cột trái, ngay dưới `.hero__links`, thay vì canh giữa
   toàn section — chỗ giữa trang hiện tại là một dòng chữ lẻ loi giữa hai khoảng trống.

Không đổi thứ tự đọc (ảnh vẫn ở cột phải, chữ cột trái) và không đổi bố cục "2 polaroid trái, text
phải" của About Me — cả hai đã được duyệt ở vòng 1.

### 3.7 Ảnh Robot Pika cạnh tiêu đề dự án

`project-group.astro` hiện là một cột chữ chiếm nửa trái, nửa phải trống hoàn toàn. Đổi
`.group__header` thành lưới 2 cột:

- Trái: sticker + `h2` + subtitle (như cũ).
- Phải: `pika-robot-cutout.png` từ Phase 2, `justify-self: end`, `width: clamp(180px, 22vw, 320px)`,
  `data-parallax="0.08"` cho khớp với ảnh bìa.
- Ảnh là trang trí lặp lại tiêu đề đã có chữ, nên `alt=""` + `aria-hidden="true"`.
- Dưới 900px: lưới về 1 cột, ảnh xuống dưới subtitle, rộng 140px, canh giữa.

Truyền tên file qua prop từ `index.astro` (`photo="pika-robot-cutout.png"`), không import asset
trực tiếp trong markup — giữ đúng quy ước của `src/lib/image-map.ts`.

### 3.8 Làm mục Ngôn ngữ nổi bật hơn

`skills-grid.astro` đang render Ngôn ngữ bằng `<dl>` phẳng, nằm ngay dưới bốn thẻ Kỹ năng đầy
sticker, nên đọc ra như phần chú thích.

Đổi thành ba thẻ cùng ngôn ngữ thiết kế với lưới Kỹ năng:

- Lưới `repeat(auto-fit, minmax(min(100%, 14rem), 1fr))`, 3 thẻ một hàng ở desktop.
- Mỗi thẻ: tên ngôn ngữ bằng `--font-display` cỡ `--fs-h3` màu `--red`, mức độ bằng `Sticker`
  `tone="maroon"`.
- Nền `--paper-2`, `box-shadow: var(--shadow)`, `rotate: var(--tilt-*)` luân phiên như thẻ Kỹ năng.
- Giữ nguyên `<dl>/<dt>/<dd>` về mặt ngữ nghĩa (cặp tên — mức độ), chỉ đổi cách trình bày.

## Files owned

- `src/styles/tokens.css`
- `src/styles/global.css`
- `src/components/sections/hero-cover.astro`
- `src/components/sections/about-me.astro`
- `src/components/sections/about/skills-grid.astro`
- `src/components/sections/project-group.astro`
- `src/components/sections/strategy/chain-steps.astro`
- `src/components/sections/branding-positioning.astro`
- `src/components/sections/content-strategy.astro`
- `src/components/sections/content-ads.astro` *(chỉ thêm class `flow-tight`; nội dung ảnh Ads
  thuộc Phase 4 và nằm trong `ads.json`, không đụng nhau)*
- `src/components/sections/ai-first.astro` *(chỉ padding dưới; chữ thuộc Phase 1 và nằm trong
  `ai-first.json`)*
- `src/components/sections/contact-end.astro`
- `src/pages/index.astro`

## Steps

1. Ghi lại số đo hiện tại của cả 9 section (script đo đã dùng khi lập kế hoạch) làm mốc so sánh.
2. Thêm 3 token + 2 luật `flow-*` vào `tokens.css` / `global.css`.
3. Gắn `flow-related` / `flow-tight` vào 4 chỗ ở mục 3.1, đo lại.
4. Sửa marquee (3.2), first-of-type (3.3), padding AI First + Contact (3.4), đo lại.
5. Sửa filter ảnh bìa (3.5), so mắt với `image4.png`.
6. Làm 3.6 theo từng đòn bẩy, đo lại sau mỗi đòn.
7. Thêm ảnh robot vào `project-group.astro` (3.7).
8. Dựng lại khối Ngôn ngữ (3.8).
9. Đo lại toàn bộ 9 section, đối chiếu mốc ở bước 1 để chắc không có section nào bị xê dịch ngoài
   ý muốn.
10. `pnpm check && pnpm build`.

## Validation

Đo ở 1440×900 sau khi tắt reveal animation:

- Intro Content Strategy → lưới thẻ: 40–80px (hiện 0px).
- Ảnh minh hoạ → nút link file, cả 3 section: ≤ 48px (hiện 130–149px).
- Marquee → tiêu đề dự án: ≤ 160px (hiện 355px).
- Tiêu đề dự án → Branding: 120–200px (hiện 32px).
- Quote AI First → Contact: ≤ 200px (hiện 387px).
- Dải trống nửa phải giữa đáy ảnh bìa và header About Me: ≤ 120px.
- Ảnh bìa: viền sáng dày ≥ 2px nhìn thấy trên nền `--paper`; bóng lệch xuống phải.
- Ảnh robot hiển thị cạnh tiêu đề dự án ở ≥ 900px, xuống dưới ở < 900px, không tràn ngang ở 390px.
- Khối Ngôn ngữ: 3 thẻ một hàng ở 1440px, 1 cột ở 390px.
- Chiều cao trang giảm so với mốc 26.600px.
- `pnpm check && pnpm build` sạch; không tràn ngang ở 390 / 768 / 1440px.

## Risk & rollback

- **Rủi ro lan rộng:** hai luật `flow-*` chỉ tác động lên phần tử được gắn class, nên không thể
  ảnh hưởng section khác. Ngược lại, sửa `--section-y` hay luật `* + *` gốc thì có — vì vậy kế
  hoạch này không đụng vào chúng.
- **Rủi ro hiệu năng:** chuỗi 4 `drop-shadow` trên một ảnh 480px là chi phí GPU một lần lúc vẽ,
  không lặp theo frame vì ảnh bìa không animate. Vẫn đo FPS lúc scroll ở Phase 6.
- **Rollback:** revert commit `fix(layout)`; các thay đổi đều nằm trong CSS và markup, không đụng
  dữ liệu.
