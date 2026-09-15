---
phase: 5
title: "UGC — bố cục & kênh"
status: done
effort: "1.5h"
dependencies: [2]
---

# Phase 5: UGC — bố cục & kênh

## Context

Ba mục feedback:

1. Bốn thẻ thông tin đang nằm trong lưới `auto-fit` ba cột, rớt hàng lệch, để lại hai lỗ trống
   lớn (đo được: cụm `.facts` cao 859px). Feedback muốn 4 text box dồn về bên phải, 2 ảnh chụp
   màn hình xếp chồng bên trái.
2. Bỏ cụm văn bản giải thích vì sao hai kênh Facebook chỉ có link mà không có ảnh — giờ đã có ảnh
   nên câu này sai sự thật.
3. Thay 2 link TikTok bằng link + ảnh kênh, và thay **hai kênh Facebook cũ bằng hai kênh mới**
   kèm ảnh.

## Requirements

### 5.1 Bố cục: 4 text box phải, 2 ảnh xếp chồng trái

Feedback mô tả rõ thứ tự hàng:

- Hàng 1: 2 textbox ngắn — **Quy mô**, **Sản phẩm**
- Hàng 2: 2 textbox dẫn link — **Vai trò**, **Quy trình vận hành & tracking**

Thứ tự trong `ugc.json` → `facts` hiện đã đúng, không cần đổi dữ liệu.

Dựng lại phần thân section thành lưới 2 cột:

```css
.ugc__body {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  align-items: start;
  gap: var(--gap);
}
.facts { grid-template-columns: repeat(2, minmax(0, 1fr)); }   /* 2×2 trong cột phải */
```

- Cột trái: hai `EvidenceCard` (`pika-ugc-concept.png`, `pika-ugc-workflow.png`) xếp chồng lệch,
  dùng lại đúng kỹ thuật `grid-area: 1 / 1` + `translate` của Phase 4 để không sinh hai cách làm
  khác nhau cho cùng một hiệu ứng.
- Cột phải: 4 thẻ fact thành lưới 2×2.
- Dưới 900px: về 1 cột, ảnh xếp dọc không chồng, thẻ fact 1 cột — như hành vi hiện tại.

Mục tiêu đo được: chiều cao cụm `.facts` + `.evidence` giảm từ ~1.300px xuống ≤ 900px, và không
còn ô trống nào rộng hơn một thẻ trong lưới fact.

### 5.2 Bỏ cụm văn bản về Facebook login

Xoá `channelNote` khỏi:

- `src/data/ugc.json` (field)
- `src/types/content-sections.ts` → `UgcContent` (field `channelNote: string`)
- `src/components/sections/ugc-showcase.astro` → `<p class="meta" data-reveal>{ugc.channelNote}</p>`

Cả ba chỗ phải xoá cùng lúc, nếu không `astro check` sẽ báo lỗi type.

### 5.3 Bốn kênh UGC

Thay toàn bộ mảng `channels` trong `ugc.json`:

| # | Tên | Nền tảng | Link | Ảnh |
|---|---|---|---|---|
| 1 | Bố và Linda | TikTok | `https://www.tiktok.com/@bovalinda` | `ugc-channel-tt-01.png` |
| 2 | con cá mùa hè | TikTok | `https://www.tiktok.com/@conca.muahe` | `ugc-channel-tt-02.png` |
| 3 | Ngọc Hân Thị Nguyễn | Facebook | `https://www.facebook.com/ngochan.smust/reels/` | `ugc-channel-fb-01.png` |
| 4 | Phạm Cẩm Liên | Facebook | `https://www.facebook.com/pham.camlien` | `ugc-channel-fb-02.png` |

Hai kênh Facebook cũ (`chau.chau.660751`, `tranhien9996`) bị **thay thế**, không phải bổ sung:
feedback ghi "2 Link Facebook thay bằng 2 link + 2 ảnh minh hoạ kênh dưới đây".

Tên kênh lấy đúng như hiển thị trên ảnh chụp. URL lấy đúng như feedback viết — kênh thứ tư không
có hậu tố `/reels/`.

Mỗi thẻ kênh giờ đều có ảnh, nên nhánh `{channel.image && ...}` trong `ugc-showcase.astro` không
còn nhánh rỗng; giữ nguyên `image` là optional trong type hay đổi thành bắt buộc đều được, chọn
bắt buộc nếu không còn chỗ nào dùng thẻ không ảnh.

**Chặn:** nếu Phase 2 chưa được chủ sở hữu duyệt quyền riêng tư cho hai ảnh Facebook, làm mục
5.1 và 5.2 trước, giữ hai kênh Facebook ở dạng thẻ link không ảnh, và **vẫn cập nhật URL + tên
kênh mới** — phần đó không phụ thuộc ảnh.

## Files owned

- `src/data/ugc.json`
- `src/components/sections/ugc-showcase.astro`
- `src/types/content-sections.ts` → `UgcContent` *(Phase 4 sửa `SocialBlock` trong cùng file này;
  chạy hai phase tuần tự hoặc để cùng một người làm, đừng sửa song song)*

## Steps

1. Xoá `channelNote` ở cả ba chỗ, chạy `pnpm check` để xác nhận type sạch.
2. Thay mảng `channels` bằng 4 kênh mới.
3. Dựng lại lưới 2 cột trong `ugc-showcase.astro`, tái dùng kỹ thuật xếp chồng của Phase 4.
4. Kiểm ở 1440 / 900 / 899 / 390px.
5. Bấm thử cả 4 link, xác nhận mở đúng trang.
6. `pnpm check && pnpm build`.

## Validation

- `grep -rn "channelNote\|chau.chau.660751\|tranhien9996" src/` → rỗng.
- 4 thẻ kênh, mỗi thẻ mở đúng URL trong bảng trên.
- Chiều cao cụm fact + evidence ≤ 900px ở 1440px.
- Lưới fact 2×2 ở ≥ 900px, 1 cột ở 390px, không ô trống thừa.
- Hai ảnh evidence xếp chồng ở ≥ 900px, xếp dọc ở < 900px.
- `scrollWidth === clientWidth` ở 390 / 768 / 1440px.
- `pnpm check && pnpm build` sạch.

## Risk & rollback

- **Rủi ro riêng tư:** phụ thuộc chốt chặn ở Phase 2. Không tự ý đăng ảnh Facebook khi chưa có
  xác nhận.
- **Rủi ro link chết:** URL Facebook của trang cá nhân có thể đổi. Bấm thử trước khi commit.
- **Rollback:** revert commit `fix(ugc)`.
