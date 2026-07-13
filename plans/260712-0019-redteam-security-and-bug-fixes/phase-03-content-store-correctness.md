# Phase 03 — Content store: lost-update + conflict detection

Context: [findings #3, #6](reports/redteam-findings.md) · `src/pages/admin/admin-content-store.tsx`.

## Overview
- Priority: 🟠 HIGH (#3) + 🟡 MEDIUM (#6).
- Status: Not started.
- #3 Lost-update: `publish` là async closure capture `state.content` của lần render lúc bấm Save. Sau `await` upsert, dispatch `MARK_PUBLISHED { content: state.content }` (snapshot cũ); reducer `:190` chạy `content: clone(a.content), dirty:false` → **ghi đè working copy về snapshot cũ**. Edit trong lúc save bị revert âm thầm, báo "Saved ✓".
- #6 Multi-admin: load chỉ 1 lần khi mount, `publish` upsert cả cột `data` vô điều kiện, không so `state.base` (field vốn ghi chú "conflict detection compares against this" nhưng không dùng). A save → B save (bản cũ) → mất thay đổi A.

## Key insights
- `api` object (chứa `publish`) rebuild mỗi render → `publish` bắt `state` tại render đó. In-flight save không thấy edit mới.
- Fix #3: đừng dùng snapshot đóng băng — hoặc (a) truyền content đã upsert vào MARK_PUBLISHED nhưng **không đụng `content` sống**, chỉ set `base` + tính lại `dirty` bằng so sánh; hoặc (b) dùng `useRef` trỏ state mới nhất.
- Fix #6: gửi kèm `updated_at` guard (optimistic concurrency): `.eq('updated_at', loadedUpdatedAt)`; nếu 0 row → cảnh báo "ai đó vừa sửa, reload".

## Requirements
- Save không được revert edit thực hiện trong lúc đang lưu.
- Sau Save, `dirty` phản ánh đúng: false nếu không có edit mới, true nếu có.
- Phát hiện remote đã đổi (concurrent admin) và cảnh báo thay vì ghi đè mù.

## Architecture
Dùng `stateRef = useRef(state)` cập nhật mỗi render. `publish` đọc `stateRef.current.content` khi dispatch kết quả. `MARK_PUBLISHED` chỉ cập nhật `base = clone(saved)` và `dirty = !deepEqual(base, content_hiện_tại)`; **không** overwrite `content`. Thêm cột/field `updatedAt` đã load để guard upsert.

## Related code files
- Modify: `src/pages/admin/admin-content-store.tsx`:
  - `AdminContentProvider`: thêm `stateRef`.
  - `publish`: capture `const snapshot = stateRef.current.content` tại thời điểm upsert; lưu `loadedUpdatedAt` (từ HYDRATE) để guard.
  - reducer `MARK_PUBLISHED`: set `base`, tính `dirty` so với `content` sống, **bỏ** `content: clone(...)`.
  - `HYDRATE`: lưu `remoteUpdatedAt` vào state.

## Implementation steps
1. Thêm `stateRef` + `useEffect(() => { stateRef.current = state })` (hoặc gán trực tiếp trong render).
2. Lưu `updated_at` remote khi HYDRATE (select thêm `updated_at`).
3. `publish`:
   - `const saved = stateRef.current.content` ngay trước upsert.
   - upsert kèm optimistic guard nếu row tồn tại: so `updated_at`. Nếu 0 row do mismatch → toast "Nội dung đã bị sửa ở nơi khác — reload trước khi lưu".
   - success → dispatch `MARK_PUBLISHED { content: saved, updatedAt: newUpdatedAt }`.
4. reducer `MARK_PUBLISHED`: `base = clone(a.content)`; `dirty = !equal(base, state.content)`; giữ nguyên `content`; cập nhật `updatedAt`.
5. Test: viết vitest cho reducer — MARK_PUBLISHED không revert content khi content ≠ snapshot; dirty tính đúng.
6. Verify tay: throttle network, Save rồi sửa Hero → sửa không bị mất.

## Todo
- [ ] stateRef + cập nhật mỗi render
- [ ] Lưu remote updated_at khi HYDRATE
- [ ] publish đọc snapshot mới nhất + optimistic guard
- [ ] MARK_PUBLISHED không overwrite content, tính dirty
- [ ] Toast cảnh báo conflict
- [ ] vitest reducer
- [ ] `npm run build` + `vitest` PASS

## Success criteria
Edit trong lúc Save được giữ; `dirty` đúng sau save; concurrent remote change bị phát hiện và cảnh báo, không ghi đè mù.

## Risk
- deepEqual toàn bộ content mỗi save = chi phí nhỏ, chấp nhận (1 row).
- Optimistic guard làm Save fail nếu `updated_at` lệch do timezone/precision. Mitig: so đúng giá trị string trả về từ HYDRATE, không tự tạo.

## Security
Không đổi tầng quyền (phase 01 lo). Chỉ đúng đắn dữ liệu.

## Next steps
Độc lập với 04/05/06.
