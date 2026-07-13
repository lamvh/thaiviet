# Plan — Red-team security & bug fixes

Fix toàn bộ findings từ red-team review (2026-07-12). Nguồn: [reports/redteam-findings.md](reports/redteam-findings.md).

Build baseline: `npm run build` (tsc strict + vite) + `vitest` đều PASS. Mỗi phase kết thúc phải giữ nguyên trạng thái PASS.

## Nguyên tắc
- Không commit/không tạo branch (user tự xử lý git).
- Mỗi thay đổi feature/screen: cập nhật docs + wire vào admin dashboard (CLAUDE.md dự án).
- Không rename content key nếu chưa có migration path (`withContentDefaults` merge).

## Phases (ưu tiên trên xuống)

| Phase | Sev | Nội dung | Status |
|-------|-----|----------|--------|
| [01](phase-01-admin-auth-and-rls.md) | 🔴 | Supabase Auth cho /admin + RLS (content + storage). Bỏ hardcode creds. | ✅ Code done · SQL cần apply |
| [02](phase-02-contact-form-real-submit.md) | 🟠 | Contact form POST thật (`contact_submissions` + RLS) + toast cleanup + Leads viewer. | ✅ Code done · SQL cần apply |
| [03](phase-03-content-store-correctness.md) | 🟠🟡 | Sửa lost-update khi Save + conflict detection multi-admin. | ✅ Done + test |
| [04](phase-04-content-merge-and-migration-robustness.md) | 🟡 | `deepMerge` null/key-drop + `migrate-services` meta guard. | ✅ Done + test |
| [05](phase-05-validation-and-media-integrity.md) | 🟡 | Validate video URL scheme + media reference-check. (`sandbox` iframe: **bỏ** — allow-list đã che.) | ✅ Done + test |
| [06](phase-06-public-ui-and-cleanup.md) | 🟡⚪ | Dead CTA→/our-work, hero guard, xoá console.log, 404 page, CSP (bỏ github + **thêm frame-src YouTube/Vimeo/TikTok**), ext infer. | ✅ Done |

## Dependencies
- Phase 01 & 02 tạo file SQL trong `supabase/migrations/` (mới) — cần apply qua Supabase CLI/dashboard (ngoài repo). Đánh dấu rõ bước manual.
- Phase 01 nên xong trước khi tin tưởng bất kỳ write path nào (03, 05 dựa trên "admin đã authenticated").
- Phase 03/04/05/06 độc lập nhau, chạy song song được sau 01.

## Quyết định (chốt 2026-07-12)
1. **Auth (P01):** Supabase Auth, 1 tài khoản admin (form login đơn giản, có session → RLS enforce).
2. **Contact (P02):** lưu Supabase table `contact_submissions` + viewer admin **Leads**.
3. **Migration:** apply qua Supabase CLI — **nhưng CLI chưa cài** trên máy → xem "Bước manual còn lại".

## Trạng thái build/test
`npm run build` PASS (tsc strict + vite). `vitest` **58/58 PASS** (thêm 13 test: deepMerge null/key-drop, migrate meta-guard, lost-update reducer, video validation, find-media-references).

## Bước manual còn lại (cần user — code đã xong)
1. **Cài + link Supabase CLI:** `brew install supabase/tap/supabase` → `supabase login` → `supabase link --project-ref <ref>`.
2. **Apply migration:** `supabase db push` — HOẶC nhanh hơn: Supabase dashboard → SQL Editor → dán lần lượt 3 file trong `supabase/migrations/`.
3. **Tạo admin user:** dashboard → Authentication → Users → Add user (email + password) = tài khoản đăng nhập `/admin`.
4. **Kiểm bucket `media`** tồn tại & public (đúng tên `VITE_SUPABASE_MEDIA_BUCKET`).
5. **Verify:** đăng xuất → `supabase.from('site_content').upsert(...)` trong console phải bị 403; đăng nhập → Save chạy; submit form contact → row hiện trong admin **Leads**.

⚠️ **Tới khi apply xong migration RLS, lỗ hổng #1 vẫn mở** nếu policy hiện tại cho anon ghi. Code sẵn sàng; RLS là mảnh ghép cuối.

## Definition of done
Code: ✅ tất cả phase, build PASS, 58 tests PASS, docs (`README.md`) cập nhật, dashboard wired (**Leads** section). Còn lại: 5 bước manual apply Supabase ở trên.
