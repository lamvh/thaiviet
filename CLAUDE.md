# CLAUDE.md — ThaiViet site

Project-specific instructions. These override default behavior; follow them exactly.

## Working rules

### Rule: keep docs + dashboard in sync with every change

Whenever you add or change a **feature**, a **screen/page**, or make any **major change**, you MUST — in the same task — also:

1. **Update the documentation.** Reflect the change in `README.md` (routes, component tree, content-block map) and in `docs/` if a relevant doc exists. New route → list it. New/renamed page → update the page list. New content block → note where it lives and which admin section edits it.

2. **Wire the change into the admin dashboard (CMS).** Public content must be editable from `/admin`, not hardcoded. When you add or change a page/section whose content the client would want to edit, add the matching CMS plumbing following the existing pattern:
   - `src/lib/types.ts` — content types
   - `src/pages/admin/useAdminContent.ts` — add the field to `SiteContent`
   - `src/content/site-content.json` — default content (the always-valid fallback shape)
   - `src/lib/content-schema.ts` — validation (e.g. `https://` image checks)
   - `src/pages/admin/admin-content-store.tsx` — reducer action + `update*` helper
   - `src/pages/admin/sections/*Editor.tsx` — the editor UI (reuse `homepage-editor-primitives`)
   - `src/pages/admin/AdminSidebar.tsx` + `AdminPage.tsx` — register the section (sidebar entry, `META`, render)

   Reuse existing editor primitives (`Card`, `Field`, `StringList`, `ItemCard`, `AddButton`). Prefer pulling shared data from existing content (e.g. featured projects read from `projects`) over duplicating it.

**Definition of done for any feature/screen change = code + docs updated + dashboard wired.** Do not consider the task complete until all three are done. If wiring to the dashboard is intentionally skipped, say so explicitly and why.

## Build / verify

- `npm run build` runs `tsc` (strict) + `vite build`. A change is not done until this passes.
- Content edits belong in `src/content/site-content.json` (bundled default) and are merged over the live Supabase row via `withContentDefaults` — older DB rows fall back to defaults, so never rename a content key without a migration path.
