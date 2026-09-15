---
title: "Portfolio revamp quanh dự án Robot Pika"
summary: "8 phase theo plan 260915-2041; ba giả định của kế hoạch bị thực tế bác bỏ, chốt ranh giới dữ liệu nội bộ và PII"
date: "2026-09-15"
---

# Portfolio revamp quanh dự án Robot Pika

## Bối cảnh

Plan `plans/260915-2041-pika-portfolio-revamp/`, 8 phase, chạy tuần tự trong một session.
Yêu cầu gốc: `CV & Portfolio/Portfolio guidelines/Portfolioguidelines.html` + 8 ảnh kèm theo.
Mục tiêu: bỏ 5 khối dự án tự nghĩ hoặc thuộc công ty cũ, gom toàn bộ phần dự án về một dự án
có thật — Robot dạy tiếng Anh Pika — và viết lại Cover, About Me, AI First, Contact.

## Ba giả định của kế hoạch bị thực tế bác bỏ

**1. "Cả 6 file Google đều private (HTTP 401)."** Kiểm lại bằng `curl` thì cả 7 link (6 Sheets +
1 Docs) đều trả 200. Toàn bộ nhánh "chặn cứng chờ chủ sở hữu mở quyền" trong Phase 4 và bước
kiểm tra quyền của Phase 8 trở nên thừa. Bài học: kiểm tra lại trạng thái bên ngoài ngay đầu
phiên thực thi thay vì tin vào ghi chép lúc lập kế hoạch.

**2. Hai file Sheets bị gán nhầm vai.** Kế hoạch ghi "Robot Pika - Fanpage Facebook" là file
Branding và "Robot Pika - Fanpage" là file Content Strategy. Đọc nội dung thật thì ngược lại:
file "Fanpage" chứa SWOT, Thương hiệu, Sản phẩm, Khách hàng, Đối thủ; file "Fanpage Facebook"
chứa Tổng quan chiến lược, Direction & Key Mess, Content Pillar & Angle, Lịch chi tiết, KPI.
Đã xác nhận lại bằng `<title>` của từng link rồi mới viết data. Hai tên file gần giống nhau là
cái bẫy; đối chiếu bằng nội dung sheet, không bằng tên.

**3. "Ảnh chụp kênh do agent tự chụp."** TikTok cho chụp `@bovalinda` đầy đủ; `@conca.muahe`
dựng captcha cho lưới video sau hai lần thử nên chỉ lấy được header kênh. Facebook bắt đăng nhập
cho cả fanpage Pika lẫn hai trang cá nhân phụ huynh. Không vượt tường đăng nhập — dùng đúng
phương án dự phòng đã định sẵn trong Phase 5/6 là thẻ dẫn link, kèm một dòng ghi chú trên web
giải thích vì sao không có ảnh.

## Quyết định về dữ liệu nội bộ và PII

Sáu file nguồn là tài liệu nội bộ của Step Up Education. Đọc xong thấy có: giá bán và phí thuê
bao, phân tích đối thủ theo tên, phản hồi tiêu cực về lỗi phần cứng/phần mềm, và trong
`PIKA SUMMER CAMPAIGN` có cả tên thật lẫn số điện thoại của hơn 20 phụ huynh.

Đã hỏi chủ sở hữu hai câu trước khi viết copy. Kết quả: chỉ mô tả phương pháp, không nêu số nội
bộ; được phép chụp màn hình cả 4 kênh UGC vì đã xin phép phụ huynh. Không hỏi thì hoặc phải bịa
ranh giới, hoặc phải publish dữ liệu người thật — cả hai đều sai.

Hệ quả trong code: `assets-inbox/` được thêm vào `.gitignore` vì chứa PII. Ảnh bìa video có hiển
thị tên tài khoản một người bình luận, và kênh TikTok có email liên hệ công việc — cả hai đã làm
mờ bằng `ImageFilter.GaussianBlur` trước khi đưa vào `src/assets/`.

## Cách dựng ảnh trích sheet

Guidelines yêu cầu "chụp ảnh những phần highlights phù hợp" của các file Sheets. Chụp thẳng màn
hình Google Sheets sẽ kéo theo đúng những cột nhạy cảm vừa quyết định loại bỏ.

Cách làm: dump `.xlsx` bằng `openpyxl` → chọn tay các hàng/cột an toàn → render lại thành HTML
có giao diện giống Google Sheets (thanh tên file, tab sheet, viền lưới) → chụp bằng
`google-chrome --headless=new --force-device-scale-factor=2` → auto-crop khoảng trắng bằng
`ImageChops.difference(...).getbbox()` → resize về 1040px. Ra 9 ảnh, mỗi ảnh dưới 300 KB.

Ranh giới trung thực: mọi chữ trong ảnh đều là nội dung thật của file, và caption trên web luôn
ghi rõ đang trích file nào, sheet nào. Đây là bản trích có chọn lọc, không phải minh hoạ.

## Vài ghi chú kỹ thuật khác

- Tách nền ảnh bìa: không có `rembg` sẵn, cài `rembg[cpu]` + `onnxruntime` vào venv của skills.
  Model u2net + alpha matting cho kết quả sạch ngay lần đầu dù nền là ngõ hẹp nhiều dây điện.
- Chụp full-page bằng Chrome headless hỏng ở trang cao 26.600px: phần dưới ~16.384px ra trắng
  trơn (giới hạn texture). Lúc đầu tưởng layout vỡ. Chuyển sang chụp theo từng `section` bằng
  element screenshot của Playwright thì đúng.
- Thẻ trong section UGC bị "vô hình" vì nền thẻ `--paper` trùng nền section sau khi đảo thứ tự
  `section--alt`. Đổi nền thẻ sang `--paper-2`. Khi đảo nền section, phải rà lại nền của mọi thẻ
  bên trong.
- Card nghiêng chiếm hết chiều ngang thì góc chọc ra ngoài lề 16px ở 390px. Sửa một chỗ: hạ một
  nửa các token `--tilt-*` dưới 600px trong `tokens.css`, thay vì tắt `rotate` ở từng component.

## Next steps

- `astro.config.mjs` vẫn `site: 'https://example.com'` — cần tên miền thật trước khi publish.
- 13 ảnh của các section đã xoá giờ mồ côi; chưa xoá vì không tốn dung lượng build, chờ chủ sở
  hữu quyết.
- Nếu muốn ảnh fanpage Pika và hai kênh Facebook phụ huynh thì chủ sở hữu tự chụp lúc đang đăng
  nhập rồi bỏ vào `assets-inbox/`.
