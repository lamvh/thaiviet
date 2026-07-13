# Phase 01 — Admin auth thật + RLS

Context: [findings #1](reports/redteam-findings.md) · `AdminAuthGate.tsx`, `supabase.ts`, `admin-content-store.tsx`, `storage.ts`.

## Overview
- Priority: 🔴 CRITICAL — chặn production.
- Status: Not started.
- Vấn đề: gate `/admin` chỉ là hardcode `admin`/`admin` phía client (bundle ship 2 string này); mọi write Supabase đi qua anon key, không có auth session. Ai cũng set `sessionStorage['tv-admin-temp-auth']='1'` hoặc gọi thẳng `supabase.from(...).upsert()` từ console. Nếu RLS cho `anon` ghi → content + media world-writable.

## Key insights
- App không hề gọi `signInWith*` → không phân biệt admin vs khách ở tầng DB.
- `supabase-js` tự lưu session + gắn JWT vào mọi request sau `signInWithPassword` → RLS `auth.role()='authenticated'` mới có tác dụng.
- Chỉ 1 admin (client) → không cần bảng users phức tạp; tạo 1 user trong Supabase Auth là đủ.

## Requirements
- Functional: đăng nhập /admin bằng Supabase Auth (email+password); session persist + logout; chỉ user đã auth mới ghi được content/media.
- Non-functional: không còn credential nào trong client bundle; anon chỉ read.

## Architecture
Client `signInWithPassword` → supabase-js giữ session → tất cả `from().upsert()` / `storage.upload()` mang JWT → RLS enforce. `AdminAuthGate` chuyển từ so-sánh-string sang lắng nghe `supabase.auth.getSession()` / `onAuthStateChange`.

## Related code files
- Modify: `src/pages/admin/AdminAuthGate.tsx` (thay hardcode bằng Supabase Auth form + session listener), xoá `TEMP_USER/TEMP_PASS/TEMP_AUTH_KEY`.
- Modify: `src/pages/admin/AdminPage.tsx` (nút Logout → `supabase.auth.signOut()`).
- Read: `src/lib/supabase.ts` (client dùng lại, thêm helper `getSession` nếu cần).
- Create: `supabase/migrations/0001_site_content_rls.sql` (RLS policy — apply manual).
- Create: `supabase/migrations/0002_media_bucket_policy.sql` (storage policy).

## Implementation steps
1. **Xác nhận policy hiện tại** trên Supabase dashboard (Authentication → Policies) cho `site_content` + bucket `media`. Ghi lại policy đang có trước khi đổi.
2. Tạo 1 admin user: Supabase dashboard → Authentication → Users → Add user (email+password). (Hoặc SQL/CLI.)
3. Viết `AdminAuthGate.tsx`:
   - state `session` khởi từ `await supabase.auth.getSession()`; subscribe `supabase.auth.onAuthStateChange`.
   - form gọi `supabase.auth.signInWithPassword({ email, password })`; hiện `error.message` nếu fail.
   - `if (!session) return <LoginForm/>` else render children.
   - bỏ toàn bộ sessionStorage flag + TEMP_* constants.
4. `AdminPage.tsx`: thêm Logout gọi `supabase.auth.signOut()`.
5. Viết SQL migration RLS:
   - `site_content`: `SELECT` cho `anon,authenticated`; `INSERT/UPDATE` chỉ `authenticated`.
   - bucket `media`: `SELECT` public; `INSERT/UPDATE/DELETE` chỉ `authenticated`.
6. Apply migration (manual — `supabase db push` hoặc dán SQL vào dashboard). Đánh dấu bước này cần user.
7. Verify: đăng xuất → thử `supabase.from('site_content').upsert(...)` trong console → phải bị RLS chặn (403). Đăng nhập → Save chạy.

## Todo
- [ ] Xác nhận + ghi lại policy hiện tại
- [ ] Tạo admin user
- [ ] Rewrite AdminAuthGate dùng Supabase Auth
- [ ] Logout ở AdminPage
- [ ] SQL RLS content + storage
- [ ] Apply migration (user)
- [ ] Verify anon bị chặn, authed ghi được
- [ ] `npm run build` PASS
- [ ] Cập nhật README (mục admin/auth)

## Success criteria
Anon (chưa login) không upsert được `site_content` và không upload/xoá được media (403). Không còn string credential trong `dist`. Login/logout hoạt động, session persist qua reload.

## Risk
- Apply RLS sai → khoá luôn admin (authed cũng không ghi). Mitig: test policy với authed trước khi bỏ policy cũ; giữ SQL rollback.
- Đổi gate làm vỡ flow load nếu component treo chờ session. Mitig: render loading state khi `session === undefined`.

## Security
Đây là fix an ninh chính. Sau phase này mọi write mới thực sự được bảo vệ ở tầng DB — các phase 03/05 dựa trên giả định "admin đã authenticated".

## Next steps
Chốt hướng auth với user (AskUserQuestion) trước khi code. Sau đó unblock 02–06.
