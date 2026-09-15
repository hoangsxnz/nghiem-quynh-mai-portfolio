---
title: "Lấp khoảng trống bằng element nền, ưu tiên sao vẽ tay và mèo"
summary: "Đo cột trống bằng Playwright thay vì ước lượng, thêm 25 vị trí, rồi phát hiện breakpoint 1024px làm element đè lên chữ"
date: "2026-09-16"
---

# Lấp khoảng trống bằng element nền, ưu tiên sao vẽ tay và mèo

## Đo trước khi đặt

Vòng trước đặt element theo cảm tính nên chỉ phủ được góc section. Lần này đo thật: dựng danh
sách bounding box của mọi phần tử có text trực tiếp hoặc là ảnh, quét trang theo dải 100px, rồi
ghi lại những đoạn mà gutter trái hoặc phải rộng hơn 230px và kéo dài hơn 300px.

Kết quả cho thấy khoảng trống không nằm ở chỗ mình đoán. Dải trống ngang giữa các khối chỉ
125–175px — đó là nhịp dọc bình thường, không phải lỗi. Chỗ trống thật là **cột phải**, vì
`--measure: 62ch` giới hạn đoạn văn ở khoảng 780px trong khung 1200px:

| Section | Vùng trống |
|---|---|
| branding | x962–1440, cao 1400px |
| strategy | x962–1440, cao 2000px |
| social | x963–1440, cao 1600px; và hai mảng trái x0–732 cao 400px |
| ugc | x1181–1440, cao 1000px |

`ai-first` thì khác: lưới ba cột lấp gần hết chiều ngang, nhưng có ba dải trống hoàn toàn giữa
các hàng thẻ, cộng với gutter trái 184px và phải 200px.

## Đặt thêm 25 vị trí

Mỗi vị trí mới dịch từ một vùng trống đo được sang `top`/`right` phần trăm của section. Người
dùng thích `IMG_7663` (sao vẽ tay) và `IMG_7679` (mèo) nên hai element này nhận phần lớn số vị trí
mới: sao vẽ tay 15 lần, mèo 10 lần, trên tổng 44 element.

Kiểm tra chồng lấn sau khi đặt: 2/44 element đè lên nội dung. Sao vẽ tay ở hero cắt vào dòng
"Cuộn để khám phá" 8px, và nét khoanh tròn ở social thò 26px vào ảnh feed. Đẩy cái thứ nhất xuống
`bottom: 5%`, cái thứ hai sang `left: -4%`, còn lại 0/44.

## Lỗi chỉ lộ ra ở 1024px

Ở 1440px mọi thứ sạch. Ở 1024px thì 21/44 element đè lên nội dung — và một phần trong đó đã tồn
tại từ vòng trước chứ không phải do 25 vị trí mới.

Nguyên nhân: `right`/`left` tính theo phần trăm *viewport*, nhưng khung nội dung dừng ở 1200px.
Khi viewport rộng hơn 1200 thì phần dư trở thành gutter cho element; khi hẹp hơn thì gutter biến
mất mà phần trăm vẫn giữ nguyên, nên element trôi vào dưới chữ.

Sửa bằng một token mới `--decor-fade` đi cùng `--decor-scale` sẵn có: dưới 1200px nhân opacity với
0.55. Element ở 1024px còn khoảng 0.22 opacity — vẫn thấy được như hoạ tiết nền, không còn cạnh
tranh với chữ. Rule opacity riêng cho mobile bị bỏ vì token mới đã bao luôn.

## Kết quả

44 element trên 9 section (social 7, phần lớn còn lại 4–5). Trên điện thoại vẫn giữ 9 element như
cũ. `pnpm build` và `pnpm check` sạch, không tràn ngang ở 1440px, 1024px và 390px, và 0/44 element
đè lên nội dung ở 1440px.
