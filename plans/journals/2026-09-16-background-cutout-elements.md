---
title: "Tách nền 18 element và rải vào background của portfolio"
summary: "Hai kỹ thuật tách nền khác nhau cho hai loại ảnh, rồi một component Decor đặt cut-out vào lớp nền của 9 section"
date: "2026-09-16"
---

# Tách nền 18 element và rải vào background của portfolio

## Bối cảnh

Thư mục `CV & Portfolio/elements/` có 33 file JPG, nhưng `md5sum` cho thấy chỉ có 19 ảnh thật —
phần còn lại là bản sao `(1)`. Đây là bộ sticker tông đỏ sưu tầm: sao, loa phóng thanh, ống nghe
điện thoại, kẹp giấy, ghim băng, vé giấy, mèo, sparkle, mũi tên, nét vẽ tay. Tất cả đều là JPG nền
trắng, nên muốn dùng làm element nền thì phải tách nền trước.

## Tách nền: một cách không đủ

Cách mặc định — flood fill alpha từ bốn góc với `-fuzz` — chạy đúng cho 15/19 ảnh. Nó giữ được
phần trắng *bên trong* chủ thể (thân loa màu kem, mắt mèo, ô kem trong vải kẻ) vì flood fill chỉ
lan từ vùng nối với góc ảnh.

Ba ảnh không chạy được bằng cách đó:

| Ảnh | Vấn đề |
|---|---|
| `IMG_7664` dấu chấm than | Nền trắng dính liền với tờ giấy trắng mà dấu ! nằm trên |
| `IMG_7677` sợi chỉ | Vòng tròn khép kín giữ lại một đốm trắng không nối ra góc |
| `IMG_7678` nét khoanh tròn | Nền là ô caro checkerboard, không phải màu phẳng |

Cả ba đều là line art đỏ thuần, nên đổi sang lấy alpha từ **độ bão hoà HSB**: nền trắng và ô caro
xám có saturation ≈ 0, nét đỏ có saturation cao, và vùng trắng khép kín cũng rụng theo.

Lần thử đầu dùng saturation của HSL thì viền ảnh bị rìa trắng. Lý do: HSL saturation của một màu
hồng rất nhạt như `#FFEEEE` vẫn cao, nên nhiễu JPEG quanh mép được giữ lại ở alpha đầy. HSB
saturation tính `(max-min)/max`, cho `#FFEEEE` ra ~6.7% — đúng thứ cần để cắt nhiễu đi.

Một ảnh bị loại: `IMG_7675` là ảnh gradient đỏ phủ kín khung, không có chủ thể để tách.
`IMG_7663` (sao vẽ tay) là ảnh chụp màn hình, còn dính một mảnh UI 18×127px bên phải, phải crop bỏ.

## Đưa vào trang: component `Decor`

Element nền cần ba thứ mà markup sẵn có chưa cho: nằm dưới nội dung, không chắn chuột, và biến mất
khỏi cây accessibility. `src/components/ui/decor.astro` gói cả ba, nhận vị trí qua CSS custom
property truyền bằng inline style.

Thứ tự vẽ cần một luật global duy nhất: `.container` được nâng lên `z-index: 1`. Không thể dùng
`z-index: -1` cho decor, vì `.section--alt` có background riêng và element âm sẽ chui xuống dưới
nền đó.

Decor dùng lại `[data-parallax]` sẵn có, nên nó đã được gate hai lớp: chỉ chạy trên desktop và chỉ
khi người dùng không bật reduced-motion.

## Hai lỗi phát hiện khi đo

**Tràn ngang 3px trên mobile.** `documentElement.scrollWidth` là 393 trên viewport 390. Nguyên nhân:
`right` tính theo hộp *chưa xoay*, nên ghim băng xoay 14° và loa xoay -10° có bounding box thò ra
ngoài. Sửa bằng cách đẩy hai element đó vào trong (2%→5%, 1%→4%).

**Mobile không còn element nào.** Đặt `hideMobile` cho tất cả thì `visibleDecor` trả về 0 — trang
điện thoại mất sạch phần trang trí vừa thêm. Giữ lại mỗi section một element, chọn cái nằm trong
dải padding trên hoặc dưới nơi cột đơn còn khoảng trắng, và giảm opacity còn 60%.

## Kết quả

18 element vào `src/assets/images/elements/`, 19 vị trí trên 9 section. Ảnh nguồn 4 MB nhưng
Astro nén xuống WebP 3–21 kB mỗi cái, tổng khoảng 200 kB.

Kiểm chứng: `pnpm build` và `pnpm check` sạch (0 error), không tràn ngang ở 1440px và 390px,
ảnh chụp từng section xác nhận element nằm sau chữ.
