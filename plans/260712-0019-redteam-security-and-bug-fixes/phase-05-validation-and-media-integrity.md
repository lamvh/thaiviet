# Phase 05 — Validate video URL + media delete reference-check

Context: [findings #8, #9](reports/redteam-findings.md) · `src/lib/content-schema.ts`, `src/pages/admin/sections/MediaLibrary.tsx`, `src/lib/storage.ts`.

## Overview
- Priority: 🟡 MEDIUM.
- Status: Not started.
- #8: field video (`videoSrc`, `HomeVideo.src`, `Reel.src`) không validate scheme trong `validateContent` (ảnh thì có `isHttps`). `http://` lưu sạch → production https mixed-content chặn, video im lặng fail. Render thẳng `<iframe src>` (ProjectDetailPage.tsx:117, VlogCard.tsx:10) không `sandbox`.
- #9: `MediaLibrary` xoá file chỉ `deleteMedia([path])`, không quét `content` xem URL còn dùng → public 404 ảnh/video.

## Key insights
- `content-schema.ts` đã có `isHttps` cho ảnh — chỉ cần thêm nhánh cho video field theo đúng pattern.
- Reference-check #9: cần duyệt object `content` tìm `item.url` (đệ quy string match). Có thể tái dùng để cảnh báo (không chặn cứng) — hiện warning generic; nâng thành "file này đang dùng ở N chỗ".
- `iframe` embed thêm `sandbox` (allow-scripts allow-same-origin cho player) tăng phòng thủ chiều sâu, dù host allow-list đã che (`media-embed.ts`).

## Requirements
- `validateContent` báo lỗi khi video URL không `https://`.
- Xoá media hiển thị cảnh báo cụ thể nếu URL còn được tham chiếu trong content.
- `<iframe>` embed có `sandbox` phù hợp.

## Related code files
- Modify: `src/lib/content-schema.ts` — thêm `isHttps` cho các video field (project videoSrc, homepage HomeVideo.src, reels src).
- Modify: `src/pages/admin/sections/MediaLibrary.tsx` — trước khi delete, quét content tìm reference; nếu có, confirm nêu rõ vị trí.
- Create (helper): `src/lib/find-media-references.ts` — duyệt đệ quy content, trả list path chứa URL. (Giữ <200 dòng, kebab-case.)
- Modify: `src/components/cards/VlogCard.tsx`, `src/pages/ProjectDetailPage.tsx` — thêm `sandbox` cho iframe.
- Tests: thêm case validate video URL + find-references.

## Implementation steps
1. `content-schema.ts`: với mỗi video field, `if (v && !isHttps(v)) errors.push('Video URL phải bắt đầu https:// (…field)')`. Đồng bộ với `saveEdit` guard nếu editor cũng cần chặn trước khi commit.
2. `find-media-references.ts`: `findMediaReferences(content, url): string[]` — walk object/array, so string `=== url` (hoặc `includes` cho URL có transform), trả breadcrumb path.
3. `MediaLibrary.remove`: `const refs = findMediaReferences(content, item.url); if (refs.length) confirm('File đang dùng ở: '+refs.join(', ')+'. Vẫn xoá?')`.
4. iframe `sandbox="allow-scripts allow-same-origin allow-presentation"` (đủ cho YouTube/Vimeo player) + `allow` cho fullscreen như hiện có.
5. Tests: video URL http → có error; https → không; find-references trả đúng path.
6. `npm run build` + `vitest`.

## Todo
- [ ] Validate scheme cho video field
- [ ] find-media-references helper
- [ ] MediaLibrary confirm có reference
- [ ] iframe sandbox
- [ ] Tests
- [ ] `npm run build` + `vitest` PASS

## Success criteria
Lưu video `http://` bị chặn kèm message; xoá file đang dùng cảnh báo đúng vị trí; iframe có sandbox; test phủ.

## Risk
- `sandbox` quá chặt làm vỡ player nhúng. Mitig: test YouTube+Vimeo thực tế; nới flag tối thiểu cần thiết.
- Reference-check dựa string match có thể sót URL đã transform (thumbnail vs full). Mitig: so trên base path/không query; ghi rõ giới hạn.

## Security
Chặn mixed-content + giảm bề mặt iframe. Không thay quyền DB.

## Next steps
Độc lập. Cùng lib với 04.
