# Phase 04 — deepMerge + migrate-services robustness

Context: [findings #4, #5, #7](reports/redteam-findings.md) · `src/lib/content-defaults.ts`, `src/lib/migrate-services.ts`.

## Overview
- Priority: 🟡 MEDIUM — data-loss/white-screen âm thầm.
- Status: Not started.
- #4 (`content-defaults.ts:23`): `over === undefined ? base : over` — `null` từ DB lọt qua thay vì fallback → consumer `.replace`/`.map` trên null → white screen (Header.tsx:52, HomePage.tsx:28,252, ContactPage.tsx:62).
- #5 (`content-defaults.ts:25`): loop chỉ `Object.keys(base)` → key có ở DB nhưng thiếu ở bundled default bị drop mỗi lần load (edit vanish).
- #7 (`migrate-services.ts:78`): `sd.page.meta.slug`/`.icon` deref — page thiếu `meta` throw; throw bị swallow ở load path (`.then` không có reject handler) → site kẹt ở fallback.

## Key insights
- Chỗ khác trong repo đã coi `meta` là optional (`validate-page.ts` dùng `meta?.`), chỉ dòng 78 quên.
- #4 fix: coi `null` như `undefined` khi base là object/plain → fallback. Nhưng phải giữ ý định "editor ghi '' để xoá field" (empty string vẫn là giá trị hợp lệ, không fallback). Chỉ `null`/`undefined` mới fallback.
- #5 fix: union key = `Object.keys(base) ∪ Object.keys(over)`; với key chỉ có ở `over`, lấy `over[key]` (không có default để merge).

## Requirements
- Merge không bao giờ trả `null` ở nơi default là object/array (tránh crash consumer).
- Không drop key DB-only.
- `migrateServices` không throw với page malformed; page thiếu meta được heal.

## Related code files
- Modify: `src/lib/content-defaults.ts` — `deepMerge` xử lý `null` + union keys.
- Modify: `src/lib/migrate-services.ts:78` — guard `sd.page.meta` (`?? {}`), dùng optional chaining.
- Modify/verify: `src/lib/site-content-context.tsx` — thêm `.catch` cho load `.then` để lỗi merge không nuốt âm thầm (log + fallback tường minh).
- Tests: `src/lib/__tests__/` — thêm case cho deepMerge null/DB-only key + migrate page thiếu meta.

## Implementation steps
1. `deepMerge`:
   - Nếu `over === undefined || over === null` → return `base`. (Chỉ khi cả hai không phải plain-object; giữ semantics array/primitive replace cho giá trị non-null.)
   - Khi cả hai plain-object: duyệt `new Set([...Object.keys(base), ...Object.keys(over)])`; với key chỉ ở over, `out[key] = over[key]`.
   - Cẩn thận: giữ nguyên hành vi "array replace wholesale" và "'' là giá trị hợp lệ".
2. `migrate-services.ts:78`: `const m = sd.page.meta ?? {}; const meta = { ...m, slug: m.slug || sd.slug, icon: m.icon || icon }`.
3. `site-content-context.tsx`: `.then(...).catch(err => { console.error('[content] load/merge failed', err); /* giữ fallback bundled */ })`.
4. Tests:
   - `deepMerge(DEFAULT, { contact: { phone: null } })` → phone = default (không null).
   - `deepMerge(DEFAULT, { extraKey: {a:1} })` → giữ `extraKey`.
   - `migrateServices([{ ...page không meta }])` → không throw, slug/icon đúng.
5. `npm run build` + `vitest`.

## Todo
- [ ] deepMerge: null→fallback, union keys
- [ ] migrate-services meta guard
- [ ] load path .catch tường minh
- [ ] Tests cho 3 case
- [ ] `npm run build` + `vitest` PASS

## Success criteria
DB row có `null`/key lạ/page thiếu meta đều load được, không crash, không mất dữ liệu; test phủ 3 case.

## Risk
- Đổi `deepMerge` có thể ảnh hưởng field mà editor cố tình ghi `null`? Kiểm: editors ghi `''`/`[]`, không ghi `null` → an toàn. Ghi rõ giả định này trong test.
- Union keys có thể giữ key rác cũ từ DB. Chấp nhận — thà giữ còn hơn drop; dọn bằng migration khi cần.

## Security
Không ảnh hưởng quyền. Robustness thuần.

## Next steps
Độc lập. Nên làm cùng đợt với 05 (cùng lib).
