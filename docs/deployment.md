# Deployment

Trang được deploy tĩnh lên **Cloudflare Pages**.

| Mục | Giá trị |
|---|---|
| Platform | Cloudflare Pages |
| Project | `nghiem-quynh-mai-portfolio` |
| Production URL | https://nghiem-quynh-mai-portfolio.pages.dev |
| Production branch | `main` |
| Thư mục build | `dist/` |

## Deploy

Cần `wrangler` đã đăng nhập (`wrangler login`).

```bash
pnpm build
wrangler pages deploy dist --project-name=nghiem-quynh-mai-portfolio --branch=main --commit-dirty=true
```

Mỗi lần deploy tạo thêm một URL preview dạng `https://<id>.nghiem-quynh-mai-portfolio.pages.dev`.
URL production ở trên luôn trỏ tới bản deploy mới nhất của branch `main`.

## Rollback

Xem danh sách bản deploy và lấy lại bản cũ:

```bash
wrangler pages deployment list --project-name=nghiem-quynh-mai-portfolio
wrangler pages deployment tail --project-name=nghiem-quynh-mai-portfolio
```

Để rollback, vào Cloudflare Dashboard → Workers & Pages → `nghiem-quynh-mai-portfolio`
→ Deployments → chọn bản cũ → **Rollback to this deployment**.

Bản deploy gần nhất: `d3a757c3` (2026-09-16), gồm 44 element cut-out ở lớp nền.

Project từng nằm trên một tài khoản Cloudflare khác và đã được chuyển sang tài khoản
hiện tại. Vì subdomain `.pages.dev` là duy nhất trên toàn Cloudflare, muốn giữ nguyên
tên thì phải xoá bên cũ trước rồi mới tạo lại được bên mới, và lịch sử deploy cũ không
chuyển theo.

Chạy `wrangler whoami` để biết đang đăng nhập tài khoản nào và lấy account ID.

## Lưu ý về `site`

`astro.config.mjs` có trường `site`. Giá trị này sinh ra thẻ `canonical`, `og:url` và `og:image`.
Nếu sau này gắn tên miền riêng, phải sửa `site` thành tên miền đó rồi build và deploy lại,
nếu không link preview trên Facebook/Zalo/LinkedIn vẫn trỏ về `.pages.dev`.
