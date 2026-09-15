# Portfolio — Nghiêm Quỳnh Mai

Trang portfolio một trang, phong cách cắt dán giấy (cut-out paper). Toàn bộ nội dung tiếng Việt nằm
trong `src/data/*.json` — sửa nội dung **không cần đụng vào code**.

Trang đang chạy tại **https://nghiem-quynh-mai-portfolio.pages.dev**

---

## 1. Chạy tại máy

Cần Node 22.12 trở lên và pnpm.

```bash
pnpm install
pnpm dev       # mở http://localhost:4321
pnpm build     # xuất bản tĩnh vào thư mục dist/
pnpm check     # kiểm tra lỗi kiểu dữ liệu
```

---

## 2. Sửa nội dung

Mỗi phần của trang đọc đúng một file JSON:

| Phần trên trang | File | Sửa được gì |
|-----------------|------|-------------|
| Ảnh bìa / mở đầu | `src/data/hero.json` | Tên, chức danh, 3 thẻ tagline, câu giới thiệu, email, điện thoại |
| Thanh điều hướng | `src/data/nav.json` | Nhãn các mục (**không đổi** `id`) |
| Thẻ chia sẻ / SEO | `src/data/site.json` | Tiêu đề trang, mô tả, ảnh preview |
| 01 About Me | `src/data/about.json` | Tiểu sử, mục tiêu, trích dẫn, hành trình, kinh nghiệm, kỹ năng, ngôn ngữ, công cụ, học vấn |
| 02 Branding & Positioning | `src/data/branding.json` | Định vị, 3 trụ 3S, 3 ngành (F&B / B2B / Beauty), giá trị mang lại |
| 03 Content Strategy | `src/data/strategy.json` | Bảy mắt xích chiến lược, case study kênh |
| 04 Content Ads | `src/data/ads.json` | Đối tượng, insight, kịch bản dài 18 phân cảnh và bản ngắn 5 phân cảnh |
| 05 Social & Community | `src/data/social.json` | Post/Photo/Video, số liệu kênh, 6 sản phẩm tiêu biểu |
| 06 UGC | `src/data/ugc.json` | Chiến dịch Hidden Menu, cơ chế, thang nội dung, 4 kênh TikTok/Facebook |
| 07 AI First | `src/data/ai-first.json` | Bộ công cụ, phân vai Người/AI, agent, ranh giới |
| Keep In Touch | `src/data/contact.json` | Lời mời, các thẻ liên hệ, nút gửi email, dòng kết |

Năm mục 02 đến 06 được gói chung trong khối **"Dự án nổi bật gần đây — Robot dạy tiếng Anh Pika"**.
Tiêu đề, mô tả và ảnh của khối này nằm trực tiếp trong `src/pages/index.astro`, không nằm trong JSON.

**Lưu ý khi sửa JSON**

- Giữ nguyên dấu nháy kép `"`, dấu phẩy `,` và dấu ngoặc `{ } [ ]`. Thiếu một dấu là trang không build được.
- Muốn xuống dòng trong một đoạn văn: tách thành hai phần tử trong mảng, đừng gõ Enter giữa chuỗi.
- Không đổi `id` trong `nav.json` và `meta.id` trong các file section — đó là neo của thanh điều hướng.

---

## 3. Thêm hoặc thay ảnh

1. Chép file `.png` hoặc `.jpg` vào `src/assets/images/` (ảnh của dự án Pika nằm trong `src/assets/images/pika/`).
2. Ghi **đúng tên file** vào JSON, ví dụ `"src": "pika-feed-01.jpg"`.

Gõ sai tên thì `pnpm build` dừng lại với thông báo `Unknown image "..."` — sai sẽ biết ngay,
không bao giờ ra trang với ảnh vỡ.

Ảnh được tự động nén sang WebP khi build. Ảnh nhỏ **không bị phóng to** — thay bằng ảnh gốc độ phân
giải cao là chúng tự sắc nét hơn, không cần sửa code.

---

## 4. Deploy (Cloudflare Pages)

```bash
pnpm build
wrangler pages deploy dist --project-name=nghiem-quynh-mai-portfolio --branch=main --commit-dirty=true
```

Chi tiết đầy đủ — tài khoản, rollback, cách gắn tên miền riêng — xem `docs/deployment.md`.

Sau khi có tên miền chính thức, phải sửa `site` trong `astro.config.mjs`:

```js
site: 'https://ten-mien-that.com',
```

Giá trị này sinh ra thẻ canonical và ảnh preview khi chia sẻ link — để sai thì link chia sẻ trỏ sai chỗ.

---

## 5. Kết quả kiểm thử

### Lighthouse

Đo ngày 14/09/2026 trên bản build tĩnh (`pnpm preview`).

| Hạng mục | Desktop | Mobile |
|----------|---------|--------|
| Performance | **98** | **94** |
| Accessibility | **100** | **100** |
| Best Practices | **100** | **100** |
| SEO | **100** | **100** |

Chỉ số mobile: FCP 2.3s · LCP 2.6s · TBT 120ms · CLS 0.005.
Báo cáo đầy đủ: `plans/260914-1519-nghiem-quynh-mai-portfolio-website/qa/`

> Số liệu này đo **trước** đợt dựng lại quanh dự án Pika và đợt sửa bố cục ngày 16/09/2026.
> Cần chạy lại Lighthouse trên bản hiện tại trước khi trích dẫn ra ngoài.

### Đã kiểm tra thêm

- Không tràn ngang ở 360 / 390 / 768 / 1024 / 1440 px.
- Mọi cặp chữ/nền đạt tối thiểu 4.5:1 (thấp nhất 4.81:1).
- Tắt JavaScript: toàn bộ các phần vẫn hiện đầy đủ, các link neo vẫn nhảy đúng.
- Bật "giảm chuyển động" của hệ điều hành: không có hiệu ứng nào, nội dung hiện đủ.
- Dấu tiếng Việt (Ê, Ỳ, Ữ) hiển thị đúng bằng font Protest Guerrilla, không bị cắt.

Đợt kiểm thử gần nhất (17 mục feedback về bố cục và khoảng trắng):
`plans/reports/qa-260916-portfolio-feedback-round-2.md`

---

## 6. Riêng tư

Trang **công khai và cho phép Google lập chỉ mục** (`public/robots.txt`), và có đăng **số điện thoại
và email**. Đây là lựa chọn có chủ đích.

Muốn gỡ số điện thoại hoặc email: xoá mục tương ứng trong mảng `cards` của
`src/data/contact.json` (và mảng `quickLinks` trong `hero.json` nếu muốn gỡ cả ở đầu trang), rồi build lại.

Muốn chặn Google: sửa `public/robots.txt` thành `Disallow: /`.

Trang không dùng bất kỳ dịch vụ bên thứ ba nào — không analytics, không nhúng, font được đóng gói
sẵn trong trang.

---

## 7. Cấu trúc kỹ thuật (cho người tiếp nhận sau)

```
src/
├── data/           nội dung — 11 file JSON
├── types/          kiểu dữ liệu cho từng file JSON
├── components/
│   ├── ui/         9 thành phần dùng lại (polaroid, sticker, stamp, ...)
│   └── sections/   10 phần của trang, phần dài tách partial vào thư mục con
├── layouts/        base-layout.astro — khung <head>, font, script
├── scripts/motion/ GSAP + Lenis (chỉ chạy khi người dùng không tắt chuyển động)
├── styles/         tokens.css (màu, font, kích thước) + global.css
└── assets/images/  ảnh gốc, ảnh dự án Pika trong thư mục con pika/
```

Astro 7 · vanilla CSS · GSAP 3 + Lenis · triển khai tĩnh, không có backend.
Mọi file dưới 200 dòng, trừ `src/styles/global.css` (230 dòng).
