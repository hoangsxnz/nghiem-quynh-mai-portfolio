# Portfolio — Nghiêm Quỳnh Mai

Trang portfolio một trang, phong cách cắt dán giấy (cut-out paper). Toàn bộ nội dung tiếng Việt nằm
trong `src/data/*.json` — sửa nội dung **không cần đụng vào code**.

---

## 1. Cần bổ sung trước khi chia sẻ link (13 mục)

Trang vẫn chạy bình thường với các mục này, nhưng mỗi mục đang hiện một nhãn đỏ **"CẦN BỔ SUNG"**
trên trang. Xoá nhãn bằng cách thay chuỗi `[PLACEHOLDER: ...]` trong JSON bằng nội dung thật.

Xem danh sách hiện tại bất cứ lúc nào:

```bash
grep -rn "\[PLACEHOLDER" src/data/
```

| # | File | Cần gì |
|---|------|--------|
| 1 | `contact.json` | Link LinkedIn đầy đủ (dạng `https://www.linkedin.com/in/...`) |
| 2 | `branding.json` | 3-5 tính từ mô tả brand voice cá nhân |
| 3 | `branding.json` | 1 dự án định vị thương hiệu cụ thể + kết quả đo được |
| 4 | `branding.json` | Ảnh minh hoạ ngành Beauty (hiện là ô viền đỏ trống) |
| 5 | `strategy.json` | **Xác nhận được phép công bố** số liệu `+200%` / `+35%` và 2 ảnh chụp biểu đồ |
| 6 | `seo.json` | Link bài viết SmartRecruit đã xuất bản |
| 7 | `seo.json` | Thứ hạng từ khoá / lượt đọc của bài viết đó |
| 8 | `seo.json` | Bài SEO thứ hai (nếu có) |
| 9 | `social.json` | **Ảnh gốc độ phân giải cao** cho 8 sản phẩm — bản hiện tại chỉ 225-400px |
| 10 | `ugc.json` | Kết quả thực tế của chiến dịch Hidden Menu (nếu đã triển khai) |
| 11 | `ugc.json` | Ảnh/video UGC thật từ khách hàng |
| 12 | `ai-first.json` | Mô tả agent/automation cụ thể đã tự xây dựng + công cụ + kết quả |
| 13 | `ai-first.json` | Mức rút ngắn thời gian sản xuất thực tế (ví dụ: số giờ/tuần tiết kiệm) |

> Mục 5 là mục **quan trọng nhất**: số liệu và ảnh chụp màn hình của kênh khách hàng chỉ nên công bố
> sau khi có xác nhận của chủ sở hữu kênh.

---

## 2. Chạy tại máy

Cần Node 22.12 trở lên và pnpm.

```bash
pnpm install
pnpm dev       # mở http://localhost:4321
pnpm build     # xuất bản tĩnh vào thư mục dist/
pnpm check     # kiểm tra lỗi kiểu dữ liệu
```

---

## 3. Sửa nội dung

Mỗi phần của trang đọc đúng một file JSON:

| Phần trên trang | File | Sửa được gì |
|-----------------|------|-------------|
| Ảnh bìa / mở đầu | `src/data/hero.json` | Tên, chức danh, 3 thẻ tagline, câu giới thiệu, email, điện thoại |
| Thanh điều hướng | `src/data/nav.json` | Nhãn các mục (**không đổi** `id`) |
| Thẻ chia sẻ / SEO | `src/data/site.json` | Tiêu đề trang, mô tả, ảnh preview |
| 01 About Me | `src/data/about.json` | Tiểu sử, mục tiêu, trích dẫn, hành trình, kinh nghiệm, kỹ năng, ngôn ngữ, công cụ, học vấn |
| 02 Branding & Positioning | `src/data/branding.json` | Định vị, 3 trụ 3S, 3 ngành (F&B / B2B / Beauty), giá trị mang lại |
| 03 Content Strategy | `src/data/strategy.json` | Khung 3S, 5 bước quy trình, case study kênh video |
| 04 Content SEO | `src/data/seo.json` | 4 bước tiếp cận, checklist, bài viết ví dụ |
| 05 Social & Community | `src/data/social.json` | Post/Photo/Video, case study nội bộ, 8 sản phẩm tiêu biểu |
| 06 UGC | `src/data/ugc.json` | Chiến dịch Hidden Menu, cơ chế, thang nội dung, nguyên tắc |
| 07 AI First | `src/data/ai-first.json` | Bộ công cụ, phân vai Người/AI, agent, ranh giới |
| 09 Keep In Touch | `src/data/contact.json` | Lời mời, 4 thẻ liên hệ, nút gửi email, dòng kết |

**Lưu ý khi sửa JSON**

- Giữ nguyên dấu nháy kép `"`, dấu phẩy `,` và dấu ngoặc `{ } [ ]`. Thiếu một dấu là trang không build được.
- Muốn xuống dòng trong một đoạn văn: tách thành hai phần tử trong mảng, đừng gõ Enter giữa chuỗi.
- Không đổi `id` trong `nav.json` và `meta.id` trong các file section — đó là neo của thanh điều hướng.

---

## 4. Thêm hoặc thay ảnh

1. Chép file `.png` vào `src/assets/images/`.
2. Ghi **đúng tên file** vào JSON, ví dụ `"src": "work-watch-photo.png"`.

Gõ sai tên thì `pnpm build` dừng lại với thông báo `Unknown image "..."` — sai sẽ biết ngay,
không bao giờ ra trang với ảnh vỡ.

Ảnh được tự động nén sang WebP. Ảnh nhỏ **không bị phóng to** — đó là lý do 8 ảnh sản phẩm hiện
trông nhỏ; thay bằng ảnh gốc độ phân giải cao là chúng tự sắc nét hơn, không cần sửa code.

---

## 5. Deploy (Vercel)

1. Push repository lên GitHub.
2. Vào [vercel.com](https://vercel.com) → **Add New → Project** → chọn repository này.
3. Vercel tự nhận diện Astro. Build command `pnpm build`, output directory `dist`.
4. Sau khi có tên miền chính thức, sửa `site` trong `astro.config.mjs`:

```js
site: 'https://ten-mien-that.com',
```

   Giá trị này chỉ dùng cho thẻ canonical và ảnh preview khi chia sẻ link — để sai thì link chia sẻ
   trỏ sai chỗ.

5. Mỗi lần push lên `main`, Vercel tự deploy lại.

---

## 6. Kết quả kiểm thử (Lighthouse)

Đo trên bản build tĩnh, `pnpm preview`, ngày 14/09/2026.

| Hạng mục | Desktop | Mobile |
|----------|---------|--------|
| Performance | **98** | **94** |
| Accessibility | **100** | **100** |
| Best Practices | **100** | **100** |
| SEO | **100** | **100** |

Chỉ số mobile: FCP 2.3s · LCP 2.6s · TBT 120ms · CLS 0.005.

Báo cáo đầy đủ và ảnh chụp màn hình:
`plans/260914-1519-nghiem-quynh-mai-portfolio-website/qa/`

Đã kiểm tra thêm:

- Không tràn ngang ở 360 / 390 / 768 / 1024 / 1440 px.
- Mọi cặp chữ/nền đạt tối thiểu 4.5:1 (thấp nhất 4.81:1).
- Tắt JavaScript: toàn bộ 9 phần vẫn hiện đầy đủ, các link neo vẫn nhảy đúng.
- Bật "giảm chuyển động" của hệ điều hành: không có hiệu ứng nào, nội dung hiện đủ.
- Dấu tiếng Việt (Ê, Ỳ, Ữ) hiển thị đúng bằng font Protest Guerrilla, không bị cắt.

---

## 7. Riêng tư

Trang **công khai và cho phép Google lập chỉ mục** (`public/robots.txt`), và có đăng **số điện thoại
và email**. Đây là lựa chọn có chủ đích.

Muốn gỡ số điện thoại hoặc email: xoá mục tương ứng trong mảng `cards` của
`src/data/contact.json` (và mảng `quickLinks` trong `hero.json` nếu muốn gỡ cả ở đầu trang), rồi build lại.

Muốn chặn Google: sửa `public/robots.txt` thành `Disallow: /`.

Trang không dùng bất kỳ dịch vụ bên thứ ba nào — không analytics, không nhúng, font được đóng gói
sẵn trong trang.

---

## 8. Cấu trúc kỹ thuật (cho người tiếp nhận sau)

```
src/
├── data/           nội dung — 10 file JSON
├── types/          kiểu dữ liệu cho từng file JSON
├── components/
│   ├── ui/         9 thành phần dùng lại (polaroid, sticker, stamp, ...)
│   └── sections/   9 phần của trang
├── layouts/        khung <head>, font, script
├── scripts/motion/ GSAP + Lenis (chỉ chạy khi người dùng không tắt chuyển động)
├── styles/         tokens.css (màu, font, kích thước) + global.css
└── assets/images/  ảnh gốc
```

Astro 7 · vanilla CSS · GSAP 3 + Lenis · triển khai tĩnh, không có backend.
Mọi file dưới 200 dòng.
