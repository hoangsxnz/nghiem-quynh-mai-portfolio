# QA — Portfolio revamp theo Portfolio Guidelines (Robot Pika)

Plan: `plans/260915-2041-pika-portfolio-revamp/` · Branch `main` · 2026-09-15
Build: `pnpm check` 0 lỗi / 0 cảnh báo, `pnpm build` thành công.

## 1. Đối chiếu từng gạch đầu dòng của guidelines

| # | Yêu cầu trong `Portfolioguidelines.html` | Trạng thái | Nơi thực hiện |
|---|------------------------------------------|-----------|---------------|
| 1 | Toàn bộ portfolio thêm hiệu ứng và elements phù hợp | Done | Reveal theo bậc, split chữ tiêu đề, parallax ảnh bìa, marquee tools, hiệu ứng cuộn cho câu kết |
| 2 | Giữ thanh nav, đổi mục SEO thành ADS | Done | `src/data/nav.json` — `{ id: "ads", label: "ADS" }`, trỏ tới section `#ads` |
| 3 | Bôi đậm dòng CONTENT MARKETING EXECUTIVE | Done | `.hero__role` — `font-weight: 700`, letter-spacing .12em |
| 4 | Thêm chữ PORTFOLIO bên trên họ tên | Done | `.hero__wordmark`, cỡ `--fs-h1`, lớn nhất trang |
| 5 | Thay câu tagline | Done | `hero.json → oneLiner`, chép nguyên văn |
| 6 | Thay ảnh profile, tách nền, đổ bóng, bỏ "Open to work" | Done | `photo-mai-cutout.png` (rembg u2net), `drop-shadow`; stamp đã xoá khỏi repo |
| 7 | About Me: 2 ảnh polaroid trên–dưới, cụm ảnh trái, chữ phải | Done | `about/photo-stack.astro` + lưới 5fr/7fr trong `about-me.astro` |
| 8 | Thay đoạn văn bản bằng text box "Mục tiêu nghề nghiệp" mới | Done | `about.json → objective`, 3 đoạn chép nguyên văn |
| 9 | Bỏ text box "Mục tiêu nghề nghiệp" cũ | Done | Đoạn CV cũ đã xoá khỏi `about.json` |
| 10 | Giữ câu quote | Done | `about.json → quote`, không đổi |
| 11 | Bỏ mục "Hành trình" | Done | `eras` xoá khỏi data và type; `timeline.astro` đổi thành `experience-list.astro` |
| 12 | Giữ nguyên Kinh nghiệm làm việc | Done | 4 công ty, đếm trước và sau đều bằng 4 |
| 13 | Kỹ năng xếp lại 4 text box cùng hàng | Done | `skills-grid.astro` — 4 cột ≥1100px, 2 cột ≥640px, 1 cột dưới 640px |
| 14 | Đổi nội dung Ngôn ngữ | Done | Pháp thành thạo · Anh thành thạo · Trung giao tiếp cơ bản |
| 15 | Tools: bỏ Microsoft Office, thêm Google Sheets/Slides/Docs | Done | `about.json → tools` |
| 16 | Học vấn & Chứng chỉ: phóng to, nổi bật, chuyển lên ngay sau Kinh nghiệm | Done | Tiêu đề lên `--fs-h2`, mỗi mục là thẻ có viền + đổ bóng, đặt ngay sau khối kinh nghiệm |
| 17 | Tiêu đề lớn "Dự án nổi bật gần đây: Robot dạy tiếng Anh Pika" | Done | `project-group.astro` bọc 5 section con |
| 18 | Branding & Positioning: đọc file, dẫn link, chụp highlight, viết mô tả | Done | Section `#branding` — 4 thẻ định vị, 3 thẻ brand voice, 2 ảnh trích file, nút mở file |
| 19 | Content Strategy với 7 mắt xích Direction → Đo lường | Done | Section `#strategy` — đúng 7 thẻ, đúng thứ tự, 3 ảnh trích file, nút mở file |
| 20 | Content Ads (kịch bản mẫu): chụp màn hình + dẫn link | Done | Section `#ads` — 6 điểm cách tiếp cận, ảnh trích kịch bản ngắn, nút mở file |
| 21 | Social: ảnh chụp bài đăng | Done | `pika-post-sample.png` trong khối "Post mẫu" |
| 22 | Social: ảnh bìa video | Done | `pika-video-cover.png` trong khối "Video" |
| 23 | Social: 2 ảnh feed | Done | `pika-feed-01.jpg`, `pika-feed-02.jpg` |
| 24 | Social: biểu đồ tăng trưởng kênh | **Done, có điều chỉnh** | Ảnh giữ nguyên, caption gọi là *tổng quan hiệu suất 1 tháng* — xem mục 3 |
| 25 | Kênh phụ trách: fanpage Robot Pika + link | Done | Thẻ kênh dẫn `facebook.com/robotpika` |
| 26 | Post mẫu: dẫn link bài mẫu + ảnh | Done | Link Google Docs "Social Post mẫu" |
| 27 | Video: dẫn 2 link TikTok | Done | Hai thẻ link trong khối "Video" |
| 28 | Community: dẫn file Community Planning | Done | Mô tả cơ chế + ảnh trích sheet + nút mở file |
| 29 | UGC: quy mô 30 phụ huynh | Done | Thẻ "Quy mô" |
| 30 | UGC: vai trò + link định hướng nội dung | Done | Thẻ "Vai trò" kèm nút mở file |
| 31 | UGC: sản phẩm Robot Pika | Done | Thẻ "Sản phẩm" |
| 32 | UGC: quy trình vận hành, tracking + link | Done | Thẻ "Quy trình vận hành & tracking" kèm nút mở PIKA SUMMER CAMPAIGN |
| 33 | UGC: 2 kênh Facebook, chụp màn hình + link | **Một phần** | Có link, không có ảnh — Facebook chặn ảnh chụp tự động, xem mục 4 |
| 34 | UGC: 2 kênh TikTok, chụp màn hình + link | Done | `ugc-channel-tt-01.png`, `ugc-channel-tt-02.png` |
| 35 | AI First giữ nguyên nội dung, chỉnh bố cục, bổ sung nội dung | Done | Lưới thẻ công cụ, bảng Người/AI dạng hàng ngang, thêm khối agent |
| 36 | Agent chỉ liệt kê tên, không show nội dung bên trong | Done | 12 agent đúng tên file, mỗi agent một dòng mô tả phạm vi |
| 37 | Contact: bỏ textbox 09 / KEEP IN TOUCH / subtitle đầu trang | Done | `SectionHeader` gỡ bỏ, thay bằng `h2.sr-only` để giữ `aria-labelledby` |
| 38 | Contact: cụm văn bản canh giữa + đoạn intro mới | Done | Section canh giữa, intro chép nguyên văn |
| 39 | Contact: bổ sung link LinkedIn | Done | `linkedin.com/in/quynhmai37/` |
| 40 | Contact: giữ box GỬI EMAIL CHO MAI | Done | `CtaButton` giữ nguyên |
| 41 | Contact: giữ câu CTA cuối trang, làm nổi bật, thêm hiệu ứng cuộn | Done | Cỡ `--fs-h2`, scrub scale/opacity theo cuộn |

Không có dòng nào trong guidelines bị bỏ qua mà không ghi lý do.

## 2. Bảng kiểm link ngoài

| Mã | Link |
|----|------|
| 200 | Robot Pika - Fanpage (branding) |
| 200 | Robot Pika - Fanpage Facebook (strategy) |
| 200 | Kịch bản Ads mẫu |
| 200 | Social Post mẫu (Docs) |
| 200 | Community Planning |
| 200 | Định hướng nội dung chị Minh Trang |
| 200 | PIKA SUMMER CAMPAIGN |
| 200 | facebook.com/robotpika |
| 200 | facebook.com/chau.chau.660751/reels/ |
| 200 | facebook.com/tranhien9996/reels/ |
| 200 | tiktok.com/@bovalinda |
| 200 | tiktok.com/@conca.muahe |
| 200 | 2 link video TikTok |
| 999 | linkedin.com/in/quynhmai37/ |

Cả 7 file Google đều đã công khai — giả định "401, cần xin quyền" trong kế hoạch không còn đúng.
LinkedIn trả 999 với mọi công cụ tự động; đó là mã chặn bot của LinkedIn, không phải link chết.

## 3. Số liệu hiệu suất kênh

Ảnh `image4.png` ghi 4.481.451 lượt xem kèm **-36,4% so với 32 ngày trước**, cùng 1.169.990 người
xem, 27.353 lượt xem tối thiểu 3 giây và 3.636 lượt xem tối thiểu 1 phút, kỳ 01-31/05. Guidelines
gọi đây là "biểu đồ tăng trưởng kênh". Caption trên web gọi đúng bản chất là tổng quan hiệu suất
một tháng và ghi rõ dấu trừ. Nếu cần đúng chữ "tăng trưởng" thì phải thay bằng ảnh của một kỳ thực
sự tăng.

## 4. Ảnh chụp kênh

Chủ sở hữu xác nhận đã xin phép 4 phụ huynh, nên kế hoạch là chụp cả 4 kênh.

- TikTok `@bovalinda`: chụp được cả header và lưới video. Email liên hệ công việc hiển thị công
  khai trên kênh đã được làm mờ.
- TikTok `@conca.muahe`: TikTok dựng captcha cho lưới video sau hai lần thử, nên chỉ lấy phần
  header kênh (tên, ảnh đại diện, số liệu).
- Hai kênh Facebook: Facebook bắt đăng nhập trước khi xem trang cá nhân. Không vượt tường đăng
  nhập; hai kênh để dạng thẻ dẫn link, có ghi chú giải thích ngay dưới lưới kênh.

Ảnh bìa video `image5.png` có hiển thị tên tài khoản của một người bình luận — đã làm mờ.

## 5. Dữ liệu nội bộ

Theo lựa chọn của chủ sở hữu, nội dung mô tả chỉ nói về phương pháp. Web không nhắc giá bán, phí
thuê bao, phân tích đối thủ theo tên, phản hồi tiêu cực về sản phẩm, và không có tên hay số điện
thoại của bất kỳ phụ huynh nào. Ảnh trích sheet được dựng lại từ đúng nội dung file, bỏ các cột
nhạy cảm; mỗi caption ghi rõ đang trích file nào, sheet nào.

## 6. Kiểm tra kỹ thuật

| Hạng mục | Kết quả |
|----------|---------|
| `pnpm check` | 0 lỗi, 0 cảnh báo, 0 gợi ý (42 file) |
| `pnpm build` | Thành công |
| Console lúc chạy | 0 lỗi |
| Tràn ngang 390 / 768 / 1440px | Không; `scrollWidth` bằng đúng `clientWidth` |
| Thứ tự heading | h1 → h2 → h3 → h4, không nhảy cấp |
| `alt` cho ảnh | 19/19 ảnh có alt |
| `aria-labelledby` | 9/9 section trỏ tới id tồn tại |
| Anchor nav | 9/9 mục nav mở đúng section |
| `prefers-reduced-motion: reduce` | Nội dung hiện đầy đủ, không animation |
| Tổng dung lượng ảnh trang | 1,10 MB (giới hạn 4 MB) |
| Ảnh lớn nhất sau nén | Dưới 300 KB |
| JS | 131 KB — vẫn chỉ là GSAP + Lenis, không thêm dependency |
| `[PLACEHOLDER` / `TODO` trong `src/data` | Không còn |
| Import chết, type mồ côi | Không còn (`astro check` sạch) |

## 7. Việc còn lại cho chủ sở hữu

1. `astro.config.mjs` vẫn đặt `site: 'https://example.com'` — cần tên miền thật trước khi publish,
   vì canonical và `og:url` lấy từ đó. Đây là placeholder có từ lần build đầu, không phải của đợt này.
2. 13 ảnh của các section cũ (`work-*.png`, `chart-*.png`, `sheet-content-plan.png`,
   `photo-mai-avatar.png`, `photo-mai-cafe.png`) không còn được dùng. Chưa xoá vì không tốn dung
   lượng build; xoá hay giữ là quyết định của chủ sở hữu.
3. Nếu muốn có ảnh chụp fanpage Pika và hai kênh Facebook của phụ huynh, cần tự chụp khi đang đăng
   nhập rồi bỏ vào `assets-inbox/`.

## Câu hỏi chưa giải quyết

- Kế hoạch gán nhầm hai file Sheets: nội dung nghiên cứu thương hiệu nằm trong **Robot Pika -
  Fanpage**, còn chiến lược nội dung nằm trong **Robot Pika - Fanpage Facebook**. Web đã dùng đúng
  theo nội dung thật của file; cần xác nhận lại nếu chủ sở hữu hiểu khác.
- Có nên giữ nguyên `photo-mai-avatar.png` và `photo-mai-cafe.png` trong repo không, hay xoá cùng
  nhóm ảnh của các section đã bỏ?
