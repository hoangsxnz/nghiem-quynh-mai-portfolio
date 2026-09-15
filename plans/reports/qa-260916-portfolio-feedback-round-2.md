# QA — Portfolio feedback round 2

Date: 2026-09-16
Plan: `plans/260915-2335-portfolio-feedback-round-2/`
Measured on the production build (`pnpm build` + `pnpm preview`) at 1440×900 with reveal animations
neutralised, unless a row says otherwise.

All 17 feedback items are done. Page height fell from 26.600px to 23.987px (−9,8%).

## 1. The 17 feedback items

| # | Feedback | Status | Evidence |
|---|----------|--------|----------|
| 1 | Đổ bóng + viền nét ảnh profile trang bìa | Done | `.hero__cutout` now carries three stacked `drop-shadow(0 0 1.5px var(--white))` plus `drop-shadow(10px 16px 22px …)`; outline follows the silhouette, not the image box |
| 2 | Trống góc phải giữa Bìa và About me | Done | Portrait bottom → About header: 760px → **115px** (target ≤120). Portrait widened 420→480px, `align-self: end`, About top padding trimmed, scroll cue moved into the text column |
| 3 | Trống giữa marquee tools và "Dự án nổi bật gần đây" | Done | 355px → **146px** (target ≤160) |
| 4 | Branding & Positioning quá sát mục trên | Done | Group subtitle → Branding header: 32px → **160px** (target 120–200) |
| 5 | Link file Excel gần ảnh minh hoạ hơn (Branding + Strategy) | Done | 130px/137px → **32px** each (target ≤48) |
| 6 | Text box Content Strategy quá gần văn bản trên | Done | Intro → chain grid: 0px → **56px** (target 40–80) |
| 7 | Link bài mẫu Content Ads gần ảnh minh hoạ hơn | Done | 149px → **32px** (target ≤48) |
| 8 | Trống quá nhiều giữa Contact và quote trên | Done | 387px → **195px** (target ≤200) |
| 9 | Làm mục Ngôn ngữ nổi bật hơn | Done | Three tilted cards on `--paper-2` with `--shadow`, language name in `--font-display`/`--red`, level as a maroon sticker. 3 across at 1440px, 1 at 390px |
| 10 | Thêm ảnh Robot Pika tách nền cạnh tiêu đề dự án | Done | `pika-robot-cutout.png`, 560×885 RGBA, alpha extrema `(0,255)`, all four corners alpha 0. Placed in the group header's right column, `alt=""` + `aria-hidden` |
| 11 | Content Ads: đổi ảnh sang kịch bản dài | Done | `pika-ads-script-long.png` (sheet "Kịch bản dài", scenes 1–6). Old `pika-ads-script.png` deleted; `grep -rn "pika-ads-script.png" src/` returns nothing |
| 12 | Social: 2 ảnh Feed xếp chồng, rút ngắn bố cục | Done | Feed block height 1.778px → **834px** (target ≤1.100). Offset pile at ≥900px, plain column below |
| 13 | Social: thay cụm văn bản -36,4% | Done | `statsNote` now reads "Số liệu lấy nguyên từ báo cáo kỳ 01-31/05…"; `stats.caption` keeps every original figure |
| 14 | UGC: 4 text box bên phải, 2 ảnh bên trái | Done | `.ugc__body` is a 5fr/7fr grid; facts are a 2×2 grid on the right. Block height ~1.300px → **656px** (target ≤900), no empty cells |
| 15 | UGC: bỏ cụm văn bản giải thích Facebook login | Done | `grep -rn "channelNote" src/` returns nothing — removed from JSON, type and markup together |
| 16 | UGC: 2 link TikTok + 2 link Facebook mới, kèm ảnh kênh | Done | 4 channel cards, 4 images, hrefs verified in the DOM (see §4) |
| 17 | AI First: bỏ 1 câu, thay câu ranh giới; Contact: đổi xưng hô | Done | `grep -rn "AI không ký tên\|Dưới đây chỉ liệt kê\|Nếu team" src/data/` returns nothing |

## 2. Rhythm, before and after

The root cause named in the plan was confirmed by measurement: every gap inside a section was either
0px or 160px, because `.section > .container > * + *` set `--section-y` while components set
`margin: 0` on their own root at the same specificity but later in the cascade.

The fix is three named steps in `tokens.css` (`--space-block`, `--space-related`, `--space-tight`)
plus two opt-in rules in `global.css` at three class levels, so a section can pull one child closer
without editing that component's scoped styles.

| Pair | Before | After | Target |
|------|--------|-------|--------|
| Strategy intro → chain grid | 0px | 56px | 40–80 |
| Branding evidence → file link | 130px | 32px | ≤48 |
| Strategy evidence → file link | 137px | 32px | ≤48 |
| Ads evidence → file link | 149px | 32px | ≤48 |
| Marquee → project eyebrow | 355px | 146px | ≤160 |
| Project subtitle → Branding header | 32px | 160px | 120–200 |
| Cover portrait → About header | 760px | 115px | ≤120 |
| AI First quote → Contact intro | 387px | 195px | ≤200 |

File link above/below ratio: 32px above, 355px below to the next section header — 1:11, well past the
required 3×. The link now reads as the tail of the image block.

### Section heights

| Section | Before | After | Δ |
|---------|--------|-------|---|
| hero | 1.100 | 1.032 | −6% |
| about | 4.004 | 3.668 | −8% |
| branding | 2.621 | 2.621 | 0% |
| strategy | 3.348 | 3.276 | −2% |
| ads | 1.761 | 1.633 | −7% |
| social | 5.758 | 4.792 | −17% |
| ugc | 3.399 | 2.539 | −25% |
| ai-first | 2.565 | 2.443 | −5% |
| contact | 1.035 | 939 | −9% |
| **page** | **26.600** | **23.987** | **−9,8%** |

Both sections that moved more than 10% are feedback items: social is the stacked feed (#12), ugc is
the two-column rebuild (#14). No section moved without being asked to.

## 3. Technical checks

| Check | Result |
|-------|--------|
| `pnpm check` | 0 errors, 0 warnings, 0 hints (42 files) |
| `pnpm build` | Succeeds |
| Console | 0 errors, 0 warnings |
| Horizontal overflow @390 / 768 / 1440 | `scrollWidth === clientWidth` at all three |
| Page height | 23.987px, down from 26.600px |
| `alt` coverage | 22 images, 0 missing. One deliberate `alt=""`: the decorative robot |
| Heading order | 45 headings h1→h4, no skipped level |
| `aria-labelledby` | 9/9 sections point at an element that exists |
| Nav anchors | 9/9 resolve to a real section |
| Built image weight | 32 webp, 1,21MB total, largest 149KB — under the 4MB / 300KB budgets |
| New source images | All six ≤300KB (188, 154, 171, 243, 216, 256KB) |
| Orphan from this round | `pika-ads-script.png` deleted; no references remain |

Responsive behaviour at 390px and 768px: the group header, UGC body, facts grid and languages grid
all collapse to one column; the feed pile reverts to a plain column; the robot drops to 140px centred.

## 4. Channel links

Read back from the built DOM:

| Channel | Platform | URL |
|---------|----------|-----|
| Bố và Linda | TikTok | `https://www.tiktok.com/@bovalinda` |
| con cá mùa hè | TikTok | `https://www.tiktok.com/@conca.muahe` |
| Ngọc Hân Thị Nguyễn | Facebook | `https://www.facebook.com/ngochan.smust/reels/` |
| Phạm Cẩm Liên | Facebook | `https://www.facebook.com/pham.camlien` |

The two old parent channels (`chau.chau.660751`, `tranhien9996`) were replaced, not supplemented, as
the feedback asked.

## 5. Privacy

The plan made the two Facebook channel screenshots a hard gate, because they are real parents'
profiles and children's faces appear in the reel thumbnails. The owner was asked before any image
work and confirmed permission had been obtained from both parents for a public portfolio. Both images
were then built.

Handling: cropped to the profile name and reel grid only. The macOS menu bar, dock, Chrome tab strip
and bookmark bar (which carried the photographer's own folder names) are gone, as is the Facebook top
nav with the photographer's account avatar. One image had a hover URL tooltip at the foot of the
screen; the crop excludes it. No thumbnail was enlarged or cropped closer on any child's face — the
grid keeps its original scale. The TikTok capture keeps its blurred work email, verified unreadable
at 100%.

## 6. Deviation from the plan

**UGC evidence images are stacked vertically, not as an offset pile.** Phase 5.1 asked to reuse the
Phase 4 overlap technique for the two UGC screenshots. Built that way, the upper card covered the
lower one completely — both measured at the same x/y — hiding the second caption. That caption names
a different sheet ("Quy trình làm việc UGCs") than the first ("CONCEPT"), so unlike the feed pair,
where Phase 4 deliberately deleted a duplicate caption, the hidden text carried real information.
The two cards now sit one above the other in the left column, which still satisfies feedback #14 and
keeps both captions readable.

## 7. Notes

- The Astro dev server does not reliably apply newly added `@media` rules over HMR; two measurement
  rounds read stale styles before this was caught. Every number in this report comes from
  `pnpm build` + `pnpm preview`, not from the dev server.
- A dev server orphaned from an earlier session was still holding port 4321 with a day-old build. It
  was stopped and restarted rather than moved to another port.
- `prefers-reduced-motion` was not re-tested in the browser: the harness has no media emulation here.
  The motion block in `global.css` was not touched this round, so the round-1 result still stands.
  Worth a manual pass before publishing.

## Unresolved questions

1. Five source images from round 1 still exceed 300KB (`photo-mai-cafe.png` 942KB,
   `photo-mai-cutout.png` 666KB, `sheet-content-plan.png` 578KB, `pika-feed-01.jpg` 344KB,
   `pika-post-sample.png` 319KB). The built webp output is well inside budget, so this costs the
   repo rather than the visitor. Worth recompressing?
2. The 13 orphaned images from round 1 are still in place, per the round-1 decision to leave them to
   the owner. Should they now be deleted?
3. `astro.config.mjs` still has `site: 'https://example.com'`. A real domain is needed before publish.
4. FPS during scroll over the cover was not profiled; the harness has no profiler. The four stacked
   `drop-shadow` filters are a one-off paint cost on a static image, so the risk is low, but it is
   unmeasured.
