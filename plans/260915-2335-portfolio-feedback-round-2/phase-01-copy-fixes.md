---
phase: 1
title: "Chữ & dữ liệu"
status: done
effort: "0.5h"
dependencies: []
---

# Phase 1: Chữ & dữ liệu

## Context

Bốn chỉnh sửa chữ feedback nêu đích danh. Không đụng bố cục, không đụng component — chỉ sửa giá
trị chuỗi trong `src/data/`. Đây là phase rủi ro thấp nhất, chạy được song song với Phase 2.

Mục UGC `channelNote` cũng bị yêu cầu bỏ, nhưng việc đó kéo theo xoá markup và xoá field trong
type, nên thuộc Phase 5 để giữ quyền sở hữu file gọn.

## Requirements

### 1. AI First — bỏ một câu trong phần agent

`src/data/ai-first.json` → `agents.body`. Bỏ câu cuối:

> Dưới đây chỉ liệt kê tên và phạm vi của từng agent.

Giữ nguyên phần đầu: "Mỗi agent là một file hướng dẫn riêng cho một đầu việc lặp lại, để mỗi lần
bắt đầu không phải mô tả lại bối cảnh từ đầu."

### 2. AI First — thay câu ranh giới

`src/data/ai-first.json` → `boundary`. Thay nguyên văn theo feedback:

- Trước: "Mọi số liệu, tên thương hiệu và cam kết sản phẩm đều do người kiểm chứng trước khi xuất
  bản. AI không ký tên dưới bài viết."
- Sau: "Quy tắc với AI: Mọi số liệu, thông tin thương hiệu và cam kết sản phẩm đều do người kiểm
  chứng trước khi đăng tải."

### 3. Contact — đổi xưng hô

`src/data/contact.json` → `intro`. Đổi "team" → "Quý công ty", "mình" → "tôi". Kết quả:

> Nếu Quý công ty đang cần một mảnh ghép vừa biết kể chuyện thương hiệu, vừa biết tối ưu hiệu quả
> vận hành để cùng tạo nên những giá trị mới, tôi rất sẵn lòng. Hãy cùng kết nối để chúng ta có
> thể trao đổi về những giải pháp nội dung thực tế, được tối ưu riêng cho những dự án sắp tới!

Không đổi `cta.label` ("Gửi email cho Mai") và `closing` — feedback không nhắc tới, và đổi xưng hô
ở nút bấm sẽ lệch giọng với phần còn lại của trang.

### 4. Social — thay cụm văn bản -36,4%

`src/data/social.json` → `statsNote`. Thay bằng mô tả trung tính, giữ nguyên con số trong caption
của ảnh:

- Trước: "Ảnh chụp ghi -36,4% so với 32 ngày trước đó, nên đây là ảnh tổng quan hiệu suất một
  tháng chứ không phải biểu đồ tăng trưởng. Giữ nguyên con số và giữ nguyên dấu trừ."
- Sau: "Số liệu lấy nguyên từ báo cáo kỳ 01-31/05, không chỉnh sửa. Đây là ảnh tổng quan hiệu suất
  một tháng của kênh."

Ràng buộc trung thực: `stats.caption` vẫn giữ nguyên toàn bộ con số thật (4.481.451 lượt xem,
1.169.990 người xem…). Câu mới chỉ bỏ phần tự giải thích dấu trừ, không được thêm bất kỳ tính từ
đánh giá nào ("ấn tượng", "tăng trưởng tốt") vì không có số liệu nào trong file chứng minh được.

## Files owned

- `src/data/ai-first.json`
- `src/data/contact.json`
- `src/data/social.json`

## Steps

1. Sửa 4 chuỗi ở trên.
2. `pnpm check` — type không đổi nên phải sạch ngay.
3. Mở web, đọc lại 4 chỗ trên màn hình để chắc không sót ký tự thừa hay lặp dấu câu.

## Validation

- `grep -n "AI không ký tên\|Dưới đây chỉ liệt kê\|-36,4%\|Nếu team" src/data/` → rỗng.
- `grep -n "Quy tắc với AI\|Quý công ty\|kỳ 01-31/05" src/data/` → đủ 3 kết quả.
- `grep -n "4.481.451" src/data/social.json` → vẫn còn (caption không bị đụng).
- `pnpm check` sạch.

## Risk & rollback

- Rủi ro thấp. Rollback: revert commit `fix(copy)`.
