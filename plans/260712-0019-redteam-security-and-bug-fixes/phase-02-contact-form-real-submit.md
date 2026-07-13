# Phase 02 — Contact form gửi thật + toast cleanup

Context: [findings #2, L2](reports/redteam-findings.md) · `src/hooks/useContactForm.ts`, `src/pages/ContactPage.tsx`.

## Overview
- Priority: 🟠 HIGH — path chuyển đổi duy nhất đang mất trắng lead.
- Status: Not started.
- Vấn đề: `submit()` chỉ `setTimeout(1200)` rồi `form.reset()` + toast success. Không có POST (`// TODO`). Mọi yêu cầu báo giá biến mất, khách tưởng đã gửi.
- Phụ (L2): `show()` gọi `setTimeout` không lưu/không clear → toast chồng nhau + setState sau unmount.

## Key insights
- Stack thuần frontend + Supabase, không backend riêng → cách hợp stack nhất: insert 1 bảng Supabase `contact_submissions`, RLS cho `anon` **chỉ INSERT**, admin đọc.
- Cần AskUserQuestion: (a) Supabase table [khuyến nghị], (b) Formspree/third-party, (c) email edge function.

## Requirements
- Functional: submit thật, chỉ báo success khi ghi thành công; báo lỗi rõ khi fail; chặn double-submit (đã có `disabled={submitting}`).
- Non-functional: không lộ dữ liệu người khác (anon không SELECT được submissions).

## Architecture (phương án Supabase table)
Form → `supabase.from('contact_submissions').insert({...})` → RLS anon-insert-only. Admin xem lead qua section mới `/admin` (đọc bằng authenticated).

## Related code files
- Modify: `src/hooks/useContactForm.ts` — thay `setTimeout` bằng `await insert`; try/catch; lưu toast timer trong `useRef` + clear (fix L2) + cleanup unmount.
- Create: `supabase/migrations/0003_contact_submissions.sql` — table + RLS.
- (Optional, theo CLAUDE.md) Create: `src/pages/admin/sections/ContactSubmissions.tsx` + đăng ký sidebar/AdminPage để admin đọc lead.
- Modify: `README.md` (route/section mới), `docs/` nếu có.

## Implementation steps
1. AskUserQuestion chọn phương án lưu.
2. (Supabase) SQL: `create table contact_submissions (id uuid pk default gen_random_uuid(), name text, email text, message text, created_at timestamptz default now())`; RLS: policy `INSERT` cho `anon`; `SELECT` cho `authenticated`.
3. `useContactForm.ts`:
   - `submit` async: sau validate → `setSubmitting(true)` → `const { error } = await supabase.from('contact_submissions').insert({name,email,message})`.
   - `error` → `show(lỗi, false)`; success → `show(thanks, true)` + `form.reset()`; `finally setSubmitting(false)`.
   - `show()`: `if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(...)`; thêm `useEffect(() => () => clearTimeout(timer.current), [])`.
4. Apply migration (manual — user).
5. (Optional) Section admin đọc submissions theo pattern hiện có (`AdminSidebar` + `META` + render).
6. Verify: submit ẩn danh → row xuất hiện; anon `select` từ console bị chặn.

## Todo
- [ ] Chốt phương án lưu (user)
- [ ] SQL contact_submissions + RLS
- [ ] Rewrite submit() async có error handling
- [ ] Fix toast timer (clear + unmount cleanup)
- [ ] Apply migration (user)
- [ ] (Optional) Admin section đọc lead + wire dashboard
- [ ] `npm run build` + `vitest` PASS
- [ ] Cập nhật README/docs

## Success criteria
Lead thật được lưu; success chỉ hiện khi ghi ok; fail hiện lỗi. Anon không đọc được submissions. Không còn React warning setState-after-unmount từ toast.

## Risk
- Nếu chọn Supabase table mà RLS SELECT lỡ mở cho anon → lộ email/tin nhắn khách. Mitig: test anon SELECT bị chặn.
- Spam form (không captcha). Chấp nhận ở mức này; ghi vào unresolved.

## Security
Anon INSERT-only; validate email/required đã có. Cân nhắc rate-limit/honeypot sau.

## Next steps
Độc lập các phase khác. Nếu làm admin section đọc lead → tuân rule wire-dashboard.

## Unresolved
- Có cần chống spam (honeypot/captcha) không?
