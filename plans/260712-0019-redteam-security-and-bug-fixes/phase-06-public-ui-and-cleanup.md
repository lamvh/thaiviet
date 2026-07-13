# Phase 06 — Public UI bugs + cleanup

Context: [findings #10, #11, L1, L3, L4, L5, L6](reports/redteam-findings.md).

## Overview
- Priority: 🟡 MEDIUM (#10, #11) + ⚪ LOW (còn lại).
- Status: Not started.
- Gom các fix nhỏ, độc lập, ít rủi ro.

## Findings & fix
| # | File:line | Fix |
|---|-----------|-----|
| 10 | `ProjectsPage.tsx:83` | Nút "View Case Study" chết → đổi thành `<Link to={/projects/:slug}>` (hoặc `onClick` navigate) tới project spotlight. |
| 11 | `ProjectDetailPage.tsx:57` | Hero `<img src={heroImage}>` không guard → `{heroImage && <img .../>}` như templated path (`shared.tsx:42`). |
| L1 | `ProjectsPage.tsx:14` | Xoá `console.log("... projects", PROJECTS)`. |
| L3 | `App.tsx:29` | `path="*"` render HomePage → tạo `NotFoundPage` (404 UX + `<meta name=robots noindex>`), hoặc redirect `/`. Chốt với user. |
| L4 | `storage.ts:68` | Filename không dấu chấm → ext = cả tên. Guard: `const parts = name.split('.'); const ext = parts.length>1 ? parts.pop() : fallback`. |
| L5 | `vite.config.ts` CSP | Bỏ `https://api.github.com` khỏi `connect-src`; đồng bộ 3 nơi (vite meta, vercel.json, index.html) chỉ còn Supabase; thêm `'self'` cho `font-src` cho khớp. |
| L6 | build | Bundle 624 kB → `manualChunks`/lazy-load route admin (React.lazy) để tách. Optional. |

## Requirements
- CTA hoạt động; không render img rỗng; console sạch; URL sai có 404 đúng nghĩa; CSP tối thiểu.

## Related code files
- Modify: `src/pages/ProjectsPage.tsx`, `src/pages/ProjectDetailPage.tsx`, `src/App.tsx`, `src/lib/storage.ts`, `vite.config.ts`, `vercel.json`, `index.html`.
- Create (nếu chọn 404 page): `src/pages/NotFoundPage.tsx` + route.

## Implementation steps
1. #10: xác định slug spotlight; đổi button → Link. Verify điều hướng đúng.
2. #11: bọc điều kiện `heroImage`.
3. L1: xoá console.log.
4. L3: AskUserQuestion 404 page vs redirect; implement.
5. L4: sửa ext inference.
6. L5: dọn CSP 3 nơi; verify site vẫn gọi được Supabase, không vỡ font.
7. L6 (optional): `React.lazy` cho `/admin`; đo lại bundle.
8. `npm run build` + `vitest` PASS.

## Todo
- [ ] #10 CTA → Link
- [ ] #11 hero img guard
- [ ] L1 xoá console.log
- [ ] L3 404 page/redirect (chốt user)
- [ ] L4 ext inference guard
- [ ] L5 CSP dọn 3 nơi
- [ ] L6 lazy admin (optional)
- [ ] `npm run build` + `vitest` PASS
- [ ] README nếu thêm route 404

## Success criteria
CTA điều hướng; không img broken; console prod sạch; URL sai → 404; CSP chỉ Supabase; build vẫn PASS.

## Risk
- Dọn CSP quá tay chặn Supabase → test connect thực tế trước khi xong.
- Lazy admin đổi flow load → giữ Suspense fallback.

## Security
Siết CSP giảm bề mặt exfil khi có XSS. Không đổi quyền DB.

## Next steps
Làm cuối, sau khi 01–05 ổn định.
