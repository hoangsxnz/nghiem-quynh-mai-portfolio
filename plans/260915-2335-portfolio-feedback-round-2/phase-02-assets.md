---
phase: 2
title: "Tư liệu ảnh"
status: done
effort: "2.5h"
dependencies: []
---

# Phase 2: Tư liệu ảnh

## Context

Feedback cấp 6 ảnh trong `CV & Portfolio/feedback_round_2/feedback/images/`:

| Ảnh | Nội dung | Dùng để |
|---|---|---|
| `image1.png` (800×800, RGB, nền trắng) | Robot Pika | Tách nền → đặt cạnh tiêu đề dự án (Phase 3) |
| `image4.png` (758×1008, RGBA nhưng nền đục) | Ảnh mẫu bìa có bóng + viền | **Chỉ là ảnh tham chiếu style**, không đưa lên web |
| `image6.png` (1999×1250) | Kênh TikTok "Bố và Linda" | Thay `ugc-channel-tt-01.png` |
| `image5.png` (1999×1250) | Kênh TikTok "con cá mùa hè" | Thay `ugc-channel-tt-02.png` |
| `image2.png` (1999×1250) | Kênh Facebook "Ngọc Hân Thị Nguyễn" | Ảnh kênh FB mới |
| `image3.png` (1999×1250) | Kênh Facebook "Phạm Cẩm Liên" | Ảnh kênh FB mới |

Thêm một ảnh phải tự dựng: trích **sheet "Kịch bản dài"** của `assets-inbox/Kịch bản Ads mẫu.xlsx`
(22 hàng × 28 cột). Hiện web đang hiển thị ảnh của sheet "Kịch bản ngắn".

Quy trình dựng ảnh trích sheet đã có sẵn từ vòng trước, ghi trong
`plans/journals/2026-09-15-portfolio-revamp-robot-pika.md`: dump `.xlsx` bằng `openpyxl` → chọn tay
hàng/cột an toàn → render lại thành HTML giống giao diện Google Sheets → chụp bằng
`google-chrome --headless=new --force-device-scale-factor=2` → auto-crop bằng
`ImageChops.difference(...).getbbox()` → resize về 1040px. Dùng lại đúng quy trình đó, không nghĩ
cách mới.

## Requirements

### 2.1 Ảnh Robot Pika tách nền

- Nguồn `image1.png`, nền trắng tuyệt đối (`(255,255,255)` ở cả 4 góc).
- Tách nền bằng `rembg` (u2net + alpha matting) đã cài trong `~/.claude/skills/.venv` từ vòng
  trước. Nền trắng phẳng nên kết quả phải sạch ngay lần đầu; nếu viền còn răng cưa quanh tai và
  chân đế, thử ngưỡng alpha trước khi đổi model.
- Xuất `src/assets/images/pika/pika-robot-cutout.png`, RGBA, crop sát silhouette, chiều rộng 560px.
- Kiểm tra: `alpha.getextrema()` phải trả `(0, 255)`, và 4 góc phải có alpha 0.

### 2.2 Ảnh kịch bản dài

- Đọc sheet "Kịch bản dài", chọn các hàng đầu đủ để thấy cấu trúc ba cột (thoại · hình ảnh chi
  tiết · text trên màn hình) — khoảng 5–7 phân cảnh đầu, đủ để người xem hiểu bản dài khác bản
  ngắn ở độ chi tiết, không cần đủ 18 phân cảnh.
- Loại cột nhạy cảm theo đúng nguyên tắc "method only" trong `docs/content-source.md`: không giá
  bán, không phí thuê bao, không tên nhân sự, không tên đối thủ.
- Xuất `src/assets/images/pika/pika-ads-script-long.png`, rộng 1040px, ≤ 300KB.
- Xoá `src/assets/images/pika/pika-ads-script.png` sau khi Phase 4 chuyển sang ảnh mới — file này
  chỉ mồ côi vì thay đổi của lần này nên phải dọn, khác với 13 ảnh mồ côi của vòng trước.

### 2.3 Bốn ảnh kênh UGC

Cả 4 ảnh nguồn đều là ảnh chụp toàn màn hình macOS. Phải crop bỏ:

- thanh menu macOS trên cùng và dock dưới cùng;
- toàn bộ giao diện Chrome (tab, thanh địa chỉ, thanh bookmark) — thanh bookmark có tên thư mục
  cá nhân của người chụp;
- với TikTok: cả sidebar trái (logo, ô Search, menu For You/Explore/…) vì nó không thuộc nội dung
  kênh.

Giữ lại: khối header kênh (ảnh đại diện, tên kênh, handle, số follower/like) + lưới video.

| File đích | Nguồn | Xử lý riêng |
|---|---|---|
| `ugc-channel-tt-01.png` | `image6.png` | **Bắt buộc làm mờ** địa chỉ email của người thứ ba hiện trong phần bio, như bản hiện tại đã làm |
| `ugc-channel-tt-02.png` | `image5.png` | — |
| `ugc-channel-fb-01.png` | `image2.png` | — |
| `ugc-channel-fb-02.png` | `image3.png` | — |

Mỗi ảnh rộng 1040px, ≤ 300KB, đặt trong `src/assets/images/pika/`.

## Non-functional / riêng tư

Bốn ảnh kênh là trang cá nhân của phụ huynh thật, và thumbnail reels có mặt trẻ em.

**Chốt chặn bắt buộc:** trước khi commit ảnh Facebook, hỏi chủ sở hữu hai câu — (1) đã xin phép
hai phụ huynh này chưa, (2) có đồng ý để mặt trẻ em xuất hiện trong thumbnail trên portfolio công
khai không. Chưa có câu trả lời thì **không commit ảnh FB**, giữ nguyên dạng thẻ link như hiện
tại và báo lại. Hai ảnh TikTok đã có tiền lệ được duyệt ở vòng trước nên không cần hỏi lại, nhưng
vẫn phải làm mờ email.

Không phóng to, không crop cận mặt bất kỳ đứa trẻ nào; chỉ giữ lưới thumbnail ở đúng tỷ lệ gốc.

## Files owned

- `src/assets/images/pika/pika-robot-cutout.png` (tạo)
- `src/assets/images/pika/pika-ads-script-long.png` (tạo)
- `src/assets/images/pika/ugc-channel-tt-01.png`, `-tt-02.png` (ghi đè)
- `src/assets/images/pika/ugc-channel-fb-01.png`, `-fb-02.png` (tạo)
- `src/assets/images/pika/pika-ads-script.png` (xoá, sau khi Phase 4 xong)
- Script tạm: `/tmp/claude-.../scratchpad/` — không commit script vào repo

## Steps

1. Tách nền `image1.png` bằng `rembg`, crop sát, lưu `pika-robot-cutout.png`. Kiểm tra alpha.
2. Dump sheet "Kịch bản dài" bằng `openpyxl`, in ra để chọn hàng/cột an toàn.
3. Render HTML giống Google Sheets → chụp headless @2x → auto-crop → resize 1040px.
4. Crop 4 ảnh kênh, làm mờ email trên ảnh TikTok thứ nhất.
5. Nén cả 6 ảnh, kiểm tra từng file ≤ 300KB.
6. Hỏi chủ sở hữu về quyền riêng tư của 2 ảnh Facebook trước khi commit chúng.

## Validation

- `pika-robot-cutout.png`: alpha extrema `(0, 255)`, 4 góc alpha = 0.
- Mọi ảnh mới: `identify` cho ra chiều rộng đúng, dung lượng ≤ 300KB.
- Mở từng ảnh kênh ở 100%: không còn thanh menu macOS, không còn thanh bookmark, không còn dock,
  không đọc được email nào.
- `pika-ads-script-long.png`: mọi chữ trong ảnh phải truy được về đúng hàng trong sheet "Kịch bản
  dài"; không có cột giá, phí, tên người.

## Risk & rollback

- **Rủi ro riêng tư (cao):** xử lý theo mục Non-functional; nghi ngờ thì dừng và hỏi.
- **Rủi ro chất lượng tách nền:** nếu `rembg` để lại viền xám quanh chân đế robot, fallback là
  tách bằng ngưỡng trắng thuần (`image1.png` nền `#FFFFFF` phẳng) — đủ tốt cho ảnh này.
- **Rollback:** xoá ảnh mới, khôi phục `ugc-channel-tt-*.png` từ git.
