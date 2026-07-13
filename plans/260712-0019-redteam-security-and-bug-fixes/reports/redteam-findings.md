# Red-team findings — ThaiViet site

Date: 2026-07-12 · Scope: toàn repo (~6.6k LOC) · Build + test: PASS (45 tests).
Method: 4 adversarial review agents (lib/data, admin CMS, public pages, build/security). Top findings verified nguyên văn tại source.

Severity: 🔴 critical (chặn production) · 🟠 high · 🟡 medium · ⚪ low.
Fix mapping → phase file trong cùng plan.

| # | Sev | File:line | Lỗi | Phase |
|---|-----|-----------|-----|-------|
| 1 | 🔴 | `AdminAuthGate.tsx:5-6,20` + `supabase.ts:12` + `admin-content-store.tsx:383` | Admin gate chỉ là hardcode `admin`/`admin` phía client; mọi write qua anon key, không session. RLS là control duy nhất & không kiểm chứng được. | 01 |
| 2 | 🟠 | `useContactForm.ts:24-30` | Form Contact không POST đi đâu — `setTimeout` giả success. Mọi lead mất. | 02 |
| 3 | 🟠 | `admin-content-store.tsx:375-395,190` | Lost-update: `publish` capture `state.content` cũ, `MARK_PUBLISHED` ghi đè working copy → edit trong lúc save bị revert âm thầm. | 03 |
| 6 | 🟡 | `admin-content-store.tsx:311-324,383` | Multi-admin ghi đè nhau: upsert cả cột `data`, không so `base`, không refetch. | 03 |
| 4 | 🟡 | `content-defaults.ts:23` | `deepMerge` để `null` lọt qua thay vì fallback default → consumer `.replace`/`.map` trên null → white screen. | 04 |
| 5 | 🟡 | `content-defaults.ts:25` | `deepMerge` chỉ duyệt `Object.keys(base)` → key có ở DB nhưng thiếu ở bundled default bị drop âm thầm mỗi lần load. | 04 |
| 7 | 🟡 | `migrate-services.ts:78` | `sd.page.meta.slug` deref không guard → page thiếu `meta` throw; bị swallow trong load → site kẹt ở fallback. | 04 |
| 8 | 🟡 | `content-schema.ts` | Video URL (`videoSrc`/`HomeVideo.src`/`Reel.src`) không validate scheme; `http://` lọt → mixed-content, render thẳng `<iframe src>` không `sandbox`. | 05 |
| 9 | 🟡 | `MediaLibrary.tsx:49-61` | Xoá media không check reference trong content → public 404 ảnh/video. | 05 |
| 10 | 🟡 | `ProjectsPage.tsx:83` | Nút "View Case Study" chết — không `onClick`/`Link`. | 06 |
| 11 | 🟡 | `ProjectDetailPage.tsx:57` | Hero `<img src>` không guard `undefined`. | 06 |
| L1 | ⚪ | `ProjectsPage.tsx:14` | `console.log` dump project array ship production. | 06 |
| L2 | ⚪ | `useContactForm.ts:10-13` | Toast `setTimeout` không clear → toast chồng + setState sau unmount. | 02 |
| L3 | ⚪ | `App.tsx:29` | Catch-all `path="*"` render HomePage cho URL sai (soft 404). | 06 |
| L4 | ⚪ | `storage.ts:68` | Filename không dấu chấm → "ext" = cả tên (cosmetic). | 06 |
| L5 | ⚪ | `vite.config.ts` CSP | Còn cho `https://api.github.com` dù không dùng GitHub nữa. | 06 |
| L6 | ⚪ | build | Bundle chính 624 kB (>500 kB warn) — code-split. | 06 (optional) |

## Điểm tốt (verified — no action)
- `.env` gitignored, không track; không có `service_role` key trong bundle (chỉ publishable anon key — safe to ship).
- `npm audit --omit=dev`: 0 vuln.
- Không có `dangerouslySetInnerHTML`/`innerHTML` ở đâu.
- Iframe embed được host allow-list (`media-embed.ts`) che → không spoof/`javascript:` injection.

## Caveat quan trọng
Không có DB access trong review → **không kiểm chứng được RLS policy thật** của `site_content` và bucket `media`. Finding #1 giả định "để Save chạy được thì anon phải ghi được". Bước đầu phase 01 là **xác nhận policy hiện tại trên Supabase dashboard**.

## Không tìm thấy trong repo (ảnh hưởng plan)
- Không có `supabase/migrations/` — RLS/policy chỉ nằm trên dashboard.
- Không có bảng `contact_submissions` / edge function → phase 02 phải tạo mới.
