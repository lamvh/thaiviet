# Supabase Content Backend — Design

**Date:** 2026-06-30
**Status:** Approved (pending spec review)
**Topic:** Connect the public site and `/admin` dashboard to a Supabase database, deployed on Vercel.

## Problem

The site is a static Vite + React SPA on Vercel. Content lives in a single
build-time file (`src/content/site-content.json`) imported as constants. The
`/admin` dashboard edits a local copy and "publishes" by committing that JSON
back to GitHub via the REST API using a Personal Access Token in `localStorage`;
each commit triggers a rebuild.

The owner wants to edit content in `/admin` and have changes persist and appear
on the live Vercel site **immediately**, without the GitHub-commit rebuild cycle.

## Goal

- Content read from a database at runtime so admin edits are live without a rebuild.
- Admin writes protected by a real login.
- Keep the existing custom `/admin` UI; swap only the persistence layer.
- Stays a static Vercel deploy (no serverless functions).

## Decisions (locked)

- **Backend:** Supabase (managed Postgres + Auth + auto API). Browser talks to
  Supabase directly via `@supabase/supabase-js`. No Vercel serverless functions.
- **Data model:** single JSON document — one table `site_content`, one row whose
  `data jsonb` holds the entire `SiteContent` object (same shape as today's
  `site-content.json`). Mirrors current code 1:1.
- **Read path:** hybrid fallback — bundled `site-content.json` is the instant
  first paint / offline fallback; live Supabase data swaps in once fetched.
- **Admin auth:** Supabase email/password login gate on `/admin`. One owner
  account created in the Supabase dashboard. No public signups.
- **Out of scope (YAGNI):** persisting contact-form submissions and chat
  messages (stay mocked); normalizing content into per-entity tables.

## Architecture

```
Public site        ──SELECT data───────────►  Supabase (Postgres + Auth)
/admin (logged in) ──UPDATE data───────────►  Supabase (RLS: writes require auth)
Vercel = static build host only
```

### Database (Supabase)

Table `site_content`:

| column       | type          | notes                          |
|--------------|---------------|--------------------------------|
| `id`         | `int` PK      | always `1` (singleton row)     |
| `data`       | `jsonb`       | full `{hero,projects,posts,areas,contact}` |
| `updated_at` | `timestamptz` | set on each write              |

- **Seed:** one-time insert of the current `site-content.json` as row 1.
- **RLS:** enabled.
  - `SELECT`: allowed for `anon` + `authenticated` (public read).
  - `UPDATE`: allowed for `authenticated` only.
  - No `INSERT`/`DELETE` policies (singleton row is fixed).
- **Auth:** Supabase email/password. Owner account created manually in the
  Supabase dashboard; signups disabled.

### Public read path

- `src/lib/supabase.ts` — Supabase client built from env vars.
- `SiteContentProvider` + `useSiteContent()` hook mounted at the app root.
  - Initial value = bundled `site-content.json` (instant paint, offline fallback).
  - On mount, fetch row 1; on success, swap in the live `data`.
- `src/data/*` adapters change from `export const HERO = content.hero` to reading
  from `useSiteContent()`. Every page consuming `HERO`, `PROJECTS`, `POSTS`,
  `AREAS`, `CONTACT` reads from context instead of a static import. Mechanical but
  touches all public pages.

### Admin write path + auth

- `/admin` gains a login gate: not authenticated → login form; authenticated →
  existing dashboard + logout control.
- Admin store (`admin-content-store.tsx`) stays almost entirely as-is. Only the
  publish layer changes:
  - `publish()` runs `UPDATE site_content SET data=…, updated_at=now() WHERE id=1`
    instead of a GitHub commit.
  - Keep `validateContent()` before writing.
  - Conflict guard: compare `updated_at` (or simplify, since it's now a single
    authoritative store). Never silently clobber a newer remote write.
- "Publish" → "Save"; changes are live immediately.

### Config & deploy

- Env vars (client-safe; RLS protects writes):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
- Local: `.env` (gitignored). Provide `.env.example` with the var names.
- Vercel: set both in Project Settings → Environment Variables.
- Deploy stays the standard Vercel static build; existing `vercel.json` SPA
  rewrite is correct.

### Removed

- `src/lib/github-api.ts`, `src/lib/pat-store.ts`, `src/lib/base64.ts`.
- PAT entry in `SettingsPanel.tsx`.
- New dependency: `@supabase/supabase-js`.

## Acceptance criteria

- `site_content` table exists with RLS; anon can read, only authenticated can write.
- Public site renders bundled content instantly, then reflects live Supabase data.
- If Supabase is unreachable, the site still renders the bundled fallback.
- `/admin` requires login; logged-out users see a login form and cannot write.
- Editing + Save in `/admin` updates Supabase and the change appears on the public
  site without a rebuild.
- Invalid content is blocked by `validateContent()` before any write.
- No PAT / GitHub-commit code paths remain.
- `tsc` + `npm run build` clean; deploys to Vercel with env vars set.

## Risks

- **Publishable key is in the client bundle** — expected and safe; security rests
  entirely on RLS. Verify `UPDATE` is denied for `anon` before shipping.
- **Read-path refactor breadth** — converting every `data/*` consumer from static
  import to hook is the largest change; mechanical but wide. Hybrid fallback keeps
  a blast-radius escape hatch (bundled JSON still renders).
- **Single owner account** — credentials managed in Supabase dashboard; document
  rotation. No password reset UI in scope.

## Open questions

None.
