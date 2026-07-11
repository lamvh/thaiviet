# Migrate services to the project model — design

**Date:** 2026-07-08
**Status:** Approved design → ready for implementation plan

## Goal

Make **services** work exactly like **projects**: a fully CRUD-able, CMS-driven list where
each service is built from a fixed **template** the admin picks and fills. Remove the legacy
service "skin" system entirely. Every public service surface derives from one source of truth.

This mirrors the project model already shipped: `projects[]` is a CMS list, new projects are
created via a compose wizard (pick template → fill data → `project.page`), and card fields
derive from the template meta so the card and detail page never drift.

## Decisions (locked)

1. **Remove legacy skins entirely** — services become template-only, like projects.
2. **Fully CRUD** — admin adds/removes services via a table + compose wizard.
3. **Editable slugs** — service URLs stay human/SEO-friendly (`/services/interior`).
4. **Menu derives as a flat list** from the service list — retire static `SERVICE_LINKS`.
5. **Homepage "Our Services" cards derive from the service list** — retire `home.services.cards`.
6. **Duplicate** a dedicated service compose flow (do NOT generalize the project wizard) —
   zero risk to the working project flow.
7. **Slug editable on edit, with a warning** that changing it changes the page URL and breaks
   inbound links.

## Current state (why this is needed)

Services live in two worlds, hand-synced across four sources:

- `/services` grid ← hardcoded `SERVICES` (`src/data/services.ts`)
- Header dropdown + mobile menu ← static `SERVICE_LINKS` (`src/data/nav.ts`), grouped painting/speciality
- Footer services list ← `SERVICES` (unfiltered by visibility)
- Homepage "Our Services" cards ← `home.services.cards` (separate CMS block)
- `/services/:slug` detail ← `page` template **if applied**, else global `serviceStyle` skin (A–E)

The template path already exists (`serviceclassic`, layout A — a lossless mirror of Skin A) but
only interior + exterior are migrated; the other 6 still render via the skin. There is **no**
ServicesTable and **no** service compose wizard today — the only editor is a per-service
selector (`ServiceDetailsEditor`) that cannot add or remove services.

## Target data model

`serviceDetails[]` **keeps its content key** (no DB rename — honors "never rename a content key
without a migration path"). Its item shape is slimmed to match `Project`: card fields derived
from meta + a **required** templated `page`. All fat fields move into `page.values`.

```ts
interface ServiceItem {          // replaces the fat ServiceDetail
  slug: string;                  // identity + URL (editable, with warning)
  name: string;                  // menu label + card title  — derived from page.meta.name
  icon: string;                  // menu + card icon         — derived from page.meta.icon
  desc: string;                  // card blurb (= heroSub)   — derived from page.meta.heroSub
  image: string;                 // card image (= heroImg)   — derived from page.meta.heroImg
  visible?: boolean;
  page: ServicePage;             // NOW REQUIRED — the only content (templateId + meta + values)
}
```

`ServiceMeta` gains `slug` + `icon` so the wizard collects them and the card fields derive from
meta on publish (never drift). Deleted from the interface (now inside template sections):
`heroTitle, introA, introB, features, midEyebrow, midTitle, midImage, midParas, midList,
beforeImg, afterImg, gallery, showcase, quote, quoteName, quoteSub, paintPartners`.

## Single source of truth — surfaces derive from `serviceDetails[]`

| Surface | Today | After |
|---|---|---|
| `/services` grid (`ServicesPage`) | `SERVICES` | `serviceDetails` (visible) |
| Header dropdown (`ServicesDropdown`) + mobile menu (`Header`) | static `SERVICE_LINKS`, grouped | `serviceDetails` (visible), **flat** |
| Footer services list (`Footer`) | `SERVICES` (unfiltered) | `serviceDetails` (visible) |
| Homepage "Our Services" cards (`HomePage`) | `home.services.cards` | `serviceDetails` (visible) |
| `/services/:slug` (`ServiceDetailPage`) | `page` → else skin | `page` template **only** |

`HomeServices` keeps its heading/CTA copy (`title, ctaTitle, ctaText, ctaLabel`), loses the
`cards` array and its HomeEditor sub-editor. `ServiceCard` is kept (its `{icon,title,desc,slug}`
props all come from the slimmed item).

## Admin UX

- **`ServicesTable`** — clone of `ProjectsTable`, reusing the exported `VisPill`. Columns:
  thumbnail, name, slug, status (visibility toggle), actions (edit/delete). Header buttons:
  **New from template** (opens the service compose wizard).
- **Service compose wizard** — a duplicated, service-typed flow (own reducer slice
  `serviceCompose` + `ServiceComposeWizard/Picker/Form/Preview`). Pick `serviceclassic` → fill
  meta (slug, icon, name, hero, intro) + sections → live preview → **Add service**. Editing an
  existing service re-opens the wizard in place (`editingId`). The slug field is editable with
  an inline warning when changed on an existing service.
- **Sidebar** — a **Services** table entry (like "Projects"). The legacy `servicePages` /
  `ServiceStyleEditor` entries are removed.

Slug validation on publish: non-empty, lowercase URL-safe (`^[a-z0-9-]+$`), unique across
services. Reuse the project id-uniqueness helper pattern.

## Compose flow (duplicated, service-typed)

Add to the admin store, parallel to the project `compose` slice:

```ts
serviceCompose: {
  step: 'pick' | 'build';
  templateId: ServiceTemplateId | null;
  meta: ServiceMeta | null;
  values: Record<string, TemplateValue> | null;
  editingId: string | null;      // slug of the service being edited
}
```

Actions mirror the project ones (`SERVICE_COMPOSE_START/PICK/BACK/META/VALUE/EDIT/PUBLISH`).
On publish, derive card fields from meta: `name←meta.name, icon←meta.icon, desc←meta.heroSub,
image←meta.heroImg, slug←meta.slug`, and store `page = { templateId, meta, values }`. No
`category` field (services have no gallery filter).

New components (duplicated from `compose/`): `ServiceComposeWizard`, `ServiceTemplatePicker`,
`ServiceTemplateForm`, `ServiceTemplatePreview`. The form renders `ServiceMeta` fields (incl.
slug + icon) instead of `ProjectMeta`; the preview renders via `ServiceTemplateRenderer`.

## Data migration — back-fill legacy rows at load

`serviceclassic` is a lossless mirror of Skin A, so all 8 legacy entries convert cleanly.

- **Bundled default** (`src/content/site-content.json`): rewrite so every `serviceDetails` entry
  has a `page` filled from its fat fields, and carries `slug/name/icon/desc/image/visible`.
  Remove the top-level `serviceStyle` key.
- **Live DB rows** (`withContentDefaults`): add a `migrateServices()` step — any `serviceDetails`
  entry lacking `page` gets one synthesized from its legacy fat fields (reuse
  `serviceMetaFromDetail` for meta + a field→values mapper: `features/approach/ba/showcase/
  quote/author`). Old rows then render correctly **before** any republish; the next admin Save
  persists the clean shape. Leftover `serviceStyle` on old rows is ignored (blob content) — no
  destructive DB step required.

The icon for migrated entries comes from the matching legacy `SERVICES` entry (mapped by slug)
so existing icons are preserved; fall back to a default Material Symbol if absent.

## Rendering changes

`ServiceDetailPage`: find service by slug → redirect to `/services` if missing or hidden →
render `page` via `ServiceTemplateRenderer`. The `serviceStyle`-skin fallback branch is deleted.
(Because migration guarantees every entry has a `page`, the template path always resolves.)

## Files

**Delete:**
- `src/data/services.ts`
- `src/components/services/service-skins.tsx`, `ServiceSkinA.tsx`, `ServiceSkinB.tsx`, `BeforeAfter.tsx`
- `src/pages/admin/sections/ServiceStyleEditor.tsx`
- `src/pages/admin/sections/ServiceDetailsEditor.tsx`
- `SERVICE_LINKS` block in `src/data/nav.ts`
- `ServiceStyleId` type + `serviceStyle` field/action/schema/JSON

**Change:**
- `src/lib/types.ts` — slim `ServiceDetail`→`ServiceItem`, remove `Service`, `ServiceStyleId`; extend `ServiceMeta` (`slug`, `icon`)
- `src/lib/templates/types.ts` — `ServiceMeta` gains `slug` + `icon`
- `src/lib/templates/service-templates.ts` — add `slug`/`icon` to `serviceclassic.defaultMeta`
- `src/lib/templates/service-prefill.ts` — include `slug`/`icon` in prefill
- `src/lib/content-defaults.ts` — add `migrateServices()`
- `src/lib/content-schema.ts` — drop `serviceStyle`; validate `serviceDetails` as template items (slug format/uniqueness, required `page`, `https://` image)
- `src/pages/admin/useAdminContent.ts` — drop `serviceStyle`; `serviceDetails: ServiceItem[]`; add `services` table section, drop `servicePages`
- `src/pages/admin/admin-content-store.tsx` — add service CRUD (add/delete/toggle) + `serviceCompose` slice/actions; remove `SET_SERVICE_STYLE`, `applyServiceTemplate`, `clearServiceTemplate`, `updateServicePage*`, `updateServiceDetails`
- `src/pages/admin/AdminSidebar.tsx` — Services table entry; remove servicePages
- `src/pages/admin/AdminPage.tsx` — wire ServicesTable + ServiceComposeWizard + META
- `src/pages/ServiceDetailPage.tsx` — template-only render
- `src/pages/ServicesPage.tsx` — source grid from `serviceDetails`
- `src/components/layout/Footer.tsx` — source from `serviceDetails`, filter by visibility
- `src/components/layout/Header.tsx` + `ServicesDropdown.tsx` — flat menu from `serviceDetails`
- `src/pages/HomePage.tsx` — service cards from `serviceDetails`
- `src/pages/admin/sections/HomeEditor.tsx` (+ `HomeServices` type) — drop `cards` sub-editor
- `src/content/site-content.json` — migrate serviceDetails, drop serviceStyle & home.services.cards

**Create:**
- `src/pages/admin/sections/ServicesTable.tsx`
- `src/pages/admin/sections/service-compose/ServiceComposeWizard.tsx`, `ServiceTemplatePicker.tsx`, `ServiceTemplateForm.tsx`, `ServiceTemplatePreview.tsx`

**Keep (already template-aligned):** `src/lib/service-visibility.ts`,
`src/components/templates/ServiceTemplateRenderer.tsx`,
`src/components/templates/service-skins-templated.tsx` +
`service-template-layouts/`, `src/components/cards/ServiceCard.tsx`.

## Testing

- `migrateServices()` — legacy fat entry → `{slug,name,icon,desc,image,page}`; idempotent on
  already-migrated entries; icon back-fill by slug.
- Service compose reducer — start/pick/meta/value/edit/publish; card fields derived from meta.
- Slug validation — format, uniqueness, empty.
- Visibility — keep `service-visibility.ts` + test; verify all four surfaces filter.
- Delete/retarget obsolete tests: `service-templates`, `service-prefill`, `validate-service-page`
  updated for new meta; skin tests removed.
- `npm run build` (tsc strict + vite) must pass.

## Docs

- Update `README.md`: routes, component tree, content-block map (services now CMS-CRUD +
  template-only; menu/footer/home-cards derive from the list; `serviceStyle` & `home.services.cards`
  removed).
- The project CLAUDE.md "keep docs + dashboard in sync" rule is inherently satisfied — this work
  *is* the dashboard wiring.

## Part 2 — Service page template layouts (from the Claude design)

Build the full **A–F** service-layout family so the migrated "pick a template → fill data" flow
has real choices (today only Classic/A is real; B–E are placeholders aliased to Classic).

**Design source & caveat.** Reference is the Claude design project
`5923c23a-5fef-4b8c-99b9-2e74cdd09651`, file `ThaiViet Home.dc.html` (read via the `DesignSync`
MCP; decoded copy on disk during impl). The *current live* file has been trimmed to a single
"Project Detail Pages" template section (one project-detail frame + the Services page). The
richer six-option gallery came from a 2026-07-01 cached snapshot and is cross-checked against the
repo's existing `project-layouts` (A/B/D/E/F) + `ServiceSkinB` (dark), which encode the same
family. We treat those as the visual reference; brand tokens come from the repo's
`tailwind.config.js`, not the design's inline CSS.

**Layouts** (each a dedicated `ServiceLayout<X>.tsx` over the shared service content shape —
`features / approach / before-after / showcase / quote` — with hero/facts/CTA scaffolding in
`service-template-layouts/shared.tsx`; **service-specific**, no coupling to project layouts):

| Id | Name | Treatment |
|---|---|---|
| A | Classic | Full-bleed hero → what's-included split → approach → before/after → showcase → testimonial (exists; polish to design) |
| B | Sidebar | Compact hero → sticky facts/CTA aside (`320px 1fr`) + content column |
| C | Cinematic / Dark | `#1c1c19` frame, inverted nav, centered title, before/after pairs (AFTER ring), dark stats strip |
| D | Process timeline | 2-col hero → vertical numbered timeline (rail + nodes) → red CTA band |
| E | Bento mosaic | Simple hero → 4-col `auto-rows` bento grid mixing image/stat/text tiles → testimonial band |
| F | Minimal centered | White frame, narrow centered reading column, wide 16:9 image, ruled quote |

**Wiring**
- `ServiceStyleId` expands `'A'|'B'|'C'|'D'|'E'` → **`'A'|'B'|'C'|'D'|'E'|'F'`** (matches `ProjectStyleId`).
- `serviceTemplateLayouts` (in `service-skins-templated.tsx`): map A→Classic, B→Sidebar, C→Cinematic,
  D→Timeline, E→Bento, F→Minimal; flip all six `ready:true` in `SERVICE_TEMPLATE_LAYOUT_META`.
- `serviceTemplateList`: six template defs (one per layout), each with picker card
  (`name/icon/desc/includes`), pinned `layout`, `defaultMeta`, and the shared `sections[]`
  (all six reuse the same service sections; they differ only in layout + card meta — mirrors how
  project sidebar/bento/minimal share section structure). `ServiceTemplateId` union expands to the six ids.
- The service compose picker shows all six cards; the live preview renders via `ServiceTemplateRenderer`.

**Create:** `src/components/templates/service-template-layouts/ServiceLayoutSidebar.tsx`,
`ServiceLayoutCinematic.tsx`, `ServiceLayoutTimeline.tsx`, `ServiceLayoutBento.tsx`,
`ServiceLayoutMinimal.tsx` (+ extend `shared.tsx`). **Change:** `service-skins-templated.tsx`,
`service-templates.ts`, `templates/types.ts` (`ServiceStyleId`, `ServiceTemplateId`),
`validate-page.ts` (accept the six ids). **Tests:** each layout renders its distinctive wrapper;
`serviceTemplateList` covers all six ids; picker lists six.

## Open questions

None.
