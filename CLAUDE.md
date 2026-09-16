# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Portfolio tĩnh một trang của Nghiêm Quỳnh Mai. Astro 7 static, GSAP + Lenis cho chuyển động,
nội dung tiếng Việt.

## Lệnh

```bash
pnpm check   # astro check — type check, phải sạch trước khi báo xong
pnpm build   # astro build → dist/
pnpm dev     # cổng 4321 thường đã bận, dùng --port 4399
```

Không có test. Xác minh bằng `pnpm check` và `pnpm build`; thay đổi ảnh hưởng giao diện thì
mở trang thật trong trình duyệt và đo, đừng chỉ nhìn code. Lỗi hay gặp nhất là tràn ngang và
phần tử nền đè lên chữ — hai thứ này build không bắt được.

Không có ESLint/Prettier. `astro check` là cổng kiểm tra duy nhất.

## Hai ràng buộc dễ vi phạm

**Ảnh chỉ đi qua `src/lib/image-map.ts`.** JSON lưu mỗi tên file (`"pika-feed-01.jpg"`), markup
không bao giờ `import` asset trực tiếp. Resolver gom phẳng mọi thư mục con, nên **tên file phải
duy nhất trên toàn `src/assets/images/`**. Gõ sai tên thì build dừng với `Unknown image "..."`
— đó là chủ ý, đừng bọc try/catch để nó đi tiếp.

**Component chỉ đọc `var(--*)`, không khai báo màu thô.** `src/styles/tokens.css` là nguồn duy
nhất. Thêm màu mới thì thêm token, không hardcode hex trong `<style>` của component. Các giá trị
màu hiện tại đã đo tương phản WCAG; `--muted` từng phải chỉnh đậm lên vì trượt AA ở cỡ chữ 13px.

## Quyết định gắn với tiếng Việt

- `--lh-display: 1.08`, không hạ xuống nữa. Dấu thanh chồng (Ê, Ỳ, Ễ) bị cắt ở cap line và đụng
  dòng trên khi thấp hơn.
- Không `text-transform: uppercase` cho câu chữ tiếng Việt — dấu thanh thành không đọc được ở cỡ
  nhỏ. Nhãn tiếng Anh thì tự opt-in tại chỗ.

## Chuyển động

Mọi hiệu ứng nằm sau `prefers-reduced-motion: no-preference`. Parallax ở một `matchMedia` riêng
kèm điều kiện bề rộng — gộp chung sẽ khiến mỗi lần resize qua 768px phá và dựng lại Lenis cùng
toàn bộ headline đã tách chữ.

## Git và deploy

Commit thẳng lên `main`, theo conventional commits, không nhắc tới AI trong message.

**Tài khoản GitHub.** Repo thuộc `hoangsxnz`, nhưng tài khoản gh mặc định của máy là
`sonth1-hblab` (chỉ có quyền READ trên repo này nên push sẽ bị từ chối). Khi cần push:

```bash
gh auth switch --user hoangsxnz    # trước khi push
git push
gh auth switch --user sonth1-hblab # LUÔN trả lại ngay sau khi push xong
```

Đổi sang `hoangsxnz` chỉ để push, không để nguyên như vậy. Trả về `sonth1-hblab` kể cả khi
push thất bại.

**Push lên `main` là deploy thẳng lên production.** `.github/workflows/deploy.yml` chạy check,
build rồi đẩy lên Cloudflare Pages. Không có bước review trung gian.

Đổi sang domain riêng thì phải sửa `site` trong `astro.config.mjs`, nếu không thẻ canonical và
ảnh preview khi share vẫn trỏ về `.pages.dev`.

## Tài liệu chi tiết

Đọc khi cần, đừng đoán:

- @docs/design-guidelines.md — token, tương phản, typography, spec component và chuyển động
- @docs/tech-stack.md — stack đã chốt, thứ đã loại, quy tắc tích hợp Lenis với GSAP
- @docs/deployment.md — Cloudflare Pages, trigger deploy, cách rollback
- @docs/content-source.md — nguồn gốc từng khối chữ và từng ảnh
- @README.md — hướng dẫn chủ trang tự sửa `src/data/*.json`
